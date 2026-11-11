<?php

namespace App\Models;

use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;

class PayrollInputLayout extends Model
{
    use BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'name',
        'pay_code_ids',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'pay_code_ids' => 'array',
        ];
    }
}
