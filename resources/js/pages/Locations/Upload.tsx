import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    Download,
    ExternalLink,
    FileSpreadsheet,
    FileText,
    Info,
    Map,
    MapPin,
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

export default function LocationUpload() {
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

        post(`${API}/locations/import`, {
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
                { title: 'Locations', href: `${API}/locations` },
                { title: 'Upload Locations', href: '#' },
            ]}
        >
            <Head title="Upload Locations" />

            <div className="min-h-[calc(100vh-64px)] w-full bg-muted/10 p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8 max-w-3xl">
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                        Upload Locations
                    </h1>
                    <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                        Bulk import geographical site data via CSV or Excel
                        template.
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
                                                Download CSV Template
                                            </h3>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Ensure your data includes
                                                required fields:{' '}
                                                <span className="font-medium italic">
                                                    Name, Timezone, Address,
                                                    Latitude,
                                                </span>{' '}
                                                and{' '}
                                                <span className="font-medium italic">
                                                    Longitude
                                                </span>
                                                .
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="shrink-0 font-semibold shadow-sm"
                                        onClick={() =>
                                            (window.location.href = `${API}/locations/template/download`)
                                        }
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Template
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
                                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                    className="hidden"
                                    onChange={handleChange}
                                />

                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground shadow-sm">
                                    <UploadCloud className="h-6 w-6" />
                                </div>
                                <h3 className="text-center text-base font-bold text-foreground">
                                    {data.file
                                        ? data.file.name
                                        : 'Click to upload or drag and drop'}
                                </h3>
                                <p className="mt-1 text-center text-sm text-muted-foreground">
                                    {data.file
                                        ? `${(data.file.size / 1024).toFixed(2)} KB`
                                        : 'CSV or XLSX (max. 5MB)'}
                                </p>
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
                                        Data Validation Preview
                                    </h3>
                                    <Badge
                                        variant="secondary"
                                        className="bg-muted font-semibold text-muted-foreground shadow-none"
                                    >
                                        3 records found
                                    </Badge>
                                </div>

                                <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                                                <TableHead className="h-12 w-[120px] pl-6 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    Status
                                                </TableHead>
                                                <TableHead className="w-[140px] text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    Site Name
                                                </TableHead>
                                                <TableHead className="w-[180px] text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    Timezone
                                                </TableHead>
                                                <TableHead className="w-[160px] text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    Coordinates
                                                </TableHead>
                                                <TableHead className="min-w-[200px] pr-6 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    Issues
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow className="hover:bg-muted/20">
                                                <TableCell className="py-4 pl-6">
                                                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                                                        <CheckCircle2 className="h-4 w-4" />{' '}
                                                        Valid
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm font-medium text-foreground">
                                                    Austin HQ
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm font-medium text-foreground">
                                                        America/Chicago
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        (UTC-6)
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-mono text-sm text-muted-foreground">
                                                    30.267, -97.743
                                                </TableCell>
                                                <TableCell className="pr-6 text-sm text-muted-foreground">
                                                    —
                                                </TableCell>
                                            </TableRow>

                                            <TableRow className="hover:bg-muted/20">
                                                <TableCell className="py-4 pl-6">
                                                    <div className="flex items-center gap-2 text-sm font-semibold text-amber-600">
                                                        <AlertCircle className="h-4 w-4" />{' '}
                                                        Warning
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm font-medium text-foreground">
                                                    Berlin Hub
                                                </TableCell>
                                                <TableCell className="text-sm font-medium text-muted-foreground italic">
                                                    Auto-detected
                                                </TableCell>
                                                <TableCell className="font-mono text-sm text-muted-foreground">
                                                    52.520, 13.405
                                                </TableCell>
                                                <TableCell className="pr-6 text-sm font-medium text-amber-600">
                                                    Missing timezone; mapped to
                                                    Europe/Berlin
                                                </TableCell>
                                            </TableRow>

                                            <TableRow className="hover:bg-muted/20">
                                                <TableCell className="py-4 pl-6">
                                                    <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
                                                        <XCircle className="h-4 w-4" />{' '}
                                                        Error
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm font-medium text-foreground">
                                                    London Tech
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm font-medium text-foreground">
                                                        Europe/London
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        (UTC+0)
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-mono text-sm text-muted-foreground">
                                                    NaN, -0.127
                                                </TableCell>
                                                <TableCell className="pr-6 text-sm font-medium text-destructive">
                                                    Invalid latitude; duplicate
                                                    site code (LOC-04)
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
                                <CardContent className="space-y-6 pt-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold text-foreground">
                                                File Formats
                                            </h4>
                                            <p className="text-xs leading-relaxed font-medium text-muted-foreground">
                                                Only .csv and .xlsx files are
                                                supported. CSV files must be
                                                UTF-8 encoded to support
                                                international addresses.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
                                            <Clock className="h-4 w-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold text-foreground">
                                                Timezone Standards
                                            </h4>
                                            <p className="text-xs leading-relaxed font-medium text-muted-foreground">
                                                Use IANA database names (e.g.
                                                "Asia/Tokyo") or UTC offsets.
                                                Leave blank for auto-detection
                                                based on address.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
                                            <MapPin className="h-4 w-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold text-foreground">
                                                Coordinate Precision
                                            </h4>
                                            <p className="text-xs leading-relaxed font-medium text-muted-foreground">
                                                Lat/Long should have at least 4
                                                decimal places for accurate
                                                geofencing results within the
                                                mobile app.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
                                        <h4 className="mb-2 text-[10px] font-bold tracking-widest text-primary uppercase">
                                            Need Help?
                                        </h4>
                                        <p className="mb-3 text-xs leading-relaxed font-medium text-foreground/80">
                                            View our documentation for a full
                                            list of country codes and timezone
                                            strings.
                                        </p>
                                        <Button
                                            variant="link"
                                            className="h-auto px-0 font-bold text-primary"
                                        >
                                            Open Docs{' '}
                                            <ExternalLink className="ml-1 h-3 w-3" />
                                        </Button>
                                    </div>

                                    <div className="flex h-32 flex-col items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground">
                                        <Map className="mb-2 h-8 w-8 opacity-50" />
                                        <span className="text-[10px] font-bold tracking-widest uppercase">
                                            Preview Map
                                        </span>
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
                            className="font-bold text-muted-foreground hover:text-foreground"
                            onClick={() => router.visit(`${API}/locations`)}
                        >
                            Discard
                        </Button>
                        <Button
                            type="submit"
                            className="px-8 font-bold shadow-sm"
                            disabled={processing || !data.file}
                        >
                            {processing
                                ? 'Uploading...'
                                : 'Process & Save Locations'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
