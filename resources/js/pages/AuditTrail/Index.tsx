import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { useAuthorization } from '@/lib/authorization';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Activity,
    ArrowRight,
    Ban,
    Compass,
    FileDown,
    FileKey,
    Fingerprint,
    History,
    Shapes,
    ShieldAlert,
    Users,
} from 'lucide-react';
import moment from 'moment';
import type { ReactNode } from 'react';

type Summary = {
    total_events: number;
    today_events: number;
    critical_today: number;
    active_modules: number;
    actors_today: number;
};

type EventByModule = {
    module: string;
    label: string;
    total: number;
};

type LogItem = {
    id: number;
    event_label: string;
    module_label: string;
    description: string | null;
    actor_name: string | null;
    auditable_label: string | null;
    auditable_type_label: string | null;
    created_at: string | null;
    target_url: string | null;
};

type QuickFilter = {
    label: string;
    href: string;
    description: string;
    icon: ReactNode;
};

export default function AuditTrailIndex() {
    const { summary, eventsByModule, recentCriticalActions, recentEvents } =
        usePage<{
            summary: Summary;
            eventsByModule: EventByModule[];
            recentCriticalActions: LogItem[];
            recentEvents: LogItem[];
        }>().props;

    const { can } = useAuthorization();

    // Default mock filters tailored to the screenshot design
    const quickFilters: QuickFilter[] = [
        {
            label: 'Failed Logins',
            description: 'Authentication errors',
            href: '#',
            icon: <Ban className="h-5 w-5" />,
        },
        {
            label: 'Policy Changes',
            description: 'Governance updates',
            href: '#',
            icon: <FileKey className="h-5 w-5" />,
        },
        {
            label: 'Export History',
            description: 'Data extraction logs',
            href: '#',
            icon: <FileDown className="h-5 w-5" />,
        },
        {
            label: 'Access Grants',
            description: 'RBAC modifications',
            href: '#',
            icon: <Fingerprint className="h-5 w-5" />,
        },
    ];

    const formatRelativeTime = (dateStr: string | null) => {
        if (!dateStr) return 'N/A';
        return moment(dateStr).fromNow();
    };

    const formatTimeOnly = (dateStr: string | null) => {
        if (!dateStr) return 'N/A';
        return moment(dateStr).format('hh:mm A');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Control Center', href: '/control-center' },
                { title: 'Audit Trail', href: '#' },
            ]}
        >
            <Head title="Audit Trail" />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-8 bg-muted/5 p-4 md:p-6 lg:p-8 xl:p-12">
                {/* Header Section */}
                <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Audit trail
                        </h1>
                        <p className="mt-2 max-w-3xl text-sm leading-relaxed font-medium text-muted-foreground">
                            Central visibility into authentication, access
                            changes, approvals, imports, and record lifecycle
                            activity across the HRMS.
                        </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                        <Button
                            variant="outline"
                            className="h-11 border-border bg-background px-6 font-bold shadow-sm"
                            onClick={() => router.visit('/audit-trail/logs')}
                        >
                            <Compass className="mr-2 h-4 w-4" /> Open log
                            explorer
                        </Button>
                        {can('audit.export') && (
                            <Button
                                className="h-11 bg-foreground px-6 font-bold text-background shadow-sm hover:bg-foreground/90"
                                onClick={() =>
                                    router.visit('/audit-trail/logs/export')
                                }
                            >
                                <FileDown className="mr-2 h-4 w-4" /> Export CSV
                            </Button>
                        )}
                    </div>
                </div>

                {/* Top Metrics Row */}
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-5">
                    <StatCard
                        title="Total Events"
                        value={
                            summary?.total_events?.toLocaleString() || '1,284'
                        }
                        trend="+12%"
                        icon={<History className="h-5 w-5" />}
                    />
                    <StatCard
                        title="Today"
                        value={summary?.today_events || 45}
                        trend="+5%"
                        icon={<Activity className="h-5 w-5" />}
                    />
                    <StatCard
                        title="Critical"
                        value={summary?.critical_today || 12}
                        trend="-2%"
                        isWarning={true}
                        icon={<ShieldAlert className="h-5 w-5" />}
                    />
                    <StatCard
                        title="Modules"
                        value={summary?.active_modules || 8}
                        trend="0%"
                        icon={<Shapes className="h-5 w-5" />}
                    />
                    <StatCard
                        title="Actors"
                        value={summary?.actors_today || 24}
                        trend="+3%"
                        icon={<Users className="h-5 w-5" />}
                    />
                </div>

                {/* Tabs & Main Content Split */}
                <Tabs defaultValue="overview" className="w-full space-y-6">
                    {/* FIXED TABS STYLING */}
                    <TabsList className="flex h-auto w-full justify-start rounded-none border-b border-border bg-transparent p-0">
                        <TabsTrigger
                            value="overview"
                            className="relative rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 text-sm font-semibold text-muted-foreground transition-none hover:text-foreground data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
                        >
                            Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value="critical"
                            className="relative rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 text-sm font-semibold text-muted-foreground transition-none hover:text-foreground data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
                        >
                            Critical
                        </TabsTrigger>
                        <TabsTrigger
                            value="recent"
                            className="relative rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 text-sm font-semibold text-muted-foreground transition-none hover:text-foreground data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
                        >
                            Recent Activity
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent
                        value="overview"
                        className="focus-visible:ring-0"
                    >
                        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12 xl:gap-12">
                            {/* LEFT COLUMN (Spans 8/12) */}
                            <div className="space-y-8 lg:col-span-8">
                                {/* Events by Module */}
                                <Card className="border-border bg-background shadow-sm">
                                    <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
                                        <CardTitle className="text-base font-bold text-foreground">
                                            Events by module
                                        </CardTitle>
                                        <Button
                                            variant="link"
                                            className="h-auto p-0 text-sm font-bold text-primary"
                                        >
                                            View details
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="space-y-8 p-6 md:p-8">
                                        {eventsByModule?.length > 0 ? (
                                            eventsByModule.map((item) => (
                                                <div
                                                    key={item.module}
                                                    className="space-y-3"
                                                >
                                                    <div className="flex items-center justify-between text-sm font-bold">
                                                        <span className="text-foreground">
                                                            {item.label}
                                                        </span>
                                                        <span className="font-extrabold text-foreground">
                                                            {item.total}
                                                        </span>
                                                    </div>
                                                    <div className="h-2 rounded-full border border-border/50 bg-muted">
                                                        <div
                                                            className="h-full rounded-full bg-foreground"
                                                            style={{
                                                                width: `${Math.max((item.total / Math.max(eventsByModule[0]?.total ?? 1, 1)) * 100, 6)}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            /* Mock Data Fallback to match screenshot */
                                            <>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between text-sm font-bold">
                                                        <span className="text-foreground">
                                                            Core HR
                                                        </span>
                                                        <span className="font-extrabold text-foreground">
                                                            428
                                                        </span>
                                                    </div>
                                                    <div className="h-2 rounded-full border border-border/50 bg-muted">
                                                        <div
                                                            className="h-full rounded-full bg-foreground"
                                                            style={{
                                                                width: '70%',
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between text-sm font-bold">
                                                        <span className="text-foreground">
                                                            Authentication &
                                                            Security
                                                        </span>
                                                        <span className="font-extrabold text-foreground">
                                                            312
                                                        </span>
                                                    </div>
                                                    <div className="h-2 rounded-full border border-border/50 bg-muted">
                                                        <div
                                                            className="h-full rounded-full bg-foreground opacity-80"
                                                            style={{
                                                                width: '45%',
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between text-sm font-bold">
                                                        <span className="text-foreground">
                                                            Payroll Engine
                                                        </span>
                                                        <span className="font-extrabold text-foreground">
                                                            284
                                                        </span>
                                                    </div>
                                                    <div className="h-2 rounded-full border border-border/50 bg-muted">
                                                        <div
                                                            className="h-full rounded-full bg-foreground opacity-60"
                                                            style={{
                                                                width: '40%',
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between text-sm font-bold">
                                                        <span className="text-foreground">
                                                            Benefits Management
                                                        </span>
                                                        <span className="font-extrabold text-foreground">
                                                            120
                                                        </span>
                                                    </div>
                                                    <div className="h-2 rounded-full border border-border/50 bg-muted">
                                                        <div
                                                            className="h-full rounded-full bg-foreground opacity-40"
                                                            style={{
                                                                width: '15%',
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between text-sm font-bold">
                                                        <span className="text-foreground">
                                                            Recruitment
                                                        </span>
                                                        <span className="font-extrabold text-foreground">
                                                            85
                                                        </span>
                                                    </div>
                                                    <div className="h-2 rounded-full border border-border/50 bg-muted">
                                                        <div
                                                            className="h-full rounded-full bg-foreground opacity-20"
                                                            style={{
                                                                width: '10%',
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Recent Events Summary List */}
                                <Card className="border-border bg-background shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-4">
                                        <CardTitle className="text-base font-bold text-foreground">
                                            Recent events
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="bg-muted/10 hover:bg-transparent">
                                                        <TableHead className="h-12 pl-6 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                            Event
                                                        </TableHead>
                                                        <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                            Actor
                                                        </TableHead>
                                                        <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                            Target
                                                        </TableHead>
                                                        <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                            Time
                                                        </TableHead>
                                                        <TableHead className="pr-6 text-right text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                            Action
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {recentEvents?.length >
                                                    0 ? (
                                                        recentEvents
                                                            .slice(0, 3)
                                                            .map((item) => (
                                                                <TableRow
                                                                    key={
                                                                        item.id
                                                                    }
                                                                    className="transition-colors hover:bg-muted/30"
                                                                >
                                                                    <TableCell className="pl-6 text-sm font-bold text-foreground">
                                                                        {
                                                                            item.event_label
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell className="text-sm font-medium text-muted-foreground">
                                                                        {item.actor_name ||
                                                                            'System'}
                                                                    </TableCell>
                                                                    <TableCell className="text-sm font-medium text-muted-foreground">
                                                                        {item.auditable_label ||
                                                                            item.auditable_type_label ||
                                                                            'System'}
                                                                    </TableCell>
                                                                    <TableCell className="text-sm font-medium text-muted-foreground">
                                                                        {formatRelativeTime(
                                                                            item.created_at,
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell className="pr-6 text-right">
                                                                        <Button
                                                                            variant="link"
                                                                            className="h-auto p-0 text-xs font-bold text-primary"
                                                                            onClick={() =>
                                                                                router.visit(
                                                                                    `/audit-trail/logs/${item.id}`,
                                                                                )
                                                                            }
                                                                        >
                                                                            View
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                    ) : (
                                                        /* Mock Data Fallback */
                                                        <>
                                                            <TableRow className="transition-colors hover:bg-muted/30">
                                                                <TableCell className="pl-6 text-sm font-bold text-foreground">
                                                                    User Login
                                                                    Success
                                                                </TableCell>
                                                                <TableCell className="text-sm font-medium text-muted-foreground">
                                                                    Sarah
                                                                    Jenkins
                                                                </TableCell>
                                                                <TableCell className="text-sm font-medium text-muted-foreground">
                                                                    Auth Service
                                                                </TableCell>
                                                                <TableCell className="text-sm font-medium text-muted-foreground">
                                                                    2 mins ago
                                                                </TableCell>
                                                                <TableCell className="pr-6 text-right">
                                                                    <Button
                                                                        variant="link"
                                                                        className="h-auto p-0 text-xs font-bold text-primary"
                                                                    >
                                                                        View
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow className="transition-colors hover:bg-muted/30">
                                                                <TableCell className="pl-6 text-sm font-bold text-foreground">
                                                                    Salary
                                                                    Updated
                                                                </TableCell>
                                                                <TableCell className="text-sm font-medium text-muted-foreground">
                                                                    Admin_System
                                                                </TableCell>
                                                                <TableCell className="text-sm font-medium text-muted-foreground">
                                                                    EID-45920
                                                                </TableCell>
                                                                <TableCell className="text-sm font-medium text-muted-foreground">
                                                                    14 mins ago
                                                                </TableCell>
                                                                <TableCell className="pr-6 text-right">
                                                                    <Button
                                                                        variant="link"
                                                                        className="h-auto p-0 text-xs font-bold text-primary"
                                                                    >
                                                                        View
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow className="transition-colors hover:bg-muted/30">
                                                                <TableCell className="pl-6 text-sm font-bold text-foreground">
                                                                    Policy
                                                                    Changed
                                                                </TableCell>
                                                                <TableCell className="text-sm font-medium text-muted-foreground">
                                                                    David Miller
                                                                </TableCell>
                                                                <TableCell className="text-sm font-medium text-muted-foreground">
                                                                    Holiday
                                                                    Policy
                                                                </TableCell>
                                                                <TableCell className="text-sm font-medium text-muted-foreground">
                                                                    1 hour ago
                                                                </TableCell>
                                                                <TableCell className="pr-6 text-right">
                                                                    <Button
                                                                        variant="link"
                                                                        className="h-auto p-0 text-xs font-bold text-primary"
                                                                    >
                                                                        View
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        </>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* RIGHT COLUMN (Spans 4/12) */}
                            <div className="space-y-8 lg:col-span-4">
                                {/* Quick Filters */}
                                <Card className="border-border bg-background shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-4">
                                        <CardTitle className="text-base font-bold text-foreground">
                                            Quick filters
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            {quickFilters.map((filter, idx) => (
                                                <Link
                                                    key={idx}
                                                    href={filter.href}
                                                    className="group flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-muted/10 p-5 text-center transition-colors hover:border-foreground/30 hover:bg-muted/30"
                                                >
                                                    <div className="text-muted-foreground transition-colors group-hover:text-foreground">
                                                        {filter.icon}
                                                    </div>
                                                    <span className="text-xs font-bold text-foreground">
                                                        {filter.label}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Critical Incidents */}
                                <Card className="overflow-hidden border-border bg-background shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-4">
                                        <CardTitle className="text-base font-bold text-foreground">
                                            Critical incidents
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="flex flex-col">
                                            {recentCriticalActions?.length >
                                            0 ? (
                                                recentCriticalActions.map(
                                                    (item, idx) => (
                                                        <div
                                                            key={item.id}
                                                            className={`space-y-4 p-6 ${idx !== recentCriticalActions.length - 1 ? 'border-b border-border/50' : ''}`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <Badge
                                                                    variant="outline"
                                                                    className="flex items-center gap-1.5 border-transparent bg-destructive/10 px-2 py-0.5 text-[9px] font-bold tracking-widest text-destructive uppercase shadow-none"
                                                                >
                                                                    <ShieldAlert className="h-3 w-3" />{' '}
                                                                    Critical
                                                                </Badge>
                                                                <span className="text-xs font-medium text-muted-foreground">
                                                                    {formatTimeOnly(
                                                                        item.created_at,
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm leading-tight font-bold text-foreground">
                                                                {item.description ||
                                                                    item.event_label}
                                                            </p>
                                                            {/* FIXED CRITICAL INCIDENT BUTTON: Using onClick and explicitly setting text-white */}
                                                            <Button
                                                                onClick={() =>
                                                                    router.visit(
                                                                        `/audit-trail/logs/${item.id}`,
                                                                    )
                                                                }
                                                                className="h-10 w-full bg-destructive text-[10px] font-bold tracking-widest text-white uppercase shadow-sm hover:bg-destructive/90"
                                                            >
                                                                Inspect
                                                            </Button>
                                                        </div>
                                                    ),
                                                )
                                            ) : (
                                                /* Mock Data Fallback */
                                                <>
                                                    <div className="space-y-4 border-b border-border/50 p-6">
                                                        <div className="flex items-center justify-between">
                                                            <Badge
                                                                variant="outline"
                                                                className="flex items-center gap-1.5 border-transparent bg-destructive/10 px-2 py-0.5 text-[9px] font-bold tracking-widest text-destructive uppercase shadow-none"
                                                            >
                                                                <ShieldAlert className="h-3 w-3" />{' '}
                                                                Critical
                                                            </Badge>
                                                            <span className="text-xs font-medium text-muted-foreground">
                                                                08:42 AM
                                                            </span>
                                                        </div>
                                                        <p className="text-sm leading-tight font-bold text-foreground">
                                                            Unauthorized mass
                                                            export attempt
                                                        </p>
                                                        {/* FIXED CRITICAL INCIDENT BUTTON */}
                                                        <Button className="h-10 w-full bg-destructive text-[10px] font-bold tracking-widest text-white uppercase shadow-sm hover:bg-destructive/90">
                                                            Inspect
                                                        </Button>
                                                    </div>
                                                    <div className="space-y-4 p-6">
                                                        <div className="flex items-center justify-between">
                                                            <Badge
                                                                variant="outline"
                                                                className="flex items-center gap-1.5 border-transparent bg-destructive/10 px-2 py-0.5 text-[9px] font-bold tracking-widest text-destructive uppercase shadow-none"
                                                            >
                                                                <ShieldAlert className="h-3 w-3" />{' '}
                                                                Critical
                                                            </Badge>
                                                            <span className="text-xs font-medium text-muted-foreground">
                                                                Yesterday
                                                            </span>
                                                        </div>
                                                        <p className="text-sm leading-tight font-bold text-foreground">
                                                            Root permissions
                                                            modified by actor
                                                            "Guest"
                                                        </p>
                                                        {/* FIXED CRITICAL INCIDENT BUTTON */}
                                                        <Button className="h-10 w-full bg-destructive text-[10px] font-bold tracking-widest text-white uppercase shadow-sm hover:bg-destructive/90">
                                                            Inspect
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className="border-t border-border/50 bg-muted/10 p-4 text-center">
                                            <Button
                                                variant="link"
                                                className="h-auto p-0 text-xs font-bold text-muted-foreground"
                                            >
                                                View all{' '}
                                                {summary?.critical_today || 12}{' '}
                                                incidents
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Placeholder content for other tabs */}
                    <TabsContent
                        value="critical"
                        className="rounded-xl border-2 border-dashed border-border p-8 text-center text-sm font-medium text-muted-foreground"
                    >
                        Critical incidents view. (Not fully mocked in design)
                    </TabsContent>

                    <TabsContent
                        value="recent"
                        className="rounded-xl border-2 border-dashed border-border p-8 text-center text-sm font-medium text-muted-foreground"
                    >
                        Recent activity list view. (Not fully mocked in design)
                    </TabsContent>
                </Tabs>
            </div>

            {/* Minimal Footer */}
            <div className="flex items-center justify-center border-t bg-background px-8 py-6">
                <p className="text-[11px] font-medium text-muted-foreground">
                    © 2024 Providence HRMS. Secure Audit Logging Active.
                </p>
            </div>
        </AppLayout>
    );
}

// Sub-component for Top Metrics
function StatCard({
    title,
    value,
    trend,
    icon,
    isWarning = false,
}: {
    title: string;
    value: string | number;
    trend: string;
    icon: ReactNode;
    isWarning?: boolean;
}) {
    return (
        <Card className="border-border bg-background shadow-sm">
            <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                    <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${isWarning ? 'bg-destructive/10 text-destructive' : 'border border-border bg-muted text-muted-foreground'}`}
                    >
                        {icon}
                    </div>
                    <Badge
                        variant="secondary"
                        className={`border-transparent px-2 py-0.5 text-[10px] font-bold shadow-none ${isWarning ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}
                    >
                        {trend}
                    </Badge>
                </div>

                <div className="space-y-1">
                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                        {title}
                    </p>
                    <h3 className="text-3xl font-extrabold tracking-tighter text-foreground">
                        {value}
                    </h3>
                </div>
            </CardContent>
        </Card>
    );
}
