import { usePage } from '@inertiajs/react';
import { BarChart3, Briefcase, FileText, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

import {
    EmployerHubLayout,
} from './components/hub';
import type { Company, User, Vacancy } from './dummyData';

type PageProps = {
    company: Company;
    summary: {
        total_vacancies: number;
        published_vacancies: number;
        total_applications: number;
        average_applications_per_vacancy: number;
    };
    applicationsByStatus: Record<string, number>;
    monthlyTrend: Array<{
        label: string;
        applications: number;
    }>;
    vacancyPerformance: Vacancy[];
};

export default function EmployerReportsPage() {
    const { company, summary, applicationsByStatus, monthlyTrend, vacancyPerformance } = usePage<PageProps>().props;
    const user = usePage<{ user?: User }>().props.user ?? { name: 'Employer User', email: company.email ?? '' };

    return (
        <EmployerHubLayout
            title="Reports"
            subtitle="Recruitment reporting based on current company vacancies and applications."
            active="reports"
            company={company}
            user={user}
        >
            <div className="w-full px-4 md:px-6">
                {/* Hero Header Section */}
                <header className="mb-6">
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-1.5">Reports</h2>
                    <p className="text-sm text-muted-foreground max-w-2xl">
                        Recruitment reporting based on current company vacancies and applications.
                    </p>
                </header>

                {/* Summary Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                    {/* Card 1: Summary */}
                    <div className="bg-white p-5 flex flex-col gap-5 shadow-sm border border-zinc-200 rounded-sm">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Summary</span>
                            <Briefcase className="h-3.5 w-3.5 text-black" />
                        </div>
                        <div className="space-y-1.5">
                            <MetricRow label="Total vacancies" value={summary.total_vacancies} />
                            <MetricRow label="Published vacancies" value={summary.published_vacancies} isPrimary />
                            <MetricRow label="Total applications" value={summary.total_applications} />
                            <div className="pt-2 mt-2 border-t-2 border-black">
                                <MetricRow label="Avg. applications / vacancy" value={summary.average_applications_per_vacancy} isBold />
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Status Breakdown */}
                    <div className="bg-white p-5 flex flex-col gap-5 shadow-sm border border-zinc-200 rounded-sm">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Status Breakdown</span>
                            <BarChart3 className="h-3.5 w-3.5 text-black" />
                        </div>
                        <div className="space-y-3">
                            {Object.entries(applicationsByStatus).map(([status, count]) => (
                                <div key={status} className="group">
                                    <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest mb-1.5">
                                        <span className="text-zinc-600">{status.replace(/_/g, ' ')}</span>
                                        <span className="text-black">{count}</span>
                                    </div>
                                    <div className="w-full bg-zinc-100 h-1 overflow-hidden rounded-full">
                                        <div 
                                            className="bg-black h-full transition-all duration-500" 
                                            style={{ width: `${Math.min(100, (count / summary.total_applications) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Card 3: Monthly Trend */}
                    <div className="bg-white p-5 flex flex-col gap-5 shadow-sm border border-zinc-200 rounded-sm">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Monthly Trend</span>
                            <TrendingUp className="h-3.5 w-3.5 text-black" />
                        </div>
                        <div className="flex items-end justify-between h-full pt-4 pb-1 gap-2">
                            {monthlyTrend.map((point) => (
                                <div key={point.label} className="flex flex-col items-center gap-2 w-full group">
                                    <span className="text-[9px] font-bold text-zinc-400 group-hover:text-black transition-colors">
                                        {point.applications}
                                    </span>
                                    <div 
                                        className="w-full bg-zinc-200 hover:bg-black transition-colors cursor-pointer rounded-t-sm" 
                                        style={{ height: `${Math.max(10, point.applications * 1.5)}px` }}
                                    />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">{point.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Vacancy Performance Table Section */}
                <section className="bg-white border border-zinc-200 shadow-sm rounded-sm overflow-hidden mb-12">
                    <div className="px-5 py-4 border-b border-zinc-200 flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-zinc-400" />
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-700">Vacancy Performance</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-zinc-50 border-b border-zinc-200">
                                    <th className="px-5 py-3 text-xs font-medium uppercase tracking-widest text-zinc-500 whitespace-nowrap">Vacancy</th>
                                    <th className="px-5 py-3 text-xs font-medium uppercase tracking-widest text-zinc-500 whitespace-nowrap">Status</th>
                                    <th className="px-5 py-3 text-xs font-medium uppercase tracking-widest text-zinc-500 whitespace-nowrap">Applications</th>
                                    <th className="px-5 py-3 text-xs font-medium uppercase tracking-widest text-zinc-500 text-right whitespace-nowrap">Deadline</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {vacancyPerformance.map((vacancy) => (
                                    <tr key={vacancy.id} className="hover:bg-zinc-50/50 transition-colors group">
                                        <td className="px-5 py-3.5">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-black group-hover:underline cursor-pointer truncate max-w-[200px] sm:max-w-xs">
                                                    {vacancy.title}
                                                </span>
                                                <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-bold mt-0.5">
                                                    {vacancy.location || 'Remote'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-sm ${
                                                vacancy.status === 'published' ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                                            }`}>
                                                {vacancy.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="text-xs font-black text-black">{vacancy.applications_count}</span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                                {vacancy.application_deadline ?? 'Not set'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-5 py-3 bg-zinc-50 border-t border-zinc-200 flex justify-between items-center">
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                            Showing {vacancyPerformance.length} Vacancies
                        </span>
                        <div className="flex gap-1.5">
                            <button className="p-1.5 bg-white border border-zinc-200 hover:bg-black hover:text-white hover:border-black transition-colors rounded-sm">
                                <ChevronLeft className="h-3 w-3" />
                            </button>
                            <button className="p-1.5 bg-white border border-zinc-200 hover:bg-black hover:text-white hover:border-black transition-colors rounded-sm">
                                <ChevronRight className="h-3 w-3" />
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </EmployerHubLayout>
    );
}

function MetricRow({
    label,
    value,
    isPrimary = false,
    isBold = false
}: {
    label: string;
    value: string | number;
    isPrimary?: boolean;
    isBold?: boolean;
}) {
    return (
        <div className={`flex items-center justify-between py-2 px-3 rounded-sm transition-colors ${isPrimary ? 'bg-zinc-100' : 'bg-zinc-50/50 hover:bg-zinc-50'}`}>
            <span className={`text-xs font-medium uppercase tracking-widest ${isBold ? 'text-foreground' : 'text-muted-foreground'}`}>
                {label}
            </span>
            <span className={`text-sm font-semibold ${isPrimary || isBold ? 'text-foreground' : 'text-zinc-700'}`}>
                {value}
            </span>
        </div>
    );
}