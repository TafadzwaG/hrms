import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Clock,
    Download,
    FileUp,
    Pencil,
    Plus,
    Send,
    Trash2,
} from 'lucide-react';
import { type FormEvent, type ReactNode, useMemo, useState } from 'react';
import { ControlTotals } from '@/components/payroll/bulk-input-dialog';
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

type Employee = {
    employee_id: number;
    staff_number: string;
    full_name: string;
    pay_basis: string;
    hourly_rate: number | null;
    overtime_multiplier: number;
    cost_centre: string | null;
};

type HourCode = {
    id: number;
    code: string;
    description: string;
    unit: 'HOURS' | 'UNITS';
    rate_multiplier: number | null;
    default_rate: number | null;
};

type Line = {
    key: number;
    employee_id: number;
    pay_code_id: number;
    quantity: string;
    work_date: string;
    cost_centre: string;
    rate: string;
    notes: string;
};

type Props = {
    period: {
        id: number;
        code: string;
        name: string;
        status: string;
        period_start: string | null;
        period_end: string | null;
        editable: boolean;
    };
    employees: Employee[];
    payCodes: HourCode[];
    costCentres: string[];
    summary: Array<{
        employee_id: number;
        staff_number: string;
        full_name: string;
        code: string;
        unit: string;
        quantity: number;
        amount: number;
        lines: number;
        batches: string[];
    }>;
    maxHoursPerDay: number;
    errors: Record<string, string>;
};

const money = (value: number) =>
    value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const emptyEntry = {
    employee_id: '',
    pay_code_id: '',
    quantity: '',
    work_date: '',
    cost_centre: '',
    rate: '',
    notes: '',
};

/**
 * Hourly Input. Capture hours (or units such as mileage) line by line, in summary or
 * by day and cost centre, check the batch against control totals, then post it.
 */
export default function PayrollHourlyInput() {
    const { period, employees, payCodes, costCentres, summary, errors } =
        usePage<Props>().props;
    const { can } = useAuthorization();
    const editable = period.editable && can('payroll.inputs.manage');

    const [detail, setDetail] = useState(true);
    const [entry, setEntry] = useState(emptyEntry);
    const [lines, setLines] = useState<Line[]>([]);
    const [editingKey, setEditingKey] = useState<number | null>(null);
    const [control, setControl] = useState({
        control_total: '',
        control_count: '',
        accept_mismatch: false,
    });
    const [posting, setPosting] = useState(false);
    const [uploadOpen, setUploadOpen] = useState(false);

    const upload = useForm({
        file: null as File | null,
        control_total: '',
        control_count: '',
        accept_mismatch: false,
    });

    const employeeOf = (id: number | string) =>
        employees.find((employee) => employee.employee_id === Number(id));
    const codeOf = (id: number | string) =>
        payCodes.find((code) => code.id === Number(id));

    // The same rate the server will apply, shown so the person can check it before posting.
    const rateFor = (line: {
        employee_id: number | string;
        pay_code_id: number | string;
        rate: string;
    }): number | null => {
        const employee = employeeOf(line.employee_id);
        const code = codeOf(line.pay_code_id);

        if (!employee || !code) {
            return null;
        }

        if (code.unit === 'UNITS') {
            return line.rate !== '' ? Number(line.rate) : code.default_rate;
        }

        if (!employee.hourly_rate) {
            return null;
        }

        const multiplier =
            code.code === 'OT'
                ? employee.overtime_multiplier
                : (code.rate_multiplier ?? 1);

        return Math.round(employee.hourly_rate * multiplier * 10000) / 10000;
    };

    const totals = useMemo(
        () =>
            lines.reduce(
                (sum, line) => {
                    const rate = rateFor(line) ?? 0;

                    return {
                        quantity: sum.quantity + Number(line.quantity),
                        amount: sum.amount + Number(line.quantity) * rate,
                    };
                },
                { quantity: 0, amount: 0 },
            ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [lines],
    );

    const entryCode = codeOf(entry.pay_code_id);
    const entryEmployee = employeeOf(entry.employee_id);
    const entryRate = rateFor(entry);
    const entryReady =
        entry.employee_id !== '' &&
        entry.pay_code_id !== '' &&
        Number(entry.quantity) > 0;

    const addLine = (event: FormEvent) => {
        event.preventDefault();

        if (!entryReady) {
            return;
        }

        const line: Line = {
            key: editingKey ?? Date.now(),
            employee_id: Number(entry.employee_id),
            pay_code_id: Number(entry.pay_code_id),
            quantity: entry.quantity,
            work_date: detail ? entry.work_date : '',
            cost_centre: detail ? entry.cost_centre : '',
            rate: entryCode?.unit === 'UNITS' ? entry.rate : '',
            notes: entry.notes,
        };

        setLines((previous) =>
            editingKey !== null
                ? previous.map((item) =>
                      item.key === editingKey ? line : item,
                  )
                : [line, ...previous],
        );
        setEditingKey(null);
        // Keep the employee and date so the next line for the same person is quick.
        setEntry({
            ...emptyEntry,
            employee_id: entry.employee_id,
            work_date: entry.work_date,
        });
    };

    const editLine = (line: Line) => {
        setEditingKey(line.key);
        setEntry({
            employee_id: String(line.employee_id),
            pay_code_id: String(line.pay_code_id),
            quantity: line.quantity,
            work_date: line.work_date,
            cost_centre: line.cost_centre,
            rate: line.rate,
            notes: line.notes,
        });
    };

    const post = () =>
        router.post(
            `/payroll/periods/${period.id}/hourly`,
            {
                lines: lines.map((line) => ({
                    employee_id: line.employee_id,
                    pay_code_id: line.pay_code_id,
                    quantity: Number(line.quantity),
                    work_date: line.work_date || null,
                    cost_centre: line.cost_centre || null,
                    rate: line.rate === '' ? null : Number(line.rate),
                    notes: line.notes || null,
                })),
                ...control,
            },
            {
                preserveScroll: true,
                onStart: () => setPosting(true),
                onFinish: () => setPosting(false),
                onSuccess: () => {
                    setLines([]);
                    setControl({
                        control_total: '',
                        control_count: '',
                        accept_mismatch: false,
                    });
                },
            },
        );

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Payroll', href: '/payroll' },
                { title: 'Inputs', href: '/payroll/inputs' },
                { title: `${period.code} hours`, href: '#' },
            ]}
        >
            <Head title={`Hourly input · ${period.code}`} />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-6 bg-muted/5 p-4 md:p-6 lg:p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            className="mt-1 hidden h-10 w-10 shrink-0 border-border bg-background shadow-sm sm:flex"
                            onClick={() =>
                                router.visit(
                                    `/payroll/inputs?period_id=${period.id}`,
                                )
                            }
                        >
                            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                        </Button>
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
                                    Hourly input
                                </h1>
                                <Badge
                                    variant="outline"
                                    className="text-[10px] font-bold tracking-widest uppercase"
                                >
                                    {period.code} · {period.status}
                                </Badge>
                            </div>
                            <p className="mt-1 max-w-3xl text-sm font-medium text-muted-foreground">
                                Capture hours from timesheets and clock cards,
                                in total or by day and cost centre. Each line is
                                paid at the employee&apos;s hourly rate times
                                the pay code&apos;s multiplier. Check the batch
                                against its control totals, then post it.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            className="h-10 border-border bg-background font-bold"
                            onClick={() =>
                                (window.location.href =
                                    '/payroll/inputs/hourly-template')
                            }
                        >
                            <Download className="mr-2 h-4 w-4" /> Template
                        </Button>
                        {editable && (
                            <Button
                                variant="outline"
                                className="h-10 border-border bg-background font-bold"
                                onClick={() => setUploadOpen(true)}
                            >
                                <FileUp className="mr-2 h-4 w-4" /> Upload file
                            </Button>
                        )}
                    </div>
                </div>

                {!period.editable && (
                    <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-4 text-sm">
                        This period is {period.status.toLowerCase()}, so hours
                        can no longer be captured. Reopen the period first.
                    </div>
                )}
                {errors.lines && (
                    <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm font-medium text-destructive">
                        {errors.lines}
                    </div>
                )}

                {editable && (
                    <Card className="border-border shadow-sm">
                        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 border-b border-border/50">
                            <CardTitle className="flex items-center gap-2 text-base font-extrabold">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                {editingKey !== null
                                    ? 'Change line'
                                    : 'Capture a line'}
                            </CardTitle>
                            <div className="flex rounded-lg border border-border p-0.5 text-xs font-bold">
                                {[
                                    { value: true, label: 'By day' },
                                    { value: false, label: 'Totals only' },
                                ].map((option) => (
                                    <button
                                        key={option.label}
                                        type="button"
                                        onClick={() => setDetail(option.value)}
                                        className={`rounded-md px-3 py-1.5 ${detail === option.value ? 'bg-foreground text-background' : 'text-muted-foreground'}`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form
                                onSubmit={addLine}
                                className="grid grid-cols-1 items-end gap-3 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1.5fr_1fr_1fr_1.2fr_auto]"
                            >
                                <Field label="Employee">
                                    <Select
                                        value={entry.employee_id}
                                        onValueChange={(value) =>
                                            setEntry({
                                                ...entry,
                                                employee_id: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select employee" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {employees.map((employee) => (
                                                <SelectItem
                                                    key={employee.employee_id}
                                                    value={String(
                                                        employee.employee_id,
                                                    )}
                                                >
                                                    {employee.staff_number} ·{' '}
                                                    {employee.full_name}
                                                    {employee.pay_basis ===
                                                    'HOURLY'
                                                        ? ' · hourly'
                                                        : ''}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>
                                {detail ? (
                                    <Field label="Date">
                                        <Input
                                            type="date"
                                            min={
                                                period.period_start ?? undefined
                                            }
                                            max={period.period_end ?? undefined}
                                            value={entry.work_date}
                                            onChange={(e) =>
                                                setEntry({
                                                    ...entry,
                                                    work_date: e.target.value,
                                                })
                                            }
                                        />
                                    </Field>
                                ) : (
                                    <div className="hidden xl:block" />
                                )}
                                <Field label="Pay code">
                                    <Select
                                        value={entry.pay_code_id}
                                        onValueChange={(value) =>
                                            setEntry({
                                                ...entry,
                                                pay_code_id: value,
                                                rate: '',
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {payCodes.map((code) => (
                                                <SelectItem
                                                    key={code.id}
                                                    value={String(code.id)}
                                                >
                                                    {code.code} ·{' '}
                                                    {code.description}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field
                                    label={
                                        entryCode?.unit === 'UNITS'
                                            ? 'Units'
                                            : 'Hours'
                                    }
                                >
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={entry.quantity}
                                        onChange={(e) =>
                                            setEntry({
                                                ...entry,
                                                quantity: e.target.value,
                                            })
                                        }
                                    />
                                </Field>
                                {entryCode?.unit === 'UNITS' ? (
                                    <Field label="Rate">
                                        <Input
                                            type="number"
                                            step="0.0001"
                                            min="0"
                                            value={entry.rate}
                                            placeholder={
                                                entryCode.default_rate !== null
                                                    ? String(
                                                          entryCode.default_rate,
                                                      )
                                                    : 'Required'
                                            }
                                            onChange={(e) =>
                                                setEntry({
                                                    ...entry,
                                                    rate: e.target.value,
                                                })
                                            }
                                        />
                                    </Field>
                                ) : (
                                    <Field label="Rate">
                                        <Input
                                            disabled
                                            value={
                                                entryRate !== null
                                                    ? money(entryRate)
                                                    : entry.employee_id &&
                                                        entry.pay_code_id
                                                      ? 'No hourly rate'
                                                      : ''
                                            }
                                        />
                                    </Field>
                                )}
                                {detail ? (
                                    <Field label="Cost centre">
                                        <Input
                                            list="hourly-cost-centres"
                                            value={entry.cost_centre}
                                            placeholder={
                                                entryEmployee?.cost_centre ??
                                                'Employee default'
                                            }
                                            onChange={(e) =>
                                                setEntry({
                                                    ...entry,
                                                    cost_centre: e.target.value,
                                                })
                                            }
                                        />
                                        <datalist id="hourly-cost-centres">
                                            {costCentres.map((centre) => (
                                                <option
                                                    key={centre}
                                                    value={centre}
                                                />
                                            ))}
                                        </datalist>
                                    </Field>
                                ) : (
                                    <div className="hidden xl:block" />
                                )}
                                <Button
                                    type="submit"
                                    disabled={!entryReady}
                                    className="h-10 bg-foreground font-bold text-background hover:bg-foreground/90"
                                >
                                    <Plus className="mr-1 h-4 w-4" />
                                    {editingKey !== null ? 'Update' : 'Add'}
                                </Button>
                            </form>
                            {entryReady && entryRate !== null && (
                                <p className="mt-3 text-xs font-medium text-muted-foreground">
                                    {entry.quantity} × {money(entryRate)} ={' '}
                                    <span className="font-bold text-foreground">
                                        {money(
                                            Number(entry.quantity) * entryRate,
                                        )}
                                    </span>
                                </p>
                            )}
                        </CardContent>
                    </Card>
                )}

                {lines.length > 0 && (
                    <Card className="overflow-hidden border-border shadow-sm">
                        <CardHeader className="border-b border-border/50">
                            <CardTitle className="text-base font-extrabold">
                                Lines to post ({lines.length})
                            </CardTitle>
                        </CardHeader>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Pay code</TableHead>
                                    <TableHead className="text-right">
                                        Quantity
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Rate
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Amount
                                    </TableHead>
                                    <TableHead>Cost centre</TableHead>
                                    <TableHead />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lines.map((line) => {
                                    const employee = employeeOf(
                                        line.employee_id,
                                    );
                                    const rate = rateFor(line);

                                    return (
                                        <TableRow
                                            key={line.key}
                                            className={
                                                editingKey === line.key
                                                    ? 'bg-amber-500/10'
                                                    : ''
                                            }
                                        >
                                            <TableCell>
                                                <span className="font-mono text-xs">
                                                    {employee?.staff_number}
                                                </span>{' '}
                                                {employee?.full_name}
                                            </TableCell>
                                            <TableCell>
                                                {line.work_date || '—'}
                                            </TableCell>
                                            <TableCell className="font-bold">
                                                {codeOf(line.pay_code_id)?.code}
                                            </TableCell>
                                            <TableCell className="text-right font-mono">
                                                {line.quantity}
                                            </TableCell>
                                            <TableCell className="text-right font-mono">
                                                {rate !== null
                                                    ? money(rate)
                                                    : '—'}
                                            </TableCell>
                                            <TableCell className="text-right font-mono">
                                                {rate !== null
                                                    ? money(
                                                          Number(
                                                              line.quantity,
                                                          ) * rate,
                                                      )
                                                    : '—'}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {line.cost_centre ||
                                                    employee?.cost_centre ||
                                                    '—'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        aria-label="Change line"
                                                        onClick={() =>
                                                            editLine(line)
                                                        }
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        aria-label="Remove line"
                                                        onClick={() =>
                                                            setLines(
                                                                (previous) =>
                                                                    previous.filter(
                                                                        (
                                                                            item,
                                                                        ) =>
                                                                            item.key !==
                                                                            line.key,
                                                                    ),
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                <TableRow className="bg-muted/40 font-bold">
                                    <TableCell colSpan={3}>Total</TableCell>
                                    <TableCell className="text-right font-mono">
                                        {money(totals.quantity)}
                                    </TableCell>
                                    <TableCell />
                                    <TableCell className="text-right font-mono">
                                        {money(totals.amount)}
                                    </TableCell>
                                    <TableCell colSpan={2} />
                                </TableRow>
                            </TableBody>
                        </Table>
                        <div className="flex flex-col gap-4 border-t border-border/50 p-6 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-xl flex-1">
                                <ControlTotals
                                    totalLabel="Expected total hours / units"
                                    total={control.control_total}
                                    count={control.control_count}
                                    accept={control.accept_mismatch}
                                    error={errors.control_total}
                                    onChange={(field, value) =>
                                        setControl((previous) => ({
                                            ...previous,
                                            [field]: value,
                                        }))
                                    }
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    disabled={posting}
                                    onClick={() => {
                                        setLines([]);
                                        setEditingKey(null);
                                    }}
                                >
                                    Discard lines
                                </Button>
                                <Button
                                    disabled={posting}
                                    className="bg-foreground font-bold text-background hover:bg-foreground/90"
                                    onClick={post}
                                >
                                    <Send className="mr-2 h-4 w-4" /> Post{' '}
                                    {lines.length} line
                                    {lines.length === 1 ? '' : 's'}
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                <Card className="overflow-hidden border-border shadow-sm">
                    <CardHeader className="border-b border-border/50">
                        <CardTitle className="text-base font-extrabold">
                            Captured this period
                        </CardTitle>
                    </CardHeader>
                    {summary.length === 0 ? (
                        <p className="p-6 text-sm text-muted-foreground">
                            No hours captured for this period yet.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Pay code</TableHead>
                                    <TableHead className="text-right">
                                        Quantity
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Amount
                                    </TableHead>
                                    <TableHead>Batches</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {summary.map((row) => (
                                    <TableRow
                                        key={`${row.employee_id}-${row.code}`}
                                    >
                                        <TableCell>
                                            <span className="font-mono text-xs">
                                                {row.staff_number}
                                            </span>{' '}
                                            {row.full_name}
                                        </TableCell>
                                        <TableCell className="font-bold">
                                            {row.code}
                                        </TableCell>
                                        <TableCell className="text-right font-mono">
                                            {money(row.quantity)}{' '}
                                            {row.unit === 'HOURS' ? 'h' : ''}
                                        </TableCell>
                                        <TableCell className="text-right font-mono">
                                            {money(row.amount)}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {row.batches.join(', ')} ·{' '}
                                            {row.lines} line
                                            {row.lines === 1 ? '' : 's'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </Card>
            </div>

            <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                <DialogContent className="border-border sm:max-w-lg">
                    <form
                        className="space-y-5"
                        onSubmit={(event) => {
                            event.preventDefault();
                            upload.post(
                                `/payroll/periods/${period.id}/hourly/import`,
                                {
                                    forceFormData: true,
                                    preserveScroll: true,
                                    onSuccess: () => {
                                        setUploadOpen(false);
                                        upload.reset();
                                    },
                                },
                            );
                        }}
                    >
                        <DialogHeader>
                            <DialogTitle className="text-xl font-extrabold">
                                Upload hours
                            </DialogTitle>
                            <DialogDescription>
                                CSV or Excel (.xlsx) with the columns
                                staff_number, pay_code, quantity, work_date,
                                cost_centre, rate, notes. The whole file is
                                posted as one batch, or nothing is posted if any
                                row is wrong.
                            </DialogDescription>
                        </DialogHeader>
                        <Field label="File">
                            <Input
                                type="file"
                                accept=".csv,text/csv,.xlsx"
                                onChange={(e) =>
                                    upload.setData(
                                        'file',
                                        e.target.files?.[0] ?? null,
                                    )
                                }
                            />
                            {upload.errors.file && (
                                <p className="text-xs font-bold text-destructive">
                                    {upload.errors.file}
                                </p>
                            )}
                            {/* Line problems in an uploaded file come back under "lines". */}
                            {errors.lines && (
                                <p className="text-xs font-bold text-destructive">
                                    {errors.lines}
                                </p>
                            )}
                        </Field>
                        <ControlTotals
                            totalLabel="Expected total hours / units"
                            total={upload.data.control_total}
                            count={upload.data.control_count}
                            accept={upload.data.accept_mismatch}
                            error={upload.errors.control_total}
                            onChange={(field, value) =>
                                upload.setData(field, value as never)
                            }
                        />
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setUploadOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={
                                    !upload.data.file || upload.processing
                                }
                                className="bg-foreground font-bold text-background hover:bg-foreground/90"
                            >
                                Upload and post
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="space-y-2">
            <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                {label}
            </Label>
            {children}
        </div>
    );
}
