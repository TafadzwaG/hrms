<?php

namespace App\Support\Payslips;

use App\Models\PayrollResult;
use Barryvdh\DomPDF\Facade\Pdf;
use Barryvdh\DomPDF\PDF as DomPdfInstance;

class PayslipPdfService
{
    public function __construct(
        private readonly PayslipViewService $viewService,
    ) {
    }

    public function render(PayrollResult $result): DomPdfInstance
    {
        return Pdf::loadView('payroll.payslip', [
            'payslip' => $this->viewService->payload($result),
        ]);
    }

    public function output(PayrollResult $result): string
    {
        return $this->render($result)->output();
    }
}
