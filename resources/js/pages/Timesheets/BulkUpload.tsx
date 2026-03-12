import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ChevronRight,
    Download,
    FileUp,
    History,
    PlusSquare,
    Settings,
    Table2,
    Upload,
} from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

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

type PreviewRow = {
    line: number;
    employee_name: string;
    staff_number: string;
    period_start_label: string;
    period_end_label: string;
    total_minutes: number;
    overtime_minutes: number;
    is_valid: boolean;
    error?: string;
};

type PreviewData = {
    rows: PreviewRow[];
    summary: {
        total: number;
        ready: number;
        errors: number;
    };
    has_uploaded_batch: boolean;
};

type PageProps = {
    preview: PreviewData;
};

export default function TimesheetBulkUpload() {
    const { preview } = usePage<PageProps>().props;
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [hours, setHours] = useState('8');

    const { setData, processing } = useForm({
        file: null as File | null,
    });

    const totalMinutes = useMemo(() => {
        const numeric = Number(hours || 0);
        return Number.isFinite(numeric) ? numeric * 60 : 0;
    }, [hours]);

    const openPicker = () => {
        inputRef.current?.click();
    };

    const submitPreview = (file: File) => {
        setData('file', file);

        const formData = new FormData();
        formData.append('file', file);

        router.post(`${API}/timesheets/bulk-upload/preview`, formData, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        submitPreview(file);
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (!file) return;
        submitPreview(file);
    };

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const processBatch = () => {
        router.post(
            `${API}/timesheets/bulk-upload/process`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const discardBatch = () => {
        router.delete(`${API}/timesheets/bulk-upload/discard`, {
            preserveScroll: true,
        });
    };

    const downloadTemplate = () => {
        window.location.href = `${API}/timesheets/bulk-upload/template`;
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Timesheets', href: `${API}/timesheets` },
                {
                    title: 'Batch Processor',
                    href: `${API}/timesheets/bulk-upload`,
                },
            ]}
        >
            <Head title="Timesheet Batch Processor" />

            <div className="min-h-[calc(100vh-64px)] w-full bg-[#fafafa] p-4 md:p-6 lg:p-8">
                <div className="grid grid-cols-1 gap-8 xl:grid-cols-[260px_minmax(0,1fr)]">
                    <aside className="space-y-6">
                        <Card className="border-slate-200 shadow-sm">
                            <CardContent className="p-4">
                                <div className="mb-4">
                                    <h3 className="px-1 text-[10px] font-bold tracking-[0.1em] text-muted-foreground uppercase">
                                        Management
                                    </h3>
                                </div>

                                <div className="space-y-1">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="h-auto w-full justify-start gap-3 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100 hover:text-slate-900"
                                    >
                                        <Table2 className="h-4 w-4" />
                                        Batch Processor
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="h-auto w-full justify-start gap-3 rounded-md px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                        onClick={() =>
                                            router.visit(
                                                `${API}/timesheets/create`,
                                            )
                                        }
                                    >
                                        <PlusSquare className="h-4 w-4" />
                                        Manual Entry
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="h-auto w-full justify-start gap-3 rounded-md px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    >
                                        <History className="h-4 w-4" />
                                        History
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">
                                    Quick Converter
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                                        Work Hours
                                    </label>
                                    <Input
                                        type="number"
                                        value={hours}
                                        onChange={(e) =>
                                            setHours(e.target.value)
                                        }
                                        placeholder="e.g. 8"
                                        className="h-9 border-slate-200 bg-slate-50"
                                    />
                                </div>

                                <div className="rounded border border-slate-100 bg-slate-50 p-3">
                                    <label className="block text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                                        Total Minutes
                                    </label>
                                    <span className="text-sm font-bold text-foreground">
                                        {totalMinutes}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 shadow-sm">
                            <CardContent className="space-y-1 p-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="h-auto w-full justify-start gap-3 rounded-md px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                >
                                    <AlertCircle className="h-4 w-4" />
                                    Support
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="h-auto w-full justify-start gap-3 rounded-md px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                >
                                    <Settings className="h-4 w-4" />
                                    Settings
                                </Button>
                            </CardContent>
                        </Card>
                    </aside>

                    <div className="space-y-8">
                        <Card className="border-slate-200 shadow-sm">
                            <CardContent className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <h1 className="text-lg font-semibold tracking-tight text-slate-800">
                                    Timesheet Batch Processor
                                </h1>

                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={downloadTemplate}
                                        className="border-slate-200 bg-white"
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        Template CSV
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            className={`cursor-pointer border-2 border-dashed bg-white shadow-sm transition-all ${
                                dragActive
                                    ? 'border-blue-500 bg-blue-50/30'
                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                            }`}
                            onClick={openPicker}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                        >
                            <CardContent className="p-12 text-center">
                                <input
                                    ref={inputRef}
                                    type="file"
                                    className="hidden"
                                    accept=".csv"
                                    onChange={onFileChange}
                                />

                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 transition-transform">
                                    <Upload className="h-8 w-8 text-slate-400" />
                                </div>

                                <h3 className="text-lg font-medium text-slate-900">
                                    Drop your CSV timesheets here
                                </h3>
                                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
                                    Select a file from your computer or drag and
                                    drop to begin the batch validation process.
                                </p>

                                <Button className="mt-6 bg-slate-900 hover:bg-slate-800">
                                    <FileUp className="mr-2 h-4 w-4" />
                                    Select File
                                </Button>

                                {processing && (
                                    <p className="mt-4 text-xs font-medium text-muted-foreground">
                                        Uploading and validating...
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <div className="space-y-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-900">
                                        Batch Preview
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Review validated records before final
                                        processing
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Badge
                                        variant="outline"
                                        className="rounded-full border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-600"
                                    >
                                        Total: {preview.summary.total}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="rounded-full border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-600"
                                    >
                                        Ready: {preview.summary.ready}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="rounded-full border-rose-100 bg-rose-50 px-3 py-1 text-[11px] font-medium text-rose-600"
                                    >
                                        Errors: {preview.summary.errors}
                                    </Badge>
                                </div>
                            </div>

                            <Card className="overflow-hidden border-slate-200 shadow-sm">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-b bg-slate-50/50 hover:bg-slate-50/50">
                                                <TableHead className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                                    #
                                                </TableHead>
                                                <TableHead className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                                    Employee Info
                                                </TableHead>
                                                <TableHead className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                                    Start
                                                </TableHead>
                                                <TableHead className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                                    End
                                                </TableHead>
                                                <TableHead className="text-right text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                                    Reg (Min)
                                                </TableHead>
                                                <TableHead className="text-right text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                                    OT (Min)
                                                </TableHead>
                                                <TableHead className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                                    Status
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {preview.rows.length === 0 ? (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={7}
                                                        className="h-32 text-center text-muted-foreground"
                                                    >
                                                        No batch preview
                                                        available yet.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                preview.rows.map((row) => (
                                                    <TableRow
                                                        key={row.line}
                                                        className={
                                                            row.is_valid
                                                                ? 'hover:bg-slate-50/50'
                                                                : 'bg-rose-50/20'
                                                        }
                                                    >
                                                        <TableCell
                                                            className={`text-xs ${
                                                                row.is_valid
                                                                    ? 'text-slate-400'
                                                                    : 'font-bold text-rose-300'
                                                            }`}
                                                        >
                                                            {String(
                                                                row.line,
                                                            ).padStart(2, '0')}
                                                        </TableCell>

                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className={`flex h-8 w-8 items-center justify-center rounded text-[10px] font-bold ${
                                                                        row.is_valid
                                                                            ? 'bg-slate-100 text-slate-500'
                                                                            : 'bg-rose-100 text-rose-500'
                                                                    }`}
                                                                >
                                                                    {(
                                                                        row.employee_name ||
                                                                        'U'
                                                                    )
                                                                        .split(
                                                                            ' ',
                                                                        )
                                                                        .map(
                                                                            (
                                                                                part,
                                                                            ) =>
                                                                                part[0],
                                                                        )
                                                                        .join(
                                                                            '',
                                                                        )
                                                                        .slice(
                                                                            0,
                                                                            2,
                                                                        )
                                                                        .toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-slate-900">
                                                                        {
                                                                            row.employee_name
                                                                        }
                                                                    </p>
                                                                    <p className="text-[10px] text-slate-400">
                                                                        {
                                                                            row.staff_number
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="text-sm font-medium text-slate-600">
                                                            {
                                                                row.period_start_label
                                                            }
                                                        </TableCell>

                                                        <TableCell className="text-sm font-medium text-slate-600">
                                                            {row.is_valid ? (
                                                                row.period_end_label
                                                            ) : (
                                                                <span className="flex items-center gap-1 text-[10px] font-bold text-rose-500">
                                                                    <AlertCircle className="h-3.5 w-3.5" />
                                                                    {row.error ||
                                                                        row.period_end_label}
                                                                </span>
                                                            )}
                                                        </TableCell>

                                                        <TableCell className="text-right text-sm font-medium text-slate-900">
                                                            {row.total_minutes.toLocaleString()}
                                                        </TableCell>

                                                        <TableCell className="text-right text-sm font-medium text-slate-400">
                                                            {row.overtime_minutes.toLocaleString()}
                                                        </TableCell>

                                                        <TableCell>
                                                            {row.is_valid ? (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="rounded border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold tracking-tight text-emerald-700 uppercase"
                                                                >
                                                                    Valid
                                                                </Badge>
                                                            ) : (
                                                                <Badge className="rounded border border-rose-600 bg-rose-500 px-2 py-0.5 text-[10px] font-bold tracking-tight text-white uppercase hover:bg-rose-500">
                                                                    Action
                                                                    Required
                                                                </Badge>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </Card>
                        </div>

                        <Card className="border-slate-200 shadow-sm">
                            <CardContent className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-wrap items-center gap-4 text-xs">
                                    <span className="text-slate-500">
                                        Showing{' '}
                                        <strong className="font-semibold text-slate-900">
                                            {preview.rows.length}
                                        </strong>{' '}
                                        imported records
                                    </span>
                                    <div className="h-4 w-px bg-slate-200" />
                                    <span className="flex items-center gap-1.5 font-semibold text-rose-500">
                                        <AlertCircle className="h-4 w-4" />
                                        {preview.summary.errors} entry(s)
                                        require correction
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="ghost"
                                        className="font-semibold text-slate-500 hover:text-slate-900"
                                        onClick={discardBatch}
                                        disabled={!preview.has_uploaded_batch}
                                    >
                                        Discard Batch
                                    </Button>

                                    <Button
                                        className="bg-blue-600 font-bold hover:bg-blue-700"
                                        onClick={processBatch}
                                        disabled={
                                            !preview.has_uploaded_batch ||
                                            preview.summary.ready === 0
                                        }
                                    >
                                        <span>Process &amp; Save Batch</span>
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
