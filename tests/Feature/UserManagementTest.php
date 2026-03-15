<?php

use App\Models\AuditLog;
use App\Models\Organization;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;

function userManagementOrganization(): Organization
{
    return Organization::query()->firstOrCreate(
        ['slug' => 'user-management-tenant'],
        [
            'name' => 'User Management Tenant',
            'code' => 'USERS',
            'status' => 'ACTIVE',
            'timezone' => 'Africa/Johannesburg',
        ],
    );
}

function grantUserPermissions(User $user, array $permissionNames): Organization
{
    $permissionIds = collect($permissionNames)
        ->map(function (string $name) {
            $module = str($name)->before('.')->toString();

            return Permission::query()->firstOrCreate(
                ['name' => $name],
                [
                    'module' => $module,
                    'label' => str($name)->replace(['.', '_'], ' ')->headline()->toString(),
                    'description' => 'Generated for user management feature coverage.',
                ],
            )->id;
        })
        ->all();

    $role = Role::query()->create([
        'code' => 'USER_TEST_'.str()->upper(str()->random(8)),
        'name' => 'User Test '.str()->upper(str()->random(4)),
        'description' => 'Temporary role for user management feature tests.',
    ]);

    $role->permissions()->sync($permissionIds);
    $organization = userManagementOrganization();

    $user->attachToOrganization($organization);
    $user->syncRoles([$role->id], $organization->id);
    $user->forceFill([
        'current_organization_id' => $organization->id,
    ])->saveQuietly();

    return $organization;
}

test('user show page returns live account and audit data', function () {
    $viewer = User::factory()->create();
    $organization = grantUserPermissions($viewer, ['users.view', 'audit.view']);
    $this->actingAs($viewer);

    $rolePermission = Permission::query()->create([
        'name' => 'employees.view',
        'module' => 'employees',
        'label' => 'View employees',
        'description' => 'Access employee records.',
    ]);

    $targetRole = Role::query()->create([
        'code' => 'TEAM_LEAD',
        'name' => 'Team Lead',
        'description' => 'Team lead role.',
    ]);
    $targetRole->permissions()->sync([$rolePermission->id]);

    $target = User::factory()->create([
        'name' => 'Access Target',
        'email' => 'target@example.com',
        'email_verified_at' => now(),
    ]);
    $target->attachToOrganization($organization);
    $target->syncRoles([$targetRole->id], $organization->id);
    $target->forceFill([
        'current_organization_id' => $organization->id,
    ])->saveQuietly();

    DB::table('employees')->insert([
        'organization_id' => $organization->id,
        'user_id' => $target->id,
        'staff_number' => 'EMP-TEST-001',
        'first_name' => 'Access',
        'surname' => 'Target',
        'status' => 'ACTIVE',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    AuditLog::query()->create([
        'organization_id' => $organization->id,
        'actor_type' => User::class,
        'actor_id' => $target->id,
        'actor_name' => $target->name,
        'event' => 'login',
        'module' => 'auth',
        'description' => 'User logged in successfully.',
        'created_at' => now()->subHour(),
    ]);

    AuditLog::query()->create([
        'organization_id' => $organization->id,
        'auditable_type' => User::class,
        'auditable_id' => $target->id,
        'auditable_label' => $target->name,
        'event' => 'update',
        'module' => 'users',
        'description' => 'Updated user account details.',
        'created_at' => now(),
    ]);

    $this->get("/users/{$target->id}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Users/Show')
            ->where('user.account.reference', sprintf('USR-%06d', $target->id))
            ->where('user.activity.total_events', 2)
            ->where('user.links.audit_logs', "/audit-trail/logs?user_id={$target->id}")
            ->where('user.employee.staff_number', 'EMP-TEST-001')
            ->has('user.all_permissions', 1)
        );
});

test('assigned roles can be revoked from a user', function () {
    $viewer = User::factory()->create();
    $organization = grantUserPermissions($viewer, ['users.assign_roles']);
    $this->actingAs($viewer);

    $role = Role::query()->create([
        'code' => 'REVOCABLE_ROLE',
        'name' => 'Revocable Role',
        'description' => 'Role used for revoke tests.',
    ]);

    $target = User::factory()->create();
    $target->attachToOrganization($organization);
    $target->syncRoles([$role->id], $organization->id);
    $target->forceFill([
        'current_organization_id' => $organization->id,
    ])->saveQuietly();

    $this->delete("/users/{$target->id}/roles/{$role->id}")
        ->assertRedirect();

    expect($target->fresh()->organizationRoles($organization->id)->contains('id', $role->id))->toBeFalse();
    expect(AuditLog::query()->withoutGlobalScopes()->where('event', 'revoke_role')->exists())->toBeTrue();
});
