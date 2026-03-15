import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Head, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Calculator,
    FileSpreadsheet,
    FileText,
    Landmark,
    LineChart,
    Receipt,
    Scale,
    Wallet,
    WalletCards,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import moment from 'moment';

type SelectedRun = {
    id: number;
    period: {
        id: number | null;
        code: string | null;
        name: string | null;
        period_start: string | null;
        period_end: string | null;
    };
    run_number: number;
    status: string;
    employee_count: number;
    gross_total: number;
    taxable_total: number;
    deduction_total: number;
    net_total: number;
    earnings_total: number;
    statutory_total: number;
    settlement_totals: Array<{ currency: string; settlement_total: number }>;
    register_url: string;
    earnings_url: string;
    deductions_url: string;
    statutory_url: string;
    bank_url: string;
    journal_url: string;
} | null;

export default function PayrollReportsIndex() {
    const { periods, selectedRun, exportHistory } = usePage<{
        periods: Array<{
            id: number;
            code: string;
            name: string;
            status: string;
            latest_run: {
                id: number;
                run_number: number;
                net_total: number;
                status: string;
            } | null;
        }>;
        selectedRun: SelectedRun;
        exportHistory: Array<{
            id: number;
            export_type: string | null;
            status: string;
            export_version: string;
            file_reference: string | null;
            created_at: string | null;
        }>;
    }>().props;
    const [runId, setRunId] = useState(
        selectedRun ? String(selectedRun.id) : 'none',
    );

    const handleRunSelect = (value: string) => {
        setRunId(value);
        router.get(
            '/payroll/reports',
            { run_id: value === 'none' ? '' : value },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Control Center', href: '/control-center' },
                { title: 'Payroll', href: '/payroll' },
                { title: 'Reports', href: '#' },
            ]}
        >
            <Head title="Payroll Reports" />

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
                                Payroll reports
                            </h1>
                            <p className="mt-2 max-w-3xl text-sm leading-relaxed font-medium text-muted-foreground">
                                Generate payroll register, deductions,
                                statutory, bank, and journal outputs from
                                processed payroll runs.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Split Layout */}
                <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12 xl:gap-12">
                    {/* LEFT COLUMN: Current Context & Exports (Spans 8/12) */}
                    <div className="flex flex-col space-y-8 lg:col-span-8">
                        {/* Selector Card */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="flex flex-col gap-4 text-base font-bold text-foreground md:flex-row md:items-center md:justify-between">
                                    <span>Select payroll context</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <Select
                                    value={runId}
                                    onValueChange={handleRunSelect}
                                >
                                    <SelectTrigger className="h-11 w-full border-border bg-muted/10 font-medium shadow-sm md:w-full">
                                        <SelectValue placeholder="Choose payroll run" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            Select payroll run
                                        </SelectItem>
                                        {periods
                                            .filter(
                                                (period) => period.latest_run,
                                            )
                                            .map((period) => (
                                                <SelectItem
                                                    key={period.latest_run?.id}
                                                    value={String(
                                                        period.latest_run?.id,
                                                    )}
                                                >
                                                    {period.code} ({period.name}
                                                    ) • Run{' '}
                                                    {
                                                        period.latest_run
                                                            ?.run_number
                                                    }
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>

                                {selectedRun && (
                                    <div className="mt-6 space-y-6 border-t border-border/50 pt-6">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
                                                    {selectedRun.period.name}
                                                </h2>
                                                <Badge
                                                    variant="secondary"
                                                    className="border-transparent bg-muted px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-foreground uppercase shadow-none"
                                                >
                                                    {selectedRun.status}
                                                </Badge>
                                                <Badge
                                                    variant="outline"
                                                    className="border-border px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase shadow-none"
                                                >
                                                    Run {selectedRun.run_number}
                                                </Badge>
                                            </div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Period code:{' '}
                                                {selectedRun.period.code} •{' '}
                                                {
                                                    selectedRun.period
                                                        .period_start
                                                }{' '}
                                                to{' '}
                                                {selectedRun.period.period_end}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                            <ReportStat
                                                label="Employees"
                                                value={
                                                    selectedRun.employee_count
                                                }
                                                icon={Users}
                                            />
                                            <ReportStat
                                                label="Gross Value"
                                                value={selectedRun.gross_total.toLocaleString(
                                                    undefined,
                                                    {
                                                        minimumFractionDigits: 2,
                                                    },
                                                )}
                                                icon={WalletCards}
                                                isCurrency
                                            />
                                            <ReportStat
                                                label="Net Pay"
                                                value={selectedRun.net_total.toLocaleString(
                                                    undefined,
                                                    {
                                                        minimumFractionDigits: 2,
                                                    },
                                                )}
                                                icon={WalletCards}
                                                isCurrency
                                            />
                                            <ReportStat
                                                label="Taxable"
                                                value={selectedRun.taxable_total.toLocaleString(
                                                    undefined,
                                                    {
                                                        minimumFractionDigits: 2,
                                                    },
                                                )}
                                                icon={Scale}
                                                isCurrency
                                            />
                                            <ReportStat
                                                label="Deductions"
                                                value={selectedRun.deduction_total.toLocaleString(
                                                    undefined,
                                                    {
                                                        minimumFractionDigits: 2,
                                                    },
                                                )}
                                                icon={Receipt}
                                                isCurrency
                                            />
                                            <ReportStat
                                                label="Statutory"
                                                value={selectedRun.statutory_total.toLocaleString(
                                                    undefined,
                                                    {
                                                        minimumFractionDigits: 2,
                                                    },
                                                )}
                                                icon={Landmark}
                                                isCurrency
                                            />
                                        </div>

                                        {selectedRun.settlement_totals.length >
                                            0 && (
                                            <div className="border-t border-border/50 pt-4">
                                                <h3 className="mb-4 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                                    Multi-Currency Settlements
                                                </h3>
                                                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                                                    {selectedRun.settlement_totals.map(
                                                        (settlement) => (
                                                            <ReportStat
                                                                key={
                                                                    settlement.currency
                                                                }
                                                                label={`${settlement.currency} Allocation`}
                                                                value={settlement.settlement_total.toLocaleString(
                                                                    undefined,
                                                                    {
                                                                        minimumFractionDigits: 2,
                                                                    },
                                                                )}
                                                                icon={Wallet}
                                                                isCurrency
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: Output Links (Spans 4/12) */}
                    <div className="flex flex-col space-y-6 lg:col-span-4">
                        <Card className="flex h-full flex-col border-border bg-background shadow-sm">
                            <CardHeader className="shrink-0 border-b border-border/50 pb-4">
                                <CardTitle className="text-base font-bold text-foreground">
                                    Available outputs
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-1 flex-col gap-3 p-6">
                                {selectedRun ? (
                                    <>
                                        <ExportLink
                                            label="Master Payroll Register"
                                            description="Comprehensive run details"
                                            href={selectedRun.register_url}
                                            icon={FileSpreadsheet}
                                        />
                                        <ExportLink
                                            label="Earnings Summary"
                                            description="Grouped by earning code"
                                            href={selectedRun.earnings_url}
                                            icon={LineChart}
                                        />
                                        <ExportLink
                                            label="Deductions Summary"
                                            description="Internal & external deductions"
                                            href={selectedRun.deductions_url}
                                            icon={Calculator}
                                        />
                                        <ExportLink
                                            label="Statutory Remittances"
                                            description="PAYE, NSSA, Pension, Union"
                                            href={selectedRun.statutory_url}
                                            icon={Landmark}
                                        />
                                        <ExportLink
                                            label="Bank Transfer File"
                                            description="Formatted for bank import"
                                            href={selectedRun.bank_url}
                                            icon={WalletCards}
                                        />
                                        <ExportLink
                                            label="GL Journal Summary"
                                            description="Finance accounting output"
                                            href={selectedRun.journal_url}
                                            icon={FileText}
                                        />
                                    </>
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/50 bg-muted/5 p-8 text-center">
                                        <FileSpreadsheet className="mb-3 h-8 w-8 text-muted-foreground/50" />
                                        <p className="text-sm leading-relaxed font-medium text-muted-foreground">
                                            Select a processed payroll run from
                                            the dropdown to access output
                                            reports.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Bottom Section: Historical Export Log */}
                <Card className="w-full border-border bg-background shadow-sm">
                    <CardHeader className="border-b border-border/50 pb-4">
                        <CardTitle className="text-base font-bold text-foreground">
                            Export history log
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b border-border/50 bg-muted/10 hover:bg-transparent">
                                        <TableHead className="h-12 pl-6 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Report Type
                                        </TableHead>
                                        <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Status
                                        </TableHead>
                                        <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Version
                                        </TableHead>
                                        <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Reference Hash
                                        </TableHead>
                                        <TableHead className="pr-6 text-right text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Generated On
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {exportHistory.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="h-48 text-center text-sm font-medium text-muted-foreground"
                                            >
                                                No payroll reports have been
                                                generated recently.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        exportHistory.map((entry) => (
                                            <TableRow
                                                key={entry.id}
                                                className="transition-colors hover:bg-muted/30"
                                            >
                                                <TableCell className="py-4 pl-6 text-sm font-bold text-foreground">
                                                    {entry.export_type ??
                                                        'Unknown Report'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={`border-transparent px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase shadow-none ${entry.status === 'COMPLETED' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}
                                                    >
                                                        {entry.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-mono text-xs font-medium text-muted-foreground">
                                                    {entry.export_version}
                                                </TableCell>
                                                <TableCell className="font-mono text-xs font-medium text-muted-foreground">
                                                    {entry.file_reference ??
                                                        '—'}
                                                </TableCell>
                                                <TableCell className="pr-6 text-right text-xs font-medium text-muted-foreground">
                                                    {entry.created_at
                                                        ? moment(
                                                              entry.created_at,
                                                          ).format(
                                                              'MMM DD, YYYY HH:mm',
                                                          )
                                                        : 'Unknown'}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Minimal Footer */}
            <div className="flex items-center justify-center border-t bg-background px-8 py-6 text-[11px] font-medium text-muted-foreground">
                <p>© 2024 Providence HRMS. Payroll Reports Engine.</p>
            </div>
        </AppLayout>
    );
}

// --- Sub Components ---

function ReportStat({
    label,
    value,
    icon: Icon,
    isCurrency = false,
}: {
    label: string;
    value: string | number;
    icon: any;
    isCurrency?: boolean;
}) {
    return (
        <Card className="border-border bg-muted/10 shadow-sm transition-colors hover:bg-muted/20">
            <CardContent className="flex h-full min-h-[110px] flex-col justify-between gap-3 p-5">
                <div className="flex items-start justify-between">
                    <p className="max-w-[70%] text-[10px] leading-tight font-bold tracking-widest text-muted-foreground uppercase">
                        {label}
                    </p>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border/50 bg-background text-muted-foreground shadow-sm">
                        <Icon className="h-4 w-4" />
                    </div>
                </div>
                <div className="mt-auto">
                    <p
                        className={`text-2xl font-extrabold tracking-tighter text-foreground ${isCurrency ? 'font-mono' : ''}`}
                    >
                        {value}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

function ExportLink({
    href,
    label,
    description,
    icon: Icon,
}: {
    href: string;
    label: string;
    description: string;
    icon: any;
}) {
    return (
        <a
            href={href}
            className="group flex items-center justify-between rounded-xl border border-border bg-background p-4 shadow-sm transition-colors hover:bg-muted/10"
        >
            <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted/30 text-muted-foreground transition-colors group-hover:text-foreground">
                    <Icon className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                    <p className="text-sm leading-tight font-bold text-foreground">
                        {label}
                    </p>
                    <p className="text-xs leading-snug font-medium text-muted-foreground">
                        {description}
                    </p>
                </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-50 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
        </a>
    );
}
