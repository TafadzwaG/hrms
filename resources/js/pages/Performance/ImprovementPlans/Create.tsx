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
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import {
    FieldError,
    FieldLabel,
    MetricCard,
    SectionHeading,
    formatLabel,
    formatPerformanceDate,
} from '@/pages/Performance/components/primitives';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    BriefcaseBusiness,
    CalendarRange,
    ClipboardList,
    FileText,
    LifeBuoy,
    Save,
    Sparkles,
    Target,
    UserRound,
} from 'lucide-react';
import moment from 'moment';
import type { FormEvent } from 'react';
import { useMemo } from 'react';

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

function employeeName(employee: Employee | null | undefined) {
    if (!employee) return 'Not selected';

    return [employee.first_name, employee.middle_name, employee.surname]
        .filter(Boolean)
        .join(' ');
}

function getPlanWindow(startDate: string, endDate: string) {
    if (!startDate || !endDate) return 'Set dates to preview duration';

    const start = moment(startDate);
    const end = moment(endDate);

    if (!start.isValid() || !end.isValid()) return 'Set dates to preview duration';

    const days = end.diff(start, 'days') + 1;

    if (days <= 0) return 'End date should be after start date';

    return `${days} day${days === 1 ? '' : 's'} active`;
}

export default function ImprovementPlanCreate() {
    const { employees, scorecards, statuses } = usePage<{
        employees: Employee[];
        scorecards: EligibleScorecard[];
        statuses: string[];
    }>().props;

    const { data, setData, post, processing, errors } = useForm({
        employee_scorecard_id: '',
        employee_id: '',
        title: '',
        description: '',
        objectives: '',
        support_required: '',
        start_date: '',
        end_date: '',
        status: 'active',
        outcome: '',
    });

    const cleanStatuses = statuses.filter((status) => status.trim() !== '');

    const selectedEmployee = useMemo(
        () => employees.find((employee) => String(employee.id) === data.employee_id) ?? null,
        [data.employee_id, employees],
    );

    const selectedScorecard = useMemo(
        () =>
            scorecards.find((scorecard) => String(scorecard.id) === data.employee_scorecard_id) ??
            null,
        [data.employee_scorecard_id, scorecards],
    );

    const scorecardLabel = useMemo(() => {
        if (!selectedScorecard) return 'Not linked';

        return selectedScorecard.cycle?.title
            ? `${selectedScorecard.cycle.title} · ${selectedScorecard.overall_rating ?? 'No rating'}`
            : selectedScorecard.overall_rating ?? `Scorecard #${selectedScorecard.id}`;
    }, [selectedScorecard]);

    const handleScorecardChange = (scorecardId: string) => {
        setData('employee_scorecard_id', scorecardId);

        const scorecard = scorecards.find((row) => String(row.id) === scorecardId);

        if (scorecard) {
            setData('employee_id', String(scorecard.employee_id));
        }
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        post('/improvement-plans', { preserveScroll: true });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Performance', href: '/performance' },
                { title: 'Improvement Plans', href: '/improvement-plans' },
                { title: 'New Plan', href: '#' },
            ]}
        >
            <Head title="New Improvement Plan" />

            <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                            <div className="flex items-start gap-4">
                                <Link href="/improvement-plans">
                                    <Button variant="outline" size="icon">
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                </Link>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Sparkles className="h-4 w-4" />
                                        <span>Performance Management</span>
                                    </div>

                                    <div className="space-y-2">
                                        <h1 className="text-3xl font-semibold tracking-tight">
                                            New Improvement Plan
                                        </h1>
                                        <p className="max-w-2xl text-sm text-muted-foreground">
                                            Create a structured support plan using the same editorial
                                            layout as performance cycles, with a live summary and
                                            linked scorecard context.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[560px]">
                                <MetricCard
                                    icon={<UserRound className="h-4 w-4" />}
                                    label="Employee"
                                    value={
                                        selectedEmployee
                                            ? `${employeeName(selectedEmployee)} (${selectedEmployee.staff_number})`
                                            : 'Not selected'
                                    }
                                    helper="Employee assigned to this plan"
                                />
                                <MetricCard
                                    icon={<ClipboardList className="h-4 w-4" />}
                                    label="Scorecard"
                                    value={selectedScorecard ? `#${selectedScorecard.id}` : 'Not linked'}
                                    helper={scorecardLabel}
                                />
                                <MetricCard
                                    icon={<CalendarRange className="h-4 w-4" />}
                                    label="Plan Window"
                                    value={getPlanWindow(data.start_date, data.end_date)}
                                    helper="Duration updates as dates change"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <form onSubmit={handleSubmit} className="mt-6 grid gap-6 xl:grid-cols-12">
                    <div className="space-y-6 xl:col-span-8">
                        <Card>
                            <CardHeader>
                                <SectionHeading
                                    icon={<ClipboardList className="h-4 w-4" />}
                                    title="Plan Assignment"
                                    description="Link the plan to a finalized scorecard and confirm the employee who will follow it."
                                />
                            </CardHeader>

                            <CardContent className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <FieldLabel required>Linked Scorecard</FieldLabel>
                                    <Select
                                        value={data.employee_scorecard_id}
                                        onValueChange={handleScorecardChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select scorecard" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {scorecards.map((scorecard) => (
                                                <SelectItem
                                                    key={scorecard.id}
                                                    value={String(scorecard.id)}
                                                >
                                                    {scorecard.employee
                                                        ? employeeName(scorecard.employee)
                                                        : `Scorecard #${scorecard.id}`}
                                                    {scorecard.cycle
                                                        ? ` · ${scorecard.cycle.title}`
                                                        : ''}
                                                    {scorecard.overall_rating
                                                        ? ` · ${scorecard.overall_rating}`
                                                        : ''}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FieldError message={errors.employee_scorecard_id} />
                                </div>

                                <div>
                                    <FieldLabel required>Employee</FieldLabel>
                                    <Select
                                        value={data.employee_id}
                                        onValueChange={(value) => setData('employee_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select employee" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {employees.map((employee) => (
                                                <SelectItem
                                                    key={employee.id}
                                                    value={String(employee.id)}
                                                >
                                                    {employeeName(employee)} ({employee.staff_number})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FieldError message={errors.employee_id} />
                                </div>

                                <div className="md:col-span-2">
                                    <FieldLabel required>Plan Title</FieldLabel>
                                    <Input
                                        value={data.title}
                                        onChange={(event) =>
                                            setData('title', event.target.value)
                                        }
                                        placeholder="e.g. Sales Coaching Recovery Plan"
                                    />
                                    <FieldError message={errors.title} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <SectionHeading
                                    icon={<FileText className="h-4 w-4" />}
                                    title="Plan Narrative"
                                    description="Document the diagnosis, objectives, and the support framework for the employee."
                                />
                            </CardHeader>

                            <CardContent className="grid gap-6">
                                <div>
                                    <FieldLabel>Description</FieldLabel>
                                    <Textarea
                                        value={data.description}
                                        onChange={(event) =>
                                            setData('description', event.target.value)
                                        }
                                        rows={5}
                                        placeholder="Summarize why the plan is needed and the context behind it."
                                    />
                                    <FieldError message={errors.description} />
                                </div>

                                <div>
                                    <FieldLabel>Objectives</FieldLabel>
                                    <Textarea
                                        value={data.objectives}
                                        onChange={(event) =>
                                            setData('objectives', event.target.value)
                                        }
                                        rows={5}
                                        placeholder="List the measurable objectives the employee should achieve during this plan."
                                    />
                                    <FieldError message={errors.objectives} />
                                </div>

                                <div>
                                    <FieldLabel>Support Required</FieldLabel>
                                    <Textarea
                                        value={data.support_required}
                                        onChange={(event) =>
                                            setData('support_required', event.target.value)
                                        }
                                        rows={5}
                                        placeholder="Capture coaching, resources, or interventions required from HR and managers."
                                    />
                                    <FieldError message={errors.support_required} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <SectionHeading
                                    icon={<Target className="h-4 w-4" />}
                                    title="Timeline and Outcome"
                                    description="Set the plan window, track its status, and document the final outcome if it already exists."
                                />
                            </CardHeader>

                            <CardContent className="grid gap-6 lg:grid-cols-[1fr_1fr_220px]">
                                <div>
                                    <FieldLabel required>Start Date</FieldLabel>
                                    <Input
                                        type="date"
                                        value={data.start_date}
                                        onChange={(event) =>
                                            setData('start_date', event.target.value)
                                        }
                                    />
                                    <FieldError message={errors.start_date} />
                                </div>

                                <div>
                                    <FieldLabel required>End Date</FieldLabel>
                                    <Input
                                        type="date"
                                        value={data.end_date}
                                        onChange={(event) =>
                                            setData('end_date', event.target.value)
                                        }
                                    />
                                    <FieldError message={errors.end_date} />
                                </div>

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
                                            {cleanStatuses.map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {formatLabel(status)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FieldError message={errors.status} />
                                </div>

                                <div className="lg:col-span-3">
                                    <FieldLabel>Outcome</FieldLabel>
                                    <Textarea
                                        value={data.outcome}
                                        onChange={(event) =>
                                            setData('outcome', event.target.value)
                                        }
                                        rows={4}
                                        placeholder="Capture the final outcome once the plan closes."
                                    />
                                    <FieldError message={errors.outcome} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6 xl:col-span-4">
                        <div className="space-y-6 xl:sticky xl:top-6">
                            <Card>
                                <CardHeader>
                                    <SectionHeading
                                        icon={<BriefcaseBusiness className="h-4 w-4" />}
                                        title="Linked Scorecard"
                                        description="Quick context from the finalized scorecard that triggered this plan."
                                    />
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {selectedScorecard ? (
                                        <>
                                            <div className="space-y-1">
                                                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                    Scorecard
                                                </p>
                                                <p className="text-sm font-medium">
                                                    #{selectedScorecard.id}
                                                </p>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                    Cycle
                                                </p>
                                                <p className="text-sm font-medium">
                                                    {selectedScorecard.cycle?.title ?? 'Not linked'}
                                                </p>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                    Overall Rating
                                                </p>
                                                <p className="text-sm font-medium">
                                                    {selectedScorecard.overall_rating ?? 'Not rated'}
                                                </p>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                    Overall Score
                                                </p>
                                                <p className="text-sm font-medium">
                                                    {selectedScorecard.overall_score != null
                                                        ? `${Number(selectedScorecard.overall_score).toFixed(1)}%`
                                                        : 'Not scored'}
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="rounded-lg border border-dashed px-5 py-8 text-center">
                                            <ClipboardList className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">
                                                Choose a finalized scorecard to surface context here.
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="bg-muted/20">
                                <CardHeader>
                                    <CardTitle className="text-base">Live Summary</CardTitle>
                                    <CardDescription>
                                        Review the plan profile before saving it.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-xl font-semibold tracking-tight">
                                            {data.title || 'Untitled plan'}
                                        </p>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {data.description?.trim()
                                                ? data.description
                                                : 'A short plan summary will appear here once you add a description.'}
                                        </p>
                                    </div>

                                    <div className="grid gap-3">
                                        <Card>
                                            <CardContent className="p-4">
                                                <p className="text-xs text-muted-foreground">Employee</p>
                                                <p className="mt-1 text-sm font-medium">
                                                    {selectedEmployee
                                                        ? employeeName(selectedEmployee)
                                                        : 'Not selected'}
                                                </p>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-4">
                                                <p className="text-xs text-muted-foreground">Starts</p>
                                                <p className="mt-1 text-sm font-medium">
                                                    {formatPerformanceDate(data.start_date)}
                                                </p>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-4">
                                                <p className="text-xs text-muted-foreground">Ends</p>
                                                <p className="mt-1 text-sm font-medium">
                                                    {formatPerformanceDate(data.end_date)}
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
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <SectionHeading
                                        icon={<LifeBuoy className="h-4 w-4" />}
                                        title="Workflow Guidance"
                                        description="Use plans to formalize follow-up after a finalized low-performing scorecard."
                                    />
                                </CardHeader>

                                <CardContent className="space-y-3 text-sm text-muted-foreground">
                                    <p>Keep objectives measurable and time bound.</p>
                                    <p>Document concrete support commitments from managers or HR.</p>
                                    <p>Use the outcome field only when closing the plan.</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="flex flex-col gap-3 p-4">
                                    <Link href="/improvement-plans" className="w-full">
                                        <Button variant="outline" type="button" className="w-full">
                                            Cancel
                                        </Button>
                                    </Link>

                                    <Button type="submit" disabled={processing} className="w-full">
                                        <Save className="mr-2 h-4 w-4" />
                                        {processing ? 'Saving...' : 'Save Improvement Plan'}
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
