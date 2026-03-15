<?php

use App\Models\Employee;
use App\Models\Organization;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;

function employeeFieldsOrganization(): Organization
{
    return Organization::query()->firstOrCreate(
        ['slug' => 'employee-fields-tenant'],
        [
            'name' => 'Employee Fields Tenant',
            'code' => 'EFLT',
            'status' => 'ACTIVE',
            'timezone' => 'Africa/Johannesburg',
        ],
    );
}

function grantEmployeeFieldPermissions(User $user, array $permissionNames): Organization
{
    $permissionIds = collect($permissionNames)
        ->map(function (string $name) {
            $module = str($name)->before('.')->toString();

            return Permission::query()->firstOrCreate(
                ['name' => $name],
                [
                    'module' => $module,
                    'label' => str($name)->replace(['.', '_'], ' ')->headline()->toString(),
                    'description' => 'Generated for employee field coverage tests.',
                ],
            )->id;
        })
        ->all();

    $role = Role::query()->create([
        'code' => 'EMP_FIELDS_'.str()->upper(str()->random(8)),
        'name' => 'Employee Fields '.str()->upper(str()->random(4)),
        'description' => 'Temporary role for employee field tests.',
    ]);

    $role->permissions()->sync($permissionIds);

    $organization = employeeFieldsOrganization();

    $user->attachToOrganization($organization);
    $user->syncRoles([$role->id], $organization->id);
    $user->forceFill([
        'current_organization_id' => $organization->id,
    ])->saveQuietly();

    return $organization;
}

function employeeFieldPayload(array $overrides = []): array
{
    return array_merge([
        'staff_number' => 'EMP-FIELD-001',
        'first_name' => 'Field',
        'middle_name' => 'Profile',
        'surname' => 'Tester',
        'date_of_birth' => '1992-02-10',
        'email' => 'field.tester@example.com',
        'national_id' => '12-345678-Z-01',
        'gender' => 'Female',
        'occupation' => 'HR Analyst',
        'pay_point' => 'Head Office',
        'contact_number' => '+263771234567',
        'alt_phone_number' => '+263772234567',
        'address' => '123 Main Street, Harare',
        'marital_status' => 'Single',
        'nationality' => 'Zimbabwean',
        'educational_level' => 'Degree',
    ], $overrides);
}

test('employees can be created with the extended profile fields', function () {
    $actor = User::factory()->create();
    grantEmployeeFieldPermissions($actor, ['employees.create', 'employees.view']);
    $this->actingAs($actor);

    $this->post('/employees', employeeFieldPayload())
        ->assertRedirect('/employees');

    $employee = Employee::withoutGlobalScopes()->firstOrFail();
    $employee->load('user');

    expect($employee->national_id)->toBe('12-345678-Z-01')
        ->and($employee->gender)->toBe('Female')
        ->and($employee->occupation)->toBe('HR Analyst')
        ->and($employee->alt_phone_number)->toBe('+263772234567')
        ->and($employee->marital_status)->toBe('Single')
        ->and($employee->nationality)->toBe('Zimbabwean')
        ->and($employee->educational_level)->toBe('Degree')
        ->and($employee->email)->toBe('field.tester@example.com')
        ->and($employee->user?->email)->toBe('field.tester@example.com');
});

test('national id gender and marital status are required for employee create', function () {
    $actor = User::factory()->create();
    grantEmployeeFieldPermissions($actor, ['employees.create']);
    $this->actingAs($actor);

    $this->from('/employees/create')
        ->post('/employees', employeeFieldPayload([
            'national_id' => '',
            'gender' => '',
            'marital_status' => '',
            'email' => '',
        ]))
        ->assertRedirect('/employees/create')
        ->assertSessionHasErrors([
            'national_id',
            'gender',
            'marital_status',
        ]);
});

test('national id must be unique within the active organization', function () {
    $actor = User::factory()->create();
    $organization = grantEmployeeFieldPermissions($actor, ['employees.create']);
    $this->actingAs($actor);

    Employee::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'staff_number' => 'EMP-FIELD-EXISTING',
        'first_name' => 'Existing',
        'surname' => 'Employee',
        'national_id' => '12-345678-Z-01',
        'gender' => 'Male',
        'marital_status' => 'Married',
        'status' => 'ACTIVE',
    ]);

    $this->from('/employees/create')
        ->post('/employees', employeeFieldPayload([
            'staff_number' => 'EMP-FIELD-NEW',
            'email' => '',
        ]))
        ->assertRedirect('/employees/create')
        ->assertSessionHasErrors(['national_id']);
});

test('updating an employee keeps employee and linked user email in sync', function () {
    $actor = User::factory()->create();
    grantEmployeeFieldPermissions($actor, ['employees.create', 'employees.update']);
    $this->actingAs($actor);

    $this->post('/employees', employeeFieldPayload())
        ->assertRedirect('/employees');

    $employee = Employee::withoutGlobalScopes()->with('user')->firstOrFail();

    $this->put("/employees/{$employee->id}", employeeFieldPayload([
        'email' => 'updated.employee@example.com',
        'marital_status' => 'Married',
    ]))->assertRedirect("/employees/{$employee->id}");

    $employee->refresh()->load('user');

    expect($employee->email)->toBe('updated.employee@example.com')
        ->and($employee->user?->email)->toBe('updated.employee@example.com')
        ->and($employee->marital_status)->toBe('Married');
});
