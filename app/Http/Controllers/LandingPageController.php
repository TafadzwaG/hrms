<?php

namespace App\Http\Controllers;

use App\Models\CandidateProfile;
use App\Models\CompanyProfile;
use App\Models\Vacancy;
use Inertia\Inertia;

class LandingPageController extends Controller
{
    public function __invoke()
    {
        $featuredVacancies = Vacancy::query()
            ->where('status', 'published')
            ->with('company:id,company_name')
            ->orderByDesc('published_at')
            ->limit(4)
            ->get()
            ->map(fn (Vacancy $v) => [
                'id' => $v->id,
                'title' => $v->title,
                'company_name' => $v->company?->company_name ?? 'Unknown',
                'location' => $v->location,
                'employment_type' => $v->employment_type,
                'work_mode' => $v->work_mode,
                'category' => $v->category,
            ])
            ->all();

        return Inertia::render('Landing', [
            'stats' => [
                'candidates' => CandidateProfile::where('is_public', true)->where('profile_visibility_status', 'active')->count(),
                'companies' => CompanyProfile::where('status', 'active')->count(),
                'vacancies' => Vacancy::where('status', 'published')->count(),
            ],
            'featuredVacancies' => $featuredVacancies,
        ]);
    }
}
