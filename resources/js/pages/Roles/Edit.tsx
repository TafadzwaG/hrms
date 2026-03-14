import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { PermissionSelector } from '@/lib/permission-selector';
import { roleBadgeClass } from '@/lib/authorization';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { AlertTriangle, Save } from 'lucide-react';
import type { FormEvent } from 'react';

type PermissionGroup = {
    key: string;
    label: string;
    description: string;
    permissions: Array<{
        id: number;
        name: string;
        label: string;
        description: string | null;
        module: string;
        checked: boolean;
    }>;
};

type RolePayload = {
    id: number;
    code: string;
    name: string;
    description: string | null;
    users_count: number;
    permissions_count: number;
    permission_ids: number[];
    is_protected: boolean;
};

export default function RoleEdit() {
    const { role, permissionGroups } = usePage<{ role: RolePayload; permissionGroups: PermissionGroup[] }>().props;
    const form = useForm({
        code: role.code,
        name: role.name,
        description: role.description ?? '',
        permission_ids: role.permission_ids,
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.put(`/roles/${role.id}`);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Control Center', href: '/control-center' },
                { title: 'Roles', href: '/roles' },
                { title: role.name, href: `/roles/${role.id}` },
                { title: 'Edit', href: `/roles/${role.id}/edit` },
            ]}
        >
            <Head title={`Edit ${role.name}`} />

            <form onSubmit={submit} className="space-y-6 p-4 md:p-6 lg:p-8">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${roleBadgeClass(role.code, role.name)}`}>
                                {role.code}
                            </span>
                            {role.is_protected ? <Badge variant="outline">Seeded role</Badge> : null}
                        </div>
                        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">Edit role</h1>
                        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                            Update role details and permission coverage. Changes are applied immediately to users assigned to this role.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button asChild variant="outline" className="rounded-xl">
                            <Link href={`/roles/${role.id}`}>Cancel</Link>
                        </Button>
                        <Button type="submit" className="rounded-xl" disabled={form.processing}>
                            <Save className="mr-2 h-4 w-4" />
                            Update role
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
                    <div className="space-y-6">
                        <Card className="rounded-2xl border-border shadow-sm">
                            <CardHeader>
                                <CardTitle>Role details</CardTitle>
                                <CardDescription>These values are shown throughout the Control Center and user assignment flows.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="code">Role code</Label>
                                    <Input id="code" value={form.data.code} onChange={(event) => form.setData('code', event.target.value.toUpperCase().replace(/\s+/g, '_'))} className="rounded-xl" disabled={role.is_protected} />
                                    {form.errors.code ? <p className="text-sm text-destructive">{form.errors.code}</p> : null}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Role name</Label>
                                    <Input id="name" value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className="rounded-xl" />
                                    {form.errors.name ? <p className="text-sm text-destructive">{form.errors.name}</p> : null}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} className="min-h-32 rounded-xl" />
                                    {form.errors.description ? <p className="text-sm text-destructive">{form.errors.description}</p> : null}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border-border shadow-sm">
                            <CardContent className="space-y-4 p-5">
                                <div>
                                    <p className="text-sm font-medium text-foreground">Impact summary</p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {role.users_count} user{role.users_count === 1 ? '' : 's'} currently inherit this role. {role.permissions_count} permission{role.permissions_count === 1 ? '' : 's'} are assigned today.
                                    </p>
                                </div>
                                {role.is_protected ? (
                                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                                        <div className="flex items-center gap-2 font-medium">
                                            <AlertTriangle className="h-4 w-4" />
                                            This is a seeded role.
                                        </div>
                                        <p className="mt-2 text-amber-800">
                                            Updating permissions is supported, but deletion is blocked to preserve seeded role compatibility.
                                        </p>
                                    </div>
                                ) : null}
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="rounded-2xl border-border shadow-sm">
                        <CardHeader>
                            <CardTitle>Role permissions</CardTitle>
                            <CardDescription>Adjust permission coverage by module.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PermissionSelector
                                groups={permissionGroups}
                                selectedIds={form.data.permission_ids}
                                onChange={(next) => form.setData('permission_ids', next)}
                                disabled={form.processing}
                                error={form.errors.permission_ids}
                            />
                        </CardContent>
                    </Card>
                </div>
            </form>
        </AppLayout>
    );
}

