<?php

use App\Models\Employee;
use App\Models\EmployeePayrollProfile;
use App\Models\EmployeePayrollSettlementRule;
use App\Models\Organization;
use App\Models\PayCode;
use App\Models\PayrollPeriod;
use App\Models\PayrollPeriodExchangeRate;
use App\Models\PayrollResult;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;

function payrollOrganization(string $name, string $code): Organization
{
    return Organization::query()->create([
        'name' => $name,
        'slug' => str($name)->slug()->toString(),
        'code' => $code,
        'status' => 'ACTIVE',
        'timezone' => 'Africa/Johannesburg',
    ]);
}

function payrollUserWithPermissions(Organization $organization, array $permissionNames): User
{
    $permissionIds = collect($permissionNames)
        ->map(function (string $name) {
            $module = str($name)->before('.')->toString();

            return Permission::query()->firstOrCreate(
                ['name' => $name],
                [
                    'module' => $module,
                    'label' => str($name)->replace(['.', '_'], ' ')->headline()->toString(),
                    'description' => 'Generated for payroll feature coverage.',
                ],
            )->id;
        })
        ->all();

    $role = Role::query()->create([
        'code' => 'PAYROLL_TEST_'.str()->upper(str()->random(8)),
        'name' => 'Payroll Test '.str()->upper(str()->random(4)),
        'description' => 'Temporary payroll feature role.',
    ]);
    $role->permissions()->sync($permissionIds);

    $user = User::factory()->create();
    $user->attachToOrganization($organization);
    $user->syncRoles([$role->id], $organization->id);
    $user->forceFill([
        'current_organization_id' => $organization->id,
    ])->saveQuietly();

    return $user;
}

function payrollEmployee(Organization $organization, string $staffNumber, string $firstName = 'Payroll'): Employee
{
    return Employee::query()->create([
        'organization_id' => $organization->id,
        'staff_number' => $staffNumber,
        'first_name' => $firstName,
        'surname' => 'Employee',
        'status' => 'ACTIVE',
        'pay_point' => 'Head Office',
    ]);
}

test('payroll dashboard renders and syncs default pay codes', function () {
    $organization = payrollOrganization('Payroll Tenant', 'PAY');
    $user = payrollUserWithPermissions($organization, ['payroll.view']);

    $this->actingAs($user);

    $this->get('/payroll')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Payroll/Index')
            ->where('summary.pay_codes', fn ($count) => $count > 0)
        );

    expect(PayCode::query()->count())->toBeGreaterThan(0);
});

test('payroll period processing creates a payroll run and payroll results', function () {
    $organization = payrollOrganization('Processing Tenant', 'PROC');
    $user = payrollUserWithPermissions($organization, [
        'payroll.view',
        'payroll.manage',
        'payroll.process',
        'payroll.approve',
        'payroll.close',
        'payroll.inputs.manage',
        'payroll.profile.manage',
    ]);

    $employee = payrollEmployee($organization, 'PROC-001');

    EmployeePayrollProfile::query()->create([
        'organization_id' => $organization->id,
        'employee_id' => $employee->id,
        'pay_frequency' => 'MONTHLY',
        'currency' => 'USD',
        'basic_salary' => 1000,
        'hourly_rate' => 10,
        'overtime_multiplier' => 1.5,
        'employment_status' => 'ACTIVE',
        'tax_enabled' => true,
        'active' => true,
        'effective_from' => now()->startOfMonth()->toDateString(),
    ]);

    $period = PayrollPeriod::query()->create([
        'organization_id' => $organization->id,
        'code' => 'PAY-2026-03',
        'name' => 'March 2026 Payroll',
        'frequency' => 'MONTHLY',
        'period_start' => now()->startOfMonth()->toDateString(),
        'period_end' => now()->endOfMonth()->toDateString(),
        'pay_date' => now()->endOfMonth()->toDateString(),
        'currency' => 'USD',
        'status' => 'DRAFT',
    ]);

    $this->actingAs($user);

    $this->post("/payroll/periods/{$period->id}/process")
        ->assertRedirect();

    expect(DB::table('payroll_runs')->where('payroll_period_id', $period->id)->count())->toBe(1);
    expect(DB::table('payroll_results')->where('payroll_period_id', $period->id)->count())->toBe(1);
    expect(PayrollResult::query()->first()?->gross_pay)->toBeGreaterThan(0);

    $this->post("/payroll/periods/{$period->id}/approve")
        ->assertRedirect();
    $this->post("/payroll/periods/{$period->id}/close")
        ->assertRedirect();

    expect($period->fresh()->status)->toBe('CLOSED');
});

test('users cannot open payroll periods from another organization by url', function () {
    $organizationA = payrollOrganization('Payroll A', 'PYA');
    $organizationB = payrollOrganization('Payroll B', 'PYB');
    $user = payrollUserWithPermissions($organizationA, ['payroll.view']);

    $foreignPeriod = PayrollPeriod::query()->create([
        'organization_id' => $organizationB->id,
        'code' => 'FOREIGN-01',
        'name' => 'Foreign Period',
        'frequency' => 'MONTHLY',
        'period_start' => now()->startOfMonth()->toDateString(),
        'period_end' => now()->endOfMonth()->toDateString(),
        'pay_date' => now()->endOfMonth()->toDateString(),
        'currency' => 'USD',
        'status' => 'DRAFT',
    ]);

    $this->actingAs($user);

    $this->get("/payroll/periods/{$foreignPeriod->id}")
        ->assertNotFound();
});

test('payslip page renders for a processed payroll result', function () {
    $organization = payrollOrganization('Payslip Tenant', 'PSL');
    $user = payrollUserWithPermissions($organization, ['payroll.view', 'payroll.manage', 'payroll.process', 'payroll.export', 'payroll.profile.manage']);
    $employee = payrollEmployee($organization, 'PSL-001', 'Alice');

    EmployeePayrollProfile::query()->create([
        'organization_id' => $organization->id,
        'employee_id' => $employee->id,
        'pay_frequency' => 'MONTHLY',
        'currency' => 'USD',
        'basic_salary' => 1200,
        'employment_status' => 'ACTIVE',
        'tax_enabled' => true,
        'active' => true,
        'effective_from' => now()->startOfMonth()->toDateString(),
    ]);

    $period = PayrollPeriod::query()->create([
        'organization_id' => $organization->id,
        'code' => 'PAY-PSL-01',
        'name' => 'Payslip Test',
        'frequency' => 'MONTHLY',
        'period_start' => now()->startOfMonth()->toDateString(),
        'period_end' => now()->endOfMonth()->toDateString(),
        'pay_date' => now()->endOfMonth()->toDateString(),
        'currency' => 'USD',
        'status' => 'DRAFT',
    ]);

    $this->actingAs($user);
    $this->post("/payroll/periods/{$period->id}/process");

    $result = PayrollResult::query()->firstOrFail();

    $this->get("/payroll/payslips/{$result->id}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Payroll/Payslips/Show')
            ->where('payslip.employee.staff_number', 'PSL-001')
        );
});

test('payroll results index renders and remains tenant scoped', function () {
    $organizationA = payrollOrganization('Results Tenant A', 'RTA');
    $organizationB = payrollOrganization('Results Tenant B', 'RTB');
    $user = payrollUserWithPermissions($organizationA, ['payroll.view']);

    $periodA = PayrollPeriod::query()->create([
        'organization_id' => $organizationA->id,
        'code' => 'PAY-RTA-01',
        'name' => 'Results Tenant A Payroll',
        'frequency' => 'MONTHLY',
        'period_start' => now()->startOfMonth()->toDateString(),
        'period_end' => now()->endOfMonth()->toDateString(),
        'pay_date' => now()->endOfMonth()->toDateString(),
        'currency' => 'USD',
        'status' => 'PROCESSED',
    ]);

    $periodB = PayrollPeriod::query()->create([
        'organization_id' => $organizationB->id,
        'code' => 'PAY-RTB-01',
        'name' => 'Results Tenant B Payroll',
        'frequency' => 'MONTHLY',
        'period_start' => now()->startOfMonth()->toDateString(),
        'period_end' => now()->endOfMonth()->toDateString(),
        'pay_date' => now()->endOfMonth()->toDateString(),
        'currency' => 'USD',
        'status' => 'PROCESSED',
    ]);

    $employeeA = payrollEmployee($organizationA, 'RTA-001', 'Nyasha');
    $employeeB = payrollEmployee($organizationB, 'RTB-001', 'Farai');

    $runA = \App\Models\PayrollRun::query()->create([
        'organization_id' => $organizationA->id,
        'payroll_period_id' => $periodA->id,
        'run_number' => 1,
        'status' => 'PROCESSED',
        'employee_count' => 1,
        'gross_total' => 1450,
        'taxable_total' => 1450,
        'deduction_total' => 250,
        'net_total' => 1200,
    ]);

    $runB = \App\Models\PayrollRun::query()->create([
        'organization_id' => $organizationB->id,
        'payroll_period_id' => $periodB->id,
        'run_number' => 1,
        'status' => 'PROCESSED',
        'employee_count' => 1,
        'gross_total' => 1800,
        'taxable_total' => 1800,
        'deduction_total' => 300,
        'net_total' => 1500,
    ]);

    PayrollResult::query()->create([
        'organization_id' => $organizationA->id,
        'payroll_run_id' => $runA->id,
        'payroll_period_id' => $periodA->id,
        'employee_id' => $employeeA->id,
        'staff_number_snapshot' => $employeeA->staff_number,
        'employee_name_snapshot' => 'Nyasha Employee',
        'department_snapshot' => 'Finance',
        'position_snapshot' => 'Analyst',
        'pay_point_snapshot' => 'Head Office',
        'currency_snapshot' => 'USD',
        'basic_salary_snapshot' => 1200,
        'gross_pay' => 1450,
        'pre_tax_deductions' => 0,
        'taxable_income' => 1450,
        'tax_amount' => 100,
        'statutory_deductions' => 50,
        'voluntary_deductions' => 100,
        'total_deductions' => 250,
        'net_pay' => 1200,
        'status' => 'PROCESSED',
        'snapshot' => [],
    ]);

    PayrollResult::query()->create([
        'organization_id' => $organizationB->id,
        'payroll_run_id' => $runB->id,
        'payroll_period_id' => $periodB->id,
        'employee_id' => $employeeB->id,
        'staff_number_snapshot' => $employeeB->staff_number,
        'employee_name_snapshot' => 'Farai Employee',
        'department_snapshot' => 'Operations',
        'position_snapshot' => 'Supervisor',
        'pay_point_snapshot' => 'Head Office',
        'currency_snapshot' => 'USD',
        'basic_salary_snapshot' => 1500,
        'gross_pay' => 1800,
        'pre_tax_deductions' => 0,
        'taxable_income' => 1800,
        'tax_amount' => 120,
        'statutory_deductions' => 80,
        'voluntary_deductions' => 100,
        'total_deductions' => 300,
        'net_pay' => 1500,
        'status' => 'PROCESSED',
        'snapshot' => [],
    ]);

    $this->actingAs($user);

    $this->get('/payroll/results')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Payroll/Results/Index')
            ->where('stats.results_total', 1)
            ->where('results.data.0.employee.staff_number', 'RTA-001')
        );
});

test('payroll results index supports server-side sorting', function () {
    $organization = payrollOrganization('Sorted Results Tenant', 'SRT');
    $user = payrollUserWithPermissions($organization, ['payroll.view']);

    $period = PayrollPeriod::query()->create([
        'organization_id' => $organization->id,
        'code' => 'PAY-SORT-01',
        'name' => 'Sorted Results Payroll',
        'frequency' => 'MONTHLY',
        'period_start' => now()->startOfMonth()->toDateString(),
        'period_end' => now()->endOfMonth()->toDateString(),
        'pay_date' => now()->endOfMonth()->toDateString(),
        'currency' => 'USD',
        'status' => 'PROCESSED',
    ]);

    $employeeA = payrollEmployee($organization, 'SRT-001', 'Alpha');
    $employeeB = payrollEmployee($organization, 'SRT-002', 'Zulu');

    $run = \App\Models\PayrollRun::query()->create([
        'organization_id' => $organization->id,
        'payroll_period_id' => $period->id,
        'run_number' => 1,
        'status' => 'PROCESSED',
        'employee_count' => 2,
        'gross_total' => 3000,
        'taxable_total' => 3000,
        'deduction_total' => 600,
        'net_total' => 2400,
    ]);

    PayrollResult::query()->create([
        'organization_id' => $organization->id,
        'payroll_run_id' => $run->id,
        'payroll_period_id' => $period->id,
        'employee_id' => $employeeA->id,
        'staff_number_snapshot' => $employeeA->staff_number,
        'employee_name_snapshot' => 'Alpha Employee',
        'department_snapshot' => 'Finance',
        'position_snapshot' => 'Analyst',
        'pay_point_snapshot' => 'Alpha Point',
        'currency_snapshot' => 'USD',
        'basic_salary_snapshot' => 1100,
        'gross_pay' => 1300,
        'pre_tax_deductions' => 0,
        'taxable_income' => 1300,
        'tax_amount' => 100,
        'statutory_deductions' => 50,
        'voluntary_deductions' => 50,
        'total_deductions' => 200,
        'net_pay' => 1100,
        'status' => 'PROCESSED',
        'snapshot' => [],
    ]);

    PayrollResult::query()->create([
        'organization_id' => $organization->id,
        'payroll_run_id' => $run->id,
        'payroll_period_id' => $period->id,
        'employee_id' => $employeeB->id,
        'staff_number_snapshot' => $employeeB->staff_number,
        'employee_name_snapshot' => 'Zulu Employee',
        'department_snapshot' => 'Operations',
        'position_snapshot' => 'Supervisor',
        'pay_point_snapshot' => 'Zulu Point',
        'currency_snapshot' => 'USD',
        'basic_salary_snapshot' => 1300,
        'gross_pay' => 1700,
        'pre_tax_deductions' => 0,
        'taxable_income' => 1700,
        'tax_amount' => 200,
        'statutory_deductions' => 50,
        'voluntary_deductions' => 50,
        'total_deductions' => 300,
        'net_pay' => 1400,
        'status' => 'PROCESSED',
        'snapshot' => [],
    ]);

    $this->actingAs($user);

    $this->get('/payroll/results?sort=net_pay&direction=desc')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Payroll/Results/Index')
            ->where('filters.sort', 'net_pay')
            ->where('filters.direction', 'desc')
            ->where('results.data.0.employee.staff_number', 'SRT-002')
        );
});

test('payroll processing supports usd fixed settlement with zig remainder', function () {
    $organization = payrollOrganization('Settlement Tenant', 'SET');
    $user = payrollUserWithPermissions($organization, [
        'payroll.view',
        'payroll.manage',
        'payroll.process',
        'payroll.export',
        'payroll.profile.manage',
    ]);
    $employee = payrollEmployee($organization, 'SET-001', 'Tariro');

    $profile = EmployeePayrollProfile::query()->create([
        'organization_id' => $organization->id,
        'employee_id' => $employee->id,
        'pay_frequency' => 'MONTHLY',
        'currency' => 'USD',
        'basic_salary' => 1000,
        'employment_status' => 'ACTIVE',
        'tax_enabled' => false,
        'active' => true,
        'effective_from' => now()->startOfMonth()->toDateString(),
    ]);

    EmployeePayrollSettlementRule::query()->create([
        'organization_id' => $organization->id,
        'employee_payroll_profile_id' => $profile->id,
        'currency' => 'USD',
        'allocation_method' => 'FIXED_AMOUNT',
        'amount' => 300,
        'priority' => 0,
        'active' => true,
    ]);

    EmployeePayrollSettlementRule::query()->create([
        'organization_id' => $organization->id,
        'employee_payroll_profile_id' => $profile->id,
        'currency' => 'ZIG',
        'allocation_method' => 'REMAINDER',
        'priority' => 10,
        'active' => true,
    ]);

    $period = PayrollPeriod::query()->create([
        'organization_id' => $organization->id,
        'code' => 'PAY-SET-01',
        'name' => 'Settlement Test',
        'frequency' => 'MONTHLY',
        'period_start' => now()->startOfMonth()->toDateString(),
        'period_end' => now()->endOfMonth()->toDateString(),
        'pay_date' => now()->endOfMonth()->toDateString(),
        'currency' => 'USD',
        'status' => 'DRAFT',
    ]);

    PayrollPeriodExchangeRate::query()->create([
        'organization_id' => $organization->id,
        'payroll_period_id' => $period->id,
        'from_currency' => 'USD',
        'to_currency' => 'ZIG',
        'rate' => 27,
    ]);

    $this->actingAs($user);

    $this->post("/payroll/periods/{$period->id}/process")
        ->assertRedirect();

    $result = PayrollResult::query()->with('settlements')->firstOrFail();

    expect((float) $result->net_pay)->toBe(1000.0);
    expect($result->settlements)->toHaveCount(2);

    $usdSettlement = $result->settlements->firstWhere('currency', 'USD');
    $zigSettlement = $result->settlements->firstWhere('currency', 'ZIG');

    expect($usdSettlement)->not->toBeNull();
    expect($zigSettlement)->not->toBeNull();
    expect((float) $usdSettlement->base_amount)->toBe(300.0);
    expect((float) $usdSettlement->settlement_amount)->toBe(300.0);
    expect((float) $zigSettlement->base_amount)->toBe(700.0);
    expect((float) $zigSettlement->settlement_amount)->toBe(18900.0);
    expect((float) $zigSettlement->exchange_rate)->toBe(27.0);

    $this->get("/payroll/payslips/{$result->id}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Payroll/Payslips/Show')
            ->where('payslip.settlements.0.currency', 'USD')
            ->where('payslip.settlements.1.currency', 'ZIG')
        );
});
