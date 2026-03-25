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
import { MetricCard, formatLabel } from '@/pages/Performance/components/primitives';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Eye,
    Filter,
    FolderKanban,
    Layers3,
    Pencil,
    Plus,
    Search,
    Sparkles,
    Target,
    Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ReactPaginate from 'react-paginate';

type KpiRow = {
    id: number;
    name: string;
    code: string | null;
    perspective: string;
    target_type: string;
    default_target: string | null;
    default_weight: number | string | null;
    is_active: boolean;
};

type PaginatedKpis = {
    data: KpiRow[];
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
};

function formatWeight(value: number | string | null) {
    if (value === null || value === '') return '—';

    const numeric = Number(value);

    return Number.isFinite(numeric) ? `${numeric.toFixed(2)}%` : '—';
}

function perspectiveVariant(perspective: string): 'default' | 'secondary' | 'outline' {
    switch (perspective) {
        case 'financial':
        case 'customer':
            return 'secondary';
        case 'internal_process':
            return 'default';
        default:
            return 'outline';
    }
}

export default function KpiIndex() {
    const { kpis, filters, perspectives } = usePage<{
        kpis: PaginatedKpis;
        filters: { search?: string; perspective?: string; is_active?: string };
        perspectives: string[];
    }>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [perspective, setPerspective] = useState(filters.perspective ?? 'all');
    const [isActive, setIsActive] = useState(filters.is_active ?? 'all');
    const [kpiToDelete, setKpiToDelete] = useState<KpiRow | null>(null);

    const cleanPerspectives = perspectives.filter((item) => item.trim() !== '');

    const summary = useMemo(() => {
        const rows = kpis.data ?? [];

        return {
            visibleActive: rows.filter((kpi) => kpi.is_active).length,
            visibleInactive: rows.filter((kpi) => !kpi.is_active).length,
            visiblePerspectives: new Set(rows.map((kpi) => kpi.perspective)).size,
        };
    }, [kpis.data]);

    useEffect(() => {
        const params: Record<string, string> = {};

        if (search.trim() !== '') {
            params.search = search.trim();
        }

        if (perspective !== 'all') {
            params.perspective = perspective;
        }

        if (isActive !== 'all') {
            params.is_active = isActive;
        }

        const timer = window.setTimeout(() => {
            router.get('/kpi-library', params, {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            });
        }, 250);

        return () => window.clearTimeout(timer);
    }, [search, perspective, isActive]);

    const handleDelete = () => {
        if (!kpiToDelete) return;

        router.delete(`/kpi-library/${kpiToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => setKpiToDelete(null),
        });
    };

    const handlePageChange = (selectedItem: { selected: number }) => {
        const params: Record<string, string | number> = {
            page: selectedItem.selected + 1,
        };

        if (search.trim() !== '') {
            params.search = search.trim();
        }

        if (perspective !== 'all') {
            params.perspective = perspective;
        }

        if (isActive !== 'all') {
            params.is_active = isActive;
        }

        router.get('/kpi-library', params, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Performance', href: '/performance' },
                { title: 'KPI Library', href: '/kpi-library' },
            ]}
        >
            <Head title="KPI Library" />

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
                                        KPI Library
                                    </h1>
                                    <p className="max-w-2xl text-sm text-muted-foreground">
                                        Manage reusable KPI definitions with the same monochrome workspace structure used across performance cycles and templates.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Link href="/kpi-library/create">
                                    <Button className="w-full sm:w-auto">
                                        <Plus className="mr-2 h-4 w-4" />
                                        New KPI
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
                                icon={<BarChart3 className="h-4 w-4" />}
                                label="Visible KPIs"
                                value={kpis.total}
                                helper="Current filtered result set"
                            />
                            <MetricCard
                                icon={<Target className="h-4 w-4" />}
                                label="Active on Page"
                                value={summary.visibleActive}
                                helper={`${summary.visibleInactive} inactive on the current page`}
                            />
                            <MetricCard
                                icon={<Layers3 className="h-4 w-4" />}
                                label="Visible Perspectives"
                                value={summary.visiblePerspectives}
                                helper={`${cleanPerspectives.length} perspectives available overall`}
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
                                    Search by KPI name or code, then narrow the library by perspective or status.
                                </CardDescription>
                            </div>

                            <Badge variant="outline" className="w-fit">
                                {kpis.total} result{kpis.total === 1 ? '' : 's'}
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
                            <div className="relative">
                                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search by KPI name or code..."
                                    className="pl-9"
                                />
                            </div>

                            <Select value={perspective} onValueChange={setPerspective}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Perspectives" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Perspectives</SelectItem>
                                    {cleanPerspectives.map((item) => (
                                        <SelectItem key={item} value={item}>
                                            {formatLabel(item)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={isActive} onValueChange={setIsActive}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="1">Active</SelectItem>
                                    <SelectItem value="0">Inactive</SelectItem>
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
                                    <Layers3 className="h-4 w-4" />
                                    KPI Directory
                                </CardTitle>
                                <CardDescription>
                                    Review, edit, and manage the KPI definitions used in scorecards and templates.
                                </CardDescription>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <BarChart3 className="h-4 w-4" />
                                <span>
                                    Page {kpis.current_page} of {kpis.last_page}
                                </span>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {kpis.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-14 text-center">
                                <BarChart3 className="mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="text-lg font-semibold">No KPIs found</h3>
                                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                    Try adjusting your filters, or create a new KPI to build out the library.
                                </p>
                                <div className="mt-6">
                                    <Link href="/kpi-library/create">
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create KPI
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-lg border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>KPI</TableHead>
                                            <TableHead>Perspective</TableHead>
                                            <TableHead>Target Type</TableHead>
                                            <TableHead>Default Target</TableHead>
                                            <TableHead>Default Weight</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {kpis.data.map((kpi) => (
                                            <TableRow key={kpi.id}>
                                                <TableCell className="align-top">
                                                    <div className="space-y-1">
                                                        <p className="font-medium">{kpi.name}</p>
                                                        <p className="font-mono text-xs text-muted-foreground">
                                                            {kpi.code || 'No code assigned'}
                                                        </p>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="align-top">
                                                    <Badge variant={perspectiveVariant(kpi.perspective)}>
                                                        {formatLabel(kpi.perspective)}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell className="align-top">
                                                    {formatLabel(kpi.target_type)}
                                                </TableCell>

                                                <TableCell className="align-top">
                                                    {kpi.default_target ?? '—'}
                                                </TableCell>

                                                <TableCell className="align-top">
                                                    {formatWeight(kpi.default_weight)}
                                                </TableCell>

                                                <TableCell className="align-top">
                                                    <Badge variant={kpi.is_active ? 'default' : 'outline'}>
                                                        {kpi.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell className="text-right align-top">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={`/kpi-library/${kpi.id}`}>
                                                            <Button variant="outline" size="icon" title="View">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>

                                                        <Link href={`/kpi-library/${kpi.id}/edit`}>
                                                            <Button variant="outline" size="icon" title="Edit">
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>

                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            title="Delete"
                                                            onClick={() => setKpiToDelete(kpi)}
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

                        {kpis.last_page > 1 ? (
                            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                                <span className="text-xs text-muted-foreground">
                                    Showing page {kpis.current_page} of {kpis.last_page}
                                </span>

                                <ReactPaginate
                                    pageCount={kpis.last_page}
                                    forcePage={kpis.current_page - 1}
                                    onPageChange={handlePageChange}
                                    marginPagesDisplayed={1}
                                    pageRangeDisplayed={3}
                                    previousLabel="Previous"
                                    nextLabel="Next"
                                    breakLabel="..."
                                    containerClassName="flex items-center gap-1"
                                    pageLinkClassName="inline-flex h-9 w-9 items-center justify-center rounded-md border border-transparent bg-transparent text-sm text-muted-foreground transition-colors hover:bg-muted"
                                    activeLinkClassName="!rounded-md !border-foreground !bg-foreground !text-background hover:!bg-foreground/90"
                                    previousLinkClassName="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm text-foreground transition-colors hover:bg-muted"
                                    nextLinkClassName="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm text-foreground transition-colors hover:bg-muted"
                                    breakClassName="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground"
                                    disabledClassName="pointer-events-none opacity-50"
                                />
                            </div>
                        ) : null}
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={!!kpiToDelete} onOpenChange={(open) => !open && setKpiToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete KPI</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>{kpiToDelete?.name}</strong>
                            {kpiToDelete?.code ? ` (${kpiToDelete.code})` : ''}? This action cannot be undone.
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
