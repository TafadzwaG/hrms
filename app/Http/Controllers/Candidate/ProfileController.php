<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Requests\Candidate\UpdateCandidateProfileImageRequest;
use App\Http\Requests\Candidate\UpdateCandidateProfileRequest;
use App\Http\Requests\Candidate\UpdateCandidateSummaryRequest;
use App\Http\Requests\Candidate\UpsertCandidateExperienceRequest;
use App\Models\CandidateExperience;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends BaseCandidateHubController
{
    public function edit(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $candidate = $this->candidate($request);

        if ($candidate instanceof \Illuminate\Http\RedirectResponse) {
            return $candidate;
        }

        return Inertia::render('Candidate/Profile', [
            'candidate' => $this->presenter->profile($candidate),
            'experiences' => $candidate->experiences()
                ->latest('start_date')
                ->get()
                ->map(fn ($experience) => $this->presenter->experience($experience))
                ->all(),
            'education_levels' => \App\Models\CandidateProfile::EDUCATION_LEVELS,
            'visibility_statuses' => \App\Models\CandidateProfile::VISIBILITY_STATUSES,
        ]);
    }

    public function update(UpdateCandidateProfileRequest $request): RedirectResponse
    {
        $candidate = $this->candidate($request);

        if ($candidate instanceof \Illuminate\Http\RedirectResponse) {
            return $candidate;
        }

        $candidate->update([
            ...$request->validated(),
            'is_public' => $request->boolean('is_public'),
        ]);

        return back()->with('success', 'Profile details updated.');
    }

    public function updateSummary(UpdateCandidateSummaryRequest $request): RedirectResponse
    {
        $candidate = $this->candidate($request);

        if ($candidate instanceof \Illuminate\Http\RedirectResponse) {
            return $candidate;
        }

        $candidate->update($request->validated());

        return back()->with('success', 'Professional summary updated.');
    }

    public function updateImage(UpdateCandidateProfileImageRequest $request): RedirectResponse
    {
        $candidate = $this->candidate($request);

        if ($candidate instanceof \Illuminate\Http\RedirectResponse) {
            return $candidate;
        }

        $file = $request->file('profile_image');
        $storedName = Str::uuid()->toString().'_'.$file->getClientOriginalName();
        $path = $file->storeAs('candidate-profile-images/'.$candidate->id, $storedName, 'public');

        $metadata = $candidate->metadata ?? [];
        $previousPath = data_get($metadata, 'profile_image_path');

        data_set($metadata, 'profile_image_path', $path);

        $candidate->update([
            'metadata' => $metadata,
        ]);

        if ($previousPath && $previousPath !== $path && Storage::disk('public')->exists($previousPath)) {
            Storage::disk('public')->delete($previousPath);
        }

        return back()->with('success', 'Profile image updated.');
    }

    public function destroyImage(Request $request): RedirectResponse
    {
        $candidate = $this->candidate($request);

        if ($candidate instanceof \Illuminate\Http\RedirectResponse) {
            return $candidate;
        }

        $metadata = $candidate->metadata ?? [];
        $previousPath = data_get($metadata, 'profile_image_path');

        if ($previousPath && Storage::disk('public')->exists($previousPath)) {
            Storage::disk('public')->delete($previousPath);
        }

        data_forget($metadata, 'profile_image_path');

        $candidate->update([
            'metadata' => $metadata,
        ]);

        return back()->with('success', 'Profile image removed.');
    }

    public function storeExperience(UpsertCandidateExperienceRequest $request): RedirectResponse
    {
        $candidate = $this->candidate($request);

        if ($candidate instanceof \Illuminate\Http\RedirectResponse) {
            return $candidate;
        }

        $candidate->experiences()->create([
            ...$request->validated(),
            'currently_working' => $request->boolean('currently_working'),
            'end_date' => $request->boolean('currently_working') ? null : $request->validated('end_date'),
        ]);

        return back()->with('success', 'Work experience added.');
    }

    public function updateExperience(UpsertCandidateExperienceRequest $request, CandidateExperience $experience): RedirectResponse
    {
        $candidate = $this->candidate($request);

        if ($candidate instanceof \Illuminate\Http\RedirectResponse) {
            return $candidate;
        }

        abort_unless($experience->candidate_profile_id === $candidate->id, 404);

        $experience->update([
            ...$request->validated(),
            'currently_working' => $request->boolean('currently_working'),
            'end_date' => $request->boolean('currently_working') ? null : $request->validated('end_date'),
        ]);

        return back()->with('success', 'Work experience updated.');
    }

    public function destroyExperience(Request $request, CandidateExperience $experience): RedirectResponse
    {
        $candidate = $this->candidate($request);

        if ($candidate instanceof \Illuminate\Http\RedirectResponse) {
            return $candidate;
        }

        abort_unless($experience->candidate_profile_id === $candidate->id, 404);

        $experience->delete();

        return back()->with('success', 'Work experience deleted.');
    }
}
