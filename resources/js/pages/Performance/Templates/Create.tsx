import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';
import { useCallback, useState } from 'react';

type KpiOption = {
    id: number;
    name: string;
    code: string;
    perspective: string;
    target_type: string;
    default_target: string | null;
    default_weight: number | null;
};

type TemplateItem = {
    perspective: string;
    objective: string;
    kpi_name: string;
    kpi_library_id: string;
    target_type: string;
    target_value: string;
    weight: string;
};

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
        <label className="mb-2 block text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {children}
            {required && <span className="ml-1 text-destructive">*</span>}
        </label>
    );
}

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="mt-1.5 text-sm font-medium text-destructive">{message}</p>;
}

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const perspectiveOrder = ['financial', 'customer', 'internal_process', 'learning_and_growth'];

export default function TemplateCreate() {
    const { kpis, perspectives, targetTypes, scopeTypes } = usePage<{
        kpis: KpiOption[];
        perspectives: string[];
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

    const addItem = useCallback((perspective: string) => {
        const newItem: TemplateItem = {
            perspective,
            objective: '',
            kpi_name: '',
            kpi_library_id: '',
            target_type: '',
            target_value: '',
            weight: '',
        };
        const updated = [...items, newItem];
        setItems(updated);
        setData('items', updated);
    }, [items, setData]);

    const removeItem = useCallback((index: number) => {
        const updated = items.filter((_, i) => i !== index);
        setItems(updated);
        setData('items', updated);
    }, [items, setData]);

    const updateItem = useCallback((index: number, field: keyof TemplateItem, value: string) => {
        const updated = [...items];
        updated[index] = { ...updated[index], [field]: value };

        // If picking from KPI library, auto-fill fields
        if (field === 'kpi_library_id' && value) {
            const kpi = kpis.find((k) => String(k.id) === value);
            if (kpi) {
                updated[index].kpi_name = kpi.name;
                updated[index].perspective = kpi.perspective;
                updated[index].target_type = kpi.target_type;
                if (kpi.default_target) updated[index].target_value = kpi.default_target;
                if (kpi.default_weight != null) updated[index].weight = String(kpi.default_weight);
            }
        }

        setItems(updated);
        setData('items', updated);
    }, [items, kpis, setData]);

    const totalWeight = items.reduce((sum, item) => sum + (parseFloat(item.weight) || 0), 0);

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

            <div className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <Link href="/scorecard-templates">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">New Scorecard Template</h1>
                        <p className="text-sm text-muted-foreground">
                            Create a reusable template with predefined KPI items.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Template Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Template Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <FieldLabel required>Name</FieldLabel>
                                <Input
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Standard Employee Scorecard"
                                />
                                <FieldError message={errors.name} />
                            </div>
                            <div className="sm:col-span-2">
                                <FieldLabel>Description</FieldLabel>
                                <Textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    placeholder="Describe the purpose of this template..."
                                />
                                <FieldError message={errors.description} />
                            </div>
                            <div>
                                <FieldLabel>Scope Type</FieldLabel>
                                <Select
                                    value={data.scope_type}
                                    onValueChange={(v) => setData('scope_type', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select scope type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {scopeTypes.map((s) => (
                                            <SelectItem key={s} value={s}>
                                                {formatLabel(s)}
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
                                    placeholder="e.g. department name, job grade"
                                />
                                <FieldError message={errors.scope_value} />
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <label htmlFor="is_active" className="text-sm font-medium">
                                    Active
                                </label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Template Items by Perspective */}
                    {perspectiveOrder.map((perspective) => {
                        const perspectiveItems = getItemsForPerspective(perspective);
                        return (
                            <Card key={perspective}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                    <CardTitle>{formatLabel(perspective)}</CardTitle>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addItem(perspective)}
                                    >
                                        <Plus className="mr-1 h-3 w-3" />
                                        Add Item
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {perspectiveItems.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">
                                            No items added for this perspective yet.
                                        </p>
                                    ) : (
                                        perspectiveItems.map(({ item, idx }) => (
                                            <div key={idx} className="rounded-lg border p-4 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium">Item {perspectiveItems.indexOf(perspectiveItems.find(pi => pi.idx === idx)!) + 1}</span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeItem(idx)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                                    <div>
                                                        <FieldLabel>KPI from Library</FieldLabel>
                                                        <Select
                                                            value={item.kpi_library_id}
                                                            onValueChange={(v) => updateItem(idx, 'kpi_library_id', v)}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Pick from library (optional)" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {kpis
                                                                    .filter((k) => k.perspective === perspective)
                                                                    .map((k) => (
                                                                        <SelectItem key={k.id} value={String(k.id)}>
                                                                            {k.code} - {k.name}
                                                                        </SelectItem>
                                                                    ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <FieldLabel required>KPI Name</FieldLabel>
                                                        <Input
                                                            value={item.kpi_name}
                                                            onChange={(e) => updateItem(idx, 'kpi_name', e.target.value)}
                                                            placeholder="KPI name"
                                                        />
                                                    </div>
                                                    <div>
                                                        <FieldLabel required>Objective</FieldLabel>
                                                        <Input
                                                            value={item.objective}
                                                            onChange={(e) => updateItem(idx, 'objective', e.target.value)}
                                                            placeholder="Strategic objective"
                                                        />
                                                    </div>
                                                    <div>
                                                        <FieldLabel required>Target Type</FieldLabel>
                                                        <Select
                                                            value={item.target_type}
                                                            onValueChange={(v) => updateItem(idx, 'target_type', v)}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {targetTypes.map((t) => (
                                                                    <SelectItem key={t} value={t}>
                                                                        {formatLabel(t)}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <FieldLabel>Target Value</FieldLabel>
                                                        <Input
                                                            value={item.target_value}
                                                            onChange={(e) => updateItem(idx, 'target_value', e.target.value)}
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
                                                            onChange={(e) => updateItem(idx, 'weight', e.target.value)}
                                                            placeholder="e.g. 10"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}

                    {/* Total Weight */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Total Weight</span>
                                <span className={`text-lg font-bold ${Math.abs(totalWeight - 100) < 0.01 ? 'text-emerald-600' : 'text-destructive'}`}>
                                    {totalWeight.toFixed(1)}%
                                </span>
                            </div>
                            {Math.abs(totalWeight - 100) >= 0.01 && items.length > 0 && (
                                <p className="mt-1 text-sm text-destructive">
                                    Total weight should equal 100%.
                                </p>
                            )}
                            <FieldError message={errors.items} />
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex items-center justify-end gap-3">
                        <Link href="/scorecard-templates">
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Saving...' : 'Save Template'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
