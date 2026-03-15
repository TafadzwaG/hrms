# Payslip Distribution

## Overview

The payslip distribution feature extends the existing payroll module with:

- a tenant-scoped payslips index page
- single payslip PDF download
- individual payslip email delivery with PDF attachment
- bulk payslip email delivery
- individual payslip SMS summary delivery
- bulk payslip SMS summary delivery
- delivery tracking for email and SMS outcomes
- audit events for download, queueing, sends, and failures

Payslip data always comes from processed `payroll_results` snapshots. It is not recalculated at send time.

## Routes and Pages Added

Under the existing `/payroll` route group:

- `GET /payroll/payslips`
- `GET /payroll/payslips/{result}`
- `GET /payroll/payslips/{result}/download`
- `POST /payroll/payslips/{result}/email`
- `POST /payroll/payslips/{result}/sms`
- `POST /payroll/payslips/email`
- `POST /payroll/payslips/sms`

Frontend pages:

- `resources/js/pages/Payroll/Payslips/Index.tsx`
- `resources/js/pages/Payroll/Payslips/Show.tsx`

## PDF Generation Flow

PDF generation is centralized in `App\Support\Payslips\PayslipPdfService`.

Flow:

1. Resolve the tenant-scoped `PayrollResult`
2. Load the processed payroll snapshot plus lines, settlements, employee, period, and organization
3. Build the view payload with `PayslipViewService`
4. Render `resources/views/payroll/payslip.blade.php` through DomPDF
5. Stream the PDF for download or attach it to email

The download action also writes an audit event and a `PayrollExport` record, consistent with the existing payroll export flow.

## Email Sending Flow

Single email:

1. User triggers `POST /payroll/payslips/{result}/email`
2. `PayslipDeliveryService` creates a `payslip_deliveries` record with `channel=EMAIL`
3. If the employee has an email address, the record is marked `PENDING`
4. `SendPayslipEmailJob` is dispatched
5. The job generates the PDF and sends `App\Mail\PayslipMail`
6. Delivery status is updated to `SENT` or `FAILED`

Bulk email:

1. User selects rows, or selects a payroll period, on the payslips index page
2. `POST /payroll/payslips/email` accepts selected `payroll_result_ids` or a `payroll_period_id`
3. The service creates one delivery record per payslip and dispatches one queued job per record
4. A shared `batch_id` ties the bulk request together

## SMS Sending Flow

Single SMS:

1. User triggers `POST /payroll/payslips/{result}/sms`
2. `PayslipDeliveryService` creates a `payslip_deliveries` record with `channel=SMS`
3. `SendPayslipSmsJob` is dispatched when a contact number exists
4. `PayslipSmsService` sends a compact summary through the configured SMS transport
5. Delivery status is updated to `SENT` or `FAILED`

Bulk SMS:

1. User selects rows or a payroll period on the payslips page
2. `POST /payroll/payslips/sms` resolves the tenant-scoped payslips
3. One delivery record and one queued SMS job are created per payslip

SMS messages never include PDF attachments.

## Delivery Tracking

New table:

- `payslip_deliveries`

Tracked fields:

- `organization_id`
- `payroll_result_id`
- `employee_id`
- `payroll_period_id`
- `created_by`
- `channel` (`EMAIL` or `SMS`)
- `recipient`
- `status` (`PENDING`, `SENT`, `FAILED`)
- `attempts`
- `sent_at`
- `batch_id`
- `failure_reason`
- `metadata`

The payslips index page surfaces the latest email and SMS status per payslip. The payslip detail page shows full delivery history.

## Permissions Used

New permission group in `config/rbac.php`:

- `payslips.view`
- `payslips.download`
- `payslips.email`
- `payslips.sms`
- `payslips.bulk_email`
- `payslips.bulk_sms`

Compatibility bridge:

Routes also accept the legacy payroll permissions where appropriate:

- `payroll.view`
- `payroll.export`

This preserves existing payroll access while the new permissions are being seeded and assigned.

## Tenant and Audit Considerations

- Payslips are resolved through tenant-scoped `PayrollResult` queries
- Cross-tenant direct URL access returns `404`
- Delivery records store `organization_id`
- Audit events include module `payroll`, communication metadata, and organization context

Audited events include:

- payslip download
- payslip email queued
- payslip email sent
- payslip email failed
- payslip SMS queued
- payslip SMS sent
- payslip SMS failed
- bulk email queued
- bulk SMS queued

## Mail and SMS Configuration

Mail uses the existing Laravel mail configuration in `config/mail.php`.

SMS uses the new `config/sms.php` file.

Supported SMS drivers in the current implementation:

- `log`
- `webhook`
- `null`

Environment variables:

- `SMS_DRIVER`
- `SMS_SENDER`
- `PAYSLIP_SMS_TEMPLATE`
- `SMS_LOG_CHANNEL`
- `SMS_WEBHOOK_URL`
- `SMS_WEBHOOK_TOKEN`
- `SMS_WEBHOOK_TIMEOUT`

`webhook` is intentionally provider-agnostic so a gateway such as Twilio, Africa's Talking, Infobip, or an internal SMS adapter can sit behind one HTTP endpoint without changing payroll controller logic.

## Using the Feature in the UI

1. Go to `Payroll -> Payslips`
2. Filter by employee, staff number, payroll period, department, pay point, or delivery status
3. Use row actions to:
   - view
   - download PDF
   - email payslip
   - send SMS summary
4. Select multiple rows to bulk queue email or SMS
5. If a payroll period is selected, use the period-wide bulk actions to queue all payslips for that period
6. Open a payslip detail page to review delivery history

## Running the Feature

Apply the schema change:

```bash
php artisan migrate
```

Sync the new permissions into the database:

```bash
php artisan db:seed --class=PermissionSeeder
```

Start a queue worker for email and SMS jobs:

```bash
php artisan queue:work
```

## Tests

Focused coverage lives in:

- `tests/Feature/PayslipDistributionTest.php`

The suite covers:

- tenant-scoped payslip listing
- PDF download
- single email queueing
- bulk email queueing
- email job execution
- single SMS queueing
- SMS job execution
- cross-tenant protection
