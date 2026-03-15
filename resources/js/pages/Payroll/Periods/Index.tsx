import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    CheckCircle2,
    FileEdit,
    Filter,
    FolderOpen,
    Lock,
    Plus,
    Search,
    TrendingUp,
} from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';

type PeriodRow = {
    id: number;
    code: string;
    name: string;
    frequency: string;
    currency: string;
    status: string;
    period_start: string | null;
    period_end: string | null;
    pay_date: string | null;
    employee_count: number;
    gross_total: number;
    net_total: number;
    latest_run_number: number | null;
    show_url: string;
};

type PaginatedPeriods = {
    data: PeriodRow[];
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
};

export default function PayrollPeriodsIndex() {
    const { periods, filters, statuses, frequencies, defaults, stats } =
        usePage<{
            periods: PaginatedPeriods;
            filters: { search?: string; status?: string };
            statuses: string[];
            frequencies: string[];
            defaults: Record<string, string>;
            stats: {
                total: number;
                draft: number;
                processed: number;
                closed: number;
            };
        }>().props;

    const { can } = useAuthorization();
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? 'all');
    const [open, setOpen] = useState(false);

    const form = useForm({
        code: defaults.code,
        name: defaults.name,
        frequency: defaults.frequency,
        period_start: defaults.period_start,
        period_end: defaults.period_end,
        pay_date: defaults.pay_date,
        currency: defaults.currency,
        status: defaults.status,
        notes: defaults.notes ?? '',
    });

    useEffect(() => {
        const timer = window.setTimeout(() => {
            router.get(
                '/payroll/periods',
                { search, status: status === 'all' ? '' : status },
                { preserveState: true, replace: true, preserveScroll: true },
            );
        }, 250);

        return () => window.clearTimeout(timer);
    }, [search, status]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/payroll/periods', {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                form.reset();
            },
        });
    };

    const changePage = (page: number) => {
        router.get(
            '/payroll/periods',
            { page, search, status: status === 'all' ? '' : status },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Control Center', href: '/control-center' },
                { title: 'Payroll', href: '/payroll' },
                { title: 'Periods', href: '#' },
            ]}
        >
            <Head title="Payroll Periods" />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-8 bg-muted/5 p-4 md:p-6 lg:p-8 xl:p-12">
                {/* Header Section */}
                <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Payroll periods
                        </h1>
                        <p className="mt-2 max-w-3xl text-sm leading-relaxed font-medium text-muted-foreground">
                            Manage and track your organization's payroll
                            processing cycles and disbursements.
                        </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                        {can('payroll.manage') && (
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button className="h-11 bg-foreground px-6 font-bold text-background shadow-sm hover:bg-foreground/90">
                                        <Plus className="mr-2 h-4 w-4" /> Open
                                        payroll period
                                    </Button>
                                </DialogTrigger>
                                <DialogContent
                                    size="4xl"
                                    className="overflow-hidden border-border p-0 shadow-lg"
                                >
                                    <form
                                        onSubmit={submit}
                                        className="flex max-h-[90vh] flex-col"
                                    >
                                        <DialogHeader className="shrink-0 border-b border-border/50 bg-muted/5 p-6 pb-6 md:p-8">
                                            <DialogTitle className="text-xl font-extrabold text-foreground">
                                                Open new payroll period
                                            </DialogTitle>
                                            <p className="mt-1 text-sm font-medium text-muted-foreground">
                                                Define the parameters for the
                                                new pay cycle.
                                            </p>
                                        </DialogHeader>

                                        <div className="flex-1 overflow-y-auto p-6 md:p-8">
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <Field label="Period Code">
                                                    <Input
                                                        value={form.data.code}
                                                        onChange={(e) =>
                                                            form.setData(
                                                                'code',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="h-11 bg-background font-mono shadow-sm"
                                                    />
                                                </Field>
                                                <Field label="Display Name">
                                                    <Input
                                                        placeholder="e.g. November 2023 Payroll"
                                                        value={form.data.name}
                                                        onChange={(e) =>
                                                            form.setData(
                                                                'name',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="h-11 bg-background shadow-sm"
                                                    />
                                                </Field>
                                                <Field label="Frequency">
                                                    <Select
                                                        value={
                                                            form.data.frequency
                                                        }
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            form.setData(
                                                                'frequency',
                                                                value,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="h-11 bg-background shadow-sm">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {frequencies.map(
                                                                (freq) => (
                                                                    <SelectItem
                                                                        key={
                                                                            freq
                                                                        }
                                                                        value={
                                                                            freq
                                                                        }
                                                                    >
                                                                        {freq}
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </Field>
                                                <Field label="Currency">
                                                    <Input
                                                        value={
                                                            form.data.currency
                                                        }
                                                        onChange={(e) =>
                                                            form.setData(
                                                                'currency',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="h-11 bg-background shadow-sm"
                                                    />
                                                </Field>
                                                <Field label="Period Start">
                                                    <Input
                                                        type="date"
                                                        value={
                                                            form.data
                                                                .period_start
                                                        }
                                                        onChange={(e) =>
                                                            form.setData(
                                                                'period_start',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="h-11 bg-background shadow-sm"
                                                    />
                                                </Field>
                                                <Field label="Period End">
                                                    <Input
                                                        type="date"
                                                        value={
                                                            form.data.period_end
                                                        }
                                                        onChange={(e) =>
                                                            form.setData(
                                                                'period_end',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="h-11 bg-background shadow-sm"
                                                    />
                                                </Field>
                                                <Field label="Scheduled Pay Date">
                                                    <Input
                                                        type="date"
                                                        value={
                                                            form.data.pay_date
                                                        }
                                                        onChange={(e) =>
                                                            form.setData(
                                                                'pay_date',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="h-11 bg-background shadow-sm"
                                                    />
                                                </Field>
                                                <Field label="Status">
                                                    <Select
                                                        value={form.data.status}
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            form.setData(
                                                                'status',
                                                                value,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="h-11 bg-background shadow-sm">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {statuses.map(
                                                                (item) => (
                                                                    <SelectItem
                                                                        key={
                                                                            item
                                                                        }
                                                                        value={
                                                                            item
                                                                        }
                                                                    >
                                                                        {item}
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </Field>
                                                <div className="md:col-span-2">
                                                    <Field label="Notes (Optional)">
                                                        <Textarea
                                                            placeholder="Add any internal remarks here..."
                                                            value={
                                                                form.data.notes
                                                            }
                                                            onChange={(e) =>
                                                                form.setData(
                                                                    'notes',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="h-24 resize-none bg-background shadow-sm"
                                                        />
                                                    </Field>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-border/50 bg-muted/5 p-6">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setOpen(false)}
                                                className="h-10 px-6 font-bold shadow-sm"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={form.processing}
                                                className="h-10 bg-foreground px-6 font-bold text-background shadow-sm hover:bg-foreground/90"
                                            >
                                                Create Period
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                </div>

                {/* Top Metrics Row */}
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="Total periods"
                        value={stats.total}
                        icon={CalendarDays}
                        trend="+2 from last month"
                    />
                    <StatCard
                        label="Draft"
                        value={stats.draft}
                        icon={FileEdit}
                        subtext="Awaiting completion"
                    />
                    <StatCard
                        label="Processed"
                        value={stats.processed}
                        icon={CheckCircle2}
                        subtext="Ready for disbursement"
                    />
                    <StatCard
                        label="Closed"
                        value={stats.closed}
                        icon={Lock}
                        subtext="Archived periods"
                    />
                </div>

                {/* Main Directory Card */}
                <Card className="flex w-full flex-col overflow-hidden border-border bg-background shadow-sm">
                    {/* Toolbar Section */}
                    <div className="flex shrink-0 flex-col items-start justify-between gap-4 border-b border-border/50 p-4 md:flex-row md:items-center md:p-6">
                        <h2 className="text-lg font-bold text-foreground">
                            Period register
                        </h2>

                        <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
                            <div className="relative h-10 w-full min-w-[240px] flex-1 md:w-auto md:flex-none">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search by name or code..."
                                    className="h-full w-full border-border/50 bg-muted/10 pl-9 text-sm shadow-none"
                                />
                            </div>

                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="h-10 w-full border-border/50 bg-muted/10 text-sm font-medium shadow-none md:w-40">
                                    <SelectValue placeholder="All statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All statuses
                                    </SelectItem>
                                    {statuses.map((item) => (
                                        <SelectItem key={item} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                className="h-10 w-full border-border/50 bg-muted/10 px-4 font-bold text-foreground shadow-none md:w-auto"
                            >
                                <Filter className="mr-2 h-4 w-4" />
                                Filters
                            </Button>
                        </div>
                    </div>

                    {/* Table Area */}
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-border/50 bg-muted/5 hover:bg-transparent">
                                    <TableHead className="h-12 pl-6 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Period
                                    </TableHead>
                                    <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Status
                                    </TableHead>
                                    <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Window
                                    </TableHead>
                                    <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Employees
                                    </TableHead>
                                    <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Gross
                                    </TableHead>
                                    <TableHead className="pr-6 text-right text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Action
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-border/50">
                                {periods.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-48 text-center text-sm font-medium text-muted-foreground"
                                        >
                                            No payroll periods found for the
                                            current filters.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    periods.data.map((period) => (
                                        <TableRow
                                            key={period.id}
                                            className="transition-colors hover:bg-muted/20"
                                        >
                                            <TableCell className="py-4 pl-6">
                                                <div className="flex flex-col space-y-0.5">
                                                    <span className="text-sm font-bold text-foreground">
                                                        {period.name}
                                                    </span>
                                                    <span className="text-xs font-medium text-muted-foreground">
                                                        {period.code} |{' '}
                                                        {period.frequency}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`border-transparent px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase shadow-none ${period.status.toLowerCase() === 'processed' ? 'bg-foreground text-background' : period.status.toLowerCase() === 'draft' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}
                                                >
                                                    {period.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm font-medium text-muted-foreground">
                                                {period.period_start} -{' '}
                                                {period.period_end}
                                            </TableCell>
                                            <TableCell className="text-sm font-bold text-foreground">
                                                {period.employee_count}
                                            </TableCell>
                                            <TableCell className="font-mono text-sm font-bold text-foreground">
                                                {period.currency}{' '}
                                                {period.gross_total.toLocaleString(
                                                    undefined,
                                                    {
                                                        minimumFractionDigits: 2,
                                                    },
                                                )}
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <Link
                                                    href={period.show_url}
                                                    className="text-sm font-bold text-foreground transition-colors hover:text-primary hover:underline"
                                                >
                                                    Open
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {periods.last_page > 1 && (
                        <div className="flex shrink-0 flex-col items-center justify-between gap-4 border-t border-border/50 bg-muted/5 p-4 sm:flex-row md:px-6">
                            <span className="text-xs font-bold text-muted-foreground">
                                Showing {periods.from || 0} to {periods.to || 0}{' '}
                                of {periods.total} results
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="h-8 border-border bg-background px-3 text-xs font-bold text-foreground shadow-sm hover:bg-muted"
                                    disabled={periods.current_page <= 1}
                                    onClick={() =>
                                        changePage(periods.current_page - 1)
                                    }
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-8 border-border bg-background px-3 text-xs font-bold text-foreground shadow-sm hover:bg-muted"
                                    disabled={
                                        periods.current_page >=
                                        periods.last_page
                                    }
                                    onClick={() =>
                                        changePage(periods.current_page + 1)
                                    }
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}

// --- Sub Components ---

function Field({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="space-y-2">
            <Label className="text-xs font-semibold text-foreground">
                {label}
            </Label>
            {children}
        </div>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
    trend,
    subtext,
}: {
    icon: any;
    label: string;
    value: number;
    trend?: string;
    subtext?: string;
}) {
    return (
        <Card className="h-full border-border bg-background shadow-sm">
            <CardContent className="flex h-full flex-col justify-between gap-3 p-6">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-muted-foreground">
                        {label}
                    </p>
                    <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="mt-1">
                    <p className="text-3xl font-extrabold text-foreground">
                        {value}
                    </p>
                </div>
                {(trend || subtext) && (
                    <div className="mt-2 flex items-center gap-1 text-xs font-medium">
                        {trend ? (
                            <>
                                <TrendingUp className="h-3 w-3 text-primary" />
                                <span className="text-foreground">{trend}</span>
                            </>
                        ) : (
                            <span className="text-muted-foreground">
                                {subtext}
                            </span>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
