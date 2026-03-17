<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class EmployeeScorecard extends Model
{
    use Auditable, BelongsToOrganization;

    protected string $auditModule = 'performance';

    public const STATUSES = [
        'draft',
        'self_assessment_pending',
        'self_assessment_submitted',
        'manager_review_pending',
        'manager_reviewed',
        'hr_moderation_pending',
        'finalized',
        'archived',
    ];

    public const RATING_BANDS = [
        'Outstanding' => [90, 100],
        'Very Good' => [75, 89.99],
        'Good' => [60, 74.99],
        'Needs Improvement' => [40, 59.99],
        'Unsatisfactory' => [0, 39.99],
    ];

    protected $fillable = [
        'organization_id',
        'performance_cycle_id',
        'employee_id',
        'scorecard_template_id',
        'status',
        'overall_score',
        'overall_rating',
        'financial_score',
        'customer_score',
        'internal_process_score',
        'learning_growth_score',
        'self_assessment_completed_at',
        'manager_review_completed_at',
        'finalized_at',
        'finalized_by',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'overall_score' => 'decimal:2',
        'financial_score' => 'decimal:2',
        'customer_score' => 'decimal:2',
        'internal_process_score' => 'decimal:2',
        'learning_growth_score' => 'decimal:2',
        'self_assessment_completed_at' => 'datetime',
        'manager_review_completed_at' => 'datetime',
        'finalized_at' => 'datetime',
    ];

    public function cycle(): BelongsTo
    {
        return $this->belongsTo(PerformanceCycle::class, 'performance_cycle_id');
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(ScorecardTemplate::class, 'scorecard_template_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(EmployeeScorecardItem::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(PerformanceComment::class);
    }

    public function evidence(): HasMany
    {
        return $this->hasMany(PerformanceEvidence::class);
    }

    public function improvementPlan(): HasOne
    {
        return $this->hasOne(PerformanceImprovementPlan::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(PerformanceReview::class);
    }

    public function finalizer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'finalized_by');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function calculateOverallScore(): void
    {
        $perspectives = [
            'financial' => 'financial_score',
            'customer' => 'customer_score',
            'internal_process' => 'internal_process_score',
            'learning_and_growth' => 'learning_growth_score',
        ];

        $totalWeightedScore = 0;
        $totalWeight = 0;

        foreach ($perspectives as $perspective => $scoreField) {
            $items = $this->items()->where('perspective', $perspective)->get();

            if ($items->isEmpty()) {
                continue;
            }

            $perspectiveWeight = $items->sum('weight');
            $perspectiveScore = 0;

            foreach ($items as $item) {
                $perspectiveScore += ($item->score ?? 0) * ($item->weight ?? 0);
            }

            if ($perspectiveWeight > 0) {
                $perspectiveScore = $perspectiveScore / $perspectiveWeight;
            }

            $this->{$scoreField} = $perspectiveScore;
            $totalWeightedScore += $perspectiveScore * $perspectiveWeight;
            $totalWeight += $perspectiveWeight;
        }

        $this->overall_score = $totalWeight > 0 ? $totalWeightedScore / $totalWeight : 0;
        $this->overall_rating = static::ratingBandFor((float) $this->overall_score);

        $this->save();
    }

    public static function ratingBandFor(float $score): string
    {
        foreach (static::RATING_BANDS as $band => [$min, $max]) {
            if ($score >= $min && $score <= $max) {
                return $band;
            }
        }

        return 'Unsatisfactory';
    }
}
