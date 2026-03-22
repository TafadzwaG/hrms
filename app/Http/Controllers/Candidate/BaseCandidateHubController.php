<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\CandidateProfile;
use App\Models\Vacancy;
use App\Support\Hubs\CandidateHubContext;
use App\Support\Hubs\CandidateHubPresenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

abstract class BaseCandidateHubController extends Controller
{
    public function __construct(
        protected CandidateHubContext $context,
        protected CandidateHubPresenter $presenter,
    ) {
    }

    protected function candidate(Request $request): CandidateProfile|RedirectResponse
    {
        $candidate = $this->context->findProfile($request->user());

        if ($candidate) {
            return $candidate;
        }

        return redirect()
            ->route('candidate.register')
            ->with('error', 'Create your candidate profile to access the candidate hub.');
    }

    protected function vacancyMatchScore(CandidateProfile $candidate, Vacancy $vacancy): int
    {
        $candidateTokens = $this->tokens(
            collect([
                $candidate->headline,
                $candidate->professional_summary,
                $candidate->skills->pluck('name')->implode(' '),
            ])->filter()->implode(' ')
        );

        $vacancyTokens = $this->tokens(
            collect([
                $vacancy->title,
                $vacancy->department,
                $vacancy->category,
                $vacancy->description,
                $vacancy->requirements,
            ])->filter()->implode(' ')
        );

        $overlap = $candidateTokens->intersect($vacancyTokens)->count();
        $experienceScore = max(0, 20 - abs(($candidate->years_experience ?? 0) - 5) * 2);

        return min(99, 45 + ($overlap * 8) + $experienceScore);
    }

    protected function tokens(string $text): Collection
    {
        return collect(preg_split('/[^a-z0-9]+/i', Str::lower($text)) ?: [])
            ->filter(fn (?string $token) => filled($token) && strlen($token) > 2)
            ->unique()
            ->values();
    }
}
