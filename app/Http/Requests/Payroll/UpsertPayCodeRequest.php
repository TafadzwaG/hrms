<?php

namespace App\Http\Requests\Payroll;

use App\Models\PayCode;
use App\Support\Tenancy\TenantContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpsertPayCodeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->canAccess(['payroll.paycodes.manage', 'payroll.manage']);
    }

    public function rules(): array
    {
        $tenantId = app(TenantContext::class)->id();
        $payCode = $this->route('payCode');
        $payCodeId = $payCode instanceof PayCode ? $payCode->id : (is_numeric($payCode) ? (int) $payCode : null);

        return [
            'code' => [
                'required',
                'string',
                'max:64',
                Rule::unique('pay_codes', 'code')
                    ->ignore($payCodeId)
                    ->where(fn ($query) => $query->where('organization_id', $tenantId)),
            ],
            'description' => ['required', 'string', 'max:150'],
            'category' => ['required', 'string', 'max:32'],
            'type' => ['required', Rule::in(['EARNING', 'DEDUCTION', 'EMPLOYER'])],
            'taxable' => ['nullable', 'boolean'],
            'recurring' => ['nullable', 'boolean'],
            'affects_gross' => ['nullable', 'boolean'],
            'affects_net' => ['nullable', 'boolean'],
            'is_pre_tax' => ['nullable', 'boolean'],
            'income_type' => ['nullable', Rule::in(['REGULAR', 'IRREGULAR', 'BONUS', 'RETRENCHMENT'])],
            'unit' => ['nullable', Rule::in(['AMOUNT', 'HOURS', 'UNITS'])],
            'rate_multiplier' => ['nullable', 'numeric', 'min:0', 'max:10'],
            'default_rate' => ['nullable', 'numeric', 'min:0'],
            'tax_credit' => ['nullable', Rule::in(['MEDICAL'])],
            'active' => ['nullable', 'boolean'],
            'system_generated' => ['nullable', 'boolean'],
            'gl_account_code' => ['nullable', 'string', 'max:64'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ];
    }
}
