import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    employerBreadcrumbs,
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
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '__all__');
    const [vacancyFilter, setVacancyFilter] = useState(filters.vacancy_id?.toString() ?? '__all__');

    const updateStatus = (applicationId: number, status: string) => {
        router.patch(`/employer/candidates/${applicationId}/status`, { status }, { preserveScroll: true });
    };

    return (
        <EmployerHubLayout
            title="Candidates"
            active="candidates"
            subtitle='Candidate listings'
            company={company}
            user={user}
            breadcrumbs={employerBreadcrumbs('Candidates')}
        >
            <div className="space-y-6">
                {/* Filter Applicants Section */}
                <section className="rounded-lg border border-border/70 bg-background/95 p-5 shadow-sm">
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
                            <input type="hidden" name="status" value={statusFilter === '__all__' ? '' : statusFilter} />
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className={selectTriggerClass}>
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="__all__">All Statuses</SelectItem>
                                {statuses.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status.replace(/_/g, ' ')}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-1.5 md:col-span-3">
                            <label className="text-[9px] uppercase font-bold tracking-[0.2em] text-zinc-500">Vacancy</label>
                            <input type="hidden" name="vacancy_id" value={vacancyFilter === '__all__' ? '' : vacancyFilter} />
                            <Select value={vacancyFilter} onValueChange={setVacancyFilter}>
                                <SelectTrigger className={selectTriggerClass}>
                                    <SelectValue placeholder="All Vacancies" />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="__all__">All Vacancies</SelectItem>
                                {vacancies.map((vacancy) => (
                                    <SelectItem key={vacancy.id} value={String(vacancy.id)}>
                                        {vacancy.title}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
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
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => updateStatus(application.id, 'shortlisted')} 
                                                    className="h-auto flex-col gap-1 rounded-sm border-blue-200 bg-blue-50 py-2 text-[9px] font-bold uppercase tracking-widest text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                                                >
                                                    <BookmarkPlus className="h-4 w-4" /> Shortlist
                                                </Button>
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-auto flex-col gap-1 rounded-sm border-violet-200 bg-violet-50 py-2 text-[9px] font-bold uppercase tracking-widest text-violet-600 hover:bg-violet-100 hover:text-violet-700"
                                                >
                                                    <Link href={`/employer/candidates/${application.id}#schedule-interview`}>
                                                        <Calendar className="h-4 w-4" /> Schedule
                                                    </Link>
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => updateStatus(application.id, 'offered')} 
                                                    className="h-auto flex-col gap-1 rounded-sm border-emerald-200 bg-emerald-50 py-2 text-[9px] font-bold uppercase tracking-widest text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700"
                                                >
                                                    <CheckCircle2 className="h-4 w-4" /> Offer
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => updateStatus(application.id, 'rejected')} 
                                                    className="h-auto flex-col gap-1 rounded-sm border-red-200 bg-red-50 py-2 text-[9px] font-bold uppercase tracking-widest text-red-600 hover:bg-red-100 hover:text-red-700"
                                                >
                                                    <XCircle className="h-4 w-4" /> Reject
                                                </Button>
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

const underlinedInput = "w-full appearance-none border-0 border-b border-zinc-200 bg-transparent px-0 py-1.5 text-xs text-black outline-none transition-all placeholder:text-zinc-400 focus:border-black focus:ring-0";
const selectTriggerClass = "h-auto w-full rounded-none border-0 border-b border-zinc-200 bg-transparent px-0 py-1.5 text-xs text-black shadow-none focus:ring-0 focus:ring-offset-0";
