<?php

namespace App\Models;

use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PayrollResultLine extends Model
{
    use BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'payroll_result_id',
        'pay_code_id',
        'code_snapshot',
        'description_snapshot',
        'type',
        'category',
        'input_source',
        'amount',
        'quantity',
        'rate',
        'taxable',
        'affects_gross',
        'affects_net',
        'sort_order',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'quantity' => 'decimal:4',
            'rate' => 'decimal:4',
            'taxable' => 'boolean',
            'affects_gross' => 'boolean',
            'affects_net' => 'boolean',
            'metadata' => 'array',
        ];
    }

    public function result(): BelongsTo
    {
        return $this->belongsTo(PayrollResult::class, 'payroll_result_id');
    }

    public function payCode(): BelongsTo
    {
        return $this->belongsTo(PayCode::class);
    }
}
