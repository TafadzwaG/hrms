import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Briefcase,
    Building2,
    CheckCircle2,
    Hash,
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

type EmployeeFormOptions = {
    genders: string[];
    marital_statuses: string[];
    educational_levels: string[];
};

type EmployeeRecord = Record<string, unknown> & {
    id: number;
    staff_number?: string | null;
    first_name?: string | null;
    middle_name?: string | null;
    surname?: string | null;
    date_of_birth?: string | null;
    email?: string | null;
    national_id?: string | null;
    gender?: string | null;
    occupation?: string | null;
    contact_number?: string | null;
    alt_phone_number?: string | null;
    address?: string | null;
    pay_point?: string | null;
    marital_status?: string | null;
    nationality?: string | null;
    educational_level?: string | null;
    department_id?: number | null;
    position_id?: number | null;
    user?: { email?: string | null } | null;
};

type EmployeeEditPageProps = {
    employee: EmployeeRecord;
    departments: Array<{ id: number; name: string }>;
    positions: Array<{ id: number; name: string }>;
    options: EmployeeFormOptions;
};

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
        description: 'Review & Save',
        icon: Building2,
    },
];

/* ─── helpers ─────────────────────────────────────────────────── */
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

/* ─── main component ─────────────────────────────────────────── */
export default function EmployeeEdit() {
    const { employee, departments, positions, options } =
        usePage<EmployeeEditPageProps>().props;

    const PATHS = {
        index: `${API}/employees`,
        show: `${API}/employees/${employee.id}`,
        update: `${API}/employees/${employee.id}`,
    };

    const { data, setData, errors, put, processing } = useForm({
        staff_number: employee.staff_number ?? '',
        first_name: employee.first_name ?? '',
        middle_name: employee.middle_name ?? '',
        surname: employee.surname ?? '',
        date_of_birth: employee.date_of_birth ?? '',
        email: employee.email ?? employee.user?.email ?? '',
        national_id: employee.national_id ?? '',
        gender: employee.gender ?? '',
        occupation: employee.occupation ?? '',
        contact_number: employee.contact_number ?? '',
        alt_phone_number: employee.alt_phone_number ?? '',
        address: employee.address ?? '',
        pay_point: employee.pay_point ?? '',
        marital_status: employee.marital_status ?? '',
        nationality: employee.nationality ?? '',
        educational_level: employee.educational_level ?? '',
        department_id: employee.department_id
            ? String(employee.department_id)
            : '',
        position_id: employee.position_id ? String(employee.position_id) : '',
    });

    const [step, setStep] = useState(1);

    const payPointOptions = [
        'Head Office',
        'Staffing Solutions',
        'ProCanteen',
        'Providence Health',
        'Consultancy',
    ];

    const next = () => {
        if (step < 4) setStep(step + 1);
    };
    const prev = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(PATHS.update, { preserveScroll: true });
    };

    const progressPercent = (step / 4) * 100;

    const stepTitles = [
        'Review and update personal identity information.',
        'Update employment role, department, and pay point.',
        'Update contact and address details.',
        'Review all changes before saving.',
    ];

    const fullName = [employee.first_name, employee.surname]
        .filter(Boolean)
        .join(' ');

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Employees', href: PATHS.index },
                { title: fullName, href: PATHS.show },
                { title: 'Edit', href: `${API}/employees/${employee.id}/edit` },
            ]}
        >
            <Head title={`Edit ${fullName}`} />

            <div className="mx-2 my-6 space-y-6 sm:mx-4 md:mx-8">
                {/* ── Page header ── */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Edit Profile
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Step {step} of 4: {STEPS[step - 1].description} —{' '}
                            <span className="font-semibold text-primary">
                                {fullName}
                            </span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                        <Button
                            variant="outline"
                            onClick={() => router.visit(PATHS.show)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="default"
                            onClick={() => {
                                if (step < 4) {
                                    setStep(4);
                                } else {
                                    handleSubmit(new Event('submit') as any);
                                }
                            }}
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>

                {/* ── Step indicator ── */}
                <div className="flex items-center gap-0">
                    {STEPS.map((s, idx) => {
                        const isCompleted = step > s.id;
                        const isCurrent = step === s.id;
                        const Icon = s.icon;
                        return (
                            <div
                                key={s.id}
                                className="flex flex-1 items-center last:flex-none"
                            >
                                <button
                                    type="button"
                                    onClick={() => setStep(s.id)}
                                    className="group flex items-center gap-3"
                                >
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
                                        Edit Information
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
                                                <FieldLabel>
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
                                            <div>
                                                <FieldLabel required>
                                                    National ID
                                                </FieldLabel>
                                                <Input
                                                    placeholder="e.g. 12-345678-X-90"
                                                    value={data.national_id}
                                                    onChange={(e) =>
                                                        setData(
                                                            'national_id',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <FieldError
                                                    message={
                                                        errors.national_id
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <FieldLabel required>
                                                    Gender
                                                </FieldLabel>
                                                <Select
                                                    value={data.gender}
                                                    onValueChange={(value) =>
                                                        setData(
                                                            'gender',
                                                            value,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select gender" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {options.genders.map(
                                                            (option) => (
                                                                <SelectItem
                                                                    key={
                                                                        option
                                                                    }
                                                                    value={
                                                                        option
                                                                    }
                                                                >
                                                                    {option}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FieldError
                                                    message={errors.gender}
                                                />
                                            </div>
                                            <div>
                                                <FieldLabel required>
                                                    Marital Status
                                                </FieldLabel>
                                                <Select
                                                    value={data.marital_status}
                                                    onValueChange={(value) =>
                                                        setData(
                                                            'marital_status',
                                                            value,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select marital status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {options.marital_statuses.map(
                                                            (option) => (
                                                                <SelectItem
                                                                    key={
                                                                        option
                                                                    }
                                                                    value={
                                                                        option
                                                                    }
                                                                >
                                                                    {option}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FieldError
                                                    message={
                                                        errors.marital_status
                                                    }
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <FieldLabel>
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
                                                    Changing the email will
                                                    update the employee's login
                                                    credentials.
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
                                                    Occupation
                                                </FieldLabel>
                                                <Input
                                                    placeholder="e.g. Systems Analyst"
                                                    value={data.occupation}
                                                    onChange={(e) =>
                                                        setData(
                                                            'occupation',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <FieldError
                                                    message={
                                                        errors.occupation
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <FieldLabel>
                                                    Educational Level
                                                </FieldLabel>
                                                <Select
                                                    value={
                                                        data.educational_level
                                                    }
                                                    onValueChange={(value) =>
                                                        setData(
                                                            'educational_level',
                                                            value,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select educational level" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {options.educational_levels.map(
                                                            (option) => (
                                                                <SelectItem
                                                                    key={
                                                                        option
                                                                    }
                                                                    value={
                                                                        option
                                                                    }
                                                                >
                                                                    {option}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FieldError
                                                    message={
                                                        errors.educational_level
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
                                            <div>
                                                <FieldLabel>
                                                    Alternate Phone Number
                                                </FieldLabel>
                                                <Input
                                                    placeholder="+263 (0) 77 000 0001"
                                                    value={
                                                        data.alt_phone_number
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            'alt_phone_number',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <FieldError
                                                    message={
                                                        errors.alt_phone_number
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <FieldLabel>
                                                    Nationality
                                                </FieldLabel>
                                                <Input
                                                    placeholder="e.g. Zimbabwean"
                                                    value={data.nationality}
                                                    onChange={(e) =>
                                                        setData(
                                                            'nationality',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <FieldError
                                                    message={
                                                        errors.nationality
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

                                    {/* ── Step 4: Review & Save ── */}
                                    {step === 4 && (
                                        <div className="space-y-8">
                                            <p className="text-sm text-muted-foreground">
                                                Review the updated information
                                                below. Use{' '}
                                                <strong>Previous</strong> to go
                                                back and make changes, or click{' '}
                                                <strong>Save Changes</strong> to
                                                apply.
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
                                                        value:
                                                            data.email || '—',
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
                                                    {
                                                        label: 'National ID',
                                                        value:
                                                            data.national_id ||
                                                            '-',
                                                    },
                                                    {
                                                        label: 'Gender',
                                                        value:
                                                            data.gender || '-',
                                                    },
                                                    {
                                                        label: 'Marital Status',
                                                        value:
                                                            data.marital_status ||
                                                            '-',
                                                    },
                                                    {
                                                        label: 'Occupation',
                                                        value:
                                                            data.occupation ||
                                                            '-',
                                                    },
                                                    {
                                                        label: 'Educational Level',
                                                        value:
                                                            data.educational_level ||
                                                            '-',
                                                    },
                                                    {
                                                        label: 'Alternate Phone',
                                                        value:
                                                            data.alt_phone_number ||
                                                            '-',
                                                    },
                                                    {
                                                        label: 'Nationality',
                                                        value:
                                                            data.nationality ||
                                                            '-',
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
                                                <strong>Note:</strong> Changing
                                                the email address will update
                                                the employee's system login
                                                credentials.
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>

                        {/* Right: per-step instructions */}
                        <div className="hidden xl:block">
                            <div className="sticky top-6 space-y-4">
                                {/* Step header */}
                                <Card className="p-5">
                                    <p className="mb-1 text-xs font-bold tracking-widest text-primary uppercase">
                                        Step {step} of 4
                                    </p>
                                    <h3 className="mb-2 text-base font-bold">
                                        {STEPS[step - 1].description}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        {step === 1 &&
                                            "Update the employee's identity information. National ID, gender, and marital status stay aligned with the employee master record."}
                                        {step === 2 &&
                                            "Modify the employee's role in the organisation. Staff number, occupation, education, and reporting structures affect payroll and approvals."}
                                        {step === 3 &&
                                            "Update the employee's contact details used for HR communication, emergency notifications, and profile records."}
                                        {step === 4 &&
                                            'Review all changes carefully before saving. You can click any step to go back and revise.'}
                                    </p>
                                </Card>

                                {/* Fields list */}
                                <Card className="p-5">
                                    <p className="mb-3 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                        {step < 4
                                            ? 'Fields in this step'
                                            : 'What will be updated'}
                                    </p>
                                    <ul className="space-y-2.5">
                                        {step === 1 && (
                                            <>
                                                <InstructionItem required>
                                                    First Name
                                                </InstructionItem>
                                                <InstructionItem>
                                                    Middle Name
                                                </InstructionItem>
                                                <InstructionItem required>
                                                    Surname
                                                </InstructionItem>
                                                <InstructionItem required>
                                                    National ID
                                                </InstructionItem>
                                                <InstructionItem required>
                                                    Gender
                                                </InstructionItem>
                                                <InstructionItem required>
                                                    Marital Status
                                                </InstructionItem>
                                                <InstructionItem>
                                                    Date of Birth
                                                </InstructionItem>
                                                <InstructionItem>
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
                                                    Occupation
                                                </InstructionItem>
                                                <InstructionItem>
                                                    Educational Level
                                                </InstructionItem>
                                                <InstructionItem>
                                                    Pay Point
                                                </InstructionItem>
                                                <InstructionItem>
                                                    Department
                                                </InstructionItem>
                                                <InstructionItem>
                                                    Position
                                                </InstructionItem>
                                            </>
                                        )}
                                        {step === 3 && (
                                            <>
                                                <InstructionItem>
                                                    Contact Number
                                                </InstructionItem>
                                                <InstructionItem>
                                                    Alternate Phone
                                                </InstructionItem>
                                                <InstructionItem>
                                                    Nationality
                                                </InstructionItem>
                                                <InstructionItem>
                                                    Home Address
                                                </InstructionItem>
                                            </>
                                        )}
                                        {step === 4 && (
                                            <>
                                                <InstructionItem icon="✓">
                                                    Personal identity details
                                                </InstructionItem>
                                                <InstructionItem icon="✓">
                                                    Employment role & department
                                                </InstructionItem>
                                                <InstructionItem icon="✓">
                                                    Contact information
                                                </InstructionItem>
                                                <InstructionItem icon="✓">
                                                    Login credentials (if email
                                                    changed)
                                                </InstructionItem>
                                            </>
                                        )}
                                    </ul>
                                </Card>

                                {/* Tip box */}
                                <Card className="bg-muted p-5">
                                    <p className="mb-2 text-xs font-bold tracking-widest text-foreground uppercase">
                                        💡 Tip
                                    </p>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        {step === 1 &&
                                            "Employee email stays synchronized with the linked user account, so changes here also affect login access when an account exists."}
                                        {step === 2 &&
                                            'Department, position, occupation, and education changes affect how this employee appears in workforce reporting and approvals.'}
                                        {step === 3 &&
                                            'Contact details are used for leave notifications, emergency contact lookups, and employee profile verification.'}
                                        {step === 4 &&
                                            'You can save partial updates anytime using the Save Changes button in the top-right corner.'}
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
                                            Saving…
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="h-4 w-4" />{' '}
                                            Save Changes
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
                            <p className="text-sm font-bold">Edit Progress</p>
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
