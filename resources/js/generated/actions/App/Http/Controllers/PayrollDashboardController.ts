import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PayrollDashboardController::__invoke
 * @see app/Http/Controllers/PayrollDashboardController.php:15
 * @route '/payroll'
 */
const PayrollDashboardController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PayrollDashboardController.url(options),
    method: 'get',
})

PayrollDashboardController.definition = {
    methods: ["get","head"],
    url: '/payroll',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollDashboardController::__invoke
 * @see app/Http/Controllers/PayrollDashboardController.php:15
 * @route '/payroll'
 */
PayrollDashboardController.url = (options?: RouteQueryOptions) => {
    return PayrollDashboardController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollDashboardController::__invoke
 * @see app/Http/Controllers/PayrollDashboardController.php:15
 * @route '/payroll'
 */
PayrollDashboardController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PayrollDashboardController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollDashboardController::__invoke
 * @see app/Http/Controllers/PayrollDashboardController.php:15
 * @route '/payroll'
 */
PayrollDashboardController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: PayrollDashboardController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollDashboardController::__invoke
 * @see app/Http/Controllers/PayrollDashboardController.php:15
 * @route '/payroll'
 */
    const PayrollDashboardControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: PayrollDashboardController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollDashboardController::__invoke
 * @see app/Http/Controllers/PayrollDashboardController.php:15
 * @route '/payroll'
 */
        PayrollDashboardControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: PayrollDashboardController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollDashboardController::__invoke
 * @see app/Http/Controllers/PayrollDashboardController.php:15
 * @route '/payroll'
 */
        PayrollDashboardControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: PayrollDashboardController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    PayrollDashboardController.form = PayrollDashboardControllerForm
export default PayrollDashboardController