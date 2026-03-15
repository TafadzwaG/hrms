import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import AppLayout from '@/layouts/app-layout';
import { useAuthorization } from '@/lib/authorization';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    BarChart,
    Briefcase,
    Building2,
    Eye,
    FileText,
    Filter,
    MapPin,
    Pencil,
    Plus,
    Search,
    ShieldCheck,
    Users,
    Store,
} from 'lucide-react';
import moment from 'moment';

type OrganizationItem = {
    id: number;
    name: string;
    slug: string;
    code: string | null;
    email: string | null;
    phone: string | null;
    status: string;
    timezone: string | null;
    users_count: number;
    employees_count: number;
    created_at: string | null;
    updated_at: string | null;
    show_url: string;
    edit_url: string;
    members_url: string;
};

type Pagination<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
};

type PageProps = {
    organizations: Pagination<OrganizationItem>;
    filters: { search: string; status: string };
    summary: {
        total_organizations: number;
        active_organizations: number;
        total_users: number;
        total_employees: number;
    };
    recentOrganizations: OrganizationItem[];
    quickActions: Array<{ label: string; href: string; description: string }>;
    statusOptions: string[];
};

export default function OrganizationsIndex() {
    const {
        organizations,
        filters,
        summary,
        recentOrganizations,
        quickActions,
        statusOptions,
    } = usePage<PageProps>().props;
    const { can } = useAuthorization();

    const updateFilters = (next: Partial<PageProps['filters']>) => {
        router.get(
            '/organizations',
            {
                search: next.search ?? filters.search,
                status: next.status ?? filters.status,
            },
            { preserveState: true, replace: true, preserveScroll: true },
        );
    };

    const getInitials = (name: string) => {
        if (!name) return '??';
        const parts = name.split(' ');
        return parts.length > 1
            ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
            : name.substring(0, 2).toUpperCase();
    };

    // Helper to map quick action labels to semantic icons
    const getActionIcon = (label: string) => {
        const lower = label.toLowerCase();
        if (lower.includes('entity') || lower.includes('branch'))
            return <Store className="h-5 w-5" />;
        if (lower.includes('import') || lower.includes('upload'))
            return <FileText className="h-5 w-5" />;
        if (lower.includes('report') || lower.includes('summary'))
            return <BarChart className="h-5 w-5" />;
        return <Building2 className="h-5 w-5" />;
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Control Center', href: '/control-center' },
                { title: 'Organizations', href: '#' },
            ]}
        >
            <Head title="Organizations" />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-8 bg-muted/5 p-4 md:p-6 lg:p-8 xl:p-12">
                {/* Header Section */}
                <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Organizations Control Center
                        </h1>
                        <p className="mt-2 max-w-3xl text-sm leading-relaxed font-medium text-muted-foreground">
                            Manage and monitor all corporate entities and their
                            operational status across the globe.
                        </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                        {can('organizations.create') && (
                            <Button
                                asChild
                                className="h-11 bg-foreground px-6 font-bold text-background shadow-sm hover:bg-foreground/90"
                            >
                                <Link href="/organizations/create">
                                    <Plus className="mr-2 h-4 w-4" /> Create
                                    organization
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Top Metrics Row */}
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard
                        title="Total Organizations"
                        value={summary.total_organizations}
                        icon={Building2}
                        trend="+4.5% from last month"
                    />
                    <SummaryCard
                        title="Active Entities"
                        value={summary.active_organizations}
                        icon={ShieldCheck}
                        subtext="95.3% system availability"
                    />
                    <SummaryCard
                        title="Active Users"
                        value={summary.total_users}
                        icon={Users}
                        trend="+12 new today"
                    />
                    <SummaryCard
                        title="Total Employees"
                        value={summary.total_employees}
                        icon={Briefcase}
                        subtext="Across 12 countries"
                    />
                </div>

                {/* Main Split Layout */}
                <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12 xl:gap-12">
                    {/* LEFT COLUMN: Main Directory (Spans 8/12) */}
                    <div className="flex flex-col space-y-6 lg:col-span-8">
                        <Card className="flex h-full min-h-[600px] flex-col overflow-hidden border-border bg-background shadow-sm">
                            {/* Toolbar */}
                            <div className="flex shrink-0 flex-col justify-between gap-4 border-b border-border/50 p-4 sm:flex-row sm:items-center md:p-6">
                                <div className="relative w-full">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        value={filters.search}
                                        onChange={(event) =>
                                            updateFilters({
                                                search: event.target.value,
                                            })
                                        }
                                        placeholder="Search organizations by name or code..."
                                        className="h-11 w-full border-border/50 bg-background pl-9 text-sm shadow-sm"
                                    />
                                </div>
                                <div className="flex w-full shrink-0 items-center gap-3 sm:w-auto">
                                    <Select
                                        value={filters.status || 'All'}
                                        onValueChange={(value) =>
                                            updateFilters({
                                                status:
                                                    value === 'All'
                                                        ? ''
                                                        : value,
                                            })
                                        }
                                    >
                                        <SelectTrigger className="h-11 w-full border-border/50 bg-background text-sm font-medium shadow-sm sm:w-40">
                                            <SelectValue placeholder="Status: All" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">
                                                Status: All
                                            </SelectItem>
                                            {statusOptions.map((option) => (
                                                <SelectItem
                                                    key={option}
                                                    value={option}
                                                >
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-11 w-11 shrink-0 border-border/50 text-muted-foreground shadow-sm hover:text-foreground"
                                    >
                                        <Filter className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Table Area */}
                            <div className="flex-1 overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b border-border/50 bg-muted/10 hover:bg-transparent">
                                            <TableHead className="h-12 pl-6 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Organization
                                            </TableHead>
                                            <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Status
                                            </TableHead>
                                            <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Users
                                            </TableHead>
                                            <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Employees
                                            </TableHead>
                                            <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Timezone
                                            </TableHead>
                                            <TableHead className="pr-6 text-right text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {organizations.data.length > 0 ? (
                                            organizations.data.map((org) => (
                                                <TableRow
                                                    key={org.id}
                                                    className="transition-colors hover:bg-muted/30"
                                                >
                                                    <TableCell className="py-4 pl-6">
                                                        <div className="flex items-center gap-4">
                                                            <Avatar className="h-10 w-10 border border-border bg-muted text-foreground shadow-sm">
                                                                <AvatarFallback className="text-xs font-bold">
                                                                    {getInitials(
                                                                        org.name,
                                                                    )}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="space-y-1">
                                                                <Link
                                                                    href={
                                                                        org.show_url
                                                                    }
                                                                    className="text-sm font-bold text-foreground hover:underline"
                                                                >
                                                                    {org.name}
                                                                </Link>
                                                                <div className="font-mono text-xs text-muted-foreground">
                                                                    {org.code ||
                                                                        org.slug}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="secondary"
                                                            className={`border-transparent px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase shadow-none ${
                                                                org.status.toLowerCase() ===
                                                                'active'
                                                                    ? 'bg-primary/10 text-primary'
                                                                    : org.status.toLowerCase() ===
                                                                        'archived'
                                                                      ? 'bg-muted text-muted-foreground'
                                                                      : 'bg-foreground/10 text-foreground'
                                                            }`}
                                                        >
                                                            {org.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-sm font-bold text-foreground">
                                                        {org.users_count.toLocaleString()}
                                                    </TableCell>
                                                    <TableCell className="text-sm font-bold text-foreground">
                                                        {org.employees_count.toLocaleString()}
                                                    </TableCell>
                                                    <TableCell className="text-sm font-medium text-muted-foreground">
                                                        {org.timezone ||
                                                            'System Default'}
                                                    </TableCell>
                                                    <TableCell className="pr-6 text-right">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <Button
                                                                asChild
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                            >
                                                                <Link
                                                                    href={
                                                                        org.show_url
                                                                    }
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                            {can(
                                                                'organizations.update',
                                                            ) && (
                                                                <Button
                                                                    asChild
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                                >
                                                                    <Link
                                                                        href={
                                                                            org.edit_url
                                                                        }
                                                                    >
                                                                        <Pencil className="h-4 w-4" />
                                                                    </Link>
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={6}
                                                    className="h-48 text-center text-sm font-medium text-muted-foreground"
                                                >
                                                    No organizations match the
                                                    current filters.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination / Footer */}
                            <div className="flex shrink-0 items-center justify-between border-t border-border/50 bg-muted/5 p-4">
                                <span className="text-xs font-bold text-muted-foreground">
                                    Showing {organizations.from || 0}-
                                    {organizations.to || 0} of{' '}
                                    {organizations.total || 0} organizations
                                </span>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="h-9 border-border bg-background px-4 text-xs font-bold text-foreground shadow-sm transition-colors hover:bg-muted"
                                        disabled={
                                            organizations.current_page <= 1
                                        }
                                        onClick={() =>
                                            router.get('/organizations', {
                                                page:
                                                    organizations.current_page -
                                                    1,
                                                ...filters,
                                            })
                                        }
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        className="h-9 border border-foreground bg-foreground px-4 text-xs font-bold text-background shadow-sm transition-colors hover:bg-foreground/90"
                                        disabled={
                                            organizations.current_page >=
                                            organizations.last_page
                                        }
                                        onClick={() =>
                                            router.get('/organizations', {
                                                page:
                                                    organizations.current_page +
                                                    1,
                                                ...filters,
                                            })
                                        }
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: Side Panels (Spans 4/12) */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* Quick Actions */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="text-base font-bold text-foreground">
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6">
                                {(quickActions?.length > 0
                                    ? quickActions
                                    : [
                                          {
                                              label: 'New Sub-entity',
                                              description:
                                                  'Add branch to existing org',
                                              href: '#',
                                          },
                                          {
                                              label: 'Bulk Import',
                                              description:
                                                  'CSV or Excel template',
                                              href: '#',
                                          },
                                          {
                                              label: 'Generate Reports',
                                              description:
                                                  'Operational status summary',
                                              href: '#',
                                          },
                                      ]
                                ).map((action, idx) => (
                                    <Link
                                        key={idx}
                                        href={action.href}
                                        className="group flex items-start gap-4 rounded-xl border border-border bg-muted/10 p-4 transition-colors hover:border-foreground/30 hover:bg-muted/20"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors group-hover:text-foreground">
                                            {getActionIcon(action.label)}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm leading-tight font-bold text-foreground">
                                                {action.label}
                                            </p>
                                            <p className="text-xs font-medium text-muted-foreground">
                                                {action.description}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Recently Added */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
                                <CardTitle className="text-base font-bold text-foreground">
                                    Recently Added
                                </CardTitle>
                                <Button
                                    variant="link"
                                    className="h-auto p-0 text-xs font-bold tracking-widest text-primary uppercase"
                                >
                                    View all
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6">
                                {(recentOrganizations?.length > 0
                                    ? recentOrganizations
                                    : [
                                          {
                                              id: 1,
                                              name: 'Apex Ventures',
                                              created_at: moment()
                                                  .subtract(2, 'hours')
                                                  .toISOString(),
                                              timezone: 'UK',
                                          },
                                          {
                                              id: 2,
                                              name: 'Skyline Partners',
                                              created_at: moment()
                                                  .subtract(1, 'days')
                                                  .toISOString(),
                                              timezone: 'USA',
                                          },
                                          {
                                              id: 3,
                                              name: 'Indigo Creative',
                                              created_at: moment()
                                                  .subtract(3, 'days')
                                                  .toISOString(),
                                              timezone: 'Canada',
                                          },
                                      ]
                                ).map((org: any) => (
                                    <div
                                        key={org.id}
                                        className="flex items-center gap-4"
                                    >
                                        <Avatar className="h-10 w-10 border border-border bg-foreground text-background shadow-sm">
                                            <AvatarFallback className="text-xs font-bold">
                                                {getInitials(org.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">
                                                {org.name}
                                            </p>
                                            <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                                                Added{' '}
                                                {moment(
                                                    org.created_at,
                                                ).fromNow()}{' '}
                                                • {org.timezone || 'Global'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <Button
                                    variant="outline"
                                    className="mt-4 h-10 w-full border-border font-bold shadow-sm"
                                >
                                    Load More Activity
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Minimal Footer */}
            <div className="flex flex-col items-center justify-between gap-4 border-t bg-background px-8 py-6 md:flex-row">
                <p className="text-[11px] font-medium text-muted-foreground">
                    © 2024 Providence HRMS. All rights reserved.
                </p>
                <div className="flex items-center gap-6 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                    <a
                        href="#"
                        className="transition-colors hover:text-foreground"
                    >
                        Privacy Policy
                    </a>
                    <a
                        href="#"
                        className="transition-colors hover:text-foreground"
                    >
                        Terms of Service
                    </a>
                    <a
                        href="#"
                        className="transition-colors hover:text-foreground"
                    >
                        Help Center
                    </a>
                </div>
            </div>
        </AppLayout>
    );
}

// Sub-component for Top Metrics
function SummaryCard({
    title,
    value,
    icon: Icon,
    trend,
    subtext,
}: {
    title: string;
    value: number | string;
    icon: any;
    trend?: string;
    subtext?: string;
}) {
    return (
        <Card className="border-border bg-background shadow-sm">
            <CardContent className="flex h-full flex-col justify-between p-6">
                <div className="mb-4 flex items-start justify-between">
                    <p className="text-[10px] leading-tight font-bold tracking-widest text-muted-foreground uppercase">
                        {title}
                    </p>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted/50 text-foreground">
                        <Icon className="h-4 w-4" />
                    </div>
                </div>
                <div className="mt-auto space-y-1.5">
                    <h3 className="text-3xl font-extrabold tracking-tighter text-foreground">
                        {typeof value === 'number'
                            ? value.toLocaleString()
                            : value}
                    </h3>
                    {trend ? (
                        <p className="flex items-center gap-1.5 text-xs font-bold text-primary">
                            {trend}
                        </p>
                    ) : subtext ? (
                        <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                            {subtext}
                        </p>
                    ) : null}
                </div>
            </CardContent>
        </Card>
    );
}
