# Audit Trail Module

## Overview

The audit trail module adds application-wide, structured audit logging for important actions across the HRMS. It records who performed an action, what changed, where it happened, and which record was affected. The module is designed to fit the existing Laravel + Inertia + React architecture and can be extended with minimal code when new modules are added.

## Database Schema

The audit trail uses a single `audit_logs` table created by [2026_03_14_220000_create_audit_logs_table.php](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/database/migrations/2026_03_14_220000_create_audit_logs_table.php).

Key columns:

- `actor_type`, `actor_id`, `actor_name`
- `event`
- `module`
- `category`
- `auditable_type`, `auditable_id`, `auditable_label`
- `description`
- `old_values`, `new_values`, `metadata`
- `request_method`, `route_name`, `url`, `ip_address`, `user_agent`
- `tags`
- `batch_id`
- `created_at`

Indexes are included for actor lookup, auditable lookup, `event`, `module`, `route_name`, `batch_id`, and `created_at`.

## How Audit Logging Works

The reusable audit infrastructure lives in these files:

- [AuditLogger.php](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/app/Support/Audit/AuditLogger.php)
- [AuditContext.php](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/app/Support/Audit/AuditContext.php)
- [Auditable.php](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/app/Concerns/Auditable.php)
- [AuditTrailServiceProvider.php](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/app/Providers/AuditTrailServiceProvider.php)
- [audit.php](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/config/audit.php)

`AuditLogger` provides the main API:

- `logEvent()`
- `logCreate()`
- `logUpdate()`
- `logDelete()`
- `logCustom()`
- `logAuthEvent()`
- `forModel()`

`AuditContext` adds two important helpers:

- `withBatch($batchId, fn () => ...)` groups related changes under one `batch_id`
- `withoutAuditing(fn () => ...)` suppresses generic model auditing when a controller writes a more meaningful semantic event such as `approve` or `reject`

## How Model Events Are Tracked

Models opt in by using the [Auditable.php](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/app/Concerns/Auditable.php) trait.

The trait records:

- `create`
- `update`
- `delete`
- `force_delete`
- `restore`

Current models already opted in include:

- employees
- org units
- locations
- positions
- workflows
- leave requests
- attendance records
- timesheets
- payroll exports
- requisitions
- candidates
- onboarding tasks
- offboarding tasks
- performance reviews
- learning courses
- documents
- document types

## How Controller and Service Events Are Tracked

Some actions need richer semantics than a generic model update. Those are logged manually with `AuditLogger` from controllers.

Examples already wired:

- login
- logout
- failed login
- password reset completion
- password reset request emails
- role create/update/delete
- permission matrix changes
- user create/update/delete
- role assignment and revocation
- employee bulk upload
- leave approval, rejection, change request, note save
- timesheet approval, rejection, bulk upload
- profile update and delete
- password change from settings

## Sensitive Field Exclusion and Redaction

Default exclusions and redactions are configured in [audit.php](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/config/audit.php).

Ignored by default:

- `created_at`
- `updated_at`
- `deleted_at`
- `remember_token`

Redacted by default:

- `password`
- `password_confirmation`
- `current_password`
- `token`
- `two_factor_secret`
- `two_factor_recovery_codes`

To customize on a model, define one or both properties:

- `protected array $auditExclude = [...]`
- `protected array $auditRedact = [...]`

## Audit UI

The admin UI lives in:

- [Index.tsx](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/resources/js/pages/AuditTrail/Index.tsx)
- [Logs.tsx](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/resources/js/pages/AuditTrail/Logs.tsx)
- [Show.tsx](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/resources/js/pages/AuditTrail/Show.tsx)

Routes:

- `/audit-trail`
- `/audit-trail/logs`
- `/audit-trail/logs/{auditLog}`
- `/audit-trail/logs/export`

Supported filters in the log explorer:

- search text
- actor
- event
- module
- category
- auditable type
- route name
- from date
- to date

## Authorization and Access

The audit module adds a new permission group to [rbac.php](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/config/rbac.php):

- `audit.view`
- `audit.export`
- `audit.manage`

Default role mapping:

- `SYS_ADMIN` gets everything through `*`
- `HR_ADMIN` gets `audit.view` and `audit.export`
- `AUDITOR` gets `audit.view` and `audit.export`

The audit pages are protected in [web.php](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/routes/web.php), and the sidebar only shows the module for users who have `audit.view`.

## How to Add Auditing to a New Module

For standard CRUD models:

1. Add `use Auditable;` to the model.
2. If the module key should not match the table name, add `protected string $auditModule = 'module_key';`.
3. If needed, add `protected array $auditExclude` or `protected array $auditRedact`.

For custom actions like approve, import, export, assign, or revoke:

1. Inject or call `app(AuditLogger::class)`.
2. Use `logCustom()` with a meaningful event name and structured `old_values`, `new_values`, and `metadata`.
3. If the action performs many writes, wrap it in `AuditContext::withBatch(...)`.
4. If you are replacing a generic model update with a semantic event, wrap the model write in `AuditContext::withoutAuditing(...)`.

## How Frontend Access Checks Work

The frontend already receives `auth.can` via [HandleInertiaRequests.php](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/app/Http/Middleware/HandleInertiaRequests.php). The audit UI uses the existing `useAuthorization()` helper from [authorization.ts](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/resources/js/lib/authorization.ts).

## Upgrade Notes

- Run the new migration for `audit_logs`.
- Re-run the permission seeder so the new `audit.*` permissions exist:
  - `php artisan db:seed --class=PermissionSeeder`
- Existing seeded roles are preserved; the new audit permissions are added through permission mapping, not destructive role changes.
- Console model auditing is skipped by default to avoid flooding logs during seeders and maintenance commands.

## Assumptions

- The existing app uses route-level permission middleware as the primary access control pattern.
- Dynamic RBAC is already active and should remain the source of truth for audit access.
- Structured JSON audit data is preferred over plain text logs.
- Jobs and commands can use `AuditLogger` manually when they need audit coverage.
