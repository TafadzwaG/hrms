<?php

use App\Models\Employee;
use App\Models\EmployeePayrollProfile;
use App\Models\Organization;
use App\Models\OrgUnit;
use App\Models\PayCode;
use App\Models\PayrollInput;
use App\Models\PayrollInputBatch;
use App\Models\PayrollInputLayout;
use App\Models\PayrollPeriod;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Support\Payroll\PayrollCatalogueSynchronizer;
use Illuminate\Http\UploadedFile;
use Inertia\Testing\AssertableInertia as Assert;
use OpenSpout\Common\Entity\Row;
use OpenSpout\Writer\XLSX\Writer as XlsxWriter;

function inputOrg(string $name, string $code): Organization
{
    return Organization::query()->create([
        'name' => $name,
        'slug' => str($name)->slug()->toString(),
        'code' => $code,
        'status' => 'ACTIVE',
        'timezone' => 'Africa/Harare',
    ]);
}

function inputActor(Organization $organization, array $permissionNames = ['payroll.view', 'payroll.inputs.manage', 'payroll.process']): User
{
    $permissionIds = collect($permissionNames)
        ->map(fn (string $name) => Permission::query()->firstOrCreate(
            ['name' => $name],
            [
                'module' => str($name)->before('.')->toString(),
                'label' => str($name)->replace(['.', '_'], ' ')->headline()->toString(),
                'description' => 'Generated for input method coverage.',
            ],
        )->id)
        ->all();

    $role = Role::query()->create([
        'code' => 'INPUT_TEST_'.str()->upper(str()->random(8)),
        'name' => 'Input Test '.str()->upper(str()->random(4)),
        'description' => 'Temporary input role.',
    ]);
    $role->permissions()->sync($permissionIds);

    $user = User::factory()->create();
    $user->attachToOrganization($organization);
    $user->syncRoles([$role->id], $organization->id);
    $user->forceFill(['current_organization_id' => $organization->id])->saveQuietly();

    return $user;
}

/**
 * Four employees: two in Finance (cost centre CC-FIN), two in Operations (CC-OPS).
 *
 * @return array{period: PayrollPeriod, employees: \Illuminate\Support\Collection<int, Employee>, codes: \Illuminate\Support\Collection<string, PayCode>, finance: OrgUnit}
 */
function inputSetup(Organization $organization): array
{
    $finance = OrgUnit::query()->create(['organization_id' => $organization->id, 'name' => 'Finance', 'type' => 'DEPARTMENT', 'code' => 'FIN-'.$organization->id]);
    $operations = OrgUnit::query()->create(['organization_id' => $organization->id, 'name' => 'Operations', 'type' => 'DEPARTMENT', 'code' => 'OPS-'.$organization->id]);

    $employees = collect([
        ['IN-001', $finance, 'CC-FIN'],
        ['IN-002', $finance, 'CC-FIN'],
        ['IN-003', $operations, 'CC-OPS'],
        ['IN-004', $operations, 'CC-OPS'],
    ])->map(function (array $row) use ($organization) {
        [$staffNumber, $unit, $costCentre] = $row;

        $employee = Employee::query()->create([
            'organization_id' => $organization->id,
            'staff_number' => $staffNumber,
            'first_name' => 'Input',
            'surname' => $staffNumber,
            'status' => 'ACTIVE',
            'org_unit_id' => $unit->id,
        ]);

        EmployeePayrollProfile::query()->create([
            'organization_id' => $organization->id,
            'employee_id' => $employee->id,
            'pay_frequency' => 'MONTHLY',
            'currency' => 'USD',
            'basic_salary' => 1000,
            'cost_centre' => $costCentre,
            'employment_status' => 'ACTIVE',
            'tax_enabled' => true,
            'active' => true,
            'effective_from' => '2026-01-01',
        ]);

        return $employee;
    });

    $period = PayrollPeriod::query()->create([
        'organization_id' => $organization->id,
        'code' => 'PAY-2026-03',
        'name' => 'March 2026 Payroll',
        'frequency' => 'MONTHLY',
        'period_start' => '2026-03-01',
        'period_end' => '2026-03-31',
        'pay_date' => '2026-03-31',
        'currency' => 'USD',
        'status' => 'DRAFT',
    ]);

    $codes = app(PayrollCatalogueSynchronizer::class)->sync($organization->id)->keyBy('code');

    return compact('period', 'employees', 'codes', 'finance');
}

function inputCsv(array $rows): UploadedFile
{
    $lines = array_map(fn (array $row) => implode(',', $row), [['staff_number', 'pay_code', 'amount', 'quantity', 'rate', 'reference', 'notes'], ...$rows]);

    return UploadedFile::fake()->createWithContent('inputs.csv', implode("\n", $lines)."\n");
}

test('bulk input adds a pay code for one department only', function () {
    $organization = inputOrg('Bulk Org', 'BLK');
    ['period' => $period, 'codes' => $codes, 'finance' => $finance] = inputSetup($organization);

    $this->actingAs(inputActor($organization))->post('/payroll/inputs/bulk', [
        'payroll_period_id' => $period->id,
        'pay_code_id' => $codes['BONUS']->id,
        'action' => 'INSERT',
        'input_mode' => 'FIXED',
        'amount' => 250,
        'org_unit_ids' => [$finance->id],
    ])->assertSessionHasNoErrors();

    $inputs = PayrollInput::query()->where('payroll_period_id', $period->id)->get();
    $batch = PayrollInputBatch::query()->firstOrFail();

    expect($inputs)->toHaveCount(2)
        ->and($inputs->pluck('employee.staff_number')->sort()->values()->all())->toBe(['IN-001', 'IN-002'])
        ->and($inputs->pluck('source')->unique()->all())->toBe(['BULK'])
        ->and($batch->source)->toBe('BULK')
        ->and($batch->entered_count)->toBe(2)
        ->and((float) $batch->entered_total)->toBe(500.00);
});

test('bulk input by cost centre, then bulk delete, then reversing the delete restores it', function () {
    $organization = inputOrg('Bulk Delete Org', 'BLD');
    ['period' => $period, 'codes' => $codes] = inputSetup($organization);
    $this->actingAs(inputActor($organization));

    $this->post('/payroll/inputs/bulk', [
        'payroll_period_id' => $period->id,
        'pay_code_id' => $codes['CILL']->id,
        'action' => 'INSERT',
        'input_mode' => 'FIXED',
        'amount' => 30,
        'cost_centres' => ['CC-OPS'],
    ])->assertSessionHasNoErrors();
    expect(PayrollInput::query()->count())->toBe(2);

    $this->post('/payroll/inputs/bulk', [
        'payroll_period_id' => $period->id,
        'pay_code_id' => $codes['CILL']->id,
        'action' => 'DELETE',
    ])->assertSessionHasNoErrors();
    expect(PayrollInput::query()->count())->toBe(0);

    $delete = PayrollInputBatch::query()->where('action', 'DELETE')->firstOrFail();
    expect($delete->entered_count)->toBe(2)->and((float) $delete->entered_total)->toBe(60.00);

    $this->post("/payroll/inputs/batches/{$delete->id}/reverse")->assertSessionHasNoErrors();
    expect(PayrollInput::query()->count())->toBe(2)
        ->and((float) PayrollInput::query()->sum('amount'))->toBe(60.00)
        ->and($delete->fresh()->status)->toBe('REVERSED');
});

test('system calculated pay codes cannot be entered in bulk', function () {
    $organization = inputOrg('Bulk Guard Org', 'BLG');
    ['period' => $period, 'codes' => $codes] = inputSetup($organization);

    $this->actingAs(inputActor($organization))->post('/payroll/inputs/bulk', [
        'payroll_period_id' => $period->id,
        'pay_code_id' => $codes['PAYE']->id,
        'action' => 'INSERT',
        'input_mode' => 'FIXED',
        'amount' => 10,
    ])->assertSessionHasErrors('pay_code_id');

    expect(PayrollInput::query()->count())->toBe(0);
});

test('an import that misses its control totals posts nothing unless accepted', function () {
    $organization = inputOrg('Control Org', 'CTL');
    ['period' => $period] = inputSetup($organization);
    $this->actingAs(inputActor($organization));

    $file = fn () => inputCsv([
        ['IN-001', 'BONUS', '100', '', '', 'Q1', ''],
        ['IN-002', 'BONUS', '150', '', '', 'Q1', ''],
    ]);

    $this->post('/payroll/inputs/import', [
        'payroll_period_id' => $period->id,
        'file' => $file(),
        'control_total' => 300,
        'control_count' => 2,
    ])->assertSessionHasErrors('control_total');

    expect(PayrollInput::query()->count())->toBe(0)
        ->and(PayrollInputBatch::query()->count())->toBe(0);

    $this->post('/payroll/inputs/import', [
        'payroll_period_id' => $period->id,
        'file' => $file(),
        'control_total' => 250,
        'control_count' => 2,
    ])->assertSessionHasNoErrors()->assertSessionHas('success');

    expect(PayrollInput::query()->count())->toBe(2);

    $this->post('/payroll/inputs/import', [
        'payroll_period_id' => $period->id,
        'file' => $file(),
        'control_total' => 999,
        'accept_mismatch' => true,
    ])->assertSessionHasNoErrors();

    $last = PayrollInputBatch::query()->latest('id')->firstOrFail();
    expect($last->metadata['control_differences'])->toHaveCount(1);
});

test('payroll inputs can be imported from an Excel workbook', function () {
    $organization = inputOrg('Excel Org', 'XLS');
    ['period' => $period] = inputSetup($organization);

    $path = tempnam(sys_get_temp_dir(), 'inputs').'.xlsx';
    $writer = new XlsxWriter;
    $writer->openToFile($path);
    $writer->addRow(Row::fromValues(['Staff Number', 'Pay Code', 'Amount', 'Quantity', 'Rate', 'Reference', 'Notes']));
    $writer->addRow(Row::fromValues(['IN-001', 'BONUS', 120.5, null, null, 'XL', 'From Excel']));
    $writer->addRow(Row::fromValues(['IN-003', 'OT', null, 4, 12.5, 'XL', null]));
    $writer->close();

    $this->actingAs(inputActor($organization))->post('/payroll/inputs/import', [
        'payroll_period_id' => $period->id,
        'file' => new UploadedFile($path, 'inputs.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', null, true),
    ])->assertSessionHasNoErrors();

    $inputs = PayrollInput::query()->orderBy('id')->get();

    expect($inputs)->toHaveCount(2)
        ->and((float) $inputs[0]->amount)->toBe(120.50)
        ->and($inputs[1]->input_mode)->toBe('RATE_X_QTY')
        ->and($inputs[1]->resolvedAmount())->toBe(50.00);
});

test('reversing an import restores inputs it overwrote', function () {
    $organization = inputOrg('Restore Org', 'RST');
    ['period' => $period] = inputSetup($organization);
    $this->actingAs(inputActor($organization));

    $this->post('/payroll/inputs/import', ['payroll_period_id' => $period->id, 'file' => inputCsv([['IN-001', 'BONUS', '100', '', '', 'Q1', '']])]);
    $this->post('/payroll/inputs/import', ['payroll_period_id' => $period->id, 'file' => inputCsv([['IN-001', 'BONUS', '400', '', '', 'Q1', ''], ['IN-002', 'BONUS', '50', '', '', 'Q1', '']])]);

    expect((float) PayrollInput::query()->sum('amount'))->toBe(450.00);

    $second = PayrollInputBatch::query()->latest('id')->firstOrFail();
    $this->post("/payroll/inputs/batches/{$second->id}/reverse")->assertSessionHasNoErrors();

    $remaining = PayrollInput::query()->get();
    expect($remaining)->toHaveCount(1)
        ->and((float) $remaining[0]->amount)->toBe(100.00);
});

test('a batch cannot be reversed once one of its inputs was edited by hand', function () {
    $organization = inputOrg('Edited Org', 'EDT');
    ['period' => $period, 'employees' => $employees, 'codes' => $codes] = inputSetup($organization);
    $this->actingAs(inputActor($organization));

    $this->post('/payroll/inputs/import', ['payroll_period_id' => $period->id, 'file' => inputCsv([['IN-001', 'BONUS', '100', '', '', 'Q1', '']])]);
    $input = PayrollInput::query()->firstOrFail();

    $this->put("/payroll/inputs/{$input->id}", [
        'payroll_period_id' => $period->id,
        'employee_id' => $employees[0]->id,
        'pay_code_id' => $codes['BONUS']->id,
        'input_mode' => 'FIXED',
        'amount' => 175,
        'reference' => 'Q1',
    ])->assertSessionHasNoErrors();

    $batch = PayrollInputBatch::query()->firstOrFail();
    $this->post("/payroll/inputs/batches/{$batch->id}/reverse")->assertSessionHasErrors('batch');

    expect((float) $input->fresh()->amount)->toBe(175.00)
        ->and($batch->fresh()->status)->toBe('POSTED');
});

test('inputs cannot be added to an approved period by any method', function () {
    $organization = inputOrg('Locked Org', 'LCK');
    ['period' => $period, 'employees' => $employees, 'codes' => $codes] = inputSetup($organization);
    $period->update(['status' => 'APPROVED']);
    $this->actingAs(inputActor($organization));

    $this->post('/payroll/inputs', [
        'payroll_period_id' => $period->id,
        'employee_id' => $employees[0]->id,
        'pay_code_id' => $codes['BONUS']->id,
        'input_mode' => 'FIXED',
        'amount' => 10,
    ])->assertSessionHasErrors('payroll_period_id');

    $this->post('/payroll/inputs/bulk', [
        'payroll_period_id' => $period->id,
        'pay_code_id' => $codes['BONUS']->id,
        'action' => 'INSERT',
        'input_mode' => 'FIXED',
        'amount' => 10,
    ])->assertSessionHasErrors('payroll_period_id');

    $this->post("/payroll/periods/{$period->id}/grid", [
        'cells' => [['employee_id' => $employees[0]->id, 'pay_code_id' => $codes['BONUS']->id, 'amount' => 10]],
    ])->assertSessionHasErrors('payroll_period_id');

    expect(PayrollInput::query()->count())->toBe(0);
});

test('the grid posts changed cells as one batch and clears emptied ones', function () {
    $organization = inputOrg('Grid Org', 'GRD');
    ['period' => $period, 'employees' => $employees, 'codes' => $codes] = inputSetup($organization);
    $this->actingAs(inputActor($organization));

    $this->post("/payroll/periods/{$period->id}/grid", [
        'cells' => [
            ['employee_id' => $employees[0]->id, 'pay_code_id' => $codes['BONUS']->id, 'amount' => 100],
            ['employee_id' => $employees[1]->id, 'pay_code_id' => $codes['BONUS']->id, 'amount' => 200],
            ['employee_id' => $employees[1]->id, 'pay_code_id' => $codes['CILL']->id, 'amount' => 25],
        ],
        'control_total' => 325,
    ])->assertSessionHasNoErrors();

    expect(PayrollInput::query()->where('reference', 'GRID')->count())->toBe(3);

    $this->post("/payroll/periods/{$period->id}/grid", [
        'cells' => [
            ['employee_id' => $employees[0]->id, 'pay_code_id' => $codes['BONUS']->id, 'amount' => 150],
            ['employee_id' => $employees[1]->id, 'pay_code_id' => $codes['CILL']->id, 'amount' => null],
        ],
    ])->assertSessionHasNoErrors();

    $inputs = PayrollInput::query()->where('reference', 'GRID')->get();
    expect($inputs)->toHaveCount(2)
        ->and((float) $inputs->sum('amount'))->toBe(350.00);

    $this->get("/payroll/periods/{$period->id}/grid?codes[]={$codes['BONUS']->id}&codes[]={$codes['PAYE']->id}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Payroll/Inputs/Grid')
            ->has('columns', 1)
            ->has('rows', 4)
            ->where('rows.0.cells.'.$codes['BONUS']->id, 150)
        );
});

test('the grid refuses pay codes it does not offer', function () {
    $organization = inputOrg('Grid Guard Org', 'GGD');
    ['period' => $period, 'employees' => $employees, 'codes' => $codes] = inputSetup($organization);

    $this->actingAs(inputActor($organization))->post("/payroll/periods/{$period->id}/grid", [
        'cells' => [['employee_id' => $employees[0]->id, 'pay_code_id' => $codes['NSSA']->id, 'amount' => 10]],
    ])->assertSessionHasErrors('cells');
});

test('grid layouts can be saved, loaded and removed', function () {
    $organization = inputOrg('Layout Org', 'LAY');
    ['period' => $period, 'codes' => $codes] = inputSetup($organization);
    $this->actingAs(inputActor($organization));

    $this->post('/payroll/inputs/layouts', [
        'name' => 'Monthly variables',
        'pay_code_ids' => [$codes['BONUS']->id, $codes['CILL']->id],
    ])->assertSessionHasNoErrors();

    $layout = PayrollInputLayout::query()->firstOrFail();

    $this->get("/payroll/periods/{$period->id}/grid?layout={$layout->id}")
        ->assertInertia(fn (Assert $page) => $page->has('columns', 2)->where('activeLayoutId', $layout->id));

    $this->delete("/payroll/inputs/layouts/{$layout->id}")->assertSessionHasNoErrors();
    expect(PayrollInputLayout::query()->count())->toBe(0);
});

test('payslip input previews the payslip without saving anything', function () {
    $organization = inputOrg('Payslip Org', 'PSI');
    ['period' => $period, 'employees' => $employees, 'codes' => $codes] = inputSetup($organization);
    $user = inputActor($organization);

    PayrollInput::query()->create([
        'organization_id' => $organization->id,
        'payroll_period_id' => $period->id,
        'employee_id' => $employees[1]->id,
        'pay_code_id' => $codes['BONUS']->id,
        'input_mode' => 'FIXED',
        'amount' => 200,
        'source' => 'MANUAL',
    ]);

    $this->actingAs($user)->get("/payroll/periods/{$period->id}/employees/{$employees[1]->id}/payslip-input")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Payroll/Inputs/Payslip')
            ->where('employee.staff_number', 'IN-002')
            ->has('inputs', 1)
            ->where('preview.gross_pay', 1200)
            // 1,200 taxable: 40 + 175 + 200 x 30% = 275 PAYE, plus 3% AIDS Levy = 8.25.
            ->where('preview.tax', 283.25)
            ->where('preview.net_pay', 916.75)
            ->where('processed', null)
            ->where('navigation.previous_id', $employees[0]->id)
            ->where('navigation.next_id', $employees[2]->id)
        );

    expect(\App\Models\PayrollResult::query()->count())->toBe(0)
        ->and(\App\Models\PayrollTaxLedgerEntry::query()->count())->toBe(0);
});

test('payslip input shows the processed figures next to the preview', function () {
    $organization = inputOrg('Payslip Processed Org', 'PSP');
    ['period' => $period, 'employees' => $employees] = inputSetup($organization);
    $this->actingAs(inputActor($organization));

    $this->post("/payroll/periods/{$period->id}/process")->assertSessionHasNoErrors();

    $this->get("/payroll/periods/{$period->id}/employees/{$employees[0]->id}/payslip-input")
        ->assertInertia(fn (Assert $page) => $page
            ->where('processed.gross_pay', 1000)
            ->where('preview.net_pay', fn ($net) => (float) $net === (float) $page->toArray()['props']['processed']['net_pay'])
        );
});

test('the batches page lists batches with their control totals', function () {
    $organization = inputOrg('Batch List Org', 'BTL');
    ['period' => $period, 'codes' => $codes] = inputSetup($organization);
    $this->actingAs(inputActor($organization));

    $this->post('/payroll/inputs/bulk', [
        'payroll_period_id' => $period->id,
        'pay_code_id' => $codes['BONUS']->id,
        'action' => 'INSERT',
        'input_mode' => 'FIXED',
        'amount' => 10,
        'control_count' => 4,
    ])->assertSessionHasNoErrors();

    $this->get('/payroll/inputs/batches')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Payroll/Inputs/Batches')
            ->has('batches.data', 1)
            ->where('batches.data.0.batch_number', 'B-00001')
            ->where('batches.data.0.control_count', 4)
            ->where('batches.data.0.entered_count', 4)
        );
});
