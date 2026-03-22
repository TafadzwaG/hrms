import PasswordResetController from './PasswordResetController'
import MarketplaceController from './MarketplaceController'
import CandidateAuthController from './CandidateAuthController'
import EmployerAuthController from './EmployerAuthController'
import Candidate from './Candidate'
import Employer from './Employer'
import CurrentOrganizationController from './CurrentOrganizationController'
import DashboardController from './DashboardController'
import OrganizationController from './OrganizationController'
import ControlCenterController from './ControlCenterController'
import SystemSettingsController from './SystemSettingsController'
import AuditTrailController from './AuditTrailController'
import OrgUnitController from './OrgUnitController'
import LocationController from './LocationController'
import PermissionMatrixController from './PermissionMatrixController'
import RoleController from './RoleController'
import PositionController from './PositionController'
import EmployeeController from './EmployeeController'
import EmployeeContractController from './EmployeeContractController'
import AssetController from './AssetController'
import AssetMaintenanceController from './AssetMaintenanceController'
import AssetCategoryController from './AssetCategoryController'
import AssetVendorController from './AssetVendorController'
import AssetLocationController from './AssetLocationController'
import UserController from './UserController'
import WorkflowDefinitionController from './WorkflowDefinitionController'
import LeaveRequestController from './LeaveRequestController'
import AttendanceRecordController from './AttendanceRecordController'
import TimesheetController from './TimesheetController'
import PayrollDashboardController from './PayrollDashboardController'
import PayrollPeriodController from './PayrollPeriodController'
import PayrollPayCodeController from './PayrollPayCodeController'
import EmployeePayrollProfileController from './EmployeePayrollProfileController'
import PayrollInputController from './PayrollInputController'
import PayrollReportController from './PayrollReportController'
import PayrollResultController from './PayrollResultController'
import PayslipController from './PayslipController'
import PayslipDeliveryController from './PayslipDeliveryController'
import PayrollExportController from './PayrollExportController'
import JobRequisitionController from './JobRequisitionController'
import CandidateProfileController from './CandidateProfileController'
import OnboardingTaskController from './OnboardingTaskController'
import OffboardingTaskController from './OffboardingTaskController'
import PerformanceReviewController from './PerformanceReviewController'
import PerformanceDashboardController from './PerformanceDashboardController'
import PerformanceCycleController from './PerformanceCycleController'
import KpiLibraryController from './KpiLibraryController'
import ScorecardTemplateController from './ScorecardTemplateController'
import EmployeeScorecardController from './EmployeeScorecardController'
import PerformanceImprovementPlanController from './PerformanceImprovementPlanController'
import BenefitsDashboardController from './BenefitsDashboardController'
import BenefitController from './BenefitController'
import BenefitPlanController from './BenefitPlanController'
import BenefitContributionRuleController from './BenefitContributionRuleController'
import EmployeeBenefitEnrollmentController from './EmployeeBenefitEnrollmentController'
import EmployeeBenefitDependantController from './EmployeeBenefitDependantController'
import LearningCourseController from './LearningCourseController'
import DocumentTypeController from './DocumentTypeController'
import DocumentController from './DocumentController'
import Reports from './Reports'
import RecruitmentDashboardController from './RecruitmentDashboardController'
import CandidateResumeController from './CandidateResumeController'
import CandidateCheckoutController from './CandidateCheckoutController'
import CompanyProfileController from './CompanyProfileController'
import VacancyController from './VacancyController'
import VacancyApplicationController from './VacancyApplicationController'
import CandidateDirectoryController from './CandidateDirectoryController'
import PaymentWebhookController from './PaymentWebhookController'
import Settings from './Settings'
const Controllers = {
    PasswordResetController: Object.assign(PasswordResetController, PasswordResetController),
MarketplaceController: Object.assign(MarketplaceController, MarketplaceController),
CandidateAuthController: Object.assign(CandidateAuthController, CandidateAuthController),
EmployerAuthController: Object.assign(EmployerAuthController, EmployerAuthController),
Candidate: Object.assign(Candidate, Candidate),
Employer: Object.assign(Employer, Employer),
CurrentOrganizationController: Object.assign(CurrentOrganizationController, CurrentOrganizationController),
DashboardController: Object.assign(DashboardController, DashboardController),
OrganizationController: Object.assign(OrganizationController, OrganizationController),
ControlCenterController: Object.assign(ControlCenterController, ControlCenterController),
SystemSettingsController: Object.assign(SystemSettingsController, SystemSettingsController),
AuditTrailController: Object.assign(AuditTrailController, AuditTrailController),
OrgUnitController: Object.assign(OrgUnitController, OrgUnitController),
LocationController: Object.assign(LocationController, LocationController),
PermissionMatrixController: Object.assign(PermissionMatrixController, PermissionMatrixController),
RoleController: Object.assign(RoleController, RoleController),
PositionController: Object.assign(PositionController, PositionController),
EmployeeController: Object.assign(EmployeeController, EmployeeController),
EmployeeContractController: Object.assign(EmployeeContractController, EmployeeContractController),
AssetController: Object.assign(AssetController, AssetController),
AssetMaintenanceController: Object.assign(AssetMaintenanceController, AssetMaintenanceController),
AssetCategoryController: Object.assign(AssetCategoryController, AssetCategoryController),
AssetVendorController: Object.assign(AssetVendorController, AssetVendorController),
AssetLocationController: Object.assign(AssetLocationController, AssetLocationController),
UserController: Object.assign(UserController, UserController),
WorkflowDefinitionController: Object.assign(WorkflowDefinitionController, WorkflowDefinitionController),
LeaveRequestController: Object.assign(LeaveRequestController, LeaveRequestController),
AttendanceRecordController: Object.assign(AttendanceRecordController, AttendanceRecordController),
TimesheetController: Object.assign(TimesheetController, TimesheetController),
PayrollDashboardController: Object.assign(PayrollDashboardController, PayrollDashboardController),
PayrollPeriodController: Object.assign(PayrollPeriodController, PayrollPeriodController),
PayrollPayCodeController: Object.assign(PayrollPayCodeController, PayrollPayCodeController),
EmployeePayrollProfileController: Object.assign(EmployeePayrollProfileController, EmployeePayrollProfileController),
PayrollInputController: Object.assign(PayrollInputController, PayrollInputController),
PayrollReportController: Object.assign(PayrollReportController, PayrollReportController),
PayrollResultController: Object.assign(PayrollResultController, PayrollResultController),
PayslipController: Object.assign(PayslipController, PayslipController),
PayslipDeliveryController: Object.assign(PayslipDeliveryController, PayslipDeliveryController),
PayrollExportController: Object.assign(PayrollExportController, PayrollExportController),
JobRequisitionController: Object.assign(JobRequisitionController, JobRequisitionController),
CandidateProfileController: Object.assign(CandidateProfileController, CandidateProfileController),
OnboardingTaskController: Object.assign(OnboardingTaskController, OnboardingTaskController),
OffboardingTaskController: Object.assign(OffboardingTaskController, OffboardingTaskController),
PerformanceReviewController: Object.assign(PerformanceReviewController, PerformanceReviewController),
PerformanceDashboardController: Object.assign(PerformanceDashboardController, PerformanceDashboardController),
PerformanceCycleController: Object.assign(PerformanceCycleController, PerformanceCycleController),
KpiLibraryController: Object.assign(KpiLibraryController, KpiLibraryController),
ScorecardTemplateController: Object.assign(ScorecardTemplateController, ScorecardTemplateController),
EmployeeScorecardController: Object.assign(EmployeeScorecardController, EmployeeScorecardController),
PerformanceImprovementPlanController: Object.assign(PerformanceImprovementPlanController, PerformanceImprovementPlanController),
BenefitsDashboardController: Object.assign(BenefitsDashboardController, BenefitsDashboardController),
BenefitController: Object.assign(BenefitController, BenefitController),
BenefitPlanController: Object.assign(BenefitPlanController, BenefitPlanController),
BenefitContributionRuleController: Object.assign(BenefitContributionRuleController, BenefitContributionRuleController),
EmployeeBenefitEnrollmentController: Object.assign(EmployeeBenefitEnrollmentController, EmployeeBenefitEnrollmentController),
EmployeeBenefitDependantController: Object.assign(EmployeeBenefitDependantController, EmployeeBenefitDependantController),
LearningCourseController: Object.assign(LearningCourseController, LearningCourseController),
DocumentTypeController: Object.assign(DocumentTypeController, DocumentTypeController),
DocumentController: Object.assign(DocumentController, DocumentController),
Reports: Object.assign(Reports, Reports),
RecruitmentDashboardController: Object.assign(RecruitmentDashboardController, RecruitmentDashboardController),
CandidateResumeController: Object.assign(CandidateResumeController, CandidateResumeController),
CandidateCheckoutController: Object.assign(CandidateCheckoutController, CandidateCheckoutController),
CompanyProfileController: Object.assign(CompanyProfileController, CompanyProfileController),
VacancyController: Object.assign(VacancyController, VacancyController),
VacancyApplicationController: Object.assign(VacancyApplicationController, VacancyApplicationController),
CandidateDirectoryController: Object.assign(CandidateDirectoryController, CandidateDirectoryController),
PaymentWebhookController: Object.assign(PaymentWebhookController, PaymentWebhookController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers