<?php

namespace App\Http\Controllers\Candidate;

use App\Models\Scopes\OrganizationScope;
use App\Models\VacancyApplication;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationsController extends BaseCandidateHubController
{
    public function index(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $candidate = $this->candidate($request);

        if ($candidate instanceof \Illuminate\Http\RedirectResponse) {
            return $candidate;
        }

        $status = $request->string('status')->toString();

        $applications = VacancyApplication::query()
            ->where('candidate_profile_id', $candidate->id)
            ->when($status !== '', fn ($query) => $query->where('status', $status))
            ->with([
                'resume',
                'vacancy' => fn ($query) => $query
                    ->withoutGlobalScope(OrganizationScope::class)
                    ->with(['company' => fn ($companyQuery) => $companyQuery->withoutGlobalScope(OrganizationScope::class)]),
            ])
            ->latest('applied_at')
            ->paginate(12)
            ->through(fn ($application) => $this->presenter->application($application))
            ->withQueryString();

        return Inertia::render('Candidate/Applications', [
            'candidate' => $this->presenter->profile($candidate),
            'applications' => $applications,
            'filters' => [
                'status' => $status,
            ],
            'statuses' => \App\Models\VacancyApplication::STATUSES,
        ]);
    }
}
