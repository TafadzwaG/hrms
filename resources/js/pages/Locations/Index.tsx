import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Building2,
    Clock,
    Download,
    Eye,
    Globe,
    Map,
    Network,
    Pencil,
    Plus,
    Search,
    Trash2,
    UploadCloud,
    Columns,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

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
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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
import moment from 'moment';

type LocationItem = {
    id: number;
    name: string;
    timezone?: string | null;
    city?: string | null;
    country?: string | null;
    state?: string | null;
    postal_code?: string | null;
    address_line1?: string | null;
    address_line2?: string | null;
    latitude?: string | number | null;
    longitude?: string | number | null;
    org_units_count?: number;
    created_at?: string | null;
};

// Available columns for the dynamic table
const AVAILABLE_COLUMNS = [
    { id: 'name', label: 'Name' },
    { id: 'city', label: 'City' },
    { id: 'country', label: 'Country' },
    { id: 'address', label: 'Full Address' },
    { id: 'timezone', label: 'Timezone' },
    { id: 'coordinates', label: 'Coordinates' },
    { id: 'org_units', label: 'Org Units' },
    { id: 'status', label: 'Status' },
    { id: 'created', label: 'Created At' },
];

export default function LocationsIndex() {
    const { locations, filters, countries, stats } = usePage().props as any;

    // Filters
    const [search, setSearch] = useState<string>(filters?.search || '');
    const [country, setCountry] = useState<string>(filters?.country || 'all');

    // Dynamic Columns
    const [visibleCols, setVisibleCols] = useState<string[]>([
        'name',
        'city',
        'country',
        'timezone',
        'org_units',
        'status',
    ]);

    // Dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [locationToDelete, setLocationToDelete] =
        useState<LocationItem | null>(null);

    const PATHS = {
        index: `${API}/locations`,
        create: `${API}/locations/create`,
        upload: `${API}/locations/upload`,
        show: (id: number) => `${API}/locations/${id}`,
        edit: (id: number) => `${API}/locations/${id}/edit`,
        destroy: (id: number) => `${API}/locations/${id}`,
        export: `${API}/locations/export`,
    };

    // Debounced search & filter application
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                PATHS.index,
                {
                    search,
                    country: country === 'all' ? '' : country,
                },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(timer);
    }, [search, country]);

    const handlePageChange = (selected: { selected: number }) => {
        router.get(
            PATHS.index,
            {
                page: selected.selected + 1,
                search,
                country: country === 'all' ? '' : country,
            },
            { preserveState: true },
        );
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (country && country !== 'all') params.append('country', country);

        window.location.href = `${PATHS.export}?${params.toString()}`;
    };

    const confirmDelete = () => {
        if (!locationToDelete) return;
        router.delete(PATHS.destroy(locationToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setLocationToDelete(null);
            },
        });
    };

    const toggleColumn = (colId: string) => {
        setVisibleCols((prev) =>
            prev.includes(colId)
                ? prev.filter((c) => c !== colId)
                : [...prev, colId],
        );
    };

    const pageData: LocationItem[] = locations?.data ?? [];

    return (
        <AppLayout breadcrumbs={[{ title: 'Locations', href: PATHS.index }]}>
            <Head title="Locations" />

            <div className="min-h-[calc(100vh-64px)] w-full bg-muted/10 p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Locations
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage and monitor your global workspace footprint.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="font-semibold shadow-sm"
                            onClick={() => router.visit(PATHS.upload)}
                        >
                            <UploadCloud className="mr-2 h-4 w-4" />
                            Bulk Upload
                        </Button>
                        <Button
                            className="font-semibold shadow-sm"
                            onClick={() => router.visit(PATHS.create)}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            New Location
                        </Button>
                    </div>
                </div>

                {/* Metrics Row (Populated from Backend) */}
                <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Card className="border-border shadow-sm">
                        <CardContent className="flex items-center justify-between p-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Total Locations
                                </p>
                                <p className="text-3xl font-bold tracking-tight text-foreground">
                                    {stats?.total_locations || 0}
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Map className="h-6 w-6" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border shadow-sm">
                        <CardContent className="flex items-center justify-between p-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Countries Covered
                                </p>
                                <p className="text-3xl font-bold tracking-tight text-foreground">
                                    {stats?.total_countries || 0}
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Globe className="h-6 w-6" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border shadow-sm">
                        <CardContent className="flex items-center justify-between p-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Primary Hubs
                                </p>
                                <p className="text-3xl font-bold tracking-tight text-foreground">
                                    {stats?.primary_hubs || 0}
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Network className="h-6 w-6" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border shadow-sm">
                        <CardContent className="flex items-center justify-between p-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Timezones
                                </p>
                                <p className="text-3xl font-bold tracking-tight text-foreground">
                                    {stats?.total_timezones || 0}
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Clock className="h-6 w-6" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters & Table Container */}
                <div className="rounded-xl border bg-background shadow-sm">
                    {/* Toolbar */}
                    <div className="flex flex-col justify-between gap-4 border-b p-4 lg:flex-row lg:items-center">
                        <div className="flex w-full flex-col items-center gap-3 sm:flex-row lg:w-auto">
                            <div className="relative w-full sm:w-[320px]">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search name, city, address..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-10 border-muted-foreground/30 bg-background pl-9 shadow-none"
                                />
                            </div>
                            <Select value={country} onValueChange={setCountry}>
                                <SelectTrigger className="h-10 w-full border-muted-foreground/30 shadow-none sm:w-[200px]">
                                    <SelectValue placeholder="All Countries" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Countries
                                    </SelectItem>
                                    {countries?.map((c: string) => (
                                        <SelectItem key={c} value={c}>
                                            {c}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="h-10 font-medium shadow-sm"
                                    >
                                        <Columns className="mr-2 h-4 w-4 text-muted-foreground" />
                                        Columns
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-48"
                                >
                                    <DropdownMenuLabel>
                                        Toggle Columns
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {AVAILABLE_COLUMNS.map((col) => (
                                        <DropdownMenuCheckboxItem
                                            key={col.id}
                                            checked={visibleCols.includes(
                                                col.id,
                                            )}
                                            onCheckedChange={() =>
                                                toggleColumn(col.id)
                                            }
                                        >
                                            {col.label}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button
                                onClick={handleExport}
                                variant="outline"
                                className="h-10 font-medium shadow-sm"
                            >
                                <Download className="mr-2 h-4 w-4 text-muted-foreground" />
                                Export List
                            </Button>
                        </div>
                    </div>

                    {/* Dynamic Table */}
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30 hover:bg-transparent">
                                    {visibleCols.includes('name') && (
                                        <TableHead className="h-12 w-[280px] pl-6 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Name
                                        </TableHead>
                                    )}
                                    {visibleCols.includes('city') && (
                                        <TableHead className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                            City
                                        </TableHead>
                                    )}
                                    {visibleCols.includes('country') && (
                                        <TableHead className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Country
                                        </TableHead>
                                    )}
                                    {visibleCols.includes('address') && (
                                        <TableHead className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Full Address
                                        </TableHead>
                                    )}
                                    {visibleCols.includes('timezone') && (
                                        <TableHead className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Timezone
                                        </TableHead>
                                    )}
                                    {visibleCols.includes('coordinates') && (
                                        <TableHead className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Coordinates
                                        </TableHead>
                                    )}
                                    {visibleCols.includes('org_units') && (
                                        <TableHead className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Attached Org Units
                                        </TableHead>
                                    )}
                                    {visibleCols.includes('status') && (
                                        <TableHead className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Status
                                        </TableHead>
                                    )}
                                    {visibleCols.includes('created') && (
                                        <TableHead className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Created At
                                        </TableHead>
                                    )}
                                    <TableHead className="pr-6 text-right text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pageData.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={visibleCols.length + 1}
                                            className="h-48 text-center text-muted-foreground"
                                        >
                                            No locations found matching your
                                            search.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pageData.map((loc) => {
                                        const isActive =
                                            (loc.org_units_count || 0) > 0;
                                        const fullAddress = [
                                            loc.address_line1,
                                            loc.address_line2,
                                            loc.city,
                                            loc.state,
                                            loc.postal_code,
                                            loc.country,
                                        ]
                                            .filter(Boolean)
                                            .join(', ');

                                        return (
                                            <TableRow
                                                key={loc.id}
                                                className="hover:bg-muted/30"
                                            >
                                                {visibleCols.includes(
                                                    'name',
                                                ) && (
                                                    <TableCell className="py-4 pl-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground">
                                                                <Building2 className="h-5 w-5" />
                                                            </div>
                                                            <span className="text-sm font-bold text-foreground">
                                                                {loc.name}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                )}
                                                {visibleCols.includes(
                                                    'city',
                                                ) && (
                                                    <TableCell className="text-sm font-medium text-muted-foreground">
                                                        {loc.city || '—'}
                                                    </TableCell>
                                                )}
                                                {visibleCols.includes(
                                                    'country',
                                                ) && (
                                                    <TableCell className="text-sm font-medium text-muted-foreground">
                                                        {loc.country || '—'}
                                                    </TableCell>
                                                )}
                                                {visibleCols.includes(
                                                    'address',
                                                ) && (
                                                    <TableCell
                                                        className="max-w-[250px] truncate text-sm font-medium text-muted-foreground"
                                                        title={fullAddress}
                                                    >
                                                        {fullAddress || '—'}
                                                    </TableCell>
                                                )}
                                                {visibleCols.includes(
                                                    'timezone',
                                                ) && (
                                                    <TableCell>
                                                        <Badge
                                                            variant="secondary"
                                                            className="bg-muted font-mono text-xs font-medium text-muted-foreground shadow-none"
                                                        >
                                                            {loc.timezone ||
                                                                'UTC'}
                                                        </Badge>
                                                    </TableCell>
                                                )}
                                                {visibleCols.includes(
                                                    'coordinates',
                                                ) && (
                                                    <TableCell className="font-mono text-sm font-medium text-muted-foreground">
                                                        {loc.latitude &&
                                                        loc.longitude
                                                            ? `${loc.latitude}, ${loc.longitude}`
                                                            : '—'}
                                                    </TableCell>
                                                )}
                                                {visibleCols.includes(
                                                    'org_units',
                                                ) && (
                                                    <TableCell className="text-sm font-medium text-muted-foreground">
                                                        {loc.org_units_count
                                                            ? `${loc.org_units_count} Units`
                                                            : '—'}
                                                    </TableCell>
                                                )}
                                                {visibleCols.includes(
                                                    'status',
                                                ) && (
                                                    <TableCell>
                                                        {isActive ? (
                                                            <Badge
                                                                variant="outline"
                                                                className="border-transparent bg-emerald-50 px-2.5 py-0.5 font-medium text-emerald-600 shadow-none"
                                                            >
                                                                <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                                Active Hub
                                                            </Badge>
                                                        ) : (
                                                            <Badge
                                                                variant="outline"
                                                                className="border-transparent bg-muted px-2.5 py-0.5 font-medium text-muted-foreground shadow-none"
                                                            >
                                                                <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                                                                Inactive
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                )}
                                                {visibleCols.includes(
                                                    'created',
                                                ) && (
                                                    <TableCell className="text-sm font-medium text-muted-foreground">
                                                        {loc.created_at
                                                            ? moment(
                                                                  loc.created_at,
                                                              ).format(
                                                                  'MMM DD, YYYY',
                                                              )
                                                            : '—'}
                                                    </TableCell>
                                                )}

                                                <TableCell className="pr-6 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                            onClick={() =>
                                                                router.visit(
                                                                    PATHS.show(
                                                                        loc.id,
                                                                    ),
                                                                )
                                                            }
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                            onClick={() =>
                                                                router.visit(
                                                                    PATHS.edit(
                                                                        loc.id,
                                                                    ),
                                                                )
                                                            }
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                            onClick={() => {
                                                                setLocationToDelete(
                                                                    loc,
                                                                );
                                                                setDeleteDialogOpen(
                                                                    true,
                                                                );
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {locations?.last_page > 1 && (
                        <div className="flex items-center justify-between border-t p-4">
                            <div className="text-sm font-medium text-muted-foreground">
                                Showing{' '}
                                <span className="font-bold text-foreground">
                                    1
                                </span>{' '}
                                to{' '}
                                <span className="font-bold text-foreground">
                                    {pageData.length}
                                </span>{' '}
                                of{' '}
                                <span className="font-bold text-foreground">
                                    {locations.total}
                                </span>{' '}
                                locations
                            </div>
                            <ReactPaginate
                                pageCount={locations.last_page}
                                forcePage={locations.current_page - 1}
                                onPageChange={handlePageChange}
                                marginPagesDisplayed={1}
                                pageRangeDisplayed={3}
                                previousLabel={
                                    <ChevronLeft className="h-4 w-4" />
                                }
                                nextLabel={<ChevronRight className="h-4 w-4" />}
                                breakLabel="..."
                                containerClassName="flex items-center gap-1"
                                pageLinkClassName="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background font-medium hover:bg-muted text-sm shadow-sm"
                                activeLinkClassName="!bg-primary text-primary-foreground font-bold border-primary hover:!bg-primary/90"
                                previousLinkClassName="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background shadow-sm hover:bg-muted"
                                nextLinkClassName="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background shadow-sm hover:bg-muted"
                                breakClassName="flex h-9 w-9 items-center justify-center text-sm font-medium text-muted-foreground"
                                disabledClassName="opacity-50 pointer-events-none"
                            />
                        </div>
                    )}
                </div>

                {/* Delete Confirmation Dialog */}
                <AlertDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-destructive">
                                Delete Location
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to permanently delete{' '}
                                <strong>{locationToDelete?.name}</strong>? This
                                action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Yes, Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
