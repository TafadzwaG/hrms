<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AssetVendor extends Model
{
    use Auditable, BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'name',
        'code',
        'contact_person',
        'email',
        'phone',
        'address',
        'website',
        'notes',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function assets(): HasMany
    {
        return $this->hasMany(Asset::class);
    }

    public function maintenanceRecords(): HasMany
    {
        return $this->hasMany(AssetMaintenanceRecord::class, 'vendor_id');
    }

    public function auditModule(): string
    {
        return 'asset_vendors';
    }

    public function auditLabel(): string
    {
        return $this->name ?: 'Vendor #'.$this->getKey();
    }
}
