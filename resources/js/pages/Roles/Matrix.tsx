import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Fingerprint, Save, ShieldCheck, Users } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';

type RoleRow = {
    id: number;
    code: string;
    name: string;
    description: string | null;
    users_count: number;
    permissions_count: number;
    permission_ids: number[];
    permission_names: string[];
    updated_at: string | null;
};

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
    }>;
};

export default function PermissionMatrix() {
    const { roles, permissionGroups, summary } = usePage<{
        roles: RoleRow[];
        permissionGroups: PermissionGroup[];
        summary: {
            roles_total: number;
            permissions_total: number;
            assignments_total: number;
        };
    }>().props;

    const form = useForm({
        matrix: roles.map((role) => ({
            role_id: role.id,
            permission_ids: role.permission_ids,
        })),
    });

    const updateRolePermissions = (roleId: number, permissionId: number) => {
        form.setData(
            'matrix',
            form.data.matrix.map((row) => {
                if (row.role_id !== roleId) return row;

                const hasPermission = row.permission_ids.includes(permissionId);

                return {
                    ...row,
                    permission_ids: hasPermission
                        ? row.permission_ids.filter((id) => id !== permissionId)
                        : [...row.permission_ids, permissionId],
                };
            }),
        );
    };

    const rolePermissions = (roleId: number) =>
        form.data.matrix.find((row) => row.role_id === roleId)
            ?.permission_ids ?? [];

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.put('/roles/matrix');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Control Center', href: '/control-center' },
                { title: 'Permission Matrix', href: '/roles/matrix' },
            ]}
        >
            <Head title="Permission Matrix" />

            <form
                onSubmit={submit}
                className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-8 bg-muted/5 p-4 md:p-6 lg:p-8 xl:p-12"
            >
                {/* Header Section */}
                <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Permission matrix
                        </h1>
                        <p className="mt-2 max-w-3xl text-sm leading-relaxed font-medium text-muted-foreground">
                            Review permission coverage role by role. Changes are
                            applied immediately when saved.
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center">
                        <Button
                            type="submit"
                            className="h-11 bg-foreground px-8 font-bold text-background shadow-sm hover:bg-foreground/90"
                            disabled={form.processing}
                        >
                            {form.processing ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" /> Save
                                    matrix
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Metrics Row */}
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
                    <MatrixMetric
                        title="Roles"
                        value={summary.roles_total}
                        icon={<Users className="h-5 w-5" />}
                    />
                    <MatrixMetric
                        title="Permissions"
                        value={summary.permissions_total}
                        icon={<ShieldCheck className="h-5 w-5" />}
                    />
                    <MatrixMetric
                        title="Assignments"
                        value={summary.assignments_total}
                        icon={<Fingerprint className="h-5 w-5" />}
                    />
                </div>

                {/* Main Matrix Content */}
                <div className="w-full space-y-12 pb-12">
                    {permissionGroups.map((group) => (
                        <div key={group.key} className="space-y-6">
                            {/* Group Header (Matched to screenshot with left border accent) */}
                            <div className="border-l-4 border-foreground py-1 pl-4">
                                <h2 className="text-xl font-extrabold text-foreground">
                                    {group.label}
                                </h2>
                                <p className="mt-1 text-sm font-medium text-muted-foreground">
                                    {group.description}
                                </p>
                            </div>

                            {/* Permissions list within the group */}
                            <div className="space-y-6">
                                {group.permissions.map((permission) => (
                                    <div
                                        key={permission.id}
                                        className="rounded-xl border border-border bg-background p-6 shadow-sm md:p-8"
                                    >
                                        {/* Permission Header */}
                                        <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                                            <div className="space-y-1">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <h3 className="text-base font-bold text-foreground">
                                                        {permission.label}
                                                    </h3>
                                                    <Badge
                                                        variant="secondary"
                                                        className="border-transparent bg-muted px-2 py-0.5 font-mono text-[10px] tracking-widest text-muted-foreground uppercase shadow-none"
                                                    >
                                                        {permission.name}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    {permission.description ||
                                                        `Allows the user to manage ${permission.label.toLowerCase()} actions.`}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Roles Grid for the specific permission */}
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                                            {roles.map((role) => {
                                                const checked = rolePermissions(
                                                    role.id,
                                                ).includes(permission.id);

                                                return (
                                                    <label
                                                        key={`${role.id}-${permission.id}`}
                                                        className={`relative flex min-h-[120px] cursor-pointer flex-col rounded-xl border p-5 transition-all ${
                                                            checked
                                                                ? 'border-foreground bg-muted/10 shadow-sm'
                                                                : 'border-border bg-background hover:border-foreground/30'
                                                        }`}
                                                    >
                                                        {/* Top row: Role Name & Checkbox */}
                                                        <div className="mb-4 flex items-start justify-between gap-3">
                                                            <span className="text-sm leading-tight font-bold text-foreground">
                                                                {role.name}
                                                            </span>
                                                            <Checkbox
                                                                checked={
                                                                    checked
                                                                }
                                                                onCheckedChange={() =>
                                                                    updateRolePermissions(
                                                                        role.id,
                                                                        permission.id,
                                                                    )
                                                                }
                                                                className="mt-0.5 shrink-0 data-[state=checked]:bg-foreground data-[state=checked]:text-background"
                                                            />
                                                        </div>

                                                        {/* Bottom row: Badges & Stats */}
                                                        <div className="mt-auto space-y-3">
                                                            <Badge
                                                                variant="outline"
                                                                className={`px-1.5 py-0 font-mono text-[9px] tracking-widest uppercase shadow-none ${checked ? 'border-foreground/20 bg-background text-foreground' : 'text-muted-foreground'}`}
                                                            >
                                                                {role.code}
                                                            </Badge>
                                                            <div className="flex items-center text-xs font-medium text-muted-foreground">
                                                                <Users className="mr-1.5 h-3.5 w-3.5 opacity-70" />
                                                                {
                                                                    role.users_count
                                                                }{' '}
                                                                Users
                                                            </div>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </form>
        </AppLayout>
    );
}

// Sub-component for Top Metrics
function MatrixMetric({
    title,
    value,
    icon,
}: {
    title: string;
    value: number;
    icon: ReactNode;
}) {
    return (
        <Card className="rounded-xl border-border bg-background shadow-sm">
            <CardContent className="flex items-start gap-5 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
                    {icon}
                </div>
                <div className="mt-0.5 space-y-1">
                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                        {title}
                    </p>
                    <p className="text-3xl font-extrabold tracking-tighter text-foreground">
                        {value.toLocaleString()}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
