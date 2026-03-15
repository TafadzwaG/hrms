import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PayrollPayCodeController::index
 * @see app/Http/Controllers/PayrollPayCodeController.php:15
 * @route '/payroll/pay-codes'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/payroll/pay-codes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollPayCodeController::index
 * @see app/Http/Controllers/PayrollPayCodeController.php:15
 * @route '/payroll/pay-codes'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollPayCodeController::index
 * @see app/Http/Controllers/PayrollPayCodeController.php:15
 * @route '/payroll/pay-codes'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollPayCodeController::index
 * @see app/Http/Controllers/PayrollPayCodeController.php:15
 * @route '/payroll/pay-codes'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollPayCodeController::index
 * @see app/Http/Controllers/PayrollPayCodeController.php:15
 * @route '/payroll/pay-codes'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollPayCodeController::index
 * @see app/Http/Controllers/PayrollPayCodeController.php:15
 * @route '/payroll/pay-codes'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollPayCodeController::index
 * @see app/Http/Controllers/PayrollPayCodeController.php:15
 * @route '/payroll/pay-codes'
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
/**
* @see \App\Http\Controllers\PayrollPayCodeController::store
 * @see app/Http/Controllers/PayrollPayCodeController.php:72
 * @route '/payroll/pay-codes'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/payroll/pay-codes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PayrollPayCodeController::store
 * @see app/Http/Controllers/PayrollPayCodeController.php:72
 * @route '/payroll/pay-codes'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollPayCodeController::store
 * @see app/Http/Controllers/PayrollPayCodeController.php:72
 * @route '/payroll/pay-codes'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PayrollPayCodeController::store
 * @see app/Http/Controllers/PayrollPayCodeController.php:72
 * @route '/payroll/pay-codes'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayrollPayCodeController::store
 * @see app/Http/Controllers/PayrollPayCodeController.php:72
 * @route '/payroll/pay-codes'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\PayrollPayCodeController::update
 * @see app/Http/Controllers/PayrollPayCodeController.php:82
 * @route '/payroll/pay-codes/{payCode}'
 */
export const update = (args: { payCode: string | number } | [payCode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/payroll/pay-codes/{payCode}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PayrollPayCodeController::update
 * @see app/Http/Controllers/PayrollPayCodeController.php:82
 * @route '/payroll/pay-codes/{payCode}'
 */
update.url = (args: { payCode: string | number } | [payCode: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payCode: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    payCode: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payCode: args.payCode,
                }

    return update.definition.url
            .replace('{payCode}', parsedArgs.payCode.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollPayCodeController::update
 * @see app/Http/Controllers/PayrollPayCodeController.php:82
 * @route '/payroll/pay-codes/{payCode}'
 */
update.put = (args: { payCode: string | number } | [payCode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\PayrollPayCodeController::update
 * @see app/Http/Controllers/PayrollPayCodeController.php:82
 * @route '/payroll/pay-codes/{payCode}'
 */
    const updateForm = (args: { payCode: string | number } | [payCode: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayrollPayCodeController::update
 * @see app/Http/Controllers/PayrollPayCodeController.php:82
 * @route '/payroll/pay-codes/{payCode}'
 */
        updateForm.put = (args: { payCode: string | number } | [payCode: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PayrollPayCodeController::destroy
 * @see app/Http/Controllers/PayrollPayCodeController.php:91
 * @route '/payroll/pay-codes/{payCode}'
 */
export const destroy = (args: { payCode: string | number } | [payCode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/payroll/pay-codes/{payCode}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PayrollPayCodeController::destroy
 * @see app/Http/Controllers/PayrollPayCodeController.php:91
 * @route '/payroll/pay-codes/{payCode}'
 */
destroy.url = (args: { payCode: string | number } | [payCode: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payCode: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    payCode: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payCode: args.payCode,
                }

    return destroy.definition.url
            .replace('{payCode}', parsedArgs.payCode.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollPayCodeController::destroy
 * @see app/Http/Controllers/PayrollPayCodeController.php:91
 * @route '/payroll/pay-codes/{payCode}'
 */
destroy.delete = (args: { payCode: string | number } | [payCode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\PayrollPayCodeController::destroy
 * @see app/Http/Controllers/PayrollPayCodeController.php:91
 * @route '/payroll/pay-codes/{payCode}'
 */
    const destroyForm = (args: { payCode: string | number } | [payCode: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayrollPayCodeController::destroy
 * @see app/Http/Controllers/PayrollPayCodeController.php:91
 * @route '/payroll/pay-codes/{payCode}'
 */
        destroyForm.delete = (args: { payCode: string | number } | [payCode: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const PayrollPayCodeController = { index, store, update, destroy }

export default PayrollPayCodeController