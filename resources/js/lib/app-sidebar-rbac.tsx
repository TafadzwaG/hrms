import { Link } from '@inertiajs/react';
import { BookOpen, Building, Building2, FileText, Folder, Heart, History, LayoutGrid, Package, Proportions, Settings, ShieldCheck, Target, User, UserRoundCheckIcon, Users } from 'lucide-react';
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

type SidebarNavGroup = {
    title: string;
    icon?: SidebarNavItem['icon'];
    items: SidebarNavItem[];
};

const mainNavItems: SidebarNavItem[] = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid, permissionsAny: ['dashboard.view'] },
    { title: 'Employees', href: '/employees', icon: Users, permissionsAny: ['employees.view'] },
    { title: 'Leave Requests', href: '/leave-requests', icon: BookOpen, permissionsAny: ['leave.view'] },
    { title: 'Attendance', href: '/attendance-records', icon: User, permissionsAny: ['attendance.view'] },
    { title: 'Timesheets', href: '/timesheets', icon: BookOpen, permissionsAny: ['timesheets.view'] },
    { title: 'Payroll', href: '/payroll', icon: Folder, permissionsAny: ['payroll.view'] },
    { title: 'Assets', href: '/assets', icon: Package, permissionsAny: ['assets.view'] },
    { title: 'Benefits', href: '/benefits/dashboard', icon: Heart, permissionsAny: ['benefits.view'] },
    { title: 'Performance', href: '/performance', icon: Target, permissionsAny: ['performance.view', 'performance.dashboard.view'] },
    { title: 'Reports', href: '/reports', icon: FileText, permissionsAny: ['reports.view'] },
];

const footerNavGroups: SidebarNavGroup[] = [
    {
        title: 'Organization Setup',
        icon: Building2,
        items: [
            { title: 'Organizations', href: '/organizations', icon: Building2, permissionsAny: ['organizations.view'] },
            { title: 'Org Units', href: '/org-units', icon: Building, permissionsAny: ['org_units.view'] },
            { title: 'Locations', href: '/locations', icon: Building2, permissionsAny: ['locations.view'] },
            { title: 'Positions', href: '/positions', icon: Proportions, permissionsAny: ['positions.view'] },
        ],
    },
    {
        title: 'People Operations',
        icon: BookOpen,
        items: [
            { title: 'Workflows', href: '/workflows', icon: BookOpen, permissionsAny: ['workflows.view'] },
            { title: 'Onboarding', href: '/onboarding-tasks', icon: BookOpen, permissionsAny: ['onboarding.view'] },
            { title: 'Offboarding', href: '/offboarding-tasks', icon: BookOpen, permissionsAny: ['offboarding.view'] },
        ],
    },
    {
        title: 'Talent & Growth',
        icon: UserRoundCheckIcon,
        items: [
            { title: 'Requisitions', href: '/job-requisitions', icon: Folder, permissionsAny: ['requisitions.view'] },
            { title: 'Candidates', href: '/candidates', icon: User, permissionsAny: ['candidates.view'] },
            { title: 'Performance Reviews', href: '/performance-reviews', icon: UserRoundCheckIcon, permissionsAny: ['performance.view'] },
            { title: 'Review Cycles', href: '/performance-cycles', icon: Target, permissionsAny: ['performance.cycles.manage'] },
            { title: 'KPI Library', href: '/kpi-library', icon: Target, permissionsAny: ['performance.kpis.manage'] },
            { title: 'Scorecard Templates', href: '/scorecard-templates', icon: Target, permissionsAny: ['performance.templates.manage'] },
            { title: 'Employee Scorecards', href: '/employee-scorecards', icon: Target, permissionsAny: ['performance.scorecards.view'] },
            { title: 'Improvement Plans', href: '/improvement-plans', icon: Target, permissionsAny: ['performance.improvement_plans.manage'] },
            { title: 'Learning', href: '/learning-courses', icon: BookOpen, permissionsAny: ['learning.view'] },
        ],
    },
    {
        title: 'Benefits Admin',
        icon: Heart,
        items: [
            { title: 'Benefits Catalog', href: '/benefits', icon: Heart, permissionsAny: ['benefits.view'] },
            { title: 'Enrollments', href: '/benefit-enrollments', icon: Heart, permissionsAny: ['benefits.enrollments.manage'] },
            { title: 'Benefit Reports', href: '/benefits/dashboard', icon: Heart, permissionsAny: ['benefits.reports.view'] },
        ],
    },
    {
        title: 'Asset Management',
        icon: Package,
        items: [
            { title: 'Asset Categories', href: '/asset-categories', icon: Package, permissionsAny: ['assets.categories.view'] },
            { title: 'Asset Vendors', href: '/asset-vendors', icon: Package, permissionsAny: ['assets.vendors.view'] },
            { title: 'Asset Locations', href: '/asset-locations', icon: Package, permissionsAny: ['assets.locations.view'] },
        ],
    },
    {
        title: 'Repository',
        icon: FileText,
        items: [
            { title: 'Document Types', href: '/document-types', icon: Folder, permissionsAny: ['document_types.view'] },
            { title: 'Documents', href: '/documents', icon: Folder, permissionsAny: ['documents.view'] },
        ],
    },
    {
        title: 'Administration',
        icon: ShieldCheck,
        items: [
            { title: 'User Management', href: '/users', icon: Users, permissionsAny: ['users.view'] },
            { title: 'Audit Trail', href: '/audit-trail', icon: History, permissionsAny: ['audit.view'] },
            { title: 'System Settings', href: '/system-settings', icon: Settings, permissionsAny: ['settings.view'] },
            { title: 'Control Center', href: '/control-center', icon: ShieldCheck, permissionsAny: ['roles.view', 'permissions.view', 'audit.view'] },
        ],
    },
];

export function RbacSidebar() {
    const { canAny } = useAuthorization();
    const visibleMain = mainNavItems.filter((item) => !item.permissionsAny || canAny(item.permissionsAny));
    const visibleFooterGroups = footerNavGroups
        .map((group) => ({
            ...group,
            items: group.items.filter((item) => !item.permissionsAny || canAny(item.permissionsAny)),
        }))
        .filter((group) => group.items.length > 0);

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
                <NavFooter groups={visibleFooterGroups} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
