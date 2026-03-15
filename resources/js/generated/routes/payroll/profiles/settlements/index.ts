import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::store
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:220
 * @route '/payroll/profiles/{profile}/settlements'
 */
export const store = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/payroll/profiles/{profile}/settlements',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::store
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:220
 * @route '/payroll/profiles/{profile}/settlements'
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
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:220
 * @route '/payroll/profiles/{profile}/settlements'
 */
store.post = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::store
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:220
 * @route '/payroll/profiles/{profile}/settlements'
 */
    const storeForm = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::store
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:220
 * @route '/payroll/profiles/{profile}/settlements'
 */
        storeForm.post = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::update
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:236
 * @route '/payroll/profiles/{profile}/settlements/{settlement}'
 */
export const update = (args: { profile: string | number, settlement: string | number } | [profile: string | number, settlement: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/payroll/profiles/{profile}/settlements/{settlement}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::update
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:236
 * @route '/payroll/profiles/{profile}/settlements/{settlement}'
 */
update.url = (args: { profile: string | number, settlement: string | number } | [profile: string | number, settlement: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    profile: args[0],
                    settlement: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        profile: args.profile,
                                settlement: args.settlement,
                }

    return update.definition.url
            .replace('{profile}', parsedArgs.profile.toString())
            .replace('{settlement}', parsedArgs.settlement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::update
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:236
 * @route '/payroll/profiles/{profile}/settlements/{settlement}'
 */
update.put = (args: { profile: string | number, settlement: string | number } | [profile: string | number, settlement: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::update
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:236
 * @route '/payroll/profiles/{profile}/settlements/{settlement}'
 */
    const updateForm = (args: { profile: string | number, settlement: string | number } | [profile: string | number, settlement: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:236
 * @route '/payroll/profiles/{profile}/settlements/{settlement}'
 */
        updateForm.put = (args: { profile: string | number, settlement: string | number } | [profile: string | number, settlement: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:254
 * @route '/payroll/profiles/{profile}/settlements/{settlement}'
 */
export const destroy = (args: { profile: string | number, settlement: string | number } | [profile: string | number, settlement: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/payroll/profiles/{profile}/settlements/{settlement}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::destroy
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:254
 * @route '/payroll/profiles/{profile}/settlements/{settlement}'
 */
destroy.url = (args: { profile: string | number, settlement: string | number } | [profile: string | number, settlement: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    profile: args[0],
                    settlement: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        profile: args.profile,
                                settlement: args.settlement,
                }

    return destroy.definition.url
            .replace('{profile}', parsedArgs.profile.toString())
            .replace('{settlement}', parsedArgs.settlement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::destroy
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:254
 * @route '/payroll/profiles/{profile}/settlements/{settlement}'
 */
destroy.delete = (args: { profile: string | number, settlement: string | number } | [profile: string | number, settlement: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::destroy
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:254
 * @route '/payroll/profiles/{profile}/settlements/{settlement}'
 */
    const destroyForm = (args: { profile: string | number, settlement: string | number } | [profile: string | number, settlement: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:254
 * @route '/payroll/profiles/{profile}/settlements/{settlement}'
 */
        destroyForm.delete = (args: { profile: string | number, settlement: string | number } | [profile: string | number, settlement: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const settlements = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default settlements