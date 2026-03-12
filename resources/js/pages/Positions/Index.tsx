import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Plus,
    Trash2,
    Eye,
    Filter,
    Search,
    Settings2,
    RotateCcw,
    Briefcase,
    Users,
    Pencil,
    UploadCloud,
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
const DEFAULT_VISIBLE = [
    'name',
    'code',
    'department',
    'employees_count',
    'is_active',
] as const;

type Department = { id: number; name: string; type: string };

type PositionItem = {
    id: number;
    name: string;
    code: string | null;
    description: string | null;
    is_active: boolean;
    employees_count: number;
    org_unit: { id: number; name: string; type: string } | null;
    created_at: string | null;
};

export default function PositionsIndex() {
    const { positions, filters, departments, errors } = usePage()
        .props as any as {
        positions: any;
        filters: { search?: string; department_id?: string; status?: string };
        departments: Department[];
        errors?: any;
    };

    const [search, setSearch] = useState<string>(filters?.search || '');
    const [departmentId, setDepartmentId] = useState<string>(
        filters?.department_id || 'all',
    );
    const [status, setStatus] = useState<string>(filters?.status || 'all');

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [positionToDelete, setPositionToDelete] =
        useState<PositionItem | null>(null);

    const [visibleColumns, setVisibleColumns] = useState<string[]>([
        ...DEFAULT_VISIBLE,
    ]);

    const allColumns = [
        { key: 'name', label: 'Position Name' },
        { key: 'code', label: 'Code' },
        { key: 'department', label: 'Department' },
        { key: 'employees_count', label: 'Employees' },
        { key: 'is_active', label: 'Status' },
        { key: 'created_at', label: 'Created' },
    ] as const;

    const PATHS = {
        index: `${API}/positions`,
        create: `${API}/positions/create`,
        upload: `${API}/positions/upload`,
        show: (id: number) => `${API}/positions/${id}`,
        edit: (id: number) => `${API}/positions/${id}/edit`,
        destroy: (id: number) => `${API}/positions/${id}`,
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
                {
                    search,
                    department_id: departmentId === 'all' ? '' : departmentId,
                    status: status === 'all' ? 'all' : status,
                },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(timer);
    }, [search, departmentId, status]);

    const resetFilters = () => {
        setSearch('');
        setDepartmentId('all');
        setStatus('all');
        router.get(PATHS.index, {}, { preserveState: true, replace: true });
    };

    const handlePageChange = (selected: { selected: number }) => {
        router.get(
            PATHS.index,
            {
                page: selected.selected + 1,
                search,
                department_id: departmentId === 'all' ? '' : departmentId,
                status,
            },
            { preserveState: true },
        );
    };

    const openDeleteDialog = (p: PositionItem) => {
        setPositionToDelete(p);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!positionToDelete) return;

        router.delete(PATHS.destroy(positionToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setPositionToDelete(null);
                Swal.fire(
                    'Deleted!',
                    'Position has been deleted successfully.',
                    'success',
                );
            },
            onError: () => {
                Swal.fire(
                    'Error',
                    'Failed to delete position. It may be assigned to employees.',
                    'error',
                );
            },
        });
    };

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return '—';
        const m = moment(dateString);
        if (Number.isNaN(d.getTime())) return '—';
        return m.format('ll');
    };

    const pageData: PositionItem[] = positions?.data ?? [];

    const activeCount = useMemo(
        () => pageData.filter((p) => p.is_active).length,
        [pageData],
    );
    const inactiveCount = useMemo(
        () => pageData.filter((p) => !p.is_active).length,
        [pageData],
    );

    return (
        <AppLayout
            breadcrumbs={[{ title: 'Positions', href: `${API}/positions` }]}
        >
            <Head title="Positions" />

            <div className="mx-2 my-6 rounded-xl bg-background p-1 shadow-sm sm:mx-4 md:mx-8 md:p-6">
                {/* Header */}
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-xl font-bold sm:text-2xl">
                        Position Management
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
                                Bulk Upload Positions
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
                                Add New Position
                            </Link>
                        </Button>
                    </div>
                </div>

                {errors?.delete && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                        {errors.delete}
                    </div>
                )}

                {/* Filters — Mobile */}
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
                                <SheetTitle>Filter Positions</SheetTitle>
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
                                        placeholder="Search by name or code…"
                                        className="w-full rounded border border-border bg-background py-2 pr-3 pl-9 text-sm"
                                    />
                                </div>

                                {/* Department */}
                                <div>
                                    <Select
                                        value={departmentId}
                                        onValueChange={setDepartmentId}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Filter by department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All Departments
                                            </SelectItem>
                                            {departments.map((d) => (
                                                <SelectItem
                                                    key={d.id}
                                                    value={String(d.id)}
                                                >
                                                    {d.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Status */}
                                <div>
                                    <Select
                                        value={status}
                                        onValueChange={setStatus}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Filter by status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All
                                            </SelectItem>
                                            <SelectItem value="active">
                                                Active
                                            </SelectItem>
                                            <SelectItem value="inactive">
                                                Inactive
                                            </SelectItem>
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

                                <div className="flex flex-col gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={resetFilters}
                                        className="w-full gap-2"
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
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or code…"
                            className="w-full rounded border border-border bg-background py-2 pr-3 pl-9 text-sm"
                        />
                    </div>

                    <Select
                        value={departmentId}
                        onValueChange={setDepartmentId}
                    >
                        <SelectTrigger className="w-full sm:w-64">
                            <SelectValue placeholder="Filter by department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            {departments.map((d) => (
                                <SelectItem key={d.id} value={String(d.id)}>
                                    {d.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-full sm:w-40">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>

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
                        className="ml-auto flex items-center gap-2"
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
                                    Total Positions
                                </p>
                                <p className="text-2xl font-bold">
                                    {positions?.total ?? 0}
                                </p>
                            </div>
                            <div className="rounded-full bg-blue-100 p-3">
                                <Briefcase className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Active (this page)
                                </p>
                                <p className="text-2xl font-bold">
                                    {activeCount}
                                </p>
                            </div>
                            <div className="rounded-full bg-emerald-100 p-3">
                                <Briefcase className="h-6 w-6 text-emerald-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Inactive (this page)
                                </p>
                                <p className="text-2xl font-bold">
                                    {inactiveCount}
                                </p>
                            </div>
                            <div className="rounded-full bg-amber-100 p-3">
                                <Briefcase className="h-6 w-6 text-amber-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Employees (this page)
                                </p>
                                <p className="text-2xl font-bold">
                                    {pageData.reduce(
                                        (sum, p) =>
                                            sum + (p.employees_count || 0),
                                        0,
                                    )}
                                </p>
                            </div>
                            <div className="rounded-full bg-purple-100 p-3">
                                <Users className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Mobile cards */}
                <div className="space-y-3 md:hidden">
                    {pageData.length === 0 ? (
                        <Card className="p-4 text-sm text-muted-foreground">
                            No positions found.
                        </Card>
                    ) : (
                        pageData.map((p) => (
                            <Card key={p.id} className="space-y-2 border p-4">
                                <div className="min-w-0">
                                    <div className="font-semibold">
                                        {p.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {p.code ?? '—'} •{' '}
                                        <Badge
                                            className={
                                                p.is_active
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-slate-700 text-white'
                                            }
                                        >
                                            {p.is_active
                                                ? 'Active'
                                                : 'Inactive'}
                                        </Badge>{' '}
                                        <Badge className="bg-slate-700 text-white">
                                            {p.employees_count} emp
                                        </Badge>
                                    </div>
                                    <div className="mt-1 text-sm">
                                        <span className="font-medium">
                                            Department:
                                        </span>{' '}
                                        {p.org_unit?.name ?? '—'}
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-end gap-2 pt-2">
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="h-8 gap-1 px-3"
                                    >
                                        <Link href={PATHS.show(p.id)}>
                                            <Eye className="h-4 w-4" /> View
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        variant="secondary"
                                        className="h-8 gap-1 px-3"
                                    >
                                        <Link href={PATHS.edit(p.id)}>
                                            <Pencil className="h-4 w-4" /> Edit
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="h-8 gap-1 px-3"
                                        onClick={() => openDeleteDialog(p)}
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
                            List of Positions ({positions?.total ?? 0} total)
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
                                pageData.map((p) => (
                                    <TableRow key={p.id}>
                                        {visibleColumns.includes('name') && (
                                            <TableCell className="font-medium">
                                                <Link
                                                    href={PATHS.show(p.id)}
                                                    className="hover:underline"
                                                >
                                                    {p.name}
                                                </Link>
                                                <div className="max-w-[420px] truncate text-sm text-muted-foreground">
                                                    {p.description ?? ''}
                                                </div>
                                            </TableCell>
                                        )}

                                        {visibleColumns.includes('code') && (
                                            <TableCell className="text-sm text-muted-foreground">
                                                {p.code ?? '—'}
                                            </TableCell>
                                        )}

                                        {visibleColumns.includes(
                                            'department',
                                        ) && (
                                            <TableCell>
                                                {p.org_unit?.name ?? '—'}
                                            </TableCell>
                                        )}

                                        {visibleColumns.includes(
                                            'employees_count',
                                        ) && (
                                            <TableCell>
                                                <Badge className="bg-slate-700 text-white">
                                                    {p.employees_count}
                                                </Badge>
                                            </TableCell>
                                        )}

                                        {visibleColumns.includes(
                                            'is_active',
                                        ) && (
                                            <TableCell>
                                                <Badge
                                                    className={
                                                        p.is_active
                                                            ? 'bg-emerald-600 text-white'
                                                            : 'bg-slate-700 text-white'
                                                    }
                                                >
                                                    {p.is_active
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                        )}

                                        {visibleColumns.includes(
                                            'created_at',
                                        ) && (
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(p.created_at)}
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
                                                        href={PATHS.show(p.id)}
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
                                                        href={PATHS.edit(p.id)}
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
                                                        openDeleteDialog(p)
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
                                        No positions found. Try adjusting your
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
                            <DialogTitle>Delete Position</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete{' '}
                                <strong>{positionToDelete?.name}</strong>? This
                                action cannot be undone.
                                {positionToDelete &&
                                    positionToDelete.employees_count > 0 && (
                                        <span className="mt-2 block text-red-500">
                                            This position has{' '}
                                            {positionToDelete.employees_count}{' '}
                                            employees and deletion may fail.
                                        </span>
                                    )}
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
                {positions?.last_page > 1 && (
                    <div className="mt-4 flex justify-center">
                        <ReactPaginate
                            pageCount={positions.last_page}
                            forcePage={positions.current_page - 1}
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
