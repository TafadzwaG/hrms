<?php

namespace App\Models;

use App\Support\Auth\PortalAccessResolver;
use App\Support\Rbac\PermissionRegistry;
use App\Support\Tenancy\TenantContext;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\DB;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Lab404\Impersonate\Models\Impersonate;

class User extends Authenticatable
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable, Impersonate;

    /**
     * Request-level cache for computed role/permission data.
     * Cleared automatically when roles or permissions are synced.
     */
    protected array $rbacCache = [];

    protected $fillable = [
        'name',
        'email',
        'password',
        'primary_portal',
        'current_organization_id',
    ];

    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::created(function (self $user): void {
            app(PortalAccessResolver::class)->grantPortalAccess(
                $user,
                $user->getAttribute('primary_portal') ?: PortalAccessResolver::PORTAL_EMPLOYEE,
                blank($user->getAttribute('primary_portal')),
            );
        });

        static::saved(function (self $user): void {
            $primaryPortal = $user->getAttribute('primary_portal');

            if ($primaryPortal) {
                app(PortalAccessResolver::class)->grantPortalAccess($user, $primaryPortal);
            }
        });
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_users')->withTimestamps();
    }

    public function organizations(): BelongsToMany
    {
        return $this->belongsToMany(Organization::class, 'organization_user')
            ->withPivot(['is_active', 'joined_at'])
            ->withTimestamps();
    }

    public function currentOrganization(): BelongsTo
    {
        return $this->belongsTo(Organization::class, 'current_organization_id');
    }

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'user_permissions')->withTimestamps();
    }

    public function employee(): HasOne
    {
        return $this->hasOne(Employee::class);
    }

    public function candidateProfile(): HasOne
    {
        return $this->hasOne(CandidateProfile::class);
    }

    public function companyProfile(): HasOne
    {
        return $this->hasOne(CompanyProfile::class, 'owner_user_id');
    }

    public function portalAccesses(): HasMany
    {
        return $this->hasMany(UserPortalAccess::class);
    }

    public function primaryPortal(): string
    {
        return app(PortalAccessResolver::class)->primaryPortal($this);
    }

    public function hasPortalAccess(string $portal): bool
    {
        return app(PortalAccessResolver::class)->hasPortalAccess($this, $portal);
    }

    public function defaultPortalRedirect(): string
    {
        return app(PortalAccessResolver::class)->defaultPortalRedirectPath($this);
    }

    public function isSuperAdmin(): bool
    {
        $roles = $this->relationLoaded('roles')
            ? $this->roles
            : $this->roles()->get(['roles.id', 'roles.code', 'roles.name']);

        return $roles->contains(fn (Role $role) => $role->code === 'SYS_ADMIN');
    }

    public function isAdministrator(): bool
    {
        if ($this->isSuperAdmin()) {
            return true;
        }

        return $this->effectiveRoles()->contains(function (Role $role): bool {
            return $role->code === 'ADMIN'
                || Str::endsWith($role->code, '_ADMIN')
                || Str::contains(Str::upper($role->name), 'ADMIN');
        });
    }

    public function canImpersonate(): bool
    {
        return $this->isAdministrator() && ! $this->isImpersonated();
    }

    public function canBeImpersonated(): bool
    {
        return true;
    }

    public function availableOrganizations(): Collection
    {
        return app(TenantContext::class)->availableOrganizationsFor($this);
    }

    public function belongsToOrganization(int|Organization|null $organization = null): bool
    {
        if ($this->isSuperAdmin()) {
            return true;
        }

        $organizationId = $organization instanceof Organization ? $organization->id : $organization;
        $organizationId ??= app(TenantContext::class)->id();

        if (! $organizationId) {
            return false;
        }

        return $this->organizations()
            ->where('organizations.id', $organizationId)
            ->wherePivot('is_active', true)
            ->exists();
    }

    public function canAccessOrganization(int|Organization|null $organization = null): bool
    {
        return $this->belongsToOrganization($organization);
    }

    public function organizationRoles(int|Organization|null $organization = null): Collection
    {
        $organizationId = $organization instanceof Organization ? $organization->id : $organization;
        $organizationId ??= app(TenantContext::class)->id();

        if (! $organizationId) {
            return collect();
        }

        return Role::query()
            ->select(['roles.id', 'roles.code', 'roles.name', 'roles.description'])
            ->join('organization_user_roles', function ($join) use ($organizationId): void {
                $join->on('organization_user_roles.role_id', '=', 'roles.id')
                    ->where('organization_user_roles.user_id', '=', $this->id)
                    ->where('organization_user_roles.organization_id', '=', $organizationId);
            })
            ->join('organization_user', function ($join) use ($organizationId): void {
                $join->on('organization_user.user_id', '=', 'organization_user_roles.user_id')
                    ->where('organization_user.organization_id', '=', $organizationId)
                    ->where('organization_user.is_active', '=', true);
            })
            ->orderBy('roles.name')
            ->get();
    }

    public function effectiveRoles(int|Organization|null $organization = null): Collection
    {
        $organizationId = $organization instanceof Organization ? $organization->id : $organization;
        $cacheKey = 'effective_roles:' . ($organizationId ?? 'global');

        if (isset($this->rbacCache[$cacheKey])) {
            return $this->rbacCache[$cacheKey];
        }

        $globalRoles = $this->relationLoaded('roles')
            ? $this->roles
            : $this->roles()->get(['roles.id', 'roles.code', 'roles.name', 'roles.description']);

        $result = $globalRoles
            ->concat($this->organizationRoles($organizationId))
            ->unique('id')
            ->values();

        $this->rbacCache[$cacheKey] = $result;

        return $result;
    }

    public function hasRole(string|array $roles): bool
    {
        $roleValues = collect(Arr::wrap($roles))->filter()->map(fn ($role) => (string) $role);

        if ($roleValues->isEmpty()) {
            return false;
        }

        $owned = $this->effectiveRoles();

        return $roleValues->contains(function (string $role) use ($owned) {
            return $owned->contains(fn (Role $ownedRole) => $ownedRole->code === $role || $ownedRole->name === $role || (string) $ownedRole->id === $role);
        });
    }

    public function hasAnyRole(array $roles): bool
    {
        return $this->hasRole($roles);
    }

    public function allPermissions(int|Organization|null $organization = null): Collection
    {
        $organizationId = $organization instanceof Organization ? $organization->id : $organization;
        $cacheKey = 'all_permissions:' . ($organizationId ?? 'global');

        if (isset($this->rbacCache[$cacheKey])) {
            return $this->rbacCache[$cacheKey];
        }

        $directPermissions = $this->relationLoaded('permissions')
            ? $this->permissions
            : $this->permissions()->get(['permissions.id', 'permissions.name', 'permissions.module', 'permissions.label']);

        $roles = $this->effectiveRoles($organization);

        $rolePermissions = $roles->flatMap(fn (Role $role) => $role->relationLoaded('permissions')
            ? $role->permissions
            : $role->permissions()->get(['permissions.id', 'permissions.name', 'permissions.module', 'permissions.label'])
        );

        $result = $directPermissions
            ->concat($rolePermissions)
            ->unique('name')
            ->values();

        $this->rbacCache[$cacheKey] = $result;

        return $result;
    }

    public function permissionNames(int|Organization|null $organization = null): Collection
    {
        $organizationId = $organization instanceof Organization ? $organization->id : $organization;
        $cacheKey = 'permission_names:' . ($organizationId ?? 'global');

        if (isset($this->rbacCache[$cacheKey])) {
            return $this->rbacCache[$cacheKey];
        }

        $result = $this->allPermissions($organization)
            ->pluck('name')
            ->concat($this->employeeSelfServicePermissionNames())
            ->filter()
            ->unique()
            ->values();

        $this->rbacCache[$cacheKey] = $result;

        return $result;
    }

    public function hasPermission(string|array $permissions): bool
    {
        $needed = collect(Arr::wrap($permissions))->filter()->map(fn ($permission) => (string) $permission)->values();

        if ($needed->isEmpty()) {
            return false;
        }

        $owned = $this->permissionNames();

        return $needed->contains(function (string $ability) use ($owned) {
            return $owned->contains(function (string $permission) use ($ability) {
                return Str::is($permission, $ability) || Str::is($ability, $permission);
            });
        });
    }

    public function canAccess(string|array $permissions): bool
    {
        return $this->hasPermission($permissions);
    }

    private function employeeSelfServicePermissionNames(): Collection
    {
        if (! $this->shouldReceiveEmployeeSelfServicePermissions()) {
            return collect();
        }

        return collect(PermissionRegistry::defaultsForRole('EMPLOYEE'));
    }

    private function shouldReceiveEmployeeSelfServicePermissions(): bool
    {
        return ($this->relationLoaded('employee') && $this->employee !== null) || $this->employee()->exists();
    }

    /**
     * Clear the request-level RBAC cache.
     */
    public function clearRbacCache(): static
    {
        $this->rbacCache = [];

        return $this;
    }

    public function syncRoles(array $roleIds, int|Organization|null $organization = null): static
    {
        $this->clearRbacCache();

        $roleIds = array_values(array_unique(array_map('intval', $roleIds)));

        if ($organization === null) {
            $this->roles()->sync($roleIds);

            return $this;
        }

        $organizationId = $organization instanceof Organization ? $organization->id : $organization;

        if (! $organizationId) {
            return $this;
        }

        $this->attachToOrganization($organizationId);

        $now = now();

        DB::table('organization_user_roles')
            ->where('organization_id', $organizationId)
            ->where('user_id', $this->id)
            ->delete();

        if ($roleIds !== []) {
            DB::table('organization_user_roles')->insert(
                collect($roleIds)->map(fn (int $roleId) => [
                    'organization_id' => $organizationId,
                    'user_id' => $this->id,
                    'role_id' => $roleId,
                    'created_at' => $now,
                    'updated_at' => $now,
                ])->all(),
            );
        }

        return $this;
    }

    public function syncPermissions(array $permissionIds): static
    {
        $this->clearRbacCache();
        $this->permissions()->sync(array_values(array_unique($permissionIds)));

        return $this;
    }

    public function attachToOrganization(int|Organization $organization, bool $active = true): static
    {
        $organizationId = $organization instanceof Organization ? $organization->id : $organization;

        $this->organizations()->syncWithoutDetaching([
            $organizationId => [
                'is_active' => $active,
                'joined_at' => now(),
            ],
        ]);

        app(PortalAccessResolver::class)->grantPortalAccess($this, PortalAccessResolver::PORTAL_EMPLOYEE);

        return $this;
    }
}
