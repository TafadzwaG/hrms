<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ $appName }} Password Reset</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f8fafc;padding:40px 10px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.05);border:1px solid #e2e8f0;">
          
          <tr>
            <td style="background-color:#4f46e5;background:linear-gradient(to right, #4f46e5, #14b8a6);padding:32px 40px;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.025em;">
                {{ $appName }}
              </h1>
              <p style="margin:4px 0 0 0;color:#ccfbf1;font-size:14px;font-weight:500;">
                Account Security Services
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 16px 0;font-size:18px;font-weight:700;color:#1e293b;">
                Hello {{ $user->name }},
              </p>

              <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:#475569;">
                We received a request to reset the password for your employee account. To maintain the security of your payroll and personal data, please use the button below to establish new credentials.
              </p>

              <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom:30px;">
                <tr>
                  <td align="center" bgcolor="#4f46e5" style="border-radius:8px;">
                    <a href="{{ $resetUrl }}" target="_blank" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">
                      Reset Your Password
                    </a>
                  </td>
                </tr>
              </table>

              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f0fdfa;border-left:4px solid #14b8a6;border-radius:4px;margin-bottom:24px;">
                <tr>
                  <td style="padding:12px 16px;">
                    <p style="margin:0;font-size:13px;line-height:1.5;color:#134e4a;">
                      <strong>Didn't request this?</strong> If you didn't initiate this change, your account is still secure. You can safely ignore this email or contact the IT Security team if you have concerns.
                    </p>
                  </td>
                </tr>
              </table>

              <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">

              <p style="margin:0 0 8px 0;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">
                Direct Link
              </p>
              <p style="margin:0;font-size:12px;line-height:1.6;color:#94a3b8;word-break:break-all;">
                If the button above isn't working, copy and paste this URL into your browser:<br>
                <a href="{{ $resetUrl }}" style="color:#4f46e5;text-decoration:none;">{{ $resetUrl }}</a>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 40px 40px;">
              <div style="border-top:1px solid #e2e8f0;padding-top:24px;">
                <p style="margin:0;font-size:12px;font-weight:700;color:#64748b;">
                  &copy; {{ date('Y') }} {{ $appName }} &bull; HR Management System
                </p>
                <p style="margin:4px 0 0 0;font-size:11px;color:#94a3b8;">
                    This link will expire in 60 minutes for security purposes.
                </p>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>