<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EmployeePayrollProfile extends Model
{
    use Auditable, BelongsToOrganization;

    protected string $auditModule = 'payroll';

    protected array $auditRedact = [
        'bank_account_number',
        'tax_number',
        'pension_number',
        'nssa_number',
        'nec_number',
        'union_number',
    ];

    protected $fillable = [
        'organization_id',
        'employee_id',
        'pay_frequency',
        'currency',
        'basic_salary',
        'hourly_rate',
        'overtime_multiplier',
        'bank_name',
        'bank_branch',
        'bank_account_name',
        'bank_account_number',
        'bank_account_type',
        'tax_number',
        'tax_table',
        'pension_number',
        'pension_percent',
        'nssa_number',
        'nssa_percent',
        'nec_number',
        'nec_percent',
        'union_number',
        'union_percent',
        'cost_centre',
        'employment_status',
        'tax_enabled',
        'active',
        'effective_from',
        'effective_to',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'basic_salary' => 'decimal:2',
            'hourly_rate' => 'decimal:2',
            'overtime_multiplier' => 'decimal:2',
            'pension_percent' => 'decimal:4',
            'nssa_percent' => 'decimal:4',
            'nec_percent' => 'decimal:4',
            'union_percent' => 'decimal:4',
            'tax_enabled' => 'boolean',
            'active' => 'boolean',
            'effective_from' => 'date',
            'effective_to' => 'date',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function recurringItems(): HasMany
    {
        return $this->hasMany(EmployeeRecurringPayItem::class);
    }

    public function settlementRules(): HasMany
    {
        return $this->hasMany(EmployeePayrollSettlementRule::class)->orderBy('priority')->orderBy('currency');
    }

    public function results(): HasMany
    {
        return $this->hasMany(PayrollResult::class);
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
