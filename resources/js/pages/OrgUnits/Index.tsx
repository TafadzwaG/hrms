import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Pencil,
    Plus,
    Trash2,
    Eye,
    Filter,
    UploadCloud,
    Search,
    Settings2,
    RotateCcw,
    Building2,
    Layers3,
    Network,
    GitBranch,
    Info,
    Building,
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
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
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

const DEFAULT_VISIBLE = ['name', 'type', 'parent', 'code', 'children'] as const;

type OrgUnitListItem = {
    id: number;
    name: string;
    type: string;
    code: string | null;
    cost_center: string | null;
    effective_from: string | null;
    effective_to: string | null;
    parent: { id: number; name: string; type: string } | null;
    children_count: number;
    created_at: string | null;
};

type PageProps = {
    orgUnits: {
        data: OrgUnitListItem[];
        total: number;
        current_page: number;
        last_page: number;
        per_page: number;
    };
    filters: { search?: string; type?: string };
    types: string[]; // e.g. COMPANY, SBU, DEPARTMENT, TEAM
};

const PATHS = {
    index: `${API}/org-units`,
    create: `${API}/org-units/create`,
    upload: `${API}/org-units/upload`,
    show: (id: number) => `${API}/org-units/${id}`,
    edit: (id: number) => `${API}/org-units/${id}/edit`,
    destroy: (id: number) => `${API}/org-units/${id}`,
};

const ALL_COLUMNS = [
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'parent', label: 'Parent' },
    { key: 'code', label: 'Code' },
    { key: 'children', label: 'Children' },
    { key: 'effective', label: 'Effective' },
    { key: 'created_at', label: 'Created' },
] as const;

function getTypeBadgeClass(type: string) {
    const map: Record<string, string> = {
        COMPANY: 'bg-blue-600 text-white hover:bg-blue-700',
        SBU: 'bg-emerald-600 text-white hover:bg-emerald-700',
        DEPARTMENT: 'bg-indigo-600 text-white hover:bg-indigo-700',
        TEAM: 'bg-purple-600 text-white hover:bg-purple-700',
    };
    return map[type] || 'bg-slate-600 text-white hover:bg-slate-700';
}

function formatDate(dateString?: string | null) {
    if (!dateString) return '—';
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return '—';
    return moment(d).format('ll');
}

export default function OrgUnitsIndex() {
    const { orgUnits, filters, types } = usePage<PageProps>().props;

    // ------- Filters -------
    const [search, setSearch] = useState<string>(filters.search || '');
    const [type, setType] = useState<string>(filters.type || 'all');

    // ------- Column Toggles -------
    const [visibleColumns, setVisibleColumns] = useState<string[]>([
        ...DEFAULT_VISIBLE,
    ]);

    // ------- UI State -------
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [orgUnitToDelete, setOrgUnitToDelete] =
        useState<OrgUnitListItem | null>(null);

    const pageData = orgUnits?.data ?? [];

    const toggleColumn = (col: string) =>
        setVisibleColumns((prev) =>
            prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col],
        );

    const resetColumns = () => setVisibleColumns([...DEFAULT_VISIBLE]);

    // ------- Fetch filtered data (debounced) -------
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                PATHS.index,
                { search, type: type === 'all' ? '' : type },
                { preserveState: true, replace: true },
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [search, type]);

    // ------- Handlers -------
    const resetFilters = () => {
        setSearch('');
        setType('all');
        router.get(PATHS.index, {}, { preserveState: true, replace: true });
    };

    const handlePageChange = (selected: { selected: number }) => {
        router.get(
            PATHS.index,
            {
                page: selected.selected + 1,
                search,
                type: type === 'all' ? '' : type,
            },
            { preserveState: true },
        );
    };

    const openDeleteDialog = (ou: OrgUnitListItem) => {
        setOrgUnitToDelete(ou);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!orgUnitToDelete) return;

        router.delete(PATHS.destroy(orgUnitToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setOrgUnitToDelete(null);
                Swal.fire(
                    'Deleted!',
                    'Org Unit deleted successfully.',
                    'success',
                );
            },
            onError: () => {
                Swal.fire(
                    'Error',
                    'Failed to delete org unit. It may have children.',
                    'error',
                );
            },
        });
    };

    // ------- Stats (page-level) -------
    const companyCount = useMemo(
        () => pageData.filter((x) => x.type === 'COMPANY').length,
        [pageData],
    );
    const sbuCount = useMemo(
        () => pageData.filter((x) => x.type === 'SBU').length,
        [pageData],
    );
    const deptCount = useMemo(
        () => pageData.filter((x) => x.type === 'DEPARTMENT').length,
        [pageData],
    );
    const teamCount = useMemo(
        () => pageData.filter((x) => x.type === 'TEAM').length,
        [pageData],
    );

    return (
        <AppLayout breadcrumbs={[{ title: 'Org Units', href: PATHS.index }]}>
            <Head title="Org Units" />

            <div className="mx-2 my-6 rounded-xl bg-background p-1 shadow-sm sm:mx-4 md:mx-8 md:p-6">
                {/* Header */}
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="flex items-center gap-2 text-xl font-bold sm:text-2xl">
                        <Network className="h-6 w-6 text-primary" />
                        Org Unit Management
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
                                className="flex items-center justify-center gap-2"
                            >
                                <UploadCloud className="h-4 w-4" />
                                Bulk Upload Org Units
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
                                className="flex items-center justify-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add New Org Unit
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <div className="flex items-start gap-3">
                        <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                        <div>
                            <p className="font-medium text-blue-800">
                                Manage your organizational structure
                                dynamically.
                            </p>
                            <p className="mt-1 text-sm text-blue-600">
                                Use filters to find specific companies, SBUs,
                                departments, or teams. Ensure parent-child
                                relationships remain intact before deleting.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters — Mobile (Sheet) */}
                <div className="mb-4 sm:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="w-full gap-2">
                                <Filter className="h-4 w-4" />
                                Filters
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="top" className="space-y-4 p-4">
                            <SheetHeader>
                                <SheetTitle>Filter Org Units</SheetTitle>
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
                                        placeholder="Search by name or code..."
                                        className="w-full rounded border border-border bg-background py-2 pr-3 pl-9 text-sm"
                                    />
                                </div>

                                {/* Type Filter */}
                                <div>
                                    <Label className="mb-1 block text-xs text-muted-foreground">
                                        Org Unit Type
                                    </Label>
                                    <select
                                        value={type}
                                        onChange={(e) =>
                                            setType(e.target.value)
                                        }
                                        className="w-full rounded border border-border bg-background px-3 py-2 text-sm"
                                    >
                                        <option value="all">All Types</option>
                                        {types.map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
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
                                        className="w-60"
                                    >
                                        <DropdownMenuLabel>
                                            Toggle Columns
                                        </DropdownMenuLabel>
                                        {ALL_COLUMNS.map((col) => (
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
                                            Apply &amp; Close
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
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or code..."
                            className="w-full rounded border border-border bg-background py-2 pr-3 pl-9 text-sm"
                        />
                    </div>

                    {/* Type Filter */}
                    <div className="w-full sm:w-56">
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full rounded border border-border bg-background px-3 py-2 text-sm"
                        >
                            <option value="all">All Types</option>
                            {types.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Columns */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <Settings2 className="h-4 w-4" />
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                                Toggle Columns
                            </DropdownMenuLabel>
                            {ALL_COLUMNS.map((col) => (
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
                                    Total Org Units
                                </p>
                                <p className="text-2xl font-bold">
                                    {orgUnits.total}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Visible on page: {pageData.length}
                                </p>
                            </div>
                            <div className="rounded-full bg-indigo-100 p-3">
                                <Network className="h-6 w-6 text-indigo-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Companies (this page)
                                </p>
                                <p className="text-2xl font-bold">
                                    {companyCount}
                                </p>
                            </div>
                            <div className="rounded-full bg-indigo-100 p-3">
                                <Building2 className="h-6 w-6 text-indigo-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    SBUs (this page)
                                </p>
                                <p className="text-2xl font-bold">{sbuCount}</p>
                            </div>
                            <div className="rounded-full bg-emerald-100 p-3">
                                <GitBranch className="h-6 w-6 text-emerald-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Dept/Teams (this page)
                                </p>
                                <p className="text-2xl font-bold">
                                    {deptCount + teamCount}
                                </p>
                            </div>
                            <div className="rounded-full bg-blue-100 p-3">
                                <Layers3 className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Mobile cards */}
                <div className="space-y-3 md:hidden">
                    {pageData.length === 0 ? (
                        <Card className="p-4 text-sm text-muted-foreground">
                            No org units found.
                        </Card>
                    ) : (
                        pageData.map((ou) => (
                            <Card key={ou.id} className="space-y-3 border p-4">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 truncate font-semibold">
                                            <Network className="h-4 w-4 text-primary" />
                                            {ou.name}
                                        </div>
                                        {ou.code && (
                                            <div className="truncate text-xs text-muted-foreground">
                                                Code: {ou.code}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <Badge
                                            className={getTypeBadgeClass(
                                                ou.type,
                                            )}
                                        >
                                            {ou.type}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-y-1 text-sm text-muted-foreground">
                                    <div className="font-medium text-foreground">
                                        Parent:
                                    </div>
                                    <div className="truncate">
                                        {ou.parent
                                            ? `${ou.parent.name} (${ou.parent.type})`
                                            : '—'}
                                    </div>

                                    <div className="font-medium text-foreground">
                                        Children:
                                    </div>
                                    <div className="truncate">
                                        {ou.children_count}
                                    </div>

                                    <div className="font-medium text-foreground">
                                        Effective:
                                    </div>
                                    <div className="truncate">
                                        {(ou.effective_from ?? '—') +
                                            ' to ' +
                                            (ou.effective_to ?? '—')}
                                    </div>

                                    <div className="font-medium text-foreground">
                                        Created:
                                    </div>
                                    <div className="truncate">
                                        {formatDate(ou.created_at)}
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-end gap-2 pt-2">
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="h-8 gap-1 px-3"
                                    >
                                        <Link href={PATHS.show(ou.id)}>
                                            <Eye className="h-4 w-4" /> View
                                        </Link>
                                    </Button>

                                    <Button
                                        asChild
                                        variant="secondary"
                                        className="h-8 gap-1 px-3"
                                    >
                                        <Link href={PATHS.edit(ou.id)}>
                                            <Pencil className="h-4 w-4" /> Edit
                                        </Link>
                                    </Button>

                                    <Button
                                        variant="destructive"
                                        className="h-8 gap-1 px-3"
                                        onClick={() => openDeleteDialog(ou)}
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
                            List of Org Units ({orgUnits.total} total)
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                {visibleColumns.map((col) => {
                                    const column = ALL_COLUMNS.find(
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
                                pageData.map((ou) => (
                                    <TableRow key={ou.id}>
                                        {visibleColumns.includes('name') && (
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-shrink-0">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                                                            <Building className="h-5 w-5 text-gray-700" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">
                                                            <Link
                                                                href={PATHS.show(
                                                                    ou.id,
                                                                )}
                                                                className="hover:underline"
                                                            >
                                                                {ou.name}
                                                            </Link>
                                                        </div>
                                                        <span className="text-xs text-muted-foreground">
                                                            {ou.cost_center
                                                                ? `Cost Center: ${ou.cost_center}`
                                                                : ''}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        )}

                                        {visibleColumns.includes('type') && (
                                            <TableCell>
                                                <Badge
                                                    className={getTypeBadgeClass(
                                                        ou.type,
                                                    )}
                                                >
                                                    {ou.type}
                                                </Badge>
                                            </TableCell>
                                        )}

                                        {visibleColumns.includes('parent') && (
                                            <TableCell>
                                                {ou.parent ? (
                                                    <Link
                                                        href={PATHS.show(
                                                            ou.parent.id,
                                                        )}
                                                        className="text-sm hover:underline"
                                                    >
                                                        <span className="font-medium">
                                                            {ou.parent.name}
                                                        </span>
                                                        <br />
                                                        <span className="text-xs text-muted-foreground">
                                                            {ou.parent.type}
                                                        </span>
                                                    </Link>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">
                                                        —
                                                    </span>
                                                )}
                                            </TableCell>
                                        )}

                                        {visibleColumns.includes('code') && (
                                            <TableCell className="text-sm text-muted-foreground">
                                                {ou.code ?? '—'}
                                            </TableCell>
                                        )}

                                        {visibleColumns.includes(
                                            'children',
                                        ) && (
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {ou.children_count}
                                                </Badge>
                                            </TableCell>
                                        )}

                                        {visibleColumns.includes(
                                            'effective',
                                        ) && (
                                            <TableCell className="text-sm text-muted-foreground">
                                                {ou.effective_from ?? '—'}{' '}
                                                <br /> {ou.effective_to ?? '—'}
                                            </TableCell>
                                        )}

                                        {visibleColumns.includes(
                                            'created_at',
                                        ) && (
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(ou.created_at)}
                                            </TableCell>
                                        )}

                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={PATHS.show(ou.id)}
                                                    className="inline-flex cursor-pointer items-center justify-center rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600"
                                                    title="View"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={PATHS.edit(ou.id)}
                                                    className="inline-flex cursor-pointer items-center justify-center rounded-full bg-yellow-500 p-2 text-white hover:bg-yellow-600"
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        openDeleteDialog(ou)
                                                    }
                                                    className="inline-flex cursor-pointer items-center justify-center rounded-full bg-red-600 p-2 text-white hover:bg-red-700"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
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
                                        No org units found. Try adjusting your
                                        filters.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Org Unit</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete{' '}
                                <strong>{orgUnitToDelete?.name}</strong>? This
                                action cannot be undone.
                                <br />
                                If it has child org units, deletion may fail.
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
                {orgUnits.last_page > 1 && (
                    <div className="mt-4 flex justify-center">
                        <ReactPaginate
                            pageCount={orgUnits.last_page}
                            forcePage={orgUnits.current_page - 1}
                            onPageChange={handlePageChange}
                            marginPagesDisplayed={1}
                            pageRangeDisplayed={3}
                            previousLabel="← Previous"
                            nextLabel="Next →"
                            breakLabel="..."
                            containerClassName="flex items-center gap-2 text-sm"
                            pageClassName="rounded border px-3 py-1 hover:bg-muted"
                            activeClassName="bg-blue-600 text-white"
                            previousClassName="rounded border px-3 py-1 hover:bg-muted"
                            nextClassName="rounded border px-3 py-1 hover:bg-muted"
                            breakClassName="px-2"
                        />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
