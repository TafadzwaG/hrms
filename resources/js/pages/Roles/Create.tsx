import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { PermissionSelector } from '@/lib/permission-selector';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Save, ShieldCheck } from 'lucide-react';
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

export default function RoleCreate() {
    const { permissionGroups, meta } = usePage<{ permissionGroups: PermissionGroup[]; meta: { total_permissions: number } }>().props;
    const form = useForm({
        code: '',
        name: '',
        description: '',
        permission_ids: [] as number[],
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post('/roles');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Control Center', href: '/control-center' },
                { title: 'Roles', href: '/roles' },
                { title: 'Create', href: '/roles/create' },
            ]}
        >
            <Head title="Create Role" />

            <form onSubmit={submit} className="space-y-6 p-4 md:p-6 lg:p-8">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Create role</h1>
                        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                            Define a new role and select the permissions it should grant immediately after creation.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button asChild variant="outline" className="rounded-xl">
                            <Link href="/roles">Cancel</Link>
                        </Button>
                        <Button type="submit" className="rounded-xl" disabled={form.processing}>
                            <Save className="mr-2 h-4 w-4" />
                            Save role
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
                    <div className="space-y-6">
                        <Card className="rounded-2xl border-border shadow-sm">
                            <CardHeader>
                                <CardTitle>Role details</CardTitle>
                                <CardDescription>Use a stable code and a clear display name.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="code">Role code</Label>
                                    <Input id="code" value={form.data.code} onChange={(event) => form.setData('code', event.target.value.toUpperCase().replace(/\s+/g, '_'))} placeholder="HR_PARTNER" className="rounded-xl" />
                                    {form.errors.code ? <p className="text-sm text-destructive">{form.errors.code}</p> : null}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Role name</Label>
                                    <Input id="name" value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} placeholder="HR Partner" className="rounded-xl" />
                                    {form.errors.name ? <p className="text-sm text-destructive">{form.errors.name}</p> : null}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} placeholder="Summarise what this role is allowed to do." className="min-h-32 rounded-xl" />
                                    {form.errors.description ? <p className="text-sm text-destructive">{form.errors.description}</p> : null}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border-border shadow-sm">
                            <CardContent className="flex items-start gap-4 p-5">
                                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">Dynamic role support</p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Newly created roles become immediately assignable from the user directory. {meta.total_permissions} permissions are currently available.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="rounded-2xl border-border shadow-sm">
                        <CardHeader>
                            <CardTitle>Role permissions</CardTitle>
                            <CardDescription>Group permissions by module and choose exactly what this role should access.</CardDescription>
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

