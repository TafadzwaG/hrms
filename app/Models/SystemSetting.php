<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    protected $table = 'system_settings';

    protected $fillable = [
        'organization_id',
        'group',
        'key',
        'value',
        'type',
        'is_public',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'organization_id' => 'integer',
        'value' => 'json',
        'is_public' => 'boolean',
        'created_by' => 'integer',
        'updated_by' => 'integer',
    ];
}

