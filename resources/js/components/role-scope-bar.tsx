import { router } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { buildIndexParams, type SortableFilters } from '@/lib/index-table';
import { cn } from '@/lib/utils';
import type { PageRoleScope } from '@/types/auth';

type RoleScopeBarProps = {
    scope?: PageRoleScope | null;
    path: string;
    filters?: SortableFilters;
    className?: string;
};

export function RoleScopeBar({
    scope,
    path,
    filters = {},
    className,
}: RoleScopeBarProps) {
    if (!scope) {
        return null;
    }

    const currentView = scope.current_view ?? null;
    const canToggle = scope.allows_self_toggle && (currentView === 'team' || currentView === 'self');

    const switchView = (nextView: 'team' | 'mine') => {
        router.get(
            path,
            buildIndexParams(filters, { scope_view: nextView }),
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <div className={cn('flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/20 p-3 sm:flex-row sm:items-center sm:justify-between', className)}>
            <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em]">
                    Scoped by role
                </Badge>
                <span className="text-sm font-medium text-foreground">{scope.label}</span>
            </div>

            {canToggle ? (
                <div className="inline-flex items-center gap-2">
                    <Button
                        type="button"
                        variant={currentView === 'team' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => switchView('team')}
                    >
                        {scope.team_label ?? 'Team'}
                    </Button>
                    <Button
                        type="button"
                        variant={currentView === 'self' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => switchView('mine')}
                    >
                        {scope.self_label ?? 'Mine'}
                    </Button>
                </div>
            ) : null}
        </div>
    );
}
