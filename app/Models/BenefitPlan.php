<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BenefitPlan extends Model
{
    use Auditable, BelongsToOrganization;

    protected string $auditModule = 'benefits';

    protected $fillable = [
        'organization_id',
        'benefit_id',
        'name',
        'code',
        'description',
        'active',
        'employer_contribution_type',
        'employer_contribution_value',
        'employee_contribution_type',
        'employee_contribution_value',
        'coverage_limit',
        'metadata',
    ];

    protected $casts = [
        'active' => 'boolean',
        'employer_contribution_value' => 'decimal:2',
        'employee_contribution_value' => 'decimal:2',
        'coverage_limit' => 'decimal:2',
        'metadata' => 'array',
    ];

    public function benefit(): BelongsTo
    {
        return $this->belongsTo(Benefit::class);
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(EmployeeBenefitEnrollment::class);
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }
}
