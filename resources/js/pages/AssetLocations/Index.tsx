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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { MapPin, Pencil, Plus, Search, Trash2 } from 'lucide-react';
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
        filters: { search?: string };
    }>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [locationToDelete, setLocationToDelete] = useState<LocationRow | null>(null);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            router.get(
                '/asset-locations',
                { search },
                { preserveState: true, replace: true, preserveScroll: true },
            );
        }, 250);

        return () => window.clearTimeout(timer);
    }, [search]);

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

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Assets', href: '/assets' },
                { title: 'Locations', href: '/asset-locations' },
            ]}
        >
            <Head title="Asset Locations" />

            <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Asset Locations</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage physical locations where assets are stored.
                        </p>
                    </div>
                    <Link href="/asset-locations/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Location
                        </Button>
                    </Link>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="relative max-w-sm">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search locations..."
                                className="pl-9"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Locations</CardTitle>
                        <CardDescription>
                            {locations.total} location{locations.total !== 1 ? 's' : ''} found
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {locations.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <MapPin className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                <h3 className="mb-1 text-lg font-semibold">No locations found</h3>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Create your first asset location.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Code</TableHead>
                                            <TableHead>Building</TableHead>
                                            <TableHead>Floor</TableHead>
                                            <TableHead>Room</TableHead>
                                            <TableHead>Active</TableHead>
                                            <TableHead>Assets Count</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {locations.data.map((loc) => (
                                            <TableRow key={loc.id}>
                                                <TableCell className="font-medium">{loc.name}</TableCell>
                                                <TableCell className="font-mono text-xs">
                                                    {loc.code ?? '—'}
                                                </TableCell>
                                                <TableCell>{loc.building ?? '—'}</TableCell>
                                                <TableCell>{loc.floor ?? '—'}</TableCell>
                                                <TableCell>{loc.room ?? '—'}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            loc.is_active
                                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                                                : 'bg-gray-50 text-gray-600 border-gray-200'
                                                        }
                                                    >
                                                        {loc.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{loc.assets_count}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Link href={`/asset-locations/${loc.id}/edit`}>
                                                            <Button variant="ghost" size="icon" title="Edit">
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Delete"
                                                            onClick={() => setLocationToDelete(loc)}
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
                        {locations.last_page > 1 && (
                            <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                                <span className="text-xs font-bold text-muted-foreground">
                                    Page {locations.current_page} of {locations.last_page}
                                </span>
                                <ReactPaginate
                                    pageCount={locations.last_page}
                                    forcePage={locations.current_page - 1}
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
                open={!!locationToDelete}
                onOpenChange={(open) => !open && setLocationToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Location</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete location{' '}
                            <strong>{locationToDelete?.name}</strong>? This action cannot be undone.
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
