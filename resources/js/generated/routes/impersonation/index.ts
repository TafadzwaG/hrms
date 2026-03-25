import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
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
const impersonation = {
    destroy: Object.assign(destroy, destroy),
}

export default impersonation