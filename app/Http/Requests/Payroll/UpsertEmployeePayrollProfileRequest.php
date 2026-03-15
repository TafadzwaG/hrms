<?php

namespace App\Http\Requests\Payroll;

use App\Support\Tenancy\TenantContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpsertEmployeePayrollProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->canAccess(['payroll.profile.manage', 'payroll.manage']);
    }

    public function rules(): array
    {
        $tenantId = app(TenantContext::class)->id();
        return [
            'employee_id' => [
                'required',
                'integer',
                Rule::exists('employees', 'id')->where(fn ($query) => $query->where('organization_id', $tenantId)),
            ],
            'pay_frequency' => ['required', Rule::in(config('payroll.frequencies', []))],
            'currency' => ['required', 'string', 'max:8'],
            'basic_salary' => ['required', 'numeric', 'min:0'],
            'hourly_rate' => ['nullable', 'numeric', 'min:0'],
            'overtime_multiplier' => ['nullable', 'numeric', 'min:1'],
            'bank_name' => ['nullable', 'string', 'max:150'],
            'bank_branch' => ['nullable', 'string', 'max:150'],
            'bank_account_name' => ['nullable', 'string', 'max:150'],
            'bank_account_number' => ['nullable', 'string', 'max:100'],
            'bank_account_type' => ['nullable', 'string', 'max:60'],
            'tax_number' => ['nullable', 'string', 'max:100'],
            'tax_table' => ['nullable', 'string', 'max:60'],
            'pension_number' => ['nullable', 'string', 'max:100'],
            'pension_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'nssa_number' => ['nullable', 'string', 'max:100'],
            'nssa_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'nec_number' => ['nullable', 'string', 'max:100'],
            'nec_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'union_number' => ['nullable', 'string', 'max:100'],
            'union_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'cost_centre' => ['nullable', 'string', 'max:100'],
            'employment_status' => ['required', Rule::in(['ACTIVE', 'INACTIVE', 'TERMINATED', 'SUSPENDED'])],
            'tax_enabled' => ['nullable', 'boolean'],
            'active' => ['nullable', 'boolean'],
            'effective_from' => ['required', 'date'],
            'effective_to' => ['nullable', 'date', 'after_or_equal:effective_from'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
