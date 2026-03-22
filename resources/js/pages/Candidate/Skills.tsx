import { useForm, usePage } from '@inertiajs/react';
import { Wrench } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    CandidateEmptyState,
    CandidateHubLayout,
    CandidateSectionCard,
    candidateSkillLevelColor,
} from './components/hub';
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

    const editingSkill = useMemo(
        () => skills.find((skill) => skill.id === editingSkillId) ?? null,
        [editingSkillId, skills],
    );

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
            subtitle="Capture your current skills and experience levels."
            active="skills"
            candidate={candidate}
        >
            <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                <CandidateSectionCard title={editingSkill ? 'Edit Skill' : 'Add Skill'} icon={<Wrench className="h-4 w-4" />}>
                    <div className="grid gap-4">
                        <FormField label="Skill Name" error={form.errors.name}>
                            <input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className={inputClassName} />
                        </FormField>
                        <FormField label="Level" error={form.errors.level}>
                            <select value={form.data.level} onChange={(event) => form.setData('level', event.target.value)} className={inputClassName}>
                                {levels.map((level) => (
                                    <option key={level} value={level}>
                                        {level}
                                    </option>
                                ))}
                            </select>
                        </FormField>
                        <FormField label="Years of Experience" error={form.errors.years_experience}>
                            <input type="number" min="0" value={form.data.years_experience} onChange={(event) => form.setData('years_experience', event.target.value)} className={inputClassName} />
                        </FormField>
                        <div className="flex gap-2 justify-end">
                            {editingSkill && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setEditingSkillId(null);
                                        form.reset();
                                    }}
                                >
                                    Cancel
                                </Button>
                            )}
                            <Button onClick={submit} disabled={form.processing}>
                                {editingSkill ? 'Update Skill' : 'Add Skill'}
                            </Button>
                        </div>
                    </div>
                </CandidateSectionCard>

                <CandidateSectionCard title="Saved Skills" icon={<Wrench className="h-4 w-4" />}>
                    {skills.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                            {skills.map((skill) => (
                                <div key={skill.id} className="rounded-xl border border-border bg-background p-4 min-w-[220px]">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">{skill.name}</p>
                                            <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${candidateSkillLevelColor[skill.level || 'beginner']}`}>
                                                {skill.level ?? 'beginner'}
                                            </span>
                                            {skill.years_experience != null && (
                                                <p className="mt-2 text-xs text-muted-foreground">{skill.years_experience} years experience</p>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setEditingSkillId(skill.id);
                                                    form.setData({
                                                        name: skill.name,
                                                        level: skill.level ?? 'intermediate',
                                                        years_experience: skill.years_experience?.toString() ?? '',
                                                    });
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button type="button" variant="destructive" size="sm" onClick={() => window.confirm('Delete this skill?') && form.delete(`/candidate/skills/${skill.id}`, { preserveScroll: true })}>
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <CandidateEmptyState message="No skills added yet." />
                    )}
                </CandidateSectionCard>
            </div>
        </CandidateHubLayout>
    );
}

function FormField({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">{label}</label>
            {children}
            <InputError message={error} />
        </div>
    );
}

const inputClassName = 'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm';
