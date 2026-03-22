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
            <div className="w-full px-6 md:px-10">
                {/* Hero Header Section */}
                <header className="mb-12">
                    <h2 className="text-[3.5rem] font-black tracking-tighter leading-none mb-4 text-black">Reports</h2>
                    <p className="text-zinc-500 text-lg max-w-2xl font-medium opacity-80">
                        Recruitment reporting based on current company vacancies and applications.
                    </p>
                </header>

                {/* Summary Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Card 1: Summary */}
                    <div className="bg-white p-6 flex flex-col gap-6 shadow-sm border border-zinc-100">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Summary</span>
                            <Briefcase className="h-4 w-4 text-black" />
                        </div>
                        <div className="space-y-2">
                            <MetricRow label="Total vacancies" value={summary.total_vacancies} />
                            <MetricRow label="Published vacancies" value={summary.published_vacancies} isPrimary />
                            <MetricRow label="Total applications" value={summary.total_applications} />
                            <div className="pt-2 mt-2 border-t-2 border-black">
                                <MetricRow label="Avg. applications / vacancy" value={summary.average_applications_per_vacancy} isBold />
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Status Breakdown */}
                    <div className="bg-white p-6 flex flex-col gap-6 shadow-sm border border-zinc-100">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status Breakdown</span>
                            <BarChart3 className="h-4 w-4 text-black" />
                        </div>
                        <div className="space-y-4">
                            {Object.entries(applicationsByStatus).map(([status, count]) => (
                                <div key={status} className="group">
                                    <div className="flex justify-between text-[10px] font-bold uppercase mb-1.5">
                                        <span>{status.replace(/_/g, ' ')}</span>
                                        <span>{count}</span>
                                    </div>
                                    <div className="w-full bg-zinc-100 h-1.5 overflow-hidden">
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
                    <div className="bg-white p-6 flex flex-col gap-6 shadow-sm border border-zinc-100">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Monthly Trend</span>
                            <TrendingUp className="h-4 w-4 text-black" />
                        </div>
                        <div className="flex items-end justify-between h-full pt-8 pb-2 gap-2">
                            {monthlyTrend.map((point) => (
                                <div key={point.label} className="flex flex-col items-center gap-3 w-full group">
                                    <span className="text-[10px] font-bold text-zinc-400 group-hover:text-black transition-colors">
                                        {point.applications}
                                    </span>
                                    <div 
                                        className="w-full bg-zinc-200 hover:bg-black transition-colors cursor-pointer" 
                                        style={{ height: `${Math.max(10, point.applications * 2)}px` }}
                                    />
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">{point.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Vacancy Performance Table Section */}
                <section className="bg-white border border-zinc-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-3">
                        <FileText className="h-4 w-4 text-zinc-400" />
                        <h3 className="text-[10px] font-bold uppercase tracking-widest">Vacancy Performance</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-zinc-50 text-[10px] font-black uppercase tracking-wider text-zinc-500 border-b border-zinc-100">
                                    <th className="px-6 py-4">Vacancy</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Applications</th>
                                    <th className="px-6 py-4 text-right">Deadline</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {vacancyPerformance.map((vacancy) => (
                                    <tr key={vacancy.id} className="hover:bg-zinc-50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-black group-hover:underline cursor-pointer">
                                                    {vacancy.title}
                                                </span>
                                                <span className="text-[10px] text-zinc-400 uppercase tracking-tighter font-medium">
                                                    {vacancy.location || 'Remote'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                                                vacancy.status === 'published' ? 'bg-black text-white' : 'bg-zinc-200 text-zinc-600'
                                            }`}>
                                                {vacancy.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-black">{vacancy.applications_count}</span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <span className="text-xs font-medium text-zinc-500">
                                                {vacancy.application_deadline ?? 'Not set'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex justify-between items-center">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            Showing {vacancyPerformance.length} Vacancies
                        </span>
                        <div className="flex gap-2">
                            <button className="p-2 bg-white border border-zinc-200 hover:bg-black hover:text-white transition-colors">
                                <ChevronLeft className="h-3 w-3" />
                            </button>
                            <button className="p-2 bg-white border border-zinc-200 hover:bg-black hover:text-white transition-colors">
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
        <div className={`flex items-center justify-between p-3 transition-colors ${isPrimary ? 'bg-zinc-100' : 'bg-zinc-50/50'}`}>
            <span className={`text-[11px] font-bold uppercase tracking-tight ${isBold ? 'text-black' : 'text-zinc-500'}`}>
                {label}
            </span>
            <span className={`text-sm font-black ${isPrimary ? 'text-black' : ''}`}>
                {value}
            </span>
        </div>
    );
}