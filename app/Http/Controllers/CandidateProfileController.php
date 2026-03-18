<?php

namespace App\Http\Controllers;

use App\Models\CandidateProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CandidateProfileController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $visibilityStatus = $request->input('profile_visibility_status');
        $gender = $request->input('gender');
        $highestEducation = $request->input('highest_education');

        $baseQuery = CandidateProfile::query()
            ->withCount(['applications', 'resumes'])
            ->when($search, fn ($q) => $q->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('headline', 'like', "%{$search}%");
            }))
            ->when($visibilityStatus, fn ($q) => $q->where('profile_visibility_status', $visibilityStatus))
            ->when($gender, fn ($q) => $q->where('gender', $gender))
            ->when($highestEducation, fn ($q) => $q->where('highest_education', $highestEducation));

        $candidates = (clone $baseQuery)
            ->orderByDesc('updated_at')
            ->paginate(25)
            ->through(fn (CandidateProfile $candidate) => $this->mapCandidate($candidate))
            ->withQueryString();

        $statsBaseQuery = CandidateProfile::query()
            ->when($search, fn ($q) => $q->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('headline', 'like', "%{$search}%");
            }))
            ->when($visibilityStatus, fn ($q) => $q->where('profile_visibility_status', $visibilityStatus))
            ->when($gender, fn ($q) => $q->where('gender', $gender))
            ->when($highestEducation, fn ($q) => $q->where('highest_education', $highestEducation));

        return Inertia::render('Recruitment/Candidates/Index', [
            'candidates' => $candidates,
            'filters' => [
                'search' => $search,
                'profile_visibility_status' => $visibilityStatus,
                'gender' => $gender,
                'highest_education' => $highestEducation,
            ],
            'visibilityStatuses' => CandidateProfile::VISIBILITY_STATUSES,
            'educationLevels' => CandidateProfile::EDUCATION_LEVELS,
            'stats' => [
                'total' => (clone $statsBaseQuery)->count(),
                'active' => (clone $statsBaseQuery)->where('profile_visibility_status', 'active')->count(),
                'pending_payment' => (clone $statsBaseQuery)->where('profile_visibility_status', 'payment_pending')->count(),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Recruitment/Candidates/Create', [
            'options' => $this->candidateFormOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateCandidate($request);

        $candidate = DB::transaction(function () use ($data, $request) {
            return CandidateProfile::create([
                ...$data,
                'created_by' => $request->user()?->id,
                'updated_by' => $request->user()?->id,
            ]);
        });

        return redirect("/recruitment/candidates/{$candidate->id}")
            ->with('success', 'Candidate profile created successfully.');
    }

    public function show(CandidateProfile $candidate)
    {
        $candidate->load([
            'resumes',
            'educations',
            'experiences',
            'skills',
            'applications.vacancy.company',
            'payments',
        ]);

        return Inertia::render('Recruitment/Candidates/Show', [
            'candidate' => $this->mapCandidateDetail($candidate),
        ]);
    }

    public function edit(CandidateProfile $candidate)
    {
        return Inertia::render('Recruitment/Candidates/Edit', [
            'candidate' => $this->mapCandidateDetail($candidate),
            'options' => $this->candidateFormOptions(),
        ]);
    }

    public function update(Request $request, CandidateProfile $candidate): RedirectResponse
    {
        $data = $this->validateCandidate($request, $candidate);

        DB::transaction(function () use ($candidate, $data, $request) {
            $candidate->update([
                ...$data,
                'updated_by' => $request->user()?->id,
            ]);
        });

        return redirect("/recruitment/candidates/{$candidate->id}")
            ->with('success', 'Candidate profile updated successfully.');
    }

    public function destroy(CandidateProfile $candidate): RedirectResponse
    {
        $activeApplications = $candidate->applications()->whereNotIn('status', ['rejected', 'withdrawn'])->count();

        if ($activeApplications > 0) {
            return back()->with('error', 'Cannot delete a candidate with active applications.');
        }

        $candidate->delete();

        return redirect('/recruitment/candidates')
            ->with('success', 'Candidate profile deleted successfully.');
    }

    // ── Helpers ──────────────────────────────────────────────

    private function validateCandidate(Request $request, ?CandidateProfile $candidate = null): array
    {
        return $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('candidate_profiles', 'email')->ignore($candidate?->id),
            ],
            'phone' => ['nullable', 'string', 'max:50'],
            'gender' => ['nullable', 'string', 'max:20'],
            'date_of_birth' => ['nullable', 'date'],
            'national_id' => ['nullable', 'string', 'max:100'],
            'headline' => ['nullable', 'string', 'max:255'],
            'summary' => ['nullable', 'string', 'max:5000'],
            'location' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'max:100'],
            'highest_education' => ['nullable', 'string', Rule::in(CandidateProfile::EDUCATION_LEVELS)],
            'years_experience' => ['nullable', 'integer', 'min:0'],
            'current_employer' => ['nullable', 'string', 'max:255'],
            'current_job_title' => ['nullable', 'string', 'max:255'],
            'expected_salary' => ['nullable', 'numeric', 'min:0'],
            'salary_currency' => ['nullable', 'string', 'max:10'],
            'profile_visibility_status' => ['nullable', 'string', Rule::in(CandidateProfile::VISIBILITY_STATUSES)],
            'linkedin_url' => ['nullable', 'string', 'url', 'max:500'],
            'portfolio_url' => ['nullable', 'string', 'url', 'max:500'],
        ]);
    }

    private function mapCandidate(CandidateProfile $candidate): array
    {
        return [
            'id' => $candidate->id,
            'full_name' => $candidate->full_name,
            'email' => $candidate->email,
            'phone' => $candidate->phone,
            'headline' => $candidate->headline,
            'location' => $candidate->location,
            'highest_education' => $candidate->highest_education,
            'years_experience' => $candidate->years_experience,
            'profile_visibility_status' => $candidate->profile_visibility_status,
            'applications_count' => $candidate->applications_count ?? 0,
            'resumes_count' => $candidate->resumes_count ?? 0,
            'updated_at' => optional($candidate->updated_at)->toDateTimeString(),
            'links' => [
                'show' => "/recruitment/candidates/{$candidate->id}",
                'edit' => "/recruitment/candidates/{$candidate->id}/edit",
            ],
        ];
    }

    private function mapCandidateDetail(CandidateProfile $candidate): array
    {
        return [
            ...$this->mapCandidate($candidate),
            'gender' => $candidate->gender,
            'date_of_birth' => optional($candidate->date_of_birth)->toDateString(),
            'national_id' => $candidate->national_id,
            'summary' => $candidate->summary,
            'city' => $candidate->city,
            'country' => $candidate->country,
            'current_employer' => $candidate->current_employer,
            'current_job_title' => $candidate->current_job_title,
            'expected_salary' => $candidate->expected_salary,
            'salary_currency' => $candidate->salary_currency,
            'linkedin_url' => $candidate->linkedin_url,
            'portfolio_url' => $candidate->portfolio_url,
            'is_public' => $candidate->is_public,
            'listing_activated_at' => optional($candidate->listing_activated_at)->toDateTimeString(),
            'listing_expires_at' => optional($candidate->listing_expires_at)->toDateTimeString(),
            'metadata' => $candidate->metadata,
            'created_at' => optional($candidate->created_at)->toDateTimeString(),
            'resumes' => $candidate->relationLoaded('resumes') ? $candidate->resumes->map(fn ($resume) => [
                'id' => $resume->id,
                'file_name' => $resume->file_name,
                'file_path' => $resume->file_path,
                'is_primary' => $resume->is_primary,
                'created_at' => optional($resume->created_at)->toDateTimeString(),
                'download_url' => "/recruitment/candidates/{$candidate->id}/resumes/{$resume->id}/download",
            ])->values()->all() : [],
            'educations' => $candidate->relationLoaded('educations') ? $candidate->educations->map(fn ($edu) => [
                'id' => $edu->id,
                'institution' => $edu->institution,
                'degree' => $edu->degree,
                'field_of_study' => $edu->field_of_study,
                'start_date' => optional($edu->start_date)->toDateString(),
                'end_date' => optional($edu->end_date)->toDateString(),
                'grade' => $edu->grade,
            ])->values()->all() : [],
            'experiences' => $candidate->relationLoaded('experiences') ? $candidate->experiences->map(fn ($exp) => [
                'id' => $exp->id,
                'company_name' => $exp->company_name,
                'job_title' => $exp->job_title,
                'start_date' => optional($exp->start_date)->toDateString(),
                'end_date' => optional($exp->end_date)->toDateString(),
                'is_current' => $exp->is_current,
                'description' => $exp->description,
            ])->values()->all() : [],
            'skills' => $candidate->relationLoaded('skills') ? $candidate->skills->map(fn ($skill) => [
                'id' => $skill->id,
                'name' => $skill->name,
                'proficiency_level' => $skill->proficiency_level,
                'years_experience' => $skill->years_experience,
            ])->values()->all() : [],
            'applications' => $candidate->relationLoaded('applications') ? $candidate->applications->map(fn ($app) => [
                'id' => $app->id,
                'vacancy' => $app->vacancy ? [
                    'id' => $app->vacancy->id,
                    'title' => $app->vacancy->title,
                    'company' => $app->vacancy->company ? [
                        'id' => $app->vacancy->company->id,
                        'name' => $app->vacancy->company->name,
                    ] : null,
                ] : null,
                'status' => $app->status,
                'applied_at' => optional($app->applied_at)->toDateTimeString(),
            ])->values()->all() : [],
            'payments' => $candidate->relationLoaded('payments') ? $candidate->payments->map(fn ($payment) => [
                'id' => $payment->id,
                'amount' => $payment->amount,
                'currency' => $payment->currency,
                'status' => $payment->status,
                'provider' => $payment->provider,
                'paid_at' => optional($payment->paid_at)->toDateTimeString(),
                'created_at' => optional($payment->created_at)->toDateTimeString(),
            ])->values()->all() : [],
            'links' => [
                'show' => "/recruitment/candidates/{$candidate->id}",
                'edit' => "/recruitment/candidates/{$candidate->id}/edit",
                'resumes' => "/recruitment/candidates/{$candidate->id}/resumes",
            ],
        ];
    }

    private function candidateFormOptions(): array
    {
        return [
            'education_levels' => CandidateProfile::EDUCATION_LEVELS,
            'visibility_statuses' => CandidateProfile::VISIBILITY_STATUSES,
        ];
    }
}
