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
    Save,
    Settings,
    Shield,
    X,
} from 'lucide-react';
import type { FormEvent } from 'react';

type BenefitData = {
    id: number;
    code: string;
    name: string;
    category: string;
    description: string | null;
    benefit_type: string;
    taxable: boolean;
    cash_benefit: boolean;
    employer_funded: boolean;
    employee_funded: boolean;
    shared_contribution: boolean;
    requires_dependants: boolean;
    requires_plan_selection: boolean;
    payroll_deductible: boolean;
    effective_from: string | null;
    effective_to: string | null;
};

type EditProps = {
    benefit: BenefitData;
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

const categories = [
    'health',
    'retirement',
    'allowance',
    'insurance',
    'wellness',
    'education',
    'loan',
    'other',
];

const benefitTypes = [
    'medical_aid',
    'pension',
    'provident_fund',
    'group_life',
    'disability',
    'funeral_cover',
    'housing_allowance',
    'transport_allowance',
    'meal_allowance',
    'education_assistance',
    'wellness_program',
    'other',
];

export default function BenefitEdit() {
    const { benefit } = usePage<EditProps>().props;

    const { data, setData, errors, put, processing } = useForm({
        code: benefit.code ?? '',
        name: benefit.name ?? '',
        category: benefit.category ?? '',
        description: benefit.description ?? '',
        benefit_type: benefit.benefit_type ?? '',
        taxable: benefit.taxable ?? false,
        cash_benefit: benefit.cash_benefit ?? false,
        employer_funded: benefit.employer_funded ?? false,
        employee_funded: benefit.employee_funded ?? false,
        shared_contribution: benefit.shared_contribution ?? false,
        requires_dependants: benefit.requires_dependants ?? false,
        requires_plan_selection: benefit.requires_plan_selection ?? false,
        payroll_deductible: benefit.payroll_deductible ?? false,
        effective_from: benefit.effective_from ?? '',
        effective_to: benefit.effective_to ?? '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/benefits/${benefit.id}`, { preserveScroll: true });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Benefits', href: '/benefits' },
                { title: benefit.name, href: `/benefits/${benefit.id}` },
                { title: 'Edit' },
            ]}
        >
            <Head title={`Edit ${benefit.name}`} />

            <div className="w-full space-y-6 p-4 lg:p-8">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-6">
                    <div className="flex items-center gap-4">
                        <Link href={`/benefits/${benefit.id}`}>
                            <Button variant="ghost" size="icon" className="rounded-full border">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                Edit {benefit.name}
                            </h1>
                            <p className="text-muted-foreground">
                                Update benefit program details.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href={`/benefits/${benefit.id}`}>
                            <Button variant="outline" type="button"><X className="mr-2 h-4 w-4" />Cancel</Button>
                        </Link>
                        <Button onClick={handleSubmit} disabled={processing} className="shadow-sm">
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Saving...' : 'Update Benefit'}
                        </Button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        <div className="space-y-6 lg:col-span-7">
                            {/* Basic Information */}
                            <Card className="shadow-sm">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Shield className="h-5 w-5 text-muted-foreground" />
                                        Basic Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
                                    <div className="space-y-1">
                                        <FieldLabel required>Code</FieldLabel>
                                        <Input
                                            value={data.code}
                                            onChange={(e) => setData('code', e.target.value)}
                                            placeholder="BEN-001"
                                        />
                                        <FieldError message={errors.code} />
                                    </div>
                                    <div className="space-y-1">
                                        <FieldLabel required>Name</FieldLabel>
                                        <Input
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="e.g. Medical Aid"
                                        />
                                        <FieldError message={errors.name} />
                                    </div>
                                    <div className="space-y-1">
                                        <FieldLabel required>Category</FieldLabel>
                                        <Select value={data.category} onValueChange={(v) => setData('category', v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat} value={cat}>
                                                        {formatLabel(cat)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FieldError message={errors.category} />
                                    </div>
                                    <div className="space-y-1">
                                        <FieldLabel required>Benefit Type</FieldLabel>
                                        <Select value={data.benefit_type} onValueChange={(v) => setData('benefit_type', v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {benefitTypes.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {formatLabel(type)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FieldError message={errors.benefit_type} />
                                    </div>
                                    <div className="space-y-1 sm:col-span-2">
                                        <FieldLabel>Description</FieldLabel>
                                        <Textarea
                                            rows={4}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Describe the benefit program..."
                                        />
                                        <FieldError message={errors.description} />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Configuration */}
                            <Card className="shadow-sm">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Settings className="h-5 w-5 text-muted-foreground" />
                                        Configuration
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
                                    {([
                                        { key: 'taxable' as const, label: 'Taxable' },
                                        { key: 'cash_benefit' as const, label: 'Cash Benefit' },
                                        { key: 'employer_funded' as const, label: 'Employer Funded' },
                                        { key: 'employee_funded' as const, label: 'Employee Funded' },
                                        { key: 'shared_contribution' as const, label: 'Shared Contribution' },
                                        { key: 'requires_dependants' as const, label: 'Requires Dependants' },
                                        { key: 'requires_plan_selection' as const, label: 'Requires Plan Selection' },
                                        { key: 'payroll_deductible' as const, label: 'Payroll Deductible' },
                                    ]).map((item) => (
                                        <label key={item.key} className="flex items-center gap-3 rounded-lg border border-zinc-200 p-4 cursor-pointer hover:bg-zinc-50/50 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={data[item.key]}
                                                onChange={(e) => setData(item.key, e.target.checked)}
                                                className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                            />
                                            <span className="text-sm font-medium text-zinc-700">{item.label}</span>
                                        </label>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6 lg:col-span-5">
                            {/* Effective Period */}
                            <Card className="shadow-sm">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <CalendarDays className="h-5 w-5 text-muted-foreground" />
                                        Effective Period
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-6 p-6">
                                    <div className="space-y-1">
                                        <FieldLabel>Effective From</FieldLabel>
                                        <Input
                                            type="date"
                                            value={data.effective_from}
                                            onChange={(e) => setData('effective_from', e.target.value)}
                                        />
                                        <FieldError message={errors.effective_from} />
                                    </div>
                                    <div className="space-y-1">
                                        <FieldLabel>Effective To</FieldLabel>
                                        <Input
                                            type="date"
                                            value={data.effective_to}
                                            onChange={(e) => setData('effective_to', e.target.value)}
                                        />
                                        <FieldError message={errors.effective_to} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
