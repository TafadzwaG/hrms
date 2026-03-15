<?php

namespace App\Jobs;

use App\Mail\PayslipMail;
use App\Models\PayslipDelivery;
use App\Support\Audit\AuditLogger;
use App\Support\Payslips\PayslipPdfService;
use App\Support\Payslips\PayslipViewService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Throwable;

class SendPayslipEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public int $deliveryId,
    ) {
    }

    public function handle(PayslipPdfService $pdfService, PayslipViewService $viewService, AuditLogger $auditLogger): void
    {
        $delivery = PayslipDelivery::query()
            ->with(['payrollResult', 'payrollResult.organization', 'payrollResult.employee.user', 'payrollResult.run.period', 'creator'])
            ->findOrFail($this->deliveryId);

        $delivery->increment('attempts');

        $result = $delivery->payrollResult;

        if (! $result || blank($delivery->recipient)) {
            throw new \RuntimeException('Payslip email delivery is missing its payroll result or recipient.');
        }

        $payslip = $viewService->payload($result);
        $filename = $viewService->filename($result);

        Mail::to($delivery->recipient)->send(new PayslipMail(
            $payslip,
            $filename,
            $pdfService->output($result),
        ));

        $delivery->forceFill([
            'status' => PayslipDelivery::STATUS_SENT,
            'sent_at' => now(),
            'failure_reason' => null,
            'metadata' => array_merge($delivery->metadata ?? [], [
                'filename' => $filename,
                'delivered_via' => 'email',
            ]),
        ])->save();

        $auditLogger->logCustom('payslip_email_sent', $result, [
            'actor' => $delivery->creator,
            'module' => 'payroll',
            'category' => 'communication',
            'organization_id' => $result->organization_id,
            'description' => 'Sent a payslip email with PDF attachment.',
            'metadata' => [
                'delivery_id' => $delivery->id,
                'recipient' => $delivery->recipient,
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
            app(AuditLogger::class)->logCustom('payslip_email_failed', $delivery->payrollResult, [
                'actor' => $delivery->creator,
                'module' => 'payroll',
                'category' => 'communication',
                'organization_id' => $delivery->organization_id,
                'description' => 'Payslip email delivery failed.',
                'metadata' => [
                    'delivery_id' => $delivery->id,
                    'recipient' => $delivery->recipient,
                    'failure_reason' => $delivery->failure_reason,
                ],
            ]);
        }
    }
}
