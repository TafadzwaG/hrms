import { Badge } from '@/components/ui/badge';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    ClipboardList,
    DollarSign,
    Eye,
    FileText,
    Heart,
    Pencil,
    Plus,
    Settings,
    Shield,
    Users,
    XCircle,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';

type PlanRecord = {
    id: number;
    name: string;
    code: string;
    employer_contribution: string | number | null;
    employee_contribution: string | number | null;
    coverage_details: string | null;
    active: boolean;
};

type EnrollmentRecord = {
    id: number;
    employee: { id: number; full_name: string; staff_number: string };
    plan: { id: number; name: string } | null;
    status: string;
    effective_date: string | null;
    employer_contribution: string | number | null;
    employee_contribution: string | number | null;
};

type ContributionRule = {
    id: number;
    rule_name: string;
    basis: string;
    employer_value: string | number | null;
    employer_type: string;
    employee_value: string | number | null;
    employee_type: string;
    effective_from: string | null;
    effective_to: string | null;
    active: boolean;
};

type DocumentItem = {
    id: number;
    file_name: string;
    mime_type: string | null;
    size: number | null;
    created_at: string | null;
    download_url: string;
    delete_url: string;
};

type BenefitPayload = {
    id: number;
    code: string;
    name: string;
    category: string;
    benefit_type: string;
    description: string | null;
    active: boolean;
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
    plans: PlanRecord[];
    enrollments: EnrollmentRecord[];
    contribution_rules: ContributionRule[];
    documents: DocumentItem[];
    created_at: string | null;
    updated_at: string | null;
};

type ShowProps = {
    benefit: BenefitPayload;
};

const statusStyles: Record<string, string> = {
    active: 'border-transparent bg-emerald-100 text-emerald-700',
    draft: 'border-transparent bg-zinc-100 text-zinc-600',
    suspended: 'border-transparent bg-amber-100 text-amber-700',
    terminated: 'border-transparent bg-red-100 text-red-700',
    expired: 'border-transparent bg-slate-100 text-slate-600',
    cancelled: 'border-transparent bg-rose-100 text-rose-600',
};

const categoryStyles: Record<string, string> = {
    health: 'border-transparent bg-blue-100 text-blue-700',
    retirement: 'border-transparent bg-purple-100 text-purple-700',
    allowance: 'border-transparent bg-green-100 text-green-700',
    insurance: 'border-transparent bg-indigo-100 text-indigo-700',
    wellness: 'border-transparent bg-teal-100 text-teal-700',
    education: 'border-transparent bg-orange-100 text-orange-700',
    loan: 'border-transparent bg-pink-100 text-pink-700',
    other: 'border-transparent bg-zinc-100 text-zinc-600',
};

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(value: string | null) {
    if (!value) return '---';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatMoney(value: string | number | null | undefined) {
    if (value === null || value === undefined || value === '') return '---';
    const amount = Number(value);
    if (Number.isNaN(amount)) return String(value);
    return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

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

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex justify-between gap-3 text-sm">
            <span className="text-zinc-400">{label}</span>
            <span className="text-right font-semibold text-zinc-700">{children}</span>
        </div>
    );
}

export default function BenefitShow() {
    const { benefit } = usePage<ShowProps>().props;

    const [showPlanDialog, setShowPlanDialog] = useState(false);
    const [showRuleDialog, setShowRuleDialog] = useState(false);

    const planForm = useForm({
        name: '',
        code: '',
        employer_contribution: '',
        employee_contribution: '',
        coverage_details: '',
    });

    const ruleForm = useForm({
        rule_name: '',
        basis: 'basic_salary',
        employer_value: '',
        employer_type: 'percentage',
        employee_value: '',
        employee_type: 'percentage',
        effective_from: '',
        effective_to: '',
    });

    const handleAddPlan = (e: FormEvent) => {
        e.preventDefault();
        planForm.post(`/benefits/${benefit.id}/plans`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowPlanDialog(false);
                planForm.reset();
            },
        });
    };

    const handleAddRule = (e: FormEvent) => {
        e.preventDefault();
        ruleForm.post(`/benefits/${benefit.id}/contribution-rules`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowRuleDialog(false);
                ruleForm.reset();
            },
        });
    };

    const handleToggleActive = () => {
        router.put(
            `/benefits/${benefit.id}/toggle-active`,
            {},
            { preserveScroll: true },
        );
    };

    const fundingModel = () => {
        if (benefit.shared_contribution) return 'Shared Contribution';
        if (benefit.employer_funded && benefit.employee_funded) return 'Employer + Employee';
        if (benefit.employer_funded) return 'Employer Funded';
        if (benefit.employee_funded) return 'Employee Funded';
        return 'Not Specified';
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Benefits', href: '/benefits' },
                { title: benefit.name },
            ]}
        >
            <Head title={benefit.name} />

            <div className="w-full space-y-6 p-6 lg:p-10">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/benefits">
                            <Button variant="ghost" size="icon" className="rounded-full border">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                    {benefit.name}
                                </h1>
                                <Badge
                                    variant="outline"
                                    className={`${benefit.active ? statusStyles.active : statusStyles.draft} font-semibold`}
                                >
                                    {benefit.active ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground">
                                {benefit.code} &middot; {formatLabel(benefit.category)} &middot; {formatLabel(benefit.benefit_type)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={handleToggleActive}
                            type="button"
                        >
                            {benefit.active ? (
                                <><XCircle className="mr-2 h-4 w-4" /> Deactivate</>
                            ) : (
                                <><CheckCircle2 className="mr-2 h-4 w-4" /> Activate</>
                            )}
                        </Button>
                        <Link href={`/benefits/${benefit.id}/edit`}>
                            <Button className="shadow-sm">
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="plans">Plans ({benefit.plans?.length ?? 0})</TabsTrigger>
                        <TabsTrigger value="enrollments">Enrollments ({benefit.enrollments?.length ?? 0})</TabsTrigger>
                        <TabsTrigger value="contribution-rules">Contribution Rules ({benefit.contribution_rules?.length ?? 0})</TabsTrigger>
                        <TabsTrigger value="documents">Documents ({benefit.documents?.length ?? 0})</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <Card className="border-zinc-200 shadow-none">
                                <CardContent className="p-6 space-y-1">
                                    <p className="text-sm font-medium tracking-wider text-zinc-500 uppercase">Category</p>
                                    <Badge variant="outline" className={`${categoryStyles[benefit.category] ?? categoryStyles.other} font-semibold`}>
                                        {formatLabel(benefit.category)}
                                    </Badge>
                                </CardContent>
                            </Card>
                            <Card className="border-zinc-200 shadow-none">
                                <CardContent className="p-6 space-y-1">
                                    <p className="text-sm font-medium tracking-wider text-zinc-500 uppercase">Type</p>
                                    <p className="text-lg font-bold text-zinc-900">{formatLabel(benefit.benefit_type)}</p>
                                </CardContent>
                            </Card>
                            <Card className="border-zinc-200 shadow-none">
                                <CardContent className="p-6 space-y-1">
                                    <p className="text-sm font-medium tracking-wider text-zinc-500 uppercase">Status</p>
                                    <Badge variant="outline" className={`${benefit.active ? statusStyles.active : statusStyles.draft} font-semibold`}>
                                        {benefit.active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </CardContent>
                            </Card>
                            <Card className="border-zinc-200 shadow-none">
                                <CardContent className="p-6 space-y-1">
                                    <p className="text-sm font-medium tracking-wider text-zinc-500 uppercase">Funding Model</p>
                                    <p className="text-lg font-bold text-zinc-900">{fundingModel()}</p>
                                </CardContent>
                            </Card>
                        </div>

                        {benefit.description && (
                            <Card className="shadow-sm">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                        Description
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <p className="text-zinc-600 whitespace-pre-wrap">{benefit.description}</p>
                                </CardContent>
                            </Card>
                        )}

                        <Card className="shadow-sm">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Settings className="h-5 w-5 text-muted-foreground" />
                                    Configuration Flags
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                    {[
                                        { label: 'Taxable', value: benefit.taxable },
                                        { label: 'Cash Benefit', value: benefit.cash_benefit },
                                        { label: 'Employer Funded', value: benefit.employer_funded },
                                        { label: 'Employee Funded', value: benefit.employee_funded },
                                        { label: 'Shared Contribution', value: benefit.shared_contribution },
                                        { label: 'Requires Dependants', value: benefit.requires_dependants },
                                        { label: 'Requires Plan Selection', value: benefit.requires_plan_selection },
                                        { label: 'Payroll Deductible', value: benefit.payroll_deductible },
                                    ].map((flag, index) => (
                                        <div key={index} className="flex items-center gap-2 rounded-lg border border-zinc-100 p-3">
                                            {flag.value ? (
                                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-zinc-300" />
                                            )}
                                            <span className="text-sm font-medium text-zinc-700">{flag.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <CalendarDays className="h-5 w-5 text-muted-foreground" />
                                    Effective Dates
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-3">
                                <InfoRow label="Effective From">{formatDate(benefit.effective_from)}</InfoRow>
                                <InfoRow label="Effective To">{formatDate(benefit.effective_to)}</InfoRow>
                                <InfoRow label="Created At">{formatDate(benefit.created_at)}</InfoRow>
                                <InfoRow label="Updated At">{formatDate(benefit.updated_at)}</InfoRow>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Plans Tab */}
                    <TabsContent value="plans" className="space-y-6">
                        <div className="flex justify-end">
                            <Button onClick={() => setShowPlanDialog(true)} type="button">
                                <Plus className="mr-2 h-4 w-4" /> Add Plan
                            </Button>
                        </div>

                        <div className="overflow-hidden rounded-md border border-zinc-200">
                            <Table>
                                <TableHeader className="bg-zinc-50">
                                    <TableRow>
                                        <TableHead className="font-bold text-zinc-900">Code</TableHead>
                                        <TableHead className="font-bold text-zinc-900">Name</TableHead>
                                        <TableHead className="font-bold text-zinc-900">Employer Contrib.</TableHead>
                                        <TableHead className="font-bold text-zinc-900">Employee Contrib.</TableHead>
                                        <TableHead className="font-bold text-zinc-900">Coverage</TableHead>
                                        <TableHead className="font-bold text-zinc-900">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(benefit.plans ?? []).length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="py-8 text-center text-zinc-400">No plans found.</TableCell>
                                        </TableRow>
                                    ) : (
                                        benefit.plans.map((plan) => (
                                            <TableRow key={plan.id} className="hover:bg-zinc-50/50">
                                                <TableCell className="font-mono text-xs text-zinc-500">{plan.code}</TableCell>
                                                <TableCell className="font-bold text-zinc-900">{plan.name}</TableCell>
                                                <TableCell>{formatMoney(plan.employer_contribution)}</TableCell>
                                                <TableCell>{formatMoney(plan.employee_contribution)}</TableCell>
                                                <TableCell className="max-w-[200px] truncate text-zinc-500">{plan.coverage_details ?? '---'}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={`${plan.active ? statusStyles.active : statusStyles.draft} font-semibold`}>
                                                        {plan.active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    {/* Enrollments Tab */}
                    <TabsContent value="enrollments" className="space-y-6">
                        <div className="overflow-hidden rounded-md border border-zinc-200">
                            <Table>
                                <TableHeader className="bg-zinc-50">
                                    <TableRow>
                                        <TableHead className="font-bold text-zinc-900">Employee</TableHead>
                                        <TableHead className="font-bold text-zinc-900">Plan</TableHead>
                                        <TableHead className="font-bold text-zinc-900">Status</TableHead>
                                        <TableHead className="font-bold text-zinc-900">Effective Date</TableHead>
                                        <TableHead className="font-bold text-zinc-900">Employee Contrib.</TableHead>
                                        <TableHead className="font-bold text-zinc-900">Employer Contrib.</TableHead>
                                        <TableHead className="text-right font-bold text-zinc-900">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(benefit.enrollments ?? []).length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="py-8 text-center text-zinc-400">No enrollments found.</TableCell>
                                        </TableRow>
                                    ) : (
                                        benefit.enrollments.map((enrollment) => (
                                            <TableRow key={enrollment.id} className="hover:bg-zinc-50/50">
                                                <TableCell>
                                                    <div>
                                                        <p className="font-bold text-zinc-900">{enrollment.employee.full_name}</p>
                                                        <p className="text-xs text-zinc-400">{enrollment.employee.staff_number}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-zinc-500">{enrollment.plan?.name ?? '---'}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={`${statusStyles[enrollment.status] ?? 'border-zinc-200 bg-zinc-50 text-zinc-700'} font-semibold`}>
                                                        {formatLabel(enrollment.status)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-zinc-500">{formatDate(enrollment.effective_date)}</TableCell>
                                                <TableCell>{formatMoney(enrollment.employee_contribution)}</TableCell>
                                                <TableCell>{formatMoney(enrollment.employer_contribution)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                        <Link href={`/benefit-enrollments/${enrollment.id}`}>
                                                            <Eye className="h-4 w-4 text-zinc-400" />
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    {/* Contribution Rules Tab */}
                    <TabsContent value="contribution-rules" className="space-y-6">
                        <div className="flex justify-end">
                            <Button onClick={() => setShowRuleDialog(true)} type="button">
                                <Plus className="mr-2 h-4 w-4" /> Add Rule
                            </Button>
                        </div>

                        <div className="overflow-hidden rounded-md border border-zinc-200">
                            <Table>
                                <TableHeader className="bg-zinc-50">
                                    <TableRow>
                                        <TableHead className="font-bold text-zinc-900">Rule Name</TableHead>
                                        <TableHead className="font-bold text-zinc-900">Basis</TableHead>
                                        <TableHead className="font-bold text-zinc-900">Employer Value</TableHead>
                                        <TableHead className="font-bold text-zinc-900">Employee Value</TableHead>
                                        <TableHead className="font-bold text-zinc-900">Effective From</TableHead>
                                        <TableHead className="font-bold text-zinc-900">Effective To</TableHead>
                                        <TableHead className="font-bold text-zinc-900">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(benefit.contribution_rules ?? []).length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="py-8 text-center text-zinc-400">No contribution rules found.</TableCell>
                                        </TableRow>
                                    ) : (
                                        benefit.contribution_rules.map((rule) => (
                                            <TableRow key={rule.id} className="hover:bg-zinc-50/50">
                                                <TableCell className="font-bold text-zinc-900">{rule.rule_name}</TableCell>
                                                <TableCell className="text-zinc-500">{formatLabel(rule.basis)}</TableCell>
                                                <TableCell>
                                                    {formatMoney(rule.employer_value)} ({formatLabel(rule.employer_type)})
                                                </TableCell>
                                                <TableCell>
                                                    {formatMoney(rule.employee_value)} ({formatLabel(rule.employee_type)})
                                                </TableCell>
                                                <TableCell className="text-zinc-500">{formatDate(rule.effective_from)}</TableCell>
                                                <TableCell className="text-zinc-500">{formatDate(rule.effective_to)}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={`${rule.active ? statusStyles.active : statusStyles.draft} font-semibold`}>
                                                        {rule.active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    {/* Documents Tab */}
                    <TabsContent value="documents" className="space-y-6">
                        <div className="overflow-hidden rounded-md border border-zinc-200">
                            <Table>
                                <TableHeader className="bg-zinc-50">
                                    <TableRow>
                                        <TableHead className="font-bold text-zinc-900">File Name</TableHead>
                                        <TableHead className="font-bold text-zinc-900">Type</TableHead>
                                        <TableHead className="font-bold text-zinc-900">Size</TableHead>
                                        <TableHead className="font-bold text-zinc-900">Uploaded</TableHead>
                                        <TableHead className="text-right font-bold text-zinc-900">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(benefit.documents ?? []).length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="py-8 text-center text-zinc-400">No documents found.</TableCell>
                                        </TableRow>
                                    ) : (
                                        benefit.documents.map((doc) => (
                                            <TableRow key={doc.id} className="hover:bg-zinc-50/50">
                                                <TableCell className="font-bold text-zinc-900">{doc.file_name}</TableCell>
                                                <TableCell className="text-zinc-500">{doc.mime_type ?? '---'}</TableCell>
                                                <TableCell className="text-zinc-500">
                                                    {doc.size ? `${(doc.size / 1024).toFixed(1)} KB` : '---'}
                                                </TableCell>
                                                <TableCell className="text-zinc-500">{formatDate(doc.created_at)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <a href={doc.download_url} target="_blank" rel="noopener noreferrer">
                                                            Download
                                                        </a>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Add Plan Dialog */}
            <AlertDialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
                <AlertDialogContent className="max-w-lg border-zinc-200">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold">Add Plan</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-500">
                            Add a new plan to this benefit program.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <form onSubmit={handleAddPlan} className="space-y-4">
                        <div className="space-y-1">
                            <FieldLabel required>Plan Code</FieldLabel>
                            <Input
                                value={planForm.data.code}
                                onChange={(e) => planForm.setData('code', e.target.value)}
                                placeholder="PLN-001"
                            />
                            <FieldError message={planForm.errors.code} />
                        </div>
                        <div className="space-y-1">
                            <FieldLabel required>Plan Name</FieldLabel>
                            <Input
                                value={planForm.data.name}
                                onChange={(e) => planForm.setData('name', e.target.value)}
                                placeholder="e.g. Basic Plan"
                            />
                            <FieldError message={planForm.errors.name} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <FieldLabel>Employer Contribution</FieldLabel>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={planForm.data.employer_contribution}
                                    onChange={(e) => planForm.setData('employer_contribution', e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-1">
                                <FieldLabel>Employee Contribution</FieldLabel>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={planForm.data.employee_contribution}
                                    onChange={(e) => planForm.setData('employee_contribution', e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <FieldLabel>Coverage Details</FieldLabel>
                            <Input
                                value={planForm.data.coverage_details}
                                onChange={(e) => planForm.setData('coverage_details', e.target.value)}
                                placeholder="Describe coverage..."
                            />
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="border-zinc-200" type="button">Cancel</AlertDialogCancel>
                            <Button type="submit" disabled={planForm.processing}>
                                {planForm.processing ? 'Adding...' : 'Add Plan'}
                            </Button>
                        </AlertDialogFooter>
                    </form>
                </AlertDialogContent>
            </AlertDialog>

            {/* Add Contribution Rule Dialog */}
            <AlertDialog open={showRuleDialog} onOpenChange={setShowRuleDialog}>
                <AlertDialogContent className="max-w-lg border-zinc-200">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold">Add Contribution Rule</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-500">
                            Define a new contribution rule for this benefit.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <form onSubmit={handleAddRule} className="space-y-4">
                        <div className="space-y-1">
                            <FieldLabel required>Rule Name</FieldLabel>
                            <Input
                                value={ruleForm.data.rule_name}
                                onChange={(e) => ruleForm.setData('rule_name', e.target.value)}
                                placeholder="e.g. Standard Rate"
                            />
                            <FieldError message={ruleForm.errors.rule_name} />
                        </div>
                        <div className="space-y-1">
                            <FieldLabel required>Basis</FieldLabel>
                            <Select value={ruleForm.data.basis} onValueChange={(v) => ruleForm.setData('basis', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="basic_salary">Basic Salary</SelectItem>
                                    <SelectItem value="gross_salary">Gross Salary</SelectItem>
                                    <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <FieldLabel>Employer Value</FieldLabel>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={ruleForm.data.employer_value}
                                    onChange={(e) => ruleForm.setData('employer_value', e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-1">
                                <FieldLabel>Employer Type</FieldLabel>
                                <Select value={ruleForm.data.employer_type} onValueChange={(v) => ruleForm.setData('employer_type', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="percentage">Percentage</SelectItem>
                                        <SelectItem value="fixed">Fixed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <FieldLabel>Employee Value</FieldLabel>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={ruleForm.data.employee_value}
                                    onChange={(e) => ruleForm.setData('employee_value', e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-1">
                                <FieldLabel>Employee Type</FieldLabel>
                                <Select value={ruleForm.data.employee_type} onValueChange={(v) => ruleForm.setData('employee_type', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="percentage">Percentage</SelectItem>
                                        <SelectItem value="fixed">Fixed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <FieldLabel>Effective From</FieldLabel>
                                <Input
                                    type="date"
                                    value={ruleForm.data.effective_from}
                                    onChange={(e) => ruleForm.setData('effective_from', e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <FieldLabel>Effective To</FieldLabel>
                                <Input
                                    type="date"
                                    value={ruleForm.data.effective_to}
                                    onChange={(e) => ruleForm.setData('effective_to', e.target.value)}
                                />
                            </div>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="border-zinc-200" type="button">Cancel</AlertDialogCancel>
                            <Button type="submit" disabled={ruleForm.processing}>
                                {ruleForm.processing ? 'Adding...' : 'Add Rule'}
                            </Button>
                        </AlertDialogFooter>
                    </form>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
