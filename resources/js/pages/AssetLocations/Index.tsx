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
import { Button } from '@/components/ui/button';
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
import {
    Building,
    CheckCircle2,
    Eye,
    MapPin,
    Pencil,
    Plus,
    RotateCcw,
    Search,
    Trash2,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

type LocationRow = {
    id: number;
    name: string;
    code: string | null;
    building: string | null;
    floor: string | null;
    room: string | null;
    is_active: boolean;
    assets_count: number;
};

type PaginatedLocations = {
    data: LocationRow[];
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
};

export default function AssetLocationIndex() {
    const { locations, filters } = usePage<{
        locations: PaginatedLocations;
        filters: { search?: string; status?: string };
    }>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? 'all');
    const [locationToDelete, setLocationToDelete] = useState<LocationRow | null>(null);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            router.get(
                '/asset-locations',
                { search, status: statusFilter !== 'all' ? statusFilter : undefined },
                { preserveState: true, replace: true, preserveScroll: true },
            );
        }, 250);
        return () => window.clearTimeout(timer);
    }, [search, statusFilter]);

    const handleDelete = () => {
        if (!locationToDelete) return;
        router.delete(`/asset-locations/${locationToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => setLocationToDelete(null),
        });
    };

    const handlePageChange = (selectedItem: { selected: number }) => {
        router.get(
            '/asset-locations',
            { page: selectedItem.selected + 1, search },
            { preserveScroll: true, preserveState: true },
        );
    };

    const activeCount = locations.data.filter((l) => l.is_active).length;
    const inactiveCount = locations.data.filter((l) => !l.is_active).length;
    const emptyCount = locations.data.filter((l) => l.assets_count === 0).length;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Assets', href: '/assets' },
                { title: 'Locations', href: '/asset-locations' },
            ]}
        >
            <Head title="Asset Locations" />

            <div className="w-full space-y-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                            Asset Locations
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage physical locations where assets are stored and tracked.
                        </p>
                    </div>
                    <Link href="/asset-locations/create">
                        <Button className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black">
                            <Plus className="mr-2 h-4 w-4" />
                            New Location
                        </Button>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: 'Total Locations', value: locations.total, icon: MapPin },
                        { label: 'Active', value: activeCount, icon: CheckCircle2 },
                        { label: 'Inactive', value: inactiveCount, icon: XCircle },
                        { label: 'Empty Locations', value: emptyCount, icon: Building },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-sm"
                        >
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                            <stat.icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                    ))}
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="relative max-w-md flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, code, building..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-10 border-border pl-10 focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-0"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-10 w-[160px]">
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            variant="ghost"
                            className="text-muted-foreground"
                            onClick={() => { setSearch(''); setStatusFilter('all'); }}
                        >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-lg border border-border bg-background p-5">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[220px] py-4 font-semibold text-foreground">Name</TableHead>
                                <TableHead className="font-semibold text-foreground">Code</TableHead>
                                <TableHead className="font-semibold text-foreground">Building</TableHead>
                                <TableHead className="font-semibold text-foreground">Floor / Room</TableHead>
                                <TableHead className="font-semibold text-foreground">Status</TableHead>
                                <TableHead className="text-center font-semibold text-foreground">Assets</TableHead>
                                <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {locations.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                                        No locations found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                locations.data.map((loc) => (
                                    <TableRow key={loc.id} className="transition-colors hover:bg-muted/30">
                                        <TableCell className="py-4 font-bold text-foreground">
                                            {loc.name}
                                        </TableCell>
                                        <TableCell>
                                            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                                                {loc.code ?? '—'}
                                            </code>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{loc.building ?? '—'}</TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {[loc.floor, loc.room].filter(Boolean).join(' / ') || '—'}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${loc.is_active ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
                                                {loc.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center font-medium">{loc.assets_count}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/asset-locations/${loc.id}/edit`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/asset-locations/${loc.id}/edit`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                    onClick={() => setLocationToDelete(loc)}
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

                    {/* Pagination */}
                    <div className="flex items-center justify-between border-t border-border px-4 py-4">
                        <p className="text-sm text-muted-foreground">
                            Showing <span className="font-medium">{locations.data.length}</span> of{' '}
                            <span className="font-medium text-foreground">{locations.total}</span> locations
                        </p>
                        <ReactPaginate
                            pageCount={locations.last_page}
                            forcePage={locations.current_page - 1}
                            onPageChange={handlePageChange}
                            containerClassName="flex items-center gap-1"
                            pageLinkClassName="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium hover:bg-muted transition-colors"
                            activeLinkClassName="bg-black text-white dark:bg-white dark:text-black hover:bg-black/90"
                            previousLabel={
                                <span className="mr-1 flex h-8 items-center rounded-md border border-border px-3 text-sm font-medium hover:bg-muted">
                                    Previous
                                </span>
                            }
                            nextLabel={
                                <span className="ml-1 flex h-8 items-center rounded-md border border-border px-3 text-sm font-medium hover:bg-muted">
                                    Next
                                </span>
                            }
                            breakLabel="..."
                            disabledClassName="opacity-40 cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>

            {/* Delete Dialog */}
            <AlertDialog
                open={!!locationToDelete}
                onOpenChange={(open) => !open && setLocationToDelete(null)}
            >
                <AlertDialogContent className="max-w-[400px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Location</AlertDialogTitle>
                        <AlertDialogDescription>
                            {locationToDelete?.assets_count
                                ? `This location contains ${locationToDelete.assets_count} assets and cannot be deleted.`
                                : `Are you sure you want to delete "${locationToDelete?.name}"? This cannot be undone.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
                        {locationToDelete && locationToDelete.assets_count === 0 && (
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Delete
                            </AlertDialogAction>
                        )}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
