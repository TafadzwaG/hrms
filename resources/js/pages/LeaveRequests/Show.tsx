import { API } from '@/config';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    Calendar,
    Check,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    Eye,
    FileText,
    Info,
    MessageSquare,
    PieChart,
    ThumbsUp,
    X,
} from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';

type Employee = {
    id?: number;
    staff_number?: string;
    first_name?: string;
    middle_name?: string;
    surname?: string;
    full_name?: string;
    hire_date?: string;
    position?: {
        id?: number;
        name?: string;
        title?: string;
    } | null;
    org_unit?: {
        id?: number;
        name?: string;
    } | null;
    manager?: {
        id?: number;
        full_name?: string;
        first_name?: string;
        surname?: string;
    } | null;
};

type LeaveRequestRecord = {
    id: number;
    status?: string;
    leave_type?: string;
    start_date?: string;
    end_date?: string;
    days?: number;
    reason?: string;
    approver_name?: string;
    created_at?: string;
    updated_at?: string;
    employee?: Employee | null;
};

type LeaveBalanceBlock = {
    total: number;
    taken: number;
    remaining: number;
};

type LeaveBalances = {
    current: {
        type: string;
        total: number;
        taken: number;
        remaining: number;
        requested: number;
        remaining_after_request: number;
        progress: number;
    };
    annual: LeaveBalanceBlock;
    sick: LeaveBalanceBlock;
    compensatory: LeaveBalanceBlock;
};

type TeamDay = {
    date: string;
    label: string;
    is_focus: boolean;
    is_weekend: boolean;
};

type TeamCell = {
    type: 'leave' | 'sick' | 'available' | 'weekend';
    value: string;
};

type TeamMember = {
    name: string;
    role: string;
    is_applicant: boolean;
    cells: TeamCell[];
};

type TeamAvailability = {
    days: TeamDay[];
    members: TeamMember[];
};

type AuditTrailItem = {
    type: 'created' | 'viewed' | 'approved' | 'rejected' | 'pending';
    title: string;
    time?: string | null;
    note?: string | null;
};

type SystemCheckItem = {
    type: 'success' | 'warning' | 'info';
    message: string;
};

type UsageStats = {
    total_leaves_taken: number;
    average_lead_time: number;
    unplanned_ratio: number;
    unplanned_ratio_label: string;
    chart_points: number[];
};

type RecentHistoryItem = {
    id: number;
    leave_type: string;
    days: number;
    status: string;
    start_date?: string | null;
    end_date?: string | null;
};

type PageProps = {
    module: {
        slug: string;
        name: string;
    };
    record: LeaveRequestRecord;
    requestCode: string;
    leaveBalances: LeaveBalances;
    systemChecks: SystemCheckItem[];
    teamAvailability: TeamAvailability;
    auditTrail: AuditTrailItem[];
    usageStats: UsageStats;
    recentHistory: RecentHistoryItem[];
    savedNote?: string;
};

export default function LeaveRequestShow() {
    const {
        module,
        record,
        requestCode,
        leaveBalances,
        systemChecks,
        teamAvailability,
        auditTrail,
        usageStats,
        recentHistory,
        savedNote,
    } = usePage<PageProps>().props;

    const [note, setNote] = useState(savedNote ?? '');
    const [notifyManager, setNotifyManager] = useState(false);

    const employee = record?.employee;

    const employeeName =
        employee?.full_name ||
        [employee?.first_name, employee?.middle_name, employee?.surname]
            .filter(Boolean)
            .join(' ') ||
        'Unknown Employee';

    const employeeRole =
        employee?.position?.name || employee?.position?.title || 'Staff';

    const employeeDepartment =
        employee?.org_unit?.name || 'Unassigned Department';

    const managerName =
        employee?.manager?.full_name ||
        [employee?.manager?.first_name, employee?.manager?.surname]
            .filter(Boolean)
            .join(' ') ||
        'Not Assigned';

    const requestStatus = record?.status || 'Pending';
    const requestedDays = Number(
        record?.days ?? leaveBalances?.current?.requested ?? 0,
    );

    const getStatusBadgeClass = (status: string) => {
        const normalized = status.toLowerCase();

        if (normalized.includes('approve')) {
            return 'border-emerald-200 bg-emerald-100 text-emerald-800';
        }

        if (normalized.includes('reject')) {
            return 'border-rose-200 bg-rose-100 text-rose-800';
        }

        if (normalized.includes('change')) {
            return 'border-blue-200 bg-blue-100 text-blue-800';
        }

        return 'border-amber-200 bg-amber-100 text-amber-800';
    };

    const formatDate = (value?: string | null, fmt = 'MMM DD, YYYY') => {
        if (!value) return 'N/A';
        return moment(value).format(fmt);
    };

    const formatDateTime = (value?: string | null) => {
        if (!value) return 'Pending';
        return moment(value).format('MMM DD, YYYY [at] hh:mm A');
    };

    const getInitials = (name: string) => {
        if (!name) return 'U';

        return name
            .split(' ')
            .filter(Boolean)
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();
    };

    const getAuditIcon = (type: AuditTrailItem['type']) => {
        if (type === 'created') return <FileText className="h-4 w-4" />;
        if (type === 'viewed') return <Eye className="h-4 w-4" />;
        if (type === 'approved') return <ThumbsUp className="h-4 w-4" />;
        if (type === 'rejected') return <X className="h-4 w-4" />;
        return <Clock className="h-4 w-4" />;
    };

    const getAuditIconClass = (type: AuditTrailItem['type']) => {
        if (type === 'created') {
            return 'border-primary text-primary';
        }

        if (type === 'viewed') {
            return 'border-muted-foreground text-muted-foreground';
        }

        if (type === 'approved') {
            return 'border-emerald-500 text-emerald-500';
        }

        if (type === 'rejected') {
            return 'border-rose-500 text-rose-500';
        }

        return 'border-dashed border-muted-foreground text-muted-foreground';
    };

    const getSystemCheckIcon = (type: SystemCheckItem['type']) => {
        if (type === 'success') {
            return (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            );
        }

        if (type === 'warning') {
            return (
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            );
        }

        return <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />;
    };

    const handleAction = (
        actionType: 'approve' | 'deny' | 'request_changes',
    ) => {
        const routeMap = {
            approve: `${API}/${module.slug}/${record.id}/approve`,
            deny: `${API}/${module.slug}/${record.id}/deny`,
            request_changes: `${API}/${module.slug}/${record.id}/request-changes`,
        };

        router.post(routeMap[actionType], { note }, { preserveScroll: true });
    };

    const handleSaveNote = () => {
        router.post(
            `${API}/${module.slug}/${record.id}/notes`,
            {
                note,
                notify_manager: notifyManager,
            },
            { preserveScroll: true },
        );
    };

    const chartPoints = usageStats?.chart_points?.length
        ? usageStats.chart_points
        : [5, 10, 12, 8, 16, 22, 18, 25];

    const chartPath = chartPoints
        .map((point, index) => {
            const x =
                chartPoints.length === 1
                    ? 0
                    : (index / (chartPoints.length - 1)) * 100;
            const max = Math.max(...chartPoints, 1);
            const y = 40 - (point / max) * 35;

            return `${index === 0 ? 'M' : 'L'}${x},${y}`;
        })
        .join(' ');

    const chartAreaPath = `${chartPath} L100,40 L0,40 Z`;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Leave Management', href: `${API}/${module.slug}` },
                {
                    title: requestCode,
                    href: `${API}/${module.slug}/${record?.id}`,
                },
            ]}
        >
            <Head title={`Request: ${requestCode}`} />

            <div className="min-h-screen w-full space-y-6 bg-muted/20 p-4 text-foreground md:p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-foreground">
                            Request: {requestCode}
                        </h1>

                        <Badge
                            variant="outline"
                            className={getStatusBadgeClass(requestStatus)}
                        >
                            {requestStatus}
                        </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            variant="outline"
                            className="bg-background text-foreground hover:bg-muted"
                            onClick={() => handleAction('deny')}
                        >
                            <X className="mr-2 h-4 w-4" />
                            Deny
                        </Button>

                        <Button
                            variant="outline"
                            className="bg-background text-foreground hover:bg-muted"
                            onClick={() => handleAction('request_changes')}
                        >
                            <Clock className="mr-2 h-4 w-4" />
                            Request Changes
                        </Button>

                        <Button
                            className="bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                            onClick={() => handleAction('approve')}
                        >
                            <Check className="mr-2 h-4 w-4" />
                            Approve Request
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <div className="flex flex-col gap-6 lg:col-span-4 xl:col-span-3">
                        <Card className="shadow-sm">
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted font-bold text-muted-foreground">
                                            {getInitials(employeeName)}
                                        </div>

                                        <div>
                                            <h3 className="text-base font-bold">
                                                {employeeName}
                                            </h3>
                                            <p className="text-xs text-muted-foreground">
                                                {employeeRole} •{' '}
                                                {employeeDepartment}
                                            </p>
                                        </div>
                                    </div>

                                    <span className="text-xs font-semibold text-muted-foreground">
                                        {employee?.staff_number || 'No Staff #'}
                                    </span>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-4">
                                    <div>
                                        <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Reports To
                                        </p>
                                        <p className="mt-1 text-sm font-medium">
                                            {managerName}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Joined Date
                                        </p>
                                        <p className="mt-1 text-sm font-medium">
                                            {formatDate(employee?.hire_date)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                            <CardHeader className="border-b pb-3">
                                <CardTitle className="flex items-center gap-2 text-base font-bold">
                                    <Info className="h-4 w-4 text-primary" />
                                    Request Details
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-6 p-5">
                                <div className="flex items-start justify-between rounded-md bg-muted/50 p-3">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                Leave Period
                                            </p>
                                            <p className="mt-0.5 text-sm font-bold">
                                                {formatDate(record?.start_date)}{' '}
                                                - {formatDate(record?.end_date)}
                                            </p>
                                        </div>
                                    </div>

                                    <Badge className="border-primary/20 bg-primary/10 text-[10px] font-bold text-primary uppercase shadow-none hover:bg-primary/20">
                                        {requestedDays} Day
                                        {requestedDays === 1 ? '' : 's'}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Leave Type
                                        </p>
                                        <p className="mt-1 text-sm font-semibold">
                                            {record?.leave_type || 'N/A'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Submission Date
                                        </p>
                                        <p className="mt-1 text-sm font-semibold">
                                            {formatDate(record?.created_at)}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="mb-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Reason for Leave
                                    </p>
                                    <blockquote className="border-l-2 border-primary/40 pl-3 text-sm text-muted-foreground italic">
                                        "
                                        {record?.reason ||
                                            'No reason provided.'}
                                        "
                                    </blockquote>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between border-b pb-3">
                                <CardTitle className="text-base font-bold">
                                    Leave Balances
                                </CardTitle>
                                <PieChart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>

                            <CardContent className="space-y-6 p-5">
                                <div className="space-y-2">
                                    <div className="flex items-end justify-between">
                                        <span className="text-sm font-bold">
                                            {leaveBalances.current.type}
                                        </span>
                                        <span className="text-sm font-bold">
                                            {leaveBalances.current.remaining} /{' '}
                                            {leaveBalances.current.total} Days
                                            Remaining
                                        </span>
                                    </div>

                                    <Progress
                                        value={leaveBalances.current.progress}
                                        className="h-2"
                                    />

                                    <p className="text-xs text-muted-foreground">
                                        Requesting{' '}
                                        {leaveBalances.current.requested} day(s)
                                        will leave{' '}
                                        {
                                            leaveBalances.current
                                                .remaining_after_request
                                        }{' '}
                                        day(s) available.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 border-t pt-2">
                                    <div>
                                        <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Sick Leave
                                        </p>
                                        <p className="mt-1 text-lg font-bold">
                                            {leaveBalances.sick.remaining} /{' '}
                                            {leaveBalances.sick.total}{' '}
                                            <span className="text-xs font-normal text-muted-foreground">
                                                days
                                            </span>
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Compensatory
                                        </p>
                                        <p className="mt-1 text-lg font-bold">
                                            {
                                                leaveBalances.compensatory
                                                    .remaining
                                            }{' '}
                                            / {leaveBalances.compensatory.total}{' '}
                                            <span className="text-xs font-normal text-muted-foreground">
                                                days
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-col gap-6 lg:col-span-5 xl:col-span-6">
                        <Card className="shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between border-b pb-3">
                                <CardTitle className="flex items-center gap-2 text-base font-bold">
                                    <Eye className="h-4 w-4 text-primary" />
                                    Team Availability
                                </CardTitle>

                                <div className="flex gap-1">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-6 w-6 rounded-sm"
                                    >
                                        <ChevronLeft className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-6 w-6 rounded-sm"
                                    >
                                        <ChevronRight className="h-3 w-3" />
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="p-5">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                <th className="pb-3 font-medium">
                                                    Member
                                                </th>

                                                {teamAvailability.days.map(
                                                    (day) => (
                                                        <th
                                                            key={day.date}
                                                            className={`pb-3 text-center ${
                                                                day.is_focus
                                                                    ? 'rounded-t-md bg-primary/5 font-bold text-primary'
                                                                    : ''
                                                            }`}
                                                        >
                                                            {day.label}
                                                        </th>
                                                    ),
                                                )}
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y">
                                            {teamAvailability.members.map(
                                                (member, index) => (
                                                    <tr
                                                        key={`${member.name}-${index}`}
                                                    >
                                                        <td
                                                            className={`py-3 ${
                                                                member.is_applicant
                                                                    ? 'font-semibold'
                                                                    : 'font-medium text-muted-foreground'
                                                            }`}
                                                        >
                                                            {member.name}
                                                        </td>

                                                        {member.cells.map(
                                                            (
                                                                cell,
                                                                cellIndex,
                                                            ) => {
                                                                const day =
                                                                    teamAvailability
                                                                        .days[
                                                                        cellIndex
                                                                    ];

                                                                if (
                                                                    cell.type ===
                                                                    'leave'
                                                                ) {
                                                                    return (
                                                                        <td
                                                                            key={`${member.name}-${cellIndex}`}
                                                                            className={`py-3 text-center ${
                                                                                day?.is_focus
                                                                                    ? 'bg-primary/5'
                                                                                    : ''
                                                                            }`}
                                                                        >
                                                                            <div className="mx-auto flex h-5 w-5 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground">
                                                                                {cell.value ||
                                                                                    'L'}
                                                                            </div>
                                                                        </td>
                                                                    );
                                                                }

                                                                if (
                                                                    cell.type ===
                                                                    'sick'
                                                                ) {
                                                                    return (
                                                                        <td
                                                                            key={`${member.name}-${cellIndex}`}
                                                                            className="py-3 text-center"
                                                                        >
                                                                            <div className="mx-auto flex h-5 w-5 items-center justify-center rounded bg-amber-500 text-[10px] font-bold text-white">
                                                                                {cell.value ||
                                                                                    'S'}
                                                                            </div>
                                                                        </td>
                                                                    );
                                                                }

                                                                if (
                                                                    cell.type ===
                                                                    'available'
                                                                ) {
                                                                    return (
                                                                        <td
                                                                            key={`${member.name}-${cellIndex}`}
                                                                            className="py-3 text-center"
                                                                        >
                                                                            <div className="mx-auto h-2 w-2 rounded-full bg-emerald-500" />
                                                                        </td>
                                                                    );
                                                                }

                                                                return (
                                                                    <td
                                                                        key={`${member.name}-${cellIndex}`}
                                                                        className="py-3 text-center"
                                                                    />
                                                                );
                                                            },
                                                        )}
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-4 flex items-center gap-4 border-t pt-4 text-xs font-medium text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-3 w-3 rounded-sm bg-primary" />
                                        Approved Leave
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-3 w-3 rounded-sm bg-amber-500" />
                                        Sick Leave
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="ml-0.5 h-2 w-2 rounded-full bg-emerald-500" />
                                        Available
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="flex-1 shadow-sm">
                            <CardHeader className="border-b pb-3">
                                <CardTitle className="flex items-center gap-2 text-base font-bold">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    Audit Trail
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-5">
                                <div className="relative ml-3 space-y-8 border-l-2 border-muted pb-4">
                                    {auditTrail.map((item, index) => (
                                        <div
                                            key={index}
                                            className="relative pl-8"
                                        >
                                            <div
                                                className={`absolute top-0.5 -left-[17px] flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background shadow-sm ${getAuditIconClass(
                                                    item.type,
                                                )}`}
                                            >
                                                {getAuditIcon(item.type)}
                                            </div>

                                            <div>
                                                <p className="text-sm font-bold">
                                                    {item.title}
                                                </p>

                                                {item.time && (
                                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                                        {formatDateTime(
                                                            item.time,
                                                        )}
                                                    </p>
                                                )}

                                                {item.note && (
                                                    <div className="mt-2 rounded-md border border-muted bg-muted/50 p-2.5 text-sm text-muted-foreground italic">
                                                        "{item.note}"
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-col gap-6 lg:col-span-3">
                        <Card className="border-amber-200 bg-amber-50/50 shadow-sm">
                            <CardHeader className="border-b border-amber-100 pb-2">
                                <CardTitle className="flex items-center gap-2 text-base font-bold text-amber-800">
                                    <AlertTriangle className="h-4 w-4" />
                                    System Check
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-3 p-4">
                                {systemChecks.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-2"
                                    >
                                        {getSystemCheckIcon(item.type)}
                                        <p className="text-xs leading-tight font-medium text-amber-900">
                                            {item.message}
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                            <CardHeader className="border-b pb-3">
                                <CardTitle className="flex items-center gap-2 text-base font-bold">
                                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                    Add Internal Admin Note
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4 p-4">
                                <Textarea
                                    placeholder="Type a note visible only to HR..."
                                    className="min-h-[100px] resize-none bg-background text-sm"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="notify-manager"
                                            checked={notifyManager}
                                            onCheckedChange={(c) =>
                                                setNotifyManager(Boolean(c))
                                            }
                                        />
                                        <Label
                                            htmlFor="notify-manager"
                                            className="cursor-pointer text-xs font-medium"
                                        >
                                            Notify Manager
                                        </Label>
                                    </div>

                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="text-xs font-bold"
                                        onClick={handleSaveNote}
                                    >
                                        Save Note
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                            <CardHeader className="border-b pb-3">
                                <CardTitle className="text-base font-bold">
                                    Usage Statistics (Last 12mo)
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4 p-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-muted-foreground">
                                            Total Leaves Taken
                                        </span>
                                        <span className="font-bold text-foreground">
                                            {usageStats.total_leaves_taken} Days
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-muted-foreground">
                                            Avg. Request Lead Time
                                        </span>
                                        <span className="font-bold text-foreground">
                                            {usageStats.average_lead_time} Days
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-muted-foreground">
                                            Unplanned/Sick Ratio
                                        </span>
                                        <span className="font-bold text-emerald-600">
                                            {usageStats.unplanned_ratio_label} (
                                            {usageStats.unplanned_ratio}%)
                                        </span>
                                    </div>
                                </div>

                                <div className="relative flex h-16 w-full items-end overflow-hidden rounded border bg-emerald-50 opacity-80">
                                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_19px,#e5e7eb_20px)] bg-[length:20px_100%] opacity-50"></div>
                                    <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_19px,#e5e7eb_20px)] bg-[length:100%_20px] opacity-50"></div>

                                    <svg
                                        viewBox="0 0 100 40"
                                        preserveAspectRatio="none"
                                        className="relative z-10 h-full w-full fill-emerald-600/20 stroke-emerald-600 stroke-2"
                                    >
                                        <path d={chartAreaPath} />
                                    </svg>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                            <CardHeader className="border-b pb-3">
                                <CardTitle className="text-base font-bold">
                                    {employeeName.split(' ')[0]}'s Recent
                                    History
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-0">
                                <div className="divide-y text-sm">
                                    {recentHistory.map((item, index) => (
                                        <div
                                            key={`${item.id}-${index}`}
                                            className="flex justify-between p-4 transition-colors hover:bg-muted/30"
                                        >
                                            <div>
                                                <p className="font-bold text-foreground">
                                                    {item.leave_type}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {item.days} Day
                                                    {item.days === 1
                                                        ? ''
                                                        : 's'}{' '}
                                                    • {item.status}
                                                </p>
                                            </div>

                                            <span className="text-xs font-medium text-muted-foreground">
                                                {formatDate(item.start_date)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>

                            <CardFooter className="border-t bg-muted/30 p-3">
                                <span className="w-full text-center text-xs font-bold text-muted-foreground">
                                    Employee leave history from backend
                                </span>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
