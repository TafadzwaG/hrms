<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Payslip</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;color:#111827;">
    <div style="max-width:640px;margin:0 auto;padding:32px 20px;">
        <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:18px;padding:32px;">
            <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#6b7280;font-weight:700;">
                {{ $organization }}
            </p>
            <h1 style="margin:0 0 12px;font-size:26px;line-height:1.2;color:#111827;">
                Payslip for {{ $payslip['period']['name'] ?? $payslip['period']['code'] }}
            </h1>
            <p style="margin:0 0 24px;font-size:14px;line-height:1.7;color:#4b5563;">
                Hello {{ $payslip['employee']['full_name'] }}, your payslip for
                {{ $payslip['period']['period_start'] }} to {{ $payslip['period']['period_end'] }}
                is attached as a PDF.
            </p>

            <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-bottom:24px;">
                <div style="border:1px solid #e5e7eb;border-radius:14px;padding:16px;background:#f9fafb;">
                    <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;font-weight:700;">Gross Pay</div>
                    <div style="margin-top:8px;font-size:18px;font-weight:700;color:#111827;">
                        {{ $payslip['totals']['currency'] }} {{ number_format($payslip['totals']['gross_pay'], 2) }}
                    </div>
                </div>
                <div style="border:1px solid #e5e7eb;border-radius:14px;padding:16px;background:#f9fafb;">
                    <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;font-weight:700;">Net Pay</div>
                    <div style="margin-top:8px;font-size:18px;font-weight:700;color:#111827;">
                        {{ $payslip['totals']['currency'] }} {{ number_format($payslip['totals']['net_pay'], 2) }}
                    </div>
                </div>
            </div>

            <p style="margin:0;font-size:13px;line-height:1.7;color:#4b5563;">
                If you have questions about this payslip, please contact your payroll or HR team.
            </p>
        </div>
    </div>
</body>
</html>
