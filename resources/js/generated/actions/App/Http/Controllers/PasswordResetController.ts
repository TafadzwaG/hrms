import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PasswordResetController::show
 * @see app/Http/Controllers/PasswordResetController.php:56
 * @route '/reset-password'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/reset-password',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PasswordResetController::show
 * @see app/Http/Controllers/PasswordResetController.php:56
 * @route '/reset-password'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PasswordResetController::show
 * @see app/Http/Controllers/PasswordResetController.php:56
 * @route '/reset-password'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PasswordResetController::show
 * @see app/Http/Controllers/PasswordResetController.php:56
 * @route '/reset-password'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PasswordResetController::show
 * @see app/Http/Controllers/PasswordResetController.php:56
 * @route '/reset-password'
 */
    const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PasswordResetController::show
 * @see app/Http/Controllers/PasswordResetController.php:56
 * @route '/reset-password'
 */
        showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PasswordResetController::show
 * @see app/Http/Controllers/PasswordResetController.php:56
 * @route '/reset-password'
 */
        showForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\PasswordResetController::sendResetLink
 * @see app/Http/Controllers/PasswordResetController.php:22
 * @route '/users/{user}/send-password-reset-link'
 */
export const sendResetLink = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendResetLink.url(args, options),
    method: 'post',
})

sendResetLink.definition = {
    methods: ["post"],
    url: '/users/{user}/send-password-reset-link',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PasswordResetController::sendResetLink
 * @see app/Http/Controllers/PasswordResetController.php:22
 * @route '/users/{user}/send-password-reset-link'
 */
sendResetLink.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return sendResetLink.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PasswordResetController::sendResetLink
 * @see app/Http/Controllers/PasswordResetController.php:22
 * @route '/users/{user}/send-password-reset-link'
 */
sendResetLink.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendResetLink.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PasswordResetController::sendResetLink
 * @see app/Http/Controllers/PasswordResetController.php:22
 * @route '/users/{user}/send-password-reset-link'
 */
    const sendResetLinkForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: sendResetLink.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PasswordResetController::sendResetLink
 * @see app/Http/Controllers/PasswordResetController.php:22
 * @route '/users/{user}/send-password-reset-link'
 */
        sendResetLinkForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: sendResetLink.url(args, options),
            method: 'post',
        })
    
    sendResetLink.form = sendResetLinkForm
const PasswordResetController = { show, sendResetLink }

export default PasswordResetController