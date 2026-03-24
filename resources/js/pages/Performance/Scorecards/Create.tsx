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
import { ArrowLeft, ClipboardList, Save, X } from 'lucide-react';
import type { FormEvent } from 'react';

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

const perspectiveLabels: Record<string, string> = {
    financial: 'Financial',
    customer: 'Customer',
    internal_process: 'Internal Process',
    learning_and_growth: 'Learning & Growth',
};

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

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

export default function ScorecardCreate() {
    const { options } = usePage<{ options: CreateOptions }>().props;

    const { data, setData, errors, post, processing } = useForm({
        employee_id: '',
        performance_cycle_id: '',
        scorecard_template_id: '',
        status: 'draft',
        notes: '',
    });

    const selectedTemplate = options.templates.find(
        (t) => String(t.id) === data.scorecard_template_id,
    );

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

            <div className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <Link href="/employee-scorecards">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">New Employee Scorecard</h1>
                        <p className="text-sm text-muted-foreground">
                            Create a new balanced scorecard for an employee.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
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
                                    onValueChange={(v) => setData('performance_cycle_id', v)}
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
                                <FieldLabel>Template (Optional)</FieldLabel>
                                <Select
                                    value={data.scorecard_template_id}
                                    onValueChange={(v) => setData('scorecard_template_id', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="No template" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">No template</SelectItem>
                                        {options.templates.map((tmpl) => (
                                            <SelectItem key={tmpl.id} value={String(tmpl.id)}>
                                                {tmpl.name}
                                                {!tmpl.is_active ? ' (Inactive)' : ''}
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
                                    placeholder="Additional notes for this scorecard..."
                                />
                                <FieldError message={errors.notes} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Template Preview */}
                    {selectedTemplate && selectedTemplate.items.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Template Preview</CardTitle>
                                <CardDescription>
                                    The following KPI items from &quot;{selectedTemplate.name}&quot; will
                                    be added to the scorecard.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
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
                                                        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                                                            {perspectiveLabels[item.perspective] ?? formatLabel(item.perspective)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="font-medium">{item.kpi_name}</TableCell>
                                                    <TableCell>{item.weight}%</TableCell>
                                                    <TableCell>{formatLabel(item.target_type)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {selectedTemplate && selectedTemplate.items.length === 0 && (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                    <h3 className="mb-1 text-lg font-semibold">Empty Template</h3>
                                    <p className="text-sm text-muted-foreground">
                                        The selected template does not contain any KPI items.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

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
                            {processing ? 'Saving...' : 'Create Scorecard'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
