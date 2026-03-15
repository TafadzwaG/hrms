import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PayrollPeriodController::store
 * @see app/Http/Controllers/PayrollPeriodController.php:314
 * @route '/payroll/periods/{period}/exchange-rates'
 */
export const store = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/payroll/periods/{period}/exchange-rates',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PayrollPeriodController::store
 * @see app/Http/Controllers/PayrollPeriodController.php:314
 * @route '/payroll/periods/{period}/exchange-rates'
 */
store.url = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { period: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    period: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        period: args.period,
                }

    return store.definition.url
            .replace('{period}', parsedArgs.period.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollPeriodController::store
 * @see app/Http/Controllers/PayrollPeriodController.php:314
 * @route '/payroll/periods/{period}/exchange-rates'
 */
store.post = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PayrollPeriodController::store
 * @see app/Http/Controllers/PayrollPeriodController.php:314
 * @route '/payroll/periods/{period}/exchange-rates'
 */
    const storeForm = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayrollPeriodController::store
 * @see app/Http/Controllers/PayrollPeriodController.php:314
 * @route '/payroll/periods/{period}/exchange-rates'
 */
        storeForm.post = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\PayrollPeriodController::update
 * @see app/Http/Controllers/PayrollPeriodController.php:327
 * @route '/payroll/periods/{period}/exchange-rates/{exchangeRate}'
 */
export const update = (args: { period: string | number, exchangeRate: string | number } | [period: string | number, exchangeRate: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/payroll/periods/{period}/exchange-rates/{exchangeRate}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PayrollPeriodController::update
 * @see app/Http/Controllers/PayrollPeriodController.php:327
 * @route '/payroll/periods/{period}/exchange-rates/{exchangeRate}'
 */
update.url = (args: { period: string | number, exchangeRate: string | number } | [period: string | number, exchangeRate: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    period: args[0],
                    exchangeRate: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        period: args.period,
                                exchangeRate: args.exchangeRate,
                }

    return update.definition.url
            .replace('{period}', parsedArgs.period.toString())
            .replace('{exchangeRate}', parsedArgs.exchangeRate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollPeriodController::update
 * @see app/Http/Controllers/PayrollPeriodController.php:327
 * @route '/payroll/periods/{period}/exchange-rates/{exchangeRate}'
 */
update.put = (args: { period: string | number, exchangeRate: string | number } | [period: string | number, exchangeRate: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\PayrollPeriodController::update
 * @see app/Http/Controllers/PayrollPeriodController.php:327
 * @route '/payroll/periods/{period}/exchange-rates/{exchangeRate}'
 */
    const updateForm = (args: { period: string | number, exchangeRate: string | number } | [period: string | number, exchangeRate: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayrollPeriodController::update
 * @see app/Http/Controllers/PayrollPeriodController.php:327
 * @route '/payroll/periods/{period}/exchange-rates/{exchangeRate}'
 */
        updateForm.put = (args: { period: string | number, exchangeRate: string | number } | [period: string | number, exchangeRate: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\PayrollPeriodController::destroy
 * @see app/Http/Controllers/PayrollPeriodController.php:343
 * @route '/payroll/periods/{period}/exchange-rates/{exchangeRate}'
 */
export const destroy = (args: { period: string | number, exchangeRate: string | number } | [period: string | number, exchangeRate: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/payroll/periods/{period}/exchange-rates/{exchangeRate}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PayrollPeriodController::destroy
 * @see app/Http/Controllers/PayrollPeriodController.php:343
 * @route '/payroll/periods/{period}/exchange-rates/{exchangeRate}'
 */
destroy.url = (args: { period: string | number, exchangeRate: string | number } | [period: string | number, exchangeRate: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    period: args[0],
                    exchangeRate: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        period: args.period,
                                exchangeRate: args.exchangeRate,
                }

    return destroy.definition.url
            .replace('{period}', parsedArgs.period.toString())
            .replace('{exchangeRate}', parsedArgs.exchangeRate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollPeriodController::destroy
 * @see app/Http/Controllers/PayrollPeriodController.php:343
 * @route '/payroll/periods/{period}/exchange-rates/{exchangeRate}'
 */
destroy.delete = (args: { period: string | number, exchangeRate: string | number } | [period: string | number, exchangeRate: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\PayrollPeriodController::destroy
 * @see app/Http/Controllers/PayrollPeriodController.php:343
 * @route '/payroll/periods/{period}/exchange-rates/{exchangeRate}'
 */
    const destroyForm = (args: { period: string | number, exchangeRate: string | number } | [period: string | number, exchangeRate: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayrollPeriodController::destroy
 * @see app/Http/Controllers/PayrollPeriodController.php:343
 * @route '/payroll/periods/{period}/exchange-rates/{exchangeRate}'
 */
        destroyForm.delete = (args: { period: string | number, exchangeRate: string | number } | [period: string | number, exchangeRate: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const exchangeRates = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default exchangeRates