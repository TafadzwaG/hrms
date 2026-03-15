<?php

namespace App\Models;

use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PayrollResultSettlement extends Model
{
    use BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'payroll_run_id',
        'payroll_period_id',
        'payroll_result_id',
        'employee_payroll_settlement_rule_id',
        'base_currency',
        'currency',
        'allocation_method',
        'base_amount',
        'settlement_amount',
        'exchange_rate',
        'sort_order',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'base_amount' => 'decimal:2',
            'settlement_amount' => 'decimal:2',
            'exchange_rate' => 'decimal:8',
            'metadata' => 'array',
        ];
    }

    public function result(): BelongsTo
    {
        return $this->belongsTo(PayrollResult::class, 'payroll_result_id');
    }

    public function run(): BelongsTo
    {
        return $this->belongsTo(PayrollRun::class, 'payroll_run_id');
    }

    public function period(): BelongsTo
    {
        return $this->belongsTo(PayrollPeriod::class, 'payroll_period_id');
    }

    public function sourceRule(): BelongsTo
    {
        return $this->belongsTo(EmployeePayrollSettlementRule::class, 'employee_payroll_settlement_rule_id');
    }
}
