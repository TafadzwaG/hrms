<?php

namespace App\Http\Controllers\Candidate;

use App\Models\Scopes\OrganizationScope;
use App\Models\VacancyApplication;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class DashboardController extends BaseCandidateHubController
{
    public function __invoke(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $candidate = $this->candidate($request);

        if ($candidate instanceof \Illuminate\Http\RedirectResponse) {
            return $candidate;
        }

        $candidate->loadCount(['applications', 'resumes', 'educations', 'experiences', 'skills']);
        $candidate->load(['skills', 'experiences', 'educations']);

        $applications = VacancyApplication::query()
            ->where('candidate_profile_id', $candidate->id)
            ->with([
                'resume',
                'vacancy' => fn ($query) => $query
                    ->withoutGlobalScope(OrganizationScope::class)
                    ->with(['company' => fn ($companyQuery) => $companyQuery->withoutGlobalScope(OrganizationScope::class)]),
            ])
            ->latest('applied_at')
            ->get();

        $educations = $candidate->educations()->latest('end_date')->get();
        $experiences = $candidate->experiences()->latest('start_date')->get();
        $skills = $candidate->skills()->orderByDesc('years_experience')->orderBy('name')->get();
        $documents = $candidate->resumes()->latest('uploaded_at')->latest()->get();

        $recommendedVacancies = $this->exchange
            ->recommendVacanciesForCandidate($candidate, 6, $applications->pluck('vacancy_id')->all())
            ->map(fn ($vacancy) => $this->presenter->vacancy(
                $vacancy,
                null,
                $this->exchange->matchInsightsForCandidate($candidate, $vacancy),
            ))
            ->all();

        return Inertia::render('Candidate/Dashboard', [
            'candidate' => $this->presenter->profile($candidate),
            'metrics' => $this->presenter->metrics($candidate),
            'completeness' => $this->presenter->completeness($candidate),
            'applicationsByStatus' => $this->presenter->applicationsByStatus($applications),
            'recentApplications' => $applications->take(5)->map(fn ($application) => $this->presenter->application($application))->all(),
            'educations' => $educations->map(fn ($education) => $this->presenter->education($education))->all(),
            'experiences' => $experiences->map(fn ($experience) => $this->presenter->experience($experience))->all(),
            'skills' => $skills->map(fn ($skill) => $this->presenter->skill($skill))->all(),
            'resumes' => $documents->map(fn ($document) => $this->presenter->document($document))->all(),
            'recommendedVacancies' => $recommendedVacancies,
        ]);
    }
}
