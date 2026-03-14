import { usePage } from '@inertiajs/react';

import type { Auth } from '@/types';

const ROLE_BADGE_STYLES = [
    'border-emerald-200 bg-emerald-50 text-emerald-700',
    'border-sky-200 bg-sky-50 text-sky-700',
    'border-amber-200 bg-amber-50 text-amber-700',
    'border-violet-200 bg-violet-50 text-violet-700',
    'border-rose-200 bg-rose-50 text-rose-700',
    'border-slate-200 bg-slate-100 text-slate-700',
];

export function useAuthorization() {
    const { auth } = usePage<{ auth: Auth }>().props;

    const can = (permission: string): boolean => Boolean(auth?.can?.[permission]);
    const canAny = (permissions: string[]): boolean => permissions.some(can);

    return {
        auth,
        can,
        canAny,
    };
}

export function roleBadgeClass(roleCode?: string | null, roleName?: string | null): string {
    const key = `${roleCode ?? ''}:${roleName ?? ''}`.trim() || 'fallback';
    const hash = Array.from(key).reduce((total, char) => total + char.charCodeAt(0), 0);

    return ROLE_BADGE_STYLES[hash % ROLE_BADGE_STYLES.length];
}
