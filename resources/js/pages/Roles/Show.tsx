import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { roleBadgeClass, useAuthorization } from '@/lib/authorization';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, Pencil, ShieldCheck, Trash2, Users } from 'lucide-react';
import { useMemo } from 'react';

type Permission = {
    id: number;
    name: string;
    label: string;
    description: string | null;
    module: string;
};

type PermissionGroup = {
    key: string;
    label: string;
    description: string;
    permissions: Array<Permission & { checked: boolean }>;
};

type RolePayload = {
    id: number;
    code: string;
    name: string;
    description: string | null;
    users_count: number;
    permissions_count: number;
    is_protected: boolean;
    permission_ids: number[];
    permissions: Permission[];
    users: Array<{ id: number; name: string; email: string }>;
    created_at: string | null;
    updated_at: string | null;
};

export default function RoleShow() {
    const { role, permissionGroups } = usePage<{ role: RolePayload; permissionGroups: PermissionGroup[] }>().props;
    const { can } = useAuthorization();

    const groupedAssigned = useMemo(
        () => permissionGroups.filter((group) => group.permissions.some((permission) => permission.checked)),
        [permissionGroups],
    );

    const destroy = () => {
        router.delete(`/roles/${role.id}`);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Control Center', href: '/control-center' },
                { title: 'Roles', href: '/roles' },
                { title: role.name, href: `/roles/${role.id}` },
            ]}
        >
            <Head title={role.name} />

            <div className="space-y-6 p-4 md:p-6 lg:p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${roleBadgeClass(role.code, role.name)}`}>
                                {role.code}
                            </span>
                            {role.is_protected ? <Badge variant="outline">Seeded role</Badge> : null}
                        </div>
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-foreground">{role.name}</h1>
                            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{role.description || 'No role description provided.'}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        {can('roles.update') ? (
                            <Button asChild variant="outline" className="rounded-xl">
                                <Link href={`/roles/${role.id}/edit`}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit role
                                </Link>
                            </Button>
                        ) : null}
                        {can('roles.delete') ? (
                            <Button variant="destructive" className="rounded-xl" disabled={role.is_protected || role.users_count > 0} onClick={destroy}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete role
                            </Button>
                        ) : null}
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <MetricCard title="Users" value={role.users_count} description="Assigned users" />
                    <MetricCard title="Permissions" value={role.permissions_count} description="Granted permissions" />
                    <MetricCard title="Updated" value={role.updated_at ? new Date(role.updated_at).toLocaleDateString() : 'Today'} description="Most recent change" />
                </div>

                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 rounded-xl">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="permissions">Permissions</TabsTrigger>
                        <TabsTrigger value="users">Assigned users</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="grid gap-6 xl:grid-cols-[1fr,0.9fr]">
                        <Card className="rounded-2xl border-border shadow-sm">
                            <CardHeader>
                                <CardTitle>Role summary</CardTitle>
                                <CardDescription>Key facts and lifecycle information for this role.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-2">
                                <Detail label="Role code" value={role.code} />
                                <Detail label="Created" value={role.created_at ? new Date(role.created_at).toLocaleString() : 'Not available'} />
                                <Detail label="Updated" value={role.updated_at ? new Date(role.updated_at).toLocaleString() : 'Not available'} />
                                <Detail label="Protection" value={role.is_protected ? 'Seeded role' : 'Custom role'} />
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border-border shadow-sm">
                            <CardHeader>
                                <CardTitle>Coverage by module</CardTitle>
                                <CardDescription>Assigned modules and the number of permissions enabled in each.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {groupedAssigned.map((group) => (
                                    <div key={group.key} className="flex items-center justify-between rounded-xl border border-border p-3">
                                        <div>
                                            <div className="text-sm font-medium text-foreground">{group.label}</div>
                                            <div className="text-sm text-muted-foreground">{group.description}</div>
                                        </div>
                                        <Badge variant="secondary">{group.permissions.filter((permission) => permission.checked).length}</Badge>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="permissions">
                        <div className="grid gap-6 xl:grid-cols-2">
                            {groupedAssigned.map((group) => (
                                <Card key={group.key} className="rounded-2xl border-border shadow-sm">
                                    <CardHeader>
                                        <CardTitle>{group.label}</CardTitle>
                                        <CardDescription>{group.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {group.permissions.filter((permission) => permission.checked).map((permission) => (
                                            <div key={permission.id} className="rounded-xl border border-border p-3">
                                                <div className="text-sm font-medium text-foreground">{permission.label}</div>
                                                <div className="mt-1 text-sm text-muted-foreground">{permission.description || permission.name}</div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="users">
                        <Card className="rounded-2xl border-border shadow-sm">
                            <CardHeader>
                                <CardTitle>Assigned users</CardTitle>
                                <CardDescription>Users who currently inherit this role.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {role.users.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                                        No users are currently assigned to this role.
                                    </div>
                                ) : (
                                    role.users.map((user) => (
                                        <div key={user.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                                            <div>
                                                <div className="text-sm font-medium text-foreground">{user.name}</div>
                                                <div className="text-sm text-muted-foreground">{user.email}</div>
                                            </div>
                                            <Button asChild variant="ghost" size="sm">
                                                <Link href={`/users/${user.id}`}>
                                                    View user
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}

function MetricCard({ title, value, description }: { title: string; value: number | string; description: string }) {
    return (
        <Card className="rounded-2xl border-border shadow-sm">
            <CardContent className="p-5">
                <div className="text-sm font-medium text-muted-foreground">{title}</div>
                <div className="mt-2 text-3xl font-semibold text-foreground">{value}</div>
                <div className="mt-2 text-sm text-muted-foreground">{description}</div>
            </CardContent>
        </Card>
    );
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-border p-4">
            <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{label}</div>
            <div className="mt-2 text-sm font-medium text-foreground">{value}</div>
        </div>
    );
}
