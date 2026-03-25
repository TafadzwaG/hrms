import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    BriefcaseBusiness,
    Building2,
    ChevronRight,
    FileText,
    Globe,
    Mail,
    ShieldCheck,
    Upload,
    UserRound,
} from 'lucide-react';
import { type DragEvent, type FormEventHandler, useMemo, useRef, useState } from 'react';

import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';
import type { PortalType } from '@/types';

type Props = {
    availablePortals: PortalType[];
    defaultPortal?: PortalType | null;
    setupMode: boolean;
    initialValues?: {
        name?: string | null;
        email?: string | null;
    } | null;
};

type RegisterFormData = {
    portal: PortalType | '';
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    headline: string;
    phone: string;
    location: string;
    years_experience: string;
    highest_education: string;
    company_name: string;
    industry: string;
    registration_number: string;
    company_email: string;
    company_phone: string;
    website: string;
    cv: File | null;
};

const portalCards: Array<{
    portal: PortalType;
    label: string;
    description: string;
    icon: typeof BriefcaseBusiness;
}> = [
    {
        portal: 'employee',
        label: 'Employee',
        description: 'Internal HRMS access for workforce operations, payroll, leave, and employee services.',
        icon: BriefcaseBusiness,
    },
    {
        portal: 'candidate',
        label: 'Candidate',
        description: 'External talent account for applications, profile visibility, and recruitment workflows.',
        icon: UserRound,
    },
    {
        portal: 'employer',
        label: 'Employer',
        description: 'Company hiring access for vacancies, candidates, interviews, and reports.',
        icon: Building2,
    },
];

const educationOptions = [
    { value: 'high_school', label: 'High School' },
    { value: 'diploma', label: 'Diploma' },
    { value: 'bachelors', label: 'Bachelors' },
    { value: 'masters', label: 'Masters' },
    { value: 'doctorate', label: 'Doctorate' },
    { value: 'professional', label: 'Professional' },
    { value: 'other', label: 'Other' },
];

const industryOptions = [
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
];

export default function RegisterPage({
    availablePortals,
    defaultPortal = null,
    setupMode,
    initialValues = null,
}: Props) {
    const initialPortal = defaultPortal && availablePortals.includes(defaultPortal) ? defaultPortal : null;
    const [portal, setPortal] = useState<PortalType | null>(initialPortal);
    const [step, setStep] = useState<number>(initialPortal ? 1 : 0);
    const [cvError, setCvError] = useState('');
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const { data, setData, post, processing, errors } = useForm<RegisterFormData>({
        portal: initialPortal ?? '',
        name: initialValues?.name ?? '',
        email: initialValues?.email ?? '',
        password: '',
        password_confirmation: '',
        headline: '',
        phone: '',
        location: '',
        years_experience: '',
        highest_education: '',
        company_name: '',
        industry: '',
        registration_number: '',
        company_email: '',
        company_phone: '',
        website: '',
        cv: null,
    });

    const branchSteps = useMemo(() => {
        if (portal === 'candidate') {
            return ['Account', 'Professional', 'CV Upload'];
        }

        if (portal === 'employer') {
            return ['Account', 'Company'];
        }

        if (portal === 'employee') {
            return ['Account'];
        }

        return [];
    }, [portal]);

    const isAccountStepValid =
        data.name.trim() !== '' &&
        data.email.trim() !== '' &&
        (setupMode || (data.password !== '' && data.password === data.password_confirmation));

    const selectPortal = (nextPortal: PortalType) => {
        setPortal(nextPortal);
        setData('portal', nextPortal);
        setStep(1);
    };

    const goBack = () => {
        if (step > 1) {
            setStep((current) => current - 1);
            return;
        }

        if (availablePortals.length > 1) {
            setStep(0);
        }
    };

    const handleFileChange = (file: File | null) => {
        setCvError('');
        setData('cv', file);

        if (!file) {
            return;
        }

        const validTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        if (!validTypes.includes(file.type)) {
            setData('cv', null);
            setCvError('Upload a PDF, DOC, or DOCX file.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setData('cv', null);
            setCvError('File size must be 5MB or less.');
        }
    };

    const handleDrop = (event: DragEvent) => {
        event.preventDefault();
        handleFileChange(event.dataTransfer.files?.[0] ?? null);
    };

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        if (!portal) {
            return;
        }

        post(store.url(), {
            forceFormData: true,
        });
    };

    const loginHref = login(
        portal && portal !== 'employee' ? { query: { portal } } : undefined,
    );

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
            <Head title={setupMode ? 'Add Portal Access' : 'Create Portal Account'} />

            <div className="mb-8 flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground">
                    <ShieldCheck className="h-6 w-6 text-background" />
                </div>
                <div className="text-center">
                    <h1 className="text-xl font-bold text-foreground">
                        {setupMode ? 'Add a new portal' : 'Create your account'}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {setupMode
                            ? 'Extend this account with another portal without creating a duplicate user.'
                            : 'One account, explicit portal identity, and direct routing after sign in.'}
                    </p>
                </div>
            </div>

            {portal ? (
                <div className="mb-8 flex items-center gap-0">
                    {branchSteps.map((label, index) => {
                        const stepNumber = index + 1;
                        const isActive = step >= stepNumber;

                        return (
                            <div key={label} className="flex items-center">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                                            isActive
                                                ? 'bg-foreground text-background'
                                                : 'border-2 border-border text-muted-foreground'
                                        }`}
                                    >
                                        {stepNumber}
                                    </div>
                                    <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        {label}
                                    </span>
                                </div>
                                {index < branchSteps.length - 1 ? (
                                    <div
                                        className={`mx-3 mt-[-14px] h-0.5 w-16 sm:w-24 transition-colors ${
                                            step > stepNumber ? 'bg-foreground' : 'bg-border'
                                        }`}
                                    />
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            ) : null}

            <div className="w-full max-w-4xl rounded-2xl border border-border bg-card p-8 shadow-sm sm:p-10">
                {step === 0 ? (
                    <div className="space-y-6">
                        <div className="text-center">
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                                Step 0
                            </p>
                            <h2 className="mt-3 text-lg font-semibold text-foreground">Choose your portal type</h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                This selection defines the profile data we create and the dashboard you will land on.
                            </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            {portalCards
                                .filter((card) => availablePortals.includes(card.portal))
                                .map((card) => {
                                    const Icon = card.icon;

                                    return (
                                        <button
                                            key={card.portal}
                                            type="button"
                                            onClick={() => selectPortal(card.portal)}
                                            className="rounded-2xl border border-border bg-background/60 p-5 text-left transition-colors hover:border-foreground"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-foreground">
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-foreground">{card.label}</p>
                                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                                        Portal
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="mt-4 text-sm leading-6 text-muted-foreground">
                                                {card.description}
                                            </p>
                                        </button>
                                    );
                                })}
                        </div>

                        <InputError message={errors.portal} />
                    </div>
                ) : null}

                {portal ? (
                    <form onSubmit={submit} className="flex flex-col gap-5">
                        <div className="mb-1 flex items-center justify-between gap-3">
                            <div>
                                <Badge variant="secondary">{portal}</Badge>
                            </div>
                            {availablePortals.length > 1 ? (
                                <button
                                    type="button"
                                    onClick={() => setStep(0)}
                                    className="text-xs font-medium text-muted-foreground hover:text-foreground"
                                >
                                    Change portal type
                                </button>
                            ) : null}
                        </div>

                        {step === 1 ? (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="text-foreground">
                                        Full Name
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(event) => setData('name', event.target.value)}
                                        required
                                        autoFocus
                                        autoComplete="name"
                                        placeholder="Jane Doe"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-foreground">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(event) => setData('email', event.target.value)}
                                            required
                                            autoComplete="email"
                                            placeholder="you@example.com"
                                            className="pl-10"
                                        />
                                    </div>
                                    <InputError message={errors.email} />
                                </div>

                                {!setupMode ? (
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="password" className="text-foreground">
                                                Password
                                            </Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                onChange={(event) => setData('password', event.target.value)}
                                                required
                                                autoComplete="new-password"
                                                placeholder="Create a strong password"
                                            />
                                            <InputError message={errors.password} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="password_confirmation" className="text-foreground">
                                                Confirm Password
                                            </Label>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                value={data.password_confirmation}
                                                onChange={(event) => setData('password_confirmation', event.target.value)}
                                                required
                                                autoComplete="new-password"
                                                placeholder="Repeat password"
                                            />
                                            <InputError message={errors.password_confirmation} />
                                        </div>
                                    </div>
                                ) : null}

                                {portal === 'employee' ? (
                                    <Button type="submit" className="mt-2 w-full" disabled={processing}>
                                        {processing ? <Spinner className="mr-2" /> : null}
                                        {setupMode ? 'Add Employee Portal' : 'Create Employee Portal'}
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            if (isAccountStepValid) {
                                                setStep(2);
                                            }
                                        }}
                                        className="mt-2 w-full"
                                        disabled={!isAccountStepValid}
                                    >
                                        Continue
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                )}
                            </>
                        ) : null}

                        {portal === 'candidate' && step === 2 ? (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="headline" className="text-foreground">
                                        Headline
                                    </Label>
                                    <Input
                                        id="headline"
                                        type="text"
                                        value={data.headline}
                                        onChange={(event) => setData('headline', event.target.value)}
                                        autoFocus
                                        placeholder="Senior Software Engineer"
                                    />
                                    <InputError message={errors.headline} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="phone" className="text-foreground">
                                        Phone
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={data.phone}
                                        onChange={(event) => setData('phone', event.target.value)}
                                        placeholder="+263 77 000 0000"
                                    />
                                    <InputError message={errors.phone} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="location" className="text-foreground">
                                        Location
                                    </Label>
                                    <Input
                                        id="location"
                                        type="text"
                                        value={data.location}
                                        onChange={(event) => setData('location', event.target.value)}
                                        placeholder="Harare"
                                    />
                                    <InputError message={errors.location} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="years_experience" className="text-foreground">
                                        Years of Experience
                                    </Label>
                                    <Input
                                        id="years_experience"
                                        type="number"
                                        min="0"
                                        max="50"
                                        value={data.years_experience}
                                        onChange={(event) => setData('years_experience', event.target.value)}
                                        placeholder="5"
                                    />
                                    <InputError message={errors.years_experience} />
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-foreground">Highest Education</Label>
                                    <Select
                                        value={data.highest_education || undefined}
                                        onValueChange={(value) => setData('highest_education', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select highest education" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {educationOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.highest_education} />
                                </div>

                                <div className="mt-2 flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={goBack}
                                        className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
                                    >
                                        <ArrowLeft className="mr-1 h-4 w-4" />
                                        Back
                                    </button>
                                    <Button type="button" className="flex-1" onClick={() => setStep(3)}>
                                        Continue
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </>
                        ) : null}

                        {portal === 'candidate' && step === 3 ? (
                            <>
                                <div
                                    className="cursor-pointer rounded-xl border-2 border-dashed border-border p-8 text-center transition-colors hover:border-foreground"
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={(event) => event.preventDefault()}
                                    onDrop={handleDrop}
                                >
                                    {data.cv ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <FileText className="h-10 w-10 text-muted-foreground" />
                                            <p className="text-sm font-medium text-foreground">{data.cv.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {(data.cv.size / (1024 * 1024)).toFixed(2)} MB
                                            </p>
                                            <button
                                                type="button"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleFileChange(null);
                                                }}
                                                className="text-xs font-medium text-muted-foreground hover:text-foreground"
                                            >
                                                Remove file
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <Upload className="h-10 w-10 text-muted-foreground" />
                                            <p className="text-sm font-medium text-foreground">
                                                Drag and drop your CV here, or click to browse
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                PDF, DOC, DOCX up to 5MB
                                            </p>
                                        </div>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        className="hidden"
                                        onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
                                    />
                                </div>

                                {cvError ? <p className="text-sm text-destructive">{cvError}</p> : null}
                                <InputError message={errors.cv} />

                                <div className="mt-2 flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={goBack}
                                        className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
                                    >
                                        <ArrowLeft className="mr-1 h-4 w-4" />
                                        Back
                                    </button>
                                    <Button type="submit" className="flex-1" disabled={processing}>
                                        {processing ? <Spinner className="mr-2" /> : null}
                                        {setupMode ? 'Add Candidate Portal' : 'Create Candidate Portal'}
                                    </Button>
                                </div>
                            </>
                        ) : null}

                        {portal === 'employer' && step === 2 ? (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="company_name" className="text-foreground">
                                        Company Name
                                    </Label>
                                    <Input
                                        id="company_name"
                                        type="text"
                                        value={data.company_name}
                                        onChange={(event) => setData('company_name', event.target.value)}
                                        autoFocus
                                        required
                                    />
                                    <InputError message={errors.company_name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-foreground">Industry</Label>
                                    <Select value={data.industry || undefined} onValueChange={(value) => setData('industry', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an industry" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {industryOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.industry} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="registration_number" className="text-foreground">
                                        Registration Number
                                    </Label>
                                    <Input
                                        id="registration_number"
                                        type="text"
                                        value={data.registration_number}
                                        onChange={(event) => setData('registration_number', event.target.value)}
                                    />
                                    <InputError message={errors.registration_number} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="company_email" className="text-foreground">
                                        Company Email
                                    </Label>
                                    <Input
                                        id="company_email"
                                        type="email"
                                        value={data.company_email}
                                        onChange={(event) => setData('company_email', event.target.value)}
                                        placeholder="hiring@company.com"
                                    />
                                    <InputError message={errors.company_email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="company_phone" className="text-foreground">
                                        Company Phone
                                    </Label>
                                    <Input
                                        id="company_phone"
                                        type="tel"
                                        value={data.company_phone}
                                        onChange={(event) => setData('company_phone', event.target.value)}
                                    />
                                    <InputError message={errors.company_phone} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="website" className="text-foreground">
                                        Website
                                    </Label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="website"
                                            type="url"
                                            value={data.website}
                                            onChange={(event) => setData('website', event.target.value)}
                                            className="pl-10"
                                            placeholder="https://company.com"
                                        />
                                    </div>
                                    <InputError message={errors.website} />
                                </div>

                                <div className="mt-2 flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={goBack}
                                        className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
                                    >
                                        <ArrowLeft className="mr-1 h-4 w-4" />
                                        Back
                                    </button>
                                    <Button type="submit" className="flex-1" disabled={processing}>
                                        {processing ? <Spinner className="mr-2" /> : null}
                                        {setupMode ? 'Add Employer Portal' : 'Create Employer Portal'}
                                    </Button>
                                </div>
                            </>
                        ) : null}
                    </form>
                ) : null}
            </div>

            {!setupMode ? (
                <p className="mt-6 text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href={loginHref} className="font-semibold text-foreground hover:underline">
                        Sign in
                    </Link>
                </p>
            ) : null}
        </div>
    );
}
