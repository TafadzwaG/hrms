import { Head, usePage } from '@inertiajs/react';

import AppLayout from '@/layouts/app-layout';
import AuthoriserDashboard from '@/pages/dashboard/authoriser-dashboard';
import AuditorDashboard from '@/pages/dashboard/auditor-dashboard';
import EmployeeDashboard from '@/pages/dashboard/employee-dashboard';
import HrAdminDashboard from '@/pages/dashboard/hr-admin-dashboard';
import ManagerDashboard from '@/pages/dashboard/manager-dashboard';
import PayrollDashboard from '@/pages/dashboard/payroll-dashboard';
import type { DashboardPayload } from '@/pages/dashboard/shared';
import SystemAdminDashboard from '@/pages/dashboard/system-admin-dashboard';
import { dashboard as dashboardRoute } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type PageProps = {
    dashboard: DashboardPayload;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboardRoute().url,
    },
];

const dashboardComponents = {
    system_admin: SystemAdminDashboard,
    hr_admin: HrAdminDashboard,
    payroll: PayrollDashboard,
    manager: ManagerDashboard,
    authoriser: AuthoriserDashboard,
    auditor: AuditorDashboard,
    employee: EmployeeDashboard,
} as const;

export default function Dashboard() {
    const { dashboard } = usePage<PageProps>().props;
    const DashboardComponent = dashboardComponents[dashboard.variant as keyof typeof dashboardComponents] ?? EmployeeDashboard;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="space-y-5 px-4 py-4 md:px-6 lg:px-8">
                <DashboardComponent dashboard={dashboard} />
            </div>
        </AppLayout>
    );
}
