import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { TenantContextPayload } from '@/types/auth';
import { router, usePage } from '@inertiajs/react';
import { Building2, Check, ChevronsUpDown } from 'lucide-react';

export function OrganizationSwitcher() {
    const { tenant } = usePage<{ tenant: TenantContextPayload }>().props;
    const activeOrganization = tenant?.active_organization;
    const organizations = tenant?.organizations ?? [];

    if (!activeOrganization && organizations.length === 0) {
        return null;
    }

    const switchOrganization = (organizationId: number) => {
        router.post(
            '/organizations/switch',
            {
                organization_id: organizationId,
                redirect_to:
                    typeof window !== 'undefined'
                        ? `${window.location.pathname}${window.location.search}`
                        : '/dashboard',
            },
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <div id="organization-switcher">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className="h-9 gap-2 border-border/70 bg-background/80 px-3 text-xs font-semibold shadow-sm"
                    >
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="max-w-[180px] truncate">
                            {activeOrganization?.name ?? 'Select organization'}
                        </span>
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                    <DropdownMenuLabel className="space-y-1">
                        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                            Active Organization
                        </p>
                        <div className="flex items-center justify-between gap-3">
                            <span className="truncate font-medium">
                                {activeOrganization?.name ?? 'No organization selected'}
                            </span>
                            {activeOrganization?.status && (
                                <Badge variant="outline" className="text-[10px] uppercase">
                                    {activeOrganization.status}
                                </Badge>
                            )}
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {organizations.map((organization) => (
                        <DropdownMenuItem
                            key={organization.id}
                            className="flex items-center justify-between gap-3"
                            onClick={() => switchOrganization(organization.id)}
                        >
                            <div className="min-w-0">
                                <p className="truncate font-medium">{organization.name}</p>
                                <p className="truncate text-xs text-muted-foreground">
                                    {organization.code || organization.slug}
                                </p>
                            </div>
                            {organization.is_active && (
                                <Check className="h-4 w-4 text-primary" />
                            )}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
