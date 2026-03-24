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
    Briefcase,
    CheckCircle2,
    ClipboardList,
    Eye,
    MapPin,
    MoreHorizontal,
    Pencil,
    Plus,
    RotateCcw,
    Search,
    Trash2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactPaginate from 'react-paginate';

type VacancyRow = {
    id: number;
    title: string;
    company: { id: number; company_name: string } | null;
    category: string | null;
    employment_type: string | null;
    work_mode: string | null;
    location: string | null;
    application_deadline: string | null;
    status: string;
    applications_count: number;
};

type VacancyStats = {
    total: number;
    open: number;
    closed: number;
    draft: number;
};

type VacanciesPageProps = {
    vacancies: {
        data: VacancyRow[];
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
        category?: string | null;
        employment_type?: string | null;
        work_mode?: string | null;
    };
    categories: string[];
    employment_types: string[];
    work_modes: string[];
    stats?: VacancyStats;
};

const statusStyles: Record<string, string> = {
    open: 'border-transparent bg-emerald-100 text-emerald-700',
    published: 'border-transparent bg-emerald-100 text-emerald-700',
    closed: 'border-transparent bg-slate-100 text-slate-600',
    draft: 'border-transparent bg-zinc-100 text-zinc-600',
    expired: 'border-transparent bg-amber-100 text-amber-700',
};

const categoryStyles: Record<string, string> = {
    engineering: 'border-transparent bg-blue-100 text-blue-700',
    marketing: 'border-transparent bg-pink-100 text-pink-700',
    sales: 'border-transparent bg-green-100 text-green-700',
    finance: 'border-transparent bg-purple-100 text-purple-700',
    hr: 'border-transparent bg-orange-100 text-orange-700',
    operations: 'border-transparent bg-teal-100 text-teal-700',
    design: 'border-transparent bg-indigo-100 text-indigo-700',
    other: 'border-transparent bg-zinc-100 text-zinc-600',
};

const typeStyles: Record<string, string> = {
    full_time: 'border-transparent bg-blue-100 text-blue-700',
    part_time: 'border-transparent bg-amber-100 text-amber-700',
    contract: 'border-transparent bg-purple-100 text-purple-700',
    internship: 'border-transparent bg-teal-100 text-teal-700',
    temporary: 'border-transparent bg-orange-100 text-orange-700',
};

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
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

export default function VacanciesIndex() {
    const {
        vacancies,
        filters,
        stats,
        categories = [],
        employment_types = [],
        work_modes = [],
    } = usePage<VacanciesPageProps>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? 'all');
    const [category, setCategory] = useState(filters.category ?? 'all');
    const [employmentType, setEmploymentType] = useState(filters.employment_type ?? 'all');
    const [workMode, setWorkMode] = useState(filters.work_mode ?? 'all');
    const [showFilters, setShowFilters] = useState(false);
    const [vacancyToDelete, setVacancyToDelete] = useState<VacancyRow | null>(null);

    const initialRender = useRef(true);

    const computedStats = {
        total: stats?.total ?? vacancies.total ?? 0,
        open: stats?.open ?? 0,
        closed: stats?.closed ?? 0,
        draft: stats?.draft ?? 0,
    };

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        const timer = window.setTimeout(() => {
            router.get(
                '/vacancies',
                {
                    search: search || undefined,
                    status: status !== 'all' ? status : undefined,
                    category: category !== 'all' ? category : undefined,
                    employment_type: employmentType !== 'all' ? employmentType : undefined,
                    work_mode: workMode !== 'all' ? workMode : undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300);

        return () => window.clearTimeout(timer);
    }, [search, status, category, employmentType, workMode]);

    const handleResetFilters = () => {
        setSearch('');
        setStatus('all');
        setCategory('all');
        setEmploymentType('all');
        setWorkMode('all');
        setShowFilters(false);
    };

    const handleDeleteVacancy = () => {
        if (!vacancyToDelete) return;

        router.delete(`/vacancies/${vacancyToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => setVacancyToDelete(null),
        });
    };

    const handlePageChange = ({ selected }: { selected: number }) => {
        router.get(
            '/vacancies',
            {
                page: selected + 1,
                search: search || undefined,
                status: status !== 'all' ? status : undefined,
                category: category !== 'all' ? category : undefined,
                employment_type: employmentType !== 'all' ? employmentType : undefined,
                work_mode: workMode !== 'all' ? workMode : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const perPage = vacancies.per_page ?? (vacancies.data.length || 1);
    const showingFrom =
        vacancies.from ??
        (vacancies.total === 0 ? 0 : (vacancies.current_page - 1) * perPage + 1);
    const showingTo =
        vacancies.to ?? Math.min(vacancies.current_page * perPage, vacancies.total);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Recruitment', href: '/recruitment' },
                { title: 'Vacancies' },
            ]}
        >
            <Head title="Vacancies" />

            <div className="w-full space-y-6 bg-white p-4 lg:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
                            Vacancies
                        </h1>
                        <p className="text-lg text-zinc-500">
                            Manage job vacancies and applications.
                        </p>
                    </div>
                    <Link href="/vacancies/create">
                        <Button className="h-11 rounded-md bg-zinc-900 px-6 text-white shadow-sm transition-all hover:bg-zinc-800">
                            <Plus className="mr-2 h-5 w-5" /> New Vacancy
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: 'Total Vacancies', val: computedStats.total, icon: Briefcase },
                        { label: 'Open', val: computedStats.open, icon: CheckCircle2 },
                        { label: 'Closed', val: computedStats.closed, icon: ClipboardList },
                        { label: 'Draft', val: computedStats.draft, icon: Briefcase },
                    ].map((item, index) => (
                        <Card key={index} className="border-zinc-200 shadow-none">
                            <CardContent className="flex items-center justify-between p-6">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium tracking-wider text-zinc-500 uppercase">
                                        {item.label}
                                    </p>
                                    <p className="text-2xl font-semibold text-zinc-900">
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
                                placeholder="Search by title or company..."
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
                        <div className="grid grid-cols-1 gap-4 rounded-md border border-zinc-200 bg-zinc-50/40 p-4 md:grid-cols-4">
                            <div className="space-y-2">
                                <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Status</p>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="h-11 border-zinc-200 bg-white">
                                        <SelectValue placeholder="All statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All statuses</SelectItem>
                                        <SelectItem value="open">Open</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="expired">Expired</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Category</p>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger className="h-11 border-zinc-200 bg-white">
                                        <SelectValue placeholder="All categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All categories</SelectItem>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {formatLabel(cat)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Employment Type</p>
                                <Select value={employmentType} onValueChange={setEmploymentType}>
                                    <SelectTrigger className="h-11 border-zinc-200 bg-white">
                                        <SelectValue placeholder="All types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All types</SelectItem>
                                        {employment_types.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {formatLabel(type)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Work Mode</p>
                                <Select value={workMode} onValueChange={setWorkMode}>
                                    <SelectTrigger className="h-11 border-zinc-200 bg-white">
                                        <SelectValue placeholder="All modes" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All modes</SelectItem>
                                        {work_modes.map((mode) => (
                                            <SelectItem key={mode} value={mode}>
                                                {formatLabel(mode)}
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
                                <TableHead className="font-bold text-zinc-900">Title</TableHead>
                                <TableHead className="font-bold text-zinc-900">Company</TableHead>
                                <TableHead className="font-bold text-zinc-900">Category</TableHead>
                                <TableHead className="font-bold text-zinc-900">Type</TableHead>
                                <TableHead className="font-bold text-zinc-900">Location</TableHead>
                                <TableHead className="font-bold text-zinc-900">Deadline</TableHead>
                                <TableHead className="font-bold text-zinc-900">Status</TableHead>
                                <TableHead className="font-bold text-zinc-900">Apps</TableHead>
                                <TableHead className="px-6 text-right font-bold text-zinc-900">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {vacancies.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="py-8 text-center text-zinc-400">
                                        No vacancies found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                vacancies.data.map((vacancy) => (
                                    <TableRow key={vacancy.id} className="hover:bg-zinc-50/50">
                                        <TableCell className="font-bold text-zinc-900">
                                            {vacancy.title}
                                        </TableCell>
                                        <TableCell className="text-zinc-500">
                                            {vacancy.company?.company_name ?? '—'}
                                        </TableCell>
                                        <TableCell>
                                            {vacancy.category ? (
                                                <Badge
                                                    variant="outline"
                                                    className={`${categoryStyles[vacancy.category] ?? categoryStyles.other} font-semibold`}
                                                >
                                                    {formatLabel(vacancy.category)}
                                                </Badge>
                                            ) : (
                                                <span className="text-zinc-400">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {vacancy.employment_type ? (
                                                <Badge
                                                    variant="outline"
                                                    className={`${typeStyles[vacancy.employment_type] ?? 'border-zinc-200 bg-zinc-50 text-zinc-700'} font-semibold`}
                                                >
                                                    {formatLabel(vacancy.employment_type)}
                                                </Badge>
                                            ) : (
                                                <span className="text-zinc-400">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-zinc-500">
                                            {vacancy.location ? (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {vacancy.location}
                                                </span>
                                            ) : '—'}
                                        </TableCell>
                                        <TableCell className="text-zinc-500">
                                            {formatDate(vacancy.application_deadline)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`${statusStyles[vacancy.status] ?? 'border-zinc-200 bg-zinc-50 text-zinc-700'} font-semibold`}
                                            >
                                                {formatLabel(vacancy.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-zinc-700">
                                            {vacancy.applications_count}
                                        </TableCell>
                                        <TableCell className="px-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                    <Link href={`/vacancies/${vacancy.id}`}>
                                                        <Eye className="h-4 w-4 text-zinc-400" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                    <Link href={`/vacancies/${vacancy.id}/edit`}>
                                                        <Pencil className="h-4 w-4 text-zinc-400" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => setVacancyToDelete(vacancy)}
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
                        of <span className="text-zinc-900">{vacancies.total}</span> vacancies
                    </p>
                    <ReactPaginate
                        pageCount={vacancies.last_page}
                        forcePage={Math.max((vacancies.current_page ?? 1) - 1, 0)}
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
                open={!!vacancyToDelete}
                onOpenChange={() => setVacancyToDelete(null)}
            >
                <AlertDialogContent className="rounded-none border-zinc-200">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold">
                            Confirm Deletion
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-500">
                            You are about to remove{' '}
                            <span className="font-bold text-zinc-900">
                                {vacancyToDelete?.title}
                            </span>
                            . This action is permanent and cannot be reversed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-zinc-200">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="border-none bg-red-600 text-white hover:bg-red-700"
                            onClick={handleDeleteVacancy}
                        >
                            Delete Vacancy
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
