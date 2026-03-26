import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\EmployeeController::store
 * @see app/Http/Controllers/EmployeeController.php:534
 * @route '/employees/{employee}/next-of-kin'
 */
export const store = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/employees/{employee}/next-of-kin',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeController::store
 * @see app/Http/Controllers/EmployeeController.php:534
 * @route '/employees/{employee}/next-of-kin'
 */
store.url = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { employee: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                }

    return store.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::store
 * @see app/Http/Controllers/EmployeeController.php:534
 * @route '/employees/{employee}/next-of-kin'
 */
store.post = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeController::store
 * @see app/Http/Controllers/EmployeeController.php:534
 * @route '/employees/{employee}/next-of-kin'
 */
    const storeForm = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::store
 * @see app/Http/Controllers/EmployeeController.php:534
 * @route '/employees/{employee}/next-of-kin'
 */
        storeForm.post = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\EmployeeController::update
 * @see app/Http/Controllers/EmployeeController.php:554
 * @route '/employees/{employee}/next-of-kin/{nextOfKin}'
 */
export const update = (args: { employee: number | { id: number }, nextOfKin: number | { id: number } } | [employee: number | { id: number }, nextOfKin: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/employees/{employee}/next-of-kin/{nextOfKin}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\EmployeeController::update
 * @see app/Http/Controllers/EmployeeController.php:554
 * @route '/employees/{employee}/next-of-kin/{nextOfKin}'
 */
update.url = (args: { employee: number | { id: number }, nextOfKin: number | { id: number } } | [employee: number | { id: number }, nextOfKin: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                    nextOfKin: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                                nextOfKin: typeof args.nextOfKin === 'object'
                ? args.nextOfKin.id
                : args.nextOfKin,
                }

    return update.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace('{nextOfKin}', parsedArgs.nextOfKin.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::update
 * @see app/Http/Controllers/EmployeeController.php:554
 * @route '/employees/{employee}/next-of-kin/{nextOfKin}'
 */
update.put = (args: { employee: number | { id: number }, nextOfKin: number | { id: number } } | [employee: number | { id: number }, nextOfKin: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\EmployeeController::update
 * @see app/Http/Controllers/EmployeeController.php:554
 * @route '/employees/{employee}/next-of-kin/{nextOfKin}'
 */
    const updateForm = (args: { employee: number | { id: number }, nextOfKin: number | { id: number } } | [employee: number | { id: number }, nextOfKin: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::update
 * @see app/Http/Controllers/EmployeeController.php:554
 * @route '/employees/{employee}/next-of-kin/{nextOfKin}'
 */
        updateForm.put = (args: { employee: number | { id: number }, nextOfKin: number | { id: number } } | [employee: number | { id: number }, nextOfKin: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\EmployeeController::destroy
 * @see app/Http/Controllers/EmployeeController.php:577
 * @route '/employees/{employee}/next-of-kin/{nextOfKin}'
 */
export const destroy = (args: { employee: number | { id: number }, nextOfKin: number | { id: number } } | [employee: number | { id: number }, nextOfKin: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/employees/{employee}/next-of-kin/{nextOfKin}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmployeeController::destroy
 * @see app/Http/Controllers/EmployeeController.php:577
 * @route '/employees/{employee}/next-of-kin/{nextOfKin}'
 */
destroy.url = (args: { employee: number | { id: number }, nextOfKin: number | { id: number } } | [employee: number | { id: number }, nextOfKin: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                    nextOfKin: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                                nextOfKin: typeof args.nextOfKin === 'object'
                ? args.nextOfKin.id
                : args.nextOfKin,
                }

    return destroy.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace('{nextOfKin}', parsedArgs.nextOfKin.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::destroy
 * @see app/Http/Controllers/EmployeeController.php:577
 * @route '/employees/{employee}/next-of-kin/{nextOfKin}'
 */
destroy.delete = (args: { employee: number | { id: number }, nextOfKin: number | { id: number } } | [employee: number | { id: number }, nextOfKin: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EmployeeController::destroy
 * @see app/Http/Controllers/EmployeeController.php:577
 * @route '/employees/{employee}/next-of-kin/{nextOfKin}'
 */
    const destroyForm = (args: { employee: number | { id: number }, nextOfKin: number | { id: number } } | [employee: number | { id: number }, nextOfKin: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::destroy
 * @see app/Http/Controllers/EmployeeController.php:577
 * @route '/employees/{employee}/next-of-kin/{nextOfKin}'
 */
        destroyForm.delete = (args: { employee: number | { id: number }, nextOfKin: number | { id: number } } | [employee: number | { id: number }, nextOfKin: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const nextOfKin = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default nextOfKin