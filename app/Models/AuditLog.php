<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class AuditLog extends Model
{
    public const UPDATED_AT = null;

    protected $fillable = [
        'actor_type',
        'actor_id',
        'actor_name',
        'event',
        'module',
        'category',
        'auditable_type',
        'auditable_id',
        'auditable_label',
        'description',
        'old_values',
        'new_values',
        'metadata',
        'request_method',
        'route_name',
        'url',
        'ip_address',
        'user_agent',
        'tags',
        'batch_id',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'old_values' => 'array',
            'new_values' => 'array',
            'metadata' => 'array',
            'tags' => 'array',
            'created_at' => 'datetime',
        ];
    }

    public function actor(): MorphTo
    {
        return $this->morphTo();
    }

    public function auditable(): MorphTo
    {
        return $this->morphTo();
    }

    public function isCritical(): bool
    {
        return in_array($this->event, config('audit.critical_events', []), true);
    }
}
