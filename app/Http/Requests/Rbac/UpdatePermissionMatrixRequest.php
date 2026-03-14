<?php

namespace App\Http\Requests\Rbac;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePermissionMatrixRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->canAccess('permissions.assign');
    }

    public function rules(): array
    {
        return [
            'matrix' => ['required', 'array'],
            'matrix.*.role_id' => ['required', 'integer', 'exists:roles,id'],
            'matrix.*.permission_ids' => ['array'],
            'matrix.*.permission_ids.*' => ['integer', 'exists:permissions,id'],
        ];
    }
}
