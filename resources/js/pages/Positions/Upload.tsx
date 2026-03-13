import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    ChevronRight,
    Download,
    FileSpreadsheet,
    FileText,
    Info,
    Key,
    Network,
    UploadCloud,
    XCircle,
} from 'lucide-react';
import { useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export default function PositionUpload() {
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        file: null as File | null,
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        clearErrors('file');

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setData('file', e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        clearErrors('file');
        if (e.target.files && e.target.files[0]) {
            setData('file', e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.file) {
            alert('Please select a file to upload first.');
            return;
        }

        post(`${API}/positions/import`, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setData('file', null);
            },
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Positions', href: `${API}/positions` },
                { title: 'Upload Positions', href: '#' },
            ]}
        >
            <Head title="Upload Positions" />

            <div className="min-h-[calc(100vh-64px)] w-full bg-muted/10 p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8 max-w-3xl">
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                        Upload Positions
                    </h1>
                    <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                        Bulk import job roles via CSV or Excel to update your
                        organizational structure.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="pb-24">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        {/* LEFT COLUMN: Upload & Preview */}
                        <div className="space-y-8 lg:col-span-8">
                            {/* Download Template Section */}
                            <Card className="border-border bg-background shadow-sm">
                                <CardContent className="flex flex-col justify-between gap-6 p-6 sm:flex-row sm:items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <FileSpreadsheet className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-foreground">
                                                Download Template
                                            </h3>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Ensure your data matches our
                                                system requirements by using the
                                                standard template.
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-11 shrink-0 px-6 font-semibold shadow-sm"
                                        onClick={() =>
                                            (window.location.href = `${API}/positions/template/download`)
                                        }
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        Download CSV Template
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Drag & Drop Upload Area */}
                            <div
                                className={`relative flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-primary/50 hover:bg-muted/50'} ${errors.file ? 'border-destructive bg-destructive/5' : ''} `}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/plain"
                                    className="hidden"
                                    onChange={handleChange}
                                />

                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
                                    <UploadCloud className="h-6 w-6" />
                                </div>
                                <h3 className="text-center text-lg font-bold text-foreground">
                                    {data.file
                                        ? data.file.name
                                        : 'Click to upload or drag and drop'}
                                </h3>
                                <p className="mt-2 mb-6 text-center text-sm text-muted-foreground">
                                    {data.file
                                        ? `${(data.file.size / 1024).toFixed(2)} KB`
                                        : 'CSV, XLS, or TXT up to 5MB'}
                                </p>

                                <Button
                                    type="button"
                                    className="pointer-events-none bg-primary px-8 font-bold text-primary-foreground shadow-sm"
                                >
                                    {data.file
                                        ? 'File Selected'
                                        : 'Select File'}
                                </Button>

                                {errors.file && (
                                    <p className="mt-4 text-sm font-medium text-destructive">
                                        {errors.file}
                                    </p>
                                )}
                            </div>

                            {/* Data Validation Preview (Static Mock matching screenshot) */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-bold text-foreground">
                                        Validation Preview
                                    </h3>
                                    <Badge
                                        variant="secondary"
                                        className="bg-muted font-semibold text-muted-foreground shadow-none"
                                    >
                                        3 Rows Found
                                    </Badge>
                                </div>

                                <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                                                <TableHead className="h-12 w-[100px] pl-6 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    Status
                                                </TableHead>
                                                <TableHead className="w-[200px] text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    Position Name
                                                </TableHead>
                                                <TableHead className="w-[140px] text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    Job Code
                                                </TableHead>
                                                <TableHead className="w-[160px] text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    Department
                                                </TableHead>
                                                <TableHead className="min-w-[200px] pr-6 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    Issues
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow className="hover:bg-muted/20">
                                                <TableCell className="py-4 pl-6">
                                                    <div className="flex items-center text-emerald-600">
                                                        <CheckCircle2 className="h-5 w-5" />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm font-medium text-foreground">
                                                    Senior Designer
                                                </TableCell>
                                                <TableCell className="font-mono text-xs text-muted-foreground">
                                                    DSGN-001
                                                </TableCell>
                                                <TableCell className="text-sm font-medium text-muted-foreground">
                                                    Product Design
                                                </TableCell>
                                                <TableCell className="pr-6 text-sm text-muted-foreground">
                                                    —
                                                </TableCell>
                                            </TableRow>

                                            <TableRow className="hover:bg-muted/20">
                                                <TableCell className="py-4 pl-6">
                                                    <div className="flex items-center text-amber-600">
                                                        <AlertCircle className="h-5 w-5" />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm font-medium text-foreground">
                                                    Junior Developer
                                                </TableCell>
                                                <TableCell className="font-mono text-xs text-muted-foreground">
                                                    ENGR-442
                                                </TableCell>
                                                <TableCell className="text-sm font-medium text-muted-foreground">
                                                    Engineering
                                                </TableCell>
                                                <TableCell className="pr-6 text-sm font-medium text-amber-600">
                                                    Missing cost center
                                                </TableCell>
                                            </TableRow>

                                            <TableRow className="hover:bg-muted/20">
                                                <TableCell className="py-4 pl-6">
                                                    <div className="flex items-center text-destructive">
                                                        <XCircle className="h-5 w-5" />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm font-medium text-foreground">
                                                    Lead Engineer
                                                </TableCell>
                                                <TableCell className="font-mono text-xs text-muted-foreground">
                                                    ENGR-001
                                                </TableCell>
                                                <TableCell className="text-sm font-medium text-muted-foreground">
                                                    Engineering
                                                </TableCell>
                                                <TableCell className="pr-6 text-sm font-medium text-destructive">
                                                    Duplicate job code
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Guidelines Context */}
                        <div className="space-y-6 lg:col-span-4">
                            <Card className="border-border bg-background shadow-sm">
                                <CardHeader className="border-b border-border/50 pb-2">
                                    <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                        <Info className="h-5 w-5 text-primary" />
                                        Import Guidelines
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-8 pt-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold text-foreground">
                                                File Formats
                                            </h4>
                                            <p className="text-xs leading-relaxed font-medium text-muted-foreground">
                                                Accepts CSV, XLSX, and TXT
                                                (tab-delimited) files only.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
                                            <ChevronRight className="h-4 w-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold text-foreground">
                                                Required Fields
                                            </h4>
                                            <p className="text-xs leading-relaxed font-medium text-muted-foreground">
                                                'Position Name' is a mandatory
                                                field for all entries.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
                                            <Key className="h-4 w-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold text-foreground">
                                                Unique Constraint
                                            </h4>
                                            <p className="text-xs leading-relaxed font-medium text-muted-foreground">
                                                'Job Code' must be unique across
                                                the organization.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
                                            <Network className="h-4 w-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold text-foreground">
                                                Department Mapping
                                            </h4>
                                            <p className="text-xs leading-relaxed font-medium text-muted-foreground">
                                                Department names must match
                                                exact Org Unit IDs in settings.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
                                        <p className="text-xs leading-relaxed font-medium text-foreground/80">
                                            Need help?{' '}
                                            <span className="cursor-pointer font-bold text-primary hover:underline">
                                                Contact system administrator
                                            </span>{' '}
                                            for bulk mapping support.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="mt-8 flex flex-col-reverse items-center justify-center gap-4 border-t pt-6 pb-4 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="ghost"
                            className="h-11 px-6 font-bold text-muted-foreground hover:text-foreground"
                            onClick={() => router.visit(`${API}/positions`)}
                        >
                            Discard
                        </Button>
                        <Button
                            type="submit"
                            className="h-11 bg-primary px-8 font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
                            disabled={processing || !data.file}
                        >
                            {processing
                                ? 'Processing...'
                                : 'Process & Save Positions'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
