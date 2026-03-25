import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\UserController::destroy
 * @see app/Http/Controllers/UserController.php:367
 * @route '/users/{user}/roles/{role}'
 */
export const destroy = (args: { user: number | { id: number }, role: number | { id: number } } | [user: number | { id: number }, role: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/users/{user}/roles/{role}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\UserController::destroy
 * @see app/Http/Controllers/UserController.php:367
 * @route '/users/{user}/roles/{role}'
 */
destroy.url = (args: { user: number | { id: number }, role: number | { id: number } } | [user: number | { id: number }, role: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                    role: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                                role: typeof args.role === 'object'
                ? args.role.id
                : args.role,
                }

    return destroy.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::destroy
 * @see app/Http/Controllers/UserController.php:367
 * @route '/users/{user}/roles/{role}'
 */
destroy.delete = (args: { user: number | { id: number }, role: number | { id: number } } | [user: number | { id: number }, role: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\UserController::destroy
 * @see app/Http/Controllers/UserController.php:367
 * @route '/users/{user}/roles/{role}'
 */
    const destroyForm = (args: { user: number | { id: number }, role: number | { id: number } } | [user: number | { id: number }, role: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\UserController::destroy
 * @see app/Http/Controllers/UserController.php:367
 * @route '/users/{user}/roles/{role}'
 */
        destroyForm.delete = (args: { user: number | { id: number }, role: number | { id: number } } | [user: number | { id: number }, role: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const roles = {
    destroy: Object.assign(destroy, destroy),
}

export default roles