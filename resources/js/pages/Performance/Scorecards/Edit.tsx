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
import { Separator } from '@/components/ui/separator';
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
import {
    ArrowLeft,
    BriefcaseBusiness,
    ClipboardList,
    LayoutGrid,
    PieChart,
    Plus,
    Save,
    Sparkles,
    Target,
    Trash2,
    UserRound,
    X,
} from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';

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

const NO_TEMPLATE_VALUE = '__none__';

const perspectiveLabels: Record<string, string> = {
    financial: 'Financial',
    customer: 'Customer',
    internal_process: 'Internal Process',
    learning_and_growth: 'Learning & Growth',
};

const perspectiveOrder = [
    'financial',
    'customer',
    'internal_process',
    'learning_and_growth',
];

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
    return <p className="mt-1.5 text-sm font-medium text-destructive">{message}</p>;
}

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function MiniDonut({
    value,
    size = 72,
    stroke = 10,
    centerLabel,
}: {
    value: number;
    size?: number;
    stroke?: number;
    centerLabel?: string;
}) {
    const clamped = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
    const radius = 50 - stroke / 2;
    const circumference = 2 * Math.PI * radius;
    const dash = (clamped / 100) * circumference;

    return (
        <div className="relative shrink-0" style={{ width: size, height: size }}>
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    strokeWidth={stroke}
                    style={{ stroke: 'hsl(var(--muted))' }}
                />
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={`${dash} ${circumference}`}
                    style={{
                        stroke: 'hsl(var(--foreground))',
                        transition: 'stroke-dasharray 0.35s ease',
                    }}
                />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold">
                {centerLabel ?? `${Math.round(clamped)}%`}
            </div>
        </div>
    );
}

function MetricCard({
    icon,
    label,
    value,
    helper,
}: {
    icon: ReactNode;
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

    const cleanStatuses = options.statuses.filter((status) => status.trim() !== '');
    const cleanPerspectives = options.perspectives.filter((p) => p.trim() !== '');
    const cleanTargetTypes = options.targetTypes.filter((t) => t.trim() !== '');

    const { data, setData, errors, put, processing } = useForm({
        employee_id: String(scorecard.employee_id),
        performance_cycle_id: String(scorecard.performance_cycle_id),
        scorecard_template_id: scorecard.scorecard_template_id
            ? String(scorecard.scorecard_template_id)
            : '',
        status: scorecard.status,
        notes: scorecard.notes ?? '',
        items: initialItems,
    });

    const [items, setItems] = useState<ScorecardItem[]>(initialItems);

    const addItem = useCallback(
        (perspective: string) => {
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
        },
        [items, setData],
    );

    const removeItem = useCallback(
        (index: number) => {
            const updated = items.filter((_, i) => i !== index);
            setItems(updated);
            setData('items', updated);
        },
        [items, setData],
    );

    const updateItem = useCallback(
        (index: number, field: keyof ScorecardItem, value: string) => {
            const updated = [...items];
            updated[index] = { ...updated[index], [field]: value };
            setItems(updated);
            setData('items', updated);
        },
        [items, setData],
    );

    const totalWeight = useMemo(
        () => items.reduce((sum, item) => sum + (parseFloat(item.weight) || 0), 0),
        [items],
    );

    const totalItems = items.length;
    const weightPercent = Math.max(0, Math.min(100, totalWeight));
    const isWeightBalanced = Math.abs(totalWeight - 100) < 0.01;

    const selectedEmployee = options.employees.find(
        (emp) => String(emp.id) === data.employee_id,
    );

    const selectedCycle = options.cycles.find(
        (cycle) => String(cycle.id) === data.performance_cycle_id,
    );

    const selectedTemplate = options.templates.find(
        (tpl) => String(tpl.id) === data.scorecard_template_id,
    );

    const perspectiveCounts = useMemo(
        () =>
            perspectiveOrder.map((perspective) => {
                const count = items.filter((item) => item.perspective === perspective).length;
                const weight = items
                    .filter((item) => item.perspective === perspective)
                    .reduce((sum, item) => sum + (parseFloat(item.weight) || 0), 0);

                return {
                    perspective,
                    count,
                    weight,
                };
            }),
        [items],
    );

    const getItemsForPerspective = (perspective: string) =>
        items
            .map((item, idx) => ({ item, idx }))
            .filter(({ item }) => item.perspective === perspective);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/employee-scorecards/${scorecard.id}`, { preserveScroll: true });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Performance', href: '/performance' },
                { title: 'Scorecards', href: '/employee-scorecards' },
                { title: 'Edit Scorecard', href: '#' },
            ]}
        >
            <Head title="Edit Scorecard" />

            <div className="w-full space-y-6 p-4 md:p-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Link href={`/employee-scorecards/${scorecard.id}`}>
                                        <Button variant="outline" size="icon">
                                            <ArrowLeft className="h-4 w-4" />
                                        </Button>
                                    </Link>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Sparkles className="h-4 w-4" />
                                        <span>Scorecard Editor</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h1 className="text-3xl font-semibold tracking-tight">
                                        Edit Employee Scorecard
                                    </h1>
                                    <p className="max-w-2xl text-sm text-muted-foreground">
                                        Refine the assignment, reshape KPI items by perspective, and
                                        rebalance the scorecard using a cleaner monochrome workspace.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[540px]">
                                <MetricCard
                                    icon={<UserRound className="h-4 w-4" />}
                                    label="Employee"
                                    value={
                                        selectedEmployee
                                            ? `${selectedEmployee.first_name} ${selectedEmployee.last_name}`
                                            : 'Not selected'
                                    }
                                    helper="Current assignment"
                                />
                                <MetricCard
                                    icon={<BriefcaseBusiness className="h-4 w-4" />}
                                    label="Cycle"
                                    value={selectedCycle?.name ?? 'Not selected'}
                                    helper="Linked review cycle"
                                />
                                <MetricCard
                                    icon={<LayoutGrid className="h-4 w-4" />}
                                    label="KPI Items"
                                    value={totalItems}
                                    helper="Items in this scorecard"
                                />
                            </div>
                        </div>

                        <Separator className="my-6" />

                        <div className="grid gap-4 md:grid-cols-3">
                            <MetricCard
                                icon={<ClipboardList className="h-4 w-4" />}
                                label="Status"
                                value={formatLabel(data.status)}
                                helper="Current workflow stage"
                            />
                            <MetricCard
                                icon={<PieChart className="h-4 w-4" />}
                                label="Total Weight"
                                value={`${totalWeight.toFixed(1)}%`}
                                helper="Should total 100%"
                            />
                            <MetricCard
                                icon={<Target className="h-4 w-4" />}
                                label="Template"
                                value={selectedTemplate?.name ?? 'No template'}
                                helper="Optional source blueprint"
                            />
                        </div>
                    </CardContent>
                </Card>

                <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-12">
                    <div className="space-y-6 xl:col-span-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Assignment & Settings</CardTitle>
                                <CardDescription>
                                    Update the employee, review cycle, optional template, workflow
                                    status, and internal notes.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="grid gap-6 md:grid-cols-2">
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
                                        onValueChange={(v) =>
                                            setData('performance_cycle_id', v)
                                        }
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
                                        value={data.scorecard_template_id || NO_TEMPLATE_VALUE}
                                        onValueChange={(v) =>
                                            setData(
                                                'scorecard_template_id',
                                                v === NO_TEMPLATE_VALUE ? '' : v,
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select template (optional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={NO_TEMPLATE_VALUE}>
                                                No template
                                            </SelectItem>
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
                                            {cleanStatuses.map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {formatLabel(status)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FieldError message={errors.status} />
                                </div>

                                <div className="md:col-span-2">
                                    <FieldLabel>Notes</FieldLabel>
                                    <Textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={4}
                                        placeholder="Add internal notes, context, or editing guidance..."
                                    />
                                    <FieldError message={errors.notes} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                                    <div>
                                        <CardTitle>KPI Blueprint</CardTitle>
                                        <CardDescription>
                                            Edit items by perspective and keep the weighting balanced
                                            across the full scorecard.
                                        </CardDescription>
                                    </div>

                                    <Badge variant={isWeightBalanced ? 'default' : 'secondary'}>
                                        {isWeightBalanced ? 'Weight Balanced' : 'Needs Rebalancing'}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                {perspectiveOrder.map((perspective) => {
                                    const perspectiveItems = getItemsForPerspective(perspective);
                                    const sectionWeight = perspectiveItems.reduce(
                                        (sum, { item }) => sum + (parseFloat(item.weight) || 0),
                                        0,
                                    );

                                    return (
                                        <Card key={perspective}>
                                            <CardHeader className="pb-4">
                                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                                    <div>
                                                        <CardTitle className="text-base">
                                                            {perspectiveLabels[perspective] ??
                                                                formatLabel(perspective)}
                                                        </CardTitle>
                                                        <CardDescription>
                                                            {perspectiveItems.length} item
                                                            {perspectiveItems.length === 1 ? '' : 's'} •{' '}
                                                            {sectionWeight.toFixed(1)}% total weight
                                                        </CardDescription>
                                                    </div>

                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => addItem(perspective)}
                                                    >
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Add Item
                                                    </Button>
                                                </div>
                                            </CardHeader>

                                            <CardContent>
                                                {perspectiveItems.length === 0 ? (
                                                    <div className="rounded-lg border border-dashed px-4 py-8 text-center">
                                                        <p className="text-sm text-muted-foreground">
                                                            No items for this perspective yet.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {perspectiveItems.map(({ item, idx }, index) => (
                                                            <Card key={idx}>
                                                                <CardHeader className="pb-4">
                                                                    <div className="flex items-center justify-between gap-4">
                                                                        <div className="space-y-1">
                                                                            <CardTitle className="text-sm">
                                                                                Item {index + 1}
                                                                            </CardTitle>
                                                                            <CardDescription>
                                                                                KPI setup and weight
                                                                                definition
                                                                            </CardDescription>
                                                                        </div>

                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => removeItem(idx)}
                                                                        >
                                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                                        </Button>
                                                                    </div>
                                                                </CardHeader>

                                                                <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                                                    <div>
                                                                        <FieldLabel>Perspective</FieldLabel>
                                                                        <Select
                                                                            value={item.perspective}
                                                                            onValueChange={(v) =>
                                                                                updateItem(
                                                                                    idx,
                                                                                    'perspective',
                                                                                    v,
                                                                                )
                                                                            }
                                                                        >
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder="Select perspective" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                {cleanPerspectives.map((p) => (
                                                                                    <SelectItem
                                                                                        key={p}
                                                                                        value={p}
                                                                                    >
                                                                                        {perspectiveLabels[p] ??
                                                                                            formatLabel(
                                                                                                p,
                                                                                            )}
                                                                                    </SelectItem>
                                                                                ))}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>

                                                                    <div>
                                                                        <FieldLabel required>
                                                                            Objective
                                                                        </FieldLabel>
                                                                        <Input
                                                                            value={item.objective}
                                                                            onChange={(e) =>
                                                                                updateItem(
                                                                                    idx,
                                                                                    'objective',
                                                                                    e.target.value,
                                                                                )
                                                                            }
                                                                            placeholder="Strategic objective"
                                                                        />
                                                                    </div>

                                                                    <div>
                                                                        <FieldLabel required>
                                                                            KPI Name
                                                                        </FieldLabel>
                                                                        <Input
                                                                            value={item.kpi_name}
                                                                            onChange={(e) =>
                                                                                updateItem(
                                                                                    idx,
                                                                                    'kpi_name',
                                                                                    e.target.value,
                                                                                )
                                                                            }
                                                                            placeholder="KPI name"
                                                                        />
                                                                    </div>

                                                                    <div>
                                                                        <FieldLabel required>
                                                                            Target Type
                                                                        </FieldLabel>
                                                                        <Select
                                                                            value={item.target_type}
                                                                            onValueChange={(v) =>
                                                                                updateItem(
                                                                                    idx,
                                                                                    'target_type',
                                                                                    v,
                                                                                )
                                                                            }
                                                                        >
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder="Select type" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                {cleanTargetTypes.map((type) => (
                                                                                    <SelectItem
                                                                                        key={type}
                                                                                        value={type}
                                                                                    >
                                                                                        {formatLabel(
                                                                                            type,
                                                                                        )}
                                                                                    </SelectItem>
                                                                                ))}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>

                                                                    <div>
                                                                        <FieldLabel>
                                                                            Target Value
                                                                        </FieldLabel>
                                                                        <Input
                                                                            value={item.target_value}
                                                                            onChange={(e) =>
                                                                                updateItem(
                                                                                    idx,
                                                                                    'target_value',
                                                                                    e.target.value,
                                                                                )
                                                                            }
                                                                            placeholder="e.g. 100"
                                                                        />
                                                                    </div>

                                                                    <div>
                                                                        <FieldLabel required>
                                                                            Weight (%)
                                                                        </FieldLabel>
                                                                        <Input
                                                                            type="number"
                                                                            min="0"
                                                                            max="100"
                                                                            step="0.01"
                                                                            value={item.weight}
                                                                            onChange={(e) =>
                                                                                updateItem(
                                                                                    idx,
                                                                                    'weight',
                                                                                    e.target.value,
                                                                                )
                                                                            }
                                                                            placeholder="e.g. 10"
                                                                        />
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6 xl:col-span-4">
                        <div className="space-y-6 xl:sticky xl:top-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Weight Monitor</CardTitle>
                                    <CardDescription>
                                        A quick visual check of total scorecard balance.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-5">
                                    <div className="flex items-center gap-4">
                                        <MiniDonut
                                            value={weightPercent}
                                            size={84}
                                            centerLabel={`${Math.round(weightPercent)}%`}
                                        />
                                        <div>
                                            <p className="text-sm font-medium">
                                                {totalWeight.toFixed(1)}% configured
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {isWeightBalanced
                                                    ? 'Your KPI weighting is balanced.'
                                                    : 'Total weight should equal exactly 100%.'}
                                            </p>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-3">
                                        {perspectiveCounts.map((row) => (
                                            <div
                                                key={row.perspective}
                                                className="flex items-center justify-between rounded-lg border p-3"
                                            >
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {perspectiveLabels[row.perspective] ??
                                                            formatLabel(row.perspective)}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {row.count} item{row.count === 1 ? '' : 's'}
                                                    </p>
                                                </div>

                                                <Badge variant="outline">
                                                    {row.weight.toFixed(1)}%
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>

                                    {!isWeightBalanced && items.length > 0 && (
                                        <p className="text-sm text-destructive">
                                            Total weight should equal 100%.
                                        </p>
                                    )}

                                    <FieldError message={errors.items} />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Live Summary</CardTitle>
                                    <CardDescription>
                                        Review the scorecard composition before saving changes.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                            Employee
                                        </p>
                                        <p className="text-sm font-medium">
                                            {selectedEmployee
                                                ? `${selectedEmployee.first_name} ${selectedEmployee.last_name}`
                                                : 'Not selected'}
                                        </p>
                                    </div>

                                    <Separator />

                                    <div className="space-y-1">
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                            Cycle
                                        </p>
                                        <p className="text-sm font-medium">
                                            {selectedCycle?.name ?? 'Not selected'}
                                        </p>
                                    </div>

                                    <Separator />

                                    <div className="grid gap-3">
                                        <Card>
                                            <CardContent className="p-4">
                                                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                    Status
                                                </p>
                                                <p className="mt-1 text-sm font-medium">
                                                    {formatLabel(data.status)}
                                                </p>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-4">
                                                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                    Template
                                                </p>
                                                <p className="mt-1 text-sm font-medium">
                                                    {selectedTemplate?.name ?? 'No template'}
                                                </p>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-4">
                                                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                    KPI Items
                                                </p>
                                                <p className="mt-1 text-sm font-medium">
                                                    {totalItems}
                                                </p>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-4">
                                                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                    Total Weight
                                                </p>
                                                <p className="mt-1 text-sm font-medium">
                                                    {totalWeight.toFixed(1)}%
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {data.notes.trim() && (
                                        <>
                                            <Separator />
                                            <div className="space-y-1">
                                                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                    Notes Preview
                                                </p>
                                                <p className="line-clamp-5 text-sm text-muted-foreground">
                                                    {data.notes}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Actions</CardTitle>
                                    <CardDescription>
                                        Save your updates or leave without applying changes.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="flex flex-col gap-3">
                                    <Link href={`/employee-scorecards/${scorecard.id}`} className="w-full">
                                        <Button variant="outline" type="button" className="w-full">
                                            <X className="mr-2 h-4 w-4" />
                                            Cancel
                                        </Button>
                                    </Link>

                                    <Button type="submit" disabled={processing} className="w-full">
                                        <Save className="mr-2 h-4 w-4" />
                                        {processing ? 'Saving...' : 'Update Scorecard'}
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