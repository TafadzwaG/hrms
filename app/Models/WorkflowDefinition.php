<?php

namespace App\Models;

use App\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;

class WorkflowDefinition extends Model
{
    use Auditable;

    protected string $auditModule = 'workflows';

    protected $fillable = [
        'name',
        'request_type',
        'steps_json',
        'sla_hours',
        'status',
    ];
}

