import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, FileText, Save, Scale } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

export default function DocumentTypeCreate() {
    const { sensitivityOptions } = usePage().props as unknown as {
        sensitivityOptions: string[];
    };

    const basePath = '/document-types';
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        code: '',
        name: '',
        sensitivity_level: 'internal', // Default sensible value
        retention_policy: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        post(basePath, {
            preserveScroll: true,
            onFinish: () => setIsSubmitting(false),
        });
    };

    // Helper to format sensitivity level labels
    const formatLabel = (val: string) => {
        return val.charAt(0).toUpperCase() + val.slice(1);
    };

    // Calculate simulated draft progress
    const requiredFields = [data.code, data.name, data.sensitivity_level];
    const filledCount = requiredFields.filter(
        (val) => val.trim().length > 0,
    ).length;
    const progressPercent = Math.round(
        (filledCount / requiredFields.length) * 100,
    );

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Documents', href: basePath },
                { title: 'Document Types', href: basePath },
                { title: 'Create Document Type', href: '#' },
            ]}
        >
            <Head title="Create Document Type" />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col bg-muted/10">
                {/* Full Width Container */}
                <div className="w-full flex-1 p-4 md:p-8 lg:p-12">
                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Create Document Type
                        </h1>
                        <p className="mt-2 text-base text-muted-foreground">
                            Define classification and retention rules for new
                            document categories.
                        </p>
                    </div>

                    <form id="create-doc-type-form" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-8 pb-8 lg:grid-cols-12 xl:gap-12">
                            {/* LEFT COLUMN: Main Form Sections */}
                            <div className="space-y-6 lg:col-span-8 xl:col-span-9">
                                <Card className="border-border shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-5">
                                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
                                            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
                                                <FileText className="h-4 w-4" />
                                            </div>
                                            Document Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-8 p-6 md:p-8">
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:gap-8">
                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold">
                                                    Document Code
                                                </Label>
                                                <Input
                                                    placeholder="e.g. EMP-CONT-01"
                                                    value={data.code}
                                                    onChange={(e) =>
                                                        setData(
                                                            'code',
                                                            e.target.value.toUpperCase(),
                                                        )
                                                    }
                                                    className={`h-11 bg-background font-mono text-base uppercase ${errors.code ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                    required
                                                />
                                                {errors.code && (
                                                    <p className="text-xs font-medium text-destructive">
                                                        {errors.code}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold">
                                                    Display Name
                                                </Label>
                                                <Input
                                                    placeholder="e.g. Employment Contract"
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData(
                                                            'name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`h-11 bg-background text-base ${errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                    required
                                                />
                                                {errors.name && (
                                                    <p className="text-xs font-medium text-destructive">
                                                        {errors.name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-sm font-semibold">
                                                Sensitivity Level
                                            </Label>
                                            <Select
                                                value={data.sensitivity_level}
                                                onValueChange={(val) =>
                                                    setData(
                                                        'sensitivity_level',
                                                        val,
                                                    )
                                                }
                                            >
                                                <SelectTrigger
                                                    className={`h-11 bg-background text-base ${errors.sensitivity_level ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                >
                                                    <SelectValue placeholder="Select sensitivity level" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(
                                                        sensitivityOptions || [
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
                                            {errors.sensitivity_level && (
                                                <p className="text-xs font-medium text-destructive">
                                                    {errors.sensitivity_level}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-sm font-semibold">
                                                Retention Policy
                                            </Label>
                                            <Textarea
                                                placeholder="Describe the legal and operational retention requirements..."
                                                value={data.retention_policy}
                                                onChange={(e) =>
                                                    setData(
                                                        'retention_policy',
                                                        e.target.value,
                                                    )
                                                }
                                                className={`min-h-[140px] resize-none bg-background text-base ${errors.retention_policy ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Specify how long this document
                                                type must be kept after
                                                termination or expiration.
                                            </p>
                                            {errors.retention_policy && (
                                                <p className="text-xs font-medium text-destructive">
                                                    {errors.retention_policy}
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* RIGHT COLUMN: Side Panels */}
                            <div className="space-y-6 lg:col-span-4 xl:col-span-3">
                                {/* Governance Guidance */}
                                <Card className="border-border bg-muted/20 shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-4">
                                        <CardTitle className="flex items-center gap-2 text-sm font-bold text-foreground">
                                            <Scale className="h-4 w-4 text-primary" />
                                            Governance Guidance
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6 pt-6">
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Classification Standards
                                            </h4>
                                            <ul className="space-y-3 text-sm font-medium text-muted-foreground">
                                                <li className="flex items-start gap-2">
                                                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                                                    <span>
                                                        <strong className="text-foreground">
                                                            Restricted:
                                                        </strong>{' '}
                                                        Sensitive PII, salaries,
                                                        or medical data. Highest
                                                        encryption.
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                                    <span>
                                                        <strong className="text-foreground">
                                                            Confidential:
                                                        </strong>{' '}
                                                        Management notes,
                                                        performance reviews.
                                                        Departmental silos.
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Retention Requirements
                                            </h4>
                                            <div className="rounded-md border border-border bg-background p-4">
                                                <p className="text-xs leading-relaxed font-medium text-muted-foreground">
                                                    Per{' '}
                                                    <strong className="text-foreground">
                                                        GDPR Article 5(1)(e)
                                                    </strong>
                                                    , documents must be purged
                                                    once the purpose for
                                                    collection is fulfilled.
                                                    Providence default for
                                                    personnel files is{' '}
                                                    <strong className="text-foreground">
                                                        7 years
                                                    </strong>{' '}
                                                    post-employment.
                                                </p>
                                            </div>
                                        </div>

                                        <Button
                                            variant="link"
                                            className="h-auto p-0 text-xs font-bold text-primary"
                                        >
                                            View Full Compliance Policy &rarr;
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Draft Status */}
                                <Card className="border-dashed border-border bg-muted/10 shadow-sm">
                                    <CardContent className="space-y-4 p-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-semibold text-foreground">
                                                Draft Status
                                            </p>
                                            <Badge
                                                variant="secondary"
                                                className="bg-muted px-2 py-0 text-[10px] font-bold tracking-wider text-muted-foreground uppercase shadow-none"
                                            >
                                                Unsaved
                                            </Badge>
                                        </div>
                                        <Progress
                                            value={progressPercent}
                                            className="h-2 border border-border bg-muted"
                                        />
                                        <p className="text-xs font-medium text-muted-foreground">
                                            {progressPercent}% of required
                                            fields completed
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Sticky Footer Actions */}
                <div className="sticky bottom-0 z-40 flex w-full items-center justify-between border-t bg-background p-4 px-6 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)] md:px-12">
                    <Button
                        type="button"
                        variant="ghost"
                        className="font-bold text-muted-foreground hover:text-foreground"
                        onClick={() => router.visit(basePath)}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
                    </Button>

                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="h-11 border-border bg-background px-6 font-bold text-foreground shadow-sm"
                            onClick={() => router.visit(basePath)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            form="create-doc-type-form"
                            className="h-11 bg-primary px-8 font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
                            disabled={processing || isSubmitting}
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {processing || isSubmitting
                                ? 'Saving...'
                                : 'Save Document Type'}
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
