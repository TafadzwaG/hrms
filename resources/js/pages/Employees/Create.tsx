import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Briefcase,
    Building2,
    Calendar,
    CheckCircle2,
    Globe2,
    GraduationCap,
    Hash,
    Heart,
    Lightbulb,
    Mail,
    MapPin,
    Phone,
    Save,
    ShieldCheck,
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

/* â”€â”€â”€ types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

type EmployeeCreatePageProps = {
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
        description: 'Organization',
        icon: Building2,
    },
];

/* â”€â”€â”€ helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function FieldLabel({
    children,
    required,
    icon,
}: {
    children: React.ReactNode;
    required?: boolean;
    icon?: React.ReactNode;
}) {
    return (
        <label className="mb-2 flex items-center gap-2 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {icon && (
                <span className="flex h-4 w-4 items-center justify-center text-muted-foreground">
                    {icon}
                </span>
            )}
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
            â„¹ {children}
        </p>
    );
}

/* â”€â”€â”€ main component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export default function EmployeeCreate() {
    const { departments, positions, options } =
        usePage<EmployeeCreatePageProps>().props;

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
        national_id: '',
        gender: '',
        occupation: '',
        contact_number: '',
        alt_phone_number: '',
        address: '',
        pay_point: '',
        marital_status: '',
        nationality: '',
        educational_level: '',
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

    /* validation per step â€” returns true when step is valid */
    const validateStep = (s: number): boolean => {
        switch (s) {
            case 1:
                return (
                    !!data.first_name &&
                    !!data.surname &&
                    !!data.national_id &&
                    !!data.gender &&
                    !!data.marital_status
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

    const submitCreate = () => {
        post(PATHS.store, { preserveScroll: true });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    const progressPercent = (step / 4) * 100;
    const ActiveStepIcon = STEPS[step - 1].icon;

    const stepTitles = [
        'Completing Personal Identity will unlock Employment Details.',
        'Completing Employment Details will unlock Contact Info.',
        'Completing Contact Info will unlock Organization.',
        'Review and submit your information.',
    ];
    const selectedDepartmentName =
        departments.find(
            (department) => String(department.id) === data.department_id,
        )?.name ?? 'â€”';
    const selectedPositionName =
        positions.find((position) => String(position.id) === data.position_id)
            ?.name ?? 'â€”';

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Employees', href: PATHS.index },
                { title: 'Add New', href: `${API}/employees/create` },
            ]}
        >
            <Head title="Add New Employee" />

            <div className="mx-2 my-6 space-y-6 sm:mx-4 md:mx-8">
                {/* â”€â”€ Page header â”€â”€ */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
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
                        <Button
                            type="button"
                            variant="default"
                            disabled={processing}
                            onClick={() => {
                                if (step < 4) {
                                    setStep(4);
                                } else {
                                    submitCreate();
                                }
                            }}
                        >
                            Save Draft
                        </Button>
                    </div>
                </div>

                {/* â”€â”€ Step indicator â”€â”€ */}
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

                {/* â”€â”€ Step content + instructions â”€â”€ */}
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
                                    {/* â”€â”€ Step 1: Identity â”€â”€ */}
                                    {step === 1 && (
                                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                                            <div>
                                                <FieldLabel
                                                    required
                                                    icon={
                                                        <User className="h-4 w-4" />
                                                    }
                                                >
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
                                                <FieldLabel
                                                    icon={
                                                        <User className="h-4 w-4" />
                                                    }
                                                >
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
                                                <FieldLabel
                                                    required
                                                    icon={
                                                        <User className="h-4 w-4" />
                                                    }
                                                >
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
                                                <FieldLabel
                                                    icon={
                                                        <Calendar className="h-4 w-4" />
                                                    }
                                                >
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
                                                <FieldLabel
                                                    required
                                                    icon={
                                                        <ShieldCheck className="h-4 w-4" />
                                                    }
                                                >
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
                                                <FieldLabel
                                                    required
                                                    icon={
                                                        <User className="h-4 w-4" />
                                                    }
                                                >
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
                                                <FieldLabel
                                                    required
                                                    icon={
                                                        <Heart className="h-4 w-4" />
                                                    }
                                                >
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
                                                <FieldLabel
                                                    icon={
                                                        <Mail className="h-4 w-4" />
                                                    }
                                                >
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

                                    {/* â”€â”€ Step 2: Employment â”€â”€ */}
                                    {step === 2 && (
                                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                                            <div>
                                                <FieldLabel
                                                    required
                                                    icon={
                                                        <Hash className="h-4 w-4" />
                                                    }
                                                >
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
                                                <FieldLabel
                                                    icon={
                                                        <Briefcase className="h-4 w-4" />
                                                    }
                                                >
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
                                                <FieldLabel
                                                    icon={
                                                        <GraduationCap className="h-4 w-4" />
                                                    }
                                                >
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
                                                <FieldLabel
                                                    icon={
                                                        <Building2 className="h-4 w-4" />
                                                    }
                                                >
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
                                                <FieldLabel
                                                    icon={
                                                        <Building2 className="h-4 w-4" />
                                                    }
                                                >
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
                                                <FieldLabel
                                                    icon={
                                                        <Briefcase className="h-4 w-4" />
                                                    }
                                                >
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

                                    {/* â”€â”€ Step 3: Contact â”€â”€ */}
                                    {step === 3 && (
                                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                                            <div>
                                                <FieldLabel
                                                    icon={
                                                        <Phone className="h-4 w-4" />
                                                    }
                                                >
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
                                                <FieldLabel
                                                    icon={
                                                        <Phone className="h-4 w-4" />
                                                    }
                                                >
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
                                                <FieldLabel
                                                    icon={
                                                        <Globe2 className="h-4 w-4" />
                                                    }
                                                >
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
                                                <FieldLabel
                                                    icon={
                                                        <MapPin className="h-4 w-4" />
                                                    }
                                                >
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

                                    {/* â”€â”€ Step 4: Organization / Review â”€â”€ */}
                                    {step === 4 && (
                                        <div className="space-y-8">
                                            <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-background text-foreground shadow-sm">
                                                    <Save className="h-4 w-4" />
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    Please review your information
                                                    before submitting. You can go
                                                    back to any step to make
                                                    changes.
                                                </p>
                                            </div>

                                            <div className="grid gap-6 sm:grid-cols-2">
                                                {[
                                                    {
                                                        label: 'First Name',
                                                        value: data.first_name,
                                                        icon: User,
                                                    },
                                                    {
                                                        label: 'Middle Name',
                                                        value:
                                                            data.middle_name ||
                                                            '—',
                                                        icon: User,
                                                    },
                                                    {
                                                        label: 'Surname',
                                                        value: data.surname,
                                                        icon: User,
                                                    },
                                                    {
                                                        label: 'Date of Birth',
                                                        value:
                                                            data.date_of_birth ||
                                                            '—',
                                                        icon: Calendar,
                                                    },
                                                    {
                                                        label: 'National ID',
                                                        value:
                                                            data.national_id ||
                                                            '—',
                                                        icon: ShieldCheck,
                                                    },
                                                    {
                                                        label: 'Gender',
                                                        value: data.gender || '—',
                                                        icon: User,
                                                    },
                                                    {
                                                        label: 'Marital Status',
                                                        value:
                                                            data.marital_status ||
                                                            '—',
                                                        icon: Heart,
                                                    },
                                                    {
                                                        label: 'Email',
                                                        value: data.email || '—',
                                                        icon: Mail,
                                                    },
                                                    {
                                                        label: 'Staff Number',
                                                        value:
                                                            data.staff_number ||
                                                            '—',
                                                        icon: Hash,
                                                    },
                                                    {
                                                        label: 'Pay Point',
                                                        value:
                                                            data.pay_point ||
                                                            '—',
                                                        icon: Building2,
                                                    },
                                                    {
                                                        label: 'Contact Number',
                                                        value:
                                                            data.contact_number ||
                                                            '—',
                                                        icon: Phone,
                                                    },
                                                    {
                                                        label: 'Address',
                                                        value: data.address || '—',
                                                        icon: MapPin,
                                                    },
                                                    {
                                                        label: 'Occupation',
                                                        value:
                                                            data.occupation ||
                                                            '-',
                                                        icon: Briefcase,
                                                    },
                                                    {
                                                        label: 'Educational Level',
                                                        value:
                                                            data.educational_level ||
                                                            '-',
                                                        icon: GraduationCap,
                                                    },
                                                    {
                                                        label: 'Department',
                                                        value:
                                                            selectedDepartmentName,
                                                        icon: Building2,
                                                    },
                                                    {
                                                        label: 'Position',
                                                        value:
                                                            selectedPositionName,
                                                        icon: Briefcase,
                                                    },
                                                    {
                                                        label: 'Alternate Phone',
                                                        value:
                                                            data.alt_phone_number ||
                                                            '-',
                                                        icon: Phone,
                                                    },
                                                    {
                                                        label: 'Nationality',
                                                        value:
                                                            data.nationality ||
                                                            '-',
                                                        icon: Globe2,
                                                    },
                                                ].map(({ label, value, icon: Icon }) => (
                                                    <div
                                                        key={label}
                                                        className="rounded-lg border bg-background/70 p-4 shadow-sm"
                                                    >
                                                        <div className="mb-2 flex items-center gap-2">
                                                            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                                                <Icon className="h-4 w-4" />
                                                            </span>
                                                            <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                                                {label}
                                                            </p>
                                                        </div>
                                                        <p className="text-sm font-semibold">
                                                            {value}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex items-start gap-3 rounded-md border border-border bg-muted px-5 py-4 text-sm text-muted-foreground">
                                                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                                                <div>
                                                    <strong>Note:</strong> If an
                                                    email is provided, a user
                                                    account will be created
                                                    automatically with default
                                                    password{' '}
                                                    <strong>PHC@2025!</strong>
                                                </div>
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
                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                                        <ActiveStepIcon className="h-5 w-5" />
                                    </div>
                                    <p className="mb-1 text-xs font-bold tracking-widest text-primary uppercase">
                                        Step {step} of 4
                                    </p>
                                    <h3 className="mb-2 text-base font-bold">
                                        {STEPS[step - 1].description}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        {step === 1 &&
                                            "Start by entering the employee's core identity information. National ID, gender, and marital status are required before moving to employment details."}
                                        {step === 2 &&
                                            'Assign this employee to their role in your organisation. Staff number, occupation, and education details feed payroll, reporting, and workforce records.'}
                                        {step === 3 &&
                                            "Add the employee's personal contact information. These details are used for HR communication, emergency notifications, and profile lookups."}
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
                                                <InstructionItem required icon={<User className="h-3.5 w-3.5" />}>
                                                    First Name
                                                </InstructionItem>
                                                <InstructionItem icon={<User className="h-3.5 w-3.5" />}>
                                                    Middle Name (optional)
                                                </InstructionItem>
                                                <InstructionItem required icon={<User className="h-3.5 w-3.5" />}>
                                                    Surname
                                                </InstructionItem>
                                                <InstructionItem required icon={<ShieldCheck className="h-3.5 w-3.5" />}>
                                                    National ID
                                                </InstructionItem>
                                                <InstructionItem required icon={<User className="h-3.5 w-3.5" />}>
                                                    Gender
                                                </InstructionItem>
                                                <InstructionItem required icon={<Heart className="h-3.5 w-3.5" />}>
                                                    Marital Status
                                                </InstructionItem>
                                                <InstructionItem icon={<Calendar className="h-3.5 w-3.5" />}>
                                                    Date of Birth (optional)
                                                </InstructionItem>
                                                <InstructionItem icon={<Mail className="h-3.5 w-3.5" />}>
                                                    Email Address (optional)
                                                </InstructionItem>
                                            </>
                                        )}
                                        {step === 2 && (
                                            <>
                                                <InstructionItem required icon={<Hash className="h-3.5 w-3.5" />}>
                                                    Staff Number
                                                </InstructionItem>
                                                <InstructionItem icon={<Briefcase className="h-3.5 w-3.5" />}>
                                                    Occupation (optional)
                                                </InstructionItem>
                                                <InstructionItem icon={<GraduationCap className="h-3.5 w-3.5" />}>
                                                    Educational Level
                                                    (optional)
                                                </InstructionItem>
                                                <InstructionItem icon={<Building2 className="h-3.5 w-3.5" />}>
                                                    Pay Point (optional)
                                                </InstructionItem>
                                                <InstructionItem icon={<Building2 className="h-3.5 w-3.5" />}>
                                                    Department (optional)
                                                </InstructionItem>
                                                <InstructionItem icon={<Briefcase className="h-3.5 w-3.5" />}>
                                                    Position (optional)
                                                </InstructionItem>
                                            </>
                                        )}
                                        {step === 3 && (
                                            <>
                                                <InstructionItem icon={<Phone className="h-3.5 w-3.5" />}>
                                                    Contact Number (optional)
                                                </InstructionItem>
                                                <InstructionItem icon={<Phone className="h-3.5 w-3.5" />}>
                                                    Alternate Phone (optional)
                                                </InstructionItem>
                                                <InstructionItem icon={<Globe2 className="h-3.5 w-3.5" />}>
                                                    Nationality (optional)
                                                </InstructionItem>
                                                <InstructionItem icon={<MapPin className="h-3.5 w-3.5" />}>
                                                    Home Address (optional)
                                                </InstructionItem>
                                            </>
                                        )}
                                        {step === 4 && (
                                            <>
                                                <InstructionItem icon={<CheckCircle2 className="h-3.5 w-3.5" />}>
                                                    Employee record is created
                                                </InstructionItem>
                                                <InstructionItem icon={<CheckCircle2 className="h-3.5 w-3.5" />}>
                                                    User account is created if
                                                    email provided
                                                </InstructionItem>
                                                <InstructionItem icon={<CheckCircle2 className="h-3.5 w-3.5" />}>
                                                    Default password: PHC@2025!
                                                </InstructionItem>
                                                <InstructionItem icon={<CheckCircle2 className="h-3.5 w-3.5" />}>
                                                    Employee profile page opens
                                                </InstructionItem>
                                            </>
                                        )}
                                    </ul>
                                </Card>

                                <Card className="bg-muted p-5">
                                    <div className="mb-2 flex items-center gap-2">
                                        <Lightbulb className="h-4 w-4 text-foreground" />
                                        <p className="text-xs font-bold tracking-widest text-foreground uppercase">
                                            Tip
                                        </p>
                                    </div>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        {step === 1 &&
                                            "National ID and marital status are stored on the employee profile, while email is optional unless you want to create or link a system account."}
                                        {step === 2 &&
                                            "You can always update department and position later from the employee's profile. Staff number and national ID must stay unique within the organization."}
                                        {step === 3 &&
                                            'Contact information is optional now but recommended for payroll, emergency use, and identity verification. You can refine it later from the profile.'}
                                        {step === 4 &&
                                            "Once submitted, the employee's profile will be immediately available. You can continue editing from the profile page."}
                                    </p>
                                </Card>
                            </div>
                        </div>
                    </div>

                    {/* â”€â”€ Navigation row â”€â”€ */}
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
                                    type="button"
                                    disabled={processing}
                                    className="flex items-center gap-2"
                                    onClick={submitCreate}
                                >
                                    {processing ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                                            Creatingâ€¦
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

                    {/* â”€â”€ Progress card â”€â”€ */}
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

/* â”€â”€ small helper component â”€â”€ */
function InstructionItem({
    children,
    required,
    icon,
}: {
    children: React.ReactNode;
    required?: boolean;
    icon?: React.ReactNode;
}) {
    return (
        <li className="flex items-start gap-2 text-sm text-muted-foreground">
            <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center ${required ? 'text-destructive' : icon ? 'text-foreground' : 'text-muted-foreground/50'}`}
            >
                {icon ?? (
                    <span className="text-[10px] font-bold">
                        {required ? '•' : '·'}
                    </span>
                )}
            </span>
            <span>
                {children}
                {required && <span className="ml-1 text-destructive">*</span>}
            </span>
        </li>
    );
}
