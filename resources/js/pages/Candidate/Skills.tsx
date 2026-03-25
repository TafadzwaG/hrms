import { useForm, usePage } from '@inertiajs/react';
import { Wrench, Edit2, Trash2, Plus, Sparkles, Star } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import InputError from '@/components/input-error';
import {
    candidateBreadcrumbs,
    CandidateHubLayout,
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

const levelConfig: Record<string, {
    badge: string;
    bar: string;
    glow: string;
    border: string;
    progress: number;
    label: string;
}> = {
    beginner: {
        badge: 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800',
        bar: 'bg-sky-400 dark:bg-sky-500',
        glow: 'border-l-sky-400 dark:border-l-sky-500',
        border: 'hover:border-sky-300 dark:hover:border-sky-700',
        progress: 25,
        label: 'Beginner',
    },
    intermediate: {
        badge: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
        bar: 'bg-amber-400 dark:bg-amber-500',
        glow: 'border-l-amber-400 dark:border-l-amber-500',
        border: 'hover:border-amber-300 dark:hover:border-amber-700',
        progress: 50,
        label: 'Intermediate',
    },
    advanced: {
        badge: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800',
        bar: 'bg-violet-500 dark:bg-violet-400',
        glow: 'border-l-violet-500 dark:border-l-violet-400',
        border: 'hover:border-violet-300 dark:hover:border-violet-700',
        progress: 75,
        label: 'Advanced',
    },
    expert: {
        badge: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
        bar: 'bg-emerald-500 dark:bg-emerald-400',
        glow: 'border-l-emerald-500 dark:border-l-emerald-400',
        border: 'hover:border-emerald-300 dark:hover:border-emerald-700',
        progress: 100,
        label: 'Expert',
    },
};

const levelOrder = ['beginner', 'intermediate', 'advanced', 'expert'];

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

    const grouped = levelOrder.reduce<Record<string, CandidateSkill[]>>((acc, lvl) => {
        acc[lvl] = skills.filter((s) => (s.level ?? 'beginner') === lvl);
        return acc;
    }, {});

    return (
        <CandidateHubLayout
            title="Skills"
            active="skills"
            subtitle="Build and showcase your professional toolkit"
            candidate={candidate}
            breadcrumbs={candidateBreadcrumbs('Skills')}
        >
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

                {/* ── Form ── */}
                <div className="lg:col-span-4 xl:col-span-4">
                    <div className="sticky top-6 overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
                        {/* Card header */}
                        <div className="border-b border-border/70 px-5 py-4">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                    {editingSkillId ? <Edit2 className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        {editingSkillId ? 'Edit Skill' : 'Add a Skill'}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">
                                        {editingSkillId ? 'Update skill details below' : 'Add to your professional toolkit'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Level preview strip */}
                        {form.data.level && levelConfig[form.data.level] && (
                            <div className={`h-1 w-full ${levelConfig[form.data.level].bar} transition-colors`} />
                        )}

                        <div className="space-y-5 p-5">
                            {/* Skill name */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                                    Skill Name
                                </label>
                                <Input
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    placeholder="e.g. React, Python, Figma"
                                    className="h-9 text-sm"
                                />
                                <InputError message={form.errors.name} />
                            </div>

                            {/* Level */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                                    Proficiency Level
                                </label>
                                <Select
                                    value={form.data.level}
                                    onValueChange={(v) => form.setData('level', v)}
                                >
                                    <SelectTrigger className="h-9 text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {levels.map((level) => {
                                            const cfg = levelConfig[level];
                                            return (
                                                <SelectItem key={level} value={level}>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`inline-block h-2 w-2 rounded-full ${cfg?.bar ?? 'bg-muted'}`} />
                                                        {level.charAt(0).toUpperCase() + level.slice(1)}
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>

                                {/* Proficiency visual */}
                                {form.data.level && levelConfig[form.data.level] && (
                                    <div className="flex items-center gap-2 pt-1">
                                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                                            <div
                                                className={`h-full rounded-full transition-all duration-300 ${levelConfig[form.data.level].bar}`}
                                                style={{ width: `${levelConfig[form.data.level].progress}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-medium text-muted-foreground">
                                            {levelConfig[form.data.level].progress}%
                                        </span>
                                    </div>
                                )}
                                <InputError message={form.errors.level} />
                            </div>

                            {/* Years experience */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                                    Years of Experience
                                </label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={form.data.years_experience}
                                    onChange={(e) => form.setData('years_experience', e.target.value)}
                                    placeholder="0"
                                    className="h-9 text-sm"
                                />
                                <InputError message={form.errors.years_experience} />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-1">
                                <Button
                                    type="button"
                                    onClick={submit}
                                    disabled={form.processing}
                                    className="flex-1 h-9 gap-2 rounded-lg bg-foreground text-[11px] font-bold tracking-widest text-background uppercase hover:bg-foreground/90"
                                >
                                    {editingSkillId ? <Edit2 className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                                    {editingSkillId ? 'Update' : 'Add Skill'}
                                </Button>
                                {editingSkillId ? (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-9 px-4 rounded-lg border-border/70 text-[11px] font-bold tracking-widest uppercase hover:bg-muted/50"
                                        onClick={() => { setEditingSkillId(null); form.reset(); }}
                                    >
                                        Cancel
                                    </Button>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-4 rounded-xl border border-border/70 bg-card p-4">
                        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Level Legend</p>
                        <div className="space-y-2">
                            {levelOrder.map((lvl) => {
                                const cfg = levelConfig[lvl];
                                return (
                                    <div key={lvl} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={`h-2 w-2 rounded-full ${cfg.bar}`} />
                                            <span className="text-[11px] font-medium text-foreground">{cfg.label}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-1 w-16 overflow-hidden rounded-full bg-muted">
                                                <div className={`h-full rounded-full ${cfg.bar}`} style={{ width: `${cfg.progress}%` }} />
                                            </div>
                                            <span className="w-7 text-right text-[10px] text-muted-foreground">{cfg.progress}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ── Skills grid ── */}
                <div className="lg:col-span-8 xl:col-span-8">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-semibold tracking-tight text-foreground">Your Skills</h2>
                            <p className="text-[11px] text-muted-foreground">{skills.length} skill{skills.length !== 1 ? 's' : ''} in your toolkit</p>
                        </div>
                        {skills.length > 0 && (
                            <div className="flex items-center gap-1.5 rounded-lg border border-border/70 bg-muted/30 px-3 py-1.5">
                                <Sparkles className="h-3 w-3 text-muted-foreground" />
                                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                    {levelOrder.reduce((max, lvl) => grouped[lvl]?.length > 0 ? lvl : max, 'beginner')} peak
                                </span>
                            </div>
                        )}
                    </div>

                    {skills.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/70 bg-muted/10 py-16 px-8 text-center">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                <Wrench className="h-6 w-6" />
                            </div>
                            <h4 className="mb-1 text-sm font-semibold text-foreground">No skills yet</h4>
                            <p className="text-[12px] text-muted-foreground max-w-[260px]">
                                Add your first skill using the form on the left to start building your toolkit.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {levelOrder.map((lvl) => {
                                const group = grouped[lvl];
                                if (!group || group.length === 0) return null;
                                const cfg = levelConfig[lvl];
                                return (
                                    <div key={lvl}>
                                        {/* Group heading */}
                                        <div className="mb-3 flex items-center gap-2">
                                            <span className={`h-2 w-2 rounded-full ${cfg.bar}`} />
                                            <span className={`text-[10px] font-bold uppercase tracking-[0.15em] ${cfg.badge.split(' ').filter(c => c.startsWith('text-')).join(' ')}`}>
                                                {cfg.label}
                                            </span>
                                            <div className="h-px flex-1 bg-border/50" />
                                            <span className="text-[10px] text-muted-foreground">{group.length}</span>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            {group.map((skill) => (
                                                <SkillCard
                                                    key={skill.id}
                                                    skill={skill}
                                                    cfg={cfg}
                                                    onEdit={() => {
                                                        setEditingSkillId(skill.id);
                                                        form.setData({
                                                            name: skill.name,
                                                            level: skill.level ?? 'intermediate',
                                                            years_experience: skill.years_experience?.toString() ?? '',
                                                        });
                                                    }}
                                                    onDelete={() =>
                                                        window.confirm('Delete this skill?') &&
                                                        form.delete(`/candidate/skills/${skill.id}`, { preserveScroll: true })
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </CandidateHubLayout>
    );
}

function SkillCard({
    skill,
    cfg,
    onEdit,
    onDelete,
}: {
    skill: CandidateSkill;
    cfg: typeof levelConfig[string];
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <div className={`group relative overflow-hidden rounded-xl border border-l-4 border-border/70 bg-card shadow-sm transition-all ${cfg.glow} ${cfg.border}`}>
            <div className="p-4">
                <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-foreground">{skill.name}</h3>
                        {skill.years_experience != null && (
                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                                {skill.years_experience} yr{Number(skill.years_experience) !== 1 ? 's' : ''} experience
                            </p>
                        )}
                    </div>
                    <span className={`shrink-0 rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${cfg.badge}`}>
                        {cfg.label}
                    </span>
                </div>

                {/* Proficiency bar */}
                <div className="mb-3 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                            className={`h-full rounded-full ${cfg.bar}`}
                            style={{ width: `${cfg.progress}%` }}
                        />
                    </div>
                    <div className="flex gap-0.5">
                        {[25, 50, 75, 100].map((step) => (
                            <Star
                                key={step}
                                className={`h-2.5 w-2.5 ${cfg.progress >= step ? cfg.bar.replace('bg-', 'text-') : 'text-muted'}`}
                                fill={cfg.progress >= step ? 'currentColor' : 'none'}
                            />
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1.5">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onEdit}
                        className="h-7 flex-1 gap-1 rounded-md border-border/70 text-[9px] font-bold uppercase tracking-widest hover:bg-muted/50"
                    >
                        <Edit2 className="h-3 w-3" />
                        Edit
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onDelete}
                        className="h-7 flex-1 gap-1 rounded-md border-border/70 text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:border-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
                    >
                        <Trash2 className="h-3 w-3" />
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
}
