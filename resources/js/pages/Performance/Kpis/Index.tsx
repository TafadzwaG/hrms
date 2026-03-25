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
import { BarChart3, Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

type KpiRow = {
    id: number;
    name: string;
    code: string;
    perspective: string;
    target_type: string;
    default_target: string | null;
    default_weight: number | null;
    is_active: boolean;
};

type PaginatedKpis = {
    data: KpiRow[];
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
};

function formatStatus(status: string) {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function perspectiveBadgeClass(perspective: string) {
    switch (perspective) {
        case 'financial':
            return 'bg-emerald-50 text-emerald-600 border-emerald-200';
        case 'customer':
            return 'bg-blue-50 text-blue-600 border-blue-200';
        case 'internal_process':
            return 'bg-amber-50 text-amber-600 border-amber-200';
        case 'learning_and_growth':
            return 'bg-purple-50 text-purple-600 border-purple-200';
        default:
            return 'bg-gray-50 text-gray-600 border-gray-200';
    }
}

export default function KpiIndex() {
    const { kpis, filters, perspectives, targetTypes } = usePage<{
        kpis: PaginatedKpis;
        filters: { search?: string; perspective?: string; is_active?: string };
        perspectives: string[];
        targetTypes: string[];
    }>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [perspective, setPerspective] = useState(filters.perspective ?? 'all');
    const [isActive, setIsActive] = useState(filters.is_active ?? 'all');
    const [kpiToDelete, setKpiToDelete] = useState<KpiRow | null>(null);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            router.get(
                '/kpi-library',
                {
                    search,
                    perspective: perspective === 'all' ? '' : perspective,
                    is_active: isActive === 'all' ? '' : isActive,
                },
                { preserveState: true, replace: true, preserveScroll: true },
            );
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
        router.get(
            '/kpi-library',
            {
                page: selectedItem.selected + 1,
                search,
                perspective: perspective === 'all' ? '' : perspective,
                is_active: isActive === 'all' ? '' : isActive,
            },
            { preserveScroll: true, preserveState: true },
        );
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
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">KPI Library</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage key performance indicators for balanced scorecards.
                        </p>
                    </div>
                    <Link href="/kpi-library/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New KPI
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
                                    placeholder="Search by name or code..."
                                    className="pl-9"
                                />
                            </div>
                            <Select value={perspective} onValueChange={setPerspective}>
                                <SelectTrigger className="w-full sm:w-44">
                                    <SelectValue placeholder="All Perspectives" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Perspectives</SelectItem>
                                    {perspectives.map((p) => (
                                        <SelectItem key={p} value={p}>
                                            {formatStatus(p)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={isActive} onValueChange={setIsActive}>
                                <SelectTrigger className="w-full sm:w-36">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="1">Active</SelectItem>
                                    <SelectItem value="0">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>KPIs</CardTitle>
                        <CardDescription>{kpis.total} KPI{kpis.total !== 1 ? 's' : ''} found</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {kpis.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <BarChart3 className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                <h3 className="mb-1 text-lg font-semibold">No KPIs found</h3>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Try adjusting your filters or create a new KPI.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Code</TableHead>
                                            <TableHead>Perspective</TableHead>
                                            <TableHead>Target Type</TableHead>
                                            <TableHead>Default Target</TableHead>
                                            <TableHead>Default Weight</TableHead>
                                            <TableHead>Active</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {kpis.data.map((kpi) => (
                                            <TableRow key={kpi.id}>
                                                <TableCell className="font-medium">{kpi.name}</TableCell>
                                                <TableCell className="font-mono text-xs">{kpi.code}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={perspectiveBadgeClass(kpi.perspective)}>
                                                        {formatStatus(kpi.perspective)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{formatStatus(kpi.target_type)}</TableCell>
                                                <TableCell>{kpi.default_target ?? '—'}</TableCell>
                                                <TableCell>{kpi.default_weight != null ? `${kpi.default_weight}%` : '—'}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={kpi.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-gray-50 text-gray-600 border-gray-200'}>
                                                        {kpi.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Link href={`/kpi-library/${kpi.id}/edit`}>
                                                            <Button variant="ghost" size="icon" title="Edit">
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
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

                        {/* Pagination */}
                        {kpis.last_page > 1 && (
                            <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                                <span className="text-xs font-bold text-muted-foreground">
                                    Page {kpis.current_page} of {kpis.last_page}
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
                open={!!kpiToDelete}
                onOpenChange={(open) => !open && setKpiToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete KPI</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete KPI{' '}
                            <strong>{kpiToDelete?.name}</strong> ({kpiToDelete?.code})?
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
