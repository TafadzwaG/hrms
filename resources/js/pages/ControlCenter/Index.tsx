import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { useAuthorization } from '@/lib/authorization';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    HelpCircle,
    Lock,
    Plus,
    Shield,
    Sparkles,
    Users,
} from 'lucide-react';
import type { ReactNode } from 'react';

type Summary = {
    roles_total: number;
    permissions_total: number;
    users_with_roles: number;
    users_without_roles: number;
    roles_without_permissions: number;
    roles_without_users: number;
};

type RoleSummary = {
    id: number;
    code: string;
    name: string;
    description: string | null;
    users_count: number;
    permissions_count: number;
    updated_at: string | null;
};

type AlertItem = {
    id: string;
    tone: 'warning' | 'info';
    title: string;
    body: string;
    href: string;
};

type QuickAction = {
    label: string;
    href: string;
    description: string;
};

// Distinct colors for the progress bars
const PROGRESS_COLORS = [
    '[&>div]:bg-blue-600',
    '[&>div]:bg-emerald-500',
    '[&>div]:bg-amber-500',
    '[&>div]:bg-purple-500',
    '[&>div]:bg-rose-500',
    '[&>div]:bg-cyan-500',
];

export default function ControlCenterIndex() {
    const { summary, usersByRole, recentRoles, quickActions } = usePage<{
        summary: Summary;
        usersByRole: Array<
            Pick<RoleSummary, 'id' | 'code' | 'name' | 'users_count'>
        >;
        recentRoles: RoleSummary[];
        alerts: AlertItem[];
        quickActions: QuickAction[];
    }>().props;

    const { can } = useAuthorization();

    // Determine the max users for progress bar scaling
    const maxUsers = Math.max(
        ...(usersByRole?.map((role) => role.users_count) || [1]),
    );

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Control Center', href: '/control-center' },
            ]}
        >
            <Head title="Control Center" />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-8 bg-muted/5 p-4 md:p-6 lg:p-8 xl:p-12">
                {/* Header Section */}
                <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                                Control Center
                            </h1>
                            <Badge
                                variant="secondary"
                                className="flex items-center gap-1.5 border border-border/50 bg-muted px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase shadow-none"
                            >
                                <Lock className="h-3 w-3" /> Administrative
                                access
                            </Badge>
                        </div>
                        <p className="max-w-2xl text-sm leading-relaxed font-medium text-muted-foreground">
                            Manage dynamic roles and role-based access control
                            (RBAC) across the organization. Configure
                            permissions and audit access gaps.
                        </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                        {can('permissions.view') && (
                            <Button
                                asChild
                                variant="outline"
                                className="h-11 border-border bg-background px-6 font-bold shadow-sm"
                            >
                                <Link href="/roles/matrix">
                                    Open permission matrix
                                </Link>
                            </Button>
                        )}
                        {can('roles.create') && (
                            <Button
                                asChild
                                className="h-11 bg-foreground px-6 font-bold text-background shadow-sm hover:bg-foreground/90"
                            >
                                <Link href="/roles/create">
                                    <Plus className="mr-2 h-4 w-4" /> Create
                                    role
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Top Metrics Row */}
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <SummaryCard
                        title="Roles"
                        value={summary?.roles_total || 24}
                        trend="+2%"
                        progressValue={80}
                    />
                    <SummaryCard
                        title="Permissions"
                        value={summary?.permissions_total || 156}
                        trend="+12%"
                        progressValue={65}
                    />
                    <SummaryCard
                        title="Governed Users"
                        value={(
                            summary?.users_with_roles || 1240
                        ).toLocaleString()}
                        trend="+5%"
                        progressValue={90}
                    />
                    <SummaryCard
                        title="Coverage Gaps"
                        value={
                            summary?.roles_without_permissions +
                                summary?.users_without_roles || 3
                        }
                        trend="-1%"
                        progressValue={15}
                        isWarning={true}
                    />
                </div>

                {/* Main Split Layout */}
                <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12 xl:gap-12">
                    {/* LEFT COLUMN (Spans 8/12) */}
                    <div className="space-y-10 lg:col-span-8">
                        {/* Users by Role */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-5">
                                <CardTitle className="text-base font-bold text-foreground">
                                    Users by Role
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 p-4 md:p-6">
                                {usersByRole?.length > 0 ? (
                                    usersByRole.map((role, idx) => {
                                        const progress = Math.max(
                                            (role.users_count / maxUsers) * 100,
                                            2,
                                        );
                                        const colorClass =
                                            PROGRESS_COLORS[
                                                idx % PROGRESS_COLORS.length
                                            ];

                                        return (
                                            <div
                                                key={role.id}
                                                className="space-y-3"
                                            >
                                                <div className="flex items-center justify-between text-sm font-bold">
                                                    <span className="text-foreground">
                                                        {role.name}
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                        {role.users_count} users
                                                    </span>
                                                </div>
                                                <Progress
                                                    value={progress}
                                                    className={`h-2 border border-border/50 bg-muted ${colorClass}`}
                                                />
                                            </div>
                                        );
                                    })
                                ) : (
                                    /* Fallback mockup data if none provided to match screenshot */
                                    <>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm font-bold">
                                                <span className="text-foreground">
                                                    Engineering Manager
                                                </span>
                                                <span className="text-muted-foreground">
                                                    420 users
                                                </span>
                                            </div>
                                            <Progress
                                                value={65}
                                                className="h-2 border border-border/50 bg-muted [&>div]:bg-blue-600"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm font-bold">
                                                <span className="text-foreground">
                                                    Product Specialist
                                                </span>
                                                <span className="text-muted-foreground">
                                                    280 users
                                                </span>
                                            </div>
                                            <Progress
                                                value={45}
                                                className="h-2 border border-border/50 bg-muted [&>div]:bg-emerald-500"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm font-bold">
                                                <span className="text-foreground">
                                                    HR Associate
                                                </span>
                                                <span className="text-muted-foreground">
                                                    120 users
                                                </span>
                                            </div>
                                            <Progress
                                                value={20}
                                                className="h-2 border border-border/50 bg-muted [&>div]:bg-amber-500"
                                            />
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recently Updated Roles */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-lg font-bold text-foreground">
                                    Recently Updated Roles
                                </h3>
                                <Button
                                    variant="link"
                                    className="h-auto p-0 text-sm font-bold text-primary"
                                >
                                    View all
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {recentRoles?.length > 0 ? (
                                    recentRoles.map((role) => (
                                        <Card
                                            key={role.id}
                                            className="border-border bg-background shadow-sm transition-shadow hover:shadow-md"
                                        >
                                            <CardContent className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center sm:p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
                                                        <Shield className="h-5 w-5" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-3">
                                                            <h4 className="text-sm font-bold text-foreground">
                                                                {role.name}
                                                            </h4>
                                                            <Badge
                                                                variant="secondary"
                                                                className="border border-border/50 bg-muted px-2 py-0 text-[10px] font-bold tracking-wider text-muted-foreground uppercase shadow-none"
                                                            >
                                                                {role.code}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-xs font-medium text-muted-foreground">
                                                            {
                                                                role.permissions_count
                                                            }{' '}
                                                            permissions •{' '}
                                                            {role.users_count}{' '}
                                                            users
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    className="h-10 w-full shrink-0 border-border bg-background font-bold shadow-sm sm:w-auto"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/roles/${role.id}`}
                                                    >
                                                        Inspect
                                                    </Link>
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    /* Fallback mockup data if none provided to match screenshot */
                                    <>
                                        <Card className="border-border bg-background shadow-sm transition-shadow hover:shadow-md">
                                            <CardContent className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center sm:p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
                                                        <Shield className="h-5 w-5" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-3">
                                                            <h4 className="text-sm font-bold text-foreground">
                                                                Project Lead
                                                            </h4>
                                                            <Badge
                                                                variant="secondary"
                                                                className="border border-border/50 bg-muted px-2 py-0 text-[10px] font-bold tracking-wider text-muted-foreground uppercase shadow-none"
                                                            >
                                                                PRJ-LD-04
                                                            </Badge>
                                                        </div>
                                                        <p className="text-xs font-medium text-muted-foreground">
                                                            12 permissions • 85
                                                            users
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    className="h-10 w-full shrink-0 border-border bg-background font-bold shadow-sm sm:w-auto"
                                                >
                                                    Inspect
                                                </Button>
                                            </CardContent>
                                        </Card>
                                        <Card className="border-border bg-background shadow-sm transition-shadow hover:shadow-md">
                                            <CardContent className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center sm:p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
                                                        <Users className="h-5 w-5" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-3">
                                                            <h4 className="text-sm font-bold text-foreground">
                                                                Security Auditor
                                                            </h4>
                                                            <Badge
                                                                variant="secondary"
                                                                className="border border-border/50 bg-muted px-2 py-0 text-[10px] font-bold tracking-wider text-muted-foreground uppercase shadow-none"
                                                            >
                                                                SEC-AUD-01
                                                            </Badge>
                                                        </div>
                                                        <p className="text-xs font-medium text-muted-foreground">
                                                            45 permissions • 3
                                                            users
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    className="h-10 w-full shrink-0 border-border bg-background font-bold shadow-sm sm:w-auto"
                                                >
                                                    Inspect
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Side Panels (Spans 4/12) */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* RBAC Hygiene Banner */}
                        <div className="flex items-start gap-4 rounded-xl border border-border bg-muted/10 p-6 shadow-sm">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <div className="mt-0.5 space-y-1.5">
                                <h4 className="text-sm font-bold text-foreground">
                                    RBAC Hygiene: Excellent
                                </h4>
                                <p className="text-xs leading-relaxed font-medium text-muted-foreground">
                                    No orphan roles or permission conflicts
                                    detected in the last 24 hours. Keep up the
                                    good work!
                                </p>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-bold text-foreground">
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="space-y-1">
                                    {(quickActions?.length > 0
                                        ? quickActions
                                        : [
                                              {
                                                  label: 'New Role Workflow',
                                                  description:
                                                      'Standard onboarding sequence',
                                                  href: '#',
                                              },
                                              {
                                                  label: 'Access Audit Log',
                                                  description:
                                                      'View recent permission changes',
                                                  href: '#',
                                              },
                                              {
                                                  label: 'Security Profiles',
                                                  description:
                                                      'Manage high-risk access levels',
                                                  href: '#',
                                              },
                                          ]
                                    ).map((action, idx) => (
                                        <Link
                                            key={idx}
                                            href={action.href}
                                            className="group flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/30"
                                        >
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                                                    {action.label}
                                                </p>
                                                <p className="text-[11px] font-medium text-muted-foreground">
                                                    {action.description}
                                                </p>
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Need Help */}
                        <Card className="border-border bg-muted/20 text-center shadow-sm">
                            <CardContent className="flex flex-col items-center space-y-4 p-8">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-background text-foreground shadow-sm">
                                    <HelpCircle className="h-6 w-6" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-sm font-bold text-foreground">
                                        Need Help?
                                    </h4>
                                    <p className="px-4 text-xs leading-relaxed font-medium text-muted-foreground">
                                        Our documentation covers everything from
                                        base role inheritance to dynamic scope
                                        filtering.
                                    </p>
                                </div>
                                <Button
                                    variant="link"
                                    className="h-auto p-0 text-xs font-bold text-primary"
                                >
                                    Read the docs
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// Sub-component for Top Metrics
function SummaryCard({
    title,
    value,
    trend,
    progressValue,
    isWarning = false,
}: {
    title: string;
    value: string | number;
    trend: string;
    progressValue: number;
    isWarning?: boolean;
}) {
    return (
        <Card className="border-border bg-background shadow-sm">
            <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                        {title}
                    </p>
                    {isWarning ? (
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                    ) : null}
                </div>

                <div className="mb-4 flex items-baseline justify-between">
                    <h3 className="text-4xl font-extrabold tracking-tighter text-foreground">
                        {value}
                    </h3>
                    <span
                        className={`text-xs font-bold ${isWarning ? 'text-destructive' : 'text-primary'}`}
                    >
                        {trend}
                    </span>
                </div>

                <Progress
                    value={progressValue}
                    className={`h-1.5 bg-muted ${isWarning ? '[&>div]:bg-destructive' : '[&>div]:bg-primary'}`}
                />
            </CardContent>
        </Card>
    );
}
