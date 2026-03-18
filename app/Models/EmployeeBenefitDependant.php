<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeBenefitDependant extends Model
{
    use Auditable, BelongsToOrganization;

    protected string $auditModule = 'benefits';

    public const RELATIONSHIPS = [
        'spouse',
        'child',
        'parent',
        'sibling',
        'guardian',
        'other',
    ];

    protected $fillable = [
        'organization_id',
        'employee_benefit_enrollment_id',
        'full_name',
        'relationship',
        'date_of_birth',
        'national_id',
        'contact_number',
        'effective_date',
        'end_date',
        'status',
        'notes',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'effective_date' => 'date',
        'end_date' => 'date',
    ];

    public function enrollment(): BelongsTo
    {
        return $this->belongsTo(EmployeeBenefitEnrollment::class, 'employee_benefit_enrollment_id');
    }
}
