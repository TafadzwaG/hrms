import { API } from '@/config';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { RoleScopeBar } from '@/components/role-scope-bar';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { buildIndexParams } from '@/lib/index-table';
import type { PageRoleScope } from '@/types/auth';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    CalendarCheck,
    CalendarRange,
    Check,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Download,
    FileText,
    Info,
    ListFilter,
    Plus,
    Search,
    X,
} from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';

type Employee = {
    id: number;
    staff_number?: string;
    first_name?: string;
    middle_name?: string;
    surname?: string;
    full_name?: string;
    position?: {
        id?: number;
        name?: string;
        title?: string;
    } | null;
};

type LeaveRequestRecord = {
    id: number;
    employee_id?: number;
    employee?: Employee | null;
    employee_name?: string;
    employee_role?: string;
    leave_type?: string;
    type?: string;
    start_date?: string;
    end_date?: string;
    effective_from?: string;
    effective_to?: string;
    duration?: number;
    days?: number;
    status?: string;
};

type PaginatedRecords = {
    data?: LeaveRequestRecord[];
    current_page?: number;
    last_page?: number;
    total?: number;
};

type PageProps = {
    module: {
        slug: string;
        name: string;
    };
    records: PaginatedRecords;
    filters: { search?: string; scope_view?: string };
    scope?: PageRoleScope;
};

export default function LeaveRequestIndex() {
    const { module, records, filters, scope } = usePage<PageProps>().props;

    const [search, setSearch] = useState<string>(filters?.search ?? '');
    const [activeTab, setActiveTab] = useState('Queue');

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                `${API}/${module.slug}`,
                buildIndexParams(filters, { search }),
                { preserveState: true, replace: true, preserveScroll: true },
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [search, module.slug]);

    const handlePageChange = (page: number) => {
        router.get(
            `${API}/${module.slug}`,
            buildIndexParams(filters, { page, search }, { resetPage: false }),
            { preserveState: true, preserveScroll: true },
        );
    };

    const pageData = records?.data ?? [];

    const filteredData = pageData.filter((request) => {
        const status = (request.status || 'Pending').toLowerCase();

        if (activeTab === 'Queue') {
            return !status.includes('approve') && !status.includes('reject');
        }

        if (activeTab === 'Archived') {
            return status.includes('approve') || status.includes('reject');
        }

        if (activeTab === 'Conflicts') {
            return status.includes('conflict');
        }

        return true;
    });

    const calculateDays = (start?: string, end?: string) => {
        if (!start || !end) return 0;
        return moment(end).diff(moment(start), 'days') + 1;
    };

    const getStatusBadge = (status: string = 'Pending') => {
        const normalized = status.toLowerCase();

        if (normalized.includes('approve')) {
            return (
                <Badge className="border-emerald-200 bg-emerald-100 font-medium text-emerald-800 shadow-none hover:bg-emerald-100">
                    Approved
                </Badge>
            );
        }

        if (normalized.includes('reject')) {
            return (
                <Badge className="border-rose-200 bg-rose-100 font-medium text-rose-800 shadow-none hover:bg-rose-100">
                    Rejected
                </Badge>
            );
        }

        if (normalized.includes('conflict')) {
            return (
                <Badge className="border-orange-200 bg-orange-100 font-medium text-orange-800 shadow-none hover:bg-orange-100">
                    Conflict
                </Badge>
            );
        }

        return (
            <Badge className="border-amber-200 bg-amber-100 font-medium text-amber-800 shadow-none hover:bg-amber-100">
                Pending
            </Badge>
        );
    };

    const getInitials = (name: string) => {
        if (!name) return 'U';

        return name
            .split(' ')
            .filter(Boolean)
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    const getEmployeeName = (request: LeaveRequestRecord) => {
        const employee = request.employee;

        if (employee?.full_name) return employee.full_name;

        const parts = [
            employee?.first_name,
            employee?.middle_name,
            employee?.surname,
        ].filter(Boolean);

        if (parts.length > 0) return parts.join(' ');

        if (request.employee_name) return request.employee_name;

        if (employee?.staff_number) return employee.staff_number;

        if (request.employee_id) return `Employee #${request.employee_id}`;

        return 'Unknown Employee';
    };

    const getEmployeeRole = (request: LeaveRequestRecord) => {
        return (
            request.employee_role ||
            request.employee?.position?.name ||
            request.employee?.position?.title ||
            request.employee?.staff_number ||
            'Staff'
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Organizations', href: `${API}/org-units` },
                { title: module.name, href: `${API}/${module.slug}` },
            ]}
        >
            <Head title="Leave Oversight" />

            <div className="min-h-[calc(100vh-64px)] w-full space-y-6 bg-muted/20 p-4 text-foreground md:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Organization Leave Oversight
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Actionable dashboard for auditing and processing
                            leave requests
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="shadow-sm">
                            <Download className="mr-2 h-4 w-4" />
                            Bulk Export
                        </Button>

                        <Button asChild className="shadow-sm">
                            <a href={`${API}/${module.slug}/create`}>
                                <Plus className="mr-2 h-4 w-4" />
                                Manual Entry
                            </a>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <p className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Awaiting Decision
                                    </p>
                                    <p className="text-3xl font-bold">12</p>
                                    <p className="text-xs font-medium text-amber-600">
                                        4 High Priority (Same Day)
                                    </p>
                                </div>
                                <div className="rounded-md bg-amber-100/50 p-2">
                                    <CalendarCheck className="h-5 w-5 text-amber-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <p className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Active Absences
                                    </p>
                                    <p className="text-3xl font-bold">24</p>
                                    <p className="text-xs font-medium text-muted-foreground">
                                        8% of total workforce
                                    </p>
                                </div>
                                <div className="rounded-md bg-blue-100/50 p-2">
                                    <CalendarRange className="h-5 w-5 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                                <div className="w-full space-y-2">
                                    <div className="flex w-full items-center justify-between">
                                        <p className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Engineering Capacity
                                        </p>
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    </div>
                                    <p className="text-3xl font-bold">92%</p>
                                    <div className="pt-1">
                                        <Progress
                                            value={92}
                                            className="h-1.5 [&>div]:bg-emerald-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <p className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Policy Compliance
                                    </p>
                                    <p className="text-3xl font-bold">100%</p>
                                    <p className="text-xs font-medium text-muted-foreground">
                                        All requests meet minimum notice
                                    </p>
                                </div>
                                <div className="rounded-md bg-muted p-2">
                                    <CheckCircle2 className="h-5 w-5 text-foreground" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <RoleScopeBar
                    scope={scope}
                    path={`${API}/${module.slug}`}
                    filters={filters}
                />

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <Card className="flex flex-col shadow-sm xl:col-span-2">
                        <CardHeader className="border-b pb-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <CardTitle className="text-lg">
                                    Leave Management Master List
                                </CardTitle>

                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex rounded-md bg-muted/50 p-1">
                                        {['Queue', 'Archived', 'Conflicts'].map(
                                            (tab) => (
                                                <button
                                                    key={tab}
                                                    onClick={() =>
                                                        setActiveTab(tab)
                                                    }
                                                    className={`rounded-sm px-4 py-1.5 text-sm font-medium transition-all ${
                                                        activeTab === tab
                                                            ? 'bg-background text-foreground shadow-sm'
                                                            : 'text-muted-foreground hover:text-foreground'
                                                    }`}
                                                >
                                                    {tab === 'Queue'
                                                        ? 'Active Queue'
                                                        : tab}
                                                </button>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <div className="relative flex-1 sm:max-w-md">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search employee, ID, or type..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="bg-background pl-9"
                                    />
                                </div>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="shrink-0"
                                >
                                    <ListFilter className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent
                            className="flex-1 p-0"
                            style={{ padding: '20px' }}
                        >
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                                        <TableHead className="py-4">
                                            Employee Details
                                        </TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Requested Period</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {filteredData.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="h-48 text-center text-muted-foreground"
                                            >
                                                {activeTab === 'Queue' &&
                                                    'No pending leave requests awaiting your decision.'}
                                                {activeTab === 'Archived' &&
                                                    'No historical leave requests found.'}
                                                {activeTab === 'Conflicts' &&
                                                    'No scheduling conflicts detected in this period.'}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredData.map((request, idx) => {
                                            const name =
                                                getEmployeeName(request);
                                            const role =
                                                getEmployeeRole(request);
                                            const type =
                                                request.leave_type ||
                                                request.type ||
                                                'Annual Leave';
                                            const start =
                                                request.start_date ||
                                                request.effective_from ||
                                                new Date().toISOString();
                                            const end =
                                                request.end_date ||
                                                request.effective_to ||
                                                new Date().toISOString();
                                            const duration =
                                                request.duration ||
                                                request.days ||
                                                calculateDays(start, end);
                                            const status =
                                                request.status || 'Pending';

                                            return (
                                                <TableRow
                                                    key={request.id || idx}
                                                    className="hover:bg-muted/20"
                                                >
                                                    <TableCell className="py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted font-bold text-muted-foreground">
                                                                {getInitials(
                                                                    name,
                                                                )}
                                                            </div>

                                                            <div className="flex flex-col">
                                                                <Link
                                                                    href={`${API}/${module.slug}/${request.id}`}
                                                                    className="font-semibold text-foreground transition-colors hover:text-primary hover:underline"
                                                                >
                                                                    {name}
                                                                </Link>

                                                                <span className="text-xs text-muted-foreground">
                                                                    {role}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </TableCell>

                                                    <TableCell className="font-medium text-muted-foreground">
                                                        {type}
                                                    </TableCell>

                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-foreground">
                                                                {duration} Days
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {moment(
                                                                    start,
                                                                ).format(
                                                                    'MMM DD',
                                                                )}{' '}
                                                                —{' '}
                                                                {moment(
                                                                    end,
                                                                ).format(
                                                                    'MMM DD',
                                                                )}
                                                            </span>
                                                        </div>
                                                    </TableCell>

                                                    <TableCell>
                                                        {getStatusBadge(status)}
                                                    </TableCell>

                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 text-slate-600 hover:text-slate-900"
                                                            >
                                                                <FileText className="mr-1 h-3 w-3" />
                                                                PDF
                                                            </Button>

                                                            {status.toLowerCase() !==
                                                                'approved' && (
                                                                <Button
                                                                    size="sm"
                                                                    className="h-8 bg-slate-900 text-white hover:bg-slate-800"
                                                                >
                                                                    <Check className="mr-1 h-3 w-3" />
                                                                    Approve
                                                                </Button>
                                                            )}

                                                            {status.toLowerCase() !==
                                                                'rejected' && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="h-8 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                                                >
                                                                    <X className="mr-1 h-3 w-3" />
                                                                    Reject
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>

                        <div className="flex items-center justify-between border-t p-4 text-sm text-muted-foreground">
                            <div>
                                SHOWING {filteredData.length} OF{' '}
                                {records?.total ?? 0} RECORDS
                            </div>

                            <div className="flex items-center gap-4">
                                <span>
                                    Page {records?.current_page ?? 1} of{' '}
                                    {records?.last_page ?? 1}
                                </span>

                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        disabled={
                                            (records?.current_page ?? 1) <= 1
                                        }
                                        onClick={() =>
                                            handlePageChange(
                                                (records?.current_page ?? 1) -
                                                    1,
                                            )
                                        }
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        disabled={
                                            (records?.current_page ?? 1) >=
                                            (records?.last_page ?? 1)
                                        }
                                        onClick={() =>
                                            handlePageChange(
                                                (records?.current_page ?? 1) +
                                                    1,
                                            )
                                        }
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="flex flex-col space-y-6 xl:col-span-1">
                        <Card className="shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between border-b pb-2">
                                <CardTitle className="text-base font-bold">
                                    Team Calendar
                                </CardTitle>
                                <div className="flex gap-1 text-muted-foreground">
                                    <ChevronLeft className="h-4 w-4 cursor-pointer" />
                                    <ChevronRight className="h-4 w-4 cursor-pointer" />
                                </div>
                            </CardHeader>

                            <CardContent className="pt-4 pb-4">
                                <div className="mb-4 text-center text-xs font-bold tracking-wider text-foreground uppercase">
                                    December 2023
                                </div>

                                <div className="grid grid-cols-7 gap-y-3 text-center text-sm">
                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(
                                        (day, i) => (
                                            <div
                                                key={i}
                                                className="mb-1 text-xs font-bold text-muted-foreground"
                                            >
                                                {day}
                                            </div>
                                        ),
                                    )}

                                    <div className="text-muted-foreground/30">
                                        26
                                    </div>
                                    <div className="text-muted-foreground/30">
                                        27
                                    </div>
                                    <div className="text-muted-foreground/30">
                                        28
                                    </div>
                                    <div className="text-muted-foreground/30">
                                        29
                                    </div>
                                    <div className="text-muted-foreground/30">
                                        30
                                    </div>

                                    {Array.from(
                                        { length: 26 },
                                        (_, i) => i + 1,
                                    ).map((date) => {
                                        let className =
                                            'relative flex items-center justify-center h-8 w-8 mx-auto rounded-full font-medium cursor-pointer hover:bg-muted';

                                        if (date === 12 || date === 13) {
                                            className +=
                                                ' bg-amber-100 text-amber-800 font-bold';
                                        } else if (date >= 20 && date <= 22) {
                                            className +=
                                                ' bg-slate-900 text-white font-bold hover:bg-slate-800';
                                        }

                                        const showDot = [
                                            5, 14, 18, 25,
                                        ].includes(date);

                                        return (
                                            <div
                                                key={date}
                                                className="relative flex h-10 flex-col items-center justify-start"
                                            >
                                                <div className={className}>
                                                    {date}
                                                </div>
                                                {showDot && (
                                                    <div className="absolute bottom-0 h-1 w-1 rounded-full bg-slate-900"></div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-6 flex items-center justify-between border-t pt-4 text-xs font-medium text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-slate-900"></div>
                                        Active Leaves
                                    </div>
                                    <span className="font-bold text-foreground">
                                        5 Employees
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between border-b pb-2">
                                <CardTitle className="text-base font-bold">
                                    Dept. Utilization
                                </CardTitle>
                                <Info className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>

                            <CardContent className="space-y-6 pt-5">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span>Product & Design</span>
                                        <span>72%</span>
                                    </div>
                                    <Progress
                                        value={72}
                                        className="h-2 bg-blue-100 [&>div]:bg-blue-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span>Engineering</span>
                                        <span>28%</span>
                                    </div>
                                    <Progress
                                        value={28}
                                        className="h-2 bg-emerald-100 [&>div]:bg-emerald-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span>Marketing</span>
                                        <span>45%</span>
                                    </div>
                                    <Progress
                                        value={45}
                                        className="h-2 bg-amber-100 [&>div]:bg-amber-500"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-amber-200 bg-amber-50/50 shadow-sm">
                            <CardContent className="flex flex-col gap-4 p-5">
                                <div className="flex gap-3">
                                    <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-bold tracking-tight text-amber-900 uppercase">
                                            Coverage Conflict
                                        </h4>
                                        <p className="text-xs leading-relaxed text-amber-800">
                                            3 Designers have requested
                                            overlapping leave from Dec 20-24.
                                            Decision requires department head
                                            consultation.
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    className="w-full border-amber-200 bg-white text-xs font-bold tracking-wider text-amber-900 uppercase hover:bg-amber-50"
                                >
                                    Notify Head of Design
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
