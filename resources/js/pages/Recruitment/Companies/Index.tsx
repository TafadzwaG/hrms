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
    Building2,
    CheckCircle2,
    Eye,
    MoreHorizontal,
    Pencil,
    Plus,
    RotateCcw,
    Search,
    Trash2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactPaginate from 'react-paginate';

type CompanyRow = {
    id: number;
    company_name: string;
    industry: string | null;
    email: string;
    status: string;
    vacancies_count: number;
};

type CompanyStats = {
    total: number;
    active: number;
    pending: number;
    suspended: number;
};

type CompaniesPageProps = {
    companies: {
        data: CompanyRow[];
        total: number;
        current_page: number;
        last_page: number;
        from?: number;
        to?: number;
        per_page?: number;
    };
    filters: {
        search?: string | null;
        status?: string | null;
        industry?: string | null;
    };
    industries: string[];
    stats?: CompanyStats;
};

const statusStyles: Record<string, string> = {
    active: 'border-transparent bg-emerald-100 text-emerald-700',
    pending: 'border-transparent bg-amber-100 text-amber-700',
    suspended: 'border-transparent bg-red-100 text-red-700',
    rejected: 'border-transparent bg-slate-100 text-slate-600',
};

const industryStyles: Record<string, string> = {
    technology: 'border-transparent bg-blue-100 text-blue-700',
    finance: 'border-transparent bg-green-100 text-green-700',
    healthcare: 'border-transparent bg-teal-100 text-teal-700',
    education: 'border-transparent bg-orange-100 text-orange-700',
    manufacturing: 'border-transparent bg-purple-100 text-purple-700',
    retail: 'border-transparent bg-pink-100 text-pink-700',
    construction: 'border-transparent bg-amber-100 text-amber-700',
    mining: 'border-transparent bg-indigo-100 text-indigo-700',
    agriculture: 'border-transparent bg-lime-100 text-lime-700',
    other: 'border-transparent bg-zinc-100 text-zinc-600',
};

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function CompaniesIndex() {
    const {
        companies,
        filters,
        stats,
        industries = [],
    } = usePage<CompaniesPageProps>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? 'all');
    const [industry, setIndustry] = useState(filters.industry ?? 'all');
    const [showFilters, setShowFilters] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState<CompanyRow | null>(null);

    const initialRender = useRef(true);

    const computedStats = {
        total: stats?.total ?? companies.total ?? 0,
        active: stats?.active ?? 0,
        pending: stats?.pending ?? 0,
        suspended: stats?.suspended ?? 0,
    };

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        const timer = window.setTimeout(() => {
            router.get(
                '/company-profiles',
                {
                    search: search || undefined,
                    status: status !== 'all' ? status : undefined,
                    industry: industry !== 'all' ? industry : undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300);

        return () => window.clearTimeout(timer);
    }, [search, status, industry]);

    const handleResetFilters = () => {
        setSearch('');
        setStatus('all');
        setIndustry('all');
        setShowFilters(false);
    };

    const handleDeleteCompany = () => {
        if (!companyToDelete) return;

        router.delete(`/company-profiles/${companyToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => setCompanyToDelete(null),
        });
    };

    const handlePageChange = ({ selected }: { selected: number }) => {
        router.get(
            '/company-profiles',
            {
                page: selected + 1,
                search: search || undefined,
                status: status !== 'all' ? status : undefined,
                industry: industry !== 'all' ? industry : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const perPage = companies.per_page ?? (companies.data.length || 1);
    const showingFrom =
        companies.from ??
        (companies.total === 0 ? 0 : (companies.current_page - 1) * perPage + 1);
    const showingTo =
        companies.to ?? Math.min(companies.current_page * perPage, companies.total);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Recruitment', href: '/recruitment' },
                { title: 'Companies' },
            ]}
        >
            <Head title="Companies" />

            <div className="w-full space-y-8 bg-white p-6 lg:p-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
                            Companies
                        </h1>
                        <p className="text-lg text-zinc-500">
                            Manage company profiles and vacancies.
                        </p>
                    </div>
                    <Link href="/company-profiles/create">
                        <Button className="h-11 rounded-md bg-zinc-900 px-6 text-white shadow-sm transition-all hover:bg-zinc-800">
                            <Plus className="mr-2 h-5 w-5" /> New Company
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: 'Total Companies', val: computedStats.total, icon: Building2 },
                        { label: 'Active', val: computedStats.active, icon: CheckCircle2 },
                        { label: 'Pending', val: computedStats.pending, icon: Building2 },
                        { label: 'Suspended', val: computedStats.suspended, icon: Building2 },
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

                {/* Filters */}
                <div className="flex flex-col gap-4 border-t border-zinc-100 pt-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                            <Input
                                placeholder="Search by company name or email..."
                                className="h-11 border-zinc-200 pl-10 focus:ring-zinc-900"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className="h-11 border-zinc-200"
                                onClick={() => setShowFilters((current) => !current)}
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
                                <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Status</p>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="h-11 border-zinc-200 bg-white">
                                        <SelectValue placeholder="All statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All statuses</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="suspended">Suspended</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Industry</p>
                                <Select value={industry} onValueChange={setIndustry}>
                                    <SelectTrigger className="h-11 border-zinc-200 bg-white">
                                        <SelectValue placeholder="All industries" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All industries</SelectItem>
                                        {industries.map((ind) => (
                                            <SelectItem key={ind} value={ind}>
                                                {formatLabel(ind)}
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
                                <TableHead className="font-bold text-zinc-900">Company Name</TableHead>
                                <TableHead className="font-bold text-zinc-900">Industry</TableHead>
                                <TableHead className="font-bold text-zinc-900">Email</TableHead>
                                <TableHead className="font-bold text-zinc-900">Status</TableHead>
                                <TableHead className="font-bold text-zinc-900">Vacancies</TableHead>
                                <TableHead className="px-6 text-right font-bold text-zinc-900">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {companies.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-8 text-center text-zinc-400">
                                        No companies found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                companies.data.map((company) => (
                                    <TableRow key={company.id} className="hover:bg-zinc-50/50">
                                        <TableCell className="font-bold text-zinc-900">
                                            {company.company_name}
                                        </TableCell>
                                        <TableCell>
                                            {company.industry ? (
                                                <Badge
                                                    variant="outline"
                                                    className={`${industryStyles[company.industry] ?? industryStyles.other} font-semibold`}
                                                >
                                                    {formatLabel(company.industry)}
                                                </Badge>
                                            ) : (
                                                <span className="text-zinc-400">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-zinc-500">
                                            {company.email}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`${statusStyles[company.status] ?? 'border-zinc-200 bg-zinc-50 text-zinc-700'} font-semibold`}
                                            >
                                                {formatLabel(company.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-zinc-700">
                                            {company.vacancies_count}
                                        </TableCell>
                                        <TableCell className="px-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                    <Link href={`/company-profiles/${company.id}`}>
                                                        <Eye className="h-4 w-4 text-zinc-400" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                    <Link href={`/company-profiles/${company.id}/edit`}>
                                                        <Pencil className="h-4 w-4 text-zinc-400" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => setCompanyToDelete(company)}
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
                        <span className="text-zinc-900">
                            {showingFrom}-{showingTo}
                        </span>{' '}
                        of <span className="text-zinc-900">{companies.total}</span> companies
                    </p>
                    <ReactPaginate
                        pageCount={companies.last_page}
                        forcePage={Math.max((companies.current_page ?? 1) - 1, 0)}
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
                open={!!companyToDelete}
                onOpenChange={() => setCompanyToDelete(null)}
            >
                <AlertDialogContent className="rounded-none border-zinc-200">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold">
                            Confirm Deletion
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-500">
                            You are about to remove{' '}
                            <span className="font-bold text-zinc-900">
                                {companyToDelete?.company_name}
                            </span>
                            . This action is permanent and cannot be reversed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-zinc-200">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="border-none bg-red-600 text-white hover:bg-red-700"
                            onClick={handleDeleteCompany}
                        >
                            Delete Company
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
