<?php

namespace App\Http\Requests\Employer;

use App\Support\RichText;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpsertEmployerVacancyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'department' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', Rule::in(\App\Models\Vacancy::CATEGORIES)],
            'employment_type' => ['required', Rule::in(\App\Models\Vacancy::EMPLOYMENT_TYPES)],
            'work_mode' => ['nullable', Rule::in(\App\Models\Vacancy::WORK_MODES)],
            'location' => ['nullable', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:8000'],
            'requirements' => ['nullable', 'string', 'max:8000'],
            'responsibilities' => ['nullable', 'string', 'max:8000'],
            'salary_min' => ['nullable', 'numeric', 'min:0'],
            'salary_max' => ['nullable', 'numeric', 'gte:salary_min'],
            'currency' => ['nullable', 'string', 'size:3'],
            'application_deadline' => ['nullable', 'date'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'description' => RichText::sanitize($this->input('description')),
            'requirements' => RichText::sanitize($this->input('requirements')),
            'responsibilities' => RichText::sanitize($this->input('responsibilities')),
        ]);
    }
}
