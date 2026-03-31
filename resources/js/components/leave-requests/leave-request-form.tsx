import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { API } from '@/config';
import type { PageRoleScope } from '@/types/auth';
import { router, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    CalendarDays,
    ClipboardList,
    FileText,
    Info,
    Loader2,
    UserRound,
    Users2,
} from 'lucide-react';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';

import {
    type LeaveCalendar,
    LeaveCalendarCard,
    type LeaveEmployeeContext,
    type LeaveEmployeeOption,
    type LeaveRecentRequest,
    type LeaveStats,
    LeaveStatsGrid,
    LeaveStatusBadge,
    formatLeaveDays,
    leaveIconMap,
} from './shared';

type LeaveRequestRecord = {
    id: number;
    employee_id?: number | null;
    leave_type?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    days?: number | null;
    status?: string | null;
    reason?: string | null;
    approver_name?: string | null;
};

type LeaveTypeOption = {
    value: string;
    label: string;
};

type LeaveRequestFormProps = {
    mode: 'create' | 'edit';
    module: {
        slug: string;
        name: string;
    };
    record?: LeaveRequestRecord | null;
    employees: LeaveEmployeeOption[];
    defaultEmployeeId?: number | null;
    lockedEmployeeSelection: boolean;
    employeeContext?: LeaveEmployeeContext | null;
    stats: LeaveStats;
    calendar: LeaveCalendar;
    leaveTypes: LeaveTypeOption[];
    scope?: PageRoleScope | null;
    previewPath: string;
};

export function LeaveRequestForm({
    mode,
    module,
    record = null,
    employees,
    defaultEmployeeId,
    lockedEmployeeSelection,
    employeeContext,
    stats,
    calendar,
    leaveTypes,
    scope,
    previewPath,
}: LeaveRequestFormProps) {
    const { total, pending, approved, active } = leaveIconMap();
    const [refreshingInsights, setRefreshingInsights] = useState(false);

    const initialEmployeeId = record?.employee_id ?? defaultEmployeeId ?? null;
    const { data, setData, post, put, processing, errors, transform } = useForm({
        employee_id: initialEmployeeId ? String(initialEmployeeId) : '',
        leave_type:
            leaveTypes.find(
                (option) =>
                    option.value.toLowerCase() === String(record?.leave_type ?? '').toLowerCase(),
            )?.value ??
            record?.leave_type ??
            leaveTypes[0]?.value ??
            'Annual Leave',
        start_date: record?.start_date ? moment(record.start_date).format('YYYY-MM-DD') : '',
        end_date: record?.end_date ? moment(record.end_date).format('YYYY-MM-DD') : '',
        days: Number(record?.days ?? 0),
        status: record?.status ?? 'PENDING',
        reason: record?.reason ?? '',
        approver_name: record?.approver_name ?? '',
    });

    useEffect(() => {
        if (!data.employee_id && defaultEmployeeId) {
            setData('employee_id', String(defaultEmployeeId));
        }
    }, [data.employee_id, defaultEmployeeId, setData]);

    const requestedDays = useMemo(() => {
        if (!data.start_date || !data.end_date) {
            return 0;
        }

        const start = moment(data.start_date);
        const end = moment(data.end_date);

        if (end.isBefore(start, 'day')) {
            return 0;
        }

        let days = 0;
        const cursor = start.clone();

        while (cursor.isSameOrBefore(end, 'day')) {
            if (cursor.isoWeekday() < 6) {
                days += 1;
            }

            cursor.add(1, 'day');
        }

        return days;
    }, [data.end_date, data.start_date]);

    useEffect(() => {
        if (data.days !== requestedDays) {
            setData('days', requestedDays);
        }
    }, [data.days, requestedDays, setData]);

    const activeMonth = useMemo(() => {
        const parsed = moment(calendar.month, 'YYYY-MM', true);

        return parsed.isValid() ? parsed : moment().startOf('month');
    }, [calendar.month]);

    const scopeView =
        scope?.current_view === 'team'
            ? 'team'
            : scope?.current_view === 'self'
              ? 'mine'
              : undefined;

    const employeeName =
        employeeContext?.full_name ||
        employees.find((employee) => String(employee.id) === data.employee_id)?.full_name ||
        'No employee selected';

    const selectedBalance =
        employeeContext?.balances.find((balance) => balance.type === data.leave_type) ??
        employeeContext?.balances[0] ??
        null;

    const remainingAfterRequest = selectedBalance
        ? Math.max(0, Number(selectedBalance.remaining) - requestedDays)
        : 0;

    const previewQuery = (overrides: { employeeId?: string; month?: string }) => {
        const query: Record<string, string> = {
            month: overrides.month ?? activeMonth.format('YYYY-MM'),
        };

        const employeeId = overrides.employeeId ?? data.employee_id;

        if (employeeId) {
            query.preview_employee_id = employeeId;
        }

        if (scopeView) {
            query.scope_view = scopeView;
        }

        return query;
    };

    const refreshWorkspace = (overrides: { employeeId?: string; month?: string }) => {
        setRefreshingInsights(true);

        router.get(previewPath, previewQuery(overrides), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: [
                'employees',
                'defaultEmployeeId',
                'lockedEmployeeSelection',
                'employeeContext',
                'stats',
                'calendar',
                'scope',
                'leaveTypes',
            ],
            onFinish: () => setRefreshingInsights(false),
        });
    };

    const handleEmployeeChange = (value: string) => {
        setData('employee_id', value);
        refreshWorkspace({ employeeId: value });
    };

    const handleMonthShift = (direction: 'previous' | 'next') => {
        const nextMonth =
            direction === 'previous'
                ? activeMonth.clone().subtract(1, 'month')
                : activeMonth.clone().add(1, 'month');

        refreshWorkspace({ month: nextMonth.format('YYYY-MM') });
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        const payload = {
            ...data,
            days: requestedDays,
            status: data.status || record?.status || 'PENDING',
        };

        if (mode === 'create') {
            transform(() => payload);
            post(`${API}/${module.slug}`, {
                preserveScroll: true,
            });

            return;
        }

        transform(() => payload);
        put(`${API}/${module.slug}/${record?.id}`, {
            preserveScroll: true,
        });
    };

    const statItems = [
        {
            key: 'total',
            label: 'Requests on Record',
            value: `${stats.total_requests}`,
            hint: 'Visible within the selected employee history',
            icon: total,
        },
        {
            key: 'pending',
            label: 'Awaiting Decision',
            value: `${stats.pending_requests}`,
            hint: 'Pending and changes-requested requests',
            icon: pending,
        },
        {
            key: 'approved',
            label: 'Approved Days',
            value: formatLeaveDays(stats.approved_days),
            hint: 'Approved leave days already consumed',
            icon: approved,
        },
        {
            key: 'upcoming',
            label: 'Upcoming Requests',
            value: `${stats.upcoming_requests}`,
            hint: 'Requests starting from today forward',
            icon: active,
        },
    ];

    const title = mode === 'create' ? 'Apply for Leave' : 'Update Leave Request';
    const description =
        mode === 'create'
            ? 'Create a leave request with role-aware employee selection, balance visibility, and a live leave calendar.'
            : 'Update the leave request details before submitting the revised request for processing.';

    return (
        <div className="min-h-[calc(100vh-64px)] w-full space-y-6 bg-muted/20 p-4 md:p-8">
            <div className="space-y-3">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
                        <p className="max-w-3xl text-sm text-muted-foreground">{description}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {scope ? (
                            <>
                                <Badge variant="outline" className="rounded-full px-2.5 py-1 text-[10px] tracking-[0.16em] uppercase">
                                    Scoped by role
                                </Badge>
                                <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
                                    {scope.label}
                                </Badge>
                            </>
                        ) : null}
                        {record?.status ? <LeaveStatusBadge status={record.status} tone={null} /> : null}
                    </div>
                </div>

                {refreshingInsights ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Refreshing leave balances and calendar context…
                    </div>
                ) : null}
            </div>

            <LeaveStatsGrid items={statItems} />

            <form onSubmit={submit} className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-8 xl:col-span-8">
                    <Card className="border-border/70 bg-card shadow-sm">
                        <CardHeader className="space-y-1 border-b border-border/60 pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                <UserRound className="h-5 w-5 text-foreground" />
                                Employee context
                            </CardTitle>
                            <CardDescription>
                                Employees see only their own record. Managers can apply for themselves or direct reports.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 p-6 md:grid-cols-2">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="employee_id">Employee</Label>
                                <Select
                                    value={data.employee_id}
                                    onValueChange={handleEmployeeChange}
                                    disabled={lockedEmployeeSelection || employees.length === 0}
                                >
                                    <SelectTrigger id="employee_id" className="h-11">
                                        <SelectValue placeholder="Select employee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map((employee) => (
                                            <SelectItem key={employee.id} value={String(employee.id)}>
                                                {employee.full_name ?? `Employee #${employee.id}`}
                                                {employee.staff_number ? ` (${employee.staff_number})` : ''}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {lockedEmployeeSelection ? (
                                    <p className="text-xs text-muted-foreground">
                                        This request is locked to your employee profile.
                                    </p>
                                ) : null}
                                {errors.employee_id ? <p className="text-xs text-destructive">{errors.employee_id}</p> : null}
                            </div>

                            <InfoField label="Department" value={employeeContext?.department ?? 'Not assigned'} />
                            <InfoField label="Position" value={employeeContext?.position ?? 'Not assigned'} />
                            <InfoField label="Manager" value={employeeContext?.manager ?? 'Not assigned'} />
                            <InfoField label="Staff Number" value={employeeContext?.staff_number ?? 'Not assigned'} mono />
                        </CardContent>
                    </Card>

                    <Card className="border-border/70 bg-card shadow-sm">
                        <CardHeader className="space-y-1 border-b border-border/60 pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                <CalendarDays className="h-5 w-5 text-foreground" />
                                Leave details
                            </CardTitle>
                            <CardDescription>Choose the leave type and the requested period.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 p-6 md:grid-cols-2">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="leave_type">Leave type</Label>
                                <Select value={data.leave_type} onValueChange={(value) => setData('leave_type', value)}>
                                    <SelectTrigger id="leave_type" className="h-11">
                                        <SelectValue placeholder="Select leave type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {leaveTypes.map((leaveType) => (
                                            <SelectItem key={leaveType.value} value={leaveType.value}>
                                                {leaveType.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.leave_type ? <p className="text-xs text-destructive">{errors.leave_type}</p> : null}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="start_date">Start date</Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    value={data.start_date}
                                    onChange={(event) => setData('start_date', event.target.value)}
                                    className="h-11"
                                />
                                {errors.start_date ? <p className="text-xs text-destructive">{errors.start_date}</p> : null}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="end_date">End date</Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    value={data.end_date}
                                    onChange={(event) => setData('end_date', event.target.value)}
                                    className="h-11"
                                />
                                {errors.end_date ? <p className="text-xs text-destructive">{errors.end_date}</p> : null}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="days">Requested days</Label>
                                <Input id="days" value={formatLeaveDays(requestedDays)} readOnly className="h-11 bg-muted/30" />
                            </div>

                            <div className="space-y-2">
                                <Label>Status</Label>
                                <div className="flex h-11 items-center rounded-md border border-border/60 bg-muted/30 px-3">
                                    <LeaveStatusBadge status={record?.status ?? 'Pending'} tone={null} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/70 bg-card shadow-sm">
                        <CardHeader className="space-y-1 border-b border-border/60 pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                <ClipboardList className="h-5 w-5 text-foreground" />
                                Business reason
                            </CardTitle>
                            <CardDescription>Capture the context that the manager or HR reviewer needs.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 p-6">
                            <div className="space-y-2">
                                <Label htmlFor="reason">Reason for leave</Label>
                                <Textarea
                                    id="reason"
                                    value={data.reason}
                                    onChange={(event) => setData('reason', event.target.value)}
                                    className="min-h-36 resize-none"
                                    placeholder="Provide the purpose of the leave request and any handover notes."
                                />
                                {errors.reason ? <p className="text-xs text-destructive">{errors.reason}</p> : null}
                            </div>

                            <Alert className="border-border/70 bg-muted/30">
                                <Info className="h-4 w-4" />
                                <AlertTitle>Request handling</AlertTitle>
                                <AlertDescription>
                                    Requests are created with a pending status and remain within the existing approval workflow.
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={() => router.visit(`${API}/${module.slug}`)}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || !data.employee_id || !data.start_date || !data.end_date || requestedDays <= 0}
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving…
                                </>
                            ) : mode === 'create' ? (
                                'Submit Leave Request'
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </div>
                </div>

                <div className="space-y-6 lg:col-span-4 xl:col-span-4">
                    <Card className="border-border/70 bg-card shadow-sm">
                        <CardHeader className="space-y-1 border-b border-border/60 pb-4">
                            <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                <Users2 className="h-4.5 w-4.5 text-foreground" />
                                Request summary
                            </CardTitle>
                            <CardDescription>Live context for the selected employee and leave request.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5 p-5">
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-foreground">{employeeName}</p>
                                <p className="text-xs text-muted-foreground">
                                    {[employeeContext?.position, employeeContext?.department].filter(Boolean).join(' · ') || 'No employee context available'}
                                </p>
                            </div>

                            <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                                <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                                    Balance impact
                                </p>

                                {selectedBalance ? (
                                    <div className="mt-3 space-y-3">
                                        <SummaryRow label="Current allowance" value={`${formatLeaveDays(selectedBalance.total)} days`} />
                                        <SummaryRow label="Already taken" value={`${formatLeaveDays(selectedBalance.taken)} days`} />
                                        <SummaryRow label="Available before request" value={`${formatLeaveDays(selectedBalance.remaining)} days`} />
                                        <SummaryRow label="Requested now" value={`${formatLeaveDays(requestedDays)} days`} emphasized />
                                        <SummaryRow label="Projected remaining" value={`${formatLeaveDays(remainingAfterRequest)} days`} />
                                    </div>
                                ) : (
                                    <p className="mt-3 text-sm text-muted-foreground">Select an employee to preview leave balances.</p>
                                )}
                            </div>

                            {requestedDays > 0 && selectedBalance && remainingAfterRequest < 0.5 ? (
                                <Alert className="border-amber-200 bg-amber-50 text-amber-800">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>
                                        This request consumes nearly all of the remaining balance for the selected leave type.
                                    </AlertDescription>
                                </Alert>
                            ) : null}

                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm font-semibold text-foreground">Recent leave history</p>
                                </div>

                                <div className="space-y-2">
                                    {employeeContext?.recent_requests?.length ? (
                                        employeeContext.recent_requests.map((item) => (
                                            <RecentRequestRow key={`${item.id}-${item.start_date ?? 'request'}`} request={item} />
                                        ))
                                    ) : (
                                        <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 py-5 text-sm text-muted-foreground">
                                            No recent leave activity for the selected employee.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <LeaveCalendarCard
                        title="Leave calendar"
                        description="Month view of leave applications for the selected employee."
                        calendar={calendar}
                        emptyMessage="No leave applications overlap this month for the selected employee."
                        onPreviousMonth={() => handleMonthShift('previous')}
                        onNextMonth={() => handleMonthShift('next')}
                    />
                </div>
            </form>
        </div>
    );
}

function InfoField({
    label,
    value,
    mono = false,
}: {
    label: string;
    value: string;
    mono?: boolean;
}) {
    return (
        <div className="space-y-1">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">{label}</p>
            <p className={mono ? 'font-mono text-sm text-foreground' : 'text-sm text-foreground'}>{value}</p>
        </div>
    );
}

function SummaryRow({
    label,
    value,
    emphasized = false,
}: {
    label: string;
    value: string;
    emphasized?: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className={emphasized ? 'font-semibold text-foreground' : 'font-medium text-foreground'}>{value}</span>
        </div>
    );
}

function RecentRequestRow({
    request,
}: {
    request: LeaveRecentRequest;
}) {
    return (
        <div className="rounded-xl border border-border/60 bg-muted/15 px-3 py-3">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-foreground">{request.leave_type}</p>
                <LeaveStatusBadge status={request.status} tone={request.status_tone} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
                {formatLeaveDays(request.days)} day{request.days === 1 ? '' : 's'} ·{' '}
                {request.start_date ? moment(request.start_date).format('DD MMM YYYY') : 'TBC'}
                {request.end_date ? ` to ${moment(request.end_date).format('DD MMM YYYY')}` : ''}
            </p>
        </div>
    );
}
