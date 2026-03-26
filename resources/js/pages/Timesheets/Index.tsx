import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    Check,
    CheckSquare,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Download,
    Eye,
    Info,
    Pencil,
    Plus,
    Trash2,
    Upload,
    X,
} from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RoleScopeBar } from '@/components/role-scope-bar';
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
import { buildIndexParams } from '@/lib/index-table';
import type { PageRoleScope } from '@/types/auth';

type PaginatedRecords = {
    data: any[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
};

type TimesheetsPageProps = {
    records: PaginatedRecords;
    filters: { search?: string; status?: string; scope_view?: string };
    stats: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        total_minutes: number;
        overtime_minutes: number;
    };
    statusOptions: string[];
    scope?: PageRoleScope;
};

export default function TimesheetIndex() {
    const { records, filters, stats, statusOptions, scope } =
        usePage<TimesheetsPageProps>().props;

    const [search, setSearch] = useState<string>(filters?.search ?? '');
    const [status, setStatus] = useState<string>(filters?.status ?? 'all');
    const [period, setPeriod] = useState<string>('current');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            applyFilters();
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const applyFilters = () => {
        router.get(
            `${API}/timesheets`,
            buildIndexParams(filters, {
                search,
                status: status === 'all' ? '' : status,
            }),
            { preserveState: true, replace: true, preserveScroll: true },
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            `${API}/timesheets`,
            buildIndexParams(
                filters,
                {
                    page,
                    search,
                    status: status === 'all' ? '' : status,
                },
                { resetPage: false },
            ),
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleCreate = () => {
        router.visit(`${API}/timesheets/create`);
    };

    const handleView = (id: number) => {
        router.visit(`${API}/timesheets/${id}`);
    };

    const handleEdit = (id: number) => {
        router.visit(`${API}/timesheets/${id}/edit`);
    };

    const handleApprove = (id: number) => {
        router.post(
            `${API}/timesheets/${id}/approve`,
            {},
            { preserveScroll: true },
        );
    };

    const handleReject = (id: number) => {
        router.post(
            `${API}/timesheets/${id}/reject`,
            {},
            { preserveScroll: true },
        );
    };

    const handleDelete = () => {
        if (!deleteId) return;

        router.delete(`${API}/timesheets/${deleteId}`, {
            preserveScroll: true,
            onFinish: () => setDeleteId(null),
        });
    };

    const pageData = records?.data ?? [];

    const formatHours = (minutes: number) => {
        if (!minutes) return '00.00';
        return (minutes / 60).toFixed(2);
    };

    const getStatusBadge = (statusStr: string) => {
        const s = statusStr?.toLowerCase() || '';
        if (s.includes('pending')) {
            return (
                <Badge className="rounded-sm border-amber-200 bg-amber-100 text-[10px] font-bold tracking-wider text-amber-800 uppercase shadow-none hover:bg-amber-100">
                    Pending Review
                </Badge>
            );
        }
        if (s.includes('approve') || s.includes('valid')) {
            return (
                <Badge className="rounded-sm border-emerald-200 bg-emerald-100 text-[10px] font-bold tracking-wider text-emerald-800 uppercase shadow-none hover:bg-emerald-100">
                    Validated
                </Badge>
            );
        }
        if (s.includes('reject') || s.includes('except')) {
            return (
                <Badge className="rounded-sm border-destructive/20 bg-destructive/10 text-[10px] font-bold tracking-wider text-destructive uppercase shadow-none hover:bg-destructive/10">
                    Exception
                </Badge>
            );
        }
        return (
            <Badge className="rounded-sm border-transparent bg-muted text-[10px] font-bold tracking-wider text-muted-foreground uppercase shadow-none hover:bg-muted">
                Archived
            </Badge>
        );
    };

    const getInitials = (name: string) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    const avgOvertimeHours =
        stats.total > 0 ? stats.overtime_minutes / 60 / stats.total : 0;

    return (
        <AppLayout
            breadcrumbs={[{ title: 'Timesheets', href: `${API}/timesheets` }]}
        >
            <Head title="Timesheet Management" />

            <div className="min-h-[calc(100vh-64px)] w-full bg-background p-4 md:p-6 lg:p-8">
                <div className="mb-8 flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-xl font-bold tracking-widest text-foreground uppercase">
                        Timesheet Management Overview
                    </h1>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="h-9 text-xs font-semibold shadow-sm"
                        >
                            <Download className="mr-2 h-3.5 w-3.5" />
                            EXPORT SUMMARY
                        </Button>
                        <Button
                            variant="outline"
                            className="h-9 text-xs font-semibold shadow-sm"
                            onClick={handleCreate}
                        >
                            <Plus className="mr-2 h-3.5 w-3.5" />
                            CREATE
                        </Button>
                        <Button
                            variant="outline"
                            className="h-9 text-xs font-semibold shadow-sm"
                            onClick={() =>
                                router.visit(`${API}/timesheets/bulk-upload`)
                            }
                        >
                            <Upload className="mr-2 h-3.5 w-3.5" />
                            BULK UPLOAD
                        </Button>
                        <Button className="h-9 bg-slate-900 text-xs font-semibold shadow-sm">
                            <CheckSquare className="mr-2 h-3.5 w-3.5" />
                            BULK APPROVE
                        </Button>
                    </div>
                </div>

                <RoleScopeBar
                    scope={scope}
                    path={`${API}/timesheets`}
                    filters={filters}
                    className="mb-6"
                />

                <div className="grid grid-cols-1 gap-8 xl:grid-cols-4">
                    <div className="space-y-6 xl:col-span-3">
                        <div className="flex flex-wrap items-end gap-4 border-b pb-4">
                            <div className="max-w-sm min-w-[200px] flex-1 space-y-1.5">
                                <Label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                    Employee Search
                                </Label>
                                <Input
                                    placeholder="ID or Name"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-9 shadow-sm"
                                />
                            </div>
                            <div className="w-[180px] space-y-1.5">
                                <Label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                    Period
                                </Label>
                                <Select
                                    value={period}
                                    onValueChange={setPeriod}
                                >
                                    <SelectTrigger className="h-9 shadow-sm">
                                        <SelectValue placeholder="Select Period" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="current">
                                            Current Cycle
                                        </SelectItem>
                                        <SelectItem value="previous">
                                            Previous Cycle
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-[180px] space-y-1.5">
                                <Label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                    Status
                                </Label>
                                <Select
                                    value={status}
                                    onValueChange={(val) => {
                                        setStatus(val);
                                        setTimeout(applyFilters, 0);
                                    }}
                                >
                                    <SelectTrigger className="h-9 shadow-sm">
                                        <SelectValue placeholder="All Records" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Records
                                        </SelectItem>
                                        {statusOptions?.map((opt) => (
                                            <SelectItem key={opt} value={opt}>
                                                {opt}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button
                                variant="link"
                                className="mb-0.5 text-xs font-bold text-primary"
                                onClick={applyFilters}
                            >
                                APPLY FILTERS
                            </Button>
                        </div>

                        <div className="rounded-md border bg-card shadow-sm">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                                        <TableHead className="w-12 text-center">
                                            <Checkbox />
                                        </TableHead>
                                        <TableHead className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Employee
                                        </TableHead>
                                        <TableHead className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                            <div className="flex items-center gap-1.5">
                                                Reporting Period{' '}
                                                <Calendar className="h-3 w-3" />
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-right text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Total Hrs
                                        </TableHead>
                                        <TableHead className="text-right text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                            OT Hrs
                                        </TableHead>
                                        <TableHead className="text-center text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Status
                                        </TableHead>
                                        <TableHead className="text-right text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="text-sm">
                                    {pageData.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="h-48 text-center text-muted-foreground"
                                            >
                                                No timesheets found matching
                                                your criteria.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        pageData.map(
                                            (record: any, idx: number) => {
                                                const name =
                                                    record.employee
                                                        ?.full_name ||
                                                    record.employee
                                                        ?.first_name ||
                                                    `System Record ${idx + 1}`;
                                                const id =
                                                    record.employee
                                                        ?.staff_number ||
                                                    'AUTOMATED ENTRY';
                                                const start =
                                                    record.period_start
                                                        ? moment(
                                                              record.period_start,
                                                          ).format('MM/DD')
                                                        : '09/01';
                                                const end = record.period_end
                                                    ? moment(
                                                          record.period_end,
                                                      ).format('MM/DD')
                                                    : '09/15';
                                                const totalHoursStr =
                                                    formatHours(
                                                        record.total_minutes ||
                                                            2400,
                                                    );
                                                const otHours =
                                                    (record.overtime_minutes ||
                                                        0) / 60;
                                                const otHoursStr = formatHours(
                                                    record.overtime_minutes ||
                                                        0,
                                                );

                                                let otClass =
                                                    'font-medium text-muted-foreground';
                                                if (otHours > 8)
                                                    otClass =
                                                        'font-bold text-destructive';
                                                else if (otHours > 0)
                                                    otClass =
                                                        'font-bold text-amber-600';

                                                const isSystem =
                                                    id === 'AUTOMATED ENTRY';

                                                return (
                                                    <TableRow
                                                        key={record.id || idx}
                                                        className={`hover:bg-muted/20 ${isSystem ? 'opacity-60' : ''}`}
                                                    >
                                                        <TableCell className="text-center">
                                                            <Checkbox
                                                                className={
                                                                    isSystem
                                                                        ? 'opacity-30'
                                                                        : ''
                                                                }
                                                                disabled={
                                                                    isSystem
                                                                }
                                                            />
                                                        </TableCell>
                                                        <TableCell className="py-3">
                                                            <div className="flex items-center gap-3">
                                                                {isSystem ? (
                                                                    <div className="h-8 w-8 flex-shrink-0 rounded-sm border bg-muted" />
                                                                ) : (
                                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-xs font-bold text-primary">
                                                                        {getInitials(
                                                                            name,
                                                                        )}
                                                                    </div>
                                                                )}
                                                                <div className="flex flex-col">
                                                                    <span className="font-bold text-foreground">
                                                                        {name}
                                                                    </span>
                                                                    <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                                                                        #{id}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="font-medium text-muted-foreground">
                                                            {start} - {end}
                                                        </TableCell>
                                                        <TableCell className="text-right font-bold text-foreground">
                                                            {totalHoursStr}
                                                        </TableCell>
                                                        <TableCell
                                                            className={`text-right ${otClass}`}
                                                        >
                                                            {otHoursStr}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {getStatusBadge(
                                                                record.status ||
                                                                    (isSystem
                                                                        ? 'Archived'
                                                                        : 'Pending'),
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="h-8 w-8"
                                                                    disabled={
                                                                        isSystem
                                                                    }
                                                                    onClick={() =>
                                                                        handleView(
                                                                            record.id,
                                                                        )
                                                                    }
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="h-8 w-8"
                                                                    disabled={
                                                                        isSystem
                                                                    }
                                                                    onClick={() =>
                                                                        handleEdit(
                                                                            record.id,
                                                                        )
                                                                    }
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="h-8 w-8"
                                                                    disabled={
                                                                        isSystem
                                                                    }
                                                                    onClick={() =>
                                                                        handleApprove(
                                                                            record.id,
                                                                        )
                                                                    }
                                                                >
                                                                    <Check className="h-4 w-4 text-emerald-600" />
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="h-8 w-8"
                                                                    disabled={
                                                                        isSystem
                                                                    }
                                                                    onClick={() =>
                                                                        handleReject(
                                                                            record.id,
                                                                        )
                                                                    }
                                                                >
                                                                    <X className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="h-8 w-8"
                                                                    disabled={
                                                                        isSystem
                                                                    }
                                                                    onClick={() =>
                                                                        setDeleteId(
                                                                            record.id,
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            },
                                        )
                                    )}
                                </TableBody>
                            </Table>

                            <div className="flex flex-col items-center justify-between border-t bg-muted/10 p-3 text-[11px] font-bold tracking-wider text-muted-foreground uppercase sm:flex-row">
                                <div className="flex items-center gap-6">
                                    <span>
                                        PAGE {records?.current_page ?? 1} OF{' '}
                                        {records?.last_page ?? 1}
                                    </span>
                                    <span>
                                        {records?.per_page ?? 25} OF{' '}
                                        {records?.total ?? 0} RECORDS
                                    </span>
                                    <div className="flex items-center gap-2">
                                        VIEW:
                                        <Select defaultValue="25">
                                            <SelectTrigger className="h-6 w-[80px] border-none bg-transparent text-[11px] font-bold shadow-none">
                                                <SelectValue placeholder="25 Rows" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="25">
                                                    25 Rows
                                                </SelectItem>
                                                <SelectItem value="50">
                                                    50 Rows
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center gap-1 sm:mt-0">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 rounded-sm"
                                        disabled={
                                            (records?.current_page ?? 1) <= 1
                                        }
                                        onClick={() => handlePageChange(1)}
                                    >
                                        <ChevronsLeft className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 rounded-sm"
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
                                        <ChevronLeft className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        variant="default"
                                        size="icon"
                                        className="h-7 w-7 rounded-sm bg-primary text-[11px] font-bold text-primary-foreground"
                                    >
                                        {records?.current_page ?? 1}
                                    </Button>
                                    <span className="px-2 font-medium lowercase">
                                        of {records?.last_page ?? 1}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 rounded-sm"
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
                                        <ChevronRight className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 rounded-sm"
                                        disabled={
                                            (records?.current_page ?? 1) >=
                                            (records?.last_page ?? 1)
                                        }
                                        onClick={() =>
                                            handlePageChange(
                                                records?.last_page ?? 1,
                                            )
                                        }
                                    >
                                        <ChevronsRight className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 xl:col-span-1">
                        <div>
                            <h3 className="mb-4 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                Metric Overview
                            </h3>

                            <Card className="mb-4 rounded-md border-l-4 border-l-amber-500 shadow-sm">
                                <CardContent className="space-y-2 p-4">
                                    <div className="flex items-start justify-between">
                                        <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Pending Review
                                        </p>
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <span className="text-3xl font-bold text-amber-500">
                                            {stats.pending || 12}
                                        </span>
                                        <span className="mb-1.5 text-[10px] font-bold tracking-wider text-amber-600 uppercase">
                                            Requires Action
                                        </span>
                                    </div>
                                    <Progress
                                        value={45}
                                        className="h-1 bg-amber-100 [&>div]:bg-amber-500"
                                    />
                                </CardContent>
                            </Card>

                            <Card className="mb-4 rounded-md shadow-sm">
                                <CardContent className="p-4">
                                    <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Avg Overtime
                                    </p>
                                    <div className="mt-2 flex items-end gap-2">
                                        <span className="text-3xl font-bold text-foreground">
                                            {avgOvertimeHours.toFixed(1)}h
                                        </span>
                                        <Badge className="mb-1 border-transparent bg-destructive/10 text-[10px] font-bold text-destructive shadow-none hover:bg-destructive/10">
                                            +12% VS LAST
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-md shadow-sm">
                                <CardContent className="p-4">
                                    <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Audit Coverage
                                    </p>
                                    <div className="mt-2 flex items-end gap-2">
                                        <span className="text-3xl font-bold text-primary">
                                            88%
                                        </span>
                                        <span className="mb-1.5 text-[10px] font-bold tracking-wider text-emerald-600 uppercase">
                                            On Target
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div>
                            <h3 className="mb-4 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                Quick Insights
                            </h3>

                            <div className="space-y-4">
                                <div className="rounded-r-md border-l-4 border-destructive bg-destructive/5 p-4">
                                    <div className="flex gap-3">
                                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                                        <div>
                                            <h4 className="text-[11px] font-bold tracking-wider text-destructive uppercase">
                                                High Variance Detected
                                            </h4>
                                            <p className="mt-1 text-xs leading-relaxed font-medium text-destructive/80">
                                                3 employees exceeded 10h
                                                overtime this period.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-r-md border-l-4 border-blue-500 bg-blue-500/5 p-4">
                                    <div className="flex gap-3">
                                        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                                        <div>
                                            <h4 className="text-[11px] font-bold tracking-wider text-blue-600 uppercase">
                                                Payroll Lockdown
                                            </h4>
                                            <p className="mt-1 text-xs leading-relaxed font-medium text-blue-800/80">
                                                Lockdown occurs in 48 hours for
                                                Oct Cycle 1.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AlertDialog
                open={deleteId !== null}
                onOpenChange={(open) => {
                    if (!open) setDeleteId(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete timesheet?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            remove the selected timesheet record.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
