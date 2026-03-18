<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EmployeeBenefitEnrollment extends Model
{
    use Auditable, BelongsToOrganization;

    protected string $auditModule = 'benefits';

    public const STATUSES = [
        'draft',
        'active',
        'suspended',
        'terminated',
        'expired',
        'cancelled',
    ];

    protected $fillable = [
        'organization_id',
        'employee_id',
        'benefit_id',
        'benefit_plan_id',
        'status',
        'effective_date',
        'end_date',
        'employee_contribution',
        'employer_contribution',
        'payroll_deduction_code',
        'enrollment_reference',
        'notes',
        'metadata',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'effective_date' => 'date',
        'end_date' => 'date',
        'employee_contribution' => 'decimal:2',
        'employer_contribution' => 'decimal:2',
        'metadata' => 'array',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function benefit(): BelongsTo
    {
        return $this->belongsTo(Benefit::class);
    }

    public function benefitPlan(): BelongsTo
    {
        return $this->belongsTo(BenefitPlan::class);
    }

    public function dependants(): HasMany
    {
        return $this->hasMany(EmployeeBenefitDependant::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(BenefitDocument::class);
    }

    public function changeLogs(): HasMany
    {
        return $this->hasMany(BenefitChangeLog::class)->orderByDesc('created_at');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }
}
