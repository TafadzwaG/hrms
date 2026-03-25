import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\UserImpersonationController::destroy
 * @see app/Http/Controllers/UserImpersonationController.php:37
 * @route '/impersonation'
 */
export const destroy = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/impersonation',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\UserImpersonationController::destroy
 * @see app/Http/Controllers/UserImpersonationController.php:37
 * @route '/impersonation'
 */
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserImpersonationController::destroy
 * @see app/Http/Controllers/UserImpersonationController.php:37
 * @route '/impersonation'
 */
destroy.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\UserImpersonationController::destroy
 * @see app/Http/Controllers/UserImpersonationController.php:37
 * @route '/impersonation'
 */
    const destroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\UserImpersonationController::destroy
 * @see app/Http/Controllers/UserImpersonationController.php:37
 * @route '/impersonation'
 */
        destroyForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\UserImpersonationController::store
 * @see app/Http/Controllers/UserImpersonationController.php:17
 * @route '/users/{user}/impersonation'
 */
export const store = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/users/{user}/impersonation',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserImpersonationController::store
 * @see app/Http/Controllers/UserImpersonationController.php:17
 * @route '/users/{user}/impersonation'
 */
store.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return store.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserImpersonationController::store
 * @see app/Http/Controllers/UserImpersonationController.php:17
 * @route '/users/{user}/impersonation'
 */
store.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\UserImpersonationController::store
 * @see app/Http/Controllers/UserImpersonationController.php:17
 * @route '/users/{user}/impersonation'
 */
    const storeForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\UserImpersonationController::store
 * @see app/Http/Controllers/UserImpersonationController.php:17
 * @route '/users/{user}/impersonation'
 */
        storeForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const UserImpersonationController = { destroy, store }

export default UserImpersonationController