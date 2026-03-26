<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasPermission
{
    public function handle(Request $request, Closure $next, string ...$permissions): Response
    {
        $user = $request->user();

        if (!$user) {
            throw new AuthorizationException('Authentication is required.');
        }

        $required = collect($permissions)
            ->flatMap(fn (string $permission) => preg_split('/\s*,\s*/', $permission, -1, PREG_SPLIT_NO_EMPTY) ?: [])
            ->values();

        if ($required->isEmpty() || $required->contains(fn (string $permission) => $user->canAccess($permission))) {
            return $next($request);
        }

        throw new AuthorizationException('You do not have permission to perform this action.');
    }
}
