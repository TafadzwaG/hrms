<?php

namespace App\Support\Payroll;

use App\Models\Employee;
use App\Models\EmployeePayrollProfile;
use App\Models\EmployeeRecurringPayItem;
use App\Models\PayCode;
use App\Models\PayrollInput;
use App\Models\PayrollPeriod;
use App\Models\Timesheet;
use Illuminate\Support\Collection;

class PayrollCalculationService
{
    public function __construct(
        private readonly PayrollTaxService $taxService,
    ) {
    }

    public function calculate(
        Employee $employee,
        EmployeePayrollProfile $profile,
        PayrollPeriod $period,
        Collection $payCodes,
        Collection $recurringItems,
        Collection $inputs,
        Collection $timesheets,
        array $ytd = [],
    ): array {
        $lines = collect();
        $generatedCodes = collect();

        $this->addBasicLine($lines, $payCodes, $profile);
        $this->addRecurringLines($lines, $recurringItems);
        $this->addInputLines($lines, $inputs);
        $this->addOvertimeLine($lines, $payCodes, $profile, $timesheets);

        $lines = $lines
            ->filter(fn (array $line) => round((float) $line['amount'], 2) !== 0.0)
            ->values();

        $existingCodes = $lines->pluck('code_snapshot')->filter()->unique()->values();

        $this->appendGeneratedStatutoryLine(
            $lines,
            $payCodes,
            'PENS',
            (float) $profile->pension_percent,
            (float) $profile->basic_salary,
            $existingCodes,
            $generatedCodes,
            ['source' => 'SYSTEM_PROFILE_PERCENT'],
        );

        $this->appendGeneratedStatutoryLine(
            $lines,
            $payCodes,
            'NSSA',
            (float) $profile->nssa_percent,
            min((float) $this->grossFromLines($lines), (float) config('payroll.statutory.nssa.cap', 0)),
            $existingCodes,
            $generatedCodes,
            ['source' => 'SYSTEM_PROFILE_PERCENT'],
        );

        $this->appendGeneratedStatutoryLine(
            $lines,
            $payCodes,
            'NEC',
            (float) $profile->nec_percent,
            (float) $this->grossFromLines($lines),
            $existingCodes,
            $generatedCodes,
            ['source' => 'SYSTEM_PROFILE_PERCENT'],
        );

        // Union dues are a percentage of basic salary and reduce taxable income.
        $this->appendGeneratedStatutoryLine(
            $lines,
            $payCodes,
            'UNION',
            (float) $profile->union_percent,
            (float) $profile->basic_salary,
            $existingCodes,
            $generatedCodes,
            ['source' => 'SYSTEM_PROFILE_PERCENT'],
        );

        $grossPay = $this->grossFromLines($lines);
        $preTaxDeductions = $this->sumLines($lines, fn (array $line) => $line['type'] === 'DEDUCTION' && ($line['is_pre_tax'] ?? false));

        // Split earnings by how FDS treats them: bonuses and other irregular pay are not annualised.
        $isEarning = fn (array $line) => $line['type'] === 'EARNING' && ($line['affects_gross'] ?? false);
        $bonusGross = $this->sumLines($lines, fn (array $line) => $isEarning($line) && ($line['income_type'] ?? 'REGULAR') === 'BONUS');
        $irregularGross = $this->sumLines($lines, fn (array $line) => $isEarning($line) && ($line['income_type'] ?? 'REGULAR') === 'IRREGULAR');
        $medicalContributions = $this->sumLines($lines, fn (array $line) => $line['type'] === 'DEDUCTION' && ($line['tax_credit'] ?? null) === 'MEDICAL');
        $regularTaxable = round($grossPay - $bonusGross - $irregularGross - $preTaxDeductions, 2);

        $taxableIncome = max(0, round($grossPay - $preTaxDeductions, 2));
        $taxWarnings = [];
        $ledger = null;

        if ((bool) $profile->tax_enabled && ! $existingCodes->contains('PAYE')) {
            $payeCode = $payCodes->get('PAYE');

            if ($payeCode instanceof PayCode) {
                $tax = $this->taxService->assess([
                    'currency' => (string) ($profile->currency ?: $period->currency ?: config('payroll.default_currency', 'USD')),
                    'frequency' => (string) ($period->frequency ?: 'MONTHLY'),
                    'date' => optional($period->period_end)->toDateString() ?: now()->toDateString(),
                    'organization_id' => (int) $period->organization_id ?: null,
                    'tax_method' => (string) ($profile->tax_method ?: PayrollTaxService::METHOD_NON_FDS),
                    'credit_elderly' => (bool) $profile->tax_credit_elderly,
                    'credit_blind' => (bool) $profile->tax_credit_blind,
                    'credit_disabled' => (bool) $profile->tax_credit_disabled,
                    'regular_taxable' => $regularTaxable,
                    'irregular' => $irregularGross,
                    'bonus' => $bonusGross,
                    'medical' => $medicalContributions,
                ], $ytd);

                $taxWarnings = $tax['warnings'];
                $taxableIncome = $tax['taxable_income'];

                $taxMetadata = [
                    'taxable_income' => $taxableIncome,
                    'tax_method' => $tax['method_applied'],
                    'tax_table_id' => $tax['tax_table_id'],
                    'tax_table' => $tax['tax_table'],
                    'tax_table_verified' => $tax['tax_table_verified'],
                    'bonus_exempt' => $tax['bonus_exempt'],
                    'credits_applied' => $tax['credits_applied'],
                ];

                // Under FDS a period can carry a refund, so a negative amount is kept.
                if (round($tax['paye'], 2) !== 0.0) {
                    $lines->push($this->makeLine($payeCode, [
                        'amount' => $tax['paye'],
                        'input_source' => 'SYSTEM_TAX',
                        'metadata' => [
                            'source' => $tax['fallback'] ? 'PAYE_BANDS_LEGACY' : 'PAYE_TAX_TABLE',
                            ...$taxMetadata,
                        ],
                    ]));
                }

                $levyCode = $payCodes->get('AIDS');

                if ($levyCode instanceof PayCode && round($tax['aids_levy'], 2) !== 0.0 && ! $existingCodes->contains('AIDS')) {
                    $lines->push($this->makeLine($levyCode, [
                        'amount' => $tax['aids_levy'],
                        'input_source' => 'SYSTEM_TAX',
                        'metadata' => [
                            'source' => 'AIDS_LEVY',
                            'percent' => $tax['aids_levy_percent'],
                            ...$taxMetadata,
                        ],
                    ]));
                }

                $ledger = [
                    'tax_method' => $tax['method_applied'],
                    'regular_taxable' => $tax['regular_taxable'],
                    'irregular_taxable' => $tax['irregular_taxable'],
                    'bonus_gross' => $bonusGross,
                    'bonus_exempt' => $tax['bonus_exempt'],
                    'medical_contributions' => $medicalContributions,
                    'credits_applied' => $tax['credits_applied'],
                    'paye' => $tax['paye'],
                    'aids_levy' => $levyCode instanceof PayCode ? $tax['aids_levy'] : 0,
                    'standalone_paye' => $tax['standalone_paye'],
                    'standalone_aids_levy' => $tax['standalone_aids_levy'],
                    'fds_average_paye' => $tax['fds_average_paye'],
                    'fds_average_aids_levy' => $tax['fds_average_aids_levy'],
                ];
            }
        }

        $lines = $lines->sortBy([
            ['sort_order', 'asc'],
            ['code_snapshot', 'asc'],
        ])->values();

        $totalDeductions = $this->sumLines($lines, fn (array $line) => $line['type'] === 'DEDUCTION');
        $taxAmount = $this->sumLines($lines, fn (array $line) => $line['type'] === 'DEDUCTION' && (($line['category'] ?? null) === 'TAX' || ($line['code_snapshot'] ?? null) === 'PAYE'));
        $statutoryDeductions = $this->sumLines($lines, fn (array $line) => ($line['category'] ?? null) === 'STATUTORY');
        $voluntaryDeductions = max(0, round($totalDeductions - $taxAmount - $statutoryDeductions, 2));
        $netPay = max(0, round($grossPay - $totalDeductions, 2));

        return [
            'tax_warnings' => $taxWarnings,
            'ledger' => $ledger,
            'result' => [
                'staff_number_snapshot' => $employee->staff_number,
                'employee_name_snapshot' => $employee->full_name,
                'department_snapshot' => $employee->orgUnit?->name,
                'position_snapshot' => $employee->position?->name,
                'pay_point_snapshot' => $employee->pay_point,
                'currency_snapshot' => $profile->currency,
                'bank_account_name_snapshot' => $profile->bank_account_name,
                'bank_account_number_snapshot' => $profile->bank_account_number,
                'bank_name_snapshot' => $profile->bank_name,
                'tax_number_snapshot' => $profile->tax_number,
                'basic_salary_snapshot' => round((float) $profile->basic_salary, 2),
                'gross_pay' => $grossPay,
                'pre_tax_deductions' => $preTaxDeductions,
                'taxable_income' => $taxableIncome,
                'tax_amount' => $taxAmount,
                'statutory_deductions' => $statutoryDeductions,
                'voluntary_deductions' => $voluntaryDeductions,
                'total_deductions' => $totalDeductions,
                'net_pay' => $netPay,
                'status' => 'PROCESSED',
                'snapshot' => [
                    'employee' => [
                        'id' => $employee->id,
                        'staff_number' => $employee->staff_number,
                        'full_name' => $employee->full_name,
                    ],
                    'profile' => [
                        'id' => $profile->id,
                        'effective_from' => optional($profile->effective_from)->toDateString(),
                        'effective_to' => optional($profile->effective_to)->toDateString(),
                        'basic_salary' => round((float) $profile->basic_salary, 2),
                        'currency' => $profile->currency,
                    ],
                    'period' => [
                        'id' => $period->id,
                        'code' => $period->code,
                        'period_start' => optional($period->period_start)->toDateString(),
                        'period_end' => optional($period->period_end)->toDateString(),
                    ],
                    'line_count' => $lines->count(),
                ],
            ],
            'lines' => $lines->map(function (array $line): array {
                return [
                    'pay_code_id' => $line['pay_code_id'],
                    'code_snapshot' => $line['code_snapshot'],
                    'description_snapshot' => $line['description_snapshot'],
                    'type' => $line['type'],
                    'category' => $line['category'],
                    'input_source' => $line['input_source'],
                    'amount' => round((float) $line['amount'], 2),
                    'quantity' => $line['quantity'],
                    'rate' => $line['rate'],
                    'taxable' => (bool) $line['taxable'],
                    'affects_gross' => (bool) $line['affects_gross'],
                    'affects_net' => (bool) $line['affects_net'],
                    'sort_order' => (int) ($line['sort_order'] ?? 0),
                    'metadata' => $line['metadata'] ?? null,
                ];
            })->values()->all(),
        ];
    }

    private function addBasicLine(Collection $lines, Collection $payCodes, EmployeePayrollProfile $profile): void
    {
        $basicCode = $payCodes->get('BASIC');

        if (! $basicCode instanceof PayCode || (float) $profile->basic_salary <= 0) {
            return;
        }

        $lines->push($this->makeLine($basicCode, [
            'amount' => (float) $profile->basic_salary,
            'input_source' => 'SYSTEM_PROFILE',
        ]));
    }

    private function addRecurringLines(Collection $lines, Collection $items): void
    {
        $items->each(function (EmployeeRecurringPayItem $item) use ($lines): void {
            if (! $item->payCode) {
                return;
            }

            $amount = $this->resolveAmount(
                $item->amount !== null ? (float) $item->amount : null,
                $item->quantity !== null ? (float) $item->quantity : null,
                $item->rate !== null ? (float) $item->rate : null,
            );

            if ($amount === 0.0) {
                return;
            }

            $lines->push($this->makeLine($item->payCode, [
                'amount' => $amount,
                'quantity' => $item->quantity !== null ? (float) $item->quantity : null,
                'rate' => $item->rate !== null ? (float) $item->rate : null,
                'input_source' => 'RECURRING',
                'metadata' => [
                    'item_id' => $item->id,
                    'reference' => $item->reference,
                ],
            ]));
        });
    }

    private function addInputLines(Collection $lines, Collection $inputs): void
    {
        $inputs->each(function (PayrollInput $input) use ($lines): void {
            if (! $input->payCode) {
                return;
            }

            $amount = $this->resolveAmount(
                $input->amount !== null ? (float) $input->amount : null,
                $input->quantity !== null ? (float) $input->quantity : null,
                $input->rate !== null ? (float) $input->rate : null,
            );

            if ($amount === 0.0) {
                return;
            }

            $lines->push($this->makeLine($input->payCode, [
                'amount' => $amount,
                'quantity' => $input->quantity !== null ? (float) $input->quantity : null,
                'rate' => $input->rate !== null ? (float) $input->rate : null,
                'input_source' => (string) $input->source,
                'metadata' => [
                    'input_id' => $input->id,
                    'reference' => $input->reference,
                ],
            ]));
        });
    }

    private function addOvertimeLine(Collection $lines, Collection $payCodes, EmployeePayrollProfile $profile, Collection $timesheets): void
    {
        $overtimeCode = $payCodes->get('OT');
        $overtimeMinutes = (int) $timesheets->sum(fn (Timesheet $timesheet) => (int) $timesheet->overtime_minutes);

        if (! $overtimeCode instanceof PayCode || $overtimeMinutes <= 0) {
            return;
        }

        $hours = round($overtimeMinutes / 60, 4);
        $hourlyRate = (float) ($profile->hourly_rate ?: ((float) $profile->basic_salary / max(1, (float) config('payroll.standard_monthly_hours', 173.33))));
        $rate = round($hourlyRate * max(1, (float) $profile->overtime_multiplier), 4);
        $amount = round($hours * $rate, 2);

        if ($amount <= 0) {
            return;
        }

        $lines->push($this->makeLine($overtimeCode, [
            'amount' => $amount,
            'quantity' => $hours,
            'rate' => $rate,
            'input_source' => 'TIMESHEET',
            'metadata' => [
                'overtime_minutes' => $overtimeMinutes,
            ],
        ]));
    }

    private function appendGeneratedStatutoryLine(
        Collection $lines,
        Collection $payCodes,
        string $code,
        float $percent,
        float $baseAmount,
        Collection $existingCodes,
        Collection $generatedCodes,
        array $metadata = [],
    ): void {
        if ($percent <= 0 || $baseAmount <= 0 || $existingCodes->contains($code) || $generatedCodes->contains($code)) {
            return;
        }

        $payCode = $payCodes->get($code);

        if (! $payCode instanceof PayCode) {
            return;
        }

        $amount = round(($baseAmount * $percent) / 100, 2);

        if ($amount <= 0) {
            return;
        }

        $lines->push($this->makeLine($payCode, [
            'amount' => $amount,
            'input_source' => 'SYSTEM_STATUTORY',
            'metadata' => [
                'base_amount' => round($baseAmount, 2),
                'percent' => $percent,
                ...$metadata,
            ],
        ]));

        $generatedCodes->push($code);
    }

    private function makeLine(PayCode $payCode, array $overrides): array
    {
        $metadata = [
            'gl_account_code' => $payCode->gl_account_code,
        ];

        if (isset($overrides['metadata']) && is_array($overrides['metadata'])) {
            $metadata = [...$metadata, ...$overrides['metadata']];
        }

        return [
            'pay_code_id' => $payCode->id,
            'code_snapshot' => $payCode->code,
            'description_snapshot' => $payCode->description,
            'type' => $payCode->type,
            'category' => $payCode->category,
            'input_source' => 'SYSTEM',
            'amount' => 0,
            'quantity' => null,
            'rate' => null,
            'taxable' => (bool) $payCode->taxable,
            'is_pre_tax' => (bool) $payCode->is_pre_tax,
            'income_type' => (string) ($payCode->income_type ?: 'REGULAR'),
            'tax_credit' => $payCode->tax_credit,
            'affects_gross' => (bool) $payCode->affects_gross,
            'affects_net' => (bool) $payCode->affects_net,
            'sort_order' => (int) ($payCode->sort_order ?? 0),
            'metadata' => $metadata,
            ...$overrides,
        ];
    }

    private function resolveAmount(?float $amount, ?float $quantity, ?float $rate): float
    {
        if ($amount !== null) {
            return round($amount, 2);
        }

        if ($quantity !== null && $rate !== null) {
            return round($quantity * $rate, 2);
        }

        return 0.0;
    }

    private function grossFromLines(Collection $lines): float
    {
        return $this->sumLines($lines, fn (array $line) => $line['type'] === 'EARNING' && ($line['affects_gross'] ?? false));
    }

    private function sumLines(Collection $lines, callable $filter): float
    {
        return round(
            $lines
                ->filter($filter)
                ->sum(fn (array $line) => (float) ($line['amount'] ?? 0)),
            2
        );
    }
}
