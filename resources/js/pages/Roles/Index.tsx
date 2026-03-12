import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Plus,
    Trash2,
    Eye,
    Filter,
    Search,
    Settings2,
    RotateCcw,
    Shield,
    Users,
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
const DEFAULT_VISIBLE = ['code', 'name', 'users_count'] as const;

type RoleItem = {
    id: number;
    code: string;
    name: string;
    description: string | null;
    users_count: number;
    created_at: string | null;
};

export default function RolesIndex() {
    const { roles, filters, errors } = usePage().props as any;

    const [search, setSearch] = useState<string>(filters?.search || '');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<RoleItem | null>(null);

    const [visibleColumns, setVisibleColumns] = useState<string[]>([
        ...DEFAULT_VISIBLE,
    ]);

    const allColumns = [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Role Name' },
        { key: 'description', label: 'Description' },
        { key: 'users_count', label: 'Users' },
        { key: 'created_at', label: 'Created' },
    ] as const;

    const PATHS = {
        index: `${API}/roles`,
        create: `${API}/roles/create`,
        show: (id: number) => `${API}/roles/${id}`,
        edit: (id: number) => `${API}/roles/${id}/edit`,
        destroy: (id: number) => `${API}/roles/${id}`,
    };

    const toggleColumn = (col: string) =>
        setVisibleColumns((prev) =>
            prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col],
        );

    const resetColumns = () => setVisibleColumns([...DEFAULT_VISIBLE]);

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                PATHS.index,
                { search },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const resetFilters = () => {
        setSearch('');
        router.get(PATHS.index, {}, { preserveState: true, replace: true });
    };

    const handlePageChange = (selected: { selected: number }) => {
        router.get(
            PATHS.index,
            { page: selected.selected + 1, search },
            { preserveState: true },
        );
    };

    const openDeleteDialog = (r: RoleItem) => {
        setRoleToDelete(r);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!roleToDelete) return;

        router.delete(PATHS.destroy(roleToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setRoleToDelete(null);
                Swal.fire(
                    'Deleted!',
                    'Role has been deleted successfully.',
                    'success',
                );
            },
            onError: () => {
                Swal.fire(
                    'Error',
                    'Failed to delete role. It may be assigned to users.',
                    'error',
                );
            },
        });
    };

    const getRoleBadge = (code: string) => {
        const map: Record<string, string> = {
            SYS_ADMIN: 'bg-red-600 text-white',
            HR_ADMIN: 'bg-indigo-600 text-white',
            PAYROLL: 'bg-emerald-600 text-white',
            MANAGER: 'bg-amber-600 text-white',
            EMPLOYEE: 'bg-blue-600 text-white',
            AUDITOR: 'bg-purple-600 text-white',
        };
        return map[code] || 'bg-slate-700 text-white';
    };

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return '—';
        const m = moment(dateString);
        if (Number.isNaN(d.getTime())) return '—';
        return m.format('ll');
    };

    const pageData: RoleItem[] = roles?.data ?? [];

    // Stats (page-level counts)
    const assignedCount = useMemo(
        () => pageData.filter((r) => (r.users_count || 0) > 0).length,
        [pageData],
    );
    const unassignedCount = useMemo(
        () => pageData.filter((r) => (r.users_count || 0) === 0).length,
        [pageData],
    );

    return (
        <AppLayout breadcrumbs={[{ title: 'Roles', href: `${API}/roles` }]}>
            <Head title="Roles" />

            <div className="mx-2 my-6 rounded-xl bg-background p-1 shadow-sm sm:mx-4 md:mx-8 md:p-6">
                {/* Header */}
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-xl font-bold sm:text-2xl">
                        Role Management
                    </h1>

                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
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
                                Add New Role
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
                                <SheetTitle>Filter Roles</SheetTitle>
                            </SheetHeader>

                            <div className="grid grid-cols-1 gap-3">
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
                                        placeholder="Search by code or name…"
                                        className="w-full rounded border border-border bg-background py-2 pr-3 pl-9 text-sm"
                                    />
                                </div>

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
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by code or name…"
                            className="w-full rounded border border-border bg-background py-2 pr-3 pl-9 text-sm"
                        />
                    </div>

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
                                    Total Roles
                                </p>
                                <p className="text-2xl font-bold">
                                    {roles?.total ?? 0}
                                </p>
                            </div>
                            <div className="rounded-full bg-blue-100 p-3">
                                <Shield className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Assigned (this page)
                                </p>
                                <p className="text-2xl font-bold">
                                    {assignedCount}
                                </p>
                            </div>
                            <div className="rounded-full bg-emerald-100 p-3">
                                <Users className="h-6 w-6 text-emerald-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Unassigned (this page)
                                </p>
                                <p className="text-2xl font-bold">
                                    {unassignedCount}
                                </p>
                            </div>
                            <div className="rounded-full bg-amber-100 p-3">
                                <Users className="h-6 w-6 text-amber-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Search
                                </p>
                                <p className="text-2xl font-bold">
                                    {search ? 'On' : 'Off'}
                                </p>
                            </div>
                            <div className="rounded-full bg-purple-100 p-3">
                                <Search className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Mobile cards */}
                <div className="space-y-3 md:hidden">
                    {pageData.length === 0 ? (
                        <Card className="p-4 text-sm text-muted-foreground">
                            No roles found.
                        </Card>
                    ) : (
                        pageData.map((r) => (
                            <Card key={r.id} className="space-y-2 border p-4">
                                <div className="min-w-0">
                                    <div className="font-semibold">
                                        {r.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        <Badge className={getRoleBadge(r.code)}>
                                            {r.code}
                                        </Badge>{' '}
                                        <Badge className="bg-slate-700 text-white">
                                            {r.users_count} users
                                        </Badge>
                                    </div>
                                    {r.description && (
                                        <div className="mt-1 text-sm text-muted-foreground">
                                            {r.description}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-wrap justify-end gap-2 pt-2">
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="h-8 gap-1 px-3"
                                    >
                                        <Link href={PATHS.show(r.id)}>
                                            <Eye className="h-4 w-4" /> View
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        variant="secondary"
                                        className="h-8 gap-1 px-3"
                                    >
                                        <Link href={PATHS.edit(r.id)}>
                                            <Pencil className="h-4 w-4" /> Edit
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="h-8 gap-1 px-3"
                                        onClick={() => openDeleteDialog(r)}
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
                            List of Roles ({roles?.total ?? 0} total)
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
                                pageData.map((r) => (
                                    <TableRow key={r.id}>
                                        {visibleColumns.includes('code') && (
                                            <TableCell>
                                                <Badge
                                                    className={getRoleBadge(
                                                        r.code,
                                                    )}
                                                >
                                                    {r.code}
                                                </Badge>
                                            </TableCell>
                                        )}

                                        {visibleColumns.includes('name') && (
                                            <TableCell className="font-medium">
                                                <Link
                                                    href={PATHS.show(r.id)}
                                                    className="hover:underline"
                                                >
                                                    {r.name}
                                                </Link>
                                            </TableCell>
                                        )}

                                        {visibleColumns.includes(
                                            'description',
                                        ) && (
                                            <TableCell className="max-w-xs truncate text-muted-foreground">
                                                {r.description ?? '—'}
                                            </TableCell>
                                        )}

                                        {visibleColumns.includes(
                                            'users_count',
                                        ) && (
                                            <TableCell>
                                                <Badge className="bg-slate-700 text-white">
                                                    {r.users_count}
                                                </Badge>
                                            </TableCell>
                                        )}

                                        {visibleColumns.includes(
                                            'created_at',
                                        ) && (
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(r.created_at)}
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
                                                        href={PATHS.show(r.id)}
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
                                                        href={PATHS.edit(r.id)}
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
                                                        openDeleteDialog(r)
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
                                        No roles found. Try adjusting your
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
                            <DialogTitle>Delete Role</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete{' '}
                                <strong>{roleToDelete?.name}</strong>? This
                                action cannot be undone.
                                {roleToDelete &&
                                    roleToDelete.users_count > 0 && (
                                        <span className="mt-2 block text-red-500">
                                            This role has{' '}
                                            {roleToDelete.users_count} users
                                            assigned and deletion may fail.
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
                {roles?.last_page > 1 && (
                    <div className="mt-4 flex justify-center">
                        <ReactPaginate
                            pageCount={roles.last_page}
                            forcePage={roles.current_page - 1}
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
