<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CandidateProfile extends Model
{
    use Auditable, BelongsToOrganization;

    protected string $auditModule = 'candidates';

    protected $fillable = [
        'requisition_code',
        'full_name',
        'email',
        'phone',
        'stage',
        'status',
        'notes',
    ];

    public function requisition(): BelongsTo
    {
        return $this->belongsTo(JobRequisition::class, 'requisition_code', 'requisition_code');
    }
}
