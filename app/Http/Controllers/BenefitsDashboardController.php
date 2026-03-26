<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ResolvesRolePageScope;
use App\Models\Benefit;
use App\Models\EmployeeBenefitEnrollment;
use App\Support\Access\RolePageScopeResolver;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BenefitsDashboardController extends Controller
{
    use ResolvesRolePageScope;

    public function __invoke(Request $request): Response
    {
        $requestedView = $this->requestedScopeView($request);

        $benefitsQuery = Benefit::query()->where('active', true);
        $benefitScope = app(RolePageScopeResolver::class)->applyScope(
            $benefitsQuery,
            $request->user(),
            RolePageScopeResolver::MODULE_BENEFITS,
        );

        $activeBenefits = $benefitsQuery->count();

        $activeEnrollmentQuery = EmployeeBenefitEnrollment::query()->where('status', 'active');
        $scope = app(RolePageScopeResolver::class)->applyScope(
            $activeEnrollmentQuery,
            $request->user(),
            RolePageScopeResolver::MODULE_BENEFIT_ENROLLMENTS,
            $requestedView,
        );
        $activeEnrollments = (clone $activeEnrollmentQuery)->count();

        $totalEmployerContribution = (clone $activeEnrollmentQuery)->sum('employer_contribution');

        $totalEmployeeContribution = (clone $activeEnrollmentQuery)->sum('employee_contribution');

        $enrollmentsByCategoryQuery = EmployeeBenefitEnrollment::query()
            ->join('benefits', 'employee_benefit_enrollments.benefit_id', '=', 'benefits.id')
            ->where('employee_benefit_enrollments.status', 'active')
            ->selectRaw('benefits.category, count(*) as count')
            ->groupBy('benefits.category');
        app(RolePageScopeResolver::class)->applyScope(
            $enrollmentsByCategoryQuery,
            $request->user(),
            RolePageScopeResolver::MODULE_BENEFIT_ENROLLMENTS,
            $requestedView,
        );
        $enrollmentsByCategory = $enrollmentsByCategoryQuery->pluck('count', 'category')->all();

        $expiringSoonQuery = EmployeeBenefitEnrollment::query()
            ->where('status', 'active')
            ->whereNotNull('end_date')
            ->whereBetween('end_date', [now(), now()->addDays(30)]);
        app(RolePageScopeResolver::class)->applyScope(
            $expiringSoonQuery,
            $request->user(),
            RolePageScopeResolver::MODULE_BENEFIT_ENROLLMENTS,
            $requestedView,
        );
        $expiringSoon = $expiringSoonQuery->count();

        $enrollmentsByStatusQuery = EmployeeBenefitEnrollment::query()
            ->selectRaw('status, count(*) as count')
            ->groupBy('status');
        app(RolePageScopeResolver::class)->applyScope(
            $enrollmentsByStatusQuery,
            $request->user(),
            RolePageScopeResolver::MODULE_BENEFIT_ENROLLMENTS,
            $requestedView,
        );
        $enrollmentsByStatus = $enrollmentsByStatusQuery->pluck('count', 'status')->all();

        $recentEnrollmentsQuery = EmployeeBenefitEnrollment::query()
            ->with([
                'employee:id,first_name,middle_name,surname,staff_number',
                'benefit:id,name,category',
                'benefitPlan:id,name',
            ])
            ->latest();
        app(RolePageScopeResolver::class)->applyScope(
            $recentEnrollmentsQuery,
            $request->user(),
            RolePageScopeResolver::MODULE_BENEFIT_ENROLLMENTS,
            $requestedView,
        );
        $recentEnrollments = $recentEnrollmentsQuery
            ->limit(6)
            ->get()
            ->map(fn (EmployeeBenefitEnrollment $enrollment) => [
                'id' => $enrollment->id,
                'employee' => [
                    'id' => $enrollment->employee?->id,
                    'full_name' => $enrollment->employee?->full_name ?? 'Unknown employee',
                    'staff_number' => $enrollment->employee?->staff_number ?? '—',
                ],
                'benefit' => [
                    'id' => $enrollment->benefit?->id,
                    'name' => $enrollment->benefit?->name ?? 'Unknown benefit',
                    'category' => $enrollment->benefit?->category ?? 'other',
                ],
                'plan' => $enrollment->benefitPlan ? [
                    'id' => $enrollment->benefitPlan->id,
                    'name' => $enrollment->benefitPlan->name,
                ] : null,
                'status' => $enrollment->status,
                'effective_date' => optional($enrollment->effective_date)->toDateString(),
                'employer_contribution' => $enrollment->employer_contribution,
                'employee_contribution' => $enrollment->employee_contribution,
                'created_at' => optional($enrollment->created_at)->toDateString(),
            ])
            ->values()
            ->all();

        $benefitCategoryBase = Benefit::query()->where('active', true);
        app(RolePageScopeResolver::class)->applyScope(
            $benefitCategoryBase,
            $request->user(),
            RolePageScopeResolver::MODULE_BENEFITS,
            $requestedView,
        );
        $benefitsByCategory = (clone $benefitCategoryBase)
            ->selectRaw('category, count(*) as count')
            ->groupBy('category')
            ->pluck('count', 'category');

        $categorySummary = collect($enrollmentsByCategory)->map(function ($count, $category) use ($benefitsByCategory, $request, $requestedView) {
            $employerCostQuery = EmployeeBenefitEnrollment::query()
                ->join('benefits', 'employee_benefit_enrollments.benefit_id', '=', 'benefits.id')
                ->where('employee_benefit_enrollments.status', 'active')
                ->where('benefits.category', $category);

            app(RolePageScopeResolver::class)->applyScope(
                $employerCostQuery,
                $request->user(),
                RolePageScopeResolver::MODULE_BENEFIT_ENROLLMENTS,
                $requestedView,
            );

            return [
                'category' => $category,
                'count' => (int) ($benefitsByCategory[$category] ?? 0),
                'active_enrollments' => (int) $count,
                'total_employer_cost' => round((float) $employerCostQuery->sum('employee_benefit_enrollments.employer_contribution'), 2),
            ];
        })->values()->all();

        $stats = [
            'total_active_benefits' => $activeBenefits,
            'active_enrollments' => $activeEnrollments,
            'monthly_employer_cost' => round((float) $totalEmployerContribution, 2),
            'monthly_employee_deductions' => round((float) $totalEmployeeContribution, 2),
            'expiring_soon' => $expiringSoon,
        ];

        return Inertia::render('Benefits/Dashboard', [
            'metrics' => [
                'active_benefits' => $stats['total_active_benefits'],
                'active_enrollments' => $stats['active_enrollments'],
                'total_employer_contribution' => $stats['monthly_employer_cost'],
                'total_employee_contribution' => $stats['monthly_employee_deductions'],
                'expiring_soon' => $stats['expiring_soon'],
            ],
            'stats' => $stats,
            'enrollmentsByCategory' => $enrollmentsByCategory,
            'enrollmentsByStatus' => $enrollmentsByStatus,
            'recent_enrollments' => $recentEnrollments,
            'category_summary' => $categorySummary,
            'scope' => $scope['mode'] === 'tenant' ? $benefitScope : $scope,
        ]);
    }
}
