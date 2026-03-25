<?php

namespace App\Support\Auth;

use App\Models\User;
use App\Support\Audit\AuditLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Lab404\Impersonate\Services\ImpersonateManager;

class UserImpersonationService
{
    public const SESSION_STARTED_AT = 'impersonation.started_at';
    public const SESSION_ORIGINAL_PORTAL = 'impersonation.original_portal';

    public function __construct(
        private readonly ImpersonateManager $manager,
        private readonly PortalAccessResolver $portalResolver,
        private readonly AuditLogger $auditLogger,
    ) {
    }

    public function canImpersonate(User $actor, User $target): bool
    {
        if (! $actor->canImpersonate() || $actor->is($target) || $this->manager->isImpersonating()) {
            return false;
        }

        if ($target->isSuperAdmin()) {
            return $actor->isSuperAdmin();
        }

        if ($target->isAdministrator() && ! $actor->isSuperAdmin()) {
            return false;
        }

        return $target->canBeImpersonated();
    }

    public function begin(Request $request, User $actor, User $target): bool
    {
        if (! $this->canImpersonate($actor, $target)) {
            return false;
        }

        $this->portalResolver->ensureDerivedPortalAccesses($actor);
        $this->portalResolver->ensureDerivedPortalAccesses($target);

        $originalPortal = $request->session()->get('active_portal')
            ?: $this->portalResolver->primaryPortal($actor);

        $started = $this->manager->take($actor, $target, config('auth.defaults.guard', 'web'));

        if (! $started) {
            return false;
        }

        $request->session()->put(self::SESSION_ORIGINAL_PORTAL, $originalPortal);
        $request->session()->put(self::SESSION_STARTED_AT, now()->toDateTimeString());
        $request->session()->put('active_portal', $this->portalResolver->primaryPortal($target));

        $this->auditLogger->logCustom('impersonation_started', $target, [
            'actor' => $actor,
            'module' => 'auth',
            'category' => 'access',
            'description' => sprintf('Started impersonating %s.', $target->name),
            'metadata' => [
                'impersonator_id' => $actor->id,
                'impersonator_email' => $actor->email,
                'impersonator_primary_portal' => $this->portalResolver->primaryPortal($actor),
                'impersonated_id' => $target->id,
                'impersonated_email' => $target->email,
                'impersonated_primary_portal' => $this->portalResolver->primaryPortal($target),
            ],
            'tags' => ['security', 'impersonation'],
        ]);

        return true;
    }

    public function end(Request $request): ?array
    {
        if (! $this->manager->isImpersonating()) {
            return null;
        }

        $impersonator = $this->manager->getImpersonator();
        $impersonated = $request->user();

        if (! $impersonator instanceof User || ! $impersonated instanceof User) {
            return null;
        }

        $originalPortal = $request->session()->get(self::SESSION_ORIGINAL_PORTAL)
            ?: $this->portalResolver->primaryPortal($impersonator);

        $stopped = $this->manager->leave();

        if (! $stopped) {
            return null;
        }

        $request->session()->forget([
            self::SESSION_STARTED_AT,
            self::SESSION_ORIGINAL_PORTAL,
        ]);
        $request->session()->put('active_portal', $originalPortal);

        $this->auditLogger->logCustom('impersonation_ended', $impersonated, [
            'actor' => $impersonator,
            'module' => 'auth',
            'category' => 'access',
            'description' => sprintf('Stopped impersonating %s.', $impersonated->name),
            'metadata' => [
                'impersonator_id' => $impersonator->id,
                'impersonator_email' => $impersonator->email,
                'restored_portal' => $originalPortal,
                'impersonated_id' => $impersonated->id,
                'impersonated_email' => $impersonated->email,
            ],
            'tags' => ['security', 'impersonation'],
        ]);

        return [
            'impersonator' => $impersonator,
            'impersonated' => $impersonated,
            'redirect' => $this->portalResolver->dashboardPathForPortal($originalPortal),
        ];
    }

    public function payload(Request $request): ?array
    {
        if (! $this->manager->isImpersonating()) {
            return null;
        }

        $impersonator = $this->manager->getImpersonator();
        $impersonated = $request->user();

        if (! $impersonator instanceof User || ! $impersonated instanceof User) {
            return null;
        }

        return [
            'active' => true,
            'started_at' => $request->session()->get(self::SESSION_STARTED_AT),
            'original_portal' => $request->session()->get(self::SESSION_ORIGINAL_PORTAL),
            'stop_url' => route('impersonation.destroy'),
            'impersonator' => [
                'id' => $impersonator->id,
                'name' => $impersonator->name,
                'email' => $impersonator->email,
                'initials' => $this->initials($impersonator->name),
                'primary_portal' => $this->portalResolver->primaryPortal($impersonator),
            ],
            'impersonated' => [
                'id' => $impersonated->id,
                'name' => $impersonated->name,
                'email' => $impersonated->email,
                'initials' => $this->initials($impersonated->name),
                'primary_portal' => $this->portalResolver->primaryPortal($impersonated),
            ],
        ];
    }

    private function initials(string $name): string
    {
        return Str::upper(Str::of($name)
            ->explode(' ')
            ->filter()
            ->map(fn (string $segment) => Str::substr($segment, 0, 1))
            ->take(2)
            ->implode(''));
    }
}
