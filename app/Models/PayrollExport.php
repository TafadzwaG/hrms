<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;

class PayrollExport extends Model
{
    use Auditable, BelongsToOrganization;

    protected string $auditModule = 'payroll';

    protected $fillable = [
        'period_start',
        'period_end',
        'export_version',
        'status',
        'exported_at',
        'file_reference',
        'notes',
    ];

    protected $casts = [
        'exported_at' => 'datetime',
        'period_start' => 'date',
        'period_end' => 'date',
    ];
}

