import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Briefcase,
    Building2,
    CheckCircle2,
    Hash,
    Mail,
    MapPin,
    Phone,
    User,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

/* ─── types ──────────────────────────────────────────────────── */
interface Step {
    id: number;
    label: string;
    title: string;
    description: string;
    icon: React.FC<{ className?: string }>;
}

const STEPS: Step[] = [
    {
        id: 1,
        label: 'STEP 1',
        title: 'Identity',
        description: 'Personal Identity',
        icon: User,
    },
    {
        id: 2,
        label: 'STEP 2',
        title: 'Employment',
        description: 'Employment Details',
        icon: Briefcase,
    },
    {
        id: 3,
        label: 'STEP 3',
        title: 'Contact',
        description: 'Contact Info',
        icon: Phone,
    },
    {
        id: 4,
        label: 'STEP 4',
        title: 'Organization',
        description: 'Organization',
        icon: Building2,
    },
];

/* ─── helpers ────────────────────────────────────────────────── */
function FieldLabel({
    children,
    required,
}: {
    children: React.ReactNode;
    required?: boolean;
}) {
    return (
        <label className="mb-2 block text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {children}
            {required && <span className="ml-1 text-destructive">*</span>}
        </label>
    );
}

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return (
        <p className="mt-1.5 text-sm font-medium text-destructive">{message}</p>
    );
}

function FieldHint({ children }: { children: React.ReactNode }) {
    return (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
            ℹ {children}
        </p>
    );
}

/* ─── main component ─────────────────────────────────────────── */
export default function EmployeeCreate() {
    const { departments, positions } = usePage().props as any;

    const PATHS = {
        index: `${API}/employees`,
        store: `${API}/employees`,
    };

    const { data, setData, errors, post, processing } = useForm({
        staff_number: '',
        first_name: '',
        middle_name: '',
        surname: '',
        date_of_birth: '',
        email: '',
        contact_number: '',
        address: '',
        pay_point: '',
        department_id: '',
        position_id: '',
    });

    const [step, setStep] = useState(1);

    const payPointOptions = [
        'Head Office',
        'Staffing Solutions',
        'ProCanteen',
        'Providence Health',
        'Consultancy',
    ];

    /* validation per step — returns true when step is valid */
    const validateStep = (s: number): boolean => {
        switch (s) {
            case 1:
                return (
                    !!data.first_name &&
                    !!data.surname &&
                    !!data.date_of_birth &&
                    !!data.email
                );
            case 2:
                return !!data.staff_number;
            case 3:
            case 4:
                return true; // optional fields
            default:
                return true;
        }
    };

    const next = () => {
        if (step < 4) setStep(step + 1);
    };
    const prev = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(PATHS.store, { preserveScroll: true });
    };

    const progressPercent = (step / 4) * 100;

    const stepTitles = [
        'Completing Personal Identity will unlock Employment Details.',
        'Completing Employment Details will unlock Contact Info.',
        'Completing Contact Info will unlock Organization.',
        'Review and submit your information.',
    ];

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Employees', href: PATHS.index },
                { title: 'Add New', href: `${API}/employees/create` },
            ]}
        >
            <Head title="Add New Employee" />

            <div className="mx-2 my-6 space-y-6 sm:mx-4 md:mx-8">
                {/* ── Page header ── */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Add New Employee
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Step {step} of 4: {STEPS[step - 1].description}
                        </p>
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                        <Button
                            variant="outline"
                            onClick={() => router.visit(PATHS.index)}
                        >
                            Cancel
                        </Button>
                        <Button variant="default" onClick={() => setStep(4)}>
                            Save Draft
                        </Button>
                    </div>
                </div>

                {/* ── Step indicator ── */}
                <div className="flex items-center gap-0">
                    {STEPS.map((s, idx) => {
                        const isCompleted = step > s.id;
                        const isCurrent = step === s.id;
                        return (
                            <div
                                key={s.id}
                                className="flex flex-1 items-center last:flex-none"
                            >
                                <button
                                    onClick={() => setStep(s.id)}
                                    className="group flex items-center gap-3"
                                >
                                    {/* circle */}
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all ${
                                            isCompleted
                                                ? 'bg-primary text-primary-foreground'
                                                : isCurrent
                                                  ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                                                  : 'border-2 border-border bg-background text-muted-foreground'
                                        }`}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle2 className="h-5 w-5" />
                                        ) : (
                                            `0${s.id}`
                                        )}
                                    </div>
                                    {/* labels */}
                                    <div className="hidden text-left sm:block">
                                        <p
                                            className={`text-xs font-bold tracking-widest uppercase ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}
                                        >
                                            {s.label}
                                        </p>
                                        <p
                                            className={`text-sm font-bold ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}
                                        >
                                            {s.title}
                                        </p>
                                    </div>
                                </button>
                                {/* connector line */}
                                {idx < STEPS.length - 1 && (
                                    <div className="relative mx-4 h-px flex-1 bg-border">
                                        <div
                                            className="absolute inset-y-0 left-0 bg-primary transition-all duration-500"
                                            style={{
                                                width:
                                                    step > s.id ? '100%' : '0%',
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* ── Step content + instructions ── */}
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
                        {/* Left: form card */}
                        <div>
                            <Card className="overflow-hidden">
                                {/* Card header */}
                                <div className="flex items-center justify-between border-b px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                                            {(() => {
                                                const Icon =
                                                    STEPS[step - 1].icon;
                                                return (
                                                    <Icon className="h-4 w-4 text-secondary-foreground" />
                                                );
                                            })()}
                                        </div>
                                        <h2 className="text-base font-bold">
                                            {STEPS[step - 1].description}
                                        </h2>
                                    </div>
                                    <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                        General Information
                                    </span>
                                </div>

                                {/* Card body */}
                                <div className="px-8 py-7">
                                    {/* ── Step 1: Identity ── */}
                                    {step === 1 && (
                                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                                            <div>
                                                <FieldLabel required>
                                                    First Name
                                                </FieldLabel>
                                                <Input
                                                    placeholder="John"
                                                    value={data.first_name}
                                                    onChange={(e) =>
                                                        setData(
                                                            'first_name',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <FieldError
                                                    message={errors.first_name}
                                                />
                                            </div>
                                            <div>
                                                <FieldLabel>
                                                    Middle Name
                                                </FieldLabel>
                                                <Input
                                                    placeholder="e.g. Quincey"
                                                    value={data.middle_name}
                                                    onChange={(e) =>
                                                        setData(
                                                            'middle_name',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <FieldLabel required>
                                                    Surname
                                                </FieldLabel>
                                                <Input
                                                    placeholder="e.g. Doe"
                                                    value={data.surname}
                                                    onChange={(e) =>
                                                        setData(
                                                            'surname',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <FieldError
                                                    message={errors.surname}
                                                />
                                            </div>
                                            <div>
                                                <FieldLabel required>
                                                    Date of Birth
                                                </FieldLabel>
                                                <Input
                                                    type="date"
                                                    value={data.date_of_birth}
                                                    onChange={(e) =>
                                                        setData(
                                                            'date_of_birth',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <FieldError
                                                    message={
                                                        errors.date_of_birth
                                                    }
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <FieldLabel required>
                                                    Email Address
                                                </FieldLabel>
                                                <Input
                                                    type="email"
                                                    placeholder="john.doe@company.com"
                                                    value={data.email}
                                                    onChange={(e) =>
                                                        setData(
                                                            'email',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <FieldHint>
                                                    This will be used for system
                                                    login and primary
                                                    notifications.
                                                </FieldHint>
                                                <FieldError
                                                    message={errors.email}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* ── Step 2: Employment ── */}
                                    {step === 2 && (
                                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                                            <div>
                                                <FieldLabel required>
                                                    Staff Number
                                                </FieldLabel>
                                                <Input
                                                    placeholder="e.g. EMP-001"
                                                    value={data.staff_number}
                                                    onChange={(e) =>
                                                        setData(
                                                            'staff_number',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <FieldHint>
                                                    Unique employee identifier
                                                    used across the system.
                                                </FieldHint>
                                                <FieldError
                                                    message={
                                                        errors.staff_number
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <FieldLabel>
                                                    Pay Point
                                                </FieldLabel>
                                                <Select
                                                    value={data.pay_point}
                                                    onValueChange={(v) =>
                                                        setData('pay_point', v)
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select pay point" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {payPointOptions.map(
                                                            (o) => (
                                                                <SelectItem
                                                                    key={o}
                                                                    value={o}
                                                                >
                                                                    {o}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FieldError
                                                    message={errors.pay_point}
                                                />
                                            </div>
                                            <div>
                                                <FieldLabel>
                                                    Department
                                                </FieldLabel>
                                                <Select
                                                    value={data.department_id}
                                                    onValueChange={(v) =>
                                                        setData(
                                                            'department_id',
                                                            v,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select department" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {departments.map(
                                                            (d: any) => (
                                                                <SelectItem
                                                                    key={d.id}
                                                                    value={String(
                                                                        d.id,
                                                                    )}
                                                                >
                                                                    {d.name}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FieldError
                                                    message={
                                                        errors.department_id
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <FieldLabel>
                                                    Position
                                                </FieldLabel>
                                                <Select
                                                    value={data.position_id}
                                                    onValueChange={(v) =>
                                                        setData(
                                                            'position_id',
                                                            v,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select position" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {positions.map(
                                                            (p: any) => (
                                                                <SelectItem
                                                                    key={p.id}
                                                                    value={String(
                                                                        p.id,
                                                                    )}
                                                                >
                                                                    {p.name}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FieldError
                                                    message={errors.position_id}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* ── Step 3: Contact ── */}
                                    {step === 3 && (
                                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                                            <div>
                                                <FieldLabel>
                                                    Contact Number
                                                </FieldLabel>
                                                <Input
                                                    placeholder="+1 (555) 000-0000"
                                                    value={data.contact_number}
                                                    onChange={(e) =>
                                                        setData(
                                                            'contact_number',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <FieldError
                                                    message={
                                                        errors.contact_number
                                                    }
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <FieldLabel>
                                                    Home Address
                                                </FieldLabel>
                                                <Input
                                                    placeholder="123 Main Street, City, Country"
                                                    value={data.address}
                                                    onChange={(e) =>
                                                        setData(
                                                            'address',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <FieldError
                                                    message={errors.address}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* ── Step 4: Organization / Review ── */}
                                    {step === 4 && (
                                        <div className="space-y-8">
                                            <p className="text-sm text-muted-foreground">
                                                Please review your information
                                                before submitting. You can go
                                                back to any step to make
                                                changes.
                                            </p>

                                            <div className="grid gap-6 sm:grid-cols-2">
                                                {[
                                                    {
                                                        label: 'First Name',
                                                        value: data.first_name,
                                                    },
                                                    {
                                                        label: 'Middle Name',
                                                        value:
                                                            data.middle_name ||
                                                            '—',
                                                    },
                                                    {
                                                        label: 'Surname',
                                                        value: data.surname,
                                                    },
                                                    {
                                                        label: 'Date of Birth',
                                                        value:
                                                            data.date_of_birth ||
                                                            '—',
                                                    },
                                                    {
                                                        label: 'Email',
                                                        value: data.email,
                                                    },
                                                    {
                                                        label: 'Staff Number',
                                                        value:
                                                            data.staff_number ||
                                                            '—',
                                                    },
                                                    {
                                                        label: 'Pay Point',
                                                        value:
                                                            data.pay_point ||
                                                            '—',
                                                    },
                                                    {
                                                        label: 'Contact Number',
                                                        value:
                                                            data.contact_number ||
                                                            '—',
                                                    },
                                                    {
                                                        label: 'Address',
                                                        value:
                                                            data.address || '—',
                                                    },
                                                ].map(({ label, value }) => (
                                                    <div key={label}>
                                                        <p className="mb-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                                            {label}
                                                        </p>
                                                        <p className="text-sm font-semibold">
                                                            {value}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="rounded-md border border-border bg-muted px-5 py-4 text-sm text-muted-foreground">
                                                <strong>Note:</strong> If an
                                                email is provided, a user
                                                account will be created
                                                automatically with default
                                                password{' '}
                                                <strong>PHC@2025!</strong>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>

                        {/* Right: per-step instructions */}
                        <div className="hidden xl:block">
                            <div className="sticky top-6 space-y-4">
                                <Card className="p-5">
                                    <p className="mb-1 text-xs font-bold tracking-widest text-primary uppercase">
                                        Step {step} of 4
                                    </p>
                                    <h3 className="mb-2 text-base font-bold">
                                        {STEPS[step - 1].description}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        {step === 1 &&
                                            "Start by entering the employee's basic personal information. All fields marked with an asterisk are required to proceed."}
                                        {step === 2 &&
                                            'Assign this employee to their role in your organisation. The staff number is used across payroll, leave, and reporting modules.'}
                                        {step === 3 &&
                                            "Add the employee's personal contact information. These details are used for HR communication and emergency notifications."}
                                        {step === 4 &&
                                            "Review all the information you've entered before creating the record. Use Previous to go back and make changes."}
                                    </p>
                                </Card>

                                <Card className="p-5">
                                    <p className="mb-3 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                        {step < 4
                                            ? 'Required Fields'
                                            : 'What Happens Next'}
                                    </p>
                                    <ul className="space-y-2.5">
                                        {step === 1 && (
                                            <>
                                                <InstructionItem required>
                                                    First Name
                                                </InstructionItem>
                                                <InstructionItem>
                                                    Middle Name (optional)
                                                </InstructionItem>
                                                <InstructionItem required>
                                                    Surname
                                                </InstructionItem>
                                                <InstructionItem required>
                                                    Date of Birth
                                                </InstructionItem>
                                                <InstructionItem required>
                                                    Email Address
                                                </InstructionItem>
                                            </>
                                        )}
                                        {step === 2 && (
                                            <>
                                                <InstructionItem required>
                                                    Staff Number
                                                </InstructionItem>
                                                <InstructionItem>
                                                    Pay Point (optional)
                                                </InstructionItem>
                                                <InstructionItem>
                                                    Department (optional)
                                                </InstructionItem>
                                                <InstructionItem>
                                                    Position (optional)
                                                </InstructionItem>
                                            </>
                                        )}
                                        {step === 3 && (
                                            <>
                                                <InstructionItem>
                                                    Contact Number (optional)
                                                </InstructionItem>
                                                <InstructionItem>
                                                    Home Address (optional)
                                                </InstructionItem>
                                            </>
                                        )}
                                        {step === 4 && (
                                            <>
                                                <InstructionItem icon="✓">
                                                    Employee record is created
                                                </InstructionItem>
                                                <InstructionItem icon="✓">
                                                    User account is created if
                                                    email provided
                                                </InstructionItem>
                                                <InstructionItem icon="✓">
                                                    Default password: PHC@2025!
                                                </InstructionItem>
                                                <InstructionItem icon="✓">
                                                    Employee profile page opens
                                                </InstructionItem>
                                            </>
                                        )}
                                    </ul>
                                </Card>

                                <Card className="bg-muted p-5">
                                    <p className="mb-2 text-xs font-bold tracking-widest text-foreground uppercase">
                                        💡 Tip
                                    </p>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        {step === 1 &&
                                            "The email address will also serve as the employee's login username. Make sure it's accurate and accessible."}
                                        {step === 2 &&
                                            "You can always update the department and position later from the employee's profile. A staff number must be unique."}
                                        {step === 3 &&
                                            'Contact information is optional now but recommended for payroll and emergency use. You can add it later from the profile.'}
                                        {step === 4 &&
                                            "Once submitted, the employee's profile will be immediately available. You can continue editing from the profile page."}
                                    </p>
                                </Card>
                            </div>
                        </div>
                    </div>

                    {/* ── Navigation row ── */}
                    <div className="mt-6 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground italic">
                            Fields marked with{' '}
                            <span className="text-destructive not-italic">
                                *
                            </span>{' '}
                            are mandatory
                        </p>
                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={prev}
                                disabled={step === 1}
                            >
                                Previous
                            </Button>
                            {step < 4 ? (
                                <Button
                                    type="button"
                                    onClick={next}
                                    className="flex items-center gap-2"
                                >
                                    Next Step <ArrowRight className="h-4 w-4" />
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                                            Creating…
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="h-4 w-4" />{' '}
                                            Create Employee
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* ── Progress card ── */}
                    <Card className="mt-5 flex items-center gap-5 px-6 py-5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-secondary">
                            <Hash className="h-5 w-5 text-secondary-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold">
                                Registration Progress
                            </p>
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                {stepTitles[step - 1]}
                            </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-4">
                            <div className="h-2 w-40 overflow-hidden rounded-full bg-secondary">
                                <div
                                    className="h-full rounded-full bg-primary transition-all duration-500"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                            <span className="w-10 text-right text-sm font-bold text-foreground">
                                {progressPercent}%
                            </span>
                        </div>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}

/* ── small helper component ── */
function InstructionItem({
    children,
    required,
    icon,
}: {
    children: React.ReactNode;
    required?: boolean;
    icon?: string;
}) {
    return (
        <li className="flex items-start gap-2 text-sm text-muted-foreground">
            <span
                className={`mt-0.5 shrink-0 text-xs font-bold ${required ? 'text-destructive' : icon ? 'text-primary' : 'text-muted-foreground/50'}`}
            >
                {icon ?? (required ? '●' : '○')}
            </span>
            <span>
                {children}
                {required && <span className="ml-1 text-destructive">*</span>}
            </span>
        </li>
    );
}
