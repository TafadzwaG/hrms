<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\User;
use App\Support\Audit\AuditLogger;
use App\Support\Tenancy\TenantContext;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CurrentOrganizationController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'organization_id' => ['required', 'integer', 'exists:organizations,id'],
            'redirect_to' => [
                'nullable',
                'string',
                'max:2048',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if (blank($value)) {
                        return;
                    }

                    $path = (string) $value;

                    if (! str_starts_with($path, '/') || str_starts_with($path, '//')) {
                        $fail('The redirect target must be an internal application path.');
                    }
                },
            ],
        ]);

        $user = $request->user();
        abort_unless($user instanceof User, 403);

        $organization = Organization::query()->findOrFail($validated['organization_id']);
        app(TenantContext::class)->switchTo($organization, $user, $request);

        app(AuditLogger::class)->logCustom('switch_organization', $organization, [
            'module' => 'organizations',
            'description' => 'Switched active organization context.',
            'organization_id' => $organization->id,
            'metadata' => [
                'organization_id' => $organization->id,
                'organization_name' => $organization->name,
            ],
        ]);

        return redirect()
            ->to(($validated['redirect_to'] ?? null) ?: route('dashboard', [], false))
            ->with('success', 'Active organization switched successfully.');
    }
}
