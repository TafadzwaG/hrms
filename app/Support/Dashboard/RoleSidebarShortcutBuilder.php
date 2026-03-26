<?php

namespace App\Support\Dashboard;

use App\Models\Asset;
use App\Models\Employee;
use App\Models\EmployeeBenefitEnrollment;
use App\Models\EmployeeScorecard;
use App\Models\LeaveRequest;
use App\Models\OnboardingTask;
use App\Models\Organization;
use App\Models\PayrollPeriod;
use App\Models\PayrollResult;
use App\Models\Timesheet;
use App\Models\User;
use App\Support\Tenancy\TenantContext;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class RoleSidebarShortcutBuilder
{
    public function __construct(
        private readonly RoleDashboardResolver $resolver,
        private readonly TenantContext $tenantContext,
    ) {
    }

    public function build(User $user): array
    {
        $role = $this->resolver->resolve($user);

        $items = match ($role) {
            RoleDashboardResolver::SYSTEM_ADMIN => [
                $this->shortcut('Employees', '/employees', 'users', (string) Employee::query()->count()),
                $this->shortcut('Users', '/users', 'user-plus', (string) $this->visibleUsersQuery()->count()),
                $this->shortcut('Organizations', '/organizations', 'building-2', (string) $this->visibleOrganizations()->count()),
                $this->shortcut('Recruitment Admin', '/recruitment', 'briefcase'),
                $this->shortcut('System Settings', '/system-settings', 'settings'),
            ],
            RoleDashboardResolver::HR_ADMIN => [
                $this->shortcut('Employees', '/employees', 'users', (string) Employee::query()->count()),
                $this->shortcut('Leave Requests', '/leave-requests', 'calendar-days', (string) $this->pendingLeaveCount()),
                $this->shortcut('Onboarding', '/onboarding-tasks', 'rocket', (string) OnboardingTask::query()->count()),
                $this->shortcut('Benefits', '/benefits/dashboard', 'heart', (string) EmployeeBenefitEnrollment::query()->where('status', 'active')->count()),
                $this->shortcut('Performance', '/performance', 'target', (string) EmployeeScorecard::query()->count()),
            ],
            RoleDashboardResolver::PAYROLL => [
                $this->shortcut('Payroll', '/payroll', 'wallet', (string) PayrollPeriod::query()->count()),
                $this->shortcut('Payslips', '/payroll/payslips', 'mail', (string) PayrollResult::query()->count()),
                $this->shortcut('Timesheets', '/timesheets', 'clock-3', (string) Timesheet::query()->count()),
                $this->shortcut('Reports', '/reports', 'file-bar-chart'),
                $this->shortcut('Employees', '/employees', 'users'),
            ],
            RoleDashboardResolver::MANAGER => [
                $this->shortcut('Team Employees', '/employees', 'users', (string) $this->teamQuery($user)->count()),
                $this->shortcut('Leave Requests', '/leave-requests', 'calendar-days', (string) $this->teamLeaveCount($user)),
                $this->shortcut('Timesheets', '/timesheets', 'clock-3', (string) $this->teamTimesheetCount($user)),
                $this->shortcut('Performance', '/employee-scorecards', 'target', (string) $this->teamScorecardCount($user)),
                $this->shortcut('Assets', '/assets', 'layout-grid', (string) $this->teamAssetCount($user)),
            ],
            RoleDashboardResolver::AUTHORISER => [
                $this->shortcut('Leave Requests', '/leave-requests', 'calendar-days', (string) $this->pendingLeaveCount()),
                $this->shortcut('Timesheets', '/timesheets', 'clock-3', (string) $this->pendingTimesheetCount()),
                $this->shortcut('Payroll', '/payroll', 'wallet', (string) PayrollPeriod::query()->whereIn(DB::raw('LOWER(status)'), ['processed', 'approval_pending'])->count()),
                $this->shortcut('Reports', '/reports', 'file-bar-chart'),
                $this->shortcut('Documents', '/documents', 'file-text'),
            ],
            RoleDashboardResolver::AUDITOR => [
                $this->shortcut('Audit Trail', '/audit-trail', 'history'),
                $this->shortcut('Reports', '/reports', 'file-bar-chart'),
                $this->shortcut('Documents', '/documents', 'file-text'),
                $this->shortcut('Payroll', '/payroll', 'wallet'),
                $this->shortcut('Users', '/users', 'shield'),
            ],
            default => [
                $this->shortcut('My Leave', '/leave-requests', 'calendar-days', (string) $this->employeeLeaveCount($user)),
                $this->shortcut('My Attendance', '/attendance-records', 'clock-3', (string) $this->employeeAttendanceCount($user)),
                $this->shortcut('My Timesheets', '/timesheets', 'clock-3', (string) $this->employeeTimesheetCount($user)),
                $this->shortcut('My Payslips', '/payroll/payslips', 'mail', (string) $this->employeePayslipCount($user)),
                $this->shortcut('My Benefits', '/benefits/dashboard', 'heart', (string) $this->employeeBenefitCount($user)),
            ],
        };

        return array_values(array_filter($items, fn (array $item) => $user->canAccess(Arr::wrap($item['permissions'] ?? []))));
    }

    private function shortcut(string $title, string $href, string $icon, ?string $badge = null, string|array|null $permissions = null): array
    {
        return [
            'title' => $title,
            'href' => $href,
            'icon' => $icon,
            'badge' => $badge,
            'permissions' => $permissions ?? $this->inferPermission($href),
        ];
    }

    private function inferPermission(string $href): array
    {
        return match ($href) {
            '/employees' => ['employees.view'],
            '/users' => ['users.view'],
            '/organizations' => ['organizations.view'],
            '/recruitment' => ['recruitment.view'],
            '/system-settings' => ['settings.view'],
            '/leave-requests' => ['leave.view'],
            '/attendance-records' => ['attendance.view'],
            '/onboarding-tasks' => ['onboarding.view'],
            '/benefits/dashboard' => ['benefits.view'],
            '/performance', '/employee-scorecards' => ['performance.view', 'performance.dashboard.view', 'performance.scorecards.view'],
            '/payroll' => ['payroll.view'],
            '/payroll/payslips' => ['payslips.view', 'payroll.view'],
            '/timesheets' => ['timesheets.view'],
            '/reports' => ['reports.view'],
            '/assets' => ['assets.view'],
            '/audit-trail' => ['audit.view'],
            '/documents' => ['documents.view'],
            default => ['dashboard.view'],
        };
    }

    private function visibleUsersQuery()
    {
        $query = User::query();
        $tenantId = $this->tenantContext->id();

        if ($tenantId) {
            $query->whereHas('organizations', function ($membershipQuery) use ($tenantId): void {
                $membershipQuery
                    ->where('organizations.id', $tenantId)
                    ->where('organization_user.is_active', true);
            });
        }

        return $query;
    }

    private function visibleOrganizations(): Collection
    {
        if ($this->tenantContext->isDisabled()) {
            return Organization::query()->get(['id']);
        }

        $tenantId = $this->tenantContext->id();

        return $tenantId
            ? Organization::query()->whereKey($tenantId)->get(['id'])
            : collect();
    }

    private function teamQuery(User $user)
    {
        $employeeId = $user->employee?->id ?? $user->employee()->value('id');

        return Employee::query()->where('manager_id', $employeeId ?: 0);
    }

    private function teamLeaveCount(User $user): int
    {
        return LeaveRequest::query()->whereIn('employee_id', $this->teamQuery($user)->select('id'))->count();
    }

    private function teamTimesheetCount(User $user): int
    {
        return Timesheet::query()->whereIn('employee_id', $this->teamQuery($user)->select('id'))->count();
    }

    private function teamScorecardCount(User $user): int
    {
        return EmployeeScorecard::query()->whereIn('employee_id', $this->teamQuery($user)->select('id'))->count();
    }

    private function teamAssetCount(User $user): int
    {
        return Asset::query()
            ->whereHas('currentAssignment', function ($query) use ($user): void {
                $query->whereIn('employee_id', $this->teamQuery($user)->select('id'));
            })
            ->count();
    }

    private function pendingLeaveCount(): int
    {
        return LeaveRequest::query()->whereIn(DB::raw('LOWER(status)'), ['pending', 'submitted'])->count();
    }

    private function pendingTimesheetCount(): int
    {
        return Timesheet::query()->whereIn(DB::raw('LOWER(status)'), ['pending', 'submitted'])->count();
    }

    private function employeeId(User $user): ?int
    {
        return $user->employee?->id ?? $user->employee()->value('id');
    }

    private function employeeLeaveCount(User $user): int
    {
        $employeeId = $this->employeeId($user);

        if (! $employeeId) {
            return 0;
        }

        return LeaveRequest::query()
            ->where('employee_id', $employeeId)
            ->whereIn(DB::raw('LOWER(status)'), ['pending', 'submitted', 'changes requested'])
            ->count();
    }

    private function employeeAttendanceCount(User $user): int
    {
        $employeeId = $this->employeeId($user);

        if (! $employeeId) {
            return 0;
        }

        return \App\Models\AttendanceRecord::query()
            ->where('employee_id', $employeeId)
            ->whereBetween('work_date', [now()->startOfMonth()->toDateString(), now()->endOfMonth()->toDateString()])
            ->count();
    }

    private function employeeTimesheetCount(User $user): int
    {
        $employeeId = $this->employeeId($user);

        if (! $employeeId) {
            return 0;
        }

        return Timesheet::query()
            ->where('employee_id', $employeeId)
            ->whereIn(DB::raw('LOWER(status)'), ['draft', 'pending', 'submitted'])
            ->count();
    }

    private function employeePayslipCount(User $user): int
    {
        $employeeId = $this->employeeId($user);

        if (! $employeeId) {
            return 0;
        }

        return PayrollResult::query()->where('employee_id', $employeeId)->count();
    }

    private function employeeBenefitCount(User $user): int
    {
        $employeeId = $this->employeeId($user);

        if (! $employeeId) {
            return 0;
        }

        return EmployeeBenefitEnrollment::query()
            ->where('employee_id', $employeeId)
            ->where('status', 'active')
            ->count();
    }
}
