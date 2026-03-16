<?php

namespace App\Support\Backups;

use App\Jobs\RunDatabaseBackupJob;
use App\Support\Settings\SystemSettingsService;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

class ScheduledBackupDispatcher
{
    public function __construct(
        private readonly SystemSettingsService $settings,
    ) {
    }

    public function dispatchIfDue(): bool
    {
        $systemOrgId = $this->settings->systemOrganizationId();

        if (! $this->settings->getBool('backup', 'enable_automatic_backups', false, $systemOrgId)) {
            return false;
        }

        $frequency = $this->settings->getString('backup', 'backup_frequency', 'daily', $systemOrgId) ?? 'daily';
        $dayOfWeek = $this->settings->getString('backup', 'backup_day_of_week', 'sunday', $systemOrgId) ?? 'sunday';
        $time = $this->settings->getString('backup', 'backup_time', '02:00', $systemOrgId) ?? '02:00';

        $timezone = (string) (config('app.timezone') ?: 'UTC');

        [$hour, $minute] = $this->parseTime($time);

        $now = now($timezone);
        $dueAt = $now->copy()->setTime($hour, $minute, 0);

        if ($frequency === 'weekly') {
            $targetDow = $this->dayOfWeekNumber($dayOfWeek);

            if ($now->dayOfWeek !== $targetDow) {
                return false;
            }
        }

        if ($now->lessThan($dueAt)) {
            return false;
        }

        $lastScheduledAt = $this->settings->getString('backup', 'last_scheduled_backup_at', null, $systemOrgId);

        if ($lastScheduledAt) {
            try {
                $last = Carbon::parse($lastScheduledAt, $timezone);
                if ($last->greaterThanOrEqualTo($dueAt)) {
                    return false;
                }
            } catch (\Throwable) {
                // Ignore invalid timestamps and allow dispatch.
            }
        }

        $lock = Cache::lock('system_backups:schedule_dispatch', 120);

        if (! $lock->get()) {
            return false;
        }

        try {
            // Re-check under the lock.
            $lastScheduledAt = $this->settings->getString('backup', 'last_scheduled_backup_at', null, $systemOrgId);
            if ($lastScheduledAt) {
                try {
                    $last = Carbon::parse($lastScheduledAt, $timezone);
                    if ($last->greaterThanOrEqualTo($dueAt)) {
                        return false;
                    }
                } catch (\Throwable) {
                    // continue
                }
            }

            $this->settings->setMany('backup', [
                'last_backup_status' => 'queued',
                'last_backup_error' => null,
            ], $systemOrgId, null, false);

            RunDatabaseBackupJob::dispatch(null, 'scheduled');

            return true;
        } finally {
            $lock->release();
        }
    }

    /**
     * @return array{0:int,1:int}
     */
    private function parseTime(string $time): array
    {
        $time = trim($time);
        if (! preg_match('/^(\d{1,2}):(\d{2})$/', $time, $matches)) {
            return [2, 0];
        }

        $hour = max(0, min(23, (int) $matches[1]));
        $minute = max(0, min(59, (int) $matches[2]));

        return [$hour, $minute];
    }

    private function dayOfWeekNumber(string $day): int
    {
        return match (strtolower(trim($day))) {
            'monday' => Carbon::MONDAY,
            'tuesday' => Carbon::TUESDAY,
            'wednesday' => Carbon::WEDNESDAY,
            'thursday' => Carbon::THURSDAY,
            'friday' => Carbon::FRIDAY,
            'saturday' => Carbon::SATURDAY,
            default => Carbon::SUNDAY,
        };
    }
}

