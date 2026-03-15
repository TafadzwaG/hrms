<?php

namespace App\Http\Requests\Payroll;

use App\Models\PayrollPeriod;
use App\Support\Tenancy\TenantContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpsertPayrollPeriodRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->canAccess(['payroll.manage']);
    }

    public function rules(): array
    {
        $tenantId = app(TenantContext::class)->id();
        $period = $this->route('period');
        $periodId = $period instanceof PayrollPeriod ? $period->id : (is_numeric($period) ? (int) $period : null);

        return [
            'code' => [
                'required',
                'string',
                'max:64',
                Rule::unique('payroll_periods', 'code')
                    ->ignore($periodId)
                    ->where(fn ($query) => $query->where('organization_id', $tenantId)),
            ],
            'name' => ['required', 'string', 'max:150'],
            'frequency' => ['required', Rule::in(config('payroll.frequencies', []))],
            'period_start' => ['required', 'date'],
            'period_end' => ['required', 'date', 'after_or_equal:period_start'],
            'pay_date' => ['required', 'date'],
            'currency' => ['required', 'string', 'max:8'],
            'status' => ['nullable', Rule::in(config('payroll.period_statuses', []))],
            'notes' => ['nullable', 'string'],
        ];
    }
}
