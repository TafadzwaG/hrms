import { useForm, usePage } from '@inertiajs/react';
import { Wrench, Edit2, Trash2, Box, Cpu } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import {
    CandidateEmptyState,
    CandidateHubLayout,
    candidateSkillLevelColor,
} from './components/hub';
import {
    candidatePrimaryButtonClassName,
    candidateSecondaryButtonClassName,
} from './components/form';
import type { CandidateSkill, CandidateUser } from './dummyData';

type PageProps = {
    candidate: CandidateUser;
    skills: CandidateSkill[];
    levels: string[];
};

type SkillForm = {
    name: string;
    level: string;
    years_experience: string;
};

const emptySkill: SkillForm = {
    name: '',
    level: 'intermediate',
    years_experience: '',
};

export default function CandidateSkillsPage() {
    const { candidate, skills, levels } = usePage<PageProps>().props;
    const [editingSkillId, setEditingSkillId] = useState<number | null>(null);
    const form = useForm<SkillForm>(emptySkill);

    const submit = () => {
        if (editingSkillId) {
            form.put(`/candidate/skills/${editingSkillId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingSkillId(null);
                    form.reset();
                },
            });
            return;
        }

        form.post('/candidate/skills', {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    return (
        <CandidateHubLayout
            title="Skills"
            active="skills"
            subtitle="Capture your current skills and experience levels."
            candidate={candidate}
        >
            <div className="w-full px-6 md:px-10">
                {/* Page Title */}
                <div className="mb-12">
                    <h2 className="text-[2.5rem] font-black tracking-tighter leading-none text-black mb-2 uppercase">Skills.</h2>
                    {/* <p className="text-zinc-500 max-w-xl font-medium">Capture your current skills and experience levels.</p> */}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    
                    {/* Left Column: Form */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-zinc-50 border border-zinc-200 p-8 rounded-xl shadow-sm">
                            <div className="flex items-center gap-3 mb-8 border-b border-zinc-200 pb-4">
                                <Cpu className="h-5 w-5 text-black" />
                                <h3 className="text-lg font-bold tracking-tight text-black uppercase">
                                    {editingSkillId ? 'Edit Skill' : 'Add Skill'}
                                </h3>
                            </div>

                            <form className="space-y-6">
                                <FormField label="Skill Name" error={form.errors.name}>
                                    <input 
                                        value={form.data.name} 
                                        onChange={(event) => form.setData('name', event.target.value)} 
                                        className={underlinedInput} 
                                        placeholder="e.g. Figma, React, Python" 
                                    />
                                </FormField>

                                <FormField label="Level" error={form.errors.level}>
                                    <select 
                                        value={form.data.level} 
                                        onChange={(event) => form.setData('level', event.target.value)} 
                                        className={underlinedInput}
                                    >
                                        {levels.map((level) => (
                                            <option key={level} value={level}>
                                                {level.charAt(0).toUpperCase() + level.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </FormField>

                                <FormField label="Years of Experience" error={form.errors.years_experience}>
                                    <input 
                                        type="number" 
                                        min="0" 
                                        value={form.data.years_experience} 
                                        onChange={(event) => form.setData('years_experience', event.target.value)} 
                                        className={underlinedInput} 
                                        placeholder="0" 
                                    />
                                </FormField>

                                <div className="flex flex-wrap gap-4 pt-4">
                                    <Button 
                                        type="button" 
                                        className="flex-1 bg-black text-white py-6 h-auto text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors rounded-sm"
                                        onClick={submit} 
                                        disabled={form.processing}
                                    >
                                        {editingSkillId ? 'Update Skill' : 'Add Skill'}
                                    </Button>
                                    {editingSkillId && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-1 px-8 py-6 h-auto border-zinc-200 text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-50 transition-colors rounded-sm"
                                            onClick={() => {
                                                setEditingSkillId(null);
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

                    {/* Right Column: Saved Skills Grid */}
                    <div className="lg:col-span-7">
                        <div className="flex items-end justify-between mb-8 border-b border-zinc-200 pb-4">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-black uppercase">Saved Skills</h2>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mt-1">{skills.length} Total</p>
                            </div>
                        </div>

                        {skills.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {skills.map((skill) => (
                                    <div key={skill.id} className="group bg-white p-6 rounded-lg border border-zinc-200 hover:border-black transition-all flex flex-col justify-between shadow-sm relative overflow-hidden">
                                        {/* Subtle colored accent bar based on level */}
                                        <div className={`absolute top-0 left-0 w-full h-1 opacity-20 ${skill.level === 'expert' ? 'bg-black opacity-100' : 'bg-zinc-400'}`}></div>
                                        
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="font-bold text-lg tracking-tight text-black">{skill.name}</h3>
                                                <span className={`text-[9px] font-black uppercase px-2 py-1 tracking-widest border rounded-sm ${candidateSkillLevelColor[skill.level || 'beginner']}`}>
                                                    {skill.level}
                                                </span>
                                            </div>
                                            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">
                                                {skill.years_experience} Years Experience
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => {
                                                    setEditingSkillId(skill.id);
                                                    form.setData({
                                                        name: skill.name,
                                                        level: skill.level ?? 'intermediate',
                                                        years_experience: skill.years_experience?.toString() ?? '',
                                                    });
                                                }}
                                                className="flex-1 text-[10px] font-bold py-2 border border-zinc-200 hover:bg-black hover:text-white hover:border-black transition-all uppercase tracking-widest rounded-sm flex items-center justify-center gap-2"
                                            >
                                                <Edit2 size={12} /> Edit
                                            </button>
                                            <button 
                                                onClick={() => window.confirm('Delete this skill?') && form.delete(`/candidate/skills/${skill.id}`, { preserveScroll: true })}
                                                className="flex-1 text-[10px] font-bold py-2 border border-zinc-200 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 text-zinc-400"
                                            >
                                                <Trash2 size={12} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 px-4 border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
                                <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
                                    <Wrench className="text-zinc-300 h-8 w-8" />
                                </div>
                                <h4 className="text-lg font-bold tracking-tight text-black uppercase">No skills recorded</h4>
                                <p className="text-sm text-zinc-500 max-w-[280px] text-center mt-1">Start by adding your professional toolkit on the left.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Visual Accent */}
            <div className="fixed bottom-0 right-0 p-8 opacity-[0.03] pointer-events-none select-none hidden xl:block">
                <h2 className="text-[12rem] font-black tracking-tighter leading-none -mb-12">SKILLS</h2>
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

const underlinedInput = "w-full bg-transparent border-0 border-b border-zinc-300 focus:ring-0 focus:border-black px-0 py-2.5 transition-all text-sm font-semibold text-black placeholder:text-zinc-400 appearance-none outline-none";