<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\CandidateProfile;
use App\Services\Marketplace\ExchangeEngine;
use App\Support\Hubs\CandidateHubContext;
use App\Support\Hubs\CandidateHubPresenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

abstract class BaseCandidateHubController extends Controller
{
    public function __construct(
        protected CandidateHubContext $context,
        protected CandidateHubPresenter $presenter,
        protected ExchangeEngine $exchange,
    ) {
    }

    protected function candidate(Request $request): CandidateProfile|RedirectResponse
    {
        $candidate = $this->context->findProfile($request->user());

        if ($candidate) {
            return $candidate;
        }

        return redirect()
            ->route('candidate.register')
            ->with('error', 'Create your candidate profile to access the candidate hub.');
    }
}
