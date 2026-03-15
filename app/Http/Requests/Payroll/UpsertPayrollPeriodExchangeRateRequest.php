<?php

namespace App\Http\Requests\Payroll;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpsertPayrollPeriodExchangeRateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->canAccess(['payroll.manage']);
    }

    public function rules(): array
    {
        $currencies = collect(config('payroll.currencies', []))
            ->pluck('code')
            ->map(fn ($code) => strtoupper((string) $code))
            ->all();

        return [
            'from_currency' => ['required', 'string', 'max:8', Rule::in($currencies)],
            'to_currency' => ['required', 'string', 'max:8', Rule::in($currencies), 'different:from_currency'],
            'rate' => ['required', 'numeric', 'gt:0'],
            'effective_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
