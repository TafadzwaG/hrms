<?php

namespace App\Jobs;

use App\Mail\DatabaseBackupMail;
use App\Support\Audit\AuditLogger;
use App\Support\Backups\DatabaseBackupService;
use App\Support\Settings\SystemSettingsService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Throwable;

class RunDatabaseBackupJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public ?int $actorId = null,
        public string $trigger = 'manual',
    ) {
    }

    public function handle(SystemSettingsService $settings, DatabaseBackupService $backupService, AuditLogger $auditLogger): void
    {
        $systemOrgId = $settings->systemOrganizationId();

        $settings->setMany('backup', [
            'last_backup_status' => 'running',
            'last_backup_error' => null,
        ], $systemOrgId, $this->actorId, false);

        $result = $backupService->create([
            'base_dir' => $settings->getString('backup', 'backup_local_path', 'backups', $systemOrgId) ?? 'backups',
            'retention_days' => $settings->getInt('backup', 'backup_retention_days', 14, $systemOrgId),
            'include_database' => $settings->getBool('backup', 'backup_include_database', true, $systemOrgId),
            'include_uploads' => $settings->getBool('backup', 'backup_include_uploads', false, $systemOrgId),
        ]);

        $settings->setMany('backup', [
            'last_backup_at' => now()->toDateTimeString(),
            'last_backup_status' => 'success',
            'last_backup_file' => $result['filename'] ?? null,
            'last_backup_error' => null,
        ], $systemOrgId, $this->actorId, false);

        if ($this->trigger === 'scheduled') {
            $settings->set('backup', 'last_scheduled_backup_at', now()->toDateTimeString(), $systemOrgId, $this->actorId, false);
        }

        $auditLogger->logCustom('backup_completed', null, [
            'module' => 'settings',
            'category' => 'operations',
            'organization_id' => null,
            'description' => 'Created a database backup.',
            'new_values' => [
                'filename' => $result['filename'] ?? null,
                'path' => $result['path'] ?? null,
                'size' => $result['size'] ?? null,
                'includes_database' => $result['includes_database'] ?? null,
                'includes_uploads' => $result['includes_uploads'] ?? null,
                'deleted_old_files' => $result['deleted_old_files'] ?? null,
                'trigger' => $this->trigger,
            ],
        ]);

        $this->sendBackupEmail($settings, $systemOrgId, $result, $auditLogger);
    }

    /**
     * @param  array<string, mixed>  $backup
     */
    private function sendBackupEmail(SystemSettingsService $settings, int $systemOrgId, array $backup, AuditLogger $auditLogger): void
    {
        $enabled = $settings->getBool('backup', 'backup_email_enabled', false, $systemOrgId);
        $recipients = $settings->getArray('backup', 'backup_email_recipients', [], $systemOrgId);

        if (! $enabled || empty($recipients)) {
            return;
        }

        $subjectPrefix = $settings->getString('backup', 'backup_email_subject_prefix', null, $systemOrgId);
        $message = $settings->getString('backup', 'backup_email_message', null, $systemOrgId);
        $systemName = $settings->getString('general', 'system_name', config('app.name'), $systemOrgId) ?? config('app.name');

        $maxMb = (int) (env('BACKUP_EMAIL_ATTACH_MAX_MB') ?: 20);
        $attachLimitBytes = max(1, $maxMb) * 1024 * 1024;

        $size = (int) ($backup['size'] ?? 0);
        $shouldAttach = $size > 0 && $size <= $attachLimitBytes;

        foreach ($recipients as $recipient) {
            try {
                Mail::to($recipient)->send(new DatabaseBackupMail(
                    systemName: $systemName,
                    filename: (string) ($backup['filename'] ?? 'backup.zip'),
                    storageDisk: 'local',
                    storagePath: (string) ($backup['path'] ?? ''),
                    size: $size,
                    createdAt: (string) ($backup['created_at'] ?? now()->toDateTimeString()),
                    includeAttachment: $shouldAttach,
                    subjectPrefix: $subjectPrefix,
                    message: $message,
                ));

                $auditLogger->logCustom('backup_emailed', null, [
                    'module' => 'settings',
                    'category' => 'communication',
                    'organization_id' => null,
                    'description' => 'Emailed a database backup.',
                    'metadata' => [
                        'recipient' => $recipient,
                        'filename' => $backup['filename'] ?? null,
                        'attached' => $shouldAttach,
                    ],
                ]);
            } catch (Throwable $exception) {
                $auditLogger->logCustom('backup_email_failed', null, [
                    'module' => 'settings',
                    'category' => 'communication',
                    'organization_id' => null,
                    'description' => 'Backup email delivery failed.',
                    'metadata' => [
                        'recipient' => $recipient,
                        'filename' => $backup['filename'] ?? null,
                        'failure_reason' => Str::limit($exception->getMessage(), 1000),
                    ],
                ]);
            }
        }
    }

    public function failed(Throwable $exception): void
    {
        $settings = app(SystemSettingsService::class);
        $systemOrgId = $settings->systemOrganizationId();

        $settings->setMany('backup', [
            'last_backup_at' => now()->toDateTimeString(),
            'last_backup_status' => 'failed',
            'last_backup_error' => Str::limit($exception->getMessage(), 2000),
        ], $systemOrgId, $this->actorId, false);

        app(AuditLogger::class)->logCustom('backup_failed', null, [
            'module' => 'settings',
            'category' => 'operations',
            'organization_id' => null,
            'description' => 'Database backup job failed.',
            'metadata' => [
                'trigger' => $this->trigger,
                'failure_reason' => Str::limit($exception->getMessage(), 2000),
            ],
        ]);
    }
}

