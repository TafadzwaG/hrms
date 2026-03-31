import { LeaveRequestForm } from '@/components/leave-requests/leave-request-form';
import type { LeaveCalendar, LeaveEmployeeContext, LeaveEmployeeOption, LeaveStats } from '@/components/leave-requests/shared';
import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import type { PageRoleScope } from '@/types/auth';
import { Head, usePage } from '@inertiajs/react';

type LeaveTypeOption = {
    value: string;
    label: string;
};

type PageProps = {
    module: {
        slug: string;
        name: string;
    };
    employees: LeaveEmployeeOption[];
    defaultEmployeeId?: number | null;
    lockedEmployeeSelection: boolean;
    employeeContext?: LeaveEmployeeContext | null;
    stats: LeaveStats;
    calendar: LeaveCalendar;
    leaveTypes: LeaveTypeOption[];
    scope?: PageRoleScope | null;
};

export default function LeaveRequestCreate() {
    const props = usePage<PageProps>().props;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Leave Requests', href: `${API}/${props.module.slug}` },
                { title: 'Apply for Leave', href: `${API}/${props.module.slug}/create` },
            ]}
        >
            <Head title="Apply for Leave" />

            <LeaveRequestForm
                mode="create"
                module={props.module}
                employees={props.employees}
                defaultEmployeeId={props.defaultEmployeeId}
                lockedEmployeeSelection={props.lockedEmployeeSelection}
                employeeContext={props.employeeContext}
                stats={props.stats}
                calendar={props.calendar}
                leaveTypes={props.leaveTypes}
                scope={props.scope}
                previewPath={`${API}/${props.module.slug}/create`}
            />
        </AppLayout>
    );
}
