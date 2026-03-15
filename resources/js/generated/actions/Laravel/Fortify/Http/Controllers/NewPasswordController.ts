import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \Laravel\Fortify\Http\Controllers\NewPasswordController::create
 * @see vendor/laravel/fortify/src/Http/Controllers/NewPasswordController.php:44
 * @route '/reset-password/{token}'
 */
export const create = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/reset-password/{token}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Laravel\Fortify\Http\Controllers\NewPasswordController::create
 * @see vendor/laravel/fortify/src/Http/Controllers/NewPasswordController.php:44
 * @route '/reset-password/{token}'
 */
create.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { token: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    token: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        token: args.token,
                }

    return create.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\NewPasswordController::create
 * @see vendor/laravel/fortify/src/Http/Controllers/NewPasswordController.php:44
 * @route '/reset-password/{token}'
 */
create.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
* @see \Laravel\Fortify\Http\Controllers\NewPasswordController::create
 * @see vendor/laravel/fortify/src/Http/Controllers/NewPasswordController.php:44
 * @route '/reset-password/{token}'
 */
create.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

    /**
* @see \Laravel\Fortify\Http\Controllers\NewPasswordController::create
 * @see vendor/laravel/fortify/src/Http/Controllers/NewPasswordController.php:44
 * @route '/reset-password/{token}'
 */
    const createForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(args, options),
        method: 'get',
    })

            /**
* @see \Laravel\Fortify\Http\Controllers\NewPasswordController::create
 * @see vendor/laravel/fortify/src/Http/Controllers/NewPasswordController.php:44
 * @route '/reset-password/{token}'
 */
        createForm.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, options),
            method: 'get',
        })
            /**
* @see \Laravel\Fortify\Http\Controllers\NewPasswordController::create
 * @see vendor/laravel/fortify/src/Http/Controllers/NewPasswordController.php:44
 * @route '/reset-password/{token}'
 */
        createForm.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
const NewPasswordController = { create }

export default NewPasswordController