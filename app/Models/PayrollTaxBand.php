<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PayrollTaxBand extends Model
{
    protected $fillable = [
        'payroll_tax_table_id',
        'lower_bound',
        'upper_bound',
        'rate_percent',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'lower_bound' => 'decimal:2',
            'upper_bound' => 'decimal:2',
            'rate_percent' => 'decimal:3',
        ];
    }

    public function table(): BelongsTo
    {
        return $this->belongsTo(PayrollTaxTable::class, 'payroll_tax_table_id');
    }
}
