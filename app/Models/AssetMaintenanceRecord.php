<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssetMaintenanceRecord extends Model
{
    use Auditable, BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'asset_id',
        'maintenance_type',
        'title',
        'description',
        'vendor_id',
        'performed_by',
        'cost',
        'currency',
        'scheduled_date',
        'started_at',
        'completed_at',
        'next_maintenance_date',
        'status',
        'notes',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'scheduled_date' => 'date',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'next_maintenance_date' => 'date',
        'cost' => 'decimal:2',
    ];

    public const TYPES = [
        'preventive',
        'corrective',
        'inspection',
        'calibration',
    ];

    public const STATUSES = [
        'scheduled',
        'in_progress',
        'completed',
        'cancelled',
    ];

    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(AssetVendor::class, 'vendor_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function auditModule(): string
    {
        return 'asset_maintenance';
    }

    public function auditLabel(): string
    {
        return $this->title ?: 'Maintenance #'.$this->getKey();
    }
}
