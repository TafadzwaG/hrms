import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRightLeft,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Download,
    FileImage,
    FileText,
    HardDriveUpload,
    Info,
    MapPin,
    NotebookText,
    Package2,
    Pencil,
    Plus,
    Receipt,
    ShieldCheck,
    Trash2,
    Undo2,
    Upload,
    UserRound,
    Wrench,
    XCircle,
} from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import { useMemo, useState } from 'react';

type EmployeeOption = { id: number; full_name: string; staff_number: string };

type AssignmentRecord = {
    id: number;
    employee: { id: number; full_name: string; staff_number: string };
    assigned_at: string | null;
    expected_return_date: string | null;
    returned_at: string | null;
    condition_on_assignment: string | null;
    condition_on_return: string | null;
    notes: string | null;
    return_notes: string | null;
};

type MaintenanceRecord = {
    id: number;
    title: string;
    maintenance_type: string;
    status: string;
    scheduled_date: string | null;
    completed_at: string | null;
    cost: string | null;
    currency: string | null;
};

type DocumentItem = {
    id: number;
    file_name: string;
    mime_type: string | null;
    size: number | null;
    created_at: string | null;
    download_url: string;
    delete_url: string;
};

type StatusHistory = {
    id: number;
    from_status: string | null;
    to_status: string;
    reason: string | null;
    changed_by: { id: number; name: string } | null;
    created_at: string | null;
};

type AssetPayload = {
    id: number;
    asset_tag: string;
    name: string;
    serial_number: string | null;
    description: string | null;
    status: string;
    condition: string;
    barcode: string | null;
    purchase_date: string | null;
    purchase_price: string | null;
    currency: string | null;
    warranty_expiry_date: string | null;
    warranty_notes: string | null;
    depreciation_method: string | null;
    useful_life_years: number | null;
    depreciation_rate: string | null;
    salvage_value: string | null;
    book_value: string | null;
    notes: string | null;
    category: { id: number; name: string } | null;
    vendor: { id: number; name: string } | null;
    location: { id: number; name: string } | null;
    assigned_to: { id: number; full_name: string } | null;
    assignments: AssignmentRecord[];
    maintenance_records: MaintenanceRecord[];
    documents: DocumentItem[];
    status_history: StatusHistory[];
    created_by: { id: number; name: string } | null;
    updated_by: { id: number; name: string } | null;
    created_at: string | null;
    updated_at: string | null;
};

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(
    value: string | null,
    style: 'short' | 'long' | 'monthYear' = 'long',
) {
    if (!value) return '—';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    if (style === 'short') {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        });
    }

    if (style === 'monthYear') {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
        });
    }

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function formatDateTime(value: string | null) {
    if (!value) return '—';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatMoney(value: string | null, currency = 'USD') {
    if (value == null || value === '') return '—';

    const amount = Number(value);
    if (Number.isNaN(amount)) return `${currency} ${value}`;

    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            maximumFractionDigits: 2,
        }).format(amount);
    } catch {
        return `${currency} ${amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    }
}

function formatFileSize(bytes: number | null) {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getInitials(name: string | null | undefined) {
    if (!name) return 'NA';
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');
}

function isOverdue(date: string | null) {
    if (!date) return false;
    const value = new Date(date);
    if (Number.isNaN(value.getTime())) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    value.setHours(0, 0, 0, 0);

    return value < today;
}

function getDocumentMeta(doc: DocumentItem) {
    const mime = doc.mime_type?.toLowerCase() ?? '';
    const extension = doc.file_name.split('.').pop()?.toUpperCase() ?? 'FILE';

    if (mime.includes('pdf')) {
        return {
            icon: FileText,
            chip: extension,
            iconClass: 'bg-muted text-foreground',
        };
    }

    if (mime.includes('image')) {
        return {
            icon: FileImage,
            chip: extension,
            iconClass: 'bg-muted text-foreground',
        };
    }

    return {
        icon: FileText,
        chip: extension,
        iconClass: 'bg-muted text-foreground',
    };
}

function getLatestRecordByDate<T>(
    items: T[],
    getDate: (item: T) => string | null | undefined,
) {
    return [...items].sort((a, b) => {
        const aDate = getDate(a) ? new Date(getDate(a) as string).getTime() : 0;
        const bDate = getDate(b) ? new Date(getDate(b) as string).getTime() : 0;
        return bDate - aDate;
    })[0];
}

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

function Metric({
    label,
    value,
    muted,
}: {
    label: string;
    value: ReactNode;
    muted?: boolean;
}) {
    return (
        <div className="space-y-2">
            <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                {label}
            </p>
            <div
                className={
                    muted
                        ? 'text-sm text-muted-foreground'
                        : 'text-[1.65rem] font-semibold tracking-tight'
                }
            >
                {value}
            </div>
        </div>
    );
}

function OverviewField({ label, value }: { label: string; value: ReactNode }) {
    if (!value && value !== 0) return null;

    return (
        <div className="space-y-2">
            <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                {label}
            </p>
            <div className="text-xl font-medium tracking-tight text-foreground">
                {value}
            </div>
        </div>
    );
}

function statusTone(status: string) {
    switch (status) {
        case 'disposed':
        case 'lost':
            return 'border-destructive/20 bg-destructive/5 text-destructive';
        case 'in_maintenance':
            return 'border-border bg-muted text-foreground';
        default:
            return 'border-border bg-muted text-foreground';
    }
}

export default function AssetShow() {
    const { asset, employees, conditions } = usePage<{
        asset: AssetPayload;
        employees: EmployeeOption[];
        conditions: string[];
    }>().props;

    const [activeTab, setActiveTab] = useState('overview');
    const [showAssignDialog, setShowAssignDialog] = useState(false);
    const [showReturnDialog, setShowReturnDialog] = useState(false);
    const [showDisposeDialog, setShowDisposeDialog] = useState(false);
    const [showUploadForm, setShowUploadForm] = useState(false);

    const assignForm = useForm({
        employee_id: '',
        condition: '',
        expected_return_date: '',
        notes: '',
    });

    const returnForm = useForm({
        condition_on_return: '',
        return_notes: '',
    });

    const disposeForm = useForm({
        reason: '',
    });

    const uploadForm = useForm<{ file: File | null }>({ file: null });

    const activeAssignment = useMemo(
        () =>
            asset.assignments.find((assignment) => !assignment.returned_at) ??
            null,
        [asset.assignments],
    );

    const latestMaintenance = useMemo(
        () =>
            getLatestRecordByDate(
                asset.maintenance_records,
                (record) => record.completed_at ?? record.scheduled_date,
            ) ?? null,
        [asset.maintenance_records],
    );

    const latestDocumentPreview = useMemo(
        () => asset.documents.slice(0, 3),
        [asset.documents],
    );

    const handleAssign = (e: FormEvent) => {
        e.preventDefault();
        assignForm.post(`/assets/${asset.id}/assign`, {
            preserveScroll: true,
            onSuccess: () => {
                assignForm.reset();
                setShowAssignDialog(false);
            },
        });
    };

    const handleReturn = (e: FormEvent) => {
        e.preventDefault();
        returnForm.post(`/assets/${asset.id}/return`, {
            preserveScroll: true,
            onSuccess: () => {
                returnForm.reset();
                setShowReturnDialog(false);
            },
        });
    };

    const handleDispose = (e: FormEvent) => {
        e.preventDefault();
        disposeForm.post(`/assets/${asset.id}/dispose`, {
            preserveScroll: true,
            onSuccess: () => {
                disposeForm.reset();
                setShowDisposeDialog(false);
            },
        });
    };

    const handleUpload = (e: FormEvent) => {
        e.preventDefault();
        uploadForm.post(`/assets/${asset.id}/documents`, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                uploadForm.reset();
                setShowUploadForm(false);
            },
        });
    };

    const handleDeleteDocument = (doc: DocumentItem) => {
        router.delete(doc.delete_url, { preserveScroll: true });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Assets', href: '/assets' },
                { title: asset.name, href: '#' },
            ]}
        >
            <Head title={`Asset - ${asset.name}`} />

            <div className="w-full bg-muted/30">
                <div className="w-full border-b bg-background">
                    <div className="w-full px-4 py-5 sm:px-6 lg:px-8">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="flex items-start gap-4">
                                <Link href="/assets">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="mt-0.5 h-9 w-9 rounded-full"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                </Link>

                                <div className="space-y-1.5">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                                            {asset.name}
                                        </h1>
                                        <Badge
                                            variant="outline"
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${statusTone(asset.status)}`}
                                        >
                                            {formatLabel(asset.status)}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 text-sm tracking-[0.16em] text-muted-foreground uppercase">
                                        <span>Asset Tag:</span>
                                        <span className="font-medium tracking-[0.14em] text-foreground/80 normal-case">
                                            {asset.asset_tag}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                                <Link href={`/assets/${asset.id}/edit`}>
                                    <Button
                                        variant="outline"
                                        className="rounded-xl px-4"
                                    >
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit
                                    </Button>
                                </Link>

                                {asset.status === 'available' && (
                                    <Button
                                        variant="outline"
                                        className="rounded-xl px-4"
                                        onClick={() =>
                                            setShowAssignDialog(true)
                                        }
                                    >
                                        <ArrowRightLeft className="mr-2 h-4 w-4" />
                                        Assign
                                    </Button>
                                )}

                                {asset.status === 'assigned' && (
                                    <Button
                                        variant="outline"
                                        className="rounded-xl px-4"
                                        onClick={() =>
                                            setShowReturnDialog(true)
                                        }
                                    >
                                        <Undo2 className="mr-2 h-4 w-4" />
                                        Return
                                    </Button>
                                )}

                                {asset.status !== 'disposed' && (
                                    <Button
                                        className="rounded-xl px-4"
                                        onClick={() =>
                                            setShowDisposeDialog(true)
                                        }
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Dispose
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="space-y-8"
                    >
                        <TabsList className="h-auto w-full justify-start rounded-none border-b bg-transparent p-0">
                            {[
                                ['overview', 'Overview'],
                                ['assignments', 'Assignments'],
                                ['maintenance', 'Maintenance'],
                                ['documents', 'Documents'],
                                ['history', 'Status History'],
                            ].map(([value, label]) => (
                                <TabsTrigger
                                    key={value}
                                    value={value}
                                    className="rounded-none border-b-2 border-transparent px-1 pt-0 pb-4 text-base font-medium text-muted-foreground shadow-none transition data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
                                >
                                    {label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <TabsContent
                            value="overview"
                            className="mt-0 space-y-8"
                        >
                            <div className="grid gap-8 xl:grid-cols-[minmax(0,2fr)_360px]">
                                <div className="space-y-6">
                                    <Card className="overflow-hidden rounded-2xl border shadow-sm">
                                        <CardHeader className="border-b bg-background px-6 py-5">
                                            <div className="flex items-center justify-between gap-3">
                                                <CardTitle className="text-[1.65rem] font-semibold tracking-tight">
                                                    Basic Information
                                                </CardTitle>
                                                <Info className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-10 px-6 py-8">
                                            <div className="grid gap-8 md:grid-cols-2">
                                                <OverviewField
                                                    label="Asset Tag"
                                                    value={asset.asset_tag}
                                                />
                                                <OverviewField
                                                    label="Serial Number"
                                                    value={
                                                        asset.serial_number ??
                                                        '—'
                                                    }
                                                />
                                                <OverviewField
                                                    label="Category"
                                                    value={
                                                        asset.category?.name ??
                                                        '—'
                                                    }
                                                />
                                                <OverviewField
                                                    label="Condition"
                                                    value={
                                                        <div className="flex items-center gap-3 text-foreground">
                                                            <span className="h-2.5 w-2.5 rounded-full bg-foreground/80" />
                                                            <span>
                                                                {formatLabel(
                                                                    asset.condition,
                                                                )}
                                                            </span>
                                                        </div>
                                                    }
                                                />
                                            </div>

                                            {asset.description && (
                                                <div className="space-y-2">
                                                    <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                                                        Description
                                                    </p>
                                                    <p className="max-w-4xl text-lg leading-8 text-foreground/80">
                                                        {asset.description}
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    <Card className="overflow-hidden rounded-2xl border shadow-sm">
                                        <CardHeader className="border-b bg-background px-6 py-5">
                                            <div className="flex items-center justify-between gap-3">
                                                <CardTitle className="text-[1.65rem] font-semibold tracking-tight">
                                                    Purchase &amp; Warranty
                                                </CardTitle>
                                                <Receipt className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="grid gap-8 px-6 py-8 md:grid-cols-2 xl:grid-cols-4">
                                            <OverviewField
                                                label="Purchase Date"
                                                value={formatDate(
                                                    asset.purchase_date,
                                                )}
                                            />
                                            <OverviewField
                                                label="Purchase Price"
                                                value={formatMoney(
                                                    asset.purchase_price,
                                                    asset.currency ?? 'USD',
                                                )}
                                            />
                                            <OverviewField
                                                label="Vendor"
                                                value={
                                                    asset.vendor?.name ?? '—'
                                                }
                                            />
                                            <OverviewField
                                                label="Warranty Expiry"
                                                value={
                                                    <span
                                                        className={
                                                            isOverdue(
                                                                asset.warranty_expiry_date,
                                                            )
                                                                ? 'text-destructive'
                                                                : 'text-foreground'
                                                        }
                                                    >
                                                        {formatDate(
                                                            asset.warranty_expiry_date,
                                                        )}
                                                    </span>
                                                }
                                            />
                                            {asset.warranty_notes && (
                                                <div className="md:col-span-2 xl:col-span-4">
                                                    <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                                                        Warranty Notes
                                                    </p>
                                                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                                                        {asset.warranty_notes}
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    <Card className="overflow-hidden rounded-2xl border shadow-sm">
                                        <CardHeader className="border-b bg-background px-6 py-5">
                                            <div className="flex items-center justify-between gap-3">
                                                <CardTitle className="text-[1.65rem] font-semibold tracking-tight">
                                                    Depreciation Schedule
                                                </CardTitle>
                                                <Package2 className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="grid gap-8 px-6 py-8 lg:grid-cols-[1fr_1fr_260px]">
                                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                                <Metric
                                                    label="Method"
                                                    value={
                                                        asset.depreciation_method
                                                            ? formatLabel(
                                                                  asset.depreciation_method,
                                                              )
                                                            : '—'
                                                    }
                                                    muted={
                                                        asset.depreciation_method ==
                                                        null
                                                    }
                                                />
                                                <Metric
                                                    label="Useful Life"
                                                    value={
                                                        asset.useful_life_years !=
                                                        null
                                                            ? `${asset.useful_life_years * 12} Months (${asset.useful_life_years} Year${asset.useful_life_years === 1 ? '' : 's'})`
                                                            : '—'
                                                    }
                                                    muted={
                                                        asset.useful_life_years ==
                                                        null
                                                    }
                                                />
                                            </div>

                                            <div className="grid gap-8 border-l-0 sm:grid-cols-2 lg:border-l lg:pl-8 xl:grid-cols-1">
                                                <Metric
                                                    label="Salvage Value"
                                                    value={formatMoney(
                                                        asset.salvage_value,
                                                        asset.currency ?? 'USD',
                                                    )}
                                                    muted={
                                                        asset.salvage_value ==
                                                            null ||
                                                        asset.salvage_value ===
                                                            ''
                                                    }
                                                />
                                                <Metric
                                                    label="Depreciation Rate"
                                                    value={
                                                        asset.depreciation_rate
                                                            ? `${asset.depreciation_rate}%`
                                                            : '—'
                                                    }
                                                    muted={
                                                        !asset.depreciation_rate
                                                    }
                                                />
                                            </div>

                                            <div className="rounded-2xl border bg-foreground px-6 py-7 text-background shadow-sm">
                                                <p className="text-xs font-medium tracking-[0.22em] text-background/70 uppercase">
                                                    Current Book Value
                                                </p>
                                                <div className="mt-4 text-4xl font-semibold tracking-tight">
                                                    {formatMoney(
                                                        asset.book_value,
                                                        asset.currency ?? 'USD',
                                                    )}
                                                </div>
                                                <p className="mt-4 text-sm text-background/65">
                                                    {asset.updated_at
                                                        ? `Calculated as of ${formatDate(asset.updated_at, 'monthYear')}`
                                                        : 'Calculated from the current asset record'}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="space-y-6">
                                    <Card className="overflow-hidden rounded-2xl border shadow-sm">
                                        <CardHeader className="border-b bg-background px-6 py-5">
                                            <CardTitle className="text-2xl font-semibold tracking-tight">
                                                Current Assignment
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6 px-6 py-6">
                                            {asset.assigned_to ||
                                            activeAssignment ? (
                                                <>
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex h-14 w-14 items-center justify-center rounded-full border bg-muted text-sm font-semibold text-foreground">
                                                            {getInitials(
                                                                asset
                                                                    .assigned_to
                                                                    ?.full_name ??
                                                                    activeAssignment
                                                                        ?.employee
                                                                        .full_name,
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="truncate text-2xl font-medium tracking-tight">
                                                                {asset
                                                                    .assigned_to
                                                                    ?.full_name ??
                                                                    activeAssignment
                                                                        ?.employee
                                                                        .full_name}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {activeAssignment
                                                                    ?.employee
                                                                    .staff_number ??
                                                                    'Currently assigned'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-5">
                                                        <div className="flex gap-3">
                                                            <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                                            <div>
                                                                <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                                                                    Location
                                                                </p>
                                                                <p className="mt-1 text-lg font-medium tracking-tight">
                                                                    {asset
                                                                        .location
                                                                        ?.name ??
                                                                        '—'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-3">
                                                            <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                                            <div>
                                                                <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                                                                    Assigned
                                                                    Date
                                                                </p>
                                                                <p className="mt-1 text-lg font-medium tracking-tight">
                                                                    {formatDate(
                                                                        activeAssignment?.assigned_at ??
                                                                            null,
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <Button
                                                        variant="outline"
                                                        className="w-full rounded-xl"
                                                        onClick={() =>
                                                            setActiveTab(
                                                                'assignments',
                                                            )
                                                        }
                                                    >
                                                        <Clock3 className="mr-2 h-4 w-4" />
                                                        View History
                                                    </Button>
                                                </>
                                            ) : (
                                                <div className="space-y-4">
                                                    <p className="text-sm text-muted-foreground">
                                                        This asset is not
                                                        currently assigned to
                                                        any employee.
                                                    </p>
                                                    {asset.status ===
                                                        'available' && (
                                                        <Button
                                                            variant="outline"
                                                            className="w-full rounded-xl"
                                                            onClick={() =>
                                                                setShowAssignDialog(
                                                                    true,
                                                                )
                                                            }
                                                        >
                                                            <ArrowRightLeft className="mr-2 h-4 w-4" />
                                                            Assign Asset
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    <Card className="overflow-hidden rounded-2xl border shadow-sm">
                                        <CardHeader className="border-b bg-background px-6 py-5">
                                            <CardTitle className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                                                Audit Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4 px-6 py-6">
                                            <div className="grid grid-cols-[1fr_auto] gap-y-4 text-sm">
                                                <span className="text-muted-foreground">
                                                    Created At
                                                </span>
                                                <span className="font-medium">
                                                    {formatDateTime(
                                                        asset.created_at,
                                                    )}
                                                </span>
                                                <span className="text-muted-foreground">
                                                    Created By
                                                </span>
                                                <span className="font-medium">
                                                    {asset.created_by?.name ??
                                                        '—'}
                                                </span>
                                                <span className="border-t pt-4 text-muted-foreground">
                                                    Last Updated
                                                </span>
                                                <span className="border-t pt-4 font-medium">
                                                    {formatDateTime(
                                                        asset.updated_at,
                                                    )}
                                                </span>
                                                <span className="text-muted-foreground">
                                                    Updated By
                                                </span>
                                                <span className="font-medium">
                                                    {asset.updated_by?.name ??
                                                        'System'}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="overflow-hidden rounded-2xl border border-foreground bg-foreground text-background shadow-sm">
                                        <CardHeader className="px-6 py-5">
                                            <div className="flex items-center justify-between gap-3">
                                                <CardTitle className="text-xs font-semibold tracking-[0.18em] text-background/75 uppercase">
                                                    Maintenance Status
                                                </CardTitle>
                                                <ShieldCheck className="h-5 w-5 text-background/90" />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="px-6 pt-0 pb-6">
                                            {latestMaintenance ? (
                                                <div className="space-y-2 text-base leading-7 text-background/90">
                                                    <p>
                                                        {latestMaintenance.completed_at
                                                            ? `Last serviced on ${formatDate(latestMaintenance.completed_at)}.`
                                                            : `Scheduled maintenance ${formatDate(latestMaintenance.scheduled_date)}.`}
                                                    </p>
                                                    <p>
                                                        {formatLabel(
                                                            latestMaintenance.status,
                                                        )}{' '}
                                                        —{' '}
                                                        {
                                                            latestMaintenance.title
                                                        }
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="text-base leading-7 text-background/80">
                                                    No maintenance records have
                                                    been logged for this asset
                                                    yet.
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            <Card className="overflow-hidden rounded-2xl border shadow-sm">
                                <CardHeader className="border-b bg-background px-6 py-5">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <CardTitle className="text-[1.65rem] font-semibold tracking-tight">
                                            Quick Access Documents
                                        </CardTitle>
                                        <Button
                                            variant="ghost"
                                            className="h-auto px-0 text-sm font-semibold tracking-[0.12em] text-muted-foreground uppercase hover:bg-transparent"
                                            onClick={() =>
                                                setActiveTab('documents')
                                            }
                                        >
                                            Manage Files
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="grid gap-4 px-6 py-6 md:grid-cols-2 xl:grid-cols-3">
                                    {latestDocumentPreview.map((doc) => {
                                        const meta = getDocumentMeta(doc);
                                        const Icon = meta.icon;

                                        return (
                                            <div
                                                key={doc.id}
                                                className="flex items-center gap-4 rounded-2xl border bg-background px-5 py-4"
                                            >
                                                <div
                                                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${meta.iconClass}`}
                                                >
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-lg font-medium tracking-tight">
                                                        {doc.file_name}
                                                    </p>
                                                    <p className="mt-0.5 text-xs tracking-[0.16em] text-muted-foreground uppercase">
                                                        {formatFileSize(
                                                            doc.size,
                                                        )}{' '}
                                                        • {meta.chip}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActiveTab('documents');
                                            setShowUploadForm(true);
                                        }}
                                        className="flex min-h-[92px] items-center justify-center gap-3 rounded-2xl border border-dashed bg-background px-5 py-4 text-left transition hover:bg-muted/50"
                                    >
                                        <Plus className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-base font-medium text-muted-foreground">
                                            Upload New
                                        </span>
                                    </button>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="assignments" className="mt-0">
                            <Card className="rounded-2xl border shadow-sm">
                                <CardHeader className="border-b bg-background px-6 py-5">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <CardTitle className="text-2xl font-semibold tracking-tight">
                                            Assignment History
                                        </CardTitle>
                                        {asset.status === 'available' && (
                                            <Button
                                                variant="outline"
                                                className="rounded-xl"
                                                onClick={() =>
                                                    setShowAssignDialog(true)
                                                }
                                            >
                                                <ArrowRightLeft className="mr-2 h-4 w-4" />
                                                Assign Asset
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {asset.assignments.length === 0 ? (
                                        <div className="px-6 py-16 text-center text-sm text-muted-foreground">
                                            No assignment history yet.
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Employee
                                                        </TableHead>
                                                        <TableHead>
                                                            Assigned
                                                        </TableHead>
                                                        <TableHead>
                                                            Expected Return
                                                        </TableHead>
                                                        <TableHead>
                                                            Returned
                                                        </TableHead>
                                                        <TableHead>
                                                            Condition Out
                                                        </TableHead>
                                                        <TableHead>
                                                            Condition In
                                                        </TableHead>
                                                        <TableHead>
                                                            Notes
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {asset.assignments.map(
                                                        (assignment) => (
                                                            <TableRow
                                                                key={
                                                                    assignment.id
                                                                }
                                                            >
                                                                <TableCell>
                                                                    <div className="font-medium">
                                                                        {
                                                                            assignment
                                                                                .employee
                                                                                .full_name
                                                                        }
                                                                    </div>
                                                                    <div className="text-xs text-muted-foreground">
                                                                        {
                                                                            assignment
                                                                                .employee
                                                                                .staff_number
                                                                        }
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {formatDate(
                                                                        assignment.assigned_at,
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {formatDate(
                                                                        assignment.expected_return_date,
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {assignment.returned_at ? (
                                                                        <Badge
                                                                            variant="outline"
                                                                            className="rounded-full"
                                                                        >
                                                                            {formatDate(
                                                                                assignment.returned_at,
                                                                            )}
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge
                                                                            variant="secondary"
                                                                            className="rounded-full"
                                                                        >
                                                                            Active
                                                                        </Badge>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {assignment.condition_on_assignment
                                                                        ? formatLabel(
                                                                              assignment.condition_on_assignment,
                                                                          )
                                                                        : '—'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {assignment.condition_on_return
                                                                        ? formatLabel(
                                                                              assignment.condition_on_return,
                                                                          )
                                                                        : '—'}
                                                                </TableCell>
                                                                <TableCell className="max-w-[280px] truncate text-sm text-muted-foreground">
                                                                    {assignment.notes ??
                                                                        assignment.return_notes ??
                                                                        '—'}
                                                                </TableCell>
                                                            </TableRow>
                                                        ),
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="maintenance" className="mt-0">
                            <Card className="rounded-2xl border shadow-sm">
                                <CardHeader className="border-b bg-background px-6 py-5">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <CardTitle className="text-2xl font-semibold tracking-tight">
                                            Maintenance Records
                                        </CardTitle>
                                        <Link
                                            href={`/assets/${asset.id}/maintenance/create`}
                                        >
                                            <Button
                                                variant="outline"
                                                className="rounded-xl"
                                            >
                                                <Wrench className="mr-2 h-4 w-4" />
                                                New Record
                                            </Button>
                                        </Link>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {asset.maintenance_records.length === 0 ? (
                                        <div className="px-6 py-16 text-center text-sm text-muted-foreground">
                                            No maintenance records yet.
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Title
                                                        </TableHead>
                                                        <TableHead>
                                                            Type
                                                        </TableHead>
                                                        <TableHead>
                                                            Status
                                                        </TableHead>
                                                        <TableHead>
                                                            Scheduled
                                                        </TableHead>
                                                        <TableHead>
                                                            Completed
                                                        </TableHead>
                                                        <TableHead>
                                                            Cost
                                                        </TableHead>
                                                        <TableHead className="text-right">
                                                            Actions
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {asset.maintenance_records.map(
                                                        (record) => (
                                                            <TableRow
                                                                key={record.id}
                                                            >
                                                                <TableCell className="font-medium">
                                                                    {
                                                                        record.title
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    {formatLabel(
                                                                        record.maintenance_type,
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="rounded-full"
                                                                    >
                                                                        {formatLabel(
                                                                            record.status,
                                                                        )}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {formatDate(
                                                                        record.scheduled_date,
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {formatDate(
                                                                        record.completed_at,
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {record.cost
                                                                        ? formatMoney(
                                                                              record.cost,
                                                                              record.currency ??
                                                                                  asset.currency ??
                                                                                  'USD',
                                                                          )
                                                                        : '—'}
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <div className="flex items-center justify-end gap-1">
                                                                        <Link
                                                                            href={`/assets/${asset.id}/maintenance/${record.id}`}
                                                                        >
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                            >
                                                                                <FileText className="h-4 w-4" />
                                                                            </Button>
                                                                        </Link>
                                                                        <Link
                                                                            href={`/assets/${asset.id}/maintenance/${record.id}/edit`}
                                                                        >
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                            >
                                                                                <Pencil className="h-4 w-4" />
                                                                            </Button>
                                                                        </Link>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ),
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent
                            value="documents"
                            className="mt-0 space-y-6"
                        >
                            <Card className="rounded-2xl border shadow-sm">
                                <CardHeader className="border-b bg-background px-6 py-5">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <CardTitle className="text-2xl font-semibold tracking-tight">
                                            Documents
                                        </CardTitle>
                                        <Button
                                            variant="outline"
                                            className="rounded-xl"
                                            onClick={() =>
                                                setShowUploadForm(
                                                    (current) => !current,
                                                )
                                            }
                                        >
                                            <Upload className="mr-2 h-4 w-4" />
                                            Upload File
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6 px-6 py-6">
                                    {showUploadForm && (
                                        <form
                                            onSubmit={handleUpload}
                                            className="rounded-2xl border bg-muted/40 p-5"
                                        >
                                            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                                                <div>
                                                    <FieldLabel required>
                                                        Select File
                                                    </FieldLabel>
                                                    <Input
                                                        type="file"
                                                        onChange={(e) =>
                                                            uploadForm.setData(
                                                                'file',
                                                                e.target
                                                                    .files?.[0] ??
                                                                    null,
                                                            )
                                                        }
                                                    />
                                                    {uploadForm.errors.file && (
                                                        <p className="mt-2 text-sm text-destructive">
                                                            {
                                                                uploadForm
                                                                    .errors.file
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <Button
                                                    type="submit"
                                                    disabled={
                                                        uploadForm.processing ||
                                                        !uploadForm.data.file
                                                    }
                                                    className="rounded-xl"
                                                >
                                                    <HardDriveUpload className="mr-2 h-4 w-4" />
                                                    {uploadForm.processing
                                                        ? 'Uploading...'
                                                        : 'Upload'}
                                                </Button>
                                            </div>
                                        </form>
                                    )}

                                    {asset.documents.length === 0 ? (
                                        <div className="rounded-2xl border border-dashed px-6 py-16 text-center text-sm text-muted-foreground">
                                            No documents uploaded yet.
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto rounded-2xl border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            File Name
                                                        </TableHead>
                                                        <TableHead>
                                                            Type
                                                        </TableHead>
                                                        <TableHead>
                                                            Size
                                                        </TableHead>
                                                        <TableHead>
                                                            Uploaded
                                                        </TableHead>
                                                        <TableHead className="text-right">
                                                            Actions
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {asset.documents.map(
                                                        (doc) => (
                                                            <TableRow
                                                                key={doc.id}
                                                            >
                                                                <TableCell className="font-medium">
                                                                    {
                                                                        doc.file_name
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    {doc.mime_type ??
                                                                        '—'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {formatFileSize(
                                                                        doc.size,
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {formatDate(
                                                                        doc.created_at,
                                                                    )}
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <div className="flex items-center justify-end gap-1">
                                                                        <a
                                                                            href={
                                                                                doc.download_url
                                                                            }
                                                                        >
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                            >
                                                                                <Download className="h-4 w-4" />
                                                                            </Button>
                                                                        </a>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() =>
                                                                                handleDeleteDocument(
                                                                                    doc,
                                                                                )
                                                                            }
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ),
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="history" className="mt-0">
                            <Card className="rounded-2xl border shadow-sm">
                                <CardHeader className="border-b bg-background px-6 py-5">
                                    <CardTitle className="text-2xl font-semibold tracking-tight">
                                        Status History
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 px-6 py-6">
                                    {asset.status_history.length === 0 ? (
                                        <div className="rounded-2xl border border-dashed px-6 py-16 text-center text-sm text-muted-foreground">
                                            No status changes recorded.
                                        </div>
                                    ) : (
                                        asset.status_history.map((entry) => (
                                            <div
                                                key={entry.id}
                                                className="flex gap-4 rounded-2xl border bg-background px-5 py-4"
                                            >
                                                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border bg-muted">
                                                    <CheckCircle2 className="h-4 w-4 text-foreground" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {entry.from_status && (
                                                            <Badge
                                                                variant="outline"
                                                                className="rounded-full"
                                                            >
                                                                {formatLabel(
                                                                    entry.from_status,
                                                                )}
                                                            </Badge>
                                                        )}
                                                        {entry.from_status && (
                                                            <span className="text-xs text-muted-foreground">
                                                                →
                                                            </span>
                                                        )}
                                                        <Badge
                                                            variant="secondary"
                                                            className="rounded-full"
                                                        >
                                                            {formatLabel(
                                                                entry.to_status,
                                                            )}
                                                        </Badge>
                                                    </div>
                                                    {entry.reason && (
                                                        <p className="mt-2 text-sm leading-7 text-muted-foreground">
                                                            {entry.reason}
                                                        </p>
                                                    )}
                                                    <p className="mt-2 text-xs tracking-[0.12em] text-muted-foreground uppercase">
                                                        {entry.changed_by
                                                            ?.name ??
                                                            'System'}{' '}
                                                        •{' '}
                                                        {formatDate(
                                                            entry.created_at,
                                                            'short',
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    <div className="pt-6 text-center text-xs tracking-[0.28em] text-muted-foreground uppercase">
                        © 2024 Providence HRMS • Enterprise Asset Management
                    </div>
                </div>
            </div>

            <AlertDialog
                open={showAssignDialog}
                onOpenChange={setShowAssignDialog}
            >
                <AlertDialogContent className="rounded-2xl">
                    <form onSubmit={handleAssign}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Assign Asset</AlertDialogTitle>
                            <AlertDialogDescription>
                                Assign <strong>{asset.name}</strong> to an
                                employee.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="my-5 space-y-4">
                            <div>
                                <FieldLabel required>Employee</FieldLabel>
                                <Select
                                    value={assignForm.data.employee_id}
                                    onValueChange={(value) =>
                                        assignForm.setData('employee_id', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select employee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map((employee) => (
                                            <SelectItem
                                                key={employee.id}
                                                value={String(employee.id)}
                                            >
                                                {employee.full_name} (
                                                {employee.staff_number})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {assignForm.errors.employee_id && (
                                    <p className="mt-2 text-sm text-destructive">
                                        {assignForm.errors.employee_id}
                                    </p>
                                )}
                            </div>
                            <div>
                                <FieldLabel>Condition</FieldLabel>
                                <Select
                                    value={assignForm.data.condition}
                                    onValueChange={(value) =>
                                        assignForm.setData('condition', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select condition" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {conditions.map((condition) => (
                                            <SelectItem
                                                key={condition}
                                                value={condition}
                                            >
                                                {formatLabel(condition)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <FieldLabel>Expected Return Date</FieldLabel>
                                <Input
                                    type="date"
                                    value={assignForm.data.expected_return_date}
                                    onChange={(e) =>
                                        assignForm.setData(
                                            'expected_return_date',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <FieldLabel>Notes</FieldLabel>
                                <Textarea
                                    rows={3}
                                    value={assignForm.data.notes}
                                    onChange={(e) =>
                                        assignForm.setData(
                                            'notes',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel type="button">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                type="submit"
                                disabled={assignForm.processing}
                            >
                                {assignForm.processing
                                    ? 'Assigning...'
                                    : 'Assign'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </form>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                open={showReturnDialog}
                onOpenChange={setShowReturnDialog}
            >
                <AlertDialogContent className="rounded-2xl">
                    <form onSubmit={handleReturn}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Return Asset</AlertDialogTitle>
                            <AlertDialogDescription>
                                Process the return of{' '}
                                <strong>{asset.name}</strong>.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="my-5 space-y-4">
                            <div>
                                <FieldLabel>Condition on Return</FieldLabel>
                                <Select
                                    value={returnForm.data.condition_on_return}
                                    onValueChange={(value) =>
                                        returnForm.setData(
                                            'condition_on_return',
                                            value,
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select condition" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {conditions.map((condition) => (
                                            <SelectItem
                                                key={condition}
                                                value={condition}
                                            >
                                                {formatLabel(condition)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <FieldLabel>Return Notes</FieldLabel>
                                <Textarea
                                    rows={3}
                                    placeholder="Any notes about the returned asset..."
                                    value={returnForm.data.return_notes}
                                    onChange={(e) =>
                                        returnForm.setData(
                                            'return_notes',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel type="button">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                type="submit"
                                disabled={returnForm.processing}
                            >
                                {returnForm.processing
                                    ? 'Processing...'
                                    : 'Confirm Return'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </form>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                open={showDisposeDialog}
                onOpenChange={setShowDisposeDialog}
            >
                <AlertDialogContent className="rounded-2xl">
                    <form onSubmit={handleDispose}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Dispose Asset</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to dispose of{' '}
                                <strong>{asset.name}</strong>? This will mark
                                the asset as disposed and it will no longer be
                                available.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="my-5">
                            <FieldLabel>Reason</FieldLabel>
                            <Textarea
                                rows={3}
                                placeholder="Reason for disposal..."
                                value={disposeForm.data.reason}
                                onChange={(e) =>
                                    disposeForm.setData(
                                        'reason',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel type="button">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                type="submit"
                                disabled={disposeForm.processing}
                            >
                                {disposeForm.processing
                                    ? 'Disposing...'
                                    : 'Dispose'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </form>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
