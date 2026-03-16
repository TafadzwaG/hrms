<?php

namespace App\Http\Controllers;

use App\Jobs\RunDatabaseBackupJob;
use App\Models\Organization;
use App\Models\User;
use App\Support\Audit\AuditLogger;
use App\Support\Settings\SystemSettingsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SystemSettingsController extends Controller
{
    public function index(Request $request, SystemSettingsService $settings): Response
    {
        $organization = $this->currentOrganization();

        $systemOrgId = $settings->systemOrganizationId();
        $orgId = $organization?->id;

        $systemLogoPath = $settings->getString('branding', 'system_logo_path', null, $systemOrgId);
        $companyLogoPath = $organization?->logo_path;

        return Inertia::render('SystemSettings/Index', [
            'system' => [
                'system_name' => $settings->getString('general', 'system_name', config('app.name'), $systemOrgId),
                'system_short_name' => $settings->getString('general', 'system_short_name', null, $systemOrgId),
                'system_logo_url' => $systemLogoPath ? Storage::disk('public')->url($systemLogoPath) : null,
                'system_logo_path' => $systemLogoPath,
            ],
            'company' => [
                'organization_id' => $orgId,
                'company_name' => $organization?->name,
                'company_email' => $organization?->email,
                'company_phone' => $organization?->phone,
                'company_address' => $organization?->address,
                'company_website' => $orgId ? $settings->getString('company', 'company_website', null, $orgId) : null,
                'support_email' => $orgId ? $settings->getString('company', 'support_email', null, $orgId) : null,
                'default_currency' => $orgId ? $settings->getString('company', 'default_currency', null, $orgId) : null,
                'date_format' => $orgId ? $settings->getString('company', 'date_format', null, $orgId) : null,
                'default_timezone' => $organization?->timezone,
                'company_logo_url' => $companyLogoPath ? Storage::disk('public')->url($companyLogoPath) : null,
                'company_logo_path' => $companyLogoPath,
            ],
            'branding' => [
                'primary_color' => $orgId ? $settings->getString('branding', 'primary_color', null, $orgId) : null,
                'secondary_color' => $orgId ? $settings->getString('branding', 'secondary_color', null, $orgId) : null,
                'accent_color' => $orgId ? $settings->getString('branding', 'accent_color', null, $orgId) : null,
            ],
            'preferences' => [
                'pagination_size' => $orgId ? $settings->getInt('preferences', 'pagination_size', 15, $orgId) : 15,
                'default_locale' => $orgId ? $settings->getString('preferences', 'default_locale', null, $orgId) : null,
                'maintenance_banner' => $orgId ? $settings->getString('preferences', 'maintenance_banner', null, $orgId) : null,
                'employee_code_prefix' => $orgId ? $settings->getString('preferences', 'employee_code_prefix', null, $orgId) : null,
                'payslip_footer_text' => $orgId ? $settings->getString('preferences', 'payslip_footer_text', null, $orgId) : null,
                'report_footer_text' => $orgId ? $settings->getString('preferences', 'report_footer_text', null, $orgId) : null,
            ],
            'backups' => [
                'enable_automatic_backups' => $settings->getBool('backup', 'enable_automatic_backups', false, $systemOrgId),
                'backup_frequency' => $settings->getString('backup', 'backup_frequency', 'daily', $systemOrgId),
                'backup_day_of_week' => $settings->getString('backup', 'backup_day_of_week', 'sunday', $systemOrgId),
                'backup_time' => $settings->getString('backup', 'backup_time', '02:00', $systemOrgId),
                'backup_retention_days' => $settings->getInt('backup', 'backup_retention_days', 14, $systemOrgId),
                'backup_local_enabled' => $settings->getBool('backup', 'backup_local_enabled', true, $systemOrgId),
                'backup_local_path' => $settings->getString('backup', 'backup_local_path', 'backups', $systemOrgId),
                'backup_email_enabled' => $settings->getBool('backup', 'backup_email_enabled', false, $systemOrgId),
                'backup_email_recipients' => $settings->getArray('backup', 'backup_email_recipients', [], $systemOrgId),
                'backup_include_database' => $settings->getBool('backup', 'backup_include_database', true, $systemOrgId),
                'backup_include_uploads' => $settings->getBool('backup', 'backup_include_uploads', false, $systemOrgId),
                'backup_email_subject_prefix' => $settings->getString('backup', 'backup_email_subject_prefix', null, $systemOrgId),
                'backup_email_message' => $settings->getString('backup', 'backup_email_message', null, $systemOrgId),
                'last_backup_at' => $settings->getString('backup', 'last_backup_at', null, $systemOrgId),
                'last_backup_status' => $settings->getString('backup', 'last_backup_status', null, $systemOrgId),
                'last_backup_file' => $settings->getString('backup', 'last_backup_file', null, $systemOrgId),
                'last_backup_error' => $settings->getString('backup', 'last_backup_error', null, $systemOrgId),
            ],
            'options' => [
                'timezones' => timezone_identifiers_list(),
                'backup_frequencies' => ['daily', 'weekly'],
                'days_of_week' => [
                    'monday',
                    'tuesday',
                    'wednesday',
                    'thursday',
                    'friday',
                    'saturday',
                    'sunday',
                ],
            ],
            'links' => [
                'general_update' => route('system-settings.general.update', [], false),
                'branding_theme_update' => route('system-settings.branding.theme.update', [], false),
                'branding_system_logo' => route('system-settings.branding.system-logo', [], false),
                'branding_company_logo' => route('system-settings.branding.company-logo', [], false),
                'preferences_update' => route('system-settings.preferences.update', [], false),
                'backups_update' => route('system-settings.backups.update', [], false),
                'backups_run' => route('system-settings.backups.run', [], false),
            ],
        ]);
    }

    public function updateGeneral(Request $request, SystemSettingsService $settings, AuditLogger $audit): RedirectResponse
    {
        $organization = $this->currentOrganization();
        $organizationId = $organization?->id;

        if (!$organizationId) {
            return back()->with('error', 'Select an active organization to manage company settings.');
        }

        $systemOrgId = $settings->systemOrganizationId();
        $timezones = timezone_identifiers_list();

        $validated = $request->validate([
            'system_name' => ['required', 'string', 'max:255'],
            'system_short_name' => ['nullable', 'string', 'max:64'],
            'company_name' => ['required', 'string', 'max:255'],
            'company_email' => ['nullable', 'email', 'max:255'],
            'company_phone' => ['nullable', 'string', 'max:64'],
            'company_address' => ['nullable', 'string'],
            'company_website' => ['nullable', 'string', 'max:255'],
            'support_email' => ['nullable', 'email', 'max:255'],
            'default_timezone' => ['nullable', 'string', 'max:64', Rule::in($timezones)],
            'default_currency' => ['nullable', 'string', 'max:16'],
            'date_format' => ['nullable', 'string', 'max:32'],
        ]);

        $oldSystem = [
            'system_name' => $settings->getString('general', 'system_name', config('app.name'), $systemOrgId),
            'system_short_name' => $settings->getString('general', 'system_short_name', null, $systemOrgId),
        ];
        $oldCompany = [
            'company_name' => $organization->name,
            'company_email' => $organization->email,
            'company_phone' => $organization->phone,
            'company_address' => $organization->address,
            'company_website' => $settings->getString('company', 'company_website', null, $organizationId),
            'support_email' => $settings->getString('company', 'support_email', null, $organizationId),
            'default_timezone' => $organization->timezone,
            'default_currency' => $settings->getString('company', 'default_currency', null, $organizationId),
            'date_format' => $settings->getString('company', 'date_format', null, $organizationId),
        ];

        DB::transaction(function () use ($validated, $organization, $settings, $systemOrgId, $organizationId, $request): void {
            $actorId = $request->user() instanceof User ? $request->user()->id : null;

            $settings->setMany('general', [
                'system_name' => $validated['system_name'],
                'system_short_name' => $validated['system_short_name'] ?? null,
            ], $systemOrgId, $actorId, true);

            $organization->update([
                'name' => $validated['company_name'],
                'email' => $validated['company_email'] ?? null,
                'phone' => $validated['company_phone'] ?? null,
                'address' => $validated['company_address'] ?? null,
                'timezone' => $validated['default_timezone'] ?? null,
            ]);

            $settings->setMany('company', [
                'company_website' => $validated['company_website'] ?? null,
                'support_email' => $validated['support_email'] ?? null,
                'default_currency' => $validated['default_currency'] ?? null,
                'date_format' => $validated['date_format'] ?? null,
            ], $organizationId, $actorId, false);
        });

        $newSystem = [
            'system_name' => $settings->getString('general', 'system_name', config('app.name'), $systemOrgId),
            'system_short_name' => $settings->getString('general', 'system_short_name', null, $systemOrgId),
        ];
        $newCompany = [
            'company_name' => $organization->fresh()->name,
            'company_email' => $organization->fresh()->email,
            'company_phone' => $organization->fresh()->phone,
            'company_address' => $organization->fresh()->address,
            'company_website' => $settings->getString('company', 'company_website', null, $organizationId),
            'support_email' => $settings->getString('company', 'support_email', null, $organizationId),
            'default_timezone' => $organization->fresh()->timezone,
            'default_currency' => $settings->getString('company', 'default_currency', null, $organizationId),
            'date_format' => $settings->getString('company', 'date_format', null, $organizationId),
        ];

        $audit->logCustom('settings_updated', $organization, [
            'module' => 'settings',
            'category' => 'configuration',
            'organization_id' => $organizationId,
            'description' => 'Updated general system and company settings.',
            'old_values' => [
                'system' => $oldSystem,
                'company' => $oldCompany,
            ],
            'new_values' => [
                'system' => $newSystem,
                'company' => $newCompany,
            ],
            'metadata' => [
                'group' => 'general',
            ],
        ]);

        return back()->with('success', 'Settings updated successfully.');
    }

    public function updateTheme(Request $request, SystemSettingsService $settings, AuditLogger $audit): RedirectResponse
    {
        $organization = $this->currentOrganization();
        $organizationId = $organization?->id;

        if (!$organizationId) {
            return back()->with('error', 'Select an active organization to manage branding.');
        }

        $validated = $request->validate([
            'primary_color' => ['nullable', 'string', 'max:64'],
            'secondary_color' => ['nullable', 'string', 'max:64'],
            'accent_color' => ['nullable', 'string', 'max:64'],
        ]);

        $old = [
            'primary_color' => $settings->getString('branding', 'primary_color', null, $organizationId),
            'secondary_color' => $settings->getString('branding', 'secondary_color', null, $organizationId),
            'accent_color' => $settings->getString('branding', 'accent_color', null, $organizationId),
        ];

        $actorId = $request->user() instanceof User ? $request->user()->id : null;

        $settings->setMany('branding', [
            'primary_color' => $validated['primary_color'] ?? null,
            'secondary_color' => $validated['secondary_color'] ?? null,
            'accent_color' => $validated['accent_color'] ?? null,
        ], $organizationId, $actorId, true);

        $new = [
            'primary_color' => $settings->getString('branding', 'primary_color', null, $organizationId),
            'secondary_color' => $settings->getString('branding', 'secondary_color', null, $organizationId),
            'accent_color' => $settings->getString('branding', 'accent_color', null, $organizationId),
        ];

        $audit->logCustom('branding_updated', $organization, [
            'module' => 'settings',
            'category' => 'configuration',
            'organization_id' => $organizationId,
            'description' => 'Updated theme color scheme settings.',
            'old_values' => $old,
            'new_values' => $new,
            'metadata' => [
                'group' => 'branding',
            ],
        ]);

        return back()->with('success', 'Branding settings updated successfully.');
    }

    public function uploadSystemLogo(Request $request, SystemSettingsService $settings, AuditLogger $audit): RedirectResponse
    {
        $systemOrgId = $settings->systemOrganizationId();

        $validated = $request->validate([
            'system_logo' => ['required', 'file', 'image', 'max:2048'],
        ]);

        $file = $request->file('system_logo');
        if (!$file) {
            return back()->with('error', 'No logo file was provided.');
        }

        $oldPath = $settings->getString('branding', 'system_logo_path', null, $systemOrgId);
        $path = $file->store('settings/system-logo', 'public');

        if ($oldPath && str_starts_with($oldPath, 'settings/system-logo/')) {
            Storage::disk('public')->delete($oldPath);
        }

        $actorId = $request->user() instanceof User ? $request->user()->id : null;
        $settings->set('branding', 'system_logo_path', $path, $systemOrgId, $actorId, true, 'file');

        $audit->logCustom('branding_logo_uploaded', null, [
            'module' => 'settings',
            'category' => 'configuration',
            'organization_id' => $this->tenantId(),
            'description' => 'Uploaded or replaced the system logo.',
            'metadata' => [
                'target' => 'system_logo',
                'path' => $path,
            ],
        ]);

        return back()->with('success', 'System logo updated successfully.');
    }

    public function uploadCompanyLogo(Request $request, SystemSettingsService $settings, AuditLogger $audit): RedirectResponse
    {
        $organization = $this->currentOrganization();
        $organizationId = $organization?->id;

        if (!$organizationId) {
            return back()->with('error', 'Select an active organization to manage branding.');
        }

        $validated = $request->validate([
            'company_logo' => ['required', 'file', 'image', 'max:2048'],
        ]);

        $file = $request->file('company_logo');
        if (!$file) {
            return back()->with('error', 'No logo file was provided.');
        }

        $oldPath = $organization->logo_path;
        $path = $file->store("settings/company-logo/{$organizationId}", 'public');

        if ($oldPath && str_starts_with($oldPath, "settings/company-logo/{$organizationId}/")) {
            Storage::disk('public')->delete($oldPath);
        }

        $organization->update([
            'logo_path' => $path,
        ]);

        $audit->logCustom('branding_logo_uploaded', $organization, [
            'module' => 'settings',
            'category' => 'configuration',
            'organization_id' => $organizationId,
            'description' => 'Uploaded or replaced the company logo.',
            'metadata' => [
                'target' => 'company_logo',
                'path' => $path,
            ],
        ]);

        return back()->with('success', 'Company logo updated successfully.');
    }

    public function updatePreferences(Request $request, SystemSettingsService $settings, AuditLogger $audit): RedirectResponse
    {
        $organization = $this->currentOrganization();
        $organizationId = $organization?->id;

        if (!$organizationId) {
            return back()->with('error', 'Select an active organization to manage preferences.');
        }

        $validated = $request->validate([
            'pagination_size' => ['nullable', 'integer', 'min:5', 'max:200'],
            'default_locale' => ['nullable', 'string', 'max:32'],
            'maintenance_banner' => ['nullable', 'string', 'max:500'],
            'employee_code_prefix' => ['nullable', 'string', 'max:32'],
            'payslip_footer_text' => ['nullable', 'string', 'max:500'],
            'report_footer_text' => ['nullable', 'string', 'max:500'],
        ]);

        $old = [
            'pagination_size' => $settings->getInt('preferences', 'pagination_size', 15, $organizationId),
            'default_locale' => $settings->getString('preferences', 'default_locale', null, $organizationId),
            'maintenance_banner' => $settings->getString('preferences', 'maintenance_banner', null, $organizationId),
            'employee_code_prefix' => $settings->getString('preferences', 'employee_code_prefix', null, $organizationId),
            'payslip_footer_text' => $settings->getString('preferences', 'payslip_footer_text', null, $organizationId),
            'report_footer_text' => $settings->getString('preferences', 'report_footer_text', null, $organizationId),
        ];

        $actorId = $request->user() instanceof User ? $request->user()->id : null;

        $settings->setMany('preferences', [
            'pagination_size' => $validated['pagination_size'] ?? null,
            'default_locale' => $validated['default_locale'] ?? null,
            'maintenance_banner' => $validated['maintenance_banner'] ?? null,
            'employee_code_prefix' => $validated['employee_code_prefix'] ?? null,
            'payslip_footer_text' => $validated['payslip_footer_text'] ?? null,
            'report_footer_text' => $validated['report_footer_text'] ?? null,
        ], $organizationId, $actorId, true);

        $new = [
            'pagination_size' => $settings->getInt('preferences', 'pagination_size', 15, $organizationId),
            'default_locale' => $settings->getString('preferences', 'default_locale', null, $organizationId),
            'maintenance_banner' => $settings->getString('preferences', 'maintenance_banner', null, $organizationId),
            'employee_code_prefix' => $settings->getString('preferences', 'employee_code_prefix', null, $organizationId),
            'payslip_footer_text' => $settings->getString('preferences', 'payslip_footer_text', null, $organizationId),
            'report_footer_text' => $settings->getString('preferences', 'report_footer_text', null, $organizationId),
        ];

        $audit->logCustom('settings_updated', $organization, [
            'module' => 'settings',
            'category' => 'configuration',
            'organization_id' => $organizationId,
            'description' => 'Updated system preference settings.',
            'old_values' => $old,
            'new_values' => $new,
            'metadata' => [
                'group' => 'preferences',
            ],
        ]);

        return back()->with('success', 'Preferences updated successfully.');
    }

    public function updateBackups(Request $request, SystemSettingsService $settings, AuditLogger $audit): RedirectResponse
    {
        $systemOrgId = $settings->systemOrganizationId();

        $validated = $request->validate([
            'enable_automatic_backups' => ['required', 'boolean'],
            'backup_frequency' => ['required', 'in:daily,weekly'],
            'backup_day_of_week' => ['required', 'in:monday,tuesday,wednesday,thursday,friday,saturday,sunday'],
            'backup_time' => ['required', 'date_format:H:i'],
            'backup_retention_days' => ['required', 'integer', 'min:1', 'max:365'],
            'backup_local_enabled' => ['required', 'boolean'],
            'backup_local_path' => ['required', 'string', 'max:128', 'regex:/^[A-Za-z0-9_\\/-]+$/', 'not_regex:/\\.\\./'],
            'backup_email_enabled' => ['required', 'boolean'],
            'backup_email_recipients' => ['nullable', 'string', 'max:2000'],
            'backup_include_database' => ['required', 'boolean'],
            'backup_include_uploads' => ['required', 'boolean'],
            'backup_email_subject_prefix' => ['nullable', 'string', 'max:120'],
            'backup_email_message' => ['nullable', 'string', 'max:2000'],
        ]);

        $recipients = collect(preg_split('/\s*,\s*/', (string) ($validated['backup_email_recipients'] ?? ''), -1, PREG_SPLIT_NO_EMPTY) ?: [])
            ->filter()
            ->unique()
            ->values()
            ->all();

        foreach ($recipients as $recipient) {
            if (!filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
                return back()->withErrors([
                    'backup_email_recipients' => 'One or more email recipients are invalid.',
                ]);
            }
        }

        $old = [
            'enable_automatic_backups' => $settings->getBool('backup', 'enable_automatic_backups', false, $systemOrgId),
            'backup_frequency' => $settings->getString('backup', 'backup_frequency', 'daily', $systemOrgId),
            'backup_day_of_week' => $settings->getString('backup', 'backup_day_of_week', 'sunday', $systemOrgId),
            'backup_time' => $settings->getString('backup', 'backup_time', '02:00', $systemOrgId),
            'backup_retention_days' => $settings->getInt('backup', 'backup_retention_days', 14, $systemOrgId),
            'backup_local_enabled' => $settings->getBool('backup', 'backup_local_enabled', true, $systemOrgId),
            'backup_local_path' => $settings->getString('backup', 'backup_local_path', 'backups', $systemOrgId),
            'backup_email_enabled' => $settings->getBool('backup', 'backup_email_enabled', false, $systemOrgId),
            'backup_email_recipients' => $settings->getArray('backup', 'backup_email_recipients', [], $systemOrgId),
            'backup_include_database' => $settings->getBool('backup', 'backup_include_database', true, $systemOrgId),
            'backup_include_uploads' => $settings->getBool('backup', 'backup_include_uploads', false, $systemOrgId),
        ];

        $actorId = $request->user() instanceof User ? $request->user()->id : null;

        $settings->setMany('backup', [
            'enable_automatic_backups' => (bool) $validated['enable_automatic_backups'],
            'backup_frequency' => $validated['backup_frequency'],
            'backup_day_of_week' => $validated['backup_day_of_week'],
            'backup_time' => $validated['backup_time'],
            'backup_retention_days' => (int) $validated['backup_retention_days'],
            'backup_local_enabled' => (bool) $validated['backup_local_enabled'],
            'backup_local_path' => $validated['backup_local_path'],
            'backup_email_enabled' => (bool) $validated['backup_email_enabled'],
            'backup_email_recipients' => $recipients,
            'backup_include_database' => (bool) $validated['backup_include_database'],
            'backup_include_uploads' => (bool) $validated['backup_include_uploads'],
            'backup_email_subject_prefix' => $validated['backup_email_subject_prefix'] ?? null,
            'backup_email_message' => $validated['backup_email_message'] ?? null,
        ], $systemOrgId, $actorId, false);

        $new = [
            'enable_automatic_backups' => $settings->getBool('backup', 'enable_automatic_backups', false, $systemOrgId),
            'backup_frequency' => $settings->getString('backup', 'backup_frequency', 'daily', $systemOrgId),
            'backup_day_of_week' => $settings->getString('backup', 'backup_day_of_week', 'sunday', $systemOrgId),
            'backup_time' => $settings->getString('backup', 'backup_time', '02:00', $systemOrgId),
            'backup_retention_days' => $settings->getInt('backup', 'backup_retention_days', 14, $systemOrgId),
            'backup_local_enabled' => $settings->getBool('backup', 'backup_local_enabled', true, $systemOrgId),
            'backup_local_path' => $settings->getString('backup', 'backup_local_path', 'backups', $systemOrgId),
            'backup_email_enabled' => $settings->getBool('backup', 'backup_email_enabled', false, $systemOrgId),
            'backup_email_recipients' => $settings->getArray('backup', 'backup_email_recipients', [], $systemOrgId),
            'backup_include_database' => $settings->getBool('backup', 'backup_include_database', true, $systemOrgId),
            'backup_include_uploads' => $settings->getBool('backup', 'backup_include_uploads', false, $systemOrgId),
        ];

        $audit->logCustom('backup_settings_updated', null, [
            'module' => 'settings',
            'category' => 'configuration',
            'organization_id' => $this->tenantId(),
            'description' => 'Updated database backup configuration.',
            'old_values' => $old,
            'new_values' => $new,
            'metadata' => [
                'group' => 'backup',
            ],
        ]);

        return back()->with('success', 'Backup settings updated successfully.');
    }

    public function runBackup(Request $request, AuditLogger $audit): RedirectResponse
    {
        $actorId = $request->user() instanceof User ? $request->user()->id : null;

        $settings = app(SystemSettingsService::class);
        $systemOrgId = $settings->systemOrganizationId();

        $settings->setMany('backup', [
            'last_backup_status' => 'queued',
            'last_backup_error' => null,
        ], $systemOrgId, $actorId, false);

        RunDatabaseBackupJob::dispatch($actorId, 'manual');

        $audit->logCustom('backup_requested', null, [
            'module' => 'settings',
            'category' => 'operations',
            'organization_id' => $this->tenantId(),
            'description' => 'Requested a manual database backup run.',
        ]);

        return back()->with('success', 'Backup job queued successfully.');
    }

    public function downloadBackup(Request $request, string $file, SystemSettingsService $settings): StreamedResponse
    {
        $systemOrgId = $settings->systemOrganizationId();
        $baseDir = trim((string) $settings->getString('backup', 'backup_local_path', 'backups', $systemOrgId), '/');

        $file = basename($file);
        $path = "{$baseDir}/{$file}";

        $disk = Storage::disk('local');

        abort_unless($disk->exists($path), 404);

        return $disk->download($path, $file);
    }
}
