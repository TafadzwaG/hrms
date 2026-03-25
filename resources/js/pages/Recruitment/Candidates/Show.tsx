import type { ComponentProps, ReactNode } from 'react';
import { useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    Banknote,
    Briefcase,
    ClipboardList,
    Download,
    FileText,
    GraduationCap,
    Pencil,
    Plus,
    Star,
    Tags,
    Trash2,
    Upload,
    User,
    Wallet,
} from 'lucide-react';

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
import AppLayout from '@/layouts/app-layout';
import {
    CandidateFormField,
    RecruitmentCandidateSectionHeading,
    RecruitmentCandidateSummaryCard,
    candidateFileInputClassName,
    candidateTextAreaClassName,
    candidateUnderlinedInput,
    formatCandidateDate,
    formatCandidateLabel,
    formatCandidateMoney,
    recruitmentCandidateMutedCardClassName,
    recruitmentCandidateSectionClassName,
} from './profile-primitives';

type Resume = {
    id: number;
    file_name: string;
    is_primary: boolean;
    created_at: string | null;
    download_url: string;
};

type Education = {
    id: number;
    institution: string;
    qualification: string;
    field_of_study: string | null;
    start_date: string | null;
    end_date: string | null;
    grade?: string | null;
};

type Experience = {
    id: number;
    company_name: string;
    job_title: string;
    start_date: string | null;
    end_date: string | null;
    is_current: boolean;
    description: string | null;
};

type Skill = {
    id: number;
    name: string;
    proficiency: string | null;
    years_experience?: number | null;
};

type Application = {
    id: number;
    vacancy: {
        id: number;
        title: string;
        company: string;
    } | null;
    status: string;
    applied_at: string | null;
};

type Payment = {
    id: number;
    amount: string | number | null;
    currency: string | null;
    status: string;
    provider: string | null;
    paid_at: string | null;
    created_at: string | null;
};

type Candidate = {
    id: number;
    full_name: string;
    email: string;
    phone: string | null;
    alt_phone: string | null;
    national_id: string | null;
    gender: string | null;
    date_of_birth: string | null;
    location: string | null;
    headline: string | null;
    professional_summary: string | null;
    expected_salary: string | number | null;
    salary_currency: string | null;
    years_experience: number | null;
    highest_education: string | null;
    visibility_status: string;
    is_public: boolean;
    listing_activated_at: string | null;
    listing_expires_at: string | null;
    resumes: Resume[];
    education: Education[];
    experience: Experience[];
    skills: Skill[];
    applications: Application[];
    payments?: Payment[];
};

type DeleteItem = {
    type: 'resumes' | 'educations' | 'experiences' | 'skills';
    id: number;
    name: string;
};

type PageProps = {
    candidate: Candidate;
};

type BadgeVariant = NonNullable<ComponentProps<typeof Badge>['variant']>;

const statusVariants: Record<string, BadgeVariant> = {
    active: 'success',
    draft: 'secondary',
    pending_payment: 'warning',
    payment_pending: 'warning',
    expired: 'muted',
    suspended: 'danger',
    applied: 'info',
    shortlisted: 'accent',
    interviewed: 'warning',
    offered: 'chart4',
    hired: 'success',
    rejected: 'danger',
    withdrawn: 'secondary',
    paid: 'success',
    pending: 'warning',
    failed: 'danger',
};

const compactPrimaryButtonClassName =
    'h-10 rounded-md bg-primary px-5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95';

const compactSecondaryButtonClassName =
    'h-10 rounded-md border border-border bg-background px-4 text-xs font-bold uppercase tracking-wider text-foreground shadow-sm transition-all hover:bg-muted active:scale-95';

const compactDestructiveButtonClassName =
    'h-10 rounded-md border border-destructive/30 bg-background px-4 text-xs font-bold uppercase tracking-wider text-destructive shadow-sm transition-all hover:bg-destructive/10 active:scale-95';

export default function CandidateShow() {
    const { candidate } = usePage<PageProps>().props;
    const [itemToDelete, setItemToDelete] = useState<DeleteItem | null>(null);
    const canActivate =
        candidate.visibility_status === 'draft' ||
        candidate.visibility_status === 'pending_payment';

    const resumeForm = useForm<{ file: File | null }>({ file: null });
    const eduForm = useForm({
        institution: '',
        qualification: '',
        field_of_study: '',
        start_date: '',
        end_date: '',
        grade: '',
    });
    const expForm = useForm({
        company_name: '',
        job_title: '',
        start_date: '',
        end_date: '',
        is_current: false,
        description: '',
    });
    const skillForm = useForm({
        name: '',
        proficiency: '',
        years_experience: '',
    });

    const handleDeleteItem = () => {
        if (!itemToDelete) {
            return;
        }

        router.delete(
            `/candidate-profiles/${candidate.id}/${itemToDelete.type}/${itemToDelete.id}`,
            {
                preserveScroll: true,
                onSuccess: () => setItemToDelete(null),
            },
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Recruitment', href: '/recruitment' },
                { title: 'Candidates', href: '/candidate-profiles' },
                { title: candidate.full_name },
            ]}
        >
            <Head title={candidate.full_name} />

            <div className="w-full space-y-6 bg-muted/10 p-4 lg:p-8">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">
                                {candidate.full_name}
                            </h1>
                            <StatusBadge status={candidate.visibility_status} />
                            <Badge
                                variant={candidate.is_public ? 'success' : 'secondary'}
                            >
                                {candidate.is_public ? 'Public listing' : 'Private listing'}
                            </Badge>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">
                            {candidate.headline ||
                                'No professional headline has been set for this candidate yet.'}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {canActivate ? (
                            <Link href={`/candidate-profiles/${candidate.id}/checkout`}>
                                <Button className={compactPrimaryButtonClassName}>
                                    <Banknote className="mr-2 h-4 w-4" />
                                    Pay To Activate
                                </Button>
                            </Link>
                        ) : null}
                        <Link href={`/candidate-profiles/${candidate.id}/edit`}>
                            <Button
                                variant="outline"
                                className={compactSecondaryButtonClassName}
                            >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Candidate
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-8">
                        <section className={recruitmentCandidateSectionClassName}>
                            <RecruitmentCandidateSectionHeading
                                icon={User}
                                title="Personal Information"
                                kicker="Candidate identity"
                            />
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {[
                                    ['Full Name', candidate.full_name],
                                    ['Email Address', candidate.email],
                                    ['Phone Number', candidate.phone],
                                    ['Alt Phone', candidate.alt_phone],
                                    ['National ID', candidate.national_id],
                                    [
                                        'Gender',
                                        candidate.gender
                                            ? formatCandidateLabel(candidate.gender)
                                            : null,
                                    ],
                                    ['Date of Birth', formatCandidateDate(candidate.date_of_birth)],
                                    ['Location', candidate.location],
                                ].map(([label, value]) => (
                                    <DetailField key={String(label)} label={String(label)} value={value} />
                                ))}
                            </div>
                        </section>

                        <section className={recruitmentCandidateSectionClassName}>
                            <RecruitmentCandidateSectionHeading
                                icon={Briefcase}
                                title="Professional Summary"
                                kicker="Career snapshot"
                            />
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <DetailField
                                    label="Professional Headline"
                                    value={candidate.headline}
                                />
                                <DetailField
                                    label="Expected Salary"
                                    value={
                                        candidate.expected_salary
                                            ? `${candidate.salary_currency ?? ''} ${formatCandidateMoney(candidate.expected_salary)}`
                                            : null
                                    }
                                />
                                <DetailField
                                    label="Years Experience"
                                    value={
                                        candidate.years_experience !== null &&
                                        candidate.years_experience !== undefined
                                            ? String(candidate.years_experience)
                                            : null
                                    }
                                />
                                <DetailField
                                    label="Highest Education"
                                    value={
                                        candidate.highest_education
                                            ? formatCandidateLabel(candidate.highest_education)
                                            : null
                                    }
                                />
                            </div>
                            <div className="mt-6 rounded-lg border border-border/70 bg-muted/20 p-4">
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Professional Summary
                                </p>
                                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                                    {candidate.professional_summary || 'No professional summary added.'}
                                </p>
                            </div>
                        </section>
                        <section className={recruitmentCandidateSectionClassName}>
                            <RecruitmentCandidateSectionHeading
                                icon={FileText}
                                title="Resume Library"
                                kicker={`${candidate.resumes.length} files`}
                            />
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    resumeForm.post(`/candidate-profiles/${candidate.id}/resumes`, {
                                        forceFormData: true,
                                        preserveScroll: true,
                                        onSuccess: () => resumeForm.reset(),
                                    });
                                }}
                                className="grid gap-4 border-b border-border/70 pb-6 md:grid-cols-[1fr_auto] md:items-end"
                            >
                                <CandidateFormField
                                    label="Upload Resume"
                                    error={resumeForm.errors.file}
                                >
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        className={candidateFileInputClassName}
                                        onChange={(event) =>
                                            resumeForm.setData('file', event.target.files?.[0] ?? null)
                                        }
                                    />
                                </CandidateFormField>
                                <Button
                                    type="submit"
                                    disabled={resumeForm.processing}
                                    className={compactPrimaryButtonClassName}
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Resume
                                </Button>
                            </form>
                            <div className="mt-6 space-y-3">
                                {candidate.resumes.length === 0 ? (
                                    <EmptyCollection message="No resumes have been uploaded yet." />
                                ) : (
                                    candidate.resumes.map((resume) => (
                                        <div
                                            key={resume.id}
                                            className={`${recruitmentCandidateMutedCardClassName} flex flex-col gap-4 md:flex-row md:items-center md:justify-between`}
                                        >
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="text-sm font-semibold text-foreground">
                                                        {resume.file_name}
                                                    </p>
                                                    <Badge
                                                        variant={resume.is_primary ? 'success' : 'secondary'}
                                                    >
                                                        {resume.is_primary ? 'Primary' : 'Secondary'}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Uploaded {formatCandidateDate(resume.created_at)}
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    className={compactSecondaryButtonClassName}
                                                >
                                                    <a href={resume.download_url}>
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Download
                                                    </a>
                                                </Button>
                                                {!resume.is_primary ? (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className={compactSecondaryButtonClassName}
                                                        onClick={() =>
                                                            router.put(
                                                                `/candidate-profiles/${candidate.id}/resumes/${resume.id}/set-primary`,
                                                                {},
                                                                { preserveScroll: true },
                                                            )
                                                        }
                                                    >
                                                        <Star className="mr-2 h-4 w-4" />
                                                        Set Primary
                                                    </Button>
                                                ) : null}
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className={compactDestructiveButtonClassName}
                                                    onClick={() =>
                                                        setItemToDelete({
                                                            type: 'resumes',
                                                            id: resume.id,
                                                            name: resume.file_name,
                                                        })
                                                    }
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        <EntitySection
                            icon={GraduationCap}
                            title="Education History"
                            kicker={`${candidate.education.length} records`}
                            form={
                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        eduForm.post(`/candidate-profiles/${candidate.id}/educations`, {
                                            preserveScroll: true,
                                            onSuccess: () => eduForm.reset(),
                                        });
                                    }}
                                    className="grid grid-cols-1 gap-5 border-b border-border/70 pb-6 md:grid-cols-2"
                                >
                                    <FieldInput
                                        label="Institution"
                                        error={eduForm.errors.institution}
                                        value={eduForm.data.institution}
                                        onChange={(value) => eduForm.setData('institution', value)}
                                    />
                                    <FieldInput
                                        label="Qualification"
                                        error={eduForm.errors.qualification}
                                        value={eduForm.data.qualification}
                                        onChange={(value) => eduForm.setData('qualification', value)}
                                    />
                                    <FieldInput
                                        label="Field of Study"
                                        error={eduForm.errors.field_of_study}
                                        value={eduForm.data.field_of_study}
                                        onChange={(value) => eduForm.setData('field_of_study', value)}
                                    />
                                    <FieldInput
                                        label="Grade"
                                        error={eduForm.errors.grade}
                                        value={eduForm.data.grade}
                                        onChange={(value) => eduForm.setData('grade', value)}
                                    />
                                    <FieldInput
                                        label="Start Date"
                                        type="date"
                                        error={eduForm.errors.start_date}
                                        value={eduForm.data.start_date}
                                        onChange={(value) => eduForm.setData('start_date', value)}
                                    />
                                    <FieldInput
                                        label="End Date"
                                        type="date"
                                        error={eduForm.errors.end_date}
                                        value={eduForm.data.end_date}
                                        onChange={(value) => eduForm.setData('end_date', value)}
                                    />
                                    <div className="md:col-span-2">
                                        <Button
                                            type="submit"
                                            disabled={eduForm.processing}
                                            className={compactPrimaryButtonClassName}
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Education
                                        </Button>
                                    </div>
                                </form>
                            }
                            emptyMessage="No education records have been added yet."
                            items={candidate.education.map((education) => (
                                <div
                                    key={education.id}
                                    className={`${recruitmentCandidateMutedCardClassName} flex flex-col gap-4 md:flex-row md:items-start md:justify-between`}
                                >
                                    <div className="space-y-2">
                                        <p className="text-base font-semibold text-foreground">
                                            {education.institution}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {education.qualification}
                                            {education.field_of_study ? ` • ${education.field_of_study}` : ''}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatCandidateDate(education.start_date)} - {formatCandidateDate(education.end_date)}
                                        </p>
                                        {education.grade ? (
                                            <Badge variant="secondary">Grade {education.grade}</Badge>
                                        ) : null}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className={compactDestructiveButtonClassName}
                                        onClick={() =>
                                            setItemToDelete({
                                                type: 'educations',
                                                id: education.id,
                                                name: education.institution,
                                            })
                                        }
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        />

                        <EntitySection
                            icon={Briefcase}
                            title="Experience History"
                            kicker={`${candidate.experience.length} roles`}
                            form={
                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        expForm.post(`/candidate-profiles/${candidate.id}/experiences`, {
                                            preserveScroll: true,
                                            onSuccess: () => expForm.reset(),
                                        });
                                    }}
                                    className="space-y-5 border-b border-border/70 pb-6"
                                >
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        <FieldInput
                                            label="Company Name"
                                            error={expForm.errors.company_name}
                                            value={expForm.data.company_name}
                                            onChange={(value) => expForm.setData('company_name', value)}
                                        />
                                        <FieldInput
                                            label="Job Title"
                                            error={expForm.errors.job_title}
                                            value={expForm.data.job_title}
                                            onChange={(value) => expForm.setData('job_title', value)}
                                        />
                                        <FieldInput
                                            label="Start Date"
                                            type="date"
                                            error={expForm.errors.start_date}
                                            value={expForm.data.start_date}
                                            onChange={(value) => expForm.setData('start_date', value)}
                                        />
                                        <FieldInput
                                            label="End Date"
                                            type="date"
                                            error={expForm.errors.end_date}
                                            value={expForm.data.end_date}
                                            onChange={(value) => expForm.setData('end_date', value)}
                                            disabled={expForm.data.is_current}
                                        />
                                    </div>
                                    <label className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                                        <input
                                            type="checkbox"
                                            checked={expForm.data.is_current}
                                            onChange={(event) => expForm.setData('is_current', event.target.checked)}
                                            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                                        />
                                        Candidate currently works here
                                    </label>
                                    <CandidateFormField
                                        label="Responsibilities & Achievements"
                                        error={expForm.errors.description}
                                    >
                                        <textarea
                                            rows={4}
                                            value={expForm.data.description}
                                            onChange={(event) => expForm.setData('description', event.target.value)}
                                            className={candidateTextAreaClassName}
                                        />
                                    </CandidateFormField>
                                    <Button
                                        type="submit"
                                        disabled={expForm.processing}
                                        className={compactPrimaryButtonClassName}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Experience
                                    </Button>
                                </form>
                            }
                            emptyMessage="No work experience has been recorded yet."
                            items={candidate.experience.map((experience) => (
                                <div
                                    key={experience.id}
                                    className={`${recruitmentCandidateMutedCardClassName} flex flex-col gap-4 md:flex-row md:items-start md:justify-between`}
                                >
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="text-base font-semibold text-foreground">
                                                {experience.job_title}
                                            </p>
                                            <Badge variant={experience.is_current ? 'success' : 'secondary'}>
                                                {experience.is_current ? 'Current' : 'Previous'}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {experience.company_name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatCandidateDate(experience.start_date)} -{' '}
                                            {experience.is_current
                                                ? 'Present'
                                                : formatCandidateDate(experience.end_date)}
                                        </p>
                                        {experience.description ? (
                                            <p className="text-sm leading-relaxed text-foreground">
                                                {experience.description}
                                            </p>
                                        ) : null}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className={compactDestructiveButtonClassName}
                                        onClick={() =>
                                            setItemToDelete({
                                                type: 'experiences',
                                                id: experience.id,
                                                name: experience.job_title,
                                            })
                                        }
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        />
                        <section className={recruitmentCandidateSectionClassName}>
                            <RecruitmentCandidateSectionHeading
                                icon={Tags}
                                title="Skills Inventory"
                                kicker={`${candidate.skills.length} skills`}
                            />
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    skillForm.post(`/candidate-profiles/${candidate.id}/skills`, {
                                        preserveScroll: true,
                                        onSuccess: () => skillForm.reset(),
                                    });
                                }}
                                className="grid grid-cols-1 gap-5 border-b border-border/70 pb-6 md:grid-cols-[1fr_1fr_160px_auto] md:items-end"
                            >
                                <FieldInput
                                    label="Skill Name"
                                    error={skillForm.errors.name}
                                    value={skillForm.data.name}
                                    onChange={(value) => skillForm.setData('name', value)}
                                />
                                <FieldInput
                                    label="Proficiency"
                                    error={skillForm.errors.proficiency}
                                    value={skillForm.data.proficiency}
                                    onChange={(value) => skillForm.setData('proficiency', value)}
                                />
                                <FieldInput
                                    label="Years Experience"
                                    type="number"
                                    error={skillForm.errors.years_experience}
                                    value={skillForm.data.years_experience}
                                    onChange={(value) => skillForm.setData('years_experience', value)}
                                />
                                <Button
                                    type="submit"
                                    disabled={skillForm.processing}
                                    className={compactPrimaryButtonClassName}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Skill
                                </Button>
                            </form>
                            <div className="mt-6 flex flex-wrap gap-2">
                                {candidate.skills.length === 0 ? (
                                    <EmptyCollection message="No skills have been added yet." />
                                ) : (
                                    candidate.skills.map((skill) => (
                                        <div
                                            key={skill.id}
                                            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm shadow-sm"
                                        >
                                            <Tags className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="font-semibold text-foreground">{skill.name}</span>
                                            {skill.proficiency ? (
                                                <span className="text-xs text-muted-foreground">
                                                    {skill.proficiency}
                                                </span>
                                            ) : null}
                                            {skill.years_experience ? (
                                                <span className="text-xs text-muted-foreground">
                                                    {skill.years_experience} yrs
                                                </span>
                                            ) : null}
                                            <button
                                                type="button"
                                                className="rounded-full p-1 text-destructive transition-colors hover:bg-destructive/10"
                                                onClick={() =>
                                                    setItemToDelete({
                                                        type: 'skills',
                                                        id: skill.id,
                                                        name: skill.name,
                                                    })
                                                }
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        <section className={recruitmentCandidateSectionClassName}>
                            <RecruitmentCandidateSectionHeading
                                icon={ClipboardList}
                                title="Applications"
                                kicker={`${candidate.applications.length} submissions`}
                            />
                            <div className="space-y-3">
                                {candidate.applications.length === 0 ? (
                                    <EmptyCollection message="This candidate has not applied for any vacancies yet." />
                                ) : (
                                    candidate.applications.map((application) => (
                                        <div
                                            key={application.id}
                                            className={`${recruitmentCandidateMutedCardClassName} flex flex-col gap-4 md:flex-row md:items-center md:justify-between`}
                                        >
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="text-base font-semibold text-foreground">
                                                        {application.vacancy?.title || 'Vacancy unavailable'}
                                                    </p>
                                                    <StatusBadge status={application.status} />
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {application.vacancy?.company || 'Employer'}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Applied {formatCandidateDate(application.applied_at)}
                                                </p>
                                            </div>
                                            {application.vacancy ? (
                                                <Link href={`/vacancies/${application.vacancy.id}`}>
                                                    <Button
                                                        variant="outline"
                                                        className={compactSecondaryButtonClassName}
                                                    >
                                                        <Briefcase className="mr-2 h-4 w-4" />
                                                        View Vacancy
                                                    </Button>
                                                </Link>
                                            ) : null}
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-8">
                        <RecruitmentCandidateSummaryCard
                            fullName={candidate.full_name}
                            headline={candidate.headline}
                            email={candidate.email}
                            phone={candidate.phone}
                            location={candidate.location}
                            metrics={[
                                { label: 'Applications', value: candidate.applications.length },
                                { label: 'Resumes', value: candidate.resumes.length },
                            ]}
                        />

                        <section className={recruitmentCandidateSectionClassName}>
                            <RecruitmentCandidateSectionHeading
                                icon={Briefcase}
                                title="Listing State"
                                kicker="Visibility controls"
                            />
                            <div className="space-y-4">
                                <div className={recruitmentCandidateMutedCardClassName}>
                                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Visibility Status
                                    </p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <StatusBadge status={candidate.visibility_status} />
                                        <Badge
                                            variant={candidate.is_public ? 'success' : 'secondary'}
                                        >
                                            {candidate.is_public ? 'Public' : 'Private'}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <DetailField
                                        compact
                                        label="Activated"
                                        value={formatCandidateDate(candidate.listing_activated_at)}
                                    />
                                    <DetailField
                                        compact
                                        label="Expires"
                                        value={formatCandidateDate(candidate.listing_expires_at)}
                                    />
                                    <DetailField
                                        compact
                                        label="Education"
                                        value={
                                            candidate.highest_education
                                                ? formatCandidateLabel(candidate.highest_education)
                                                : null
                                        }
                                    />
                                    <DetailField
                                        compact
                                        label="Experience"
                                        value={
                                            candidate.years_experience !== null &&
                                            candidate.years_experience !== undefined
                                                ? `${candidate.years_experience} yrs`
                                                : null
                                        }
                                    />
                                </div>
                            </div>
                        </section>

                        <section className={recruitmentCandidateSectionClassName}>
                            <RecruitmentCandidateSectionHeading
                                icon={Wallet}
                                title="Payment History"
                                kicker={`${candidate.payments?.length ?? 0} payments`}
                            />
                            <div className="space-y-3">
                                {(candidate.payments ?? []).length === 0 ? (
                                    <EmptyCollection message="No listing payments have been recorded yet." />
                                ) : (
                                    candidate.payments!.map((payment) => (
                                        <div
                                            key={payment.id}
                                            className={recruitmentCandidateMutedCardClassName}
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-3">
                                                <p className="text-sm font-semibold text-foreground">
                                                    {(payment.currency || 'USD').toUpperCase()}{' '}
                                                    {formatCandidateMoney(payment.amount)}
                                                </p>
                                                <StatusBadge status={payment.status} />
                                            </div>
                                            <p className="mt-2 text-xs text-muted-foreground">
                                                Provider: {payment.provider || 'Unspecified'}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Paid {formatCandidateDate(payment.paid_at || payment.created_at)}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        <section className={recruitmentCandidateMutedCardClassName}>
                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                Admin guidance
                            </p>
                            <ul className="mt-4 space-y-3 text-sm font-medium text-foreground/80">
                                <li>Update the core identity and summary fields from the edit page.</li>
                                <li>Resume, education, experience, and skills are curated directly from this page.</li>
                                <li>Activate the listing once the profile is complete and ready for employer discovery.</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>

            <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                            Remove{' '}
                            <span className="font-semibold text-foreground">
                                {itemToDelete?.name}
                            </span>{' '}
                            from this candidate profile. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={handleDeleteItem}
                        >
                            Delete item
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}

function StatusBadge({ status }: { status: string }) {
    return (
        <Badge variant={statusVariants[status] ?? 'secondary'}>
            {formatCandidateLabel(status)}
        </Badge>
    );
}

function DetailField({
    label,
    value,
    compact = false,
}: {
    label: string;
    value?: ReactNode;
    compact?: boolean;
}) {
    return (
        <div className={compact ? recruitmentCandidateMutedCardClassName : 'space-y-2'}>
            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                {label}
            </p>
            <p className="text-sm font-semibold text-foreground">{value || '—'}</p>
        </div>
    );
}

function FieldInput({
    label,
    value,
    onChange,
    error,
    type = 'text',
    disabled = false,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    type?: string;
    disabled?: boolean;
}) {
    return (
        <CandidateFormField label={label} error={error}>
            <input
                type={type}
                value={value}
                disabled={disabled}
                onChange={(event) => onChange(event.target.value)}
                className={candidateUnderlinedInput}
            />
        </CandidateFormField>
    );
}

function EmptyCollection({ message }: { message: string }) {
    return (
        <div className="rounded-lg border border-dashed border-border/70 bg-muted/20 px-4 py-8 text-center text-sm font-medium text-muted-foreground">
            {message}
        </div>
    );
}

function EntitySection({
    icon,
    title,
    kicker,
    form,
    items,
    emptyMessage,
}: {
    icon: ComponentProps<typeof RecruitmentCandidateSectionHeading>['icon'];
    title: string;
    kicker: string;
    form: ReactNode;
    items: ReactNode[];
    emptyMessage: string;
}) {
    return (
        <section className={recruitmentCandidateSectionClassName}>
            <RecruitmentCandidateSectionHeading icon={icon} title={title} kicker={kicker} />
            {form}
            <div className="mt-6 space-y-3">
                {items.length === 0 ? <EmptyCollection message={emptyMessage} /> : items}
            </div>
        </section>
    );
}
