import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EmployerHubDashboardController::__invoke
 * @see app/Http/Controllers/EmployerHubDashboardController.php:15
 * @route '/employer/dashboard'
 */
const EmployerHubDashboardController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EmployerHubDashboardController.url(options),
    method: 'get',
})

EmployerHubDashboardController.definition = {
    methods: ["get","head"],
    url: '/employer/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployerHubDashboardController::__invoke
 * @see app/Http/Controllers/EmployerHubDashboardController.php:15
 * @route '/employer/dashboard'
 */
EmployerHubDashboardController.url = (options?: RouteQueryOptions) => {
    return EmployerHubDashboardController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployerHubDashboardController::__invoke
 * @see app/Http/Controllers/EmployerHubDashboardController.php:15
 * @route '/employer/dashboard'
 */
EmployerHubDashboardController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EmployerHubDashboardController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployerHubDashboardController::__invoke
 * @see app/Http/Controllers/EmployerHubDashboardController.php:15
 * @route '/employer/dashboard'
 */
EmployerHubDashboardController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: EmployerHubDashboardController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployerHubDashboardController::__invoke
 * @see app/Http/Controllers/EmployerHubDashboardController.php:15
 * @route '/employer/dashboard'
 */
    const EmployerHubDashboardControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: EmployerHubDashboardController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployerHubDashboardController::__invoke
 * @see app/Http/Controllers/EmployerHubDashboardController.php:15
 * @route '/employer/dashboard'
 */
        EmployerHubDashboardControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: EmployerHubDashboardController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployerHubDashboardController::__invoke
 * @see app/Http/Controllers/EmployerHubDashboardController.php:15
 * @route '/employer/dashboard'
 */
        EmployerHubDashboardControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: EmployerHubDashboardController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    EmployerHubDashboardController.form = EmployerHubDashboardControllerForm
export default EmployerHubDashboardController