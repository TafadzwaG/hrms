<?php

namespace App\Http\Controllers\Reports;

use App\Models\Timesheet;
use Illuminate\Http\Request;

class TimesheetReportController extends BaseReportController
{
    public function register(Request $request)
    {
        return $this->downloadRegisterReport($request, Timesheet::class, 'timesheet-register', [
            'id', 'employee_id', 'period_start', 'period_end', 'total_minutes', 'overtime_minutes', 'status', 'approved_by',
        ]);
    }

    public function byStatus(Request $request)
    {
        return $this->downloadGroupedCountReport($request, Timesheet::class, 'status', 'timesheet-by-status');
    }

    public function pendingApprovals(Request $request)
    {
        return $this->downloadContainsReport(
            $request,
            Timesheet::class,
            'status',
            'pending',
            'timesheet-pending-approvals',
            ['id', 'employee_id', 'period_start', 'period_end', 'total_minutes', 'overtime_minutes', 'status', 'approved_by']
        );
    }

    public function overtimeByEmployee(Request $request)
    {
        return $this->downloadGroupedSumReport($request, Timesheet::class, 'employee_id', 'overtime_minutes', 'timesheet-overtime-by-employee');
    }

    public function overtimeSummary(Request $request)
    {
        return $this->downloadRegisterReport($request, Timesheet::class, 'timesheet-overtime-summary', [
            'id', 'employee_id', 'period_start', 'period_end', 'overtime_minutes', 'status',
        ]);
    }

    public function totalMinutesByPeriod(Request $request)
    {
        return $this->downloadGroupedSumReport($request, Timesheet::class, 'period_start', 'total_minutes', 'timesheet-total-minutes-by-period');
    }

    public function exceptionTimesheets(Request $request)
    {
        return $this->downloadContainsReport(
            $request,
            Timesheet::class,
            'status',
            'reject',
            'timesheet-exception-records',
            ['id', 'employee_id', 'period_start', 'period_end', 'total_minutes', 'overtime_minutes', 'status']
        );
    }
}
