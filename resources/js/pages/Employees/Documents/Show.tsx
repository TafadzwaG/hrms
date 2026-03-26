import { OcrStatusBadge } from '@/components/employees/ocr-status-badge';
import { OcrTextViewer } from '@/components/employees/ocr-text-viewer';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, Download, Loader2, RefreshCcw, ScanSearch, Zap } from 'lucide-react';
import moment from 'moment';
import { useEffect, useRef, useState, type ReactNode } from 'react';

type EmployeeSummary = {
    id: number;
    full_name: string;
    staff_number: string;
    show_url: string;
    documents_url: string;
};

type EmployeeDocument = {
    id: number;
    title: string;
    file_name: string;
    issue_date: string | null;
    expiry_date: string | null;
    access_policy: string;
    metadata_pretty: string;
    document_type: {
        id: number;
        code: string;
        name: string;
        sensitivity_level: string | null;
    } | null;
    created_at: string | null;
    updated_at: string | null;
    ocr_status: 'uploaded' | 'queued' | 'processing' | 'completed' | 'failed' | null;
    ocr_engine: string | null;
    ocr_language: string | null;
    ocr_page_count: number | null;
    ocr_avg_confidence: number | null;
    ocr_error_message: string | null;
    ocr_processed_at: string | null;
    ocr_full_text: string | null;
    ocr_results: {
        id: number;
        page_number: number;
        text: string | null;
        confidence: number | null;
    }[];
    download_url: string;
    ocr_result_url: string;
    retry_ocr_url: string;
    process_now_url: string;
};

const POLLING_STATUSES = ['queued', 'processing'] as const;
const POLL_INTERVAL_MS = 3000;

export default function EmployeeDocumentShow() {
    const { employee, document } = usePage().props as unknown as {
        employee: EmployeeSummary;
        document: EmployeeDocument;
    };

    const [processingNow, setProcessingNow] = useState(false);
    const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const isPolling = POLLING_STATUSES.includes(document.ocr_status as (typeof POLLING_STATUSES)[number]);

    useEffect(() => {
        if (!isPolling) {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
            return;
        }

        pollingRef.current = setInterval(() => {
            router.reload({ only: ['document'] });
        }, POLL_INTERVAL_MS);

        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
        };
    }, [isPolling]);

    const handleProcessNow = () => {
        setProcessingNow(true);
        router.post(
            document.process_now_url,
            {},
            {
                onFinish: () => setProcessingNow(false),
            },
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Employees', href: '/employees' },
                { title: employee.full_name, href: employee.show_url },
                { title: 'Documents', href: employee.documents_url },
                {
                    title: document.title,
                    href: `/employees/${employee.id}/documents/${document.id}`,
                },
            ]}
        >
            <Head title={`${document.title} - ${employee.full_name}`} />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Button asChild variant="outline" size="icon">
                                <Link href={employee.documents_url}>
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <h1 className="text-2xl font-semibold text-foreground">
                                {document.title}
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            OCR summary and extracted text for {employee.full_name}.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline">
                            <a href={document.download_url}>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </a>
                        </Button>
                        {document.ocr_status === 'completed' && (
                            <Button asChild variant="outline">
                                <Link href={document.ocr_result_url}>
                                    <ScanSearch className="mr-2 h-4 w-4" />
                                    Full OCR Result
                                </Link>
                            </Button>
                        )}
                        {(document.ocr_status === 'queued' || document.ocr_status === 'uploaded') && (
                            <Button
                                type="button"
                                variant="default"
                                onClick={handleProcessNow}
                                disabled={processingNow}
                            >
                                {processingNow ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Zap className="mr-2 h-4 w-4" />
                                )}
                                {processingNow ? 'Processing…' : 'Process Now'}
                            </Button>
                        )}
                        {document.ocr_status === 'failed' && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    router.post(
                                        document.retry_ocr_url,
                                        {},
                                        { preserveScroll: true },
                                    )
                                }
                            >
                                <RefreshCcw className="mr-2 h-4 w-4" />
                                Retry OCR
                            </Button>
                        )}
                    </div>
                </div>

                {isPolling && (
                    <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
                        <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                        <span>
                            OCR is{' '}
                            {document.ocr_status === 'processing' ? 'currently processing this document' : 'queued and waiting for a worker'}.
                            This page will update automatically.
                        </span>
                    </div>
                )}

                {document.ocr_error_message ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>OCR failed</AlertTitle>
                        <AlertDescription>
                            {document.ocr_error_message}
                        </AlertDescription>
                    </Alert>
                ) : null}

                <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                    <Card className="border-border bg-background shadow-sm">
                        <CardHeader>
                            <CardTitle>Document Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex flex-wrap items-center gap-2">
                                <OcrStatusBadge status={document.ocr_status} />
                                {document.document_type?.code ? (
                                    <Badge variant="secondary">
                                        {document.document_type.code}
                                    </Badge>
                                ) : null}
                            </div>
                            <Detail label="File">{document.file_name}</Detail>
                            <Detail label="Access Policy" className="capitalize">
                                {document.access_policy}
                            </Detail>
                            <Detail label="OCR Engine">
                                {document.ocr_engine ?? '—'}
                            </Detail>
                            <Detail label="Language">
                                {document.ocr_language ?? '—'}
                            </Detail>
                            <Detail label="Pages">
                                {document.ocr_page_count != null
                                    ? document.ocr_page_count
                                    : '—'}
                            </Detail>
                            <Detail label="Average Confidence">
                                {document.ocr_avg_confidence != null
                                    ? `${Math.round(document.ocr_avg_confidence * 100)}%`
                                    : '—'}
                            </Detail>
                            <Detail label="Processed">
                                {document.ocr_processed_at
                                    ? moment(document.ocr_processed_at).format('lll')
                                    : 'Pending'}
                            </Detail>
                            <Detail label="Uploaded">
                                {document.created_at
                                    ? moment(document.created_at).format('lll')
                                    : '—'}
                            </Detail>
                            <Detail label="Issue Date">
                                {document.issue_date
                                    ? moment(document.issue_date).format('ll')
                                    : '—'}
                            </Detail>
                            <Detail label="Expiry Date">
                                {document.expiry_date
                                    ? moment(document.expiry_date).format('ll')
                                    : '—'}
                            </Detail>
                        </CardContent>
                    </Card>

                    <OcrTextViewer
                        title="OCR Preview"
                        fullText={document.ocr_full_text}
                        pages={document.ocr_results}
                    />
                </div>

                {document.metadata_pretty ? (
                    <Card className="border-border bg-background shadow-sm">
                        <CardHeader>
                            <CardTitle>Document Metadata</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="overflow-x-auto rounded-lg border bg-muted/20 p-4 text-xs text-foreground">
                                {document.metadata_pretty}
                            </pre>
                        </CardContent>
                    </Card>
                ) : null}
            </div>
        </AppLayout>
    );
}

function Detail({
    label,
    children,
    className,
}: {
    label: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {label}
            </p>
            <p className={className}>{children}</p>
        </div>
    );
}
