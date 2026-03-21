import { Head, Link, router } from '@inertiajs/react';
import {
    Briefcase,
    Users,
    Building2,
    LogOut,
    ChevronRight,
    ShieldCheck,
    LayoutDashboard,
    Settings,
    Bell,
    TrendingUp,
    FileText,
    Info,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

import {
    company,
    user,
    metrics,
    vacancies,
    recentApplications,
    recommendedTalent,
} from './dummyData';

export default function EmployerDashboard() {
    const handleLogout = () => router.post('/logout');

    return (
        <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans text-slate-900 antialiased">
            <Head title="Employer Hub - HRX" />

            {/* ===== SIDEBAR NAVIGATION ===== */}
            <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
                <div className="flex items-center space-x-2 border-b border-slate-100 p-6">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-900 text-white">
                        <ShieldCheck size={20} />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-slate-900 uppercase">
                        HRX <span className="text-slate-400 font-medium italic lowercase">Hub</span>
                    </span>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                    <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Main Menu</p>
                    <SidebarLink href="/employer/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" active />
                    <SidebarLink href="/employer/dashboard" icon={<Briefcase size={20} />} label="Vacancies" />
                    <SidebarLink href="/employer/dashboard" icon={<Users size={20} />} label="Candidates" />

                    <p className="mb-2 mt-8 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Organization</p>
                    <SidebarLink href="/employer/dashboard" icon={<FileText size={20} />} label="Reports" />
                    <SidebarLink href="/employer/dashboard" icon={<Building2 size={20} />} label="Company Profile" />
                    <SidebarLink href="/employer/dashboard" icon={<Settings size={20} />} label="Billing" />

                    <div className="mt-8">
                        <SidebarLink href="/" icon={<ChevronRight size={20} className="rotate-180" />} label="Back to Home" />
                    </div>
                </nav>

                {/* User Profile Section at bottom */}
                <div className="border-t border-slate-100 p-4">
                    <div className="flex items-center px-2 py-3">
                        <div className="flex-shrink-0">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-600 text-xs">
                                {user?.name?.split(' ').map((n) => n[0]).join('').substring(0, 2) || 'U'}
                            </div>
                        </div>
                        <div className="ml-3 overflow-hidden">
                            <p className="truncate text-xs font-semibold text-slate-900">{user?.name || 'User'}</p>
                            <p className="truncate text-[10px] text-slate-500 font-medium">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="mt-2 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut size={14} /> Terminate Session
                    </button>
                </div>
            </aside>

            {/* ===== MAIN CONTENT AREA ===== */}
            <main className="flex-1 overflow-y-auto bg-slate-50">
                {/* TOP BAR */}
                <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Employer Hub</h1>
                        <p className="text-sm text-slate-500">Overview of your current hiring activity</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <Bell size={24} />
                        </button>
                        <Button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors uppercase tracking-tighter">
                            Post a New Job
                        </Button>
                    </div>
                </header>

                <div className="mx-auto w-full p-8">
                    {/* METRICS ROW */}
                    <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <KPICard label="Active Vacancies" value={metrics.total_vacancies} trend="2 new" />
                        <KPICard label="New Applications" value={metrics.total_applications} subLabel="Last 24 hours" />
                        <KPICard label="Interviews" value="6" subLabel="Today" />
                        <KPICard label="Total Hires" value="124" subLabel="Year to date" />
                    </section>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* LEFT COLUMN (2/3) */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* ACTIVE REQUISITIONS */}
                            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                                <div className="flex items-center justify-between border-b border-slate-100 p-6">
                                    <h2 className="text-lg font-bold text-slate-900">Active Requisitions</h2>
                                    <button className="text-xs font-semibold uppercase tracking-wider text-slate-500 transition-colors hover:text-slate-900">
                                        View All
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                            <tr>
                                                <th className="px-6 py-3">Job Title</th>
                                                <th className="px-6 py-3">Department</th>
                                                <th className="px-6 py-3">Applicants</th>
                                                <th className="px-6 py-3">Status</th>
                                                <th className="px-6 py-3"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-sm">
                                            {vacancies.map((v) => (
                                                <tr key={v.id} className="transition-colors hover:bg-slate-50">
                                                    <td className="px-6 py-4 font-semibold text-slate-900">{v.title}</td>
                                                    <td className="px-6 py-4 text-slate-600">{v.department || 'Engineering'}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-medium text-slate-900">{v.applications_count}</span>
                                                            <span className="text-[10px] font-bold text-emerald-500">+12%</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge className="rounded bg-slate-900 px-2 py-1 text-[10px] font-bold uppercase text-white border-0">
                                                            {v.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="text-slate-400 hover:text-slate-900">
                                                            <ChevronRight size={20} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            {/* RECENT APPLICANTS */}
                            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                                <div className="border-b border-slate-100 p-6">
                                    <h2 className="text-lg font-bold text-slate-900">Recent Applicants</h2>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {recentApplications.map((app) => (
                                        <div key={app.id} className="flex items-center justify-between p-6 transition-colors hover:bg-slate-50">
                                            <div className="flex items-center">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 font-bold text-slate-400 text-xs">
                                                    {app.candidate_name.substring(0, 1)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="flex items-center space-x-2">
                                                        <h4 className="text-sm font-bold text-slate-900">{app.candidate_name}</h4>
                                                        <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold italic text-white uppercase">
                                                            {app.match_score ?? 98}% Match
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-500">
                                                        Applied for <span className="font-medium text-slate-700">{app.vacancy_title}</span> • {app.applied_at}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-slate-50">
                                                    Profile
                                                </button>
                                                <button className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800">
                                                    Shortlist
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* RIGHT COLUMN (1/3) */}
                        <div className="space-y-8">
                            {/* HIRING PROGRESS */}
                            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h2 className="mb-6 text-sm font-bold uppercase tracking-wider text-slate-900">Hiring Progress</h2>
                                <div className="space-y-6">
                                    <div>
                                        <div className="mb-2 flex justify-between text-xs font-bold">
                                            <span className="text-slate-500">Filling Rate</span>
                                            <span className="text-slate-900">78%</span>
                                        </div>
                                        <Progress value={78} className="h-2 bg-slate-100" />
                                    </div>
                                    <div>
                                        <div className="mb-2 flex justify-between text-xs font-bold">
                                            <span className="text-slate-500">Onboarding Velocity</span>
                                            <span className="text-slate-900">62%</span>
                                        </div>
                                        <Progress value={62} className="h-2 bg-slate-100" />
                                    </div>
                                </div>
                                <div className="mt-8 border-t border-slate-100 pt-6 text-center">
                                    <div className="relative inline-flex h-24 w-24 items-center justify-center rounded-full border-[6px] border-slate-900 border-r-slate-100">
                                        <div className="text-center">
                                            <span className="block text-xl font-bold text-slate-900">12</span>
                                            <span className="text-[10px] font-bold uppercase text-slate-400">Days to Hire</span>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-[10px] font-medium text-slate-400 uppercase tracking-tight">
                                        Average across all departments
                                    </p>
                                </div>
                            </section>

                            {/* TALENT MATCHES */}
                            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                                <div className="flex items-center justify-between border-b border-slate-100 p-4">
                                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Talent Matches</h2>
                                    <Info size={16} className="text-slate-400" />
                                </div>
                                <div className="space-y-4 p-4">
                                    {recommendedTalent.map((talent) => (
                                        <RecommendedTalent
                                            key={talent.id}
                                            name={talent.name}
                                            headline={talent.headline}
                                            initials={talent.initials}
                                        />
                                    ))}
                                </div>
                            </section>

                            {/* COMPANY ACCOUNT */}
                            <section className="rounded-xl bg-slate-900 p-6 text-white shadow-lg shadow-slate-200">
                                <div className="mb-6 flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Company Account</span>
                                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold uppercase text-white">ENTERPRISE</span>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold">{company?.company_name || 'HRX Global'}</h3>
                                    <p className="text-xs text-slate-400 font-medium">Billing: Monthly Pro Plan</p>
                                </div>
                                <div className="flex items-center justify-between border-t border-slate-800 py-4">
                                    <div className="flex -space-x-2">
                                        <div className="h-6 w-6 rounded-full border border-slate-900 bg-slate-700"></div>
                                        <div className="h-6 w-6 rounded-full border border-slate-900 bg-slate-600"></div>
                                        <div className="h-6 w-6 rounded-full border border-slate-900 bg-slate-500"></div>
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-900 bg-slate-800 text-[8px] font-bold">
                                            +4
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-slate-300">7 Active Users</span>
                                </div>
                                <button className="mt-2 w-full rounded bg-white py-2 text-xs font-bold text-slate-900 transition-colors hover:bg-slate-100 uppercase tracking-widest">
                                    Manage Subscriptions
                                </button>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// ---------- HELPERS / SUB-COMPONENTS ----------

function SidebarLink({
    href,
    icon,
    label,
    active = false,
}: {
    href: string;
    icon: React.ReactNode;
    label: string;
    active?: boolean;
}) {
    return (
        <Link
            href={href}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all ${
                active
                    ? 'bg-slate-100 text-slate-900 border-r-2 border-slate-900 rounded-none'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
        >
            <span className="mr-3">{icon}</span>
            {label}
        </Link>
    );
}

function KPICard({
    label,
    value,
    trend,
    subLabel,
}: {
    label: string;
    value: string | number;
    trend?: string;
    subLabel?: string;
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-400">{label}</p>
            <div className="flex items-end justify-between">
                <h3 className="text-3xl font-bold text-slate-900 leading-none">{value}</h3>
                {trend && (
                    <span className="flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-500">
                        <TrendingUp size={12} className="mr-1" /> {trend}
                    </span>
                )}
                {subLabel && <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">{subLabel}</span>}
            </div>
        </div>
    );
}

function RecommendedTalent({
    name,
    headline,
    initials,
}: {
    name: string;
    headline: string;
    initials: string;
}) {
    return (
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 transition-colors hover:bg-white">
            <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                    {initials}
                </div>
                <div>
                    <h5 className="text-xs font-bold text-slate-900">{name}</h5>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">{headline}</p>
                </div>
            </div>
            <button className="mt-3 w-full rounded border border-slate-200 py-1.5 text-[10px] font-bold uppercase transition-colors hover:bg-slate-50 tracking-widest">
                Invite to Apply
            </button>
        </div>
    );
}