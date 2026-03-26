<?php

namespace App\Support\Dashboard;

use App\Models\AssetAssignment;
use App\Models\AuditLog;
use App\Models\CandidateProfile;
use App\Models\Document;
use App\Models\Employee;
use App\Models\EmployeeBenefitEnrollment;
use App\Models\EmployeeScorecard;
use App\Models\JobRequisition;
use App\Models\LearningCourse;
use App\Models\LeaveRequest;
use App\Models\OffboardingTask;
use App\Models\OnboardingTask;
use App\Models\Organization;
use App\Models\PayrollExport;
use App\Models\PayrollPeriod;
use App\Models\PayslipDelivery;
use App\Models\PerformanceImprovementPlan;
use App\Models\Role;
use App\Models\Timesheet;
use App\Models\User;
use App\Support\Tenancy\TenantContext;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RoleDashboardBuilder
{
    public function __construct(
        private readonly TenantContext $tenantContext,
        private readonly RoleDashboardResolver $resolver,
    ) {
    }

    public function build(User $user): array
    {
        $variant = $this->resolver->resolve($user);

        return match ($variant) {
            RoleDashboardResolver::SYSTEM_ADMIN => $this->buildSystemAdminDashboard($user, $variant),
            RoleDashboardResolver::HR_ADMIN => $this->buildHrAdminDashboard($user, $variant),
            RoleDashboardResolver::PAYROLL => $this->buildPayrollDashboard($user, $variant),
            RoleDashboardResolver::MANAGER => $this->buildManagerDashboard($user, $variant),
            RoleDashboardResolver::AUTHORISER => $this->buildAuthoriserDashboard($user, $variant),
            RoleDashboardResolver::AUDITOR => $this->buildAuditorDashboard($user, $variant),
            default => $this->buildEmployeeDashboard($user, $variant),
        };
    }

    private function buildSystemAdminDashboard(User $user, string $variant): array
    {
        return $this->crossOrg(function () use ($user, $variant) {
            $employees = Employee::query();
            $users = $this->visibleUsersQuery();
            $organizations = Organization::query();
            $pendingLeave = $this->countLowerStatus(LeaveRequest::query(), 'status', ['pending', 'submitted']);
            $pendingTimesheets = $this->countLowerStatus(Timesheet::query(), 'status', ['submitted', 'pending']);
            $payrollApproval = $this->countLowerStatus(PayrollPeriod::query(), 'status', ['processed', 'approval_pending']);
            $documentsExpired = Document::query()->whereDate('expiry_date', '<', today())->count();
            $documentsSoon = Document::query()->whereDate('expiry_date', '>=', today())->whereDate('expiry_date', '<=', today()->copy()->addDays(30))->count();
            $failedExports = $this->countLowerStatus(PayrollExport::query(), 'status', ['failed']);
            $openRequisitions = $this->countLowerStatus(JobRequisition::query(), 'status', ['open', 'approved', 'active']);
            $activeCandidates = CandidateProfile::query()->where('profile_visibility_status', 'active')->count();

            return $this->payload(
                $user,
                $variant,
                metrics: [
                    $this->metric('employees', 'Workforce', (int) $employees->count(), 'Employees across every active organization.', '/employees'),
                    $this->metric('users', 'User accounts', (int) $users->count(), 'Authenticated accounts with platform access.', '/users'),
                    $this->metric('organizations', 'Organizations', (int) $organizations->count(), 'Tenant organizations currently configured.', '/organizations'),
                    $this->metric('pending_approvals', 'Pending approvals', $pendingLeave + $pendingTimesheets + $payrollApproval, 'Leave, timesheets, and payroll items waiting for action.', '/leave-requests'),
                    $this->metric('open_hiring', 'Open hiring', $openRequisitions, $activeCandidates.' active candidate profiles in circulation.', '/job-requisitions'),
                    $this->metric('documents', 'Documents at risk', $documentsExpired + $documentsSoon, 'Expired or expiring employee files that need compliance action.', '/documents'),
                ],
                quickActions: array_values(array_filter([
                    $this->actionIf($user, 'employees.create', 'add_employee', 'Add employee', 'Create a new employee record and linked account.', '/employees/create', 'users'),
                    $this->actionIf($user, 'organizations.create', 'new_org', 'New organization', 'Register a new tenant or business entity.', '/organizations/create', 'building-2'),
                    $this->actionIf($user, 'users.create', 'invite_user', 'Create user', 'Provision a new user account and role membership.', '/users/create', 'user-plus'),
                    $this->actionIf($user, 'backups.run', 'run_backup', 'Run backup', 'Trigger a manual backup from system settings.', '/system-settings', 'database'),
                    $this->actionIf($user, 'reports.view', 'reports', 'Reports centre', 'Open the central reporting catalogue.', '/reports', 'file-bar-chart'),
                ])),
                alerts: $this->filterAlerts([
                    $documentsExpired > 0 ? $this->alert('expired_documents', 'critical', $documentsExpired.' expired document '.Str::plural('record', $documentsExpired), 'Compliance-critical files have already passed their expiry date.', '/documents') : null,
                    $failedExports > 0 ? $this->alert('failed_exports', 'critical', $failedExports.' failed payroll '.Str::plural('export', $failedExports), 'Payroll output failures need immediate triage before the next cycle.', '/payroll-exports') : null,
                    ($pendingLeave + $pendingTimesheets + $payrollApproval) > 0 ? $this->alert('pending_queue', 'warning', ($pendingLeave + $pendingTimesheets + $payrollApproval).' approval items waiting', 'Cross-functional approvals are accumulating across operations.', '/leave-requests') : null,
                ]),
                focusCards: [
                    $this->focusCard('operations', 'Operations queue', 'Approvals waiting across leave, timesheets, and payroll.', $pendingLeave + $pendingTimesheets + $payrollApproval, '/leave-requests', 'clock-3'),
                    $this->focusCard('recruitment', 'Recruitment watch', 'Open requisitions and active candidate listings.', $openRequisitions + $activeCandidates, '/recruitment', 'briefcase'),
                    $this->focusCard('governance', 'Governance pressure', 'Document and payroll exceptions that need central follow-up.', $documentsExpired + $documentsSoon + $failedExports, '/documents', 'shield'),
                ],
                charts: [
                    $this->breakdownChart('employee_status', 'Employee status mix', 'Current workforce distribution by employment status.', $this->countBy(Employee::query(), 'status')),
                    $this->breakdownChart('role_mix', 'Role assignment mix', 'Users carrying protected platform roles.', $this->roleAssignmentCounts()),
                    $this->trendChart('audit_volume', 'Audit activity', 'Audit events recorded over the last six months.', $this->monthlyTrend(AuditLog::query(), 'created_at')),
                ],
                lists: [
                    $this->listBlock('recent_employees', 'Recent employee additions', 'Latest workforce records added to the platform.', Employee::query()->with(['orgUnit:id,name', 'position:id,name'])->latest()->limit(5)->get()->map(fn (Employee $employee) => $this->record($employee->full_name, $this->joinText([$employee->orgUnit?->name, $employee->position?->name]) ?: 'Workforce record', $employee->hire_date ? 'Hire date '.$employee->hire_date->format('M j, Y') : 'Recently created', '/employees/'.$employee->id, $this->humanize($employee->status)))->all()),
                    $this->listBlock('recent_users', 'Recent user activity', 'Newest user accounts in the HRMS estate.', (clone $users)->latest()->limit(5)->get()->map(fn (User $account) => $this->record($account->name, $account->email, $account->created_at ? 'Joined '.$account->created_at->format('M j, Y') : 'User account', '/users/'.$account->id, $account->primaryPortal()))->all()),
                    $this->listBlock('audit_watch', 'Latest audit events', 'Most recent cross-module audit events.', AuditLog::query()->latest('created_at')->limit(6)->get()->map(fn (AuditLog $log) => $this->record($log->auditable_label ?: Str::headline((string) $log->module), $this->humanize($log->event), $log->created_at?->format('M j, Y g:i A') ?: 'Audit event', '/audit-trail', $this->humanize($log->module)))->all()),
                ],
                shortcuts: [
                    $this->shortcut('employees', 'Employees', 'Headcount, employee records, and lifecycle changes.', '/employees', 'users', (string) Employee::query()->count()),
                    $this->shortcut('users', 'Users', 'Account provisioning, roles, and impersonation control.', '/users', 'user-plus', (string) (clone $users)->count()),
                    $this->shortcut('organizations', 'Organizations', 'Tenant setup, memberships, and switching.', '/organizations', 'building-2', (string) Organization::query()->count()),
                    $this->shortcut('recruitment', 'Recruitment admin', 'Marketplace companies, vacancies, and paid directory data.', '/recruitment', 'briefcase', (string) ($openRequisitions + $activeCandidates)),
                    $this->shortcut('settings', 'System settings', 'Branding, backup policy, and operational controls.', '/system-settings', 'settings'),
                ],
            );
        });
    }

    private function buildHrAdminDashboard(User $user, string $variant): array
    {
        $employeeTotal = Employee::query()->count();
        $activeEmployees = $this->countLowerStatus(Employee::query(), 'status', ['active']);
        $pendingLeave = $this->countLowerStatus(LeaveRequest::query(), 'status', ['pending', 'submitted']);
        $overdueOnboarding = OnboardingTask::query()->whereDate('due_date', '<', today())->whereNotIn('status', ['completed', 'cancelled'])->count();
        $blockedOffboarding = OffboardingTask::query()->whereDate('due_date', '<', today())->whereNotIn('status', ['completed', 'cancelled'])->count();
        $openRequisitions = $this->countLowerStatus(JobRequisition::query(), 'status', ['open', 'approved', 'active']);
        $reviewsInFlight = $this->countLowerStatus(EmployeeScorecard::query(), 'status', ['self_assessment_pending', 'self_assessment_submitted', 'manager_review_pending', 'manager_reviewed', 'hr_moderation_pending']);

        return $this->payload(
            $user,
            $variant,
            metrics: [
                $this->metric('employees', 'Employees', $employeeTotal, $activeEmployees.' active workforce records.', '/employees'),
                $this->metric('pending_leave', 'Pending leave', $pendingLeave, 'Leave requests currently awaiting decision.', '/leave-requests'),
                $this->metric('onboarding_risk', 'Lifecycle tasks at risk', $overdueOnboarding + $blockedOffboarding, 'Overdue onboarding and offboarding work that needs follow-through.', '/onboarding-tasks'),
                $this->metric('open_requisitions', 'Open requisitions', $openRequisitions, 'Approved or open requisitions ready for hiring action.', '/job-requisitions'),
                $this->metric('reviews_in_flight', 'Reviews in flight', $reviewsInFlight, 'Performance scorecards still moving through review.', '/employee-scorecards'),
                $this->metric('benefit_enrollments', 'Active benefits', EmployeeBenefitEnrollment::query()->where('status', 'active')->count(), 'Live enrollments currently administered by HR.', '/benefit-enrollments'),
            ],
            quickActions: array_values(array_filter([
                $this->actionIf($user, 'employees.create', 'add_employee', 'Add employee', 'Create a new employee profile and account.', '/employees/create', 'users'),
                $this->actionIf($user, 'leave.approve', 'leave_queue', 'Review leave queue', 'Clear pending leave requests and absence conflicts.', '/leave-requests', 'calendar-days'),
                $this->actionIf($user, 'onboarding.manage', 'onboarding', 'Manage onboarding', 'Open overdue onboarding tasks and owners.', '/onboarding-tasks', 'rocket'),
                $this->actionIf($user, 'requisitions.create', 'new_requisition', 'Create requisition', 'Open a new hiring requisition.', '/job-requisitions/create', 'briefcase'),
                $this->actionIf($user, 'reports.view', 'reports', 'Export reports', 'Open HR reports and exports.', '/reports', 'file-bar-chart'),
            ])),
            alerts: $this->filterAlerts([
                $pendingLeave > 0 ? $this->alert('leave_queue', 'warning', $pendingLeave.' leave approvals waiting', 'Managers and HR still need to clear leave requests.', '/leave-requests') : null,
                $overdueOnboarding > 0 ? $this->alert('onboarding_overdue', 'warning', $overdueOnboarding.' onboarding tasks overdue', 'New-hire readiness is at risk on overdue tasks.', '/onboarding-tasks') : null,
                $blockedOffboarding > 0 ? $this->alert('offboarding_overdue', 'info', $blockedOffboarding.' offboarding tasks blocked', 'Exit processes are delayed and should be cleared.', '/offboarding-tasks') : null,
            ]),
            focusCards: [
                $this->focusCard('headcount', 'Workforce coverage', 'Active employees versus all workforce records.', $activeEmployees, '/employees', 'users'),
                $this->focusCard('recruitment', 'Hiring pipeline', 'Approved requisitions and active candidates currently in funnel.', $openRequisitions + CandidateProfile::query()->count(), '/job-requisitions', 'briefcase'),
                $this->focusCard('performance', 'Performance follow-through', 'Scorecards and PIPs requiring HR oversight.', $reviewsInFlight + PerformanceImprovementPlan::query()->whereIn('status', ['active', 'at_risk'])->count(), '/employee-scorecards', 'target'),
            ],
            charts: [
                $this->breakdownChart('employee_status', 'Employee status', 'Distribution of employee statuses in the active tenant.', $this->countBy(Employee::query(), 'status')),
                $this->breakdownChart('leave_status', 'Leave request status', 'Current leave workload by decision stage.', $this->countBy(LeaveRequest::query(), 'status')),
                $this->breakdownChart('scorecards', 'Scorecard progression', 'How employee scorecards are currently distributed.', $this->countBy(EmployeeScorecard::query(), 'status')),
            ],
            lists: [
                $this->listBlock('recent_hires', 'Recent hires', 'Most recent additions to the workforce register.', Employee::query()->with(['orgUnit:id,name', 'position:id,name'])->whereNotNull('hire_date')->latest('hire_date')->limit(5)->get()->map(fn (Employee $employee) => $this->record($employee->full_name, $this->joinText([$employee->orgUnit?->name, $employee->position?->name]) ?: 'Employee record', 'Joined '.$employee->hire_date?->format('M j, Y'), '/employees/'.$employee->id, $this->humanize($employee->status)))->all()),
                $this->listBlock('leave_queue', 'Leave approval queue', 'Newest pending leave requests across the tenant.', LeaveRequest::query()->with('employee:id,first_name,surname')->whereIn(DB::raw('LOWER(status)'), ['pending', 'submitted'])->latest()->limit(5)->get()->map(fn (LeaveRequest $request) => $this->record($request->employee?->full_name ?? 'Employee', $this->humanize($request->leave_type), $request->start_date?->format('M j').' - '.$request->end_date?->format('M j, Y'), '/leave-requests/'.$request->id, $this->humanize($request->status)))->all()),
                $this->listBlock('requisitions', 'Open requisitions', 'Hiring requisitions that need progression or fill decisions.', JobRequisition::query()->latest()->limit(5)->get()->map(fn (JobRequisition $requisition) => $this->record($requisition->title, $this->joinText([$requisition->department, $requisition->hiring_manager]) ?: 'Requisition', $requisition->target_start_date ? 'Target '.$requisition->target_start_date->format('M j, Y') : 'No target start date', '/job-requisitions/'.$requisition->id, $this->humanize($requisition->status)))->all()),
            ],
            shortcuts: [
                $this->shortcut('employees', 'Employees', 'Maintain workforce records, reporting lines, and assignments.', '/employees', 'users', (string) $employeeTotal),
                $this->shortcut('leave', 'Leave requests', 'Monitor absence approvals, statuses, and patterns.', '/leave-requests', 'calendar-days', (string) LeaveRequest::query()->count()),
                $this->shortcut('onboarding', 'Onboarding', 'Track onboarding tasks, owners, and completion risk.', '/onboarding-tasks', 'rocket', (string) OnboardingTask::query()->count()),
                $this->shortcut('benefits', 'Benefits', 'Manage benefits catalog, enrollments, and reports.', '/benefits/dashboard', 'heart', (string) EmployeeBenefitEnrollment::query()->count()),
                $this->shortcut('performance', 'Performance', 'Drive review cycles, scorecards, and plans.', '/performance', 'target'),
            ],
        );
    }

    private function buildPayrollDashboard(User $user, string $variant): array
    {
        $openPeriods = PayrollPeriod::query()->whereNotIn(DB::raw('LOWER(status)'), ['closed', 'archived'])->count();
        $awaitingApproval = $this->countLowerStatus(PayrollPeriod::query(), 'status', ['processed', 'approval_pending']);
        $failedExports = $this->countLowerStatus(PayrollExport::query(), 'status', ['failed']);
        $pendingDeliveries = $this->countLowerStatus(PayslipDelivery::query(), 'status', ['pending']);
        $failedDeliveries = $this->countLowerStatus(PayslipDelivery::query(), 'status', ['failed']);
        $submittedTimesheets = $this->countLowerStatus(Timesheet::query(), 'status', ['submitted']);

        return $this->payload(
            $user,
            $variant,
            metrics: [
                $this->metric('payroll_periods', 'Open payroll periods', $openPeriods, 'Payroll periods still in processing or approval.', '/payroll'),
                $this->metric('payroll_approval', 'Awaiting approval', $awaitingApproval, 'Processed periods pending approval decisions.', '/payroll'),
                $this->metric('failed_exports', 'Failed exports', $failedExports, 'Export jobs that need retry or reconciliation.', '/payroll-exports'),
                $this->metric('pending_deliveries', 'Pending payslips', $pendingDeliveries, 'Payslip deliveries still queued for sending.', '/payslips'),
                $this->metric('delivery_failures', 'Delivery failures', $failedDeliveries, 'Email or SMS delivery failures requiring follow-up.', '/payslips'),
                $this->metric('timesheets', 'Submitted timesheets', $submittedTimesheets, 'Timesheet inputs still waiting to feed payroll.', '/timesheets'),
            ],
            quickActions: array_values(array_filter([
                $this->actionIf($user, 'payroll.process', 'process_payroll', 'Process payroll', 'Run the next payroll calculation cycle.', '/payroll', 'play'),
                $this->actionIf($user, 'payroll.approve', 'approve_payroll', 'Approve payroll', 'Review processed periods awaiting authorization.', '/payroll', 'badge-check'),
                $this->actionIf($user, 'payroll.export', 'exports', 'Open exports', 'Download or troubleshoot payroll outputs.', '/payroll-exports', 'download'),
                $this->actionIf($user, 'payslips.bulk_email', 'send_payslips', 'Send payslips', 'Launch bulk payslip delivery runs.', '/payslips', 'mail'),
                $this->actionIf($user, 'payroll.reports.view', 'reports', 'Payroll reports', 'Open payroll analytics and statutory views.', '/reports', 'file-bar-chart'),
            ])),
            alerts: $this->filterAlerts([
                $failedExports > 0 ? $this->alert('export_failures', 'critical', $failedExports.' failed payroll '.Str::plural('export', $failedExports), 'Export failures will block downstream bank or finance handoff.', '/payroll-exports') : null,
                $failedDeliveries > 0 ? $this->alert('delivery_failures', 'warning', $failedDeliveries.' failed payslip '.Str::plural('delivery', $failedDeliveries), 'Employees may not receive their payslips until failures are resolved.', '/payslips') : null,
                $awaitingApproval > 0 ? $this->alert('approval_wait', 'info', $awaitingApproval.' payroll period'.($awaitingApproval === 1 ? '' : 's').' awaiting approval', 'Processed payroll is ready for authorization and closure.', '/payroll') : null,
            ]),
            focusCards: [
                $this->focusCard('pay_cycle', 'Current cycle pressure', 'Open periods plus periods awaiting approval.', $openPeriods + $awaitingApproval, '/payroll', 'wallet'),
                $this->focusCard('delivery', 'Payslip operations', 'Pending and failed payslip deliveries.', $pendingDeliveries + $failedDeliveries, '/payslips', 'mail'),
                $this->focusCard('inputs', 'Input readiness', 'Submitted timesheets still feeding payroll.', $submittedTimesheets, '/timesheets', 'clock-3'),
            ],
            charts: [
                $this->breakdownChart('period_status', 'Payroll period status', 'How payroll periods are distributed by status.', $this->countBy(PayrollPeriod::query(), 'status')),
                $this->breakdownChart('export_status', 'Payroll export status', 'Current state of payroll output runs.', $this->countBy(PayrollExport::query(), 'status')),
                $this->breakdownChart('delivery_status', 'Payslip delivery status', 'Email and SMS delivery outcomes.', $this->countBy(PayslipDelivery::query(), 'status')),
            ],
            lists: [
                $this->listBlock('active_periods', 'Current payroll periods', 'The latest payroll periods still in flight.', PayrollPeriod::query()->latest('period_end')->limit(5)->get()->map(fn (PayrollPeriod $period) => $this->record($period->name ?: $period->code, $this->joinText([$period->frequency, $period->currency]) ?: 'Payroll period', $period->pay_date ? 'Pay date '.$period->pay_date->format('M j, Y') : 'No pay date set', '/payroll/periods/'.$period->id, $this->humanize($period->status)))->all()),
                $this->listBlock('export_queue', 'Export queue', 'Latest payroll export jobs and their outcomes.', PayrollExport::query()->latest('exported_at')->limit(5)->get()->map(fn (PayrollExport $export) => $this->record($export->export_type ?: 'Payroll export', $export->period?->name ?? 'Payroll period', $export->exported_at ? 'Exported '.$export->exported_at->format('M j, Y g:i A') : 'Pending export', '/payroll-exports/'.$export->id, $this->humanize($export->status)))->all()),
                $this->listBlock('delivery_queue', 'Payslip delivery queue', 'Most recent employee payslip delivery attempts.', PayslipDelivery::query()->with('employee:id,first_name,surname')->latest()->limit(5)->get()->map(fn (PayslipDelivery $delivery) => $this->record($delivery->employee?->full_name ?? $delivery->recipient, $delivery->channel, $delivery->sent_at ? 'Sent '.$delivery->sent_at->format('M j, Y g:i A') : 'Waiting to send', '/payslips', $this->humanize($delivery->status)))->all()),
            ],
            shortcuts: [
                $this->shortcut('payroll', 'Payroll control', 'Periods, runs, approvals, and cycle closure.', '/payroll', 'wallet', (string) PayrollPeriod::query()->count()),
                $this->shortcut('exports', 'Payroll exports', 'Bank files, journals, and downstream payroll outputs.', '/payroll-exports', 'download', (string) PayrollExport::query()->count()),
                $this->shortcut('payslips', 'Payslips', 'Employee payslip delivery and failure follow-up.', '/payslips', 'mail', (string) PayslipDelivery::query()->count()),
                $this->shortcut('timesheets', 'Timesheets', 'Submitted timesheets still impacting payroll input.', '/timesheets', 'clock-3', (string) Timesheet::query()->count()),
            ],
        );
    }

    private function buildManagerDashboard(User $user, string $variant): array
    {
        $employee = $this->employeeFor($user);
        $teamQuery = $this->teamQuery($user);
        $teamEmployeeIds = $teamQuery->pluck('id');
        $teamCount = $teamEmployeeIds->count();
        $pendingLeave = $teamCount > 0 ? LeaveRequest::query()->whereIn('employee_id', $teamEmployeeIds)->whereIn(DB::raw('LOWER(status)'), ['pending', 'submitted'])->count() : 0;
        $submittedTimesheets = $teamCount > 0 ? Timesheet::query()->whereIn('employee_id', $teamEmployeeIds)->whereIn(DB::raw('LOWER(status)'), ['submitted'])->count() : 0;
        $reviewQueue = $teamCount > 0 ? EmployeeScorecard::query()->whereIn('employee_id', $teamEmployeeIds)->whereIn(DB::raw('LOWER(status)'), ['manager_review_pending', 'self_assessment_submitted'])->count() : 0;
        $activePlans = $teamCount > 0 ? PerformanceImprovementPlan::query()->whereIn('employee_id', $teamEmployeeIds)->whereIn(DB::raw('LOWER(status)'), ['active', 'at_risk', 'on_track'])->count() : 0;
        $upcomingLeave = $teamCount > 0 ? LeaveRequest::query()->whereIn('employee_id', $teamEmployeeIds)->whereDate('start_date', '>=', today())->whereDate('start_date', '<=', today()->copy()->addDays(14))->count() : 0;

        return $this->payload(
            $user,
            $variant,
            metrics: [
                $this->metric('direct_reports', 'Direct reports', $teamCount, 'Employees reporting into this manager.', '/employees'),
                $this->metric('team_leave', 'Pending team leave', $pendingLeave, 'Leave decisions currently waiting on team action.', '/leave-requests'),
                $this->metric('team_timesheets', 'Submitted timesheets', $submittedTimesheets, 'Team timesheets still waiting for approval.', '/timesheets'),
                $this->metric('review_queue', 'Review queue', $reviewQueue, 'Scorecards now ready for manager review.', '/employee-scorecards'),
                $this->metric('improvement_plans', 'Improvement plans', $activePlans, 'Live PIPs under manager follow-through.', '/improvement-plans'),
                $this->metric('upcoming_absence', 'Upcoming absences', $upcomingLeave, 'Approved or pending leave in the next 14 days.', '/leave-requests'),
            ],
            quickActions: array_values(array_filter([
                $this->actionIf($user, 'leave.approve', 'approve_leave', 'Approve leave', 'Review leave requests from direct reports.', '/leave-requests', 'calendar-days'),
                $this->actionIf($user, 'timesheets.approve', 'approve_timesheets', 'Approve timesheets', 'Clear submitted team timesheets.', '/timesheets', 'clock-3'),
                $this->actionIf($user, 'performance.review', 'review_scorecards', 'Review scorecards', 'Complete pending scorecard reviews.', '/employee-scorecards', 'target'),
                $this->actionIf($user, 'requisitions.create', 'new_requisition', 'New requisition', 'Create a requisition for an open team role.', '/job-requisitions/create', 'briefcase'),
            ])),
            alerts: $this->filterAlerts([
                $reviewQueue > 0 ? $this->alert('review_queue', 'warning', $reviewQueue.' scorecard'.($reviewQueue === 1 ? '' : 's').' need review', 'Performance conversations are waiting on manager feedback.', '/employee-scorecards') : null,
                $pendingLeave > 0 ? $this->alert('leave_queue', 'info', $pendingLeave.' team leave request'.($pendingLeave === 1 ? '' : 's').' waiting', 'Upcoming absences should be reviewed and covered.', '/leave-requests') : null,
                $activePlans > 0 ? $this->alert('plan_watch', 'warning', $activePlans.' improvement plan'.($activePlans === 1 ? '' : 's').' active', 'Coaching and follow-up items remain open for direct reports.', '/improvement-plans') : null,
            ]),
            focusCards: [
                $this->focusCard('team', 'Team focus', 'Direct reports currently managed in this tenant.', $teamCount, '/employees', 'users'),
                $this->focusCard('approvals', 'Approval load', 'Combined leave and timesheet items awaiting review.', $pendingLeave + $submittedTimesheets, '/leave-requests', 'badge-check'),
                $this->focusCard('performance', 'Performance follow-up', 'Active scorecard reviews and live PIPs.', $reviewQueue + $activePlans, '/employee-scorecards', 'target'),
            ],
            charts: [
                $this->breakdownChart('team_leave_status', 'Team leave mix', 'Leave request status for direct reports.', $teamCount > 0 ? $this->countBy(LeaveRequest::query()->whereIn('employee_id', $teamEmployeeIds), 'status') : []),
                $this->breakdownChart('team_scorecards', 'Team scorecards', 'Scorecard status for direct reports.', $teamCount > 0 ? $this->countBy(EmployeeScorecard::query()->whereIn('employee_id', $teamEmployeeIds), 'status') : []),
                $this->breakdownChart('team_benefits', 'Team benefits', 'Benefit enrollment status across the team.', $teamCount > 0 ? $this->countBy(EmployeeBenefitEnrollment::query()->whereIn('employee_id', $teamEmployeeIds), 'status') : []),
            ],
            lists: [
                $this->listBlock('team_members', 'Direct reports', 'Current team members linked to this manager.', $teamQuery->with(['position:id,name', 'orgUnit:id,name'])->limit(6)->get()->map(fn (Employee $report) => $this->record($report->full_name, $this->joinText([$report->position?->name, $report->orgUnit?->name]) ?: 'Team member', $report->hire_date ? 'Joined '.$report->hire_date->format('M j, Y') : 'Employee record', '/employees/'.$report->id, $this->humanize($report->status)))->all()),
                $this->listBlock('team_leave_queue', 'Team leave queue', 'Newest leave requests from direct reports.', $teamCount > 0 ? LeaveRequest::query()->with('employee:id,first_name,surname')->whereIn('employee_id', $teamEmployeeIds)->latest()->limit(5)->get()->map(fn (LeaveRequest $request) => $this->record($request->employee?->full_name ?? 'Employee', $this->humanize($request->leave_type), $request->start_date?->format('M j').' - '.$request->end_date?->format('M j, Y'), '/leave-requests/'.$request->id, $this->humanize($request->status)))->all() : []),
                $this->listBlock('team_plans', 'Improvement plans', 'Current coaching or recovery plans in flight.', $teamCount > 0 ? PerformanceImprovementPlan::query()->with('employee:id,first_name,surname')->whereIn('employee_id', $teamEmployeeIds)->latest()->limit(5)->get()->map(fn (PerformanceImprovementPlan $plan) => $this->record($plan->title, $plan->employee?->full_name ?? 'Employee', $plan->end_date ? 'Ends '.$plan->end_date->format('M j, Y') : 'No target end date', '/improvement-plans/'.$plan->id, $this->humanize($plan->status)))->all() : []),
            ],
            shortcuts: [
                $this->shortcut('employees', 'My team', 'Direct reports, org placement, and employee profiles.', '/employees', 'users', (string) $teamCount),
                $this->shortcut('leave', 'Leave requests', 'Pending and upcoming leave across the team.', '/leave-requests', 'calendar-days', (string) $pendingLeave),
                $this->shortcut('timesheets', 'Timesheets', 'Approve submitted team timesheets.', '/timesheets', 'clock-3', (string) $submittedTimesheets),
                $this->shortcut('performance', 'Scorecards', 'Review employee scorecards and improvement plans.', '/employee-scorecards', 'target', (string) $reviewQueue),
            ],
            contextualName: $employee?->full_name,
        );
    }

    private function buildAuthoriserDashboard(User $user, string $variant): array
    {
        $pendingLeave = $this->countLowerStatus(LeaveRequest::query(), 'status', ['pending', 'submitted']);
        $submittedTimesheets = $this->countLowerStatus(Timesheet::query(), 'status', ['submitted']);
        $awaitingApproval = $this->countLowerStatus(PayrollPeriod::query(), 'status', ['processed', 'approval_pending']);
        $readyToClose = $this->countLowerStatus(PayrollPeriod::query(), 'status', ['approved']);
        $failedExports = $this->countLowerStatus(PayrollExport::query(), 'status', ['failed']);

        return $this->payload(
            $user,
            $variant,
            metrics: [
                $this->metric('pending_leave', 'Leave approvals', $pendingLeave, 'Leave requests still waiting on authorisation.', '/leave-requests'),
                $this->metric('submitted_timesheets', 'Submitted timesheets', $submittedTimesheets, 'Timesheets still waiting on decision.', '/timesheets'),
                $this->metric('payroll_approval', 'Payroll approval', $awaitingApproval, 'Processed payroll periods pending authorization.', '/payroll'),
                $this->metric('payroll_close', 'Ready to close', $readyToClose, 'Approved payroll periods ready for closure.', '/payroll'),
                $this->metric('export_failures', 'Export failures', $failedExports, 'Failed payroll outputs still open.', '/payroll-exports'),
                $this->metric('payslips', 'Payslip queue', PayslipDelivery::query()->where('status', PayslipDelivery::STATUS_PENDING)->count(), 'Pending payslip deliveries still in queue.', '/payslips'),
            ],
            quickActions: array_values(array_filter([
                $this->actionIf($user, 'leave.approve', 'leave_queue', 'Open leave queue', 'Authorize or reject pending leave requests.', '/leave-requests', 'calendar-days'),
                $this->actionIf($user, 'timesheets.approve', 'timesheet_queue', 'Open timesheets', 'Review submitted timesheets.', '/timesheets', 'clock-3'),
                $this->actionIf($user, 'payroll.approve', 'approve_payroll', 'Approve payroll', 'Authorize processed payroll periods.', '/payroll', 'badge-check'),
                $this->actionIf($user, 'payroll.close', 'close_payroll', 'Close payroll', 'Close approved payroll periods.', '/payroll', 'wallet'),
            ])),
            alerts: $this->filterAlerts([
                ($pendingLeave + $submittedTimesheets) > 0 ? $this->alert('approval_backlog', 'warning', ($pendingLeave + $submittedTimesheets).' approval items waiting', 'Operational approvals are accumulating and need decisions.', '/leave-requests') : null,
                $awaitingApproval > 0 ? $this->alert('payroll_authorise', 'info', $awaitingApproval.' payroll period'.($awaitingApproval === 1 ? '' : 's').' awaiting authorization', 'Processed payroll is ready for approval.', '/payroll') : null,
                $failedExports > 0 ? $this->alert('payroll_exports', 'critical', $failedExports.' failed export'.($failedExports === 1 ? '' : 's'), 'Failed payroll outputs need follow-up before completion.', '/payroll-exports') : null,
            ]),
            focusCards: [
                $this->focusCard('approvals', 'Approval backlog', 'Combined leave and timesheet decisions still pending.', $pendingLeave + $submittedTimesheets, '/leave-requests', 'badge-check'),
                $this->focusCard('payroll', 'Payroll authorization', 'Approval and close actions still outstanding.', $awaitingApproval + $readyToClose, '/payroll', 'wallet'),
                $this->focusCard('risk', 'Operational risk', 'Failed payroll exports requiring escalation.', $failedExports, '/payroll-exports', 'alert-triangle'),
            ],
            charts: [
                $this->breakdownChart('leave_status', 'Leave status', 'All leave requests by current status.', $this->countBy(LeaveRequest::query(), 'status')),
                $this->breakdownChart('timesheet_status', 'Timesheet status', 'Timesheet status distribution across the tenant.', $this->countBy(Timesheet::query(), 'status')),
                $this->breakdownChart('payroll_status', 'Payroll period status', 'Current payroll state from processed to closed.', $this->countBy(PayrollPeriod::query(), 'status')),
            ],
            lists: [
                $this->listBlock('leave_queue', 'Pending leave approvals', 'Newest leave requests awaiting action.', LeaveRequest::query()->with('employee:id,first_name,surname')->whereIn(DB::raw('LOWER(status)'), ['pending', 'submitted'])->latest()->limit(5)->get()->map(fn (LeaveRequest $request) => $this->record($request->employee?->full_name ?? 'Employee', $this->humanize($request->leave_type), $request->start_date?->format('M j').' - '.$request->end_date?->format('M j, Y'), '/leave-requests/'.$request->id, $this->humanize($request->status)))->all()),
                $this->listBlock('timesheet_queue', 'Submitted timesheets', 'Latest timesheets awaiting decision.', Timesheet::query()->with('employee:id,first_name,surname')->whereIn(DB::raw('LOWER(status)'), ['submitted'])->latest()->limit(5)->get()->map(fn (Timesheet $timesheet) => $this->record($timesheet->employee?->full_name ?? 'Employee', 'Timesheet submission', $timesheet->period_start?->format('M j').' - '.$timesheet->period_end?->format('M j, Y'), '/timesheets/'.$timesheet->id, $this->humanize($timesheet->status)))->all()),
                $this->listBlock('payroll_periods', 'Payroll approvals', 'Periods currently awaiting approval or closure.', PayrollPeriod::query()->latest('period_end')->limit(5)->get()->map(fn (PayrollPeriod $period) => $this->record($period->name ?: $period->code, $period->currency ?: 'Payroll period', $period->pay_date ? 'Pay date '.$period->pay_date->format('M j, Y') : 'No pay date set', '/payroll/periods/'.$period->id, $this->humanize($period->status)))->all()),
            ],
            shortcuts: [
                $this->shortcut('leave', 'Leave approvals', 'Triage pending leave decisions and upcoming absence impact.', '/leave-requests', 'calendar-days', (string) $pendingLeave),
                $this->shortcut('timesheets', 'Timesheets', 'Approve employee timesheets and overtime submissions.', '/timesheets', 'clock-3', (string) $submittedTimesheets),
                $this->shortcut('payroll', 'Payroll approval', 'Authorize or close payroll periods.', '/payroll', 'wallet', (string) ($awaitingApproval + $readyToClose)),
                $this->shortcut('reports', 'Reports', 'Open approval, payroll, and compliance reports.', '/reports', 'file-bar-chart'),
            ],
        );
    }

    private function buildEmployeeDashboard(User $user, string $variant): array
    {
        $employee = $this->employeeFor($user);
        $leaveQuery = $employee ? LeaveRequest::query()->where('employee_id', $employee->id) : LeaveRequest::query()->whereRaw('1 = 0');
        $timesheetQuery = $employee ? Timesheet::query()->where('employee_id', $employee->id) : Timesheet::query()->whereRaw('1 = 0');
        $scorecardQuery = $employee ? EmployeeScorecard::query()->where('employee_id', $employee->id) : EmployeeScorecard::query()->whereRaw('1 = 0');
        $benefitQuery = $employee ? EmployeeBenefitEnrollment::query()->where('employee_id', $employee->id) : EmployeeBenefitEnrollment::query()->whereRaw('1 = 0');
        $assetQuery = $employee ? AssetAssignment::query()->where('employee_id', $employee->id) : AssetAssignment::query()->whereRaw('1 = 0');
        $documentQuery = $employee ? Document::query()->where('owner_employee_id', $employee->id) : Document::query()->whereRaw('1 = 0');

        return $this->payload(
            $user,
            $variant,
            metrics: [
                $this->metric('my_leave', 'My leave requests', $leaveQuery->count(), 'Requests created from this employee account.', '/leave-requests'),
                $this->metric('pending_leave', 'Pending leave', $this->countLowerStatus($leaveQuery, 'status', ['pending', 'submitted']), 'Personal leave requests waiting for approval.', '/leave-requests'),
                $this->metric('timesheets', 'Timesheets', $timesheetQuery->count(), 'Recorded timesheets linked to this employee.', '/timesheets'),
                $this->metric('benefits', 'Active benefits', (clone $benefitQuery)->where('status', 'active')->count(), 'Benefits currently active for this employee.', '/benefits/dashboard'),
                $this->metric('scorecards', 'Scorecards', $scorecardQuery->count(), 'Performance scorecards assigned to this employee.', '/employee-scorecards'),
                $this->metric('assets', 'Assigned assets', (clone $assetQuery)->whereIn(DB::raw('LOWER(status)'), ['active', 'overdue'])->count(), 'Assets currently assigned and still active.', '/assets'),
            ],
            quickActions: array_values(array_filter([
                $this->actionIf($user, 'leave.create', 'new_leave', 'Request leave', 'Create a new leave request.', '/leave-requests/create', 'calendar-plus'),
                $this->actionIf($user, 'timesheets.create', 'new_timesheet', 'Create timesheet', 'Capture a new timesheet period.', '/timesheets/create', 'clock-3'),
                $this->actionIf($user, 'performance.self_assess', 'self_assess', 'Open scorecard', 'Complete your self-assessment or review goals.', '/employee-scorecards', 'target'),
                $this->actionIf($user, 'documents.view', 'documents', 'My documents', 'Open employee document records and expiry dates.', '/documents', 'file-text'),
            ])),
            alerts: $this->filterAlerts([
                (clone $scorecardQuery)->whereIn(DB::raw('LOWER(status)'), ['self_assessment_pending'])->exists() ? $this->alert('self_assessment', 'warning', 'Self-assessment pending', 'At least one scorecard is waiting for your self-assessment input.', '/employee-scorecards') : null,
                (clone $documentQuery)->whereDate('expiry_date', '<=', today()->copy()->addDays(30))->exists() ? $this->alert('document_expiry', 'info', 'Document expiry approaching', 'One or more personal documents are expiring soon.', '/documents') : null,
            ]),
            focusCards: [
                $this->focusCard('profile', 'Employee record', 'Personal employee profile and assignment data.', $employee?->staff_number ?? 'N/A', '/employees', 'user'),
                $this->focusCard('contracts', 'Current contract', 'Current employment contract on file.', $employee?->currentContract?->contract_number ?? 'Not linked', '/employee-contracts', 'file-text'),
                $this->focusCard('learning', 'Required learning', 'Courses currently marked as compliance-required.', LearningCourse::query()->where('compliance_required', true)->count(), '/learning-courses', 'book-open'),
            ],
            charts: [
                $this->breakdownChart('leave_status', 'My leave status', 'Personal leave requests by status.', $this->countBy($leaveQuery, 'status')),
                $this->breakdownChart('scorecard_status', 'My scorecards', 'Personal scorecards by current stage.', $this->countBy($scorecardQuery, 'status')),
                $this->breakdownChart('benefit_status', 'My benefits', 'Benefit enrollment status for this employee.', $this->countBy($benefitQuery, 'status')),
            ],
            lists: [
                $this->listBlock('recent_leave', 'Recent leave requests', 'Latest leave activity linked to this employee.', (clone $leaveQuery)->latest()->limit(5)->get()->map(fn (LeaveRequest $request) => $this->record($this->humanize($request->leave_type), $request->reason ?: 'Leave request', $request->start_date?->format('M j').' - '.$request->end_date?->format('M j, Y'), '/leave-requests/'.$request->id, $this->humanize($request->status)))->all()),
                $this->listBlock('recent_timesheets', 'Recent timesheets', 'Most recent timesheet submissions.', (clone $timesheetQuery)->latest()->limit(5)->get()->map(fn (Timesheet $timesheet) => $this->record('Timesheet period', $timesheet->total_minutes ? number_format($timesheet->total_minutes / 60, 1).' hours' : 'No hours recorded', $timesheet->period_start?->format('M j').' - '.$timesheet->period_end?->format('M j, Y'), '/timesheets/'.$timesheet->id, $this->humanize($timesheet->status)))->all()),
                $this->listBlock('documents', 'My documents', 'Document records assigned to this employee.', (clone $documentQuery)->latest()->limit(5)->get()->map(fn (Document $document) => $this->record($document->title ?: ($document->documentType?->name ?? 'Document'), $document->documentType?->name ?? 'Document record', $document->expiry_date ? 'Expires '.$document->expiry_date->format('M j, Y') : 'No expiry date', '/documents/'.$document->id, $this->humanize($document->access_policy)))->all()),
            ],
            shortcuts: [
                $this->shortcut('leave', 'Leave', 'Create requests and review leave history.', '/leave-requests', 'calendar-days', (string) (clone $leaveQuery)->count()),
                $this->shortcut('timesheets', 'Timesheets', 'Capture time and view submitted periods.', '/timesheets', 'clock-3', (string) (clone $timesheetQuery)->count()),
                $this->shortcut('benefits', 'Benefits', 'Open benefits enrollments and current plans.', '/benefits/dashboard', 'heart', (string) (clone $benefitQuery)->count()),
                $this->shortcut('performance', 'Performance', 'Self-assessment, scorecards, and reviews.', '/employee-scorecards', 'target', (string) (clone $scorecardQuery)->count()),
            ],
            contextualName: $employee?->full_name,
        );
    }

    private function buildAuditorDashboard(User $user, string $variant): array
    {
        $recentAudit = AuditLog::query()->latest('created_at');
        $documentsExpired = Document::query()->whereDate('expiry_date', '<', today())->count();
        $documentsSoon = Document::query()->whereDate('expiry_date', '>=', today())->whereDate('expiry_date', '<=', today()->copy()->addDays(30))->count();
        $failedExports = $this->countLowerStatus(PayrollExport::query(), 'status', ['failed']);

        return $this->payload(
            $user,
            $variant,
            metrics: [
                $this->metric('audit_events', 'Audit events', AuditLog::query()->count(), 'Logged audit entries in the current tenant.', '/audit-trail'),
                $this->metric('documents', 'Documents at risk', $documentsExpired + $documentsSoon, 'Expired or near-expiry document records.', '/documents'),
                $this->metric('failed_exports', 'Payroll exceptions', $failedExports, 'Failed payroll exports still present in the tenant.', '/payroll-exports'),
                $this->metric('users', 'Users with access', $this->visibleUsersQuery()->count(), 'User accounts that still have active system access.', '/users'),
                $this->metric('roles', 'Protected roles', Role::query()->count(), 'Defined RBAC roles across the platform.', '/roles'),
                $this->metric('reviews', 'Performance items', EmployeeScorecard::query()->count(), 'Scorecards currently stored in the tenant.', '/employee-scorecards'),
            ],
            quickActions: array_values(array_filter([
                $this->actionIf($user, 'audit.view', 'audit', 'Open audit trail', 'Inspect the full audit history.', '/audit-trail', 'history'),
                $this->actionIf($user, 'reports.view', 'reports', 'Reports centre', 'Open export-ready compliance and operations reports.', '/reports', 'file-bar-chart'),
                $this->actionIf($user, 'documents.view', 'documents', 'Document repository', 'Inspect sensitive and expiring documents.', '/documents', 'file-text'),
            ])),
            alerts: $this->filterAlerts([
                $documentsExpired > 0 ? $this->alert('document_expired', 'critical', $documentsExpired.' expired document '.Str::plural('record', $documentsExpired), 'Expired documents need immediate compliance review.', '/documents') : null,
                $failedExports > 0 ? $this->alert('export_failures', 'warning', $failedExports.' failed payroll '.Str::plural('export', $failedExports), 'Payroll exceptions remain unresolved.', '/payroll-exports') : null,
            ]),
            focusCards: [
                $this->focusCard('access', 'Access watch', 'Users and protected roles that shape platform access.', $this->visibleUsersQuery()->count() + Role::query()->count(), '/users', 'shield'),
                $this->focusCard('documents', 'Document governance', 'Document records already expired or expiring soon.', $documentsExpired + $documentsSoon, '/documents', 'file-text'),
                $this->focusCard('operations', 'Audit pressure', 'Recent audit events in the last seven days.', AuditLog::query()->where('created_at', '>=', now()->subDays(7))->count(), '/audit-trail', 'history'),
            ],
            charts: [
                $this->breakdownChart('audit_modules', 'Audit modules', 'Audit log distribution by module.', $this->countBy(AuditLog::query(), 'module')),
                $this->breakdownChart('role_mix', 'Role mix', 'Protected role assignments in the tenant.', $this->roleAssignmentCounts()),
                $this->breakdownChart('document_access', 'Document access', 'Document access policy distribution.', $this->countBy(Document::query(), 'access_policy')),
            ],
            lists: [
                $this->listBlock('recent_audit', 'Recent audit events', 'Most recent actions logged in the audit trail.', (clone $recentAudit)->limit(6)->get()->map(fn (AuditLog $log) => $this->record($log->auditable_label ?: Str::headline((string) $log->module), $this->humanize($log->event), $log->created_at?->format('M j, Y g:i A') ?: 'Audit event', '/audit-trail', $this->humanize($log->module)))->all()),
                $this->listBlock('expiring_documents', 'Document watch', 'Latest expired or near-expiry employee files.', Document::query()->with(['documentType:id,name', 'ownerEmployee:id,first_name,surname'])->whereNotNull('expiry_date')->orderBy('expiry_date')->limit(6)->get()->map(fn (Document $document) => $this->record($document->title ?: ($document->documentType?->name ?? 'Document'), $document->ownerEmployee?->full_name ?? 'Unmapped owner', 'Expiry '.$document->expiry_date?->format('M j, Y'), '/documents/'.$document->id, $document->isExpired() ? 'Expired' : 'Expiring'))->all()),
                $this->listBlock('payroll_exceptions', 'Payroll exceptions', 'Recent payroll exports with operational risk.', PayrollExport::query()->latest('exported_at')->limit(5)->get()->map(fn (PayrollExport $export) => $this->record($export->export_type ?: 'Payroll export', $export->period?->name ?? 'Payroll period', $export->exported_at ? 'Exported '.$export->exported_at->format('M j, Y g:i A') : 'Pending export', '/payroll-exports/'.$export->id, $this->humanize($export->status)))->all()),
            ],
            shortcuts: [
                $this->shortcut('audit', 'Audit trail', 'Investigate user activity and entity changes.', '/audit-trail', 'history'),
                $this->shortcut('documents', 'Documents', 'Inspect document controls and expiry risks.', '/documents', 'file-text', (string) Document::query()->count()),
                $this->shortcut('reports', 'Reports', 'Compliance exports across modules.', '/reports', 'file-bar-chart'),
                $this->shortcut('control_center', 'Control center', 'Inspect roles, permissions, and access matrix.', '/control-center', 'shield'),
            ],
        );
    }

    private function payload(
        User $user,
        string $variant,
        array $metrics,
        array $quickActions,
        array $alerts,
        array $focusCards,
        array $charts,
        array $lists,
        array $shortcuts,
        ?string $contextualName = null,
    ): array {
        return [
            'variant' => $variant,
            'generated_at' => now()->toIso8601String(),
            'profile' => [
                'title' => $this->resolver->title($variant),
                'description' => $this->resolver->description($variant),
                'role_labels' => $this->roleLabels($user),
                'contextual_name' => $contextualName,
            ],
            'metrics' => $metrics,
            'quick_actions' => $quickActions,
            'alerts' => $alerts === [] ? [$this->alert('stable', 'success', 'No urgent issues detected', 'The primary queues for this role are currently stable.', '/dashboard')] : $alerts,
            'focus_cards' => $focusCards,
            'charts' => $charts,
            'lists' => $lists,
            'shortcuts' => $shortcuts,
        ];
    }

    private function metric(string $key, string $label, int|string $value, string $helper, ?string $href = null, string $format = 'number'): array
    {
        return compact('key', 'label', 'value', 'helper', 'href', 'format');
    }

    private function action(string $key, string $label, string $description, string $href, string $icon): array
    {
        return compact('key', 'label', 'description', 'href', 'icon');
    }

    private function actionIf(User $user, string|array $permission, string $key, string $label, string $description, string $href, string $icon): ?array
    {
        return $user->canAccess($permission) ? $this->action($key, $label, $description, $href, $icon) : null;
    }

    private function alert(string $key, string $severity, string $title, string $description, string $href): array
    {
        return compact('key', 'severity', 'title', 'description', 'href');
    }

    private function focusCard(string $key, string $title, string $description, int|string $value, string $href, string $icon): array
    {
        return compact('key', 'title', 'description', 'value', 'href', 'icon');
    }

    private function breakdownChart(string $key, string $title, string $description, array $counts): array
    {
        return [
            'key' => $key,
            'title' => $title,
            'description' => $description,
            'type' => 'breakdown',
            'data' => $this->asBreakdown($counts),
        ];
    }

    private function trendChart(string $key, string $title, string $description, array $points): array
    {
        return [
            'key' => $key,
            'title' => $title,
            'description' => $description,
            'type' => 'trend',
            'data' => $points,
            'primary_label' => 'Events',
        ];
    }

    private function listBlock(string $key, string $title, string $description, array $items): array
    {
        return compact('key', 'title', 'description', 'items');
    }

    private function record(string $title, string $subtitle, string $meta, ?string $href = null, ?string $status = null): array
    {
        return compact('title', 'subtitle', 'meta', 'href', 'status');
    }

    private function shortcut(string $key, string $label, string $description, string $href, string $icon, ?string $stat = null): array
    {
        return compact('key', 'label', 'description', 'href', 'icon', 'stat');
    }

    private function crossOrg(callable $callback): array
    {
        return $this->tenantContext->withoutTenancy($callback);
    }

    private function employeeFor(User $user): ?Employee
    {
        return $user->employee()->with(['currentContract'])->first();
    }

    private function teamQuery(User $user): EloquentBuilder
    {
        $employee = $this->employeeFor($user);

        if (! $employee) {
            return Employee::query()->whereRaw('1 = 0');
        }

        return Employee::query()->where('manager_id', $employee->id);
    }

    private function visibleUsersQuery(): EloquentBuilder
    {
        $query = User::query();

        if ($this->tenantContext->isDisabled()) {
            return $query;
        }

        $tenantId = $this->tenantContext->id();

        if ($tenantId) {
            $query->whereHas('organizations', function ($membershipQuery) use ($tenantId): void {
                $membershipQuery
                    ->where('organizations.id', $tenantId)
                    ->where('organization_user.is_active', true);
            });

            return $query;
        }

        if ($this->tenantContext->shouldRestrictToNoResults()) {
            $query->whereRaw('1 = 0');
        }

        return $query;
    }

    private function effectiveRoleAssignmentsQuery(): QueryBuilder
    {
        $organizationId = $this->tenantContext->isDisabled() ? null : $this->tenantContext->id();

        if ($organizationId) {
            return DB::query()->fromSub(
                DB::table('role_users')
                    ->select(['role_id', 'user_id'])
                    ->whereIn('user_id', function ($query) use ($organizationId): void {
                        $query->select('user_id')
                            ->from('organization_user')
                            ->where('organization_id', $organizationId)
                            ->where('is_active', true);
                    })
                    ->union(
                        DB::table('organization_user_roles')
                            ->select(['role_id', 'user_id'])
                            ->where('organization_id', $organizationId)
                    ),
                'role_assignments'
            );
        }

        return DB::query()->fromSub(
            DB::table('role_users')->select(['role_id', 'user_id'])
                ->union(DB::table('organization_user_roles')->select(['role_id', 'user_id'])),
            'role_assignments'
        );
    }

    private function roleAssignmentCounts(): array
    {
        return $this->effectiveRoleAssignmentsQuery()
            ->join('roles', 'roles.id', '=', 'role_assignments.role_id')
            ->select('roles.name', DB::raw('count(distinct role_assignments.user_id) as total'))
            ->groupBy('roles.id', 'roles.name')
            ->orderByDesc('total')
            ->pluck('total', 'roles.name')
            ->map(fn ($value) => (int) $value)
            ->all();
    }

    private function roleLabels(User $user): array
    {
        return $user->effectiveRoles()
            ->pluck('name')
            ->filter()
            ->map(fn ($name) => (string) $name)
            ->unique()
            ->values()
            ->all();
    }

    private function countBy(EloquentBuilder $query, string $column): array
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

    private function countLowerStatus(EloquentBuilder $query, string $column, array $statuses): int
    {
        return (int) (clone $query)
            ->whereIn(DB::raw('LOWER('.$column.')'), collect($statuses)->map(fn ($status) => Str::lower((string) $status))->all())
            ->count();
    }

    private function asBreakdown(array $counts): array
    {
        $filtered = collect($counts)
            ->mapWithKeys(fn ($value, $label) => [(string) $label => (int) $value])
            ->filter(fn (int $value) => $value > 0)
            ->sortDesc();

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

    private function monthlyTrend(EloquentBuilder $query, string $column, int $months = 6): array
    {
        $monthsSeries = collect(range($months - 1, 0))
            ->map(fn (int $offset) => now()->copy()->startOfMonth()->subMonths($offset));

        $buckets = $monthsSeries->mapWithKeys(fn ($month) => [
            $month->format('Y-m') => ['label' => $month->format('M'), 'primary' => 0],
        ]);

        foreach ((clone $query)->whereNotNull($column)->pluck($column) as $date) {
            if (blank($date)) {
                continue;
            }

            $key = Carbon::parse($date)->format('Y-m');

            if (! $buckets->has($key)) {
                continue;
            }

            $bucket = $buckets->get($key);
            $bucket['primary']++;
            $buckets->put($key, $bucket);
        }

        return $buckets->values()->all();
    }

    private function filterAlerts(array $alerts): array
    {
        return array_values(array_filter($alerts));
    }

    private function humanize(?string $value): string
    {
        if (blank($value)) {
            return 'Not set';
        }

        $label = Str::of($value)->replace(['_', '-'], ' ')->lower()->title()->toString();

        return trim(str_replace(
            [' Hr ', ' Hr', 'Id ', ' Id', 'Rbac', 'Sla', 'Kpi'],
            [' HR ', ' HR', 'ID ', ' ID', 'RBAC', 'SLA', 'KPI'],
            ' '.$label.' '
        ));
    }

    private function joinText(array $parts): string
    {
        return implode(' · ', array_values(array_filter($parts, fn ($value) => filled($value))));
    }
}
