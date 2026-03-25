import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Mail, MapPin, Phone } from 'lucide-react';

import {
    CandidateFormField,
    candidateFileInputClassName,
    candidatePrimaryButtonClassName,
    candidateSecondaryButtonClassName,
    candidateTextAreaClassName,
    candidateUnderlinedInput,
} from '@/pages/Candidate/components/form';
import { getInitials } from '@/pages/Candidate/components/hub';

export {
    CandidateFormField,
    candidateFileInputClassName,
    candidatePrimaryButtonClassName,
    candidateSecondaryButtonClassName,
    candidateTextAreaClassName,
    candidateUnderlinedInput,
};

export const recruitmentCandidateSectionClassName =
    'rounded-lg border border-border/70 bg-background/95 p-6 shadow-sm';

export const recruitmentCandidateMutedCardClassName =
    'rounded-lg border border-border/70 bg-muted/20 p-4 shadow-sm';

export function formatCandidateLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatCandidateDate(value: string | null) {
    if (!value) {
        return '—';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export function formatCandidateMoney(value: string | number | null | undefined) {
    if (value === null || value === undefined || value === '') {
        return '—';
    }

    const amount = Number(value);

    if (Number.isNaN(amount)) {
        return String(value);
    }

    return amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export function RecruitmentCandidateSectionHeading({
    icon: Icon,
    title,
    kicker,
}: {
    icon: LucideIcon;
    title: string;
    kicker?: string;
}) {
    return (
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-foreground" />
                <h3 className="text-lg font-bold tracking-tight text-foreground uppercase">{title}</h3>
            </div>
            {kicker ? (
                <span className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase">{kicker}</span>
            ) : null}
        </div>
    );
}

export function RecruitmentCandidateInfoRow({
    icon,
    label,
    value,
}: {
    icon: ReactNode;
    label: string;
    value?: string | number | null;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-md border border-border/70 bg-muted/20 p-2 text-muted-foreground">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">{label}</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{value || '—'}</p>
            </div>
        </div>
    );
}

export function RecruitmentCandidateSummaryCard({
    fullName,
    headline,
    email,
    phone,
    location,
    metrics,
    footer,
}: {
    fullName: string;
    headline?: string | null;
    email?: string | null;
    phone?: string | null;
    location?: string | null;
    metrics?: Array<{ label: string; value: string | number }>;
    footer?: ReactNode;
}) {
    return (
        <div className={recruitmentCandidateSectionClassName}>
            <div className="mb-8 flex flex-col items-center text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-sm bg-foreground text-2xl font-black text-background">
                    {getInitials(fullName)}
                </div>
                <h2 className="text-2xl font-black tracking-tighter text-foreground uppercase">
                    {fullName || 'Candidate'}
                </h2>
                <p className="mt-1 text-sm font-bold tracking-wide text-muted-foreground">
                    {headline || 'No headline set'}
                </p>
            </div>

            <div className="space-y-4 border-t border-border/70 pt-6">
                <RecruitmentCandidateInfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={email} />
                <RecruitmentCandidateInfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={phone} />
                <RecruitmentCandidateInfoRow icon={<MapPin className="h-4 w-4" />} label="Location" value={location} />
            </div>

            {metrics && metrics.length > 0 ? (
                <div className="mt-8 grid grid-cols-2 gap-3">
                    {metrics.map((metric) => (
                        <div key={metric.label} className="rounded-lg border border-border/70 bg-muted/20 p-3 text-center">
                            <p className="text-xl font-black text-foreground">{metric.value}</p>
                            <p className="mt-1 text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
                                {metric.label}
                            </p>
                        </div>
                    ))}
                </div>
            ) : null}

            {footer ? <div className="mt-8 border-t border-border/70 pt-6">{footer}</div> : null}
        </div>
    );
}
