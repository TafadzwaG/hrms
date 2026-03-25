<?php

namespace App\Http\Responses;

use App\Support\Auth\PortalAccessResolver;
use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\TwoFactorLoginResponse as TwoFactorLoginResponseContract;

class TwoFactorLoginResponse implements TwoFactorLoginResponseContract
{
    public function __construct(
        private readonly PortalAccessResolver $resolver,
    ) {
    }

    public function toResponse($request)
    {
        $user = $request->user();

        if ($request->wantsJson()) {
            return new JsonResponse('', 204);
        }

        $this->resolver->ensureDerivedPortalAccesses($user);

        $activePortal = $this->resolver->primaryPortal($user);
        $request->session()->put('active_portal', $activePortal);

        return redirect()->intended($this->resolver->dashboardPathForPortal($activePortal));
    }
}
