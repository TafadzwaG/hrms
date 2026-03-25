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
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { buildIndexParams } from '@/lib/index-table';
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
        filters: {
            search?: string;
            status?: string;
            sort?: string;
            direction?: 'asc' | 'desc';
        };
    }>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? 'all');
    const [locationToDelete, setLocationToDelete] = useState<LocationRow | null>(null);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            router.get(
                '/asset-locations',
                buildIndexParams(filters, {
                    search,
                    status: statusFilter !== 'all' ? statusFilter : undefined,
                }),
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
                <IndexTableCard className="rounded-lg p-5">
                    <Table>
                        <TableHeader>
                            <IndexTableHeaderRow>
                                <SortableTableHead path="/asset-locations" filters={filters} sortKey="name" className="w-[220px]">Name</SortableTableHead>
                                <SortableTableHead path="/asset-locations" filters={filters} sortKey="code">Code</SortableTableHead>
                                <SortableTableHead path="/asset-locations" filters={filters} sortKey="building">Building</SortableTableHead>
                                <IndexTableHead>Floor / Room</IndexTableHead>
                                <IndexTableHead>Status</IndexTableHead>
                                <SortableTableHead path="/asset-locations" filters={filters} sortKey="assets_count" align="center">Assets</SortableTableHead>
                                <IndexTableHead align="right">Actions</IndexTableHead>
                            </IndexTableHeaderRow>
                        </TableHeader>
                        <TableBody>
                            {locations.data.length === 0 ? (
                                <IndexTableEmptyRow colSpan={7}>
                                    No locations found.
                                </IndexTableEmptyRow>
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

                    <IndexTablePagination
                        pagination={locations}
                        filters={filters}
                        path="/asset-locations"
                        label="locations"
                    />
                </IndexTableCard>
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
