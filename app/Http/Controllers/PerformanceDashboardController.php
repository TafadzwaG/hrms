<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ResolvesRolePageScope;
use App\Models\EmployeeScorecard;
use App\Models\PerformanceCycle;
use App\Models\PerformanceImprovementPlan;
use App\Support\Access\RolePageScopeResolver;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PerformanceDashboardController extends Controller
{
    use ResolvesRolePageScope;

    public function __invoke(Request $request): Response
    {
        $activeCycle = PerformanceCycle::where('status', 'active')
            ->orWhere('status', 'review_in_progress')
            ->first();

        $scorecards = EmployeeScorecard::query();
        $scope = $this->applyRolePageScope($scorecards, $request, RolePageScopeResolver::MODULE_SCORECARDS);

        $pendingSelfAssessments = EmployeeScorecard::query()->whereIn('status', ['self_assessment_pending', 'draft']);
        $this->applyRolePageScope($pendingSelfAssessments, $request, RolePageScopeResolver::MODULE_SCORECARDS);

        $pendingManagerReviews = EmployeeScorecard::query()->where('status', 'manager_review_pending');
        $this->applyRolePageScope($pendingManagerReviews, $request, RolePageScopeResolver::MODULE_SCORECARDS);

        $finalizedScorecardsQuery = EmployeeScorecard::query()->where('status', 'finalized');
        $this->applyRolePageScope($finalizedScorecardsQuery, $request, RolePageScopeResolver::MODULE_SCORECARDS);

        $improvementPlans = PerformanceImprovementPlan::query()->whereIn('status', ['active', 'on_track', 'at_risk']);
        $this->applyRolePageScope($improvementPlans, $request, RolePageScopeResolver::MODULE_IMPROVEMENT_PLANS);

        $metrics = [
            'total_cycles' => PerformanceCycle::count(),
            'active_cycle' => $activeCycle ? [
                'id' => $activeCycle->id,
                'title' => $activeCycle->title,
                'status' => $activeCycle->status,
                'start_date' => $activeCycle->start_date?->format('Y-m-d'),
                'end_date' => $activeCycle->end_date?->format('Y-m-d'),
            ] : null,
            'total_scorecards' => (clone $scorecards)->count(),
            'pending_self_assessments' => (clone $pendingSelfAssessments)->count(),
            'pending_manager_reviews' => (clone $pendingManagerReviews)->count(),
            'finalized_scorecards' => (clone $finalizedScorecardsQuery)->count(),
            'average_score' => round((float) (clone $finalizedScorecardsQuery)->avg('overall_score'), 2),
            'active_improvement_plans' => (clone $improvementPlans)->count(),
        ];

        // Score distribution for finalized scorecards
        $scoreDistribution = [];
        $finalizedRatingQuery = EmployeeScorecard::query()
            ->where('status', 'finalized')
            ->whereNotNull('overall_rating');
        $this->applyRolePageScope($finalizedRatingQuery, $request, RolePageScopeResolver::MODULE_SCORECARDS);
        $finalizedScorecards = $finalizedRatingQuery->get(['overall_rating']);

        foreach (array_keys(EmployeeScorecard::RATING_BANDS) as $band) {
            $scoreDistribution[$band] = $finalizedScorecards->where('overall_rating', $band)->count();
        }

        // Perspective averages
        $financialScores = EmployeeScorecard::query()->where('status', 'finalized');
        $this->applyRolePageScope($financialScores, $request, RolePageScopeResolver::MODULE_SCORECARDS);
        $customerScores = EmployeeScorecard::query()->where('status', 'finalized');
        $this->applyRolePageScope($customerScores, $request, RolePageScopeResolver::MODULE_SCORECARDS);
        $internalProcessScores = EmployeeScorecard::query()->where('status', 'finalized');
        $this->applyRolePageScope($internalProcessScores, $request, RolePageScopeResolver::MODULE_SCORECARDS);
        $learningGrowthScores = EmployeeScorecard::query()->where('status', 'finalized');
        $this->applyRolePageScope($learningGrowthScores, $request, RolePageScopeResolver::MODULE_SCORECARDS);

        $perspectiveAverages = [
            'financial' => round((float) $financialScores->avg('financial_score'), 2),
            'customer' => round((float) $customerScores->avg('customer_score'), 2),
            'internal_process' => round((float) $internalProcessScores->avg('internal_process_score'), 2),
            'learning_growth' => round((float) $learningGrowthScores->avg('learning_growth_score'), 2),
        ];

        return Inertia::render('Performance/Dashboard', [
            'metrics' => $metrics,
            'scoreDistribution' => $scoreDistribution,
            'perspectiveAverages' => $perspectiveAverages,
            'scope' => $scope,
        ]);
    }
}
