import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PerformanceDashboardController::__invoke
 * @see app/Http/Controllers/PerformanceDashboardController.php:18
 * @route '/performance'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/performance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PerformanceDashboardController::__invoke
 * @see app/Http/Controllers/PerformanceDashboardController.php:18
 * @route '/performance'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PerformanceDashboardController::__invoke
 * @see app/Http/Controllers/PerformanceDashboardController.php:18
 * @route '/performance'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PerformanceDashboardController::__invoke
 * @see app/Http/Controllers/PerformanceDashboardController.php:18
 * @route '/performance'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PerformanceDashboardController::__invoke
 * @see app/Http/Controllers/PerformanceDashboardController.php:18
 * @route '/performance'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PerformanceDashboardController::__invoke
 * @see app/Http/Controllers/PerformanceDashboardController.php:18
 * @route '/performance'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PerformanceDashboardController::__invoke
 * @see app/Http/Controllers/PerformanceDashboardController.php:18
 * @route '/performance'
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
const performance = {
    dashboard: Object.assign(dashboard, dashboard),
}

export default performance