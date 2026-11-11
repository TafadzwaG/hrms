import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    BadgeCheck,
    CircleAlert,
    Copy,
    Pencil,
    Plus,
    Trash2,
} from 'lucide-react';
import { type FormEvent, type ReactNode, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

type Band = {
    lower_bound: number;
    upper_bound: number | null;
    rate_percent: number;
};

type TaxTable = {
    id: number;
    scope: 'SYSTEM' | 'ORGANIZATION';
    name: string;
    currency: string;
    pay_frequency: string;
    effective_from: string | null;
    effective_to: string | null;
    aids_levy_percent: number;
    source: string | null;
    verified_at: string | null;
    bands: Band[];
};

type TaxSetting = {
    id: number;
    scope: 'SYSTEM' | 'ORGANIZATION';
    currency: string;
    effective_from: string | null;
    effective_to: string | null;
    bonus_tax_free_amount: number | null;
    elderly_credit_annual: number | null;
    blind_credit_annual: number | null;
    disabled_credit_annual: number | null;
    medical_credit_percent: number;
    source: string | null;
    verified_at: string | null;
};

type BandInput = { upper_bound: string; rate_percent: string };

type TableForm = {
    name: string;
    currency: string;
    pay_frequency: string;
    effective_from: string;
    effective_to: string;
    aids_levy_percent: string;
    source: string;
    verified: boolean;
    bands: BandInput[];
};

type SettingForm = {
    currency: string;
    effective_from: string;
    effective_to: string;
    bonus_tax_free_amount: string;
    elderly_credit_annual: string;
    blind_credit_annual: string;
    disabled_credit_annual: string;
    medical_credit_percent: string;
    source: string;
    verified: boolean;
};

const money = (value: number | null) =>
    value === null
        ? 'Not entered'
        : value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
          });

const frequencyLabel = (value: string) =>
    value.charAt(0) + value.slice(1).toLowerCase().replace('_', '-');

const text = (value: number | null) => (value === null ? '' : String(value));

export default function PayrollTaxTablesIndex() {
    const { tables, settings, currencies, frequencies, canEditSystem } =
        usePage<{
            tables: TaxTable[];
            settings: TaxSetting[];
            currencies: string[];
            frequencies: string[];
            canEditSystem: boolean;
        }>().props;

    const { can } = useAuthorization();
    const canManage = can('payroll.tax.manage');

    const [tableOpen, setTableOpen] = useState(false);
    const [editingTable, setEditingTable] = useState<TaxTable | null>(null);
    const [settingOpen, setSettingOpen] = useState(false);
    const [editingSetting, setEditingSetting] = useState<TaxSetting | null>(
        null,
    );

    const emptyTable: TableForm = {
        name: '',
        currency: currencies[0] ?? 'USD',
        pay_frequency: 'MONTHLY',
        effective_from: '',
        effective_to: '',
        aids_levy_percent: '3',
        source: '',
        verified: false,
        bands: [{ upper_bound: '', rate_percent: '0' }],
    };

    const tableForm = useForm<TableForm>(emptyTable);

    const settingForm = useForm<SettingForm>({
        currency: currencies[0] ?? 'USD',
        effective_from: '',
        effective_to: '',
        bonus_tax_free_amount: '',
        elderly_credit_annual: '',
        blind_credit_annual: '',
        disabled_credit_annual: '',
        medical_credit_percent: '50',
        source: '',
        verified: false,
    });

    const fillTable = (table: TaxTable, asCopy: boolean) => {
        tableForm.clearErrors();
        tableForm.setData({
            name: asCopy ? `${table.name} (new)` : table.name,
            currency: table.currency,
            pay_frequency: table.pay_frequency,
            effective_from: asCopy ? '' : (table.effective_from ?? ''),
            effective_to: asCopy ? '' : (table.effective_to ?? ''),
            aids_levy_percent: String(table.aids_levy_percent),
            source: asCopy ? '' : (table.source ?? ''),
            verified: asCopy ? false : !!table.verified_at,
            bands: table.bands.map((band) => ({
                upper_bound: text(band.upper_bound),
                rate_percent: String(band.rate_percent),
            })),
        });
        setEditingTable(asCopy ? null : table);
        setTableOpen(true);
    };

    const openCreateTable = () => {
        tableForm.clearErrors();
        tableForm.setData(emptyTable);
        setEditingTable(null);
        setTableOpen(true);
    };

    const submitTable = (event: FormEvent) => {
        event.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => setTableOpen(false),
        };

        if (editingTable) {
            tableForm.put(`/payroll/tax-tables/${editingTable.id}`, options);
        } else {
            tableForm.post('/payroll/tax-tables', options);
        }
    };

    const setBand = (index: number, key: keyof BandInput, value: string) =>
        tableForm.setData(
            'bands',
            tableForm.data.bands.map((band, i) =>
                i === index ? { ...band, [key]: value } : band,
            ),
        );

    const openSetting = (setting: TaxSetting | null) => {
        settingForm.clearErrors();
        settingForm.setData({
            currency: setting?.currency ?? currencies[0] ?? 'USD',
            effective_from: setting?.effective_from ?? '',
            effective_to: setting?.effective_to ?? '',
            bonus_tax_free_amount: text(setting?.bonus_tax_free_amount ?? null),
            elderly_credit_annual: text(setting?.elderly_credit_annual ?? null),
            blind_credit_annual: text(setting?.blind_credit_annual ?? null),
            disabled_credit_annual: text(
                setting?.disabled_credit_annual ?? null,
            ),
            medical_credit_percent: String(
                setting?.medical_credit_percent ?? 50,
            ),
            source: setting?.source ?? '',
            verified: !!setting?.verified_at,
        });
        setEditingSetting(setting);
        setSettingOpen(true);
    };

    const submitSetting = (event: FormEvent) => {
        event.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => setSettingOpen(false),
        };

        if (editingSetting) {
            settingForm.put(
                `/payroll/tax-settings/${editingSetting.id}`,
                options,
            );
        } else {
            settingForm.post('/payroll/tax-settings', options);
        }
    };

    const savesAsOverride = (scope: string | undefined) =>
        scope === 'SYSTEM' && !canEditSystem;

    const unverified =
        tables.filter((table) => !table.verified_at).length +
        settings.filter((setting) => !setting.verified_at).length;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Control Center', href: '/control-center' },
                { title: 'Payroll', href: '/payroll' },
                { title: 'Tax Tables', href: '#' },
            ]}
        >
            <Head title="Payroll Tax Tables" />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-8 bg-muted/5 p-4 md:p-6 lg:p-8 xl:p-12">
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
                                Tax tables and credits
                            </h1>
                            <p className="mt-2 max-w-3xl text-sm leading-relaxed font-medium text-muted-foreground">
                                The figures PAYE is calculated from. Enter them
                                from ZIMRA&apos;s published tables, then mark
                                each one verified. Payroll runs carry a warning
                                while a figure they used is unverified.
                            </p>
                        </div>
                    </div>
                    {canManage && (
                        <Button
                            onClick={openCreateTable}
                            className="h-11 bg-foreground px-6 font-bold text-background shadow-sm hover:bg-foreground/90"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add tax table
                        </Button>
                    )}
                </div>

                {unverified > 0 && (
                    <div className="flex items-start gap-3 rounded-lg border border-amber-500/40 bg-amber-500/5 p-4 text-sm text-foreground">
                        <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                        <p>
                            <span className="font-bold">
                                {unverified} item{unverified === 1 ? '' : 's'}{' '}
                                still to verify.
                            </span>{' '}
                            Check each against ZIMRA&apos;s published figures
                            for the tax year, correct it if needed, and tick
                            &quot;Verified against ZIMRA&quot; when saving.
                        </p>
                    </div>
                )}

                {/* --- Credits and bonus --- */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="text-lg font-extrabold text-foreground">
                            Tax credits and tax-free bonus
                        </h2>
                        {canManage && (
                            <Button
                                variant="outline"
                                className="h-10 border-border bg-background font-bold shadow-sm"
                                onClick={() => openSetting(null)}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add for a new
                                period
                            </Button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                        {settings.map((setting) => (
                            <Card
                                key={setting.id}
                                className="border-border bg-background shadow-sm"
                            >
                                <CardContent className="space-y-4 p-6">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <p className="text-base font-extrabold text-foreground">
                                                {setting.currency} amounts per
                                                tax year
                                            </p>
                                            <p className="mt-1 text-xs font-medium text-muted-foreground">
                                                From {setting.effective_from}
                                                {setting.effective_to
                                                    ? ` to ${setting.effective_to}`
                                                    : ' onward'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <ScopeBadge scope={setting.scope} />
                                            <VerifiedBadge
                                                verifiedAt={setting.verified_at}
                                            />
                                        </div>
                                    </div>
                                    <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                        <Fact
                                            label="Tax-free bonus"
                                            value={money(
                                                setting.bonus_tax_free_amount,
                                            )}
                                        />
                                        <Fact
                                            label="Medical credit"
                                            value={`${setting.medical_credit_percent}% of contributions`}
                                        />
                                        <Fact
                                            label="Elderly credit"
                                            value={money(
                                                setting.elderly_credit_annual,
                                            )}
                                        />
                                        <Fact
                                            label="Blind person credit"
                                            value={money(
                                                setting.blind_credit_annual,
                                            )}
                                        />
                                        <Fact
                                            label="Disabled person credit"
                                            value={money(
                                                setting.disabled_credit_annual,
                                            )}
                                        />
                                    </dl>
                                    {setting.source && (
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Source: {setting.source}
                                        </p>
                                    )}
                                    {canManage && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-border font-bold shadow-sm"
                                            onClick={() => openSetting(setting)}
                                        >
                                            <Pencil className="mr-2 h-3.5 w-3.5" />{' '}
                                            Enter or verify amounts
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* --- Tax tables --- */}
                <section className="space-y-4">
                    <h2 className="text-lg font-extrabold text-foreground">
                        PAYE tax tables
                    </h2>
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                        {tables.map((table) => (
                            <Card
                                key={table.id}
                                className="border-border bg-background shadow-sm"
                            >
                                <CardContent className="space-y-4 p-6">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <p className="text-base font-extrabold text-foreground">
                                                {table.name}
                                            </p>
                                            <p className="mt-1 text-xs font-medium text-muted-foreground">
                                                {table.currency} •{' '}
                                                {frequencyLabel(
                                                    table.pay_frequency,
                                                )}{' '}
                                                • From {table.effective_from}
                                                {table.effective_to
                                                    ? ` to ${table.effective_to}`
                                                    : ' onward'}{' '}
                                                • AIDS Levy{' '}
                                                {table.aids_levy_percent}%
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <ScopeBadge scope={table.scope} />
                                            <VerifiedBadge
                                                verifiedAt={table.verified_at}
                                            />
                                        </div>
                                    </div>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>From</TableHead>
                                                <TableHead>To</TableHead>
                                                <TableHead className="text-right">
                                                    Rate
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {table.bands.map((band) => (
                                                <TableRow
                                                    key={band.lower_bound}
                                                >
                                                    <TableCell className="font-mono text-sm">
                                                        {money(
                                                            band.lower_bound,
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-sm">
                                                        {band.upper_bound ===
                                                        null
                                                            ? 'and above'
                                                            : money(
                                                                  band.upper_bound,
                                                              )}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono text-sm">
                                                        {band.rate_percent}%
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    {table.source && (
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Source: {table.source}
                                        </p>
                                    )}
                                    {canManage && (
                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-border font-bold shadow-sm"
                                                onClick={() =>
                                                    fillTable(table, false)
                                                }
                                            >
                                                <Pencil className="mr-2 h-3.5 w-3.5" />{' '}
                                                Edit or verify
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-border font-bold shadow-sm"
                                                onClick={() =>
                                                    fillTable(table, true)
                                                }
                                            >
                                                <Copy className="mr-2 h-3.5 w-3.5" />{' '}
                                                Copy for a new date
                                            </Button>
                                            {(table.scope === 'ORGANIZATION' ||
                                                canEditSystem) && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-border font-bold text-destructive shadow-sm hover:text-destructive"
                                                    onClick={() =>
                                                        router.delete(
                                                            `/payroll/tax-tables/${table.id}`,
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="mr-2 h-3.5 w-3.5" />{' '}
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            </div>

            {/* --- Tax table dialog --- */}
            <Dialog open={tableOpen} onOpenChange={setTableOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto border-border sm:max-w-2xl">
                    <form onSubmit={submitTable} className="space-y-6">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-extrabold">
                                {editingTable
                                    ? 'Edit tax table'
                                    : 'Add tax table'}
                            </DialogTitle>
                            <DialogDescription>
                                {savesAsOverride(editingTable?.scope)
                                    ? 'This is a system table. Your changes are saved as a table for your organization only, which then takes precedence.'
                                    : 'Bands start at zero and each one begins where the one before it ends.'}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <Field
                                    label="Name"
                                    error={tableForm.errors.name}
                                >
                                    <Input
                                        value={tableForm.data.name}
                                        onChange={(e) =>
                                            tableForm.setData(
                                                'name',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </Field>
                            </div>
                            <Field
                                label="Currency"
                                error={tableForm.errors.currency}
                            >
                                <Select
                                    value={tableForm.data.currency}
                                    onValueChange={(v) =>
                                        tableForm.setData('currency', v)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currencies.map((currency) => (
                                            <SelectItem
                                                key={currency}
                                                value={currency}
                                            >
                                                {currency}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field
                                label="Pay frequency"
                                error={tableForm.errors.pay_frequency}
                            >
                                <Select
                                    value={tableForm.data.pay_frequency}
                                    onValueChange={(v) =>
                                        tableForm.setData('pay_frequency', v)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {frequencies.map((frequency) => (
                                            <SelectItem
                                                key={frequency}
                                                value={frequency}
                                            >
                                                {frequencyLabel(frequency)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field
                                label="Effective from"
                                error={tableForm.errors.effective_from}
                            >
                                <Input
                                    type="date"
                                    value={tableForm.data.effective_from}
                                    onChange={(e) =>
                                        tableForm.setData(
                                            'effective_from',
                                            e.target.value,
                                        )
                                    }
                                />
                            </Field>
                            <Field
                                label="Effective to (optional)"
                                error={tableForm.errors.effective_to}
                            >
                                <Input
                                    type="date"
                                    value={tableForm.data.effective_to}
                                    onChange={(e) =>
                                        tableForm.setData(
                                            'effective_to',
                                            e.target.value,
                                        )
                                    }
                                />
                            </Field>
                            <Field
                                label="AIDS Levy (% of PAYE)"
                                error={tableForm.errors.aids_levy_percent}
                            >
                                <Input
                                    type="number"
                                    step="0.001"
                                    min="0"
                                    value={tableForm.data.aids_levy_percent}
                                    onChange={(e) =>
                                        tableForm.setData(
                                            'aids_levy_percent',
                                            e.target.value,
                                        )
                                    }
                                />
                            </Field>
                            <Field
                                label="Source"
                                error={tableForm.errors.source}
                            >
                                <Input
                                    value={tableForm.data.source}
                                    placeholder="e.g. ZIMRA USD tax tables Jan-Dec 2027"
                                    onChange={(e) =>
                                        tableForm.setData(
                                            'source',
                                            e.target.value,
                                        )
                                    }
                                />
                            </Field>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                Bands
                            </Label>
                            {tableForm.data.bands.map((band, index) => {
                                const isLast =
                                    index === tableForm.data.bands.length - 1;
                                const from =
                                    index === 0
                                        ? '0'
                                        : tableForm.data.bands[index - 1]
                                              .upper_bound || '?';

                                return (
                                    <div
                                        key={index}
                                        className="grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-3"
                                    >
                                        <Field label="From">
                                            <Input value={from} disabled />
                                        </Field>
                                        <Field label="Up to">
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={
                                                    isLast
                                                        ? ''
                                                        : band.upper_bound
                                                }
                                                placeholder={
                                                    isLast ? 'and above' : ''
                                                }
                                                disabled={isLast}
                                                onChange={(e) =>
                                                    setBand(
                                                        index,
                                                        'upper_bound',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </Field>
                                        <Field label="Rate %">
                                            <Input
                                                type="number"
                                                step="0.001"
                                                min="0"
                                                max="100"
                                                value={band.rate_percent}
                                                onChange={(e) =>
                                                    setBand(
                                                        index,
                                                        'rate_percent',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </Field>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            aria-label="Remove band"
                                            disabled={
                                                tableForm.data.bands.length ===
                                                1
                                            }
                                            onClick={() =>
                                                tableForm.setData(
                                                    'bands',
                                                    tableForm.data.bands.filter(
                                                        (_, i) => i !== index,
                                                    ),
                                                )
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                );
                            })}
                            {tableForm.errors.bands && (
                                <p className="text-xs font-bold text-destructive">
                                    {tableForm.errors.bands}
                                </p>
                            )}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="border-border font-bold"
                                onClick={() =>
                                    tableForm.setData('bands', [
                                        ...tableForm.data.bands,
                                        { upper_bound: '', rate_percent: '' },
                                    ])
                                }
                            >
                                <Plus className="mr-2 h-3.5 w-3.5" /> Add band
                            </Button>
                        </div>

                        <VerifyBox
                            checked={tableForm.data.verified}
                            onChange={(checked) =>
                                tableForm.setData('verified', checked)
                            }
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setTableOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={tableForm.processing}
                                className="bg-foreground font-bold text-background hover:bg-foreground/90"
                            >
                                Save tax table
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* --- Credits dialog --- */}
            <Dialog open={settingOpen} onOpenChange={setSettingOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto border-border sm:max-w-2xl">
                    <form onSubmit={submitSetting} className="space-y-6">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-extrabold">
                                Tax credits and tax-free bonus
                            </DialogTitle>
                            <DialogDescription>
                                {savesAsOverride(editingSetting?.scope)
                                    ? 'These are system amounts. Your changes are saved for your organization only, and then take precedence.'
                                    : 'Amounts are per tax year. Leave an amount empty if it does not apply; nothing is deducted for an empty amount.'}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field
                                label="Currency"
                                error={settingForm.errors.currency}
                            >
                                <Select
                                    value={settingForm.data.currency}
                                    onValueChange={(v) =>
                                        settingForm.setData('currency', v)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currencies.map((currency) => (
                                            <SelectItem
                                                key={currency}
                                                value={currency}
                                            >
                                                {currency}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field
                                label="Medical credit (% of contributions)"
                                error={
                                    settingForm.errors.medical_credit_percent
                                }
                            >
                                <Input
                                    type="number"
                                    step="0.001"
                                    min="0"
                                    max="100"
                                    value={
                                        settingForm.data.medical_credit_percent
                                    }
                                    onChange={(e) =>
                                        settingForm.setData(
                                            'medical_credit_percent',
                                            e.target.value,
                                        )
                                    }
                                />
                            </Field>
                            <Field
                                label="Effective from"
                                error={settingForm.errors.effective_from}
                            >
                                <Input
                                    type="date"
                                    value={settingForm.data.effective_from}
                                    onChange={(e) =>
                                        settingForm.setData(
                                            'effective_from',
                                            e.target.value,
                                        )
                                    }
                                />
                            </Field>
                            <Field
                                label="Effective to (optional)"
                                error={settingForm.errors.effective_to}
                            >
                                <Input
                                    type="date"
                                    value={settingForm.data.effective_to}
                                    onChange={(e) =>
                                        settingForm.setData(
                                            'effective_to',
                                            e.target.value,
                                        )
                                    }
                                />
                            </Field>
                            <AmountField
                                label="Tax-free bonus per year"
                                value={settingForm.data.bonus_tax_free_amount}
                                error={settingForm.errors.bonus_tax_free_amount}
                                onChange={(v) =>
                                    settingForm.setData(
                                        'bonus_tax_free_amount',
                                        v,
                                    )
                                }
                            />
                            <AmountField
                                label="Elderly credit per year"
                                value={settingForm.data.elderly_credit_annual}
                                error={settingForm.errors.elderly_credit_annual}
                                onChange={(v) =>
                                    settingForm.setData(
                                        'elderly_credit_annual',
                                        v,
                                    )
                                }
                            />
                            <AmountField
                                label="Blind person credit per year"
                                value={settingForm.data.blind_credit_annual}
                                error={settingForm.errors.blind_credit_annual}
                                onChange={(v) =>
                                    settingForm.setData(
                                        'blind_credit_annual',
                                        v,
                                    )
                                }
                            />
                            <AmountField
                                label="Disabled person credit per year"
                                value={settingForm.data.disabled_credit_annual}
                                error={
                                    settingForm.errors.disabled_credit_annual
                                }
                                onChange={(v) =>
                                    settingForm.setData(
                                        'disabled_credit_annual',
                                        v,
                                    )
                                }
                            />
                            <div className="sm:col-span-2">
                                <Field
                                    label="Source"
                                    error={settingForm.errors.source}
                                >
                                    <Input
                                        value={settingForm.data.source}
                                        placeholder="e.g. Finance Act 2027, ZIMRA public notice"
                                        onChange={(e) =>
                                            settingForm.setData(
                                                'source',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </Field>
                            </div>
                        </div>

                        <VerifyBox
                            checked={settingForm.data.verified}
                            onChange={(checked) =>
                                settingForm.setData('verified', checked)
                            }
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setSettingOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={settingForm.processing}
                                className="bg-foreground font-bold text-background hover:bg-foreground/90"
                            >
                                Save amounts
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
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
            <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                {label}
            </Label>
            {children}
            {error && (
                <p className="text-xs font-bold text-destructive">{error}</p>
            )}
        </div>
    );
}

function AmountField({
    label,
    value,
    error,
    onChange,
}: {
    label: string;
    value: string;
    error?: string;
    onChange: (value: string) => void;
}) {
    return (
        <Field label={label} error={error}>
            <Input
                type="number"
                step="0.01"
                min="0"
                value={value}
                placeholder="Not entered"
                onChange={(e) => onChange(e.target.value)}
            />
        </Field>
    );
}

function Fact({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                {label}
            </dt>
            <dd
                className={`mt-1 font-mono text-sm ${value === 'Not entered' ? 'text-amber-600' : 'text-foreground'}`}
            >
                {value}
            </dd>
        </div>
    );
}

function ScopeBadge({ scope }: { scope: string }) {
    return (
        <Badge
            variant="outline"
            className="border-border px-2 py-0.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase shadow-none"
        >
            {scope === 'SYSTEM' ? 'System' : 'Your organization'}
        </Badge>
    );
}

function VerifiedBadge({ verifiedAt }: { verifiedAt: string | null }) {
    return verifiedAt ? (
        <Badge
            variant="outline"
            className="border-emerald-600/40 bg-emerald-600/5 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-700 uppercase shadow-none"
        >
            <BadgeCheck className="mr-1 h-3 w-3" /> Verified
        </Badge>
    ) : (
        <Badge
            variant="outline"
            className="border-amber-500/40 bg-amber-500/5 px-2 py-0.5 text-[10px] font-bold tracking-widest text-amber-700 uppercase shadow-none"
        >
            <CircleAlert className="mr-1 h-3 w-3" /> Unverified
        </Badge>
    );
}

function VerifyBox({
    checked,
    onChange,
}: {
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-muted/10 p-4">
            <Checkbox
                checked={checked}
                onCheckedChange={(value) => onChange(!!value)}
                className="mt-0.5"
            />
            <span>
                <span className="block text-sm font-bold text-foreground">
                    Verified against ZIMRA
                </span>
                <span className="block text-xs font-medium text-muted-foreground">
                    Tick only after checking these figures against ZIMRA&apos;s
                    published figures for this period. Your name and the time
                    are recorded.
                </span>
            </span>
        </label>
    );
}
