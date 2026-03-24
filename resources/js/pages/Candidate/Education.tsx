import { useForm, usePage } from '@inertiajs/react';
import { GraduationCap, Edit2, Trash2, Calendar, Award } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { CandidateHubLayout } from './components/hub';
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
            subtitle='Academic Qualifications'
            candidate={candidate}
        >
            <div className="w-full px-4 md:px-6">
                {/* Page Title */}
                <div className="mb-6">
                    <h1 className="text-4xl font-black tracking-tighter leading-none text-black mb-2 uppercase">Education.</h1>
                    <p className="text-zinc-500 text-sm font-medium max-w-xl">Manage your academic history and certifications.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Form */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-sm shadow-sm">
                            <div className="flex items-center gap-2 mb-6 border-b border-zinc-200 pb-3">
                                <GraduationCap className="h-4 w-4 text-black" />
                                <h3 className="text-sm font-bold tracking-tight text-black uppercase">
                                    {editingEducationId ? 'Edit Education' : 'Add Education'}
                                </h3>
                            </div>

                            <form className="space-y-5">
                                <FormField label="Institution" error={form.errors.institution}>
                                    <input 
                                        value={form.data.institution} 
                                        onChange={(event) => form.setData('institution', event.target.value)} 
                                        className={underlinedInput} 
                                        placeholder="e.g. Stanford University" 
                                    />
                                </FormField>

                                <div className="grid grid-cols-2 gap-5">
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

                                <div className="grid grid-cols-2 gap-5">
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

                                <div className="flex flex-wrap gap-3 pt-3">
                                    <Button 
                                        type="button" 
                                        className="flex-1 bg-black text-white py-5 h-auto text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors rounded-sm"
                                        onClick={submit} 
                                        disabled={form.processing}
                                    >
                                        {editingEducationId ? 'Update' : 'Add Record'}
                                    </Button>
                                    {editingEducationId && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-1 px-6 py-5 h-auto border-zinc-200 text-black text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-50 transition-colors rounded-sm"
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

                    {/* Right Column: History */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="flex items-end justify-between mb-6 border-b border-zinc-200 pb-3">
                            <div>
                                <h2 className="text-lg font-bold tracking-tight text-black uppercase">Education History</h2>
                                <p className="text-[9px] uppercase font-bold tracking-widest text-zinc-400 mt-0.5">{educations.length} Records</p>
                            </div>
                        </div>

                        {educations.length > 0 ? (
                            <div className="space-y-4">
                                {educations.map((education, index) => (
                                    <div key={education.id} className={`bg-white p-5 flex items-start gap-4 group relative shadow-sm border ${index === 0 ? 'border-zinc-300' : 'border-zinc-200'} hover:border-black transition-all rounded-sm overflow-hidden`}>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-black text-base text-black uppercase tracking-tighter">{education.qualification}</h3>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-0.5">{education.institution}</p>
                                                    {education.field_of_study && (
                                                        <p className="text-xs font-semibold text-black mt-1.5">{education.field_of_study}</p>
                                                    )}
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
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
                                                        className="p-1.5 text-zinc-400 hover:text-black transition-colors rounded-sm hover:bg-zinc-100"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button 
                                                        onClick={() => window.confirm('Delete this education record?') && form.delete(`/candidate/education/${education.id}`, { preserveScroll: true })}
                                                        className="p-1.5 text-red-400 hover:text-red-600 transition-colors rounded-sm hover:bg-red-50"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div className="flex gap-4 pt-3 mt-3 border-t border-zinc-100">
                                                <div className="flex items-center gap-1.5 text-zinc-500">
                                                    <Calendar size={12} />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">
                                                        {formatRange(education.start_date, education.end_date)}
                                                    </span>
                                                </div>
                                                {education.grade && (
                                                    <div className="flex items-center gap-1.5 text-zinc-500">
                                                        <Award size={12} />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">Grade: {education.grade}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-zinc-200 rounded-sm bg-zinc-50/50">
                                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-3">
                                    <GraduationCap className="text-zinc-400 h-6 w-6" />
                                </div>
                                <h4 className="text-sm font-black uppercase tracking-widest text-black">No records added</h4>
                                <p className="text-xs text-zinc-500 max-w-[280px] text-center mt-1">Start by adding your first qualification on the left.</p>
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
        <div className={`space-y-1 ${className ?? ''}`}>
            <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">
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
        <div className="grid grid-cols-[1fr_80px] gap-3">
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

function formatRange(start?: string | null, end?: string | null): string {
    if (!start && !end) return 'Dates not provided';
    const startLabel = start ? new Date(start).getFullYear() : 'Unknown';
    const endLabel = end ? new Date(end).getFullYear() : 'Present';
    return `${startLabel} — ${endLabel}`;
}

const underlinedInput = "w-full bg-transparent border-0 border-b border-zinc-200 focus:ring-0 focus:border-black px-0 py-1.5 transition-all text-xs font-semibold text-black placeholder:text-zinc-400 appearance-none outline-none";