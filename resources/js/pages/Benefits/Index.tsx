import type { ComponentProps } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
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
    SortableTableHead,
} from '@/components/index-table';
import { RoleScopeBar } from '@/components/role-scope-bar';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { buildIndexParams } from '@/lib/index-table';
import type { PageRoleScope } from '@/types/auth';
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

type BenefitRow = {
    id: number;
    code: string | null;
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
        sort?: string | null;
        direction?: 'asc' | 'desc' | null;
        scope_view?: string | null;
    };
    categories: string[];
    benefit_types: string[];
    stats?: BenefitStats;
    scope?: PageRoleScope;
};

type BadgeVariant = NonNullable<ComponentProps<typeof Badge>['variant']>;

const categoryVariants: Record<string, BadgeVariant> = {
    health: 'chart1',
    retirement: 'chart4',
    allowance: 'success',
    insurance: 'chart3',
    wellness: 'accent',
    education: 'warning',
    loan: 'chart5',
    other: 'secondary',
};

const typeVariants: Record<string, BadgeVariant> = {
    medical: 'chart1',
    pension: 'chart4',
    allowance: 'success',
    insurance: 'chart3',
    savings: 'accent',
    other: 'secondary',
};

export default function BenefitIndex() {
    const {
        benefits,
        filters,
        stats,
        categories = [],
        benefit_types = [],
        scope,
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
                buildIndexParams(filters, {
                    search,
                    category: category !== 'all' ? category : null,
                    benefit_type: benefitType !== 'all' ? benefitType : null,
                    active: active !== 'all' ? active : null,
                }),
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300);

        return () => window.clearTimeout(timer);
    }, [active, benefitType, category, filters, search]);

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

    return (
        <AppLayout breadcrumbs={[{ title: 'Benefits', href: '/benefits' }]}>
            <Head title="Benefits" />

            <div className="w-full space-y-6 bg-muted/10 p-4 lg:p-8">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">
                            Benefits Catalog
                        </h1>
                        <p className="text-sm font-medium text-muted-foreground">
                            Manage benefit definitions, plan coverage, and enrollment volume from one consistent index.
                        </p>
                    </div>

                    <Link href="/benefits/create">
                        <Button className="h-10 rounded-md bg-primary px-5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-sm hover:bg-primary/90">
                            <Plus className="mr-2 h-4 w-4" />
                            New Benefit
                        </Button>
                    </Link>
                </div>

                <RoleScopeBar
                    scope={scope}
                    path="/benefits"
                    filters={filters}
                />

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard icon={Shield} label="Total Benefits" value={computedStats.total} />
                    <StatCard icon={CheckCircle2} label="Active" value={computedStats.active} />
                    <StatCard icon={Heart} label="Health" value={computedStats.health} />
                    <StatCard icon={Umbrella} label="Retirement" value={computedStats.retirement} />
                </div>

                <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-border/70 pb-5 md:flex-row md:items-end md:justify-between">
                        <div className="w-full max-w-xl space-y-1.5">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                Search
                            </label>
                            <div className="flex items-center gap-3 rounded-md border border-border bg-background px-3">
                                <Search className="h-4 w-4 text-muted-foreground" />
                                <input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search by benefit name or code"
                                    className="h-10 w-full border-none bg-transparent px-0 text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground focus:ring-0"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center rounded-md border border-border bg-muted/30 p-1">
                                <Button
                                    variant={view === 'grid' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setView('grid')}
                                    className="h-8 w-9 p-0"
                                    type="button"
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={view === 'table' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setView('table')}
                                    className="h-8 w-9 p-0"
                                    type="button"
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                className="h-10 rounded-md border-border"
                                onClick={() => setShowFilters((current) => !current)}
                            >
                                <MoreHorizontal className="mr-2 h-4 w-4" />
                                {showFilters ? 'Hide Filters' : 'Show Filters'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="h-10 rounded-md border-border"
                                onClick={handleResetFilters}
                            >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Reset
                            </Button>
                        </div>
                    </div>

                    {showFilters ? (
                        <div className="mt-5 grid gap-4 md:grid-cols-3">
                            <FilterSelect
                                label="Category"
                                value={category}
                                onChange={setCategory}
                                options={[
                                    { value: 'all', label: 'All categories' },
                                    ...categories.map((item) => ({
                                        value: item,
                                        label: formatLabel(item),
                                    })),
                                ]}
                            />
                            <FilterSelect
                                label="Type"
                                value={benefitType}
                                onChange={setBenefitType}
                                options={[
                                    { value: 'all', label: 'All types' },
                                    ...benefit_types.map((item) => ({
                                        value: item,
                                        label: formatLabel(item),
                                    })),
                                ]}
                            />
                            <FilterSelect
                                label="Status"
                                value={active}
                                onChange={setActive}
                                options={[
                                    { value: 'all', label: 'All statuses' },
                                    { value: '1', label: 'Active' },
                                    { value: '0', label: 'Inactive' },
                                ]}
                            />
                        </div>
                    ) : null}
                </section>

                {view === 'grid' ? (
                    <div className="space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                            {benefits.data.length === 0 ? (
                                <div className="col-span-full rounded-xl border border-dashed border-border bg-background px-6 py-14 text-center text-sm font-medium text-muted-foreground">
                                    No benefits found for the current filters.
                                </div>
                            ) : (
                                benefits.data.map((benefit) => (
                                    <Card
                                        key={benefit.id}
                                        className="group overflow-hidden border-border bg-background shadow-sm transition-shadow hover:shadow-md"
                                    >
                                        <CardContent className="space-y-4 p-5">
                                            <div className="flex items-start justify-between gap-3">
                                                <span className="rounded-md border border-border bg-muted/20 px-2 py-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    {benefit.code || 'No Code'}
                                                </span>
                                                <Badge variant={benefit.active ? 'success' : 'secondary'}>
                                                    {benefit.active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </div>

                                            <div className="space-y-2">
                                                <h3 className="text-lg font-semibold text-foreground">
                                                    {benefit.name}
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant={categoryVariants[benefit.category] ?? 'secondary'}>
                                                        {formatLabel(benefit.category)}
                                                    </Badge>
                                                    <Badge variant={typeVariants[benefit.benefit_type] ?? 'outline'}>
                                                        {formatLabel(benefit.benefit_type)}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 rounded-lg border border-border/70 bg-muted/10 p-3">
                                                <div>
                                                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                                        Plans
                                                    </p>
                                                    <p className="mt-1 text-lg font-semibold text-foreground">
                                                        {benefit.plans_count}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                                        Enrollments
                                                    </p>
                                                    <p className="mt-1 text-lg font-semibold text-foreground">
                                                        {benefit.enrollments_count}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-2 border-t border-border/70 pt-4">
                                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                    <Link href={benefit.links.show}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                    <Link href={benefit.links.edit}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => setBenefitToDelete(benefit)}
                                                    type="button"
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>

                        <IndexTablePagination
                            pagination={benefits}
                            filters={filters}
                            path="/benefits"
                            label="benefits"
                        />
                    </div>
                ) : (
                    <IndexTableCard>
                        <Table>
                            <TableHeader>
                                <IndexTableHeaderRow>
                                    <SortableTableHead filters={filters} sortKey="code" path="/benefits">
                                        Code
                                    </SortableTableHead>
                                    <SortableTableHead filters={filters} sortKey="name" path="/benefits">
                                        Benefit
                                    </SortableTableHead>
                                    <SortableTableHead filters={filters} sortKey="category" path="/benefits">
                                        Category
                                    </SortableTableHead>
                                    <SortableTableHead filters={filters} sortKey="benefit_type" path="/benefits">
                                        Type
                                    </SortableTableHead>
                                    <SortableTableHead filters={filters} sortKey="active" path="/benefits">
                                        Status
                                    </SortableTableHead>
                                    <SortableTableHead filters={filters} sortKey="plans_count" path="/benefits" align="center">
                                        Plans
                                    </SortableTableHead>
                                    <SortableTableHead filters={filters} sortKey="enrollments_count" path="/benefits" align="center">
                                        Enrollments
                                    </SortableTableHead>
                                    <IndexTableHead align="right">Actions</IndexTableHead>
                                </IndexTableHeaderRow>
                            </TableHeader>
                            <TableBody>
                                {benefits.data.length === 0 ? (
                                    <IndexTableEmptyRow colSpan={8}>
                                        No benefits found for the current filters.
                                    </IndexTableEmptyRow>
                                ) : (
                                    benefits.data.map((benefit) => (
                                        <TableRow key={benefit.id} className="border-border/60 hover:bg-muted/20">
                                            <TableCell className="py-4 align-top font-mono text-xs text-muted-foreground">
                                                {benefit.code || '—'}
                                            </TableCell>
                                            <TableCell className="py-4 align-top">
                                                <p className="text-sm font-semibold text-foreground">
                                                    {benefit.name}
                                                </p>
                                            </TableCell>
                                            <TableCell className="py-4 align-top">
                                                <Badge variant={categoryVariants[benefit.category] ?? 'secondary'}>
                                                    {formatLabel(benefit.category)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-4 align-top">
                                                <Badge variant={typeVariants[benefit.benefit_type] ?? 'outline'}>
                                                    {formatLabel(benefit.benefit_type)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-4 align-top">
                                                <Badge variant={benefit.active ? 'success' : 'secondary'}>
                                                    {benefit.active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-4 text-center align-top text-sm font-semibold text-foreground">
                                                {benefit.plans_count}
                                            </TableCell>
                                            <TableCell className="py-4 text-center align-top text-sm font-semibold text-foreground">
                                                {benefit.enrollments_count}
                                            </TableCell>
                                            <TableCell className="py-4 text-right align-top">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                        <Link href={benefit.links.show}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                        <Link href={benefit.links.edit}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => setBenefitToDelete(benefit)}
                                                        type="button"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        <IndexTablePagination
                            pagination={benefits}
                            filters={filters}
                            path="/benefits"
                            label="benefits"
                        />
                    </IndexTableCard>
                )}
            </div>

            <AlertDialog open={!!benefitToDelete} onOpenChange={(open) => !open && setBenefitToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Benefit</AlertDialogTitle>
                        <AlertDialogDescription>
                            This permanently removes{' '}
                            <span className="font-semibold text-foreground">
                                {benefitToDelete?.name}
                            </span>
                            . This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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

function StatCard({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof Shield;
    label: string;
    value: number;
}) {
    return (
        <Card className="border-border bg-background shadow-sm">
            <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        {label}
                    </p>
                    <p className="text-2xl font-semibold text-foreground">{value}</p>
                </div>
                <Icon className="h-6 w-6 text-muted-foreground" />
            </CardContent>
        </Card>
    );
}

function FilterSelect({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
}) {
    return (
        <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {label}
            </label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="h-10 border-border bg-background">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}
