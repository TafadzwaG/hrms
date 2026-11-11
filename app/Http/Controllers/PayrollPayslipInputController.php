<?php

namespace App\Http\Controllers;

use App\Models\EmployeeRecurringPayItem;
use App\Models\PayCode;
use App\Models\PayrollInput;
use App\Models\PayrollPeriod;
use App\Models\PayrollResult;
use App\Models\Timesheet;
use App\Support\Payroll\Inputs\PayrollInputBatchService;
use App\Support\Payroll\PayrollProcessingService;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Payslip Input: one employee's period on one screen. Every source that feeds the
 * payslip is listed, period inputs can be added, changed or removed, and a preview of
 * the payslip (PAYE, AIDS Levy, net pay, currency split) is recalculated on every load.
 * The preview is never saved; processing the period produces the real payslip.
 */
class PayrollPayslipInputController extends Controller
{
    public function show(int $period, int $employee, PayrollProcessingService $processing, PayrollInputBatchService $batches): Response
    {
        /** @var PayrollPeriod $period */
        $period = $this->findTenantModelOrFail(PayrollPeriod::class, $period);

        $roster = $batches->payrollProfiles($period)
            ->map(fn ($profile) => [
                'employee_id' => $profile->employee_id,
                'staff_number' => $profile->employee?->staff_number,
                'full_name' => $profile->employee?->full_name,
            ])
            ->values();

        $profile = $processing->profileFor($period, $employee);
        abort_unless($profile && $profile->employee, 404, 'This employee has no active payroll profile for the period.');

        ['recurring' => $recurring, 'inputs' => $inputs, 'timesheets' => $timesheets] = $processing->sourcesFor($period, $profile);
        $preview = $processing->preview($period, $profile);

        $latestRun = $processing->latestRun($period);
        $processed = $latestRun
            ? PayrollResult::query()->with('lines')->where('payroll_run_id', $latestRun->id)->where('employee_id', $employee)->first()
            : null;

        $position = $roster->search(fn ($row) => $row['employee_id'] === $employee);
        $previewTax = $preview ? collect($preview['lines'])->where('type', 'DEDUCTION')->whereIn('code_snapshot', ['PAYE', 'AIDS'])->sum('amount') : 0;

        return Inertia::render('Payroll/Inputs/Payslip', [
            'period' => [
                'id' => $period->id,
                'code' => $period->code,
                'name' => $period->name,
                'status' => $period->status,
                'currency' => $period->currency,
                'editable' => ! in_array($period->status, ['APPROVED', 'CLOSED'], true),
            ],
            'employee' => [
                'id' => $profile->employee->id,
                'staff_number' => $profile->employee->staff_number,
                'full_name' => $profile->employee->full_name,
                'department' => $profile->employee->orgUnit?->name,
                'position' => $profile->employee->position?->name,
                'currency' => $profile->currency,
                'basic_salary' => (float) $profile->basic_salary,
                'tax_method' => $profile->tax_method,
                'cost_centre' => $profile->cost_centre,
            ],
            'navigation' => [
                'roster' => $roster,
                'previous_id' => $position !== false && $position > 0 ? $roster[$position - 1]['employee_id'] : null,
                'next_id' => $position !== false && $position < $roster->count() - 1 ? $roster[$position + 1]['employee_id'] : null,
            ],
            'recurring' => $recurring->map(fn (EmployeeRecurringPayItem $item) => [
                'id' => $item->id,
                'code' => $item->payCode?->code,
                'description' => $item->payCode?->description,
                'type' => $item->payCode?->type,
                'amount' => $item->amount !== null ? (float) $item->amount : round((float) $item->quantity * (float) $item->rate, 2),
                'reference' => $item->reference,
            ])->values(),
            'inputs' => $inputs->map(fn (PayrollInput $input) => [
                'id' => $input->id,
                'pay_code_id' => $input->pay_code_id,
                'code' => $input->payCode?->code,
                'description' => $input->payCode?->description,
                'type' => $input->payCode?->type,
                'input_mode' => $input->input_mode,
                'amount' => $input->amount !== null ? (float) $input->amount : null,
                'quantity' => $input->quantity !== null ? (float) $input->quantity : null,
                'rate' => $input->rate !== null ? (float) $input->rate : null,
                'value' => $input->resolvedAmount(),
                'source' => $input->source,
                'batch_number' => $input->batch?->batch_number,
                'reference' => $input->reference,
                'notes' => $input->notes,
            ])->values(),
            'overtime' => [
                'timesheets' => $timesheets->count(),
                'hours' => round($timesheets->sum(fn (Timesheet $timesheet) => (int) $timesheet->overtime_minutes) / 60, 2),
            ],
            'preview' => $preview ? [
                'gross_pay' => (float) $preview['result']['gross_pay'],
                'taxable_income' => (float) $preview['result']['taxable_income'],
                'tax' => round((float) $previewTax, 2),
                'total_deductions' => (float) $preview['result']['total_deductions'],
                'net_pay' => (float) $preview['result']['net_pay'],
                'employer_cost' => round((float) collect($preview['lines'])->where('type', 'EMPLOYER')->sum('amount'), 2),
                'lines' => collect($preview['lines'])->where('type', '!=', 'EMPLOYER')->map(fn ($line) => [
                    'code' => $line['code_snapshot'],
                    'description' => $line['description_snapshot'],
                    'type' => $line['type'],
                    'amount' => (float) $line['amount'],
                    'source' => $line['input_source'],
                ])->values(),
                'settlements' => collect($preview['settlements'])->map(fn ($settlement) => [
                    'currency' => $settlement['currency'],
                    'amount' => (float) $settlement['settlement_amount'],
                ])->values(),
                'settlement_error' => $preview['settlement_error'],
                'warnings' => $preview['tax_warnings'],
            ] : null,
            'processed' => $processed ? [
                'gross_pay' => (float) $processed->gross_pay,
                'tax' => round((float) $processed->lines->where('type', 'DEDUCTION')->whereIn('code_snapshot', ['PAYE', 'AIDS'])->sum('amount'), 2),
                'total_deductions' => (float) $processed->total_deductions,
                'net_pay' => (float) $processed->net_pay,
            ] : null,
            'payCodes' => PayCode::query()
                ->where('active', true)
                ->where(fn ($query) => $query->where('system_generated', false)->orWhere('code', 'OT'))
                ->orderBy('sort_order')
                ->orderBy('code')
                ->get(['id', 'code', 'description', 'type'])
                ->values(),
        ]);
    }
}
