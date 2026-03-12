<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
class PayrollExport extends Model
{    protected $fillable = [
        'period_start',
        'period_end',
        'export_version',
        'status',
        'exported_at',
        'file_reference',
        'notes'
    ];
    protected $casts = [
        'exported_at' => 'datetime',
        'period_start' => 'date',
        'period_end' => 'date'
    ];
}

