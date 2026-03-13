import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Download,
    Filter,
    History,
    Key,
    Pencil,
    Plus,
    Search,
    Shield,
    Trash2,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type RoleItem = {
    id: number;
    code: string;
    name: string;
    description: string | null;
    users_count: number;
    created_at: string | null;
};

type PaginatedData = {
    data: RoleItem[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
};

export default function RolesIndex() {
    const { roles, filters } = usePage().props as unknown as {
        roles: PaginatedData;
        filters: { search?: string };
    };

    const [search, setSearch] = useState(filters?.search || '');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<RoleItem | null>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                `${API}/roles`,
                { search },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const handlePageChange = (selectedItem: { selected: number }) => {
        router.get(
            `${API}/roles`,
            { page: selectedItem.selected + 1, search },
            { preserveState: true, preserveScroll: true },
        );
    };

    const confirmDelete = () => {
        if (!roleToDelete) return;
        router.delete(`${API}/roles/${roleToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setRoleToDelete(null);
            },
        });
    };

    const pageData = roles?.data ?? [];

    // Mock global stats based on page data
    const totalRoles = roles?.total || 0;
    const activeUsers =
        pageData.reduce((acc, role) => acc + role.users_count, 0) || 1240;

    return (
        <AppLayout breadcrumbs={[{ title: 'Roles', href: `${API}/roles` }]}>
            <Head title="Roles & Permissions" />

            <div className="min-h-[calc(100vh-64px)] w-full bg-muted/10 p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Roles & Permissions
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Define access levels and assign permissions to
                            manage organization workflows.
                        </p>
                    </div>
                    <Button
                        className="px-6 font-semibold shadow-sm"
                        onClick={() => router.visit(`${API}/roles/create`)}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Role
                    </Button>
                </div>

                {/* Metrics Row */}
                <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Total Roles
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold tracking-tight text-foreground">
                                        {totalRoles}
                                    </p>
                                    <span className="text-xs font-semibold text-emerald-600">
                                        +2 New
                                    </span>
                                </div>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Users className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Active Users
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold tracking-tight text-foreground">
                                        {activeUsers.toLocaleString()}
                                    </p>
                                    <span className="text-xs font-semibold text-emerald-600">
                                        +15%
                                    </span>
                                </div>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Shield className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Permissions
                                </p>
                                <p className="text-3xl font-bold tracking-tight text-foreground">
                                    84
                                </p>
                                <p className="mt-1 text-xs font-medium text-muted-foreground">
                                    Global scope
                                </p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Key className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Pending Audit
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold tracking-tight text-foreground">
                                        3
                                    </p>
                                    <span className="text-xs font-semibold text-amber-600">
                                        Action Req.
                                    </span>
                                </div>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                                <History className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters & Table Container */}
                <div className="mb-8 rounded-xl border bg-background shadow-sm">
                    {/* Toolbar */}
                    <div className="flex flex-col justify-between gap-4 border-b p-4 sm:flex-row sm:items-center">
                        <div className="relative w-full sm:w-[380px]">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search roles by name, code or description..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-10 border-border bg-muted/20 pl-9 shadow-none focus-visible:bg-background"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                className="h-10 border-border bg-background font-medium shadow-sm"
                            >
                                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                                Filter
                            </Button>
                            <Button
                                variant="outline"
                                className="h-10 border-border bg-background font-medium shadow-sm"
                            >
                                <Download className="mr-2 h-4 w-4 text-muted-foreground" />
                                Export
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30 hover:bg-transparent">
                                    <TableHead className="h-12 w-[240px] pl-6 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Role Name
                                    </TableHead>
                                    <TableHead className="w-[140px] text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Code
                                    </TableHead>
                                    <TableHead className="min-w-[300px] text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Description
                                    </TableHead>
                                    <TableHead className="w-[140px] text-right text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Active Users
                                    </TableHead>
                                    <TableHead className="w-[120px] text-center text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Status
                                    </TableHead>
                                    <TableHead className="w-[120px] pr-6 text-right text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pageData.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-48 text-center text-muted-foreground"
                                        >
                                            No roles found matching your search
                                            criteria.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pageData.map((role) => (
                                        <TableRow
                                            key={role.id}
                                            className="group cursor-pointer hover:bg-muted/30"
                                            onClick={() =>
                                                router.visit(
                                                    `${API}/roles/${role.id}`,
                                                )
                                            }
                                        >
                                            <TableCell className="py-4 pl-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                                        <Shield className="h-4 w-4" />
                                                    </div>
                                                    <span className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                                                        {role.name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground shadow-none"
                                                >
                                                    {role.code}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="max-w-[300px] truncate text-sm font-medium text-muted-foreground">
                                                {role.description || '—'}
                                            </TableCell>
                                            <TableCell className="text-right text-base font-bold text-foreground">
                                                {role.users_count.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {role.users_count > 0 ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-transparent bg-emerald-50 px-2.5 py-0.5 font-semibold text-emerald-600 shadow-none"
                                                    >
                                                        Active
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-transparent bg-muted px-2.5 py-0.5 font-semibold text-muted-foreground shadow-none"
                                                    >
                                                        Inactive
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <div
                                                    className="flex items-center justify-end gap-1"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        onClick={() =>
                                                            router.visit(
                                                                `${API}/roles/${role.id}/edit`,
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
                                                            setRoleToDelete(
                                                                role,
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
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {roles?.last_page > 1 && (
                        <div className="flex items-center justify-between border-t p-4">
                            <div className="text-sm font-medium text-muted-foreground">
                                Showing{' '}
                                <span className="font-bold text-foreground">
                                    {(roles.current_page - 1) * roles.per_page +
                                        1}
                                </span>{' '}
                                to{' '}
                                <span className="font-bold text-foreground">
                                    {Math.min(
                                        roles.current_page * roles.per_page,
                                        roles.total,
                                    )}
                                </span>{' '}
                                of{' '}
                                <span className="font-bold text-foreground">
                                    {roles.total}
                                </span>{' '}
                                roles
                            </div>
                            <ReactPaginate
                                pageCount={roles.last_page}
                                forcePage={roles.current_page - 1}
                                onPageChange={handlePageChange}
                                marginPagesDisplayed={1}
                                pageRangeDisplayed={3}
                                previousLabel={
                                    <span className="flex items-center">
                                        Previous
                                    </span>
                                }
                                nextLabel={
                                    <span className="flex items-center">
                                        Next
                                    </span>
                                }
                                breakLabel="..."
                                containerClassName="flex items-center gap-2"
                                pageLinkClassName="hidden"
                                activeLinkClassName="hidden"
                                previousLinkClassName="inline-flex h-9 px-4 items-center justify-center rounded-md border border-input bg-background shadow-sm hover:bg-muted text-sm font-medium transition-colors"
                                nextLinkClassName="inline-flex h-9 px-4 items-center justify-center rounded-md border border-input bg-background shadow-sm hover:bg-muted text-sm font-medium transition-colors"
                                breakClassName="hidden"
                                disabledClassName="opacity-50 pointer-events-none"
                            />
                        </div>
                    )}
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Quick Permissions Audit */}
                    <Card className="border-primary/20 bg-primary/5 shadow-sm lg:col-span-2">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 font-bold text-foreground">
                                <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
                                    <Shield className="h-4 w-4" />
                                </div>
                                Quick Permissions Audit
                            </CardTitle>
                            <p className="pl-10 text-sm font-medium text-muted-foreground">
                                Monitor sensitive access levels across the
                                organization.
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="flex h-24 flex-col justify-between rounded-lg border bg-background p-4">
                                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Super Admins
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-2xl font-bold">2</p>
                                        <div className="h-0 w-0 rounded-sm border-r-8 border-b-[14px] border-l-8 border-r-transparent border-b-amber-500 border-l-transparent"></div>
                                    </div>
                                </div>
                                <div className="flex h-24 flex-col justify-between rounded-lg border bg-background p-4">
                                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        API Keys
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-2xl font-bold">8</p>
                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex h-24 flex-col justify-between rounded-lg border bg-background p-4">
                                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        MFA Compliance
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-2xl font-bold">
                                            98%
                                        </p>
                                        <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-500 text-white">
                                            <Shield className="h-3 w-3" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="border-border bg-background shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-bold text-foreground">
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="relative ml-2 space-y-6 border-l-2 border-muted">
                                <div className="relative pl-4">
                                    <div className="absolute top-1.5 -left-[5px] h-2 w-2 rounded-full bg-primary ring-4 ring-background"></div>
                                    <p className="text-sm font-semibold text-foreground">
                                        Role "HR_ADMIN" permissions updated
                                    </p>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        2 hours ago by Sarah Connor
                                    </p>
                                </div>
                                <div className="relative pl-4">
                                    <div className="absolute top-1.5 -left-[5px] h-2 w-2 rounded-full bg-primary ring-4 ring-background"></div>
                                    <p className="text-sm font-semibold text-foreground">
                                        New role "INTERN" created
                                    </p>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        Yesterday by Mike Ross
                                    </p>
                                </div>
                                <div className="relative pl-4">
                                    <div className="absolute top-1.5 -left-[5px] h-2 w-2 rounded-full bg-muted-foreground ring-4 ring-background"></div>
                                    <p className="text-sm font-semibold text-foreground">
                                        Role "SUPPORT" deleted
                                    </p>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        2 days ago by Admin
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="link"
                                className="mt-2 w-full font-semibold text-primary"
                            >
                                View All Logs
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Delete Confirmation Dialog */}
                <AlertDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-destructive">
                                Delete Role
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to permanently delete the{' '}
                                <strong>{roleToDelete?.name}</strong> role?
                                Roles assigned to active users cannot be
                                deleted.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                onClick={() => setRoleToDelete(null)}
                            >
                                Cancel
                            </AlertDialogCancel>
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
