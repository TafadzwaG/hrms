import { Link, useForm, usePage } from '@inertiajs/react';
import { Briefcase, MapPin, Search, Clock, Globe } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    CandidateEmptyState,
    CandidateHubLayout,
} from './components/hub';
import type { CandidateDocument, CandidateRecommendedVacancy, CandidateUser } from './dummyData';

type PageProps = {
    candidate: CandidateUser;
    vacancies: CandidateRecommendedVacancy[];
    filters: {
        search: string;
        category: string;
        employment_type: string;
        work_mode: string;
    };
    options: {
        categories: string[];
        employment_types: string[];
        work_modes: string[];
    };
    resumes: CandidateDocument[];
};

export default function BrowseJobsPage() {
    const { candidate, vacancies, filters, options, resumes } = usePage<PageProps>().props;
    const [selectedVacancy, setSelectedVacancy] = useState<number | null>(null);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        resume_id: resumes.find((resume) => resume.is_primary)?.id?.toString() ?? '',
        cover_letter: '',
    });

    const submitApplication = (vacancyId: number) => {
        post(`/candidate/jobs/${vacancyId}/apply`, {
            preserveScroll: true,
            onSuccess: () => {
                reset('cover_letter');
                setSelectedVacancy(null);
            },
        });
    };

    return (
        <CandidateHubLayout
            title="Browse Jobs"
            active="jobs"
            candidate={candidate}
        >
            <div className="w-full px-6 md:px-10">
                {/* Hero / Header */}
                <section className="mb-12">
                    <h1 className="text-[2.5rem] font-black tracking-tighter text-black leading-none uppercase mb-2">Explore Vacancies</h1>
                    <p className="text-zinc-500 text-lg font-medium tracking-tight">Explore published vacancies and apply with your saved documents.</p>
                </section>

                {/* Search Vacancies Filters */}
                <section className="bg-zinc-50 p-8 border border-zinc-200 rounded-lg mb-12 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <Search className="text-black h-5 w-5" />
                        <h2 className="text-lg font-bold tracking-tight text-black uppercase">Search Vacancies</h2>
                    </div>
                    
                    <form method="get" action="/candidate/jobs" className="grid grid-cols-1 md:grid-cols-4 gap-8 items-end">
                        <div className="md:col-span-2">
                            <FormField label="Search Keywords">
                                <input
                                    name="search"
                                    defaultValue={filters.search}
                                    placeholder="Search title, location, or department"
                                    className={underlinedInput}
                                />
                            </FormField>
                        </div>
                        
                        <div>
                            <FormField label="Category">
                                <select name="category" defaultValue={filters.category} className={underlinedInput}>
                                    <option value="">All Categories</option>
                                    {options.categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category.replace(/_/g, ' ')}
                                        </option>
                                    ))}
                                </select>
                            </FormField>
                        </div>
                        
                        <div>
                            <FormField label="Employment Type">
                                <select name="employment_type" defaultValue={filters.employment_type} className={underlinedInput}>
                                    <option value="">All Types</option>
                                    {options.employment_types.map((type) => (
                                        <option key={type} value={type}>
                                            {type.replace(/_/g, ' ')}
                                        </option>
                                    ))}
                                </select>
                            </FormField>
                        </div>

                        <div className="md:col-span-3">
                            <FormField label="Work Mode">
                                <select name="work_mode" defaultValue={filters.work_mode} className={underlinedInput}>
                                    <option value="">All Modes</option>
                                    {options.work_modes.map((mode) => (
                                        <option key={mode} value={mode}>
                                            {mode.replace(/_/g, ' ')}
                                        </option>
                                    ))}
                                </select>
                            </FormField>
                        </div>

                        <div className="flex justify-end h-full items-end">
                            <Button type="submit" className="w-full bg-black text-white px-8 py-6 h-auto text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors rounded-sm">
                                Apply Filters
                            </Button>
                        </div>
                    </form>
                </section>

                {/* Job Listings Grid */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {vacancies.length > 0 ? (
                        vacancies.map((vacancy) => (
                            <div key={vacancy.id} className="bg-white p-8 border border-zinc-200 hover:border-black transition-all group flex flex-col justify-between shadow-sm hover:shadow-lg rounded-lg">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h3 className="text-2xl font-black tracking-tighter leading-tight text-black group-hover:underline cursor-pointer">{vacancy.title}</h3>
                                            <p className="text-sm font-bold text-zinc-500">{vacancy.company_name}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            {vacancy.match ? (
                                                <div className="rounded-sm border border-black bg-black px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                                                    {vacancy.match.score}% {vacancy.match.label}
                                                </div>
                                            ) : null}
                                            {vacancy.has_applied ? (
                                                <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-tighter border border-zinc-200 rounded-sm">
                                                    Applied
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-6">
                                        {vacancy.location && (
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="h-3.5 w-3.5" />
                                                <span>{vacancy.location}</span>
                                            </div>
                                        )}
                                        {vacancy.employment_type && (
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="h-3.5 w-3.5" />
                                                <span>{vacancy.employment_type}</span>
                                            </div>
                                        )}
                                        {vacancy.work_mode && (
                                            <div className="flex items-center gap-1.5">
                                                <Globe className="h-3.5 w-3.5" />
                                                <span>{vacancy.work_mode}</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <p className="text-sm leading-relaxed text-zinc-600 line-clamp-3">
                                        {vacancy.description}
                                    </p>

                                    {vacancy.match ? (
                                        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Why this fits</p>
                                                <span className="text-[11px] font-bold uppercase tracking-widest text-black">
                                                    {vacancy.match.score}% match
                                                </span>
                                            </div>
                                            <ul className="mt-3 space-y-1.5">
                                                {vacancy.match.reasons.slice(0, 2).map((reason) => (
                                                    <li key={reason} className="flex items-start gap-2 text-xs leading-relaxed text-zinc-600">
                                                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                                                        <span>{reason}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : null}
                                </div>

                                {/* Inline Application Form */}
                                {!vacancy.has_applied && selectedVacancy === vacancy.id && (
                                    <div className="mt-8 pt-8 border-t border-zinc-200 space-y-6">
                                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-black">Quick Application</h4>
                                        <div className="space-y-6">
                                            <FormField label="Select Resume" error={errors.resume_id}>
                                                <select 
                                                    value={data.resume_id} 
                                                    onChange={(e) => setData('resume_id', e.target.value)} 
                                                    className={underlinedInput}
                                                >
                                                    <option value="">Select a document</option>
                                                    {resumes.map((resume) => (
                                                        <option key={resume.id} value={resume.id}>
                                                            {resume.file_name} {resume.is_primary ? '(Primary)' : ''}
                                                        </option>
                                                    ))}
                                                </select>
                                                {resumes.length === 0 && (
                                                    <Link href="/candidate/documents" className="text-[10px] font-bold text-zinc-400 hover:text-black uppercase tracking-widest mt-2 inline-block">
                                                        + Upload New Document
                                                    </Link>
                                                )}
                                            </FormField>

                                            <FormField label="Cover Letter / Personal Note" error={errors.cover_letter}>
                                                <Textarea
                                                    value={data.cover_letter}
                                                    onChange={(e) => setData('cover_letter', e.target.value)}
                                                    rows={4}
                                                    placeholder={`Briefly explain why you're a fit for ${vacancy.company_name}...`}
                                                    className="w-full bg-zinc-50 border border-zinc-200 focus:ring-1 focus:ring-black focus:border-black p-4 text-sm resize-none transition-all rounded-sm"
                                                />
                                            </FormField>

                                            <div className="flex gap-4 pt-2">
                                                <Button 
                                                    type="button" 
                                                    disabled={processing} 
                                                    onClick={() => submitApplication(vacancy.id)}
                                                    className="flex-1 bg-black text-white py-6 h-auto text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors rounded-sm"
                                                >
                                                    Submit Application
                                                </Button>
                                                <Button 
                                                    type="button" 
                                                    variant="outline" 
                                                    onClick={() => setSelectedVacancy(null)}
                                                    className="px-8 py-6 h-auto border-zinc-200 text-black text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-50 transition-colors rounded-sm"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Card Footer: Salary and Action */}
                                <div className="flex items-center justify-between pt-8 mt-6 border-t border-zinc-100">
                                    <div className="space-y-0.5">
                                        <span className="text-[10px] uppercase font-bold text-zinc-400">Est. Salary Range</span>
                                        <p className="text-lg font-extrabold tracking-tighter text-black">
                                            {vacancy.salary_min || vacancy.salary_max 
                                                ? `${vacancy.currency ?? 'USD'} ${vacancy.salary_min ?? 'N/A'} — ${vacancy.salary_max ?? 'N/A'}`
                                                : 'Competitive'
                                            }
                                        </p>
                                    </div>
                                    {!vacancy.has_applied && selectedVacancy !== vacancy.id && (
                                        <Button 
                                            onClick={() => setSelectedVacancy(vacancy.id)}
                                            className="bg-black text-white px-8 py-5 h-auto text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors rounded-sm"
                                        >
                                            Apply Now
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="lg:col-span-2">
                            <CandidateEmptyState message="No vacancies match your current search filters." />
                        </div>
                    )}
                </section>
            </div>
        </CandidateHubLayout>
    );
}

function FormField({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
    return (
        <div className="flex flex-col space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                {label}
            </label>
            {children}
            <InputError message={error} />
        </div>
    );
}

const underlinedInput = "w-full bg-transparent border-0 border-b border-zinc-200 focus:ring-0 focus:border-black px-0 py-2.5 transition-all text-sm font-semibold text-black placeholder:text-zinc-400 appearance-none outline-none";
