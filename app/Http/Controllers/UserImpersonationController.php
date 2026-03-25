<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Support\Auth\UserImpersonationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UserImpersonationController extends Controller
{
    public function __construct(
        private readonly UserImpersonationService $impersonation,
    ) {
    }

    public function store(Request $request, User $user): RedirectResponse
    {
        $actor = $request->user();

        abort_unless($actor instanceof User, 403);

        $this->ensureUserBelongsToCurrentOrganization($user);

        if (! $this->impersonation->canImpersonate($actor, $user)) {
            abort(403);
        }

        if (! $this->impersonation->begin($request, $actor, $user)) {
            return back()->with('error', 'Unable to start impersonation for that user.');
        }

        return redirect($user->defaultPortalRedirect())
            ->with('success', sprintf('You are now impersonating %s.', $user->name));
    }

    public function destroy(Request $request): RedirectResponse
    {
        $result = $this->impersonation->end($request);

        if (! $result) {
            return redirect()->route('dashboard')
                ->with('error', 'No active impersonation session was found.');
        }

        /** @var User $impersonated */
        $impersonated = $result['impersonated'];

        return redirect($result['redirect'])
            ->with('success', sprintf('Stopped impersonating %s.', $impersonated->name));
    }
}
