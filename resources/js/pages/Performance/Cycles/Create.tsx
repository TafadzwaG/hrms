import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, CalendarRange, FileText, Save, Settings2 } from 'lucide-react';
import moment from 'moment';
import type { FormEvent, ReactNode } from 'react';

function FieldLabel({
    children,
    required,
}: {
    children: ReactNode;
    required?: boolean;
}) {
    return (
        <label className="mb-2 block text-sm font-medium">
            {children}
            {required && <span className="ml-1 text-destructive">*</span>}
        </label>
    );
}

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="mt-2 text-sm text-destructive">{message}</p>;
}

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDatePreview(value: string) {
    if (!value) return '—';

    const date = moment(value);
    if (!date.isValid()) return '—';

    return date.format('DD MMM YYYY');
}

function getCycleLength(start: string, end: string) {
    if (!start || !end) return 'Set dates to preview duration';

    const startDate = moment(start);
    const endDate = moment(end);

    if (!startDate.isValid() || !endDate.isValid()) {
        return 'Set dates to preview duration';
    }

    const days = endDate.diff(startDate, 'days') + 1;

    if (days <= 0) return 'End date should be after start date';

    return `${days} day${days === 1 ? '' : 's'} active`;
}

function SectionHeading({
    icon,
    title,
    description,
}: {
    icon: ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-background">
                {icon}
            </div>
            <div className="space-y-1">
                <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}

export default function CycleCreate() {
    const { statuses } = usePage<{ statuses: string[] }>().props;

    const { data, setData, errors, post, processing } = useForm({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        status: 'draft',
        self_assessment_enabled: true as boolean,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/performance-cycles', { preserveScroll: true });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Performance', href: '/performance' },
                { title: 'Cycles', href: '/performance-cycles' },
                { title: 'New Cycle', href: '#' },
            ]}
        >
            <Head title="New Performance Cycle" />

            <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
                <div className="mb-6 flex flex-col gap-4 border-b pb-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex items-start gap-4">
                        <Link href="/performance-cycles">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>

                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Performance Management</p>
                            <div>
                                <h1 className="text-3xl font-semibold tracking-tight">
                                    New Performance Cycle
                                </h1>
                                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                                    Create a review cycle with a structured, full-width layout using
                                    a clean monochromatic Shadcn style.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[320px]">
                        <Card>
                            <CardContent className="p-4">
                                <p className="text-xs text-muted-foreground">Status</p>
                                <p className="mt-1 text-sm font-medium">{formatLabel(data.status)}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <p className="text-xs text-muted-foreground">Window</p>
                                <p className="mt-1 text-sm font-medium">
                                    {getCycleLength(data.start_date, data.end_date)}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-12">
                    <div className="space-y-6 xl:col-span-8">
                        <Card>
                            <CardHeader>
                                <SectionHeading
                                    icon={<FileText className="h-4 w-4" />}
                                    title="Cycle Identity"
                                    description="Add a clear title and a short description for this review cycle."
                                />
                            </CardHeader>
                            <CardContent className="grid gap-6 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <FieldLabel required>Title</FieldLabel>
                                    <Input
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="e.g. 2026 Annual Performance Review"
                                    />
                                    <FieldError message={errors.title} />
                                </div>

                                <div className="md:col-span-2">
                                    <FieldLabel>Description</FieldLabel>
                                    <Textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={6}
                                        placeholder="Describe the purpose, participants, timelines, and expectations for this cycle..."
                                    />
                                    <FieldError message={errors.description} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <SectionHeading
                                    icon={<CalendarRange className="h-4 w-4" />}
                                    title="Review Window"
                                    description="Set the active period for the performance cycle."
                                />
                            </CardHeader>
                            <CardContent className="grid gap-6 lg:grid-cols-[1fr_1fr_1.1fr]">
                                <div>
                                    <FieldLabel required>Start Date</FieldLabel>
                                    <Input
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                    />
                                    <FieldError message={errors.start_date} />
                                </div>

                                <div>
                                    <FieldLabel required>End Date</FieldLabel>
                                    <Input
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                    />
                                    <FieldError message={errors.end_date} />
                                </div>

                                <Card className="bg-muted/30">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm">Timeline Preview</CardTitle>
                                        <CardDescription>
                                            This updates as dates are selected.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between gap-4 border-b pb-3">
                                            <span className="text-sm text-muted-foreground">Starts</span>
                                            <span className="text-sm font-medium">
                                                {formatDatePreview(data.start_date)}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between gap-4 border-b pb-3">
                                            <span className="text-sm text-muted-foreground">Ends</span>
                                            <span className="text-sm font-medium">
                                                {formatDatePreview(data.end_date)}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-sm text-muted-foreground">Duration</span>
                                            <span className="text-sm font-medium">
                                                {getCycleLength(data.start_date, data.end_date)}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6 xl:col-span-4">
                        <div className="space-y-6 xl:sticky xl:top-6">
                            <Card>
                                <CardHeader>
                                    <SectionHeading
                                        icon={<Settings2 className="h-4 w-4" />}
                                        title="Configuration"
                                        description="Set publication state and participation options."
                                    />
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <FieldLabel required>Status</FieldLabel>
                                        <Select
                                            value={data.status}
                                            onValueChange={(value) => setData('status', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statuses.map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {formatLabel(status)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FieldError message={errors.status} />
                                    </div>

                                    <Card className="bg-muted/30">
                                        <CardContent className="flex items-start justify-between gap-4 p-4">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium">
                                                    Enable Self-Assessment
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Allow employees to submit their own self-review.
                                                </p>
                                            </div>

                                            <Switch
                                                id="self_assessment_enabled"
                                                checked={data.self_assessment_enabled}
                                                onCheckedChange={(checked) =>
                                                    setData('self_assessment_enabled', checked)
                                                }
                                            />
                                        </CardContent>
                                    </Card>

                                    <FieldError message={errors.self_assessment_enabled} />
                                </CardContent>
                            </Card>

                            <Card className="bg-muted/20">
                                <CardHeader>
                                    <CardTitle className="text-base">Live Summary</CardTitle>
                                    <CardDescription>
                                        A quick preview of the cycle before saving.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-xl font-semibold tracking-tight">
                                            {data.title || 'Untitled cycle'}
                                        </p>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {data.description?.trim()
                                                ? data.description
                                                : 'A short summary will appear here once you add a description.'}
                                        </p>
                                    </div>

                                    <div className="grid gap-3">
                                        <Card>
                                            <CardContent className="p-4">
                                                <p className="text-xs text-muted-foreground">Start</p>
                                                <p className="mt-1 text-sm font-medium">
                                                    {formatDatePreview(data.start_date)}
                                                </p>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-4">
                                                <p className="text-xs text-muted-foreground">End</p>
                                                <p className="mt-1 text-sm font-medium">
                                                    {formatDatePreview(data.end_date)}
                                                </p>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-4">
                                                <p className="text-xs text-muted-foreground">Status</p>
                                                <p className="mt-1 text-sm font-medium">
                                                    {formatLabel(data.status)}
                                                </p>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-4">
                                                <p className="text-xs text-muted-foreground">
                                                    Self Review
                                                </p>
                                                <p className="mt-1 text-sm font-medium">
                                                    {data.self_assessment_enabled
                                                        ? 'Enabled'
                                                        : 'Disabled'}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="flex flex-col gap-3 p-4">
                                    <Link href="/performance-cycles" className="w-full">
                                        <Button variant="outline" type="button" className="w-full">
                                            Cancel
                                        </Button>
                                    </Link>

                                    <Button type="submit" disabled={processing}>
                                        <Save className="mr-2 h-4 w-4" />
                                        {processing ? 'Saving...' : 'Save Cycle'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

