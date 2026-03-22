<?php

namespace App\Http\Requests\Employer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ChangeSubscriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    public function rules(): array
    {
        return [
            'subscription_plan_id' => ['required', 'integer', Rule::exists('subscription_plans', 'id')],
            'seats' => ['nullable', 'integer', 'min:1', 'max:500'],
        ];
    }
}
