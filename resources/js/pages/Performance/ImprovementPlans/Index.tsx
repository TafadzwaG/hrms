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
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RoleScopeBar } from '@/components/role-scope-bar';
import { Separator } from '@/components/ui/separator';
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
import { buildIndexParams } from '@/lib/index-table';
import type { PageRoleScope } from '@/types/auth';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    Eye,
    FileText,
    Filter,
    FolderKanban,
    Pencil,
    Plus,
    Search,
    Sparkles,
    Target,
    Trash2,
    UserRound,
} from 'lucide-react';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import ReactPaginate from 'react-paginate';

type PlanRow = {
    id: number;
    title: string;
    start_date: string;
    end_date: string;
    status: string;
    employee: {
        id: number;
        first_name: string;
        middle_name: string | null;
        surname: string;
        staff_number: string;
    } | null;
    scorecard: {
        cycle: { id: number; title: string } | null;
    } | null;
};

type PaginatedPlans = {
    data: PlanRow[];
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
};

function formatLabel(value: string | null | undefined) {
    if (!value) return '—';
    return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value: string | null | undefined, format = 'DD MMM YYYY') {
    if (!value) return '—';

    const parsed = moment(value);
    return parsed.isValid() ? parsed.format(format) : '—';
}

function employeeName(employee: PlanRow['employee']) {
    if (!employee) return '—';
    return [employee.first_name, employee.middle_name, employee.surname].filter(Boolean).join(' ');
}

function statusVariant(status: string): 'default' | 'secondary' | 'outline' {
    switch (status) {
        case 'active':
        case 'on_track':
            return 'default';
        case 'at_risk':
            return 'secondary';
        default:
            return 'outline';
    }
}

function MetricCard({
    icon,
    label,
    value,
    helper,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    helper: string;
}) {
    return (
        <Card>
            <CardContent className="flex items-start gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-muted">
                    {icon}
                </div>
                <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {label}
                    </p>
                    <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
                </div>
            </CardContent>
        </Card>
    );
}

export default function ImprovementPlansIndex() {
    const { plans, filters, statuses, scope } = usePage<{
        plans: PaginatedPlans;
        filters: { search?: string; status?: string; scope_view?: string };
        statuses: string[];
        scope?: PageRoleScope;
    }>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? 'all');
    const [planToDelete, setPlanToDelete] = useState<PlanRow | null>(null);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            router.get('/improvement-plans', buildIndexParams(filters, {
                search: search.trim(),
                status: status !== 'all' ? status : '',
            }), {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            });
        }, 250);

        return () => window.clearTimeout(timer);
    }, [search, status]);

    const handleDelete = () => {
        if (!planToDelete) return;

        router.delete(`/improvement-plans/${planToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => setPlanToDelete(null),
        });
    };

    const handlePageChange = (selectedItem: { selected: number }) => {
        router.get('/improvement-plans', buildIndexParams(
            filters,
            {
                page: selectedItem.selected + 1,
                search: search.trim(),
                status: status !== 'all' ? status : '',
            },
            { resetPage: false },
        ), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const summary = useMemo(() => {
        const rows = plans.data ?? [];

        return {
            activeCount: rows.filter((plan) => ['active', 'on_track'].includes(plan.status)).length,
            atRiskCount: rows.filter((plan) => plan.status === 'at_risk').length,
        };
    }, [plans.data]);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Performance', href: '/performance' },
                { title: 'Improvement Plans', href: '/improvement-plans' },
            ]}
        >
            <Head title="Improvement Plans" />

            <div className="w-full space-y-6 p-4 md:p-6">
                <RoleScopeBar
                    scope={scope}
                    path="/improvement-plans"
                    filters={filters}
                />

                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Sparkles className="h-4 w-4" />
                                    <span>Performance Management</span>
                                </div>

                                <div className="space-y-2">
                                    <h1 className="text-3xl font-semibold tracking-tight">
                                        Improvement Plans
                                    </h1>
                                    <p className="max-w-2xl text-sm text-muted-foreground">
                                        Manage recovery plans, track timelines, and keep at-risk
                                        performance actions visible in one workspace.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Link href="/improvement-plans/create">
                                    <Button className="w-full sm:w-auto">
                                        <Plus className="mr-2 h-4 w-4" />
                                        New Plan
                                    </Button>
                                </Link>

                                <Link href="/performance">
                                    <Button variant="outline" className="w-full sm:w-auto">
                                        <FolderKanban className="mr-2 h-4 w-4" />
                                        Back to Performance
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <Separator className="my-6" />

                        <div className="grid gap-4 md:grid-cols-3">
                            <MetricCard
                                icon={<AlertTriangle className="h-4 w-4" />}
                                label="Visible Plans"
                                value={plans.total}
                                helper="Current filtered result set"
                            />
                            <MetricCard
                                icon={<Target className="h-4 w-4" />}
                                label="Active or On Track"
                                value={summary.activeCount}
                                helper="Based on the current page"
                            />
                            <MetricCard
                                icon={<FileText className="h-4 w-4" />}
                                label="At Risk"
                                value={summary.atRiskCount}
                                helper="Current page critical plans"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                    Refine Results
                                </CardTitle>
                                <CardDescription>
                                    Search by employee or title and narrow the list by current plan status.
                                </CardDescription>
                            </div>

                            <Badge variant="outline" className="w-fit">
                                {plans.total} result{plans.total === 1 ? '' : 's'}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
                            <div className="relative">
                                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by plan title or employee..."
                                    className="pl-9"
                                />
                            </div>

                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    {statuses.map((rowStatus) => (
                                        <SelectItem key={rowStatus} value={rowStatus}>
                                            {formatLabel(rowStatus)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    Improvement Plan Directory
                                </CardTitle>
                                <CardDescription>
                                    Review plan ownership, linked cycles, and intervention windows.
                                </CardDescription>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <FileText className="h-4 w-4" />
                                <span>
                                    Page {plans.current_page} of {plans.last_page}
                                </span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {plans.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-14 text-center">
                                <AlertTriangle className="mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="text-lg font-semibold">No improvement plans found</h3>
                                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                    Try adjusting your filters or create a new improvement plan.
                                </p>
                                <div className="mt-6">
                                    <Link href="/improvement-plans/create">
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create Plan
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-lg border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Employee</TableHead>
                                            <TableHead>Plan</TableHead>
                                            <TableHead>Cycle</TableHead>
                                            <TableHead>Window</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {plans.data.map((plan) => (
                                            <TableRow key={plan.id}>
                                                <TableCell className="align-top">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <UserRound className="h-4 w-4 text-muted-foreground" />
                                                            <span className="font-medium">{employeeName(plan.employee)}</span>
                                                        </div>
                                                        <p className="font-mono text-xs text-muted-foreground">
                                                            {plan.employee?.staff_number ?? '—'}
                                                        </p>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="align-top">
                                                    <div className="space-y-1">
                                                        <p className="font-medium">{plan.title}</p>
                                                        <p className="text-xs text-muted-foreground">Plan #{plan.id}</p>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="align-top">
                                                    {plan.scorecard?.cycle?.title ?? '—'}
                                                </TableCell>

                                                <TableCell className="align-top">
                                                    <div className="space-y-1 text-sm">
                                                        <p>{formatDate(plan.start_date)}</p>
                                                        <p className="text-muted-foreground">to {formatDate(plan.end_date)}</p>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="align-top">
                                                    <Badge variant={statusVariant(plan.status)}>
                                                        {formatLabel(plan.status)}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell className="align-top text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={`/improvement-plans/${plan.id}`}>
                                                            <Button variant="outline" size="icon" title="View">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>

                                                        <Link href={`/improvement-plans/${plan.id}/edit`}>
                                                            <Button variant="outline" size="icon" title="Edit">
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>

                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            title="Delete"
                                                            onClick={() => setPlanToDelete(plan)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        {plans.last_page > 1 && (
                            <div className="flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row">
                                <span className="text-xs font-medium text-muted-foreground">
                                    Showing page {plans.current_page} of {plans.last_page}
                                </span>
                                <ReactPaginate
                                    pageCount={plans.last_page}
                                    forcePage={plans.current_page - 1}
                                    onPageChange={handlePageChange}
                                    marginPagesDisplayed={1}
                                    pageRangeDisplayed={3}
                                    previousLabel="Previous"
                                    nextLabel="Next"
                                    breakLabel="..."
                                    containerClassName="flex items-center gap-1"
                                    pageLinkClassName="inline-flex h-9 w-9 items-center justify-center rounded-md border border-transparent bg-transparent text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
                                    activeLinkClassName="!border-border !bg-foreground !text-background"
                                    previousLinkClassName="inline-flex h-9 px-4 items-center justify-center rounded-md border border-border bg-background text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                    nextLinkClassName="inline-flex h-9 px-4 items-center justify-center rounded-md border border-border bg-background text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                    breakClassName="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground"
                                    disabledClassName="pointer-events-none opacity-50"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <AlertDialog
                open={!!planToDelete}
                onOpenChange={(open) => !open && setPlanToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <Trash2 className="h-4 w-4" />
                            Delete Improvement Plan
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the improvement plan{' '}
                            <strong>{planToDelete?.title}</strong>? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
