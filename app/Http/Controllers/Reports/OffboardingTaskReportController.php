<?php

namespace App\Http\Controllers\Reports;

use App\Models\OffboardingTask;
use Illuminate\Http\Request;

class OffboardingTaskReportController extends BaseReportController
{
    public function register(Request $request)
    {
        return $this->downloadRegisterReport($request, OffboardingTask::class, 'offboarding-task-register', [
            'id', 'employee_id', 'task_name', 'owner_id', 'due_date', 'completed_at', 'status', 'notes',
        ]);
    }

    public function byStatus(Request $request)
    {
        return $this->downloadGroupedCountReport($request, OffboardingTask::class, 'status', 'offboarding-task-by-status');
    }

    public function byEmployee(Request $request)
    {
        return $this->downloadGroupedCountReport($request, OffboardingTask::class, 'employee_id', 'offboarding-task-by-employee');
    }

    public function byOwner(Request $request)
    {
        return $this->downloadGroupedCountReport($request, OffboardingTask::class, 'owner_id', 'offboarding-task-by-owner');
    }

    public function overdue(Request $request)
    {
        return $this->downloadOverdueReport(
            $request,
            OffboardingTask::class,
            'due_date',
            'status',
            ['completed', 'done'],
            'offboarding-overdue-tasks',
            ['id', 'employee_id', 'task_name', 'owner_id', 'due_date', 'completed_at', 'status']
        );
    }
}
