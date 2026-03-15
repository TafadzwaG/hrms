<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Employee;
use App\Models\Organization;
use App\Models\OrgUnit;
use App\Models\Position;
use App\Models\Role;
use App\Models\User;
use App\Support\Audit\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class OrganizationController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        abort_unless($user instanceof User, 403);

        $search = trim((string) $request->input('search', ''));
        $status = trim((string) $request->input('status', 'all'));

        $query = Organization::query()
            ->when(! $user->isSuperAdmin(), function ($builder) use ($user): void {
                $builder->whereIn('id', $user->availableOrganizations()->pluck('id'));
            })
            ->when($search !== '', function ($builder) use ($search): void {
                $builder->where(function ($organizationQuery) use ($search): void {
                    $organizationQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($status !== '' && $status !== 'all', fn ($builder) => $builder->where('status', $status))
            ->orderBy('name');

        $organizations = $query
            ->paginate(12)
            ->withQueryString()
            ->through(fn (Organization $organization) => $this->organizationListItem($organization));

        $accessibleOrganizationIds = $this->accessibleOrganizationIds($user);

        return Inertia::render('Organizations/Index', [
            'organizations' => $organizations,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'summary' => [
                'total_organizations' => Organization::query()->whereIn('id', $accessibleOrganizationIds)->count(),
                'active_organizations' => Organization::query()->whereIn('id', $accessibleOrganizationIds)->where('status', 'ACTIVE')->count(),
                'total_users' => DB::table('organization_user')->whereIn('organization_id', $accessibleOrganizationIds)->distinct('user_id')->count('user_id'),
                'total_employees' => Employee::query()->withoutGlobalScopes()->whereIn('organization_id', $accessibleOrganizationIds)->count(),
            ],
            'recentOrganizations' => Organization::query()
                ->whereIn('id', $accessibleOrganizationIds)
                ->latest('created_at')
                ->limit(5)
                ->get()
                ->map(fn (Organization $organization) => $this->organizationListItem($organization))
                ->values(),
            'quickActions' => [
                ['label' => 'Create organization', 'href' => '/organizations/create', 'description' => 'Add a new tenant organization to the HRMS.'],
                ['label' => 'Manage members', 'href' => $this->currentOrganization() ? '/organizations/'.$this->currentOrganization()->id.'/members' : '/organizations', 'description' => 'Assign users and organization-level roles.'],
                ['label' => 'Switch organization', 'href' => '/dashboard', 'description' => 'Change the active organization context from the header switcher.'],
            ],
            'statusOptions' => ['all', 'ACTIVE', 'INACTIVE', 'ARCHIVED'],
            'isSuperAdmin' => $user->isSuperAdmin(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Organizations/Create', [
            'organization' => null,
            'statusOptions' => ['ACTIVE', 'INACTIVE', 'ARCHIVED'],
            'timezones' => timezone_identifiers_list(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateOrganization($request);

        $organization = DB::transaction(function () use ($validated, $request): Organization {
            $organization = Organization::query()->create($validated);

            $actor = $request->user();
            if ($actor instanceof User) {
                $organization->users()->syncWithoutDetaching([
                    $actor->id => [
                        'is_active' => true,
                        'joined_at' => now(),
                    ],
                ]);

                $hrAdminRole = Role::query()->where('code', 'HR_ADMIN')->value('id');
                if ($hrAdminRole) {
                    $actor->syncRoles([$hrAdminRole], $organization->id);
                }
            }

            return $organization;
        });

        app(AuditLogger::class)->logCreate($organization, $organization->toArray(), [
            'module' => 'organizations',
            'description' => 'Created organization.',
            'organization_id' => $organization->id,
        ]);

        return redirect()
            ->route('organizations.show', $organization)
            ->with('success', 'Organization created successfully.');
    }

    public function show(Organization $organization): Response
    {
        $this->ensureCanAccessOrganization($organization);

        return Inertia::render('Organizations/Show', [
            'organization' => $this->organizationDetail($organization),
            'recentActivity' => AuditLog::query()
                ->withoutGlobalScopes()
                ->where('organization_id', $organization->id)
                ->latest('created_at')
                ->limit(10)
                ->get()
                ->map(fn (AuditLog $log) => [
                    'id' => $log->id,
                    'event' => $log->event,
                    'module' => $log->module,
                    'description' => $log->description,
                    'actor_name' => $log->actor_name,
                    'created_at' => optional($log->created_at)->toDateTimeString(),
                ])
                ->values(),
        ]);
    }

    public function edit(Organization $organization): Response
    {
        $this->ensureCanAccessOrganization($organization);

        return Inertia::render('Organizations/Edit', [
            'organization' => [
                'id' => $organization->id,
                'name' => $organization->name,
                'slug' => $organization->slug,
                'code' => $organization->code,
                'email' => $organization->email,
                'phone' => $organization->phone,
                'address' => $organization->address,
                'logo_path' => $organization->logo_path,
                'status' => $organization->status,
                'timezone' => $organization->timezone,
                'metadata' => $organization->metadata ?? [],
            ],
            'statusOptions' => ['ACTIVE', 'INACTIVE', 'ARCHIVED'],
            'timezones' => timezone_identifiers_list(),
            'summary' => $this->organizationCounts($organization),
        ]);
    }

    public function update(Request $request, Organization $organization): RedirectResponse
    {
        $this->ensureCanAccessOrganization($organization);

        $validated = $this->validateOrganization($request, $organization);
        $before = $organization->toArray();

        $organization->update($validated);

        app(AuditLogger::class)->logUpdate($organization, $before, $organization->toArray(), [
            'module' => 'organizations',
            'description' => 'Updated organization details.',
            'organization_id' => $organization->id,
        ]);

        return redirect()
            ->route('organizations.show', $organization)
            ->with('success', 'Organization updated successfully.');
    }

    public function destroy(Organization $organization): RedirectResponse
    {
        $this->ensureCanAccessOrganization($organization);

        $counts = $this->organizationCounts($organization);
        if ($counts['employees_count'] > 0) {
            return back()->withErrors([
                'delete' => 'Cannot delete an organization that still owns employee records.',
            ]);
        }

        $before = $organization->toArray();
        $organization->delete();

        app(AuditLogger::class)->logDelete($organization, $before, [
            'module' => 'organizations',
            'description' => 'Deleted organization.',
            'organization_id' => $organization->id,
        ]);

        return redirect()
            ->route('organizations.index')
            ->with('success', 'Organization deleted successfully.');
    }

    public function members(Request $request, Organization $organization): Response
    {
        $this->ensureCanAccessOrganization($organization);

        $search = trim((string) $request->input('search', ''));
        $role = trim((string) $request->input('role', ''));

        $query = $organization->users()
            ->when($search !== '', function ($builder) use ($search) {
                $builder->where(function ($q) use ($search) {
                    $q->where('users.name', 'like', "%{$search}%")
                      ->orWhere('users.email', 'like', "%{$search}%");
                });
            })
            ->when($role !== '', function ($builder) use ($organization, $role) {
                $builder->whereExists(function ($query) use ($organization, $role) {
                    $query->select(DB::raw(1))
                        ->from('organization_user_roles')
                        ->join('roles', 'roles.id', '=', 'organization_user_roles.role_id')
                        ->whereColumn('organization_user_roles.user_id', 'users.id')
                        ->where('organization_user_roles.organization_id', $organization->id)
                        ->where('roles.code', $role);
                });
            })
            ->select(['users.id', 'users.name', 'users.email', 'users.created_at'])
            ->orderBy('users.name');

        $paginatedMembers = $query->paginate(15)->withQueryString();

        $userIds = collect($paginatedMembers->items())->pluck('id')->all();

        $roleAssignments = DB::table('organization_user_roles')
            ->join('roles', 'roles.id', '=', 'organization_user_roles.role_id')
            ->where('organization_user_roles.organization_id', $organization->id)
            ->whereIn('organization_user_roles.user_id', $userIds)
            ->select([
                'organization_user_roles.user_id',
                'roles.id as role_id',
                'roles.code',
                'roles.name',
            ])
            ->get()
            ->groupBy('user_id');

        $availableUsers = $this->availableUserOptions($organization);

        $membersCollection = collect($paginatedMembers->items())->map(function (User $user) use ($organization, $roleAssignments) {
            $roles = collect($roleAssignments->get($user->id, []))
                ->map(fn ($r) => [
                    'id' => (int) $r->role_id,
                    'code' => $r->code,
                    'name' => $r->name,
                ])
                ->values()
                ->all();

            $membership = DB::table('organization_user')
                ->where('organization_id', $organization->id)
                ->where('user_id', $user->id)
                ->first(['is_active', 'joined_at']);

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_active' => (bool) ($membership?->is_active ?? false),
                'joined_at' => $membership?->joined_at,
                'roles' => $roles,
                'role_ids' => collect($roles)->pluck('id')->all(),
                'update_url' => route('organizations.members.update', ['organization' => $organization, 'user' => $user], false),
                'remove_url' => route('organizations.members.destroy', ['organization' => $organization, 'user' => $user], false),
            ];
        })->values();

        $paginatedResponse = [
            'data' => $membersCollection,
            'total' => $paginatedMembers->total(),
            'current_page' => $paginatedMembers->currentPage(),
            'last_page' => $paginatedMembers->lastPage(),
            'from' => $paginatedMembers->firstItem(),
            'to' => $paginatedMembers->lastItem(),
        ];

        return Inertia::render('Organizations/Members', [
            'organization' => [
                'id' => $organization->id,
                'name' => $organization->name,
                'slug' => $organization->slug,
                'status' => $organization->status,
            ],
            'summary' => $this->organizationCounts($organization),
            'members' => $paginatedResponse,
            'filters' => [
                'search' => $search,
                'role' => $role,
            ],
            'availableUsers' => $availableUsers,
            'roles' => Role::query()->orderBy('name')->get(['id', 'code', 'name'])->map(fn (Role $role) => [
                'id' => $role->id,
                'code' => $role->code,
                'name' => $role->name,
            ])->values(),
        ]);
    }

    public function storeMember(Request $request, Organization $organization): RedirectResponse
    {
        $this->ensureCanAccessOrganization($organization);

        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'role_ids' => ['array'],
            'role_ids.*' => ['integer', 'exists:roles,id'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $user = User::query()->findOrFail($validated['user_id']);

        DB::transaction(function () use ($organization, $user, $validated): void {
            $organization->users()->syncWithoutDetaching([
                $user->id => [
                    'is_active' => (bool) ($validated['is_active'] ?? true),
                    'joined_at' => now(),
                ],
            ]);

            $user->syncRoles($validated['role_ids'] ?? [], $organization->id);
        });

        app(AuditLogger::class)->logCustom('assign_role', $user, [
            'module' => 'organizations',
            'description' => 'Assigned user to organization membership.',
            'organization_id' => $organization->id,
            'new_values' => [
                'role_ids' => $validated['role_ids'] ?? [],
            ],
            'metadata' => [
                'organization_id' => $organization->id,
                'organization_name' => $organization->name,
            ],
        ]);

        return back()->with('success', 'Organization member added successfully.');
    }

    public function updateMember(Request $request, Organization $organization, User $user): RedirectResponse
    {
        $this->ensureCanAccessOrganization($organization);

        $validated = $request->validate([
            'role_ids' => ['array'],
            'role_ids.*' => ['integer', 'exists:roles,id'],
            'is_active' => ['required', 'boolean'],
        ]);

        DB::transaction(function () use ($organization, $user, $validated): void {
            $organization->users()->syncWithoutDetaching([
                $user->id => [
                    'is_active' => (bool) $validated['is_active'],
                    'joined_at' => now(),
                ],
            ]);

            DB::table('organization_user')
                ->where('organization_id', $organization->id)
                ->where('user_id', $user->id)
                ->update([
                    'is_active' => (bool) $validated['is_active'],
                    'updated_at' => now(),
                ]);

            $user->syncRoles($validated['role_ids'] ?? [], $organization->id);
        });

        app(AuditLogger::class)->logCustom('permission_changes', $user, [
            'module' => 'organizations',
            'description' => 'Updated organization membership and roles.',
            'organization_id' => $organization->id,
            'new_values' => [
                'role_ids' => $validated['role_ids'] ?? [],
                'is_active' => (bool) $validated['is_active'],
            ],
            'metadata' => [
                'organization_id' => $organization->id,
                'organization_name' => $organization->name,
            ],
        ]);

        return back()->with('success', 'Organization membership updated successfully.');
    }

    public function destroyMember(Organization $organization, User $user): RedirectResponse
    {
        $this->ensureCanAccessOrganization($organization);

        DB::transaction(function () use ($organization, $user): void {
            DB::table('organization_user_roles')
                ->where('organization_id', $organization->id)
                ->where('user_id', $user->id)
                ->delete();

            DB::table('organization_user')
                ->where('organization_id', $organization->id)
                ->where('user_id', $user->id)
                ->delete();
        });

        app(AuditLogger::class)->logCustom('revoke_role', $user, [
            'module' => 'organizations',
            'description' => 'Removed user from organization membership.',
            'organization_id' => $organization->id,
            'metadata' => [
                'organization_id' => $organization->id,
                'organization_name' => $organization->name,
            ],
        ]);

        return back()->with('success', 'Organization member removed successfully.');
    }

    private function validateOrganization(Request $request, ?Organization $organization = null): array
    {
        $organizationId = $organization?->id;

        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('organizations', 'slug')->ignore($organizationId)],
            'code' => ['nullable', 'string', 'max:64', Rule::unique('organizations', 'code')->ignore($organizationId)],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:64'],
            'address' => ['nullable', 'string'],
            'logo_path' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'in:ACTIVE,INACTIVE,ARCHIVED'],
            'timezone' => ['nullable', 'string', 'max:64'],
        ]);
    }

    private function organizationListItem(Organization $organization): array
    {
        $counts = $this->organizationCounts($organization);

        return [
            'id' => $organization->id,
            'name' => $organization->name,
            'slug' => $organization->slug,
            'code' => $organization->code,
            'email' => $organization->email,
            'phone' => $organization->phone,
            'status' => $organization->status,
            'timezone' => $organization->timezone,
            'users_count' => $counts['users_count'],
            'employees_count' => $counts['employees_count'],
            'created_at' => optional($organization->created_at)->toDateTimeString(),
            'updated_at' => optional($organization->updated_at)->toDateTimeString(),
            'show_url' => route('organizations.show', $organization, false),
            'edit_url' => route('organizations.edit', $organization, false),
            'members_url' => route('organizations.members', $organization, false),
        ];
    }

    private function organizationDetail(Organization $organization): array
    {
        $counts = $this->organizationCounts($organization);

        return [
            'id' => $organization->id,
            'name' => $organization->name,
            'slug' => $organization->slug,
            'code' => $organization->code,
            'email' => $organization->email,
            'phone' => $organization->phone,
            'address' => $organization->address,
            'logo_path' => $organization->logo_path,
            'status' => $organization->status,
            'timezone' => $organization->timezone,
            'metadata' => $organization->metadata ?? [],
            'counts' => $counts,
            'created_at' => optional($organization->created_at)->toDateTimeString(),
            'updated_at' => optional($organization->updated_at)->toDateTimeString(),
            'members_url' => route('organizations.members', $organization, false),
            'edit_url' => route('organizations.edit', $organization, false),
        ];
    }

    private function organizationCounts(Organization $organization): array
    {
        return [
            'users_count' => DB::table('organization_user')->where('organization_id', $organization->id)->count(),
            'employees_count' => Employee::query()->withoutGlobalScopes()->where('organization_id', $organization->id)->count(),
            'departments_count' => OrgUnit::query()->withoutGlobalScopes()->where('organization_id', $organization->id)->where('type', 'DEPARTMENT')->count(),
            'positions_count' => Position::query()->withoutGlobalScopes()->where('organization_id', $organization->id)->count(),
        ];
    }

    private function accessibleOrganizationIds(User $user): array
    {
        return $user->isSuperAdmin()
            ? Organization::query()->pluck('id')->all()
            : $user->availableOrganizations()->pluck('id')->all();
    }

    private function availableUserOptions(Organization $organization): array
    {
        $actor = request()->user();
        abort_unless($actor instanceof User, 403);

        $query = User::query()->orderBy('name');

        if (! $actor->isSuperAdmin() && $this->tenantId()) {
            $query->whereHas('organizations', function ($membershipQuery): void {
                $membershipQuery
                    ->where('organizations.id', $this->tenantId())
                    ->where('organization_user.is_active', true);
            });
        }

        return $query
            ->limit(200)
            ->get(['id', 'name', 'email'])
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_member' => DB::table('organization_user')
                    ->where('organization_id', $organization->id)
                    ->where('user_id', $user->id)
                    ->exists(),
            ])
            ->values()
            ->all();
    }
}
