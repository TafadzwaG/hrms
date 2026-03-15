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
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { useAuthorization } from '@/lib/authorization';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    CalendarClock,
    Database,
    FileText,
    FileUp,
    Keyboard,
    Layers,
    Pencil,
    Plus,
    Search,
    SlidersHorizontal,
    Trash2,
    UploadCloud,
} from 'lucide-react';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import ReactPaginate from 'react-paginate';

type InputRow = {
    id: number;
    payroll_period_id: number;
    employee_id: number;
    employee: {
        id: number;
        staff_number: string;
        full_name: string;
        department: string | null;
        position: string | null;
    } | null;
    period: { id: number; code: string; status: string } | null;
    pay_code: {
        id: number;
        code: string;
        description: string;
        type: string;
    } | null;
    input_mode: string;
    amount: number | null;
    quantity: number | null;
    rate: number | null;
    source: string;
    reference: string | null;
    notes: string | null;
    created_at: string | null;
};

type PaginatedInputs = {
    data: InputRow[];
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
};

export default function PayrollInputsIndex() {
    const {
        inputs,
        filters,
        stats,
        periods,
        employees,
        payCodes,
        defaults,
        sources,
    } = usePage<{
        inputs: PaginatedInputs;
        filters: {
            period_id?: number | null;
            search?: string;
            source?: string;
        };
        stats: {
            total: number;
            manual: number;
            imported: number;
            periods_with_inputs: number;
        };
        periods: Array<{
            id: number;
            code: string;
            name: string;
            status: string;
            period_start: string | null;
            period_end: string | null;
        }>;
        employees: Array<{
            id: number;
            staff_number: string;
            full_name: string;
        }>;
        payCodes: Array<{
            id: number;
            code: string;
            description: string;
            type: string;
            category: string;
        }>;
        defaults: Record<string, string>;
        sources: string[];
    }>().props;

    const { can } = useAuthorization();
    const [periodId, setPeriodId] = useState(
        filters.period_id ? String(filters.period_id) : 'all',
    );
    const [search, setSearch] = useState(filters.search ?? '');
    const [source, setSource] = useState(filters.source ?? 'all');
    const [open, setOpen] = useState(false);
    const [importOpen, setImportOpen] = useState(false);
    const [editing, setEditing] = useState<InputRow | null>(null);

    const form = useForm(defaults as Record<string, any>);
    const importForm = useForm({
        payroll_period_id: periodId === 'all' ? '' : periodId,
        file: null as File | null,
    });

    useEffect(() => {
        const timer = window.setTimeout(() => {
            router.get(
                '/payroll/inputs',
                {
                    period_id: periodId === 'all' ? '' : periodId,
                    search,
                    source: source === 'all' ? '' : source,
                },
                { preserveState: true, replace: true, preserveScroll: true },
            );
        }, 250);

        return () => window.clearTimeout(timer);
    }, [periodId, search, source]);

    const handlePageChange = (selectedItem: { selected: number }) => {
        router.get(
            '/payroll/inputs',
            {
                page: selectedItem.selected + 1,
                period_id: periodId === 'all' ? '' : periodId,
                search,
                source: source === 'all' ? '' : source,
            },
            { preserveScroll: true, preserveState: true },
        );
    };

    const openCreate = () => {
        setEditing(null);
        form.setData({
            ...defaults,
            payroll_period_id: periodId === 'all' ? '' : periodId,
        });
        setOpen(true);
    };

    const openEdit = (input: InputRow) => {
        setEditing(input);
        form.setData({
            payroll_period_id: String(input.payroll_period_id),
            employee_id: String(input.employee_id),
            pay_code_id: String(input.pay_code?.id ?? ''),
            input_mode: input.input_mode,
            amount: input.amount ?? '',
            quantity: input.quantity ?? '',
            rate: input.rate ?? '',
            source: input.source,
            reference: input.reference ?? '',
            notes: input.notes ?? '',
        });
        setOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = editing
            ? `/payroll/inputs/${editing.id}`
            : '/payroll/inputs';
        const method = editing ? form.put : form.post;
        method(url, { preserveScroll: true, onSuccess: () => setOpen(false) });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Control Center', href: '/control-center' },
                { title: 'Payroll', href: '/payroll' },
                { title: 'Inputs', href: '#' },
            ]}
        >
            <Head title="Payroll Inputs" />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-8 bg-muted/5 p-4 md:p-6 lg:p-8 xl:p-12">
                {/* Header Section */}
                <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            className="mt-1 hidden h-10 w-10 shrink-0 border-border bg-background shadow-sm hover:bg-muted sm:flex"
                            onClick={() => router.visit('/payroll')}
                        >
                            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                                Payroll inputs
                            </h1>
                            <p className="mt-2 max-w-3xl text-sm leading-relaxed font-medium text-muted-foreground">
                                Capture one-off period adjustments and bulk
                                import payroll inputs for selected payroll
                                periods.
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                        {can('payroll.inputs.manage') && (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => setImportOpen(true)}
                                    className="h-11 border-border bg-background px-6 font-bold text-foreground shadow-sm hover:bg-muted"
                                >
                                    <FileUp className="mr-2 h-4 w-4" /> Import
                                    inputs
                                </Button>
                                <Button
                                    onClick={openCreate}
                                    className="h-11 bg-foreground px-6 font-bold text-background shadow-sm hover:bg-foreground/90"
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Add input
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Top Metrics Row */}
                <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4">
                    <MiniStat
                        label="Total Inputs"
                        value={stats.total}
                        icon={Layers}
                    />
                    <MiniStat
                        label="Manual Entries"
                        value={stats.manual}
                        icon={Keyboard}
                    />
                    <MiniStat
                        label="Imported Batch"
                        value={stats.imported}
                        icon={UploadCloud}
                    />
                    <MiniStat
                        label="Active Periods"
                        value={stats.periods_with_inputs}
                        icon={CalendarClock}
                    />
                </div>

                {/* Main Directory Card */}
                <Card className="flex w-full flex-col overflow-hidden border-border bg-background shadow-sm">
                    {/* Toolbar Section */}
                    <div className="flex shrink-0 flex-col justify-between gap-4 border-b border-border/50 bg-muted/5 p-4 sm:flex-row sm:items-center md:p-6">
                        <div className="flex items-center gap-4">
                            <h2 className="text-base font-bold text-foreground">
                                Input register
                            </h2>
                        </div>

                        <div className="flex w-full items-center gap-3 sm:w-auto">
                            <Select
                                value={periodId}
                                onValueChange={setPeriodId}
                            >
                                <SelectTrigger className="h-10 w-full border-border/50 bg-background text-sm font-medium shadow-sm sm:w-48">
                                    <SelectValue placeholder="Select period" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All periods
                                    </SelectItem>
                                    {periods.map((period) => (
                                        <SelectItem
                                            key={period.id}
                                            value={String(period.id)}
                                        >
                                            {period.code}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className="relative w-full sm:w-64">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search inputs..."
                                    className="h-10 w-full border-border/50 bg-background pl-9 text-sm shadow-sm"
                                />
                            </div>

                            <Select value={source} onValueChange={setSource}>
                                <SelectTrigger className="h-10 w-full border-border/50 bg-background text-sm font-medium shadow-sm sm:w-36">
                                    <SelectValue placeholder="Source" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All sources
                                    </SelectItem>
                                    {sources.map((item) => (
                                        <SelectItem key={item} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 shrink-0 border-border/50 text-muted-foreground shadow-sm hover:text-foreground"
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Table Area */}
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-border/50 bg-muted/10 hover:bg-transparent">
                                    <TableHead className="h-12 pl-6 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Employee
                                    </TableHead>
                                    <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Period
                                    </TableHead>
                                    <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Pay Code
                                    </TableHead>
                                    <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Amount / Rate
                                    </TableHead>
                                    <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Source
                                    </TableHead>
                                    <TableHead className="pr-6 text-right text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {inputs.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-48 text-center text-sm font-medium text-muted-foreground"
                                        >
                                            No payroll inputs found for the
                                            current filters.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    inputs.data.map((input) => (
                                        <TableRow
                                            key={input.id}
                                            className="transition-colors hover:bg-muted/30"
                                        >
                                            <TableCell className="py-4 pl-6">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-foreground">
                                                        {
                                                            input.employee
                                                                ?.full_name
                                                        }
                                                    </p>
                                                    <p className="text-xs font-medium text-muted-foreground">
                                                        {
                                                            input.employee
                                                                ?.staff_number
                                                        }
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-foreground">
                                                        {input.period?.code}
                                                    </p>
                                                    <p className="text-xs font-medium text-muted-foreground">
                                                        {input.period?.status}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="border-border bg-background px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-foreground uppercase shadow-none"
                                                >
                                                    {input.pay_code?.code}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-mono text-sm font-bold text-foreground">
                                                {input.amount !== null
                                                    ? input.amount.toFixed(2)
                                                    : `${input.quantity ?? 0} × ${input.rate ?? 0}`}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        input.source ===
                                                        'MANUAL'
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                    className={`px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase shadow-none ${input.source === 'MANUAL' ? 'bg-foreground text-background' : 'border-transparent bg-muted text-muted-foreground'}`}
                                                >
                                                    {input.source}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                {can(
                                                    'payroll.inputs.manage',
                                                ) && (
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                            onClick={() =>
                                                                openEdit(input)
                                                            }
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                            onClick={() =>
                                                                router.delete(
                                                                    `/payroll/inputs/${input.id}`,
                                                                    {
                                                                        preserveScroll: true,
                                                                    },
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {inputs.last_page > 1 && (
                        <div className="flex shrink-0 flex-col items-center justify-between gap-4 border-t border-border/50 bg-muted/5 p-4 sm:flex-row">
                            <span className="text-xs font-bold text-muted-foreground">
                                Page {inputs.current_page} of {inputs.last_page}
                            </span>
                            <ReactPaginate
                                pageCount={inputs.last_page}
                                forcePage={inputs.current_page - 1}
                                onPageChange={handlePageChange}
                                marginPagesDisplayed={1}
                                pageRangeDisplayed={3}
                                previousLabel="Previous"
                                nextLabel="Next"
                                breakLabel="..."
                                containerClassName="flex items-center gap-1"
                                pageLinkClassName="inline-flex h-9 w-9 items-center justify-center rounded-md border border-transparent bg-transparent font-bold hover:bg-muted text-sm shadow-none text-muted-foreground transition-colors"
                                activeLinkClassName="!bg-foreground text-background font-bold border-foreground hover:!bg-foreground/90 rounded-md"
                                previousLinkClassName="inline-flex h-9 px-4 items-center justify-center rounded-md border border-border bg-background hover:bg-muted text-sm font-bold text-foreground transition-colors"
                                nextLinkClassName="inline-flex h-9 px-4 items-center justify-center rounded-md border border-border bg-background hover:bg-muted text-sm font-bold text-foreground transition-colors"
                                breakClassName="flex h-9 w-9 items-center justify-center text-sm font-bold text-muted-foreground"
                                disabledClassName="opacity-50 pointer-events-none"
                            />
                        </div>
                    )}
                </Card>
            </div>

            {/* --- MODAL: Add / Edit Input --- */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent
                    size="6xl"
                    className="overflow-hidden border-border p-0 shadow-lg"
                >
                    <form
                        onSubmit={submit}
                        className="flex max-h-[90vh] flex-col"
                    >
                        <DialogHeader className="border-b border-border/50 bg-muted/5 p-6 pb-6 md:p-8">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background shadow-sm">
                                    <Database className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <DialogTitle className="text-2xl font-extrabold text-foreground">
                                        {editing
                                            ? 'Edit payroll input'
                                            : 'Add payroll input'}
                                    </DialogTitle>
                                    <DialogDescription className="mt-1 text-sm font-medium text-muted-foreground">
                                        Capture a manual earnings or deduction
                                        adjustment for a specific period.
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="flex max-h-[75vh] flex-col gap-8 overflow-y-auto p-6 md:p-8">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                <Field
                                    label="Payroll Period"
                                    error={form.errors.payroll_period_id}
                                >
                                    <Select
                                        value={String(
                                            form.data.payroll_period_id ?? '',
                                        )}
                                        onValueChange={(value) =>
                                            form.setData(
                                                'payroll_period_id',
                                                value,
                                            )
                                        }
                                    >
                                        <SelectTrigger className="h-11 bg-background text-sm shadow-sm">
                                            <SelectValue placeholder="Select period" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {periods.map((period) => (
                                                <SelectItem
                                                    key={period.id}
                                                    value={String(period.id)}
                                                >
                                                    {period.code}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <div className="lg:col-span-2">
                                    <Field
                                        label="Employee"
                                        error={form.errors.employee_id}
                                    >
                                        <Select
                                            value={String(
                                                form.data.employee_id ?? '',
                                            )}
                                            onValueChange={(value) =>
                                                form.setData(
                                                    'employee_id',
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger className="h-11 bg-background text-sm shadow-sm">
                                                <SelectValue placeholder="Select employee" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {employees.map((emp) => (
                                                    <SelectItem
                                                        key={emp.id}
                                                        value={String(emp.id)}
                                                    >
                                                        {emp.full_name} (
                                                        {emp.staff_number})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                </div>

                                <div className="lg:col-span-2">
                                    <Field
                                        label="Pay Code"
                                        error={form.errors.pay_code_id}
                                    >
                                        <Select
                                            value={String(
                                                form.data.pay_code_id ?? '',
                                            )}
                                            onValueChange={(value) =>
                                                form.setData(
                                                    'pay_code_id',
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger className="h-11 bg-background text-sm shadow-sm">
                                                <SelectValue placeholder="Select pay code" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {payCodes.map((pc) => (
                                                    <SelectItem
                                                        key={pc.id}
                                                        value={String(pc.id)}
                                                    >
                                                        {pc.code} •{' '}
                                                        {pc.description}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                </div>

                                <Field
                                    label="Input Mode"
                                    error={form.errors.input_mode}
                                >
                                    <Select
                                        value={String(
                                            form.data.input_mode ?? '',
                                        )}
                                        onValueChange={(value) =>
                                            form.setData('input_mode', value)
                                        }
                                    >
                                        <SelectTrigger className="h-11 bg-background text-sm shadow-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="FIXED">
                                                FIXED AMOUNT
                                            </SelectItem>
                                            <SelectItem value="RATE_X_QTY">
                                                RATE X QTY
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>

                                {form.data.input_mode === 'FIXED' ? (
                                    <Field
                                        label="Amount"
                                        error={form.errors.amount}
                                    >
                                        <Input
                                            type="number"
                                            value={String(
                                                form.data.amount ?? '',
                                            )}
                                            onChange={(e) =>
                                                form.setData(
                                                    'amount',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-11 bg-background shadow-sm"
                                        />
                                    </Field>
                                ) : (
                                    <>
                                        <Field
                                            label="Rate"
                                            error={form.errors.rate}
                                        >
                                            <Input
                                                type="number"
                                                value={String(
                                                    form.data.rate ?? '',
                                                )}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'rate',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-11 bg-background shadow-sm"
                                            />
                                        </Field>
                                        <Field
                                            label="Quantity"
                                            error={form.errors.quantity}
                                        >
                                            <Input
                                                type="number"
                                                value={String(
                                                    form.data.quantity ?? '',
                                                )}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'quantity',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-11 bg-background shadow-sm"
                                            />
                                        </Field>
                                    </>
                                )}

                                <Field
                                    label="Source"
                                    error={form.errors.source}
                                >
                                    <Select
                                        value={String(form.data.source ?? '')}
                                        onValueChange={(value) =>
                                            form.setData('source', value)
                                        }
                                    >
                                        <SelectTrigger className="h-11 bg-background text-sm shadow-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sources.map((item) => (
                                                <SelectItem
                                                    key={item}
                                                    value={item}
                                                >
                                                    {item}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <div className="lg:col-span-2">
                                    <Field
                                        label="Reference"
                                        error={form.errors.reference}
                                    >
                                        <Input
                                            value={String(
                                                form.data.reference ?? '',
                                            )}
                                            onChange={(e) =>
                                                form.setData(
                                                    'reference',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-11 bg-background shadow-sm"
                                        />
                                    </Field>
                                </div>
                                <div className="md:col-span-full">
                                    <Field
                                        label="Notes"
                                        error={form.errors.notes}
                                    >
                                        <Textarea
                                            rows={3}
                                            value={String(
                                                form.data.notes ?? '',
                                            )}
                                            onChange={(e) =>
                                                form.setData(
                                                    'notes',
                                                    e.target.value,
                                                )
                                            }
                                            className="resize-none bg-background shadow-sm"
                                        />
                                    </Field>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="mt-0 flex shrink-0 items-center justify-between border-t border-border/50 bg-muted/5 p-6 md:p-8">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                className="h-11 px-6 font-bold shadow-sm"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="h-11 bg-foreground px-8 font-bold text-background shadow-sm hover:bg-foreground/90"
                            >
                                {editing ? 'Save changes' : 'Create input'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* --- MODAL: Import Inputs (With Dropzone) --- */}
            <Dialog open={importOpen} onOpenChange={setImportOpen}>
                <DialogContent
                    size="2xl"
                    className="overflow-hidden border-border p-0 shadow-lg"
                >
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            importForm.post('/payroll/inputs/import', {
                                forceFormData: true,
                                preserveScroll: true,
                                onSuccess: () => setImportOpen(false),
                            });
                        }}
                        className="flex flex-col"
                    >
                        <DialogHeader className="border-b border-border/50 bg-muted/5 p-6 md:p-8">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background shadow-sm">
                                    <FileUp className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <DialogTitle className="text-2xl font-extrabold text-foreground">
                                        Import payroll inputs
                                    </DialogTitle>
                                    <DialogDescription className="mt-1 text-sm font-medium text-muted-foreground">
                                        Upload a CSV file containing batch
                                        adjustments.
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="space-y-8 p-6 md:p-8">
                            <Field
                                label="Target Payroll Period"
                                error={importForm.errors.payroll_period_id}
                            >
                                <Select
                                    value={String(
                                        importForm.data.payroll_period_id || '',
                                    )}
                                    onValueChange={(value) =>
                                        importForm.setData(
                                            'payroll_period_id',
                                            value,
                                        )
                                    }
                                >
                                    <SelectTrigger className="h-11 bg-background text-sm shadow-sm">
                                        <SelectValue placeholder="Select period" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {periods.map((period) => (
                                            <SelectItem
                                                key={period.id}
                                                value={String(period.id)}
                                            >
                                                {period.code}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field
                                label="Upload Data File"
                                error={importForm.errors.file}
                            >
                                <FileDropzone
                                    selectedFile={importForm.data.file}
                                    onFileSelect={(file) =>
                                        importForm.setData('file', file)
                                    }
                                />
                            </Field>
                        </div>

                        <DialogFooter className="mt-0 flex shrink-0 items-center justify-between border-t border-border/50 bg-muted/5 p-6 md:p-8">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    (window.location.href =
                                        '/payroll/inputs/template')
                                }
                                className="h-11 px-6 font-bold shadow-sm"
                            >
                                Download template
                            </Button>
                            <Button
                                type="submit"
                                disabled={
                                    importForm.processing ||
                                    !importForm.data.file
                                }
                                className="h-11 bg-foreground px-8 font-bold text-background shadow-sm hover:bg-foreground/90"
                            >
                                Import file
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

// --- Sub Components ---

function MiniStat({
    label,
    value,
    icon: Icon,
}: {
    label: string;
    value: number;
    icon: any;
}) {
    return (
        <Card className="h-full border-border bg-background shadow-sm">
            <CardContent className="flex h-full min-h-[120px] flex-col justify-between p-6">
                <div className="flex items-start justify-between">
                    <p className="max-w-[70%] text-[10px] leading-tight font-bold tracking-widest text-muted-foreground uppercase">
                        {label}
                    </p>
                    <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="mt-4">
                    <p className="text-3xl font-extrabold text-foreground">
                        {value}
                    </p>
                </div>
            </CardContent>
        </Card>
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

// Custom Drag and Drop Component
function FileDropzone({
    onFileSelect,
    selectedFile,
}: {
    onFileSelect: (file: File | null) => void;
    selectedFile: File | null;
}) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div
            className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors ${isDragging ? 'border-foreground bg-muted/10' : 'border-border/60 bg-muted/5 hover:bg-muted/10'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
        >
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".csv,text/csv"
                onChange={handleFileChange}
            />
            {selectedFile ? (
                <div className="flex flex-col items-center gap-2">
                    <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background shadow-sm">
                        <FileText className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-bold text-foreground">
                        {selectedFile.name}
                    </p>
                    <p className="text-xs font-medium text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-3 h-8 font-bold text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={(e) => {
                            e.stopPropagation();
                            onFileSelect(null);
                        }}
                    >
                        Remove file
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-2">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background shadow-sm">
                        <UploadCloud className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-bold text-foreground">
                        Click to upload or drag and drop
                    </p>
                    <p className="text-xs font-medium text-muted-foreground">
                        CSV, XLS, or XLSX (max. 10MB)
                    </p>
                </div>
            )}
        </div>
    );
}
