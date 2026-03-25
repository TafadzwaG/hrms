import { useForm } from '@inertiajs/react';
import type { ReactNode } from 'react';

import InputError from '@/components/input-error';
import { RichTextEditor } from '@/components/rich-text';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
                    <Select
                        value={form.data.category || '__empty__'}
                        onValueChange={(value) => form.setData('category', value === '__empty__' ? '' : value)}
                    >
                        <SelectTrigger className={selectTriggerClass}>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="__empty__">Select category</SelectItem>
                        {options.categories.map((category) => (
                            <SelectItem key={category} value={category}>
                                {category.replace(/_/g, ' ')}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </FormField>

                <FormField label="Employment Type" error={form.errors.employment_type}>
                    <Select
                        value={form.data.employment_type}
                        onValueChange={(value) => form.setData('employment_type', value)}
                    >
                        <SelectTrigger className={selectTriggerClass}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                        {options.employment_types.map((type) => (
                            <SelectItem key={type} value={type}>
                                {type.replace(/_/g, ' ')}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </FormField>

                <FormField label="Work Mode" error={form.errors.work_mode}>
                    <Select
                        value={form.data.work_mode}
                        onValueChange={(value) => form.setData('work_mode', value)}
                    >
                        <SelectTrigger className={selectTriggerClass}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                        {options.work_modes.map((mode) => (
                            <SelectItem key={mode} value={mode}>
                                {mode.replace(/_/g, ' ')}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
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
                    <RichTextEditor
                        value={form.data.description}
                        onChange={(value) => form.setData('description', value)}
                        placeholder="Describe the role..."
                    />
                </FormField>

                <FormField label="Requirements" error={form.errors.requirements} className="md:col-span-2">
                    <RichTextEditor
                        value={form.data.requirements}
                        onChange={(value) => form.setData('requirements', value)}
                        placeholder="List the required skills..."
                    />
                </FormField>

                <FormField label="Responsibilities" error={form.errors.responsibilities} className="md:col-span-2">
                    <RichTextEditor
                        value={form.data.responsibilities}
                        onChange={(value) => form.setData('responsibilities', value)}
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
    "w-full bg-transparent border-0 border-b border-zinc-200/50 focus:ring-0 focus:border-black px-0 py-2 text-sm text-black placeholder:text-zinc-300 outline-none appearance-none transition-all";
const selectTriggerClass =
    "h-auto w-full rounded-none border-0 border-b border-zinc-200/50 bg-transparent px-0 py-2 text-sm text-black shadow-none focus:ring-0 focus:ring-offset-0";
