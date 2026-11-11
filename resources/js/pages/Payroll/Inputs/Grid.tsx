import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Columns3, Save, Search, Send, Trash2 } from 'lucide-react';
import { type KeyboardEvent, type ReactNode, useMemo, useState } from 'react';
import { ControlTotals } from '@/components/payroll/bulk-input-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import AppLayout from '@/layouts/app-layout';
import { useAuthorization } from '@/lib/authorization';

type PayCode = { id: number; code: string; description: string; type: string };

type Row = {
    employee_id: number;
    staff_number: string;
    full_name: string;
    department: string | null;
    cost_centre: string | null;
    cells: Record<string, number | null>;
    other: Record<string, number>;
};

type Props = {
    period: {
        id: number;
        code: string;
        name: string;
        status: string;
        editable: boolean;
    };
    payCodes: PayCode[];
    columns: PayCode[];
    rows: Row[];
    layouts: Array<{ id: number; name: string; pay_code_ids: number[] }>;
    activeLayoutId: number | null;
    errors: Record<string, string>;
};

const key = (employeeId: number, payCodeId: number) =>
    `${employeeId}:${payCodeId}`;

const money = (value: number) =>
    value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

/**
 * Spreadsheet Input. Type amounts into the grid, then post the changed cells as one
 * batch. Enter moves down a column, so a column of figures can be keyed in quickly.
 */
export default function PayrollInputGrid() {
    const { period, payCodes, columns, rows, layouts, activeLayoutId, errors } =
        usePage<Props>().props;
    const { can } = useAuthorization();
    const editable = period.editable && can('payroll.inputs.manage');

    // Edited values as typed, keyed by employee and pay code. '' means "clear".
    const [edits, setEdits] = useState<Record<string, string>>({});
    const [search, setSearch] = useState('');
    const [columnsOpen, setColumnsOpen] = useState(columns.length === 0);
    const [chosen, setChosen] = useState<number[]>(columns.map((c) => c.id));
    const [layoutOpen, setLayoutOpen] = useState(false);
    const [layoutName, setLayoutName] = useState('');
    const [control, setControl] = useState({
        control_total: '',
        control_count: '',
        accept_mismatch: false,
    });
    const [posting, setPosting] = useState(false);

    const visible = useMemo(() => {
        const term = search.trim().toLowerCase();

        return term === ''
            ? rows
            : rows.filter((row) =>
                  [
                      row.staff_number,
                      row.full_name,
                      row.department,
                      row.cost_centre,
                  ]
                      .filter(Boolean)
                      .some((value) =>
                          String(value).toLowerCase().includes(term),
                      ),
              );
    }, [rows, search]);

    const original = (row: Row, code: PayCode) => row.cells[code.id] ?? null;

    const current = (row: Row, code: PayCode): string => {
        const edit = edits[key(row.employee_id, code.id)];

        if (edit !== undefined) {
            return edit;
        }

        const value = original(row, code);

        return value === null ? '' : String(value);
    };

    const changed = useMemo(
        () =>
            Object.entries(edits).filter(([cellKey, value]) => {
                const [employeeId, payCodeId] = cellKey.split(':').map(Number);
                const row = rows.find((r) => r.employee_id === employeeId);
                const before = row?.cells[payCodeId] ?? null;
                const after = value.trim() === '' ? null : Number(value);

                return before !== after;
            }),
        [edits, rows],
    );

    const columnTotal = (code: PayCode) =>
        rows.reduce((sum, row) => sum + (Number(current(row, code)) || 0), 0);

    const postedTotal = changed.reduce(
        (sum, [, value]) => sum + (Number(value) || 0),
        0,
    );

    const openWith = (params: Record<string, unknown>) =>
        router.get(`/payroll/periods/${period.id}/grid`, params as never, {
            preserveScroll: true,
        });

    const applyColumns = () => {
        setColumnsOpen(false);
        setEdits({});
        openWith({ codes: chosen });
    };

    const post = () => {
        router.post(
            `/payroll/periods/${period.id}/grid`,
            {
                cells: changed.map(([cellKey, value]) => {
                    const [employeeId, payCodeId] = cellKey
                        .split(':')
                        .map(Number);

                    return {
                        employee_id: employeeId,
                        pay_code_id: payCodeId,
                        amount: value.trim() === '' ? null : Number(value),
                    };
                }),
                ...control,
            },
            {
                preserveScroll: true,
                onStart: () => setPosting(true),
                onFinish: () => setPosting(false),
                onSuccess: () => {
                    setEdits({});
                    setControl({
                        control_total: '',
                        control_count: '',
                        accept_mismatch: false,
                    });
                },
            },
        );
    };

    const saveLayout = () =>
        router.post(
            '/payroll/inputs/layouts',
            { name: layoutName, pay_code_ids: columns.map((c) => c.id) },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setLayoutOpen(false);
                    setLayoutName('');
                },
            },
        );

    // Enter moves to the same column on the next row, like a spreadsheet.
    const onKeyDown = (
        event: KeyboardEvent<HTMLInputElement>,
        rowIndex: number,
        columnIndex: number,
    ) => {
        if (event.key !== 'Enter') {
            return;
        }

        event.preventDefault();
        const next = document.querySelector<HTMLInputElement>(
            `[data-cell="${rowIndex + (event.shiftKey ? -1 : 1)}-${columnIndex}"]`,
        );
        next?.focus();
        next?.select();
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Payroll', href: '/payroll' },
                { title: 'Inputs', href: '/payroll/inputs' },
                { title: `${period.code} grid`, href: '#' },
            ]}
        >
            <Head title={`Grid input · ${period.code}`} />

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
                                    Grid input
                                </h1>
                                <Badge
                                    variant="outline"
                                    className="text-[10px] font-bold tracking-widest uppercase"
                                >
                                    {period.code} · {period.status}
                                </Badge>
                            </div>
                            <p className="mt-1 max-w-3xl text-sm font-medium text-muted-foreground">
                                Type amounts for the period, then post the
                                changed cells as one batch. Emptying a cell
                                removes that grid amount. Inputs captured other
                                ways are shown in grey and are not changed.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {layouts.length > 0 && (
                            <Select
                                value={
                                    activeLayoutId ? String(activeLayoutId) : ''
                                }
                                onValueChange={(value) => {
                                    setEdits({});
                                    openWith({ layout: value });
                                }}
                            >
                                <SelectTrigger className="h-10 w-48 bg-background">
                                    <SelectValue placeholder="Load a layout" />
                                </SelectTrigger>
                                <SelectContent>
                                    {layouts.map((layout) => (
                                        <SelectItem
                                            key={layout.id}
                                            value={String(layout.id)}
                                        >
                                            {layout.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                        {activeLayoutId && editable && (
                            <Button
                                variant="outline"
                                size="icon"
                                aria-label="Remove layout"
                                onClick={() =>
                                    router.delete(
                                        `/payroll/inputs/layouts/${activeLayoutId}`,
                                        {
                                            onSuccess: () =>
                                                openWith({
                                                    codes: columns.map(
                                                        (c) => c.id,
                                                    ),
                                                }),
                                        },
                                    )
                                }
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            className="h-10 border-border bg-background font-bold"
                            onClick={() => {
                                setChosen(columns.map((c) => c.id));
                                setColumnsOpen(true);
                            }}
                        >
                            <Columns3 className="mr-2 h-4 w-4" /> Columns
                        </Button>
                        {columns.length > 0 && editable && (
                            <Button
                                variant="outline"
                                className="h-10 border-border bg-background font-bold"
                                onClick={() => setLayoutOpen(true)}
                            >
                                <Save className="mr-2 h-4 w-4" /> Save layout
                            </Button>
                        )}
                    </div>
                </div>

                {!period.editable && (
                    <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-4 text-sm">
                        This period is {period.status.toLowerCase()}, so the
                        grid is read-only.
                    </div>
                )}
                {errors.cells && (
                    <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm font-medium text-destructive">
                        {errors.cells}
                    </div>
                )}

                {columns.length === 0 ? (
                    <Card className="border-border p-10 text-center text-sm text-muted-foreground shadow-sm">
                        Choose the pay codes to show as columns.
                    </Card>
                ) : (
                    <>
                        <div className="relative max-w-sm">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Filter employees, departments, cost centres"
                                className="h-10 bg-background pl-9"
                            />
                        </div>

                        <Card className="overflow-hidden border-border shadow-sm">
                            <div className="max-h-[65vh] overflow-auto">
                                <table className="w-full border-collapse text-sm">
                                    <thead className="sticky top-0 z-10 bg-muted">
                                        <tr>
                                            <Th>Staff no.</Th>
                                            <Th>Employee</Th>
                                            <Th>Department</Th>
                                            <Th>Cost centre</Th>
                                            {columns.map((code) => (
                                                <Th key={code.id} right>
                                                    <span className="block">
                                                        {code.code}
                                                    </span>
                                                    <span className="block text-[10px] font-medium normal-case">
                                                        {code.description}
                                                    </span>
                                                </Th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {visible.map((row, rowIndex) => (
                                            <tr
                                                key={row.employee_id}
                                                className="border-t border-border/60"
                                            >
                                                <Td mono>{row.staff_number}</Td>
                                                <Td>{row.full_name}</Td>
                                                <Td muted>
                                                    {row.department ?? '—'}
                                                </Td>
                                                <Td muted>
                                                    {row.cost_centre ?? '—'}
                                                </Td>
                                                {columns.map(
                                                    (code, columnIndex) => {
                                                        const cellKey = key(
                                                            row.employee_id,
                                                            code.id,
                                                        );
                                                        const value = current(
                                                            row,
                                                            code,
                                                        );
                                                        const isChanged =
                                                            changed.some(
                                                                ([k]) =>
                                                                    k ===
                                                                    cellKey,
                                                            );
                                                        const other =
                                                            row.other[
                                                                code.id
                                                            ] ?? 0;

                                                        return (
                                                            <td
                                                                key={code.id}
                                                                className="px-2 py-1 align-top"
                                                            >
                                                                <input
                                                                    data-cell={`${rowIndex}-${columnIndex}`}
                                                                    type="number"
                                                                    step="0.01"
                                                                    min="0"
                                                                    inputMode="decimal"
                                                                    aria-label={`${code.code} for ${row.full_name}`}
                                                                    disabled={
                                                                        !editable
                                                                    }
                                                                    value={
                                                                        value
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setEdits(
                                                                            (
                                                                                previous,
                                                                            ) => ({
                                                                                ...previous,
                                                                                [cellKey]:
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                            }),
                                                                        )
                                                                    }
                                                                    onKeyDown={(
                                                                        e,
                                                                    ) =>
                                                                        onKeyDown(
                                                                            e,
                                                                            rowIndex,
                                                                            columnIndex,
                                                                        )
                                                                    }
                                                                    className={`h-9 w-28 rounded-md border px-2 text-right font-mono text-sm outline-none focus:ring-2 focus:ring-ring ${isChanged ? 'border-amber-500 bg-amber-500/10' : 'border-border bg-background'}`}
                                                                />
                                                                {other > 0 && (
                                                                    <span className="mt-0.5 block text-right text-[10px] text-muted-foreground">
                                                                        +{' '}
                                                                        {money(
                                                                            other,
                                                                        )}{' '}
                                                                        other
                                                                    </span>
                                                                )}
                                                            </td>
                                                        );
                                                    },
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="sticky bottom-0 bg-muted">
                                        <tr className="border-t border-border">
                                            <Td>
                                                <span className="font-bold">
                                                    Total
                                                </span>
                                            </Td>
                                            <Td muted>
                                                {rows.length} employees
                                            </Td>
                                            <Td />
                                            <Td />
                                            {columns.map((code) => (
                                                <td
                                                    key={code.id}
                                                    className="px-3 py-2 text-right font-mono font-bold"
                                                >
                                                    {money(columnTotal(code))}
                                                </td>
                                            ))}
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </Card>

                        {editable && (
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div className="max-w-xl flex-1">
                                    <ControlTotals
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
                                <div className="flex flex-col items-end gap-2">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {changed.length} changed cell
                                        {changed.length === 1 ? '' : 's'},
                                        totalling {money(postedTotal)}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            disabled={
                                                changed.length === 0 || posting
                                            }
                                            onClick={() => setEdits({})}
                                        >
                                            Discard changes
                                        </Button>
                                        <Button
                                            className="bg-foreground font-bold text-background hover:bg-foreground/90"
                                            disabled={
                                                changed.length === 0 || posting
                                            }
                                            onClick={post}
                                        >
                                            <Send className="mr-2 h-4 w-4" />
                                            Post changes
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <Dialog open={columnsOpen} onOpenChange={setColumnsOpen}>
                <DialogContent className="border-border sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-extrabold">
                            Choose columns
                        </DialogTitle>
                        <DialogDescription>
                            Pay codes HRX calculates itself (basic salary, tax
                            and statutory deductions) are not listed.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid max-h-80 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
                        {payCodes.map((code) => (
                            <label
                                key={code.id}
                                className="flex cursor-pointer items-center gap-2 rounded-md border border-border p-2 text-sm"
                            >
                                <Checkbox
                                    checked={chosen.includes(code.id)}
                                    onCheckedChange={(value) =>
                                        setChosen((previous) =>
                                            value
                                                ? [...previous, code.id]
                                                : previous.filter(
                                                      (id) => id !== code.id,
                                                  ),
                                        )
                                    }
                                />
                                <span>
                                    <span className="font-bold">
                                        {code.code}
                                    </span>{' '}
                                    <span className="text-muted-foreground">
                                        {code.description}
                                    </span>
                                </span>
                            </label>
                        ))}
                    </div>
                    {Object.keys(edits).length > 0 && (
                        <p className="text-xs font-medium text-amber-700">
                            Changing columns discards cells you have not posted.
                        </p>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setColumnsOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={chosen.length === 0}
                            className="bg-foreground font-bold text-background hover:bg-foreground/90"
                            onClick={applyColumns}
                        >
                            Show columns
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={layoutOpen} onOpenChange={setLayoutOpen}>
                <DialogContent className="border-border sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-extrabold">
                            Save layout
                        </DialogTitle>
                        <DialogDescription>
                            Saves these {columns.length} columns so they can be
                            loaded in any period.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                            Name
                        </Label>
                        <Input
                            value={layoutName}
                            placeholder="e.g. Monthly variables"
                            onChange={(e) => setLayoutName(e.target.value)}
                        />
                        {errors.name && (
                            <p className="text-xs font-bold text-destructive">
                                {errors.name}
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setLayoutOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={layoutName.trim() === ''}
                            className="bg-foreground font-bold text-background hover:bg-foreground/90"
                            onClick={saveLayout}
                        >
                            Save layout
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

function Th({
    children,
    right = false,
}: {
    children: ReactNode;
    right?: boolean;
}) {
    return (
        <th
            className={`px-3 py-2 text-[10px] font-bold tracking-widest whitespace-nowrap text-muted-foreground uppercase ${right ? 'text-right' : 'text-left'}`}
        >
            {children}
        </th>
    );
}

function Td({
    children,
    mono = false,
    muted = false,
}: {
    children?: ReactNode;
    mono?: boolean;
    muted?: boolean;
}) {
    return (
        <td
            className={`px-3 py-2 whitespace-nowrap ${mono ? 'font-mono' : ''} ${muted ? 'text-muted-foreground' : 'text-foreground'}`}
        >
            {children}
        </td>
    );
}
