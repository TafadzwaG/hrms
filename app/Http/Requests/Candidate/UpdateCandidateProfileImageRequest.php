<?php

namespace App\Http\Requests\Candidate;

use App\Rules\AcceptAnyImageMime;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCandidateProfileImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    public function rules(): array
    {
        return [
            'profile_image' => ['required', 'file', new AcceptAnyImageMime(), 'max:4096'],
        ];
    }
}
