<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Asset extends Model
{
    use Auditable, BelongsToOrganization, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'asset_category_id',
        'asset_vendor_id',
        'asset_location_id',
        'asset_tag',
        'serial_number',
        'name',
        'description',
        'status',
        'condition',
        'purchase_date',
        'purchase_price',
        'currency',
        'warranty_expiry_date',
        'warranty_notes',
        'depreciation_method',
        'useful_life_years',
        'depreciation_rate',
        'salvage_value',
        'book_value',
        'barcode',
        'image_path',
        'notes',
        'metadata',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'purchase_date' => 'date',
        'warranty_expiry_date' => 'date',
        'purchase_price' => 'decimal:2',
        'salvage_value' => 'decimal:2',
        'book_value' => 'decimal:2',
        'depreciation_rate' => 'decimal:4',
        'metadata' => 'array',
    ];

    public const STATUSES = [
        'available',
        'assigned',
        'in_maintenance',
        'retired',
        'disposed',
        'lost',
        'damaged',
    ];

    public const CONDITIONS = [
        'new',
        'good',
        'fair',
        'poor',
        'non_functional',
    ];

    public const DEPRECIATION_METHODS = [
        'straight_line',
        'declining_balance',
        'sum_of_years',
        'units_of_production',
        'none',
    ];

    public const CURRENCIES = [
        'USD',
        'EUR',
        'GBP',
        'ZAR',
        'BWP',
        'KES',
        'NGN',
        'GHS',
        'TZS',
        'UGX',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(AssetCategory::class, 'asset_category_id');
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(AssetVendor::class, 'asset_vendor_id');
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(AssetLocation::class, 'asset_location_id');
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(AssetAssignment::class)->orderByDesc('assigned_at');
    }

    public function currentAssignment(): HasOne
    {
        return $this->hasOne(AssetAssignment::class)->where('status', 'active');
    }

    public function maintenanceRecords(): HasMany
    {
        return $this->hasMany(AssetMaintenanceRecord::class)->orderByDesc('created_at');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(AssetDocument::class);
    }

    public function statusHistory(): HasMany
    {
        return $this->hasMany(AssetStatusHistory::class)->orderByDesc('created_at');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    // ── Scopes ───────────────────────────────────────────────

    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    public function scopeAssigned($query)
    {
        return $query->where('status', 'assigned');
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function auditModule(): string
    {
        return 'assets';
    }

    public function auditLabel(): string
    {
        return $this->asset_tag ?: 'Asset #'.$this->getKey();
    }
}
