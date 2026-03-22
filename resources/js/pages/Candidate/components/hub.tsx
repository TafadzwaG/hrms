import { Head, Link, router } from '@inertiajs/react';
import {
    Briefcase,
    FileText,
    GraduationCap,
    Home,
    LayoutDashboard,
    LogOut,
    Menu,
    Search,
    Settings,
    ShieldCheck,
    User,
    Wrench,
    X,
    Zap,
} from 'lucide-react';
import { type ReactNode, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CandidateUser } from '../dummyData';

export const candidateStatusColor: Record<string, string> = {
    submitted: 'bg-blue-50 text-blue-700 border-blue-200',
    shortlisted: 'bg-amber-50 text-amber-700 border-amber-200',
    interview: 'bg-purple-50 text-purple-700 border-purple-200',
    offered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    hired: 'bg-green-50 text-green-700 border-green-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
    withdrawn: 'bg-slate-50 text-slate-500 border-slate-200',
    under_review: 'bg-sky-50 text-sky-700 border-sky-200',
};

export const candidateVisibilityColor: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    draft: 'bg-slate-50 text-slate-500 border-slate-200',
    expired: 'bg-red-50 text-red-600 border-red-200',
    pending_payment: 'bg-amber-50 text-amber-700 border-amber-200',
};

export const candidateSkillLevelColor: Record<string, string> = {
    beginner: 'bg-slate-100 text-slate-600',
    intermediate: 'bg-blue-50 text-blue-700',
    advanced: 'bg-purple-50 text-purple-700',
    expert: 'bg-emerald-50 text-emerald-700',
};

type CandidateHubLayoutProps = {
    title: string;
    subtitle?: string;
    active:
        | 'dashboard'
        | 'applications'
        | 'jobs'
        | 'profile'
        | 'documents'
        | 'education'
        | 'skills'
        | 'settings';
    candidate: CandidateUser;
    completeness?: number;
    children: ReactNode;
    headerActions?: ReactNode;
};

const candidateLinks = {
    dashboard: '/candidate/dashboard',
    applications: '/candidate/applications',
    jobs: '/candidate/jobs',
    profile: '/candidate/profile',
    documents: '/candidate/documents',
    education: '/candidate/education',
    skills: '/candidate/skills',
    settings: '/candidate/settings',
};

export function CandidateHubLayout({
    title,
    subtitle,
    active,
    candidate,
    completeness,
    children,
    headerActions,
}: CandidateHubLayoutProps) {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const handleLogout = () => router.post('/logout');
    const closeMobileNav = () => setMobileNavOpen(false);

    return (
        <div className="flex h-screen overflow-hidden bg-secondary/30">
            <Head title={`${title} - Candidate Hub`} />

            <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
                <div className="border-b border-border p-5">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <Zap className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-foreground">HRX Hub</span>
                    </Link>
                </div>

                <CandidateSidebarContent
                    active={active}
                    candidate={candidate}
                    onNavigate={undefined}
                    onLogout={handleLogout}
                />
            </aside>

            {mobileNavOpen ? (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
                        onClick={closeMobileNav}
                        aria-label="Close navigation"
                    />

                    <aside className="relative flex h-full w-80 max-w-[85vw] flex-col border-r border-border bg-card shadow-2xl">
                        <div className="flex items-center justify-between border-b border-border p-5">
                            <Link href="/" className="flex items-center gap-2.5" onClick={closeMobileNav}>
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                    <Zap className="h-4 w-4 text-primary-foreground" />
                                </div>
                                <span className="text-lg font-bold tracking-tight text-foreground">HRX Hub</span>
                            </Link>

                            <Button type="button" variant="ghost" size="icon" onClick={closeMobileNav}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <CandidateSidebarContent
                            active={active}
                            candidate={candidate}
                            onNavigate={closeMobileNav}
                            onLogout={handleLogout}
                        />
                    </aside>
                </div>
            ) : null}

            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 sm:px-6 lg:px-8">
                    <div className="min-w-0">
                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                                onClick={() => setMobileNavOpen(true)}
                                aria-label="Open navigation"
                            >
                                <Menu className="h-4 w-4" />
                            </Button>

                            <div className="min-w-0">
                                <div className="flex items-center gap-3">
                                    <h1 className="truncate text-xl font-bold text-foreground">{title}</h1>
                                    {candidate.is_verified ? (
                                        <Badge
                                            variant="outline"
                                            className="hidden border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700 sm:inline-flex"
                                        >
                                            <ShieldCheck className="mr-1 h-3 w-3" />
                                            Verified
                                        </Badge>
                                    ) : null}
                                </div>
                                {subtitle ? <p className="truncate text-xs text-muted-foreground">{subtitle}</p> : null}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {completeness !== undefined ? (
                            <div className="hidden items-center gap-2 sm:flex">
                                <span className="text-xs text-muted-foreground">Profile</span>
                                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
                                    <div
                                        className={`h-full rounded-full ${
                                            completeness >= 80 ? 'bg-emerald-500' : completeness >= 50 ? 'bg-amber-500' : 'bg-red-500'
                                        }`}
                                        style={{ width: `${completeness}%` }}
                                    />
                                </div>
                                <span className="font-mono text-xs font-semibold text-foreground">{completeness}%</span>
                            </div>
                        ) : null}

                        <Badge
                            variant="outline"
                            className={`hidden text-xs capitalize sm:inline-flex ${candidateVisibilityColor[candidate.profile_visibility_status] || ''}`}
                        >
                            {candidate.profile_visibility_status}
                        </Badge>
                        {headerActions}
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}

function CandidateSidebarContent({
    active,
    candidate,
    onNavigate,
    onLogout,
}: {
    active: CandidateHubLayoutProps['active'];
    candidate: CandidateUser;
    onNavigate?: (() => void) | undefined;
    onLogout: () => void;
}) {
    return (
        <>
            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">Candidate Hub</p>
                <CandidateSidebarLink href={candidateLinks.dashboard} icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" active={active === 'dashboard'} onNavigate={onNavigate} />
                <CandidateSidebarLink href={candidateLinks.applications} icon={<Briefcase className="h-4 w-4" />} label="My Applications" active={active === 'applications'} onNavigate={onNavigate} />
                <CandidateSidebarLink href={candidateLinks.jobs} icon={<Search className="h-4 w-4" />} label="Browse Jobs" active={active === 'jobs'} onNavigate={onNavigate} />
                <CandidateSidebarLink href={candidateLinks.profile} icon={<User className="h-4 w-4" />} label="My Profile" active={active === 'profile'} onNavigate={onNavigate} />
                <CandidateSidebarLink href={candidateLinks.documents} icon={<FileText className="h-4 w-4" />} label="Documents" active={active === 'documents'} onNavigate={onNavigate} />

                <p className="mb-2 mt-6 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">Career</p>
                <CandidateSidebarLink href={candidateLinks.education} icon={<GraduationCap className="h-4 w-4" />} label="Education" active={active === 'education'} onNavigate={onNavigate} />
                <CandidateSidebarLink href={candidateLinks.skills} icon={<Wrench className="h-4 w-4" />} label="Skills" active={active === 'skills'} onNavigate={onNavigate} />
                <CandidateSidebarLink href={candidateLinks.settings} icon={<Settings className="h-4 w-4" />} label="Settings" active={active === 'settings'} onNavigate={onNavigate} />

                <div className="mt-6 border-t border-border pt-4">
                    <CandidateSidebarLink href="/" icon={<Home className="h-4 w-4" />} label="Back to Home" onNavigate={onNavigate} />
                </div>
            </nav>

            <div className="border-t border-border p-4">
                <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {getInitials(candidate.full_name)}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{candidate.full_name}</p>
                        <p className="truncate text-xs text-muted-foreground">{candidate.email}</p>
                    </div>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-muted-foreground hover:text-destructive"
                    onClick={onLogout}
                >
                    <LogOut className="mr-2 h-3.5 w-3.5" />
                    Sign Out
                </Button>
            </div>
        </>
    );
}

function CandidateSidebarLink({
    href,
    icon,
    label,
    active = false,
    onNavigate,
}: {
    href: string;
    icon: ReactNode;
    label: string;
    active?: boolean;
    onNavigate?: (() => void) | undefined;
}) {
    return (
        <Link
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
        >
            {icon}
            {label}
        </Link>
    );
}

export function CandidateSectionCard({
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
                    {icon ? <span className="text-primary">{icon}</span> : null}
                    <CardTitle className="text-base font-bold">{title}</CardTitle>
                </div>
                {action}
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

export function CandidateInfoField({
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
            <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
            <div className="flex items-center gap-2">
                {icon ? <span className="text-muted-foreground">{icon}</span> : null}
                <span className="text-sm text-foreground">{value ?? <span className="italic text-muted-foreground">Not provided</span>}</span>
            </div>
        </div>
    );
}

export function CandidateEmptyState({ message }: { message: string }) {
    return (
        <div className="py-8 text-center">
            <Briefcase className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">{message}</p>
        </div>
    );
}

export function formatCandidateDate(date: string | null | undefined): string {
    if (!date) {
        return 'N/A';
    }

    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
        day: date.length > 7 ? 'numeric' : undefined,
    });
}

export function getInitials(name?: string | null): string {
    if (!name) {
        return 'G';
    }

    return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
}
