import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { ImpersonationBanner } from '@/components/impersonation-banner';
import type { AppLayoutProps } from '@/types';
import { RbacSidebar } from '@/lib/app-sidebar-rbac';
import { usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type FlashProps = {
    flash?: { success?: string | null; error?: string | null };
};

function FlashToast() {
    const { flash } = usePage<FlashProps>().props;
    const [visible, setVisible] = useState<'success' | 'error' | null>(null);

    useEffect(() => {
        if (flash?.error) {
            setVisible('error');
        } else if (flash?.success) {
            setVisible('success');
        } else {
            setVisible(null);
        }
    }, [flash?.success, flash?.error]);

    if (!visible) return null;

    const isError = visible === 'error';
    const message = isError ? flash?.error : flash?.success;

    return (
        <div
            className={`fixed bottom-5 right-5 z-[9999] flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-lg transition-all ${
                isError
                    ? 'border-destructive/30 bg-destructive/10 text-destructive dark:bg-destructive/20'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
            }`}
        >
            {isError ? (
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
                type="button"
                onClick={() => setVisible(null)}
                className="shrink-0 opacity-60 hover:opacity-100"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const { url } = usePage();

    const isTalentGrowthRoute = [
        '/performance',
        '/performance-cycles',
        '/scorecard-templates',
        '/employee-scorecards',
        '/improvement-plans',
        '/kpi-library',
        '/learning-courses',
        '/performance-reviews',
    ].some((prefix) => url.startsWith(prefix));

    return (
        <AppShell variant="sidebar">
            <RbacSidebar />
            <AppContent
                variant="sidebar"
                className="relative overflow-x-hidden bg-[radial-gradient(circle_at_0%_0%,rgba(99,102,241,0.12),transparent_40%),radial-gradient(circle_at_100%_0%,rgba(20,184,166,0.14),transparent_45%),radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.1),transparent_50%)]"
            >
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.35),rgba(255,255,255,0.05)_38%,rgba(255,255,255,0.12)_70%,rgba(255,255,255,0.02))] dark:bg-[linear-gradient(125deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01)_38%,rgba(255,255,255,0.03)_70%,rgba(255,255,255,0.01))]" />
                <div
                    className="relative z-10"
                    data-talent-growth-scope={isTalentGrowthRoute ? 'true' : undefined}
                >
                    <AppSidebarHeader breadcrumbs={breadcrumbs} />
                    <ImpersonationBanner />
                    <FlashToast />
                    {children}
                </div>
            </AppContent>
        </AppShell>
    );
}
