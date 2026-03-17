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
import { AlertTriangle, Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
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

function formatStatus(status: string) {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function statusBadgeClass(status: string) {
    switch (status) {
        case 'active':
            return 'bg-emerald-50 text-emerald-600 border-emerald-200';
        case 'on_track':
            return 'bg-blue-50 text-blue-600 border-blue-200';
        case 'at_risk':
            return 'bg-amber-50 text-amber-600 border-amber-200';
        case 'completed':
            return 'bg-purple-50 text-purple-600 border-purple-200';
        case 'cancelled':
            return 'bg-gray-50 text-gray-600 border-gray-200';
        default:
            return 'bg-gray-50 text-gray-600 border-gray-200';
    }
}

function employeeName(emp: PlanRow['employee']) {
    if (!emp) return '—';
    return [emp.first_name, emp.middle_name, emp.surname].filter(Boolean).join(' ');
}

export default function ImprovementPlansIndex() {
    const { plans, filters, statuses } = usePage<{
        plans: PaginatedPlans;
        filters: { search?: string; status?: string };
        statuses: string[];
    }>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? 'all');
    const [planToDelete, setPlanToDelete] = useState<PlanRow | null>(null);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            router.get(
                '/improvement-plans',
                {
                    search,
                    status: status === 'all' ? '' : status,
                },
                { preserveState: true, replace: true, preserveScroll: true },
            );
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
        router.get(
            '/improvement-plans',
            {
                page: selectedItem.selected + 1,
                search,
                status: status === 'all' ? '' : status,
            },
            { preserveScroll: true, preserveState: true },
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Performance', href: '/performance' },
                { title: 'Improvement Plans', href: '/improvement-plans' },
            ]}
        >
            <Head title="Improvement Plans" />

            <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Performance Improvement Plans</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage performance improvement plans for employees.
                        </p>
                    </div>
                    <Link href="/improvement-plans/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Plan
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by title or employee..."
                                    className="pl-9"
                                />
                            </div>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="w-full sm:w-44">
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    {statuses.map((s) => (
                                        <SelectItem key={s} value={s}>
                                            {formatStatus(s)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Improvement Plans</CardTitle>
                        <CardDescription>{plans.total} plan{plans.total !== 1 ? 's' : ''} found</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {plans.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <AlertTriangle className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                <h3 className="mb-1 text-lg font-semibold">No improvement plans found</h3>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Try adjusting your filters or create a new plan.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Employee</TableHead>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Cycle</TableHead>
                                            <TableHead>Start Date</TableHead>
                                            <TableHead>End Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {plans.data.map((plan) => (
                                            <TableRow key={plan.id}>
                                                <TableCell className="font-medium">{employeeName(plan.employee)}</TableCell>
                                                <TableCell>{plan.title}</TableCell>
                                                <TableCell>{plan.scorecard?.cycle?.title ?? '—'}</TableCell>
                                                <TableCell>{plan.start_date}</TableCell>
                                                <TableCell>{plan.end_date}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={statusBadgeClass(plan.status)}>
                                                        {formatStatus(plan.status)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Link href={`/improvement-plans/${plan.id}`}>
                                                            <Button variant="ghost" size="icon" title="View">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={`/improvement-plans/${plan.id}/edit`}>
                                                            <Button variant="ghost" size="icon" title="Edit">
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Delete"
                                                            onClick={() => setPlanToDelete(plan)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
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
                        {plans.last_page > 1 && (
                            <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                                <span className="text-xs font-bold text-muted-foreground">
                                    Page {plans.current_page} of {plans.last_page}
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
                                    pageLinkClassName="inline-flex h-9 w-9 items-center justify-center rounded-md border border-transparent bg-transparent font-bold hover:bg-muted text-sm shadow-none text-muted-foreground transition-colors"
                                    activeLinkClassName="!bg-foreground text-background font-bold border-foreground hover:!bg-foreground/90 rounded-md"
                                    previousLinkClassName="inline-flex h-9 px-4 items-center justify-center rounded-md border border-border bg-background hover:bg-muted text-sm font-bold text-foreground transition-colors"
                                    nextLinkClassName="inline-flex h-9 px-4 items-center justify-center rounded-md border border-border bg-background hover:bg-muted text-sm font-bold text-foreground transition-colors"
                                    breakClassName="flex h-9 w-9 items-center justify-center text-sm font-bold text-muted-foreground"
                                    disabledClassName="opacity-50 pointer-events-none"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete Dialog */}
            <AlertDialog
                open={!!planToDelete}
                onOpenChange={(open) => !open && setPlanToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Improvement Plan</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the improvement plan{' '}
                            <strong>{planToDelete?.title}</strong>?
                            This action cannot be undone.
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
