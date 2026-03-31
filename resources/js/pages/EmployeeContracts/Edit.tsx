import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Briefcase,
    CalendarDays,
    ClipboardList,
    DollarSign,
    FileText,
    Save,
    UserSquare2,
    X,
} from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

type EmployeeSummary = {
    id: number;
    staff_number: string;
    full_name: string;
};

type ContractOptions = {
    contract_types: string[];
    statuses: string[];
    pay_frequencies: string[];
    currencies: string[];
    departments: { id: number; name: string }[];
    positions: { id: number; name: string }[];
};

type ContractPayload = {
    id: number;
    contract_number: string;
    contract_type: string;
    status: string;
    start_date: string | null;
    end_date: string | null;
    probation_end_date: string | null;
    job_title: string | null;
    department: { id: number; name: string } | null;
    position: { id: number; name: string } | null;
    pay_point: string | null;
    basic_salary: string | null;
    currency: string | null;
    pay_frequency: string | null;
    working_hours_per_week: string | null;
    notice_period_days: number | null;
    leave_days_per_year: number | null;
    is_current: boolean;
    signed_at: string | null;
    termination_reason: string | null;
    renewal_notes: string | null;
};

const CONTRACT_TYPE_LABELS: Record<string, string> = {
    permanent: 'Permanent',
    fixed_term: 'Fixed Term',
    temporary: 'Temporary',
    internship: 'Internship',
    consultancy: 'Consultancy',
    probation: 'Probation',
};

const PAY_FREQUENCY_LABELS: Record<string, string> = {
    weekly: 'Weekly',
    bi_weekly: 'Bi-Weekly',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    annually: 'Annually',
};

function FieldLabel({
    children,
    required,
}: {
    children: ReactNode;
    required?: boolean;
}) {
    return (
        <label className="mb-2 block text-sm font-medium text-foreground">
            {children}
            {required && <span className="ml-1 text-destructive">*</span>}
        </label>
    );
}

function FieldError({ message }: { message?: string }) {
    if (!message) return null;

    return <p className="mt-1.5 text-sm font-medium text-destructive">{message}</p>;
}

function SectionCard({
    title,
    description,
    icon: Icon,
    children,
    className = '',
}: {
    title: string;
    description?: string;
    icon: LucideIcon;
    children: ReactNode;
    className?: string;
}) {
    return (
        <Card
            className={`border-border/60 shadow-sm transition-shadow hover:shadow-md ${className}`}
        >
            <CardHeader className="space-y-3 pb-4">
                <div className="flex items-start gap-3">
                    <div className="rounded-xl border bg-muted/50 p-2.5">
                        <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
                        {description && (
                            <p className="mt-1 text-sm text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

function SummaryItem({
    label,
    value,
}: {
    label: string;
    value?: string | number | boolean;
}) {
    const displayValue =
        value === true
            ? 'Yes'
            : value === false
              ? 'No'
              : value && String(value).trim() !== ''
                ? String(value)
                : 'Not set';

    return (
        <div className="flex items-start justify-between gap-3 py-2">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="max-w-[60%] text-right text-sm font-medium text-foreground">
                {displayValue}
            </span>
        </div>
    );
}

export default function ContractEdit() {
    const { employee, contract, options } = usePage<{
        employee: EmployeeSummary;
        contract: ContractPayload;
        options: ContractOptions;
    }>().props;

    const { data, setData, errors, put, processing } = useForm({
        contract_number: contract.contract_number ?? '',
        contract_type: contract.contract_type ?? '',
        status: contract.status ?? 'draft',
        start_date: contract.start_date ?? '',
        end_date: contract.end_date ?? '',
        probation_end_date: contract.probation_end_date ?? '',
        job_title: contract.job_title ?? '',
        department_id: contract.department ? String(contract.department.id) : '',
        position_id: contract.position ? String(contract.position.id) : '',
        pay_point: contract.pay_point ?? '',
        basic_salary: contract.basic_salary ?? '',
        currency: contract.currency ?? '',
        pay_frequency: contract.pay_frequency ?? '',
        working_hours_per_week: contract.working_hours_per_week
            ? String(contract.working_hours_per_week)
            : '',
        notice_period_days: contract.notice_period_days
            ? String(contract.notice_period_days)
            : '',
        leave_days_per_year: contract.leave_days_per_year
            ? String(contract.leave_days_per_year)
            : '',
        is_current: contract.is_current,
        signed_at: contract.signed_at ? contract.signed_at.substring(0, 10) : '',
        termination_reason: contract.termination_reason ?? '',
        renewal_notes: contract.renewal_notes ?? '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/employees/${employee.id}/contracts/${contract.id}`, {
            preserveScroll: true,
        });
    };

    const selectedDepartment = options.departments.find(
        (d) => String(d.id) === data.department_id,
    )?.name;

    const selectedPosition = options.positions.find(
        (p) => String(p.id) === data.position_id,
    )?.name;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Employees', href: '/employees' },
                {
                    title: employee.full_name,
                    href: `/employees/${employee.id}`,
                },
                {
                    title: 'Contracts',
                    href: `/employees/${employee.id}/contracts`,
                },
                { title: 'Edit', href: '#' },
            ]}
        >
            <Head
                title={`Edit Contract ${contract.contract_number} - ${employee.full_name}`}
            />

            <div className="min-h-screen w-full bg-muted/20">
                <form onSubmit={handleSubmit} className="flex min-h-screen flex-col">
                    <div className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                        <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
                            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                                <div className="flex items-start gap-3">
                                    <Link
                                        href={`/employees/${employee.id}/contracts/${contract.id}`}
                                    >
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            type="button"
                                            className="shrink-0"
                                        >
                                            <ArrowLeft className="h-4 w-4" />
                                        </Button>
                                    </Link>

                                    <div className="min-w-0">
                                        <div className="mb-2 inline-flex items-center rounded-full border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                                            Contract Management
                                        </div>
                                        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                            Edit Contract
                                        </h1>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            <span className="font-medium text-foreground">
                                                {contract.contract_number}
                                            </span>{' '}
                                            · {employee.full_name} · {employee.staff_number}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <Link
                                        href={`/employees/${employee.id}/contracts/${contract.id}`}
                                    >
                                        <Button
                                            variant="outline"
                                            type="button"
                                            className="w-full sm:w-auto"
                                        >
                                            <X className="mr-2 h-4 w-4" />
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full sm:w-auto"
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        {processing ? 'Saving...' : 'Update Contract'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
                        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.8fr)_380px]">
                            <div className="grid gap-6 2xl:grid-cols-2">
                                <SectionCard
                                    title="Contract Details"
                                    description="Core information that identifies and classifies the contract."
                                    icon={FileText}
                                >
                                    <div className="grid gap-5 md:grid-cols-2">
                                        <div className="md:col-span-2">
                                            <FieldLabel required>
                                                Contract Number
                                            </FieldLabel>
                                            <Input
                                                value={data.contract_number}
                                                onChange={(e) =>
                                                    setData('contract_number', e.target.value)
                                                }
                                                placeholder="e.g. CON-2026-001"
                                                className="h-11"
                                            />
                                            <FieldError message={errors.contract_number} />
                                        </div>

                                        <div>
                                            <FieldLabel required>Contract Type</FieldLabel>
                                            <Select
                                                value={data.contract_type}
                                                onValueChange={(v) =>
                                                    setData('contract_type', v)
                                                }
                                            >
                                                <SelectTrigger className="h-11">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {options.contract_types.map((t) => (
                                                        <SelectItem key={t} value={t}>
                                                            {CONTRACT_TYPE_LABELS[t] || t}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FieldError message={errors.contract_type} />
                                        </div>

                                        <div>
                                            <FieldLabel required>Status</FieldLabel>
                                            <Select
                                                value={data.status}
                                                onValueChange={(v) =>
                                                    setData('status', v)
                                                }
                                            >
                                                <SelectTrigger className="h-11">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {options.statuses.map((s) => (
                                                        <SelectItem key={s} value={s}>
                                                            {s
                                                                .replace(/_/g, ' ')
                                                                .replace(/\b\w/g, (c) =>
                                                                    c.toUpperCase(),
                                                                )}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FieldError message={errors.status} />
                                        </div>

                                        <div className="md:col-span-2">
                                            <FieldLabel>Job Title</FieldLabel>
                                            <Input
                                                value={data.job_title}
                                                onChange={(e) =>
                                                    setData('job_title', e.target.value)
                                                }
                                                placeholder="e.g. Senior Developer"
                                                className="h-11"
                                            />
                                            <FieldError message={errors.job_title} />
                                        </div>
                                    </div>
                                </SectionCard>

                                <SectionCard
                                    title="Contract Dates"
                                    description="Manage start, end, signing, and probation dates."
                                    icon={CalendarDays}
                                >
                                    <div className="grid gap-5 md:grid-cols-2">
                                        <div>
                                            <FieldLabel required>Start Date</FieldLabel>
                                            <Input
                                                type="date"
                                                value={data.start_date}
                                                onChange={(e) =>
                                                    setData('start_date', e.target.value)
                                                }
                                                className="h-11"
                                            />
                                            <FieldError message={errors.start_date} />
                                        </div>

                                        <div>
                                            <FieldLabel
                                                required={data.contract_type === 'fixed_term'}
                                            >
                                                End Date
                                            </FieldLabel>
                                            <Input
                                                type="date"
                                                value={data.end_date}
                                                onChange={(e) =>
                                                    setData('end_date', e.target.value)
                                                }
                                                className="h-11"
                                            />
                                            <FieldError message={errors.end_date} />
                                        </div>

                                        <div>
                                            <FieldLabel>Probation End Date</FieldLabel>
                                            <Input
                                                type="date"
                                                value={data.probation_end_date}
                                                onChange={(e) =>
                                                    setData(
                                                        'probation_end_date',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-11"
                                            />
                                            <FieldError
                                                message={errors.probation_end_date}
                                            />
                                        </div>

                                        <div>
                                            <FieldLabel>Signed At</FieldLabel>
                                            <Input
                                                type="date"
                                                value={data.signed_at}
                                                onChange={(e) =>
                                                    setData('signed_at', e.target.value)
                                                }
                                                className="h-11"
                                            />
                                            <FieldError message={errors.signed_at} />
                                        </div>
                                    </div>
                                </SectionCard>

                                <SectionCard
                                    title="Organisation"
                                    description="Assign the contract to the employee’s department and position."
                                    icon={Briefcase}
                                >
                                    <div className="grid gap-5 md:grid-cols-2">
                                        <div>
                                            <FieldLabel>Department</FieldLabel>
                                            <Select
                                                value={data.department_id}
                                                onValueChange={(v) =>
                                                    setData('department_id', v)
                                                }
                                            >
                                                <SelectTrigger className="h-11">
                                                    <SelectValue placeholder="Select department" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {options.departments.map((d) => (
                                                        <SelectItem
                                                            key={d.id}
                                                            value={String(d.id)}
                                                        >
                                                            {d.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FieldError message={errors.department_id} />
                                        </div>

                                        <div>
                                            <FieldLabel>Position</FieldLabel>
                                            <Select
                                                value={data.position_id}
                                                onValueChange={(v) =>
                                                    setData('position_id', v)
                                                }
                                            >
                                                <SelectTrigger className="h-11">
                                                    <SelectValue placeholder="Select position" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {options.positions.map((p) => (
                                                        <SelectItem
                                                            key={p.id}
                                                            value={String(p.id)}
                                                        >
                                                            {p.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FieldError message={errors.position_id} />
                                        </div>

                                        <div className="md:col-span-2">
                                            <FieldLabel>Pay Point</FieldLabel>
                                            <Input
                                                value={data.pay_point}
                                                onChange={(e) =>
                                                    setData('pay_point', e.target.value)
                                                }
                                                placeholder="e.g. Grade C4"
                                                className="h-11"
                                            />
                                            <FieldError message={errors.pay_point} />
                                        </div>
                                    </div>
                                </SectionCard>

                                <SectionCard
                                    title="Compensation & Terms"
                                    description="Capture salary, frequency, hours, notice period, and leave."
                                    icon={DollarSign}
                                >
                                    <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                                        <div>
                                            <FieldLabel>Basic Salary</FieldLabel>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.basic_salary}
                                                onChange={(e) =>
                                                    setData('basic_salary', e.target.value)
                                                }
                                                className="h-11"
                                            />
                                            <FieldError message={errors.basic_salary} />
                                        </div>

                                        <div>
                                            <FieldLabel>Currency</FieldLabel>
                                            <Select
                                                value={data.currency}
                                                onValueChange={(v) =>
                                                    setData('currency', v)
                                                }
                                            >
                                                <SelectTrigger className="h-11">
                                                    <SelectValue placeholder="Select currency" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {options.currencies.map((c) => (
                                                        <SelectItem key={c} value={c}>
                                                            {c}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FieldError message={errors.currency} />
                                        </div>

                                        <div>
                                            <FieldLabel>Pay Frequency</FieldLabel>
                                            <Select
                                                value={data.pay_frequency}
                                                onValueChange={(v) =>
                                                    setData('pay_frequency', v)
                                                }
                                            >
                                                <SelectTrigger className="h-11">
                                                    <SelectValue placeholder="Select frequency" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {options.pay_frequencies.map((f) => (
                                                        <SelectItem key={f} value={f}>
                                                            {PAY_FREQUENCY_LABELS[f] || f}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FieldError message={errors.pay_frequency} />
                                        </div>

                                        <div>
                                            <FieldLabel>Working Hours / Week</FieldLabel>
                                            <Input
                                                type="number"
                                                step="0.5"
                                                min="0"
                                                max="168"
                                                value={data.working_hours_per_week}
                                                onChange={(e) =>
                                                    setData(
                                                        'working_hours_per_week',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-11"
                                            />
                                            <FieldError
                                                message={errors.working_hours_per_week}
                                            />
                                        </div>

                                        <div>
                                            <FieldLabel>Notice Period (days)</FieldLabel>
                                            <Input
                                                type="number"
                                                min="0"
                                                value={data.notice_period_days}
                                                onChange={(e) =>
                                                    setData(
                                                        'notice_period_days',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-11"
                                            />
                                            <FieldError
                                                message={errors.notice_period_days}
                                            />
                                        </div>

                                        <div>
                                            <FieldLabel>Leave Days / Year</FieldLabel>
                                            <Input
                                                type="number"
                                                min="0"
                                                value={data.leave_days_per_year}
                                                onChange={(e) =>
                                                    setData(
                                                        'leave_days_per_year',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-11"
                                            />
                                            <FieldError
                                                message={errors.leave_days_per_year}
                                            />
                                        </div>
                                    </div>
                                </SectionCard>

                                <SectionCard
                                    title="Additional Details"
                                    description="Capture notes, termination info, and active contract state."
                                    icon={ClipboardList}
                                    className="2xl:col-span-2"
                                >
                                    <div className="space-y-5">
                                        {data.status === 'terminated' && (
                                            <div>
                                                <FieldLabel>Termination Reason</FieldLabel>
                                                <Textarea
                                                    value={data.termination_reason}
                                                    onChange={(e) =>
                                                        setData(
                                                            'termination_reason',
                                                            e.target.value,
                                                        )
                                                    }
                                                    rows={3}
                                                    placeholder="Add the reason for contract termination..."
                                                    className="resize-none"
                                                />
                                                <FieldError
                                                    message={errors.termination_reason}
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <FieldLabel>Renewal Notes</FieldLabel>
                                            <Textarea
                                                value={data.renewal_notes}
                                                onChange={(e) =>
                                                    setData('renewal_notes', e.target.value)
                                                }
                                                rows={5}
                                                placeholder="Add internal notes, renewal reminders, or special contract context..."
                                                className="resize-none"
                                            />
                                            <FieldError message={errors.renewal_notes} />
                                        </div>

                                        <div className="rounded-xl border bg-muted/30 p-4">
                                            <div className="flex items-start gap-3">
                                                <Checkbox
                                                    id="is_current"
                                                    checked={data.is_current}
                                                    onCheckedChange={(checked) =>
                                                        setData(
                                                            'is_current',
                                                            checked === true,
                                                        )
                                                    }
                                                    className="mt-0.5"
                                                />
                                                <div className="space-y-1">
                                                    <label
                                                        htmlFor="is_current"
                                                        className="text-sm font-medium text-foreground"
                                                    >
                                                        Set as current active contract
                                                    </label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Use this when the employee should immediately
                                                        use this contract as the primary active one.
                                                    </p>
                                                </div>
                                            </div>
                                            <FieldError message={errors.is_current} />
                                        </div>
                                    </div>
                                </SectionCard>
                            </div>

                            <div className="space-y-6 xl:sticky xl:top-28 xl:self-start">
                                <Card className="border-border/60 shadow-sm">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-xl border bg-muted/50 p-2.5">
                                                <UserSquare2 className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base sm:text-lg">
                                                    Contract Snapshot
                                                </CardTitle>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Live summary while editing.
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-1">
                                        <SummaryItem
                                            label="Employee"
                                            value={employee.full_name}
                                        />
                                        <SummaryItem
                                            label="Staff Number"
                                            value={employee.staff_number}
                                        />
                                        <SummaryItem
                                            label="Contract Number"
                                            value={data.contract_number}
                                        />
                                        <SummaryItem
                                            label="Type"
                                            value={
                                                CONTRACT_TYPE_LABELS[data.contract_type] ||
                                                data.contract_type
                                            }
                                        />
                                        <SummaryItem
                                            label="Status"
                                            value={
                                                data.status
                                                    ? data.status
                                                          .replace(/_/g, ' ')
                                                          .replace(/\b\w/g, (c) =>
                                                              c.toUpperCase(),
                                                          )
                                                    : ''
                                            }
                                        />
                                        <SummaryItem
                                            label="Department"
                                            value={selectedDepartment}
                                        />
                                        <SummaryItem
                                            label="Position"
                                            value={selectedPosition}
                                        />
                                        <SummaryItem
                                            label="Start Date"
                                            value={data.start_date}
                                        />
                                        <SummaryItem
                                            label="End Date"
                                            value={data.end_date}
                                        />
                                        <SummaryItem
                                            label="Salary"
                                            value={
                                                data.basic_salary
                                                    ? `${data.currency || ''} ${data.basic_salary}`.trim()
                                                    : ''
                                            }
                                        />
                                        <SummaryItem
                                            label="Pay Frequency"
                                            value={
                                                PAY_FREQUENCY_LABELS[data.pay_frequency] ||
                                                data.pay_frequency
                                            }
                                        />
                                        <SummaryItem
                                            label="Current Contract"
                                            value={data.is_current}
                                        />
                                    </CardContent>
                                </Card>

                                <Card className="border-border/60 shadow-sm">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-base sm:text-lg">
                                            Tips
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                                        <div className="rounded-lg border bg-muted/30 p-3">
                                            Changing status to terminated will show the termination
                                            reason field immediately.
                                        </div>
                                        <div className="rounded-lg border bg-muted/30 p-3">
                                            Fixed-term contracts should usually include an end date.
                                        </div>
                                        <div className="rounded-lg border bg-muted/30 p-3">
                                            Marking this as current may affect which contract is used
                                            elsewhere in the system.
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}