import { Link, router, usePage } from '@inertiajs/react';
import { Briefcase, Calendar, MapPin, Users, CheckCircle2, CircleDot } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    EmployerEmptyState,
    EmployerHubLayout,
} from './components/hub';
import type { Company, RecentApplication, User, Vacancy } from './dummyData';

type PageProps = {
    company: Company;
    user?: User;
    vacancy: Vacancy;
    applications: RecentApplication[];
};

export default function EmployerVacancyShowPage() {
    const { company, vacancy, applications } = usePage<PageProps>().props;
    const user = usePage<{ user?: User }>().props.user ?? { name: 'Employer User', email: company.email ?? '' };

    return (
        <EmployerHubLayout
            title={vacancy.title}
            subtitle="View vacancy details and application pipeline."
            active="vacancies"
            company={company}
            user={user}
        >
            <div className="w-full px-6 md:px-10">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h2 className="text-[3.5rem] font-extrabold tracking-tight leading-none text-black mb-2">{vacancy.title}</h2>
                        <p className="text-zinc-500 text-sm font-medium">Vacancy overview and application pipeline.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href={`/employer/vacancies/${vacancy.id}/edit`}>
                            <Button variant="outline" className="px-6 py-5 h-auto border-zinc-200 hover:bg-zinc-50 text-black font-semibold text-xs tracking-widest uppercase transition-all active:scale-95 rounded-md">
                                Edit
                            </Button>
                        </Link>
                        <Button 
                            onClick={() => router.patch(`/employer/vacancies/${vacancy.id}/status`, { status: vacancy.status_code === 'published' ? 'draft' : 'published' })}
                            className="px-6 py-5 h-auto bg-black text-white font-semibold text-xs tracking-widest uppercase transition-all active:scale-95 rounded-md"
                        >
                            {vacancy.status_code === 'published' ? 'Unpublish' : 'Publish'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Vacancy Details */}
                    <div className="lg:col-span-7 space-y-12">
                        <section className="space-y-6">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-zinc-100 flex items-center justify-center rounded-md">
                                    <Briefcase className="text-black h-5 w-5" />
                                </div>
                                <h3 className="text-xl font-bold tracking-tight text-black">Vacancy Details</h3>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm ${vacancy.status_code === 'published' ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                                    {vacancy.status}
                                </span>
                                <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-wider rounded-sm">
                                    {vacancy.department || 'General'}
                                </span>
                                <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-wider rounded-sm">
                                    {vacancy.location || 'Remote'}
                                </span>
                            </div>

                            {vacancy.description && (
                                <div className="prose prose-zinc max-w-none">
                                    <p className="text-zinc-600 leading-relaxed text-sm">
                                        {vacancy.description}
                                    </p>
                                </div>
                            )}
                        </section>

                        {vacancy.requirements && (
                            <section className="p-8 bg-zinc-50 rounded-xl border border-zinc-100">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-black mb-6">Requirements</h4>
                                <ul className="space-y-4">
                                    {vacancy.requirements.split('\n').filter(Boolean).map((req, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm text-zinc-600">
                                            <CheckCircle2 className="text-zinc-400 h-4 w-4 mt-0.5 shrink-0" />
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {vacancy.responsibilities && (
                            <section className="p-8 bg-zinc-50 rounded-xl border border-zinc-100">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-black mb-6">Responsibilities</h4>
                                <ul className="space-y-4">
                                    {vacancy.responsibilities.split('\n').filter(Boolean).map((resp, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm text-zinc-600">
                                            <CircleDot className="text-zinc-400 h-4 w-4 mt-0.5 shrink-0" />
                                            <span>{resp}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>

                    {/* Right Column: Applications */}
                    <div className="lg:col-span-5">
                        <div className="flex items-center justify-between mb-8 border-b border-zinc-200 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-zinc-100 flex items-center justify-center rounded-md">
                                    <Users className="text-black h-4 w-4" />
                                </div>
                                <h3 className="text-lg font-bold tracking-tight text-black">Active Pipeline</h3>
                            </div>
                            <span className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">{applications.length} Total</span>
                        </div>

                        <div className="space-y-4">
                            {applications.length > 0 ? (
                                <>
                                    {applications.map((application) => (
                                        <div key={application.id} className="p-6 bg-white border border-zinc-200 hover:border-black transition-all group relative rounded-lg shadow-sm hover:shadow-md">
                                            <div className="flex items-start justify-between">
                                                <div className="flex gap-4">
                                                    <div className="w-10 h-10 bg-zinc-100 flex items-center justify-center rounded-md text-xs font-bold text-black shrink-0">
                                                        {getInitials(application.candidate_name)}
                                                    </div>
                                                    <div>
                                                        <h5 className="text-sm font-bold text-black">{application.candidate_name}</h5>
                                                        <p className="text-[11px] text-zinc-500 font-medium mb-3 truncate max-w-[200px]">{application.candidate_headline}</p>
                                                        
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center gap-1.5 text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                                                                <Calendar className="h-3 w-3" />
                                                                {application.applied_at}
                                                            </div>
                                                            <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-[9px] font-bold uppercase tracking-wider rounded-sm">
                                                                {application.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Link href="/employer/candidates">
                                                    <button className="px-4 py-2 border border-zinc-200 hover:border-black hover:bg-black hover:text-white text-[10px] font-bold uppercase tracking-widest rounded-md transition-all active:scale-95">
                                                        Review
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <Link href="/employer/candidates" className="block w-full">
                                        <button className="w-full mt-4 py-4 border border-dashed border-zinc-300 text-zinc-500 hover:text-black hover:border-black text-[10px] font-bold uppercase tracking-widest transition-all rounded-lg">
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