import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    CalendarDays,
    DollarSign,
    Save,
    Shield,
    Users,
    X,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useMemo } from 'react';

type EmployeeOption = { id: number; full_name: string; staff_number: string };
type BenefitOption = {
    id: number;
    name: string;
    plans: { id: number; name: string }[];
};

type CreateProps = {
    employees: EmployeeOption[];
    benefits: BenefitOption[];
    statuses: string[];
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

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function EnrollmentCreate() {
    const { employees = [], benefits = [], statuses = [] } = usePage<CreateProps>().props;

    const { data, setData, errors, post, processing } = useForm({
        employee_id: '',
        benefit_id: '',
        benefit_plan_id: '',
        status: 'active',
        effective_date: '',
        end_date: '',
        employee_contribution: '',
        employer_contribution: '',
        payroll_deduction_code: '',
        enrollment_reference: '',
        notes: '',
    });

    const filteredPlans = useMemo(() => {
        if (!data.benefit_id) return [];
        const benefit = benefits.find((b) => String(b.id) === data.benefit_id);
        return benefit?.plans ?? [];
    }, [data.benefit_id, benefits]);

    const handleBenefitChange = (value: string) => {
        setData((prev) => ({
            ...prev,
            benefit_id: value,
            benefit_plan_id: '',
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/benefit-enrollments', { preserveScroll: true });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Benefits', href: '/benefits' },
                { title: 'Enrollments', href: '/benefit-enrollments' },
                { title: 'New Enrollment' },
            ]}
        >
            <Head title="New Enrollment" />

            <div className="w-full space-y-6 p-4 lg:p-8">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/benefit-enrollments">
                            <Button variant="ghost" size="icon" className="rounded-full border">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                New Enrollment
                            </h1>
                            <p className="text-muted-foreground">
                                Enroll an employee in a benefit program.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/benefit-enrollments">
                            <Button variant="outline" type="button"><X className="mr-2 h-4 w-4" />Cancel</Button>
                        </Link>
                        <Button onClick={handleSubmit} disabled={processing} className="shadow-sm">
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Saving...' : 'Save Enrollment'}
                        </Button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        <div className="space-y-6 lg:col-span-7">
                            {/* Employee & Benefit */}
                            <Card className="shadow-sm">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Users className="h-5 w-5 text-muted-foreground" />
                                        Employee & Benefit
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
                                    <div className="space-y-1 sm:col-span-2">
                                        <FieldLabel required>Employee</FieldLabel>
                                        <Select value={data.employee_id} onValueChange={(v) => setData('employee_id', v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select employee" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {employees.map((emp) => (
                                                    <SelectItem key={emp.id} value={String(emp.id)}>
                                                        {emp.full_name} ({emp.staff_number})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FieldError message={errors.employee_id} />
                                    </div>
                                    <div className="space-y-1">
                                        <FieldLabel required>Benefit</FieldLabel>
                                        <Select value={data.benefit_id} onValueChange={handleBenefitChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select benefit" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {benefits.map((b) => (
                                                    <SelectItem key={b.id} value={String(b.id)}>
                                                        {b.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FieldError message={errors.benefit_id} />
                                    </div>
                                    <div className="space-y-1">
                                        <FieldLabel>Plan</FieldLabel>
                                        <Select
                                            value={data.benefit_plan_id}
                                            onValueChange={(v) => setData('benefit_plan_id', v)}
                                            disabled={filteredPlans.length === 0}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={filteredPlans.length === 0 ? 'No plans available' : 'Select plan'} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {filteredPlans.map((plan) => (
                                                    <SelectItem key={plan.id} value={String(plan.id)}>
                                                        {plan.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FieldError message={errors.benefit_plan_id} />
                                    </div>
                                    <div className="space-y-1">
                                        <FieldLabel required>Status</FieldLabel>
                                        <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statuses.map((s) => (
                                                    <SelectItem key={s} value={s}>
                                                        {formatLabel(s)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FieldError message={errors.status} />
                                    </div>
                                    <div className="space-y-1">
                                        <FieldLabel>Enrollment Reference</FieldLabel>
                                        <Input
                                            value={data.enrollment_reference}
                                            onChange={(e) => setData('enrollment_reference', e.target.value)}
                                            placeholder="REF-001"
                                        />
                                        <FieldError message={errors.enrollment_reference} />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Contributions */}
                            <Card className="shadow-sm">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                                        Contributions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
                                    <div className="space-y-1">
                                        <FieldLabel>Employee Contribution</FieldLabel>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={data.employee_contribution}
                                            onChange={(e) => setData('employee_contribution', e.target.value)}
                                            placeholder="0.00"
                                        />
                                        <FieldError message={errors.employee_contribution} />
                                    </div>
                                    <div className="space-y-1">
                                        <FieldLabel>Employer Contribution</FieldLabel>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={data.employer_contribution}
                                            onChange={(e) => setData('employer_contribution', e.target.value)}
                                            placeholder="0.00"
                                        />
                                        <FieldError message={errors.employer_contribution} />
                                    </div>
                                    <div className="space-y-1 sm:col-span-2">
                                        <FieldLabel>Payroll Deduction Code</FieldLabel>
                                        <Input
                                            value={data.payroll_deduction_code}
                                            onChange={(e) => setData('payroll_deduction_code', e.target.value)}
                                            placeholder="e.g. MED-DED"
                                        />
                                        <FieldError message={errors.payroll_deduction_code} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6 lg:col-span-5">
                            {/* Dates */}
                            <Card className="shadow-sm">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <CalendarDays className="h-5 w-5 text-muted-foreground" />
                                        Effective Period
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-6 p-6">
                                    <div className="space-y-1">
                                        <FieldLabel required>Effective Date</FieldLabel>
                                        <Input
                                            type="date"
                                            value={data.effective_date}
                                            onChange={(e) => setData('effective_date', e.target.value)}
                                        />
                                        <FieldError message={errors.effective_date} />
                                    </div>
                                    <div className="space-y-1">
                                        <FieldLabel>End Date</FieldLabel>
                                        <Input
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                        />
                                        <FieldError message={errors.end_date} />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Notes */}
                            <Card className="shadow-sm">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Shield className="h-5 w-5 text-muted-foreground" />
                                        Notes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <Textarea
                                        rows={6}
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Additional notes..."
                                    />
                                    <FieldError message={errors.notes} />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
