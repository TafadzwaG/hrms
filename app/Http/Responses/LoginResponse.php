<?php

namespace App\Http\Responses;

use App\Models\CandidateProfile;
use App\Models\CompanyProfile;
use App\Models\Scopes\OrganizationScope;
use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        $user = $request->user();

        if ($request->wantsJson()) {
            return new JsonResponse('', 204);
        }

        // Redirect candidates to their dashboard
        if (CandidateProfile::withoutGlobalScope(OrganizationScope::class)
            ->where('user_id', $user->id)->exists()) {
            return redirect()->intended('/candidate/dashboard');
        }

        // Redirect employers to their dashboard
        if (CompanyProfile::withoutGlobalScope(OrganizationScope::class)
            ->where('owner_user_id', $user->id)->exists()) {
            return redirect()->intended('/employer/dashboard');
        }

        // Default: employee portal dashboard
        return redirect()->intended(config('fortify.home'));
    }
}
