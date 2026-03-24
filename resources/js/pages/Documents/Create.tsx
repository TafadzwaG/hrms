import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Clock,
    FileText,
    Info,
    Paperclip,
    Save,
    Scale,
    ShieldCheck,
    UploadCloud,
} from 'lucide-react';
import { useState } from 'react';

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

type Employee = {
    id: number;
    first_name: string;
    middle_name: string | null;
    surname: string;
    staff_number: string;
};

type DocumentType = {
    id: number;
    code: string;
    name: string;
    sensitivity_level: string;
};

export default function DocumentCreate() {
    const { employees, documentTypes, accessPolicyOptions } = usePage()
        .props as unknown as {
        employees: Employee[];
        documentTypes: DocumentType[];
        accessPolicyOptions: string[];
    };

    const basePath = '/documents';
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Provide a default JSON structure as shown in the design
    const defaultJson = `{\n  "version": "1.0",\n  "department_code": "HR-04",\n  "tags": ["performance", "review"]\n}`;

    const { data, setData, post, processing, errors } = useForm({
        owner_employee_id: '',
        document_type_id: '',
        title: '',
        file_uri: '',
        issue_date: '',
        expiry_date: '',
        access_policy: 'internal',
        metadata_json: defaultJson,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        post(basePath, {
            preserveScroll: true,
            onFinish: () => setIsSubmitting(false),
        });
    };

    const formatLabel = (val: string) => {
        return val.charAt(0).toUpperCase() + val.slice(1).replace('_', ' ');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Documents', href: basePath },
                { title: 'Registry', href: basePath },
                { title: 'Add New Document', href: '#' },
            ]}
        >
            <Head title="Add New Document" />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col bg-muted/10">
                {/* Full-width fluid container */}
                <div className="w-full flex-1 p-4 md:p-8 lg:p-12">
                    {/* Header */}
                    <div className="mb-8 space-y-4">
                        <Button
                            variant="ghost"
                            className="h-8 px-0 font-semibold text-muted-foreground hover:bg-transparent hover:text-foreground"
                            onClick={() => router.visit(basePath)}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to
                            Registry
                        </Button>
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                                Add New Document
                            </h1>
                            <p className="mt-1 text-base text-muted-foreground">
                                Register a new employee document into the
                                central compliance system.
                            </p>
                        </div>
                    </div>

                    <form id="create-document-form" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-8 pb-8 lg:grid-cols-12 xl:gap-12">
                            {/* LEFT COLUMN: Main Form Sections */}
                            <div className="space-y-6 lg:col-span-8 xl:col-span-9">
                                {/* General Information */}
                                <Card className="border-border shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-5">
                                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
                                            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
                                                <Info className="h-4 w-4" />
                                            </div>
                                            General Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6 p-4 md:p-6">
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold">
                                                    Owner Employee{' '}
                                                    <span className="text-destructive">
                                                        *
                                                    </span>
                                                </Label>
                                                <Select
                                                    value={
                                                        data.owner_employee_id
                                                    }
                                                    onValueChange={(val) =>
                                                        setData(
                                                            'owner_employee_id',
                                                            val,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger
                                                        className={`h-11 bg-background text-base ${errors.owner_employee_id ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                    >
                                                        <SelectValue placeholder="Select employee..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {(employees || []).map(
                                                            (emp) => (
                                                                <SelectItem
                                                                    key={emp.id}
                                                                    value={emp.id.toString()}
                                                                >
                                                                    {
                                                                        emp.first_name
                                                                    }{' '}
                                                                    {
                                                                        emp.surname
                                                                    }{' '}
                                                                    (
                                                                    {
                                                                        emp.staff_number
                                                                    }
                                                                    )
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {errors.owner_employee_id && (
                                                    <p className="text-xs font-medium text-destructive">
                                                        {
                                                            errors.owner_employee_id
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold">
                                                    Document Type{' '}
                                                    <span className="text-destructive">
                                                        *
                                                    </span>
                                                </Label>
                                                <Select
                                                    value={
                                                        data.document_type_id
                                                    }
                                                    onValueChange={(val) =>
                                                        setData(
                                                            'document_type_id',
                                                            val,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger
                                                        className={`h-11 bg-background text-base ${errors.document_type_id ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                    >
                                                        <SelectValue placeholder="Select type..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {(
                                                            documentTypes || []
                                                        ).map((type) => (
                                                            <SelectItem
                                                                key={type.id}
                                                                value={type.id.toString()}
                                                            >
                                                                {type.code} -{' '}
                                                                {type.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.document_type_id && (
                                                    <p className="text-xs font-medium text-destructive">
                                                        {
                                                            errors.document_type_id
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-sm font-semibold">
                                                Document Title{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                placeholder="e.g. Q3 Performance Assessment - John Doe"
                                                value={data.title}
                                                onChange={(e) =>
                                                    setData(
                                                        'title',
                                                        e.target.value,
                                                    )
                                                }
                                                className={`h-11 bg-background text-base ${errors.title ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                required
                                            />
                                            {errors.title && (
                                                <p className="text-xs font-medium text-destructive">
                                                    {errors.title}
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* File & Validity */}
                                <Card className="border-border shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-5">
                                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
                                            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
                                                <Paperclip className="h-4 w-4" />
                                            </div>
                                            File & Validity
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6 p-4 md:p-6">
                                        <div className="space-y-3">
                                            <Label className="text-sm font-semibold">
                                                File Storage URI{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="s3://documents/2024/..."
                                                    value={data.file_uri}
                                                    onChange={(e) =>
                                                        setData(
                                                            'file_uri',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`h-11 flex-1 bg-background font-mono text-sm ${errors.file_uri ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                    required
                                                />
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    className="h-11 border border-border/50 px-6 font-bold shadow-none"
                                                >
                                                    <UploadCloud className="mr-2 h-4 w-4" />{' '}
                                                    Browse
                                                </Button>
                                            </div>
                                            {errors.file_uri && (
                                                <p className="text-xs font-medium text-destructive">
                                                    {errors.file_uri}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold">
                                                    Issue Date
                                                </Label>
                                                <Input
                                                    type="date"
                                                    value={data.issue_date}
                                                    onChange={(e) =>
                                                        setData(
                                                            'issue_date',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`h-11 bg-background text-base ${errors.issue_date ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                />
                                                {errors.issue_date && (
                                                    <p className="text-xs font-medium text-destructive">
                                                        {errors.issue_date}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold">
                                                    Expiry Date
                                                </Label>
                                                <Input
                                                    type="date"
                                                    value={data.expiry_date}
                                                    onChange={(e) =>
                                                        setData(
                                                            'expiry_date',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`h-11 bg-background text-base ${errors.expiry_date ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                />
                                                {errors.expiry_date && (
                                                    <p className="text-xs font-medium text-destructive">
                                                        {errors.expiry_date}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Security & Metadata */}
                                <Card className="border-border shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-5">
                                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
                                            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
                                                <ShieldCheck className="h-4 w-4" />
                                            </div>
                                            Security & Metadata
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6 p-4 md:p-6">
                                        <div className="max-w-md space-y-3">
                                            <Label className="text-sm font-semibold">
                                                Access Policy{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Select
                                                value={data.access_policy}
                                                onValueChange={(val) =>
                                                    setData(
                                                        'access_policy',
                                                        val,
                                                    )
                                                }
                                            >
                                                <SelectTrigger
                                                    className={`h-11 bg-background text-base ${errors.access_policy ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                >
                                                    <SelectValue placeholder="Select Policy" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(
                                                        accessPolicyOptions || [
                                                            'public',
                                                            'internal',
                                                            'confidential',
                                                            'restricted',
                                                        ]
                                                    ).map((opt) => (
                                                        <SelectItem
                                                            key={opt}
                                                            value={opt}
                                                        >
                                                            {formatLabel(opt)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.access_policy && (
                                                <p className="text-xs font-medium text-destructive">
                                                    {errors.access_policy}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-sm font-semibold">
                                                Metadata (JSON)
                                            </Label>
                                            <Textarea
                                                value={data.metadata_json}
                                                onChange={(e) =>
                                                    setData(
                                                        'metadata_json',
                                                        e.target.value,
                                                    )
                                                }
                                                className={`min-h-[160px] resize-none bg-muted/30 font-mono text-sm ${errors.metadata_json ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                            />
                                            {errors.metadata_json && (
                                                <p className="text-xs font-medium text-destructive">
                                                    {errors.metadata_json}
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* RIGHT COLUMN: Side Panels */}
                            <div className="space-y-6 lg:col-span-4 xl:col-span-3">
                                {/* Governance Tips Card */}
                                <Card className="border-border bg-muted/20 shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-4">
                                        <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                            <Scale className="h-5 w-5 text-primary" />
                                            Governance Tips
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6 pt-6">
                                        <p className="text-sm leading-relaxed font-medium text-muted-foreground">
                                            Ensure all HR documents comply with
                                            global retention and security
                                            standards before submission.
                                        </p>

                                        <div className="space-y-5">
                                            <div className="flex items-start gap-3">
                                                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                                                <div>
                                                    <p className="text-sm font-bold text-foreground">
                                                        Classification
                                                    </p>
                                                    <p className="mt-1 text-xs leading-relaxed font-medium text-muted-foreground">
                                                        Confidential files must
                                                        have an owner assigned
                                                        and restricted metadata
                                                        access.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                                                <div>
                                                    <p className="text-sm font-bold text-foreground">
                                                        Retention Policy
                                                    </p>
                                                    <p className="mt-1 text-xs leading-relaxed font-medium text-muted-foreground">
                                                        Most HR records must be
                                                        kept for 7 years
                                                        post-employment
                                                        termination.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                                                <div>
                                                    <p className="text-sm font-bold text-foreground">
                                                        Security Audit
                                                    </p>
                                                    <p className="mt-1 text-xs leading-relaxed font-medium text-muted-foreground">
                                                        All uploads are scanned
                                                        for sensitive
                                                        information (SSN,
                                                        Personal Phone Numbers).
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mock Graphic Container from screenshot */}
                                        <div className="mt-6 flex w-full flex-col items-center justify-center rounded-lg border border-border/50 bg-background p-4 text-center shadow-inner">
                                            <div className="mb-3 flex h-24 w-full items-center justify-center rounded border border-border bg-muted/30 text-muted-foreground/30">
                                                <FileText className="h-8 w-8" />
                                            </div>
                                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Registry System V2.4
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Sticky Footer Actions - Full Width */}
                <div className="sticky bottom-0 z-40 flex w-full items-center justify-end gap-4 border-t bg-background p-4 px-6 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)] md:px-12">
                    <Button
                        type="button"
                        variant="ghost"
                        className="font-bold text-muted-foreground hover:text-foreground"
                        onClick={() => router.visit(basePath)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 border-border bg-background px-8 font-bold text-foreground shadow-sm"
                        onClick={(e) => handleSubmit(e)}
                        disabled={processing || isSubmitting}
                    >
                        Save Draft
                    </Button>
                    <Button
                        type="submit"
                        form="create-document-form"
                        className="h-11 bg-primary px-8 font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
                        disabled={processing || isSubmitting}
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {processing || isSubmitting
                            ? 'Saving...'
                            : 'Add Document'}
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
