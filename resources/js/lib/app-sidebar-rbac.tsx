import { Link } from '@inertiajs/react';
import { BookOpen, Building, Building2, FileText, Folder, History, LayoutGrid, Proportions, ShieldCheck, User, UserRoundCheckIcon, Users } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import AppLogo from '@/components/app-logo';
import { useAuthorization } from '@/lib/authorization';

type SidebarNavItem = NavItem & {
    permissionsAny?: string[];
};

const mainNavItems: SidebarNavItem[] = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid, permissionsAny: ['dashboard.view'] },
    { title: 'Employees', href: '/employees', icon: Users, permissionsAny: ['employees.view'] },
    { title: 'Leave Requests', href: '/leave-requests', icon: BookOpen, permissionsAny: ['leave.view'] },
    { title: 'Attendance', href: '/attendance-records', icon: User, permissionsAny: ['attendance.view'] },
    { title: 'Timesheets', href: '/timesheets', icon: BookOpen, permissionsAny: ['timesheets.view'] },
    { title: 'Payroll Exports', href: '/payroll-exports', icon: Folder, permissionsAny: ['payroll.view'] },
    { title: 'Reports', href: '/reports', icon: FileText, permissionsAny: ['reports.view'] },
];

const footerNavItems: SidebarNavItem[] = [
    { title: 'Organisations', href: '/org-units', icon: Building, permissionsAny: ['org_units.view'] },
    { title: 'Locations', href: '/locations', icon: Building2, permissionsAny: ['locations.view'] },
    { title: 'Positions', href: '/positions', icon: Proportions, permissionsAny: ['positions.view'] },
    { title: 'Workflows', href: '/workflows', icon: BookOpen, permissionsAny: ['workflows.view'] },
    { title: 'Requisitions', href: '/job-requisitions', icon: Folder, permissionsAny: ['requisitions.view'] },
    { title: 'Candidates', href: '/candidates', icon: User, permissionsAny: ['candidates.view'] },
    { title: 'Onboarding', href: '/onboarding-tasks', icon: BookOpen, permissionsAny: ['onboarding.view'] },
    { title: 'Offboarding', href: '/offboarding-tasks', icon: BookOpen, permissionsAny: ['offboarding.view'] },
    { title: 'Performance', href: '/performance-reviews', icon: UserRoundCheckIcon, permissionsAny: ['performance.view'] },
    { title: 'Learning', href: '/learning-courses', icon: BookOpen, permissionsAny: ['learning.view'] },
    { title: 'Documents', href: '/documents', icon: Folder, permissionsAny: ['documents.view'] },
    { title: 'Document Types', href: '/document-types', icon: Folder, permissionsAny: ['document_types.view'] },
    { title: 'User Management', href: '/users', icon: Users, permissionsAny: ['users.view'] },
    { title: 'Audit Trail', href: '/audit-trail', icon: History, permissionsAny: ['audit.view'] },
    { title: 'Control Center', href: '/control-center', icon: ShieldCheck, permissionsAny: ['roles.view', 'permissions.view', 'audit.view'] },
];

export function RbacSidebar() {
    const { canAny } = useAuthorization();
    const visibleMain = mainNavItems.filter((item) => !item.permissionsAny || canAny(item.permissionsAny));
    const visibleFooter = footerNavItems.filter((item) => !item.permissionsAny || canAny(item.permissionsAny));

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={visibleMain} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={visibleFooter} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
