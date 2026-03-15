<?php

namespace App\Http\Middleware;

use App\Support\Tenancy\TenantContext;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ResolveCurrentOrganization
{
    public function handle(Request $request, Closure $next): Response
    {
        app(TenantContext::class)->initializeForRequest($request);

        return $next($request);
    }
}
