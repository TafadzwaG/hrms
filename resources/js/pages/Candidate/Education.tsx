import { useForm, usePage } from '@inertiajs/react';
import { GraduationCap } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    CandidateEmptyState,
    CandidateHubLayout,
    CandidateSectionCard,
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

    const editingEducation = useMemo(
        () => educations.find((education) => education.id === editingEducationId) ?? null,
        [editingEducationId, educations],
    );

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
            subtitle="Manage your education and certifications."
            active="education"
            candidate={candidate}
        >
            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <CandidateSectionCard title={editingEducation ? 'Edit Education' : 'Add Education'} icon={<GraduationCap className="h-4 w-4" />}>
                    <div className="grid gap-4">
                        <FormField label="Institution" error={form.errors.institution}>
                            <input value={form.data.institution} onChange={(event) => form.setData('institution', event.target.value)} className={inputClassName} />
                        </FormField>
                        <FormField label="Qualification" error={form.errors.qualification}>
                            <input value={form.data.qualification} onChange={(event) => form.setData('qualification', event.target.value)} className={inputClassName} />
                        </FormField>
                        <FormField label="Field of Study" error={form.errors.field_of_study}>
                            <input value={form.data.field_of_study} onChange={(event) => form.setData('field_of_study', event.target.value)} className={inputClassName} />
                        </FormField>
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField label="Start Date" error={form.errors.start_date}>
                                <input type="date" value={form.data.start_date} onChange={(event) => form.setData('start_date', event.target.value)} className={inputClassName} />
                            </FormField>
                            <FormField label="End Date" error={form.errors.end_date}>
                                <input type="date" value={form.data.end_date} onChange={(event) => form.setData('end_date', event.target.value)} className={inputClassName} />
                            </FormField>
                        </div>
                        <FormField label="Grade" error={form.errors.grade}>
                            <input value={form.data.grade} onChange={(event) => form.setData('grade', event.target.value)} className={inputClassName} />
                        </FormField>
                        <div className="flex gap-2 justify-end">
                            {editingEducation && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setEditingEducationId(null);
                                        form.reset();
                                    }}
                                >
                                    Cancel
                                </Button>
                            )}
                            <Button onClick={submit} disabled={form.processing}>
                                {editingEducation ? 'Update Education' : 'Add Education'}
                            </Button>
                        </div>
                    </div>
                </CandidateSectionCard>

                <CandidateSectionCard title="Education History" icon={<GraduationCap className="h-4 w-4" />}>
                    {educations.length > 0 ? (
                        <div className="space-y-4">
                            {educations.map((education) => (
                                <div key={education.id} className="rounded-xl border border-border bg-background p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">{education.qualification}</p>
                                            <p className="text-xs text-muted-foreground">{education.institution}</p>
                                            {education.field_of_study && <p className="mt-2 text-sm text-muted-foreground">{education.field_of_study}</p>}
                                            <p className="mt-2 text-xs text-muted-foreground">
                                                {education.start_date ?? 'N/A'} - {education.end_date ?? 'N/A'}
                                            </p>
                                            {education.grade && <p className="text-xs text-muted-foreground">Grade: {education.grade}</p>}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
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
                                            >
                                                Edit
                                            </Button>
                                            <Button type="button" variant="destructive" size="sm" onClick={() => window.confirm('Delete this education record?') && form.delete(`/candidate/education/${education.id}`, { preserveScroll: true })}>
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <CandidateEmptyState message="No education records added yet." />
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
