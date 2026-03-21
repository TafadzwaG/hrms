import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card as UiCard, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link, router } from '@inertiajs/react';
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
    LayoutDashboard,
    LogOut,
    Mail,
    MapPin,
    Phone,
    Plus,
    Search,
    Settings,
    ShieldCheck,
    Star,
    Upload,
    User,
    Wrench,
} from 'lucide-react';

// ---------- Types ----------

type Candidate = {
    id: number;
    full_name: string;
    email: string | null;
    phone: string | null;
    alt_phone: string | null;
    national_id: string | null;
    gender: string | null;
    date_of_birth: string | null;
    location: string | null;
    headline: string | null;
    professional_summary: string | null;
    expected_salary: string | null;
    salary_currency: string | null;
    years_experience: number | null;
    highest_education: string | null;
    profile_visibility_status: string;
    is_public: boolean;
    is_verified: boolean;
    listing_activated_at: string | null;
    listing_expires_at: string | null;
    stage: string;
    status: string;
    created_at: string | null;
};

type Metrics = {
    total_applications: number;
    resumes_uploaded: number;
    profile_views: number;
    listing_status: string;
};

type RecentApplication = {
    id: number;
    vacancy_title: string;
    company_name: string;
    location: string | null;
    employment_type: string | null;
    status: string;
    applied_at: string;
};

type Education = {
    id: number;
    institution: string;
    qualification: string;
    field_of_study: string | null;
    start_date: string | null;
    end_date: string | null;
    grade: string | null;
};

type Experience = {
    id: number;
    employer_name: string;
    job_title: string;
    start_date: string | null;
    end_date: string | null;
    currently_working: boolean;
    description: string | null;
};

type Skill = {
    id: number;
    name: string;
    level: string | null;
    years_experience: number | null;
};

type Resume = {
    id: number;
    file_name: string;
    is_primary: boolean;
    uploaded_at: string;
};

type RecommendedVacancy = {
    id: number;
    title: string;
    company_name: string;
    location: string | null;
    employment_type: string | null;
    salary_min: string | null;
    salary_max: string | null;
    currency: string | null;
};

type Props = {
    candidate: Candidate | null;
    metrics: Metrics;
    completeness: number;
    applicationsByStatus: Record<string, number>;
    recentApplications: RecentApplication[];
    educations: Education[];
    experiences: Experience[];
    skills: Skill[];
    resumes: Resume[];
    recommendedVacancies: RecommendedVacancy[];
};

// ---------- Helpers ----------

const statusColor: Record<string, string> = {
    submitted: 'bg-blue-50 text-blue-700 border-blue-200',
    shortlisted: 'bg-amber-50 text-amber-700 border-amber-200',
    interview: 'bg-purple-50 text-purple-700 border-purple-200',
    offered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    hired: 'bg-green-50 text-green-700 border-green-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
    withdrawn: 'bg-slate-50 text-slate-500 border-slate-200',
};

const visibilityColor: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    draft: 'bg-slate-50 text-slate-500 border-slate-200',
    expired: 'bg-red-50 text-red-600 border-red-200',
    hidden: 'bg-slate-100 text-slate-500 border-slate-200',
    pending_payment: 'bg-amber-50 text-amber-700 border-amber-200',
    suspended: 'bg-red-50 text-red-700 border-red-200',
};

const skillLevelColor: Record<string, string> = {
    beginner: 'bg-slate-100 text-slate-600',
    intermediate: 'bg-blue-50 text-blue-700',
    advanced: 'bg-purple-50 text-purple-700',
    expert: 'bg-emerald-50 text-emerald-700',
};

function formatEducationLevel(level: string | null): string {
    if (!level) return 'N/A';
    return level.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

function formatDate(date: string | null): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function formatDateFull(date: string | null): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getInitials(name?: string | null): string {
    if (!name) return 'G';
    return (
        name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2) || 'G'
    );
}

// ---------- Component ----------

export default function Dashboard({
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
}: Props) {
    const handleLogout = () => router.post('/logout');

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-950">
            <Head title="Candidate Dashboard - Providence HRMS" />

            {/* ===== SIDEBAR ===== */}
            <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-slate-200 bg-white lg:block">
                <div className="flex h-full flex-col p-6">
                    {/* Brand */}
                    <div className="mb-10 flex items-center gap-2.5 px-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-black tracking-tighter uppercase">
                            Providence <span className="text-xs text-slate-400">HRX</span>
                        </span>
                    </div>

                    {/* Nav Links */}
                    <nav className="space-y-1">
                        <p className="mb-4 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Candidate Hub
                        </p>
                        <SidebarLink href="/candidate/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" active />
                        <SidebarLink href="/candidate/dashboard" icon={<Briefcase size={18} />} label="My Applications" />
                        <SidebarLink href="/" icon={<Search size={18} />} label="Browse Jobs" />
                        <SidebarLink href="/candidate/dashboard" icon={<User size={18} />} label="My Profile" />
                        <SidebarLink href="/candidate/dashboard" icon={<FileText size={18} />} label="Documents" />
                        <SidebarLink href="/candidate/dashboard" icon={<GraduationCap size={18} />} label="Education" />
                        <SidebarLink href="/candidate/dashboard" icon={<Wrench size={18} />} label="Skills" />
                        <SidebarLink href="/candidate/dashboard" icon={<Settings size={18} />} label="Settings" />
                    </nav>

                    <div className="mt-6">
                        <SidebarLink href="/" icon={<ArrowRight size={18} className="rotate-180" />} label="Back to Home" />
                    </div>

                    {/* Bottom User Profile */}
                    <div className="mt-auto border-t border-slate-100 pt-6">
                        <div className="flex items-center gap-3 px-2">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-black text-white">
                                {getInitials(candidate?.full_name)}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-slate-900">{candidate?.full_name ?? 'Guest'}</p>
                                <p className="truncate text-xs text-slate-400">{candidate?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="mt-4 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                            <LogOut size={14} /> Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* ===== MAIN CONTENT ===== */}
            <main className="flex-1 lg:pl-64">
                {/* Mobile Header */}
                <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded bg-slate-900 text-white">
                            <ShieldCheck className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-black uppercase">Providence</span>
                    </div>
                    <button onClick={handleLogout} className="text-xs font-bold text-slate-400">
                        Logout
                    </button>
                </div>

                <div className="w-full p-6 lg:p-10">
                    {/* Header */}
                    <header className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-slate-900 lg:text-3xl">
                                Welcome back{candidate?.full_name ? `, ${candidate.full_name.split(' ')[0]}` : ''}
                            </h1>
                            <p className="mt-1 text-sm font-medium text-slate-500">
                                {candidate?.headline ?? 'Manage your profile, applications, and career journey.'}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-48">
                                <div className="mb-1.5 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    <span>Profile</span>
                                    <span>{completeness}%</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            completeness >= 80 ? 'bg-emerald-500' : completeness >= 50 ? 'bg-amber-500' : 'bg-red-500'
                                        }`}
                                        style={{ width: `${completeness}%` }}
                                    />
                                </div>
                            </div>
                            {candidate && (
                                <Badge className={`border text-[10px] font-black uppercase ${visibilityColor[candidate.profile_visibility_status] ?? visibilityColor.draft}`}>
                                    {candidate.profile_visibility_status}
                                </Badge>
                            )}
                        </div>
                    </header>

                    {/* KPI Cards */}
                    <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <KPICard icon={<Briefcase size={20} />} label="Applications" value={metrics.total_applications} color="bg-blue-50 text-blue-600" />
                        <KPICard icon={<FileText size={20} />} label="Documents" value={metrics.resumes_uploaded} color="bg-purple-50 text-purple-600" />
                        <KPICard icon={<Eye size={20} />} label="Profile Views" value={metrics.profile_views} color="bg-amber-50 text-amber-600" />
                        <KPICard icon={<GraduationCap size={20} />} label="Skills" value={skills.length} color="bg-emerald-50 text-emerald-600" />
                    </section>

                    <div className="grid gap-8 xl:grid-cols-3">
                        {/* Left Column (2/3) */}
                        <div className="space-y-8 xl:col-span-2">
                            {/* Personal Information */}
                            <SectionCard title="Personal Information" icon={<User size={16} />}>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <InfoField label="Full Name" value={candidate?.full_name} />
                                    <InfoField label="Email" value={candidate?.email} icon={<Mail size={13} />} />
                                    <InfoField label="Phone" value={candidate?.phone} icon={<Phone size={13} />} />
                                    <InfoField label="Alt Phone" value={candidate?.alt_phone} />
                                    <InfoField label="Gender" value={candidate?.gender ? candidate.gender.charAt(0).toUpperCase() + candidate.gender.slice(1) : null} />
                                    <InfoField label="Date of Birth" value={formatDateFull(candidate?.date_of_birth ?? null)} />
                                    <InfoField label="National ID" value={candidate?.national_id} />
                                    <InfoField label="Location" value={candidate?.location} icon={<MapPin size={13} />} />
                                    <InfoField label="Member Since" value={formatDateFull(candidate?.created_at ?? null)} icon={<Calendar size={13} />} />
                                </div>
                            </SectionCard>

                            {/* Professional Summary */}
                            <SectionCard title="Professional Summary" icon={<BookOpen size={16} />}>
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <InfoField label="Headline" value={candidate?.headline} />
                                    <InfoField label="Years of Experience" value={candidate?.years_experience != null ? `${candidate.years_experience} years` : null} />
                                    <InfoField label="Highest Education" value={formatEducationLevel(candidate?.highest_education ?? null)} />
                                </div>

                                {candidate?.professional_summary && (
                                    <div className="mt-4 rounded-lg bg-slate-50 p-4">
                                        <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Summary</p>
                                        <p className="text-sm leading-relaxed text-slate-700">{candidate.professional_summary}</p>
                                    </div>
                                )}

                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    <InfoField
                                        label="Expected Salary"
                                        value={
                                            candidate?.expected_salary
                                                ? `${candidate.salary_currency ?? 'USD'} ${Number(candidate.expected_salary).toLocaleString()}`
                                                : null
                                        }
                                    />
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verified</span>
                                        {candidate?.is_verified ? (
                                            <Badge className="border-emerald-200 bg-emerald-50 text-[10px] font-bold text-emerald-700">Verified</Badge>
                                        ) : (
                                            <Badge className="border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500">Not Verified</Badge>
                                        )}
                                    </div>
                                </div>
                            </SectionCard>

                            {/* Work Experience */}
                            <SectionCard title={`Work Experience (${experiences.length})`} icon={<Briefcase size={16} />}>
                                {experiences.length === 0 ? (
                                    <EmptyState message="No work experience added yet" />
                                ) : (
                                    <div className="space-y-4">
                                        {experiences.map((exp) => (
                                            <div key={exp.id} className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="text-sm font-bold text-slate-900">{exp.job_title}</h4>
                                                        <p className="text-xs font-medium text-slate-500">{exp.employer_name}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs font-medium text-slate-400">
                                                            {formatDate(exp.start_date)} — {exp.currently_working ? 'Present' : formatDate(exp.end_date)}
                                                        </p>
                                                        {exp.currently_working && (
                                                            <Badge className="mt-1 border-emerald-200 bg-emerald-50 text-[9px] font-bold text-emerald-700">Current</Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                {exp.description && <p className="mt-2 text-xs leading-relaxed text-slate-600">{exp.description}</p>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </SectionCard>

                            {/* Education */}
                            <SectionCard title={`Education (${educations.length})`} icon={<GraduationCap size={16} />}>
                                {educations.length === 0 ? (
                                    <EmptyState message="No education records added yet" />
                                ) : (
                                    <div className="space-y-4">
                                        {educations.map((edu) => (
                                            <div key={edu.id} className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="text-sm font-bold text-slate-900">{edu.qualification}</h4>
                                                        <p className="text-xs font-medium text-slate-500">
                                                            {edu.institution}
                                                            {edu.field_of_study ? ` — ${edu.field_of_study}` : ''}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs font-medium text-slate-400">
                                                            {formatDate(edu.start_date)} — {formatDate(edu.end_date)}
                                                        </p>
                                                        {edu.grade && <p className="mt-1 text-[10px] font-bold text-slate-500">Grade: {edu.grade}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </SectionCard>

                            {/* Recent Applications */}
                            <SectionCard
                                title="Recent Applications"
                                icon={<Briefcase size={16} />}
                                action={
                                    recentApplications.length > 0 ? (
                                        <Link href="/candidate/dashboard" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900">
                                            View All
                                        </Link>
                                    ) : undefined
                                }
                            >
                                {recentApplications.length === 0 ? (
                                    <EmptyState message="No applications yet. Browse jobs to get started!" />
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    <th className="px-4 py-3 font-black">Position</th>
                                                    <th className="px-4 py-3 font-black">Company</th>
                                                    <th className="px-4 py-3 font-black">Status</th>
                                                    <th className="px-4 py-3 font-black">Applied</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {recentApplications.map((app) => (
                                                    <tr key={app.id} className="transition-colors hover:bg-slate-50/50">
                                                        <td className="px-4 py-3">
                                                            <p className="text-sm font-bold text-slate-900">{app.vacancy_title}</p>
                                                            {app.location && <p className="text-[11px] text-slate-400">{app.location}</p>}
                                                        </td>
                                                        <td className="px-4 py-3 text-xs font-medium text-slate-500">{app.company_name}</td>
                                                        <td className="px-4 py-3">
                                                            <Badge className={`border text-[10px] font-bold uppercase ${statusColor[app.status] ?? 'border-slate-200 bg-slate-50 text-slate-500'}`}>
                                                                {app.status}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-4 py-3 text-xs font-medium text-slate-400">{formatDate(app.applied_at)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </SectionCard>
                        </div>

                        {/* Right Column (1/3) */}
                        <div className="space-y-6">
                            {/* Profile Card */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 text-2xl font-black text-white">
                                    {getInitials(candidate?.full_name)}
                                </div>
                                <h3 className="text-base font-black text-slate-900">{candidate?.full_name}</h3>
                                <p className="text-xs font-medium text-slate-500">{candidate?.headline || 'No headline set'}</p>

                                {candidate?.location && (
                                    <p className="mt-1 flex items-center justify-center gap-1 text-xs text-slate-400">
                                        <MapPin size={12} /> {candidate.location}
                                    </p>
                                )}

                                <div className="mt-4 flex justify-center gap-2">
                                    {candidate?.is_verified && (
                                        <Badge className="border-emerald-200 bg-emerald-50 text-[10px] font-bold text-emerald-700">
                                            <ShieldCheck size={10} className="mr-1" /> Verified
                                        </Badge>
                                    )}
                                    <Badge className={`border text-[10px] font-bold ${visibilityColor[candidate?.profile_visibility_status ?? 'draft']}`}>
                                        {candidate?.profile_visibility_status ?? 'draft'}
                                    </Badge>
                                </div>

                                <div className="mt-6 space-y-2">
                                    <Button variant="outline" className="w-full justify-between rounded-lg border-slate-200 text-xs font-bold uppercase tracking-widest">
                                        Edit Profile <ArrowRight size={14} />
                                    </Button>
                                    <Button className="w-full justify-between rounded-lg bg-slate-900 text-xs font-bold uppercase tracking-widest text-white">
                                        Upload CV <Upload size={14} />
                                    </Button>
                                </div>
                            </div>

                            {/* Skills */}
                            <SectionCard title={`Skills (${skills.length})`} icon={<Wrench size={16} />}>
                                {skills.length === 0 ? (
                                    <EmptyState message="No skills added yet" small />
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill) => (
                                            <div
                                                key={skill.id}
                                                className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${skillLevelColor[skill.level ?? ''] ?? 'bg-slate-50 text-slate-600'}`}
                                            >
                                                {skill.name}
                                                {skill.level && (
                                                    <span className="ml-1 text-[10px] font-medium opacity-70">
                                                        ({skill.level})
                                                    </span>
                                                )}
                                                {skill.years_experience != null && (
                                                    <span className="ml-1 text-[10px] font-medium opacity-70">
                                                        {skill.years_experience}y
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </SectionCard>

                            {/* Resumes / Documents */}
                            <SectionCard title={`Documents (${resumes.length})`} icon={<FileText size={16} />}>
                                {resumes.length === 0 ? (
                                    <EmptyState message="No CVs uploaded yet" small />
                                ) : (
                                    <div className="space-y-2">
                                        {resumes.map((r) => (
                                            <div key={r.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2.5">
                                                <div className="min-w-0 flex items-center gap-2">
                                                    <FileText size={14} className="shrink-0 text-slate-400" />
                                                    <div className="min-w-0">
                                                        <p className="truncate text-xs font-bold text-slate-700">{r.file_name}</p>
                                                        <p className="text-[10px] text-slate-400">{formatDate(r.uploaded_at)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex shrink-0 items-center gap-2">
                                                    {r.is_primary && (
                                                        <Badge className="border-emerald-200 bg-emerald-50 text-[9px] font-bold text-emerald-700">Primary</Badge>
                                                    )}
                                                    <Download size={14} className="cursor-pointer text-slate-400 hover:text-slate-700" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </SectionCard>

                            {/* Application Stats */}
                            {Object.keys(applicationsByStatus).length > 0 && (
                                <SectionCard title="Application Breakdown" icon={<Award size={16} />}>
                                    <div className="space-y-2">
                                        {Object.entries(applicationsByStatus).map(([status, count]) => (
                                            <div key={status} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                                                <Badge className={`border text-[10px] font-bold uppercase ${statusColor[status] ?? 'border-slate-200 bg-slate-50 text-slate-500'}`}>
                                                    {status}
                                                </Badge>
                                                <span className="text-sm font-black text-slate-900">{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </SectionCard>
                            )}

                            {/* Listing Info */}
                            {candidate && (
                                <SectionCard title="Listing Details" icon={<Star size={16} />}>
                                    <div className="space-y-3">
                                        <InfoField label="Visibility" value={candidate.profile_visibility_status} />
                                        <InfoField label="Public Listing" value={candidate.is_public ? 'Yes' : 'No'} />
                                        <InfoField label="Listing Activated" value={formatDateFull(candidate.listing_activated_at)} />
                                        <InfoField label="Listing Expires" value={formatDateFull(candidate.listing_expires_at)} />
                                    </div>
                                </SectionCard>
                            )}
                        </div>
                    </div>

                    {/* Recommended Jobs */}
                    {recommendedVacancies.length > 0 && (
                        <section className="mt-10">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Recommended Opportunities</h2>
                                <Link href="/candidate/dashboard" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900">
                                    View All <ArrowRight size={12} className="ml-1 inline" />
                                </Link>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {recommendedVacancies.map((job) => (
                                    <div key={job.id} className="group rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-slate-900 hover:shadow-md">
                                        <div className="mb-3 flex items-start justify-between">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-400 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                                                {job.company_name.substring(0, 2).toUpperCase()}
                                            </div>
                                            {job.salary_max && (
                                                <Badge variant="outline" className="border-slate-100 text-[10px] font-bold text-slate-400">
                                                    {job.currency ?? 'USD'} {Number(job.salary_max).toLocaleString()}
                                                </Badge>
                                            )}
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-900">{job.title}</h3>
                                        <p className="text-xs font-medium text-slate-500">
                                            {job.company_name} • {job.location || 'Remote'}
                                        </p>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                {job.employment_type || 'Full-time'}
                                            </span>
                                            <Button size="sm" className="h-7 rounded-lg bg-slate-900 px-4 text-[10px] font-bold uppercase tracking-widest text-white">
                                                Apply
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
}

// ---------- Sub-Components ----------

function SectionCard({
    title,
    icon,
    action,
    children,
}: {
    title: string;
    icon?: ReactNode;
    action?: ReactNode;
    children: ReactNode;
}) {
    return (
        <UiCard className="overflow-hidden rounded-2xl border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 px-5 py-4 space-y-0">
                <div className="flex items-center gap-2">
                    {icon && <span className="text-slate-400">{icon}</span>}
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-900">{title}</CardTitle>
                </div>
                {action}
            </CardHeader>
            <CardContent className="p-5">{children}</CardContent>
        </UiCard>
    );
}

function KPICard({
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
        <UiCard className="rounded-2xl border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>{icon}</div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
                    <span className="text-2xl font-black tracking-tight text-slate-900">{value}</span>
                </div>
            </div>
        </UiCard>
    );
}

function InfoField({
    label,
    value,
    icon,
}: {
    label: string;
    value: ReactNode | null | undefined;
    icon?: ReactNode;
}) {
    return (
        <div>
            <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
            <div className="flex items-center gap-1.5">
                {icon && <span className="text-slate-400">{icon}</span>}
                <p className="text-sm font-medium text-slate-700">
                    {value ?? <span className="italic text-slate-300">Not provided</span>}
                </p>
            </div>
        </div>
    );
}

function EmptyState({ message, small = false }: { message: string; small?: boolean }) {
    return (
        <div className={`flex flex-col items-center justify-center rounded-lg bg-slate-50 ${small ? 'py-6' : 'py-10'}`}>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                <Plus size={18} className="text-slate-400" />
            </div>
            <p className="text-xs font-medium text-slate-400">{message}</p>
        </div>
    );
}

function SidebarLink({
    href,
    icon,
    label,
    active = false,
}: {
    href: string;
    icon: ReactNode;
    label: string;
    active?: boolean;
}) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold transition-all ${
                active ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
        >
            {icon}
            {label}
        </Link>
    );
}