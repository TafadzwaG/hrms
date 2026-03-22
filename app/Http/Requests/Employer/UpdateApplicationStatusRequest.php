<?php

namespace App\Http\Requests\Employer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateApplicationStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(\App\Models\VacancyApplication::STATUSES)],
            'notes' => ['nullable', 'string', 'max:4000'],
        ];
    }
}
