<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;

class WorkflowDefinition extends Model
{
    use Auditable, BelongsToOrganization;

    protected string $auditModule = 'workflows';

    protected $fillable = [
        'name',
        'request_type',
        'steps_json',
        'sla_hours',
        'status',
    ];
}

