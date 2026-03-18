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
import {
    ArrowLeft,
    Save,
    Box,
    Receipt,
    MapPin,
    BarChart3,
    Notebook,
    ScanBarcode,
    Loader2,
} from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';

type AssetOptions = {
    categories: { id: number; name: string }[];
    vendors: { id: number; name: string }[];
    locations: { id: number; name: string }[];
    statuses: string[];
    conditions: string[];
    depreciation_methods: string[];
    currencies: string[];
};

type AssetPayload = {
    id: number;
    asset_tag: string;
    name: string;
    asset_category_id: number | null;
    serial_number: string | null;
    description: string | null;
    purchase_date: string | null;
    purchase_price: string | null;
    currency: string | null;
    asset_vendor_id: number | null;
    warranty_expiry_date: string | null;
    warranty_notes: string | null;
    depreciation_method: string | null;
    useful_life_years: number | null;
    depreciation_rate: string | null;
    salvage_value: string | null;
    book_value: string | null;
    asset_location_id: number | null;
    status: string;
    condition: string;
    barcode: string | null;
    notes: string | null;
};

function FieldLabel({
    children,
    required,
}: {
    children: ReactNode;
    required?: boolean;
}) {
    return (
        <label className="mb-2 block text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {children}
            {required && <span className="ml-1 text-destructive">*</span>}
        </label>
    );
}

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return (
        <p className="mt-1.5 text-sm font-medium text-destructive">{message}</p>
    );
}

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AssetEdit() {
    const { asset, options } = usePage<{
        asset: AssetPayload;
        options: AssetOptions;
    }>().props;

    const { data, setData, put, processing, errors } = useForm({
        asset_tag: asset.asset_tag ?? '',
        name: asset.name ?? '',
        asset_category_id: asset.asset_category_id
            ? String(asset.asset_category_id)
            : '',
        serial_number: asset.serial_number ?? '',
        description: asset.description ?? '',
        purchase_date: asset.purchase_date ?? '',
        purchase_price: asset.purchase_price ?? '',
        currency: asset.currency ?? options.currencies[0] ?? 'USD',
        asset_vendor_id: asset.asset_vendor_id
            ? String(asset.asset_vendor_id)
            : '',
        warranty_expiry_date: asset.warranty_expiry_date ?? '',
        warranty_notes: asset.warranty_notes ?? '',
        depreciation_method:
            asset.depreciation_method ??
            options.depreciation_methods[0] ??
            'straight_line',
        useful_life_years: asset.useful_life_years
            ? String(asset.useful_life_years)
            : '',
        depreciation_rate: asset.depreciation_rate ?? '',
        salvage_value: asset.salvage_value ?? '',
        book_value: asset.book_value ?? '',
        asset_location_id: asset.asset_location_id
            ? String(asset.asset_location_id)
            : '',
        status: asset.status ?? options.statuses[0] ?? 'available',
        condition: asset.condition ?? options.conditions[0] ?? 'new',
        barcode: asset.barcode ?? '',
        notes: asset.notes ?? '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/assets/${asset.id}`, { preserveScroll: true });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Assets', href: '/assets' },
                { title: asset.name, href: `/assets/${asset.id}` },
                { title: 'Edit Asset', href: '#' },
            ]}
        >
            <Head title={`Edit Asset: ${asset.name}`} />

            <div className="w-full space-y-6 p-6 lg:p-10">
                <div className="flex items-center justify-between border-b pb-6">
                    <div className="flex items-center gap-4">
                        <Link href={`/assets/${asset.id}`}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full border"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                Edit Asset
                            </h1>
                            <p className="text-muted-foreground">
                                Update asset details for{' '}
                                <span className="font-medium text-foreground">
                                    {asset.asset_tag}
                                </span>
                                .
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href={`/assets/${asset.id}`}>
                            <Button
                                variant="outline"
                                type="button"
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            form="asset-edit-form"
                            disabled={processing}
                            className="shadow-sm"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <form
                    id="asset-edit-form"
                    onSubmit={handleSubmit}
                    className="space-y-8"
                >
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        <div className="space-y-6 lg:col-span-7">
                            <Card className="shadow-sm">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Box className="h-5 w-5 text-muted-foreground" />
                                        Basic Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
                                    <div className="space-y-1">
                                        <FieldLabel required>
                                            Asset Tag
                                        </FieldLabel>
                                        <Input
                                            value={data.asset_tag}
                                            onChange={(e) =>
                                                setData(
                                                    'asset_tag',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="AST-001"
                                        />
                                        <FieldError
                                            message={errors.asset_tag}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <FieldLabel required>
                                            Asset Name
                                        </FieldLabel>
                                        <Input
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            placeholder="e.g. Dell Latitude 5520"
                                        />
                                        <FieldError message={errors.name} />
                                    </div>
                                    <div className="space-y-1">
                                        <FieldLabel required>
                                            Category
                                        </FieldLabel>
                                        <Select
                                            value={data.asset_category_id}
                                            onValueChange={(v) =>
                                                setData('asset_category_id', v)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {options.categories.map((c) => (
                                                    <SelectItem
                                                        key={c.id}
                                                        value={String(c.id)}
                                                    >
                                                        {c.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FieldError
                                            message={errors.asset_category_id}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <FieldLabel>Serial Number</FieldLabel>
                                        <Input
                                            value={data.serial_number}
                                            onChange={(e) =>
                                                setData(
                                                    'serial_number',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="SN-123456"
                                        />
                                        <FieldError
                                            message={errors.serial_number}
                                        />
                                    </div>
                                    <div className="space-y-1 sm:col-span-2">
                                        <FieldLabel>Description</FieldLabel>
                                        <Textarea
                                            rows={4}
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Asset specifications or details..."
                                        />
                                        <FieldError
                                            message={errors.description}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Receipt className="h-5 w-5 text-muted-foreground" />
                                        Purchase & Warranty
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
                                    <div className="space-y-1">
                                        <FieldLabel>Purchase Date</FieldLabel>
                                        <Input
                                            type="date"
                                            value={data.purchase_date}
                                            onChange={(e) =>
                                                setData(
                                                    'purchase_date',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <FieldError
                                            message={errors.purchase_date}
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="col-span-2 space-y-1">
                                            <FieldLabel>Price</FieldLabel>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={data.purchase_price}
                                                onChange={(e) =>
                                                    setData(
                                                        'purchase_price',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="0.00"
                                            />
                                            <FieldError
                                                message={errors.purchase_price}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <FieldLabel>Currency</FieldLabel>
                                            <Select
                                                value={data.currency}
                                                onValueChange={(v) =>
                                                    setData('currency', v)
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {options.currencies.map(
                                                        (c) => (
                                                            <SelectItem
                                                                key={c}
                                                                value={c}
                                                            >
                                                                {c}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FieldError
                                                message={errors.currency}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <FieldLabel>Vendor</FieldLabel>
                                        <Select
                                            value={data.asset_vendor_id}
                                            onValueChange={(v) =>
                                                setData('asset_vendor_id', v)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select vendor" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {options.vendors.map((v) => (
                                                    <SelectItem
                                                        key={v.id}
                                                        value={String(v.id)}
                                                    >
                                                        {v.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FieldError
                                            message={errors.asset_vendor_id}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <FieldLabel>Warranty Expiry</FieldLabel>
                                        <Input
                                            type="date"
                                            value={data.warranty_expiry_date}
                                            onChange={(e) =>
                                                setData(
                                                    'warranty_expiry_date',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <FieldError
                                            message={
                                                errors.warranty_expiry_date
                                            }
                                        />
                                    </div>
                                    <div className="space-y-1 sm:col-span-2">
                                        <FieldLabel>Warranty Notes</FieldLabel>
                                        <Textarea
                                            rows={2}
                                            value={data.warranty_notes}
                                            onChange={(e) =>
                                                setData(
                                                    'warranty_notes',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <FieldError
                                            message={errors.warranty_notes}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6 lg:col-span-5">
                            <Card className="shadow-sm">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <MapPin className="h-5 w-5 text-muted-foreground" />
                                        Location & Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-6 p-6">
                                    <div className="space-y-1">
                                        <FieldLabel>Location</FieldLabel>
                                        <Select
                                            value={data.asset_location_id}
                                            onValueChange={(v) =>
                                                setData('asset_location_id', v)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select location" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {options.locations.map((l) => (
                                                    <SelectItem
                                                        key={l.id}
                                                        value={String(l.id)}
                                                    >
                                                        {l.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FieldError
                                            message={errors.asset_location_id}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <FieldLabel required>
                                                Status
                                            </FieldLabel>
                                            <Select
                                                value={data.status}
                                                onValueChange={(v) =>
                                                    setData('status', v)
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {options.statuses.map(
                                                        (s) => (
                                                            <SelectItem
                                                                key={s}
                                                                value={s}
                                                            >
                                                                {formatLabel(s)}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FieldError
                                                message={errors.status}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <FieldLabel required>
                                                Condition
                                            </FieldLabel>
                                            <Select
                                                value={data.condition}
                                                onValueChange={(v) =>
                                                    setData('condition', v)
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {options.conditions.map(
                                                        (c) => (
                                                            <SelectItem
                                                                key={c}
                                                                value={c}
                                                            >
                                                                {formatLabel(c)}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FieldError
                                                message={errors.condition}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <FieldLabel>
                                            Barcode / QR Code
                                        </FieldLabel>
                                        <div className="relative">
                                            <Input
                                                value={data.barcode}
                                                onChange={(e) =>
                                                    setData(
                                                        'barcode',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Scan or enter"
                                                className="pr-10"
                                            />
                                            <ScanBarcode className="absolute top-2.5 right-3 h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <FieldError message={errors.barcode} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <BarChart3 className="h-5 w-5 text-muted-foreground" />
                                        Depreciation
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
                                    <div className="space-y-1 sm:col-span-2">
                                        <FieldLabel>Method</FieldLabel>
                                        <Select
                                            value={data.depreciation_method}
                                            onValueChange={(v) =>
                                                setData(
                                                    'depreciation_method',
                                                    v,
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {options.depreciation_methods.map(
                                                    (m) => (
                                                        <SelectItem
                                                            key={m}
                                                            value={m}
                                                        >
                                                            {formatLabel(m)}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FieldError
                                            message={errors.depreciation_method}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <FieldLabel>Life (Years)</FieldLabel>
                                        <Input
                                            type="number"
                                            value={data.useful_life_years}
                                            onChange={(e) =>
                                                setData(
                                                    'useful_life_years',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="0"
                                        />
                                        <FieldError
                                            message={errors.useful_life_years}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <FieldLabel>Rate %</FieldLabel>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={data.depreciation_rate}
                                            onChange={(e) =>
                                                setData(
                                                    'depreciation_rate',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="0.00"
                                        />
                                        <FieldError
                                            message={errors.depreciation_rate}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <FieldLabel>Salvage Value</FieldLabel>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={data.salvage_value}
                                            onChange={(e) =>
                                                setData(
                                                    'salvage_value',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="0.00"
                                        />
                                        <FieldError
                                            message={errors.salvage_value}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <FieldLabel>Book Value</FieldLabel>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={data.book_value}
                                            onChange={(e) =>
                                                setData(
                                                    'book_value',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="0.00"
                                        />
                                        <FieldError
                                            message={errors.book_value}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Notebook className="h-5 w-5 text-muted-foreground" />
                                        Internal Notes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <Textarea
                                        rows={6}
                                        value={data.notes}
                                        onChange={(e) =>
                                            setData('notes', e.target.value)
                                        }
                                        placeholder="Administrative notes..."
                                    />
                                    <FieldError message={errors.notes} />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
