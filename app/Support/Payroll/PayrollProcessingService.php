<?php

namespace App\Support\Payroll;

use App\Models\Employee;
use App\Models\EmployeePayrollProfile;
use App\Models\PayrollPeriod;
use App\Models\PayrollRun;
use App\Models\PayrollStatutorySummary;
use App\Models\Timesheet;
use App\Models\User;
use App\Support\Audit\AuditContext;
use App\Support\Audit\AuditLogger;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PayrollProcessingService
{
    public function __construct(
        private readonly PayrollCatalogueSynchronizer $catalogueSynchronizer,
        private readonly PayrollCalculationService $calculationService,
        private readonly PayrollSettlementService $settlementService,
        private readonly AuditLogger $auditLogger,
    ) {
    }

    public function process(PayrollPeriod $period, User $actor): PayrollRun
    {
        if ($period->status === 'CLOSED') {
            throw ValidationException::withMessages([
                'period' => 'Closed payroll periods cannot be processed again until they are reopened.',
            ]);
        }

        $organizationId = (int) $period->organization_id;
        $payCodes = $this->catalogueSynchronizer->sync($organizationId)->keyBy('code');

        $periodDate = optional($period->period_end)->toDateString() ?: now()->toDateString();
        $profiles = EmployeePayrollProfile::query()
            ->forOrganization($organizationId)
            ->with(['employee.orgUnit', 'employee.position', 'employee.location'])
            ->where('active', true)
            ->where('employment_status', 'ACTIVE')
            ->effectiveFor($periodDate)
            ->orderByDesc('effective_from')
            ->get()
            ->unique('employee_id')
            ->keyBy('employee_id');

        if ($profiles->isEmpty()) {
            throw ValidationException::withMessages([
                'period' => 'No active employee payroll profiles are available for the selected period.',
            ]);
        }

        return DB::transaction(function () use ($period, $actor, $payCodes, $profiles, $organizationId) {
            $runNumber = ((int) PayrollRun::query()
                ->withoutGlobalScopes()
                ->where('organization_id', $organizationId)
                ->where('payroll_period_id', $period->id)
                ->max('run_number')) + 1;

            $run = PayrollRun::query()->create([
                'organization_id' => $organizationId,
                'payroll_period_id' => $period->id,
                'run_number' => $runNumber,
                'status' => 'PROCESSED',
                'processed_at' => now(),
                'processed_by' => $actor->id,
                'employee_count' => 0,
                'gross_total' => 0,
                'taxable_total' => 0,
                'deduction_total' => 0,
                'net_total' => 0,
                'summary_json' => [],
            ]);

            $grossTotal = 0.0;
            $taxableTotal = 0.0;
            $deductionTotal = 0.0;
            $netTotal = 0.0;
            $processedEmployees = 0;
            $statutoryTotals = [];
            $settlementTotals = [];

            foreach ($profiles as $employeeId => $profile) {
                $employee = $profile->employee;

                if (! $employee instanceof Employee || $employee->status !== 'ACTIVE') {
                    continue;
                }

                $recurringItems = $profile->recurringItems()
                    ->with('payCode')
                    ->where('is_active', true)
                    ->effectiveFor(optional($period->period_end)->toDateString() ?: now()->toDateString())
                    ->get();

                $inputs = $period->inputs()
                    ->with('payCode')
                    ->where('employee_id', $employeeId)
                    ->get();

                $timesheets = Timesheet::query()
                    ->forOrganization($organizationId)
                    ->where('employee_id', $employeeId)
                    ->whereIn('status', ['Approved', 'APPROVED'])
                    ->whereDate('period_start', '>=', $period->period_start)
                    ->whereDate('period_end', '<=', $period->period_end)
                    ->get();

                $calculated = $this->calculationService->calculate(
                    $employee,
                    $profile,
                    $period,
                    $payCodes,
                    $recurringItems,
                    $inputs,
                    $timesheets,
                );

                $result = $run->results()->create([
                    'organization_id' => $organizationId,
                    'payroll_period_id' => $period->id,
                    'employee_id' => $employeeId,
                    'employee_payroll_profile_id' => $profile->id,
                    ...$calculated['result'],
                ]);

                $result->lines()->createMany(
                    collect($calculated['lines'])
                        ->map(fn (array $line) => [
                            'organization_id' => $organizationId,
                            ...$line,
                        ])
                        ->all()
                );

                $settlements = $this->settlementService->allocate(
                    $profile->loadMissing('settlementRules'),
                    $period->loadMissing('exchangeRates'),
                    (float) $result->net_pay,
                );

                $result->settlements()->createMany(
                    collect($settlements)
                        ->map(function (array $settlement) use ($organizationId, $run, $period) {
                            return [
                                'organization_id' => $organizationId,
                                'payroll_run_id' => $run->id,
                                'payroll_period_id' => $period->id,
                                ...$settlement,
                            ];
                        })
                        ->all()
                );

                $processedEmployees++;
                $grossTotal += (float) $result->gross_pay;
                $taxableTotal += (float) $result->taxable_income;
                $deductionTotal += (float) $result->total_deductions;
                $netTotal += (float) $result->net_pay;

                foreach ($settlements as $settlement) {
                    $currency = (string) $settlement['currency'];

                    if (! isset($settlementTotals[$currency])) {
                        $settlementTotals[$currency] = [
                            'currency' => $currency,
                            'base_total' => 0.0,
                            'settlement_total' => 0.0,
                            'employee_ids' => [],
                        ];
                    }

                    $settlementTotals[$currency]['base_total'] += (float) $settlement['base_amount'];
                    $settlementTotals[$currency]['settlement_total'] += (float) $settlement['settlement_amount'];
                    $settlementTotals[$currency]['employee_ids'][$employeeId] = true;
                }

                foreach ($calculated['lines'] as $line) {
                    if (($line['category'] ?? null) !== 'STATUTORY') {
                        continue;
                    }

                    $code = (string) $line['code_snapshot'];

                    if (! isset($statutoryTotals[$code])) {
                        $statutoryTotals[$code] = [
                            'description' => (string) $line['description_snapshot'],
                            'employee_ids' => [],
                            'total_amount' => 0.0,
                        ];
                    }

                    $statutoryTotals[$code]['employee_ids'][$employeeId] = true;
                    $statutoryTotals[$code]['total_amount'] += (float) $line['amount'];
                }
            }

            foreach ($statutoryTotals as $code => $summary) {
                PayrollStatutorySummary::query()->create([
                    'organization_id' => $organizationId,
                    'payroll_run_id' => $run->id,
                    'payroll_period_id' => $period->id,
                    'code' => $code,
                    'description' => $summary['description'],
                    'employee_count' => count($summary['employee_ids']),
                    'total_amount' => round((float) $summary['total_amount'], 2),
                    'metadata' => [
                        'generated_at' => now()->toDateTimeString(),
                    ],
                ]);
            }

            AuditContext::withoutAuditing(function () use ($period, $run, $actor, $processedEmployees, $grossTotal, $taxableTotal, $deductionTotal, $netTotal, $settlementTotals): void {
                $run->update([
                    'employee_count' => $processedEmployees,
                    'gross_total' => round($grossTotal, 2),
                    'taxable_total' => round($taxableTotal, 2),
                    'deduction_total' => round($deductionTotal, 2),
                    'net_total' => round($netTotal, 2),
                    'summary_json' => [
                        'employee_count' => $processedEmployees,
                        'gross_total' => round($grossTotal, 2),
                        'taxable_total' => round($taxableTotal, 2),
                        'deduction_total' => round($deductionTotal, 2),
                        'net_total' => round($netTotal, 2),
                        'settlement_totals' => collect($settlementTotals)
                            ->map(fn (array $summary) => [
                                'currency' => $summary['currency'],
                                'employee_count' => count($summary['employee_ids']),
                                'base_total' => round((float) $summary['base_total'], 2),
                                'settlement_total' => round((float) $summary['settlement_total'], 2),
                            ])
                            ->values()
                            ->all(),
                    ],
                ]);

                $period->update([
                    'status' => 'PROCESSED',
                    'processed_at' => now(),
                    'processed_by' => $actor->id,
                    'approved_at' => null,
                    'approved_by' => null,
                    'closed_at' => null,
                    'closed_by' => null,
                ]);
            });

            $this->auditLogger->logCustom('process', $period, [
                'module' => 'payroll',
                'category' => 'workflow',
                'description' => 'Processed payroll period and generated a payroll run.',
                'organization_id' => $organizationId,
                'new_values' => [
                    'status' => 'PROCESSED',
                    'run_id' => $run->id,
                    'run_number' => $run->run_number,
                    'employee_count' => $processedEmployees,
                    'gross_total' => round($grossTotal, 2),
                    'deduction_total' => round($deductionTotal, 2),
                    'net_total' => round($netTotal, 2),
                    'settlement_totals' => collect($settlementTotals)
                        ->map(fn (array $summary) => [
                            'currency' => $summary['currency'],
                            'employee_count' => count($summary['employee_ids']),
                            'base_total' => round((float) $summary['base_total'], 2),
                            'settlement_total' => round((float) $summary['settlement_total'], 2),
                        ])
                        ->values()
                        ->all(),
                ],
                'metadata' => [
                    'payroll_run_id' => $run->id,
                    'payroll_run_number' => $run->run_number,
                ],
            ]);

            return $run->load(['results.lines', 'statutorySummaries']);
        });
    }

    public function approve(PayrollPeriod $period, User $actor): PayrollRun
    {
        $run = $this->latestRun($period);

        if (! $run || ! in_array($run->status, ['PROCESSED', 'APPROVED'], true)) {
            throw ValidationException::withMessages([
                'period' => 'The selected period does not have a processed payroll run ready for approval.',
            ]);
        }

        AuditContext::withoutAuditing(function () use ($period, $run, $actor): void {
            $run->update([
                'status' => 'APPROVED',
                'approved_at' => now(),
                'approved_by' => $actor->id,
            ]);

            $period->update([
                'status' => 'APPROVED',
                'approved_at' => now(),
                'approved_by' => $actor->id,
                'closed_at' => null,
                'closed_by' => null,
            ]);
        });

        $this->auditLogger->logCustom('approve', $period, [
            'module' => 'payroll',
            'category' => 'workflow',
            'description' => 'Approved payroll period.',
            'organization_id' => $period->organization_id,
            'metadata' => [
                'payroll_run_id' => $run->id,
                'payroll_run_number' => $run->run_number,
            ],
        ]);

        return $run->fresh();
    }

    public function close(PayrollPeriod $period, User $actor): PayrollRun
    {
        $run = $this->latestRun($period);

        if (! $run || ! in_array($run->status, ['PROCESSED', 'APPROVED', 'CLOSED'], true)) {
            throw ValidationException::withMessages([
                'period' => 'The selected period does not have a payroll run that can be closed.',
            ]);
        }

        AuditContext::withoutAuditing(function () use ($period, $run, $actor): void {
            $run->update([
                'status' => 'CLOSED',
                'closed_at' => now(),
                'closed_by' => $actor->id,
            ]);

            $period->update([
                'status' => 'CLOSED',
                'closed_at' => now(),
                'closed_by' => $actor->id,
            ]);
        });

        $this->auditLogger->logCustom('close', $period, [
            'module' => 'payroll',
            'category' => 'workflow',
            'description' => 'Closed payroll period.',
            'organization_id' => $period->organization_id,
            'metadata' => [
                'payroll_run_id' => $run->id,
                'payroll_run_number' => $run->run_number,
            ],
        ]);

        return $run->fresh();
    }

    public function reopen(PayrollPeriod $period, User $actor): PayrollPeriod
    {
        if ($period->status === 'DRAFT') {
            return $period;
        }

        AuditContext::withoutAuditing(function () use ($period): void {
            $period->update([
                'status' => 'DRAFT',
                'processed_at' => null,
                'processed_by' => null,
                'approved_at' => null,
                'approved_by' => null,
                'closed_at' => null,
                'closed_by' => null,
            ]);
        });

        $this->auditLogger->logCustom('reopen', $period, [
            'module' => 'payroll',
            'category' => 'workflow',
            'description' => 'Reopened payroll period for recalculation.',
            'organization_id' => $period->organization_id,
            'actor' => $actor,
        ]);

        return $period->fresh();
    }

    public function latestRun(PayrollPeriod $period): ?PayrollRun
    {
        return PayrollRun::query()
            ->forOrganization($period->organization_id)
            ->where('payroll_period_id', $period->id)
            ->orderByDesc('run_number')
            ->first();
    }
}
