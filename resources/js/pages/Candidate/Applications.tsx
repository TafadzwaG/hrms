import { Link, router, usePage } from '@inertiajs/react';
import { Briefcase, Calendar, MapPin, Search, Clock, FileText, Download, ArrowLeft, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { useState } from 'react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    CandidateEmptyState,
    CandidateHubLayout,
    formatCandidateDate,
} from './components/hub';
import type { CandidateApplication, CandidateInterview, CandidateUser } from './dummyData';

type PageProps = {
    candidate: CandidateUser;
    applications: {
        data: CandidateApplication[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        status?: string;
        search?: string;
    };
    statuses: string[];
    flash?: {
        success?: string | null;
        error?: string | null;
    };
};

const getStatusStyles = (status: string) => {
    const normalized = status.toLowerCase();
    if (['shortlisted', 'interview', 'offered', 'hired'].includes(normalized)) {
        return { border: 'border-black', badge: 'bg-black text-white', opacity: 'opacity-100' };
    }
    if (['rejected', 'withdrawn'].includes(normalized)) {
        return { border: 'border-red-500', badge: 'bg-red-50 text-red-600', opacity: 'opacity-70' };
    }
    return { border: 'border-zinc-300', badge: 'bg-zinc-200 text-zinc-700', opacity: 'opacity-100' };
};

export default function CandidateApplicationsPage() {
    const { candidate, applications, filters, statuses, flash } = usePage<PageProps>().props;
    const [pendingWithdrawId, setPendingWithdrawId] = useState<number | null>(null);
    const pendingWithdrawApplication =
        applications.data.find((application) => application.id === pendingWithdrawId) ?? null;

    const handleFilterChange = (key: string, value: string) => {
        const query = new URLSearchParams(window.location.search);
        if (value) {
            query.set(key, value);
        } else {
            query.delete(key);
        }
        router.get(`/candidate/applications?${query.toString()}`, {}, { preserveState: true });
    };

    const confirmWithdrawApplication = () => {
        if (!pendingWithdrawId) {
            return;
        }

        router.patch(`/candidate/applications/${pendingWithdrawId}/withdraw`, {}, {
            preserveScroll: true,
            onFinish: () => setPendingWithdrawId(null),
        });
    };

    return (
        <CandidateHubLayout
            title="My Applications"
            active="applications"
            subtitle='Review your current status, interview schedules, and historical submissions.'
            candidate={candidate}
        >
            <div className="w-full px-4 md:px-8">
                {/* Page Title */}
                <div className="mb-6">
                    <h2 className="text-4xl font-black tracking-tighter leading-none text-black mb-2 uppercase">Applications.</h2>
                    <p className="text-zinc-500 text-sm font-medium max-w-xl">Track and manage your professional journey. </p>
                </div>

                {flash?.success && (
                    <div className="mb-6 flex items-center gap-3 rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700 uppercase tracking-widest">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}

                {flash?.error && (
                    <div className="mb-6 flex items-center gap-3 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700 uppercase tracking-widest">
                        <XCircle className="h-4 w-4 shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Filter Section */}
                <section className="bg-zinc-50 p-6 border border-zinc-200 rounded-sm mb-10 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                        <div className="md:col-span-6">
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-2">Search Keywords</label>
                            <div className="relative group">
                                <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-black transition-colors" />
                                <input
                                    defaultValue={filters.search ?? ''}
                                    onBlur={(e) => handleFilterChange('search', e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleFilterChange('search', e.currentTarget.value)}
                                    placeholder="Role, company or location..."
                                    className={`${underlinedInput} pl-8`}
                                />
                            </div>
                        </div>
                        
                        <div className="md:col-span-4">
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-2">Filter by Status</label>
                            <select
                                defaultValue={filters.status ?? ''}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className={underlinedInput}
                            >
                                <option value="">All statuses</option>
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status.replace(/_/g, ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="md:col-span-2">
                            <Link href="/candidate/jobs" className="block w-full">
                                <Button type="button" className="w-full bg-black text-white py-5 h-auto rounded-sm font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-800 transition-colors">
                                    Browse Jobs
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Application History List */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between px-1 border-b border-zinc-200 pb-3">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Application History ({applications.data.length})</h3>
                    </div>

                    {applications.data.length > 0 ? (
                        <div className="space-y-4">
                            {applications.data.map((application) => {
                                const styles = getStatusStyles(application.status);
                                
                                return (
                                    <div key={application.id} className={`group bg-white hover:bg-zinc-50 border border-zinc-200 transition-all duration-300 rounded-sm overflow-hidden shadow-sm ${styles.opacity}`}>
                                        <div className={`p-5 border-l-4 ${styles.border}`}>
                                            
                                            {/* Header */}
                                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h4 className="text-lg font-black tracking-tight text-black uppercase">{application.vacancy_title}</h4>
                                                        <span className={`${styles.badge} text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest`}>
                                                            {application.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-bold text-zinc-500">{application.company_name}</p>
                                                </div>
                                                {(application.salary_min || application.salary_max) && (
                                                    <div className="bg-zinc-100 px-3 py-1.5 rounded-sm border border-zinc-200">
                                                        <span className="text-[10px] font-black text-black font-mono tracking-widest uppercase">
                                                            {application.currency ?? 'USD'} {application.salary_min ?? 'N/A'} - {application.salary_max ?? 'N/A'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                                <div className="space-y-3">
                                                    {application.location && (
                                                        <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                                                            <MapPin className="h-3.5 w-3.5" />
                                                            <span>{application.location}</span>
                                                        </div>
                                                    )}
                                                    {application.employment_type && (
                                                        <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            <span>{application.employment_type}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        <span>Applied {formatCandidateDate(application.applied_at)}</span>
                                                    </div>
                                                </div>

                                                {(application.cover_letter || application.resume) && (
                                                    <div className="md:col-span-2 space-y-4 border-l border-zinc-200 pl-0 md:pl-6">
                                                        {application.cover_letter && (
                                                            <div className="space-y-1">
                                                                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">Cover Letter Extract</p>
                                                                <p className="text-xs text-zinc-600 leading-relaxed italic line-clamp-2">"{application.cover_letter}"</p>
                                                            </div>
                                                        )}
                                                        
                                                        {application.resume && (
                                                            <div className="flex items-center gap-3 bg-zinc-50 p-2.5 rounded-sm border border-zinc-200">
                                                                <FileText className="text-black h-4 w-4" />
                                                                <div>
                                                                    <p className="text-[11px] font-bold text-black uppercase tracking-wider">{application.resume.file_name}</p>
                                                                </div>
                                                                {application.resume.download_url && (
                                                                    <a href={application.resume.download_url} className="ml-auto text-black hover:bg-zinc-200 p-1.5 rounded-sm transition-colors">
                                                                        <Download className="h-3.5 w-3.5" />
                                                                    </a>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Footer Actions */}
                                            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                                                <button 
                                                    onClick={() => setPendingWithdrawId(application.id)}
                                                    disabled={['withdrawn', 'rejected', 'hired'].includes(application.status)}
                                                    className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:bg-zinc-100 hover:text-black border border-transparent rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Withdraw
                                                </button>
                                                <Link href={`/candidate/jobs/${application.vacancy_id}`}>
                                                    <button className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest bg-black text-white rounded-sm hover:bg-zinc-800 transition-all">
                                                        View Job
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <CandidateEmptyState message="No applications match the current filters." />
                    )}
                </section>

                {/* Pagination */}
                {applications.links && applications.links.length > 3 && (
                    <nav className="mt-12 flex items-center justify-between border-t border-zinc-200 pt-6 pb-10">
                        <div className="flex-1 flex justify-start">
                            {applications.links[0].url ? (
                                <Link href={applications.links[0].url} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-black transition-colors">
                                    <ArrowLeft className="h-3.5 w-3.5" /> Prev
                                </Link>
                            ) : (
                                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 cursor-not-allowed">
                                    <ArrowLeft className="h-3.5 w-3.5" /> Prev
                                </span>
                            )}
                        </div>
                        
                        <div className="hidden md:flex items-center gap-1.5">
                            {applications.links.slice(1, -1).map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url ?? '#'}
                                    className={`w-8 h-8 flex items-center justify-center rounded-sm font-bold text-xs transition-colors ${
                                        link.active ? 'bg-black text-white' : 'text-zinc-500 hover:bg-zinc-100 hover:text-black'
                                    } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>

                        <div className="flex-1 flex justify-end">
                            {applications.links[applications.links.length - 1].url ? (
                                <Link href={applications.links[applications.links.length - 1].url!} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-black transition-colors">
                                    Next <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            ) : (
                                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 cursor-not-allowed">
                                    Next <ArrowRight className="h-3.5 w-3.5" />
                                </span>
                            )}
                        </div>
                    </nav>
                )}
            </div>

            {/* Withdraw Modal */}
            <AlertDialog open={pendingWithdrawId !== null} onOpenChange={(open) => !open && setPendingWithdrawId(null)}>
                <AlertDialogContent className="border-zinc-200 bg-white rounded-sm">
                    <AlertDialogHeader>
                        <AlertDialogMedia className="bg-red-50 text-red-600 rounded-sm">
                            <XCircle className="h-8 w-8" />
                        </AlertDialogMedia>
                        <AlertDialogTitle className="text-xl font-black tracking-tight text-black uppercase">
                            Withdraw application?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-xs font-medium leading-relaxed text-zinc-500">
                            {pendingWithdrawApplication
                                ? `This will withdraw your application for ${pendingWithdrawApplication.vacancy_title} at ${pendingWithdrawApplication.company_name}. Any active interviews linked to this application will be cancelled.`
                                : 'This will withdraw the selected application and cancel any active interviews linked to it.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 sm:gap-0 mt-4">
                        <AlertDialogCancel className="border-zinc-200 text-black hover:bg-zinc-50 rounded-sm text-[10px] font-bold uppercase tracking-widest h-10">
                            Keep Application
                        </AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700 rounded-sm text-[10px] font-bold uppercase tracking-widest h-10"
                            onClick={confirmWithdrawApplication}
                        >
                            Withdraw
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </CandidateHubLayout>
    );
}

// Ensure the generic input style matches the dense aesthetic
const underlinedInput = "w-full bg-transparent border-0 border-b border-zinc-200 focus:ring-0 focus:border-black px-0 py-2 transition-all text-sm font-semibold text-black placeholder:text-zinc-300 placeholder:font-medium appearance-none outline-none";

/* Optional Interview Card - Currently decoupled in original code but formatted for consistency */
export function InterviewCard({ interview }: { interview: CandidateInterview }) {
    const respond = (response: 'accepted' | 'rejected') => {
        router.patch(
            interview.response_url ?? `/candidate/interviews/${interview.id}/response`,
            { response },
            { preserveScroll: true },
        );
    };

    return (
        <div className="rounded-sm border border-zinc-200 bg-white p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-bold text-black">{interview.scheduled_at_label ?? interview.scheduled_at ?? 'Interview schedule pending'}</p>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 mt-0.5">
                        {interview.meeting_type}
                        {interview.location ? ` • ${interview.location}` : ''}
                    </p>
                </div>
                <span className="rounded-sm border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                    {interview.status_label ?? interview.status}
                </span>
            </div>

            {interview.instructions && (
                <p className="text-xs leading-relaxed text-zinc-600 mb-3">{interview.instructions}</p>
            )}

            {interview.responded_at_label || interview.candidate_response_note ? (
                <div className="mt-3 rounded-sm border border-zinc-200 bg-zinc-50 p-3">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">Your Response</p>
                    <p className="mt-1 text-xs font-semibold text-zinc-600">{interview.responded_at_label || 'Pending response'}</p>
                    {interview.candidate_response_note && (
                        <p className="mt-2 text-xs leading-relaxed text-zinc-500 italic">{interview.candidate_response_note}</p>
                    )}
                </div>
            ) : null}

            {interview.can_respond && (
                <div className="mt-4 flex flex-wrap gap-2">
                    <button onClick={() => respond('accepted')} className="inline-flex items-center gap-1.5 rounded-sm bg-black px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-zinc-800">
                        <CheckCircle2 className="h-3 w-3" /> Accept
                    </button>
                    <button onClick={() => respond('rejected')} className="inline-flex items-center gap-1.5 rounded-sm border border-red-200 px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-red-600 transition-colors hover:bg-red-50">
                        <XCircle className="h-3 w-3" /> Decline
                    </button>
                </div>
            )}
        </div>
    );
}