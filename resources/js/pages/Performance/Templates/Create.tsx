import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import {
    ArrowLeft,
    FileText,
    Layers3,
    Plus,
    Save,
    Settings2,
    Target,
    Trash2,
} from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';

type KpiOption = {
    id: number;
    name: string;
    code: string;
    perspective: string;
    target_type: string;
    default_target: string | null;
    default_weight: number | null;
    unit?: string | null;
};

type TemplateItem = {
    perspective: string;
    objective: string;
    kpi_name: string;
    kpi_library_id: string;
    target_type: string;
    target_value: string;
    weight: string;
    sort_order: number;
};

const perspectiveOrder = ['financial', 'customer', 'internal_process', 'learning_and_growth'];
const noneValue = '__none__';

function FieldLabel({ children, required }: { children: ReactNode; required?: boolean }) {
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

export default function TemplateCreate() {
    const { kpis, targetTypes, scopeTypes } = usePage<{
        kpis: KpiOption[];
        targetTypes: string[];
        scopeTypes: string[];
    }>().props;

    const { data, setData, errors, post, processing } = useForm({
        name: '',
        description: '',
        is_active: true as boolean,
        scope_type: '',
        scope_value: '',
        items: [] as TemplateItem[],
    });

    const [items, setItems] = useState<TemplateItem[]>([]);

    const syncItems = useCallback((nextItems: TemplateItem[]) => {
        const normalized = nextItems.map((item, index) => ({
            ...item,
            sort_order: index,
        }));
        setItems(normalized);
        setData('items', normalized);
    }, [setData]);

    const addItem = useCallback((perspective: string) => {
        syncItems([
            ...items,
            {
                perspective,
                objective: '',
                kpi_name: '',
                kpi_library_id: '',
                target_type: '',
                target_value: '',
                weight: '',
                sort_order: items.length,
            },
        ]);
    }, [items, syncItems]);

    const removeItem = useCallback((index: number) => {
        syncItems(items.filter((_, itemIndex) => itemIndex !== index));
    }, [items, syncItems]);

    const updateItem = useCallback((index: number, field: keyof TemplateItem, value: string) => {
        const updated = [...items];
        updated[index] = { ...updated[index], [field]: value };

        if (field === 'kpi_library_id' && value) {
            const kpi = kpis.find((row) => String(row.id) === value);

            if (kpi) {
                updated[index].kpi_name = kpi.name;
                updated[index].perspective = kpi.perspective;
                updated[index].target_type = kpi.target_type;
                if (kpi.default_target) updated[index].target_value = kpi.default_target;
                if (kpi.default_weight != null) updated[index].weight = String(kpi.default_weight);
            }
        }

        syncItems(updated);
    }, [items, kpis, syncItems]);

    const totalWeight = items.reduce((sum, item) => sum + (parseFloat(item.weight) || 0), 0);

    const summary = useMemo(() => ({
        active: data.is_active ? 'Active' : 'Inactive',
        scope: data.scope_type ? formatLabel(data.scope_type) : 'Not set',
        items: items.length,
        weight: `${totalWeight.toFixed(1)}%`,
    }), [data.is_active, data.scope_type, items.length, totalWeight]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/scorecard-templates', { preserveScroll: true });
    };

    const getItemsForPerspective = (perspective: string) =>
        items.map((item, idx) => ({ item, idx })).filter(({ item }) => item.perspective === perspective);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Performance', href: '/performance' },
                { title: 'Templates', href: '/scorecard-templates' },
                { title: 'New Template', href: '#' },
            ]}
        >
            <Head title="New Scorecard Template" />

            <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
                <div className="mb-6 flex flex-col gap-4 border-b pb-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex items-start gap-4">
                        <Link href="/scorecard-templates">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>

                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Performance Management</p>
                            <div>
                                <h1 className="text-3xl font-semibold tracking-tight">
                                    New Scorecard Template
                                </h1>
                                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                                    Create a reusable scorecard template with scoped KPI items using
                                    the same editorial layout as performance cycles.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[320px]">
                        <Card>
                            <CardContent className="p-4">
                                <p className="text-xs text-muted-foreground">Template Status</p>
                                <p className="mt-1 text-sm font-medium">{summary.active}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <p className="text-xs text-muted-foreground">Items</p>
                                <p className="mt-1 text-sm font-medium">
                                    {summary.items} item{summary.items === 1 ? '' : 's'}
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
                                    title="Template Identity"
                                    description="Define the template name, summary, and scoping details."
                                />
                            </CardHeader>
                            <CardContent className="grid gap-6 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <FieldLabel required>Name</FieldLabel>
                                    <Input
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g. Standard Employee Scorecard"
                                    />
                                    <FieldError message={errors.name} />
                                </div>

                                <div className="md:col-span-2">
                                    <FieldLabel>Description</FieldLabel>
                                    <Textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={6}
                                        placeholder="Describe the purpose, intended audience, and how this template should be applied..."
                                    />
                                    <FieldError message={errors.description} />
                                </div>

                                <div>
                                    <FieldLabel>Scope Type</FieldLabel>
                                    <Select
                                        value={data.scope_type || noneValue}
                                        onValueChange={(value) =>
                                            setData('scope_type', value === noneValue ? '' : value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select scope type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={noneValue}>No scope</SelectItem>
                                            {scopeTypes.map((scope) => (
                                                <SelectItem key={scope} value={scope}>
                                                    {formatLabel(scope)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FieldError message={errors.scope_type} />
                                </div>

                                <div>
                                    <FieldLabel>Scope Value</FieldLabel>
                                    <Input
                                        value={data.scope_value}
                                        onChange={(e) => setData('scope_value', e.target.value)}
                                        placeholder="e.g. Sales Department"
                                    />
                                    <FieldError message={errors.scope_value} />
                                </div>
                            </CardContent>
                        </Card>

                        {perspectiveOrder.map((perspective) => {
                            const perspectiveItems = getItemsForPerspective(perspective);

                            return (
                                <Card key={perspective}>
                                    <CardHeader>
                                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                            <SectionHeading
                                                icon={<Target className="h-4 w-4" />}
                                                title={formatLabel(perspective)}
                                                description="Define the objectives and KPI measurements for this perspective."
                                            />

                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => addItem(perspective)}
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Item
                                            </Button>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        {perspectiveItems.length === 0 ? (
                                            <div className="rounded-lg border border-dashed px-5 py-8 text-center">
                                                <p className="text-sm text-muted-foreground">
                                                    No items added for this perspective yet.
                                                </p>
                                            </div>
                                        ) : (
                                            perspectiveItems.map(({ item, idx }, itemPosition) => (
                                                <Card key={`${perspective}-${idx}`} className="bg-muted/20">
                                                    <CardHeader className="pb-4">
                                                        <div className="flex items-center justify-between gap-4">
                                                            <div className="space-y-1">
                                                                <CardTitle className="text-base">
                                                                    Item {itemPosition + 1}
                                                                </CardTitle>
                                                                <CardDescription>
                                                                    Configure the KPI, target, and weight for this entry.
                                                                </CardDescription>
                                                            </div>

                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() => removeItem(idx)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </CardHeader>

                                                    <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                                        <div className="lg:col-span-3">
                                                            <FieldLabel>KPI from Library</FieldLabel>
                                                            <Select
                                                                value={item.kpi_library_id || noneValue}
                                                                onValueChange={(value) =>
                                                                    updateItem(
                                                                        idx,
                                                                        'kpi_library_id',
                                                                        value === noneValue ? '' : value,
                                                                    )
                                                                }
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Pick from library (optional)" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value={noneValue}>
                                                                        Custom KPI
                                                                    </SelectItem>
                                                                    {kpis
                                                                        .filter((kpi) => kpi.perspective === perspective)
                                                                        .map((kpi) => (
                                                                            <SelectItem key={kpi.id} value={String(kpi.id)}>
                                                                                {kpi.code} · {kpi.name}
                                                                            </SelectItem>
                                                                        ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div>
                                                            <FieldLabel required>KPI Name</FieldLabel>
                                                            <Input
                                                                value={item.kpi_name}
                                                                onChange={(e) =>
                                                                    updateItem(idx, 'kpi_name', e.target.value)
                                                                }
                                                                placeholder="KPI name"
                                                            />
                                                        </div>

                                                        <div className="sm:col-span-2">
                                                            <FieldLabel required>Objective</FieldLabel>
                                                            <Input
                                                                value={item.objective}
                                                                onChange={(e) =>
                                                                    updateItem(idx, 'objective', e.target.value)
                                                                }
                                                                placeholder="Strategic objective"
                                                            />
                                                        </div>

                                                        <div>
                                                            <FieldLabel required>Target Type</FieldLabel>
                                                            <Select
                                                                value={item.target_type || noneValue}
                                                                onValueChange={(value) =>
                                                                    updateItem(
                                                                        idx,
                                                                        'target_type',
                                                                        value === noneValue ? '' : value,
                                                                    )
                                                                }
                                                            >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value={noneValue}>
                                                                    Select later
                                                                </SelectItem>
                                                                {targetTypes.map((targetType) => (
                                                                    <SelectItem key={targetType} value={targetType}>
                                                                        {formatLabel(targetType)}
                                                                    </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div>
                                                            <FieldLabel>Target Value</FieldLabel>
                                                            <Input
                                                                value={item.target_value}
                                                                onChange={(e) =>
                                                                    updateItem(idx, 'target_value', e.target.value)
                                                                }
                                                                placeholder="e.g. 100"
                                                            />
                                                        </div>

                                                        <div>
                                                            <FieldLabel required>Weight (%)</FieldLabel>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                max="100"
                                                                step="0.01"
                                                                value={item.weight}
                                                                onChange={(e) =>
                                                                    updateItem(idx, 'weight', e.target.value)
                                                                }
                                                                placeholder="e.g. 10"
                                                            />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <div className="space-y-6 xl:col-span-4">
                        <div className="space-y-6 xl:sticky xl:top-6">
                            <Card>
                                <CardHeader>
                                    <SectionHeading
                                        icon={<Settings2 className="h-4 w-4" />}
                                        title="Configuration"
                                        description="Control publication and review the overall weighting."
                                    />
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <Card className="bg-muted/30">
                                        <CardContent className="flex items-start justify-between gap-4 p-4">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium">Active Template</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Active templates are available for scorecard assignments.
                                                </p>
                                            </div>

                                            <Switch
                                                id="is_active"
                                                checked={data.is_active}
                                                onCheckedChange={(checked) => setData('is_active', checked)}
                                            />
                                        </CardContent>
                                    </Card>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Total Weight</span>
                                            <span className={Math.abs(totalWeight - 100) < 0.01 ? 'font-medium' : 'font-medium text-destructive'}>
                                                {totalWeight.toFixed(1)}%
                                            </span>
                                        </div>

                                        {Math.abs(totalWeight - 100) >= 0.01 && items.length > 0 && (
                                            <p className="text-sm text-destructive">
                                                Total weight should equal 100%.
                                            </p>
                                        )}

                                        <FieldError message={errors.items} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-muted/20">
                                <CardHeader>
                                    <CardTitle className="text-base">Live Summary</CardTitle>
                                    <CardDescription>
                                        A quick preview of the template before saving.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Layers3 className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-xl font-semibold tracking-tight">
                                                {data.name || 'Untitled template'}
                                            </p>
                                        </div>

                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {data.description?.trim()
                                                ? data.description
                                                : 'A short summary will appear here once you add a description.'}
                                        </p>
                                    </div>

                                    <div className="grid gap-3">
                                        <Card>
                                            <CardContent className="p-4">
                                                <p className="text-xs text-muted-foreground">Scope</p>
                                                <p className="mt-1 text-sm font-medium">{summary.scope}</p>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-4">
                                                <p className="text-xs text-muted-foreground">Items</p>
                                                <p className="mt-1 text-sm font-medium">
                                                    {summary.items} item{summary.items === 1 ? '' : 's'}
                                                </p>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-4">
                                                <p className="text-xs text-muted-foreground">Weight</p>
                                                <p className="mt-1 text-sm font-medium">{summary.weight}</p>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-4">
                                                <p className="text-xs text-muted-foreground">Status</p>
                                                <div className="mt-1">
                                                    <Badge variant={data.is_active ? 'default' : 'outline'}>
                                                        {summary.active}
                                                    </Badge>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="flex flex-col gap-3 p-4">
                                    <Link href="/scorecard-templates" className="w-full">
                                        <Button variant="outline" type="button" className="w-full">
                                            Cancel
                                        </Button>
                                    </Link>

                                    <Button type="submit" disabled={processing} className="w-full">
                                        <Save className="mr-2 h-4 w-4" />
                                        {processing ? 'Saving...' : 'Save Template'}
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
