import { OcrStatusBadge } from '@/components/employees/ocr-status-badge';
import { OcrTextViewer } from '@/components/employees/ocr-text-viewer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, RefreshCcw } from 'lucide-react';
import moment from 'moment';

type EmployeeSummary = {
    id: number;
    full_name: string;
    staff_number: string;
    show_url: string;
    documents_url: string;
};

type OcrDocument = {
    id: number;
    title: string;
    file_name: string;
    document_type: { code: string; name: string } | null;
    ocr_status: 'uploaded' | 'queued' | 'processing' | 'completed' | 'failed' | null;
    ocr_engine: string | null;
    ocr_language: string | null;
    ocr_page_count: number | null;
    ocr_avg_confidence: number | null;
    ocr_error_message: string | null;
    ocr_processed_at: string | null;
    ocr_full_text: string | null;
    ocr_raw_json: Record<string, unknown> | null;
    ocr_metadata_json: Record<string, unknown> | null;
    ocr_results: {
        id: number;
        page_number: number;
        text: string | null;
        confidence: number | null;
    }[];
    show_url: string;
    retry_ocr_url: string;
};

export default function EmployeeDocumentOcrResult() {
    const { employee, document } = usePage().props as unknown as {
        employee: EmployeeSummary;
        document: OcrDocument;
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Employees', href: '/employees' },
                { title: employee.full_name, href: employee.show_url },
                { title: 'Documents', href: employee.documents_url },
                { title: document.title, href: document.show_url },
                { title: 'OCR Result', href: `${document.show_url}/ocr` },
            ]}
        >
            <Head title={`OCR Result - ${document.title}`} />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Button asChild variant="outline" size="icon">
                                <Link href={document.show_url}>
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <h1 className="text-2xl font-semibold text-foreground">
                                OCR Result
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Full extracted text and raw OCR payload for {document.title}.
                        </p>
                    </div>
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

                <Card className="border-border bg-background shadow-sm">
                    <CardHeader>
                        <CardTitle>OCR Run Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <OcrStatusBadge status={document.ocr_status} />
                            {document.document_type?.code ? (
                                <span>{document.document_type.code}</span>
                            ) : null}
                        </div>
                        <span>{document.file_name}</span>
                        <span>{document.ocr_engine ?? '—'}</span>
                        <span>{document.ocr_language ?? '—'}</span>
                        <span>{document.ocr_page_count ?? 0} page(s)</span>
                        <span>
                            {document.ocr_avg_confidence != null
                                ? `${Math.round(document.ocr_avg_confidence * 100)}% confidence`
                                : 'No confidence'}
                        </span>
                        <span>
                            {document.ocr_processed_at
                                ? moment(document.ocr_processed_at).format(
                                      'lll',
                                  )
                                : 'Pending'}
                        </span>
                    </CardContent>
                </Card>

                <OcrTextViewer
                    fullText={document.ocr_full_text}
                    pages={document.ocr_results}
                />

                <div className="grid gap-6 xl:grid-cols-2">
                    <Card className="border-border bg-background shadow-sm">
                        <CardHeader>
                            <CardTitle>Run Metadata</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="overflow-x-auto rounded-lg border bg-muted/20 p-4 text-xs text-foreground">
                                {JSON.stringify(
                                    document.ocr_metadata_json ?? {},
                                    null,
                                    2,
                                )}
                            </pre>
                        </CardContent>
                    </Card>
                    <Card className="border-border bg-background shadow-sm">
                        <CardHeader>
                            <CardTitle>Raw OCR JSON</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="max-h-[32rem] overflow-auto rounded-lg border bg-muted/20 p-4 text-xs text-foreground">
                                {JSON.stringify(
                                    document.ocr_raw_json ?? {},
                                    null,
                                    2,
                                )}
                            </pre>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
