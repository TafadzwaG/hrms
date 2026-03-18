import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import employees from './employees'
import workflows from './workflows'
import leaveRequests from './leave-requests'
import attendanceRecords from './attendance-records'
import timesheets from './timesheets'
import payrollExports from './payroll-exports'
import jobRequisitions from './job-requisitions'
import candidateProfiles from './candidate-profiles'
import onboardingTasks from './onboarding-tasks'
import offboardingTasks from './offboarding-tasks'
import performanceReviews from './performance-reviews'
import performanceScorecards from './performance-scorecards'
import learningCourses from './learning-courses'
import assets from './assets'
import benefits from './benefits'
import documents from './documents'
import recruitment from './recruitment'
/**
* @see \App\Http\Controllers\Reports\ReportCenterController::index
 * @see app/Http/Controllers/Reports/ReportCenterController.php:27
 * @route '/reports'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\ReportCenterController::index
 * @see app/Http/Controllers/Reports/ReportCenterController.php:27
 * @route '/reports'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\ReportCenterController::index
 * @see app/Http/Controllers/Reports/ReportCenterController.php:27
 * @route '/reports'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\ReportCenterController::index
 * @see app/Http/Controllers/Reports/ReportCenterController.php:27
 * @route '/reports'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\ReportCenterController::index
 * @see app/Http/Controllers/Reports/ReportCenterController.php:27
 * @route '/reports'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\ReportCenterController::index
 * @see app/Http/Controllers/Reports/ReportCenterController.php:27
 * @route '/reports'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\ReportCenterController::index
 * @see app/Http/Controllers/Reports/ReportCenterController.php:27
 * @route '/reports'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
const reports = {
    index: Object.assign(index, index),
employees: Object.assign(employees, employees),
workflows: Object.assign(workflows, workflows),
leaveRequests: Object.assign(leaveRequests, leaveRequests),
attendanceRecords: Object.assign(attendanceRecords, attendanceRecords),
timesheets: Object.assign(timesheets, timesheets),
payrollExports: Object.assign(payrollExports, payrollExports),
jobRequisitions: Object.assign(jobRequisitions, jobRequisitions),
candidateProfiles: Object.assign(candidateProfiles, candidateProfiles),
onboardingTasks: Object.assign(onboardingTasks, onboardingTasks),
offboardingTasks: Object.assign(offboardingTasks, offboardingTasks),
performanceReviews: Object.assign(performanceReviews, performanceReviews),
performanceScorecards: Object.assign(performanceScorecards, performanceScorecards),
learningCourses: Object.assign(learningCourses, learningCourses),
assets: Object.assign(assets, assets),
benefits: Object.assign(benefits, benefits),
documents: Object.assign(documents, documents),
recruitment: Object.assign(recruitment, recruitment),
}

export default reports