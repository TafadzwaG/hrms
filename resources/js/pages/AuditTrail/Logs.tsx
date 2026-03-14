import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { useAuthorization } from '@/lib/authorization';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Download, ExternalLink, Filter, RotateCcw, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type LogItem = {
    id: number;
    event: string;
    event_label: string;
    module: string;
    module_label: string;
    category: string | null;
    description: string | null;
    actor_name: string | null;
    auditable_label: string | null;
    auditable_type: string | null;
    auditable_type_label: string | null;
    route_name: string | null;
    request_method: string | null;
    created_at: string | null;
    is_critical: boolean;
    batch_id: string | null;
    target_url: string | null;
};

type PaginatedLogs = {
    data: LogItem[];
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
};

type Filters = {
    search?: string;
    actor?: string;
    event?: string;
    module?: string;
    category?: string;
    auditable_type?: string;
    route_name?: string;
    from?: string;
    to?: string;
};

type OptionGroup = {
    modules: string[];
    events: string[];
    categories: string[];
    auditable_types: Array<{ value: string; label: string }>;
    routes: string[];
};

export default function AuditTrailLogs() {
    const { logs, filters, options, summary } = usePage<{
        logs: PaginatedLogs;
        filters: Filters;
        options: OptionGroup;
        summary: { filtered_total: number; critical_filtered: number };
    }>().props;
    const { can } = useAuthorization();
    const [state, setState] = useState({
        search: filters.search ?? '',
        actor: filters.actor ?? '',
        event: filters.event ?? 'all',
        module: filters.module ?? 'all',
        category: filters.category ?? 'all',
        auditable_type: filters.auditable_type ?? 'all',
        route_name: filters.route_name ?? '',
        from: filters.from ?? '',
        to: filters.to ?? '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setLoading(true);
            router.get(
                '/audit-trail/logs',
                {
                    search: state.search || undefined,
                    actor: state.actor || undefined,
                    event: state.event === 'all' ? undefined : state.event,
                    module: state.module === 'all' ? undefined : state.module,
                    category: state.category === 'all' ? undefined : state.category,
                    auditable_type: state.auditable_type === 'all' ? undefined : state.auditable_type,
                    route_name: state.route_name || undefined,
                    from: state.from || undefined,
                    to: state.to || undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    onFinish: () => setLoading(false),
                },
            );
        }, 250);

        return () => window.clearTimeout(timer);
    }, [state]);

    const exportHref = useMemo(() => {
        const params = new URLSearchParams();

        Object.entries({
            search: state.search,
            actor: state.actor,
            event: state.event === 'all' ? '' : state.event,
            module: state.module === 'all' ? '' : state.module,
            category: state.category === 'all' ? '' : state.category,
            auditable_type: state.auditable_type === 'all' ? '' : state.auditable_type,
            route_name: state.route_name,
            from: state.from,
            to: state.to,
        }).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            }
        });

        const query = params.toString();

        return query ? `/audit-trail/logs/export?${query}` : '/audit-trail/logs/export';
    }, [state]);

    const resetFilters = () => {
        setState({
            search: '',
            actor: '',
            event: 'all',
            module: 'all',
            category: 'all',
            auditable_type: 'all',
            route_name: '',
            from: '',
            to: '',
        });
    };

    const goToPage = (page: number) => {
        router.get('/audit-trail/logs', { ...filters, page }, { preserveState: true, preserveScroll: true });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Control Center', href: '/control-center' },
                { title: 'Audit Trail', href: '/audit-trail' },
                { title: 'Logs', href: '/audit-trail/logs' },
            ]}
        >
            <Head title="Audit Logs" />

            <div className="space-y-6 p-4 md:p-6 lg:p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Audit log explorer</h1>
                        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                            Search and filter audit events by actor, module, event type, route, target record, and date range.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button asChild variant="outline" className="rounded-xl">
                            <Link href="/audit-trail">Back to overview</Link>
                        </Button>
                        {can('audit.export') ? (
                            <Button asChild className="rounded-xl">
                                <Link href={exportHref}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Export filtered CSV
                                </Link>
                            </Button>
                        ) : null}
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard label="Filtered events" value={summary.filtered_total} />
                    <SummaryCard label="Critical in result" value={summary.critical_filtered} />
                    <SummaryCard label="Current page" value={logs.current_page} />
                    <SummaryCard label="Per page" value={logs.per_page} />
                </div>

                <Card className="rounded-2xl border-border shadow-sm">
                    <CardHeader>
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                    Filters
                                </CardTitle>
                                <CardDescription>Narrow the audit stream to the exact activity you need.</CardDescription>
                            </div>
                            <Button variant="outline" className="rounded-xl" onClick={resetFilters}>
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Reset
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Search</label>
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input value={state.search} onChange={(event) => setState((current) => ({ ...current, search: event.target.value }))} className="rounded-xl pl-9" placeholder="Description, target, actor..." />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Actor</label>
                            <Input value={state.actor} onChange={(event) => setState((current) => ({ ...current, actor: event.target.value }))} className="rounded-xl" placeholder="User name or email" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Event</label>
                            <Select value={state.event} onValueChange={(value) => setState((current) => ({ ...current, event: value }))}>
                                <SelectTrigger className="rounded-xl">
                                    <SelectValue placeholder="All events" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All events</SelectItem>
                                    {options.events.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {headline(option)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Module</label>
                            <Select value={state.module} onValueChange={(value) => setState((current) => ({ ...current, module: value }))}>
                                <SelectTrigger className="rounded-xl">
                                    <SelectValue placeholder="All modules" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All modules</SelectItem>
                                    {options.modules.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {headline(option)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Category</label>
                            <Select value={state.category} onValueChange={(value) => setState((current) => ({ ...current, category: value }))}>
                                <SelectTrigger className="rounded-xl">
                                    <SelectValue placeholder="All categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All categories</SelectItem>
                                    {options.categories.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {headline(option)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Target type</label>
                            <Select value={state.auditable_type} onValueChange={(value) => setState((current) => ({ ...current, auditable_type: value }))}>
                                <SelectTrigger className="rounded-xl">
                                    <SelectValue placeholder="All target types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All target types</SelectItem>
                                    {options.auditable_types.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Route name</label>
                            <Input value={state.route_name} onChange={(event) => setState((current) => ({ ...current, route_name: event.target.value }))} className="rounded-xl" placeholder="roles.update, login, ..." />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">From</label>
                                <Input type="date" value={state.from} onChange={(event) => setState((current) => ({ ...current, from: event.target.value }))} className="rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">To</label>
                                <Input type="date" value={state.to} onChange={(event) => setState((current) => ({ ...current, to: event.target.value }))} className="rounded-xl" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-border shadow-sm">
                    <CardHeader>
                        <CardTitle>Audit events</CardTitle>
                        <CardDescription>{logs.total} events match the current criteria.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Event</TableHead>
                                    <TableHead>Actor</TableHead>
                                    <TableHead>Target</TableHead>
                                    <TableHead>Route</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? Array.from({ length: 6 }).map((_, index) => (
                                    <TableRow key={`loading-${index}`}>
                                        <TableCell colSpan={6}>
                                            <Skeleton className="h-10 w-full rounded-xl" />
                                        </TableCell>
                                    </TableRow>
                                )) : logs.data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="space-y-1 py-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Badge variant="outline" className="rounded-full px-2.5 py-1 text-xs">
                                                        {item.event_label}
                                                    </Badge>
                                                    <Badge className={`rounded-full ${item.is_critical ? 'bg-destructive/10 text-destructive hover:bg-destructive/10' : 'bg-primary/10 text-primary hover:bg-primary/10'}`}>
                                                        {item.module_label}
                                                    </Badge>
                                                </div>
                                                <div className="text-sm text-foreground">{item.description || `${item.event_label} recorded`}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{item.actor_name || 'System'}</TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="text-sm text-foreground">{item.auditable_label || item.auditable_type_label || 'System event'}</div>
                                                {item.target_url ? (
                                                    <Link href={item.target_url} className="inline-flex items-center gap-1 text-xs text-primary">
                                                        Open record
                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                    </Link>
                                                ) : null}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{item.route_name || 'No route'}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{formatDateTime(item.created_at)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild variant="ghost" size="sm">
                                                <Link href={`/audit-trail/logs/${item.id}`}>Inspect</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {!loading && logs.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                                            No audit events match the current filters.
                                        </TableCell>
                                    </TableRow>
                                ) : null}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div>
                        Page {logs.current_page} of {logs.last_page}
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" size="sm" className="rounded-xl" disabled={logs.current_page <= 1} onClick={() => goToPage(logs.current_page - 1)}>
                            Previous
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-xl" disabled={logs.current_page >= logs.last_page} onClick={() => goToPage(logs.current_page + 1)}>
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
    return (
        <Card className="rounded-2xl border-border shadow-sm">
            <CardContent className="p-5">
                <div className="text-sm font-medium text-muted-foreground">{label}</div>
                <div className="mt-2 text-3xl font-semibold text-foreground">{value}</div>
            </CardContent>
        </Card>
    );
}

function headline(value: string): string {
    return value
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatDateTime(value: string | null): string {
    return value ? new Date(value).toLocaleString() : 'No timestamp';
}
