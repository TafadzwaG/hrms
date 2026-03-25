import { Link, useForm, usePage } from '@inertiajs/react';
import { Briefcase, MapPin, Search, Clock, Globe, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';

import InputError from '@/components/input-error';
import { richTextToPlainText } from '@/components/rich-text';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    CandidateEmptyState,
    candidateBreadcrumbs,
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
    const [categoryFilter, setCategoryFilter] = useState(filters.category || '__all__');
    const [employmentTypeFilter, setEmploymentTypeFilter] = useState(filters.employment_type || '__all__');
    const [workModeFilter, setWorkModeFilter] = useState(filters.work_mode || '__all__');
    
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
            subtitle="Explore published vacancies and apply with your saved documents."
            active="jobs"
            candidate={candidate}
            breadcrumbs={candidateBreadcrumbs('Browse Jobs')}
        >
            <div className="space-y-6">
                {/* Search Vacancies Filters */}
                <section className="rounded-lg border border-border/70 bg-background/95 p-6 shadow-sm">
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
                                <input type="hidden" name="category" value={categoryFilter === '__all__' ? '' : categoryFilter} />
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger className={selectTriggerClass}>
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    <SelectItem value="__all__">All Categories</SelectItem>
                                    {options.categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category.replace(/_/g, ' ')}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                            </FormField>
                        </div>
                        
                        <div className="md:col-span-2">
                            <FormField label="Employment Type">
                                <input type="hidden" name="employment_type" value={employmentTypeFilter === '__all__' ? '' : employmentTypeFilter} />
                                <Select value={employmentTypeFilter} onValueChange={setEmploymentTypeFilter}>
                                    <SelectTrigger className={selectTriggerClass}>
                                        <SelectValue placeholder="All Types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    <SelectItem value="__all__">All Types</SelectItem>
                                    {options.employment_types.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type.replace(/_/g, ' ')}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                            </FormField>
                        </div>

                        <div className="md:col-span-2">
                            <FormField label="Work Mode">
                                <input type="hidden" name="work_mode" value={workModeFilter === '__all__' ? '' : workModeFilter} />
                                <Select value={workModeFilter} onValueChange={setWorkModeFilter}>
                                    <SelectTrigger className={selectTriggerClass}>
                                        <SelectValue placeholder="All Modes" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    <SelectItem value="__all__">All Modes</SelectItem>
                                    {options.work_modes.map((mode) => (
                                        <SelectItem key={mode} value={mode}>
                                            {mode.replace(/_/g, ' ')}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
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
                <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {vacancies.length > 0 ? (
                        vacancies.map((vacancy) => (
                            <div key={vacancy.id} className="group flex flex-col justify-between rounded-lg border border-border/70 bg-background/95 p-6 shadow-sm transition-colors hover:border-border hover:bg-muted/10">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-black tracking-tighter leading-tight text-black group-hover:underline cursor-pointer">{vacancy.title}</h3>
                                            <p className="text-xs font-bold text-zinc-500">{vacancy.company_name}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            {vacancy.match ? (
                                                <div className="rounded-md border border-primary/40 bg-primary px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-primary-foreground">
                                                    {vacancy.match.score}% {vacancy.match.label}
                                                </div>
                                            ) : null}
                                            {vacancy.has_applied ? (
                                                <span className="rounded-md border border-border bg-muted px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
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
                                    
                                    <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
                                        {richTextToPlainText(vacancy.description)}
                                    </p>

                                    {vacancy.match ? (
                                        <div className="mt-4 rounded-lg border border-border/70 bg-muted/20 p-3">
                                            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Why this fits</p>
                                            <ul className="space-y-1.5">
                                                {vacancy.match.reasons.slice(0, 2).map((reason) => (
                                                    <li key={reason} className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
                                                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary" />
                                                        <span>{reason}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : null}
                                </div>

                                {/* Inline Application Form */}
                                {!vacancy.has_applied && selectedVacancy === vacancy.id && (
                                    <div className="mt-6 space-y-5 border-t border-zinc-200 pt-6">
                                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">Quick Application</h4>
                                        <div className="space-y-5">
                                            <FormField label="Select Resume" error={errors.resume_id}>
                                                <Select
                                                    value={data.resume_id || '__empty__'}
                                                    onValueChange={(value) => setData('resume_id', value === '__empty__' ? '' : value)}
                                                >
                                                    <SelectTrigger className={selectTriggerClass}>
                                                        <SelectValue placeholder="Select a document" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                    <SelectItem value="__empty__">Select a document</SelectItem>
                                                    {resumes.map((resume) => (
                                                        <SelectItem key={resume.id} value={String(resume.id)}>
                                                            {resume.file_name} {resume.is_primary ? '(Primary)' : ''}
                                                        </SelectItem>
                                                    ))}
                                                    </SelectContent>
                                                </Select>
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

const underlinedInput = "w-full bg-transparent border-0 border-b border-zinc-200 focus:ring-0 focus:border-black px-0 py-2 transition-all text-sm text-black placeholder:text-zinc-400 appearance-none outline-none";
const selectTriggerClass = "h-auto w-full rounded-none border-0 border-b border-zinc-200 bg-transparent px-0 py-2 text-sm text-black shadow-none focus:ring-0 focus:ring-offset-0";
