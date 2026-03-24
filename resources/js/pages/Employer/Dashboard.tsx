import { Link, usePage } from '@inertiajs/react';
import { Briefcase, Users, Calendar, BarChart3, Verified, Info } from 'lucide-react';
import { EmployerHubLayout, EmployerPrimaryButton } from './components/hub';
import type { Company, Metrics, RecentApplication, RecommendedTalent, User, Vacancy } from './dummyData';

type PageProps = {
    company: Company;
    user: User;
    metrics: Metrics;
    vacancies: Vacancy[];
    recentApplications: RecentApplication[];
    recommendedTalent: RecommendedTalent[];
    applicationsByStatus: Record<string, number>;
    billingSummary?: {
        subscription?: {
            plan?: {
                name?: string;
            } | null;
            seats?: number | null;
        } | null;
    };
};

export default function EmployerDashboard() {
    const { company, user, metrics, vacancies, recentApplications, recommendedTalent, applicationsByStatus, billingSummary } = usePage<PageProps>().props;

    const totalPipeline = Object.values(applicationsByStatus).reduce((sum, value) => sum + value, 0);
    const interviewCount = applicationsByStatus.interview ?? 0;
    const publishedVacancyRate = metrics.total_vacancies > 0 ? Math.round((metrics.published_vacancies / metrics.total_vacancies) * 100) : 0;
    const interviewConversionRate = totalPipeline > 0 ? Math.round((interviewCount / totalPipeline) * 100) : 0;

    return (
        <EmployerHubLayout
            title="Employer Hub"
            subtitle="Overview of your current hiring activity"
            active="dashboard"
            company={company}
            user={user}
            headerActions={<EmployerPrimaryButton href="/employer/vacancies/create">Post a New Job</EmployerPrimaryButton>}
        >
            <div className="w-full px-4 md:px-8">
                {/* Hero Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-0.5 bg-zinc-200 text-[10px] font-bold tracking-widest uppercase rounded">Verified Employer</span>
                        </div>
                        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Employer Hub</h2>
                        <p className="text-sm text-muted-foreground">Overview of your current hiring activity</p>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <KpiCard 
                        icon={<Briefcase size={20} />} 
                        label="Active Vacancies" 
                        value={metrics.total_vacancies} 
                        sub="Live Status" 
                    />
                    <KpiCard 
                        icon={<Users size={20} />} 
                        label="Total Applications" 
                        value={metrics.total_applications} 
                        sub="Across all pipelines" 
                    />
                    <KpiCard 
                        icon={<Calendar size={20} />} 
                        label="Interviews" 
                        value={interviewCount} 
                        sub="Currently Scheduled" 
                    />
                    <div className="bg-white p-6 border border-zinc-200/50 flex flex-col justify-between group hover:bg-zinc-50 transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <BarChart3 className="text-zinc-400 group-hover:text-black transition-colors" size={20} />
                            <div className="w-12 h-1 bg-zinc-200 rounded-full overflow-hidden">
                                <div className="h-full bg-black" style={{ width: '92%' }}></div>
                            </div>
                        </div>
                        <div>
                            <p className="text-2xl font-semibold tracking-tight">92%</p>
                            <p className="text-sm font-medium text-zinc-500">Profile Health</p>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Active Requisitions */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-base font-semibold tracking-tight text-foreground">Active Requisitions</h3>
                                <Link href="/employer/vacancies" className="text-sm font-semibold text-zinc-500 hover:text-black transition-colors">View All</Link>
                            </div>
                            <div className="bg-white overflow-hidden border border-zinc-200/50 rounded-sm">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-zinc-50 border-b border-zinc-200">
                                            <th className="py-3 px-6 text-xs font-medium uppercase tracking-widest text-zinc-500">Job Title</th>
                                            <th className="py-3 px-6 text-xs font-medium uppercase tracking-widest text-zinc-500">Department</th>
                                            <th className="py-3 px-6 text-xs font-medium uppercase tracking-widest text-zinc-500 text-center">Applicants</th>
                                            <th className="py-3 px-6 text-xs font-medium uppercase tracking-widest text-zinc-500">Status</th>
                                            <th className="py-3 px-6 text-xs font-medium uppercase tracking-widest text-zinc-500 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100">
                                        {vacancies.map((vacancy) => (
                                            <tr key={vacancy.id} className="hover:bg-zinc-50 transition-colors group">
                                                <td className="py-4 px-6">
                                                    <p className="font-bold text-sm truncate">{vacancy.title}</p>
                                                    <p className="text-[10px] text-zinc-500 uppercase tracking-tighter mt-0.5">Ref: VAC-{vacancy.id}</p>
                                                </td>
                                                <td className="py-4 px-6 text-sm">{vacancy.department || '—'}</td>
                                                <td className="py-4 px-6 text-center text-sm font-bold">{vacancy.applications_count}</td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center gap-1.5 py-0.5 px-2 rounded-sm text-[9px] font-black uppercase tracking-widest border ${
                                                        vacancy.status.toLowerCase() === 'published' ? 'bg-black text-white border-black' : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                                                    }`}>
                                                        {vacancy.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <Link href={`/employer/vacancies/${vacancy.id}`} className="text-xs font-bold underline decoration-zinc-300 hover:decoration-black">View</Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Recent Applicants */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-base font-semibold tracking-tight text-foreground">Recent Applicants</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {recentApplications.slice(0, 4).map((app, idx) => (
                                    <div key={app.id} className="bg-white p-5 border border-zinc-200/50 hover:border-black transition-all">
                                        <div className="flex gap-4 items-start mb-4">
                                            <div className={`h-12 w-12 flex items-center justify-center font-bold text-lg shrink-0 ${idx % 2 === 0 ? 'bg-black text-white' : 'bg-zinc-200 text-zinc-700'}`}>
                                                {getInitials(app.candidate_name)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-bold text-sm truncate">{app.candidate_name}</h4>
                                                    {app.match_score && (
                                                        <span className="bg-zinc-100 px-2 py-0.5 text-[9px] font-bold rounded">{app.match_score}% Match</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-zinc-500 truncate">Applied for: {app.vacancy_title}</p>
                                                {app.match?.label ? (
                                                    <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">{app.match.label}</p>
                                                ) : null}
                                            </div>
                                        </div>
                                        {app.match?.reasons?.length ? (
                                            <div className="mb-4 rounded-sm border border-zinc-200 bg-zinc-50 p-3">
                                                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Why this candidate fits</p>
                                                <ul className="space-y-1.5">
                                                    {app.match.reasons.slice(0, 2).map((reason) => (
                                                        <li key={reason} className="flex items-start gap-2 text-[11px] leading-relaxed text-zinc-600">
                                                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                                                            <span>{reason}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : null}
                                        <div className="flex gap-2">
                                            <button className="flex-1 bg-black text-white py-2 text-[11px] uppercase tracking-wider font-bold rounded hover:bg-zinc-800 transition-colors">Shortlist</button>
                                            <Link href={`/employer/candidates/${app.id}`} className="flex-1">
                                                <button className="w-full bg-zinc-100 py-2 text-[11px] uppercase tracking-wider font-bold rounded hover:bg-zinc-200 text-zinc-700 transition-colors">Profile</button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Hiring Progress */}
                        <div className="bg-white p-6 border border-zinc-200/50 rounded-sm">
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-8">Hiring Progress</h3>
                            
                            <div className="flex flex-col items-center mb-10">
                                <div className="relative flex items-center justify-center">
                                    <svg className="w-32 h-32 transform -rotate-90">
                                        <circle className="text-zinc-100" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8"></circle>
                                        <circle className="text-black" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeDasharray="364.4" strokeDashoffset={364.4 - (364.4 * publishedVacancyRate) / 100} strokeWidth="8"></circle>
                                    </svg>
                                    <div className="absolute flex flex-col items-center">
                                        <span className="text-2xl font-bold tracking-tighter">{publishedVacancyRate}%</span>
                                        <span className="text-[9px] uppercase font-bold text-zinc-500">Live</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <ProgressBar label="Published Vacancy Rate" value={publishedVacancyRate} />
                                <ProgressBar label="Interview Conversion" value={interviewConversionRate} />
                            </div>
                        </div>

                        {/* Talent Matches */}
                        <div className="bg-white p-6 border border-zinc-200/50 rounded-sm">
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-6">Talent Matches</h3>
                            <div className="space-y-6">
                                {recommendedTalent.slice(0, 3).map((talent) => (
                                    <div key={talent.id} className="border border-zinc-200 rounded-sm p-4 group hover:border-black transition-all">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-zinc-100 rounded-sm flex items-center justify-center overflow-hidden font-bold text-xs text-zinc-500">
                                                    {talent.initials}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold truncate max-w-[150px]">{talent.name}</p>
                                                    <p className="text-[10px] text-zinc-500 font-medium truncate max-w-[150px]">{talent.headline}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                {talent.match_score ? (
                                                    <span className="inline-flex bg-zinc-100 px-2 py-0.5 text-[9px] font-bold rounded">{talent.match_score}% Match</span>
                                                ) : null}
                                                <button className="mt-2 block text-[10px] font-bold text-zinc-400 uppercase tracking-widest hover:text-black transition-colors">Invite</button>
                                            </div>
                                        </div>
                                        {talent.match?.vacancy_title ? (
                                            <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                                Best fit: {talent.match.vacancy_title}
                                            </p>
                                        ) : null}
                                        {talent.match?.reasons?.length ? (
                                            <ul className="mt-3 space-y-1.5">
                                                {talent.match.reasons.slice(0, 2).map((reason) => (
                                                    <li key={reason} className="flex items-start gap-2 text-[11px] leading-relaxed text-zinc-600">
                                                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                                                        <span>{reason}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                            <Link href="/employer/candidates">
                                <button className="w-full mt-8 py-3 text-[10px] uppercase tracking-widest font-bold text-zinc-500 bg-zinc-50 hover:bg-zinc-100 transition-colors">
                                    Find More Matches
                                </button>
                            </Link>
                        </div>

                        {/* Company Account Summary */}
                        <div className="bg-black text-white p-6 rounded-lg shadow-2xl">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Company Account</h3>
                                <Verified className="text-white" size={18} />
                            </div>
                            <div className="mb-6">
                                <p className="text-2xl font-bold tracking-tight mb-1">{company.company_name}</p>
                                <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">{billingSummary?.subscription?.plan?.name ?? 'Standard Plan'}</p>
                            </div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex -space-x-2">
                                    <div className="w-6 h-6 rounded-full border border-black bg-zinc-700"></div>
                                    <div className="w-6 h-6 rounded-full border border-black bg-zinc-500"></div>
                                    <div className="w-6 h-6 rounded-full border border-black bg-zinc-300"></div>
                                </div>
                                <p className="text-[10px] font-bold uppercase tracking-tighter">{billingSummary?.subscription?.seats ?? 1} Active Admins</p>
                            </div>
                            <Link href="/employer/billing">
                                <button className="w-full bg-white text-black py-3 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors">
                                    Manage Subscription
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </EmployerHubLayout>
    );
}

/* --- Subcomponents --- */

function KpiCard({ icon, label, value, sub }: { icon: any, label: string, value: string | number, sub: string }) {
    return (
        <div className="bg-white p-6 border border-zinc-200/50 flex flex-col justify-between group hover:bg-zinc-50 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <span className="text-zinc-400 group-hover:text-black transition-colors">{icon}</span>
                <span className="text-[9px] font-bold text-zinc-400 tracking-widest uppercase">{sub}</span>
            </div>
            <div>
                <p className="text-2xl font-semibold tracking-tight">{value}</p>
                <p className="text-sm font-medium text-zinc-500">{label}</p>
            </div>
        </div>
    );
}

function ProgressBar({ label, value }: { label: string, value: number }) {
    return (
        <div>
            <div className="flex justify-between text-[10px] font-bold uppercase mb-2 tracking-widest">
                <span className="text-zinc-500">{label}</span>
                <span>{value}%</span>
            </div>
            <div className="h-1 bg-zinc-100 rounded-full">
                <div className="h-full bg-black transition-all duration-500" style={{ width: `${value}%` }}></div>
            </div>
        </div>
    );
}

function getInitials(name?: string | null): string {
    if (!name) return 'EX';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}
