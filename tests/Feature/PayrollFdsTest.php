<?php

use App\Models\Employee;
use App\Models\EmployeePayrollProfile;
use App\Models\EmployeeRecurringPayItem;
use App\Models\Organization;
use App\Models\PayCode;
use App\Models\PayrollInput;
use App\Models\PayrollPeriod;
use App\Models\PayrollResult;
use App\Models\PayrollResultLine;
use App\Models\PayrollRun;
use App\Models\PayrollTaxLedgerEntry;
use App\Models\PayrollTaxSetting;
use App\Models\PayrollTaxTable;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Support\Payroll\PayrollCatalogueSynchronizer;
use App\Support\Payroll\PayrollTaxService;
use Inertia\Testing\AssertableInertia as Assert;

function fdsOrg(string $name, string $code): Organization
{
    return Organization::query()->create([
        'name' => $name,
        'slug' => str($name)->slug()->toString(),
        'code' => $code,
        'status' => 'ACTIVE',
        'timezone' => 'Africa/Harare',
    ]);
}

function fdsActor(Organization $organization, array $permissionNames): User
{
    $permissionIds = collect($permissionNames)
        ->map(fn (string $name) => Permission::query()->firstOrCreate(
            ['name' => $name],
            [
                'module' => str($name)->before('.')->toString(),
                'label' => str($name)->replace(['.', '_'], ' ')->headline()->toString(),
                'description' => 'Generated for FDS coverage.',
            ],
        )->id)
        ->all();

    $role = Role::query()->create([
        'code' => 'FDS_TEST_'.str()->upper(str()->random(8)),
        'name' => 'FDS Test '.str()->upper(str()->random(4)),
        'description' => 'Temporary FDS role.',
    ]);
    $role->permissions()->sync($permissionIds);

    $user = User::factory()->create();
    $user->attachToOrganization($organization);
    $user->syncRoles([$role->id], $organization->id);
    $user->forceFill(['current_organization_id' => $organization->id])->saveQuietly();

    return $user;
}

/**
 * Belina's worked example: Mr Ashton earns 600 a month, with NSSA 27, pension 10
 * and a medical aid contribution of 20.
 */
function fdsAshton(Organization $organization, string $taxMethod = 'FDS_AVERAGE'): Employee
{
    $employee = Employee::query()->create([
        'organization_id' => $organization->id,
        'staff_number' => 'FDS-'.str()->upper(str()->random(5)),
        'first_name' => 'Ashton',
        'surname' => 'Example',
        'status' => 'ACTIVE',
        'pay_point' => 'Head Office',
    ]);

    $profile = EmployeePayrollProfile::query()->create([
        'organization_id' => $organization->id,
        'employee_id' => $employee->id,
        'pay_frequency' => 'MONTHLY',
        'currency' => 'USD',
        'basic_salary' => 600,
        // The example's NSSA (27) and pension (10) are entered as one fixed pre-tax
        // deduction of 37, so a bonus does not change them as HRX's NSSA rule would.
        'nssa_percent' => 0,
        'pension_percent' => 6.1667,
        'tax_method' => $taxMethod,
        'employment_status' => 'ACTIVE',
        'tax_enabled' => true,
        'active' => true,
        'effective_from' => '2026-01-01',
    ]);

    $codes = app(PayrollCatalogueSynchronizer::class)->sync($organization->id)->keyBy('code');

    EmployeeRecurringPayItem::query()->create([
        'organization_id' => $organization->id,
        'employee_id' => $employee->id,
        'employee_payroll_profile_id' => $profile->id,
        'pay_code_id' => $codes['MED']->id,
        'input_mode' => 'FIXED',
        'amount' => 20,
        'effective_from' => '2026-01-01',
        'is_active' => true,
    ]);

    return $employee;
}

function fdsPeriod(Organization $organization, int $month): PayrollPeriod
{
    $start = now()->setDate(2026, $month, 1)->startOfDay();

    return PayrollPeriod::query()->create([
        'organization_id' => $organization->id,
        'code' => 'PAY-2026-'.str_pad((string) $month, 2, '0', STR_PAD_LEFT),
        'name' => $start->format('F Y').' Payroll',
        'frequency' => 'MONTHLY',
        'period_start' => $start->toDateString(),
        'period_end' => $start->copy()->endOfMonth()->toDateString(),
        'pay_date' => $start->copy()->endOfMonth()->toDateString(),
        'currency' => 'USD',
        'status' => 'DRAFT',
    ]);
}

function fdsLine(PayrollPeriod $period, Employee $employee, string $code): float
{
    $resultId = PayrollResult::query()
        ->where('payroll_period_id', $period->id)
        ->where('employee_id', $employee->id)
        ->latest('id')
        ->value('id');

    return (float) PayrollResultLine::query()
        ->where('payroll_result_id', $resultId)
        ->where('code_snapshot', $code)
        ->value('amount');
}

test('FDS Average reproduces the Belina worked example', function () {
    $organization = fdsOrg('Ashton Org', 'ASH');
    $user = fdsActor($organization, ['payroll.view', 'payroll.process']);
    $employee = fdsAshton($organization);
    $this->actingAs($user);

    $periods = collect([1, 2, 3])->map(fn (int $month) => fdsPeriod($organization, $month));

    foreach ($periods as $period) {
        $this->post("/payroll/periods/{$period->id}/process")->assertSessionHasNoErrors();
    }

    // Taxable is 563 a month. Annualised 6,756 gives annual tax of 1,269, or 105.75 a
    // month; the medical credit is 50% of 20. PAYE is 95.75 in each month.
    foreach ($periods as $period) {
        expect(fdsLine($period, $employee, 'PAYE'))->toBe(95.75);
    }

    $ledger = PayrollTaxLedgerEntry::query()->where('employee_id', $employee->id)->get();

    expect($ledger)->toHaveCount(3)
        ->and($ledger->pluck('tax_method')->unique()->all())->toBe(['FDS_AVERAGE'])
        ->and(round((float) $ledger->sum('paye'), 2))->toBe(287.25)
        ->and(round((float) $ledger->sum('credits_applied'), 2))->toBe(30.00)
        // The AIDS Levy for the year to date is 3% of 287.25.
        ->and(abs((float) $ledger->sum('aids_levy') - 8.62))->toBeLessThan(0.011);
});

test('FDS Average taxes a bonus at its actual amount after the tax-free portion', function () {
    $organization = fdsOrg('Bonus Org', 'BNS');
    $user = fdsActor($organization, ['payroll.view', 'payroll.process']);
    $employee = fdsAshton($organization);
    PayrollTaxSetting::query()->update(['bonus_tax_free_amount' => 500]);
    $this->actingAs($user);

    $january = fdsPeriod($organization, 1);
    $february = fdsPeriod($organization, 2);
    $march = fdsPeriod($organization, 3);

    PayrollInput::query()->create([
        'organization_id' => $organization->id,
        'payroll_period_id' => $march->id,
        'employee_id' => $employee->id,
        'pay_code_id' => PayCode::query()->withoutGlobalScopes()->where('organization_id', $organization->id)->where('code', 'BONUS')->value('id'),
        'input_mode' => 'FIXED',
        'amount' => 1200,
        'source' => 'MANUAL',
    ]);

    foreach ([$january, $february, $march] as $period) {
        $this->post("/payroll/periods/{$period->id}/process")->assertSessionHasNoErrors();
    }

    // 500 of the 1,200 bonus is tax free. The other 700 is taxed at 25% = 175, on top of
    // the regular 95.75: 270.75 for March, as in Belina's example.
    expect(fdsLine($march, $employee, 'PAYE'))->toBe(270.75);

    $entry = PayrollTaxLedgerEntry::query()->where('payroll_period_id', $march->id)->firstOrFail();
    expect((float) $entry->bonus_exempt)->toBe(500.00)
        ->and((float) $entry->irregular_taxable)->toBe(700.00);
});

test('an employee without a full year of history is taxed as Non-FDS with a warning', function () {
    $organization = fdsOrg('Joiner Org', 'JNR');
    $user = fdsActor($organization, ['payroll.view', 'payroll.process']);
    $employee = fdsAshton($organization);
    $march = fdsPeriod($organization, 3);

    $this->actingAs($user)->post("/payroll/periods/{$march->id}/process")->assertSessionHasNoErrors();

    // Standalone month: 200 x 20% + 263 x 25% = 105.75, and no medical credit.
    expect(fdsLine($march, $employee, 'PAYE'))->toBe(105.75);

    $entry = PayrollTaxLedgerEntry::query()->where('payroll_period_id', $march->id)->firstOrFail();
    $run = PayrollRun::query()->where('payroll_period_id', $march->id)->firstOrFail();

    expect($entry->tax_method)->toBe('NON_FDS')
        ->and($entry->fds_average_paye)->toBeNull()
        ->and(collect($run->summary_json['warnings'])->contains(fn ($warning) => str_contains($warning, 'taxed as Non-FDS')))->toBeTrue();
});

test('an opening balance lets FDS start part-way through the year', function () {
    $organization = fdsOrg('Opening Org', 'OPN');
    $user = fdsActor($organization, ['payroll.view', 'payroll.process']);
    $employee = fdsAshton($organization);

    PayrollTaxLedgerEntry::query()->create([
        'organization_id' => $organization->id,
        'employee_id' => $employee->id,
        'payroll_period_id' => null,
        'tax_year' => 2026,
        'period_end' => '2026-02-28',
        'currency' => 'USD',
        'periods_covered' => 2,
        'is_opening_balance' => true,
        'tax_method' => 'FDS_AVERAGE',
        'regular_taxable' => 1126,
        'medical_contributions' => 40,
        'credits_applied' => 20,
        'paye' => 191.50,
        'aids_levy' => 5.75,
    ]);

    $march = fdsPeriod($organization, 3);
    $this->actingAs($user)->post("/payroll/periods/{$march->id}/process")->assertSessionHasNoErrors();

    expect(fdsLine($march, $employee, 'PAYE'))->toBe(95.75)
        ->and(PayrollTaxLedgerEntry::query()->where('payroll_period_id', $march->id)->value('tax_method'))->toBe('FDS_AVERAGE');
});

test('a Non-FDS employee still gets the FDS Average figure recorded for comparison', function () {
    $organization = fdsOrg('Parallel Org', 'PAR');
    $user = fdsActor($organization, ['payroll.view', 'payroll.process', 'payroll.export']);
    $employee = fdsAshton($organization, 'NON_FDS');
    $january = fdsPeriod($organization, 1);

    $this->actingAs($user)->post("/payroll/periods/{$january->id}/process")->assertSessionHasNoErrors();

    $entry = PayrollTaxLedgerEntry::query()->where('payroll_period_id', $january->id)->firstOrFail();

    expect(fdsLine($january, $employee, 'PAYE'))->toBe(105.75)
        ->and($entry->tax_method)->toBe('NON_FDS')
        ->and((float) $entry->standalone_paye)->toBe(105.75)
        ->and((float) $entry->fds_average_paye)->toBe(95.75);

    $run = PayrollRun::query()->where('payroll_period_id', $january->id)->firstOrFail();
    $this->get("/payroll/reports/runs/{$run->id}/tax-comparison")->assertOk();
});

test('both FDS methods collect exactly the annual tax by December when pay changes', function (string $method) {
    $service = app(PayrollTaxService::class);
    $ytd = ['periods' => 0, 'regular_taxable' => 0.0, 'irregular_taxable' => 0.0, 'bonus_exempt' => 0.0, 'medical' => 0.0, 'credits' => 0.0, 'paye' => 0.0, 'aids_levy' => 0.0];
    $annualIncome = 0.0;

    foreach (range(1, 12) as $month) {
        // A raise in July, and a 2,000 irregular payment in November.
        $regular = $month < 7 ? 900.0 : 1500.0;
        $irregular = $month === 11 ? 2000.0 : 0.0;

        $tax = $service->assess([
            'currency' => 'USD',
            'frequency' => 'MONTHLY',
            'date' => sprintf('2026-%02d-28', $month),
            'organization_id' => null,
            'tax_method' => $method,
            'regular_taxable' => $regular,
            'irregular' => $irregular,
            'bonus' => 0,
            'medical' => 0,
        ], $ytd);

        expect($tax['method_applied'])->toBe($method);

        $ytd['periods']++;
        $ytd['regular_taxable'] += $regular;
        $ytd['irregular_taxable'] += $tax['irregular_taxable'];
        $ytd['paye'] += $tax['paye'];
        $ytd['aids_levy'] += $tax['aids_levy'];
        $annualIncome += $regular + $irregular;
    }

    // 16,400 for the year: 480 + 2,100 + 4,400 x 30% = 3,900.
    expect($annualIncome)->toBe(16400.0)
        ->and(round($ytd['paye'], 2))->toBe(3900.00)
        ->and(round($ytd['aids_levy'], 2))->toBe(117.00);
})->with(['FDS_AVERAGE', 'FDS_FORECAST']);

test('fixed tax credits are spread over the year and need an amount to be entered', function () {
    $service = app(PayrollTaxService::class);
    $input = [
        'currency' => 'USD',
        'frequency' => 'MONTHLY',
        'date' => '2026-01-31',
        'organization_id' => null,
        'tax_method' => 'FDS_AVERAGE',
        'credit_elderly' => true,
        'regular_taxable' => 1000,
        'irregular' => 0,
        'bonus' => 0,
        'medical' => 0,
    ];

    $without = $service->assess($input);
    expect($without['paye'])->toBe(215.00)
        ->and(collect($without['warnings'])->contains(fn ($warning) => str_contains($warning, 'elderly persons tax credit was not applied')))->toBeTrue();

    PayrollTaxSetting::query()->update(['elderly_credit_annual' => 900]);

    // 900 a year is 75 a month.
    expect(app(PayrollTaxService::class)->assess($input)['paye'])->toBe(140.00);
});

test('the tax tables page lists the seeded tables and amounts', function () {
    $organization = fdsOrg('Tables Org', 'TBL');
    $user = fdsActor($organization, ['payroll.view']);

    $this->actingAs($user)->get('/payroll/tax-tables')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Payroll/TaxTables/Index')
            ->has('tables', 5)
            ->has('settings', 1)
            ->where('settings.0.bonus_tax_free_amount', null)
            ->where('canEditSystem', false)
        );
});

test('a specialist edit of a system table is saved for their organization and can be verified', function () {
    $organization = fdsOrg('Specialist Org', 'SPC');
    $user = fdsActor($organization, ['payroll.view', 'payroll.tax.manage']);
    $system = PayrollTaxTable::query()->where('pay_frequency', 'MONTHLY')->firstOrFail();

    $this->actingAs($user)->put("/payroll/tax-tables/{$system->id}", [
        'name' => 'ZIMRA PAYE USD Monthly 2026',
        'currency' => 'USD',
        'pay_frequency' => 'MONTHLY',
        'effective_from' => '2026-01-01',
        'aids_levy_percent' => 3,
        'source' => 'ZIMRA USD tax tables Jan-Dec 2026',
        'verified' => true,
        'bands' => [
            ['upper_bound' => 150, 'rate_percent' => 0],
            ['upper_bound' => 300, 'rate_percent' => 20],
            ['upper_bound' => null, 'rate_percent' => 25],
        ],
    ])->assertSessionHasNoErrors();

    $own = PayrollTaxTable::query()->where('organization_id', $organization->id)->firstOrFail();

    expect($system->fresh()->verified_at)->toBeNull()
        ->and($system->fresh()->bands)->toHaveCount(6)
        ->and($own->verified_at)->not->toBeNull()
        ->and($own->verified_by)->toBe($user->id)
        ->and($own->bands)->toHaveCount(3);

    // 400 taxable: 150 at 0%, 150 at 20% = 30, 100 at 25% = 25.
    $service = app(PayrollTaxService::class);
    expect($service->calculate(400, 'USD', 'MONTHLY', '2026-03-31', $organization->id)['paye'])->toBe(55.00)
        ->and($service->calculate(400, 'USD', 'MONTHLY', '2026-03-31', $organization->id)['verified'])->toBeTrue()
        ->and($service->calculate(400, 'USD', 'MONTHLY', '2026-03-31')['paye'])->toBe(65.00);
});

test('tax table bands must run upward and end open', function () {
    $organization = fdsOrg('Bands Org', 'BND');
    $user = fdsActor($organization, ['payroll.view', 'payroll.tax.manage']);
    $payload = [
        'name' => 'Bad table',
        'currency' => 'USD',
        'pay_frequency' => 'MONTHLY',
        'effective_from' => '2026-01-01',
        'aids_levy_percent' => 3,
    ];

    $this->actingAs($user)->post('/payroll/tax-tables', [
        ...$payload,
        'bands' => [['upper_bound' => 300, 'rate_percent' => 0], ['upper_bound' => 200, 'rate_percent' => 20], ['upper_bound' => null, 'rate_percent' => 25]],
    ])->assertSessionHasErrors('bands');

    $this->post('/payroll/tax-tables', [
        ...$payload,
        'bands' => [['upper_bound' => 300, 'rate_percent' => 0], ['upper_bound' => 900, 'rate_percent' => 20]],
    ])->assertSessionHasErrors('bands');

    expect(PayrollTaxTable::query()->where('organization_id', $organization->id)->count())->toBe(0);
});

test('tax credits and the bonus amount can be entered and verified', function () {
    $organization = fdsOrg('Credits Org', 'CRD');
    $user = fdsActor($organization, ['payroll.view', 'payroll.tax.manage']);
    $system = PayrollTaxSetting::query()->firstOrFail();

    $this->actingAs($user)->put("/payroll/tax-settings/{$system->id}", [
        'currency' => 'USD',
        'effective_from' => '2026-01-01',
        'bonus_tax_free_amount' => 700,
        'elderly_credit_annual' => 900,
        'blind_credit_annual' => '',
        'disabled_credit_annual' => '',
        'medical_credit_percent' => 50,
        'verified' => true,
    ])->assertSessionHasNoErrors();

    $own = PayrollTaxSetting::query()->where('organization_id', $organization->id)->firstOrFail();

    expect((float) $own->bonus_tax_free_amount)->toBe(700.00)
        ->and($own->blind_credit_annual)->toBeNull()
        ->and($own->verified_at)->not->toBeNull()
        ->and($system->fresh()->bonus_tax_free_amount)->toBeNull();

    $resolved = app(PayrollTaxService::class)->resolveSettings('USD', '2026-06-30', $organization->id);
    expect($resolved->id)->toBe($own->id);
});

test('changing tax tables needs the tax management permission', function () {
    $organization = fdsOrg('Guard Org', 'GRD');
    $user = fdsActor($organization, ['payroll.view', 'payroll.manage']);
    $system = PayrollTaxTable::query()->firstOrFail();

    $this->actingAs($user)->put("/payroll/tax-tables/{$system->id}", [])->assertForbidden();
    $this->post('/payroll/tax-settings', [])->assertForbidden();
});
