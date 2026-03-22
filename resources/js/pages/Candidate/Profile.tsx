import { useForm, usePage } from '@inertiajs/react';
import {
    Briefcase,
    Download,
    Mail,
    MapPin,
    Phone,
    User,
    Edit2,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import {
    CandidateHubLayout,
    getInitials,
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
    const { candidate, experiences, education_levels, visibility_statuses } =
        usePage<PageProps>().props;
    const [editingExperienceId, setEditingExperienceId] = useState<
        number | null
    >(null);

    const profileForm = useForm({
        full_name: candidate.full_name ?? '',
        email: candidate.email ?? '',
        phone: candidate.phone ?? '',
        alt_phone: candidate.alt_phone ?? '',
        national_id: candidate.national_id ?? '',
        gender: candidate.gender?.toLowerCase() ?? '',
        date_of_birth: candidate.date_of_birth ?? '',
        location: candidate.location ?? '',
        profile_visibility_status:
            candidate.profile_visibility_status ?? 'draft',
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

    const submitExperience = () => {
        if (editingExperienceId) {
            experienceForm.put(
                `/candidate/profile/experiences/${editingExperienceId}`,
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setEditingExperienceId(null);
                        experienceForm.reset();
                    },
                },
            );
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
            title="Profile Settings"
            active="profile"
            candidate={candidate}
        >
            <div className="w-full px-6 md:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-black tracking-tighter leading-none text-black mb-2 uppercase">
                        Profile Settings.
                    </h1>
                    <p className="max-w-2xl text-sm font-medium text-zinc-500">
                        Manage your professional identity and visibility across
                        the recruitment network.
                    </p>
                </div>

                <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                    
                    {/* Left Column: Forms */}
                    <div className="space-y-10">
                        
                        {/* 1. Personal Information Form */}
                        <section>
                            <div className="mb-6 flex items-center gap-2">
                                <User className="h-5 w-5 text-black" />
                                <h3 className="text-lg font-bold tracking-tight text-black uppercase">
                                    Personal Information
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                                <FormField label="Full Name" error={profileForm.errors.full_name}>
                                    <input
                                        value={profileForm.data.full_name}
                                        onChange={(e) => profileForm.setData('full_name', e.target.value)}
                                        className={underlinedInput}
                                    />
                                </FormField>
                                <FormField label="Email Address" error={profileForm.errors.email}>
                                    <input
                                        type="email"
                                        value={profileForm.data.email}
                                        onChange={(e) => profileForm.setData('email', e.target.value)}
                                        className={underlinedInput}
                                    />
                                </FormField>
                                <FormField label="Phone Number" error={profileForm.errors.phone}>
                                    <input
                                        value={profileForm.data.phone}
                                        onChange={(e) => profileForm.setData('phone', e.target.value)}
                                        className={underlinedInput}
                                    />
                                </FormField>
                                <FormField label="Alt Phone" error={profileForm.errors.alt_phone}>
                                    <input
                                        value={profileForm.data.alt_phone}
                                        onChange={(e) => profileForm.setData('alt_phone', e.target.value)}
                                        placeholder="Optional"
                                        className={underlinedInput}
                                    />
                                </FormField>
                                <FormField label="National ID" error={profileForm.errors.national_id}>
                                    <input
                                        value={profileForm.data.national_id}
                                        onChange={(e) => profileForm.setData('national_id', e.target.value)}
                                        className={underlinedInput}
                                    />
                                </FormField>
                                <FormField label="Gender" error={profileForm.errors.gender}>
                                    <select
                                        value={profileForm.data.gender}
                                        onChange={(e) => profileForm.setData('gender', e.target.value)}
                                        className={underlinedInput}
                                    >
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="non-binary">Non-binary</option>
                                        <option value="prefer_not_to_say">Prefer not to say</option>
                                    </select>
                                </FormField>
                                <FormField label="Date of Birth" error={profileForm.errors.date_of_birth}>
                                    <input
                                        type="date"
                                        value={profileForm.data.date_of_birth}
                                        onChange={(e) => profileForm.setData('date_of_birth', e.target.value)}
                                        className={underlinedInput}
                                    />
                                </FormField>
                                <FormField label="Location" error={profileForm.errors.location}>
                                    <input
                                        value={profileForm.data.location}
                                        onChange={(e) => profileForm.setData('location', e.target.value)}
                                        className={underlinedInput}
                                    />
                                </FormField>
                            </div>

                            <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-sm border border-zinc-200 bg-zinc-50 p-5 md:flex-row">
                                <div className="flex w-full items-center gap-5 md:w-auto">
                                    <div className="w-full space-y-1 md:w-auto">
                                        <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                                            Visibility
                                        </label>
                                        <select
                                            value={profileForm.data.profile_visibility_status}
                                            onChange={(e) => profileForm.setData('profile_visibility_status', e.target.value)}
                                            className="cursor-pointer border-none bg-transparent p-0 text-sm font-bold focus:ring-0"
                                        >
                                            {visibility_statuses.map((status) => (
                                                <option key={status} value={status}>
                                                    {status.replace(/_/g, ' ')}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="hidden h-8 w-px bg-zinc-200 md:block"></div>
                                    <label className="group flex cursor-pointer items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={profileForm.data.is_public}
                                            onChange={(e) => profileForm.setData('is_public', e.target.checked)}
                                            className="h-4 w-4 rounded-none border-black text-black transition-all focus:ring-0"
                                        />
                                        <span className="text-xs font-bold text-zinc-700">
                                            Public Listing
                                        </span>
                                    </label>
                                </div>
                                <Button
                                    className="h-auto w-full rounded-sm bg-black px-6 py-3 text-[10px] font-bold tracking-widest text-white uppercase transition-all hover:bg-zinc-800 md:w-auto"
                                    onClick={() => profileForm.put('/candidate/profile')}
                                    disabled={profileForm.processing}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </section>

                        {/* 2. Professional Summary Form */}
                        <section>
                            <div className="mb-6 flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-black" />
                                <h3 className="text-lg font-bold tracking-tight text-black uppercase">
                                    Professional Summary
                                </h3>
                            </div>

                            <div className="space-y-5">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <FormField label="Professional Headline" error={summaryForm.errors.headline}>
                                        <input
                                            value={summaryForm.data.headline}
                                            onChange={(e) => summaryForm.setData('headline', e.target.value)}
                                            className={underlinedInput}
                                        />
                                    </FormField>

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField label="Experience (Yrs)" error={summaryForm.errors.years_experience}>
                                            <input
                                                type="number"
                                                min="0"
                                                value={summaryForm.data.years_experience}
                                                onChange={(e) => summaryForm.setData('years_experience', e.target.value)}
                                                className={underlinedInput}
                                            />
                                        </FormField>
                                        <FormField label="Education" error={summaryForm.errors.highest_education}>
                                            <select
                                                value={summaryForm.data.highest_education}
                                                onChange={(e) => summaryForm.setData('highest_education', e.target.value)}
                                                className={underlinedInput}
                                            >
                                                <option value="">Select level</option>
                                                {education_levels.map((level) => (
                                                    <option key={level} value={level}>
                                                        {level.replace(/_/g, ' ')}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormField>
                                    </div>
                                </div>

                                <FormField label="Expected Salary (Monthly)" error={summaryForm.errors.expected_salary}>
                                    <div className="flex items-center gap-4 border-b border-zinc-200 pb-1">
                                        <select
                                            value={summaryForm.data.salary_currency}
                                            onChange={(e) => summaryForm.setData('salary_currency', e.target.value.toUpperCase())}
                                            className="w-20 border-none bg-transparent px-0 py-1.5 text-sm font-bold focus:ring-0"
                                        >
                                            <option value="USD">USD</option>
                                            <option value="EUR">EUR</option>
                                            <option value="GBP">GBP</option>
                                        </select>
                                        <input
                                            value={summaryForm.data.expected_salary}
                                            onChange={(e) => summaryForm.setData('expected_salary', e.target.value)}
                                            className="flex-1 border-none bg-transparent px-0 py-1.5 text-sm font-medium outline-none focus:ring-0"
                                            placeholder="e.g. 12000"
                                        />
                                    </div>
                                </FormField>

                                <FormField label="Professional Summary" error={summaryForm.errors.professional_summary}>
                                    <Textarea
                                        rows={4}
                                        value={summaryForm.data.professional_summary}
                                        onChange={(e) => summaryForm.setData('professional_summary', e.target.value)}
                                        className="w-full resize-none rounded-sm border border-zinc-200 bg-zinc-50 p-3 text-sm leading-relaxed transition-all focus:border-black focus:ring-1 focus:ring-black"
                                        placeholder="Summarize your professional background..."
                                    />
                                </FormField>

                                <div className="flex justify-end pt-2">
                                    <Button
                                        type="button"
                                        className="h-auto rounded-sm bg-black px-6 py-3 text-[10px] font-bold tracking-widest text-white uppercase transition-all hover:bg-zinc-800"
                                        onClick={() => summaryForm.put('/candidate/profile/summary')}
                                        disabled={summaryForm.processing}
                                    >
                                        Save Summary
                                    </Button>
                                </div>
                            </div>
                        </section>

                        {/* 3. Experience Form */}
                        <section className="rounded-sm border-2 border-black/5 bg-zinc-50/50 p-6">
                            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-5 w-5 text-black" />
                                    <h3 className="text-lg font-bold tracking-tight text-black uppercase">
                                        {editingExperienceId
                                            ? 'Edit Experience'
                                            : 'Add Work Experience'}
                                    </h3>
                                </div>
                                <span className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase">
                                    Step 3 of 5
                                </span>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <FormField label="Employer" error={experienceForm.errors.employer_name}>
                                        <input
                                            value={experienceForm.data.employer_name}
                                            onChange={(e) => experienceForm.setData('employer_name', e.target.value)}
                                            className={underlinedInput}
                                            placeholder="e.g. Meta, Stripe"
                                        />
                                    </FormField>
                                    <FormField label="Job Title" error={experienceForm.errors.job_title}>
                                        <input
                                            value={experienceForm.data.job_title}
                                            onChange={(e) => experienceForm.setData('job_title', e.target.value)}
                                            className={underlinedInput}
                                            placeholder="e.g. Lead Designer"
                                        />
                                    </FormField>
                                </div>

                                <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-2">
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField label="Start Date" error={experienceForm.errors.start_date}>
                                            <MonthYearInput
                                                value={experienceForm.data.start_date}
                                                onChange={(value) => experienceForm.setData('start_date', value)}
                                            />
                                        </FormField>
                                        <FormField label="End Date" error={experienceForm.errors.end_date}>
                                            <MonthYearInput
                                                value={experienceForm.data.end_date}
                                                disabled={experienceForm.data.currently_working}
                                                onChange={(value) => experienceForm.setData('end_date', value)}
                                            />
                                        </FormField>
                                    </div>
                                    <label className="group flex cursor-pointer items-center gap-2 py-2">
                                        <input
                                            type="checkbox"
                                            checked={experienceForm.data.currently_working}
                                            onChange={(e) => experienceForm.setData('currently_working', e.target.checked)}
                                            className="h-4 w-4 rounded-none border-black text-black transition-all focus:ring-0"
                                        />
                                        <span className="text-xs font-bold text-zinc-700">
                                            I currently work here
                                        </span>
                                    </label>
                                </div>

                                <FormField label="Responsibilities & Achievements" error={experienceForm.errors.description}>
                                    <Textarea
                                        rows={3}
                                        value={experienceForm.data.description}
                                        onChange={(e) => experienceForm.setData('description', e.target.value)}
                                        className="w-full resize-none rounded-sm border border-zinc-200 bg-white p-3 text-sm leading-relaxed transition-all focus:border-black focus:ring-1 focus:ring-black"
                                        placeholder="Describe your impact..."
                                    />
                                </FormField>

                                <div className="flex flex-wrap gap-3 pt-2">
                                    <Button
                                        onClick={submitExperience}
                                        disabled={experienceForm.processing}
                                        className="h-auto flex-1 rounded-sm bg-black px-6 py-3 text-[10px] font-bold tracking-widest text-white uppercase transition-all hover:bg-zinc-800 sm:flex-none"
                                    >
                                        {editingExperienceId ? 'Update Experience' : 'Add Experience'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setEditingExperienceId(null);
                                            experienceForm.reset();
                                        }}
                                        className="h-auto flex-1 rounded-sm border-zinc-200 px-6 py-3 text-[10px] font-bold tracking-widest text-zinc-600 uppercase transition-all hover:bg-zinc-100 sm:flex-none"
                                    >
                                        Discard
                                    </Button>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Summaries & Lists */}
                    <div className="space-y-8">
                        
                        {/* 4. Profile Summary Card (No longer sticky) */}
                        <div className="border border-zinc-200/50 bg-white p-6 shadow-sm">
                            <div className="mb-8 flex flex-col items-center text-center">
                                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-sm bg-black text-2xl font-black text-white">
                                    {getInitials(candidate.full_name)}
                                </div>
                                <h2 className="text-2xl font-black tracking-tighter text-black uppercase">
                                    {candidate.full_name || 'Candidate'}
                                </h2>
                                <p className="mt-1 text-sm font-bold tracking-wide text-zinc-500">
                                    {candidate.headline || 'No headline set'}
                                </p>
                            </div>

                            <div className="space-y-4 border-t border-zinc-100 pt-6">
                                <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={candidate.email} />
                                <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={candidate.phone} />
                                <InfoRow icon={<MapPin className="h-4 w-4" />} label="Location" value={candidate.location} />
                            </div>

                            <div className="mt-8 grid grid-cols-2 gap-3">
                                <div className="rounded-sm border border-zinc-100 bg-zinc-50 p-3 text-center">
                                    <p className="text-xl font-black text-black">
                                        {candidate.years_experience || 0}
                                    </p>
                                    <p className="mt-1 text-[9px] font-bold tracking-widest text-zinc-400 uppercase">
                                        Years Exp.
                                    </p>
                                </div>
                                <div className="rounded-sm border border-zinc-100 bg-zinc-50 p-3 text-center">
                                    <p className="text-xl font-black text-black">
                                        {experiences.length}
                                    </p>
                                    <p className="mt-1 text-[9px] font-bold tracking-widest text-zinc-400 uppercase">
                                        Roles
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 5. Work Experience List */}
                        <div className="space-y-5">
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-lg font-bold tracking-tight text-black uppercase">
                                    Experience History
                                </h3>
                                <span className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase">
                                    {experiences.length} Entries
                                </span>
                            </div>

                            <div className="space-y-3">
                                {experiences.map((experience, index) => (
                                    <div
                                        key={experience.id}
                                        className={`group border bg-white p-5 ${index === 0 ? 'border-zinc-300' : 'border-zinc-100'} rounded-sm transition-all hover:border-black`}
                                    >
                                        <div className="mb-3 flex items-start justify-between">
                                            <div>
                                                <h4 className="text-base font-black text-black uppercase">
                                                    {experience.job_title}
                                                </h4>
                                                <p className="mt-0.5 text-xs font-bold text-zinc-500">
                                                    {experience.employer_name} •{' '}
                                                    {experience.start_date
                                                        ? new Date(experience.start_date).getFullYear()
                                                        : ''}{' '}
                                                    -{' '}
                                                    {experience.currently_working
                                                        ? 'Present'
                                                        : experience.end_date
                                                          ? new Date(experience.end_date).getFullYear()
                                                          : ''}
                                                </p>
                                            </div>
                                            <div className="flex gap-1 opacity-0 transition-all group-hover:opacity-100">
                                                <button
                                                    type="button"
                                                    onClick={() => startEditingExperience(experience)}
                                                    className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-black"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        window.confirm('Delete this experience?') &&
                                                        experienceForm.delete(`/candidate/profile/experiences/${experience.id}`)
                                                    }
                                                    className="rounded-md p-1.5 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        {experience.description && (
                                            <p className="text-xs leading-relaxed text-zinc-600">
                                                {experience.description}
                                            </p>
                                        )}
                                    </div>
                                ))}

                                {experiences.length === 0 && (
                                    <div className="rounded-sm border border-dashed border-zinc-200 bg-zinc-50/50 p-6 text-center">
                                        <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                                            No experience records added.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-sm border-2 border-dashed border-zinc-200 py-3 text-[10px] font-black tracking-widest text-zinc-400 uppercase transition-all hover:border-black hover:bg-zinc-50 hover:text-black">
                                <Download size={14} />
                                Download Full Resume (PDF)
                            </button>
                        </div>
                    </div>
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
        <div className={`space-y-1 ${className ?? ''}`}>
            <label className="block text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase">
                {label}
            </label>
            {children}
            <InputError message={error} />
        </div>
    );
}

function MonthYearInput({
    value,
    onChange,
    disabled = false,
}: {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}) {
    const [year = '', month = ''] = value ? value.split('-') : ['', ''];

    const handleYearChange = (nextYear: string) => {
        const cleanedYear = nextYear.replace(/\D/g, '').slice(0, 4);

        if (!cleanedYear && !month) {
            onChange('');
            return;
        }

        onChange(`${cleanedYear}${month ? `-${month}` : ''}`);
    };

    const handleMonthChange = (nextMonth: string) => {
        if (!year && !nextMonth) {
            onChange('');
            return;
        }

        onChange(`${year}${nextMonth ? `-${nextMonth}` : ''}`);
    };

    return (
        <div className="grid grid-cols-[1fr_90px] gap-3">
            <input
                type="text"
                inputMode="numeric"
                placeholder="Year"
                value={year}
                disabled={disabled}
                onChange={(e) => handleYearChange(e.target.value)}
                className={underlinedInput}
            />

            <select
                value={month}
                disabled={disabled}
                onChange={(e) => handleMonthChange(e.target.value)}
                className={underlinedInput}
            >
                <option value="">Mo</option>
                <option value="01">Jan</option>
                <option value="02">Feb</option>
                <option value="03">Mar</option>
                <option value="04">Apr</option>
                <option value="05">May</option>
                <option value="06">Jun</option>
                <option value="07">Jul</option>
                <option value="08">Aug</option>
                <option value="09">Sep</option>
                <option value="10">Oct</option>
                <option value="11">Nov</option>
                <option value="12">Dec</option>
            </select>
        </div>
    );
}

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: ReactNode;
    label: string;
    value?: string | null;
}) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-zinc-100 bg-zinc-50 text-zinc-400">
                {icon}
            </div>
            <div className="text-left min-w-0 flex-1">
                <p className="mb-0.5 text-[9px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
                    {label}
                </p>
                <p className="text-xs font-bold text-black truncate">
                    {value || 'Not provided'}
                </p>
            </div>
        </div>
    );
}

const underlinedInput =
    'w-full bg-transparent border-0 border-b border-zinc-200 focus:ring-0 focus:border-black px-0 py-1.5 transition-all text-sm font-semibold text-black placeholder:text-zinc-300 placeholder:font-medium appearance-none outline-none';