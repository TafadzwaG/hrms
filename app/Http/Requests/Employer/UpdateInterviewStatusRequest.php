<?php

namespace App\Http\Requests\Employer;

use App\Models\ApplicationInterview;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateInterviewStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(['cancelled', 'completed'])],
            'instructions' => ['nullable', 'string', 'max:4000'],
        ];
    }
}
