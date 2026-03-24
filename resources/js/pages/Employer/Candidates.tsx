import { Link, router, usePage } from '@inertiajs/react';
import { 
    Briefcase, 
    Calendar, 
    Target, 
    Search, 
    ArrowLeft, 
    ArrowRight, 
    Clock3, 
    BookmarkPlus, 
    CheckCircle2, 
    XCircle, 
    ExternalLink,
    Filter
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    EmployerEmptyState,
    EmployerHubLayout,
    EmployerStatusBadge
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
            active="candidates"
            subtitle='Candidate listings'
            company={company}
            user={user}
        >
            <div className="w-full px-4 md:px-6">
                {/* Header Section */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-1">Candidates.</h1>
                    <p className="text-zinc-500 font-medium text-xs max-w-2xl">
                        Review, manage, and process applications across all your active job listings in one central archive.
                    </p>
                </div>

                {/* Filter Applicants Section */}
                <section className="mb-8 p-5 bg-zinc-50 border border-zinc-200 rounded-sm shadow-sm">
                    <form method="get" action="/employer/candidates" className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                        <div className="flex flex-col gap-1.5 md:col-span-4">
                            <label className="text-[9px] uppercase font-bold tracking-[0.2em] text-zinc-500">Search Candidates</label>
                            <div className="relative group">
                                <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-400 h-3.5 w-3.5 group-focus-within:text-black transition-colors" />
                                <input 
                                    name="search" 
                                    defaultValue={filters.search ?? ''} 
                                    className={`${underlinedInput} pl-6`} 
                                    placeholder="Name or headline..." 
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5 md:col-span-3">
                            <label className="text-[9px] uppercase font-bold tracking-[0.2em] text-zinc-500">Status</label>
                            <select name="status" defaultValue={filters.status ?? ''} className={underlinedInput}>
                                <option value="">All Statuses</option>
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status.replace(/_/g, ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5 md:col-span-3">
                            <label className="text-[9px] uppercase font-bold tracking-[0.2em] text-zinc-500">Vacancy</label>
                            <select name="vacancy_id" defaultValue={filters.vacancy_id?.toString() ?? ''} className={underlinedInput}>
                                <option value="">All Vacancies</option>
                                {vacancies.map((vacancy) => (
                                    <option key={vacancy.id} value={vacancy.id}>
                                        {vacancy.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <Button type="submit" className="w-full py-4 h-auto bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-zinc-800 transition-all flex items-center justify-center gap-1.5">
                                <Filter className="h-3 w-3" /> Filters
                            </Button>
                        </div>
                    </form>
                </section>

                {/* Applicants List Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-3 px-1 border-b border-zinc-200 pb-2">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                            Showing {applications.data.length} Applicants
                        </span>
                    </div>

                    {applications.data.length > 0 ? (
                        <div className="space-y-4">
                            {applications.data.map((application) => (
                                <div
                                    key={application.id}
                                    className="group bg-white p-5 border border-zinc-200 hover:border-black transition-all duration-300 rounded-sm shadow-sm relative overflow-hidden"
                                >
                                    {/* Left Accent border indicating status */}
                                    <div className="absolute top-0 left-0 w-1 h-full bg-black opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Left: Profile Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-start justify-between mb-3 gap-3">
                                                <div>
                                                    <h3 className="text-lg font-black tracking-tight text-black uppercase">{application.candidate_name}</h3>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-0.5">{application.candidate_headline}</p>
                                                </div>
                                                <EmployerStatusBadge status={application.status} />
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-3 mb-4 border-b border-zinc-100 pb-4">
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                                    <Briefcase className="h-3.5 w-3.5" />
                                                    <span className="truncate max-w-[200px]">{application.vacancy_title}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    <span>Applied {application.applied_at}</span>
                                                </div>
                                                {application.match_score && (
                                                    <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 text-[9px] font-black uppercase rounded-sm tracking-widest shrink-0">
                                                        <Target className="h-3 w-3" />
                                                        <span>{application.match_score}% Match</span>
                                                    </div>
                                                )}
                                            </div>

                                            {application.match?.label ? (
                                                <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                                                    {application.match.label}
                                                    {application.match.vacancy_title ? ` • Best fit: ${application.match.vacancy_title}` : ''}
                                                </p>
                                            ) : null}

                                            {application.match?.reasons?.length ? (
                                                <div className="mb-4 rounded-sm border border-zinc-100 bg-zinc-50 p-3">
                                                    <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">Why this candidate fits</p>
                                                    <ul className="space-y-1.5">
                                                        {application.match.reasons.slice(0, 2).map((reason) => (
                                                            <li key={reason} className="flex items-start gap-1.5 text-[11px] leading-relaxed text-zinc-600 font-medium">
                                                                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
                                                                <span>{reason}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ) : null}

                                            {application.latest_interview ? (
                                                <div className="mb-3 rounded-sm border border-zinc-100 bg-white p-3">
                                                    <div className="mb-1.5 flex items-center justify-between gap-3">
                                                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">Latest Interview</p>
                                                        <EmployerStatusBadge status={application.latest_interview.status_label ?? application.latest_interview.status} />
                                                    </div>
                                                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                                        <p className="flex items-center gap-1.5">
                                                            <Calendar className="h-3 w-3" />
                                                            <span>{application.latest_interview.scheduled_at_label}</span>
                                                        </p>
                                                        <p className="flex items-center gap-1.5">
                                                            <Clock3 className="h-3 w-3" />
                                                            <span>{application.latest_interview.meeting_type.replace('_', ' ')}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>

                                        {/* Right: Actions Grid */}
                                        <div className="lg:w-64 flex flex-col justify-end gap-3 lg:border-l lg:border-zinc-100 lg:pl-5">
                                            <div className="grid grid-cols-2 gap-2">
                                                <button 
                                                    onClick={() => updateStatus(application.id, 'shortlisted')} 
                                                    className="flex flex-col items-center justify-center gap-1 p-2 border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 text-[9px] font-bold uppercase tracking-widest transition-all rounded-sm"
                                                >
                                                    <BookmarkPlus className="h-4 w-4" /> Shortlist
                                                </button>
                                                <Link 
                                                    href={`/employer/candidates/${application.id}#schedule-interview`} 
                                                    className="flex flex-col items-center justify-center gap-1 p-2 border border-violet-200 text-violet-600 bg-violet-50 hover:bg-violet-100 text-[9px] font-bold uppercase tracking-widest transition-all rounded-sm text-center"
                                                >
                                                    <Calendar className="h-4 w-4" /> Schedule
                                                </Link>
                                                <button 
                                                    onClick={() => updateStatus(application.id, 'offered')} 
                                                    className="flex flex-col items-center justify-center gap-1 p-2 border border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-[9px] font-bold uppercase tracking-widest transition-all rounded-sm"
                                                >
                                                    <CheckCircle2 className="h-4 w-4" /> Offer
                                                </button>
                                                <button 
                                                    onClick={() => updateStatus(application.id, 'rejected')} 
                                                    className="flex flex-col items-center justify-center gap-1 p-2 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 text-[9px] font-bold uppercase tracking-widest transition-all rounded-sm"
                                                >
                                                    <XCircle className="h-4 w-4" /> Reject
                                                </button>
                                            </div>
                                            <Link href={`/employer/candidates/${application.id}`}>
                                                <Button className="w-full py-4 h-auto bg-black text-white text-[9px] font-bold uppercase tracking-widest rounded-sm hover:bg-zinc-800 transition-all flex items-center justify-center gap-1.5 mt-1">
                                                    <ExternalLink className="h-3 w-3" /> View Profile
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Pagination */}
                            <div className="mt-12 flex items-center justify-between border-t border-zinc-200 pt-6">
                                <div className="flex items-center gap-3">
                                    {applications.links.map((link, index) => {
                                        if (link.label.includes('Previous')) {
                                            return (
                                                <a key={index} href={link.url ?? '#'} className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${link.url ? 'text-zinc-500 hover:text-black' : 'text-zinc-300 cursor-not-allowed'}`}>
                                                    <ArrowLeft className="h-3 w-3" /> Prev
                                                </a>
                                            );
                                        }

                                        if (link.label.includes('Next')) {
                                            return (
                                                <a key={index} href={link.url ?? '#'} className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ml-4 ${link.url ? 'text-zinc-500 hover:text-black' : 'text-zinc-300 cursor-not-allowed'}`}>
                                                    Next <ArrowRight className="h-3 w-3" />
                                                </a>
                                            );
                                        }

                                        return (
                                            <a
                                                key={index}
                                                href={link.url ?? '#'}
                                                className={`flex h-7 w-7 items-center justify-center rounded-sm text-[10px] font-bold transition-colors ${
                                                    link.active ? 'bg-black text-white' : 'text-zinc-500 hover:bg-zinc-100 hover:text-black'
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

const underlinedInput = "w-full appearance-none border-0 border-b border-zinc-200 bg-transparent px-0 py-1.5 text-xs font-semibold text-black outline-none transition-all placeholder:font-medium placeholder:text-zinc-400 focus:border-black focus:ring-0";