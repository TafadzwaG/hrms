<?php

namespace App\Http\Requests\Candidate;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCandidateSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    public function rules(): array
    {
        return [
            'job_alerts' => ['nullable', 'boolean'],
            'newsletter' => ['nullable', 'boolean'],
            'remote_only' => ['nullable', 'boolean'],
            'preferred_work_modes' => ['nullable', 'array'],
            'preferred_work_modes.*' => ['string', Rule::in(\App\Models\Vacancy::WORK_MODES)],
        ];
    }
}
