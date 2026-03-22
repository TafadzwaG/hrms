<?php

namespace App\Http\Requests\Candidate;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpsertCandidateSkillRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'level' => ['nullable', Rule::in(\App\Models\CandidateSkill::LEVELS)],
            'years_experience' => ['nullable', 'integer', 'min:0', 'max:60'],
        ];
    }
}
