import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Edit,
    Trash2,
    Briefcase,
    Hash,
    Users,
    Clock,
    Building2,
} from 'lucide-react';
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
export default function PositionShow() {
    const { position, errors } = usePage().props as any;
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const PATHS = useMemo(
        () => ({
            index: `${API}/positions`,
            show: `${API}/positions/${position.id}`,
            edit: `${API}/positions/${position.id}/edit`,
            destroy: `${API}/positions/${position.id}`,
        }),
        [position?.id],
    );

    const cannotDelete = (position?.employees_count || 0) > 0;

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
            text: `You are about to delete position "${position.name}". This action cannot be undone.`,
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
                            'The position has been deleted.',
                            'success',
                        );
                        router.visit(PATHS.index);
                    },
                    onError: () => {
                        Swal.fire(
                            'Error!',
                            'Failed to delete position. It may be assigned to employees.',
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
                { title: 'Positions', href: `${API}/positions` },
                {
                    title: position.name,
                    href: `${API}/positions/${position.id}`,
                },
            ]}
        >
            <Head title={`${position.name}`} />

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
                            <h1 className="text-2xl font-bold">
                                Position Details
                            </h1>
                            <p className="text-muted-foreground">
                                View position info and assigned employees
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
                                    ? 'Cannot delete: assigned to employees'
                                    : 'Delete position'
                            }
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                {errors?.delete && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                        {errors.delete}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left */}
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Position Information</CardTitle>
                                <CardDescription>
                                    Core details about this position
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-muted-foreground">
                                            <Briefcase className="h-4 w-4" />
                                            Name
                                        </Label>
                                        <p className="text-lg font-semibold">
                                            {position.name}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-muted-foreground">
                                            <Hash className="h-4 w-4" />
                                            Code
                                        </Label>
                                        <p className="text-lg font-semibold">
                                            {position.code ?? 'N/A'}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-muted-foreground">
                                            <Building2 className="h-4 w-4" />
                                            Department
                                        </Label>
                                        {position.org_unit ? (
                                            <Button
                                                asChild
                                                variant="outline"
                                                className="justify-start"
                                            >
                                                <Link
                                                    href={`${API}/org-units/${position.org_unit.id}`}
                                                >
                                                    {position.org_unit.name} (
                                                    {position.org_unit.type})
                                                </Link>
                                            </Button>
                                        ) : (
                                            <p className="text-lg font-semibold">
                                                —
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-muted-foreground">
                                            <Users className="h-4 w-4" />
                                            Employees
                                        </Label>
                                        <UiBadge className="bg-slate-700 text-white">
                                            {position.employees_count ?? 0}
                                        </UiBadge>
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="flex items-center gap-2 text-muted-foreground">
                                            <Hash className="h-4 w-4" />
                                            Description
                                        </Label>
                                        <p className="text-lg font-semibold">
                                            {position.description ?? 'N/A'}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">
                                            Status
                                        </Label>
                                        <UiBadge
                                            className={
                                                position.is_active
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-slate-700 text-white'
                                            }
                                        >
                                            {position.is_active
                                                ? 'Active'
                                                : 'Inactive'}
                                        </UiBadge>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 border-t pt-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            Created
                                        </Label>
                                        <p className="text-lg font-semibold">
                                            {formatDate(position.created_at)}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            Updated
                                        </Label>
                                        <p className="text-lg font-semibold">
                                            {formatDate(position.updated_at)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Assigned Employees (Preview)
                                </CardTitle>
                                <CardDescription>
                                    Showing up to 20 employees
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {(position.employees?.length ?? 0) === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        No employees assigned.
                                    </p>
                                ) : (
                                    position.employees.map((e: any) => (
                                        <div
                                            key={e.id}
                                            className="flex items-center justify-between rounded-lg border p-3"
                                        >
                                            <div className="min-w-0">
                                                <div className="font-semibold">
                                                    {e.full_name}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    Staff #:{' '}
                                                    {e.staff_number ?? '—'}
                                                </div>
                                            </div>
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                            >
                                                <Link
                                                    href={`${API}/employees/${e.id}`}
                                                >
                                                    Open
                                                </Link>
                                            </Button>
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
                                    Position Statistics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="rounded-lg bg-blue-50 p-4 text-center">
                                        <div className="text-2xl font-bold text-blue-800">
                                            {position.employees_count ?? 0}
                                        </div>
                                        <div className="text-sm text-blue-600">
                                            Employees
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-green-50 p-4 text-center">
                                        <div className="text-2xl font-bold text-green-800">
                                            {position.is_active ? 'Yes' : 'No'}
                                        </div>
                                        <div className="text-sm text-green-600">
                                            Active
                                        </div>
                                    </div>
                                </div>

                                {cannotDelete && (
                                    <div className="mt-3 rounded-lg bg-amber-100 p-3">
                                        <p className="text-xs text-amber-800">
                                            <strong>Note:</strong> This position
                                            is assigned to employees and cannot
                                            be deleted.
                                        </p>
                                    </div>
                                )}
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
                            <DialogTitle>Delete Position</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete{' '}
                                <strong>{position.name}</strong>?
                                {cannotDelete && (
                                    <span className="mt-2 block text-red-500">
                                        This position has{' '}
                                        {position.employees_count} employees and
                                        cannot be deleted.
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
