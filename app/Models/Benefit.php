<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Benefit extends Model
{
    use Auditable, BelongsToOrganization, SoftDeletes;

    public const CATEGORIES = ['health', 'retirement', 'allowance', 'insurance', 'wellness', 'education', 'loan', 'other'];

    public const TYPES = ['employer_paid', 'employee_paid', 'shared', 'reimbursement', 'non_cash'];

    public const CONTRIBUTION_TYPES = ['fixed', 'percentage'];

    protected $fillable = [
        'organization_id',
        'code',
        'name',
        'category',
        'description',
        'benefit_type',
        'taxable',
        'cash_benefit',
        'employer_funded',
        'employee_funded',
        'shared_contribution',
        'requires_dependants',
        'requires_plan_selection',
        'payroll_deductible',
        'active',
        'effective_from',
        'effective_to',
        'metadata',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'taxable' => 'boolean',
        'cash_benefit' => 'boolean',
        'employer_funded' => 'boolean',
        'employee_funded' => 'boolean',
        'shared_contribution' => 'boolean',
        'requires_dependants' => 'boolean',
        'requires_plan_selection' => 'boolean',
        'payroll_deductible' => 'boolean',
        'active' => 'boolean',
        'effective_from' => 'date',
        'effective_to' => 'date',
        'metadata' => 'array',
    ];

    protected string $auditModule = 'benefits';

    public function auditLabel(): string
    {
        return $this->name ?: 'Benefit #'.$this->getKey();
    }

    public function plans(): HasMany
    {
        return $this->hasMany(BenefitPlan::class);
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(EmployeeBenefitEnrollment::class);
    }

    public function contributionRules(): HasMany
    {
        return $this->hasMany(BenefitContributionRule::class);
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
        return $query->where('active', true);
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('benefit_type', $type);
    }
}
