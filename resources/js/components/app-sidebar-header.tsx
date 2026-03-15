import { Breadcrumbs } from '@/components/breadcrumbs';
import { OrganizationSwitcher } from '@/components/organization-switcher';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/40 bg-background/70 px-6 backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(99,102,241,0.08),rgba(20,184,166,0.06),rgba(59,130,246,0.08))]" />
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="ml-auto">
                <OrganizationSwitcher />
            </div>
        </header>
    );
}
