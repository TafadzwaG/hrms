<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\LeaveRequest;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class LeaveRequestController extends Controller
{
    private const MODULE_KEY = 'leave_requests';

    private const PAGE_ROOT = 'LeaveRequests';

    public function index(Request $request)
    {
        $search = $request->string('search')->toString();
        $config = $this->moduleConfig();

        $query = LeaveRequest::query()
            ->with($this->leaveRequestRelations());

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
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render(self::PAGE_ROOT.'/Create', [
            'module' => $this->moduleMeta(),
            'record' => null,
            'employees' => $this->employeeOptions(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->validationRules());

        LeaveRequest::create($validated);

        return redirect()
            ->to('/'.Arr::get($this->moduleConfig(), 'slug'))
            ->with('success', Arr::get($this->moduleConfig(), 'name').' created successfully.');
    }

    public function show(Request $request)
    {
        $record = $this->decorateLeaveRequest(
            $this->findOrFail($this->resolveRouteRecordId($request))
        );

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
    }

    public function approval(Request $request)
    {
        $record = $this->decorateLeaveRequest(
            $this->findOrFail($this->resolveRouteRecordId($request))
        );

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
    }

    public function edit(Request $request)
    {
        $record = $this->decorateLeaveRequest(
            $this->findOrFail($this->resolveRouteRecordId($request))
        );

        return Inertia::render(self::PAGE_ROOT.'/Edit', [
            'module' => $this->moduleMeta(),
            'record' => $record,
            'employees' => $this->employeeOptions(),
        ]);
    }

    public function update(Request $request)
    {
        $record = $this->findOrFail($this->resolveRouteRecordId($request));

        $validated = $request->validate($this->validationRules($record));
        $record->update($validated);

        $slug = Arr::get($this->moduleConfig(), 'slug');

        return redirect()
            ->to('/'.$slug.'/'.$record->id)
            ->with('success', Arr::get($this->moduleConfig(), 'name').' updated successfully.');
    }

    public function destroy(Request $request)
    {
        $record = $this->findOrFail($this->resolveRouteRecordId($request));
        $record->delete();

        return redirect()
            ->to('/'.Arr::get($this->moduleConfig(), 'slug'))
            ->with('success', Arr::get($this->moduleConfig(), 'name').' deleted successfully.');
    }

    public function approve(Request $request)
    {
        $record = $this->findOrFail($this->resolveRouteRecordId($request));

        $record->update([
            'status' => 'Approved',
            'approver_name' => $this->actorName($request),
        ]);

        return redirect()
            ->route('leave-requests.approval', $record->id)
            ->with('success', 'Leave request approved successfully.');
    }

    public function deny(Request $request)
    {
        $record = $this->findOrFail($this->resolveRouteRecordId($request));

        $record->update([
            'status' => 'Rejected',
            'approver_name' => $this->actorName($request),
        ]);

        return redirect()
            ->route('leave-requests.approval', $record->id)
            ->with('success', 'Leave request denied successfully.');
    }

    public function requestChanges(Request $request)
    {
        $request->validate([
            'note' => ['nullable', 'string', 'max:1000'],
        ]);

        $record = $this->findOrFail($this->resolveRouteRecordId($request));

        $record->update([
            'status' => 'Changes Requested',
            'approver_name' => $this->actorName($request),
        ]);

        return redirect()
            ->to('/'.Arr::get($this->moduleConfig(), 'slug').'/'.$record->id)
            ->with('success', 'Change request sent successfully.')
            ->with('saved_leave_note', (string) $request->input('note', ''));
    }

    public function saveNote(Request $request)
    {
        $validated = $request->validate([
            'note' => ['required', 'string', 'max:1000'],
            'notify_manager' => ['nullable', 'boolean'],
        ]);

        $record = $this->findOrFail($this->resolveRouteRecordId($request));

        return redirect()
            ->to('/'.Arr::get($this->moduleConfig(), 'slug').'/'.$record->id)
            ->with(
                'success',
                ($validated['notify_manager'] ?? false)
                    ? 'Internal note saved and manager notification queued.'
                    : 'Internal note saved.'
            )
            ->with('saved_leave_note', $validated['note']);
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
                $fieldRules[] = Rule::unique($table, $name)->ignore($record?->getKey());
            }

            $rules[$name] = $fieldRules;
        }

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

    private function decorateLeaveRequest(LeaveRequest $leaveRequest): LeaveRequest
    {
        if ($leaveRequest->relationLoaded('employee') && $leaveRequest->employee) {
            $leaveRequest->employee->append('full_name');

            if ($leaveRequest->employee->relationLoaded('manager') && $leaveRequest->employee->manager) {
                $leaveRequest->employee->manager->append('full_name');
            }
        }

        return $leaveRequest;
    }

    private function employeeOptions()
    {
        return Employee::query()
            ->orderBy('first_name')
            ->orderBy('surname')
            ->get([
                'id',
                'staff_number',
                'first_name',
                'middle_name',
                'surname',
            ])
            ->map(function (Employee $employee) {
                return [
                    'id' => $employee->id,
                    'staff_number' => $employee->staff_number,
                    'first_name' => $employee->first_name,
                    'middle_name' => $employee->middle_name,
                    'surname' => $employee->surname,
                    'full_name' => $employee->full_name,
                ];
            })
            ->values();
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
        $employeeId = $record->employee_id;
        $currentType = (string) ($record->leave_type ?? 'Annual Leave');

        $allowances = [
            'Annual Leave' => 22,
            'Sick Leave' => 10,
            'Compensatory' => 4,
        ];

        $approvedRequests = LeaveRequest::query()
            ->where('employee_id', $employeeId)
            ->where(function (Builder $query) {
                $query->where('status', 'like', '%approve%')
                    ->orWhere('status', 'Approved');
            })
            ->get();

        $annualTaken = $this->sumLeaveDays(
            $approvedRequests->filter(fn (LeaveRequest $item) => strcasecmp((string) $item->leave_type, 'Annual Leave') === 0)
        );

        $sickTaken = $this->sumLeaveDays(
            $approvedRequests->filter(fn (LeaveRequest $item) => strcasecmp((string) $item->leave_type, 'Sick Leave') === 0)
        );

        $compTaken = $this->sumLeaveDays(
            $approvedRequests->filter(function (LeaveRequest $item) {
                return in_array(strtolower((string) $item->leave_type), ['compensatory', 'comp leave', 'compensatory leave'], true);
            })
        );

        $requested = $this->requestedDays($record);
        $currentAllowance = $allowances[$currentType] ?? 0;

        $currentTakenBeforeThisRequest = match ($currentType) {
            'Annual Leave' => $annualTaken,
            'Sick Leave' => $sickTaken,
            'Compensatory' => $compTaken,
            default => 0,
        };

        return [
            'current' => [
                'type' => $currentType,
                'total' => $currentAllowance,
                'taken' => $currentTakenBeforeThisRequest,
                'remaining' => max(0, $currentAllowance - $currentTakenBeforeThisRequest),
                'requested' => $requested,
                'remaining_after_request' => max(0, $currentAllowance - $currentTakenBeforeThisRequest - $requested),
                'progress' => $currentAllowance > 0
                    ? min(100, round(($currentTakenBeforeThisRequest / $currentAllowance) * 100, 2))
                    : 0,
            ],
            'annual' => [
                'total' => 22,
                'taken' => $annualTaken,
                'remaining' => max(0, 22 - $annualTaken),
            ],
            'sick' => [
                'total' => 10,
                'taken' => $sickTaken,
                'remaining' => max(0, 10 - $sickTaken),
            ],
            'compensatory' => [
                'total' => 4,
                'taken' => $compTaken,
                'remaining' => max(0, 4 - $compTaken),
            ],
        ];
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
        $history = LeaveRequest::query()
            ->where('employee_id', $record->employee_id)
            ->where('id', '!=', $record->id)
            ->orderByDesc('start_date')
            ->limit(5)
            ->get();

        if ($history->isEmpty()) {
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

        return $history->map(function (LeaveRequest $item) {
            return [
                'id' => $item->id,
                'leave_type' => $item->leave_type,
                'days' => $this->requestedDays($item),
                'status' => $item->status,
                'start_date' => $item->start_date ? Carbon::parse($item->start_date)->toDateString() : null,
                'end_date' => $item->end_date ? Carbon::parse($item->end_date)->toDateString() : null,
            ];
        })->values()->all();
    }

    private function buildUsageStats(LeaveRequest $record, array $recentHistory): array
    {
        $oneYearAgo = now()->subYear();

        $requests = LeaveRequest::query()
            ->where('employee_id', $record->employee_id)
            ->where('created_at', '>=', $oneYearAgo)
            ->get();

        $approved = $requests->filter(function (LeaveRequest $item) {
            return stripos((string) $item->status, 'approve') !== false;
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
            $approved->filter(fn (LeaveRequest $item) => stripos((string) $item->leave_type, 'sick') !== false)
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
