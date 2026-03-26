import { OcrStatusBadge } from '@/components/employees/ocr-status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, FileText, RefreshCcw, ScanSearch, UploadCloud, Zap } from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';

type EmployeeSummary = {
    id: number;
    full_name: string;
    staff_number: string;
    position: { id: number; name: string } | null;
    department: { id: number; name: string } | null;
    show_url: string;
    documents_url: string;
    upload_url: string;
    ocr_enabled?: boolean;
};

type EmployeeDocument = {
    id: number;
    title: string;
    file_name: string;
    access_policy: string;
    created_at: string | null;
    document_type: { id: number; code: string; name: string } | null;
    ocr_status: 'uploaded' | 'queued' | 'processing' | 'completed' | 'failed' | null;
    ocr_engine: string | null;
    ocr_language: string | null;
    ocr_page_count: number | null;
    ocr_avg_confidence: number | null;
    ocr_error_message: string | null;
    ocr_processed_at: string | null;
    ocr_excerpt: string | null;
    download_url: string;
    show_url: string;
    ocr_result_url: string;
    retry_ocr_url: string;
    process_now_url: string;
};

type PaginatedDocuments = {
    data: EmployeeDocument[];
    current_page: number;
    last_page: number;
};

export default function EmployeeDocumentsIndex() {
    const { employee, documents, stats } = usePage().props as unknown as {
        employee: EmployeeSummary;
        documents: PaginatedDocuments;
        stats: {
            total: number;
            queued: number;
            completed: number;
            failed: number;
        };
    };

    const [processingId, setProcessingId] = useState<number | null>(null);

    const handleProcessNow = (doc: EmployeeDocument) => {
        setProcessingId(doc.id);
        router.post(doc.process_now_url, {}, {
            onFinish: () => setProcessingId(null),
        });
    };

    const goToPage = (page: number) => {
        router.get(
            employee.documents_url,
            { page },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Employees', href: '/employees' },
                { title: employee.full_name, href: employee.show_url },
                { title: 'Documents', href: employee.documents_url },
            ]}
        >
            <Head title={`${employee.full_name} Documents`} />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Button asChild variant="outline" size="icon">
                                <Link href={employee.show_url}>
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <h1 className="text-2xl font-semibold text-foreground">
                                Employee Documents
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            OCR history and privately stored documents for {employee.full_name}.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline">
                            <Link href={employee.show_url}>
                                <FileText className="mr-2 h-4 w-4" />
                                Employee Profile
                            </Link>
                        </Button>
                        {employee.ocr_enabled !== false && (
                            <Button asChild>
                                <Link href={employee.upload_url}>
                                    <UploadCloud className="mr-2 h-4 w-4" />
                                    Upload OCR Document
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                {employee.ocr_enabled === false && (
                    <Card className="border-amber-200 bg-amber-50 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/30">
                        <CardContent className="p-4 text-sm text-amber-900 dark:text-amber-100">
                            OCR database support is not available yet. Run `php artisan migrate` to enable OCR processing.
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-4 md:grid-cols-4">
                    <StatCard title="Total Documents" value={stats.total.toString()} />
                    <StatCard title="Queued" value={stats.queued.toString()} />
                    <StatCard title="Completed OCR" value={stats.completed.toString()} />
                    <StatCard title="Failed OCR" value={stats.failed.toString()} />
                </div>

                <Card className="border-border bg-background shadow-sm">
                    <CardHeader>
                        <CardTitle>OCR Processing History</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {documents.data.length === 0 ? (
                            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                                No employee OCR documents have been uploaded yet.
                            </div>
                        ) : (
                            documents.data.map((document) => (
                                <div
                                    key={document.id}
                                    className="flex flex-col gap-4 rounded-xl border border-border p-4 shadow-sm lg:flex-row lg:items-start lg:justify-between"
                                >
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="text-sm font-semibold text-foreground">
                                                {document.title}
                                            </p>
                                            {employee.ocr_enabled !== false && (
                                                <OcrStatusBadge status={document.ocr_status} />
                                            )}
                                            {document.document_type?.code && (
                                                <Badge variant="secondary">{document.document_type.code}</Badge>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                            <span>{document.file_name}</span>
                                            <span>Uploaded {moment(document.created_at).fromNow()}</span>
                                            <span className="capitalize">{document.access_policy}</span>
                                            {document.ocr_page_count ? <span>{document.ocr_page_count} page(s)</span> : null}
                                            {document.ocr_avg_confidence != null ? (
                                                <span>{Math.round(document.ocr_avg_confidence * 100)}% confidence</span>
                                            ) : null}
                                        </div>

                                        {document.ocr_excerpt ? (
                                            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                                                {document.ocr_excerpt}
                                            </p>
                                        ) : null}

                                        {document.ocr_error_message ? (
                                            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
                                                <AlertCircle className="mt-0.5 h-4 w-4" />
                                                <span>{document.ocr_error_message}</span>
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <Button asChild variant="outline">
                                            <Link href={document.show_url}>
                                                <ScanSearch className="mr-2 h-4 w-4" />
                                                Open
                                            </Link>
                                        </Button>
                                        {employee.ocr_enabled !== false && document.ocr_status === 'completed' && (
                                            <Button asChild variant="outline">
                                                <Link href={document.ocr_result_url}>
                                                    <FileText className="mr-2 h-4 w-4" />
                                                    View OCR
                                                </Link>
                                            </Button>
                                        )}
                                        {employee.ocr_enabled !== false && (document.ocr_status === 'queued' || document.ocr_status === 'uploaded') && (
                                            <Button
                                                type="button"
                                                variant="default"
                                                size="sm"
                                                onClick={() => handleProcessNow(document)}
                                                disabled={processingId === document.id}
                                            >
                                                <Zap className="mr-2 h-4 w-4" />
                                                {processingId === document.id ? 'Processing…' : 'Process Now'}
                                            </Button>
                                        )}
                                        {employee.ocr_enabled !== false && document.ocr_status === 'failed' && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    router.post(document.retry_ocr_url, {}, { preserveScroll: true })
                                                }
                                            >
                                                <RefreshCcw className="mr-2 h-4 w-4" />
                                                Retry
                                            </Button>
                                        )}
                                        <Button asChild variant="ghost">
                                            <a href={document.download_url}>
                                                <FileText className="mr-2 h-4 w-4" />
                                                Download
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}

                        {documents.last_page > 1 && (
                            <div className="flex items-center justify-between border-t pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => goToPage(documents.current_page - 1)}
                                    disabled={documents.current_page <= 1}
                                >
                                    Previous
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    Page {documents.current_page} of {documents.last_page}
                                </span>
                                <Button
                                    variant="outline"
                                    onClick={() => goToPage(documents.current_page + 1)}
                                    disabled={documents.current_page >= documents.last_page}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

function StatCard({ title, value }: { title: string; value: string }) {
    return (
        <Card className="border-border bg-background shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-semibold text-foreground">{value}</p>
            </CardContent>
        </Card>
    );
}
