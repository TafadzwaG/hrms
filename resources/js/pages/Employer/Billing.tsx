import { useForm, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { 
    CreditCard, 
    Download, 
    Mail, 
    Wallet, 
    MapPin, 
    Hash, 
    Phone, 
    FileText, 
    Calendar, 
    DollarSign, 
    Activity 
} from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { employerBreadcrumbs, EmployerHubLayout } from './components/hub';
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

    return (
        <EmployerHubLayout
            title="Billing"
            active="billing"
            subtitle='Billing and Subscriptions'
            company={company}
            user={user}
            breadcrumbs={employerBreadcrumbs('Billing')}
        >
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Profile & Subscription */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        
                        {/* Billing Profile (No Card Background) */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
                                <Mail className="h-4 w-4 text-black" />
                                <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-700">Billing Profile</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <FormField label="Company Name" icon={<CreditCard className="h-3 w-3" />} error={profileForm.errors.billing_name}>
                                    <input value={profileForm.data.billing_name} onChange={(e) => profileForm.setData('billing_name', e.target.value)} className={underlinedInput} />
                                </FormField>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField label="Billing Email" icon={<Mail className="h-3 w-3" />} error={profileForm.errors.billing_email}>
                                        <input type="email" value={profileForm.data.billing_email} onChange={(e) => profileForm.setData('billing_email', e.target.value)} className={underlinedInput} />
                                    </FormField>
                                    <FormField label="Phone" icon={<Phone className="h-3 w-3" />} error={profileForm.errors.billing_phone}>
                                        <input value={profileForm.data.billing_phone} onChange={(e) => profileForm.setData('billing_phone', e.target.value)} className={underlinedInput} />
                                    </FormField>
                                </div>

                                <FormField label="Address" icon={<MapPin className="h-3 w-3" />} error={profileForm.errors.billing_address}>
                                    <input value={profileForm.data.billing_address} onChange={(e) => profileForm.setData('billing_address', e.target.value)} className={underlinedInput} />
                                </FormField>

                                <FormField label="Tax ID / VAT Number" icon={<Hash className="h-3 w-3" />} error={profileForm.errors.tax_number}>
                                    <input value={profileForm.data.tax_number} onChange={(e) => profileForm.setData('tax_number', e.target.value)} className={underlinedInput} />
                                </FormField>

                                <div className="pt-2">
                                    <Button className="bg-black text-white hover:bg-zinc-800 px-5 py-4 h-auto rounded-sm font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-all w-full sm:w-auto" onClick={() => profileForm.put('/employer/billing/profile')} disabled={profileForm.processing}>
                                        Update Profile
                                    </Button>
                                </div>
                            </div>
                        </section>

                        {/* Subscription Card */}
                        <section className="bg-black text-white p-6 rounded-sm shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-white/10"></div>
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <div className="inline-flex items-center gap-2 bg-white/10 px-2 py-0.5 rounded-sm mb-3">
                                            <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse"></span>
                                            <span className="text-[8px] font-black uppercase tracking-widest text-white">Active Plan</span>
                                        </div>
                                        <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                                            <Wallet className="h-4 w-4" /> {subscription?.plan?.name ?? 'No Plan'}
                                        </h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-black tracking-tighter">${subscription?.amount ?? '0'}</p>
                                        <p className="text-[9px] font-medium text-white/40 uppercase tracking-widest">Billed Yearly</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="space-y-0.5">
                                        <p className="text-[8px] font-bold uppercase tracking-widest text-white/50 flex items-center gap-1"><CreditCard className="h-2.5 w-2.5" /> Seats</p>
                                        <p className="text-base font-bold">{subscription?.seats ?? 0} <span className="text-white/20 text-xs">/ 50</span></p>
                                    </div>
                                    <div className="space-y-0.5 text-right">
                                        <p className="text-[8px] font-bold uppercase tracking-widest text-white/50 flex items-center gap-1 justify-end"><Calendar className="h-2.5 w-2.5" /> Next Payment</p>
                                        <p className="text-sm font-bold">{subscription?.renews_at ?? 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Button className="w-full bg-white text-black hover:bg-zinc-200 py-3 h-auto rounded-sm font-black text-[10px] uppercase tracking-widest transition-all">
                                        Manage Seats
                                    </Button>
                                    <Button variant="outline" className="w-full bg-transparent border-white/20 text-white hover:bg-white/5 py-3 h-auto rounded-sm font-bold text-[10px] uppercase tracking-widest transition-all">
                                        Annual Billing
                                    </Button>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Invoices */}
                    <div className="lg:col-span-7">
                        <section className="bg-white p-6 border border-zinc-200 rounded-sm shadow-sm h-full">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-700 flex items-center gap-2">
                                        <FileText className="h-4 w-4" /> Invoice History
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-1">Download and manage statements.</p>
                                </div>
                                <Button variant="ghost" size="sm" className="h-7 px-0 text-[9px] font-black uppercase tracking-widest text-black hover:text-zinc-500">
                                    Export CSV
                                </Button>
                            </div>

                            <div className="space-y-0">
                                <div className="hidden md:grid grid-cols-12 px-3 py-2 bg-zinc-50 mb-4 rounded-sm text-xs font-medium uppercase tracking-widest text-zinc-500 border border-zinc-100">
                                    <div className="col-span-2 flex items-center gap-1"><Hash className="h-2.5 w-2.5" /> ID</div>
                                    <div className="col-span-4 flex items-center gap-1"><FileText className="h-2.5 w-2.5" /> Desc</div>
                                    <div className="col-span-2 text-center flex items-center gap-1 justify-center"><Calendar className="h-2.5 w-2.5" /> Date</div>
                                    <div className="col-span-2 text-right flex items-center gap-1 justify-end"><DollarSign className="h-2.5 w-2.5" /> Sum</div>
                                    <div className="col-span-2 text-right flex items-center gap-1 justify-end"><Activity className="h-2.5 w-2.5" /> State</div>
                                </div>

                                <div className="space-y-1">
                                    {invoices.length > 0 ? (
                                        invoices.map((invoice) => (
                                            <div key={invoice.id} className="grid grid-cols-1 md:grid-cols-12 items-center px-3 py-4 rounded-sm hover:bg-zinc-50 transition-colors group border border-transparent hover:border-zinc-100">
                                                <div className="col-span-2 font-mono text-[10px] font-bold text-black">{invoice.invoice_number}</div>
                                                <div className="col-span-4 text-xs font-semibold text-zinc-600 truncate pr-4">{invoice.description}</div>
                                                <div className="col-span-2 text-center text-[10px] text-zinc-400 font-bold uppercase">{invoice.issued_at}</div>
                                                <div className="col-span-2 text-right text-xs font-black text-black">{invoice.currency} {invoice.amount}</div>
                                                <div className="col-span-2 text-right flex justify-end">
                                                    <span className={`px-1.5 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-tighter border ${
                                                        invoice.status === 'paid' ? 'bg-black text-white border-black' : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                                                    }`}>
                                                        {invoice.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 text-[10px] font-bold uppercase tracking-widest text-zinc-300">No records found.</div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 p-4 rounded-sm bg-zinc-50 border border-zinc-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white flex items-center justify-center rounded-sm border border-zinc-200">
                                        <Download className="h-4 w-4 text-black" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-tight text-black">Financial Statement</p>
                                        <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Request a custom report for accounting.</p>
                                    </div>
                                    <Button variant="ghost" size="sm" className="ml-auto h-7 px-0 text-[9px] font-black uppercase tracking-widest hover:text-zinc-500">
                                        Request
                                    </Button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </EmployerHubLayout>
    );
}

function FormField({
    label,
    icon,
    error,
    children,
}: {
    label: string;
    icon?: ReactNode;
    error?: string;
    children: ReactNode;
}) {
    return (
        <div className="flex flex-col gap-0.5">
            <label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-zinc-500 mb-0.5">
                {icon} {label}
            </label>
            {children}
            <InputError message={error} className="mt-1" />
        </div>
    );
}

const underlinedInput = 
    "w-full bg-transparent border-0 border-b border-transparent hover:border-zinc-200 focus:border-black focus:ring-0 px-0 py-1 transition-all text-xs font-bold text-black placeholder:text-zinc-300 outline-none";
