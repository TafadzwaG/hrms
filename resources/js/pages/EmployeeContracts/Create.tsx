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
import { ArrowLeft, Save } from 'lucide-react';
import type { FormEvent } from 'react';

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

export default function ContractCreate() {
    const { employee, options } = usePage<{
        employee: EmployeeSummary;
        options: ContractOptions;
    }>().props;

    const { data, setData, errors, post, processing } = useForm({
        contract_number: '',
        contract_type: '',
        status: 'draft',
        start_date: '',
        end_date: '',
        probation_end_date: '',
        job_title: '',
        department_id: '',
        position_id: '',
        pay_point: '',
        basic_salary: '',
        currency: '',
        pay_frequency: '',
        working_hours_per_week: '',
        notice_period_days: '',
        leave_days_per_year: '',
        is_current: false,
        signed_at: '',
        renewal_notes: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(`/employees/${employee.id}/contracts`, { preserveScroll: true });
    };

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
                { title: 'New Contract', href: '#' },
            ]}
        >
            <Head title={`New Contract - ${employee.full_name}`} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <Link href={`/employees/${employee.id}/contracts`}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            New Contract
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {employee.full_name} &middot;{' '}
                            {employee.staff_number}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Contract Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contract Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <FieldLabel required>
                                    Contract Number
                                </FieldLabel>
                                <Input
                                    value={data.contract_number}
                                    onChange={(e) =>
                                        setData(
                                            'contract_number',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="e.g. CON-2026-001"
                                />
                                <FieldError
                                    message={errors.contract_number}
                                />
                            </div>
                            <div>
                                <FieldLabel required>Contract Type</FieldLabel>
                                <Select
                                    value={data.contract_type}
                                    onValueChange={(v) =>
                                        setData('contract_type', v)
                                    }
                                >
                                    <SelectTrigger>
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
                                    <SelectTrigger>
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
                            <div>
                                <FieldLabel>Job Title</FieldLabel>
                                <Input
                                    value={data.job_title}
                                    onChange={(e) =>
                                        setData('job_title', e.target.value)
                                    }
                                    placeholder="e.g. Senior Developer"
                                />
                                <FieldError message={errors.job_title} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dates */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contract Dates</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <FieldLabel required>Start Date</FieldLabel>
                                <Input
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) =>
                                        setData('start_date', e.target.value)
                                    }
                                />
                                <FieldError message={errors.start_date} />
                            </div>
                            <div>
                                <FieldLabel
                                    required={
                                        data.contract_type === 'fixed_term'
                                    }
                                >
                                    End Date
                                </FieldLabel>
                                <Input
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) =>
                                        setData('end_date', e.target.value)
                                    }
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
                                />
                                <FieldError message={errors.signed_at} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Organisation */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Organisation</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <FieldLabel>Department</FieldLabel>
                                <Select
                                    value={data.department_id}
                                    onValueChange={(v) =>
                                        setData('department_id', v)
                                    }
                                >
                                    <SelectTrigger>
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
                                    <SelectTrigger>
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
                            <div>
                                <FieldLabel>Pay Point</FieldLabel>
                                <Input
                                    value={data.pay_point}
                                    onChange={(e) =>
                                        setData('pay_point', e.target.value)
                                    }
                                />
                                <FieldError message={errors.pay_point} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Compensation */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Compensation &amp; Terms</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                                    <SelectTrigger>
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
                                    <SelectTrigger>
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
                                />
                                <FieldError
                                    message={errors.leave_days_per_year}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notes & Flags */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Additional</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <FieldLabel>Renewal Notes</FieldLabel>
                                <Textarea
                                    value={data.renewal_notes}
                                    onChange={(e) =>
                                        setData(
                                            'renewal_notes',
                                            e.target.value,
                                        )
                                    }
                                    rows={3}
                                />
                                <FieldError message={errors.renewal_notes} />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_current"
                                    checked={data.is_current}
                                    onCheckedChange={(checked) =>
                                        setData(
                                            'is_current',
                                            checked === true,
                                        )
                                    }
                                />
                                <label
                                    htmlFor="is_current"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Set as current active contract
                                </label>
                            </div>
                            <FieldError message={errors.is_current} />
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex items-center justify-end gap-3">
                        <Link href={`/employees/${employee.id}/contracts`}>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Saving...' : 'Save Contract'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
