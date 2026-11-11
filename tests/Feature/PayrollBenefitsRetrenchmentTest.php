<?php

use App\Models\Benefit;
use App\Models\BenefitPlan;
use App\Models\Employee;
use App\Models\EmployeeBenefitDependant;
use App\Models\EmployeeBenefitEnrollment;
use App\Models\EmployeePayrollProfile;
use App\Models\Organization;
use App\Models\PayCode;
use App\Models\PayrollInput;
use App\Models\PayrollPeriod;
use App\Models\PayrollResult;
use App\Models\PayrollResultLine;
use App\Models\PayrollRun;
use App\Models\PayrollTaxLedgerEntry;
use App\Models\PayrollTaxSetting;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Support\Payroll\PayrollCatalogueSynchronizer;
use App\Support\Payroll\PayrollTaxService;
use Illuminate\Support\Facades\DB;

function brOrg(string $name, string $code): Organization
{
    return Organization::query()->create([
        'name' => $name,
        'slug' => str($name)->slug()->toString(),
        'code' => $code,
        'status' => 'ACTIVE',
        'timezone' => 'Africa/Harare',
    ]);
}

function brActor(Organization $organization, array $extra = []): User
{
    $permissionIds = collect(['payroll.view', 'payroll.process', 'payroll.export', 'payroll.inputs.manage', ...$extra])
        ->map(fn (string $name) => Permission::query()->firstOrCreate(
            ['name' => $name],
            ['module' => 'payroll', 'label' => $name, 'description' => 'Generated for benefits coverage.'],
        )->id)
        ->all();

    $role = Role::query()->create([
        'code' => 'BR_TEST_'.str()->upper(str()->random(8)),
        'name' => 'BR Test '.str()->upper(str()->random(4)),
        'description' => 'Temporary role.',
    ]);
    $role->permissions()->sync($permissionIds);

    $user = User::factory()->create();
    $user->attachToOrganization($organization);
    $user->syncRoles([$role->id], $organization->id);
    $user->forceFill(['current_organization_id' => $organization->id])->saveQuietly();

    return $user;
}

function brEmployee(Organization $organization, string $staffNumber, array $profile = [], array $employee = []): Employee
{
    $record = Employee::query()->create([
        'organization_id' => $organization->id,
        'staff_number' => $staffNumber,
        'first_name' => 'Benefit',
        'surname' => $staffNumber,
        'status' => 'ACTIVE',
        ...$employee,
    ]);

    EmployeePayrollProfile::query()->create([
        'organization_id' => $organization->id,
        'employee_id' => $record->id,
        'pay_frequency' => 'MONTHLY',
        'currency' => 'USD',
        'basic_salary' => 1000,
        'employment_status' => 'ACTIVE',
        'tax_enabled' => false,
        'active' => true,
        'effective_from' => '2026-01-01',
        'cost_centre' => 'CC-'.$staffNumber,
        ...$profile,
    ]);

    return $record;
}

function brPeriod(Organization $organization, int $month): PayrollPeriod
{
    $start = now()->setDate(2026, $month, 1)->startOfDay();

    return PayrollPeriod::query()->create([
        'organization_id' => $organization->id,
        'code' => 'PAY-2026-'.str_pad((string) $month, 2, '0', STR_PAD_LEFT),
        'name' => $start->format('F Y'),
        'frequency' => 'MONTHLY',
        'period_start' => $start->toDateString(),
        'period_end' => $start->copy()->endOfMonth()->toDateString(),
        'pay_date' => $start->copy()->endOfMonth()->toDateString(),
        'currency' => 'USD',
        'status' => 'DRAFT',
    ]);
}

function brLine(PayrollPeriod $period, Employee $employee, string $code): ?PayrollResultLine
{
    $resultId = PayrollResult::query()->where('payroll_period_id', $period->id)->where('employee_id', $employee->id)->latest('id')->value('id');

    return PayrollResultLine::query()->where('payroll_result_id', $resultId)->where('code_snapshot', $code)->first();
}

function brMedicalEnrolment(Organization $organization, Employee $employee, array $plan = [], array $dependants = [], string $payrollType = 'MEDICAL'): EmployeeBenefitEnrollment
{
    $benefit = Benefit::query()->create([
        'organization_id' => $organization->id,
        'name' => $payrollType === 'FUNERAL' ? 'Funeral cover' : 'Medical aid',
        'category' => $payrollType === 'FUNERAL' ? 'insurance' : 'health',
        'benefit_type' => 'shared',
        'payroll_deductible' => true,
        'payroll_type' => $payrollType,
        'active' => true,
    ]);

    $benefitPlan = BenefitPlan::query()->create([
        'organization_id' => $organization->id,
        'benefit_id' => $benefit->id,
        'name' => 'Standard',
        'active' => true,
        'employer_contribution_type' => 'percentage',
        'employer_contribution_value' => 50,
        'rate_member' => 100,
        'rate_spouse' => 80,
        'rate_child' => 50,
        'rate_other_dependant' => 60,
        ...$plan,
    ]);

    $enrollment = EmployeeBenefitEnrollment::query()->create([
        'organization_id' => $organization->id,
        'employee_id' => $employee->id,
        'benefit_id' => $benefit->id,
        'benefit_plan_id' => $benefitPlan->id,
        'status' => 'active',
        'effective_date' => '2026-01-01',
    ]);

    foreach ($dependants as $dependant) {
        EmployeeBenefitDependant::query()->create([
            'organization_id' => $organization->id,
            'employee_benefit_enrollment_id' => $enrollment->id,
            'status' => 'active',
            ...$dependant,
        ]);
    }

    return $enrollment;
}

// --- Retrenchment ---

dataset('retrenchment packages', [
    "Belina's example: a third of 12,000" => [12000, 4000.00],
    'the US$3,200 minimum applies' => [6000, 3200.00],
    'the cap of US$5,033.33 applies' => [30000, 5033.33],
    'a package below the minimum is fully exempt' => [2000, 2000.00],
]);

test('the retrenchment exemption is the greater of a third or the minimum, capped', function (float $package, float $exempt) {
    $settings = PayrollTaxSetting::query()->whereNull('organization_id')->where('currency', 'USD')->firstOrFail();

    expect(app(PayrollTaxService::class)->retrenchmentExemption($package, $settings))->toBe($exempt);
})->with('retrenchment packages');

test('the cap counts exemptions already given in the tax year', function () {
    $settings = PayrollTaxSetting::query()->whereNull('organization_id')->where('currency', 'USD')->firstOrFail();

    expect(app(PayrollTaxService::class)->retrenchmentExemption(12000, $settings, 4000))->toBe(1033.33);
});

test('a retrenchment package is taxed only on the part above the exemption', function () {
    $organization = brOrg('Retrench Org', 'RTR');
    $employee = brEmployee($organization, 'RT-001', ['tax_enabled' => true]);
    $period = brPeriod($organization, 3);
    $codes = app(PayrollCatalogueSynchronizer::class)->sync($organization->id)->keyBy('code');

    PayrollInput::query()->create([
        'organization_id' => $organization->id,
        'payroll_period_id' => $period->id,
        'employee_id' => $employee->id,
        'pay_code_id' => $codes['RETR']->id,
        'input_mode' => 'FIXED',
        'amount' => 12000,
        'source' => 'MANUAL',
    ]);

    $this->actingAs(brActor($organization))->post("/payroll/periods/{$period->id}/process")->assertSessionHasNoErrors();

    $result = PayrollResult::query()->where('employee_id', $employee->id)->firstOrFail();
    $ledger = PayrollTaxLedgerEntry::query()->where('employee_id', $employee->id)->firstOrFail();

    // Gross 13,000, of which 4,000 is exempt. Non-FDS monthly table on 9,000:
    // 40 + 175 + 300 + 350 + 6,000 x 40% = 3,265.
    expect((float) $result->gross_pay)->toBe(13000.00)
        ->and((float) $result->taxable_income)->toBe(9000.00)
        ->and((float) brLine($period, $employee, 'PAYE')->amount)->toBe(3265.00)
        ->and((float) $ledger->retrenchment_gross)->toBe(12000.00)
        ->and((float) $ledger->retrenchment_exempt)->toBe(4000.00)
        ->and(brLine($period, $employee, 'PAYE')->metadata['retrenchment_exempt'])->toBe(4000);
});

test('without exemption values the package is fully taxed and the run says so', function () {
    PayrollTaxSetting::query()->update(['retrenchment_exempt_percent' => null, 'retrenchment_exempt_minimum' => null, 'retrenchment_exempt_cap' => null]);

    $tax = app(PayrollTaxService::class)->assess([
        'currency' => 'USD',
        'frequency' => 'MONTHLY',
        'date' => '2026-03-31',
        'organization_id' => null,
        'tax_method' => 'NON_FDS',
        'regular_taxable' => 1000,
        'irregular' => 0,
        'bonus' => 0,
        'retrenchment' => 6000,
        'medical' => 0,
    ]);

    expect($tax['retrenchment_exempt'])->toBe(0.0)
        ->and($tax['taxable_income'])->toBe(7000.0)
        ->and(collect($tax['warnings'])->contains(fn ($warning) => str_contains($warning, 'retrenchment exemption has not been entered')))->toBeTrue();
});

test('a leaver is paid in the month they leave and not after', function () {
    $organization = brOrg('Leaver Org', 'LVR');
    $stayer = brEmployee($organization, 'LV-001');
    $leaver = brEmployee($organization, 'LV-002', ['employment_status' => 'TERMINATED', 'effective_to' => '2026-03-15'], ['status' => 'TERMINATED', 'termination_date' => '2026-03-15']);
    $this->actingAs(brActor($organization));

    $march = brPeriod($organization, 3);
    $april = brPeriod($organization, 4);
    $this->post("/payroll/periods/{$march->id}/process")->assertSessionHasNoErrors();
    $this->post("/payroll/periods/{$april->id}/process")->assertSessionHasNoErrors();

    expect(PayrollResult::query()->where('payroll_period_id', $march->id)->pluck('employee_id')->sort()->values()->all())->toBe([$stayer->id, $leaver->id])
        ->and(PayrollResult::query()->where('payroll_period_id', $april->id)->pluck('employee_id')->all())->toBe([$stayer->id]);
});

// --- Benefits ---

test('a medical aid enrolment is deducted with the family share earning the credit', function () {
    $organization = brOrg('Medical Org', 'MED');
    $employee = brEmployee($organization, 'MD-001', ['tax_enabled' => true, 'tax_method' => 'NON_FDS']);
    $period = brPeriod($organization, 3);

    // Member 100 + spouse 80 + child aged 10 at 50 + child aged 20, not a student, at the
    // other-dependant rate of 60 = 290. The employer pays half: 145.
    brMedicalEnrolment($organization, $employee, [], [
        ['full_name' => 'Spouse', 'relationship' => 'spouse'],
        ['full_name' => 'Young child', 'relationship' => 'child', 'date_of_birth' => '2016-01-01'],
        ['full_name' => 'Adult child', 'relationship' => 'child', 'date_of_birth' => '2006-01-01'],
    ]);

    $this->actingAs(brActor($organization))->post("/payroll/periods/{$period->id}/process")->assertSessionHasNoErrors();

    $result = PayrollResult::query()->where('employee_id', $employee->id)->firstOrFail();

    // Employee's 145 split by premium: family 230/290 = 115, other dependants 30.
    expect((float) brLine($period, $employee, 'MED')->amount)->toBe(115.00)
        ->and((float) brLine($period, $employee, 'MEDD')->amount)->toBe(30.00)
        ->and((float) brLine($period, $employee, 'MED_ER')->amount)->toBe(145.00)
        ->and(brLine($period, $employee, 'MED_ER')->type)->toBe('EMPLOYER')
        ->and(brLine($period, $employee, 'MED')->metadata['members'])->toBe(['member' => 1, 'spouse' => 1, 'child' => 1, 'other_dependant' => 1])
        // The employer's share is not taken from the employee's net pay.
        ->and((float) $result->total_deductions)->toBe((float) PayrollResultLine::query()->where('payroll_result_id', $result->id)->where('type', 'DEDUCTION')->sum('amount'))
        ->and(round((float) $result->gross_pay - (float) $result->total_deductions, 2))->toBe((float) $result->net_pay);
});

test('only the family share of medical aid earns the FDS medical credit', function () {
    $organization = brOrg('Medical Credit Org', 'MCR');
    $employee = brEmployee($organization, 'MC-001', ['tax_enabled' => true, 'tax_method' => 'FDS_AVERAGE']);
    $period = brPeriod($organization, 1);

    brMedicalEnrolment($organization, $employee, [], [
        ['full_name' => 'Parent', 'relationship' => 'parent'],
    ]);

    $this->actingAs(brActor($organization))->post("/payroll/periods/{$period->id}/process")->assertSessionHasNoErrors();

    // Premium 100 + 60 = 160, employer 80, employee 80: family 50, other 30.
    // Medical credit 50% of 50 = 25.
    $ledger = PayrollTaxLedgerEntry::query()->where('employee_id', $employee->id)->firstOrFail();

    expect((float) brLine($period, $employee, 'MED')->amount)->toBe(50.00)
        ->and((float) brLine($period, $employee, 'MEDD')->amount)->toBe(30.00)
        ->and((float) $ledger->medical_contributions)->toBe(50.00)
        ->and((float) $ledger->credits_applied)->toBe(25.00);
});

test('a student child over 18 counts as family', function () {
    $organization = brOrg('Student Org', 'STU');
    $employee = brEmployee($organization, 'ST-001');
    $period = brPeriod($organization, 3);

    brMedicalEnrolment($organization, $employee, ['employer_contribution_value' => 0], [
        ['full_name' => 'Student', 'relationship' => 'child', 'date_of_birth' => '2005-06-01', 'is_student' => true],
    ]);

    $this->actingAs(brActor($organization))->post("/payroll/periods/{$period->id}/process")->assertSessionHasNoErrors();

    expect((float) brLine($period, $employee, 'MED')->amount)->toBe(150.00)
        ->and(brLine($period, $employee, 'MEDD'))->toBeNull();
});

test('a funeral premium comes from the plan rates for each member type', function () {
    $organization = brOrg('Funeral Org', 'FUN');
    $employee = brEmployee($organization, 'FN-001');
    $period = brPeriod($organization, 3);

    brMedicalEnrolment($organization, $employee, [
        'rate_member' => 5,
        'rate_spouse' => 4,
        'rate_child' => 2,
        'rate_other_dependant' => 3,
        'employer_contribution_type' => 'fixed',
        'employer_contribution_value' => 4,
    ], [
        ['full_name' => 'Spouse', 'relationship' => 'spouse'],
        ['full_name' => 'Child', 'relationship' => 'child', 'date_of_birth' => '2018-01-01'],
        ['full_name' => 'Parent', 'relationship' => 'parent'],
    ], 'FUNERAL');

    $this->actingAs(brActor($organization))->post("/payroll/periods/{$period->id}/process")->assertSessionHasNoErrors();

    // 5 + 4 + 2 + 3 = 14 premium, employer pays 4, employee 10 on one FUN line.
    expect((float) brLine($period, $employee, 'FUN')->amount)->toBe(10.00)
        ->and((float) brLine($period, $employee, 'FUN_ER')->amount)->toBe(4.00);
});

test('enrolments without plan rates use the amounts on the enrolment', function () {
    $organization = brOrg('Fixed Org', 'FXD');
    $employee = brEmployee($organization, 'FX-001');
    $period = brPeriod($organization, 3);

    $enrollment = brMedicalEnrolment($organization, $employee, ['rate_member' => null]);
    $enrollment->update(['employee_contribution' => 42, 'employer_contribution' => 58]);

    $this->actingAs(brActor($organization))->post("/payroll/periods/{$period->id}/process")->assertSessionHasNoErrors();

    expect((float) brLine($period, $employee, 'MED')->amount)->toBe(42.00)
        ->and((float) brLine($period, $employee, 'MED_ER')->amount)->toBe(58.00);
});

test('benefits outside payroll, ended or not active are not deducted', function () {
    $organization = brOrg('Skip Org', 'SKP');
    $none = brEmployee($organization, 'SK-001');
    $ended = brEmployee($organization, 'SK-002');
    $draft = brEmployee($organization, 'SK-003');
    $period = brPeriod($organization, 3);

    brMedicalEnrolment($organization, $none, [], [], 'NONE');
    brMedicalEnrolment($organization, $ended)->update(['end_date' => '2026-02-28']);
    brMedicalEnrolment($organization, $draft)->update(['status' => 'draft']);

    $this->actingAs(brActor($organization))->post("/payroll/periods/{$period->id}/process")->assertSessionHasNoErrors();

    expect(PayrollResultLine::query()->whereIn('code_snapshot', ['MED', 'MEDD', 'MED_ER'])->count())->toBe(0);
});

test('a medical deduction entered on payroll as well as through benefits is flagged', function () {
    $organization = brOrg('Double Org', 'DBL');
    $employee = brEmployee($organization, 'DB-001');
    $period = brPeriod($organization, 3);
    $codes = app(PayrollCatalogueSynchronizer::class)->sync($organization->id)->keyBy('code');
    brMedicalEnrolment($organization, $employee);

    PayrollInput::query()->create([
        'organization_id' => $organization->id,
        'payroll_period_id' => $period->id,
        'employee_id' => $employee->id,
        'pay_code_id' => $codes['MED']->id,
        'input_mode' => 'FIXED',
        'amount' => 50,
        'source' => 'MANUAL',
    ]);

    $this->actingAs(brActor($organization))->post("/payroll/periods/{$period->id}/process")->assertSessionHasNoErrors();

    $run = PayrollRun::query()->firstOrFail();
    expect(collect($run->summary_json['warnings'])->contains(fn ($warning) => str_contains($warning, 'deducted twice')))->toBeTrue();
});

test('the journal books employer contributions as an expense and a payable', function () {
    $organization = brOrg('Journal Benefit Org', 'JBN');
    $employee = brEmployee($organization, 'JB-001');
    $period = brPeriod($organization, 3);
    brMedicalEnrolment($organization, $employee);

    $this->actingAs(brActor($organization))->post("/payroll/periods/{$period->id}/process")->assertSessionHasNoErrors();

    $run = PayrollRun::query()->firstOrFail();
    $response = $this->get("/payroll/reports/runs/{$run->id}/journal?format=csv")->assertOk();
    $content = preg_replace('/^\xEF\xBB\xBF/', '', file_get_contents($response->getFile()->getPathname()));
    $csv = array_map('str_getcsv', array_filter(explode("\n", $content)));
    $rows = collect(array_slice($csv, 1))->map(fn ($row) => array_combine($csv[0], $row))->where('code', 'MED_ER')->values();

    expect($rows)->toHaveCount(2)
        ->and((float) $rows->sum('debit'))->toBe(50.0)
        ->and((float) $rows->sum('credit'))->toBe(50.0);
});

test('plan rates per member type are saved from the benefit page', function () {
    $organization = brOrg('Plan Org', 'PLN');
    $user = brActor($organization, ['benefits.view', 'benefits.plans.manage']);
    $benefit = Benefit::query()->create([
        'organization_id' => $organization->id,
        'name' => 'Medical aid',
        'category' => 'health',
        'benefit_type' => 'shared',
        'payroll_type' => 'MEDICAL',
        'active' => true,
    ]);

    $this->actingAs($user)->post("/benefits/{$benefit->id}/plans", [
        'name' => 'Family plan',
        'code' => 'FAM',
        'employer_contribution_type' => 'percentage',
        'employer_contribution_value' => 50,
        'rate_member' => 120,
        'rate_spouse' => 90,
        'rate_child' => 40,
        'rate_other_dependant' => 70,
    ])->assertSessionHasNoErrors();

    $plan = BenefitPlan::query()->where('code', 'FAM')->first();

    expect($plan)->not->toBeNull()
        ->and((float) $plan->rate_member)->toBe(120.0)
        ->and((float) $plan->employer_contribution_value)->toBe(50.0);
});

// --- CILL ---

test('an existing cellphone allowance under CILL is moved to CELL and CILL becomes cash in lieu of leave', function () {
    $organization = brOrg('Cill Org', 'CIL');
    $cell = PayCode::query()->create([
        'organization_id' => $organization->id,
        'code' => 'CILL',
        'description' => 'Cellphone allowance',
        'category' => 'ALLOWANCE',
        'type' => 'EARNING',
        'active' => true,
    ]);

    // The same data step the migration runs, against this organization's codes.
    (function () {
        $organizations = DB::table('pay_codes')->where('code', 'CILL')->where('description', 'Cellphone allowance')->pluck('organization_id');

        foreach ($organizations as $organizationId) {
            if (! DB::table('pay_codes')->where('organization_id', $organizationId)->where('code', 'CELL')->exists()) {
                DB::table('pay_codes')->where('organization_id', $organizationId)->where('code', 'CILL')->update(['code' => 'CELL']);
            }
        }
    })();

    $codes = app(PayrollCatalogueSynchronizer::class)->sync($organization->id)->keyBy('code');

    expect($codes['CELL']->id)->toBe($cell->id)
        ->and($codes['CELL']->description)->toBe('Cellphone allowance')
        ->and($codes['CILL']->description)->toBe('Cash in lieu of leave')
        ->and($codes['CILL']->income_type)->toBe('IRREGULAR');
});

test('the benefit page opens and shows plan rates', function () {
    $organization = brOrg('Benefit Page Org', 'BPG');
    $user = brActor($organization, ['benefits.view']);
    $benefit = Benefit::query()->create([
        'organization_id' => $organization->id,
        'name' => 'Medical aid',
        'category' => 'health',
        'benefit_type' => 'shared',
        'payroll_type' => 'MEDICAL',
        'active' => true,
        'created_by' => $user->id,
    ]);
    BenefitPlan::query()->create(['organization_id' => $organization->id, 'benefit_id' => $benefit->id, 'name' => 'Standard', 'active' => true, 'rate_member' => 100]);

    $this->actingAs($user)->get("/benefits/{$benefit->id}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Benefits/Show')
            ->where('benefit.payroll_type', 'MEDICAL')
            ->where('benefit.created_by.id', $user->id)
            ->where('benefit.plans.0.rate_member', '100.00')
        );
});
