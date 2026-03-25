import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Banknote, CalendarDays, CheckCircle2, Clock3, XCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    RecruitmentCandidateSectionHeading,
    RecruitmentCandidateSummaryCard,
    candidatePrimaryButtonClassName,
    candidateSecondaryButtonClassName,
    formatCandidateDate,
    formatCandidateLabel,
    formatCandidateMoney,
    recruitmentCandidateMutedCardClassName,
    recruitmentCandidateSectionClassName,
} from './profile-primitives';

type Candidate = {
    id: number;
    full_name: string;
    profile_visibility_status?: string | null;
    visibility_status?: string | null;
    is_public?: boolean;
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

const paymentStatusStyles: Record<string, string> = {
    active: 'badge-tone-success',
    draft: 'badge-tone-neutral',
    pending_payment: 'badge-tone-warning',
    initiated: 'badge-tone-warning',
    processing: 'badge-tone-warning',
    paid: 'badge-tone-success',
    failed: 'badge-tone-danger',
    cancelled: 'badge-tone-danger',
};

export default function ListingStatus() {
    const { candidate, payment } = usePage<ListingStatusPageProps>().props;

    const visibilityStatus = candidate.profile_visibility_status ?? candidate.visibility_status ?? 'draft';
    const retryable = visibilityStatus === 'pending_payment' || payment?.status === 'failed';

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

            <div className="w-full space-y-6 bg-muted/10 p-4 lg:p-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tighter text-black uppercase">Listing Status</h1>
                    <p className="text-sm font-bold tracking-wide text-zinc-500">
                        Review payment outcome and listing visibility using the same profile presentation pattern.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.05fr_0.95fr]">
                    <div className="space-y-8">
                        <section className={recruitmentCandidateSectionClassName}>
                            <RecruitmentCandidateSectionHeading icon={CalendarDays} title="Listing Details" />
                            <div className="space-y-4">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Visibility</span>
                                    <Badge variant="outline" className={paymentStatusStyles[visibilityStatus] ?? 'badge-tone-neutral'}>
                                        {formatCandidateLabel(visibilityStatus)}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between gap-4 text-sm">
                                    <span className="text-muted-foreground">Activated At</span>
                                    <span className="font-semibold text-foreground">{formatCandidateDate(candidate.listing_activated_at)}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4 text-sm">
                                    <span className="text-muted-foreground">Expires At</span>
                                    <span className="font-semibold text-foreground">{formatCandidateDate(candidate.listing_expires_at)}</span>
                                </div>
                            </div>
                        </section>

                        {payment ? (
                            <section className={recruitmentCandidateSectionClassName}>
                                <RecruitmentCandidateSectionHeading icon={Banknote} title="Payment Outcome" />
                                <div className="space-y-5">
                                    <div className="flex items-center gap-4 rounded-lg border border-border/70 bg-muted/20 p-4">
                                        {payment.status === 'paid' ? (
                                            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                                        ) : payment.status === 'failed' ? (
                                            <XCircle className="h-10 w-10 text-red-500" />
                                        ) : (
                                            <Clock3 className="h-10 w-10 text-amber-500" />
                                        )}
                                        <div>
                                            <p className="text-lg font-black tracking-tight text-black uppercase">
                                                {payment.status === 'paid'
                                                    ? 'Payment Successful'
                                                    : payment.status === 'failed'
                                                      ? 'Payment Failed'
                                                      : 'Payment Pending'}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {payment.currency} {formatCandidateMoney(payment.amount)} via {formatCandidateLabel(payment.provider)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-muted-foreground">Payment ID</span>
                                            <span className="font-semibold text-foreground">#{payment.id}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-muted-foreground">Created</span>
                                            <span className="font-semibold text-foreground">{formatCandidateDate(payment.created_at)}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-muted-foreground">Paid</span>
                                            <span className="font-semibold text-foreground">{formatCandidateDate(payment.paid_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        ) : null}

                        <div className="flex flex-wrap gap-3">
                            <Link href={`/candidate-profiles/${candidate.id}`}>
                                <Button className={candidatePrimaryButtonClassName}>View Profile</Button>
                            </Link>
                            {retryable ? (
                                <Link href={`/candidate-profiles/${candidate.id}/checkout`}>
                                    <Button type="button" variant="outline" className={candidateSecondaryButtonClassName}>
                                        Retry Payment
                                    </Button>
                                </Link>
                            ) : null}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <RecruitmentCandidateSummaryCard
                            fullName={candidate.full_name}
                            headline={formatCandidateLabel(visibilityStatus)}
                            metrics={[
                                { label: 'Public', value: candidate.is_public ? 'Yes' : 'No' },
                                { label: 'Status', value: formatCandidateLabel(visibilityStatus) },
                            ]}
                        />

                        <div className={recruitmentCandidateMutedCardClassName}>
                            <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Status guidance</p>
                            <ul className="mt-4 space-y-3 text-sm font-medium text-zinc-600">
                                <li>Paid listings are activated and available to employer search.</li>
                                <li>Pending listings require payment confirmation before activation.</li>
                                <li>Failed payments can be retried from the checkout page.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
