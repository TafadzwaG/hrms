import {
    AlertDialog,
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
    CalendarDays,
    Clock,
    DollarSign,
    Download,
    FileText,
    Pencil,
    Plus,
    Shield,
    Trash2,
    Upload,
    UserRound,
    Users,
    XCircle,
    RotateCcw,
    PauseCircle,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';

type DependantRecord = {
    id: number;
    full_name: string;
    relationship: string;
    date_of_birth: string | null;
    national_id: string | null;
    contact_number: string | null;
    notes: string | null;
    status: string;
};

type DocumentItem = {
    id: number;
    file_name: string;
    document_type: string | null;
    mime_type: string | null;
    size: number | null;
    created_at: string | null;
    download_url: string;
    delete_url: string;
};

type ChangeLogEntry = {
    id: number;
    event: string;
    from_status: string | null;
    to_status: string | null;
    reason: string | null;
    changed_by: { id: number; name: string } | null;
    created_at: string | null;
};

type EnrollmentPayload = {
    id: number;
    employee: { id: number; full_name: string; staff_number: string; department?: string | null };
    benefit: { id: number; name: string; category: string };
    plan: { id: number; name: string } | null;
    status: string;
    effective_date: string | null;
    end_date: string | null;
    employee_contribution: string | number | null;
    employer_contribution: string | number | null;
    payroll_deduction_code: string | null;
    enrollment_reference: string | null;
    notes: string | null;
    dependants: DependantRecord[];
    documents: DocumentItem[];
    change_log: ChangeLogEntry[];
    created_at: string | null;
    updated_at: string | null;
};

type ShowProps = {
    enrollment: EnrollmentPayload;
};

const statusStyles: Record<string, string> = {
    active: 'border-transparent bg-emerald-100 text-emerald-700',
    draft: 'border-transparent bg-zinc-100 text-zinc-600',
    suspended: 'border-transparent bg-amber-100 text-amber-700',
    terminated: 'border-transparent bg-red-100 text-red-700',
    expired: 'border-transparent bg-slate-100 text-slate-600',
    cancelled: 'border-transparent bg-rose-100 text-rose-600',
};

const eventStyles: Record<string, string> = {
    created: 'border-transparent bg-blue-100 text-blue-700',
    activated: 'border-transparent bg-emerald-100 text-emerald-700',
    suspended: 'border-transparent bg-amber-100 text-amber-700',
    terminated: 'border-transparent bg-red-100 text-red-700',
    reinstated: 'border-transparent bg-teal-100 text-teal-700',
    updated: 'border-transparent bg-zinc-100 text-zinc-600',
};

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(value: string | null) {
    if (!value) return '---';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateTime(value: string | null) {
    if (!value) return '---';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit',
    });
}

function formatMoney(value: string | number | null | undefined) {
    if (value === null || value === undefined || value === '') return '---';
    const amount = Number(value);
    if (Number.isNaN(amount)) return String(value);
    return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function FieldLabel({
    children,
    required,
}: {
    children: React.ReactNode;
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

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex justify-between gap-3 text-sm">
            <span className="text-zinc-400">{label}</span>
            <span className="text-right font-semibold text-zinc-700">{children}</span>
        </div>
    );
}

export default function EnrollmentShow() {
    const { enrollment } = usePage<ShowProps>().props;

    const [showDependantDialog, setShowDependantDialog] = useState(false);
    const [editingDependant, setEditingDependant] = useState<DependantRecord | null>(null);

    const dependantForm = useForm({
        full_name: '',
        relationship: '',
        date_of_birth: '',
        national_id: '',
        contact_number: '',
        notes: '',
    });

    const documentForm = useForm<{ file: File | null; document_type: string }>({
        file: null,
        document_type: '',
    });

    const handleAddDependant = (e: FormEvent) => {
        e.preventDefault();
        dependantForm.post(`/benefit-enrollments/${enrollment.id}/dependants`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowDependantDialog(false);
                dependantForm.reset();
            },
        });
    };

    const handleEditDependant = (dep: DependantRecord) => {
        setEditingDependant(dep);
        dependantForm.setData({
            full_name: dep.full_name,
            relationship: dep.relationship,
            date_of_birth: dep.date_of_birth ?? '',
            national_id: dep.national_id ?? '',
            contact_number: dep.contact_number ?? '',
            notes: dep.notes ?? '',
        });
        setShowDependantDialog(true);
    };

    const handleUpdateDependant = (e: FormEvent) => {
        e.preventDefault();
        if (!editingDependant) return;
        dependantForm.put(`/benefit-enrollments/${enrollment.id}/dependants/${editingDependant.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowDependantDialog(false);
                setEditingDependant(null);
                dependantForm.reset();
            },
        });
    };

    const handleRemoveDependant = (depId: number) => {
        router.delete(`/benefit-enrollments/${enrollment.id}/dependants/${depId}`, {
            preserveScroll: true,
        });
    };

    const handleUploadDocument = (e: FormEvent) => {
        e.preventDefault();
        documentForm.post(`/benefit-enrollments/${enrollment.id}/documents`, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => documentForm.reset(),
        });
    };

    const handleDeleteDocument = (docId: number) => {
        router.delete(`/benefit-enrollments/${enrollment.id}/documents/${docId}`, {
            preserveScroll: true,
        });
    };

    const handleStatusChange = (action: string) => {
        router.put(
            `/benefit-enrollments/${enrollment.id}/${action}`,
            {},
            { preserveScroll: true },
        );
    };

    const canSuspend = enrollment.status === 'active';
    const canTerminate = enrollment.status === 'active' || enrollment.status === 'suspended';
    const canReinstate = enrollment.status === 'suspended' || enrollment.status === 'terminated';

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Benefits', href: '/benefits' },
                { title: 'Enrollments', href: '/benefit-enrollments' },
                { title: `#${enrollment.id}` },
            ]}
        >
            <Head title={`Enrollment #${enrollment.id}`} />

            <div className="w-full space-y-6 p-6 lg:p-10">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/benefit-enrollments">
                            <Button variant="ghost" size="icon" className="rounded-full border">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                    Enrollment #{enrollment.id}
                                </h1>
                                <Badge
                                    variant="outline"
                                    className={`${statusStyles[enrollment.status] ?? 'border-zinc-200 bg-zinc-50 text-zinc-700'} font-semibold`}
                                >
                                    {formatLabel(enrollment.status)}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground">
                                {enrollment.employee.full_name} &middot; {enrollment.benefit.name}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {canSuspend && (
                            <Button variant="outline" onClick={() => handleStatusChange('suspend')} type="button">
                                <PauseCircle className="mr-2 h-4 w-4" /> Suspend
                            </Button>
                        )}
                        {canTerminate && (
                            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleStatusChange('terminate')} type="button">
                                <XCircle className="mr-2 h-4 w-4" /> Terminate
                            </Button>
                        )}
                        {canReinstate && (
                            <Button variant="outline" onClick={() => handleStatusChange('reinstate')} type="button">
                                <RotateCcw className="mr-2 h-4 w-4" /> Reinstate
                            </Button>
                        )}
                        <Link href={`/benefit-enrollments/${enrollment.id}/edit`}>
                            <Button className="shadow-sm">
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="dependants">Dependants ({enrollment.dependants?.length ?? 0})</TabsTrigger>
                        <TabsTrigger value="documents">Documents ({enrollment.documents?.length ?? 0})</TabsTrigger>
                        <TabsTrigger value="change-log">Change Log ({enrollment.change_log?.length ?? 0})</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Employee Info */}
                            <Card className="shadow-sm">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <UserRound className="h-5 w-5 text-muted-foreground" />
                                        Employee Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-3">
                                    <InfoRow label="Full Name">{enrollment.employee.full_name}</InfoRow>
                                    <InfoRow label="Staff Number">{enrollment.employee.staff_number}</InfoRow>
                                    <InfoRow label="Department">{enrollment.employee.department ?? '---'}</InfoRow>
                                </CardContent>
                            </Card>

                            {/* Benefit & Plan */}
                            <Card className="shadow-sm">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Shield className="h-5 w-5 text-muted-foreground" />
                                        Benefit & Plan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-3">
                                    <InfoRow label="Benefit">{enrollment.benefit.name}</InfoRow>
                                    <InfoRow label="Category">{formatLabel(enrollment.benefit.category)}</InfoRow>
                                    <InfoRow label="Plan">{enrollment.plan?.name ?? '---'}</InfoRow>
                                    <InfoRow label="Reference">{enrollment.enrollment_reference ?? '---'}</InfoRow>
                                </CardContent>
                            </Card>

                            {/* Status & Dates */}
                            <Card className="shadow-sm">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <CalendarDays className="h-5 w-5 text-muted-foreground" />
                                        Status & Dates
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-3">
                                    <InfoRow label="Status">
                                        <Badge variant="outline" className={`${statusStyles[enrollment.status] ?? ''} font-semibold`}>
                                            {formatLabel(enrollment.status)}
                                        </Badge>
                                    </InfoRow>
                                    <InfoRow label="Effective Date">{formatDate(enrollment.effective_date)}</InfoRow>
                                    <InfoRow label="End Date">{formatDate(enrollment.end_date)}</InfoRow>
                                    <InfoRow label="Payroll Code">{enrollment.payroll_deduction_code ?? '---'}</InfoRow>
                                </CardContent>
                            </Card>

                            {/* Contributions */}
                            <Card className="shadow-sm">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                                        Contributions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-3">
                                    <InfoRow label="Employee Contribution">{formatMoney(enrollment.employee_contribution)}</InfoRow>
                                    <InfoRow label="Employer Contribution">{formatMoney(enrollment.employer_contribution)}</InfoRow>
                                </CardContent>
                            </Card>
                        </div>

                        {enrollment.notes && (
                            <Card className="shadow-sm">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                        Notes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <p className="text-zinc-600 whitespace-pre-wrap">{enrollment.notes}</p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Dependants Tab */}
                    <TabsContent value="dependants" className="space-y-6">
                        <div className="flex justify-end">
                            <Button
                                onClick={() => {
                                    setEditingDependant(null);
                                    dependantForm.reset();
                                    setShowDependantDialog(true);
                                }}
                                type="button"
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add Dependant
                            </Button>
                        </div>

                        <div className="overflow-hidden rounded-md border border-zinc-200">
                            <Table>
                                <TableHeader className="bg-zinc-50">
                                    <TableRow>
                                        <TableHead className="font-bold text-zinc-900">Name</TableHead>
                                        <TableHead className="font-bold text-zinc-900">Relationship</TableHead>
                                        <TableHead className="font-bold text-zinc-900">Date of Birth</TableHead>
                                        <TableHead className="font-bold text-zinc-900">National ID</TableHead>
                                        <TableHead className="font-bold text-zinc-900">Status</TableHead>
                                        <TableHead className="text-right font-bold text-zinc-900">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(enrollment.dependants ?? []).length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="py-8 text-center text-zinc-400">No dependants found.</TableCell>
                                        </TableRow>
                                    ) : (
                                        enrollment.dependants.map((dep) => (
                                            <TableRow key={dep.id} className="hover:bg-zinc-50/50">
                                                <TableCell className="font-bold text-zinc-900">{dep.full_name}</TableCell>
                                                <TableCell className="text-zinc-500">{formatLabel(dep.relationship)}</TableCell>
                                                <TableCell className="text-zinc-500">{formatDate(dep.date_of_birth)}</TableCell>
                                                <TableCell className="text-zinc-500">{dep.national_id ?? '---'}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={`${statusStyles[dep.status] ?? 'border-zinc-200 bg-zinc-50 text-zinc-700'} font-semibold`}>
                                                        {formatLabel(dep.status)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditDependant(dep)} type="button">
                                                            <Pencil className="h-4 w-4 text-zinc-400" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveDependant(dep.id)} type="button">
                                                            <Trash2 className="h-4 w-4 text-red-400" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    {/* Documents Tab */}
                    <TabsContent value="documents" className="space-y-6">
                        <Card className="shadow-sm">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Upload className="h-5 w-5 text-muted-foreground" />
                                    Upload Document
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form onSubmit={handleUploadDocument} className="flex flex-wrap items-end gap-4">
                                    <div className="space-y-1">
                                        <FieldLabel required>File</FieldLabel>
                                        <Input
                                            type="file"
                                            onChange={(e) => documentForm.setData('file', e.target.files?.[0] ?? null)}
                                        />
                                        <FieldError message={documentForm.errors.file} />
                                    </div>
                                    <div className="space-y-1">
                                        <FieldLabel>Document Type</FieldLabel>
                                        <Select value={documentForm.data.document_type} onValueChange={(v) => documentForm.setData('document_type', v)}>
                                            <SelectTrigger className="w-[200px]">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="policy">Policy Document</SelectItem>
                                                <SelectItem value="certificate">Certificate</SelectItem>
                                                <SelectItem value="claim">Claim Form</SelectItem>
                                                <SelectItem value="id_copy">ID Copy</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button type="submit" disabled={documentForm.processing}>
                                        <Upload className="mr-2 h-4 w-4" />
                                        {documentForm.processing ? 'Uploading...' : 'Upload'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <div className="overflow-hidden rounded-md border border-zinc-200">
                            <Table>
                                <TableHeader className="bg-zinc-50">
                                    <TableRow>
                                        <TableHead className="font-bold text-zinc-900">File Name</TableHead>
                                        <TableHead className="font-bold text-zinc-900">Type</TableHead>
                                        <TableHead className="font-bold text-zinc-900">Size</TableHead>
                                        <TableHead className="font-bold text-zinc-900">Uploaded</TableHead>
                                        <TableHead className="text-right font-bold text-zinc-900">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(enrollment.documents ?? []).length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="py-8 text-center text-zinc-400">No documents found.</TableCell>
                                        </TableRow>
                                    ) : (
                                        enrollment.documents.map((doc) => (
                                            <TableRow key={doc.id} className="hover:bg-zinc-50/50">
                                                <TableCell className="font-bold text-zinc-900">{doc.file_name}</TableCell>
                                                <TableCell className="text-zinc-500">{doc.document_type ? formatLabel(doc.document_type) : '---'}</TableCell>
                                                <TableCell className="text-zinc-500">
                                                    {doc.size ? `${(doc.size / 1024).toFixed(1)} KB` : '---'}
                                                </TableCell>
                                                <TableCell className="text-zinc-500">{formatDate(doc.created_at)}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="sm" asChild>
                                                            <a href={doc.download_url} target="_blank" rel="noopener noreferrer">
                                                                <Download className="mr-1 h-4 w-4" /> Download
                                                            </a>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => handleDeleteDocument(doc.id)}
                                                            type="button"
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-400" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    {/* Change Log Tab */}
                    <TabsContent value="change-log" className="space-y-6">
                        <div className="space-y-4">
                            {(enrollment.change_log ?? []).length === 0 ? (
                                <Card className="border-zinc-200 shadow-none">
                                    <CardContent className="py-8 text-center text-zinc-400">
                                        No change log entries found.
                                    </CardContent>
                                </Card>
                            ) : (
                                enrollment.change_log.map((entry) => (
                                    <Card key={entry.id} className="border-zinc-200 shadow-none">
                                        <CardContent className="flex items-start gap-4 p-6">
                                            <div className="mt-0.5">
                                                <Clock className="h-5 w-5 text-zinc-400" />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Badge
                                                        variant="outline"
                                                        className={`${eventStyles[entry.event] ?? eventStyles.updated} font-semibold`}
                                                    >
                                                        {formatLabel(entry.event)}
                                                    </Badge>
                                                    {entry.from_status && entry.to_status && (
                                                        <span className="text-sm text-zinc-500">
                                                            <Badge variant="outline" className={`${statusStyles[entry.from_status] ?? ''} mr-1 font-semibold`}>
                                                                {formatLabel(entry.from_status)}
                                                            </Badge>
                                                            →
                                                            <Badge variant="outline" className={`${statusStyles[entry.to_status] ?? ''} ml-1 font-semibold`}>
                                                                {formatLabel(entry.to_status)}
                                                            </Badge>
                                                        </span>
                                                    )}
                                                </div>
                                                {entry.reason && (
                                                    <p className="text-sm text-zinc-600">{entry.reason}</p>
                                                )}
                                                <div className="flex items-center gap-4 text-xs text-zinc-400">
                                                    <span>{formatDateTime(entry.created_at)}</span>
                                                    {entry.changed_by && (
                                                        <span>by {entry.changed_by.name}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Add/Edit Dependant Dialog */}
            <AlertDialog open={showDependantDialog} onOpenChange={(open) => {
                setShowDependantDialog(open);
                if (!open) {
                    setEditingDependant(null);
                    dependantForm.reset();
                }
            }}>
                <AlertDialogContent className="max-w-lg border-zinc-200">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold">
                            {editingDependant ? 'Edit Dependant' : 'Add Dependant'}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-500">
                            {editingDependant ? 'Update dependant details.' : 'Add a new dependant to this enrollment.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <form onSubmit={editingDependant ? handleUpdateDependant : handleAddDependant} className="space-y-4">
                        <div className="space-y-1">
                            <FieldLabel required>Full Name</FieldLabel>
                            <Input
                                value={dependantForm.data.full_name}
                                onChange={(e) => dependantForm.setData('full_name', e.target.value)}
                                placeholder="Full name"
                            />
                            <FieldError message={dependantForm.errors.full_name} />
                        </div>
                        <div className="space-y-1">
                            <FieldLabel required>Relationship</FieldLabel>
                            <Select value={dependantForm.data.relationship} onValueChange={(v) => dependantForm.setData('relationship', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select relationship" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="spouse">Spouse</SelectItem>
                                    <SelectItem value="child">Child</SelectItem>
                                    <SelectItem value="parent">Parent</SelectItem>
                                    <SelectItem value="sibling">Sibling</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <FieldError message={dependantForm.errors.relationship} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <FieldLabel>Date of Birth</FieldLabel>
                                <Input
                                    type="date"
                                    value={dependantForm.data.date_of_birth}
                                    onChange={(e) => dependantForm.setData('date_of_birth', e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <FieldLabel>National ID</FieldLabel>
                                <Input
                                    value={dependantForm.data.national_id}
                                    onChange={(e) => dependantForm.setData('national_id', e.target.value)}
                                    placeholder="ID number"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <FieldLabel>Contact Number</FieldLabel>
                            <Input
                                value={dependantForm.data.contact_number}
                                onChange={(e) => dependantForm.setData('contact_number', e.target.value)}
                                placeholder="Phone number"
                            />
                        </div>
                        <div className="space-y-1">
                            <FieldLabel>Notes</FieldLabel>
                            <Textarea
                                rows={2}
                                value={dependantForm.data.notes}
                                onChange={(e) => dependantForm.setData('notes', e.target.value)}
                                placeholder="Additional notes..."
                            />
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="border-zinc-200" type="button">Cancel</AlertDialogCancel>
                            <Button type="submit" disabled={dependantForm.processing}>
                                {dependantForm.processing ? 'Saving...' : editingDependant ? 'Update Dependant' : 'Add Dependant'}
                            </Button>
                        </AlertDialogFooter>
                    </form>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
