import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    CheckCircle2,
    ChevronLeft,
    Circle,
    Code,
    FileSearch,
    ListChecks,
    Rocket,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

export default function PayrollExportCreate() {
    const { module } = usePage().props as any;

    const { data, setData, post, processing, errors } = useForm({
        period_start: '',
        period_end: '',
        export_version: '',
        file_reference: '',
        status: 'Draft',
        notes: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent, forceStatus?: string) => {
        e.preventDefault();

        if (forceStatus) {
            data.status = forceStatus;
        }

        setIsSubmitting(true);
        post(`${API}/${module?.slug || 'payroll-exports'}`, {
            preserveScroll: true,
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Payroll Exports',
                    href: `${API}/${module?.slug || 'payroll-exports'}`,
                },
                { title: 'Create', href: '#' },
            ]}
        >
            <Head title="Create Payroll Export" />

            <div className="min-h-[calc(100vh-64px)] w-full bg-muted/10 p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8 max-w-3xl">
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                        Create Payroll Export
                    </h1>
                    <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                        Prepare a new payroll export batch for a selected
                        period. Ensure all employee data is finalized before
                        initiating.
                    </p>
                </div>

                <form onSubmit={(e) => handleSubmit(e)} className="pb-24">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        {/* LEFT COLUMN: Form Sections */}
                        <div className="space-y-6 lg:col-span-8">
                            {/* Section 1: Period Selection */}
                            <Card className="border-border shadow-sm">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                        <CalendarDays className="h-5 w-5 text-primary" />
                                        Period Selection
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold">
                                                Start Date
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    type="date"
                                                    value={data.period_start}
                                                    onChange={(e) =>
                                                        setData(
                                                            'period_start',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`h-11 bg-background pr-10 ${errors.period_start ? 'border-destructive' : ''}`}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                First day of the payroll cycle
                                            </p>
                                            {errors.period_start && (
                                                <p className="text-xs font-medium text-destructive">
                                                    {errors.period_start}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold">
                                                End Date
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    type="date"
                                                    value={data.period_end}
                                                    onChange={(e) =>
                                                        setData(
                                                            'period_end',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`h-11 bg-background pr-10 ${errors.period_end ? 'border-destructive' : ''}`}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Last day of the payroll cycle
                                            </p>
                                            {errors.period_end && (
                                                <p className="text-xs font-medium text-destructive">
                                                    {errors.period_end}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Section 2: Version & Reference */}
                            <Card className="border-border shadow-sm">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                        <Code className="h-5 w-5 text-primary" />
                                        Version & Reference
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold">
                                                Export Version
                                            </Label>
                                            <Input
                                                placeholder="e.g. v1.0.0"
                                                value={data.export_version}
                                                onChange={(e) =>
                                                    setData(
                                                        'export_version',
                                                        e.target.value,
                                                    )
                                                }
                                                className={`h-11 bg-muted/30 ${errors.export_version ? 'border-destructive' : ''}`}
                                            />
                                            <p className="text-xs leading-relaxed text-muted-foreground">
                                                Used for tracking regenerated
                                                files and historical
                                                comparisons.
                                            </p>
                                            {errors.export_version && (
                                                <p className="text-xs font-medium text-destructive">
                                                    {errors.export_version}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold">
                                                File Reference
                                            </Label>
                                            <Input
                                                placeholder="REF-2023-OCT-01"
                                                value={data.file_reference}
                                                onChange={(e) =>
                                                    setData(
                                                        'file_reference',
                                                        e.target.value,
                                                    )
                                                }
                                                className={`h-11 bg-muted/30 uppercase ${errors.file_reference ? 'border-destructive' : ''}`}
                                            />
                                            <p className="text-xs leading-relaxed text-muted-foreground">
                                                The primary storage identifier
                                                for document management systems.
                                            </p>
                                            {errors.file_reference && (
                                                <p className="text-xs font-medium text-destructive">
                                                    {errors.file_reference}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Section 3: Audit Information */}
                            <Card className="border-border shadow-sm">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                        <FileSearch className="h-5 w-5 text-primary" />
                                        Audit Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-3">
                                        <Label className="text-sm font-semibold">
                                            Initial Status
                                        </Label>
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setData('status', 'Draft')
                                                }
                                                className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                                                    data.status === 'Draft'
                                                        ? 'border-amber-200 bg-amber-100 text-amber-800'
                                                        : 'border-border bg-background text-muted-foreground hover:bg-muted'
                                                }`}
                                            >
                                                <div
                                                    className={`h-2.5 w-2.5 rounded-full ${data.status === 'Draft' ? 'bg-amber-600' : 'border-2 border-muted-foreground'}`}
                                                />
                                                Draft
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setData(
                                                        'status',
                                                        'Processing',
                                                    )
                                                }
                                                className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                                                    data.status === 'Processing'
                                                        ? 'border-primary/20 bg-primary/10 text-primary'
                                                        : 'border-border bg-background text-muted-foreground hover:bg-muted'
                                                }`}
                                            >
                                                <div
                                                    className={`h-2.5 w-2.5 rounded-full ${data.status === 'Processing' ? 'bg-primary' : 'border-2 border-muted-foreground'}`}
                                                />
                                                Processing
                                            </button>
                                        </div>
                                        {errors.status && (
                                            <p className="text-xs font-medium text-destructive">
                                                {errors.status}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold">
                                            Notes
                                        </Label>
                                        <Textarea
                                            placeholder="Add internal audit remarks..."
                                            value={data.notes}
                                            onChange={(e) =>
                                                setData('notes', e.target.value)
                                            }
                                            className={`min-h-[120px] resize-none bg-muted/20 text-base ${errors.notes ? 'border-destructive' : ''}`}
                                        />
                                        <p className="text-xs leading-relaxed text-muted-foreground">
                                            Provide context for why this export
                                            is being created or specific
                                            variations from standard policy.
                                        </p>
                                        {errors.notes && (
                                            <p className="text-xs font-medium text-destructive">
                                                {errors.notes}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT COLUMN: Info Context */}
                        <div className="space-y-6 lg:col-span-4">
                            {/* Operational Context */}
                            <Card className="border-primary/20 bg-primary/5 shadow-sm">
                                <CardHeader className="border-b border-primary/10 pb-2">
                                    <CardTitle className="text-xs font-bold tracking-widest text-primary uppercase">
                                        Operational Context
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6 pt-5">
                                    <div className="space-y-3">
                                        <h4 className="flex items-center gap-2 text-sm font-bold text-foreground">
                                            <ListChecks className="h-4 w-4" />{' '}
                                            Export Checklist
                                        </h4>
                                        <ul className="space-y-2.5 text-sm font-medium text-muted-foreground">
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                Time logs approved
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                New hires validated
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Circle className="h-4 w-4 text-muted-foreground/50" />
                                                Deductions synced
                                            </li>
                                        </ul>
                                    </div>

                                    <Separator className="bg-primary/10" />

                                    <div className="space-y-2">
                                        <h4 className="text-sm font-bold text-foreground">
                                            Policy Reminders
                                        </h4>
                                        <p className="text-xs leading-relaxed font-medium text-muted-foreground">
                                            Exports initiated after 5:00 PM will
                                            be queued for the next business day
                                            processing cycle.
                                        </p>
                                    </div>

                                    <Separator className="bg-primary/10" />

                                    <div className="space-y-3">
                                        <h4 className="text-sm font-bold text-foreground">
                                            Status Definitions
                                        </h4>
                                        <ul className="space-y-2 text-xs font-medium text-muted-foreground">
                                            <li className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                                                <span className="font-semibold text-foreground">
                                                    Draft:
                                                </span>{' '}
                                                Editable state
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-primary"></div>
                                                <span className="font-semibold text-foreground">
                                                    Active:
                                                </span>{' '}
                                                Lock file
                                            </li>
                                        </ul>
                                    </div>

                                    <Separator className="bg-primary/10" />

                                    <div className="space-y-2">
                                        <h4 className="text-sm font-bold text-foreground">
                                            Versioning Guidance
                                        </h4>
                                        <p className="text-xs leading-relaxed text-muted-foreground italic">
                                            "Follow the standard Semantic
                                            Versioning (SemVer) format for
                                            consistency across internal
                                            systems."
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Batch Summary */}
                            <Card className="border-border shadow-sm">
                                <CardHeader className="border-b pb-3">
                                    <CardTitle className="text-sm font-bold text-foreground">
                                        Batch Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 pt-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-muted-foreground">
                                            Expected Employees
                                        </span>
                                        <span className="font-bold text-foreground">
                                            428
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-muted-foreground">
                                            Estimated Total
                                        </span>
                                        <span className="font-bold text-foreground">
                                            $1,240,500.00
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-muted-foreground">
                                            Currency
                                        </span>
                                        <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold tracking-wider text-primary">
                                            USD
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="mt-8 flex flex-col-reverse items-center justify-between gap-4 border-t pt-6 pb-4 sm:flex-row">
                        <Button
                            type="button"
                            variant="ghost"
                            className="font-bold text-muted-foreground hover:text-foreground"
                            onClick={() =>
                                router.visit(
                                    `${API}/${module?.slug || 'payroll-exports'}`,
                                )
                            }
                        >
                            Cancel & Return
                        </Button>
                        <div className="flex w-full items-center gap-3 sm:w-auto">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full font-bold shadow-sm sm:w-auto"
                                onClick={(e) => handleSubmit(e, 'Draft')}
                                disabled={processing || isSubmitting}
                            >
                                Save Draft
                            </Button>
                            <Button
                                type="submit"
                                className="w-full bg-indigo-600 px-6 font-bold text-white shadow-sm hover:bg-indigo-700 sm:w-auto"
                                onClick={(e) => handleSubmit(e, 'Processing')}
                                disabled={processing || isSubmitting}
                            >
                                Create Export
                                <Rocket className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
