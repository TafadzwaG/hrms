<?php

namespace App\Http\Controllers;

use App\Models\Scopes\OrganizationScope;
use App\Models\User;
use App\Models\Vacancy;
use App\Models\VacancyApplication;
use App\Support\Hubs\CandidateHubContext;
use App\Support\Marketplace\PublicJobPresenter;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class MarketplaceController extends Controller
{
    public function __construct(
        private readonly PublicJobPresenter $presenter,
        private readonly CandidateHubContext $candidateHub,
    ) {
    }

    public function search(Request $request): Response
    {
        $jobs = $this->publicVacancies()
            ->get()
            ->map(fn (Vacancy $vacancy) => $this->presenter->card($vacancy))
            ->all();

        return Inertia::render('Public/SearchResults', [
            'jobs' => $jobs,
            'filters' => [
                'q' => $request->string('q')->toString(),
                'location' => $request->string('location')->toString(),
                'work_mode' => $request->string('work_mode')->toString(),
            ],
        ]);
    }

    public function show(Request $request, int $vacancy): Response|HttpResponse
    {
        $job = $this->publicVacancies()
            ->whereKey($vacancy)
            ->first();

        if (! $job) {
            return Inertia::render('Public/JobDetail', [
                'job' => null,
                'relatedJobs' => [],
                'applyAction' => $this->guestApplyAction(),
            ])->toResponse($request)->setStatusCode(HttpResponse::HTTP_NOT_FOUND);
        }

        $relatedJobs = $this->publicVacancies()
            ->whereKeyNot($job->id)
            ->get()
            ->sortByDesc(fn (Vacancy $related) => $this->presenter->relatedScore($job, $related))
            ->take(3)
            ->map(fn (Vacancy $related) => $this->presenter->card($related))
            ->values()
            ->all();

        return Inertia::render('Public/JobDetail', [
            'job' => $this->presenter->detail($job),
            'relatedJobs' => $relatedJobs,
            'applyAction' => $this->applyActionFor($request->user(), $job),
        ]);
    }

    private function publicVacancies(): Builder
    {
        return Vacancy::query()
            ->withoutGlobalScope(OrganizationScope::class)
            ->with([
                'company' => fn ($query) => $query->withoutGlobalScope(OrganizationScope::class),
            ])
            ->where('status', 'published')
            ->whereHas('company', fn ($query) => $query
                ->withoutGlobalScope(OrganizationScope::class)
                ->where('status', 'active'))
            ->orderByDesc('published_at')
            ->orderByDesc('created_at');
    }

    private function applyActionFor(?User $user, Vacancy $vacancy): array
    {
        if (! $user) {
            return $this->guestApplyAction();
        }

        $candidate = $this->candidateHub->findProfile($user);

        if (! $candidate) {
            return [
                'type' => 'link',
                'href' => route('candidate.register'),
                'label' => 'Create Candidate Profile',
                'helper' => 'Create a candidate profile to apply for this role.',
            ];
        }

        $application = VacancyApplication::query()
            ->where('vacancy_id', $vacancy->id)
            ->where('candidate_profile_id', $candidate->id)
            ->first();

        if ($application) {
            return [
                'type' => 'disabled',
                'href' => null,
                'label' => 'Already Applied',
                'helper' => 'You already applied for this role and your application is under review.',
            ];
        }

        $hasPrimaryResume = $candidate->resumes()->where('is_primary', true)->exists();

        if (! $hasPrimaryResume) {
            return [
                'type' => 'link',
                'href' => route('candidate.documents'),
                'label' => 'Upload Resume',
                'helper' => 'Upload a primary resume in your candidate dashboard before applying.',
            ];
        }

        return [
            'type' => 'post',
            'href' => route('candidate.jobs.apply', $vacancy->id),
            'label' => 'Apply Now',
            'helper' => 'Your application will be reviewed by '.($vacancy->company?->company_name ?? 'the hiring team').'.',
        ];
    }

    private function guestApplyAction(): array
    {
        return [
            'type' => 'link',
            'href' => route('candidate.register'),
            'label' => 'Apply Now',
            'helper' => 'Create a candidate account to apply for this role.',
        ];
    }
}
