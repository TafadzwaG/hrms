<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Permission;
use App\Models\Role;
use App\Support\Rbac\PermissionCatalogueSynchronizer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ControlCenterController extends Controller
{
    public function index(Request $request)
    {
        app(PermissionCatalogueSynchronizer::class)->sync();

        $roleUserCounts = $this->effectiveRoleAssignmentCounts();
        $visibleUsersCount = $this->visibleUsersQuery()->count();

        $roles = Role::query()
            ->withCount(['permissions'])
            ->orderByDesc('updated_at')
            ->get()
            ->map(function (Role $role) use ($roleUserCounts) {
                $role->setAttribute('users_count', (int) ($roleUserCounts[$role->id] ?? 0));

                return $role;
            });

        $recentRoles = $roles
            ->take(5)
            ->map(fn (Role $role) => [
                'id' => $role->id,
                'code' => $role->code,
                'name' => $role->name,
                'description' => $role->description,
                'users_count' => $role->users_count,
                'permissions_count' => $role->permissions_count,
                'updated_at' => optional($role->updated_at)->toDateTimeString(),
            ])
            ->values();

        $usersByRole = $roles
            ->sortByDesc('users_count')
            ->take(6)
            ->map(fn (Role $role) => [
                'id' => $role->id,
                'code' => $role->code,
                'name' => $role->name,
                'users_count' => $role->users_count,
            ])
            ->values();

        $summary = [
            'roles_total' => $roles->count(),
            'permissions_total' => Permission::count(),
            'users_with_roles' => $this->effectiveUsersWithRolesCount(),
            'users_without_roles' => max($visibleUsersCount - $this->effectiveUsersWithRolesCount(), 0),
            'roles_without_permissions' => $roles->where('permissions_count', 0)->count(),
            'roles_without_users' => $roles->where('users_count', 0)->count(),
        ];

        $alerts = collect();

        if ($summary['roles_without_permissions'] > 0) {
            $alerts->push([
                'id' => 'roles_without_permissions',
                'tone' => 'warning',
                'title' => $summary['roles_without_permissions'] . ' role' . ($summary['roles_without_permissions'] === 1 ? '' : 's') . ' missing permissions',
                'body' => 'These roles exist but do not currently grant any access.',
                'href' => '/roles/matrix',
            ]);
        }

        if ($summary['users_without_roles'] > 0) {
            $alerts->push([
                'id' => 'users_without_roles',
                'tone' => 'info',
                'title' => $summary['users_without_roles'] . ' user' . ($summary['users_without_roles'] === 1 ? '' : 's') . ' without a role assignment',
                'body' => 'Review user access to ensure every active account is governed by RBAC.',
                'href' => '/users',
            ]);
        }

        return Inertia::render('ControlCenter/Index', [
            'summary' => $summary,
            'usersByRole' => $usersByRole,
            'recentRoles' => $recentRoles,
            'alerts' => $alerts->values(),
            'quickActions' => [
                ['label' => 'Organizations', 'href' => '/organizations', 'description' => 'Manage tenant organizations and switch access context.'],
                ['label' => 'Create role', 'href' => '/roles/create', 'description' => 'Define a new role and assign permissions.'],
                ['label' => 'Permission matrix', 'href' => '/roles/matrix', 'description' => 'Review role coverage across modules.'],
                ['label' => 'Assign user roles', 'href' => '/users', 'description' => 'Update user role assignments in the user directory.'],
                ['label' => 'Audit trail', 'href' => '/audit-trail', 'description' => 'Inspect cross-module activity and security events.'],
            ],
            'auditSummary' => [
                'events_today' => AuditLog::query()->whereDate('created_at', now()->toDateString())->count(),
                'critical_today' => AuditLog::query()
                    ->whereDate('created_at', now()->toDateString())
                    ->whereIn('event', config('audit.critical_events', []))
                    ->count(),
            ],
        ]);
    }
}
