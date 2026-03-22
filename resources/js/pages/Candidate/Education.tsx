import { useForm, usePage } from '@inertiajs/react';
import { GraduationCap, Edit2, Trash2, Calendar, Award } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import {
    CandidateEmptyState,
    CandidateHubLayout,
    formatCandidateDate,
} from './components/hub';
import type { CandidateEducation, CandidateUser } from './dummyData';

type PageProps = {
    candidate: CandidateUser;
    educations: CandidateEducation[];
};

type EducationForm = {
    institution: string;
    qualification: string;
    field_of_study: string;
    start_date: string;
    end_date: string;
    grade: string;
};

const emptyEducation: EducationForm = {
    institution: '',
    qualification: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    grade: '',
};

export default function CandidateEducationPage() {
    const { candidate, educations } = usePage<PageProps>().props;
    const [editingEducationId, setEditingEducationId] = useState<number | null>(null);
    const form = useForm<EducationForm>(emptyEducation);

    const submit = () => {
        if (editingEducationId) {
            form.put(`/candidate/education/${editingEducationId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingEducationId(null);
                    form.reset();
                },
            });
            return;
        }

        form.post('/candidate/education', {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    return (
        <CandidateHubLayout
            title="Education"
            active="education"
            candidate={candidate}
        >
            <div className="w-full px-6 md:px-10">
                <div className="mb-12">
                    <h2 className="text-[2.5rem] font-black tracking-tighter leading-none text-black mb-2 uppercase">Education.</h2>
                    <p className="text-zinc-500 max-w-xl font-medium">Manage your academic history and certifications.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-zinc-50 border border-zinc-200 p-8 rounded-xl shadow-sm">
                            <div className="flex items-center gap-3 mb-8 border-b border-zinc-200 pb-4">
                                <GraduationCap className="h-5 w-5 text-black" />
                                <h3 className="text-lg font-bold tracking-tight text-black uppercase">
                                    {editingEducationId ? 'Edit Education' : 'Add Education'}
                                </h3>
                            </div>

                            <form className="space-y-6">
                                <FormField label="Institution" error={form.errors.institution}>
                                    <input
                                        value={form.data.institution}
                                        onChange={(event) => form.setData('institution', event.target.value)}
                                        className={underlinedInput}
                                        placeholder="e.g. Stanford University"
                                    />
                                </FormField>

                                <div className="grid grid-cols-2 gap-6">
                                    <FormField label="Qualification" error={form.errors.qualification}>
                                        <input
                                            value={form.data.qualification}
                                            onChange={(event) => form.setData('qualification', event.target.value)}
                                            className={underlinedInput}
                                            placeholder="e.g. Bachelor's"
                                        />
                                    </FormField>
                                    <FormField label="Grade" error={form.errors.grade}>
                                        <input
                                            value={form.data.grade}
                                            onChange={(event) => form.setData('grade', event.target.value)}
                                            className={underlinedInput}
                                            placeholder="e.g. 4.0 GPA"
                                        />
                                    </FormField>
                                </div>

                                <FormField label="Field of Study" error={form.errors.field_of_study}>
                                    <input
                                        value={form.data.field_of_study}
                                        onChange={(event) => form.setData('field_of_study', event.target.value)}
                                        className={underlinedInput}
                                        placeholder="e.g. Computer Science"
                                    />
                                </FormField>

                                <div className="grid grid-cols-2 gap-6">
                                    <FormField label="Start Date" error={form.errors.start_date}>
                                        <MonthYearInput
                                            value={form.data.start_date}
                                            onChange={(value) => form.setData('start_date', value)}
                                        />
                                    </FormField>
                                    <FormField label="End Date" error={form.errors.end_date}>
                                        <MonthYearInput
                                            value={form.data.end_date}
                                            onChange={(value) => form.setData('end_date', value)}
                                        />
                                    </FormField>
                                </div>

                                <div className="flex flex-wrap gap-4 pt-4">
                                    <Button
                                        type="button"
                                        className="flex-1 bg-black text-white py-6 h-auto text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors rounded-sm"
                                        onClick={submit}
                                        disabled={form.processing}
                                    >
                                        {editingEducationId ? 'Update' : 'Add Record'}
                                    </Button>
                                    {editingEducationId && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-1 px-8 py-6 h-auto border-zinc-200 text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-50 transition-colors rounded-sm"
                                            onClick={() => {
                                                setEditingEducationId(null);
                                                form.reset();
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-7 space-y-4">
                        <div className="flex items-end justify-between mb-8 border-b border-zinc-200 pb-4">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-black">Education History</h2>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mt-1">{educations.length} Records</p>
                            </div>
                        </div>

                        {educations.length > 0 ? (
                            <div className="space-y-6">
                                {educations.map((education, index) => (
                                    <div key={education.id} className="bg-white p-6 flex items-start gap-5 group relative shadow-sm border border-zinc-200 hover:border-black transition-all rounded-lg overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-black opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-bold text-lg text-black">{education.qualification}</h3>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">{education.institution}</p>
                                                    {education.field_of_study && (
                                                        <p className="text-sm font-medium text-black mt-2">{education.field_of_study}</p>
                                                    )}
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button
                                                        onClick={() => {
                                                            setEditingEducationId(education.id);
                                                            form.setData({
                                                                institution: education.institution,
                                                                qualification: education.qualification,
                                                                field_of_study: education.field_of_study ?? '',
                                                                start_date: education.start_date ?? '',
                                                                end_date: education.end_date ?? '',
                                                                grade: education.grade ?? '',
                                                            });
                                                        }}
                                                        className="p-2 text-zinc-400 hover:text-black transition-colors rounded-md hover:bg-zinc-100"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => window.confirm('Delete this education record?') && form.delete(`/candidate/education/${education.id}`, { preserveScroll: true })}
                                                        className="p-2 text-red-400 hover:text-red-600 transition-colors rounded-md hover:bg-red-50"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex gap-4 pt-3 mt-3 border-t border-zinc-100">
                                                <div className="flex items-center gap-1.5 text-zinc-500">
                                                    <Calendar size={14} />
                                                    <span className="text-xs font-medium">
                                                        {formatCandidateDate(education.start_date)} — {formatCandidateDate(education.end_date)}
                                                    </span>
                                                </div>
                                                {education.grade && (
                                                    <div className="flex items-center gap-1.5 text-zinc-500">
                                                        <Award size={14} />
                                                        <span className="text-xs font-medium italic">Grade: {education.grade}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 px-4 border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
                                <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
                                    <GraduationCap className="text-zinc-400 h-8 w-8" />
                                </div>
                                <h4 className="text-lg font-bold tracking-tight text-black">No education records added yet</h4>
                                <p className="text-sm text-zinc-500 max-w-[280px] text-center mt-1">Start by adding your first qualification using the form on the left.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CandidateHubLayout>
    );
}

function FormField({ label, error, children, className }: { label: string; error?: string; children: ReactNode; className?: string }) {
    return (
        <div className={`space-y-1.5 ${className ?? ''}`}>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
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
        <div className="grid grid-cols-[1fr_120px] gap-4">
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
                <option value="">Month</option>
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

const underlinedInput = "w-full bg-transparent border-0 border-b border-zinc-300 focus:ring-0 focus:border-black px-0 py-2.5 transition-all text-sm font-semibold text-black placeholder:text-zinc-400 appearance-none outline-none";