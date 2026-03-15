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

        $grossPay = $this->grossFromLines($lines);
        $preTaxDeductions = $this->sumLines($lines, fn (array $line) => $line['type'] === 'DEDUCTION' && ($line['is_pre_tax'] ?? false));
        $taxableIncome = max(0, round($grossPay - $preTaxDeductions, 2));

        if ((bool) $profile->tax_enabled && ! $existingCodes->contains('PAYE')) {
            $payeCode = $payCodes->get('PAYE');

            if ($payeCode instanceof PayCode) {
                $paye = $this->taxService->calculatePaye($taxableIncome);

                if ($paye > 0) {
                    $lines->push($this->makeLine($payeCode, [
                        'amount' => $paye,
                        'input_source' => 'SYSTEM_TAX',
                        'metadata' => [
                            'source' => 'PAYE_BANDS',
                            'taxable_income' => $taxableIncome,
                        ],
                    ]));
                }
            }
        }

        $lines = $lines->sortBy([
            ['sort_order', 'asc'],
            ['code_snapshot', 'asc'],
        ])->values();

        $totalDeductions = $this->sumLines($lines, fn (array $line) => $line['type'] === 'DEDUCTION');
        $taxAmount = $this->sumLines($lines, fn (array $line) => ($line['category'] ?? null) === 'TAX' || ($line['code_snapshot'] ?? null) === 'PAYE');
        $statutoryDeductions = $this->sumLines($lines, fn (array $line) => ($line['category'] ?? null) === 'STATUTORY');
        $voluntaryDeductions = max(0, round($totalDeductions - $taxAmount - $statutoryDeductions, 2));
        $netPay = max(0, round($grossPay - $totalDeductions, 2));

        return [
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
