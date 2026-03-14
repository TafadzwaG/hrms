<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class Role extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'name', 'description'];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'role_users')->withTimestamps();
    }

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'role_permissions')->withTimestamps();
    }

    public function permissionNames(): Collection
    {
        return $this->permissions()->pluck('permissions.name')->unique()->values();
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

    public function syncPermissions(array $permissionIds): static
    {
        $this->permissions()->sync(array_values(array_unique($permissionIds)));

        return $this;
    }
}
