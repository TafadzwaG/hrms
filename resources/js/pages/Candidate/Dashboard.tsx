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
    CandidateEmptyState,
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
            title={`Welcome back${candidate.full_name ? `, ${candidate.full_name.split(' ')[0]}` : ''}`}
            subtitle={candidate.headline || 'Candidate dashboard'}
            active="dashboard"
            candidate={candidate}
            completeness={completeness}
        >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
                <KpiCard icon={<Briefcase size={20} />} label="Applications" value={metrics.total_applications} sub="Hiring pipeline" />
                <KpiCard icon={<FileText size={20} />} label="Documents" value={metrics.resumes_uploaded} sub="Saved files" />
                <KpiCard icon={<Eye size={20} />} label="Profile Views" value={metrics.profile_views} sub="Employer traffic" />
                <KpiCard icon={<Wrench size={20} />} label="Skills" value={metrics.skills_count} sub="Current stack" />
            </div>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
                <div className="space-y-6 xl:col-span-2">
                    <CandidateSectionCard
                        title="Personal Information"
                        icon={<User className="h-4 w-4" />}
                        action={
                            <Link href="/candidate/profile">
                            <Button variant="outline" size="sm" className={candidateSecondaryButtonClassName}>
                                <Pencil className="mr-2 h-3.5 w-3.5" />
                                Edit Profile
                            </Button>
                        </Link>
                        }
                    >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <CandidateInfoField label="Full Name" value={candidate.full_name} icon={<User className="h-3.5 w-3.5" />} />
                            <CandidateInfoField label="Email" value={candidate.email} icon={<Mail className="h-3.5 w-3.5" />} />
                            <CandidateInfoField label="Phone" value={candidate.phone} icon={<Phone className="h-3.5 w-3.5" />} />
                            <CandidateInfoField label="Location" value={candidate.location} icon={<MapPin className="h-3.5 w-3.5" />} />
                            <CandidateInfoField label="Gender" value={candidate.gender} icon={<Tangent className="h-3.5 w-3.5" />}/>
                            <CandidateInfoField label="Date of Birth" value={candidate.date_of_birth} icon={<Calendar className="h-3.5 w-3.5" />} />
                            <CandidateInfoField label="Experience" value={`${candidate.years_experience ?? 0} years`} icon={<CalendarRangeIcon className="h-3.5 w-3.5" />} />
                            <CandidateInfoField label="Expected Salary" value={`${candidate.salary_currency ?? 'USD'} ${candidate.expected_salary ?? 'N/A'}`} icon={<DollarSignIcon className="h-3.5 w-3.5" />}/>
                        </div>
                    </CandidateSectionCard>

                    <CandidateSectionCard
                        title="Professional Summary"
                        icon={<Award className="h-4 w-4" />}
                        action={
                            <Link href="/candidate/profile">
                                <Button variant="outline" size="sm" className={candidateSecondaryButtonClassName}>
                                    Edit Summary
                                </Button>
                            </Link>
                        }
                    >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
                            <CandidateInfoField label="Experience" value={`${candidate.years_experience ?? 0} years`} icon={<Briefcase className="h-3.5 w-3.5" />} />
                            <CandidateInfoField
                                label="Education"
                                value={candidate.highest_education?.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())}
                                icon={<GraduationCap className="h-3.5 w-3.5" />}
                            />
                            <CandidateInfoField label="Expected Salary" value={`${candidate.salary_currency ?? 'USD'} ${candidate.expected_salary ?? 'N/A'}`} />
                        </div>
                        {candidate.professional_summary ? (
                            <div className="border-t border-zinc-200 pt-4">
                                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-zinc-500">Summary</p>
                                <p className="text-sm leading-relaxed text-zinc-600">{candidate.professional_summary}</p>
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
                                <Button variant="outline" size="sm" className={candidateSecondaryButtonClassName}>
                                    Add Experience
                                </Button>
                            </Link>
                        }
                    >
                        {experiences.length > 0 ? (
                            <div className="space-y-5">
                                {experiences.map((experience) => (
                                    <div key={experience.id} className="border-b border-zinc-100 pb-4 last:border-0 last:pb-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-bold text-black">{experience.job_title}</p>
                                                <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-zinc-400">{experience.employer_name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatCandidateDate(experience.start_date)} - {experience.currently_working ? 'Present' : formatCandidateDate(experience.end_date)}
                                                </p>
                                                {experience.currently_working ? (
                                                    <span className="mt-2 inline-flex rounded-sm border border-black bg-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                                                        Current
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>
                                        {experience.description ? <p className="mt-3 text-sm leading-relaxed text-zinc-600">{experience.description}</p> : null}
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
                                <Button variant="outline" size="sm" className={candidateSecondaryButtonClassName}>
                                <Plus className="mr-2 h-3.5 w-3.5" />
                                    Add Education
                                </Button>
                            </Link>
                        }
                    >
                        {educations.length > 0 ? (
                            <div className="space-y-4">
                                {educations.map((education) => (
                                    <div key={education.id} className="border-b border-zinc-100 pb-4 last:border-0 last:pb-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-bold text-black">{education.qualification}</p>
                                                <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                                                    {education.institution}
                                                    {education.field_of_study ? ` - ${education.field_of_study}` : ''}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[11px] font-medium text-zinc-500">
                                                    {formatCandidateDate(education.start_date)} - {formatCandidateDate(education.end_date)}
                                                </p>
                                                {education.grade ? <p className="mt-1 text-[11px] font-bold text-zinc-600">Grade: {education.grade}</p> : null}
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
                                <Button variant="outline" size="sm" className={candidateSecondaryButtonClassName}>
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
                                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Position</th>
                                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Company</th>
                                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Status</th>
                                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Applied</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100">
                                        {recentApplications.map((application) => (
                                            <tr key={application.id} className="transition-colors hover:bg-zinc-50">
                                                <td className="px-4 py-4">
                                                    <p className="text-sm font-bold text-black">{application.vacancy_title}</p>
                                                    {application.location ? (
                                                        <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500">
                                                            <MapPin className="h-3 w-3" />
                                                            {application.location}
                                                        </p>
                                                    ) : null}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-zinc-500">{application.company_name}</td>
                                                <td className="px-4 py-4">
                                                    <span className={`inline-flex rounded-sm border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${candidateStatusColor[application.status] || ''}`}>
                                                        {application.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-zinc-500">{formatCandidateDate(application.applied_at)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <CandidateEmptyState message="You have not applied for any jobs yet." />
                        )}
                    </CandidateSectionCard>
                </div>

                <div className="space-y-6">
                    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-black text-lg font-bold text-white">
                                {getInitials(candidate.full_name)}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h2 className="truncate text-lg font-bold text-black">{candidate.full_name}</h2>
                                <p className="truncate text-xs font-medium text-zinc-500">{candidate.headline || 'No headline set'}</p>
                                {candidate.location ? (
                                    <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-zinc-400">
                                        <MapPin className="h-3 w-3" />
                                        {candidate.location}
                                    </p>
                                ) : null}
                            </div>
                        </div>

                        <div className="mb-6 flex flex-wrap gap-2">
                            {candidate.is_verified ? (
                                <span className="flex items-center gap-1 rounded bg-black px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-white">
                                    <ShieldCheck className="h-3 w-3" />
                                    Verified
                                </span>
                            ) : null}
                            <span className={`rounded border px-2 py-1 text-[9px] font-bold uppercase tracking-widest ${candidateVisibilityColor[candidate.profile_visibility_status] || 'border-zinc-200 bg-zinc-100 text-zinc-500'}`}>
                                {candidate.profile_visibility_status}
                            </span>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-zinc-100 pt-6">
                            <Link href="/candidate/documents" className="w-full">
                                <Button className="w-full bg-black text-white hover:bg-zinc-800 h-10 text-xs font-bold uppercase tracking-widest rounded-md transition-all flex items-center justify-center gap-2">
                                    <Upload className="h-4 w-4" />
                                    Upload CV
                                </Button>
                            </Link>
                            <div className="grid grid-cols-2 gap-3">
                                <Link href="/candidate/profile" className="w-full">
                                    <Button variant="outline" className="w-full border-zinc-200 hover:bg-zinc-50 text-black h-9 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all">
                                    <Pencil className="mr-2 h-3.5 w-3.5" />
                                        Edit Profile
                                    </Button>
                                </Link>
                                <Link href="/candidate/skills" className="w-full">
                                    <Button variant="outline" className="w-full border-zinc-200 hover:bg-zinc-50 text-black h-9 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all">
                                    <Plus className="mr-2 h-3.5 w-3.5" />
                                        Add Skill
                                    </Button>
                                </Link>
                            </div>
                            <Link href="/candidate/applications" className="w-full mt-2">
                                <Button variant="ghost" className="w-full border border-dashed border-zinc-200 text-zinc-500 hover:border-black hover:text-black h-10 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all">
                                <Eye className="mr-2 h-3.5 w-3.5" />
                                    View Applications
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <CandidateSectionCard
                        title="Skills"
                        icon={<Wrench className="h-4 w-4" />}
                        action={
                            <Link href="/candidate/skills">
                                <Button variant="outline" size="sm" className={candidateSecondaryButtonClassName}>
                                <Plus className="mr-2 h-3.5 w-3.5" />
                                    Add Skill
                                </Button>
                            </Link>
                        }
                    >
                        {skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill) => (
                                    <div key={skill.id} className={`inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${candidateSkillLevelColor[skill.level || 'beginner']}`}>
                                        {skill.name}
                                        {skill.years_experience != null ? <span className="opacity-70">{skill.years_experience}Y</span> : null}
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
                                <Button variant="outline" size="sm" className={candidateSecondaryButtonClassName}>
                                <Upload className="mr-2 h-3.5 w-3.5" />
                                    Upload CV
                                </Button>
                            </Link>
                        }
                    >
                        {resumes.length > 0 ? (
                            <div className="space-y-3">
                                {resumes.map((resume) => (
                                    <div key={resume.id} className="flex items-center justify-between rounded-sm border border-zinc-200 bg-white p-4">
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-4 w-4 text-zinc-400" />
                                            <div>
                                                <p className="text-sm font-bold text-black">{resume.file_name}</p>
                                                <p className="text-[11px] font-medium text-zinc-500">{formatCandidateDate(resume.uploaded_at)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {resume.is_primary ? (
                                                <span className="rounded-sm border border-black bg-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">Primary</span>
                                            ) : null}
                                            <a href={resume.download_url}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-black">
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

                    <CandidateSectionCard title="Application Pipeline" icon={<Star className="h-4 w-4" />}>
                        <div className="space-y-4">
                            {Object.entries(applicationsByStatus).map(([status, count]) => (
                                <div key={status}>
                                    <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
                                        <span className="text-zinc-500">{status}</span>
                                        <span>{count}</span>
                                    </div>
                                    <div className="h-1 rounded-full bg-zinc-100">
                                        <div
                                            className="h-full bg-black transition-all duration-500"
                                            style={{ width: `${metrics.total_applications > 0 ? (count / metrics.total_applications) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CandidateSectionCard>

                    <CandidateSectionCard title="Listing Status" icon={<BookOpen className="h-4 w-4" />}>
                        <div className="grid grid-cols-2 gap-4">
                            <CandidateInfoField label="Stage" value={candidate.stage} />
                            <CandidateInfoField label="Status" value={candidate.status} />
                            <CandidateInfoField label="Activated" value={formatCandidateDate(candidate.listing_activated_at)} />
                            <CandidateInfoField label="Expires" value={formatCandidateDate(candidate.listing_expires_at)} />
                        </div>
                    </CandidateSectionCard>
                </div>
            </div>

            {recommendedVacancies.length > 0 ? (
                <div className="mt-10">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-bold tracking-tight text-black">Recommended Opportunities</h2>
                        <Link href="/candidate/jobs">
                            <Button variant="outline" size="sm" className={candidateSecondaryButtonClassName}>
                                Browse Jobs
                                <Search className="ml-2 h-3.5 w-3.5" />
                            </Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {recommendedVacancies.map((job) => (
                            <div key={job.id} className="border border-zinc-200/50 bg-white p-6 transition-all duration-300 hover:bg-zinc-50">
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex h-10 w-10 items-center justify-center bg-zinc-100 text-xs font-bold text-zinc-600">
                                        {job.company_name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        {job.match ? (
                                            <span className="rounded-sm border border-black bg-black px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white">
                                                {job.match.score}% {job.match.label}
                                            </span>
                                        ) : null}
                                        {job.salary_max ? (
                                            <span className="bg-zinc-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                                                {job.currency ?? 'USD'} {Number(job.salary_max).toLocaleString()}
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-black">{job.title}</p>
                                <p className="mt-1 text-[11px] font-medium text-zinc-500">
                                    {job.company_name} - {job.location || 'Remote'}
                                </p>
                                {job.match ? (
                                    <div className="mt-4 rounded-sm border border-zinc-200 bg-zinc-50 p-3">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Why this fits</p>
                                        <ul className="mt-2 space-y-1">
                                            {job.match.reasons.slice(0, 2).map((reason) => (
                                                <li key={reason} className="flex items-start gap-2 text-[11px] leading-relaxed text-zinc-600">
                                                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                                                    <span>{reason}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : null}
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="rounded-sm border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                                        {job.employment_type || 'Full-time'}
                                    </span>
                                    <Link href="/candidate/jobs">
                                        <Button variant="ghost" size="sm" className="h-auto p-0 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-black">
                                            {job.has_applied ? 'Applied' : 'Apply'}
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
        <div className="group flex flex-col justify-between border border-zinc-200/50 bg-white p-6 transition-all duration-300 hover:bg-zinc-50">
            <div className="mb-4 flex items-start justify-between">
                <span className="text-zinc-400 transition-colors group-hover:text-black">{icon}</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">{sub}</span>
            </div>
            <div>
                <p className="text-3xl font-bold tracking-tighter text-black">{value}</p>
                <p className="text-sm font-medium text-zinc-500">{label}</p>
            </div>
        </div>
    );
}
