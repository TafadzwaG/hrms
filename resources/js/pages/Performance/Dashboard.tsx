import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    BarChart3,
    CheckCircle2,
    Clock,
    Target,
    TrendingUp,
    Users,
} from 'lucide-react';

type Metrics = {
    total_cycles: number;
    active_cycle: { id: number; title: string; status: string; start_date: string; end_date: string } | null;
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

function formatStatus(status: string) {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function ratingBadgeClass(rating: string) {
    switch (rating.toLowerCase()) {
        case 'outstanding':
            return 'bg-emerald-50 text-emerald-600 border-emerald-200';
        case 'very good':
            return 'bg-blue-50 text-blue-600 border-blue-200';
        case 'good':
            return 'bg-teal-50 text-teal-600 border-teal-200';
        case 'needs improvement':
            return 'bg-amber-50 text-amber-600 border-amber-200';
        case 'unsatisfactory':
            return 'bg-red-50 text-red-600 border-red-200';
        default:
            return 'bg-gray-50 text-gray-600 border-gray-200';
    }
}

export default function PerformanceDashboard() {
    const { metrics, scoreDistribution, perspectiveAverages } = usePage<{
        metrics: Metrics;
        scoreDistribution: ScoreDistribution;
        perspectiveAverages: PerspectiveAverages;
    }>().props;

    const perspectiveLabels: Record<string, string> = {
        financial: 'Financial',
        customer: 'Customer',
        internal_process: 'Internal Process',
        learning_growth: 'Learning & Growth',
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Performance', href: '/performance' }]}>
            <Head title="Performance Management" />

            <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Performance Management</h1>
                        <p className="text-sm text-muted-foreground">
                            Balanced Scorecard performance management dashboard.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/performance-cycles">
                            <Button variant="outline">
                                <Target className="mr-2 h-4 w-4" />
                                Cycles
                            </Button>
                        </Link>
                        <Link href="/employee-scorecards">
                            <Button variant="outline">
                                <Users className="mr-2 h-4 w-4" />
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

                {/* Metric Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Cycle</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {metrics.active_cycle ? (
                                <>
                                    <div className="text-lg font-bold">{metrics.active_cycle.title}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {metrics.active_cycle.start_date} &mdash; {metrics.active_cycle.end_date}
                                    </p>
                                </>
                            ) : (
                                <div className="text-lg font-bold text-muted-foreground">No active cycle</div>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Scorecards</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.total_scorecards}</div>
                            <p className="text-xs text-muted-foreground">
                                {metrics.finalized_scorecards} finalized
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {metrics.pending_self_assessments + metrics.pending_manager_reviews}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {metrics.pending_self_assessments} self &middot; {metrics.pending_manager_reviews} manager
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {metrics.average_score > 0 ? metrics.average_score.toFixed(1) : '—'}
                            </div>
                            <p className="text-xs text-muted-foreground">Across all finalized scorecards</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Score Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Score Distribution</CardTitle>
                        <CardDescription>Breakdown of final ratings across all finalized scorecards</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                            {Object.entries(scoreDistribution).map(([rating, count]) => (
                                <Card key={rating}>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <Badge variant="outline" className={ratingBadgeClass(rating)}>
                                                {rating}
                                            </Badge>
                                            <span className="text-2xl font-bold">{count}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Perspective Averages */}
                <Card>
                    <CardHeader>
                        <CardTitle>Perspective Averages</CardTitle>
                        <CardDescription>Average scores across the four balanced scorecard perspectives</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {Object.entries(perspectiveAverages).map(([key, avg]) => (
                                <Card key={key}>
                                    <CardContent className="pt-6">
                                        <div className="mb-2 text-sm font-medium text-muted-foreground">
                                            {perspectiveLabels[key] ?? formatStatus(key)}
                                        </div>
                                        <div className="text-2xl font-bold">
                                            {avg > 0 ? avg.toFixed(1) : '—'}
                                        </div>
                                        <div className="mt-2 h-2 w-full rounded-full bg-muted">
                                            <div
                                                className="h-2 rounded-full bg-primary"
                                                style={{ width: `${Math.min((avg / 5) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Improvement Plans */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle>Active Improvement Plans</CardTitle>
                            <CardDescription>Employees currently on performance improvement plans</CardDescription>
                        </div>
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="text-3xl font-bold">{metrics.active_improvement_plans}</div>
                            <Link href="/improvement-plans">
                                <Button variant="outline" size="sm">
                                    View Plans
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
