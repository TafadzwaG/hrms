<?php

namespace App\Models;

use App\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Payment extends Model
{
    use Auditable;

    protected string $auditModule = 'payments';

    public const STATUSES = [
        'pending',
        'initiated',
        'processing',
        'paid',
        'failed',
        'cancelled',
        'refunded',
    ];

    public const PROVIDERS = [
        'paynow',
        'stripe',
        'manual',
    ];

    protected $fillable = [
        'payable_type',
        'payable_id',
        'user_id',
        'amount',
        'currency',
        'provider',
        'provider_reference',
        'customer_phone',
        'customer_email',
        'status',
        'initiated_at',
        'paid_at',
        'failed_at',
        'metadata',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'initiated_at' => 'datetime',
        'paid_at' => 'datetime',
        'failed_at' => 'datetime',
        'metadata' => 'array',
    ];

    public function payable(): MorphTo
    {
        return $this->morphTo();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function attempts(): HasMany
    {
        return $this->hasMany(PaymentAttempt::class);
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByProvider($query, string $provider)
    {
        return $query->where('provider', $provider);
    }

    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }
}
