import { useForm, usePage } from '@inertiajs/react';
import { Settings, Info, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { CandidateHubLayout } from './components/hub';
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
            active="settings"
            subtitle="Manage your discovery preferences and notification architecture for an optimized career search."
            candidate={candidate}
        >
            <div className="w-full px-6 md:px-10">
                {/* Page Header (Asymmetric Layout) */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-black mb-2 uppercase">Account Configuration</h1>
                        {/* <p className="text-zinc-500 font-medium text-lg max-w-lg">Manage your discovery preferences and notification architecture for an optimized career search.</p> */}
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 px-2 py-1 border border-zinc-200">Node_ID: 0x82f1a</span>
                    </div>
                </div>

                {/* Main Preferences Card */}
                <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-zinc-200">
                    <div className="p-8 border-b border-zinc-200">
                        <div className="flex items-center gap-3 mb-8">
                            <Settings className="text-black h-6 w-6" />
                            <h2 className="text-2xl font-bold tracking-tight text-black">Preferences</h2>
                        </div>

                        {/* Toggle Rows */}
                        <div className="space-y-8">
                            <CustomToggleRow
                                label="Job alerts"
                                description="Receive notifications when new jobs match your profile."
                                checked={form.data.job_alerts}
                                onChange={(checked) => form.setData('job_alerts', checked)}
                            />
                            <CustomToggleRow
                                label="Newsletter"
                                description="Receive platform updates and career resources."
                                checked={form.data.newsletter}
                                onChange={(checked) => form.setData('newsletter', checked)}
                            />
                            <CustomToggleRow
                                label="Remote only"
                                description="Prioritize remote-first opportunities in your recommendations."
                                checked={form.data.remote_only}
                                onChange={(checked) => form.setData('remote_only', checked)}
                            />
                        </div>
                    </div>

                    {/* Work Modes Section */}
                    <div className="p-8 bg-zinc-50">
                        <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-500 mb-6">Preferred Work Modes</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {workModes.map((mode) => {
                                const isChecked = form.data.preferred_work_modes.includes(mode);
                                return (
                                    <label key={mode} className="relative cursor-pointer block">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only" 
                                            checked={isChecked}
                                            onChange={() => toggleWorkMode(mode)}
                                        />
                                        <div className={`flex items-center justify-between px-5 py-4 border rounded transition-all duration-200 ${isChecked ? 'bg-black border-black text-white' : 'bg-white border-zinc-200 text-black'}`}>
                                            <span className="font-bold uppercase text-xs tracking-widest">
                                                {mode.replace(/_/g, ' ')}
                                            </span>
                                            <CheckCircle2 className={`h-5 w-5 transition-opacity ${isChecked ? 'opacity-100' : 'opacity-0'}`} />
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="p-8 flex justify-end bg-white">
                        <Button 
                            className="bg-black text-white px-8 py-6 font-black tracking-widest text-xs uppercase rounded-md active:scale-[0.98] transition-all hover:bg-zinc-800 h-auto"
                            onClick={() => form.put('/candidate/settings', { preserveScroll: true })}
                            disabled={form.processing}
                        >
                            Save Settings
                        </Button>
                    </div>
                </div>

                {/* Bento-style utility bits */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-zinc-50 p-6 border border-zinc-200 rounded-lg flex gap-4 items-start">
                        <Info className="text-zinc-400 h-5 w-5 shrink-0" />
                        <div>
                            <h4 className="font-bold text-sm uppercase tracking-tighter text-black">System Integrity</h4>
                            <p className="text-sm text-zinc-500 mt-1">Changes are synced across all active sessions in real-time. Last updated recently.</p>
                        </div>
                    </div>
                    <div className="bg-zinc-50 p-6 border border-zinc-200 rounded-lg flex gap-4 items-start">
                        <ShieldCheck className="text-zinc-400 h-5 w-5 shrink-0" />
                        <div>
                            <h4 className="font-bold text-sm uppercase tracking-tighter text-black">Privacy Protocol</h4>
                            <p className="text-sm text-zinc-500 mt-1">Your preferences are encrypted and only used to filter matching job opportunities.</p>
                        </div>
                    </div>
                </div>
            </div>
        </CandidateHubLayout>
    );
}

/* Internal Custom Toggle Component based on the HTML reference */
function CustomToggleRow({ 
    label, 
    description, 
    checked, 
    onChange 
}: { 
    label: string, 
    description: string, 
    checked: boolean, 
    onChange: (val: boolean) => void 
}) {
    return (
        <div className="flex items-start justify-between gap-6 group">
            <div className="flex-grow">
                <h3 className="font-bold text-black text-lg">{label}</h3>
                <p className="text-zinc-500 text-sm mt-1 max-w-md">{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer pt-1">
                <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <div className="w-11 h-6 bg-zinc-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black transition-colors"></div>
            </label>
        </div>
    );
}