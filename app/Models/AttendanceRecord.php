<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AttendanceRecord extends Model
{
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
