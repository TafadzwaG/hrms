import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Clock,
    CreditCard,
    FileText,
    Pencil,
    Wrench,
} from 'lucide-react';

type AssetSummary = {
    id: number;
    asset_tag: string;
    name: string;
};

type MaintenanceRecord = {
    id: number;
    maintenance_type: string;
    title: string;
    description: string | null;
    vendor: { id: number; name: string } | null;
    performed_by: string | null;
    cost: string | null;
    currency: string | null;
    scheduled_date: string | null;
    started_at: string | null;
    completed_at: string | null;
    next_maintenance_date: string | null;
    status: string;
    notes: string | null;
    created_by: { id: number; name: string } | null;
    updated_by: { id: number; name: string } | null;
    created_at: string | null;
    updated_at: string | null;
};

function formatStatus(status: string) {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function maintenanceStatusBadgeClass(status: string) {
    switch (status) {
        case 'completed':
            return 'bg-emerald-50 text-emerald-600 border-emerald-200';
        case 'in_progress':
            return 'bg-blue-50 text-blue-600 border-blue-200';
        case 'scheduled':
            return 'bg-amber-50 text-amber-600 border-amber-200';
        case 'cancelled':
            return 'bg-red-50 text-red-600 border-red-200';
        default:
            return 'bg-gray-50 text-gray-600 border-gray-200';
    }
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
    if (!value && value !== 0) return null;
    return (
        <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium">{value}</p>
        </div>
    );
}

export default function AssetMaintenanceShow() {
    const { asset, record } = usePage<{
        asset: AssetSummary;
        record: MaintenanceRecord;
    }>().props;

    const handleStatusTransition = (newStatus: string) => {
        router.post(
            `/assets/${asset.id}/maintenance/${record.id}/transition`,
            { status: newStatus },
            { preserveScroll: true },
        );
    };

    const statusTransitions: Record<string, { label: string; target: string }[]> = {
        scheduled: [
            { label: 'Start', target: 'in_progress' },
            { label: 'Cancel', target: 'cancelled' },
        ],
        in_progress: [
            { label: 'Complete', target: 'completed' },
            { label: 'Cancel', target: 'cancelled' },
        ],
        completed: [],
        cancelled: [{ label: 'Reschedule', target: 'scheduled' }],
    };

    const availableTransitions = statusTransitions[record.status] ?? [];

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Assets', href: '/assets' },
                { title: asset.name, href: `/assets/${asset.id}` },
                { title: 'Maintenance', href: `/assets/${asset.id}` },
                { title: record.title, href: '#' },
            ]}
        >
            <Head title={`Maintenance - ${record.title}`} />

            <div className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={`/assets/${asset.id}`}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight">
                                    {record.title}
                                </h1>
                                <Badge
                                    variant="outline"
                                    className={maintenanceStatusBadgeClass(record.status)}
                                >
                                    {formatStatus(record.status)}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {asset.asset_tag} &middot; {asset.name}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {availableTransitions.map((t) => (
                            <Button
                                key={t.target}
                                variant="outline"
                                onClick={() => handleStatusTransition(t.target)}
                            >
                                {t.label}
                            </Button>
                        ))}
                        <Link href={`/assets/${asset.id}/maintenance/${record.id}/edit`}>
                            <Button variant="outline">
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Details */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Maintenance Details */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <Wrench className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg">Maintenance Details</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <DetailRow label="Title" value={record.title} />
                            <DetailRow label="Type" value={formatStatus(record.maintenance_type)} />
                            <DetailRow label="Vendor" value={record.vendor?.name} />
                            <DetailRow label="Performed By" value={record.performed_by} />
                            {record.description && (
                                <div className="sm:col-span-2">
                                    <DetailRow label="Description" value={record.description} />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Cost */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg">Cost</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <DetailRow
                                label="Cost"
                                value={
                                    record.cost
                                        ? `${record.currency ?? ''} ${Number(record.cost).toLocaleString()}`
                                        : null
                                }
                            />
                        </CardContent>
                    </Card>

                    {/* Schedule */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg">Schedule</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <DetailRow label="Scheduled Date" value={record.scheduled_date} />
                            <DetailRow
                                label="Started At"
                                value={record.started_at ? record.started_at.substring(0, 16).replace('T', ' ') : null}
                            />
                            <DetailRow
                                label="Completed At"
                                value={record.completed_at ? record.completed_at.substring(0, 16).replace('T', ' ') : null}
                            />
                            <DetailRow label="Next Maintenance" value={record.next_maintenance_date} />
                        </CardContent>
                    </Card>

                    {/* Notes */}
                    {record.notes && (
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-lg">Notes</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">{record.notes}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Audit Info */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            <CardTitle className="text-lg">Audit Information</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <DetailRow
                            label="Created At"
                            value={record.created_at ? record.created_at.substring(0, 10) : null}
                        />
                        <DetailRow label="Created By" value={record.created_by?.name} />
                        <DetailRow
                            label="Updated At"
                            value={record.updated_at ? record.updated_at.substring(0, 10) : null}
                        />
                        <DetailRow label="Updated By" value={record.updated_by?.name} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
