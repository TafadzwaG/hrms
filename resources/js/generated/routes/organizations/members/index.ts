import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\OrganizationController::store
 * @see app/Http/Controllers/OrganizationController.php:326
 * @route '/organizations/{organization}/members'
 */
export const store = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/organizations/{organization}/members',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrganizationController::store
 * @see app/Http/Controllers/OrganizationController.php:326
 * @route '/organizations/{organization}/members'
 */
store.url = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { organization: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { organization: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    organization: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        organization: typeof args.organization === 'object'
                ? args.organization.id
                : args.organization,
                }

    return store.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::store
 * @see app/Http/Controllers/OrganizationController.php:326
 * @route '/organizations/{organization}/members'
 */
store.post = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OrganizationController::store
 * @see app/Http/Controllers/OrganizationController.php:326
 * @route '/organizations/{organization}/members'
 */
    const storeForm = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::store
 * @see app/Http/Controllers/OrganizationController.php:326
 * @route '/organizations/{organization}/members'
 */
        storeForm.post = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\OrganizationController::update
 * @see app/Http/Controllers/OrganizationController.php:366
 * @route '/organizations/{organization}/members/{user}'
 */
export const update = (args: { organization: number | { id: number }, user: number | { id: number } } | [organization: number | { id: number }, user: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/organizations/{organization}/members/{user}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\OrganizationController::update
 * @see app/Http/Controllers/OrganizationController.php:366
 * @route '/organizations/{organization}/members/{user}'
 */
update.url = (args: { organization: number | { id: number }, user: number | { id: number } } | [organization: number | { id: number }, user: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    organization: args[0],
                    user: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        organization: typeof args.organization === 'object'
                ? args.organization.id
                : args.organization,
                                user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return update.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::update
 * @see app/Http/Controllers/OrganizationController.php:366
 * @route '/organizations/{organization}/members/{user}'
 */
update.put = (args: { organization: number | { id: number }, user: number | { id: number } } | [organization: number | { id: number }, user: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\OrganizationController::update
 * @see app/Http/Controllers/OrganizationController.php:366
 * @route '/organizations/{organization}/members/{user}'
 */
    const updateForm = (args: { organization: number | { id: number }, user: number | { id: number } } | [organization: number | { id: number }, user: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::update
 * @see app/Http/Controllers/OrganizationController.php:366
 * @route '/organizations/{organization}/members/{user}'
 */
        updateForm.put = (args: { organization: number | { id: number }, user: number | { id: number } } | [organization: number | { id: number }, user: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\OrganizationController::destroy
 * @see app/Http/Controllers/OrganizationController.php:412
 * @route '/organizations/{organization}/members/{user}'
 */
export const destroy = (args: { organization: number | { id: number }, user: number | { id: number } } | [organization: number | { id: number }, user: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/organizations/{organization}/members/{user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\OrganizationController::destroy
 * @see app/Http/Controllers/OrganizationController.php:412
 * @route '/organizations/{organization}/members/{user}'
 */
destroy.url = (args: { organization: number | { id: number }, user: number | { id: number } } | [organization: number | { id: number }, user: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    organization: args[0],
                    user: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        organization: typeof args.organization === 'object'
                ? args.organization.id
                : args.organization,
                                user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return destroy.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::destroy
 * @see app/Http/Controllers/OrganizationController.php:412
 * @route '/organizations/{organization}/members/{user}'
 */
destroy.delete = (args: { organization: number | { id: number }, user: number | { id: number } } | [organization: number | { id: number }, user: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\OrganizationController::destroy
 * @see app/Http/Controllers/OrganizationController.php:412
 * @route '/organizations/{organization}/members/{user}'
 */
    const destroyForm = (args: { organization: number | { id: number }, user: number | { id: number } } | [organization: number | { id: number }, user: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::destroy
 * @see app/Http/Controllers/OrganizationController.php:412
 * @route '/organizations/{organization}/members/{user}'
 */
        destroyForm.delete = (args: { organization: number | { id: number }, user: number | { id: number } } | [organization: number | { id: number }, user: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const members = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default members