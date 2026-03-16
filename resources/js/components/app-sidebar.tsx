import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Building,
    Building2,
    Folder,
    LayoutGrid,
    Proportions,
    ShieldCheck,
    User,
    UserRoundCheckIcon,
    Users,
} from 'lucide-react';
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
import AppLogo from './app-logo';
import { dashboard } from '@/routes';

type FooterNavGroup = {
    title: string;
    icon?: NavItem['icon'];
    items: NavItem[];
};

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Employees',
        href: '/employees',
        icon: Users,
    },
    {
        title: 'Leave Requests',
        href: '/leave-requests',
        icon: BookOpen,
    },
    {
        title: 'Attendance',
        href: '/attendance-records',
        icon: User,
    },
    {
        title: 'Timesheets',
        href: '/timesheets',
        icon: BookOpen,
    },
    {
        title: 'Payroll Exports',
        href: '/payroll-exports',
        icon: Folder,
    },
    {
        title: 'Reports',
        href: '/reports',
        icon: LayoutGrid,
    },
];

const footerNavGroups: FooterNavGroup[] = [
    {
        title: 'Organization Setup',
        icon: Building2,
        items: [
            {
                title: 'Organisations',
                href: '/org-units',
                icon: Building,
            },
            {
                title: 'Locations',
                href: '/locations',
                icon: Building2,
            },
            {
                title: 'Positions',
                href: '/positions',
                icon: Proportions,
            },
        ],
    },
    {
        title: 'People Operations',
        icon: BookOpen,
        items: [
            {
                title: 'Workflows',
                href: '/workflows',
                icon: BookOpen,
            },
            {
                title: 'Onboarding',
                href: '/onboarding-tasks',
                icon: BookOpen,
            },
            {
                title: 'Offboarding',
                href: '/offboarding-tasks',
                icon: BookOpen,
            },
        ],
    },
    {
        title: 'Talent & Growth',
        icon: UserRoundCheckIcon,
        items: [
            {
                title: 'Requisitions',
                href: '/job-requisitions',
                icon: Folder,
            },
            {
                title: 'Candidates',
                href: '/candidates',
                icon: User,
            },
            {
                title: 'Performance',
                href: '/performance-reviews',
                icon: UserRoundCheckIcon,
            },
            {
                title: 'Learning',
                href: '/learning-courses',
                icon: BookOpen,
            },
        ],
    },
    {
        title: 'Repository',
        icon: Folder,
        items: [
            {
                title: 'Document Types',
                href: '/document-types',
                icon: Folder,
            },
            {
                title: 'Documents',
                href: '/documents',
                icon: Folder,
            },
        ],
    },
    {
        title: 'Administration',
        icon: ShieldCheck,
        items: [
            {
                title: 'Roles',
                href: '/roles',
                icon: UserRoundCheckIcon,
            },
            {
                title: 'User Management',
                href: '/users',
                icon: Users,
            },
        ],
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter groups={footerNavGroups} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
