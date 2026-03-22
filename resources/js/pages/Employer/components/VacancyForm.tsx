import { useForm } from '@inertiajs/react';
import type { ReactNode } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { Vacancy } from '../dummyData';

type VacancyFormProps = {
    vacancy: Vacancy | null;
    options: {
        categories: string[];
        employment_types: string[];
        work_modes: string[];
    };
    action: string;
    method: 'post' | 'put';
    submitLabel: string;
};

export function VacancyForm({ vacancy, options, action, method, submitLabel }: VacancyFormProps) {
    const form = useForm({
        title: vacancy?.title ?? '',
        department: vacancy?.department ?? '',
        category: vacancy?.category ?? '',
        employment_type: vacancy?.employment_type?.toLowerCase().replace(/ /g, '_') ?? options.employment_types[0] ?? 'full_time',
        work_mode: vacancy?.work_mode?.toLowerCase().replace(/ /g, '_') ?? options.work_modes[0] ?? 'onsite',
        location: vacancy?.location ?? '',
        description: vacancy?.description ?? '',
        requirements: vacancy?.requirements ?? '',
        responsibilities: vacancy?.responsibilities ?? '',
        salary_min: vacancy?.salary_min ?? '',
        salary_max: vacancy?.salary_max ?? '',
        currency: vacancy?.currency ?? 'USD',
        application_deadline: vacancy?.application_deadline ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (method === 'put') {
            form.put(action, { preserveScroll: true });
        } else {
            form.post(action, { preserveScroll: true });
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                
                <FormField label="Job Title" error={form.errors.title} className="md:col-span-2">
                    <input 
                        value={form.data.title} 
                        onChange={(event) => form.setData('title', event.target.value)} 
                        className={underlinedInput} 
                        placeholder="e.g. Senior Product Designer"
                    />
                </FormField>

                <FormField label="Department" error={form.errors.department}>
                    <input 
                        value={form.data.department} 
                        onChange={(event) => form.setData('department', event.target.value)} 
                        className={underlinedInput} 
                        placeholder="e.g. Engineering"
                    />
                </FormField>

                <FormField label="Category" error={form.errors.category}>
                    <select 
                        value={form.data.category} 
                        onChange={(event) => form.setData('category', event.target.value)} 
                        className={underlinedInput}
                    >
                        <option value="">Select category</option>
                        {options.categories.map((category) => (
                            <option key={category} value={category}>
                                {category.replace(/_/g, ' ')}
                            </option>
                        ))}
                    </select>
                </FormField>

                <FormField label="Employment Type" error={form.errors.employment_type}>
                    <select 
                        value={form.data.employment_type} 
                        onChange={(event) => form.setData('employment_type', event.target.value)} 
                        className={underlinedInput}
                    >
                        {options.employment_types.map((type) => (
                            <option key={type} value={type}>
                                {type.replace(/_/g, ' ')}
                            </option>
                        ))}
                    </select>
                </FormField>

                <FormField label="Work Mode" error={form.errors.work_mode}>
                    <select 
                        value={form.data.work_mode} 
                        onChange={(event) => form.setData('work_mode', event.target.value)} 
                        className={underlinedInput}
                    >
                        {options.work_modes.map((mode) => (
                            <option key={mode} value={mode}>
                                {mode.replace(/_/g, ' ')}
                            </option>
                        ))}
                    </select>
                </FormField>

                <FormField label="Location" error={form.errors.location}>
                    <input 
                        value={form.data.location} 
                        onChange={(event) => form.setData('location', event.target.value)} 
                        className={underlinedInput} 
                        placeholder="City, Country or Remote"
                    />
                </FormField>

                <FormField label="Application Deadline" error={form.errors.application_deadline}>
                    <input 
                        type="date" 
                        value={form.data.application_deadline} 
                        onChange={(event) => form.setData('application_deadline', event.target.value)} 
                        className={underlinedInput} 
                    />
                </FormField>

                <div className="md:col-span-2 grid grid-cols-3 gap-x-10">
                    <FormField label="Salary Min" error={form.errors.salary_min}>
                        <input 
                            value={form.data.salary_min} 
                            onChange={(event) => form.setData('salary_min', event.target.value)} 
                            className={underlinedInput} 
                        />
                    </FormField>
                    <FormField label="Salary Max" error={form.errors.salary_max}>
                        <input 
                            value={form.data.salary_max} 
                            onChange={(event) => form.setData('salary_max', event.target.value)} 
                            className={underlinedInput} 
                        />
                    </FormField>
                    <FormField label="Currency" error={form.errors.currency}>
                        <input 
                            value={form.data.currency} 
                            onChange={(event) => form.setData('currency', event.target.value.toUpperCase())} 
                            className={underlinedInput} 
                        />
                    </FormField>
                </div>

                <FormField label="Job Description" error={form.errors.description} className="md:col-span-2">
                    <Textarea
                        rows={5}
                        value={form.data.description}
                        onChange={(event) => form.setData('description', event.target.value)}
                        className="w-full bg-transparent border border-zinc-200 focus:ring-0 focus:border-black p-3 transition-all text-black rounded-sm min-h-[120px] text-sm"
                        placeholder="Describe the role..."
                    />
                </FormField>

                <FormField label="Requirements" error={form.errors.requirements} className="md:col-span-2">
                    <Textarea
                        rows={4}
                        value={form.data.requirements}
                        onChange={(event) => form.setData('requirements', event.target.value)}
                        className="w-full bg-transparent border border-zinc-200 focus:ring-0 focus:border-black p-3 transition-all text-black rounded-sm min-h-[100px] text-sm"
                        placeholder="List the required skills..."
                    />
                </FormField>

                <FormField label="Responsibilities" error={form.errors.responsibilities} className="md:col-span-2">
                    <Textarea
                        rows={4}
                        value={form.data.responsibilities}
                        onChange={(event) => form.setData('responsibilities', event.target.value)}
                        className="w-full bg-transparent border border-zinc-200 focus:ring-0 focus:border-black p-3 transition-all text-black rounded-sm min-h-[100px] text-sm"
                        placeholder="Key duties and day-to-day tasks..."
                    />
                </FormField>
            </div>

            <div className="pt-4 flex justify-end">
                <Button 
                    className="bg-black text-white px-6 py-5 h-auto rounded-md font-bold text-sm tracking-tight active:scale-95 transition-all"
                    disabled={form.processing}
                >
                    {submitLabel}
                </Button>
            </div>
        </form>
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
        <div className={`space-y-1.5 ${className ?? ''}`}>
            <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                {label}
            </label>
            {children}
            <InputError message={error} />
        </div>
    );
}

const underlinedInput = 
    "w-full bg-transparent border-0 border-b border-zinc-200/50 focus:ring-0 focus:border-black px-0 py-2 transition-all text-black placeholder:text-zinc-300 font-medium text-sm outline-none appearance-none";