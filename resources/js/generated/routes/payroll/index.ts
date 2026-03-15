import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import periods from './periods'
import payCodes from './pay-codes'
import profiles from './profiles'
import inputs from './inputs'
import reports from './reports'
import results from './results'
import payslips from './payslips'
/**
* @see \App\Http\Controllers\PayrollDashboardController::__invoke
 * @see app/Http/Controllers/PayrollDashboardController.php:15
 * @route '/payroll'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/payroll',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollDashboardController::__invoke
 * @see app/Http/Controllers/PayrollDashboardController.php:15
 * @route '/payroll'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollDashboardController::__invoke
 * @see app/Http/Controllers/PayrollDashboardController.php:15
 * @route '/payroll'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollDashboardController::__invoke
 * @see app/Http/Controllers/PayrollDashboardController.php:15
 * @route '/payroll'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollDashboardController::__invoke
 * @see app/Http/Controllers/PayrollDashboardController.php:15
 * @route '/payroll'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollDashboardController::__invoke
 * @see app/Http/Controllers/PayrollDashboardController.php:15
 * @route '/payroll'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollDashboardController::__invoke
 * @see app/Http/Controllers/PayrollDashboardController.php:15
 * @route '/payroll'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
const payroll = {
    index: Object.assign(index, index),
periods: Object.assign(periods, periods),
payCodes: Object.assign(payCodes, payCodes),
profiles: Object.assign(profiles, profiles),
inputs: Object.assign(inputs, inputs),
reports: Object.assign(reports, reports),
results: Object.assign(results, results),
payslips: Object.assign(payslips, payslips),
}

export default payroll