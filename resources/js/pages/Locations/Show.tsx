import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Edit,
    Trash2,
    MapPin,
    Globe,
    Clock,
    Hash,
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
export default function LocationShow() {
    const { location } = usePage().props as any;
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const PATHS = useMemo(
        () => ({
            index: `${API}/locations`,
            show: `${API}/locations/${location.id}`,
            edit: `${API}/locations/${location.id}/edit`,
            destroy: `${API}/locations/${location.id}`,
        }),
        [location?.id],
    );

    const linkedOrgUnits = location?.org_units ?? [];
    const cannotDelete =
        (location?.org_units_count || linkedOrgUnits.length || 0) > 0;

    const handleDelete = () => {
        setDeleteDialogOpen(false);

        Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete location "${location.name}". This action cannot be undone.`,
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
                            'The location has been deleted.',
                            'success',
                        );
                        router.visit(PATHS.index);
                    },
                    onError: () => {
                        Swal.fire(
                            'Error!',
                            'Failed to delete location. It may have linked org units.',
                            'error',
                        );
                    },
                });
            }
        });
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '—';
        const m = moment(dateString);
        if (Number.isNaN(d.getTime())) return '—';
        return m.format('LL');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Locations', href: `${API}/locations` },
                {
                    title: location.name,
                    href: `${API}/locations/${location.id}`,
                },
            ]}
        >
            <Head title={`${location.name}`} />

            <div className="mx-2 my-6 rounded-xl bg-background p-1 shadow-sm sm:mx-4 md:mx-8 md:p-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => router.visit(`${API}/locations`)}
                            className="h-8 w-8"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">
                                Location Details
                            </h1>
                            <p className="text-muted-foreground">
                                View complete information for {location.name}
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
                                    ? 'Cannot delete: location linked to org units'
                                    : 'Delete location'
                            }
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Main content */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left */}
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Location Information</CardTitle>
                                <CardDescription>
                                    Basic details and address
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-muted-foreground">
                                            <Hash className="h-4 w-4" />
                                            Location ID
                                        </Label>
                                        <p className="font-mono text-lg font-semibold">
                                            {location.id}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            Timezone
                                        </Label>
                                        <UiBadge className="bg-indigo-600 text-white">
                                            {location.timezone ?? '—'}
                                        </UiBadge>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-muted-foreground">
                                            <Globe className="h-4 w-4" />
                                            Country
                                        </Label>
                                        <UiBadge className="bg-emerald-600 text-white">
                                            {location.country ?? '—'}
                                        </UiBadge>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-muted-foreground">
                                            <MapPin className="h-4 w-4" />
                                            City
                                        </Label>
                                        <p className="text-lg font-semibold">
                                            {location.city ?? '—'}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <Label className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        Address
                                    </Label>
                                    <p className="mt-2 text-lg font-semibold">
                                        {[
                                            location.address_line1,
                                            location.address_line2,
                                            location.city,
                                            location.country,
                                        ]
                                            .filter(Boolean)
                                            .join(', ') || 'N/A'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-6 border-t pt-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-muted-foreground">
                                            <MapPin className="h-4 w-4" />
                                            GPS
                                        </Label>
                                        <p className="text-lg font-semibold">
                                            {location.latitude &&
                                            location.longitude
                                                ? `${location.latitude}, ${location.longitude}`
                                                : '—'}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-muted-foreground">
                                            <Hash className="h-4 w-4" />
                                            Postal Code
                                        </Label>
                                        <p className="text-lg font-semibold">
                                            {location.postal_code ?? '—'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Linked Org Units (optional) */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Linked Org Units</CardTitle>
                                <CardDescription>
                                    Org units associated with this location
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {(linkedOrgUnits?.length ?? 0) === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        No linked org units.
                                    </p>
                                ) : (
                                    linkedOrgUnits.map((ou: any) => (
                                        <div
                                            key={ou.id}
                                            className="flex items-center justify-between rounded-lg border p-3"
                                        >
                                            <div className="min-w-0">
                                                <div className="font-semibold">
                                                    {ou.name}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {ou.type}
                                                </div>
                                            </div>
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                                className="gap-2"
                                            >
                                                <Link
                                                    href={`${API}/org-units/${ou.id}`}
                                                >
                                                    <Building2 className="h-4 w-4" />
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
                                    Location Statistics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="rounded-lg bg-blue-50 p-4 text-center">
                                        <div className="text-2xl font-bold text-blue-800">
                                            {location.org_units_count ??
                                                linkedOrgUnits.length ??
                                                0}
                                        </div>
                                        <div className="text-sm text-blue-600">
                                            Linked Org Units
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-green-50 p-4 text-center">
                                        <div className="text-2xl font-bold text-green-800">
                                            {location.timezone ? 'Yes' : 'No'}
                                        </div>
                                        <div className="text-sm text-green-600">
                                            Has Timezone
                                        </div>
                                    </div>
                                </div>

                                {cannotDelete && (
                                    <div className="mt-3 rounded-lg bg-amber-100 p-3">
                                        <p className="text-xs text-amber-800">
                                            <strong>Note:</strong> This location
                                            is linked to org units and cannot be
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
                                        Location ID:
                                    </span>
                                    <span className="font-mono text-blue-800">
                                        {location.id}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-700">
                                        Created:
                                    </span>
                                    <span className="text-blue-800">
                                        {formatDate(location.created_at)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-700">
                                        Last Updated:
                                    </span>
                                    <span className="text-blue-800">
                                        {formatDate(location.updated_at)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Delete confirmation dialog */}
                <Dialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Location</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete{' '}
                                <strong>{location.name}</strong>?
                                {cannotDelete && (
                                    <span className="mt-2 block text-red-500">
                                        This location has linked org units and
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

// local Label helper (matches your EmployeeShow style)
