<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeRecurringPayItem extends Model
{
    use Auditable, BelongsToOrganization;

    protected string $auditModule = 'payroll';

    protected $fillable = [
        'organization_id',
        'employee_id',
        'employee_payroll_profile_id',
        'pay_code_id',
        'input_mode',
        'amount',
        'quantity',
        'rate',
        'effective_from',
        'effective_to',
        'is_active',
        'reference',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'quantity' => 'decimal:4',
            'rate' => 'decimal:4',
            'effective_from' => 'date',
            'effective_to' => 'date',
            'is_active' => 'boolean',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(EmployeePayrollProfile::class, 'employee_payroll_profile_id');
    }

    public function payCode(): BelongsTo
    {
        return $this->belongsTo(PayCode::class);
    }

    public function scopeEffectiveFor(Builder $query, string $date): Builder
    {
        return $query
            ->whereDate('effective_from', '<=', $date)
            ->where(function (Builder $builder) use ($date): void {
                $builder->whereNull('effective_to')
                    ->orWhereDate('effective_to', '>=', $date);
            });
    }
}
