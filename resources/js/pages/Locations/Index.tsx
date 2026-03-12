import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Plus,
    Trash2,
    Eye,
    Filter,
    UploadCloud,
    Search,
    Settings2,
    RotateCcw,
    MapPin,
    Globe,
    Clock,
    Pencil,
} from 'lucide-react';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
const DEFAULT_VISIBLE = ['name', 'city', 'country', 'timezone'] as const;

type LocationItem = {
    id: number;
    name: string;
    timezone?: string | null;
    address_line1?: string | null;
    address_line2?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    postal_code?: string | null;
    latitude?: string | number | null;
    longitude?: string | number | null;
    created_at?: string | null;
    updated_at?: string | null;

    // optional if your backend provides
    org_units_count?: number;
};

export default function LocationsIndex() {
    const {
        locations,
        filters,
        countries: countriesFromServer,
    } = usePage().props as any;

    const [search, setSearch] = useState<string>(filters?.search || '');
    const [country, setCountry] = useState<string>(filters?.country || 'all');

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [locationToDelete, setLocationToDelete] =
        useState<LocationItem | null>(null);

    const [visibleColumns, setVisibleColumns] = useState<string[]>([
        ...DEFAULT_VISIBLE,
    ]);

    const allColumns = [
        { key: 'name', label: 'Location Name' },
        { key: 'city', label: 'City' },
        { key: 'country', label: 'Country' },
        { key: 'timezone', label: 'Timezone' },
        { key: 'address', label: 'Address' },
        { key: 'gps', label: 'GPS' },
        { key: 'created_at', label: 'Created' },
    ] as const;

    const PATHS = {
        index: `${API}/locations`,
        create: `${API}/locations/create`,
        upload: `${API}/locations/upload`,
        show: (id: number) => `${API}/locations/${id}`,
        edit: (id: number) => `${API}/locations/${id}/edit`,
        destroy: (id: number) => `${API}/locations/${id}`,
    };

    const toggleColumn = (col: string) =>
        setVisibleColumns((prev) =>
            prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col],
        );

    const resetColumns = () => setVisibleColumns([...DEFAULT_VISIBLE]);

    // Debounced filter fetch
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                PATHS.index,
                { search, country: country === 'all' ? '' : country },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(timer);
    }, [search, country]);

    const resetFilters = () => {
        setSearch('');
        setCountry('all');
        router.get(PATHS.index, {}, { preserveState: true, replace: true });
    };

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

    const openDeleteDialog = (loc: LocationItem) => {
        setLocationToDelete(loc);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!locationToDelete) return;
        router.delete(PATHS.destroy(locationToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setLocationToDelete(null);
                Swal.fire(
                    'Deleted!',
                    'Location deleted successfully.',
                    'success',
                );
            },
            onError: () => {
                Swal.fire(
                    'Error',
                    'Failed to delete location. It may have linked org units.',
                    'error',
                );
            },
        });
    };

    const getCountryBadge = (c?: string | null) => {
        if (!c) return 'bg-slate-700 text-white';
        const map: Record<string, string> = {
            Zimbabwe: 'bg-emerald-600 text-white',
            Zambia: 'bg-blue-600 text-white',
            'South Africa': 'bg-amber-600 text-white',
            Botswana: 'bg-purple-600 text-white',
        };
        return map[c] || 'bg-slate-700 text-white';
    };

    const getTimezoneBadge = (tz?: string | null) => {
        if (!tz) return 'bg-slate-700 text-white';
        if (tz.includes('Harare')) return 'bg-indigo-600 text-white';
        return 'bg-slate-700 text-white';
    };

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return '—';
        const m = moment(dateString);
        if (Number.isNaN(d.getTime())) return '—';
        return m.format('ll');
    };

    const pageData: LocationItem[] = locations?.data ?? [];

    const derivedCountries = useMemo(() => {
        const set = new Set<string>();
        pageData.forEach((l) => {
            if (l.country) set.add(l.country);
        });
        return Array.from(set).sort();
    }, [pageData]);

    const countries: string[] = (countriesFromServer ??
        derivedCountries) as string[];

    // Page-level stats (like your employee page) — based on current page
    const zimCount = useMemo(
        () => pageData.filter((l) => l.country === 'Zimbabwe').length,
        [pageData],
    );
    const harareCount = useMemo(
        () =>
            pageData.filter((l) => (l.city || '').toLowerCase() === 'harare')
                .length,
        [pageData],
    );
    const bulawayoCount = useMemo(
        () =>
            pageData.filter((l) => (l.city || '').toLowerCase() === 'bulawayo')
                .length,
        [pageData],
    );

    return (
        <AppLayout
            breadcrumbs={[{ title: 'Locations', href: `${API}/locations` }]}
        >
            <Head title="Locations" />

            <div className="mx-2 my-6 rounded-xl bg-background p-1 shadow-sm sm:mx-4 md:mx-8 md:p-6">
                {/* Header */}
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-xl font-bold sm:text-2xl">
                        Location Management
                    </h1>

                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                        <Button
                            size="sm"
                            variant="secondary"
                            asChild
                            className="w-full sm:w-auto"
                        >
                            <Link
                                href={PATHS.upload}
                                className="flex items-center"
                            >
                                <UploadCloud className="mr-2 h-4 w-4" />
                                Bulk Upload Locations
                            </Link>
                        </Button>

                        <Button
                            size="sm"
                            variant="secondary"
                            asChild
                            className="w-full sm:w-auto"
                        >
                            <Link
                                href={PATHS.create}
                                className="flex items-center"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Location
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Filters — Mobile (Sheet) */}
                <div className="mb-4 sm:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="w-full gap-2">
                                <Settings2 className="h-4 w-4" />
                                Filters
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="top" className="space-y-4 p-4">
                            <SheetHeader>
                                <SheetTitle>Filter Locations</SheetTitle>
                            </SheetHeader>

                            <div className="grid grid-cols-1 gap-3">
                                {/* Search */}
                                <div className="relative">
                                    <Label
                                        htmlFor="m-search"
                                        className="sr-only"
                                    >
                                        Search
                                    </Label>
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="m-search"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Search by name, city…"
                                        className="w-full rounded border border-border bg-background py-2 pr-3 pl-9 text-sm"
                                    />
                                </div>

                                {/* Country */}
                                <div>
                                    <Label className="sr-only">Country</Label>
                                    <Select
                                        value={country}
                                        onValueChange={(val) => setCountry(val)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Filter by country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All Countries
                                            </SelectItem>
                                            {countries.map((c) => (
                                                <SelectItem key={c} value={c}>
                                                    {c}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Columns */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start gap-2"
                                        >
                                            <Settings2 className="h-4 w-4" />
                                            Columns
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="start"
                                        className="w-64"
                                    >
                                        <DropdownMenuLabel>
                                            Toggle Columns
                                        </DropdownMenuLabel>
                                        {allColumns.map((col) => (
                                            <DropdownMenuCheckboxItem
                                                key={col.key}
                                                checked={visibleColumns.includes(
                                                    col.key,
                                                )}
                                                onCheckedChange={() =>
                                                    toggleColumn(col.key)
                                                }
                                            >
                                                {col.label}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                        <DropdownMenuSeparator />
                                        <Button
                                            variant="ghost"
                                            className="h-8 w-full justify-start px-2 text-sm"
                                            onClick={resetColumns}
                                        >
                                            <RotateCcw className="mr-2 h-4 w-4" />
                                            Reset to defaults
                                        </Button>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Actions */}
                                <div className="flex flex-col gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={resetFilters}
                                        className="w-full gap-2"
                                        title="Reset all filters"
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                        Reset
                                    </Button>

                                    <SheetTrigger asChild>
                                        <Button className="w-full">
                                            Apply & Close
                                        </Button>
                                    </SheetTrigger>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Filters — Desktop */}
                <div className="mb-4 hidden flex-wrap items-center gap-2 sm:flex">
                    {/* Search */}
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, city…"
                            className="w-full rounded border border-border bg-background py-2 pr-3 pl-9 text-sm"
                        />
                    </div>

                    {/* Country */}
                    <Select
                        value={country}
                        onValueChange={(val) => setCountry(val)}
                    >
                        <SelectTrigger className="w-full sm:w-64">
                            <SelectValue placeholder="Filter by country" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Countries</SelectItem>
                            {countries.map((c) => (
                                <SelectItem key={c} value={c}>
                                    {c}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Columns */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <Filter className="h-4 w-4" />
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                                Toggle Columns
                            </DropdownMenuLabel>
                            {allColumns.map((col) => (
                                <DropdownMenuCheckboxItem
                                    key={col.key}
                                    checked={visibleColumns.includes(col.key)}
                                    onCheckedChange={() =>
                                        toggleColumn(col.key)
                                    }
                                >
                                    {col.label}
                                </DropdownMenuCheckboxItem>
                            ))}
                            <DropdownMenuSeparator />
                            <Button
                                variant="ghost"
                                className="h-8 w-full justify-start px-2 text-sm"
                                onClick={resetColumns}
                            >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Reset to defaults
                            </Button>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        variant="outline"
                        onClick={resetFilters}
                        className="ml-auto flex w-full items-center gap-2 sm:w-auto"
                        title="Reset all filters"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Reset
                    </Button>
                </div>

                {/* Stats */}
                <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Total Locations
                                </p>
                                <p className="text-2xl font-bold">
                                    {locations?.total ?? 0}
                                </p>
                            </div>
                            <div className="rounded-full bg-blue-100 p-3">
                                <MapPin className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Zimbabwe (this page)
                                </p>
                                <p className="text-2xl font-bold">{zimCount}</p>
                            </div>
                            <div className="rounded-full bg-emerald-100 p-3">
                                <Globe className="h-6 w-6 text-emerald-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Harare (this page)
                                </p>
                                <p className="text-2xl font-bold">
                                    {harareCount}
                                </p>
                            </div>
                            <div className="rounded-full bg-indigo-100 p-3">
                                <Clock className="h-6 w-6 text-indigo-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Bulawayo (this page)
                                </p>
                                <p className="text-2xl font-bold">
                                    {bulawayoCount}
                                </p>
                            </div>
                            <div className="rounded-full bg-purple-100 p-3">
                                <MapPin className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Mobile cards */}
                <div className="space-y-3 md:hidden">
                    {pageData.length === 0 ? (
                        <Card className="p-4 text-sm text-muted-foreground">
                            No locations found.
                        </Card>
                    ) : (
                        pageData.map((loc) => (
                            <Card key={loc.id} className="space-y-2 border p-4">
                                <div className="min-w-0">
                                    <div className="font-semibold">
                                        {loc.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        <Badge
                                            className={getCountryBadge(
                                                loc.country,
                                            )}
                                        >
                                            {loc.country ?? '—'}
                                        </Badge>{' '}
                                        <Badge
                                            className={getTimezoneBadge(
                                                loc.timezone,
                                            )}
                                        >
                                            {loc.timezone ?? '—'}
                                        </Badge>
                                    </div>
                                    <div className="mt-2 text-sm">
                                        <span className="font-medium">
                                            City:
                                        </span>{' '}
                                        {loc.city ?? '—'}
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-medium">
                                            Address:
                                        </span>{' '}
                                        {loc.address_line1 ?? '—'}
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-end gap-2 pt-2">
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="h-8 gap-1 px-3"
                                    >
                                        <Link href={PATHS.show(loc.id)}>
                                            <Eye className="h-4 w-4" /> View
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        variant="secondary"
                                        className="h-8 gap-1 px-3"
                                    >
                                        <Link href={PATHS.edit(loc.id)}>
                                            <Pencil className="h-4 w-4" /> Edit
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="h-8 gap-1 px-3"
                                        onClick={() => openDeleteDialog(loc)}
                                    >
                                        <Trash2 className="h-4 w-4" /> Delete
                                    </Button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>

                {/* Desktop table */}
                <div className="hidden overflow-x-auto rounded-xl border md:block">
                    <Table>
                        <TableCaption>
                            List of Locations ({locations?.total ?? 0} total)
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                {visibleColumns.map((col) => {
                                    const column = allColumns.find(
                                        (c) => c.key === col,
                                    );
                                    return column ? (
                                        <TableHead key={col}>
                                            {column.label}
                                        </TableHead>
                                    ) : null;
                                })}
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {pageData.length > 0 ? (
                                pageData.map((loc) => (
                                    <TableRow key={loc.id}>
                                        {visibleColumns.includes('name') && (
                                            <TableCell className="font-medium">
                                                <Link
                                                    href={PATHS.show(loc.id)}
                                                    className="hover:underline"
                                                >
                                                    {loc.name}
                                                </Link>
                                                <div className="max-w-[360px] truncate text-sm text-muted-foreground">
                                                    {loc.address_line1 ?? ''}
                                                </div>
                                            </TableCell>
                                        )}

                                        {visibleColumns.includes('city') && (
                                            <TableCell>
                                                {loc.city ?? '—'}
                                            </TableCell>
                                        )}

                                        {visibleColumns.includes('country') && (
                                            <TableCell>
                                                <Badge
                                                    className={getCountryBadge(
                                                        loc.country,
                                                    )}
                                                >
                                                    {loc.country ?? '—'}
                                                </Badge>
                                            </TableCell>
                                        )}

                                        {visibleColumns.includes(
                                            'timezone',
                                        ) && (
                                            <TableCell>
                                                <Badge
                                                    className={getTimezoneBadge(
                                                        loc.timezone,
                                                    )}
                                                >
                                                    {loc.timezone ?? '—'}
                                                </Badge>
                                            </TableCell>
                                        )}

                                        {visibleColumns.includes('address') && (
                                            <TableCell className="max-w-xs truncate">
                                                {[
                                                    loc.address_line1,
                                                    loc.address_line2,
                                                    loc.city,
                                                    loc.country,
                                                ]
                                                    .filter(Boolean)
                                                    .join(', ') || '—'}
                                            </TableCell>
                                        )}

                                        {visibleColumns.includes('gps') && (
                                            <TableCell className="text-sm text-muted-foreground">
                                                {loc.latitude && loc.longitude
                                                    ? `${loc.latitude}, ${loc.longitude}`
                                                    : '—'}
                                            </TableCell>
                                        )}

                                        {visibleColumns.includes(
                                            'created_at',
                                        ) && (
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(loc.created_at)}
                                            </TableCell>
                                        )}

                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    asChild
                                                    size="icon"
                                                    variant="outline"
                                                    className="h-8 w-8 rounded-full"
                                                    title="View"
                                                >
                                                    <Link
                                                        href={PATHS.show(
                                                            loc.id,
                                                        )}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    asChild
                                                    size="icon"
                                                    variant="secondary"
                                                    className="h-8 w-8 rounded-full"
                                                    title="Edit"
                                                >
                                                    <Link
                                                        href={PATHS.edit(
                                                            loc.id,
                                                        )}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="destructive"
                                                    className="h-8 w-8 rounded-full"
                                                    onClick={() =>
                                                        openDeleteDialog(loc)
                                                    }
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={visibleColumns.length + 1}
                                        className="text-center text-gray-500"
                                    >
                                        No locations found. Try adjusting your
                                        filters.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Delete Dialog */}
                <Dialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Location</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete{' '}
                                <strong>{locationToDelete?.name}</strong>? This
                                action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setDeleteDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={confirmDelete}
                                variant="destructive"
                            >
                                Confirm Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Pagination */}
                {locations?.last_page > 1 && (
                    <div className="mt-4 flex justify-center">
                        <ReactPaginate
                            pageCount={locations.last_page}
                            forcePage={locations.current_page - 1}
                            onPageChange={handlePageChange}
                            marginPagesDisplayed={1}
                            pageRangeDisplayed={3}
                            previousLabel="← Previous"
                            nextLabel="Next →"
                            breakLabel="..."
                            containerClassName="flex items-center gap-2 text-sm"
                            pageClassName="px-3 py-1 border rounded hover:bg-muted"
                            activeClassName="bg-blue-600 text-white"
                            previousClassName="px-3 py-1 border rounded hover:bg-muted"
                            nextClassName="px-3 py-1 border rounded hover:bg-muted"
                            breakClassName="px-2"
                        />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
