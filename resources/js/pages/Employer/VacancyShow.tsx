import { Link, router, usePage } from '@inertiajs/react';
import { 
    Briefcase, 
    Calendar, 
    Target, 
    CheckCircle2, 
    CircleDot,
    Edit2,
    Eye,
    EyeOff,
    Tag,
    MapPin,
    Users,
    Clock3,
    BookmarkPlus,
    XCircle,
    ExternalLink
} from 'lucide-react';

import { RichTextContent } from '@/components/rich-text';
import { Button } from '@/components/ui/button';
import {
    EmployerEmptyState,
    EmployerHubLayout,
    EmployerStatusBadge
} from './components/hub';
import type { Company, RecentApplication, User, Vacancy } from './dummyData';

type PageProps = {
    company: Company;
    user?: User;
    vacancy: Vacancy;
    applications: RecentApplication[]; // Restored to standard array
};

export default function EmployerVacancyShowPage() {
    const { company, vacancy, applications } = usePage<PageProps>().props;
    const user = usePage<{ user?: User }>().props.user ?? { name: 'Employer User', email: company.email ?? '' };

    const updateStatus = (applicationId: number, status: string) => {
        router.patch(`/employer/applications/${applicationId}/status`, { status }, { preserveScroll: true });
    };

    return (
        <EmployerHubLayout
            title={vacancy.title}
            subtitle="View vacancy details and application pipeline."
            active="vacancies"
            company={company}
            user={user}
        >
            <div className="w-full px-6 md:px-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl font-black tracking-tighter leading-none text-black mb-1.5 uppercase">{vacancy.title}</h2>
                        <p className="text-zinc-500 text-xs font-medium">Vacancy overview and application pipeline.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={`/employer/vacancies/${vacancy.id}/edit`}>
                            <Button variant="outline" className="px-4 py-2.5 h-auto border-zinc-200 hover:bg-zinc-50 text-black font-bold text-[9px] tracking-widest uppercase transition-all rounded-sm flex items-center gap-1.5">
                                <Edit2 className="h-3 w-3" /> Edit
                            </Button>
                        </Link>
                        <Button 
                            onClick={() => router.patch(`/employer/vacancies/${vacancy.id}/status`, { status: vacancy.status_code === 'published' ? 'draft' : 'published' })}
                            className={`px-4 py-2.5 h-auto font-bold text-[9px] tracking-widest uppercase transition-all rounded-sm flex items-center gap-1.5 ${
                                vacancy.status_code === 'published' 
                                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                                : 'bg-emerald-500 text-white hover:bg-emerald-600'
                            }`}
                        >
                            {vacancy.status_code === 'published' ? (
                                <><EyeOff className="h-3 w-3" /> Unpublish</>
                            ) : (
                                <><Eye className="h-3 w-3" /> Publish</>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Vacancy Details */}
                    <div className="lg:col-span-7 space-y-6">
                        <section className="bg-white p-5 border border-zinc-200 rounded-sm shadow-sm">
                            <div className="flex items-center justify-between gap-3 mb-5 border-b border-zinc-100 pb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-zinc-100 flex items-center justify-center rounded-sm shrink-0">
                                        <Briefcase className="text-black h-4 w-4" />
                                    </div>
                                    <h3 className="text-sm font-bold tracking-tight text-black uppercase">Vacancy Details</h3>
                                </div>
                                <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-sm flex items-center gap-1 border ${
                                    vacancy.status_code === 'published' 
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                                    : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                                }`}>
                                    {vacancy.status_code === 'published' ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                    {vacancy.status}
                                </span>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-2 py-1 bg-zinc-100 text-zinc-600 text-[9px] font-bold uppercase tracking-widest rounded-sm flex items-center gap-1.5">
                                    <Tag className="h-3 w-3" /> {vacancy.department || 'General'}
                                </span>
                                <span className="px-2 py-1 bg-zinc-100 text-zinc-600 text-[9px] font-bold uppercase tracking-widest rounded-sm flex items-center gap-1.5">
                                    <MapPin className="h-3 w-3" /> {vacancy.location || 'Remote'}
                                </span>
                            </div>

                            {vacancy.description && (
                                <RichTextContent html={vacancy.description} className="mt-4 text-xs leading-6 text-zinc-600" />
                            )}
                        </section>

                        {vacancy.requirements && (
                            <section className="p-5 bg-zinc-50 rounded-sm border border-zinc-200">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">Requirements</h4>
                                <RichTextContent html={vacancy.requirements} className="text-xs leading-6 text-zinc-700" />
                            </section>
                        )}

                        {vacancy.responsibilities && (
                            <section className="p-5 bg-zinc-50 rounded-sm border border-zinc-200">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">Responsibilities</h4>
                                <RichTextContent html={vacancy.responsibilities} className="text-xs leading-6 text-zinc-700" />
                            </section>
                        )}
                    </div>

                    {/* Right Column: Applications */}
                    <div className="lg:col-span-5">
                        <div className="flex items-center justify-between mb-5 border-b border-zinc-200 pb-3">
                            <div className="flex items-center gap-2">
                                <Users className="text-black h-4 w-4" />
                                <h3 className="text-sm font-bold tracking-tight text-black uppercase">Active Pipeline</h3>
                            </div>
                            {/* Fixed the .length reference here */}
                            <span className="text-[9px] font-bold text-zinc-400 tracking-widest uppercase">{applications.length} Total</span>
                        </div>

                        <div className="space-y-3">
                            {/* Fixed the mapping here to iterate over the array directly */}
                            {applications.length > 0 ? (
                                <>
                                    {applications.map((application) => (
                                        <div
                                            key={application.id}
                                            className="group bg-white p-5 border border-zinc-200 hover:border-black transition-all duration-300 rounded-sm shadow-sm relative overflow-hidden"
                                        >
                                            {/* Status Accent Border on Hover */}
                                            <div className="absolute top-0 left-0 w-1 h-full bg-black opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                            <div className="flex flex-col lg:flex-row gap-5">
                                                {/* Left: Profile Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <h3 className="text-base font-black tracking-tight text-black uppercase truncate">{application.candidate_name}</h3>
                                                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest truncate">{application.candidate_headline}</p>
                                                        </div>
                                                        <EmployerStatusBadge status={application.status} />
                                                    </div>
                                                    
                                                    <div className="flex flex-wrap gap-x-3 gap-y-2 mb-4 border-b border-zinc-100 pb-3">
                                                        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                                                            <Calendar className="h-3 w-3" />
                                                            <span>{application.applied_at}</span>
                                                        </div>
                                                        {application.match_score && (
                                                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-sm">
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
                                                                {application.match.reasons.slice(0, 2).map((reason, idx) => (
                                                                    <li key={idx} className="flex items-start gap-1.5 text-[10px] leading-relaxed text-zinc-600 font-medium">
                                                                        <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
                                                                        <span>{reason}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ) : null}

                                                    {application.latest_interview ? (
                                                        <div className="mb-3 rounded-sm border border-zinc-100 bg-white p-3 shadow-sm">
                                                            <div className="mb-1.5 flex items-center justify-between gap-3">
                                                                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">Latest Interview</p>
                                                                <EmployerStatusBadge status={application.latest_interview.status_label ?? application.latest_interview.status} />
                                                            </div>
                                                            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
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

                                                    {application.cover_letter && (
                                                        <div className="p-3 bg-zinc-50 rounded-sm border-l-2 border-black">
                                                            <p className="text-[10px] leading-relaxed text-zinc-600 italic line-clamp-2">
                                                                "{application.cover_letter}"
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Right: Actions Grid */}
                                                <div className="lg:w-48 flex flex-col justify-between gap-3 shrink-0">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <button 
                                                            onClick={() => updateStatus(application.id, 'shortlisted')} 
                                                            className="flex flex-col items-center justify-center gap-1 p-2 border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 text-[9px] font-bold uppercase tracking-widest transition-all rounded-sm"
                                                        >
                                                            <BookmarkPlus className="h-3.5 w-3.5" /> Shortlist
                                                        </button>
                                                        <Link 
                                                            href={`/employer/candidates/${application.id}#schedule-interview`} 
                                                            className="flex flex-col items-center justify-center gap-1 p-2 border border-violet-200 text-violet-600 bg-violet-50 hover:bg-violet-100 text-[9px] font-bold uppercase tracking-widest transition-all rounded-sm text-center"
                                                        >
                                                            <Calendar className="h-3.5 w-3.5" /> Schedule
                                                        </Link>
                                                        <button 
                                                            onClick={() => updateStatus(application.id, 'offered')} 
                                                            className="flex flex-col items-center justify-center gap-1 p-2 border border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-[9px] font-bold uppercase tracking-widest transition-all rounded-sm"
                                                        >
                                                            <CheckCircle2 className="h-3.5 w-3.5" /> Offer
                                                        </button>
                                                        <button 
                                                            onClick={() => updateStatus(application.id, 'rejected')} 
                                                            className="flex flex-col items-center justify-center gap-1 p-2 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 text-[9px] font-bold uppercase tracking-widest transition-all rounded-sm"
                                                        >
                                                            <XCircle className="h-3.5 w-3.5" /> Reject
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
                                    
                                    <Link href={`/employer/candidates?vacancy_id=${vacancy.id}`} className="block w-full">
                                        <button className="w-full mt-2 py-3 border border-dashed border-zinc-300 text-zinc-500 hover:text-black hover:border-black text-[9px] font-bold uppercase tracking-widest transition-all rounded-sm bg-zinc-50/50 hover:bg-zinc-50">
                                            View Full Pipeline
                                        </button>
                                    </Link>
                                </>
                            ) : (
                                <EmployerEmptyState message="No applicants yet for this vacancy." />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </EmployerHubLayout>
    );
}

function getInitials(name?: string | null): string {
    if (!name) return 'EX';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}
