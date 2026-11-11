import { useForm } from '@inertiajs/react';
import { Users } from 'lucide-react';
import { type FormEvent, type ReactNode, useMemo } from 'react';
import { Button } from '@/components/ui/button';
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

export type BulkEmployee = {
    id: number;
    staff_number: string;
    full_name: string;
    org_unit_id: number | null;
    cost_centre: string | null;
};

type Option = { id: number; label: string };

type BulkForm = {
    payroll_period_id: string;
    pay_code_id: string;
    action: 'INSERT' | 'DELETE';
    input_mode: 'FIXED' | 'RATE_X_QTY';
    amount: string;
    quantity: string;
    rate: string;
    reference: string;
    notes: string;
    scope: 'ALL' | 'DEPARTMENTS' | 'COST_CENTRES';
    org_unit_ids: number[];
    cost_centres: string[];
    control_total: string;
    control_count: string;
    accept_mismatch: boolean;
};

/**
 * Bulk Input: add one pay code to, or remove it from, every employee in a group.
 * The count shown is an estimate from the employee list; the server applies the
 * selection to the employees who are in the period's payroll.
 */
export function BulkInputDialog({
    open,
    onOpenChange,
    periods,
    payCodes,
    employees,
    orgUnits,
    costCentres,
    defaultPeriodId,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    periods: Array<{ id: number; code: string; status: string }>;
    payCodes: Array<{ id: number; code: string; description: string }>;
    employees: BulkEmployee[];
    orgUnits: Array<{ id: number; name: string }>;
    costCentres: string[];
    defaultPeriodId: string;
}) {
    const form = useForm<BulkForm>({
        payroll_period_id: defaultPeriodId,
        pay_code_id: '',
        action: 'INSERT',
        input_mode: 'FIXED',
        amount: '',
        quantity: '',
        rate: '',
        reference: '',
        notes: '',
        scope: 'ALL',
        org_unit_ids: [],
        cost_centres: [],
        control_total: '',
        control_count: '',
        accept_mismatch: false,
    });

    const openPeriods = periods.filter(
        (period) => !['APPROVED', 'CLOSED'].includes(period.status),
    );

    const matched = useMemo(
        () =>
            employees.filter((employee) => {
                if (form.data.scope === 'DEPARTMENTS') {
                    return form.data.org_unit_ids.includes(
                        Number(employee.org_unit_id),
                    );
                }

                if (form.data.scope === 'COST_CENTRES') {
                    return form.data.cost_centres.includes(
                        String(employee.cost_centre ?? ''),
                    );
                }

                return true;
            }).length,
        [
            employees,
            form.data.scope,
            form.data.org_unit_ids,
            form.data.cost_centres,
        ],
    );

    const units: Option[] = orgUnits.map((unit) => ({
        id: unit.id,
        label: unit.name,
    }));

    const toggle = <T,>(list: T[], value: T) =>
        list.includes(value)
            ? list.filter((item) => item !== value)
            : [...list, value];

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.transform((data) => ({
            ...data,
            org_unit_ids: data.scope === 'DEPARTMENTS' ? data.org_unit_ids : [],
            cost_centres:
                data.scope === 'COST_CENTRES' ? data.cost_centres : [],
        }));
        form.post('/payroll/inputs/bulk', {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
                form.reset();
            },
        });
    };

    const isInsert = form.data.action === 'INSERT';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto border-border sm:max-w-2xl">
                <form onSubmit={submit} className="space-y-6">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-extrabold">
                            <Users className="h-5 w-5 text-muted-foreground" />
                            Bulk input
                        </DialogTitle>
                        <DialogDescription>
                            Add one pay code to, or remove it from, everyone in
                            a department, a cost centre, or the whole payroll.
                            Posted as one batch you can reverse.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field
                            label="Payroll period"
                            error={form.errors.payroll_period_id}
                        >
                            <Select
                                value={form.data.payroll_period_id}
                                onValueChange={(value) =>
                                    form.setData('payroll_period_id', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an open period" />
                                </SelectTrigger>
                                <SelectContent>
                                    {openPeriods.map((period) => (
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
                        <Field label="Action" error={form.errors.action}>
                            <Select
                                value={form.data.action}
                                onValueChange={(value) =>
                                    form.setData(
                                        'action',
                                        value as BulkForm['action'],
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="INSERT">
                                        Add to each employee
                                    </SelectItem>
                                    <SelectItem value="DELETE">
                                        Remove from each employee
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
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
                        <Field
                            label={
                                isInsert
                                    ? 'Reference'
                                    : 'Only remove inputs with reference'
                            }
                            error={form.errors.reference}
                        >
                            <Input
                                value={form.data.reference}
                                placeholder={
                                    isInsert
                                        ? 'Defaults to BULK-<code>'
                                        : 'Leave empty to remove all'
                                }
                                onChange={(e) =>
                                    form.setData('reference', e.target.value)
                                }
                            />
                        </Field>

                        {isInsert && (
                            <>
                                <Field
                                    label="Value"
                                    error={form.errors.input_mode}
                                >
                                    <Select
                                        value={form.data.input_mode}
                                        onValueChange={(value) =>
                                            form.setData(
                                                'input_mode',
                                                value as BulkForm['input_mode'],
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
                                    <Field
                                        label="Amount per employee"
                                        error={form.errors.amount}
                                    >
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={form.data.amount}
                                            onChange={(e) =>
                                                form.setData(
                                                    'amount',
                                                    e.target.value,
                                                )
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
                                        <Field
                                            label="Rate"
                                            error={form.errors.rate}
                                        >
                                            <Input
                                                type="number"
                                                step="0.0001"
                                                min="0"
                                                value={form.data.rate}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'rate',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </Field>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="space-y-3">
                        <Field
                            label="Who it applies to"
                            error={form.errors.org_unit_ids}
                        >
                            <Select
                                value={form.data.scope}
                                onValueChange={(value) =>
                                    form.setData(
                                        'scope',
                                        value as BulkForm['scope'],
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">
                                        Everyone in the period&apos;s payroll
                                    </SelectItem>
                                    <SelectItem value="DEPARTMENTS">
                                        Selected departments
                                    </SelectItem>
                                    <SelectItem value="COST_CENTRES">
                                        Selected cost centres
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>

                        {form.data.scope === 'DEPARTMENTS' && (
                            <CheckList
                                options={units}
                                selected={form.data.org_unit_ids}
                                onToggle={(id) =>
                                    form.setData(
                                        'org_unit_ids',
                                        toggle(form.data.org_unit_ids, id),
                                    )
                                }
                            />
                        )}

                        {form.data.scope === 'COST_CENTRES' && (
                            <div className="grid max-h-40 grid-cols-2 gap-2 overflow-y-auto rounded-lg border border-border p-3">
                                {costCentres.length === 0 && (
                                    <p className="col-span-2 text-xs text-muted-foreground">
                                        No cost centres are set on payroll
                                        profiles.
                                    </p>
                                )}
                                {costCentres.map((centre) => (
                                    <label
                                        key={centre}
                                        className="flex cursor-pointer items-center gap-2 text-sm"
                                    >
                                        <Checkbox
                                            checked={form.data.cost_centres.includes(
                                                centre,
                                            )}
                                            onCheckedChange={() =>
                                                form.setData(
                                                    'cost_centres',
                                                    toggle(
                                                        form.data.cost_centres,
                                                        centre,
                                                    ),
                                                )
                                            }
                                        />
                                        {centre}
                                    </label>
                                ))}
                            </div>
                        )}

                        <p className="text-sm font-medium text-muted-foreground">
                            About{' '}
                            <span className="font-bold text-foreground">
                                {matched}
                            </span>{' '}
                            employee{matched === 1 ? '' : 's'} selected. Only
                            employees with an active payroll profile for the
                            period are included.
                        </p>
                    </div>

                    <ControlTotals
                        total={form.data.control_total}
                        count={form.data.control_count}
                        accept={form.data.accept_mismatch}
                        error={form.errors.control_total}
                        onChange={(key, value) =>
                            form.setData(key as keyof BulkForm, value as never)
                        }
                    />

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={form.processing}
                            className="bg-foreground font-bold text-background hover:bg-foreground/90"
                        >
                            {isInsert ? 'Add for group' : 'Remove for group'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

/**
 * Optional batch control totals. When filled in, nothing is posted unless the batch
 * matches them, or the user ticks the box to post anyway.
 */
export function ControlTotals({
    total,
    count,
    accept,
    error,
    onChange,
}: {
    total: string;
    count: string;
    accept: boolean;
    error?: string;
    onChange: (
        key: 'control_total' | 'control_count' | 'accept_mismatch',
        value: string | boolean,
    ) => void;
}) {
    return (
        <div className="space-y-3 rounded-lg border border-border bg-muted/10 p-4">
            <div>
                <p className="text-sm font-bold text-foreground">
                    Control totals (optional)
                </p>
                <p className="text-xs font-medium text-muted-foreground">
                    The total amount and number of rows you expect. If the batch
                    does not match, nothing is posted.
                </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <Field label="Expected total amount">
                    <Input
                        type="number"
                        step="0.01"
                        value={total}
                        onChange={(e) =>
                            onChange('control_total', e.target.value)
                        }
                    />
                </Field>
                <Field label="Expected number of rows">
                    <Input
                        type="number"
                        min="0"
                        value={count}
                        onChange={(e) =>
                            onChange('control_count', e.target.value)
                        }
                    />
                </Field>
            </div>
            {error && (
                <p className="text-xs font-bold text-destructive">{error}</p>
            )}
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
                <Checkbox
                    checked={accept}
                    onCheckedChange={(value) =>
                        onChange('accept_mismatch', !!value)
                    }
                />
                Post even if totals differ
            </label>
        </div>
    );
}

function CheckList({
    options,
    selected,
    onToggle,
}: {
    options: Option[];
    selected: number[];
    onToggle: (id: number) => void;
}) {
    return (
        <div className="grid max-h-40 grid-cols-2 gap-2 overflow-y-auto rounded-lg border border-border p-3">
            {options.map((option) => (
                <label
                    key={option.id}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                >
                    <Checkbox
                        checked={selected.includes(option.id)}
                        onCheckedChange={() => onToggle(option.id)}
                    />
                    {option.label}
                </label>
            ))}
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
