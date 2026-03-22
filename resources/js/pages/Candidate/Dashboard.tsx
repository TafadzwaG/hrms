import { Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import {
    ArrowRight,
    Award,
    BookOpen,
    Briefcase,
    Calendar,
    Download,
    Eye,
    FileText,
    GraduationCap,
    Mail,
    MapPin,
    Phone,
    Search,
    ShieldCheck,
    Star,
    Upload,
    User,
    Wrench,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <KpiCard icon={<Briefcase className="h-5 w-5" />} label="Applications" value={metrics.total_applications} color="bg-blue-50 text-blue-600" />
                <KpiCard icon={<FileText className="h-5 w-5" />} label="Documents" value={metrics.resumes_uploaded} color="bg-purple-50 text-purple-600" />
                <KpiCard icon={<Eye className="h-5 w-5" />} label="Profile Views" value={metrics.profile_views} color="bg-amber-50 text-amber-600" />
                <KpiCard icon={<Wrench className="h-5 w-5" />} label="Skills" value={metrics.skills_count} color="bg-emerald-50 text-emerald-600" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-6">
                    <CandidateSectionCard
                        title="Personal Information"
                        icon={<User className="h-4 w-4" />}
                        action={
                            <Link href="/candidate/profile">
                                <Button variant="outline" size="sm" className="text-xs">
                                    Edit Profile
                                </Button>
                            </Link>
                        }
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <CandidateInfoField label="Full Name" value={candidate.full_name} />
                            <CandidateInfoField label="Email" value={candidate.email} icon={<Mail className="h-3.5 w-3.5" />} />
                            <CandidateInfoField label="Phone" value={candidate.phone} icon={<Phone className="h-3.5 w-3.5" />} />
                            <CandidateInfoField label="Location" value={candidate.location} icon={<MapPin className="h-3.5 w-3.5" />} />
                            <CandidateInfoField label="Gender" value={candidate.gender} />
                            <CandidateInfoField label="Date of Birth" value={candidate.date_of_birth} icon={<Calendar className="h-3.5 w-3.5" />} />
                            <CandidateInfoField label="Experience" value={`${candidate.years_experience ?? 0} years`} />
                            <CandidateInfoField label="Expected Salary" value={`${candidate.salary_currency ?? 'USD'} ${candidate.expected_salary ?? '—'}`} />
                        </div>
                    </CandidateSectionCard>

                    <CandidateSectionCard
                        title="Professional Summary"
                        icon={<Award className="h-4 w-4" />}
                        action={
                            <Link href="/candidate/profile">
                                <Button variant="outline" size="sm" className="text-xs">
                                    Edit Summary
                                </Button>
                            </Link>
                        }
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                            <CandidateInfoField label="Experience" value={`${candidate.years_experience ?? 0} years`} icon={<Briefcase className="h-3.5 w-3.5" />} />
                            <CandidateInfoField
                                label="Education"
                                value={candidate.highest_education?.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())}
                                icon={<GraduationCap className="h-3.5 w-3.5" />}
                            />
                            <CandidateInfoField label="Expected Salary" value={`${candidate.salary_currency ?? 'USD'} ${candidate.expected_salary ?? '—'}`} />
                        </div>
                        {candidate.professional_summary ? (
                            <div className="pt-4 border-t border-border">
                                <p className="text-xs font-medium text-muted-foreground mb-1">Summary</p>
                                <p className="text-sm text-foreground leading-relaxed">{candidate.professional_summary}</p>
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
                                <Button variant="outline" size="sm" className="text-xs">
                                    Add Experience
                                </Button>
                            </Link>
                        }
                    >
                        {experiences.length > 0 ? (
                            <div className="space-y-5">
                                {experiences.map((experience) => (
                                    <div key={experience.id} className="border-b border-border/50 last:border-0 pb-4 last:pb-0">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">{experience.job_title}</p>
                                                <p className="text-xs text-muted-foreground">{experience.employer_name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatCandidateDate(experience.start_date)} — {experience.currently_working ? 'Present' : formatCandidateDate(experience.end_date)}
                                                </p>
                                                {experience.currently_working && (
                                                    <Badge variant="outline" className="text-[10px] mt-1 bg-emerald-50 text-emerald-700 border-emerald-200">
                                                        Current
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        {experience.description && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{experience.description}</p>}
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
                                <Button variant="outline" size="sm" className="text-xs">
                                    Add Education
                                </Button>
                            </Link>
                        }
                    >
                        {educations.length > 0 ? (
                            <div className="space-y-4">
                                {educations.map((education) => (
                                    <div key={education.id} className="border-b border-border/50 last:border-0 pb-4 last:pb-0">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">{education.qualification}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {education.institution}
                                                    {education.field_of_study ? ` — ${education.field_of_study}` : ''}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground">
                                                    {formatCandidateDate(education.start_date)} — {formatCandidateDate(education.end_date)}
                                                </p>
                                                {education.grade && <p className="text-xs font-medium text-foreground/70 mt-0.5">Grade: {education.grade}</p>}
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
                                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                                    View Applications
                                </Button>
                            </Link>
                        }
                    >
                        {recentApplications.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                                            <th className="text-left p-3">Position</th>
                                            <th className="text-left p-3">Company</th>
                                            <th className="text-left p-3">Status</th>
                                            <th className="text-left p-3">Applied</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentApplications.map((application) => (
                                            <tr key={application.id} className="border-b border-border/50 last:border-0 hover:bg-accent/40 transition-colors">
                                                <td className="p-3">
                                                    <p className="text-sm font-semibold text-foreground">{application.vacancy_title}</p>
                                                    {application.location && (
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                            <MapPin className="h-3 w-3" />
                                                            {application.location}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="p-3 text-sm text-muted-foreground">{application.company_name}</td>
                                                <td className="p-3">
                                                    <Badge variant="outline" className={`text-xs capitalize ${candidateStatusColor[application.status] || ''}`}>
                                                        {application.status}
                                                    </Badge>
                                                </td>
                                                <td className="p-3 text-sm text-muted-foreground">{formatCandidateDate(application.applied_at)}</td>
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
                    <div className="surface-elevated rounded-xl p-6 text-center">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary mx-auto mb-3">
                            {getInitials(candidate.full_name)}
                        </div>
                        <p className="text-base font-bold text-foreground">{candidate.full_name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{candidate.headline || 'No headline set'}</p>
                        {candidate.location && (
                            <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
                                <MapPin className="h-3 w-3" /> {candidate.location}
                            </p>
                        )}
                        <div className="flex items-center justify-center gap-2 mt-3">
                            {candidate.is_verified && (
                                <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                                    <ShieldCheck className="h-3 w-3 mr-1" /> Verified
                                </Badge>
                            )}
                            <Badge variant="outline" className={`text-[10px] capitalize ${candidateVisibilityColor[candidate.profile_visibility_status] || ''}`}>
                                {candidate.profile_visibility_status}
                            </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-5">
                            <Link href="/candidate/profile">
                                <Button variant="outline" size="sm" className="w-full text-xs">
                                    Edit Profile <ArrowRight className="h-3 w-3 ml-1" />
                                </Button>
                            </Link>
                            <Link href="/candidate/documents">
                                <Button size="sm" className="w-full text-xs bg-primary text-primary-foreground">
                                    Upload CV <Upload className="h-3 w-3 ml-1" />
                                </Button>
                            </Link>
                            <Link href="/candidate/skills">
                                <Button variant="outline" size="sm" className="w-full text-xs">
                                    Add Skill
                                </Button>
                            </Link>
                            <Link href="/candidate/applications">
                                <Button variant="outline" size="sm" className="w-full text-xs">
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
                                <Button variant="outline" size="sm" className="text-xs">
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
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${candidateSkillLevelColor[skill.level || 'beginner']}`}
                                    >
                                        {skill.name}
                                        {skill.years_experience != null && <span className="text-[10px] opacity-70">{skill.years_experience}y</span>}
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
                                <Button variant="outline" size="sm" className="text-xs">
                                    Upload CV
                                </Button>
                            </Link>
                        }
                    >
                        {resumes.length > 0 ? (
                            <div className="space-y-3">
                                {resumes.map((resume) => (
                                    <div key={resume.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium text-foreground">{resume.file_name}</p>
                                                <p className="text-xs text-muted-foreground">{formatCandidateDate(resume.uploaded_at)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {resume.is_primary && <Badge className="bg-primary/10 text-primary border-0 text-[10px]">Primary</Badge>}
                                            <a href={resume.download_url}>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
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
                        <div className="space-y-3">
                            {Object.entries(applicationsByStatus).map(([status, count]) => (
                                <div key={status} className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground capitalize">{status}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full"
                                                style={{ width: `${metrics.total_applications > 0 ? (count / metrics.total_applications) * 100 : 0}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-mono font-semibold text-foreground w-6 text-right">{count}</span>
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

            {recommendedVacancies.length > 0 && (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-foreground">Recommended Opportunities</h2>
                        <Link href="/candidate/jobs">
                            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                                Browse Jobs <Search className="h-3.5 w-3.5 ml-1" />
                            </Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {recommendedVacancies.map((job) => (
                            <div key={job.id} className="surface-elevated rounded-xl p-5 hover:shadow-lg transition-shadow duration-300 h-full">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                        {job.company_name.substring(0, 2).toUpperCase()}
                                    </div>
                                    {job.salary_max && (
                                        <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                            {job.currency ?? 'USD'} {Number(job.salary_max).toLocaleString()}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm font-semibold text-foreground">{job.title}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {job.company_name} — {job.location || 'Remote'}
                                </p>
                                <div className="flex items-center justify-between mt-3">
                                    <Badge variant="outline" className="text-[10px]">
                                        {job.employment_type || 'Full-time'}
                                    </Badge>
                                    <Link href="/candidate/jobs">
                                        <Button variant="ghost" size="sm" className="text-xs h-7 text-primary">
                                            {job.has_applied ? 'Applied' : 'Apply'}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </CandidateHubLayout>
    );
}

function KpiCard({
    icon,
    label,
    value,
    color,
}: {
    icon: ReactNode;
    label: string;
    value: string | number;
    color: string;
}) {
    return (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm group hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-4">
                <div className={`h-11 w-11 rounded-lg flex items-center justify-center ${color}`}>{icon}</div>
                <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <span className="text-2xl font-bold tracking-tight text-foreground">{value}</span>
                </div>
            </div>
        </div>
    );
}
