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
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
    Banknote,
    BookOpen,
    CalendarDays,
    Clock,
    DollarSign,
    Download,
    FileText,
    Hash,
    PauseCircle,
    Pencil,
    Plus,
    RotateCcw,
    Shield,
    Tag,
    Trash2,
    Upload,
    UserRound,
    Users,
    XCircle,
} from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

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
    employee: {
        id: number;
        full_name: string;
        staff_number: string;
        department?: string | null;
    };
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
    change_log?: ChangeLogEntry[];
    change_logs?: ChangeLogEntry[];
    created_at: string | null;
    updated_at: string | null;
    links: {
        show: string;
        edit: string;
        suspend: string;
        terminate: string;
        reinstate: string;
        document_store: string;
    };
};

type ShowProps = {
    enrollment: EnrollmentPayload;
};

const statusStyles: Record<string, string> = {
    active: 'badge-tone-success',
    draft: 'badge-tone-muted',
    suspended: 'badge-tone-warning',
    terminated: 'badge-tone-danger',
    expired: 'badge-tone-muted',
    cancelled: 'badge-tone-danger',
};

const eventStyles: Record<string, string> = {
    created: 'badge-tone-info',
    activated: 'badge-tone-success',
    suspended: 'badge-tone-warning',
    terminated: 'badge-tone-danger',
    reinstated: 'badge-tone-success',
    updated: 'badge-tone-muted',
};

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(value: string | null) {
    if (!value) return 'Not set';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function formatDateTime(value: string | null) {
    if (!value) return 'Not set';
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

function formatMoney(value: string | number | null | undefined) {
    if (value === null || value === undefined || value === '') return 'Not set';
    const amount = Number(value);
    if (Number.isNaN(amount)) return String(value);
    return amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function formatFileSize(size: number | null) {
    if (!size) return 'Not set';
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function FieldLabel({
    children,
    required,
}: {
    children: ReactNode;
    required?: boolean;
}) {
    return (
        <label className="mb-2 block text-sm font-medium text-foreground">
            {children}
            {required && <span className="ml-1 text-destructive">*</span>}
        </label>
    );
}

function FieldError({ message }: { message?: string }) {
    if (!message) return null;

    return <p className="mt-1.5 text-sm font-medium text-destructive">{message}</p>;
}

function SectionCard({
    title,
    description,
    icon: Icon,
    children,
    className = '',
}: {
    title: string;
    description?: string;
    icon: React.ComponentType<{ className?: string }>;
    children: ReactNode;
    className?: string;
}) {
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
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
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
            <div className="flex min-w-0 items-center gap-2.5">
                {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
                <span className="truncate text-sm text-muted-foreground">{label}</span>
            </div>
            <span className="max-w-[55%] shrink-0 text-right text-sm font-medium text-foreground">
                {hasValue ? value : '—'}
            </span>
        </div>
    );
}

function StatCard({
    title,
    value,
    description,
    icon: Icon,
}: {
    title: string;
    value: string | number;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
}) {
    return (
        <Card className="border-border/60 shadow-sm">
            <CardContent className="flex items-start justify-between p-5">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{description}</p>
                </div>
                <div className="rounded-xl border bg-muted/50 p-2.5">
                    <Icon className="h-5 w-5" />
                </div>
            </CardContent>
        </Card>
    );
}

type DocumentFormData = {
    file: File | null;
    document_type: string;
};

function BenefitDocumentDropzone({
    form,
    onSubmit,
}: {
    form: ReturnType<typeof useForm<DocumentFormData>>;
    onSubmit: (e: FormEvent) => void;
}) {
    const onDrop = useCallback(
        (accepted: File[]) => form.setData('file', accepted[0] ?? null),
        [form],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
    });

    return (
        <SectionCard
            title="Upload Document"
            description="Attach policy files, claims, certificates, or ID copies."
            icon={Upload}
        >
            <form onSubmit={onSubmit} className="space-y-4">
                {/* Drop zone */}
                <div
                    {...getRootProps()}
                    className={`cursor-pointer rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
                        isDragActive
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50 hover:bg-muted/30'
                    }`}
                >
                    <input {...getInputProps()} />
                    <Upload className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                    {isDragActive ? (
                        <p className="text-sm font-medium text-primary">Drop the file here…</p>
                    ) : (
                        <>
                            <p className="text-sm font-medium">
                                Drag &amp; drop a file here, or{' '}
                                <span className="text-primary underline underline-offset-2">
                                    browse
                                </span>
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                PDF, images, Word documents and more
                            </p>
                        </>
                    )}
                </div>

                {/* Selected file preview */}
                {form.data.file && (
                    <div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3">
                        <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                                {form.data.file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {(form.data.file.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => form.setData('file', null)}
                            className="shrink-0 text-muted-foreground hover:text-destructive"
                        >
                            <XCircle className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {form.errors.file && (
                    <p className="text-sm font-medium text-destructive">{form.errors.file}</p>
                )}

                {/* Document type + upload button row */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="flex-1">
                        <FieldLabel>Document Type</FieldLabel>
                        <Select
                            value={form.data.document_type}
                            onValueChange={(v) => form.setData('document_type', v)}
                        >
                            <SelectTrigger>
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

                    <Button
                        type="submit"
                        disabled={form.processing || !form.data.file}
                        className="sm:w-auto"
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        {form.processing ? 'Uploading…' : 'Upload'}
                    </Button>
                </div>
            </form>
        </SectionCard>
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

        dependantForm.put(
            `/benefit-enrollments/${enrollment.id}/dependants/${editingDependant.id}`,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowDependantDialog(false);
                    setEditingDependant(null);
                    dependantForm.reset();
                },
            },
        );
    };

    const handleRemoveDependant = (depId: number) => {
        router.delete(`/benefit-enrollments/${enrollment.id}/dependants/${depId}`, {
            preserveScroll: true,
        });
    };

    const handleUploadDocument = (e: FormEvent) => {
        e.preventDefault();
        documentForm.post(enrollment.links.document_store, {
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

    const handleStatusChange = (action: 'suspend' | 'terminate' | 'reinstate') => {
        router.post(enrollment.links[action], {}, { preserveScroll: true });
    };

    const changeLogEntries = enrollment.change_logs ?? enrollment.change_log ?? [];
    const totalDependants = enrollment.dependants?.length ?? 0;
    const totalDocuments = enrollment.documents?.length ?? 0;

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

            <div className="min-h-screen w-full bg-muted/20">
                <div className="flex min-h-screen flex-col">
                    <div className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                        <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
                            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                                <div className="flex items-start gap-3">
                                    <Link href="/benefit-enrollments">
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
                                            Benefits Management
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2">
                                            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                                Enrollment #{enrollment.id}
                                            </h1>
                                            <Badge
                                                variant="outline"
                                                className={`${statusStyles[enrollment.status] ?? 'badge-tone-muted'} font-semibold`}
                                            >
                                                {formatLabel(enrollment.status)}
                                            </Badge>
                                        </div>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {enrollment.employee.full_name} · {enrollment.benefit.name}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                                    {canSuspend && (
                                        <Button
                                            variant="outline"
                                            type="button"
                                            onClick={() => handleStatusChange('suspend')}
                                        >
                                            <PauseCircle className="mr-2 h-4 w-4" />
                                            Suspend
                                        </Button>
                                    )}

                                    {canTerminate && (
                                        <Button
                                            variant="outline"
                                            type="button"
                                            className="border-destructive/30 text-destructive hover:bg-destructive/10"
                                            onClick={() => handleStatusChange('terminate')}
                                        >
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Terminate
                                        </Button>
                                    )}

                                    {canReinstate && (
                                        <Button
                                            variant="outline"
                                            type="button"
                                            onClick={() => handleStatusChange('reinstate')}
                                        >
                                            <RotateCcw className="mr-2 h-4 w-4" />
                                            Reinstate
                                        </Button>
                                    )}

                                    <Link href={`/benefit-enrollments/${enrollment.id}/edit`}>
                                        <Button className="w-full sm:w-auto">
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit
                                        </Button>
                                    </Link>
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
                                                        Benefit enrollment overview
                                                    </p>
                                                    <h2 className="text-2xl font-semibold tracking-tight">
                                                        {enrollment.benefit.name}
                                                    </h2>
                                                    <p className="text-sm text-muted-foreground">
                                                        {enrollment.plan?.name || 'No plan selected'} ·{' '}
                                                        {formatLabel(enrollment.benefit.category)}
                                                    </p>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant="outline">
                                                        {enrollment.employee.staff_number}
                                                    </Badge>
                                                    <Badge variant="outline">
                                                        {enrollment.employee.department || 'No department'}
                                                    </Badge>
                                                    {enrollment.enrollment_reference && (
                                                        <Badge variant="secondary">
                                                            Ref: {enrollment.enrollment_reference}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">
                                                <DetailBlock
                                                    label="Effective Date"
                                                    value={formatDate(enrollment.effective_date)}
                                                />
                                                <DetailBlock
                                                    label="End Date"
                                                    value={formatDate(enrollment.end_date)}
                                                />
                                                <DetailBlock
                                                    label="Employee Contribution"
                                                    value={formatMoney(
                                                        enrollment.employee_contribution,
                                                    )}
                                                />
                                                <DetailBlock
                                                    label="Employer Contribution"
                                                    value={formatMoney(
                                                        enrollment.employer_contribution,
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                    <StatCard
                                        title="Dependants"
                                        value={totalDependants}
                                        description="Linked to this enrollment"
                                        icon={Users}
                                    />
                                    <StatCard
                                        title="Documents"
                                        value={totalDocuments}
                                        description="Uploaded supporting files"
                                        icon={FileText}
                                    />
                                    <StatCard
                                        title="Status"
                                        value={formatLabel(enrollment.status)}
                                        description="Current enrollment state"
                                        icon={Shield}
                                    />
                                    <StatCard
                                        title="Change Log"
                                        value={changeLogEntries.length}
                                        description="Recorded activity entries"
                                        icon={Clock}
                                    />
                                </div>

                                <Tabs defaultValue="overview" className="space-y-6">
                                    <TabsList className="grid w-full grid-cols-2 gap-2 md:grid-cols-4">
                                        <TabsTrigger value="overview">Overview</TabsTrigger>
                                        <TabsTrigger value="dependants">
                                            Dependants ({totalDependants})
                                        </TabsTrigger>
                                        <TabsTrigger value="documents">
                                            Documents ({totalDocuments})
                                        </TabsTrigger>
                                        <TabsTrigger value="change-log">
                                            Change Log ({changeLogEntries.length})
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="overview" className="space-y-6">
                                        <div className="grid gap-6 2xl:grid-cols-2">
                                            <SectionCard
                                                title="Employee Information"
                                                description="Employee linked to this benefit enrollment."
                                                icon={UserRound}
                                            >
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <DetailBlock
                                                        label="Full Name"
                                                        value={enrollment.employee.full_name}
                                                    />
                                                    <DetailBlock
                                                        label="Staff Number"
                                                        value={enrollment.employee.staff_number}
                                                    />
                                                    <DetailBlock
                                                        label="Department"
                                                        value={
                                                            enrollment.employee.department ||
                                                            'Not set'
                                                        }
                                                    />
                                                </div>
                                            </SectionCard>

                                            <SectionCard
                                                title="Benefit & Plan"
                                                description="Benefit category, plan, and reference details."
                                                icon={Shield}
                                            >
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <DetailBlock
                                                        label="Benefit"
                                                        value={enrollment.benefit.name}
                                                    />
                                                    <DetailBlock
                                                        label="Category"
                                                        value={formatLabel(
                                                            enrollment.benefit.category,
                                                        )}
                                                    />
                                                    <DetailBlock
                                                        label="Plan"
                                                        value={enrollment.plan?.name}
                                                    />
                                                    <DetailBlock
                                                        label="Reference"
                                                        value={enrollment.enrollment_reference}
                                                    />
                                                </div>
                                            </SectionCard>

                                            <SectionCard
                                                title="Status & Dates"
                                                description="Lifecycle and payroll tracking details."
                                                icon={CalendarDays}
                                            >
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <DetailBlock
                                                        label="Status"
                                                        value={
                                                            <Badge
                                                                variant="outline"
                                                                className={`${statusStyles[enrollment.status] ?? 'badge-tone-muted'} font-semibold`}
                                                            >
                                                                {formatLabel(enrollment.status)}
                                                            </Badge>
                                                        }
                                                    />
                                                    <DetailBlock
                                                        label="Payroll Code"
                                                        value={
                                                            enrollment.payroll_deduction_code
                                                        }
                                                    />
                                                    <DetailBlock
                                                        label="Effective Date"
                                                        value={formatDate(
                                                            enrollment.effective_date,
                                                        )}
                                                    />
                                                    <DetailBlock
                                                        label="End Date"
                                                        value={formatDate(enrollment.end_date)}
                                                    />
                                                </div>
                                            </SectionCard>

                                            <SectionCard
                                                title="Contributions"
                                                description="Employee and employer contribution breakdown."
                                                icon={DollarSign}
                                            >
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <DetailBlock
                                                        label="Employee Contribution"
                                                        value={formatMoney(
                                                            enrollment.employee_contribution,
                                                        )}
                                                    />
                                                    <DetailBlock
                                                        label="Employer Contribution"
                                                        value={formatMoney(
                                                            enrollment.employer_contribution,
                                                        )}
                                                    />
                                                </div>
                                            </SectionCard>
                                        </div>

                                        {enrollment.notes && (
                                            <SectionCard
                                                title="Notes"
                                                description="Additional notes saved against this enrollment."
                                                icon={FileText}
                                            >
                                                <div className="rounded-xl border bg-muted/30 p-4">
                                                    <p className="whitespace-pre-wrap text-sm text-foreground">
                                                        {enrollment.notes}
                                                    </p>
                                                </div>
                                            </SectionCard>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="dependants" className="space-y-6">
                                        <Card className="border-border/60 shadow-sm">
                                            <CardHeader className="pb-4">
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                    <div>
                                                        <CardTitle className="text-base sm:text-lg">
                                                            Dependants
                                                        </CardTitle>
                                                        <CardDescription>
                                                            Manage people covered under this enrollment.
                                                        </CardDescription>
                                                    </div>

                                                    <Button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditingDependant(null);
                                                            dependantForm.reset();
                                                            setShowDependantDialog(true);
                                                        }}
                                                    >
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Add Dependant
                                                    </Button>
                                                </div>
                                            </CardHeader>

                                            <CardContent>
                                                {totalDependants === 0 ? (
                                                    <div className="rounded-xl border border-dashed bg-muted/20 py-12 text-center">
                                                        <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                                                        <p className="text-sm font-medium">
                                                            No dependants added yet
                                                        </p>
                                                        <p className="mt-1 text-sm text-muted-foreground">
                                                            Add spouses, children, or other dependants.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        <div className="hidden overflow-x-auto lg:block">
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableRow>
                                                                        <TableHead>Name</TableHead>
                                                                        <TableHead>Relationship</TableHead>
                                                                        <TableHead>Date of Birth</TableHead>
                                                                        <TableHead>National ID</TableHead>
                                                                        <TableHead>Status</TableHead>
                                                                        <TableHead className="text-right">
                                                                            Actions
                                                                        </TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {enrollment.dependants.map((dep) => (
                                                                        <TableRow key={dep.id}>
                                                                            <TableCell className="font-medium">
                                                                                {dep.full_name}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {formatLabel(
                                                                                    dep.relationship,
                                                                                )}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {formatDate(
                                                                                    dep.date_of_birth,
                                                                                )}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {dep.national_id ||
                                                                                    'Not set'}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Badge
                                                                                    variant="outline"
                                                                                    className={`${statusStyles[dep.status] ?? 'badge-tone-muted'} font-semibold`}
                                                                                >
                                                                                    {formatLabel(
                                                                                        dep.status,
                                                                                    )}
                                                                                </Badge>
                                                                            </TableCell>
                                                                            <TableCell className="text-right">
                                                                                <div className="flex items-center justify-end gap-1">
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="icon"
                                                                                        type="button"
                                                                                        title="Edit"
                                                                                        onClick={() =>
                                                                                            handleEditDependant(
                                                                                                dep,
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <Pencil className="h-4 w-4" />
                                                                                    </Button>
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="icon"
                                                                                        type="button"
                                                                                        title="Delete"
                                                                                        onClick={() =>
                                                                                            handleRemoveDependant(
                                                                                                dep.id,
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                                                    </Button>
                                                                                </div>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </div>

                                                        <div className="grid gap-4 lg:hidden">
                                                            {enrollment.dependants.map((dep) => (
                                                                <Card
                                                                    key={dep.id}
                                                                    className="border-border/60 shadow-none"
                                                                >
                                                                    <CardContent className="space-y-4 p-5">
                                                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                                                            <div>
                                                                                <p className="font-semibold">
                                                                                    {dep.full_name}
                                                                                </p>
                                                                                <p className="text-sm text-muted-foreground">
                                                                                    {formatLabel(
                                                                                        dep.relationship,
                                                                                    )}
                                                                                </p>
                                                                            </div>
                                                                            <Badge
                                                                                variant="outline"
                                                                                className={`${statusStyles[dep.status] ?? 'badge-tone-muted'} font-semibold`}
                                                                            >
                                                                                {formatLabel(
                                                                                    dep.status,
                                                                                )}
                                                                            </Badge>
                                                                        </div>

                                                                        <div className="grid gap-3 sm:grid-cols-2">
                                                                            <DetailBlock
                                                                                label="Date of Birth"
                                                                                value={formatDate(
                                                                                    dep.date_of_birth,
                                                                                )}
                                                                            />
                                                                            <DetailBlock
                                                                                label="National ID"
                                                                                value={
                                                                                    dep.national_id
                                                                                }
                                                                            />
                                                                            <DetailBlock
                                                                                label="Contact Number"
                                                                                value={
                                                                                    dep.contact_number
                                                                                }
                                                                            />
                                                                            <DetailBlock
                                                                                label="Notes"
                                                                                value={dep.notes}
                                                                            />
                                                                        </div>

                                                                        <div className="flex flex-wrap gap-2">
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    handleEditDependant(
                                                                                        dep,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                                Edit
                                                                            </Button>
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    handleRemoveDependant(
                                                                                        dep.id,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                                                                Remove
                                                                            </Button>
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="documents" className="space-y-6">
                                        <BenefitDocumentDropzone
                                            form={documentForm}
                                            onSubmit={handleUploadDocument}
                                        />

                                        <Card className="border-border/60 shadow-sm">
                                            <CardHeader className="pb-4">
                                                <CardTitle className="text-base sm:text-lg">
                                                    Documents
                                                </CardTitle>
                                                <CardDescription>
                                                    View, download, and remove files for this enrollment.
                                                </CardDescription>
                                            </CardHeader>

                                            <CardContent>
                                                {totalDocuments === 0 ? (
                                                    <div className="rounded-xl border border-dashed bg-muted/20 py-12 text-center">
                                                        <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                                                        <p className="text-sm font-medium">
                                                            No documents uploaded yet
                                                        </p>
                                                        <p className="mt-1 text-sm text-muted-foreground">
                                                            Upload supporting files to keep the record complete.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        <div className="hidden overflow-x-auto lg:block">
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
                                                                    {enrollment.documents.map((doc) => (
                                                                        <TableRow key={doc.id}>
                                                                            <TableCell className="font-medium">
                                                                                {doc.file_name}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {doc.document_type
                                                                                    ? formatLabel(
                                                                                          doc.document_type,
                                                                                      )
                                                                                    : 'Not set'}
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
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        asChild
                                                                                    >
                                                                                        <a
                                                                                            href={
                                                                                                doc.download_url
                                                                                            }
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                        >
                                                                                            <Download className="mr-2 h-4 w-4" />
                                                                                            Download
                                                                                        </a>
                                                                                    </Button>

                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="icon"
                                                                                        type="button"
                                                                                        title="Delete"
                                                                                        onClick={() =>
                                                                                            handleDeleteDocument(
                                                                                                doc.id,
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                                                    </Button>
                                                                                </div>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </div>

                                                        <div className="grid gap-4 lg:hidden">
                                                            {enrollment.documents.map((doc) => (
                                                                <Card
                                                                    key={doc.id}
                                                                    className="border-border/60 shadow-none"
                                                                >
                                                                    <CardContent className="space-y-4 p-5">
                                                                        <div className="space-y-1">
                                                                            <p className="font-semibold">
                                                                                {doc.file_name}
                                                                            </p>
                                                                            <p className="text-sm text-muted-foreground">
                                                                                {doc.document_type
                                                                                    ? formatLabel(
                                                                                          doc.document_type,
                                                                                      )
                                                                                    : 'Not set'}
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
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                asChild
                                                                            >
                                                                                <a
                                                                                    href={doc.download_url}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                >
                                                                                    <Download className="mr-2 h-4 w-4" />
                                                                                    Download
                                                                                </a>
                                                                            </Button>
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    handleDeleteDocument(
                                                                                        doc.id,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                                                                Delete
                                                                            </Button>
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="change-log" className="space-y-6">
                                        {changeLogEntries.length === 0 ? (
                                            <Card className="border-border/60 shadow-sm">
                                                <CardContent className="py-12 text-center">
                                                    <Clock className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                                                    <p className="text-sm font-medium">
                                                        No change log entries found
                                                    </p>
                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                        Activity will appear here as the enrollment changes.
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        ) : (
                                            <div className="space-y-4">
                                                {changeLogEntries.map((entry) => (
                                                    <Card
                                                        key={entry.id}
                                                        className="border-border/60 shadow-sm"
                                                    >
                                                        <CardContent className="flex gap-4 p-5">
                                                            <div className="mt-0.5 rounded-xl border bg-muted/40 p-2.5">
                                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                            </div>

                                                            <div className="min-w-0 flex-1 space-y-3">
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <Badge
                                                                        variant="outline"
                                                                        className={`${eventStyles[entry.event] ?? eventStyles.updated} font-semibold`}
                                                                    >
                                                                        {formatLabel(entry.event)}
                                                                    </Badge>

                                                                    {entry.from_status &&
                                                                        entry.to_status && (
                                                                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                                                                <Badge
                                                                                    variant="outline"
                                                                                    className={`${statusStyles[entry.from_status] ?? 'badge-tone-muted'} font-semibold`}
                                                                                >
                                                                                    {formatLabel(
                                                                                        entry.from_status,
                                                                                    )}
                                                                                </Badge>
                                                                                <span>→</span>
                                                                                <Badge
                                                                                    variant="outline"
                                                                                    className={`${statusStyles[entry.to_status] ?? 'badge-tone-muted'} font-semibold`}
                                                                                >
                                                                                    {formatLabel(
                                                                                        entry.to_status,
                                                                                    )}
                                                                                </Badge>
                                                                            </div>
                                                                        )}
                                                                </div>

                                                                {entry.reason && (
                                                                    <p className="text-sm text-foreground">
                                                                        {entry.reason}
                                                                    </p>
                                                                )}

                                                                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                                                    <span>
                                                                        {formatDateTime(
                                                                            entry.created_at,
                                                                        )}
                                                                    </span>
                                                                    {entry.changed_by && (
                                                                        <span>
                                                                            by {entry.changed_by.name}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}
                                    </TabsContent>
                                </Tabs>
                            </div>

                            <div className="space-y-6 xl:sticky xl:top-28 xl:self-start">
                                <Card className="border-border/60 shadow-sm">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-xl border bg-muted/50 p-2.5">
                                                <Shield className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base sm:text-lg">
                                                    Enrollment Snapshot
                                                </CardTitle>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Quick summary of the enrollment record.
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="divide-y divide-border/60 p-0 px-6 pb-4">
                                        <SummaryItem icon={UserRound} label="Employee" value={enrollment.employee.full_name} />
                                        <SummaryItem icon={Hash} label="Staff Number" value={enrollment.employee.staff_number} />
                                        <SummaryItem icon={Shield} label="Benefit" value={enrollment.benefit.name} />
                                        <SummaryItem icon={BookOpen} label="Category" value={formatLabel(enrollment.benefit.category)} />
                                        <SummaryItem icon={Tag} label="Plan" value={enrollment.plan?.name} />
                                        <SummaryItem
                                            icon={Shield}
                                            label="Status"
                                            value={
                                                <Badge
                                                    variant="outline"
                                                    className={`${statusStyles[enrollment.status] ?? 'badge-tone-muted'} text-[10px] font-semibold`}
                                                >
                                                    {formatLabel(enrollment.status)}
                                                </Badge>
                                            }
                                        />
                                        <SummaryItem icon={CalendarDays} label="Effective Date" value={formatDate(enrollment.effective_date)} />
                                        <SummaryItem icon={CalendarDays} label="End Date" value={formatDate(enrollment.end_date)} />
                                        <SummaryItem icon={Hash} label="Payroll Code" value={enrollment.payroll_deduction_code} />
                                        <SummaryItem icon={Tag} label="Reference" value={enrollment.enrollment_reference} />
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
                                                    Record Activity
                                                </CardTitle>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Supporting counts and timestamps.
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-1">
                                        <SummaryItem label="Dependants" value={totalDependants} />
                                        <SummaryItem label="Documents" value={totalDocuments} />
                                        <SummaryItem
                                            label="Change Entries"
                                            value={changeLogEntries.length}
                                        />
                                        <SummaryItem
                                            label="Created At"
                                            value={formatDateTime(enrollment.created_at)}
                                        />
                                        <SummaryItem
                                            label="Updated At"
                                            value={formatDateTime(enrollment.updated_at)}
                                        />
                                    </CardContent>
                                </Card>

                                {enrollment.notes && (
                                    <Card className="border-border/60 shadow-sm">
                                        <CardHeader className="pb-4">
                                            <CardTitle className="text-base sm:text-lg">
                                                Notes Preview
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="line-clamp-6 whitespace-pre-wrap text-sm text-muted-foreground">
                                                {enrollment.notes}
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AlertDialog
                open={showDependantDialog}
                onOpenChange={(open) => {
                    setShowDependantDialog(open);
                    if (!open) {
                        setEditingDependant(null);
                        dependantForm.reset();
                    }
                }}
            >
                <AlertDialogContent className="max-w-lg">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-semibold">
                            {editingDependant ? 'Edit Dependant' : 'Add Dependant'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {editingDependant
                                ? 'Update dependant details for this enrollment.'
                                : 'Add a new dependant to this enrollment.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <form
                        onSubmit={
                            editingDependant ? handleUpdateDependant : handleAddDependant
                        }
                        className="space-y-4"
                    >
                        <div>
                            <FieldLabel required>Full Name</FieldLabel>
                            <Input
                                value={dependantForm.data.full_name}
                                onChange={(e) =>
                                    dependantForm.setData('full_name', e.target.value)
                                }
                                placeholder="Full name"
                            />
                            <FieldError message={dependantForm.errors.full_name} />
                        </div>

                        <div>
                            <FieldLabel required>Relationship</FieldLabel>
                            <Select
                                value={dependantForm.data.relationship}
                                onValueChange={(v) =>
                                    dependantForm.setData('relationship', v)
                                }
                            >
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

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <FieldLabel>Date of Birth</FieldLabel>
                                <Input
                                    type="date"
                                    value={dependantForm.data.date_of_birth}
                                    onChange={(e) =>
                                        dependantForm.setData(
                                            'date_of_birth',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>

                            <div>
                                <FieldLabel>National ID</FieldLabel>
                                <Input
                                    value={dependantForm.data.national_id}
                                    onChange={(e) =>
                                        dependantForm.setData(
                                            'national_id',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="ID number"
                                />
                            </div>
                        </div>

                        <div>
                            <FieldLabel>Contact Number</FieldLabel>
                            <Input
                                value={dependantForm.data.contact_number}
                                onChange={(e) =>
                                    dependantForm.setData(
                                        'contact_number',
                                        e.target.value,
                                    )
                                }
                                placeholder="Phone number"
                            />
                        </div>

                        <div>
                            <FieldLabel>Notes</FieldLabel>
                            <Textarea
                                rows={3}
                                value={dependantForm.data.notes}
                                onChange={(e) =>
                                    dependantForm.setData('notes', e.target.value)
                                }
                                placeholder="Additional notes..."
                                className="resize-none"
                            />
                        </div>

                        <AlertDialogFooter>
                            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                            <Button type="submit" disabled={dependantForm.processing}>
                                {dependantForm.processing
                                    ? 'Saving...'
                                    : editingDependant
                                      ? 'Update Dependant'
                                      : 'Add Dependant'}
                            </Button>
                        </AlertDialogFooter>
                    </form>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}