import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PayslipDeliveryController::bulk
 * @see app/Http/Controllers/PayslipDeliveryController.php:65
 * @route '/payroll/payslips/sms'
 */
export const bulk = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulk.url(options),
    method: 'post',
})

bulk.definition = {
    methods: ["post"],
    url: '/payroll/payslips/sms',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PayslipDeliveryController::bulk
 * @see app/Http/Controllers/PayslipDeliveryController.php:65
 * @route '/payroll/payslips/sms'
 */
bulk.url = (options?: RouteQueryOptions) => {
    return bulk.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayslipDeliveryController::bulk
 * @see app/Http/Controllers/PayslipDeliveryController.php:65
 * @route '/payroll/payslips/sms'
 */
bulk.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulk.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PayslipDeliveryController::bulk
 * @see app/Http/Controllers/PayslipDeliveryController.php:65
 * @route '/payroll/payslips/sms'
 */
    const bulkForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: bulk.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayslipDeliveryController::bulk
 * @see app/Http/Controllers/PayslipDeliveryController.php:65
 * @route '/payroll/payslips/sms'
 */
        bulkForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bulk.url(options),
            method: 'post',
        })
    
    bulk.form = bulkForm