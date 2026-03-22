import { router, usePage } from '@inertiajs/react';
import { Briefcase, Calendar, Filter, Target, Search, ArrowLeft, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    EmployerEmptyState,
    EmployerHubLayout,
} from './components/hub';
import type { Company, RecentApplication, User, Vacancy } from './dummyData';

type PageProps = {
    company: Company;
    applications: {
        data: RecentApplication[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        search?: string | null;
        status?: string | null;
        vacancy_id?: number | null;
    };
    statuses: string[];
    vacancies: Vacancy[];
};

export default function EmployerCandidatesPage() {
    const { company, applications, filters, statuses, vacancies } = usePage<PageProps>().props;
    const user = usePage<{ user?: User }>().props.user ?? { name: 'Employer User', email: company.email ?? '' };

    const updateStatus = (applicationId: number, status: string) => {
        router.patch(`/employer/applications/${applicationId}/status`, { status }, { preserveScroll: true });
    };

    return (
        <EmployerHubLayout
            title="Candidates"
            subtitle="Review, manage, and process applications across all your active job listings in one central archive."
            active="candidates"
            company={company}
            user={user}
        >
            <div className="w-full px-6 md:px-10">
                {/* Header Section */}
                <div className="mb-10">
                    <h1 className="text-5xl font-extrabold tracking-tighter text-black mb-2">Candidates</h1>
                    <p className="text-zinc-500 font-medium max-w-2xl">
                        Review, manage, and process applications across all your active job listings in one central archive.
                    </p>
                </div>

                {/* Filter Applicants Section */}
                <section className="mb-12 p-8 bg-zinc-50 border border-zinc-200 rounded-lg">
                    <form method="get" action="/employer/candidates" className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Search Candidates</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 h-4 w-4" />
                                <input 
                                    name="search" 
                                    defaultValue={filters.search ?? ''} 
                                    className={underlinedInput} 
                                    placeholder="Name or headline..." 
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Status</label>
                            <select name="status" defaultValue={filters.status ?? ''} className={underlinedInput}>
                                <option value="">All Statuses</option>
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status.replace(/_/g, ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Vacancy</label>
                            <select name="vacancy_id" defaultValue={filters.vacancy_id?.toString() ?? ''} className={underlinedInput}>
                                <option value="">All Vacancies</option>
                                {vacancies.map((vacancy) => (
                                    <option key={vacancy.id} value={vacancy.id}>
                                        {vacancy.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Button type="submit" className="w-full py-6 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-none hover:bg-zinc-800 transition-all">
                            Apply Filters
                        </Button>
                    </form>
                </section>

                {/* Applicants List Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                            Showing {applications.data.length} Applicants
                        </span>
                    </div>

                    {applications.data.length > 0 ? (
                        <div className="space-y-6">
                            {applications.data.map((application) => (
                                <div
                                    key={application.id}
                                    className="group bg-white p-8 border border-zinc-200 hover:border-black transition-all duration-300"
                                >
                                    <div className="flex flex-col lg:flex-row gap-8">
                                        {/* Left: Profile Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-2xl font-bold tracking-tight text-black">{application.candidate_name}</h3>
                                                    <p className="text-sm font-medium text-zinc-500">{application.candidate_headline}</p>
                                                </div>
                                                <span className="px-2 py-1 bg-zinc-100 text-[10px] font-bold uppercase tracking-widest rounded border border-zinc-200">
                                                    {application.status.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-4 mb-6">
                                                <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                                                    <Briefcase className="h-4 w-4" />
                                                    <span>{application.vacancy_title}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>Applied {application.applied_at}</span>
                                                </div>
                                                {application.match_score && (
                                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/5 text-black text-[10px] font-black uppercase rounded">
                                                        <Target className="h-3 w-3" />
                                                        <span>{application.match_score}% Match</span>
                                                    </div>
                                                )}
                                            </div>

                                            {application.cover_letter && (
                                                <div className="p-4 bg-zinc-50 rounded border-l-2 border-black">
                                                    <p className="text-xs leading-relaxed text-zinc-700 italic">
                                                        "{application.cover_letter}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right: Actions */}
                                        <div className="lg:w-72 flex flex-col justify-between gap-4">
                                            <div className="grid grid-cols-2 gap-2">
                                                <button onClick={() => updateStatus(application.id, 'shortlisted')} className={actionBtnClass}>Shortlist</button>
                                                <button onClick={() => updateStatus(application.id, 'interview')} className={actionBtnClass}>Interview</button>
                                                <button onClick={() => updateStatus(application.id, 'offered')} className={actionBtnClass}>Offer</button>
                                                <button onClick={() => updateStatus(application.id, 'rejected')} className={`${actionBtnClass} border-red-200 text-red-600 hover:bg-red-50 hover:border-red-600`}>Reject</button>
                                            </div>
                                            <Button className="w-full py-6 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-none shadow-lg shadow-black/5 hover:bg-zinc-800 transition-all">
                                                View Full Profile
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Pagination */}
                            <div className="mt-16 flex items-center justify-between border-t border-zinc-200 pt-8">
                                <div className="flex items-center gap-4">
                                    {applications.links.map((link, index) => {
                                        if (link.label.includes('Previous')) {
                                            return (
                                                <a key={index} href={link.url ?? '#'} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
                                                    <ArrowLeft className="h-4 w-4" /> Previous
                                                </a>
                                            );
                                        }
                                        if (link.label.includes('Next')) {
                                            return (
                                                <a key={index} href={link.url ?? '#'} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
                                                    Next <ArrowRight className="h-4 w-4" />
                                                </a>
                                            );
                                        }
                                        return (
                                            <a
                                                key={index}
                                                href={link.url ?? '#'}
                                                className={`h-8 w-8 flex items-center justify-center text-xs font-bold rounded transition-colors ${
                                                    link.active ? 'bg-black text-white' : 'text-zinc-500 hover:text-black'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <EmployerEmptyState message="No applicants match the current filters." />
                    )}
                </div>
            </div>
        </EmployerHubLayout>
    );
}

const underlinedInput = "w-full pl-10 pr-4 py-2 bg-transparent border-0 border-b border-zinc-300 focus:border-black focus:ring-0 transition-all text-sm appearance-none outline-none";

const actionBtnClass = "px-4 py-2 border border-zinc-200 text-[10px] font-bold uppercase tracking-wider hover:bg-zinc-100 hover:border-black transition-all text-zinc-600";