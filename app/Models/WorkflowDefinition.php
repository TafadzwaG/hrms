<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
class WorkflowDefinition extends Model
{    protected $fillable = [
        'name',
        'request_type',
        'steps_json',
        'sla_hours',
        'status'
    ];
}

