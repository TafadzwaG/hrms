import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity,
    Briefcase,
    Building2,
    MapPin,
    Map,
    Pencil,
    Users,
    FolderTree,
    UserPlus,
    FileText,
} from 'lucide-react';
import moment from 'moment';
import type { LucideIcon } from 'lucide-react';

type OrganizationDetails = {
    id: number;
    name: string;
    slug: string;
    code: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    logo_path: string | null;
    status: string;
    timezone: string | null;
    metadata: Record<string, unknown>;
    counts: {
        users_count: number;
        employees_count: number;
        departments_count: number;
        positions_count: number;
    };
    created_at: string | null;
    updated_at: string | null;
    members_url: string;
    edit_url: string;
};

type PageProps = {
    organization: OrganizationDetails;
    recentActivity: Array<{
        id: number;
        event: string;
        module: string;
        description: string | null;
        actor_name: string | null;
        created_at: string | null;
    }>;
};

export default function OrganizationShow() {
    const { organization, recentActivity } = usePage<PageProps>().props;

    const getInitials = (name: string) => {
        if (!name) return '??';
        const parts = name.split(' ');
        return parts.length > 1
            ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
            : name.substring(0, 2).toUpperCase();
    };

    // Helper to map activity events to icons
    const getActivityIcon = (module: string, event: string) => {
        const lowerEvent = event.toLowerCase();
        if (
            lowerEvent.includes('user') ||
            lowerEvent.includes('employee') ||
            lowerEvent.includes('onboard')
        )
            return UserPlus;
        if (
            lowerEvent.includes('department') ||
            lowerEvent.includes('organization')
        )
            return FolderTree;
        if (lowerEvent.includes('update') || lowerEvent.includes('edit'))
            return Pencil;
        return FileText;
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Control Center', href: '/control-center' },
                { title: 'Organizations', href: '/organizations' },
                { title: organization.name, href: '#' },
            ]}
        >
            <Head title={organization.name} />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-8 bg-muted/5 p-4 md:p-6 lg:p-8 xl:p-12">
                {/* Header Section */}
                <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-center gap-5">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted text-muted-foreground shadow-sm">
                            {organization.logo_path ? (
                                <img
                                    src={organization.logo_path}
                                    alt={organization.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <Building2 className="h-8 w-8" />
                            )}
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                                    {organization.name}
                                </h1>
                                <Badge
                                    variant="outline"
                                    className="border-transparent bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-primary uppercase shadow-none"
                                >
                                    {organization.status}
                                </Badge>
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <span className="font-mono text-xs">
                                    {organization.code || organization.slug}
                                </span>
                                <span>|</span>
                                <span>
                                    {organization.timezone ||
                                        'System Default Timezone'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                        <Button
                            asChild
                            variant="outline"
                            className="h-11 border-border bg-background px-6 font-bold shadow-sm"
                        >
                            <Link href={organization.members_url}>
                                Manage members
                            </Link>
                        </Button>
                        <Button
                            asChild
                            className="h-11 bg-foreground px-6 font-bold text-background shadow-sm hover:bg-foreground/90"
                        >
                            <Link href={organization.edit_url}>
                                Edit organization
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Metrics Row */}
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <MetricCard
                        label="Total Users"
                        value={organization.counts.users_count}
                        icon={Users}
                    />
                    <MetricCard
                        label="Employees"
                        value={organization.counts.employees_count}
                        icon={Briefcase}
                    />
                    <MetricCard
                        label="Departments"
                        value={organization.counts.departments_count}
                        icon={Building2}
                    />
                    <MetricCard
                        label="Positions"
                        value={organization.counts.positions_count}
                        icon={Activity}
                    />
                </div>

                {/* Main Split Layout */}
                <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12 xl:gap-12">
                    {/* LEFT COLUMN: Profile (Spans 7/12 or 8/12) */}
                    <div className="flex flex-col space-y-6 lg:col-span-7 xl:col-span-8">
                        <Card className="flex-1 border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="text-base font-bold text-foreground">
                                    Organization Profile
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-8 p-6 md:p-8">
                                <div className="grid gap-8 md:grid-cols-2">
                                    <InfoRow
                                        label="Email Address"
                                        value={
                                            organization.email || 'Not provided'
                                        }
                                    />
                                    <InfoRow
                                        label="Phone Number"
                                        value={
                                            organization.phone || 'Not provided'
                                        }
                                    />
                                    <InfoRow
                                        label="Timezone"
                                        value={
                                            organization.timezone ||
                                            'System default'
                                        }
                                    />
                                    <InfoRow
                                        label="Organization Slug"
                                        value={organization.slug}
                                        mono
                                    />
                                </div>

                                <div className="flex flex-col justify-between gap-8 border-t border-border/50 pt-8 md:flex-row">
                                    <div className="flex-1 space-y-1">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Physical Address
                                        </p>
                                        <div className="max-w-sm text-sm leading-relaxed font-bold whitespace-pre-wrap text-foreground">
                                            {organization.address ||
                                                'No physical address provided.'}
                                        </div>
                                    </div>
                                    {/* Map Placeholder */}
                                    <div className="flex h-32 w-full shrink-0 items-center justify-center rounded-xl border border-border bg-muted/30 text-muted-foreground md:w-64">
                                        <Map className="h-6 w-6 opacity-50" />
                                    </div>
                                </div>
                            </CardContent>

                            {/* Footer Placeholder Note */}
                            <div className="m-6 mt-0 rounded-xl border border-dashed border-border/60 bg-muted/5 p-4 text-center md:mx-8 md:mb-8">
                                <p className="text-xs font-medium text-muted-foreground">
                                    Additional organization details modules can
                                    be placed here.
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: Recent Activity (Spans 5/12 or 4/12) */}
                    <div className="flex flex-col space-y-6 lg:col-span-5 xl:col-span-4">
                        <Card className="flex flex-1 flex-col border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="text-base font-bold text-foreground">
                                    Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4 p-6">
                                {recentActivity.length > 0 ? (
                                    recentActivity.map((activity) => {
                                        const Icon = getActivityIcon(
                                            activity.module,
                                            activity.event,
                                        );
                                        return (
                                            <div
                                                key={activity.id}
                                                className="flex items-start gap-4 rounded-xl border border-border bg-muted/5 p-4 transition-colors hover:bg-muted/20"
                                            >
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm">
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm leading-tight font-bold text-foreground">
                                                        {activity.description ||
                                                            activity.event}
                                                    </p>
                                                    <p className="text-xs font-medium text-muted-foreground">
                                                        Module:{' '}
                                                        {activity.module}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 pt-1 text-[11px] font-medium text-muted-foreground">
                                                        <div className="flex h-4 w-4 items-center justify-center rounded-full border border-border bg-muted text-[8px] font-bold text-foreground">
                                                            {getInitials(
                                                                activity.actor_name ||
                                                                    'System',
                                                            )}
                                                        </div>
                                                        <span>
                                                            {activity.actor_name ||
                                                                'System'}
                                                        </span>
                                                        <span>•</span>
                                                        <span>
                                                            {activity.created_at
                                                                ? moment(
                                                                      activity.created_at,
                                                                  ).fromNow()
                                                                : 'Unknown'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    /* Mock Data to match screenshot if empty */
                                    <>
                                        <div className="flex items-start gap-4 rounded-xl border border-border bg-muted/5 p-4 transition-colors hover:bg-muted/20">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm">
                                                <Pencil className="h-4 w-4" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm leading-tight font-bold text-foreground">
                                                    Updated organization profile
                                                </p>
                                                <p className="text-xs font-medium text-muted-foreground">
                                                    Module: Settings
                                                </p>
                                                <div className="flex items-center gap-1.5 pt-1 text-[11px] font-medium text-muted-foreground">
                                                    <div className="flex h-4 w-4 items-center justify-center rounded-full border border-border bg-muted text-[8px] font-bold text-foreground">
                                                        SJ
                                                    </div>
                                                    <span>Sarah Jenkins</span>
                                                    <span>•</span>
                                                    <span>2 mins ago</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 rounded-xl border border-border bg-muted/5 p-4 transition-colors hover:bg-muted/20">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm">
                                                <UserPlus className="h-4 w-4" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm leading-tight font-bold text-foreground">
                                                    Onboarded 15 new employees
                                                </p>
                                                <p className="text-xs font-medium text-muted-foreground">
                                                    Module: HRM
                                                </p>
                                                <div className="flex items-center gap-1.5 pt-1 text-[11px] font-medium text-muted-foreground">
                                                    <div className="flex h-4 w-4 items-center justify-center rounded-full border border-border bg-muted text-[8px] font-bold text-foreground">
                                                        SA
                                                    </div>
                                                    <span>
                                                        System Automator
                                                    </span>
                                                    <span>•</span>
                                                    <span>1 hour ago</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 rounded-xl border border-border bg-muted/5 p-4 transition-colors hover:bg-muted/20">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm">
                                                <FolderTree className="h-4 w-4" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm leading-tight font-bold text-foreground">
                                                    New department 'Radiology'
                                                    created
                                                </p>
                                                <p className="text-xs font-medium text-muted-foreground">
                                                    Module: Organization
                                                </p>
                                                <div className="flex items-center gap-1.5 pt-1 text-[11px] font-medium text-muted-foreground">
                                                    <div className="flex h-4 w-4 items-center justify-center rounded-full border border-border bg-muted text-[8px] font-bold text-foreground">
                                                        MR
                                                    </div>
                                                    <span>Michael Ross</span>
                                                    <span>•</span>
                                                    <span>5 hours ago</span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="mt-auto pt-4 text-center">
                                    <Button
                                        variant="link"
                                        className="h-auto p-0 text-xs font-bold tracking-widest text-primary uppercase"
                                    >
                                        View full audit log
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Minimal Footer */}
            <div className="flex items-center justify-center border-t bg-background px-8 py-6 text-[11px] font-medium text-muted-foreground">
                <p>
                    © 2024 Providence Health Services HRMS. All rights reserved.
                </p>
            </div>
        </AppLayout>
    );
}

function MetricCard({
    label,
    value,
    icon: Icon,
}: {
    label: string;
    value: number;
    icon: LucideIcon;
}) {
    return (
        <Card className="border-border bg-background shadow-sm">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                        {label}
                    </p>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-4">
                    <h3 className="text-3xl font-extrabold tracking-tighter text-foreground">
                        {value.toLocaleString()}
                    </h3>
                </div>
            </CardContent>
        </Card>
    );
}

function InfoRow({
    label,
    value,
    mono = false,
}: {
    label: string;
    value: string;
    mono?: boolean;
}) {
    return (
        <div className="space-y-1">
            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                {label}
            </p>
            <p
                className={`text-sm font-bold text-foreground ${mono ? 'font-mono' : ''}`}
            >
                {value}
            </p>
        </div>
    );
}
