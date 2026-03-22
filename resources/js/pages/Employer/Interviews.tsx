import { Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Calendar, Clock3, Search } from 'lucide-react';

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
    'w-full appearance-none border-0 border-b border-zinc-200 bg-transparent px-0 py-2.5 text-sm font-semibold text-black outline-none transition-all placeholder:font-medium placeholder:text-zinc-300 focus:border-black focus:ring-0';

export default function EmployerInterviewsPage() {
    const { company, user, interviews, filters, statuses } = usePage<PageProps>().props;

    const updateInterview = (interviewId: number, status: 'cancelled' | 'completed') => {
        router.patch(`/employer/interviews/${interviewId}`, { status }, { preserveScroll: true });
    };

    return (
        <EmployerHubLayout
            title="Interviews"
            subtitle="Manage interview schedules, candidate responses, and the active interview calendar."
            active="interviews"
            company={company}
            user={user}
        >
            <div className="w-full px-6 md:px-10">
                <div className="mb-10">
                    <h1 className="mb-2 text-5xl font-extrabold tracking-tighter text-black">Interviews</h1>
                    <p className="max-w-2xl font-medium text-zinc-500">
                        Manage interview schedules, candidate responses, and the active interview calendar.
                    </p>
                </div>

                <section className="mb-12 rounded-lg border border-zinc-200 bg-zinc-50 p-8">
                    <form method="get" action="/employer/interviews" className="grid grid-cols-1 items-end gap-6 md:grid-cols-4">
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Search Interviews</label>
                            <div className="relative">
                                <Search className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                <input name="search" defaultValue={filters.search ?? ''} className={`${underlinedInput} pl-8`} placeholder="Candidate or vacancy" />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status</label>
                            <select name="status" defaultValue={filters.status ?? ''} className={underlinedInput}>
                                <option value="">All statuses</option>
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status.replace(/_/g, ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <Button className="rounded-none bg-black py-6 text-xs font-bold uppercase tracking-widest text-white hover:bg-zinc-800">
                            Apply Filters
                        </Button>
                    </form>
                </section>

                {interviews.data.length > 0 ? (
                    <div className="space-y-6">
                        {interviews.data.map((interview) => (
                            <div key={interview.id} className="rounded-sm border border-zinc-200 bg-white p-8 transition-all hover:border-black">
                                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div>
                                        <div className="mb-2 flex flex-wrap items-center gap-3">
                                            <h2 className="text-2xl font-bold tracking-tight text-black">{interview.candidate_name}</h2>
                                            <EmployerStatusBadge status={interview.status_label ?? interview.status} />
                                        </div>
                                        <p className="text-sm font-medium text-zinc-500">{interview.vacancy_title}</p>
                                    </div>

                                    <Link href={`/employer/candidates/${interview.application_id}`}>
                                        <Button variant="outline" className="rounded-sm border-zinc-200 text-xs font-bold uppercase tracking-widest">
                                            View Full Profile
                                        </Button>
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_280px]">
                                    <div>
                                        <div className="mb-4 flex flex-wrap gap-4 text-xs font-semibold text-zinc-500">
                                            <span className="inline-flex items-center gap-2">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {interview.scheduled_at_label}
                                            </span>
                                            <span className="inline-flex items-center gap-2">
                                                <Clock3 className="h-3.5 w-3.5" />
                                                {interview.meeting_type}
                                            </span>
                                            {interview.location ? <span>{interview.location}</span> : null}
                                        </div>

                                        {interview.instructions ? (
                                            <div className="rounded-sm border border-zinc-200 bg-zinc-50 p-4">
                                                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Interview Instructions</p>
                                                <p className="text-sm leading-6 text-zinc-600">{interview.instructions}</p>
                                            </div>
                                        ) : null}

                                        {interview.responded_at_label || interview.candidate_response_note ? (
                                            <div className="mt-4 rounded-sm border border-zinc-200 bg-white p-4">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Candidate Response</p>
                                                <p className="mt-1 text-xs font-semibold text-zinc-500">{interview.responded_at_label || 'Pending response'}</p>
                                                {interview.candidate_response_note ? (
                                                    <p className="mt-2 text-sm leading-6 text-zinc-600">{interview.candidate_response_note}</p>
                                                ) : null}
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className="space-y-3">
                                        <Button type="button" variant="outline" disabled={interview.status === 'completed'} onClick={() => updateInterview(interview.id, 'completed')} className="w-full rounded-sm border-zinc-200 text-xs font-bold uppercase tracking-widest">
                                            Mark Completed
                                        </Button>
                                        <Button type="button" variant="outline" disabled={interview.status === 'cancelled'} onClick={() => updateInterview(interview.id, 'cancelled')} className="w-full rounded-sm border-zinc-200 text-xs font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 hover:text-red-600">
                                            Cancel Interview
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="mt-16 flex items-center justify-between border-t border-zinc-200 pt-8">
                            <div className="flex items-center gap-4">
                                {interviews.links.map((link, index) => {
                                    if (link.label.includes('Previous')) {
                                        return (
                                            <a key={index} href={link.url ?? '#'} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 transition-colors hover:text-black">
                                                <ArrowLeft className="h-4 w-4" /> Previous
                                            </a>
                                        );
                                    }

                                    if (link.label.includes('Next')) {
                                        return (
                                            <a key={index} href={link.url ?? '#'} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 transition-colors hover:text-black">
                                                Next <ArrowRight className="h-4 w-4" />
                                            </a>
                                        );
                                    }

                                    return (
                                        <a
                                            key={index}
                                            href={link.url ?? '#'}
                                            className={`flex h-8 w-8 items-center justify-center rounded text-xs font-bold transition-colors ${
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
                    <EmployerEmptyState message="No interviews match the current filters." />
                )}
            </div>
        </EmployerHubLayout>
    );
}
