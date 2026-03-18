import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\CandidateCheckoutController::show
 * @see app/Http/Controllers/CandidateCheckoutController.php:14
 * @route '/candidate-profiles/{candidate}/checkout'
 */
export const show = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/candidate-profiles/{candidate}/checkout',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateCheckoutController::show
 * @see app/Http/Controllers/CandidateCheckoutController.php:14
 * @route '/candidate-profiles/{candidate}/checkout'
 */
show.url = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { candidate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { candidate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: typeof args.candidate === 'object'
                ? args.candidate.id
                : args.candidate,
                }

    return show.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateCheckoutController::show
 * @see app/Http/Controllers/CandidateCheckoutController.php:14
 * @route '/candidate-profiles/{candidate}/checkout'
 */
show.get = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateCheckoutController::show
 * @see app/Http/Controllers/CandidateCheckoutController.php:14
 * @route '/candidate-profiles/{candidate}/checkout'
 */
show.head = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateCheckoutController::show
 * @see app/Http/Controllers/CandidateCheckoutController.php:14
 * @route '/candidate-profiles/{candidate}/checkout'
 */
    const showForm = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateCheckoutController::show
 * @see app/Http/Controllers/CandidateCheckoutController.php:14
 * @route '/candidate-profiles/{candidate}/checkout'
 */
        showForm.get = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateCheckoutController::show
 * @see app/Http/Controllers/CandidateCheckoutController.php:14
 * @route '/candidate-profiles/{candidate}/checkout'
 */
        showForm.head = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\CandidateCheckoutController::initiate
 * @see app/Http/Controllers/CandidateCheckoutController.php:39
 * @route '/candidate-profiles/{candidate}/checkout/initiate'
 */
export const initiate = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: initiate.url(args, options),
    method: 'post',
})

initiate.definition = {
    methods: ["post"],
    url: '/candidate-profiles/{candidate}/checkout/initiate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CandidateCheckoutController::initiate
 * @see app/Http/Controllers/CandidateCheckoutController.php:39
 * @route '/candidate-profiles/{candidate}/checkout/initiate'
 */
initiate.url = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { candidate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { candidate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: typeof args.candidate === 'object'
                ? args.candidate.id
                : args.candidate,
                }

    return initiate.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateCheckoutController::initiate
 * @see app/Http/Controllers/CandidateCheckoutController.php:39
 * @route '/candidate-profiles/{candidate}/checkout/initiate'
 */
initiate.post = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: initiate.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CandidateCheckoutController::initiate
 * @see app/Http/Controllers/CandidateCheckoutController.php:39
 * @route '/candidate-profiles/{candidate}/checkout/initiate'
 */
    const initiateForm = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: initiate.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CandidateCheckoutController::initiate
 * @see app/Http/Controllers/CandidateCheckoutController.php:39
 * @route '/candidate-profiles/{candidate}/checkout/initiate'
 */
        initiateForm.post = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: initiate.url(args, options),
            method: 'post',
        })
    
    initiate.form = initiateForm
/**
* @see \App\Http\Controllers\CandidateCheckoutController::returnMethod
 * @see app/Http/Controllers/CandidateCheckoutController.php:62
 * @route '/candidate-profiles/{candidate}/checkout/return'
 */
export const returnMethod = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: returnMethod.url(args, options),
    method: 'get',
})

returnMethod.definition = {
    methods: ["get","head"],
    url: '/candidate-profiles/{candidate}/checkout/return',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateCheckoutController::returnMethod
 * @see app/Http/Controllers/CandidateCheckoutController.php:62
 * @route '/candidate-profiles/{candidate}/checkout/return'
 */
returnMethod.url = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { candidate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { candidate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: typeof args.candidate === 'object'
                ? args.candidate.id
                : args.candidate,
                }

    return returnMethod.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateCheckoutController::returnMethod
 * @see app/Http/Controllers/CandidateCheckoutController.php:62
 * @route '/candidate-profiles/{candidate}/checkout/return'
 */
returnMethod.get = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: returnMethod.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateCheckoutController::returnMethod
 * @see app/Http/Controllers/CandidateCheckoutController.php:62
 * @route '/candidate-profiles/{candidate}/checkout/return'
 */
returnMethod.head = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: returnMethod.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateCheckoutController::returnMethod
 * @see app/Http/Controllers/CandidateCheckoutController.php:62
 * @route '/candidate-profiles/{candidate}/checkout/return'
 */
    const returnMethodForm = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: returnMethod.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateCheckoutController::returnMethod
 * @see app/Http/Controllers/CandidateCheckoutController.php:62
 * @route '/candidate-profiles/{candidate}/checkout/return'
 */
        returnMethodForm.get = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: returnMethod.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateCheckoutController::returnMethod
 * @see app/Http/Controllers/CandidateCheckoutController.php:62
 * @route '/candidate-profiles/{candidate}/checkout/return'
 */
        returnMethodForm.head = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: returnMethod.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    returnMethod.form = returnMethodForm
/**
* @see \App\Http\Controllers\CandidateCheckoutController::status
 * @see app/Http/Controllers/CandidateCheckoutController.php:79
 * @route '/candidate-profiles/{candidate}/checkout/status'
 */
export const status = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(args, options),
    method: 'get',
})

status.definition = {
    methods: ["get","head"],
    url: '/candidate-profiles/{candidate}/checkout/status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateCheckoutController::status
 * @see app/Http/Controllers/CandidateCheckoutController.php:79
 * @route '/candidate-profiles/{candidate}/checkout/status'
 */
status.url = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { candidate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { candidate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: typeof args.candidate === 'object'
                ? args.candidate.id
                : args.candidate,
                }

    return status.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateCheckoutController::status
 * @see app/Http/Controllers/CandidateCheckoutController.php:79
 * @route '/candidate-profiles/{candidate}/checkout/status'
 */
status.get = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateCheckoutController::status
 * @see app/Http/Controllers/CandidateCheckoutController.php:79
 * @route '/candidate-profiles/{candidate}/checkout/status'
 */
status.head = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: status.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateCheckoutController::status
 * @see app/Http/Controllers/CandidateCheckoutController.php:79
 * @route '/candidate-profiles/{candidate}/checkout/status'
 */
    const statusForm = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: status.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateCheckoutController::status
 * @see app/Http/Controllers/CandidateCheckoutController.php:79
 * @route '/candidate-profiles/{candidate}/checkout/status'
 */
        statusForm.get = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: status.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateCheckoutController::status
 * @see app/Http/Controllers/CandidateCheckoutController.php:79
 * @route '/candidate-profiles/{candidate}/checkout/status'
 */
        statusForm.head = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: status.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    status.form = statusForm
const candidateCheckout = {
    show: Object.assign(show, show),
initiate: Object.assign(initiate, initiate),
return: Object.assign(returnMethod, returnMethod),
status: Object.assign(status, status),
}

export default candidateCheckout