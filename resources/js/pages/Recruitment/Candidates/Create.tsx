import type { FormEvent } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Briefcase, Save, User, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    CandidateFormField,
    RecruitmentCandidateSectionHeading,
    RecruitmentCandidateSummaryCard,
    candidatePrimaryButtonClassName,
    candidateSecondaryButtonClassName,
    candidateTextAreaClassName,
    candidateUnderlinedInput,
    formatCandidateLabel,
    recruitmentCandidateMutedCardClassName,
    recruitmentCandidateSectionClassName,
} from './profile-primitives';

type CreatePageProps = {
    options?: {
        education_levels?: string[];
        visibility_statuses?: string[];
    };
};

export default function CandidateCreate() {
    const { options } = usePage<CreatePageProps>().props;

    const educationLevels = options?.education_levels ?? [];
    const visibilityStatuses = options?.visibility_statuses ?? ['draft', 'pending_payment', 'active'];

    const { data, setData, post, processing } = useForm({
        full_name: '',
        email: '',
        phone: '',
        alt_phone: '',
        national_id: '',
        gender: '',
        date_of_birth: '',
        location: '',
        headline: '',
        professional_summary: '',
        expected_salary: '',
        salary_currency: 'USD',
        years_experience: '',
        highest_education: '',
        profile_visibility_status: 'draft',
        is_public: false,
    });

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        post('/candidate-profiles');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Recruitment', href: '/recruitment' },
                { title: 'Candidates', href: '/candidate-profiles' },
                { title: 'Create' },
            ]}
        >
            <Head title="Create Candidate" />

            <div className="w-full space-y-6 bg-muted/10 p-4 lg:p-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tighter text-black uppercase">Create Candidate</h1>
                    <p className="text-sm font-bold tracking-wide text-zinc-500">
                        Register a new candidate profile using the same structure as the self-service candidate profile.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-8">
                        <section className={recruitmentCandidateSectionClassName}>
                            <RecruitmentCandidateSectionHeading icon={User} title="Personal Information" kicker="Step 1 of 3" />

                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                                <CandidateFormField label="Full Name">
                                    <input value={data.full_name} onChange={(event) => setData('full_name', event.target.value)} className={candidateUnderlinedInput} />
                                </CandidateFormField>
                                <CandidateFormField label="Email Address">
                                    <input type="email" value={data.email} onChange={(event) => setData('email', event.target.value)} className={candidateUnderlinedInput} />
                                </CandidateFormField>
                                <CandidateFormField label="Phone Number">
                                    <input value={data.phone} onChange={(event) => setData('phone', event.target.value)} className={candidateUnderlinedInput} />
                                </CandidateFormField>
                                <CandidateFormField label="Alt Phone">
                                    <input value={data.alt_phone} onChange={(event) => setData('alt_phone', event.target.value)} className={candidateUnderlinedInput} />
                                </CandidateFormField>
                                <CandidateFormField label="National ID">
                                    <input value={data.national_id} onChange={(event) => setData('national_id', event.target.value)} className={candidateUnderlinedInput} />
                                </CandidateFormField>
                                <CandidateFormField label="Gender">
                                    <select value={data.gender} onChange={(event) => setData('gender', event.target.value)} className={candidateUnderlinedInput}>
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        <option value="prefer_not_to_say">Prefer not to say</option>
                                    </select>
                                </CandidateFormField>
                                <CandidateFormField label="Date of Birth">
                                    <input type="date" value={data.date_of_birth} onChange={(event) => setData('date_of_birth', event.target.value)} className={candidateUnderlinedInput} />
                                </CandidateFormField>
                                <CandidateFormField label="Location">
                                    <input value={data.location} onChange={(event) => setData('location', event.target.value)} className={candidateUnderlinedInput} />
                                </CandidateFormField>
                            </div>

                            <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-lg border border-border/70 bg-muted/20 p-5 md:flex-row">
                                <div className="flex w-full items-center gap-5 md:w-auto">
                                    <div className="w-full space-y-1 md:w-auto">
                                        <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Visibility</label>
                                        <select
                                            value={data.profile_visibility_status}
                                            onChange={(event) => setData('profile_visibility_status', event.target.value)}
                                            className="cursor-pointer border-none bg-transparent p-0 text-sm font-bold focus:ring-0"
                                        >
                                            {visibilityStatuses.map((status) => (
                                                <option key={status} value={status}>
                                                    {formatCandidateLabel(status)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="hidden h-8 w-px bg-zinc-200 md:block" />
                                    <label className="group flex cursor-pointer items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={data.is_public}
                                            onChange={(event) => setData('is_public', event.target.checked)}
                                            className="h-4 w-4 rounded-none border-black text-black transition-all focus:ring-0"
                                        />
                                        <span className="text-xs font-bold text-zinc-700">Public Listing</span>
                                    </label>
                                </div>
                            </div>
                        </section>

                        <section className={recruitmentCandidateSectionClassName}>
                            <RecruitmentCandidateSectionHeading icon={Briefcase} title="Professional Summary" kicker="Step 2 of 3" />

                            <div className="space-y-5">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <CandidateFormField label="Professional Headline">
                                        <input value={data.headline} onChange={(event) => setData('headline', event.target.value)} className={candidateUnderlinedInput} />
                                    </CandidateFormField>

                                    <div className="grid grid-cols-2 gap-4">
                                        <CandidateFormField label="Experience (Yrs)">
                                            <input type="number" min="0" value={data.years_experience} onChange={(event) => setData('years_experience', event.target.value)} className={candidateUnderlinedInput} />
                                        </CandidateFormField>
                                        <CandidateFormField label="Education">
                                            <select value={data.highest_education} onChange={(event) => setData('highest_education', event.target.value)} className={candidateUnderlinedInput}>
                                                <option value="">Select level</option>
                                                {educationLevels.map((level) => (
                                                    <option key={level} value={level}>
                                                        {formatCandidateLabel(level)}
                                                    </option>
                                                ))}
                                            </select>
                                        </CandidateFormField>
                                    </div>
                                </div>

                                <CandidateFormField label="Expected Salary (Monthly)">
                                    <div className="flex items-center gap-4 border-b border-zinc-200 pb-1">
                                        <select value={data.salary_currency} onChange={(event) => setData('salary_currency', event.target.value.toUpperCase())} className="w-20 border-none bg-transparent px-0 py-1.5 text-sm font-bold focus:ring-0">
                                            <option value="USD">USD</option>
                                            <option value="ZAR">ZAR</option>
                                            <option value="EUR">EUR</option>
                                            <option value="GBP">GBP</option>
                                        </select>
                                        <input value={data.expected_salary} onChange={(event) => setData('expected_salary', event.target.value)} className="flex-1 border-none bg-transparent px-0 py-1.5 text-sm font-medium outline-none focus:ring-0" placeholder="e.g. 12000" />
                                    </div>
                                </CandidateFormField>

                                <CandidateFormField label="Professional Summary">
                                    <textarea
                                        rows={4}
                                        value={data.professional_summary}
                                        onChange={(event) => setData('professional_summary', event.target.value)}
                                        className={candidateTextAreaClassName}
                                        placeholder="Summarize the candidate's professional background..."
                                    />
                                </CandidateFormField>
                            </div>
                        </section>

                        <div className="flex flex-wrap gap-3">
                            <Button type="submit" disabled={processing} className={candidatePrimaryButtonClassName}>
                                <Save className="mr-2 h-4 w-4" />
                                Save Candidate
                            </Button>
                            <Link href="/candidate-profiles">
                                <Button type="button" variant="outline" className={candidateSecondaryButtonClassName}>
                                    <X className="mr-2 h-4 w-4" />
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <RecruitmentCandidateSummaryCard
                            fullName={data.full_name || 'Candidate'}
                            headline={data.headline}
                            email={data.email}
                            phone={data.phone}
                            location={data.location}
                            metrics={[
                                { label: 'Visibility', value: formatCandidateLabel(data.profile_visibility_status) },
                                { label: 'Public', value: data.is_public ? 'Yes' : 'No' },
                            ]}
                        />

                        <div className={recruitmentCandidateMutedCardClassName}>
                            <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Profile checklist</p>
                            <ul className="mt-4 space-y-3 text-sm font-medium text-zinc-600">
                                <li>Capture complete identity and contact details.</li>
                                <li>Define the headline, experience, education, and salary expectation.</li>
                                <li>Choose whether the listing starts as draft, pending payment, or active.</li>
                            </ul>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
