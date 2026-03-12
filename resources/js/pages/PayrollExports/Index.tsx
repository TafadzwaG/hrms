import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import {
    AlertCircle,
    ArchiveRestore,
    Calendar as CalendarIcon,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Download,
    Eye,
    Info,
    Plus,
    RotateCcw,
    Search,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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

// Mock data matching the exact screenshot layout
const MOCK_DATA = [
    {
        id: 1,
        period_start: 'Feb 01, 2026',
        period_end: 'Feb 15, 2026',
        version: 'v2.4.1',
        status: 'Completed',
        exported_at: 'Feb 15, 10:45 AM',
        file_ref: 'EX-2026-042',
        notes: 'Mid-month cycle',
        is_error: false,
    },
    {
        id: 2,
        period_start: 'Jan 16, 2026',
        period_end: 'Jan 31, 2026',
        version: 'v2.4.0',
        status: 'Processing',
        exported_at: 'Feb 15, 09:12 AM',
        file_ref: 'EX-2026-041',
        notes: 'Recalculated adjustments',
        is_error: false,
    },
    {
        id: 3,
        period_start: 'Jan 01, 2026',
        period_end: 'Jan 15, 2026',
        version: 'v2.4.0',
        status: 'Failed',
        exported_at: 'Feb 14, 04:30 PM',
        file_ref: 'EX-2026-040',
        notes: 'Validation error: Row 156',
        is_error: true,
    },
    {
        id: 4,
        period_start: 'Dec 16, 2025',
        period_end: 'Dec 31, 2025',
        version: 'v2.3.8',
        status: 'Cancelled',
        exported_at: 'Dec 31, 11:59 PM',
        file_ref: 'EX-2025-189',
        notes: 'Manual cancellation',
        is_error: false,
    },
    {
        id: 5,
        period_start: 'Dec 01, 2025',
        period_end: 'Dec 15, 2025',
        version: 'v2.3.8',
        status: 'Completed',
        exported_at: 'Dec 15, 05:00 PM',
        file_ref: 'EX-2025-188',
        notes: '-',
        is_error: false,
    },
];

export default function PayrollExportsIndex() {
    const [search, setSearch] = useState('');
    const [period, setPeriod] = useState('');
    const [status, setStatus] = useState('');
    const [version, setVersion] = useState('');

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
                return <Badge variant="outline">{statusStr}</Badge>;
        }
    };

    return (
        <AppLayout
            breadcrumbs={[{ title: 'Payroll Exports', href: '/payroll' }]}
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
                        <Button
                            variant="outline"
                            className="font-medium shadow-sm"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Download Template
                        </Button>
                        <Button className="bg-indigo-600 font-medium text-white shadow-sm hover:bg-indigo-700">
                            <Plus className="mr-2 h-4 w-4" />
                            New Export
                        </Button>
                    </div>
                </div>

                {/* Metrics Row */}
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Total Exports */}
                    <Card className="shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Total Exports
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold tracking-tight">
                                        156
                                    </span>
                                    <span className="text-xs font-semibold text-emerald-500">
                                        +2.4%
                                    </span>
                                </div>
                            </div>
                            <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-muted-foreground">
                                <ArchiveRestore className="h-4 w-4" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Completed */}
                    <Card className="shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Completed
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold tracking-tight">
                                        148
                                    </span>
                                    <span className="text-xs font-semibold text-emerald-500">
                                        94.8%
                                    </span>
                                </div>
                            </div>
                            <div className="flex h-8 w-8 items-center justify-center rounded text-emerald-500">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Failed */}
                    <Card className="shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Failed
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold tracking-tight">
                                        5
                                    </span>
                                    <span className="text-xs font-semibold text-destructive">
                                        3.2%
                                    </span>
                                </div>
                            </div>
                            <div className="flex h-8 w-8 items-center justify-center rounded text-destructive">
                                <AlertCircle className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Latest Export */}
                    <Card className="shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Latest Export
                                </p>
                                <div>
                                    <p className="text-2xl font-bold tracking-tight whitespace-nowrap">
                                        Feb 15, 2026
                                    </p>
                                    <p className="mt-1 text-xs font-medium text-muted-foreground">
                                        10:45 AM EST
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
                            <Select value={status} onValueChange={setStatus}>
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
                                    <SelectItem value="v2.4.1">
                                        v2.4.1
                                    </SelectItem>
                                    <SelectItem value="v2.4.0">
                                        v2.4.0
                                    </SelectItem>
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

                        <Button
                            variant="outline"
                            className="h-10 font-medium shadow-sm"
                        >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Retry Failed
                        </Button>
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
                                    <TableHead className="w-[120px] pr-6 text-right text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {MOCK_DATA.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        className="hover:bg-muted/30"
                                    >
                                        <TableCell className="py-4 pl-6 font-medium text-foreground">
                                            {row.period_start}
                                        </TableCell>
                                        <TableCell className="font-medium text-foreground">
                                            {row.period_end}
                                        </TableCell>
                                        <TableCell className="font-medium text-muted-foreground">
                                            <span className="rounded-md bg-indigo-50 px-2 py-1 text-indigo-600">
                                                {row.version}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(row.status)}
                                        </TableCell>
                                        <TableCell className="font-medium text-muted-foreground">
                                            {row.exported_at}
                                        </TableCell>
                                        <TableCell className="font-medium text-muted-foreground">
                                            {row.file_ref}
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`${row.is_error ? 'font-medium text-destructive' : 'text-muted-foreground italic'}`}
                                            >
                                                {row.notes}
                                            </span>
                                        </TableCell>
                                        <TableCell className="pr-6 text-right">
                                            <div className="flex items-center justify-end gap-1 text-muted-foreground">
                                                {row.status === 'Failed' ? (
                                                    <>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                                                        >
                                                            <RotateCcw className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
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
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                ) : (
                                                    <>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Footer Pagination */}
                    <div className="flex items-center justify-between border-t p-4">
                        <div className="text-sm font-medium text-muted-foreground">
                            Showing{' '}
                            <span className="font-bold text-foreground">1</span>{' '}
                            to{' '}
                            <span className="font-bold text-foreground">5</span>{' '}
                            of{' '}
                            <span className="font-bold text-foreground">
                                156
                            </span>{' '}
                            results
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 rounded-r-none border-r-0 shadow-none"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="default"
                                className="h-9 w-9 rounded-none bg-indigo-600 font-bold text-white shadow-none"
                            >
                                1
                            </Button>
                            <Button
                                variant="outline"
                                className="h-9 w-9 rounded-none border-x-0 font-medium shadow-none hover:bg-muted"
                            >
                                2
                            </Button>
                            <Button
                                variant="outline"
                                className="h-9 w-9 rounded-none border-r-0 font-medium shadow-none hover:bg-muted"
                            >
                                3
                            </Button>
                            <div className="flex h-9 w-9 items-center justify-center border-y border-input bg-background text-sm font-medium text-muted-foreground">
                                ...
                            </div>
                            <Button
                                variant="outline"
                                className="h-9 w-9 rounded-none border-x-0 font-medium shadow-none hover:bg-muted"
                            >
                                32
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 rounded-l-none border-l-0 shadow-none"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
