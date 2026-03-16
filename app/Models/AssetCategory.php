<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AssetCategory extends Model
{
    use Auditable, BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'parent_id',
        'name',
        'code',
        'description',
        'depreciation_method',
        'useful_life_years',
        'depreciation_rate',
    ];

    protected $casts = [
        'depreciation_rate' => 'decimal:4',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(AssetCategory::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(AssetCategory::class, 'parent_id');
    }

    public function assets(): HasMany
    {
        return $this->hasMany(Asset::class);
    }

    public function auditModule(): string
    {
        return 'asset_categories';
    }

    public function auditLabel(): string
    {
        return $this->name ?: 'Category #'.$this->getKey();
    }
}
