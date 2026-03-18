import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\RecruitmentDashboardController::__invoke
 * @see app/Http/Controllers/RecruitmentDashboardController.php:16
 * @route '/recruitment'
 */
const RecruitmentDashboardController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: RecruitmentDashboardController.url(options),
    method: 'get',
})

RecruitmentDashboardController.definition = {
    methods: ["get","head"],
    url: '/recruitment',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecruitmentDashboardController::__invoke
 * @see app/Http/Controllers/RecruitmentDashboardController.php:16
 * @route '/recruitment'
 */
RecruitmentDashboardController.url = (options?: RouteQueryOptions) => {
    return RecruitmentDashboardController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecruitmentDashboardController::__invoke
 * @see app/Http/Controllers/RecruitmentDashboardController.php:16
 * @route '/recruitment'
 */
RecruitmentDashboardController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: RecruitmentDashboardController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RecruitmentDashboardController::__invoke
 * @see app/Http/Controllers/RecruitmentDashboardController.php:16
 * @route '/recruitment'
 */
RecruitmentDashboardController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: RecruitmentDashboardController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RecruitmentDashboardController::__invoke
 * @see app/Http/Controllers/RecruitmentDashboardController.php:16
 * @route '/recruitment'
 */
    const RecruitmentDashboardControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: RecruitmentDashboardController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RecruitmentDashboardController::__invoke
 * @see app/Http/Controllers/RecruitmentDashboardController.php:16
 * @route '/recruitment'
 */
        RecruitmentDashboardControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: RecruitmentDashboardController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RecruitmentDashboardController::__invoke
 * @see app/Http/Controllers/RecruitmentDashboardController.php:16
 * @route '/recruitment'
 */
        RecruitmentDashboardControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: RecruitmentDashboardController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    RecruitmentDashboardController.form = RecruitmentDashboardControllerForm
export default RecruitmentDashboardController