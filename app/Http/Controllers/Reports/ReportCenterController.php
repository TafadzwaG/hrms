<?php

namespace App\Http\Controllers\Reports;

use App\Models\AttendanceRecord;
use App\Models\CandidateProfile;
use App\Models\Document;
use App\Models\Employee;
use App\Models\JobRequisition;
use App\Models\LearningCourse;
use App\Models\LeaveRequest;
use App\Models\OffboardingTask;
use App\Models\OnboardingTask;
use App\Models\PayrollExport;
use App\Models\PerformanceReview;
use App\Models\Timesheet;
use App\Models\Asset;
use App\Models\WorkflowDefinition;
use Inertia\Inertia;

class ReportCenterController extends BaseReportController
{
    public function index()
    {
        return Inertia::render('Reports/Index', [
            'metrics' => [
                'employees' => Employee::count(),
                'workflows' => WorkflowDefinition::count(),
                'leave_requests' => LeaveRequest::count(),
                'attendance_records' => AttendanceRecord::count(),
                'timesheets' => Timesheet::count(),
                'payroll_exports' => PayrollExport::count(),
                'job_requisitions' => JobRequisition::count(),
                'candidates' => CandidateProfile::count(),
                'onboarding_tasks' => OnboardingTask::count(),
                'offboarding_tasks' => OffboardingTask::count(),
                'performance_reviews' => PerformanceReview::count(),
                'learning_courses' => LearningCourse::count(),
                'documents' => Document::count(),
                'assets' => Asset::count(),
            ],
        ]);
    }
}
