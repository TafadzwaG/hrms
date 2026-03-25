<?php

namespace App\Http\Controllers;

use App\Http\Requests\Rbac\StoreRoleRequest;
use App\Http\Requests\Rbac\UpdateRoleRequest;
use App\Models\Permission;
use App\Models\Role;
use App\Support\Audit\AuditLogger;
use App\Support\IndexTables\IndexTableSorter;
use App\Support\Rbac\PermissionCatalogueSynchronizer;
use App\Support\Rbac\PermissionRegistry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        $this->syncPermissionCatalogue();
        $roleUserCounts = $this->effectiveRoleAssignmentCounts();

        $filters = [
            'search' => $request->string('search')->toString(),
        ];
        $sortMap = [
            'name' => 'name',
            'permissions_count' => 'permissions_count',
            'updated_at' => 'updated_at',
        ];
        $sorting = IndexTableSorter::resolve($request, $sortMap, 'name');

        $query = Role::query()
            ->withCount(['permissions']);

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($builder) use ($search): void {
                $builder->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        IndexTableSorter::apply($query, $sortMap, $sorting['sort'], $sorting['direction']);

        $roles = $query
            ->paginate(12)
            ->withQueryString()
            ->through(fn (Role $role) => [
                'id' => $role->id,
                'code' => $role->code,
                'name' => $role->name,
                'description' => $role->description,
                'users_count' => (int) ($roleUserCounts[$role->id] ?? 0),
                'permissions_count' => $role->permissions_count ?? 0,
                'is_protected' => PermissionRegistry::isProtectedRoleCode($role->code),
                'created_at' => optional($role->created_at)->toDateTimeString(),
                'updated_at' => optional($role->updated_at)->toDateTimeString(),
            ]);

        $rolesWithUsage = Role::query()
            ->orderBy('name')
            ->get(['id', 'code', 'name'])
            ->map(fn (Role $role) => [
                'id' => $role->id,
                'code' => $role->code,
                'name' => $role->name,
                'users_count' => (int) ($roleUserCounts[$role->id] ?? 0),
            ])
            ->sortByDesc('users_count')
            ->take(6)
            ->values();

        return Inertia::render('Roles/Index', [
            'roles' => $roles,
            'filters' => [
                ...$filters,
                'sort' => $sorting['sort'],
                'direction' => $sorting['direction'],
            ],
            'stats' => [
                'total_roles' => Role::count(),
                'total_permissions' => Permission::count(),
                'users_with_roles' => $this->effectiveUsersWithRolesCount(),
                'recently_updated' => Role::query()->whereDate('updated_at', '>=', now()->subDays(7))->count(),
            ],
            'usersByRole' => $rolesWithUsage,
        ]);
    }

    public function create()
    {
        $this->syncPermissionCatalogue();

        return Inertia::render('Roles/Create', [
            'permissionGroups' => $this->permissionGroups(),
            'meta' => [
                'total_permissions' => Permission::count(),
            ],
        ]);
    }

    public function store(StoreRoleRequest $request)
    {
        $validated = $request->validated();

        $role = Role::query()->create([
            'code' => $validated['code'],
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        $role->syncPermissions($validated['permission_ids'] ?? []);

        app(AuditLogger::class)->logCreate($role, $this->auditPayload($role), [
            'module' => 'roles',
            'description' => 'Created role and assigned permissions.',
        ]);

        return redirect()
            ->route('roles.show', $role)
            ->with('success', 'Role created successfully.');
    }

    public function show(Role $role)
    {
        $this->syncPermissionCatalogue();

        $role->load(['permissions:id,name,module,label,description']);
        $role->loadCount(['permissions']);
        $roleUsers = $this->visibleUsersQuery()
            ->whereIn('id', $this->effectiveRoleUserIds($role->id))
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        return Inertia::render('Roles/Show', [
            'role' => [
                'id' => $role->id,
                'code' => $role->code,
                'name' => $role->name,
                'description' => $role->description,
                'users_count' => $roleUsers->count(),
                'permissions_count' => $role->permissions_count,
                'is_protected' => PermissionRegistry::isProtectedRoleCode($role->code),
                'permission_ids' => $role->permissions->pluck('id')->values()->all(),
                'permissions' => $role->permissions
                    ->sortBy(['module', 'label'])
                    ->map(fn (Permission $permission) => [
                        'id' => $permission->id,
                        'name' => $permission->name,
                        'label' => $permission->label,
                        'description' => $permission->description,
                        'module' => $permission->module,
                    ])
                    ->values(),
                'users' => $roleUsers
                    ->sortBy('name')
                    ->map(fn ($user) => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                    ])
                    ->values(),
                'created_at' => optional($role->created_at)->toDateTimeString(),
                'updated_at' => optional($role->updated_at)->toDateTimeString(),
            ],
            'permissionGroups' => $this->permissionGroups($role->permissions->pluck('id')->all()),
        ]);
    }

    public function edit(Role $role)
    {
        $this->syncPermissionCatalogue();

        $role->loadCount(['permissions']);
        $role->load('permissions:id');

        return Inertia::render('Roles/Edit', [
            'role' => [
                'id' => $role->id,
                'code' => $role->code,
                'name' => $role->name,
                'description' => $role->description,
                'users_count' => count($this->effectiveRoleUserIds($role->id)),
                'permissions_count' => $role->permissions_count,
                'permission_ids' => $role->permissions->pluck('id')->values()->all(),
                'is_protected' => PermissionRegistry::isProtectedRoleCode($role->code),
            ],
            'permissionGroups' => $this->permissionGroups($role->permissions->pluck('id')->all()),
        ]);
    }

    public function update(UpdateRoleRequest $request, Role $role)
    {
        $validated = $request->validated();
        $before = $this->auditPayload($role->loadMissing('permissions:id,name'));

        $role->update([
            'code' => $validated['code'],
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        $role->syncPermissions($validated['permission_ids'] ?? []);
        $role->load('permissions:id,name');

        app(AuditLogger::class)->logUpdate($role, $before, $this->auditPayload($role), [
            'module' => 'roles',
            'description' => 'Updated role details and permission coverage.',
        ]);

        return redirect()
            ->route('roles.show', $role)
            ->with('success', 'Role updated successfully.');
    }

    public function destroy(Role $role)
    {
        if (PermissionRegistry::isProtectedRoleCode($role->code)) {
            return back()->withErrors([
                'delete' => 'Seeded roles are protected and cannot be deleted.',
            ]);
        }

        if (
            DB::table('role_users')->where('role_id', $role->id)->exists()
            || DB::table('organization_user_roles')->where('role_id', $role->id)->exists()
        ) {
            return back()->withErrors([
                'delete' => 'Cannot delete this role because it is assigned to users.',
            ]);
        }

        $before = $this->auditPayload($role->loadMissing('permissions:id,name'));
        $role->permissions()->detach();
        $role->delete();

        app(AuditLogger::class)->logDelete($role, $before, [
            'module' => 'roles',
            'description' => 'Deleted role from the RBAC catalogue.',
        ]);

        return redirect()
            ->route('roles.index')
            ->with('success', 'Role deleted successfully.');
    }

    private function auditPayload(Role $role): array
    {
        $permissions = $role->relationLoaded('permissions')
            ? $role->permissions
            : $role->permissions()->get(['permissions.id', 'permissions.name']);

        return [
            'id' => $role->id,
            'code' => $role->code,
            'name' => $role->name,
            'description' => $role->description,
            'permission_ids' => $permissions->pluck('id')->values()->all(),
            'permission_names' => $permissions->pluck('name')->values()->all(),
        ];
    }

    private function permissionGroups(array $selectedPermissionIds = []): array
    {
        $permissionsByName = Permission::query()
            ->whereIn('name', PermissionRegistry::names())
            ->get(['id', 'name', 'module', 'label', 'description'])
            ->keyBy('name');

        return PermissionRegistry::groups()
            ->map(function (array $group) use ($permissionsByName, $selectedPermissionIds): array {
                return [
                    'key' => $group['key'],
                    'label' => $group['label'],
                    'description' => $group['description'],
                    'permissions' => collect($group['permissions'])
                        ->map(function (array $definition) use ($permissionsByName, $selectedPermissionIds): ?array {
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
                                'checked' => in_array($permission->id, $selectedPermissionIds, true),
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
