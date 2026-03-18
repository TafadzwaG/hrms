import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\CandidateCheckoutController::status
 * @see app/Http/Controllers/CandidateCheckoutController.php:100
 * @route '/candidate-profiles/{candidate}/listing-status'
 */
export const status = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(args, options),
    method: 'get',
})

status.definition = {
    methods: ["get","head"],
    url: '/candidate-profiles/{candidate}/listing-status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateCheckoutController::status
 * @see app/Http/Controllers/CandidateCheckoutController.php:100
 * @route '/candidate-profiles/{candidate}/listing-status'
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
 * @see app/Http/Controllers/CandidateCheckoutController.php:100
 * @route '/candidate-profiles/{candidate}/listing-status'
 */
status.get = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateCheckoutController::status
 * @see app/Http/Controllers/CandidateCheckoutController.php:100
 * @route '/candidate-profiles/{candidate}/listing-status'
 */
status.head = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: status.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateCheckoutController::status
 * @see app/Http/Controllers/CandidateCheckoutController.php:100
 * @route '/candidate-profiles/{candidate}/listing-status'
 */
    const statusForm = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: status.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateCheckoutController::status
 * @see app/Http/Controllers/CandidateCheckoutController.php:100
 * @route '/candidate-profiles/{candidate}/listing-status'
 */
        statusForm.get = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: status.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateCheckoutController::status
 * @see app/Http/Controllers/CandidateCheckoutController.php:100
 * @route '/candidate-profiles/{candidate}/listing-status'
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
const candidateListing = {
    status: Object.assign(status, status),
}

export default candidateListing