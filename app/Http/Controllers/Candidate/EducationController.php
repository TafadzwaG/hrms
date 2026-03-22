<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Requests\Candidate\UpsertCandidateEducationRequest;
use App\Models\CandidateEducation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EducationController extends BaseCandidateHubController
{
    public function index(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $candidate = $this->candidate($request);

        if ($candidate instanceof \Illuminate\Http\RedirectResponse) {
            return $candidate;
        }

        return Inertia::render('Candidate/Education', [
            'candidate' => $this->presenter->profile($candidate),
            'educations' => $candidate->educations()
                ->latest('end_date')
                ->latest()
                ->get()
                ->map(fn ($education) => $this->presenter->education($education))
                ->all(),
        ]);
    }

    public function store(UpsertCandidateEducationRequest $request): RedirectResponse
    {
        $candidate = $this->candidate($request);

        if ($candidate instanceof \Illuminate\Http\RedirectResponse) {
            return $candidate;
        }

        $candidate->educations()->create($request->validated());

        return back()->with('success', 'Education record added.');
    }

    public function update(UpsertCandidateEducationRequest $request, CandidateEducation $education): RedirectResponse
    {
        $candidate = $this->candidate($request);

        if ($candidate instanceof \Illuminate\Http\RedirectResponse) {
            return $candidate;
        }

        abort_unless($education->candidate_profile_id === $candidate->id, 404);

        $education->update($request->validated());

        return back()->with('success', 'Education record updated.');
    }

    public function destroy(Request $request, CandidateEducation $education): RedirectResponse
    {
        $candidate = $this->candidate($request);

        if ($candidate instanceof \Illuminate\Http\RedirectResponse) {
            return $candidate;
        }

        abort_unless($education->candidate_profile_id === $candidate->id, 404);

        $education->delete();

        return back()->with('success', 'Education record deleted.');
    }
}
