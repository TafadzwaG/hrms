<?php

namespace App\Http\Controllers\Reports;

use App\Models\EmployeeScorecard;
use App\Models\EmployeeScorecardItem;
use App\Models\PerformanceImprovementPlan;
use Illuminate\Http\Request;

class PerformanceScorecardReportController extends BaseReportController
{
    public function scorecardRegister(Request $request)
    {
        $headers = [
            'employee_name',
            'staff_number',
            'cycle',
            'status',
            'overall_score',
            'overall_rating',
            'financial_score',
            'customer_score',
            'internal_process_score',
            'learning_growth_score',
            'finalized_at',
        ];

        $query = EmployeeScorecard::query()
            ->with([
                'employee:id,first_name,middle_name,surname,staff_number',
                'cycle:id,title',
            ]);

        $this->applyDateRange($query, $request, 'created_at');

        $rows = $query
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (EmployeeScorecard $sc) => [
                'employee_name' => $sc->employee
                    ? trim("{$sc->employee->first_name} {$sc->employee->middle_name} {$sc->employee->surname}")
                    : '',
                'staff_number' => $sc->employee?->staff_number ?? '',
                'cycle' => $sc->cycle?->title ?? '',
                'status' => $sc->status,
                'overall_score' => $sc->overall_score,
                'overall_rating' => $sc->overall_rating,
                'financial_score' => $sc->financial_score,
                'customer_score' => $sc->customer_score,
                'internal_process_score' => $sc->internal_process_score,
                'learning_growth_score' => $sc->learning_growth_score,
                'finalized_at' => $this->normalizeCellValue($sc->finalized_at),
            ])
            ->all();

        return $this->exportRows($request, 'scorecard-register', $headers, $rows);
    }

    public function byPerspective(Request $request)
    {
        $headers = ['perspective', 'items_count', 'average_score', 'total_weight'];

        $items = EmployeeScorecardItem::query()
            ->whereHas('scorecard', fn ($q) => $q->where('status', 'finalized'))
            ->get(['perspective', 'score', 'weight']);

        $rows = $items
            ->groupBy('perspective')
            ->map(fn ($group, $perspective) => [
                'perspective' => $perspective,
                'items_count' => $group->count(),
                'average_score' => round((float) $group->avg('score'), 2),
                'total_weight' => round((float) $group->sum('weight'), 2),
            ])
            ->values()
            ->all();

        return $this->exportRows($request, 'scorecard-by-perspective', $headers, $rows);
    }

    public function byCycle(Request $request)
    {
        $headers = ['cycle', 'total_scorecards', 'finalized', 'average_score'];

        $scorecards = EmployeeScorecard::query()
            ->with('cycle:id,title')
            ->get(['id', 'performance_cycle_id', 'status', 'overall_score']);

        $rows = $scorecards
            ->groupBy('performance_cycle_id')
            ->map(function ($group) {
                $first = $group->first();

                return [
                    'cycle' => $first->cycle?->title ?? 'Unknown',
                    'total_scorecards' => $group->count(),
                    'finalized' => $group->where('status', 'finalized')->count(),
                    'average_score' => round((float) $group->where('status', 'finalized')->avg('overall_score'), 2),
                ];
            })
            ->values()
            ->all();

        return $this->exportRows($request, 'scorecard-by-cycle', $headers, $rows);
    }

    public function byRating(Request $request)
    {
        $headers = ['rating', 'count'];

        $scorecards = EmployeeScorecard::query()
            ->where('status', 'finalized')
            ->whereNotNull('overall_rating')
            ->get(['overall_rating']);

        $rows = [];
        foreach (array_keys(EmployeeScorecard::RATING_BANDS) as $band) {
            $rows[] = [
                'rating' => $band,
                'count' => $scorecards->where('overall_rating', $band)->count(),
            ];
        }

        return $this->exportRows($request, 'scorecard-by-rating', $headers, $rows);
    }

    public function pendingReviews(Request $request)
    {
        $headers = [
            'employee_name',
            'staff_number',
            'cycle',
            'status',
            'overall_score',
            'updated_at',
        ];

        $rows = EmployeeScorecard::query()
            ->with([
                'employee:id,first_name,middle_name,surname,staff_number',
                'cycle:id,title',
            ])
            ->whereIn('status', [
                'self_assessment_pending',
                'self_assessment_submitted',
                'manager_review_pending',
                'hr_moderation_pending',
            ])
            ->orderByDesc('updated_at')
            ->get()
            ->map(fn (EmployeeScorecard $sc) => [
                'employee_name' => $sc->employee
                    ? trim("{$sc->employee->first_name} {$sc->employee->middle_name} {$sc->employee->surname}")
                    : '',
                'staff_number' => $sc->employee?->staff_number ?? '',
                'cycle' => $sc->cycle?->title ?? '',
                'status' => $sc->status,
                'overall_score' => $sc->overall_score,
                'updated_at' => $this->normalizeCellValue($sc->updated_at),
            ])
            ->all();

        return $this->exportRows($request, 'scorecard-pending-reviews', $headers, $rows);
    }

    public function topPerformers(Request $request)
    {
        $headers = [
            'employee_name',
            'staff_number',
            'cycle',
            'overall_score',
            'overall_rating',
            'financial_score',
            'customer_score',
            'internal_process_score',
            'learning_growth_score',
        ];

        $rows = EmployeeScorecard::query()
            ->with([
                'employee:id,first_name,middle_name,surname,staff_number',
                'cycle:id,title',
            ])
            ->where('status', 'finalized')
            ->orderByDesc('overall_score')
            ->limit(50)
            ->get()
            ->map(fn (EmployeeScorecard $sc) => [
                'employee_name' => $sc->employee
                    ? trim("{$sc->employee->first_name} {$sc->employee->middle_name} {$sc->employee->surname}")
                    : '',
                'staff_number' => $sc->employee?->staff_number ?? '',
                'cycle' => $sc->cycle?->title ?? '',
                'overall_score' => $sc->overall_score,
                'overall_rating' => $sc->overall_rating,
                'financial_score' => $sc->financial_score,
                'customer_score' => $sc->customer_score,
                'internal_process_score' => $sc->internal_process_score,
                'learning_growth_score' => $sc->learning_growth_score,
            ])
            ->all();

        return $this->exportRows($request, 'scorecard-top-performers', $headers, $rows);
    }

    public function improvementPlans(Request $request)
    {
        $headers = [
            'employee_name',
            'staff_number',
            'cycle',
            'title',
            'status',
            'start_date',
            'end_date',
            'outcome',
        ];

        $query = PerformanceImprovementPlan::query()
            ->with([
                'employee:id,first_name,middle_name,surname,staff_number',
                'scorecard.cycle:id,title',
            ]);

        $this->applyDateRange($query, $request, 'start_date');

        $rows = $query
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (PerformanceImprovementPlan $pip) => [
                'employee_name' => $pip->employee
                    ? trim("{$pip->employee->first_name} {$pip->employee->middle_name} {$pip->employee->surname}")
                    : '',
                'staff_number' => $pip->employee?->staff_number ?? '',
                'cycle' => $pip->scorecard?->cycle?->title ?? '',
                'title' => $pip->title,
                'status' => $pip->status,
                'start_date' => $this->normalizeCellValue($pip->start_date),
                'end_date' => $this->normalizeCellValue($pip->end_date),
                'outcome' => $pip->outcome,
            ])
            ->all();

        return $this->exportRows($request, 'improvement-plans', $headers, $rows);
    }
}
