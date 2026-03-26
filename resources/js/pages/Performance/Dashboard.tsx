import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { RoleScopeBar } from '@/components/role-scope-bar';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import type { PageRoleScope } from '@/types/auth';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    BarChart3,
    Calendar,
    ClipboardList,
    Clock,
    Layers,
    Target,
    TrendingUp,
    Users,
} from 'lucide-react';
import type { ReactNode } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Metrics = {
    total_cycles: number;
    active_cycle: {
        id: number;
        title: string;
        status: string;
        start_date: string;
        end_date: string;
    } | null;
    total_scorecards: number;
    pending_self_assessments: number;
    pending_manager_reviews: number;
    finalized_scorecards: number;
    average_score: number;
    active_improvement_plans: number;
};

type ScoreDistribution = Record<string, number>;

type PerspectiveAverages = {
    financial: number;
    customer: number;
    internal_process: number;
    learning_growth: number;
};

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const SCORE_FILLS: Record<string, string> = {
    Outstanding: 'hsl(142, 76%, 36%)',
    'Very Good': 'hsl(217, 91%, 60%)',
    Good: 'hsl(172, 66%, 50%)',
    'Needs Improvement': 'hsl(38, 92%, 50%)',
    Unsatisfactory: 'hsl(0, 72%, 51%)',
};

const PERSPECTIVE_FILLS: Record<string, string> = {
    financial: 'hsl(142, 76%, 36%)',
    customer: 'hsl(217, 91%, 60%)',
    internal_process: 'hsl(38, 92%, 50%)',
    learning_growth: 'hsl(280, 67%, 52%)',
};

const PERSPECTIVE_LABELS: Record<string, string> = {
    financial: 'Financial',
    customer: 'Customer',
    internal_process: 'Internal Process',
    learning_growth: 'Learning & Growth',
};

const PERSPECTIVE_ICONS: Record<string, ReactNode> = {
    financial: <TrendingUp className="h-3.5 w-3.5" />,
    customer: <Users className="h-3.5 w-3.5" />,
    internal_process: <Layers className="h-3.5 w-3.5" />,
    learning_growth: <Target className="h-3.5 w-3.5" />,
};

/** Muted gray that is legible in both light and dark modes */
const GRID_COLOR = '#94a3b8';
const TICK_COLOR = '#94a3b8';
const CURSOR_COLOR = 'rgba(148, 163, 184, 0.15)';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatStatus(status: string) {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ------------------------------------------------------------------ */
/*  Reusable KPI Card                                                  */
/* ------------------------------------------------------------------ */

function KpiCard({
    icon,
    label,
    value,
    sub,
}: {
    icon: ReactNode;
    label: string;
    value: number | string;
    sub: string;
}) {
    return (
        <Card>
            <CardContent className="flex items-center gap-4 py-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    {icon}
                </span>
                <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {label}
                    </p>
                    <p className="text-2xl font-semibold text-foreground">
                        {String(value)}
                    </p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
            </CardContent>
        </Card>
    );
}

/* ------------------------------------------------------------------ */
/*  Custom Tooltip                                                     */
/* ------------------------------------------------------------------ */

function ChartTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-md border border-border bg-popover px-3 py-2 shadow-sm">
            <p className="text-xs font-medium text-popover-foreground">{label}</p>
            <p className="text-sm font-semibold text-popover-foreground">
                {payload[0].value}
            </p>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function PerformanceDashboard() {
    const { metrics, scoreDistribution, perspectiveAverages, scope } = usePage<{
        metrics: Metrics;
        scoreDistribution: ScoreDistribution;
        perspectiveAverages: PerspectiveAverages;
        scope?: PageRoleScope;
    }>().props;

    const scoreData = Object.entries(scoreDistribution).map(
        ([name, count]) => ({ name, count }),
    );

    const perspectiveData = Object.entries(perspectiveAverages).map(
        ([key, value]) => ({
            name: PERSPECTIVE_LABELS[key] ?? formatStatus(key),
            value: Number(value),
            key,
        }),
    );

    const totalPending =
        metrics.pending_self_assessments + metrics.pending_manager_reviews;

    return (
        <AppLayout
            breadcrumbs={[{ title: 'Performance', href: '/performance' }]}
        >
            <Head title="Performance Management" />

            <div className="w-full space-y-6 p-6">
                {/* -- Header ---------------------------------------- */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Performance Management
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Balanced Scorecard performance overview
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/performance-cycles">
                            <Button variant="outline">
                                <Calendar className="mr-2 h-4 w-4" />
                                Cycles
                            </Button>
                        </Link>
                        <Link href="/employee-scorecards">
                            <Button variant="outline">
                                <ClipboardList className="mr-2 h-4 w-4" />
                                Scorecards
                            </Button>
                        </Link>
                        <Link href="/kpi-library">
                            <Button variant="outline">
                                <BarChart3 className="mr-2 h-4 w-4" />
                                KPI Library
                            </Button>
                        </Link>
                    </div>
                </div>

                <RoleScopeBar
                    scope={scope}
                    path="/performance"
                />

                {/* -- KPI Cards ------------------------------------- */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <KpiCard
                        icon={<Users size={20} />}
                        label="Total Scorecards"
                        value={metrics.total_scorecards}
                        sub={`${metrics.finalized_scorecards} finalized`}
                    />
                    <KpiCard
                        icon={<Clock size={20} />}
                        label="Pending Reviews"
                        value={totalPending}
                        sub={`${metrics.pending_self_assessments} self · ${metrics.pending_manager_reviews} manager`}
                    />
                    <KpiCard
                        icon={<TrendingUp size={20} />}
                        label="Average Score"
                        value={
                            metrics.average_score > 0
                                ? Number(metrics.average_score).toFixed(1)
                                : '—'
                        }
                        sub="Out of 5.0"
                    />
                    <KpiCard
                        icon={<AlertTriangle size={20} />}
                        label="Improvement Plans"
                        value={metrics.active_improvement_plans}
                        sub="Active PIPs"
                    />
                </div>

                {/* -- Active Cycle Banner --------------------------- */}
                <Card>
                    <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                <Target size={20} />
                            </span>
                            {metrics.active_cycle ? (
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                        Active Cycle
                                    </p>
                                    <p className="text-lg font-semibold text-foreground">
                                        {metrics.active_cycle.title}
                                    </p>
                                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Calendar className="h-3 w-3" />
                                        {metrics.active_cycle.start_date} —{' '}
                                        {metrics.active_cycle.end_date}
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                        Active Cycle
                                    </p>
                                    <p className="text-lg font-semibold text-muted-foreground">
                                        No active cycle
                                    </p>
                                </div>
                            )}
                        </div>
                        {metrics.active_cycle && (
                            <Badge
                                variant="outline"
                                className="bg-muted/50 text-muted-foreground"
                            >
                                {formatStatus(metrics.active_cycle.status)}
                            </Badge>
                        )}
                    </CardContent>
                </Card>

                {/* -- Charts Row ------------------------------------ */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Score Distribution */}
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                <CardTitle className="text-sm font-semibold text-foreground">
                                    Score Distribution
                                </CardTitle>
                            </div>
                            <CardDescription className="text-xs text-muted-foreground">
                                Final ratings across finalized scorecards
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {scoreData.length > 0 &&
                            scoreData.some((d) => d.count > 0) ? (
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart
                                        data={scoreData}
                                        margin={{
                                            top: 8,
                                            right: 8,
                                            bottom: 0,
                                            left: -16,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke={GRID_COLOR}
                                            strokeOpacity={0.3}
                                            vertical={false}
                                        />
                                        <XAxis
                                            dataKey="name"
                                            tick={{
                                                fontSize: 11,
                                                fill: TICK_COLOR,
                                            }}
                                            axisLine={{
                                                stroke: GRID_COLOR,
                                                strokeOpacity: 0.3,
                                            }}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            allowDecimals={false}
                                            tick={{
                                                fontSize: 11,
                                                fill: TICK_COLOR,
                                            }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip
                                            content={<ChartTooltip />}
                                            cursor={{
                                                fill: CURSOR_COLOR,
                                            }}
                                        />
                                        <Bar
                                            dataKey="count"
                                            radius={[4, 4, 0, 0]}
                                            maxBarSize={48}
                                        >
                                            {scoreData.map((entry) => (
                                                <Cell
                                                    key={entry.name}
                                                    fill={
                                                        SCORE_FILLS[
                                                            entry.name
                                                        ] ?? TICK_COLOR
                                                    }
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-[280px] items-center justify-center">
                                    <p className="text-sm text-muted-foreground">
                                        No finalized scorecards yet
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Perspective Averages */}
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <Layers className="h-4 w-4 text-muted-foreground" />
                                <CardTitle className="text-sm font-semibold text-foreground">
                                    BSC Perspective Averages
                                </CardTitle>
                            </div>
                            <CardDescription className="text-xs text-muted-foreground">
                                Average scores across the four perspectives
                                (0–5)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {perspectiveData.some((d) => d.value > 0) ? (
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart
                                        data={perspectiveData}
                                        layout="vertical"
                                        margin={{
                                            top: 8,
                                            right: 24,
                                            bottom: 0,
                                            left: 8,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke={GRID_COLOR}
                                            strokeOpacity={0.3}
                                            horizontal={false}
                                        />
                                        <XAxis
                                            type="number"
                                            domain={[0, 5]}
                                            tick={{
                                                fontSize: 11,
                                                fill: TICK_COLOR,
                                            }}
                                            axisLine={{
                                                stroke: GRID_COLOR,
                                                strokeOpacity: 0.3,
                                            }}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            type="category"
                                            dataKey="name"
                                            width={120}
                                            tick={{
                                                fontSize: 11,
                                                fill: TICK_COLOR,
                                            }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip
                                            content={<ChartTooltip />}
                                            cursor={{
                                                fill: CURSOR_COLOR,
                                            }}
                                        />
                                        <Bar
                                            dataKey="value"
                                            radius={[0, 4, 4, 0]}
                                            barSize={28}
                                        >
                                            {perspectiveData.map((entry) => (
                                                <Cell
                                                    key={entry.key}
                                                    fill={
                                                        PERSPECTIVE_FILLS[
                                                            entry.key
                                                        ] ?? TICK_COLOR
                                                    }
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-[280px] items-center justify-center">
                                    <p className="text-sm text-muted-foreground">
                                        No perspective data yet
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* -- Perspective Score Cards ------------------------ */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {Object.entries(perspectiveAverages).map(([key, avg]) => (
                        <Card key={key}>
                            <CardContent className="py-5">
                                <div className="mb-3 flex items-center gap-2">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                        {PERSPECTIVE_ICONS[key]}
                                    </span>
                                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                        {PERSPECTIVE_LABELS[key] ??
                                            formatStatus(key)}
                                    </p>
                                </div>
                                <p className="text-2xl font-semibold text-foreground">
                                    {Number(avg) > 0 ? Number(avg).toFixed(1) : '—'}
                                    <span className="ml-1 text-sm font-normal text-muted-foreground">
                                        / 5.0
                                    </span>
                                </p>
                                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full transition-all"
                                        style={{
                                            width: `${Math.min((avg / 5) * 100, 100)}%`,
                                            backgroundColor:
                                                PERSPECTIVE_FILLS[key] ??
                                                TICK_COLOR,
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* -- Improvement Plans ------------------------------ */}
                <Card>
                    <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                <AlertTriangle size={20} />
                            </span>
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Active Improvement Plans
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Employees currently on performance
                                    improvement plans
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-3xl font-bold text-foreground">
                                {metrics.active_improvement_plans}
                            </span>
                            <Link href="/improvement-plans">
                                <Button
                                    variant="outline"
                                    size="sm"
                                >
                                    View Plans
                                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
