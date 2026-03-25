import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\RecruitmentAdminPaymentsController::payments
 * @see app/Http/Controllers/RecruitmentAdminPaymentsController.php:14
 * @route '/recruitment/admin/payments'
 */
export const payments = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payments.url(options),
    method: 'get',
})

payments.definition = {
    methods: ["get","head"],
    url: '/recruitment/admin/payments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecruitmentAdminPaymentsController::payments
 * @see app/Http/Controllers/RecruitmentAdminPaymentsController.php:14
 * @route '/recruitment/admin/payments'
 */
payments.url = (options?: RouteQueryOptions) => {
    return payments.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecruitmentAdminPaymentsController::payments
 * @see app/Http/Controllers/RecruitmentAdminPaymentsController.php:14
 * @route '/recruitment/admin/payments'
 */
payments.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payments.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RecruitmentAdminPaymentsController::payments
 * @see app/Http/Controllers/RecruitmentAdminPaymentsController.php:14
 * @route '/recruitment/admin/payments'
 */
payments.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: payments.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RecruitmentAdminPaymentsController::payments
 * @see app/Http/Controllers/RecruitmentAdminPaymentsController.php:14
 * @route '/recruitment/admin/payments'
 */
    const paymentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: payments.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RecruitmentAdminPaymentsController::payments
 * @see app/Http/Controllers/RecruitmentAdminPaymentsController.php:14
 * @route '/recruitment/admin/payments'
 */
        paymentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: payments.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RecruitmentAdminPaymentsController::payments
 * @see app/Http/Controllers/RecruitmentAdminPaymentsController.php:14
 * @route '/recruitment/admin/payments'
 */
        paymentsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: payments.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    payments.form = paymentsForm
const admin = {
    payments: Object.assign(payments, payments),
}

export default admin