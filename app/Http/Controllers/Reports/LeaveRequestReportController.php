<?php

namespace App\Http\Controllers\Reports;

use App\Models\LeaveRequest;
use Illuminate\Http\Request;

class LeaveRequestReportController extends BaseReportController
{
    public function register(Request $request)
    {
        return $this->downloadRegisterReport($request, LeaveRequest::class, 'leave-request-register', [
            'id', 'employee_id', 'leave_type', 'start_date', 'end_date', 'days', 'status', 'approver_name', 'reason',
        ]);
    }

    public function byStatus(Request $request)
    {
        return $this->downloadGroupedCountReport($request, LeaveRequest::class, 'status', 'leave-requests-by-status');
    }

    public function byType(Request $request)
    {
        return $this->downloadGroupedCountReport($request, LeaveRequest::class, 'leave_type', 'leave-requests-by-type');
    }

    public function byEmployee(Request $request)
    {
        return $this->downloadGroupedCountReport($request, LeaveRequest::class, 'employee_id', 'leave-requests-by-employee');
    }

    public function byMonth(Request $request)
    {
        return $this->downloadDateTrendReport($request, LeaveRequest::class, 'start_date', 'leave-requests-by-month');
    }

    public function pendingApprovals(Request $request)
    {
        return $this->downloadContainsReport(
            $request,
            LeaveRequest::class,
            'status',
            'pending',
            'leave-pending-approvals',
            ['id', 'employee_id', 'leave_type', 'start_date', 'end_date', 'days', 'status', 'approver_name']
        );
    }

    public function durationSummary(Request $request)
    {
        return $this->downloadGroupedSumReport($request, LeaveRequest::class, 'leave_type', 'days', 'leave-duration-summary');
    }
}
