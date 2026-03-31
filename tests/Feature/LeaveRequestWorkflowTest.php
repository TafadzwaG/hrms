<?php

use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Models\Organization;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function leaveWorkflowOrganization(): Organization
{
    return Organization::query()->create([
        'name' => 'Leave Workflow Org',
        'slug' => 'leave-workflow-org',
        'code' => 'LWO',
        'status' => 'ACTIVE',
        'timezone' => 'Africa/Johannesburg',
    ]);
}

function leaveWorkflowPermissionIds(array $permissionNames): array
{
    return collect($permissionNames)
        ->map(function (string $name) {
            $module = str($name)->before('.')->toString();

            return Permission::query()->firstOrCreate(
                ['name' => $name],
                [
                    'module' => $module,
                    'label' => str($name)->replace(['.', '_'], ' ')->headline()->toString(),
                    'description' => 'Generated for leave workflow tests.',
                ],
            )->id;
        })
        ->all();
}

function leaveWorkflowUser(string $roleCode, array $permissionNames, Organization $organization): User
{
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $role = Role::query()->firstOrCreate(
        ['code' => $roleCode],
        [
            'name' => str($roleCode)->replace('_', ' ')->headline()->toString(),
            'description' => 'Generated for leave workflow tests.',
        ],
    );

    $role->permissions()->sync(leaveWorkflowPermissionIds($permissionNames));

    $user->attachToOrganization($organization);
    $user->syncRoles([$role->id], $organization->id);
    $user->forceFill([
        'current_organization_id' => $organization->id,
    ])->saveQuietly();

    return $user;
}

function leaveWorkflowEmployee(Organization $organization, ?User $user = null, array $overrides = []): Employee
{
    $sequence = (int) Employee::withoutGlobalScopes()->count() + 1;

    return Employee::withoutGlobalScopes()->create(array_merge([
        'organization_id' => $organization->id,
        'user_id' => $user?->id,
        'staff_number' => 'LW-'.str_pad((string) $sequence, 4, '0', STR_PAD_LEFT),
        'first_name' => 'Leave',
        'surname' => 'Employee '.$sequence,
        'contact_number' => '+2711000000'.$sequence,
        'address' => $sequence.' Workflow Street',
        'national_id' => 'LW-ID-'.$sequence,
        'gender' => 'Male',
        'marital_status' => 'Single',
        'status' => 'ACTIVE',
        'pay_point' => 'Head Office',
    ], $overrides));
}

function leaveWorkflowLeave(Organization $organization, Employee $employee, array $overrides = []): LeaveRequest
{
    $leave = new LeaveRequest(array_merge([
        'employee_id' => $employee->id,
        'leave_type' => 'Annual Leave',
        'start_date' => '2026-03-02',
        'end_date' => '2026-03-04',
        'days' => 3,
        'status' => 'pending',
        'reason' => 'Annual leave',
    ], $overrides));
    $leave->organization_id = $organization->id;
    $leave->save();

    return $leave;
}

test('employee create page preselects the employee and rejects other employee submissions', function () {
    $organization = leaveWorkflowOrganization();
    $user = leaveWorkflowUser('EMPLOYEE', ['leave.view', 'leave.create'], $organization);
    $employee = leaveWorkflowEmployee($organization, $user, ['first_name' => 'Self', 'surname' => 'Employee']);
    $otherEmployee = leaveWorkflowEmployee($organization, null, ['first_name' => 'Other', 'surname' => 'Employee']);

    $this->actingAs($user)
        ->get('/leave-requests/create')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('LeaveRequests/Create')
            ->where('defaultEmployeeId', $employee->id)
            ->where('lockedEmployeeSelection', true)
            ->where('employeeContext.id', $employee->id)
            ->where('scope.mode', 'self')
            ->where('employees.0.id', $employee->id)
        );

    $this->actingAs($user)
        ->post('/leave-requests', [
            'employee_id' => $otherEmployee->id,
            'leave_type' => 'Annual Leave',
            'start_date' => '2026-03-09',
            'end_date' => '2026-03-11',
            'reason' => 'Attempted override',
        ])
        ->assertNotFound();
});

test('employee portal users without explicit RBAC assignments still get self-service leave access', function () {
    $organization = leaveWorkflowOrganization();

    $user = User::factory()->create([
        'email_verified_at' => now(),
        'primary_portal' => 'employee',
        'current_organization_id' => $organization->id,
    ]);

    $user->attachToOrganization($organization);

    $employee = leaveWorkflowEmployee($organization, $user, [
        'first_name' => 'Fallback',
        'surname' => 'Employee',
    ]);

    $this->actingAs($user)
        ->get('/dashboard')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('auth.user.dashboard_role', 'employee')
            ->where('auth.user.employee_id', $employee->id)
            ->where('auth.can', fn ($can) => collect($can)->get('leave.view')
                && collect($can)->get('leave.create')
                && collect($can)->get('employees.view'))
        );

    $this->actingAs($user)
        ->get('/leave-requests/create')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('LeaveRequests/Create')
            ->where('defaultEmployeeId', $employee->id)
            ->where('lockedEmployeeSelection', true)
            ->where('employeeContext.id', $employee->id)
        );
});

test('manager create page defaults to self and can apply for a direct report', function () {
    $organization = leaveWorkflowOrganization();
    $user = leaveWorkflowUser('MANAGER', ['leave.view', 'leave.create'], $organization);
    $manager = leaveWorkflowEmployee($organization, $user, ['first_name' => 'Manager', 'surname' => 'User']);
    $directReport = leaveWorkflowEmployee($organization, null, [
        'first_name' => 'Direct',
        'surname' => 'Report',
        'manager_id' => $manager->id,
    ]);

    $this->actingAs($user)
        ->get('/leave-requests/create')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('LeaveRequests/Create')
            ->where('defaultEmployeeId', $manager->id)
            ->where('lockedEmployeeSelection', false)
            ->where('scope.mode', 'team')
            ->has('employees', 2)
        );

    $this->actingAs($user)
        ->post('/leave-requests', [
            'employee_id' => $directReport->id,
            'leave_type' => 'Annual Leave',
            'start_date' => '2026-03-09',
            'end_date' => '2026-03-11',
            'reason' => 'Manager-created leave request',
        ])
        ->assertRedirect('/leave-requests');

    $created = LeaveRequest::query()->latest('id')->first();

    expect($created)->not->toBeNull();
    expect((int) $created->employee_id)->toBe($directReport->id);
    expect((string) $created->status)->toBe('PENDING');
    expect((float) $created->days)->toBe(3.0);
});

test('manager cannot apply for an employee outside direct reports', function () {
    $organization = leaveWorkflowOrganization();
    $user = leaveWorkflowUser('MANAGER', ['leave.create'], $organization);
    $manager = leaveWorkflowEmployee($organization, $user, ['first_name' => 'Manager', 'surname' => 'Only']);
    $outsideEmployee = leaveWorkflowEmployee($organization, null, [
        'first_name' => 'Outside',
        'surname' => 'Employee',
        'manager_id' => null,
    ]);

    expect($manager->id)->not->toBe($outsideEmployee->id);

    $this->actingAs($user)
        ->post('/leave-requests', [
            'employee_id' => $outsideEmployee->id,
            'leave_type' => 'Annual Leave',
            'start_date' => '2026-03-09',
            'end_date' => '2026-03-11',
            'reason' => 'Should fail',
        ])
        ->assertNotFound();
});

test('leave index returns role scoped stats and calendar data', function () {
    $organization = leaveWorkflowOrganization();
    $user = leaveWorkflowUser('MANAGER', ['leave.view'], $organization);
    $manager = leaveWorkflowEmployee($organization, $user, ['first_name' => 'Scope', 'surname' => 'Manager']);
    $firstReport = leaveWorkflowEmployee($organization, null, [
        'first_name' => 'First',
        'surname' => 'Report',
        'manager_id' => $manager->id,
    ]);
    $secondReport = leaveWorkflowEmployee($organization, null, [
        'first_name' => 'Second',
        'surname' => 'Report',
        'manager_id' => $manager->id,
    ]);
    $outsideEmployee = leaveWorkflowEmployee($organization, null, [
        'first_name' => 'Outside',
        'surname' => 'Scope',
    ]);

    $pending = leaveWorkflowLeave($organization, $firstReport, [
        'status' => 'pending',
        'start_date' => now()->toDateString(),
        'end_date' => now()->addDay()->toDateString(),
        'days' => 2,
    ]);
    $approved = leaveWorkflowLeave($organization, $secondReport, [
        'status' => 'approved',
        'start_date' => '2026-03-18',
        'end_date' => '2026-03-20',
        'days' => 3,
    ]);
    leaveWorkflowLeave($organization, $outsideEmployee, [
        'status' => 'pending',
        'start_date' => '2026-03-18',
        'end_date' => '2026-03-19',
        'days' => 2,
    ]);

    $this->actingAs($user)
        ->get('/leave-requests?month=2026-03')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('LeaveRequests/Index')
            ->where('records.total', 2)
            ->where('stats.total_requests', 2)
            ->where('stats.pending_requests', 1)
            ->where('stats.upcoming_requests', 2)
            ->where('calendar.entry_count', 2)
            ->where('records.data.0.id', $approved->id > $pending->id ? $approved->id : $pending->id)
            ->where('scope.mode', 'team')
        );
});

test('leave edit page renders for scoped records and updates them', function () {
    $organization = leaveWorkflowOrganization();
    $user = leaveWorkflowUser('MANAGER', ['leave.manage'], $organization);
    $manager = leaveWorkflowEmployee($organization, $user, ['first_name' => 'Edit', 'surname' => 'Manager']);
    $directReport = leaveWorkflowEmployee($organization, null, [
        'first_name' => 'Editable',
        'surname' => 'Report',
        'manager_id' => $manager->id,
    ]);
    $leave = leaveWorkflowLeave($organization, $directReport, [
        'status' => 'Changes Requested',
        'reason' => 'Original reason',
    ]);

    $this->actingAs($user)
        ->get("/leave-requests/{$leave->id}/edit")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('LeaveRequests/Edit')
            ->where('record.id', $leave->id)
            ->where('defaultEmployeeId', $directReport->id)
            ->where('employeeContext.id', $directReport->id)
        );

    $this->actingAs($user)
        ->put("/leave-requests/{$leave->id}", [
            'employee_id' => $directReport->id,
            'leave_type' => 'Annual Leave',
            'start_date' => '2026-03-16',
            'end_date' => '2026-03-18',
            'reason' => 'Updated reason',
        ])
        ->assertRedirect("/leave-requests/{$leave->id}");

    $leave->refresh();

    expect((string) $leave->reason)->toBe('Updated reason');
    expect((float) $leave->days)->toBe(3.0);
    expect((string) $leave->status)->toBe('Changes Requested');
});

test('leave index safely falls back when the month query is malformed', function () {
    $organization = leaveWorkflowOrganization();
    $user = leaveWorkflowUser('EMPLOYEE', ['leave.view'], $organization);
    $employee = leaveWorkflowEmployee($organization, $user, ['first_name' => 'Month', 'surname' => 'Fallback']);

    leaveWorkflowLeave($organization, $employee, [
        'status' => 'pending',
        'start_date' => '2026-03-18',
        'end_date' => '2026-03-20',
        'days' => 3,
    ]);

    $this->actingAs($user)
        ->get('/leave-requests?month=2026202620262026-MarMar')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('LeaveRequests/Index')
            ->where('records.total', 1)
            ->where('filters.month', now()->startOfMonth()->format('Y-m'))
            ->where('calendar.month', now()->startOfMonth()->format('Y-m'))
        );
});

test('leave index renders for tenant scoped and readonly roles', function () {
    $organization = leaveWorkflowOrganization();
    $employee = leaveWorkflowEmployee($organization, null, ['first_name' => 'Tenant', 'surname' => 'Visible']);
    $leave = leaveWorkflowLeave($organization, $employee, [
        'status' => 'approved',
        'start_date' => '2026-03-10',
        'end_date' => '2026-03-12',
        'days' => 3,
    ]);

    $expectations = [
        'SYS_ADMIN' => 'tenant',
        'HR_ADMIN' => 'tenant',
        'PAYROLL' => 'tenant',
        'AUDITOR' => 'readonly',
    ];

    foreach ($expectations as $roleCode => $expectedMode) {
        $user = leaveWorkflowUser($roleCode, ['leave.view'], $organization);

        $this->actingAs($user)
            ->get('/leave-requests?month=2026-03')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('LeaveRequests/Index')
                ->where('records.total', 1)
                ->where('records.data.0.id', $leave->id)
                ->where('stats.total_requests', 1)
                ->where('calendar.entry_count', 1)
                ->where('scope.mode', $expectedMode)
            );
    }
});
