<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
class OffboardingTask extends Model
{    protected $fillable = [
        'employee_id',
        'task_name',
        'owner_team',
        'due_date',
        'status',
        'notes'
    ];
    protected $casts = [
        'due_date' => 'date'
    ];
}

