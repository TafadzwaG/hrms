<?php

namespace App\Support\Tenancy;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class TenantContext
{
    private ?int $organizationId = null;

    private ?Organization $organization = null;

    private int $disabled = 0;

    /**
     * Request-level cache for available organizations per user.
     */
    private array $availableOrganizationsCache = [];

    public function initializeForRequest(Request $request): void
    {
        $user = $request->user();

        if (! $user instanceof User) {
            $this->clear();

            return;
        }

        $availableOrganizations = $this->availableOrganizationsFor($user);
        $selectedOrganizationId = $request->session()->get('current_organization_id')
            ?: $user->current_organization_id;

        $selectedOrganization = null;

        if ($selectedOrganizationId) {
            $selectedOrganization = $availableOrganizations->firstWhere('id', (int) $selectedOrganizationId);
        }

        if (! $selectedOrganization) {
            $selectedOrganization = $availableOrganizations->first();
        }

        if (! $selectedOrganization) {
            $this->clear();

            return;
        }

        $this->organizationId = $selectedOrganization->id;
        $this->organization = $selectedOrganization;

        if ($user->current_organization_id !== $selectedOrganization->id) {
            $user->forceFill([
                'current_organization_id' => $selectedOrganization->id,
            ])->saveQuietly();
        }

        $request->session()->put('current_organization_id', $selectedOrganization->id);
    }

    public function id(): ?int
    {
        return $this->organizationId ?? $this->organization?->id;
    }

    public function organization(): ?Organization
    {
        if (! $this->organization && $this->organizationId) {
            $this->organization = Organization::query()->find($this->organizationId);
        }

        return $this->organization;
    }

    public function availableOrganizationsFor(User $user): Collection
    {
        $cacheKey = $user->id;

        if (isset($this->availableOrganizationsCache[$cacheKey])) {
            return $this->availableOrganizationsCache[$cacheKey];
        }

        if ($user->isSuperAdmin()) {
            $result = Organization::query()
                ->orderBy('name')
                ->get(['id', 'name', 'slug', 'code', 'status', 'timezone']);
        } else {
            $result = $user->organizations()
                ->wherePivot('is_active', true)
                ->orderBy('organizations.name')
                ->get(['organizations.id', 'organizations.name', 'organizations.slug', 'organizations.code', 'organizations.status', 'organizations.timezone']);
        }

        $this->availableOrganizationsCache[$cacheKey] = $result;

        return $result;
    }

    public function switchTo(Organization $organization, User $user, Request $request): void
    {
        abort_unless($user->canAccessOrganization($organization), 403);

        $this->organizationId = $organization->id;
        $this->organization = $organization;

        $user->forceFill([
            'current_organization_id' => $organization->id,
        ])->saveQuietly();

        $request->session()->put('current_organization_id', $organization->id);
    }

    public function shouldRestrictToNoResults(): bool
    {
        if ($this->isDisabled()) {
            return false;
        }

        if (app()->runningInConsole() && ! app()->runningUnitTests()) {
            return false;
        }

        $request = app()->bound('request') ? app(Request::class) : null;
        $user = $request?->user();

        return $user instanceof User && ! $user->isSuperAdmin() && ! $this->id();
    }

    public function withoutTenancy(callable $callback): mixed
    {
        $this->disabled++;

        try {
            return $callback();
        } finally {
            $this->disabled = max(0, $this->disabled - 1);
        }
    }

    public function isDisabled(): bool
    {
        return $this->disabled > 0;
    }

    public function clear(): void
    {
        $this->organizationId = null;
        $this->organization = null;
        $this->availableOrganizationsCache = [];
    }
}
