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
import { Card, CardContent } from '@/components/ui/card';
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
    Eye,
    Pencil,
    Plus,
    Search,
    Trash2,
    LayoutGrid,
    List,
    Box,
    UserCheck,
    CheckCircle2,
    Settings,
    MoreHorizontal,
    RotateCcw,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import ReactPaginate from 'react-paginate';

type AssetCategoryOption = {
    id: number;
    name: string;
};

type AssetLocationOption = {
    id: number;
    name: string;
};

type AssetRow = {
    id: number;
    asset_tag: string;
    name: string;
    serial_number: string | null;
    status: string;
    condition: string;
    purchase_price: string | number | null;
    currency: string | null;
    category: { id: number; name: string } | null;
    location: { id: number; name: string } | null;
    current_assignment: {
        employee: {
            id: number;
            full_name: string;
            staff_number: string;
        };
        assigned_at: string | null;
    } | null;
    updated_at: string | null;
    links: {
        show: string;
        edit: string;
    };
};

type AssetStats = {
    total: number;
    assigned: number;
    available: number;
    maintenance: number;
};

type AssetsPageProps = {
    assets: {
        data: AssetRow[];
        total: number;
        current_page: number;
        last_page: number;
        from?: number;
        to?: number;
        per_page?: number;
    };
    filters: {
        search?: string | null;
        status?: string | null;
        category_id?: number | string | null;
        location_id?: number | string | null;
    };
    statuses: string[];
    categories: AssetCategoryOption[];
    locations: AssetLocationOption[];
    stats?: AssetStats;
};

const statusStyles: Record<string, string> = {
    available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    assigned: 'bg-blue-50 text-blue-700 border-blue-200',
    maintenance: 'bg-amber-50 text-amber-700 border-amber-200',
    in_maintenance: 'bg-amber-50 text-amber-700 border-amber-200',
    disposed: 'bg-red-50 text-red-700 border-red-200',
    retired: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    lost: 'bg-red-50 text-red-700 border-red-200',
    damaged: 'bg-orange-50 text-orange-700 border-orange-200',
};

function formatLabel(value: string) {
    return value
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatMoney(
    value: string | number | null | undefined,
    currency?: string | null,
) {
    if (value === null || value === undefined || value === '') return '—';

    const amount = Number(value);
    if (Number.isNaN(amount)) return `${currency ?? ''} ${value}`.trim();

    return `${currency ?? ''} ${amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`.trim();
}

function resolveMaintenanceStatus(statuses: string[]) {
    if (statuses.includes('in_maintenance')) return 'in_maintenance';
    if (statuses.includes('maintenance')) return 'maintenance';
    return 'in_maintenance';
}

export default function AssetIndex() {
    const {
        assets,
        filters,
        stats,
        statuses = [],
        categories = [],
        locations = [],
    } = usePage<AssetsPageProps>().props;

    const [view, setView] = useState<'grid' | 'table'>('table');
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? 'all');
    const [categoryId, setCategoryId] = useState(
        filters.category_id ? String(filters.category_id) : 'all',
    );
    const [locationId, setLocationId] = useState(
        filters.location_id ? String(filters.location_id) : 'all',
    );
    const [showFilters, setShowFilters] = useState(false);
    const [assetToDelete, setAssetToDelete] = useState<AssetRow | null>(null);

    const initialRender = useRef(true);

    const maintenanceStatus = useMemo(
        () => resolveMaintenanceStatus(statuses),
        [statuses],
    );

    const computedStats = useMemo(() => {
        const pageRows = assets.data ?? [];

        return {
            total: stats?.total ?? assets.total ?? pageRows.length,
            assigned:
                stats?.assigned ??
                pageRows.filter((asset) => asset.status === 'assigned').length,
            available:
                stats?.available ??
                pageRows.filter((asset) => asset.status === 'available').length,
            maintenance:
                stats?.maintenance ??
                pageRows.filter((asset) =>
                    ['maintenance', 'in_maintenance'].includes(asset.status),
                ).length,
        };
    }, [assets.data, assets.total, stats]);

    const quickFilters = useMemo(() => {
        const items: Array<{
            key: string;
            label: string;
            active: boolean;
            onClick: () => void;
        }> = [
            {
                key: 'all-status',
                label: 'All Status',
                active: status === 'all',
                onClick: () => setStatus('all'),
            },
            {
                key: 'available',
                label: 'Available',
                active: status === 'available',
                onClick: () => setStatus('available'),
            },
            {
                key: 'assigned',
                label: 'Assigned',
                active: status === 'assigned',
                onClick: () => setStatus('assigned'),
            },
            {
                key: 'maintenance',
                label: 'Maintenance',
                active: status === maintenanceStatus,
                onClick: () => setStatus(maintenanceStatus),
            },
        ];

        const categoryPills = categories.slice(0, 2).map((category) => ({
            key: `category-${category.id}`,
            label: category.name,
            active: categoryId === String(category.id),
            onClick: () => setCategoryId(String(category.id)),
        }));

        return [...items, ...categoryPills];
    }, [categories, categoryId, maintenanceStatus, status]);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        const timer = window.setTimeout(() => {
            router.get(
                '/assets',
                {
                    search: search || undefined,
                    status: status !== 'all' ? status : undefined,
                    category_id: categoryId !== 'all' ? categoryId : undefined,
                    location_id: locationId !== 'all' ? locationId : undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300);

        return () => window.clearTimeout(timer);
    }, [search, status, categoryId, locationId]);

    const handleResetFilters = () => {
        setSearch('');
        setStatus('all');
        setCategoryId('all');
        setLocationId('all');
        setShowFilters(false);
    };

    const handleDeleteAsset = () => {
        if (!assetToDelete) return;

        router.delete(`/assets/${assetToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => setAssetToDelete(null),
        });
    };

    const handlePageChange = ({ selected }: { selected: number }) => {
        router.get(
            '/assets',
            {
                page: selected + 1,
                search: search || undefined,
                status: status !== 'all' ? status : undefined,
                category_id: categoryId !== 'all' ? categoryId : undefined,
                location_id: locationId !== 'all' ? locationId : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const perPage = assets.per_page ?? (assets.data.length || 1);
    const showingFrom =
        assets.from ??
        (assets.total === 0 ? 0 : (assets.current_page - 1) * perPage + 1);
    const showingTo =
        assets.to ?? Math.min(assets.current_page * perPage, assets.total);

    return (
        <AppLayout breadcrumbs={[{ title: 'Assets', href: '/assets' }]}>
            <Head title="Assets" />

            <div className="w-full space-y-8 bg-white p-6 lg:p-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
                            Assets
                        </h1>
                        <p className="text-lg text-zinc-500">
                            Manage organization assets and equipment with a
                            visual-first approach.
                        </p>
                    </div>
                    <Link href="/assets/create">
                        <Button className="h-11 rounded-md bg-zinc-900 px-6 text-white shadow-sm transition-all hover:bg-zinc-800">
                            <Plus className="mr-2 h-5 w-5" /> New Asset
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            label: 'Total Assets',
                            val: computedStats.total,
                            icon: Box,
                        },
                        {
                            label: 'Assigned',
                            val: computedStats.assigned,
                            icon: UserCheck,
                        },
                        {
                            label: 'Available',
                            val: computedStats.available,
                            icon: CheckCircle2,
                        },
                        {
                            label: 'In Maintenance',
                            val: computedStats.maintenance,
                            icon: Settings,
                        },
                    ].map((item, index) => (
                        <Card
                            key={index}
                            className="border-zinc-200 shadow-none"
                        >
                            <CardContent className="flex items-center justify-between p-6">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium tracking-wider text-zinc-500 uppercase">
                                        {item.label}
                                    </p>
                                    <p className="text-3xl font-bold text-zinc-900">
                                        {item.val}
                                    </p>
                                </div>
                                <item.icon className="h-6 w-6 text-zinc-400" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="flex flex-col gap-4 border-t border-zinc-100 pt-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                            <Input
                                placeholder="Search by tag, serial, or name..."
                                className="h-11 border-zinc-200 pl-10 focus:ring-zinc-900"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center rounded-md border bg-zinc-50/50 p-1">
                                <Button
                                    variant={
                                        view === 'grid' ? 'secondary' : 'ghost'
                                    }
                                    size="sm"
                                    onClick={() => setView('grid')}
                                    className="h-8 w-10 p-0"
                                    type="button"
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={
                                        view === 'table' ? 'secondary' : 'ghost'
                                    }
                                    size="sm"
                                    onClick={() => setView('table')}
                                    className="h-8 w-10 p-0"
                                    type="button"
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                            <Button
                                variant="outline"
                                className="h-11 border-zinc-200"
                                onClick={() =>
                                    setShowFilters((current) => !current)
                                }
                                type="button"
                            >
                                <MoreHorizontal className="mr-2 h-4 w-4" /> More
                                Filters
                            </Button>
                            <Button
                                variant="ghost"
                                className="h-11 text-zinc-500"
                                onClick={handleResetFilters}
                                type="button"
                            >
                                <RotateCcw className="mr-2 h-4 w-4" /> Reset
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="mr-2 text-xs font-bold tracking-widest text-zinc-400 uppercase">
                            Quick Filters:
                        </span>
                        {quickFilters.map((pill) => (
                            <Badge
                                key={pill.key}
                                variant={pill.active ? 'default' : 'outline'}
                                className={`cursor-pointer rounded-full px-4 py-1.5 font-medium ${
                                    pill.active
                                        ? 'bg-zinc-900'
                                        : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                                }`}
                                onClick={pill.onClick}
                            >
                                {pill.label}
                            </Badge>
                        ))}
                    </div>

                    {showFilters && (
                        <div className="grid grid-cols-1 gap-4 rounded-md border border-zinc-200 bg-zinc-50/40 p-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
                                    Status
                                </p>
                                <Select
                                    value={status}
                                    onValueChange={setStatus}
                                >
                                    <SelectTrigger className="h-11 border-zinc-200 bg-white">
                                        <SelectValue placeholder="All statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All statuses
                                        </SelectItem>
                                        {statuses.map((item) => (
                                            <SelectItem key={item} value={item}>
                                                {formatLabel(item)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
                                    Category
                                </p>
                                <Select
                                    value={categoryId}
                                    onValueChange={setCategoryId}
                                >
                                    <SelectTrigger className="h-11 border-zinc-200 bg-white">
                                        <SelectValue placeholder="All categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All categories
                                        </SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={String(category.id)}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
                                    Location
                                </p>
                                <Select
                                    value={locationId}
                                    onValueChange={setLocationId}
                                >
                                    <SelectTrigger className="h-11 border-zinc-200 bg-white">
                                        <SelectValue placeholder="All locations" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All locations
                                        </SelectItem>
                                        {locations.map((location) => (
                                            <SelectItem
                                                key={location.id}
                                                value={String(location.id)}
                                            >
                                                {location.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                </div>

                {view === 'grid' ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {assets.data.map((asset) => (
                            <Card
                                key={asset.id}
                                className="group relative overflow-hidden border-zinc-200 shadow-sm transition-all hover:shadow-md"
                            >
                                <CardContent className="space-y-4 p-6">
                                    <div className="flex items-start justify-between gap-3">
                                        <span className="rounded border border-zinc-100 px-2 py-0.5 text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                                            {asset.asset_tag}
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className={`${statusStyles[asset.status] ?? 'border-zinc-200 bg-zinc-50 text-zinc-700'} rounded-md border px-2 font-semibold`}
                                        >
                                            {formatLabel(asset.status)}
                                        </Badge>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold text-zinc-900 transition-colors group-hover:text-zinc-600">
                                            {asset.name}
                                        </h3>
                                        <p className="flex items-center text-sm text-zinc-500">
                                            <Box className="mr-1.5 h-3.5 w-3.5" />{' '}
                                            {asset.category?.name ||
                                                'Uncategorized'}
                                        </p>
                                    </div>

                                    <div className="space-y-2 border-t border-zinc-50 pt-4">
                                        <div className="flex justify-between gap-3 text-sm">
                                            <span className="text-zinc-400">
                                                Condition
                                            </span>
                                            <span className="text-right font-semibold text-zinc-700">
                                                {formatLabel(asset.condition)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between gap-3 text-sm">
                                            <span className="text-zinc-400">
                                                Location
                                            </span>
                                            <span className="text-right font-semibold text-zinc-700">
                                                {asset.location?.name || '—'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between gap-3 text-sm">
                                            <span className="text-zinc-400">
                                                Assigned To
                                            </span>
                                            <span className="text-right font-semibold text-zinc-900">
                                                {asset.current_assignment
                                                    ?.employee.full_name ||
                                                    'Unassigned'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-dashed border-zinc-200 pt-4">
                                        <p className="text-lg font-bold text-zinc-900">
                                            {formatMoney(
                                                asset.purchase_price,
                                                asset.currency,
                                            )}
                                        </p>
                                        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-zinc-500"
                                                asChild
                                            >
                                                <Link href={asset.links.show}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-zinc-500"
                                                asChild
                                            >
                                                <Link href={asset.links.edit}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                                                onClick={() =>
                                                    setAssetToDelete(asset)
                                                }
                                                type="button"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-md border border-zinc-200">
                        <Table>
                            <TableHeader className="bg-zinc-50">
                                <TableRow>
                                    <TableHead className="font-bold text-zinc-900">
                                        Asset Tag
                                    </TableHead>
                                    <TableHead className="font-bold text-zinc-900">
                                        Name
                                    </TableHead>
                                    <TableHead className="font-bold text-zinc-900">
                                        Category
                                    </TableHead>
                                    <TableHead className="font-bold text-zinc-900">
                                        Status
                                    </TableHead>
                                    <TableHead className="font-bold text-zinc-900">
                                        Condition
                                    </TableHead>
                                    <TableHead className="font-bold text-zinc-900">
                                        Assigned To
                                    </TableHead>
                                    <TableHead className="text-right font-bold text-zinc-900">
                                        Price
                                    </TableHead>
                                    <TableHead className="px-6 text-right font-bold text-zinc-900">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assets.data.map((asset) => (
                                    <TableRow
                                        key={asset.id}
                                        className="hover:bg-zinc-50/50"
                                    >
                                        <TableCell className="font-mono text-xs text-zinc-500">
                                            {asset.asset_tag}
                                        </TableCell>
                                        <TableCell className="font-bold text-zinc-900">
                                            {asset.name}
                                        </TableCell>
                                        <TableCell className="text-zinc-500">
                                            {asset.category?.name || '—'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`${statusStyles[asset.status] ?? 'border-zinc-200 bg-zinc-50 text-zinc-700'} font-semibold`}
                                            >
                                                {formatLabel(asset.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {formatLabel(asset.condition)}
                                        </TableCell>
                                        <TableCell className="font-medium text-zinc-900">
                                            {asset.current_assignment?.employee
                                                .full_name || '—'}
                                        </TableCell>
                                        <TableCell className="text-right font-bold">
                                            {formatMoney(
                                                asset.purchase_price,
                                                asset.currency,
                                            )}
                                        </TableCell>
                                        <TableCell className="px-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    asChild
                                                >
                                                    <Link
                                                        href={asset.links.show}
                                                    >
                                                        <Eye className="h-4 w-4 text-zinc-400" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    asChild
                                                >
                                                    <Link
                                                        href={asset.links.edit}
                                                    >
                                                        <Pencil className="h-4 w-4 text-zinc-400" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() =>
                                                        setAssetToDelete(asset)
                                                    }
                                                    type="button"
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-400" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                <div className="flex flex-col items-center justify-between gap-4 border-t border-zinc-100 pt-6 md:flex-row">
                    <p className="text-sm font-medium text-zinc-500">
                        Showing{' '}
                        <span className="text-zinc-900">
                            {showingFrom}-{showingTo}
                        </span>{' '}
                        of <span className="text-zinc-900">{assets.total}</span>{' '}
                        assets
                    </p>
                    <ReactPaginate
                        pageCount={assets.last_page}
                        forcePage={Math.max((assets.current_page ?? 1) - 1, 0)}
                        onPageChange={handlePageChange}
                        containerClassName="flex gap-1"
                        pageLinkClassName="flex h-10 w-10 items-center justify-center rounded-md border text-sm font-bold transition-colors hover:bg-zinc-50"
                        activeLinkClassName="!border-zinc-900 !bg-zinc-900 !text-white"
                        previousLabel="←"
                        nextLabel="→"
                        previousLinkClassName="mr-2 flex h-10 items-center justify-center rounded-md border px-4 text-sm font-bold"
                        nextLinkClassName="ml-2 flex h-10 items-center justify-center rounded-md border px-4 text-sm font-bold"
                        disabledClassName="pointer-events-none opacity-30"
                        breakLabel="..."
                        breakLinkClassName="flex h-10 w-10 items-center justify-center rounded-md border text-sm font-bold"
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={3}
                    />
                </div>
            </div>

            <AlertDialog
                open={!!assetToDelete}
                onOpenChange={() => setAssetToDelete(null)}
            >
                <AlertDialogContent className="rounded-none border-zinc-200">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold">
                            Confirm Deletion
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-500">
                            You are about to remove{' '}
                            <span className="font-bold text-zinc-900">
                                {assetToDelete?.name}
                            </span>
                            . This action is permanent and cannot be reversed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-zinc-200">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="border-none bg-red-600 text-white hover:bg-red-700"
                            onClick={handleDeleteAsset}
                        >
                            Delete Asset
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
