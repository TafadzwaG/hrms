import { Link, router, usePage } from '@inertiajs/react';
import { Briefcase, Filter, MapPin, Users, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import {
    EmployerEmptyState,
    EmployerHubLayout,
} from './components/hub';
import type { Company, User, Vacancy } from './dummyData';

type PageProps = {
    company: Company;
    user?: User;
    vacancies: {
        data: Vacancy[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        search: string;
        status: string;
    };
    options: {
        statuses: string[];
    };
};

export default function EmployerVacanciesPage() {
    const { company, vacancies, filters, options } = usePage<PageProps>().props;
    const user = usePage<{ user?: User }>().props.user ?? { name: 'Employer User', email: company.email ?? '' };

    const updateStatus = (vacancyId: number, status: string) => {
        router.patch(`/employer/vacancies/${vacancyId}/status`, { status }, { preserveScroll: true });
    };

    return (
        <EmployerHubLayout
            title="Vacancies"
            subtitle="Manage vacancy creation, publishing, and closing."
            active="vacancies"
            company={company}
            user={user}
        >
            <div className="w-full px-6 md:px-10">
                {/* Compact Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                    <div>
                        <h2 className="text-4xl font-black tracking-tighter text-black mb-1">Vacancies</h2>
                        <p className="text-zinc-500 text-sm font-medium tracking-tight">
                            Manage vacancy creation, publishing, and closing.
                        </p>
                    </div>
                    <Link href="/employer/vacancies/create">
                        <Button className="bg-black text-white px-5 py-5 h-auto rounded-md font-bold text-xs flex items-center gap-2 hover:bg-zinc-800 active:scale-95 transition-all">
                            <Plus className="h-3.5 w-3.5" />
                            Post a New Job
                        </Button>
                    </Link>
                </header>

                {/* Compact Filter Card */}
                <section className="bg-zinc-50 p-6 rounded-lg mb-10 border border-zinc-200 shadow-sm">
                    <form method="get" action="/employer/vacancies" className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                        <div className="md:col-span-6">
                            <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Search vacancies</label>
                            <div className="relative group">
                                <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                <input 
                                    name="search" 
                                    defaultValue={filters.search} 
                                    className={underlinedInput} 
                                    placeholder="Job title, department..." 
                                />
                            </div>
                        </div>
                        <div className="md:col-span-4">
                            <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Status</label>
                            <select name="status" defaultValue={filters.status} className={underlinedInput}>
                                <option value="">All statuses</option>
                                {options.statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status.replace(/_/g, ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <Button type="submit" className="w-full bg-zinc-200 text-black py-5 h-auto rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-300 transition-colors">
                                Apply
                            </Button>
                        </div>
                    </form>
                </section>

                {/* Compact Vacancy List */}
                <section className="grid grid-cols-1 gap-4">
                    {vacancies.data.length > 0 ? (
                        <>
                            {vacancies.data.map((vacancy) => (
                                <article 
                                    key={vacancy.id} 
                                    className="group bg-white border border-zinc-200 p-6 rounded-lg transition-all duration-300 hover:border-black hover:shadow-sm"
                                >
                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                        <div className="flex-grow">
                                            <div className="flex items-center gap-2.5 mb-3">
                                                <h3 className="text-lg font-bold tracking-tight text-black">{vacancy.title}</h3>
                                                <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-sm border ${
                                                    vacancy.status_code === 'published' 
                                                    ? 'bg-black text-white border-black' 
                                                    : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                                                }`}>
                                                    {vacancy.status}
                                                </span>
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-2 mb-4 text-zinc-500">
                                                <Badge icon={<Briefcase size={12} />} label={vacancy.department || 'General'} />
                                                <Badge icon={<MapPin size={12} />} label={vacancy.location || 'Remote'} />
                                            </div>

                                            <div className="inline-flex items-center gap-2 px-2.5 py-1.5 bg-zinc-50 rounded border border-zinc-100">
                                                <Users size={14} className="text-zinc-400 fill-zinc-400" />
                                                <span className="text-xs font-bold text-black">{vacancy.applications_count} applications</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap md:flex-row items-center gap-1.5 self-start">
                                            <Link href={`/employer/vacancies/${vacancy.id}`}>
                                                <button className={actionBtnClass}>View</button>
                                            </Link>
                                            <Link href={`/employer/vacancies/${vacancy.id}/edit`}>
                                                <button className={actionBtnClass}>Edit</button>
                                            </Link>
                                            
                                            {vacancy.status_code !== 'published' ? (
                                                <button onClick={() => updateStatus(vacancy.id, 'published')} className="px-3 py-2 bg-black text-white text-[10px] font-bold uppercase rounded-md hover:bg-zinc-800 transition-colors">
                                                    Publish
                                                </button>
                                            ) : (
                                                <button onClick={() => updateStatus(vacancy.id, 'draft')} className={actionBtnClass}>Unpublish</button>
                                            )}
                                            
                                            <button onClick={() => updateStatus(vacancy.id, 'closed')} className={actionBtnClass}>Close</button>
                                            <button 
                                                onClick={() => window.confirm('Delete this vacancy?') && router.delete(`/employer/vacancies/${vacancy.id}`)}
                                                className="px-3 py-2 border border-red-100 text-red-500 text-[10px] font-bold uppercase rounded-md hover:bg-red-50 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}

                            {/* Pagination matches the compact table footer style */}
                            <footer className="mt-10 flex flex-col items-center justify-between gap-4 pt-10 border-t border-zinc-100 md:flex-row">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                    Showing {vacancies.data.length} vacancies
                                </p>
                                <div className="flex items-center gap-1">
                                    {vacancies.links.map((link, index) => (
                                        <a
                                            key={index}
                                            href={link.url ?? '#'}
                                            className={`h-8 px-3 flex items-center justify-center rounded-md text-[11px] font-bold transition-all ${
                                                link.active 
                                                ? 'bg-black text-white' 
                                                : 'border border-zinc-200 text-black hover:bg-zinc-50'
                                            } ${!link.url && 'opacity-30 cursor-not-allowed'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </footer>
                        </>
                    ) : (
                        <EmployerEmptyState message="No vacancies match the current filters." />
                    )}
                </section>
            </div>
        </EmployerHubLayout>
    );
}

const Badge = ({ icon, label }: { icon: any, label: string }) => (
    <span className="bg-zinc-100 px-2 py-0.5 rounded-sm text-[10px] font-bold text-zinc-600 flex items-center gap-1.5 uppercase tracking-wide">
        {icon} {label}
    </span>
);

const actionBtnClass = "px-3 py-2 border border-zinc-200 text-black text-[10px] font-bold uppercase rounded-md hover:bg-zinc-50 hover:border-black transition-all";

const underlinedInput = "w-full pl-7 pr-3 py-2 bg-transparent border-0 border-b border-zinc-200/60 focus:ring-0 focus:border-black transition-all text-sm placeholder:text-zinc-300 font-medium outline-none appearance-none";