<?php

namespace App\Models;

use App\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PerformanceComment extends Model
{
    use Auditable;

    protected string $auditModule = 'performance';

    public const TYPES = [
        'general',
        'self_assessment',
        'manager_review',
        'moderation',
        'feedback',
    ];

    protected $fillable = [
        'employee_scorecard_id',
        'user_id',
        'comment',
        'type',
    ];

    public function scorecard(): BelongsTo
    {
        return $this->belongsTo(EmployeeScorecard::class, 'employee_scorecard_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
