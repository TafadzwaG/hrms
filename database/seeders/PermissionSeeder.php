<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Support\Rbac\PermissionCatalogueSynchronizer;
use App\Support\Rbac\PermissionRegistry;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function (): void {
            app(PermissionCatalogueSynchronizer::class)->sync();

            $permissionIds = Permission::query()
                ->whereIn('name', PermissionRegistry::names())
                ->pluck('id', 'name');

            foreach (array_keys(config('rbac.default_role_permissions', [])) as $roleCode) {
                $role = Role::query()->where('code', $roleCode)->first();

                if (!$role) {
                    continue;
                }

                $ids = collect(PermissionRegistry::defaultsForRole($roleCode))
                    ->map(fn (string $permissionName) => $permissionIds[$permissionName] ?? null)
                    ->filter()
                    ->values()
                    ->all();

                if (!empty($ids)) {
                    $role->permissions()->syncWithoutDetaching($ids);
                }
            }
        });
    }
}
