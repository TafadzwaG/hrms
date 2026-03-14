<?php

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Http\Request;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard')
            ->has('dashboard.summary', 6)
            ->has('dashboard.alerts')
            ->has('dashboard.sections')
            ->has('dashboard.modules')
            ->where('dashboard.sections.workforce.title', 'Workforce')
        );
});

test('inertia login flow resolves to a page with a valid url', function () {
    $user = User::factory()->create([
        'email' => 'admin@example.com',
        'password' => 'Password@123',
        'email_verified_at' => now(),
    ]);

    $version = app(HandleInertiaRequests::class)->version(Request::create('/login', 'GET'));

    $loginResponse = $this
        ->withHeaders([
            'X-Inertia' => 'true',
            'X-Inertia-Version' => $version,
            'X-Requested-With' => 'XMLHttpRequest',
        ])
        ->post('/login', [
            'email' => 'admin@example.com',
            'password' => 'Password@123',
        ]);

    $loginResponse->assertRedirect(route('dashboard'));

    $response = $this
        ->withHeaders([
            'X-Inertia' => 'true',
            'X-Inertia-Version' => $version,
            'X-Requested-With' => 'XMLHttpRequest',
        ])
        ->get(route('dashboard'));

    $response
        ->assertOk()
        ->assertHeader('X-Inertia', 'true')
        ->assertJsonPath('component', 'Dashboard')
        ->assertJsonPath('url', '/dashboard');
});

test('unauthorised inertia visits return 403 instead of redirecting into a loop', function () {
    $user = User::factory()->create();
    $this->actingAs($user);
    $version = app(HandleInertiaRequests::class)->version(Request::create(route('control-center.index'), 'GET'));

    $response = $this->withHeaders([
        'X-Inertia' => 'true',
        'X-Inertia-Version' => $version,
        'X-Requested-With' => 'XMLHttpRequest',
    ])->get(route('control-center.index'));

    $response->assertForbidden();
});

test('authenticated users without control center permissions are redirected', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('control-center.index'));

    $response->assertRedirect(route('dashboard'));
});

test('authenticated users with role permissions can open the control center', function () {
    $permission = Permission::query()->create([
        'name' => 'roles.view',
        'module' => 'roles',
        'label' => 'View roles',
        'description' => 'Access roles.',
    ]);

    $role = Role::query()->create([
        'code' => 'CONTROL_CENTER_TEST',
        'name' => 'Control Center Test Role',
        'description' => 'Temporary role for control center access.',
    ]);
    $role->permissions()->sync([$permission->id]);

    $user = User::factory()->create();
    $user->syncRoles([$role->id]);
    $this->actingAs($user);

    $response = $this->get(route('control-center.index'));

    $response->assertOk();
});

test('permission matrix updates role permissions', function () {
    $assignPermission = Permission::query()->create([
        'name' => 'permissions.assign',
        'module' => 'permissions',
        'label' => 'Assign permissions',
        'description' => 'Update matrix assignments.',
    ]);

    $managerPermission = Permission::query()->create([
        'name' => 'employees.view',
        'module' => 'employees',
        'label' => 'View employees',
        'description' => 'Access employee list.',
    ]);

    $adminRole = Role::query()->create([
        'code' => 'MATRIX_ADMIN',
        'name' => 'Matrix Admin',
        'description' => 'Can update permission matrix.',
    ]);
    $adminRole->permissions()->sync([$assignPermission->id]);

    $targetRole = Role::query()->create([
        'code' => 'TEAM_LEAD',
        'name' => 'Team Lead',
        'description' => 'Target role for matrix sync.',
    ]);

    $user = User::factory()->create();
    $user->syncRoles([$adminRole->id]);
    $this->actingAs($user);

    $response = $this->put(route('roles.matrix.update'), [
        'matrix' => [
            [
                'role_id' => $targetRole->id,
                'permission_ids' => [$managerPermission->id],
            ],
        ],
    ]);

    $response->assertRedirect(route('roles.matrix'));
    expect($targetRole->fresh()->permissions()->pluck('permissions.id')->all())->toContain($managerPermission->id);
});

test('permission matrix materialises configured audit permissions before rendering', function () {
    Permission::query()->where('name', 'like', 'audit.%')->delete();

    $viewPermission = Permission::query()->create([
        'name' => 'permissions.view',
        'module' => 'permissions',
        'label' => 'View permissions',
        'description' => 'Access the permission matrix.',
    ]);

    $role = Role::query()->create([
        'code' => 'MATRIX_VIEWER',
        'name' => 'Matrix Viewer',
        'description' => 'Can view the permission matrix.',
    ]);
    $role->permissions()->sync([$viewPermission->id]);

    $user = User::factory()->create();
    $user->syncRoles([$role->id]);
    $this->actingAs($user);

    $version = app(HandleInertiaRequests::class)->version(Request::create(route('roles.matrix'), 'GET'));

    $response = $this->withHeaders([
        'X-Inertia' => 'true',
        'X-Inertia-Version' => $version,
        'X-Requested-With' => 'XMLHttpRequest',
    ])->get(route('roles.matrix'));

    $response
        ->assertOk()
        ->assertJsonPath('component', 'Roles/Matrix');

    expect(Permission::query()->where('name', 'audit.view')->exists())->toBeTrue();
    expect(Permission::query()->where('name', 'audit.export')->exists())->toBeTrue();
    expect(Permission::query()->where('name', 'audit.manage')->exists())->toBeTrue();
    expect(collect($response->json('props.permissionGroups'))->pluck('key')->all())->toContain('audit');
});
