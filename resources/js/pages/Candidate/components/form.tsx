import type { ReactNode } from 'react';

import InputError from '@/components/input-error';

export const candidateUnderlinedInput =
    'w-full appearance-none border-0 border-b border-zinc-200/50 bg-transparent px-0 py-2 text-sm font-medium text-black outline-none transition-all placeholder:text-zinc-300 focus:border-black focus:ring-0 rounded-none';

export const candidateTextAreaClassName =
    'min-h-[110px] w-full rounded-sm border border-zinc-200 bg-transparent p-3 text-sm text-black transition-all placeholder:text-zinc-300 focus:border-black focus:ring-0';

export const candidateFileInputClassName =
    'w-full rounded-sm border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-600 file:mr-4 file:border-0 file:bg-black file:px-3 file:py-1.5 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:text-white hover:file:bg-zinc-800';

export const candidatePrimaryButtonClassName =
    'h-auto rounded-md bg-black px-6 py-5 text-sm font-bold tracking-tight text-white transition-all hover:bg-zinc-800 active:scale-95';

export const candidateSecondaryButtonClassName =
    'h-auto rounded-md border border-zinc-200 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-700 transition-all hover:bg-zinc-50 active:scale-95';

export const candidateNeutralButtonClassName =
    'h-auto rounded-md bg-zinc-100 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-700 transition-all hover:bg-zinc-200 active:scale-95';

export const candidatePaginationLinkClassName =
    'rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-black';

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
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500">{label}</label>
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
        <label className="flex items-start justify-between gap-4 border-b border-zinc-100 py-4 last:border-0 first:pt-0 last:pb-0">
            <div>
                <p className="text-sm font-semibold text-black">{label}</p>
                <p className="mt-1 text-sm text-zinc-500">{description}</p>
            </div>
            <input
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-zinc-300 text-black focus:ring-black"
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
        <label className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="h-4 w-4 rounded border-zinc-300 text-black focus:ring-black"
            />
            {label}
        </label>
    );
}
