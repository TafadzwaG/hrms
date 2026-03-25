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

class CompanyProfileController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->string('search')->toString();
        $status = $this->normalizeStatusFilter($request->input('status'));
        $industry = $request->input('industry');

        $sortMap = [
            'company_name' => 'company_name',
            'industry' => 'industry',
            'email' => 'email',
            'status' => 'status',
            'vacancies_count' => 'vacancies_count',
            'updated_at' => 'updated_at',
        ];
        $sorting = IndexTableSorter::resolve($request, $sortMap, 'updated_at', 'desc');

        $baseQuery = CompanyProfile::query()
            ->withCount('vacancies')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($nested) use ($search) {
                    $nested->where('company_name', 'like', "%{$search}%")
                        ->orWhere('registration_number', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($status, fn ($query) => $query->where('status', $status))
            ->when($industry, fn ($query) => $query->where('industry', $industry));

        $companies = (clone $baseQuery)
            ->tap(fn ($query) => IndexTableSorter::apply($query, $sortMap, $sorting['sort'], $sorting['direction']))
            ->paginate(25)
            ->through(fn (CompanyProfile $company) => $this->mapCompany($company))
            ->withQueryString();

        $statsBaseQuery = CompanyProfile::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($nested) use ($search) {
                    $nested->where('company_name', 'like', "%{$search}%")
                        ->orWhere('registration_number', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($status, fn ($query) => $query->where('status', $status))
            ->when($industry, fn ($query) => $query->where('industry', $industry));

        return Inertia::render('Recruitment/Companies/Index', [
            'companies' => $companies,
            'filters' => [
                'search' => $search,
                'status' => $this->normalizeStatusForFrontend($status),
                'industry' => $industry,
                'sort' => $sorting['sort'],
                'direction' => $sorting['direction'],
            ],
            'statuses' => CompanyProfile::STATUSES,
            'industries' => CompanyProfile::INDUSTRIES,
            'stats' => [
                'total' => (clone $statsBaseQuery)->count(),
                'active' => (clone $statsBaseQuery)->where('status', 'active')->count(),
                'pending' => (clone $statsBaseQuery)->where('status', 'pending_review')->count(),
                'suspended' => (clone $statsBaseQuery)->where('status', 'suspended')->count(),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Recruitment/Companies/Create', [
            'options' => $this->companyFormOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateCompany($request);

        $company = DB::transaction(function () use ($data, $request) {
            return CompanyProfile::create([
                ...$data,
                'status' => $data['status'] ?? 'draft',
                'created_by' => $request->user()?->id,
                'updated_by' => $request->user()?->id,
            ]);
        });

        return redirect()->route('company-profiles.show', $company)
            ->with('success', 'Company profile created successfully.');
    }

    public function show(CompanyProfile $company)
    {
        $company->load([
            'vacancies' => fn ($query) => $query->withCount('applications')->latest()->limit(20),
            'owner:id,name,email',
            'createdBy:id,name',
            'updatedBy:id,name',
        ]);

        return Inertia::render('Recruitment/Companies/Show', [
            'company' => $this->mapCompanyDetail($company),
        ]);
    }

    public function edit(CompanyProfile $company)
    {
        return Inertia::render('Recruitment/Companies/Edit', [
            'company' => $this->mapCompanyDetail($company),
            'options' => $this->companyFormOptions(),
        ]);
    }

    public function update(Request $request, CompanyProfile $company): RedirectResponse
    {
        $data = $this->validateCompany($request, $company);

        DB::transaction(function () use ($company, $data, $request) {
            $company->update([
                ...$data,
                'updated_by' => $request->user()?->id,
            ]);
        });

        return redirect()->route('company-profiles.show', $company)
            ->with('success', 'Company profile updated successfully.');
    }

    public function destroy(CompanyProfile $company): RedirectResponse
    {
        $activeVacancies = $company->vacancies()->where('status', 'published')->count();

        if ($activeVacancies > 0) {
            return back()->with('error', 'Cannot delete a company that has published vacancies.');
        }

        $company->delete();

        return redirect()->route('company-profiles.index')
            ->with('success', 'Company profile deleted successfully.');
    }

    public function approve(Request $request, CompanyProfile $company): RedirectResponse
    {
        DB::transaction(function () use ($company, $request) {
            $company->update([
                'status' => 'active',
                'approved_at' => now(),
                'updated_by' => $request->user()?->id,
            ]);
        });

        return back()->with('success', 'Company approved successfully.');
    }

    public function suspend(Request $request, CompanyProfile $company): RedirectResponse
    {
        DB::transaction(function () use ($company, $request) {
            $company->update([
                'status' => 'suspended',
                'updated_by' => $request->user()?->id,
            ]);
        });

        return back()->with('success', 'Company suspended successfully.');
    }

    private function validateCompany(Request $request, ?CompanyProfile $company = null): array
    {
        return $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'registration_number' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('company_profiles', 'registration_number')->ignore($company?->id),
            ],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'website' => ['nullable', 'string', 'url', 'max:500'],
            'industry' => ['nullable', 'string', Rule::in(CompanyProfile::INDUSTRIES)],
            'description' => ['nullable', 'string', 'max:5000'],
            'address' => ['nullable', 'string', 'max:500'],
            'status' => ['nullable', 'string', Rule::in(CompanyProfile::STATUSES)],
        ]);
    }

    private function mapCompany(CompanyProfile $company): array
    {
        return [
            'id' => $company->id,
            'company_name' => $company->company_name,
            'industry' => $company->industry,
            'registration_number' => $company->registration_number,
            'email' => $company->email,
            'phone' => $company->phone,
            'status' => $this->normalizeStatusForFrontend($company->status),
            'vacancies_count' => $company->vacancies_count ?? 0,
            'updated_at' => optional($company->updated_at)->toDateTimeString(),
            'links' => [
                'show' => route('company-profiles.show', $company),
                'edit' => route('company-profiles.edit', $company),
            ],
        ];
    }

    private function mapCompanyDetail(CompanyProfile $company): array
    {
        return [
            ...$this->mapCompany($company),
            'website' => $company->website,
            'description' => $company->description,
            'address' => $company->address,
            'approved_at' => optional($company->approved_at)->toDateTimeString(),
            'created_at' => optional($company->created_at)->toDateTimeString(),
            'owner' => $company->relationLoaded('owner') && $company->owner ? [
                'id' => $company->owner->id,
                'name' => $company->owner->name,
                'email' => $company->owner->email,
            ] : null,
            'created_by' => $company->createdBy ? [
                'id' => $company->createdBy->id,
                'name' => $company->createdBy->name,
            ] : null,
            'updated_by' => $company->updatedBy ? [
                'id' => $company->updatedBy->id,
                'name' => $company->updatedBy->name,
            ] : null,
            'vacancies' => $company->relationLoaded('vacancies')
                ? $company->vacancies->map(fn (Vacancy $vacancy) => [
                    'id' => $vacancy->id,
                    'title' => $vacancy->title,
                    'category' => $vacancy->category,
                    'employment_type' => $vacancy->employment_type,
                    'status' => $vacancy->status,
                    'applications_count' => $vacancy->applications_count ?? 0,
                    'application_deadline' => optional($vacancy->application_deadline)->toDateString(),
                ])->values()->all()
                : [],
        ];
    }

    private function companyFormOptions(): array
    {
        return [
            'statuses' => CompanyProfile::STATUSES,
            'industries' => CompanyProfile::INDUSTRIES,
        ];
    }

    private function normalizeStatusFilter(?string $status): ?string
    {
        if (! $status || $status === 'all') {
            return null;
        }

        return $status === 'pending' ? 'pending_review' : $status;
    }

    private function normalizeStatusForFrontend(?string $status): ?string
    {
        return $status === 'pending_review' ? 'pending' : $status;
    }
}
