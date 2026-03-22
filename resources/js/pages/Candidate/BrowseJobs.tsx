import { Link, useForm, usePage } from '@inertiajs/react';
import { Briefcase, MapPin, Search } from 'lucide-react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    CandidateEmptyState,
    CandidateHubLayout,
    CandidateSectionCard,
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
            subtitle="Explore published vacancies and apply with your saved documents."
            active="jobs"
            candidate={candidate}
        >
            <div className="space-y-6">
                <CandidateSectionCard title="Search Vacancies" icon={<Search className="h-4 w-4" />}>
                    <form method="get" action="/candidate/jobs" className="grid gap-4 md:grid-cols-4">
                        <input
                            name="search"
                            defaultValue={filters.search}
                            placeholder="Search title, location, or department"
                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm md:col-span-2"
                        />
                        <select name="category" defaultValue={filters.category} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm">
                            <option value="">All categories</option>
                            {options.categories.map((category) => (
                                <option key={category} value={category}>
                                    {category.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                        <select name="employment_type" defaultValue={filters.employment_type} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm">
                            <option value="">All employment types</option>
                            {options.employment_types.map((type) => (
                                <option key={type} value={type}>
                                    {type.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                        <select name="work_mode" defaultValue={filters.work_mode} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm">
                            <option value="">All work modes</option>
                            {options.work_modes.map((mode) => (
                                <option key={mode} value={mode}>
                                    {mode.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                        <div className="md:col-span-3" />
                        <Button type="submit" className="w-full">
                            Apply Filters
                        </Button>
                    </form>
                </CandidateSectionCard>

                <div className="grid gap-4">
                    {vacancies.length > 0 ? (
                        vacancies.map((vacancy) => (
                            <CandidateSectionCard
                                key={vacancy.id}
                                title={vacancy.title}
                                icon={<Briefcase className="h-4 w-4" />}
                                action={
                                    vacancy.has_applied ? (
                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                            Applied
                                        </Badge>
                                    ) : (
                                        <Button size="sm" onClick={() => setSelectedVacancy(selectedVacancy === vacancy.id ? null : vacancy.id)}>
                                            Apply Now
                                        </Button>
                                    )
                                }
                            >
                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                        <span>{vacancy.company_name}</span>
                                        {vacancy.location && (
                                            <span className="inline-flex items-center gap-1">
                                                <MapPin className="h-3 w-3" /> {vacancy.location}
                                            </span>
                                        )}
                                        {vacancy.employment_type && <span>{vacancy.employment_type}</span>}
                                        {vacancy.work_mode && <span>{vacancy.work_mode}</span>}
                                    </div>
                                    <p className="text-sm text-foreground leading-relaxed">{vacancy.description}</p>
                                    {(vacancy.salary_min || vacancy.salary_max) && (
                                        <p className="text-sm font-medium text-foreground">
                                            Salary: {vacancy.currency ?? 'USD'} {vacancy.salary_min ?? '—'} - {vacancy.salary_max ?? '—'}
                                        </p>
                                    )}
                                    {vacancy.has_applied && vacancy.application_status && (
                                        <p className="text-xs text-emerald-700">Current application status: {vacancy.application_status}</p>
                                    )}

                                    {!vacancy.has_applied && selectedVacancy === vacancy.id && (
                                        <div className="rounded-lg border border-border bg-background p-4 space-y-4">
                                            <div className="grid gap-2">
                                                <label className="text-sm font-medium text-foreground">Document</label>
                                                <select
                                                    value={data.resume_id}
                                                    onChange={(event) => setData('resume_id', event.target.value)}
                                                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                                                >
                                                    <option value="">Select a document</option>
                                                    {resumes.map((resume) => (
                                                        <option key={resume.id} value={resume.id}>
                                                            {resume.file_name} {resume.is_primary ? '(Primary)' : ''}
                                                        </option>
                                                    ))}
                                                </select>
                                                <InputError message={errors.resume_id} />
                                            </div>
                                            <div className="grid gap-2">
                                                <label className="text-sm font-medium text-foreground">Cover Letter</label>
                                                <Textarea
                                                    value={data.cover_letter}
                                                    onChange={(event) => setData('cover_letter', event.target.value)}
                                                    rows={4}
                                                    placeholder="Add a short note about why you are a strong fit for this role."
                                                />
                                                <InputError message={errors.cover_letter} />
                                            </div>
                                            <div className="flex gap-2">
                                                <Button type="button" disabled={processing} onClick={() => submitApplication(vacancy.id)}>
                                                    Submit Application
                                                </Button>
                                                <Button type="button" variant="outline" onClick={() => setSelectedVacancy(null)}>
                                                    Cancel
                                                </Button>
                                                {resumes.length === 0 && (
                                                    <Link href="/candidate/documents">
                                                        <Button type="button" variant="outline">
                                                            Upload CV
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CandidateSectionCard>
                        ))
                    ) : (
                        <CandidateEmptyState message="No published vacancies match the current filters." />
                    )}
                </div>
            </div>
        </CandidateHubLayout>
    );
}
