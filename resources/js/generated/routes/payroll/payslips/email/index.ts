import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PayslipDeliveryController::bulk
 * @see app/Http/Controllers/PayslipDeliveryController.php:50
 * @route '/payroll/payslips/email'
 */
export const bulk = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulk.url(options),
    method: 'post',
})

bulk.definition = {
    methods: ["post"],
    url: '/payroll/payslips/email',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PayslipDeliveryController::bulk
 * @see app/Http/Controllers/PayslipDeliveryController.php:50
 * @route '/payroll/payslips/email'
 */
bulk.url = (options?: RouteQueryOptions) => {
    return bulk.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayslipDeliveryController::bulk
 * @see app/Http/Controllers/PayslipDeliveryController.php:50
 * @route '/payroll/payslips/email'
 */
bulk.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulk.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PayslipDeliveryController::bulk
 * @see app/Http/Controllers/PayslipDeliveryController.php:50
 * @route '/payroll/payslips/email'
 */
    const bulkForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: bulk.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayslipDeliveryController::bulk
 * @see app/Http/Controllers/PayslipDeliveryController.php:50
 * @route '/payroll/payslips/email'
 */
        bulkForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bulk.url(options),
            method: 'post',
        })
    
    bulk.form = bulkForm