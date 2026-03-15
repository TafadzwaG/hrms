<?php

namespace App\Http\Requests\Payroll;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpsertEmployeePayrollSettlementRuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->canAccess(['payroll.profile.manage', 'payroll.manage']);
    }

    public function rules(): array
    {
        $currencies = collect(config('payroll.currencies', []))
            ->pluck('code')
            ->map(fn ($code) => strtoupper((string) $code))
            ->all();

        return [
            'currency' => ['required', 'string', 'max:8', Rule::in($currencies)],
            'allocation_method' => ['required', Rule::in(config('payroll.settlement_allocation_methods', []))],
            'amount' => ['nullable', 'numeric', 'gt:0'],
            'percentage' => ['nullable', 'numeric', 'gt:0', 'lte:100'],
            'priority' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'active' => ['nullable', 'boolean'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
