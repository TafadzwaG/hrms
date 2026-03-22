<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Requests\Candidate\ApplyToVacancyRequest;
use App\Models\Scopes\OrganizationScope;
use App\Models\Vacancy;
use App\Models\VacancyApplication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class JobsController extends BaseCandidateHubController
{
    public function index(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $candidate = $this->candidate($request);

        if ($candidate instanceof \Illuminate\Http\RedirectResponse) {
            return $candidate;
        }

        $candidate->load(['skills', 'experiences', 'educations']);

        $search = $request->string('search')->toString();
        $category = $request->string('category')->toString();
        $employmentType = $request->string('employment_type')->toString();
        $workMode = $request->string('work_mode')->toString();

        $existingApplications = VacancyApplication::query()
            ->where('candidate_profile_id', $candidate->id)
            ->get()
            ->keyBy('vacancy_id');

        $vacancyResults = $this->context->vacancyQuery()
            ->where('status', 'published')
            ->with(['company' => fn ($query) => $query->withoutGlobalScope(OrganizationScope::class)])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($innerQuery) use ($search) {
                    $innerQuery
                        ->where('title', 'like', "%{$search}%")
                        ->orWhere('department', 'like', "%{$search}%")
                        ->orWhere('location', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($category !== '', fn ($query) => $query->where('category', $category))
            ->when($employmentType !== '', fn ($query) => $query->where('employment_type', $employmentType))
            ->when($workMode !== '', fn ($query) => $query->where('work_mode', $workMode))
            ->get();

        $vacancies = $this->exchange
            ->rankVacanciesForCandidate($candidate, $vacancyResults)
            ->values()
            ->map(fn (Vacancy $vacancy) => $this->presenter->vacancy(
                $vacancy,
                $existingApplications->get($vacancy->id),
                $this->exchange->matchInsightsForCandidate($candidate, $vacancy),
            ))
            ->all();

        return Inertia::render('Candidate/BrowseJobs', [
            'candidate' => $this->presenter->profile($candidate),
            'vacancies' => $vacancies,
            'filters' => [
                'search' => $search,
                'category' => $category,
                'employment_type' => $employmentType,
                'work_mode' => $workMode,
            ],
            'options' => [
                'categories' => Vacancy::CATEGORIES,
                'employment_types' => Vacancy::EMPLOYMENT_TYPES,
                'work_modes' => Vacancy::WORK_MODES,
            ],
            'resumes' => $candidate->resumes()
                ->latest('uploaded_at')
                ->get()
                ->map(fn ($resume) => $this->presenter->document($resume))
                ->all(),
        ]);
    }

    public function apply(ApplyToVacancyRequest $request, int $vacancy): RedirectResponse
    {
        $candidate = $this->candidate($request);

        if ($candidate instanceof \Illuminate\Http\RedirectResponse) {
            return $candidate;
        }

        $vacancyModel = $this->context->findPublishedVacancy($vacancy);

        $existingApplication = VacancyApplication::query()
            ->where('vacancy_id', $vacancyModel->id)
            ->where('candidate_profile_id', $candidate->id)
            ->first();

        if ($existingApplication) {
            return back()->with('error', 'You have already applied for this vacancy.');
        }

        $resume = $candidate->resumes()
            ->when($request->integer('resume_id'), fn ($query) => $query->where('id', $request->integer('resume_id')))
            ->when(! $request->integer('resume_id'), fn ($query) => $query->where('is_primary', true))
            ->first();

        if (! $resume) {
            return back()->withErrors([
                'resume_id' => 'Upload a document or select one of your existing documents before applying.',
            ]);
        }

        DB::transaction(function () use ($candidate, $request, $resume, $vacancyModel) {
            VacancyApplication::query()->create([
                'vacancy_id' => $vacancyModel->id,
                'candidate_profile_id' => $candidate->id,
                'resume_id' => $resume->id,
                'cover_letter' => $request->validated('cover_letter'),
                'status' => 'submitted',
                'applied_at' => now(),
                'metadata' => [
                    'source' => 'candidate_hub',
                ],
            ]);
        });

        return back()->with('success', 'Application submitted successfully.');
    }
}
