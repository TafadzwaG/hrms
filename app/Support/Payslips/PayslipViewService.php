<?php

namespace App\Support\Payslips;

use App\Models\PayrollResult;

class PayslipViewService
{
    public function load(PayrollResult $result): PayrollResult
    {
        $result->loadMissing([
            'organization:id,name,code',
            'lines',
            'settlements.sourceRule',
            'run.period',
            'employee.user',
            'employee.orgUnit',
            'employee.position',
            'deliveries.creator:id,name,email',
        ]);

        return $result;
    }

    public function payload(PayrollResult $result): array
    {
        $result = $this->load($result);

        return [
            'id' => $result->id,
            'employee' => [
                'id' => $result->employee_id,
                'staff_number' => $result->staff_number_snapshot,
                'full_name' => $result->employee_name_snapshot,
                'department' => $result->department_snapshot,
                'position' => $result->position_snapshot,
                'pay_point' => $result->pay_point_snapshot,
                'email' => $result->employee?->user?->email,
                'contact_number' => $result->employee?->contact_number,
            ],
            'organization' => [
                'id' => $result->organization_id,
                'name' => $result->organization?->name ?? config('app.name'),
                'code' => $result->organization?->code,
            ],
            'period' => [
                'id' => $result->run?->period?->id,
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
            'sms_summary_preview' => $this->smsSummary($result),
            'delivery_history' => $result->deliveries
                ->sortByDesc('created_at')
                ->map(fn ($delivery) => [
                    'id' => $delivery->id,
                    'channel' => $delivery->channel,
                    'recipient' => $delivery->recipient,
                    'status' => $delivery->status,
                    'failure_reason' => $delivery->failure_reason,
                    'attempts' => $delivery->attempts,
                    'sent_at' => optional($delivery->sent_at)->toDateTimeString(),
                    'created_at' => optional($delivery->created_at)->toDateTimeString(),
                    'created_by' => $delivery->creator ? [
                        'id' => $delivery->creator->id,
                        'name' => $delivery->creator->name,
                    ] : null,
                    'metadata' => $delivery->metadata ?? [],
                ])
                ->values(),
        ];
    }

    public function filename(PayrollResult $result): string
    {
        $this->load($result);

        return "payslip-{$result->staff_number_snapshot}-run-{$result->run?->run_number}.pdf";
    }

    public function smsSummary(PayrollResult $result): string
    {
        $this->load($result);

        $message = (string) config('sms.message_template');
        $replacements = [
            ':period' => $result->run?->period?->name ?? $result->run?->period?->code ?? 'Current Period',
            ':employee' => $result->employee_name_snapshot,
            ':net_pay' => sprintf('%s %s', $result->currency_snapshot, number_format((float) $result->net_pay, 2)),
            ':gross_pay' => sprintf('%s %s', $result->currency_snapshot, number_format((float) $result->gross_pay, 2)),
            ':pay_date' => optional($result->run?->period?->pay_date)->format('Y-m-d') ?? 'N/A',
            ':organization' => $result->organization?->name ?? config('app.name'),
        ];

        return trim(strtr($message, $replacements));
    }
}
