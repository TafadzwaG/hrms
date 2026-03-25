import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
const PasswordResetController = { sendResetLink }

export default PasswordResetController