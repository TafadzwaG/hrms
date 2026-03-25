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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import {
    formatPerformanceDate,
    formatPerformanceDateTime,
} from '@/pages/Performance/components/primitives';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    CalendarClock,
    CalendarRange,
    CheckCircle2,
    ClipboardList,
    Eye,
    FileText,
    Gauge,
    Layers3,
    MessageSquareText,
    NotebookPen,
    Pencil,
    PieChart,
    Send,
    ShieldCheck,
    Sparkles,
    Star,
    Target,
    TimerReset,
    Upload,
    UserRound,
} from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import { useMemo, useState } from 'react';

type ScorecardItem = {
    id: number;
    perspective: string;
    kpi_name: string;
    description: string | null;
    weight: number;
    target_type: string;
    target_value: number | null;
    actual_value: number | null;
    self_score: number | null;
    manager_score: number | null;
    final_score: number | null;
    comments: string | null;
};

type Comment = {
    id: number;
    comment_type: string;
    content: string;
    created_at: string;
    user: { id: number; name: string } | null;
};

type Evidence = {
    id: number;
    title: string;
    file_path: string | null;
    description: string | null;
    created_at: string;
};

type ImprovementPlan = {
    id: number;
    title: string;
    description: string | null;
    status: string;
    start_date: string | null;
    end_date: string | null;
    created_at: string;
};

type ScorecardDetail = {
    id: number;
    status: string;
    overall_score: number | null;
    overall_rating: string | null;
    notes: string | null;
    finalized_at: string | null;
    created_at: string;
    updated_at: string;
    employee: { id: number; full_name: string; staff_number: string };
    cycle: { id: number; title: string; start_date: string; end_date: string };
    items: ScorecardItem[];
    comments: Comment[];
    evidence: Evidence[];
    improvement_plan: ImprovementPlan | null;
};

type PerspectiveBreakdown = {
    items_count: number;
    total_weight: number;
    average_score: number | null;
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

function formatDate(value: string | null | undefined) {
    return formatPerformanceDate(value);
}

function formatDateTime(value: string | null | undefined) {
    return formatPerformanceDateTime(value);
}

function getStatusVariant(status: string): 'default' | 'secondary' | 'outline' {
    switch (status) {
        case 'finalized':
        case 'manager_reviewed':
        case 'self_assessment_submitted':
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

function hasProgress(item: ScorecardItem) {
    return (
        item.self_score != null ||
        item.manager_score != null ||
        item.final_score != null ||
        item.actual_value != null
    );
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
    extra,
}: {
    icon: ReactNode;
    label: string;
    value: ReactNode;
    helper: string;
    extra?: ReactNode;
}) {
    return (
        <Card>
            <CardContent className="flex items-start gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-muted">
                    {icon}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {label}
                    </p>
                    <div className="mt-1 text-lg font-semibold tracking-tight">{value}</div>
                    <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
                    {extra && <div className="mt-3">{extra}</div>}
                </div>
            </CardContent>
        </Card>
    );
}

function DetailStat({
    label,
    value,
}: {
    label: string;
    value: ReactNode;
}) {
    return (
        <div className="space-y-1 rounded-lg border p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
            <div className="text-sm font-medium">{value}</div>
        </div>
    );
}

export default function ScorecardShow() {
    const {
        scorecard,
        perspectiveBreakdown,
        perspectives,
        commentTypes,
    } = usePage<{
        scorecard: ScorecardDetail;
        perspectiveBreakdown: Record<string, PerspectiveBreakdown>;
        ratingBands: string[];
        statuses: string[];
        perspectives: string[];
        targetTypes: string[];
        commentTypes: string[];
    }>().props;

    const perspectiveOptions = perspectives.filter((p) => p.trim() !== '');
    const commentTypeOptions =
        commentTypes.filter((ct) => ct.trim() !== '')?.length > 0
            ? commentTypes.filter((ct) => ct.trim() !== '')
            : ['general'];

    const [activePerspective, setActivePerspective] = useState(
        perspectiveOptions[0] ?? 'financial',
    );

    const commentForm = useForm({
        comment_type: commentTypeOptions[0],
        content: '',
    });

    const evidenceForm = useForm({
        title: '',
        description: '',
        file: null as File | null,
    });

    const completedItems = useMemo(
        () => scorecard.items.filter((item) => hasProgress(item)).length,
        [scorecard.items],
    );

    const completionPercent = scorecard.items.length
        ? (completedItems / scorecard.items.length) * 100
        : 0;

    const activePerspectiveItems = scorecard.items.filter(
        (item) => item.perspective === activePerspective,
    );

    const activeBreakdown = perspectiveBreakdown[activePerspective];

    const handleCommentSubmit = (e: FormEvent) => {
        e.preventDefault();
        commentForm.post(`/employee-scorecards/${scorecard.id}/comments`, {
            preserveScroll: true,
            onSuccess: () => commentForm.reset('content'),
        });
    };

    const handleEvidenceSubmit = (e: FormEvent) => {
        e.preventDefault();
        evidenceForm.post(`/employee-scorecards/${scorecard.id}/evidence`, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => evidenceForm.reset(),
        });
    };

    const handleWorkflowAction = (action: string) => {
        router.post(
            `/employee-scorecards/${scorecard.id}/${action}`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Performance', href: '/performance' },
                { title: 'Scorecards', href: '/employee-scorecards' },
                { title: scorecard.employee.full_name, href: '#' },
            ]}
        >
            <Head title={`Scorecard - ${scorecard.employee.full_name}`} />

            <div className="w-full space-y-6 p-4 md:p-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Link href="/employee-scorecards">
                                        <Button variant="outline" size="icon">
                                            <ArrowLeft className="h-4 w-4" />
                                        </Button>
                                    </Link>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Sparkles className="h-4 w-4" />
                                        <span>Employee Scorecard Workspace</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h1 className="text-3xl font-semibold tracking-tight">
                                            {scorecard.employee.full_name}
                                        </h1>
                                        <Badge variant={getStatusVariant(scorecard.status)}>
                                            {formatLabel(scorecard.status)}
                                        </Badge>
                                        {scorecard.overall_rating && (
                                            <Badge variant={getRatingVariant(scorecard.overall_rating)}>
                                                {scorecard.overall_rating}
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <UserRound className="h-4 w-4" />
                                            <span>{scorecard.employee.staff_number}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CalendarRange className="h-4 w-4" />
                                            <span>{scorecard.cycle.title}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CalendarClock className="h-4 w-4" />
                                            <span>
                                                {formatDate(scorecard.cycle.start_date)} â€”{' '}
                                                {formatDate(scorecard.cycle.end_date)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                {scorecard.status === 'self_assessment_pending' && (
                                    <Button
                                        onClick={() =>
                                            handleWorkflowAction('submit-self-assessment')
                                        }
                                    >
                                        <Send className="mr-2 h-4 w-4" />
                                        Submit Self-Assessment
                                    </Button>
                                )}

                                {scorecard.status === 'manager_review_pending' && (
                                    <Button
                                        onClick={() =>
                                            handleWorkflowAction('submit-manager-review')
                                        }
                                    >
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Submit Manager Review
                                    </Button>
                                )}

                                {scorecard.status === 'hr_moderation_pending' && (
                                    <Button onClick={() => handleWorkflowAction('finalize')}>
                                        <ShieldCheck className="mr-2 h-4 w-4" />
                                        Finalize Scorecard
                                    </Button>
                                )}

                                <Link href={`/employee-scorecards/${scorecard.id}/edit`}>
                                    <Button variant="outline">
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit Scorecard
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <Separator className="my-6" />

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <MetricCard
                                icon={<Gauge className="h-4 w-4" />}
                                label="Overall Score"
                                value={
                                    scorecard.overall_score != null
                                        ? Number(scorecard.overall_score).toFixed(1)
                                        : 'â€”'
                                }
                                helper="Final rolled-up score"
                            />

                            <MetricCard
                                icon={<PieChart className="h-4 w-4" />}
                                label="Completion"
                                value={`${completedItems}/${scorecard.items.length}`}
                                helper="Items with activity or scoring"
                                extra={<MiniDonut value={completionPercent} size={62} />}
                            />

                            <MetricCard
                                icon={<ClipboardList className="h-4 w-4" />}
                                label="Evidence"
                                value={scorecard.evidence.length}
                                helper="Attached supporting records"
                            />

                            <MetricCard
                                icon={<MessageSquareText className="h-4 w-4" />}
                                label="Comments"
                                value={scorecard.comments.length}
                                helper="Discussion and review notes"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="perspectives">Perspectives</TabsTrigger>
                        <TabsTrigger value="evidence">Evidence</TabsTrigger>
                        <TabsTrigger value="comments">Comments</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid gap-6 xl:grid-cols-12">
                            <div className="space-y-6 xl:col-span-8">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Layers3 className="h-4 w-4" />
                                            Perspective Balance
                                        </CardTitle>
                                        <CardDescription>
                                            A quick visual read of KPI weight distribution and progress
                                            by balanced scorecard perspective.
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="grid gap-4 md:grid-cols-2">
                                        {perspectiveOptions.map((perspective) => {
                                            const breakdown = perspectiveBreakdown[perspective];
                                            const items = scorecard.items.filter(
                                                (item) => item.perspective === perspective,
                                            );
                                            const completed = items.filter((item) =>
                                                hasProgress(item),
                                            ).length;
                                            const progressPercent = items.length
                                                ? (completed / items.length) * 100
                                                : 0;

                                            return (
                                                <Card key={perspective}>
                                                    <CardContent className="p-5">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div>
                                                                <p className="text-sm font-semibold">
                                                                    {perspectiveLabels[perspective] ??
                                                                        formatLabel(perspective)}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {breakdown?.items_count ?? 0} KPI
                                                                    item
                                                                    {(breakdown?.items_count ?? 0) === 1
                                                                        ? ''
                                                                        : 's'}
                                                                </p>
                                                            </div>

                                                            <Badge variant="outline">
                                                                {breakdown?.total_weight ?? 0}% weight
                                                            </Badge>
                                                        </div>

                                                        <div className="mt-5 grid gap-5 sm:grid-cols-2">
                                                            <div className="flex items-center gap-4">
                                                                <MiniDonut
                                                                    value={
                                                                        breakdown?.total_weight ?? 0
                                                                    }
                                                                    size={66}
                                                                />
                                                                <div>
                                                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                                        Weight
                                                                    </p>
                                                                    <p className="text-sm font-medium">
                                                                        {breakdown?.total_weight ?? 0}%
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-4">
                                                                <MiniDonut
                                                                    value={progressPercent}
                                                                    size={66}
                                                                />
                                                                <div>
                                                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                                        Progress
                                                                    </p>
                                                                    <p className="text-sm font-medium">
                                                                        {completed}/{items.length || 0}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <Separator className="my-4" />

                                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                                            <div>
                                                                <p className="text-muted-foreground">
                                                                    Avg Score
                                                                </p>
                                                                <p className="font-medium">
                                                                    {breakdown?.average_score != null
                                                                        ? Number(
                                                                              breakdown.average_score,
                                                                          ).toFixed(1)
                                                                        : 'â€”'}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-muted-foreground">
                                                                    Perspective
                                                                </p>
                                                                <p className="font-medium">
                                                                    {perspectiveLabels[perspective] ??
                                                                        formatLabel(perspective)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </CardContent>
                                </Card>

                                {scorecard.notes && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <NotebookPen className="h-4 w-4" />
                                                Notes
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                                                {scorecard.notes}
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}

                                {scorecard.improvement_plan && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Target className="h-4 w-4" />
                                                Performance Improvement Plan
                                            </CardTitle>
                                            <CardDescription>
                                                Structured follow-up actions tied to this review.
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent className="grid gap-4 md:grid-cols-2">
                                            <DetailStat
                                                label="Plan Title"
                                                value={scorecard.improvement_plan.title}
                                            />
                                            <DetailStat
                                                label="Status"
                                                value={formatLabel(
                                                    scorecard.improvement_plan.status,
                                                )}
                                            />

                                            <div className="md:col-span-2">
                                                <DetailStat
                                                    label="Description"
                                                    value={
                                                        scorecard.improvement_plan.description ||
                                                        'No description provided.'
                                                    }
                                                />
                                            </div>

                                            <DetailStat
                                                label="Start Date"
                                                value={formatDate(
                                                    scorecard.improvement_plan.start_date,
                                                )}
                                            />
                                            <DetailStat
                                                label="End Date"
                                                value={formatDate(
                                                    scorecard.improvement_plan.end_date,
                                                )}
                                            />
                                        </CardContent>
                                    </Card>
                                )}
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
                                                Compact view of this scorecard at a glance.
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent className="space-y-4">
                                            <div className="space-y-1">
                                                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                    Employee
                                                </p>
                                                <p className="text-sm font-medium">
                                                    {scorecard.employee.full_name}
                                                </p>
                                                <p className="font-mono text-xs text-muted-foreground">
                                                    {scorecard.employee.staff_number}
                                                </p>
                                            </div>

                                            <Separator />

                                            <div className="space-y-1">
                                                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                    Cycle
                                                </p>
                                                <p className="text-sm font-medium">
                                                    {scorecard.cycle.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDate(scorecard.cycle.start_date)} â€”{' '}
                                                    {formatDate(scorecard.cycle.end_date)}
                                                </p>
                                            </div>

                                            <Separator />

                                            <div className="grid gap-3">
                                                <DetailStat
                                                    label="Status"
                                                    value={
                                                        <Badge
                                                            variant={getStatusVariant(
                                                                scorecard.status,
                                                            )}
                                                        >
                                                            {formatLabel(scorecard.status)}
                                                        </Badge>
                                                    }
                                                />

                                                <DetailStat
                                                    label="Overall Rating"
                                                    value={
                                                        scorecard.overall_rating ? (
                                                            <Badge
                                                                variant={getRatingVariant(
                                                                    scorecard.overall_rating,
                                                                )}
                                                            >
                                                                {scorecard.overall_rating}
                                                            </Badge>
                                                        ) : (
                                                            'Not yet rated'
                                                        )
                                                    }
                                                />

                                                <DetailStat
                                                    label="Created"
                                                    value={formatDateTime(scorecard.created_at)}
                                                />

                                                <DetailStat
                                                    label="Last Updated"
                                                    value={formatDateTime(scorecard.updated_at)}
                                                />

                                                <DetailStat
                                                    label="Finalized"
                                                    value={formatDateTime(scorecard.finalized_at)}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <TimerReset className="h-4 w-4" />
                                                Quick Actions
                                            </CardTitle>
                                            <CardDescription>
                                                Continue the review workflow from here.
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent className="flex flex-col gap-3">
                                            {scorecard.status === 'self_assessment_pending' && (
                                                <Button
                                                    onClick={() =>
                                                        handleWorkflowAction(
                                                            'submit-self-assessment',
                                                        )
                                                    }
                                                >
                                                    <Send className="mr-2 h-4 w-4" />
                                                    Submit Self-Assessment
                                                </Button>
                                            )}

                                            {scorecard.status === 'manager_review_pending' && (
                                                <Button
                                                    onClick={() =>
                                                        handleWorkflowAction(
                                                            'submit-manager-review',
                                                        )
                                                    }
                                                >
                                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                                    Submit Manager Review
                                                </Button>
                                            )}

                                            {scorecard.status === 'hr_moderation_pending' && (
                                                <Button
                                                    onClick={() =>
                                                        handleWorkflowAction('finalize')
                                                    }
                                                >
                                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                                    Finalize Scorecard
                                                </Button>
                                            )}

                                            <Link
                                                href={`/employee-scorecards/${scorecard.id}/edit`}
                                                className="w-full"
                                            >
                                                <Button variant="outline" className="w-full">
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit Scorecard
                                                </Button>
                                            </Link>

                                            <Link
                                                href="/employee-scorecards"
                                                className="w-full"
                                            >
                                                <Button variant="outline" className="w-full">
                                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                                    Back to Scorecards
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="perspectives" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PieChart className="h-4 w-4" />
                                    KPI Items by Perspective
                                </CardTitle>
                                <CardDescription>
                                    Switch between perspectives to review KPI cards, targets, scores,
                                    and supporting notes.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <Tabs value={activePerspective} onValueChange={setActivePerspective}>
                                    <TabsList className="grid w-full grid-cols-2 xl:grid-cols-4">
                                        {perspectiveOptions.map((perspective) => (
                                            <TabsTrigger key={perspective} value={perspective}>
                                                {perspectiveLabels[perspective] ??
                                                    formatLabel(perspective)}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>

                                    <TabsContent
                                        value={activePerspective}
                                        className="mt-6 space-y-6"
                                    >
                                        <div className="grid gap-4 md:grid-cols-3">
                                            <Card>
                                                <CardContent className="flex items-center gap-4 p-5">
                                                    <MiniDonut
                                                        value={activeBreakdown?.total_weight ?? 0}
                                                    />
                                                    <div>
                                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                            Weight
                                                        </p>
                                                        <p className="text-lg font-semibold">
                                                            {activeBreakdown?.total_weight ?? 0}%
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card>
                                                <CardContent className="flex items-center gap-4 p-5">
                                                    <MiniDonut
                                                        value={
                                                            activePerspectiveItems.length
                                                                ? (activePerspectiveItems.filter(
                                                                      (item) =>
                                                                          hasProgress(item),
                                                                  ).length /
                                                                      activePerspectiveItems.length) *
                                                                  100
                                                                : 0
                                                        }
                                                    />
                                                    <div>
                                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                            Progress
                                                        </p>
                                                        <p className="text-lg font-semibold">
                                                            {
                                                                activePerspectiveItems.filter((item) =>
                                                                    hasProgress(item),
                                                                ).length
                                                            }
                                                            /{activePerspectiveItems.length}
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card>
                                                <CardContent className="p-5">
                                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                        Average Score
                                                    </p>
                                                    <p className="mt-1 text-lg font-semibold">
                                                        {activeBreakdown?.average_score != null
                                                            ? Number(
                                                                  activeBreakdown.average_score,
                                                              ).toFixed(1)
                                                            : 'â€”'}
                                                    </p>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        Across this perspective
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {activePerspectiveItems.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-14 text-center">
                                                <Target className="mb-4 h-12 w-12 text-muted-foreground" />
                                                <h3 className="text-lg font-semibold">No KPIs</h3>
                                                <p className="mt-2 text-sm text-muted-foreground">
                                                    No KPI items have been added for this perspective.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="grid gap-4 xl:grid-cols-2">
                                                {activePerspectiveItems.map((item) => (
                                                    <Card key={item.id}>
                                                        <CardHeader className="pb-4">
                                                            <div className="flex items-start justify-between gap-4">
                                                                <div className="space-y-1">
                                                                    <CardTitle className="text-base">
                                                                        {item.kpi_name}
                                                                    </CardTitle>
                                                                    <CardDescription>
                                                                        {item.description ||
                                                                            'No KPI description provided.'}
                                                                    </CardDescription>
                                                                </div>

                                                                <MiniDonut
                                                                    value={item.weight}
                                                                    size={60}
                                                                />
                                                            </div>
                                                        </CardHeader>

                                                        <CardContent className="space-y-4">
                                                            <div className="flex flex-wrap gap-2">
                                                                <Badge variant="outline">
                                                                    {formatLabel(item.target_type)}
                                                                </Badge>
                                                                <Badge variant="secondary">
                                                                    {item.weight}% weight
                                                                </Badge>
                                                            </div>

                                                            <div className="grid gap-3 sm:grid-cols-2">
                                                                <DetailStat
                                                                    label="Target"
                                                                    value={
                                                                        item.target_value != null
                                                                            ? item.target_value
                                                                            : 'â€”'
                                                                    }
                                                                />
                                                                <DetailStat
                                                                    label="Actual"
                                                                    value={
                                                                        item.actual_value != null
                                                                            ? item.actual_value
                                                                            : 'â€”'
                                                                    }
                                                                />
                                                                <DetailStat
                                                                    label="Self Score"
                                                                    value={
                                                                        item.self_score != null
                                                                            ? Number(
                                                                                  item.self_score,
                                                                              ).toFixed(1)
                                                                            : 'â€”'
                                                                    }
                                                                />
                                                                <DetailStat
                                                                    label="Manager Score"
                                                                    value={
                                                                        item.manager_score != null
                                                                            ? Number(
                                                                                  item.manager_score,
                                                                              ).toFixed(1)
                                                                            : 'â€”'
                                                                    }
                                                                />
                                                                <div className="sm:col-span-2">
                                                                    <DetailStat
                                                                        label="Final Score"
                                                                        value={
                                                                            item.final_score != null
                                                                                ? Number(
                                                                                      item.final_score,
                                                                                  ).toFixed(1)
                                                                                : 'â€”'
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>

                                                            {item.comments && (
                                                                <>
                                                                    <Separator />
                                                                    <div className="space-y-1">
                                                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                                            Reviewer Notes
                                                                        </p>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            {item.comments}
                                                                        </p>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="evidence" className="space-y-6">
                        <div className="grid gap-6 xl:grid-cols-12">
                            <div className="xl:col-span-5">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Upload className="h-4 w-4" />
                                            Upload Evidence
                                        </CardTitle>
                                        <CardDescription>
                                            Attach documents or supporting files for this scorecard.
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent>
                                        <form onSubmit={handleEvidenceSubmit} className="space-y-4">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium">
                                                    Title
                                                    <span className="ml-1 text-destructive">*</span>
                                                </label>
                                                <Input
                                                    value={evidenceForm.data.title}
                                                    onChange={(e) =>
                                                        evidenceForm.setData(
                                                            'title',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Evidence title"
                                                />
                                                {evidenceForm.errors.title && (
                                                    <p className="mt-1.5 text-sm font-medium text-destructive">
                                                        {evidenceForm.errors.title}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium">
                                                    File
                                                </label>
                                                <Input
                                                    type="file"
                                                    onChange={(e) =>
                                                        evidenceForm.setData(
                                                            'file',
                                                            e.target.files?.[0] ?? null,
                                                        )
                                                    }
                                                />
                                                {evidenceForm.errors.file && (
                                                    <p className="mt-1.5 text-sm font-medium text-destructive">
                                                        {evidenceForm.errors.file}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium">
                                                    Description
                                                </label>
                                                <Textarea
                                                    value={evidenceForm.data.description}
                                                    onChange={(e) =>
                                                        evidenceForm.setData(
                                                            'description',
                                                            e.target.value,
                                                        )
                                                    }
                                                    rows={4}
                                                    placeholder="Brief description of this evidence..."
                                                />
                                                {evidenceForm.errors.description && (
                                                    <p className="mt-1.5 text-sm font-medium text-destructive">
                                                        {evidenceForm.errors.description}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex justify-end">
                                                <Button
                                                    type="submit"
                                                    disabled={evidenceForm.processing}
                                                >
                                                    <Upload className="mr-2 h-4 w-4" />
                                                    {evidenceForm.processing
                                                        ? 'Uploading...'
                                                        : 'Upload Evidence'}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="xl:col-span-7">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            Evidence Library
                                        </CardTitle>
                                        <CardDescription>
                                            {scorecard.evidence.length} document
                                            {scorecard.evidence.length === 1 ? '' : 's'} attached
                                            to this scorecard.
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent>
                                        {scorecard.evidence.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-14 text-center">
                                                <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                                                <h3 className="text-lg font-semibold">
                                                    No evidence uploaded
                                                </h3>
                                                <p className="mt-2 text-sm text-muted-foreground">
                                                    Upload supporting documents using the form on the
                                                    left.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {scorecard.evidence.map((evidence) => (
                                                    <Card key={evidence.id}>
                                                        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                                                            <div className="min-w-0 space-y-1">
                                                                <p className="font-medium">
                                                                    {evidence.title}
                                                                </p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {evidence.description || 'No description provided.'}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Added {formatDateTime(evidence.created_at)}
                                                                </p>
                                                            </div>

                                                            {evidence.file_path && (
                                                                <a
                                                                    href={evidence.file_path}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <Button variant="outline">
                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                        View File
                                                                    </Button>
                                                                </a>
                                                            )}
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="comments" className="space-y-6">
                        <div className="grid gap-6 xl:grid-cols-12">
                            <div className="xl:col-span-5">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MessageSquareText className="h-4 w-4" />
                                            Add Comment
                                        </CardTitle>
                                        <CardDescription>
                                            Leave structured feedback or a workflow note.
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent>
                                        <form onSubmit={handleCommentSubmit} className="space-y-4">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium">
                                                    Comment Type
                                                </label>
                                                <Select
                                                    value={commentForm.data.comment_type}
                                                    onValueChange={(value) =>
                                                        commentForm.setData(
                                                            'comment_type',
                                                            value,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {commentTypeOptions.map((type) => (
                                                            <SelectItem key={type} value={type}>
                                                                {formatLabel(type)}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {commentForm.errors.comment_type && (
                                                    <p className="mt-1.5 text-sm font-medium text-destructive">
                                                        {commentForm.errors.comment_type}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium">
                                                    Comment
                                                    <span className="ml-1 text-destructive">*</span>
                                                </label>
                                                <Textarea
                                                    value={commentForm.data.content}
                                                    onChange={(e) =>
                                                        commentForm.setData(
                                                            'content',
                                                            e.target.value,
                                                        )
                                                    }
                                                    rows={5}
                                                    placeholder="Write your comment..."
                                                />
                                                {commentForm.errors.content && (
                                                    <p className="mt-1.5 text-sm font-medium text-destructive">
                                                        {commentForm.errors.content}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex justify-end">
                                                <Button
                                                    type="submit"
                                                    disabled={commentForm.processing}
                                                >
                                                    <MessageSquareText className="mr-2 h-4 w-4" />
                                                    {commentForm.processing
                                                        ? 'Posting...'
                                                        : 'Post Comment'}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="xl:col-span-7">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <NotebookPen className="h-4 w-4" />
                                            Comment Timeline
                                        </CardTitle>
                                        <CardDescription>
                                            {scorecard.comments.length} comment
                                            {scorecard.comments.length === 1 ? '' : 's'} logged on
                                            this scorecard.
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent>
                                        {scorecard.comments.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-14 text-center">
                                                <MessageSquareText className="mb-4 h-12 w-12 text-muted-foreground" />
                                                <h3 className="text-lg font-semibold">
                                                    No comments yet
                                                </h3>
                                                <p className="mt-2 text-sm text-muted-foreground">
                                                    Use the form on the left to add the first comment.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {scorecard.comments.map((comment) => (
                                                    <Card key={comment.id}>
                                                        <CardContent className="p-5">
                                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                                <div className="space-y-2">
                                                                    <div className="flex flex-wrap items-center gap-2">
                                                                        <span className="text-sm font-semibold">
                                                                            {comment.user?.name ??
                                                                                'System'}
                                                                        </span>
                                                                        <Badge variant="outline">
                                                                            {formatLabel(
                                                                                comment.comment_type,
                                                                            )}
                                                                        </Badge>
                                                                    </div>

                                                                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                                                                        {comment.content}
                                                                    </p>
                                                                </div>

                                                                <p className="text-xs text-muted-foreground">
                                                                    {formatDateTime(
                                                                        comment.created_at,
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}