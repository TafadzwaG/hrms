import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PortalAuthController::store
 * @see app/Http/Controllers/PortalAuthController.php:69
 * @route '/candidate/register'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/candidate/register',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PortalAuthController::store
 * @see app/Http/Controllers/PortalAuthController.php:69
 * @route '/candidate/register'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PortalAuthController::store
 * @see app/Http/Controllers/PortalAuthController.php:69
 * @route '/candidate/register'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PortalAuthController::store
 * @see app/Http/Controllers/PortalAuthController.php:69
 * @route '/candidate/register'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PortalAuthController::store
 * @see app/Http/Controllers/PortalAuthController.php:69
 * @route '/candidate/register'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const register = {
    store: Object.assign(store, store),
}

export default register