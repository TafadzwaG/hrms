<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Payslip</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; color: #111827; font-size: 12px; }
        .header { margin-bottom: 24px; }
        .title { font-size: 22px; font-weight: bold; margin-bottom: 4px; }
        .muted { color: #6b7280; font-size: 11px; }
        .grid { width: 100%; margin-bottom: 20px; }
        .grid td { width: 50%; vertical-align: top; padding: 8px 0; }
        .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; }
        .label { font-size: 10px; text-transform: uppercase; color: #6b7280; letter-spacing: 0.08em; }
        .value { font-size: 13px; font-weight: bold; margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
        th { background: #f9fafb; font-size: 11px; text-transform: uppercase; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">{{ $payslip['employee']['full_name'] }}</div>
        <div class="muted">
            {{ $payslip['employee']['staff_number'] }} • {{ $payslip['period']['code'] }} •
            {{ $payslip['period']['period_start'] }} to {{ $payslip['period']['period_end'] }}
        </div>
    </div>

    <table class="grid">
        <tr>
            <td>
                <div class="card">
                    <div class="label">Department</div>
                    <div class="value">{{ $payslip['employee']['department'] ?? 'N/A' }}</div>
                </div>
            </td>
            <td>
                <div class="card">
                    <div class="label">Position</div>
                    <div class="value">{{ $payslip['employee']['position'] ?? 'N/A' }}</div>
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <div class="card">
                    <div class="label">Bank</div>
                    <div class="value">{{ $payslip['banking']['bank_name'] ?? 'N/A' }}</div>
                </div>
            </td>
            <td>
                <div class="card">
                    <div class="label">Account</div>
                    <div class="value">{{ $payslip['banking']['account_number'] ?? 'N/A' }}</div>
                </div>
            </td>
        </tr>
    </table>

    <table>
        <thead>
            <tr>
                <th>Earnings</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($payslip['earnings'] as $earning)
                <tr>
                    <td>{{ $earning['code'] }} - {{ $earning['description'] }}</td>
                    <td>{{ $payslip['totals']['currency'] }} {{ number_format((float) $earning['amount'], 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <table>
        <thead>
            <tr>
                <th>Deductions</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($payslip['deductions'] as $deduction)
                <tr>
                    <td>{{ $deduction['code'] }} - {{ $deduction['description'] }}</td>
                    <td>{{ $payslip['totals']['currency'] }} {{ number_format((float) $deduction['amount'], 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <table>
        <thead>
            <tr>
                <th>Summary</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr><td>Gross Pay</td><td>{{ $payslip['totals']['currency'] }} {{ number_format((float) $payslip['totals']['gross_pay'], 2) }}</td></tr>
            <tr><td>Taxable Income</td><td>{{ $payslip['totals']['currency'] }} {{ number_format((float) $payslip['totals']['taxable_income'], 2) }}</td></tr>
            <tr><td>PAYE</td><td>{{ $payslip['totals']['currency'] }} {{ number_format((float) $payslip['totals']['tax_amount'], 2) }}</td></tr>
            <tr><td>Total Deductions</td><td>{{ $payslip['totals']['currency'] }} {{ number_format((float) $payslip['totals']['total_deductions'], 2) }}</td></tr>
            <tr><td>Net Pay</td><td>{{ $payslip['totals']['currency'] }} {{ number_format((float) $payslip['totals']['net_pay'], 2) }}</td></tr>
        </tbody>
    </table>

    @if (!empty($payslip['settlements']))
        <table>
            <thead>
                <tr>
                    <th>Settlement Currency</th>
                    <th>Allocation</th>
                    <th>Base Amount</th>
                    <th>Settlement Amount</th>
                    <th>Rate</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($payslip['settlements'] as $settlement)
                    <tr>
                        <td>{{ $settlement['currency'] }}</td>
                        <td>{{ $settlement['allocation_method'] }}</td>
                        <td>{{ $settlement['base_currency'] }} {{ number_format((float) $settlement['base_amount'], 2) }}</td>
                        <td>{{ $settlement['currency'] }} {{ number_format((float) $settlement['settlement_amount'], 2) }}</td>
                        <td>{{ number_format((float) ($settlement['exchange_rate'] ?? 1), 8) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif
</body>
</html>
