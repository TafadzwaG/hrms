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
    ClipboardList,
    Eye,
    FileText,
    Filter,
    FolderKanban,
    Pencil,
    Plus,
    Search,
    Sparkles,
    Star,
    Target,
    Trash2,
    UserRound,
} from 'lucide-react';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import ReactPaginate from 'react-paginate';

type ScorecardRow = {
    id: number;
    status: string;
    overall_score: number | null;
    overall_rating: string | null;
    employee: { id: number; full_name: string; staff_number: string } | null;
    cycle: { id: number; title: string } | null;
    finalized_at: string | null;
    updated_at: string | null;
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

function formatLabel(value: string | null | undefined) {
    if (!value) return '—';
    return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value: string | null | undefined, format = 'DD MMM YYYY') {
    if (!value) return '—';

    const parsed = moment(value);
    return parsed.isValid() ? parsed.format(format) : '—';
}

function statusVariant(status: string): 'default' | 'secondary' | 'outline' {
    switch (status) {
        case 'finalized':
        case 'manager_reviewed':
            return 'default';
        case 'self_assessment_pending':
        case 'self_assessment_submitted':
        case 'manager_review_pending':
        case 'hr_moderation_pending':
            return 'secondary';
        default:
            return 'outline';
    }
}

function ratingVariant(rating: string | null): 'default' | 'secondary' | 'outline' {
    switch (rating?.toLowerCase()) {
        case 'outstanding':
        case 'very good':
            return 'default';
        case 'good':
        case 'needs improvement':
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
        const params: Record<string, string> = {};

        if (search.trim() !== '') {
            params.search = search.trim();
        }

        if (cycleId !== 'all') {
            params.cycle_id = cycleId;
        }

        if (status !== 'all') {
            params.status = status;
        }

        const timer = window.setTimeout(() => {
            router.get('/employee-scorecards', params, {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            });
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
        const params: Record<string, string | number> = {
            page: selectedItem.selected + 1,
        };

        if (search.trim() !== '') {
            params.search = search.trim();
        }

        if (cycleId !== 'all') {
            params.cycle_id = cycleId;
        }

        if (status !== 'all') {
            params.status = status;
        }

        router.get('/employee-scorecards', params, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const summary = useMemo(() => {
        const rows = scorecards.data ?? [];
        const scoredRows = rows.filter((scorecard) => scorecard.overall_score !== null);
        const averageScore =
            scoredRows.length > 0
                ? (
                      scoredRows.reduce(
                          (sum, scorecard) => sum + Number(scorecard.overall_score ?? 0),
                          0,
                      ) / scoredRows.length
                  ).toFixed(1)
                : '0.0';

        return {
            finalizedCount: rows.filter((scorecard) => scorecard.status === 'finalized').length,
            averageScore,
        };
    }, [scorecards.data]);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Performance', href: '/performance' },
                { title: 'Scorecards', href: '/employee-scorecards' },
            ]}
        >
            <Head title="Employee Scorecards" />

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
                                        Employee Scorecards
                                    </h1>
                                    <p className="max-w-2xl text-sm text-muted-foreground">
                                        Track assessment progress, review employee outcomes, and keep
                                        every scorecard visible in one workspace.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Link href="/employee-scorecards/create">
                                    <Button className="w-full sm:w-auto">
                                        <Plus className="mr-2 h-4 w-4" />
                                        New Scorecard
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
                                icon={<ClipboardList className="h-4 w-4" />}
                                label="Visible Scorecards"
                                value={scorecards.total}
                                helper="Current filtered result set"
                            />
                            <MetricCard
                                icon={<Target className="h-4 w-4" />}
                                label="Finalized on Page"
                                value={summary.finalizedCount}
                                helper="Based on the current page"
                            />
                            <MetricCard
                                icon={<Star className="h-4 w-4" />}
                                label="Average Score"
                                value={summary.averageScore}
                                helper="Across scored items on this page"
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
                                    Search by employee and narrow the list by cycle or workflow status.
                                </CardDescription>
                            </div>

                            <Badge variant="outline" className="w-fit">
                                {scorecards.total} result{scorecards.total === 1 ? '' : 's'}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
                            <div className="relative">
                                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by employee name or staff number..."
                                    className="pl-9"
                                />
                            </div>

                            <Select value={cycleId} onValueChange={setCycleId}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Cycles" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Cycles</SelectItem>
                                    {cycles.map((cycle) => (
                                        <SelectItem key={cycle.id} value={String(cycle.id)}>
                                            {cycle.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

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
                                    <ClipboardList className="h-4 w-4" />
                                    Scorecards Directory
                                </CardTitle>
                                <CardDescription>
                                    Review progress, ratings, and linked performance cycles.
                                </CardDescription>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <FileText className="h-4 w-4" />
                                <span>
                                    Page {scorecards.current_page} of {scorecards.last_page}
                                </span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {scorecards.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-14 text-center">
                                <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="text-lg font-semibold">No scorecards found</h3>
                                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                    Try adjusting your filters or create a new scorecard.
                                </p>
                                <div className="mt-6">
                                    <Link href="/employee-scorecards/create">
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create Scorecard
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
                                            <TableHead>Cycle</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Score</TableHead>
                                            <TableHead>Rating</TableHead>
                                            <TableHead>Updated</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {scorecards.data.map((scorecard) => (
                                            <TableRow key={scorecard.id}>
                                                <TableCell className="align-top">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <UserRound className="h-4 w-4 text-muted-foreground" />
                                                            <span className="font-medium">
                                                                {scorecard.employee?.full_name ?? '—'}
                                                            </span>
                                                        </div>
                                                        <p className="font-mono text-xs text-muted-foreground">
                                                            {scorecard.employee?.staff_number ?? '—'}
                                                        </p>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="align-top">
                                                    {scorecard.cycle?.title ?? '—'}
                                                </TableCell>

                                                <TableCell className="align-top">
                                                    <Badge variant={statusVariant(scorecard.status)}>
                                                        {formatLabel(scorecard.status)}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell className="align-top font-medium">
                                                    {scorecard.overall_score != null
                                                        ? Number(scorecard.overall_score).toFixed(1)
                                                        : '—'}
                                                </TableCell>

                                                <TableCell className="align-top">
                                                    {scorecard.overall_rating ? (
                                                        <Badge variant={ratingVariant(scorecard.overall_rating)}>
                                                            {scorecard.overall_rating}
                                                        </Badge>
                                                    ) : (
                                                        '—'
                                                    )}
                                                </TableCell>

                                                <TableCell className="align-top">
                                                    <div className="space-y-1 text-sm">
                                                        <p>{formatDate(scorecard.updated_at, 'DD MMM YYYY, HH:mm')}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Finalized {formatDate(scorecard.finalized_at)}
                                                        </p>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="align-top text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={scorecard.links.show}>
                                                            <Button variant="outline" size="icon" title="View">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>

                                                        <Link href={scorecard.links.edit}>
                                                            <Button variant="outline" size="icon" title="Edit">
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>

                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            title="Delete"
                                                            onClick={() => setScorecardToDelete(scorecard)}
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

                        {scorecards.last_page > 1 && (
                            <div className="flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row">
                                <span className="text-xs font-medium text-muted-foreground">
                                    Showing page {scorecards.current_page} of {scorecards.last_page}
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
                open={!!scorecardToDelete}
                onOpenChange={(open) => !open && setScorecardToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <Trash2 className="h-4 w-4" />
                            Delete Scorecard
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the scorecard for{' '}
                            <strong>{scorecardToDelete?.employee?.full_name}</strong>? This action cannot be undone.
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
