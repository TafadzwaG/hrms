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
use App\Http\Controllers\ReportController;
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
    Route::resource('candidates', CandidateProfileController::class);
    Route::resource('onboarding-tasks', OnboardingTaskController::class);
    Route::resource('offboarding-tasks', OffboardingTaskController::class);
    Route::resource('performance-reviews', PerformanceReviewController::class);
    Route::resource('learning-courses', LearningCourseController::class);
    Route::resource('document-types', DocumentTypeController::class);
    Route::resource('documents', DocumentController::class);

    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
});

require __DIR__.'/settings.php';
