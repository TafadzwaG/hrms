<?php

namespace App\Support\Access;

use App\Models\Asset;
use App\Models\Benefit;
use App\Models\Employee;
use App\Models\User;
use App\Support\Dashboard\RoleDashboardResolver;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model as EloquentModel;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class RolePageScopeResolver
{
    private const TENANT_OPERATOR = 'tenant_operator';

    public const MODULE_ASSETS = 'assets';
    public const MODULE_ATTENDANCE = 'attendance';
    public const MODULE_BENEFIT_ENROLLMENTS = 'benefit_enrollments';
    public const MODULE_BENEFITS = 'benefits';
    public const MODULE_DOCUMENTS = 'documents';
    public const MODULE_EMPLOYEES = 'employees';
    public const MODULE_IMPROVEMENT_PLANS = 'improvement_plans';
    public const MODULE_LEAVE = 'leave';
    public const MODULE_PAYSLIPS = 'payslips';
    public const MODULE_SCORECARDS = 'scorecards';
    public const MODULE_TIMESHEETS = 'timesheets';

    public function __construct(
        private readonly RoleDashboardResolver $roleResolver,
    ) {
    }

    public function resolveRole(User $user): string
    {
        $roleCodes = $user->effectiveRoles()
            ->pluck('code')
            ->filter()
            ->map(fn (mixed $code) => (string) $code)
            ->values();

        foreach ([
            'SYS_ADMIN',
            'HR_ADMIN',
            'PAYROLL',
            'MANAGER',
            'AUTHORISER',
            'AUDITOR',
            'EMPLOYEE',
        ] as $roleCode) {
            if ($roleCodes->contains($roleCode)) {
                return $this->roleResolver->resolve($user);
            }
        }

        return self::TENANT_OPERATOR;
    }

    public function employee(User $user): ?Employee
    {
        return $user->relationLoaded('employee')
            ? $user->employee
            : $user->employee()->first();
    }

    public function context(User $user, string $module, ?string $requestedView = null): array
    {
        $role = $this->resolveRole($user);
        $employee = $this->employee($user);
        $allowsSelfToggle = $this->allowsSelfToggle($role, $module, $employee);
        $currentView = $this->normalizeView($role, $module, $requestedView, $employee);
        $mode = $this->modeFor($role, $module, $currentView);

        return [
            'role' => $role,
            'mode' => $mode,
            'label' => $this->labelFor($mode, $module),
            'allows_self_toggle' => $allowsSelfToggle,
            'current_view' => $currentView,
            'requested_view' => $requestedView,
            'self_label' => 'Mine',
            'team_label' => 'Direct reports',
        ];
    }

    public function applyScope(Builder $query, User $user, string $module, ?string $requestedView = null): array
    {
        $context = $this->context($user, $module, $requestedView);
        $role = $context['role'];

        switch ($module) {
            case self::MODULE_LEAVE:
                if ($role === RoleDashboardResolver::AUTHORISER) {
                    $query->whereIn(DB::raw('LOWER(status)'), ['pending', 'submitted', 'changes requested']);
                }
                $this->applyEmployeeColumnScope($query, $user, $module, 'employee_id', $context['current_view']);
                break;

            case self::MODULE_ATTENDANCE:
                $this->applyEmployeeColumnScope($query, $user, $module, 'employee_id', $context['current_view']);
                break;

            case self::MODULE_TIMESHEETS:
                if ($role === RoleDashboardResolver::AUTHORISER) {
                    $query->whereIn(DB::raw('LOWER(status)'), ['pending', 'submitted']);
                }
                $this->applyEmployeeColumnScope($query, $user, $module, 'employee_id', $context['current_view']);
                break;

            case self::MODULE_EMPLOYEES:
                $this->applyEmployeeColumnScope($query, $user, $module, 'id', $context['current_view']);
                break;

            case self::MODULE_DOCUMENTS:
                $this->applyEmployeeColumnScope($query, $user, $module, 'owner_employee_id', $context['current_view']);
                break;

            case self::MODULE_ASSETS:
                $this->applyAssetScope($query, $user, $module, $context['current_view']);
                break;

            case self::MODULE_BENEFIT_ENROLLMENTS:
                $this->applyEmployeeColumnScope($query, $user, $module, 'employee_id', $context['current_view']);
                break;

            case self::MODULE_BENEFITS:
                if ($role === RoleDashboardResolver::EMPLOYEE) {
                    $query->where('active', true);
                }
                break;

            case self::MODULE_SCORECARDS:
                $this->applyEmployeeColumnScope($query, $user, $module, 'employee_id', $context['current_view']);
                break;

            case self::MODULE_IMPROVEMENT_PLANS:
                $this->applyEmployeeColumnScope($query, $user, $module, 'employee_id', $context['current_view']);
                break;

            case self::MODULE_PAYSLIPS:
                $this->applyEmployeeColumnScope($query, $user, $module, 'employee_id', $context['current_view']);
                break;
        }

        return $context;
    }

    public function authorizeRecord(User $user, string $module, EloquentModel $record): void
    {
        if (! $this->recordMatchesScope($user, $module, $record)) {
            abort(404);
        }
    }

    public function ensureEmployeeIdAllowed(
        User $user,
        string $module,
        int|string|null $employeeId,
        ?string $requestedView = null,
        bool $selfOnlyForManagers = false,
    ): void {
        if (blank($employeeId)) {
            abort(404);
        }

        $employeeId = (int) $employeeId;
        $role = $this->resolveRole($user);
        $employee = $this->employee($user);

        if ($role === self::TENANT_OPERATOR) {
            return;
        }

        if ($role === RoleDashboardResolver::EMPLOYEE) {
            if (! $employee || $employee->id !== $employeeId) {
                abort(404);
            }

            return;
        }

        if ($role === RoleDashboardResolver::MANAGER) {
            if (! $employee) {
                abort(404);
            }

            if ($selfOnlyForManagers) {
                if ($employee->id !== $employeeId) {
                    abort(404);
                }

                return;
            }

            $allowed = Employee::query()
                ->where('manager_id', $employee->id)
                ->orWhere('id', $employee->id)
                ->where('id', $employeeId)
                ->exists();

            if (! $allowed) {
                abort(404);
            }

            return;
        }

        if ($role === RoleDashboardResolver::AUTHORISER
            && in_array($module, [self::MODULE_LEAVE, self::MODULE_TIMESHEETS], true)) {
            return;
        }
    }

    public function accessibleEmployees(User $user, string $module, ?string $requestedView = null): Collection
    {
        $query = Employee::query()
            ->select('id', 'first_name', 'middle_name', 'surname', 'staff_number')
            ->orderBy('first_name')
            ->orderBy('surname');

        if ($module === self::MODULE_EMPLOYEES) {
            $this->applyEmployeeColumnScope($query, $user, $module, 'id', $requestedView);
        } else {
            $this->applyEmployeeColumnScope($query, $user, $module, 'id', $requestedView, true);
        }

        return $query->get();
    }

    public function scopeViewFromRequest(?string $value): ?string
    {
        $value = trim((string) $value);

        return in_array($value, ['mine', 'team'], true) ? $value : null;
    }

    private function applyEmployeeColumnScope(
        Builder $query,
        User $user,
        string $module,
        string $column,
        ?string $requestedView = null,
        bool $includeSelfForManager = false,
    ): void {
        $role = $this->resolveRole($user);

        if (in_array($role, [
            RoleDashboardResolver::SYSTEM_ADMIN,
            RoleDashboardResolver::HR_ADMIN,
            RoleDashboardResolver::PAYROLL,
            RoleDashboardResolver::AUDITOR,
            self::TENANT_OPERATOR,
        ], true)) {
            return;
        }

        if ($role === RoleDashboardResolver::AUTHORISER
            && ! in_array($module, [self::MODULE_LEAVE, self::MODULE_TIMESHEETS], true)) {
            return;
        }

        $query->whereIn($column, $this->employeeIdsSubquery($user, $module, $requestedView, $includeSelfForManager));
    }

    private function applyAssetScope(Builder $query, User $user, string $module, ?string $requestedView = null): void
    {
        $role = $this->resolveRole($user);

        if (in_array($role, [
            RoleDashboardResolver::SYSTEM_ADMIN,
            RoleDashboardResolver::HR_ADMIN,
            RoleDashboardResolver::PAYROLL,
            RoleDashboardResolver::AUTHORISER,
            RoleDashboardResolver::AUDITOR,
            self::TENANT_OPERATOR,
        ], true)) {
            return;
        }

        $query->whereHas('currentAssignment', function (Builder $assignmentQuery) use ($user, $module, $requestedView) {
            $assignmentQuery->whereIn('employee_id', $this->employeeIdsSubquery($user, $module, $requestedView));
        });
    }

    private function recordMatchesScope(User $user, string $module, EloquentModel $record): bool
    {
        $role = $this->resolveRole($user);

        if (in_array($role, [
            RoleDashboardResolver::SYSTEM_ADMIN,
            RoleDashboardResolver::HR_ADMIN,
            RoleDashboardResolver::PAYROLL,
        ], true)) {
            return true;
        }

        if ($role === RoleDashboardResolver::AUDITOR) {
            return true;
        }

        if ($role === self::TENANT_OPERATOR) {
            return true;
        }

        if ($module === self::MODULE_BENEFITS && $record instanceof Benefit) {
            return $role !== RoleDashboardResolver::EMPLOYEE || (bool) $record->active;
        }

        if ($role === RoleDashboardResolver::AUTHORISER) {
            return match ($module) {
                self::MODULE_LEAVE => in_array(strtolower((string) $record->getAttribute('status')), ['pending', 'submitted', 'changes requested'], true),
                self::MODULE_TIMESHEETS => in_array(strtolower((string) $record->getAttribute('status')), ['pending', 'submitted'], true),
                default => true,
            };
        }

        $employee = $this->employee($user);

        if (! $employee) {
            return false;
        }

        $employeeId = match ($module) {
            self::MODULE_EMPLOYEES => (int) $record->getKey(),
            self::MODULE_DOCUMENTS => (int) $record->getAttribute('owner_employee_id'),
            self::MODULE_ASSETS => $this->assetEmployeeId($record),
            default => (int) $record->getAttribute('employee_id'),
        };

        if ($employeeId <= 0) {
            return false;
        }

        if ($role === RoleDashboardResolver::EMPLOYEE) {
            return $employee->id === $employeeId;
        }

        if ($role === RoleDashboardResolver::MANAGER) {
            if ($module === self::MODULE_PAYSLIPS) {
                return $employeeId === $employee->id;
            }

            return $employeeId === $employee->id
                || Employee::query()->where('manager_id', $employee->id)->whereKey($employeeId)->exists();
        }

        return true;
    }

    private function employeeIdsSubquery(
        User $user,
        string $module,
        ?string $requestedView = null,
        bool $includeSelfForManager = false,
    ): Builder {
        $role = $this->resolveRole($user);
        $employee = $this->employee($user);

        if (in_array($role, [
            RoleDashboardResolver::SYSTEM_ADMIN,
            RoleDashboardResolver::HR_ADMIN,
            RoleDashboardResolver::PAYROLL,
            RoleDashboardResolver::AUTHORISER,
            RoleDashboardResolver::AUDITOR,
            self::TENANT_OPERATOR,
        ], true)) {
            return Employee::query()->select('id');
        }

        if (! $employee) {
            return Employee::query()->select('id')->whereRaw('1 = 0');
        }

        if ($role === RoleDashboardResolver::EMPLOYEE) {
            return Employee::query()->select('id')->whereKey($employee->id);
        }

        $view = $this->normalizeView($role, $module, $requestedView, $employee);

        $managerQuery = Employee::query()->select('id');

        if ($view === 'self') {
            return $managerQuery->whereKey($employee->id);
        }

        if ($includeSelfForManager) {
            return $managerQuery->where(function (Builder $builder) use ($employee): void {
                $builder
                    ->where('manager_id', $employee->id)
                    ->orWhere('id', $employee->id);
            });
        }

        return $managerQuery->where('manager_id', $employee->id);
    }

    private function normalizeView(string $role, string $module, ?string $requestedView, ?Employee $employee): ?string
    {
        if ($role !== RoleDashboardResolver::MANAGER || ! $employee) {
            return null;
        }

        if (! $this->allowsSelfToggle($role, $module, $employee)) {
            return $this->managerDefaultViewFor($module);
        }

        if (in_array($requestedView, ['mine', 'self'], true)) {
            return 'self';
        }

        return 'team';
    }

    private function allowsSelfToggle(string $role, string $module, ?Employee $employee): bool
    {
        if ($role !== RoleDashboardResolver::MANAGER || ! $employee) {
            return false;
        }

        return in_array($module, [
            self::MODULE_ASSETS,
            self::MODULE_ATTENDANCE,
            self::MODULE_BENEFIT_ENROLLMENTS,
            self::MODULE_DOCUMENTS,
            self::MODULE_EMPLOYEES,
            self::MODULE_IMPROVEMENT_PLANS,
            self::MODULE_LEAVE,
            self::MODULE_SCORECARDS,
            self::MODULE_TIMESHEETS,
        ], true);
    }

    private function managerDefaultViewFor(string $module): string
    {
        return match ($module) {
            self::MODULE_PAYSLIPS => 'self',
            default => 'team',
        };
    }

    private function modeFor(string $role, string $module, ?string $view): string
    {
        return match (true) {
            $role === RoleDashboardResolver::EMPLOYEE => 'self',
            $role === RoleDashboardResolver::MANAGER && $view === 'self' => 'self',
            $role === RoleDashboardResolver::MANAGER => 'team',
            $role === RoleDashboardResolver::AUTHORISER && in_array($module, [self::MODULE_LEAVE, self::MODULE_TIMESHEETS], true) => 'approval_queue',
            $role === RoleDashboardResolver::AUDITOR => 'readonly',
            default => 'tenant',
        };
    }

    private function labelFor(string $mode, string $module): string
    {
        return match ($mode) {
            'self' => in_array($module, [self::MODULE_EMPLOYEES], true) ? 'My employee record' : 'My records',
            'team' => 'Direct reports',
            'approval_queue' => 'Approval queue',
            'readonly' => 'Read-only organization view',
            default => 'Organization view',
        };
    }

    private function assetEmployeeId(EloquentModel $record): int
    {
        if (! $record instanceof Asset) {
            return 0;
        }

        $record->loadMissing(['currentAssignment']);

        return (int) optional($record->currentAssignment)->employee_id;
    }
}
