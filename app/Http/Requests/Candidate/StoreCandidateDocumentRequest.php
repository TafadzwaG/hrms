<?php

namespace App\Http\Requests\Candidate;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCandidateDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    public function rules(): array
    {
        return [
            'document' => ['required', 'file', 'max:8192', 'mimes:pdf,doc,docx,txt,png,jpg,jpeg'],
            'document_type' => ['required', Rule::in(\App\Models\CandidateResume::DOCUMENT_TYPES)],
            'description' => ['nullable', 'string', 'max:500'],
            'is_primary' => ['nullable', 'boolean'],
        ];
    }
}
