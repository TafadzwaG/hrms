import type { ReactNode } from 'react';

import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';

export const candidateUnderlinedInput =
    'w-full appearance-none border-0 border-b border-border bg-transparent px-0 py-2 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-foreground focus:ring-0 rounded-none';

export const candidateTextAreaClassName =
    'min-h-[110px] w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground transition-all placeholder:text-muted-foreground focus:border-foreground focus:ring-0';

export const candidateFileInputClassName =
    'w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-muted-foreground file:mr-4 file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:text-primary-foreground hover:file:bg-primary/90';

export const candidatePrimaryButtonClassName =
    'h-auto rounded-md bg-primary px-6 py-5 text-sm font-bold tracking-tight text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95';

export const candidateSecondaryButtonClassName =
    'h-auto rounded-md border border-border bg-background px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground shadow-sm transition-all hover:bg-muted active:scale-95';

export const candidateNeutralButtonClassName =
    'h-auto rounded-md bg-muted px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground transition-all hover:bg-muted/80 active:scale-95';

export const candidatePaginationLinkClassName =
    'rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground';

export function CandidateFormField({
    label,
    error,
    children,
    className,
}: {
    label: string;
    error?: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={`space-y-1.5 ${className ?? ''}`}>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
            {children}
            <InputError message={error} />
        </div>
    );
}

export function CandidateToggleRow({
    label,
    description,
    checked,
    onChange,
}: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <label className="flex items-start justify-between gap-4 border-b border-border/60 py-4 last:border-0 first:pt-0 last:pb-0">
            <div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>
            <Checkbox
                checked={checked}
                onCheckedChange={(value) => onChange(value === true)}
                className="mt-1"
            />
        </label>
    );
}

export function CandidateCheckboxPill({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: () => void;
}) {
    return (
        <label className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted">
            <Checkbox
                checked={checked}
                onCheckedChange={() => onChange()}
                className="h-4 w-4"
            />
            {label}
        </label>
    );
}
