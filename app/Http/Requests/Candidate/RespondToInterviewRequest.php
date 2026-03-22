<?php

namespace App\Http\Requests\Candidate;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RespondToInterviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    public function rules(): array
    {
        return [
            'response' => ['required', Rule::in(['accepted', 'rejected'])],
            'candidate_response_note' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
