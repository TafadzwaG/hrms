<?php

namespace App\Http\Requests\Payslips;

use App\Support\Tenancy\TenantContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class DispatchPayslipBatchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $tenantId = app(TenantContext::class)->id();

        return [
            'payroll_result_ids' => ['nullable', 'array'],
            'payroll_result_ids.*' => [
                'integer',
                Rule::exists('payroll_results', 'id')->where(fn ($query) => $query->where('organization_id', $tenantId)),
            ],
            'payroll_period_id' => [
                'nullable',
                'integer',
                Rule::exists('payroll_periods', 'id')->where(fn ($query) => $query->where('organization_id', $tenantId)),
            ],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $resultIds = collect($this->input('payroll_result_ids', []))->filter();
            $periodId = $this->input('payroll_period_id');

            if ($resultIds->isEmpty() && blank($periodId)) {
                $validator->errors()->add('payroll_result_ids', 'Select at least one payslip or a payroll period.');
            }
        });
    }
}
