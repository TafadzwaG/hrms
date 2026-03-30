import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    Download,
    FileSpreadsheet,
    Loader2,
    Upload,
    X,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

type ImportPageProps = {
    template_url: string;
};

export default function AssetImport() {
    const { template_url } = usePage<ImportPageProps>().props;

    const { data, setData, post, processing, errors } = useForm<{
        file: File | null;
    }>({ file: null });

    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback(
        (file: File | null) => {
            if (!file) return;
            const ext = file.name.split('.').pop()?.toLowerCase();
            if (ext !== 'xlsx' && ext !== 'xls') return;
            setData('file', file);
        },
        [setData],
    );

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0] ?? null;
        handleFile(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => setDragOver(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFile(e.target.files?.[0] ?? null);
    };

    const clearFile = () => {
        setData('file', null);
        if (inputRef.current) inputRef.current.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/assets/import', { forceFormData: true });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Assets', href: '/assets' },
                { title: 'Import Assets', href: '#' },
            ]}
        >
            <Head title="Import Assets" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <Button asChild variant="outline" size="icon">
                        <Link href="/assets">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-semibold text-foreground">
                            Import Assets
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Bulk-import assets from an Excel spreadsheet.
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Instructions */}
                    <Card className="border-border bg-background shadow-sm lg:col-span-1">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold">
                                How it works
                            </CardTitle>
                        </CardHeader>
                        <Separator />
                        <CardContent className="space-y-3 pt-4 text-sm text-muted-foreground">
                            <Step n={1} text="Download the template file below." />
                            <Step n={2} text="Fill in your asset data. Required columns: Asset Tag, Name, Category." />
                            <Step n={3} text="Category, Vendor and Location must match existing names exactly." />
                            <Step n={4} text="Valid Status values: available, assigned, maintenance, disposed, retired, lost, damaged." />
                            <Step n={5} text="Valid Condition values: new, good, fair, poor, damaged." />
                            <Step n={6} text="Upload the completed file and click Import." />

                            <Separator />

                            <Button asChild variant="outline" size="sm" className="w-full">
                                <a href={template_url} download>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Template
                                </a>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Upload form */}
                    <Card className="border-border bg-background shadow-sm lg:col-span-2">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold">
                                Upload File
                            </CardTitle>
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-4">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Dropzone */}
                                {!data.file ? (
                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onClick={() => inputRef.current?.click()}
                                        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed py-14 text-sm transition-colors ${
                                            dragOver
                                                ? 'border-foreground bg-muted/40'
                                                : 'border-border hover:border-foreground/40 hover:bg-muted/20'
                                        }`}
                                    >
                                        <FileSpreadsheet className="h-10 w-10 text-muted-foreground" />
                                        <p className="font-medium text-foreground">
                                            Drop your Excel file here
                                        </p>
                                        <p className="text-muted-foreground">
                                            or click to browse — .xlsx or .xls, max 10 MB
                                        </p>
                                        <input
                                            ref={inputRef}
                                            type="file"
                                            accept=".xlsx,.xls"
                                            className="sr-only"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 p-4">
                                        <CheckCircle2 className="h-5 w-5 shrink-0 text-foreground" />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-foreground">
                                                {data.file.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {(data.file.size / 1024).toFixed(1)} KB
                                            </p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={clearFile}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}

                                {errors.file && (
                                    <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                        {errors.file}
                                    </div>
                                )}

                                <div className="flex justify-end gap-2">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href="/assets">Cancel</Link>
                                    </Button>
                                    <Button
                                        type="submit"
                                        size="sm"
                                        disabled={!data.file || processing}
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Importing…
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="mr-2 h-4 w-4" />
                                                Import Assets
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

function Step({ n, text }: { n: number; text: string }) {
    return (
        <div className="flex gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                {n}
            </span>
            <span>{text}</span>
        </div>
    );
}
