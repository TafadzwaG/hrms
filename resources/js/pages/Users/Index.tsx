import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Eye,
    Filter,
    KeyRound,
    Mail,
    Pencil,
    Plus,
    RotateCcw,
    Search,
    Settings2,
    Shield,
    Trash2,
    Users,
} from 'lucide-react';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';

const DEFAULT_VISIBLE = ['name', 'email', 'roles', 'employee'] as const;

type RoleItem = { id: number; code: string; name: string };
type UserItem = {
    id: number;
    name: string;
    email: string;
    username?: string | null;
    role?: string | null;
    email_verified_at?: string | null;
    roles_count: number;
    roles: RoleItem[];
    employee?: { id: number; staff_number: string; full_name: string } | null;
    created_at?: string | null;
};

export default function UsersIndex() {
    const { users, filters, roles, meta, errors } = usePage().props as any;

    const PATHS = {
        index: `${API}/users`,
        create: `${API}/users/create`,
        show: (id: number) => `${API}/users/${id}`,
        edit: (id: number) => `${API}/users/${id}/edit`,
        destroy: (id: number) => `${API}/users/${id}`,
        sendReset: (id: number) =>
            `${API}/users/${id}/send-password-reset-link`,
    };

    const [search, setSearch] = useState<string>(filters?.search || '');
    const [roleId, setRoleId] = useState<string>(filters?.role_id || '');

    const [visibleColumns, setVisibleColumns] = useState<string[]>([
        ...DEFAULT_VISIBLE,
    ]);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);

    const allColumns = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        ...(meta?.supportsUsername
            ? [{ key: 'username', label: 'Username' }]
            : []),
        { key: 'roles', label: 'Roles' },
        { key: 'employee', label: 'Employee' },
        ...(meta?.supportsEmailVerification
            ? [{ key: 'verified', label: 'Verified' }]
            : []),
        { key: 'created_at', label: 'Created' },
    ] as const;

    const toggleColumn = (col: string) =>
        setVisibleColumns((prev) =>
            prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col],
        );
    const resetColumns = () => setVisibleColumns([...DEFAULT_VISIBLE]);

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                PATHS.index,
                { search, role_id: roleId },
                { preserveState: true, replace: true },
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [search, roleId]);

    const resetFilters = () => {
        setSearch('');
        setRoleId('');
        router.get(PATHS.index, {}, { preserveState: true, replace: true });
    };

    const handlePageChange = (selected: { selected: number }) => {
        router.get(
            PATHS.index,
            { page: selected.selected + 1, search, role_id: roleId },
            { preserveState: true },
        );
    };

    const openDeleteDialog = (u: UserItem) => {
        setUserToDelete(u);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!userToDelete) return;

        router.delete(PATHS.destroy(userToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setUserToDelete(null);
            },
        });
    };

    const sendResetLink = (u: UserItem) => {
        if (!u.email) {
            Swal.fire(
                'No email address',
                'This user does not have an email address.',
                'info',
            );
            return;
        }

        Swal.fire({
            title: 'Send reset link?',
            text: `Send a password reset link to ${u.email}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Send link',
            cancelButtonText: 'Cancel',
        }).then((res) => {
            if (!res.isConfirmed) return;

            router.post(
                PATHS.sendReset(u.id),
                {},
                {
                    preserveScroll: true,
                    onSuccess: () =>
                        Swal.fire(
                            'Queued!',
                            'Password reset link has been queued for sending.',
                            'success',
                        ),
                    onError: () =>
                        Swal.fire(
                            'Error',
                            'Failed to send reset link.',
                            'error',
                        ),
                },
            );
        });
    };

    const pageData: UserItem[] = users?.data ?? [];

    const verifiedCount = useMemo(() => {
        if (!meta?.supportsEmailVerification) return 0;
        return pageData.filter((u) => !!u.email_verified_at).length;
    }, [pageData, meta?.supportsEmailVerification]);

    const linkedEmployeesCount = useMemo(
        () => pageData.filter((u) => !!u.employee).length,
        [pageData],
    );

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return '—';
        const d = new Date(dateString);
        if (Number.isNaN(d.getTime())) return '—';
        return moment(d).format('ll');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Users', href: PATHS.index }]}>
            <Head title="Users" />

            <div className="min-h-[calc(100vh-64px)] w-full space-y-6 bg-muted/40 p-4 md:p-8">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            User Management
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage system access, roles, and connected employee
                            accounts.
                        </p>
                    </div>

                    <Button asChild className="w-full shadow-sm sm:w-auto">
                        <Link
                            href={PATHS.create}
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add New User
                        </Link>
                    </Button>
                </div>

                {errors?.delete && (
                    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                        {errors.delete}
                    </div>
                )}
                {errors?.reset && (
                    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                        {errors.reset}
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Users
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {users?.total ?? 0}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Linked Employees
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {linkedEmployeesCount}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                On current page
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Verified Accounts
                            </CardTitle>
                            <Mail className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {meta?.supportsEmailVerification
                                    ? verifiedCount
                                    : '—'}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                On current page
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Filters
                            </CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {roleId || search ? 'Yes' : 'No'}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Custom views applied
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Table Card */}
                <Card>
                    <CardHeader className="flex flex-col items-start justify-between gap-4 border-b sm:flex-row sm:items-center">
                        <div className="space-y-1">
                            <CardTitle className="text-lg">
                                Users Directory
                            </CardTitle>
                        </div>

                        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                            {/* Mobile Filters Sheet */}
                            <div className="w-full sm:hidden">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full gap-2"
                                        >
                                            <Settings2 className="h-4 w-4" />
                                            Filters & Columns
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent
                                        side="top"
                                        className="space-y-4 p-4"
                                    >
                                        <SheetHeader>
                                            <SheetTitle>
                                                Filter Users
                                            </SheetTitle>
                                        </SheetHeader>
                                        <div className="grid grid-cols-1 gap-3">
                                            <div className="relative">
                                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    value={search}
                                                    onChange={(e) =>
                                                        setSearch(
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Search name/email…"
                                                    className="pl-9"
                                                />
                                            </div>
                                            <Select
                                                value={roleId || 'all'}
                                                onValueChange={(v) =>
                                                    setRoleId(
                                                        v === 'all' ? '' : v,
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Filter by role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">
                                                        All Roles
                                                    </SelectItem>
                                                    {roles.map((r: any) => (
                                                        <SelectItem
                                                            key={r.id}
                                                            value={String(r.id)}
                                                        >
                                                            {r.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                variant="outline"
                                                onClick={resetFilters}
                                                className="w-full gap-2"
                                            >
                                                <RotateCcw className="h-4 w-4" />
                                                Reset Filters
                                            </Button>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>

                            {/* Desktop Filters */}
                            <div className="hidden items-center gap-2 sm:flex">
                                <div className="relative w-64">
                                    <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Search name/email…"
                                        className="h-9 pl-8"
                                    />
                                </div>
                                <Select
                                    value={roleId || 'all'}
                                    onValueChange={(v) =>
                                        setRoleId(v === 'all' ? '' : v)
                                    }
                                >
                                    <SelectTrigger className="h-9 w-40">
                                        <SelectValue placeholder="Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Roles
                                        </SelectItem>
                                        {roles.map((r: any) => (
                                            <SelectItem
                                                key={r.id}
                                                value={String(r.id)}
                                            >
                                                {r.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-9 w-9"
                                        >
                                            <Filter className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="w-48"
                                    >
                                        <DropdownMenuLabel>
                                            Toggle Columns
                                        </DropdownMenuLabel>
                                        {allColumns.map((col: any) => (
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
                                            className="h-8 w-full justify-start px-2 text-xs"
                                            onClick={resetColumns}
                                        >
                                            <RotateCcw className="mr-2 h-3.5 w-3.5" />
                                            Reset to defaults
                                        </Button>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                {(search || roleId) && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 text-muted-foreground"
                                        onClick={resetFilters}
                                        title="Reset filters"
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        {visibleColumns.includes('name') && (
                                            <TableHead>Name</TableHead>
                                        )}
                                        {visibleColumns.includes('email') && (
                                            <TableHead>Email</TableHead>
                                        )}
                                        {meta?.supportsUsername &&
                                            visibleColumns.includes(
                                                'username',
                                            ) && (
                                                <TableHead>Username</TableHead>
                                            )}
                                        {visibleColumns.includes('roles') && (
                                            <TableHead>Roles</TableHead>
                                        )}
                                        {visibleColumns.includes(
                                            'employee',
                                        ) && <TableHead>Employee</TableHead>}
                                        {meta?.supportsEmailVerification &&
                                            visibleColumns.includes(
                                                'verified',
                                            ) && (
                                                <TableHead>Verified</TableHead>
                                            )}
                                        {visibleColumns.includes(
                                            'created_at',
                                        ) && <TableHead>Created</TableHead>}
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {pageData.length > 0 ? (
                                        pageData.map((u) => (
                                            <TableRow
                                                key={u.id}
                                                className="hover:bg-muted/50"
                                            >
                                                {visibleColumns.includes(
                                                    'name',
                                                ) && (
                                                    <TableCell className="font-medium">
                                                        <Link
                                                            href={PATHS.show(
                                                                u.id,
                                                            )}
                                                            className="hover:underline"
                                                        >
                                                            {u.name}
                                                        </Link>
                                                    </TableCell>
                                                )}

                                                {visibleColumns.includes(
                                                    'email',
                                                ) && (
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {u.email}
                                                    </TableCell>
                                                )}

                                                {meta?.supportsUsername &&
                                                    visibleColumns.includes(
                                                        'username',
                                                    ) && (
                                                        <TableCell className="text-sm text-muted-foreground">
                                                            {u.username ?? '—'}
                                                        </TableCell>
                                                    )}

                                                {visibleColumns.includes(
                                                    'roles',
                                                ) && (
                                                    <TableCell>
                                                        <div className="flex flex-wrap gap-1">
                                                            {(u.roles ?? [])
                                                                .length ===
                                                            0 ? (
                                                                <span className="text-sm text-muted-foreground">
                                                                    —
                                                                </span>
                                                            ) : (
                                                                u.roles
                                                                    .slice(0, 3)
                                                                    .map(
                                                                        (r) => (
                                                                            <Badge
                                                                                key={
                                                                                    r.id
                                                                                }
                                                                                variant="secondary"
                                                                                className="text-[10px] font-medium uppercase"
                                                                            >
                                                                                {
                                                                                    r.code
                                                                                }
                                                                            </Badge>
                                                                        ),
                                                                    )
                                                            )}
                                                            {(u.roles?.length ??
                                                                0) > 3 && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="text-[10px] font-medium"
                                                                >
                                                                    +
                                                                    {u.roles
                                                                        .length -
                                                                        3}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                )}

                                                {visibleColumns.includes(
                                                    'employee',
                                                ) && (
                                                    <TableCell>
                                                        {u.employee ? (
                                                            <Badge
                                                                variant="outline"
                                                                className="font-normal"
                                                            >
                                                                {
                                                                    u.employee
                                                                        .staff_number
                                                                }
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-sm text-muted-foreground">
                                                                —
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                )}

                                                {meta?.supportsEmailVerification &&
                                                    visibleColumns.includes(
                                                        'verified',
                                                    ) && (
                                                        <TableCell>
                                                            {u.email_verified_at ? (
                                                                <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 shadow-none hover:bg-emerald-100">
                                                                    Yes
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="secondary">
                                                                    No
                                                                </Badge>
                                                            )}
                                                        </TableCell>
                                                    )}

                                                {visibleColumns.includes(
                                                    'created_at',
                                                ) && (
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {formatDate(
                                                            u.created_at,
                                                        )}
                                                    </TableCell>
                                                )}

                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            asChild
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 text-muted-foreground"
                                                            title="View"
                                                        >
                                                            <Link
                                                                href={PATHS.show(
                                                                    u.id,
                                                                )}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            asChild
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 text-muted-foreground"
                                                            title="Edit"
                                                        >
                                                            <Link
                                                                href={PATHS.edit(
                                                                    u.id,
                                                                )}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 text-muted-foreground"
                                                            onClick={() =>
                                                                sendResetLink(u)
                                                            }
                                                            disabled={!u.email}
                                                            title={
                                                                u.email
                                                                    ? 'Send password reset link'
                                                                    : 'User has no email'
                                                            }
                                                        >
                                                            <KeyRound className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                            onClick={() =>
                                                                openDeleteDialog(
                                                                    u,
                                                                )
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
                                                colSpan={8}
                                                className="py-8 text-center text-sm text-muted-foreground"
                                            >
                                                No users found. Try adjusting
                                                your filters.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {users?.last_page > 1 && (
                    <div className="flex justify-center pt-2">
                        <ReactPaginate
                            pageCount={users.last_page}
                            forcePage={users.current_page - 1}
                            onPageChange={handlePageChange}
                            marginPagesDisplayed={1}
                            pageRangeDisplayed={3}
                            previousLabel="Previous"
                            nextLabel="Next"
                            breakLabel="..."
                            containerClassName="flex items-center gap-1 text-sm font-medium"
                            pageClassName=""
                            pageLinkClassName="flex h-9 min-w-9 items-center justify-center rounded-md border border-input bg-background px-3 hover:bg-muted"
                            activeLinkClassName="bg-primary text-primary-foreground hover:bg-primary border-primary"
                            previousClassName=""
                            previousLinkClassName="flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 hover:bg-muted"
                            nextClassName=""
                            nextLinkClassName="flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 hover:bg-muted"
                            breakClassName="flex h-9 items-center justify-center px-2 text-muted-foreground"
                            disabledClassName="opacity-50 pointer-events-none"
                        />
                    </div>
                )}

                {/* Delete Dialog */}
                <Dialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete User</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete{' '}
                                <strong className="text-foreground">
                                    {userToDelete?.name}
                                </strong>
                                ? This action cannot be undone.
                                {userToDelete?.employee && (
                                    <span className="mt-2 block font-medium text-destructive">
                                        This user is linked to employee{' '}
                                        {userToDelete.employee.staff_number} and
                                        deletion will be blocked.
                                    </span>
                                )}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 flex justify-end gap-2">
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
                                Confirm Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
