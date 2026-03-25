<?php

use App\Models\Organization;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;

function tenantPermissionRole(Organization $organization, array $permissionNames): Role
{
    $permissionIds = collect($permissionNames)
        ->map(function (string $name) {
            $module = str($name)->before('.')->toString();

            return Permission::query()->firstOrCreate(
                ['name' => $name],
                [
                    'module' => $module,
                    'label' => str($name)->replace(['.', '_'], ' ')->headline()->toString(),
                    'description' => 'Generated for multi-tenant feature coverage.',
                ],
            )->id;
        })
        ->all();

    $role = Role::query()->create([
        'code' => 'TENANT_'.str()->upper(str()->random(8)),
        'name' => 'Tenant Role '.str()->upper(str()->random(4)),
        'description' => 'Temporary tenant-scoped role for feature tests.',
    ]);

    $role->permissions()->sync($permissionIds);

    return $role;
}

function assignTenantRole(User $user, Organization $organization, array $permissionNames): Role
{
    $role = tenantPermissionRole($organization, $permissionNames);

    $user->attachToOrganization($organization);
    $user->syncRoles([$role->id], $organization->id);
    $user->forceFill([
        'current_organization_id' => $organization->id,
    ])->saveQuietly();

    return $role;
}

function createOrganizationRecord(string $name, string $code): Organization
{
    return Organization::query()->create([
        'name' => $name,
        'slug' => str($name)->slug()->toString(),
        'code' => $code,
        'status' => 'ACTIVE',
        'timezone' => 'Africa/Johannesburg',
    ]);
}

function createEmployeeRecord(Organization $organization, string $staffNumber, string $firstName): int
{
    return (int) DB::table('employees')->insertGetId([
        'organization_id' => $organization->id,
        'staff_number' => $staffNumber,
        'first_name' => $firstName,
        'middle_name' => null,
        'surname' => 'Tenant',
        'status' => 'ACTIVE',
        'created_at' => now(),
        'updated_at' => now(),
    ]);
}

test('dashboard resolves and shares the only accessible organization', function () {
    $organization = createOrganizationRecord('Acme Holdings', 'ACME');
    $user = User::factory()->create();

    assignTenantRole($user, $organization, ['dashboard.view']);

    $this->actingAs($user);

    $this->get('/dashboard')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard')
            ->where('tenant.active_organization.id', $organization->id)
            ->where('tenant.organizations.0.id', $organization->id)
        );

    expect(session('current_organization_id'))->toBe($organization->id);
    expect($user->fresh()->current_organization_id)->toBe($organization->id);
});

test('switching organizations changes the visible employee list', function () {
    $organizationA = createOrganizationRecord('Northwind Health', 'NH');
    $organizationB = createOrganizationRecord('Southwind Health', 'SH');
    $user = User::factory()->create();

    $employeeRole = tenantPermissionRole($organizationA, ['employees.view']);

    $user->attachToOrganization($organizationA);
    $user->attachToOrganization($organizationB);
    $user->syncRoles([$employeeRole->id], $organizationA->id);
    $user->syncRoles([$employeeRole->id], $organizationB->id);
    $user->forceFill([
        'current_organization_id' => $organizationA->id,
    ])->saveQuietly();

    createEmployeeRecord($organizationA, 'A-EMP-001', 'Alice');
    createEmployeeRecord($organizationB, 'B-EMP-001', 'Brian');

    $this->actingAs($user);

    $this->get('/employees')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Employees/Index')
            ->has('employees.data', 1)
            ->where('employees.data.0.staff_number', 'A-EMP-001')
        );

    $this->post('/organizations/switch', [
        'organization_id' => $organizationB->id,
        'redirect_to' => '/employees',
    ])->assertRedirect('/employees');

    $this->get('/employees')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Employees/Index')
            ->has('employees.data', 1)
            ->where('employees.data.0.staff_number', 'B-EMP-001')
            ->where('tenant.active_organization.id', $organizationB->id)
        );
});

test('employees index supports server-side sorting', function () {
    $organization = createOrganizationRecord('Sortable Employees', 'SORTEMP');
    $user = User::factory()->create();

    assignTenantRole($user, $organization, ['employees.view']);

    DB::table('employees')->insert([
        [
            'organization_id' => $organization->id,
            'staff_number' => 'EMP-001',
            'first_name' => 'Alpha',
            'surname' => 'Sorter',
            'pay_point' => 'Alpha Point',
            'status' => 'ACTIVE',
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'organization_id' => $organization->id,
            'staff_number' => 'EMP-002',
            'first_name' => 'Zulu',
            'surname' => 'Sorter',
            'pay_point' => 'Zulu Point',
            'status' => 'ACTIVE',
            'created_at' => now(),
            'updated_at' => now(),
        ],
    ]);

    $this->actingAs($user);

    $this->get('/employees?sort=pay_point&direction=desc')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Employees/Index')
            ->where('filters.sort', 'pay_point')
            ->where('filters.direction', 'desc')
            ->where('employees.data.0.pay_point', 'Zulu Point')
        );
});

test('users cannot open an employee record from another organization by url', function () {
    $organizationA = createOrganizationRecord('Alpha Labs', 'ALPHA');
    $organizationB = createOrganizationRecord('Beta Labs', 'BETA');
    $user = User::factory()->create();

    assignTenantRole($user, $organizationA, ['employees.view']);

    createEmployeeRecord($organizationA, 'ALPHA-001', 'Anna');
    $foreignEmployeeId = createEmployeeRecord($organizationB, 'BETA-001', 'Basil');

    $this->actingAs($user);

    $this->get("/employees/{$foreignEmployeeId}")
        ->assertNotFound();
});

test('role summaries are scoped to the active organization', function () {
    $organizationA = createOrganizationRecord('Tenant One', 'TEN1');
    $organizationB = createOrganizationRecord('Tenant Two', 'TEN2');

    $viewer = User::factory()->create();
    $viewerRole = assignTenantRole($viewer, $organizationA, ['roles.view']);

    $otherUser = User::factory()->create();
    $otherUser->attachToOrganization($organizationB);
    $otherUser->syncRoles([$viewerRole->id], $organizationB->id);

    $this->actingAs($viewer);

    $this->get('/roles')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Roles/Index')
            ->where('stats.users_with_roles', 1)
        );
});

test('roles index supports server-side sorting', function () {
    $organization = createOrganizationRecord('Sortable Roles', 'SORTROLE');
    $viewer = User::factory()->create();

    assignTenantRole($viewer, $organization, ['roles.view']);

    $lowRole = Role::query()->create([
        'code' => 'LOW_SORT_ROLE',
        'name' => 'Low Sort Role',
        'description' => 'Role with limited coverage.',
    ]);
    $highRole = Role::query()->create([
        'code' => 'HIGH_SORT_ROLE',
        'name' => 'High Sort Role',
        'description' => 'Role with broad coverage.',
    ]);

    $lowPermission = Permission::query()->firstOrCreate(
        ['name' => 'roles.low.sort'],
        ['module' => 'roles', 'label' => 'Low Sort', 'description' => 'Low sort permission.'],
    );

    $highPermissions = collect(range(1, 4))->map(function (int $index) {
        return Permission::query()->firstOrCreate(
            ['name' => "roles.high.sort.{$index}"],
            ['module' => 'roles', 'label' => "High Sort {$index}", 'description' => 'High sort permission.'],
        )->id;
    })->all();

    $lowRole->permissions()->sync([$lowPermission->id]);
    $highRole->permissions()->sync($highPermissions);

    $this->actingAs($viewer);

    $this->get('/roles?sort=permissions_count&direction=desc')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Roles/Index')
            ->where('filters.sort', 'permissions_count')
            ->where('filters.direction', 'desc')
            ->where('roles.data.0.code', 'HIGH_SORT_ROLE')
        );
});

test('tenant-scoped user index only queries active organization memberships', function () {
    $organizationA = createOrganizationRecord('Users Tenant One', 'UTO');
    $organizationB = createOrganizationRecord('Users Tenant Two', 'UTT');

    $viewer = User::factory()->create([
        'name' => 'Zulu Viewer',
        'email' => 'zulu-viewer@example.com',
    ]);
    assignTenantRole($viewer, $organizationA, ['users.view']);

    $visibleUser = User::factory()->create([
        'name' => 'Alpha Visible User',
        'email' => 'visible-tenant-user@example.com',
    ]);
    $visibleUser->attachToOrganization($organizationA);

    $hiddenUser = User::factory()->create([
        'name' => 'Hidden Tenant User',
        'email' => 'hidden-tenant-user@example.com',
    ]);
    $hiddenUser->attachToOrganization($organizationB);

    $this->actingAs($viewer);

    $this->get('/users')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Users/Index')
            ->where('users.data.0.email', 'visible-tenant-user@example.com')
        );
});

test('organization members page loads using active tenant memberships', function () {
    $organization = createOrganizationRecord('Members Tenant', 'MEM');

    $viewer = User::factory()->create();
    assignTenantRole($viewer, $organization, ['organizations.view', 'organizations.manage_members']);

    $member = User::factory()->create([
        'name' => 'Organization Member',
        'email' => 'organization-member@example.com',
    ]);
    $member->attachToOrganization($organization);

    $this->actingAs($viewer);

    $this->get("/organizations/{$organization->id}/members")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Organizations/Members')
            ->where('organization.id', $organization->id)
        );
});
