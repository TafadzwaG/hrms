import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    IndexTableEmptyRow,
    IndexTableHead,
    IndexTableHeaderRow,
    IndexTablePagination,
    SortableTableHead,
} from '@/components/index-table';
import { Input } from '@/components/ui/input';
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
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { buildIndexParams } from '@/lib/index-table';
import { useAuthorization } from '@/lib/authorization';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Download,
    Eye,
    FolderSearch2,
    ReceiptText,
    Search,
} from 'lucide-react';
import { useEffect, useState } from 'react';

type ResultRow = {
    id: number;
    employee: {
        id: number;
        staff_number: string;
        full_name: string;
        department: string | null;
        position: string | null;
        pay_point: string | null;
    };
    period: {
        id: number | null;
        code: string | null;
        name: string | null;
        pay_date: string | null;
        run_number: number | null;
        run_status: string | null;
    };
    totals: {
        currency: string;
        gross_pay: number;
        tax_amount: number;
        total_deductions: number;
        net_pay: number;
    };
    line_count: number;
    settlements_preview: string;
    payslip_url: string;
    download_url: string;
    period_url: string;
};

type PaginatedResults = {
    data: ResultRow[];
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
};

type FilterState = {
    search?: string;
    payroll_period_id?: string | number;
    department?: string;
    pay_point?: string;
    status?: string;
    currency?: string;
};

export default function PayrollResultsIndex() {
    const {
        results,
        filters,
        periods,
        departments,
        payPoints,
        statuses,
        currencies,
        stats,
    } = usePage<{
        results: PaginatedResults;
        filters: FilterState;
        periods: Array<{ id: number; label: string }>;
        departments: string[];
        payPoints: string[];
        statuses: string[];
        currencies: Array<{ code: string; label: string }>;
        stats: {
            results_total: number;
            covered_periods: number;
            gross_total: number;
            net_total: number;
        };
    }>().props;

    const { canAny } = useAuthorization();
    const canDownload = canAny(['payslips.download', 'payroll.export']);
    const canViewPayslip = canAny(['payslips.view', 'payroll.view']);

    const [search, setSearch] = useState(filters.search ?? '');
    const [payrollPeriodId, setPayrollPeriodId] = useState(
        filters.payroll_period_id ? String(filters.payroll_period_id) : 'all',
    );
    const [department, setDepartment] = useState(filters.department || 'all');
    const [payPoint, setPayPoint] = useState(filters.pay_point || 'all');
    const [status, setStatus] = useState(filters.status || 'all');
    const [currency, setCurrency] = useState(filters.currency || 'all');

    useEffect(() => {
        const timer = window.setTimeout(() => {
            router.get(
                '/payroll/results',
                buildIndexParams(filters, {
                    search,
                    payroll_period_id: payrollPeriodId === 'all' ? '' : payrollPeriodId,
                    department: department === 'all' ? '' : department,
                    pay_point: payPoint === 'all' ? '' : payPoint,
                    status: status === 'all' ? '' : status,
                    currency: currency === 'all' ? '' : currency,
                }),
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 300);

        return () => window.clearTimeout(timer);
    }, [search, payrollPeriodId, department, payPoint, status, currency]);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Payroll', href: '/payroll' },
                { title: 'Results', href: '/payroll/results' },
            ]}
        >
            <Head title="Payroll Results" />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-6 bg-muted/10 p-4 md:p-6 lg:p-8 xl:p-12">
                <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Payroll results register
                        </h1>
                        <p className="mt-2 max-w-3xl text-sm leading-relaxed font-medium text-muted-foreground">
                            Review employee-level payroll outcomes across processed runs, with
                            settlement splits and direct access to payslips.
                        </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                        <Button
                            asChild
                            variant="outline"
                            className="h-11 border-border bg-background px-5 font-bold shadow-sm"
                        >
                            <Link href="/payroll/periods">Payroll periods</Link>
                        </Button>
                        <Button
                            asChild
                            className="h-11 bg-foreground px-5 font-bold text-background shadow-sm hover:bg-foreground/90"
                        >
                            <Link href="/payroll/payslips">Payslips</Link>
                        </Button>
                    </div>
                </div>

                <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4">
                    <MetricCard label="Results" value={stats.results_total} />
                    <MetricCard label="Periods Covered" value={stats.covered_periods} />
                    <MetricCard
                        label="Base Gross Total"
                        value={stats.gross_total.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    />
                    <MetricCard
                        label="Base Net Total"
                        value={stats.net_total.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    />
                </div>

                <Card className="flex h-[calc(100vh-250px)] flex-col overflow-hidden border-border bg-background shadow-sm">
                    <div className="flex shrink-0 flex-col gap-4 border-b border-border/50 p-4 md:p-6">
                        <div className="flex items-center gap-4">
                            <h2 className="text-base font-bold text-foreground">
                                Processed employee results
                            </h2>
                            <Badge
                                variant="secondary"
                                className="border-transparent bg-muted px-2 py-0.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase shadow-none"
                            >
                                {results.total} total
                            </Badge>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
                            <div className="relative xl:col-span-2">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search employee, staff number, or position..."
                                    className="h-10 border-border/50 bg-background pl-9 text-sm shadow-sm"
                                />
                            </div>
                            <FilterSelect
                                value={payrollPeriodId}
                                onValueChange={setPayrollPeriodId}
                                placeholder="All periods"
                                options={periods.map((period) => ({
                                    value: String(period.id),
                                    label: period.label,
                                }))}
                            />
                            <FilterSelect
                                value={department}
                                onValueChange={setDepartment}
                                placeholder="All departments"
                                options={departments.map((item) => ({ value: item, label: item }))}
                            />
                            <FilterSelect
                                value={payPoint}
                                onValueChange={setPayPoint}
                                placeholder="All pay points"
                                options={payPoints.map((item) => ({ value: item, label: item }))}
                            />
                            <FilterSelect
                                value={status}
                                onValueChange={setStatus}
                                placeholder="All statuses"
                                options={statuses.map((item) => ({ value: item, label: item }))}
                            />
                            <FilterSelect
                                value={currency}
                                onValueChange={setCurrency}
                                placeholder="All currencies"
                                options={currencies.map((item) => ({
                                    value: item.code,
                                    label: item.label,
                                }))}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <IndexTableHeaderRow>
                                    <SortableTableHead path="/payroll/results" filters={filters} sortKey="employee" className="pl-6">
                                        Employee
                                    </SortableTableHead>
                                    <SortableTableHead path="/payroll/results" filters={filters} sortKey="period">
                                        Period
                                    </SortableTableHead>
                                    <SortableTableHead path="/payroll/results" filters={filters} sortKey="gross_pay">
                                        Gross
                                    </SortableTableHead>
                                    <SortableTableHead path="/payroll/results" filters={filters} sortKey="total_deductions">
                                        Deductions
                                    </SortableTableHead>
                                    <SortableTableHead path="/payroll/results" filters={filters} sortKey="net_pay">
                                        Net
                                    </SortableTableHead>
                                    <IndexTableHead>
                                        Settlement Split
                                    </IndexTableHead>
                                    <SortableTableHead path="/payroll/results" filters={filters} sortKey="status">
                                        Status
                                    </SortableTableHead>
                                    <IndexTableHead align="right" className="pr-6">
                                        Actions
                                    </IndexTableHead>
                                </IndexTableHeaderRow>
                            </TableHeader>
                            <TableBody>
                                {results.data.length > 0 ? (
                                    results.data.map((row) => (
                                        <TableRow key={row.id} className="transition-colors hover:bg-muted/30">
                                            <TableCell className="py-4 pl-6">
                                                <div className="space-y-1">
                                                    <div className="text-sm font-bold text-foreground">
                                                        {row.employee.full_name}
                                                    </div>
                                                    <div className="font-mono text-xs text-muted-foreground">
                                                        {row.employee.staff_number}
                                                    </div>
                                                    <div className="text-xs font-medium text-muted-foreground">
                                                        {row.employee.department || 'Unassigned department'}
                                                        {' · '}
                                                        {row.employee.pay_point || 'No pay point'}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="text-sm font-bold text-foreground">
                                                        {row.period.name || row.period.code || 'Payroll Period'}
                                                    </div>
                                                    <div className="text-xs font-medium text-muted-foreground">
                                                        {row.period.pay_date || 'No pay date'}
                                                        {row.period.run_number ? ` · Run ${row.period.run_number}` : ''}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono text-sm font-bold text-foreground">
                                                {row.totals.currency} {row.totals.gross_pay.toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="font-mono text-sm font-bold text-foreground">
                                                        {row.totals.currency} {row.totals.total_deductions.toFixed(2)}
                                                    </div>
                                                    <div className="text-xs font-medium text-muted-foreground">
                                                        Tax {row.totals.currency} {row.totals.tax_amount.toFixed(2)}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="font-mono text-sm font-extrabold text-foreground">
                                                        {row.totals.currency} {row.totals.net_pay.toFixed(2)}
                                                    </div>
                                                    <div className="text-xs font-medium text-muted-foreground">
                                                        {row.line_count} line items
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs font-bold text-foreground">
                                                {row.settlements_preview}
                                            </TableCell>
                                            <TableCell>{statusBadge(row.period.run_status || 'PROCESSED')}</TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <div className="flex flex-wrap items-center justify-end gap-2">
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        title="Open payroll period"
                                                    >
                                                        <Link href={row.period_url}>
                                                            <FolderSearch2 className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    {canViewPayslip && (
                                                        <Button
                                                            asChild
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                            title="View payslip"
                                                        >
                                                            <Link href={row.payslip_url}>
                                                                <ReceiptText className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    {canDownload && (
                                                        <Button
                                                            asChild
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                            title="Download payslip PDF"
                                                        >
                                                            <a href={row.download_url}>
                                                                <Download className="h-4 w-4" />
                                                            </a>
                                                        </Button>
                                                    )}
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        title="Open result context"
                                                    >
                                                        <Link
                                                            href={`${row.period_url}?search=${encodeURIComponent(row.employee.staff_number)}`}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <IndexTableEmptyRow colSpan={8}>
                                        No payroll results match the current filters.
                                    </IndexTableEmptyRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <IndexTablePagination
                        pagination={results}
                        filters={filters}
                        path="/payroll/results"
                        label="results"
                    />
                </Card>
            </div>
        </AppLayout>
    );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
    return (
        <Card className="border-border bg-background shadow-sm">
            <CardContent className="flex h-full min-h-[110px] flex-col justify-between p-5">
                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                    {label}
                </p>
                <div className="mt-2">
                    <span className="font-mono text-2xl font-extrabold text-foreground">
                        {value}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}

function FilterSelect({
    value,
    onValueChange,
    placeholder,
    options,
}: {
    value: string;
    onValueChange: (value: string) => void;
    placeholder: string;
    options: Array<{ value: string; label: string }>;
}) {
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="h-10 border-border/50 bg-background text-sm shadow-sm">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">{placeholder}</SelectItem>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

function statusBadge(status: string) {
    const variants: Record<string, string> = {
        PROCESSED: 'border-transparent bg-primary/10 text-primary',
        APPROVED: 'border-transparent bg-emerald-100 text-emerald-700',
        CLOSED: 'border-transparent bg-muted text-muted-foreground',
        SUPERSEDED: 'border-transparent bg-amber-100 text-amber-700',
    };

    return (
        <Badge
            variant="outline"
            className={`px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase shadow-none ${variants[status] ?? 'border-border bg-background text-foreground'}`}
        >
            {status}
        </Badge>
    );
}
