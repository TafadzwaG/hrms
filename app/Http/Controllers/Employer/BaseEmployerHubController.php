<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\CandidateProfile;
use App\Models\CompanyProfile;
use App\Services\Marketplace\ExchangeEngine;
use App\Support\Hubs\EmployerHubContext;
use App\Support\Hubs\EmployerHubPresenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

abstract class BaseEmployerHubController extends Controller
{
    public function __construct(
        protected EmployerHubContext $context,
        protected EmployerHubPresenter $presenter,
        protected ExchangeEngine $exchange,
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

    protected function candidateMatchForVacancies(CandidateProfile $candidate, Collection $vacancies): ?array
    {
        if ($vacancies->isEmpty()) {
            return null;
        }

        $bestMatch = $vacancies
            ->filter(fn ($vacancy) => $vacancy instanceof \App\Models\Vacancy)
            ->map(fn (\App\Models\Vacancy $vacancy) => [
                'vacancy' => $vacancy,
                'match' => $this->exchange->matchInsightsForCandidate($candidate, $vacancy),
            ])
            ->sortByDesc(fn (array $entry) => $entry['match']['score'])
            ->first();

        if (! $bestMatch) {
            return null;
        }

        return [
            ...$bestMatch['match'],
            'vacancy_id' => $bestMatch['vacancy']->id,
            'vacancy_title' => $bestMatch['vacancy']->title,
        ];
    }
}
