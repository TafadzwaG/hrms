import { useForm, usePage } from '@inertiajs/react';
import { 
    Settings, 
    Info, 
    ShieldCheck, 
    CheckCircle2, 
    Bell, 
    Mail, 
    Globe2, 
    Laptop, 
    Building2 
} from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { candidateBreadcrumbs, CandidateHubLayout } from './components/hub';
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

    const getModeStyles = (mode: string, checked: boolean) => {
        if (!checked) return 'bg-white border-zinc-200 text-black hover:border-black';
        
        const normalized = mode.toLowerCase();
        if (normalized.includes('remote')) return 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-600/20';
        if (normalized.includes('hybrid')) return 'bg-violet-600 border-violet-600 text-white shadow-sm shadow-violet-600/20';
        if (normalized.includes('site') || normalized.includes('office')) return 'bg-orange-500 border-orange-500 text-white shadow-sm shadow-orange-500/20';
        
        return 'bg-black border-black text-white';
    };

    const getModeIcon = (mode: string) => {
        const normalized = mode.toLowerCase();
        if (normalized.includes('remote')) return <Globe2 className="h-4 w-4 shrink-0" />;
        if (normalized.includes('hybrid')) return <Laptop className="h-4 w-4 shrink-0" />;
        return <Building2 className="h-4 w-4 shrink-0" />;
    };

    return (
        <CandidateHubLayout
            title="Settings"
            active="settings"
            subtitle='Configure your account.'
            candidate={candidate}
            breadcrumbs={candidateBreadcrumbs('Settings')}
        >
            <div className="space-y-6">
                {/* Main Preferences Card */}
                <div className="overflow-hidden rounded-lg border border-border/70 bg-background/95 shadow-sm">
                    <div className="p-6 border-b border-zinc-200">
                        <div className="flex items-center gap-2 mb-8">
                            <Settings className="text-black h-4 w-4" />
                            <h2 className="text-lg font-bold tracking-tight text-black uppercase">Preferences</h2>
                        </div>

                        {/* Toggle Rows */}
                        <div className="space-y-6">
                            <CustomToggleRow
                                icon={<Bell className="h-5 w-5" />}
                                label="Job alerts"
                                description="Receive notifications when new jobs match your profile."
                                checked={form.data.job_alerts}
                                onChange={(checked) => form.setData('job_alerts', checked)}
                            />
                            <CustomToggleRow
                                icon={<Mail className="h-5 w-5" />}
                                label="Newsletter"
                                description="Receive platform updates and career resources."
                                checked={form.data.newsletter}
                                onChange={(checked) => form.setData('newsletter', checked)}
                            />
                            <CustomToggleRow
                                icon={<Globe2 className="h-5 w-5" />}
                                label="Remote only"
                                description="Prioritize remote-first opportunities in your recommendations."
                                checked={form.data.remote_only}
                                onChange={(checked) => form.setData('remote_only', checked)}
                            />
                        </div>
                    </div>

                    {/* Work Modes Section */}
                    <div className="border-b border-zinc-200 bg-muted/20 p-6">
                        <h3 className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 mb-4">Preferred Work Modes</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {workModes.map((mode) => {
                                const isChecked = form.data.preferred_work_modes.includes(mode);
                                return (
                                    <label key={mode} className="relative cursor-pointer block">
                                        <div className={`flex items-center justify-between px-4 py-3 border rounded-sm transition-all duration-200 ${getModeStyles(mode, isChecked)}`}>
                                            <div className="flex items-center gap-2.5">
                                                {getModeIcon(mode)}
                                                <span className="font-bold uppercase text-[10px] tracking-widest">
                                                    {mode.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                            <Checkbox
                                                checked={isChecked}
                                                onCheckedChange={() => toggleWorkMode(mode)}
                                                className={isChecked ? 'border-white data-[state=checked]:border-white data-[state=checked]:bg-white data-[state=checked]:text-black' : ''}
                                            />
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="p-6 flex justify-end bg-white">
                        <Button 
                            className="bg-black text-white px-6 py-4 font-black tracking-widest text-[10px] uppercase rounded-sm active:scale-[0.98] transition-all hover:bg-zinc-800 h-auto w-full sm:w-auto"
                            onClick={() => form.put('/candidate/settings', { preserveScroll: true })}
                            disabled={form.processing}
                        >
                            Save Settings
                        </Button>
                    </div>
                </div>

                {/* Bento-style utility bits */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-start gap-3 rounded-lg border border-border/70 bg-background/95 p-5 shadow-sm">
                        <Info className="text-zinc-400 h-4 w-4 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-black">System Integrity</h4>
                            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">Changes are synced across all active sessions in real-time. Last updated recently.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg border border-border/70 bg-background/95 p-5 shadow-sm">
                        <ShieldCheck className="text-zinc-400 h-4 w-4 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-black">Privacy Protocol</h4>
                            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">Your preferences are encrypted and only used to filter matching job opportunities.</p>
                        </div>
                    </div>
                </div>
            </div>
        </CandidateHubLayout>
    );
}

/* Internal Custom Toggle Component */
function CustomToggleRow({ 
    icon,
    label, 
    description, 
    checked, 
    onChange 
}: { 
    icon: ReactNode,
    label: string, 
    description: string, 
    checked: boolean, 
    onChange: (val: boolean) => void 
}) {
    return (
        <div className="flex items-start justify-between gap-4 group">
            <div className="flex items-start gap-4 flex-grow">
                <div className="mt-0.5 text-zinc-400 group-hover:text-black transition-colors">
                    {icon}
                </div>
                <div>
                    <h3 className="font-bold text-black text-sm uppercase">{label}</h3>
                    <p className="text-zinc-500 text-xs mt-1 max-w-md">{description}</p>
                </div>
            </div>
            <Checkbox
                checked={checked}
                onCheckedChange={(value) => onChange(value === true)}
                className="mt-0.5 shrink-0"
            />
        </div>
    );
}
