<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
class JobRequisition extends Model
{    protected $fillable = [
        'requisition_code',
        'title',
        'department',
        'hiring_manager',
        'openings',
        'status',
        'target_start_date'
    ];
    protected $casts = [
        'target_start_date' => 'date'
    ];
}

