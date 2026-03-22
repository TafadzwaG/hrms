import { Link, router, usePage } from '@inertiajs/react';
import { Briefcase, Calendar, MapPin, Search, Clock, FileText, Download, ArrowLeft, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    CandidateEmptyState,
    CandidateHubLayout,
    formatCandidateDate,
} from './components/hub';
import type { CandidateApplication, CandidateUser } from './dummyData';

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
    const { candidate, applications, filters, statuses } = usePage<PageProps>().props;

    const handleFilterChange = (key: string, value: string) => {
        const query = new URLSearchParams(window.location.search);
        if (value) {
            query.set(key, value);
        } else {
            query.delete(key);
        }
        router.get(`/candidate/applications?${query.toString()}`, {}, { preserveState: true });
    };

    return (
        <CandidateHubLayout
            title="My Applications"
            active="applications"
            candidate={candidate}
        >
            <div className="w-full px-6 md:px-10">
                {/* Page Title */}
                <div className="mb-12">
                    <h2 className="text-[2.5rem] font-black tracking-tighter leading-none text-black mb-2 uppercase">Applications.</h2>
                    <p className="text-zinc-500 max-w-xl font-medium">Track and manage your professional journey. Review your current status, interview schedules, and historical submissions.</p>
                </div>

                {/* Filter Section - Matched to Vacancies Style */}
                <section className="bg-zinc-50 p-8 border border-zinc-200 rounded-xl mb-12 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                        <div className="md:col-span-6">
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-3">Search Keywords</label>
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
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-3">Filter by Status</label>
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
                                <Button type="button" className="w-full bg-black text-white py-6 h-auto rounded-md font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 transition-colors">
                                    Browse Jobs
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Application History List */}
                <section className="space-y-8">
                    <div className="flex items-center justify-between px-2 border-b border-zinc-200 pb-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Application History ({applications.data.length})</h3>
                    </div>

                    {applications.data.length > 0 ? (
                        <div className="space-y-6">
                            {applications.data.map((application) => {
                                const styles = getStatusStyles(application.status);
                                
                                return (
                                    <div key={application.id} className={`group bg-white hover:bg-zinc-50 border border-zinc-200 transition-all duration-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md ${styles.opacity}`}>
                                        <div className={`p-8 border-l-4 ${styles.border}`}>
                                            
                                            {/* Header */}
                                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h4 className="text-2xl font-black tracking-tight text-black">{application.vacancy_title}</h4>
                                                        <span className={`${styles.badge} text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-tighter`}>
                                                            {application.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-lg font-medium text-zinc-500">{application.company_name}</p>
                                                </div>
                                                {(application.salary_min || application.salary_max) && (
                                                    <div className="bg-zinc-100 px-4 py-2 rounded-md">
                                                        <span className="text-xs font-black text-black font-mono tracking-tight">
                                                            {application.currency ?? 'USD'} {application.salary_min ?? 'N/A'} - {application.salary_max ?? 'N/A'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                                <div className="space-y-4">
                                                    {application.location && (
                                                        <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium">
                                                            <MapPin className="h-4 w-4" />
                                                            <span>{application.location}</span>
                                                        </div>
                                                    )}
                                                    {application.employment_type && (
                                                        <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium">
                                                            <Clock className="h-4 w-4" />
                                                            <span>{application.employment_type}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>Applied {formatCandidateDate(application.applied_at)}</span>
                                                    </div>
                                                </div>

                                                {(application.cover_letter || application.resume) && (
                                                    <div className="md:col-span-2 space-y-4 border-l border-zinc-200 pl-0 md:pl-8">
                                                        {application.cover_letter && (
                                                            <div className="space-y-1">
                                                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Cover Letter Extract</p>
                                                                <p className="text-sm text-zinc-600 leading-relaxed italic line-clamp-3">"{application.cover_letter}"</p>
                                                            </div>
                                                        )}
                                                        
                                                        {application.resume && (
                                                            <div className="flex items-center gap-3 bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                                                                <FileText className="text-black h-5 w-5" />
                                                                <div>
                                                                    <p className="text-xs font-bold text-black">{application.resume.file_name}</p>
                                                                    <p className="text-[10px] text-zinc-500">Document Attached</p>
                                                                </div>
                                                                {application.resume.download_url && (
                                                                    <a href={application.resume.download_url} className="ml-auto text-black hover:bg-zinc-200 p-1.5 rounded-md transition-colors">
                                                                        <Download className="h-4 w-4" />
                                                                    </a>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Footer Actions */}
                                            <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100">
                                                <button className="px-6 py-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:bg-zinc-100 hover:text-black border border-transparent rounded transition-colors">
                                                    Withdraw
                                                </button>
                                                <Link href={`/candidate/jobs/${application.vacancy_id}`}>
                                                    <button className="px-6 py-2 text-xs font-bold uppercase tracking-widest bg-black text-white rounded hover:bg-zinc-800 transition-all">
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
                    <nav className="mt-16 flex items-center justify-between border-t border-zinc-200 pt-8 pb-12">
                        <div className="flex-1 flex justify-start">
                            {applications.links[0].url ? (
                                <Link href={applications.links[0].url} className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-black transition-colors">
                                    <ArrowLeft className="h-4 w-4" /> Previous
                                </Link>
                            ) : (
                                <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-300 cursor-not-allowed">
                                    <ArrowLeft className="h-4 w-4" /> Previous
                                </span>
                            )}
                        </div>
                        
                        <div className="hidden md:flex items-center gap-2">
                            {applications.links.slice(1, -1).map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url ?? '#'}
                                    className={`w-10 h-10 flex items-center justify-center rounded-md font-bold text-sm transition-colors ${
                                        link.active ? 'bg-black text-white' : 'text-zinc-500 hover:bg-zinc-100 hover:text-black'
                                    } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>

                        <div className="flex-1 flex justify-end">
                            {applications.links[applications.links.length - 1].url ? (
                                <Link href={applications.links[applications.links.length - 1].url!} className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-black transition-colors">
                                    Next <ArrowRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-300 cursor-not-allowed">
                                    Next <ArrowRight className="h-4 w-4" />
                                </span>
                            )}
                        </div>
                    </nav>
                )}
            </div>
        </CandidateHubLayout>
    );
}

const underlinedInput = "w-full bg-transparent border-0 border-b border-zinc-200 focus:ring-0 focus:border-black px-0 py-2.5 transition-all text-sm font-semibold text-black placeholder:text-zinc-300 placeholder:font-medium appearance-none outline-none";