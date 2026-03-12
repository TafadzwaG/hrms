<?php

namespace App\Http\Controllers\Reports;

use App\Models\CandidateProfile;
use Illuminate\Http\Request;

class CandidateProfileReportController extends BaseReportController
{
    public function register(Request $request)
    {
        return $this->downloadRegisterReport($request, CandidateProfile::class, 'candidate-profile-register', [
            'id', 'job_requisition_id', 'source', 'stage', 'status', 'recruiter_id', 'application_date', 'decision_date', 'created_at',
        ]);
    }

    public function byStage(Request $request)
    {
        return $this->downloadGroupedCountReport($request, CandidateProfile::class, 'stage', 'candidate-by-stage');
    }

    public function bySource(Request $request)
    {
        return $this->downloadGroupedCountReport($request, CandidateProfile::class, 'source', 'candidate-by-source');
    }

    public function byRequisition(Request $request)
    {
        return $this->downloadGroupedCountReport($request, CandidateProfile::class, 'job_requisition_id', 'candidate-by-requisition');
    }

    public function hired(Request $request)
    {
        return $this->downloadContainsReport(
            $request,
            CandidateProfile::class,
            'status',
            'hired',
            'candidate-hired',
            ['id', 'job_requisition_id', 'source', 'stage', 'status', 'recruiter_id', 'application_date', 'decision_date']
        );
    }

    public function rejected(Request $request)
    {
        return $this->downloadContainsReport(
            $request,
            CandidateProfile::class,
            'status',
            'reject',
            'candidate-rejected',
            ['id', 'job_requisition_id', 'source', 'stage', 'status', 'recruiter_id', 'application_date', 'decision_date']
        );
    }
}
