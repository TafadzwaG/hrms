import DashboardController from './DashboardController'
import ApplicationsController from './ApplicationsController'
import InterviewsController from './InterviewsController'
import JobsController from './JobsController'
import ProfileController from './ProfileController'
import DocumentsController from './DocumentsController'
import EducationController from './EducationController'
import SkillsController from './SkillsController'
import SettingsController from './SettingsController'
const Candidate = {
    DashboardController: Object.assign(DashboardController, DashboardController),
ApplicationsController: Object.assign(ApplicationsController, ApplicationsController),
InterviewsController: Object.assign(InterviewsController, InterviewsController),
JobsController: Object.assign(JobsController, JobsController),
ProfileController: Object.assign(ProfileController, ProfileController),
DocumentsController: Object.assign(DocumentsController, DocumentsController),
EducationController: Object.assign(EducationController, EducationController),
SkillsController: Object.assign(SkillsController, SkillsController),
SettingsController: Object.assign(SettingsController, SettingsController),
}

export default Candidate