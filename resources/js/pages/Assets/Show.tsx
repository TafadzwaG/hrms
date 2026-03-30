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
import { Separator } from '@/components/ui/separator';
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
    MapPin,
    Package2,
    Pencil,
    Plus,
    Receipt,
    ShieldCheck,
    Trash2,
    Undo2,
    Upload,
    Wrench,
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
    image_path: string | null;
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
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
    }
    if (style === 'monthYear') {
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateTime(value: string | null) {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
    });
}

function formatMoney(value: string | null, currency = 'USD') {
    if (value == null || value === '') return '—';
    const amount = Number(value);
    if (Number.isNaN(amount)) return `${currency} ${value}`;
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency', currency, maximumFractionDigits: 2,
        }).format(amount);
    } catch {
        return `${currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
    return name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
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
    const icon = mime.includes('image') ? FileImage : FileText;
    return { icon, chip: extension };
}

function getLatestRecordByDate<T>(items: T[], getDate: (item: T) => string | null | undefined) {
    return [...items].sort((a, b) => {
        const aDate = getDate(a) ? new Date(getDate(a) as string).getTime() : 0;
        const bDate = getDate(b) ? new Date(getDate(b) as string).getTime() : 0;
        return bDate - aDate;
    })[0];
}

function FieldLabel({ children, required }: { children: ReactNode; required?: boolean }) {
    return (
        <label className="mb-1.5 block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {children}
            {required && <span className="ml-1 text-destructive">*</span>}
        </label>
    );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                {label}
            </p>
            <div className="text-sm font-medium text-foreground">{children}</div>
        </div>
    );
}

function MetricField({ label, value, large }: { label: string; value: ReactNode; large?: boolean }) {
    return (
        <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                {label}
            </p>
            <div className={large ? 'text-2xl font-semibold tracking-tight' : 'text-sm text-muted-foreground'}>
                {value}
            </div>
        </div>
    );
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

    const assignForm = useForm({ employee_id: '', condition: '', expected_return_date: '', notes: '' });
    const returnForm = useForm({ condition_on_return: '', return_notes: '' });
    const disposeForm = useForm({ reason: '' });
    const uploadForm = useForm<{ file: File | null }>({ file: null });

    const activeAssignment = useMemo(
        () => asset.assignments.find((a) => !a.returned_at) ?? null,
        [asset.assignments],
    );

    const latestMaintenance = useMemo(
        () => getLatestRecordByDate(asset.maintenance_records, (r) => r.completed_at ?? r.scheduled_date) ?? null,
        [asset.maintenance_records],
    );

    const latestDocumentPreview = useMemo(() => asset.documents.slice(0, 3), [asset.documents]);

    const handleAssign = (e: FormEvent) => {
        e.preventDefault();
        assignForm.post(`/assets/${asset.id}/assign`, {
            preserveScroll: true,
            onSuccess: () => { assignForm.reset(); setShowAssignDialog(false); },
        });
    };

    const handleReturn = (e: FormEvent) => {
        e.preventDefault();
        returnForm.post(`/assets/${asset.id}/return`, {
            preserveScroll: true,
            onSuccess: () => { returnForm.reset(); setShowReturnDialog(false); },
        });
    };

    const handleDispose = (e: FormEvent) => {
        e.preventDefault();
        disposeForm.post(`/assets/${asset.id}/dispose`, {
            preserveScroll: true,
            onSuccess: () => { disposeForm.reset(); setShowDisposeDialog(false); },
        });
    };

    const handleUpload = (e: FormEvent) => {
        e.preventDefault();
        uploadForm.post(`/assets/${asset.id}/documents`, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => { uploadForm.reset(); setShowUploadForm(false); },
        });
    };

    const handleDeleteDocument = (doc: DocumentItem) => {
        router.delete(doc.delete_url, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Assets', href: '/assets' }, { title: asset.name, href: '#' }]}>
            <Head title={`Asset — ${asset.name}`} />

            <div className="flex flex-col gap-6 p-4 md:p-6">

                {/* Header */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-3">
                        <Button asChild variant="outline" size="icon" className="mt-0.5 shrink-0">
                            <Link href="/assets">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-xl font-semibold tracking-tight">{asset.name}</h1>
                                <Badge variant="outline">{formatLabel(asset.status)}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Asset Tag: <span className="font-medium text-foreground">{asset.asset_tag}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button asChild variant="outline" size="sm">
                            <Link href={`/assets/${asset.id}/edit`}>
                                <Pencil className="mr-2 h-3.5 w-3.5" />
                                Edit
                            </Link>
                        </Button>
                        {asset.status === 'available' && (
                            <Button variant="outline" size="sm" onClick={() => setShowAssignDialog(true)}>
                                <ArrowRightLeft className="mr-2 h-3.5 w-3.5" />
                                Assign
                            </Button>
                        )}
                        {asset.status === 'assigned' && (
                            <Button variant="outline" size="sm" onClick={() => setShowReturnDialog(true)}>
                                <Undo2 className="mr-2 h-3.5 w-3.5" />
                                Return
                            </Button>
                        )}
                        {asset.status !== 'disposed' && (
                            <Button variant="default" size="sm" onClick={() => setShowDisposeDialog(true)}>
                                <Trash2 className="mr-2 h-3.5 w-3.5" />
                                Dispose
                            </Button>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
                                className="rounded-none border-b-2 border-transparent px-3 pb-3 pt-0 text-sm font-medium text-muted-foreground shadow-none transition-colors data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
                            >
                                {label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* Overview */}
                    <TabsContent value="overview" className="mt-0 space-y-6">
                        <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
                            <div className="space-y-4">

                                {/* Basic Information */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-sm font-semibold">Basic Information</CardTitle>
                                            <Package2 className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </CardHeader>
                                    <Separator />
                                    <CardContent className="pt-4 space-y-4">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <Field label="Asset Tag">{asset.asset_tag}</Field>
                                            <Field label="Serial Number">{asset.serial_number ?? '—'}</Field>
                                            <Field label="Category">{asset.category?.name ?? '—'}</Field>
                                            <Field label="Condition">{formatLabel(asset.condition)}</Field>
                                            {asset.barcode && (
                                                <Field label="Barcode">{asset.barcode}</Field>
                                            )}
                                            {asset.location && (
                                                <Field label="Location">{asset.location.name}</Field>
                                            )}
                                        </div>
                                        {asset.description && (
                                            <div className="space-y-1 pt-1">
                                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Description</p>
                                                <p className="text-sm text-muted-foreground leading-6">{asset.description}</p>
                                            </div>
                                        )}
                                        {asset.notes && (
                                            <div className="space-y-1 pt-1">
                                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Notes</p>
                                                <p className="text-sm text-muted-foreground leading-6">{asset.notes}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Purchase & Warranty */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-sm font-semibold">Purchase &amp; Warranty</CardTitle>
                                            <Receipt className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </CardHeader>
                                    <Separator />
                                    <CardContent className="pt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                        <Field label="Purchase Date">{formatDate(asset.purchase_date)}</Field>
                                        <Field label="Purchase Price">
                                            {formatMoney(asset.purchase_price, asset.currency ?? 'USD')}
                                        </Field>
                                        <Field label="Vendor">{asset.vendor?.name ?? '—'}</Field>
                                        <Field label="Warranty Expiry">
                                            <span className={isOverdue(asset.warranty_expiry_date) ? 'text-destructive' : ''}>
                                                {formatDate(asset.warranty_expiry_date)}
                                            </span>
                                        </Field>
                                        {asset.warranty_notes && (
                                            <div className="sm:col-span-2 xl:col-span-4 space-y-1">
                                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Warranty Notes</p>
                                                <p className="text-sm text-muted-foreground leading-6">{asset.warranty_notes}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Depreciation */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-sm font-semibold">Depreciation Schedule</CardTitle>
                                            <Package2 className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </CardHeader>
                                    <Separator />
                                    <CardContent className="pt-4">
                                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                            <MetricField
                                                label="Method"
                                                value={asset.depreciation_method ? formatLabel(asset.depreciation_method) : '—'}
                                                large={!!asset.depreciation_method}
                                            />
                                            <MetricField
                                                label="Useful Life"
                                                value={asset.useful_life_years != null
                                                    ? `${asset.useful_life_years * 12} mo (${asset.useful_life_years} yr)`
                                                    : '—'}
                                                large={asset.useful_life_years != null}
                                            />
                                            <MetricField
                                                label="Salvage Value"
                                                value={formatMoney(asset.salvage_value, asset.currency ?? 'USD')}
                                                large={!!asset.salvage_value}
                                            />
                                            <MetricField
                                                label="Depreciation Rate"
                                                value={asset.depreciation_rate ? `${asset.depreciation_rate}%` : '—'}
                                                large={!!asset.depreciation_rate}
                                            />
                                        </div>
                                        <Separator className="my-4" />
                                        <div className="flex items-end justify-between gap-4">
                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Current Book Value</p>
                                                <p className="text-3xl font-semibold tracking-tight">
                                                    {formatMoney(asset.book_value, asset.currency ?? 'USD')}
                                                </p>
                                            </div>
                                            {asset.updated_at && (
                                                <p className="text-xs text-muted-foreground">
                                                    As of {formatDate(asset.updated_at, 'monthYear')}
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right column */}
                            <div className="space-y-4">
                                {asset.image_path && (
                                    <Card className="overflow-hidden">
                                        <img
                                            src={`/storage/${asset.image_path}`}
                                            alt={asset.name}
                                            className="h-48 w-full object-contain bg-muted/30"
                                        />
                                    </Card>
                                )}

                                {/* Current Assignment */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-semibold">Current Assignment</CardTitle>
                                    </CardHeader>
                                    <Separator />
                                    <CardContent className="pt-4 space-y-4">
                                        {asset.assigned_to || activeAssignment ? (
                                            <>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-muted text-xs font-semibold">
                                                        {getInitials(asset.assigned_to?.full_name ?? activeAssignment?.employee.full_name)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-semibold">
                                                            {asset.assigned_to?.full_name ?? activeAssignment?.employee.full_name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {activeAssignment?.employee.staff_number ?? 'Currently assigned'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="space-y-3 text-sm">
                                                    <div className="flex items-start gap-2">
                                                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                                        <div>
                                                            <p className="text-xs text-muted-foreground">Location</p>
                                                            <p className="font-medium">{asset.location?.name ?? '—'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                                        <div>
                                                            <p className="text-xs text-muted-foreground">Assigned</p>
                                                            <p className="font-medium">{formatDate(activeAssignment?.assigned_at ?? null)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full"
                                                    onClick={() => setActiveTab('assignments')}
                                                >
                                                    <Clock3 className="mr-2 h-3.5 w-3.5" />
                                                    View History
                                                </Button>
                                            </>
                                        ) : (
                                            <div className="space-y-3">
                                                <p className="text-sm text-muted-foreground">
                                                    Not currently assigned to any employee.
                                                </p>
                                                {asset.status === 'available' && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full"
                                                        onClick={() => setShowAssignDialog(true)}
                                                    >
                                                        <ArrowRightLeft className="mr-2 h-3.5 w-3.5" />
                                                        Assign Asset
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Maintenance Status */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-sm font-semibold">Maintenance Status</CardTitle>
                                            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </CardHeader>
                                    <Separator />
                                    <CardContent className="pt-4">
                                        {latestMaintenance ? (
                                            <div className="space-y-1 text-sm text-muted-foreground">
                                                <p>
                                                    {latestMaintenance.completed_at
                                                        ? `Last serviced ${formatDate(latestMaintenance.completed_at)}.`
                                                        : `Scheduled ${formatDate(latestMaintenance.scheduled_date)}.`}
                                                </p>
                                                <p>{formatLabel(latestMaintenance.status)} — {latestMaintenance.title}</p>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">No maintenance records logged.</p>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Audit */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-semibold">Audit</CardTitle>
                                    </CardHeader>
                                    <Separator />
                                    <CardContent className="pt-4">
                                        <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-sm">
                                            <dt className="text-muted-foreground">Created</dt>
                                            <dd className="text-right font-medium">{formatDateTime(asset.created_at)}</dd>
                                            <dt className="text-muted-foreground">By</dt>
                                            <dd className="text-right font-medium">{asset.created_by?.name ?? '—'}</dd>
                                            <dt className="text-muted-foreground pt-2 border-t">Updated</dt>
                                            <dd className="text-right font-medium pt-2 border-t">{formatDateTime(asset.updated_at)}</dd>
                                            <dt className="text-muted-foreground">By</dt>
                                            <dd className="text-right font-medium">{asset.updated_by?.name ?? 'System'}</dd>
                                        </dl>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Quick Access Documents */}
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-semibold">Documents</CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto px-0 text-xs text-muted-foreground hover:bg-transparent hover:text-foreground"
                                        onClick={() => setActiveTab('documents')}
                                    >
                                        Manage all
                                    </Button>
                                </div>
                            </CardHeader>
                            <Separator />
                            <CardContent className="pt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                {latestDocumentPreview.map((doc) => {
                                    const { icon: Icon, chip } = getDocumentMeta(doc);
                                    return (
                                        <div
                                            key={doc.id}
                                            className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3"
                                        >
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-background">
                                                <Icon className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium">{doc.file_name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatFileSize(doc.size)} · {chip}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                                <button
                                    type="button"
                                    onClick={() => { setActiveTab('documents'); setShowUploadForm(true); }}
                                    className="flex min-h-[60px] items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground transition hover:bg-muted/40 hover:text-foreground"
                                >
                                    <Plus className="h-4 w-4" />
                                    Upload New
                                </button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Assignments */}
                    <TabsContent value="assignments" className="mt-0">
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-semibold">Assignment History</CardTitle>
                                    {asset.status === 'available' && (
                                        <Button variant="outline" size="sm" onClick={() => setShowAssignDialog(true)}>
                                            <ArrowRightLeft className="mr-2 h-3.5 w-3.5" />
                                            Assign
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <Separator />
                            <CardContent className="p-0">
                                {asset.assignments.length === 0 ? (
                                    <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                                        No assignment history yet.
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Employee</TableHead>
                                                    <TableHead>Assigned</TableHead>
                                                    <TableHead>Expected Return</TableHead>
                                                    <TableHead>Returned</TableHead>
                                                    <TableHead>Condition Out</TableHead>
                                                    <TableHead>Condition In</TableHead>
                                                    <TableHead>Notes</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {asset.assignments.map((assignment) => (
                                                    <TableRow key={assignment.id}>
                                                        <TableCell>
                                                            <div className="text-sm font-medium">{assignment.employee.full_name}</div>
                                                            <div className="text-xs text-muted-foreground">{assignment.employee.staff_number}</div>
                                                        </TableCell>
                                                        <TableCell className="text-sm">{formatDate(assignment.assigned_at)}</TableCell>
                                                        <TableCell className="text-sm">{formatDate(assignment.expected_return_date)}</TableCell>
                                                        <TableCell>
                                                            {assignment.returned_at ? (
                                                                <Badge variant="outline">{formatDate(assignment.returned_at)}</Badge>
                                                            ) : (
                                                                <Badge variant="secondary">Active</Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-sm">
                                                            {assignment.condition_on_assignment ? formatLabel(assignment.condition_on_assignment) : '—'}
                                                        </TableCell>
                                                        <TableCell className="text-sm">
                                                            {assignment.condition_on_return ? formatLabel(assignment.condition_on_return) : '—'}
                                                        </TableCell>
                                                        <TableCell className="max-w-[240px] truncate text-sm text-muted-foreground">
                                                            {assignment.notes ?? assignment.return_notes ?? '—'}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Maintenance */}
                    <TabsContent value="maintenance" className="mt-0">
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-semibold">Maintenance Records</CardTitle>
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/assets/${asset.id}/maintenance/create`}>
                                            <Wrench className="mr-2 h-3.5 w-3.5" />
                                            New Record
                                        </Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <Separator />
                            <CardContent className="p-0">
                                {asset.maintenance_records.length === 0 ? (
                                    <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                                        No maintenance records yet.
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Title</TableHead>
                                                    <TableHead>Type</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Scheduled</TableHead>
                                                    <TableHead>Completed</TableHead>
                                                    <TableHead>Cost</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {asset.maintenance_records.map((record) => (
                                                    <TableRow key={record.id}>
                                                        <TableCell className="text-sm font-medium">{record.title}</TableCell>
                                                        <TableCell className="text-sm">{formatLabel(record.maintenance_type)}</TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">{formatLabel(record.status)}</Badge>
                                                        </TableCell>
                                                        <TableCell className="text-sm">{formatDate(record.scheduled_date)}</TableCell>
                                                        <TableCell className="text-sm">{formatDate(record.completed_at)}</TableCell>
                                                        <TableCell className="text-sm">
                                                            {record.cost ? formatMoney(record.cost, record.currency ?? asset.currency ?? 'USD') : '—'}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-1">
                                                                <Button asChild variant="ghost" size="icon">
                                                                    <Link href={`/assets/${asset.id}/maintenance/${record.id}`}>
                                                                        <FileText className="h-4 w-4" />
                                                                    </Link>
                                                                </Button>
                                                                <Button asChild variant="ghost" size="icon">
                                                                    <Link href={`/assets/${asset.id}/maintenance/${record.id}/edit`}>
                                                                        <Pencil className="h-4 w-4" />
                                                                    </Link>
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Documents */}
                    <TabsContent value="documents" className="mt-0 space-y-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-semibold">Documents</CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowUploadForm((v) => !v)}
                                    >
                                        <Upload className="mr-2 h-3.5 w-3.5" />
                                        Upload File
                                    </Button>
                                </div>
                            </CardHeader>
                            <Separator />
                            <CardContent className="pt-4 space-y-4">
                                {showUploadForm && (
                                    <form onSubmit={handleUpload} className="rounded-lg border bg-muted/30 p-4">
                                        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                                            <div>
                                                <FieldLabel required>Select File</FieldLabel>
                                                <Input
                                                    type="file"
                                                    onChange={(e) => uploadForm.setData('file', e.target.files?.[0] ?? null)}
                                                />
                                                {uploadForm.errors.file && (
                                                    <p className="mt-1 text-xs text-destructive">{uploadForm.errors.file}</p>
                                                )}
                                            </div>
                                            <Button type="submit" size="sm" disabled={uploadForm.processing || !uploadForm.data.file}>
                                                <HardDriveUpload className="mr-2 h-3.5 w-3.5" />
                                                {uploadForm.processing ? 'Uploading…' : 'Upload'}
                                            </Button>
                                        </div>
                                    </form>
                                )}

                                {asset.documents.length === 0 ? (
                                    <div className="rounded-lg border border-dashed px-6 py-12 text-center text-sm text-muted-foreground">
                                        No documents uploaded yet.
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto rounded-lg border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>File Name</TableHead>
                                                    <TableHead>Type</TableHead>
                                                    <TableHead>Size</TableHead>
                                                    <TableHead>Uploaded</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {asset.documents.map((doc) => (
                                                    <TableRow key={doc.id}>
                                                        <TableCell className="text-sm font-medium">{doc.file_name}</TableCell>
                                                        <TableCell className="text-sm text-muted-foreground">{doc.mime_type ?? '—'}</TableCell>
                                                        <TableCell className="text-sm">{formatFileSize(doc.size)}</TableCell>
                                                        <TableCell className="text-sm">{formatDate(doc.created_at)}</TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-1">
                                                                <Button asChild variant="ghost" size="icon">
                                                                    <a href={doc.download_url}>
                                                                        <Download className="h-4 w-4" />
                                                                    </a>
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleDeleteDocument(doc)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Status History */}
                    <TabsContent value="history" className="mt-0">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold">Status History</CardTitle>
                            </CardHeader>
                            <Separator />
                            <CardContent className="pt-4 space-y-3">
                                {asset.status_history.length === 0 ? (
                                    <div className="rounded-lg border border-dashed px-6 py-12 text-center text-sm text-muted-foreground">
                                        No status changes recorded.
                                    </div>
                                ) : (
                                    asset.status_history.map((entry) => (
                                        <div key={entry.id} className="flex gap-3 rounded-lg border bg-muted/20 px-4 py-3">
                                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background">
                                                <CheckCircle2 className="h-3.5 w-3.5 text-foreground" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    {entry.from_status && (
                                                        <>
                                                            <Badge variant="outline" className="text-xs">{formatLabel(entry.from_status)}</Badge>
                                                            <span className="text-xs text-muted-foreground">→</span>
                                                        </>
                                                    )}
                                                    <Badge variant="secondary" className="text-xs">{formatLabel(entry.to_status)}</Badge>
                                                </div>
                                                {entry.reason && (
                                                    <p className="mt-1.5 text-sm text-muted-foreground">{entry.reason}</p>
                                                )}
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {entry.changed_by?.name ?? 'System'} · {formatDate(entry.created_at, 'short')}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Assign Dialog */}
            <AlertDialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
                <AlertDialogContent>
                    <form onSubmit={handleAssign}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Assign Asset</AlertDialogTitle>
                            <AlertDialogDescription>
                                Assign <strong>{asset.name}</strong> to an employee.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="my-4 space-y-4">
                            <div>
                                <FieldLabel required>Employee</FieldLabel>
                                <Select value={assignForm.data.employee_id} onValueChange={(v) => assignForm.setData('employee_id', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                                    <SelectContent>
                                        {employees.map((emp) => (
                                            <SelectItem key={emp.id} value={String(emp.id)}>
                                                {emp.full_name} ({emp.staff_number})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {assignForm.errors.employee_id && (
                                    <p className="mt-1 text-xs text-destructive">{assignForm.errors.employee_id}</p>
                                )}
                            </div>
                            <div>
                                <FieldLabel>Condition</FieldLabel>
                                <Select value={assignForm.data.condition} onValueChange={(v) => assignForm.setData('condition', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger>
                                    <SelectContent>
                                        {conditions.map((c) => (
                                            <SelectItem key={c} value={c}>{formatLabel(c)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <FieldLabel>Expected Return Date</FieldLabel>
                                <Input
                                    type="date"
                                    value={assignForm.data.expected_return_date}
                                    onChange={(e) => assignForm.setData('expected_return_date', e.target.value)}
                                />
                            </div>
                            <div>
                                <FieldLabel>Notes</FieldLabel>
                                <Textarea
                                    rows={3}
                                    value={assignForm.data.notes}
                                    onChange={(e) => assignForm.setData('notes', e.target.value)}
                                />
                            </div>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                            <AlertDialogAction type="submit" disabled={assignForm.processing}>
                                {assignForm.processing ? 'Assigning…' : 'Assign'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </form>
                </AlertDialogContent>
            </AlertDialog>

            {/* Return Dialog */}
            <AlertDialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
                <AlertDialogContent>
                    <form onSubmit={handleReturn}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Return Asset</AlertDialogTitle>
                            <AlertDialogDescription>
                                Process the return of <strong>{asset.name}</strong>.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="my-4 space-y-4">
                            <div>
                                <FieldLabel>Condition on Return</FieldLabel>
                                <Select value={returnForm.data.condition_on_return} onValueChange={(v) => returnForm.setData('condition_on_return', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger>
                                    <SelectContent>
                                        {conditions.map((c) => (
                                            <SelectItem key={c} value={c}>{formatLabel(c)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <FieldLabel>Return Notes</FieldLabel>
                                <Textarea
                                    rows={3}
                                    placeholder="Any notes about the returned asset…"
                                    value={returnForm.data.return_notes}
                                    onChange={(e) => returnForm.setData('return_notes', e.target.value)}
                                />
                            </div>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                            <AlertDialogAction type="submit" disabled={returnForm.processing}>
                                {returnForm.processing ? 'Processing…' : 'Confirm Return'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </form>
                </AlertDialogContent>
            </AlertDialog>

            {/* Dispose Dialog */}
            <AlertDialog open={showDisposeDialog} onOpenChange={setShowDisposeDialog}>
                <AlertDialogContent>
                    <form onSubmit={handleDispose}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Dispose Asset</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to dispose of <strong>{asset.name}</strong>? This will mark it as disposed.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="my-4">
                            <FieldLabel>Reason</FieldLabel>
                            <Textarea
                                rows={3}
                                placeholder="Reason for disposal…"
                                value={disposeForm.data.reason}
                                onChange={(e) => disposeForm.setData('reason', e.target.value)}
                            />
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                            <AlertDialogAction type="submit" disabled={disposeForm.processing}>
                                {disposeForm.processing ? 'Disposing…' : 'Dispose'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </form>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
