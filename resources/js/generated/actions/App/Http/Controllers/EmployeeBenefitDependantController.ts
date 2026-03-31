import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EmployeeBenefitDependantController::store
 * @see app/Http/Controllers/EmployeeBenefitDependantController.php:13
 * @route '/benefit-enrollments/{enrollment}/dependants'
 */
export const store = (args: { enrollment: number | { id: number } } | [enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/benefit-enrollments/{enrollment}/dependants',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeBenefitDependantController::store
 * @see app/Http/Controllers/EmployeeBenefitDependantController.php:13
 * @route '/benefit-enrollments/{enrollment}/dependants'
 */
store.url = (args: { enrollment: number | { id: number } } | [enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { enrollment: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { enrollment: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    enrollment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        enrollment: typeof args.enrollment === 'object'
                ? args.enrollment.id
                : args.enrollment,
                }

    return store.definition.url
            .replace('{enrollment}', parsedArgs.enrollment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeBenefitDependantController::store
 * @see app/Http/Controllers/EmployeeBenefitDependantController.php:13
 * @route '/benefit-enrollments/{enrollment}/dependants'
 */
store.post = (args: { enrollment: number | { id: number } } | [enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeBenefitDependantController::store
 * @see app/Http/Controllers/EmployeeBenefitDependantController.php:13
 * @route '/benefit-enrollments/{enrollment}/dependants'
 */
    const storeForm = (args: { enrollment: number | { id: number } } | [enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeBenefitDependantController::store
 * @see app/Http/Controllers/EmployeeBenefitDependantController.php:13
 * @route '/benefit-enrollments/{enrollment}/dependants'
 */
        storeForm.post = (args: { enrollment: number | { id: number } } | [enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\EmployeeBenefitDependantController::update
 * @see app/Http/Controllers/EmployeeBenefitDependantController.php:25
 * @route '/benefit-enrollments/{enrollment}/dependants/{dependant}'
 */
export const update = (args: { enrollment: number | { id: number }, dependant: number | { id: number } } | [enrollment: number | { id: number }, dependant: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/benefit-enrollments/{enrollment}/dependants/{dependant}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\EmployeeBenefitDependantController::update
 * @see app/Http/Controllers/EmployeeBenefitDependantController.php:25
 * @route '/benefit-enrollments/{enrollment}/dependants/{dependant}'
 */
update.url = (args: { enrollment: number | { id: number }, dependant: number | { id: number } } | [enrollment: number | { id: number }, dependant: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    enrollment: args[0],
                    dependant: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        enrollment: typeof args.enrollment === 'object'
                ? args.enrollment.id
                : args.enrollment,
                                dependant: typeof args.dependant === 'object'
                ? args.dependant.id
                : args.dependant,
                }

    return update.definition.url
            .replace('{enrollment}', parsedArgs.enrollment.toString())
            .replace('{dependant}', parsedArgs.dependant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeBenefitDependantController::update
 * @see app/Http/Controllers/EmployeeBenefitDependantController.php:25
 * @route '/benefit-enrollments/{enrollment}/dependants/{dependant}'
 */
update.put = (args: { enrollment: number | { id: number }, dependant: number | { id: number } } | [enrollment: number | { id: number }, dependant: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\EmployeeBenefitDependantController::update
 * @see app/Http/Controllers/EmployeeBenefitDependantController.php:25
 * @route '/benefit-enrollments/{enrollment}/dependants/{dependant}'
 */
    const updateForm = (args: { enrollment: number | { id: number }, dependant: number | { id: number } } | [enrollment: number | { id: number }, dependant: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeBenefitDependantController::update
 * @see app/Http/Controllers/EmployeeBenefitDependantController.php:25
 * @route '/benefit-enrollments/{enrollment}/dependants/{dependant}'
 */
        updateForm.put = (args: { enrollment: number | { id: number }, dependant: number | { id: number } } | [enrollment: number | { id: number }, dependant: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\EmployeeBenefitDependantController::destroy
 * @see app/Http/Controllers/EmployeeBenefitDependantController.php:36
 * @route '/benefit-enrollments/{enrollment}/dependants/{dependant}'
 */
export const destroy = (args: { enrollment: number | { id: number }, dependant: number | { id: number } } | [enrollment: number | { id: number }, dependant: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/benefit-enrollments/{enrollment}/dependants/{dependant}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmployeeBenefitDependantController::destroy
 * @see app/Http/Controllers/EmployeeBenefitDependantController.php:36
 * @route '/benefit-enrollments/{enrollment}/dependants/{dependant}'
 */
destroy.url = (args: { enrollment: number | { id: number }, dependant: number | { id: number } } | [enrollment: number | { id: number }, dependant: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    enrollment: args[0],
                    dependant: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        enrollment: typeof args.enrollment === 'object'
                ? args.enrollment.id
                : args.enrollment,
                                dependant: typeof args.dependant === 'object'
                ? args.dependant.id
                : args.dependant,
                }

    return destroy.definition.url
            .replace('{enrollment}', parsedArgs.enrollment.toString())
            .replace('{dependant}', parsedArgs.dependant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeBenefitDependantController::destroy
 * @see app/Http/Controllers/EmployeeBenefitDependantController.php:36
 * @route '/benefit-enrollments/{enrollment}/dependants/{dependant}'
 */
destroy.delete = (args: { enrollment: number | { id: number }, dependant: number | { id: number } } | [enrollment: number | { id: number }, dependant: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EmployeeBenefitDependantController::destroy
 * @see app/Http/Controllers/EmployeeBenefitDependantController.php:36
 * @route '/benefit-enrollments/{enrollment}/dependants/{dependant}'
 */
    const destroyForm = (args: { enrollment: number | { id: number }, dependant: number | { id: number } } | [enrollment: number | { id: number }, dependant: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeBenefitDependantController::destroy
 * @see app/Http/Controllers/EmployeeBenefitDependantController.php:36
 * @route '/benefit-enrollments/{enrollment}/dependants/{dependant}'
 */
        destroyForm.delete = (args: { enrollment: number | { id: number }, dependant: number | { id: number } } | [enrollment: number | { id: number }, dependant: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const EmployeeBenefitDependantController = { store, update, destroy }

export default EmployeeBenefitDependantController