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
    IndexTableCard,
    IndexTableEmptyRow,
    IndexTableHead,
    IndexTableHeaderRow,
    IndexTablePagination,
    SortableTableHead,
} from '@/components/index-table';
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
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { buildIndexParams } from '@/lib/index-table';
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
        sort?: string | null;
        direction?: 'asc' | 'desc' | null;
    };
    statuses: string[];
    categories: AssetCategoryOption[];
    locations: AssetLocationOption[];
    stats?: AssetStats;
};

const statusStyles: Record<string, string> = {
    available: 'badge-tone-success',
    assigned: 'badge-tone-info',
    maintenance: 'badge-tone-warning',
    in_maintenance: 'badge-tone-warning',
    disposed: 'badge-tone-danger',
    retired: 'badge-tone-muted',
    lost: 'badge-tone-danger',
    damaged: 'badge-tone-danger',
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
                buildIndexParams(filters, {
                    search,
                    status: status !== 'all' ? status : '',
                    category_id: categoryId !== 'all' ? categoryId : '',
                    location_id: locationId !== 'all' ? locationId : '',
                }),
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

    const activeFilters = useMemo(
        () => ({
            ...filters,
            search,
            status: status !== 'all' ? status : null,
            category_id: categoryId !== 'all' ? categoryId : null,
            location_id: locationId !== 'all' ? locationId : null,
        }),
        [filters, search, status, categoryId, locationId],
    );

    return (
        <AppLayout breadcrumbs={[{ title: 'Assets', href: '/assets' }]}>
            <Head title="Assets" />

            <div className="w-full space-y-6 bg-muted/10 p-4 lg:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">
                            Assets
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Manage organization assets and equipment with a
                            visual-first approach.
                        </p>
                    </div>
                    <Link href="/assets/create">
                        <Button className="h-11 rounded-md px-6 shadow-sm">
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
                            className="border-border bg-card shadow-none"
                        >
                            <CardContent className="flex items-center justify-between p-6">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium tracking-wider text-muted-foreground uppercase">
                                        {item.label}
                                    </p>
                                    <p className="text-2xl font-semibold text-foreground">
                                        {item.val}
                                    </p>
                                </div>
                                <item.icon className="h-6 w-6 text-muted-foreground" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="flex flex-col gap-4 border-t border-border/50 pt-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by tag, serial, or name..."
                                className="h-11 bg-background pl-10 shadow-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center rounded-md border border-border bg-muted/30 p-1">
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
                                className="h-11"
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
                                className="h-11 text-muted-foreground"
                                onClick={handleResetFilters}
                                type="button"
                            >
                                <RotateCcw className="mr-2 h-4 w-4" /> Reset
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="mr-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                            Quick Filters:
                        </span>
                        {quickFilters.map((pill) => (
                            <Badge
                                key={pill.key}
                                variant={pill.active ? 'chart1' : 'outline'}
                                className={`cursor-pointer rounded-full px-4 py-1.5 font-medium ${
                                    pill.active
                                        ? ''
                                        : 'border-border bg-background text-muted-foreground hover:bg-muted'
                                }`}
                                onClick={pill.onClick}
                            >
                                {pill.label}
                            </Badge>
                        ))}
                    </div>

                    {showFilters && (
                        <div className="grid grid-cols-1 gap-4 rounded-md border border-border bg-muted/20 p-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                    Status
                                </p>
                                <Select
                                    value={status}
                                    onValueChange={setStatus}
                                >
                                    <SelectTrigger className="h-11 bg-background">
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
                                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                    Category
                                </p>
                                <Select
                                    value={categoryId}
                                    onValueChange={setCategoryId}
                                >
                                    <SelectTrigger className="h-11 bg-background">
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
                                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                    Location
                                </p>
                                <Select
                                    value={locationId}
                                    onValueChange={setLocationId}
                                >
                                    <SelectTrigger className="h-11 bg-background">
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
                                className="group relative overflow-hidden border-border bg-card shadow-sm transition-all hover:shadow-md"
                            >
                                <CardContent className="space-y-4 p-6">
                                    <div className="flex items-start justify-between gap-3">
                                        <span className="rounded border border-border bg-muted/30 px-2 py-0.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            {asset.asset_tag}
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className={`${statusStyles[asset.status] ?? 'badge-tone-muted'} rounded-md border px-2 font-semibold`}
                                        >
                                            {formatLabel(asset.status)}
                                        </Badge>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                                            {asset.name}
                                        </h3>
                                        <p className="flex items-center text-sm text-muted-foreground">
                                            <Box className="mr-1.5 h-3.5 w-3.5" />{' '}
                                            {asset.category?.name ||
                                                'Uncategorized'}
                                        </p>
                                    </div>

                                    <div className="space-y-2 border-t border-border/50 pt-4">
                                        <div className="flex justify-between gap-3 text-sm">
                                            <span className="text-muted-foreground">
                                                Condition
                                            </span>
                                            <span className="text-right font-semibold text-foreground">
                                                {formatLabel(asset.condition)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between gap-3 text-sm">
                                            <span className="text-muted-foreground">
                                                Location
                                            </span>
                                            <span className="text-right font-semibold text-foreground">
                                                {asset.location?.name || '—'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between gap-3 text-sm">
                                            <span className="text-muted-foreground">
                                                Assigned To
                                            </span>
                                            <span className="text-right font-semibold text-foreground">
                                                {asset.current_assignment
                                                    ?.employee.full_name ||
                                                    'Unassigned'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-dashed border-border/60 pt-4">
                                        <p className="text-lg font-bold text-foreground">
                                            {formatMoney(
                                                asset.purchase_price,
                                                asset.currency,
                                            )}
                                        </p>
                                        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                asChild
                                            >
                                                <Link href={asset.links.show}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                asChild
                                            >
                                                <Link href={asset.links.edit}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
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
                    <IndexTableCard>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <IndexTableHeaderRow>
                                        <SortableTableHead path="/assets" filters={activeFilters} sortKey="asset_tag">
                                            Asset Tag
                                        </SortableTableHead>
                                        <SortableTableHead path="/assets" filters={activeFilters} sortKey="name">
                                            Name
                                        </SortableTableHead>
                                        <SortableTableHead path="/assets" filters={activeFilters} sortKey="category">
                                            Category
                                        </SortableTableHead>
                                        <SortableTableHead path="/assets" filters={activeFilters} sortKey="status">
                                            Status
                                        </SortableTableHead>
                                        <SortableTableHead path="/assets" filters={activeFilters} sortKey="condition">
                                            Condition
                                        </SortableTableHead>
                                        <SortableTableHead path="/assets" filters={activeFilters} sortKey="assigned_to">
                                            Assigned To
                                        </SortableTableHead>
                                        <SortableTableHead path="/assets" filters={activeFilters} sortKey="purchase_price" align="right">
                                            Price
                                        </SortableTableHead>
                                        <IndexTableHead align="right" className="px-6">
                                            Actions
                                        </IndexTableHead>
                                    </IndexTableHeaderRow>
                                </TableHeader>
                                <TableBody>
                                    {assets.data.length > 0 ? (
                                        assets.data.map((asset) => (
                                            <TableRow
                                                key={asset.id}
                                                className="transition-colors hover:bg-muted/30"
                                            >
                                                <TableCell className="font-mono text-xs text-muted-foreground">
                                                    {asset.asset_tag}
                                                </TableCell>
                                                <TableCell className="font-bold text-foreground">
                                                    {asset.name}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {asset.category?.name || '—'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={`${statusStyles[asset.status] ?? 'badge-tone-muted'} font-semibold`}
                                                    >
                                                        {formatLabel(asset.status)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-foreground">
                                                    {formatLabel(asset.condition)}
                                                </TableCell>
                                                <TableCell className="font-medium text-foreground">
                                                    {asset.current_assignment?.employee
                                                        .full_name || '—'}
                                                </TableCell>
                                                <TableCell className="text-right font-bold text-foreground">
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
                                                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                            asChild
                                                        >
                                                            <Link href={asset.links.show}>
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                            asChild
                                                        >
                                                            <Link href={asset.links.edit}>
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                            onClick={() =>
                                                                setAssetToDelete(asset)
                                                            }
                                                            type="button"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <IndexTableEmptyRow colSpan={8}>
                                            No assets match the current filters.
                                        </IndexTableEmptyRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <IndexTablePagination
                            pagination={assets}
                            filters={activeFilters}
                            path="/assets"
                            label="assets"
                        />
                    </IndexTableCard>
                )}
            </div>

            <AlertDialog
                open={!!assetToDelete}
                onOpenChange={() => setAssetToDelete(null)}
            >
                <AlertDialogContent className="rounded-none border-border bg-popover">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold">
                            Confirm Deletion
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                            You are about to remove{' '}
                            <span className="font-bold text-foreground">
                                {assetToDelete?.name}
                            </span>
                            . This action is permanent and cannot be reversed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-border">
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
