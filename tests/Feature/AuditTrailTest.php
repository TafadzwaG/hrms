<?php

use App\Models\AuditLog;
use App\Models\Employee;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

function grantPermissions(User $user, array $permissionNames): void
{
    $permissionIds = collect($permissionNames)
        ->map(function (string $name) {
            $module = str($name)->before('.')->toString();

            return Permission::query()->firstOrCreate(
                ['name' => $name],
                [
                    'module' => $module,
                    'label' => str($name)->replace(['.', '_'], ' ')->headline()->toString(),
                    'description' => 'Generated for audit trail feature coverage.',
                ],
            )->id;
        })
        ->all();

    $role = Role::query()->create([
        'code' => 'TEST_'.str()->upper(str()->random(8)),
        'name' => 'Test Role '.str()->upper(str()->random(4)),
        'description' => 'Temporary role for feature tests.',
    ]);

    $role->permissions()->sync($permissionIds);
    $user->syncRoles([$role->id]);
}

test('successful logins are written to the audit trail', function () {
    $user = User::factory()->create([
        'email' => 'audit-login@example.com',
        'password' => 'Password@123',
        'email_verified_at' => now(),
    ]);

    $this->post('/login', [
        'email' => 'audit-login@example.com',
        'password' => 'Password@123',
    ])->assertRedirect(route('dashboard'));

    expect(AuditLog::query()
        ->where('event', 'login')
        ->where('actor_id', $user->id)
        ->exists())->toBeTrue();
});

test('failed logins are written to the audit trail', function () {
    User::factory()->create([
        'email' => 'audit-failed@example.com',
        'password' => 'Password@123',
        'email_verified_at' => now(),
    ]);

    $this->from('/login')->post('/login', [
        'email' => 'audit-failed@example.com',
        'password' => 'definitely-not-right',
    ])->assertSessionHasErrors();

    expect(AuditLog::query()->where('event', 'failed_login')->exists())->toBeTrue();
});

test('employee lifecycle changes are audited', function () {
    $user = User::factory()->create();
    grantPermissions($user, ['employees.create', 'employees.update', 'employees.delete']);
    $this->actingAs($user);

    $this->post('/employees', [
        'staff_number' => 'EMP-AUDIT-001',
        'first_name' => 'Audit',
        'surname' => 'Target',
        'date_of_birth' => '1990-01-10',
        'pay_point' => 'HQ',
        'contact_number' => '+263771234567',
        'address' => 'Harare',
    ])->assertRedirect('/employees');

    $employee = Employee::query()->firstOrFail();

    $this->put("/employees/{$employee->id}", [
        'staff_number' => 'EMP-AUDIT-001',
        'first_name' => 'Audit',
        'surname' => 'Updated',
        'date_of_birth' => '1990-01-10',
        'pay_point' => 'HQ',
        'contact_number' => '+263771234567',
        'address' => 'Harare',
    ])->assertRedirect("/employees/{$employee->id}");

    $this->delete("/employees/{$employee->id}")
        ->assertRedirect('/employees');

    expect(AuditLog::query()->where('module', 'employees')->where('event', 'create')->count())->toBe(1);
    expect(AuditLog::query()->where('module', 'employees')->where('event', 'update')->count())->toBe(1);
    expect(AuditLog::query()->where('module', 'employees')->where('event', 'delete')->count())->toBe(1);
});

test('audit trail pages and export are available to authorised users', function () {
    $user = User::factory()->create();
    grantPermissions($user, ['audit.view', 'audit.export']);
    $this->actingAs($user);

    $log = AuditLog::query()->create([
        'event' => 'create',
        'module' => 'employees',
        'category' => 'data',
        'description' => 'Seed audit entry for feature coverage.',
        'actor_name' => $user->name,
        'created_at' => now(),
    ]);

    $this->get('/audit-trail')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('AuditTrail/Index'));

    $this->get('/audit-trail/logs')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('AuditTrail/Logs')
            ->has('logs.data', 1)
        );

    $this->get("/audit-trail/logs/{$log->id}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('AuditTrail/Show')
            ->where('log.id', $log->id)
        );

    $this->get('/audit-trail/logs/export')
        ->assertOk()
        ->assertHeader('content-type', 'text/csv; charset=UTF-8');
});

test('audit trail pages redirect unauthorised users', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->get('/audit-trail')->assertRedirect(route('dashboard'));
});
