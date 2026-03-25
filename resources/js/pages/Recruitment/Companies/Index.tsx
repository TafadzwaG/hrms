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
import {
    IndexTableCard,
    IndexTableEmptyRow,
    IndexTableHead,
    IndexTableHeaderRow,
    IndexTablePagination,
    SortableTableHead,
} from '@/components/index-table';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { buildIndexParams } from '@/lib/index-table';
import {
    Building2,
    CheckCircle2,
    Eye,
    Filter,
    Pencil,
    Plus,
    RotateCcw,
    Search,
    ShieldAlert,
    Trash2,
} from 'lucide-react';

type CompanyRow = {
    id: number;
    company_name: string;
    industry: string | null;
    email: string | null;
    phone?: string | null;
    status: string;
    vacancies_count: number;
    updated_at?: string | null;
    links?: {
        show?: string;
        edit?: string;
    };
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
        sort?: string | null;
        direction?: 'asc' | 'desc' | null;
    };
    industries: string[];
    statuses?: string[];
    stats?: CompanyStats;
};

type BadgeVariant = NonNullable<ComponentProps<typeof Badge>['variant']>;

const statusVariants: Record<string, BadgeVariant> = {
    active: 'success',
    pending: 'warning',
    pending_review: 'warning',
    suspended: 'danger',
    rejected: 'secondary',
    draft: 'secondary',
};

const industryVariants: Record<string, BadgeVariant> = {
    technology: 'chart1',
    finance: 'chart2',
    healthcare: 'chart3',
    education: 'chart4',
    manufacturing: 'chart5',
    retail: 'accent',
    construction: 'warning',
    mining: 'info',
    agriculture: 'success',
    other: 'secondary',
};

export default function CompaniesIndex() {
    const { companies, filters, industries = [], statuses = [], stats } =
        usePage<CompaniesPageProps>().props;

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
                buildIndexParams(filters, {
                    search,
                    status: status !== 'all' ? status : null,
                    industry: industry !== 'all' ? industry : null,
                }),
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300);

        return () => window.clearTimeout(timer);
    }, [filters, industry, search, status]);

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

    return (
        <AppLayout breadcrumbs={[{ title: 'Recruitment', href: '/recruitment' }, { title: 'Companies' }]}>
            <Head title="Companies" />

            <div className="w-full space-y-6 bg-muted/10 p-4 lg:p-8">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">
                            Companies
                        </h1>
                        <p className="text-sm font-medium text-muted-foreground">
                            Manage company profiles and recruitment readiness from a single directory.
                        </p>
                    </div>

                    <Link href="/company-profiles/create">
                        <Button className="h-10 rounded-md bg-primary px-5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-sm hover:bg-primary/90">
                            <Plus className="mr-2 h-4 w-4" />
                            New Company
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard icon={Building2} label="Total Companies" value={computedStats.total} />
                    <StatCard icon={CheckCircle2} label="Active" value={computedStats.active} />
                    <StatCard icon={ShieldAlert} label="Pending" value={computedStats.pending} />
                    <StatCard icon={ShieldAlert} label="Suspended" value={computedStats.suspended} />
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
                                    placeholder="Search by company name, registration number, or email"
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
                                <Filter className="mr-2 h-4 w-4" />
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
                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                            <FilterSelect
                                label="Status"
                                value={status}
                                onChange={setStatus}
                                options={[
                                    { value: 'all', label: 'All statuses' },
                                    ...statuses.map((item) => ({
                                        value: item,
                                        label: formatLabel(item),
                                    })),
                                ]}
                            />
                            <FilterSelect
                                label="Industry"
                                value={industry}
                                onChange={setIndustry}
                                options={[
                                    { value: 'all', label: 'All industries' },
                                    ...industries.map((item) => ({
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
                                <SortableTableHead filters={filters} sortKey="company_name" path="/company-profiles">
                                    Company
                                </SortableTableHead>
                                <SortableTableHead filters={filters} sortKey="industry" path="/company-profiles">
                                    Industry
                                </SortableTableHead>
                                <SortableTableHead filters={filters} sortKey="email" path="/company-profiles">
                                    Contact
                                </SortableTableHead>
                                <SortableTableHead filters={filters} sortKey="status" path="/company-profiles">
                                    Status
                                </SortableTableHead>
                                <SortableTableHead filters={filters} sortKey="vacancies_count" path="/company-profiles">
                                    Vacancies
                                </SortableTableHead>
                                <IndexTableHead align="right">Actions</IndexTableHead>
                            </IndexTableHeaderRow>
                        </TableHeader>
                        <TableBody>
                            {companies.data.length === 0 ? (
                                <IndexTableEmptyRow colSpan={6}>
                                    No companies found for the current filters.
                                </IndexTableEmptyRow>
                            ) : (
                                companies.data.map((company) => (
                                    <TableRow key={company.id} className="border-border/60 hover:bg-muted/20">
                                        <TableCell className="py-4 align-top">
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold text-foreground">
                                                    {company.company_name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {company.phone || 'No phone recorded'}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 align-top">
                                            {company.industry ? (
                                                <Badge variant={industryVariants[company.industry] ?? 'secondary'}>
                                                    {formatLabel(company.industry)}
                                                </Badge>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-4 align-top text-sm text-muted-foreground">
                                            {company.email || 'No email recorded'}
                                        </TableCell>
                                        <TableCell className="py-4 align-top">
                                            <Badge variant={statusVariants[company.status] ?? 'secondary'}>
                                                {formatLabel(company.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-4 align-top text-sm font-semibold text-foreground">
                                            {company.vacancies_count}
                                        </TableCell>
                                        <TableCell className="py-4 text-right align-top">
                                            <div className="flex justify-end gap-2">
                                                <Link href={company.links?.show || `/company-profiles/${company.id}`}>
                                                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-md">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={company.links?.edit || `/company-profiles/${company.id}/edit`}>
                                                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-md">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-md border-destructive/30 text-destructive hover:bg-destructive/10"
                                                    onClick={() => setCompanyToDelete(company)}
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
                        pagination={companies}
                        filters={filters}
                        path="/company-profiles"
                        label="companies"
                    />
                </IndexTableCard>
            </div>

            <AlertDialog open={!!companyToDelete} onOpenChange={() => setCompanyToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete company profile</AlertDialogTitle>
                        <AlertDialogDescription>
                            Remove <span className="font-semibold text-foreground">{companyToDelete?.company_name}</span>.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={handleDeleteCompany}
                        >
                            Delete company
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
    icon: typeof Building2;
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {label}
                </p>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-black tracking-tight text-foreground">{value}</p>
        </div>
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
        <div className="rounded-lg border border-border bg-muted/20 p-4">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {label}
            </label>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="mt-3 w-full cursor-pointer border-none bg-transparent px-0 py-0 text-sm font-semibold text-foreground focus:ring-0"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}
