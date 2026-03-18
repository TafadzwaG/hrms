import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppLogoIcon from '@/components/app-logo-icon';
import { Building2, Mail, Lock, User, ChevronRight, Globe } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

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

export default function EmployerRegister() {
    const [step, setStep] = useState<1 | 2>(1);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
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
        // Basic client-side validation for step 1
        if (!data.name || !data.email || !data.password || !data.password_confirmation) {
            return;
        }
        if (data.password !== data.password_confirmation) {
            return;
        }
        setStep(2);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/employer/register');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
            <Head title="Register Your Company" />

            {/* Logo & Branding */}
            <div className="mb-8 flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900">
                    <AppLogoIcon className="h-6 w-6 fill-white" />
                </div>
                <div className="text-center">
                    <h1 className="text-xl font-bold text-slate-900">Register your company</h1>
                    <p className="mt-1 text-sm text-slate-500">Join the Providence Employer Network</p>
                </div>
            </div>

            {/* Step Indicator */}
            <div className="mb-8 flex items-center gap-0">
                {/* Step 1 Circle */}
                <div className="flex flex-col items-center">
                    <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                            step >= 1
                                ? 'bg-slate-900 text-white'
                                : 'border-2 border-slate-300 text-slate-400'
                        }`}
                    >
                        1
                    </div>
                    <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        Account
                    </span>
                </div>

                {/* Connecting Line */}
                <div
                    className={`mx-3 mt-[-14px] h-0.5 w-16 transition-colors ${
                        step >= 2 ? 'bg-slate-900' : 'bg-slate-200'
                    }`}
                />

                {/* Step 2 Circle */}
                <div className="flex flex-col items-center">
                    <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                            step >= 2
                                ? 'bg-slate-900 text-white'
                                : 'border-2 border-slate-300 text-slate-400'
                        }`}
                    >
                        2
                    </div>
                    <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        Company
                    </span>
                </div>
            </div>

            {/* Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10 w-full max-w-md">
                <form onSubmit={submit} className="flex flex-col gap-5">
                    {step === 1 && (
                        <>
                            {/* Full Name */}
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-slate-700">
                                    Your Full Name
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        autoFocus
                                        autoComplete="name"
                                        placeholder="Jane Smith"
                                        className="pl-10"
                                    />
                                </div>
                                <InputError message={errors.name} />
                            </div>

                            {/* Work Email */}
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-slate-700">
                                    Work Email
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoComplete="email"
                                        placeholder="jane@company.co.zw"
                                        className="pl-10"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            {/* Password + Confirm side by side */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="text-slate-700">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            required
                                            autoComplete="new-password"
                                            placeholder="••••••••"
                                            className="pl-10"
                                        />
                                    </div>
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation" className="text-slate-700">
                                        Confirm Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            required
                                            autoComplete="new-password"
                                            placeholder="••••••••"
                                            className="pl-10"
                                        />
                                    </div>
                                    <InputError message={errors.password_confirmation} />
                                </div>
                            </div>

                            {/* Next Button */}
                            <Button
                                type="button"
                                onClick={goToStep2}
                                className="mt-2 w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-5"
                            >
                                Next: Company Details
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            {/* Company Name */}
                            <div className="grid gap-2">
                                <Label htmlFor="company_name" className="text-slate-700">
                                    Company Name
                                </Label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        id="company_name"
                                        type="text"
                                        value={data.company_name}
                                        onChange={(e) => setData('company_name', e.target.value)}
                                        required
                                        autoFocus
                                        placeholder="e.g. TechVentures Zimbabwe"
                                        className="pl-10"
                                    />
                                </div>
                                <InputError message={errors.company_name} />
                            </div>

                            {/* Industry */}
                            <div className="grid gap-2">
                                <Label htmlFor="industry" className="text-slate-700">
                                    Industry
                                </Label>
                                <select
                                    id="industry"
                                    value={data.industry}
                                    onChange={(e) => setData('industry', e.target.value)}
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option value="">Select an industry</option>
                                    {INDUSTRIES.map((industry) => (
                                        <option key={industry.value} value={industry.value}>
                                            {industry.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.industry} />
                            </div>

                            {/* Registration Number */}
                            <div className="grid gap-2">
                                <Label htmlFor="registration_number" className="text-slate-700">
                                    Registration Number{' '}
                                    <span className="text-xs text-slate-400">(optional)</span>
                                </Label>
                                <Input
                                    id="registration_number"
                                    type="text"
                                    value={data.registration_number}
                                    onChange={(e) => setData('registration_number', e.target.value)}
                                    placeholder="e.g. ZW-2024-12345"
                                />
                                <InputError message={errors.registration_number} />
                            </div>

                            {/* Company Email */}
                            <div className="grid gap-2">
                                <Label htmlFor="company_email" className="text-slate-700">
                                    Company Email
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        id="company_email"
                                        type="email"
                                        value={data.company_email}
                                        onChange={(e) => setData('company_email', e.target.value)}
                                        required
                                        placeholder="hr@company.co.zw"
                                        className="pl-10"
                                    />
                                </div>
                                <InputError message={errors.company_email} />
                            </div>

                            {/* Company Phone */}
                            <div className="grid gap-2">
                                <Label htmlFor="company_phone" className="text-slate-700">
                                    Company Phone
                                </Label>
                                <Input
                                    id="company_phone"
                                    type="tel"
                                    value={data.company_phone}
                                    onChange={(e) => setData('company_phone', e.target.value)}
                                    required
                                    placeholder="+263 4 xxx xxxx"
                                />
                                <InputError message={errors.company_phone} />
                            </div>

                            {/* Website */}
                            <div className="grid gap-2">
                                <Label htmlFor="website" className="text-slate-700">
                                    Website{' '}
                                    <span className="text-xs text-slate-400">(optional)</span>
                                </Label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        id="website"
                                        type="url"
                                        value={data.website}
                                        onChange={(e) => setData('website', e.target.value)}
                                        placeholder="https://www.company.co.zw"
                                        className="pl-10"
                                    />
                                </div>
                                <InputError message={errors.website} />
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-2 flex flex-col gap-3">
                                <Button
                                    type="submit"
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-5"
                                    disabled={processing}
                                >
                                    {processing && <Spinner className="mr-2" />}
                                    Complete Registration
                                </Button>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                                >
                                    Back
                                </button>
                            </div>
                        </>
                    )}
                </form>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-3 text-slate-400 uppercase tracking-wide">
                            Or continue with
                        </span>
                    </div>
                </div>

                {/* Google Button */}
                <button
                    type="button"
                    className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Sign up with Google
                </button>
            </div>

            {/* Login Link */}
            <p className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{' '}
                <Link
                    href="/employer/login"
                    className="font-semibold text-slate-900 hover:underline"
                >
                    Log in
                </Link>
            </p>
        </div>
    );
}
