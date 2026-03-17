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
import { ClipboardList, Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

type ScorecardRow = {
    id: number;
    status: string;
    overall_score: number | null;
    overall_rating: string | null;
    employee: { id: number; full_name: string; staff_number: string };
    cycle: { id: number; title: string };
    finalized_at: string | null;
    updated_at: string;
    links: { show: string; edit: string };
};

type PaginatedScorecards = {
    data: ScorecardRow[];
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
};

type CycleOption = {
    id: number;
    title: string;
};

function formatStatus(status: string) {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function statusBadgeClass(status: string) {
    switch (status) {
        case 'draft':
            return 'bg-gray-50 text-gray-600 border-gray-200';
        case 'self_assessment_pending':
            return 'bg-yellow-50 text-yellow-600 border-yellow-200';
        case 'self_assessment_submitted':
            return 'bg-blue-50 text-blue-600 border-blue-200';
        case 'manager_review_pending':
            return 'bg-orange-50 text-orange-600 border-orange-200';
        case 'manager_reviewed':
            return 'bg-indigo-50 text-indigo-600 border-indigo-200';
        case 'hr_moderation_pending':
            return 'bg-purple-50 text-purple-600 border-purple-200';
        case 'finalized':
            return 'bg-emerald-50 text-emerald-600 border-emerald-200';
        case 'archived':
            return 'bg-gray-50 text-gray-600 border-gray-200';
        default:
            return 'bg-gray-50 text-gray-600 border-gray-200';
    }
}

function ratingBadgeClass(rating: string) {
    switch (rating?.toLowerCase()) {
        case 'outstanding':
            return 'bg-emerald-50 text-emerald-600 border-emerald-200';
        case 'very good':
            return 'bg-blue-50 text-blue-600 border-blue-200';
        case 'good':
            return 'bg-teal-50 text-teal-600 border-teal-200';
        case 'needs improvement':
            return 'bg-amber-50 text-amber-600 border-amber-200';
        case 'unsatisfactory':
            return 'bg-red-50 text-red-600 border-red-200';
        default:
            return 'bg-gray-50 text-gray-600 border-gray-200';
    }
}

export default function ScorecardIndex() {
    const { scorecards, filters, cycles, statuses } = usePage<{
        scorecards: PaginatedScorecards;
        filters: { search?: string; cycle_id?: string; status?: string };
        cycles: CycleOption[];
        statuses: string[];
    }>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [cycleId, setCycleId] = useState(filters.cycle_id ?? 'all');
    const [status, setStatus] = useState(filters.status ?? 'all');
    const [scorecardToDelete, setScorecardToDelete] = useState<ScorecardRow | null>(null);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            router.get(
                '/employee-scorecards',
                {
                    search,
                    cycle_id: cycleId === 'all' ? '' : cycleId,
                    status: status === 'all' ? '' : status,
                },
                { preserveState: true, replace: true, preserveScroll: true },
            );
        }, 250);

        return () => window.clearTimeout(timer);
    }, [search, cycleId, status]);

    const handleDelete = () => {
        if (!scorecardToDelete) return;
        router.delete(`/employee-scorecards/${scorecardToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => setScorecardToDelete(null),
        });
    };

    const handlePageChange = (selectedItem: { selected: number }) => {
        router.get(
            '/employee-scorecards',
            {
                page: selectedItem.selected + 1,
                search,
                cycle_id: cycleId === 'all' ? '' : cycleId,
                status: status === 'all' ? '' : status,
            },
            { preserveScroll: true, preserveState: true },
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Performance', href: '/performance' },
                { title: 'Scorecards', href: '/employee-scorecards' },
            ]}
        >
            <Head title="Employee Scorecards" />

            <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Employee Scorecards</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage balanced scorecard performance assessments.
                        </p>
                    </div>
                    <Link href="/employee-scorecards/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Scorecard
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
                                    placeholder="Search by employee name or staff number..."
                                    className="pl-9"
                                />
                            </div>
                            <Select value={cycleId} onValueChange={setCycleId}>
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue placeholder="All Cycles" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Cycles</SelectItem>
                                    {cycles.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>
                                            {c.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="w-full sm:w-48">
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
                        <CardTitle>Scorecards</CardTitle>
                        <CardDescription>{scorecards.total} scorecard{scorecards.total !== 1 ? 's' : ''} found</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {scorecards.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                <h3 className="mb-1 text-lg font-semibold">No scorecards found</h3>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Try adjusting your filters or create a new scorecard.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Employee</TableHead>
                                            <TableHead>Cycle</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Score</TableHead>
                                            <TableHead>Rating</TableHead>
                                            <TableHead>Last Updated</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {scorecards.data.map((sc) => (
                                            <TableRow key={sc.id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{sc.employee.full_name}</div>
                                                        <div className="font-mono text-xs text-muted-foreground">{sc.employee.staff_number}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{sc.cycle.title}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={statusBadgeClass(sc.status)}>
                                                        {formatStatus(sc.status)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {sc.overall_score != null ? sc.overall_score.toFixed(1) : '--'}
                                                </TableCell>
                                                <TableCell>
                                                    {sc.overall_rating ? (
                                                        <Badge variant="outline" className={ratingBadgeClass(sc.overall_rating)}>
                                                            {sc.overall_rating}
                                                        </Badge>
                                                    ) : '--'}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">{sc.updated_at}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Link href={sc.links.show}>
                                                            <Button variant="ghost" size="icon" title="View">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={sc.links.edit}>
                                                            <Button variant="ghost" size="icon" title="Edit">
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Delete"
                                                            onClick={() => setScorecardToDelete(sc)}
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
                        {scorecards.last_page > 1 && (
                            <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                                <span className="text-xs font-bold text-muted-foreground">
                                    Page {scorecards.current_page} of {scorecards.last_page}
                                </span>
                                <ReactPaginate
                                    pageCount={scorecards.last_page}
                                    forcePage={scorecards.current_page - 1}
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
                open={!!scorecardToDelete}
                onOpenChange={(open) => !open && setScorecardToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Scorecard</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the scorecard for{' '}
                            <strong>{scorecardToDelete?.employee.full_name}</strong>?
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
