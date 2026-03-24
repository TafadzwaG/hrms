import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    Eye,
    Filter,
    KeyRound,
    Pencil,
    Plus,
    RotateCcw,
    Search,
    Trash2,
    UserCheck,
    UserCircle2,
    UserMinus,
    Users,
} from 'lucide-react';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import ReactPaginate from 'react-paginate';

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

    // Modal States
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);

    const [resetDialogOpen, setResetDialogOpen] = useState(false);
    const [userToReset, setUserToReset] = useState<UserItem | null>(null);

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

    // --- Delete Handlers ---
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

    // --- Password Reset Handlers ---
    const openResetDialog = (u: UserItem) => {
        if (!u.email) return;
        setUserToReset(u);
        setResetDialogOpen(true);
    };

    const confirmReset = () => {
        if (!userToReset) return;
        router.post(
            PATHS.sendReset(userToReset.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setResetDialogOpen(false);
                    setUserToReset(null);
                },
            },
        );
    };

    const pageData: UserItem[] = users?.data ?? [];

    // Aggregations
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
        return moment(dateString).format('MMM DD, YYYY');
    };

    const getInitials = (name: string) => {
        if (!name) return '??';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Users', href: PATHS.index }]}>
            <Head title="User Management" />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-8 bg-muted/5 p-4 md:p-6 lg:p-8 xl:p-12">
                {/* Header Section */}
                <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                            User Management
                        </h1>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                        <Button
                            asChild
                            className="h-11 bg-foreground px-6 font-bold text-background shadow-sm hover:bg-foreground/90"
                        >
                            <Link href={PATHS.create}>
                                <Plus className="mr-2 h-4 w-4" /> Add New User
                            </Link>
                        </Button>
                    </div>
                </div>

                {errors?.delete && (
                    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm font-bold text-destructive">
                        {errors.delete}
                    </div>
                )}
                {errors?.reset && (
                    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm font-bold text-destructive">
                        {errors.reset}
                    </div>
                )}

                {/* Top Metrics Row */}
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="p-6">
                            <div className="mb-2 flex items-start justify-between">
                                <p className="text-sm font-medium text-foreground">
                                    Total Users
                                </p>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-3xl font-semibold tracking-tight text-foreground">
                                    {users?.total?.toLocaleString() || 0}
                                </h3>
                                <p className="text-xs font-medium text-muted-foreground">
                                    +12 from last month
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="p-6">
                            <div className="mb-2 flex items-start justify-between">
                                <p className="text-sm font-medium text-foreground">
                                    Linked Employees
                                </p>
                                <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-3xl font-semibold tracking-tight text-foreground">
                                    {linkedEmployeesCount.toLocaleString()}
                                </h3>
                                <p className="text-xs font-medium text-muted-foreground">
                                    96.5% linking rate
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="p-6">
                            <div className="mb-2 flex items-start justify-between">
                                <p className="text-sm font-medium text-foreground">
                                    Verified Accounts
                                </p>
                                <UserCheck className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-3xl font-semibold tracking-tight text-foreground">
                                    {verifiedCount.toLocaleString()}
                                </h3>
                                <p className="text-xs font-medium text-muted-foreground">
                                    92 active invites pending
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="p-6">
                            <div className="mb-2 flex items-start justify-between">
                                <p className="text-sm font-medium text-foreground">
                                    Active Filters
                                </p>
                                <Filter className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-3xl font-semibold tracking-tight text-foreground">
                                    {search || roleId ? 'Applied' : 'None'}
                                </h3>
                                <p className="text-xs font-medium text-muted-foreground">
                                    {search || roleId
                                        ? 'Custom view active'
                                        : 'Viewing all directories'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Directory Table */}
                <Card className="flex h-[calc(100vh-340px)] flex-col overflow-hidden border-border bg-background shadow-sm">
                    <CardHeader className="shrink-0 border-b border-border/50 pb-4">
                        <CardTitle className="text-lg font-bold text-foreground">
                            Users Directory
                        </CardTitle>
                        <p className="mt-1 text-sm font-medium text-muted-foreground">
                            Manage and audit system access for all organization
                            members.
                        </p>
                    </CardHeader>

                    {/* Toolbar */}
                    <div className="flex shrink-0 flex-col items-center gap-4 border-b border-border/50 bg-muted/5 p-4 sm:flex-row">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search name or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-10 w-full border-border bg-background pl-9 text-sm shadow-sm"
                            />
                        </div>
                        <div className="flex w-full flex-1 items-center gap-3 sm:w-auto">
                            <Select
                                value={roleId || 'all'}
                                onValueChange={(v) =>
                                    setRoleId(v === 'all' ? '' : v)
                                }
                            >
                                <SelectTrigger className="h-10 w-full border-border bg-background text-sm font-medium shadow-sm sm:w-48">
                                    <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Roles
                                    </SelectItem>
                                    {roles?.map((r: any) => (
                                        <SelectItem
                                            key={r.id}
                                            value={String(r.id)}
                                        >
                                            {r.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {(search || roleId) && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 shrink-0 text-muted-foreground hover:bg-muted"
                                    onClick={resetFilters}
                                >
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                            )}
                            <div className="ml-auto">
                                <Button
                                    variant="outline"
                                    className="h-10 border-border bg-background font-bold shadow-sm"
                                >
                                    <Filter className="mr-2 h-4 w-4" /> View
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/10 hover:bg-transparent">
                                    <TableHead className="h-12 pl-6 text-xs font-bold text-muted-foreground">
                                        Name
                                    </TableHead>
                                    <TableHead className="text-xs font-bold text-muted-foreground">
                                        Email
                                    </TableHead>
                                    <TableHead className="text-xs font-bold text-muted-foreground">
                                        Roles
                                    </TableHead>
                                    <TableHead className="text-xs font-bold text-muted-foreground">
                                        Employee #
                                    </TableHead>
                                    <TableHead className="text-xs font-bold text-muted-foreground">
                                        Status
                                    </TableHead>
                                    <TableHead className="text-xs font-bold text-muted-foreground">
                                        Created
                                    </TableHead>
                                    <TableHead className="pr-6 text-right text-xs font-bold text-muted-foreground">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pageData.length > 0 ? (
                                    pageData.map((u) => (
                                        <TableRow
                                            key={u.id}
                                            className="transition-colors hover:bg-muted/30"
                                        >
                                            <TableCell className="py-4 pl-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border/50 bg-muted text-xs font-bold text-foreground">
                                                        {getInitials(u.name)}
                                                    </div>
                                                    <span className="text-sm font-bold text-foreground">
                                                        {u.name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm font-medium text-muted-foreground">
                                                {u.email}
                                            </TableCell>
                                            <TableCell>
                                                {u.roles?.length > 0 ? (
                                                    <Badge
                                                        variant="secondary"
                                                        className="border-transparent bg-muted px-2.5 py-0.5 text-xs font-bold text-foreground shadow-none"
                                                    >
                                                        {u.roles[0].name}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">
                                                        —
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm font-medium text-muted-foreground">
                                                {u.employee
                                                    ? u.employee.staff_number
                                                    : '—'}
                                            </TableCell>
                                            <TableCell>
                                                {u.email_verified_at ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-transparent bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-primary uppercase shadow-none"
                                                    >
                                                        <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-primary" />{' '}
                                                        Verified
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-dashed border-transparent bg-muted px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase shadow-none"
                                                    >
                                                        Pending
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm font-medium text-muted-foreground">
                                                {formatDate(u.created_at)}
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        title="View Profile"
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
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        title="Edit User"
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
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        onClick={() =>
                                                            openResetDialog(u)
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
                                                        variant="ghost"
                                                        size="icon"
                                                        className={`h-8 w-8 ${u.employee ? 'cursor-not-allowed text-muted-foreground opacity-30' : 'text-muted-foreground hover:bg-destructive/10 hover:text-destructive'}`}
                                                        disabled={!!u.employee}
                                                        onClick={() =>
                                                            openDeleteDialog(u)
                                                        }
                                                        title={
                                                            u.employee
                                                                ? 'Cannot delete user linked to employee'
                                                                : 'Delete'
                                                        }
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
                                            colSpan={7}
                                            className="h-48 text-center text-sm font-medium text-muted-foreground"
                                        >
                                            No users found. Try adjusting your
                                            filters.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {users?.last_page > 1 && (
                        <div className="flex shrink-0 items-center justify-between border-t border-border/50 bg-muted/5 p-4">
                            <span className="text-sm font-medium text-muted-foreground">
                                Showing{' '}
                                {(users.current_page - 1) * users.per_page + 1}{' '}
                                to{' '}
                                {Math.min(
                                    users.current_page * users.per_page,
                                    users.total,
                                )}{' '}
                                of {users.total.toLocaleString()} results
                            </span>
                            <ReactPaginate
                                pageCount={users.last_page}
                                forcePage={users.current_page - 1}
                                onPageChange={handlePageChange}
                                marginPagesDisplayed={1}
                                pageRangeDisplayed={3}
                                previousLabel="Previous"
                                nextLabel="Next"
                                breakLabel="..."
                                containerClassName="flex items-center gap-1"
                                pageLinkClassName="inline-flex h-9 w-9 items-center justify-center rounded-md border border-transparent bg-transparent font-bold hover:bg-muted text-sm shadow-none text-muted-foreground transition-colors"
                                activeLinkClassName="!bg-foreground text-background font-bold border-foreground hover:!bg-foreground/90 rounded-md"
                                previousLinkClassName="inline-flex h-9 px-4 items-center justify-center rounded-md border border-border bg-background hover:bg-muted text-sm font-bold text-foreground transition-colors"
                                nextLinkClassName="inline-flex h-9 px-4 items-center justify-center rounded-md border border-border bg-background hover:bg-muted text-sm font-bold text-foreground transition-colors"
                                breakClassName="flex h-9 w-9 items-center justify-center text-sm font-bold text-muted-foreground"
                                disabledClassName="opacity-50 pointer-events-none"
                            />
                        </div>
                    )}
                </Card>
            </div>

            {/* Delete Dialog */}
            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-destructive">
                            Delete User
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to permanently delete{' '}
                            <strong className="text-foreground">
                                {userToDelete?.name}
                            </strong>
                            ? This action cannot be undone.
                            {userToDelete?.employee && (
                                <span className="mt-4 block rounded-md border border-destructive/50 bg-destructive/10 p-3 text-xs font-bold text-destructive">
                                    Warning: This user is linked to employee{' '}
                                    {userToDelete.employee.staff_number}. System
                                    constraints block deletion to preserve audit
                                    trails.
                                </span>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4 flex justify-end gap-3">
                        <AlertDialogCancel
                            className="border-border font-bold shadow-sm"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive font-bold text-destructive-foreground shadow-sm hover:bg-destructive/90"
                            onClick={(e) => {
                                if (userToDelete?.employee) {
                                    e.preventDefault();
                                    return;
                                }
                                confirmDelete();
                            }}
                            disabled={!!userToDelete?.employee}
                        >
                            Confirm Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Password Reset Dialog */}
            <AlertDialog
                open={resetDialogOpen}
                onOpenChange={setResetDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-foreground">
                            Send Password Reset
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to send a password reset link
                            to{' '}
                            <strong className="text-foreground">
                                {userToReset?.name}
                            </strong>{' '}
                            at{' '}
                            <strong className="text-foreground">
                                {userToReset?.email}
                            </strong>
                            ?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4 flex justify-end gap-3">
                        <AlertDialogCancel
                            className="border-border font-bold shadow-sm"
                            onClick={() => setResetDialogOpen(false)}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-primary font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
                            onClick={(e) => confirmReset()}
                        >
                            Send Link
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
