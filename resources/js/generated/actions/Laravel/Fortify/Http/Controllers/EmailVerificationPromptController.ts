import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \Laravel\Fortify\Http\Controllers\EmailVerificationPromptController::__invoke
 * @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationPromptController.php:18
 * @route '/email/verify'
 */
const EmailVerificationPromptController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EmailVerificationPromptController.url(options),
    method: 'get',
})

EmailVerificationPromptController.definition = {
    methods: ["get","head"],
    url: '/email/verify',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Laravel\Fortify\Http\Controllers\EmailVerificationPromptController::__invoke
 * @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationPromptController.php:18
 * @route '/email/verify'
 */
EmailVerificationPromptController.url = (options?: RouteQueryOptions) => {
    return EmailVerificationPromptController.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\EmailVerificationPromptController::__invoke
 * @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationPromptController.php:18
 * @route '/email/verify'
 */
EmailVerificationPromptController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EmailVerificationPromptController.url(options),
    method: 'get',
})
/**
* @see \Laravel\Fortify\Http\Controllers\EmailVerificationPromptController::__invoke
 * @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationPromptController.php:18
 * @route '/email/verify'
 */
EmailVerificationPromptController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: EmailVerificationPromptController.url(options),
    method: 'head',
})

    /**
* @see \Laravel\Fortify\Http\Controllers\EmailVerificationPromptController::__invoke
 * @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationPromptController.php:18
 * @route '/email/verify'
 */
    const EmailVerificationPromptControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: EmailVerificationPromptController.url(options),
        method: 'get',
    })

            /**
* @see \Laravel\Fortify\Http\Controllers\EmailVerificationPromptController::__invoke
 * @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationPromptController.php:18
 * @route '/email/verify'
 */
        EmailVerificationPromptControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: EmailVerificationPromptController.url(options),
            method: 'get',
        })
            /**
* @see \Laravel\Fortify\Http\Controllers\EmailVerificationPromptController::__invoke
 * @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationPromptController.php:18
 * @route '/email/verify'
 */
        EmailVerificationPromptControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: EmailVerificationPromptController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    EmailVerificationPromptController.form = EmailVerificationPromptControllerForm
export default EmailVerificationPromptController