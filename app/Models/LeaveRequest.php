<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeaveRequest extends Model
{
    use Auditable, BelongsToOrganization;

    protected string $auditModule = 'leave';

    protected $fillable = [
        'employee_id',
        'leave_type',
        'start_date',
        'end_date',
        'days',
        'status',
        'reason',
        'approver_name',
    ];

    protected $casts = [
        'days' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
    ];


    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
