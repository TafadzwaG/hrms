<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class PayslipMail extends Mailable
{
    /**
     * @param  array<string, mixed>  $payslip
     */
    public function __construct(
        public array $payslip,
        public string $filename,
        public string $pdfBinary,
    ) {
    }

    public function build(): static
    {
        $period = $this->payslip['period']['name'] ?? $this->payslip['period']['code'] ?? 'Payroll Period';
        $organization = $this->payslip['organization']['name'] ?? config('app.name');

        return $this->subject("{$organization} Payslip - {$period}")
            ->view('emails.payslip')
            ->with([
                'payslip' => $this->payslip,
                'organization' => $organization,
            ])
            ->attachData($this->pdfBinary, $this->filename, [
                'mime' => 'application/pdf',
            ]);
    }
}
