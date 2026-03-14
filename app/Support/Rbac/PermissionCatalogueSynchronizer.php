<?php

namespace App\Support\Rbac;

use App\Models\Permission;
use Illuminate\Support\Collection;

class PermissionCatalogueSynchronizer
{
    public function sync(): Collection
    {
        $definitions = PermissionRegistry::all()->keyBy('name');

        if ($definitions->isEmpty()) {
            return collect();
        }

        $permissions = Permission::query()
            ->whereIn('name', $definitions->keys()->all())
            ->get(['id', 'name', 'module', 'label', 'description'])
            ->keyBy('name');

        foreach ($definitions as $name => $definition) {
            $permission = $permissions->get($name);

            if (!$permission) {
                $permission = Permission::query()->create([
                    'name' => $definition['name'],
                    'module' => $definition['module'],
                    'label' => $definition['label'],
                    'description' => $definition['description'],
                ]);

                $permissions->put($name, $permission);

                continue;
            }

            $permission->fill([
                'module' => $definition['module'],
                'label' => $definition['label'],
                'description' => $definition['description'],
            ]);

            if ($permission->isDirty()) {
                $permission->save();
            }
        }

        return $permissions->sortBy('name')->values();
    }
}
