<?php

use App\Jobs\SendPayslipEmailJob;
use App\Jobs\SendPayslipSmsJob;
use App\Mail\PayslipMail;
use App\Models\AuditLog;
use App\Models\Employee;
use App\Models\Organization;
use App\Models\PayrollPeriod;
use App\Models\PayrollResult;
use App\Models\PayrollResultLine;
use App\Models\PayrollRun;
use App\Models\PayslipDelivery;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Support\Audit\AuditLogger;
use App\Support\Payslips\PayslipPdfService;
use App\Support\Payslips\PayslipViewService;
use App\Support\Sms\SmsTransport;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use Inertia\Testing\AssertableInertia as Assert;

function payslipOrg(string $name, string $code): Organization
{
    return Organization::query()->create([
        'name' => $name,
        'slug' => str($name)->slug()->toString(),
        'code' => $code,
        'status' => 'ACTIVE',
        'timezone' => 'Africa/Johannesburg',
    ]);
}

function payslipActor(Organization $organization, array $permissionNames): User
{
    $permissionIds = collect($permissionNames)
        ->map(function (string $name) {
            $module = str($name)->before('.')->toString();

            return Permission::query()->firstOrCreate(
                ['name' => $name],
                [
                    'module' => $module,
                    'label' => str($name)->replace(['.', '_'], ' ')->headline()->toString(),
                    'description' => 'Generated for payslip feature coverage.',
                ],
            )->id;
        })
        ->all();

    $role = Role::query()->create([
        'code' => 'PAYSLIP_TEST_'.str()->upper(str()->random(8)),
        'name' => 'Payslip Test '.str()->upper(str()->random(4)),
        'description' => 'Temporary role for payslip distribution tests.',
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

/**
 * @return array{employee: Employee, result: PayrollResult, period: PayrollPeriod}
 */
function payslipFixture(Organization $organization, string $staffNumber, string $namePrefix = 'Payslip'): array
{
    static $periodSequence = 0;
    $periodStart = now()->startOfMonth()->addMonths($periodSequence);
    $periodEnd = (clone $periodStart)->endOfMonth();
    $periodSequence++;

    $employeeUser = User::factory()->create([
        'name' => $namePrefix.' User',
        'email' => strtolower($staffNumber).'@example.com',
    ]);

    $employee = Employee::query()->create([
        'organization_id' => $organization->id,
        'user_id' => $employeeUser->id,
        'staff_number' => $staffNumber,
        'first_name' => $namePrefix,
        'surname' => 'Employee',
        'contact_number' => '+263771234567',
        'status' => 'ACTIVE',
        'pay_point' => 'Head Office',
    ]);

    $period = PayrollPeriod::query()->create([
        'organization_id' => $organization->id,
        'code' => 'PAY-'.str()->upper(str()->random(6)),
        'name' => $namePrefix.' Period',
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
        'summary_json' => ['source' => 'test'],
    ]);

    $result = PayrollResult::query()->create([
        'organization_id' => $organization->id,
        'payroll_run_id' => $run->id,
        'payroll_period_id' => $period->id,
        'employee_id' => $employee->id,
        'employee_payroll_profile_id' => null,
        'staff_number_snapshot' => $employee->staff_number,
        'employee_name_snapshot' => $employee->full_name,
        'department_snapshot' => 'Finance',
        'position_snapshot' => 'Analyst',
        'pay_point_snapshot' => 'Head Office',
        'currency_snapshot' => 'USD',
        'bank_account_name_snapshot' => $employee->full_name,
        'bank_account_number_snapshot' => '1234567890',
        'bank_name_snapshot' => 'Steward Bank',
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
        'snapshot' => ['source' => 'test'],
    ]);

    PayrollResultLine::query()->create([
        'organization_id' => $organization->id,
        'payroll_result_id' => $result->id,
        'pay_code_id' => null,
        'code_snapshot' => 'BASIC',
        'description_snapshot' => 'Basic salary',
        'type' => 'EARNING',
        'category' => 'SALARY',
        'input_source' => 'SYSTEM',
        'amount' => 1000,
        'quantity' => 1,
        'rate' => 1000,
        'taxable' => true,
        'affects_gross' => true,
        'affects_net' => true,
        'sort_order' => 10,
        'metadata' => ['source' => 'test'],
    ]);

    PayrollResultLine::query()->create([
        'organization_id' => $organization->id,
        'payroll_result_id' => $result->id,
        'pay_code_id' => null,
        'code_snapshot' => 'PAYE',
        'description_snapshot' => 'PAYE tax',
        'type' => 'DEDUCTION',
        'category' => 'TAX',
        'input_source' => 'SYSTEM',
        'amount' => 100,
        'quantity' => 1,
        'rate' => 100,
        'taxable' => false,
        'affects_gross' => false,
        'affects_net' => true,
        'sort_order' => 20,
        'metadata' => ['source' => 'test'],
    ]);

    return compact('employee', 'result', 'period');
}

test('payslips index renders only current organization results', function () {
    $organization = payslipOrg('Payslip Org A', 'PSA');
    $foreignOrganization = payslipOrg('Payslip Org B', 'PSB');
    $user = payslipActor($organization, ['payslips.view']);

    payslipFixture($organization, 'PSA-001', 'Alice');
    payslipFixture($foreignOrganization, 'PSB-001', 'Brenda');

    $this->actingAs($user);

    $this->get('/payroll/payslips')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Payroll/Payslips/Index')
            ->where('payslips.total', 1)
            ->where('payslips.data.0.employee.staff_number', 'PSA-001')
        );
});

test('payslip download streams pdf and writes an audit record', function () {
    $organization = payslipOrg('Download Org', 'DLO');
    $user = payslipActor($organization, ['payroll.view', 'payroll.export']);
    $fixture = payslipFixture($organization, 'DLO-001', 'David');

    $this->actingAs($user);

    $response = $this->get("/payroll/payslips/{$fixture['result']->id}/download");

    $response->assertOk();
    expect((string) $response->headers->get('content-type'))->toContain('application/pdf');
    expect(AuditLog::query()
        ->where('event', 'download')
        ->where('auditable_id', $fixture['result']->id)
        ->exists())->toBeTrue();
});

test('individual payslip email queues a delivery job', function () {
    Queue::fake();

    $organization = payslipOrg('Email Org', 'EML');
    $user = payslipActor($organization, ['payslips.email']);
    $fixture = payslipFixture($organization, 'EML-001', 'Elena');

    $this->actingAs($user)
        ->post("/payroll/payslips/{$fixture['result']->id}/email")
        ->assertRedirect();

    Queue::assertPushed(SendPayslipEmailJob::class, 1);

    $delivery = PayslipDelivery::query()->firstOrFail();

    expect($delivery->channel)->toBe(PayslipDelivery::CHANNEL_EMAIL);
    expect($delivery->status)->toBe(PayslipDelivery::STATUS_PENDING);
    expect($delivery->recipient)->toBe($fixture['employee']->user?->email);
});

test('bulk payslip email queues selected payslips', function () {
    Queue::fake();

    $organization = payslipOrg('Bulk Email Org', 'BEM');
    $user = payslipActor($organization, ['payslips.bulk_email']);
    $first = payslipFixture($organization, 'BEM-001', 'Farai');
    $second = payslipFixture($organization, 'BEM-002', 'Grace');

    $this->actingAs($user)
        ->post('/payroll/payslips/email', [
            'payroll_result_ids' => [$first['result']->id, $second['result']->id],
        ])
        ->assertRedirect();

    Queue::assertPushed(SendPayslipEmailJob::class, 2);
    expect(PayslipDelivery::query()->where('channel', PayslipDelivery::CHANNEL_EMAIL)->count())->toBe(2);
    expect(PayslipDelivery::query()->distinct('batch_id')->count('batch_id'))->toBe(1);
});

test('queued payslip email job sends mail and marks delivery sent', function () {
    Mail::fake();

    $organization = payslipOrg('Mail Job Org', 'MJO');
    $actor = payslipActor($organization, ['payslips.email']);
    $fixture = payslipFixture($organization, 'MJO-001', 'Helen');

    $delivery = PayslipDelivery::query()->create([
        'organization_id' => $organization->id,
        'payroll_result_id' => $fixture['result']->id,
        'employee_id' => $fixture['employee']->id,
        'payroll_period_id' => $fixture['period']->id,
        'created_by' => $actor->id,
        'channel' => PayslipDelivery::CHANNEL_EMAIL,
        'recipient' => $fixture['employee']->user?->email,
        'status' => PayslipDelivery::STATUS_PENDING,
        'metadata' => [],
    ]);

    $job = new SendPayslipEmailJob($delivery->id);
    $job->handle(app(PayslipPdfService::class), app(PayslipViewService::class), app(AuditLogger::class));

    Mail::assertSent(PayslipMail::class, fn (PayslipMail $mail) => $mail->hasTo($fixture['employee']->user?->email));

    expect($delivery->fresh()->status)->toBe(PayslipDelivery::STATUS_SENT);
});

test('individual payslip sms queues a delivery job', function () {
    Queue::fake();

    $organization = payslipOrg('SMS Org', 'SMS');
    $user = payslipActor($organization, ['payslips.sms']);
    $fixture = payslipFixture($organization, 'SMS-001', 'Ian');

    $this->actingAs($user)
        ->post("/payroll/payslips/{$fixture['result']->id}/sms")
        ->assertRedirect();

    Queue::assertPushed(SendPayslipSmsJob::class, 1);

    $delivery = PayslipDelivery::query()->firstOrFail();

    expect($delivery->channel)->toBe(PayslipDelivery::CHANNEL_SMS);
    expect($delivery->status)->toBe(PayslipDelivery::STATUS_PENDING);
    expect($delivery->recipient)->toBe($fixture['employee']->contact_number);
});

test('queued payslip sms job sends summary and marks delivery sent', function () {
    $organization = payslipOrg('SMS Job Org', 'SMJ');
    $actor = payslipActor($organization, ['payslips.sms']);
    $fixture = payslipFixture($organization, 'SMJ-001', 'Julia');

    $fakeSms = new class implements SmsTransport
    {
        public array $messages = [];

        public function send(string $recipient, string $message, array $context = []): array
        {
            $this->messages[] = compact('recipient', 'message', 'context');

            return [
                'provider' => 'fake',
                'message_id' => 'sms-001',
                'recipient' => $recipient,
            ];
        }
    };

    app()->instance(SmsTransport::class, $fakeSms);

    $delivery = PayslipDelivery::query()->create([
        'organization_id' => $organization->id,
        'payroll_result_id' => $fixture['result']->id,
        'employee_id' => $fixture['employee']->id,
        'payroll_period_id' => $fixture['period']->id,
        'created_by' => $actor->id,
        'channel' => PayslipDelivery::CHANNEL_SMS,
        'recipient' => $fixture['employee']->contact_number,
        'status' => PayslipDelivery::STATUS_PENDING,
        'metadata' => [],
    ]);

    $job = new SendPayslipSmsJob($delivery->id);
    $job->handle(app(\App\Support\Payslips\PayslipSmsService::class), app(AuditLogger::class));

    expect($fakeSms->messages)->toHaveCount(1);
    expect($fakeSms->messages[0]['recipient'])->toBe($fixture['employee']->contact_number);
    expect($delivery->fresh()->status)->toBe(PayslipDelivery::STATUS_SENT);
});

test('users cannot send payslips from another organization', function () {
    $organization = payslipOrg('Isolation Org', 'ISO');
    $foreignOrganization = payslipOrg('Isolation Org Foreign', 'ISF');
    $user = payslipActor($organization, ['payslips.email']);
    $fixture = payslipFixture($foreignOrganization, 'ISF-001', 'Kevin');

    $this->actingAs($user)
        ->post("/payroll/payslips/{$fixture['result']->id}/email")
        ->assertNotFound();
});
