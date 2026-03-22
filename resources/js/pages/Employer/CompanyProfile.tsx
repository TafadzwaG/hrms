import { useForm, usePage } from '@inertiajs/react';
import { Building2, Globe, Mail, MapPin, Phone, ShieldCheck, Plus } from 'lucide-react';
import type { ReactNode } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    EmployerHubLayout,
} from './components/hub';
import type { Company, User } from './dummyData';

type PageProps = {
    company: Company;
    industries: string[];
};

export default function EmployerCompanyProfilePage() {
    const { company, industries } = usePage<PageProps>().props;
    const user = usePage<{ user?: User }>().props.user ?? { name: 'Employer User', email: company.email ?? '' };
    
    const form = useForm({
        company_name: company.company_name ?? '',
        industry: company.industry ?? '',
        registration_number: company.registration_number ?? '',
        email: company.email ?? '',
        phone: company.phone ?? '',
        website: company.website ?? '',
        address: company.address ?? '',
        description: company.description ?? '',
    });

    return (
        <EmployerHubLayout
            title="Company Profile"
            subtitle="Configure your organization's public identity, operational details, and billing entities."
            active="company"
            company={company}
            user={user}
        >
            <div className="w-full px-6 md:px-10">
                <header className="mb-10">
                    {/* Font size reduced to match Billing Header scale */}
                    <h1 className="text-4xl font-black tracking-tighter text-black mb-2">Company Profile</h1>
                    <p className="text-zinc-500 max-w-2xl text-sm font-medium tracking-tight">
                        Configure your organization's public identity, operational details, and billing entities.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
                    {/* Left Column: Form */}
                    <section className="space-y-10">
                        <div className="bg-transparent">
                            <h2 className="text-lg font-bold tracking-tight mb-6 border-b border-zinc-200 pb-3 text-black">Company Details</h2>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                                    <FormField label="Company Name" error={form.errors.company_name}>
                                        <input value={form.data.company_name} onChange={(e) => form.setData('company_name', e.target.value)} className={underlinedInput} placeholder="e.g. Acme Inc." />
                                    </FormField>

                                    <FormField label="Industry" error={form.errors.industry}>
                                        <select value={form.data.industry} onChange={(e) => form.setData('industry', e.target.value)} className={underlinedInput}>
                                            <option value="">Select industry</option>
                                            {industries.map((i) => (
                                                <option key={i} value={i}>{i.replace(/_/g, ' ')}</option>
                                            ))}
                                        </select>
                                    </FormField>

                                    <FormField label="Registration Number" error={form.errors.registration_number}>
                                        <input value={form.data.registration_number} onChange={(e) => form.setData('registration_number', e.target.value)} className={underlinedInput} placeholder="Tax ID or Reg No." />
                                    </FormField>

                                    <FormField label="Company Email" error={form.errors.email}>
                                        <input type="email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} className={underlinedInput} placeholder="contact@company.com" />
                                    </FormField>

                                    <FormField label="Phone Number" error={form.errors.phone}>
                                        <input value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} className={underlinedInput} placeholder="+1 (555) 000-0000" />
                                    </FormField>

                                    <FormField label="Website" error={form.errors.website}>
                                        <input value={form.data.website} onChange={(e) => form.setData('website', e.target.value)} className={underlinedInput} placeholder="www.company.com" />
                                    </FormField>

                                    <FormField label="Address" error={form.errors.address} className="md:col-span-2">
                                        <input value={form.data.address} onChange={(e) => form.setData('address', e.target.value)} className={underlinedInput} placeholder="Full business address" />
                                    </FormField>

                                    <FormField label="Description" error={form.errors.description} className="md:col-span-2">
                                        <Textarea
                                            rows={5}
                                            value={form.data.description}
                                            onChange={(e) => form.setData('description', e.target.value)}
                                            placeholder="Describe your company mission and vision..."
                                            className="w-full bg-transparent border border-zinc-200 focus:ring-0 focus:border-black p-3 transition-all text-black rounded-sm min-h-[120px] text-sm"
                                        />
                                    </FormField>
                                </div>

                                <div className="pt-4">
                                    <Button 
                                        className="bg-black text-white px-6 py-5 h-auto rounded-md font-bold text-sm tracking-tight active:scale-95 transition-all"
                                        onClick={() => form.put('/employer/company-profile')}
                                        disabled={form.processing}
                                    >
                                        Update Profile
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </section>

                    {/* Right Column: Cards */}
                    <aside className="space-y-6">
                        {/* Profile Summary Card - matches BillingProfile density */}
                        <div className="bg-white p-6 rounded-lg shadow-[0px_40px_80px_-40px_rgba(0,0,0,0.04)] border border-zinc-100">
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-14 h-14 bg-black flex items-center justify-center rounded-sm text-white text-xl font-black">
                                    {getInitials(company.company_name)}
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="px-2 py-0.5 bg-zinc-100 text-zinc-900 text-[9px] font-black uppercase tracking-tighter rounded border border-zinc-200">
                                        {company.status || 'Active'}
                                    </span>
                                    {company.approved_at && (
                                        <div className="flex items-center gap-1 text-[9px] font-black text-black uppercase tracking-tighter">
                                            <ShieldCheck className="h-3 w-3 fill-black text-white" />
                                            Approved
                                        </div>
                                    )}
                                </div>
                            </div>
                            <h3 className="text-lg font-bold tracking-tight text-black">{company.company_name}</h3>
                            <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">{company.industry || 'Industry not set'}</p>
                            
                            <div className="space-y-3 pt-6 mt-6 border-t border-zinc-100">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-zinc-400" />
                                    <span className="text-xs font-semibold text-black tracking-tight">{company.email || 'No email'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-zinc-400" />
                                    <span className="text-xs font-semibold text-black tracking-tight">{company.phone || 'No phone'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Snapshot Card */}
                        <div className="bg-zinc-50 p-6 border border-zinc-200 rounded-lg">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400 mb-6">Company Snapshot</h4>
                            <div className="space-y-4">
                                <InfoItem label="Entity Type" value="Private Corporation" icon={<Building2 className="h-4 w-4" />} />
                                <InfoItem label="Website" value={company.website} icon={<Globe className="h-4 w-4" />} />
                                <InfoItem label="HQ Location" value={company.address?.split(',').pop()?.trim() || 'Not Set'} icon={<MapPin className="h-4 w-4" />} />
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* FAB */}
            <button className="fixed bottom-8 right-8 w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group">
                <Plus className="h-6 w-6" />
                <span className="absolute right-full mr-4 bg-black text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Post New Job
                </span>
            </button>
        </EmployerHubLayout>
    );
}

function FormField({ label, error, children, className }: { label: string; error?: string; children: ReactNode; className?: string }) {
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

function InfoItem({ label, value, icon }: { label: string; value?: string | null; icon: ReactNode }) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-8 h-8 flex items-center justify-center bg-white rounded border border-zinc-200 text-zinc-600">
                {icon}
            </div>
            <div>
                <p className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider leading-none mb-1">{label}</p>
                <p className="text-[13px] font-bold text-black">{value || 'Not provided'}</p>
            </div>
        </div>
    );
}

function getInitials(name?: string | null): string {
    if (!name) return 'AD';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

const underlinedInput = 
    "w-full bg-transparent border-0 border-b border-zinc-200/50 focus:ring-0 focus:border-black px-0 py-2 transition-all text-black placeholder:text-zinc-300 font-medium text-sm";