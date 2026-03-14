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
    CreditCard,
    Download,
    FileText,
    Mail,
    MapPin,
    Pencil,
    Phone,
    Plus,
    Ruler,
    Save,
    Target,
    Trash2,
    UserCircle2,
    Users,
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
    document_type: DocumentTypeItem | null;
    download_url: string;
    delete_url: string;
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
    pay_point: string | null;
    contact_number: string | null;
    address: string | null;
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
    stats: {
        documents_count: number;
        next_of_kin_count: number;
        skills_count: number;
        kpis_count: number;
    };
    links: {
        document_store: string;
        next_of_kin_store: string;
        physical_profile_store: string;
        skill_store: string;
        job_profile_store: string;
        kpi_store: string;
    };
};
type OptionsPayload = {
    document_types: DocumentTypeItem[];
    document_access_policies: string[];
    skill_levels: string[];
    employment_types: string[];
    kpi_statuses: string[];
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
                                <TabsList className="flex h-auto w-full justify-start gap-6 rounded-none bg-transparent p-0">
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
    return (
        <Card className="border-border bg-background shadow-sm">
            <CardHeader className="border-b border-border/50 pb-4">
                <CardTitle className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                    Linked User Account
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
                {employee.user ? (
                    <>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 border border-border shadow-sm">
                                <AvatarFallback className="bg-muted font-bold text-foreground">
                                    {getInitials(employee.user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-bold text-foreground">
                                    {employee.user.name}
                                </p>
                                <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                                    {employee.user.email}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-3 pt-2">
                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                Access Roles
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {employee.user.roles.length > 0 ? (
                                    employee.user.roles.map((role) => (
                                        <Badge
                                            key={role.id}
                                            variant="outline"
                                            className={`px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase shadow-none ${roleBadgeClass(role.code, role.name)}`}
                                        >
                                            {role.code}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-xs text-muted-foreground">
                                        No roles assigned
                                    </span>
                                )}
                            </div>
                        </div>
                        {canAny(['users.view', 'users.update']) && (
                            <Button
                                asChild
                                variant="outline"
                                className="h-10 w-full border-border font-bold shadow-sm"
                            >
                                <Link href={`/users/${employee.user.id}`}>
                                    Manage Permissions
                                </Link>
                            </Button>
                        )}
                    </>
                ) : (
                    <div className="space-y-3 py-4 text-center">
                        <p className="text-sm font-medium text-muted-foreground">
                            No system account is linked to this employee
                            profile.
                        </p>
                        {canCreateUser && (
                            <Button
                                asChild
                                variant="outline"
                                className="h-10 w-full border-border font-bold shadow-sm"
                            >
                                <Link href="/users/create">Create Account</Link>
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function PhysicalSummaryCard({ employee }: { employee: EmployeePayload }) {
    return (
        <Card className="border-border bg-background shadow-sm">
            <CardHeader className="border-b border-border/50 pb-4">
                <CardTitle className="flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                    <Ruler className="h-4 w-4" />
                    Physical Attributes
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 rounded-xl border border-border bg-muted/10 p-4">
                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                            Uniform Size
                        </p>
                        <p className="text-base font-bold text-foreground">
                            {employee.physical_profile?.uniform_size ||
                                'Not set'}
                        </p>
                    </div>
                    <div className="space-y-1 rounded-xl border border-border bg-muted/10 p-4">
                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                            Shoe Size
                        </p>
                        <p className="text-base font-bold text-foreground">
                            {employee.physical_profile?.shoe_size || 'Not set'}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
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
                    topSkills.map((skill) => (
                        <div key={skill.id} className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-foreground">
                                    {skill.name}
                                </span>
                                <span className="text-muted-foreground">
                                    {skill.proficiency_level}
                                </span>
                            </div>
                            <Progress
                                value={skill.proficiency_percent}
                                className="h-1.5 border border-border/50 bg-muted [&>div]:bg-foreground"
                            />
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}

function KpiSnapshotCard({ employee }: { employee: EmployeePayload }) {
    return (
        <Card className="border-border bg-background shadow-sm">
            <CardHeader className="border-b border-border/50 pb-4">
                <CardTitle className="flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                    <Target className="h-4 w-4" />
                    KPI Snapshot
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-2 gap-4">
                    <SummaryTile
                        icon={<Target className="h-3 w-3" />}
                        label="KPIs"
                        value={employee.stats.kpis_count.toString()}
                    />
                    <SummaryTile
                        icon={<FileText className="h-3 w-3" />}
                        label="Documents"
                        value={employee.stats.documents_count.toString()}
                    />
                </div>
                {employee.kpis[0] && (
                    <div className="rounded-xl border border-border/60 p-4">
                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                            Lead KPI
                        </p>
                        <p className="mt-1 text-sm font-bold text-foreground">
                            {employee.kpis[0].title}
                        </p>
                        <Progress
                            value={employee.kpis[0].progress_percent}
                            className="mt-3 h-1.5 border border-border/50 bg-muted [&>div]:bg-foreground"
                        />
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
                        canCreateDocuments && (
                            <CollapsibleTrigger asChild>
                                <Button className="h-10 shrink-0 bg-foreground font-bold text-background shadow-sm hover:bg-foreground/90">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Document
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
                                        <span>{document.file_name}</span>
                                        <span>
                                            Uploaded{' '}
                                            {formatDateTime(
                                                document.created_at,
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
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
                                    <InlineInputField
                                        label="Relationship"
                                        value={form.data.relationship}
                                        onChange={(value) =>
                                            form.setData('relationship', value)
                                        }
                                        error={form.errors.relationship}
                                    />
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
                                    <InlineInputField
                                        label="Blood Type"
                                        value={form.data.blood_type}
                                        onChange={(value) =>
                                            form.setData('blood_type', value)
                                        }
                                        error={form.errors.blood_type}
                                    />
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                <SummaryTile
                    icon={<Ruler className="h-3 w-3" />}
                    label="Uniform Size"
                    value={
                        employee.physical_profile?.uniform_size ||
                        'Not recorded'
                    }
                />
                <SummaryTile
                    icon={<Ruler className="h-3 w-3" />}
                    label="Shoe Size"
                    value={
                        employee.physical_profile?.shoe_size || 'Not recorded'
                    }
                />
                <SummaryTile
                    icon={<Ruler className="h-3 w-3" />}
                    label="Blood Type"
                    value={
                        employee.physical_profile?.blood_type || 'Not recorded'
                    }
                />
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
                    icon={<Ruler className="h-3 w-3" />}
                    label="Weight"
                    value={
                        employee.physical_profile?.weight_kg
                            ? `${employee.physical_profile.weight_kg} kg`
                            : 'Not recorded'
                    }
                />
                <SummaryTile
                    icon={<Ruler className="h-3 w-3" />}
                    label="Shirt / Trouser"
                    value={
                        employee.physical_profile
                            ? `${employee.physical_profile.shirt_size || 'N/A'} / ${employee.physical_profile.trouser_size || 'N/A'}`
                            : 'Not recorded'
                    }
                />
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
                        {employee.skills.map((skill) => (
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
                                                variant="secondary"
                                                className="border-transparent bg-muted text-[10px] tracking-widest text-muted-foreground uppercase shadow-none"
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
                                    className="h-2 border border-border/50 bg-muted [&>div]:bg-foreground"
                                />
                                <div className="flex flex-wrap justify-between gap-2 text-xs font-medium text-muted-foreground">
                                    <span>
                                        {skill.proficiency_percent}% proficiency
                                    </span>
                                    <span>
                                        {skill.certified_at
                                            ? `Certified ${formatDate(skill.certified_at)}`
                                            : 'Certification date not recorded'}
                                    </span>
                                </div>
                            </div>
                        ))}
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
            <Card className="border-border bg-background shadow-sm">
                <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                    <SummaryTile
                        icon={<Briefcase className="h-3 w-3" />}
                        label="Title"
                        value={
                            employee.job_profile?.title ||
                            employee.position?.name ||
                            'Not recorded'
                        }
                    />
                    <SummaryTile
                        icon={<Briefcase className="h-3 w-3" />}
                        label="Employment Type"
                        value={
                            employee.job_profile?.employment_type ||
                            'Not recorded'
                        }
                    />
                    <SummaryTile
                        icon={<Users className="h-3 w-3" />}
                        label="Reports To"
                        value={
                            employee.job_profile?.reports_to ||
                            employee.manager?.full_name ||
                            'Not recorded'
                        }
                    />
                    <SummaryTile
                        icon={<Calendar className="h-3 w-3" />}
                        label="Review Date"
                        value={
                            employee.job_profile?.review_date
                                ? formatDate(employee.job_profile.review_date)
                                : 'Not recorded'
                        }
                    />
                    <SummaryTile
                        icon={<Building2 className="h-3 w-3" />}
                        label="Location Summary"
                        value={
                            employee.job_profile?.location_summary ||
                            'Not recorded'
                        }
                    />
                    <SummaryTile
                        icon={<Calendar className="h-3 w-3" />}
                        label="Working Hours"
                        value={
                            employee.job_profile?.working_hours ||
                            'Not recorded'
                        }
                    />
                    <NotesCard
                        title="Summary"
                        content={employee.job_profile?.summary}
                    />
                    <NotesCard
                        title="Responsibilities"
                        content={employee.job_profile?.responsibilities}
                    />
                    <div className="md:col-span-2">
                        <NotesCard
                            title="Requirements"
                            content={employee.job_profile?.requirements}
                        />
                    </div>
                </CardContent>
            </Card>
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
