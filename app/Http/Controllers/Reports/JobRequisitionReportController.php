<?php

namespace App\Http\Controllers\Reports;

use App\Models\JobRequisition;
use Illuminate\Http\Request;

class JobRequisitionReportController extends BaseReportController
{
    public function register(Request $request)
    {
        return $this->downloadRegisterReport($request, JobRequisition::class, 'job-requisition-register', [
            'id', 'title', 'department_id', 'hiring_manager_id', 'status', 'priority', 'opened_at', 'closed_at', 'created_at',
        ]);
    }

    public function byStatus(Request $request)
    {
        return $this->downloadGroupedCountReport($request, JobRequisition::class, 'status', 'job-requisition-by-status');
    }

    public function byDepartment(Request $request)
    {
        return $this->downloadGroupedCountReport($request, JobRequisition::class, 'department_id', 'job-requisition-by-department');
    }

    public function byHiringManager(Request $request)
    {
        return $this->downloadGroupedCountReport($request, JobRequisition::class, 'hiring_manager_id', 'job-requisition-by-manager');
    }

    public function openingTrend(Request $request)
    {
        return $this->downloadDateTrendReport($request, JobRequisition::class, 'opened_at', 'job-requisition-opening-trend');
    }
}
