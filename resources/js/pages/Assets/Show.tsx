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
    Calendar,
    CheckCircle,
    Clock,
    CreditCard,
    Download,
    FileText,
    MapPin,
    Package,
    Pencil,
    RotateCcw,
    Trash2,
    Upload,
    UserCheck,
    Wrench,
    XCircle,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';

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

function formatStatus(status: string) {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function statusBadgeClass(status: string) {
    switch (status) {
        case 'available':
            return 'bg-emerald-50 text-emerald-600 border-emerald-200';
        case 'assigned':
            return 'bg-blue-50 text-blue-600 border-blue-200';
        case 'in_maintenance':
            return 'bg-amber-50 text-amber-600 border-amber-200';
        case 'retired':
            return 'bg-gray-50 text-gray-600 border-gray-200';
        case 'disposed':
        case 'lost':
            return 'bg-red-50 text-red-600 border-red-200';
        case 'damaged':
            return 'bg-orange-50 text-orange-600 border-orange-200';
        default:
            return 'bg-gray-50 text-gray-600 border-gray-200';
    }
}

function formatFileSize(bytes: number | null) {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
        <label className="mb-2 block text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {children}
            {required && <span className="ml-1 text-destructive">*</span>}
        </label>
    );
}

export default function AssetShow() {
    const { asset, employees, conditions } = usePage<{
        asset: AssetPayload;
        employees: EmployeeOption[];
        conditions: string[];
    }>().props;

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

            <div className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/assets">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight">{asset.name}</h1>
                                <Badge variant="outline" className={statusBadgeClass(asset.status)}>
                                    {formatStatus(asset.status)}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {asset.asset_tag}
                                {asset.serial_number && ` · ${asset.serial_number}`}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={`/assets/${asset.id}/edit`}>
                            <Button variant="outline">
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                        {asset.status === 'available' && (
                            <Button variant="outline" onClick={() => setShowAssignDialog(true)}>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Assign
                            </Button>
                        )}
                        {asset.status === 'assigned' && (
                            <Button variant="outline" onClick={() => setShowReturnDialog(true)}>
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Return
                            </Button>
                        )}
                        {asset.status !== 'disposed' && (
                            <Button
                                variant="destructive"
                                onClick={() => setShowDisposeDialog(true)}
                            >
                                <XCircle className="mr-2 h-4 w-4" />
                                Dispose
                            </Button>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="overview">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="assignments">Assignments</TabsTrigger>
                        <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                        <TabsTrigger value="history">Status History</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid gap-6 lg:grid-cols-2">
                            {/* Basic Info */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-2">
                                        <Package className="h-5 w-5 text-primary" />
                                        <CardTitle className="text-lg">Basic Information</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="grid gap-4 sm:grid-cols-2">
                                    <DetailRow label="Asset Tag" value={asset.asset_tag} />
                                    <DetailRow label="Name" value={asset.name} />
                                    <DetailRow label="Category" value={asset.category?.name} />
                                    <DetailRow label="Serial Number" value={asset.serial_number} />
                                    <DetailRow label="Barcode" value={asset.barcode} />
                                    <DetailRow label="Condition" value={formatStatus(asset.condition)} />
                                    {asset.description && (
                                        <div className="sm:col-span-2">
                                            <DetailRow label="Description" value={asset.description} />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Purchase & Warranty */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5 text-primary" />
                                        <CardTitle className="text-lg">Purchase &amp; Warranty</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="grid gap-4 sm:grid-cols-2">
                                    <DetailRow label="Purchase Date" value={asset.purchase_date} />
                                    <DetailRow
                                        label="Purchase Price"
                                        value={
                                            asset.purchase_price
                                                ? `${asset.currency ?? ''} ${Number(asset.purchase_price).toLocaleString()}`
                                                : null
                                        }
                                    />
                                    <DetailRow label="Vendor" value={asset.vendor?.name} />
                                    <DetailRow label="Warranty Expiry" value={asset.warranty_expiry_date} />
                                    <DetailRow label="Warranty Notes" value={asset.warranty_notes} />
                                </CardContent>
                            </Card>

                            {/* Depreciation */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-primary" />
                                        <CardTitle className="text-lg">Depreciation</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="grid gap-4 sm:grid-cols-2">
                                    <DetailRow
                                        label="Method"
                                        value={asset.depreciation_method ? formatStatus(asset.depreciation_method) : null}
                                    />
                                    <DetailRow
                                        label="Useful Life"
                                        value={asset.useful_life_years != null ? `${asset.useful_life_years} years` : null}
                                    />
                                    <DetailRow
                                        label="Depreciation Rate"
                                        value={asset.depreciation_rate ? `${asset.depreciation_rate}%` : null}
                                    />
                                    <DetailRow
                                        label="Salvage Value"
                                        value={
                                            asset.salvage_value
                                                ? `${asset.currency ?? ''} ${Number(asset.salvage_value).toLocaleString()}`
                                                : null
                                        }
                                    />
                                    <DetailRow
                                        label="Book Value"
                                        value={
                                            asset.book_value
                                                ? `${asset.currency ?? ''} ${Number(asset.book_value).toLocaleString()}`
                                                : null
                                        }
                                    />
                                </CardContent>
                            </Card>

                            {/* Location */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-primary" />
                                        <CardTitle className="text-lg">Location</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="grid gap-4 sm:grid-cols-2">
                                    <DetailRow label="Location" value={asset.location?.name} />
                                    <DetailRow label="Assigned To" value={asset.assigned_to?.full_name} />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Notes */}
                        {asset.notes && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Notes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm">{asset.notes}</p>
                                </CardContent>
                            </Card>
                        )}

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
                                    value={asset.created_at ? asset.created_at.substring(0, 10) : null}
                                />
                                <DetailRow label="Created By" value={asset.created_by?.name} />
                                <DetailRow
                                    label="Updated At"
                                    value={asset.updated_at ? asset.updated_at.substring(0, 10) : null}
                                />
                                <DetailRow label="Updated By" value={asset.updated_by?.name} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Assignments Tab */}
                    <TabsContent value="assignments" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Assignment History</CardTitle>
                                    {asset.status === 'available' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowAssignDialog(true)}
                                        >
                                            <UserCheck className="mr-2 h-4 w-4" />
                                            Assign
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {asset.assignments.length === 0 ? (
                                    <div className="py-8 text-center text-sm text-muted-foreground">
                                        No assignment history yet.
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Employee</TableHead>
                                                <TableHead>Assigned At</TableHead>
                                                <TableHead>Expected Return</TableHead>
                                                <TableHead>Returned At</TableHead>
                                                <TableHead>Condition (Out)</TableHead>
                                                <TableHead>Condition (Return)</TableHead>
                                                <TableHead>Notes</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {asset.assignments.map((a) => (
                                                <TableRow key={a.id}>
                                                    <TableCell className="font-medium">
                                                        {a.employee.full_name}
                                                        <div className="text-xs text-muted-foreground">
                                                            {a.employee.staff_number}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{a.assigned_at ?? '—'}</TableCell>
                                                    <TableCell>{a.expected_return_date ?? '—'}</TableCell>
                                                    <TableCell>
                                                        {a.returned_at ? (
                                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">
                                                                {a.returned_at}
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                                                                Active
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {a.condition_on_assignment ? formatStatus(a.condition_on_assignment) : '—'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {a.condition_on_return ? formatStatus(a.condition_on_return) : '—'}
                                                    </TableCell>
                                                    <TableCell className="max-w-[200px] truncate text-xs">
                                                        {a.notes ?? '—'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Maintenance Tab */}
                    <TabsContent value="maintenance" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Maintenance Records</CardTitle>
                                    <Link href={`/assets/${asset.id}/maintenance/create`}>
                                        <Button variant="outline" size="sm">
                                            <Wrench className="mr-2 h-4 w-4" />
                                            New Record
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {asset.maintenance_records.length === 0 ? (
                                    <div className="py-8 text-center text-sm text-muted-foreground">
                                        No maintenance records yet.
                                    </div>
                                ) : (
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
                                            {asset.maintenance_records.map((m) => (
                                                <TableRow key={m.id}>
                                                    <TableCell className="font-medium">{m.title}</TableCell>
                                                    <TableCell>{formatStatus(m.maintenance_type)}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">
                                                            {formatStatus(m.status)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{m.scheduled_date ?? '—'}</TableCell>
                                                    <TableCell>{m.completed_at ?? '—'}</TableCell>
                                                    <TableCell>
                                                        {m.cost
                                                            ? `${m.currency ?? ''} ${Number(m.cost).toLocaleString()}`
                                                            : '—'}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Link href={`/assets/${asset.id}/maintenance/${m.id}`}>
                                                            <Button variant="ghost" size="icon" title="View">
                                                                <FileText className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={`/assets/${asset.id}/maintenance/${m.id}/edit`}>
                                                            <Button variant="ghost" size="icon" title="Edit">
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Documents Tab */}
                    <TabsContent value="documents" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Documents</CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowUploadForm(!showUploadForm)}
                                    >
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {showUploadForm && (
                                    <form
                                        onSubmit={handleUpload}
                                        className="mb-4 flex items-end gap-3 rounded-lg border p-4"
                                    >
                                        <div className="flex-1">
                                            <label className="mb-2 block text-sm font-medium">
                                                Select File
                                            </label>
                                            <Input
                                                type="file"
                                                onChange={(e) =>
                                                    uploadForm.setData('file', e.target.files?.[0] ?? null)
                                                }
                                            />
                                            {uploadForm.errors.file && (
                                                <p className="mt-1 text-sm text-destructive">
                                                    {uploadForm.errors.file}
                                                </p>
                                            )}
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={uploadForm.processing || !uploadForm.data.file}
                                            size="sm"
                                        >
                                            {uploadForm.processing ? 'Uploading...' : 'Upload'}
                                        </Button>
                                    </form>
                                )}

                                {asset.documents.length === 0 ? (
                                    <div className="py-8 text-center text-sm text-muted-foreground">
                                        No documents uploaded yet.
                                    </div>
                                ) : (
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
                                                    <TableCell className="font-medium">{doc.file_name}</TableCell>
                                                    <TableCell>{doc.mime_type ?? '—'}</TableCell>
                                                    <TableCell>{formatFileSize(doc.size)}</TableCell>
                                                    <TableCell>
                                                        {doc.created_at ? doc.created_at.substring(0, 10) : '—'}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <a href={doc.download_url}>
                                                                <Button variant="ghost" size="icon" title="Download">
                                                                    <Download className="h-4 w-4" />
                                                                </Button>
                                                            </a>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                title="Delete"
                                                                onClick={() => handleDeleteDocument(doc)}
                                                            >
                                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Status History Tab */}
                    <TabsContent value="history" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Status History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {asset.status_history.length === 0 ? (
                                    <div className="py-8 text-center text-sm text-muted-foreground">
                                        No status changes recorded.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {asset.status_history.map((entry) => (
                                            <div
                                                key={entry.id}
                                                className="flex items-start gap-4 rounded-lg border p-4"
                                            >
                                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                                                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        {entry.from_status && (
                                                            <>
                                                                <Badge
                                                                    variant="outline"
                                                                    className={statusBadgeClass(entry.from_status)}
                                                                >
                                                                    {formatStatus(entry.from_status)}
                                                                </Badge>
                                                                <span className="text-xs text-muted-foreground">→</span>
                                                            </>
                                                        )}
                                                        <Badge
                                                            variant="outline"
                                                            className={statusBadgeClass(entry.to_status)}
                                                        >
                                                            {formatStatus(entry.to_status)}
                                                        </Badge>
                                                    </div>
                                                    {entry.reason && (
                                                        <p className="mt-1 text-sm text-muted-foreground">
                                                            {entry.reason}
                                                        </p>
                                                    )}
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {entry.changed_by?.name ?? 'System'}
                                                        {entry.created_at && ` · ${entry.created_at.substring(0, 10)}`}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
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
                                <Select
                                    value={assignForm.data.employee_id}
                                    onValueChange={(v) => assignForm.setData('employee_id', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select employee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map((emp) => (
                                            <SelectItem key={emp.id} value={String(emp.id)}>
                                                {emp.full_name} ({emp.staff_number})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <FieldLabel>Condition</FieldLabel>
                                <Select
                                    value={assignForm.data.condition}
                                    onValueChange={(v) => assignForm.setData('condition', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select condition" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {conditions.map((c) => (
                                            <SelectItem key={c} value={c}>
                                                {formatStatus(c)}
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
                                        assignForm.setData('expected_return_date', e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <FieldLabel>Notes</FieldLabel>
                                <Textarea
                                    value={assignForm.data.notes}
                                    onChange={(e) => assignForm.setData('notes', e.target.value)}
                                    rows={2}
                                />
                            </div>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                            <AlertDialogAction type="submit" disabled={assignForm.processing}>
                                {assignForm.processing ? 'Assigning...' : 'Assign'}
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
                                <Select
                                    value={returnForm.data.condition_on_return}
                                    onValueChange={(v) => returnForm.setData('condition_on_return', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select condition" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {conditions.map((c) => (
                                            <SelectItem key={c} value={c}>
                                                {formatStatus(c)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <FieldLabel>Return Notes</FieldLabel>
                                <Textarea
                                    value={returnForm.data.return_notes}
                                    onChange={(e) => returnForm.setData('return_notes', e.target.value)}
                                    rows={3}
                                    placeholder="Any notes about the returned asset..."
                                />
                            </div>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                            <AlertDialogAction type="submit" disabled={returnForm.processing}>
                                {returnForm.processing ? 'Processing...' : 'Confirm Return'}
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
                                Are you sure you want to dispose of <strong>{asset.name}</strong>?
                                This will mark the asset as disposed and it will no longer be available.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="my-4">
                            <FieldLabel>Reason</FieldLabel>
                            <Textarea
                                value={disposeForm.data.reason}
                                onChange={(e) => disposeForm.setData('reason', e.target.value)}
                                rows={3}
                                placeholder="Reason for disposal..."
                            />
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                            <AlertDialogAction type="submit" disabled={disposeForm.processing}>
                                {disposeForm.processing ? 'Disposing...' : 'Dispose'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </form>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
