<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, HasMany, BelongsToMany};

class OrgUnit extends Model
{
    protected $table = 'org_units';

    protected $fillable = [
        'name',
        'type',           // COMPANY, SBU, DEPARTMENT, TEAM
        'parent_id',
        'code',
        'cost_center',
        'effective_from',
        'effective_to',
    ];

    protected $casts = [
        'effective_from' => 'date',
        'effective_to'   => 'date',
    ];

    public const TYPES = [
        'COMPANY',
        'SBU',
        'DEPARTMENT',
        'TEAM',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(OrgUnit::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(OrgUnit::class, 'parent_id');
    }

    public function locations(): BelongsToMany
    {
        return $this->belongsToMany(Location::class, 'org_unit_locations')
            ->withPivot(['is_primary', 'effective_from', 'effective_to'])
            ->withTimestamps();
    }
}