# System Settings / Company Settings

This HRMS includes a central **System Settings** module available at `/system-settings`.

It follows the existing Laravel + Inertia + React TypeScript architecture and supports:
- global system identity (name, short name, system logo)
- tenant-aware company details (per active organization)
- tenant-aware branding (primary/secondary/accent colors)
- tenant-aware preferences (pagination size, banners, footer texts)
- global backup configuration + automated backups + optional email delivery

## Design Overview

### Global vs Tenant Settings

This project supports multi-tenancy using a shared database with row-level isolation.

The settings module is designed with two scopes:
- **Global/system scope**: stored in `system_settings` using `organization_id = 0`
- **Tenant scope**: stored in `system_settings` using `organization_id = {active organization id}`

Some “company details” live naturally on the existing `organizations` table (name, email, phone, address, logo, timezone) and are updated there. Additional company fields (website, support email, default currency, date format) are stored tenant-scoped in `system_settings`.

## Database Schema

### `system_settings`

Created by: `2026_03_16_090000_create_system_settings_table.php`

Columns:
- `organization_id` (unsigned bigint, default `0`)  
  `0` is reserved for global/system settings.
- `group` (string)
- `key` (string)
- `value` (json, nullable)
- `type` (string, nullable)
- `is_public` (boolean)
- `created_by`, `updated_by` (nullable)
- timestamps

Uniqueness:
- unique index on `(organization_id, group, key)`

## Routes

Routes are defined in [routes/web.php](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/routes/web.php) under `/system-settings`:

- `GET /system-settings` (permission: `settings.view`)
- `PUT /system-settings/general` (permission: `settings.manage`)
- `POST /system-settings/branding/system-logo` (permission: `branding.manage`)
- `POST /system-settings/branding/company-logo` (permission: `branding.manage`)
- `PUT /system-settings/branding/theme` (permission: `branding.manage`)
- `PUT /system-settings/preferences` (permission: `settings.manage`)
- `PUT /system-settings/backups` (permission: `backups.manage`)
- `POST /system-settings/backups/run` (permission: `backups.run`)
- `GET /system-settings/backups/download/{file}` (permission: `backups.manage`)

## UI Pages

Frontend page:
- `resources/js/pages/SystemSettings/Index.tsx`

Navigation:
- Added to the sidebar in `resources/js/lib/app-sidebar-rbac.tsx` (permission: `settings.view`)

## Branding and Logos

### System Logo
- Uploaded via `/system-settings/branding/system-logo`
- Stored on the **public** disk (local storage) under:
  - `storage/app/public/settings/system-logo`
- Only the path is stored in `system_settings` (`branding.system_logo_path`).

### Company Logo
- Uploaded via `/system-settings/branding/company-logo`
- Stored on the **public** disk (local storage) under:
  - `storage/app/public/settings/company-logo/{organization_id}`
- Path is stored on the `organizations.logo_path` column.

### Storage Link
To serve public uploads locally, ensure:
```bash
php artisan storage:link
```

## Theme / Color Scheme

The settings page stores:
- `branding.primary_color`
- `branding.secondary_color`
- `branding.accent_color`

These are applied at runtime as CSS variables in [app-shell.tsx](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/resources/js/components/app-shell.tsx):
- `--primary`, `--secondary`, `--accent`
- sidebar alignment: `--sidebar-primary`, `--sidebar-accent`

Values can be any valid CSS color (for example `oklch(...)`, `#0f172a`, `rgb(...)`).

## Timezone Handling

Timezone is stored on the active tenant’s `organizations.timezone` value and managed via the General tab.

Note:
- This does not automatically rewrite the server timezone.
- Use it for display, reporting, and future tenant-aware date handling.

## Backups

### Where backups are stored
Backups are stored on the **local** disk configured as:
- `storage/app/private`

Default folder:
- `storage/app/private/backups`

The folder is configurable in System Settings:
- `backup.backup_local_path`

### Backup creation implementation
Backups are created by:
- Job: `app/Jobs/RunDatabaseBackupJob.php`
- Service: `app/Support/Backups/DatabaseBackupService.php`

For MySQL backups, the system uses `mysqldump` (recommended for production-safe exports).

Environment variables:
- `MYSQLDUMP_PATH`  
  Optional. Full path to `mysqldump` if it is not available in PATH.
- `BACKUP_EMAIL_ATTACH_MAX_MB` (default: `20`)  
  Attach the backup to email only if it is below this size.

### Backup email delivery
If enabled, the job sends `DatabaseBackupMail` to configured recipients.

Mailable:
- `app/Mail/DatabaseBackupMail.php`
- Blade view: `resources/views/emails/database-backup.blade.php`

### Automated backups (scheduler)
Automated backup dispatch is wired in [bootstrap/app.php](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/bootstrap/app.php):
- A scheduled callback runs every minute and dispatches a backup when due.
- Dispatcher: `app/Support/Backups/ScheduledBackupDispatcher.php`

To run the scheduler in production, configure one of:
1. Cron calling Laravel scheduler:
```bash
* * * * * php /path/to/artisan schedule:run >> /dev/null 2>&1
```
2. Or run Laravel’s schedule worker:
```bash
php artisan schedule:work
```

### Queue recommendation
If `QUEUE_CONNECTION=sync`, a manual backup request may run during the web request and can time out.

Recommended for production:
- configure a real queue driver (database/redis)
- run `php artisan queue:work`

## Permissions

Permissions are defined in `config/rbac.php`:
- `settings.view`
- `settings.manage`
- `branding.manage`
- `backups.manage`
- `backups.run`
- `backups.email`

After deploying code changes, sync the permission catalogue and defaults:
```bash
php artisan db:seed --class=PermissionSeeder
```

## Audit Trail

Settings updates and backup events are logged through `AuditLogger` when the audit module is present:
- settings updated
- branding updated
- logos uploaded
- backup requested/completed/failed
- backup email delivery (success/fail)

## Migration / Upgrade Notes

1. Run migrations:
```bash
php artisan migrate
```

2. Sync permissions:
```bash
php artisan db:seed --class=PermissionSeeder
```

3. Ensure `storage:link` exists for logo previews.

## Making a New Setting

Use `SystemSettingsService`:
- global/system: `organization_id = 0`
- tenant override: `organization_id = tenant id`

Example:
```php
app(\App\Support\Settings\SystemSettingsService::class)
    ->set('preferences', 'example_flag', true, $organizationId, $actorId, true);
```

