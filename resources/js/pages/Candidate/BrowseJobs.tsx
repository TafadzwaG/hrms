import { Link, useForm, usePage } from '@inertiajs/react';
import { Briefcase, MapPin, Search, Clock, Globe, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';

import InputError from '@/components/input-error';
import { richTextToPlainText } from '@/components/rich-text';
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
                <section className="mb-8">
                    <h1 className="text-4xl font-black tracking-tighter text-black leading-none uppercase mb-2">Explore Vacancies.</h1>
                    <p className="text-zinc-500 text-sm font-medium tracking-tight">Explore published vacancies and apply with your saved documents.</p>
                </section>

                {/* Search Vacancies Filters */}
                <section className="bg-zinc-50 p-6 border border-zinc-200 rounded-sm mb-8 shadow-sm">
                    <form method="get" action="/candidate/jobs" className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                        <div className="md:col-span-4">
                            <FormField label="Search Keywords">
                                <div className="relative group">
                                    <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-black transition-colors" />
                                    <input
                                        name="search"
                                        defaultValue={filters.search}
                                        placeholder="Role, company or location..."
                                        className={`${underlinedInput} pl-7`}
                                    />
                                </div>
                            </FormField>
                        </div>
                        
                        <div className="md:col-span-2">
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
                        
                        <div className="md:col-span-2">
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

                        <div className="md:col-span-2">
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

                        <div className="md:col-span-2">
                            <Button type="submit" className="w-full bg-black text-white py-5 h-auto rounded-sm font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-800 transition-colors">
                                Apply Filters
                            </Button>
                        </div>
                    </form>
                </section>

                {/* Job Listings Grid */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {vacancies.length > 0 ? (
                        vacancies.map((vacancy) => (
                            <div key={vacancy.id} className="bg-white p-6 border border-zinc-200 hover:border-black transition-all group flex flex-col justify-between shadow-sm hover:shadow-md rounded-sm">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-black tracking-tighter leading-tight text-black group-hover:underline cursor-pointer">{vacancy.title}</h3>
                                            <p className="text-xs font-bold text-zinc-500">{vacancy.company_name}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            {vacancy.match ? (
                                                <div className="rounded-sm border border-black bg-black px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white">
                                                    {vacancy.match.score}% {vacancy.match.label}
                                                </div>
                                            ) : null}
                                            {vacancy.has_applied ? (
                                                <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-[9px] font-bold uppercase tracking-widest border border-zinc-200 rounded-sm">
                                                    Applied
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">
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
                                    
                                    <p className="text-xs leading-relaxed text-zinc-600 line-clamp-3">
                                        {richTextToPlainText(vacancy.description)}
                                    </p>

                                    {vacancy.match ? (
                                        <div className="rounded-sm border border-zinc-200 bg-zinc-50 p-3 mt-4">
                                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">Why this fits</p>
                                            <ul className="space-y-1.5">
                                                {vacancy.match.reasons.slice(0, 2).map((reason) => (
                                                    <li key={reason} className="flex items-start gap-2 text-[11px] leading-relaxed text-zinc-600">
                                                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-black" />
                                                        <span>{reason}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : null}
                                </div>

                                {/* Inline Application Form */}
                                {!vacancy.has_applied && selectedVacancy === vacancy.id && (
                                    <div className="mt-6 pt-6 border-t border-zinc-200 space-y-5">
                                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">Quick Application</h4>
                                        <div className="space-y-5">
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
                                                    <Link href="/candidate/documents" className="text-[10px] font-bold text-zinc-400 hover:text-black uppercase tracking-widest mt-2 inline-block transition-colors">
                                                        + Upload New Document
                                                    </Link>
                                                )}
                                            </FormField>

                                            <FormField label="Cover Letter / Personal Note" error={errors.cover_letter}>
                                                <Textarea
                                                    value={data.cover_letter}
                                                    onChange={(e) => setData('cover_letter', e.target.value)}
                                                    rows={3}
                                                    placeholder={`Briefly explain why you're a fit for ${vacancy.company_name}...`}
                                                    className="w-full bg-zinc-50 border border-zinc-200 focus:ring-1 focus:ring-black focus:border-black p-3 text-xs resize-none transition-all rounded-sm"
                                                />
                                            </FormField>

                                            <div className="flex gap-3 pt-2">
                                                <Button 
                                                    type="button" 
                                                    disabled={processing} 
                                                    onClick={() => submitApplication(vacancy.id)}
                                                    className="flex-1 bg-black text-white py-5 h-auto text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors rounded-sm"
                                                >
                                                    Submit Application
                                                </Button>
                                                <Button 
                                                    type="button" 
                                                    variant="outline" 
                                                    onClick={() => setSelectedVacancy(null)}
                                                    className="px-6 py-5 h-auto border-zinc-200 text-black text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-50 transition-colors rounded-sm"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Card Footer: Salary and Action */}
                                <div className="flex items-center justify-between pt-6 mt-6 border-t border-zinc-100">
                                    <div className="space-y-0.5">
                                        <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-widest">Est. Salary</span>
                                        <p className="text-base font-extrabold tracking-tighter text-black">
                                            {vacancy.salary_min || vacancy.salary_max 
                                                ? `${vacancy.currency ?? 'USD'} ${vacancy.salary_min ?? 'N/A'} — ${vacancy.salary_max ?? 'N/A'}`
                                                : 'Competitive'
                                            }
                                        </p>
                                    </div>
                                    {!vacancy.has_applied && selectedVacancy !== vacancy.id && (
                                        <Button 
                                            onClick={() => setSelectedVacancy(vacancy.id)}
                                            className="bg-black text-white px-6 py-4 h-auto text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors rounded-sm"
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
        <div className="flex flex-col space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                {label}
            </label>
            {children}
            <InputError message={error} />
        </div>
    );
}

const underlinedInput = "w-full bg-transparent border-0 border-b border-zinc-200 focus:ring-0 focus:border-black px-0 py-2 transition-all text-sm font-semibold text-black placeholder:text-zinc-400 appearance-none outline-none";
