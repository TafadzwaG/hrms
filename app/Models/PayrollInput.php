<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PayrollInput extends Model
{
    use Auditable, BelongsToOrganization;

    protected string $auditModule = 'payroll';

    protected $fillable = [
        'organization_id',
        'payroll_period_id',
        'employee_id',
        'pay_code_id',
        'payroll_input_batch_id',
        'input_mode',
        'amount',
        'quantity',
        'rate',
        'work_date',
        'cost_centre',
        'source',
        'reference',
        'notes',
        'created_by',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'quantity' => 'decimal:4',
            'rate' => 'decimal:4',
            'work_date' => 'date',
        ];
    }

    public function period(): BelongsTo
    {
        return $this->belongsTo(PayrollPeriod::class, 'payroll_period_id');
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function payCode(): BelongsTo
    {
        return $this->belongsTo(PayCode::class);
    }

    public function batch(): BelongsTo
    {
        return $this->belongsTo(PayrollInputBatch::class, 'payroll_input_batch_id');
    }

    /**
     * The amount this input adds to the payslip: the fixed amount, or quantity x rate.
     */
    public function resolvedAmount(): float
    {
        if ($this->amount !== null) {
            return round((float) $this->amount, 2);
        }

        if ($this->quantity !== null && $this->rate !== null) {
            return round((float) $this->quantity * (float) $this->rate, 2);
        }

        return 0.0;
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
