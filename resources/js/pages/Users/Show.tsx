import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
    ArrowRightLeft,
    CheckCircle2,
    History,
    Info,
    KeyRound,
    ListFilter,
    Search,
    Shield,
    ShieldCheck,
    Trash2,
} from 'lucide-react';
import moment from 'moment';
import { ReactNode, useMemo, useState } from 'react';

type RoleItem = {
    id: number;
    code: string;
    name: string;
    description: string | null;
    show_url: string;
    remove_url: string | null;
    assigned_via: string;
    removable: boolean;
};
type PermissionItem = {
    id: number;
    name: string;
    label: string;
    module: string;
};
type AuditLogItem = {
    id: number;
    event_label: string;
    module_label: string;
    description: string | null;
    created_at: string | null;
    is_critical: boolean;
    show_url: string;
};

type UserPayload = {
    id: number;
    name: string;
    email: string;
    username: string | null;
    role: string | null;
    email_verified_at: string | null;
    roles_count: number;
    direct_permissions_count: number;
    roles: RoleItem[];
    employee: {
        id: number;
        staff_number: string;
        full_name: string;
        job_title?: string | null;
        department?: string | null;
        location?: string | null;
        status?: string | null;
    } | null;
    all_permissions: PermissionItem[];
    account: {
        reference: string;
        modules_count: number;
        access_profile: {
            label: string;
            tone: 'critical' | 'warning' | 'info' | 'neutral';
            description: string;
        };
        mfa: {
            label: string;
            tone: 'positive' | 'warning' | 'neutral';
            description: string;
        };
        last_login_at: string | null;
    };
    activity: {
        total_events: number;
        critical_events: number;
        failed_login_attempts: number;
        recent_audit_logs: AuditLogItem[];
    };
    links: {
        index: string;
        show: string;
        edit: string;
        destroy: string;
        impersonate: string | null;
        send_reset_link: string;
        audit_logs: string;
        audit_export: string;
        employee: string | null;
        control_center: string;
    };
    created_at: string | null;
    updated_at: string | null;
};

type Meta = {
    supportsUsername: boolean;
    supportsRoleColumn: boolean;
    supportsEmailVerification: boolean;
    supportsTwoFactor: boolean;
};

export default function UserShow() {
    const { user, meta } = usePage<{ user: UserPayload; meta: Meta }>().props;
    const { can } = useAuthorization();
    const [permissionFilter, setPermissionFilter] = useState('');
    const [showAllPermissions, setShowAllPermissions] = useState(false);

    const canManageUser = can('users.update');
    const canAssignRoles = can('users.assign_roles');
    const canExportAudit = can('audit.export');

    const filteredPermissions = useMemo(() => {
        const query = permissionFilter.trim().toLowerCase();
        if (!query) return user.all_permissions;

        return user.all_permissions.filter((permission) =>
            [permission.name, permission.label, permission.module].some(
                (value) => value.toLowerCase().includes(query),
            ),
        );
    }, [permissionFilter, user.all_permissions]);

    const permissionsToRender = showAllPermissions
        ? filteredPermissions
        : filteredPermissions.slice(0, 8);
    const employeeMeta = [user.employee?.department, user.employee?.location]
        .filter(Boolean)
        .join(' • ');

    const removeRole = (role: RoleItem) => {
        if (
            !canAssignRoles ||
            !role.removable ||
            !role.remove_url ||
            !window.confirm(`Remove ${role.name} from ${user.name}?`)
        )
            return;
        router.delete(role.remove_url, { preserveScroll: true });
    };

    const getInitials = (name: string) => {
        if (!name) return '??';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    const formatMetric = (num: number) => {
        return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString();
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Control Center', href: user.links.control_center },
                { title: 'Users', href: user.links.index },
                { title: user.name, href: '#' },
            ]}
        >
            <Head title={`${user.name} - Admin Console`} />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-8 bg-muted/5 p-4 md:p-6 lg:p-8 xl:p-12">
                {/* Search/Header Area (Mockup structure) */}
                <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search security policies, logs, users..."
                            className="h-10 w-full rounded-full border-border bg-background pl-9 text-sm shadow-sm"
                        />
                    </div>
                    <Badge
                        variant="outline"
                        className="border-border bg-muted px-3 py-1 font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase shadow-none"
                    >
                        Admin Console
                    </Badge>
                </div>

                <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12 xl:gap-8">
                    {/* LEFT COLUMN: Identity Profile (Spans 4/12) */}
                    <div className="space-y-6 lg:col-span-4 xl:col-span-3">
                        {/* Profile Card */}
                        <Card className="overflow-hidden border-border bg-background text-center shadow-sm">
                            <CardContent className="flex flex-col items-center space-y-6 p-8">
                                <Avatar className="h-28 w-28 border-4 border-background shadow-sm ring-1 ring-border">
                                    <AvatarFallback className="bg-muted text-2xl font-bold text-foreground">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="w-full space-y-1">
                                    <h2 className="truncate text-2xl font-bold text-foreground">
                                        {user.name}
                                    </h2>
                                    <p className="text-sm font-bold text-primary">
                                        {user.employee?.job_title ||
                                            'System User'}
                                    </p>
                                    <p className="mt-1 text-xs font-medium text-muted-foreground">
                                        {employeeMeta ||
                                            'Global Administration'}
                                    </p>
                                </div>

                                <div className="flex w-full gap-3 pt-2">
                                    {canManageUser && (
                                        <Button
                                            className="h-10 w-full bg-foreground font-bold text-background shadow-sm hover:bg-foreground/90"
                                            onClick={() =>
                                                router.visit(user.links.edit)
                                            }
                                        >
                                            Actions
                                        </Button>
                                    )}
                                    {user.links.impersonate ? (
                                        <Button
                                            variant="outline"
                                            className="h-10 w-full border-border bg-background font-bold text-foreground shadow-sm"
                                            onClick={() =>
                                                router.post(
                                                    user.links.impersonate!,
                                                )
                                            }
                                        >
                                            <ArrowRightLeft className="mr-2 h-4 w-4" />
                                            Impersonate
                                        </Button>
                                    ) : null}
                                    {canExportAudit && (
                                        <Button
                                            variant="outline"
                                            className="h-10 w-full border-border bg-background font-bold text-foreground shadow-sm"
                                            onClick={() =>
                                                router.visit(
                                                    user.links.audit_export,
                                                )
                                            }
                                        >
                                            Export Report
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Account Summary */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardContent className="space-y-5 p-6">
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Account Summary
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-muted-foreground">
                                            Account Status
                                        </span>
                                        {user.email_verified_at ? (
                                            <Badge
                                                variant="outline"
                                                className="border-transparent bg-primary/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-primary uppercase shadow-none"
                                            >
                                                <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-primary" />{' '}
                                                Verified
                                            </Badge>
                                        ) : (
                                            <Badge
                                                variant="outline"
                                                className="border-dashed border-transparent bg-muted px-2 py-0.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase shadow-none"
                                            >
                                                Pending
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-muted-foreground">
                                            Security Clearance
                                        </span>
                                        <span
                                            className="max-w-[120px] truncate font-bold text-foreground"
                                            title={
                                                user.account.access_profile
                                                    .label
                                            }
                                        >
                                            {user.account.access_profile.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-muted-foreground">
                                            Last Login
                                        </span>
                                        <span className="font-bold text-foreground">
                                            {user.account.last_login_at
                                                ? fromNow(
                                                      user.account
                                                          .last_login_at,
                                                  )
                                                : 'Never'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-muted-foreground">
                                            MFA Status
                                        </span>
                                        <span className="font-bold text-primary">
                                            {user.account.mfa.label}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Email & Identity */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardContent className="space-y-6 p-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Email & Identity
                                    </p>
                                    <p className="text-sm font-bold break-all text-foreground">
                                        {user.email}
                                    </p>
                                    <p className="font-mono text-xs text-muted-foreground">
                                        UID: {user.account.reference}
                                    </p>
                                </div>

                                {meta.supportsRoleColumn && user.role && (
                                    <div className="space-y-1 border-t border-border/50 pt-2">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Legacy Role
                                        </p>
                                        <p className="text-sm font-bold text-foreground">
                                            {user.role}
                                        </p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4 border-t border-border/50 pt-2">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Created
                                        </p>
                                        <p className="text-xs font-bold text-foreground">
                                            {formatDate(user.created_at)}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Modified
                                        </p>
                                        <p className="text-xs font-bold text-foreground">
                                            {formatDate(user.updated_at)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: Tabs & Data (Spans 8/12) */}
                    <div className="space-y-6 lg:col-span-8 xl:col-span-9">
                        {/* Top Stat Row */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <MetricCard
                                title="Roles"
                                value={user.roles_count.toString()}
                                icon={
                                    <Shield className="h-5 w-5 text-primary" />
                                }
                                badgeTone="primary"
                            />
                            <MetricCard
                                title="Permissions"
                                value={user.all_permissions.length.toString()}
                                icon={
                                    <KeyRound className="h-5 w-5 text-primary" />
                                }
                                badgeTone="primary"
                            />
                            <MetricCard
                                title="Audit Events"
                                value={formatMetric(user.activity.total_events)}
                                icon={
                                    <History className="h-5 w-5 text-primary" />
                                }
                                badgeTone="muted"
                            />
                        </div>

                        {/* Main Content Tabs */}
                        <Card className="border-border bg-background shadow-sm">
                            <Tabs defaultValue="roles" className="w-full">
                                {/* Tab Navigation */}
                                <div className="overflow-x-auto border-b border-border/60 px-6">
                                    <TabsList className="flex h-auto w-max justify-start gap-6 rounded-none bg-transparent p-0 sm:w-full">
                                        <TabsTrigger
                                            value="overview"
                                            className={tabClass}
                                        >
                                            Overview
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="roles"
                                            className={tabClass}
                                        >
                                            Roles & Permissions
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="audit"
                                            className={tabClass}
                                        >
                                            Audit Log
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="apps"
                                            className={tabClass}
                                        >
                                            Connected Apps
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent
                                    value="roles"
                                    className="mt-0 space-y-10 p-6 focus-visible:ring-0 md:p-8"
                                >
                                    {/* Role Assignments Section */}
                                    <div className="space-y-6">
                                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                            <div>
                                                <h3 className="text-lg font-bold text-foreground">
                                                    Role Assignments
                                                </h3>
                                                <p className="mt-0.5 text-sm font-medium text-muted-foreground">
                                                    High-level access groups
                                                    assigned to this account.
                                                </p>
                                            </div>
                                            {canAssignRoles && (
                                                <Button
                                                    className="h-10 shrink-0 bg-foreground font-bold text-background shadow-sm hover:bg-foreground/90"
                                                    onClick={() =>
                                                        router.visit(
                                                            user.links.edit,
                                                        )
                                                    }
                                                >
                                                    + Add Role
                                                </Button>
                                            )}
                                        </div>

                                        <div className="overflow-hidden rounded-xl border border-border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="bg-muted/10 hover:bg-transparent">
                                                        <TableHead className="h-12 pl-6 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                            Role Name
                                                        </TableHead>
                                                        <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                            Assigned Via
                                                        </TableHead>
                                                        <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                            Status
                                                        </TableHead>
                                                        <TableHead className="pr-6 text-right text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                            Actions
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {user.roles.length > 0 ? (
                                                        user.roles.map(
                                                            (role) => (
                                                                <TableRow
                                                                    key={
                                                                        role.id
                                                                    }
                                                                    className="transition-colors hover:bg-muted/30"
                                                                >
                                                                    <TableCell className="py-4 pl-6">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted/50 text-foreground shadow-sm">
                                                                                <Shield className="h-4 w-4" />
                                                                            </div>
                                                                            <span className="text-sm font-bold tracking-wider text-foreground uppercase">
                                                                                {
                                                                                    role.name
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="text-sm font-medium text-muted-foreground">
                                                                        {role.assigned_via}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge
                                                                            variant="outline"
                                                                            className="border-transparent bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-primary uppercase shadow-none"
                                                                        >
                                                                            Active
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell className="pr-6 text-right">
                                                                        {canAssignRoles &&
                                                                        role.removable &&
                                                                        role.remove_url ? (
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-8 w-8 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                                                                onClick={() =>
                                                                                    removeRole(
                                                                                        role,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </Button>
                                                                        ) : (
                                                                            <Info className="mr-2 ml-auto h-4 w-4 text-muted-foreground opacity-50" />
                                                                        )}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ),
                                                        )
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell
                                                                colSpan={4}
                                                                className="h-24 text-center text-sm font-medium text-muted-foreground"
                                                            >
                                                                No roles
                                                                assigned to this
                                                                user.
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>

                                    {/* Resolved Permissions Section */}
                                    <div className="space-y-6 border-t border-border/50 pt-4">
                                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-foreground">
                                                    Resolved Permissions
                                                </h3>
                                                <p className="mt-0.5 text-sm font-medium text-muted-foreground">
                                                    Atomic access levels
                                                    calculated from all assigned
                                                    roles.
                                                </p>
                                            </div>
                                            <div className="relative w-full shrink-0 md:w-64">
                                                <ListFilter className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    placeholder="Filter permissions..."
                                                    value={permissionFilter}
                                                    onChange={(e) =>
                                                        setPermissionFilter(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-10 w-full border-border bg-background pl-9 text-sm shadow-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="overflow-hidden rounded-xl border border-border bg-background">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="bg-muted/10 hover:bg-transparent">
                                                        <TableHead className="h-12 pl-6 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                            Permission Key
                                                        </TableHead>
                                                        <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                            Module
                                                        </TableHead>
                                                        <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                            Scope
                                                        </TableHead>
                                                        <TableHead className="pr-6 text-center text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                            State
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {permissionsToRender.length >
                                                    0 ? (
                                                        permissionsToRender.map(
                                                            (perm) => (
                                                                <TableRow
                                                                    key={
                                                                        perm.id
                                                                    }
                                                                    className="transition-colors hover:bg-muted/30"
                                                                >
                                                                    <TableCell className="py-4 pl-6 font-mono text-xs font-bold text-foreground">
                                                                        {
                                                                            perm.name
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge
                                                                            variant="secondary"
                                                                            className="border border-border/50 bg-muted px-2 py-0.5 text-[9px] font-bold tracking-widest text-muted-foreground uppercase shadow-none"
                                                                        >
                                                                            {
                                                                                perm.module
                                                                            }
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell className="text-sm font-medium text-muted-foreground">
                                                                        Global
                                                                    </TableCell>
                                                                    <TableCell className="pr-6 text-center">
                                                                        <CheckCircle2 className="mx-auto h-4 w-4 text-primary" />
                                                                    </TableCell>
                                                                </TableRow>
                                                            ),
                                                        )
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell
                                                                colSpan={4}
                                                                className="h-24 text-center text-sm font-medium text-muted-foreground"
                                                            >
                                                                No permissions
                                                                match the
                                                                current filter.
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>

                                            {/* Footer Action */}
                                            {filteredPermissions.length > 8 && (
                                                <div className="border-t border-border/50 bg-muted/10 p-3 text-center">
                                                    <Button
                                                        variant="link"
                                                        className="h-auto p-0 text-[10px] font-bold tracking-widest text-foreground uppercase transition-colors hover:text-primary"
                                                        onClick={() =>
                                                            setShowAllPermissions(
                                                                !showAllPermissions,
                                                            )
                                                        }
                                                    >
                                                        {showAllPermissions
                                                            ? 'Show fewer permissions'
                                                            : `View all ${filteredPermissions.length} permissions`}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Placeholder Tabs */}
                                <TabsContent
                                    value="overview"
                                    className="p-8 text-center text-sm font-medium text-muted-foreground"
                                >
                                    Overview dashboard view.
                                </TabsContent>
                                <TabsContent
                                    value="audit"
                                    className="p-8 text-center text-sm font-medium text-muted-foreground"
                                >
                                    Detailed user audit log view.
                                </TabsContent>
                                <TabsContent
                                    value="apps"
                                    className="p-8 text-center text-sm font-medium text-muted-foreground"
                                >
                                    Connected applications and OAuth tokens.
                                </TabsContent>
                            </Tabs>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Minimal Footer */}
            <div className="flex flex-col items-center justify-between gap-4 border-t bg-background px-8 py-6 md:flex-row">
                <p className="text-[11px] font-medium text-muted-foreground">
                    © 2024 Providence HRMS. Security Compliance Engine v2.4.1
                </p>
                <div className="flex items-center gap-6 text-[11px] font-medium text-muted-foreground">
                    <a
                        href="#"
                        className="transition-colors hover:text-foreground"
                    >
                        Security Policy
                    </a>
                    <a
                        href="/audit-trail"
                        className="transition-colors hover:text-foreground"
                    >
                        Full Audit Logs
                    </a>
                    <a
                        href="#"
                        className="transition-colors hover:text-foreground"
                    >
                        IT Support
                    </a>
                </div>
            </div>
        </AppLayout>
    );
}

function MetricCard({
    title,
    value,
    icon,
    badgeTone,
}: {
    title: string;
    value: string;
    icon: ReactNode;
    badgeTone: 'primary' | 'muted';
}) {
    return (
        <Card className="border-border bg-background shadow-sm">
            <CardContent className="flex items-center justify-center gap-4 p-6 sm:justify-start">
                <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border ${badgeTone === 'primary' ? 'border-transparent bg-primary/10 text-primary' : 'border-border bg-muted text-muted-foreground'}`}
                >
                    {icon}
                </div>
                <div>
                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                        {title}
                    </p>
                    <p className="text-2xl font-extrabold text-foreground">
                        {value}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

function formatDate(value: string | null) {
    return value ? moment(value).format('MMM DD, YYYY') : 'Not recorded';
}
function fromNow(value: string | null) {
    return value ? moment(value).fromNow() : 'Not recorded';
}

const tabClass =
    'relative rounded-none border-b-2 border-transparent bg-transparent py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-none hover:text-foreground data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none';
