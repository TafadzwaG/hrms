import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    CalendarDays,
    CheckCircle2,
    ChevronLeft,
    Clock,
    Download,
    FileSpreadsheet,
    FileText,
    History,
    RefreshCw,
    Trash2,
    Users,
} from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export default function PayrollExportShow() {
    const { module, record } = usePage().props as any;

    // Fallbacks for UI demonstration if data is missing
    const exportVersion = record?.export_version || 'v2.4.1';
    const status = record?.status || 'Completed';
    const fileRef = record?.file_reference || 'EX-2026-042';
    const periodStart = record?.period_start
        ? moment(record.period_start).format('MMM DD, YYYY')
        : 'Feb 01, 2026';
    const periodEnd = record?.period_end
        ? moment(record.period_end).format('MMM DD, YYYY')
        : 'Feb 15, 2026';
    const exportedAt = record?.exported_at
        ? moment(record.exported_at).format('MMM DD, YYYY hh:mm A')
        : 'Feb 15, 2026 10:45 AM';
    const notes =
        record?.notes ||
        'Mid-month cycle export. All timesheets validated without exceptions.';

    // Mock included timesheets for the detailed table
    const includedTimesheets = [
        {
            id: 1,
            name: 'Sarah Jenkins',
            staff_id: 'EMP-9021',
            reg_hours: '80.00',
            ot_hours: '05.50',
            total: '85.50',
            status: 'Validated',
        },
        {
            id: 2,
            name: 'John Jacobson',
            staff_id: 'EMP-8812',
            reg_hours: '80.00',
            ot_hours: '00.00',
            total: '80.00',
            status: 'Validated',
        },
        {
            id: 3,
            name: 'Emily Rogers',
            staff_id: 'EMP-7734',
            reg_hours: '72.50',
            ot_hours: '00.00',
            total: '72.50',
            status: 'Validated',
        },
        {
            id: 4,
            name: 'Tom Wilson',
            staff_id: 'EMP-6621',
            reg_hours: '80.00',
            ot_hours: '12.25',
            total: '92.25',
            status: 'Validated',
        },
    ];

    const handleDelete = () => {
        router.delete(
            `${API}/${module?.slug || 'payroll-exports'}/${record?.id || 1}`,
        );
    };

    const getStatusBadge = (statusStr: string) => {
        switch (statusStr) {
            case 'Completed':
                return (
                    <Badge
                        variant="outline"
                        className="border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold tracking-wider text-emerald-600 uppercase shadow-none"
                    >
                        Completed
                    </Badge>
                );
            case 'Processing':
                return (
                    <Badge
                        variant="outline"
                        className="border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-bold tracking-wider text-amber-600 uppercase shadow-none"
                    >
                        Processing
                    </Badge>
                );
            case 'Failed':
                return (
                    <Badge
                        variant="outline"
                        className="border-destructive/20 bg-destructive/10 px-3 py-1 text-[10px] font-bold tracking-wider text-destructive uppercase shadow-none"
                    >
                        Failed
                    </Badge>
                );
            default:
                return (
                    <Badge
                        variant="outline"
                        className="border-border bg-muted px-3 py-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase shadow-none"
                    >
                        {statusStr || 'Draft'}
                    </Badge>
                );
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Payroll Exports',
                    href: `${API}/${module?.slug || 'payroll-exports'}`,
                },
                { title: `Export ${exportVersion}`, href: '#' },
            ]}
        >
            <Head title={`Payroll Export - ${exportVersion}`} />

            <div className="min-h-[calc(100vh-64px)] w-full space-y-6 bg-muted/10 p-4 md:p-6 lg:p-8">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full shadow-sm"
                            onClick={() =>
                                router.visit(
                                    `${API}/${module?.slug || 'payroll-exports'}`,
                                )
                            }
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                    Export Batch: {exportVersion}
                                </h1>
                                {getStatusBadge(status)}
                            </div>
                            <p className="mt-1 text-sm font-medium text-muted-foreground">
                                Internal Reference:{' '}
                                <span className="font-bold text-foreground">
                                    {fileRef}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="border-destructive/30 font-semibold text-destructive shadow-sm hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-destructive">
                                        Delete Export Record?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to permanently
                                        delete this payroll export record? The
                                        underlying timesheets will remain, but
                                        this batch reference will be removed.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        className="bg-destructive text-white hover:bg-destructive/90"
                                    >
                                        Yes, Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="font-semibold shadow-sm"
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Regenerate
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Regenerate Export?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will re-pull all timesheet data for
                                        the selected period and overwrite the
                                        current file. Proceed?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() =>
                                            router.post(
                                                `${API}/${module?.slug || 'payroll-exports'}/${record?.id || 1}/retry`,
                                            )
                                        }
                                    >
                                        Regenerate
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* LEFT COLUMN: Overview & Table (Spans 2/3) */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Configuration Details Card */}
                        <Card className="border-border shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-base font-bold">
                                    <FileSpreadsheet className="h-5 w-5 text-primary" />
                                    Configuration Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Period Start
                                        </p>
                                        <p className="text-sm font-bold text-foreground">
                                            {periodStart}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Period End
                                        </p>
                                        <p className="text-sm font-bold text-foreground">
                                            {periodEnd}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Generation Time
                                        </p>
                                        <p className="text-sm font-bold text-foreground">
                                            {exportedAt}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Created By
                                        </p>
                                        <p className="text-sm font-bold text-foreground">
                                            System Automation
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 border-t border-border/50 pt-6">
                                    <p className="mb-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Audit Notes
                                    </p>
                                    <p className="text-sm leading-relaxed font-medium text-muted-foreground">
                                        {notes}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Included Records Table */}
                        <Card className="border-border shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-base font-bold">
                                    <Users className="h-5 w-5 text-muted-foreground" />
                                    Included Timesheets
                                </CardTitle>
                                <Badge
                                    variant="secondary"
                                    className="bg-muted text-xs font-bold shadow-none"
                                >
                                    {includedTimesheets.length} Records
                                </Badge>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                                            <TableHead className="py-3 pl-6 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                Employee
                                            </TableHead>
                                            <TableHead className="text-right text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                Regular Hrs
                                            </TableHead>
                                            <TableHead className="text-right text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                Overtime
                                            </TableHead>
                                            <TableHead className="text-right text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                Total
                                            </TableHead>
                                            <TableHead className="pr-6 text-center text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                Status
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {includedTimesheets.map((ts) => (
                                            <TableRow
                                                key={ts.id}
                                                className="hover:bg-muted/20"
                                            >
                                                <TableCell className="py-3 pl-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-foreground">
                                                            {ts.name}
                                                        </span>
                                                        <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                                                            {ts.staff_id}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-medium text-muted-foreground">
                                                    {ts.reg_hours}
                                                </TableCell>
                                                <TableCell
                                                    className={`text-right font-medium ${parseFloat(ts.ot_hours) > 0 ? 'font-bold text-amber-600' : 'text-muted-foreground'}`}
                                                >
                                                    {ts.ot_hours}
                                                </TableCell>
                                                <TableCell className="text-right text-sm font-bold text-foreground">
                                                    {ts.total}
                                                </TableCell>
                                                <TableCell className="pr-6 text-center">
                                                    <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: Actions & Summary (Spans 1/3) */}
                    <div className="flex flex-col space-y-6 lg:col-span-1">
                        {/* Download Assets */}
                        <Card className="border-primary/20 bg-primary/5 shadow-sm">
                            <CardHeader className="border-b border-primary/10 pb-3">
                                <CardTitle className="text-sm font-bold tracking-widest text-primary uppercase">
                                    Export Assets
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 p-5">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button className="flex h-12 w-full justify-between bg-primary px-4 font-bold text-primary-foreground shadow-sm hover:bg-primary/90">
                                            <div className="flex items-center gap-2">
                                                <Download className="h-5 w-5" />
                                                <span>Download Excel File</span>
                                            </div>
                                            <span className="text-xs font-normal opacity-70">
                                                .xlsx
                                            </span>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Download Excel Export
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Retrieve the raw Excel file
                                                containing all payroll data for
                                                standard processing.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() =>
                                                    (window.location.href = `${API}/${module?.slug || 'payroll-exports'}/${record?.id || 1}/download`)
                                                }
                                            >
                                                Download
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="flex h-12 w-full justify-between border-border bg-background px-4 font-bold shadow-sm"
                                        >
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-5 w-5 text-muted-foreground" />
                                                <span>Audit PDF Summary</span>
                                            </div>
                                            <span className="text-xs font-normal text-muted-foreground">
                                                .pdf
                                            </span>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Download PDF Summary
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Retrieve the formatted PDF
                                                summary for management review
                                                and physical archiving.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() =>
                                                    (window.location.href = `${API}/${module?.slug || 'payroll-exports'}/${record?.id || 1}/pdf`)
                                                }
                                            >
                                                Download
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardContent>
                        </Card>

                        {/* Batch Totals Summary */}
                        <Card className="border-border shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-3">
                                <CardTitle className="text-base font-bold">
                                    Batch Totals
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 p-5">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-muted-foreground">
                                        Processed Employees
                                    </span>
                                    <span className="text-base font-bold text-foreground">
                                        148
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-muted-foreground">
                                        Total Regular Hours
                                    </span>
                                    <span className="font-bold text-foreground">
                                        11,840.00
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-muted-foreground">
                                        Total Overtime Hours
                                    </span>
                                    <span className="font-bold text-amber-600">
                                        342.50
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between pt-1">
                                    <span className="font-bold text-foreground">
                                        Grand Total Hours
                                    </span>
                                    <span className="text-2xl font-extrabold tracking-tight text-foreground">
                                        12,182.50
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Processing Log / Audit Trail */}
                        <Card className="flex-1 border-border shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-3">
                                <CardTitle className="flex items-center gap-2 text-base font-bold">
                                    <History className="h-4 w-4 text-muted-foreground" />
                                    Processing Log
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="relative ml-2 space-y-6 border-l-2 border-muted">
                                    <div className="relative pl-6">
                                        <div className="absolute top-1 -left-[11px] z-10 h-5 w-5 rounded-full border-[4px] border-emerald-500 bg-background"></div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">
                                                Export Completed
                                            </p>
                                            <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                                                Feb 15, 2026 • 10:45 AM
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                File successfully locked and
                                                stored.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="relative pl-6">
                                        <div className="absolute top-1 -left-[11px] z-10 h-5 w-5 rounded-full border-[4px] border-primary bg-background"></div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">
                                                Data Compilation
                                            </p>
                                            <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                                                Feb 15, 2026 • 10:44 AM
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Compiled timesheets from 148
                                                matching records.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="relative pl-6">
                                        <div className="absolute top-1 -left-[11px] z-10 h-5 w-5 rounded-full border-[4px] border-muted-foreground bg-background"></div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">
                                                Job Initiated
                                            </p>
                                            <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                                                Feb 15, 2026 • 10:42 AM
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Triggered by System Automation.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
