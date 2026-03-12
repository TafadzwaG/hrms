import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Edit,
    Trash2,
    Mail,
    User,
    Hash,
    Shield,
    Clock,
    Users,
} from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';

import { Badge as UiBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import { Label } from '@/components/ui/label';
import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';

export default function UserShow() {
    const { user, meta, errors } = usePage().props as any;
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const PATHS = {
        index: `${API}/users`,
        edit: `${API}/users/${user.id}/edit`,
        destroy: `${API}/users/${user.id}`,
    };

    const roleBadgeClass = (code: string) => {
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
        if (!m.isValid()) return '—';
        return m.format('LL');
    };

    const cannotDelete = !!errors?.delete || !!user.employee;

    const confirmDelete = () => {
        setDeleteDialogOpen(false);
        router.delete(PATHS.destroy, { preserveScroll: true });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Users', href: `${API}/users` },
                { title: user.name, href: `${API}/users/${user.id}` },
            ]}
        >
            <Head title={user.name} />

            <div className="mx-2 my-6 rounded-xl bg-background p-1 shadow-sm sm:mx-4 md:mx-8 md:p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => router.visit(PATHS.index)}
                            className="h-8 w-8"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">User Details</h1>
                            <p className="text-muted-foreground">
                                View account and role assignments
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => router.visit(PATHS.edit)}
                            className="flex items-center gap-2"
                        >
                            <Edit className="h-4 w-4" /> Edit
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => setDeleteDialogOpen(true)}
                            className="flex items-center gap-2"
                            disabled={cannotDelete}
                        >
                            <Trash2 className="h-4 w-4" /> Delete
                        </Button>
                    </div>
                </div>

                {errors?.delete && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                        {errors.delete}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Information</CardTitle>
                                <CardDescription>
                                    Core user details
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-muted-foreground">
                                            <User className="h-4 w-4" /> Name
                                        </Label>
                                        <p className="text-lg font-semibold">
                                            {user.name}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-muted-foreground">
                                            <Mail className="h-4 w-4" /> Email
                                        </Label>
                                        <p className="text-lg font-semibold">
                                            {user.email}
                                        </p>
                                    </div>

                                    {meta?.supportsUsername && (
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2 text-muted-foreground">
                                                <Hash className="h-4 w-4" />{' '}
                                                Username
                                            </Label>
                                            <p className="text-lg font-semibold">
                                                {user.username ?? '—'}
                                            </p>
                                        </div>
                                    )}

                                    {meta?.supportsRoleColumn && (
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2 text-muted-foreground">
                                                <Shield className="h-4 w-4" />{' '}
                                                Legacy Role
                                            </Label>
                                            <UiBadge className="bg-slate-700 text-white">
                                                {user.role ?? '—'}
                                            </UiBadge>
                                        </div>
                                    )}

                                    {meta?.supportsEmailVerification && (
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2 text-muted-foreground">
                                                <Shield className="h-4 w-4" />{' '}
                                                Email Verified
                                            </Label>
                                            <UiBadge
                                                className={
                                                    user.email_verified_at
                                                        ? 'bg-emerald-600 text-white'
                                                        : 'bg-slate-700 text-white'
                                                }
                                            >
                                                {user.email_verified_at
                                                    ? 'Verified'
                                                    : 'Not Verified'}
                                            </UiBadge>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-muted-foreground">
                                            <Users className="h-4 w-4" /> Linked
                                            Employee
                                        </Label>
                                        {user.employee ? (
                                            <Button
                                                asChild
                                                variant="outline"
                                                className="justify-start"
                                            >
                                                <Link
                                                    href={`${API}/employees/${user.employee.id}`}
                                                >
                                                    {user.employee.staff_number}{' '}
                                                    — {user.employee.full_name}
                                                </Link>
                                            </Button>
                                        ) : (
                                            <p className="text-lg font-semibold">
                                                —
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 border-t pt-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-muted-foreground">
                                            <Clock className="h-4 w-4" />{' '}
                                            Created
                                        </Label>
                                        <p className="text-lg font-semibold">
                                            {formatDate(user.created_at)}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-muted-foreground">
                                            <Clock className="h-4 w-4" />{' '}
                                            Updated
                                        </Label>
                                        <p className="text-lg font-semibold">
                                            {formatDate(user.updated_at)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Assigned Roles</CardTitle>
                                <CardDescription>
                                    RBAC roles for permissions
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {(user.roles?.length ?? 0) === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        No roles assigned.
                                    </p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {user.roles.map((r: any) => (
                                            <UiBadge
                                                key={r.id}
                                                className={roleBadgeClass(
                                                    r.code,
                                                )}
                                            >
                                                {r.code}
                                            </UiBadge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="bg-muted/50">
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        User ID
                                    </span>
                                    <span className="font-mono">{user.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Roles
                                    </span>
                                    <span className="font-mono">
                                        {user.roles?.length ?? 0}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Employee linked
                                    </span>
                                    <span className="font-mono">
                                        {user.employee ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Dialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete User</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete{' '}
                                <strong>{user.name}</strong>?
                                {user.employee && (
                                    <span className="mt-2 block text-red-500">
                                        This user is linked to employee{' '}
                                        {user.employee.staff_number} and
                                        deletion will be blocked.
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
                                variant="destructive"
                                onClick={confirmDelete}
                                disabled={!!user.employee}
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