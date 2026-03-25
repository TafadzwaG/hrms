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
    Calendar,
    CalendarClock,
    CheckCircle2,
    ClipboardList,
    Eye,
    FileText,
    FolderKanban,
    Layers3,
    Pencil,
    Sparkles,
    Star,
    Target,
    UserRound,
    Users,
} from 'lucide-react';
import moment from 'moment';

type ScorecardSummary = {
    id: number;
    employee: { id: number; full_name: string; staff_number: string };
    status: string;
    overall_score: number | null;
    overall_rating: string | null;
};

type CycleDetail = {
    id: number;
    title: string;
    description: string | null;
    start_date: string;
    end_date: string;
    status: string;
    self_assessment_enabled: boolean;
    created_at: string;
    scorecards: ScorecardSummary[];
};

function formatStatus(status: string) {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatCycleDate(value: string | null | undefined, format = 'DD MMM YYYY') {
    if (!value) return '—';

    const parsed = moment(value);
    return parsed.isValid() ? parsed.format(format) : '—';
}

function getCycleStatusVariant(status: string): 'default' | 'secondary' | 'outline' {
    switch (status) {
        case 'active':
        case 'review_in_progress':
            return 'default';
        case 'draft':
        case 'moderation':
            return 'secondary';
        default:
            return 'outline';
    }
}

function getScorecardStatusVariant(status: string): 'default' | 'secondary' | 'outline' {
    switch (status) {
        case 'finalized':
        case 'manager_reviewed':
            return 'default';
        case 'self_assessment_pending':
        case 'manager_review_pending':
        case 'hr_moderation_pending':
            return 'secondary';
        default:
            return 'outline';
    }
}

function getRatingVariant(rating: string): 'default' | 'secondary' | 'outline' {
    switch (rating?.toLowerCase()) {
        case 'outstanding':
        case 'very good':
            return 'default';
        case 'good':
        case 'needs improvement':
            return 'secondary';
        default:
            return 'outline';
    }
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

export default function CycleShow() {
    const { cycle } = usePage<{ cycle: CycleDetail }>().props;

    const finalizedCount = cycle.scorecards.filter(
        (scorecard) => scorecard.status === 'finalized',
    ).length;

    const ratedCount = cycle.scorecards.filter(
        (scorecard) => scorecard.overall_rating !== null,
    ).length;

    const averageScore =
        cycle.scorecards.length > 0
            ? (
                  cycle.scorecards.reduce(
                      (sum, scorecard) => sum + Number(scorecard.overall_score ?? 0),
                      0,
                  ) / cycle.scorecards.length
              ).toFixed(1)
            : '0.0';

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Performance', href: '/performance' },
                { title: 'Cycles', href: '/performance-cycles' },
                { title: cycle.title, href: '#' },
            ]}
        >
            <Head title={cycle.title} />

            <div className="w-full space-y-6 p-4 md:p-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Link href="/performance-cycles">
                                        <Button variant="outline" size="icon">
                                            <ArrowLeft className="h-4 w-4" />
                                        </Button>
                                    </Link>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Sparkles className="h-4 w-4" />
                                        <span>Performance Cycle Overview</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h1 className="text-3xl font-semibold tracking-tight">
                                            {cycle.title}
                                        </h1>
                                        <Badge variant={getCycleStatusVariant(cycle.status)}>
                                            {formatStatus(cycle.status)}
                                        </Badge>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <CalendarClock className="h-4 w-4" />
                                            <span>
                                                {formatCycleDate(cycle.start_date)} —{' '}
                                                {formatCycleDate(cycle.end_date)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                Created{' '}
                                                {formatCycleDate(
                                                    cycle.created_at,
                                                    'DD MMM YYYY, HH:mm',
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="max-w-3xl text-sm text-muted-foreground">
                                        {cycle.description ||
                                            'No description has been provided for this performance cycle yet.'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Link href={`/performance-cycles/${cycle.id}/edit`}>
                                    <Button variant="outline" className="w-full sm:w-auto">
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit Cycle
                                    </Button>
                                </Link>

                                <Link href="/employee-scorecards/create">
                                    <Button className="w-full sm:w-auto">
                                        <ClipboardList className="mr-2 h-4 w-4" />
                                        Assign Scorecard
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <Separator className="my-6" />

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <MetricCard
                                icon={<Users className="h-4 w-4" />}
                                label="Scorecards"
                                value={cycle.scorecards.length}
                                helper="Employees assigned to this cycle"
                            />
                            <MetricCard
                                icon={<CheckCircle2 className="h-4 w-4" />}
                                label="Finalized"
                                value={finalizedCount}
                                helper="Completed scorecards"
                            />
                            <MetricCard
                                icon={<Star className="h-4 w-4" />}
                                label="Average Score"
                                value={averageScore}
                                helper="Across visible scorecards"
                            />
                            <MetricCard
                                icon={<Target className="h-4 w-4" />}
                                label="Rated"
                                value={ratedCount}
                                helper="Scorecards with ratings"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 xl:grid-cols-12">
                    <div className="space-y-6 xl:col-span-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Layers3 className="h-4 w-4" />
                                    Cycle Details
                                </CardTitle>
                                <CardDescription>
                                    Key information about the review window, participation mode, and
                                    cycle setup.
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
                                            {cycle.description ||
                                                'No description provided for this cycle.'}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-5">
                                        <div className="mb-3 flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-sm font-medium">
                                                Self Assessment
                                            </p>
                                        </div>
                                        <Badge
                                            variant={
                                                cycle.self_assessment_enabled
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                        >
                                            {cycle.self_assessment_enabled
                                                ? 'Enabled'
                                                : 'Disabled'}
                                        </Badge>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-5">
                                        <div className="mb-3 flex items-center gap-2">
                                            <CalendarClock className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-sm font-medium">Active Window</p>
                                        </div>
                                        <p className="text-sm font-medium">
                                            {formatCycleDate(cycle.start_date)}
                                        </p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            to {formatCycleDate(cycle.end_date)}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-5">
                                        <div className="mb-3 flex items-center gap-2">
                                            <FolderKanban className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-sm font-medium">Lifecycle Status</p>
                                        </div>
                                        <Badge variant={getCycleStatusVariant(cycle.status)}>
                                            {formatStatus(cycle.status)}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            Scorecards
                                        </CardTitle>
                                        <CardDescription>
                                            {cycle.scorecards.length} scorecard
                                            {cycle.scorecards.length !== 1 ? 's' : ''} linked to
                                            this cycle.
                                        </CardDescription>
                                    </div>

                                    <Badge variant="outline">
                                        Cycle #{cycle.id}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent>
                                {cycle.scorecards.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-14 text-center">
                                        <Users className="mb-4 h-12 w-12 text-muted-foreground" />
                                        <h3 className="text-lg font-semibold">No scorecards yet</h3>
                                        <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                            Assign employee scorecards to this cycle to start
                                            tracking reviews, ratings, and completion progress.
                                        </p>
                                        <div className="mt-6">
                                            <Link href="/employee-scorecards/create">
                                                <Button variant="outline">
                                                    <ClipboardList className="mr-2 h-4 w-4" />
                                                    Assign Scorecard
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto rounded-lg border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Employee</TableHead>
                                                    <TableHead>Staff Number</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Overall Score</TableHead>
                                                    <TableHead>Rating</TableHead>
                                                    <TableHead className="text-right">
                                                        Actions
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>

                                            <TableBody>
                                                {cycle.scorecards.map((sc) => (
                                                    <TableRow key={sc.id}>
                                                        <TableCell className="align-top">
                                                            <div className="flex items-center gap-2">
                                                                <UserRound className="h-4 w-4 text-muted-foreground" />
                                                                <span className="font-medium">
                                                                    {sc.employee.full_name}
                                                                </span>
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="align-top">
                                                            <span className="font-mono text-xs">
                                                                {sc.employee.staff_number}
                                                            </span>
                                                        </TableCell>

                                                        <TableCell className="align-top">
                                                            <Badge
                                                                variant={getScorecardStatusVariant(
                                                                    sc.status,
                                                                )}
                                                            >
                                                                {formatStatus(sc.status)}
                                                            </Badge>
                                                        </TableCell>

                                                        <TableCell className="align-top">
                                                            {sc.overall_score != null
                                                                ? Number(
                                                                      sc.overall_score,
                                                                  ).toFixed(1)
                                                                : '—'}
                                                        </TableCell>

                                                        <TableCell className="align-top">
                                                            {sc.overall_rating ? (
                                                                <Badge
                                                                    variant={getRatingVariant(
                                                                        sc.overall_rating,
                                                                    )}
                                                                >
                                                                    {sc.overall_rating}
                                                                </Badge>
                                                            ) : (
                                                                '—'
                                                            )}
                                                        </TableCell>

                                                        <TableCell className="text-right align-top">
                                                            <Link
                                                                href={`/employee-scorecards/${sc.id}`}
                                                            >
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    title="View Scorecard"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
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
                                        A compact summary of this cycle at a glance.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                            Title
                                        </p>
                                        <p className="text-sm font-medium">{cycle.title}</p>
                                    </div>

                                    <Separator />

                                    <div className="space-y-1">
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                            Duration
                                        </p>
                                        <p className="text-sm font-medium">
                                            {formatCycleDate(cycle.start_date)} —{' '}
                                            {formatCycleDate(cycle.end_date)}
                                        </p>
                                    </div>

                                    <Separator />

                                    <div className="space-y-1">
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                            Status
                                        </p>
                                        <Badge variant={getCycleStatusVariant(cycle.status)}>
                                            {formatStatus(cycle.status)}
                                        </Badge>
                                    </div>

                                    <Separator />

                                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                                        <Card>
                                            <CardContent className="p-4">
                                                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                    Scorecards
                                                </p>
                                                <p className="mt-1 text-lg font-semibold">
                                                    {cycle.scorecards.length}
                                                </p>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-4">
                                                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                    Self Assessment
                                                </p>
                                                <p className="mt-1 text-lg font-semibold">
                                                    {cycle.self_assessment_enabled
                                                        ? 'Enabled'
                                                        : 'Disabled'}
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
                                        Continue managing this cycle from here.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="flex flex-col gap-3">
                                    <Link
                                        href={`/performance-cycles/${cycle.id}/edit`}
                                        className="w-full"
                                    >
                                        <Button variant="outline" className="w-full">
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit Cycle
                                        </Button>
                                    </Link>

                                    <Link href="/employee-scorecards/create" className="w-full">
                                        <Button className="w-full">
                                            <ClipboardList className="mr-2 h-4 w-4" />
                                            Assign Scorecard
                                        </Button>
                                    </Link>

                                    <Link href="/performance-cycles" className="w-full">
                                        <Button variant="outline" className="w-full">
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Back to Cycles
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