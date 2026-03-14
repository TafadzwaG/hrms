<?php

namespace App\Support\Rbac;

use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class PermissionRegistry
{
    public static function groups(): Collection
    {
        return collect(config('rbac.groups', []))
            ->map(function (array $group): array {
                $permissions = collect($group['permissions'] ?? [])
                    ->map(function (array $permission) use ($group): array {
                        return [
                            'name' => (string) $permission['name'],
                            'label' => (string) ($permission['label'] ?? Str::headline((string) $permission['name'])),
                            'description' => (string) ($permission['description'] ?? ''),
                            'module' => (string) ($permission['module'] ?? $group['key']),
                        ];
                    })
                    ->values()
                    ->all();

                return [
                    'key' => (string) $group['key'],
                    'label' => (string) ($group['label'] ?? Str::headline((string) $group['key'])),
                    'description' => (string) ($group['description'] ?? ''),
                    'permissions' => $permissions,
                ];
            })
            ->values();
    }

    public static function all(): Collection
    {
        return static::groups()
            ->flatMap(fn (array $group) => $group['permissions'])
            ->values();
    }

    public static function names(): array
    {
        return static::all()->pluck('name')->values()->all();
    }

    public static function definitionsByName(): array
    {
        return static::all()->keyBy('name')->all();
    }

    public static function expand(array $abilities): array
    {
        $catalogue = static::names();

        return collect(Arr::wrap($abilities))
            ->flatMap(function (string $ability) use ($catalogue) {
                if ($ability === '*') {
                    return $catalogue;
                }

                if (Str::contains($ability, '*')) {
                    return collect($catalogue)
                        ->filter(fn (string $permission) => Str::is($ability, $permission))
                        ->values()
                        ->all();
                }

                return [$ability];
            })
            ->filter()
            ->unique()
            ->values()
            ->all();
    }

    public static function defaultsForRole(string $roleCode): array
    {
        return static::expand(config('rbac.default_role_permissions.' . $roleCode, []));
    }

    public static function protectedRoleCodes(): array
    {
        return array_values(config('rbac.protected_role_codes', []));
    }

    public static function isProtectedRoleCode(?string $roleCode): bool
    {
        if (blank($roleCode)) {
            return false;
        }

        return in_array((string) $roleCode, static::protectedRoleCodes(), true);
    }
}
