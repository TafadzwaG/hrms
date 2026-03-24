import { Link, router, usePage } from '@inertiajs/react';
import { 
    ArrowLeft, 
    ArrowRight, 
    Calendar, 
    Clock3, 
    Search, 
    CheckCircle2, 
    XCircle, 
    ExternalLink, 
    Filter,
    MapPin
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { EmployerEmptyState, EmployerHubLayout, EmployerStatusBadge } from './components/hub';
import type { Company, EmployerInterview, User } from './dummyData';

type PageProps = {
    company: Company;
    user: User;
    interviews: {
        data: EmployerInterview[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        search?: string | null;
        status?: string | null;
    };
    statuses: string[];
};

const underlinedInput =
    'w-full appearance-none border-0 border-b border-zinc-200 bg-transparent px-0 py-1.5 text-xs font-semibold text-black outline-none transition-all placeholder:font-medium placeholder:text-zinc-400 focus:border-black focus:ring-0';

export default function EmployerInterviewsPage() {
    const { company, user, interviews, filters, statuses } = usePage<PageProps>().props;

    const updateInterview = (interviewId: number, status: 'cancelled' | 'completed') => {
        if(window.confirm(`Are you sure you want to mark this interview as ${status}?`)) {
            router.patch(`/employer/interviews/${interviewId}`, { status }, { preserveScroll: true });
        }
    };

    return (
        <EmployerHubLayout
            title="Interviews"
            active="interviews"
            subtitle='Manage interviews'
            company={company}
            user={user}
        >
            <div className="w-full px-4 md:px-6">
                {/* Page Title */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-1">Interviews.</h1>
                    <p className="max-w-2xl text-xs font-medium text-zinc-500">
                        Manage interview schedules, candidate responses, and the active interview calendar.
                    </p>
                </div>

                {/* Filter Section */}
                <section className="mb-8 rounded-sm border border-zinc-200 bg-zinc-50 p-5 shadow-sm">
                    <form method="get" action="/employer/interviews" className="grid grid-cols-1 items-end gap-5 md:grid-cols-12">
                        <div className="md:col-span-5">
                            <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">Search</label>
                            <div className="relative group">
                                <Search className="absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400 group-focus-within:text-black transition-colors" />
                                <input 
                                    name="search" 
                                    defaultValue={filters.search ?? ''} 
                                    className={`${underlinedInput} pl-6`} 
                                    placeholder="Candidate or vacancy..." 
                                />
                            </div>
                        </div>

                        <div className="md:col-span-4">
                            <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">Status</label>
                            <select name="status" defaultValue={filters.status ?? ''} className={underlinedInput}>
                                <option value="">All statuses</option>
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status.replace(/_/g, ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-3">
                            <Button className="w-full rounded-sm bg-black py-4 h-auto text-[10px] font-bold uppercase tracking-widest text-white hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2">
                                <Filter className="h-3.5 w-3.5" /> Apply Filters
                            </Button>
                        </div>
                    </form>
                </section>

                {/* Interviews List */}
                {interviews.data.length > 0 ? (
                    <div className="space-y-4">
                        {interviews.data.map((interview) => (
                            <div key={interview.id} className="rounded-sm border border-zinc-200 bg-white p-5 transition-all hover:border-black shadow-sm relative overflow-hidden group">
                                {/* Subtle left border accent indicating status */}
                                <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${
                                    interview.status === 'completed' ? 'bg-emerald-500' : 
                                    interview.status === 'cancelled' ? 'bg-red-500' : 
                                    'bg-black opacity-0 group-hover:opacity-100'
                                }`}></div>

                                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
                                            <h2 className="text-lg font-black tracking-tight text-black uppercase">{interview.candidate_name}</h2>
                                            <EmployerStatusBadge status={interview.status_label ?? interview.status} />
                                        </div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{interview.vacancy_title}</p>
                                    </div>

                                    <Link href={`/employer/candidates/${interview.application_id}`}>
                                        <Button variant="outline" className="h-auto py-2 px-4 rounded-sm border-zinc-200 text-[9px] font-bold uppercase tracking-widest text-zinc-600 hover:border-black hover:text-black transition-colors flex items-center gap-1.5">
                                            <ExternalLink className="h-3 w-3" /> View Profile
                                        </Button>
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_240px]">
                                    <div>
                                        <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                            <span className="inline-flex items-center gap-1.5">
                                                <Calendar className="h-3 w-3" />
                                                {interview.scheduled_at_label}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5">
                                                <Clock3 className="h-3 w-3" />
                                                {interview.meeting_type.replace('_', ' ')}
                                            </span>
                                            {interview.location ? (
                                                <span className="inline-flex items-center gap-1.5">
                                                    <MapPin className="h-3 w-3" />
                                                    <span className="truncate max-w-[150px]">{interview.location}</span>
                                                </span>
                                            ) : null}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {interview.instructions ? (
                                                <div className="rounded-sm border border-zinc-100 bg-zinc-50 p-3">
                                                    <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">Instructions</p>
                                                    <p className="text-xs leading-relaxed text-zinc-600 italic">"{interview.instructions}"</p>
                                                </div>
                                            ) : null}

                                            {interview.responded_at_label || interview.candidate_response_note ? (
                                                <div className="rounded-sm border border-zinc-100 bg-white p-3">
                                                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">Candidate Response</p>
                                                    <p className="mt-1 text-[10px] font-bold text-black uppercase tracking-widest">{interview.responded_at_label || 'Pending response'}</p>
                                                    {interview.candidate_response_note ? (
                                                        <p className="mt-1.5 text-xs leading-relaxed text-zinc-600">"{interview.candidate_response_note}"</p>
                                                    ) : null}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>

                                    {/* Action Buttons with Colors and Icons */}
                                    <div className="flex flex-col gap-2 justify-end border-t border-zinc-100 pt-4 md:border-t-0 md:pt-0 md:border-l md:pl-6">
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            disabled={interview.status === 'completed'} 
                                            onClick={() => updateInterview(interview.id, 'completed')} 
                                            className="w-full h-auto py-2.5 rounded-sm border-emerald-200 text-[9px] font-bold uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors disabled:opacity-50 disabled:bg-transparent flex items-center justify-center gap-1.5"
                                        >
                                            <CheckCircle2 className="h-3.5 w-3.5" /> Mark Completed
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            disabled={interview.status === 'cancelled'} 
                                            onClick={() => updateInterview(interview.id, 'cancelled')} 
                                            className="w-full h-auto py-2.5 rounded-sm border-red-200 text-[9px] font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors disabled:opacity-50 disabled:bg-transparent flex items-center justify-center gap-1.5"
                                        >
                                            <XCircle className="h-3.5 w-3.5" /> Cancel Interview
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        <div className="mt-12 flex items-center justify-between border-t border-zinc-200 pt-6">
                            <div className="flex items-center gap-3">
                                {interviews.links.map((link, index) => {
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
                    <EmployerEmptyState message="No interviews match the current filters." />
                )}
            </div>
        </EmployerHubLayout>
    );
}