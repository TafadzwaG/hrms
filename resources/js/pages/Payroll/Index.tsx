import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { useAuthorization } from '@/lib/authorization';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity,
    ArrowRight,
    Calculator,
    CalendarPlus,
    CreditCard,
    Download,
    FolderKanban,
    ReceiptText,
    Settings2,
    ShieldCheck,
    UploadCloud,
    Wallet,
} from 'lucide-react';

type PeriodSummary = {
    id: number;
    code: string;
    name: string;
    frequency: string;
    currency: string;
    status: string;
    period_start: string | null;
    period_end: string | null;
    pay_date: string | null;
    run_number: number | null;
    gross_total: number;
    net_total: number;
    employee_count: number;
    show_url: string;
    latest_run: {
        id: number;
        run_number: number;
        status: string;
        employee_count: number;
        gross_total: number;
        taxable_total: number;
        deduction_total: number;
        net_total: number;
    } | null;
};

type Summary = {
    periods_total: number;
    draft_periods: number;
    closed_periods: number;
    active_profiles: number;
    pay_codes: number;
    pending_inputs: number;
    latest_closed_net_total: number;
};

export default function PayrollDashboard() {
    const { summary, currentPeriod, recentPeriods, quickActions } = usePage<{
        summary: Summary;
        currentPeriod: PeriodSummary | null;
        recentPeriods: PeriodSummary[];
        quickActions: Array<{
            label: string;
            href: string;
            description?: string;
        }>;
    }>().props;

    const { can } = useAuthorization();

    const cards = [
        {
            label: 'Payroll Periods',
            value: summary.periods_total,
            icon: FolderKanban,
        },
        {
            label: 'Draft Periods',
            value: summary.draft_periods,
            icon: Calculator,
        },
        {
            label: 'Active Profiles',
            value: summary.active_profiles,
            icon: CreditCard,
        },
        { label: 'Pay Codes', value: summary.pay_codes, icon: Settings2 },
        {
            label: 'Pending Inputs',
            value: summary.pending_inputs,
            icon: ReceiptText,
        },
        {
            label: 'Latest Closed Net',
            value: summary.latest_closed_net_total.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }),
            icon: Wallet,
        },
    ];

    // Helper to assign semantic icons to quick actions
    const getQuickActionIcon = (label: string) => {
        const lower = label.toLowerCase();
        if (lower.includes('setup') || lower.includes('period'))
            return CalendarPlus;
        if (lower.includes('upload') || lower.includes('bulk'))
            return UploadCloud;
        if (lower.includes('variance') || lower.includes('review'))
            return Activity;
        if (lower.includes('export') || lower.includes('bank')) return Download;
        return ArrowRight;
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Control Center', href: '/control-center' },
                { title: 'Payroll', href: '/payroll' },
            ]}
        >
            <Head title="Payroll Dashboard" />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-8 bg-muted/5 p-4 md:p-6 lg:p-8 xl:p-12">
                {/* Header Section */}
                <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Payroll operations
                        </h1>
                        <p className="mt-2 max-w-3xl text-sm leading-relaxed font-medium text-muted-foreground">
                            Manage payroll periods, employee payroll profiles,
                            inputs, approvals, payslips, and downstream export
                            outputs.
                        </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                        {can('payroll.reports.view') && (
                            <Button
                                asChild
                                variant="outline"
                                className="h-11 border-border bg-background px-6 font-bold text-foreground shadow-sm"
                            >
                                <Link href="/payroll/reports">Reports</Link>
                            </Button>
                        )}
                        {can('payroll.manage') && (
                            <Button
                                asChild
                                className="h-11 bg-foreground px-8 font-bold text-background shadow-sm hover:bg-foreground/90"
                            >
                                <Link href="/payroll/periods">Open period</Link>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Top Metrics Row */}
                <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
                    {cards.map((card) => (
                        <Card
                            key={card.label}
                            className="border-border bg-background shadow-sm"
                        >
                            <CardContent className="flex h-full flex-col justify-between gap-3 p-5">
                                <div className="flex items-start justify-between">
                                    <p className="max-w-[80%] text-[10px] leading-tight font-bold tracking-widest text-muted-foreground uppercase">
                                        {card.label}
                                    </p>
                                    <card.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                                </div>
                                <div className="mt-2">
                                    <p
                                        className={`font-extrabold tracking-tighter text-foreground ${card.label === 'Latest Closed Net' ? 'font-mono text-2xl' : 'text-3xl'}`}
                                    >
                                        {card.value}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Split Layout */}
                <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12 xl:gap-12">
                    {/* LEFT COLUMN: Current Focus (Spans 8/12) */}
                    <div className="flex flex-col space-y-8 lg:col-span-8">
                        <Card className="flex-1 border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="text-base font-bold text-foreground">
                                    Current payroll focus
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Latest draft or active payroll period in the
                                    current organization.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8 p-6 md:p-8">
                                {currentPeriod ? (
                                    <>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge
                                                variant="secondary"
                                                className="border-transparent bg-muted px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-foreground uppercase shadow-none"
                                            >
                                                {currentPeriod.status}
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className="border-border px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase shadow-none"
                                            >
                                                {currentPeriod.frequency}
                                            </Badge>
                                            {currentPeriod.run_number && (
                                                <Badge
                                                    variant="outline"
                                                    className="border-border px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase shadow-none"
                                                >
                                                    Run{' '}
                                                    {currentPeriod.run_number}
                                                </Badge>
                                            )}
                                        </div>

                                        <div>
                                            <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                                                {currentPeriod.name}
                                            </h2>
                                            <p className="mt-2 text-sm font-medium text-muted-foreground">
                                                {currentPeriod.period_start} to{' '}
                                                {currentPeriod.period_end}{' '}
                                                <span className="mx-2 opacity-50">
                                                    •
                                                </span>{' '}
                                                Pay date:{' '}
                                                <strong className="text-foreground">
                                                    {currentPeriod.pay_date}
                                                </strong>
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                            <Metric
                                                label="Employees"
                                                value={
                                                    currentPeriod.employee_count
                                                }
                                            />
                                            <Metric
                                                label="Gross Total"
                                                value={`${currentPeriod.currency} ${currentPeriod.gross_total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                                                isCurrency
                                            />
                                            <Metric
                                                label="Net Total"
                                                value={`${currentPeriod.currency} ${currentPeriod.net_total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                                                isCurrency
                                            />
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 border-t border-border/50 pt-4">
                                            <Button
                                                asChild
                                                className="h-10 bg-foreground px-6 font-bold text-background shadow-sm hover:bg-foreground/90"
                                            >
                                                <Link
                                                    href={
                                                        currentPeriod.show_url
                                                    }
                                                >
                                                    Open active period
                                                </Link>
                                            </Button>
                                            <Button
                                                asChild
                                                variant="outline"
                                                className="h-10 border-border px-6 font-bold shadow-sm"
                                            >
                                                <Link href="/payroll/inputs">
                                                    Capture inputs
                                                </Link>
                                            </Button>
                                            <Button
                                                asChild
                                                variant="outline"
                                                className="h-10 border-border px-6 font-bold shadow-sm"
                                            >
                                                <Link href="/payroll/profiles">
                                                    Payroll profiles
                                                </Link>
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <EmptyState
                                        title="No active payroll period"
                                        description="Create the first payroll period to start capturing inputs and processing payroll."
                                        href="/payroll/periods"
                                        canShow={can('payroll.manage')}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: Side Panels (Spans 4/12) */}
                    <div className="flex flex-col gap-8 lg:col-span-4">
                        {/* Quick Actions Card */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="text-base font-bold text-foreground">
                                    Quick actions
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Common payroll setup and processing entry
                                    points.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 p-6">
                                {(quickActions?.length > 0
                                    ? quickActions
                                    : [
                                          {
                                              label: 'Setup new period',
                                              href: '#',
                                          },
                                          {
                                              label: 'Upload bulk inputs',
                                              href: '#',
                                          },
                                          {
                                              label: 'Review variances',
                                              href: '#',
                                          },
                                          {
                                              label: 'Export bank file',
                                              href: '#',
                                          },
                                      ]
                                ).map((action, idx) => {
                                    const ActionIcon = getQuickActionIcon(
                                        action.label,
                                    );
                                    return (
                                        <Link
                                            key={idx}
                                            href={action.href}
                                            className="group flex items-center justify-between rounded-xl border border-border bg-muted/5 p-4 text-sm font-bold text-foreground shadow-sm transition-colors hover:bg-muted/20"
                                        >
                                            <div className="flex items-center gap-3">
                                                <ActionIcon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                                                <span>{action.label}</span>
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-50 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                                        </Link>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        {/* Compliance Hub Card */}
                        <Card className="flex-1 border-border bg-muted/20 shadow-sm">
                            <CardContent className="flex items-start gap-4 p-6">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background shadow-sm">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div className="mt-0.5 space-y-2">
                                    <h4 className="text-sm font-bold text-foreground">
                                        Compliance Hub
                                    </h4>
                                    <p className="text-xs leading-relaxed font-medium text-muted-foreground">
                                        Ensure your payroll runs meet all
                                        statutory tax and deduction
                                        requirements. Audit trails are active.
                                    </p>
                                    <Button
                                        variant="link"
                                        className="mt-2 h-auto p-0 text-[10px] font-bold tracking-widest text-foreground uppercase transition-colors hover:text-primary"
                                    >
                                        View compliance status
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Bottom Full-Width Section: Recent Periods */}
                <Card className="w-full border-border bg-background shadow-sm">
                    <CardHeader className="border-b border-border/50 pb-4">
                        <CardTitle className="text-base font-bold text-foreground">
                            Recent payroll periods
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {recentPeriods.length === 0 ? (
                            <div className="p-8 text-center text-sm font-medium text-muted-foreground">
                                No historical payroll periods are available for
                                this organization.
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {recentPeriods.map((period, idx) => (
                                    <div
                                        key={period.id}
                                        className={`flex flex-col justify-between gap-6 p-6 transition-colors hover:bg-muted/10 sm:flex-row sm:items-center ${idx !== recentPeriods.length - 1 ? 'border-b border-border/50' : ''}`}
                                    >
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className="text-base font-extrabold text-foreground">
                                                    {period.name}
                                                </span>
                                                <Badge
                                                    variant="secondary"
                                                    className="border-transparent bg-muted px-2 py-0.5 text-[9px] font-bold tracking-widest text-foreground uppercase shadow-none"
                                                >
                                                    {period.status}
                                                </Badge>
                                                {period.run_number && (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-border px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase shadow-none"
                                                    >
                                                        Run {period.run_number}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-xs font-medium text-muted-foreground">
                                                {period.code}{' '}
                                                <span className="mx-1.5 opacity-50">
                                                    •
                                                </span>{' '}
                                                {period.period_start} to{' '}
                                                {period.period_end}{' '}
                                                <span className="mx-1.5 opacity-50">
                                                    •
                                                </span>{' '}
                                                Paid: {period.pay_date}
                                            </p>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-6 sm:gap-8">
                                            <div className="hidden space-y-1 text-right md:block">
                                                <p className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    Employees
                                                </p>
                                                <p className="text-sm font-bold text-foreground">
                                                    {period.employee_count}
                                                </p>
                                            </div>
                                            <div className="hidden space-y-1 text-right sm:block">
                                                <p className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    Gross
                                                </p>
                                                <p className="font-mono text-sm font-bold text-foreground">
                                                    {period.currency}{' '}
                                                    {period.gross_total.toLocaleString(
                                                        undefined,
                                                        {
                                                            minimumFractionDigits: 2,
                                                        },
                                                    )}
                                                </p>
                                            </div>
                                            <div className="space-y-1 text-right">
                                                <p className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    Net
                                                </p>
                                                <p className="font-mono text-sm font-bold text-foreground">
                                                    {period.currency}{' '}
                                                    {period.net_total.toLocaleString(
                                                        undefined,
                                                        {
                                                            minimumFractionDigits: 2,
                                                        },
                                                    )}
                                                </p>
                                            </div>
                                            <Button
                                                asChild
                                                variant="outline"
                                                className="ml-2 h-9 border-border px-5 font-bold shadow-sm"
                                            >
                                                <Link href={period.show_url}>
                                                    Open
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Minimal Footer */}
            <div className="flex items-center justify-center border-t bg-background px-8 py-6 text-[11px] font-medium text-muted-foreground">
                <p>© 2026 Providence HRMS. Payroll Management Engine.</p>
            </div>
        </AppLayout>
    );
}

// --- Sub Components ---

function Metric({
    label,
    value,
    isCurrency = false,
}: {
    label: string;
    value: string | number;
    isCurrency?: boolean;
}) {
    return (
        <div className="rounded-xl border border-border bg-muted/10 p-4 shadow-sm">
            <p className="mb-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                {label}
            </p>
            <p
                className={`text-xl font-bold text-foreground ${isCurrency ? 'font-mono' : ''}`}
            >
                {value}
            </p>
        </div>
    );
}

function EmptyState({
    title,
    description,
    href,
    canShow,
}: {
    title: string;
    description: string;
    href: string;
    canShow: boolean;
}) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/5 p-12 text-center">
            <p className="text-lg font-bold text-foreground">{title}</p>
            <p className="mt-2 max-w-sm text-sm font-medium text-muted-foreground">
                {description}
            </p>
            {canShow && (
                <Button
                    asChild
                    className="mt-6 bg-foreground px-8 font-bold text-background shadow-sm hover:bg-foreground/90"
                >
                    <Link href={href}>Create Period</Link>
                </Button>
            )}
        </div>
    );
}
