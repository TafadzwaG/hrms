import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Banknote, Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react';

type Candidate = {
    id: number;
    full_name: string;
    visibility_status: string;
    listing_activated_at: string | null;
    listing_expires_at: string | null;
};

type Payment = {
    id: number;
    amount: string | number;
    currency: string;
    status: string;
    provider: string;
    paid_at: string | null;
    created_at: string | null;
};

type ListingStatusPageProps = {
    candidate: Candidate;
    payment: Payment | null;
};

const statusStyles: Record<string, string> = {
    active: 'border-transparent bg-emerald-100 text-emerald-700',
    draft: 'border-transparent bg-zinc-100 text-zinc-600',
    pending_payment: 'border-transparent bg-amber-100 text-amber-700',
    expired: 'border-transparent bg-slate-100 text-slate-600',
    suspended: 'border-transparent bg-red-100 text-red-700',
    paid: 'border-transparent bg-emerald-100 text-emerald-700',
    failed: 'border-transparent bg-red-100 text-red-700',
    pending: 'border-transparent bg-amber-100 text-amber-700',
};

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
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

function formatMoney(value: string | number | null | undefined) {
    if (value === null || value === undefined || value === '') return '—';
    const amount = Number(value);
    if (Number.isNaN(amount)) return String(value);
    return amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export default function ListingStatus() {
    const { candidate, payment } = usePage<ListingStatusPageProps>().props;

    const isActive = candidate.visibility_status === 'active';
    const isPending = candidate.visibility_status === 'pending_payment';

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Recruitment', href: '/recruitment' },
                { title: 'Candidates', href: '/candidate-profiles' },
                { title: candidate.full_name, href: `/candidate-profiles/${candidate.id}` },
                { title: 'Listing Status' },
            ]}
        >
            <Head title="Listing Status" />

            <div className="w-full space-y-6 bg-white p-4 lg:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
                            Listing Status
                        </h1>
                        <p className="text-lg text-zinc-500">
                            Payment result and listing details for {candidate.full_name}.
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-2xl space-y-6">
                    {/* Payment Result */}
                    {payment && (
                        <Card className="border-zinc-200 shadow-none">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    {payment.status === 'paid' ? (
                                        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                                    ) : payment.status === 'failed' ? (
                                        <XCircle className="h-12 w-12 text-red-500" />
                                    ) : (
                                        <Clock className="h-12 w-12 text-amber-500" />
                                    )}
                                    <div className="space-y-1">
                                        <p className="text-xl font-bold text-zinc-900">
                                            {payment.status === 'paid'
                                                ? 'Payment Successful'
                                                : payment.status === 'failed'
                                                  ? 'Payment Failed'
                                                  : 'Payment Pending'}
                                        </p>
                                        <p className="text-sm text-zinc-500">
                                            {payment.currency} {formatMoney(payment.amount)} via {formatLabel(payment.provider)}
                                        </p>
                                        {payment.paid_at && (
                                            <p className="text-xs text-zinc-400">Paid on {formatDate(payment.paid_at)}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Listing Status */}
                    <Card className="border-zinc-200 shadow-none">
                        <CardHeader className="bg-muted/30">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                Listing Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 p-6">
                            <div className="flex justify-between gap-3 text-sm">
                                <span className="text-zinc-400">Visibility Status</span>
                                <Badge
                                    variant="outline"
                                    className={`${statusStyles[candidate.visibility_status] ?? 'border-zinc-200 bg-zinc-50 text-zinc-700'} font-semibold`}
                                >
                                    {formatLabel(candidate.visibility_status)}
                                </Badge>
                            </div>
                            <div className="flex justify-between gap-3 text-sm">
                                <span className="text-zinc-400">Activated At</span>
                                <span className="font-semibold text-zinc-700">{formatDate(candidate.listing_activated_at)}</span>
                            </div>
                            <div className="flex justify-between gap-3 text-sm">
                                <span className="text-zinc-400">Expires At</span>
                                <span className="font-semibold text-zinc-700">{formatDate(candidate.listing_expires_at)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Details */}
                    {payment && (
                        <Card className="border-zinc-200 shadow-none">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Banknote className="h-5 w-5 text-muted-foreground" />
                                    Payment Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6">
                                <div className="flex justify-between gap-3 text-sm">
                                    <span className="text-zinc-400">Payment ID</span>
                                    <span className="font-mono font-semibold text-zinc-700">#{payment.id}</span>
                                </div>
                                <div className="flex justify-between gap-3 text-sm">
                                    <span className="text-zinc-400">Amount</span>
                                    <span className="font-semibold text-zinc-700">{payment.currency} {formatMoney(payment.amount)}</span>
                                </div>
                                <div className="flex justify-between gap-3 text-sm">
                                    <span className="text-zinc-400">Provider</span>
                                    <span className="font-semibold text-zinc-700">{formatLabel(payment.provider)}</span>
                                </div>
                                <div className="flex justify-between gap-3 text-sm">
                                    <span className="text-zinc-400">Status</span>
                                    <Badge
                                        variant="outline"
                                        className={`${statusStyles[payment.status] ?? 'border-zinc-200 bg-zinc-50 text-zinc-700'} font-semibold`}
                                    >
                                        {formatLabel(payment.status)}
                                    </Badge>
                                </div>
                                <div className="flex justify-between gap-3 text-sm">
                                    <span className="text-zinc-400">Created</span>
                                    <span className="font-semibold text-zinc-700">{formatDate(payment.created_at)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex justify-center gap-3">
                        <Link href={`/candidate-profiles/${candidate.id}`}>
                            <Button className="h-11 rounded-md bg-zinc-900 px-6 text-white shadow-sm transition-all hover:bg-zinc-800">
                                View Profile
                            </Button>
                        </Link>
                        {(isPending || (!isActive && payment?.status === 'failed')) && (
                            <Link href={`/candidate-profiles/${candidate.id}/checkout`}>
                                <Button variant="outline" className="h-11 border-zinc-200">
                                    <Banknote className="mr-2 h-5 w-5" /> Retry Payment
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
