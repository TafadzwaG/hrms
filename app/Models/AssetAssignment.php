<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssetAssignment extends Model
{
    use Auditable, BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'asset_id',
        'employee_id',
        'assigned_by',
        'returned_to',
        'assigned_at',
        'expected_return_date',
        'returned_at',
        'condition_on_assignment',
        'condition_on_return',
        'notes',
        'return_notes',
        'status',
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
        'expected_return_date' => 'date',
        'returned_at' => 'datetime',
    ];

    public const STATUSES = [
        'active',
        'returned',
        'overdue',
    ];

    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function assignedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    public function returnedToUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'returned_to');
    }

    public function auditModule(): string
    {
        return 'asset_assignments';
    }

    public function auditLabel(): string
    {
        return 'Assignment #'.$this->getKey();
    }
}
