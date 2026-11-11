<?php

namespace App\Support\Payslips;

use App\Jobs\SendPayslipEmailJob;
use App\Jobs\SendPayslipSmsJob;
use App\Models\PayslipDelivery;
use App\Models\PayrollResult;
use App\Models\User;
use App\Support\Audit\AuditLogger;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class PayslipDeliveryService
{
    public function __construct(
        private readonly AuditLogger $auditLogger,
        private readonly PayslipViewService $viewService,
    ) {
    }

    /**
     * @return array{delivery: PayslipDelivery|null, queued: bool, reason: string|null}
     */
    public function queueEmail(PayrollResult $result, User $actor, ?string $batchId = null, ?string $overrideReason = null): array
    {
        $recipient = $result->employee?->user?->email;

        return $this->queue(
            $result,
            $actor,
            PayslipDelivery::CHANNEL_EMAIL,
            $recipient,
            $batchId,
            fn (PayslipDelivery $delivery) => SendPayslipEmailJob::dispatch($delivery->id),
            $overrideReason,
        );
    }

    /**
     * @return array{delivery: PayslipDelivery|null, queued: bool, reason: string|null}
     */
    public function queueSms(PayrollResult $result, User $actor, ?string $batchId = null, ?string $overrideReason = null): array
    {
        $recipient = $result->employee?->contact_number;

        return $this->queue(
            $result,
            $actor,
            PayslipDelivery::CHANNEL_SMS,
            $recipient,
            $batchId,
            fn (PayslipDelivery $delivery) => SendPayslipSmsJob::dispatch($delivery->id),
            $overrideReason,
        );
    }

    /**
     * Payslips may only go out once the payroll run is approved or closed.
     * Returns the reason a payslip is held back, or null when it can be released.
     */
    public function releaseBlockReason(PayrollResult $result): ?string
    {
        $status = strtoupper((string) $result->loadMissing('run')->run?->status);

        if (in_array($status, ['APPROVED', 'CLOSED'], true)) {
            return null;
        }

        return 'This payslip cannot be sent yet because its payroll run has not been approved.';
    }

    /**
     * @param  Collection<int, PayrollResult>  $results
     * @return array{batch_id: string, queued: int, failed: int, blocked: int}
     */
    public function queueBulkEmail(Collection $results, User $actor, ?string $overrideReason = null): array
    {
        return $this->queueBulk($results, $actor, fn (PayrollResult $result, User $actor, string $batchId) => $this->queueEmail($result, $actor, $batchId, $overrideReason));
    }

    /**
     * @param  Collection<int, PayrollResult>  $results
     * @return array{batch_id: string, queued: int, failed: int, blocked: int}
     */
    public function queueBulkSms(Collection $results, User $actor, ?string $overrideReason = null): array
    {
        return $this->queueBulk($results, $actor, fn (PayrollResult $result, User $actor, string $batchId) => $this->queueSms($result, $actor, $batchId, $overrideReason));
    }

    private function queueBulk(Collection $results, User $actor, callable $callback): array
    {
        $batchId = (string) Str::uuid();
        $queued = 0;
        $failed = 0;
        $blocked = 0;

        foreach ($results as $result) {
            $response = $callback($result, $actor, $batchId);
            $response['queued'] ? $queued++ : $failed++;

            if (! $response['queued'] && ($response['blocked'] ?? false)) {
                $blocked++;
            }
        }

        return [
            'batch_id' => $batchId,
            'queued' => $queued,
            'failed' => $failed,
            'blocked' => $blocked,
        ];
    }

    /**
     * @param  callable(PayslipDelivery): void  $dispatch
     * @return array{delivery: PayslipDelivery|null, queued: bool, reason: string|null}
     */
    private function queue(
        PayrollResult $result,
        User $actor,
        string $channel,
        ?string $recipient,
        ?string $batchId,
        callable $dispatch,
        ?string $overrideReason = null,
    ): array {
        $this->viewService->load($result);

        $blockReason = $this->releaseBlockReason($result);

        if ($blockReason !== null && blank($overrideReason)) {
            return [
                'delivery' => null,
                'queued' => false,
                'blocked' => true,
                'reason' => $blockReason,
            ];
        }

        if ($blockReason !== null) {
            $this->auditLogger->logCustom('payslip_release_override', $result, [
                'actor' => $actor,
                'module' => 'payroll',
                'category' => 'communication',
                'organization_id' => $result->organization_id,
                'description' => 'Released a payslip before the payroll run was approved.',
                'metadata' => [
                    'channel' => $channel,
                    'override_reason' => $overrideReason,
                    'run_status' => $result->run?->status,
                    'batch_id' => $batchId,
                ],
            ]);
        }

        $delivery = PayslipDelivery::query()->create([
            'organization_id' => $result->organization_id,
            'payroll_result_id' => $result->id,
            'employee_id' => $result->employee_id,
            'payroll_period_id' => $result->payroll_period_id,
            'created_by' => $actor->id,
            'channel' => $channel,
            'recipient' => $recipient,
            'status' => blank($recipient) ? PayslipDelivery::STATUS_FAILED : PayslipDelivery::STATUS_PENDING,
            'batch_id' => $batchId,
            'failure_reason' => blank($recipient)
                ? ($channel === PayslipDelivery::CHANNEL_EMAIL
                    ? 'Employee has no email address for payslip delivery.'
                    : 'Employee has no contact number for payslip SMS delivery.')
                : null,
            'metadata' => [
                'period_code' => $result->run?->period?->code,
                'period_name' => $result->run?->period?->name,
            ],
        ]);

        if (blank($recipient)) {
            $this->auditLogger->logCustom(
                $channel === PayslipDelivery::CHANNEL_EMAIL ? 'payslip_email_failed' : 'payslip_sms_failed',
                $result,
                [
                    'actor' => $actor,
                    'module' => 'payroll',
                    'category' => 'communication',
                    'organization_id' => $result->organization_id,
                    'description' => $channel === PayslipDelivery::CHANNEL_EMAIL
                        ? 'Payslip email delivery could not be queued because the employee has no email address.'
                        : 'Payslip SMS delivery could not be queued because the employee has no contact number.',
                    'metadata' => [
                        'delivery_id' => $delivery->id,
                        'channel' => $channel,
                        'failure_reason' => $delivery->failure_reason,
                    ],
                ],
            );

            return [
                'delivery' => $delivery,
                'queued' => false,
                'reason' => $delivery->failure_reason,
            ];
        }

        $dispatch($delivery);

        $this->auditLogger->logCustom(
            $channel === PayslipDelivery::CHANNEL_EMAIL ? 'payslip_email_queued' : 'payslip_sms_queued',
            $result,
            [
                'actor' => $actor,
                'module' => 'payroll',
                'category' => 'communication',
                'organization_id' => $result->organization_id,
                'description' => $channel === PayslipDelivery::CHANNEL_EMAIL
                    ? 'Queued a payslip email with PDF attachment.'
                    : 'Queued a payslip SMS summary.',
                'metadata' => [
                    'delivery_id' => $delivery->id,
                    'channel' => $channel,
                    'recipient' => $recipient,
                    'batch_id' => $batchId,
                ],
            ],
        );

        return [
            'delivery' => $delivery,
            'queued' => true,
            'reason' => null,
        ];
    }
}
