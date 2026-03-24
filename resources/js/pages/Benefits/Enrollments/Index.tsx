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
import AppLayout from '@/layouts/app-layout';
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
import ReactPaginate from 'react-paginate';

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
    };
    benefits: BenefitOption[];
    statuses: string[];
    stats?: EnrollmentStats;
};

const statusStyles: Record<string, string> = {
    active: 'border-transparent bg-emerald-100 text-emerald-700',
    draft: 'border-transparent bg-zinc-100 text-zinc-600',
    suspended: 'border-transparent bg-amber-100 text-amber-700',
    terminated: 'border-transparent bg-red-100 text-red-700',
    expired: 'border-transparent bg-slate-100 text-slate-600',
    cancelled: 'border-transparent bg-rose-100 text-rose-600',
};

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatMoney(value: string | number | null | undefined) {
    if (value === null || value === undefined || value === '') return '---';
    const amount = Number(value);
    if (Number.isNaN(amount)) return String(value);
    return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(value: string | null) {
    if (!value) return '---';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function EnrollmentIndex() {
    const {
        enrollments,
        filters,
        stats,
        benefits = [],
        statuses = [],
    } = usePage<EnrollmentsPageProps>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [benefitId, setBenefitId] = useState(
        filters.benefit_id ? String(filters.benefit_id) : 'all',
    );
    const [status, setStatus] = useState(filters.status ?? 'all');
    const [showFilters, setShowFilters] = useState(false);
    const [enrollmentToDelete, setEnrollmentToDelete] = useState<EnrollmentRow | null>(null);

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
                {
                    search: search || undefined,
                    benefit_id: benefitId !== 'all' ? benefitId : undefined,
                    status: status !== 'all' ? status : undefined,
                },
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

    const handlePageChange = ({ selected }: { selected: number }) => {
        router.get(
            '/benefit-enrollments',
            {
                page: selected + 1,
                search: search || undefined,
                benefit_id: benefitId !== 'all' ? benefitId : undefined,
                status: status !== 'all' ? status : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const perPage = enrollments.per_page ?? (enrollments.data.length || 1);
    const showingFrom =
        enrollments.from ??
        (enrollments.total === 0 ? 0 : (enrollments.current_page - 1) * perPage + 1);
    const showingTo =
        enrollments.to ?? Math.min(enrollments.current_page * perPage, enrollments.total);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Benefits', href: '/benefits' },
                { title: 'Enrollments' },
            ]}
        >
            <Head title="Benefit Enrollments" />

            <div className="w-full space-y-6 bg-white p-4 lg:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
                            Benefit Enrollments
                        </h1>
                        <p className="text-lg text-zinc-500">
                            Manage employee benefit enrollments and contributions.
                        </p>
                    </div>
                    <Link href="/benefit-enrollments/create">
                        <Button className="h-11 rounded-md bg-zinc-900 px-6 text-white shadow-sm transition-all hover:bg-zinc-800">
                            <Plus className="mr-2 h-5 w-5" /> New Enrollment
                        </Button>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: 'Active Enrollments', val: computedStats.active, icon: Users },
                        { label: 'Total Employer Contributions', val: formatMoney(computedStats.total_employer), icon: DollarSign },
                        { label: 'Total Employee Deductions', val: formatMoney(computedStats.total_employee), icon: Banknote },
                        { label: 'Pending', val: computedStats.pending, icon: Clock },
                    ].map((item, index) => (
                        <Card key={index} className="border-zinc-200 shadow-none">
                            <CardContent className="flex items-center justify-between p-6">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium tracking-wider text-zinc-500 uppercase">
                                        {item.label}
                                    </p>
                                    <p className="text-2xl font-semibold text-zinc-900">{item.val}</p>
                                </div>
                                <item.icon className="h-6 w-6 text-zinc-400" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 border-t border-zinc-100 pt-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                            <Input
                                placeholder="Search by employee name or staff number..."
                                className="h-11 border-zinc-200 pl-10 focus:ring-zinc-900"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className="h-11 border-zinc-200"
                                onClick={() => setShowFilters((c) => !c)}
                                type="button"
                            >
                                <MoreHorizontal className="mr-2 h-4 w-4" /> More Filters
                            </Button>
                            <Button
                                variant="ghost"
                                className="h-11 text-zinc-500"
                                onClick={handleResetFilters}
                                type="button"
                            >
                                <RotateCcw className="mr-2 h-4 w-4" /> Reset
                            </Button>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="grid grid-cols-1 gap-4 rounded-md border border-zinc-200 bg-zinc-50/40 p-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Benefit</p>
                                <Select value={benefitId} onValueChange={setBenefitId}>
                                    <SelectTrigger className="h-11 border-zinc-200 bg-white">
                                        <SelectValue placeholder="All benefits" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All benefits</SelectItem>
                                        {benefits.map((b) => (
                                            <SelectItem key={b.id} value={String(b.id)}>
                                                {b.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Status</p>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="h-11 border-zinc-200 bg-white">
                                        <SelectValue placeholder="All statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All statuses</SelectItem>
                                        {statuses.map((s) => (
                                            <SelectItem key={s} value={s}>
                                                {formatLabel(s)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-md border border-zinc-200">
                    <Table>
                        <TableHeader className="bg-zinc-50">
                            <TableRow>
                                <TableHead className="font-bold text-zinc-900">Employee</TableHead>
                                <TableHead className="font-bold text-zinc-900">Benefit</TableHead>
                                <TableHead className="font-bold text-zinc-900">Plan</TableHead>
                                <TableHead className="font-bold text-zinc-900">Status</TableHead>
                                <TableHead className="font-bold text-zinc-900">Effective Date</TableHead>
                                <TableHead className="font-bold text-zinc-900">Employee Contrib.</TableHead>
                                <TableHead className="font-bold text-zinc-900">Employer Contrib.</TableHead>
                                <TableHead className="px-6 text-right font-bold text-zinc-900">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {enrollments.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="py-8 text-center text-zinc-400">
                                        No enrollments found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                enrollments.data.map((enrollment) => (
                                    <TableRow key={enrollment.id} className="hover:bg-zinc-50/50">
                                        <TableCell>
                                            <div>
                                                <p className="font-bold text-zinc-900">{enrollment.employee.full_name}</p>
                                                <p className="text-xs text-zinc-400">{enrollment.employee.staff_number}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium text-zinc-700">{enrollment.benefit.name}</TableCell>
                                        <TableCell className="text-zinc-500">{enrollment.plan?.name ?? '---'}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`${statusStyles[enrollment.status] ?? 'border-zinc-200 bg-zinc-50 text-zinc-700'} font-semibold`}
                                            >
                                                {formatLabel(enrollment.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-zinc-500">{formatDate(enrollment.effective_date)}</TableCell>
                                        <TableCell>{formatMoney(enrollment.employee_contribution)}</TableCell>
                                        <TableCell>{formatMoney(enrollment.employer_contribution)}</TableCell>
                                        <TableCell className="px-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                    <Link href={enrollment.links.show}>
                                                        <Eye className="h-4 w-4 text-zinc-400" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                    <Link href={enrollment.links.edit}>
                                                        <Pencil className="h-4 w-4 text-zinc-400" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => setEnrollmentToDelete(enrollment)}
                                                    type="button"
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-400" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-zinc-100 pt-6 md:flex-row">
                    <p className="text-sm font-medium text-zinc-500">
                        Showing{' '}
                        <span className="text-zinc-900">{showingFrom}-{showingTo}</span>{' '}
                        of <span className="text-zinc-900">{enrollments.total}</span> enrollments
                    </p>
                    <ReactPaginate
                        pageCount={enrollments.last_page}
                        forcePage={Math.max((enrollments.current_page ?? 1) - 1, 0)}
                        onPageChange={handlePageChange}
                        containerClassName="flex gap-1"
                        pageLinkClassName="flex h-10 w-10 items-center justify-center rounded-md border text-sm font-bold transition-colors hover:bg-zinc-50"
                        activeLinkClassName="!border-zinc-900 !bg-zinc-900 !text-white"
                        previousLabel="←"
                        nextLabel="→"
                        previousLinkClassName="mr-2 flex h-10 items-center justify-center rounded-md border px-4 text-sm font-bold"
                        nextLinkClassName="ml-2 flex h-10 items-center justify-center rounded-md border px-4 text-sm font-bold"
                        disabledClassName="pointer-events-none opacity-30"
                        breakLabel="..."
                        breakLinkClassName="flex h-10 w-10 items-center justify-center rounded-md border text-sm font-bold"
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={3}
                    />
                </div>
            </div>

            {/* Delete Alert */}
            <AlertDialog
                open={!!enrollmentToDelete}
                onOpenChange={() => setEnrollmentToDelete(null)}
            >
                <AlertDialogContent className="rounded-none border-zinc-200">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold">
                            Confirm Deletion
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-500">
                            You are about to remove the enrollment for{' '}
                            <span className="font-bold text-zinc-900">
                                {enrollmentToDelete?.employee.full_name}
                            </span>
                            . This action is permanent and cannot be reversed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-zinc-200">Cancel</AlertDialogCancel>
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
