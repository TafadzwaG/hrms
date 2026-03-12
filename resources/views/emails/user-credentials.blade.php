<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ $appName }} Credentials</title>
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
                Employee Information Systems
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 16px 0;font-size:18px;font-weight:700;color:#1e293b;">
                Hi {{ $user->name }},
              </p>

              @if($context === 'reset')
                <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:#475569;">
                  Your access credentials for the <strong>{{ $appName }}</strong> portal have been reset by your HR administrator. Please use the secure details below to log back in.
                </p>
              @else
                <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:#475569;">
                  Welcome to the team! An employee account has been provisioned for you on the <strong>{{ $appName }}</strong> portal.
                </p>
              @endif

              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9;border-radius:12px;margin-bottom:30px;border:1px dashed #cbd5e1;">
                <tr>
                  <td style="padding:24px;">
                    <div style="margin-bottom:20px;">
                      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#64748b;margin-bottom:4px;">Work Email Address</div>
                      <div style="font-size:16px;font-weight:600;color:#4f46e5;">{{ $user->email }}</div>
                    </div>
                    <div>
                      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#64748b;margin-bottom:4px;">Temporary Password</div>
                      <div style="font-size:18px;font-weight:700;color:#1e293b;font-family:'Courier New',Courier,monospace;letter-spacing:1px;">{{ $plainPassword }}</div>
                    </div>
                  </td>
                </tr>
              </table>

              <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom:30px;">
                <tr>
                  <td align="center" bgcolor="#4f46e5" style="border-radius:8px;">
                    <a href="{{ $loginUrl }}" target="_blank" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">
                      Access Employee Portal
                    </a>
                  </td>
                </tr>
              </table>

              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f0fdfa;border-left:4px solid #14b8a6;border-radius:4px;">
                <tr>
                  <td style="padding:12px 16px;">
                    <p style="margin:0;font-size:13px;line-height:1.5;color:#134e4a;">
                      <strong>Security Notice:</strong> For your protection, you will be prompted to create a new, permanent password upon your first successful sign-in.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 40px 40px;">
              <div style="border-top:1px solid #e2e8f0;padding-top:24px;">
                <p style="margin:0 0 8px 0;font-size:12px;color:#94a3b8;line-height:1.5;">
                  This is an automated system message. If you did not expect this enrollment, please contact your internal <strong>HR Department</strong> immediately.
                </p>
                <p style="margin:0;font-size:12px;font-weight:700;color:#64748b;">
                  &copy; {{ date('Y') }} {{ $appName }} &bull; Human Resources Management System
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