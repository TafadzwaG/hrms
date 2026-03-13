import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Building,
    Building2,
    Columns,
    Eye,
    Filter,
    GitBranch,
    Info,
    Layers3,
    Network,
    Pencil,
    Plus,
    RotateCcw,
    Search,
    Trash2,
    UploadCloud,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    types: string[];
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
    { key: 'effective', label: 'Effective Dates' },
    { key: 'created_at', label: 'Created At' },
] as const;

// Refactored to use semantic monochromatic classes
function getTypeBadgeClass(type: string) {
    const map: Record<string, string> = {
        COMPANY:
            'bg-foreground text-background hover:bg-foreground border-transparent shadow-sm',
        SBU: 'bg-primary/20 text-primary hover:bg-primary/30 border-transparent',
        DEPARTMENT:
            'bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent',
        TEAM: 'bg-muted text-muted-foreground hover:bg-muted/80 border-border',
    };
    return map[type] || 'bg-muted text-muted-foreground border-border';
}

function formatDate(dateString?: string | null) {
    if (!dateString) return '—';
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return '—';
    return moment(d).format('MMM DD, YYYY');
}

export default function OrgUnitsIndex() {
    const { orgUnits, filters, types } = usePage<PageProps>().props;

    // Filters
    const [search, setSearch] = useState<string>(filters.search || '');
    const [type, setType] = useState<string>(filters.type || 'all');

    // Column Toggles
    const [visibleColumns, setVisibleColumns] = useState<string[]>([
        ...DEFAULT_VISIBLE,
    ]);

    // UI State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [orgUnitToDelete, setOrgUnitToDelete] =
        useState<OrgUnitListItem | null>(null);

    const pageData = orgUnits?.data ?? [];

    const toggleColumn = (col: string) =>
        setVisibleColumns((prev) =>
            prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col],
        );

    const resetColumns = () => setVisibleColumns([...DEFAULT_VISIBLE]);

    // Fetch filtered data (debounced)
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

    // Stats
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
        <AppLayout
            breadcrumbs={[{ title: 'Organization Units', href: PATHS.index }]}
        >
            <Head title="Organization Units" />

            <div className="min-h-[calc(100vh-64px)] w-full bg-muted/10 p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Organization Units
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage your corporate hierarchy, departments, and
                            team structures.
                        </p>
                    </div>

                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                        <Button
                            variant="outline"
                            asChild
                            className="w-full bg-background shadow-sm sm:w-auto"
                        >
                            <Link href={PATHS.upload}>
                                <UploadCloud className="mr-2 h-4 w-4" />
                                Bulk Upload
                            </Link>
                        </Button>
                        <Button
                            asChild
                            className="w-full font-semibold shadow-sm sm:w-auto"
                        >
                            <Link href={PATHS.create}>
                                <Plus className="mr-2 h-4 w-4" />
                                New Org Unit
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="mb-8 flex items-start gap-3 rounded-lg border bg-background p-4 shadow-sm">
                    <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                    <div>
                        <p className="text-sm font-semibold text-foreground">
                            Structural Integrity Note
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            Use filters to find specific companies, SBUs,
                            departments, or teams. Ensure parent-child
                            relationships remain intact before reassigning or
                            deleting units.
                        </p>
                    </div>
                </div>

                {/* Metrics Row */}
                <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Total Units
                                </p>
                                <p className="text-3xl font-bold tracking-tight text-foreground">
                                    {orgUnits.total}
                                </p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Network className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Companies
                                </p>
                                <p className="text-3xl font-bold tracking-tight text-foreground">
                                    {companyCount}
                                </p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                <Building2 className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Active SBUs
                                </p>
                                <p className="text-3xl font-bold tracking-tight text-foreground">
                                    {sbuCount}
                                </p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                <GitBranch className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Depts / Teams
                                </p>
                                <p className="text-3xl font-bold tracking-tight text-foreground">
                                    {deptCount + teamCount}
                                </p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                <Layers3 className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters & Table Container */}
                <div className="rounded-xl border bg-background shadow-sm">
                    {/* Toolbar */}
                    <div className="flex flex-col justify-between gap-4 border-b p-4 lg:flex-row lg:items-center">
                        <div className="flex w-full flex-col items-center gap-3 sm:flex-row lg:w-auto">
                            {/* Search */}
                            <div className="relative w-full sm:w-[320px]">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or code..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-10 w-full border-border bg-muted/20 pl-9 shadow-none focus-visible:bg-background"
                                />
                            </div>

                            {/* Type Filter */}
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger className="h-10 w-full border-border shadow-none sm:w-[180px]">
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Types
                                    </SelectItem>
                                    {types.map((t) => (
                                        <SelectItem key={t} value={t}>
                                            {t}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex w-full items-center gap-3 lg:w-auto">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="h-10 w-full border-border bg-background font-medium shadow-sm sm:w-auto"
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
                                        Reset defaults
                                    </Button>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button
                                variant="outline"
                                onClick={resetFilters}
                                className="h-10 w-full border-border bg-background font-medium shadow-sm sm:w-auto"
                                title="Reset all filters"
                            >
                                <RotateCcw className="mr-2 h-4 w-4 text-muted-foreground" />
                                Reset
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30 hover:bg-transparent">
                                    {visibleColumns.includes('name') && (
                                        <TableHead className="h-12 w-[300px] pl-6 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Organization Unit
                                        </TableHead>
                                    )}
                                    {visibleColumns.includes('type') && (
                                        <TableHead className="w-[140px] text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Type
                                        </TableHead>
                                    )}
                                    {visibleColumns.includes('parent') && (
                                        <TableHead className="min-w-[200px] text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Parent Unit
                                        </TableHead>
                                    )}
                                    {visibleColumns.includes('code') && (
                                        <TableHead className="w-[120px] text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Code
                                        </TableHead>
                                    )}
                                    {visibleColumns.includes('children') && (
                                        <TableHead className="w-[100px] text-center text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Children
                                        </TableHead>
                                    )}
                                    {visibleColumns.includes('effective') && (
                                        <TableHead className="w-[160px] text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Effective
                                        </TableHead>
                                    )}
                                    {visibleColumns.includes('created_at') && (
                                        <TableHead className="w-[140px] text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Created
                                        </TableHead>
                                    )}
                                    <TableHead className="w-[120px] pr-6 text-right text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pageData.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={visibleColumns.length + 1}
                                            className="h-48 text-center text-muted-foreground"
                                        >
                                            No organization units found matching
                                            your search criteria.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pageData.map((ou) => (
                                        <TableRow
                                            key={ou.id}
                                            className="hover:bg-muted/30"
                                        >
                                            {visibleColumns.includes(
                                                'name',
                                            ) && (
                                                <TableCell className="py-4 pl-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
                                                            <Building className="h-4 w-4" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <Link
                                                                href={PATHS.show(
                                                                    ou.id,
                                                                )}
                                                                className="text-sm font-bold text-foreground transition-colors hover:text-primary"
                                                            >
                                                                {ou.name}
                                                            </Link>
                                                            {ou.cost_center && (
                                                                <span className="mt-0.5 text-xs font-medium text-muted-foreground">
                                                                    CC:{' '}
                                                                    {
                                                                        ou.cost_center
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            )}

                                            {visibleColumns.includes(
                                                'type',
                                            ) && (
                                                <TableCell>
                                                    <Badge
                                                        className={`px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase ${getTypeBadgeClass(ou.type)}`}
                                                    >
                                                        {ou.type}
                                                    </Badge>
                                                </TableCell>
                                            )}

                                            {visibleColumns.includes(
                                                'parent',
                                            ) && (
                                                <TableCell>
                                                    {ou.parent ? (
                                                        <Link
                                                            href={PATHS.show(
                                                                ou.parent.id,
                                                            )}
                                                            className="group flex flex-col"
                                                        >
                                                            <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                                                                {ou.parent.name}
                                                            </span>
                                                            <span className="mt-0.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                                {ou.parent.type}
                                                            </span>
                                                        </Link>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground italic">
                                                            — Top Level —
                                                        </span>
                                                    )}
                                                </TableCell>
                                            )}

                                            {visibleColumns.includes(
                                                'code',
                                            ) && (
                                                <TableCell>
                                                    {ou.code ? (
                                                        <Badge
                                                            variant="secondary"
                                                            className="bg-muted px-2 font-mono text-xs text-muted-foreground shadow-none"
                                                        >
                                                            {ou.code}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground">
                                                            —
                                                        </span>
                                                    )}
                                                </TableCell>
                                            )}

                                            {visibleColumns.includes(
                                                'children',
                                            ) && (
                                                <TableCell className="text-center font-bold text-foreground">
                                                    {ou.children_count > 0
                                                        ? ou.children_count
                                                        : '—'}
                                                </TableCell>
                                            )}

                                            {visibleColumns.includes(
                                                'effective',
                                            ) && (
                                                <TableCell className="text-xs font-medium text-muted-foreground">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span>
                                                            {ou.effective_from
                                                                ? moment(
                                                                      ou.effective_from,
                                                                  ).format(
                                                                      'MMM DD, YYYY',
                                                                  )
                                                                : '—'}
                                                        </span>
                                                        <span className="text-muted-foreground/50">
                                                            to
                                                        </span>
                                                        <span>
                                                            {ou.effective_to
                                                                ? moment(
                                                                      ou.effective_to,
                                                                  ).format(
                                                                      'MMM DD, YYYY',
                                                                  )
                                                                : 'Present'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                            )}

                                            {visibleColumns.includes(
                                                'created_at',
                                            ) && (
                                                <TableCell className="text-sm font-medium text-muted-foreground">
                                                    {formatDate(ou.created_at)}
                                                </TableCell>
                                            )}

                                            <TableCell className="pr-6 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                        className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                    >
                                                        <Link
                                                            href={PATHS.show(
                                                                ou.id,
                                                            )}
                                                            title="View Details"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                        className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                    >
                                                        <Link
                                                            href={PATHS.edit(
                                                                ou.id,
                                                            )}
                                                            title="Edit Org Unit"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={() =>
                                                            openDeleteDialog(ou)
                                                        }
                                                        title="Delete"
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
                    </div>

                    {/* Pagination */}
                    {orgUnits.last_page > 1 && (
                        <div className="flex items-center justify-between border-t bg-muted/10 p-4">
                            <div className="pl-2 text-sm font-medium text-muted-foreground">
                                Showing{' '}
                                <span className="font-bold text-foreground">
                                    {(orgUnits.current_page - 1) *
                                        orgUnits.per_page +
                                        1}
                                </span>{' '}
                                to{' '}
                                <span className="font-bold text-foreground">
                                    {Math.min(
                                        orgUnits.current_page *
                                            orgUnits.per_page,
                                        orgUnits.total,
                                    )}
                                </span>{' '}
                                of{' '}
                                <span className="font-bold text-foreground">
                                    {orgUnits.total}
                                </span>{' '}
                                entries
                            </div>
                            <ReactPaginate
                                pageCount={orgUnits.last_page}
                                forcePage={orgUnits.current_page - 1}
                                onPageChange={handlePageChange}
                                marginPagesDisplayed={1}
                                pageRangeDisplayed={3}
                                previousLabel={
                                    <span className="flex items-center text-sm font-medium">
                                        <ChevronLeft className="mr-1 h-4 w-4" />{' '}
                                        Prev
                                    </span>
                                }
                                nextLabel={
                                    <span className="flex items-center text-sm font-medium">
                                        Next{' '}
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    </span>
                                }
                                breakLabel="..."
                                containerClassName="flex items-center gap-1"
                                pageLinkClassName="inline-flex h-9 w-9 items-center justify-center rounded-md border border-transparent bg-transparent font-medium hover:bg-muted text-sm shadow-none text-muted-foreground"
                                activeLinkClassName="!bg-primary text-primary-foreground font-bold border-primary hover:!bg-primary/90 rounded-md"
                                previousLinkClassName="inline-flex h-9 px-3 items-center justify-center rounded-md border border-transparent bg-transparent hover:bg-muted text-sm font-medium text-muted-foreground mr-2"
                                nextLinkClassName="inline-flex h-9 px-3 items-center justify-center rounded-md border border-transparent bg-transparent hover:bg-muted text-sm font-medium text-muted-foreground ml-2"
                                breakClassName="flex h-9 w-9 items-center justify-center text-sm font-medium text-muted-foreground"
                                disabledClassName="opacity-50 pointer-events-none"
                            />
                        </div>
                    )}
                </div>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-destructive">
                                Delete Organization Unit?
                            </DialogTitle>
                            <DialogDescription>
                                Are you sure you want to permanently delete{' '}
                                <strong>{orgUnitToDelete?.name}</strong>? This
                                action cannot be undone.
                                <br />
                                <br />
                                <span className="font-semibold text-foreground">
                                    Note:
                                </span>{' '}
                                Deletion will fail if this unit currently has
                                child departments or assigned employees.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 flex gap-2 sm:justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setDeleteDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={confirmDelete}
                            >
                                Yes, Delete Unit
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
