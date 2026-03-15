import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import items from './items'
import settlements from './settlements'
/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::index
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:21
 * @route '/payroll/profiles'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/payroll/profiles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::index
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:21
 * @route '/payroll/profiles'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::index
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:21
 * @route '/payroll/profiles'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::index
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:21
 * @route '/payroll/profiles'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::index
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:21
 * @route '/payroll/profiles'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::index
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:21
 * @route '/payroll/profiles'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::index
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:21
 * @route '/payroll/profiles'
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
* @see \App\Http\Controllers\EmployeePayrollProfileController::store
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:133
 * @route '/payroll/profiles'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/payroll/profiles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::store
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:133
 * @route '/payroll/profiles'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::store
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:133
 * @route '/payroll/profiles'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::store
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:133
 * @route '/payroll/profiles'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::store
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:133
 * @route '/payroll/profiles'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::update
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:143
 * @route '/payroll/profiles/{profile}'
 */
export const update = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/payroll/profiles/{profile}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::update
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:143
 * @route '/payroll/profiles/{profile}'
 */
update.url = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{profile}', parsedArgs.profile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::update
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:143
 * @route '/payroll/profiles/{profile}'
 */
update.put = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::update
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:143
 * @route '/payroll/profiles/{profile}'
 */
    const updateForm = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:143
 * @route '/payroll/profiles/{profile}'
 */
        updateForm.put = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:152
 * @route '/payroll/profiles/{profile}'
 */
export const destroy = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/payroll/profiles/{profile}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::destroy
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:152
 * @route '/payroll/profiles/{profile}'
 */
destroy.url = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{profile}', parsedArgs.profile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::destroy
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:152
 * @route '/payroll/profiles/{profile}'
 */
destroy.delete = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::destroy
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:152
 * @route '/payroll/profiles/{profile}'
 */
    const destroyForm = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:152
 * @route '/payroll/profiles/{profile}'
 */
        destroyForm.delete = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const profiles = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
items: Object.assign(items, items),
settlements: Object.assign(settlements, settlements),
}

export default profiles