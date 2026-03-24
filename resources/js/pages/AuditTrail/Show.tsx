import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity,
    ArrowLeft,
    ExternalLink,
    Info,
    Link2,
    Tag,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import moment from 'moment';

type LogDetail = {
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
    actor: {
        type: string | null;
        id: number | null;
        name: string | null;
        url: string | null;
    };
    auditable: {
        type: string | null;
        id: number | null;
        label: string | null;
        url: string | null;
    };
    old_values: Record<string, unknown>;
    new_values: Record<string, unknown>;
    metadata: Record<string, unknown>;
    request: {
        method: string | null;
        route_name: string | null;
        url: string | null;
        ip_address: string | null;
        user_agent: string | null;
    };
    tags: string[];
};

type BatchItem = {
    id: number;
    event_label: string;
    module_label: string;
    actor_name: string | null;
    auditable_label: string | null;
    created_at: string | null;
};

export default function AuditTrailShow() {
    const { log, relatedBatch } = usePage<{
        log: LogDetail;
        relatedBatch: BatchItem[];
    }>().props;

    const getInitials = (name: string) => {
        if (!name) return '??';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Control Center', href: '/control-center' },
                { title: 'Audit Trail', href: '/audit-trail' },
                { title: 'Logs', href: '/audit-trail/logs' },
                { title: `Entry #AUD-${log.id}`, href: '#' },
            ]}
        >
            <Head title={`Audit Entry #AUD-${log.id}`} />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-8 bg-muted/10 p-4 md:p-6 lg:p-8 xl:p-12">
                {/* Header Section */}
                <div className="flex w-full flex-col gap-6 border-b border-border/50 pb-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <div className="mb-3 flex items-center gap-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                            <span className="cursor-pointer transition-colors hover:text-foreground">
                                Audit Logs
                            </span>
                            <span>&rsaquo;</span>
                            <span className="text-foreground">
                                Entry #AUD-{log.id}
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                                Audit entry #AUD-{log.id}
                            </h1>
                            <Badge
                                variant="outline"
                                className={`border-transparent px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase shadow-none ${log.is_critical ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}
                            >
                                {log.event_label}
                            </Badge>
                            <Badge
                                variant="secondary"
                                className="border border-border/50 bg-muted px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-foreground uppercase shadow-none"
                            >
                                {log.module_label}
                            </Badge>
                            {log.category && (
                                <span className="text-sm font-medium text-muted-foreground">
                                    {headline(log.category)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                        <Button
                            asChild
                            variant="outline"
                            className="h-11 border-border bg-background px-6 font-bold shadow-sm"
                        >
                            <Link href="/audit-trail/logs">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to
                                logs
                            </Link>
                        </Button>
                        {log.auditable.url && (
                            <Button
                                asChild
                                className="h-11 bg-foreground px-6 font-bold text-background shadow-sm hover:bg-foreground/90"
                            >
                                <Link href={log.auditable.url}>
                                    <ExternalLink className="mr-2 h-4 w-4" />{' '}
                                    Open affected record
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Main Split Layout */}
                <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12 xl:gap-12">
                    {/* LEFT COLUMN: Context & Metadata (Spans 5/12) */}
                    <div className="space-y-6 lg:col-span-5">
                        {/* Event Context Card */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                    <Info className="h-4 w-4" /> Event Context
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-8 p-6">
                                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                                    {/* Actor */}
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Actor
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border border-border shadow-sm">
                                                <AvatarFallback className="bg-foreground text-xs font-bold text-background">
                                                    {getInitials(
                                                        log.actor.name || 'Sys',
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm leading-none font-bold text-foreground">
                                                    {log.actor.name || 'System'}
                                                </p>
                                                <p className="mt-1 max-w-[150px] truncate text-xs font-medium text-muted-foreground">
                                                    {log.actor.url ||
                                                        'Automated Action'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Target */}
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Target
                                        </p>
                                        <div>
                                            <p className="text-sm leading-none font-bold text-foreground">
                                                {log.auditable_label ||
                                                    log.auditable_type_label ||
                                                    'System Event'}
                                            </p>
                                            <p className="mt-1 max-w-[150px] truncate text-xs font-medium text-muted-foreground">
                                                {log.auditable.type
                                                    ? `${log.auditable.type}:${log.auditable.id}`
                                                    : 'Global'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Timestamp */}
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Timestamp
                                        </p>
                                        <p className="text-sm font-medium text-foreground">
                                            {formatDateTime(log.created_at)}
                                        </p>
                                    </div>

                                    {/* Route */}
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Route
                                        </p>
                                        <Badge
                                            variant="secondary"
                                            className="bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground shadow-none"
                                        >
                                            {log.request.route_name ||
                                                'CLI/Background'}
                                        </Badge>
                                    </div>

                                    {/* Batch ID */}
                                    <div className="space-y-2 sm:col-span-2">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Batch ID
                                        </p>
                                        <p className="rounded-md border border-border/50 bg-muted/20 p-2 font-mono text-xs break-all text-muted-foreground">
                                            {log.batch_id ||
                                                'Standalone Operation'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Associated Tags */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                    <Tag className="h-4 w-4" /> Associated Tags
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-wrap items-center gap-2 p-6">
                                {log.tags.length > 0 ? (
                                    log.tags.map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="border-border/50 bg-muted px-3 font-bold text-foreground shadow-none"
                                        >
                                            {tag}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-sm text-muted-foreground">
                                        No tags applied.
                                    </span>
                                )}
                                <Button
                                    variant="link"
                                    className="ml-2 h-auto p-0 text-xs font-bold text-muted-foreground"
                                >
                                    + Add tag
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Related Batch Activity */}
                        {relatedBatch.length > 0 && (
                            <Card className="border-border bg-background shadow-sm">
                                <CardHeader className="border-b border-border/50 pb-4">
                                    <CardTitle className="flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                        <Activity className="h-4 w-4" /> Related
                                        Batch Activity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="flex flex-col">
                                        {relatedBatch.map((item, idx) => (
                                            <div
                                                key={item.id}
                                                className={`flex items-center justify-between p-4 transition-colors hover:bg-muted/10 ${idx !== relatedBatch.length - 1 ? 'border-b border-border/50' : ''}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`h-1.5 w-1.5 rounded-full ${idx === 0 ? 'bg-primary' : 'bg-muted-foreground'}`}
                                                    />
                                                    <span className="text-sm font-bold text-foreground">
                                                        {item.event_label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                                                    <span>
                                                        {item.actor_name ||
                                                            'System'}
                                                    </span>
                                                    <span className="font-mono">
                                                        {formatTimeOnly(
                                                            item.created_at,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t border-border/50 bg-muted/5 p-3 text-center">
                                        <Button
                                            variant="link"
                                            className="h-auto p-0 text-xs font-medium text-muted-foreground"
                                        >
                                            View all {relatedBatch.length} batch
                                            items
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Code Diffs & Tabs (Spans 7/12) */}
                    <div className="lg:col-span-7">
                        <Tabs defaultValue="changes" className="w-full">
                            <TabsList className="mb-6 grid w-full grid-cols-3 rounded-xl border border-border bg-muted/20 p-1 shadow-sm sm:w-[400px]">
                                <TabsTrigger
                                    value="changes"
                                    className="rounded-lg text-xs font-bold tracking-widest uppercase data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                                >
                                    Changes
                                </TabsTrigger>
                                <TabsTrigger
                                    value="request"
                                    className="rounded-lg text-xs font-bold tracking-widest uppercase data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                                >
                                    Request
                                </TabsTrigger>
                                <TabsTrigger
                                    value="metadata"
                                    className="rounded-lg text-xs font-bold tracking-widest uppercase data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                                >
                                    Metadata
                                </TabsTrigger>
                            </TabsList>

                            {/* Changes Tab */}
                            <TabsContent
                                value="changes"
                                className="mt-0 space-y-8 focus-visible:ring-0"
                            >
                                {/* Before Block */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                            Before
                                        </p>
                                        {Object.keys(log.old_values).length >
                                            0 && (
                                            <p className="font-mono text-xs font-medium text-destructive lowercase">
                                                -{' '}
                                                {
                                                    Object.keys(log.old_values)
                                                        .length
                                                }{' '}
                                                keys removed
                                            </p>
                                        )}
                                    </div>
                                    <div className="rounded-xl border border-border bg-muted/10 p-6 shadow-inner">
                                        {Object.keys(log.old_values).length >
                                        0 ? (
                                            <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-destructive">
                                                {JSON.stringify(
                                                    log.old_values,
                                                    null,
                                                    2,
                                                )}
                                            </pre>
                                        ) : (
                                            <div className="text-sm font-medium text-muted-foreground">
                                                No prior values recorded
                                                (Creation event).
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* After Block */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                            After
                                        </p>
                                        {Object.keys(log.new_values).length >
                                            0 && (
                                            <p className="font-mono text-xs font-medium text-emerald-600 lowercase">
                                                +{' '}
                                                {
                                                    Object.keys(log.new_values)
                                                        .length
                                                }{' '}
                                                keys added
                                            </p>
                                        )}
                                    </div>
                                    <div className="rounded-xl border border-border bg-muted/10 p-6 shadow-inner">
                                        {Object.keys(log.new_values).length >
                                        0 ? (
                                            <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-emerald-600">
                                                {JSON.stringify(
                                                    log.new_values,
                                                    null,
                                                    2,
                                                )}
                                            </pre>
                                        ) : (
                                            <div className="text-sm font-medium text-muted-foreground">
                                                No new values recorded (Deletion
                                                event).
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Request Tab */}
                            <TabsContent
                                value="request"
                                className="mt-0 focus-visible:ring-0"
                            >
                                <Card className="border-border bg-background shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-4">
                                        <CardTitle className="text-sm font-bold tracking-widest text-foreground uppercase">
                                            Request Context
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6 p-4 md:p-6">
                                        <InfoRow
                                            label="HTTP Method"
                                            value={log.request.method || 'N/A'}
                                        />
                                        <InfoRow
                                            label="Endpoint URL"
                                            value={
                                                log.request.url ||
                                                'No request URL'
                                            }
                                        />
                                        <InfoRow
                                            label="IP Address"
                                            value={
                                                log.request.ip_address ||
                                                'Unavailable'
                                            }
                                        />
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                User Agent
                                            </p>
                                            <div className="rounded-lg border border-border bg-muted/10 p-4 font-mono text-sm break-words text-foreground">
                                                {log.request.user_agent ||
                                                    'Unavailable'}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Metadata Tab */}
                            <TabsContent
                                value="metadata"
                                className="mt-0 focus-visible:ring-0"
                            >
                                <Card className="border-border bg-background shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-4">
                                        <CardTitle className="text-sm font-bold tracking-widest text-foreground uppercase">
                                            Supplemental Metadata
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 md:p-8">
                                        <ScrollArea className="h-[500px] w-full rounded-xl border border-border bg-muted/10 p-6 shadow-inner">
                                            {Object.keys(log.metadata).length >
                                            0 ? (
                                                <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                                                    {JSON.stringify(
                                                        log.metadata,
                                                        null,
                                                        2,
                                                    )}
                                                </pre>
                                            ) : (
                                                <div className="text-sm font-medium text-muted-foreground">
                                                    No supplemental metadata
                                                    captured for this event.
                                                </div>
                                            )}
                                        </ScrollArea>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// --- Sub Components & Utilities ---

function InfoRow({
    label,
    value,
    href,
}: {
    label: string;
    value: string;
    href?: string | null;
}) {
    return (
        <div className="space-y-1.5">
            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                {label}
            </p>
            {href ? (
                <Link
                    href={href}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
                >
                    {value}
                    <Link2 className="h-3.5 w-3.5" />
                </Link>
            ) : (
                <p className="text-sm font-medium text-foreground">{value}</p>
            )}
        </div>
    );
}

function headline(value: string): string {
    return value
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatDateTime(value: string | null): string {
    if (!value) return 'No timestamp';
    return moment(value)
        .utc()
        .format('MMMM DD, YYYY [at] HH:mm:ss.SSS [(UTC)]');
}

function formatTimeOnly(value: string | null): string {
    if (!value) return '--:--:--';
    return moment(value).utc().format('HH:mm:ss');
}
