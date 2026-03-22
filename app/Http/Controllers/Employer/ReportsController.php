<?php

namespace App\Http\Controllers\Employer;

use App\Models\Scopes\OrganizationScope;
use App\Models\VacancyApplication;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportsController extends BaseEmployerHubController
{
    public function index(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $company = $this->company($request);

        if ($company instanceof \Illuminate\Http\RedirectResponse) {
            return $company;
        }

        $vacancies = $this->context->vacancyQuery()
            ->where('company_profile_id', $company->id)
            ->withCount('applications')
            ->latest()
            ->get();

        $applications = VacancyApplication::query()
            ->whereIn('vacancy_id', $vacancies->pluck('id'))
            ->with([
                'vacancy' => fn ($query) => $query->withoutGlobalScope(OrganizationScope::class),
                'candidate' => fn ($query) => $query->withoutGlobalScope(OrganizationScope::class),
            ])
            ->get();

        $monthlyTrend = collect(CarbonPeriod::create(now()->subMonths(5)->startOfMonth(), '1 month', now()->startOfMonth()))
            ->map(function ($month) use ($applications) {
                $count = $applications->filter(fn ($application) => optional($application->applied_at ?? $application->created_at)?->format('Y-m') === $month->format('Y-m'))->count();

                return [
                    'label' => $month->format('M Y'),
                    'applications' => $count,
                ];
            })
            ->values()
            ->all();

        return Inertia::render('Employer/Reports', [
            'company' => $this->presenter->company($company),
            'summary' => [
                'total_vacancies' => $vacancies->count(),
                'published_vacancies' => $vacancies->where('status', 'published')->count(),
                'total_applications' => $applications->count(),
                'average_applications_per_vacancy' => round($applications->count() / max(1, $vacancies->count()), 1),
            ],
            'applicationsByStatus' => $this->presenter->applicationsByStatus($applications),
            'monthlyTrend' => $monthlyTrend,
            'vacancyPerformance' => $vacancies->map(fn ($vacancy) => $this->presenter->vacancy($vacancy))->all(),
        ]);
    }
}
