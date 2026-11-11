<?php

namespace App\Models;

use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PayrollInputBatch extends Model
{
    use BelongsToOrganization;

    public const SOURCE_IMPORT = 'IMPORT';

    public const SOURCE_BULK = 'BULK';

    public const SOURCE_GRID = 'GRID';

    public const STATUS_POSTED = 'POSTED';

    public const STATUS_REVERSED = 'REVERSED';

    protected $fillable = [
        'organization_id',
        'payroll_period_id',
        'batch_number',
        'source',
        'action',
        'description',
        'control_total',
        'control_count',
        'entered_total',
        'entered_count',
        'status',
        'metadata',
        'created_by',
        'reversed_at',
        'reversed_by',
    ];

    protected function casts(): array
    {
        return [
            'control_total' => 'decimal:2',
            'entered_total' => 'decimal:2',
            'metadata' => 'array',
            'reversed_at' => 'datetime',
        ];
    }

    public function period(): BelongsTo
    {
        return $this->belongsTo(PayrollPeriod::class, 'payroll_period_id');
    }

    public function inputs(): HasMany
    {
        return $this->hasMany(PayrollInput::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function reversedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reversed_by');
    }
}
