<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BenefitContributionRule extends Model
{
    use Auditable, BelongsToOrganization;

    protected string $auditModule = 'benefits';

    public const CONTRIBUTION_TYPES = [
        'fixed',
        'percentage_of_basic',
        'percentage_of_gross',
        'percentage_of_net',
    ];

    public const CONTRIBUTION_BASIS = [
        'salary',
        'fixed',
        'sliding_scale',
    ];

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

    public function benefit(): BelongsTo
    {
        return $this->belongsTo(Benefit::class);
    }

    public function benefitPlan(): BelongsTo
    {
        return $this->belongsTo(BenefitPlan::class);
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }
}
