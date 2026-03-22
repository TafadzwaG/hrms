<?php

namespace App\Http\Controllers;

use App\Models\CandidateProfile;
use App\Models\CompanyProfile;
use App\Models\Scopes\OrganizationScope;
use App\Models\Vacancy;
use App\Support\Marketplace\PublicJobPresenter;
use Inertia\Inertia;

class LandingPageController extends Controller
{
    public function __construct(
        private readonly PublicJobPresenter $presenter,
    ) {
    }

    public function __invoke()
    {
        $featuredVacancies = Vacancy::query()
            ->withoutGlobalScope(OrganizationScope::class)
            ->where('status', 'published')
            ->with([
                'company' => fn ($query) => $query->withoutGlobalScope(OrganizationScope::class),
            ])
            ->whereHas('company', fn ($query) => $query
                ->withoutGlobalScope(OrganizationScope::class)
                ->where('status', 'active'))
            ->orderByDesc('published_at')
            ->limit(4)
            ->get()
            ->map(fn (Vacancy $vacancy) => $this->presenter->featured($vacancy))
            ->all();

        return Inertia::render('Landing', [
            'stats' => [
                'candidates' => CandidateProfile::query()
                    ->withoutGlobalScope(OrganizationScope::class)
                    ->where('is_public', true)
                    ->where('profile_visibility_status', 'active')
                    ->count(),
                'companies' => CompanyProfile::query()
                    ->withoutGlobalScope(OrganizationScope::class)
                    ->where('status', 'active')
                    ->count(),
                'vacancies' => Vacancy::query()
                    ->withoutGlobalScope(OrganizationScope::class)
                    ->where('status', 'published')
                    ->count(),
            ],
            'featuredVacancies' => $featuredVacancies,
        ]);
    }
}
