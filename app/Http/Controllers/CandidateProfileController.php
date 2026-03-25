<?php

namespace App\Http\Controllers;

use App\Models\CandidateEducation;
use App\Models\CandidateExperience;
use App\Models\CandidateProfile;
use App\Models\CandidateSkill;
use App\Models\VacancyApplication;
use App\Support\IndexTables\IndexTableSorter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CandidateProfileController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->string('search')->toString();
        $visibilityStatus = $this->normalizeVisibilityFilter($request->input('visibility_status'));
        $gender = $request->input('gender');
        $highestEducation = $request->input('education');

        $sortMap = [
            'full_name' => 'full_name',
            'email' => 'email',
            'headline' => 'headline',
            'profile_visibility_status' => 'profile_visibility_status',
            'is_public' => 'is_public',
            'highest_education' => 'highest_education',
            'listing_activated_at' => 'listing_activated_at',
            'updated_at' => 'updated_at',
        ];
        $sorting = IndexTableSorter::resolve($request, $sortMap, 'updated_at', 'desc');

        $baseQuery = CandidateProfile::query()
            ->withCount(['applications', 'resumes'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($nested) use ($search) {
                    $nested->where('full_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('headline', 'like', "%{$search}%")
                        ->orWhere('location', 'like', "%{$search}%");
                });
            })
            ->when($visibilityStatus, function ($query) use ($visibilityStatus) {
                if ($visibilityStatus === 'pending_payment') {
                    $query->whereIn('profile_visibility_status', ['pending_payment', 'payment_pending']);

                    return;
                }

                $query->where('profile_visibility_status', $visibilityStatus);
            })
            ->when($gender, fn ($query) => $query->where('gender', $gender))
            ->when($highestEducation, fn ($query) => $query->where('highest_education', $highestEducation));

        $candidates = (clone $baseQuery)
            ->tap(fn ($query) => IndexTableSorter::apply($query, $sortMap, $sorting['sort'], $sorting['direction']))
            ->paginate(25)
            ->through(fn (CandidateProfile $candidate) => $this->mapCandidate($candidate))
            ->withQueryString();

        $statsBaseQuery = CandidateProfile::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($nested) use ($search) {
                    $nested->where('full_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('headline', 'like', "%{$search}%")
                        ->orWhere('location', 'like', "%{$search}%");
                });
            })
            ->when($visibilityStatus, function ($query) use ($visibilityStatus) {
                if ($visibilityStatus === 'pending_payment') {
                    $query->whereIn('profile_visibility_status', ['pending_payment', 'payment_pending']);

                    return;
                }

                $query->where('profile_visibility_status', $visibilityStatus);
            })
            ->when($gender, fn ($query) => $query->where('gender', $gender))
            ->when($highestEducation, fn ($query) => $query->where('highest_education', $highestEducation));

        return Inertia::render('Recruitment/Candidates/Index', [
            'candidates' => $candidates,
            'filters' => [
                'search' => $search,
                'visibility_status' => $visibilityStatus,
                'gender' => $gender,
                'education' => $highestEducation,
                'sort' => $sorting['sort'],
                'direction' => $sorting['direction'],
            ],
            'visibilityStatuses' => CandidateProfile::VISIBILITY_STATUSES,
            'educationLevels' => CandidateProfile::EDUCATION_LEVELS,
            'stats' => [
                'total' => (clone $statsBaseQuery)->count(),
                'active' => (clone $statsBaseQuery)->where('profile_visibility_status', 'active')->count(),
                'public' => (clone $statsBaseQuery)->where('is_public', true)->count(),
                'draft' => (clone $statsBaseQuery)->where('profile_visibility_status', 'draft')->count(),
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
                'profile_visibility_status' => $data['profile_visibility_status'] ?? 'draft',
                'is_public' => (bool) ($data['is_public'] ?? false),
                'created_by' => $request->user()?->id,
                'updated_by' => $request->user()?->id,
            ]);
        });

        return redirect()->route('candidate-profiles.show', $candidate)
            ->with('success', 'Candidate profile created successfully.');
    }

    public function show(CandidateProfile $candidate)
    {
        $candidate->load([
            'resumes' => fn ($query) => $query->latest(),
            'educations' => fn ($query) => $query->latest('end_date'),
            'experiences' => fn ($query) => $query->latest('start_date'),
            'skills',
            'applications.vacancy.company',
            'payments' => fn ($query) => $query->latest(),
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

        return redirect()->route('candidate-profiles.show', $candidate)
            ->with('success', 'Candidate profile updated successfully.');
    }

    public function destroy(CandidateProfile $candidate): RedirectResponse
    {
        $activeApplications = $candidate->applications()
            ->whereNotIn('status', ['rejected', 'withdrawn'])
            ->count();

        if ($activeApplications > 0) {
            return back()->with('error', 'Cannot delete a candidate with active applications.');
        }

        $candidate->delete();

        return redirect()->route('candidate-profiles.index')
            ->with('success', 'Candidate profile deleted successfully.');
    }

    public function storeEducation(Request $request, CandidateProfile $candidate): RedirectResponse
    {
        $candidate->educations()->create($this->validateEducation($request));

        return back()->with('success', 'Education added successfully.');
    }

    public function updateEducation(Request $request, CandidateProfile $candidate, CandidateEducation $education): RedirectResponse
    {
        $this->ensureChildBelongsToCandidate($candidate, (int) $education->candidate_profile_id);

        $education->update($this->validateEducation($request));

        return back()->with('success', 'Education updated successfully.');
    }

    public function destroyEducation(CandidateProfile $candidate, CandidateEducation $education): RedirectResponse
    {
        $this->ensureChildBelongsToCandidate($candidate, (int) $education->candidate_profile_id);

        $education->delete();

        return back()->with('success', 'Education deleted successfully.');
    }

    public function storeExperience(Request $request, CandidateProfile $candidate): RedirectResponse
    {
        $candidate->experiences()->create($this->validateExperience($request));

        return back()->with('success', 'Experience added successfully.');
    }

    public function updateExperience(Request $request, CandidateProfile $candidate, CandidateExperience $experience): RedirectResponse
    {
        $this->ensureChildBelongsToCandidate($candidate, (int) $experience->candidate_profile_id);

        $experience->update($this->validateExperience($request));

        return back()->with('success', 'Experience updated successfully.');
    }

    public function destroyExperience(CandidateProfile $candidate, CandidateExperience $experience): RedirectResponse
    {
        $this->ensureChildBelongsToCandidate($candidate, (int) $experience->candidate_profile_id);

        $experience->delete();

        return back()->with('success', 'Experience deleted successfully.');
    }

    public function storeSkill(Request $request, CandidateProfile $candidate): RedirectResponse
    {
        $candidate->skills()->create($this->validateSkill($request));

        return back()->with('success', 'Skill added successfully.');
    }

    public function destroySkill(CandidateProfile $candidate, CandidateSkill $skill): RedirectResponse
    {
        $this->ensureChildBelongsToCandidate($candidate, (int) $skill->candidate_profile_id);

        $skill->delete();

        return back()->with('success', 'Skill deleted successfully.');
    }

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
            'alt_phone' => ['nullable', 'string', 'max:50'],
            'gender' => ['nullable', 'string', 'max:20'],
            'date_of_birth' => ['nullable', 'date'],
            'national_id' => ['nullable', 'string', 'max:100'],
            'location' => ['nullable', 'string', 'max:255'],
            'headline' => ['nullable', 'string', 'max:255'],
            'professional_summary' => ['nullable', 'string', 'max:5000'],
            'expected_salary' => ['nullable', 'numeric', 'min:0'],
            'salary_currency' => ['nullable', 'string', 'max:10'],
            'years_experience' => ['nullable', 'numeric', 'min:0'],
            'highest_education' => ['nullable', 'string', Rule::in(CandidateProfile::EDUCATION_LEVELS)],
            'profile_visibility_status' => ['nullable', 'string', Rule::in(CandidateProfile::VISIBILITY_STATUSES)],
            'is_public' => ['nullable', 'boolean'],
        ]);
    }

    private function validateEducation(Request $request): array
    {
        return $request->validate([
            'institution' => ['required', 'string', 'max:255'],
            'qualification' => ['required', 'string', 'max:255'],
            'field_of_study' => ['nullable', 'string', 'max:255'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
            'grade' => ['nullable', 'string', 'max:50'],
        ]);
    }

    private function validateExperience(Request $request): array
    {
        $validated = $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'job_title' => ['required', 'string', 'max:255'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
            'is_current' => ['nullable', 'boolean'],
            'description' => ['nullable', 'string', 'max:5000'],
        ]);

        return [
            'employer_name' => $validated['company_name'],
            'job_title' => $validated['job_title'],
            'start_date' => $validated['start_date'] ?? null,
            'end_date' => $validated['is_current'] ?? false ? null : ($validated['end_date'] ?? null),
            'currently_working' => (bool) ($validated['is_current'] ?? false),
            'description' => $validated['description'] ?? null,
        ];
    }

    private function validateSkill(Request $request): array
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'proficiency' => ['nullable', 'string', 'max:50'],
            'years_experience' => ['nullable', 'numeric', 'min:0'],
        ]);

        return [
            'name' => $validated['name'],
            'level' => $validated['proficiency'] ?? null,
            'years_experience' => $validated['years_experience'] ?? null,
        ];
    }

    private function mapCandidate(CandidateProfile $candidate): array
    {
        $visibilityStatus = $this->normalizeVisibilityStatus($candidate->profile_visibility_status);

        return [
            'id' => $candidate->id,
            'full_name' => $candidate->full_name,
            'email' => $candidate->email,
            'phone' => $candidate->phone,
            'headline' => $candidate->headline,
            'location' => $candidate->location,
            'highest_education' => $candidate->highest_education,
            'years_experience' => $candidate->years_experience,
            'visibility_status' => $visibilityStatus,
            'profile_visibility_status' => $visibilityStatus,
            'is_public' => (bool) $candidate->is_public,
            'applications_count' => $candidate->applications_count ?? 0,
            'resumes_count' => $candidate->resumes_count ?? 0,
            'listing_activated_at' => optional($candidate->listing_activated_at)->toDateTimeString(),
            'listing_expires_at' => optional($candidate->listing_expires_at)->toDateTimeString(),
            'updated_at' => optional($candidate->updated_at)->toDateTimeString(),
            'links' => [
                'show' => route('candidate-profiles.show', $candidate),
                'edit' => route('candidate-profiles.edit', $candidate),
            ],
        ];
    }

    private function mapCandidateDetail(CandidateProfile $candidate): array
    {
        return [
            ...$this->mapCandidate($candidate),
            'alt_phone' => $candidate->alt_phone,
            'national_id' => $candidate->national_id,
            'gender' => $candidate->gender,
            'date_of_birth' => optional($candidate->date_of_birth)->toDateString(),
            'professional_summary' => $candidate->professional_summary,
            'expected_salary' => $candidate->expected_salary,
            'salary_currency' => $candidate->salary_currency,
            'created_at' => optional($candidate->created_at)->toDateTimeString(),
            'resumes' => $candidate->relationLoaded('resumes')
                ? $candidate->resumes->map(fn ($resume) => [
                    'id' => $resume->id,
                    'file_name' => $resume->file_name,
                    'is_primary' => (bool) $resume->is_primary,
                    'created_at' => optional($resume->created_at)->toDateTimeString(),
                    'download_url' => route('candidate-resumes.download', [$candidate, $resume]),
                ])->values()->all()
                : [],
            'education' => $candidate->relationLoaded('educations')
                ? $candidate->educations->map(fn ($education) => [
                    'id' => $education->id,
                    'institution' => $education->institution,
                    'qualification' => $education->qualification,
                    'field_of_study' => $education->field_of_study,
                    'start_date' => optional($education->start_date)->toDateString(),
                    'end_date' => optional($education->end_date)->toDateString(),
                    'grade' => $education->grade,
                ])->values()->all()
                : [],
            'experience' => $candidate->relationLoaded('experiences')
                ? $candidate->experiences->map(fn ($experience) => [
                    'id' => $experience->id,
                    'company_name' => $experience->employer_name,
                    'job_title' => $experience->job_title,
                    'start_date' => optional($experience->start_date)->toDateString(),
                    'end_date' => optional($experience->end_date)->toDateString(),
                    'is_current' => (bool) $experience->currently_working,
                    'description' => $experience->description,
                ])->values()->all()
                : [],
            'skills' => $candidate->relationLoaded('skills')
                ? $candidate->skills->map(fn ($skill) => [
                    'id' => $skill->id,
                    'name' => $skill->name,
                    'proficiency' => $skill->level,
                    'years_experience' => $skill->years_experience,
                ])->values()->all()
                : [],
            'applications' => $candidate->relationLoaded('applications')
                ? $candidate->applications->map(fn (VacancyApplication $application) => [
                    'id' => $application->id,
                    'vacancy' => $application->vacancy ? [
                        'id' => $application->vacancy->id,
                        'title' => $application->vacancy->title,
                        'company' => $application->vacancy->company?->company_name ?? 'Employer',
                    ] : null,
                    'status' => $application->status,
                    'applied_at' => optional($application->applied_at)->toDateTimeString(),
                ])->values()->all()
                : [],
            'payments' => $candidate->relationLoaded('payments')
                ? $candidate->payments->map(fn ($payment) => [
                    'id' => $payment->id,
                    'amount' => $payment->amount,
                    'currency' => $payment->currency,
                    'status' => $payment->status,
                    'provider' => $payment->provider,
                    'paid_at' => optional($payment->paid_at)->toDateTimeString(),
                    'created_at' => optional($payment->created_at)->toDateTimeString(),
                ])->values()->all()
                : [],
        ];
    }

    private function candidateFormOptions(): array
    {
        return [
            'education_levels' => CandidateProfile::EDUCATION_LEVELS,
            'visibility_statuses' => CandidateProfile::VISIBILITY_STATUSES,
        ];
    }

    private function normalizeVisibilityStatus(?string $status): ?string
    {
        return $status === 'payment_pending' ? 'pending_payment' : $status;
    }

    private function normalizeVisibilityFilter(?string $status): ?string
    {
        if (! $status || $status === 'all') {
            return null;
        }

        return $status === 'payment_pending' ? 'pending_payment' : $status;
    }

    private function ensureChildBelongsToCandidate(CandidateProfile $candidate, int $candidateProfileId): void
    {
        abort_unless((int) $candidate->id === $candidateProfileId, 404);
    }
}
