<?php

namespace App\Http\Controllers\Candidate;

use App\Models\Scopes\OrganizationScope;
use App\Models\VacancyApplication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationsController extends BaseCandidateHubController
{
    public function index(Request $request): Response|RedirectResponse
    {
        $candidate = $this->candidate($request);

        if ($candidate instanceof RedirectResponse) {
            return $candidate;
        }

        $status = $request->string('status')->toString();
        $search = trim($request->string('search')->toString());

        $applications = VacancyApplication::query()
            ->where('candidate_profile_id', $candidate->id)
            ->when($status !== '', fn ($query) => $query->where('status', $status))
            ->when($search !== '', function ($query) use ($search) {
                $query->whereHas('vacancy', function ($vacancyQuery) use ($search) {
                    $vacancyQuery
                        ->withoutGlobalScope(OrganizationScope::class)
                        ->where(function ($vacancySearchQuery) use ($search) {
                            $vacancySearchQuery
                                ->where('title', 'like', "%{$search}%")
                                ->orWhere('location', 'like', "%{$search}%")
                                ->orWhere('department', 'like', "%{$search}%")
                                ->orWhereHas('company', fn ($companyQuery) => $companyQuery
                                    ->withoutGlobalScope(OrganizationScope::class)
                                    ->where('company_name', 'like', "%{$search}%"));
                        });
                });
            })
            ->with([
                'interviews' => fn ($query) => $query->latest('scheduled_at'),
                'resume',
                'vacancy' => fn ($query) => $query
                    ->withoutGlobalScope(OrganizationScope::class)
                    ->with(['company' => fn ($companyQuery) => $companyQuery->withoutGlobalScope(OrganizationScope::class)]),
            ])
            ->latest('applied_at')
            ->paginate(12)
            ->through(fn ($application) => $this->presenter->application($application))
            ->withQueryString();

        return Inertia::render('Candidate/Applications', [
            'candidate' => $this->presenter->profile($candidate),
            'applications' => $applications,
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
            'statuses' => \App\Models\VacancyApplication::STATUSES,
        ]);
    }

    public function withdraw(Request $request, int $application): RedirectResponse
    {
        $candidate = $this->candidate($request);

        if ($candidate instanceof RedirectResponse) {
            return $candidate;
        }

        $applicationModel = VacancyApplication::query()
            ->where('candidate_profile_id', $candidate->id)
            ->with('interviews')
            ->findOrFail($application);

        if ($applicationModel->status === 'withdrawn') {
            return back()->with('success', 'Application already withdrawn.');
        }

        if (in_array($applicationModel->status, ['rejected', 'hired'], true)) {
            return back()->with('error', 'This application can no longer be withdrawn.');
        }

        DB::transaction(function () use ($applicationModel) {
            $metadata = is_array($applicationModel->metadata) ? $applicationModel->metadata : [];
            $metadata['withdrawn_at'] = now()->toDateTimeString();
            $metadata['withdrawn_from'] = 'candidate_hub';

            $applicationModel->update([
                'status' => 'withdrawn',
                'metadata' => $metadata,
            ]);

            $applicationModel->interviews()
                ->whereIn('status', ['scheduled', 'accepted'])
                ->update([
                    'status' => 'cancelled',
                    'candidate_response_note' => 'Application withdrawn by candidate.',
                    'responded_at' => now(),
                ]);
        });

        return back()->with('success', 'Application withdrawn successfully.');
    }
}
