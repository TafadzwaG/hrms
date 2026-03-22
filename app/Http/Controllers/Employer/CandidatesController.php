<?php

namespace App\Http\Controllers\Employer;

use App\Http\Requests\Employer\UpdateApplicationStatusRequest;
use App\Models\CandidateResume;
use App\Models\Scopes\OrganizationScope;
use App\Models\VacancyApplication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CandidatesController extends BaseEmployerHubController
{
    public function index(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $company = $this->company($request);

        if ($company instanceof \Illuminate\Http\RedirectResponse) {
            return $company;
        }

        $search = $request->string('search')->toString();
        $status = $request->string('status')->toString();
        $vacancyId = $request->integer('vacancy_id');

        $vacancies = $this->context->vacancyQuery()
            ->where('company_profile_id', $company->id)
            ->latest()
            ->get();

        $applications = VacancyApplication::query()
            ->whereIn('vacancy_id', $vacancies->pluck('id'))
            ->when($status !== '', fn ($query) => $query->where('status', $status))
            ->when($vacancyId > 0, fn ($query) => $query->where('vacancy_id', $vacancyId))
            ->when($search !== '', function ($query) use ($search) {
                $query->whereHas('candidate', function ($candidateQuery) use ($search) {
                    $candidateQuery
                        ->withoutGlobalScope(OrganizationScope::class)
                        ->where(function ($innerQuery) use ($search) {
                            $innerQuery
                                ->where('full_name', 'like', "%{$search}%")
                                ->orWhere('headline', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            })
            ->with([
                'latestInterview',
                'resume',
                'vacancy' => fn ($query) => $query->withoutGlobalScope(OrganizationScope::class),
                'candidate' => fn ($query) => $query
                    ->withoutGlobalScope(OrganizationScope::class)
                    ->with(['skills', 'experiences', 'educations']),
            ])
            ->latest('applied_at')
            ->paginate(12)
            ->through(function ($application) {
                return $this->presenter->application(
                    $application,
                    $application->candidate && $application->vacancy
                        ? $this->exchange->matchInsightsForCandidate($application->candidate, $application->vacancy)
                        : null,
                );
            })
            ->withQueryString();

        return Inertia::render('Employer/Candidates', [
            'company' => $this->presenter->company($company),
            'applications' => $applications,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'vacancy_id' => $vacancyId ?: null,
            ],
            'statuses' => \App\Models\VacancyApplication::STATUSES,
            'vacancies' => $vacancies->map(fn ($vacancy) => $this->presenter->vacancy($vacancy))->all(),
        ]);
    }

    public function show(Request $request, int $application): Response|RedirectResponse
    {
        $company = $this->company($request);

        if ($company instanceof RedirectResponse) {
            return $company;
        }

        $applicationModel = VacancyApplication::query()
            ->whereHas('vacancy', fn ($query) => $query
                ->withoutGlobalScope(OrganizationScope::class)
                ->where('company_profile_id', $company->id))
            ->with([
                'resume',
                'vacancy' => fn ($query) => $query
                    ->withoutGlobalScope(OrganizationScope::class)
                    ->with(['company' => fn ($companyQuery) => $companyQuery->withoutGlobalScope(OrganizationScope::class)]),
                'candidate' => fn ($query) => $query
                    ->withoutGlobalScope(OrganizationScope::class)
                    ->withCount(['applications', 'resumes', 'skills', 'educations', 'experiences'])
                    ->with([
                        'resumes',
                        'skills',
                        'experiences',
                        'educations',
                    ]),
                'interviews' => fn ($query) => $query->latest('scheduled_at'),
            ])
            ->findOrFail($application);

        $candidate = $applicationModel->candidate;

        if ($candidate) {
            $metadata = $candidate->metadata ?? [];
            $currentViews = max(0, (int) data_get($metadata, 'profile_views', 0));
            data_set($metadata, 'profile_views', $currentViews + 1);
            $candidate->forceFill(['metadata' => $metadata])->save();
            $candidate->refresh();
            $candidate->loadCount(['applications', 'resumes', 'skills', 'educations', 'experiences']);
            $candidate->load(['resumes', 'skills', 'experiences', 'educations']);
        }

        return Inertia::render('Employer/CandidateProfile', [
            'company' => $this->presenter->company($company),
            'user' => $this->presenter->user($request->user()),
            'application' => $this->presenter->application(
                $applicationModel,
                $candidate && $applicationModel->vacancy
                    ? $this->exchange->matchInsightsForCandidate($candidate, $applicationModel->vacancy)
                    : null,
            ),
            'candidate' => $candidate ? $this->presenter->candidateProfile($candidate) : null,
            'educations' => $candidate?->educations->map(fn ($education) => $this->presenter->candidateEducation($education))->all() ?? [],
            'experiences' => $candidate?->experiences->map(fn ($experience) => $this->presenter->candidateExperience($experience))->all() ?? [],
            'skills' => $candidate?->skills->map(fn ($skill) => $this->presenter->candidateSkill($skill))->all() ?? [],
            'documents' => $candidate?->resumes->map(
                fn ($resume) => $this->presenter->candidateDocument($resume, $applicationModel->id)
            )->all() ?? [],
            'interviews' => $applicationModel->interviews->map(fn ($interview) => $this->presenter->interview($interview))->all(),
            'meetingTypes' => \App\Models\ApplicationInterview::MEETING_TYPES,
        ]);
    }

    public function updateStatus(UpdateApplicationStatusRequest $request, int $application): RedirectResponse
    {
        $company = $this->company($request);

        if ($company instanceof \Illuminate\Http\RedirectResponse) {
            return $company;
        }

        $applicationModel = VacancyApplication::query()
            ->whereHas('vacancy', fn ($query) => $query
                ->withoutGlobalScope(OrganizationScope::class)
                ->where('company_profile_id', $company->id))
            ->findOrFail($application);

        $status = $request->validated('status');

        $applicationModel->update([
            'status' => $status,
            'notes' => $request->validated('notes'),
            'shortlisted_at' => in_array($status, ['shortlisted', 'interview'], true)
                ? ($applicationModel->shortlisted_at ?? now())
                : null,
            'rejected_at' => $status === 'rejected'
                ? ($applicationModel->rejected_at ?? now())
                : null,
        ]);

        return back()->with('success', 'Application status updated.');
    }

    public function downloadResume(Request $request, int $application, int $resume)
    {
        $company = $this->company($request);

        if ($company instanceof RedirectResponse) {
            return $company;
        }

        $applicationModel = VacancyApplication::query()
            ->whereHas('vacancy', fn ($query) => $query
                ->withoutGlobalScope(OrganizationScope::class)
                ->where('company_profile_id', $company->id))
            ->with([
                'candidate' => fn ($query) => $query->withoutGlobalScope(OrganizationScope::class),
            ])
            ->findOrFail($application);

        $resumeModel = CandidateResume::query()
            ->where('candidate_profile_id', $applicationModel->candidate_profile_id)
            ->findOrFail($resume);

        if (Storage::disk('public')->exists($resumeModel->file_path)) {
            return Storage::disk('public')->download($resumeModel->file_path, $resumeModel->file_name);
        }

        return response()->streamDownload(function () use ($resumeModel) {
            echo 'Seeded document placeholder for '.$resumeModel->file_name;
        }, $resumeModel->file_name, [
            'Content-Type' => $resumeModel->mime_type ?: 'text/plain',
        ]);
    }

    public function previewResume(Request $request, int $application, int $resume)
    {
        $company = $this->company($request);

        if ($company instanceof RedirectResponse) {
            return $company;
        }

        $applicationModel = VacancyApplication::query()
            ->whereHas('vacancy', fn ($query) => $query
                ->withoutGlobalScope(OrganizationScope::class)
                ->where('company_profile_id', $company->id))
            ->findOrFail($application);

        $resumeModel = CandidateResume::query()
            ->where('candidate_profile_id', $applicationModel->candidate_profile_id)
            ->findOrFail($resume);

        if (Storage::disk('public')->exists($resumeModel->file_path)) {
            return Storage::disk('public')->response(
                $resumeModel->file_path,
                $resumeModel->file_name,
                ['Content-Type' => $resumeModel->mime_type ?: 'application/octet-stream']
            );
        }

        return response(
            'Seeded document placeholder for '.$resumeModel->file_name,
            200,
            [
                'Content-Type' => 'text/plain; charset=UTF-8',
                'Content-Disposition' => 'inline; filename="'.$resumeModel->file_name.'"',
            ],
        );
    }
}
