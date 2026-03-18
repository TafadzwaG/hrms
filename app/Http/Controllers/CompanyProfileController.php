<?php

namespace App\Http\Controllers;

use App\Models\CompanyProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CompanyProfileController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');
        $industry = $request->input('industry');

        $baseQuery = CompanyProfile::query()
            ->withCount(['vacancies'])
            ->when($search, fn ($q) => $q->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('registration_number', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            }))
            ->when($status, fn ($q) => $q->where('status', $status))
            ->when($industry, fn ($q) => $q->where('industry', $industry));

        $companies = (clone $baseQuery)
            ->orderByDesc('updated_at')
            ->paginate(25)
            ->through(fn (CompanyProfile $company) => $this->mapCompany($company))
            ->withQueryString();

        $statsBaseQuery = CompanyProfile::query()
            ->when($search, fn ($q) => $q->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('registration_number', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            }))
            ->when($status, fn ($q) => $q->where('status', $status))
            ->when($industry, fn ($q) => $q->where('industry', $industry));

        return Inertia::render('Recruitment/Companies/Index', [
            'companies' => $companies,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'industry' => $industry,
            ],
            'statuses' => CompanyProfile::STATUSES,
            'industries' => CompanyProfile::INDUSTRIES,
            'stats' => [
                'total' => (clone $statsBaseQuery)->count(),
                'active' => (clone $statsBaseQuery)->where('status', 'active')->count(),
                'pending' => (clone $statsBaseQuery)->where('status', 'pending')->count(),
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
                'created_by' => $request->user()?->id,
                'updated_by' => $request->user()?->id,
            ]);
        });

        return redirect("/recruitment/companies/{$company->id}")
            ->with('success', 'Company profile created successfully.');
    }

    public function show(CompanyProfile $company)
    {
        $company->load([
            'vacancies' => fn ($q) => $q->orderByDesc('created_at')->limit(20),
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

        return redirect("/recruitment/companies/{$company->id}")
            ->with('success', 'Company profile updated successfully.');
    }

    public function destroy(CompanyProfile $company): RedirectResponse
    {
        $activeVacancies = $company->vacancies()->where('status', 'published')->count();

        if ($activeVacancies > 0) {
            return back()->with('error', 'Cannot delete a company that has published vacancies.');
        }

        $company->delete();

        return redirect('/recruitment/companies')
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

    // ── Helpers ──────────────────────────────────────────────

    private function validateCompany(Request $request, ?CompanyProfile $company = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
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
            'logo_url' => ['nullable', 'string', 'max:500'],
            'address' => ['nullable', 'string', 'max:500'],
            'city' => ['nullable', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'max:100'],
            'employee_count' => ['nullable', 'integer', 'min:0'],
            'founded_year' => ['nullable', 'integer', 'min:1800', 'max:' . date('Y')],
            'status' => ['nullable', 'string', Rule::in(CompanyProfile::STATUSES)],
        ]);
    }

    private function mapCompany(CompanyProfile $company): array
    {
        return [
            'id' => $company->id,
            'name' => $company->name,
            'registration_number' => $company->registration_number,
            'email' => $company->email,
            'phone' => $company->phone,
            'industry' => $company->industry,
            'status' => $company->status,
            'city' => $company->city,
            'country' => $company->country,
            'vacancies_count' => $company->vacancies_count ?? 0,
            'updated_at' => optional($company->updated_at)->toDateTimeString(),
            'links' => [
                'show' => "/recruitment/companies/{$company->id}",
                'edit' => "/recruitment/companies/{$company->id}/edit",
            ],
        ];
    }

    private function mapCompanyDetail(CompanyProfile $company): array
    {
        return [
            ...$this->mapCompany($company),
            'website' => $company->website,
            'description' => $company->description,
            'logo_url' => $company->logo_url,
            'address' => $company->address,
            'employee_count' => $company->employee_count,
            'founded_year' => $company->founded_year,
            'approved_at' => optional($company->approved_at)->toDateTimeString(),
            'metadata' => $company->metadata,
            'created_at' => optional($company->created_at)->toDateTimeString(),
            'owner' => $company->relationLoaded('owner') && $company->owner ? [
                'id' => $company->owner->id,
                'name' => $company->owner->name,
                'email' => $company->owner->email,
            ] : null,
            'created_by' => $company->createdBy ? ['id' => $company->createdBy->id, 'name' => $company->createdBy->name] : null,
            'updated_by' => $company->updatedBy ? ['id' => $company->updatedBy->id, 'name' => $company->updatedBy->name] : null,
            'vacancies' => $company->relationLoaded('vacancies') ? $company->vacancies->map(fn ($vacancy) => [
                'id' => $vacancy->id,
                'title' => $vacancy->title,
                'status' => $vacancy->status,
                'employment_type' => $vacancy->employment_type,
                'location' => $vacancy->location,
                'published_at' => optional($vacancy->published_at)->toDateTimeString(),
            ])->values()->all() : [],
            'links' => [
                'show' => "/recruitment/companies/{$company->id}",
                'edit' => "/recruitment/companies/{$company->id}/edit",
                'approve' => "/recruitment/companies/{$company->id}/approve",
                'suspend' => "/recruitment/companies/{$company->id}/suspend",
            ],
        ];
    }

    private function companyFormOptions(): array
    {
        return [
            'statuses' => CompanyProfile::STATUSES,
            'industries' => CompanyProfile::INDUSTRIES,
        ];
    }
}
