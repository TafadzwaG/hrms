<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\CandidateProfile;
use App\Models\CompanyProfile;
use App\Models\Vacancy;
use App\Support\Hubs\EmployerHubContext;
use App\Support\Hubs\EmployerHubPresenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

abstract class BaseEmployerHubController extends Controller
{
    public function __construct(
        protected EmployerHubContext $context,
        protected EmployerHubPresenter $presenter,
    ) {
    }

    protected function company(Request $request): CompanyProfile|RedirectResponse
    {
        $company = $this->context->findCompany($request->user());

        if ($company) {
            return $company;
        }

        return redirect()
            ->route('employer.register')
            ->with('error', 'Create your company profile to access the employer hub.');
    }

    protected function candidateMatchScore(CandidateProfile $candidate, Collection $vacancies): int
    {
        if ($vacancies->isEmpty()) {
            return 0;
        }

        $candidateTokens = $this->tokens(
            collect([
                $candidate->headline,
                $candidate->professional_summary,
                $candidate->skills->pluck('name')->implode(' '),
            ])->filter()->implode(' ')
        );

        $bestScore = $vacancies->map(function (Vacancy $vacancy) use ($candidate, $candidateTokens) {
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
            $experienceScore = max(0, 18 - abs(($candidate->years_experience ?? 0) - 5) * 2);

            return min(99, 42 + ($overlap * 9) + $experienceScore);
        })->max();

        return (int) $bestScore;
    }

    protected function tokens(string $text): Collection
    {
        return collect(preg_split('/[^a-z0-9]+/i', Str::lower($text)) ?: [])
            ->filter(fn (?string $token) => filled($token) && strlen($token) > 2)
            ->unique()
            ->values();
    }
}
