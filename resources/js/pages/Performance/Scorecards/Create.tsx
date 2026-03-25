import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    BriefcaseBusiness,
    ClipboardList,
    LayoutGrid,
    Save,
    Sparkles,
    Target,
    UserRound,
} from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';

type EmployeeOption = {
    id: number;
    first_name: string;
    middle_name: string | null;
    surname: string;
    staff_number: string;
};

type CycleOption = {
    id: number;
    title: string;
    status: string;
};

type TemplateItem = {
    id: number;
    perspective: string;
    kpi_name: string;
    weight: number;
    target_type: string;
};

type TemplateOption = {
    id: number;
    name: string;
    is_active: boolean;
    items: TemplateItem[];
};

type CreateOptions = {
    employees: EmployeeOption[];
    cycles: CycleOption[];
    templates: TemplateOption[];
    perspectives: string[];
    statuses: string[];
    ratingBands: string[];
    targetTypes: string[];
};

const NO_TEMPLATE_VALUE = '__none__';

const perspectiveLabels: Record<string, string> = {
    financial: 'Financial',
    customer: 'Customer',
    internal_process: 'Internal Process',
    learning_and_growth: 'Learning & Growth',
};

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

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

function StatCard({
    icon,
    label,
    value,
}: {
    icon: ReactNode;
    label: string;
    value: string;
}) {
    return (
        <Card>
            <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
                    {icon}
                </div>
                <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {label}
                    </p>
                    <p className="truncate text-sm font-medium">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
}

export default function ScorecardCreate() {
    const { options } = usePage<{ options: CreateOptions }>().props;

    const { data, setData, errors, post, processing } = useForm({
        employee_id: '',
        performance_cycle_id: '',
        scorecard_template_id: '',
        status: 'draft',
        notes: '',
    });

    const selectedEmployee = options.employees.find(
        (emp) => String(emp.id) === data.employee_id,
    );

    const selectedCycle = options.cycles.find(
        (cycle) => String(cycle.id) === data.performance_cycle_id,
    );

    const selectedTemplate = options.templates.find(
        (template) => String(template.id) === data.scorecard_template_id,
    );

    const templateItemsCount = selectedTemplate?.items.length ?? 0;
    const templateWeightTotal =
        selectedTemplate?.items.reduce((sum, item) => sum + Number(item.weight), 0) ?? 0;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/employee-scorecards', { preserveScroll: true });
    };

    const getEmployeeDisplayName = (emp: EmployeeOption) => {
        const parts = [emp.first_name, emp.middle_name, emp.surname].filter(Boolean);
        return `${parts.join(' ')} (${emp.staff_number})`;
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Performance', href: '/performance' },
                { title: 'Scorecards', href: '/employee-scorecards' },
                { title: 'New Scorecard', href: '#' },
            ]}
        >
            <Head title="New Employee Scorecard" />

            <div className="w-full space-y-6 p-4 md:p-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                            <div className="flex items-start gap-4">
                                <Link href="/employee-scorecards">
                                    <Button variant="outline" size="icon">
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                </Link>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Sparkles className="h-4 w-4" />
                                        <span className="text-sm">Performance Management</span>
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-semibold tracking-tight">
                                            New Employee Scorecard
                                        </h1>
                                        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                                            Build a focused scorecard with a clean monochromatic
                                            layout, structured sections, and a live summary panel.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[520px]">
                                <StatCard
                                    icon={<UserRound className="h-4 w-4" />}
                                    label="Employee"
                                    value={
                                        selectedEmployee
                                            ? getEmployeeDisplayName(selectedEmployee)
                                            : 'Not selected'
                                    }
                                />
                                <StatCard
                                    icon={<BriefcaseBusiness className="h-4 w-4" />}
                                    label="Cycle"
                                    value={selectedCycle?.title ?? 'Not selected'}
                                />
                                <StatCard
                                    icon={<LayoutGrid className="h-4 w-4" />}
                                    label="Template"
                                    value={selectedTemplate?.name ?? 'No template'}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-12">
                    <div className="space-y-6 xl:col-span-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Assignment</CardTitle>
                                <CardDescription>
                                    Choose who this scorecard belongs to, which cycle it applies to,
                                    and optionally preload KPI items from a template.
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
                                                    {getEmployeeDisplayName(emp)}
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
                                                    {cycle.title}
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
                                            <SelectValue placeholder="No template" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={NO_TEMPLATE_VALUE}>
                                                No template
                                            </SelectItem>
                                            {options.templates.map((template) => (
                                                <SelectItem
                                                    key={template.id}
                                                    value={String(template.id)}
                                                >
                                                    {template.name}
                                                    {!template.is_active ? ' (Inactive)' : ''}
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
                                            {options.statuses
                                                .filter((status) => status.trim() !== '')
                                                .map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {formatLabel(status)}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    <FieldError message={errors.status} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Internal Notes</CardTitle>
                                <CardDescription>
                                    Capture any context, preparation notes, or setup instructions for
                                    this scorecard.
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <div>
                                    <FieldLabel>Notes</FieldLabel>
                                    <Textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={6}
                                        placeholder="Add setup notes, manager guidance, or context for this scorecard..."
                                    />
                                    <FieldError message={errors.notes} />
                                </div>
                            </CardContent>
                        </Card>

                        {selectedTemplate && (
                            <Card>
                                <CardHeader className="space-y-4">
                                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <CardTitle>Template Blueprint</CardTitle>
                                            <CardDescription>
                                                KPI items that will be used from &quot;
                                                {selectedTemplate.name}
                                                &quot;.
                                            </CardDescription>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="secondary">
                                                {templateItemsCount} item
                                                {templateItemsCount === 1 ? '' : 's'}
                                            </Badge>
                                            <Badge variant="outline">
                                                Total weight: {templateWeightTotal}%
                                            </Badge>
                                            {!selectedTemplate.is_active && (
                                                <Badge variant="outline">Inactive template</Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    {selectedTemplate.items.length > 0 ? (
                                        <div className="overflow-x-auto rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Perspective</TableHead>
                                                        <TableHead>KPI</TableHead>
                                                        <TableHead>Weight</TableHead>
                                                        <TableHead>Target Type</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {selectedTemplate.items.map((item) => (
                                                        <TableRow key={item.id}>
                                                            <TableCell>
                                                                <Badge variant="outline">
                                                                    {perspectiveLabels[
                                                                        item.perspective
                                                                    ] ??
                                                                        formatLabel(
                                                                            item.perspective,
                                                                        )}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                {item.kpi_name}
                                                            </TableCell>
                                                            <TableCell>{item.weight}%</TableCell>
                                                            <TableCell>
                                                                {formatLabel(item.target_type)}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center rounded-md border border-dashed px-6 py-12 text-center">
                                            <ClipboardList className="mb-4 h-10 w-10 text-muted-foreground" />
                                            <h3 className="text-base font-semibold">
                                                Empty Template
                                            </h3>
                                            <p className="mt-1 max-w-md text-sm text-muted-foreground">
                                                The selected template does not currently contain KPI
                                                items. You can still create the scorecard and manage
                                                items afterward.
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-6 xl:col-span-4">
                        <div className="space-y-6 xl:sticky xl:top-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Live Summary</CardTitle>
                                    <CardDescription>
                                        Review the scorecard structure before saving.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                            Employee
                                        </p>
                                        <p className="text-sm font-medium">
                                            {selectedEmployee
                                                ? getEmployeeDisplayName(selectedEmployee)
                                                : 'Not selected'}
                                        </p>
                                    </div>

                                    <Separator />

                                    <div className="space-y-1">
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                            Cycle
                                        </p>
                                        <p className="text-sm font-medium">
                                            {selectedCycle?.title ?? 'Not selected'}
                                        </p>
                                        {selectedCycle?.status && (
                                            <p className="text-xs text-muted-foreground">
                                                Status: {formatLabel(selectedCycle.status)}
                                            </p>
                                        )}
                                    </div>

                                    <Separator />

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Target className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-sm font-medium">Template Overview</p>
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
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
                                                        {templateItemsCount}
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            <Card>
                                                <CardContent className="p-4">
                                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                        Total Weight
                                                    </p>
                                                    <p className="mt-1 text-sm font-medium">
                                                        {templateWeightTotal}%
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            <Card>
                                                <CardContent className="p-4">
                                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                        Scorecard Status
                                                    </p>
                                                    <p className="mt-1 text-sm font-medium">
                                                        {formatLabel(data.status)}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </div>
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
                                        Save now or return to the scorecards list.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="flex flex-col gap-3">
                                    <Link href="/employee-scorecards" className="w-full">
                                        <Button variant="outline" type="button" className="w-full">
                                            Cancel
                                        </Button>
                                    </Link>

                                    <Button type="submit" disabled={processing} className="w-full">
                                        <Save className="mr-2 h-4 w-4" />
                                        {processing ? 'Saving...' : 'Create Scorecard'}
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
