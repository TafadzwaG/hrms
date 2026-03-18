import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CandidateHubDashboardController::__invoke
 * @see app/Http/Controllers/CandidateHubDashboardController.php:15
 * @route '/candidate/dashboard'
 */
const CandidateHubDashboardController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CandidateHubDashboardController.url(options),
    method: 'get',
})

CandidateHubDashboardController.definition = {
    methods: ["get","head"],
    url: '/candidate/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateHubDashboardController::__invoke
 * @see app/Http/Controllers/CandidateHubDashboardController.php:15
 * @route '/candidate/dashboard'
 */
CandidateHubDashboardController.url = (options?: RouteQueryOptions) => {
    return CandidateHubDashboardController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateHubDashboardController::__invoke
 * @see app/Http/Controllers/CandidateHubDashboardController.php:15
 * @route '/candidate/dashboard'
 */
CandidateHubDashboardController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CandidateHubDashboardController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateHubDashboardController::__invoke
 * @see app/Http/Controllers/CandidateHubDashboardController.php:15
 * @route '/candidate/dashboard'
 */
CandidateHubDashboardController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: CandidateHubDashboardController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateHubDashboardController::__invoke
 * @see app/Http/Controllers/CandidateHubDashboardController.php:15
 * @route '/candidate/dashboard'
 */
    const CandidateHubDashboardControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: CandidateHubDashboardController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateHubDashboardController::__invoke
 * @see app/Http/Controllers/CandidateHubDashboardController.php:15
 * @route '/candidate/dashboard'
 */
        CandidateHubDashboardControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: CandidateHubDashboardController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateHubDashboardController::__invoke
 * @see app/Http/Controllers/CandidateHubDashboardController.php:15
 * @route '/candidate/dashboard'
 */
        CandidateHubDashboardControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: CandidateHubDashboardController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    CandidateHubDashboardController.form = CandidateHubDashboardControllerForm
export default CandidateHubDashboardController