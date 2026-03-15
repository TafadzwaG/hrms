<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeePayrollSettlementRule extends Model
{
    use Auditable, BelongsToOrganization;

    protected string $auditModule = 'payroll';

    protected $fillable = [
        'organization_id',
        'employee_payroll_profile_id',
        'currency',
        'allocation_method',
        'amount',
        'percentage',
        'priority',
        'active',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'percentage' => 'decimal:4',
            'active' => 'boolean',
        ];
    }

    public function payrollProfile(): BelongsTo
    {
        return $this->belongsTo(EmployeePayrollProfile::class, 'employee_payroll_profile_id');
    }
}
