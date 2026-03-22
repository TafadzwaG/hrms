import { Head, Link, router } from '@inertiajs/react';
import {
    Bell,
    Briefcase,
    FileText,
    GraduationCap,
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

import { Button } from '@/components/ui/button';
import type { CandidateUser } from '../dummyData';

export const candidateStatusColor: Record<string, string> = {
    submitted: 'bg-zinc-100 text-zinc-600 border-zinc-200',
    shortlisted: 'bg-zinc-200 text-black border-zinc-300',
    interview: 'bg-zinc-800 text-white border-black',
    offered: 'bg-zinc-900 text-white border-black',
    hired: 'bg-black text-white border-black',
    rejected: 'bg-white text-zinc-400 border-zinc-200',
    withdrawn: 'bg-white text-zinc-400 border-zinc-200',
    under_review: 'bg-zinc-100 text-zinc-600 border-zinc-200',
};

export const candidateVisibilityColor: Record<string, string> = {
    active: 'bg-black text-white border-black',
    draft: 'bg-zinc-100 text-zinc-500 border-zinc-200',
    expired: 'bg-zinc-100 text-zinc-400 border-zinc-200',
    pending_payment: 'bg-zinc-200 text-zinc-700 border-zinc-300',
};

export const candidateSkillLevelColor: Record<string, string> = {
    beginner: 'bg-zinc-50 text-zinc-500',
    intermediate: 'bg-zinc-100 text-zinc-600',
    advanced: 'bg-zinc-200 text-zinc-800',
    expert: 'bg-black text-white',
};

type CandidateHubLayoutProps = {
    title: string;
    subtitle?: string;
    active: 'dashboard' | 'applications' | 'jobs' | 'profile' | 'documents' | 'education' | 'skills' | 'settings';
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
        <div className="flex h-screen overflow-hidden bg-[#f9f9f9] font-['Inter'] antialiased text-zinc-950">
            <Head title={`${title} - Candidate Hub`} />

            <aside className="hidden w-64 shrink-0 flex-col border-r border-zinc-200 bg-zinc-50 lg:flex z-50">
                <div className="px-6 py-8">
                    <Link href="/" className="flex items-center gap-2">
                        <Zap className="h-6 w-6 text-black" fill="currentColor" />
                        <span className="text-xl font-black uppercase tracking-tighter text-black">HRX Hub</span>
                    </Link>
                </div>

                <CandidateSidebarContent active={active} candidate={candidate} onLogout={handleLogout} />
            </aside>

            {mobileNavOpen ? (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={closeMobileNav}
                        aria-label="Close navigation"
                    />

                    <aside className="relative flex h-full w-72 flex-col border-r border-zinc-200 bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-zinc-100 p-6">
                            <Link href="/" className="flex items-center gap-2" onClick={closeMobileNav}>
                                <Zap className="h-5 w-5 text-black" fill="currentColor" />
                                <span className="text-lg font-black uppercase tracking-tighter text-black">HRX Hub</span>
                            </Link>

                            <Button type="button" variant="ghost" size="icon" onClick={closeMobileNav}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <CandidateSidebarContent active={active} candidate={candidate} onNavigate={closeMobileNav} onLogout={handleLogout} />
                    </aside>
                </div>
            ) : null}

            <main className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-md lg:px-10">
                    <div className="flex items-center gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setMobileNavOpen(true)}
                            aria-label="Open navigation"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>

                        <div className="hidden md:block">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-semibold tracking-tight text-black">{title}</h1>
                                {candidate.is_verified ? (
                                    <span className="flex items-center gap-1 rounded border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                                        <ShieldCheck className="h-3 w-3" />
                                        Verified
                                    </span>
                                ) : null}
                            </div>
                            {subtitle ? <p className="text-xs font-medium text-zinc-500">{subtitle}</p> : null}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                            <input
                                className="w-64 rounded-md border-none bg-zinc-100 py-1.5 pl-9 pr-4 text-sm outline-none placeholder:text-zinc-400 focus:ring-1 focus:ring-black"
                                placeholder="Search jobs, companies..."
                            />
                        </div>

                        {completeness !== undefined ? (
                            <div className="hidden items-center gap-3 sm:flex">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Profile</span>
                                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-200">
                                    <div className="h-full bg-black transition-all duration-500" style={{ width: `${completeness}%` }} />
                                </div>
                                <span className="font-mono text-xs font-bold text-black">{completeness}%</span>
                            </div>
                        ) : null}

                        <Button type="button" variant="ghost" size="icon" className="text-zinc-400 hover:text-black">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" className="hidden sm:inline-flex text-zinc-400 hover:text-black">
                            <Settings className="h-5 w-5" />
                        </Button>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-bold text-black">
                            {getInitials(candidate.full_name)}
                        </div>
                        {headerActions}
                    </div>
                </header>

                <div className="no-scrollbar flex-1 overflow-y-auto p-6 md:p-10">{children}</div>
            </main>
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
        <div className="flex h-full flex-col justify-between">
            <div className="space-y-6">
                <div>
                    <h3 className="mb-3 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Candidate Hub</h3>
                    <nav className="space-y-1 px-3">
                        <CandidateSidebarLink href={candidateLinks.dashboard} icon={<LayoutDashboard size={18} />} label="Dashboard" active={active === 'dashboard'} onNavigate={onNavigate} />
                        <CandidateSidebarLink href={candidateLinks.applications} icon={<Briefcase size={18} />} label="My Applications" active={active === 'applications'} onNavigate={onNavigate} />
                        <CandidateSidebarLink href={candidateLinks.jobs} icon={<Search size={18} />} label="Browse Jobs" active={active === 'jobs'} onNavigate={onNavigate} />
                        <CandidateSidebarLink href={candidateLinks.profile} icon={<User size={18} />} label="My Profile" active={active === 'profile'} onNavigate={onNavigate} />
                        <CandidateSidebarLink href={candidateLinks.documents} icon={<FileText size={18} />} label="Documents" active={active === 'documents'} onNavigate={onNavigate} />
                    </nav>
                </div>

                <div>
                    <h3 className="mb-3 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Career</h3>
                    <nav className="space-y-1 px-3">
                        <CandidateSidebarLink href={candidateLinks.education} icon={<GraduationCap size={18} />} label="Education" active={active === 'education'} onNavigate={onNavigate} />
                        <CandidateSidebarLink href={candidateLinks.skills} icon={<Wrench size={18} />} label="Skills" active={active === 'skills'} onNavigate={onNavigate} />
                        <CandidateSidebarLink href={candidateLinks.settings} icon={<Settings size={18} />} label="Settings" active={active === 'settings'} onNavigate={onNavigate} />
                    </nav>
                </div>
            </div>

            <div className="mt-auto border-t border-zinc-200 p-4">
                <div className="mb-4 flex items-center gap-3 px-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-bold text-black">
                        {getInitials(candidate.full_name)}
                    </div>
                    <div className="min-w-0">
                        <span className="block truncate text-xs font-bold text-black">{candidate.full_name || 'Candidate'}</span>
                        <span className="block truncate text-[10px] text-zinc-500">{candidate.email}</span>
                    </div>
                </div>
                <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-500 transition-colors hover:text-red-600"
                >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
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
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 active:scale-95 ${
                active ? 'rounded-none border-r-2 border-black bg-zinc-200 text-black' : 'text-zinc-500 hover:bg-zinc-200/50 hover:text-black'
            }`}
        >
            {icon}
            <span>{label}</span>
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
        <section className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between border-b border-zinc-200 pb-4">
                <div className="flex items-center gap-2">
                    {icon ? <span className="text-zinc-400">{icon}</span> : null}
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">{title}</h3>
                </div>
                {action}
            </div>
            <div>{children}</div>
        </section>
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
        <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-zinc-200 bg-white text-zinc-600">
                {icon}
            </div>
            <div>
                <p className="mb-1.5 text-[9px] font-bold uppercase leading-none tracking-wider text-zinc-400">{label}</p>
                <div className="text-sm font-bold text-black">{value ?? <span className="font-medium italic text-zinc-400">Not provided</span>}</div>
            </div>
        </div>
    );
}

export function CandidateEmptyState({ message }: { message: string }) {
    return (
        <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50/50 py-12 text-center">
            <Briefcase className="mx-auto mb-4 h-10 w-10 text-zinc-300" />
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">{message}</p>
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
        return 'C';
    }

    return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
}
