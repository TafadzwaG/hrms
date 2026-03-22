<?php

namespace App\Http\Controllers;

use App\Models\Vacancy;
use App\Services\Marketplace\ExchangeEngine;
use App\Support\Marketplace\PublicJobPresenter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class MarketplaceController extends Controller
{
    public function __construct(
        private readonly ExchangeEngine $exchange,
        private readonly PublicJobPresenter $presenter,
    ) {
    }

    public function search(Request $request): Response
    {
        $filters = [
            'q' => $request->string('q')->toString(),
            'location' => $request->string('location')->toString(),
            'work_mode' => $request->string('work_mode')->toString(),
        ];
        $candidate = $this->exchange->resolveCandidate($request->user());

        $jobs = $this->exchange->search($filters, $request->user())
            ->map(fn (Vacancy $vacancy) => $this->presenter->card(
                $vacancy,
                $candidate ? $this->exchange->matchInsightsForCandidate($candidate, $vacancy) : null,
            ))
            ->all();

        return Inertia::render('Public/SearchResults', [
            'jobs' => $jobs,
            'filters' => $filters,
        ]);
    }

    public function show(Request $request, int $vacancy): Response|HttpResponse
    {
        $job = $this->exchange->findPublicVacancy($vacancy);
        $candidate = $this->exchange->resolveCandidate($request->user());

        if (! $job) {
            return Inertia::render('Public/JobDetail', [
                'job' => null,
                'relatedJobs' => [],
                'applyAction' => $this->exchange->guestApplyAction(),
            ])->toResponse($request)->setStatusCode(HttpResponse::HTTP_NOT_FOUND);
        }

        $relatedJobs = $this->exchange->relatedVacancies($job, $request->user())
            ->map(fn (Vacancy $related) => $this->presenter->card(
                $related,
                $candidate ? $this->exchange->matchInsightsForCandidate($candidate, $related, $job) : null,
            ))
            ->values()
            ->all();

        return Inertia::render('Public/JobDetail', [
            'job' => $this->presenter->detail(
                $job,
                $candidate ? $this->exchange->matchInsightsForCandidate($candidate, $job) : null,
            ),
            'relatedJobs' => $relatedJobs,
            'applyAction' => $this->exchange->applyActionFor($request->user(), $job),
        ]);
    }
}
