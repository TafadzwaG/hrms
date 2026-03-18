import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useCallback, useRef, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppLogoIcon from '@/components/app-logo-icon';
import { User, ChevronRight, Upload, FileText, ArrowLeft } from 'lucide-react';

const STEPS = ['Identity', 'Professional', 'CV Upload'] as const;

const EDUCATION_OPTIONS = [
    { value: '', label: 'Select highest education' },
    { value: 'high_school', label: 'High School' },
    { value: 'diploma', label: 'Diploma' },
    { value: 'bachelors', label: 'Bachelors' },
    { value: 'masters', label: 'Masters' },
    { value: 'doctorate', label: 'Doctorate' },
    { value: 'professional', label: 'Professional' },
    { value: 'other', label: 'Other' },
];

export default function CandidateRegister() {
    const [step, setStep] = useState(1);
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [cvError, setCvError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        headline: '',
        phone: '',
        location: '',
        years_experience: '',
        highest_education: '',
    });

    const validateStep1 = (): boolean => {
        if (!data.name.trim() || !data.email.trim() || !data.password || !data.password_confirmation) {
            return false;
        }
        if (data.password !== data.password_confirmation) {
            return false;
        }
        if (data.password.length < 8) {
            return false;
        }
        return true;
    };

    const validateStep2 = (): boolean => {
        return true; // All step 2 fields are optional
    };

    const goToStep = (target: number) => {
        if (target === 2 && !validateStep1()) return;
        if (target === 3 && !validateStep2()) return;
        setStep(target);
    };

    const handleFileChange = (file: File | null) => {
        setCvError('');
        if (!file) return;

        const validTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (!validTypes.includes(file.type)) {
            setCvError('Please upload a PDF, DOC, or DOCX file.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setCvError('File size must be less than 5MB.');
            return;
        }
        setCvFile(file);
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0] || null;
        handleFileChange(file);
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/candidate/register', {
            forceFormData: true,
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
            <Head title="Create Account — Candidate Hub" />

            {/* Logo & Branding */}
            <div className="flex flex-col items-center mb-8">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 mb-4">
                    <AppLogoIcon className="w-7 h-7 fill-white" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h1>
                <p className="text-sm text-slate-500">Join the Providence Candidate Hub</p>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-center mb-8 w-full max-w-md">
                {STEPS.map((label, idx) => {
                    const stepNum = idx + 1;
                    const isActive = step >= stepNum;
                    return (
                        <div key={label} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-colors ${
                                        isActive
                                            ? 'bg-slate-900 text-white'
                                            : 'border-2 border-slate-300 text-slate-400'
                                    }`}
                                >
                                    {stepNum}
                                </div>
                                <span
                                    className={`mt-1.5 text-[10px] font-semibold uppercase tracking-wider ${
                                        isActive ? 'text-slate-900' : 'text-slate-400'
                                    }`}
                                >
                                    {label}
                                </span>
                            </div>
                            {idx < STEPS.length - 1 && (
                                <div
                                    className={`w-16 sm:w-24 h-0.5 mx-2 mb-5 transition-colors ${
                                        step > stepNum ? 'bg-slate-900' : 'bg-slate-200'
                                    }`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10 w-full max-w-md">
                <form onSubmit={submit} className="flex flex-col gap-5">
                    {/* ── Step 1: Identity ── */}
                    {step === 1 && (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                                    Full Name
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="pl-10"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                                        Password
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.password} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation" className="text-sm font-medium text-slate-700">
                                        Confirm Password
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        placeholder="••••••••"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>
                            </div>

                            <Button
                                type="button"
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-5 mt-2"
                                onClick={() => goToStep(2)}
                            >
                                Next: Professional Info
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </>
                    )}

                    {/* ── Step 2: Professional ── */}
                    {step === 2 && (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="headline" className="text-sm font-medium text-slate-700">
                                    Headline
                                </Label>
                                <Input
                                    id="headline"
                                    type="text"
                                    placeholder="e.g. Senior Software Engineer"
                                    value={data.headline}
                                    onChange={(e) => setData('headline', e.target.value)}
                                    autoFocus
                                />
                                <InputError message={errors.headline} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                                    Phone
                                </Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+263 7x xxx xxxx"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                                <InputError message={errors.phone} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="location" className="text-sm font-medium text-slate-700">
                                    Location
                                </Label>
                                <Input
                                    id="location"
                                    type="text"
                                    placeholder="e.g. Harare"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                />
                                <InputError message={errors.location} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="years_experience" className="text-sm font-medium text-slate-700">
                                    Years of Experience
                                </Label>
                                <Input
                                    id="years_experience"
                                    type="number"
                                    min="0"
                                    max="50"
                                    placeholder="0"
                                    value={data.years_experience}
                                    onChange={(e) => setData('years_experience', e.target.value)}
                                />
                                <InputError message={errors.years_experience} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="highest_education" className="text-sm font-medium text-slate-700">
                                    Highest Education
                                </Label>
                                <select
                                    id="highest_education"
                                    value={data.highest_education}
                                    onChange={(e) => setData('highest_education', e.target.value)}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    {EDUCATION_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.highest_education} />
                            </div>

                            <div className="flex items-center gap-3 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                                >
                                    <ArrowLeft className="mr-1 h-4 w-4" />
                                    Back
                                </button>
                                <Button
                                    type="button"
                                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-5"
                                    onClick={() => goToStep(3)}
                                >
                                    Next: CV Upload
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </>
                    )}

                    {/* ── Step 3: CV Upload ── */}
                    {step === 3 && (
                        <>
                            <div
                                className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-slate-400 transition-colors"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {cvFile ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <FileText className="h-10 w-10 text-slate-500" />
                                        <p className="text-sm font-medium text-slate-700">{cvFile.name}</p>
                                        <p className="text-xs text-slate-400">
                                            {(cvFile.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCvFile(null);
                                            }}
                                            className="text-xs text-red-500 hover:text-red-700 font-medium mt-1"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <Upload className="h-10 w-10 text-slate-400" />
                                        <p className="text-sm font-medium text-slate-600">
                                            Drag and drop your CV here, or click to browse
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            PDF, DOC, DOCX (max 5MB)
                                        </p>
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className="hidden"
                                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                                />
                            </div>
                            {cvError && (
                                <p className="text-sm text-red-600">{cvError}</p>
                            )}

                            <div className="flex items-center gap-3 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                                >
                                    <ArrowLeft className="mr-1 h-4 w-4" />
                                    Back
                                </button>
                                <Button
                                    type="submit"
                                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-5"
                                    disabled={processing}
                                >
                                    {processing && <Spinner className="mr-2" />}
                                    Complete Registration
                                </Button>
                            </div>

                            <button
                                type="button"
                                onClick={submit as any}
                                className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors text-center"
                            >
                                Skip for now
                            </button>
                        </>
                    )}
                </form>
            </div>

            {/* Divider + Google */}
            <div className="w-full max-w-md mt-6">
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-slate-50 px-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Or continue with
                        </span>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full border-slate-200 hover:bg-white text-slate-700 font-medium py-5"
                >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
                </Button>
            </div>

            {/* Footer link */}
            <p className="mt-6 text-sm text-slate-500">
                Already have an account?{' '}
                <Link
                    href="/candidate/login"
                    className="font-semibold text-slate-900 hover:text-slate-700 transition-colors"
                >
                    Log in
                </Link>
            </p>
        </div>
    );
}
