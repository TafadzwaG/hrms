import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import { ArrowLeft, Save } from 'lucide-react';

type Employee = {
    id: number;
    first_name: string;
    middle_name: string | null;
    surname: string;
    staff_number: string;
};

type EligibleScorecard = {
    id: number;
    employee_id: number;
    overall_score: number | null;
    overall_rating: string | null;
    employee: Employee | null;
    cycle: { id: number; title: string } | null;
};

type Plan = {
    id: number;
    employee_scorecard_id: number;
    employee_id: number;
    title: string;
    description: string | null;
    objectives: string | null;
    support_required: string | null;
    start_date: string;
    end_date: string;
    status: string;
    outcome: string | null;
};

function employeeName(emp: Employee) {
    return [emp.first_name, emp.middle_name, emp.surname].filter(Boolean).join(' ');
}

export default function ImprovementPlanEdit() {
    const { plan, employees, scorecards, statuses } = usePage<{
        plan: Plan;
        employees: Employee[];
        scorecards: EligibleScorecard[];
        statuses: string[];
    }>().props;

    const { data, setData, put, processing, errors } = useForm({
        employee_scorecard_id: String(plan.employee_scorecard_id),
        employee_id: String(plan.employee_id),
        title: plan.title,
        description: plan.description ?? '',
        objectives: plan.objectives ?? '',
        support_required: plan.support_required ?? '',
        start_date: plan.start_date,
        end_date: plan.end_date,
        status: plan.status,
        outcome: plan.outcome ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/improvement-plans/${plan.id}`);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Performance', href: '/performance' },
                { title: 'Improvement Plans', href: '/improvement-plans' },
                { title: 'Edit', href: '#' },
            ]}
        >
            <Head title="Edit Improvement Plan" />

            <div className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={`/improvement-plans/${plan.id}`}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Improvement Plan</h1>
                        <p className="text-sm text-muted-foreground">
                            Update the performance improvement plan details.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Plan Details</CardTitle>
                            <CardDescription>Update plan information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Scorecard</Label>
                                    <Select
                                        value={data.employee_scorecard_id}
                                        onValueChange={(v) => setData('employee_scorecard_id', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select scorecard..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {scorecards.map((sc) => (
                                                <SelectItem key={sc.id} value={String(sc.id)}>
                                                    {sc.employee ? employeeName(sc.employee) : `Scorecard #${sc.id}`}
                                                    {sc.cycle ? ` - ${sc.cycle.title}` : ''}
                                                    {sc.overall_rating ? ` (${sc.overall_rating})` : ''}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.employee_scorecard_id && (
                                        <p className="text-sm text-destructive">{errors.employee_scorecard_id}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>Employee</Label>
                                    <Select
                                        value={data.employee_id}
                                        onValueChange={(v) => setData('employee_id', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select employee..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {employees.map((emp) => (
                                                <SelectItem key={emp.id} value={String(emp.id)}>
                                                    {employeeName(emp)} ({emp.staff_number})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.employee_id && (
                                        <p className="text-sm text-destructive">{errors.employee_id}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                />
                                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                />
                                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Objectives</Label>
                                <Textarea
                                    value={data.objectives}
                                    onChange={(e) => setData('objectives', e.target.value)}
                                    rows={3}
                                />
                                {errors.objectives && <p className="text-sm text-destructive">{errors.objectives}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Support Required</Label>
                                <Textarea
                                    value={data.support_required}
                                    onChange={(e) => setData('support_required', e.target.value)}
                                    rows={3}
                                />
                                {errors.support_required && (
                                    <p className="text-sm text-destructive">{errors.support_required}</p>
                                )}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <Label>Start Date</Label>
                                    <Input
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                    />
                                    {errors.start_date && (
                                        <p className="text-sm text-destructive">{errors.start_date}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>End Date</Label>
                                    <Input
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                    />
                                    {errors.end_date && (
                                        <p className="text-sm text-destructive">{errors.end_date}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(v) => setData('status', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statuses.map((s) => (
                                                <SelectItem key={s} value={s}>
                                                    {s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Outcome</Label>
                                <Textarea
                                    value={data.outcome}
                                    onChange={(e) => setData('outcome', e.target.value)}
                                    rows={2}
                                />
                                {errors.outcome && <p className="text-sm text-destructive">{errors.outcome}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <Link href={`/improvement-plans/${plan.id}`}>
                            <Button variant="outline" type="button">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            Update Plan
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
