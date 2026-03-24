import { useForm, usePage } from '@inertiajs/react';
import { 
    Building2, 
    Globe, 
    Mail, 
    MapPin, 
    Phone, 
    ShieldCheck, 
    Plus, 
    Save 
} from 'lucide-react';
import type { ReactNode } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EmployerHubLayout } from './components/hub';
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
            <div className="w-full px-4 md:px-6">
                <header className="mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-1">Company Profile.</h1>
                    <p className="text-zinc-500 max-w-2xl text-xs font-medium tracking-tight">
                        Configure your organization's public identity, operational details, and billing entities.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
                    {/* Left Column: Form (No background card) */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 mb-6 border-b border-zinc-100 pb-3">
                            <div className="w-8 h-8 bg-zinc-100 flex items-center justify-center rounded-sm shrink-0">
                                <Building2 className="text-black h-4 w-4" />
                            </div>
                            <h2 className="text-sm font-bold tracking-tight text-black uppercase">Company Details</h2>
                        </div>
                        
                        <form className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                                <FormField label="Company Name" error={form.errors.company_name}>
                                    <input 
                                        value={form.data.company_name} 
                                        onChange={(e) => form.setData('company_name', e.target.value)} 
                                        className={underlinedInput} 
                                        placeholder="e.g. Acme Inc." 
                                    />
                                </FormField>

                                <FormField label="Industry" error={form.errors.industry}>
                                    <select 
                                        value={form.data.industry} 
                                        onChange={(e) => form.setData('industry', e.target.value)} 
                                        className={underlinedInput}
                                    >
                                        <option value="">Select industry</option>
                                        {industries.map((i) => (
                                            <option key={i} value={i}>{i.replace(/_/g, ' ')}</option>
                                        ))}
                                    </select>
                                </FormField>

                                <FormField label="Registration Number" error={form.errors.registration_number}>
                                    <input 
                                        value={form.data.registration_number} 
                                        onChange={(e) => form.setData('registration_number', e.target.value)} 
                                        className={underlinedInput} 
                                        placeholder="Tax ID or Reg No." 
                                    />
                                </FormField>

                                <FormField label="Company Email" error={form.errors.email}>
                                    <input 
                                        type="email" 
                                        value={form.data.email} 
                                        onChange={(e) => form.setData('email', e.target.value)} 
                                        className={underlinedInput} 
                                        placeholder="contact@company.com" 
                                    />
                                </FormField>

                                <FormField label="Phone Number" error={form.errors.phone}>
                                    <input 
                                        value={form.data.phone} 
                                        onChange={(e) => form.setData('phone', e.target.value)} 
                                        className={underlinedInput} 
                                        placeholder="+1 (555) 000-0000" 
                                    />
                                </FormField>

                                <FormField label="Website" error={form.errors.website}>
                                    <input 
                                        value={form.data.website} 
                                        onChange={(e) => form.setData('website', e.target.value)} 
                                        className={underlinedInput} 
                                        placeholder="www.company.com" 
                                    />
                                </FormField>

                                <FormField label="Address" error={form.errors.address} className="md:col-span-2">
                                    <input 
                                        value={form.data.address} 
                                        onChange={(e) => form.setData('address', e.target.value)} 
                                        className={underlinedInput} 
                                        placeholder="Full business address" 
                                    />
                                </FormField>

                                <FormField label="Description" error={form.errors.description} className="md:col-span-2">
                                    <Textarea
                                        rows={4}
                                        value={form.data.description}
                                        onChange={(e) => form.setData('description', e.target.value)}
                                        placeholder="Describe your company mission and vision..."
                                        className="w-full bg-transparent border-0 border-b border-transparent hover:border-zinc-300 focus:ring-0 focus:border-black px-0 py-1.5 transition-all text-black placeholder:text-zinc-400 font-semibold text-xs min-h-[100px] resize-none"
                                    />
                                </FormField>
                            </div>

                            <div className="pt-3">
                                <Button 
                                    className="w-full sm:w-auto bg-black text-white px-8 py-5 h-auto rounded-sm font-bold text-[10px] uppercase tracking-widest active:scale-[0.98] transition-all hover:bg-zinc-800 flex items-center justify-center gap-2"
                                    onClick={() => form.put('/employer/company-profile')}
                                    disabled={form.processing}
                                >
                                    <Save className="h-3.5 w-3.5" /> Update Profile
                                </Button>
                            </div>
                        </form>
                    </section>

                    {/* Right Column: Cards */}
                    <aside className="space-y-6">
                        {/* Profile Summary Card */}
                        <div className="bg-white p-6 rounded-sm shadow-sm border border-zinc-200">
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-12 h-12 bg-black flex items-center justify-center rounded-sm text-white text-lg font-black shrink-0">
                                    {getInitials(company.company_name)}
                                </div>
                                <div className="flex flex-col items-end gap-1.5">
                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-sm border border-emerald-200">
                                        {company.status || 'Active'}
                                    </span>
                                    {company.approved_at && (
                                        <div className="flex items-center gap-1 text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                                            <ShieldCheck className="h-3 w-3 text-emerald-500" />
                                            Verified
                                        </div>
                                    )}
                                </div>
                            </div>
                            <h3 className="text-base font-black tracking-tighter text-black uppercase">{company.company_name}</h3>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">{company.industry || 'Industry not set'}</p>
                            
                            <div className="space-y-3 pt-5 mt-5 border-t border-zinc-100">
                                <div className="flex items-center gap-2.5">
                                    <Mail className="h-3.5 w-3.5 text-zinc-400" />
                                    <span className="text-xs font-bold text-black tracking-tight truncate">{company.email || 'No email'}</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <Phone className="h-3.5 w-3.5 text-zinc-400" />
                                    <span className="text-xs font-bold text-black tracking-tight truncate">{company.phone || 'No phone'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Snapshot Card */}
                        <div className="bg-zinc-50 p-5 border border-zinc-200 rounded-sm shadow-sm">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">Company Snapshot</h4>
                            <div className="space-y-3">
                                <InfoItem label="Entity Type" value="Private Corporation" icon={<Building2 className="h-3.5 w-3.5" />} />
                                <InfoItem label="Website" value={company.website} icon={<Globe className="h-3.5 w-3.5" />} />
                                <InfoItem label="HQ Location" value={company.address?.split(',').pop()?.trim() || 'Not Set'} icon={<MapPin className="h-3.5 w-3.5" />} />
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* FAB */}
            <button className="fixed bottom-8 right-8 w-14 h-14 bg-black text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50 group">
                <Plus className="h-5 w-5" />
                <span className="absolute right-full mr-3 bg-black text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Post New Job
                </span>
            </button>
        </EmployerHubLayout>
    );
}

function FormField({ label, error, children, className }: { label: string; error?: string; children: ReactNode; className?: string }) {
    return (
        <div className={`space-y-1 ${className ?? ''}`}>
            <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                {label}
            </label>
            {children}
            <InputError message={error} />
        </div>
    );
}

function InfoItem({ label, value, icon }: { label: string; value?: string | null; icon: ReactNode }) {
    return (
        <div className="flex items-center gap-3 bg-white p-3 rounded-sm border border-zinc-100">
            <div className="w-7 h-7 flex items-center justify-center bg-zinc-50 rounded-sm text-zinc-500 shrink-0 border border-zinc-200/50">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[8px] uppercase font-black text-zinc-400 tracking-widest leading-none mb-1">{label}</p>
                <p className="text-xs font-bold text-black truncate">{value || 'Not provided'}</p>
            </div>
        </div>
    );
}

function getInitials(name?: string | null): string {
    if (!name) return 'AD';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

const underlinedInput = 
    "w-full bg-transparent border-0 border-b border-transparent hover:border-zinc-300 focus:ring-0 focus:border-black px-0 py-1.5 transition-all text-black placeholder:text-zinc-400 font-semibold text-xs";