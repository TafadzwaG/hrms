import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import admin from './admin'
/**
* @see \App\Http\Controllers\RecruitmentDashboardController::__invoke
 * @see app/Http/Controllers/RecruitmentDashboardController.php:16
 * @route '/recruitment'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/recruitment',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecruitmentDashboardController::__invoke
 * @see app/Http/Controllers/RecruitmentDashboardController.php:16
 * @route '/recruitment'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecruitmentDashboardController::__invoke
 * @see app/Http/Controllers/RecruitmentDashboardController.php:16
 * @route '/recruitment'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RecruitmentDashboardController::__invoke
 * @see app/Http/Controllers/RecruitmentDashboardController.php:16
 * @route '/recruitment'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RecruitmentDashboardController::__invoke
 * @see app/Http/Controllers/RecruitmentDashboardController.php:16
 * @route '/recruitment'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RecruitmentDashboardController::__invoke
 * @see app/Http/Controllers/RecruitmentDashboardController.php:16
 * @route '/recruitment'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RecruitmentDashboardController::__invoke
 * @see app/Http/Controllers/RecruitmentDashboardController.php:16
 * @route '/recruitment'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
const recruitment = {
    dashboard: Object.assign(dashboard, dashboard),
admin: Object.assign(admin, admin),
}

export default recruitment