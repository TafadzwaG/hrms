<?php

namespace App\Http\Controllers;

use App\Models\CompanyProfile;
use App\Models\Vacancy;
use App\Models\VacancyApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class EmployerHubDashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $hasVacancies = Schema::hasTable('vacancies');
        $hasApplications = Schema::hasTable('vacancy_applications');

        $company = CompanyProfile::withoutGlobalScope(\App\Models\Scopes\OrganizationScope::class)
            ->where('owner_user_id', $user->id)
            ->when($hasVacancies, fn ($q) => $q->withCount('vacancies'))
            ->first();

        $metrics = [
            'total_vacancies' => $company?->vacancies_count ?? 0,
            'published_vacancies' => 0,
            'total_applications' => 0,
            'company_status' => $company?->status ?? 'pending_review',
        ];

        $vacancies = [];
        $recentApplications = [];
        $applicationsByStatus = [];

        if ($company && $hasVacancies) {
            $metrics['published_vacancies'] = Vacancy::where('company_profile_id', $company->id)
                ->where('status', 'published')->count();

            $vacancyIds = Vacancy::where('company_profile_id', $company->id)->pluck('id');

            if ($hasApplications) {
                $metrics['total_applications'] = VacancyApplication::whereIn('vacancy_id', $vacancyIds)->count();

                $applicationsByStatus = VacancyApplication::whereIn('vacancy_id', $vacancyIds)
                    ->selectRaw('status, count(*) as count')
                    ->groupBy('status')
                    ->pluck('count', 'status')
                    ->all();
            }

            $vacancies = Vacancy::where('company_profile_id', $company->id)
                ->when($hasApplications, fn ($q) => $q->withCount('applications'))
                ->orderByDesc('created_at')
                ->limit(10)
                ->get()
                ->map(fn (Vacancy $v) => [
                    'id' => $v->id,
                    'title' => $v->title,
                    'status' => $v->status,
                    'employment_type' => $v->employment_type,
                    'location' => $v->location,
                    'applications_count' => $v->applications_count ?? 0,
                    'application_deadline' => $v->application_deadline?->toDateString(),
                    'published_at' => $v->published_at?->toDateString(),
                ])
                ->all();

            if ($hasApplications) {
                $recentApplications = VacancyApplication::whereIn('vacancy_id', $vacancyIds)
                    ->with(['vacancy:id,title', 'candidate:id,full_name,email,headline,location'])
                    ->orderByDesc('created_at')
                    ->limit(8)
                    ->get()
                    ->map(fn (VacancyApplication $app) => [
                        'id' => $app->id,
                        'candidate_name' => $app->candidate?->full_name ?? 'Unknown',
                        'candidate_email' => $app->candidate?->email,
                        'candidate_headline' => $app->candidate?->headline,
                        'candidate_location' => $app->candidate?->location,
                        'vacancy_title' => $app->vacancy?->title ?? 'Unknown',
                        'status' => $app->status,
                        'applied_at' => $app->applied_at?->toDateString() ?? $app->created_at->toDateString(),
                    ])
                    ->all();
            }
        }

        return Inertia::render('Employer/Dashboard', [
            'company' => $company ? [
                'id' => $company->id,
                'company_name' => $company->company_name,
                'industry' => $company->industry,
                'status' => $company->status,
                'email' => $company->email,
                'approved_at' => $company->approved_at?->toDateString(),
            ] : null,
            'metrics' => $metrics,
            'applicationsByStatus' => $applicationsByStatus,
            'vacancies' => $vacancies,
            'recentApplications' => $recentApplications,
        ]);
    }
}
