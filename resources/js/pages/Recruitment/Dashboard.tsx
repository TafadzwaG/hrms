import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Banknote,
    Briefcase,
    Building2,
    ClipboardList,
    Plus,
    UserSearch,
    Users,
} from 'lucide-react';

type RecentActivity = {
    id: string;
    type: string;
    description: string;
    user: string;
    created_at: string | null;
    href?: string | null;
};

type SummaryItem = {
    id: number;
    title: string;
    subtitle: string;
    meta: string;
    href: string;
};

type DashboardStats = {
    active_candidates: number;
    companies: number;
    vacancies: number;
    applications: number;
    revenue: number;
};

type DashboardProps = {
    stats: DashboardStats;
    recent_activities: RecentActivity[];
    recent_candidates: SummaryItem[];
    recent_employers: SummaryItem[];
    recent_vacancies: SummaryItem[];
    recent_payments: SummaryItem[];
};

const activityStyles: Record<string, string> = {
    candidate: 'badge-tone-info',
    company: 'badge-tone-accent',
    vacancy: 'badge-tone-success',
    application: 'badge-tone-warning',
    payment: 'badge-tone-chart-3',
};

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatMoney(value: string | number | null | undefined) {
    if (value === null || value === undefined || value === '') return '—';
    const amount = Number(value);
    if (Number.isNaN(amount)) return String(value);

    return amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function formatDate(value: string | null) {
    if (!value) return '—';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function SummaryListCard({
    title,
    description,
    items,
    href,
}: {
    title: string;
    description: string;
    items: SummaryItem[];
    href: string;
}) {
    return (
        <Card className="border-border/70 shadow-sm">
            <CardHeader className="bg-muted/20">
                <div className="flex items-center justify-between gap-3">
                    <div className="space-y-1">
                        <CardTitle>{title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                    <Link href={href}>
                        <Button variant="ghost" size="sm">
                            View all
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </CardHeader>
            <CardContent className="space-y-3 p-5">
                {items.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border/60 px-4 py-8 text-center text-sm text-muted-foreground">
                        No records available.
                    </div>
                ) : (
                    items.map((item) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            className="block rounded-lg border border-border/60 bg-background px-4 py-3 transition-colors hover:bg-muted/20"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1">
                                    <div className="text-sm font-semibold text-foreground">{item.title}</div>
                                    <div className="text-xs text-muted-foreground">{item.subtitle}</div>
                                </div>
                                <span className="text-[11px] font-medium text-muted-foreground">{item.meta}</span>
                            </div>
                        </Link>
                    ))
                )}
            </CardContent>
        </Card>
    );
}

export default function RecruitmentDashboard() {
    const {
        stats = {
            active_candidates: 0,
            companies: 0,
            vacancies: 0,
            applications: 0,
            revenue: 0,
        },
        recent_activities = [],
        recent_candidates = [],
        recent_employers = [],
        recent_vacancies = [],
        recent_payments = [],
    } = usePage<DashboardProps>().props;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Recruitment', href: '/recruitment' },
                { title: 'Dashboard' },
            ]}
        >
            <Head title="Recruitment Dashboard" />

            <div className="w-full space-y-6 bg-muted/10 p-4 lg:p-8">
                <Card className="border-border/70 shadow-sm">
                    <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="space-y-2">
                            <Badge variant="outline" className="rounded-full px-3 py-1">
                                Recruitment admin
                            </Badge>
                            <div className="space-y-1">
                                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                                    Recruitment Dashboard
                                </h1>
                                <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
                                    Monitor candidate listings, employer profiles, vacancies, applications, and recruitment revenue from one admin surface.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/candidate-profiles/create">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Candidate
                                </Button>
                            </Link>
                            <Link href="/company-profiles/create">
                                <Button variant="outline">
                                    <Building2 className="mr-2 h-4 w-4" />
                                    Add Employer
                                </Button>
                            </Link>
                            <Link href="/vacancies/create">
                                <Button variant="outline">
                                    <Briefcase className="mr-2 h-4 w-4" />
                                    Post Vacancy
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    {[
                        { label: 'Active Candidates', value: stats.active_candidates, icon: Users },
                        { label: 'Employers', value: stats.companies, icon: Building2 },
                        { label: 'Published Vacancies', value: stats.vacancies, icon: Briefcase },
                        { label: 'Applications', value: stats.applications, icon: ClipboardList },
                        { label: 'Revenue', value: formatMoney(stats.revenue), icon: Banknote },
                    ].map((item) => (
                        <Card key={item.label} className="border-border/70 shadow-sm">
                            <CardContent className="flex items-center justify-between p-6">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                        {item.label}
                                    </p>
                                    <p className="text-2xl font-semibold text-foreground">{item.value}</p>
                                </div>
                                <item.icon className="h-6 w-6 text-muted-foreground" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
                    <Card className="border-border/70 shadow-sm">
                        <CardHeader className="bg-muted/20">
                            <div className="flex items-center justify-between gap-3">
                                <div className="space-y-1">
                                    <CardTitle>Recent activity</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Latest candidate, employer, vacancy, application, and payment updates.
                                    </p>
                                </div>
                                <Link href="/candidate-profiles">
                                    <Button variant="ghost" size="sm">
                                        View lists
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/10">
                                    <TableRow>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recent_activities.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                                                No recent activity found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        recent_activities.map((activity) => (
                                            <TableRow key={activity.id}>
                                                <TableCell>
                                                    <Badge variant="outline" className={activityStyles[activity.type] ?? 'badge-tone-muted'}>
                                                        {formatLabel(activity.type)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-medium text-foreground">
                                                    {activity.description}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {activity.user}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {formatDate(activity.created_at)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className="border-border/70 shadow-sm">
                        <CardHeader className="bg-muted/20">
                            <CardTitle className="flex items-center gap-2">
                                <UserSearch className="h-5 w-5 text-muted-foreground" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 p-6">
                            <Link href="/candidate-profiles" className="block">
                                <Button variant="outline" className="h-11 w-full justify-start">
                                    <Users className="mr-3 h-4 w-4" />
                                    Manage Candidates
                                </Button>
                            </Link>
                            <Link href="/company-profiles" className="block">
                                <Button variant="outline" className="h-11 w-full justify-start">
                                    <Building2 className="mr-3 h-4 w-4" />
                                    Manage Employers
                                </Button>
                            </Link>
                            <Link href="/vacancies" className="block">
                                <Button variant="outline" className="h-11 w-full justify-start">
                                    <Briefcase className="mr-3 h-4 w-4" />
                                    Manage Vacancies
                                </Button>
                            </Link>
                            <Link href="/vacancy-applications" className="block">
                                <Button variant="outline" className="h-11 w-full justify-start">
                                    <ClipboardList className="mr-3 h-4 w-4" />
                                    Review Applications
                                </Button>
                            </Link>
                            <Link href="/recruitment/admin/payments" className="block">
                                <Button variant="outline" className="h-11 w-full justify-start">
                                    <Banknote className="mr-3 h-4 w-4" />
                                    Review Payments
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    <SummaryListCard
                        title="Candidates"
                        description="Recently updated candidate listings."
                        items={recent_candidates}
                        href="/candidate-profiles"
                    />
                    <SummaryListCard
                        title="Employers"
                        description="Recently updated employer profiles."
                        items={recent_employers}
                        href="/company-profiles"
                    />
                    <SummaryListCard
                        title="Vacancies"
                        description="Latest vacancies in the admin pipeline."
                        items={recent_vacancies}
                        href="/vacancies"
                    />
                    <SummaryListCard
                        title="Payments"
                        description="Recent recruitment payments and listing fees."
                        items={recent_payments}
                        href="/recruitment/admin/payments"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
