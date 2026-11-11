<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Tax-year amounts a payroll specialist enters: the tax-free bonus amount and the
 * credits. organization_id is null for system-wide rows, so no tenant scope.
 */
class PayrollTaxSetting extends Model
{
    protected $fillable = [
        'organization_id',
        'currency',
        'effective_from',
        'effective_to',
        'bonus_tax_free_amount',
        'elderly_credit_annual',
        'blind_credit_annual',
        'disabled_credit_annual',
        'medical_credit_percent',
        'retrenchment_exempt_percent',
        'retrenchment_exempt_minimum',
        'retrenchment_exempt_cap',
        'source',
        'verified_at',
        'verified_by',
    ];

    protected function casts(): array
    {
        return [
            'effective_from' => 'date',
            'effective_to' => 'date',
            'bonus_tax_free_amount' => 'decimal:2',
            'elderly_credit_annual' => 'decimal:2',
            'blind_credit_annual' => 'decimal:2',
            'disabled_credit_annual' => 'decimal:2',
            'medical_credit_percent' => 'decimal:3',
            'retrenchment_exempt_percent' => 'decimal:4',
            'retrenchment_exempt_minimum' => 'decimal:2',
            'retrenchment_exempt_cap' => 'decimal:2',
            'verified_at' => 'datetime',
        ];
    }
}
