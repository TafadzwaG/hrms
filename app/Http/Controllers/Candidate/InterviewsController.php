<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Requests\Candidate\RespondToInterviewRequest;
use App\Models\ApplicationInterview;
use Illuminate\Http\RedirectResponse;

class InterviewsController extends BaseCandidateHubController
{
    public function respond(RespondToInterviewRequest $request, int $interview): RedirectResponse
    {
        $candidate = $this->candidate($request);

        if ($candidate instanceof RedirectResponse) {
            return $candidate;
        }

        $interviewModel = ApplicationInterview::query()
            ->where('candidate_profile_id', $candidate->id)
            ->whereHas('application', fn ($query) => $query->where('candidate_profile_id', $candidate->id))
            ->findOrFail($interview);

        if ($interviewModel->status !== 'scheduled') {
            return back()->with('error', 'This interview no longer requires a response.');
        }

        $response = $request->validated('response');

        $interviewModel->update([
            'status' => $response,
            'candidate_response_note' => $request->validated('candidate_response_note'),
            'responded_at' => now(),
        ]);

        return back()->with(
            'success',
            $response === 'accepted' ? 'Interview invitation accepted.' : 'Interview invitation declined.'
        );
    }
}
