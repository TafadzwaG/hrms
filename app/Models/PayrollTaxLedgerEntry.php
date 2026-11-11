<?php

namespace App\Models;

use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One row per employee and payroll period: what was taxable and what tax was charged.
 * Year-to-date figures for FDS are the sum of an employee's rows for the tax year.
 */
class PayrollTaxLedgerEntry extends Model
{
    use BelongsToOrganization;

    protected $table = 'payroll_tax_ledger';

    protected $fillable = [
        'organization_id',
        'employee_id',
        'payroll_period_id',
        'payroll_run_id',
        'tax_year',
        'period_end',
        'currency',
        'periods_covered',
        'is_opening_balance',
        'tax_method',
        'regular_taxable',
        'irregular_taxable',
        'bonus_gross',
        'bonus_exempt',
        'medical_contributions',
        'credits_applied',
        'paye',
        'aids_levy',
        'standalone_paye',
        'standalone_aids_levy',
        'fds_average_paye',
        'fds_average_aids_levy',
    ];

    protected function casts(): array
    {
        return [
            'period_end' => 'date',
            'is_opening_balance' => 'boolean',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function period(): BelongsTo
    {
        return $this->belongsTo(PayrollPeriod::class, 'payroll_period_id');
    }
}
