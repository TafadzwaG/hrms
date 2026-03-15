import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { useAuthorization } from '@/lib/authorization';
import { Head, Link, router } from '@inertiajs/react';
import { Download, Mail, MessageSquare } from 'lucide-react';

type Payslip = {
    id: number;
    employee: {
        id: number;
        staff_number: string;
        full_name: string;
        department: string | null;
        position: string | null;
        pay_point: string | null;
        email: string | null;
        contact_number: string | null;
    };
    organization: {
        id: number;
        name: string;
        code: string | null;
    };
    period: {
        id: number | null;
        code: string | null;
        name: string | null;
        period_start: string | null;
        period_end: string | null;
        pay_date: string | null;
        run_number: number | null;
    };
    banking: {
        bank_name: string | null;
        account_name: string | null;
        account_number: string | null;
    };
    totals: {
        basic_salary: number;
        gross_pay: number;
        pre_tax_deductions: number;
        taxable_income: number;
        tax_amount: number;
        statutory_deductions: number;
        voluntary_deductions: number;
        total_deductions: number;
        net_pay: number;
        currency: string;
    };
    settlements: Array<{
        currency: string;
        base_currency: string;
        base_amount: number;
        settlement_amount: number;
        exchange_rate: number | null;
        allocation_method: string;
        rule_currency: string | null;
    }>;
    earnings: Array<{ code: string; description: string; amount: number; quantity: number | null; rate: number | null }>;
    deductions: Array<{ code: string; description: string; amount: number; category: string | null }>;
    download_url: string;
    sms_summary_preview: string;
    delivery_history: Array<{
        id: number;
        channel: string;
        recipient: string | null;
        status: string;
        failure_reason: string | null;
        attempts: number;
        sent_at: string | null;
        created_at: string | null;
        created_by: { id: number; name: string } | null;
        metadata: Record<string, unknown>;
    }>;
};

export default function PayslipShow({ payslip }: { payslip: Payslip }) {
    const { canAny } = useAuthorization();

    const canDownload = canAny(['payslips.download', 'payroll.export']);
    const canEmail = canAny(['payslips.email', 'payroll.export']);
    const canSms = canAny(['payslips.sms', 'payroll.export']);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Payroll', href: '/payroll' },
                { title: 'Payslips', href: '/payroll/payslips' },
                { title: payslip.employee.full_name, href: `/payroll/payslips/${payslip.id}` },
            ]}
        >
            <Head title={`${payslip.employee.full_name} Payslip`} />

            <div className="flex min-h-[calc(100vh-64px)] flex-col gap-6 bg-muted/10 p-4 md:p-6 lg:p-8 xl:p-12">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                                {payslip.employee.full_name}
                            </h1>
                            {payslip.period.run_number ? <Badge variant="secondary">Run {payslip.period.run_number}</Badge> : null}
                        </div>
                        <p className="mt-2 text-sm font-medium text-muted-foreground">
                            {payslip.employee.staff_number} · {payslip.period.code} · {payslip.period.period_start} to {payslip.period.period_end}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button asChild variant="outline" className="h-11 border-border bg-background px-6 font-bold shadow-sm">
                            <Link href="/payroll/payslips">Back to payslips</Link>
                        </Button>
                        {canEmail && (
                            <Button
                                variant="outline"
                                disabled={!payslip.employee.email}
                                className="h-11 border-border bg-background px-6 font-bold shadow-sm"
                                onClick={() => router.post(`/payroll/payslips/${payslip.id}/email`, {}, { preserveScroll: true })}
                            >
                                <Mail className="mr-2 h-4 w-4" />
                                Email
                            </Button>
                        )}
                        {canSms && (
                            <Button
                                variant="outline"
                                disabled={!payslip.employee.contact_number}
                                className="h-11 border-border bg-background px-6 font-bold shadow-sm"
                                onClick={() => router.post(`/payroll/payslips/${payslip.id}/sms`, {}, { preserveScroll: true })}
                            >
                                <MessageSquare className="mr-2 h-4 w-4" />
                                SMS
                            </Button>
                        )}
                        {canDownload && (
                            <Button asChild className="h-11 bg-foreground px-6 font-bold text-background">
                                <a href={payslip.download_url}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download PDF
                                </a>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <Card className="border-border bg-background shadow-sm">
                        <CardHeader className="border-b border-border/50">
                            <CardTitle>Payslip summary</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 p-6 md:grid-cols-2">
                            <Summary label="Organization" value={payslip.organization.name} />
                            <Summary label="Department" value={payslip.employee.department ?? 'N/A'} />
                            <Summary label="Position" value={payslip.employee.position ?? 'N/A'} />
                            <Summary label="Pay date" value={payslip.period.pay_date ?? 'N/A'} />
                            <Summary label="Pay point" value={payslip.employee.pay_point ?? 'N/A'} />
                            <Summary label="Bank" value={payslip.banking.bank_name ?? 'N/A'} />
                            <Summary label="Account" value={payslip.banking.account_number ?? 'N/A'} />
                            <Summary label="Email recipient" value={payslip.employee.email ?? 'No email address'} />
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardHeader className="border-b border-border/50">
                            <CardTitle>Totals</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 p-6">
                            <Summary label="Basic salary" value={`${payslip.totals.currency} ${payslip.totals.basic_salary.toFixed(2)}`} />
                            <Summary label="Gross pay" value={`${payslip.totals.currency} ${payslip.totals.gross_pay.toFixed(2)}`} />
                            <Summary label="Taxable income" value={`${payslip.totals.currency} ${payslip.totals.taxable_income.toFixed(2)}`} />
                            <Summary label="PAYE" value={`${payslip.totals.currency} ${payslip.totals.tax_amount.toFixed(2)}`} />
                            <Summary label="Total deductions" value={`${payslip.totals.currency} ${payslip.totals.total_deductions.toFixed(2)}`} />
                            <Summary label="Net pay" value={`${payslip.totals.currency} ${payslip.totals.net_pay.toFixed(2)}`} />
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-border bg-background shadow-sm">
                    <CardHeader className="border-b border-border/50">
                        <CardTitle>Delivery history</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6">
                        <div className="rounded-2xl border border-border bg-muted/10 p-4 text-sm text-muted-foreground">
                            SMS preview: <span className="font-medium text-foreground">{payslip.sms_summary_preview}</span>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Channel</TableHead>
                                    <TableHead>Recipient</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>When</TableHead>
                                    <TableHead>Attempts</TableHead>
                                    <TableHead>Actor</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payslip.delivery_history.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                                            No delivery events have been recorded for this payslip.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    payslip.delivery_history.map((delivery) => (
                                        <TableRow key={delivery.id}>
                                            <TableCell>{delivery.channel}</TableCell>
                                            <TableCell>{delivery.recipient ?? 'N/A'}</TableCell>
                                            <TableCell>{statusBadge(delivery.status)}</TableCell>
                                            <TableCell>{delivery.sent_at ?? delivery.created_at ?? 'N/A'}</TableCell>
                                            <TableCell>{delivery.attempts}</TableCell>
                                            <TableCell>{delivery.created_by?.name ?? 'System'}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="border-border bg-background shadow-sm">
                    <CardHeader className="border-b border-border/50">
                        <CardTitle>Settlement breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Currency</TableHead>
                                    <TableHead>Allocation</TableHead>
                                    <TableHead>Base Amount</TableHead>
                                    <TableHead>Settlement Amount</TableHead>
                                    <TableHead>Rate</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payslip.settlements.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-sm text-muted-foreground">
                                            No multi-currency settlements were recorded for this payslip.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    payslip.settlements.map((settlement, index) => (
                                        <TableRow key={`${settlement.currency}-${index}`}>
                                            <TableCell>{settlement.currency}</TableCell>
                                            <TableCell>{settlement.allocation_method}</TableCell>
                                            <TableCell>{settlement.base_currency} {settlement.base_amount.toFixed(2)}</TableCell>
                                            <TableCell>{settlement.currency} {settlement.settlement_amount.toFixed(2)}</TableCell>
                                            <TableCell>{settlement.exchange_rate ? settlement.exchange_rate.toFixed(8) : '1.00000000'}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="grid gap-6 xl:grid-cols-2">
                    <Card className="border-border bg-background shadow-sm">
                        <CardHeader className="border-b border-border/50">
                            <CardTitle>Earnings</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {payslip.earnings.map((earning) => (
                                        <TableRow key={`${earning.code}-${earning.description}`}>
                                            <TableCell>{earning.code}</TableCell>
                                            <TableCell>{earning.description}</TableCell>
                                            <TableCell>{payslip.totals.currency} {earning.amount.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardHeader className="border-b border-border/50">
                            <CardTitle>Deductions</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {payslip.deductions.map((deduction) => (
                                        <TableRow key={`${deduction.code}-${deduction.description}`}>
                                            <TableCell>{deduction.code}</TableCell>
                                            <TableCell>{deduction.description}</TableCell>
                                            <TableCell>{payslip.totals.currency} {deduction.amount.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

function Summary({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-border bg-muted/10 p-4">
            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">{label}</p>
            <p className="mt-2 font-semibold text-foreground">{value}</p>
        </div>
    );
}

function statusBadge(status: string) {
    const styles: Record<string, string> = {
        SENT: 'border-transparent bg-primary/10 text-primary',
        PENDING: 'border-transparent bg-amber-100 text-amber-700',
        FAILED: 'border-transparent bg-destructive/10 text-destructive',
    };

    return (
        <Badge
            variant="outline"
            className={`px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase shadow-none ${styles[status] ?? 'border-border bg-background text-muted-foreground'}`}
        >
            {status.replace('_', ' ')}
        </Badge>
    );
}
