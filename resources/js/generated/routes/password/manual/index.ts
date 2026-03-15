import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PasswordResetController::update
 * @see app/Http/Controllers/PasswordResetController.php:76
 * @route '/reset-password'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/reset-password',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PasswordResetController::update
 * @see app/Http/Controllers/PasswordResetController.php:76
 * @route '/reset-password'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PasswordResetController::update
 * @see app/Http/Controllers/PasswordResetController.php:76
 * @route '/reset-password'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PasswordResetController::update
 * @see app/Http/Controllers/PasswordResetController.php:76
 * @route '/reset-password'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PasswordResetController::update
 * @see app/Http/Controllers/PasswordResetController.php:76
 * @route '/reset-password'
 */
        updateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(options),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\PasswordResetController::reset
 * @see app/Http/Controllers/PasswordResetController.php:55
 * @route '/reset-password'
 */
export const reset = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reset.url(options),
    method: 'get',
})

reset.definition = {
    methods: ["get","head"],
    url: '/reset-password',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PasswordResetController::reset
 * @see app/Http/Controllers/PasswordResetController.php:55
 * @route '/reset-password'
 */
reset.url = (options?: RouteQueryOptions) => {
    return reset.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PasswordResetController::reset
 * @see app/Http/Controllers/PasswordResetController.php:55
 * @route '/reset-password'
 */
reset.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reset.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PasswordResetController::reset
 * @see app/Http/Controllers/PasswordResetController.php:55
 * @route '/reset-password'
 */
reset.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reset.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PasswordResetController::reset
 * @see app/Http/Controllers/PasswordResetController.php:55
 * @route '/reset-password'
 */
    const resetForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reset.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PasswordResetController::reset
 * @see app/Http/Controllers/PasswordResetController.php:55
 * @route '/reset-password'
 */
        resetForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reset.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PasswordResetController::reset
 * @see app/Http/Controllers/PasswordResetController.php:55
 * @route '/reset-password'
 */
        resetForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reset.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reset.form = resetForm
const manual = {
    update: Object.assign(update, update),
reset: Object.assign(reset, reset),
}

export default manual