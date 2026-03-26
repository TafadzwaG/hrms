import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Candidate\DashboardController::__invoke
 * @see app/Http/Controllers/Candidate/DashboardController.php:13
 * @route '/candidate/dashboard'
 */
const DashboardController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: DashboardController.url(options),
    method: 'get',
})

DashboardController.definition = {
    methods: ["get","head"],
    url: '/candidate/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Candidate\DashboardController::__invoke
 * @see app/Http/Controllers/Candidate/DashboardController.php:13
 * @route '/candidate/dashboard'
 */
DashboardController.url = (options?: RouteQueryOptions) => {
    return DashboardController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\DashboardController::__invoke
 * @see app/Http/Controllers/Candidate/DashboardController.php:13
 * @route '/candidate/dashboard'
 */
DashboardController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: DashboardController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Candidate\DashboardController::__invoke
 * @see app/Http/Controllers/Candidate/DashboardController.php:13
 * @route '/candidate/dashboard'
 */
DashboardController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: DashboardController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Candidate\DashboardController::__invoke
 * @see app/Http/Controllers/Candidate/DashboardController.php:13
 * @route '/candidate/dashboard'
 */
    const DashboardControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: DashboardController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Candidate\DashboardController::__invoke
 * @see app/Http/Controllers/Candidate/DashboardController.php:13
 * @route '/candidate/dashboard'
 */
        DashboardControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: DashboardController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Candidate\DashboardController::__invoke
 * @see app/Http/Controllers/Candidate/DashboardController.php:13
 * @route '/candidate/dashboard'
 */
        DashboardControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: DashboardController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    DashboardController.form = DashboardControllerForm
export default DashboardController