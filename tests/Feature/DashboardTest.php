<?php

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));

    $response->assertRedirect(route('login'));
});

test('users without elevated roles see the employee dashboard variant', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $this->actingAs($user);

    $response = $this->get(route('dashboard'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard')
            ->where('dashboard.variant', 'employee')
            ->where('dashboard.profile.title', 'Employee')
            ->has('dashboard.metrics')
            ->has('dashboard.quick_actions')
            ->has('dashboard.charts')
            ->has('dashboard.lists')
        );
});

test('manager role resolves to the manager dashboard variant', function () {
    $managerRole = Role::query()->create([
        'code' => 'MANAGER',
        'name' => 'Manager',
        'description' => 'Manager role',
    ]);

    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $user->syncRoles([$managerRole->id]);

    $this->actingAs($user);

    $response = $this->get(route('dashboard'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('dashboard.variant', 'manager')
            ->where('dashboard.profile.title', 'Manager')
            ->has('dashboard.focus_cards', 3)
        );
});

test('payroll role resolves to the payroll dashboard variant', function () {
    $role = Role::query()->create([
        'code' => 'PAYROLL',
        'name' => 'Payroll',
        'description' => 'Payroll role',
    ]);

    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $user->syncRoles([$role->id]);

    $this->actingAs($user);

    $response = $this->get(route('dashboard'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('dashboard.variant', 'payroll')
            ->where('dashboard.profile.title', 'Payroll Officer')
            ->has('dashboard.shortcuts')
        );
});

test('system admin role resolves to the system admin dashboard variant', function () {
    $role = Role::query()->create([
        'code' => 'SYS_ADMIN',
        'name' => 'System Administrator',
        'description' => 'System administrator role',
    ]);

    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $user->syncRoles([$role->id]);

    $this->actingAs($user);

    $response = $this->get(route('dashboard'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('dashboard.variant', 'system_admin')
            ->where('dashboard.profile.title', 'System Administrator')
            ->has('dashboard.alerts')
        );
});
