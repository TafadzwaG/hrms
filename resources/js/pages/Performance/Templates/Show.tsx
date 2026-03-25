import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    Eye,
    FileText,
    FolderKanban,
    Layers3,
    Pencil,
    Settings2,
    Sparkles,
    Target,
} from 'lucide-react';
import moment from 'moment';
import { useMemo } from 'react';

type TemplateItem = {
    id: number;
    perspective: string;
    objective: string;
    kpi_name: string;
    target_type: string;
    target_value: string | number | null;
    weight: string | number;
    sort_order: number | null;
    kpi?: {
        id: number;
        code: string;
        unit: string | null;
    } | null;
};

type TemplatePayload = {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    scope_type: string | null;
    scope_value: string | null;
    created_at: string;
    updated_at: string;
    items_count: number;
    scorecards_count: number;
    items: TemplateItem[];
};

function formatLabel(value: string | null | undefined) {
    if (!value) return '—';
    return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value: string | null | undefined, format = 'DD MMM YYYY, HH:mm') {
    if (!value) return '—';

    const parsed = moment(value);
    return parsed.isValid() ? parsed.format(format) : '—';
}

function formatTargetValue(value: string | number | null | undefined) {
    if (value === null || value === undefined || value === '') return '—';
    return String(value);
}

function MetricCard({
    icon,
    label,
    value,
    helper,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    helper: string;
}) {
    return (
        <Card>
            <CardContent className="flex items-start gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-muted">
                    {icon}
                </div>
                <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {label}
                    </p>
                    <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
                </div>
            </CardContent>
        </Card>
    );
}

function PerspectiveSection({
    perspective,
    items,
}: {
    perspective: string;
    items: TemplateItem[];
}) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            {formatLabel(perspective)}
                        </CardTitle>
                        <CardDescription>
                            {items.length} item{items.length === 1 ? '' : 's'} in this perspective.
                        </CardDescription>
                    </div>

                    <Badge variant="outline">{items.length} item{items.length === 1 ? '' : 's'}</Badge>
                </div>
            </CardHeader>

            <CardContent>
                <div className="overflow-x-auto rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Objective</TableHead>
                                <TableHead>KPI</TableHead>
                                <TableHead>Target Type</TableHead>
                                <TableHead>Target Value</TableHead>
                                <TableHead>Weight</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="align-top">
                                        <div className="space-y-1">
                                            <p className="font-medium">{item.objective}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Sort order {item.sort_order ?? 0}
                                            </p>
                                        </div>
                                    </TableCell>

                                    <TableCell className="align-top">
                                        <div className="space-y-1">
                                            <p className="font-medium">{item.kpi_name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {item.kpi?.code ?? 'Custom KPI'}
                                                {item.kpi?.unit ? ` · ${item.kpi.unit}` : ''}
                                            </p>
                                        </div>
                                    </TableCell>

                                    <TableCell className="align-top">
                                        <Badge variant="outline">
                                            {formatLabel(item.target_type)}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="align-top">
                                        {formatTargetValue(item.target_value)}
                                    </TableCell>

                                    <TableCell className="align-top">
                                        <span className="font-medium">{Number(item.weight).toFixed(1)}%</span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

export default function TemplateShow() {
    const { template } = usePage<{ template: TemplatePayload }>().props;

    const groupedItems = useMemo(() => {
        const groups = new Map<string, TemplateItem[]>();

        template.items.forEach((item) => {
            const key = item.perspective;
            const bucket = groups.get(key) ?? [];
            bucket.push(item);
            groups.set(key, bucket);
        });

        return Array.from(groups.entries());
    }, [template.items]);

    const totalWeight = template.items.reduce((sum, item) => sum + Number(item.weight || 0), 0);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Performance', href: '/performance' },
                { title: 'Templates', href: '/scorecard-templates' },
                { title: template.name, href: '#' },
            ]}
        >
            <Head title={template.name} />

            <div className="w-full space-y-6 p-4 md:p-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Link href="/scorecard-templates">
                                        <Button variant="outline" size="icon">
                                            <ArrowLeft className="h-4 w-4" />
                                        </Button>
                                    </Link>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Sparkles className="h-4 w-4" />
                                        <span>Scorecard Template Overview</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h1 className="text-3xl font-semibold tracking-tight">
                                            {template.name}
                                        </h1>
                                        <Badge variant={template.is_active ? 'default' : 'outline'}>
                                            {template.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Settings2 className="h-4 w-4" />
                                            <span>
                                                Scope: {formatLabel(template.scope_type)}
                                                {template.scope_value ? ` · ${template.scope_value}` : ''}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            <span>Updated {formatDate(template.updated_at)}</span>
                                        </div>
                                    </div>

                                    <p className="max-w-3xl text-sm text-muted-foreground">
                                        {template.description ||
                                            'No description has been provided for this scorecard template yet.'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Link href={`/scorecard-templates/${template.id}/edit`}>
                                    <Button variant="outline" className="w-full sm:w-auto">
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit Template
                                    </Button>
                                </Link>

                                <Link href="/scorecard-templates">
                                    <Button className="w-full sm:w-auto">
                                        <Layers3 className="mr-2 h-4 w-4" />
                                        Back to Templates
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <Separator className="my-6" />

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <MetricCard
                                icon={<Layers3 className="h-4 w-4" />}
                                label="Template Items"
                                value={template.items_count}
                                helper="KPIs defined in this template"
                            />
                            <MetricCard
                                icon={<CheckCircle2 className="h-4 w-4" />}
                                label="Status"
                                value={template.is_active ? 'Active' : 'Inactive'}
                                helper="Current publication state"
                            />
                            <MetricCard
                                icon={<Target className="h-4 w-4" />}
                                label="Total Weight"
                                value={`${totalWeight.toFixed(1)}%`}
                                helper="Combined weighting across items"
                            />
                            <MetricCard
                                icon={<FolderKanban className="h-4 w-4" />}
                                label="Linked Scorecards"
                                value={template.scorecards_count}
                                helper="Employee scorecards using this template"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 xl:grid-cols-12">
                    <div className="space-y-6 xl:col-span-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Template Details
                                </CardTitle>
                                <CardDescription>
                                    Core information about this scorecard template and how it is scoped.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <Card>
                                    <CardContent className="p-5">
                                        <div className="mb-3 flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-sm font-medium">Description</p>
                                        </div>
                                        <p className="text-sm leading-6 text-muted-foreground">
                                            {template.description || 'No description provided for this template.'}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-5">
                                        <div className="mb-3 flex items-center gap-2">
                                            <Settings2 className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-sm font-medium">Scope</p>
                                        </div>
                                        <p className="text-sm font-medium">
                                            {formatLabel(template.scope_type)}
                                        </p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {template.scope_value || 'Applies without a specific scope value'}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-5">
                                        <div className="mb-3 flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-sm font-medium">Status</p>
                                        </div>
                                        <Badge variant={template.is_active ? 'default' : 'outline'}>
                                            {template.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-5">
                                        <div className="mb-3 flex items-center gap-2">
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-sm font-medium">Created</p>
                                        </div>
                                        <p className="text-sm font-medium">
                                            {formatDate(template.created_at)}
                                        </p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Last updated {formatDate(template.updated_at)}
                                        </p>
                                    </CardContent>
                                </Card>
                            </CardContent>
                        </Card>

                        {groupedItems.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-14 text-center">
                                    <Target className="mb-4 h-12 w-12 text-muted-foreground" />
                                    <h3 className="text-lg font-semibold">No template items yet</h3>
                                    <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                        Add KPI items to define how this template should be used across scorecards.
                                    </p>
                                    <div className="mt-6">
                                        <Link href={`/scorecard-templates/${template.id}/edit`}>
                                            <Button variant="outline">
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit Template
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            groupedItems.map(([perspective, items]) => (
                                <PerspectiveSection
                                    key={perspective}
                                    perspective={perspective}
                                    items={items}
                                />
                            ))
                        )}
                    </div>

                    <div className="space-y-6 xl:col-span-4">
                        <div className="space-y-6 xl:sticky xl:top-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Sparkles className="h-4 w-4" />
                                        Snapshot
                                    </CardTitle>
                                    <CardDescription>
                                        A compact summary of this template at a glance.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                            Name
                                        </p>
                                        <p className="text-sm font-medium">{template.name}</p>
                                    </div>

                                    <Separator />

                                    <div className="space-y-1">
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                            Scope
                                        </p>
                                        <p className="text-sm font-medium">
                                            {formatLabel(template.scope_type)}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {template.scope_value || 'No specific scope value'}
                                        </p>
                                    </div>

                                    <Separator />

                                    <div className="space-y-1">
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                            Status
                                        </p>
                                        <Badge variant={template.is_active ? 'default' : 'outline'}>
                                            {template.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>

                                    <Separator />

                                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                                        <Card>
                                            <CardContent className="p-4">
                                                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                    Items
                                                </p>
                                                <p className="mt-1 text-lg font-semibold">
                                                    {template.items_count}
                                                </p>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-4">
                                                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                    Total Weight
                                                </p>
                                                <p className="mt-1 text-lg font-semibold">
                                                    {totalWeight.toFixed(1)}%
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                    <CardDescription>
                                        Continue managing this template from here.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="flex flex-col gap-3">
                                    <Link href={`/scorecard-templates/${template.id}/edit`} className="w-full">
                                        <Button variant="outline" className="w-full">
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit Template
                                        </Button>
                                    </Link>

                                    <Link href="/employee-scorecards/create" className="w-full">
                                        <Button className="w-full">
                                            <Layers3 className="mr-2 h-4 w-4" />
                                            Use in Scorecard
                                        </Button>
                                    </Link>

                                    <Link href="/scorecard-templates" className="w-full">
                                        <Button variant="outline" className="w-full">
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Back to Templates
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
