<?php

namespace App\Http\Requests\Payroll;

use App\Support\Tenancy\TenantContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpsertEmployeeRecurringPayItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->canAccess(['payroll.profile.manage', 'payroll.inputs.manage', 'payroll.manage']);
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
            'employee_payroll_profile_id' => [
                'nullable',
                'integer',
                Rule::exists('employee_payroll_profiles', 'id')->where(fn ($query) => $query->where('organization_id', $tenantId)),
            ],
            'pay_code_id' => [
                'required',
                'integer',
                Rule::exists('pay_codes', 'id')->where(fn ($query) => $query->where('organization_id', $tenantId)),
            ],
            'input_mode' => ['required', Rule::in(['FIXED', 'RATE_X_QTY'])],
            'amount' => ['nullable', 'numeric', 'min:0'],
            'quantity' => ['nullable', 'numeric', 'min:0'],
            'rate' => ['nullable', 'numeric', 'min:0'],
            'effective_from' => ['required', 'date'],
            'effective_to' => ['nullable', 'date', 'after_or_equal:effective_from'],
            'is_active' => ['nullable', 'boolean'],
            'reference' => ['nullable', 'string', 'max:150'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
