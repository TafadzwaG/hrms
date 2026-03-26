import { DocumentUploadCard } from '@/components/employees/document-upload-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, ScanSearch } from 'lucide-react';

type EmployeeSummary = {
    id: number;
    full_name: string;
    show_url: string;
    documents_url: string;
};

type OptionPayload = {
    document_types: { id: number; code: string; name: string }[];
    document_access_policies: string[];
    default_engine: string;
    default_language: string;
    accepted_extensions: string[];
    ocr_enabled?: boolean;
};

type LinkPayload = {
    index: string;
    store: string;
};

export default function EmployeeDocumentsUpload() {
    const { employee, options, links } = usePage().props as unknown as {
        employee: EmployeeSummary;
        options: OptionPayload;
        links: LinkPayload;
    };

    const { data, setData, post, processing, progress, errors } = useForm({
        document_type_id: '',
        title: '',
        file: null as File | null,
        issue_date: '',
        expiry_date: '',
        access_policy:
            options.document_access_policies[1] ??
            options.document_access_policies[0] ??
            'internal',
        metadata_json: '',
        process_ocr: true,
        language: options.default_language,
        engine: options.default_engine,
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        post(links.store, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Employees', href: '/employees' },
                { title: employee.full_name, href: employee.show_url },
                { title: 'Documents', href: employee.documents_url },
                { title: 'Upload', href: `${links.index}/upload` },
            ]}
        >
            <Head title={`Upload OCR Document - ${employee.full_name}`} />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Button asChild variant="outline" size="icon">
                                <Link href={links.index}>
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <h1 className="text-2xl font-semibold text-foreground">
                                Upload OCR Document
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Upload a private employee document and queue it for OCR processing.
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={submit}
                    className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"
                >
                    <DocumentUploadCard
                        file={data.file}
                        setFile={(file) => setData('file', file)}
                        processing={processing}
                        progress={progress?.percentage ?? null}
                        errors={errors}
                    />

                    <Card className="border-border bg-background shadow-sm">
                        <CardHeader>
                            <CardTitle>Document Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {options.ocr_enabled === false && (
                                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
                                    OCR database support is not available yet. Run `php artisan migrate` to enable OCR processing.
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="document_type_id">
                                    Document Type
                                </Label>
                                <Select
                                    value={data.document_type_id || undefined}
                                    onValueChange={(value) =>
                                        setData('document_type_id', value)
                                    }
                                >
                                    <SelectTrigger id="document_type_id">
                                        <SelectValue placeholder="Select a document type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options.document_types.map((type) => (
                                            <SelectItem
                                                key={type.id}
                                                value={type.id.toString()}
                                            >
                                                {type.code} - {type.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.document_type_id ? (
                                    <p className="text-xs text-destructive">
                                        {errors.document_type_id}
                                    </p>
                                ) : null}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(event) =>
                                        setData('title', event.target.value)
                                    }
                                    placeholder="Passport scan"
                                />
                                {errors.title ? (
                                    <p className="text-xs text-destructive">
                                        {errors.title}
                                    </p>
                                ) : null}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="engine">OCR Engine</Label>
                                    <Select
                                        value={data.engine}
                                        onValueChange={(value) =>
                                            setData('engine', value)
                                        }
                                    >
                                        <SelectTrigger id="engine">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="paddleocr">
                                                PaddleOCR
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="language">Language</Label>
                                    <Input
                                        id="language"
                                        value={data.language}
                                        onChange={(event) =>
                                            setData(
                                                'language',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="en"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="issue_date">Issue Date</Label>
                                    <Input
                                        id="issue_date"
                                        type="date"
                                        value={data.issue_date}
                                        onChange={(event) =>
                                            setData(
                                                'issue_date',
                                                event.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="expiry_date">
                                        Expiry Date
                                    </Label>
                                    <Input
                                        id="expiry_date"
                                        type="date"
                                        value={data.expiry_date}
                                        onChange={(event) =>
                                            setData(
                                                'expiry_date',
                                                event.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="access_policy">
                                    Access Policy
                                </Label>
                                <Select
                                    value={data.access_policy}
                                    onValueChange={(value) =>
                                        setData('access_policy', value)
                                    }
                                >
                                    <SelectTrigger id="access_policy">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options.document_access_policies.map(
                                            (policy) => (
                                                <SelectItem
                                                    key={policy}
                                                    value={policy}
                                                >
                                                    {policy}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="metadata_json">
                                    Metadata (JSON)
                                </Label>
                                <Textarea
                                    id="metadata_json"
                                    value={data.metadata_json}
                                    onChange={(event) =>
                                        setData(
                                            'metadata_json',
                                            event.target.value,
                                        )
                                    }
                                    className="min-h-24 font-mono text-xs"
                                    placeholder='{"source":"employee-ocr"}'
                                />
                                {errors.metadata_json ? (
                                    <p className="text-xs text-destructive">
                                        {errors.metadata_json}
                                    </p>
                                ) : null}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button asChild type="button" variant="outline">
                                    <Link href={links.index}>Cancel</Link>
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing || !data.file || options.ocr_enabled === false}
                                >
                                    <ScanSearch className="mr-2 h-4 w-4" />
                                    {processing
                                        ? 'Uploading...'
                                        : 'Upload & Queue OCR'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
