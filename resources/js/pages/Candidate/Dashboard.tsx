import { Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import {
    Award,
    BookOpen,
    Briefcase,
    Calendar,
    CalendarRangeIcon,
    DollarSignIcon,
    Download,
    Eye,
    FileText,
    GraduationCap,
    Mail,
    MapPin,
    Pencil,
    Phone,
    Plus,
    Search,
    ShieldCheck,
    Star,
    Tangent,
    Upload,
    User,
    Wrench,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    CandidateMetricCard,
    CandidateEmptyState,
    candidateBreadcrumbs,
    CandidateHubLayout,
    CandidateInfoField,
    CandidateSectionCard,
    candidateSkillLevelColor,
    candidateStatusColor,
    candidateVisibilityColor,
    formatCandidateDate,
    getInitials,
} from './components/hub';
import {
    candidatePrimaryButtonClassName,
    candidateSecondaryButtonClassName,
} from './components/form';
import type {
    CandidateApplication,
    CandidateDocument,
    CandidateEducation,
    CandidateExperience,
    CandidateMetrics,
    CandidateRecommendedVacancy,
    CandidateSkill,
    CandidateUser,
} from './dummyData';

type PageProps = {
    candidate: CandidateUser;
    metrics: CandidateMetrics;
    completeness: number;
    applicationsByStatus: Record<string, number>;
    recentApplications: CandidateApplication[];
    educations: CandidateEducation[];
    experiences: CandidateExperience[];
    skills: CandidateSkill[];
    resumes: CandidateDocument[];
    recommendedVacancies: CandidateRecommendedVacancy[];
};

export default function CandidateDashboard() {
    const {
        candidate,
        metrics,
        completeness,
        applicationsByStatus,
        recentApplications,
        educations,
        experiences,
        skills,
        resumes,
        recommendedVacancies,
    } = usePage<PageProps>().props;

    return (
        <CandidateHubLayout
            title={`We.lcome back${candidate.full_name ? `, ${candidate.full_name.split(' ')[0]}` : ''}`}
            subtitle={candidate.headline || 'Candidate dashboard'}
            active="dashboard"
            candidate={candidate}
            completeness={completeness}
            breadcrumbs={candidateBreadcrumbs()}
        >
            <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <KpiCard
                    icon={<Briefcase size={20} />}
                    label="Applications"
                    value={metrics.total_applications}
                    sub="Hiring pipeline"
                />
                <KpiCard
                    icon={<FileText size={20} />}
                    label="Documents"
                    value={metrics.resumes_uploaded}
                    sub="Saved files"
                />
                <KpiCard
                    icon={<Eye size={20} />}
                    label="Profile Views"
                    value={metrics.profile_views}
                    sub="Employer traffic"
                />
                <KpiCard
                    icon={<Wrench size={20} />}
                    label="Skills"
                    value={metrics.skills_count}
                    sub="Current stack"
                />
            </div>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
                <div className="space-y-6 xl:col-span-2">
                    <CandidateSectionCard
                        title="Personal Information"
                        icon={<User className="h-4 w-4" />}
                        action={
                            <Link href="/candidate/profile">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={
                                        candidateSecondaryButtonClassName
                                    }
                                >
                                    <Pencil className="mr-2 h-3.5 w-3.5" />
                                    Edit Profile
                                </Button>
                            </Link>
                        }
                    >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <CandidateInfoField
                                label="Full Name"
                                value={candidate.full_name}
                                icon={<User className="h-3.5 w-3.5" />}
                            />
                            <CandidateInfoField
                                label="Email"
                                value={candidate.email}
                                icon={<Mail className="h-3.5 w-3.5" />}
                            />
                            <CandidateInfoField
                                label="Phone"
                                value={candidate.phone}
                                icon={<Phone className="h-3.5 w-3.5" />}
                            />
                            <CandidateInfoField
                                label="Location"
                                value={candidate.location}
                                icon={<MapPin className="h-3.5 w-3.5" />}
                            />
                            <CandidateInfoField
                                label="Gender"
                                value={candidate.gender}
                                icon={<Tangent className="h-3.5 w-3.5" />}
                            />
                            <CandidateInfoField
                                label="Date of Birth"
                                value={candidate.date_of_birth}
                                icon={<Calendar className="h-3.5 w-3.5" />}
                            />
                            <CandidateInfoField
                                label="Experience"
                                value={`${candidate.years_experience ?? 0} years`}
                                icon={
                                    <CalendarRangeIcon className="h-3.5 w-3.5" />
                                }
                            />
                            <CandidateInfoField
                                label="Expected Salary"
                                value={`${candidate.salary_currency ?? 'USD'} ${candidate.expected_salary ?? 'N/A'}`}
                                icon={
                                    <DollarSignIcon className="h-3.5 w-3.5" />
                                }
                            />
                        </div>
                    </CandidateSectionCard>

                    <CandidateSectionCard
                        title="Professional Summary"
                        icon={<Award className="h-4 w-4" />}
                        action={
                            <Link href="/candidate/profile">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={
                                        candidateSecondaryButtonClassName
                                    }
                                >
                                    Edit Summary
                                </Button>
                            </Link>
                        }
                    >
                        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <CandidateInfoField
                                label="Experience"
                                value={`${candidate.years_experience ?? 0} years`}
                                icon={<Briefcase className="h-3.5 w-3.5" />}
                            />
                            <CandidateInfoField
                                label="Education"
                                value={candidate.highest_education
                                    ?.replace(/_/g, ' ')
                                    .replace(/\b\w/g, (letter) =>
                                        letter.toUpperCase(),
                                    )}
                                icon={<GraduationCap className="h-3.5 w-3.5" />}
                            />
                            <CandidateInfoField
                                label="Expected Salary"
                                value={`${candidate.salary_currency ?? 'USD'} ${candidate.expected_salary ?? 'N/A'}`}
                            />
                        </div>
                        {candidate.professional_summary ? (
                            <div className="border-t border-zinc-200 pt-4">
                                <p className="mb-2 text-xs font-medium tracking-widest text-zinc-500 uppercase">
                                    Summary
                                </p>
                                <p className="text-sm leading-relaxed text-zinc-600">
                                    {candidate.professional_summary}
                                </p>
                            </div>
                        ) : (
                            <CandidateEmptyState message="Add your professional summary to improve your profile." />
                        )}
                    </CandidateSectionCard>

                    <CandidateSectionCard
                        title="Work Experience"
                        icon={<Briefcase className="h-4 w-4" />}
                        action={
                            <Link href="/candidate/profile">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={
                                        candidateSecondaryButtonClassName
                                    }
                                >
                                    Add Experience
                                </Button>
                            </Link>
                        }
                    >
                        {experiences.length > 0 ? (
                            <div className="space-y-5">
                                {experiences.map((experience) => (
                                    <div
                                        key={experience.id}
                                        className="border-b border-zinc-100 pb-4 last:border-0 last:pb-0"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">
                                                    {experience.job_title}
                                                </p>
                                                <p className="mt-1 text-xs font-medium tracking-widest text-zinc-500 uppercase">
                                                    {experience.employer_name}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatCandidateDate(
                                                        experience.start_date,
                                                    )}{' '}
                                                    -{' '}
                                                    {experience.currently_working
                                                        ? 'Present'
                                                        : formatCandidateDate(
                                                              experience.end_date,
                                                          )}
                                                </p>
                                                {experience.currently_working ? (
                                                    <span className="mt-2 inline-flex rounded-sm border border-black bg-black px-2 py-0.5 text-[10px] font-bold tracking-widest text-white uppercase">
                                                        Current
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>
                                        {experience.description ? (
                                            <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                                                {experience.description}
                                            </p>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <CandidateEmptyState message="Add your work experience to strengthen your job applications." />
                        )}
                    </CandidateSectionCard>

                    <CandidateSectionCard
                        title="Education"
                        icon={<GraduationCap className="h-4 w-4" />}
                        action={
                            <Link href="/candidate/education">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={
                                        candidateSecondaryButtonClassName
                                    }
                                >
                                    <Plus className="mr-2 h-3.5 w-3.5" />
                                    Add Education
                                </Button>
                            </Link>
                        }
                    >
                        {educations.length > 0 ? (
                            <div className="space-y-4">
                                {educations.map((education) => (
                                    <div
                                        key={education.id}
                                        className="border-b border-zinc-100 pb-4 last:border-0 last:pb-0"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">
                                                    {education.qualification}
                                                </p>
                                                <p className="mt-1 text-xs font-medium tracking-widest text-zinc-500 uppercase">
                                                    {education.institution}
                                                    {education.field_of_study
                                                        ? ` - ${education.field_of_study}`
                                                        : ''}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[11px] font-medium text-zinc-500">
                                                    {formatCandidateDate(
                                                        education.start_date,
                                                    )}{' '}
                                                    -{' '}
                                                    {formatCandidateDate(
                                                        education.end_date,
                                                    )}
                                                </p>
                                                {education.grade ? (
                                                    <p className="mt-1 text-[11px] font-bold text-zinc-600">
                                                        Grade: {education.grade}
                                                    </p>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <CandidateEmptyState message="Add your education history so employers can assess your background." />
                        )}
                    </CandidateSectionCard>

                    <CandidateSectionCard
                        title="Recent Applications"
                        icon={<FileText className="h-4 w-4" />}
                        action={
                            <Link href="/candidate/applications">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={
                                        candidateSecondaryButtonClassName
                                    }
                                >
                                    <Eye className="mr-2 h-3.5 w-3.5" />
                                    View Applications
                                </Button>
                            </Link>
                        }
                    >
                        {recentApplications.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-zinc-200 bg-zinc-50">
                                            <th className="px-4 py-3 text-xs font-medium tracking-widest text-zinc-500 uppercase">
                                                Position
                                            </th>
                                            <th className="px-4 py-3 text-xs font-medium tracking-widest text-zinc-500 uppercase">
                                                Company
                                            </th>
                                            <th className="px-4 py-3 text-xs font-medium tracking-widest text-zinc-500 uppercase">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 text-xs font-medium tracking-widest text-zinc-500 uppercase">
                                                Applied
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100">
                                        {recentApplications.map(
                                            (application) => (
                                                <tr
                                                    key={application.id}
                                                    className="transition-colors hover:bg-zinc-50"
                                                >
                                                    <td className="px-4 py-4">
                                                        <p className="text-sm font-semibold text-foreground">
                                                            {
                                                                application.vacancy_title
                                                            }
                                                        </p>
                                                        {application.location ? (
                                                            <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500">
                                                                <MapPin className="h-3 w-3" />
                                                                {
                                                                    application.location
                                                                }
                                                            </p>
                                                        ) : null}
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-zinc-500">
                                                        {
                                                            application.company_name
                                                        }
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span
                                                            className={`inline-flex rounded-sm border px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase ${candidateStatusColor[application.status] || ''}`}
                                                        >
                                                            {application.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-zinc-500">
                                                        {formatCandidateDate(
                                                            application.applied_at,
                                                        )}
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <CandidateEmptyState message="You have not applied for any jobs yet." />
                        )}
                    </CandidateSectionCard>
                </div>

                <div className="space-y-6">
                    <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
                        {/* Cover band */}
                        <div className="h-20 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-600" />

                        <div className="px-5 pb-5">
                            {/* Avatar overlapping the cover */}
                            <div className="-mt-8 mb-3 flex items-end justify-between">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-card text-xl font-bold ring-4 ring-card">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-lg font-bold text-white dark:bg-zinc-700">
                                        {getInitials(candidate.full_name)}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 pb-1">
                                    {candidate.is_verified ? (
                                        <span className="flex items-center gap-1 rounded-full bg-foreground px-2.5 py-0.5 text-[9px] font-bold tracking-widest text-background uppercase">
                                            <ShieldCheck className="h-3 w-3" />
                                            Verified
                                        </span>
                                    ) : null}
                                    <span className={`rounded-full border px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase ${candidateVisibilityColor[candidate.profile_visibility_status] || 'border-border bg-muted text-muted-foreground'}`}>
                                        {candidate.profile_visibility_status}
                                    </span>
                                </div>
                            </div>

                            {/* Name & headline */}
                            <div className="mb-3 space-y-0.5">
                                <h2 className="truncate text-base font-bold tracking-tight text-foreground">
                                    {candidate.full_name}
                                </h2>
                                <p className="truncate text-[12px] text-muted-foreground">
                                    {candidate.headline || 'No headline set'}
                                </p>
                                {candidate.location && (
                                    <div className="flex items-center gap-1 pt-0.5 text-[11px] text-muted-foreground">
                                        <MapPin className="h-3 w-3 shrink-0" />
                                        <span className="truncate">{candidate.location}</span>
                                    </div>
                                )}
                            </div>

                            {/* Profile completeness */}
                            <div className="mb-4 rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5">
                                <div className="mb-1.5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider">
                                    <span className="text-muted-foreground">Profile strength</span>
                                    <span className="text-foreground">{completeness}%</span>
                                </div>
                                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-foreground transition-all duration-500"
                                        style={{ width: `${completeness}%` }}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-2">
                                <Link href="/candidate/documents" className="block w-full">
                                    <Button className="h-9 w-full gap-2 rounded-lg bg-foreground text-[11px] font-bold tracking-widest text-background uppercase hover:bg-foreground/90">
                                        <Upload className="h-3.5 w-3.5" />
                                        Upload CV
                                    </Button>
                                </Link>
                                <div className="grid grid-cols-2 gap-2">
                                    <Link href="/candidate/profile" className="w-full">
                                        <Button variant="outline" className="h-9 w-full gap-1.5 rounded-lg border-border/70 text-[10px] font-bold tracking-widest text-foreground uppercase hover:bg-muted/50">
                                            <Pencil className="h-3 w-3" />
                                            Edit Profile
                                        </Button>
                                    </Link>
                                    <Link href="/candidate/skills" className="w-full">
                                        <Button variant="outline" className="h-9 w-full gap-1.5 rounded-lg border-border/70 text-[10px] font-bold tracking-widest text-foreground uppercase hover:bg-muted/50">
                                            <Plus className="h-3 w-3" />
                                            Add Skill
                                        </Button>
                                    </Link>
                                </div>
                                <Link href="/candidate/applications" className="block w-full">
                                    <Button variant="ghost" className="h-9 w-full gap-2 rounded-lg border border-dashed border-border/70 text-[10px] font-bold tracking-widest text-muted-foreground uppercase hover:border-foreground hover:bg-transparent hover:text-foreground">
                                        <Eye className="h-3.5 w-3.5" />
                                        View Applications
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <CandidateSectionCard
                        title="Skills"
                        icon={<Wrench className="h-4 w-4" />}
                        action={
                            <Link href="/candidate/skills">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={
                                        candidateSecondaryButtonClassName
                                    }
                                >
                                    <Plus className="mr-2 h-3.5 w-3.5" />
                                    Add Skill
                                </Button>
                            </Link>
                        }
                    >
                        {skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill) => (
                                    <div
                                        key={skill.id}
                                        className={`inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase ${candidateSkillLevelColor[skill.level || 'beginner']}`}
                                    >
                                        {skill.name}
                                        {skill.years_experience != null ? (
                                            <span className="opacity-70">
                                                {skill.years_experience}Y
                                            </span>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <CandidateEmptyState message="Add your key skills so employers can find you faster." />
                        )}
                    </CandidateSectionCard>

                    <CandidateSectionCard
                        title="Documents"
                        icon={<FileText className="h-4 w-4" />}
                        action={
                            <Link href="/candidate/documents">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={
                                        candidateSecondaryButtonClassName
                                    }
                                >
                                    <Upload className="mr-2 h-3.5 w-3.5" />
                                    Upload CV
                                </Button>
                            </Link>
                        }
                    >
                        {resumes.length > 0 ? (
                            <div className="space-y-3">
                                {resumes.map((resume) => (
                                    <div
                                        key={resume.id}
                                        className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/20 p-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">
                                                    {resume.file_name}
                                                </p>
                                                <p className="text-[11px] font-medium text-muted-foreground">
                                                    {formatCandidateDate(
                                                        resume.uploaded_at,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {resume.is_primary ? (
                                                <span className="rounded-md border border-primary/40 bg-primary px-2.5 py-1 text-[10px] font-bold tracking-widest text-primary-foreground uppercase">
                                                    Primary
                                                </span>
                                            ) : null}
                                            <a href={resume.download_url}>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                >
                                                    <Download className="h-3.5 w-3.5" />
                                                </Button>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <CandidateEmptyState message="Upload your CV or resume to start applying for roles." />
                        )}
                    </CandidateSectionCard>

                    <CandidateSectionCard
                        title="Application Pipeline"
                        icon={<Star className="h-4 w-4" />}
                    >
                        <div className="space-y-4">
                            {Object.entries(applicationsByStatus).map(
                                ([status, count]) => (
                                    <div key={status}>
                                        <div className="mb-2 flex items-center justify-between text-xs font-medium tracking-widest uppercase">
                                            <span className="text-zinc-500">
                                                {status}
                                            </span>
                                            <span>{count}</span>
                                        </div>
                                        <div className="h-1 rounded-full bg-zinc-100">
                                            <div
                                                className="h-full bg-black transition-all duration-500"
                                                style={{
                                                    width: `${metrics.total_applications > 0 ? (count / metrics.total_applications) * 100 : 0}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </CandidateSectionCard>

                    <CandidateSectionCard
                        title="Listing Status"
                        icon={<BookOpen className="h-4 w-4" />}
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <CandidateInfoField
                                label="Stage"
                                value={candidate.stage}
                            />
                            <CandidateInfoField
                                label="Status"
                                value={candidate.status}
                            />
                            <CandidateInfoField
                                label="Activated"
                                value={formatCandidateDate(
                                    candidate.listing_activated_at,
                                )}
                            />
                            <CandidateInfoField
                                label="Expires"
                                value={formatCandidateDate(
                                    candidate.listing_expires_at,
                                )}
                            />
                        </div>
                    </CandidateSectionCard>
                </div>
            </div>

            {recommendedVacancies.length > 0 ? (
                <div className="mt-10">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-base font-semibold tracking-tight text-foreground">
                            Recommended Opportunities
                        </h2>
                        <Link href="/candidate/jobs">
                            <Button
                                variant="outline"
                                size="sm"
                                className={candidateSecondaryButtonClassName}
                            >
                                Browse Jobs
                                <Search className="ml-2 h-3.5 w-3.5" />
                            </Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {recommendedVacancies.map((job) => (
                            <div
                                key={job.id}
                                className="rounded-lg border border-border/70 bg-background/95 p-6 shadow-sm transition-colors hover:border-border hover:bg-muted/10"
                            >
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-xs font-bold text-muted-foreground">
                                        {job.company_name
                                            .substring(0, 2)
                                            .toUpperCase()}
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        {job.match ? (
                                            <span className="rounded-md border border-primary/40 bg-primary px-2.5 py-1 text-[9px] font-bold tracking-widest text-primary-foreground uppercase">
                                                {job.match.score}%{' '}
                                                {job.match.label}
                                            </span>
                                        ) : null}
                                        {job.salary_max ? (
                                            <span className="rounded-md border border-border bg-muted px-2.5 py-1 text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
                                                {job.currency ?? 'USD'}{' '}
                                                {Number(
                                                    job.salary_max,
                                                ).toLocaleString()}
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                                <p className="text-sm font-semibold text-foreground">
                                    {job.title}
                                </p>
                                <p className="mt-1 text-[11px] font-medium text-muted-foreground">
                                    {job.company_name} -{' '}
                                    {job.location || 'Remote'}
                                </p>
                                {job.match ? (
                                    <div className="mt-4 rounded-lg border border-border/70 bg-muted/20 p-3">
                                        <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
                                            Why this fits
                                        </p>
                                        <ul className="mt-2 space-y-1">
                                            {job.match.reasons
                                                .slice(0, 2)
                                                .map((reason) => (
                                                    <li
                                                        key={reason}
                                                        className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground"
                                                    >
                                                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                                        <span>{reason}</span>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                ) : null}
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="rounded-md border border-border bg-muted px-2.5 py-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        {job.employment_type || 'Full-time'}
                                    </span>
                                    <Link href="/candidate/jobs">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-auto p-0 text-[10px] font-bold tracking-widest text-muted-foreground uppercase hover:text-foreground"
                                        >
                                            {job.has_applied
                                                ? 'Applied'
                                                : 'Apply'}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
        </CandidateHubLayout>
    );
}

function KpiCard({
    icon,
    label,
    value,
    sub,
}: {
    icon: ReactNode;
    label: string;
    value: string | number;
    sub: string;
}) {
    return (
        <CandidateMetricCard
            icon={icon}
            label={label}
            value={value}
            helper={sub}
        />
    );
}
