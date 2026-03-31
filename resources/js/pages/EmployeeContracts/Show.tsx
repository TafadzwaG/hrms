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
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
    Briefcase,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    CreditCard,
    Download,
    FileText,
    Hash,
    Pencil,
    Power,
    Trash2,
    Upload,
    UploadCloud,
    User,
    UserSquare2,
    Wallet,
    X,
    XCircle,
} from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

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

function formatDate(value: string | null) {
    if (!value) return '—';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value.substring(0, 10);

    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date);
}

function formatMoney(amount: string | null, currency?: string | null) {
    if (!amount) return '—';

    return `${currency || ''} ${Number(amount).toLocaleString()}`.trim();
}

function formatFileSize(bytes: number | null) {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function SectionCard({
    title,
    description,
    icon,
    children,
    className = '',
}: {
    title: string;
    description?: string;
    icon: React.ComponentType<{ className?: string }>;
    children: ReactNode;
    className?: string;
}) {
    const Icon = icon;

    return (
        <Card className={`border-border/60 shadow-sm ${className}`}>
            <CardHeader className="pb-4">
                <div className="flex items-start gap-3">
                    <div className="rounded-xl border bg-muted/50 p-2.5">
                        <Icon className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
                        {description && (
                            <CardDescription className="mt-1">
                                {description}
                            </CardDescription>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

function DetailBlock({
    label,
    value,
}: {
    label: string;
    value?: ReactNode;
}) {
    const hasValue =
        value !== null &&
        value !== undefined &&
        !(typeof value === 'string' && value.trim() === '');

    return (
        <div className="rounded-xl border bg-muted/30 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {label}
            </p>
            <div className="mt-1 text-sm font-medium text-foreground">
                {hasValue ? value : 'Not set'}
            </div>
        </div>
    );
}

function SummaryItem({
    icon: Icon,
    label,
    value,
}: {
    icon?: React.ComponentType<{ className?: string }>;
    label: string;
    value?: ReactNode;
}) {
    const hasValue =
        value !== null &&
        value !== undefined &&
        !(typeof value === 'string' && value.trim() === '');

    return (
        <div className="flex items-center justify-between gap-3 py-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
                {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
                <span className="text-sm text-muted-foreground truncate">{label}</span>
            </div>
            <span className="max-w-[55%] text-right text-sm font-medium text-foreground shrink-0">
                {hasValue ? value : '—'}
            </span>
        </div>
    );
}

function ContractDocumentDropzone({
    form,
    onSubmit,
}: {
    form: ReturnType<typeof useForm<{ file: File | null }>>;
    onSubmit: (e: FormEvent) => void;
}) {
    const onDrop = useCallback(
        (accepted: File[]) => form.setData('file', accepted[0] ?? null),
        [form],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        maxFiles: 1,
    });

    return (
        <form onSubmit={onSubmit} className="space-y-3 rounded-xl border bg-muted/20 p-4">
            <div
                {...getRootProps()}
                className={[
                    'cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors',
                    isDragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-muted/40',
                ].join(' ')}
            >
                <input {...getInputProps()} />
                <UploadCloud className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">
                    {isDragActive ? 'Drop the file here...' : 'Drag & drop or click to select'}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">PDF, images, or any document</p>
            </div>

            {form.data.file && (
                <div className="flex items-center justify-between rounded-lg border bg-background px-3 py-2">
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="max-w-[240px] truncate text-sm font-medium">{form.data.file.name}</span>
                        <span className="text-xs text-muted-foreground">
                            {(form.data.file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => form.setData('file', null)}
                    >
                        <X className="h-3.5 w-3.5" />
                    </Button>
                </div>
            )}

            {form.errors.file && (
                <p className="text-sm text-destructive">{form.errors.file}</p>
            )}

            <div className="flex justify-end">
                <Button type="submit" disabled={form.processing || !form.data.file}>
                    <Upload className="mr-2 h-4 w-4" />
                    {form.processing ? 'Uploading...' : 'Upload'}
                </Button>
            </div>
        </form>
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
        router.delete(`/employees/${employee.id}/contracts/${contract.id}`, {
            preserveScroll: true,
            onFinish: () => setShowDeleteDialog(false),
        });
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

            <div className="min-h-screen w-full bg-muted/20">
                <div className="flex min-h-screen flex-col">
                    <div className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                        <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
                            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                                <div className="flex items-start gap-3">
                                    <Link href={`/employees/${employee.id}/contracts`}>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="shrink-0"
                                        >
                                            <ArrowLeft className="h-4 w-4" />
                                        </Button>
                                    </Link>

                                    <div className="min-w-0">
                                        <div className="mb-2 inline-flex items-center rounded-full border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                                            Contract Management
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2">
                                            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                                {contract.contract_number}
                                            </h1>
                                            {contract.is_current && (
                                                <Badge variant="default">Current</Badge>
                                            )}
                                            <Badge
                                                variant={statusBadgeVariant(contract.status)}
                                            >
                                                {formatStatus(contract.status)}
                                            </Badge>
                                        </div>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {employee.full_name} · {employee.staff_number}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                                    <Link href={`/employees/${employee.id}`}>
                                        <Button variant="outline" className="w-full sm:w-auto">
                                            <User className="mr-2 h-4 w-4" />
                                            Employee Profile
                                        </Button>
                                    </Link>

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
                                            onClick={() =>
                                                setShowTerminateDialog(true)
                                            }
                                        >
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Terminate
                                        </Button>
                                    )}

                                    {canUpdate && (
                                        <Link href={contract.links.edit}>
                                            <Button
                                                variant="outline"
                                                className="w-full sm:w-auto"
                                            >
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
                        </div>
                    </div>

                    <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
                        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.8fr)_380px]">
                            <div className="space-y-6">
                                <Card className="border-border/60 shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <p className="text-sm text-muted-foreground">
                                                        Contract overview
                                                    </p>
                                                    <h2 className="text-2xl font-semibold tracking-tight">
                                                        {CONTRACT_TYPE_LABELS[
                                                            contract.contract_type
                                                        ] || contract.contract_type}
                                                    </h2>
                                                    <p className="text-sm text-muted-foreground">
                                                        {contract.job_title ||
                                                            'No job title recorded'}
                                                    </p>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant="outline">
                                                        {contract.department?.name ||
                                                            'No department'}
                                                    </Badge>
                                                    <Badge variant="outline">
                                                        {contract.position?.name ||
                                                            'No position'}
                                                    </Badge>
                                                    {contract.pay_frequency && (
                                                        <Badge variant="secondary">
                                                            {PAY_FREQUENCY_LABELS[
                                                                contract.pay_frequency
                                                            ] || contract.pay_frequency}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">
                                                <DetailBlock
                                                    label="Start Date"
                                                    value={formatDate(contract.start_date)}
                                                />
                                                <DetailBlock
                                                    label="End Date"
                                                    value={
                                                        contract.end_date
                                                            ? formatDate(contract.end_date)
                                                            : 'Open-ended'
                                                    }
                                                />
                                                <DetailBlock
                                                    label="Salary"
                                                    value={formatMoney(
                                                        contract.basic_salary,
                                                        contract.currency,
                                                    )}
                                                />
                                                <DetailBlock
                                                    label="Status"
                                                    value={formatStatus(contract.status)}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="grid gap-6 2xl:grid-cols-2">
                                    <SectionCard
                                        title="Contract Details"
                                        description="Core details and signing information."
                                        icon={FileText}
                                    >
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <DetailBlock
                                                label="Contract Number"
                                                value={contract.contract_number}
                                            />
                                            <DetailBlock
                                                label="Contract Type"
                                                value={
                                                    CONTRACT_TYPE_LABELS[
                                                        contract.contract_type
                                                    ] || contract.contract_type
                                                }
                                            />
                                            <DetailBlock
                                                label="Job Title"
                                                value={contract.job_title}
                                            />
                                            <DetailBlock
                                                label="Signed At"
                                                value={formatDate(contract.signed_at)}
                                            />
                                        </div>
                                    </SectionCard>

                                    <SectionCard
                                        title="Dates"
                                        description="Employment timeline and termination dates."
                                        icon={Calendar}
                                    >
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <DetailBlock
                                                label="Start Date"
                                                value={formatDate(contract.start_date)}
                                            />
                                            <DetailBlock
                                                label="End Date"
                                                value={
                                                    contract.end_date
                                                        ? formatDate(contract.end_date)
                                                        : 'Open-ended'
                                                }
                                            />
                                            <DetailBlock
                                                label="Probation End"
                                                value={formatDate(
                                                    contract.probation_end_date,
                                                )}
                                            />
                                            <DetailBlock
                                                label="Terminated At"
                                                value={formatDate(
                                                    contract.terminated_at,
                                                )}
                                            />
                                        </div>
                                    </SectionCard>

                                    <SectionCard
                                        title="Organisation"
                                        description="Department, position, and pay point."
                                        icon={Building2}
                                    >
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <DetailBlock
                                                label="Department"
                                                value={contract.department?.name}
                                            />
                                            <DetailBlock
                                                label="Position"
                                                value={contract.position?.name}
                                            />
                                            <DetailBlock
                                                label="Pay Point"
                                                value={contract.pay_point}
                                            />
                                        </div>
                                    </SectionCard>

                                    <SectionCard
                                        title="Compensation"
                                        description="Salary, frequency, hours, and leave terms."
                                        icon={CreditCard}
                                    >
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <DetailBlock
                                                label="Basic Salary"
                                                value={formatMoney(
                                                    contract.basic_salary,
                                                    contract.currency,
                                                )}
                                            />
                                            <DetailBlock
                                                label="Pay Frequency"
                                                value={
                                                    contract.pay_frequency
                                                        ? PAY_FREQUENCY_LABELS[
                                                              contract.pay_frequency
                                                          ] || contract.pay_frequency
                                                        : null
                                                }
                                            />
                                            <DetailBlock
                                                label="Working Hours / Week"
                                                value={
                                                    contract.working_hours_per_week
                                                        ? `${contract.working_hours_per_week}h`
                                                        : null
                                                }
                                            />
                                            <DetailBlock
                                                label="Notice Period"
                                                value={
                                                    contract.notice_period_days !=
                                                    null
                                                        ? `${contract.notice_period_days} days`
                                                        : null
                                                }
                                            />
                                            <DetailBlock
                                                label="Leave Days / Year"
                                                value={
                                                    contract.leave_days_per_year !=
                                                    null
                                                        ? `${contract.leave_days_per_year} days`
                                                        : null
                                                }
                                            />
                                        </div>
                                    </SectionCard>
                                </div>

                                {(contract.termination_reason ||
                                    contract.renewal_notes) && (
                                    <SectionCard
                                        title="Notes"
                                        description="Termination and renewal notes attached to this contract."
                                        icon={FileText}
                                    >
                                        <div className="space-y-4">
                                            {contract.termination_reason && (
                                                <div className="rounded-xl border bg-muted/30 p-4">
                                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                        Termination Reason
                                                    </p>
                                                    <p className="mt-1 text-sm text-foreground">
                                                        {contract.termination_reason}
                                                    </p>
                                                </div>
                                            )}

                                            {contract.renewal_notes && (
                                                <div className="rounded-xl border bg-muted/30 p-4">
                                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                        Renewal Notes
                                                    </p>
                                                    <p className="mt-1 text-sm text-foreground">
                                                        {contract.renewal_notes}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </SectionCard>
                                )}

                                <SectionCard
                                    title="Contract Documents"
                                    description="Manage uploaded files linked to this contract."
                                    icon={FileText}
                                >
                                    <div className="space-y-4">
                                        {canManageDocs && (
                                            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-muted/20 p-4">
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        Documents
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Upload, download, or remove files.
                                                    </p>
                                                </div>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        setShowUploadForm(
                                                            !showUploadForm,
                                                        )
                                                    }
                                                >
                                                    {showUploadForm ? (
                                                        <>
                                                            <X className="mr-2 h-4 w-4" />
                                                            Close Upload
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Upload className="mr-2 h-4 w-4" />
                                                            Upload Document
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        )}

                                        {showUploadForm && canManageDocs && (
                                            <ContractDocumentDropzone
                                                form={uploadForm}
                                                onSubmit={handleUpload}
                                            />
                                        )}

                                        {contract.documents.length === 0 ? (
                                            <div className="rounded-xl border border-dashed bg-muted/20 py-12 text-center">
                                                <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                                                <p className="text-sm font-medium">
                                                    No documents uploaded yet
                                                </p>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Attach signed contracts, amendments, or supporting files.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="hidden overflow-x-auto lg:block">
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
                                                            {contract.documents.map(
                                                                (doc) => (
                                                                    <TableRow
                                                                        key={doc.id}
                                                                    >
                                                                        <TableCell className="font-medium">
                                                                            {doc.file_name}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {doc.mime_type ||
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
                                                                ),
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </div>

                                                <div className="grid gap-4 lg:hidden">
                                                    {contract.documents.map((doc) => (
                                                        <Card
                                                            key={doc.id}
                                                            className="border-border/60 shadow-none"
                                                        >
                                                            <CardContent className="space-y-4 p-5">
                                                                <div className="space-y-1">
                                                                    <p className="font-medium">
                                                                        {doc.file_name}
                                                                    </p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {doc.mime_type || 'Unknown type'}
                                                                    </p>
                                                                </div>

                                                                <div className="grid gap-3 sm:grid-cols-2">
                                                                    <DetailBlock
                                                                        label="Size"
                                                                        value={formatFileSize(
                                                                            doc.size,
                                                                        )}
                                                                    />
                                                                    <DetailBlock
                                                                        label="Uploaded"
                                                                        value={formatDate(
                                                                            doc.created_at,
                                                                        )}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-wrap gap-2">
                                                                    <a href={doc.download_url}>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                        >
                                                                            <Download className="mr-2 h-4 w-4" />
                                                                            Download
                                                                        </Button>
                                                                    </a>

                                                                    {canManageDocs && (
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                handleDeleteDocument(
                                                                                    doc,
                                                                                )
                                                                            }
                                                                        >
                                                                            <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                                                            Delete
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </SectionCard>
                            </div>

                            <div className="space-y-6 xl:sticky xl:top-28 xl:self-start">
                                <Card className="border-border/60 shadow-sm">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-xl border bg-muted/50 p-2.5">
                                                <UserSquare2 className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base sm:text-lg">
                                                    Contract Snapshot
                                                </CardTitle>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Quick summary of this contract.
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="divide-y divide-border/60 p-0 px-6 pb-4">
                                        <SummaryItem icon={User} label="Employee" value={employee.full_name} />
                                        <SummaryItem icon={Hash} label="Staff Number" value={employee.staff_number} />
                                        <SummaryItem icon={FileText} label="Contract No." value={contract.contract_number} />
                                        <SummaryItem
                                            icon={Briefcase}
                                            label="Type"
                                            value={CONTRACT_TYPE_LABELS[contract.contract_type] || contract.contract_type}
                                        />
                                        <SummaryItem
                                            icon={CheckCircle2}
                                            label="Status"
                                            value={
                                                <Badge variant={statusBadgeVariant(contract.status)} className="text-[10px]">
                                                    {formatStatus(contract.status)}
                                                </Badge>
                                            }
                                        />
                                        <SummaryItem
                                            icon={Building2}
                                            label="Department"
                                            value={contract.department?.name}
                                        />
                                        <SummaryItem
                                            icon={Briefcase}
                                            label="Position"
                                            value={contract.position?.name}
                                        />
                                        <SummaryItem
                                            icon={Wallet}
                                            label="Salary"
                                            value={formatMoney(contract.basic_salary, contract.currency)}
                                        />
                                        <SummaryItem
                                            icon={Calendar}
                                            label="Start Date"
                                            value={formatDate(contract.start_date)}
                                        />
                                        <SummaryItem
                                            icon={Calendar}
                                            label="End Date"
                                            value={contract.end_date ? formatDate(contract.end_date) : 'Open-ended'}
                                        />
                                        <SummaryItem
                                            icon={FileText}
                                            label="Documents"
                                            value={contract.documents.length.toString()}
                                        />
                                    </CardContent>
                                </Card>

                                <Card className="border-border/60 shadow-sm">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-xl border bg-muted/50 p-2.5">
                                                <Clock className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base sm:text-lg">
                                                    Audit Information
                                                </CardTitle>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Record creation and update details.
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-1">
                                        <SummaryItem
                                            label="Created At"
                                            value={formatDate(contract.created_at)}
                                        />
                                        <SummaryItem
                                            label="Created By"
                                            value={contract.created_by?.name}
                                        />
                                        <SummaryItem
                                            label="Updated At"
                                            value={formatDate(contract.updated_at)}
                                        />
                                        <SummaryItem
                                            label="Updated By"
                                            value={contract.updated_by?.name}
                                        />
                                        <SummaryItem
                                            label="Signed At"
                                            value={formatDate(contract.signed_at)}
                                        />
                                        <SummaryItem
                                            label="Terminated At"
                                            value={formatDate(contract.terminated_at)}
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AlertDialog
                open={showTerminateDialog}
                onOpenChange={setShowTerminateDialog}
            >
                <AlertDialogContent>
                    <form onSubmit={handleTerminate}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Terminate Contract</AlertDialogTitle>
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
                                className="resize-none"
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

            <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Contract</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete contract{' '}
                            <strong>{contract.contract_number}</strong>? This action
                            cannot be undone.
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