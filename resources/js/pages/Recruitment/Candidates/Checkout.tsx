import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Banknote, CheckCircle2, Clock, CreditCard, Loader2, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type Candidate = {
    id: number;
    full_name: string;
    email: string;
    headline: string | null;
    visibility_status: string;
};

type CheckoutPageProps = {
    candidate: Candidate;
    fee: number;
    currency: string;
    payment_id?: number | null;
    payment_status?: string | null;
};

const statusStyles: Record<string, string> = {
    active: 'border-transparent bg-emerald-100 text-emerald-700',
    draft: 'border-transparent bg-zinc-100 text-zinc-600',
    pending_payment: 'border-transparent bg-amber-100 text-amber-700',
    paid: 'border-transparent bg-emerald-100 text-emerald-700',
    failed: 'border-transparent bg-red-100 text-red-700',
    pending: 'border-transparent bg-amber-100 text-amber-700',
};

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function CandidateCheckout() {
    const { candidate, fee = 1.0, currency = 'USD', payment_id, payment_status } = usePage<CheckoutPageProps>().props;

    const [polling, setPolling] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(payment_status ?? null);

    const { data, setData, post, processing, errors } = useForm({
        phone: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/candidate-profiles/${candidate.id}/checkout`, {
            preserveScroll: true,
            onSuccess: () => {
                setPolling(true);
            },
        });
    };

    useEffect(() => {
        if (!polling || !payment_id) return;

        const interval = window.setInterval(async () => {
            try {
                const response = await fetch(`/candidate-profiles/${candidate.id}/payment-status/${payment_id}`);
                const result = await response.json();

                if (result.status && result.status !== 'pending') {
                    setCurrentStatus(result.status);
                    setPolling(false);
                }
            } catch {
                // Silently retry
            }
        }, 3000);

        return () => window.clearInterval(interval);
    }, [polling, payment_id, candidate.id]);

    const isPaid = currentStatus === 'paid';
    const isFailed = currentStatus === 'failed';

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Recruitment', href: '/recruitment' },
                { title: 'Candidates', href: '/candidate-profiles' },
                { title: candidate.full_name, href: `/candidate-profiles/${candidate.id}` },
                { title: 'Checkout' },
            ]}
        >
            <Head title="Activate Listing" />

            <div className="w-full space-y-6 bg-white p-4 lg:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
                            Activate Listing
                        </h1>
                        <p className="text-lg text-zinc-500">
                            Pay to make your candidate profile visible to employers.
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-2xl space-y-6">
                    {/* Candidate Summary */}
                    <Card className="border-zinc-200 shadow-none">
                        <CardHeader className="bg-muted/30">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <User className="h-5 w-5 text-muted-foreground" />
                                Candidate Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 p-6">
                            <div className="flex justify-between gap-3 text-sm">
                                <span className="text-zinc-400">Name</span>
                                <span className="font-semibold text-zinc-700">{candidate.full_name}</span>
                            </div>
                            <div className="flex justify-between gap-3 text-sm">
                                <span className="text-zinc-400">Email</span>
                                <span className="font-semibold text-zinc-700">{candidate.email}</span>
                            </div>
                            <div className="flex justify-between gap-3 text-sm">
                                <span className="text-zinc-400">Headline</span>
                                <span className="font-semibold text-zinc-700">{candidate.headline ?? '—'}</span>
                            </div>
                            <div className="flex justify-between gap-3 text-sm">
                                <span className="text-zinc-400">Status</span>
                                <Badge
                                    variant="outline"
                                    className={`${statusStyles[candidate.visibility_status] ?? 'border-zinc-200 bg-zinc-50 text-zinc-700'} font-semibold`}
                                >
                                    {formatLabel(candidate.visibility_status)}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Fee Display */}
                    <Card className="border-zinc-200 shadow-none">
                        <CardHeader className="bg-muted/30">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <CreditCard className="h-5 w-5 text-muted-foreground" />
                                Listing Fee
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50/50 p-6">
                                <div className="space-y-1">
                                    <p className="text-sm text-zinc-400">Activation Fee</p>
                                    <p className="text-xs text-zinc-400">One-time payment for listing visibility</p>
                                </div>
                                <p className="text-2xl font-semibold text-zinc-900">
                                    {currency} {fee.toFixed(2)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Status */}
                    {currentStatus && (
                        <Card className="border-zinc-200 shadow-none">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    {isPaid ? (
                                        <>
                                            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                                            <div>
                                                <p className="text-lg font-bold text-emerald-700">Payment Successful</p>
                                                <p className="text-sm text-zinc-500">Your listing has been activated.</p>
                                            </div>
                                        </>
                                    ) : isFailed ? (
                                        <>
                                            <Banknote className="h-10 w-10 text-red-500" />
                                            <div>
                                                <p className="text-lg font-bold text-red-700">Payment Failed</p>
                                                <p className="text-sm text-zinc-500">Please try again.</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <Clock className="h-10 w-10 text-amber-500" />
                                            <div>
                                                <p className="text-lg font-bold text-amber-700">Processing Payment</p>
                                                <p className="text-sm text-zinc-500">Waiting for confirmation...</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Payment Form */}
                    {!isPaid && (
                        <Card className="border-zinc-200 shadow-none">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Banknote className="h-5 w-5 text-muted-foreground" />
                                    Pay with Paynow
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number (Ecocash / OneMoney)</Label>
                                        <Input
                                            id="phone"
                                            className="h-11 border-zinc-200"
                                            placeholder="e.g. 0771234567"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                        />
                                        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Button
                                            type="submit"
                                            disabled={processing || polling}
                                            className="h-11 flex-1 rounded-md bg-emerald-600 px-6 text-white shadow-sm transition-all hover:bg-emerald-700"
                                        >
                                            {processing || polling ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <Banknote className="mr-2 h-5 w-5" /> Pay {currency} {fee.toFixed(2)}
                                                </>
                                            )}
                                        </Button>
                                        <Link href={`/candidate-profiles/${candidate.id}`}>
                                            <Button type="button" variant="outline" className="h-11 border-zinc-200">
                                                <X className="mr-2 h-4 w-4" />
                                                Cancel
                                            </Button>
                                        </Link>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {isPaid && (
                        <div className="flex justify-center">
                            <Link href={`/candidate-profiles/${candidate.id}`}>
                                <Button className="h-11 rounded-md bg-zinc-900 px-6 text-white shadow-sm transition-all hover:bg-zinc-800">
                                    View Profile
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
