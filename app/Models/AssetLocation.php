<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AssetLocation extends Model
{
    use Auditable, BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'name',
        'code',
        'address',
        'building',
        'floor',
        'room',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function assets(): HasMany
    {
        return $this->hasMany(Asset::class);
    }

    public function auditModule(): string
    {
        return 'asset_locations';
    }

    public function auditLabel(): string
    {
        return $this->name ?: 'Location #'.$this->getKey();
    }
}
