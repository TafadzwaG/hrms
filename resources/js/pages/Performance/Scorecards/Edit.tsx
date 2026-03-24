import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { ArrowLeft, Plus, Save, Trash2, X } from 'lucide-react';
import type { FormEvent } from 'react';
import { useCallback, useState } from 'react';

type Employee = {
    id: number;
    first_name: string;
    last_name: string;
};

type Cycle = {
    id: number;
    name: string;
};

type Template = {
    id: number;
    name: string;
};

type ScorecardItemPayload = {
    id?: number;
    perspective: string;
    objective: string;
    kpi_name: string;
    target_type: string;
    target_value: string | null;
    weight: number;
    kpi?: {
        id: number;
        name: string;
    } | null;
};

type ScorecardPayload = {
    id: number;
    employee_id: number;
    performance_cycle_id: number;
    scorecard_template_id: number | null;
    status: string;
    notes: string | null;
    items: ScorecardItemPayload[];
};

type ScorecardItem = {
    perspective: string;
    objective: string;
    kpi_name: string;
    target_type: string;
    target_value: string;
    weight: string;
};

const perspectiveLabels: Record<string, string> = {
    financial: 'Financial',
    customer: 'Customer',
    internal_process: 'Internal Process',
    learning_and_growth: 'Learning & Growth',
};

const perspectiveOrder = ['financial', 'customer', 'internal_process', 'learning_and_growth'];

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

export default function ScorecardEdit() {
    const { scorecard, options } = usePage<{
        scorecard: ScorecardPayload;
        options: {
            employees: Employee[];
            cycles: Cycle[];
            templates: Template[];
            perspectives: string[];
            statuses: string[];
            ratingBands: string[];
            targetTypes: string[];
        };
    }>().props;

    const initialItems: ScorecardItem[] = scorecard.items.map((item) => ({
        perspective: item.perspective,
        objective: item.objective,
        kpi_name: item.kpi_name,
        target_type: item.target_type,
        target_value: item.target_value ?? '',
        weight: String(item.weight),
    }));

    const { data, setData, errors, put, processing } = useForm({
        employee_id: String(scorecard.employee_id),
        performance_cycle_id: String(scorecard.performance_cycle_id),
        scorecard_template_id: scorecard.scorecard_template_id ? String(scorecard.scorecard_template_id) : '',
        status: scorecard.status,
        notes: scorecard.notes ?? '',
        items: initialItems,
    });

    const [items, setItems] = useState<ScorecardItem[]>(initialItems);

    const addItem = useCallback((perspective: string) => {
        const newItem: ScorecardItem = {
            perspective,
            objective: '',
            kpi_name: '',
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

    const updateItem = useCallback((index: number, field: keyof ScorecardItem, value: string) => {
        const updated = [...items];
        updated[index] = { ...updated[index], [field]: value };
        setItems(updated);
        setData('items', updated);
    }, [items, setData]);

    const totalWeight = items.reduce((sum, item) => sum + (parseFloat(item.weight) || 0), 0);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/employee-scorecards/${scorecard.id}`, { preserveScroll: true });
    };

    const getItemsForPerspective = (perspective: string) =>
        items.map((item, idx) => ({ item, idx })).filter(({ item }) => item.perspective === perspective);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Performance', href: '/performance' },
                { title: 'Scorecards', href: '/employee-scorecards' },
                { title: 'Edit Scorecard', href: '#' },
            ]}
        >
            <Head title="Edit Scorecard" />

            <div className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <Link href="/employee-scorecards">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Scorecard</h1>
                        <p className="text-sm text-muted-foreground">
                            Update the scorecard details and KPI items.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Scorecard Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Scorecard Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <FieldLabel required>Employee</FieldLabel>
                                <Select
                                    value={data.employee_id}
                                    onValueChange={(v) => setData('employee_id', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select employee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options.employees.map((emp) => (
                                            <SelectItem key={emp.id} value={String(emp.id)}>
                                                {emp.first_name} {emp.last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError message={errors.employee_id} />
                            </div>
                            <div>
                                <FieldLabel required>Performance Cycle</FieldLabel>
                                <Select
                                    value={data.performance_cycle_id}
                                    onValueChange={(v) => setData('performance_cycle_id', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select cycle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options.cycles.map((cycle) => (
                                            <SelectItem key={cycle.id} value={String(cycle.id)}>
                                                {cycle.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError message={errors.performance_cycle_id} />
                            </div>
                            <div>
                                <FieldLabel>Template</FieldLabel>
                                <Select
                                    value={data.scorecard_template_id}
                                    onValueChange={(v) => setData('scorecard_template_id', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select template (optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options.templates.map((tpl) => (
                                            <SelectItem key={tpl.id} value={String(tpl.id)}>
                                                {tpl.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError message={errors.scorecard_template_id} />
                            </div>
                            <div>
                                <FieldLabel required>Status</FieldLabel>
                                <Select
                                    value={data.status}
                                    onValueChange={(v) => setData('status', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options.statuses.map((s) => (
                                            <SelectItem key={s} value={s}>
                                                {formatLabel(s)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError message={errors.status} />
                            </div>
                            <div className="sm:col-span-2">
                                <FieldLabel>Notes</FieldLabel>
                                <Textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows={3}
                                    placeholder="Additional notes..."
                                />
                                <FieldError message={errors.notes} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* KPI Items by Perspective */}
                    <Card>
                        <CardHeader>
                            <CardTitle>KPI Items</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {perspectiveOrder.map((perspective) => {
                                const perspectiveItems = getItemsForPerspective(perspective);
                                return (
                                    <div key={perspective} className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                                {perspectiveLabels[perspective] ?? formatLabel(perspective)}
                                            </h3>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => addItem(perspective)}
                                            >
                                                <Plus className="mr-1 h-3 w-3" />
                                                Add Item
                                            </Button>
                                        </div>

                                        {perspectiveItems.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">
                                                No items for this perspective.
                                            </p>
                                        ) : (
                                            perspectiveItems.map(({ item, idx }) => (
                                                <div key={idx} className="rounded-lg border p-4 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium">
                                                            Item {perspectiveItems.indexOf(perspectiveItems.find(pi => pi.idx === idx)!) + 1}
                                                        </span>
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
                                                            <FieldLabel>Perspective</FieldLabel>
                                                            <Select
                                                                value={item.perspective}
                                                                onValueChange={(v) => updateItem(idx, 'perspective', v)}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select perspective" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {options.perspectives.map((p) => (
                                                                        <SelectItem key={p} value={p}>
                                                                            {perspectiveLabels[p] ?? formatLabel(p)}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
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
                                                            <FieldLabel required>KPI Name</FieldLabel>
                                                            <Input
                                                                value={item.kpi_name}
                                                                onChange={(e) => updateItem(idx, 'kpi_name', e.target.value)}
                                                                placeholder="KPI name"
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
                                                                    {options.targetTypes.map((t) => (
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

                                        {perspectiveOrder.indexOf(perspective) < perspectiveOrder.length - 1 && (
                                            <hr className="mt-4" />
                                        )}
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

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
                        <Link href="/employee-scorecards">
                            <Button variant="outline" type="button">
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Saving...' : 'Update Scorecard'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
