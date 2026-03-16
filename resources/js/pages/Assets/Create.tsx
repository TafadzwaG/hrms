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
import { ArrowLeft, Save } from 'lucide-react';
import type { FormEvent } from 'react';

type AssetOptions = {
    categories: { id: number; name: string }[];
    vendors: { id: number; name: string }[];
    locations: { id: number; name: string }[];
    statuses: string[];
    conditions: string[];
    depreciation_methods: string[];
    currencies: string[];
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

export default function AssetCreate() {
    const { options } = usePage<{ options: AssetOptions }>().props;

    const { data, setData, errors, post, processing } = useForm({
        asset_tag: '',
        name: '',
        asset_category_id: '',
        serial_number: '',
        description: '',
        purchase_date: '',
        purchase_price: '',
        currency: '',
        asset_vendor_id: '',
        warranty_expiry_date: '',
        warranty_notes: '',
        depreciation_method: '',
        useful_life_years: '',
        depreciation_rate: '',
        salvage_value: '',
        book_value: '',
        asset_location_id: '',
        status: 'available',
        condition: 'new',
        barcode: '',
        notes: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/assets', { preserveScroll: true });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Assets', href: '/assets' },
                { title: 'New Asset', href: '#' },
            ]}
        >
            <Head title="New Asset" />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <Link href="/assets">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">New Asset</h1>
                        <p className="text-sm text-muted-foreground">
                            Register a new asset in the system.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <FieldLabel required>Asset Tag</FieldLabel>
                                <Input
                                    value={data.asset_tag}
                                    onChange={(e) => setData('asset_tag', e.target.value)}
                                    placeholder="e.g. AST-001"
                                />
                                <FieldError message={errors.asset_tag} />
                            </div>
                            <div>
                                <FieldLabel required>Name</FieldLabel>
                                <Input
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Dell Latitude 5520"
                                />
                                <FieldError message={errors.name} />
                            </div>
                            <div>
                                <FieldLabel required>Category</FieldLabel>
                                <Select
                                    value={data.asset_category_id}
                                    onValueChange={(v) => setData('asset_category_id', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options.categories.map((c) => (
                                            <SelectItem key={c.id} value={String(c.id)}>
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError message={errors.asset_category_id} />
                            </div>
                            <div>
                                <FieldLabel>Serial Number</FieldLabel>
                                <Input
                                    value={data.serial_number}
                                    onChange={(e) => setData('serial_number', e.target.value)}
                                    placeholder="e.g. SN-123456"
                                />
                                <FieldError message={errors.serial_number} />
                            </div>
                            <div className="sm:col-span-2">
                                <FieldLabel>Description</FieldLabel>
                                <Textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    placeholder="Brief description of the asset..."
                                />
                                <FieldError message={errors.description} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Purchase & Warranty */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Purchase &amp; Warranty</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <FieldLabel>Purchase Date</FieldLabel>
                                <Input
                                    type="date"
                                    value={data.purchase_date}
                                    onChange={(e) => setData('purchase_date', e.target.value)}
                                />
                                <FieldError message={errors.purchase_date} />
                            </div>
                            <div>
                                <FieldLabel>Purchase Price</FieldLabel>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.purchase_price}
                                    onChange={(e) => setData('purchase_price', e.target.value)}
                                />
                                <FieldError message={errors.purchase_price} />
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
                            <div>
                                <FieldLabel>Vendor</FieldLabel>
                                <Select
                                    value={data.asset_vendor_id}
                                    onValueChange={(v) => setData('asset_vendor_id', v)}
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
                                <FieldError message={errors.asset_vendor_id} />
                            </div>
                            <div>
                                <FieldLabel>Warranty Expiry Date</FieldLabel>
                                <Input
                                    type="date"
                                    value={data.warranty_expiry_date}
                                    onChange={(e) => setData('warranty_expiry_date', e.target.value)}
                                />
                                <FieldError message={errors.warranty_expiry_date} />
                            </div>
                            <div>
                                <FieldLabel>Warranty Notes</FieldLabel>
                                <Input
                                    value={data.warranty_notes}
                                    onChange={(e) => setData('warranty_notes', e.target.value)}
                                    placeholder="Warranty details..."
                                />
                                <FieldError message={errors.warranty_notes} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Depreciation */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Depreciation</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <FieldLabel>Depreciation Method</FieldLabel>
                                <Select
                                    value={data.depreciation_method}
                                    onValueChange={(v) => setData('depreciation_method', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options.depreciation_methods.map((m) => (
                                            <SelectItem key={m} value={m}>
                                                {formatLabel(m)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError message={errors.depreciation_method} />
                            </div>
                            <div>
                                <FieldLabel>Useful Life (Years)</FieldLabel>
                                <Input
                                    type="number"
                                    min="0"
                                    value={data.useful_life_years}
                                    onChange={(e) => setData('useful_life_years', e.target.value)}
                                />
                                <FieldError message={errors.useful_life_years} />
                            </div>
                            <div>
                                <FieldLabel>Depreciation Rate (%)</FieldLabel>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={data.depreciation_rate}
                                    onChange={(e) => setData('depreciation_rate', e.target.value)}
                                />
                                <FieldError message={errors.depreciation_rate} />
                            </div>
                            <div>
                                <FieldLabel>Salvage Value</FieldLabel>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.salvage_value}
                                    onChange={(e) => setData('salvage_value', e.target.value)}
                                />
                                <FieldError message={errors.salvage_value} />
                            </div>
                            <div>
                                <FieldLabel>Book Value</FieldLabel>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.book_value}
                                    onChange={(e) => setData('book_value', e.target.value)}
                                />
                                <FieldError message={errors.book_value} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Location & Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Location &amp; Status</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <FieldLabel>Location</FieldLabel>
                                <Select
                                    value={data.asset_location_id}
                                    onValueChange={(v) => setData('asset_location_id', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options.locations.map((l) => (
                                            <SelectItem key={l.id} value={String(l.id)}>
                                                {l.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError message={errors.asset_location_id} />
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
                                <FieldLabel required>Condition</FieldLabel>
                                <Select
                                    value={data.condition}
                                    onValueChange={(v) => setData('condition', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select condition" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options.conditions.map((c) => (
                                            <SelectItem key={c} value={c}>
                                                {formatLabel(c)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError message={errors.condition} />
                            </div>
                            <div>
                                <FieldLabel>Barcode</FieldLabel>
                                <Input
                                    value={data.barcode}
                                    onChange={(e) => setData('barcode', e.target.value)}
                                    placeholder="Barcode or QR code value"
                                />
                                <FieldError message={errors.barcode} />
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
                                placeholder="Any additional notes..."
                            />
                            <FieldError message={errors.notes} />
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex items-center justify-end gap-3">
                        <Link href="/assets">
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Saving...' : 'Save Asset'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
