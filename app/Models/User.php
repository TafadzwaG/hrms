<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    protected $fillable = [
        'name',
        'email',
        'password',
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

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_users')->withTimestamps();
    }

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'user_permissions')->withTimestamps();
    }

    public function employee(): HasOne
    {
        return $this->hasOne(Employee::class);
    }

    public function hasRole(string|array $roles): bool
    {
        $roleValues = collect(Arr::wrap($roles))->filter()->map(fn ($role) => (string) $role);

        if ($roleValues->isEmpty()) {
            return false;
        }

        $owned = $this->roles()->get(['id', 'code', 'name']);

        return $roleValues->contains(function (string $role) use ($owned) {
            return $owned->contains(fn (Role $ownedRole) => $ownedRole->code === $role || $ownedRole->name === $role || (string) $ownedRole->id === $role);
        });
    }

    public function hasAnyRole(array $roles): bool
    {
        return $this->hasRole($roles);
    }

    public function allPermissions(): Collection
    {
        $directPermissions = $this->relationLoaded('permissions')
            ? $this->permissions
            : $this->permissions()->get(['permissions.id', 'permissions.name', 'permissions.module', 'permissions.label']);

        $roles = $this->relationLoaded('roles')
            ? $this->roles
            : $this->roles()->with('permissions:id,name,module,label')->get();

        $rolePermissions = $roles->flatMap(fn (Role $role) => $role->relationLoaded('permissions')
            ? $role->permissions
            : $role->permissions()->get(['permissions.id', 'permissions.name', 'permissions.module', 'permissions.label'])
        );

        return $directPermissions
            ->concat($rolePermissions)
            ->unique('name')
            ->values();
    }

    public function permissionNames(): Collection
    {
        return $this->allPermissions()->pluck('name')->unique()->values();
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

    public function syncRoles(array $roleIds): static
    {
        $this->roles()->sync(array_values(array_unique($roleIds)));

        return $this;
    }

    public function syncPermissions(array $permissionIds): static
    {
        $this->permissions()->sync(array_values(array_unique($permissionIds)));

        return $this;
    }
}
