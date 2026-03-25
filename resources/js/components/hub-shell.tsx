import { Head, Link, router } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import type { ReactNode } from 'react';

import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem, NavItem } from '@/types';
import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

type HubNavGroup = {
    title: string;
    icon?: LucideIcon | null;
    items: NavItem[];
};

type HubBrand = {
    title: string;
    subtitle?: string;
    href: NonNullable<InertiaLinkProps['href']>;
    mark: ReactNode;
};

type HubIdentity = {
    name: string;
    secondary: string;
    initials: string;
    tertiary?: ReactNode;
};

type HubSidebarLayoutProps = {
    headTitle: string;
    title: string;
    subtitle?: string;
    breadcrumbs: BreadcrumbItem[];
    badge?: ReactNode;
    heroMeta?: ReactNode;
    headerActions?: ReactNode;
    brand: HubBrand;
    navLabel: string;
    primaryItems: NavItem[];
    secondaryGroups?: HubNavGroup[];
    identity: HubIdentity;
    children: ReactNode;
    onLogout?: () => void;
};

export function HubSidebarLayout({
    headTitle,
    title,
    subtitle,
    breadcrumbs,
    badge,
    heroMeta,
    headerActions,
    brand,
    navLabel,
    primaryItems,
    secondaryGroups = [],
    identity,
    children,
    onLogout,
}: HubSidebarLayoutProps) {
    const handleLogout = onLogout ?? (() => router.post('/logout'));

    return (
        <AppShell variant="sidebar">
            <Head title={headTitle} />

            <Sidebar collapsible="icon" variant="inset">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href={brand.href}>
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                        {brand.mark}
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{brand.title}</span>
                                        {brand.subtitle ? (
                                            <span className="truncate text-xs text-sidebar-foreground/70">
                                                {brand.subtitle}
                                            </span>
                                        ) : null}
                                    </div>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent>
                    <NavMain items={primaryItems} label={navLabel} />
                </SidebarContent>

                <SidebarFooter>
                    {secondaryGroups.length > 0 ? (
                        <>
                            <NavFooter groups={secondaryGroups} className="mt-auto" />
                            <SidebarSeparator className="my-1" />
                        </>
                    ) : null}

                    <Card className="border-sidebar-border/70 bg-sidebar-accent/35 shadow-none">
                        <CardContent className="space-y-4 p-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sidebar-primary/10 text-xs font-semibold text-sidebar-foreground">
                                    {identity.initials}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-sidebar-foreground">
                                        {identity.name}
                                    </p>
                                    <p className="truncate text-xs text-sidebar-foreground/70">
                                        {identity.secondary}
                                    </p>
                                </div>
                            </div>

                            {identity.tertiary ? (
                                <div className="text-xs text-sidebar-foreground/65">
                                    {identity.tertiary}
                                </div>
                            ) : null}

                            <Button
                                type="button"
                                variant="ghost"
                                className="w-full justify-start gap-2 px-2 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Sign out</span>
                            </Button>
                        </CardContent>
                    </Card>
                </SidebarFooter>
            </Sidebar>

            <AppContent
                variant="sidebar"
                className="relative overflow-x-hidden bg-[radial-gradient(circle_at_0%_0%,rgba(99,102,241,0.12),transparent_40%),radial-gradient(circle_at_100%_0%,rgba(20,184,166,0.14),transparent_45%),radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.1),transparent_50%)]"
            >
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.35),rgba(255,255,255,0.05)_38%,rgba(255,255,255,0.12)_70%,rgba(255,255,255,0.02))] dark:bg-[linear-gradient(125deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01)_38%,rgba(255,255,255,0.03)_70%,rgba(255,255,255,0.01))]" />
                <div className="relative z-10 flex min-h-svh flex-col" data-dashboard-scope>
                    <AppSidebarHeader
                        breadcrumbs={breadcrumbs}
                        showOrganizationSwitcher={false}
                    />

                    <div className="flex-1 space-y-6 px-4 py-4 md:px-6 lg:px-8">
                        <Card className="overflow-hidden border-border/70 bg-background/95 shadow-sm">
                            <CardContent className="flex items-center justify-between gap-4 p-3.5">
                                <div className="flex min-w-0 items-center gap-3">
                                    {badge ? (
                                        typeof badge === 'string' ? (
                                            <Badge className="shrink-0 rounded-md border border-border bg-muted px-2.5 py-0.5 text-[10px] text-muted-foreground shadow-none">
                                                {badge}
                                            </Badge>
                                        ) : (
                                            badge
                                        )
                                    ) : null}
                                    <div className="min-w-0">
                                        <h1 className="truncate text-base font-semibold tracking-tight text-foreground">
                                            {title}
                                        </h1>
                                        {subtitle ? (
                                            <p className="truncate text-[11px] text-muted-foreground">
                                                {subtitle}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>

                                {(heroMeta || headerActions) ? (
                                    <div className="flex shrink-0 items-center gap-3">
                                        {heroMeta}
                                        {headerActions}
                                    </div>
                                ) : null}
                            </CardContent>
                        </Card>

                        <div className={cn('space-y-6')}>{children}</div>
                    </div>
                </div>
            </AppContent>
        </AppShell>
    );
}

export type { HubNavGroup };
