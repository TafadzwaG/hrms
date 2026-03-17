<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KpiLibrary extends Model
{
    use Auditable, BelongsToOrganization;

    protected string $auditModule = 'performance';

    protected $table = 'kpi_library';

    public const PERSPECTIVES = [
        'financial',
        'customer',
        'internal_process',
        'learning_and_growth',
    ];

    public const TARGET_TYPES = [
        'percentage',
        'numeric',
        'yes_no',
        'rating_scale',
        'sla_time',
        'currency',
        'custom',
    ];

    protected $fillable = [
        'organization_id',
        'name',
        'code',
        'perspective',
        'description',
        'target_type',
        'default_target',
        'default_weight',
        'unit',
        'is_active',
    ];

    protected $casts = [
        'default_target' => 'decimal:2',
        'default_weight' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function templateItems(): HasMany
    {
        return $this->hasMany(ScorecardTemplateItem::class);
    }

    public function scorecardItems(): HasMany
    {
        return $this->hasMany(EmployeeScorecardItem::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeByPerspective(Builder $query, string $perspective): Builder
    {
        return $query->where('perspective', $perspective);
    }
}
