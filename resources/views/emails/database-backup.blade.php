<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Database Backup</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;color:#111827;">
    <div style="max-width:640px;margin:0 auto;padding:32px 20px;">
        <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:18px;padding:32px;">
            <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#6b7280;font-weight:700;">
                {{ $systemName }}
            </p>
            <h1 style="margin:0 0 12px;font-size:26px;line-height:1.2;color:#111827;">
                Database Backup
            </h1>

            <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#4b5563;">
                A database backup was created on <strong>{{ $createdAt }}</strong>.
            </p>

            @if(!empty($messageBody))
                <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#4b5563;">
                    {{ $messageBody }}
                </p>
            @endif

            <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-bottom:24px;">
                <div style="border:1px solid #e5e7eb;border-radius:14px;padding:16px;background:#f9fafb;">
                    <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;font-weight:700;">Filename</div>
                    <div style="margin-top:8px;font-size:14px;font-weight:700;color:#111827;word-break:break-all;">
                        {{ $filename }}
                    </div>
                </div>
                <div style="border:1px solid #e5e7eb;border-radius:14px;padding:16px;background:#f9fafb;">
                    <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;font-weight:700;">Size</div>
                    <div style="margin-top:8px;font-size:14px;font-weight:700;color:#111827;">
                        {{ number_format(($size ?? 0) / 1024 / 1024, 2) }} MB
                    </div>
                </div>
            </div>

            <p style="margin:0;font-size:13px;line-height:1.7;color:#4b5563;">
                @if(!empty($attached))
                    The backup file is attached to this email.
                @else
                    The backup file was not attached (it may be too large). Please download it from the System Settings backup panel.
                @endif
            </p>
        </div>
    </div>
</body>
</html>

