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
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Database,
    Layers,
    Lock,
    Pencil,
    Plus,
    Search,
    SlidersHorizontal,
    Trash2,
    TrendingDown,
    TrendingUp,
} from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

type PayCodeRow = {
    id: number;
    code: string;
    description: string;
    category: string;
    type: string;
    taxable: boolean;
    recurring: boolean;
    affects_gross: boolean;
    affects_net: boolean;
    is_pre_tax: boolean;
    active: boolean;
    system_generated: boolean;
    gl_account_code: string | null;
    sort_order: number;
};

type PaginatedPayCodes = {
    data: PayCodeRow[];
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
};

export default function PayrollPayCodesIndex() {
    const { payCodes, filters, stats, defaults, categories, types } = usePage<{
        payCodes: PaginatedPayCodes;
        filters: { search?: string; type?: string; state?: string };
        stats: {
            total: number;
            earnings: number;
            deductions: number;
            system_generated: number;
        };
        defaults: PayCodeRow;
        categories: string[];
        types: string[];
    }>().props;

    const { can } = useAuthorization();
    const [search, setSearch] = useState(filters.search ?? '');
    const [type, setType] = useState(filters.type ?? 'all');
    const [state, setState] = useState(filters.state ?? 'all');

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<PayCodeRow | null>(null);
    const form = useForm(defaults);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            router.get(
                '/payroll/pay-codes',
                {
                    search,
                    type: type === 'all' ? '' : type,
                    state: state === 'all' ? '' : state,
                },
                { preserveState: true, replace: true, preserveScroll: true },
            );
        }, 250);

        return () => window.clearTimeout(timer);
    }, [search, type, state]);

    const handlePageChange = (selectedItem: { selected: number }) => {
        router.get(
            '/payroll/pay-codes',
            {
                page: selectedItem.selected + 1,
                search,
                type: type === 'all' ? '' : type,
                state: state === 'all' ? '' : state,
            },
            { preserveScroll: true, preserveState: true },
        );
    };

    const openCreate = () => {
        setEditing(null);
        form.setData(defaults);
        setOpen(true);
    };

    const openEdit = (payCode: PayCodeRow) => {
        setEditing(payCode);
        form.setData({ ...payCode });
        setOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = editing
            ? `/payroll/pay-codes/${editing.id}`
            : '/payroll/pay-codes';
        const method = editing ? form.put : form.post;

        method(url, {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                setEditing(null);
            },
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Control Center', href: '/control-center' },
                { title: 'Payroll', href: '/payroll' },
                { title: 'Pay Codes', href: '#' },
            ]}
        >
            <Head title="Payroll Pay Codes" />

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
                                Pay codes
                            </h1>
                            <p className="mt-2 max-w-3xl text-sm leading-relaxed font-medium text-muted-foreground">
                                Configure earnings, deductions, tax flags, and
                                general ledger references used during payroll
                                processing.
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                        {can('payroll.paycodes.manage') && (
                            <Button
                                onClick={openCreate}
                                className="h-11 bg-foreground px-6 font-bold text-background shadow-sm hover:bg-foreground/90"
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add pay code
                            </Button>
                        )}
                    </div>
                </div>

                {/* Top Metrics Row */}
                <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4">
                    <MiniStat
                        label="Total Active Codes"
                        value={stats.total}
                        icon={Layers}
                    />
                    <MiniStat
                        label="Earning Codes"
                        value={stats.earnings}
                        icon={TrendingUp}
                    />
                    <MiniStat
                        label="Deduction Codes"
                        value={stats.deductions}
                        icon={TrendingDown}
                    />
                    <MiniStat
                        label="System Managed"
                        value={stats.system_generated}
                        icon={Lock}
                    />
                </div>

                {/* Main Directory Card */}
                <Card className="flex w-full flex-col overflow-hidden border-border bg-background shadow-sm">
                    {/* Toolbar Section */}
                    <div className="flex shrink-0 flex-col justify-between gap-4 border-b border-border/50 p-4 sm:flex-row sm:items-center md:p-6">
                        <div className="flex items-center gap-4">
                            <h2 className="text-base font-bold text-foreground">
                                Payroll code catalogue
                            </h2>
                        </div>

                        <div className="flex w-full items-center gap-3 sm:w-auto">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search pay codes..."
                                    className="h-10 w-full border-border/50 bg-background pl-9 text-sm shadow-sm"
                                />
                            </div>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger className="h-10 w-full border-border/50 bg-background text-sm font-medium shadow-sm sm:w-36">
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Types
                                    </SelectItem>
                                    {types.map((item) => (
                                        <SelectItem key={item} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={state} onValueChange={setState}>
                                <SelectTrigger className="h-10 w-full border-border/50 bg-background text-sm font-medium shadow-sm sm:w-36">
                                    <SelectValue placeholder="All States" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All States
                                    </SelectItem>
                                    <SelectItem value="active">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="inactive">
                                        Inactive
                                    </SelectItem>
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
                                        Code & Description
                                    </TableHead>
                                    <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Type
                                    </TableHead>
                                    <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Category
                                    </TableHead>
                                    <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Taxable
                                    </TableHead>
                                    <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Recurring
                                    </TableHead>
                                    <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        State
                                    </TableHead>
                                    <TableHead className="pr-6 text-right text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payCodes.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="h-48 text-center text-sm font-medium text-muted-foreground"
                                        >
                                            No pay codes found for the current
                                            filters.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    payCodes.data.map((payCode) => (
                                        <TableRow
                                            key={payCode.id}
                                            className="transition-colors hover:bg-muted/30"
                                        >
                                            <TableCell className="py-4 pl-6">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-foreground">
                                                        {payCode.code}
                                                    </p>
                                                    <p className="text-xs font-medium text-muted-foreground">
                                                        {payCode.description}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className="border border-border bg-muted px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-foreground uppercase shadow-none"
                                                >
                                                    {payCode.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm font-bold text-foreground">
                                                {payCode.category}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase shadow-none ${payCode.taxable ? 'border-foreground bg-muted/30 text-foreground' : 'border-transparent bg-muted text-muted-foreground'}`}
                                                >
                                                    {payCode.taxable
                                                        ? 'Yes'
                                                        : 'No'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase shadow-none ${payCode.recurring ? 'border-foreground bg-muted/30 text-foreground' : 'border-transparent bg-muted text-muted-foreground'}`}
                                                >
                                                    {payCode.recurring
                                                        ? 'Yes'
                                                        : 'No'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                                                    <div
                                                        className={`h-2 w-2 rounded-full ${payCode.active ? 'bg-foreground' : 'bg-muted-foreground/30'}`}
                                                    />
                                                    {payCode.active
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </div>
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    {can(
                                                        'payroll.paycodes.manage',
                                                    ) && (
                                                        <>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                                onClick={() =>
                                                                    openEdit(
                                                                        payCode,
                                                                    )
                                                                }
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className={`h-8 w-8 ${payCode.system_generated ? 'cursor-not-allowed text-muted-foreground opacity-30' : 'text-muted-foreground hover:bg-destructive/10 hover:text-destructive'}`}
                                                                disabled={
                                                                    payCode.system_generated
                                                                }
                                                                onClick={() => {
                                                                    if (
                                                                        confirm(
                                                                            `Are you sure you want to delete ${payCode.code}?`,
                                                                        )
                                                                    ) {
                                                                        router.delete(
                                                                            `/payroll/pay-codes/${payCode.id}`,
                                                                            {
                                                                                preserveScroll: true,
                                                                            },
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {payCodes.last_page > 1 && (
                        <div className="flex shrink-0 flex-col items-center justify-between gap-4 border-t border-border/50 bg-muted/5 p-4 sm:flex-row">
                            <span className="text-xs font-bold text-muted-foreground">
                                Page {payCodes.current_page} of{' '}
                                {payCodes.last_page}
                            </span>
                            <ReactPaginate
                                pageCount={payCodes.last_page}
                                forcePage={payCodes.current_page - 1}
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

            {/* --- Wide Dialog for Adding / Editing Pay Codes --- */}
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
                                            ? 'Edit pay code'
                                            : 'Add pay code'}
                                    </DialogTitle>
                                    <DialogDescription className="mt-1 text-sm font-medium text-muted-foreground">
                                        Configure how this code behaves during
                                        the payroll run and where it maps in the
                                        general ledger.
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        {/* Wide Layout: Arranged horizontally with General Info on top, Config Flags below */}
                        <div className="flex flex-1 flex-col gap-10 overflow-y-auto p-6 md:p-8">
                            {/* Top Section: General Information */}
                            <div className="space-y-6">
                                <h3 className="border-b border-border/50 pb-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                    General Information
                                </h3>

                                {/* 4 Column Grid to maximize width efficiency */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                                    <div className="md:col-span-1">
                                        <Field
                                            label="Code"
                                            error={form.errors.code}
                                        >
                                            <Input
                                                value={form.data.code}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'code',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-11 bg-background font-mono text-sm uppercase shadow-sm"
                                                disabled={
                                                    editing?.system_generated
                                                }
                                            />
                                        </Field>
                                    </div>
                                    <div className="md:col-span-2">
                                        <Field
                                            label="Description"
                                            error={form.errors.description}
                                        >
                                            <Input
                                                value={form.data.description}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'description',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-11 bg-background text-sm shadow-sm"
                                                disabled={
                                                    editing?.system_generated
                                                }
                                            />
                                        </Field>
                                    </div>
                                    <div className="md:col-span-1">
                                        <Field
                                            label="Type"
                                            error={form.errors.type}
                                        >
                                            <Select
                                                value={form.data.type}
                                                onValueChange={(value) =>
                                                    form.setData('type', value)
                                                }
                                                disabled={
                                                    editing?.system_generated
                                                }
                                            >
                                                <SelectTrigger className="h-11 bg-background text-sm shadow-sm">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {types.map((item) => (
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
                                    </div>

                                    <div className="md:col-span-2">
                                        <Field
                                            label="Category"
                                            error={form.errors.category}
                                        >
                                            <Select
                                                value={form.data.category}
                                                onValueChange={(value) =>
                                                    form.setData(
                                                        'category',
                                                        value,
                                                    )
                                                }
                                                disabled={
                                                    editing?.system_generated
                                                }
                                            >
                                                <SelectTrigger className="h-11 bg-background text-sm shadow-sm">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((item) => (
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
                                    </div>
                                    <div className="md:col-span-1">
                                        <Field
                                            label="GL Account Code"
                                            error={form.errors.gl_account_code}
                                        >
                                            <Input
                                                value={
                                                    form.data.gl_account_code ??
                                                    ''
                                                }
                                                onChange={(e) =>
                                                    form.setData(
                                                        'gl_account_code',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-11 bg-background font-mono text-sm shadow-sm"
                                            />
                                        </Field>
                                    </div>
                                    <div className="md:col-span-1">
                                        <Field
                                            label="Sort Order"
                                            error={form.errors.sort_order}
                                        >
                                            <Input
                                                type="number"
                                                value={form.data.sort_order}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'sort_order',
                                                        Number(e.target.value),
                                                    )
                                                }
                                                className="h-11 bg-background text-sm shadow-sm"
                                            />
                                        </Field>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Section: Configuration Flags */}
                            <div className="space-y-6">
                                <h3 className="border-b border-border/50 pb-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                    Configuration Flags
                                </h3>

                                {/* 3 Column Grid for Checkboxes */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <CheckField
                                        label="Active"
                                        description="Is this code currently available for use?"
                                        checked={form.data.active}
                                        onCheckedChange={(checked) =>
                                            form.setData('active', !!checked)
                                        }
                                    />
                                    <CheckField
                                        label="Taxable"
                                        description="Subject to statutory tax deductions."
                                        checked={form.data.taxable}
                                        onCheckedChange={(checked) =>
                                            form.setData('taxable', !!checked)
                                        }
                                        disabled={editing?.system_generated}
                                    />
                                    <CheckField
                                        label="Recurring"
                                        description="Automatically rolls over to next periods."
                                        checked={form.data.recurring}
                                        onCheckedChange={(checked) =>
                                            form.setData('recurring', !!checked)
                                        }
                                    />
                                    <CheckField
                                        label="Affects Gross Pay"
                                        description="Included in the gross salary calculation."
                                        checked={form.data.affects_gross}
                                        onCheckedChange={(checked) =>
                                            form.setData(
                                                'affects_gross',
                                                !!checked,
                                            )
                                        }
                                        disabled={editing?.system_generated}
                                    />
                                    <CheckField
                                        label="Affects Net Pay"
                                        description="Directly adds or subtracts from final cash."
                                        checked={form.data.affects_net}
                                        onCheckedChange={(checked) =>
                                            form.setData(
                                                'affects_net',
                                                !!checked,
                                            )
                                        }
                                        disabled={editing?.system_generated}
                                    />
                                    <CheckField
                                        label="Pre-tax Deduction"
                                        description="Deducted before tax calculation."
                                        checked={form.data.is_pre_tax}
                                        onCheckedChange={(checked) =>
                                            form.setData(
                                                'is_pre_tax',
                                                !!checked,
                                            )
                                        }
                                        disabled={editing?.system_generated}
                                    />
                                </div>

                                {editing?.system_generated && (
                                    <div className="rounded-lg border border-border bg-muted/20 p-4 text-xs font-medium text-muted-foreground">
                                        Note: Core configuration flags cannot be
                                        altered on system-generated pay codes to
                                        preserve calculation integrity.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Standard Action Buttons mapped into the DialogFooter */}
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
                                {editing ? 'Save changes' : 'Create pay code'}
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
            <Label className="text-xs font-bold tracking-widest text-foreground text-muted-foreground uppercase">
                {label}
            </Label>
            {children}
            {error && (
                <p className="text-xs font-bold text-destructive">{error}</p>
            )}
        </div>
    );
}

function CheckField({
    label,
    description,
    checked,
    onCheckedChange,
    disabled = false,
}: {
    label: string;
    description: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
}) {
    return (
        <label
            className={`flex h-full cursor-pointer items-start gap-4 rounded-xl border p-4 transition-colors ${disabled ? 'cursor-not-allowed border-border/50 bg-muted/5 opacity-50' : checked ? 'border-foreground/30 bg-muted/10' : 'border-border bg-background hover:bg-muted/5'}`}
        >
            <Checkbox
                checked={checked}
                onCheckedChange={onCheckedChange}
                disabled={disabled}
                className="mt-0.5 shrink-0 border-border/50 data-[state=checked]:bg-foreground data-[state=checked]:text-background"
            />
            <div className="space-y-1">
                <p className="text-sm leading-none font-bold text-foreground">
                    {label}
                </p>
                <p className="text-xs leading-snug font-medium text-muted-foreground">
                    {description}
                </p>
            </div>
        </label>
    );
}
