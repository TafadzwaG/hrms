import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PerformanceDashboardController::__invoke
 * @see app/Http/Controllers/PerformanceDashboardController.php:14
 * @route '/performance'
 */
const PerformanceDashboardController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PerformanceDashboardController.url(options),
    method: 'get',
})

PerformanceDashboardController.definition = {
    methods: ["get","head"],
    url: '/performance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PerformanceDashboardController::__invoke
 * @see app/Http/Controllers/PerformanceDashboardController.php:14
 * @route '/performance'
 */
PerformanceDashboardController.url = (options?: RouteQueryOptions) => {
    return PerformanceDashboardController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PerformanceDashboardController::__invoke
 * @see app/Http/Controllers/PerformanceDashboardController.php:14
 * @route '/performance'
 */
PerformanceDashboardController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PerformanceDashboardController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PerformanceDashboardController::__invoke
 * @see app/Http/Controllers/PerformanceDashboardController.php:14
 * @route '/performance'
 */
PerformanceDashboardController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: PerformanceDashboardController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PerformanceDashboardController::__invoke
 * @see app/Http/Controllers/PerformanceDashboardController.php:14
 * @route '/performance'
 */
    const PerformanceDashboardControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: PerformanceDashboardController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PerformanceDashboardController::__invoke
 * @see app/Http/Controllers/PerformanceDashboardController.php:14
 * @route '/performance'
 */
        PerformanceDashboardControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: PerformanceDashboardController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PerformanceDashboardController::__invoke
 * @see app/Http/Controllers/PerformanceDashboardController.php:14
 * @route '/performance'
 */
        PerformanceDashboardControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: PerformanceDashboardController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    PerformanceDashboardController.form = PerformanceDashboardControllerForm
export default PerformanceDashboardController