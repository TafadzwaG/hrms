<?php

namespace App\Http\Controllers\Reports;

use App\Models\OnboardingTask;
use Illuminate\Http\Request;

class OnboardingTaskReportController extends BaseReportController
{
    public function register(Request $request)
    {
        return $this->downloadRegisterReport($request, OnboardingTask::class, 'onboarding-task-register', [
            'id', 'employee_id', 'task_name', 'owner_id', 'due_date', 'completed_at', 'status', 'notes',
        ]);
    }

    public function byStatus(Request $request)
    {
        return $this->downloadGroupedCountReport($request, OnboardingTask::class, 'status', 'onboarding-task-by-status');
    }

    public function byEmployee(Request $request)
    {
        return $this->downloadGroupedCountReport($request, OnboardingTask::class, 'employee_id', 'onboarding-task-by-employee');
    }

    public function byOwner(Request $request)
    {
        return $this->downloadGroupedCountReport($request, OnboardingTask::class, 'owner_id', 'onboarding-task-by-owner');
    }

    public function overdue(Request $request)
    {
        return $this->downloadOverdueReport(
            $request,
            OnboardingTask::class,
            'due_date',
            'status',
            ['completed', 'done'],
            'onboarding-overdue-tasks',
            ['id', 'employee_id', 'task_name', 'owner_id', 'due_date', 'completed_at', 'status']
        );
    }
}
