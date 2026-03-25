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
import { ArrowLeft, FileText, Save, Settings2, Target } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';

type KpiPayload = {
    id: number;
    name: string;
    code: string | null;
    perspective: string;
    description: string | null;
    target_type: string;
    default_target: string | null;
    default_weight: number | null;
    unit: string | null;
    is_active: boolean;
};

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
            {required ? <span className="ml-1 text-destructive">*</span> : null}
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

export default function KpiEdit() {
    const { kpi, perspectives, targetTypes } = usePage<{
        kpi: KpiPayload;
        perspectives: string[];
        targetTypes: string[];
    }>().props;

    const { data, setData, errors, put, processing } = useForm({
        name: kpi.name ?? '',
        code: kpi.code ?? '',
        perspective: kpi.perspective ?? '',
        description: kpi.description ?? '',
        target_type: kpi.target_type ?? '',
        default_target: kpi.default_target ?? '',
        default_weight: kpi.default_weight != null ? String(kpi.default_weight) : '',
        unit: kpi.unit ?? '',
        is_active: kpi.is_active ?? true,
    });

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        put(`/kpi-library/${kpi.id}`, { preserveScroll: true });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Performance', href: '/performance' },
                { title: 'KPI Library', href: '/kpi-library' },
                { title: kpi.name, href: `/kpi-library/${kpi.id}` },
                { title: 'Edit', href: '#' },
            ]}
        >
            <Head title={`Edit KPI - ${kpi.name}`} />

            <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
                <div className="mb-6 flex flex-col gap-4 border-b pb-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex items-start gap-4">
                        <Link href="/kpi-library">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>

                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Performance Management</p>
                            <div>
                                <h1 className="text-3xl font-semibold tracking-tight">Edit KPI</h1>
                                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                                    Update this KPI using the same structured layout as performance cycles.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[320px]">
                        <Card>
                            <CardContent className="p-4">
                                <p className="text-xs text-muted-foreground">Code</p>
                                <p className="mt-1 text-sm font-medium">{data.code || 'Not set'}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <p className="text-xs text-muted-foreground">Status</p>
                                <p className="mt-1 text-sm font-medium">
                                    {data.is_active ? 'Active' : 'Inactive'}
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
                                    title="KPI Identity"
                                    description="Define the KPI name, code, and business context."
                                />
                            </CardHeader>
                            <CardContent className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <FieldLabel required>Name</FieldLabel>
                                    <Input
                                        value={data.name}
                                        onChange={(event) => setData('name', event.target.value)}
                                    />
                                    <FieldError message={errors.name} />
                                </div>

                                <div>
                                    <FieldLabel>Code</FieldLabel>
                                    <Input
                                        value={data.code}
                                        onChange={(event) => setData('code', event.target.value)}
                                    />
                                    <FieldError message={errors.code} />
                                </div>

                                <div className="md:col-span-2">
                                    <FieldLabel>Description</FieldLabel>
                                    <Textarea
                                        value={data.description}
                                        onChange={(event) => setData('description', event.target.value)}
                                        rows={6}
                                    />
                                    <FieldError message={errors.description} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <SectionHeading
                                    icon={<Target className="h-4 w-4" />}
                                    title="Measurement Setup"
                                    description="Configure perspective, unit, target type, and baseline defaults."
                                />
                            </CardHeader>
                            <CardContent className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <FieldLabel required>Perspective</FieldLabel>
                                    <Select value={data.perspective} onValueChange={(value) => setData('perspective', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select perspective" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {perspectives.map((item) => (
                                                <SelectItem key={item} value={item}>
                                                    {formatLabel(item)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FieldError message={errors.perspective} />
                                </div>

                                <div>
                                    <FieldLabel>Unit</FieldLabel>
                                    <Input
                                        value={data.unit}
                                        onChange={(event) => setData('unit', event.target.value)}
                                    />
                                    <FieldError message={errors.unit} />
                                </div>

                                <div>
                                    <FieldLabel required>Target Type</FieldLabel>
                                    <Select value={data.target_type} onValueChange={(value) => setData('target_type', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select target type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {targetTypes.map((item) => (
                                                <SelectItem key={item} value={item}>
                                                    {formatLabel(item)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FieldError message={errors.target_type} />
                                </div>

                                <div>
                                    <FieldLabel>Default Target</FieldLabel>
                                    <Input
                                        value={data.default_target}
                                        onChange={(event) => setData('default_target', event.target.value)}
                                    />
                                    <FieldError message={errors.default_target} />
                                </div>

                                <div>
                                    <FieldLabel>Default Weight (%)</FieldLabel>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        value={data.default_weight}
                                        onChange={(event) => setData('default_weight', event.target.value)}
                                    />
                                    <FieldError message={errors.default_weight} />
                                </div>
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
                                        description="Control whether the KPI is available for templates and scorecards."
                                    />
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <Card className="bg-muted/30">
                                        <CardContent className="flex items-start justify-between gap-4 p-4">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium">Active KPI</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Active KPIs can be selected across scorecard workflows.
                                                </p>
                                            </div>

                                            <Switch
                                                id="is_active"
                                                checked={data.is_active}
                                                onCheckedChange={(checked) => setData('is_active', checked)}
                                            />
                                        </CardContent>
                                    </Card>
                                    <FieldError message={errors.is_active} />
                                </CardContent>
                            </Card>

                            <Card className="bg-muted/20">
                                <CardHeader>
                                    <CardTitle className="text-base">Live Summary</CardTitle>
                                    <CardDescription>
                                        Preview the KPI before saving updates to the library.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-xl font-semibold tracking-tight">
                                            {data.name || 'Untitled KPI'}
                                        </p>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {data.description?.trim()
                                                ? data.description
                                                : 'A KPI description will appear here once you provide one.'}
                                        </p>
                                    </div>

                                    <div className="grid gap-3">
                                        <Card>
                                            <CardContent className="p-4">
                                                <p className="text-xs text-muted-foreground">Perspective</p>
                                                <p className="mt-1 text-sm font-medium">
                                                    {data.perspective ? formatLabel(data.perspective) : 'Not set'}
                                                </p>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-4">
                                                <p className="text-xs text-muted-foreground">Target Type</p>
                                                <p className="mt-1 text-sm font-medium">
                                                    {data.target_type ? formatLabel(data.target_type) : 'Not set'}
                                                </p>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-4">
                                                <p className="text-xs text-muted-foreground">Default Weight</p>
                                                <p className="mt-1 text-sm font-medium">
                                                    {data.default_weight || 'Not set'}
                                                </p>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-4">
                                                <p className="text-xs text-muted-foreground">Status</p>
                                                <p className="mt-1 text-sm font-medium">
                                                    {data.is_active ? 'Active' : 'Inactive'}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="flex flex-col gap-3 p-4">
                                    <Link href="/kpi-library" className="w-full">
                                        <Button variant="outline" type="button" className="w-full">
                                            Cancel
                                        </Button>
                                    </Link>

                                    <Button type="submit" disabled={processing}>
                                        <Save className="mr-2 h-4 w-4" />
                                        {processing ? 'Saving...' : 'Update KPI'}
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
