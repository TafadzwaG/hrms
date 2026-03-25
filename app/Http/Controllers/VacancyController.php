<?php

namespace App\Http\Controllers;

use App\Models\CompanyProfile;
use App\Models\Vacancy;
use App\Support\IndexTables\IndexTableSorter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class VacancyController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');
        $category = $request->input('category');
        $employmentType = $request->input('employment_type');
        $workMode = $request->input('work_mode');
        $sortMap = [
            'title' => 'title',
            'company' => fn ($query, $direction) => $query->orderBy(
                CompanyProfile::query()
                    ->select('company_name')
                    ->whereColumn('company_profiles.id', 'vacancies.company_profile_id')
                    ->limit(1),
                $direction,
            ),
            'category' => 'category',
            'employment_type' => 'employment_type',
            'work_mode' => 'work_mode',
            'location' => 'location',
            'application_deadline' => 'application_deadline',
            'status' => 'status',
            'applications_count' => 'applications_count',
            'updated_at' => 'updated_at',
        ];
        $sorting = IndexTableSorter::resolve($request, $sortMap, 'updated_at', 'desc');

        $baseQuery = Vacancy::query()
            ->with(['company:id,company_name'])
            ->withCount(['applications'])
            ->when($search, fn ($q) => $q->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhereHas('company', fn ($cq) => $cq->where('company_name', 'like', "%{$search}%"));
            }))
            ->when($status, fn ($q) => $q->where('status', $status))
            ->when($category, fn ($q) => $q->where('category', $category))
            ->when($employmentType, fn ($q) => $q->where('employment_type', $employmentType))
            ->when($workMode, fn ($q) => $q->where('work_mode', $workMode));

        $vacancies = (clone $baseQuery)
            ->tap(fn ($query) => IndexTableSorter::apply($query, $sortMap, $sorting['sort'], $sorting['direction']))
            ->paginate(25)
            ->through(fn (Vacancy $vacancy) => $this->mapVacancy($vacancy))
            ->withQueryString();

        $statsBaseQuery = Vacancy::query()
            ->when($search, fn ($q) => $q->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhereHas('company', fn ($cq) => $cq->where('company_name', 'like', "%{$search}%"));
            }))
            ->when($status, fn ($q) => $q->where('status', $status))
            ->when($category, fn ($q) => $q->where('category', $category))
            ->when($employmentType, fn ($q) => $q->where('employment_type', $employmentType))
            ->when($workMode, fn ($q) => $q->where('work_mode', $workMode));

        return Inertia::render('Recruitment/Vacancies/Index', [
            'vacancies' => $vacancies,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'category' => $category,
                'employment_type' => $employmentType,
                'work_mode' => $workMode,
                'sort' => $sorting['sort'],
                'direction' => $sorting['direction'],
            ],
            'statuses' => Vacancy::STATUSES,
            'categories' => Vacancy::CATEGORIES,
            'employmentTypes' => Vacancy::EMPLOYMENT_TYPES,
            'workModes' => Vacancy::WORK_MODES,
            'stats' => [
                'total' => (clone $statsBaseQuery)->count(),
                'published' => (clone $statsBaseQuery)->where('status', 'published')->count(),
                'closed' => (clone $statsBaseQuery)->where('status', 'closed')->count(),
                'total_applications' => Vacancy::query()
                    ->when($status, fn ($q) => $q->where('status', $status))
                    ->withCount('applications')
                    ->get()
                    ->sum('applications_count'),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Recruitment/Vacancies/Create', [
            'options' => $this->vacancyFormOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateVacancy($request);

        $vacancy = DB::transaction(function () use ($data, $request) {
            return Vacancy::create([
                ...$data,
                'created_by' => $request->user()?->id,
                'updated_by' => $request->user()?->id,
            ]);
        });

        return redirect("/recruitment/vacancies/{$vacancy->id}")
            ->with('success', 'Vacancy created successfully.');
    }

    public function show(Vacancy $vacancy)
    {
        $vacancy->load([
            'company:id,company_name,industry,city,country',
            'applications.candidate',
            'createdBy:id,name',
            'updatedBy:id,name',
        ]);

        return Inertia::render('Recruitment/Vacancies/Show', [
            'vacancy' => $this->mapVacancyDetail($vacancy),
        ]);
    }

    public function edit(Vacancy $vacancy)
    {
        return Inertia::render('Recruitment/Vacancies/Edit', [
            'vacancy' => $this->mapVacancyDetail($vacancy),
            'options' => $this->vacancyFormOptions(),
        ]);
    }

    public function update(Request $request, Vacancy $vacancy): RedirectResponse
    {
        $data = $this->validateVacancy($request, $vacancy);

        DB::transaction(function () use ($vacancy, $data, $request) {
            $vacancy->update([
                ...$data,
                'updated_by' => $request->user()?->id,
            ]);
        });

        return redirect("/recruitment/vacancies/{$vacancy->id}")
            ->with('success', 'Vacancy updated successfully.');
    }

    public function destroy(Vacancy $vacancy): RedirectResponse
    {
        $activeApplications = $vacancy->applications()->whereNotIn('status', ['rejected', 'withdrawn'])->count();

        if ($activeApplications > 0) {
            return back()->with('error', 'Cannot delete a vacancy that has active applications.');
        }

        $vacancy->delete();

        return redirect('/recruitment/vacancies')
            ->with('success', 'Vacancy deleted successfully.');
    }

    public function publish(Request $request, Vacancy $vacancy): RedirectResponse
    {
        DB::transaction(function () use ($vacancy, $request) {
            $vacancy->update([
                'status' => 'published',
                'published_at' => now(),
                'updated_by' => $request->user()?->id,
            ]);
        });

        return back()->with('success', 'Vacancy published successfully.');
    }

    public function close(Request $request, Vacancy $vacancy): RedirectResponse
    {
        DB::transaction(function () use ($vacancy, $request) {
            $vacancy->update([
                'status' => 'closed',
                'closed_at' => now(),
                'updated_by' => $request->user()?->id,
            ]);
        });

        return back()->with('success', 'Vacancy closed successfully.');
    }

    // ── Helpers ──────────────────────────────────────────────

    private function validateVacancy(Request $request, ?Vacancy $vacancy = null): array
    {
        return $request->validate([
            'company_profile_id' => ['required', 'integer', 'exists:company_profiles,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:10000'],
            'requirements' => ['nullable', 'string', 'max:10000'],
            'responsibilities' => ['nullable', 'string', 'max:10000'],
            'category' => ['nullable', 'string', Rule::in(Vacancy::CATEGORIES)],
            'employment_type' => ['nullable', 'string', Rule::in(Vacancy::EMPLOYMENT_TYPES)],
            'work_mode' => ['nullable', 'string', Rule::in(Vacancy::WORK_MODES)],
            'location' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'max:100'],
            'salary_min' => ['nullable', 'numeric', 'min:0'],
            'salary_max' => ['nullable', 'numeric', 'min:0', 'gte:salary_min'],
            'salary_currency' => ['nullable', 'string', 'max:10'],
            'experience_min' => ['nullable', 'integer', 'min:0'],
            'experience_max' => ['nullable', 'integer', 'min:0', 'gte:experience_min'],
            'education_level' => ['nullable', 'string', 'max:100'],
            'positions_available' => ['nullable', 'integer', 'min:1'],
            'application_deadline' => ['nullable', 'date'],
            'status' => ['nullable', 'string', Rule::in(Vacancy::STATUSES)],
        ]);
    }

    private function mapVacancy(Vacancy $vacancy): array
    {
        return [
            'id' => $vacancy->id,
            'title' => $vacancy->title,
            'company' => $vacancy->company ? [
                'id' => $vacancy->company->id,
                'name' => $vacancy->company->company_name,
                'company_name' => $vacancy->company->company_name,
            ] : null,
            'category' => $vacancy->category,
            'employment_type' => $vacancy->employment_type,
            'work_mode' => $vacancy->work_mode,
            'location' => $vacancy->location,
            'status' => $vacancy->status,
            'applications_count' => $vacancy->applications_count ?? 0,
            'published_at' => optional($vacancy->published_at)->toDateTimeString(),
            'application_deadline' => optional($vacancy->application_deadline)->toDateString(),
            'updated_at' => optional($vacancy->updated_at)->toDateTimeString(),
            'links' => [
                'show' => "/recruitment/vacancies/{$vacancy->id}",
                'edit' => "/recruitment/vacancies/{$vacancy->id}/edit",
            ],
        ];
    }

    private function mapVacancyDetail(Vacancy $vacancy): array
    {
        return [
            ...$this->mapVacancy($vacancy),
            'company_profile_id' => $vacancy->company_profile_id,
            'description' => $vacancy->description,
            'requirements' => $vacancy->requirements,
            'responsibilities' => $vacancy->responsibilities,
            'city' => $vacancy->city,
            'country' => $vacancy->country,
            'salary_min' => $vacancy->salary_min,
            'salary_max' => $vacancy->salary_max,
            'salary_currency' => $vacancy->salary_currency,
            'experience_min' => $vacancy->experience_min,
            'experience_max' => $vacancy->experience_max,
            'education_level' => $vacancy->education_level,
            'positions_available' => $vacancy->positions_available,
            'closed_at' => optional($vacancy->closed_at)->toDateTimeString(),
            'metadata' => $vacancy->metadata,
            'created_at' => optional($vacancy->created_at)->toDateTimeString(),
            'created_by' => $vacancy->createdBy ? ['id' => $vacancy->createdBy->id, 'name' => $vacancy->createdBy->name] : null,
            'updated_by' => $vacancy->updatedBy ? ['id' => $vacancy->updatedBy->id, 'name' => $vacancy->updatedBy->name] : null,
            'applications' => $vacancy->relationLoaded('applications') ? $vacancy->applications->map(fn ($app) => [
                'id' => $app->id,
                'candidate' => $app->candidate ? [
                    'id' => $app->candidate->id,
                    'full_name' => $app->candidate->full_name,
                    'email' => $app->candidate->email,
                ] : null,
                'status' => $app->status,
                'applied_at' => optional($app->applied_at)->toDateTimeString(),
            ])->values()->all() : [],
            'links' => [
                'show' => "/recruitment/vacancies/{$vacancy->id}",
                'edit' => "/recruitment/vacancies/{$vacancy->id}/edit",
                'publish' => "/recruitment/vacancies/{$vacancy->id}/publish",
                'close' => "/recruitment/vacancies/{$vacancy->id}/close",
            ],
        ];
    }

    private function vacancyFormOptions(): array
    {
        $companies = CompanyProfile::query()
            ->select(['id', 'name'])
            ->where('status', 'active')
            ->orderBy('name')
            ->get()
            ->map(fn (CompanyProfile $c) => ['id' => $c->id, 'name' => $c->name])
            ->values()
            ->all();

        return [
            'companies' => $companies,
            'categories' => Vacancy::CATEGORIES,
            'employment_types' => Vacancy::EMPLOYMENT_TYPES,
            'work_modes' => Vacancy::WORK_MODES,
            'statuses' => Vacancy::STATUSES,
        ];
    }
}
