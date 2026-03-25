import { Link, usePage } from '@inertiajs/react';
import { ArrowLeftRight, ShieldAlert, UserRound } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Auth } from '@/types/auth';

type SharedProps = {
    auth: Auth;
};

export function ImpersonationBanner() {
    const { auth } = usePage<SharedProps>().props;
    const impersonation = auth.impersonation;

    if (!impersonation?.active) {
        return null;
    }

    return (
        <div className="border-b border-amber-300/60 bg-amber-50/95 px-4 py-3 text-amber-950 shadow-sm dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100 md:px-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200">
                        <ShieldAlert className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge className="border-amber-300/70 bg-amber-500/10 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-800 shadow-none dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100">
                                Impersonation Active
                            </Badge>
                            <span className="text-sm font-semibold">
                                You are viewing the system as {impersonation.impersonated.name}.
                            </span>
                        </div>
                        <p className="text-sm text-amber-900/85 dark:text-amber-100/85">
                            Original session: {impersonation.impersonator.name} ({impersonation.impersonator.email})
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-amber-900/75 dark:text-amber-100/75">
                            <span className="inline-flex items-center gap-1">
                                <UserRound className="h-3.5 w-3.5" />
                                Acting as {impersonation.impersonated.primary_portal ?? 'user'}
                            </span>
                            {impersonation.started_at ? (
                                <span>Started {new Date(impersonation.started_at).toLocaleString()}</span>
                            ) : null}
                        </div>
                    </div>
                </div>

                <Button asChild variant="outline" className="shrink-0 border-amber-400/60 bg-transparent text-amber-900 hover:bg-amber-100 dark:border-amber-400/30 dark:text-amber-50 dark:hover:bg-amber-400/10">
                    <Link href={impersonation.stop_url} method="delete" as="button">
                        <ArrowLeftRight className="mr-2 h-4 w-4" />
                        Stop impersonation
                    </Link>
                </Button>
            </div>
        </div>
    );
}
