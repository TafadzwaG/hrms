<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PayrollExport extends Model
{
    use Auditable, BelongsToOrganization;

    protected string $auditModule = 'payroll';

    protected $fillable = [
        'organization_id',
        'payroll_period_id',
        'payroll_run_id',
        'period_start',
        'period_end',
        'export_version',
        'status',
        'exported_at',
        'file_reference',
        'export_type',
        'generated_by',
        'notes',
        'summary_json',
    ];

    protected $casts = [
        'exported_at' => 'datetime',
        'period_start' => 'date',
        'period_end' => 'date',
        'summary_json' => 'array',
    ];

    public function period(): BelongsTo
    {
        return $this->belongsTo(PayrollPeriod::class, 'payroll_period_id');
    }

    public function payrollRun(): BelongsTo
    {
        return $this->belongsTo(PayrollRun::class, 'payroll_run_id');
    }

    public function generatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generated_by');
    }
}

