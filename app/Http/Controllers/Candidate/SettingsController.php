<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Requests\Candidate\UpdateCandidateSettingsRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends BaseCandidateHubController
{
    public function edit(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $candidate = $this->candidate($request);

        if ($candidate instanceof \Illuminate\Http\RedirectResponse) {
            return $candidate;
        }

        return Inertia::render('Candidate/Settings', [
            'candidate' => $this->presenter->profile($candidate),
            'settings' => $this->presenter->settings($candidate),
            'workModes' => \App\Models\Vacancy::WORK_MODES,
        ]);
    }

    public function update(UpdateCandidateSettingsRequest $request): RedirectResponse
    {
        $candidate = $this->candidate($request);

        if ($candidate instanceof \Illuminate\Http\RedirectResponse) {
            return $candidate;
        }

        $metadata = $candidate->metadata ?? [];
        $metadata['preferences'] = [
            'job_alerts' => $request->boolean('job_alerts'),
            'newsletter' => $request->boolean('newsletter'),
            'remote_only' => $request->boolean('remote_only'),
            'preferred_work_modes' => array_values($request->validated('preferred_work_modes', [])),
        ];

        $candidate->update([
            'metadata' => $metadata,
        ]);

        return back()->with('success', 'Settings updated.');
    }
}
