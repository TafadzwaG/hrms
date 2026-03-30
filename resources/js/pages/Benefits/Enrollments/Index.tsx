import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    IndexTableCard,
    IndexTableEmptyRow,
    IndexTableHead,
    IndexTableHeaderRow,
    IndexTablePagination,
} from '@/components/index-table';
import { Input } from '@/components/ui/input';
import { RoleScopeBar } from '@/components/role-scope-bar';
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
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { buildIndexParams } from '@/lib/index-table';
import type { PageRoleScope } from '@/types/auth';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Banknote,
    Clock,
    DollarSign,
    Eye,
    MoreHorizontal,
    Pencil,
    Plus,
    RotateCcw,
    Search,
    Trash2,
    Users,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type EnrollmentRow = {
    id: number;
    employee: { id: number; full_name: string; staff_number: string };
    benefit: { id: number; name: string };
    plan: { id: number; name: string } | null;
    status: string;
    effective_date: string | null;
    employee_contribution: string | number | null;
    employer_contribution: string | number | null;
    links: {
        show: string;
        edit: string;
    };
};

type EnrollmentStats = {
    active: number;
    total_employer: number;
    total_employee: number;
    pending: number;
};

type BenefitOption = {
    id: number;
    name: string;
};

type EnrollmentsPageProps = {
    enrollments: {
        data: EnrollmentRow[];
        total: number;
        current_page: number;
        last_page: number;
        from?: number;
        to?: number;
        per_page?: number;
    };
    filters: {
        search?: string | null;
        benefit_id?: number | string | null;
        status?: string | null;
        scope_view?: string | null;
    };
    benefits: BenefitOption[];
    statuses: string[];
    stats?: EnrollmentStats;
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

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatMoney(value: string | number | null | undefined) {
    if (value === null || value === undefined || value === '') return '---';
    const amount = Number(value);
    if (Number.isNaN(amount)) return String(value);
    return amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function formatDate(value: string | null) {
    if (!value) return '---';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export default function EnrollmentIndex() {
    const {
        enrollments,
        filters,
        stats,
        benefits = [],
        statuses = [],
        scope,
    } = usePage<EnrollmentsPageProps>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [benefitId, setBenefitId] = useState(
        filters.benefit_id ? String(filters.benefit_id) : 'all',
    );
    const [status, setStatus] = useState(filters.status ?? 'all');
    const [showFilters, setShowFilters] = useState(false);
    const [enrollmentToDelete, setEnrollmentToDelete] =
        useState<EnrollmentRow | null>(null);

    const initialRender = useRef(true);

    const computedStats = {
        active: stats?.active ?? 0,
        total_employer: stats?.total_employer ?? 0,
        total_employee: stats?.total_employee ?? 0,
        pending: stats?.pending ?? 0,
    };

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        const timer = window.setTimeout(() => {
            router.get(
                '/benefit-enrollments',
                buildIndexParams(filters, {
                    search: search || undefined,
                    benefit_id: benefitId !== 'all' ? benefitId : undefined,
                    status: status !== 'all' ? status : undefined,
                }),
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300);

        return () => window.clearTimeout(timer);
    }, [search, benefitId, status]);

    const handleResetFilters = () => {
        setSearch('');
        setBenefitId('all');
        setStatus('all');
        setShowFilters(false);
    };

    const handleDeleteEnrollment = () => {
        if (!enrollmentToDelete) return;

        router.delete(`/benefit-enrollments/${enrollmentToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => setEnrollmentToDelete(null),
        });
    };

    const activeFilters = {
        ...filters,
        search: search || undefined,
        benefit_id: benefitId !== 'all' ? benefitId : undefined,
        status: status !== 'all' ? status : undefined,
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Benefits', href: '/benefits' },
                { title: 'Enrollments' },
            ]}
        >
            <Head title="Benefit Enrollments" />

            <div className="w-full space-y-6 bg-muted/10 p-4 lg:p-8">
                <RoleScopeBar
                    scope={scope}
                    path="/benefit-enrollments"
                    filters={filters}
                />

                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">
                            Benefit Enrollments
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Manage employee benefit enrollments and contributions.
                        </p>
                    </div>
                    <Link href="/benefit-enrollments/create">
                        <Button className="h-11 px-6 shadow-sm">
                            <Plus className="mr-2 h-5 w-5" /> New Enrollment
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            label: 'Active Enrollments',
                            val: computedStats.active,
                            icon: Users,
                        },
                        {
                            label: 'Total Employer Contributions',
                            val: formatMoney(computedStats.total_employer),
                            icon: DollarSign,
                        },
                        {
                            label: 'Total Employee Deductions',
                            val: formatMoney(computedStats.total_employee),
                            icon: Banknote,
                        },
                        {
                            label: 'Pending',
                            val: computedStats.pending,
                            icon: Clock,
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

                <div className="flex flex-col gap-4 border-t border-border/50 pt-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by employee name or staff number..."
                                className="h-11 bg-background pl-10"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className="h-11"
                                onClick={() => setShowFilters((c) => !c)}
                                type="button"
                            >
                                <MoreHorizontal className="mr-2 h-4 w-4" /> More Filters
                            </Button>
                            <Button
                                variant="ghost"
                                className="h-11 text-muted-foreground"
                                onClick={handleResetFilters}
                                type="button"
                            >
                                <RotateCcw className="mr-2 h-4 w-4" /> Reset
                            </Button>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="grid grid-cols-1 gap-4 rounded-md border border-border bg-muted/20 p-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                    Benefit
                                </p>
                                <Select value={benefitId} onValueChange={setBenefitId}>
                                    <SelectTrigger className="h-11 bg-background">
                                        <SelectValue placeholder="All benefits" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All benefits</SelectItem>
                                        {benefits.map((benefit) => (
                                            <SelectItem key={benefit.id} value={String(benefit.id)}>
                                                {benefit.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                    Status
                                </p>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="h-11 bg-background">
                                        <SelectValue placeholder="All statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All statuses</SelectItem>
                                        {statuses.map((item) => (
                                            <SelectItem key={item} value={item}>
                                                {formatLabel(item)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                </div>

                <IndexTableCard>
                    <Table>
                        <TableHeader>
                            <IndexTableHeaderRow>
                                <IndexTableHead>Employee</IndexTableHead>
                                <IndexTableHead>Benefit</IndexTableHead>
                                <IndexTableHead>Plan</IndexTableHead>
                                <IndexTableHead>Status</IndexTableHead>
                                <IndexTableHead>Effective Date</IndexTableHead>
                                <IndexTableHead>Employee Contrib.</IndexTableHead>
                                <IndexTableHead>Employer Contrib.</IndexTableHead>
                                <IndexTableHead align="right" className="px-6">
                                    Actions
                                </IndexTableHead>
                            </IndexTableHeaderRow>
                        </TableHeader>
                        <TableBody>
                            {enrollments.data.length === 0 ? (
                                <IndexTableEmptyRow colSpan={8}>
                                    No enrollments found.
                                </IndexTableEmptyRow>
                            ) : (
                                enrollments.data.map((enrollment) => (
                                    <TableRow key={enrollment.id} className="hover:bg-muted/20">
                                        <TableCell>
                                            <div>
                                                <p className="font-bold text-foreground">
                                                    {enrollment.employee.full_name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {enrollment.employee.staff_number}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium text-foreground">
                                            {enrollment.benefit.name}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {enrollment.plan?.name ?? '---'}
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
                                        <TableCell className="font-medium text-foreground">
                                            {formatMoney(enrollment.employee_contribution)}
                                        </TableCell>
                                        <TableCell className="font-medium text-foreground">
                                            {formatMoney(enrollment.employer_contribution)}
                                        </TableCell>
                                        <TableCell className="px-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                    asChild
                                                >
                                                    <Link href={enrollment.links.show}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                    asChild
                                                >
                                                    <Link href={enrollment.links.edit}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                    onClick={() => setEnrollmentToDelete(enrollment)}
                                                    type="button"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    <IndexTablePagination
                        pagination={enrollments}
                        filters={activeFilters}
                        path="/benefit-enrollments"
                        label="enrollments"
                    />
                </IndexTableCard>
            </div>

            <AlertDialog
                open={!!enrollmentToDelete}
                onOpenChange={() => setEnrollmentToDelete(null)}
            >
                <AlertDialogContent className="rounded-none border-border bg-popover">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold">
                            Confirm Deletion
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                            You are about to remove the enrollment for{' '}
                            <span className="font-bold text-foreground">
                                {enrollmentToDelete?.employee.full_name}
                            </span>
                            . This action is permanent and cannot be reversed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-border">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="border-none bg-red-600 text-white hover:bg-red-700"
                            onClick={handleDeleteEnrollment}
                        >
                            Delete Enrollment
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
