<?php

namespace App\Http\Controllers\Employer;

use App\Http\Requests\Employer\UpdateVacancyStatusRequest;
use App\Http\Requests\Employer\UpsertEmployerVacancyRequest;
use App\Models\Scopes\OrganizationScope;
use App\Models\Vacancy;
use App\Models\VacancyApplication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class VacanciesController extends BaseEmployerHubController
{
    public function index(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $company = $this->company($request);

        if ($company instanceof \Illuminate\Http\RedirectResponse) {
            return $company;
        }

        $search = $request->string('search')->toString();
        $status = $request->string('status')->toString();

        $vacancies = $this->context->vacancyQuery()
            ->where('company_profile_id', $company->id)
            ->withCount('applications')
            ->when($search !== '', fn ($query) => $query->where('title', 'like', "%{$search}%"))
            ->when($status !== '', fn ($query) => $query->where('status', $status))
            ->latest()
            ->paginate(12)
            ->through(fn ($vacancy) => $this->presenter->vacancy($vacancy))
            ->withQueryString();

        return Inertia::render('Employer/Vacancies', [
            'company' => $this->presenter->company($company),
            'vacancies' => $vacancies,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'options' => [
                'statuses' => Vacancy::STATUSES,
                'categories' => Vacancy::CATEGORIES,
                'employment_types' => Vacancy::EMPLOYMENT_TYPES,
                'work_modes' => Vacancy::WORK_MODES,
            ],
        ]);
    }

    public function create(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $company = $this->company($request);

        if ($company instanceof \Illuminate\Http\RedirectResponse) {
            return $company;
        }

        return Inertia::render('Employer/VacancyCreate', [
            'company' => $this->presenter->company($company),
            'vacancy' => null,
            'options' => [
                'categories' => Vacancy::CATEGORIES,
                'employment_types' => Vacancy::EMPLOYMENT_TYPES,
                'work_modes' => Vacancy::WORK_MODES,
            ],
        ]);
    }

    public function store(UpsertEmployerVacancyRequest $request): RedirectResponse
    {
        $company = $this->company($request);

        if ($company instanceof \Illuminate\Http\RedirectResponse) {
            return $company;
        }

        $vacancy = $this->context->vacancyQuery()->create([
            ...$request->validated(),
            'company_profile_id' => $company->id,
            'currency' => $request->validated('currency', 'USD'),
            'status' => 'draft',
            'created_by' => $request->user()?->id,
            'updated_by' => $request->user()?->id,
        ]);

        return redirect()
            ->route('employer.vacancies.show', $vacancy->id)
            ->with('success', 'Vacancy created.');
    }

    public function show(Request $request, int $vacancy): Response|\Illuminate\Http\RedirectResponse
    {
        $company = $this->company($request);

        if ($company instanceof \Illuminate\Http\RedirectResponse) {
            return $company;
        }

        $vacancyModel = $this->context->findManagedVacancy($company, $vacancy);
        $vacancyModel->loadCount('applications');

        $applications = VacancyApplication::query()
            ->where('vacancy_id', $vacancyModel->id)
            ->with([
                'resume',
                'vacancy' => fn ($query) => $query->withoutGlobalScope(OrganizationScope::class),
                'candidate' => fn ($query) => $query
                    ->withoutGlobalScope(OrganizationScope::class)
                    ->with(['skills']),
            ])
            ->latest('applied_at')
            ->get();

        return Inertia::render('Employer/VacancyShow', [
            'company' => $this->presenter->company($company),
            'vacancy' => $this->presenter->vacancy($vacancyModel),
            'applications' => $applications->map(fn ($application) => $this->presenter->application($application))->all(),
        ]);
    }

    public function edit(Request $request, int $vacancy): Response|\Illuminate\Http\RedirectResponse
    {
        $company = $this->company($request);

        if ($company instanceof \Illuminate\Http\RedirectResponse) {
            return $company;
        }

        $vacancyModel = $this->context->findManagedVacancy($company, $vacancy);

        return Inertia::render('Employer/VacancyEdit', [
            'company' => $this->presenter->company($company),
            'vacancy' => $this->presenter->vacancy($vacancyModel),
            'options' => [
                'categories' => Vacancy::CATEGORIES,
                'employment_types' => Vacancy::EMPLOYMENT_TYPES,
                'work_modes' => Vacancy::WORK_MODES,
            ],
        ]);
    }

    public function update(UpsertEmployerVacancyRequest $request, int $vacancy): RedirectResponse
    {
        $company = $this->company($request);

        if ($company instanceof \Illuminate\Http\RedirectResponse) {
            return $company;
        }

        $vacancyModel = $this->context->findManagedVacancy($company, $vacancy);

        $vacancyModel->update([
            ...$request->validated(),
            'currency' => $request->validated('currency', $vacancyModel->currency ?: 'USD'),
            'updated_by' => $request->user()?->id,
        ]);

        return redirect()
            ->route('employer.vacancies.show', $vacancyModel->id)
            ->with('success', 'Vacancy updated.');
    }

    public function updateStatus(UpdateVacancyStatusRequest $request, int $vacancy): RedirectResponse
    {
        $company = $this->company($request);

        if ($company instanceof \Illuminate\Http\RedirectResponse) {
            return $company;
        }

        $vacancyModel = $this->context->findManagedVacancy($company, $vacancy);
        $status = $request->validated('status');

        $vacancyModel->update([
            'status' => $status,
            'published_at' => $status === 'published' ? ($vacancyModel->published_at ?? now()) : ($status === 'draft' ? null : $vacancyModel->published_at),
            'closed_at' => in_array($status, ['closed', 'archived'], true) ? ($vacancyModel->closed_at ?? now()) : null,
            'updated_by' => $request->user()?->id,
        ]);

        return back()->with('success', 'Vacancy status updated.');
    }

    public function destroy(Request $request, int $vacancy): RedirectResponse
    {
        $company = $this->company($request);

        if ($company instanceof \Illuminate\Http\RedirectResponse) {
            return $company;
        }

        $vacancyModel = $this->context->findManagedVacancy($company, $vacancy);

        if ($vacancyModel->applications()->exists()) {
            return back()->with('error', 'Vacancies with applications cannot be deleted. Close or archive them instead.');
        }

        $vacancyModel->delete();

        return redirect()
            ->route('employer.vacancies.index')
            ->with('success', 'Vacancy deleted.');
    }
}
