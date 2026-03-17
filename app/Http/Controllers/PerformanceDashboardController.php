<?php

namespace App\Http\Controllers;

use App\Models\EmployeeScorecard;
use App\Models\PerformanceCycle;
use App\Models\PerformanceImprovementPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PerformanceDashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $activeCycle = PerformanceCycle::where('status', 'active')
            ->orWhere('status', 'review_in_progress')
            ->first();

        $metrics = [
            'total_cycles' => PerformanceCycle::count(),
            'active_cycle' => $activeCycle ? [
                'id' => $activeCycle->id,
                'title' => $activeCycle->title,
                'status' => $activeCycle->status,
                'start_date' => $activeCycle->start_date?->format('Y-m-d'),
                'end_date' => $activeCycle->end_date?->format('Y-m-d'),
            ] : null,
            'total_scorecards' => EmployeeScorecard::count(),
            'pending_self_assessments' => EmployeeScorecard::whereIn('status', ['self_assessment_pending', 'draft'])->count(),
            'pending_manager_reviews' => EmployeeScorecard::where('status', 'manager_review_pending')->count(),
            'finalized_scorecards' => EmployeeScorecard::where('status', 'finalized')->count(),
            'average_score' => round((float) EmployeeScorecard::where('status', 'finalized')->avg('overall_score'), 2),
            'active_improvement_plans' => PerformanceImprovementPlan::whereIn('status', ['active', 'on_track', 'at_risk'])->count(),
        ];

        // Score distribution for finalized scorecards
        $scoreDistribution = [];
        $finalizedScorecards = EmployeeScorecard::where('status', 'finalized')
            ->whereNotNull('overall_rating')
            ->get(['overall_rating']);

        foreach (array_keys(EmployeeScorecard::RATING_BANDS) as $band) {
            $scoreDistribution[$band] = $finalizedScorecards->where('overall_rating', $band)->count();
        }

        // Perspective averages
        $perspectiveAverages = [
            'financial' => round((float) EmployeeScorecard::where('status', 'finalized')->avg('financial_score'), 2),
            'customer' => round((float) EmployeeScorecard::where('status', 'finalized')->avg('customer_score'), 2),
            'internal_process' => round((float) EmployeeScorecard::where('status', 'finalized')->avg('internal_process_score'), 2),
            'learning_growth' => round((float) EmployeeScorecard::where('status', 'finalized')->avg('learning_growth_score'), 2),
        ];

        return Inertia::render('Performance/Dashboard', [
            'metrics' => $metrics,
            'scoreDistribution' => $scoreDistribution,
            'perspectiveAverages' => $perspectiveAverages,
        ]);
    }
}
