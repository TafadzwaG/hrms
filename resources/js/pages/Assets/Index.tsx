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
import { Eye, Package, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

type CategorySummary = { id: number; name: string };
type LocationSummary = { id: number; name: string };
type EmployeeSummary = { id: number; full_name: string };

type AssetRow = {
    id: number;
    asset_tag: string;
    name: string;
    serial_number: string | null;
    status: string;
    condition: string;
    purchase_price: string | null;
    currency: string | null;
    category: CategorySummary | null;
    location: LocationSummary | null;
    assigned_to: EmployeeSummary | null;
};

type PaginatedAssets = {
    data: AssetRow[];
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
        case 'available':
            return 'bg-emerald-50 text-emerald-600 border-emerald-200';
        case 'assigned':
            return 'bg-blue-50 text-blue-600 border-blue-200';
        case 'in_maintenance':
            return 'bg-amber-50 text-amber-600 border-amber-200';
        case 'retired':
            return 'bg-gray-50 text-gray-600 border-gray-200';
        case 'disposed':
        case 'lost':
            return 'bg-red-50 text-red-600 border-red-200';
        case 'damaged':
            return 'bg-orange-50 text-orange-600 border-orange-200';
        default:
            return 'bg-gray-50 text-gray-600 border-gray-200';
    }
}

export default function AssetIndex() {
    const { assets, filters, statuses, categories, locations } = usePage<{
        assets: PaginatedAssets;
        filters: { search?: string; status?: string; category_id?: string; location_id?: string };
        statuses: string[];
        categories: CategorySummary[];
        locations: LocationSummary[];
    }>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? 'all');
    const [category, setCategory] = useState(filters.category_id ?? 'all');
    const [location, setLocation] = useState(filters.location_id ?? 'all');
    const [assetToDelete, setAssetToDelete] = useState<AssetRow | null>(null);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            router.get(
                '/assets',
                {
                    search,
                    status: status === 'all' ? '' : status,
                    category_id: category === 'all' ? '' : category,
                    location_id: location === 'all' ? '' : location,
                },
                { preserveState: true, replace: true, preserveScroll: true },
            );
        }, 250);

        return () => window.clearTimeout(timer);
    }, [search, status, category, location]);

    const handleDelete = () => {
        if (!assetToDelete) return;
        router.delete(`/assets/${assetToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => setAssetToDelete(null),
        });
    };

    const handlePageChange = (selectedItem: { selected: number }) => {
        router.get(
            '/assets',
            {
                page: selectedItem.selected + 1,
                search,
                status: status === 'all' ? '' : status,
                category: category === 'all' ? '' : category,
                location: location === 'all' ? '' : location,
            },
            { preserveScroll: true, preserveState: true },
        );
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Assets', href: '/assets' }]}>
            <Head title="Asset Management" />

            <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Assets</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage organization assets and equipment.
                        </p>
                    </div>
                    <Link href="/assets/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Asset
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
                                    placeholder="Search by name, asset tag, serial number..."
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
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="w-full sm:w-44">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={location} onValueChange={setLocation}>
                                <SelectTrigger className="w-full sm:w-44">
                                    <SelectValue placeholder="All Locations" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Locations</SelectItem>
                                    {locations.map((l) => (
                                        <SelectItem key={l.id} value={String(l.id)}>
                                            {l.name}
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
                        <CardTitle>Asset Register</CardTitle>
                        <CardDescription>{assets.total} asset{assets.total !== 1 ? 's' : ''} found</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {assets.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Package className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                <h3 className="mb-1 text-lg font-semibold">No assets found</h3>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Try adjusting your filters or create a new asset.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Asset Tag</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Condition</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Assigned To</TableHead>
                                            <TableHead>Purchase Price</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {assets.data.map((asset) => (
                                            <TableRow key={asset.id}>
                                                <TableCell className="font-medium font-mono text-xs">
                                                    {asset.asset_tag}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {asset.name}
                                                </TableCell>
                                                <TableCell>
                                                    {asset.category?.name ?? '—'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={statusBadgeClass(asset.status)}
                                                    >
                                                        {formatStatus(asset.status)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {formatStatus(asset.condition)}
                                                </TableCell>
                                                <TableCell>
                                                    {asset.location?.name ?? '—'}
                                                </TableCell>
                                                <TableCell>
                                                    {asset.assigned_to?.full_name ?? '—'}
                                                </TableCell>
                                                <TableCell>
                                                    {asset.purchase_price
                                                        ? `${asset.currency ?? ''} ${Number(asset.purchase_price).toLocaleString()}`
                                                        : '—'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Link href={`/assets/${asset.id}`}>
                                                            <Button variant="ghost" size="icon" title="View">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={`/assets/${asset.id}/edit`}>
                                                            <Button variant="ghost" size="icon" title="Edit">
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Delete"
                                                            onClick={() => setAssetToDelete(asset)}
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
                        {assets.last_page > 1 && (
                            <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                                <span className="text-xs font-bold text-muted-foreground">
                                    Page {assets.current_page} of {assets.last_page}
                                </span>
                                <ReactPaginate
                                    pageCount={assets.last_page}
                                    forcePage={assets.current_page - 1}
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
                open={!!assetToDelete}
                onOpenChange={(open) => !open && setAssetToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Asset</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete asset{' '}
                            <strong>{assetToDelete?.name}</strong> ({assetToDelete?.asset_tag})?
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
