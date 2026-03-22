<?php

namespace App\Http\Controllers\Employer;

use App\Models\Scopes\OrganizationScope;
use App\Models\VacancyApplication;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends BaseEmployerHubController
{
    public function __invoke(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $company = $this->company($request);

        if ($company instanceof \Illuminate\Http\RedirectResponse) {
            return $company;
        }

        $company->load(['billingProfile', 'activeSubscription.plan']);

        $vacancies = $this->context->vacancyQuery()
            ->where('company_profile_id', $company->id)
            ->withCount('applications')
            ->latest()
            ->get();

        $applications = VacancyApplication::query()
            ->whereIn('vacancy_id', $vacancies->pluck('id'))
            ->with([
                'resume',
                'vacancy' => fn ($query) => $query->withoutGlobalScope(OrganizationScope::class),
                'candidate' => fn ($query) => $query
                    ->withoutGlobalScope(OrganizationScope::class)
                    ->with(['skills']),
            ])
            ->latest('applied_at')
            ->get();

        $openVacancies = $vacancies->whereIn('status', ['published', 'draft'])->values();

        $recommendedTalent = $this->context->candidateQuery()
            ->where('is_public', true)
            ->where('profile_visibility_status', 'active')
            ->whereNotIn('id', $applications->pluck('candidate_profile_id'))
            ->with(['skills'])
            ->get()
            ->map(fn ($candidate) => [
                'score' => $this->candidateMatchScore($candidate, $openVacancies),
                'candidate' => $candidate,
            ])
            ->filter(fn (array $entry) => $entry['score'] > 0)
            ->sortByDesc('score')
            ->take(5)
            ->map(fn (array $entry) => $this->presenter->recommendedTalent($entry['candidate'], $entry['score']))
            ->values()
            ->all();

        return Inertia::render('Employer/Dashboard', [
            'company' => $this->presenter->company($company),
            'user' => $this->presenter->user($request->user()),
            'metrics' => $this->presenter->metrics($company, $vacancies, $applications),
            'vacancies' => $vacancies->take(8)->map(fn ($vacancy) => $this->presenter->vacancy($vacancy))->all(),
            'recentApplications' => $applications->take(6)->map(function ($application) use ($openVacancies) {
                return $this->presenter->application(
                    $application,
                    $application->candidate ? $this->candidateMatchScore($application->candidate, $openVacancies) : null,
                );
            })->all(),
            'applicationsByStatus' => $this->presenter->applicationsByStatus($applications),
            'recommendedTalent' => $recommendedTalent,
            'billingSummary' => [
                'profile' => $this->presenter->billingProfile($company->billingProfile),
                'subscription' => $this->presenter->subscription($company->activeSubscription),
            ],
        ]);
    }
}
