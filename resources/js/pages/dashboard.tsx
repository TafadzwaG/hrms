import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    ArrowUpRight,
    BookOpen,
    Briefcase,
    Building2,
    CalendarDays,
    Clock3,
    FileText,
    Folder,
    LayoutGrid,
    MapPin,
    Proportions,
    RefreshCcw,
    Shield,
    User,
    UserRoundCheckIcon,
    Users,
    type LucideIcon,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { dashboard as dashboardRoute } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Metric = {
    key: string;
    label: string;
    value: number;
    helper: string;
    href?: string | null;
    format: 'number' | 'percentage';
};

type AlertItem = {
    key: string;
    severity: 'critical' | 'warning' | 'info' | 'success';
    title: string;
    description: string;
    href: string;
};

type QuickLinkItem = {
    key: string;
    label: string;
    href: string;
    description: string;
};

type BreakdownPoint = {
    label: string;
    value: number;
    percentage: number;
};

type SeriesPoint = {
    label: string;
    primary: number;
    secondary?: number;
    tertiary?: number;
};

type ChartBlock = {
    title: string;
    description: string;
    data: BreakdownPoint[] | SeriesPoint[];
    primary_label?: string;
    secondary_label?: string;
    tertiary_label?: string;
};

type RecordItem = {
    title: string;
    subtitle: string;
    meta: string;
    href?: string | null;
    status?: string | null;
};

type ListBlock = {
    title: string;
    description: string;
    items: RecordItem[];
};

type SectionData = {
    title: string;
    description: string;
    module_keys: string[];
    metrics: Metric[];
    charts: Record<string, ChartBlock>;
    lists: Record<string, ListBlock>;
    meta: Record<string, number>;
};

type ModuleSummary = {
    key: string;
    name: string;
    group: string;
    href: string;
    total: number;
    summary: string;
    highlights: string[];
    breakdown: BreakdownPoint[];
    records: RecordItem[];
    trend: SeriesPoint[];
    trend_labels: Record<string, string>;
};

type DashboardPayload = {
    generated_at: string;
    summary: Metric[];
    alerts: AlertItem[];
    quick_links: QuickLinkItem[];
    overview: {
        spotlight_keys: string[];
        headcount_movement: ChartBlock;
        attendance_pulse: ChartBlock;
        recruitment_pipeline: ChartBlock;
    };
    sections: {
        workforce: SectionData;
        operations: SectionData;
        talent: SectionData;
        governance: SectionData;
    };
    modules: Record<string, ModuleSummary>;
    module_order: string[];
};

type PageProps = {
    auth?: {
        user?: {
            name?: string;
        } | null;
    };
    dashboard: DashboardPayload;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboardRoute().url,
    },
];

const metricIconMap: Record<string, LucideIcon> = {
    headcount: Users,
    pending_approvals: Clock3,
    attendance_compliance: Activity,
    open_hiring: Briefcase,
    lifecycle_risk: AlertTriangle,
    document_watch: Shield,
    employees: Users,
    org_units: Building2,
    locations: MapPin,
    positions: Proportions,
    leave_requests: CalendarDays,
    attendance: Activity,
    timesheets: Clock3,
    payroll_exports: Folder,
    open_requisitions: Briefcase,
    active_candidates: User,
    active_employers: Building2,
    overdue_onboarding: AlertTriangle,
    reviews_in_flight: UserRoundCheckIcon,
    users: User,
    roles: Shield,
    workflows: BookOpen,
    documents: FileText,
};

const moduleIconMap: Record<string, LucideIcon> = {
    employees: Users,
    org_units: Building2,
    locations: MapPin,
    positions: Proportions,
    leave_requests: CalendarDays,
    attendance_records: Activity,
    timesheets: Clock3,
    payroll_exports: Folder,
    job_requisitions: Briefcase,
    candidate_profiles: User,
    company_profiles: Building2,
    onboarding_tasks: Users,
    offboarding_tasks: AlertTriangle,
    performance_reviews: UserRoundCheckIcon,
    learning_courses: BookOpen,
    users: User,
    roles: Shield,
    workflow_definitions: LayoutGrid,
    document_types: Folder,
    documents: FileText,
};

const severityClassMap: Record<AlertItem['severity'], string> = {
    critical: 'border-zinc-900 bg-zinc-950 text-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100',
    warning: 'border-zinc-400 bg-zinc-200 text-zinc-800 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200',
    info: 'border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-300',
    success: 'border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-400',
};

export default function Dashboard() {
    const { auth, dashboard } = usePage<PageProps>().props;
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const stopStart = router.on('start', () => setIsLoading(true));
        const stopFinish = router.on('finish', () => setIsLoading(false));

        return () => {
            stopStart();
            stopFinish();
        };
    }, []);

    const moduleGroups = useMemo(
        () => ({
            workforce: dashboard.sections.workforce.module_keys.map((key) => dashboard.modules[key]).filter(Boolean),
            operations: dashboard.sections.operations.module_keys.map((key) => dashboard.modules[key]).filter(Boolean),
            talent: dashboard.sections.talent.module_keys.map((key) => dashboard.modules[key]).filter(Boolean),
            governance: dashboard.sections.governance.module_keys.map((key) => dashboard.modules[key]).filter(Boolean),
            all: dashboard.module_order.map((key) => dashboard.modules[key]).filter(Boolean),
        }),
        [dashboard],
    );

    const firstName = auth?.user?.name?.split(' ')[0] || 'Team';
    const generatedAt = formatDateTime(dashboard.generated_at);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="min-h-[calc(100vh-64px)] space-y-5 px-4 py-4 md:px-6 lg:px-8" data-dashboard-scope>
                <Card className="overflow-hidden border-border/70 bg-background/95 shadow-sm">
                    <CardContent className="flex items-center justify-between gap-4 p-3.5">
                        <div className="flex min-w-0 items-center gap-3">
                            <Badge className="shrink-0 rounded-md border border-border bg-muted px-2.5 py-0.5 text-[10px] text-muted-foreground shadow-none">
                                HRMS command centre
                            </Badge>
                            <div className="min-w-0">
                                <h1 className="truncate text-base font-semibold tracking-tight text-foreground">
                                    Welcome back, {firstName}.
                                </h1>
                                <p className="truncate text-[11px] text-muted-foreground">
                                    Workforce, operations, talent, and governance metrics across every active module.
                                </p>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                            <Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-[10px] font-medium">
                                Updated {generatedAt}
                            </Badge>
                            <Button variant="outline" size="sm" className="shadow-sm" onClick={() => router.reload()}>
                                <RefreshCcw className={cn('mr-2 h-3.5 w-3.5', isLoading && 'animate-spin')} />
                                Refresh
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {isLoading ? (
                    <DashboardSkeleton />
                ) : (
                    <>
                        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                            {dashboard.summary.map((metric) => (
                                <MetricCard key={metric.key} metric={metric} />
                            ))}
                        </div>

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                            <div className="overflow-x-auto">
                                <TabsList variant="line" className="min-w-max gap-1 bg-transparent p-0">
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="workforce">Workforce</TabsTrigger>
                                    <TabsTrigger value="operations">Operations</TabsTrigger>
                                    <TabsTrigger value="talent">Talent</TabsTrigger>
                                    <TabsTrigger value="governance">Governance</TabsTrigger>
                                    <TabsTrigger value="modules">All modules</TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="overview" className="space-y-6">
                                <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                                    <Card className="border-border/70 shadow-sm">
                                        <CardHeader>
                                            <CardTitle>Attention queue</CardTitle>
                                            <CardDescription>High-signal items that need immediate review.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            {dashboard.alerts.map((alert) => (
                                                <Link key={alert.key} href={alert.href} className={cn('flex items-start justify-between gap-3 rounded-lg border p-4 transition-colors hover:opacity-90', severityClassMap[alert.severity])}>
                                                    <div className="space-y-1">
                                                        <div className="text-sm font-semibold">{alert.title}</div>
                                                        <div className="text-xs leading-5 opacity-90">{alert.description}</div>
                                                    </div>
                                                    <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0" />
                                                </Link>
                                            ))}
                                        </CardContent>
                                    </Card>

                                    <Card className="border-border/70 shadow-sm">
                                        <CardHeader>
                                            <CardTitle>Quick actions</CardTitle>
                                            <CardDescription>Jump straight into the busiest HR workflows.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="grid gap-3 sm:grid-cols-2">
                                            {dashboard.quick_links.map((item) => {
                                                const Icon = moduleIconMap[item.key] || LayoutGrid;

                                                return (
                                                    <Link key={item.key} href={item.href} className="rounded-lg border border-border/70 bg-muted/20 p-4 transition-colors hover:border-border hover:bg-muted/40">
                                                        <div className="mb-3 flex items-center gap-3">
                                                            <div className="rounded-md bg-muted p-2 text-muted-foreground">
                                                                <Icon className="h-4 w-4" />
                                                            </div>
                                                            <div className="text-sm font-semibold text-foreground">{item.label}</div>
                                                        </div>
                                                        <p className="text-xs leading-5 text-muted-foreground">{item.description}</p>
                                                    </Link>
                                                );
                                            })}
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="grid gap-4 xl:grid-cols-3">
                                    <SeriesChartCard chart={dashboard.overview.headcount_movement} variant="dual" />
                                    <SeriesChartCard chart={dashboard.overview.attendance_pulse} variant="triple" />
                                    <BreakdownChartCard chart={dashboard.overview.recruitment_pipeline} />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
                                    {dashboard.overview.spotlight_keys.map((key) => (
                                        <MiniModuleCard key={key} module={dashboard.modules[key]} />
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="workforce" className="space-y-6">
                                <SectionMetrics metrics={dashboard.sections.workforce.metrics} />
                                <div className="grid gap-4 xl:grid-cols-2">
                                    <SeriesChartCard chart={dashboard.sections.workforce.charts.headcount_movement} variant="dual" />
                                    <BreakdownChartCard chart={dashboard.sections.workforce.charts.department_headcount} />
                                </div>
                                <div className="grid gap-4 xl:grid-cols-2">
                                    <BreakdownChartCard chart={dashboard.sections.workforce.charts.pay_points} />
                                    <BreakdownChartCard chart={dashboard.sections.workforce.charts.data_quality} />
                                </div>
                                <div className="grid gap-4 xl:grid-cols-2">
                                    <RecordListCard block={dashboard.sections.workforce.lists.recent_hires} />
                                    <RecordListCard block={dashboard.sections.workforce.lists.location_coverage} />
                                </div>
                                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                    {moduleGroups.workforce.map((module) => (
                                        <MiniModuleCard key={module.key} module={module} />
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="operations" className="space-y-6">
                                <SectionMetrics metrics={dashboard.sections.operations.metrics} />
                                <div className="grid gap-4 xl:grid-cols-2">
                                    <SeriesChartCard chart={dashboard.sections.operations.charts.attendance_pulse} variant="triple" />
                                    <BreakdownChartCard chart={dashboard.sections.operations.charts.leave_status} />
                                </div>
                                <div className="grid gap-4 xl:grid-cols-2">
                                    <SeriesChartCard chart={dashboard.sections.operations.charts.timesheet_hours} variant="dual" />
                                    <BreakdownChartCard chart={dashboard.sections.operations.charts.payroll_status} />
                                </div>
                                <div className="grid gap-4 xl:grid-cols-2">
                                    <RecordListCard block={dashboard.sections.operations.lists.leave_queue} />
                                    <RecordListCard block={dashboard.sections.operations.lists.recent_exports} />
                                </div>
                                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                    {moduleGroups.operations.map((module) => (
                                        <MiniModuleCard key={module.key} module={module} />
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="talent" className="space-y-6">
                                <SectionMetrics metrics={dashboard.sections.talent.metrics} />
                                <div className="grid gap-4 xl:grid-cols-2">
                                    <BreakdownChartCard chart={dashboard.sections.talent.charts.candidate_pipeline} />
                                    <BreakdownChartCard chart={dashboard.sections.talent.charts.requisition_status} />
                                </div>
                                <div className="grid gap-4 xl:grid-cols-2">
                                    <BreakdownChartCard chart={dashboard.sections.talent.charts.performance_ratings} />
                                    <BreakdownChartCard chart={dashboard.sections.talent.charts.learning_categories} />
                                </div>
                                <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
                                    {Object.values(dashboard.sections.talent.lists).map((block) => (
                                        <RecordListCard key={block.title} block={block} />
                                    ))}
                                </div>
                                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
                                    {moduleGroups.talent.map((module) => (
                                        <MiniModuleCard key={module.key} module={module} />
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="governance" className="space-y-6">
                                <SectionMetrics metrics={dashboard.sections.governance.metrics} />
                                <div className="grid gap-4 xl:grid-cols-2">
                                    <BreakdownChartCard chart={dashboard.sections.governance.charts.role_assignments} />
                                    <BreakdownChartCard chart={dashboard.sections.governance.charts.workflow_request_types} />
                                </div>
                                <div className="grid gap-4 xl:grid-cols-2">
                                    <BreakdownChartCard chart={dashboard.sections.governance.charts.document_access} />
                                    <BreakdownChartCard chart={dashboard.sections.governance.charts.document_type_usage} />
                                </div>
                                <div className="grid gap-4 xl:grid-cols-2">
                                    <RecordListCard block={dashboard.sections.governance.lists.recent_workflows} />
                                    <RecordListCard block={dashboard.sections.governance.lists.recent_documents} />
                                </div>
                                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
                                    {moduleGroups.governance.map((module) => (
                                        <MiniModuleCard key={module.key} module={module} />
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="modules" className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                    {moduleGroups.all.map((module) => (
                                        <ModuleCard key={module.key} module={module} />
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </>
                )}
            </div>
        </AppLayout>
    );
}

function SectionMetrics({ metrics }: { metrics: Metric[] }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
                <MetricCard key={metric.key} metric={metric} />
            ))}
        </div>
    );
}

function MetricCard({ metric }: { metric: Metric }) {
    const Icon = metricIconMap[metric.key] || LayoutGrid;

    return (
        <Card className="border-border/70 bg-background/95 shadow-sm">
            <CardContent className="flex items-start justify-between gap-3 p-3.5">
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        <Activity className="h-3 w-3" />
                        {metric.label}
                    </div>
                    <div className="text-xl font-semibold leading-none tracking-tight text-foreground">{formatMetricValue(metric.value, metric.format)}</div>
                    <div className="text-[11px] leading-4 text-muted-foreground">{metric.helper}</div>
                    {metric.href ? (
                        <Link href={metric.href} className="inline-flex items-center gap-1 text-[10px] font-medium text-foreground hover:underline">
                            Open module
                            <ArrowUpRight className="h-3 w-3" />
                        </Link>
                    ) : null}
                </div>
                <div className="rounded-md bg-muted p-2 text-muted-foreground">
                    <Icon className="h-4 w-4" />
                </div>
            </CardContent>
        </Card>
    );
}

function BreakdownChartCard({ chart }: { chart: ChartBlock }) {
    return (
        <Card className="border-border/70 bg-background/95 shadow-sm">
            <CardHeader>
                <CardTitle>{chart.title}</CardTitle>
                <CardDescription>{chart.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <BreakdownBars data={chart.data as BreakdownPoint[]} />
            </CardContent>
        </Card>
    );
}

function SeriesChartCard({ chart, variant }: { chart: ChartBlock; variant: 'dual' | 'triple' }) {
    return (
        <Card className="border-border/70 bg-background/95 shadow-sm">
            <CardHeader>
                <CardTitle>{chart.title}</CardTitle>
                <CardDescription>{chart.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <SeriesBars data={chart.data as SeriesPoint[]} variant={variant} />
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {chart.primary_label ? <LegendPill label={chart.primary_label} tone="primary" /> : null}
                    {chart.secondary_label ? <LegendPill label={chart.secondary_label} tone="secondary" /> : null}
                    {chart.tertiary_label ? <LegendPill label={chart.tertiary_label} tone="tertiary" /> : null}
                </div>
            </CardContent>
        </Card>
    );
}

function RecordListCard({ block }: { block: ListBlock }) {
    return (
        <Card className="border-border/70 bg-background/95 shadow-sm">
            <CardHeader>
                <CardTitle>{block.title}</CardTitle>
                <CardDescription>{block.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {block.items.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border/70 px-4 py-6 text-sm text-muted-foreground">No records to display.</div>
                ) : (
                    block.items.map((item, index) => <RecordRow key={`${item.title}-${index}`} item={item} />)
                )}
            </CardContent>
        </Card>
    );
}

function MiniModuleCard({ module }: { module: ModuleSummary }) {
    const Icon = moduleIconMap[module.key] || LayoutGrid;
    const primaryBreakdown = module.breakdown[0];

    return (
        <Link href={module.href} className="group block rounded-lg">
            <Card className="h-full border-border/70 bg-background/95 shadow-sm transition-colors group-hover:border-border">
                <CardContent className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                            <div className="text-sm font-semibold text-foreground">{module.name}</div>
                            <div className="text-2xl font-semibold tracking-tight text-foreground">{formatNumber(module.total)}</div>
                        </div>
                        <div className="rounded-md bg-muted p-2.5 text-muted-foreground">
                            <Icon className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">{module.summary}</p>
                    {primaryBreakdown ? (
                        <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">{primaryBreakdown.label}</span> represents {primaryBreakdown.percentage}% of the visible module mix.
                        </div>
                    ) : null}
                </CardContent>
            </Card>
        </Link>
    );
}

function ModuleCard({ module }: { module: ModuleSummary }) {
    const Icon = moduleIconMap[module.key] || LayoutGrid;

    return (
        <Card className="border-border/70 bg-background/95 shadow-sm">
            <CardHeader className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                        <CardTitle className="text-lg">{module.name}</CardTitle>
                        <CardDescription>{module.summary}</CardDescription>
                    </div>
                    <div className="rounded-md bg-muted p-3 text-muted-foreground">
                        <Icon className="h-5 w-5" />
                    </div>
                </div>
                <div className="text-3xl font-semibold tracking-tight text-foreground">{formatNumber(module.total)}</div>
            </CardHeader>
            <CardContent className="space-y-5">
                <div className="space-y-2">
                    {module.highlights.slice(0, 3).map((highlight) => (
                        <div key={highlight} className="rounded-md bg-muted/30 px-3 py-2 text-sm text-muted-foreground">{highlight}</div>
                    ))}
                </div>

                {module.breakdown.length > 0 ? <BreakdownBars data={module.breakdown.slice(0, 4)} compact /> : null}

                <div className="space-y-3">
                    <div className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Recent activity</div>
                    <div className="space-y-3">
                        {module.records.slice(0, 3).map((item, index) => (
                            <RecordRow key={`${module.key}-${index}`} item={item} compact />
                        ))}
                    </div>
                </div>

                <Button asChild variant="outline" className="w-full shadow-sm">
                    <Link href={module.href}>
                        Open module
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}

function RecordRow({ item, compact = false }: { item: RecordItem; compact?: boolean }) {
    const content = (
        <div className={cn('rounded-lg border border-border/70 bg-muted/20 p-4 transition-colors hover:border-border hover:bg-muted/40', compact && 'p-3')}>
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                    <div className="truncate text-sm font-medium text-foreground">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.subtitle}</div>
                    <div className="text-xs text-muted-foreground">{item.meta}</div>
                </div>
                {item.status ? <Badge variant="outline" className="shrink-0">{item.status}</Badge> : null}
            </div>
        </div>
    );

    return item.href ? <Link href={item.href}>{content}</Link> : content;
}

function BreakdownBars({ data, compact = false }: { data: BreakdownPoint[]; compact?: boolean }) {
    const max = Math.max(...data.map((item) => item.value), 1);

    return (
        <div className={cn('space-y-4', compact && 'space-y-3')}>
            {data.map((item, index) => (
                <div key={item.label} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="truncate text-foreground">{item.label}</span>
                        <span className="shrink-0 text-muted-foreground">{formatNumber(item.value)}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full"
                            style={{
                                width: `${Math.max((item.value / max) * 100, 4)}%`,
                                backgroundColor: chartTone(index),
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

function SeriesBars({ data, variant }: { data: SeriesPoint[]; variant: 'dual' | 'triple' }) {
    const max = Math.max(...data.flatMap((item) => [item.primary, item.secondary ?? 0, item.tertiary ?? 0]), 1);

    return (
        <div className="flex h-52 items-end gap-3 rounded-lg border border-border/70 bg-muted/20 p-4">
            {data.map((item) => (
                <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                    <div className="flex h-36 items-end justify-center gap-1.5">
                        <Bar height={(item.primary / max) * 100} tone="primary" />
                        {variant === 'dual' || variant === 'triple' ? <Bar height={((item.secondary ?? 0) / max) * 100} tone="secondary" /> : null}
                        {variant === 'triple' ? <Bar height={((item.tertiary ?? 0) / max) * 100} tone="tertiary" /> : null}
                    </div>
                    <div className="w-full truncate text-center text-xs text-muted-foreground">{item.label}</div>
                </div>
            ))}
        </div>
    );
}

function Bar({ height, tone }: { height: number; tone: 'primary' | 'secondary' | 'tertiary' }) {
    const color = {
        primary: chartTone(0),
        secondary: chartTone(1),
        tertiary: chartTone(2),
    }[tone];

    return <div className="w-3 rounded-t-full" style={{ height: `${Math.max(height, 6)}%`, backgroundColor: color }} />;
}

function LegendPill({ label, tone }: { label: string; tone: 'primary' | 'secondary' | 'tertiary' }) {
    const color = {
        primary: chartTone(0),
        secondary: chartTone(1),
        tertiary: chartTone(2),
    }[tone];

    return (
        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
            {label}
        </div>
    );
}

function chartTone(index: number) {
    return `var(--chart-${(index % 5) + 1})`;
}

function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className="border-border/70 bg-background/95 shadow-sm">
                        <CardContent className="space-y-4 p-6">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-9 w-28" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Card className="border-border/70 bg-background/95 shadow-sm">
                <CardContent className="space-y-4 p-6">
                    <Skeleton className="h-10 w-80" />
                    <div className="grid gap-4 xl:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="space-y-3 rounded-lg border border-border/70 p-4">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-40 w-full" />
                            </div>
                        ))}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <Skeleton key={index} className="h-40 w-full rounded-lg" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function formatMetricValue(value: number, format: Metric['format']) {
    if (format === 'percentage') {
        return `${value.toFixed(1)}%`;
    }

    return formatNumber(value);
}

function formatNumber(value: number) {
    return new Intl.NumberFormat().format(value);
}

function formatDateTime(value: string) {
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}
