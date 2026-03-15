import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { useAuthorization } from '@/lib/authorization';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowRightLeft,
    Banknote,
    Calculator,
    CheckCircle2,
    ChevronRight,
    CircleDollarSign,
    Download,
    Edit,
    Filter,
    Fingerprint,
    History,
    Info,
    Landmark,
    List,
    Lock,
    Pencil,
    PlayCircle,
    Plus,
    RotateCcw,
    Search,
    Trash2,
    TrendingUp,
    Wallet,
} from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';

// --- Types ---
type ResultSettlement = {
    id: number;
    currency: string;
    settlement_amount: number;
    base_amount: number;
    exchange_rate: number | null;
    allocation_method: string;
};
type ResultRow = {
    id: number;
    employee_id: number;
    staff_number: string;
    employee_name: string;
    currency: string;
    department: string | null;
    position: string | null;
    gross_pay: number;
    tax_amount: number;
    total_deductions: number;
    net_pay: number;
    status: string;
    line_count: number;
    settlements: ResultSettlement[];
    settlements_preview: string;
    payslip_url: string;
};
type ExchangeRateRow = {
    id: number;
    from_currency: string;
    to_currency: string;
    rate: number;
    effective_at: string | null;
    notes: string | null;
};
type PeriodPayload = {
    id: number;
    code: string;
    name: string;
    frequency: string;
    currency: string;
    status: string;
    period_start: string | null;
    period_end: string | null;
    pay_date: string | null;
    notes: string | null;
    latest_run: {
        id: number;
        run_number: number;
        status: string;
        employee_count: number;
        gross_total: number;
        taxable_total: number;
        deduction_total: number;
        net_total: number;
        processed_at: string | null;
        approved_at: string | null;
        closed_at: string | null;
        statutory_summaries: Array<{
            id: number;
            code: string;
            description: string;
            employee_count: number;
            total_amount: number;
        }>;
        settlement_summaries: Array<{
            currency: string;
            employee_count: number;
            base_total: number;
            settlement_total: number;
        }>;
    } | null;
    runs: Array<{
        id: number;
        run_number: number;
        status: string;
        employee_count: number;
        gross_total: number;
        deduction_total: number;
        net_total: number;
        processed_at: string | null;
        approved_at: string | null;
        closed_at: string | null;
    }>;
    input_summary: { total_inputs: number; employees_with_inputs: number };
    exchange_rates: ExchangeRateRow[];
};

export default function PayrollPeriodShow() {
    const { period, results, filters, actions, currencies } = usePage<{
        period: PeriodPayload;
        results: ResultRow[];
        filters: { search?: string };
        actions: Record<string, string>;
        currencies: Array<{ code: string; label: string }>;
    }>().props;

    const { can } = useAuthorization();
    const [search, setSearch] = useState(filters.search ?? '');

    // Modals
    const [open, setOpen] = useState(false);
    const [exchangeRateOpen, setExchangeRateOpen] = useState(false);
    const [editingExchangeRate, setEditingExchangeRate] =
        useState<ExchangeRateRow | null>(null);

    const form = useForm({
        code: period.code,
        name: period.name,
        frequency: period.frequency,
        period_start: period.period_start ?? '',
        period_end: period.period_end ?? '',
        pay_date: period.pay_date ?? '',
        currency: period.currency,
        status: period.status,
        notes: period.notes ?? '',
    });

    const exchangeRateForm = useForm({
        from_currency: period.currency,
        to_currency:
            currencies.find((currency) => currency.code !== period.currency)
                ?.code ?? period.currency,
        rate: '',
        effective_at: '',
        notes: '',
    });

    useEffect(() => {
        const timer = window.setTimeout(() => {
            router.get(
                `/payroll/periods/${period.id}`,
                { search },
                { preserveState: true, replace: true, preserveScroll: true },
            );
        }, 250);
        return () => window.clearTimeout(timer);
    }, [search, period.id]);

    const postAction = (url: string) =>
        router.post(url, {}, { preserveScroll: true });

    // --- Exchange Rate Handlers ---
    const openCreateExchangeRate = () => {
        setEditingExchangeRate(null);
        exchangeRateForm.setData({
            from_currency: period.currency,
            to_currency:
                currencies.find((currency) => currency.code !== period.currency)
                    ?.code ?? period.currency,
            rate: '',
            effective_at: '',
            notes: '',
        });
        setExchangeRateOpen(true);
    };

    const openEditExchangeRate = (exchangeRate: ExchangeRateRow) => {
        setEditingExchangeRate(exchangeRate);
        exchangeRateForm.setData({
            from_currency: exchangeRate.from_currency,
            to_currency: exchangeRate.to_currency,
            rate: String(exchangeRate.rate),
            effective_at: exchangeRate.effective_at
                ? exchangeRate.effective_at.replace(' ', 'T').slice(0, 16)
                : '',
            notes: exchangeRate.notes ?? '',
        });
        setExchangeRateOpen(true);
    };

    const submitExchangeRate = (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingExchangeRate
            ? `/payroll/periods/${period.id}/exchange-rates/${editingExchangeRate.id}`
            : actions.exchange_rates_store_url;
        const request = editingExchangeRate
            ? exchangeRateForm.put
            : exchangeRateForm.post;

        request(url, {
            preserveScroll: true,
            onSuccess: () => {
                setExchangeRateOpen(false);
                setEditingExchangeRate(null);
            },
        });
    };

    const destroyExchangeRate = (exchangeRate: ExchangeRateRow) => {
        if (
            !window.confirm(
                `Delete the ${exchangeRate.from_currency} to ${exchangeRate.to_currency} exchange rate?`,
            )
        )
            return;
        router.delete(
            `/payroll/periods/${period.id}/exchange-rates/${exchangeRate.id}`,
            { preserveScroll: true },
        );
    };

    const getInitials = (name: string) => {
        if (!name) return '??';
        const parts = name.split(' ');
        return parts.length > 1
            ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
            : name.substring(0, 2).toUpperCase();
    };

    const tabClass =
        'relative rounded-none border-b-2 border-transparent bg-transparent py-4 text-sm font-bold text-muted-foreground transition-none hover:text-foreground data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none';

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Control Center', href: '/control-center' },
                { title: 'Payroll', href: '/payroll' },
                { title: 'Periods', href: '/payroll/periods' },
                { title: period.code, href: '#' },
            ]}
        >
            <Head title={`${period.name} - Payroll Period`} />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-8 bg-muted/5 p-4 md:p-6 lg:p-8 xl:p-12">
                {/* --- Header Section --- */}
                <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                                {period.name}
                            </h1>
                            <Badge
                                variant="outline"
                                className={`border-transparent px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase shadow-none ${period.status.toLowerCase() === 'processed' ? 'bg-foreground text-background' : period.status.toLowerCase() === 'draft' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}
                            >
                                {period.status}
                            </Badge>
                        </div>
                        <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Fingerprint className="h-4 w-4" />
                            {period.code} • {period.period_start} to{' '}
                            {period.period_end} • Paid: {period.pay_date}
                        </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                        {can('payroll.manage') && (
                            <Button
                                variant="outline"
                                className="h-11 border-border bg-background font-bold shadow-sm"
                                onClick={() => setOpen(true)}
                            >
                                <Edit className="mr-2 h-4 w-4" /> Edit Period
                            </Button>
                        )}
                        {can('payroll.process') && (
                            <Button
                                variant="outline"
                                className="h-11 border-border bg-background font-bold shadow-sm"
                                onClick={() => postAction(actions.process_url)}
                            >
                                <PlayCircle className="mr-2 h-4 w-4" /> Process
                                Run
                            </Button>
                        )}
                        {can('payroll.approve') && (
                            <Button
                                className="h-11 bg-foreground px-6 font-bold text-background shadow-sm hover:bg-foreground/90"
                                onClick={() => postAction(actions.approve_url)}
                            >
                                <CheckCircle2 className="mr-2 h-4 w-4" />{' '}
                                Approve & Close
                            </Button>
                        )}
                        {can('payroll.close') &&
                            period.status.toLowerCase() === 'closed' && (
                                <Button
                                    variant="outline"
                                    className="h-11 border-border bg-background font-bold text-destructive shadow-sm hover:text-destructive"
                                    onClick={() =>
                                        postAction(actions.reopen_url)
                                    }
                                >
                                    <RotateCcw className="mr-2 h-4 w-4" />{' '}
                                    Reopen
                                </Button>
                            )}
                    </div>
                </div>

                {/* --- Metrics Row --- */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex h-full min-h-[110px] flex-col justify-between p-5">
                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                Total Employees
                            </p>
                            <div className="mt-2 flex items-end justify-between">
                                <span className="text-3xl font-extrabold text-foreground">
                                    {period.latest_run?.employee_count ?? 0}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex h-full min-h-[110px] flex-col justify-between p-5">
                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                Gross Total
                            </p>
                            <div className="mt-2">
                                <span className="font-mono text-2xl font-extrabold text-foreground">
                                    {period.currency}{' '}
                                    {(
                                        period.latest_run?.gross_total ?? 0
                                    ).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex h-full min-h-[110px] flex-col justify-between p-5">
                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                Deductions
                            </p>
                            <div className="mt-2">
                                <span className="font-mono text-2xl font-extrabold text-destructive">
                                    ({period.currency}{' '}
                                    {(
                                        period.latest_run?.deduction_total ?? 0
                                    ).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                    })}
                                    )
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex h-full min-h-[110px] flex-col justify-between p-5">
                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                Net Total
                            </p>
                            <div className="mt-2">
                                <span className="font-mono text-2xl font-extrabold text-foreground">
                                    {period.currency}{' '}
                                    {(
                                        period.latest_run?.net_total ?? 0
                                    ).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex h-full min-h-[110px] flex-col justify-between p-5">
                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                Currencies
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {period.latest_run?.settlement_summaries
                                    .map((s) => s.currency)
                                    .map((c) => (
                                        <Badge
                                            key={c}
                                            variant="outline"
                                            className="border-border bg-muted/30 px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase shadow-none"
                                        >
                                            {c}
                                        </Badge>
                                    )) || (
                                    <Badge
                                        variant="outline"
                                        className="border-border bg-muted/30 px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase shadow-none"
                                    >
                                        {period.currency}
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* --- Main Tab Area --- */}
                <Tabs defaultValue="results" className="w-full space-y-6">
                    <div className="border-b border-border/60">
                        <TabsList className="flex h-auto w-full justify-start gap-8 rounded-none bg-transparent p-0">
                            <TabsTrigger value="results" className={tabClass}>
                                <List className="mr-2 h-4 w-4" /> Results
                            </TabsTrigger>
                            <TabsTrigger
                                value="settlements"
                                className={tabClass}
                            >
                                <ArrowRightLeft className="mr-2 h-4 w-4" />{' '}
                                Settlements
                            </TabsTrigger>
                            <TabsTrigger value="runs" className={tabClass}>
                                <History className="mr-2 h-4 w-4" /> Runs
                            </TabsTrigger>
                            <TabsTrigger value="statutory" className={tabClass}>
                                <Landmark className="mr-2 h-4 w-4" /> Statutory
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent
                        value="results"
                        className="m-0 space-y-4 focus-visible:ring-0"
                    >
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="flex flex-col items-start justify-between gap-4 border-b border-border/50 bg-muted/5 p-4 sm:flex-row sm:items-center md:p-6">
                                <CardTitle className="text-base font-bold text-foreground">
                                    Processed Employee Results
                                </CardTitle>
                                <div className="flex w-full items-center gap-2 sm:w-auto">
                                    <div className="relative w-full sm:w-64">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                            className="h-9 border-border bg-background pl-9 text-sm shadow-sm"
                                            placeholder="Search employees..."
                                        />
                                    </div>
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="icon"
                                        className="h-9 w-9 shrink-0 border-border/50 text-muted-foreground shadow-sm hover:text-foreground"
                                    >
                                        <Link
                                            href={`/payroll/results?payroll_period_id=${period.id}`}
                                        >
                                            <Filter className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    {period.latest_run && can('payroll.export') && (
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="icon"
                                            className="h-9 w-9 shrink-0 border-border/50 text-muted-foreground shadow-sm hover:text-foreground"
                                        >
                                            <a
                                                href={`/payroll/reports/runs/${period.latest_run.id}/register`}
                                            >
                                                <Download className="h-4 w-4" />
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-b border-border/50 bg-muted/10 hover:bg-transparent">
                                                <TableHead className="h-12 pl-6 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    Employee
                                                </TableHead>
                                                <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    Gross ({period.currency})
                                                </TableHead>
                                                <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    Tax ({period.currency})
                                                </TableHead>
                                                <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    Deductions
                                                </TableHead>
                                                <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    Net ({period.currency})
                                                </TableHead>
                                                <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    Settlement Split
                                                </TableHead>
                                                <TableHead className="pr-6 text-right text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    Action
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {results.length === 0 ? (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={7}
                                                        className="h-48 text-center text-sm font-medium text-muted-foreground"
                                                    >
                                                        No payroll results are
                                                        available for this
                                                        period yet.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                results.map((result) => (
                                                    <TableRow
                                                        key={result.id}
                                                        className="transition-colors hover:bg-muted/30"
                                                    >
                                                        <TableCell className="py-4 pl-6">
                                                            <div className="flex items-center gap-4">
                                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-[10px] font-bold text-foreground shadow-sm">
                                                                    {getInitials(
                                                                        result.employee_name,
                                                                    )}
                                                                </div>
                                                                <div className="space-y-0.5">
                                                                    <p className="text-sm font-bold text-foreground">
                                                                        {
                                                                            result.employee_name
                                                                        }
                                                                    </p>
                                                                    <p className="text-[10px] font-medium text-muted-foreground">
                                                                        ID:{' '}
                                                                        {
                                                                            result.staff_number
                                                                        }{' '}
                                                                        •{' '}
                                                                        {result.department ??
                                                                            'N/A'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="font-mono text-sm font-bold text-foreground">
                                                            {result.gross_pay.toLocaleString(
                                                                undefined,
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                },
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="font-mono text-sm font-bold text-destructive">
                                                            {result.tax_amount.toLocaleString(
                                                                undefined,
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                },
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="font-mono text-sm font-bold text-foreground">
                                                            {result.total_deductions.toLocaleString(
                                                                undefined,
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                },
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="font-mono text-sm font-extrabold text-foreground">
                                                            {result.net_pay.toLocaleString(
                                                                undefined,
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                },
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col gap-1">
                                                                {result
                                                                    .settlements
                                                                    .length >
                                                                0 ? (
                                                                    result.settlements.map(
                                                                        (
                                                                            s,
                                                                            idx,
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    idx
                                                                                }
                                                                                className={`text-[10px] font-bold tracking-widest uppercase ${idx === 0 ? 'text-foreground' : 'text-muted-foreground'}`}
                                                                            >
                                                                                {
                                                                                    s.currency
                                                                                }{' '}
                                                                                {s.settlement_amount.toLocaleString(
                                                                                    undefined,
                                                                                    {
                                                                                        minimumFractionDigits: 2,
                                                                                    },
                                                                                )}
                                                                            </span>
                                                                        ),
                                                                    )
                                                                ) : (
                                                                    <span className="text-[10px] font-bold tracking-widest text-foreground uppercase">
                                                                        {
                                                                            result.currency
                                                                        }{' '}
                                                                        {result.net_pay.toLocaleString(
                                                                            undefined,
                                                                            {
                                                                                minimumFractionDigits: 2,
                                                                            },
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="pr-6 text-right">
                                                            <Button
                                                                asChild
                                                                variant="link"
                                                                className="h-auto p-0 text-xs font-bold tracking-widest text-foreground uppercase hover:text-primary"
                                                            >
                                                                <Link
                                                                    href={
                                                                        result.payslip_url
                                                                    }
                                                                >
                                                                    View
                                                                </Link>
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent
                        value="settlements"
                        className="m-0 focus-visible:ring-0"
                    >
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            {/* Exchange Rates Panel */}
                            <div className="space-y-4 lg:col-span-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
                                        <TrendingUp className="h-5 w-5 text-muted-foreground" />{' '}
                                        Exchange Rates
                                    </h3>
                                    {can('payroll.manage') && (
                                        <Button
                                            variant="link"
                                            className="h-auto p-0 text-xs font-bold tracking-widest text-foreground uppercase hover:text-primary"
                                            onClick={openCreateExchangeRate}
                                        >
                                            Add New
                                        </Button>
                                    )}
                                </div>
                                <Card className="overflow-hidden border-border bg-background shadow-sm">
                                    <CardContent className="p-0">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-muted/5 hover:bg-transparent">
                                                    <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                        Pair
                                                    </TableHead>
                                                    <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                        Rate
                                                    </TableHead>
                                                    <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                        Action
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {period.exchange_rates
                                                    .length === 0 ? (
                                                    <TableRow>
                                                        <TableCell
                                                            colSpan={3}
                                                            className="h-24 text-center text-xs font-medium text-muted-foreground"
                                                        >
                                                            No rates configured.
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    period.exchange_rates.map(
                                                        (rate) => (
                                                            <TableRow
                                                                key={rate.id}
                                                                className="hover:bg-muted/30"
                                                            >
                                                                <TableCell className="text-xs font-bold text-foreground">
                                                                    {
                                                                        rate.from_currency
                                                                    }
                                                                    /
                                                                    {
                                                                        rate.to_currency
                                                                    }
                                                                </TableCell>
                                                                <TableCell className="font-mono text-xs">
                                                                    {rate.rate.toFixed(
                                                                        4,
                                                                    )}
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-6 w-6 text-muted-foreground"
                                                                        onClick={() =>
                                                                            openEditExchangeRate(
                                                                                rate,
                                                                            )
                                                                        }
                                                                    >
                                                                        <Pencil className="h-3 w-3" />
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ),
                                                    )
                                                )}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Settlement Breakdown Panel */}
                            <div className="space-y-4 lg:col-span-2">
                                <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
                                    <Banknote className="h-5 w-5 text-muted-foreground" />{' '}
                                    Latest Run Settlement Totals
                                </h3>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="flex flex-col justify-center rounded-xl border border-border bg-muted/5 p-6 shadow-sm">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Base Total ({period.currency})
                                        </p>
                                        <p className="mt-2 font-mono text-3xl font-extrabold text-foreground">
                                            {(
                                                period.latest_run?.net_total ??
                                                0
                                            ).toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                            })}
                                        </p>
                                        <p className="mt-3 text-[10px] font-medium text-muted-foreground italic">
                                            Calculated at period base rate
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-foreground bg-foreground p-6 text-background shadow-sm">
                                        <div className="mb-6 flex items-start justify-between">
                                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground/80 uppercase">
                                                Payout Breakdown
                                            </p>
                                            <Badge
                                                variant="outline"
                                                className="border-background/20 bg-background/10 px-2 py-0 text-[9px] tracking-widest text-background uppercase"
                                            >
                                                LATEST RUN
                                            </Badge>
                                        </div>
                                        <div className="space-y-4">
                                            {(
                                                period.latest_run
                                                    ?.settlement_summaries ?? []
                                            ).map((summary, idx) => (
                                                <div
                                                    key={summary.currency}
                                                    className="space-y-1.5"
                                                >
                                                    <div className="flex items-center justify-between text-sm font-bold">
                                                        <span>
                                                            {summary.currency}{' '}
                                                            Allocation
                                                        </span>
                                                        <span className="font-mono">
                                                            {summary.settlement_total.toLocaleString(
                                                                undefined,
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                },
                                                            )}
                                                        </span>
                                                    </div>
                                                    {/* Fake visual bar for the design aspect */}
                                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-background/20">
                                                        <div
                                                            className="h-full bg-background opacity-80"
                                                            style={{
                                                                width: `${idx === 0 ? 60 : 40}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                            {(
                                                period.latest_run
                                                    ?.settlement_summaries ?? []
                                            ).length === 0 && (
                                                <p className="text-xs text-muted-foreground/80">
                                                    No multi-currency
                                                    settlements generated in the
                                                    latest run.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent
                        value="runs"
                        className="m-0 focus-visible:ring-0"
                    >
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 bg-muted/5 pb-4">
                                <CardTitle className="text-base font-bold text-foreground">
                                    Run history
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-b border-border/50 bg-muted/10 hover:bg-transparent">
                                                <TableHead className="h-12 pl-6 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    Run
                                                </TableHead>
                                                <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    Status
                                                </TableHead>
                                                <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    Processed
                                                </TableHead>
                                                <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    Employees
                                                </TableHead>
                                                <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    Gross
                                                </TableHead>
                                                <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    Net
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {period.runs.map((run) => (
                                                <TableRow
                                                    key={run.id}
                                                    className="transition-colors hover:bg-muted/30"
                                                >
                                                    <TableCell className="py-4 pl-6 text-sm font-bold text-foreground">
                                                        Run {run.run_number}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className={`border-transparent px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase shadow-none ${run.status.toLowerCase() === 'processed' ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}`}
                                                        >
                                                            {run.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-xs font-medium text-muted-foreground">
                                                        {run.processed_at ??
                                                            'N/A'}
                                                    </TableCell>
                                                    <TableCell className="text-sm font-bold text-foreground">
                                                        {run.employee_count}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-sm font-bold text-foreground">
                                                        {period.currency}{' '}
                                                        {run.gross_total.toLocaleString(
                                                            undefined,
                                                            {
                                                                minimumFractionDigits: 2,
                                                            },
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-sm font-extrabold text-foreground">
                                                        {period.currency}{' '}
                                                        {run.net_total.toLocaleString(
                                                            undefined,
                                                            {
                                                                minimumFractionDigits: 2,
                                                            },
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {period.runs.length === 0 && (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={6}
                                                        className="h-24 text-center text-sm font-medium text-muted-foreground"
                                                    >
                                                        No payroll runs executed
                                                        yet.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent
                        value="statutory"
                        className="m-0 focus-visible:ring-0"
                    >
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 bg-muted/5 pb-4">
                                <CardTitle className="text-base font-bold text-foreground">
                                    Statutory summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-b border-border/50 bg-muted/10 hover:bg-transparent">
                                                <TableHead className="h-12 pl-6 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    Code
                                                </TableHead>
                                                <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    Description
                                                </TableHead>
                                                <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    Employees
                                                </TableHead>
                                                <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    Total
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {(
                                                period.latest_run
                                                    ?.statutory_summaries ?? []
                                            ).length === 0 ? (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={4}
                                                        className="h-24 text-center text-sm font-medium text-muted-foreground"
                                                    >
                                                        No statutory summary
                                                        lines are available for
                                                        the latest run.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                period.latest_run?.statutory_summaries.map(
                                                    (summary) => (
                                                        <TableRow
                                                            key={summary.id}
                                                            className="transition-colors hover:bg-muted/30"
                                                        >
                                                            <TableCell className="py-4 pl-6 text-sm font-bold text-foreground">
                                                                {summary.code}
                                                            </TableCell>
                                                            <TableCell className="text-sm font-medium text-muted-foreground">
                                                                {
                                                                    summary.description
                                                                }
                                                            </TableCell>
                                                            <TableCell className="text-sm font-bold text-foreground">
                                                                {
                                                                    summary.employee_count
                                                                }
                                                            </TableCell>
                                                            <TableCell className="font-mono text-sm font-extrabold text-foreground">
                                                                {
                                                                    period.currency
                                                                }{' '}
                                                                {summary.total_amount.toLocaleString(
                                                                    undefined,
                                                                    {
                                                                        minimumFractionDigits: 2,
                                                                    },
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ),
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* --- Modals --- */}

            {/* Edit Period Modal (Standard Width) */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent
                    size="4xl"
                    className="overflow-hidden border-border p-0 shadow-lg"
                >
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.put(actions.update_url, {
                                preserveScroll: true,
                                onSuccess: () => setOpen(false),
                            });
                        }}
                        className="flex max-h-[90vh] flex-col"
                    >
                        <DialogHeader className="shrink-0 border-b border-border/50 bg-muted/5 p-6 md:p-8">
                            <DialogTitle className="text-2xl font-extrabold text-foreground">
                                Edit payroll period
                            </DialogTitle>
                        </DialogHeader>
                        <div className="flex-1 space-y-6 overflow-y-auto p-6 md:p-8">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <Field label="Code">
                                    <Input
                                        value={form.data.code}
                                        onChange={(e) =>
                                            form.setData('code', e.target.value)
                                        }
                                        className="h-11 bg-background shadow-sm"
                                    />
                                </Field>
                                <Field label="Name">
                                    <Input
                                        value={form.data.name}
                                        onChange={(e) =>
                                            form.setData('name', e.target.value)
                                        }
                                        className="h-11 bg-background shadow-sm"
                                    />
                                </Field>
                                <Field label="Period start">
                                    <Input
                                        type="date"
                                        value={form.data.period_start}
                                        onChange={(e) =>
                                            form.setData(
                                                'period_start',
                                                e.target.value,
                                            )
                                        }
                                        className="h-11 bg-background shadow-sm"
                                    />
                                </Field>
                                <Field label="Period end">
                                    <Input
                                        type="date"
                                        value={form.data.period_end}
                                        onChange={(e) =>
                                            form.setData(
                                                'period_end',
                                                e.target.value,
                                            )
                                        }
                                        className="h-11 bg-background shadow-sm"
                                    />
                                </Field>
                                <Field label="Pay date">
                                    <Input
                                        type="date"
                                        value={form.data.pay_date}
                                        onChange={(e) =>
                                            form.setData(
                                                'pay_date',
                                                e.target.value,
                                            )
                                        }
                                        className="h-11 bg-background shadow-sm"
                                    />
                                </Field>
                                <div className="md:col-span-2">
                                    <Field label="Notes">
                                        <Textarea
                                            rows={4}
                                            value={form.data.notes}
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
                                Save changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Exchange Rate Modal (size="2xl") */}
            <Dialog open={exchangeRateOpen} onOpenChange={setExchangeRateOpen}>
                <DialogContent
                    size="2xl"
                    className="overflow-hidden border-border p-0 shadow-lg"
                >
                    <form
                        onSubmit={submitExchangeRate}
                        className="flex max-h-[90vh] flex-col"
                    >
                        <DialogHeader className="shrink-0 border-b border-border/50 bg-muted/5 p-6 md:p-8">
                            <DialogTitle className="text-2xl font-extrabold text-foreground">
                                {editingExchangeRate
                                    ? 'Edit exchange rate'
                                    : 'Add exchange rate'}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="flex-1 space-y-6 overflow-y-auto p-6 md:p-8">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <Field label="From Currency">
                                    <Select
                                        value={
                                            exchangeRateForm.data.from_currency
                                        }
                                        onValueChange={(v) =>
                                            exchangeRateForm.setData(
                                                'from_currency',
                                                v,
                                            )
                                        }
                                    >
                                        <SelectTrigger className="h-11 bg-background shadow-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {currencies.map((c) => (
                                                <SelectItem
                                                    key={c.code}
                                                    value={c.code}
                                                >
                                                    {c.code}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field label="To Currency">
                                    <Select
                                        value={
                                            exchangeRateForm.data.to_currency
                                        }
                                        onValueChange={(v) =>
                                            exchangeRateForm.setData(
                                                'to_currency',
                                                v,
                                            )
                                        }
                                    >
                                        <SelectTrigger className="h-11 bg-background shadow-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {currencies.map((c) => (
                                                <SelectItem
                                                    key={c.code}
                                                    value={c.code}
                                                >
                                                    {c.code}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field label="Rate Value">
                                    <Input
                                        type="number"
                                        step="0.0001"
                                        placeholder="0.0000"
                                        value={String(
                                            exchangeRateForm.data.rate ?? '',
                                        )}
                                        onChange={(e) =>
                                            exchangeRateForm.setData(
                                                'rate',
                                                e.target.value,
                                            )
                                        }
                                        className="h-11 bg-background font-mono shadow-sm"
                                    />
                                </Field>
                                <Field label="Effective Date">
                                    <Input
                                        type="datetime-local"
                                        value={
                                            exchangeRateForm.data.effective_at
                                        }
                                        onChange={(e) =>
                                            exchangeRateForm.setData(
                                                'effective_at',
                                                e.target.value,
                                            )
                                        }
                                        className="h-11 bg-background shadow-sm"
                                    />
                                </Field>
                                <div className="md:col-span-2">
                                    <div className="flex gap-3 rounded-xl border border-border/50 bg-muted/10 p-4">
                                        <Info className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                                        <p className="text-xs leading-relaxed font-medium text-muted-foreground">
                                            This rate will apply to all
                                            settlement calculations in the
                                            current open run for the selected
                                            currency pair.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="mt-0 flex shrink-0 items-center justify-between border-t border-border/50 bg-muted/5 p-6 md:p-8">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setExchangeRateOpen(false)}
                                className="h-11 px-6 font-bold shadow-sm"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={exchangeRateForm.processing}
                                className="h-11 bg-foreground px-8 font-bold text-background shadow-sm hover:bg-foreground/90"
                            >
                                {editingExchangeRate
                                    ? 'Save changes'
                                    : 'Save Rate'}
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
