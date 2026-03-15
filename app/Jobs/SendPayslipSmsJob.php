<?php

namespace App\Jobs;

use App\Models\PayslipDelivery;
use App\Support\Audit\AuditLogger;
use App\Support\Payslips\PayslipSmsService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Str;
use Throwable;

class SendPayslipSmsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public int $deliveryId,
    ) {
    }

    public function handle(PayslipSmsService $smsService, AuditLogger $auditLogger): void
    {
        $delivery = PayslipDelivery::query()
            ->with(['payrollResult', 'payrollResult.organization', 'payrollResult.run.period', 'creator'])
            ->findOrFail($this->deliveryId);

        $delivery->increment('attempts');

        $result = $delivery->payrollResult;

        if (! $result || blank($delivery->recipient)) {
            throw new \RuntimeException('Payslip SMS delivery is missing its payroll result or recipient.');
        }

        $response = $smsService->send($result, $delivery->recipient, [
            'delivery_id' => $delivery->id,
            'payroll_result_id' => $result->id,
            'organization_id' => $result->organization_id,
        ]);

        $delivery->forceFill([
            'status' => PayslipDelivery::STATUS_SENT,
            'sent_at' => now(),
            'failure_reason' => null,
            'metadata' => array_merge($delivery->metadata ?? [], $response),
        ])->save();

        $auditLogger->logCustom('payslip_sms_sent', $result, [
            'actor' => $delivery->creator,
            'module' => 'payroll',
            'category' => 'communication',
            'organization_id' => $result->organization_id,
            'description' => 'Sent a payslip SMS summary.',
            'metadata' => [
                'delivery_id' => $delivery->id,
                'recipient' => $delivery->recipient,
                'provider' => $response['provider'] ?? null,
            ],
        ]);
    }

    public function failed(Throwable $exception): void
    {
        $delivery = PayslipDelivery::query()->with(['payrollResult', 'creator'])->find($this->deliveryId);

        if (! $delivery) {
            return;
        }

        $delivery->forceFill([
            'status' => PayslipDelivery::STATUS_FAILED,
            'failure_reason' => Str::limit($exception->getMessage(), 1000),
            'metadata' => array_merge($delivery->metadata ?? [], [
                'failed_at' => now()->toDateTimeString(),
            ]),
        ])->save();

        if ($delivery->payrollResult) {
            app(AuditLogger::class)->logCustom('payslip_sms_failed', $delivery->payrollResult, [
                'actor' => $delivery->creator,
                'module' => 'payroll',
                'category' => 'communication',
                'organization_id' => $delivery->organization_id,
                'description' => 'Payslip SMS delivery failed.',
                'metadata' => [
                    'delivery_id' => $delivery->id,
                    'recipient' => $delivery->recipient,
                    'failure_reason' => $delivery->failure_reason,
                ],
            ]);
        }
    }
}
