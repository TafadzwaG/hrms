<?php

namespace App\Support\Dashboard;

use App\Models\User;

class RoleDashboardResolver
{
    public const SYSTEM_ADMIN = 'system_admin';
    public const HR_ADMIN = 'hr_admin';
    public const PAYROLL = 'payroll';
    public const MANAGER = 'manager';
    public const AUTHORISER = 'authoriser';
    public const AUDITOR = 'auditor';
    public const EMPLOYEE = 'employee';

    /**
     * @var array<string, string>
     */
    private const ROLE_CODE_MAP = [
        'SYS_ADMIN' => self::SYSTEM_ADMIN,
        'HR_ADMIN' => self::HR_ADMIN,
        'PAYROLL' => self::PAYROLL,
        'MANAGER' => self::MANAGER,
        'AUTHORISER' => self::AUTHORISER,
        'AUDITOR' => self::AUDITOR,
        'EMPLOYEE' => self::EMPLOYEE,
    ];

    /**
     * @var array<int, string>
     */
    private const ROLE_PRIORITY = [
        'SYS_ADMIN',
        'HR_ADMIN',
        'PAYROLL',
        'MANAGER',
        'AUTHORISER',
        'AUDITOR',
        'EMPLOYEE',
    ];

    public function resolve(User $user): string
    {
        $roleCodes = $user->effectiveRoles()
            ->pluck('code')
            ->filter()
            ->map(fn (mixed $code) => (string) $code)
            ->values();

        foreach (self::ROLE_PRIORITY as $roleCode) {
            if ($roleCodes->contains($roleCode)) {
                return self::ROLE_CODE_MAP[$roleCode];
            }
        }

        if ($user->canAccess(['settings.view', 'audit.view', 'users.view', 'organizations.view'])) {
            return self::HR_ADMIN;
        }

        if ($user->canAccess(['payroll.process', 'payroll.approve', 'payroll.close'])) {
            return self::PAYROLL;
        }

        if ($user->canAccess(['leave.approve', 'timesheets.approve'])) {
            return $user->canAccess(['employees.view', 'performance.review'])
                ? self::MANAGER
                : self::AUTHORISER;
        }

        if ($user->canAccess(['audit.view', 'audit.export'])) {
            return self::AUDITOR;
        }

        return self::EMPLOYEE;
    }

    public function title(string $variant): string
    {
        return match ($variant) {
            self::SYSTEM_ADMIN => 'System Administrator',
            self::HR_ADMIN => 'HR Administrator',
            self::PAYROLL => 'Payroll Officer',
            self::MANAGER => 'Manager',
            self::AUTHORISER => 'Authoriser',
            self::AUDITOR => 'Auditor',
            default => 'Employee',
        };
    }

    public function description(string $variant): string
    {
        return match ($variant) {
            self::SYSTEM_ADMIN => 'Cross-module operations, governance, and platform health.',
            self::HR_ADMIN => 'Workforce operations, talent flow, and people-risk visibility.',
            self::PAYROLL => 'Current payroll cycle control, exports, and payslip delivery.',
            self::MANAGER => 'Direct-report oversight, approvals, and team performance follow-through.',
            self::AUTHORISER => 'High-priority approval queues and ageing operational decisions.',
            self::AUDITOR => 'Read-only compliance watch across audit, access, and document controls.',
            default => 'Self-service actions, requests, and personal work essentials.',
        };
    }
}
