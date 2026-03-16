<?php

use App\Models\Employee;
use App\Models\EmployeeContract;
use App\Models\Organization;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

function contractOrganization(): Organization
{
    return Organization::query()->firstOrCreate(
        ['slug' => 'contract-test-tenant'],
        [
            'name' => 'Contract Test Tenant',
            'code' => 'CTEST',
            'status' => 'ACTIVE',
            'timezone' => 'Africa/Johannesburg',
        ],
    );
}

function grantContractPermissions(User $user, array $permissionNames): Organization
{
    $permissionIds = collect($permissionNames)
        ->map(function (string $name) {
            $module = str($name)->before('.')->toString();

            return Permission::query()->firstOrCreate(
                ['name' => $name],
                [
                    'module' => $module,
                    'label' => str($name)->replace(['.', '_'], ' ')->headline()->toString(),
                    'description' => 'Generated for contract feature coverage.',
                ],
            )->id;
        })
        ->all();

    $role = Role::query()->create([
        'code' => 'CONTRACT_'.str()->upper(str()->random(8)),
        'name' => 'Contract '.str()->upper(str()->random(4)),
        'description' => 'Temporary role for contract tests.',
    ]);

    $role->permissions()->sync($permissionIds);
    $organization = contractOrganization();

    $user->attachToOrganization($organization);
    $user->syncRoles([$role->id], $organization->id);
    $user->forceFill([
        'current_organization_id' => $organization->id,
    ])->saveQuietly();

    return $organization;
}

function createTestEmployee(Organization $organization): Employee
{
    return Employee::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'staff_number' => 'CON-'.str()->random(6),
        'first_name' => 'Contract',
        'surname' => 'Employee',
        'contact_number' => '+263700000001',
        'address' => '1 Test Lane',
        'national_id' => 'NID-'.str()->random(8),
        'gender' => 'Male',
        'marital_status' => 'Single',
    ]);
}

test('contract index page loads for authorized user', function () {
    $user = User::factory()->create();
    $org = grantContractPermissions($user, ['employees.view', 'contracts.view']);
    $employee = createTestEmployee($org);

    $this->actingAs($user)
        ->get("/employees/{$employee->id}/contracts")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('EmployeeContracts/Index')
            ->has('employee')
            ->has('contracts')
        );
});

test('contract create page loads for authorized user', function () {
    $user = User::factory()->create();
    $org = grantContractPermissions($user, ['employees.view', 'contracts.create']);
    $employee = createTestEmployee($org);

    $this->actingAs($user)
        ->get("/employees/{$employee->id}/contracts/create")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('EmployeeContracts/Create')
            ->has('employee')
            ->has('options')
        );
});

test('can create a contract', function () {
    $user = User::factory()->create();
    $org = grantContractPermissions($user, ['employees.view', 'contracts.create']);
    $employee = createTestEmployee($org);

    $this->actingAs($user)
        ->post("/employees/{$employee->id}/contracts", [
            'contract_number' => 'CON-2026-001',
            'contract_type' => 'permanent',
            'status' => 'draft',
            'start_date' => '2026-01-01',
            'is_current' => false,
        ])
        ->assertRedirect("/employees/{$employee->id}/contracts");

    $this->assertDatabaseHas('employee_contracts', [
        'employee_id' => $employee->id,
        'contract_number' => 'CON-2026-001',
        'contract_type' => 'permanent',
        'status' => 'draft',
    ]);
});

test('fixed term contract requires end date', function () {
    $user = User::factory()->create();
    $org = grantContractPermissions($user, ['employees.view', 'contracts.create']);
    $employee = createTestEmployee($org);

    $this->actingAs($user)
        ->post("/employees/{$employee->id}/contracts", [
            'contract_number' => 'CON-FT-001',
            'contract_type' => 'fixed_term',
            'status' => 'draft',
            'start_date' => '2026-01-01',
        ])
        ->assertSessionHasErrors('end_date');
});

test('only one contract can be current per employee', function () {
    $user = User::factory()->create();
    $org = grantContractPermissions($user, ['employees.view', 'contracts.create']);
    $employee = createTestEmployee($org);

    // Create first current contract
    EmployeeContract::withoutGlobalScopes()->create([
        'employee_id' => $employee->id,
        'organization_id' => $org->id,
        'contract_number' => 'CON-OLD-001',
        'contract_type' => 'permanent',
        'status' => 'active',
        'start_date' => '2025-01-01',
        'is_current' => true,
        'created_by' => $user->id,
        'updated_by' => $user->id,
    ]);

    // Create second contract as current
    $this->actingAs($user)
        ->post("/employees/{$employee->id}/contracts", [
            'contract_number' => 'CON-NEW-001',
            'contract_type' => 'permanent',
            'status' => 'active',
            'start_date' => '2026-01-01',
            'is_current' => true,
        ])
        ->assertRedirect();

    // Old contract should no longer be current
    $oldContract = EmployeeContract::withoutGlobalScopes()
        ->where('contract_number', 'CON-OLD-001')
        ->first();
    expect($oldContract->is_current)->toBeFalse();

    // New contract should be current
    $newContract = EmployeeContract::withoutGlobalScopes()
        ->where('contract_number', 'CON-NEW-001')
        ->first();
    expect($newContract->is_current)->toBeTrue();
});

test('can update a contract', function () {
    $user = User::factory()->create();
    $org = grantContractPermissions($user, ['employees.view', 'contracts.update']);
    $employee = createTestEmployee($org);

    $contract = EmployeeContract::withoutGlobalScopes()->create([
        'employee_id' => $employee->id,
        'organization_id' => $org->id,
        'contract_number' => 'CON-UPD-001',
        'contract_type' => 'permanent',
        'status' => 'draft',
        'start_date' => '2026-01-01',
        'is_current' => false,
    ]);

    $this->actingAs($user)
        ->put("/employees/{$employee->id}/contracts/{$contract->id}", [
            'contract_number' => 'CON-UPD-001',
            'contract_type' => 'permanent',
            'status' => 'active',
            'start_date' => '2026-02-01',
            'is_current' => true,
        ])
        ->assertRedirect();

    $contract->refresh();
    expect($contract->status)->toBe('active');
    expect($contract->is_current)->toBeTrue();
    expect($contract->start_date->toDateString())->toBe('2026-02-01');
});

test('can activate a contract', function () {
    $user = User::factory()->create();
    $org = grantContractPermissions($user, ['employees.view', 'contracts.activate']);
    $employee = createTestEmployee($org);

    $contract = EmployeeContract::withoutGlobalScopes()->create([
        'employee_id' => $employee->id,
        'organization_id' => $org->id,
        'contract_number' => 'CON-ACT-001',
        'contract_type' => 'permanent',
        'status' => 'draft',
        'start_date' => '2026-01-01',
        'is_current' => false,
    ]);

    $this->actingAs($user)
        ->post("/employees/{$employee->id}/contracts/{$contract->id}/activate")
        ->assertRedirect();

    $contract->refresh();
    expect($contract->is_current)->toBeTrue();
    expect($contract->status)->toBe('active');
});

test('can terminate a contract', function () {
    $user = User::factory()->create();
    $org = grantContractPermissions($user, ['employees.view', 'contracts.terminate']);
    $employee = createTestEmployee($org);

    $contract = EmployeeContract::withoutGlobalScopes()->create([
        'employee_id' => $employee->id,
        'organization_id' => $org->id,
        'contract_number' => 'CON-TERM-001',
        'contract_type' => 'permanent',
        'status' => 'active',
        'start_date' => '2026-01-01',
        'is_current' => true,
    ]);

    $this->actingAs($user)
        ->post("/employees/{$employee->id}/contracts/{$contract->id}/terminate", [
            'termination_reason' => 'End of engagement',
        ])
        ->assertRedirect();

    $contract->refresh();
    expect($contract->status)->toBe('terminated');
    expect($contract->is_current)->toBeFalse();
    expect($contract->terminated_at)->not->toBeNull();
    expect($contract->termination_reason)->toBe('End of engagement');
});

test('can delete a contract', function () {
    $user = User::factory()->create();
    $org = grantContractPermissions($user, ['employees.view', 'contracts.delete']);
    $employee = createTestEmployee($org);

    $contract = EmployeeContract::withoutGlobalScopes()->create([
        'employee_id' => $employee->id,
        'organization_id' => $org->id,
        'contract_number' => 'CON-DEL-001',
        'contract_type' => 'temporary',
        'status' => 'draft',
        'start_date' => '2026-01-01',
        'is_current' => false,
    ]);

    $this->actingAs($user)
        ->delete("/employees/{$employee->id}/contracts/{$contract->id}")
        ->assertRedirect();

    $this->assertDatabaseMissing('employee_contracts', ['id' => $contract->id]);
});

test('can upload and download contract document', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $org = grantContractPermissions($user, ['employees.view', 'contracts.view', 'contracts.documents.manage']);
    $employee = createTestEmployee($org);

    $contract = EmployeeContract::withoutGlobalScopes()->create([
        'employee_id' => $employee->id,
        'organization_id' => $org->id,
        'contract_number' => 'CON-DOC-001',
        'contract_type' => 'permanent',
        'status' => 'active',
        'start_date' => '2026-01-01',
        'is_current' => true,
    ]);

    $file = UploadedFile::fake()->create('contract.pdf', 1024, 'application/pdf');

    $this->actingAs($user)
        ->post("/employees/{$employee->id}/contracts/{$contract->id}/documents", [
            'file' => $file,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('contract_documents', [
        'employee_contract_id' => $contract->id,
        'file_name' => 'contract.pdf',
    ]);

    $document = $contract->documents()->first();

    $this->actingAs($user)
        ->get("/employees/{$employee->id}/contracts/{$contract->id}/documents/{$document->id}/download")
        ->assertOk();
});

test('contract show page includes documents', function () {
    $user = User::factory()->create();
    $org = grantContractPermissions($user, ['employees.view', 'contracts.view']);
    $employee = createTestEmployee($org);

    $contract = EmployeeContract::withoutGlobalScopes()->create([
        'employee_id' => $employee->id,
        'organization_id' => $org->id,
        'contract_number' => 'CON-SHOW-001',
        'contract_type' => 'permanent',
        'status' => 'active',
        'start_date' => '2026-01-01',
        'is_current' => true,
    ]);

    $this->actingAs($user)
        ->get("/employees/{$employee->id}/contracts/{$contract->id}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('EmployeeContracts/Show')
            ->has('employee')
            ->has('contract')
        );
});

test('employee show page includes contract data', function () {
    $user = User::factory()->create();
    $org = grantContractPermissions($user, [
        'employees.view',
        'contracts.view',
        'documents.view',
        'users.view',
    ]);
    $employee = createTestEmployee($org);

    EmployeeContract::withoutGlobalScopes()->create([
        'employee_id' => $employee->id,
        'organization_id' => $org->id,
        'contract_number' => 'CON-EMPSHOW-001',
        'contract_type' => 'permanent',
        'status' => 'active',
        'start_date' => '2026-01-01',
        'is_current' => true,
    ]);

    $this->actingAs($user)
        ->get("/employees/{$employee->id}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Employees/Show')
            ->has('employee.current_contract')
            ->has('employee.contracts', 1)
            ->where('employee.stats.contracts_count', 1)
        );
});

test('unauthorized user cannot access contract pages', function () {
    $user = User::factory()->create();
    $org = grantContractPermissions($user, ['employees.view']);
    $employee = createTestEmployee($org);

    $this->actingAs($user)
        ->get("/employees/{$employee->id}/contracts")
        ->assertForbidden();

    $this->actingAs($user)
        ->get("/employees/{$employee->id}/contracts/create")
        ->assertForbidden();
});

test('contract number is unique per organization', function () {
    $user = User::factory()->create();
    $org = grantContractPermissions($user, ['employees.view', 'contracts.create']);
    $employee = createTestEmployee($org);

    EmployeeContract::withoutGlobalScopes()->create([
        'employee_id' => $employee->id,
        'organization_id' => $org->id,
        'contract_number' => 'UNIQUE-001',
        'contract_type' => 'permanent',
        'status' => 'active',
        'start_date' => '2026-01-01',
        'is_current' => false,
    ]);

    $this->actingAs($user)
        ->post("/employees/{$employee->id}/contracts", [
            'contract_number' => 'UNIQUE-001',
            'contract_type' => 'temporary',
            'status' => 'draft',
            'start_date' => '2026-06-01',
        ])
        ->assertSessionHasErrors('contract_number');
});
