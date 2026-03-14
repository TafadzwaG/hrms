<?php

namespace App\Http\Controllers;

use App\Http\Requests\Rbac\UpdatePermissionMatrixRequest;
use App\Models\Permission;
use App\Models\Role;
use App\Support\Audit\AuditContext;
use App\Support\Audit\AuditLogger;
use App\Support\Rbac\PermissionCatalogueSynchronizer;
use App\Support\Rbac\PermissionRegistry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PermissionMatrixController extends Controller
{
    public function index(Request $request)
    {
        $this->syncPermissionCatalogue();

        $roles = Role::query()
            ->with(['permissions:id,name'])
            ->withCount(['users', 'permissions'])
            ->orderBy('name')
            ->get()
            ->map(fn (Role $role) => [
                'id' => $role->id,
                'code' => $role->code,
                'name' => $role->name,
                'description' => $role->description,
                'users_count' => $role->users_count,
                'permissions_count' => $role->permissions_count,
                'permission_ids' => $role->permissions->pluck('id')->values()->all(),
                'permission_names' => $role->permissions->pluck('name')->values()->all(),
                'updated_at' => optional($role->updated_at)->toDateTimeString(),
            ])
            ->values();

        return Inertia::render('Roles/Matrix', [
            'roles' => $roles,
            'permissionGroups' => $this->permissionGroups(),
            'summary' => [
                'roles_total' => $roles->count(),
                'permissions_total' => Permission::count(),
                'assignments_total' => DB::table('role_permissions')->count(),
            ],
        ]);
    }

    public function update(UpdatePermissionMatrixRequest $request)
    {
        $payload = collect($request->validated('matrix'));
        $batchId = (string) Str::uuid();

        AuditContext::withBatch($batchId, function () use ($payload, $batchId): void {
            DB::transaction(function () use ($payload, $batchId): void {
                $roles = Role::query()
                    ->with('permissions:id,name')
                    ->whereIn('id', $payload->pluck('role_id')->all())
                    ->get()
                    ->keyBy('id');

                foreach ($payload as $row) {
                    $role = $roles->get($row['role_id']);

                    if (!$role) {
                        continue;
                    }

                    $beforeIds = $role->permissions->pluck('id')->values()->all();
                    $beforeNames = $role->permissions->pluck('name')->values()->all();

                    $role->syncPermissions($row['permission_ids'] ?? []);
                    $role->load('permissions:id,name');

                    $afterIds = $role->permissions->pluck('id')->values()->all();
                    $afterNames = $role->permissions->pluck('name')->values()->all();

                    if ($beforeIds === $afterIds) {
                        continue;
                    }

                    app(AuditLogger::class)->logCustom('permission_changes', $role, [
                        'module' => 'permissions',
                        'category' => 'access',
                        'description' => 'Updated role permission assignments from the permission matrix.',
                        'old_values' => [
                            'permission_ids' => $beforeIds,
                            'permission_names' => $beforeNames,
                        ],
                        'new_values' => [
                            'permission_ids' => $afterIds,
                            'permission_names' => $afterNames,
                        ],
                        'metadata' => [
                            'added_permission_ids' => array_values(array_diff($afterIds, $beforeIds)),
                            'removed_permission_ids' => array_values(array_diff($beforeIds, $afterIds)),
                        ],
                        'batch_id' => $batchId,
                    ]);
                }
            });
        });

        return redirect()
            ->route('roles.matrix')
            ->with('success', 'Permission matrix updated successfully.');
    }

    private function permissionGroups(): array
    {
        $permissionsByName = Permission::query()
            ->whereIn('name', PermissionRegistry::names())
            ->get(['id', 'name', 'module', 'label', 'description'])
            ->keyBy('name');

        return PermissionRegistry::groups()
            ->map(function (array $group) use ($permissionsByName): array {
                return [
                    'key' => $group['key'],
                    'label' => $group['label'],
                    'description' => $group['description'],
                    'permissions' => collect($group['permissions'])
                        ->map(function (array $definition) use ($permissionsByName): ?array {
                            $permission = $permissionsByName->get($definition['name']);

                            if (!$permission) {
                                return null;
                            }

                            return [
                                'id' => $permission->id,
                                'name' => $permission->name,
                                'label' => $permission->label,
                                'description' => $permission->description,
                                'module' => $permission->module,
                            ];
                        })
                        ->filter()
                        ->values()
                        ->all(),
                ];
            })
            ->values()
            ->all();
    }

    private function syncPermissionCatalogue(): void
    {
        app(PermissionCatalogueSynchronizer::class)->sync();
    }
}
