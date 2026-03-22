<?php

namespace App\Http\Requests\Candidate;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ApplyToVacancyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    public function rules(): array
    {
        return [
            'resume_id' => ['nullable', 'integer', Rule::exists('candidate_resumes', 'id')],
            'cover_letter' => ['nullable', 'string', 'max:4000'],
        ];
    }
}
