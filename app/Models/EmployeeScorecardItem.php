<?php

namespace App\Models;

use App\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeScorecardItem extends Model
{
    use Auditable;

    protected string $auditModule = 'performance';

    protected $fillable = [
        'employee_scorecard_id',
        'kpi_library_id',
        'perspective',
        'objective',
        'kpi_name',
        'target_type',
        'target_value',
        'actual_value',
        'score',
        'weight',
        'self_assessment_score',
        'self_assessment_comment',
        'manager_score',
        'manager_comment',
        'sort_order',
    ];

    protected $casts = [
        'target_value' => 'decimal:2',
        'actual_value' => 'decimal:2',
        'score' => 'decimal:2',
        'weight' => 'decimal:2',
        'self_assessment_score' => 'decimal:2',
        'manager_score' => 'decimal:2',
        'sort_order' => 'integer',
    ];

    public function scorecard(): BelongsTo
    {
        return $this->belongsTo(EmployeeScorecard::class, 'employee_scorecard_id');
    }

    public function kpi(): BelongsTo
    {
        return $this->belongsTo(KpiLibrary::class, 'kpi_library_id');
    }

    public function calculateScore(): float
    {
        $target = (float) $this->target_value;
        $actual = (float) $this->actual_value;

        $score = match ($this->target_type) {
            'percentage' => $target > 0 ? ($actual / $target) * 100 : 0,
            'numeric' => $target > 0 ? min(($actual / $target) * 100, 100) : 0,
            'yes_no' => $actual >= 1 ? 100 : 0,
            'rating_scale' => ($actual / 5) * 100,
            default => $this->score ?? 0,
        };

        $this->score = $score;

        return (float) $score;
    }
}
