import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { type DragEvent, type FormEventHandler, useCallback, useRef, useState } from 'react';
import { ArrowLeft, ChevronRight, FileText, Upload, User } from 'lucide-react';

import AppLogoIcon from '@/components/app-logo-icon';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

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

type PageProps = {
    setupMode?: boolean;
    initialValues?: {
        name?: string | null;
        email?: string | null;
    } | null;
};

export default function CandidateRegister() {
    const { setupMode = false, initialValues = null } = usePage<PageProps>().props;
    const [step, setStep] = useState(1);
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [cvError, setCvError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        name: initialValues?.name ?? '',
        email: initialValues?.email ?? '',
        password: '',
        password_confirmation: '',
        headline: '',
        phone: '',
        location: '',
        years_experience: '',
        highest_education: '',
    });

    const validateStep1 = (): boolean => {
        if (!data.name.trim() || !data.email.trim()) {
            return false;
        }

        if (setupMode) {
            return true;
        }

        return Boolean(data.password && data.password_confirmation && data.password === data.password_confirmation && data.password.length >= 8);
    };

    const goToStep = (target: number) => {
        if (target === 2 && !validateStep1()) {
            return;
        }

        setStep(target);
    };

    const handleFileChange = (file: File | null) => {
        setCvError('');

        if (!file) {
            return;
        }

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

    const handleDrop = useCallback((event: DragEvent) => {
        event.preventDefault();
        handleFileChange(event.dataTransfer.files?.[0] ?? null);
    }, []);

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        post('/candidate/register', {
            forceFormData: true,
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center justify-center px-4 py-12">
            <Head title={setupMode ? 'Complete Candidate Setup' : 'Create Account - Candidate Hub'} />

            <div className="flex flex-col items-center mb-8">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 mb-4">
                    <AppLogoIcon className="w-7 h-7 fill-white" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">{setupMode ? 'Complete your candidate profile' : 'Create your account'}</h1>
                <p className="text-sm text-slate-500">{setupMode ? 'Finish setting up the Candidate Hub' : 'Join the Providence Candidate Hub'}</p>
            </div>

            <div className="flex items-center justify-center mb-8 w-full max-w-md">
                {STEPS.map((label, idx) => {
                    const stepNum = idx + 1;
                    const isActive = step >= stepNum;

                    return (
                        <div key={label} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-colors ${isActive ? 'bg-slate-900 text-white' : 'border-2 border-slate-300 text-slate-400'}`}>
                                    {stepNum}
                                </div>
                                <span className={`mt-1.5 text-[10px] font-semibold uppercase tracking-wider ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                                    {label}
                                </span>
                            </div>
                            {idx < STEPS.length - 1 && (
                                <div className={`w-16 sm:w-24 h-0.5 mx-2 mb-5 transition-colors ${step > stepNum ? 'bg-slate-900' : 'bg-slate-200'}`} />
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10 w-full max-w-md">
                <form onSubmit={submit} className="flex flex-col gap-5">
                    {step === 1 && (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-sm font-medium text-slate-700">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input id="name" type="text" placeholder="John Doe" value={data.name} onChange={(event) => setData('name', event.target.value)} className="pl-10" required autoFocus />
                                </div>
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</Label>
                                <Input id="email" type="email" placeholder="john@example.com" value={data.email} onChange={(event) => setData('email', event.target.value)} required />
                                <InputError message={errors.email} />
                            </div>

                            {!setupMode && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                                        <Input id="password" type="password" placeholder="********" value={data.password} onChange={(event) => setData('password', event.target.value)} required />
                                        <InputError message={errors.password} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation" className="text-sm font-medium text-slate-700">Confirm Password</Label>
                                        <Input id="password_confirmation" type="password" placeholder="********" value={data.password_confirmation} onChange={(event) => setData('password_confirmation', event.target.value)} required />
                                        <InputError message={errors.password_confirmation} />
                                    </div>
                                </div>
                            )}

                            <Button type="button" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-5 mt-2" onClick={() => goToStep(2)}>
                                Next: Professional Info
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="headline" className="text-sm font-medium text-slate-700">Headline</Label>
                                <Input id="headline" type="text" placeholder="e.g. Senior Software Engineer" value={data.headline} onChange={(event) => setData('headline', event.target.value)} autoFocus />
                                <InputError message={errors.headline} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone</Label>
                                <Input id="phone" type="tel" placeholder="+263 7x xxx xxxx" value={data.phone} onChange={(event) => setData('phone', event.target.value)} />
                                <InputError message={errors.phone} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="location" className="text-sm font-medium text-slate-700">Location</Label>
                                <Input id="location" type="text" placeholder="e.g. Harare" value={data.location} onChange={(event) => setData('location', event.target.value)} />
                                <InputError message={errors.location} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="years_experience" className="text-sm font-medium text-slate-700">Years of Experience</Label>
                                <Input id="years_experience" type="number" min="0" max="50" placeholder="0" value={data.years_experience} onChange={(event) => setData('years_experience', event.target.value)} />
                                <InputError message={errors.years_experience} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="highest_education" className="text-sm font-medium text-slate-700">Highest Education</Label>
                                <select id="highest_education" value={data.highest_education} onChange={(event) => setData('highest_education', event.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                                    {EDUCATION_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                                <InputError message={errors.highest_education} />
                            </div>

                            <div className="flex items-center gap-3 mt-2">
                                <button type="button" onClick={() => setStep(1)} className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                                    <ArrowLeft className="mr-1 h-4 w-4" />
                                    Back
                                </button>
                                <Button type="button" className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-5" onClick={() => goToStep(3)}>
                                    Next: CV Upload
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <div
                                className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-slate-400 transition-colors"
                                onDragOver={(event) => event.preventDefault()}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {cvFile ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <FileText className="h-10 w-10 text-slate-500" />
                                        <p className="text-sm font-medium text-slate-700">{cvFile.name}</p>
                                        <p className="text-xs text-slate-400">{(cvFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.stopPropagation();
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
                                        <p className="text-sm font-medium text-slate-600">Drag and drop your CV here, or click to browse</p>
                                        <p className="text-xs text-slate-400">PDF, DOC, DOCX (max 5MB)</p>
                                    </div>
                                )}
                                <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)} />
                            </div>
                            {cvError && <p className="text-sm text-red-600">{cvError}</p>}

                            <div className="flex items-center gap-3 mt-2">
                                <button type="button" onClick={() => setStep(2)} className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                                    <ArrowLeft className="mr-1 h-4 w-4" />
                                    Back
                                </button>
                                <Button type="submit" className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-5" disabled={processing}>
                                    {processing && <Spinner className="mr-2" />}
                                    {setupMode ? 'Complete Setup' : 'Complete Registration'}
                                </Button>
                            </div>

                            <button type="button" onClick={submit as never} className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors text-center">
                                Skip for now
                            </button>
                        </>
                    )}
                </form>
            </div>

            {!setupMode && (
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

                    <Button type="button" variant="outline" className="w-full border-slate-200 hover:bg-white text-slate-700 font-medium py-5">
                        Sign up with Google
                    </Button>
                </div>
            )}

            {!setupMode && (
                <p className="mt-6 text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link href="/candidate/login" className="font-semibold text-slate-900 hover:text-slate-700 transition-colors">
                        Log in
                    </Link>
                </p>
            )}
        </div>
    );
}
