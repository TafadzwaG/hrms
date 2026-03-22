import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { type FormEventHandler, useState } from 'react';
import { Building2, ChevronRight, Globe, Lock, Mail, User } from 'lucide-react';

import AppLogoIcon from '@/components/app-logo-icon';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

const INDUSTRIES = [
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'banking', label: 'Banking' },
    { value: 'construction', label: 'Construction' },
    { value: 'education', label: 'Education' },
    { value: 'energy', label: 'Energy' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'hospitality', label: 'Hospitality' },
    { value: 'information_technology', label: 'Information Technology' },
    { value: 'legal', label: 'Legal' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'media', label: 'Media' },
    { value: 'mining', label: 'Mining' },
    { value: 'ngo', label: 'NGO' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'retail', label: 'Retail' },
    { value: 'telecommunications', label: 'Telecommunications' },
    { value: 'transport', label: 'Transport' },
    { value: 'other', label: 'Other' },
] as const;

type PageProps = {
    setupMode?: boolean;
    initialValues?: {
        name?: string | null;
        email?: string | null;
    } | null;
};

export default function EmployerRegister() {
    const { setupMode = false, initialValues = null } = usePage<PageProps>().props;
    const [step, setStep] = useState<1 | 2>(1);

    const { data, setData, post, processing, errors } = useForm({
        name: initialValues?.name ?? '',
        email: initialValues?.email ?? '',
        password: '',
        password_confirmation: '',
        company_name: '',
        industry: '',
        registration_number: '',
        company_email: '',
        company_phone: '',
        website: '',
    });

    const goToStep2 = () => {
        if (!data.name || !data.email) {
            return;
        }

        if (!setupMode && (!data.password || !data.password_confirmation || data.password !== data.password_confirmation)) {
            return;
        }

        setStep(2);
    };

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post('/employer/register');
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center justify-center px-4 py-12">
            <Head title={setupMode ? 'Complete Company Setup' : 'Register Your Company'} />

            <div className="mb-8 flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900">
                    <AppLogoIcon className="h-6 w-6 fill-white" />
                </div>
                <div className="text-center">
                    <h1 className="text-xl font-bold text-slate-900">{setupMode ? 'Complete your company profile' : 'Register your company'}</h1>
                    <p className="mt-1 text-sm text-slate-500">{setupMode ? 'Finish setting up the Employer Hub' : 'Join the Providence Employer Network'}</p>
                </div>
            </div>

            <div className="mb-8 flex items-center gap-0">
                <div className="flex flex-col items-center">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${step >= 1 ? 'bg-slate-900 text-white' : 'border-2 border-slate-300 text-slate-400'}`}>1</div>
                    <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Account</span>
                </div>
                <div className={`mx-3 mt-[-14px] h-0.5 w-16 transition-colors ${step >= 2 ? 'bg-slate-900' : 'bg-slate-200'}`} />
                <div className="flex flex-col items-center">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${step >= 2 ? 'bg-slate-900 text-white' : 'border-2 border-slate-300 text-slate-400'}`}>2</div>
                    <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Company</span>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10 w-full max-w-md">
                <form onSubmit={submit} className="flex flex-col gap-5">
                    {step === 1 && (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-slate-700">Your Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input id="name" type="text" value={data.name} onChange={(event) => setData('name', event.target.value)} required autoFocus autoComplete="name" placeholder="Jane Smith" className="pl-10" />
                                </div>
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-slate-700">Work Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input id="email" type="email" value={data.email} onChange={(event) => setData('email', event.target.value)} required autoComplete="email" placeholder="jane@company.co.zw" className="pl-10" />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            {!setupMode && (
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="grid gap-2">
                                        <Label htmlFor="password" className="text-slate-700">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                            <Input id="password" type="password" value={data.password} onChange={(event) => setData('password', event.target.value)} required className="pl-10" />
                                        </div>
                                        <InputError message={errors.password} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation" className="text-slate-700">Confirm Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                            <Input id="password_confirmation" type="password" value={data.password_confirmation} onChange={(event) => setData('password_confirmation', event.target.value)} required className="pl-10" />
                                        </div>
                                        <InputError message={errors.password_confirmation} />
                                    </div>
                                </div>
                            )}

                            <Button type="button" onClick={goToStep2} className="mt-2 w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-5">
                                Next: Company Details
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="company_name" className="text-slate-700">Company Name</Label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input id="company_name" type="text" value={data.company_name} onChange={(event) => setData('company_name', event.target.value)} required autoFocus className="pl-10" />
                                </div>
                                <InputError message={errors.company_name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="industry" className="text-slate-700">Industry</Label>
                                <select id="industry" value={data.industry} onChange={(event) => setData('industry', event.target.value)} required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option value="">Select an industry</option>
                                    {INDUSTRIES.map((industry) => (
                                        <option key={industry.value} value={industry.value}>{industry.label}</option>
                                    ))}
                                </select>
                                <InputError message={errors.industry} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="registration_number" className="text-slate-700">Registration Number</Label>
                                <Input id="registration_number" type="text" value={data.registration_number} onChange={(event) => setData('registration_number', event.target.value)} />
                                <InputError message={errors.registration_number} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="company_email" className="text-slate-700">Company Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input id="company_email" type="email" value={data.company_email} onChange={(event) => setData('company_email', event.target.value)} required className="pl-10" />
                                </div>
                                <InputError message={errors.company_email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="company_phone" className="text-slate-700">Company Phone</Label>
                                <Input id="company_phone" type="tel" value={data.company_phone} onChange={(event) => setData('company_phone', event.target.value)} required />
                                <InputError message={errors.company_phone} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="website" className="text-slate-700">Website</Label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input id="website" type="url" value={data.website} onChange={(event) => setData('website', event.target.value)} className="pl-10" />
                                </div>
                                <InputError message={errors.website} />
                            </div>

                            <div className="mt-2 flex flex-col gap-3">
                                <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-5" disabled={processing}>
                                    {processing && <Spinner className="mr-2" />}
                                    {setupMode ? 'Complete Setup' : 'Complete Registration'}
                                </Button>
                                <button type="button" onClick={() => setStep(1)} className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                                    Back
                                </button>
                            </div>
                        </>
                    )}
                </form>

                {!setupMode && (
                    <>
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-white px-3 text-slate-400 uppercase tracking-wide">Or continue with</span>
                            </div>
                        </div>

                        <button type="button" className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                            Sign up with Google
                        </button>
                    </>
                )}
            </div>

            {!setupMode && (
                <p className="mt-6 text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link href="/employer/login" className="font-semibold text-slate-900 hover:underline">
                        Log in
                    </Link>
                </p>
            )}
        </div>
    );
}
