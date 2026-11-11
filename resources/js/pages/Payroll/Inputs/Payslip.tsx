import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Pencil,
    Plus,
    Trash2,
} from 'lucide-react';
import { type FormEvent, type ReactNode, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import AppLayout from '@/layouts/app-layout';
import { useAuthorization } from '@/lib/authorization';

type InputLine = {
    id: number;
    pay_code_id: number;
    code: string | null;
    description: string | null;
    type: string | null;
    input_mode: 'FIXED' | 'RATE_X_QTY';
    amount: number | null;
    quantity: number | null;
    rate: number | null;
    value: number;
    source: string;
    batch_number: string | null;
    reference: string | null;
    notes: string | null;
};

type Figures = {
    gross_pay: number;
    tax: number;
    total_deductions: number;
    net_pay: number;
};

type Props = {
    period: {
        id: number;
        code: string;
        name: string;
        status: string;
        currency: string;
        editable: boolean;
    };
    employee: {
        id: number;
        staff_number: string;
        full_name: string;
        department: string | null;
        position: string | null;
        currency: string;
        basic_salary: number;
        tax_method: string;
        cost_centre: string | null;
    };
    navigation: {
        roster: Array<{
            employee_id: number;
            staff_number: string;
            full_name: string;
        }>;
        previous_id: number | null;
        next_id: number | null;
    };
    recurring: Array<{
        id: number;
        code: string | null;
        description: string | null;
        type: string | null;
        amount: number;
        reference: string | null;
    }>;
    inputs: InputLine[];
    overtime: { timesheets: number; hours: number };
    preview:
        | (Figures & {
              taxable_income: number;
              lines: Array<{
                  code: string;
                  description: string;
                  type: string;
                  amount: number;
                  source: string;
              }>;
              settlements: Array<{ currency: string; amount: number }>;
              employer_cost: number;
              settlement_error: string | null;
              warnings: string[];
          })
        | null;
    processed: Figures | null;
    payCodes: Array<{
        id: number;
        code: string;
        description: string;
        type: string;
    }>;
};

const money = (value: number) =>
    value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const methodLabel: Record<string, string> = {
    NON_FDS: 'PAYE (Non-FDS)',
    FDS_AVERAGE: 'FDS Average',
    FDS_FORECAST: 'FDS Forecast',
};

export default function PayslipInput() {
    const {
        period,
        employee,
        navigation,
        recurring,
        inputs,
        overtime,
        preview,
        processed,
        payCodes,
    } = usePage<Props>().props;

    const { can } = useAuthorization();
    const editable = period.editable && can('payroll.inputs.manage');
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<InputLine | null>(null);

    const form = useForm({
        payroll_period_id: String(period.id),
        employee_id: String(employee.id),
        pay_code_id: '',
        input_mode: 'FIXED' as 'FIXED' | 'RATE_X_QTY',
        amount: '',
        quantity: '',
        rate: '',
        source: 'MANUAL',
        reference: '',
        notes: '',
    });

    const go = (employeeId: number | null) => {
        if (employeeId) {
            router.visit(
                `/payroll/periods/${period.id}/employees/${employeeId}/payslip-input`,
                { preserveScroll: true },
            );
        }
    };

    const openInput = (line: InputLine | null) => {
        form.clearErrors();
        form.setData({
            payroll_period_id: String(period.id),
            employee_id: String(employee.id),
            pay_code_id: line ? String(line.pay_code_id) : '',
            input_mode: line?.input_mode ?? 'FIXED',
            amount: line?.amount !== null && line ? String(line.amount) : '',
            quantity:
                line?.quantity !== null && line ? String(line.quantity) : '',
            rate: line?.rate !== null && line ? String(line.rate) : '',
            source: line?.source ?? 'MANUAL',
            reference: line?.reference ?? '',
            notes: line?.notes ?? '',
        });
        setEditing(line);
        setOpen(true);
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
        };

        if (editing) {
            form.put(`/payroll/inputs/${editing.id}`, options);
        } else {
            form.post('/payroll/inputs', options);
        }
    };

    const changedSinceProcessing =
        processed &&
        preview &&
        Math.abs(processed.net_pay - preview.net_pay) > 0.004;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Payroll', href: '/payroll' },
                { title: period.code, href: `/payroll/periods/${period.id}` },
                { title: 'Payslip input', href: '#' },
            ]}
        >
            <Head title={`Payslip input · ${employee.full_name}`} />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-6 bg-muted/5 p-4 md:p-6 lg:p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            className="mt-1 hidden h-10 w-10 shrink-0 border-border bg-background shadow-sm sm:flex"
                            onClick={() =>
                                router.visit(`/payroll/periods/${period.id}`)
                            }
                        >
                            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                        </Button>
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
                                    {employee.full_name}
                                </h1>
                                <Badge
                                    variant="outline"
                                    className="text-[10px] font-bold tracking-widest uppercase"
                                >
                                    {period.code} · {period.status}
                                </Badge>
                            </div>
                            <p className="mt-1 text-sm font-medium text-muted-foreground">
                                {employee.staff_number}
                                {employee.department
                                    ? ` · ${employee.department}`
                                    : ''}
                                {employee.cost_centre
                                    ? ` · ${employee.cost_centre}`
                                    : ''}{' '}
                                · {employee.currency}{' '}
                                {money(employee.basic_salary)} basic ·{' '}
                                {methodLabel[employee.tax_method] ??
                                    employee.tax_method}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            aria-label="Previous employee"
                            disabled={!navigation.previous_id}
                            onClick={() => go(navigation.previous_id)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Select
                            value={String(employee.id)}
                            onValueChange={(value) => go(Number(value))}
                        >
                            <SelectTrigger className="h-10 w-64 bg-background">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {navigation.roster.map((row) => (
                                    <SelectItem
                                        key={row.employee_id}
                                        value={String(row.employee_id)}
                                    >
                                        {row.staff_number} · {row.full_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            size="icon"
                            aria-label="Next employee"
                            disabled={!navigation.next_id}
                            onClick={() => go(navigation.next_id)}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {!period.editable && (
                    <Notice>
                        This period is {period.status.toLowerCase()}, so its
                        inputs can no longer be changed. Reopen the period to
                        make corrections.
                    </Notice>
                )}

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]">
                    <div className="flex flex-col gap-6">
                        <Card className="border-border shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-border/50">
                                <CardTitle className="text-base font-extrabold">
                                    Period inputs
                                </CardTitle>
                                {editable && (
                                    <Button
                                        size="sm"
                                        className="bg-foreground font-bold text-background hover:bg-foreground/90"
                                        onClick={() => openInput(null)}
                                    >
                                        <Plus className="mr-1 h-4 w-4" /> Add
                                        input
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent className="p-0">
                                {inputs.length === 0 ? (
                                    <p className="p-6 text-sm text-muted-foreground">
                                        No inputs for this employee in this
                                        period.
                                    </p>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Pay code</TableHead>
                                                <TableHead>Source</TableHead>
                                                <TableHead>Reference</TableHead>
                                                <TableHead className="text-right">
                                                    Amount
                                                </TableHead>
                                                <TableHead className="w-24" />
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {inputs.map((line) => (
                                                <TableRow key={line.id}>
                                                    <TableCell>
                                                        <p className="font-bold">
                                                            {line.code}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {line.description}
                                                            {line.input_mode ===
                                                            'RATE_X_QTY'
                                                                ? ` · ${line.quantity} × ${line.rate}`
                                                                : ''}
                                                        </p>
                                                    </TableCell>
                                                    <TableCell className="text-xs">
                                                        {line.source}
                                                        {line.batch_number
                                                            ? ` · ${line.batch_number}`
                                                            : ''}
                                                    </TableCell>
                                                    <TableCell className="text-xs">
                                                        {line.reference || '—'}
                                                    </TableCell>
                                                    <TableCell
                                                        className={`text-right font-mono ${line.type === 'DEDUCTION' ? 'text-destructive' : ''}`}
                                                    >
                                                        {line.type ===
                                                        'DEDUCTION'
                                                            ? `(${money(line.value)})`
                                                            : money(line.value)}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {editable && (
                                                            <div className="flex justify-end gap-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    aria-label="Edit input"
                                                                    onClick={() =>
                                                                        openInput(
                                                                            line,
                                                                        )
                                                                    }
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    aria-label="Delete input"
                                                                    onClick={() =>
                                                                        router.delete(
                                                                            `/payroll/inputs/${line.id}`,
                                                                            {
                                                                                preserveScroll: true,
                                                                            },
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-border shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-border/50">
                                <CardTitle className="text-base font-extrabold">
                                    Recurring items and overtime
                                </CardTitle>
                                <Link
                                    href="/payroll/profiles"
                                    className="text-xs font-bold text-muted-foreground underline-offset-4 hover:underline"
                                >
                                    Change on the payroll profile
                                </Link>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                <p className="font-bold">
                                                    BASIC
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    From the payroll profile
                                                </p>
                                            </TableCell>
                                            <TableCell className="text-right font-mono">
                                                {money(employee.basic_salary)}
                                            </TableCell>
                                        </TableRow>
                                        {recurring.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <p className="font-bold">
                                                        {item.code}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {item.description}
                                                        {item.reference
                                                            ? ` · ${item.reference}`
                                                            : ''}
                                                    </p>
                                                </TableCell>
                                                <TableCell
                                                    className={`text-right font-mono ${item.type === 'DEDUCTION' ? 'text-destructive' : ''}`}
                                                >
                                                    {item.type === 'DEDUCTION'
                                                        ? `(${money(item.amount)})`
                                                        : money(item.amount)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow>
                                            <TableCell>
                                                <p className="font-bold">
                                                    Overtime from timesheets
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {overtime.timesheets}{' '}
                                                    approved timesheet
                                                    {overtime.timesheets === 1
                                                        ? ''
                                                        : 's'}
                                                </p>
                                            </TableCell>
                                            <TableCell className="text-right font-mono">
                                                {overtime.hours} h
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-col gap-6">
                        <Card className="border-border shadow-sm">
                            <CardHeader className="border-b border-border/50">
                                <CardTitle className="text-base font-extrabold">
                                    Payslip preview
                                </CardTitle>
                                <p className="text-xs font-medium text-muted-foreground">
                                    Recalculated on every change. Not saved:
                                    process the period to update the payslip.
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6">
                                {preview ? (
                                    <>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Stat
                                                label="Gross pay"
                                                value={money(preview.gross_pay)}
                                            />
                                            <Stat
                                                label="PAYE + AIDS Levy"
                                                value={money(preview.tax)}
                                            />
                                            <Stat
                                                label="Total deductions"
                                                value={money(
                                                    preview.total_deductions,
                                                )}
                                            />
                                            <Stat
                                                label="Net pay"
                                                value={money(preview.net_pay)}
                                                strong
                                            />
                                        </div>

                                        <Table>
                                            <TableBody>
                                                {preview.lines.map((line) => (
                                                    <TableRow
                                                        key={`${line.code}-${line.source}-${line.amount}`}
                                                    >
                                                        <TableCell className="py-2 text-sm">
                                                            {line.code}
                                                            <span className="ml-2 text-xs text-muted-foreground">
                                                                {
                                                                    line.description
                                                                }
                                                            </span>
                                                        </TableCell>
                                                        <TableCell
                                                            className={`py-2 text-right font-mono text-sm ${line.type === 'DEDUCTION' ? 'text-destructive' : ''}`}
                                                        >
                                                            {line.type ===
                                                            'DEDUCTION'
                                                                ? `(${money(line.amount)})`
                                                                : money(
                                                                      line.amount,
                                                                  )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>

                                        {preview.employer_cost > 0 && (
                                            <p className="text-xs font-medium text-muted-foreground">
                                                Employer contributions (not
                                                deducted):{' '}
                                                {money(preview.employer_cost)}
                                            </p>
                                        )}
                                        {preview.settlements.length > 0 && (
                                            <p className="text-xs font-medium text-muted-foreground">
                                                Paid as{' '}
                                                {preview.settlements
                                                    .map(
                                                        (settlement) =>
                                                            `${settlement.currency} ${money(settlement.amount)}`,
                                                    )
                                                    .join(' + ')}
                                            </p>
                                        )}
                                        {preview.settlement_error && (
                                            <Notice>
                                                {preview.settlement_error}
                                            </Notice>
                                        )}
                                        {preview.warnings.map((warning) => (
                                            <Notice key={warning}>
                                                {warning}
                                            </Notice>
                                        ))}
                                    </>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No preview is available for this
                                        employee.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-border shadow-sm">
                            <CardHeader className="border-b border-border/50">
                                <CardTitle className="text-base font-extrabold">
                                    Last processed
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 p-6">
                                {processed ? (
                                    <>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Stat
                                                label="Gross pay"
                                                value={money(
                                                    processed.gross_pay,
                                                )}
                                            />
                                            <Stat
                                                label="Net pay"
                                                value={money(processed.net_pay)}
                                                strong
                                            />
                                        </div>
                                        {changedSinceProcessing && (
                                            <Notice>
                                                Net pay differs from the last
                                                processed run by{' '}
                                                {money(
                                                    (preview?.net_pay ?? 0) -
                                                        processed.net_pay,
                                                )}
                                                . Reprocess the period to bring
                                                the payslip up to date.
                                            </Notice>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        This period has not been processed for
                                        this employee yet.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="border-border sm:max-w-lg">
                    <form onSubmit={submit} className="space-y-5">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-extrabold">
                                {editing ? 'Change input' : 'Add input'}
                            </DialogTitle>
                            <DialogDescription>
                                For {employee.full_name}, {period.code}.
                            </DialogDescription>
                        </DialogHeader>

                        <Field label="Pay code" error={form.errors.pay_code_id}>
                            <Select
                                value={form.data.pay_code_id}
                                onValueChange={(value) =>
                                    form.setData('pay_code_id', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select pay code" />
                                </SelectTrigger>
                                <SelectContent>
                                    {payCodes.map((code) => (
                                        <SelectItem
                                            key={code.id}
                                            value={String(code.id)}
                                        >
                                            {code.code} · {code.description}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Value" error={form.errors.input_mode}>
                            <Select
                                value={form.data.input_mode}
                                onValueChange={(value) =>
                                    form.setData(
                                        'input_mode',
                                        value as 'FIXED' | 'RATE_X_QTY',
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="FIXED">
                                        Fixed amount
                                    </SelectItem>
                                    <SelectItem value="RATE_X_QTY">
                                        Quantity x rate
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        {form.data.input_mode === 'FIXED' ? (
                            <Field label="Amount" error={form.errors.amount}>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={form.data.amount}
                                    onChange={(e) =>
                                        form.setData('amount', e.target.value)
                                    }
                                />
                            </Field>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                <Field
                                    label="Quantity"
                                    error={form.errors.quantity}
                                >
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={form.data.quantity}
                                        onChange={(e) =>
                                            form.setData(
                                                'quantity',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </Field>
                                <Field label="Rate" error={form.errors.rate}>
                                    <Input
                                        type="number"
                                        step="0.0001"
                                        min="0"
                                        value={form.data.rate}
                                        onChange={(e) =>
                                            form.setData('rate', e.target.value)
                                        }
                                    />
                                </Field>
                            </div>
                        )}
                        <Field label="Reference" error={form.errors.reference}>
                            <Input
                                value={form.data.reference}
                                onChange={(e) =>
                                    form.setData('reference', e.target.value)
                                }
                            />
                        </Field>
                        <Field label="Notes" error={form.errors.notes}>
                            <Input
                                value={form.data.notes}
                                onChange={(e) =>
                                    form.setData('notes', e.target.value)
                                }
                            />
                        </Field>
                        {form.errors.payroll_period_id && (
                            <p className="text-xs font-bold text-destructive">
                                {form.errors.payroll_period_id}
                            </p>
                        )}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="bg-foreground font-bold text-background hover:bg-foreground/90"
                            >
                                Save input
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

function Stat({
    label,
    value,
    strong = false,
}: {
    label: string;
    value: string;
    strong?: boolean;
}) {
    return (
        <div className="rounded-lg border border-border bg-background p-3">
            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                {label}
            </p>
            <p
                className={`mt-1 font-mono ${strong ? 'text-lg font-extrabold' : 'text-base font-bold'}`}
            >
                {value}
            </p>
        </div>
    );
}

function Notice({ children }: { children: ReactNode }) {
    return (
        <div className="flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/5 p-3 text-xs font-medium text-foreground">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
            <span>{children}</span>
        </div>
    );
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <div className="space-y-2">
            <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                {label}
            </Label>
            {children}
            {error && (
                <p className="text-xs font-bold text-destructive">{error}</p>
            )}
        </div>
    );
}
