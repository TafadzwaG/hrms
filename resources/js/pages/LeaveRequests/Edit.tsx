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

type LeaveRequestRecord = {
    id: number;
    employee_id?: number | null;
    leave_type?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    days?: number | null;
    status?: string | null;
    reason?: string | null;
    approver_name?: string | null;
};

type PageProps = {
    module: {
        slug: string;
        name: string;
    };
    record: LeaveRequestRecord;
    employees: LeaveEmployeeOption[];
    defaultEmployeeId?: number | null;
    lockedEmployeeSelection: boolean;
    employeeContext?: LeaveEmployeeContext | null;
    stats: LeaveStats;
    calendar: LeaveCalendar;
    leaveTypes: LeaveTypeOption[];
    scope?: PageRoleScope | null;
};

export default function LeaveRequestEdit() {
    const props = usePage<PageProps>().props;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Leave Requests', href: `${API}/${props.module.slug}` },
                { title: `Request #${props.record.id}`, href: `${API}/${props.module.slug}/${props.record.id}` },
                { title: 'Edit', href: `${API}/${props.module.slug}/${props.record.id}/edit` },
            ]}
        >
            <Head title="Edit Leave Request" />

            <LeaveRequestForm
                mode="edit"
                module={props.module}
                record={props.record}
                employees={props.employees}
                defaultEmployeeId={props.defaultEmployeeId}
                lockedEmployeeSelection={props.lockedEmployeeSelection}
                employeeContext={props.employeeContext}
                stats={props.stats}
                calendar={props.calendar}
                leaveTypes={props.leaveTypes}
                scope={props.scope}
                previewPath={`${API}/${props.module.slug}/${props.record.id}/edit`}
            />
        </AppLayout>
    );
}
