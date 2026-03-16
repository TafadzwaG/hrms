<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EmployeeContract extends Model
{
    use Auditable, BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'employee_id',
        'contract_number',
        'contract_type',
        'status',
        'start_date',
        'end_date',
        'probation_end_date',
        'job_title',
        'department_id',
        'position_id',
        'pay_point',
        'basic_salary',
        'currency',
        'pay_frequency',
        'working_hours_per_week',
        'notice_period_days',
        'leave_days_per_year',
        'is_current',
        'signed_at',
        'terminated_at',
        'termination_reason',
        'renewal_notes',
        'benefits',
        'metadata',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'probation_end_date' => 'date',
        'signed_at' => 'datetime',
        'terminated_at' => 'datetime',
        'basic_salary' => 'decimal:2',
        'working_hours_per_week' => 'decimal:2',
        'is_current' => 'boolean',
        'benefits' => 'array',
        'metadata' => 'array',
    ];

    public const CONTRACT_TYPES = [
        'permanent',
        'fixed_term',
        'temporary',
        'internship',
        'consultancy',
        'probation',
    ];

    public const STATUSES = [
        'draft',
        'pending_approval',
        'active',
        'expired',
        'terminated',
        'suspended',
        'archived',
    ];

    public const PAY_FREQUENCIES = [
        'weekly',
        'bi_weekly',
        'monthly',
        'quarterly',
        'annually',
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

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(OrgUnit::class, 'department_id');
    }

    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(ContractDocument::class);
    }

    public function auditModule(): string
    {
        return 'employee_contracts';
    }

    public function auditLabel(): string
    {
        return $this->contract_number ?: 'Contract #'.$this->getKey();
    }
}
