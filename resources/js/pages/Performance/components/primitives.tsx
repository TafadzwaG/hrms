import { Card, CardContent } from '@/components/ui/card';
import moment from 'moment';
import type { ReactNode } from 'react';

export function FieldLabel({
    children,
    required,
}: {
    children: ReactNode;
    required?: boolean;
}) {
    return (
        <label className="mb-2 block text-sm font-medium">
            {children}
            {required ? <span className="ml-1 text-destructive">*</span> : null}
        </label>
    );
}

export function FieldError({ message }: { message?: string }) {
    if (!message) return null;

    return <p className="mt-2 text-sm text-destructive">{message}</p>;
}

export function SectionHeading({
    icon,
    title,
    description,
}: {
    icon: ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-background">
                {icon}
            </div>
            <div className="space-y-1">
                <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}

export function MetricCard({
    icon,
    label,
    value,
    helper,
}: {
    icon: ReactNode;
    label: string;
    value: string | number;
    helper: string;
}) {
    return (
        <Card>
            <CardContent className="flex items-start gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-muted">
                    {icon}
                </div>
                <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {label}
                    </p>
                    <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
                </div>
            </CardContent>
        </Card>
    );
}

export function formatLabel(value?: string | null) {
    if (!value) return '—';

    return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatPerformanceDate(
    value: string | null | undefined,
    format = 'DD MMM YYYY',
) {
    if (!value) return '—';

    const parsed = moment(value);

    return parsed.isValid() ? parsed.format(format) : '—';
}

export function formatPerformanceDateTime(
    value: string | null | undefined,
    format = 'DD MMM YYYY, HH:mm',
) {
    return formatPerformanceDate(value, format);
}
