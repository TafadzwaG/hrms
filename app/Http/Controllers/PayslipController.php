<?php

namespace App\Http\Controllers;

use App\Models\PayrollExport;
use App\Models\PayrollResult;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class PayslipController extends Controller
{
    public function show(int $result): Response
    {
        /** @var PayrollResult $result */
        $result = $this->findTenantModelOrFail(PayrollResult::class, $result);
        $result->load(['lines', 'settlements.sourceRule', 'run.period', 'employee.user', 'employee.orgUnit', 'employee.position']);

        return Inertia::render('Payroll/Payslips/Show', [
            'payslip' => $this->mapPayslip($result),
        ]);
    }

    public function download(int $result): HttpResponse
    {
        /** @var PayrollResult $result */
        $result = $this->findTenantModelOrFail(PayrollResult::class, $result);
        $result->load(['lines', 'settlements.sourceRule', 'run.period', 'employee.user', 'employee.orgUnit', 'employee.position']);
        $payslip = $this->mapPayslip($result);

        PayrollExport::query()->create([
            'organization_id' => $result->organization_id,
            'payroll_period_id' => $result->payroll_period_id,
            'payroll_run_id' => $result->payroll_run_id,
            'period_start' => $result->run?->period?->period_start,
            'period_end' => $result->run?->period?->period_end,
            'export_version' => sprintf('payslip-%s-%s', $result->id, now()->format('YmdHis')),
            'status' => 'EXPORTED',
            'exported_at' => now(),
            'file_reference' => sprintf('payroll/payslips/%s-%s.pdf', $result->id, now()->format('YmdHis')),
            'export_type' => 'PAYSLIP',
            'generated_by' => request()->user()?->id,
            'notes' => 'Generated payroll payslip PDF.',
            'summary_json' => [
                'payroll_result_id' => $result->id,
                'net_pay' => (float) $result->net_pay,
            ],
        ]);

        $pdf = Pdf::loadView('payroll.payslip', [
            'payslip' => $payslip,
        ]);

        return $pdf->download("payslip-{$result->staff_number_snapshot}-run-{$result->run?->run_number}.pdf");
    }

    private function mapPayslip(PayrollResult $result): array
    {
        return [
            'id' => $result->id,
            'employee' => [
                'staff_number' => $result->staff_number_snapshot,
                'full_name' => $result->employee_name_snapshot,
                'department' => $result->department_snapshot,
                'position' => $result->position_snapshot,
                'pay_point' => $result->pay_point_snapshot,
            ],
            'period' => [
                'code' => $result->run?->period?->code,
                'name' => $result->run?->period?->name,
                'period_start' => optional($result->run?->period?->period_start)->toDateString(),
                'period_end' => optional($result->run?->period?->period_end)->toDateString(),
                'pay_date' => optional($result->run?->period?->pay_date)->toDateString(),
                'run_number' => $result->run?->run_number,
            ],
            'banking' => [
                'bank_name' => $result->bank_name_snapshot,
                'account_name' => $result->bank_account_name_snapshot,
                'account_number' => $result->bank_account_number_snapshot,
            ],
            'totals' => [
                'basic_salary' => (float) $result->basic_salary_snapshot,
                'gross_pay' => (float) $result->gross_pay,
                'pre_tax_deductions' => (float) $result->pre_tax_deductions,
                'taxable_income' => (float) $result->taxable_income,
                'tax_amount' => (float) $result->tax_amount,
                'statutory_deductions' => (float) $result->statutory_deductions,
                'voluntary_deductions' => (float) $result->voluntary_deductions,
                'total_deductions' => (float) $result->total_deductions,
                'net_pay' => (float) $result->net_pay,
                'currency' => $result->currency_snapshot,
            ],
            'settlements' => $result->settlements
                ->map(fn ($settlement) => [
                    'currency' => $settlement->currency,
                    'base_currency' => $settlement->base_currency,
                    'base_amount' => (float) $settlement->base_amount,
                    'settlement_amount' => (float) $settlement->settlement_amount,
                    'exchange_rate' => $settlement->exchange_rate !== null ? (float) $settlement->exchange_rate : null,
                    'allocation_method' => $settlement->allocation_method,
                    'rule_currency' => $settlement->sourceRule?->currency,
                ])
                ->values(),
            'earnings' => $result->lines
                ->where('type', 'EARNING')
                ->map(fn ($line) => [
                    'code' => $line->code_snapshot,
                    'description' => $line->description_snapshot,
                    'amount' => (float) $line->amount,
                    'quantity' => $line->quantity !== null ? (float) $line->quantity : null,
                    'rate' => $line->rate !== null ? (float) $line->rate : null,
                ])
                ->values(),
            'deductions' => $result->lines
                ->where('type', 'DEDUCTION')
                ->map(fn ($line) => [
                    'code' => $line->code_snapshot,
                    'description' => $line->description_snapshot,
                    'amount' => (float) $line->amount,
                    'category' => $line->category,
                ])
                ->values(),
            'download_url' => "/payroll/payslips/{$result->id}/download",
        ];
    }
}
