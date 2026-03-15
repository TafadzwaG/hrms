<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Timesheet extends Model
{
    use Auditable, BelongsToOrganization;

    protected $fillable = [
        'employee_id',
        'period_start',
        'period_end',
        'total_minutes',
        'overtime_minutes',
        'status',
        'approved_by',
    ];

    protected $casts = [
        'period_end' => 'date',
        'period_start' => 'date',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
