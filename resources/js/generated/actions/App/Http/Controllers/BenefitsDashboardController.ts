import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BenefitsDashboardController::__invoke
 * @see app/Http/Controllers/BenefitsDashboardController.php:18
 * @route '/benefits/dashboard'
 */
const BenefitsDashboardController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: BenefitsDashboardController.url(options),
    method: 'get',
})

BenefitsDashboardController.definition = {
    methods: ["get","head"],
    url: '/benefits/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BenefitsDashboardController::__invoke
 * @see app/Http/Controllers/BenefitsDashboardController.php:18
 * @route '/benefits/dashboard'
 */
BenefitsDashboardController.url = (options?: RouteQueryOptions) => {
    return BenefitsDashboardController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BenefitsDashboardController::__invoke
 * @see app/Http/Controllers/BenefitsDashboardController.php:18
 * @route '/benefits/dashboard'
 */
BenefitsDashboardController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: BenefitsDashboardController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BenefitsDashboardController::__invoke
 * @see app/Http/Controllers/BenefitsDashboardController.php:18
 * @route '/benefits/dashboard'
 */
BenefitsDashboardController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: BenefitsDashboardController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BenefitsDashboardController::__invoke
 * @see app/Http/Controllers/BenefitsDashboardController.php:18
 * @route '/benefits/dashboard'
 */
    const BenefitsDashboardControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: BenefitsDashboardController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BenefitsDashboardController::__invoke
 * @see app/Http/Controllers/BenefitsDashboardController.php:18
 * @route '/benefits/dashboard'
 */
        BenefitsDashboardControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: BenefitsDashboardController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BenefitsDashboardController::__invoke
 * @see app/Http/Controllers/BenefitsDashboardController.php:18
 * @route '/benefits/dashboard'
 */
        BenefitsDashboardControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: BenefitsDashboardController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    BenefitsDashboardController.form = BenefitsDashboardControllerForm
export default BenefitsDashboardController