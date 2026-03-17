<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PerformanceImprovementPlan extends Model
{
    use Auditable, BelongsToOrganization;

    protected string $auditModule = 'performance';

    public const STATUSES = [
        'active',
        'on_track',
        'at_risk',
        'completed',
        'cancelled',
    ];

    protected $fillable = [
        'organization_id',
        'employee_scorecard_id',
        'employee_id',
        'title',
        'description',
        'objectives',
        'support_required',
        'start_date',
        'end_date',
        'status',
        'outcome',
        'created_by',
        'completed_at',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'completed_at' => 'datetime',
    ];

    public function scorecard(): BelongsTo
    {
        return $this->belongsTo(EmployeeScorecard::class, 'employee_scorecard_id');
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
