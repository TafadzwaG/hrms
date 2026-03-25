import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PortalAuthController::switchMethod
 * @see app/Http/Controllers/PortalAuthController.php:108
 * @route '/portal/switch/{portal}'
 */
export const switchMethod = (args: { portal: string | number } | [portal: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: switchMethod.url(args, options),
    method: 'get',
})

switchMethod.definition = {
    methods: ["get","head"],
    url: '/portal/switch/{portal}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PortalAuthController::switchMethod
 * @see app/Http/Controllers/PortalAuthController.php:108
 * @route '/portal/switch/{portal}'
 */
switchMethod.url = (args: { portal: string | number } | [portal: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { portal: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    portal: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        portal: args.portal,
                }

    return switchMethod.definition.url
            .replace('{portal}', parsedArgs.portal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PortalAuthController::switchMethod
 * @see app/Http/Controllers/PortalAuthController.php:108
 * @route '/portal/switch/{portal}'
 */
switchMethod.get = (args: { portal: string | number } | [portal: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: switchMethod.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PortalAuthController::switchMethod
 * @see app/Http/Controllers/PortalAuthController.php:108
 * @route '/portal/switch/{portal}'
 */
switchMethod.head = (args: { portal: string | number } | [portal: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: switchMethod.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PortalAuthController::switchMethod
 * @see app/Http/Controllers/PortalAuthController.php:108
 * @route '/portal/switch/{portal}'
 */
    const switchMethodForm = (args: { portal: string | number } | [portal: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: switchMethod.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PortalAuthController::switchMethod
 * @see app/Http/Controllers/PortalAuthController.php:108
 * @route '/portal/switch/{portal}'
 */
        switchMethodForm.get = (args: { portal: string | number } | [portal: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: switchMethod.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PortalAuthController::switchMethod
 * @see app/Http/Controllers/PortalAuthController.php:108
 * @route '/portal/switch/{portal}'
 */
        switchMethodForm.head = (args: { portal: string | number } | [portal: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: switchMethod.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    switchMethod.form = switchMethodForm
const portal = {
    switch: Object.assign(switchMethod, switchMethod),
}

export default portal