<?php

use App\Http\Controllers\AttendanceRecordController;
use App\Http\Controllers\CandidateProfileController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DocumentTypeController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\JobRequisitionController;
use App\Http\Controllers\LearningCourseController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\OffboardingTaskController;
use App\Http\Controllers\OnboardingTaskController;
use App\Http\Controllers\OrgUnitController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\PayrollExportController;
use App\Http\Controllers\PerformanceReviewController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\Reports\AttendanceRecordReportController;
use App\Http\Controllers\Reports\CandidateProfileReportController;
use App\Http\Controllers\Reports\DocumentReportController;
use App\Http\Controllers\Reports\EmployeeReportController;
use App\Http\Controllers\Reports\JobRequisitionReportController;
use App\Http\Controllers\Reports\LearningCourseReportController;
use App\Http\Controllers\Reports\LeaveRequestReportController;
use App\Http\Controllers\Reports\OffboardingTaskReportController;
use App\Http\Controllers\Reports\OnboardingTaskReportController;
use App\Http\Controllers\Reports\PayrollExportReportController;
use App\Http\Controllers\Reports\PerformanceReviewReportController;
use App\Http\Controllers\Reports\ReportCenterController;
use App\Http\Controllers\Reports\TimesheetReportController;
use App\Http\Controllers\Reports\WorkflowDefinitionReportController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TimesheetController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WorkflowDefinitionController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Auth::check()
        ? redirect()->route('dashboard')
        : redirect()->route('login');
})->name('home');

Route::get('/reset-password', [PasswordResetController::class, 'show'])->name('password.manual.reset');
Route::post('/reset-password', [PasswordResetController::class, 'store'])->name('password.manual.update');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/org-units/upload', [OrgUnitController::class, 'upload'])->name('org-units.upload');
    Route::get('/org-units/template', [OrgUnitController::class, 'downloadTemplate'])->name('org-units.template');
    Route::post('/org-units/import', [OrgUnitController::class, 'import'])->name('org-units.import');
    Route::resource('org-units', OrgUnitController::class);
    Route::get('/locations/export', [LocationController::class, 'export'])->name('locations.export');
    Route::get('/locations/upload', [LocationController::class, 'upload'])->name('locations.upload');
    Route::get('/locations/template', [LocationController::class, 'downloadTemplate'])->name('locations.template');
    Route::post('/locations/import', [LocationController::class, 'import'])->name('locations.import');
    Route::resource('locations', LocationController::class);

    Route::resource('roles', RoleController::class);

    Route::get('/positions/upload', [PositionController::class, 'upload'])->name('positions.upload');
    Route::get('/positions/template', [PositionController::class, 'downloadTemplate'])->name('positions.template');
    Route::post('/positions/import', [PositionController::class, 'import'])->name('positions.import');
    Route::resource('positions', PositionController::class);

    Route::get('/employees/upload', [EmployeeController::class, 'upload'])->name('employees.upload');
    Route::get('/employees/template', [EmployeeController::class, 'downloadTemplate'])->name('employees.template');
    Route::post('/employees/import', [EmployeeController::class, 'import'])->name('employees.import');
    Route::resource('employees', EmployeeController::class);

    Route::post('/users/{user}/send-password-reset-link', [PasswordResetController::class, 'sendResetLink'])
        ->name('users.send-password-reset-link');
    Route::resource('users', UserController::class);

    // New HRMS modules from SRD/Business Case
    Route::resource('workflows', WorkflowDefinitionController::class);
    Route::prefix('leave-requests')->group(function () {
        Route::get('{leave_request}/approval', [LeaveRequestController::class, 'approval'])
            ->name('leave-requests.approval');

        Route::post('{leave_request}/approve', [LeaveRequestController::class, 'approve'])
            ->name('leave-requests.approve');

        Route::post('{leave_request}/deny', [LeaveRequestController::class, 'deny'])
            ->name('leave-requests.deny');

        Route::post('{leave_request}/request-changes', [LeaveRequestController::class, 'requestChanges'])
            ->name('leave-requests.request-changes');

        Route::post('{leave_request}/notes', [LeaveRequestController::class, 'saveNote'])
            ->name('leave-requests.notes');
    });

    Route::resource('leave-requests', LeaveRequestController::class);
    Route::resource('attendance-records', AttendanceRecordController::class);
    Route::prefix('timesheets')->group(function () {
        Route::get('bulk-upload', [TimesheetController::class, 'bulkUpload'])
            ->name('timesheets.bulk-upload');

        Route::post('bulk-upload/preview', [TimesheetController::class, 'previewBulk'])
            ->name('timesheets.bulk-preview');

        Route::post('bulk-upload/process', [TimesheetController::class, 'processBulk'])
            ->name('timesheets.bulk-process');

        Route::delete('bulk-upload/discard', [TimesheetController::class, 'discardBulk'])
            ->name('timesheets.bulk-discard');

        Route::get('bulk-upload/template', [TimesheetController::class, 'downloadBulkTemplate'])
            ->name('timesheets.bulk-template');

        Route::post('{timesheet}/approve', [TimesheetController::class, 'approve'])
            ->name('timesheets.approve');

        Route::post('{timesheet}/reject', [TimesheetController::class, 'reject'])
            ->name('timesheets.reject');
    });

    Route::resource('timesheets', TimesheetController::class);
    Route::prefix('payroll-exports')->group(function () {
        // Actions on the collection
        Route::get('/template/download', [PayrollExportController::class, 'downloadTemplate']);
        Route::post('/automation/run', [PayrollExportController::class, 'runAutomation']);
        Route::post('/retry-failed', [PayrollExportController::class, 'retryFailed']);

        // Standard Resources (Inertia)
        Route::get('/', [PayrollExportController::class, 'index']);
        Route::get('/create', [PayrollExportController::class, 'create']);
        Route::post('/', [PayrollExportController::class, 'store']);

        // Actions on specific records
        Route::get('/{payroll_export}', [PayrollExportController::class, 'show']);
        Route::get('/{payroll_export}/edit', [PayrollExportController::class, 'edit']);
        Route::put('/{payroll_export}', [PayrollExportController::class, 'update']);
        Route::delete('/{payroll_export}', [PayrollExportController::class, 'destroy']);

        // Download File actions
        Route::get('/{payroll_export}/download', [PayrollExportController::class, 'downloadExport']);
        Route::get('/{payroll_export}/pdf', [PayrollExportController::class, 'downloadPdfSummary']);
    });
    Route::resource('job-requisitions', JobRequisitionController::class);
    Route::get(
        'job-requisitions/{jobRequisition}/candidates/create',
        [CandidateProfileController::class, 'createForRequisition']
    )->name('job-requisitions.candidates.create');
    Route::resource('candidates', CandidateProfileController::class);
    Route::resource('onboarding-tasks', OnboardingTaskController::class);
    Route::resource('offboarding-tasks', OffboardingTaskController::class);
    Route::resource('performance-reviews', PerformanceReviewController::class);
    Route::resource('learning-courses', LearningCourseController::class);
    Route::resource('document-types', DocumentTypeController::class);
    Route::get('documents/trash', [DocumentController::class, 'trash'])->name('documents.trash');
    Route::post('documents/{id}/restore', [DocumentController::class, 'restore'])->name('documents.restore');
    Route::delete('documents/{id}/force-destroy', [DocumentController::class, 'forceDestroy'])->name('documents.force-destroy');
    Route::resource('documents', DocumentController::class);

    Route::middleware([
        'auth',
        'verified',
        'throttle:20,1',
        // Add your permission middleware here if you have one, e.g.:
        // 'permission:view reports'
    ])->prefix('reports')->name('reports.')->group(function () {
        Route::get('/', [ReportCenterController::class, 'index'])->name('index');

        Route::prefix('employees')->name('employees.')->group(function () {
            Route::get('master-list', [EmployeeReportController::class, 'masterList'])->name('master-list');
            Route::get('active-inactive', [EmployeeReportController::class, 'activeInactive'])->name('active-inactive');
            Route::get('headcount-by-department', [EmployeeReportController::class, 'headcountByDepartment'])->name('headcount-by-department');
            Route::get('headcount-by-location', [EmployeeReportController::class, 'headcountByLocation'])->name('headcount-by-location');
            Route::get('headcount-by-position', [EmployeeReportController::class, 'headcountByPosition'])->name('headcount-by-position');
            Route::get('headcount-by-manager', [EmployeeReportController::class, 'headcountByManager'])->name('headcount-by-manager');
            Route::get('new-hires-by-month', [EmployeeReportController::class, 'newHiresByMonth'])->name('new-hires-by-month');
            Route::get('terminations-by-month', [EmployeeReportController::class, 'terminationsByMonth'])->name('terminations-by-month');
            Route::get('tenure', [EmployeeReportController::class, 'tenure'])->name('tenure');
            Route::get('birthdays', [EmployeeReportController::class, 'birthdays'])->name('birthdays');
            Route::get('missing-profile-fields', [EmployeeReportController::class, 'missingProfileFields'])->name('missing-profile-fields');
        });

        Route::prefix('workflows')->name('workflows.')->group(function () {
            Route::get('register', [WorkflowDefinitionReportController::class, 'register'])->name('register');
            Route::get('by-module', [WorkflowDefinitionReportController::class, 'byModule'])->name('by-module');
            Route::get('by-status', [WorkflowDefinitionReportController::class, 'byStatus'])->name('by-status');
            Route::get('by-version', [WorkflowDefinitionReportController::class, 'byVersion'])->name('by-version');
            Route::get('by-owner', [WorkflowDefinitionReportController::class, 'byOwner'])->name('by-owner');
            Route::get('updated-trend', [WorkflowDefinitionReportController::class, 'updatedTrend'])->name('updated-trend');
        });

        Route::prefix('leave-requests')->name('leave-requests.')->group(function () {
            Route::get('register', [LeaveRequestReportController::class, 'register'])->name('register');
            Route::get('by-status', [LeaveRequestReportController::class, 'byStatus'])->name('by-status');
            Route::get('by-type', [LeaveRequestReportController::class, 'byType'])->name('by-type');
            Route::get('by-employee', [LeaveRequestReportController::class, 'byEmployee'])->name('by-employee');
            Route::get('by-month', [LeaveRequestReportController::class, 'byMonth'])->name('by-month');
            Route::get('pending-approvals', [LeaveRequestReportController::class, 'pendingApprovals'])->name('pending-approvals');
            Route::get('duration-summary', [LeaveRequestReportController::class, 'durationSummary'])->name('duration-summary');
        });

        Route::prefix('attendance-records')->name('attendance-records.')->group(function () {
            Route::get('register', [AttendanceRecordReportController::class, 'register'])->name('register');
            Route::get('by-status', [AttendanceRecordReportController::class, 'byStatus'])->name('by-status');
            Route::get('by-date', [AttendanceRecordReportController::class, 'byDate'])->name('by-date');
            Route::get('missing-clock-in', [AttendanceRecordReportController::class, 'missingClockIn'])->name('missing-clock-in');
            Route::get('missing-clock-out', [AttendanceRecordReportController::class, 'missingClockOut'])->name('missing-clock-out');
            Route::get('late-arrivals', [AttendanceRecordReportController::class, 'lateArrivals'])->name('late-arrivals');
            Route::get('exceptions', [AttendanceRecordReportController::class, 'exceptions'])->name('exceptions');
        });

        Route::prefix('timesheets')->name('timesheets.')->group(function () {
            Route::get('register', [TimesheetReportController::class, 'register'])->name('register');
            Route::get('by-status', [TimesheetReportController::class, 'byStatus'])->name('by-status');
            Route::get('pending-approvals', [TimesheetReportController::class, 'pendingApprovals'])->name('pending-approvals');
            Route::get('overtime-by-employee', [TimesheetReportController::class, 'overtimeByEmployee'])->name('overtime-by-employee');
            Route::get('overtime-summary', [TimesheetReportController::class, 'overtimeSummary'])->name('overtime-summary');
            Route::get('total-minutes-by-period', [TimesheetReportController::class, 'totalMinutesByPeriod'])->name('total-minutes-by-period');
            Route::get('exception-timesheets', [TimesheetReportController::class, 'exceptionTimesheets'])->name('exception-timesheets');
        });

        Route::prefix('payroll-exports')->name('payroll-exports.')->group(function () {
            Route::get('register', [PayrollExportReportController::class, 'register'])->name('register');
            Route::get('by-status', [PayrollExportReportController::class, 'byStatus'])->name('by-status');
            Route::get('failed', [PayrollExportReportController::class, 'failed'])->name('failed');
            Route::get('completed', [PayrollExportReportController::class, 'completed'])->name('completed');
            Route::get('version-history', [PayrollExportReportController::class, 'versionHistory'])->name('version-history');
            Route::get('by-period', [PayrollExportReportController::class, 'byPeriod'])->name('by-period');
        });

        Route::prefix('job-requisitions')->name('job-requisitions.')->group(function () {
            Route::get('register', [JobRequisitionReportController::class, 'register'])->name('register');
            Route::get('by-status', [JobRequisitionReportController::class, 'byStatus'])->name('by-status');
            Route::get('by-department', [JobRequisitionReportController::class, 'byDepartment'])->name('by-department');
            Route::get('by-hiring-manager', [JobRequisitionReportController::class, 'byHiringManager'])->name('by-hiring-manager');
            Route::get('opening-trend', [JobRequisitionReportController::class, 'openingTrend'])->name('opening-trend');
        });

        Route::prefix('candidate-profiles')->name('candidate-profiles.')->group(function () {
            Route::get('register', [CandidateProfileReportController::class, 'register'])->name('register');
            Route::get('by-stage', [CandidateProfileReportController::class, 'byStage'])->name('by-stage');
            Route::get('by-source', [CandidateProfileReportController::class, 'bySource'])->name('by-source');
            Route::get('by-requisition', [CandidateProfileReportController::class, 'byRequisition'])->name('by-requisition');
            Route::get('hired', [CandidateProfileReportController::class, 'hired'])->name('hired');
            Route::get('rejected', [CandidateProfileReportController::class, 'rejected'])->name('rejected');
        });

        Route::prefix('onboarding-tasks')->name('onboarding-tasks.')->group(function () {
            Route::get('register', [OnboardingTaskReportController::class, 'register'])->name('register');
            Route::get('by-status', [OnboardingTaskReportController::class, 'byStatus'])->name('by-status');
            Route::get('by-employee', [OnboardingTaskReportController::class, 'byEmployee'])->name('by-employee');
            Route::get('by-owner', [OnboardingTaskReportController::class, 'byOwner'])->name('by-owner');
            Route::get('overdue', [OnboardingTaskReportController::class, 'overdue'])->name('overdue');
        });

        Route::prefix('offboarding-tasks')->name('offboarding-tasks.')->group(function () {
            Route::get('register', [OffboardingTaskReportController::class, 'register'])->name('register');
            Route::get('by-status', [OffboardingTaskReportController::class, 'byStatus'])->name('by-status');
            Route::get('by-employee', [OffboardingTaskReportController::class, 'byEmployee'])->name('by-employee');
            Route::get('by-owner', [OffboardingTaskReportController::class, 'byOwner'])->name('by-owner');
            Route::get('overdue', [OffboardingTaskReportController::class, 'overdue'])->name('overdue');
        });

        Route::prefix('performance-reviews')->name('performance-reviews.')->group(function () {
            Route::get('register', [PerformanceReviewReportController::class, 'register'])->name('register');
            Route::get('by-status', [PerformanceReviewReportController::class, 'byStatus'])->name('by-status');
            Route::get('by-cycle', [PerformanceReviewReportController::class, 'byCycle'])->name('by-cycle');
            Route::get('by-reviewer', [PerformanceReviewReportController::class, 'byReviewer'])->name('by-reviewer');
            Route::get('by-rating', [PerformanceReviewReportController::class, 'byRating'])->name('by-rating');
            Route::get('overdue', [PerformanceReviewReportController::class, 'overdue'])->name('overdue');
        });

        Route::prefix('learning-courses')->name('learning-courses.')->group(function () {
            Route::get('catalog', [LearningCourseReportController::class, 'catalog'])->name('catalog');
            Route::get('by-category', [LearningCourseReportController::class, 'byCategory'])->name('by-category');
            Route::get('by-status', [LearningCourseReportController::class, 'byStatus'])->name('by-status');
            Route::get('mandatory', [LearningCourseReportController::class, 'mandatory'])->name('mandatory');
            Route::get('expiring', [LearningCourseReportController::class, 'expiring'])->name('expiring');
            Route::get('expired', [LearningCourseReportController::class, 'expired'])->name('expired');
        });

        Route::prefix('documents')->name('documents.')->group(function () {
            Route::get('register', [DocumentReportController::class, 'register'])->name('register');
            Route::get('by-type', [DocumentReportController::class, 'byType'])->name('by-type');
            Route::get('by-employee', [DocumentReportController::class, 'byEmployee'])->name('by-employee');
            Route::get('expiring', [DocumentReportController::class, 'expiring'])->name('expiring');
            Route::get('expired', [DocumentReportController::class, 'expired'])->name('expired');
            Route::get('missing-file-reference', [DocumentReportController::class, 'missingFileReference'])->name('missing-file-reference');
        });
    });
});

require __DIR__.'/settings.php';
