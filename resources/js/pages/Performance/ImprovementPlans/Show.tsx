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
import {
    MetricCard,
    SectionHeading,
    formatLabel,
    formatPerformanceDate,
    formatPerformanceDateTime,
} from '@/pages/Performance/components/primitives';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    BriefcaseBusiness,
    CalendarClock,
    CalendarRange,
    ClipboardList,
    Eye,
    FileText,
    LifeBuoy,
    Pencil,
    Sparkles,
    Target,
    UserRound,
} from 'lucide-react';
import moment from 'moment';

type Plan = {
    id: number;
    title: string;
    description: string | null;
    objectives: string | null;
    support_required: string | null;
    start_date: string;
    end_date: string;
    status: string;
    outcome: string | null;
    created_at: string;
    updated_at: string;
    employee: {
        id: number;
        first_name: string;
        middle_name: string | null;
        surname: string;
        staff_number: string;
    } | null;
    scorecard: {
        id: number;
        overall_score: number | null;
        overall_rating: string | null;
        cycle: { id: number; title: string } | null;
        items: Array<{
            id: number;
            perspective: string;
            kpi_name: string;
            score: number | null;
            weight: number | null;
        }>;
    } | null;
    creator: { id: number; name: string } | null;
};

const perspectiveLabels: Record<string, string> = {
    financial: 'Financial',
    customer: 'Customer',
    internal_process: 'Internal Process',
    learning_and_growth: 'Learning & Growth',
};

function getStatusVariant(status: string): 'default' | 'secondary' | 'outline' {
    switch (status) {
        case 'completed':
        case 'on_track':
            return 'default';
        case 'active':
        case 'at_risk':
            return 'secondary';
        default:
            return 'outline';
    }
}

function employeeName(employee: Plan['employee']) {
    if (!employee) return 'Unassigned';

    return [employee.first_name, employee.middle_name, employee.surname]
        .filter(Boolean)
        .join(' ');
}

function getPlanWindow(startDate: string | null | undefined, endDate: string | null | undefined) {
    if (!startDate || !endDate) return 'Open-ended';

    const start = moment(startDate);
    const end = moment(endDate);

    if (!start.isValid() || !end.isValid()) return 'Open-ended';

    const days = end.diff(start, 'days') + 1;

    return days > 0 ? `${days} day${days === 1 ? '' : 's'}` : 'Invalid range';
}

export default function ImprovementPlanShow() {
    const { plan } = usePage<{ plan: Plan }>().props;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Performance', href: '/performance' },
                { title: 'Improvement Plans', href: '/improvement-plans' },
                { title: plan.title, href: '#' },
            ]}
        >
            <Head title={plan.title} />

            <div className="w-full space-y-6 p-4 md:p-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Link href="/improvement-plans">
                                        <Button variant="outline" size="icon">
                                            <ArrowLeft className="h-4 w-4" />
                                        </Button>
                                    </Link>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Sparkles className="h-4 w-4" />
                                        <span>Performance Improvement Plan</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h1 className="text-3xl font-semibold tracking-tight">
                                            {plan.title}
                                        </h1>
                                        <Badge variant={getStatusVariant(plan.status)}>
                                            {formatLabel(plan.status)}
                                        </Badge>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <CalendarRange className="h-4 w-4" />
                                            <span>
                                                {formatPerformanceDate(plan.start_date)} —{' '}
                                                {formatPerformanceDate(plan.end_date)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <CalendarClock className="h-4 w-4" />
                                            <span>
                                                Updated{' '}
                                                {formatPerformanceDateTime(plan.updated_at)}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="max-w-3xl text-sm text-muted-foreground">
                                        {plan.description ||
                                            'No description has been added to this improvement plan yet.'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                {plan.scorecard && (
                                    <Link href={`/employee-scorecards/${plan.scorecard.id}`}>
                                        <Button variant="outline" className="w-full sm:w-auto">
                                            <Eye className="mr-2 h-4 w-4" />
                                            View Scorecard
                                        </Button>
                                    </Link>
                                )}

                                <Link href={`/improvement-plans/${plan.id}/edit`}>
                                    <Button className="w-full sm:w-auto">
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit Plan
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <Separator className="my-6" />

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <MetricCard
                                icon={<UserRound className="h-4 w-4" />}
                                label="Employee"
                                value={employeeName(plan.employee)}
                                helper={plan.employee?.staff_number ?? 'No staff number'}
                            />
                            <MetricCard
                                icon={<Target className="h-4 w-4" />}
                                label="Status"
                                value={formatLabel(plan.status)}
                                helper="Current workflow stage"
                            />
                            <MetricCard
                                icon={<CalendarRange className="h-4 w-4" />}
                                label="Plan Window"
                                value={getPlanWindow(plan.start_date, plan.end_date)}
                                helper="Duration between start and end"
                            />
                            <MetricCard
                                icon={<BriefcaseBusiness className="h-4 w-4" />}
                                label="Linked Scorecard"
                                value={plan.scorecard ? `#${plan.scorecard.id}` : 'Not linked'}
                                helper={
                                    plan.scorecard?.cycle?.title ??
                                    plan.scorecard?.overall_rating ??
                                    'No linked scorecard'
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 xl:grid-cols-12">
                    <div className="space-y-6 xl:col-span-8">
                        <Card>
                            <CardHeader>
                                <SectionHeading
                                    icon={<FileText className="h-4 w-4" />}
                                    title="Plan Details"
                                    description="Review the narrative, objectives, support commitments, and outcome for this plan."
                                />
                            </CardHeader>

                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <Card>
                                    <CardContent className="p-5">
                                        <div className="mb-3 flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-sm font-medium">Description</p>
                                        </div>
                                        <p className="text-sm leading-6 text-muted-foreground whitespace-pre-line">
                                            {plan.description || 'No description provided.'}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-5">
                                        <div className="mb-3 flex items-center gap-2">
                                            <Target className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-sm font-medium">Objectives</p>
                                        </div>
                                        <p className="text-sm leading-6 text-muted-foreground whitespace-pre-line">
                                            {plan.objectives || 'No objectives recorded.'}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-5">
                                        <div className="mb-3 flex items-center gap-2">
                                            <LifeBuoy className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-sm font-medium">Support Required</p>
                                        </div>
                                        <p className="text-sm leading-6 text-muted-foreground whitespace-pre-line">
                                            {plan.support_required || 'No support requirements recorded.'}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-5">
                                        <div className="mb-3 flex items-center gap-2">
                                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-sm font-medium">Outcome</p>
                                        </div>
                                        <p className="text-sm leading-6 text-muted-foreground whitespace-pre-line">
                                            {plan.outcome || 'No final outcome has been recorded yet.'}
                                        </p>
                                    </CardContent>
                                </Card>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <BriefcaseBusiness className="h-4 w-4" />
                                            Linked Scorecard Breakdown
                                        </CardTitle>
                                        <CardDescription>
                                            Review the KPI items that informed this improvement plan.
                                        </CardDescription>
                                    </div>

                                    {plan.scorecard?.overall_rating && (
                                        <Badge variant="outline">
                                            {plan.scorecard.overall_rating}
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent>
                                {!plan.scorecard ? (
                                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-14 text-center">
                                        <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground" />
                                        <h3 className="text-lg font-semibold">
                                            No linked scorecard
                                        </h3>
                                        <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                            This plan is not currently connected to a finalized
                                            scorecard.
                                        </p>
                                    </div>
                                ) : plan.scorecard.items.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-14 text-center">
                                        <Target className="mb-4 h-12 w-12 text-muted-foreground" />
                                        <h3 className="text-lg font-semibold">No KPI items</h3>
                                        <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                            The linked scorecard has no KPI items available.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto rounded-lg border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>KPI</TableHead>
                                                    <TableHead>Perspective</TableHead>
                                                    <TableHead>Weight</TableHead>
                                                    <TableHead>Score</TableHead>
                                                </TableRow>
                                            </TableHeader>

                                            <TableBody>
                                                {plan.scorecard.items.map((item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell className="font-medium">
                                                            {item.kpi_name}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">
                                                                {perspectiveLabels[item.perspective] ??
                                                                    formatLabel(item.perspective)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.weight != null
                                                                ? `${Number(item.weight).toFixed(1)}%`
                                                                : '—'}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.score != null
                                                                ? `${Number(item.score).toFixed(1)}%`
                                                                : '—'}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
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
                                        A compact summary of this plan at a glance.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                            Employee
                                        </p>
                                        <p className="text-sm font-medium">
                                            {employeeName(plan.employee)}
                                        </p>
                                    </div>

                                    <Separator />

                                    <div className="space-y-1">
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                            Status
                                        </p>
                                        <Badge variant={getStatusVariant(plan.status)}>
                                            {formatLabel(plan.status)}
                                        </Badge>
                                    </div>

                                    <Separator />

                                    <div className="space-y-1">
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                            Timeline
                                        </p>
                                        <p className="text-sm font-medium">
                                            {formatPerformanceDate(plan.start_date)} —{' '}
                                            {formatPerformanceDate(plan.end_date)}
                                        </p>
                                    </div>

                                    <Separator />

                                    <div className="space-y-1">
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                            Created By
                                        </p>
                                        <p className="text-sm font-medium">
                                            {plan.creator?.name ?? 'System'}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatPerformanceDateTime(plan.created_at)}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CalendarClock className="h-4 w-4" />
                                        Workflow Notes
                                    </CardTitle>
                                    <CardDescription>
                                        Plans should be reviewed continuously until they are closed.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-3 text-sm text-muted-foreground">
                                    <p>Keep support actions clear and assigned to named owners.</p>
                                    <p>Review progress against the linked scorecard regularly.</p>
                                    <p>Document the outcome as soon as the plan reaches closure.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
