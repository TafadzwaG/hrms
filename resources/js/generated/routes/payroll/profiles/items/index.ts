import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::store
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:168
 * @route '/payroll/profiles/{profile}/items'
 */
export const store = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/payroll/profiles/{profile}/items',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::store
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:168
 * @route '/payroll/profiles/{profile}/items'
 */
store.url = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { profile: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    profile: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        profile: args.profile,
                }

    return store.definition.url
            .replace('{profile}', parsedArgs.profile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::store
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:168
 * @route '/payroll/profiles/{profile}/items'
 */
store.post = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::store
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:168
 * @route '/payroll/profiles/{profile}/items'
 */
    const storeForm = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::store
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:168
 * @route '/payroll/profiles/{profile}/items'
 */
        storeForm.post = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::update
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:188
 * @route '/payroll/profiles/{profile}/items/{item}'
 */
export const update = (args: { profile: string | number, item: string | number } | [profile: string | number, item: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/payroll/profiles/{profile}/items/{item}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::update
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:188
 * @route '/payroll/profiles/{profile}/items/{item}'
 */
update.url = (args: { profile: string | number, item: string | number } | [profile: string | number, item: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    profile: args[0],
                    item: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        profile: args.profile,
                                item: args.item,
                }

    return update.definition.url
            .replace('{profile}', parsedArgs.profile.toString())
            .replace('{item}', parsedArgs.item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::update
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:188
 * @route '/payroll/profiles/{profile}/items/{item}'
 */
update.put = (args: { profile: string | number, item: string | number } | [profile: string | number, item: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::update
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:188
 * @route '/payroll/profiles/{profile}/items/{item}'
 */
    const updateForm = (args: { profile: string | number, item: string | number } | [profile: string | number, item: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::update
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:188
 * @route '/payroll/profiles/{profile}/items/{item}'
 */
        updateForm.put = (args: { profile: string | number, item: string | number } | [profile: string | number, item: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\EmployeePayrollProfileController::destroy
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:204
 * @route '/payroll/profiles/{profile}/items/{item}'
 */
export const destroy = (args: { profile: string | number, item: string | number } | [profile: string | number, item: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/payroll/profiles/{profile}/items/{item}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::destroy
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:204
 * @route '/payroll/profiles/{profile}/items/{item}'
 */
destroy.url = (args: { profile: string | number, item: string | number } | [profile: string | number, item: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    profile: args[0],
                    item: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        profile: args.profile,
                                item: args.item,
                }

    return destroy.definition.url
            .replace('{profile}', parsedArgs.profile.toString())
            .replace('{item}', parsedArgs.item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::destroy
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:204
 * @route '/payroll/profiles/{profile}/items/{item}'
 */
destroy.delete = (args: { profile: string | number, item: string | number } | [profile: string | number, item: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::destroy
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:204
 * @route '/payroll/profiles/{profile}/items/{item}'
 */
    const destroyForm = (args: { profile: string | number, item: string | number } | [profile: string | number, item: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::destroy
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:204
 * @route '/payroll/profiles/{profile}/items/{item}'
 */
        destroyForm.delete = (args: { profile: string | number, item: string | number } | [profile: string | number, item: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const items = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default items