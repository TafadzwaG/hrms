import type { ReactNode } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
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
    Home,
    LayoutDashboard,
    LogOut,
    Mail,
    MapPin,
    Phone,
    Search,
    Settings,
    ShieldCheck,
    Star,
    Upload,
    User,
    Wrench,
    Zap,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
    candidateUser,
    candidateMetrics,
    candidateCompleteness,
    candidateApplicationsByStatus,
    candidateRecentApplications,
    candidateEducations,
    candidateExperiences,
    candidateSkills,
    candidateResumes,
    candidateRecommendedVacancies,
} from './dummyData';

// --- Helpers ---

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
};

const skillLevelColor: Record<string, string> = {
    beginner: 'bg-slate-100 text-slate-600',
    intermediate: 'bg-blue-50 text-blue-700',
    advanced: 'bg-purple-50 text-purple-700',
    expert: 'bg-emerald-50 text-emerald-700',
};

function formatDate(date: string | null): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function getInitials(name?: string | null): string {
    if (!name) return 'G';
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2);
}

// --- Sub-components ---

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
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                active ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
        >
            {icon}
            {label}
        </Link>
    );
}

function KPICard({
    icon,
    label,
    value,
    color,
    delay = 0,
}: {
    icon: ReactNode;
    label: string;
    value: string | number;
    color: string;
    delay?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-xl border border-border bg-card p-5 shadow-sm group hover:shadow-lg transition-shadow duration-300"
        >
            <div className="flex items-center gap-4">
                <div className={`h-11 w-11 rounded-lg flex items-center justify-center ${color}`}>{icon}</div>
                <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <span className="text-2xl font-bold tracking-tight text-foreground">{value}</span>
                </div>
            </div>
        </motion.div>
    );
}

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
        <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-2">
                    {icon && <span className="text-primary">{icon}</span>}
                    <CardTitle className="text-base font-bold">{title}</CardTitle>
                </div>
                {action}
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
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
            <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
            <div className="flex items-center gap-2">
                {icon && <span className="text-muted-foreground">{icon}</span>}
                <span className="text-sm text-foreground">{value ?? <span className="text-muted-foreground italic">Not provided</span>}</span>
            </div>
        </div>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="text-center py-8">
            <Briefcase className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">{message}</p>
        </div>
    );
}

// --- Main Component ---

export default function CandidateDashboard() {
    const candidate = candidateUser;
    const metrics = candidateMetrics;
    const completeness = candidateCompleteness;

    const handleLogout = () => router.post('/logout');

    return (
        <div className="flex h-screen bg-secondary/30 overflow-hidden">
            <Head title="Candidate Dashboard - Providence HRMS" />

            {/* ===== SIDEBAR ===== */}
            <motion.aside
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-64 bg-card border-r border-border flex flex-col shrink-0 hidden lg:flex"
            >
                <div className="p-5 border-b border-border">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                            <Zap className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-foreground">HRX Hub</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2 px-3">Candidate Hub</p>
                    <SidebarLink href="/candidate/dashboard" icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" active />
                    <SidebarLink href="/candidate/dashboard" icon={<Briefcase className="h-4 w-4" />} label="My Applications" />
                    <SidebarLink href="/search" icon={<Search className="h-4 w-4" />} label="Browse Jobs" />
                    <SidebarLink href="/candidate/dashboard" icon={<User className="h-4 w-4" />} label="My Profile" />
                    <SidebarLink href="/candidate/dashboard" icon={<FileText className="h-4 w-4" />} label="Documents" />

                    <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2 mt-6 px-3">Career</p>
                    <SidebarLink href="/candidate/dashboard" icon={<GraduationCap className="h-4 w-4" />} label="Education" />
                    <SidebarLink href="/candidate/dashboard" icon={<Wrench className="h-4 w-4" />} label="Skills" />
                    <SidebarLink href="/candidate/dashboard" icon={<Settings className="h-4 w-4" />} label="Settings" />

                    <div className="mt-6 pt-4 border-t border-border">
                        <SidebarLink href="/" icon={<Home className="h-4 w-4" />} label="Back to Home" />
                    </div>
                </nav>

                <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                            {getInitials(candidate.full_name)}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{candidate.full_name}</p>
                            <p className="text-xs text-muted-foreground truncate">{candidate.email}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-muted-foreground hover:text-destructive"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-3.5 w-3.5 mr-2" /> Sign Out
                    </Button>
                </div>
            </motion.aside>

            {/* ===== MAIN ===== */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 lg:px-8 shrink-0">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-foreground">
                                Welcome back{candidate.full_name ? `, ${candidate.full_name.split(' ')[0]}` : ''}
                            </h1>
                            {candidate.is_verified && (
                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                                    <ShieldCheck className="h-3 w-3 mr-1" /> Verified
                                </Badge>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">{candidate.headline}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Profile</span>
                            <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${
                                        completeness >= 80 ? 'bg-emerald-500' : completeness >= 50 ? 'bg-amber-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${completeness}%` }}
                                />
                            </div>
                            <span className="text-xs font-mono font-semibold text-foreground">{completeness}%</span>
                        </div>
                        <Badge variant="outline" className={`text-xs capitalize ${visibilityColor[candidate.profile_visibility_status] || ''}`}>
                            {candidate.profile_visibility_status}
                        </Badge>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <KPICard
                            icon={<Briefcase className="h-5 w-5" />}
                            label="Applications"
                            value={metrics.total_applications}
                            color="bg-blue-50 text-blue-600"
                            delay={0}
                        />
                        <KPICard
                            icon={<FileText className="h-5 w-5" />}
                            label="Documents"
                            value={metrics.resumes_uploaded}
                            color="bg-purple-50 text-purple-600"
                            delay={0.05}
                        />
                        <KPICard
                            icon={<Eye className="h-5 w-5" />}
                            label="Profile Views"
                            value={metrics.profile_views}
                            color="bg-amber-50 text-amber-600"
                            delay={0.1}
                        />
                        <KPICard
                            icon={<Wrench className="h-5 w-5" />}
                            label="Skills"
                            value={metrics.skills_count}
                            color="bg-emerald-50 text-emerald-600"
                            delay={0.15}
                        />
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        <div className="xl:col-span-2 space-y-6">
                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                                <SectionCard title="Personal Information" icon={<User className="h-4 w-4" />}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InfoField label="Full Name" value={candidate.full_name} />
                                        <InfoField label="Email" value={candidate.email} icon={<Mail className="h-3.5 w-3.5" />} />
                                        <InfoField label="Phone" value={candidate.phone} icon={<Phone className="h-3.5 w-3.5" />} />
                                        <InfoField label="Location" value={candidate.location} icon={<MapPin className="h-3.5 w-3.5" />} />
                                        <InfoField label="Gender" value={candidate.gender} />
                                        <InfoField label="Date of Birth" value={candidate.date_of_birth} icon={<Calendar className="h-3.5 w-3.5" />} />
                                        <InfoField label="Experience" value={`${candidate.years_experience} years`} />
                                        <InfoField label="Expected Salary" value={`${candidate.salary_currency} ${candidate.expected_salary}`} />
                                    </div>
                                </SectionCard>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
                                <SectionCard title="Professional Summary" icon={<Award className="h-4 w-4" />}>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                        <InfoField
                                            label="Experience"
                                            value={`${candidate.years_experience} years`}
                                            icon={<Briefcase className="h-3.5 w-3.5" />}
                                        />
                                        <InfoField
                                            label="Education"
                                            value={candidate.highest_education?.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                            icon={<GraduationCap className="h-3.5 w-3.5" />}
                                        />
                                        <InfoField label="Expected Salary" value={`${candidate.salary_currency} ${candidate.expected_salary}`} />
                                    </div>
                                    {candidate.professional_summary && (
                                        <div className="pt-4 border-t border-border">
                                            <p className="text-xs font-medium text-muted-foreground mb-1">Summary</p>
                                            <p className="text-sm text-foreground leading-relaxed">{candidate.professional_summary}</p>
                                        </div>
                                    )}
                                </SectionCard>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                                <SectionCard title="Work Experience" icon={<Briefcase className="h-4 w-4" />}>
                                    <div className="space-y-5">
                                        {candidateExperiences.map((exp) => (
                                            <div key={exp.id} className="border-b border-border/50 last:border-0 pb-4 last:pb-0">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="text-sm font-semibold text-foreground">{exp.job_title}</p>
                                                        <p className="text-xs text-muted-foreground">{exp.employer_name}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {formatDate(exp.start_date)} — {exp.currently_working ? 'Present' : formatDate(exp.end_date)}
                                                        </p>
                                                        {exp.currently_working && (
                                                            <Badge variant="outline" className="text-[10px] mt-1 bg-emerald-50 text-emerald-700 border-emerald-200">
                                                                Current
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                {exp.description && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{exp.description}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </SectionCard>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}>
                                <SectionCard title="Education" icon={<GraduationCap className="h-4 w-4" />}>
                                    <div className="space-y-4">
                                        {candidateEducations.map((edu) => (
                                            <div key={edu.id} className="border-b border-border/50 last:border-0 pb-4 last:pb-0">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="text-sm font-semibold text-foreground">{edu.qualification}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {edu.institution}
                                                            {edu.field_of_study ? ` — ${edu.field_of_study}` : ''}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-muted-foreground">
                                                            {formatDate(edu.start_date)} — {formatDate(edu.end_date)}
                                                        </p>
                                                        {edu.grade && <p className="text-xs font-medium text-foreground/70 mt-0.5">Grade: {edu.grade}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </SectionCard>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                                <SectionCard
                                    title="Recent Applications"
                                    icon={<FileText className="h-4 w-4" />}
                                    action={
                                        <Link href="/candidate/dashboard">
                                            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                                                View All
                                            </Button>
                                        </Link>
                                    }
                                >
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
                                                {candidateRecentApplications.map((app) => (
                                                    <tr key={app.id} className="border-b border-border/50 last:border-0 hover:bg-accent/40 transition-colors">
                                                        <td className="p-3">
                                                            <p className="text-sm font-semibold text-foreground">{app.vacancy_title}</p>
                                                            {app.location && (
                                                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                                    <MapPin className="h-3 w-3" />
                                                                    {app.location}
                                                                </p>
                                                            )}
                                                        </td>
                                                        <td className="p-3 text-sm text-muted-foreground">{app.company_name}</td>
                                                        <td className="p-3">
                                                            <Badge variant="outline" className={`text-xs capitalize ${statusColor[app.status] || ''}`}>
                                                                {app.status}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-3 text-sm text-muted-foreground">{formatDate(app.applied_at)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </SectionCard>
                            </motion.div>
                        </div>

                        <div className="space-y-6">
                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
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
                                        <Badge variant="outline" className={`text-[10px] capitalize ${visibilityColor[candidate.profile_visibility_status] || ''}`}>
                                            {candidate.profile_visibility_status}
                                        </Badge>
                                    </div>
                                    <div className="flex gap-2 mt-5">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 text-xs"
                                            onClick={() => router.visit('/candidate/dashboard')}
                                        >
                                            Edit Profile <ArrowRight className="h-3 w-3 ml-1" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="flex-1 text-xs bg-primary text-primary-foreground"
                                            onClick={() => router.visit('/candidate/dashboard')}
                                        >
                                            Upload CV <Upload className="h-3 w-3 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
                                <SectionCard title="Skills" icon={<Wrench className="h-4 w-4" />}>
                                    <div className="flex flex-wrap gap-2">
                                        {candidateSkills.map((skill) => (
                                            <div
                                                key={skill.id}
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${skillLevelColor[skill.level || 'beginner']}`}
                                            >
                                                {skill.name}
                                                {skill.years_experience != null && <span className="text-[10px] opacity-70">{skill.years_experience}y</span>}
                                            </div>
                                        ))}
                                    </div>
                                </SectionCard>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                                <SectionCard title="Documents" icon={<FileText className="h-4 w-4" />}>
                                    <div className="space-y-3">
                                        {candidateResumes.map((r) => (
                                            <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-sm font-medium text-foreground">{r.file_name}</p>
                                                        <p className="text-xs text-muted-foreground">{formatDate(r.uploaded_at)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {r.is_primary && <Badge className="bg-primary/10 text-primary border-0 text-[10px]">Primary</Badge>}
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                                                        <Download className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </SectionCard>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}>
                                <SectionCard title="Application Pipeline" icon={<Star className="h-4 w-4" />}>
                                    <div className="space-y-3">
                                        {Object.entries(candidateApplicationsByStatus).map(([status, count]) => (
                                            <div key={status} className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground capitalize">{status}</span>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary rounded-full"
                                                            style={{ width: `${(count / candidateMetrics.total_applications) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-mono font-semibold text-foreground w-6 text-right">{count}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </SectionCard>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                                <SectionCard title="Listing Status" icon={<BookOpen className="h-4 w-4" />}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <InfoField label="Stage" value={candidate.stage} />
                                        <InfoField label="Status" value={candidate.status} />
                                        <InfoField label="Activated" value={formatDate(candidate.listing_activated_at)} />
                                        <InfoField label="Expires" value={formatDate(candidate.listing_expires_at)} />
                                    </div>
                                </SectionCard>
                            </motion.div>
                        </div>
                    </div>

                    {candidateRecommendedVacancies.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.45 }}
                            className="mt-8"
                        >
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-lg font-bold text-foreground">Recommended Opportunities</h2>
                                <Link href="/search">
                                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                                        View All <ArrowRight className="h-3.5 w-3.5 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {candidateRecommendedVacancies.map((job) => (
                                    <Link key={job.id} href={`/jobs/${job.id}`}>
                                        <div className="surface-elevated rounded-xl p-5 hover:shadow-lg transition-shadow duration-300 h-full">
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
                                                {job.company_name} • {job.location || 'Remote'}
                                            </p>
                                            <div className="flex items-center justify-between mt-3">
                                                <Badge variant="outline" className="text-[10px]">
                                                    {job.employment_type || 'Full-time'}
                                                </Badge>
                                                <Button variant="ghost" size="sm" className="text-xs h-7 text-primary">
                                                    Apply
                                                </Button>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    );
}