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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { useAuthorization } from '@/lib/authorization';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    Calendar,
    Clock,
    CreditCard,
    Download,
    FileText,
    Pencil,
    Power,
    Trash2,
    Upload,
    XCircle,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';

type EmployeeSummary = {
    id: number;
    staff_number: string;
    full_name: string;
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

type ContractPayload = {
    id: number;
    contract_number: string;
    contract_type: string;
    status: string;
    start_date: string | null;
    end_date: string | null;
    probation_end_date: string | null;
    job_title: string | null;
    department: { id: number; name: string } | null;
    position: { id: number; name: string } | null;
    pay_point: string | null;
    basic_salary: string | null;
    currency: string | null;
    pay_frequency: string | null;
    working_hours_per_week: string | null;
    notice_period_days: number | null;
    leave_days_per_year: number | null;
    is_current: boolean;
    signed_at: string | null;
    terminated_at: string | null;
    termination_reason: string | null;
    renewal_notes: string | null;
    benefits: Record<string, unknown> | null;
    metadata: Record<string, unknown> | null;
    created_by: { id: number; name: string } | null;
    updated_by: { id: number; name: string } | null;
    created_at: string | null;
    updated_at: string | null;
    documents: DocumentItem[];
    links: {
        show: string;
        edit: string;
        activate: string;
        terminate: string;
        document_store: string;
    };
};

const CONTRACT_TYPE_LABELS: Record<string, string> = {
    permanent: 'Permanent',
    fixed_term: 'Fixed Term',
    temporary: 'Temporary',
    internship: 'Internship',
    consultancy: 'Consultancy',
    probation: 'Probation',
};

const PAY_FREQUENCY_LABELS: Record<string, string> = {
    weekly: 'Weekly',
    bi_weekly: 'Bi-Weekly',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    annually: 'Annually',
};

function statusBadgeVariant(status: string) {
    switch (status) {
        case 'active':
            return 'default';
        case 'draft':
            return 'secondary';
        case 'pending_approval':
            return 'outline';
        case 'expired':
        case 'terminated':
            return 'destructive';
        case 'suspended':
            return 'outline';
        case 'archived':
            return 'secondary';
        default:
            return 'secondary';
    }
}

function formatStatus(status: string) {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatFileSize(bytes: number | null) {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function DetailRow({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) {
    if (!value && value !== 0) return null;
    return (
        <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium">{value}</p>
        </div>
    );
}

export default function ContractShow() {
    const { employee, contract } = usePage<{
        employee: EmployeeSummary;
        contract: ContractPayload;
    }>().props;

    const { can } = useAuthorization();
    const [showTerminateDialog, setShowTerminateDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showUploadForm, setShowUploadForm] = useState(false);

    const canUpdate = can('contracts.update');
    const canDelete = can('contracts.delete');
    const canActivate = can('contracts.activate');
    const canTerminate = can('contracts.terminate');
    const canManageDocs = can('contracts.documents.manage');

    const terminateForm = useForm({ termination_reason: '' });
    const uploadForm = useForm<{ file: File | null }>({ file: null });

    const handleActivate = () => {
        router.post(contract.links.activate, undefined, {
            preserveScroll: true,
        });
    };

    const handleTerminate = (e: FormEvent) => {
        e.preventDefault();
        terminateForm.post(contract.links.terminate, {
            preserveScroll: true,
            onSuccess: () => setShowTerminateDialog(false),
        });
    };

    const handleDelete = () => {
        router.delete(
            `/employees/${employee.id}/contracts/${contract.id}`,
            {
                onFinish: () => setShowDeleteDialog(false),
            },
        );
    };

    const handleUpload = (e: FormEvent) => {
        e.preventDefault();
        uploadForm.post(contract.links.document_store, {
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
                { title: 'Employees', href: '/employees' },
                {
                    title: employee.full_name,
                    href: `/employees/${employee.id}`,
                },
                {
                    title: 'Contracts',
                    href: `/employees/${employee.id}/contracts`,
                },
                { title: contract.contract_number, href: '#' },
            ]}
        >
            <Head
                title={`Contract ${contract.contract_number} - ${employee.full_name}`}
            />

            <div className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/employees/${employee.id}/contracts`}
                        >
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight">
                                    {contract.contract_number}
                                </h1>
                                {contract.is_current && (
                                    <Badge variant="default">Current</Badge>
                                )}
                                <Badge
                                    variant={statusBadgeVariant(
                                        contract.status,
                                    )}
                                >
                                    {formatStatus(contract.status)}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {employee.full_name} &middot;{' '}
                                {employee.staff_number}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {canActivate &&
                            !contract.is_current &&
                            contract.status !== 'terminated' && (
                                <Button
                                    variant="outline"
                                    onClick={handleActivate}
                                >
                                    <Power className="mr-2 h-4 w-4" />
                                    Set as Current
                                </Button>
                            )}
                        {canTerminate && contract.status === 'active' && (
                            <Button
                                variant="outline"
                                onClick={() => setShowTerminateDialog(true)}
                            >
                                <XCircle className="mr-2 h-4 w-4" />
                                Terminate
                            </Button>
                        )}
                        {canUpdate && (
                            <Link href={contract.links.edit}>
                                <Button variant="outline">
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </Button>
                            </Link>
                        )}
                        {canDelete && (
                            <Button
                                variant="destructive"
                                onClick={() => setShowDeleteDialog(true)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        )}
                    </div>
                </div>

                {/* Contract Details */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg">
                                    Contract Details
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <DetailRow
                                label="Contract Number"
                                value={contract.contract_number}
                            />
                            <DetailRow
                                label="Contract Type"
                                value={
                                    CONTRACT_TYPE_LABELS[
                                        contract.contract_type
                                    ] || contract.contract_type
                                }
                            />
                            <DetailRow
                                label="Job Title"
                                value={contract.job_title}
                            />
                            <DetailRow
                                label="Signed At"
                                value={
                                    contract.signed_at
                                        ? contract.signed_at.substring(0, 10)
                                        : null
                                }
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg">
                                    Dates
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <DetailRow
                                label="Start Date"
                                value={contract.start_date}
                            />
                            <DetailRow
                                label="End Date"
                                value={contract.end_date || 'Open-ended'}
                            />
                            <DetailRow
                                label="Probation End"
                                value={contract.probation_end_date}
                            />
                            {contract.terminated_at && (
                                <DetailRow
                                    label="Terminated At"
                                    value={contract.terminated_at.substring(
                                        0,
                                        10,
                                    )}
                                />
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg">
                                    Organisation
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <DetailRow
                                label="Department"
                                value={contract.department?.name}
                            />
                            <DetailRow
                                label="Position"
                                value={contract.position?.name}
                            />
                            <DetailRow
                                label="Pay Point"
                                value={contract.pay_point}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg">
                                    Compensation
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <DetailRow
                                label="Basic Salary"
                                value={
                                    contract.basic_salary
                                        ? `${contract.currency || ''} ${Number(contract.basic_salary).toLocaleString()}`
                                        : null
                                }
                            />
                            <DetailRow
                                label="Pay Frequency"
                                value={
                                    contract.pay_frequency
                                        ? PAY_FREQUENCY_LABELS[
                                              contract.pay_frequency
                                          ] || contract.pay_frequency
                                        : null
                                }
                            />
                            <DetailRow
                                label="Working Hours / Week"
                                value={
                                    contract.working_hours_per_week
                                        ? `${contract.working_hours_per_week}h`
                                        : null
                                }
                            />
                            <DetailRow
                                label="Notice Period"
                                value={
                                    contract.notice_period_days != null
                                        ? `${contract.notice_period_days} days`
                                        : null
                                }
                            />
                            <DetailRow
                                label="Leave Days / Year"
                                value={
                                    contract.leave_days_per_year != null
                                        ? `${contract.leave_days_per_year} days`
                                        : null
                                }
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Termination / Notes */}
                {(contract.termination_reason || contract.renewal_notes) && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Notes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {contract.termination_reason && (
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Termination Reason
                                    </p>
                                    <p className="text-sm">
                                        {contract.termination_reason}
                                    </p>
                                </div>
                            )}
                            {contract.renewal_notes && (
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Renewal Notes
                                    </p>
                                    <p className="text-sm">
                                        {contract.renewal_notes}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Documents */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg">
                                    Contract Documents
                                </CardTitle>
                            </div>
                            {canManageDocs && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setShowUploadForm(!showUploadForm)
                                    }
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {showUploadForm && canManageDocs && (
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
                                            uploadForm.setData(
                                                'file',
                                                e.target.files?.[0] ?? null,
                                            )
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
                                    disabled={
                                        uploadForm.processing ||
                                        !uploadForm.data.file
                                    }
                                    size="sm"
                                >
                                    {uploadForm.processing
                                        ? 'Uploading...'
                                        : 'Upload'}
                                </Button>
                            </form>
                        )}

                        {contract.documents.length === 0 ? (
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
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {contract.documents.map((doc) => (
                                        <TableRow key={doc.id}>
                                            <TableCell className="font-medium">
                                                {doc.file_name}
                                            </TableCell>
                                            <TableCell>
                                                {doc.mime_type || '—'}
                                            </TableCell>
                                            <TableCell>
                                                {formatFileSize(doc.size)}
                                            </TableCell>
                                            <TableCell>
                                                {doc.created_at
                                                    ? doc.created_at.substring(
                                                          0,
                                                          10,
                                                      )
                                                    : '—'}
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
                                                            title="Download"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                    </a>
                                                    {canManageDocs && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Delete"
                                                            onClick={() =>
                                                                handleDeleteDocument(
                                                                    doc,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Audit info */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            <CardTitle className="text-lg">
                                Audit Information
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <DetailRow
                            label="Created At"
                            value={
                                contract.created_at
                                    ? contract.created_at.substring(0, 10)
                                    : null
                            }
                        />
                        <DetailRow
                            label="Created By"
                            value={contract.created_by?.name}
                        />
                        <DetailRow
                            label="Updated At"
                            value={
                                contract.updated_at
                                    ? contract.updated_at.substring(0, 10)
                                    : null
                            }
                        />
                        <DetailRow
                            label="Updated By"
                            value={contract.updated_by?.name}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Terminate dialog */}
            <AlertDialog
                open={showTerminateDialog}
                onOpenChange={setShowTerminateDialog}
            >
                <AlertDialogContent>
                    <form onSubmit={handleTerminate}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Terminate Contract
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This will terminate contract{' '}
                                <strong>{contract.contract_number}</strong> and
                                remove it as the current contract.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="my-4">
                            <label className="mb-2 block text-sm font-medium">
                                Reason (optional)
                            </label>
                            <Textarea
                                value={terminateForm.data.termination_reason}
                                onChange={(e) =>
                                    terminateForm.setData(
                                        'termination_reason',
                                        e.target.value,
                                    )
                                }
                                rows={3}
                                placeholder="Reason for termination..."
                            />
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel type="button">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                type="submit"
                                disabled={terminateForm.processing}
                            >
                                Terminate
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </form>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete dialog */}
            <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Contract</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete contract{' '}
                            <strong>{contract.contract_number}</strong>? This
                            action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
