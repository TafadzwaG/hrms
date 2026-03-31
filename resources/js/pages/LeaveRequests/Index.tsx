import {
    filterLeaveCalendar,
    type LeaveCalendar,
    LeaveCalendarCard,
    LeaveStatsGrid,
    LeaveStatusBadge,
    type LeaveStats,
    formatLeaveDays,
    leaveIconMap,
} from '@/components/leave-requests/shared';
import { RoleScopeBar } from '@/components/role-scope-bar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { buildIndexParams } from '@/lib/index-table';
import type { PageRoleScope } from '@/types/auth';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, ListFilter, Plus, Search } from 'lucide-react';
import moment from 'moment';
import { useEffect, useMemo, useRef, useState } from 'react';

type Employee = {
    id: number;
    staff_number?: string | null;
    first_name?: string | null;
    middle_name?: string | null;
    surname?: string | null;
    full_name?: string | null;
    position?: {
        id?: number;
        name?: string | null;
        title?: string | null;
    } | null;
};

type LeaveRequestRecord = {
    id: number;
    employee_id?: number | null;
    employee?: Employee | null;
    employee_name?: string | null;
    requested_days?: number | null;
    leave_type?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    days?: number | null;
    status?: string | null;
    status_tone?: string | null;
};

type PaginatedRecords = {
    data: LeaveRequestRecord[];
    current_page: number;
    last_page: number;
    total: number;
};

type Filters = {
    search?: string;
    scope_view?: string;
    month?: string;
};

type PageProps = {
    module: {
        slug: string;
        name: string;
    };
    records: PaginatedRecords;
    filters: Filters;
    scope?: PageRoleScope | null;
    stats: LeaveStats;
    calendar: LeaveCalendar;
    auth?: {
        can?: Record<string, boolean>;
    };
};

export default function LeaveRequestIndex() {
    const { module, records, filters, scope, stats, calendar, auth } = usePage<PageProps>().props;
    const [search, setSearch] = useState<string>(filters?.search ?? '');
    const [activeTab, setActiveTab] = useState<'Queue' | 'Archived' | 'Conflicts'>('Queue');
    const { total, pending, active, approved } = leaveIconMap();
    const isMounted = useRef(false);
    const activeMonth = useMemo(() => {
        const parsed = moment(calendar.month, 'YYYY-MM', true);

        return parsed.isValid() ? parsed : moment().startOf('month');
    }, [calendar.month]);

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

        const timer = setTimeout(() => {
            router.get(
                `${API}/${module.slug}`,
                buildIndexParams(filters ?? {}, { search }),
                { preserveState: true, replace: true, preserveScroll: true },
            );
        }, 300);

        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const handlePageChange = (page: number) => {
        router.get(
            `${API}/${module.slug}`,
            buildIndexParams(filters ?? {}, { page, search }, { resetPage: false }),
            { preserveState: true, preserveScroll: true },
        );
    };

    const changeMonth = (direction: 'previous' | 'next') => {
        const nextMonth = direction === 'previous'
            ? activeMonth.clone().subtract(1, 'month')
            : activeMonth.clone().add(1, 'month');

        router.get(
            `${API}/${module.slug}`,
            buildIndexParams(filters ?? {}, { month: nextMonth.format('YYYY-MM') }),
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const filteredData = useMemo(() => {
        return (records?.data ?? []).filter((request) => {
            const status = (request.status ?? 'Pending').toLowerCase();

            if (activeTab === 'Queue') {
                return !status.includes('approve') && !status.includes('reject') && !status.includes('cancel');
            }

            if (activeTab === 'Archived') {
                return status.includes('approve') || status.includes('reject') || status.includes('cancel');
            }

            return status.includes('conflict');
        });
    }, [activeTab, records?.data]);

    const filteredCalendar = useMemo(() => {
        return filterLeaveCalendar(calendar, (entry) => {
            const status = entry.status.toLowerCase();

            if (activeTab === 'Queue') {
                return !status.includes('approve') && !status.includes('reject') && !status.includes('cancel');
            }

            if (activeTab === 'Archived') {
                return status.includes('approve') || status.includes('reject') || status.includes('cancel');
            }

            return status.includes('conflict');
        });
    }, [activeTab, calendar]);

    const statItems = [
        {
            key: 'total',
            label: 'Requests in View',
            value: `${stats.total_requests}`,
            hint: 'Role-scoped leave requests matching the current filters',
            icon: total,
        },
        {
            key: 'pending',
            label: scope?.mode === 'approval_queue' ? 'Actionable Queue' : 'Awaiting Decision',
            value: `${stats.pending_requests}`,
            hint: 'Pending and changes-requested leave requests',
            icon: pending,
        },
        {
            key: 'active',
            label: 'Active Absences',
            value: `${stats.active_absences ?? 0}`,
            hint: 'Employees currently away within the active scope',
            icon: active,
        },
        {
            key: 'upcoming',
            label: 'Starts This Month',
            value: `${stats.upcoming_requests}`,
            hint: 'Requests scheduled to start during the selected month',
            icon: approved,
        },
    ];

    const canManage = Boolean(auth?.can?.['leave.manage']);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Leave Requests', href: `${API}/${module.slug}` },
            ]}
        >
            <Head title="Leave Requests" />

            <div className="min-h-[calc(100vh-64px)] w-full space-y-6 bg-muted/20 p-4 md:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="rounded-full px-2.5 py-1 text-[10px] tracking-[0.16em] uppercase">
                                Leave workflow
                            </Badge>
                            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
                                {scope?.label ?? 'Organization view'}
                            </Badge>
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Leave requests</h1>
                        <p className="text-sm text-muted-foreground">
                            Review leave activity, apply role-aware filters, and inspect the leave calendar by month.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button asChild>
                            <Link href={`${API}/${module.slug}/create`}>
                                <Plus className="mr-2 h-4 w-4" />
                                Apply for Leave
                            </Link>
                        </Button>
                    </div>
                </div>

                <LeaveStatsGrid items={statItems} />

                <RoleScopeBar
                    scope={scope}
                    path={`${API}/${module.slug}`}
                    filters={filters}
                />

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                    <Card className="border-border/70 bg-card shadow-sm xl:col-span-8">
                        <CardHeader className="space-y-4 border-b border-border/60 pb-4">
                            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                                <CardTitle className="text-lg font-semibold">Leave request register</CardTitle>

                                <div className="inline-flex rounded-lg border border-border/70 bg-muted/30 p-1">
                                    {(['Queue', 'Archived', 'Conflicts'] as const).map((tab) => (
                                        <button
                                            key={tab}
                                            type="button"
                                            onClick={() => setActiveTab(tab)}
                                            className={
                                                activeTab === tab
                                                    ? 'rounded-md bg-background px-4 py-1.5 text-sm font-medium text-foreground shadow-sm'
                                                    : 'rounded-md px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
                                            }
                                        >
                                            {tab === 'Queue' ? 'Active Queue' : tab}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search employee, leave type, approver, or status"
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        className="pl-9"
                                    />
                                </div>

                                <Button type="button" variant="outline" size="icon">
                                    <ListFilter className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4 p-5">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/25 hover:bg-muted/25">
                                        <TableHead>Employee</TableHead>
                                        <TableHead>Leave Type</TableHead>
                                        <TableHead>Requested Period</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {filteredData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-40 text-center text-muted-foreground">
                                                No leave requests match the current tab and filter state.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredData.map((request) => {
                                            const employeeName =
                                                request.employee?.full_name ||
                                                request.employee_name ||
                                                [request.employee?.first_name, request.employee?.middle_name, request.employee?.surname]
                                                    .filter(Boolean)
                                                    .join(' ') ||
                                                `Employee #${request.employee_id}`;
                                            const employeeMeta =
                                                request.employee?.position?.name ||
                                                request.employee?.position?.title ||
                                                request.employee?.staff_number ||
                                                'Staff';
                                            const requestedDays = Number(request.requested_days ?? request.days ?? 0);

                                            return (
                                                <TableRow key={request.id}>
                                                    <TableCell className="py-4">
                                                        <div className="space-y-1">
                                                            <p className="font-medium text-foreground">{employeeName}</p>
                                                            <p className="text-xs text-muted-foreground">{employeeMeta}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-medium text-foreground">
                                                        {request.leave_type ?? 'Leave'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <p className="font-medium text-foreground">
                                                                {formatLeaveDays(requestedDays)} day{requestedDays === 1 ? '' : 's'}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {request.start_date ? moment(request.start_date).format('DD MMM YYYY') : 'TBC'}
                                                                {request.end_date ? ` to ${moment(request.end_date).format('DD MMM YYYY')}` : ''}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <LeaveStatusBadge
                                                            status={request.status ?? 'Pending'}
                                                            tone={request.status_tone ?? undefined}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button asChild variant="outline" size="sm">
                                                                <Link href={`${API}/${module.slug}/${request.id}`}>
                                                                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                                                                    Open
                                                                </Link>
                                                            </Button>
                                                            {canManage ? (
                                                                <Button asChild size="sm">
                                                                    <Link href={`${API}/${module.slug}/${request.id}/edit`}>Edit</Link>
                                                                </Button>
                                                            ) : null}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>

                            {records.last_page > 1 ? (
                                <div className="flex items-center justify-between pt-2">
                                    <p className="text-sm text-muted-foreground">
                                        Page {records.current_page} of {records.last_page}
                                    </p>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled={records.current_page <= 1}
                                            onClick={() => handlePageChange(records.current_page - 1)}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled={records.current_page >= records.last_page}
                                            onClick={() => handlePageChange(records.current_page + 1)}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            ) : null}
                        </CardContent>
                    </Card>

                    <LeaveCalendarCard
                        title="Leave calendar"
                        description="Month view of leave applications currently visible in this page scope."
                        calendar={filteredCalendar}
                        emptyMessage="No leave applications overlap the selected month in this view."
                        onPreviousMonth={() => changeMonth('previous')}
                        onNextMonth={() => changeMonth('next')}
                        className="xl:col-span-4"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
