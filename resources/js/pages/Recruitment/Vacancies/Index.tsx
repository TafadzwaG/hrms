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
    Users,
} from 'lucide-react';

type VacancyRow = {
    id: number;
    title: string;
    company: {
        id: number;
        name?: string | null;
        company_name?: string | null;
    } | null;
    category: string | null;
    employment_type: string | null;
    work_mode: string | null;
    location: string | null;
    application_deadline: string | null;
    status: string;
    applications_count: number;
    links?: {
        show?: string;
        edit?: string;
    };
};

type VacancyStats = {
    total: number;
    published?: number;
    open?: number;
    closed: number;
    draft?: number;
    total_applications?: number;
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
        sort?: string | null;
        direction?: 'asc' | 'desc' | null;
    };
    categories: string[];
    employmentTypes?: string[];
    employment_types?: string[];
    workModes?: string[];
    work_modes?: string[];
    stats?: VacancyStats;
};

type BadgeVariant = NonNullable<ComponentProps<typeof Badge>['variant']>;

const statusVariants: Record<string, BadgeVariant> = {
    open: 'success',
    published: 'success',
    closed: 'secondary',
    draft: 'secondary',
    expired: 'warning',
};

const categoryVariants: Record<string, BadgeVariant> = {
    engineering: 'chart1',
    information_technology: 'chart1',
    marketing: 'accent',
    sales: 'success',
    finance: 'chart4',
    hr: 'warning',
    operations: 'chart3',
    design: 'chart5',
    other: 'secondary',
};

const typeVariants: Record<string, BadgeVariant> = {
    full_time: 'chart1',
    part_time: 'warning',
    contract: 'chart4',
    internship: 'chart3',
    temporary: 'accent',
};

export default function VacanciesIndex() {
    const {
        vacancies,
        filters,
        stats,
        categories = [],
        employmentTypes = [],
        employment_types = [],
        workModes = [],
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

    const employmentTypeOptions = employmentTypes.length > 0 ? employmentTypes : employment_types;
    const workModeOptions = workModes.length > 0 ? workModes : work_modes;

    const computedStats = {
        total: stats?.total ?? vacancies.total ?? 0,
        published: stats?.published ?? stats?.open ?? 0,
        closed: stats?.closed ?? 0,
        applications: stats?.total_applications ?? 0,
    };

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        const timer = window.setTimeout(() => {
            router.get(
                '/vacancies',
                buildIndexParams(filters, {
                    search,
                    status: status !== 'all' ? status : null,
                    category: category !== 'all' ? category : null,
                    employment_type: employmentType !== 'all' ? employmentType : null,
                    work_mode: workMode !== 'all' ? workMode : null,
                }),
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300);

        return () => window.clearTimeout(timer);
    }, [category, employmentType, filters, search, status, workMode]);

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

    return (
        <AppLayout breadcrumbs={[{ title: 'Recruitment', href: '/recruitment' }, { title: 'Vacancies' }]}>
            <Head title="Vacancies" />

            <div className="w-full space-y-6 bg-muted/10 p-4 lg:p-8">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">
                            Vacancies
                        </h1>
                        <p className="text-sm font-medium text-muted-foreground">
                            Manage published jobs, hiring pipelines, and recruitment demand from one table.
                        </p>
                    </div>

                    <Link href="/vacancies/create">
                        <Button className="h-10 rounded-md bg-primary px-5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-sm hover:bg-primary/90">
                            <Plus className="mr-2 h-4 w-4" />
                            New Vacancy
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard icon={Briefcase} label="Total Vacancies" value={computedStats.total} />
                    <StatCard icon={CheckCircle2} label="Published" value={computedStats.published} />
                    <StatCard icon={ClipboardList} label="Closed" value={computedStats.closed} />
                    <StatCard icon={Users} label="Applications" value={computedStats.applications} />
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
                                    placeholder="Search by vacancy title or company"
                                    className="h-10 w-full border-none bg-transparent px-0 text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground focus:ring-0"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
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
                        <div className="mt-5 grid gap-4 md:grid-cols-4">
                            <FilterSelect
                                label="Status"
                                value={status}
                                onChange={setStatus}
                                options={[
                                    { value: 'all', label: 'All statuses' },
                                    { value: 'published', label: 'Published' },
                                    { value: 'closed', label: 'Closed' },
                                    { value: 'draft', label: 'Draft' },
                                    { value: 'expired', label: 'Expired' },
                                ]}
                            />
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
                                label="Employment Type"
                                value={employmentType}
                                onChange={setEmploymentType}
                                options={[
                                    { value: 'all', label: 'All types' },
                                    ...employmentTypeOptions.map((item) => ({
                                        value: item,
                                        label: formatLabel(item),
                                    })),
                                ]}
                            />
                            <FilterSelect
                                label="Work Mode"
                                value={workMode}
                                onChange={setWorkMode}
                                options={[
                                    { value: 'all', label: 'All work modes' },
                                    ...workModeOptions.map((item) => ({
                                        value: item,
                                        label: formatLabel(item),
                                    })),
                                ]}
                            />
                        </div>
                    ) : null}
                </section>

                <IndexTableCard>
                    <Table>
                        <TableHeader>
                            <IndexTableHeaderRow>
                                <SortableTableHead filters={filters} sortKey="title" path="/vacancies">
                                    Vacancy
                                </SortableTableHead>
                                <SortableTableHead filters={filters} sortKey="company" path="/vacancies">
                                    Company
                                </SortableTableHead>
                                <SortableTableHead filters={filters} sortKey="category" path="/vacancies">
                                    Category
                                </SortableTableHead>
                                <SortableTableHead filters={filters} sortKey="employment_type" path="/vacancies">
                                    Type
                                </SortableTableHead>
                                <SortableTableHead filters={filters} sortKey="work_mode" path="/vacancies">
                                    Work Mode
                                </SortableTableHead>
                                <SortableTableHead filters={filters} sortKey="location" path="/vacancies">
                                    Location
                                </SortableTableHead>
                                <SortableTableHead filters={filters} sortKey="status" path="/vacancies">
                                    Status
                                </SortableTableHead>
                                <SortableTableHead filters={filters} sortKey="application_deadline" path="/vacancies">
                                    Deadline
                                </SortableTableHead>
                                <SortableTableHead filters={filters} sortKey="applications_count" path="/vacancies" align="center">
                                    Applications
                                </SortableTableHead>
                                <IndexTableHead align="right">Actions</IndexTableHead>
                            </IndexTableHeaderRow>
                        </TableHeader>
                        <TableBody>
                            {vacancies.data.length === 0 ? (
                                <IndexTableEmptyRow colSpan={10}>
                                    No vacancies found for the current filters.
                                </IndexTableEmptyRow>
                            ) : (
                                vacancies.data.map((vacancy) => (
                                    <TableRow key={vacancy.id} className="border-border/60 hover:bg-muted/20">
                                        <TableCell className="py-4 align-top">
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold text-foreground">
                                                    {vacancy.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    #{vacancy.id}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 align-top text-sm text-muted-foreground">
                                            {vacancy.company?.company_name ?? vacancy.company?.name ?? '—'}
                                        </TableCell>
                                        <TableCell className="py-4 align-top">
                                            {vacancy.category ? (
                                                <Badge variant={categoryVariants[vacancy.category] ?? 'secondary'}>
                                                    {formatLabel(vacancy.category)}
                                                </Badge>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-4 align-top">
                                            {vacancy.employment_type ? (
                                                <Badge variant={typeVariants[vacancy.employment_type] ?? 'secondary'}>
                                                    {formatLabel(vacancy.employment_type)}
                                                </Badge>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-4 align-top">
                                            {vacancy.work_mode ? (
                                                <Badge variant="outline">{formatLabel(vacancy.work_mode)}</Badge>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-4 align-top text-sm text-muted-foreground">
                                            {vacancy.location ? (
                                                <span className="inline-flex items-center gap-1.5">
                                                    <MapPin className="h-3.5 w-3.5" />
                                                    {vacancy.location}
                                                </span>
                                            ) : (
                                                '—'
                                            )}
                                        </TableCell>
                                        <TableCell className="py-4 align-top">
                                            <Badge variant={statusVariants[vacancy.status] ?? 'secondary'}>
                                                {formatLabel(vacancy.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-4 align-top text-sm text-muted-foreground">
                                            {formatDate(vacancy.application_deadline)}
                                        </TableCell>
                                        <TableCell className="py-4 text-center align-top text-sm font-semibold text-foreground">
                                            {vacancy.applications_count}
                                        </TableCell>
                                        <TableCell className="py-4 text-right align-top">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                    <Link href={vacancy.links?.show ?? `/recruitment/vacancies/${vacancy.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                    <Link href={vacancy.links?.edit ?? `/recruitment/vacancies/${vacancy.id}/edit`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => setVacancyToDelete(vacancy)}
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
                        pagination={vacancies}
                        filters={filters}
                        path="/vacancies"
                        label="vacancies"
                    />
                </IndexTableCard>
            </div>

            <AlertDialog open={!!vacancyToDelete} onOpenChange={(open) => !open && setVacancyToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Vacancy</AlertDialogTitle>
                        <AlertDialogDescription>
                            This permanently removes{' '}
                            <span className="font-semibold text-foreground">
                                {vacancyToDelete?.title}
                            </span>
                            . This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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

function StatCard({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof Briefcase;
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
