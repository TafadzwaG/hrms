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
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Download,
    Eye,
    Mail,
    MessageSquare,
    ReceiptText,
    Search,
    Send,
    Smartphone,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ReactPaginate from 'react-paginate';

type PayslipRow = {
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
    period: {
        id: number | null;
        code: string | null;
        name: string | null;
        pay_date: string | null;
        run_number: number | null;
    };
    totals: {
        currency: string;
        gross_pay: number;
        net_pay: number;
    };
    delivery: {
        email_status: string;
        sms_status: string;
        email_sent_at: string | null;
        sms_sent_at: string | null;
    };
    sms_summary_preview: string;
    view_url: string;
    download_url: string;
};

type PaginatedPayslips = {
    data: PayslipRow[];
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
    email_status?: string;
    sms_status?: string;
};

export default function PayslipIndex() {
    const { payslips, filters, periods, departments, payPoints, deliveryStatuses } =
        usePage<{
            payslips: PaginatedPayslips;
            filters: FilterState;
            periods: Array<{ id: number; label: string }>;
            departments: string[];
            payPoints: string[];
            deliveryStatuses: string[];
        }>().props;

    const { canAny } = useAuthorization();

    const [search, setSearch] = useState(filters.search ?? '');
    const [payrollPeriodId, setPayrollPeriodId] = useState(
        filters.payroll_period_id ? String(filters.payroll_period_id) : 'all',
    );
    const [department, setDepartment] = useState(filters.department || 'all');
    const [payPoint, setPayPoint] = useState(filters.pay_point || 'all');
    const [emailStatus, setEmailStatus] = useState(filters.email_status || 'all');
    const [smsStatus, setSmsStatus] = useState(filters.sms_status || 'all');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [emailTarget, setEmailTarget] = useState<PayslipRow | null>(null);
    const [smsTarget, setSmsTarget] = useState<PayslipRow | null>(null);
    const [bulkEmailOpen, setBulkEmailOpen] = useState(false);
    const [bulkSmsOpen, setBulkSmsOpen] = useState(false);
    const [bulkMode, setBulkMode] = useState<'selected' | 'period'>('selected');

    const canView = canAny(['payslips.view', 'payroll.view']);
    const canDownload = canAny(['payslips.download', 'payroll.export']);
    const canEmail = canAny(['payslips.email', 'payroll.export']);
    const canSms = canAny(['payslips.sms', 'payroll.export']);
    const canBulkEmail = canAny(['payslips.bulk_email', 'payroll.export']);
    const canBulkSms = canAny(['payslips.bulk_sms', 'payroll.export']);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            router.get(
                '/payroll/payslips',
                {
                    search,
                    payroll_period_id: payrollPeriodId === 'all' ? '' : payrollPeriodId,
                    department: department === 'all' ? '' : department,
                    pay_point: payPoint === 'all' ? '' : payPoint,
                    email_status: emailStatus === 'all' ? '' : emailStatus,
                    sms_status: smsStatus === 'all' ? '' : smsStatus,
                },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 300);

        return () => window.clearTimeout(timer);
    }, [search, payrollPeriodId, department, payPoint, emailStatus, smsStatus]);

    useEffect(() => {
        const visibleIds = new Set(payslips.data.map((row) => row.id));
        setSelectedIds((current) => current.filter((id) => visibleIds.has(id)));
    }, [payslips.data]);

    const selectedRows = useMemo(
        () => payslips.data.filter((row) => selectedIds.includes(row.id)),
        [payslips.data, selectedIds],
    );

    const allOnPageSelected =
        payslips.data.length > 0 &&
        payslips.data.every((row) => selectedIds.includes(row.id));

    const toggleAllOnPage = (checked: boolean) => {
        setSelectedIds(checked ? payslips.data.map((row) => row.id) : []);
    };

    const toggleRow = (rowId: number, checked: boolean) => {
        setSelectedIds((current) =>
            checked ? [...new Set([...current, rowId])] : current.filter((id) => id !== rowId),
        );
    };

    const handlePageChange = (selectedItem: { selected: number }) => {
        router.get(
            '/payroll/payslips',
            {
                page: selectedItem.selected + 1,
                search,
                payroll_period_id: payrollPeriodId === 'all' ? '' : payrollPeriodId,
                department: department === 'all' ? '' : department,
                pay_point: payPoint === 'all' ? '' : payPoint,
                email_status: emailStatus === 'all' ? '' : emailStatus,
                sms_status: smsStatus === 'all' ? '' : smsStatus,
            },
            { preserveScroll: true, preserveState: true },
        );
    };

    const sendSingleEmail = () => {
        if (!emailTarget) return;

        router.post(`/payroll/payslips/${emailTarget.id}/email`, {}, {
            preserveScroll: true,
            onSuccess: () => setEmailTarget(null),
        });
    };

    const sendSingleSms = () => {
        if (!smsTarget) return;

        router.post(`/payroll/payslips/${smsTarget.id}/sms`, {}, {
            preserveScroll: true,
            onSuccess: () => setSmsTarget(null),
        });
    };

    const sendBulk = (channel: 'email' | 'sms') => {
        router.post(
            channel === 'email' ? '/payroll/payslips/email' : '/payroll/payslips/sms',
            {
                payroll_result_ids: bulkMode === 'selected' ? selectedIds : [],
                payroll_period_id:
                    bulkMode === 'period' && payrollPeriodId !== 'all' ? payrollPeriodId : '',
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    channel === 'email' ? setBulkEmailOpen(false) : setBulkSmsOpen(false);
                    if (bulkMode === 'selected') {
                        setSelectedIds([]);
                    }
                },
            },
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Payroll', href: '/payroll' },
                { title: 'Payslips', href: '/payroll/payslips' },
            ]}
        >
            <Head title="Payslips" />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-6 bg-muted/10 p-4 md:p-6 lg:p-8 xl:p-12">
                <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Payslip distribution
                        </h1>
                        <p className="mt-2 max-w-3xl text-sm leading-relaxed font-medium text-muted-foreground">
                            Review processed payslips, download employee PDFs, and distribute
                            payroll outcomes by email or SMS.
                        </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                        {canBulkEmail && (
                            <Button
                                variant="outline"
                                className="h-11 border-border bg-background px-5 font-bold shadow-sm"
                                disabled={selectedIds.length === 0 && payrollPeriodId === 'all'}
                                onClick={() => {
                                    setBulkMode(selectedIds.length > 0 ? 'selected' : 'period');
                                    setBulkEmailOpen(true);
                                }}
                            >
                                <Mail className="mr-2 h-4 w-4" />
                                Bulk email
                            </Button>
                        )}
                        {canBulkSms && (
                            <Button
                                className="h-11 bg-foreground px-5 font-bold text-background shadow-sm hover:bg-foreground/90"
                                disabled={selectedIds.length === 0 && payrollPeriodId === 'all'}
                                onClick={() => {
                                    setBulkMode(selectedIds.length > 0 ? 'selected' : 'period');
                                    setBulkSmsOpen(true);
                                }}
                            >
                                <Smartphone className="mr-2 h-4 w-4" />
                                Bulk SMS
                            </Button>
                        )}
                    </div>
                </div>

                <Card className="flex h-[calc(100vh-220px)] flex-col overflow-hidden border-border bg-background shadow-sm">
                    <div className="flex shrink-0 flex-col gap-4 border-b border-border/50 p-4 md:p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center gap-4">
                                <h2 className="text-base font-bold text-foreground">
                                    Processed payslips
                                </h2>
                                <Badge
                                    variant="secondary"
                                    className="border-transparent bg-muted px-2 py-0.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase shadow-none"
                                >
                                    {payslips.total} total
                                </Badge>
                                {selectedIds.length > 0 && (
                                    <Badge
                                        variant="outline"
                                        className="border-border px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase shadow-none"
                                    >
                                        {selectedIds.length} selected
                                    </Badge>
                                )}
                            </div>

                            {payrollPeriodId !== 'all' && (
                                <div className="flex flex-wrap items-center gap-3">
                                    {canBulkEmail && (
                                        <Button
                                            variant="outline"
                                            className="h-10 border-border px-4 font-bold shadow-sm"
                                            onClick={() => {
                                                setBulkMode('period');
                                                setBulkEmailOpen(true);
                                            }}
                                        >
                                            <Send className="mr-2 h-4 w-4" />
                                            Email selected period
                                        </Button>
                                    )}
                                    {canBulkSms && (
                                        <Button
                                            variant="outline"
                                            className="h-10 border-border px-4 font-bold shadow-sm"
                                            onClick={() => {
                                                setBulkMode('period');
                                                setBulkSmsOpen(true);
                                            }}
                                        >
                                            <MessageSquare className="mr-2 h-4 w-4" />
                                            SMS selected period
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
                            <div className="relative xl:col-span-2">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search employee or staff number..."
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
                                value={emailStatus}
                                onValueChange={setEmailStatus}
                                placeholder="Email status"
                                options={deliveryStatuses.map((item) => ({
                                    value: item,
                                    label: item,
                                }))}
                            />
                            <FilterSelect
                                value={smsStatus}
                                onValueChange={setSmsStatus}
                                placeholder="SMS status"
                                options={deliveryStatuses.map((item) => ({
                                    value: item,
                                    label: item,
                                }))}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-border/50 bg-muted/10 hover:bg-transparent">
                                    <TableHead className="w-14 pl-6">
                                        <Checkbox
                                            checked={allOnPageSelected}
                                            onCheckedChange={(checked) => toggleAllOnPage(Boolean(checked))}
                                            aria-label="Select all payslips on page"
                                        />
                                    </TableHead>
                                    <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Employee
                                    </TableHead>
                                    <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Period
                                    </TableHead>
                                    <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Pay
                                    </TableHead>
                                    <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Email
                                    </TableHead>
                                    <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        SMS
                                    </TableHead>
                                    <TableHead className="pr-6 text-right text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payslips.data.length > 0 ? (
                                    payslips.data.map((row) => (
                                        <TableRow key={row.id} className="transition-colors hover:bg-muted/30">
                                            <TableCell className="pl-6">
                                                <Checkbox
                                                    checked={selectedIds.includes(row.id)}
                                                    onCheckedChange={(checked) =>
                                                        toggleRow(row.id, Boolean(checked))
                                                    }
                                                    aria-label={`Select ${row.employee.full_name}`}
                                                />
                                            </TableCell>
                                            <TableCell className="py-4">
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
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="font-mono text-sm font-bold text-foreground">
                                                        {row.totals.currency} {row.totals.net_pay.toFixed(2)}
                                                    </div>
                                                    <div className="text-xs font-medium text-muted-foreground">
                                                        Gross {row.totals.currency} {row.totals.gross_pay.toFixed(2)}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-2">
                                                    {statusBadge(row.delivery.email_status)}
                                                    <div className="text-xs text-muted-foreground">
                                                        {row.employee.email || 'No email address'}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-2">
                                                    {statusBadge(row.delivery.sms_status)}
                                                    <div className="text-xs text-muted-foreground">
                                                        {row.employee.contact_number || 'No contact number'}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <div className="flex flex-wrap items-center justify-end gap-2">
                                                    {canView && (
                                                        <Button
                                                            asChild
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                            title="View payslip"
                                                        >
                                                            <Link href={row.view_url}>
                                                                <Eye className="h-4 w-4" />
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
                                                    {canEmail && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            disabled={!row.employee.email}
                                                            className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
                                                            title="Email payslip"
                                                            onClick={() => setEmailTarget(row)}
                                                        >
                                                            <Mail className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {canSms && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            disabled={!row.employee.contact_number}
                                                            className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
                                                            title="Send payslip SMS"
                                                            onClick={() => setSmsTarget(row)}
                                                        >
                                                            <Smartphone className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="h-48 text-center text-sm font-medium text-muted-foreground"
                                        >
                                            No processed payslips match the current filters.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {payslips.last_page > 1 && (
                        <div className="flex shrink-0 flex-col items-center justify-between gap-4 border-t border-border/50 bg-muted/5 p-4 sm:flex-row">
                            <span className="text-xs font-bold text-muted-foreground">
                                Page {payslips.current_page} of {payslips.last_page}
                            </span>
                            <ReactPaginate
                                pageCount={payslips.last_page}
                                forcePage={payslips.current_page - 1}
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

            <Dialog open={Boolean(emailTarget)} onOpenChange={(open) => !open && setEmailTarget(null)}>
                <DialogContent size="md">
                    <DialogHeader>
                        <DialogTitle>Email payslip PDF</DialogTitle>
                        <DialogDescription>
                            {emailTarget
                                ? `Send the ${emailTarget.period.name || emailTarget.period.code} payslip PDF to ${emailTarget.employee.full_name}?`
                                : ''}
                        </DialogDescription>
                    </DialogHeader>
                    {emailTarget && (
                        <div className="space-y-3 rounded-2xl border border-border bg-muted/10 p-4 text-sm">
                            <div className="font-bold text-foreground">{emailTarget.employee.email}</div>
                            <div className="text-muted-foreground">
                                Net pay {emailTarget.totals.currency} {emailTarget.totals.net_pay.toFixed(2)}
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEmailTarget(null)}>
                            Cancel
                        </Button>
                        <Button className="bg-foreground text-background hover:bg-foreground/90" onClick={sendSingleEmail}>
                            Queue email
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={Boolean(smsTarget)} onOpenChange={(open) => !open && setSmsTarget(null)}>
                <DialogContent size="md">
                    <DialogHeader>
                        <DialogTitle>Send payslip SMS summary</DialogTitle>
                        <DialogDescription>
                            {smsTarget
                                ? `Send a compact SMS summary for ${smsTarget.employee.full_name}?`
                                : ''}
                        </DialogDescription>
                    </DialogHeader>
                    {smsTarget && (
                        <div className="space-y-3 rounded-2xl border border-border bg-muted/10 p-4 text-sm">
                            <div className="font-bold text-foreground">{smsTarget.employee.contact_number}</div>
                            <div className="text-muted-foreground">{smsTarget.sms_summary_preview}</div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSmsTarget(null)}>
                            Cancel
                        </Button>
                        <Button className="bg-foreground text-background hover:bg-foreground/90" onClick={sendSingleSms}>
                            Queue SMS
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <BulkDialog
                open={bulkEmailOpen}
                onOpenChange={setBulkEmailOpen}
                title="Bulk email payslips"
                description={
                    bulkMode === 'selected'
                        ? `Queue payslip emails for ${selectedIds.length} selected employee(s).`
                        : 'Queue payslip emails for all payslips in the selected payroll period.'
                }
                rows={selectedRows}
                mode={bulkMode}
                onModeChange={setBulkMode}
                payrollPeriodSelected={payrollPeriodId !== 'all'}
                missingCount={selectedRows.filter((row) => !row.employee.email).length}
                actionLabel="Queue emails"
                onConfirm={() => sendBulk('email')}
            />

            <BulkDialog
                open={bulkSmsOpen}
                onOpenChange={setBulkSmsOpen}
                title="Bulk send payslip SMS"
                description={
                    bulkMode === 'selected'
                        ? `Queue payslip SMS summaries for ${selectedIds.length} selected employee(s).`
                        : 'Queue payslip SMS summaries for all payslips in the selected payroll period.'
                }
                rows={selectedRows}
                mode={bulkMode}
                onModeChange={setBulkMode}
                payrollPeriodSelected={payrollPeriodId !== 'all'}
                missingCount={selectedRows.filter((row) => !row.employee.contact_number).length}
                actionLabel="Queue SMS"
                onConfirm={() => sendBulk('sms')}
            />
        </AppLayout>
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
            <SelectTrigger className="h-10 border-border/50 bg-background text-sm font-medium shadow-sm">
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

function BulkDialog({
    open,
    onOpenChange,
    title,
    description,
    rows,
    mode,
    onModeChange,
    payrollPeriodSelected,
    missingCount,
    actionLabel,
    onConfirm,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    rows: PayslipRow[];
    mode: 'selected' | 'period';
    onModeChange: (mode: 'selected' | 'period') => void;
    payrollPeriodSelected: boolean;
    missingCount: number;
    actionLabel: string;
    onConfirm: () => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent size="lg">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {payrollPeriodSelected && (
                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                type="button"
                                variant={mode === 'selected' ? 'default' : 'outline'}
                                className={mode === 'selected' ? 'bg-foreground text-background hover:bg-foreground/90' : ''}
                                onClick={() => onModeChange('selected')}
                            >
                                Selected rows
                            </Button>
                            <Button
                                type="button"
                                variant={mode === 'period' ? 'default' : 'outline'}
                                className={mode === 'period' ? 'bg-foreground text-background hover:bg-foreground/90' : ''}
                                onClick={() => onModeChange('period')}
                            >
                                Entire selected period
                            </Button>
                        </div>
                    )}

                    <div className="rounded-2xl border border-border bg-muted/10 p-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                            <ReceiptText className="h-4 w-4 text-muted-foreground" />
                            {mode === 'selected'
                                ? `${rows.length} payslip(s) selected`
                                : 'All payslips in the selected payroll period will be queued.'}
                        </div>
                        {mode === 'selected' && rows.length > 0 && (
                            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                                {rows.slice(0, 5).map((row) => (
                                    <div key={row.id} className="flex justify-between gap-4">
                                        <span>{row.employee.full_name}</span>
                                        <span className="font-mono">
                                            {row.totals.currency} {row.totals.net_pay.toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                                {rows.length > 5 && (
                                    <div className="text-xs font-medium">
                                        +{rows.length - 5} more selected payslip(s)
                                    </div>
                                )}
                            </div>
                        )}
                        {missingCount > 0 && (
                            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
                                {missingCount} selected record(s) are missing recipient contact data and will be marked as failed.
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button className="bg-foreground text-background hover:bg-foreground/90" onClick={onConfirm}>
                        {actionLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function statusBadge(status: string) {
    const styles: Record<string, string> = {
        SENT: 'border-transparent bg-primary/10 text-primary',
        PENDING: 'border-transparent bg-amber-100 text-amber-700',
        FAILED: 'border-transparent bg-destructive/10 text-destructive',
        NOT_SENT: 'border-border bg-background text-muted-foreground',
    };

    return (
        <Badge
            variant="outline"
            className={`px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase shadow-none ${styles[status] ?? styles.NOT_SENT}`}
        >
            {status.replace('_', ' ')}
        </Badge>
    );
}
