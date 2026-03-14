import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Info,
    Save,
    ShieldCheck,
} from 'lucide-react';
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

export default function LearningCourseEdit() {
    const { course, statusOptions } = usePage().props as unknown as {
        course: any;
        statusOptions: string[];
    };

    const basePath = '/learning-courses';
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        course_code: course?.course_code || '',
        title: course?.title || '',
        category: course?.category || '',
        duration_hours: course?.duration_hours?.toString() || '',
        compliance_required: !!course?.compliance_required,
        expires_after_days: course?.expires_after_days?.toString() || '',
        status: course?.status || 'active',
    });

    const nextStep = () => setCurrentStep(2);
    const prevStep = () => setCurrentStep(1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (currentStep === 1) {
            nextStep();
            return;
        }

        setIsSubmitting(true);
        put(`${basePath}/${course.id}`, {
            preserveScroll: true,
            onFinish: () => setIsSubmitting(false),
        });
    };

    const formatStatus = (stat: string) => {
        return stat.charAt(0).toUpperCase() + stat.slice(1);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Learning', href: basePath },
                { title: 'Courses', href: basePath },
                { title: `Edit: ${course?.course_code}`, href: '#' },
            ]}
        >
            <Head title={`Edit Course - ${course?.title}`} />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col bg-muted/10">
                {/* Changed to full width by removing max-w limits */}
                <div className="w-full flex-1 p-4 md:p-8 lg:p-12">
                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Edit Learning Course
                        </h1>
                        <p className="mt-2 text-base text-muted-foreground">
                            Update the identifiers and compliance details for
                            this curriculum.
                        </p>
                    </div>

                    {/* Stepper Header */}
                    <div className="mb-8 space-y-4">
                        <div className="flex items-center justify-between text-sm font-bold tracking-widest text-muted-foreground uppercase">
                            <span>Step {currentStep} of 2</span>
                            <span>
                                {currentStep === 1 ? '50%' : '100%'} Complete
                            </span>
                        </div>
                        <Progress
                            value={currentStep === 1 ? 50 : 100}
                            className="h-2.5 border border-border bg-muted"
                        />

                        <div className="flex items-center gap-6 pt-4">
                            <div
                                className={`flex items-center gap-3 transition-colors ${currentStep >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}
                            >
                                <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'border border-border bg-muted'}`}
                                >
                                    1
                                </div>
                                <span className="text-sm font-bold">
                                    Course Information
                                </span>
                            </div>
                            <div
                                className={`flex items-center gap-3 transition-colors ${currentStep === 2 ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
                            >
                                <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${currentStep === 2 ? 'bg-primary text-primary-foreground' : 'border border-border bg-muted'}`}
                                >
                                    2
                                </div>
                                <span className="text-sm font-bold">
                                    Compliance & Expiry
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Main Form Area */}
                    <form id="edit-course-form" onSubmit={handleSubmit}>
                        {/* STEP 1: Course Information */}
                        {currentStep === 1 && (
                            <div className="animate-in duration-500 fade-in slide-in-from-bottom-4">
                                <Card className="max-w-5xl border-border shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-lg font-bold text-foreground">
                                                    Course Information
                                                </CardTitle>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Provide the basic
                                                    identifiers and details for
                                                    the curriculum.
                                                </p>
                                            </div>
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
                                                <Info className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6 p-6 md:p-8">
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:gap-8">
                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold">
                                                    Course Code{' '}
                                                    <span className="text-destructive">
                                                        *
                                                    </span>
                                                </Label>
                                                <Input
                                                    placeholder="e.g. COMP-2024-01"
                                                    value={data.course_code}
                                                    onChange={(e) =>
                                                        setData(
                                                            'course_code',
                                                            e.target.value.toUpperCase(),
                                                        )
                                                    }
                                                    className={`h-11 bg-background font-mono text-base uppercase ${errors.course_code ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                    required
                                                />
                                                {errors.course_code && (
                                                    <p className="text-xs font-medium text-destructive">
                                                        {errors.course_code}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold">
                                                    Title{' '}
                                                    <span className="text-destructive">
                                                        *
                                                    </span>
                                                </Label>
                                                <Input
                                                    placeholder="e.g. Cybersecurity Awareness"
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

                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold">
                                                    Category{' '}
                                                    <span className="text-destructive">
                                                        *
                                                    </span>
                                                </Label>
                                                <Input
                                                    placeholder="e.g. Compliance, Technical"
                                                    value={data.category}
                                                    onChange={(e) =>
                                                        setData(
                                                            'category',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`h-11 bg-background text-base ${errors.category ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                    required
                                                />
                                                {errors.category && (
                                                    <p className="text-xs font-medium text-destructive">
                                                        {errors.category}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold">
                                                    Duration (Hours){' '}
                                                    <span className="text-destructive">
                                                        *
                                                    </span>
                                                </Label>
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    min="0"
                                                    placeholder="e.g. 5"
                                                    value={data.duration_hours}
                                                    onChange={(e) =>
                                                        setData(
                                                            'duration_hours',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`h-11 bg-background text-base ${errors.duration_hours ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                    required
                                                />
                                                {errors.duration_hours && (
                                                    <p className="text-xs font-medium text-destructive">
                                                        {errors.duration_hours}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-3 md:col-span-2">
                                                <Label className="text-sm font-semibold">
                                                    Course Status
                                                </Label>
                                                <Select
                                                    value={data.status}
                                                    onValueChange={(val) =>
                                                        setData('status', val)
                                                    }
                                                >
                                                    <SelectTrigger
                                                        className={`h-11 bg-background text-base ${errors.status ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                    >
                                                        <SelectValue placeholder="Select Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {(
                                                            statusOptions || [
                                                                'active',
                                                                'inactive',
                                                                'archived',
                                                            ]
                                                        ).map((stat) => (
                                                            <SelectItem
                                                                key={stat}
                                                                value={stat}
                                                            >
                                                                {formatStatus(
                                                                    stat,
                                                                )}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.status && (
                                                    <p className="text-xs font-medium text-destructive">
                                                        {errors.status}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* STEP 2: Compliance & Expiry */}
                        {currentStep === 2 && (
                            <div className="animate-in duration-500 fade-in slide-in-from-right-4">
                                <Card className="max-w-5xl border-border shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-lg font-bold text-foreground">
                                                    Compliance & Expiry
                                                </CardTitle>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Configure regulatory
                                                    tracking and certification
                                                    validity.
                                                </p>
                                            </div>
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
                                                <ShieldCheck className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6 p-6 md:p-8">
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:gap-8">
                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold">
                                                    Is this a Mandatory
                                                    Compliance Course?
                                                </Label>
                                                <Select
                                                    value={
                                                        data.compliance_required
                                                            ? 'true'
                                                            : 'false'
                                                    }
                                                    onValueChange={(val) =>
                                                        setData(
                                                            'compliance_required',
                                                            val === 'true',
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger
                                                        className={`h-11 bg-background text-base ${errors.compliance_required ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                    >
                                                        <SelectValue placeholder="Select requirement level" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="true">
                                                            Yes, Mandatory
                                                        </SelectItem>
                                                        <SelectItem value="false">
                                                            No, Optional
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <p className="text-xs text-muted-foreground">
                                                    Mandatory courses are
                                                    actively tracked in the
                                                    Command Center.
                                                </p>
                                                {errors.compliance_required && (
                                                    <p className="text-xs font-medium text-destructive">
                                                        {
                                                            errors.compliance_required
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold">
                                                    Expires After (Days)
                                                </Label>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    placeholder="e.g. 365"
                                                    value={
                                                        data.expires_after_days
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            'expires_after_days',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`h-11 bg-background text-base ${errors.expires_after_days ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    Leave blank if the
                                                    certification never expires.
                                                </p>
                                                {errors.expires_after_days && (
                                                    <p className="text-xs font-medium text-destructive">
                                                        {
                                                            errors.expires_after_days
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </form>
                </div>

                {/* Sticky Footer Actions - Stretches edge-to-edge */}
                <div className="sticky bottom-0 z-40 flex w-full items-center justify-between border-t bg-background p-4 px-6 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)] md:px-12">
                    <Button
                        type="button"
                        variant="ghost"
                        className="font-bold text-muted-foreground hover:text-foreground"
                        onClick={() => router.visit(basePath)}
                    >
                        Cancel
                    </Button>

                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="h-11 border-border bg-background px-6 font-bold text-foreground shadow-sm"
                            disabled={currentStep === 1}
                            onClick={prevStep}
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <Button
                            type="submit"
                            form="edit-course-form"
                            className="h-11 bg-primary px-8 font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
                            disabled={processing || isSubmitting}
                        >
                            {currentStep === 2 ? (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing || isSubmitting
                                        ? 'Saving...'
                                        : 'Update Course'}
                                </>
                            ) : (
                                <>
                                    Next Step{' '}
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
