<?php

namespace App\Support\Payslips;

use App\Models\PayrollResult;
use App\Support\Sms\SmsTransport;

class PayslipSmsService
{
    public function __construct(
        private readonly PayslipViewService $viewService,
        private readonly SmsTransport $transport,
    ) {
    }

    /**
     * @return array<string, mixed>
     */
    public function send(PayrollResult $result, string $recipient, array $context = []): array
    {
        return $this->transport->send($recipient, $this->viewService->smsSummary($result), $context);
    }
}
