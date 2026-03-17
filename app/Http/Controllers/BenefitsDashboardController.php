<?php

namespace App\Http\Controllers;

use App\Models\Benefit;
use App\Models\EmployeeBenefitEnrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class BenefitsDashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $activeBenefits = Benefit::where('active', true)->count();

        $activeEnrollments = EmployeeBenefitEnrollment::where('status', 'active')->count();

        $totalEmployerContribution = EmployeeBenefitEnrollment::where('status', 'active')
            ->sum('employer_contribution');

        $totalEmployeeContribution = EmployeeBenefitEnrollment::where('status', 'active')
            ->sum('employee_contribution');

        $enrollmentsByCategory = EmployeeBenefitEnrollment::query()
            ->join('benefits', 'employee_benefit_enrollments.benefit_id', '=', 'benefits.id')
            ->where('employee_benefit_enrollments.status', 'active')
            ->selectRaw('benefits.category, count(*) as count')
            ->groupBy('benefits.category')
            ->pluck('count', 'category')
            ->all();

        $expiringSoon = EmployeeBenefitEnrollment::query()
            ->where('status', 'active')
            ->whereNotNull('end_date')
            ->whereBetween('end_date', [now(), now()->addDays(30)])
            ->count();

        $enrollmentsByStatus = EmployeeBenefitEnrollment::query()
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->all();

        return Inertia::render('Benefits/Dashboard', [
            'metrics' => [
                'active_benefits' => $activeBenefits,
                'active_enrollments' => $activeEnrollments,
                'total_employer_contribution' => round((float) $totalEmployerContribution, 2),
                'total_employee_contribution' => round((float) $totalEmployeeContribution, 2),
                'expiring_soon' => $expiringSoon,
            ],
            'enrollmentsByCategory' => $enrollmentsByCategory,
            'enrollmentsByStatus' => $enrollmentsByStatus,
        ]);
    }
}
