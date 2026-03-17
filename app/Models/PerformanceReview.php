<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PerformanceReview extends Model
{
    use Auditable, BelongsToOrganization;

    protected string $auditModule = 'performance';

    protected $fillable = [
        'organization_id',
        'employee_id',
        'performance_cycle_id',
        'employee_scorecard_id',
        'cycle_name',
        'reviewer_name',
        'rating',
        'status',
        'review_date',
        'comments',
    ];

    protected $casts = [
        'rating' => 'decimal:2',
        'review_date' => 'date',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function cycle(): BelongsTo
    {
        return $this->belongsTo(PerformanceCycle::class, 'performance_cycle_id');
    }

    public function scorecard(): BelongsTo
    {
        return $this->belongsTo(EmployeeScorecard::class, 'employee_scorecard_id');
    }
}
