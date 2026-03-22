import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MarketplaceController::show
 * @see app/Http/Controllers/MarketplaceController.php:42
 * @route '/jobs/{vacancy}'
 */
export const show = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/jobs/{vacancy}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MarketplaceController::show
 * @see app/Http/Controllers/MarketplaceController.php:42
 * @route '/jobs/{vacancy}'
 */
show.url = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vacancy: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    vacancy: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vacancy: args.vacancy,
                }

    return show.definition.url
            .replace('{vacancy}', parsedArgs.vacancy.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MarketplaceController::show
 * @see app/Http/Controllers/MarketplaceController.php:42
 * @route '/jobs/{vacancy}'
 */
show.get = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MarketplaceController::show
 * @see app/Http/Controllers/MarketplaceController.php:42
 * @route '/jobs/{vacancy}'
 */
show.head = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MarketplaceController::show
 * @see app/Http/Controllers/MarketplaceController.php:42
 * @route '/jobs/{vacancy}'
 */
    const showForm = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MarketplaceController::show
 * @see app/Http/Controllers/MarketplaceController.php:42
 * @route '/jobs/{vacancy}'
 */
        showForm.get = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MarketplaceController::show
 * @see app/Http/Controllers/MarketplaceController.php:42
 * @route '/jobs/{vacancy}'
 */
        showForm.head = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const jobs = {
    show: Object.assign(show, show),
}

export default jobs