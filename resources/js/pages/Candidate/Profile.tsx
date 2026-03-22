import { useForm, usePage } from '@inertiajs/react';
import { Briefcase, Mail, MapPin, Phone, User } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    CandidateHubLayout,
    CandidateInfoField,
    CandidateSectionCard,
} from './components/hub';
import type { CandidateExperience, CandidateUser } from './dummyData';

type PageProps = {
    candidate: CandidateUser & {
        alt_phone?: string | null;
        national_id?: string | null;
        is_public?: boolean;
    };
    experiences: CandidateExperience[];
    education_levels: string[];
    visibility_statuses: string[];
};

type ExperienceForm = {
    employer_name: string;
    job_title: string;
    start_date: string;
    end_date: string;
    currently_working: boolean;
    description: string;
};

const emptyExperience: ExperienceForm = {
    employer_name: '',
    job_title: '',
    start_date: '',
    end_date: '',
    currently_working: false,
    description: '',
};

export default function CandidateProfilePage() {
    const { candidate, experiences, education_levels, visibility_statuses } = usePage<PageProps>().props;
    const [editingExperienceId, setEditingExperienceId] = useState<number | null>(null);

    const profileForm = useForm({
        full_name: candidate.full_name ?? '',
        email: candidate.email ?? '',
        phone: candidate.phone ?? '',
        alt_phone: candidate.alt_phone ?? '',
        national_id: candidate.national_id ?? '',
        gender: candidate.gender?.toLowerCase() ?? '',
        date_of_birth: candidate.date_of_birth ?? '',
        location: candidate.location ?? '',
        headline: candidate.headline ?? '',
        years_experience: candidate.years_experience?.toString() ?? '',
        expected_salary: candidate.expected_salary ?? '',
        salary_currency: candidate.salary_currency ?? 'USD',
        highest_education: candidate.highest_education ?? '',
        profile_visibility_status: candidate.profile_visibility_status ?? 'draft',
        is_public: Boolean(candidate.is_public),
    });

    const summaryForm = useForm({
        professional_summary: candidate.professional_summary ?? '',
        headline: candidate.headline ?? '',
        years_experience: candidate.years_experience?.toString() ?? '',
        highest_education: candidate.highest_education ?? '',
        expected_salary: candidate.expected_salary ?? '',
        salary_currency: candidate.salary_currency ?? 'USD',
    });

    const experienceForm = useForm<ExperienceForm>(emptyExperience);

    const editingExperience = useMemo(
        () => experiences.find((experience) => experience.id === editingExperienceId) ?? null,
        [editingExperienceId, experiences],
    );

    const submitExperience = () => {
        if (editingExperienceId) {
            experienceForm.put(`/candidate/profile/experiences/${editingExperienceId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingExperienceId(null);
                    experienceForm.reset();
                },
            });

            return;
        }

        experienceForm.post('/candidate/profile/experiences', {
            preserveScroll: true,
            onSuccess: () => experienceForm.reset(),
        });
    };

    const startEditingExperience = (experience: CandidateExperience) => {
        setEditingExperienceId(experience.id);
        experienceForm.setData({
            employer_name: experience.employer_name,
            job_title: experience.job_title,
            start_date: experience.start_date ?? '',
            end_date: experience.end_date ?? '',
            currently_working: experience.currently_working,
            description: experience.description ?? '',
        });
    };

    return (
        <CandidateHubLayout
            title="My Profile"
            subtitle="Manage your personal information, summary, and work experience."
            active="profile"
            candidate={candidate}
        >
            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-6">
                    <CandidateSectionCard title="Personal Information" icon={<User className="h-4 w-4" />}>
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField label="Full Name" error={profileForm.errors.full_name}>
                                <input value={profileForm.data.full_name} onChange={(event) => profileForm.setData('full_name', event.target.value)} className={inputClassName} />
                            </FormField>
                            <FormField label="Email" error={profileForm.errors.email}>
                                <input type="email" value={profileForm.data.email} onChange={(event) => profileForm.setData('email', event.target.value)} className={inputClassName} />
                            </FormField>
                            <FormField label="Phone" error={profileForm.errors.phone}>
                                <input value={profileForm.data.phone} onChange={(event) => profileForm.setData('phone', event.target.value)} className={inputClassName} />
                            </FormField>
                            <FormField label="Alt Phone" error={profileForm.errors.alt_phone}>
                                <input value={profileForm.data.alt_phone} onChange={(event) => profileForm.setData('alt_phone', event.target.value)} className={inputClassName} />
                            </FormField>
                            <FormField label="National ID" error={profileForm.errors.national_id}>
                                <input value={profileForm.data.national_id} onChange={(event) => profileForm.setData('national_id', event.target.value)} className={inputClassName} />
                            </FormField>
                            <FormField label="Gender" error={profileForm.errors.gender}>
                                <select value={profileForm.data.gender} onChange={(event) => profileForm.setData('gender', event.target.value)} className={inputClassName}>
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="prefer_not_to_say">Prefer not to say</option>
                                </select>
                            </FormField>
                            <FormField label="Date of Birth" error={profileForm.errors.date_of_birth}>
                                <input type="date" value={profileForm.data.date_of_birth} onChange={(event) => profileForm.setData('date_of_birth', event.target.value)} className={inputClassName} />
                            </FormField>
                            <FormField label="Location" error={profileForm.errors.location}>
                                <input value={profileForm.data.location} onChange={(event) => profileForm.setData('location', event.target.value)} className={inputClassName} />
                            </FormField>
                            <FormField label="Visibility" error={profileForm.errors.profile_visibility_status}>
                                <select
                                    value={profileForm.data.profile_visibility_status}
                                    onChange={(event) => profileForm.setData('profile_visibility_status', event.target.value)}
                                    className={inputClassName}
                                >
                                    {visibility_statuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status.replace(/_/g, ' ')}
                                        </option>
                                    ))}
                                </select>
                            </FormField>
                            <FormField label="Public Listing">
                                <label className="flex items-center gap-2 text-sm text-foreground">
                                    <input
                                        type="checkbox"
                                        checked={profileForm.data.is_public}
                                        onChange={(event) => profileForm.setData('is_public', event.target.checked)}
                                    />
                                    Visible to employers
                                </label>
                            </FormField>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button onClick={() => profileForm.put('/candidate/profile', { preserveScroll: true })} disabled={profileForm.processing}>
                                Save Personal Information
                            </Button>
                        </div>
                    </CandidateSectionCard>

                    <CandidateSectionCard title="Professional Summary" icon={<Briefcase className="h-4 w-4" />}>
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField label="Headline" error={summaryForm.errors.headline}>
                                <input value={summaryForm.data.headline} onChange={(event) => summaryForm.setData('headline', event.target.value)} className={inputClassName} />
                            </FormField>
                            <FormField label="Years of Experience" error={summaryForm.errors.years_experience}>
                                <input type="number" min="0" value={summaryForm.data.years_experience} onChange={(event) => summaryForm.setData('years_experience', event.target.value)} className={inputClassName} />
                            </FormField>
                            <FormField label="Highest Education" error={summaryForm.errors.highest_education}>
                                <select value={summaryForm.data.highest_education} onChange={(event) => summaryForm.setData('highest_education', event.target.value)} className={inputClassName}>
                                    <option value="">Select education level</option>
                                    {education_levels.map((level) => (
                                        <option key={level} value={level}>
                                            {level.replace(/_/g, ' ')}
                                        </option>
                                    ))}
                                </select>
                            </FormField>
                            <div className="grid gap-4 md:grid-cols-2 md:col-span-2">
                                <FormField label="Expected Salary" error={summaryForm.errors.expected_salary}>
                                    <input value={summaryForm.data.expected_salary} onChange={(event) => summaryForm.setData('expected_salary', event.target.value)} className={inputClassName} />
                                </FormField>
                                <FormField label="Currency" error={summaryForm.errors.salary_currency}>
                                    <input value={summaryForm.data.salary_currency} onChange={(event) => summaryForm.setData('salary_currency', event.target.value.toUpperCase())} className={inputClassName} />
                                </FormField>
                            </div>
                            <FormField label="Summary" error={summaryForm.errors.professional_summary} className="md:col-span-2">
                                <Textarea
                                    rows={6}
                                    value={summaryForm.data.professional_summary}
                                    onChange={(event) => summaryForm.setData('professional_summary', event.target.value)}
                                    placeholder="Summarize your professional background, key strengths, and target roles."
                                />
                            </FormField>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button onClick={() => summaryForm.put('/candidate/profile/summary', { preserveScroll: true })} disabled={summaryForm.processing}>
                                Save Summary
                            </Button>
                        </div>
                    </CandidateSectionCard>

                    <CandidateSectionCard title={editingExperience ? 'Edit Experience' : 'Add Experience'} icon={<Briefcase className="h-4 w-4" />}>
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField label="Employer" error={experienceForm.errors.employer_name}>
                                <input value={experienceForm.data.employer_name} onChange={(event) => experienceForm.setData('employer_name', event.target.value)} className={inputClassName} />
                            </FormField>
                            <FormField label="Job Title" error={experienceForm.errors.job_title}>
                                <input value={experienceForm.data.job_title} onChange={(event) => experienceForm.setData('job_title', event.target.value)} className={inputClassName} />
                            </FormField>
                            <FormField label="Start Date" error={experienceForm.errors.start_date}>
                                <input type="date" value={experienceForm.data.start_date} onChange={(event) => experienceForm.setData('start_date', event.target.value)} className={inputClassName} />
                            </FormField>
                            <FormField label="End Date" error={experienceForm.errors.end_date}>
                                <input
                                    type="date"
                                    value={experienceForm.data.end_date}
                                    disabled={experienceForm.data.currently_working}
                                    onChange={(event) => experienceForm.setData('end_date', event.target.value)}
                                    className={inputClassName}
                                />
                            </FormField>
                            <FormField label="Current Role">
                                <label className="flex items-center gap-2 text-sm text-foreground">
                                    <input
                                        type="checkbox"
                                        checked={experienceForm.data.currently_working}
                                        onChange={(event) => experienceForm.setData('currently_working', event.target.checked)}
                                    />
                                    I currently work here
                                </label>
                            </FormField>
                            <FormField label="Description" error={experienceForm.errors.description} className="md:col-span-2">
                                <Textarea
                                    rows={5}
                                    value={experienceForm.data.description}
                                    onChange={(event) => experienceForm.setData('description', event.target.value)}
                                    placeholder="Describe your responsibilities and achievements."
                                />
                            </FormField>
                        </div>
                        <div className="mt-4 flex gap-2 justify-end">
                            {editingExperience && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setEditingExperienceId(null);
                                        experienceForm.reset();
                                    }}
                                >
                                    Cancel
                                </Button>
                            )}
                            <Button onClick={submitExperience} disabled={experienceForm.processing}>
                                {editingExperience ? 'Update Experience' : 'Add Experience'}
                            </Button>
                        </div>
                    </CandidateSectionCard>
                </div>

                <div className="space-y-6">
                    <CandidateSectionCard title="Profile Snapshot" icon={<User className="h-4 w-4" />}>
                        <div className="grid gap-4">
                            <CandidateInfoField label="Email" value={candidate.email} icon={<Mail className="h-3.5 w-3.5" />} />
                            <CandidateInfoField label="Phone" value={candidate.phone} icon={<Phone className="h-3.5 w-3.5" />} />
                            <CandidateInfoField label="Location" value={candidate.location} icon={<MapPin className="h-3.5 w-3.5" />} />
                            <CandidateInfoField label="Headline" value={candidate.headline} icon={<Briefcase className="h-3.5 w-3.5" />} />
                        </div>
                    </CandidateSectionCard>

                    <CandidateSectionCard title="Work Experience" icon={<Briefcase className="h-4 w-4" />}>
                        <div className="space-y-4">
                            {experiences.map((experience) => (
                                <div key={experience.id} className="rounded-lg border border-border bg-background p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">{experience.job_title}</p>
                                            <p className="text-xs text-muted-foreground">{experience.employer_name}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button type="button" variant="outline" size="sm" onClick={() => startEditingExperience(experience)}>
                                                Edit
                                            </Button>
                                            <Button type="button" variant="destructive" size="sm" onClick={() => window.confirm('Delete this experience?') && experienceForm.delete(`/candidate/profile/experiences/${experience.id}`)}>
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                    {experience.description && <p className="mt-2 text-sm text-muted-foreground">{experience.description}</p>}
                                </div>
                            ))}
                            {experiences.length === 0 && <p className="text-sm text-muted-foreground">No experience records added yet.</p>}
                        </div>
                    </CandidateSectionCard>
                </div>
            </div>
        </CandidateHubLayout>
    );
}

function FormField({
    label,
    error,
    children,
    className,
}: {
    label: string;
    error?: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={`grid gap-2 ${className ?? ''}`}>
            <label className="text-sm font-medium text-foreground">{label}</label>
            {children}
            <InputError message={error} />
        </div>
    );
}

const inputClassName = 'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm';
