import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2, Shield, Hash, Clock } from 'lucide-react';
import moment from 'moment';
import { useMemo, useState } from 'react';
import Swal from 'sweetalert2';

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
export default function RoleShow() {
    const { role } = usePage().props as any;
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const PATHS = useMemo(
        () => ({
            index: `${API}/roles`,
            show: `${API}/roles/${role.id}`,
            edit: `${API}/roles/${role.id}/edit`,
            destroy: `${API}/roles/${role.id}`,
        }),
        [role?.id],
    );

    const cannotDelete = (role?.users_count || 0) > 0;

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

    const formatDate = (dateString?: string) => {
        if (!dateString) return '—';
        const m = moment(dateString);
        if (Number.isNaN(d.getTime())) return '—';
        return m.format('LL');
    };

    const handleDelete = () => {
        setDeleteDialogOpen(false);

        Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete role "${role.name}". This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(PATHS.destroy, {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire(
                            'Deleted!',
                            'The role has been deleted.',
                            'success',
                        );
                        router.visit(PATHS.index);
                    },
                    onError: () => {
                        Swal.fire(
                            'Error!',
                            'Failed to delete role. It may be assigned to users.',
                            'error',
                        );
                    },
                });
            }
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Roles', href: `${API}/roles` },
                { title: role.name, href: `${API}/roles/${role.id}` },
            ]}
        >
            <Head title={`${role.name}`} />

            <div className="mx-2 my-6 rounded-xl bg-background p-1 shadow-sm sm:mx-4 md:mx-8 md:p-6">
                {/* Header */}
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
                            <h1 className="text-2xl font-bold">Role Details</h1>
                            <p className="text-muted-foreground">
                                View role information and assigned users
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => router.visit(PATHS.edit)}
                            className="flex items-center gap-2"
                        >
                            <Edit className="h-4 w-4" />
                            Edit
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => setDeleteDialogOpen(true)}
                            disabled={cannotDelete}
                            className="flex items-center gap-2"
                            title={
                                cannotDelete
                                    ? 'Cannot delete: role assigned to users'
                                    : 'Delete role'
                            }
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left */}
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Role Information</CardTitle>
                                <CardDescription>
                                    Core details about this role
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-muted-foreground">
                                            <Hash className="h-4 w-4" />
                                            Role Code
                                        </Label>
                                        <UiBadge
                                            className={getRoleBadge(role.code)}
                                        >
                                            {role.code}
                                        </UiBadge>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-muted-foreground">
                                            <Shield className="h-4 w-4" />
                                            Role Name
                                        </Label>
                                        <p className="text-lg font-semibold">
                                            {role.name}
                                        </p>
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="flex items-center gap-2 text-muted-foreground">
                                            <Shield className="h-4 w-4" />
                                            Description
                                        </Label>
                                        <p className="text-lg font-semibold">
                                            {role.description || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 border-t pt-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            Created
                                        </Label>
                                        <p className="text-lg font-semibold">
                                            {formatDate(role.created_at)}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            Updated
                                        </Label>
                                        <p className="text-lg font-semibold">
                                            {formatDate(role.updated_at)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Assigned Users</CardTitle>
                                <CardDescription>
                                    Users currently assigned to this role
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {(role.users?.length ?? 0) === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        No users assigned to this role.
                                    </p>
                                ) : (
                                    role.users.map((u: any) => (
                                        <div
                                            key={u.id}
                                            className="flex items-center justify-between rounded-lg border p-3"
                                        >
                                            <div className="min-w-0">
                                                <div className="font-semibold">
                                                    {u.name}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {u.email ?? '—'}
                                                </div>
                                            </div>
                                            <UiBadge className="bg-slate-700 text-white">
                                                User #{u.id}
                                            </UiBadge>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right */}
                    <div className="space-y-6">
                        <Card className="bg-muted/50">
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Role Statistics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="rounded-lg bg-blue-50 p-4 text-center">
                                        <div className="text-2xl font-bold text-blue-800">
                                            {role.users_count || 0}
                                        </div>
                                        <div className="text-sm text-blue-600">
                                            Users
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-green-50 p-4 text-center">
                                        <div className="text-2xl font-bold text-green-800">
                                            {role.code ? 'Yes' : 'No'}
                                        </div>
                                        <div className="text-sm text-green-600">
                                            Has Code
                                        </div>
                                    </div>
                                </div>

                                {cannotDelete && (
                                    <div className="mt-3 rounded-lg bg-amber-100 p-3">
                                        <p className="text-xs text-amber-800">
                                            <strong>Note:</strong> This role is
                                            assigned to users and cannot be
                                            deleted.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-blue-200 bg-blue-50">
                            <CardHeader>
                                <CardTitle className="text-lg text-blue-800">
                                    System Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-blue-700">
                                        Role ID:
                                    </span>
                                    <span className="font-mono text-blue-800">
                                        {role.id}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Code:</span>
                                    <span className="text-blue-800">
                                        {role.code}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Delete dialog */}
                <Dialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Role</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete{' '}
                                <strong>{role.name}</strong>?
                                {cannotDelete && (
                                    <span className="mt-2 block text-red-500">
                                        This role has {role.users_count} users
                                        assigned and cannot be deleted.
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
                                onClick={handleDelete}
                                variant="destructive"
                                disabled={cannotDelete}
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

// local Label helper (matches your EmployeeShow style)
