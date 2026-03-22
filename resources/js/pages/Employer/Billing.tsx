import { useForm, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { CreditCard, Download, Mail, Wallet } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    EmployerHubLayout,
} from './components/hub';
import type { BillingProfile, Company, Invoice, Subscription, SubscriptionPlan, User } from './dummyData';

type PageProps = {
    company: Company;
    billingProfile: BillingProfile;
    subscription: Subscription;
    plans: SubscriptionPlan[];
    invoices: Invoice[];
};

export default function EmployerBillingPage() {
    const { company, billingProfile, subscription, plans, invoices } = usePage<PageProps>().props;
    const user = usePage<{ user?: User }>().props.user ?? { name: 'Employer User', email: company.email ?? '' };

    const profileForm = useForm({
        billing_name: billingProfile.billing_name ?? '',
        billing_email: billingProfile.billing_email ?? '',
        billing_phone: billingProfile.billing_phone ?? '',
        billing_address: billingProfile.billing_address ?? '',
        tax_number: billingProfile.tax_number ?? '',
    });

    const subscriptionForm = useForm({
        subscription_plan_id: subscription?.plan?.id?.toString() ?? plans[0]?.id?.toString() ?? '',
        seats: subscription?.seats?.toString() ?? '1',
    });

    return (
        <EmployerHubLayout
            title="Billing"
            subtitle="Manage your enterprise subscription, profile details, and review invoice history."
            active="billing"
            company={company}
            user={user}
        >
            <div className="mb-12">
                <h2 className="text-5xl font-black tracking-tight text-black mb-2">Billing</h2>
                <p className="text-muted-foreground font-medium">Manage your enterprise subscription, profile details, and review invoice history.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Profile & Plans */}
                <div className="lg:col-span-5 flex flex-col gap-8">
                    
                    {/* Billing Profile Card */}
                    <section className="bg-white p-8 shadow-[0px_40px_80px_-40px_rgba(0,0,0,0.04)] rounded-lg border border-zinc-100">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold tracking-tight">Billing Profile</h3>
                            <Mail className="h-5 w-5 text-zinc-400" />
                        </div>
                        
                        <div className="space-y-6">
                            <FormField label="Company Name" error={profileForm.errors.billing_name}>
                                <input 
                                    value={profileForm.data.billing_name} 
                                    onChange={(e) => profileForm.setData('billing_name', e.target.value)} 
                                    className={underlinedInput} 
                                />
                            </FormField>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Billing Email" error={profileForm.errors.billing_email}>
                                    <input 
                                        type="email" 
                                        value={profileForm.data.billing_email} 
                                        onChange={(e) => profileForm.setData('billing_email', e.target.value)} 
                                        className={underlinedInput} 
                                    />
                                </FormField>
                                <FormField label="Phone" error={profileForm.errors.billing_phone}>
                                    <input 
                                        value={profileForm.data.billing_phone} 
                                        onChange={(e) => profileForm.setData('billing_phone', e.target.value)} 
                                        className={underlinedInput} 
                                    />
                                </FormField>
                            </div>

                            <FormField label="Address" error={profileForm.errors.billing_address}>
                                <input 
                                    value={profileForm.data.billing_address} 
                                    onChange={(e) => profileForm.setData('billing_address', e.target.value)} 
                                    className={underlinedInput} 
                                />
                            </FormField>

                            <FormField label="Tax ID / VAT Number" error={profileForm.errors.tax_number}>
                                <input 
                                    value={profileForm.data.tax_number} 
                                    onChange={(e) => profileForm.setData('tax_number', e.target.value)} 
                                    className={underlinedInput} 
                                />
                            </FormField>

                            <div className="pt-4">
                                <Button 
                                    className="bg-black text-white hover:bg-zinc-800 px-6 py-6 h-auto rounded-md font-bold text-sm tracking-tight active:scale-95 transition-all"
                                    onClick={() => profileForm.put('/employer/billing/profile')}
                                    disabled={profileForm.processing}
                                >
                                    Update Profile
                                </Button>
                            </div>
                        </div>
                    </section>

                    {/* Subscription Card */}
                    <section className="bg-black text-white p-8 rounded-lg shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-10">
                                <div>
                                    <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full mb-4">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-white">Active Plan</span>
                                    </div>
                                    <h3 className="text-3xl font-black tracking-tighter">{subscription?.plan?.name ?? 'No Plan'}</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-4xl font-black tracking-tight">${subscription?.amount ?? '0'}</p>
                                    <p className="text-xs font-medium text-white/60">per month / billed yearly</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-10">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Seats Available</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold">{subscription?.seats ?? 0}</span>
                                        <span className="text-white/30">/</span>
                                        <span className="text-white/30 font-medium">50</span>
                                    </div>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Next Payment</p>
                                    <p className="text-lg font-bold">{subscription?.renews_at ?? 'N/A'}</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button className="w-full bg-white text-black hover:bg-zinc-100 px-6 py-6 h-auto rounded-md font-black text-sm tracking-tight transition-colors">
                                    Manage Seats & Limits
                                </Button>
                                <Button variant="outline" className="w-full bg-transparent border-white/20 text-white hover:bg-white/5 px-6 py-6 h-auto rounded-md font-bold text-sm tracking-tight transition-colors">
                                    Switch to Annual Billing
                                </Button>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Invoices */}
                <div className="lg:col-span-7">
                    <section className="bg-white p-8 shadow-[0px_40px_80px_-40px_rgba(0,0,0,0.04)] rounded-lg border border-zinc-100 h-full">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-xl font-bold tracking-tight">Invoice History</h3>
                                <p className="text-xs text-muted-foreground mt-1">Download and manage your past billing statements.</p>
                            </div>
                            <button className="text-xs font-bold uppercase tracking-wider text-black border-b-2 border-black pb-1 hover:opacity-70 transition-opacity">
                                Export CSV
                            </button>
                        </div>

                        <div className="space-y-0">
                            {/* Table Header */}
                            <div className="hidden md:grid grid-cols-12 px-4 py-3 bg-zinc-50 mb-6 rounded text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                <div className="col-span-2">Invoice #</div>
                                <div className="col-span-4">Description</div>
                                <div className="col-span-2 text-center">Date</div>
                                <div className="col-span-2 text-right">Amount</div>
                                <div className="col-span-2 text-right">Status</div>
                            </div>

                            <div className="space-y-1">
                                {invoices.length > 0 ? (
                                    invoices.map((invoice) => (
                                        <div key={invoice.id} className="grid grid-cols-1 md:grid-cols-12 items-center px-4 py-6 rounded-lg hover:bg-zinc-50 transition-colors group">
                                            <div className="col-span-2 font-mono text-xs text-black font-bold mb-2 md:mb-0">
                                                {invoice.invoice_number}
                                            </div>
                                            <div className="col-span-4 text-sm font-medium text-zinc-900 mb-2 md:mb-0">
                                                {invoice.description}
                                            </div>
                                            <div className="col-span-2 text-center text-sm text-zinc-500 mb-2 md:mb-0">
                                                {invoice.issued_at}
                                            </div>
                                            <div className="col-span-2 text-right text-sm font-bold text-black mb-2 md:mb-0">
                                                {invoice.currency} {invoice.amount}
                                            </div>
                                            <div className="col-span-2 text-right flex justify-end">
                                                <span className={`inline-flex items-center px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter ${
                                                    invoice.status === 'paid' ? 'bg-black text-white' : 'bg-zinc-200 text-zinc-900'
                                                }`}>
                                                    {invoice.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-zinc-400 text-sm">No invoices found.</div>
                                )}
                            </div>
                        </div>

                        {/* Financial Report Footer */}
                        <div className="mt-12 p-6 rounded-lg bg-zinc-50 border border-zinc-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white flex items-center justify-center rounded border border-zinc-200">
                                    <Download className="h-5 w-5 text-black" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-black">Need a full financial report?</p>
                                    <p className="text-xs text-zinc-500">Request a custom statement from our accounting department.</p>
                                </div>
                                <button className="ml-auto text-xs font-black tracking-tighter uppercase underline decoration-2 underline-offset-4 hover:text-zinc-600 transition-colors">
                                    Request Now
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </EmployerHubLayout>
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
        <div className="flex flex-col gap-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                {label}
            </label>
            {children}
            <InputError message={error} />
        </div>
    );
}

const underlinedInput = 
    "w-full bg-transparent border-0 border-b border-zinc-200 focus:border-black focus:ring-0 px-0 py-2 transition-all font-medium text-black placeholder:text-zinc-300 outline-none";