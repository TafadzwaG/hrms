import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PayrollInputController::index
 * @see app/Http/Controllers/PayrollInputController.php:21
 * @route '/payroll/inputs'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/payroll/inputs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollInputController::index
 * @see app/Http/Controllers/PayrollInputController.php:21
 * @route '/payroll/inputs'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollInputController::index
 * @see app/Http/Controllers/PayrollInputController.php:21
 * @route '/payroll/inputs'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollInputController::index
 * @see app/Http/Controllers/PayrollInputController.php:21
 * @route '/payroll/inputs'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollInputController::index
 * @see app/Http/Controllers/PayrollInputController.php:21
 * @route '/payroll/inputs'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollInputController::index
 * @see app/Http/Controllers/PayrollInputController.php:21
 * @route '/payroll/inputs'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollInputController::index
 * @see app/Http/Controllers/PayrollInputController.php:21
 * @route '/payroll/inputs'
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
* @see \App\Http\Controllers\PayrollInputController::store
 * @see app/Http/Controllers/PayrollInputController.php:113
 * @route '/payroll/inputs'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/payroll/inputs',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PayrollInputController::store
 * @see app/Http/Controllers/PayrollInputController.php:113
 * @route '/payroll/inputs'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollInputController::store
 * @see app/Http/Controllers/PayrollInputController.php:113
 * @route '/payroll/inputs'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PayrollInputController::store
 * @see app/Http/Controllers/PayrollInputController.php:113
 * @route '/payroll/inputs'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayrollInputController::store
 * @see app/Http/Controllers/PayrollInputController.php:113
 * @route '/payroll/inputs'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\PayrollInputController::update
 * @see app/Http/Controllers/PayrollInputController.php:125
 * @route '/payroll/inputs/{input}'
 */
export const update = (args: { input: string | number } | [input: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/payroll/inputs/{input}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PayrollInputController::update
 * @see app/Http/Controllers/PayrollInputController.php:125
 * @route '/payroll/inputs/{input}'
 */
update.url = (args: { input: string | number } | [input: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { input: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    input: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        input: args.input,
                }

    return update.definition.url
            .replace('{input}', parsedArgs.input.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollInputController::update
 * @see app/Http/Controllers/PayrollInputController.php:125
 * @route '/payroll/inputs/{input}'
 */
update.put = (args: { input: string | number } | [input: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\PayrollInputController::update
 * @see app/Http/Controllers/PayrollInputController.php:125
 * @route '/payroll/inputs/{input}'
 */
    const updateForm = (args: { input: string | number } | [input: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayrollInputController::update
 * @see app/Http/Controllers/PayrollInputController.php:125
 * @route '/payroll/inputs/{input}'
 */
        updateForm.put = (args: { input: string | number } | [input: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PayrollInputController::destroy
 * @see app/Http/Controllers/PayrollInputController.php:137
 * @route '/payroll/inputs/{input}'
 */
export const destroy = (args: { input: string | number } | [input: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/payroll/inputs/{input}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PayrollInputController::destroy
 * @see app/Http/Controllers/PayrollInputController.php:137
 * @route '/payroll/inputs/{input}'
 */
destroy.url = (args: { input: string | number } | [input: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { input: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    input: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        input: args.input,
                }

    return destroy.definition.url
            .replace('{input}', parsedArgs.input.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollInputController::destroy
 * @see app/Http/Controllers/PayrollInputController.php:137
 * @route '/payroll/inputs/{input}'
 */
destroy.delete = (args: { input: string | number } | [input: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\PayrollInputController::destroy
 * @see app/Http/Controllers/PayrollInputController.php:137
 * @route '/payroll/inputs/{input}'
 */
    const destroyForm = (args: { input: string | number } | [input: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayrollInputController::destroy
 * @see app/Http/Controllers/PayrollInputController.php:137
 * @route '/payroll/inputs/{input}'
 */
        destroyForm.delete = (args: { input: string | number } | [input: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\PayrollInputController::template
 * @see app/Http/Controllers/PayrollInputController.php:153
 * @route '/payroll/inputs/template'
 */
export const template = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: template.url(options),
    method: 'get',
})

template.definition = {
    methods: ["get","head"],
    url: '/payroll/inputs/template',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollInputController::template
 * @see app/Http/Controllers/PayrollInputController.php:153
 * @route '/payroll/inputs/template'
 */
template.url = (options?: RouteQueryOptions) => {
    return template.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollInputController::template
 * @see app/Http/Controllers/PayrollInputController.php:153
 * @route '/payroll/inputs/template'
 */
template.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: template.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollInputController::template
 * @see app/Http/Controllers/PayrollInputController.php:153
 * @route '/payroll/inputs/template'
 */
template.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: template.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollInputController::template
 * @see app/Http/Controllers/PayrollInputController.php:153
 * @route '/payroll/inputs/template'
 */
    const templateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: template.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollInputController::template
 * @see app/Http/Controllers/PayrollInputController.php:153
 * @route '/payroll/inputs/template'
 */
        templateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: template.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollInputController::template
 * @see app/Http/Controllers/PayrollInputController.php:153
 * @route '/payroll/inputs/template'
 */
        templateForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: template.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    template.form = templateForm
/**
* @see \App\Http\Controllers\PayrollInputController::importMethod
 * @see app/Http/Controllers/PayrollInputController.php:168
 * @route '/payroll/inputs/import'
 */
export const importMethod = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

importMethod.definition = {
    methods: ["post"],
    url: '/payroll/inputs/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PayrollInputController::importMethod
 * @see app/Http/Controllers/PayrollInputController.php:168
 * @route '/payroll/inputs/import'
 */
importMethod.url = (options?: RouteQueryOptions) => {
    return importMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollInputController::importMethod
 * @see app/Http/Controllers/PayrollInputController.php:168
 * @route '/payroll/inputs/import'
 */
importMethod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PayrollInputController::importMethod
 * @see app/Http/Controllers/PayrollInputController.php:168
 * @route '/payroll/inputs/import'
 */
    const importMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: importMethod.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayrollInputController::importMethod
 * @see app/Http/Controllers/PayrollInputController.php:168
 * @route '/payroll/inputs/import'
 */
        importMethodForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: importMethod.url(options),
            method: 'post',
        })
    
    importMethod.form = importMethodForm
const inputs = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
template: Object.assign(template, template),
import: Object.assign(importMethod, importMethod),
}

export default inputs