<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PayrollPeriod extends Model
{
    use Auditable, BelongsToOrganization;

    protected string $auditModule = 'payroll';

    protected $fillable = [
        'organization_id',
        'code',
        'name',
        'frequency',
        'period_start',
        'period_end',
        'pay_date',
        'currency',
        'status',
        'notes',
        'processed_at',
        'processed_by',
        'approved_at',
        'approved_by',
        'closed_at',
        'closed_by',
    ];

    protected function casts(): array
    {
        return [
            'period_start' => 'date',
            'period_end' => 'date',
            'pay_date' => 'date',
            'processed_at' => 'datetime',
            'approved_at' => 'datetime',
            'closed_at' => 'datetime',
        ];
    }

    public function inputs(): HasMany
    {
        return $this->hasMany(PayrollInput::class);
    }

    public function runs(): HasMany
    {
        return $this->hasMany(PayrollRun::class)->orderByDesc('run_number');
    }

    public function exchangeRates(): HasMany
    {
        return $this->hasMany(PayrollPeriodExchangeRate::class)->orderBy('from_currency')->orderBy('to_currency');
    }

    public function latestRun(): HasOne
    {
        return $this->hasOne(PayrollRun::class)->latestOfMany('run_number');
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

    public function exports(): HasMany
    {
        return $this->hasMany(PayrollExport::class);
    }
}
