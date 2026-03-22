<?php

namespace App\Http\Controllers\Employer;

use App\Http\Requests\Employer\ScheduleInterviewRequest;
use App\Http\Requests\Employer\UpdateInterviewStatusRequest;
use App\Models\ApplicationInterview;
use App\Models\Scopes\OrganizationScope;
use App\Models\VacancyApplication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class InterviewsController extends BaseEmployerHubController
{
    public function index(Request $request): Response|RedirectResponse
    {
        $company = $this->company($request);

        if ($company instanceof RedirectResponse) {
            return $company;
        }

        $search = $request->string('search')->toString();
        $status = $request->string('status')->toString();

        $interviews = ApplicationInterview::query()
            ->where('company_profile_id', $company->id)
            ->when($status !== '', fn ($query) => $query->where('status', $status))
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($innerQuery) use ($search) {
                    $innerQuery
                        ->whereHas('candidate', fn ($candidateQuery) => $candidateQuery
                            ->withoutGlobalScope(OrganizationScope::class)
                            ->where('full_name', 'like', "%{$search}%"))
                        ->orWhereHas('vacancy', fn ($vacancyQuery) => $vacancyQuery
                            ->withoutGlobalScope(OrganizationScope::class)
                            ->where('title', 'like', "%{$search}%"));
                });
            })
            ->with([
                'candidate' => fn ($query) => $query->withoutGlobalScope(OrganizationScope::class),
                'vacancy' => fn ($query) => $query->withoutGlobalScope(OrganizationScope::class),
            ])
            ->latest('scheduled_at')
            ->paginate(12)
            ->through(fn (ApplicationInterview $interview) => $this->presenter->interview($interview))
            ->withQueryString();

        return Inertia::render('Employer/Interviews', [
            'company' => $this->presenter->company($company),
            'user' => $this->presenter->user($request->user()),
            'interviews' => $interviews,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'statuses' => ApplicationInterview::STATUSES,
        ]);
    }

    public function store(ScheduleInterviewRequest $request, int $application): RedirectResponse
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
                'vacancy' => fn ($query) => $query->withoutGlobalScope(OrganizationScope::class),
            ])
            ->findOrFail($application);

        DB::transaction(function () use ($applicationModel, $company, $request) {
            ApplicationInterview::query()->create([
                'vacancy_application_id' => $applicationModel->id,
                'company_profile_id' => $company->id,
                'candidate_profile_id' => $applicationModel->candidate_profile_id,
                'vacancy_id' => $applicationModel->vacancy_id,
                'scheduled_at' => $request->date('scheduled_at'),
                'ends_at' => $request->date('ends_at'),
                'timezone' => $request->validated('timezone') ?: config('app.timezone', 'UTC'),
                'meeting_type' => $request->validated('meeting_type'),
                'location' => $request->validated('location'),
                'instructions' => $request->validated('instructions'),
                'status' => 'scheduled',
                'created_by' => $request->user()?->id,
                'updated_by' => $request->user()?->id,
            ]);

            $applicationModel->update([
                'status' => 'interview',
                'shortlisted_at' => $applicationModel->shortlisted_at ?? now(),
                'notes' => $request->validated('instructions') ?: $applicationModel->notes,
            ]);
        });

        return back()->with('success', 'Interview scheduled successfully.');
    }

    public function update(UpdateInterviewStatusRequest $request, int $interview): RedirectResponse
    {
        $company = $this->company($request);

        if ($company instanceof RedirectResponse) {
            return $company;
        }

        $interviewModel = ApplicationInterview::query()
            ->where('company_profile_id', $company->id)
            ->findOrFail($interview);

        $interviewModel->update([
            'status' => $request->validated('status'),
            'instructions' => $request->validated('instructions') ?: $interviewModel->instructions,
            'updated_by' => $request->user()?->id,
        ]);

        return back()->with('success', 'Interview updated successfully.');
    }
}
