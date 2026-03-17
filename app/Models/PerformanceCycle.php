<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PerformanceCycle extends Model
{
    use Auditable, BelongsToOrganization;

    protected string $auditModule = 'performance';

    public const STATUSES = [
        'draft',
        'active',
        'review_in_progress',
        'moderation',
        'finalized',
        'archived',
    ];

    protected $fillable = [
        'organization_id',
        'title',
        'description',
        'start_date',
        'end_date',
        'status',
        'self_assessment_enabled',
        'created_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'self_assessment_enabled' => 'boolean',
    ];

    public function scorecards(): HasMany
    {
        return $this->hasMany(EmployeeScorecard::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
