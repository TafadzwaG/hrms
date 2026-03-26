<?php

namespace App\Http\Requests\Employer;

use App\Rules\AcceptAnyImageMime;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCompanyLogoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    public function rules(): array
    {
        return [
            'logo' => ['required', 'file', new AcceptAnyImageMime(), 'max:4096'],
        ];
    }
}
