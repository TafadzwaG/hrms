import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { roleBadgeClass, useAuthorization } from '@/lib/authorization';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, Pencil, Search, ShieldCheck, Trash2, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

type RoleRow = {
    id: number;
    code: string;
    name: string;
    description: string | null;
    users_count: number;
    permissions_count: number;
    is_protected: boolean;
    created_at: string | null;
    updated_at: string | null;
};

type PaginatedRoles = {
    data: RoleRow[];
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
};

type Stats = {
    total_roles: number;
    total_permissions: number;
    users_with_roles: number;
    recently_updated: number;
};

export default function RolesIndex() {
    const { roles, filters, stats, usersByRole } = usePage<{
        roles: PaginatedRoles;
        filters: { search?: string };
        stats: Stats;
        usersByRole: Array<{ id: number; code: string; name: string; users_count: number }>;
    }>().props;
    const { can } = useAuthorization();
    const [search, setSearch] = useState(filters.search ?? '');
    const [roleToDelete, setRoleToDelete] = useState<RoleRow | null>(null);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            router.get('/roles', { search }, { preserveState: true, replace: true, preserveScroll: true });
        }, 250);

        return () => window.clearTimeout(timer);
    }, [search]);

    const confirmDelete = () => {
        if (!roleToDelete) return;

        router.delete(`/roles/${roleToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => setRoleToDelete(null),
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Control Center', href: '/control-center' },
                { title: 'Roles', href: '/roles' },
            ]}
        >
            <Head title="Roles" />

            <div className="space-y-6 p-4 md:p-6 lg:p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Roles</h1>
                        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                            Browse and maintain dynamic roles. New roles become immediately assignable to users without backend or frontend hardcoding.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        {can('permissions.view') ? (
                            <Button asChild variant="outline" className="rounded-xl">
                                <Link href="/roles/matrix">Permission matrix</Link>
                            </Button>
                        ) : null}
                        {can('roles.create') ? (
                            <Button asChild className="rounded-xl">
                                <Link href="/roles/create">Create role</Link>
                            </Button>
                        ) : null}
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard title="Roles" value={stats.total_roles} description="Configured roles" icon={<ShieldCheck className="h-5 w-5" />} />
                    <StatCard title="Permissions" value={stats.total_permissions} description="Available permissions" icon={<ArrowRight className="h-5 w-5" />} />
                    <StatCard title="Assigned users" value={stats.users_with_roles} description="Users with roles" icon={<Users className="h-5 w-5" />} />
                    <StatCard title="Updated this week" value={stats.recently_updated} description="Recently touched roles" icon={<Pencil className="h-5 w-5" />} />
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
                    <Card className="rounded-2xl border-border shadow-sm">
                        <CardHeader className="gap-4 border-b border-border/60 pb-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle>Role catalogue</CardTitle>
                                <CardDescription>Search by role name, code, or description.</CardDescription>
                            </div>
                            <div className="relative w-full sm:max-w-sm">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search roles" className="rounded-xl pl-9" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Coverage</TableHead>
                                        <TableHead>Users</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roles.data.map((role) => (
                                        <TableRow key={role.id}>
                                            <TableCell>
                                                <div className="space-y-1 py-1">
                                                    <div className="flex items-center gap-2">
                                                        <Link href={`/roles/${role.id}`} className="font-medium text-foreground hover:text-primary">
                                                            {role.name}
                                                        </Link>
                                                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${roleBadgeClass(role.code, role.name)}`}>
                                                            {role.code}
                                                        </span>
                                                        {role.is_protected ? (
                                                            <Badge variant="outline" className="text-[11px]">Seeded</Badge>
                                                        ) : null}
                                                    </div>
                                                    <p className="max-w-xl text-sm text-muted-foreground">{role.description || 'No role description provided.'}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm font-medium text-foreground">{role.permissions_count} permissions</div>
                                                <div className="text-sm text-muted-foreground">Updated {role.updated_at ? new Date(role.updated_at).toLocaleDateString() : 'recently'}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm font-medium text-foreground">{role.users_count}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    {can('roles.update') ? (
                                                        <Button asChild variant="ghost" size="sm">
                                                            <Link href={`/roles/${role.id}/edit`}>Edit</Link>
                                                        </Button>
                                                    ) : null}
                                                    {can('roles.delete') ? (
                                                        <Button variant="ghost" size="icon" disabled={role.is_protected || role.users_count > 0} onClick={() => setRoleToDelete(role)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    ) : null}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {roles.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="py-12 text-center text-sm text-muted-foreground">
                                                No roles match the current search.
                                            </TableCell>
                                        </TableRow>
                                    ) : null}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-border shadow-sm">
                        <CardHeader>
                            <CardTitle>Users by role</CardTitle>
                            <CardDescription>Top role allocations across the user directory.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {usersByRole.map((role) => (
                                <div key={role.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                                    <div>
                                        <div className="text-sm font-medium text-foreground">{role.name}</div>
                                        <div className="font-mono text-xs text-muted-foreground">{role.code}</div>
                                    </div>
                                    <div className="text-sm font-semibold text-foreground">{role.users_count}</div>
                                </div>
                            ))}
                            <Button asChild variant="outline" className="mt-2 w-full rounded-xl">
                                <Link href="/control-center">Back to Control Center</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <AlertDialog open={Boolean(roleToDelete)} onOpenChange={(open) => !open && setRoleToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete role</AlertDialogTitle>
                        <AlertDialogDescription>
                            {roleToDelete
                                ? `Delete ${roleToDelete.name}? This is only allowed for non-seeded roles that are not currently assigned to users.`
                                : 'Delete the selected role.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete role
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}

function StatCard({ title, value, description, icon }: { title: string; value: number; description: string; icon: ReactNode }) {
    return (
        <Card className="rounded-2xl border-border shadow-sm">
            <CardContent className="flex items-start justify-between p-5">
                <div>
                    <div className="text-sm font-medium text-muted-foreground">{title}</div>
                    <div className="mt-2 text-2xl font-semibold text-foreground">{value}</div>
                    <div className="mt-2 text-sm text-muted-foreground">{description}</div>
                </div>
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">{icon}</div>
            </CardContent>
        </Card>
    );
}

