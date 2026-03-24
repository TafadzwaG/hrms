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
    CheckCircle2,
    Eye,
    Heart,
    LayoutGrid,
    List,
    MoreHorizontal,
    Pencil,
    Plus,
    RotateCcw,
    Search,
    Shield,
    Trash2,
    Umbrella,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactPaginate from 'react-paginate';

type BenefitRow = {
    id: number;
    code: string;
    name: string;
    category: string;
    benefit_type: string;
    active: boolean;
    plans_count: number;
    enrollments_count: number;
    links: {
        show: string;
        edit: string;
    };
};

type BenefitStats = {
    total: number;
    active: number;
    health: number;
    retirement: number;
};

type BenefitsPageProps = {
    benefits: {
        data: BenefitRow[];
        total: number;
        current_page: number;
        last_page: number;
        from?: number;
        to?: number;
        per_page?: number;
    };
    filters: {
        search?: string | null;
        category?: string | null;
        benefit_type?: string | null;
        active?: string | null;
    };
    categories: string[];
    benefit_types: string[];
    stats?: BenefitStats;
};

const statusStyles: Record<string, string> = {
    active: 'border-transparent bg-emerald-100 text-emerald-700',
    draft: 'border-transparent bg-zinc-100 text-zinc-600',
    suspended: 'border-transparent bg-amber-100 text-amber-700',
    terminated: 'border-transparent bg-red-100 text-red-700',
    expired: 'border-transparent bg-slate-100 text-slate-600',
    cancelled: 'border-transparent bg-rose-100 text-rose-600',
};

const categoryStyles: Record<string, string> = {
    health: 'border-transparent bg-blue-100 text-blue-700',
    retirement: 'border-transparent bg-purple-100 text-purple-700',
    allowance: 'border-transparent bg-green-100 text-green-700',
    insurance: 'border-transparent bg-indigo-100 text-indigo-700',
    wellness: 'border-transparent bg-teal-100 text-teal-700',
    education: 'border-transparent bg-orange-100 text-orange-700',
    loan: 'border-transparent bg-pink-100 text-pink-700',
    other: 'border-transparent bg-zinc-100 text-zinc-600',
};

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function BenefitIndex() {
    const {
        benefits,
        filters,
        stats,
        categories = [],
        benefit_types = [],
    } = usePage<BenefitsPageProps>().props;

    const [view, setView] = useState<'grid' | 'table'>('table');
    const [search, setSearch] = useState(filters.search ?? '');
    const [category, setCategory] = useState(filters.category ?? 'all');
    const [benefitType, setBenefitType] = useState(filters.benefit_type ?? 'all');
    const [active, setActive] = useState(filters.active ?? 'all');
    const [showFilters, setShowFilters] = useState(false);
    const [benefitToDelete, setBenefitToDelete] = useState<BenefitRow | null>(null);

    const initialRender = useRef(true);

    const computedStats = {
        total: stats?.total ?? benefits.total ?? 0,
        active: stats?.active ?? 0,
        health: stats?.health ?? 0,
        retirement: stats?.retirement ?? 0,
    };

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        const timer = window.setTimeout(() => {
            router.get(
                '/benefits',
                {
                    search: search || undefined,
                    category: category !== 'all' ? category : undefined,
                    benefit_type: benefitType !== 'all' ? benefitType : undefined,
                    active: active !== 'all' ? active : undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300);

        return () => window.clearTimeout(timer);
    }, [search, category, benefitType, active]);

    const handleResetFilters = () => {
        setSearch('');
        setCategory('all');
        setBenefitType('all');
        setActive('all');
        setShowFilters(false);
    };

    const handleDeleteBenefit = () => {
        if (!benefitToDelete) return;

        router.delete(`/benefits/${benefitToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => setBenefitToDelete(null),
        });
    };

    const handlePageChange = ({ selected }: { selected: number }) => {
        router.get(
            '/benefits',
            {
                page: selected + 1,
                search: search || undefined,
                category: category !== 'all' ? category : undefined,
                benefit_type: benefitType !== 'all' ? benefitType : undefined,
                active: active !== 'all' ? active : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const perPage = benefits.per_page ?? (benefits.data.length || 1);
    const showingFrom =
        benefits.from ??
        (benefits.total === 0 ? 0 : (benefits.current_page - 1) * perPage + 1);
    const showingTo =
        benefits.to ?? Math.min(benefits.current_page * perPage, benefits.total);

    return (
        <AppLayout breadcrumbs={[{ title: 'Benefits', href: '/benefits' }]}>
            <Head title="Benefits" />

            <div className="w-full space-y-6 bg-white p-4 lg:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
                            Benefits
                        </h1>
                        <p className="text-lg text-zinc-500">
                            Manage employee benefits, plans, and enrollments.
                        </p>
                    </div>
                    <Link href="/benefits/create">
                        <Button className="h-11 rounded-md bg-zinc-900 px-6 text-white shadow-sm transition-all hover:bg-zinc-800">
                            <Plus className="mr-2 h-5 w-5" /> New Benefit
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: 'Total Benefits', val: computedStats.total, icon: Shield },
                        { label: 'Active', val: computedStats.active, icon: CheckCircle2 },
                        { label: 'Health', val: computedStats.health, icon: Heart },
                        { label: 'Retirement', val: computedStats.retirement, icon: Umbrella },
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
                                placeholder="Search by name or code..."
                                className="h-11 border-zinc-200 pl-10 focus:ring-zinc-900"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center rounded-md border bg-zinc-50/50 p-1">
                                <Button
                                    variant={view === 'grid' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setView('grid')}
                                    className="h-8 w-10 p-0"
                                    type="button"
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={view === 'table' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setView('table')}
                                    className="h-8 w-10 p-0"
                                    type="button"
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
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
                        <div className="grid grid-cols-1 gap-4 rounded-md border border-zinc-200 bg-zinc-50/40 p-4 md:grid-cols-3">
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
                                <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Type</p>
                                <Select value={benefitType} onValueChange={setBenefitType}>
                                    <SelectTrigger className="h-11 border-zinc-200 bg-white">
                                        <SelectValue placeholder="All types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All types</SelectItem>
                                        {benefit_types.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {formatLabel(type)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Status</p>
                                <Select value={active} onValueChange={setActive}>
                                    <SelectTrigger className="h-11 border-zinc-200 bg-white">
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="1">Active</SelectItem>
                                        <SelectItem value="0">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Grid View */}
                {view === 'grid' ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {benefits.data.map((benefit) => (
                            <Card
                                key={benefit.id}
                                className="group relative overflow-hidden border-zinc-200 shadow-sm transition-all hover:shadow-md"
                            >
                                <CardContent className="space-y-4 p-6">
                                    <div className="flex items-start justify-between gap-3">
                                        <span className="rounded border border-zinc-100 px-2 py-0.5 text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                                            {benefit.code}
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className={`${benefit.active ? statusStyles.active : statusStyles.draft} rounded-md border px-2 font-semibold`}
                                        >
                                            {benefit.active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold text-zinc-900 transition-colors group-hover:text-zinc-600">
                                            {benefit.name}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant="outline"
                                                className={`${categoryStyles[benefit.category] ?? categoryStyles.other} text-xs font-semibold`}
                                            >
                                                {formatLabel(benefit.category)}
                                            </Badge>
                                            <Badge variant="outline" className="border-zinc-200 text-xs font-semibold text-zinc-600">
                                                {formatLabel(benefit.benefit_type)}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-2 border-t border-zinc-50 pt-4">
                                        <div className="flex justify-between gap-3 text-sm">
                                            <span className="text-zinc-400">Plans</span>
                                            <span className="text-right font-semibold text-zinc-700">
                                                {benefit.plans_count}
                                            </span>
                                        </div>
                                        <div className="flex justify-between gap-3 text-sm">
                                            <span className="text-zinc-400">Enrollments</span>
                                            <span className="text-right font-semibold text-zinc-700">
                                                {benefit.enrollments_count}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end border-t border-dashed border-zinc-200 pt-4">
                                        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500" asChild>
                                                <Link href={benefit.links.show}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500" asChild>
                                                <Link href={benefit.links.edit}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                                                onClick={() => setBenefitToDelete(benefit)}
                                                type="button"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-md border border-zinc-200">
                        <Table>
                            <TableHeader className="bg-zinc-50">
                                <TableRow>
                                    <TableHead className="font-bold text-zinc-900">Code</TableHead>
                                    <TableHead className="font-bold text-zinc-900">Name</TableHead>
                                    <TableHead className="font-bold text-zinc-900">Category</TableHead>
                                    <TableHead className="font-bold text-zinc-900">Type</TableHead>
                                    <TableHead className="font-bold text-zinc-900">Status</TableHead>
                                    <TableHead className="font-bold text-zinc-900">Plans</TableHead>
                                    <TableHead className="font-bold text-zinc-900">Enrollments</TableHead>
                                    <TableHead className="px-6 text-right font-bold text-zinc-900">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {benefits.data.map((benefit) => (
                                    <TableRow key={benefit.id} className="hover:bg-zinc-50/50">
                                        <TableCell className="font-mono text-xs text-zinc-500">
                                            {benefit.code}
                                        </TableCell>
                                        <TableCell className="font-bold text-zinc-900">
                                            {benefit.name}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`${categoryStyles[benefit.category] ?? categoryStyles.other} font-semibold`}
                                            >
                                                {formatLabel(benefit.category)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-zinc-500">
                                            {formatLabel(benefit.benefit_type)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`${benefit.active ? statusStyles.active : statusStyles.draft} font-semibold`}
                                            >
                                                {benefit.active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-zinc-700">{benefit.plans_count}</TableCell>
                                        <TableCell className="text-zinc-700">{benefit.enrollments_count}</TableCell>
                                        <TableCell className="px-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                    <Link href={benefit.links.show}>
                                                        <Eye className="h-4 w-4 text-zinc-400" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                    <Link href={benefit.links.edit}>
                                                        <Pencil className="h-4 w-4 text-zinc-400" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => setBenefitToDelete(benefit)}
                                                    type="button"
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-400" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {/* Pagination */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-zinc-100 pt-6 md:flex-row">
                    <p className="text-sm font-medium text-zinc-500">
                        Showing{' '}
                        <span className="text-zinc-900">
                            {showingFrom}-{showingTo}
                        </span>{' '}
                        of <span className="text-zinc-900">{benefits.total}</span> benefits
                    </p>
                    <ReactPaginate
                        pageCount={benefits.last_page}
                        forcePage={Math.max((benefits.current_page ?? 1) - 1, 0)}
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
                open={!!benefitToDelete}
                onOpenChange={() => setBenefitToDelete(null)}
            >
                <AlertDialogContent className="rounded-none border-zinc-200">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold">
                            Confirm Deletion
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-500">
                            You are about to remove{' '}
                            <span className="font-bold text-zinc-900">
                                {benefitToDelete?.name}
                            </span>
                            . This action is permanent and cannot be reversed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-zinc-200">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="border-none bg-red-600 text-white hover:bg-red-700"
                            onClick={handleDeleteBenefit}
                        >
                            Delete Benefit
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
