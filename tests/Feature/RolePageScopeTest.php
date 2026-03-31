<?php

use App\Models\Asset;
use App\Models\AssetAssignment;
use App\Models\AssetCategory;
use App\Models\AttendanceRecord;
use App\Models\Benefit;
use App\Models\Document;
use App\Models\DocumentType;
use App\Models\Employee;
use App\Models\EmployeeBenefitEnrollment;
use App\Models\EmployeeScorecard;
use App\Models\LeaveRequest;
use App\Models\Organization;
use App\Models\PayrollPeriod;
use App\Models\PayrollResult;
use App\Models\PayrollRun;
use App\Models\Permission;
use App\Models\PerformanceCycle;
use App\Models\PerformanceImprovementPlan;
use App\Models\Role;
use App\Models\Timesheet;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function roleScopeOrganization(): Organization
{
    return Organization::query()->create([
        'name' => 'Role Scope Org',
        'slug' => 'role-scope-org',
        'code' => 'RSO',
        'status' => 'ACTIVE',
        'timezone' => 'Africa/Johannesburg',
    ]);
}

function roleScopePermissionIds(array $permissionNames): array
{
    return collect($permissionNames)
        ->map(function (string $name) {
            $module = str($name)->before('.')->toString();

            return Permission::query()->firstOrCreate(
                ['name' => $name],
                [
                    'module' => $module,
                    'label' => str($name)->replace(['.', '_'], ' ')->headline()->toString(),
                    'description' => 'Generated for role scope tests.',
                ],
            )->id;
        })
        ->all();
}

function roleScopeUser(string $roleCode, array $permissionNames, Organization $organization): User
{
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $role = Role::query()->firstOrCreate(
        ['code' => $roleCode],
        [
            'name' => str($roleCode)->replace('_', ' ')->headline()->toString(),
            'description' => 'Generated for role scope tests.',
        ],
    );

    $role->permissions()->sync(roleScopePermissionIds($permissionNames));

    $user->attachToOrganization($organization);
    $user->syncRoles([$role->id], $organization->id);
    $user->forceFill([
        'current_organization_id' => $organization->id,
    ])->saveQuietly();

    return $user;
}

function roleScopeEmployee(Organization $organization, ?User $user = null, array $overrides = []): Employee
{
    $sequence = (int) Employee::withoutGlobalScopes()->count() + 1;

    return Employee::withoutGlobalScopes()->create(array_merge([
        'organization_id' => $organization->id,
        'user_id' => $user?->id,
        'staff_number' => 'RS-'.str_pad((string) $sequence, 4, '0', STR_PAD_LEFT),
        'first_name' => 'Role',
        'surname' => 'Employee '.$sequence,
        'contact_number' => '+2711000000'.$sequence,
        'address' => $sequence.' Scope Street',
        'national_id' => 'RS-ID-'.$sequence,
        'gender' => 'Male',
        'marital_status' => 'Single',
        'status' => 'ACTIVE',
        'pay_point' => 'Head Office',
    ], $overrides));
}

function roleScopeLeave(Organization $organization, Employee $employee, string $status = 'pending', string $reason = 'Annual leave'): LeaveRequest
{
    $leave = new LeaveRequest([
        'employee_id' => $employee->id,
        'leave_type' => 'annual',
        'start_date' => '2026-03-01',
        'end_date' => '2026-03-05',
        'days' => 5,
        'status' => $status,
        'reason' => $reason,
    ]);
    $leave->organization_id = $organization->id;
    $leave->save();

    return $leave;
}

function roleScopeAttendance(Organization $organization, Employee $employee, string $date = '2026-03-01'): AttendanceRecord
{
    $record = new AttendanceRecord([
        'employee_id' => $employee->id,
        'work_date' => $date,
        'clock_in' => $date.' 08:00:00',
        'clock_out' => $date.' 17:00:00',
        'minutes_worked' => 540,
        'exception_status' => 'ok',
    ]);
    $record->organization_id = $organization->id;
    $record->save();

    return $record;
}

function roleScopeTimesheet(Organization $organization, Employee $employee, string $status = 'submitted'): Timesheet
{
    $timesheet = new Timesheet([
        'employee_id' => $employee->id,
        'period_start' => '2026-03-01',
        'period_end' => '2026-03-07',
        'total_minutes' => 2400,
        'overtime_minutes' => 120,
        'status' => $status,
    ]);
    $timesheet->organization_id = $organization->id;
    $timesheet->save();

    return $timesheet;
}

function roleScopeDocumentType(Organization $organization): DocumentType
{
    $type = new DocumentType([
        'code' => 'CONTRACT',
        'name' => 'Contract',
        'retention_policy' => '7 years',
        'sensitivity_level' => 'high',
    ]);
    $type->organization_id = $organization->id;
    $type->save();

    return $type;
}

function roleScopeDocument(Organization $organization, Employee $employee, DocumentType $documentType, string $title): Document
{
    $document = new Document([
        'owner_employee_id' => $employee->id,
        'document_type_id' => $documentType->id,
        'title' => $title,
        'file_uri' => 'documents/'.str($title)->slug().'.pdf',
        'issue_date' => '2026-01-01',
        'expiry_date' => '2027-01-01',
        'access_policy' => 'restricted',
        'metadata_json' => ['description' => $title],
    ]);
    $document->organization_id = $organization->id;
    $document->save();

    return $document;
}

function roleScopeBenefit(Organization $organization, string $name = 'Medical Aid'): Benefit
{
    return Benefit::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'code' => 'BEN-'.str()->upper(str()->random(4)),
        'name' => $name,
        'category' => 'health',
        'benefit_type' => 'shared',
        'taxable' => false,
        'cash_benefit' => false,
        'requires_dependants' => false,
        'active' => true,
    ]);
}

function roleScopeEnrollment(Organization $organization, Employee $employee, Benefit $benefit, string $status = 'active'): EmployeeBenefitEnrollment
{
    return EmployeeBenefitEnrollment::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'employee_id' => $employee->id,
        'benefit_id' => $benefit->id,
        'status' => $status,
        'effective_date' => '2026-01-01',
        'employee_contribution' => 150,
        'employer_contribution' => 300,
        'payroll_deduction_code' => 'BEN-001',
    ]);
}

function roleScopeAsset(Organization $organization, string $name = 'Laptop'): Asset
{
    $category = AssetCategory::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'name' => 'IT Equipment '.str()->upper(str()->random(3)),
        'code' => 'IT-'.str()->upper(str()->random(4)),
    ]);

    return Asset::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'asset_category_id' => $category->id,
        'asset_tag' => 'AST-'.str()->upper(str()->random(6)),
        'name' => $name,
        'status' => 'assigned',
        'condition' => 'good',
    ]);
}

function roleScopeAssignAsset(Organization $organization, Asset $asset, Employee $employee): AssetAssignment
{
    return AssetAssignment::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'asset_id' => $asset->id,
        'employee_id' => $employee->id,
        'assigned_at' => now(),
        'condition_on_assignment' => 'good',
        'status' => 'active',
    ]);
}

function roleScopePerformanceCycle(Organization $organization): PerformanceCycle
{
    return PerformanceCycle::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'title' => 'Q1 Review',
        'start_date' => '2026-01-01',
        'end_date' => '2026-03-31',
        'status' => 'active',
    ]);
}

function roleScopeScorecard(Organization $organization, Employee $employee, PerformanceCycle $cycle, string $status = 'draft', ?float $score = null, ?string $rating = null): EmployeeScorecard
{
    return EmployeeScorecard::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'employee_id' => $employee->id,
        'performance_cycle_id' => $cycle->id,
        'status' => $status,
        'overall_score' => $score,
        'overall_rating' => $rating,
    ]);
}

function roleScopeImprovementPlan(Organization $organization, Employee $employee, EmployeeScorecard $scorecard, string $status = 'active'): PerformanceImprovementPlan
{
    return PerformanceImprovementPlan::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'employee_id' => $employee->id,
        'employee_scorecard_id' => $scorecard->id,
        'title' => 'Improvement Plan',
        'description' => 'Improve delivery quality.',
        'start_date' => '2026-04-01',
        'end_date' => '2026-06-30',
        'status' => $status,
    ]);
}

function roleScopePayslip(Organization $organization, Employee $employee): PayrollResult
{
    $sequence = (int) PayrollPeriod::query()->where('organization_id', $organization->id)->count();
    $periodStart = now()->startOfMonth()->addMonths($sequence);
    $periodEnd = (clone $periodStart)->endOfMonth();

    $period = PayrollPeriod::query()->create([
        'organization_id' => $organization->id,
        'code' => 'PAY-'.str()->upper(str()->random(6)),
        'name' => 'Role Scope Period',
        'frequency' => 'MONTHLY',
        'period_start' => $periodStart->toDateString(),
        'period_end' => $periodEnd->toDateString(),
        'pay_date' => $periodEnd->toDateString(),
        'currency' => 'USD',
        'status' => 'CLOSED',
    ]);

    $run = PayrollRun::query()->create([
        'organization_id' => $organization->id,
        'payroll_period_id' => $period->id,
        'run_number' => 1,
        'status' => 'CLOSED',
        'processed_at' => now(),
        'employee_count' => 1,
        'gross_total' => 1000,
        'taxable_total' => 1000,
        'deduction_total' => 150,
        'net_total' => 850,
        'calculation_version' => 'v1',
        'summary_json' => ['source' => 'role-scope-test'],
    ]);

    return PayrollResult::query()->create([
        'organization_id' => $organization->id,
        'payroll_run_id' => $run->id,
        'payroll_period_id' => $period->id,
        'employee_id' => $employee->id,
        'employee_payroll_profile_id' => null,
        'staff_number_snapshot' => $employee->staff_number,
        'employee_name_snapshot' => $employee->full_name,
        'department_snapshot' => 'Operations',
        'position_snapshot' => 'Analyst',
        'pay_point_snapshot' => 'Head Office',
        'currency_snapshot' => 'USD',
        'bank_account_name_snapshot' => $employee->full_name,
        'bank_account_number_snapshot' => '1234567890',
        'bank_name_snapshot' => 'Test Bank',
        'tax_number_snapshot' => 'TIN-123',
        'basic_salary_snapshot' => 1000,
        'gross_pay' => 1000,
        'pre_tax_deductions' => 0,
        'taxable_income' => 1000,
        'tax_amount' => 100,
        'statutory_deductions' => 50,
        'voluntary_deductions' => 0,
        'total_deductions' => 150,
        'net_pay' => 850,
        'status' => 'CLOSED',
        'snapshot' => ['source' => 'role-scope-test'],
    ]);
}

test('dashboard shares role-pinned shortcuts for employees', function () {
    $organization = roleScopeOrganization();
    $user = roleScopeUser('EMPLOYEE', [
        'leave.view',
        'attendance.view',
        'timesheets.view',
        'payslips.view',
        'benefits.view',
    ], $organization);

    $employee = roleScopeEmployee($organization, $user, [
        'first_name' => 'Pinned',
        'surname' => 'Employee',
    ]);

    roleScopeLeave($organization, $employee, 'pending');
    roleScopeAttendance($organization, $employee);
    roleScopeTimesheet($organization, $employee, 'submitted');
    $benefit = roleScopeBenefit($organization);
    roleScopeEnrollment($organization, $employee, $benefit);
    roleScopePayslip($organization, $employee);

    $this->actingAs($user)
        ->get('/dashboard')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('auth.user.dashboard_role', 'employee')
            ->has('auth.user.pinned_shortcuts', 5)
            ->where('auth.user.pinned_shortcuts.0.title', 'Leave Management')
            ->where('auth.user.pinned_shortcuts.0.badge', '1')
            ->where('auth.user.pinned_shortcuts.4.title', 'Benefits')
            ->where('auth.user.pinned_shortcuts.4.badge', '1')
        );
});

test('employee leave records are self scoped and direct leave urls are protected', function () {
    $organization = roleScopeOrganization();
    $user = roleScopeUser('EMPLOYEE', ['leave.view'], $organization);
    $employee = roleScopeEmployee($organization, $user, ['first_name' => 'Self', 'surname' => 'Employee']);
    $otherEmployee = roleScopeEmployee($organization, null, ['first_name' => 'Other', 'surname' => 'Employee']);

    $ownLeave = roleScopeLeave($organization, $employee, 'pending', 'Own leave');
    $otherLeave = roleScopeLeave($organization, $otherEmployee, 'pending', 'Other leave');

    $this->actingAs($user)
        ->get('/leave-requests')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('LeaveRequests/Index')
            ->where('records.total', 1)
            ->where('records.data.0.id', $ownLeave->id)
            ->where('scope.mode', 'self')
            ->where('scope.label', 'My records')
        );

    $this->actingAs($user)
        ->get("/leave-requests/{$otherLeave->id}")
        ->assertNotFound();
});

test('employee attendance, timesheets, payslips, benefits, documents, and performance pages are self scoped', function () {
    $organization = roleScopeOrganization();
    $user = roleScopeUser('EMPLOYEE', [
        'attendance.view',
        'timesheets.view',
        'payslips.view',
        'benefits.view',
        'documents.view',
        'performance.view',
        'performance.scorecards.view',
    ], $organization);

    $employee = roleScopeEmployee($organization, $user, ['first_name' => 'Scoped', 'surname' => 'User']);
    $otherEmployee = roleScopeEmployee($organization, null, ['first_name' => 'Other', 'surname' => 'User']);
    $documentType = roleScopeDocumentType($organization);
    $benefit = roleScopeBenefit($organization);
    $cycle = roleScopePerformanceCycle($organization);

    roleScopeAttendance($organization, $employee, '2026-03-01');
    roleScopeAttendance($organization, $otherEmployee, '2026-03-01');
    roleScopeTimesheet($organization, $employee, 'submitted');
    roleScopeTimesheet($organization, $otherEmployee, 'submitted');
    roleScopePayslip($organization, $employee);
    roleScopePayslip($organization, $otherEmployee);
    roleScopeEnrollment($organization, $employee, $benefit, 'active');
    roleScopeEnrollment($organization, $otherEmployee, $benefit, 'active');
    roleScopeDocument($organization, $employee, $documentType, 'Own Contract');
    roleScopeDocument($organization, $otherEmployee, $documentType, 'Other Contract');
    $ownScorecard = roleScopeScorecard($organization, $employee, $cycle, 'draft');
    $otherScorecard = roleScopeScorecard($organization, $otherEmployee, $cycle, 'draft');
    roleScopeImprovementPlan($organization, $employee, $ownScorecard, 'active');
    roleScopeImprovementPlan($organization, $otherEmployee, $otherScorecard, 'active');

    $this->actingAs($user)
        ->get('/attendance-records')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('AttendanceRecords/Index')
            ->where('records.total', 1)
            ->where('scope.mode', 'self')
        );

    $this->actingAs($user)
        ->get('/timesheets')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Timesheets/Index')
            ->where('records.total', 1)
            ->where('scope.mode', 'self')
        );

    $this->actingAs($user)
        ->get('/payroll/payslips')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Payroll/Payslips/Index')
            ->where('payslips.total', 1)
            ->where('scope.mode', 'self')
        );

    $this->actingAs($user)
        ->get('/benefit-enrollments')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Benefits/Enrollments/Index')
            ->where('enrollments.total', 1)
            ->where('scope.mode', 'self')
        );

    $this->actingAs($user)
        ->get('/documents')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Documents/Index')
            ->where('documents.total', 1)
            ->where('scope.mode', 'self')
        );

    $this->actingAs($user)
        ->get('/performance')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Performance/Dashboard')
            ->where('metrics.total_scorecards', 1)
            ->where('metrics.active_improvement_plans', 1)
            ->where('scope.mode', 'self')
        );
});

test('manager sees direct reports by default and can switch to mine on employees', function () {
    $organization = roleScopeOrganization();
    $user = roleScopeUser('MANAGER', ['employees.view'], $organization);
    $manager = roleScopeEmployee($organization, $user, ['first_name' => 'Manager', 'surname' => 'User']);
    $directReport = roleScopeEmployee($organization, null, ['first_name' => 'Direct', 'surname' => 'Report', 'manager_id' => $manager->id]);
    $outsideEmployee = roleScopeEmployee($organization, null, ['first_name' => 'Outside', 'surname' => 'Employee']);

    $this->actingAs($user)
        ->get('/employees')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Employees/Index')
            ->where('employees.total', 1)
            ->where('employees.data.0.id', $directReport->id)
            ->where('scope.mode', 'team')
            ->where('scope.current_view', 'team')
            ->where('scope.allows_self_toggle', true)
        );

    $this->actingAs($user)
        ->get('/employees?scope_view=mine')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Employees/Index')
            ->where('employees.total', 1)
            ->where('employees.data.0.id', $manager->id)
            ->where('scope.mode', 'self')
            ->where('scope.current_view', 'self')
        );

    $this->actingAs($user)
        ->get("/employees/{$outsideEmployee->id}")
        ->assertNotFound();
});

test('manager assets are team scoped by default and mine toggle narrows to own assignments', function () {
    $organization = roleScopeOrganization();
    $user = roleScopeUser('MANAGER', ['assets.view'], $organization);
    $manager = roleScopeEmployee($organization, $user, ['first_name' => 'Asset', 'surname' => 'Manager']);
    $directReport = roleScopeEmployee($organization, null, ['first_name' => 'Asset', 'surname' => 'Report', 'manager_id' => $manager->id]);
    $outsideEmployee = roleScopeEmployee($organization, null, ['first_name' => 'Asset', 'surname' => 'Outside']);

    $teamAsset = roleScopeAsset($organization, 'Team Laptop');
    $managerAsset = roleScopeAsset($organization, 'Manager Laptop');
    $outsideAsset = roleScopeAsset($organization, 'Outside Laptop');
    roleScopeAssignAsset($organization, $teamAsset, $directReport);
    roleScopeAssignAsset($organization, $managerAsset, $manager);
    roleScopeAssignAsset($organization, $outsideAsset, $outsideEmployee);

    $this->actingAs($user)
        ->get('/assets')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Assets/Index')
            ->where('assets.total', 1)
            ->where('scope.mode', 'team')
            ->where('scope.current_view', 'team')
        );

    $this->actingAs($user)
        ->get('/assets?scope_view=mine')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Assets/Index')
            ->where('assets.total', 1)
            ->where('assets.data.0.name', 'Manager Laptop')
            ->where('scope.mode', 'self')
            ->where('scope.current_view', 'self')
        );
});

test('authoriser sees only actionable leave requests in the approval queue', function () {
    $organization = roleScopeOrganization();
    $user = roleScopeUser('AUTHORISER', ['leave.view', 'leave.approve'], $organization);
    $firstEmployee = roleScopeEmployee($organization, null, ['first_name' => 'Pending', 'surname' => 'One']);
    $secondEmployee = roleScopeEmployee($organization, null, ['first_name' => 'Approved', 'surname' => 'Two']);

    $pendingLeave = roleScopeLeave($organization, $firstEmployee, 'pending', 'Needs approval');
    roleScopeLeave($organization, $secondEmployee, 'approved', 'Already approved');

    $this->actingAs($user)
        ->get('/leave-requests')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('LeaveRequests/Index')
            ->where('records.total', 1)
            ->where('records.data.0.id', $pendingLeave->id)
            ->where('scope.mode', 'approval_queue')
            ->where('scope.label', 'Approval queue')
        );
});
