<?php

namespace App\Http\Controllers;

use App\Models\VacancyApplication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class VacancyApplicationController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $vacancyId = $request->input('vacancy_id');
        $candidateProfileId = $request->input('candidate_profile_id');
        $status = $request->input('status');

        $baseQuery = VacancyApplication::query()
            ->with([
                'vacancy:id,title,status',
                'vacancy.company:id,name',
                'candidate:id,full_name,email,phone',
            ])
            ->when($search, fn ($q) => $q->where(function ($q) use ($search) {
                $q->whereHas('candidate', fn ($cq) => $cq->where('full_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%"))
                    ->orWhereHas('vacancy', fn ($vq) => $vq->where('title', 'like', "%{$search}%"));
            }))
            ->when($vacancyId, fn ($q) => $q->where('vacancy_id', $vacancyId))
            ->when($candidateProfileId, fn ($q) => $q->where('candidate_profile_id', $candidateProfileId))
            ->when($status, fn ($q) => $q->where('status', $status));

        $applications = (clone $baseQuery)
            ->orderByDesc('updated_at')
            ->paginate(25)
            ->through(fn (VacancyApplication $application) => $this->mapApplication($application))
            ->withQueryString();

        $statsBaseQuery = VacancyApplication::query()
            ->when($vacancyId, fn ($q) => $q->where('vacancy_id', $vacancyId))
            ->when($candidateProfileId, fn ($q) => $q->where('candidate_profile_id', $candidateProfileId));

        return Inertia::render('Recruitment/Applications/Index', [
            'applications' => $applications,
            'filters' => [
                'search' => $search,
                'vacancy_id' => $vacancyId,
                'candidate_profile_id' => $candidateProfileId,
                'status' => $status,
            ],
            'statuses' => VacancyApplication::STATUSES,
            'stats' => [
                'total' => (clone $statsBaseQuery)->count(),
                'submitted' => (clone $statsBaseQuery)->where('status', 'submitted')->count(),
                'shortlisted' => (clone $statsBaseQuery)->where('status', 'shortlisted')->count(),
                'rejected' => (clone $statsBaseQuery)->where('status', 'rejected')->count(),
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'vacancy_id' => ['required', 'integer', 'exists:vacancies,id'],
            'candidate_profile_id' => ['required', 'integer', 'exists:candidate_profiles,id'],
            'candidate_resume_id' => ['nullable', 'integer', 'exists:candidate_resumes,id'],
            'cover_letter' => ['nullable', 'string', 'max:10000'],
        ]);

        $application = DB::transaction(function () use ($data, $request) {
            return VacancyApplication::create([
                ...$data,
                'status' => 'submitted',
                'applied_at' => now(),
                'created_by' => $request->user()?->id,
                'updated_by' => $request->user()?->id,
            ]);
        });

        return redirect("/recruitment/applications/{$application->id}")
            ->with('success', 'Application submitted successfully.');
    }

    public function show(VacancyApplication $application)
    {
        $application->load([
            'vacancy.company:id,name,industry',
            'candidate.resumes',
            'candidate.skills',
        ]);

        return Inertia::render('Recruitment/Applications/Show', [
            'application' => $this->mapApplicationDetail($application),
        ]);
    }

    public function updateStatus(Request $request, VacancyApplication $application): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', 'string', Rule::in(VacancyApplication::STATUSES)],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $timestamps = [];
        if ($data['status'] === 'shortlisted') {
            $timestamps['shortlisted_at'] = now();
        } elseif ($data['status'] === 'rejected') {
            $timestamps['rejected_at'] = now();
        } elseif ($data['status'] === 'interviewed') {
            $timestamps['interviewed_at'] = now();
        } elseif ($data['status'] === 'offered') {
            $timestamps['offered_at'] = now();
        } elseif ($data['status'] === 'hired') {
            $timestamps['hired_at'] = now();
        }

        DB::transaction(function () use ($application, $data, $timestamps, $request) {
            $application->update([
                'status' => $data['status'],
                'notes' => $data['notes'] ?? $application->notes,
                ...$timestamps,
                'updated_by' => $request->user()?->id,
            ]);
        });

        return back()->with('success', 'Application status updated successfully.');
    }

    public function destroy(VacancyApplication $application): RedirectResponse
    {
        $application->delete();

        return redirect('/recruitment/applications')
            ->with('success', 'Application deleted successfully.');
    }

    // ── Helpers ──────────────────────────────────────────────

    private function mapApplication(VacancyApplication $application): array
    {
        return [
            'id' => $application->id,
            'vacancy' => $application->vacancy ? [
                'id' => $application->vacancy->id,
                'title' => $application->vacancy->title,
                'status' => $application->vacancy->status,
                'company' => $application->vacancy->company ? [
                    'id' => $application->vacancy->company->id,
                    'name' => $application->vacancy->company->name,
                ] : null,
            ] : null,
            'candidate' => $application->candidate ? [
                'id' => $application->candidate->id,
                'full_name' => $application->candidate->full_name,
                'email' => $application->candidate->email,
                'phone' => $application->candidate->phone,
            ] : null,
            'status' => $application->status,
            'applied_at' => optional($application->applied_at)->toDateTimeString(),
            'updated_at' => optional($application->updated_at)->toDateTimeString(),
            'links' => [
                'show' => "/recruitment/applications/{$application->id}",
            ],
        ];
    }

    private function mapApplicationDetail(VacancyApplication $application): array
    {
        return [
            ...$this->mapApplication($application),
            'candidate_resume_id' => $application->candidate_resume_id,
            'cover_letter' => $application->cover_letter,
            'notes' => $application->notes,
            'shortlisted_at' => optional($application->shortlisted_at)->toDateTimeString(),
            'rejected_at' => optional($application->rejected_at)->toDateTimeString(),
            'interviewed_at' => optional($application->interviewed_at)->toDateTimeString(),
            'offered_at' => optional($application->offered_at)->toDateTimeString(),
            'hired_at' => optional($application->hired_at)->toDateTimeString(),
            'metadata' => $application->metadata,
            'created_at' => optional($application->created_at)->toDateTimeString(),
            'candidate' => $application->candidate ? [
                'id' => $application->candidate->id,
                'full_name' => $application->candidate->full_name,
                'email' => $application->candidate->email,
                'phone' => $application->candidate->phone,
                'resumes' => $application->candidate->relationLoaded('resumes') ? $application->candidate->resumes->map(fn ($resume) => [
                    'id' => $resume->id,
                    'file_name' => $resume->file_name,
                    'is_primary' => $resume->is_primary,
                    'download_url' => "/recruitment/candidates/{$application->candidate->id}/resumes/{$resume->id}/download",
                ])->values()->all() : [],
                'skills' => $application->candidate->relationLoaded('skills') ? $application->candidate->skills->map(fn ($skill) => [
                    'id' => $skill->id,
                    'name' => $skill->name,
                    'proficiency_level' => $skill->proficiency_level,
                ])->values()->all() : [],
            ] : null,
            'links' => [
                'show' => "/recruitment/applications/{$application->id}",
                'update_status' => "/recruitment/applications/{$application->id}/status",
            ],
        ];
    }
}
