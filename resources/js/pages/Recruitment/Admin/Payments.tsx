import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Head, router, usePage } from '@inertiajs/react';
import {
    Banknote,
    MoreHorizontal,
    RotateCcw,
    Search,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactPaginate from 'react-paginate';

type PaymentRow = {
    id: number;
    payable_type: string;
    payable_id: number;
    payable_name: string;
    amount: string | number;
    currency: string;
    provider: string;
    status: string;
    created_at: string | null;
    paid_at: string | null;
};

type PaymentsPageProps = {
    payments: {
        data: PaymentRow[];
        total: number;
        current_page: number;
        last_page: number;
        from?: number;
        to?: number;
        per_page?: number;
    };
    filters: {
        search?: string | null;
        status?: string | null;
        provider?: string | null;
    };
    providers: string[];
};

const statusStyles: Record<string, string> = {
    paid: 'border-transparent bg-emerald-100 text-emerald-700',
    pending: 'border-transparent bg-amber-100 text-amber-700',
    failed: 'border-transparent bg-red-100 text-red-700',
    refunded: 'border-transparent bg-slate-100 text-slate-600',
    cancelled: 'border-transparent bg-zinc-100 text-zinc-600',
};

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatMoney(value: string | number | null | undefined) {
    if (value === null || value === undefined || value === '') return '—';
    const amount = Number(value);
    if (Number.isNaN(amount)) return String(value);
    return amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function formatDate(value: string | null) {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export default function AdminPayments() {
    const {
        payments,
        filters,
        providers = [],
    } = usePage<PaymentsPageProps>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? 'all');
    const [provider, setProvider] = useState(filters.provider ?? 'all');
    const [showFilters, setShowFilters] = useState(false);

    const initialRender = useRef(true);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        const timer = window.setTimeout(() => {
            router.get(
                '/recruitment/admin/payments',
                {
                    search: search || undefined,
                    status: status !== 'all' ? status : undefined,
                    provider: provider !== 'all' ? provider : undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300);

        return () => window.clearTimeout(timer);
    }, [search, status, provider]);

    const handleResetFilters = () => {
        setSearch('');
        setStatus('all');
        setProvider('all');
        setShowFilters(false);
    };

    const handlePageChange = ({ selected }: { selected: number }) => {
        router.get(
            '/recruitment/admin/payments',
            {
                page: selected + 1,
                search: search || undefined,
                status: status !== 'all' ? status : undefined,
                provider: provider !== 'all' ? provider : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const perPage = payments.per_page ?? (payments.data.length || 1);
    const showingFrom =
        payments.from ??
        (payments.total === 0 ? 0 : (payments.current_page - 1) * perPage + 1);
    const showingTo =
        payments.to ?? Math.min(payments.current_page * perPage, payments.total);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Recruitment', href: '/recruitment' },
                { title: 'Admin' },
                { title: 'Payments' },
            ]}
        >
            <Head title="Recruitment Payments" />

            <div className="w-full space-y-6 bg-white p-4 lg:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
                            Payments
                        </h1>
                        <p className="text-lg text-zinc-500">
                            Manage and view all recruitment payments.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Banknote className="h-6 w-6 text-zinc-400" />
                        <span className="text-sm font-medium text-zinc-500">
                            {payments.total} total payments
                        </span>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 border-t border-zinc-100 pt-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                            <Input
                                placeholder="Search by ID or payable info..."
                                className="h-11 border-zinc-200 pl-10 focus:ring-zinc-900"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className="h-11 border-zinc-200"
                                onClick={() => setShowFilters((current) => !current)}
                                type="button"
                            >
                                <MoreHorizontal className="mr-2 h-4 w-4" /> More Filters
                            </Button>
                            <Button
                                variant="ghost"
                                className="h-11 text-zinc-500"
                                onClick={handleResetFilters}
                                type="button"
                            >
                                <RotateCcw className="mr-2 h-4 w-4" /> Reset
                            </Button>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="grid grid-cols-1 gap-4 rounded-md border border-zinc-200 bg-zinc-50/40 p-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Status</p>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="h-11 border-zinc-200 bg-white">
                                        <SelectValue placeholder="All statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All statuses</SelectItem>
                                        <SelectItem value="paid">Paid</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="failed">Failed</SelectItem>
                                        <SelectItem value="refunded">Refunded</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Provider</p>
                                <Select value={provider} onValueChange={setProvider}>
                                    <SelectTrigger className="h-11 border-zinc-200 bg-white">
                                        <SelectValue placeholder="All providers" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All providers</SelectItem>
                                        {providers.map((prov) => (
                                            <SelectItem key={prov} value={prov}>
                                                {formatLabel(prov)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-md border border-zinc-200">
                    <Table>
                        <TableHeader className="bg-zinc-50">
                            <TableRow>
                                <TableHead className="font-bold text-zinc-900">ID</TableHead>
                                <TableHead className="font-bold text-zinc-900">Payable</TableHead>
                                <TableHead className="font-bold text-zinc-900">Amount</TableHead>
                                <TableHead className="font-bold text-zinc-900">Currency</TableHead>
                                <TableHead className="font-bold text-zinc-900">Provider</TableHead>
                                <TableHead className="font-bold text-zinc-900">Status</TableHead>
                                <TableHead className="font-bold text-zinc-900">Created</TableHead>
                                <TableHead className="font-bold text-zinc-900">Paid At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="py-8 text-center text-zinc-400">
                                        No payments found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                payments.data.map((payment) => (
                                    <TableRow key={payment.id} className="hover:bg-zinc-50/50">
                                        <TableCell className="font-mono text-xs text-zinc-500">
                                            #{payment.id}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-bold text-zinc-900">{payment.payable_name}</p>
                                                <p className="text-xs text-zinc-400">{formatLabel(payment.payable_type)}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-bold text-zinc-900">
                                            {formatMoney(payment.amount)}
                                        </TableCell>
                                        <TableCell className="text-zinc-500">
                                            {payment.currency}
                                        </TableCell>
                                        <TableCell className="text-zinc-500">
                                            {formatLabel(payment.provider)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`${statusStyles[payment.status] ?? 'border-zinc-200 bg-zinc-50 text-zinc-700'} font-semibold`}
                                            >
                                                {formatLabel(payment.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-zinc-500">
                                            {formatDate(payment.created_at)}
                                        </TableCell>
                                        <TableCell className="text-zinc-500">
                                            {formatDate(payment.paid_at)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-zinc-100 pt-6 md:flex-row">
                    <p className="text-sm font-medium text-zinc-500">
                        Showing{' '}
                        <span className="text-zinc-900">
                            {showingFrom}-{showingTo}
                        </span>{' '}
                        of <span className="text-zinc-900">{payments.total}</span> payments
                    </p>
                    <ReactPaginate
                        pageCount={payments.last_page}
                        forcePage={Math.max((payments.current_page ?? 1) - 1, 0)}
                        onPageChange={handlePageChange}
                        containerClassName="flex gap-1"
                        pageLinkClassName="flex h-10 w-10 items-center justify-center rounded-md border text-sm font-bold transition-colors hover:bg-zinc-50"
                        activeLinkClassName="!border-zinc-900 !bg-zinc-900 !text-white"
                        previousLabel="←"
                        nextLabel="→"
                        previousLinkClassName="mr-2 flex h-10 items-center justify-center rounded-md border px-4 text-sm font-bold"
                        nextLinkClassName="ml-2 flex h-10 items-center justify-center rounded-md border px-4 text-sm font-bold"
                        disabledClassName="pointer-events-none opacity-30"
                        breakLabel="..."
                        breakLinkClassName="flex h-10 w-10 items-center justify-center rounded-md border text-sm font-bold"
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={3}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
