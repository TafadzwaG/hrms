<?php

use App\Models\Document;
use App\Models\DocumentType;
use App\Models\Employee;
use App\Models\EmployeeJobProfile;
use App\Models\EmployeeKpi;
use App\Models\EmployeeNextOfKin;
use App\Models\EmployeePhysicalProfile;
use App\Models\EmployeeSkill;
use App\Models\Organization;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

function employeeProfileOrganization(): Organization
{
    return Organization::query()->firstOrCreate(
        ['slug' => 'employee-profile-tenant'],
        [
            'name' => 'Employee Profile Tenant',
            'code' => 'EPRO',
            'status' => 'ACTIVE',
            'timezone' => 'Africa/Johannesburg',
        ],
    );
}

function grantEmployeeProfilePermissions(User $user, array $permissionNames): Organization
{
    $permissionIds = collect($permissionNames)
        ->map(function (string $name) {
            $module = str($name)->before('.')->toString();

            return Permission::query()->firstOrCreate(
                ['name' => $name],
                [
                    'module' => $module,
                    'label' => str($name)->replace(['.', '_'], ' ')->headline()->toString(),
                    'description' => 'Generated for employee profile feature coverage.',
                ],
            )->id;
        })
        ->all();

    $role = Role::query()->create([
        'code' => 'EMP_PROFILE_'.str()->upper(str()->random(8)),
        'name' => 'Employee Profile '.str()->upper(str()->random(4)),
        'description' => 'Temporary role for employee profile tests.',
    ]);

    $role->permissions()->sync($permissionIds);
    $organization = employeeProfileOrganization();

    $user->attachToOrganization($organization);
    $user->syncRoles([$role->id], $organization->id);
    $user->forceFill([
        'current_organization_id' => $organization->id,
    ])->saveQuietly();

    return $organization;
}

test('employee show page returns nested live profile data', function () {
    $viewer = User::factory()->create();
    $organization = grantEmployeeProfilePermissions($viewer, [
        'employees.create',
        'employees.view',
        'employees.update',
        'documents.view',
        'users.view',
    ]);
    $this->actingAs($viewer);

    $linkedUser = User::factory()->create([
        'name' => 'John Target',
        'email' => 'john.target@example.com',
    ]);
    $linkedUser->attachToOrganization($organization);
    $linkedUser->forceFill([
        'current_organization_id' => $organization->id,
    ])->saveQuietly();

    $this->post('/employees', [
        'staff_number' => 'EMP-9001',
        'first_name' => 'John',
        'surname' => 'Target',
        'email' => $linkedUser->email,
        'national_id' => '12-345678-A-10',
        'gender' => 'Male',
        'marital_status' => 'Single',
        'contact_number' => '+263700000001',
        'address' => '123 Main Street',
    ])->assertRedirect('/employees');

    $employee = Employee::withoutGlobalScopes()->firstOrFail();
    $employeeId = $employee->id;

    $documentTypeId = DB::table('document_types')->insertGetId([
        'organization_id' => $organization->id,
        'code' => 'CONTRACT',
        'name' => 'Contract',
        'retention_policy' => '7 years',
        'sensitivity_level' => 'HIGH',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    DB::table('documents')->insert([
        'organization_id' => $organization->id,
        'owner_employee_id' => $employeeId,
        'document_type_id' => $documentTypeId,
        'title' => 'Employment Contract',
        'file_uri' => 'contracts/employment-contract.pdf',
        'access_policy' => 'internal',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    EmployeeNextOfKin::query()->create([
        'organization_id' => $organization->id,
        'employee_id' => $employeeId,
        'full_name' => 'Jane Target',
        'relationship' => 'Spouse',
        'contact_number' => '+263700000002',
        'address' => 'Kin Address',
        'is_primary' => true,
    ]);

    EmployeePhysicalProfile::query()->create([
        'organization_id' => $organization->id,
        'employee_id' => $employeeId,
        'uniform_size' => 'L',
        'shoe_size' => '10',
        'blood_type' => 'O+',
    ]);

    EmployeeSkill::query()->create([
        'organization_id' => $organization->id,
        'employee_id' => $employeeId,
        'name' => 'Laravel',
        'proficiency_level' => 'Expert',
        'proficiency_percent' => 92,
    ]);

    EmployeeJobProfile::query()->create([
        'organization_id' => $organization->id,
        'employee_id' => $employeeId,
        'title' => 'Senior Developer',
        'employment_type' => 'Permanent',
        'summary' => 'Owns the internal platform.',
    ]);

    EmployeeKpi::query()->create([
        'organization_id' => $organization->id,
        'employee_id' => $employeeId,
        'title' => 'Release cadence',
        'progress_percent' => 80,
        'status' => 'ON_TRACK',
    ]);

    $this->get("/employees/{$employeeId}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Employees/Show')
            ->where('employee.full_name', 'John Target')
            ->where('employee.documents.0.title', 'Employment Contract')
            ->where('employee.next_of_kin.0.address', 'Kin Address')
            ->where('employee.physical_profile.uniform_size', 'L')
            ->where('employee.skills.0.name', 'Laravel')
            ->where('employee.job_profile.title', 'Senior Developer')
            ->where('employee.kpis.0.title', 'Release cadence')
            ->has('options.document_types', 1)
        );
});

test('employee profile tabs can create related records', function () {
    $viewer = User::factory()->create();
    $organization = grantEmployeeProfilePermissions($viewer, ['employees.create', 'employees.update']);
    $this->actingAs($viewer);

    $this->post('/employees', [
        'staff_number' => 'EMP-9002',
        'first_name' => 'Jane',
        'surname' => 'Tester',
        'national_id' => '12-345678-B-10',
        'gender' => 'Female',
        'marital_status' => 'Married',
    ])->assertRedirect('/employees');

    $employeeId = Employee::withoutGlobalScopes()->value('id');

    $this->post("/employees/{$employeeId}/next-of-kin", [
        'full_name' => 'Primary Contact',
        'relationship' => 'Sibling',
        'contact_number' => '+263700000010',
        'address' => 'Family Home',
        'is_primary' => true,
    ])->assertRedirect();

    $this->post("/employees/{$employeeId}/physical-profile", [
        'uniform_size' => 'M',
        'shoe_size' => '9',
        'blood_type' => 'A+',
    ])->assertRedirect();

    $this->post("/employees/{$employeeId}/skills", [
        'name' => 'React',
        'proficiency_level' => 'Advanced',
        'proficiency_percent' => 88,
    ])->assertRedirect();

    $this->post("/employees/{$employeeId}/job-profile", [
        'title' => 'HR Analyst',
        'employment_type' => 'Permanent',
        'summary' => 'Supports talent operations.',
    ])->assertRedirect();

    $this->post("/employees/{$employeeId}/kpis", [
        'title' => 'Close requisitions',
        'progress_percent' => 55,
        'status' => 'ACTIVE',
    ])->assertRedirect();

    $this->assertDatabaseHas('employee_next_of_kin', [
        'employee_id' => $employeeId,
        'full_name' => 'Primary Contact',
        'address' => 'Family Home',
    ]);
    $this->assertDatabaseHas('employee_physical_profiles', [
        'employee_id' => $employeeId,
        'uniform_size' => 'M',
    ]);
    $this->assertDatabaseHas('employee_skills', [
        'employee_id' => $employeeId,
        'name' => 'React',
    ]);
    $this->assertDatabaseHas('employee_job_profiles', [
        'employee_id' => $employeeId,
        'title' => 'HR Analyst',
    ]);
    $this->assertDatabaseHas('employee_kpis', [
        'employee_id' => $employeeId,
        'title' => 'Close requisitions',
    ]);
});

test('employee documents can be uploaded downloaded and deleted', function () {
    Storage::fake('public');

    $viewer = User::factory()->create();
    $organization = grantEmployeeProfilePermissions($viewer, [
        'employees.create',
        'documents.create',
        'documents.view',
        'documents.delete',
    ]);
    $this->actingAs($viewer);

    $this->post('/employees', [
        'staff_number' => 'EMP-9003',
        'first_name' => 'Document',
        'surname' => 'Owner',
        'national_id' => '12-345678-C-10',
        'gender' => 'Other',
        'marital_status' => 'Single',
    ])->assertRedirect('/employees');

    $employeeId = Employee::withoutGlobalScopes()->value('id');

    $documentTypeId = DB::table('document_types')->insertGetId([
        'organization_id' => $organization->id,
        'code' => 'ID',
        'name' => 'Identity Document',
        'retention_policy' => 'Permanent',
        'sensitivity_level' => 'MEDIUM',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $this->post("/employees/{$employeeId}/documents", [
        'document_type_id' => $documentTypeId,
        'title' => 'Passport Copy',
        'file' => UploadedFile::fake()->create('passport.pdf', 25, 'application/pdf'),
        'access_policy' => 'internal',
    ])->assertRedirect();

    $document = Document::query()->firstOrFail();

    Storage::disk('public')->assertExists($document->file_uri);

    $this->get("/employees/{$employeeId}/documents/{$document->id}/download")
        ->assertOk()
        ->assertDownload('passport.pdf');

    $this->delete("/employees/{$employeeId}/documents/{$document->id}")
        ->assertRedirect();

    $this->assertSoftDeleted('documents', [
        'id' => $document->id,
    ]);
});
