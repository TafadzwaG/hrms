import { useForm, usePage } from '@inertiajs/react';
import { Settings } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    CandidateHubLayout,
    CandidateSectionCard,
} from './components/hub';
import type { CandidateSettings, CandidateUser } from './dummyData';

type PageProps = {
    candidate: CandidateUser;
    settings: CandidateSettings;
    workModes: string[];
};

export default function CandidateSettingsPage() {
    const { candidate, settings, workModes } = usePage<PageProps>().props;

    const form = useForm({
        job_alerts: settings.preferences.job_alerts,
        newsletter: settings.preferences.newsletter,
        remote_only: settings.preferences.remote_only,
        preferred_work_modes: settings.preferences.preferred_work_modes,
    });

    const toggleWorkMode = (mode: string) => {
        form.setData(
            'preferred_work_modes',
            form.data.preferred_work_modes.includes(mode)
                ? form.data.preferred_work_modes.filter((value) => value !== mode)
                : [...form.data.preferred_work_modes, mode],
        );
    };

    return (
        <CandidateHubLayout
            title="Settings"
            subtitle="Manage notifications and job preferences."
            active="settings"
            candidate={candidate}
        >
            <CandidateSectionCard title="Preferences" icon={<Settings className="h-4 w-4" />}>
                <div className="grid gap-6">
                    <ToggleRow
                        label="Job alerts"
                        description="Receive notifications when new jobs match your profile."
                        checked={form.data.job_alerts}
                        onChange={(checked) => form.setData('job_alerts', checked)}
                    />
                    <ToggleRow
                        label="Newsletter"
                        description="Receive platform updates and career resources."
                        checked={form.data.newsletter}
                        onChange={(checked) => form.setData('newsletter', checked)}
                    />
                    <ToggleRow
                        label="Remote only"
                        description="Prioritize remote-first opportunities in your recommendations."
                        checked={form.data.remote_only}
                        onChange={(checked) => form.setData('remote_only', checked)}
                    />

                    <div className="grid gap-2">
                        <p className="text-sm font-medium text-foreground">Preferred work modes</p>
                        <div className="flex flex-wrap gap-3">
                            {workModes.map((mode) => (
                                <label key={mode} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground">
                                    <input
                                        type="checkbox"
                                        checked={form.data.preferred_work_modes.includes(mode)}
                                        onChange={() => toggleWorkMode(mode)}
                                    />
                                    {mode.replace(/_/g, ' ')}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={() => form.put('/candidate/settings', { preserveScroll: true })} disabled={form.processing}>
                            Save Settings
                        </Button>
                    </div>
                </div>
            </CandidateSectionCard>
        </CandidateHubLayout>
    );
}

function ToggleRow({
    label,
    description,
    checked,
    onChange,
}: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <label className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
            <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="mt-1" />
        </label>
    );
}
