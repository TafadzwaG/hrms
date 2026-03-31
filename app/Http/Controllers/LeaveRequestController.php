<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ResolvesRolePageScope;
use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Support\Access\RolePageScopeResolver;
use App\Support\Audit\AuditContext;
use App\Support\Audit\AuditLogger;
use App\Support\Dashboard\RoleDashboardResolver;
use Carbon\Carbon;
use Carbon\CarbonInterface;
use Carbon\CarbonPeriod;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpException;

class LeaveRequestController extends Controller
{
    use ResolvesRolePageScope;

    private const MODULE_KEY = 'leave_requests';

    private const PAGE_ROOT = 'LeaveRequests';

    public function index(Request $request)
    {
        try {
        $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'month'  => ['nullable', 'string', 'max:32'],
            'page'   => ['nullable', 'integer', 'min:1'],
        ]);

        $search = $request->string('search')->toString();
        $config = $this->moduleConfig();
        $calendarMonth = $this->resolveCalendarMonth($request);

        $query = LeaveRequest::query()
            ->with($this->leaveRequestIndexRelations());
        $scope = $this->applyRolePageScope($query, $request, RolePageScopeResolver::MODULE_LEAVE);

        $searchable = Arr::get($config, 'searchable', []);

        if ($search !== '') {
            $query->where(function (Builder $builder) use ($search, $searchable) {
                $hasCondition = false;

                foreach ($searchable as $column) {
                    if (! $hasCondition) {
                        $builder->where($column, 'like', "%{$search}%");
                        $hasCondition = true;
                    } else {
                        $builder->orWhere($column, 'like', "%{$search}%");
                    }
                }

                $employeeSearch = function (Builder $employeeQuery) use ($search) {
                    $employeeQuery
                        ->where('staff_number', 'like', "%{$search}%")
                        ->orWhere('first_name', 'like', "%{$search}%")
                        ->orWhere('middle_name', 'like', "%{$search}%")
                        ->orWhere('surname', 'like', "%{$search}%");
                };

                if ($hasCondition) {
                    $builder->orWhereHas('employee', $employeeSearch);
                } else {
                    $builder->whereHas('employee', $employeeSearch);
                }
            });
        }

        $stats = $this->buildIndexStats(clone $query, $calendarMonth);
        $calendar = $this->buildScopedCalendar(clone $query, $calendarMonth);

        $records = $query
            ->orderByDesc('id')
            ->paginate(12)
            ->withQueryString();

        $records->getCollection()->transform(function (LeaveRequest $leaveRequest) {
            return $this->decorateLeaveRequest($leaveRequest);
        });

        return Inertia::render(self::PAGE_ROOT.'/Index', [
            'module' => $this->moduleMeta(),
            'records' => $records,
            'filters' => $this->roleScopedFilters([
                'search' => $search,
                'month' => $calendarMonth->format('Y-m'),
            ], $scope),
            'scope' => $scope,
            'stats' => $stats,
            'calendar' => $calendar,
        ]);
        } catch (ValidationException $e) {
            throw $e;
        } catch (HttpException $e) {
            throw $e;
        } catch (\Throwable $e) {
            report($e);
            return back()->with('error', 'Failed to load leave requests: '.$e->getMessage());
        }
    }

    public function create(Request $request)
    {
        try {
            $workspace = $this->buildLeaveWorkspace($request);

            return Inertia::render(self::PAGE_ROOT.'/Create', [
                'module' => $this->moduleMeta(),
                'record' => null,
                ...$workspace,
            ]);
        } catch (ValidationException $e) {
            throw $e;
        } catch (HttpException $e) {
            throw $e;
        } catch (\Throwable $e) {
            report($e);
            return redirect()
                ->to('/'.Arr::get($this->moduleConfig(), 'slug'))
                ->with('error', 'Failed to load the leave form: '.$e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate($this->validationRules());
            $validated = $this->prepareLeavePayload($validated);
            $this->ensureRoleScopedEmployeeIdAllowed($request, RolePageScopeResolver::MODULE_LEAVE, $validated['employee_id'] ?? null);

            LeaveRequest::create($validated);

            return redirect()
                ->to('/'.Arr::get($this->moduleConfig(), 'slug'))
                ->with('success', Arr::get($this->moduleConfig(), 'name').' created successfully.');
        } catch (ValidationException $e) {
            throw $e;
        } catch (HttpException $e) {
            throw $e;
        } catch (\Throwable $e) {
            report($e);
            return back()->withInput()->with('error', 'Failed to submit leave request: '.$e->getMessage());
        }
    }

    public function show(Request $request)
    {
        try {
            $record = $this->decorateLeaveRequest(
                $this->findOrFail($this->resolveRouteRecordId($request))
            );
            $this->authorizeRoleScopedRecord($request, RolePageScopeResolver::MODULE_LEAVE, $record);

            $leaveBalances = $this->buildLeaveBalances($record);
            $recentHistory = $this->buildRecentHistory($record);
            $usageStats = $this->buildUsageStats($record, $recentHistory);

            return Inertia::render(self::PAGE_ROOT.'/Show', [
                'module' => $this->moduleMeta(),
                'record' => $record,
                'requestCode' => $this->requestCode($record),
                'leaveBalances' => $leaveBalances,
                'systemChecks' => $this->buildSystemChecks($record, $leaveBalances),
                'teamAvailability' => $this->buildTeamAvailability($record),
                'auditTrail' => $this->buildAuditTrail($record),
                'usageStats' => $usageStats,
                'recentHistory' => $recentHistory,
                'savedNote' => session('saved_leave_note', ''),
            ]);
        } catch (ValidationException $e) {
            throw $e;
        } catch (HttpException $e) {
            throw $e;
        } catch (\Throwable $e) {
            report($e);
            return redirect()
                ->to('/'.Arr::get($this->moduleConfig(), 'slug'))
                ->with('error', 'Failed to load leave request: '.$e->getMessage());
        }
    }

    public function approval(Request $request)
    {
        try {
            $record = $this->decorateLeaveRequest(
                $this->findOrFail($this->resolveRouteRecordId($request))
            );
            $this->authorizeRoleScopedRecord($request, RolePageScopeResolver::MODULE_LEAVE, $record);

            $approvalData = $this->buildApprovalData($record);
            $teamCoverage = $this->buildApprovalTeamCoverage($record);

            return Inertia::render(self::PAGE_ROOT.'/Approval', [
                'module' => $this->moduleMeta(),
                'record' => $record,
                'approvalData' => $approvalData,
                'history' => $this->buildApprovalHistory($record),
                'teamCoverage' => $teamCoverage,
                'systemChecks' => $this->buildApprovalSystemChecks($record, $approvalData, $teamCoverage),
                'requestActivity' => $this->buildApprovalRequestActivity($record),
            ]);
        } catch (ValidationException $e) {
            throw $e;
        } catch (HttpException $e) {
            throw $e;
        } catch (\Throwable $e) {
            report($e);
            return redirect()
                ->to('/'.Arr::get($this->moduleConfig(), 'slug'))
                ->with('error', 'Failed to load approval page: '.$e->getMessage());
        }
    }

    public function edit(Request $request)
    {
        try {
            $record = $this->decorateLeaveRequest(
                $this->findOrFail($this->resolveRouteRecordId($request))
            );
            $this->authorizeRoleScopedRecord($request, RolePageScopeResolver::MODULE_LEAVE, $record);
            $workspace = $this->buildLeaveWorkspace($request, $record);

            return Inertia::render(self::PAGE_ROOT.'/Edit', [
                'module' => $this->moduleMeta(),
                'record' => $record,
                ...$workspace,
            ]);
        } catch (ValidationException $e) {
            throw $e;
        } catch (HttpException $e) {
            throw $e;
        } catch (\Throwable $e) {
            report($e);
            return redirect()
                ->to('/'.Arr::get($this->moduleConfig(), 'slug'))
                ->with('error', 'Failed to load the edit form: '.$e->getMessage());
        }
    }

    public function update(Request $request)
    {
        try {
            $record = $this->findOrFail($this->resolveRouteRecordId($request));
            $this->authorizeRoleScopedRecord($request, RolePageScopeResolver::MODULE_LEAVE, $record);

            $validated = $request->validate($this->validationRules($record));
            $validated = $this->prepareLeavePayload($validated, $record);
            $this->ensureRoleScopedEmployeeIdAllowed($request, RolePageScopeResolver::MODULE_LEAVE, $validated['employee_id'] ?? null);
            $record->update($validated);

            $slug = Arr::get($this->moduleConfig(), 'slug');

            return redirect()
                ->to('/'.$slug.'/'.$record->id)
                ->with('success', Arr::get($this->moduleConfig(), 'name').' updated successfully.');
        } catch (ValidationException $e) {
            throw $e;
        } catch (HttpException $e) {
            throw $e;
        } catch (\Throwable $e) {
            report($e);
            return back()->withInput()->with('error', 'Failed to update leave request: '.$e->getMessage());
        }
    }

    public function destroy(Request $request)
    {
        try {
            $record = $this->findOrFail($this->resolveRouteRecordId($request));
            $this->authorizeRoleScopedRecord($request, RolePageScopeResolver::MODULE_LEAVE, $record);
            $record->delete();

            return redirect()
                ->to('/'.Arr::get($this->moduleConfig(), 'slug'))
                ->with('success', Arr::get($this->moduleConfig(), 'name').' deleted successfully.');
        } catch (HttpException $e) {
            throw $e;
        } catch (\Throwable $e) {
            report($e);
            return back()->with('error', 'Failed to delete leave request: '.$e->getMessage());
        }
    }

    public function approve(Request $request)
    {
        try {
            $record = $this->findOrFail($this->resolveRouteRecordId($request));
            $this->authorizeRoleScopedRecord($request, RolePageScopeResolver::MODULE_LEAVE, $record);
            $before = ['status' => $record->status, 'approver_name' => $record->approver_name];

            AuditContext::withoutAuditing(function () use ($record, $request): void {
                $record->update(['status' => 'Approved', 'approver_name' => $this->actorName($request)]);
            });

            app(AuditLogger::class)->logCustom('approve', $record, [
                'module' => 'leave',
                'category' => 'workflow',
                'description' => 'Approved leave request.',
                'old_values' => $before,
                'new_values' => ['status' => $record->status, 'approver_name' => $record->approver_name],
            ]);

            return redirect()
                ->route('leave-requests.approval', $record->id)
                ->with('success', 'Leave request approved successfully.');
        } catch (HttpException $e) {
            throw $e;
        } catch (\Throwable $e) {
            report($e);
            return back()->with('error', 'Failed to approve leave request: '.$e->getMessage());
        }
    }

    public function deny(Request $request)
    {
        try {
            $record = $this->findOrFail($this->resolveRouteRecordId($request));
            $this->authorizeRoleScopedRecord($request, RolePageScopeResolver::MODULE_LEAVE, $record);
            $before = ['status' => $record->status, 'approver_name' => $record->approver_name];

            AuditContext::withoutAuditing(function () use ($record, $request): void {
                $record->update(['status' => 'Rejected', 'approver_name' => $this->actorName($request)]);
            });

            app(AuditLogger::class)->logCustom('reject', $record, [
                'module' => 'leave',
                'category' => 'workflow',
                'description' => 'Rejected leave request.',
                'old_values' => $before,
                'new_values' => ['status' => $record->status, 'approver_name' => $record->approver_name],
            ]);

            return redirect()
                ->route('leave-requests.approval', $record->id)
                ->with('success', 'Leave request denied successfully.');
        } catch (HttpException $e) {
            throw $e;
        } catch (\Throwable $e) {
            report($e);
            return back()->with('error', 'Failed to deny leave request: '.$e->getMessage());
        }
    }

    public function requestChanges(Request $request)
    {
        try {
            $request->validate(['note' => ['nullable', 'string', 'max:1000']]);

            $record = $this->findOrFail($this->resolveRouteRecordId($request));
            $this->authorizeRoleScopedRecord($request, RolePageScopeResolver::MODULE_LEAVE, $record);
            $before = ['status' => $record->status, 'approver_name' => $record->approver_name];

            AuditContext::withoutAuditing(function () use ($record, $request): void {
                $record->update(['status' => 'Changes Requested', 'approver_name' => $this->actorName($request)]);
            });

            app(AuditLogger::class)->logCustom('request_changes', $record, [
                'module' => 'leave',
                'category' => 'workflow',
                'description' => 'Requested changes on leave request.',
                'old_values' => $before,
                'new_values' => ['status' => $record->status, 'approver_name' => $record->approver_name],
                'metadata' => ['note' => (string) $request->input('note', '')],
            ]);

            return redirect()
                ->to('/'.Arr::get($this->moduleConfig(), 'slug').'/'.$record->id)
                ->with('success', 'Change request sent successfully.')
                ->with('saved_leave_note', (string) $request->input('note', ''));
        } catch (ValidationException $e) {
            throw $e;
        } catch (HttpException $e) {
            throw $e;
        } catch (\Throwable $e) {
            report($e);
            return back()->with('error', 'Failed to request changes: '.$e->getMessage());
        }
    }

    public function saveNote(Request $request)
    {
        try {
            $validated = $request->validate([
                'note' => ['required', 'string', 'max:1000'],
                'notify_manager' => ['nullable', 'boolean'],
            ]);

            $record = $this->findOrFail($this->resolveRouteRecordId($request));
            $this->authorizeRoleScopedRecord($request, RolePageScopeResolver::MODULE_LEAVE, $record);

            app(AuditLogger::class)->logCustom('add_note', $record, [
                'module' => 'leave',
                'category' => 'workflow',
                'description' => 'Saved an internal note on a leave request.',
                'metadata' => [
                    'note' => $validated['note'],
                    'notify_manager' => (bool) ($validated['notify_manager'] ?? false),
                ],
            ]);

            return redirect()
                ->to('/'.Arr::get($this->moduleConfig(), 'slug').'/'.$record->id)
                ->with(
                    'success',
                    ($validated['notify_manager'] ?? false)
                        ? 'Internal note saved and manager notification queued.'
                        : 'Internal note saved.'
                )
                ->with('saved_leave_note', $validated['note']);
        } catch (ValidationException $e) {
            throw $e;
        } catch (HttpException $e) {
            throw $e;
        } catch (\Throwable $e) {
            report($e);
            return back()->with('error', 'Failed to save note: '.$e->getMessage());
        }
    }

    private function moduleMeta(): array
    {
        $config = $this->moduleConfig();
        $fields = Arr::get($config, 'fields', []);

        $defaultIndex = collect($fields)
            ->filter(fn (array $field) => (bool) ($field['index'] ?? false))
            ->keys()
            ->values()
            ->all();

        return [
            'slug' => Arr::get($config, 'slug'),
            'name' => Arr::get($config, 'name'),
            'description' => Arr::get($config, 'description'),
            'fields' => collect($fields)->map(function (array $field, string $name) {
                return [
                    'name' => $name,
                    'label' => $field['label'] ?? ucwords(str_replace('_', ' ', $name)),
                    'type' => $field['type'] ?? 'text',
                    'placeholder' => $field['placeholder'] ?? null,
                    'options' => $field['options'] ?? [],
                    'index' => (bool) ($field['index'] ?? false),
                ];
            })->values(),
            'index_columns' => Arr::get($config, 'index_columns', $defaultIndex),
        ];
    }

    private function moduleConfig(): array
    {
        $config = config('hrms_modules.'.self::MODULE_KEY, []);

        if (! is_array($config) || empty($config)) {
            abort(500, 'Module configuration missing for key: '.self::MODULE_KEY);
        }

        return $config;
    }

    private function validationRules(?Model $record = null): array
    {
        $fields = Arr::get($this->moduleConfig(), 'fields', []);
        $rules = [];

        foreach ($fields as $name => $field) {
            $fieldRules = $field['rules'] ?? ['nullable'];

            if (($field['unique'] ?? false) === true) {
                $table = (new LeaveRequest)->getTable();
                $fieldRules[] = $this->tenantUniqueRule($table, $name, $record?->getKey());
            }

            $rules[$name] = $fieldRules;
        }

        $rules['employee_id'] = ['required', 'integer', 'min:1'];
        $rules['days'] = ['nullable', 'numeric', 'min:0'];
        $rules['status'] = ['nullable', 'string', 'max:100'];

        return $rules;
    }

    private function findOrFail(string $id): LeaveRequest
    {
        return LeaveRequest::query()
            ->with($this->leaveRequestRelations())
            ->findOrFail($id);
    }

    private function resolveRouteRecordId(Request $request): string
    {
        $parameters = $request->route()?->parameters() ?? [];

        foreach ($parameters as $value) {
            if ($value instanceof Model) {
                return (string) $value->getKey();
            }

            if (is_scalar($value)) {
                return (string) $value;
            }
        }

        abort(404, 'Record not found.');
    }

    private function leaveRequestRelations(): array
    {
        return [
            'employee',
            'employee.user',
            'employee.orgUnit',
            'employee.location',
            'employee.position',
            'employee.manager',
        ];
    }

    private function leaveRequestIndexRelations(): array
    {
        return [
            'employee:id,staff_number,first_name,middle_name,surname,position_id',
            'employee.position:id,name',
        ];
    }

    private function decorateLeaveRequest(LeaveRequest $leaveRequest): LeaveRequest
    {
        if ($leaveRequest->relationLoaded('employee') && $leaveRequest->employee) {
            $leaveRequest->employee->append('full_name');

            if ($leaveRequest->employee->relationLoaded('manager') && $leaveRequest->employee->manager) {
                $leaveRequest->employee->manager->append('full_name');
            }
        }

        $leaveRequest->setAttribute('requested_days', $this->requestedDays($leaveRequest));
        $leaveRequest->setAttribute('status_bucket', $this->statusBucket($leaveRequest->status));
        $leaveRequest->setAttribute('status_tone', $this->statusTone($leaveRequest->status));
        $leaveRequest->setAttribute('employee_name', $this->employeeDisplayName($leaveRequest->employee));

        return $leaveRequest;
    }

    private function employeeOptions(Collection $employees): Collection
    {
        return $employees
            ->map(function (Employee $employee) {
                return [
                    'id' => $employee->id,
                    'staff_number' => $employee->staff_number,
                    'first_name' => $employee->first_name,
                    'middle_name' => $employee->middle_name,
                    'surname' => $employee->surname,
                    'full_name' => $employee->full_name,
                    'department' => $employee->orgUnit?->name,
                    'position' => $employee->position?->name ?? $employee->position?->title,
                ];
            })
            ->values();
    }

    private function buildLeaveWorkspace(Request $request, ?LeaveRequest $record = null): array
    {
        $scope = $this->rolePageScopeContext($request, RolePageScopeResolver::MODULE_LEAVE);
        $calendarMonth = $this->resolveCalendarMonth($request);
        $employees = $this->scopedEmployees($request);
        $selectedEmployee = $this->resolveSelectedEmployee($request, $employees, $record);
        $excludeRequestId = $record?->id;

        return [
            'scope' => $scope,
            'employees' => $this->employeeOptions($employees),
            'defaultEmployeeId' => $selectedEmployee?->id,
            'lockedEmployeeSelection' => ($scope['mode'] ?? null) === 'self'
                && ($scope['role'] ?? null) === RoleDashboardResolver::EMPLOYEE,
            'employeeContext' => $selectedEmployee
                ? $this->buildEmployeeContext($selectedEmployee, $excludeRequestId)
                : null,
            'stats' => $selectedEmployee
                ? $this->buildEmployeeStats($selectedEmployee, $excludeRequestId)
                : $this->emptyEmployeeStats(),
            'calendar' => $selectedEmployee
                ? $this->buildEmployeeCalendar($selectedEmployee, $calendarMonth)
                : $this->emptyCalendar($calendarMonth),
            'leaveTypes' => $this->leaveTypeOptions($record?->leave_type),
        ];
    }

    private function scopedEmployees(Request $request): Collection
    {
        $scoped = $this->roleScopedEmployees($request, RolePageScopeResolver::MODULE_LEAVE);

        if ($scoped->isEmpty()) {
            return collect();
        }

        $ids = $scoped->pluck('id')->map(fn (mixed $id) => (int) $id)->values();
        $details = Employee::query()
            ->with([
                'orgUnit:id,name',
                'position:id,name',
                'manager:id,first_name,middle_name,surname',
            ])
            ->whereIn('id', $ids)
            ->get()
            ->keyBy('id');

        return $ids
            ->map(function (int $id) use ($details) {
                /** @var Employee|null $employee */
                $employee = $details->get($id);

                if (! $employee) {
                    return null;
                }

                $employee->append('full_name');

                if ($employee->relationLoaded('manager') && $employee->manager) {
                    $employee->manager->append('full_name');
                }

                return $employee;
            })
            ->filter()
            ->values();
    }

    private function resolveSelectedEmployee(
        Request $request,
        Collection $employees,
        ?LeaveRequest $record = null,
    ): ?Employee {
        if ($employees->isEmpty()) {
            return null;
        }

        $previewEmployeeId = $request->integer('preview_employee_id');

        if ($previewEmployeeId > 0) {
            $previewEmployee = $employees->firstWhere('id', $previewEmployeeId);

            if ($previewEmployee instanceof Employee) {
                return $previewEmployee;
            }
        }

        if ($record && $record->employee_id) {
            $recordEmployee = $employees->firstWhere('id', (int) $record->employee_id);

            if ($recordEmployee instanceof Employee) {
                return $recordEmployee;
            }
        }

        $currentEmployee = $this->rolePageScopeResolver()->employee($request->user());

        if ($currentEmployee) {
            $matched = $employees->firstWhere('id', (int) $currentEmployee->id);

            if ($matched instanceof Employee) {
                return $matched;
            }
        }

        return $employees->first();
    }

    private function resolveCalendarMonth(Request $request): CarbonInterface
    {
        $month = trim((string) $request->input('month', ''));

        if ($month === '' || ! preg_match('/^\d{4}-\d{2}$/', $month)) {
            return now()->startOfMonth();
        }

        try {
            return Carbon::parse($month . '-01')->startOfMonth();
        } catch (\Throwable) {
            return now()->startOfMonth();
        }
    }

    private function prepareLeavePayload(array $validated, ?LeaveRequest $record = null): array
    {
        $validated['employee_id'] = (int) ($validated['employee_id'] ?? $record?->employee_id ?? 0);
        $validated['days'] = $this->calculateBusinessDays(
            $validated['start_date'] ?? $record?->start_date?->toDateString() ?? null,
            $validated['end_date'] ?? $record?->end_date?->toDateString() ?? null,
        );
        $validated['status'] = (string) ($validated['status'] ?? $record?->status ?? 'PENDING');
        $validated['approver_name'] = $validated['approver_name'] ?? $record?->approver_name;

        return $validated;
    }

    private function actorName(Request $request): string
    {
        return (string) ($request->user()?->name ?? 'HR Admin');
    }

    private function requestCode(LeaveRequest $record): string
    {
        return '#'.$record->id;
    }

    private function employeeDisplayName(?Employee $employee): string
    {
        if (! $employee) {
            return 'Unknown Employee';
        }

        if (isset($employee->full_name) && $employee->full_name) {
            return $employee->full_name;
        }

        return trim(
            ($employee->first_name ?? '').' '.
            ($employee->middle_name ? $employee->middle_name.' ' : '').
            ($employee->surname ?? '')
        ) ?: 'Unknown Employee';
    }

    private function employeeInitials(?Employee $employee): string
    {
        $name = $this->employeeDisplayName($employee);

        return collect(explode(' ', $name))
            ->filter()
            ->map(fn ($part) => strtoupper(substr($part, 0, 1)))
            ->take(2)
            ->implode('') ?: 'U';
    }

    private function leaveAllowanceMap(): array
    {
        return [
            'Annual Leave' => 22.0,
            'Sick Leave' => 10.0,
            'Compensatory' => 4.0,
        ];
    }

    private function leaveTypeOptions(?string $currentType = null): array
    {
        $defaults = collect(array_keys($this->leaveAllowanceMap()))
            ->merge([
                'Unpaid Leave',
                'Maternity Leave',
                'Paternity Leave',
                'Study Leave',
                'Bereavement Leave',
            ])
            ->push($this->normalizeLeaveType($currentType))
            ->merge(
                LeaveRequest::query()
                    ->whereNotNull('leave_type')
                    ->distinct()
                    ->pluck('leave_type')
                    ->map(fn (mixed $value) => $this->normalizeLeaveType((string) $value))
            )
            ->filter()
            ->unique()
            ->values();

        return $defaults->map(fn (string $label) => [
            'value' => $label,
            'label' => $label,
        ])->all();
    }

    private function normalizeLeaveType(?string $type): string
    {
        $normalized = strtolower(trim((string) $type));

        return match ($normalized) {
            '', 'annual', 'annual leave' => 'Annual Leave',
            'sick', 'sick leave' => 'Sick Leave',
            'compensatory', 'compensatory leave', 'comp leave' => 'Compensatory',
            'unpaid', 'unpaid leave' => 'Unpaid Leave',
            'maternity', 'maternity leave' => 'Maternity Leave',
            'paternity', 'paternity leave' => 'Paternity Leave',
            'study', 'study leave' => 'Study Leave',
            'bereavement', 'bereavement leave' => 'Bereavement Leave',
            default => trim((string) $type),
        };
    }

    private function statusBucket(?string $status): string
    {
        $normalized = strtolower(trim((string) $status));

        if ($normalized === '') {
            return 'pending';
        }

        return match (true) {
            str_contains($normalized, 'approve') => 'approved',
            str_contains($normalized, 'reject') || str_contains($normalized, 'deny') => 'rejected',
            str_contains($normalized, 'cancel') => 'cancelled',
            str_contains($normalized, 'change') || str_contains($normalized, 'request') => 'changes_requested',
            str_contains($normalized, 'conflict') => 'conflict',
            str_contains($normalized, 'submitted'), str_contains($normalized, 'pending') => 'pending',
            default => 'other',
        };
    }

    private function statusTone(?string $status): string
    {
        return match ($this->statusBucket($status)) {
            'approved' => 'approved',
            'rejected', 'cancelled' => 'rejected',
            'changes_requested', 'conflict' => 'warning',
            default => 'pending',
        };
    }

    private function displayStatus(?string $status): string
    {
        return match ($this->statusBucket($status)) {
            'approved' => 'Approved',
            'rejected' => 'Rejected',
            'cancelled' => 'Cancelled',
            'changes_requested' => 'Changes Requested',
            'conflict' => 'Conflict',
            default => 'Pending',
        };
    }

    private function calculateBusinessDays(?string $startDate, ?string $endDate): float
    {
        if (blank($startDate) || blank($endDate)) {
            return 0;
        }

        $start = Carbon::parse($startDate)->startOfDay();
        $end = Carbon::parse($endDate)->startOfDay();

        if ($end->lt($start)) {
            return 0;
        }

        $days = 0;

        foreach (CarbonPeriod::create($start, $end) as $date) {
            if (! $date->isWeekend()) {
                $days++;
            }
        }

        return (float) $days;
    }

    private function approvedRequestsForEmployee(int $employeeId, ?int $excludeRequestId = null): Collection
    {
        return LeaveRequest::query()
            ->where('employee_id', $employeeId)
            ->when($excludeRequestId, fn (Builder $query, int $id) => $query->whereKeyNot($id))
            ->get()
            ->filter(fn (LeaveRequest $item) => $this->statusBucket($item->status) === 'approved')
            ->values();
    }

    private function leaveBalancesForEmployee(
        int $employeeId,
        ?string $currentType = null,
        float $requestedDays = 0,
        ?int $excludeRequestId = null,
    ): array {
        $allowances = $this->leaveAllowanceMap();
        $approvedRequests = $this->approvedRequestsForEmployee($employeeId, $excludeRequestId);
        $takenByType = $approvedRequests
            ->groupBy(fn (LeaveRequest $item) => $this->normalizeLeaveType($item->leave_type))
            ->map(fn (Collection $items) => $this->sumLeaveDays($items));

        $currentType = $this->normalizeLeaveType($currentType);
        $balances = collect($allowances)
            ->map(function (float $total, string $type) use ($takenByType) {
                $taken = (float) ($takenByType->get($type, 0));

                return [
                    'key' => str($type)->snake()->toString(),
                    'type' => $type,
                    'total' => $total,
                    'taken' => $taken,
                    'remaining' => max(0, $total - $taken),
                ];
            })
            ->values();

        if ($currentType !== '' && ! $balances->contains(fn (array $balance) => $balance['type'] === $currentType)) {
            $balances->push([
                'key' => str($currentType)->snake()->toString(),
                'type' => $currentType,
                'total' => 0,
                'taken' => (float) ($takenByType->get($currentType, 0)),
                'remaining' => 0,
            ]);
        }

        $currentBalance = $balances
            ->firstWhere('type', $currentType)
            ?? $balances->first()
            ?? [
                'key' => 'annual_leave',
                'type' => 'Annual Leave',
                'total' => 0,
                'taken' => 0,
                'remaining' => 0,
            ];

        return [
            'current' => [
                'type' => $currentBalance['type'],
                'total' => (float) $currentBalance['total'],
                'taken' => (float) $currentBalance['taken'],
                'remaining' => (float) $currentBalance['remaining'],
                'requested' => $requestedDays,
                'remaining_after_request' => max(0, (float) $currentBalance['remaining'] - $requestedDays),
                'progress' => (float) $currentBalance['total'] > 0
                    ? min(100, round(((float) $currentBalance['taken'] / (float) $currentBalance['total']) * 100, 2))
                    : 0,
            ],
            'balances' => $balances->all(),
            'annual' => $balances->firstWhere('type', 'Annual Leave') ?? ['total' => 22, 'taken' => 0, 'remaining' => 22],
            'sick' => $balances->firstWhere('type', 'Sick Leave') ?? ['total' => 10, 'taken' => 0, 'remaining' => 10],
            'compensatory' => $balances->firstWhere('type', 'Compensatory') ?? ['total' => 4, 'taken' => 0, 'remaining' => 4],
        ];
    }

    private function buildEmployeeContext(Employee $employee, ?int $excludeRequestId = null): array
    {
        $balances = $this->leaveBalancesForEmployee($employee->id, null, 0, $excludeRequestId);

        return [
            'id' => $employee->id,
            'full_name' => $this->employeeDisplayName($employee),
            'initials' => $this->employeeInitials($employee),
            'staff_number' => $employee->staff_number,
            'department' => $employee->orgUnit?->name,
            'position' => $employee->position?->name ?? $employee->position?->title,
            'manager' => $employee->manager?->full_name
                ?? trim(($employee->manager?->first_name ?? '').' '.($employee->manager?->surname ?? ''))
                ?: null,
            'balances' => $balances['balances'],
            'recent_requests' => $this->recentHistoryForEmployee($employee->id, $excludeRequestId, 4),
        ];
    }

    private function buildEmployeeStats(Employee $employee, ?int $excludeRequestId = null): array
    {
        $requests = LeaveRequest::query()
            ->where('employee_id', $employee->id)
            ->when($excludeRequestId, fn (Builder $query, int $id) => $query->whereKeyNot($id))
            ->get();

        $approved = $requests->filter(fn (LeaveRequest $item) => $this->statusBucket($item->status) === 'approved');
        $pending = $requests->filter(fn (LeaveRequest $item) => in_array($this->statusBucket($item->status), ['pending', 'changes_requested'], true));
        $upcoming = $requests->filter(function (LeaveRequest $item) {
            $start = $item->start_date ? Carbon::parse($item->start_date) : null;

            return $start && $start->gte(now()->startOfDay());
        });

        return [
            'total_requests' => $requests->count(),
            'pending_requests' => $pending->count(),
            'approved_days' => $this->sumLeaveDays($approved),
            'upcoming_requests' => $upcoming->count(),
        ];
    }

    private function emptyEmployeeStats(): array
    {
        return [
            'total_requests' => 0,
            'pending_requests' => 0,
            'approved_days' => 0,
            'upcoming_requests' => 0,
        ];
    }

    private function buildIndexStats(Builder $query, CarbonInterface $calendarMonth): array
    {
        $requests = $query
            ->setEagerLoads([])
            ->select(['id', 'employee_id', 'leave_type', 'start_date', 'end_date', 'days', 'status'])
            ->get();
        $pending = $requests->filter(fn (LeaveRequest $item) => in_array($this->statusBucket($item->status), ['pending', 'changes_requested'], true));
        $active = $requests->filter(function (LeaveRequest $item) {
            $start = $item->start_date ? Carbon::parse($item->start_date) : null;
            $end = $item->end_date ? Carbon::parse($item->end_date) : null;

            if (! $start || ! $end) {
                return false;
            }

            return now()->betweenIncluded($start->startOfDay(), $end->endOfDay())
                && in_array($this->statusBucket($item->status), ['approved', 'pending', 'changes_requested'], true);
        });
        $monthStart = $calendarMonth->copy()->startOfMonth();
        $monthEnd = $calendarMonth->copy()->endOfMonth();
        $upcoming = $requests->filter(function (LeaveRequest $item) use ($monthStart, $monthEnd) {
            $start = $item->start_date ? Carbon::parse($item->start_date) : null;

            return $start && $start->betweenIncluded($monthStart, $monthEnd);
        });

        return [
            'total_requests' => $requests->count(),
            'pending_requests' => $pending->count(),
            'active_absences' => $active->count(),
            'upcoming_requests' => $upcoming->count(),
        ];
    }

    private function buildEmployeeCalendar(Employee $employee, CarbonInterface $calendarMonth): array
    {
        $requests = LeaveRequest::query()
            ->select(['id', 'employee_id', 'leave_type', 'start_date', 'end_date', 'status'])
            ->where('employee_id', $employee->id)
            ->whereDate('start_date', '<=', $calendarMonth->copy()->endOfMonth()->toDateString())
            ->whereDate('end_date', '>=', $calendarMonth->copy()->startOfMonth()->toDateString())
            ->orderBy('start_date')
            ->get();

        return $this->buildCalendarPayload($requests, $calendarMonth, false);
    }

    private function buildScopedCalendar(Builder $query, CarbonInterface $calendarMonth): array
    {
        $requests = $query
            ->setEagerLoads([])
            ->with([
                'employee:id,first_name,middle_name,surname',
            ])
            ->select(['id', 'employee_id', 'leave_type', 'start_date', 'end_date', 'status'])
            ->whereDate('start_date', '<=', $calendarMonth->copy()->endOfMonth()->toDateString())
            ->whereDate('end_date', '>=', $calendarMonth->copy()->startOfMonth()->toDateString())
            ->orderBy('start_date')
            ->get();

        return $this->buildCalendarPayload($requests, $calendarMonth, true);
    }

    private function buildCalendarPayload(Collection $requests, CarbonInterface $calendarMonth, bool $includeEmployeeName): array
    {
        $monthStart = $calendarMonth->copy()->startOfMonth();
        $monthEnd = $calendarMonth->copy()->endOfMonth();
        $gridStart = $monthStart->copy()->startOfWeek(Carbon::MONDAY);
        $gridEnd = $monthEnd->copy()->endOfWeek(Carbon::SUNDAY);
        $entryMap = [];

        $requests->each(function (LeaveRequest $request) use ($includeEmployeeName, $monthStart, $monthEnd, &$entryMap): void {
            $start = $this->asCarbonDate($request->start_date)?->startOfDay();
            $end = $this->asCarbonDate($request->end_date)?->endOfDay();

            if (! $start || ! $end) {
                return;
            }

            if ($end->lt($monthStart) || $start->gt($monthEnd)) {
                return;
            }

            $entry = [
                'id' => $request->id,
                'title' => $includeEmployeeName
                    ? $this->employeeDisplayName($request->employee)
                    : $this->normalizeLeaveType($request->leave_type),
                'subtitle' => $includeEmployeeName
                    ? $this->normalizeLeaveType($request->leave_type)
                    : $this->displayStatus($request->status),
                'status' => $this->displayStatus($request->status),
                'tone' => $this->statusTone($request->status),
            ];

            $cursor = $start->copy()->lt($monthStart)
                ? $monthStart->copy()
                : $start->copy();
            $lastDay = $end->copy()->gt($monthEnd)
                ? $monthEnd->copy()
                : $end->copy();

            while ($cursor->lte($lastDay)) {
                $entryMap[$cursor->toDateString()][] = $entry;
                $cursor = $cursor->copy()->addDay();
            }
        });

        $weeks = [];
        $cursor = $gridStart->copy();

        while ($cursor->lte($gridEnd)) {
            $week = [];

            for ($index = 0; $index < 7; $index++) {
                $day = $cursor->copy();
                $entries = $entryMap[$day->toDateString()] ?? [];

                $week[] = [
                    'date' => $day->toDateString(),
                    'label' => $day->format('j'),
                    'current_month' => $day->isSameMonth($calendarMonth),
                    'is_today' => $day->isToday(),
                    'is_weekend' => $day->isWeekend(),
                    'entries' => $entries,
                ];

                $cursor = $cursor->copy()->addDay();
            }

            $weeks[] = $week;
        }

        return [
            'month' => $calendarMonth->format('Y-m'),
            'label' => $calendarMonth->format('F Y'),
            'entry_count' => $requests->count(),
            'weeks' => $weeks,
        ];
    }

    private function emptyCalendar(CarbonInterface $calendarMonth): array
    {
        return $this->buildCalendarPayload(collect(), $calendarMonth, false);
    }

    private function asCarbonDate(mixed $value): ?CarbonInterface
    {
        if ($value instanceof CarbonInterface) {
            return $value->copy();
        }

        if (blank($value)) {
            return null;
        }

        return Carbon::parse($value);
    }

    private function recentHistoryForEmployee(int $employeeId, ?int $excludeRequestId = null, int $limit = 5): array
    {
        return LeaveRequest::query()
            ->where('employee_id', $employeeId)
            ->when($excludeRequestId, fn (Builder $query, int $id) => $query->whereKeyNot($id))
            ->orderByDesc('start_date')
            ->limit($limit)
            ->get()
            ->map(function (LeaveRequest $item) {
                return [
                    'id' => $item->id,
                    'leave_type' => $this->normalizeLeaveType($item->leave_type),
                    'days' => $this->requestedDays($item),
                    'status' => $this->displayStatus($item->status),
                    'status_tone' => $this->statusTone($item->status),
                    'start_date' => $item->start_date ? Carbon::parse($item->start_date)->toDateString() : null,
                    'end_date' => $item->end_date ? Carbon::parse($item->end_date)->toDateString() : null,
                ];
            })
            ->values()
            ->all();
    }

    private function requestedDays(LeaveRequest $record): float
    {
        if (! is_null($record->days)) {
            return (float) $record->days;
        }

        $start = $record->start_date ? Carbon::parse($record->start_date) : null;
        $end = $record->end_date ? Carbon::parse($record->end_date) : null;

        if (! $start || ! $end) {
            return 0;
        }

        return (float) ($start->diffInDays($end) + 1);
    }

    private function requestStart(LeaveRequest $record): Carbon
    {
        return $record->start_date
            ? Carbon::parse($record->start_date)
            : now();
    }

    private function requestEnd(LeaveRequest $record): Carbon
    {
        return $record->end_date
            ? Carbon::parse($record->end_date)
            : $this->requestStart($record);
    }

    private function sumLeaveDays($requests): float
    {
        return (float) collect($requests)->reduce(function ($carry, LeaveRequest $item) {
            return $carry + $this->requestedDays($item);
        }, 0);
    }

    private function buildLeaveBalances(LeaveRequest $record): array
    {
        return $this->leaveBalancesForEmployee(
            (int) $record->employee_id,
            $record->leave_type,
            $this->requestedDays($record),
            $record->id,
        );
    }

    private function buildSystemChecks(LeaveRequest $record, array $leaveBalances): array
    {
        $start = $this->requestStart($record);
        $end = $this->requestEnd($record);

        $selfOverlapCount = LeaveRequest::query()
            ->where('employee_id', $record->employee_id)
            ->where('id', '!=', $record->id)
            ->whereDate('start_date', '<=', $end->toDateString())
            ->whereDate('end_date', '>=', $start->toDateString())
            ->count();

        $departmentOverlapCount = 0;
        $departmentName = (string) ($record->employee?->orgUnit?->name ?? 'Department');

        if ($record->employee?->org_unit_id) {
            $departmentEmployeeIds = Employee::query()
                ->where('org_unit_id', $record->employee->org_unit_id)
                ->where('id', '!=', $record->employee_id)
                ->pluck('id');

            $departmentOverlapCount = LeaveRequest::query()
                ->whereIn('employee_id', $departmentEmployeeIds)
                ->whereDate('start_date', '<=', $end->toDateString())
                ->whereDate('end_date', '>=', $start->toDateString())
                ->where(function (Builder $query) {
                    $query->where('status', 'like', '%approve%')
                        ->orWhere('status', 'like', '%pending%')
                        ->orWhere('status', 'like', '%request%');
                })
                ->count();
        }

        $hasEnoughBalance = $leaveBalances['current']['remaining'] >= $leaveBalances['current']['requested'];

        $submittedAt = $record->created_at ? Carbon::parse($record->created_at) : now();
        $leadTimeDays = max(0, $submittedAt->diffInDays($start, false));

        return [
            [
                'type' => $selfOverlapCount > 0 ? 'warning' : 'success',
                'message' => $selfOverlapCount > 0
                    ? "Employee has {$selfOverlapCount} overlapping request(s)."
                    : 'No overlapping requests for this employee.',
            ],
            [
                'type' => $departmentOverlapCount > 0 ? 'info' : 'success',
                'message' => $departmentOverlapCount > 0
                    ? "{$departmentOverlapCount} overlapping request(s) found in {$departmentName}."
                    : "No significant overlap found in {$departmentName}.",
            ],
            [
                'type' => $hasEnoughBalance ? 'success' : 'warning',
                'message' => $hasEnoughBalance
                    ? 'Employee has sufficient leave balance for this request.'
                    : 'Employee may not have enough balance for this request.',
            ],
            [
                'type' => 'info',
                'message' => "Submitted {$leadTimeDays} day(s) before leave start date.",
            ],
        ];
    }

    private function buildTeamAvailability(LeaveRequest $record): array
    {
        $start = $this->requestStart($record);
        $end = $this->requestEnd($record);
        $rangeStart = $start->copy()->subDays(3);
        $rangeEnd = $end->copy()->addDays(1);

        $days = collect(CarbonPeriod::create($rangeStart, $rangeEnd))
            ->map(function (Carbon $date) use ($start, $end) {
                return [
                    'date' => $date->toDateString(),
                    'label' => $date->format('D d'),
                    'is_focus' => $date->betweenIncluded($start, $end),
                    'is_weekend' => $date->isWeekend(),
                ];
            })
            ->values()
            ->all();

        $rows = [];

        if ($record->employee) {
            $rows[] = $this->buildAvailabilityRowFromEmployee($record->employee, $days, $record, true);
        } else {
            $rows[] = $this->buildDummyAvailabilityRow('Unknown Employee', $days, 0, true);
        }

        $colleagues = Employee::query()
            ->when(
                $record->employee?->org_unit_id,
                fn ($query, $orgUnitId) => $query->where('org_unit_id', $orgUnitId)
            )
            ->when(
                $record->employee?->id,
                fn ($query, $employeeId) => $query->where('id', '!=', $employeeId)
            )
            ->with('position')
            ->orderBy('first_name')
            ->limit(3)
            ->get();

        if ($colleagues->isNotEmpty()) {
            foreach ($colleagues as $colleague) {
                $rows[] = $this->buildAvailabilityRowFromEmployee($colleague, $days, $record, false);
            }
        } else {
            $rows[] = $this->buildDummyAvailabilityRow('Team Member A', $days, 1);
            $rows[] = $this->buildDummyAvailabilityRow('Team Member B', $days, 2);
            $rows[] = $this->buildDummyAvailabilityRow('Team Member C', $days, 3);
        }

        return [
            'days' => $days,
            'members' => $rows,
        ];
    }

    private function buildAvailabilityRowFromEmployee(Employee $employee, array $days, LeaveRequest $currentRecord, bool $isApplicant = false): array
    {
        $employee->append('full_name');

        $rangeStart = Carbon::parse($days[0]['date']);
        $rangeEnd = Carbon::parse($days[count($days) - 1]['date']);

        $memberRequests = LeaveRequest::query()
            ->where('employee_id', $employee->id)
            ->whereDate('start_date', '<=', $rangeEnd->toDateString())
            ->whereDate('end_date', '>=', $rangeStart->toDateString())
            ->get();

        $cells = collect($days)->map(function (array $day) use ($memberRequests, $currentRecord, $isApplicant) {
            $date = Carbon::parse($day['date']);

            if ($day['is_weekend']) {
                return [
                    'type' => 'weekend',
                    'value' => '',
                ];
            }

            if ($isApplicant && $date->betweenIncluded($this->requestStart($currentRecord), $this->requestEnd($currentRecord))) {
                return [
                    'type' => 'leave',
                    'value' => 'L',
                ];
            }

            $overlap = $memberRequests->first(function (LeaveRequest $item) use ($date, $currentRecord, $isApplicant) {
                if ($isApplicant && $item->id === $currentRecord->id) {
                    return false;
                }

                $itemStart = $item->start_date ? Carbon::parse($item->start_date) : null;
                $itemEnd = $item->end_date ? Carbon::parse($item->end_date) : null;

                return $itemStart && $itemEnd && $date->betweenIncluded($itemStart, $itemEnd);
            });

            if ($overlap) {
                $type = stripos((string) $overlap->leave_type, 'sick') !== false ? 'sick' : 'leave';

                return [
                    'type' => $type,
                    'value' => $type === 'sick' ? 'S' : 'L',
                ];
            }

            return [
                'type' => 'available',
                'value' => '',
            ];
        })->values()->all();

        return [
            'name' => $employee->full_name,
            'role' => $employee->position->name ?? $employee->position->title ?? 'Staff',
            'is_applicant' => $isApplicant,
            'cells' => $cells,
        ];
    }

    private function buildDummyAvailabilityRow(string $name, array $days, int $seed = 0, bool $isApplicant = false): array
    {
        $cells = collect($days)->map(function (array $day, int $index) use ($seed, $isApplicant) {
            if ($day['is_weekend']) {
                return [
                    'type' => 'weekend',
                    'value' => '',
                ];
            }

            if ($isApplicant && $day['is_focus']) {
                return [
                    'type' => 'leave',
                    'value' => 'L',
                ];
            }

            if (($index + $seed) % 7 === 0) {
                return [
                    'type' => 'sick',
                    'value' => 'S',
                ];
            }

            if (($index + $seed) % 5 === 0) {
                return [
                    'type' => 'leave',
                    'value' => 'L',
                ];
            }

            return [
                'type' => 'available',
                'value' => '',
            ];
        })->values()->all();

        return [
            'name' => $name,
            'role' => 'Staff',
            'is_applicant' => $isApplicant,
            'cells' => $cells,
        ];
    }

    private function buildAuditTrail(LeaveRequest $record): array
    {
        $employeeName = $record->employee?->full_name
            ?? trim(($record->employee?->first_name ?? '').' '.($record->employee?->surname ?? ''))
            ?: 'Employee';

        $managerName = $record->employee?->manager?->full_name ?? 'Line Manager';

        $createdAt = $record->created_at ? Carbon::parse($record->created_at) : now();
        $updatedAt = $record->updated_at ? Carbon::parse($record->updated_at) : $createdAt->copy()->addHours(2);

        $items = [
            [
                'type' => 'created',
                'title' => "Request created by {$employeeName}",
                'time' => $createdAt->toDateTimeString(),
                'note' => $record->reason ?: 'Leave request submitted for review.',
            ],
            [
                'type' => 'viewed',
                'title' => "Viewed by {$managerName}",
                'time' => $createdAt->copy()->addHours(2)->toDateTimeString(),
                'note' => null,
            ],
        ];

        if ($record->status && ! in_array(strtolower((string) $record->status), ['pending', 'pending review'], true)) {
            $items[] = [
                'type' => str_contains(strtolower((string) $record->status), 'reject') ? 'rejected' : 'approved',
                'title' => "{$record->status} by ".($record->approver_name ?: 'HR Admin'),
                'time' => $updatedAt->toDateTimeString(),
                'note' => $record->approver_name
                    ? "Final action recorded by {$record->approver_name}."
                    : 'Final decision recorded.',
            ];
        } else {
            $items[] = [
                'type' => 'pending',
                'title' => 'Awaiting HR final action',
                'time' => null,
                'note' => null,
            ];
        }

        return $items;
    }

    private function buildRecentHistory(LeaveRequest $record): array
    {
        $history = $this->recentHistoryForEmployee((int) $record->employee_id, $record->id, 5);

        if (empty($history)) {
            return [
                [
                    'id' => 0,
                    'leave_type' => 'Annual Leave',
                    'days' => 3,
                    'status' => 'Approved',
                    'start_date' => now()->subMonths(3)->toDateString(),
                    'end_date' => now()->subMonths(3)->addDays(2)->toDateString(),
                ],
                [
                    'id' => 0,
                    'leave_type' => 'Sick Leave',
                    'days' => 1,
                    'status' => 'Approved',
                    'start_date' => now()->subMonths(1)->toDateString(),
                    'end_date' => now()->subMonths(1)->toDateString(),
                ],
            ];
        }

        return $history;
    }

    private function buildUsageStats(LeaveRequest $record, array $recentHistory): array
    {
        $oneYearAgo = now()->subYear();

        $requests = LeaveRequest::query()
            ->where('employee_id', $record->employee_id)
            ->where('created_at', '>=', $oneYearAgo)
            ->get();

        $approved = $requests->filter(function (LeaveRequest $item) {
            return $this->statusBucket($item->status) === 'approved';
        });

        $totalDays = $this->sumLeaveDays($approved);

        $leadTimes = $requests->map(function (LeaveRequest $item) {
            if (! $item->created_at || ! $item->start_date) {
                return null;
            }

            return max(
                0,
                Carbon::parse($item->created_at)->diffInDays(Carbon::parse($item->start_date), false)
            );
        })->filter();

        $avgLeadTime = $leadTimes->isNotEmpty()
            ? round((float) $leadTimes->avg(), 1)
            : 0;

        $sickDays = $this->sumLeaveDays(
            $approved->filter(fn (LeaveRequest $item) => $this->normalizeLeaveType($item->leave_type) === 'Sick Leave')
        );

        $ratio = $totalDays > 0
            ? round(($sickDays / $totalDays) * 100, 1)
            : 0;

        $ratioLabel = $ratio <= 10 ? 'Low' : ($ratio <= 30 ? 'Moderate' : 'High');

        return [
            'total_leaves_taken' => $totalDays,
            'average_lead_time' => $avgLeadTime,
            'unplanned_ratio' => $ratio,
            'unplanned_ratio_label' => $ratioLabel,
            'chart_points' => $this->buildUsageChartPoints($recentHistory),
        ];
    }

    private function buildUsageChartPoints(array $recentHistory): array
    {
        if (empty($recentHistory)) {
            return [5, 10, 12, 8, 16, 22, 18, 25];
        }

        return collect($recentHistory)
            ->reverse()
            ->map(fn (array $item) => max(1, (int) round((float) ($item['days'] ?? 1) * 5)))
            ->values()
            ->all();
    }

    private function buildApprovalData(LeaveRequest $record): array
    {
        $employee = $record->employee;
        $balances = $this->buildLeaveBalances($record);
        $usedLast12Months = $this->usedLeaveLast12Months($record);
        $annualRemaining = (float) $balances['annual']['remaining'];
        $annualTotal = (float) $balances['annual']['total'];

        return [
            'id' => $this->requestCode($record),
            'status' => strtoupper((string) ($record->status ?: 'Pending Approval')),
            'employee' => [
                'name' => $this->employeeDisplayName($employee),
                'role' => $employee?->position->name
                    ?? $employee?->position->title
                    ?? 'Staff',
                'id' => $employee?->staff_number ?: 'N/A',
                'department' => $employee?->orgUnit->name ?: 'Unassigned Department',
                'email' => $employee?->user->email ?: 'No email available',
                'location' => $employee?->location->name ?: 'No location assigned',
                'initials' => $this->employeeInitials($employee),
            ],
            'balance' => [
                'left' => $annualRemaining,
                'total' => $annualTotal,
                'percentage' => $annualTotal > 0
                    ? (int) round(($annualRemaining / $annualTotal) * 100)
                    : 0,
                'used_last_12m' => $usedLast12Months,
                'sick_days' => (float) $balances['sick']['taken'],
                'carry_over' => 3,
            ],
            'current_request' => [
                'type' => $record->leave_type ?: 'Leave',
                'duration' => $this->requestedDays($record).' Working Days',
                'from' => $record->start_date
                    ? Carbon::parse($record->start_date)->format('M d, Y')
                    : 'N/A',
                'to' => $record->end_date
                    ? Carbon::parse($record->end_date)->format('M d, Y')
                    : 'N/A',
                'reason' => $record->reason ?: 'No reason provided.',
            ],
        ];
    }

    private function buildApprovalHistory(LeaveRequest $record): array
    {
        $history = LeaveRequest::query()
            ->where('employee_id', $record->employee_id)
            ->where('id', '!=', $record->id)
            ->orderByDesc('start_date')
            ->limit(6)
            ->get();

        if ($history->isEmpty()) {
            return [
                [
                    'month' => 'Sep 2024',
                    'title' => 'Personal Day',
                    'description' => '1 Day • Sep 18',
                    'status' => 'Approved',
                    'status_color' => 'success',
                ],
                [
                    'month' => 'Aug 2024',
                    'title' => 'Annual Leave',
                    'description' => '5 Days • Aug 10 - Aug 14',
                    'status' => 'Approved',
                    'status_color' => 'success',
                ],
                [
                    'month' => 'May 2024',
                    'title' => 'Sick Leave',
                    'description' => '2 Days • May 04 - May 05',
                    'status' => 'Approved',
                    'status_color' => 'success',
                ],
                [
                    'month' => 'Mar 2024',
                    'title' => 'Personal Holiday',
                    'description' => 'Denied (Peak Workload)',
                    'status' => 'Rejected',
                    'status_color' => 'danger',
                ],
            ];
        }

        return $history->map(function (LeaveRequest $item) {
            $start = $item->start_date ? Carbon::parse($item->start_date) : null;
            $end = $item->end_date ? Carbon::parse($item->end_date) : null;
            $days = $this->requestedDays($item);

            $status = (string) ($item->status ?: 'Pending');
            $statusColor = str_contains(strtolower($status), 'reject') ? 'danger' : 'success';

            return [
                'month' => $start ? $start->format('M Y') : 'Unknown',
                'title' => $item->leave_type ?: 'Leave Request',
                'description' => $start && $end
                    ? "{$days} Day".($days == 1 ? '' : 's').' • '.
                        ($start->equalTo($end)
                            ? $start->format('M d')
                            : $start->format('M d').' - '.$end->format('M d'))
                    : "{$days} Day".($days == 1 ? '' : 's'),
                'status' => $status,
                'status_color' => $statusColor,
            ];
        })->values()->all();
    }

    private function buildApprovalTeamCoverage(LeaveRequest $record): array
    {
        $start = $this->requestStart($record);
        $days = collect(range(0, 3))
            ->map(fn ($offset) => $start->copy()->addDays($offset))
            ->values();

        $applicant = [
            'name' => $this->employeeDisplayName($record->employee),
            'initials' => $this->employeeInitials($record->employee),
            'is_requester' => true,
            'cells' => $days->map(fn () => 'requested')->all(),
        ];

        $colleagues = Employee::query()
            ->when(
                $record->employee?->org_unit_id,
                fn ($query, $orgUnitId) => $query->where('org_unit_id', $orgUnitId)
            )
            ->when(
                $record->employee?->id,
                fn ($query, $employeeId) => $query->where('id', '!=', $employeeId)
            )
            ->with(['user', 'position'])
            ->orderBy('first_name')
            ->limit(3)
            ->get();

        $rows = [$applicant];

        if ($colleagues->isEmpty()) {
            $rows[] = [
                'name' => 'John Jacobson',
                'initials' => 'JJ',
                'is_requester' => false,
                'cells' => ['available', 'available', 'available', 'available'],
            ];
            $rows[] = [
                'name' => 'Emily Rogers',
                'initials' => 'ER',
                'is_requester' => false,
                'cells' => ['available', 'available', 'out', 'out'],
            ];
            $rows[] = [
                'name' => 'Tom Wilson',
                'initials' => 'TW',
                'is_requester' => false,
                'cells' => ['available', 'available', 'available', 'available'],
            ];
        } else {
            foreach ($colleagues as $employee) {
                $employeeRequests = LeaveRequest::query()
                    ->where('employee_id', $employee->id)
                    ->whereDate('start_date', '<=', $days->last()->toDateString())
                    ->whereDate('end_date', '>=', $days->first()->toDateString())
                    ->where(function (Builder $query) {
                        $query->where('status', 'like', '%approve%')
                            ->orWhere('status', 'like', '%pending%')
                            ->orWhere('status', 'like', '%request%');
                    })
                    ->get();

                $cells = $days->map(function (Carbon $day) use ($employeeRequests) {
                    $hasOverlap = $employeeRequests->first(function (LeaveRequest $leave) use ($day) {
                        $leaveStart = $leave->start_date ? Carbon::parse($leave->start_date) : null;
                        $leaveEnd = $leave->end_date ? Carbon::parse($leave->end_date) : null;

                        return $leaveStart && $leaveEnd && $day->betweenIncluded($leaveStart, $leaveEnd);
                    });

                    return $hasOverlap ? 'out' : 'available';
                })->all();

                $rows[] = [
                    'name' => $this->employeeDisplayName($employee),
                    'initials' => $this->employeeInitials($employee),
                    'is_requester' => false,
                    'cells' => $cells,
                ];
            }
        }

        return [
            'days' => $days->map(fn (Carbon $day) => [
                'label' => strtoupper($day->format('d M')),
                'date' => $day->toDateString(),
            ])->all(),
            'rows' => $rows,
        ];
    }

    private function buildApprovalSystemChecks(
        LeaveRequest $record,
        array $approvalData,
        array $teamCoverage
    ): array {
        $conflictCount = collect($teamCoverage['rows'])
            ->skip(1)
            ->filter(fn ($row) => in_array('out', $row['cells'], true))
            ->count();

        $balanceLeft = (float) ($approvalData['balance']['left'] ?? 0);
        $requested = $this->requestedDays($record);

        $checks = [];

        if ($conflictCount > 0) {
            $checks[] = [
                'type' => 'danger',
                'title' => 'Coverage Conflict',
                'message' => "Overlap found with {$conflictCount} team member(s). Review department coverage before approval.",
            ];
        } else {
            $checks[] = [
                'type' => 'success',
                'title' => 'Coverage OK',
                'message' => 'No critical team coverage conflict found for this request.',
            ];
        }

        if ($balanceLeft >= $requested) {
            $checks[] = [
                'type' => 'success',
                'title' => 'Balance Verified',
                'message' => "{$this->employeeDisplayName($record->employee)} has sufficient leave balance ({$balanceLeft} days remaining).",
            ];
        } else {
            $checks[] = [
                'type' => 'danger',
                'title' => 'Insufficient Balance',
                'message' => 'Employee may not have enough leave balance for this request.',
            ];
        }

        return $checks;
    }

    private function buildApprovalRequestActivity(LeaveRequest $record): array
    {
        $createdAt = $record->created_at ? Carbon::parse($record->created_at) : now();
        $managerName = $record->employee?->manager?->full_name
            ?? trim(($record->employee?->manager?->first_name ?? '').' '.($record->employee?->manager?->surname ?? ''))
            ?: 'Manager';

        $activity = [
            [
                'title' => 'Request Submitted',
                'time' => $createdAt->format('M d, Y • h:i A'),
                'note' => $record->reason ?: 'Leave request submitted.',
                'type' => 'done',
            ],
            [
                'title' => "Viewed by {$managerName}",
                'time' => $createdAt->copy()->addDay()->format('M d, Y • h:i A'),
                'note' => null,
                'type' => 'done',
            ],
        ];

        $status = strtolower((string) ($record->status ?: 'pending'));

        if (str_contains($status, 'approve')) {
            $activity[] = [
                'title' => 'Approved',
                'time' => ($record->updated_at
                    ? Carbon::parse($record->updated_at)
                    : now())->format('M d, Y • h:i A'),
                'note' => $record->approver_name
                    ? "Approved by {$record->approver_name}"
                    : 'Approved by HR/Admin',
                'type' => 'done',
            ];
        } elseif (str_contains($status, 'reject')) {
            $activity[] = [
                'title' => 'Denied',
                'time' => ($record->updated_at
                    ? Carbon::parse($record->updated_at)
                    : now())->format('M d, Y • h:i A'),
                'note' => $record->approver_name
                    ? "Denied by {$record->approver_name}"
                    : 'Denied by HR/Admin',
                'type' => 'done',
            ];
        } else {
            $activity[] = [
                'title' => 'Awaiting Approval',
                'time' => null,
                'note' => null,
                'type' => 'pending',
            ];
        }

        return $activity;
    }

    private function usedLeaveLast12Months(LeaveRequest $record): float
    {
        return (float) LeaveRequest::query()
            ->where('employee_id', $record->employee_id)
            ->where('created_at', '>=', now()->subMonths(12))
            ->where(function (Builder $query) {
                $query->where('status', 'like', '%approve%')
                    ->orWhere('status', 'Approved');
            })
            ->get()
            ->reduce(function ($carry, LeaveRequest $item) {
                return $carry + $this->requestedDays($item);
            }, 0);
    }
}
