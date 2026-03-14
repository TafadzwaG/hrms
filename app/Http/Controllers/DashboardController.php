<?php

namespace App\Http\Controllers;

use App\Models\AttendanceRecord;
use App\Models\CandidateProfile;
use App\Models\Document;
use App\Models\DocumentType;
use App\Models\Employee;
use App\Models\JobRequisition;
use App\Models\LearningCourse;
use App\Models\LeaveRequest;
use App\Models\Location;
use App\Models\OffboardingTask;
use App\Models\OnboardingTask;
use App\Models\OrgUnit;
use App\Models\PayrollExport;
use App\Models\PerformanceReview;
use App\Models\Position;
use App\Models\Role;
use App\Models\Timesheet;
use App\Models\User;
use App\Models\WorkflowDefinition;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $workforce = $this->buildWorkforceSection();
        $operations = $this->buildOperationsSection();
        $talent = $this->buildTalentSection();
        $governance = $this->buildGovernanceSection();

        $modules = [
            ...$workforce['modules'],
            ...$operations['modules'],
            ...$talent['modules'],
            ...$governance['modules'],
        ];

        $moduleOrder = [
            ...$workforce['section']['module_keys'],
            ...$operations['section']['module_keys'],
            ...$talent['section']['module_keys'],
            ...$governance['section']['module_keys'],
        ];

        $pendingApprovals = $operations['section']['meta']['pending_leave_requests']
            + $operations['section']['meta']['submitted_timesheets'];

        $summary = [
            $this->metric(
                'headcount',
                'Headcount',
                $workforce['section']['meta']['employee_total'],
                $this->percentText(
                    $workforce['section']['meta']['active_employees'],
                    $workforce['section']['meta']['employee_total'],
                    'Active workforce'
                ),
                '/employees'
            ),
            $this->metric(
                'pending_approvals',
                'Pending approvals',
                $pendingApprovals,
                sprintf(
                    '%s leave requests and %s submitted timesheets',
                    number_format($operations['section']['meta']['pending_leave_requests']),
                    number_format($operations['section']['meta']['submitted_timesheets'])
                ),
                '/leave-requests'
            ),
            $this->metric(
                'attendance_compliance',
                'Attendance compliance',
                $operations['section']['meta']['attendance_compliance'],
                'Normal clock events across the latest tracked workdays',
                '/attendance-records',
                'percentage'
            ),
            $this->metric(
                'open_hiring',
                'Open hiring',
                $talent['section']['meta']['open_requisitions'],
                sprintf(
                    '%s active candidates in the recruiting funnel',
                    number_format($talent['section']['meta']['active_candidates'])
                ),
                '/job-requisitions'
            ),
            $this->metric(
                'lifecycle_risk',
                'Lifecycle tasks at risk',
                $talent['section']['meta']['overdue_lifecycle_tasks'],
                sprintf(
                    '%s onboarding overdue and %s offboarding blocked',
                    number_format($talent['section']['meta']['overdue_onboarding_tasks']),
                    number_format($talent['section']['meta']['blocked_offboarding_tasks'])
                ),
                '/onboarding-tasks'
            ),
            $this->metric(
                'document_watch',
                'Document watch',
                $governance['section']['meta']['documents_expiring_or_expired'],
                sprintf(
                    '%s expiring soon, %s already expired',
                    number_format($governance['section']['meta']['documents_expiring_soon']),
                    number_format($governance['section']['meta']['documents_expired'])
                ),
                '/documents'
            ),
        ];

        $alerts = $this->buildAlerts(
            $pendingApprovals,
            $operations['section']['meta']['failed_payroll_exports'],
            $talent['section']['meta']['overdue_onboarding_tasks'],
            $talent['section']['meta']['blocked_offboarding_tasks'],
            $governance['section']['meta']['documents_expired'],
            $governance['section']['meta']['documents_expiring_soon'],
            $talent['section']['meta']['reviews_in_flight']
        );

        return Inertia::render('Dashboard', [
            'dashboard' => [
                'generated_at' => now()->toIso8601String(),
                'summary' => $summary,
                'alerts' => $alerts,
                'quick_links' => [
                    $this->quickLink('employees', 'Employee directory', '/employees', 'Review staff records and reporting lines.'),
                    $this->quickLink('leave_requests', 'Leave approvals', '/leave-requests', 'Triage pending leave decisions and upcoming absences.'),
                    $this->quickLink('timesheets', 'Timesheet control', '/timesheets', 'Approve submissions and monitor overtime.'),
                    $this->quickLink('payroll_exports', 'Payroll exports', '/payroll-exports', 'Resolve failures and download current payroll runs.'),
                    $this->quickLink('job_requisitions', 'Recruitment pipeline', '/job-requisitions', 'Track requisitions and candidates in flight.'),
                    $this->quickLink('reports', 'Reports centre', '/reports', 'Open the analytics catalogue for deeper exports.'),
                ],
                'overview' => [
                    'spotlight_keys' => ['employees', 'leave_requests', 'timesheets', 'job_requisitions', 'documents'],
                    'headcount_movement' => $workforce['section']['charts']['headcount_movement'],
                    'attendance_pulse' => $operations['section']['charts']['attendance_pulse'],
                    'recruitment_pipeline' => $talent['section']['charts']['candidate_pipeline'],
                ],
                'sections' => [
                    'workforce' => $workforce['section'],
                    'operations' => $operations['section'],
                    'talent' => $talent['section'],
                    'governance' => $governance['section'],
                ],
                'modules' => $modules,
                'module_order' => $moduleOrder,
            ],
        ]);
    }

    private function buildWorkforceSection(): array
    {
        $employeeTotal = Employee::count();
        $employeeStatus = $this->countBy(Employee::query(), 'status');
        $activeEmployees = $employeeStatus['ACTIVE'] ?? 0;
        $employeesWithAccounts = Employee::whereNotNull('user_id')->count();
        $employeesWithManagers = Employee::whereNotNull('manager_id')->count();
        $employeesWithOrgUnits = Employee::whereNotNull('org_unit_id')->count();
        $employeesWithPositions = Employee::whereNotNull('position_id')->count();
        $employeesWithLocations = Employee::whereNotNull('location_id')->count();
        $newHiresThisMonth = Employee::whereBetween('hire_date', [now()->startOfMonth(), now()->endOfMonth()])->count();

        $orgUnitCounts = $this->countBy(OrgUnit::query(), 'type');
        $locationCounts = $this->countBy(Location::query()->whereNotNull('city')->where('city', '!=', ''), 'city');
        $cityCount = Location::query()->whereNotNull('city')->where('city', '!=', '')->distinct('city')->count('city');

        $positionTotal = Position::count();
        $activePositions = Position::where('is_active', true)->count();
        $filledPositions = DB::table('employees')->whereNotNull('position_id')->distinct('position_id')->count('position_id');
        $vacantPositions = max($activePositions - $filledPositions, 0);

        $departmentHeadcountRows = DB::table('employees')
            ->join('org_units', 'employees.org_unit_id', '=', 'org_units.id')
            ->select('org_units.name', DB::raw('count(*) as total'))
            ->groupBy('org_units.name')
            ->orderByDesc('total')
            ->limit(6)
            ->get();

        $locationCoverageRows = DB::table('employees')
            ->join('locations', 'employees.location_id', '=', 'locations.id')
            ->select('locations.name', DB::raw('count(*) as total'))
            ->groupBy('locations.name')
            ->orderByDesc('total')
            ->limit(6)
            ->get();

        $topPositionRows = DB::table('positions')
            ->leftJoin('employees', 'positions.id', '=', 'employees.position_id')
            ->select('positions.name', DB::raw('count(employees.id) as total'))
            ->groupBy('positions.id', 'positions.name')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        $recentHires = Employee::query()
            ->with(['orgUnit:id,name', 'position:id,name'])
            ->whereNotNull('hire_date')
            ->orderByDesc('hire_date')
            ->limit(5)
            ->get()
            ->map(fn (Employee $employee) => $this->record(
                $employee->full_name,
                $this->joinText([$employee->orgUnit?->name, $employee->position?->name]) ?: 'Workforce record',
                $employee->hire_date ? 'Joined '.$employee->hire_date->format('M j, Y') : 'Hire date not set',
                '/employees/'.$employee->id,
                $this->humanize($employee->status)
            ))
            ->all();

        $recentOrgUnits = OrgUnit::query()
            ->orderByDesc('updated_at')
            ->limit(4)
            ->get()
            ->map(fn (OrgUnit $orgUnit) => $this->record(
                $orgUnit->name,
                $this->humanize($orgUnit->type),
                'Updated '.$orgUnit->updated_at?->format('M j, Y'),
                '/org-units/'.$orgUnit->id
            ))
            ->all();

        $recentLocations = Location::query()
            ->orderByDesc('updated_at')
            ->limit(4)
            ->get()
            ->map(fn (Location $location) => $this->record(
                $location->name,
                $this->joinText([$location->city, $location->country]) ?: 'Location register',
                'Timezone '.$location->timezone,
                '/locations/'.$location->id
            ))
            ->all();

        $positionRecords = collect($topPositionRows)
            ->map(fn ($row) => $this->record(
                $row->name,
                number_format((int) $row->total).' assigned employees',
                'Position utilization',
                '/positions'
            ))
            ->all();

        $dataQuality = [
            'Missing account' => $employeeTotal - $employeesWithAccounts,
            'Missing manager' => $employeeTotal - $employeesWithManagers,
            'Missing org unit' => $employeeTotal - $employeesWithOrgUnits,
            'Missing position' => $employeeTotal - $employeesWithPositions,
            'Missing location' => $employeeTotal - $employeesWithLocations,
        ];

        $modules = [
            'employees' => $this->moduleDetail(
                'employees',
                'Employees',
                'workforce',
                '/employees',
                $employeeTotal,
                sprintf(
                    '%s active, %s suspended, %s terminated',
                    number_format($activeEmployees),
                    number_format($employeeStatus['SUSPENDED'] ?? 0),
                    number_format($employeeStatus['TERMINATED'] ?? 0)
                ),
                [
                    $this->percentText($employeesWithAccounts, $employeeTotal, 'Mapped to user accounts'),
                    $this->percentText($employeesWithManagers, $employeeTotal, 'Assigned managers'),
                    number_format($newHiresThisMonth).' hires logged this month',
                ],
                $this->asBreakdown($employeeStatus),
                $recentHires,
                $this->pairedMonthlySeries(
                    Employee::query()->whereNotNull('hire_date')->pluck('hire_date'),
                    Employee::query()->whereNotNull('termination_date')->pluck('termination_date'),
                    6
                ),
                ['primary' => 'Hires', 'secondary' => 'Exits']
            ),
            'org_units' => $this->moduleDetail(
                'org_units',
                'Org units',
                'workforce',
                '/org-units',
                OrgUnit::count(),
                sprintf(
                    '%s companies, %s SBUs, %s departments',
                    number_format($orgUnitCounts['COMPANY'] ?? 0),
                    number_format($orgUnitCounts['SBU'] ?? 0),
                    number_format($orgUnitCounts['DEPARTMENT'] ?? 0)
                ),
                [
                    number_format(DB::table('org_unit_locations')->count()).' org-to-location links configured',
                    $departmentHeadcountRows->isNotEmpty() ? $departmentHeadcountRows->first()->name.' is the largest linked department' : 'Department volumes will appear once linked employees exist',
                    number_format($orgUnitCounts['TEAM'] ?? 0).' team-level units defined',
                ],
                $this->asBreakdown($orgUnitCounts),
                $recentOrgUnits
            ),
            'locations' => $this->moduleDetail(
                'locations',
                'Locations',
                'workforce',
                '/locations',
                Location::count(),
                sprintf('%s locations across %s cities', number_format(Location::count()), number_format($cityCount)),
                [
                    $locationCoverageRows->isNotEmpty() ? $locationCoverageRows->first()->name.' has the highest workforce assignment' : 'Location coverage will update as employee assignments grow',
                    number_format($employeesWithLocations).' employees carry a primary work location',
                    'All registered timezones are currently set from master data',
                ],
                $this->asBreakdown($locationCounts),
                $recentLocations
            ),
            'positions' => $this->moduleDetail(
                'positions',
                'Positions',
                'workforce',
                '/positions',
                $positionTotal,
                sprintf('%s active positions, %s currently vacant', number_format($activePositions), number_format($vacantPositions)),
                [
                    number_format($filledPositions).' positions currently staffed',
                    number_format($positionTotal - $activePositions).' positions marked inactive',
                    $topPositionRows->isNotEmpty() ? $topPositionRows->first()->name.' is the most populated role' : 'Position utilization will appear once assignments exist',
                ],
                $this->asBreakdown([
                    'Filled' => $filledPositions,
                    'Vacant' => $vacantPositions,
                    'Inactive' => max($positionTotal - $activePositions, 0),
                ]),
                $positionRecords
            ),
        ];

        return [
            'section' => [
                'title' => 'Workforce',
                'description' => 'Core headcount, structure, locations, and role placement.',
                'module_keys' => array_keys($modules),
                'metrics' => [
                    $this->metric('employees', 'Employees', $employeeTotal, $this->percentText($activeEmployees, $employeeTotal, 'Active workforce'), '/employees'),
                    $this->metric('org_units', 'Org units', OrgUnit::count(), sprintf('%s departments mapped into the structure', number_format($orgUnitCounts['DEPARTMENT'] ?? 0)), '/org-units'),
                    $this->metric('locations', 'Locations', Location::count(), sprintf('%s cities with registered offices', number_format($cityCount)), '/locations'),
                    $this->metric('positions', 'Positions', $positionTotal, sprintf('%s active positions available for assignment', number_format($activePositions)), '/positions'),
                ],
                'charts' => [
                    'headcount_movement' => [
                        'title' => 'Headcount movement',
                        'description' => 'New hires versus terminations over the last six months.',
                        'primary_label' => 'Hires',
                        'secondary_label' => 'Exits',
                        'data' => $modules['employees']['trend'],
                    ],
                    'department_headcount' => [
                        'title' => 'Department headcount',
                        'description' => 'Largest linked departments by active employee volume.',
                        'data' => $this->rowsToBreakdown($departmentHeadcountRows, 'name', 'total'),
                    ],
                    'pay_points' => [
                        'title' => 'Pay point distribution',
                        'description' => 'Current payroll and operating assignment mix.',
                        'data' => $this->asBreakdown($this->countBy(Employee::query()->whereNotNull('pay_point')->where('pay_point', '!=', ''), 'pay_point')),
                    ],
                    'data_quality' => [
                        'title' => 'Profile completion gaps',
                        'description' => 'Records missing key workforce mapping fields.',
                        'data' => $this->asBreakdown($dataQuality),
                    ],
                ],
                'lists' => [
                    'recent_hires' => [
                        'title' => 'Recent hires',
                        'description' => 'Most recently onboarded employees in the register.',
                        'items' => $recentHires,
                    ],
                    'location_coverage' => [
                        'title' => 'Location coverage',
                        'description' => 'Locations carrying the largest headcount footprint.',
                        'items' => collect($locationCoverageRows)->map(fn ($row) => $this->record($row->name, number_format((int) $row->total).' employees', 'Workforce by location', '/locations'))->all(),
                    ],
                ],
                'meta' => [
                    'employee_total' => $employeeTotal,
                    'active_employees' => $activeEmployees,
                ],
            ],
            'modules' => $modules,
        ];
    }

    private function buildOperationsSection(): array
    {
        $leaveStatus = $this->countBy(LeaveRequest::query(), 'status');
        $pendingLeaveRequests = $leaveStatus['PENDING'] ?? 0;
        $leaveTypeBreakdown = $this->countBy(LeaveRequest::query()->whereNotNull('leave_type')->where('leave_type', '!=', ''), 'leave_type');

        $leaveUpcoming = LeaveRequest::query()
            ->with('employee:id,first_name,surname,staff_number')
            ->orderBy('start_date')
            ->limit(5)
            ->get()
            ->map(fn (LeaveRequest $leaveRequest) => $this->record(
                $leaveRequest->employee?->full_name ?? 'Unassigned employee',
                $this->humanize($leaveRequest->leave_type),
                $leaveRequest->start_date->format('M j').' to '.$leaveRequest->end_date->format('M j, Y'),
                '/leave-requests/'.$leaveRequest->id,
                $this->humanize($leaveRequest->status)
            ))
            ->all();

        $attendanceStatus = $this->countBy(AttendanceRecord::query(), 'exception_status');
        $attendancePulseRows = AttendanceRecord::query()
            ->select('work_date', 'exception_status', DB::raw('count(*) as total'))
            ->groupBy('work_date', 'exception_status')
            ->orderByDesc('work_date')
            ->get();
        $attendancePulse = $this->attendancePulseSeries($attendancePulseRows, 10);
        $attendanceTotalRecent = collect($attendancePulse)->sum(fn (array $item) => $item['primary'] + $item['secondary'] + $item['tertiary']);
        $attendanceNormalRecent = collect($attendancePulse)->sum('primary');
        $attendanceCompliance = $this->safePercent($attendanceNormalRecent, $attendanceTotalRecent);

        $attendanceExceptions = AttendanceRecord::query()
            ->with('employee:id,first_name,surname,staff_number')
            ->where('exception_status', '!=', 'NORMAL')
            ->orderByDesc('work_date')
            ->limit(5)
            ->get()
            ->map(fn (AttendanceRecord $record) => $this->record(
                $record->employee?->full_name ?? 'Unassigned employee',
                $this->humanize($record->exception_status),
                $record->work_date->format('M j, Y'),
                '/attendance-records/'.$record->id
            ))
            ->all();

        $timesheetStatus = $this->countBy(Timesheet::query(), 'status');
        $submittedTimesheets = $timesheetStatus['SUBMITTED'] ?? 0;
        $timesheetTrend = Timesheet::query()
            ->select('period_end', DB::raw('sum(total_minutes) as total_minutes'), DB::raw('sum(overtime_minutes) as overtime_minutes'))
            ->groupBy('period_end')
            ->orderByDesc('period_end')
            ->limit(6)
            ->get()
            ->sortBy('period_end')
            ->values()
            ->map(fn ($row) => [
                'label' => Carbon::parse($row->period_end)->format('M j'),
                'primary' => round(((int) $row->total_minutes) / 60, 1),
                'secondary' => round(((int) $row->overtime_minutes) / 60, 1),
            ])
            ->all();

        $recentTimesheets = Timesheet::query()
            ->with('employee:id,first_name,surname,staff_number')
            ->orderByDesc('period_end')
            ->limit(5)
            ->get()
            ->map(fn (Timesheet $timesheet) => $this->record(
                $timesheet->employee?->full_name ?? 'Unassigned employee',
                number_format(round($timesheet->total_minutes / 60, 1), 1).' total hours',
                $timesheet->period_start->format('M j').' to '.$timesheet->period_end->format('M j, Y'),
                '/timesheets/'.$timesheet->id,
                $this->humanize($timesheet->status)
            ))
            ->all();

        $payrollStatus = $this->countBy(PayrollExport::query(), 'status');
        $failedPayrollExports = $payrollStatus['FAILED'] ?? 0;
        $recentPayrollExports = PayrollExport::query()
            ->orderByDesc('period_end')
            ->limit(5)
            ->get()
            ->map(fn (PayrollExport $payrollExport) => $this->record(
                'Export '.$payrollExport->export_version,
                $payrollExport->period_start->format('M j').' to '.$payrollExport->period_end->format('M j, Y'),
                $payrollExport->exported_at ? 'Processed '.$payrollExport->exported_at->format('M j, Y H:i') : 'Awaiting export timestamp',
                '/payroll-exports/'.$payrollExport->id,
                $this->humanize($payrollExport->status)
            ))
            ->all();

        $modules = [
            'leave_requests' => $this->moduleDetail(
                'leave_requests',
                'Leave requests',
                'operations',
                '/leave-requests',
                LeaveRequest::count(),
                sprintf('%s pending approvals across %s leave types', number_format($pendingLeaveRequests), number_format(count($leaveTypeBreakdown))),
                [
                    $pendingLeaveRequests > 0 ? number_format($pendingLeaveRequests).' leave requests are currently waiting for action' : 'No leave approvals are waiting for action',
                    collect($this->asBreakdown($leaveTypeBreakdown))->first()['label'] ?? 'Leave types will appear as records arrive',
                    number_format(round(LeaveRequest::query()->avg('days') ?? 0, 1), 1).' average leave days requested',
                ],
                $this->asBreakdown($leaveStatus),
                $leaveUpcoming,
                $this->singleMonthlySeries(LeaveRequest::query()->whereNotNull('start_date')->pluck('start_date'), 6),
                ['primary' => 'Requests']
            ),
            'attendance_records' => $this->moduleDetail(
                'attendance_records',
                'Attendance',
                'operations',
                '/attendance-records',
                AttendanceRecord::count(),
                number_format($attendanceCompliance, 1).'% compliance across the latest tracked workdays',
                [
                    number_format($attendanceStatus['LATE'] ?? 0).' late arrivals logged',
                    number_format($attendanceStatus['MISSING_PUNCH'] ?? 0).' missing-punch exceptions require review',
                    number_format($attendanceStatus['NORMAL'] ?? 0).' normal records confirmed',
                ],
                $this->asBreakdown($attendanceStatus),
                $attendanceExceptions,
                $attendancePulse,
                ['primary' => 'Normal', 'secondary' => 'Late', 'tertiary' => 'Missing']
            ),
            'timesheets' => $this->moduleDetail(
                'timesheets',
                'Timesheets',
                'operations',
                '/timesheets',
                Timesheet::count(),
                sprintf('%s timesheets submitted and awaiting review', number_format($submittedTimesheets)),
                [
                    number_format(round((Timesheet::sum('total_minutes') ?? 0) / 60, 1), 1).' total hours captured',
                    number_format(round((Timesheet::sum('overtime_minutes') ?? 0) / 60, 1), 1).' overtime hours reported',
                    number_format($timesheetStatus['APPROVED'] ?? 0).' timesheets approved so far',
                ],
                $this->asBreakdown($timesheetStatus),
                $recentTimesheets,
                $timesheetTrend,
                ['primary' => 'Total hours', 'secondary' => 'Overtime']
            ),
            'payroll_exports' => $this->moduleDetail(
                'payroll_exports',
                'Payroll exports',
                'operations',
                '/payroll-exports',
                PayrollExport::count(),
                sprintf('%s failed export%s require attention', number_format($failedPayrollExports), $failedPayrollExports === 1 ? '' : 's'),
                [
                    number_format($payrollStatus['EXPORTED'] ?? 0).' exports fully delivered',
                    number_format($payrollStatus['RECONCILED'] ?? 0).' exports reconciled',
                    number_format($payrollStatus['PREPARED'] ?? 0).' exports prepared for the next run',
                ],
                $this->asBreakdown($payrollStatus),
                $recentPayrollExports
            ),
        ];

        return [
            'section' => [
                'title' => 'Operations',
                'description' => 'Daily execution across leave, time, attendance, and payroll control.',
                'module_keys' => array_keys($modules),
                'metrics' => [
                    $this->metric('leave_requests', 'Pending leave', $pendingLeaveRequests, 'Requests waiting for approval decision', '/leave-requests'),
                    $this->metric('attendance', 'Attendance compliance', $attendanceCompliance, 'Normal clock events in the latest tracked period', '/attendance-records', 'percentage'),
                    $this->metric('timesheets', 'Submitted timesheets', $submittedTimesheets, 'Timesheets awaiting approval or rejection', '/timesheets'),
                    $this->metric('payroll_exports', 'Failed payroll exports', $failedPayrollExports, 'Exports requiring retry or investigation', '/payroll-exports'),
                ],
                'charts' => [
                    'attendance_pulse' => [
                        'title' => 'Attendance pulse',
                        'description' => 'Normal days versus late arrivals and missing punches across the latest workdays.',
                        'primary_label' => 'Normal',
                        'secondary_label' => 'Late',
                        'tertiary_label' => 'Missing',
                        'data' => $attendancePulse,
                    ],
                    'leave_status' => [
                        'title' => 'Leave status mix',
                        'description' => 'Current request outcomes by workflow status.',
                        'data' => $this->asBreakdown($leaveStatus),
                    ],
                    'timesheet_hours' => [
                        'title' => 'Captured hours',
                        'description' => 'Total tracked hours and overtime across the latest periods.',
                        'primary_label' => 'Total hours',
                        'secondary_label' => 'Overtime',
                        'data' => $timesheetTrend,
                    ],
                    'payroll_status' => [
                        'title' => 'Payroll export state',
                        'description' => 'Export lifecycle distribution for the current payroll history.',
                        'data' => $this->asBreakdown($payrollStatus),
                    ],
                ],
                'lists' => [
                    'leave_queue' => [
                        'title' => 'Leave queue',
                        'description' => 'Upcoming leave events and their approval state.',
                        'items' => $leaveUpcoming,
                    ],
                    'recent_exports' => [
                        'title' => 'Recent payroll exports',
                        'description' => 'Latest export jobs across payroll periods.',
                        'items' => $recentPayrollExports,
                    ],
                ],
                'meta' => [
                    'pending_leave_requests' => $pendingLeaveRequests,
                    'submitted_timesheets' => $submittedTimesheets,
                    'attendance_compliance' => $attendanceCompliance,
                    'failed_payroll_exports' => $failedPayrollExports,
                ],
            ],
            'modules' => $modules,
        ];
    }

    private function buildTalentSection(): array
    {
        $requisitionStatus = $this->countBy(JobRequisition::query(), 'status');
        $openRequisitions = $requisitionStatus['OPEN'] ?? 0;
        $requisitionDepartmentRows = JobRequisition::query()
            ->select('department', DB::raw('count(*) as total'))
            ->whereNotNull('department')
            ->where('department', '!=', '')
            ->groupBy('department')
            ->orderByDesc('total')
            ->limit(6)
            ->get();

        $recentRequisitions = JobRequisition::query()
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn (JobRequisition $requisition) => $this->record(
                $requisition->title,
                $this->joinText([$requisition->department, $requisition->hiring_manager]) ?: 'Recruitment request',
                ($requisition->target_start_date?->format('M j, Y') ?? 'No target start').' | '.$requisition->requisition_code,
                '/job-requisitions/'.$requisition->id,
                $this->humanize($requisition->status)
            ))
            ->all();

        $candidateStatus = $this->countBy(CandidateProfile::query(), 'status');
        $candidateStage = $this->countBy(CandidateProfile::query(), 'stage');
        $activeCandidates = $candidateStatus['ACTIVE'] ?? 0;

        $recentCandidates = CandidateProfile::query()
            ->with('requisition:requisition_code,title')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn (CandidateProfile $candidate) => $this->record(
                $candidate->full_name,
                $candidate->requisition?->title ?? ($candidate->requisition_code ?: 'Unlinked candidate'),
                $candidate->email ?: 'Email not provided',
                '/candidates/'.$candidate->id,
                $this->humanize($candidate->stage)
            ))
            ->all();

        $onboardingStatus = $this->countBy(OnboardingTask::query(), 'status');
        $overdueOnboardingTasks = OnboardingTask::query()->whereDate('due_date', '<', today())->whereNotIn('status', ['DONE'])->count();

        $onboardingWatch = OnboardingTask::query()
            ->with('employee:id,first_name,surname,staff_number')
            ->orderBy('due_date')
            ->limit(5)
            ->get()
            ->map(fn (OnboardingTask $task) => $this->record(
                $task->task_name,
                $task->employee?->full_name ?? ($task->owner_team ?: 'Task owner not set'),
                $task->due_date ? 'Due '.$task->due_date->format('M j, Y') : 'No due date set',
                '/onboarding-tasks/'.$task->id,
                $this->humanize($task->status)
            ))
            ->all();

        $offboardingStatus = $this->countBy(OffboardingTask::query(), 'status');
        $blockedOffboardingTasks = $offboardingStatus['BLOCKED'] ?? 0;

        $offboardingWatch = OffboardingTask::query()
            ->with('employee:id,first_name,surname,staff_number')
            ->orderBy('due_date')
            ->limit(5)
            ->get()
            ->map(fn (OffboardingTask $task) => $this->record(
                $task->task_name,
                $task->employee?->full_name ?? ($task->owner_team ?: 'Task owner not set'),
                $task->due_date ? 'Due '.$task->due_date->format('M j, Y') : 'No due date set',
                '/offboarding-tasks/'.$task->id,
                $this->humanize($task->status)
            ))
            ->all();

        $performanceStatus = $this->countBy(PerformanceReview::query(), 'status');
        $completedReviews = $performanceStatus['COMPLETED'] ?? 0;
        $reviewsInFlight = ($performanceStatus['PLANNED'] ?? 0) + ($performanceStatus['IN_REVIEW'] ?? 0);
        $averageRating = round((float) PerformanceReview::query()->whereNotNull('rating')->avg('rating'), 2);

        $ratingBreakdown = [
            'High (4.0+)' => PerformanceReview::query()->where('rating', '>=', 4)->count(),
            'Solid (3.0 - 3.99)' => PerformanceReview::query()->whereBetween('rating', [3, 3.99])->count(),
            'Needs support (< 3.0)' => PerformanceReview::query()->whereNotNull('rating')->where('rating', '<', 3)->count(),
        ];

        $reviewQueue = PerformanceReview::query()
            ->with('employee:id,first_name,surname,staff_number')
            ->orderBy('review_date')
            ->limit(5)
            ->get()
            ->map(fn (PerformanceReview $review) => $this->record(
                $review->employee?->full_name ?? 'Unassigned employee',
                $review->cycle_name,
                $review->review_date ? 'Review '.$review->review_date->format('M j, Y') : 'Review date not set',
                '/performance-reviews/'.$review->id,
                $this->humanize($review->status)
            ))
            ->all();

        $learningStatus = $this->countBy(LearningCourse::query(), 'status');
        $mandatoryCourses = LearningCourse::query()->where('compliance_required', true)->count();
        $learningCategories = $this->countBy(LearningCourse::query()->whereNotNull('category')->where('category', '!=', ''), 'category');

        $learningCatalog = LearningCourse::query()
            ->orderByDesc('updated_at')
            ->limit(5)
            ->get()
            ->map(fn (LearningCourse $course) => $this->record(
                $course->title,
                $course->category ?: 'Uncategorised',
                number_format((float) $course->duration_hours, 1).'h course | '.$course->course_code,
                '/learning-courses/'.$course->id,
                $this->humanize($course->status)
            ))
            ->all();

        $modules = [
            'job_requisitions' => $this->moduleDetail(
                'job_requisitions',
                'Job requisitions',
                'talent',
                '/job-requisitions',
                JobRequisition::count(),
                sprintf('%s open requisitions covering %s planned openings', number_format($openRequisitions), number_format((int) JobRequisition::query()->where('status', 'OPEN')->sum('openings'))),
                [
                    $requisitionDepartmentRows->isNotEmpty() ? $requisitionDepartmentRows->first()->department.' carries the largest requisition load' : 'Department demand will appear once requisitions are assigned',
                    number_format($requisitionStatus['FILLED'] ?? 0).' requisitions already filled',
                    number_format($requisitionStatus['ON_HOLD'] ?? 0).' requisitions currently on hold',
                ],
                $this->asBreakdown($requisitionStatus),
                $recentRequisitions
            ),
            'candidate_profiles' => $this->moduleDetail(
                'candidate_profiles',
                'Candidate profiles',
                'talent',
                '/candidates',
                CandidateProfile::count(),
                sprintf('%s active candidates, %s already hired', number_format($activeCandidates), number_format($candidateStatus['HIRED'] ?? 0)),
                [
                    number_format($candidateStage['INTERVIEW'] ?? 0).' candidates in interview stage',
                    number_format($candidateStage['OFFER'] ?? 0).' offer-stage candidates ready for closeout',
                    number_format($candidateStage['REJECTED'] ?? 0).' rejected candidates retained for audit trail',
                ],
                $this->asBreakdown($candidateStage),
                $recentCandidates
            ),
            'onboarding_tasks' => $this->moduleDetail(
                'onboarding_tasks',
                'Onboarding tasks',
                'talent',
                '/onboarding-tasks',
                OnboardingTask::count(),
                sprintf('%s tasks overdue and %s still open', number_format($overdueOnboardingTasks), number_format($onboardingStatus['OPEN'] ?? 0)),
                [
                    number_format($onboardingStatus['DONE'] ?? 0).' onboarding tasks already completed',
                    number_format($onboardingStatus['IN_PROGRESS'] ?? 0).' tasks are currently in motion',
                    number_format($onboardingStatus['OVERDUE'] ?? 0).' tasks flagged overdue by status',
                ],
                $this->asBreakdown($onboardingStatus),
                $onboardingWatch
            ),
            'offboarding_tasks' => $this->moduleDetail(
                'offboarding_tasks',
                'Offboarding tasks',
                'talent',
                '/offboarding-tasks',
                OffboardingTask::count(),
                sprintf('%s blocked tasks across %s active exits', number_format($blockedOffboardingTasks), number_format(($offboardingStatus['OPEN'] ?? 0) + ($offboardingStatus['IN_PROGRESS'] ?? 0))),
                [
                    number_format($offboardingStatus['CLEARED'] ?? 0).' exits already cleared',
                    number_format($offboardingStatus['IN_PROGRESS'] ?? 0).' exits are actively being processed',
                    number_format($offboardingStatus['OPEN'] ?? 0).' offboarding tasks remain open',
                ],
                $this->asBreakdown($offboardingStatus),
                $offboardingWatch
            ),
            'performance_reviews' => $this->moduleDetail(
                'performance_reviews',
                'Performance reviews',
                'talent',
                '/performance-reviews',
                PerformanceReview::count(),
                sprintf('%s completed reviews with an average rating of %s', number_format($completedReviews), number_format($averageRating, 2)),
                [
                    number_format($reviewsInFlight).' reviews remain planned or in review',
                    number_format($performanceStatus['IN_REVIEW'] ?? 0).' reviews are currently in active review',
                    number_format($performanceStatus['PLANNED'] ?? 0).' reviews still scheduled ahead',
                ],
                $this->asBreakdown($performanceStatus),
                $reviewQueue
            ),
            'learning_courses' => $this->moduleDetail(
                'learning_courses',
                'Learning courses',
                'talent',
                '/learning-courses',
                LearningCourse::count(),
                sprintf('%s mandatory courses across %s catalogue categories', number_format($mandatoryCourses), number_format(count($learningCategories))),
                [
                    number_format($learningStatus['ACTIVE'] ?? 0).' active courses available in the catalogue',
                    number_format($learningStatus['ARCHIVED'] ?? 0).' courses archived for historical reference',
                    number_format($learningStatus['INACTIVE'] ?? 0).' courses inactive pending reuse or cleanup',
                ],
                $this->asBreakdown($learningStatus),
                $learningCatalog
            ),
        ];

        return [
            'section' => [
                'title' => 'Talent',
                'description' => 'Recruitment, onboarding, offboarding, development, and performance execution.',
                'module_keys' => array_keys($modules),
                'metrics' => [
                    $this->metric('open_requisitions', 'Open requisitions', $openRequisitions, 'Roles still open for hiring', '/job-requisitions'),
                    $this->metric('active_candidates', 'Active candidates', $activeCandidates, 'Candidates still progressing through hiring', '/candidates'),
                    $this->metric('overdue_onboarding', 'Overdue onboarding', $overdueOnboardingTasks, 'Tasks past due and not marked done', '/onboarding-tasks'),
                    $this->metric('reviews_in_flight', 'Reviews in flight', $reviewsInFlight, 'Planned or in-review performance cycles', '/performance-reviews'),
                ],
                'charts' => [
                    'candidate_pipeline' => [
                        'title' => 'Candidate pipeline',
                        'description' => 'Current volume by recruiting stage.',
                        'data' => $this->asBreakdown($candidateStage),
                    ],
                    'requisition_status' => [
                        'title' => 'Requisition health',
                        'description' => 'Status spread across open, on-hold, filled, and closed requests.',
                        'data' => $this->asBreakdown($requisitionStatus),
                    ],
                    'performance_ratings' => [
                        'title' => 'Performance rating spread',
                        'description' => 'Completed review ratings grouped into broad bands.',
                        'data' => $this->asBreakdown($ratingBreakdown),
                    ],
                    'learning_categories' => [
                        'title' => 'Learning catalogue by category',
                        'description' => 'Course supply grouped by current category tags.',
                        'data' => $this->asBreakdown($learningCategories),
                    ],
                ],
                'lists' => [
                    'requisition_watch' => [
                        'title' => 'Requisition watch',
                        'description' => 'Most recent requisitions added to the hiring queue.',
                        'items' => $recentRequisitions,
                    ],
                    'onboarding_watch' => [
                        'title' => 'Lifecycle watch',
                        'description' => 'Near-term onboarding and offboarding tasks requiring coordination.',
                        'items' => [...array_slice($onboardingWatch, 0, 3), ...array_slice($offboardingWatch, 0, 2)],
                    ],
                ],
                'meta' => [
                    'open_requisitions' => $openRequisitions,
                    'active_candidates' => $activeCandidates,
                    'overdue_onboarding_tasks' => $overdueOnboardingTasks,
                    'blocked_offboarding_tasks' => $blockedOffboardingTasks,
                    'overdue_lifecycle_tasks' => $overdueOnboardingTasks + $blockedOffboardingTasks,
                    'reviews_in_flight' => $reviewsInFlight,
                ],
            ],
            'modules' => $modules,
        ];
    }

    private function buildGovernanceSection(): array
    {
        $usersTotal = User::count();
        $employeeLinkedUsers = Employee::whereNotNull('user_id')->count();
        $standaloneUsers = max($usersTotal - $employeeLinkedUsers, 0);
        $verifiedUsers = User::whereNotNull('email_verified_at')->count();
        $usersWithRoles = DB::table('role_users')->distinct('user_id')->count('user_id');
        $twoFactorUsers = Schema::hasColumn('users', 'two_factor_confirmed_at') ? User::whereNotNull('two_factor_confirmed_at')->count() : 0;

        $roleAssignmentRows = DB::table('roles')
            ->leftJoin('role_users', 'roles.id', '=', 'role_users.role_id')
            ->select('roles.name', 'roles.code', DB::raw('count(role_users.user_id) as total'))
            ->groupBy('roles.id', 'roles.name', 'roles.code')
            ->orderByDesc('total')
            ->get();

        $recentUsers = User::query()
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn (User $user) => $this->record($user->name, $user->email, 'Created '.$user->created_at?->format('M j, Y'), '/users/'.$user->id))
            ->all();

        $workflowStatus = $this->countBy(WorkflowDefinition::query(), 'status');
        $workflowRequestTypes = $this->countBy(WorkflowDefinition::query()->whereNotNull('request_type')->where('request_type', '!=', ''), 'request_type');
        $averageWorkflowSla = round((float) WorkflowDefinition::query()->avg('sla_hours'), 1);
        $recentWorkflows = WorkflowDefinition::query()
            ->orderByDesc('updated_at')
            ->limit(5)
            ->get()
            ->map(fn (WorkflowDefinition $workflow) => $this->record(
                $workflow->name,
                $this->humanize($workflow->request_type),
                ($workflow->sla_hours ? number_format((float) $workflow->sla_hours, 0).'h SLA' : 'No SLA').' | updated '.$workflow->updated_at?->format('M j, Y'),
                '/workflows/'.$workflow->id,
                $this->humanize($workflow->status)
            ))
            ->all();

        $documentTypeSensitivity = $this->countBy(DocumentType::query()->whereNotNull('sensitivity_level')->where('sensitivity_level', '!=', ''), 'sensitivity_level');
        $documentTypeUsageRows = DB::table('document_types')
            ->leftJoin('documents', 'document_types.id', '=', 'documents.document_type_id')
            ->select('document_types.name', DB::raw('count(documents.id) as total'))
            ->groupBy('document_types.id', 'document_types.name')
            ->orderByDesc('total')
            ->limit(6)
            ->get();

        $documentTypes = DocumentType::query()
            ->orderByDesc('updated_at')
            ->limit(5)
            ->get()
            ->map(fn (DocumentType $documentType) => $this->record(
                $documentType->name,
                $documentType->code,
                $this->humanize($documentType->sensitivity_level).' sensitivity',
                '/document-types/'.$documentType->id
            ))
            ->all();

        $documentAccess = $this->countBy(Document::query()->whereNotNull('access_policy')->where('access_policy', '!=', ''), 'access_policy');
        $documentsExpired = Document::query()->whereDate('expiry_date', '<', today())->count();
        $documentsExpiringSoon = Document::query()->whereDate('expiry_date', '>=', today())->whereDate('expiry_date', '<=', today()->copy()->addDays(30))->count();
        $recentDocuments = Document::query()
            ->with(['documentType:id,name', 'ownerEmployee:id,first_name,surname,staff_number'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn (Document $document) => $this->record(
                $document->title ?: ($document->documentType?->name ?? 'Untitled document'),
                $document->ownerEmployee?->full_name ?? 'No owner mapped',
                $document->expiry_date ? 'Expires '.$document->expiry_date->format('M j, Y') : 'No expiry date',
                '/documents/'.$document->id,
                $this->humanize($document->access_policy)
            ))
            ->all();

        $modules = [
            'users' => $this->moduleDetail(
                'users',
                'Users',
                'governance',
                '/users',
                $usersTotal,
                sprintf('%s employee-linked accounts and %s standalone user%s', number_format($employeeLinkedUsers), number_format($standaloneUsers), $standaloneUsers === 1 ? '' : 's'),
                [
                    $this->percentText($verifiedUsers, $usersTotal, 'Email verified'),
                    $this->percentText($usersWithRoles, $usersTotal, 'Assigned at least one role'),
                    number_format($twoFactorUsers).' users have confirmed two-factor authentication',
                ],
                $this->asBreakdown(['Employee linked' => $employeeLinkedUsers, 'Standalone' => $standaloneUsers]),
                $recentUsers
            ),
            'roles' => $this->moduleDetail(
                'roles',
                'Roles',
                'governance',
                '/roles',
                Role::count(),
                sprintf('%s total role assignments across the user base', number_format((int) $roleAssignmentRows->sum('total'))),
                [
                    $roleAssignmentRows->isNotEmpty() ? $roleAssignmentRows->first()->name.' is the most assigned role' : 'Role allocations will appear as users are mapped',
                    number_format(Role::count()).' role definitions available for access control',
                    number_format($usersWithRoles).' users currently covered by RBAC assignments',
                ],
                $this->rowsToBreakdown($roleAssignmentRows, 'name', 'total'),
                collect($roleAssignmentRows)->take(5)->map(fn ($row) => $this->record($row->name, $row->code, number_format((int) $row->total).' assigned users', '/roles'))->all()
            ),
            'workflow_definitions' => $this->moduleDetail(
                'workflow_definitions',
                'Workflow definitions',
                'governance',
                '/workflows',
                WorkflowDefinition::count(),
                sprintf('%s active workflows with an average SLA of %sh', number_format($workflowStatus['ACTIVE'] ?? 0), number_format($averageWorkflowSla, 1)),
                [
                    number_format($workflowStatus['INACTIVE'] ?? 0).' workflows are inactive',
                    number_format(count($workflowRequestTypes)).' request types currently automated',
                    $averageWorkflowSla > 0 ? 'Average configured SLA is '.number_format($averageWorkflowSla, 1).' hours' : 'SLA values are not configured yet',
                ],
                $this->asBreakdown($workflowStatus),
                $recentWorkflows
            ),
            'document_types' => $this->moduleDetail(
                'document_types',
                'Document types',
                'governance',
                '/document-types',
                DocumentType::count(),
                sprintf('%s controlled document types with %s sensitivity tiers', number_format(DocumentType::count()), number_format(count($documentTypeSensitivity))),
                [
                    $documentTypeUsageRows->isNotEmpty() ? $documentTypeUsageRows->first()->name.' is the most used document type' : 'Usage metrics will populate when documents are uploaded',
                    number_format(DocumentType::count()).' document types are available to classify files',
                    number_format(($documentTypeSensitivity['HIGHLY_CONFIDENTIAL'] ?? 0) + ($documentTypeSensitivity['CONFIDENTIAL'] ?? 0)).' high-sensitivity types require tighter governance',
                ],
                $this->asBreakdown($documentTypeSensitivity),
                $documentTypes
            ),
            'documents' => $this->moduleDetail(
                'documents',
                'Documents',
                'governance',
                '/documents',
                Document::count(),
                sprintf('%s expired and %s expiring within 30 days', number_format($documentsExpired), number_format($documentsExpiringSoon)),
                [
                    number_format(Document::count()).' active document records in the vault',
                    number_format($documentAccess['HR_ONLY'] ?? 0).' files restricted to HR only access',
                    number_format($documentAccess['OWNER_MANAGER_HR'] ?? 0).' files shared with managers and HR',
                ],
                $this->asBreakdown($documentAccess),
                $recentDocuments
            ),
        ];

        return [
            'section' => [
                'title' => 'Governance',
                'description' => 'Access control, workflows, and document governance across the HRMS estate.',
                'module_keys' => array_keys($modules),
                'metrics' => [
                    $this->metric('users', 'Users', $usersTotal, $this->percentText($usersWithRoles, $usersTotal, 'Covered by at least one role'), '/users'),
                    $this->metric('roles', 'Roles', Role::count(), sprintf('%s total RBAC assignments', number_format((int) $roleAssignmentRows->sum('total'))), '/roles'),
                    $this->metric('workflows', 'Active workflows', $workflowStatus['ACTIVE'] ?? 0, number_format($averageWorkflowSla, 1).'h average SLA', '/workflows'),
                    $this->metric('documents', 'Documents expiring or expired', $documentsExpired + $documentsExpiringSoon, 'Files that need governance follow-up', '/documents'),
                ],
                'charts' => [
                    'role_assignments' => [
                        'title' => 'Role assignment mix',
                        'description' => 'Assigned users by role definition.',
                        'data' => $this->rowsToBreakdown($roleAssignmentRows, 'name', 'total'),
                    ],
                    'workflow_request_types' => [
                        'title' => 'Workflow coverage',
                        'description' => 'Configured workflow definitions by request type.',
                        'data' => $this->asBreakdown($workflowRequestTypes),
                    ],
                    'document_access' => [
                        'title' => 'Document access policy',
                        'description' => 'How document visibility is currently segmented.',
                        'data' => $this->asBreakdown($documentAccess),
                    ],
                    'document_type_usage' => [
                        'title' => 'Document type usage',
                        'description' => 'Most frequently used document classes in the vault.',
                        'data' => $this->rowsToBreakdown($documentTypeUsageRows, 'name', 'total'),
                    ],
                ],
                'lists' => [
                    'recent_workflows' => [
                        'title' => 'Workflow changes',
                        'description' => 'Most recently updated workflow definitions.',
                        'items' => $recentWorkflows,
                    ],
                    'recent_documents' => [
                        'title' => 'Recent documents',
                        'description' => 'Latest files added or updated in document storage.',
                        'items' => $recentDocuments,
                    ],
                ],
                'meta' => [
                    'documents_expiring_soon' => $documentsExpiringSoon,
                    'documents_expired' => $documentsExpired,
                    'documents_expiring_or_expired' => $documentsExpired + $documentsExpiringSoon,
                ],
            ],
            'modules' => $modules,
        ];
    }

    private function buildAlerts(
        int $pendingApprovals,
        int $failedPayrollExports,
        int $overdueOnboardingTasks,
        int $blockedOffboardingTasks,
        int $documentsExpired,
        int $documentsExpiringSoon,
        int $reviewsInFlight,
    ): array {
        $alerts = [];

        if ($failedPayrollExports > 0) {
            $alerts[] = $this->alert('payroll_failures', 'critical', number_format($failedPayrollExports).' payroll export failure'.($failedPayrollExports === 1 ? '' : 's'), 'The payroll pipeline has failed jobs that should be retried or reconciled before the next run.', '/payroll-exports');
        }

        if ($pendingApprovals > 0) {
            $alerts[] = $this->alert('pending_approvals', 'warning', number_format($pendingApprovals).' approval items waiting', 'Leave requests and submitted timesheets are still waiting for review decisions.', '/leave-requests');
        }

        if ($overdueOnboardingTasks > 0) {
            $alerts[] = $this->alert('overdue_onboarding', 'warning', number_format($overdueOnboardingTasks).' onboarding task'.($overdueOnboardingTasks === 1 ? '' : 's').' overdue', 'New-hire tasks are past due and could impact readiness or compliance.', '/onboarding-tasks');
        }

        if ($blockedOffboardingTasks > 0) {
            $alerts[] = $this->alert('blocked_offboarding', 'info', number_format($blockedOffboardingTasks).' blocked offboarding task'.($blockedOffboardingTasks === 1 ? '' : 's'), 'Exit tasks are blocked and may delay final clearance or asset recovery.', '/offboarding-tasks');
        }

        if ($documentsExpired > 0 || $documentsExpiringSoon > 0) {
            $alerts[] = $this->alert('document_watch', $documentsExpired > 0 ? 'critical' : 'warning', number_format($documentsExpired + $documentsExpiringSoon).' document item'.(($documentsExpired + $documentsExpiringSoon) === 1 ? '' : 's').' need review', 'Expired and soon-to-expire files should be renewed or archived to keep the document vault compliant.', '/documents');
        }

        if ($reviewsInFlight > 0) {
            $alerts[] = $this->alert('reviews_in_flight', 'info', number_format($reviewsInFlight).' performance review'.($reviewsInFlight === 1 ? '' : 's').' in flight', 'Planned and in-review cycles are still open and need manager follow-through.', '/performance-reviews');
        }

        if ($alerts === []) {
            $alerts[] = $this->alert('stable', 'success', 'Operational queue is currently stable', 'No high-priority issues were detected across payroll, approvals, or document compliance.', '/reports');
        }

        return $alerts;
    }

    private function moduleDetail(string $key, string $name, string $group, string $href, int $total, string $summary, array $highlights, array $breakdown = [], array $records = [], array $trend = [], array $trendLabels = []): array
    {
        return [
            'key' => $key,
            'name' => $name,
            'group' => $group,
            'href' => $href,
            'total' => $total,
            'summary' => $summary,
            'highlights' => $highlights,
            'breakdown' => $breakdown,
            'records' => $records,
            'trend' => $trend,
            'trend_labels' => $trendLabels,
        ];
    }

    private function metric(string $key, string $label, int|float $value, string $helper, ?string $href = null, string $format = 'number'): array
    {
        return [
            'key' => $key,
            'label' => $label,
            'value' => $value,
            'helper' => $helper,
            'href' => $href,
            'format' => $format,
        ];
    }

    private function quickLink(string $key, string $label, string $href, string $description): array
    {
        return ['key' => $key, 'label' => $label, 'href' => $href, 'description' => $description];
    }

    private function alert(string $key, string $severity, string $title, string $description, string $href): array
    {
        return ['key' => $key, 'severity' => $severity, 'title' => $title, 'description' => $description, 'href' => $href];
    }

    private function record(string $title, string $subtitle, string $meta, ?string $href = null, ?string $status = null): array
    {
        return ['title' => $title, 'subtitle' => $subtitle, 'meta' => $meta, 'href' => $href, 'status' => $status];
    }

    private function countBy($query, string $column): array
    {
        return (clone $query)
            ->select($column, DB::raw('count(*) as total'))
            ->groupBy($column)
            ->orderByDesc('total')
            ->get()
            ->mapWithKeys(function ($row) use ($column) {
                $label = (string) ($row->{$column} ?? 'Not set');
                return [$label => (int) $row->total];
            })
            ->all();
    }

    private function asBreakdown(array $counts): array
    {
        $filtered = collect($counts)->filter(fn (int $value) => $value > 0)->sortDesc();
        $total = max((int) $filtered->sum(), 1);

        return $filtered
            ->map(fn (int $value, string $label) => [
                'label' => $this->humanize($label),
                'value' => $value,
                'percentage' => round(($value / $total) * 100, 1),
            ])
            ->values()
            ->all();
    }

    private function rowsToBreakdown(Collection $rows, string $labelKey, string $valueKey): array
    {
        $total = max((int) $rows->sum($valueKey), 1);

        return $rows
            ->map(fn ($row) => [
                'label' => (string) $row->{$labelKey},
                'value' => (int) $row->{$valueKey},
                'percentage' => round((((int) $row->{$valueKey}) / $total) * 100, 1),
            ])
            ->values()
            ->all();
    }

    private function pairedMonthlySeries(iterable $primaryDates, iterable $secondaryDates, int $months = 6): array
    {
        $monthsSeries = collect(range($months - 1, 0))->map(fn (int $offset) => now()->copy()->startOfMonth()->subMonths($offset));
        $buckets = $monthsSeries->mapWithKeys(fn ($month) => [$month->format('Y-m') => ['label' => $month->format('M'), 'primary' => 0, 'secondary' => 0]]);

        foreach ($primaryDates as $date) {
            if (blank($date)) {
                continue;
            }
            $key = Carbon::parse($date)->format('Y-m');
            if ($buckets->has($key)) {
                $bucket = $buckets->get($key);
                $bucket['primary']++;
                $buckets->put($key, $bucket);
            }
        }

        foreach ($secondaryDates as $date) {
            if (blank($date)) {
                continue;
            }
            $key = Carbon::parse($date)->format('Y-m');
            if ($buckets->has($key)) {
                $bucket = $buckets->get($key);
                $bucket['secondary']++;
                $buckets->put($key, $bucket);
            }
        }

        return $buckets->values()->all();
    }

    private function singleMonthlySeries(iterable $dates, int $months = 6): array
    {
        $monthsSeries = collect(range($months - 1, 0))->map(fn (int $offset) => now()->copy()->startOfMonth()->subMonths($offset));
        $buckets = $monthsSeries->mapWithKeys(fn ($month) => [$month->format('Y-m') => ['label' => $month->format('M'), 'primary' => 0]]);

        foreach ($dates as $date) {
            if (blank($date)) {
                continue;
            }
            $key = Carbon::parse($date)->format('Y-m');
            if ($buckets->has($key)) {
                $bucket = $buckets->get($key);
                $bucket['primary']++;
                $buckets->put($key, $bucket);
            }
        }

        return $buckets->values()->all();
    }

    private function attendancePulseSeries(Collection $rows, int $limit = 10): array
    {
        $dates = $rows->pluck('work_date')->map(fn ($date) => Carbon::parse($date)->toDateString())->unique()->take($limit)->sort()->values();

        return $dates
            ->map(function (string $date) use ($rows) {
                $dayRows = $rows->filter(fn ($row) => Carbon::parse($row->work_date)->toDateString() === $date);

                return [
                    'label' => Carbon::parse($date)->format('M j'),
                    'primary' => (int) ($dayRows->firstWhere('exception_status', 'NORMAL')->total ?? 0),
                    'secondary' => (int) ($dayRows->firstWhere('exception_status', 'LATE')->total ?? 0),
                    'tertiary' => (int) ($dayRows->firstWhere('exception_status', 'MISSING_PUNCH')->total ?? 0),
                ];
            })
            ->values()
            ->all();
    }

    private function humanize(?string $value): string
    {
        if (blank($value)) {
            return 'Not set';
        }

        $label = Str::of($value)->replace(['_', '-'], ' ')->lower()->title()->toString();

        return trim(str_replace(
            [' Hr ', ' Hr', 'Ict', 'Sbu', 'Id ', ' Id', 'Rbac', 'Sla'],
            [' HR ', ' HR', 'ICT', 'SBU', 'ID ', ' ID', 'RBAC', 'SLA'],
            ' '.$label.' '
        ));
    }

    private function joinText(array $parts): string
    {
        return implode(' | ', array_values(array_filter($parts, fn ($value) => filled($value))));
    }

    private function safePercent(int|float $part, int|float $whole): float
    {
        if ($whole <= 0) {
            return 0;
        }

        return round(($part / $whole) * 100, 1);
    }

    private function percentText(int|float $part, int|float $whole, string $suffix): string
    {
        return number_format($this->safePercent($part, $whole), 1).'% '.$suffix;
    }
}
