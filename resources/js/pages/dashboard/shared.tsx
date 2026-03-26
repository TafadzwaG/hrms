import { Link } from '@inertiajs/react';
import { type LucideIcon } from 'lucide-react';
import moment from 'moment';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { iconFor } from '@/lib/lucide-icons';
import { cn } from '@/lib/utils';

export type DashboardMetric = {
    key: string;
    label: string;
    value: number | string;
    helper: string;
    href?: string | null;
    format?: 'number' | 'percentage';
};

export type DashboardAction = {
    key: string;
    label: string;
    description: string;
    href: string;
    icon: string;
};

export type DashboardAlert = {
    key: string;
    severity: 'critical' | 'warning' | 'info' | 'success';
    title: string;
    description: string;
    href: string;
};

export type DashboardFocusCard = {
    key: string;
    title: string;
    description: string;
    value: number | string;
    href: string;
    icon: string;
};

export type DashboardBreakdownPoint = {
    label: string;
    value: number;
    percentage: number;
};

export type DashboardTrendPoint = {
    label: string;
    primary: number;
    secondary?: number;
    tertiary?: number;
};

export type DashboardChart = {
    key: string;
    title: string;
    description: string;
    type: 'breakdown' | 'trend';
    data: DashboardBreakdownPoint[] | DashboardTrendPoint[];
    primary_label?: string;
    secondary_label?: string;
    tertiary_label?: string;
};

export type DashboardRecord = {
    title: string;
    subtitle: string;
    meta: string;
    href?: string | null;
    status?: string | null;
};

export type DashboardList = {
    key: string;
    title: string;
    description: string;
    items: DashboardRecord[];
};

export type DashboardShortcut = {
    key: string;
    label: string;
    description: string;
    href: string;
    icon: string;
    stat?: string | null;
};

export type DashboardPayload = {
    variant: string;
    generated_at: string;
    profile: {
        title: string;
        description: string;
        role_labels: string[];
        contextual_name?: string | null;
    };
    metrics: DashboardMetric[];
    quick_actions: DashboardAction[];
    alerts: DashboardAlert[];
    focus_cards: DashboardFocusCard[];
    charts: DashboardChart[];
    lists: DashboardList[];
    shortcuts: DashboardShortcut[];
};

const severityClassMap: Record<DashboardAlert['severity'], string> = {
    critical: 'border-destructive/50 bg-destructive/10 text-destructive',
    warning: 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300',
    info: 'border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300',
    success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
}

export function DashboardHero({ dashboard }: { dashboard: DashboardPayload }) {
    const generatedAt = moment(dashboard.generated_at).format('MMM D, YYYY h:mm A');

    return (
        <Card className="overflow-hidden border-border/70 bg-background/95 shadow-sm">
            <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-[0.18em]">
                            {dashboard.profile.title}
                        </Badge>
                        {dashboard.profile.role_labels.map((role) => (
                            <Badge key={role} variant="secondary" className="rounded-full px-2.5 py-0.5 text-[10px]">
                                {role}
                            </Badge>
                        ))}
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold tracking-tight text-foreground">
                            {dashboard.profile.contextual_name ? `${dashboard.profile.contextual_name} · ${dashboard.profile.title}` : dashboard.profile.title}
                        </h1>
                        <p className="text-sm text-muted-foreground">{dashboard.profile.description}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-[10px]">
                        Updated {generatedAt}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}

export function MetricGrid({ metrics }: { metrics: DashboardMetric[] }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            {metrics.map((metric) => (
                <MetricCard key={metric.key} metric={metric} />
            ))}
        </div>
    );
}

export function MetricCard({ metric }: { metric: DashboardMetric }) {
    const Icon = iconFor(metric.key);

    return (
        <Card className="border-border/70 bg-background/95 shadow-sm">
            <CardContent className="flex items-start justify-between gap-3 p-4">
                <div className="space-y-1.5">
                    <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{metric.label}</div>
                    <div className="text-2xl font-semibold tracking-tight text-foreground">{formatMetricValue(metric)}</div>
                    <p className="text-xs leading-5 text-muted-foreground">{metric.helper}</p>
                    {metric.href ? (
                        <Link href={metric.href} className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground hover:underline">
                            Open
                        </Link>
                    ) : null}
                </div>
                <div className="rounded-md bg-muted p-2.5 text-muted-foreground">
                    <Icon className="h-4 w-4" />
                </div>
            </CardContent>
        </Card>
    );
}

export function QuickActionsPanel({ actions }: { actions: DashboardAction[] }) {
    return (
        <Card className="border-border/70 bg-background/95 shadow-sm">
            <CardHeader>
                <CardTitle>Quick actions</CardTitle>
                <CardDescription>Fast access to the work this role usually handles first.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
                {actions.map((action) => {
                    const Icon = iconFor(action.icon);

                    return (
                        <Link key={action.key} href={action.href} className="rounded-lg border border-border/70 bg-muted/20 p-4 transition-colors hover:border-border hover:bg-muted/40">
                            <div className="mb-3 flex items-center gap-3">
                                <div className="rounded-md bg-muted p-2 text-muted-foreground">
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div className="text-sm font-semibold text-foreground">{action.label}</div>
                            </div>
                            <p className="text-xs leading-5 text-muted-foreground">{action.description}</p>
                        </Link>
                    );
                })}
            </CardContent>
        </Card>
    );
}

export function AlertsPanel({ alerts }: { alerts: DashboardAlert[] }) {
    return (
        <Card className="border-border/70 bg-background/95 shadow-sm">
            <CardHeader>
                <CardTitle>Alerts</CardTitle>
                <CardDescription>Items that need attention based on the active role.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {alerts.map((alert) => (
                    <Link key={alert.key} href={alert.href} className={cn('block rounded-lg border p-4 transition-colors hover:opacity-90', severityClassMap[alert.severity])}>
                        <div className="space-y-1">
                            <div className="text-sm font-semibold">{alert.title}</div>
                            <div className="text-xs leading-5 opacity-90">{alert.description}</div>
                        </div>
                    </Link>
                ))}
            </CardContent>
        </Card>
    );
}

export function FocusCardGrid({ cards }: { cards: DashboardFocusCard[] }) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            {cards.map((card) => (
                <FocusCard key={card.key} card={card} />
            ))}
        </div>
    );
}

export function FocusCard({ card }: { card: DashboardFocusCard }) {
    const Icon = iconFor(card.icon);

    return (
        <Link href={card.href} className="block">
            <Card className="h-full border-border/70 bg-background/95 shadow-sm transition-colors hover:border-border">
                <CardContent className="space-y-4 p-4">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <div className="text-sm font-semibold text-foreground">{card.title}</div>
                            <div className="text-2xl font-semibold tracking-tight text-foreground">{String(card.value)}</div>
                        </div>
                        <div className="rounded-md bg-muted p-2.5 text-muted-foreground">
                            <Icon className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="text-xs leading-5 text-muted-foreground">{card.description}</p>
                </CardContent>
            </Card>
        </Link>
    );
}

export function ChartGrid({ charts }: { charts: DashboardChart[] }) {
    return (
        <div className="grid gap-4 xl:grid-cols-3">
            {charts.map((chart) => (
                <ChartCard key={chart.key} chart={chart} />
            ))}
        </div>
    );
}

export function ChartCard({ chart }: { chart: DashboardChart }) {
    return (
        <Card className="border-border/70 bg-background/95 shadow-sm">
            <CardHeader>
                <CardTitle>{chart.title}</CardTitle>
                <CardDescription>{chart.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {chart.type === 'trend' ? <SeriesBars data={chart.data as DashboardTrendPoint[]} /> : <BreakdownBars data={chart.data as DashboardBreakdownPoint[]} />}
            </CardContent>
        </Card>
    );
}

export function ListGrid({ lists, columns = 3 }: { lists: DashboardList[]; columns?: 2 | 3 }) {
    return (
        <div className={cn('grid gap-4', columns === 2 ? 'xl:grid-cols-2' : 'xl:grid-cols-3')}>
            {lists.map((list) => (
                <ListCard key={list.key} list={list} />
            ))}
        </div>
    );
}

export function ListCard({ list }: { list: DashboardList }) {
    return (
        <Card className="border-border/70 bg-background/95 shadow-sm">
            <CardHeader>
                <CardTitle>{list.title}</CardTitle>
                <CardDescription>{list.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {list.items.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border/70 px-4 py-6 text-sm text-muted-foreground">
                        No items to show.
                    </div>
                ) : (
                    list.items.map((item, index) => <RecordRow key={`${list.key}-${index}`} item={item} />)
                )}
            </CardContent>
        </Card>
    );
}

export function ShortcutGrid({ shortcuts }: { shortcuts: DashboardShortcut[] }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {shortcuts.map((shortcut) => (
                <ShortcutCard key={shortcut.key} shortcut={shortcut} />
            ))}
        </div>
    );
}

export function ShortcutCard({ shortcut }: { shortcut: DashboardShortcut }) {
    const Icon = iconFor(shortcut.icon);

    return (
        <Card className="border-border/70 bg-background/95 shadow-sm">
            <CardContent className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                        <div className="text-sm font-semibold text-foreground">{shortcut.label}</div>
                        {shortcut.stat ? <div className="text-xl font-semibold tracking-tight text-foreground">{shortcut.stat}</div> : null}
                    </div>
                    <div className="rounded-md bg-muted p-2.5 text-muted-foreground">
                        <Icon className="h-4 w-4" />
                    </div>
                </div>
                <p className="text-xs leading-5 text-muted-foreground">{shortcut.description}</p>
                <Button asChild variant="outline" className="w-full">
                    <Link href={shortcut.href}>Open</Link>
                </Button>
            </CardContent>
        </Card>
    );
}

export function RecordRow({ item }: { item: DashboardRecord }) {
    const content = (
        <div className="rounded-lg border border-border/70 bg-muted/20 p-3 transition-colors hover:border-border hover:bg-muted/40">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                    <div className="truncate text-sm font-medium text-foreground">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.subtitle}</div>
                    <div className="text-xs text-muted-foreground">{item.meta}</div>
                </div>
                {item.status ? <Badge variant="outline">{item.status}</Badge> : null}
            </div>
        </div>
    );

    return item.href ? <Link href={item.href}>{content}</Link> : content;
}

function BreakdownBars({ data }: { data: DashboardBreakdownPoint[] }) {
    const max = Math.max(...data.map((item) => item.value), 1);

    return (
        <div className="space-y-4">
            {data.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border/70 px-4 py-6 text-sm text-muted-foreground">No chart data yet.</div>
            ) : (
                data.map((item, index) => (
                    <div key={item.label} className="space-y-1.5">
                        <div className="flex items-center justify-between gap-3 text-sm">
                            <span className="truncate text-foreground">{item.label}</span>
                            <span className="shrink-0 text-muted-foreground">{formatNumber(item.value)}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                            <div className="h-full rounded-full" style={{ width: `${Math.max((item.value / max) * 100, 4)}%`, backgroundColor: chartTone(index) }} />
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

function SeriesBars({ data }: { data: DashboardTrendPoint[] }) {
    const max = Math.max(...data.flatMap((item) => [item.primary, item.secondary ?? 0, item.tertiary ?? 0]), 1);

    return (
        <div className="flex h-52 items-end gap-3 rounded-lg border border-border/70 bg-muted/20 p-4">
            {data.map((item) => (
                <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                    <div className="flex h-36 items-end justify-center gap-1.5">
                        <Bar height={(item.primary / max) * 100} tone={0} />
                        {item.secondary !== undefined ? <Bar height={((item.secondary ?? 0) / max) * 100} tone={1} /> : null}
                        {item.tertiary !== undefined ? <Bar height={((item.tertiary ?? 0) / max) * 100} tone={2} /> : null}
                    </div>
                    <div className="w-full truncate text-center text-xs text-muted-foreground">{item.label}</div>
                </div>
            ))}
        </div>
    );
}

function Bar({ height, tone }: { height: number; tone: number }) {
    return <div className="w-3 rounded-t-full" style={{ height: `${Math.max(height, 6)}%`, backgroundColor: chartTone(tone) }} />;
}

function chartTone(index: number) {
    return `var(--chart-${(index % 5) + 1})`;
}

function formatNumber(value: number | string) {
    if (typeof value !== 'number') {
        return value;
    }

    return new Intl.NumberFormat().format(value);
}

function formatMetricValue(metric: DashboardMetric) {
    if (typeof metric.value === 'number' && metric.format === 'percentage') {
        return `${metric.value.toFixed(1)}%`;
    }

    return formatNumber(metric.value);
}
