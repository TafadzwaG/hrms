import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RoleScopeBar } from '@/components/role-scope-bar';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { PageRoleScope } from '@/types/auth';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    Banknote,
    ClipboardList,
    DollarSign,
    Heart,
    Plus,
    Shield,
    Users,
} from 'lucide-react';

type RecentEnrollment = {
    id: number;
    employee: { id: number; full_name: string; staff_number: string };
    benefit: { id: number; name: string; category: string };
    plan: { id: number; name: string } | null;
    status: string;
    effective_date: string | null;
    employer_contribution: string | number | null;
    employee_contribution: string | number | null;
    created_at: string | null;
};

type CategorySummary = {
    category: string;
    count: number;
    active_enrollments: number;
    total_employer_cost: number;
};

type DashboardStats = {
    total_active_benefits: number;
    active_enrollments: number;
    monthly_employer_cost: number;
    monthly_employee_deductions: number;
    expiring_soon: number;
};

type DashboardProps = {
    stats: DashboardStats;
    recent_enrollments: RecentEnrollment[];
    category_summary: CategorySummary[];
    scope?: PageRoleScope;
};

const statusStyles: Record<string, string> = {
    active: 'badge-tone-success',
    draft: 'badge-tone-muted',
    suspended: 'badge-tone-warning',
    terminated: 'badge-tone-danger',
    expired: 'badge-tone-muted',
    cancelled: 'badge-tone-danger',
};

const categoryStyles: Record<string, string> = {
    health: 'badge-tone-info',
    retirement: 'badge-tone-accent',
    allowance: 'badge-tone-success',
    insurance: 'badge-tone-info',
    wellness: 'badge-tone-success',
    education: 'badge-tone-warning',
    loan: 'badge-tone-danger',
    other: 'badge-tone-muted',
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

export default function BenefitsDashboard() {
    const {
        stats = {
            total_active_benefits: 0,
            active_enrollments: 0,
            monthly_employer_cost: 0,
            monthly_employee_deductions: 0,
            expiring_soon: 0,
        },
        recent_enrollments = [],
        category_summary = [],
        scope,
    } = usePage<DashboardProps>().props;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Benefits', href: '/benefits' },
                { title: 'Dashboard' },
            ]}
        >
            <Head title="Benefits Dashboard" />

            <div className="w-full space-y-6 bg-muted/10 p-4 lg:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">
                            Benefits Dashboard
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Overview of employee benefits, enrollments, and costs.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/benefits/create">
                            <Button className="h-11 px-6 shadow-sm">
                                <Plus className="mr-2 h-5 w-5" /> Add Benefit
                            </Button>
                        </Link>
                        <Link href="/benefit-enrollments/create">
                            <Button variant="outline" className="h-11">
                                <Users className="mr-2 h-5 w-5" /> New Enrollment
                            </Button>
                        </Link>
                        <Link href="/benefits/reports">
                            <Button variant="outline" className="h-11">
                                <ClipboardList className="mr-2 h-5 w-5" /> View Reports
                            </Button>
                        </Link>
                    </div>
                </div>

                <RoleScopeBar
                    scope={scope}
                    path="/benefits/dashboard"
                />

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {[
                        {
                            label: 'Total Active Benefits',
                            val: stats.total_active_benefits,
                            icon: Shield,
                        },
                        {
                            label: 'Active Enrollments',
                            val: stats.active_enrollments,
                            icon: Users,
                        },
                        {
                            label: 'Monthly Employer Cost',
                            val: formatMoney(stats.monthly_employer_cost),
                            icon: DollarSign,
                            isMoney: true,
                        },
                        {
                            label: 'Monthly Employee Deductions',
                            val: formatMoney(stats.monthly_employee_deductions),
                            icon: Banknote,
                            isMoney: true,
                        },
                        {
                            label: 'Expiring Soon',
                            val: stats.expiring_soon,
                            icon: AlertTriangle,
                        },
                    ].map((item, index) => (
                        <Card key={index} className="border-border bg-card shadow-none">
                            <CardContent className="flex items-center justify-between p-6">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium tracking-wider text-muted-foreground uppercase">
                                        {item.label}
                                    </p>
                                    <p className="text-2xl font-semibold text-foreground">
                                        {item.val}
                                    </p>
                                </div>
                                <item.icon className="h-6 w-6 text-muted-foreground" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Recent Enrollments */}
                    <div className="lg:col-span-2">
                        <Card className="border-border bg-card shadow-none">
                            <CardHeader className="bg-muted/30">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Users className="h-5 w-5 text-muted-foreground" />
                                        Recent Enrollments
                                    </CardTitle>
                                    <Link href="/benefit-enrollments">
                                        <Button variant="ghost" size="sm">
                                            View All <ArrowRight className="ml-1 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-muted/10">
                                        <TableRow>
                                            <TableHead className="font-bold text-foreground">Employee</TableHead>
                                            <TableHead className="font-bold text-foreground">Benefit</TableHead>
                                            <TableHead className="font-bold text-foreground">Status</TableHead>
                                            <TableHead className="font-bold text-foreground">Effective Date</TableHead>
                                            <TableHead className="text-right font-bold text-foreground">Employer</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recent_enrollments.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                                                    No recent enrollments found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            recent_enrollments.map((enrollment) => (
                                                <TableRow key={enrollment.id} className="hover:bg-muted/20">
                                                    <TableCell>
                                                        <div>
                                                            <p className="font-bold text-foreground">{enrollment.employee.full_name}</p>
                                                            <p className="text-xs text-muted-foreground">{enrollment.employee.staff_number}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <p className="font-medium text-foreground">{enrollment.benefit.name}</p>
                                                            <Badge
                                                                variant="outline"
                                                                className={`${categoryStyles[enrollment.benefit.category] ?? categoryStyles.other} text-xs font-semibold`}
                                                            >
                                                                {formatLabel(enrollment.benefit.category)}
                                                            </Badge>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className={`${statusStyles[enrollment.status] ?? 'badge-tone-muted'} font-semibold`}
                                                        >
                                                            {formatLabel(enrollment.status)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {formatDate(enrollment.effective_date)}
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold text-foreground">
                                                        {formatMoney(enrollment.employer_contribution)}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Enrollments by Category */}
                    <div>
                        <Card className="border-border bg-card shadow-none">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Heart className="h-5 w-5 text-muted-foreground" />
                                    Enrollments by Category
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6">
                                {category_summary.length === 0 ? (
                                    <p className="py-4 text-center text-sm text-muted-foreground">
                                        No category data available.
                                    </p>
                                ) : (
                                    category_summary.map((cat, index) => (
                                        <div key={index} className="flex items-center justify-between rounded-lg border border-border/60 bg-background p-4">
                                            <div className="space-y-1">
                                                <Badge
                                                    variant="outline"
                                                    className={`${categoryStyles[cat.category] ?? categoryStyles.other} font-semibold`}
                                                >
                                                    {formatLabel(cat.category)}
                                                </Badge>
                                                <p className="text-xs text-muted-foreground">
                                                    {cat.count} benefit{cat.count !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-foreground">{cat.active_enrollments}</p>
                                                <p className="text-xs text-muted-foreground">enrollments</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
