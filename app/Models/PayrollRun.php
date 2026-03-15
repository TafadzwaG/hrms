<?php

namespace App\Models;

use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PayrollRun extends Model
{
    use BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'payroll_period_id',
        'run_number',
        'status',
        'processed_at',
        'processed_by',
        'approved_at',
        'approved_by',
        'closed_at',
        'closed_by',
        'employee_count',
        'gross_total',
        'taxable_total',
        'deduction_total',
        'net_total',
        'calculation_version',
        'summary_json',
    ];

    protected function casts(): array
    {
        return [
            'processed_at' => 'datetime',
            'approved_at' => 'datetime',
            'closed_at' => 'datetime',
            'gross_total' => 'decimal:2',
            'taxable_total' => 'decimal:2',
            'deduction_total' => 'decimal:2',
            'net_total' => 'decimal:2',
            'summary_json' => 'array',
        ];
    }

    public function period(): BelongsTo
    {
        return $this->belongsTo(PayrollPeriod::class, 'payroll_period_id');
    }

    public function results(): HasMany
    {
        return $this->hasMany(PayrollResult::class)->orderBy('employee_name_snapshot');
    }

    public function statutorySummaries(): HasMany
    {
        return $this->hasMany(PayrollStatutorySummary::class);
    }

    public function settlements(): HasMany
    {
        return $this->hasMany(PayrollResultSettlement::class);
    }

    public function exports(): HasMany
    {
        return $this->hasMany(PayrollExport::class);
    }

    public function processedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function closedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'closed_by');
    }
}
