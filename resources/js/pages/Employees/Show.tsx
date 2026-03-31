import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OcrStatusBadge } from '@/components/employees/ocr-status-badge';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { roleBadgeClass, useAuthorization } from '@/lib/authorization';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    Award,
    Briefcase,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    CreditCard,
    Download,
    Droplets,
    FileText,
    HardHat,
    KeyRound,
    RefreshCcw,
    ScanSearch,
    ArrowRight,
    Heart,
    Loader2,
    Lock,
    Mail,
    MapPin,
    Pencil,
    Phone,
    Plus,
    Ruler,
    Save,
    Scale,
    Shirt,
    ShieldAlert,
    ShieldCheck,
    Target,
    TrendingUp,
    Trash2,
    UserCircle2,
    UserCog,
    Users,
    XCircle,
} from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import { useMemo, useState } from 'react';

type RoleItem = { id: number; code: string; name: string };
type LinkedUser = {
    id: number;
    name: string;
    email: string;
    username: string | null;
    role: string | null;
    roles: RoleItem[];
    created_at: string | null;
    updated_at: string | null;
    email_verified_at: string | null;
};
type DocumentTypeItem = {
    id: number;
    code: string;
    name: string;
    sensitivity_level: string | null;
};
type DocumentItem = {
    id: number;
    document_type_id: number;
    title: string;
    file_uri: string;
    file_name: string;
    issue_date: string | null;
    expiry_date: string | null;
    access_policy: string;
    metadata_json: Record<string, unknown> | null;
    created_at: string | null;
    ocr_status: 'uploaded' | 'queued' | 'processing' | 'completed' | 'failed' | null;
    ocr_engine: string | null;
    ocr_language: string | null;
    ocr_page_count: number | null;
    ocr_avg_confidence: number | null;
    ocr_error_message: string | null;
    ocr_processed_at: string | null;
    ocr_enabled?: boolean;
    document_type: DocumentTypeItem | null;
    download_url: string;
    delete_url: string;
    show_url: string;
    ocr_result_url: string;
    retry_ocr_url: string;
};
type NextOfKinItem = {
    id: number;
    full_name: string;
    relationship: string;
    contact_number: string;
    alternate_contact_number: string | null;
    email: string | null;
    address: string;
    is_primary: boolean;
    notes: string | null;
    update_url: string;
    delete_url: string;
};
type PhysicalProfileItem = {
    id: number;
    uniform_size: string | null;
    shirt_size: string | null;
    trouser_size: string | null;
    shoe_size: string | null;
    height_cm: string | number | null;
    weight_kg: string | number | null;
    blood_type: string | null;
    emergency_medical_notes: string | null;
    ppe_notes: string | null;
};
type SkillItem = {
    id: number;
    name: string;
    category: string | null;
    proficiency_level: string;
    proficiency_percent: number;
    certification_name: string | null;
    certification_issuer: string | null;
    certified_at: string | null;
    expires_at: string | null;
    notes: string | null;
    update_url: string;
    delete_url: string;
};
type JobProfileItem = {
    id: number;
    title: string | null;
    employment_type: string | null;
    reports_to: string | null;
    working_hours: string | null;
    location_summary: string | null;
    summary: string | null;
    responsibilities: string | null;
    requirements: string | null;
    review_date: string | null;
};
type KpiItem = {
    id: number;
    title: string;
    description: string | null;
    target_value: string | null;
    current_value: string | null;
    measurement_period: string | null;
    weight: string | number | null;
    progress_percent: number;
    due_date: string | null;
    status: string;
    update_url: string;
    delete_url: string;
};
type EmployeePayload = {
    id: number;
    user_id: number | null;
    staff_number: string;
    first_name: string;
    middle_name: string | null;
    surname: string;
    full_name: string;
    status: string | null;
    date_of_birth: string | null;
    email: string | null;
    national_id: string | null;
    gender: string | null;
    occupation: string | null;
    pay_point: string | null;
    contact_number: string | null;
    alt_phone_number: string | null;
    address: string | null;
    marital_status: string | null;
    nationality: string | null;
    educational_level: string | null;
    department: { id: number; name: string } | null;
    position: { id: number; name: string } | null;
    manager: { id: number; staff_number: string; full_name: string } | null;
    user: LinkedUser | null;
    leave_applications_count: number;
    leave_balances_count: number;
    documents: DocumentItem[];
    next_of_kin: NextOfKinItem[];
    physical_profile: PhysicalProfileItem | null;
    skills: SkillItem[];
    job_profile: JobProfileItem | null;
    kpis: KpiItem[];
    current_contract: {
        id: number;
        contract_number: string;
        contract_type: string;
        status: string;
        start_date: string | null;
        end_date: string | null;
        basic_salary: string | null;
        currency: string | null;
        job_title: string | null;
        department: { id: number; name: string } | null;
        position: { id: number; name: string } | null;
        show_url: string;
    } | null;
    contracts: {
        id: number;
        contract_number: string;
        contract_type: string;
        status: string;
        start_date: string | null;
        end_date: string | null;
        is_current: boolean;
        show_url: string;
    }[];
    asset_assignments: {
        id: number;
        asset: {
            id: number;
            asset_tag: string;
            name: string;
            status: string;
        };
        assigned_at: string | null;
        expected_return_date: string | null;
        returned_at: string | null;
        status: string;
        show_url: string;
    }[];
    scorecards: {
        id: number;
        cycle: { id: number; title: string } | null;
        status: string;
        overall_score: string | null;
        overall_rating: string | null;
        finalized_at: string | null;
        created_at: string | null;
    }[];
    benefit_enrollments: {
        id: number;
        benefit: { id: number; name: string; category: string } | null;
        plan: { id: number; name: string } | null;
        status: string;
        effective_date: string | null;
        end_date: string | null;
        employee_contribution: string | number | null;
        employer_contribution: string | number | null;
        show_url: string;
    }[];
    stats: {
        documents_count: number;
        next_of_kin_count: number;
        skills_count: number;
        kpis_count: number;
        contracts_count: number;
        asset_assignments_count: number;
        scorecards_count: number;
        benefit_enrollments_count: number;
    };
    links: {
        document_index: string;
        document_upload: string;
        document_store: string;
        ocr_enabled?: boolean;
        next_of_kin_store: string;
        physical_profile_store: string;
        skill_store: string;
        job_profile_store: string;
        kpi_store: string;
        contracts_index: string;
        contracts_create: string;
    };
};
type OptionsPayload = {
    document_types: DocumentTypeItem[];
    document_access_policies: string[];
    skill_levels: string[];
    employment_types: string[];
    kpi_statuses: string[];
};

type DocumentFormData = {
    document_type_id: string;
    title: string;
    file: File | null;
    file_uri: string;
    issue_date: string;
    expiry_date: string;
    access_policy: string;
    metadata_json: string;
};

type NextOfKinFormData = {
    full_name: string;
    relationship: string;
    contact_number: string;
    alternate_contact_number: string;
    email: string;
    address: string;
    is_primary: boolean;
    notes: string;
};

type PhysicalProfileFormData = {
    uniform_size: string;
    shirt_size: string;
    trouser_size: string;
    shoe_size: string;
    height_cm: string;
    weight_kg: string;
    blood_type: string;
    emergency_medical_notes: string;
    ppe_notes: string;
};

type SkillFormData = {
    name: string;
    category: string;
    proficiency_level: string;
    proficiency_percent: string;
    certification_name: string;
    certification_issuer: string;
    certified_at: string;
    expires_at: string;
    notes: string;
};

type JobProfileFormData = {
    title: string;
    employment_type: string;
    reports_to: string;
    working_hours: string;
    location_summary: string;
    summary: string;
    responsibilities: string;
    requirements: string;
    review_date: string;
};

type KpiFormData = {
    title: string;
    description: string;
    target_value: string;
    current_value: string;
    measurement_period: string;
    weight: string;
    progress_percent: string;
    due_date: string;
    status: string;
};

export default function EmployeeShow() {
    const { employee, options } = usePage<{
        employee: EmployeePayload;
        options: OptionsPayload;
    }>().props;
    const { can, canAny } = useAuthorization();
    const [activeTab, setActiveTab] = useState('documents');
    const [documentFormOpen, setDocumentFormOpen] = useState(false);
    const [nextOfKinFormOpen, setNextOfKinFormOpen] = useState(false);
    const [physicalFormOpen, setPhysicalFormOpen] = useState(false);
    const [skillFormOpen, setSkillFormOpen] = useState(false);
    const [jobFormOpen, setJobFormOpen] = useState(false);
    const [kpiFormOpen, setKpiFormOpen] = useState(false);
    const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
    const [pdfDownloading, setPdfDownloading] = useState(false);
    const [pdfDownloadError, setPdfDownloadError] = useState<string | null>(
        null,
    );
    const [editingNextOfKinId, setEditingNextOfKinId] = useState<number | null>(
        null,
    );
    const [editingSkillId, setEditingSkillId] = useState<number | null>(null);
    const [editingKpiId, setEditingKpiId] = useState<number | null>(null);
    const topSkills = useMemo(
        () => employee.skills.slice(0, 2),
        [employee.skills],
    );

    const documentForm = useForm<DocumentFormData>({
        document_type_id: '',
        title: '',
        file: null as File | null,
        file_uri: '',
        issue_date: '',
        expiry_date: '',
        access_policy:
            options.document_access_policies[1] ??
            options.document_access_policies[0] ??
            'internal',
        metadata_json: '',
    });
    const nextOfKinForm = useForm<NextOfKinFormData>({
        full_name: '',
        relationship: '',
        contact_number: '',
        alternate_contact_number: '',
        email: '',
        address: '',
        is_primary: employee.next_of_kin.length === 0,
        notes: '',
    });
    const physicalProfileForm = useForm<PhysicalProfileFormData>({
        uniform_size: employee.physical_profile?.uniform_size ?? '',
        shirt_size: employee.physical_profile?.shirt_size ?? '',
        trouser_size: employee.physical_profile?.trouser_size ?? '',
        shoe_size: employee.physical_profile?.shoe_size ?? '',
        height_cm: stringifyNullable(employee.physical_profile?.height_cm),
        weight_kg: stringifyNullable(employee.physical_profile?.weight_kg),
        blood_type: employee.physical_profile?.blood_type ?? '',
        emergency_medical_notes:
            employee.physical_profile?.emergency_medical_notes ?? '',
        ppe_notes: employee.physical_profile?.ppe_notes ?? '',
    });
    const skillForm = useForm<SkillFormData>({
        name: '',
        category: '',
        proficiency_level: options.skill_levels[0] ?? 'Beginner',
        proficiency_percent: '0',
        certification_name: '',
        certification_issuer: '',
        certified_at: '',
        expires_at: '',
        notes: '',
    });
    const jobProfileForm = useForm<JobProfileFormData>({
        title: employee.job_profile?.title ?? employee.position?.name ?? '',
        employment_type: employee.job_profile?.employment_type ?? '',
        reports_to:
            employee.job_profile?.reports_to ??
            employee.manager?.full_name ??
            '',
        working_hours: employee.job_profile?.working_hours ?? '',
        location_summary:
            employee.job_profile?.location_summary ??
            employee.department?.name ??
            '',
        summary: employee.job_profile?.summary ?? '',
        responsibilities: employee.job_profile?.responsibilities ?? '',
        requirements: employee.job_profile?.requirements ?? '',
        review_date: employee.job_profile?.review_date ?? '',
    });
    const kpiForm = useForm<KpiFormData>({
        title: '',
        description: '',
        target_value: '',
        current_value: '',
        measurement_period: '',
        weight: '',
        progress_percent: '0',
        due_date: '',
        status: options.kpi_statuses[0] ?? 'ACTIVE',
    });

    const getInitials = (name: string) =>
        name
            .split(' ')
            .filter(Boolean)
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() || '??';
    const getAge = (dob: string | null) =>
        dob
            ? ` (${Math.abs(new Date(Date.now() - new Date(dob).getTime()).getUTCFullYear() - 1970)} years)`
            : '';
    const canManageEmployee = can('employees.update');
    const canDeleteEmployee = can('employees.delete');
    const canViewDocuments = can('documents.view');
    const canCreateDocuments = can('documents.create');
    const canDeleteDocuments = can('documents.delete');

    const resetNextOfKinForm = () => {
        nextOfKinForm.reset();
        nextOfKinForm.setData('is_primary', employee.next_of_kin.length === 0);
        setEditingNextOfKinId(null);
    };

    const resetSkillForm = () => {
        skillForm.reset();
        skillForm.setData(
            'proficiency_level',
            options.skill_levels[0] ?? 'Beginner',
        );
        skillForm.setData('proficiency_percent', '0');
        setEditingSkillId(null);
    };

    const resetKpiForm = () => {
        kpiForm.reset();
        kpiForm.setData('progress_percent', '0');
        kpiForm.setData('status', options.kpi_statuses[0] ?? 'ACTIVE');
        setEditingKpiId(null);
    };

    const destroyEmployee = () => {
        router.delete(`/employees/${employee.id}`, { preserveScroll: true });
    };

    const downloadEmployeePdf = async () => {
        setPdfDownloading(true);
        setPdfDownloadError(null);

        try {
            const response = await fetch(`/employees/${employee.id}/pdf`, {
                credentials: 'same-origin',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                throw new Error(
                    `Download failed with status ${response.status}.`,
                );
            }

            const blob = await response.blob();
            const disposition = response.headers.get('content-disposition');
            const matchedFileName = disposition?.match(
                /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i,
            )?.[1];
            const fileName = decodeURIComponent(
                matchedFileName || `${employee.full_name}-profile.pdf`,
            );
            const objectUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = objectUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(objectUrl);
            setPdfDialogOpen(false);
        } catch (error) {
            setPdfDownloadError(
                error instanceof Error
                    ? error.message
                    : 'Failed to download the employee PDF.',
            );
        } finally {
            setPdfDownloading(false);
        }
    };

    const submitDocument = (event: FormEvent) => {
        event.preventDefault();
        documentForm.post(employee.links.document_store, {
            preserveScroll: true,
            preserveState: true,
            forceFormData: true,
            errorBag: 'documentForm',
            onSuccess: () => {
                documentForm.reset();
                documentForm.setData(
                    'access_policy',
                    options.document_access_policies[1] ??
                        options.document_access_policies[0] ??
                        'internal',
                );
                setDocumentFormOpen(false);
            },
        });
    };

    const submitNextOfKin = (event: FormEvent) => {
        event.preventDefault();
        const url = editingNextOfKinId
            ? employee.next_of_kin.find(
                  (item) => item.id === editingNextOfKinId,
              )?.update_url
            : employee.links.next_of_kin_store;

        if (!url) {
            return;
        }

        const request = editingNextOfKinId
            ? nextOfKinForm.put
            : nextOfKinForm.post;
        request(url, {
            preserveScroll: true,
            preserveState: true,
            errorBag: 'nextOfKinForm',
            onSuccess: () => {
                resetNextOfKinForm();
                setNextOfKinFormOpen(false);
            },
        });
    };

    const submitPhysicalProfile = (event: FormEvent) => {
        event.preventDefault();
        physicalProfileForm.post(employee.links.physical_profile_store, {
            preserveScroll: true,
            preserveState: true,
            errorBag: 'physicalProfileForm',
            onSuccess: () => setPhysicalFormOpen(false),
        });
    };

    const submitSkill = (event: FormEvent) => {
        event.preventDefault();
        const url = editingSkillId
            ? employee.skills.find((item) => item.id === editingSkillId)
                  ?.update_url
            : employee.links.skill_store;

        if (!url) {
            return;
        }

        const request = editingSkillId ? skillForm.put : skillForm.post;
        request(url, {
            preserveScroll: true,
            preserveState: true,
            errorBag: 'skillForm',
            onSuccess: () => {
                resetSkillForm();
                setSkillFormOpen(false);
            },
        });
    };

    const submitJobProfile = (event: FormEvent) => {
        event.preventDefault();
        jobProfileForm.post(employee.links.job_profile_store, {
            preserveScroll: true,
            preserveState: true,
            errorBag: 'jobProfileForm',
            onSuccess: () => setJobFormOpen(false),
        });
    };

    const submitKpi = (event: FormEvent) => {
        event.preventDefault();
        const url = editingKpiId
            ? employee.kpis.find((item) => item.id === editingKpiId)?.update_url
            : employee.links.kpi_store;

        if (!url) {
            return;
        }

        const request = editingKpiId ? kpiForm.put : kpiForm.post;
        request(url, {
            preserveScroll: true,
            preserveState: true,
            errorBag: 'kpiForm',
            onSuccess: () => {
                resetKpiForm();
                setKpiFormOpen(false);
            },
        });
    };

    const startNextOfKinEdit = (item: NextOfKinItem) => {
        nextOfKinForm.setData('full_name', item.full_name);
        nextOfKinForm.setData('relationship', item.relationship);
        nextOfKinForm.setData('contact_number', item.contact_number);
        nextOfKinForm.setData(
            'alternate_contact_number',
            item.alternate_contact_number ?? '',
        );
        nextOfKinForm.setData('email', item.email ?? '');
        nextOfKinForm.setData('address', item.address);
        nextOfKinForm.setData('is_primary', item.is_primary);
        nextOfKinForm.setData('notes', item.notes ?? '');
        setEditingNextOfKinId(item.id);
        setNextOfKinFormOpen(true);
        setActiveTab('family');
    };

    const startSkillEdit = (item: SkillItem) => {
        skillForm.setData('name', item.name);
        skillForm.setData('category', item.category ?? '');
        skillForm.setData('proficiency_level', item.proficiency_level);
        skillForm.setData(
            'proficiency_percent',
            item.proficiency_percent.toString(),
        );
        skillForm.setData('certification_name', item.certification_name ?? '');
        skillForm.setData(
            'certification_issuer',
            item.certification_issuer ?? '',
        );
        skillForm.setData('certified_at', item.certified_at ?? '');
        skillForm.setData('expires_at', item.expires_at ?? '');
        skillForm.setData('notes', item.notes ?? '');
        setEditingSkillId(item.id);
        setSkillFormOpen(true);
        setActiveTab('skills');
    };

    const startKpiEdit = (item: KpiItem) => {
        kpiForm.setData('title', item.title);
        kpiForm.setData('description', item.description ?? '');
        kpiForm.setData('target_value', item.target_value ?? '');
        kpiForm.setData('current_value', item.current_value ?? '');
        kpiForm.setData('measurement_period', item.measurement_period ?? '');
        kpiForm.setData('weight', stringifyNullable(item.weight));
        kpiForm.setData('progress_percent', item.progress_percent.toString());
        kpiForm.setData('due_date', item.due_date ?? '');
        kpiForm.setData('status', item.status);
        setEditingKpiId(item.id);
        setKpiFormOpen(true);
        setActiveTab('job');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Employees', href: '/employees' },
                { title: employee.full_name, href: '#' },
            ]}
        >
            <Head title={`${employee.full_name} - Employee Profile`} />
            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-8 bg-muted/5 p-4 md:p-6 lg:p-8 xl:p-12">
                <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-5">
                        <Avatar className="h-16 w-16 border-2 border-background shadow-sm ring-1 ring-border">
                            <AvatarFallback className="bg-muted text-xl font-bold text-foreground">
                                {getInitials(employee.full_name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                                    {employee.full_name}
                                </h1>
                                <Badge
                                    variant="outline"
                                    className={statusBadgeClass(
                                        employee.status,
                                    )}
                                >
                                    {formatLabel(employee.status ?? 'unknown')}
                                </Badge>
                            </div>
                            <p className="mt-1 text-sm font-medium text-muted-foreground">
                                Staff ID: EMP-{employee.staff_number} •{' '}
                                {employee.position?.name ||
                                    'Unassigned Position'}
                            </p>
                        </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                        <AlertDialog
                            open={pdfDialogOpen}
                            onOpenChange={(open) => {
                                if (pdfDownloading) {
                                    return;
                                }

                                setPdfDialogOpen(open);

                                if (!open) {
                                    setPdfDownloadError(null);
                                }
                            }}
                        >
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="h-10 border-border bg-background px-6 font-bold shadow-sm"
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Export PDF
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Download employee PDF
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Generate and download the latest employee
                                        profile PDF for {employee.full_name}.
                                    </AlertDialogDescription>
                                    {pdfDownloadError && (
                                        <p className="text-sm font-medium text-destructive">
                                            {pdfDownloadError}
                                        </p>
                                    )}
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel disabled={pdfDownloading}>
                                        Cancel
                                    </AlertDialogCancel>
                                    <Button
                                        type="button"
                                        onClick={() => void downloadEmployeePdf()}
                                        disabled={pdfDownloading}
                                    >
                                        {pdfDownloading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Preparing PDF...
                                            </>
                                        ) : (
                                            <>
                                                <Download className="mr-2 h-4 w-4" />
                                                Download PDF
                                            </>
                                        )}
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        {canManageEmployee && (
                            <Button
                                asChild
                                variant="outline"
                                className="h-10 border-border bg-background px-6 font-bold shadow-sm"
                            >
                                <Link href={`/employees/${employee.id}/edit`}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit Profile
                                </Link>
                            </Button>
                        )}
                        {canDeleteEmployee && (
                            <DeleteActionButton
                                title="Delete employee"
                                description={`Delete ${employee.full_name}. This action cannot be undone.`}
                                onConfirm={destroyEmployee}
                                triggerClassName="h-10 px-6"
                                label={
                                    <>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </>
                                }
                            />
                        )}
                    </div>
                </div>
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
                    <MetricCard
                        icon={<Building2 className="h-5 w-5" />}
                        label="Department"
                        value={employee.department?.name || 'Not assigned'}
                    />
                    <MetricCard
                        icon={<Briefcase className="h-5 w-5" />}
                        label="Position"
                        value={employee.position?.name || 'Not assigned'}
                    />
                    <MetricCard
                        icon={<CreditCard className="h-5 w-5" />}
                        label="Pay Point"
                        value={employee.pay_point || 'Not assigned'}
                    />
                </div>
                <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12 xl:gap-12">
                    <div className="space-y-8 lg:col-span-8">
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-widest text-foreground uppercase">
                                    <UserCircle2 className="h-5 w-5 text-muted-foreground" />
                                    Core Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8">
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                    <DetailItem
                                        icon={<Calendar className="h-3 w-3" />}
                                        label="Date of Birth"
                                        value={
                                            employee.date_of_birth
                                                ? `${employee.date_of_birth}${getAge(employee.date_of_birth)}`
                                                : 'Not provided'
                                        }
                                    />
                                    <DetailItem
                                        icon={<Phone className="h-3 w-3" />}
                                        label="Contact Number"
                                        value={
                                            employee.contact_number ||
                                            'Not provided'
                                        }
                                    />
                                    <DetailItem
                                        icon={<Phone className="h-3 w-3" />}
                                        label="Alternate Phone"
                                        value={
                                            employee.alt_phone_number ||
                                            'Not provided'
                                        }
                                    />
                                    <DetailItem
                                        icon={<CreditCard className="h-3 w-3" />}
                                        label="National ID"
                                        value={
                                            employee.national_id ||
                                            'Not provided'
                                        }
                                    />
                                    <DetailItem
                                        icon={<Users className="h-3 w-3" />}
                                        label="Gender"
                                        value={employee.gender || 'Not provided'}
                                    />
                                    <DetailItem
                                        icon={<Users className="h-3 w-3" />}
                                        label="Marital Status"
                                        value={
                                            employee.marital_status ||
                                            'Not provided'
                                        }
                                    />
                                    <DetailItem
                                        icon={<MapPin className="h-3 w-3" />}
                                        label="Nationality"
                                        value={
                                            employee.nationality ||
                                            'Not provided'
                                        }
                                    />
                                    <DetailItem
                                        icon={<Award className="h-3 w-3" />}
                                        label="Educational Level"
                                        value={
                                            employee.educational_level ||
                                            'Not provided'
                                        }
                                    />
                                    <DetailItem
                                        icon={<Briefcase className="h-3 w-3" />}
                                        label="Occupation"
                                        value={
                                            employee.occupation ||
                                            'Not provided'
                                        }
                                    />
                                    <div className="space-y-1 md:col-span-2">
                                        <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            <MapPin className="h-3 w-3" />
                                            Home Address
                                        </p>
                                        <p className="max-w-md text-sm leading-relaxed font-bold text-foreground">
                                            {employee.address || 'Not provided'}
                                        </p>
                                    </div>
                                    <div className="space-y-1 border-t border-border/50 pt-4">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Reporting Manager
                                        </p>
                                        <div className="mt-1 flex items-center gap-2">
                                            {employee.manager ? (
                                                <>
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarFallback className="border border-border bg-muted text-[10px] text-foreground">
                                                            {getInitials(
                                                                employee.manager
                                                                    .full_name,
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    {can('employees.view') ? (
                                                        <Link
                                                            href={`/employees/${employee.manager.id}`}
                                                            className="text-sm font-bold text-foreground hover:underline"
                                                        >
                                                            {
                                                                employee.manager
                                                                    .full_name
                                                            }
                                                        </Link>
                                                    ) : (
                                                        <p className="text-sm font-bold text-foreground">
                                                            {
                                                                employee.manager
                                                                    .full_name
                                                            }
                                                        </p>
                                                    )}
                                                </>
                                            ) : (
                                                <p className="text-sm font-bold text-foreground">
                                                    None assigned
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <DetailItem
                                        icon={<Mail className="h-3 w-3" />}
                                        label="Work Email"
                                        value={
                                            employee.email ||
                                            employee.user?.email ||
                                            'No email linked'
                                        }
                                        className="border-t border-border/50 pt-4"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                        <Tabs
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="w-full"
                        >
                            <div className="border-b border-border/60">
                                <TabsList className="flex h-auto w-full justify-start gap-6 rounded-none bg-transparent p-0 overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                                    <TabsTrigger
                                        value="documents"
                                        className={tabClass}
                                    >
                                        Documents
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="family"
                                        className={tabClass}
                                    >
                                        Family & Kin
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="physical"
                                        className={tabClass}
                                    >
                                        Physical Attributes
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="skills"
                                        className={tabClass}
                                    >
                                        Skills
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="job"
                                        className={tabClass}
                                    >
                                        Job Description & KPIs
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="contracts"
                                        className={tabClass}
                                    >
                                        Contracts
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="assets"
                                        className={tabClass}
                                    >
                                        Assets
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="performance"
                                        className={tabClass}
                                    >
                                        Performance
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="benefits"
                                        className={tabClass}
                                    >
                                        Benefits
                                    </TabsTrigger>
                                </TabsList>
                            </div>
                            <TabsContent
                                value="documents"
                                className="mt-8 space-y-6 focus-visible:ring-0"
                            >
                                <DocumentsTab
                                    employee={employee}
                                    options={options}
                                    canViewDocuments={canViewDocuments}
                                    canCreateDocuments={canCreateDocuments}
                                    canDeleteDocuments={canDeleteDocuments}
                                    open={documentFormOpen}
                                    setOpen={setDocumentFormOpen}
                                    form={documentForm}
                                    onSubmit={submitDocument}
                                />
                            </TabsContent>
                            <TabsContent
                                value="family"
                                className="mt-8 space-y-6 focus-visible:ring-0"
                            >
                                <FamilyTab
                                    employee={employee}
                                    canManageEmployee={canManageEmployee}
                                    open={nextOfKinFormOpen}
                                    setOpen={setNextOfKinFormOpen}
                                    editingId={editingNextOfKinId}
                                    form={nextOfKinForm}
                                    onSubmit={submitNextOfKin}
                                    onEdit={startNextOfKinEdit}
                                    onReset={resetNextOfKinForm}
                                />
                            </TabsContent>
                            <TabsContent
                                value="physical"
                                className="mt-8 space-y-6 focus-visible:ring-0"
                            >
                                <PhysicalTab
                                    employee={employee}
                                    canManageEmployee={canManageEmployee}
                                    open={physicalFormOpen}
                                    setOpen={setPhysicalFormOpen}
                                    form={physicalProfileForm}
                                    onSubmit={submitPhysicalProfile}
                                />
                            </TabsContent>
                            <TabsContent
                                value="skills"
                                className="mt-8 space-y-6 focus-visible:ring-0"
                            >
                                <SkillsTab
                                    employee={employee}
                                    options={options}
                                    canManageEmployee={canManageEmployee}
                                    open={skillFormOpen}
                                    setOpen={setSkillFormOpen}
                                    editingId={editingSkillId}
                                    form={skillForm}
                                    onSubmit={submitSkill}
                                    onEdit={startSkillEdit}
                                    onReset={resetSkillForm}
                                />
                            </TabsContent>
                            <TabsContent
                                value="job"
                                className="mt-8 space-y-6 focus-visible:ring-0"
                            >
                                <JobTab
                                    employee={employee}
                                    options={options}
                                    canManageEmployee={canManageEmployee}
                                    jobOpen={jobFormOpen}
                                    setJobOpen={setJobFormOpen}
                                    kpiOpen={kpiFormOpen}
                                    setKpiOpen={setKpiFormOpen}
                                    editingKpiId={editingKpiId}
                                    jobForm={jobProfileForm}
                                    kpiForm={kpiForm}
                                    onSubmitJob={submitJobProfile}
                                    onSubmitKpi={submitKpi}
                                    onEditKpi={startKpiEdit}
                                    onResetKpi={resetKpiForm}
                                />
                            </TabsContent>
                            <TabsContent
                                value="contracts"
                                className="mt-8 space-y-6 focus-visible:ring-0"
                            >
                                <ContractsTab employee={employee} />
                            </TabsContent>
                            <TabsContent
                                value="assets"
                                className="mt-8 space-y-6 focus-visible:ring-0"
                            >
                                <AssetsTab employee={employee} />
                            </TabsContent>
                            <TabsContent
                                value="performance"
                                className="mt-8 space-y-6 focus-visible:ring-0"
                            >
                                <PerformanceTab employee={employee} />
                            </TabsContent>
                            <TabsContent
                                value="benefits"
                                className="mt-8 space-y-6 focus-visible:ring-0"
                            >
                                <BenefitsTab employee={employee} />
                            </TabsContent>
                        </Tabs>
                    </div>
                    <div className="space-y-6 lg:col-span-4">
                        <LinkedUserCard
                            employee={employee}
                            canAny={canAny}
                            canCreateUser={can('users.create')}
                            getInitials={getInitials}
                        />
                        <PhysicalSummaryCard employee={employee} />
                        <SkillsSummaryCard topSkills={topSkills} />
                        <KpiSnapshotCard employee={employee} />
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center justify-between gap-4 border-t bg-background px-8 py-6 text-[11px] font-medium text-muted-foreground md:flex-row">
                <p>© 2024 HRMS Enterprise Portal. All rights reserved.</p>
            </div>
        </AppLayout>
    );
}

function MetricCard({
    icon,
    label,
    value,
}: {
    icon: ReactNode;
    label: string;
    value: string;
}) {
    return (
        <Card className="border-border bg-background shadow-sm">
            <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
                    {icon}
                </div>
                <div>
                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                        {label}
                    </p>
                    <p className="mt-0.5 text-base font-bold text-foreground">
                        {value}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

function DetailItem({
    icon,
    label,
    value,
    className = '',
}: {
    icon: ReactNode;
    label: string;
    value: string;
    className?: string;
}) {
    return (
        <div className={`space-y-1 ${className}`.trim()}>
            <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                {icon}
                {label}
            </p>
            <p className="text-sm font-bold text-foreground">{value}</p>
        </div>
    );
}

function SectionHeader({
    title,
    description,
    action,
}: {
    title: string;
    description: string;
    action?: ReactNode;
}) {
    return (
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
                <p className="mt-0.5 text-sm font-medium text-muted-foreground">
                    {description}
                </p>
            </div>
            {action}
        </div>
    );
}

function FormField({
    label,
    children,
    error,
    required = false,
}: {
    label: string;
    children: ReactNode;
    error?: string;
    required?: boolean;
}) {
    return (
        <div className="space-y-3">
            <Label className="text-sm font-semibold">
                {label}
                {required && <span className="text-destructive"> *</span>}
            </Label>
            {children}
            {error && (
                <p className="text-xs font-medium text-destructive">{error}</p>
            )}
        </div>
    );
}

function InlineInputField({
    label,
    value,
    onChange,
    error,
    type = 'text',
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    type?: string;
}) {
    return (
        <FormField label={label} error={error}>
            <Input
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="h-11 bg-background"
            />
        </FormField>
    );
}

function SummaryTile({
    icon,
    label,
    value,
}: {
    icon: ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="space-y-1.5 rounded-xl border border-border bg-background p-5 shadow-sm">
            <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                {icon}
                {label}
            </p>
            <p className="text-lg font-bold text-foreground">{value}</p>
        </div>
    );
}

function NotesCard({
    title,
    content,
}: {
    title: string;
    content?: string | null;
}) {
    return (
        <Card className="border-border bg-background shadow-sm">
            <CardContent className="space-y-2 p-5">
                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                    {title}
                </p>
                <p className="text-sm leading-relaxed font-medium text-foreground">
                    {content || 'Not recorded'}
                </p>
            </CardContent>
        </Card>
    );
}

function EmptyState({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <Card className="border-dashed border-border bg-background shadow-sm">
            <CardContent className="flex flex-col items-center justify-center gap-2 p-10 text-center">
                <p className="text-base font-bold text-foreground">{title}</p>
                <p className="max-w-md text-sm font-medium text-muted-foreground">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}

function DeleteActionButton({
    title,
    description,
    onConfirm,
    triggerClassName = 'h-8 w-8',
    label,
}: {
    title: string;
    description: string;
    onConfirm: () => void;
    triggerClassName?: string;
    label?: ReactNode;
}) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant={label ? 'destructive' : 'ghost'}
                    size={label ? 'default' : 'icon'}
                    className={
                        label
                            ? `font-bold shadow-sm ${triggerClassName}`
                            : `${triggerClassName} text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive`
                    }
                >
                    {label || <Trash2 className="h-4 w-4" />}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-destructive">
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        onClick={onConfirm}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function LinkedUserCard({
    employee,
    canAny,
    canCreateUser,
    getInitials,
}: {
    employee: EmployeePayload;
    canAny: (permissions: string[]) => boolean;
    canCreateUser: boolean;
    getInitials: (value: string) => string;
}) {
    const user = employee.user;
    return (
        <Card className="border-border bg-background shadow-sm">
            <CardHeader className="border-b border-border/50 pb-4">
                <CardTitle className="flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                    <UserCog className="h-3.5 w-3.5" />
                    Linked User Account
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {user ? (
                    <>
                        {/* Avatar + name block */}
                        <div className="flex items-center gap-4 p-6 pb-5">
                            <Avatar className="h-14 w-14 border-2 border-border shadow-sm">
                                <AvatarFallback className="bg-primary/10 text-base font-bold text-primary">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-foreground">
                                    {user.name}
                                </p>
                                {user.username && (
                                    <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">
                                        @{user.username}
                                    </p>
                                )}
                                <div className="mt-1 flex items-center gap-1">
                                    {user.email_verified_at ? (
                                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                    ) : (
                                        <XCircle className="h-3 w-3 text-amber-500" />
                                    )}
                                    <span className="text-[10px] font-semibold text-muted-foreground">
                                        {user.email_verified_at ? 'Verified' : 'Unverified'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Detail rows */}
                        <div className="divide-y divide-border/60 border-t border-border/60">
                            <div className="flex items-center gap-3 px-6 py-3">
                                <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                <span className="truncate text-xs font-medium text-foreground">{user.email}</span>
                            </div>
                            {user.created_at && (
                                <div className="flex items-center gap-3 px-6 py-3">
                                    <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                    <span className="text-xs font-medium text-foreground">
                                        Joined {new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-start gap-3 px-6 py-3">
                                <KeyRound className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                <div className="flex flex-wrap gap-1.5">
                                    {user.roles.length > 0 ? (
                                        user.roles.map((role) => (
                                            <Badge
                                                key={role.id}
                                                variant="outline"
                                                className={`px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase shadow-none ${roleBadgeClass(role.code, role.name)}`}
                                            >
                                                {role.code}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-xs text-muted-foreground">No roles assigned</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer action */}
                        {canAny(['users.view', 'users.update']) && (
                            <div className="border-t border-border/60 p-4">
                                <Button
                                    asChild
                                    variant="outline"
                                    className="h-9 w-full border-border font-bold shadow-sm"
                                >
                                    <Link href={`/users/${user.id}`} className="flex items-center gap-2">
                                        <ShieldCheck className="h-3.5 w-3.5" />
                                        Manage Permissions
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-4 px-6 py-10 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <Lock className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-foreground">No account linked</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                This employee doesn't have a system login yet.
                            </p>
                        </div>
                        {canCreateUser && (
                            <Button
                                asChild
                                variant="outline"
                                className="h-9 w-full border-border font-bold shadow-sm"
                            >
                                <Link href="/users/create" className="flex items-center gap-2">
                                    <UserCog className="h-3.5 w-3.5" />
                                    Create Account
                                </Link>
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function PhysicalSummaryCard({ employee }: { employee: EmployeePayload }) {
    const p = employee.physical_profile;
    const rows: { icon: ReactNode; label: string; value: string }[] = [
        {
            icon: <Ruler className="h-3.5 w-3.5 text-muted-foreground" />,
            label: 'Height',
            value: p?.height_cm ? `${p.height_cm} cm` : '—',
        },
        {
            icon: <Scale className="h-3.5 w-3.5 text-muted-foreground" />,
            label: 'Weight',
            value: p?.weight_kg ? `${p.weight_kg} kg` : '—',
        },
        {
            icon: <Droplets className="h-3.5 w-3.5 text-muted-foreground" />,
            label: 'Blood Type',
            value: p?.blood_type ?? '—',
        },
        {
            icon: <Shirt className="h-3.5 w-3.5 text-muted-foreground" />,
            label: 'Uniform',
            value: p?.uniform_size ?? '—',
        },
        {
            icon: <Shirt className="h-3.5 w-3.5 text-muted-foreground" />,
            label: 'Shirt / Trouser',
            value: p ? `${p.shirt_size || '—'} / ${p.trouser_size || '—'}` : '—',
        },
        {
            icon: <Ruler className="h-3.5 w-3.5 text-muted-foreground" />,
            label: 'Shoe Size',
            value: p?.shoe_size ?? '—',
        },
    ];
    return (
        <Card className="border-border bg-background shadow-sm">
            <CardHeader className="border-b border-border/50 pb-4">
                <CardTitle className="flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                    <Ruler className="h-3.5 w-3.5" />
                    Physical Attributes
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-border/60">
                    {rows.map(({ icon, label, value }) => (
                        <div key={label} className="flex items-center justify-between gap-3 px-6 py-3">
                            <div className="flex items-center gap-2.5">
                                {icon}
                                <span className="text-xs font-medium text-muted-foreground">{label}</span>
                            </div>
                            <span className="text-xs font-bold text-foreground">{value}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function skillLevelColors(level: string): { badge: string; bar: string; text: string } {
    const l = level.toLowerCase();
    if (l.includes('expert') || l.includes('master'))
        return {
            badge: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400',
            bar: '[&>div]:bg-emerald-500',
            text: 'text-emerald-600 dark:text-emerald-400',
        };
    if (l.includes('advanced'))
        return {
            badge: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400',
            bar: '[&>div]:bg-violet-500',
            text: 'text-violet-600 dark:text-violet-400',
        };
    if (l.includes('intermediate'))
        return {
            badge: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400',
            bar: '[&>div]:bg-amber-500',
            text: 'text-amber-600 dark:text-amber-400',
        };
    if (l.includes('elementary') || l.includes('basic'))
        return {
            badge: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
            bar: '[&>div]:bg-blue-500',
            text: 'text-blue-600 dark:text-blue-400',
        };
    // Beginner / Novice / fallback
    return {
        badge: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400',
        bar: '[&>div]:bg-slate-400',
        text: 'text-slate-500 dark:text-slate-400',
    };
}

function SkillsSummaryCard({ topSkills }: { topSkills: SkillItem[] }) {
    return (
        <Card className="border-border bg-background shadow-sm">
            <CardHeader className="border-b border-border/50 pb-4">
                <CardTitle className="flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                    <Award className="h-4 w-4" />
                    Skills & Certifications
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 p-6">
                {topSkills.length === 0 ? (
                    <p className="text-sm font-medium text-muted-foreground">
                        No skills recorded yet.
                    </p>
                ) : (
                    topSkills.map((skill) => {
                        const colors = skillLevelColors(skill.proficiency_level);
                        return (
                            <div key={skill.id} className="space-y-2">
                                <div className="flex items-center justify-between text-xs font-bold">
                                    <span className="text-foreground">{skill.name}</span>
                                    <span className={`text-[10px] font-bold ${colors.text}`}>
                                        {skill.proficiency_level}
                                    </span>
                                </div>
                                <Progress
                                    value={skill.proficiency_percent}
                                    className={`h-1.5 border border-border/50 bg-muted ${colors.bar}`}
                                />
                            </div>
                        );
                    })
                )}
            </CardContent>
        </Card>
    );
}

function kpiBarColor(status: string) {
    const s = status.toLowerCase();
    if (s === 'completed') return '[&>div]:bg-emerald-500';
    if (s === 'on_track' || s === 'active') return '[&>div]:bg-primary';
    if (s === 'at_risk') return '[&>div]:bg-amber-500';
    return '[&>div]:bg-foreground';
}

function KpiSnapshotCard({ employee }: { employee: EmployeePayload }) {
    const kpis = employee.kpis;
    const avgProgress = kpis.length
        ? Math.round(kpis.reduce((sum, k) => sum + k.progress_percent, 0) / kpis.length)
        : 0;
    const onTrackCount = kpis.filter((k) =>
        ['on_track', 'active', 'completed'].includes(k.status.toLowerCase()),
    ).length;

    return (
        <Card className="border-border bg-background shadow-sm">
            <CardHeader className="border-b border-border/50 pb-4">
                <CardTitle className="flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                    <Target className="h-3.5 w-3.5" />
                    KPI Snapshot
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {/* Aggregate stats */}
                <div className="grid grid-cols-3 divide-x divide-border/60 border-b border-border/60">
                    <div className="flex flex-col items-center gap-0.5 py-4">
                        <span className="text-xl font-bold text-foreground">{kpis.length}</span>
                        <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Total</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 py-4">
                        <span className="text-xl font-bold text-foreground">{avgProgress}%</span>
                        <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Avg</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 py-4">
                        <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{onTrackCount}</span>
                        <div className="flex items-center gap-1">
                            <TrendingUp className="h-2.5 w-2.5 text-emerald-500" />
                            <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">On Track</span>
                        </div>
                    </div>
                </div>

                {/* Overall progress bar */}
                {kpis.length > 0 && (
                    <div className="px-5 pt-4 pb-2">
                        <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            <span>Overall Progress</span>
                            <span>{avgProgress}%</span>
                        </div>
                        <Progress
                            value={avgProgress}
                            className="h-2 border border-border/50 bg-muted [&>div]:bg-primary"
                        />
                    </div>
                )}

                {/* KPI list */}
                {kpis.length === 0 ? (
                    <div className="px-6 py-8 text-center">
                        <Target className="mx-auto mb-2 h-6 w-6 text-muted-foreground/40" />
                        <p className="text-xs font-medium text-muted-foreground">No KPIs recorded yet.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border/60 pt-2">
                        {kpis.slice(0, 3).map((kpi) => (
                            <div key={kpi.id} className="space-y-2 px-5 py-3.5">
                                <div className="flex items-start justify-between gap-2">
                                    <p className="text-xs font-bold leading-snug text-foreground">
                                        {kpi.title}
                                    </p>
                                    <Badge
                                        variant="outline"
                                        className={statusBadgeClass(kpi.status)}
                                    >
                                        {formatLabel(kpi.status)}
                                    </Badge>
                                </div>
                                <Progress
                                    value={kpi.progress_percent}
                                    className={`h-1.5 border border-border/50 bg-muted ${kpiBarColor(kpi.status)}`}
                                />
                                <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
                                    <span>{kpi.progress_percent}% complete</span>
                                    {kpi.due_date && (
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-2.5 w-2.5" />
                                            {formatDate(kpi.due_date)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                        {kpis.length > 3 && (
                            <p className="px-5 py-3 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                +{kpis.length - 3} more KPI{kpis.length - 3 > 1 ? 's' : ''} — see Job Profile tab
                            </p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function DocumentsTab({
    employee,
    options,
    canViewDocuments,
    canCreateDocuments,
    canDeleteDocuments,
    open,
    setOpen,
    form,
    onSubmit,
}: {
    employee: EmployeePayload;
    options: OptionsPayload;
    canViewDocuments: boolean;
    canCreateDocuments: boolean;
    canDeleteDocuments: boolean;
    open: boolean;
    setOpen: (value: boolean) => void;
    form: any;
    onSubmit: (event: FormEvent) => void;
}) {
    return (
        <>
            <Collapsible open={open} onOpenChange={setOpen}>
                <SectionHeader
                    title="Employee Documents"
                    description="Manage contracts, identification, and permits."
                    action={
                        <div className="flex flex-wrap gap-2">
                            {employee.links.ocr_enabled !== false && (
                                <Button asChild variant="outline">
                                    <Link href={employee.links.document_index}>
                                        <ScanSearch className="mr-2 h-4 w-4" />
                                        OCR Workspace
                                    </Link>
                                </Button>
                            )}
                            {canCreateDocuments && (
                                <CollapsibleTrigger asChild>
                                    <Button className="h-10 shrink-0 bg-foreground font-bold text-background shadow-sm hover:bg-foreground/90">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Document
                                    </Button>
                                </CollapsibleTrigger>
                            )}
                        </div>
                    }
                />
                <CollapsibleContent className="space-y-4">
                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="space-y-6 p-6">
                            <form onSubmit={onSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <FormField
                                        label="Document Type"
                                        required
                                        error={form.errors.document_type_id}
                                    >
                                        <Select
                                            value={
                                                form.data.document_type_id ||
                                                undefined
                                            }
                                            onValueChange={(value) =>
                                                form.setData(
                                                    'document_type_id',
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger className="h-11 bg-background">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {options.document_types.map(
                                                    (type) => (
                                                        <SelectItem
                                                            key={type.id}
                                                            value={type.id.toString()}
                                                        >
                                                            {type.code} -{' '}
                                                            {type.name}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormField>
                                    <FormField
                                        label="Access Policy"
                                        required
                                        error={form.errors.access_policy}
                                    >
                                        <Select
                                            value={form.data.access_policy}
                                            onValueChange={(value) =>
                                                form.setData(
                                                    'access_policy',
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger className="h-11 bg-background">
                                                <SelectValue placeholder="Select policy" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {options.document_access_policies.map(
                                                    (policy) => (
                                                        <SelectItem
                                                            key={policy}
                                                            value={policy}
                                                        >
                                                            {formatLabel(
                                                                policy,
                                                            )}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormField>
                                </div>
                                <FormField
                                    label="Title"
                                    required
                                    error={form.errors.title}
                                >
                                    <Input
                                        value={form.data.title}
                                        onChange={(event) =>
                                            form.setData(
                                                'title',
                                                event.target.value,
                                            )
                                        }
                                        className="h-11 bg-background"
                                        placeholder="Employment contract"
                                    />
                                </FormField>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <FormField
                                        label="Attach File"
                                        error={form.errors.file}
                                    >
                                        <Input
                                            type="file"
                                            onChange={(event) =>
                                                form.setData(
                                                    'file',
                                                    event.target.files?.[0] ??
                                                        null,
                                                )
                                            }
                                            className="h-11 bg-background"
                                        />
                                    </FormField>
                                    <FormField
                                        label="Or External File URI"
                                        error={form.errors.file_uri}
                                    >
                                        <Input
                                            value={form.data.file_uri}
                                            onChange={(event) =>
                                                form.setData(
                                                    'file_uri',
                                                    event.target.value,
                                                )
                                            }
                                            className="h-11 bg-background"
                                            placeholder="https://... or s3://..."
                                        />
                                    </FormField>
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <InlineInputField
                                        label="Issue Date"
                                        value={form.data.issue_date}
                                        onChange={(value) =>
                                            form.setData('issue_date', value)
                                        }
                                        error={form.errors.issue_date}
                                        type="date"
                                    />
                                    <InlineInputField
                                        label="Expiry Date"
                                        value={form.data.expiry_date}
                                        onChange={(value) =>
                                            form.setData('expiry_date', value)
                                        }
                                        error={form.errors.expiry_date}
                                        type="date"
                                    />
                                </div>
                                <FormField
                                    label="Metadata (JSON)"
                                    error={form.errors.metadata_json}
                                >
                                    <Textarea
                                        value={form.data.metadata_json}
                                        onChange={(event) =>
                                            form.setData(
                                                'metadata_json',
                                                event.target.value,
                                            )
                                        }
                                        className="min-h-24 bg-background font-mono text-xs"
                                        placeholder='{"source":"employee portal"}'
                                    />
                                </FormField>
                                <div className="flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            form.reset();
                                            setOpen(false);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={form.processing}
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        {form.processing
                                            ? 'Saving...'
                                            : 'Save Document'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </CollapsibleContent>
            </Collapsible>
            {!canViewDocuments ? (
                <EmptyState
                    title="Document access is restricted"
                    description="You do not have permission to view employee documents."
                />
            ) : employee.documents.length === 0 ? (
                <EmptyState
                    title="No documents attached"
                    description="Attach contracts, IDs, permits, and supporting records from this page."
                />
            ) : (
                <div className="space-y-3">
                    {employee.documents.map((document) => (
                        <div
                            key={document.id}
                            className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-background p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-foreground">
                                        {document.title}
                                    </p>
                                    <div className="flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
                                        <Badge
                                            variant="secondary"
                                            className="border border-border/50 bg-muted px-2 py-0.5 text-[9px] font-bold tracking-widest text-muted-foreground uppercase shadow-none"
                                        >
                                            {document.document_type?.code ??
                                                'document'}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="border-transparent bg-primary/10 px-2 py-0.5 text-[9px] font-bold tracking-widest text-primary uppercase shadow-none"
                                        >
                                            {formatLabel(
                                                document.access_policy,
                                            )}
                                        </Badge>
                                        {document.ocr_enabled !== false && (
                                            <OcrStatusBadge
                                                status={document.ocr_status}
                                            />
                                        )}
                                        <span>{document.file_name}</span>
                                        {document.ocr_page_count ? (
                                            <span>
                                                {document.ocr_page_count}{' '}
                                                page(s)
                                            </span>
                                        ) : null}
                                        {document.ocr_avg_confidence != null ? (
                                            <span>
                                                {Math.round(
                                                    document.ocr_avg_confidence *
                                                        100,
                                                )}
                                                % confidence
                                            </span>
                                        ) : null}
                                        <span>
                                            Uploaded{' '}
                                            {formatDateTime(
                                                document.created_at,
                                            )}
                                        </span>
                                    </div>
                                    {document.ocr_error_message ? (
                                        <p className="text-xs text-destructive">
                                            {document.ocr_error_message}
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <Link href={document.show_url}>
                                        <ScanSearch className="h-4 w-4" />
                                    </Link>
                                </Button>
                                {document.ocr_enabled !== false &&
                                    document.ocr_status === 'completed' && (
                                    <Button
                                        asChild
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        <Link href={document.ocr_result_url}>
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                )}
                                {document.ocr_enabled !== false &&
                                    document.ocr_status === 'failed' &&
                                    canCreateDocuments && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-foreground"
                                            onClick={() =>
                                                router.post(
                                                    document.retry_ocr_url,
                                                    {},
                                                    {
                                                        preserveScroll: true,
                                                        preserveState: true,
                                                    },
                                                )
                                            }
                                        >
                                            <RefreshCcw className="h-4 w-4" />
                                        </Button>
                                    )}
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <a href={document.download_url}>
                                        <Download className="h-4 w-4" />
                                    </a>
                                </Button>
                                {canDeleteDocuments && (
                                    <DeleteActionButton
                                        title="Delete document"
                                        description={`Remove ${document.title} from ${employee.full_name}.`}
                                        onConfirm={() =>
                                            router.delete(document.delete_url, {
                                                preserveScroll: true,
                                                preserveState: true,
                                            })
                                        }
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

function FamilyTab({
    employee,
    canManageEmployee,
    open,
    setOpen,
    editingId,
    form,
    onSubmit,
    onEdit,
    onReset,
}: {
    employee: EmployeePayload;
    canManageEmployee: boolean;
    open: boolean;
    setOpen: (value: boolean) => void;
    editingId: number | null;
    form: any;
    onSubmit: (event: FormEvent) => void;
    onEdit: (item: NextOfKinItem) => void;
    onReset: () => void;
}) {
    return (
        <>
            <Collapsible
                open={open}
                onOpenChange={(value) => {
                    setOpen(value);
                    if (!value) onReset();
                }}
            >
                <SectionHeader
                    title="Family & Next of Kin"
                    description="Emergency contacts, relationships, and important addresses."
                    action={
                        canManageEmployee && (
                            <CollapsibleTrigger asChild>
                                <Button
                                    variant="link"
                                    className="h-auto p-0 font-bold text-primary"
                                >
                                    {editingId ? 'Edit Contact' : 'Add Contact'}
                                </Button>
                            </CollapsibleTrigger>
                        )
                    }
                />
                <CollapsibleContent className="space-y-4">
                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="space-y-6 p-6">
                            <form onSubmit={onSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <InlineInputField
                                        label="Full Name"
                                        value={form.data.full_name}
                                        onChange={(value) =>
                                            form.setData('full_name', value)
                                        }
                                        error={form.errors.full_name}
                                    />
                                    <FormField
                                        label="Relationship"
                                        error={form.errors.relationship}
                                    >
                                        <Select
                                            value={form.data.relationship}
                                            onValueChange={(value) =>
                                                form.setData('relationship', value)
                                            }
                                        >
                                            <SelectTrigger className="h-11 bg-background">
                                                <SelectValue placeholder="Select relationship" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[
                                                    'Spouse',
                                                    'Parent',
                                                    'Child',
                                                    'Sibling',
                                                    'Grandparent',
                                                    'Grandchild',
                                                    'Aunt',
                                                    'Uncle',
                                                    'Niece',
                                                    'Nephew',
                                                    'Cousin',
                                                    'In-Law',
                                                    'Guardian',
                                                    'Friend',
                                                    'Other',
                                                ].map((rel) => (
                                                    <SelectItem key={rel} value={rel}>
                                                        {rel}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormField>
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <InlineInputField
                                        label="Primary Contact"
                                        value={form.data.contact_number}
                                        onChange={(value) =>
                                            form.setData(
                                                'contact_number',
                                                value,
                                            )
                                        }
                                        error={form.errors.contact_number}
                                    />
                                    <InlineInputField
                                        label="Alternate Contact"
                                        value={
                                            form.data.alternate_contact_number
                                        }
                                        onChange={(value) =>
                                            form.setData(
                                                'alternate_contact_number',
                                                value,
                                            )
                                        }
                                        error={
                                            form.errors.alternate_contact_number
                                        }
                                    />
                                    <InlineInputField
                                        label="Email"
                                        value={form.data.email}
                                        onChange={(value) =>
                                            form.setData('email', value)
                                        }
                                        error={form.errors.email}
                                        type="email"
                                    />
                                </div>
                                <FormField
                                    label="Address"
                                    required
                                    error={form.errors.address}
                                >
                                    <Textarea
                                        value={form.data.address}
                                        onChange={(event) =>
                                            form.setData(
                                                'address',
                                                event.target.value,
                                            )
                                        }
                                        className="min-h-24 bg-background"
                                    />
                                </FormField>
                                <FormField
                                    label="Notes"
                                    error={form.errors.notes}
                                >
                                    <Textarea
                                        value={form.data.notes}
                                        onChange={(event) =>
                                            form.setData(
                                                'notes',
                                                event.target.value,
                                            )
                                        }
                                        className="min-h-24 bg-background"
                                    />
                                </FormField>
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        checked={form.data.is_primary}
                                        onCheckedChange={(checked) =>
                                            form.setData(
                                                'is_primary',
                                                checked === true,
                                            )
                                        }
                                    />
                                    <Label className="text-sm font-medium">
                                        Mark as primary next of kin
                                    </Label>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            onReset();
                                            setOpen(false);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={form.processing}
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        {form.processing
                                            ? 'Saving...'
                                            : editingId
                                              ? 'Update Contact'
                                              : 'Save Contact'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </CollapsibleContent>
            </Collapsible>
            {employee.next_of_kin.length === 0 ? (
                <EmptyState
                    title="No next of kin recorded"
                    description="Add emergency contacts and their addresses to complete this profile."
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {employee.next_of_kin.map((item) => (
                        <Card
                            key={item.id}
                            className="border-border bg-background shadow-sm"
                        >
                            <CardContent className="space-y-4 p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-base font-bold text-foreground">
                                                {item.full_name}
                                            </p>
                                            {item.is_primary && (
                                                <Badge
                                                    variant="outline"
                                                    className="border-transparent bg-primary/10 px-2 py-0.5 text-[9px] font-bold tracking-widest text-primary uppercase shadow-none"
                                                >
                                                    Primary
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-xs font-medium text-muted-foreground">
                                            {item.relationship}
                                        </p>
                                    </div>
                                    {canManageEmployee && (
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground"
                                                onClick={() => onEdit(item)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <DeleteActionButton
                                                title="Remove next of kin"
                                                description={`Remove ${item.full_name} from ${employee.full_name}'s profile.`}
                                                onConfirm={() =>
                                                    router.delete(
                                                        item.delete_url,
                                                        {
                                                            preserveScroll: true,
                                                            preserveState: true,
                                                        },
                                                    )
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                                <p className="flex items-center gap-2 text-sm font-bold text-foreground">
                                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                    {item.contact_number}
                                </p>
                                {item.email && (
                                    <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                        <Mail className="h-3.5 w-3.5" />
                                        {item.email}
                                    </p>
                                )}
                                <div className="space-y-1 border-t border-border/50 pt-3">
                                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Address
                                    </p>
                                    <p className="text-sm leading-relaxed font-bold text-foreground">
                                        {item.address}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </>
    );
}

function PhysicalTab({
    employee,
    canManageEmployee,
    open,
    setOpen,
    form,
    onSubmit,
}: {
    employee: EmployeePayload;
    canManageEmployee: boolean;
    open: boolean;
    setOpen: (value: boolean) => void;
    form: any;
    onSubmit: (event: FormEvent) => void;
}) {
    return (
        <>
            <Collapsible open={open} onOpenChange={setOpen}>
                <SectionHeader
                    title="Physical Attributes"
                    description="Sizing for company uniforms, PPE, and medical notes."
                    action={
                        canManageEmployee && (
                            <CollapsibleTrigger asChild>
                                <Button
                                    variant="link"
                                    className="h-auto p-0 font-bold text-primary"
                                >
                                    Edit Sizes
                                </Button>
                            </CollapsibleTrigger>
                        )
                    }
                />
                <CollapsibleContent className="space-y-4">
                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="space-y-6 p-6">
                            <form onSubmit={onSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    <InlineInputField
                                        label="Uniform Size"
                                        value={form.data.uniform_size}
                                        onChange={(value) =>
                                            form.setData('uniform_size', value)
                                        }
                                        error={form.errors.uniform_size}
                                    />
                                    <InlineInputField
                                        label="Shirt Size"
                                        value={form.data.shirt_size}
                                        onChange={(value) =>
                                            form.setData('shirt_size', value)
                                        }
                                        error={form.errors.shirt_size}
                                    />
                                    <InlineInputField
                                        label="Trouser Size"
                                        value={form.data.trouser_size}
                                        onChange={(value) =>
                                            form.setData('trouser_size', value)
                                        }
                                        error={form.errors.trouser_size}
                                    />
                                    <InlineInputField
                                        label="Shoe Size"
                                        value={form.data.shoe_size}
                                        onChange={(value) =>
                                            form.setData('shoe_size', value)
                                        }
                                        error={form.errors.shoe_size}
                                    />
                                    <InlineInputField
                                        label="Height (cm)"
                                        value={form.data.height_cm}
                                        onChange={(value) =>
                                            form.setData('height_cm', value)
                                        }
                                        error={form.errors.height_cm}
                                        type="number"
                                    />
                                    <InlineInputField
                                        label="Weight (kg)"
                                        value={form.data.weight_kg}
                                        onChange={(value) =>
                                            form.setData('weight_kg', value)
                                        }
                                        error={form.errors.weight_kg}
                                        type="number"
                                    />
                                    <FormField
                                        label="Blood Type"
                                        error={form.errors.blood_type}
                                    >
                                        <Select
                                            value={form.data.blood_type}
                                            onValueChange={(value) =>
                                                form.setData('blood_type', value)
                                            }
                                        >
                                            <SelectTrigger className="h-11 bg-background">
                                                <SelectValue placeholder="Select blood type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormField>
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <FormField
                                        label="Emergency Medical Notes"
                                        error={
                                            form.errors.emergency_medical_notes
                                        }
                                    >
                                        <Textarea
                                            value={
                                                form.data
                                                    .emergency_medical_notes
                                            }
                                            onChange={(event) =>
                                                form.setData(
                                                    'emergency_medical_notes',
                                                    event.target.value,
                                                )
                                            }
                                            className="min-h-24 bg-background"
                                        />
                                    </FormField>
                                    <FormField
                                        label="PPE Notes"
                                        error={form.errors.ppe_notes}
                                    >
                                        <Textarea
                                            value={form.data.ppe_notes}
                                            onChange={(event) =>
                                                form.setData(
                                                    'ppe_notes',
                                                    event.target.value,
                                                )
                                            }
                                            className="min-h-24 bg-background"
                                        />
                                    </FormField>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={form.processing}
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        {form.processing
                                            ? 'Saving...'
                                            : 'Save Profile'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </CollapsibleContent>
            </Collapsible>
            <div className="space-y-4">
                {/* Body measurements + blood type */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <SummaryTile
                        icon={<Ruler className="h-3 w-3" />}
                        label="Height"
                        value={
                            employee.physical_profile?.height_cm
                                ? `${employee.physical_profile.height_cm} cm`
                                : 'Not recorded'
                        }
                    />
                    <SummaryTile
                        icon={<Scale className="h-3 w-3" />}
                        label="Weight"
                        value={
                            employee.physical_profile?.weight_kg
                                ? `${employee.physical_profile.weight_kg} kg`
                                : 'Not recorded'
                        }
                    />
                    <div className="space-y-1.5 rounded-xl border border-border bg-background p-5 shadow-sm">
                        <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                            <Droplets className="h-3 w-3" />
                            Blood Type
                        </p>
                        {employee.physical_profile?.blood_type ? (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-lg font-bold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                {employee.physical_profile.blood_type}
                            </span>
                        ) : (
                            <p className="text-lg font-bold text-foreground">Not recorded</p>
                        )}
                    </div>
                </div>

                {/* Sizing */}
                <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
                    <p className="mb-4 flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                        <Shirt className="h-3 w-3" />
                        Uniform &amp; Sizing
                    </p>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {[
                            { label: 'Uniform', value: employee.physical_profile?.uniform_size },
                            { label: 'Shirt', value: employee.physical_profile?.shirt_size },
                            { label: 'Trouser', value: employee.physical_profile?.trouser_size },
                            { label: 'Shoe', value: employee.physical_profile?.shoe_size },
                        ].map(({ label, value }) => (
                            <div key={label} className="space-y-1">
                                <p className="text-xs text-muted-foreground">{label}</p>
                                <p className="text-base font-semibold text-foreground">{value || '—'}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Medical notes */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
                        <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                            <ShieldAlert className="h-3 w-3" />
                            Emergency Medical Notes
                        </p>
                        <p className="text-sm leading-relaxed font-medium text-foreground">
                            {employee.physical_profile?.emergency_medical_notes || 'Not recorded'}
                        </p>
                    </div>
                    <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
                        <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                            <HardHat className="h-3 w-3" />
                            PPE Notes
                        </p>
                        <p className="text-sm leading-relaxed font-medium text-foreground">
                            {employee.physical_profile?.ppe_notes || 'Not recorded'}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

function SkillsTab({
    employee,
    options,
    canManageEmployee,
    open,
    setOpen,
    editingId,
    form,
    onSubmit,
    onEdit,
    onReset,
}: {
    employee: EmployeePayload;
    options: OptionsPayload;
    canManageEmployee: boolean;
    open: boolean;
    setOpen: (value: boolean) => void;
    editingId: number | null;
    form: any;
    onSubmit: (event: FormEvent) => void;
    onEdit: (item: SkillItem) => void;
    onReset: () => void;
}) {
    return (
        <>
            <Collapsible
                open={open}
                onOpenChange={(value) => {
                    setOpen(value);
                    if (!value) onReset();
                }}
            >
                <SectionHeader
                    title="Skills & Certifications"
                    description="Tracked competencies, certifications, and proficiency levels."
                    action={
                        canManageEmployee && (
                            <CollapsibleTrigger asChild>
                                <Button
                                    variant="link"
                                    className="h-auto p-0 font-bold text-primary"
                                >
                                    {editingId ? 'Edit Skill' : 'Manage Skills'}
                                </Button>
                            </CollapsibleTrigger>
                        )
                    }
                />
                <CollapsibleContent className="space-y-4">
                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="space-y-6 p-6">
                            <form onSubmit={onSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <InlineInputField
                                        label="Skill"
                                        value={form.data.name}
                                        onChange={(value) =>
                                            form.setData('name', value)
                                        }
                                        error={form.errors.name}
                                    />
                                    <InlineInputField
                                        label="Category"
                                        value={form.data.category}
                                        onChange={(value) =>
                                            form.setData('category', value)
                                        }
                                        error={form.errors.category}
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <FormField
                                        label="Level"
                                        required
                                        error={form.errors.proficiency_level}
                                    >
                                        <Select
                                            value={form.data.proficiency_level}
                                            onValueChange={(value) =>
                                                form.setData(
                                                    'proficiency_level',
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger className="h-11 bg-background">
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {options.skill_levels.map(
                                                    (level) => (
                                                        <SelectItem
                                                            key={level}
                                                            value={level}
                                                        >
                                                            {level}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormField>
                                    <InlineInputField
                                        label="Proficiency %"
                                        value={form.data.proficiency_percent}
                                        onChange={(value) =>
                                            form.setData(
                                                'proficiency_percent',
                                                value,
                                            )
                                        }
                                        error={form.errors.proficiency_percent}
                                        type="number"
                                    />
                                    <InlineInputField
                                        label="Certified At"
                                        value={form.data.certified_at}
                                        onChange={(value) =>
                                            form.setData('certified_at', value)
                                        }
                                        error={form.errors.certified_at}
                                        type="date"
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <InlineInputField
                                        label="Certification Name"
                                        value={form.data.certification_name}
                                        onChange={(value) =>
                                            form.setData(
                                                'certification_name',
                                                value,
                                            )
                                        }
                                        error={form.errors.certification_name}
                                    />
                                    <InlineInputField
                                        label="Certification Issuer"
                                        value={form.data.certification_issuer}
                                        onChange={(value) =>
                                            form.setData(
                                                'certification_issuer',
                                                value,
                                            )
                                        }
                                        error={form.errors.certification_issuer}
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <InlineInputField
                                        label="Expires At"
                                        value={form.data.expires_at}
                                        onChange={(value) =>
                                            form.setData('expires_at', value)
                                        }
                                        error={form.errors.expires_at}
                                        type="date"
                                    />
                                    <FormField
                                        label="Notes"
                                        error={form.errors.notes}
                                    >
                                        <Textarea
                                            value={form.data.notes}
                                            onChange={(event) =>
                                                form.setData(
                                                    'notes',
                                                    event.target.value,
                                                )
                                            }
                                            className="min-h-24 bg-background"
                                        />
                                    </FormField>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            onReset();
                                            setOpen(false);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={form.processing}
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        {form.processing
                                            ? 'Saving...'
                                            : editingId
                                              ? 'Update Skill'
                                              : 'Save Skill'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </CollapsibleContent>
            </Collapsible>
            {employee.skills.length === 0 ? (
                <EmptyState
                    title="No skills tracked"
                    description="Capture technical, professional, and certified capabilities here."
                />
            ) : (
                <Card className="border-border bg-background shadow-sm">
                    <CardContent className="space-y-6 p-6">
                        {employee.skills.map((skill) => {
                            const colors = skillLevelColors(skill.proficiency_level);
                            return (
                                <div
                                    key={skill.id}
                                    className="space-y-3 rounded-xl border border-border/60 p-4"
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-sm font-bold text-foreground">
                                                    {skill.name}
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-[10px] tracking-widest uppercase shadow-none ${colors.badge}`}
                                                >
                                                    {skill.proficiency_level}
                                                </Badge>
                                            </div>
                                            <p className="text-xs font-medium text-muted-foreground">
                                                {skill.certification_name
                                                    ? `${skill.certification_name}${skill.certification_issuer ? ` • ${skill.certification_issuer}` : ''}`
                                                    : 'No certification metadata'}
                                            </p>
                                        </div>
                                        {canManageEmployee && (
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground"
                                                    onClick={() => onEdit(skill)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <DeleteActionButton
                                                    title="Delete skill"
                                                    description={`Remove ${skill.name} from ${employee.full_name}.`}
                                                    onConfirm={() =>
                                                        router.delete(
                                                            skill.delete_url,
                                                            {
                                                                preserveScroll: true,
                                                                preserveState: true,
                                                            },
                                                        )
                                                    }
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <Progress
                                        value={skill.proficiency_percent}
                                        className={`h-2 border border-border/50 bg-muted ${colors.bar}`}
                                    />
                                    <div className="flex flex-wrap justify-between gap-2 text-xs font-medium text-muted-foreground">
                                        <span className={colors.text}>
                                            {skill.proficiency_percent}% proficiency
                                        </span>
                                        <span>
                                            {skill.certified_at
                                                ? `Certified ${formatDate(skill.certified_at)}`
                                                : 'Certification date not recorded'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            )}
        </>
    );
}

function JobTab({
    employee,
    options,
    canManageEmployee,
    jobOpen,
    setJobOpen,
    kpiOpen,
    setKpiOpen,
    editingKpiId,
    jobForm,
    kpiForm,
    onSubmitJob,
    onSubmitKpi,
    onEditKpi,
    onResetKpi,
}: {
    employee: EmployeePayload;
    options: OptionsPayload;
    canManageEmployee: boolean;
    jobOpen: boolean;
    setJobOpen: (value: boolean) => void;
    kpiOpen: boolean;
    setKpiOpen: (value: boolean) => void;
    editingKpiId: number | null;
    jobForm: any;
    kpiForm: any;
    onSubmitJob: (event: FormEvent) => void;
    onSubmitKpi: (event: FormEvent) => void;
    onEditKpi: (item: KpiItem) => void;
    onResetKpi: () => void;
}) {
    return (
        <>
            <Collapsible open={jobOpen} onOpenChange={setJobOpen}>
                <SectionHeader
                    title="Job Description"
                    description="Maintain responsibilities, reporting lines, working arrangements, and review dates."
                    action={
                        canManageEmployee && (
                            <CollapsibleTrigger asChild>
                                <Button
                                    variant="link"
                                    className="h-auto p-0 font-bold text-primary"
                                >
                                    {employee.job_profile
                                        ? 'Edit Job Description'
                                        : 'Add Job Description'}
                                </Button>
                            </CollapsibleTrigger>
                        )
                    }
                />
                <CollapsibleContent className="space-y-4">
                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="space-y-6 p-6">
                            <form onSubmit={onSubmitJob} className="space-y-6">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <InlineInputField
                                        label="Job Title"
                                        value={jobForm.data.title}
                                        onChange={(value) =>
                                            jobForm.setData('title', value)
                                        }
                                        error={jobForm.errors.title}
                                    />
                                    <FormField
                                        label="Employment Type"
                                        error={jobForm.errors.employment_type}
                                    >
                                        <Select
                                            value={
                                                jobForm.data.employment_type ||
                                                undefined
                                            }
                                            onValueChange={(value) =>
                                                jobForm.setData(
                                                    'employment_type',
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger className="h-11 bg-background">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {options.employment_types.map(
                                                    (type) => (
                                                        <SelectItem
                                                            key={type}
                                                            value={type}
                                                        >
                                                            {type}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormField>
                                    <InlineInputField
                                        label="Reports To"
                                        value={jobForm.data.reports_to}
                                        onChange={(value) =>
                                            jobForm.setData('reports_to', value)
                                        }
                                        error={jobForm.errors.reports_to}
                                    />
                                    <InlineInputField
                                        label="Working Hours"
                                        value={jobForm.data.working_hours}
                                        onChange={(value) =>
                                            jobForm.setData(
                                                'working_hours',
                                                value,
                                            )
                                        }
                                        error={jobForm.errors.working_hours}
                                    />
                                    <InlineInputField
                                        label="Location Summary"
                                        value={jobForm.data.location_summary}
                                        onChange={(value) =>
                                            jobForm.setData(
                                                'location_summary',
                                                value,
                                            )
                                        }
                                        error={jobForm.errors.location_summary}
                                    />
                                    <InlineInputField
                                        label="Review Date"
                                        value={jobForm.data.review_date}
                                        onChange={(value) =>
                                            jobForm.setData(
                                                'review_date',
                                                value,
                                            )
                                        }
                                        error={jobForm.errors.review_date}
                                        type="date"
                                    />
                                </div>
                                <FormField
                                    label="Summary"
                                    error={jobForm.errors.summary}
                                >
                                    <Textarea
                                        value={jobForm.data.summary}
                                        onChange={(event) =>
                                            jobForm.setData(
                                                'summary',
                                                event.target.value,
                                            )
                                        }
                                        className="min-h-24 bg-background"
                                    />
                                </FormField>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <FormField
                                        label="Responsibilities"
                                        error={jobForm.errors.responsibilities}
                                    >
                                        <Textarea
                                            value={
                                                jobForm.data.responsibilities
                                            }
                                            onChange={(event) =>
                                                jobForm.setData(
                                                    'responsibilities',
                                                    event.target.value,
                                                )
                                            }
                                            className="min-h-32 bg-background"
                                        />
                                    </FormField>
                                    <FormField
                                        label="Requirements"
                                        error={jobForm.errors.requirements}
                                    >
                                        <Textarea
                                            value={jobForm.data.requirements}
                                            onChange={(event) =>
                                                jobForm.setData(
                                                    'requirements',
                                                    event.target.value,
                                                )
                                            }
                                            className="min-h-32 bg-background"
                                        />
                                    </FormField>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setJobOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={jobForm.processing}
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        {jobForm.processing
                                            ? 'Saving...'
                                            : 'Save Job Profile'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </CollapsibleContent>
            </Collapsible>
            {employee.job_profile || employee.position ? (
                <div className="space-y-4">
                    {/* Header card */}
                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="space-y-1.5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                                        <h3 className="text-lg font-bold text-foreground">
                                            {employee.job_profile?.title || employee.position?.name || 'No title set'}
                                        </h3>
                                    </div>
                                    {employee.job_profile?.employment_type && (
                                        <Badge variant="outline" className="text-[10px] font-bold tracking-widest uppercase">
                                            {employee.job_profile.employment_type}
                                        </Badge>
                                    )}
                                </div>
                                {employee.job_profile?.review_date && (
                                    <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-medium text-muted-foreground">
                                        <Calendar className="h-3.5 w-3.5" />
                                        Review: {formatDate(employee.job_profile.review_date)}
                                    </div>
                                )}
                            </div>

                            {/* Key details row */}
                            <div className="mt-5 grid grid-cols-1 gap-3 border-t border-border/60 pt-5 sm:grid-cols-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Reports To</p>
                                        <p className="text-xs font-semibold text-foreground">
                                            {employee.job_profile?.reports_to || employee.manager?.full_name || '—'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Working Hours</p>
                                        <p className="text-xs font-semibold text-foreground">
                                            {employee.job_profile?.working_hours || '—'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Location</p>
                                        <p className="text-xs font-semibold text-foreground">
                                            {employee.job_profile?.location_summary || '—'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Summary */}
                    {employee.job_profile?.summary && (
                        <Card className="border-border bg-background shadow-sm">
                            <CardContent className="p-6">
                                <p className="mb-2 flex items-center gap-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    <FileText className="h-3.5 w-3.5" />
                                    Summary
                                </p>
                                <p className="text-sm leading-relaxed text-foreground">
                                    {employee.job_profile.summary}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Responsibilities & Requirements */}
                    {(employee.job_profile?.responsibilities || employee.job_profile?.requirements) && (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {employee.job_profile?.responsibilities && (
                                <Card className="border-border bg-background shadow-sm">
                                    <CardContent className="p-6">
                                        <p className="mb-3 flex items-center gap-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                            Responsibilities
                                        </p>
                                        <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                                            {employee.job_profile.responsibilities}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                            {employee.job_profile?.requirements && (
                                <Card className="border-border bg-background shadow-sm">
                                    <CardContent className="p-6">
                                        <p className="mb-3 flex items-center gap-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            <Award className="h-3.5 w-3.5 text-violet-500" />
                                            Requirements
                                        </p>
                                        <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                                            {employee.job_profile.requirements}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <EmptyState
                    title="No job description recorded"
                    description="Add a job title, responsibilities, reporting line, and review dates."
                />
            )}
            <Collapsible
                open={kpiOpen}
                onOpenChange={(value) => {
                    setKpiOpen(value);
                    if (!value) onResetKpi();
                }}
            >
                <SectionHeader
                    title="KPIs"
                    description="Track targets, progress, due dates, and current status from the same profile."
                    action={
                        canManageEmployee && (
                            <CollapsibleTrigger asChild>
                                <Button
                                    variant="link"
                                    className="h-auto p-0 font-bold text-primary"
                                >
                                    {editingKpiId ? 'Edit KPI' : 'Add KPI'}
                                </Button>
                            </CollapsibleTrigger>
                        )
                    }
                />
                <CollapsibleContent className="space-y-4">
                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="space-y-6 p-6">
                            <form onSubmit={onSubmitKpi} className="space-y-6">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <InlineInputField
                                        label="Title"
                                        value={kpiForm.data.title}
                                        onChange={(value) =>
                                            kpiForm.setData('title', value)
                                        }
                                        error={kpiForm.errors.title}
                                    />
                                    <FormField
                                        label="Status"
                                        required
                                        error={kpiForm.errors.status}
                                    >
                                        <Select
                                            value={kpiForm.data.status}
                                            onValueChange={(value) =>
                                                kpiForm.setData('status', value)
                                            }
                                        >
                                            <SelectTrigger className="h-11 bg-background">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {options.kpi_statuses.map(
                                                    (status) => (
                                                        <SelectItem
                                                            key={status}
                                                            value={status}
                                                        >
                                                            {formatLabel(
                                                                status,
                                                            )}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormField>
                                </div>
                                <FormField
                                    label="Description"
                                    error={kpiForm.errors.description}
                                >
                                    <Textarea
                                        value={kpiForm.data.description}
                                        onChange={(event) =>
                                            kpiForm.setData(
                                                'description',
                                                event.target.value,
                                            )
                                        }
                                        className="min-h-24 bg-background"
                                    />
                                </FormField>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <InlineInputField
                                        label="Target Value"
                                        value={kpiForm.data.target_value}
                                        onChange={(value) =>
                                            kpiForm.setData(
                                                'target_value',
                                                value,
                                            )
                                        }
                                        error={kpiForm.errors.target_value}
                                    />
                                    <InlineInputField
                                        label="Current Value"
                                        value={kpiForm.data.current_value}
                                        onChange={(value) =>
                                            kpiForm.setData(
                                                'current_value',
                                                value,
                                            )
                                        }
                                        error={kpiForm.errors.current_value}
                                    />
                                    <InlineInputField
                                        label="Measurement Period"
                                        value={kpiForm.data.measurement_period}
                                        onChange={(value) =>
                                            kpiForm.setData(
                                                'measurement_period',
                                                value,
                                            )
                                        }
                                        error={
                                            kpiForm.errors.measurement_period
                                        }
                                    />
                                    <InlineInputField
                                        label="Weight"
                                        value={kpiForm.data.weight}
                                        onChange={(value) =>
                                            kpiForm.setData('weight', value)
                                        }
                                        error={kpiForm.errors.weight}
                                        type="number"
                                    />
                                    <InlineInputField
                                        label="Progress %"
                                        value={kpiForm.data.progress_percent}
                                        onChange={(value) =>
                                            kpiForm.setData(
                                                'progress_percent',
                                                value,
                                            )
                                        }
                                        error={kpiForm.errors.progress_percent}
                                        type="number"
                                    />
                                    <InlineInputField
                                        label="Due Date"
                                        value={kpiForm.data.due_date}
                                        onChange={(value) =>
                                            kpiForm.setData('due_date', value)
                                        }
                                        error={kpiForm.errors.due_date}
                                        type="date"
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            onResetKpi();
                                            setKpiOpen(false);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={kpiForm.processing}
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        {kpiForm.processing
                                            ? 'Saving...'
                                            : editingKpiId
                                              ? 'Update KPI'
                                              : 'Save KPI'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </CollapsibleContent>
            </Collapsible>
            {employee.kpis.length === 0 ? (
                <EmptyState
                    title="No KPIs recorded"
                    description="Add measurable performance targets and progress indicators for this employee."
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {employee.kpis.map((kpi) => (
                        <Card
                            key={kpi.id}
                            className="border-border bg-background shadow-sm"
                        >
                            <CardContent className="space-y-4 p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="text-base font-bold text-foreground">
                                                {kpi.title}
                                            </p>
                                            <Badge
                                                variant="outline"
                                                className={statusBadgeClass(
                                                    kpi.status,
                                                )}
                                            >
                                                {formatLabel(kpi.status)}
                                            </Badge>
                                        </div>
                                        <p className="text-xs font-medium text-muted-foreground">
                                            {kpi.measurement_period ||
                                                'Measurement period not set'}
                                        </p>
                                    </div>
                                    {canManageEmployee && (
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground"
                                                onClick={() => onEditKpi(kpi)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <DeleteActionButton
                                                title="Delete KPI"
                                                description={`Remove KPI "${kpi.title}" from ${employee.full_name}.`}
                                                onConfirm={() =>
                                                    router.delete(
                                                        kpi.delete_url,
                                                        {
                                                            preserveScroll: true,
                                                            preserveState: true,
                                                        },
                                                    )
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                                <Progress
                                    value={kpi.progress_percent}
                                    className="h-2 border border-border/50 bg-muted [&>div]:bg-foreground"
                                />
                                <div className="grid grid-cols-2 gap-3 text-xs font-medium text-muted-foreground">
                                    <span>
                                        Target: {kpi.target_value || 'N/A'}
                                    </span>
                                    <span>
                                        Current: {kpi.current_value || 'N/A'}
                                    </span>
                                    <span>Weight: {kpi.weight || 'N/A'}</span>
                                    <span>
                                        Due:{' '}
                                        {kpi.due_date
                                            ? formatDate(kpi.due_date)
                                            : 'Not set'}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </>
    );
}

function formatLabel(value: string) {
    return value
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value: string | null) {
    return value ? new Date(value).toLocaleDateString() : 'Not recorded';
}

function formatDateTime(value: string | null) {
    return value ? new Date(value).toLocaleString() : 'Unknown';
}

/* ─── contracts tab ───────────────────────────────────────── */

const CONTRACT_TYPE_LABELS: Record<string, string> = {
    permanent: 'Permanent',
    fixed_term: 'Fixed Term',
    temporary: 'Temporary',
    internship: 'Internship',
    consultancy: 'Consultancy',
    probation: 'Probation',
};

function contractStatusVariant(status: string) {
    switch (status) {
        case 'active':
            return 'default' as const;
        case 'draft':
            return 'secondary' as const;
        case 'expired':
        case 'terminated':
            return 'destructive' as const;
        default:
            return 'secondary' as const;
    }
}

function ContractsTab({ employee }: { employee: EmployeePayload }) {
    const { can } = useAuthorization();
    const canViewContracts = can('contracts.view');
    const canCreateContracts = can('contracts.create');

    return (
        <div className="space-y-6">
            {/* Current Contract Summary */}
            {employee.current_contract && (
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Current Contract
                            </CardTitle>
                            {canViewContracts && (
                                <Link href={employee.current_contract.show_url}>
                                    <Button variant="outline" size="sm">
                                        View Details
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <p className="text-xs text-muted-foreground">Contract Number</p>
                                <p className="text-sm font-medium">{employee.current_contract.contract_number}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Type</p>
                                <p className="text-sm font-medium">{CONTRACT_TYPE_LABELS[employee.current_contract.contract_type] || employee.current_contract.contract_type}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Start Date</p>
                                <p className="text-sm font-medium">{employee.current_contract.start_date || '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">End Date</p>
                                <p className="text-sm font-medium">{employee.current_contract.end_date || 'Open-ended'}</p>
                            </div>
                            {employee.current_contract.basic_salary && (
                                <div>
                                    <p className="text-xs text-muted-foreground">Salary</p>
                                    <p className="text-sm font-medium">
                                        {employee.current_contract.currency || ''} {Number(employee.current_contract.basic_salary).toLocaleString()}
                                    </p>
                                </div>
                            )}
                            {employee.current_contract.department && (
                                <div>
                                    <p className="text-xs text-muted-foreground">Department</p>
                                    <p className="text-sm font-medium">{employee.current_contract.department.name}</p>
                                </div>
                            )}
                            {employee.current_contract.position && (
                                <div>
                                    <p className="text-xs text-muted-foreground">Position</p>
                                    <p className="text-sm font-medium">{employee.current_contract.position.name}</p>
                                </div>
                            )}
                            {employee.current_contract.job_title && (
                                <div>
                                    <p className="text-xs text-muted-foreground">Job Title</p>
                                    <p className="text-sm font-medium">{employee.current_contract.job_title}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Contract History */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Contract History ({employee.stats.contracts_count})</CardTitle>
                        <div className="flex gap-2">
                            {canViewContracts && (
                                <Link href={employee.links.contracts_index}>
                                    <Button variant="outline" size="sm">
                                        View All
                                        <ArrowRight className="ml-1.5 h-3 w-3" />
                                    </Button>
                                </Link>
                            )}
                            {canCreateContracts && (
                                <Link href={employee.links.contracts_create}>
                                    <Button size="sm">
                                        <Plus className="mr-2 h-4 w-4" />
                                        New Contract
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {employee.contracts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
                            <h3 className="mb-1 text-lg font-semibold">No contracts yet</h3>
                            <p className="mb-4 text-sm text-muted-foreground">Create the first contract for this employee.</p>
                            {canCreateContracts && (
                                <Link href={employee.links.contracts_create}>
                                    <Button variant="outline">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Contract
                                    </Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="pb-2 font-medium">Contract #</th>
                                        <th className="pb-2 font-medium">Type</th>
                                        <th className="pb-2 font-medium">Status</th>
                                        <th className="pb-2 font-medium">Start</th>
                                        <th className="pb-2 font-medium">End</th>
                                        <th className="pb-2 text-right font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employee.contracts.map((c) => (
                                        <tr key={c.id} className="border-b last:border-0">
                                            <td className="py-2.5 font-medium">
                                                <div className="flex items-center gap-2">
                                                    {c.contract_number}
                                                    {c.is_current && <Badge variant="default" className="text-xs">Current</Badge>}
                                                </div>
                                            </td>
                                            <td className="py-2.5">{CONTRACT_TYPE_LABELS[c.contract_type] || c.contract_type}</td>
                                            <td className="py-2.5">
                                                <Badge variant={contractStatusVariant(c.status)}>
                                                    {c.status.replace(/_/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase())}
                                                </Badge>
                                            </td>
                                            <td className="py-2.5">{c.start_date || '—'}</td>
                                            <td className="py-2.5">{c.end_date || '—'}</td>
                                            <td className="py-2.5 text-right">
                                                {canViewContracts && (
                                                    <Link href={c.show_url}>
                                                        <Button variant="ghost" size="sm">View</Button>
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

/* ─── assets tab ───────────────────────────────────────── */

function assetAssignmentStatusBadge(status: string) {
    switch (status) {
        case 'active':
            return <Badge variant="outline" className="border-transparent bg-emerald-50 text-emerald-600 shadow-none">Active</Badge>;
        case 'returned':
            return <Badge variant="outline" className="border-transparent bg-gray-50 text-gray-600 shadow-none">Returned</Badge>;
        case 'overdue':
            return <Badge variant="outline" className="border-transparent bg-red-50 text-red-600 shadow-none">Overdue</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
}

function AssetsTab({ employee }: { employee: EmployeePayload }) {
    const { can } = useAuthorization();
    const canViewAssets = can('assets.view');

    const activeAssignments = employee.asset_assignments?.filter((a) => a.status === 'active') || [];
    const pastAssignments = employee.asset_assignments?.filter((a) => a.status !== 'active') || [];

    return (
        <div className="space-y-6">
            {/* Currently Assigned Assets */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-primary" />
                        Currently Assigned ({activeAssignments.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {activeAssignments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Briefcase className="mb-4 h-10 w-10 text-muted-foreground/50" />
                            <p className="text-sm text-muted-foreground">No assets currently assigned.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="pb-2 font-medium">Asset Tag</th>
                                        <th className="pb-2 font-medium">Name</th>
                                        <th className="pb-2 font-medium">Assigned</th>
                                        <th className="pb-2 font-medium">Expected Return</th>
                                        <th className="pb-2 text-right font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeAssignments.map((a) => (
                                        <tr key={a.id} className="border-b last:border-0">
                                            <td className="py-2.5 font-medium">{a.asset.asset_tag}</td>
                                            <td className="py-2.5">{a.asset.name}</td>
                                            <td className="py-2.5">{a.assigned_at || '—'}</td>
                                            <td className="py-2.5">{a.expected_return_date || '—'}</td>
                                            <td className="py-2.5 text-right">
                                                {canViewAssets && (
                                                    <Link href={a.show_url}>
                                                        <Button variant="ghost" size="sm">View Asset</Button>
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Assignment History */}
            {pastAssignments.length > 0 && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Assignment History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="pb-2 font-medium">Asset Tag</th>
                                        <th className="pb-2 font-medium">Name</th>
                                        <th className="pb-2 font-medium">Assigned</th>
                                        <th className="pb-2 font-medium">Returned</th>
                                        <th className="pb-2 font-medium">Status</th>
                                        <th className="pb-2 text-right font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pastAssignments.map((a) => (
                                        <tr key={a.id} className="border-b last:border-0">
                                            <td className="py-2.5 font-medium">{a.asset.asset_tag}</td>
                                            <td className="py-2.5">{a.asset.name}</td>
                                            <td className="py-2.5">{a.assigned_at || '—'}</td>
                                            <td className="py-2.5">{a.returned_at || '—'}</td>
                                            <td className="py-2.5">{assetAssignmentStatusBadge(a.status)}</td>
                                            <td className="py-2.5 text-right">
                                                {canViewAssets && (
                                                    <Link href={a.show_url}>
                                                        <Button variant="ghost" size="sm">View Asset</Button>
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function PerformanceTab({ employee }: { employee: EmployeePayload }) {
    const scorecards = employee.scorecards || [];
    const latestScorecard = scorecards.length > 0 ? scorecards[0] : null;

    function scorecardStatusBadge(status: string) {
        const s = status.toLowerCase();
        if (s === 'finalized') return 'border-transparent bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-emerald-700 uppercase shadow-none';
        if (s === 'manager_reviewed') return 'border-transparent bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-indigo-700 uppercase shadow-none';
        if (s.includes('pending') || s === 'draft') return 'border-transparent bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-amber-700 uppercase shadow-none';
        return 'border-transparent bg-muted px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-foreground uppercase shadow-none';
    }

    function ratingBadge(rating: string | null) {
        if (!rating) return null;
        const r = rating.toLowerCase();
        if (r === 'outstanding') return 'border-transparent bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-emerald-700 uppercase shadow-none';
        if (r === 'very good') return 'border-transparent bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-blue-700 uppercase shadow-none';
        if (r === 'good') return 'border-transparent bg-teal-100 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-teal-700 uppercase shadow-none';
        if (r === 'needs improvement') return 'border-transparent bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-amber-700 uppercase shadow-none';
        return 'border-transparent bg-red-100 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-red-700 uppercase shadow-none';
    }

    return (
        <div className="space-y-6">
            {/* Current Performance Summary */}
            {latestScorecard && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Target className="h-5 w-5 text-primary" />
                            Current Performance Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-4">
                            <div>
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Cycle</p>
                                <p className="mt-1 text-sm font-semibold">{latestScorecard.cycle?.title ?? '—'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Status</p>
                                <Badge className={scorecardStatusBadge(latestScorecard.status)}>
                                    {latestScorecard.status.replace(/_/g, ' ')}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Overall Score</p>
                                <p className="mt-1 text-sm font-semibold">
                                    {latestScorecard.overall_score ? `${Number(latestScorecard.overall_score).toFixed(1)}%` : '—'}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Rating</p>
                                {latestScorecard.overall_rating ? (
                                    <Badge className={ratingBadge(latestScorecard.overall_rating) ?? ''}>
                                        {latestScorecard.overall_rating}
                                    </Badge>
                                ) : (
                                    <p className="mt-1 text-sm text-muted-foreground">—</p>
                                )}
                            </div>
                        </div>
                        <div className="mt-4">
                            <Link href={`/employee-scorecards/${latestScorecard.id}`}>
                                <Button variant="outline" size="sm">View Scorecard</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Scorecard History */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        Performance History ({scorecards.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {scorecards.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Target className="mb-4 h-10 w-10 text-muted-foreground/50" />
                            <p className="text-sm text-muted-foreground">No performance scorecards found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="pb-2 font-medium">Cycle</th>
                                        <th className="pb-2 font-medium">Status</th>
                                        <th className="pb-2 font-medium">Score</th>
                                        <th className="pb-2 font-medium">Rating</th>
                                        <th className="pb-2 font-medium">Finalized</th>
                                        <th className="pb-2 text-right font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {scorecards.map((sc) => (
                                        <tr key={sc.id} className="border-b last:border-0">
                                            <td className="py-2.5 font-medium">{sc.cycle?.title ?? '—'}</td>
                                            <td className="py-2.5">
                                                <Badge className={scorecardStatusBadge(sc.status)}>
                                                    {sc.status.replace(/_/g, ' ')}
                                                </Badge>
                                            </td>
                                            <td className="py-2.5">
                                                {sc.overall_score ? `${Number(sc.overall_score).toFixed(1)}%` : '—'}
                                            </td>
                                            <td className="py-2.5">
                                                {sc.overall_rating ? (
                                                    <Badge className={ratingBadge(sc.overall_rating) ?? ''}>
                                                        {sc.overall_rating}
                                                    </Badge>
                                                ) : '—'}
                                            </td>
                                            <td className="py-2.5">{sc.finalized_at ?? '—'}</td>
                                            <td className="py-2.5 text-right">
                                                <Link href={`/employee-scorecards/${sc.id}`}>
                                                    <Button variant="ghost" size="sm">View</Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function BenefitsTab({ employee }: { employee: EmployeePayload }) {
    const { can } = useAuthorization();
    const canViewBenefits = can('benefits.view');

    const enrollments = employee.benefit_enrollments || [];
    const activeEnrollments = enrollments.filter((e) => e.status === 'active');
    const otherEnrollments = enrollments.filter((e) => e.status !== 'active');

    function benefitStatusBadge(status: string) {
        const s = status.toLowerCase();
        if (s === 'active') return 'border-transparent bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-emerald-700 uppercase shadow-none';
        if (s === 'suspended') return 'border-transparent bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-amber-700 uppercase shadow-none';
        if (s === 'terminated') return 'border-transparent bg-red-100 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-red-700 uppercase shadow-none';
        if (s === 'draft') return 'border-transparent bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-zinc-600 uppercase shadow-none';
        return 'border-transparent bg-muted px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-foreground uppercase shadow-none';
    }

    function categoryCls(category: string) {
        const c = category.toLowerCase();
        if (c === 'health') return 'border-transparent bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-blue-700 uppercase shadow-none';
        if (c === 'retirement') return 'border-transparent bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-purple-700 uppercase shadow-none';
        if (c === 'insurance') return 'border-transparent bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-indigo-700 uppercase shadow-none';
        return 'border-transparent bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-zinc-600 uppercase shadow-none';
    }

    return (
        <div className="space-y-6">
            {/* Active Benefits */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Heart className="h-5 w-5 text-primary" />
                        Active Benefits ({activeEnrollments.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {activeEnrollments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Heart className="mb-4 h-10 w-10 text-muted-foreground/50" />
                            <p className="text-sm text-muted-foreground">No active benefit enrollments.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="pb-2 font-medium">Benefit</th>
                                        <th className="pb-2 font-medium">Category</th>
                                        <th className="pb-2 font-medium">Plan</th>
                                        <th className="pb-2 font-medium">Effective</th>
                                        <th className="pb-2 font-medium">Employee Contrib.</th>
                                        <th className="pb-2 font-medium">Employer Contrib.</th>
                                        <th className="pb-2 text-right font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeEnrollments.map((e) => (
                                        <tr key={e.id} className="border-b last:border-0">
                                            <td className="py-2.5 font-medium">{e.benefit?.name ?? '—'}</td>
                                            <td className="py-2.5">
                                                {e.benefit?.category ? (
                                                    <Badge className={categoryCls(e.benefit.category)}>
                                                        {e.benefit.category}
                                                    </Badge>
                                                ) : '—'}
                                            </td>
                                            <td className="py-2.5">{e.plan?.name ?? '—'}</td>
                                            <td className="py-2.5">{e.effective_date ?? '—'}</td>
                                            <td className="py-2.5">{e.employee_contribution ?? '—'}</td>
                                            <td className="py-2.5">{e.employer_contribution ?? '—'}</td>
                                            <td className="py-2.5 text-right">
                                                {canViewBenefits && (
                                                    <Link href={e.show_url}>
                                                        <Button variant="ghost" size="sm">View</Button>
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Benefit History */}
            {otherEnrollments.length > 0 && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Heart className="h-5 w-5 text-primary" />
                            Benefit History ({otherEnrollments.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="pb-2 font-medium">Benefit</th>
                                        <th className="pb-2 font-medium">Plan</th>
                                        <th className="pb-2 font-medium">Status</th>
                                        <th className="pb-2 font-medium">Effective</th>
                                        <th className="pb-2 font-medium">End Date</th>
                                        <th className="pb-2 text-right font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {otherEnrollments.map((e) => (
                                        <tr key={e.id} className="border-b last:border-0">
                                            <td className="py-2.5 font-medium">{e.benefit?.name ?? '—'}</td>
                                            <td className="py-2.5">{e.plan?.name ?? '—'}</td>
                                            <td className="py-2.5">
                                                <Badge className={benefitStatusBadge(e.status)}>
                                                    {e.status.replace(/_/g, ' ')}
                                                </Badge>
                                            </td>
                                            <td className="py-2.5">{e.effective_date ?? '—'}</td>
                                            <td className="py-2.5">{e.end_date ?? '—'}</td>
                                            <td className="py-2.5 text-right">
                                                {canViewBenefits && (
                                                    <Link href={e.show_url}>
                                                        <Button variant="ghost" size="sm">View</Button>
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function stringifyNullable(value: string | number | null | undefined) {
    return value === null || value === undefined ? '' : String(value);
}

function statusBadgeClass(value?: string | null) {
    const normalized = (value ?? '').toUpperCase();
    if (
        normalized === 'ACTIVE' ||
        normalized === 'ON_TRACK' ||
        normalized === 'VERIFIED'
    )
        return 'border-transparent bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-primary uppercase shadow-none';
    if (normalized === 'COMPLETED')
        return 'border-transparent bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-emerald-700 uppercase shadow-none';
    if (normalized === 'AT_RISK' || normalized === 'PENDING')
        return 'border-transparent bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-amber-700 uppercase shadow-none';
    return 'border-transparent bg-muted px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-foreground uppercase shadow-none';
}

const tabClass =
    'relative rounded-none border-b-2 border-transparent bg-transparent py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-none hover:text-foreground data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none';
