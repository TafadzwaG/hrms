import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArchiveRestore,
    Calendar as CalendarIcon,
    CheckCircle2,
    Download,
    Eye,
    FileText,
    Info,
    Plus,
    RotateCcw,
    Search,
    Trash2,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

type PaginatedRecords = {
    data: any[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
};

type PayrollExportsPageProps = {
    module: any;
    records: PaginatedRecords;
    filters: { search?: string; status?: string };
    stats: {
        total: number;
        completed: number;
        failed: number;
        latest: any;
    };
};

export default function PayrollExportsIndex() {
    const { module, records, filters, stats } =
        usePage<PayrollExportsPageProps>().props;

    const [search, setSearch] = useState(filters?.search ?? '');
    const [status, setStatus] = useState(filters?.status ?? 'all');
    const [period, setPeriod] = useState('all');
    const [version, setVersion] = useState('all');

    // Debounce search filter
    useEffect(() => {
        const timer = setTimeout(() => applyFilters(), 300);
        return () => clearTimeout(timer);
    }, [search]);

    const applyFilters = () => {
        router.get(
            `${API}/${module?.slug || 'payroll-exports'}`,
            {
                search,
                status: status === 'all' ? '' : status,
            },
            { preserveState: true, replace: true, preserveScroll: true },
        );
    };

    const handlePageChange = (selectedItem: { selected: number }) => {
        router.get(
            `${API}/${module?.slug || 'payroll-exports'}`,
            {
                page: selectedItem.selected + 1,
                search,
                status: status === 'all' ? '' : status,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    // Actions (Browser native confirms removed in favor of AlertDialogs)
    const handleDelete = (id: number) => {
        router.delete(`${API}/${module?.slug || 'payroll-exports'}/${id}`, {
            preserveScroll: true,
        });
    };

    const handleRetryFailed = () => {
        router.post(
            `${API}/${module?.slug || 'payroll-exports'}/retry-failed`,
            {},
            { preserveScroll: true },
        );
    };

    const getStatusBadge = (statusStr: string) => {
        switch (statusStr) {
            case 'Completed':
                return (
                    <Badge
                        variant="outline"
                        className="border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-medium text-emerald-600 shadow-none"
                    >
                        Completed
                    </Badge>
                );
            case 'Processing':
                return (
                    <Badge
                        variant="outline"
                        className="border-amber-200 bg-amber-50 px-2.5 py-0.5 font-medium text-amber-600 shadow-none"
                    >
                        Processing
                    </Badge>
                );
            case 'Failed':
                return (
                    <Badge
                        variant="outline"
                        className="border-destructive/20 bg-destructive/10 px-2.5 py-0.5 font-medium text-destructive shadow-none"
                    >
                        Failed
                    </Badge>
                );
            case 'Cancelled':
                return (
                    <Badge
                        variant="outline"
                        className="border-border bg-muted px-2.5 py-0.5 font-medium text-muted-foreground shadow-none"
                    >
                        Cancelled
                    </Badge>
                );
            default:
                return <Badge variant="outline">{statusStr || 'Draft'}</Badge>;
        }
    };

    const pageData = records?.data ?? [];

    // Safe stat calculations
    const completedPercent =
        stats?.total > 0
            ? ((stats.completed / stats.total) * 100).toFixed(1)
            : '0';
    const failedPercent =
        stats?.total > 0
            ? ((stats.failed / stats.total) * 100).toFixed(1)
            : '0';

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Payroll Exports',
                    href: `${API}/${module?.slug || 'payroll-exports'}`,
                },
            ]}
        >
            <Head title="Payroll Exports" />

            <div className="min-h-[calc(100vh-64px)] w-full bg-muted/10 p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Payroll Exports
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage and track payroll export batches and
                            historical data logs.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Download Template Alert Dialog */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="font-medium shadow-sm"
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Template
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Download Payroll Template
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to download the
                                        standard Excel template for payroll
                                        imports?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() =>
                                            (window.location.href = `${API}/${module?.slug || 'payroll-exports'}/template/download`)
                                        }
                                    >
                                        Download
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <Button
                            className="bg-indigo-600 font-medium text-white shadow-sm hover:bg-indigo-700"
                            onClick={() =>
                                router.visit(
                                    `${API}/${module?.slug || 'payroll-exports'}/create`,
                                )
                            }
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            New Export
                        </Button>
                    </div>
                </div>

                {/* Metrics Row */}
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Total Exports
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold tracking-tight">
                                        {stats?.total || 0}
                                    </span>
                                </div>
                            </div>
                            <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-muted-foreground">
                                <ArchiveRestore className="h-4 w-4" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Completed
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold tracking-tight">
                                        {stats?.completed || 0}
                                    </span>
                                    <span className="text-xs font-semibold text-emerald-500">
                                        {completedPercent}%
                                    </span>
                                </div>
                            </div>
                            <div className="flex h-8 w-8 items-center justify-center rounded text-emerald-500">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Failed
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold tracking-tight">
                                        {stats?.failed || 0}
                                    </span>
                                    <span className="text-xs font-semibold text-destructive">
                                        {failedPercent}%
                                    </span>
                                </div>
                            </div>
                            <div className="flex h-8 w-8 items-center justify-center rounded text-destructive">
                                <AlertCircle className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Latest Export
                                </p>
                                <div>
                                    <p className="text-2xl font-bold tracking-tight whitespace-nowrap">
                                        {stats?.latest?.exported_at
                                            ? moment(
                                                  stats.latest.exported_at,
                                              ).format('MMM DD, YYYY')
                                            : '—'}
                                    </p>
                                    <p className="mt-1 text-xs font-medium text-muted-foreground">
                                        {stats?.latest?.exported_at
                                            ? moment(
                                                  stats.latest.exported_at,
                                              ).format('hh:mm A z')
                                            : 'No recent exports'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex h-8 w-8 items-center justify-center rounded text-muted-foreground">
                                <CalendarIcon className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters & Table Container */}
                <div className="rounded-xl border bg-background shadow-sm">
                    {/* Toolbar */}
                    <div className="flex flex-col justify-between gap-4 border-b p-4 lg:flex-row lg:items-center">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative w-[280px]">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Filter by File Ref or Notes..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-10 border-muted-foreground/30 bg-background pl-9 shadow-none"
                                />
                            </div>
                            <Select value={period} onValueChange={setPeriod}>
                                <SelectTrigger className="h-10 w-[140px] border-muted-foreground/30 shadow-none">
                                    <SelectValue placeholder="All Periods" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Periods
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={status}
                                onValueChange={(val) => {
                                    setStatus(val);
                                    setTimeout(applyFilters, 0);
                                }}
                            >
                                <SelectTrigger className="h-10 w-[140px] border-muted-foreground/30 shadow-none">
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Statuses
                                    </SelectItem>
                                    <SelectItem value="Completed">
                                        Completed
                                    </SelectItem>
                                    <SelectItem value="Processing">
                                        Processing
                                    </SelectItem>
                                    <SelectItem value="Failed">
                                        Failed
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={version} onValueChange={setVersion}>
                                <SelectTrigger className="h-10 w-[110px] border-muted-foreground/30 shadow-none">
                                    <SelectValue placeholder="Version" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Version</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder="mm/dd/yyyy"
                                    className="h-10 w-[140px] border-muted-foreground/30 bg-background pr-9 shadow-none"
                                />
                                <CalendarIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                        </div>

                        {/* Retry Failed Alert Dialog */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="h-10 font-medium shadow-sm"
                                >
                                    <RotateCcw className="mr-2 h-4 w-4" /> Retry
                                    Failed
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Retry Failed Exports
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will immediately attempt to
                                        re-process all payroll exports currently
                                        marked with a "Failed" status. Do you
                                        want to proceed?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleRetryFailed}
                                    >
                                        Confirm Retry
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[160px] pl-6 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Period Start
                                    </TableHead>
                                    <TableHead className="w-[160px] text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Period End
                                    </TableHead>
                                    <TableHead className="w-[120px] text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Version
                                    </TableHead>
                                    <TableHead className="w-[140px] text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Status
                                    </TableHead>
                                    <TableHead className="w-[200px] text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Exported At
                                    </TableHead>
                                    <TableHead className="w-[160px] text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        File Ref
                                    </TableHead>
                                    <TableHead className="min-w-[200px] text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Notes
                                    </TableHead>
                                    <TableHead className="w-[140px] pr-6 text-right text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pageData.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={8}
                                            className="h-48 text-center text-muted-foreground"
                                        >
                                            No payroll exports found matching
                                            your criteria.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pageData.map((row: any) => {
                                        const version =
                                            row.export_version ||
                                            `EXP-${row.id}`;
                                        const start = row.period_start
                                            ? moment(row.period_start).format(
                                                  'MMM DD, YYYY',
                                              )
                                            : '—';
                                        const end = row.period_end
                                            ? moment(row.period_end).format(
                                                  'MMM DD, YYYY',
                                              )
                                            : '—';
                                        const exportedAt = row.exported_at
                                            ? moment(row.exported_at).format(
                                                  'MMM DD, hh:mm A',
                                              )
                                            : '—';
                                        const isError = row.status === 'Failed';

                                        return (
                                            <TableRow
                                                key={row.id}
                                                className="hover:bg-muted/30"
                                            >
                                                <TableCell className="py-4 pl-6 font-medium text-foreground">
                                                    {start}
                                                </TableCell>
                                                <TableCell className="font-medium text-foreground">
                                                    {end}
                                                </TableCell>
                                                <TableCell className="font-medium text-muted-foreground">
                                                    <span className="rounded-md bg-indigo-50 px-2 py-1 text-indigo-600">
                                                        {version}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(row.status)}
                                                </TableCell>
                                                <TableCell className="font-medium text-muted-foreground">
                                                    {exportedAt}
                                                </TableCell>
                                                <TableCell className="font-medium text-muted-foreground">
                                                    {row.file_reference || '—'}
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`${isError ? 'font-medium text-destructive' : 'text-muted-foreground italic'}`}
                                                    >
                                                        {row.notes || '—'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="pr-6 text-right">
                                                    <div className="flex items-center justify-end gap-1 text-muted-foreground">
                                                        {/* Status specific actions */}
                                                        {row.status ===
                                                        'Failed' ? (
                                                            <>
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger
                                                                        asChild
                                                                    >
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-8 w-8 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                                                                            title="Retry"
                                                                        >
                                                                            <RotateCcw className="h-4 w-4" />
                                                                        </Button>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>
                                                                                Retry
                                                                                Export
                                                                            </AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                Are
                                                                                you
                                                                                sure
                                                                                you
                                                                                want
                                                                                to
                                                                                manually
                                                                                retry
                                                                                processing
                                                                                this
                                                                                failed
                                                                                payroll
                                                                                export?
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>
                                                                                Cancel
                                                                            </AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={() =>
                                                                                    router.post(
                                                                                        `${API}/${module?.slug || 'payroll-exports'}/${row.id}/retry`,
                                                                                        {},
                                                                                        {
                                                                                            preserveScroll: true,
                                                                                        },
                                                                                    )
                                                                                }
                                                                            >
                                                                                Retry
                                                                                Export
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>

                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                                    onClick={() =>
                                                                        router.visit(
                                                                            `${API}/${module?.slug || 'payroll-exports'}/${row.id}`,
                                                                        )
                                                                    }
                                                                    title="View Details"
                                                                >
                                                                    <Info className="h-4 w-4" />
                                                                </Button>
                                                            </>
                                                        ) : row.status ===
                                                          'Cancelled' ? (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                                onClick={() =>
                                                                    router.visit(
                                                                        `${API}/${module?.slug || 'payroll-exports'}/${row.id}`,
                                                                    )
                                                                }
                                                                title="View Details"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        ) : (
                                                            <>
                                                                {/* PDF Download Alert */}
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger
                                                                        asChild
                                                                    >
                                                                        <button
                                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none"
                                                                            title="Download PDF Summary"
                                                                        >
                                                                            <FileText className="h-4 w-4" />
                                                                        </button>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>
                                                                                Download
                                                                                PDF
                                                                                Summary
                                                                            </AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                Generate
                                                                                and
                                                                                download
                                                                                the
                                                                                formatted
                                                                                PDF
                                                                                summary
                                                                                for
                                                                                this
                                                                                payroll
                                                                                export
                                                                                batch?
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>
                                                                                Cancel
                                                                            </AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={() =>
                                                                                    (window.location.href = `${API}/${module?.slug || 'payroll-exports'}/${row.id}/pdf`)
                                                                                }
                                                                            >
                                                                                Download
                                                                                PDF
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>

                                                                {/* Excel Download Alert */}
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger
                                                                        asChild
                                                                    >
                                                                        <button
                                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none"
                                                                            title="Download Excel Export"
                                                                        >
                                                                            <Download className="h-4 w-4" />
                                                                        </button>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>
                                                                                Download
                                                                                Excel
                                                                                Export
                                                                            </AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                Download
                                                                                the
                                                                                raw
                                                                                Excel
                                                                                (.xlsx)
                                                                                file
                                                                                containing
                                                                                all
                                                                                timesheet
                                                                                entries
                                                                                for
                                                                                this
                                                                                payroll
                                                                                batch?
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>
                                                                                Cancel
                                                                            </AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={() =>
                                                                                    (window.location.href = `${API}/${module?.slug || 'payroll-exports'}/${row.id}/download`)
                                                                                }
                                                                            >
                                                                                Download
                                                                                Excel
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>

                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                                    onClick={() =>
                                                                        router.visit(
                                                                            `${API}/${module?.slug || 'payroll-exports'}/${row.id}`,
                                                                        )
                                                                    }
                                                                    title="View Details"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </>
                                                        )}

                                                        {/* Delete Row Alert Dialog */}
                                                        <AlertDialog>
                                                            <AlertDialogTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                                    title="Delete Export"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle className="text-destructive">
                                                                        Delete
                                                                        Payroll
                                                                        Export
                                                                    </AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you
                                                                        sure you
                                                                        want to
                                                                        permanently
                                                                        delete
                                                                        this
                                                                        payroll
                                                                        export?
                                                                        This
                                                                        action
                                                                        cannot
                                                                        be
                                                                        undone.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>
                                                                        Cancel
                                                                    </AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                row.id,
                                                                            )
                                                                        }
                                                                        className="bg-destructive text-white hover:bg-destructive/90"
                                                                    >
                                                                        Yes,
                                                                        Delete
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Footer Pagination */}
                    {records?.last_page > 1 && (
                        <div className="flex items-center justify-between border-t p-4">
                            <div className="text-sm font-medium text-muted-foreground">
                                Showing{' '}
                                <span className="font-bold text-foreground">
                                    {pageData.length}
                                </span>{' '}
                                of{' '}
                                <span className="font-bold text-foreground">
                                    {records.total}
                                </span>{' '}
                                results
                            </div>
                            <ReactPaginate
                                pageCount={records.last_page}
                                forcePage={records.current_page - 1}
                                onPageChange={handlePageChange}
                                marginPagesDisplayed={1}
                                pageRangeDisplayed={3}
                                previousLabel={
                                    <ChevronLeft className="h-4 w-4" />
                                }
                                nextLabel={<ChevronRight className="h-4 w-4" />}
                                breakLabel="..."
                                containerClassName="flex items-center gap-1"
                                pageLinkClassName="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background font-medium hover:bg-muted text-sm shadow-sm"
                                activeLinkClassName="!bg-indigo-600 text-white font-bold border-indigo-600 hover:!bg-indigo-700"
                                previousLinkClassName="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background shadow-sm hover:bg-muted"
                                nextLinkClassName="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background shadow-sm hover:bg-muted"
                                breakClassName="flex h-9 w-9 items-center justify-center text-sm font-medium text-muted-foreground"
                                disabledClassName="opacity-50 pointer-events-none"
                            />
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
