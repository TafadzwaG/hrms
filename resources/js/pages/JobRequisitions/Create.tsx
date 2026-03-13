import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    Briefcase,
    Calendar,
    Check,
    ChevronLeft,
    ChevronRight,
    Database,
    FileText,
    Info,
    LayoutList,
    Save,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function JobRequisitionCreate() {
    const { module } = usePage().props as any;
    const basePath = `/${module?.slug || 'job-requisitions'}`;

    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        department: '',
        hiring_manager: '',
        openings: '1',
        target_start_date: '',
        status: 'Draft',
        requisition_code: '', // Handled by backend on save
    });

    const steps = [
        { id: 1, title: 'Position Details', icon: Briefcase },
        { id: 2, title: 'Hiring Logistics', icon: Calendar },
        { id: 3, title: 'System Data', icon: Database },
    ];

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    const handleSubmit = (e: React.FormEvent, forceDraft: boolean = false) => {
        e.preventDefault();

        // Navigate to next step if not on the last step (unless explicitly saving)
        if (currentStep < 3 && !forceDraft) {
            nextStep();
            return;
        }

        setIsSubmitting(true);

        if (forceDraft) {
            setData('status', 'Draft');
        }

        post(basePath, {
            preserveScroll: true,
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Recruitment', href: '#' },
                { title: module?.name || 'Requisitions', href: basePath },
                { title: 'Requisition Setup', href: '#' },
            ]}
        >
            <Head title="Create Requisition" />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col bg-muted/10">
                {/* Main Content Area - Full Screen Fluid Layout */}
                <div className="w-full flex-1 p-4 md:p-8 lg:p-12">
                    <div className="mb-12">
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Requisition Setup
                        </h1>
                        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                            Define the parameters, budget allocation, and
                            routing details for this hiring request.
                        </p>
                    </div>

                    {/* Horizontal Stepper - Stretches full width */}
                    <div className="relative mb-12 flex w-full items-start justify-between px-2 sm:px-8">
                        {/* Connecting Line */}
                        <div className="absolute top-5 right-10 left-10 z-0 h-[2px] bg-border"></div>
                        <div
                            className="absolute top-5 left-10 z-0 h-[2px] bg-primary transition-all duration-500 ease-in-out"
                            style={{
                                width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 2.5rem)`,
                            }}
                        ></div>

                        {/* Step Nodes */}
                        {steps.map((step) => {
                            const StepIcon = step.icon;
                            const isActive = currentStep === step.id;
                            const isCompleted = currentStep > step.id;

                            return (
                                <div
                                    key={step.id}
                                    className="relative z-10 flex flex-col items-center gap-3 bg-muted/10 px-4"
                                >
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                                            isActive
                                                ? 'border-primary bg-primary text-primary-foreground shadow-md'
                                                : isCompleted
                                                  ? 'border-primary bg-background text-primary'
                                                  : 'border-border bg-background text-muted-foreground'
                                        }`}
                                    >
                                        {isCompleted ? (
                                            <Check className="h-5 w-5" />
                                        ) : (
                                            <StepIcon className="h-4 w-4" />
                                        )}
                                    </div>
                                    <div className="flex flex-col items-center text-center">
                                        <p
                                            className={`text-[10px] font-bold tracking-widest uppercase ${isActive || isCompleted ? 'text-primary' : 'text-muted-foreground'}`}
                                        >
                                            Step {step.id}
                                        </p>
                                        <p
                                            className={`text-sm font-semibold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}
                                        >
                                            {step.title}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Form Container - Grid spanning full screen */}
                    <form
                        id="create-requisition-form"
                        onSubmit={(e) => handleSubmit(e, false)}
                    >
                        <div className="grid grid-cols-1 gap-8 pb-8 lg:grid-cols-12 xl:gap-12">
                            {/* LEFT COLUMN: Form Sections (Spans wider on large screens) */}
                            <div className="space-y-6 lg:col-span-8 xl:col-span-9">
                                {/* STEP 1: Position Details */}
                                {currentStep === 1 && (
                                    <div className="animate-in duration-500 fade-in slide-in-from-bottom-4">
                                        <Card className="border-border shadow-sm">
                                            <CardHeader className="border-b border-border/50 pb-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted text-muted-foreground">
                                                        <Briefcase className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-lg">
                                                            Position Details
                                                        </CardTitle>
                                                        <p className="text-sm text-muted-foreground">
                                                            Define the core role
                                                            requirements and
                                                            reporting structure.
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-8 p-6 md:p-8">
                                                {/* Monochromatic Info Alert */}
                                                <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-5">
                                                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-foreground" />
                                                    <div>
                                                        <p className="text-sm font-bold text-foreground">
                                                            Budget Review
                                                            Required
                                                        </p>
                                                        <p className="mt-1 text-sm leading-relaxed font-medium text-muted-foreground">
                                                            Financial approval
                                                            is required for all
                                                            new requisitions.
                                                            Ensure the salary
                                                            range fits within
                                                            the annual
                                                            departmental budget.
                                                        </p>
                                                        <Button
                                                            type="button"
                                                            variant="link"
                                                            className="mt-2 h-auto p-0 text-xs font-semibold text-foreground"
                                                        >
                                                            View Policy{' '}
                                                            <ChevronRight className="ml-1 h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <Label className="text-sm font-semibold">
                                                        Job Title
                                                    </Label>
                                                    <Input
                                                        placeholder="e.g. Senior Software Engineer"
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

                                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:gap-8">
                                                    <div className="space-y-3">
                                                        <Label className="text-sm font-semibold">
                                                            Department
                                                        </Label>
                                                        <Select
                                                            value={
                                                                data.department
                                                            }
                                                            onValueChange={(
                                                                val,
                                                            ) =>
                                                                setData(
                                                                    'department',
                                                                    val,
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger
                                                                className={`h-11 bg-background text-base ${errors.department ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                            >
                                                                <SelectValue placeholder="Select Department" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Engineering">
                                                                    Engineering
                                                                </SelectItem>
                                                                <SelectItem value="Marketing">
                                                                    Marketing
                                                                </SelectItem>
                                                                <SelectItem value="Human Resources">
                                                                    Human
                                                                    Resources
                                                                </SelectItem>
                                                                <SelectItem value="Operations">
                                                                    Operations
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.department && (
                                                            <p className="text-xs font-medium text-destructive">
                                                                {
                                                                    errors.department
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-3">
                                                        <Label className="text-sm font-semibold">
                                                            Hiring Manager
                                                        </Label>
                                                        <Input
                                                            placeholder="e.g. Sarah Jenkins"
                                                            value={
                                                                data.hiring_manager
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    'hiring_manager',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className={`h-11 bg-background text-base ${errors.hiring_manager ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                        />
                                                        {errors.hiring_manager && (
                                                            <p className="text-xs font-medium text-destructive">
                                                                {
                                                                    errors.hiring_manager
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}

                                {/* STEP 2: Hiring Logistics */}
                                {currentStep === 2 && (
                                    <div className="animate-in duration-500 fade-in slide-in-from-right-4">
                                        <Card className="border-border shadow-sm">
                                            <CardHeader className="border-b border-border/50 pb-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted text-muted-foreground">
                                                        <Calendar className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-lg">
                                                            Hiring Logistics
                                                        </CardTitle>
                                                        <p className="text-sm text-muted-foreground">
                                                            Configure headcount,
                                                            target dates, and
                                                            pipeline status.
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-8 p-6 md:p-8">
                                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
                                                    <div className="space-y-3">
                                                        <Label className="text-sm font-semibold">
                                                            Number of Openings
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            value={
                                                                data.openings
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    'openings',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className={`h-11 bg-background text-base ${errors.openings ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                            required
                                                        />
                                                        {errors.openings && (
                                                            <p className="text-xs font-medium text-destructive">
                                                                {
                                                                    errors.openings
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-3">
                                                        <Label className="text-sm font-semibold">
                                                            Target Start Date
                                                        </Label>
                                                        <div className="relative">
                                                            <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                            <Input
                                                                type="date"
                                                                value={
                                                                    data.target_start_date
                                                                }
                                                                onChange={(e) =>
                                                                    setData(
                                                                        'target_start_date',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className={`h-11 bg-background pl-10 text-base ${errors.target_start_date ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                                required
                                                            />
                                                        </div>
                                                        {errors.target_start_date && (
                                                            <p className="text-xs font-medium text-destructive">
                                                                {
                                                                    errors.target_start_date
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-3 xl:col-span-3">
                                                        <Label className="text-sm font-semibold">
                                                            Initial Status
                                                        </Label>
                                                        <Select
                                                            value={data.status}
                                                            onValueChange={(
                                                                val,
                                                            ) =>
                                                                setData(
                                                                    'status',
                                                                    val,
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger
                                                                className={`h-11 max-w-md bg-background text-base ${errors.status ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                            >
                                                                <SelectValue placeholder="Select Status" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Draft">
                                                                    Draft
                                                                    (Internal
                                                                    Only)
                                                                </SelectItem>
                                                                <SelectItem value="Open">
                                                                    Open
                                                                    (Actively
                                                                    Recruiting)
                                                                </SelectItem>
                                                                <SelectItem value="On Hold">
                                                                    On Hold
                                                                    (Paused)
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            Setting this to
                                                            "Open" will route it
                                                            to the active job
                                                            board.
                                                        </p>
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

                                {/* STEP 3: System Data */}
                                {currentStep === 3 && (
                                    <div className="animate-in duration-500 fade-in slide-in-from-right-4">
                                        <Card className="border-border shadow-sm">
                                            <CardHeader className="border-b border-border/50 pb-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                                                        <Database className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-lg">
                                                            System Data
                                                        </CardTitle>
                                                        <p className="text-sm text-muted-foreground">
                                                            Finalize database
                                                            tracking
                                                            identifiers.
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-6 md:p-8">
                                                <div className="max-w-lg space-y-3">
                                                    <Label className="text-sm font-semibold">
                                                        Requisition Code
                                                    </Label>
                                                    <Input
                                                        disabled
                                                        value="AUTO-GENERATED ON SAVE"
                                                        className="h-11 cursor-not-allowed border-transparent bg-muted/50 font-mono text-base font-bold text-muted-foreground select-none"
                                                    />
                                                    <p className="text-xs font-medium text-muted-foreground">
                                                        A unique system
                                                        identifier (e.g.,
                                                        REQ-2024-042) will be
                                                        automatically generated
                                                        upon saving.
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}
                            </div>

                            {/* RIGHT COLUMN: Context & Guidelines */}
                            <div className="space-y-6 lg:col-span-4 xl:col-span-3">
                                {/* Guidelines */}
                                <Card className="border-border bg-muted/30 shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-3">
                                        <CardTitle className="flex items-center gap-2 text-sm font-bold text-foreground">
                                            <Info className="h-5 w-5 text-primary" />
                                            Approval Workflow
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 pt-6">
                                        <p className="text-sm leading-relaxed font-medium text-muted-foreground">
                                            Setting the status to{' '}
                                            <span className="font-bold text-foreground">
                                                Open
                                            </span>{' '}
                                            will automatically trigger a
                                            notification to the HR Director for
                                            final budget sign-off before
                                            publishing to public boards.
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Resources Quick Links */}
                                <Card className="border-border shadow-sm">
                                    <CardContent className="p-0">
                                        <Button
                                            variant="ghost"
                                            className="h-14 w-full justify-start rounded-none border-b border-border/50 px-6 text-muted-foreground hover:text-foreground"
                                        >
                                            <FileText className="mr-3 h-4 w-4" />{' '}
                                            Company Hiring Guidelines
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="h-14 w-full justify-start rounded-none px-6 text-muted-foreground hover:text-foreground"
                                        >
                                            <LayoutList className="mr-3 h-4 w-4" />{' '}
                                            Interview Rubrics
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Sticky Footer Navigation - Stretches full width */}
                <div className="sticky bottom-0 z-40 flex w-full items-center justify-between border-t bg-background p-4 px-6 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            className="hidden font-bold text-muted-foreground hover:text-foreground sm:flex"
                            onClick={() => router.visit(basePath)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            className="font-bold text-muted-foreground"
                            disabled={currentStep === 1}
                            onClick={prevStep}
                        >
                            <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                            Step
                        </Button>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="hidden border-border bg-background font-bold shadow-sm sm:flex"
                            onClick={(e) => handleSubmit(e, true)}
                            disabled={processing || isSubmitting}
                        >
                            Save Draft
                        </Button>
                        <Button
                            type="submit"
                            form="create-requisition-form"
                            className="bg-primary px-8 font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
                            disabled={processing || isSubmitting}
                        >
                            {currentStep === 3 ? (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing || isSubmitting
                                        ? 'Saving...'
                                        : 'Finalize Requisition'}
                                </>
                            ) : (
                                <>
                                    Next Step{' '}
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
