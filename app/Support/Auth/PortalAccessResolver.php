<?php

namespace App\Support\Auth;

use App\Models\CandidateProfile;
use App\Models\CompanyProfile;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Schema;

class PortalAccessResolver
{
    public const PORTAL_EMPLOYEE = 'employee';

    public const PORTAL_CANDIDATE = 'candidate';

    public const PORTAL_EMPLOYER = 'employer';

    public const PORTALS = [
        self::PORTAL_EMPLOYEE,
        self::PORTAL_CANDIDATE,
        self::PORTAL_EMPLOYER,
    ];

    public function availablePortals(User $user): Collection
    {
        $portals = $this->storedPortalAccesses($user);

        if ($portals->isEmpty()) {
            $primary = $this->normalizePortal($user->getAttribute('primary_portal'));

            if ($primary) {
                $portals->push($primary);
            }
        }

        if ($portals->isEmpty()) {
            $portals->push(self::PORTAL_EMPLOYEE);
        }

        return $portals
            ->map(fn (mixed $portal) => $this->normalizePortal($portal))
            ->filter()
            ->unique()
            ->values();
    }

    public function primaryPortal(User $user): string
    {
        $available = $this->availablePortals($user);
        $primary = $this->normalizePortal($user->getAttribute('primary_portal'));

        if ($primary && $available->contains($primary)) {
            return $primary;
        }

        foreach ([self::PORTAL_EMPLOYEE, self::PORTAL_EMPLOYER, self::PORTAL_CANDIDATE] as $portal) {
            if ($available->contains($portal)) {
                return $portal;
            }
        }

        return self::PORTAL_EMPLOYEE;
    }

    public function hasPortalAccess(User $user, string $portal): bool
    {
        $normalizedPortal = $this->normalizePortal($portal);

        if (! $normalizedPortal) {
            return false;
        }

        return $this->availablePortals($user)->contains($normalizedPortal);
    }

    public function grantPortalAccess(User $user, string $portal, bool $makePrimary = false): void
    {
        $normalizedPortal = $this->normalizePortal($portal);

        if (! $normalizedPortal || ! Schema::hasTable('user_portal_accesses')) {
            return;
        }

        $user->portalAccesses()->firstOrCreate([
            'portal' => $normalizedPortal,
        ]);

        if ($makePrimary || blank($user->getAttribute('primary_portal'))) {
            $user->forceFill([
                'primary_portal' => $normalizedPortal,
            ])->saveQuietly();
        }
    }

    public function ensureDerivedPortalAccesses(User $user): void
    {
        if ($this->ownsEmployeePortal($user)) {
            $this->grantPortalAccess($user, self::PORTAL_EMPLOYEE);
        }

        if ($this->ownsCandidatePortal($user)) {
            $this->grantPortalAccess($user, self::PORTAL_CANDIDATE);
        }

        if ($this->ownsEmployerPortal($user)) {
            $this->grantPortalAccess($user, self::PORTAL_EMPLOYER);
        }
    }

    public function defaultPortalRedirectPath(User $user): string
    {
        return $this->dashboardPathForPortal($this->primaryPortal($user));
    }

    public function dashboardPathForPortal(string $portal): string
    {
        return match ($this->normalizePortal($portal)) {
            self::PORTAL_CANDIDATE => '/candidate/dashboard',
            self::PORTAL_EMPLOYER => '/employer/dashboard',
            default => '/dashboard',
        };
    }

    public function activePortalForRequest(Request $request, ?User $user = null): string
    {
        $routeName = $request->route()?->getName();

        if (is_string($routeName)) {
            if (str_starts_with($routeName, 'candidate.')) {
                return self::PORTAL_CANDIDATE;
            }

            if (str_starts_with($routeName, 'employer.')) {
                return self::PORTAL_EMPLOYER;
            }

            if ($user && $this->hasPortalAccess($user, self::PORTAL_EMPLOYEE)) {
                return self::PORTAL_EMPLOYEE;
            }
        }

        $sessionPortal = $this->normalizePortal($request->session()->get('active_portal'));

        if ($user && $sessionPortal && $this->hasPortalAccess($user, $sessionPortal)) {
            return $sessionPortal;
        }

        return $user ? $this->primaryPortal($user) : self::PORTAL_EMPLOYEE;
    }

    public function normalizePortal(mixed $portal): ?string
    {
        $value = is_string($portal) ? strtolower(trim($portal)) : null;

        return in_array($value, self::PORTALS, true) ? $value : null;
    }

    private function storedPortalAccesses(User $user): Collection
    {
        if (! Schema::hasTable('user_portal_accesses')) {
            return collect();
        }

        if ($user->relationLoaded('portalAccesses')) {
            $loaded = $user->getRelation('portalAccesses');

            if ($loaded instanceof EloquentCollection) {
                return $loaded->pluck('portal');
            }
        }

        return $user->portalAccesses()->pluck('portal');
    }

    private function ownsEmployeePortal(User $user): bool
    {
        if (! Schema::hasTable('employees') && ! Schema::hasTable('organization_user')) {
            return false;
        }

        $hasEmployeeRecord = Schema::hasTable('employees')
            && Employee::query()->withoutGlobalScopes()->where('user_id', $user->id)->exists();

        $hasOrganizationMembership = Schema::hasTable('organization_user')
            && $user->organizations()->exists();

        return $hasEmployeeRecord || $hasOrganizationMembership;
    }

    private function ownsCandidatePortal(User $user): bool
    {
        return Schema::hasTable('candidate_profiles')
            && CandidateProfile::query()->withoutGlobalScopes()->where('user_id', $user->id)->exists();
    }

    private function ownsEmployerPortal(User $user): bool
    {
        return Schema::hasTable('company_profiles')
            && CompanyProfile::query()->withoutGlobalScopes()->where('owner_user_id', $user->id)->exists();
    }
}
