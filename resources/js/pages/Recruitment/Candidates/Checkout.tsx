import type { FormEvent } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Banknote, CheckCircle2, CreditCard, ExternalLink, User, XCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    CandidateFormField,
    RecruitmentCandidateSectionHeading,
    RecruitmentCandidateSummaryCard,
    candidatePrimaryButtonClassName,
    candidateSecondaryButtonClassName,
    candidateUnderlinedInput,
    formatCandidateDate,
    formatCandidateLabel,
    formatCandidateMoney,
    recruitmentCandidateMutedCardClassName,
    recruitmentCandidateSectionClassName,
} from './profile-primitives';

type Candidate = {
    id: number;
    full_name: string;
    email: string | null;
    profile_visibility_status: string;
    is_public: boolean;
    listing_activated_at: string | null;
    listing_expires_at: string | null;
};

type Payment = {
    id: number;
    amount: string | number;
    currency: string;
    status: string;
    provider: string;
    provider_reference?: string | null;
    paid_at: string | null;
    created_at: string | null;
};

type CheckoutPageProps = {
    candidate: Candidate;
    payment: Payment | null;
    listingFee: {
        amount: number;
        currency: string;
    };
    providers: string[];
};

const paymentStatusStyles: Record<string, string> = {
    active: 'badge-tone-success',
    draft: 'badge-tone-neutral',
    pending_payment: 'badge-tone-warning',
    paid: 'badge-tone-success',
    initiated: 'badge-tone-warning',
    processing: 'badge-tone-warning',
    failed: 'badge-tone-danger',
    cancelled: 'badge-tone-danger',
};

export default function CandidateCheckout() {
    const { candidate, payment, listingFee, providers } = usePage<CheckoutPageProps>().props;

    const { data, setData, post, processing } = useForm({
        provider: providers[0] ?? 'paynow',
        customer_phone: '',
        customer_email: candidate.email ?? '',
    });

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        post(`/candidate-profiles/${candidate.id}/checkout/initiate`, {
            preserveScroll: true,
        });
    };

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

            <div className="w-full space-y-6 bg-muted/10 p-4 lg:p-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tighter text-black uppercase">Activate Listing</h1>
                    <p className="text-sm font-bold tracking-wide text-zinc-500">
                        Use the same candidate profile presentation while handling listing payment and activation.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.05fr_0.95fr]">
                    <div className="space-y-8">
                        <section className={recruitmentCandidateSectionClassName}>
                            <RecruitmentCandidateSectionHeading icon={CreditCard} title="Listing Fee" kicker="Step 1 of 2" />

                            <div className="rounded-lg border border-border/70 bg-muted/20 p-6">
                                <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Activation fee</p>
                                <p className="mt-3 text-3xl font-black tracking-tight text-black">
                                    {listingFee.currency} {formatCandidateMoney(listingFee.amount)}
                                </p>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    One payment makes the candidate listing visible to employers.
                                </p>
                            </div>
                        </section>

                        <section className={recruitmentCandidateSectionClassName}>
                            <RecruitmentCandidateSectionHeading icon={Banknote} title="Payment Details" kicker="Step 2 of 2" />

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <CandidateFormField label="Provider">
                                        <select value={data.provider} onChange={(event) => setData('provider', event.target.value)} className={candidateUnderlinedInput}>
                                            {providers.map((provider) => (
                                                <option key={provider} value={provider}>
                                                    {formatCandidateLabel(provider)}
                                                </option>
                                            ))}
                                        </select>
                                    </CandidateFormField>
                                    <CandidateFormField label="Customer Email">
                                        <input type="email" value={data.customer_email} onChange={(event) => setData('customer_email', event.target.value)} className={candidateUnderlinedInput} />
                                    </CandidateFormField>
                                </div>

                                <CandidateFormField label="Phone Number">
                                    <input value={data.customer_phone} onChange={(event) => setData('customer_phone', event.target.value)} className={candidateUnderlinedInput} placeholder="e.g. 0771234567" />
                                </CandidateFormField>

                                <div className="flex flex-wrap gap-3">
                                    <Button type="submit" disabled={processing} className={candidatePrimaryButtonClassName}>
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Continue to Payment
                                    </Button>
                                    <Link href={`/candidate-profiles/${candidate.id}`}>
                                        <Button type="button" variant="outline" className={candidateSecondaryButtonClassName}>
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Back to Profile
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </section>

                        {payment ? (
                            <section className={recruitmentCandidateSectionClassName}>
                                <RecruitmentCandidateSectionHeading icon={CheckCircle2} title="Latest Payment" />
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Status</span>
                                        <Badge variant="outline" className={paymentStatusStyles[payment.status] ?? 'badge-tone-neutral'}>
                                            {formatCandidateLabel(payment.status)}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between gap-4 text-sm">
                                        <span className="text-muted-foreground">Amount</span>
                                        <span className="font-semibold text-foreground">
                                            {payment.currency} {formatCandidateMoney(payment.amount)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-4 text-sm">
                                        <span className="text-muted-foreground">Created</span>
                                        <span className="font-semibold text-foreground">{formatCandidateDate(payment.created_at)}</span>
                                    </div>
                                    <div className="pt-2">
                                        <Link href={`/candidate-profiles/${candidate.id}/listing-status`}>
                                            <Button type="button" variant="outline" className={candidateSecondaryButtonClassName}>
                                                View Listing Status
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </section>
                        ) : null}
                    </div>

                    <div className="space-y-8">
                        <RecruitmentCandidateSummaryCard
                            fullName={candidate.full_name}
                            headline={formatCandidateLabel(candidate.profile_visibility_status)}
                            email={candidate.email}
                            metrics={[
                                { label: 'Public', value: candidate.is_public ? 'Yes' : 'No' },
                                { label: 'Status', value: formatCandidateLabel(candidate.profile_visibility_status) },
                            ]}
                            footer={
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-muted-foreground">Activated</span>
                                        <span className="font-semibold text-foreground">{formatCandidateDate(candidate.listing_activated_at)}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-muted-foreground">Expires</span>
                                        <span className="font-semibold text-foreground">{formatCandidateDate(candidate.listing_expires_at)}</span>
                                    </div>
                                </div>
                            }
                        />

                        <div className={recruitmentCandidateMutedCardClassName}>
                            <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">What happens next</p>
                            <ul className="mt-4 space-y-3 text-sm font-medium text-zinc-600">
                                <li>The payment service initializes the listing fee transaction.</li>
                                <li>Once paid, the candidate listing moves into the active state.</li>
                                <li>You can confirm the result from the listing status page at any time.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
