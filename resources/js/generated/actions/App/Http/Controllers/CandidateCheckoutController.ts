import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\CandidateCheckoutController::initiatePayment
 * @see app/Http/Controllers/CandidateCheckoutController.php:39
 * @route '/candidate-profiles/{candidate}/checkout/initiate'
 */
export const initiatePayment = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: initiatePayment.url(args, options),
    method: 'post',
})

initiatePayment.definition = {
    methods: ["post"],
    url: '/candidate-profiles/{candidate}/checkout/initiate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CandidateCheckoutController::initiatePayment
 * @see app/Http/Controllers/CandidateCheckoutController.php:39
 * @route '/candidate-profiles/{candidate}/checkout/initiate'
 */
initiatePayment.url = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return initiatePayment.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateCheckoutController::initiatePayment
 * @see app/Http/Controllers/CandidateCheckoutController.php:39
 * @route '/candidate-profiles/{candidate}/checkout/initiate'
 */
initiatePayment.post = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: initiatePayment.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CandidateCheckoutController::initiatePayment
 * @see app/Http/Controllers/CandidateCheckoutController.php:39
 * @route '/candidate-profiles/{candidate}/checkout/initiate'
 */
    const initiatePaymentForm = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: initiatePayment.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CandidateCheckoutController::initiatePayment
 * @see app/Http/Controllers/CandidateCheckoutController.php:39
 * @route '/candidate-profiles/{candidate}/checkout/initiate'
 */
        initiatePaymentForm.post = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: initiatePayment.url(args, options),
            method: 'post',
        })
    
    initiatePayment.form = initiatePaymentForm
/**
* @see \App\Http\Controllers\CandidateCheckoutController::handleReturn
 * @see app/Http/Controllers/CandidateCheckoutController.php:62
 * @route '/candidate-profiles/{candidate}/checkout/return'
 */
export const handleReturn = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: handleReturn.url(args, options),
    method: 'get',
})

handleReturn.definition = {
    methods: ["get","head"],
    url: '/candidate-profiles/{candidate}/checkout/return',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateCheckoutController::handleReturn
 * @see app/Http/Controllers/CandidateCheckoutController.php:62
 * @route '/candidate-profiles/{candidate}/checkout/return'
 */
handleReturn.url = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return handleReturn.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateCheckoutController::handleReturn
 * @see app/Http/Controllers/CandidateCheckoutController.php:62
 * @route '/candidate-profiles/{candidate}/checkout/return'
 */
handleReturn.get = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: handleReturn.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateCheckoutController::handleReturn
 * @see app/Http/Controllers/CandidateCheckoutController.php:62
 * @route '/candidate-profiles/{candidate}/checkout/return'
 */
handleReturn.head = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: handleReturn.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateCheckoutController::handleReturn
 * @see app/Http/Controllers/CandidateCheckoutController.php:62
 * @route '/candidate-profiles/{candidate}/checkout/return'
 */
    const handleReturnForm = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: handleReturn.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateCheckoutController::handleReturn
 * @see app/Http/Controllers/CandidateCheckoutController.php:62
 * @route '/candidate-profiles/{candidate}/checkout/return'
 */
        handleReturnForm.get = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: handleReturn.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateCheckoutController::handleReturn
 * @see app/Http/Controllers/CandidateCheckoutController.php:62
 * @route '/candidate-profiles/{candidate}/checkout/return'
 */
        handleReturnForm.head = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: handleReturn.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    handleReturn.form = handleReturnForm
/**
* @see \App\Http\Controllers\CandidateCheckoutController::checkStatus
 * @see app/Http/Controllers/CandidateCheckoutController.php:79
 * @route '/candidate-profiles/{candidate}/checkout/status'
 */
export const checkStatus = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkStatus.url(args, options),
    method: 'get',
})

checkStatus.definition = {
    methods: ["get","head"],
    url: '/candidate-profiles/{candidate}/checkout/status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateCheckoutController::checkStatus
 * @see app/Http/Controllers/CandidateCheckoutController.php:79
 * @route '/candidate-profiles/{candidate}/checkout/status'
 */
checkStatus.url = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return checkStatus.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateCheckoutController::checkStatus
 * @see app/Http/Controllers/CandidateCheckoutController.php:79
 * @route '/candidate-profiles/{candidate}/checkout/status'
 */
checkStatus.get = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkStatus.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateCheckoutController::checkStatus
 * @see app/Http/Controllers/CandidateCheckoutController.php:79
 * @route '/candidate-profiles/{candidate}/checkout/status'
 */
checkStatus.head = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkStatus.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateCheckoutController::checkStatus
 * @see app/Http/Controllers/CandidateCheckoutController.php:79
 * @route '/candidate-profiles/{candidate}/checkout/status'
 */
    const checkStatusForm = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: checkStatus.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateCheckoutController::checkStatus
 * @see app/Http/Controllers/CandidateCheckoutController.php:79
 * @route '/candidate-profiles/{candidate}/checkout/status'
 */
        checkStatusForm.get = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkStatus.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateCheckoutController::checkStatus
 * @see app/Http/Controllers/CandidateCheckoutController.php:79
 * @route '/candidate-profiles/{candidate}/checkout/status'
 */
        checkStatusForm.head = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkStatus.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    checkStatus.form = checkStatusForm
/**
* @see \App\Http\Controllers\CandidateCheckoutController::listingStatus
 * @see app/Http/Controllers/CandidateCheckoutController.php:100
 * @route '/candidate-profiles/{candidate}/listing-status'
 */
export const listingStatus = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listingStatus.url(args, options),
    method: 'get',
})

listingStatus.definition = {
    methods: ["get","head"],
    url: '/candidate-profiles/{candidate}/listing-status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateCheckoutController::listingStatus
 * @see app/Http/Controllers/CandidateCheckoutController.php:100
 * @route '/candidate-profiles/{candidate}/listing-status'
 */
listingStatus.url = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return listingStatus.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateCheckoutController::listingStatus
 * @see app/Http/Controllers/CandidateCheckoutController.php:100
 * @route '/candidate-profiles/{candidate}/listing-status'
 */
listingStatus.get = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listingStatus.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateCheckoutController::listingStatus
 * @see app/Http/Controllers/CandidateCheckoutController.php:100
 * @route '/candidate-profiles/{candidate}/listing-status'
 */
listingStatus.head = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listingStatus.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateCheckoutController::listingStatus
 * @see app/Http/Controllers/CandidateCheckoutController.php:100
 * @route '/candidate-profiles/{candidate}/listing-status'
 */
    const listingStatusForm = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: listingStatus.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateCheckoutController::listingStatus
 * @see app/Http/Controllers/CandidateCheckoutController.php:100
 * @route '/candidate-profiles/{candidate}/listing-status'
 */
        listingStatusForm.get = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listingStatus.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateCheckoutController::listingStatus
 * @see app/Http/Controllers/CandidateCheckoutController.php:100
 * @route '/candidate-profiles/{candidate}/listing-status'
 */
        listingStatusForm.head = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listingStatus.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    listingStatus.form = listingStatusForm
const CandidateCheckoutController = { show, initiatePayment, handleReturn, checkStatus, listingStatus }

export default CandidateCheckoutController