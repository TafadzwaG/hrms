<?php

namespace App\Http\Requests\Payroll;

use App\Support\Tenancy\TenantContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpsertPayrollInputRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->canAccess(['payroll.inputs.manage', 'payroll.manage']);
    }

    public function rules(): array
    {
        $tenantId = app(TenantContext::class)->id();

        return [
            'payroll_period_id' => [
                'required',
                'integer',
                Rule::exists('payroll_periods', 'id')->where(fn ($query) => $query->where('organization_id', $tenantId)),
            ],
            'employee_id' => [
                'required',
                'integer',
                Rule::exists('employees', 'id')->where(fn ($query) => $query->where('organization_id', $tenantId)),
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
            'source' => ['nullable', 'string', 'max:32'],
            'reference' => ['nullable', 'string', 'max:150'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
