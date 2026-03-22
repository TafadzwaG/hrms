<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Requests\Candidate\UpsertCandidateSkillRequest;
use App\Models\CandidateSkill;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SkillsController extends BaseCandidateHubController
{
    public function index(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $candidate = $this->candidate($request);

        if ($candidate instanceof \Illuminate\Http\RedirectResponse) {
            return $candidate;
        }

        return Inertia::render('Candidate/Skills', [
            'candidate' => $this->presenter->profile($candidate),
            'skills' => $candidate->skills()
                ->orderByDesc('years_experience')
                ->orderBy('name')
                ->get()
                ->map(fn ($skill) => $this->presenter->skill($skill))
                ->all(),
            'levels' => CandidateSkill::LEVELS,
        ]);
    }

    public function store(UpsertCandidateSkillRequest $request): RedirectResponse
    {
        $candidate = $this->candidate($request);

        if ($candidate instanceof \Illuminate\Http\RedirectResponse) {
            return $candidate;
        }

        $candidate->skills()->create($request->validated());

        return back()->with('success', 'Skill added.');
    }

    public function update(UpsertCandidateSkillRequest $request, CandidateSkill $skill): RedirectResponse
    {
        $candidate = $this->candidate($request);

        if ($candidate instanceof \Illuminate\Http\RedirectResponse) {
            return $candidate;
        }

        abort_unless($skill->candidate_profile_id === $candidate->id, 404);

        $skill->update($request->validated());

        return back()->with('success', 'Skill updated.');
    }

    public function destroy(Request $request, CandidateSkill $skill): RedirectResponse
    {
        $candidate = $this->candidate($request);

        if ($candidate instanceof \Illuminate\Http\RedirectResponse) {
            return $candidate;
        }

        abort_unless($skill->candidate_profile_id === $candidate->id, 404);

        $skill->delete();

        return back()->with('success', 'Skill deleted.');
    }
}
