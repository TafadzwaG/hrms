import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Calculator,
    Calendar,
    CalendarDays,
    Info,
    MoveRight,
    Save,
    ShieldAlert,
    Users,
} from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type EmployeeOption = {
    id: number;
    full_name: string;
    staff_number?: string;
    position?: string;
    department?: string;
};

type PageProps = {
    employees: EmployeeOption[];
    statusOptions: string[];
    defaults: {
        employee_id: string;
        period_start: string;
        period_end: string;
        total_minutes: number;
        overtime_minutes: number;
        status: string;
        approved_by: string;
    };
};

export default function TimesheetCreate() {
    const { employees, statusOptions, defaults } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors } = useForm({
        employee_id: defaults.employee_id,
        period_start: defaults.period_start,
        period_end: defaults.period_end,
        total_minutes: defaults.total_minutes,
        overtime_minutes: defaults.overtime_minutes,
        status: defaults.status || 'Draft',
        approved_by: defaults.approved_by,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(`${API}/timesheets`, {
            preserveScroll: true,
        });
    };

    const handleSaveDraft = () => {
        setData('status', 'Draft');

        post(`${API}/timesheets`, {
            preserveScroll: true,
        });
    };

    const handleCreateTimesheet = () => {
        if (data.status === 'Draft') {
            setData('status', 'Submitted');
        }

        post(`${API}/timesheets`, {
            preserveScroll: true,
        });
    };

    const employeeCount = employees?.length ?? 0;
    const hasDateRangeError = !!errors.period_start || !!errors.period_end;
    const hasMinuteError = !!errors.total_minutes || !!errors.overtime_minutes;

    const totalValidationMessage =
        hasDateRangeError || hasMinuteError
            ? [
                  errors.period_start,
                  errors.period_end,
                  errors.total_minutes,
                  errors.overtime_minutes,
              ]
                  .filter(Boolean)
                  .join(' ')
            : null;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Timesheets', href: `${API}/timesheets` },
                {
                    title: 'Create New Record',
                    href: `${API}/timesheets/create`,
                },
            ]}
        >
            <Head title="Create Timesheet" />

            <div className="min-h-[calc(100vh-64px)] w-full bg-muted/30 px-4 py-6 md:px-6 lg:px-10">
                <div className="w-full">
                    <div className="mb-6 flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                            <Link
                                href={`${API}/timesheets`}
                                className="hover:text-primary"
                            >
                                Timesheets
                            </Link>
                            <span>/</span>
                            <span className="text-foreground">
                                Create New Record
                            </span>
                        </div>

                        <h1 className="mt-2 text-3xl font-bold tracking-tight">
                            Create Timesheet
                        </h1>
                        <p className="text-muted-foreground">
                            Record employee working hours and overtime for the
                            current period.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        <div className="space-y-6 lg:col-span-8">
                            <Card className="overflow-hidden border shadow-sm">
                                <CardHeader className="border-b bg-muted/40">
                                    <CardTitle className="text-base">
                                        Timesheet Details
                                    </CardTitle>
                                    <CardDescription>
                                        Please provide all required information
                                        marked with an asterisk (*)
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="p-0">
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-6 p-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between gap-4">
                                                    <Label htmlFor="employee_id">
                                                        Employee *
                                                    </Label>
                                                    <span className="text-xs text-muted-foreground italic">
                                                        Search by name or ID
                                                    </span>
                                                </div>

                                                <Select
                                                    value={String(
                                                        data.employee_id || '',
                                                    )}
                                                    onValueChange={(value) =>
                                                        setData(
                                                            'employee_id',
                                                            value,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger
                                                        id="employee_id"
                                                        className="h-10"
                                                    >
                                                        <SelectValue placeholder="Select an employee" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {employees.map(
                                                            (employee) => (
                                                                <SelectItem
                                                                    key={
                                                                        employee.id
                                                                    }
                                                                    value={String(
                                                                        employee.id,
                                                                    )}
                                                                >
                                                                    {
                                                                        employee.full_name
                                                                    }{' '}
                                                                    {employee.staff_number
                                                                        ? `(${employee.staff_number})`
                                                                        : ''}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>

                                                {errors.employee_id && (
                                                    <p className="text-sm text-destructive">
                                                        {errors.employee_id}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="period_start">
                                                        Period Start *
                                                    </Label>
                                                    <div className="relative">
                                                        <Calendar className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                        <Input
                                                            id="period_start"
                                                            type="date"
                                                            className="pl-10"
                                                            value={
                                                                data.period_start
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    'period_start',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    {errors.period_start && (
                                                        <p className="text-sm text-destructive">
                                                            {
                                                                errors.period_start
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="period_end">
                                                        Period End *
                                                    </Label>
                                                    <div className="relative">
                                                        <CalendarDays className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                        <Input
                                                            id="period_end"
                                                            type="date"
                                                            className="pl-10"
                                                            value={
                                                                data.period_end
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    'period_end',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    {errors.period_end && (
                                                        <p className="text-sm text-destructive">
                                                            {errors.period_end}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="total_minutes">
                                                        Total Regular Minutes *
                                                    </Label>
                                                    <div className="relative">
                                                        <Input
                                                            id="total_minutes"
                                                            type="number"
                                                            min={0}
                                                            placeholder="0"
                                                            className="pr-14"
                                                            value={
                                                                data.total_minutes
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    'total_minutes',
                                                                    Number(
                                                                        e.target
                                                                            .value,
                                                                    ),
                                                                )
                                                            }
                                                        />
                                                        <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                                            MIN
                                                        </div>
                                                    </div>
                                                    <p className="text-[11px] text-muted-foreground">
                                                        e.g., 480 min = 8 hours
                                                    </p>
                                                    {errors.total_minutes && (
                                                        <p className="text-sm text-destructive">
                                                            {
                                                                errors.total_minutes
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="overtime_minutes">
                                                        Overtime Minutes
                                                    </Label>
                                                    <div className="relative">
                                                        <Input
                                                            id="overtime_minutes"
                                                            type="number"
                                                            min={0}
                                                            placeholder="0"
                                                            className="border-orange-200 pr-14 focus-visible:ring-orange-200"
                                                            value={
                                                                data.overtime_minutes
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    'overtime_minutes',
                                                                    Number(
                                                                        e.target
                                                                            .value,
                                                                    ),
                                                                )
                                                            }
                                                        />
                                                        <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                                            MIN
                                                        </div>
                                                    </div>
                                                    <p className="text-[11px] text-orange-600">
                                                        Requires manager
                                                        pre-approval
                                                    </p>
                                                    {errors.overtime_minutes && (
                                                        <p className="text-sm text-destructive">
                                                            {
                                                                errors.overtime_minutes
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="status">
                                                    Submission Status
                                                </Label>

                                                <Select
                                                    value={data.status}
                                                    onValueChange={(value) =>
                                                        setData('status', value)
                                                    }
                                                >
                                                    <SelectTrigger
                                                        id="status"
                                                        className="h-10"
                                                    >
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {statusOptions.map(
                                                            (status) => (
                                                                <SelectItem
                                                                    key={status}
                                                                    value={
                                                                        status
                                                                    }
                                                                >
                                                                    {status ===
                                                                    'Draft'
                                                                        ? 'Draft (Not visible to manager)'
                                                                        : status ===
                                                                            'Submitted'
                                                                          ? 'Submitted (Awaiting review)'
                                                                          : status}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>

                                                {errors.status && (
                                                    <p className="text-sm text-destructive">
                                                        {errors.status}
                                                    </p>
                                                )}
                                            </div>

                                            {totalValidationMessage && (
                                                <Alert className="border-red-200 bg-red-50 text-red-700">
                                                    <AlertCircle className="h-4 w-4" />
                                                    <AlertDescription className="text-xs">
                                                        {totalValidationMessage}
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between border-t bg-muted/20 px-6 py-4">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                asChild
                                            >
                                                <Link
                                                    href={`${API}/timesheets`}
                                                >
                                                    Cancel
                                                </Link>
                                            </Button>

                                            <div className="flex gap-3">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={handleSaveDraft}
                                                    disabled={processing}
                                                >
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Save Draft
                                                </Button>

                                                <Button
                                                    type="button"
                                                    onClick={
                                                        handleCreateTimesheet
                                                    }
                                                    disabled={processing}
                                                >
                                                    Create Timesheet
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6 lg:col-span-4">
                            <Card className="border shadow-sm">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-3 text-primary">
                                        <Calculator className="h-5 w-5" />
                                        <CardTitle className="text-base">
                                            Quick Converter
                                        </CardTitle>
                                    </div>
                                    <CardDescription>
                                        Entering hours? Use this conversion
                                        guide to get the total minutes required.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-2">
                                    {[
                                        ['4 Hours', '240 Minutes'],
                                        ['7.5 Hours', '450 Minutes'],
                                        ['8 Hours', '480 Minutes'],
                                        ['9 Hours', '540 Minutes'],
                                        ['40 Hours', '2,400 Minutes'],
                                    ].map(([label, value]) => (
                                        <div
                                            key={label}
                                            className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs ${
                                                label === '8 Hours'
                                                    ? 'bg-primary/5 font-semibold text-primary'
                                                    : 'bg-muted/50'
                                            }`}
                                        >
                                            <span>{label}</span>
                                            <span
                                                className={
                                                    label === '8 Hours'
                                                        ? ''
                                                        : 'font-bold text-foreground'
                                                }
                                            >
                                                {value}
                                            </span>
                                        </div>
                                    ))}

                                    <div className="mt-4 border-t pt-4">
                                        <div className="flex items-center gap-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                            <Info className="h-3.5 w-3.5" />
                                            Formula
                                        </div>
                                        <p className="mt-1 text-sm font-medium">
                                            Hours × 60 = Minutes
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="relative overflow-hidden border-primary/20 bg-primary/10 shadow-sm">
                                <CardContent className="relative z-10 p-6">
                                    <h4 className="mb-2 font-bold text-primary">
                                        Policy Reminder
                                    </h4>
                                    <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                                        All timesheets must be submitted by
                                        Friday at 5:00 PM. Overtime exceeding
                                        500 minutes per period requires HR and
                                        Department Head dual-approval.
                                    </p>
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                                    >
                                        View Full Policy
                                        <MoveRight className="h-3.5 w-3.5" />
                                    </button>
                                </CardContent>

                                <ShieldAlert className="absolute -right-4 -bottom-4 h-28 w-28 text-primary/10" />
                            </Card>

                            <Card className="border shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm">
                                        Pending Records
                                    </CardTitle>
                                </CardHeader>

                                <CardContent>
                                    <div className="flex items-center gap-3">
                                        <div className="flex -space-x-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary/15 text-[10px] font-bold text-primary">
                                                A
                                            </div>
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-emerald-100 text-[10px] font-bold text-emerald-700">
                                                B
                                            </div>
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-orange-100 text-[10px] font-bold text-orange-700">
                                                C
                                            </div>
                                        </div>

                                        <p className="text-xs font-medium text-muted-foreground">
                                            {employeeCount > 0
                                                ? `${Math.min(3, employeeCount)} other employees are awaiting timesheets today.`
                                                : 'No employee summary available yet.'}
                                        </p>
                                    </div>

                                    <div className="mt-4 flex items-center gap-2">
                                        <Badge
                                            variant="secondary"
                                            className="bg-primary/10 text-primary"
                                        >
                                            <Users className="mr-1 h-3 w-3" />
                                            {employeeCount} Employees
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
