<?php

namespace App\Models;

use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PayrollResult extends Model
{
    use BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'payroll_run_id',
        'payroll_period_id',
        'employee_id',
        'employee_payroll_profile_id',
        'staff_number_snapshot',
        'employee_name_snapshot',
        'department_snapshot',
        'position_snapshot',
        'pay_point_snapshot',
        'currency_snapshot',
        'bank_account_name_snapshot',
        'bank_account_number_snapshot',
        'bank_name_snapshot',
        'tax_number_snapshot',
        'basic_salary_snapshot',
        'gross_pay',
        'pre_tax_deductions',
        'taxable_income',
        'tax_amount',
        'statutory_deductions',
        'voluntary_deductions',
        'total_deductions',
        'net_pay',
        'status',
        'snapshot',
    ];

    protected function casts(): array
    {
        return [
            'basic_salary_snapshot' => 'decimal:2',
            'gross_pay' => 'decimal:2',
            'pre_tax_deductions' => 'decimal:2',
            'taxable_income' => 'decimal:2',
            'tax_amount' => 'decimal:2',
            'statutory_deductions' => 'decimal:2',
            'voluntary_deductions' => 'decimal:2',
            'total_deductions' => 'decimal:2',
            'net_pay' => 'decimal:2',
            'snapshot' => 'array',
        ];
    }

    public function run(): BelongsTo
    {
        return $this->belongsTo(PayrollRun::class, 'payroll_run_id');
    }

    public function period(): BelongsTo
    {
        return $this->belongsTo(PayrollPeriod::class, 'payroll_period_id');
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function payrollProfile(): BelongsTo
    {
        return $this->belongsTo(EmployeePayrollProfile::class, 'employee_payroll_profile_id');
    }

    public function lines(): HasMany
    {
        return $this->hasMany(PayrollResultLine::class)->orderBy('sort_order');
    }

    public function settlements(): HasMany
    {
        return $this->hasMany(PayrollResultSettlement::class)->orderBy('sort_order')->orderBy('currency');
    }

    public function deliveries(): HasMany
    {
        return $this->hasMany(PayslipDelivery::class)->orderByDesc('created_at')->orderByDesc('id');
    }
}
