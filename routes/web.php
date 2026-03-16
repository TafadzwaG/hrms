<?php

use App\Http\Controllers\AssetCategoryController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\AssetLocationController;
use App\Http\Controllers\AssetMaintenanceController;
use App\Http\Controllers\AssetVendorController;
use App\Http\Controllers\AttendanceRecordController;
use App\Http\Controllers\AuditTrailController;
use App\Http\Controllers\CandidateProfileController;
use App\Http\Controllers\ControlCenterController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DocumentTypeController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\EmployeeContractController;
use App\Http\Controllers\CurrentOrganizationController;
use App\Http\Controllers\JobRequisitionController;
use App\Http\Controllers\LearningCourseController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\OffboardingTaskController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\OnboardingTaskController;
use App\Http\Controllers\OrgUnitController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\PayslipController;
use App\Http\Controllers\PayslipDeliveryController;
use App\Http\Controllers\PayrollExportController;
use App\Http\Controllers\PayrollDashboardController;
use App\Http\Controllers\PayrollInputController;
use App\Http\Controllers\PerformanceReviewController;
use App\Http\Controllers\PermissionMatrixController;
use App\Http\Controllers\PayrollPayCodeController;
use App\Http\Controllers\PayrollPeriodController;
use App\Http\Controllers\PayrollResultController;
use App\Http\Controllers\PayrollReportController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\Reports\AssetReportController;
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
use App\Http\Controllers\SystemSettingsController;
use App\Http\Controllers\TimesheetController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WorkflowDefinitionController;
use App\Http\Controllers\EmployeePayrollProfileController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return Auth::check()
        ? redirect()->route('dashboard')
        : redirect()->route('login');
})->name('home');

Route::get('/reset-password', [PasswordResetController::class, 'show'])->name('password.manual.reset');
Route::post('/reset-password', [PasswordResetController::class, 'store'])->name('password.manual.update');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('organizations/switch', [CurrentOrganizationController::class, 'store'])
        ->name('organizations.switch');

    Route::get('dashboard', DashboardController::class)
        ->name('dashboard');

    Route::get('organizations/{organization}/members', [OrganizationController::class, 'members'])
        ->middleware('permission:organizations.view,organizations.manage_members')
        ->name('organizations.members');
    Route::post('organizations/{organization}/members', [OrganizationController::class, 'storeMember'])
        ->middleware('permission:organizations.manage_members')
        ->name('organizations.members.store');
    Route::put('organizations/{organization}/members/{user}', [OrganizationController::class, 'updateMember'])
        ->middleware('permission:organizations.manage_members')
        ->name('organizations.members.update');
    Route::delete('organizations/{organization}/members/{user}', [OrganizationController::class, 'destroyMember'])
        ->middleware('permission:organizations.manage_members')
        ->name('organizations.members.destroy');
    Route::resource('organizations', OrganizationController::class)
        ->middlewareFor(['index', 'show'], 'permission:organizations.view')
        ->middlewareFor(['create', 'store'], 'permission:organizations.create')
        ->middlewareFor(['edit', 'update'], 'permission:organizations.update')
        ->middlewareFor(['destroy'], 'permission:organizations.delete');

    Route::get('control-center', [ControlCenterController::class, 'index'])
        ->middleware('permission:roles.view,permissions.view,audit.view')
        ->name('control-center.index');

    Route::prefix('system-settings')
        ->name('system-settings.')
        ->group(function () {
            Route::get('/', [SystemSettingsController::class, 'index'])
                ->middleware('permission:settings.view')
                ->name('index');

            Route::put('/general', [SystemSettingsController::class, 'updateGeneral'])
                ->middleware('permission:settings.manage')
                ->name('general.update');

            Route::post('/branding/system-logo', [SystemSettingsController::class, 'uploadSystemLogo'])
                ->middleware('permission:branding.manage')
                ->name('branding.system-logo');

            Route::post('/branding/company-logo', [SystemSettingsController::class, 'uploadCompanyLogo'])
                ->middleware('permission:branding.manage')
                ->name('branding.company-logo');

            Route::put('/branding/theme', [SystemSettingsController::class, 'updateTheme'])
                ->middleware('permission:branding.manage')
                ->name('branding.theme.update');

            Route::put('/preferences', [SystemSettingsController::class, 'updatePreferences'])
                ->middleware('permission:settings.manage')
                ->name('preferences.update');

            Route::put('/backups', [SystemSettingsController::class, 'updateBackups'])
                ->middleware('permission:backups.manage')
                ->name('backups.update');

            Route::post('/backups/run', [SystemSettingsController::class, 'runBackup'])
                ->middleware('permission:backups.run')
                ->name('backups.run');

            Route::get('/backups/download/{file}', [SystemSettingsController::class, 'downloadBackup'])
                ->middleware('permission:backups.manage')
                ->name('backups.download');
        });

    Route::prefix('audit-trail')
        ->name('audit-trail.')
        ->group(function () {
            Route::get('/', [AuditTrailController::class, 'index'])
                ->middleware('permission:audit.view')
                ->name('index');
            Route::get('/logs', [AuditTrailController::class, 'logs'])
                ->middleware('permission:audit.view')
                ->name('logs');
            Route::get('/logs/export', [AuditTrailController::class, 'export'])
                ->middleware('permission:audit.export')
                ->name('export');
            Route::get('/logs/{auditLog}', [AuditTrailController::class, 'show'])
                ->middleware('permission:audit.view')
                ->name('show');
        });

    Route::get('/org-units/upload', [OrgUnitController::class, 'upload'])
        ->middleware('permission:org_units.bulk_upload')
        ->name('org-units.upload');
    Route::get('/org-units/template', [OrgUnitController::class, 'downloadTemplate'])
        ->middleware('permission:org_units.bulk_upload')
        ->name('org-units.template');
    Route::post('/org-units/import', [OrgUnitController::class, 'import'])
        ->middleware('permission:org_units.bulk_upload')
        ->name('org-units.import');
    Route::resource('org-units', OrgUnitController::class)
        ->middlewareFor(['index', 'show'], 'permission:org_units.view')
        ->middlewareFor(['create', 'store'], 'permission:org_units.create')
        ->middlewareFor(['edit', 'update'], 'permission:org_units.update')
        ->middlewareFor(['destroy'], 'permission:org_units.delete');

    Route::get('/locations/export', [LocationController::class, 'export'])
        ->middleware('permission:locations.view')
        ->name('locations.export');
    Route::get('/locations/upload', [LocationController::class, 'upload'])
        ->middleware('permission:locations.bulk_upload')
        ->name('locations.upload');
    Route::get('/locations/template', [LocationController::class, 'downloadTemplate'])
        ->middleware('permission:locations.bulk_upload')
        ->name('locations.template');
    Route::post('/locations/import', [LocationController::class, 'import'])
        ->middleware('permission:locations.bulk_upload')
        ->name('locations.import');
    Route::resource('locations', LocationController::class)
        ->middlewareFor(['index', 'show'], 'permission:locations.view')
        ->middlewareFor(['create', 'store'], 'permission:locations.create')
        ->middlewareFor(['edit', 'update'], 'permission:locations.update')
        ->middlewareFor(['destroy'], 'permission:locations.delete');

    Route::get('roles/matrix', [PermissionMatrixController::class, 'index'])
        ->middleware('permission:permissions.view')
        ->name('roles.matrix');
    Route::put('roles/matrix', [PermissionMatrixController::class, 'update'])
        ->middleware('permission:permissions.assign')
        ->name('roles.matrix.update');
    Route::resource('roles', RoleController::class)
        ->middlewareFor(['index', 'show'], 'permission:roles.view')
        ->middlewareFor(['create', 'store'], 'permission:roles.create')
        ->middlewareFor(['edit', 'update'], 'permission:roles.update')
        ->middlewareFor(['destroy'], 'permission:roles.delete');

    Route::get('/positions/upload', [PositionController::class, 'upload'])
        ->middleware('permission:positions.bulk_upload')
        ->name('positions.upload');
    Route::get('/positions/template', [PositionController::class, 'downloadTemplate'])
        ->middleware('permission:positions.bulk_upload')
        ->name('positions.template');
    Route::post('/positions/import', [PositionController::class, 'import'])
        ->middleware('permission:positions.bulk_upload')
        ->name('positions.import');
    Route::resource('positions', PositionController::class)
        ->middlewareFor(['index', 'show'], 'permission:positions.view')
        ->middlewareFor(['create', 'store'], 'permission:positions.create')
        ->middlewareFor(['edit', 'update'], 'permission:positions.update')
        ->middlewareFor(['destroy'], 'permission:positions.delete');

    Route::get('/employees/upload', [EmployeeController::class, 'upload'])
        ->middleware('permission:employees.bulk_upload')
        ->name('employees.upload');
    Route::get('/employees/template', [EmployeeController::class, 'downloadTemplate'])
        ->middleware('permission:employees.bulk_upload')
        ->name('employees.template');
    Route::post('/employees/import', [EmployeeController::class, 'import'])
        ->middleware('permission:employees.bulk_upload')
        ->name('employees.import');
    Route::post('/employees/{employee}/documents', [EmployeeController::class, 'storeDocument'])
        ->middleware('permission:documents.create')
        ->name('employees.documents.store');
    Route::get('/employees/{employee}/documents/{document}/download', [EmployeeController::class, 'downloadDocument'])
        ->middleware('permission:documents.view')
        ->name('employees.documents.download');
    Route::delete('/employees/{employee}/documents/{document}', [EmployeeController::class, 'destroyDocument'])
        ->middleware('permission:documents.delete')
        ->name('employees.documents.destroy');
    Route::post('/employees/{employee}/next-of-kin', [EmployeeController::class, 'storeNextOfKin'])
        ->middleware('permission:employees.update')
        ->name('employees.next-of-kin.store');
    Route::put('/employees/{employee}/next-of-kin/{nextOfKin}', [EmployeeController::class, 'updateNextOfKin'])
        ->middleware('permission:employees.update')
        ->name('employees.next-of-kin.update');
    Route::delete('/employees/{employee}/next-of-kin/{nextOfKin}', [EmployeeController::class, 'destroyNextOfKin'])
        ->middleware('permission:employees.update')
        ->name('employees.next-of-kin.destroy');
    Route::post('/employees/{employee}/physical-profile', [EmployeeController::class, 'storePhysicalProfile'])
        ->middleware('permission:employees.update')
        ->name('employees.physical-profile.store');
    Route::post('/employees/{employee}/skills', [EmployeeController::class, 'storeSkill'])
        ->middleware('permission:employees.update')
        ->name('employees.skills.store');
    Route::put('/employees/{employee}/skills/{skill}', [EmployeeController::class, 'updateSkill'])
        ->middleware('permission:employees.update')
        ->name('employees.skills.update');
    Route::delete('/employees/{employee}/skills/{skill}', [EmployeeController::class, 'destroySkill'])
        ->middleware('permission:employees.update')
        ->name('employees.skills.destroy');
    Route::post('/employees/{employee}/job-profile', [EmployeeController::class, 'storeJobProfile'])
        ->middleware('permission:employees.update')
        ->name('employees.job-profile.store');
    Route::post('/employees/{employee}/kpis', [EmployeeController::class, 'storeKpi'])
        ->middleware('permission:employees.update')
        ->name('employees.kpis.store');
    Route::put('/employees/{employee}/kpis/{kpi}', [EmployeeController::class, 'updateKpi'])
        ->middleware('permission:employees.update')
        ->name('employees.kpis.update');
    Route::delete('/employees/{employee}/kpis/{kpi}', [EmployeeController::class, 'destroyKpi'])
        ->middleware('permission:employees.update')
        ->name('employees.kpis.destroy');
    Route::resource('employees', EmployeeController::class)
        ->middlewareFor(['index', 'show'], 'permission:employees.view')
        ->middlewareFor(['create', 'store'], 'permission:employees.create')
        ->middlewareFor(['edit', 'update'], 'permission:employees.update')
        ->middlewareFor(['destroy'], 'permission:employees.delete');

    Route::prefix('employees/{employee}/contracts')
        ->name('employees.contracts.')
        ->group(function () {
            Route::get('/', [EmployeeContractController::class, 'index'])
                ->middleware('permission:contracts.view')
                ->name('index');
            Route::get('/create', [EmployeeContractController::class, 'create'])
                ->middleware('permission:contracts.create')
                ->name('create');
            Route::post('/', [EmployeeContractController::class, 'store'])
                ->middleware('permission:contracts.create')
                ->name('store');
            Route::get('/{contract}', [EmployeeContractController::class, 'show'])
                ->middleware('permission:contracts.view')
                ->name('show');
            Route::get('/{contract}/edit', [EmployeeContractController::class, 'edit'])
                ->middleware('permission:contracts.update')
                ->name('edit');
            Route::put('/{contract}', [EmployeeContractController::class, 'update'])
                ->middleware('permission:contracts.update')
                ->name('update');
            Route::delete('/{contract}', [EmployeeContractController::class, 'destroy'])
                ->middleware('permission:contracts.delete')
                ->name('destroy');
            Route::post('/{contract}/activate', [EmployeeContractController::class, 'activate'])
                ->middleware('permission:contracts.activate')
                ->name('activate');
            Route::post('/{contract}/terminate', [EmployeeContractController::class, 'terminate'])
                ->middleware('permission:contracts.terminate')
                ->name('terminate');
            Route::post('/{contract}/documents', [EmployeeContractController::class, 'storeDocument'])
                ->middleware('permission:contracts.documents.manage')
                ->name('documents.store');
            Route::get('/{contract}/documents/{document}/download', [EmployeeContractController::class, 'downloadDocument'])
                ->middleware('permission:contracts.documents.manage')
                ->name('documents.download');
            Route::delete('/{contract}/documents/{document}', [EmployeeContractController::class, 'destroyDocument'])
                ->middleware('permission:contracts.documents.manage')
                ->name('documents.destroy');
        });

    // ── Asset Management ──────────────────────────────────
    Route::prefix('assets')
        ->name('assets.')
        ->group(function () {
            Route::get('/', [AssetController::class, 'index'])
                ->middleware('permission:assets.view')
                ->name('index');
            Route::get('/create', [AssetController::class, 'create'])
                ->middleware('permission:assets.create')
                ->name('create');
            Route::post('/', [AssetController::class, 'store'])
                ->middleware('permission:assets.create')
                ->name('store');
            Route::get('/{asset}', [AssetController::class, 'show'])
                ->middleware('permission:assets.view')
                ->name('show');
            Route::get('/{asset}/edit', [AssetController::class, 'edit'])
                ->middleware('permission:assets.update')
                ->name('edit');
            Route::put('/{asset}', [AssetController::class, 'update'])
                ->middleware('permission:assets.update')
                ->name('update');
            Route::delete('/{asset}', [AssetController::class, 'destroy'])
                ->middleware('permission:assets.delete')
                ->name('destroy');

            // Actions
            Route::post('/{asset}/assign', [AssetController::class, 'assign'])
                ->middleware('permission:assets.assign')
                ->name('assign');
            Route::post('/{asset}/return', [AssetController::class, 'returnAsset'])
                ->middleware('permission:assets.assign')
                ->name('return');
            Route::post('/{asset}/dispose', [AssetController::class, 'dispose'])
                ->middleware('permission:assets.dispose')
                ->name('dispose');

            // Documents
            Route::post('/{asset}/documents', [AssetController::class, 'storeDocument'])
                ->middleware('permission:assets.documents.manage')
                ->name('documents.store');
            Route::get('/{asset}/documents/{document}/download', [AssetController::class, 'downloadDocument'])
                ->middleware('permission:assets.documents.manage')
                ->name('documents.download');
            Route::delete('/{asset}/documents/{document}', [AssetController::class, 'destroyDocument'])
                ->middleware('permission:assets.documents.manage')
                ->name('documents.destroy');

            // Maintenance (nested)
            Route::prefix('/{asset}/maintenance')
                ->name('maintenance.')
                ->group(function () {
                    Route::get('/', [AssetMaintenanceController::class, 'index'])
                        ->middleware('permission:assets.maintenance.view')
                        ->name('index');
                    Route::get('/create', [AssetMaintenanceController::class, 'create'])
                        ->middleware('permission:assets.maintenance.manage')
                        ->name('create');
                    Route::post('/', [AssetMaintenanceController::class, 'store'])
                        ->middleware('permission:assets.maintenance.manage')
                        ->name('store');
                    Route::get('/{maintenance}', [AssetMaintenanceController::class, 'show'])
                        ->middleware('permission:assets.maintenance.view')
                        ->name('show');
                    Route::get('/{maintenance}/edit', [AssetMaintenanceController::class, 'edit'])
                        ->middleware('permission:assets.maintenance.manage')
                        ->name('edit');
                    Route::put('/{maintenance}', [AssetMaintenanceController::class, 'update'])
                        ->middleware('permission:assets.maintenance.manage')
                        ->name('update');
                    Route::delete('/{maintenance}', [AssetMaintenanceController::class, 'destroy'])
                        ->middleware('permission:assets.maintenance.manage')
                        ->name('destroy');
                });
        });

    // Asset Settings
    Route::prefix('asset-categories')
        ->name('asset-categories.')
        ->group(function () {
            Route::get('/', [AssetCategoryController::class, 'index'])
                ->middleware('permission:assets.categories.view')
                ->name('index');
            Route::get('/create', [AssetCategoryController::class, 'create'])
                ->middleware('permission:assets.categories.manage')
                ->name('create');
            Route::post('/', [AssetCategoryController::class, 'store'])
                ->middleware('permission:assets.categories.manage')
                ->name('store');
            Route::get('/{assetCategory}/edit', [AssetCategoryController::class, 'edit'])
                ->middleware('permission:assets.categories.manage')
                ->name('edit');
            Route::put('/{assetCategory}', [AssetCategoryController::class, 'update'])
                ->middleware('permission:assets.categories.manage')
                ->name('update');
            Route::delete('/{assetCategory}', [AssetCategoryController::class, 'destroy'])
                ->middleware('permission:assets.categories.manage')
                ->name('destroy');
        });

    Route::prefix('asset-vendors')
        ->name('asset-vendors.')
        ->group(function () {
            Route::get('/', [AssetVendorController::class, 'index'])
                ->middleware('permission:assets.vendors.view')
                ->name('index');
            Route::get('/create', [AssetVendorController::class, 'create'])
                ->middleware('permission:assets.vendors.manage')
                ->name('create');
            Route::post('/', [AssetVendorController::class, 'store'])
                ->middleware('permission:assets.vendors.manage')
                ->name('store');
            Route::get('/{assetVendor}/edit', [AssetVendorController::class, 'edit'])
                ->middleware('permission:assets.vendors.manage')
                ->name('edit');
            Route::put('/{assetVendor}', [AssetVendorController::class, 'update'])
                ->middleware('permission:assets.vendors.manage')
                ->name('update');
            Route::delete('/{assetVendor}', [AssetVendorController::class, 'destroy'])
                ->middleware('permission:assets.vendors.manage')
                ->name('destroy');
        });

    Route::prefix('asset-locations')
        ->name('asset-locations.')
        ->group(function () {
            Route::get('/', [AssetLocationController::class, 'index'])
                ->middleware('permission:assets.locations.view')
                ->name('index');
            Route::get('/create', [AssetLocationController::class, 'create'])
                ->middleware('permission:assets.locations.manage')
                ->name('create');
            Route::post('/', [AssetLocationController::class, 'store'])
                ->middleware('permission:assets.locations.manage')
                ->name('store');
            Route::get('/{assetLocation}/edit', [AssetLocationController::class, 'edit'])
                ->middleware('permission:assets.locations.manage')
                ->name('edit');
            Route::put('/{assetLocation}', [AssetLocationController::class, 'update'])
                ->middleware('permission:assets.locations.manage')
                ->name('update');
            Route::delete('/{assetLocation}', [AssetLocationController::class, 'destroy'])
                ->middleware('permission:assets.locations.manage')
                ->name('destroy');
        });

    Route::post('/users/{user}/send-password-reset-link', [PasswordResetController::class, 'sendResetLink'])
        ->middleware('permission:users.update')
        ->name('users.send-password-reset-link');
    Route::delete('/users/{user}/roles/{role}', [UserController::class, 'destroyRole'])
        ->middleware('permission:users.assign_roles')
        ->name('users.roles.destroy');
    Route::resource('users', UserController::class)
        ->middlewareFor(['index', 'show'], 'permission:users.view')
        ->middlewareFor(['create', 'store'], 'permission:users.create')
        ->middlewareFor(['edit', 'update'], 'permission:users.update')
        ->middlewareFor(['destroy'], 'permission:users.delete');

    Route::resource('workflows', WorkflowDefinitionController::class)
        ->middlewareFor(['index', 'show'], 'permission:workflows.view')
        ->middlewareFor(['create', 'store'], 'permission:workflows.create')
        ->middlewareFor(['edit', 'update'], 'permission:workflows.update')
        ->middlewareFor(['destroy'], 'permission:workflows.delete');

    Route::prefix('leave-requests')->group(function () {
        Route::get('{leave_request}/approval', [LeaveRequestController::class, 'approval'])
            ->middleware('permission:leave.approve')
            ->name('leave-requests.approval');
        Route::post('{leave_request}/approve', [LeaveRequestController::class, 'approve'])
            ->middleware('permission:leave.approve')
            ->name('leave-requests.approve');
        Route::post('{leave_request}/deny', [LeaveRequestController::class, 'deny'])
            ->middleware('permission:leave.approve')
            ->name('leave-requests.deny');
        Route::post('{leave_request}/request-changes', [LeaveRequestController::class, 'requestChanges'])
            ->middleware('permission:leave.approve')
            ->name('leave-requests.request-changes');
        Route::post('{leave_request}/notes', [LeaveRequestController::class, 'saveNote'])
            ->middleware('permission:leave.manage')
            ->name('leave-requests.notes');
    });
    Route::resource('leave-requests', LeaveRequestController::class)
        ->middlewareFor(['index', 'show'], 'permission:leave.view')
        ->middlewareFor(['create', 'store'], 'permission:leave.create')
        ->middlewareFor(['edit', 'update'], 'permission:leave.manage')
        ->middlewareFor(['destroy'], 'permission:leave.delete');

    Route::resource('attendance-records', AttendanceRecordController::class)
        ->middlewareFor(['index', 'show'], 'permission:attendance.view')
        ->middlewareFor(['create', 'store'], 'permission:attendance.manage')
        ->middlewareFor(['edit', 'update'], 'permission:attendance.manage')
        ->middlewareFor(['destroy'], 'permission:attendance.delete');

    Route::prefix('timesheets')->group(function () {
        Route::get('bulk-upload', [TimesheetController::class, 'bulkUpload'])
            ->middleware('permission:timesheets.bulk_upload')
            ->name('timesheets.bulk-upload');
        Route::post('bulk-upload/preview', [TimesheetController::class, 'previewBulk'])
            ->middleware('permission:timesheets.bulk_upload')
            ->name('timesheets.bulk-preview');
        Route::post('bulk-upload/process', [TimesheetController::class, 'processBulk'])
            ->middleware('permission:timesheets.bulk_upload')
            ->name('timesheets.bulk-process');
        Route::delete('bulk-upload/discard', [TimesheetController::class, 'discardBulk'])
            ->middleware('permission:timesheets.bulk_upload')
            ->name('timesheets.bulk-discard');
        Route::get('bulk-upload/template', [TimesheetController::class, 'downloadBulkTemplate'])
            ->middleware('permission:timesheets.bulk_upload')
            ->name('timesheets.bulk-template');
        Route::post('{timesheet}/approve', [TimesheetController::class, 'approve'])
            ->middleware('permission:timesheets.approve')
            ->name('timesheets.approve');
        Route::post('{timesheet}/reject', [TimesheetController::class, 'reject'])
            ->middleware('permission:timesheets.approve')
            ->name('timesheets.reject');
    });
    Route::resource('timesheets', TimesheetController::class)
        ->middlewareFor(['index', 'show'], 'permission:timesheets.view')
        ->middlewareFor(['create', 'store'], 'permission:timesheets.create')
        ->middlewareFor(['edit', 'update'], 'permission:timesheets.update')
        ->middlewareFor(['destroy'], 'permission:timesheets.delete');

    Route::prefix('payroll')->name('payroll.')->group(function () {
        Route::get('/', PayrollDashboardController::class)
            ->middleware('permission:payroll.view')
            ->name('index');

        Route::get('periods', [PayrollPeriodController::class, 'index'])
            ->middleware('permission:payroll.view')
            ->name('periods.index');
        Route::post('periods', [PayrollPeriodController::class, 'store'])
            ->middleware('permission:payroll.manage')
            ->name('periods.store');
        Route::get('periods/{period}', [PayrollPeriodController::class, 'show'])
            ->middleware('permission:payroll.view')
            ->name('periods.show');
        Route::put('periods/{period}', [PayrollPeriodController::class, 'update'])
            ->middleware('permission:payroll.manage')
            ->name('periods.update');
        Route::delete('periods/{period}', [PayrollPeriodController::class, 'destroy'])
            ->middleware('permission:payroll.manage')
            ->name('periods.destroy');
        Route::post('periods/{period}/process', [PayrollPeriodController::class, 'process'])
            ->middleware('permission:payroll.process')
            ->name('periods.process');
        Route::post('periods/{period}/approve', [PayrollPeriodController::class, 'approve'])
            ->middleware('permission:payroll.approve')
            ->name('periods.approve');
        Route::post('periods/{period}/close', [PayrollPeriodController::class, 'close'])
            ->middleware('permission:payroll.close')
            ->name('periods.close');
        Route::post('periods/{period}/reopen', [PayrollPeriodController::class, 'reopen'])
            ->middleware('permission:payroll.close')
            ->name('periods.reopen');
        Route::post('periods/{period}/exchange-rates', [PayrollPeriodController::class, 'storeExchangeRate'])
            ->middleware('permission:payroll.manage')
            ->name('periods.exchange-rates.store');
        Route::put('periods/{period}/exchange-rates/{exchangeRate}', [PayrollPeriodController::class, 'updateExchangeRate'])
            ->middleware('permission:payroll.manage')
            ->name('periods.exchange-rates.update');
        Route::delete('periods/{period}/exchange-rates/{exchangeRate}', [PayrollPeriodController::class, 'destroyExchangeRate'])
            ->middleware('permission:payroll.manage')
            ->name('periods.exchange-rates.destroy');

        Route::get('pay-codes', [PayrollPayCodeController::class, 'index'])
            ->middleware('permission:payroll.view')
            ->name('pay-codes.index');
        Route::post('pay-codes', [PayrollPayCodeController::class, 'store'])
            ->middleware('permission:payroll.paycodes.manage')
            ->name('pay-codes.store');
        Route::put('pay-codes/{payCode}', [PayrollPayCodeController::class, 'update'])
            ->middleware('permission:payroll.paycodes.manage')
            ->name('pay-codes.update');
        Route::delete('pay-codes/{payCode}', [PayrollPayCodeController::class, 'destroy'])
            ->middleware('permission:payroll.paycodes.manage')
            ->name('pay-codes.destroy');

        Route::get('profiles', [EmployeePayrollProfileController::class, 'index'])
            ->middleware('permission:payroll.view')
            ->name('profiles.index');
        Route::post('profiles', [EmployeePayrollProfileController::class, 'store'])
            ->middleware('permission:payroll.profile.manage')
            ->name('profiles.store');
        Route::put('profiles/{profile}', [EmployeePayrollProfileController::class, 'update'])
            ->middleware('permission:payroll.profile.manage')
            ->name('profiles.update');
        Route::delete('profiles/{profile}', [EmployeePayrollProfileController::class, 'destroy'])
            ->middleware('permission:payroll.profile.manage')
            ->name('profiles.destroy');
        Route::post('profiles/{profile}/items', [EmployeePayrollProfileController::class, 'storeRecurringItem'])
            ->middleware('permission:payroll.profile.manage')
            ->name('profiles.items.store');
        Route::put('profiles/{profile}/items/{item}', [EmployeePayrollProfileController::class, 'updateRecurringItem'])
            ->middleware('permission:payroll.profile.manage')
            ->name('profiles.items.update');
        Route::delete('profiles/{profile}/items/{item}', [EmployeePayrollProfileController::class, 'destroyRecurringItem'])
            ->middleware('permission:payroll.profile.manage')
            ->name('profiles.items.destroy');
        Route::post('profiles/{profile}/settlements', [EmployeePayrollProfileController::class, 'storeSettlementRule'])
            ->middleware('permission:payroll.profile.manage')
            ->name('profiles.settlements.store');
        Route::put('profiles/{profile}/settlements/{settlement}', [EmployeePayrollProfileController::class, 'updateSettlementRule'])
            ->middleware('permission:payroll.profile.manage')
            ->name('profiles.settlements.update');
        Route::delete('profiles/{profile}/settlements/{settlement}', [EmployeePayrollProfileController::class, 'destroySettlementRule'])
            ->middleware('permission:payroll.profile.manage')
            ->name('profiles.settlements.destroy');

        Route::get('inputs', [PayrollInputController::class, 'index'])
            ->middleware('permission:payroll.view')
            ->name('inputs.index');
        Route::post('inputs', [PayrollInputController::class, 'store'])
            ->middleware('permission:payroll.inputs.manage')
            ->name('inputs.store');
        Route::put('inputs/{input}', [PayrollInputController::class, 'update'])
            ->middleware('permission:payroll.inputs.manage')
            ->name('inputs.update');
        Route::delete('inputs/{input}', [PayrollInputController::class, 'destroy'])
            ->middleware('permission:payroll.inputs.manage')
            ->name('inputs.destroy');
        Route::get('inputs/template', [PayrollInputController::class, 'template'])
            ->middleware('permission:payroll.inputs.manage')
            ->name('inputs.template');
        Route::post('inputs/import', [PayrollInputController::class, 'import'])
            ->middleware('permission:payroll.inputs.manage')
            ->name('inputs.import');

        Route::get('reports', [PayrollReportController::class, 'index'])
            ->middleware('permission:payroll.reports.view')
            ->name('reports.index');
        Route::get('reports/runs/{run}/register', [PayrollReportController::class, 'register'])
            ->middleware('permission:payroll.export')
            ->name('reports.register');
        Route::get('reports/runs/{run}/earnings', [PayrollReportController::class, 'earnings'])
            ->middleware('permission:payroll.export')
            ->name('reports.earnings');
        Route::get('reports/runs/{run}/deductions', [PayrollReportController::class, 'deductions'])
            ->middleware('permission:payroll.export')
            ->name('reports.deductions');
        Route::get('reports/runs/{run}/statutory', [PayrollReportController::class, 'statutory'])
            ->middleware('permission:payroll.export')
            ->name('reports.statutory');
        Route::get('reports/runs/{run}/bank', [PayrollReportController::class, 'bank'])
            ->middleware('permission:payroll.export')
            ->name('reports.bank');
        Route::get('reports/runs/{run}/journal', [PayrollReportController::class, 'journal'])
            ->middleware('permission:payroll.export')
            ->name('reports.journal');

        Route::get('results', [PayrollResultController::class, 'index'])
            ->middleware('permission:payroll.view')
            ->name('results.index');

        Route::get('payslips', [PayslipController::class, 'index'])
            ->middleware('permission:payslips.view,payroll.view')
            ->name('payslips.index');
        Route::post('payslips/email', [PayslipDeliveryController::class, 'bulkEmail'])
            ->middleware('permission:payslips.bulk_email,payroll.export')
            ->name('payslips.email.bulk');
        Route::post('payslips/sms', [PayslipDeliveryController::class, 'bulkSms'])
            ->middleware('permission:payslips.bulk_sms,payroll.export')
            ->name('payslips.sms.bulk');
        Route::get('payslips/{result}', [PayslipController::class, 'show'])
            ->middleware('permission:payslips.view,payroll.view')
            ->name('payslips.show');
        Route::get('payslips/{result}/download', [PayslipController::class, 'download'])
            ->middleware('permission:payslips.download,payroll.export')
            ->name('payslips.download');
        Route::post('payslips/{result}/email', [PayslipDeliveryController::class, 'email'])
            ->middleware('permission:payslips.email,payroll.export')
            ->name('payslips.email');
        Route::post('payslips/{result}/sms', [PayslipDeliveryController::class, 'sms'])
            ->middleware('permission:payslips.sms,payroll.export')
            ->name('payslips.sms');
    });

    Route::prefix('payroll-exports')->group(function () {
        Route::get('/template/download', [PayrollExportController::class, 'downloadTemplate'])
            ->middleware('permission:payroll.export');
        Route::post('/automation/run', [PayrollExportController::class, 'runAutomation'])
            ->middleware('permission:payroll.run');
        Route::post('/retry-failed', [PayrollExportController::class, 'retryFailed'])
            ->middleware('permission:payroll.run');
        Route::get('/', [PayrollExportController::class, 'index'])
            ->middleware('permission:payroll.view');
        Route::get('/create', [PayrollExportController::class, 'create'])
            ->middleware('permission:payroll.create');
        Route::post('/', [PayrollExportController::class, 'store'])
            ->middleware('permission:payroll.create');
        Route::get('/{payroll_export}', [PayrollExportController::class, 'show'])
            ->middleware('permission:payroll.view');
        Route::get('/{payroll_export}/edit', [PayrollExportController::class, 'edit'])
            ->middleware('permission:payroll.update');
        Route::put('/{payroll_export}', [PayrollExportController::class, 'update'])
            ->middleware('permission:payroll.update');
        Route::delete('/{payroll_export}', [PayrollExportController::class, 'destroy'])
            ->middleware('permission:payroll.delete');
        Route::get('/{payroll_export}/download', [PayrollExportController::class, 'downloadExport'])
            ->middleware('permission:payroll.export');
        Route::get('/{payroll_export}/pdf', [PayrollExportController::class, 'downloadPdfSummary'])
            ->middleware('permission:payroll.export');
    });
    Route::resource('job-requisitions', JobRequisitionController::class)
        ->middlewareFor(['index', 'show'], 'permission:requisitions.view')
        ->middlewareFor(['create', 'store'], 'permission:requisitions.create')
        ->middlewareFor(['edit', 'update'], 'permission:requisitions.update')
        ->middlewareFor(['destroy'], 'permission:requisitions.delete');
    Route::get('job-requisitions/{jobRequisition}/candidates/create', [CandidateProfileController::class, 'createForRequisition'])
        ->middleware('permission:candidates.create')
        ->name('job-requisitions.candidates.create');
    Route::resource('candidates', CandidateProfileController::class)
        ->middlewareFor(['index', 'show'], 'permission:candidates.view')
        ->middlewareFor(['create', 'store'], 'permission:candidates.create')
        ->middlewareFor(['edit', 'update'], 'permission:candidates.update')
        ->middlewareFor(['destroy'], 'permission:candidates.delete');

    Route::resource('onboarding-tasks', OnboardingTaskController::class)
        ->middlewareFor(['index', 'show'], 'permission:onboarding.view')
        ->middlewareFor(['create', 'store'], 'permission:onboarding.create')
        ->middlewareFor(['edit', 'update'], 'permission:onboarding.manage')
        ->middlewareFor(['destroy'], 'permission:onboarding.delete');
    Route::resource('offboarding-tasks', OffboardingTaskController::class)
        ->middlewareFor(['index', 'show'], 'permission:offboarding.view')
        ->middlewareFor(['create', 'store'], 'permission:offboarding.create')
        ->middlewareFor(['edit', 'update'], 'permission:offboarding.manage')
        ->middlewareFor(['destroy'], 'permission:offboarding.delete');
    Route::resource('performance-reviews', PerformanceReviewController::class)
        ->middlewareFor(['index', 'show'], 'permission:performance.view')
        ->middlewareFor(['create', 'store'], 'permission:performance.create')
        ->middlewareFor(['edit', 'update'], 'permission:performance.manage')
        ->middlewareFor(['destroy'], 'permission:performance.delete');
    Route::resource('learning-courses', LearningCourseController::class)
        ->middlewareFor(['index', 'show'], 'permission:learning.view')
        ->middlewareFor(['create', 'store'], 'permission:learning.create')
        ->middlewareFor(['edit', 'update'], 'permission:learning.manage')
        ->middlewareFor(['destroy'], 'permission:learning.delete');
    Route::resource('document-types', DocumentTypeController::class)
        ->middlewareFor(['index', 'show'], 'permission:document_types.view')
        ->middlewareFor(['create', 'store'], 'permission:document_types.create')
        ->middlewareFor(['edit', 'update'], 'permission:document_types.update')
        ->middlewareFor(['destroy'], 'permission:document_types.delete');
    Route::get('documents/trash', [DocumentController::class, 'trash'])
        ->middleware('permission:documents.view')
        ->name('documents.trash');
    Route::post('documents/{id}/restore', [DocumentController::class, 'restore'])
        ->middleware('permission:documents.restore')
        ->name('documents.restore');
    Route::delete('documents/{id}/force-destroy', [DocumentController::class, 'forceDestroy'])
        ->middleware('permission:documents.delete')
        ->name('documents.force-destroy');
    Route::resource('documents', DocumentController::class)
        ->middlewareFor(['index', 'show'], 'permission:documents.view')
        ->middlewareFor(['create', 'store'], 'permission:documents.create')
        ->middlewareFor(['edit', 'update'], 'permission:documents.update')
        ->middlewareFor(['destroy'], 'permission:documents.delete');

    Route::middleware(['throttle:20,1', 'permission:reports.view'])
        ->prefix('reports')
        ->name('reports.')
        ->group(function () {
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

            Route::prefix('assets')->name('assets.')->group(function () {
                Route::get('register', [AssetReportController::class, 'register'])->name('register');
                Route::get('by-category', [AssetReportController::class, 'byCategory'])->name('by-category');
                Route::get('by-status', [AssetReportController::class, 'byStatus'])->name('by-status');
                Route::get('by-location', [AssetReportController::class, 'byLocation'])->name('by-location');
                Route::get('by-condition', [AssetReportController::class, 'byCondition'])->name('by-condition');
                Route::get('warranty-expiring', [AssetReportController::class, 'warrantyExpiring'])->name('warranty-expiring');
                Route::get('assignments', [AssetReportController::class, 'assignments'])->name('assignments');
                Route::get('maintenance', [AssetReportController::class, 'maintenance'])->name('maintenance');
                Route::get('depreciation', [AssetReportController::class, 'depreciation'])->name('depreciation');
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
