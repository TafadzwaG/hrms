<?php

namespace App\Http\Controllers;

use App\Mail\UserCredentialsMail;
use App\Models\AuditLog;
use App\Models\Role;
use App\Models\User;
use App\Support\Audit\AuditLogger;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $filters = [
            'search' => $request->string('search')->toString(),
            'role_id' => $request->string('role_id')->toString(),
        ];

        $query = User::query()
            ->with(['roles:id,code,name,description', 'employee:id,user_id,staff_number,first_name,surname'])
            ->withCount('roles')
            ->orderBy('name');

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($builder) use ($search): void {
                $builder->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");

                if (Schema::hasColumn('users', 'username')) {
                    $builder->orWhere('username', 'like', "%{$search}%");
                }
            });
        }

        if (!empty($filters['role_id'])) {
            $roleId = (int) $filters['role_id'];
            $query->whereHas('roles', fn ($roleQuery) => $roleQuery->where('roles.id', $roleId));
        }

        $users = $query
            ->paginate(15)
            ->withQueryString()
            ->through(fn (User $user) => $this->userPayload($user, true));

        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => $filters,
            'roles' => $this->availableRoles(),
            'meta' => $this->userMeta(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Users/Create', [
            'roles' => $this->availableRoles(),
            'meta' => $this->userMeta(),
        ]);
    }

    public function store(Request $request)
    {
        $supportsUsername = Schema::hasColumn('users', 'username');
        $supportsRoleColumn = Schema::hasColumn('users', 'role');
        $supportsEmailVerification = Schema::hasColumn('users', 'email_verified_at');

        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'send_password_email' => ['nullable', 'boolean'],
            'role_ids' => ['array'],
            'role_ids.*' => ['integer', 'exists:roles,id'],
        ];

        if ($supportsUsername) {
            $rules['username'] = ['nullable', 'string', 'max:255', 'unique:users,username'];
        }

        if ($supportsRoleColumn) {
            $rules['role'] = ['nullable', 'string', 'max:50'];
        }

        if ($supportsEmailVerification) {
            $rules['mark_email_verified'] = ['nullable', 'boolean'];
        }

        $data = $request->validate($rules);
        $plainPassword = $data['password'];
        $sendPasswordEmail = (bool) ($data['send_password_email'] ?? false);
        $roleIds = $data['role_ids'] ?? [];
        $roleIds = $request->user()?->canAccess('users.assign_roles') ? $roleIds : [];

        $user = DB::transaction(function () use ($data, $supportsUsername, $supportsRoleColumn, $supportsEmailVerification, $plainPassword, $sendPasswordEmail, $roleIds): User {
            $userPayload = [
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($plainPassword),
            ];

            if ($supportsUsername) {
                $userPayload['username'] = $data['username'] ?? null;
            }

            if ($supportsRoleColumn) {
                $userPayload['role'] = $this->legacyRoleValue($data['role'] ?? null, $roleIds) ?? 'employee';
            }

            if ($supportsEmailVerification) {
                $userPayload['email_verified_at'] = !empty($data['mark_email_verified']) ? now() : null;
            }

            $user = User::query()->create($userPayload);
            $user->syncRoles($roleIds);
            $user->load('roles:id,code,name');

            if ($sendPasswordEmail && !empty($user->email)) {
                DB::afterCommit(function () use ($user, $plainPassword): void {
                    Mail::to($user->email)->send(new UserCredentialsMail($user, $plainPassword, 'created'));
                });
            }

            return $user;
        });

        app(AuditLogger::class)->logCreate($user, $this->auditPayload($user), [
            'module' => 'users',
            'description' => 'Created user account.',
        ]);

        if (!empty($roleIds)) {
            app(AuditLogger::class)->logCustom('assign_role', $user, [
                'module' => 'users',
                'category' => 'access',
                'description' => 'Assigned roles during user account creation.',
                'new_values' => [
                    'role_ids' => $user->roles->pluck('id')->values()->all(),
                    'role_codes' => $user->roles->pluck('code')->values()->all(),
                    'role_names' => $user->roles->pluck('name')->values()->all(),
                ],
            ]);
        }

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function show(Request $request, User $user)
    {
        $canViewAudit = (bool) $request->user()?->canAccess('audit.view');

        $user->load([
            'roles:id,code,name,description',
            'roles.permissions:id,name,label,module,description',
            'permissions:id,name,label,module,description',
            'employee:id,user_id,staff_number,first_name,middle_name,surname,org_unit_id,location_id,position_id,status',
            'employee.orgUnit:id,name',
            'employee.location:id,name',
            'employee.position:id,name',
        ]);

        $allPermissions = $user->allPermissions()
            ->sortBy([
                ['module', 'asc'],
                ['label', 'asc'],
            ])
            ->values();

        return Inertia::render('Users/Show', [
            'user' => [
                ...$this->userPayload($user),
                'direct_permissions_count' => $user->permissions->count(),
                'all_permissions' => $allPermissions
                    ->map(fn ($permission) => [
                        'id' => $permission->id,
                        'name' => $permission->name,
                        'label' => $permission->label,
                        'module' => $permission->module,
                        'description' => $permission->description,
                    ])
                    ->values(),
                'account' => $this->accountSummary($user, $allPermissions, $canViewAudit),
                'activity' => $this->activitySummary($user, $canViewAudit),
                'links' => $this->userLinks($user),
            ],
            'meta' => $this->userMeta(),
        ]);
    }

    public function edit(User $user)
    {
        $user->load('roles:id');

        return Inertia::render('Users/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'username' => Schema::hasColumn('users', 'username') ? $user->username : null,
                'role' => Schema::hasColumn('users', 'role') ? $user->role : null,
                'email_verified_at' => Schema::hasColumn('users', 'email_verified_at')
                    ? optional($user->email_verified_at)->toDateTimeString()
                    : null,
                'role_ids' => $user->roles->pluck('id')->values()->all(),
            ],
            'roles' => $this->availableRoles(),
            'meta' => $this->userMeta(),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $supportsUsername = Schema::hasColumn('users', 'username');
        $supportsRoleColumn = Schema::hasColumn('users', 'role');
        $supportsEmailVerification = Schema::hasColumn('users', 'email_verified_at');

        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'send_password_email' => ['nullable', 'boolean'],
            'role_ids' => ['array'],
            'role_ids.*' => ['integer', 'exists:roles,id'],
        ];

        if ($supportsUsername) {
            $rules['username'] = ['nullable', 'string', 'max:255', Rule::unique('users', 'username')->ignore($user->id)];
        }

        if ($supportsRoleColumn) {
            $rules['role'] = ['nullable', 'string', 'max:50'];
        }

        if ($supportsEmailVerification) {
            $rules['mark_email_verified'] = ['nullable', 'boolean'];
            $rules['unverify_email'] = ['nullable', 'boolean'];
        }

        $data = $request->validate($rules);
        $plainPassword = !empty($data['password']) ? $data['password'] : null;
        $sendPasswordEmail = (bool) ($data['send_password_email'] ?? false);
        $roleIds = $data['role_ids'] ?? [];
        $roleIds = $request->user()?->canAccess('users.assign_roles') ? $roleIds : $user->roles()->pluck('roles.id')->all();
        $beforeUser = $this->auditPayload($user->load('roles:id,code,name'));

        $user = DB::transaction(function () use ($user, $data, $supportsUsername, $supportsRoleColumn, $supportsEmailVerification, $plainPassword, $sendPasswordEmail, $roleIds): User {
            $user->name = $data['name'];
            $user->email = $data['email'];

            if ($supportsUsername) {
                $user->username = $data['username'] ?? null;
            }

            if ($supportsRoleColumn) {
                $user->role = $this->legacyRoleValue($data['role'] ?? null, $roleIds) ?? $user->role;
            }

            if ($plainPassword) {
                $user->password = Hash::make($plainPassword);
            }

            if ($supportsEmailVerification) {
                if (!empty($data['unverify_email'])) {
                    $user->email_verified_at = null;
                } elseif (!empty($data['mark_email_verified'])) {
                    $user->email_verified_at = $user->email_verified_at ?? now();
                }
            }

            $user->save();
            $user->syncRoles($roleIds);
            $user->load('roles:id,code,name');

            if ($plainPassword && $sendPasswordEmail && !empty($user->email)) {
                DB::afterCommit(function () use ($user, $plainPassword): void {
                    Mail::to($user->email)->send(new UserCredentialsMail($user, $plainPassword, 'reset'));
                });
            }

            return $user;
        });

        $afterUser = $this->auditPayload($user);

        app(AuditLogger::class)->logUpdate($user, $beforeUser, $afterUser, [
            'module' => 'users',
            'description' => 'Updated user account details.',
        ]);

        $addedRoles = array_values(array_diff($afterUser['role_ids'], $beforeUser['role_ids']));
        $removedRoles = array_values(array_diff($beforeUser['role_ids'], $afterUser['role_ids']));

        if (!empty($addedRoles)) {
            app(AuditLogger::class)->logCustom('assign_role', $user, [
                'module' => 'users',
                'category' => 'access',
                'description' => 'Assigned additional roles to the user account.',
                'new_values' => [
                    'role_ids' => $addedRoles,
                ],
                'metadata' => [
                    'current_role_ids' => $afterUser['role_ids'],
                    'current_role_codes' => $afterUser['role_codes'],
                ],
            ]);
        }

        if (!empty($removedRoles)) {
            app(AuditLogger::class)->logCustom('revoke_role', $user, [
                'module' => 'users',
                'category' => 'access',
                'description' => 'Removed roles from the user account.',
                'old_values' => [
                    'role_ids' => $removedRoles,
                ],
                'metadata' => [
                    'current_role_ids' => $afterUser['role_ids'],
                    'current_role_codes' => $afterUser['role_codes'],
                ],
            ]);
        }

        return redirect()->route('users.show', $user)->with('success', 'User updated successfully.');
    }

    public function destroyRole(User $user, Role $role)
    {
        if (!$user->roles()->whereKey($role->id)->exists()) {
            return back()->withErrors([
                'roles' => 'This role is not assigned to the selected user.',
            ]);
        }

        $beforeUser = $this->auditPayload($user->load('roles:id,code,name'));

        DB::transaction(function () use ($user, $role): void {
            $user->roles()->detach($role->id);

            if (Schema::hasColumn('users', 'role')) {
                $remainingRoleIds = $user->roles()->pluck('roles.id')->all();
                $user->role = $this->legacyRoleValue(null, $remainingRoleIds);
                $user->save();
            }

            $user->load('roles:id,code,name');
        });

        $afterUser = $this->auditPayload($user);

        app(AuditLogger::class)->logCustom('revoke_role', $user, [
            'module' => 'users',
            'category' => 'access',
            'description' => sprintf('Removed %s from the user account.', $role->name),
            'old_values' => [
                'role_ids' => $beforeUser['role_ids'],
                'role_codes' => $beforeUser['role_codes'],
                'role_names' => $beforeUser['role_names'],
                'removed_role' => [
                    'id' => $role->id,
                    'code' => $role->code,
                    'name' => $role->name,
                ],
            ],
            'new_values' => [
                'role_ids' => $afterUser['role_ids'],
                'role_codes' => $afterUser['role_codes'],
                'role_names' => $afterUser['role_names'],
            ],
        ]);

        return back()->with('success', 'Role removed from the user successfully.');
    }

    public function destroy(User $user)
    {
        if ($user->employee()->exists()) {
            return back()->withErrors([
                'delete' => 'Cannot delete this user because it is linked to an employee record.',
            ]);
        }

        $beforeUser = $this->auditPayload($user->load('roles:id,code,name'));

        DB::transaction(function () use ($user): void {
            $user->roles()->detach();
            $user->permissions()->detach();
            $user->delete();
        });

        app(AuditLogger::class)->logDelete($user, $beforeUser, [
            'module' => 'users',
            'description' => 'Deleted user account.',
        ]);

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }

    private function userLinks(User $user): array
    {
        return [
            'index' => route('users.index', [], false),
            'show' => route('users.show', $user, false),
            'edit' => route('users.edit', $user, false),
            'destroy' => route('users.destroy', $user, false),
            'send_reset_link' => route('users.send-password-reset-link', $user, false),
            'audit_logs' => route('audit-trail.logs', ['user_id' => $user->id], false),
            'audit_export' => route('audit-trail.export', ['user_id' => $user->id], false),
            'employee' => $user->employee
                ? route('employees.show', $user->employee, false)
                : null,
            'control_center' => route('control-center.index', [], false),
        ];
    }

    private function accountSummary(User $user, Collection $allPermissions, bool $includeAudit): array
    {
        return [
            'reference' => sprintf('USR-%06d', $user->id),
            'modules_count' => $allPermissions->pluck('module')->filter()->unique()->count(),
            'access_profile' => $this->accessProfile($allPermissions),
            'mfa' => $this->mfaSummary($user),
            'last_login_at' => $includeAudit ? $this->lastLoginAt($user) : null,
        ];
    }

    private function activitySummary(User $user, bool $includeAudit): array
    {
        if (!$includeAudit) {
            return [
                'total_events' => 0,
                'critical_events' => 0,
                'failed_login_attempts' => 0,
                'recent_audit_logs' => [],
            ];
        }

        $query = $this->relatedAuditQuery($user);

        return [
            'total_events' => (clone $query)->count(),
            'critical_events' => (clone $query)->whereIn('event', config('audit.critical_events', []))->count(),
            'failed_login_attempts' => AuditLog::query()
                ->where('actor_type', User::class)
                ->where('actor_id', $user->id)
                ->where('event', 'failed_login')
                ->count(),
            'recent_audit_logs' => (clone $query)
                ->latest('created_at')
                ->limit(8)
                ->get()
                ->map(fn (AuditLog $log) => $this->auditListItem($log))
                ->values()
                ->all(),
        ];
    }

    private function accessProfile(Collection $permissions): array
    {
        $permissionNames = $permissions->pluck('name')->filter()->values();
        $permissionCount = $permissionNames->count();
        $hasPrivilegedAccess = $permissionNames->intersect([
            'users.assign_roles',
            'users.delete',
            'roles.update',
            'roles.delete',
            'permissions.assign',
            'audit.export',
            'audit.manage',
            'documents.delete',
            'payroll.run',
        ])->isNotEmpty();

        if ($hasPrivilegedAccess || $permissionCount >= 25) {
            return [
                'label' => 'Privileged',
                'tone' => 'critical',
                'description' => 'This account can perform high-impact security, audit, or administration actions.',
            ];
        }

        if ($permissionCount >= 12) {
            return [
                'label' => 'Elevated',
                'tone' => 'warning',
                'description' => 'This account has broad operational access across multiple modules.',
            ];
        }

        if ($permissionCount >= 1) {
            return [
                'label' => 'Standard',
                'tone' => 'info',
                'description' => 'This account has scoped access defined by its current role assignments.',
            ];
        }

        return [
            'label' => 'Restricted',
            'tone' => 'neutral',
            'description' => 'No effective permissions are currently resolved for this account.',
        ];
    }

    private function mfaSummary(User $user): array
    {
        $supportsTwoFactor = Schema::hasColumn('users', 'two_factor_secret')
            || Schema::hasColumn('users', 'two_factor_confirmed_at');
        $secretConfigured = $supportsTwoFactor && !empty($user->two_factor_secret);
        $confirmed = $supportsTwoFactor && !empty($user->two_factor_confirmed_at);

        if ($confirmed) {
            return [
                'label' => 'Enabled',
                'tone' => 'positive',
                'description' => 'Two-factor authentication is confirmed for this account.',
            ];
        }

        if ($secretConfigured) {
            return [
                'label' => 'Pending',
                'tone' => 'warning',
                'description' => 'Two-factor setup exists but has not been fully confirmed.',
            ];
        }

        return [
            'label' => $supportsTwoFactor ? 'Not enabled' : 'Unavailable',
            'tone' => 'neutral',
            'description' => $supportsTwoFactor
                ? 'Two-factor authentication has not been configured.'
                : 'Two-factor authentication is not available on this installation.',
        ];
    }

    private function lastLoginAt(User $user): ?string
    {
        $log = AuditLog::query()
            ->where('actor_type', User::class)
            ->where('actor_id', $user->id)
            ->where('event', 'login')
            ->latest('created_at')
            ->first(['created_at']);

        return optional($log?->created_at)->toDateTimeString();
    }

    private function relatedAuditQuery(User $user): Builder
    {
        return AuditLog::query()->where(function (Builder $builder) use ($user): void {
            $builder
                ->where(function (Builder $actorQuery) use ($user): void {
                    $actorQuery
                        ->where('actor_type', User::class)
                        ->where('actor_id', $user->id);
                })
                ->orWhere(function (Builder $auditableQuery) use ($user): void {
                    $auditableQuery
                        ->where('auditable_type', User::class)
                        ->where('auditable_id', $user->id);
                });
        });
    }

    private function auditListItem(AuditLog $log): array
    {
        return [
            'id' => $log->id,
            'event' => $log->event,
            'event_label' => str($log->event)->replace('_', ' ')->headline()->toString(),
            'module' => $log->module,
            'module_label' => str($log->module)->replace('_', ' ')->headline()->toString(),
            'description' => $log->description,
            'actor_name' => $log->actor_name,
            'created_at' => optional($log->created_at)->toDateTimeString(),
            'is_critical' => $log->isCritical(),
            'show_url' => route('audit-trail.show', $log, false),
        ];
    }

    private function auditPayload(User $user): array
    {
        $roles = $user->relationLoaded('roles')
            ? $user->roles
            : $user->roles()->get(['roles.id', 'roles.code', 'roles.name']);

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'username' => Schema::hasColumn('users', 'username') ? $user->username : null,
            'role' => Schema::hasColumn('users', 'role') ? $user->role : null,
            'email_verified_at' => Schema::hasColumn('users', 'email_verified_at')
                ? optional($user->email_verified_at)->toDateTimeString()
                : null,
            'role_ids' => $roles->pluck('id')->values()->all(),
            'role_codes' => $roles->pluck('code')->values()->all(),
            'role_names' => $roles->pluck('name')->values()->all(),
        ];
    }

    private function availableRoles()
    {
        return Role::query()
            ->withCount(['users', 'permissions'])
            ->orderBy('name')
            ->get(['id', 'code', 'name', 'description'])
            ->map(fn (Role $role) => [
                'id' => $role->id,
                'code' => $role->code,
                'name' => $role->name,
                'description' => $role->description,
                'users_count' => $role->users_count ?? 0,
                'permissions_count' => $role->permissions_count ?? 0,
            ])
            ->values();
    }

    private function userMeta(): array
    {
        return [
            'supportsUsername' => Schema::hasColumn('users', 'username'),
            'supportsRoleColumn' => Schema::hasColumn('users', 'role'),
            'supportsEmailVerification' => Schema::hasColumn('users', 'email_verified_at'),
            'supportsTwoFactor' => Schema::hasColumn('users', 'two_factor_secret')
                || Schema::hasColumn('users', 'two_factor_confirmed_at'),
        ];
    }

    private function userPayload(User $user, bool $compact = false): array
    {
        $payload = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'username' => Schema::hasColumn('users', 'username') ? $user->username : null,
            'role' => Schema::hasColumn('users', 'role') ? $user->role : null,
            'email_verified_at' => Schema::hasColumn('users', 'email_verified_at')
                ? optional($user->email_verified_at)->toDateTimeString()
                : null,
            'roles_count' => $user->roles_count ?? $user->roles->count(),
            'roles' => $user->roles->map(fn (Role $role) => [
                'id' => $role->id,
                'code' => $role->code,
                'name' => $role->name,
                'description' => $role->description,
                'show_url' => route('roles.show', $role, false),
                'remove_url' => route('users.roles.destroy', ['user' => $user, 'role' => $role], false),
            ])->values()->all(),
            'employee' => $user->employee ? [
                'id' => $user->employee->id,
                'staff_number' => $user->employee->staff_number,
                'full_name' => $user->employee->full_name,
                'job_title' => $user->employee->position?->name,
                'department' => $user->employee->orgUnit?->name,
                'location' => $user->employee->location?->name,
                'status' => $user->employee->status,
            ] : null,
            'created_at' => optional($user->created_at)->toDateTimeString(),
            'updated_at' => optional($user->updated_at)->toDateTimeString(),
        ];

        if ($compact) {
            return $payload;
        }

        return $payload + [
            'permission_names' => $user->permissionNames()->values()->all(),
        ];
    }

    private function legacyRoleValue(?string $legacyRole, array $roleIds): ?string
    {
        if (!empty($legacyRole)) {
            return $legacyRole;
        }

        if (empty($roleIds)) {
            return null;
        }

        $role = Role::query()->whereKey($roleIds[0])->first();

        return $role?->code ? strtolower($role->code) : null;
    }
}
