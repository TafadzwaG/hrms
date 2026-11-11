<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * A dated PAYE table for one currency and pay frequency.
 *
 * organization_id is null for system-wide tables, so this model deliberately
 * does not use the tenant scope.
 */
class PayrollTaxTable extends Model
{
    protected $fillable = [
        'organization_id',
        'name',
        'currency',
        'pay_frequency',
        'effective_from',
        'effective_to',
        'aids_levy_percent',
        'source',
        'verified_at',
        'verified_by',
    ];

    protected function casts(): array
    {
        return [
            'effective_from' => 'date',
            'effective_to' => 'date',
            'aids_levy_percent' => 'decimal:3',
            'verified_at' => 'datetime',
        ];
    }

    public function bands(): HasMany
    {
        return $this->hasMany(PayrollTaxBand::class)->orderBy('sort_order')->orderBy('lower_bound');
    }
}
