import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';
import { RbacSidebar } from '@/lib/app-sidebar-rbac';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <RbacSidebar />
            <AppContent
                variant="sidebar"
                className="relative overflow-x-hidden bg-[radial-gradient(circle_at_0%_0%,rgba(99,102,241,0.12),transparent_40%),radial-gradient(circle_at_100%_0%,rgba(20,184,166,0.14),transparent_45%),radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.1),transparent_50%)]"
            >
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.35),rgba(255,255,255,0.05)_38%,rgba(255,255,255,0.12)_70%,rgba(255,255,255,0.02))] dark:bg-[linear-gradient(125deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01)_38%,rgba(255,255,255,0.03)_70%,rgba(255,255,255,0.01))]" />
                <div className="relative z-10">
                    <AppSidebarHeader breadcrumbs={breadcrumbs} />
                    {children}
                </div>
            </AppContent>
        </AppShell>
    );
}
