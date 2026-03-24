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
    CheckCircle2,
    Eye,
    Package,
    Pencil,
    Plus,
    RotateCcw,
    Search,
    Store,
    Trash2,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

type VendorRow = {
    id: number;
    name: string;
    code: string | null;
    contact_person: string | null;
    email: string | null;
    phone: string | null;
    is_active: boolean;
    assets_count: number;
};

type PaginatedVendors = {
    data: VendorRow[];
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
};

export default function AssetVendorIndex() {
    const { vendors, filters } = usePage<{
        vendors: PaginatedVendors;
        filters: { search?: string };
    }>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [statusFilter, setStatusFilter] = useState('all');
    const [vendorToDelete, setVendorToDelete] = useState<VendorRow | null>(null);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            router.get(
                '/asset-vendors',
                { search },
                { preserveState: true, replace: true, preserveScroll: true },
            );
        }, 250);
        return () => window.clearTimeout(timer);
    }, [search]);

    const handleDelete = () => {
        if (!vendorToDelete) return;
        router.delete(`/asset-vendors/${vendorToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => setVendorToDelete(null),
        });
    };

    const handlePageChange = (selectedItem: { selected: number }) => {
        router.get(
            '/asset-vendors',
            { page: selectedItem.selected + 1, search },
            { preserveScroll: true, preserveState: true },
        );
    };

    const activeCount = vendors.data.filter((v) => v.is_active).length;
    const inactiveCount = vendors.data.filter((v) => !v.is_active).length;
    const withAssetsCount = vendors.data.filter((v) => v.assets_count > 0).length;

    const displayed = statusFilter === 'all'
        ? vendors.data
        : vendors.data.filter((v) => (statusFilter === 'active' ? v.is_active : !v.is_active));

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Assets', href: '/assets' },
                { title: 'Vendors', href: '/asset-vendors' },
            ]}
        >
            <Head title="Asset Vendors" />

            <div className="w-full space-y-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                            Asset Vendors
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage asset suppliers and vendor relationships.
                        </p>
                    </div>
                    <Link href="/asset-vendors/create">
                        <Button className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black">
                            <Plus className="mr-2 h-4 w-4" />
                            New Vendor
                        </Button>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: 'Total Vendors', value: vendors.total, icon: Store },
                        { label: 'Active', value: activeCount, icon: CheckCircle2 },
                        { label: 'Inactive', value: inactiveCount, icon: XCircle },
                        { label: 'With Assets', value: withAssetsCount, icon: Package },
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
                            placeholder="Search by name, code, email..."
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
                                <TableHead className="font-semibold text-foreground">Contact Person</TableHead>
                                <TableHead className="font-semibold text-foreground">Email</TableHead>
                                <TableHead className="font-semibold text-foreground">Phone</TableHead>
                                <TableHead className="font-semibold text-foreground">Status</TableHead>
                                <TableHead className="text-center font-semibold text-foreground">Assets</TableHead>
                                <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {displayed.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-48 text-center text-muted-foreground">
                                        No vendors found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                displayed.map((vendor) => (
                                    <TableRow key={vendor.id} className="transition-colors hover:bg-muted/30">
                                        <TableCell className="py-4 font-bold text-foreground">
                                            {vendor.name}
                                        </TableCell>
                                        <TableCell>
                                            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                                                {vendor.code ?? '—'}
                                            </code>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{vendor.contact_person ?? '—'}</TableCell>
                                        <TableCell className="text-muted-foreground text-sm">{vendor.email ?? '—'}</TableCell>
                                        <TableCell className="text-muted-foreground text-sm">{vendor.phone ?? '—'}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${vendor.is_active ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
                                                {vendor.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center font-medium">{vendor.assets_count}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/asset-vendors/${vendor.id}`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/asset-vendors/${vendor.id}/edit`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                    onClick={() => setVendorToDelete(vendor)}
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
                            Showing <span className="font-medium">{displayed.length}</span> of{' '}
                            <span className="font-medium text-foreground">{vendors.total}</span> vendors
                        </p>
                        <ReactPaginate
                            pageCount={vendors.last_page}
                            forcePage={vendors.current_page - 1}
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
                open={!!vendorToDelete}
                onOpenChange={(open) => !open && setVendorToDelete(null)}
            >
                <AlertDialogContent className="max-w-[400px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Vendor</AlertDialogTitle>
                        <AlertDialogDescription>
                            {vendorToDelete?.assets_count
                                ? `This vendor has ${vendorToDelete.assets_count} assets and cannot be deleted.`
                                : `Are you sure you want to delete "${vendorToDelete?.name}"? This cannot be undone.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
                        {vendorToDelete && vendorToDelete.assets_count === 0 && (
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
