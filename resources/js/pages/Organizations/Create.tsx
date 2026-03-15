import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { Building2, Check, ImagePlus } from 'lucide-react';
import { useState, type ReactNode } from 'react';

type PageProps = {
    statusOptions: string[];
    timezones: string[];
};

export default function CreateOrganization() {
    const { statusOptions, timezones } = usePage<PageProps>().props;
    const [currentStep, setCurrentStep] = useState(1);

    const form = useForm({
        name: '',
        slug: '',
        code: '',
        email: '',
        phone: '',
        address: '',
        logo_path: '',
        status: 'Active',
        timezone: 'UTC (Universal Coordinated Time)',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/organizations');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Control Center', href: '/control-center' },
                { title: 'Organizations', href: '/organizations' },
                { title: 'Create', href: '#' },
            ]}
        >
            <Head title="Create Organization" />

            <form
                onSubmit={submit}
                className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-8 bg-muted/5 p-4 md:p-6 lg:p-8 xl:p-12"
            >
                {/* Header Section */}
                <div className="flex w-full flex-col gap-6 border-b border-border/50 pb-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Create New Organization
                        </h1>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                        <Button
                            asChild
                            variant="outline"
                            className="h-11 border-border bg-background px-6 font-bold text-foreground shadow-sm hover:bg-muted"
                        >
                            <Link href="/organizations">Cancel</Link>
                        </Button>
                        <Button
                            type="submit"
                            className="h-11 bg-foreground px-8 font-bold text-background shadow-sm hover:bg-foreground/90"
                            disabled={form.processing}
                        >
                            {form.processing
                                ? 'Saving...'
                                : 'Save Organization'}
                        </Button>
                    </div>
                </div>

                {/* Main Split Layout */}
                <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12 xl:gap-12">
                    {/* LEFT COLUMN: Stepper & Preview (Spans 4/12) */}
                    <div className="space-y-8 lg:col-span-4 xl:col-span-3">
                        {/* Stepper Navigation */}
                        <div className="space-y-2">
                            <StepIndicator
                                stepNum={1}
                                currentStep={currentStep}
                                title="Basic Identity"
                                description="Name, URL & Branding"
                                onClick={() => setCurrentStep(1)}
                            />
                            <StepIndicator
                                stepNum={2}
                                currentStep={currentStep}
                                title="Operations"
                                description="Location & Timezone"
                                onClick={() => setCurrentStep(2)}
                            />
                            <StepIndicator
                                stepNum={3}
                                currentStep={currentStep}
                                title="Communication"
                                description="Contact details"
                                onClick={() => setCurrentStep(3)}
                            />
                        </div>

                        {/* Live Preview Card */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardContent className="space-y-6 p-6">
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Organization Preview
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-dashed border-border bg-muted text-muted-foreground">
                                        <Building2 className="h-6 w-6 opacity-50" />
                                    </div>
                                    <div className="space-y-1 overflow-hidden">
                                        <p className="truncate text-sm font-bold text-foreground">
                                            {form.data.name ||
                                                'Organization Name'}
                                        </p>
                                        <p className="truncate text-xs font-medium text-muted-foreground">
                                            providence.hr
                                            {form.data.slug || '/org-slug'}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 border-t border-border/50 pt-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Status
                                        </p>
                                        <Badge
                                            variant="secondary"
                                            className="border-transparent bg-primary/10 px-2 py-0 text-[10px] font-bold text-primary shadow-none"
                                        >
                                            {form.data.status}
                                        </Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Code
                                        </p>
                                        <p className="font-mono text-xs font-bold text-foreground">
                                            {form.data.code || 'PRV-00'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: Form Sections (Spans 8/12) */}
                    <div className="space-y-6 pb-12 lg:col-span-8 xl:col-span-9">
                        <Card className="overflow-hidden border-border bg-background shadow-sm">
                            {/* Step 1: Basic Identity */}
                            {currentStep === 1 && (
                                <div className="animate-in duration-300 fade-in slide-in-from-bottom-2">
                                    <div className="space-y-6 border-b border-border/50 bg-muted/5 p-6 md:p-8">
                                        <h3 className="text-lg font-bold text-foreground">
                                            Basic Identity
                                        </h3>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Define how your organization appears
                                            in the system.
                                        </p>
                                    </div>
                                    <CardContent className="space-y-8 p-6 md:p-8">
                                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                            <div className="space-y-6">
                                                <Field
                                                    label="Organization Name"
                                                    error={form.errors.name}
                                                >
                                                    <Input
                                                        value={form.data.name}
                                                        onChange={(e) =>
                                                            form.setData(
                                                                'name',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="e.g. Providence Global"
                                                        className="h-11 bg-background text-base shadow-sm"
                                                    />
                                                </Field>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <Field
                                                        label="URL Slug"
                                                        error={form.errors.slug}
                                                    >
                                                        <div className="relative">
                                                            <span className="absolute top-1/2 left-3 -translate-y-1/2 font-mono text-sm text-muted-foreground">
                                                                /
                                                            </span>
                                                            <Input
                                                                value={
                                                                    form.data
                                                                        .slug
                                                                }
                                                                onChange={(e) =>
                                                                    form.setData(
                                                                        'slug',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="providence-intl"
                                                                className="h-11 bg-background pl-7 font-mono text-sm shadow-sm"
                                                            />
                                                        </div>
                                                    </Field>
                                                    <Field
                                                        label="Short Code"
                                                        error={form.errors.code}
                                                    >
                                                        <Input
                                                            value={
                                                                form.data.code
                                                            }
                                                            onChange={(e) =>
                                                                form.setData(
                                                                    'code',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="PRV-001"
                                                            className="h-11 bg-background font-mono text-sm uppercase shadow-sm"
                                                        />
                                                    </Field>
                                                </div>
                                            </div>

                                            <div className="h-full space-y-2">
                                                <Label className="text-sm font-bold text-foreground">
                                                    Organization Logo
                                                </Label>
                                                <div className="flex h-full min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/60 bg-muted/5 p-6 text-center transition-colors hover:bg-muted/10">
                                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background shadow-sm">
                                                        <ImagePlus className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                    <p className="text-sm font-bold text-foreground">
                                                        Upload Image
                                                    </p>
                                                    <p className="mt-1 text-xs font-medium text-muted-foreground">
                                                        SVG, PNG, JPG (max 2MB)
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </div>
                            )}

                            {/* Step 2: Operational Details */}
                            {currentStep === 2 && (
                                <div className="animate-in duration-300 fade-in slide-in-from-bottom-2">
                                    <div className="space-y-6 border-b border-border/50 bg-muted/5 p-6 md:p-8">
                                        <h3 className="text-lg font-bold text-foreground">
                                            Operational Details
                                        </h3>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Location-specific settings for
                                            payroll and compliance.
                                        </p>
                                    </div>
                                    <CardContent className="space-y-6 p-6 md:p-8">
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <Field
                                                label="Status"
                                                error={form.errors.status}
                                            >
                                                <Select
                                                    value={form.data.status}
                                                    onValueChange={(v) =>
                                                        form.setData(
                                                            'status',
                                                            v,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="h-11 bg-background text-base shadow-sm">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {statusOptions.map(
                                                            (opt) => (
                                                                <SelectItem
                                                                    key={opt}
                                                                    value={opt}
                                                                >
                                                                    {opt}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </Field>
                                            <Field
                                                label="Timezone"
                                                error={form.errors.timezone}
                                            >
                                                <Select
                                                    value={form.data.timezone}
                                                    onValueChange={(v) =>
                                                        form.setData(
                                                            'timezone',
                                                            v,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="h-11 bg-background text-base shadow-sm">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {timezones.map((tz) => (
                                                            <SelectItem
                                                                key={tz}
                                                                value={tz}
                                                            >
                                                                {tz}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </Field>
                                        </div>
                                        <Field
                                            label="Registered Address"
                                            error={form.errors.address}
                                        >
                                            <Textarea
                                                rows={4}
                                                value={form.data.address}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'address',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Enter full headquarters address..."
                                                className="resize-none bg-background text-base shadow-sm"
                                            />
                                        </Field>
                                    </CardContent>
                                </div>
                            )}

                            {/* Step 3: Contact Information */}
                            {currentStep === 3 && (
                                <div className="animate-in duration-300 fade-in slide-in-from-bottom-2">
                                    <div className="space-y-6 border-b border-border/50 bg-muted/5 p-6 md:p-8">
                                        <h3 className="text-lg font-bold text-foreground">
                                            Contact Information
                                        </h3>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            How should our support team and
                                            employees reach you?
                                        </p>
                                    </div>
                                    <CardContent className="p-6 md:p-8">
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <Field
                                                label="Official Email Address"
                                                error={form.errors.email}
                                            >
                                                <Input
                                                    type="email"
                                                    value={form.data.email}
                                                    onChange={(e) =>
                                                        form.setData(
                                                            'email',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="hr@yourcompany.com"
                                                    className="h-11 bg-background text-base shadow-sm"
                                                />
                                            </Field>
                                            <Field
                                                label="Official Phone Number"
                                                error={form.errors.phone}
                                            >
                                                <Input
                                                    type="tel"
                                                    value={form.data.phone}
                                                    onChange={(e) =>
                                                        form.setData(
                                                            'phone',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="+1 (555) 000-0000"
                                                    className="h-11 bg-background font-mono text-base shadow-sm"
                                                />
                                            </Field>
                                        </div>
                                    </CardContent>
                                </div>
                            )}

                            {/* Form Footer / Pagination */}
                            <div className="flex items-center justify-between border-t border-border/50 bg-muted/5 p-6 md:p-8">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setCurrentStep((s) => s - 1)}
                                    disabled={currentStep === 1}
                                    className="font-bold shadow-sm"
                                >
                                    Previous Step
                                </Button>

                                {currentStep < 3 ? (
                                    <Button
                                        type="button"
                                        className="bg-foreground font-bold text-background shadow-sm hover:bg-foreground/90"
                                        onClick={() =>
                                            setCurrentStep((s) => s + 1)
                                        }
                                    >
                                        Next Step
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        className="bg-foreground font-bold text-background shadow-sm hover:bg-foreground/90"
                                        disabled={form.processing}
                                    >
                                        Complete & Save
                                    </Button>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}

// --- Helpers ---

function StepIndicator({
    stepNum,
    currentStep,
    title,
    description,
    onClick,
}: {
    stepNum: number;
    currentStep: number;
    title: string;
    description: string;
    onClick: () => void;
}) {
    const isActive = currentStep === stepNum;
    const isCompleted = currentStep > stepNum;
    const isUpcoming = currentStep < stepNum;

    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex w-full items-start gap-4 rounded-xl p-3 text-left transition-all ${isActive ? 'border border-border bg-background shadow-sm' : 'border border-transparent hover:bg-muted/50'} ${isUpcoming ? 'opacity-50' : 'opacity-100'}`}
        >
            <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-sm transition-colors ${
                    isActive || isCompleted
                        ? 'bg-foreground text-background'
                        : 'border-2 border-border bg-background text-muted-foreground'
                }`}
            >
                {isCompleted ? <Check className="h-4 w-4" /> : stepNum}
            </div>
            <div className="mt-1 space-y-1">
                <p className="text-sm font-bold text-foreground">{title}</p>
                <p className="text-xs font-medium text-muted-foreground">
                    {description}
                </p>
            </div>
        </button>
    );
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <div className="space-y-2">
            <Label className="text-sm font-bold text-foreground">{label}</Label>
            {children}
            {error && (
                <p className="text-xs font-bold text-destructive">{error}</p>
            )}
        </div>
    );
}
