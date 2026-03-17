<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ScorecardTemplate extends Model
{
    use Auditable, BelongsToOrganization;

    protected string $auditModule = 'performance';

    public const SCOPE_TYPES = [
        'organization',
        'department',
        'position',
        'pay_point',
    ];

    protected $fillable = [
        'organization_id',
        'name',
        'description',
        'is_active',
        'scope_type',
        'scope_value',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(ScorecardTemplateItem::class);
    }

    public function scorecards(): HasMany
    {
        return $this->hasMany(EmployeeScorecard::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
