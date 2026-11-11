<?php

use App\Models\Employee;
use App\Models\EmployeePayrollProfile;
use App\Models\Organization;
use App\Models\PayrollPeriod;
use App\Models\PayrollResult;
use App\Models\PayrollResultLine;
use App\Models\PayrollRun;
use App\Models\PayrollTaxTable;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Support\Payroll\PayrollTaxService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Queue;

function taxOrg(string $name, string $code): Organization
{
    return Organization::query()->create([
        'name' => $name,
        'slug' => str($name)->slug()->toString(),
        'code' => $code,
        'status' => 'ACTIVE',
        'timezone' => 'Africa/Harare',
    ]);
}

function taxActor(Organization $organization, array $permissionNames): User
{
    $permissionIds = collect($permissionNames)
        ->map(fn (string $name) => Permission::query()->firstOrCreate(
            ['name' => $name],
            [
                'module' => str($name)->before('.')->toString(),
                'label' => str($name)->replace(['.', '_'], ' ')->headline()->toString(),
                'description' => 'Generated for payroll tax coverage.',
            ],
        )->id)
        ->all();

    $role = Role::query()->create([
        'code' => 'TAX_TEST_'.str()->upper(str()->random(8)),
        'name' => 'Tax Test '.str()->upper(str()->random(4)),
        'description' => 'Temporary payroll tax role.',
    ]);
    $role->permissions()->sync($permissionIds);

    $user = User::factory()->create();
    $user->attachToOrganization($organization);
    $user->syncRoles([$role->id], $organization->id);
    $user->forceFill(['current_organization_id' => $organization->id])->saveQuietly();

    return $user;
}

/**
 * @return array{employee: Employee, period: PayrollPeriod}
 */
function taxPayrollSetup(Organization $organization, array $profile = [], array $period = []): array
{
    $employee = Employee::query()->create([
        'organization_id' => $organization->id,
        'staff_number' => 'TAX-'.str()->upper(str()->random(5)),
        'first_name' => 'Tax',
        'surname' => 'Employee',
        'status' => 'ACTIVE',
        'pay_point' => 'Head Office',
    ]);

    EmployeePayrollProfile::query()->create([
        'organization_id' => $organization->id,
        'employee_id' => $employee->id,
        'pay_frequency' => 'MONTHLY',
        'currency' => 'USD',
        'basic_salary' => 600,
        'employment_status' => 'ACTIVE',
        'tax_enabled' => true,
        'active' => true,
        'effective_from' => '2026-01-01',
        ...$profile,
    ]);

    $payrollPeriod = PayrollPeriod::query()->create([
        'organization_id' => $organization->id,
        'code' => 'PAY-'.str()->upper(str()->random(6)),
        'name' => 'March 2026 Payroll',
        'frequency' => 'MONTHLY',
        'period_start' => '2026-03-01',
        'period_end' => '2026-03-31',
        'pay_date' => '2026-03-31',
        'currency' => 'USD',
        'status' => 'DRAFT',
        ...$period,
    ]);

    return ['employee' => $employee, 'period' => $payrollPeriod];
}

function taxLine(PayrollResult $result, string $code): ?float
{
    $amount = PayrollResultLine::query()
        ->where('payroll_result_id', $result->id)
        ->where('code_snapshot', $code)
        ->value('amount');

    return $amount === null ? null : (float) $amount;
}

dataset('usd monthly paye', [
    'at the tax-free threshold' => [100.00, 0.00],
    'just above the threshold' => [100.01, 0.00],
    'top of the 20% band' => [300.00, 40.00],
    'Belina worked example (563 taxable)' => [563.00, 105.75],
    'top of the 25% band' => [1000.00, 215.00],
    'top of the 30% band' => [2000.00, 515.00],
    'top of the 35% band' => [3000.00, 865.00],
    'in the 40% band' => [5000.00, 1665.00],
    'negative income' => [-50.00, 0.00],
]);

test('USD monthly PAYE follows the banded table', function (float $taxable, float $expected) {
    $tax = app(PayrollTaxService::class)->calculate($taxable, 'USD', 'MONTHLY', '2026-03-31');

    expect($tax['paye'])->toBe($expected)
        ->and($tax['fallback'])->toBeFalse()
        ->and($tax['aids_levy'])->toBe(round($expected * 0.03, 2));
})->with('usd monthly paye');

test('weekly and fortnightly tables are the annual table pro-rated', function () {
    $service = app(PayrollTaxService::class);

    // 1,300 a year over 52 weeks is 25 a week; annual tax is (1,300 - 1,200) x 20% = 20.
    expect($service->calculate(23.08, 'USD', 'WEEKLY', '2026-03-31')['paye'])->toBe(0.00)
        ->and($service->calculate(69.23, 'USD', 'WEEKLY', '2026-03-31')['paye'])->toBe(9.23)
        ->and($service->calculate(138.46, 'USD', 'FORTNIGHTLY', '2026-03-31')['paye'])->toBe(18.46)
        ->and($service->calculate(138.46, 'USD', 'BI_WEEKLY', '2026-03-31')['paye'])->toBe(18.46);
});

test('the tax table in force on the period date is used', function () {
    $table = PayrollTaxTable::query()->create([
        'name' => 'Future USD monthly',
        'currency' => 'USD',
        'pay_frequency' => 'MONTHLY',
        'effective_from' => '2027-01-01',
        'aids_levy_percent' => 3,
    ]);
    $table->bands()->createMany([
        ['lower_bound' => 0, 'upper_bound' => 200, 'rate_percent' => 0, 'sort_order' => 1],
        ['lower_bound' => 200, 'upper_bound' => null, 'rate_percent' => 10, 'sort_order' => 2],
    ]);

    $service = app(PayrollTaxService::class);

    expect($service->calculate(1000, 'USD', 'MONTHLY', '2026-12-31')['paye'])->toBe(215.00)
        ->and($service->calculate(1000, 'USD', 'MONTHLY', '2027-01-31')['paye'])->toBe(80.00);
});

test('an organization tax table overrides the system table', function () {
    $organization = taxOrg('Override Org', 'OVR');
    $table = PayrollTaxTable::query()->create([
        'organization_id' => $organization->id,
        'name' => 'Override USD monthly',
        'currency' => 'USD',
        'pay_frequency' => 'MONTHLY',
        'effective_from' => '2024-01-01',
        'aids_levy_percent' => 3,
    ]);
    $table->bands()->create(['lower_bound' => 0, 'upper_bound' => null, 'rate_percent' => 10, 'sort_order' => 1]);

    $service = app(PayrollTaxService::class);

    expect($service->calculate(1000, 'USD', 'MONTHLY', '2026-03-31', $organization->id)['paye'])->toBe(100.00)
        ->and($service->calculate(1000, 'USD', 'MONTHLY', '2026-03-31')['paye'])->toBe(215.00);
});

test('a currency without a tax table falls back to the legacy bands and says so', function () {
    $tax = app(PayrollTaxService::class)->calculate(2000, 'ZIG', 'MONTHLY', '2026-03-31');

    expect($tax['fallback'])->toBeTrue()
        ->and($tax['tax_table_id'])->toBeNull()
        ->and($tax['paye'])->toBe(200.00);
});

test('processing deducts NSSA and pension before tax and adds the AIDS levy', function () {
    $organization = taxOrg('Levy Org', 'LVY');
    $user = taxActor($organization, ['payroll.view', 'payroll.process']);
    ['period' => $period] = taxPayrollSetup($organization, [
        'nssa_percent' => 4.5,
        'pension_percent' => 0,
    ]);

    $this->actingAs($user)->post("/payroll/periods/{$period->id}/process")->assertRedirect();

    $result = PayrollResult::query()->where('payroll_period_id', $period->id)->firstOrFail();

    // 600 gross, NSSA 4.5% = 27, taxable 573.
    // PAYE = 200 x 20% + 273 x 25% = 108.25. AIDS levy = 3% of 108.25 = 3.25.
    expect(taxLine($result, 'NSSA'))->toBe(27.00)
        ->and((float) $result->taxable_income)->toBe(573.00)
        ->and(taxLine($result, 'PAYE'))->toBe(108.25)
        ->and(taxLine($result, 'AIDS'))->toBe(3.25)
        ->and((float) $result->tax_amount)->toBe(111.50)
        ->and((float) $result->net_pay)->toBe(461.50);
});

test('NEC and union contributions reduce taxable income', function () {
    $organization = taxOrg('Union Org', 'UNI');
    $user = taxActor($organization, ['payroll.view', 'payroll.process']);
    ['period' => $period] = taxPayrollSetup($organization, [
        'basic_salary' => 1000,
        'nssa_percent' => 0,
        'pension_percent' => 0,
        'nec_percent' => 1,
        'union_percent' => 2,
    ]);

    $this->actingAs($user)->post("/payroll/periods/{$period->id}/process")->assertRedirect();

    $result = PayrollResult::query()->where('payroll_period_id', $period->id)->firstOrFail();

    // NEC 1% of 1,000 = 10, union 2% of basic = 20, taxable 970.
    // PAYE = 40 + 670 x 25% = 207.50.
    expect(taxLine($result, 'NEC'))->toBe(10.00)
        ->and(taxLine($result, 'UNION'))->toBe(20.00)
        ->and((float) $result->pre_tax_deductions)->toBe(30.00)
        ->and((float) $result->taxable_income)->toBe(970.00)
        ->and(taxLine($result, 'PAYE'))->toBe(207.50);
});

test('a run on an unverified tax table carries a warning', function () {
    $organization = taxOrg('Warning Org', 'WRN');
    $user = taxActor($organization, ['payroll.view', 'payroll.process']);
    ['period' => $period] = taxPayrollSetup($organization);

    $this->actingAs($user)->post("/payroll/periods/{$period->id}/process")->assertRedirect();

    $run = PayrollRun::query()->where('payroll_period_id', $period->id)->firstOrFail();
    expect($run->summary_json['warnings'])->toHaveCount(1)
        ->and($run->summary_json['warnings'][0])->toContain('has not yet been verified');

    PayrollTaxTable::query()->update(['verified_at' => now()]);
    $this->post("/payroll/periods/{$period->id}/process")->assertRedirect();

    $rerun = PayrollRun::query()->where('payroll_period_id', $period->id)->orderByDesc('run_number')->firstOrFail();
    expect($rerun->summary_json['warnings'])->toBe([]);
});

test('a period cannot be closed before it is approved', function () {
    $organization = taxOrg('Close Org', 'CLS');
    $user = taxActor($organization, ['payroll.view', 'payroll.process', 'payroll.approve', 'payroll.close']);
    ['period' => $period] = taxPayrollSetup($organization);

    $this->actingAs($user);
    $this->post("/payroll/periods/{$period->id}/process")->assertRedirect();

    $this->post("/payroll/periods/{$period->id}/close")->assertSessionHasErrors('period');
    expect($period->fresh()->status)->toBe('PROCESSED');

    $this->post("/payroll/periods/{$period->id}/approve")->assertRedirect();
    $this->post("/payroll/periods/{$period->id}/close")->assertSessionHasNoErrors();
    expect($period->fresh()->status)->toBe('CLOSED');
});

test('payslips are held back until the payroll run is approved', function () {
    Queue::fake();

    $organization = taxOrg('Hold Org', 'HLD');
    $user = taxActor($organization, ['payroll.view', 'payroll.process', 'payroll.approve', 'payslips.email']);
    ['period' => $period, 'employee' => $employee] = taxPayrollSetup($organization);

    $employeeUser = User::factory()->create();
    $employee->forceFill(['user_id' => $employeeUser->id])->save();

    $this->actingAs($user);
    $this->post("/payroll/periods/{$period->id}/process")->assertRedirect();
    $result = PayrollResult::query()->where('payroll_period_id', $period->id)->firstOrFail();

    $this->post("/payroll/payslips/{$result->id}/email")
        ->assertSessionHas('error', 'This payslip cannot be sent yet because its payroll run has not been approved.');
    expect(DB::table('payslip_deliveries')->count())->toBe(0);

    $this->post("/payroll/periods/{$period->id}/approve")->assertRedirect();
    $this->post("/payroll/payslips/{$result->id}/email")->assertSessionHas('success');
    expect(DB::table('payslip_deliveries')->count())->toBe(1);
});

test('an early payslip release needs the override permission and is audit-logged', function () {
    Queue::fake();

    $organization = taxOrg('Override Release Org', 'ORL');
    $user = taxActor($organization, ['payroll.view', 'payroll.process', 'payslips.email']);
    ['period' => $period, 'employee' => $employee] = taxPayrollSetup($organization);
    $employee->forceFill(['user_id' => User::factory()->create()->id])->save();

    $this->actingAs($user);
    $this->post("/payroll/periods/{$period->id}/process")->assertRedirect();
    $result = PayrollResult::query()->where('payroll_period_id', $period->id)->firstOrFail();

    $reason = 'Employee needs proof of income for a bank loan today.';

    $this->post("/payroll/payslips/{$result->id}/email", ['override_reason' => $reason])->assertForbidden();
    expect(DB::table('payslip_deliveries')->count())->toBe(0);

    $admin = taxActor($organization, ['payslips.email', 'payslips.release_override']);
    $this->actingAs($admin)
        ->post("/payroll/payslips/{$result->id}/email", ['override_reason' => $reason])
        ->assertSessionHas('success');

    expect(DB::table('payslip_deliveries')->count())->toBe(1)
        ->and(DB::table('audit_logs')->where('event', 'payslip_release_override')->count())->toBe(1);
});
