<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AttendanceRecord extends Model
{
    use Auditable, BelongsToOrganization;

    protected string $auditModule = 'attendance';

    protected $fillable = [
        'employee_id',
        'work_date',
        'clock_in',
        'clock_out',
        'minutes_worked',
        'exception_status',
        'notes',
    ];

    protected $casts = [
        'clock_out' => 'datetime',
        'work_date' => 'date',
        'clock_in' => 'datetime',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
