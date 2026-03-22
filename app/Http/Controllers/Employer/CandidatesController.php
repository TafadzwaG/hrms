<?php

namespace App\Http\Controllers\Employer;

use App\Http\Requests\Employer\UpdateApplicationStatusRequest;
use App\Models\Scopes\OrganizationScope;
use App\Models\VacancyApplication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
            ->with([
                'resume',
                'vacancy' => fn ($query) => $query->withoutGlobalScope(OrganizationScope::class),
                'candidate' => fn ($query) => $query
                    ->withoutGlobalScope(OrganizationScope::class)
                    ->with(['skills'])
                    ->when($search !== '', function ($candidateQuery) use ($search) {
                        $candidateQuery->where(function ($innerQuery) use ($search) {
                            $innerQuery
                                ->where('full_name', 'like', "%{$search}%")
                                ->orWhere('headline', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                    }),
            ])
            ->latest('applied_at')
            ->paginate(12)
            ->through(function ($application) use ($vacancies) {
                return $this->presenter->application(
                    $application,
                    $application->candidate ? $this->candidateMatchScore($application->candidate, $vacancies) : null,
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
}
