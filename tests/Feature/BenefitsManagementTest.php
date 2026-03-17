<?php

use App\Models\Benefit;
use App\Models\BenefitContributionRule;
use App\Models\BenefitDocument;
use App\Models\BenefitPlan;
use App\Models\Employee;
use App\Models\EmployeeBenefitDependant;
use App\Models\EmployeeBenefitEnrollment;
use App\Models\Organization;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

function benefitOrganization(): Organization
{
    return Organization::query()->firstOrCreate(
        ['slug' => 'benefit-test-tenant'],
        [
            'name' => 'Benefit Test Tenant',
            'code' => 'BNTEST',
            'status' => 'ACTIVE',
            'timezone' => 'Africa/Johannesburg',
        ],
    );
}

function grantBenefitPermissions(User $user, array $permissionNames): Organization
{
    $permissionIds = collect($permissionNames)
        ->map(function (string $name) {
            $module = str($name)->before('.')->toString();

            return Permission::query()->firstOrCreate(
                ['name' => $name],
                [
                    'module' => $module,
                    'label' => str($name)->replace(['.', '_'], ' ')->headline()->toString(),
                    'description' => 'Generated for benefit feature coverage.',
                ],
            )->id;
        })
        ->all();

    $role = Role::query()->create([
        'code' => 'BEN_'.str()->upper(str()->random(8)),
        'name' => 'Benefit '.str()->upper(str()->random(4)),
        'description' => 'Temporary role for benefit tests.',
    ]);

    $role->permissions()->sync($permissionIds);
    $organization = benefitOrganization();

    $user->attachToOrganization($organization);
    $user->syncRoles([$role->id], $organization->id);
    $user->forceFill([
        'current_organization_id' => $organization->id,
    ])->saveQuietly();

    return $organization;
}

function createBenefitEmployee(Organization $organization): Employee
{
    return Employee::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'staff_number' => 'BEN-'.str()->random(6),
        'first_name' => 'Benefit',
        'surname' => 'Holder',
        'contact_number' => '+263700000003',
        'address' => '3 Test Lane',
        'national_id' => 'NID-'.str()->random(8),
        'gender' => 'Male',
        'marital_status' => 'Single',
    ]);
}

function createTestBenefit(Organization $organization): Benefit
{
    return Benefit::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'code' => 'BEN-'.str()->random(4),
        'name' => 'Medical Aid',
        'category' => 'health',
        'benefit_type' => 'shared',
        'taxable' => false,
        'cash_benefit' => false,
        'requires_dependants' => true,
        'active' => true,
    ]);
}

function createTestBenefitPlan(Benefit $benefit): BenefitPlan
{
    return BenefitPlan::withoutGlobalScopes()->create([
        'organization_id' => $benefit->organization_id,
        'benefit_id' => $benefit->id,
        'name' => 'Gold Plan',
        'code' => 'GP-'.str()->random(4),
        'active' => true,
        'employer_contribution_type' => 'fixed',
        'employer_contribution_value' => 500.00,
        'employee_contribution_type' => 'fixed',
        'employee_contribution_value' => 200.00,
        'coverage_limit' => 50000.00,
    ]);
}

function createTestEnrollment(Organization $organization, Employee $employee, Benefit $benefit, ?BenefitPlan $plan = null, string $status = 'active'): EmployeeBenefitEnrollment
{
    return EmployeeBenefitEnrollment::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'employee_id' => $employee->id,
        'benefit_id' => $benefit->id,
        'benefit_plan_id' => $plan?->id,
        'status' => $status,
        'effective_date' => '2026-01-01',
        'end_date' => null,
        'employee_contribution' => 200.00,
        'employer_contribution' => 500.00,
        'payroll_deduction_code' => 'MED-001',
    ]);
}

// ── Benefit CRUD ────────────────────────────────────────

test('benefit index page loads for authorized user', function () {
    $user = User::factory()->create();
    $org = grantBenefitPermissions($user, ['benefits.view']);

    $this->actingAs($user)
        ->get('/benefits')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Benefits/Index')
            ->has('benefits')
            ->has('categories')
            ->has('types')
        );
});

test('can create a benefit', function () {
    $user = User::factory()->create();
    grantBenefitPermissions($user, ['benefits.view', 'benefits.create']);

    $this->actingAs($user)
        ->post('/benefits', [
            'name' => 'Retirement Fund',
            'code' => 'RET-001',
            'category' => 'retirement',
            'benefit_type' => 'shared',
            'taxable' => false,
            'active' => true,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('benefits', [
        'name' => 'Retirement Fund',
        'code' => 'RET-001',
        'category' => 'retirement',
    ]);
});

test('can update a benefit', function () {
    $user = User::factory()->create();
    $org = grantBenefitPermissions($user, ['benefits.view', 'benefits.update']);
    $benefit = createTestBenefit($org);

    $this->actingAs($user)
        ->put("/benefits/{$benefit->id}", [
            'name' => 'Updated Medical Aid',
            'category' => 'health',
            'benefit_type' => 'employer_paid',
            'active' => true,
        ])
        ->assertRedirect();

    $benefit->refresh();
    expect($benefit->name)->toBe('Updated Medical Aid');
    expect($benefit->benefit_type)->toBe('employer_paid');
});

test('can delete a benefit without active enrollments', function () {
    $user = User::factory()->create();
    $org = grantBenefitPermissions($user, ['benefits.view', 'benefits.delete']);
    $benefit = createTestBenefit($org);

    $this->actingAs($user)
        ->delete("/benefits/{$benefit->id}")
        ->assertRedirect();

    expect(Benefit::withoutGlobalScopes()->find($benefit->id)->trashed())->toBeTrue();
});

test('benefit cannot be deleted with active enrollments', function () {
    $user = User::factory()->create();
    $org = grantBenefitPermissions($user, ['benefits.view', 'benefits.delete']);
    $benefit = createTestBenefit($org);
    $employee = createBenefitEmployee($org);
    createTestEnrollment($org, $employee, $benefit, null, 'active');

    $this->actingAs($user)
        ->delete("/benefits/{$benefit->id}")
        ->assertRedirect()
        ->assertSessionHas('error');

    expect(Benefit::withoutGlobalScopes()->find($benefit->id)->trashed())->toBeFalse();
});

// ── Benefit Plan CRUD ───────────────────────────────────

test('can create a benefit plan', function () {
    $user = User::factory()->create();
    $org = grantBenefitPermissions($user, ['benefits.view', 'benefits.plans.manage']);
    $benefit = createTestBenefit($org);

    $this->actingAs($user)
        ->post("/benefits/{$benefit->id}/plans", [
            'name' => 'Silver Plan',
            'code' => 'SIL-001',
            'active' => true,
            'employer_contribution_type' => 'fixed',
            'employer_contribution_value' => 300,
            'employee_contribution_type' => 'percentage',
            'employee_contribution_value' => 5,
            'coverage_limit' => 25000,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('benefit_plans', [
        'benefit_id' => $benefit->id,
        'name' => 'Silver Plan',
        'code' => 'SIL-001',
    ]);
});

test('can update a benefit plan', function () {
    $user = User::factory()->create();
    $org = grantBenefitPermissions($user, ['benefits.view', 'benefits.plans.manage']);
    $benefit = createTestBenefit($org);
    $plan = createTestBenefitPlan($benefit);

    $this->actingAs($user)
        ->put("/benefits/{$benefit->id}/plans/{$plan->id}", [
            'name' => 'Platinum Plan',
            'code' => $plan->code,
            'active' => true,
            'employer_contribution_type' => 'fixed',
            'employer_contribution_value' => 800,
            'employee_contribution_type' => 'fixed',
            'employee_contribution_value' => 300,
            'coverage_limit' => 100000,
        ])
        ->assertRedirect();

    $plan->refresh();
    expect($plan->name)->toBe('Platinum Plan');
    expect((float) $plan->employer_contribution_value)->toBe(800.00);
});

test('cannot delete a benefit plan with active enrollments', function () {
    $user = User::factory()->create();
    $org = grantBenefitPermissions($user, ['benefits.view', 'benefits.plans.manage']);
    $benefit = createTestBenefit($org);
    $plan = createTestBenefitPlan($benefit);
    $employee = createBenefitEmployee($org);
    createTestEnrollment($org, $employee, $benefit, $plan, 'active');

    $this->actingAs($user)
        ->delete("/benefits/{$benefit->id}/plans/{$plan->id}")
        ->assertRedirect()
        ->assertSessionHas('error');

    expect(BenefitPlan::withoutGlobalScopes()->find($plan->id))->not->toBeNull();
});

// ── Employee Enrollment CRUD ────────────────────────────

test('can create an employee enrollment', function () {
    $user = User::factory()->create();
    $org = grantBenefitPermissions($user, ['benefits.view', 'benefits.enrollments.manage']);
    $benefit = createTestBenefit($org);
    $plan = createTestBenefitPlan($benefit);
    $employee = createBenefitEmployee($org);

    $this->actingAs($user)
        ->post('/benefit-enrollments', [
            'employee_id' => $employee->id,
            'benefit_id' => $benefit->id,
            'benefit_plan_id' => $plan->id,
            'status' => 'active',
            'effective_date' => '2026-01-01',
            'employee_contribution' => 200,
            'employer_contribution' => 500,
            'payroll_deduction_code' => 'MED-002',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('employee_benefit_enrollments', [
        'employee_id' => $employee->id,
        'benefit_id' => $benefit->id,
        'status' => 'active',
    ]);

    // Verify change log was recorded
    $this->assertDatabaseHas('benefit_change_logs', [
        'event' => 'enrolled',
        'to_status' => 'active',
    ]);
});

test('can update an employee enrollment', function () {
    $user = User::factory()->create();
    $org = grantBenefitPermissions($user, ['benefits.view', 'benefits.enrollments.manage']);
    $benefit = createTestBenefit($org);
    $employee = createBenefitEmployee($org);
    $enrollment = createTestEnrollment($org, $employee, $benefit);

    $this->actingAs($user)
        ->put("/benefit-enrollments/{$enrollment->id}", [
            'employee_id' => $employee->id,
            'benefit_id' => $benefit->id,
            'status' => 'active',
            'effective_date' => '2026-02-01',
            'employee_contribution' => 250,
            'employer_contribution' => 600,
            'payroll_deduction_code' => 'MED-003',
        ])
        ->assertRedirect();

    $enrollment->refresh();
    expect((float) $enrollment->employee_contribution)->toBe(250.00);
    expect((float) $enrollment->employer_contribution)->toBe(600.00);
});

// ── Enrollment Suspend / Terminate / Reinstate Workflow ─

test('can suspend an enrollment', function () {
    $user = User::factory()->create();
    $org = grantBenefitPermissions($user, ['benefits.view', 'benefits.enrollments.manage']);
    $benefit = createTestBenefit($org);
    $employee = createBenefitEmployee($org);
    $enrollment = createTestEnrollment($org, $employee, $benefit, null, 'active');

    $this->actingAs($user)
        ->post("/benefit-enrollments/{$enrollment->id}/suspend", [
            'reason' => 'Employee on unpaid leave.',
        ])
        ->assertRedirect();

    expect($enrollment->fresh()->status)->toBe('suspended');

    $this->assertDatabaseHas('benefit_change_logs', [
        'employee_benefit_enrollment_id' => $enrollment->id,
        'event' => 'suspended',
        'from_status' => 'active',
        'to_status' => 'suspended',
    ]);
});

test('can terminate an enrollment', function () {
    $user = User::factory()->create();
    $org = grantBenefitPermissions($user, ['benefits.view', 'benefits.enrollments.manage']);
    $benefit = createTestBenefit($org);
    $employee = createBenefitEmployee($org);
    $enrollment = createTestEnrollment($org, $employee, $benefit, null, 'active');

    $this->actingAs($user)
        ->post("/benefit-enrollments/{$enrollment->id}/terminate", [
            'reason' => 'Employee resigned.',
        ])
        ->assertRedirect();

    $fresh = $enrollment->fresh();
    expect($fresh->status)->toBe('terminated');
    expect($fresh->end_date)->not->toBeNull();

    $this->assertDatabaseHas('benefit_change_logs', [
        'employee_benefit_enrollment_id' => $enrollment->id,
        'event' => 'terminated',
        'to_status' => 'terminated',
    ]);
});

test('can reinstate a suspended enrollment', function () {
    $user = User::factory()->create();
    $org = grantBenefitPermissions($user, ['benefits.view', 'benefits.enrollments.manage']);
    $benefit = createTestBenefit($org);
    $employee = createBenefitEmployee($org);
    $enrollment = createTestEnrollment($org, $employee, $benefit, null, 'suspended');

    $this->actingAs($user)
        ->post("/benefit-enrollments/{$enrollment->id}/reinstate", [
            'reason' => 'Employee returned from leave.',
        ])
        ->assertRedirect();

    $fresh = $enrollment->fresh();
    expect($fresh->status)->toBe('active');
    expect($fresh->end_date)->toBeNull();

    $this->assertDatabaseHas('benefit_change_logs', [
        'employee_benefit_enrollment_id' => $enrollment->id,
        'event' => 'reinstated',
        'from_status' => 'suspended',
        'to_status' => 'active',
    ]);
});

// ── Dependant CRUD ──────────────────────────────────────

test('can add a dependant to an enrollment', function () {
    $user = User::factory()->create();
    $org = grantBenefitPermissions($user, ['benefits.view', 'benefits.dependants.manage']);
    $benefit = createTestBenefit($org);
    $employee = createBenefitEmployee($org);
    $enrollment = createTestEnrollment($org, $employee, $benefit);

    $this->actingAs($user)
        ->post("/benefit-enrollments/{$enrollment->id}/dependants", [
            'full_name' => 'Jane Holder',
            'relationship' => 'spouse',
            'date_of_birth' => '1990-05-15',
            'national_id' => 'SP-123456',
            'status' => 'active',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('employee_benefit_dependants', [
        'employee_benefit_enrollment_id' => $enrollment->id,
        'full_name' => 'Jane Holder',
        'relationship' => 'spouse',
    ]);
});

test('can update a dependant', function () {
    $user = User::factory()->create();
    $org = grantBenefitPermissions($user, ['benefits.view', 'benefits.dependants.manage']);
    $benefit = createTestBenefit($org);
    $employee = createBenefitEmployee($org);
    $enrollment = createTestEnrollment($org, $employee, $benefit);

    $dependant = EmployeeBenefitDependant::withoutGlobalScopes()->create([
        'organization_id' => $org->id,
        'employee_benefit_enrollment_id' => $enrollment->id,
        'full_name' => 'Jane Holder',
        'relationship' => 'spouse',
        'status' => 'active',
    ]);

    $this->actingAs($user)
        ->put("/benefit-enrollments/{$enrollment->id}/dependants/{$dependant->id}", [
            'full_name' => 'Jane Smith-Holder',
            'relationship' => 'spouse',
            'status' => 'active',
        ])
        ->assertRedirect();

    expect($dependant->fresh()->full_name)->toBe('Jane Smith-Holder');
});

test('can delete a dependant', function () {
    $user = User::factory()->create();
    $org = grantBenefitPermissions($user, ['benefits.view', 'benefits.dependants.manage']);
    $benefit = createTestBenefit($org);
    $employee = createBenefitEmployee($org);
    $enrollment = createTestEnrollment($org, $employee, $benefit);

    $dependant = EmployeeBenefitDependant::withoutGlobalScopes()->create([
        'organization_id' => $org->id,
        'employee_benefit_enrollment_id' => $enrollment->id,
        'full_name' => 'Jane Holder',
        'relationship' => 'spouse',
        'status' => 'active',
    ]);

    $this->actingAs($user)
        ->delete("/benefit-enrollments/{$enrollment->id}/dependants/{$dependant->id}")
        ->assertRedirect();

    expect(EmployeeBenefitDependant::withoutGlobalScopes()->find($dependant->id))->toBeNull();
});

// ── Document Upload / Download ──────────────────────────

test('can upload and download enrollment document', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $org = grantBenefitPermissions($user, ['benefits.view', 'benefits.documents.manage']);
    $benefit = createTestBenefit($org);
    $employee = createBenefitEmployee($org);
    $enrollment = createTestEnrollment($org, $employee, $benefit);

    $file = UploadedFile::fake()->create('policy.pdf', 1024, 'application/pdf');

    $this->actingAs($user)
        ->post("/benefit-enrollments/{$enrollment->id}/documents", [
            'file' => $file,
            'document_type' => 'policy',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('benefit_documents', [
        'employee_benefit_enrollment_id' => $enrollment->id,
        'file_name' => 'policy.pdf',
        'document_type' => 'policy',
    ]);

    $document = BenefitDocument::withoutGlobalScopes()
        ->where('employee_benefit_enrollment_id', $enrollment->id)
        ->first();

    $this->actingAs($user)
        ->get("/benefit-enrollments/{$enrollment->id}/documents/{$document->id}/download")
        ->assertOk();
});

// ── Contribution Rule CRUD ──────────────────────────────

test('can create a contribution rule', function () {
    $user = User::factory()->create();
    $org = grantBenefitPermissions($user, ['benefits.view', 'benefits.update']);
    $benefit = createTestBenefit($org);

    $this->actingAs($user)
        ->post("/benefits/{$benefit->id}/contribution-rules", [
            'rule_name' => 'Standard Rate',
            'contribution_basis' => 'basic_salary',
            'employer_contribution_type' => 'percentage',
            'employer_contribution_value' => 10,
            'employee_contribution_type' => 'percentage',
            'employee_contribution_value' => 5,
            'active' => true,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('benefit_contribution_rules', [
        'benefit_id' => $benefit->id,
        'rule_name' => 'Standard Rate',
        'contribution_basis' => 'basic_salary',
    ]);
});

test('can update a contribution rule', function () {
    $user = User::factory()->create();
    $org = grantBenefitPermissions($user, ['benefits.view', 'benefits.update']);
    $benefit = createTestBenefit($org);

    $rule = BenefitContributionRule::withoutGlobalScopes()->create([
        'organization_id' => $org->id,
        'benefit_id' => $benefit->id,
        'rule_name' => 'Standard Rate',
        'contribution_basis' => 'basic_salary',
        'employer_contribution_type' => 'percentage',
        'employer_contribution_value' => 10,
        'employee_contribution_type' => 'percentage',
        'employee_contribution_value' => 5,
        'active' => true,
    ]);

    $this->actingAs($user)
        ->put("/benefits/{$benefit->id}/contribution-rules/{$rule->id}", [
            'rule_name' => 'Updated Rate',
            'contribution_basis' => 'gross_salary',
            'employer_contribution_type' => 'fixed',
            'employer_contribution_value' => 1000,
            'employee_contribution_type' => 'fixed',
            'employee_contribution_value' => 500,
            'active' => true,
        ])
        ->assertRedirect();

    $rule->refresh();
    expect($rule->rule_name)->toBe('Updated Rate');
    expect($rule->contribution_basis)->toBe('gross_salary');
});

test('can delete a contribution rule', function () {
    $user = User::factory()->create();
    $org = grantBenefitPermissions($user, ['benefits.view', 'benefits.update']);
    $benefit = createTestBenefit($org);

    $rule = BenefitContributionRule::withoutGlobalScopes()->create([
        'organization_id' => $org->id,
        'benefit_id' => $benefit->id,
        'rule_name' => 'Temporary Rate',
        'contribution_basis' => 'basic_salary',
        'employer_contribution_type' => 'fixed',
        'employer_contribution_value' => 100,
        'employee_contribution_type' => 'fixed',
        'employee_contribution_value' => 50,
        'active' => true,
    ]);

    $this->actingAs($user)
        ->delete("/benefits/{$benefit->id}/contribution-rules/{$rule->id}")
        ->assertRedirect();

    expect(BenefitContributionRule::withoutGlobalScopes()->find($rule->id))->toBeNull();
});

// ── Authorization ───────────────────────────────────────

test('unauthenticated user is redirected from benefits pages', function () {
    $this->get('/benefits')->assertRedirect();
    $this->get('/benefit-enrollments')->assertRedirect();
    $this->get('/benefits/dashboard')->assertRedirect();
});

test('unauthorized user cannot access benefits pages', function () {
    $user = User::factory()->create();
    grantBenefitPermissions($user, ['employees.view']);

    $this->actingAs($user)
        ->get('/benefits')
        ->assertForbidden();

    $this->actingAs($user)
        ->get('/benefits/create')
        ->assertForbidden();
});

// ── Employee Show Page Integration ──────────────────────

test('employee show page includes benefit enrollments', function () {
    $user = User::factory()->create();
    $org = grantBenefitPermissions($user, ['employees.view', 'benefits.view']);
    $employee = createBenefitEmployee($org);
    $benefit = createTestBenefit($org);
    createTestEnrollment($org, $employee, $benefit);

    $this->actingAs($user)
        ->get("/employees/{$employee->id}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Employees/Show')
            ->has('employee.benefit_enrollments')
        );
});

// ── Dashboard ───────────────────────────────────────────

test('benefit dashboard loads for authorized user', function () {
    $user = User::factory()->create();
    grantBenefitPermissions($user, ['benefits.view']);

    $this->actingAs($user)
        ->get('/benefits/dashboard')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Benefits/Dashboard')
            ->has('metrics')
            ->has('enrollmentsByCategory')
            ->has('enrollmentsByStatus')
        );
});

// ── Reports ─────────────────────────────────────────────

test('benefit register report loads', function () {
    $user = User::factory()->create();
    grantBenefitPermissions($user, ['reports.view']);

    $this->actingAs($user)
        ->get('/reports/benefits/register')
        ->assertOk();
});

test('active enrollments report loads', function () {
    $user = User::factory()->create();
    grantBenefitPermissions($user, ['reports.view']);

    $this->actingAs($user)
        ->get('/reports/benefits/active-enrollments')
        ->assertOk();
});

test('enrollments by department report loads', function () {
    $user = User::factory()->create();
    grantBenefitPermissions($user, ['reports.view']);

    $this->actingAs($user)
        ->get('/reports/benefits/by-department')
        ->assertOk();
});

test('employer contributions report loads', function () {
    $user = User::factory()->create();
    grantBenefitPermissions($user, ['reports.view']);

    $this->actingAs($user)
        ->get('/reports/benefits/employer-contributions')
        ->assertOk();
});

test('employee contributions report loads', function () {
    $user = User::factory()->create();
    grantBenefitPermissions($user, ['reports.view']);

    $this->actingAs($user)
        ->get('/reports/benefits/employee-contributions')
        ->assertOk();
});

test('dependants report loads', function () {
    $user = User::factory()->create();
    grantBenefitPermissions($user, ['reports.view']);

    $this->actingAs($user)
        ->get('/reports/benefits/dependants')
        ->assertOk();
});

test('benefit cost by category report loads', function () {
    $user = User::factory()->create();
    grantBenefitPermissions($user, ['reports.view']);

    $this->actingAs($user)
        ->get('/reports/benefits/by-cost')
        ->assertOk();
});

test('expired and suspended enrollments report loads', function () {
    $user = User::factory()->create();
    grantBenefitPermissions($user, ['reports.view']);

    $this->actingAs($user)
        ->get('/reports/benefits/expired-suspended')
        ->assertOk();
});
