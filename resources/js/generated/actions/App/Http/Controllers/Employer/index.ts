import DashboardController from './DashboardController'
import VacanciesController from './VacanciesController'
import CandidatesController from './CandidatesController'
import ReportsController from './ReportsController'
import CompanyProfileController from './CompanyProfileController'
import BillingController from './BillingController'
const Employer = {
    DashboardController: Object.assign(DashboardController, DashboardController),
VacanciesController: Object.assign(VacanciesController, VacanciesController),
CandidatesController: Object.assign(CandidatesController, CandidatesController),
ReportsController: Object.assign(ReportsController, ReportsController),
CompanyProfileController: Object.assign(CompanyProfileController, CompanyProfileController),
BillingController: Object.assign(BillingController, BillingController),
}

export default Employer