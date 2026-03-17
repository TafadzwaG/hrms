<?php

namespace App\Models;

use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BenefitChangeLog extends Model
{
    use BelongsToOrganization;

    public const EVENTS = ['enrolled', 'updated', 'suspended', 'terminated', 'reinstated', 'cancelled', 'plan_changed', 'contribution_changed'];

    protected $fillable = [
        'organization_id',
        'employee_benefit_enrollment_id',
        'event',
        'from_status',
        'to_status',
        'from_values',
        'to_values',
        'reason',
        'changed_by',
    ];

    protected $casts = [
        'from_values' => 'array',
        'to_values' => 'array',
    ];

    public function enrollment(): BelongsTo
    {
        return $this->belongsTo(EmployeeBenefitEnrollment::class, 'employee_benefit_enrollment_id');
    }

    public function changer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
