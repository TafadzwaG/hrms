import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save, X } from 'lucide-react';
import type { FormEvent } from 'react';

type AssetSummary = {
    id: number;
    asset_tag: string;
    name: string;
};

type MaintenanceOptions = {
    types: string[];
    statuses: string[];
    vendors: { id: number; name: string }[];
    currencies: string[];
};

type MaintenanceRecord = {
    id: number;
    maintenance_type: string;
    title: string;
    description: string | null;
    vendor_id: number | null;
    performed_by: string | null;
    cost: string | null;
    currency: string | null;
    scheduled_date: string | null;
    started_at: string | null;
    completed_at: string | null;
    next_maintenance_date: string | null;
    status: string;
    notes: string | null;
};

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
        <label className="mb-2 block text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {children}
            {required && <span className="ml-1 text-destructive">*</span>}
        </label>
    );
}

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="mt-1.5 text-sm font-medium text-destructive">{message}</p>;
}

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AssetMaintenanceEdit() {
    const { asset, record, options } = usePage<{
        asset: AssetSummary;
        record: MaintenanceRecord;
        options: MaintenanceOptions;
    }>().props;

    const { data, setData, errors, put, processing } = useForm({
        maintenance_type: record.maintenance_type ?? '',
        title: record.title ?? '',
        description: record.description ?? '',
        vendor_id: record.vendor_id ? String(record.vendor_id) : '',
        performed_by: record.performed_by ?? '',
        cost: record.cost ?? '',
        currency: record.currency ?? '',
        scheduled_date: record.scheduled_date ?? '',
        started_at: record.started_at ?? '',
        completed_at: record.completed_at ?? '',
        next_maintenance_date: record.next_maintenance_date ?? '',
        status: record.status ?? 'scheduled',
        notes: record.notes ?? '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/assets/${asset.id}/maintenance/${record.id}`, { preserveScroll: true });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Assets', href: '/assets' },
                { title: asset.name, href: `/assets/${asset.id}` },
                { title: 'Maintenance', href: `/assets/${asset.id}` },
                { title: 'Edit', href: '#' },
            ]}
        >
            <Head title={`Edit Maintenance - ${asset.name}`} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <Link href={`/assets/${asset.id}/maintenance/${record.id}`}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Maintenance Record</h1>
                        <p className="text-sm text-muted-foreground">
                            {asset.asset_tag} &middot; {record.title}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Maintenance Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <FieldLabel required>Maintenance Type</FieldLabel>
                                <Select
                                    value={data.maintenance_type}
                                    onValueChange={(v) => setData('maintenance_type', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options.types.map((t) => (
                                            <SelectItem key={t} value={t}>
                                                {formatLabel(t)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError message={errors.maintenance_type} />
                            </div>
                            <div>
                                <FieldLabel required>Title</FieldLabel>
                                <Input
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                />
                                <FieldError message={errors.title} />
                            </div>
                            <div className="sm:col-span-2">
                                <FieldLabel>Description</FieldLabel>
                                <Textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                />
                                <FieldError message={errors.description} />
                            </div>
                            <div>
                                <FieldLabel required>Status</FieldLabel>
                                <Select
                                    value={data.status}
                                    onValueChange={(v) => setData('status', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options.statuses.map((s) => (
                                            <SelectItem key={s} value={s}>
                                                {formatLabel(s)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError message={errors.status} />
                            </div>
                            <div>
                                <FieldLabel>Vendor</FieldLabel>
                                <Select
                                    value={data.vendor_id}
                                    onValueChange={(v) => setData('vendor_id', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select vendor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options.vendors.map((v) => (
                                            <SelectItem key={v.id} value={String(v.id)}>
                                                {v.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError message={errors.vendor_id} />
                            </div>
                            <div>
                                <FieldLabel>Performed By</FieldLabel>
                                <Input
                                    value={data.performed_by}
                                    onChange={(e) => setData('performed_by', e.target.value)}
                                />
                                <FieldError message={errors.performed_by} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Cost */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Cost</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <FieldLabel>Cost</FieldLabel>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.cost}
                                    onChange={(e) => setData('cost', e.target.value)}
                                />
                                <FieldError message={errors.cost} />
                            </div>
                            <div>
                                <FieldLabel>Currency</FieldLabel>
                                <Select
                                    value={data.currency}
                                    onValueChange={(v) => setData('currency', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options.currencies.map((c) => (
                                            <SelectItem key={c} value={c}>
                                                {c}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError message={errors.currency} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dates */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Schedule</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <FieldLabel>Scheduled Date</FieldLabel>
                                <Input
                                    type="date"
                                    value={data.scheduled_date}
                                    onChange={(e) => setData('scheduled_date', e.target.value)}
                                />
                                <FieldError message={errors.scheduled_date} />
                            </div>
                            <div>
                                <FieldLabel>Started At</FieldLabel>
                                <Input
                                    type="datetime-local"
                                    value={data.started_at}
                                    onChange={(e) => setData('started_at', e.target.value)}
                                />
                                <FieldError message={errors.started_at} />
                            </div>
                            <div>
                                <FieldLabel>Completed At</FieldLabel>
                                <Input
                                    type="datetime-local"
                                    value={data.completed_at}
                                    onChange={(e) => setData('completed_at', e.target.value)}
                                />
                                <FieldError message={errors.completed_at} />
                            </div>
                            <div>
                                <FieldLabel>Next Maintenance Date</FieldLabel>
                                <Input
                                    type="date"
                                    value={data.next_maintenance_date}
                                    onChange={(e) => setData('next_maintenance_date', e.target.value)}
                                />
                                <FieldError message={errors.next_maintenance_date} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                rows={4}
                            />
                            <FieldError message={errors.notes} />
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex items-center justify-end gap-3">
                        <Link href={`/assets/${asset.id}/maintenance/${record.id}`}>
                            <Button variant="outline" type="button">
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Saving...' : 'Update Record'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
