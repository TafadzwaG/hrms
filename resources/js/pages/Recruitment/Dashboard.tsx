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
    Users,
    UserSearch,
} from 'lucide-react';

type RecentActivity = {
    id: number;
    type: string;
    description: string;
    user: string;
    created_at: string | null;
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
};

const activityStyles: Record<string, string> = {
    candidate: 'border-transparent bg-blue-100 text-blue-700',
    company: 'border-transparent bg-purple-100 text-purple-700',
    vacancy: 'border-transparent bg-green-100 text-green-700',
    application: 'border-transparent bg-orange-100 text-orange-700',
    payment: 'border-transparent bg-emerald-100 text-emerald-700',
};

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
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
    } = usePage<DashboardProps>().props;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Recruitment', href: '/recruitment' },
                { title: 'Dashboard' },
            ]}
        >
            <Head title="Recruitment Dashboard" />

            <div className="w-full space-y-8 bg-white p-6 lg:p-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
                            Recruitment Dashboard
                        </h1>
                        <p className="text-lg text-zinc-500">
                            Overview of candidates, companies, vacancies, and applications.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/candidate-profiles/create">
                            <Button className="h-11 rounded-md bg-zinc-900 px-6 text-white shadow-sm transition-all hover:bg-zinc-800">
                                <Plus className="mr-2 h-5 w-5" /> Add Candidate
                            </Button>
                        </Link>
                        <Link href="/company-profiles/create">
                            <Button variant="outline" className="h-11 border-zinc-200">
                                <Building2 className="mr-2 h-5 w-5" /> Add Company
                            </Button>
                        </Link>
                        <Link href="/vacancies/create">
                            <Button variant="outline" className="h-11 border-zinc-200">
                                <Briefcase className="mr-2 h-5 w-5" /> Post Vacancy
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {[
                        {
                            label: 'Active Candidates',
                            val: stats.active_candidates,
                            icon: Users,
                        },
                        {
                            label: 'Companies',
                            val: stats.companies,
                            icon: Building2,
                        },
                        {
                            label: 'Open Vacancies',
                            val: stats.vacancies,
                            icon: Briefcase,
                        },
                        {
                            label: 'Applications',
                            val: stats.applications,
                            icon: ClipboardList,
                        },
                        {
                            label: 'Total Revenue',
                            val: formatMoney(stats.revenue),
                            icon: Banknote,
                            isMoney: true,
                        },
                    ].map((item, index) => (
                        <Card key={index} className="border-zinc-200 shadow-none">
                            <CardContent className="flex items-center justify-between p-6">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium tracking-wider text-zinc-500 uppercase">
                                        {item.label}
                                    </p>
                                    <p className="text-3xl font-bold text-zinc-900">
                                        {item.val}
                                    </p>
                                </div>
                                <item.icon className="h-6 w-6 text-zinc-400" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2">
                        <Card className="border-zinc-200 shadow-none">
                            <CardHeader className="bg-muted/30">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <ClipboardList className="h-5 w-5 text-muted-foreground" />
                                        Recent Activity
                                    </CardTitle>
                                    <Link href="/candidate-profiles">
                                        <Button variant="ghost" size="sm">
                                            View All <ArrowRight className="ml-1 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-zinc-50">
                                        <TableRow>
                                            <TableHead className="font-bold text-zinc-900">Type</TableHead>
                                            <TableHead className="font-bold text-zinc-900">Description</TableHead>
                                            <TableHead className="font-bold text-zinc-900">User</TableHead>
                                            <TableHead className="font-bold text-zinc-900">Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recent_activities.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="py-8 text-center text-zinc-400">
                                                    No recent activity found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            recent_activities.map((activity) => (
                                                <TableRow key={activity.id} className="hover:bg-zinc-50/50">
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className={`${activityStyles[activity.type] ?? 'border-zinc-200 bg-zinc-50 text-zinc-700'} font-semibold`}
                                                        >
                                                            {formatLabel(activity.type)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="font-medium text-zinc-700">
                                                        {activity.description}
                                                    </TableCell>
                                                    <TableCell className="text-zinc-500">
                                                        {activity.user}
                                                    </TableCell>
                                                    <TableCell className="text-zinc-500">
                                                        {formatDate(activity.created_at)}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <div>
                        <Card className="border-zinc-200 shadow-none">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <UserSearch className="h-5 w-5 text-muted-foreground" />
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 p-6">
                                <Link href="/candidate-profiles/create" className="block">
                                    <Button variant="outline" className="h-12 w-full justify-start border-zinc-200">
                                        <Users className="mr-3 h-5 w-5 text-blue-500" />
                                        Register New Candidate
                                    </Button>
                                </Link>
                                <Link href="/company-profiles/create" className="block">
                                    <Button variant="outline" className="h-12 w-full justify-start border-zinc-200">
                                        <Building2 className="mr-3 h-5 w-5 text-purple-500" />
                                        Add New Company
                                    </Button>
                                </Link>
                                <Link href="/vacancies/create" className="block">
                                    <Button variant="outline" className="h-12 w-full justify-start border-zinc-200">
                                        <Briefcase className="mr-3 h-5 w-5 text-green-500" />
                                        Post New Vacancy
                                    </Button>
                                </Link>
                                <Link href="/recruitment/directory" className="block">
                                    <Button variant="outline" className="h-12 w-full justify-start border-zinc-200">
                                        <UserSearch className="mr-3 h-5 w-5 text-orange-500" />
                                        Browse Candidate Directory
                                    </Button>
                                </Link>
                                <Link href="/recruitment/admin/payments" className="block">
                                    <Button variant="outline" className="h-12 w-full justify-start border-zinc-200">
                                        <Banknote className="mr-3 h-5 w-5 text-emerald-500" />
                                        View Payments
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
