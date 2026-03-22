<?php

namespace App\Http\Requests\Employer;

use App\Models\ApplicationInterview;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ScheduleInterviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    public function rules(): array
    {
        return [
            'scheduled_at' => ['required', 'date', 'after:now'],
            'ends_at' => ['nullable', 'date', 'after:scheduled_at'],
            'meeting_type' => ['required', Rule::in(ApplicationInterview::MEETING_TYPES)],
            'location' => ['nullable', 'string', 'max:255'],
            'instructions' => ['nullable', 'string', 'max:4000'],
            'timezone' => ['nullable', 'string', 'max:64'],
        ];
    }
}
