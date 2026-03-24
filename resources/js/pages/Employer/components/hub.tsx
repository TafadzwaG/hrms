import { Head, Link, router } from '@inertiajs/react';
import {
    Bell,
    Calendar,
    Briefcase,
    Building2,
    FileText,
    LayoutDashboard,
    LogOut,
    Menu,
    Settings,
    ShieldCheck,
    Users,
    X,
    Search,
    CreditCard,
    BarChart3
} from 'lucide-react';
import { type ReactNode, useState } from 'react';

import { Button } from '@/components/ui/button';
import type { Company, User } from '../dummyData';

type EmployerHubLayoutProps = {
    title: string;
    subtitle: string;
    active: 'dashboard' | 'vacancies' | 'candidates' | 'interviews' | 'reports' | 'company' | 'billing';
    company: Company;
    user: User;
    children: ReactNode;
    headerActions?: ReactNode;
};

const employerLinks = {
    dashboard: '/employer/dashboard',
    vacancies: '/employer/vacancies',
    candidates: '/employer/candidates',
    interviews: '/employer/interviews',
    reports: '/employer/reports',
    company: '/employer/company-profile',
    billing: '/employer/billing',
};

const employerStatusColor: Record<string, string> = {
    // Active / live states — dark
    active: 'bg-zinc-900 text-white border-zinc-900',
    published: 'bg-zinc-900 text-white border-zinc-900',
    open: 'bg-zinc-900 text-white border-zinc-900',
    accepted: 'bg-zinc-900 text-white border-zinc-900',
    completed: 'bg-zinc-900 text-white border-zinc-900',
    // Mid-weight states
    scheduled: 'bg-zinc-200 text-zinc-800 border-zinc-300',
    closed: 'bg-zinc-200 text-zinc-700 border-zinc-300',
    // Neutral / inactive states
    draft: 'bg-zinc-100 text-zinc-500 border-zinc-200',
    archived: 'bg-zinc-100 text-zinc-500 border-zinc-200',
    suspended: 'bg-zinc-200 text-zinc-600 border-zinc-300',
    cancelled: 'bg-zinc-100 text-zinc-500 border-zinc-200',
    rejected: 'bg-white text-zinc-400 border-zinc-200',
};

export function EmployerHubLayout({
    title,
    subtitle,
    active,
    company,
    user,
    children,
    headerActions,
}: EmployerHubLayoutProps) {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const handleLogout = () => router.post('/logout');
    const closeMobileNav = () => setMobileNavOpen(false);

    return (
        <div className="flex h-screen overflow-hidden bg-[#f9f9f9] text-zinc-950 font-['Inter'] antialiased">
            <Head title={`${title} - Employer Hub`} />

            {/* Desktop Sidebar */}
            <aside className="hidden w-60 shrink-0 flex-col border-r border-zinc-200 bg-zinc-50 lg:flex z-50">
                <div className="px-5 py-6">
                    <Link href="/" className="flex items-center gap-2">
                        <ShieldCheck className="h-6 w-6 text-black" />
                        <span className="text-xl font-black tracking-tighter text-black uppercase">HRX Hub</span>
                    </Link>
                </div>

                <EmployerSidebarContent active={active} company={company} user={user} onLogout={handleLogout} />
            </aside>

            {/* Mobile Sidebar */}
            {mobileNavOpen ? (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={closeMobileNav}
                        aria-label="Close navigation"
                    />

                    <aside className="relative flex h-full w-72 flex-col border-r border-zinc-200 bg-white shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-zinc-100">
                            <Link href="/" className="flex items-center gap-2" onClick={closeMobileNav}>
                                <ShieldCheck className="h-5 w-5 text-black" />
                                <span className="text-lg font-black tracking-tighter text-black uppercase">HRX Hub</span>
                            </Link>

                            <Button type="button" variant="ghost" size="icon" onClick={closeMobileNav}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <EmployerSidebarContent active={active} company={company} user={user} onNavigate={closeMobileNav} onLogout={handleLogout} />
                    </aside>
                </div>
            ) : null}

            <main className="flex flex-1 flex-col overflow-hidden">
                {/* Topbar */}
                <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 bg-white/80 backdrop-blur-md px-5 lg:px-8">
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

                        <div className="hidden md:flex items-center gap-3">
                            <h1 className="text-2xl font-semibold tracking-tight text-black">{title}</h1>
                            <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest rounded border ${employerStatusColor[(company.status || '').toLowerCase()] || ''}`}>
                                {company.status || 'Active'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                            <input 
                                className="pl-9 pr-4 py-1.5 bg-zinc-100 border-none rounded-md text-sm w-64 focus:ring-1 focus:ring-black placeholder:text-zinc-400 outline-none" 
                                placeholder="Search candidates, jobs..." 
                            />
                        </div>
                        
                        <Button type="button" variant="ghost" size="icon" className="text-zinc-400 hover:text-black">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" className="hidden sm:inline-flex text-zinc-400 hover:text-black">
                            <Settings className="h-5 w-5" />
                        </Button>
                        
                    </div>
                </header>

                {/* Page Content Canvas */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar">
                    {children}
                </div>
            </main>
        </div>
    );
}

function EmployerSidebarContent({
    active,
    company,
    user,
    onNavigate,
    onLogout,
}: {
    active: EmployerHubLayoutProps['active'];
    company: Company;
    user: User;
    onNavigate?: (() => void) | undefined;
    onLogout: () => void;
}) {
    return (
        <div className="flex flex-col h-full justify-between">
            <div className="space-y-6">
                <div>
                    <h3 className="px-6 mb-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Employer Hub</h3>
                    <nav className="space-y-1 px-3">
                        <EmployerSidebarLink href={employerLinks.dashboard} icon={<LayoutDashboard size={18} />} label="Dashboard" active={active === 'dashboard'} onNavigate={onNavigate} />
                        <EmployerSidebarLink href={employerLinks.vacancies} icon={<Briefcase size={18} />} label="Vacancies" active={active === 'vacancies'} onNavigate={onNavigate} />
                        <EmployerSidebarLink href={employerLinks.candidates} icon={<Users size={18} />} label="Candidates" active={active === 'candidates'} onNavigate={onNavigate} />
                        <EmployerSidebarLink href={employerLinks.interviews} icon={<Calendar size={18} />} label="Interviews" active={active === 'interviews'} onNavigate={onNavigate} />
                    </nav>
                </div>

                <div>
                    <h3 className="px-6 mb-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Organization</h3>
                    <nav className="space-y-1 px-3">
                        <EmployerSidebarLink href={employerLinks.reports} icon={<BarChart3 size={18} />} label="Reports" active={active === 'reports'} onNavigate={onNavigate} />
                        <EmployerSidebarLink href={employerLinks.company} icon={<Building2 size={18} />} label="Company Profile" active={active === 'company'} onNavigate={onNavigate} />
                        <EmployerSidebarLink href={employerLinks.billing} icon={<CreditCard size={18} />} label="Billing" active={active === 'billing'} onNavigate={onNavigate} />
                    </nav>
                </div>
            </div>

            <div className="border-t border-zinc-200 p-4 mt-auto">
                <div className="flex items-center gap-3 px-3 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-bold text-black">
                        {getEmployerInitials(user?.name)}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-foreground truncate">{user?.name || 'John Doe'}</span>
                        <span className="text-[10px] text-zinc-500 truncate">{company.company_name}</span>
                    </div>
                </div>
                <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-500 hover:text-red-600 transition-colors"
                >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
}

function EmployerSidebarLink({
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
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors duration-150 rounded-md active:scale-95 ${
                active 
                ? 'bg-zinc-200 text-black border-r-2 border-black rounded-none' 
                : 'text-zinc-500 hover:text-black hover:bg-zinc-200/50'
            }`}
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}

export function EmployerSectionCard({
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
        <section className="bg-zinc-50 border border-zinc-200 p-5 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-zinc-200 pb-3">
                <div className="flex items-center gap-2">
                    {icon && <span className="text-zinc-400">{icon}</span>}
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{title}</h3>
                </div>
                {action}
            </div>
            <div>{children}</div>
        </section>
    );
}

export function EmployerStatusBadge({ status }: { status: string }) {
    const normalized = status.toLowerCase();

    return (
        <span
            className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest rounded border ${
                employerStatusColor[normalized] || 'border-zinc-200 bg-zinc-100 text-zinc-500'
            }`}
        >
            {status}
        </span>
    );
}

export function EmployerEmptyState({ message }: { message: string }) {
    return (
        <div className="py-12 text-center border border-dashed border-zinc-200 rounded-lg bg-zinc-50/50">
            <Briefcase className="mx-auto mb-4 h-10 w-10 text-zinc-300" />
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">{message}</p>
        </div>
    );
}

export function EmployerPrimaryButton({
    href,
    children,
}: {
    href: string;
    children: ReactNode;
}) {
    return (
        <Link href={href}>
            <Button className="bg-black text-white hover:bg-zinc-800 px-6 py-5 h-auto rounded-md font-bold text-sm flex items-center gap-2 transition-all active:scale-95">
                {children}
            </Button>
        </Link>
    );
}

function getEmployerInitials(name?: string | null): string {
    if (!name) {
        return 'JD';
    }

    return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
}
