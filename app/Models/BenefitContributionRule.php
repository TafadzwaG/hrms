<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BenefitContributionRule extends Model
{
    use Auditable, BelongsToOrganization;

    public const CONTRIBUTION_BASIS = ['fixed', 'percentage_of_basic', 'percentage_of_gross'];

    public const CONTRIBUTION_TYPES = ['fixed', 'percentage'];

    protected $fillable = [
        'organization_id',
        'benefit_id',
        'benefit_plan_id',
        'rule_name',
        'contribution_basis',
        'employer_contribution_type',
        'employer_contribution_value',
        'employee_contribution_type',
        'employee_contribution_value',
        'min_value',
        'max_value',
        'effective_from',
        'effective_to',
        'active',
    ];

    protected $casts = [
        'employer_contribution_value' => 'decimal:2',
        'employee_contribution_value' => 'decimal:2',
        'min_value' => 'decimal:2',
        'max_value' => 'decimal:2',
        'effective_from' => 'date',
        'effective_to' => 'date',
        'active' => 'boolean',
    ];

    protected string $auditModule = 'benefits';

    public function auditLabel(): string
    {
        return $this->rule_name ?: 'Rule #'.$this->getKey();
    }

    public function benefit(): BelongsTo
    {
        return $this->belongsTo(Benefit::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(BenefitPlan::class, 'benefit_plan_id');
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }
}
