<?php

use App\Models\Employee;
use App\Models\EmployeePayrollProfile;
use App\Models\Organization;
use App\Models\PayCode;
use App\Models\PayrollInput;
use App\Models\PayrollInputBatch;
use App\Models\PayrollPeriod;
use App\Models\PayrollResult;
use App\Models\PayrollResultLine;
use App\Models\PayrollRun;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Support\Payroll\PayrollCatalogueSynchronizer;
use Illuminate\Http\UploadedFile;
use Inertia\Testing\AssertableInertia as Assert;

function hourlyOrg(string $name, string $code): Organization
{
    return Organization::query()->create([
        'name' => $name,
        'slug' => str($name)->slug()->toString(),
        'code' => $code,
        'status' => 'ACTIVE',
        'timezone' => 'Africa/Harare',
    ]);
}

function hourlyActor(Organization $organization, array $permissionNames = ['payroll.view', 'payroll.inputs.manage', 'payroll.process', 'payroll.export']): User
{
    $permissionIds = collect($permissionNames)
        ->map(fn (string $name) => Permission::query()->firstOrCreate(
            ['name' => $name],
            [
                'module' => str($name)->before('.')->toString(),
                'label' => str($name)->replace(['.', '_'], ' ')->headline()->toString(),
                'description' => 'Generated for hourly input coverage.',
            ],
        )->id)
        ->all();

    $role = Role::query()->create([
        'code' => 'HOURLY_TEST_'.str()->upper(str()->random(8)),
        'name' => 'Hourly Test '.str()->upper(str()->random(4)),
        'description' => 'Temporary hourly role.',
    ]);
    $role->permissions()->sync($permissionIds);

    $user = User::factory()->create();
    $user->attachToOrganization($organization);
    $user->syncRoles([$role->id], $organization->id);
    $user->forceFill(['current_organization_id' => $organization->id])->saveQuietly();

    return $user;
}

/**
 * One hourly worker (5.00 an hour, overtime at 1.5, cost centre CC-PLANT) and one salaried
 * employee, in a November 2026 period. Tax is off so amounts are easy to follow.
 *
 * @return array{period: PayrollPeriod, hourly: Employee, salaried: Employee, codes: \Illuminate\Support\Collection<string, PayCode>}
 */
function hourlySetup(Organization $organization, array $hourlyProfile = []): array
{
    $make = function (string $staffNumber, array $profile) use ($organization) {
        $employee = Employee::query()->create([
            'organization_id' => $organization->id,
            'staff_number' => $staffNumber,
            'first_name' => 'Hourly',
            'surname' => $staffNumber,
            'status' => 'ACTIVE',
        ]);

        EmployeePayrollProfile::query()->create([
            'organization_id' => $organization->id,
            'employee_id' => $employee->id,
            'pay_frequency' => 'MONTHLY',
            'currency' => 'USD',
            'employment_status' => 'ACTIVE',
            'tax_enabled' => false,
            'active' => true,
            'effective_from' => '2026-01-01',
            ...$profile,
        ]);

        return $employee;
    };

    $hourly = $make('HR-001', [
        'pay_basis' => 'HOURLY',
        'basic_salary' => 0,
        'hourly_rate' => 5,
        'overtime_multiplier' => 1.5,
        'pension_percent' => 10,
        'cost_centre' => 'CC-PLANT',
        ...$hourlyProfile,
    ]);
    $salaried = $make('SL-001', [
        'pay_basis' => 'SALARIED',
        'basic_salary' => 1000,
        'hourly_rate' => 5.77,
        'cost_centre' => 'CC-ADMIN',
    ]);

    $period = PayrollPeriod::query()->create([
        'organization_id' => $organization->id,
        'code' => 'PAY-2026-11',
        'name' => 'November 2026 Payroll',
        'frequency' => 'MONTHLY',
        'period_start' => '2026-11-01',
        'period_end' => '2026-11-30',
        'pay_date' => '2026-11-30',
        'currency' => 'USD',
        'status' => 'DRAFT',
    ]);

    $codes = app(PayrollCatalogueSynchronizer::class)->sync($organization->id)->keyBy('code');

    return compact('period', 'hourly', 'salaried', 'codes');
}

function hourlyLine(PayrollPeriod $period, Employee $employee, string $code): ?PayrollResultLine
{
    $result = PayrollResult::query()->where('payroll_period_id', $period->id)->where('employee_id', $employee->id)->latest('id')->first();

    return PayrollResultLine::query()->where('payroll_result_id', $result?->id)->where('code_snapshot', $code)->first();
}

test('daily hours are paid at the employee rate and shown as one line per pay code', function () {
    $organization = hourlyOrg('Hours Org', 'HRS');
    ['period' => $period, 'hourly' => $hourly, 'codes' => $codes] = hourlySetup($organization);
    $this->actingAs(hourlyActor($organization));

    $this->post("/payroll/periods/{$period->id}/hourly", [
        'lines' => [
            ['employee_id' => $hourly->id, 'pay_code_id' => $codes['NORM']->id, 'quantity' => 8, 'work_date' => '2026-11-02'],
            ['employee_id' => $hourly->id, 'pay_code_id' => $codes['NORM']->id, 'quantity' => 8, 'work_date' => '2026-11-03'],
            ['employee_id' => $hourly->id, 'pay_code_id' => $codes['NORM']->id, 'quantity' => 4, 'work_date' => '2026-11-04', 'cost_centre' => 'CC-STORES'],
            ['employee_id' => $hourly->id, 'pay_code_id' => $codes['OT']->id, 'quantity' => 2, 'work_date' => '2026-11-03'],
            ['employee_id' => $hourly->id, 'pay_code_id' => $codes['OT2']->id, 'quantity' => 3, 'work_date' => '2026-11-08'],
        ],
        'control_total' => 25,
        'control_count' => 5,
    ])->assertSessionHasNoErrors();

    $inputs = PayrollInput::query()->where('source', 'HOURLY')->get();
    expect($inputs)->toHaveCount(5)
        ->and((float) $inputs->firstWhere('pay_code_id', $codes['OT']->id)->rate)->toBe(7.5)
        ->and((float) $inputs->firstWhere('pay_code_id', $codes['OT2']->id)->rate)->toBe(10.0)
        ->and($inputs->where('pay_code_id', $codes['NORM']->id)->pluck('cost_centre')->unique()->sort()->values()->all())->toBe(['CC-PLANT', 'CC-STORES']);

    $this->post("/payroll/periods/{$period->id}/process")->assertSessionHasNoErrors();

    // 20 normal hours at 5.00 = 100; 2 OT hours at 7.50 = 15; 3 double-time hours at 10.00 = 30.
    $norm = hourlyLine($period, $hourly, 'NORM');
    expect((float) $norm->amount)->toBe(100.00)
        ->and((float) $norm->quantity)->toBe(20.0)
        ->and($norm->metadata['cost_centres'])->toBe(['CC-PLANT' => 80, 'CC-STORES' => 20])
        ->and((float) hourlyLine($period, $hourly, 'OT')->amount)->toBe(15.00)
        ->and((float) hourlyLine($period, $hourly, 'OT2')->amount)->toBe(30.00)
        ->and(hourlyLine($period, $hourly, 'BASIC'))->toBeNull()
        // Pension of 10% is charged on normal-hours pay for an hourly worker.
        ->and((float) hourlyLine($period, $hourly, 'PENS')->amount)->toBe(10.00);

    $result = PayrollResult::query()->where('employee_id', $hourly->id)->firstOrFail();
    expect((float) $result->gross_pay)->toBe(145.00)
        ->and($result->cost_centre_snapshot)->toBe('CC-PLANT');
});

test('hours control totals are checked on hours, not amounts', function () {
    $organization = hourlyOrg('Hours Control Org', 'HCT');
    ['period' => $period, 'hourly' => $hourly, 'codes' => $codes] = hourlySetup($organization);
    $this->actingAs(hourlyActor($organization));

    $payload = [
        'lines' => [
            ['employee_id' => $hourly->id, 'pay_code_id' => $codes['NORM']->id, 'quantity' => 8],
            ['employee_id' => $hourly->id, 'pay_code_id' => $codes['OT']->id, 'quantity' => 2],
        ],
    ];

    $this->post("/payroll/periods/{$period->id}/hourly", [...$payload, 'control_total' => 12])
        ->assertSessionHasErrors('control_total');
    expect(PayrollInput::query()->count())->toBe(0);

    $this->post("/payroll/periods/{$period->id}/hourly", [...$payload, 'control_total' => 10, 'control_count' => 2])
        ->assertSessionHasNoErrors();

    $batch = PayrollInputBatch::query()->firstOrFail();
    expect((float) $batch->entered_total)->toBe(10.00)
        ->and($batch->metadata['measure'])->toBe('quantity');
});

test('hourly lines are refused for dates outside the period, too many hours in a day, or a missing rate', function () {
    $organization = hourlyOrg('Hours Guard Org', 'HGD');
    ['period' => $period, 'hourly' => $hourly, 'codes' => $codes] = hourlySetup($organization, ['hourly_rate' => null]);
    $this->actingAs(hourlyActor($organization));

    $this->post("/payroll/periods/{$period->id}/hourly", [
        'lines' => [['employee_id' => $hourly->id, 'pay_code_id' => $codes['NORM']->id, 'quantity' => 8, 'work_date' => '2026-10-31']],
    ])->assertSessionHasErrors('lines');

    $this->post("/payroll/periods/{$period->id}/hourly", [
        'lines' => [['employee_id' => $hourly->id, 'pay_code_id' => $codes['NORM']->id, 'quantity' => 8]],
    ])->assertSessionHasErrors(['lines' => 'Nothing was posted. Line 1 (HR-001): The employee has no hourly rate on their payroll profile.']);

    EmployeePayrollProfile::query()->update(['hourly_rate' => 5]);

    $this->post("/payroll/periods/{$period->id}/hourly", [
        'lines' => [
            ['employee_id' => $hourly->id, 'pay_code_id' => $codes['NORM']->id, 'quantity' => 16, 'work_date' => '2026-11-02'],
            ['employee_id' => $hourly->id, 'pay_code_id' => $codes['OT']->id, 'quantity' => 9, 'work_date' => '2026-11-02'],
        ],
    ])->assertSessionHasErrors('lines');

    expect(PayrollInput::query()->count())->toBe(0);
});

test('unit codes such as mileage use the entered rate or the code default', function () {
    $organization = hourlyOrg('Mileage Org', 'MLG');
    ['period' => $period, 'hourly' => $hourly] = hourlySetup($organization);
    $mileage = PayCode::query()->create([
        'organization_id' => $organization->id,
        'code' => 'MILE',
        'description' => 'Mileage',
        'category' => 'ALLOWANCE',
        'type' => 'EARNING',
        'unit' => 'UNITS',
        'default_rate' => 0.45,
        'taxable' => false,
        'affects_gross' => true,
        'affects_net' => true,
        'active' => true,
    ]);
    $this->actingAs(hourlyActor($organization));

    $this->post("/payroll/periods/{$period->id}/hourly", [
        'lines' => [
            ['employee_id' => $hourly->id, 'pay_code_id' => $mileage->id, 'quantity' => 100],
            ['employee_id' => $hourly->id, 'pay_code_id' => $mileage->id, 'quantity' => 10, 'rate' => 0.6],
        ],
    ])->assertSessionHasNoErrors();

    $inputs = PayrollInput::query()->orderBy('id')->get();
    expect($inputs[0]->resolvedAmount())->toBe(45.00)
        ->and($inputs[1]->resolvedAmount())->toBe(6.00);
});

test('hours can be uploaded from a file, and a file with a bad row posts nothing', function () {
    $organization = hourlyOrg('Hours File Org', 'HFL');
    ['period' => $period] = hourlySetup($organization);
    $this->actingAs(hourlyActor($organization));

    $file = fn (array $rows) => UploadedFile::fake()->createWithContent('hours.csv', implode("\n", array_map(
        fn ($row) => implode(',', $row),
        [['staff_number', 'pay_code', 'quantity', 'work_date', 'cost_centre', 'rate', 'notes'], ...$rows],
    ))."\n");

    $this->post("/payroll/periods/{$period->id}/hourly/import", [
        'file' => $file([['HR-001', 'NORM', '8', '2026-11-02', '', '', ''], ['XX-999', 'NORM', '8', '2026-11-02', '', '', '']]),
    ])->assertSessionHasErrors('file');
    expect(PayrollInput::query()->count())->toBe(0);

    $this->post("/payroll/periods/{$period->id}/hourly/import", [
        'file' => $file([['HR-001', 'NORM', '8', '2026-11-02', '', '', ''], ['HR-001', 'ot', '1.5', '2026-11-02', 'CC-STORES', '', 'Stock take']]),
        'control_total' => 9.5,
    ])->assertSessionHasNoErrors();

    $inputs = PayrollInput::query()->orderBy('id')->get();
    expect($inputs)->toHaveCount(2)
        ->and($inputs[0]->cost_centre)->toBe('CC-PLANT')
        ->and($inputs[1]->cost_centre)->toBe('CC-STORES')
        ->and($inputs[1]->notes)->toBe('Stock take');
});

test('an hourly batch can be reversed', function () {
    $organization = hourlyOrg('Hours Reverse Org', 'HRV');
    ['period' => $period, 'hourly' => $hourly, 'codes' => $codes] = hourlySetup($organization);
    $this->actingAs(hourlyActor($organization));

    $this->post("/payroll/periods/{$period->id}/hourly", [
        'lines' => [['employee_id' => $hourly->id, 'pay_code_id' => $codes['NORM']->id, 'quantity' => 8]],
    ])->assertSessionHasNoErrors();

    $batch = PayrollInputBatch::query()->firstOrFail();
    $this->post("/payroll/inputs/batches/{$batch->id}/reverse")->assertSessionHasNoErrors();

    expect(PayrollInput::query()->count())->toBe(0);
});

test('hour codes cannot be added through bulk input', function () {
    $organization = hourlyOrg('Hours Bulk Org', 'HBK');
    ['period' => $period, 'codes' => $codes] = hourlySetup($organization);

    $this->actingAs(hourlyActor($organization))->post('/payroll/inputs/bulk', [
        'payroll_period_id' => $period->id,
        'pay_code_id' => $codes['NORM']->id,
        'action' => 'INSERT',
        'input_mode' => 'FIXED',
        'amount' => 100,
    ])->assertSessionHasErrors('pay_code_id');
});

test('the journal splits hours charged to another cost centre', function () {
    $organization = hourlyOrg('Hours Journal Org', 'HJN');
    ['period' => $period, 'hourly' => $hourly, 'codes' => $codes] = hourlySetup($organization);
    $this->actingAs(hourlyActor($organization));

    $this->post("/payroll/periods/{$period->id}/hourly", [
        'lines' => [
            ['employee_id' => $hourly->id, 'pay_code_id' => $codes['NORM']->id, 'quantity' => 10],
            ['employee_id' => $hourly->id, 'pay_code_id' => $codes['NORM']->id, 'quantity' => 6, 'cost_centre' => 'CC-STORES'],
        ],
    ])->assertSessionHasNoErrors();
    $this->post("/payroll/periods/{$period->id}/process")->assertSessionHasNoErrors();

    $run = PayrollRun::query()->firstOrFail();
    $response = $this->get("/payroll/reports/runs/{$run->id}/journal?format=csv")->assertOk();
    $content = preg_replace('/^\xEF\xBB\xBF/', '', file_get_contents($response->getFile()->getPathname()));
    $csv = array_map('str_getcsv', array_filter(explode("\n", $content)));

    $rows = collect(array_slice($csv, 1))->map(fn ($row) => array_combine($csv[0], $row));
    $norm = $rows->where('code', 'NORM')->keyBy('cost_centre');

    expect($csv[0])->toBe(['gl_account_code', 'cost_centre', 'code', 'description', 'debit', 'credit'])
        ->and((float) $norm['CC-PLANT']['debit'])->toBe(50.0)
        ->and((float) $norm['CC-STORES']['debit'])->toBe(30.0)
        ->and((float) $rows->firstWhere('code', 'BASIC')['debit'])->toBe(1000.0)
        ->and($rows->firstWhere('code', 'BASIC')['cost_centre'])->toBe('CC-ADMIN');
});

test('the hourly page lists employees, hour codes and what has been captured', function () {
    $organization = hourlyOrg('Hours Page Org', 'HPG');
    ['period' => $period, 'hourly' => $hourly, 'codes' => $codes] = hourlySetup($organization);
    $this->actingAs(hourlyActor($organization));

    $this->post("/payroll/periods/{$period->id}/hourly", [
        'lines' => [['employee_id' => $hourly->id, 'pay_code_id' => $codes['NORM']->id, 'quantity' => 8]],
    ]);

    $this->get("/payroll/periods/{$period->id}/hourly")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Payroll/Inputs/Hourly')
            ->has('employees', 2)
            ->where('payCodes', fn ($codes) => collect($codes)->pluck('code')->contains('NORM') && collect($codes)->pluck('code')->contains('OT2') && ! collect($codes)->pluck('code')->contains('BONUS'))
            ->has('summary', 1)
            ->where('summary.0.quantity', 8)
            ->where('summary.0.amount', 40)
        );
});

test('an hourly payroll profile needs an hourly rate', function () {
    $organization = hourlyOrg('Hours Profile Org', 'HPF');
    $employee = Employee::query()->create([
        'organization_id' => $organization->id,
        'staff_number' => 'HP-001',
        'first_name' => 'Hourly',
        'surname' => 'Profile',
        'status' => 'ACTIVE',
    ]);

    $this->actingAs(hourlyActor($organization, ['payroll.view', 'payroll.profile.manage']))->post('/payroll/profiles', [
        'employee_id' => $employee->id,
        'pay_frequency' => 'MONTHLY',
        'pay_basis' => 'HOURLY',
        'currency' => 'USD',
        'basic_salary' => 0,
        'employment_status' => 'ACTIVE',
        'effective_from' => '2026-11-01',
    ])->assertSessionHasErrors('hourly_rate');
});
