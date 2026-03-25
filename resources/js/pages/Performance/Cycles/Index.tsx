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
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CalendarClock,
    CalendarDays,
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
} from 'lucide-react';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import ReactPaginate from 'react-paginate';

type CycleRow = {
    id: number;
    title: string;
    start_date: string;
    end_date: string;
    status: string;
    scorecards_count: number;
};

type PaginatedCycles = {
    data: CycleRow[];
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
};

function formatStatus(status: string) {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatCycleDate(value: string | null | undefined) {
    if (!value) return '—';

    const parsed = moment(value);
    return parsed.isValid() ? parsed.format('DD MMM YYYY') : '—';
}

function getStatusBadgeVariant(status: string): 'default' | 'secondary' | 'outline' {
    switch (status) {
        case 'active':
        case 'review_in_progress':
            return 'default';
        case 'draft':
        case 'moderation':
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

export default function CycleIndex() {
    const { cycles, filters, statuses } = usePage<{
        cycles: PaginatedCycles;
        filters: { search?: string; status?: string };
        statuses: string[];
    }>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? 'all');
    const [cycleToDelete, setCycleToDelete] = useState<CycleRow | null>(null);

    useEffect(() => {
        const params: Record<string, string> = {};

        if (search.trim() !== '') {
            params.search = search.trim();
        }

        if (status !== 'all') {
            params.status = status;
        }

        const timer = window.setTimeout(() => {
            router.get('/performance-cycles', params, {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            });
        }, 250);

        return () => window.clearTimeout(timer);
    }, [search, status]);

    const handleDelete = () => {
        if (!cycleToDelete) return;

        router.delete(`/performance-cycles/${cycleToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => setCycleToDelete(null),
        });
    };

    const handlePageChange = (selectedItem: { selected: number }) => {
        const params: Record<string, string | number> = {
            page: selectedItem.selected + 1,
        };

        if (search.trim() !== '') {
            params.search = search.trim();
        }

        if (status !== 'all') {
            params.status = status;
        }

        router.get('/performance-cycles', params, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const cleanStatuses = statuses.filter((s) => s.trim() !== '');

    const summary = useMemo(() => {
        const rows = cycles.data ?? [];

        const activeCount = rows.filter((cycle) =>
            ['active', 'review_in_progress'].includes(cycle.status),
        ).length;

        const totalScorecards = rows.reduce(
            (sum, cycle) => sum + Number(cycle.scorecards_count || 0),
            0,
        );

        return {
            activeCount,
            totalScorecards,
        };
    }, [cycles.data]);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Performance', href: '/performance' },
                { title: 'Cycles', href: '/performance-cycles' },
            ]}
        >
            <Head title="Performance Cycles" />

            <div className="w-full space-y-6 p-4 md:p-6">
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
                                        Performance Cycles
                                    </h1>
                                    <p className="max-w-2xl text-sm text-muted-foreground">
                                        Manage review periods, track progress across scorecards, and
                                        keep every cycle organized in one monochrome workspace.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Link href="/performance-cycles/create">
                                    <Button className="w-full sm:w-auto">
                                        <Plus className="mr-2 h-4 w-4" />
                                        New Cycle
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
                                icon={<CalendarDays className="h-4 w-4" />}
                                label="Visible Cycles"
                                value={cycles.total}
                                helper="Current filtered result set"
                            />
                            <MetricCard
                                icon={<CalendarClock className="h-4 w-4" />}
                                label="Active or In Review"
                                value={summary.activeCount}
                                helper="Based on the current page"
                            />
                            <MetricCard
                                icon={<FileText className="h-4 w-4" />}
                                label="Linked Scorecards"
                                value={summary.totalScorecards}
                                helper="Count on the current page"
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
                                    Search by cycle title or narrow the list by status.
                                </CardDescription>
                            </div>

                            <Badge variant="outline" className="w-fit">
                                {cycles.total} result{cycles.total === 1 ? '' : 's'}
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_auto]">
                            <div className="relative">
                                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by title..."
                                    className="pl-9"
                                />
                            </div>

                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    {cleanStatuses.map((s) => (
                                        <SelectItem key={s} value={s}>
                                            {formatStatus(s)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Target className="h-4 w-4" />
                                <span>Fast filtering with preserved state</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <FolderKanban className="h-4 w-4" />
                                    Cycles Directory
                                </CardTitle>
                                <CardDescription>
                                    Review, edit, and manage the lifecycle of performance cycles.
                                </CardDescription>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CalendarDays className="h-4 w-4" />
                                <span>
                                    Page {cycles.current_page} of {cycles.last_page}
                                </span>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {cycles.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-14 text-center">
                                <Target className="mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="text-lg font-semibold">No cycles found</h3>
                                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                    Try adjusting your search or status filter, or create a new
                                    cycle to get started.
                                </p>
                                <div className="mt-6">
                                    <Link href="/performance-cycles/create">
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create Cycle
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-lg border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Cycle</TableHead>
                                            <TableHead>Schedule</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Scorecards</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {cycles.data.map((cycle) => (
                                            <TableRow key={cycle.id}>
                                                <TableCell className="align-top">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                                            <span className="font-medium">
                                                                {cycle.title}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            Cycle #{cycle.id}
                                                        </p>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="align-top">
                                                    <div className="space-y-1 text-sm">
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <CalendarClock className="h-4 w-4" />
                                                            <span>
                                                                {formatCycleDate(cycle.start_date)}
                                                            </span>
                                                            <ArrowRight className="h-3.5 w-3.5" />
                                                            <span>
                                                                {formatCycleDate(cycle.end_date)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="align-top">
                                                    <Badge
                                                        variant={getStatusBadgeVariant(cycle.status)}
                                                    >
                                                        {formatStatus(cycle.status)}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell className="align-top">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-medium">
                                                            {cycle.scorecards_count}
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="align-top text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={`/performance-cycles/${cycle.id}`}>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                title="View"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>

                                                        <Link
                                                            href={`/performance-cycles/${cycle.id}/edit`}
                                                        >
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                title="Edit"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>

                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            title="Delete"
                                                            onClick={() => setCycleToDelete(cycle)}
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

                        {cycles.last_page > 1 && (
                            <div className="flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row">
                                <span className="text-xs font-medium text-muted-foreground">
                                    Showing page {cycles.current_page} of {cycles.last_page}
                                </span>

                                <ReactPaginate
                                    pageCount={cycles.last_page}
                                    forcePage={cycles.current_page - 1}
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
                open={!!cycleToDelete}
                onOpenChange={(open) => !open && setCycleToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <Trash2 className="h-4 w-4" />
                            Delete Cycle
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete{' '}
                            <strong>{cycleToDelete?.title}</strong>? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}