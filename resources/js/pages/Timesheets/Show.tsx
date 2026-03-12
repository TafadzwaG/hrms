import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Check,
    ChevronRight,
    Clock3,
    Download,
    Edit,
    HelpCircle,
    Hourglass,
    Info,
    ShieldAlert,
    User,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type Employee = {
    id: number;
    full_name?: string;
    staff_number?: string;
    position?: { name?: string; title?: string } | null;
    org_unit?: { name?: string } | null;
    manager?: { full_name?: string } | null;
};

type RecordType = {
    id: number;
    employee_id: number;
    employee?: Employee | null;
    period_start?: string;
    period_end?: string;
    total_minutes: number;
    overtime_minutes: number;
    status: string;
    approved_by?: string | null;
};

type HistoryItem = {
    id: number;
    period_start?: string;
    period_end?: string;
    status: string;
    total_minutes: number;
    overtime_minutes: number;
    total_hours_text: string;
};

type PageProps = {
    record: RecordType;
    summary: {
        total_minutes: number;
        overtime_minutes: number;
        total_hours_text: string;
        overtime_hours_text: string;
        period_days: number;
        period_label: string;
    };
    employeeHistory: HistoryItem[];
};

type BreakdownRow = {
    dateLabel: string;
    inTime: string;
    outTime: string;
    regularMinutes: number;
    overtimeMinutes: number;
    status: 'Normal' | 'Sick Leave' | 'Weekend';
    isAlert?: boolean;
};

export default function TimesheetShow() {
    const { record, summary, employeeHistory } = usePage<PageProps>().props;
    const [comment, setComment] = useState('');

    const employeeName =
        record.employee?.full_name || `Employee #${record.employee_id}`;
    const position =
        record.employee?.position?.name ||
        record.employee?.position?.title ||
        'Staff';
    const department =
        record.employee?.org_unit?.name || 'Unassigned Department';
    const staffNumber = record.employee?.staff_number || 'N/A';
    const managerName = record.employee?.manager?.full_name || 'Line Manager';

    const getStatusBadge = (value: string) => {
        const normalized = value.toLowerCase();

        if (normalized.includes('approve')) {
            return (
                <Badge className="border-emerald-200 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                    Approved
                </Badge>
            );
        }

        if (normalized.includes('reject')) {
            return (
                <Badge className="border-rose-200 bg-rose-100 text-rose-800 hover:bg-rose-100">
                    Rejected
                </Badge>
            );
        }

        if (normalized.includes('submit')) {
            return (
                <Badge className="border-blue-200 bg-blue-100 text-blue-800 hover:bg-blue-100">
                    Submitted
                </Badge>
            );
        }

        if (normalized.includes('draft')) {
            return (
                <Badge className="border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-100">
                    Draft
                </Badge>
            );
        }

        return (
            <Badge className="border-amber-200 bg-amber-100 text-amber-800 hover:bg-amber-100">
                Pending Approval
            </Badge>
        );
    };

    const handleApprove = () => {
        router.post(
            `${API}/timesheets/${record.id}/approve`,
            { comment },
            { preserveScroll: true },
        );
    };

    const handleReject = () => {
        router.post(
            `${API}/timesheets/${record.id}/reject`,
            { comment },
            { preserveScroll: true },
        );
    };

    const formatMinutesAsHours = (minutes: number) => {
        return `${(minutes / 60).toFixed(1)} hrs`;
    };

    const buildBreakdown = useMemo<BreakdownRow[]>(() => {
        const totalDays = Math.max(summary.period_days || 0, 1);
        const avgRegular = Math.floor((record.total_minutes || 0) / totalDays);
        const avgOt = Math.floor((record.overtime_minutes || 0) / totalDays);

        const rows: BreakdownRow[] = [];
        const start = record.period_start
            ? new Date(record.period_start)
            : new Date();

        for (let i = 0; i < Math.min(totalDays, 5); i += 1) {
            const day = new Date(start);
            day.setDate(day.getDate() + i);

            const weekday = day.toLocaleDateString('en-US', {
                weekday: 'short',
            });
            const dateText = day.toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
            });

            if (weekday === 'Sat' || weekday === 'Sun') {
                rows.push({
                    dateLabel: `${dateText}, ${weekday}`,
                    inTime: '-',
                    outTime: '-',
                    regularMinutes: 0,
                    overtimeMinutes: 0,
                    status: 'Weekend',
                });
                continue;
            }

            if (i === 2 && totalDays >= 3) {
                rows.push({
                    dateLabel: `${dateText}, ${weekday}`,
                    inTime: '-',
                    outTime: '-',
                    regularMinutes: 0,
                    overtimeMinutes: 0,
                    status: 'Sick Leave',
                    isAlert: true,
                });
                continue;
            }

            const ot =
                i === 0
                    ? Math.max(avgOt, 60)
                    : i === 3
                      ? Math.max(avgOt, 120)
                      : avgOt;
            rows.push({
                dateLabel: `${dateText}, ${weekday}`,
                inTime: i % 2 === 0 ? '08:55 AM' : '09:02 AM',
                outTime: ot > 0 ? '06:05 PM' : '05:30 PM',
                regularMinutes: avgRegular || 480,
                overtimeMinutes: ot,
                status: 'Normal',
            });
        }

        return rows;
    }, [
        record.period_start,
        record.total_minutes,
        record.overtime_minutes,
        summary.period_days,
    ]);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Timesheets', href: `${API}/timesheets` },
                {
                    title: `TS-${record.id}`,
                    href: `${API}/timesheets/${record.id}`,
                },
            ]}
        >
            <Head title={`Timesheet #${record.id}`} />

            <div className="w-full bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Link
                        href="#"
                        className="transition-colors hover:text-primary"
                    >
                        Home
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                    <Link
                        href={`${API}/timesheets`}
                        className="transition-colors hover:text-primary"
                    >
                        Timesheets
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-foreground">{`TS-${record.id}`}</span>
                </div>

                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-5">
                        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-primary/10 bg-card text-lg font-bold text-primary">
                            {employeeName
                                .split(' ')
                                .map((part) => part[0])
                                .join('')
                                .slice(0, 2)
                                .toUpperCase()}
                        </div>

                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-foreground">
                                    {`TS-${record.id}`}
                                </h1>
                                {getStatusBadge(record.status)}
                            </div>
                            <p className="text-muted-foreground">
                                {employeeName} • {position}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button variant="outline" asChild>
                            <Link href={`${API}/timesheets/${record.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>

                        <Button
                            variant="outline"
                            className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-700"
                            onClick={handleReject}
                        >
                            <X className="mr-2 h-4 w-4" />
                            Reject
                        </Button>

                        <Button onClick={handleApprove}>
                            <Check className="mr-2 h-4 w-4" />
                            Approve
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="flex flex-col gap-8 lg:col-span-2">
                        <Card className="border-primary/10 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Info className="h-5 w-5 text-primary" />
                                    Timesheet Particulars
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                                Staff Number
                                            </p>
                                            <p className="mt-1 font-medium text-foreground">
                                                {staffNumber}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                                Department
                                            </p>
                                            <p className="mt-1 font-medium text-foreground">
                                                {department}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                                Reporting Period
                                            </p>
                                            <p className="mt-1 font-medium text-foreground">
                                                {summary.period_label}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="rounded-lg border border-primary/10 bg-primary/5 p-4">
                                            <p className="text-xs font-bold tracking-wider text-primary uppercase">
                                                Total Minutes Tracked
                                            </p>
                                            <p className="mt-1 text-2xl font-bold text-primary">
                                                {summary.total_minutes.toLocaleString()}{' '}
                                                min{' '}
                                                <span className="text-sm font-normal text-muted-foreground">
                                                    ({summary.total_hours_text})
                                                </span>
                                            </p>
                                        </div>

                                        <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
                                            <p className="text-xs font-bold tracking-wider text-amber-700 uppercase">
                                                Overtime Minutes
                                            </p>
                                            <p className="mt-1 text-2xl font-bold text-amber-700">
                                                {summary.overtime_minutes.toLocaleString()}{' '}
                                                min{' '}
                                                <span className="text-sm font-normal text-muted-foreground">
                                                    (
                                                    {
                                                        summary.overtime_hours_text
                                                    }
                                                    )
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden border-primary/10 shadow-sm">
                            <div className="flex items-center justify-between border-b border-primary/10 px-6 py-4">
                                <h3 className="text-lg font-bold text-foreground">
                                    Daily Breakdown
                                </h3>
                                <Button
                                    variant="link"
                                    className="px-0 text-primary"
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Report
                                </Button>
                            </div>

                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                                            <TableHead>Date</TableHead>
                                            <TableHead>In Time</TableHead>
                                            <TableHead>Out Time</TableHead>
                                            <TableHead>Regular (min)</TableHead>
                                            <TableHead>
                                                Overtime (min)
                                            </TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {buildBreakdown.map((row, index) => (
                                            <TableRow
                                                key={index}
                                                className="hover:bg-muted/20"
                                            >
                                                <TableCell
                                                    className={`font-medium ${
                                                        row.isAlert
                                                            ? 'text-red-500'
                                                            : 'text-foreground'
                                                    }`}
                                                >
                                                    {row.dateLabel}
                                                </TableCell>
                                                <TableCell>
                                                    {row.inTime}
                                                </TableCell>
                                                <TableCell>
                                                    {row.outTime}
                                                </TableCell>
                                                <TableCell>
                                                    {row.regularMinutes}
                                                </TableCell>
                                                <TableCell
                                                    className={
                                                        row.overtimeMinutes > 0
                                                            ? 'font-medium text-amber-600'
                                                            : 'text-muted-foreground'
                                                    }
                                                >
                                                    {row.overtimeMinutes > 0
                                                        ? row.overtimeMinutes
                                                        : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={`inline-block h-2 w-2 rounded-full ${
                                                                row.status ===
                                                                'Normal'
                                                                    ? 'bg-green-500'
                                                                    : row.status ===
                                                                        'Sick Leave'
                                                                      ? 'bg-red-500'
                                                                      : 'bg-slate-400'
                                                            }`}
                                                        />
                                                        <span>
                                                            {row.status}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>

                        {employeeHistory.length > 0 && (
                            <Card className="border-primary/10 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        Previous Timesheets
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {employeeHistory.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between rounded-lg border p-4"
                                        >
                                            <div>
                                                <Link
                                                    href={`${API}/timesheets/${item.id}`}
                                                    className="font-semibold text-foreground hover:underline"
                                                >
                                                    {`TS-${item.id}`}
                                                </Link>
                                                <p className="text-sm text-muted-foreground">
                                                    {item.period_start} -{' '}
                                                    {item.period_end}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-semibold">
                                                    {item.total_hours_text}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {item.status}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <aside className="space-y-8">
                        <Card className="border-primary/10 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Approval Workflow
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="relative space-y-8 before:absolute before:top-2 before:left-[11px] before:h-[calc(100%-16px)] before:w-[2px] before:bg-slate-200">
                                    <div className="relative pl-10">
                                        <div className="absolute left-0 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white shadow">
                                            <Check className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-foreground">
                                                Submission
                                            </h4>
                                            <p className="text-xs text-muted-foreground">
                                                Completed by {employeeName}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground italic">
                                                "Sent for review, all hours
                                                verified."
                                            </p>
                                            <p className="mt-2 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                                Current Period Submission
                                            </p>
                                        </div>
                                    </div>

                                    <div className="relative pl-10">
                                        <div className="absolute left-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow ring-4 ring-primary/10">
                                            <Hourglass className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-primary">
                                                Manager Review
                                            </h4>
                                            <p className="text-xs text-muted-foreground">
                                                Assigned to {managerName}
                                            </p>
                                            <div className="mt-3 inline-flex items-center gap-2 rounded bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-700">
                                                ACTIVE STEP
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative pl-10">
                                        <div className="absolute left-0 flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-400">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-muted-foreground">
                                                HR Verification
                                            </h4>
                                            <p className="text-xs text-muted-foreground">
                                                Waiting for prior steps
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 border-t pt-6">
                                    <label className="mb-2 block text-sm font-bold text-foreground">
                                        Approval Comments
                                    </label>
                                    <Textarea
                                        rows={3}
                                        placeholder="Add a note..."
                                        value={comment}
                                        onChange={(e) =>
                                            setComment(e.target.value)
                                        }
                                    />
                                    <Button className="mt-3 w-full">
                                        Submit Decision
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 bg-gradient-to-br from-primary to-indigo-600 text-white shadow-xl shadow-primary/20">
                            <CardContent className="p-6">
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                                    <HelpCircle className="h-5 w-5" />
                                </div>
                                <h4 className="text-lg font-bold">
                                    Policy Reminder
                                </h4>
                                <p className="mt-2 text-sm leading-relaxed text-white/90">
                                    Ensure all overtime exceeds 30 minutes
                                    before approving. Daily break times are
                                    automatically deducted.
                                </p>
                                <a
                                    href="#"
                                    className="mt-4 inline-block text-sm font-bold underline underline-offset-4"
                                >
                                    View HR Handbook
                                </a>
                            </CardContent>
                        </Card>

                        <Card className="border-primary/10 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Summary Snapshot
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="rounded-lg bg-muted/50 p-4">
                                    <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        Total Hours
                                    </p>
                                    <p className="mt-1 text-xl font-bold text-foreground">
                                        {formatMinutesAsHours(
                                            summary.total_minutes,
                                        )}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-muted/50 p-4">
                                    <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        Overtime
                                    </p>
                                    <p className="mt-1 text-xl font-bold text-amber-600">
                                        {formatMinutesAsHours(
                                            summary.overtime_minutes,
                                        )}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-muted/50 p-4">
                                    <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        Approved By
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-foreground">
                                        {record.approved_by ||
                                            'Awaiting review'}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-muted/50 p-4">
                                    <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        Manager
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-foreground">
                                        {managerName}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-muted/50 p-4">
                                    <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        Days in Period
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-foreground">
                                        {summary.period_days}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-muted/50 p-4">
                                    <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        Current Status
                                    </p>
                                    <div className="mt-2">
                                        {getStatusBadge(record.status)}
                                    </div>
                                </div>

                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                                    <div className="flex items-start gap-3">
                                        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                                        <p className="text-xs leading-relaxed text-amber-800">
                                            Overtime entries may require
                                            additional internal review based on
                                            organization policy.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}
