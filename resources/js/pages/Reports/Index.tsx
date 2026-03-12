import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import {
    Activity,
    AlertCircle,
    ArrowDownToLine,
    BarChart3,
    Briefcase,
    Calendar,
    ChevronDown,
    Download,
    FileSpreadsheet,
    FileText,
    Filter,
    LayoutGrid,
    LineChart,
    Plus,
    RotateCcw,
    Search,
    ShieldCheck,
    TrendingUp,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { API } from '@/config';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type GroupId =
    | 'workforce'
    | 'payroll'
    | 'recruitment'
    | 'lifecycle'
    | 'performance'
    | 'compliance';

type ReportFormat = 'xlsx' | 'csv' | 'ods';

type ReportDefinition = {
    id: string;
    group: GroupId;
    module:
        | 'employees'
        | 'leave_requests'
        | 'attendance_records'
        | 'timesheets'
        | 'payroll_exports'
        | 'job_requisitions'
        | 'candidate_profiles'
        | 'onboarding_tasks'
        | 'offboarding_tasks'
        | 'performance_reviews'
        | 'learning_courses'
        | 'workflow_definitions'
        | 'documents';
    title: string;
    description: string;
    category: string;
    route: string;
    formats: ReportFormat[];
    popularity: number;
    tags: string[];
};

type RecentExport = {
    id: string;
    name: string;
    generator: string;
    datetime: string;
    format: string;
    status: 'Completed' | 'Processing' | 'Failed';
    route: string;
};

type PageProps = {
    metrics?: Record<string, number>;
};

const REPORT_GROUPS: Array<{
    id: GroupId;
    name: string;
    icon: any;
}> = [
    { id: 'workforce', name: 'Workforce', icon: Users },
    { id: 'payroll', name: 'Payroll', icon: FileSpreadsheet },
    { id: 'recruitment', name: 'Recruitment', icon: Briefcase },
    { id: 'lifecycle', name: 'Employee Lifecycle', icon: Activity },
    { id: 'performance', name: 'Performance & Learning', icon: LineChart },
    { id: 'compliance', name: 'Compliance & Governance', icon: ShieldCheck },
];

const MODULE_META: Record<
    ReportDefinition['module'],
    {
        icon: any;
        iconColor: string;
        iconBg: string;
        category: string;
        label: string;
    }
> = {
    employees: {
        icon: Users,
        iconColor: 'text-indigo-600',
        iconBg: 'bg-indigo-100',
        category: 'CORE HR',
        label: 'Employees',
    },
    leave_requests: {
        icon: Calendar,
        iconColor: 'text-emerald-600',
        iconBg: 'bg-emerald-100',
        category: 'LEAVE',
        label: 'Leave Requests',
    },
    attendance_records: {
        icon: Activity,
        iconColor: 'text-amber-600',
        iconBg: 'bg-amber-100',
        category: 'ATTENDANCE',
        label: 'Attendance',
    },
    timesheets: {
        icon: FileSpreadsheet,
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-100',
        category: 'TIMESHEETS',
        label: 'Timesheets',
    },
    payroll_exports: {
        icon: BarChart3,
        iconColor: 'text-purple-600',
        iconBg: 'bg-purple-100',
        category: 'PAYROLL',
        label: 'Payroll Exports',
    },
    job_requisitions: {
        icon: Briefcase,
        iconColor: 'text-rose-600',
        iconBg: 'bg-rose-100',
        category: 'RECRUITMENT',
        label: 'Job Requisitions',
    },
    candidate_profiles: {
        icon: Users,
        iconColor: 'text-pink-600',
        iconBg: 'bg-pink-100',
        category: 'ATS',
        label: 'Candidate Profiles',
    },
    onboarding_tasks: {
        icon: Activity,
        iconColor: 'text-cyan-600',
        iconBg: 'bg-cyan-100',
        category: 'LIFECYCLE',
        label: 'Onboarding',
    },
    offboarding_tasks: {
        icon: RotateCcw,
        iconColor: 'text-orange-600',
        iconBg: 'bg-orange-100',
        category: 'LIFECYCLE',
        label: 'Offboarding',
    },
    performance_reviews: {
        icon: TrendingUp,
        iconColor: 'text-lime-600',
        iconBg: 'bg-lime-100',
        category: 'PERFORMANCE',
        label: 'Performance Reviews',
    },
    learning_courses: {
        icon: LineChart,
        iconColor: 'text-sky-600',
        iconBg: 'bg-sky-100',
        category: 'LEARNING',
        label: 'Learning Courses',
    },
    workflow_definitions: {
        icon: ShieldCheck,
        iconColor: 'text-violet-600',
        iconBg: 'bg-violet-100',
        category: 'WORKFLOW',
        label: 'Workflow Definitions',
    },
    documents: {
        icon: FileText,
        iconColor: 'text-slate-600',
        iconBg: 'bg-slate-100',
        category: 'DOCUMENTS',
        label: 'Documents',
    },
};

const report = (
    group: GroupId,
    module: ReportDefinition['module'],
    title: string,
    route: string,
    description: string,
    formats: ReportFormat[] = ['xlsx', 'csv', 'ods'],
    popularity = 50,
    tags: string[] = [],
): ReportDefinition => ({
    id: route.replace(/\//g, '-'),
    group,
    module,
    title,
    route,
    description,
    formats,
    popularity,
    tags,
    category: MODULE_META[module].category,
});

const ALL_REPORTS: ReportDefinition[] = [
    // Workforce - Employees
    report(
        'workforce',
        'employees',
        'Employee Master List',
        '/reports/employees/master-list',
        'Complete export of employee core profile data, identifiers, statuses, and placement information.',
        ['xlsx', 'csv', 'ods'],
        98,
        ['employees', 'master', 'directory'],
    ),
    report(
        'workforce',
        'employees',
        'Active vs Inactive Employees',
        '/reports/employees/active-inactive',
        'Count employees by active/inactive status for operational headcount review.',
        ['xlsx', 'csv', 'ods'],
        78,
        ['status', 'headcount'],
    ),
    report(
        'workforce',
        'employees',
        'Headcount by Department',
        '/reports/employees/headcount-by-department',
        'Summarize workforce size by organizational unit or department.',
        ['xlsx', 'csv', 'ods'],
        90,
        ['department', 'headcount'],
    ),
    report(
        'workforce',
        'employees',
        'Headcount by Location',
        '/reports/employees/headcount-by-location',
        'Group employees by work location for location-level workforce analysis.',
        ['xlsx', 'csv', 'ods'],
        76,
        ['location'],
    ),
    report(
        'workforce',
        'employees',
        'Headcount by Position',
        '/reports/employees/headcount-by-position',
        'Analyze total workforce by job or position assignment.',
        ['xlsx', 'csv', 'ods'],
        74,
        ['position'],
    ),
    report(
        'workforce',
        'employees',
        'Headcount by Manager',
        '/reports/employees/headcount-by-manager',
        'Review team size distribution by direct manager.',
        ['xlsx', 'csv', 'ods'],
        73,
        ['manager'],
    ),
    report(
        'workforce',
        'employees',
        'New Hires by Month',
        '/reports/employees/new-hires-by-month',
        'Monthly trend of employee onboarding or hiring growth.',
        ['xlsx', 'csv', 'ods'],
        86,
        ['hires', 'trend'],
    ),
    report(
        'workforce',
        'employees',
        'Terminations by Month',
        '/reports/employees/terminations-by-month',
        'Monthly trend of employee exits or terminations.',
        ['xlsx', 'csv', 'ods'],
        82,
        ['terminations', 'attrition'],
    ),
    report(
        'workforce',
        'employees',
        'Employee Tenure Report',
        '/reports/employees/tenure',
        'Calculate employee tenure in days and years from hire date.',
        ['xlsx', 'csv', 'ods'],
        80,
        ['tenure'],
    ),
    report(
        'workforce',
        'employees',
        'Employee Birthday Report',
        '/reports/employees/birthdays',
        'List employee birthdays for celebration, planning, or wellness initiatives.',
        ['xlsx', 'csv', 'ods'],
        60,
        ['birthdays'],
    ),
    report(
        'workforce',
        'employees',
        'Missing Profile Fields',
        '/reports/employees/missing-profile-fields',
        'Find employees with incomplete required profile information.',
        ['xlsx', 'csv', 'ods'],
        88,
        ['data quality', 'missing'],
    ),

    // Workforce - Leave
    report(
        'workforce',
        'leave_requests',
        'Leave Request Register',
        '/reports/leave-requests/register',
        'Complete export of leave transactions including employee, type, duration, status, and approver.',
        ['xlsx', 'csv', 'ods'],
        92,
        ['leave', 'register'],
    ),
    report(
        'workforce',
        'leave_requests',
        'Leave Requests by Status',
        '/reports/leave-requests/by-status',
        'Count leave requests by pending, approved, rejected, or other workflow status.',
        ['xlsx', 'csv', 'ods'],
        84,
        ['status'],
    ),
    report(
        'workforce',
        'leave_requests',
        'Leave Requests by Type',
        '/reports/leave-requests/by-type',
        'Summarize leave volume by leave category such as annual or sick leave.',
        ['xlsx', 'csv', 'ods'],
        83,
        ['type'],
    ),
    report(
        'workforce',
        'leave_requests',
        'Leave Requests by Employee',
        '/reports/leave-requests/by-employee',
        'Aggregate leave activity by employee.',
        ['xlsx', 'csv', 'ods'],
        75,
        ['employee'],
    ),
    report(
        'workforce',
        'leave_requests',
        'Leave Requests by Month',
        '/reports/leave-requests/by-month',
        'Trend report showing leave activity over time.',
        ['xlsx', 'csv', 'ods'],
        79,
        ['month', 'trend'],
    ),
    report(
        'workforce',
        'leave_requests',
        'Pending Leave Approvals',
        '/reports/leave-requests/pending-approvals',
        'Identify leave requests awaiting management or HR approval.',
        ['xlsx', 'csv', 'ods'],
        89,
        ['pending', 'approvals'],
    ),
    report(
        'workforce',
        'leave_requests',
        'Leave Duration Summary',
        '/reports/leave-requests/duration-summary',
        'Total leave days grouped by leave type.',
        ['xlsx', 'csv', 'ods'],
        77,
        ['days', 'summary'],
    ),

    // Workforce - Attendance
    report(
        'workforce',
        'attendance_records',
        'Attendance Register',
        '/reports/attendance-records/register',
        'Daily attendance export including employee, work date, time entries, minutes worked, and exceptions.',
        ['xlsx', 'csv', 'ods'],
        94,
        ['attendance', 'register'],
    ),
    report(
        'workforce',
        'attendance_records',
        'Attendance by Status',
        '/reports/attendance-records/by-status',
        'Count attendance records by exception status such as late, missing, or regular.',
        ['xlsx', 'csv', 'ods'],
        83,
        ['status'],
    ),
    report(
        'workforce',
        'attendance_records',
        'Attendance by Date',
        '/reports/attendance-records/by-date',
        'Daily trend of attendance records over time.',
        ['xlsx', 'csv', 'ods'],
        80,
        ['date', 'trend'],
    ),
    report(
        'workforce',
        'attendance_records',
        'Missing Clock-In Records',
        '/reports/attendance-records/missing-clock-in',
        'Find attendance records with missing clock-in values.',
        ['xlsx', 'csv', 'ods'],
        87,
        ['clock in', 'missing'],
    ),
    report(
        'workforce',
        'attendance_records',
        'Missing Clock-Out Records',
        '/reports/attendance-records/missing-clock-out',
        'Find attendance records with missing clock-out values.',
        ['xlsx', 'csv', 'ods'],
        91,
        ['clock out', 'missing'],
    ),
    report(
        'workforce',
        'attendance_records',
        'Late Arrivals',
        '/reports/attendance-records/late-arrivals',
        'Exception report focused on late arrival entries.',
        ['xlsx', 'csv', 'ods'],
        86,
        ['late'],
    ),
    report(
        'workforce',
        'attendance_records',
        'Attendance Exceptions',
        '/reports/attendance-records/exceptions',
        'Broad attendance exception report covering all flagged records.',
        ['xlsx', 'csv', 'ods'],
        88,
        ['exceptions'],
    ),

    // Payroll - Timesheets
    report(
        'payroll',
        'timesheets',
        'Timesheet Register',
        '/reports/timesheets/register',
        'Full payroll-ready export of timesheet records by employee and period.',
        ['xlsx', 'csv', 'ods'],
        96,
        ['timesheets', 'register'],
    ),
    report(
        'payroll',
        'timesheets',
        'Timesheets by Status',
        '/reports/timesheets/by-status',
        'Count timesheets by workflow status.',
        ['xlsx', 'csv', 'ods'],
        82,
        ['status'],
    ),
    report(
        'payroll',
        'timesheets',
        'Pending Timesheet Approvals',
        '/reports/timesheets/pending-approvals',
        'Find timesheets awaiting manager or payroll approval.',
        ['xlsx', 'csv', 'ods'],
        88,
        ['pending'],
    ),
    report(
        'payroll',
        'timesheets',
        'Overtime by Employee',
        '/reports/timesheets/overtime-by-employee',
        'Summarize overtime minutes grouped by employee.',
        ['xlsx', 'csv', 'ods'],
        93,
        ['overtime', 'employee'],
    ),
    report(
        'payroll',
        'timesheets',
        'Overtime Summary',
        '/reports/timesheets/overtime-summary',
        'Operational list of overtime-heavy timesheet records.',
        ['xlsx', 'csv', 'ods'],
        87,
        ['overtime'],
    ),
    report(
        'payroll',
        'timesheets',
        'Total Minutes by Period',
        '/reports/timesheets/total-minutes-by-period',
        'Aggregate total worked minutes by timesheet period.',
        ['xlsx', 'csv', 'ods'],
        81,
        ['minutes', 'period'],
    ),
    report(
        'payroll',
        'timesheets',
        'Exception Timesheets',
        '/reports/timesheets/exception-timesheets',
        'Identify rejected or exception-based timesheet records.',
        ['xlsx', 'csv', 'ods'],
        84,
        ['exceptions'],
    ),

    // Payroll - Payroll exports
    report(
        'payroll',
        'payroll_exports',
        'Payroll Export Register',
        '/reports/payroll-exports/register',
        'Full history of payroll export batches including period, version, status, and file reference.',
        ['xlsx', 'csv', 'ods'],
        90,
        ['payroll export', 'history'],
    ),
    report(
        'payroll',
        'payroll_exports',
        'Payroll Exports by Status',
        '/reports/payroll-exports/by-status',
        'Count payroll exports by completed, failed, or other statuses.',
        ['xlsx', 'csv', 'ods'],
        79,
        ['status'],
    ),
    report(
        'payroll',
        'payroll_exports',
        'Failed Payroll Exports',
        '/reports/payroll-exports/failed',
        'Audit failed payroll export attempts and related notes.',
        ['xlsx', 'csv', 'ods'],
        85,
        ['failed'],
    ),
    report(
        'payroll',
        'payroll_exports',
        'Completed Payroll Exports',
        '/reports/payroll-exports/completed',
        'Review successful payroll file generations.',
        ['xlsx', 'csv', 'ods'],
        77,
        ['completed'],
    ),
    report(
        'payroll',
        'payroll_exports',
        'Payroll Export Version History',
        '/reports/payroll-exports/version-history',
        'Track the frequency of payroll export versions.',
        ['xlsx', 'csv', 'ods'],
        75,
        ['version'],
    ),
    report(
        'payroll',
        'payroll_exports',
        'Payroll Exports by Period',
        '/reports/payroll-exports/by-period',
        'Timeline of payroll export activity by payroll period.',
        ['xlsx', 'csv', 'ods'],
        78,
        ['period'],
    ),

    // Recruitment - Job requisitions
    report(
        'recruitment',
        'job_requisitions',
        'Job Requisition Register',
        '/reports/job-requisitions/register',
        'Register of hiring requests with status, hiring manager, priority, and dates.',
        ['xlsx', 'csv', 'ods'],
        86,
        ['recruitment'],
    ),
    report(
        'recruitment',
        'job_requisitions',
        'Requisitions by Status',
        '/reports/job-requisitions/by-status',
        'Count requisitions by current hiring status.',
        ['xlsx', 'csv', 'ods'],
        75,
        ['status'],
    ),
    report(
        'recruitment',
        'job_requisitions',
        'Requisitions by Department',
        '/reports/job-requisitions/by-department',
        'Hiring demand grouped by department.',
        ['xlsx', 'csv', 'ods'],
        80,
        ['department'],
    ),
    report(
        'recruitment',
        'job_requisitions',
        'Requisitions by Hiring Manager',
        '/reports/job-requisitions/by-hiring-manager',
        'Summarize requisition ownership by hiring manager.',
        ['xlsx', 'csv', 'ods'],
        74,
        ['manager'],
    ),
    report(
        'recruitment',
        'job_requisitions',
        'Requisition Opening Trend',
        '/reports/job-requisitions/opening-trend',
        'Trend report showing requisition openings over time.',
        ['xlsx', 'csv', 'ods'],
        72,
        ['trend'],
    ),

    // Recruitment - Candidates
    report(
        'recruitment',
        'candidate_profiles',
        'Candidate Profile Register',
        '/reports/candidate-profiles/register',
        'Pipeline export of candidate applications, recruiters, stages, and outcomes.',
        ['xlsx', 'csv', 'ods'],
        88,
        ['candidates'],
    ),
    report(
        'recruitment',
        'candidate_profiles',
        'Candidates by Stage',
        '/reports/candidate-profiles/by-stage',
        'Summarize candidates by pipeline stage.',
        ['xlsx', 'csv', 'ods'],
        85,
        ['stage'],
    ),
    report(
        'recruitment',
        'candidate_profiles',
        'Candidates by Source',
        '/reports/candidate-profiles/by-source',
        'Track recruitment effectiveness by candidate source.',
        ['xlsx', 'csv', 'ods'],
        83,
        ['source'],
    ),
    report(
        'recruitment',
        'candidate_profiles',
        'Candidates by Requisition',
        '/reports/candidate-profiles/by-requisition',
        'Count candidates against each requisition.',
        ['xlsx', 'csv', 'ods'],
        80,
        ['requisition'],
    ),
    report(
        'recruitment',
        'candidate_profiles',
        'Hired Candidates',
        '/reports/candidate-profiles/hired',
        'List candidate records with hired status.',
        ['xlsx', 'csv', 'ods'],
        76,
        ['hired'],
    ),
    report(
        'recruitment',
        'candidate_profiles',
        'Rejected Candidates',
        '/reports/candidate-profiles/rejected',
        'List candidate records with rejected status.',
        ['xlsx', 'csv', 'ods'],
        78,
        ['rejected'],
    ),

    // Lifecycle - Onboarding
    report(
        'lifecycle',
        'onboarding_tasks',
        'Onboarding Task Register',
        '/reports/onboarding-tasks/register',
        'Complete checklist export for onboarding tasks and owners.',
        ['xlsx', 'csv', 'ods'],
        82,
        ['onboarding'],
    ),
    report(
        'lifecycle',
        'onboarding_tasks',
        'Onboarding Tasks by Status',
        '/reports/onboarding-tasks/by-status',
        'Count onboarding tasks by completion status.',
        ['xlsx', 'csv', 'ods'],
        73,
        ['status'],
    ),
    report(
        'lifecycle',
        'onboarding_tasks',
        'Onboarding Tasks by Employee',
        '/reports/onboarding-tasks/by-employee',
        'Summarize onboarding tasks by new hire.',
        ['xlsx', 'csv', 'ods'],
        72,
        ['employee'],
    ),
    report(
        'lifecycle',
        'onboarding_tasks',
        'Onboarding Tasks by Owner',
        '/reports/onboarding-tasks/by-owner',
        'Track onboarding workload by task owner.',
        ['xlsx', 'csv', 'ods'],
        70,
        ['owner'],
    ),
    report(
        'lifecycle',
        'onboarding_tasks',
        'Overdue Onboarding Tasks',
        '/reports/onboarding-tasks/overdue',
        'Find onboarding steps that are past due and not completed.',
        ['xlsx', 'csv', 'ods'],
        84,
        ['overdue'],
    ),

    // Lifecycle - Offboarding
    report(
        'lifecycle',
        'offboarding_tasks',
        'Offboarding Task Register',
        '/reports/offboarding-tasks/register',
        'Complete checklist export for offboarding tasks and owners.',
        ['xlsx', 'csv', 'ods'],
        79,
        ['offboarding'],
    ),
    report(
        'lifecycle',
        'offboarding_tasks',
        'Offboarding Tasks by Status',
        '/reports/offboarding-tasks/by-status',
        'Count offboarding tasks by completion status.',
        ['xlsx', 'csv', 'ods'],
        69,
        ['status'],
    ),
    report(
        'lifecycle',
        'offboarding_tasks',
        'Offboarding Tasks by Employee',
        '/reports/offboarding-tasks/by-employee',
        'Summarize offboarding workload by employee.',
        ['xlsx', 'csv', 'ods'],
        70,
        ['employee'],
    ),
    report(
        'lifecycle',
        'offboarding_tasks',
        'Offboarding Tasks by Owner',
        '/reports/offboarding-tasks/by-owner',
        'Track offboarding task ownership.',
        ['xlsx', 'csv', 'ods'],
        68,
        ['owner'],
    ),
    report(
        'lifecycle',
        'offboarding_tasks',
        'Overdue Offboarding Tasks',
        '/reports/offboarding-tasks/overdue',
        'Find incomplete offboarding steps past due date.',
        ['xlsx', 'csv', 'ods'],
        83,
        ['overdue'],
    ),

    // Performance & learning - reviews
    report(
        'performance',
        'performance_reviews',
        'Performance Review Register',
        '/reports/performance-reviews/register',
        'Full performance review export with cycle, reviewer, rating, and due dates.',
        ['xlsx', 'csv', 'ods'],
        84,
        ['performance'],
    ),
    report(
        'performance',
        'performance_reviews',
        'Performance Reviews by Status',
        '/reports/performance-reviews/by-status',
        'Count reviews by review workflow status.',
        ['xlsx', 'csv', 'ods'],
        72,
        ['status'],
    ),
    report(
        'performance',
        'performance_reviews',
        'Performance Reviews by Cycle',
        '/reports/performance-reviews/by-cycle',
        'Group reviews by performance cycle.',
        ['xlsx', 'csv', 'ods'],
        74,
        ['cycle'],
    ),
    report(
        'performance',
        'performance_reviews',
        'Performance Reviews by Reviewer',
        '/reports/performance-reviews/by-reviewer',
        'Summarize review assignments by reviewer.',
        ['xlsx', 'csv', 'ods'],
        71,
        ['reviewer'],
    ),
    report(
        'performance',
        'performance_reviews',
        'Performance Reviews by Rating',
        '/reports/performance-reviews/by-rating',
        'Distribution of review ratings.',
        ['xlsx', 'csv', 'ods'],
        76,
        ['rating'],
    ),
    report(
        'performance',
        'performance_reviews',
        'Overdue Performance Reviews',
        '/reports/performance-reviews/overdue',
        'Identify reviews that remain incomplete past due date.',
        ['xlsx', 'csv', 'ods'],
        85,
        ['overdue'],
    ),

    // Performance & learning - courses
    report(
        'performance',
        'learning_courses',
        'Learning Course Catalog',
        '/reports/learning-courses/catalog',
        'Full course catalog export with category, status, mandatory flag, and dates.',
        ['xlsx', 'csv', 'ods'],
        78,
        ['learning'],
    ),
    report(
        'performance',
        'learning_courses',
        'Learning Courses by Category',
        '/reports/learning-courses/by-category',
        'Summarize courses by category.',
        ['xlsx', 'csv', 'ods'],
        67,
        ['category'],
    ),
    report(
        'performance',
        'learning_courses',
        'Learning Courses by Status',
        '/reports/learning-courses/by-status',
        'Count courses by active/inactive or other status.',
        ['xlsx', 'csv', 'ods'],
        66,
        ['status'],
    ),
    report(
        'performance',
        'learning_courses',
        'Mandatory Learning Courses',
        '/reports/learning-courses/mandatory',
        'List mandatory courses for compliance and completion planning.',
        ['xlsx', 'csv', 'ods'],
        82,
        ['mandatory'],
    ),
    report(
        'performance',
        'learning_courses',
        'Expiring Learning Courses',
        '/reports/learning-courses/expiring',
        'Courses or certifications approaching expiry.',
        ['xlsx', 'csv', 'ods'],
        79,
        ['expiring'],
    ),
    report(
        'performance',
        'learning_courses',
        'Expired Learning Courses',
        '/reports/learning-courses/expired',
        'Expired courses or certifications requiring review.',
        ['xlsx', 'csv', 'ods'],
        81,
        ['expired'],
    ),

    // Compliance - workflows
    report(
        'compliance',
        'workflow_definitions',
        'Workflow Definition Register',
        '/reports/workflows/register',
        'Full register of workflow configurations and versions.',
        ['xlsx', 'csv', 'ods'],
        75,
        ['workflow'],
    ),
    report(
        'compliance',
        'workflow_definitions',
        'Workflows by Module',
        '/reports/workflows/by-module',
        'Count configured workflows by source module.',
        ['xlsx', 'csv', 'ods'],
        69,
        ['module'],
    ),
    report(
        'compliance',
        'workflow_definitions',
        'Workflows by Status',
        '/reports/workflows/by-status',
        'Count workflows by active or inactive status.',
        ['xlsx', 'csv', 'ods'],
        65,
        ['status'],
    ),
    report(
        'compliance',
        'workflow_definitions',
        'Workflows by Version',
        '/reports/workflows/by-version',
        'Review workflow version distribution.',
        ['xlsx', 'csv', 'ods'],
        63,
        ['version'],
    ),
    report(
        'compliance',
        'workflow_definitions',
        'Workflows by Owner',
        '/reports/workflows/by-owner',
        'Track workflow ownership and governance.',
        ['xlsx', 'csv', 'ods'],
        62,
        ['owner'],
    ),
    report(
        'compliance',
        'workflow_definitions',
        'Workflow Update Trend',
        '/reports/workflows/updated-trend',
        'Timeline of workflow changes and updates.',
        ['xlsx', 'csv', 'ods'],
        64,
        ['trend'],
    ),

    // Compliance - documents
    report(
        'compliance',
        'documents',
        'Document Register',
        '/reports/documents/register',
        'Document governance export covering issue dates, expiry, file references, and status.',
        ['xlsx', 'csv', 'ods'],
        87,
        ['documents'],
    ),
    report(
        'compliance',
        'documents',
        'Documents by Type',
        '/reports/documents/by-type',
        'Summarize documents by document type.',
        ['xlsx', 'csv', 'ods'],
        73,
        ['type'],
    ),
    report(
        'compliance',
        'documents',
        'Documents by Employee',
        '/reports/documents/by-employee',
        'Group managed documents by employee.',
        ['xlsx', 'csv', 'ods'],
        74,
        ['employee'],
    ),
    report(
        'compliance',
        'documents',
        'Expiring Documents',
        '/reports/documents/expiring',
        'Find documents approaching expiry dates.',
        ['xlsx', 'csv', 'ods'],
        90,
        ['expiring'],
    ),
    report(
        'compliance',
        'documents',
        'Expired Documents',
        '/reports/documents/expired',
        'Find expired documents requiring immediate compliance attention.',
        ['xlsx', 'csv', 'ods'],
        93,
        ['expired'],
    ),
    report(
        'compliance',
        'documents',
        'Missing File References',
        '/reports/documents/missing-file-reference',
        'Audit document records missing stored file references.',
        ['xlsx', 'csv', 'ods'],
        88,
        ['missing', 'file reference'],
    ),
];

const LOCAL_EXPORTS_KEY = 'hrms_reports_recent_exports';

export default function ReportsIndex() {
    const { metrics = {} } = usePage<PageProps>().props;

    const [search, setSearch] = useState('');
    const [activeGroup, setActiveGroup] = useState<GroupId>('workforce');
    const [sortBy, setSortBy] = useState('popularity');
    const [isGeneratePanelOpen, setIsGeneratePanelOpen] = useState(true);
    const [selectedReportId, setSelectedReportId] = useState<string | null>(
        null,
    );
    const [format, setFormat] = useState<ReportFormat>('xlsx');
    const [datePreset, setDatePreset] = useState('30days');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [department, setDepartment] = useState('all');
    const [keyword, setKeyword] = useState('');
    const [recentExports, setRecentExports] = useState<RecentExport[]>([]);
    const exportsRef = useRef<HTMLDivElement | null>(null);

    const groupCounts = useMemo(() => {
        return REPORT_GROUPS.reduce<Record<GroupId, number>>(
            (acc, group) => {
                acc[group.id] = ALL_REPORTS.filter(
                    (item) => item.group === group.id,
                ).length;
                return acc;
            },
            {} as Record<GroupId, number>,
        );
    }, []);

    const selectedReport = useMemo(
        () => ALL_REPORTS.find((item) => item.id === selectedReportId) ?? null,
        [selectedReportId],
    );

    useEffect(() => {
        try {
            const stored = localStorage.getItem(LOCAL_EXPORTS_KEY);
            if (stored) {
                setRecentExports(JSON.parse(stored));
            }
        } catch {
            setRecentExports([]);
        }
    }, []);

    useEffect(() => {
        const firstInGroup = ALL_REPORTS.find(
            (item) => item.group === activeGroup,
        );
        if (!selectedReportId && firstInGroup) {
            setSelectedReportId(firstInGroup.id);
            return;
        }

        const selectedStillVisible = ALL_REPORTS.some(
            (item) =>
                item.group === activeGroup && item.id === selectedReportId,
        );

        if (!selectedStillVisible && firstInGroup) {
            setSelectedReportId(firstInGroup.id);
        }
    }, [activeGroup, selectedReportId]);

    useEffect(() => {
        const now = new Date();
        let from = '';
        let to = '';

        if (datePreset === '7days') {
            const start = new Date(now);
            start.setDate(now.getDate() - 7);
            from = start.toISOString().slice(0, 10);
            to = now.toISOString().slice(0, 10);
        } else if (datePreset === '30days') {
            const start = new Date(now);
            start.setDate(now.getDate() - 30);
            from = start.toISOString().slice(0, 10);
            to = now.toISOString().slice(0, 10);
        } else if (datePreset === 'thisMonth') {
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            from = start.toISOString().slice(0, 10);
            to = now.toISOString().slice(0, 10);
        } else if (datePreset === 'lastMonth') {
            const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const end = new Date(now.getFullYear(), now.getMonth(), 0);
            from = start.toISOString().slice(0, 10);
            to = end.toISOString().slice(0, 10);
        }

        if (datePreset !== 'custom') {
            setDateFrom(from);
            setDateTo(to);
        }
    }, [datePreset]);

    useEffect(() => {
        if (selectedReport && !selectedReport.formats.includes(format)) {
            setFormat(selectedReport.formats[0]);
        }
    }, [selectedReport, format]);

    const filteredReports = useMemo(() => {
        const query = search.trim().toLowerCase();

        let items = ALL_REPORTS.filter((item) => item.group === activeGroup);

        if (query !== '') {
            items = items.filter((item) => {
                const haystack = [
                    item.title,
                    item.description,
                    item.module,
                    item.category,
                    ...item.tags,
                ]
                    .join(' ')
                    .toLowerCase();

                return haystack.includes(query);
            });
        }

        if (sortBy === 'title') {
            items = [...items].sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === 'module') {
            items = [...items].sort((a, b) =>
                MODULE_META[a.module].label.localeCompare(
                    MODULE_META[b.module].label,
                ),
            );
        } else {
            items = [...items].sort((a, b) => b.popularity - a.popularity);
        }

        return items;
    }, [activeGroup, search, sortBy]);

    const totalMonitoredRecords = useMemo(
        () =>
            Object.values(metrics).reduce(
                (sum, value) => sum + Number(value || 0),
                0,
            ),
        [metrics],
    );

    const latestExportText =
        recentExports.length > 0 ? recentExports[0].datetime : 'No exports yet';

    const getFormatBadgeColor = (value: string) => {
        switch (value.toUpperCase()) {
            case 'XLSX':
                return 'bg-emerald-100 text-emerald-800';
            case 'CSV':
                return 'bg-amber-100 text-amber-800';
            case 'ODS':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-muted text-muted-foreground';
        }
    };

    const getStatusDisplay = (status: string) => {
        if (status === 'Completed') {
            return (
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    {status}
                </div>
            );
        }

        if (status === 'Processing') {
            return (
                <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600" />
                    {status}
                </div>
            );
        }

        return (
            <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                <div className="h-1.5 w-1.5 rounded-full bg-destructive" />
                {status}
            </div>
        );
    };

    const buildReportUrl = (
        reportItem: ReportDefinition,
        reportFormat: ReportFormat,
    ) => {
        const params = new URLSearchParams();

        params.set('format', reportFormat);

        if (dateFrom) params.set('date_from', dateFrom);
        if (dateTo) params.set('date_to', dateTo);
        if (keyword.trim()) params.set('search', keyword.trim());
        if (department !== 'all') params.set('department', department);

        return `${API}${reportItem.route}?${params.toString()}`;
    };

    const persistRecentExports = (next: RecentExport[]) => {
        setRecentExports(next);
        try {
            localStorage.setItem(LOCAL_EXPORTS_KEY, JSON.stringify(next));
        } catch {
            // ignore
        }
    };

    const recordRecentExport = (
        reportItem: ReportDefinition,
        reportFormat: ReportFormat,
        status: RecentExport['status'] = 'Completed',
    ) => {
        const entry: RecentExport = {
            id: `${reportItem.id}-${Date.now()}`,
            name: reportItem.title,
            generator: 'Current User',
            datetime: new Date().toLocaleString(),
            format: reportFormat.toUpperCase(),
            status,
            route: reportItem.route,
        };

        const next = [entry, ...recentExports].slice(0, 12);
        persistRecentExports(next);
    };

    const handleGenerate = (
        reportItem?: ReportDefinition | null,
        forcedFormat?: ReportFormat,
    ) => {
        const target = reportItem ?? selectedReport;
        if (!target) return;

        const nextFormat = forcedFormat ?? format;
        const url = buildReportUrl(target, nextFormat);

        recordRecentExport(target, nextFormat, 'Completed');
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleRetry = (exportItem: RecentExport) => {
        const target = ALL_REPORTS.find(
            (item) => item.route === exportItem.route,
        );
        if (!target) return;
        setSelectedReportId(target.id);
        setActiveGroup(target.group);
        handleGenerate(
            target,
            (exportItem.format.toLowerCase() as ReportFormat) || 'xlsx',
        );
    };

    const handlePreview = (reportItem: ReportDefinition) => {
        setSelectedReportId(reportItem.id);
        setActiveGroup(reportItem.group);
        setIsGeneratePanelOpen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleExportCatalog = () => {
        const rows = [
            [
                'Group',
                'Module',
                'Title',
                'Category',
                'Route',
                'Formats',
                'Description',
            ],
            ...ALL_REPORTS.map((item) => [
                REPORT_GROUPS.find((group) => group.id === item.group)?.name ??
                    item.group,
                MODULE_META[item.module].label,
                item.title,
                item.category,
                item.route,
                item.formats.join(', ').toUpperCase(),
                item.description,
            ]),
        ];

        const csv = rows
            .map((row) =>
                row
                    .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
                    .join(','),
            )
            .join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'reports-catalog.csv';
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const selectedMeta = selectedReport
        ? MODULE_META[selectedReport.module]
        : null;

    return (
        <AppLayout
            breadcrumbs={[{ title: 'Reports Center', href: '/reports' }]}
        >
            <Head title="Reports Center" />

            <div className="min-h-[calc(100vh-64px)] w-full bg-muted/10 p-4 md:p-6 lg:p-8">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Reports Center
                        </h1>
                        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                            Access operational, compliance, payroll, workforce,
                            recruitment, learning, and audit reports across your
                            organization from one central export portal.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="font-semibold shadow-sm"
                            onClick={handleExportCatalog}
                        >
                            <ArrowDownToLine className="mr-2 h-4 w-4" />
                            Export Catalog
                        </Button>
                        <Button
                            className="bg-indigo-600 font-semibold text-white shadow-sm hover:bg-indigo-700"
                            onClick={() => setIsGeneratePanelOpen(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Create Custom Report
                        </Button>
                    </div>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Card className="shadow-sm">
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                <LayoutGrid className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                    Report Groups
                                </p>
                                <p className="text-2xl font-bold tracking-tight">
                                    {REPORT_GROUPS.length}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                    Available Reports
                                </p>
                                <p className="text-2xl font-bold tracking-tight">
                                    {ALL_REPORTS.length}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                                <AlertCircle className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                    Records Covered
                                </p>
                                <p className="text-2xl font-bold tracking-tight">
                                    {totalMonitoredRecords.toLocaleString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                <Calendar className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                    Latest Export
                                </p>
                                <p className="truncate text-base font-bold tracking-tight">
                                    {latestExportText}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="space-y-6 lg:col-span-3">
                        {isGeneratePanelOpen ? (
                            <Card className="relative overflow-hidden border-transparent bg-[#1e1e2d] text-white shadow-lg">
                                <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                                <CardHeader className="flex flex-row items-center justify-between pb-4">
                                    <CardTitle className="text-sm font-bold tracking-wider text-white/90 uppercase">
                                        Generate Report
                                    </CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-white/50 hover:bg-white/10 hover:text-white"
                                        onClick={() =>
                                            setIsGeneratePanelOpen(false)
                                        }
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </CardHeader>

                                <CardContent className="space-y-5">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold tracking-wider text-white/70 uppercase">
                                            Selected Report
                                        </Label>
                                        <Select
                                            value={
                                                selectedReportId ?? undefined
                                            }
                                            onValueChange={setSelectedReportId}
                                        >
                                            <SelectTrigger className="h-10 border-white/10 bg-[#2a2a3c] text-white">
                                                <SelectValue placeholder="Select a report" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ALL_REPORTS.map((item) => (
                                                    <SelectItem
                                                        key={item.id}
                                                        value={item.id}
                                                    >
                                                        {item.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {selectedReport && selectedMeta && (
                                        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                                            <div className="mb-2 flex items-center gap-3">
                                                <div
                                                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${selectedMeta.iconBg} ${selectedMeta.iconColor}`}
                                                >
                                                    <selectedMeta.icon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white">
                                                        {selectedReport.title}
                                                    </p>
                                                    <p className="text-xs text-white/60">
                                                        {selectedMeta.label}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-xs leading-relaxed text-white/70">
                                                {selectedReport.description}
                                            </p>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold tracking-wider text-white/70 uppercase">
                                            Date Range
                                        </Label>
                                        <Select
                                            value={datePreset}
                                            onValueChange={setDatePreset}
                                        >
                                            <SelectTrigger className="h-10 border-white/10 bg-[#2a2a3c] text-white">
                                                <SelectValue placeholder="Select Range" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="7days">
                                                    Last 7 Days
                                                </SelectItem>
                                                <SelectItem value="30days">
                                                    Last 30 Days
                                                </SelectItem>
                                                <SelectItem value="thisMonth">
                                                    This Month
                                                </SelectItem>
                                                <SelectItem value="lastMonth">
                                                    Last Month
                                                </SelectItem>
                                                <SelectItem value="custom">
                                                    Custom Range
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {datePreset === 'custom' && (
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-semibold tracking-wider text-white/70 uppercase">
                                                    From
                                                </Label>
                                                <Input
                                                    type="date"
                                                    value={dateFrom}
                                                    onChange={(e) =>
                                                        setDateFrom(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-10 border-white/10 bg-[#2a2a3c] text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-semibold tracking-wider text-white/70 uppercase">
                                                    To
                                                </Label>
                                                <Input
                                                    type="date"
                                                    value={dateTo}
                                                    onChange={(e) =>
                                                        setDateTo(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-10 border-white/10 bg-[#2a2a3c] text-white"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold tracking-wider text-white/70 uppercase">
                                            Department
                                        </Label>
                                        <Select
                                            value={department}
                                            onValueChange={setDepartment}
                                        >
                                            <SelectTrigger className="h-10 border-white/10 bg-[#2a2a3c] text-white">
                                                <SelectValue placeholder="Select Department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    All Departments
                                                </SelectItem>
                                                <SelectItem value="hr">
                                                    Human Resources
                                                </SelectItem>
                                                <SelectItem value="engineering">
                                                    Engineering
                                                </SelectItem>
                                                <SelectItem value="sales">
                                                    Sales
                                                </SelectItem>
                                                <SelectItem value="finance">
                                                    Finance
                                                </SelectItem>
                                                <SelectItem value="operations">
                                                    Operations
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold tracking-wider text-white/70 uppercase">
                                            Search Keyword
                                        </Label>
                                        <Input
                                            value={keyword}
                                            onChange={(e) =>
                                                setKeyword(e.target.value)
                                            }
                                            placeholder="Optional search filter"
                                            className="h-10 border-white/10 bg-[#2a2a3c] text-white placeholder:text-white/40"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold tracking-wider text-white/70 uppercase">
                                            Format
                                        </Label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {(
                                                [
                                                    'xlsx',
                                                    'csv',
                                                    'ods',
                                                ] as ReportFormat[]
                                            ).map((option) => {
                                                const supported =
                                                    selectedReport?.formats.includes(
                                                        option,
                                                    );
                                                return (
                                                    <Button
                                                        key={option}
                                                        type="button"
                                                        variant={
                                                            format === option
                                                                ? 'default'
                                                                : 'outline'
                                                        }
                                                        disabled={!supported}
                                                        onClick={() =>
                                                            setFormat(option)
                                                        }
                                                        className={
                                                            format === option
                                                                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                                : 'border-white/10 bg-[#2a2a3c] text-white hover:bg-white/10'
                                                        }
                                                    >
                                                        {option.toUpperCase()}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <Button
                                        className="mt-2 h-11 w-full bg-indigo-500 font-bold hover:bg-indigo-600"
                                        onClick={() => handleGenerate()}
                                        disabled={!selectedReport}
                                    >
                                        Process Report
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="shadow-sm">
                                <CardContent className="p-6">
                                    <p className="mb-3 text-sm font-semibold text-foreground">
                                        Report generator hidden
                                    </p>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() =>
                                            setIsGeneratePanelOpen(true)
                                        }
                                    >
                                        Open Generate Panel
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        <Card className="shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-bold">
                                    Active Group Snapshot
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Current Group
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-foreground">
                                        {
                                            REPORT_GROUPS.find(
                                                (group) =>
                                                    group.id === activeGroup,
                                            )?.name
                                        }
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Available Reports
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-foreground">
                                        {groupCounts[activeGroup]}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Selected Format
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-foreground uppercase">
                                        {format}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-8 lg:col-span-9">
                        <Card className="shadow-sm">
                            <CardContent className="p-4">
                                <Tabs
                                    value={activeGroup}
                                    onValueChange={(value) =>
                                        setActiveGroup(value as GroupId)
                                    }
                                >
                                    <TabsList className="grid h-auto w-full grid-cols-2 gap-2 bg-transparent p-0 md:grid-cols-3 xl:grid-cols-6">
                                        {REPORT_GROUPS.map((group) => (
                                            <TabsTrigger
                                                key={group.id}
                                                value={group.id}
                                                className="h-auto rounded-lg border border-border bg-background px-3 py-3 data-[state=active]:border-indigo-200 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <group.icon className="h-4 w-4" />
                                                    <div className="text-left">
                                                        <div className="text-sm font-semibold">
                                                            {group.name}
                                                        </div>
                                                        <div className="text-[11px] text-muted-foreground">
                                                            {
                                                                groupCounts[
                                                                    group.id
                                                                ]
                                                            }{' '}
                                                            reports
                                                        </div>
                                                    </div>
                                                </div>
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </Tabs>
                            </CardContent>
                        </Card>

                        <div className="flex flex-col items-center gap-3 sm:flex-row">
                            <div className="relative w-full flex-1">
                                <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search catalog for reports, keywords, or tags..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-12 border-border bg-card pl-10 text-base shadow-sm"
                                />
                            </div>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="h-12 w-full bg-card shadow-sm sm:w-[180px]">
                                    <SelectValue placeholder="Sort" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="popularity">
                                        Sort: Popularity
                                    </SelectItem>
                                    <SelectItem value="title">
                                        Sort: Title
                                    </SelectItem>
                                    <SelectItem value="module">
                                        Sort: Module
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                className="h-12 bg-card px-4 font-medium whitespace-nowrap shadow-sm"
                                onClick={() =>
                                    setIsGeneratePanelOpen((prev) => !prev)
                                }
                            >
                                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                                {isGeneratePanelOpen
                                    ? 'Hide Generator'
                                    : 'Show Generator'}
                            </Button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-foreground">
                                    {
                                        REPORT_GROUPS.find(
                                            (group) => group.id === activeGroup,
                                        )?.name
                                    }{' '}
                                    Reports
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {filteredReports.length} matching reports
                                    available in this group.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {filteredReports.map((reportItem) => {
                                const meta = MODULE_META[reportItem.module];
                                const isSelected =
                                    selectedReportId === reportItem.id;

                                return (
                                    <Card
                                        key={reportItem.id}
                                        className={`flex flex-col border-border shadow-sm transition-colors hover:border-primary/30 ${
                                            isSelected
                                                ? 'border-indigo-200 ring-1 ring-indigo-200'
                                                : ''
                                        }`}
                                    >
                                        <CardContent className="flex flex-1 flex-col p-6">
                                            <div className="mb-4 flex items-start justify-between">
                                                <div
                                                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${meta.iconBg} ${meta.iconColor}`}
                                                >
                                                    <meta.icon className="h-6 w-6" />
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-muted text-[10px] font-bold tracking-widest text-muted-foreground shadow-none"
                                                    >
                                                        {reportItem.category}
                                                    </Badge>
                                                    <Badge
                                                        variant="outline"
                                                        className="text-[10px] font-semibold"
                                                    >
                                                        {meta.label}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <h3 className="mb-2 line-clamp-1 text-lg font-bold text-foreground">
                                                {reportItem.title}
                                            </h3>

                                            <p className="mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                                                {reportItem.description}
                                            </p>

                                            <div className="mb-4 flex flex-wrap items-center gap-2">
                                                {reportItem.formats.map(
                                                    (itemFormat) => (
                                                        <Badge
                                                            key={itemFormat}
                                                            className={`border-transparent px-2 py-0.5 text-[10px] font-bold uppercase shadow-none ${getFormatBadgeColor(
                                                                itemFormat,
                                                            )}`}
                                                        >
                                                            {itemFormat}
                                                        </Badge>
                                                    ),
                                                )}
                                            </div>

                                            <div className="mb-6 flex flex-wrap gap-2">
                                                {reportItem.tags
                                                    .slice(0, 3)
                                                    .map((tag) => (
                                                        <Badge
                                                            key={tag}
                                                            variant="outline"
                                                            className="text-[10px]"
                                                        >
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                            </div>

                                            <div className="mt-auto border-t border-border/50 pt-4">
                                                <div className="flex items-center gap-3">
                                                    <Button
                                                        className="flex-1 bg-indigo-600 font-semibold text-white shadow-sm hover:bg-indigo-700"
                                                        onClick={() => {
                                                            setSelectedReportId(
                                                                reportItem.id,
                                                            );
                                                            handleGenerate(
                                                                reportItem,
                                                            );
                                                        }}
                                                    >
                                                        Generate Report
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="flex-1 font-semibold shadow-sm"
                                                        onClick={() =>
                                                            handlePreview(
                                                                reportItem,
                                                            )
                                                        }
                                                    >
                                                        Preview
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {filteredReports.length === 0 && (
                            <Card className="shadow-sm">
                                <CardContent className="flex h-32 items-center justify-center text-muted-foreground">
                                    No reports match your current search in this
                                    group.
                                </CardContent>
                            </Card>
                        )}

                        <div ref={exportsRef}>
                            <Card className="border-border shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-lg font-bold">
                                        Recent Exports
                                    </CardTitle>
                                    <Button
                                        variant="link"
                                        className="px-0 font-semibold text-indigo-600"
                                        onClick={() => {
                                            if (recentExports.length === 0)
                                                return;
                                            persistRecentExports([]);
                                        }}
                                    >
                                        {recentExports.length > 0
                                            ? 'Clear History'
                                            : 'No History Yet'}
                                    </Button>
                                </CardHeader>

                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                                                <TableHead className="h-10 pl-6 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    Report Name
                                                </TableHead>
                                                <TableHead className="h-10 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    Generated By
                                                </TableHead>
                                                <TableHead className="h-10 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    Date/Time
                                                </TableHead>
                                                <TableHead className="h-10 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    Format
                                                </TableHead>
                                                <TableHead className="h-10 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    Status
                                                </TableHead>
                                                <TableHead className="h-10 pr-6 text-right text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    Action
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {recentExports.length === 0 ? (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={6}
                                                        className="h-24 text-center text-muted-foreground"
                                                    >
                                                        No exports generated
                                                        from this portal yet.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                recentExports.map(
                                                    (exportItem) => (
                                                        <TableRow
                                                            key={exportItem.id}
                                                            className="hover:bg-muted/20"
                                                        >
                                                            <TableCell className="py-4 pl-6 text-sm font-semibold text-foreground">
                                                                {
                                                                    exportItem.name
                                                                }
                                                            </TableCell>
                                                            <TableCell className="text-sm font-medium text-muted-foreground">
                                                                {
                                                                    exportItem.generator
                                                                }
                                                            </TableCell>
                                                            <TableCell className="text-sm font-medium text-muted-foreground">
                                                                {
                                                                    exportItem.datetime
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    className={`border-transparent px-2 py-0.5 text-[10px] font-bold shadow-none ${getFormatBadgeColor(
                                                                        exportItem.format,
                                                                    )}`}
                                                                >
                                                                    {
                                                                        exportItem.format
                                                                    }
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                {getStatusDisplay(
                                                                    exportItem.status,
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="pr-6 text-right">
                                                                {exportItem.status ===
                                                                'Failed' ? (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                                                                        onClick={() =>
                                                                            handleRetry(
                                                                                exportItem,
                                                                            )
                                                                        }
                                                                    >
                                                                        <RotateCcw className="h-4 w-4" />
                                                                    </Button>
                                                                ) : (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                                                                        onClick={() =>
                                                                            handleRetry(
                                                                                exportItem,
                                                                            )
                                                                        }
                                                                    >
                                                                        <Download className="h-4 w-4" />
                                                                    </Button>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ),
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
