import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\CandidateDirectoryController::index
 * @see app/Http/Controllers/CandidateDirectoryController.php:12
 * @route '/candidate-directory'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/candidate-directory',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateDirectoryController::index
 * @see app/Http/Controllers/CandidateDirectoryController.php:12
 * @route '/candidate-directory'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateDirectoryController::index
 * @see app/Http/Controllers/CandidateDirectoryController.php:12
 * @route '/candidate-directory'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateDirectoryController::index
 * @see app/Http/Controllers/CandidateDirectoryController.php:12
 * @route '/candidate-directory'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateDirectoryController::index
 * @see app/Http/Controllers/CandidateDirectoryController.php:12
 * @route '/candidate-directory'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateDirectoryController::index
 * @see app/Http/Controllers/CandidateDirectoryController.php:12
 * @route '/candidate-directory'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateDirectoryController::index
 * @see app/Http/Controllers/CandidateDirectoryController.php:12
 * @route '/candidate-directory'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\CandidateDirectoryController::show
 * @see app/Http/Controllers/CandidateDirectoryController.php:81
 * @route '/candidate-directory/{candidate}'
 */
export const show = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/candidate-directory/{candidate}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateDirectoryController::show
 * @see app/Http/Controllers/CandidateDirectoryController.php:81
 * @route '/candidate-directory/{candidate}'
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
* @see \App\Http\Controllers\CandidateDirectoryController::show
 * @see app/Http/Controllers/CandidateDirectoryController.php:81
 * @route '/candidate-directory/{candidate}'
 */
show.get = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateDirectoryController::show
 * @see app/Http/Controllers/CandidateDirectoryController.php:81
 * @route '/candidate-directory/{candidate}'
 */
show.head = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateDirectoryController::show
 * @see app/Http/Controllers/CandidateDirectoryController.php:81
 * @route '/candidate-directory/{candidate}'
 */
    const showForm = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateDirectoryController::show
 * @see app/Http/Controllers/CandidateDirectoryController.php:81
 * @route '/candidate-directory/{candidate}'
 */
        showForm.get = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateDirectoryController::show
 * @see app/Http/Controllers/CandidateDirectoryController.php:81
 * @route '/candidate-directory/{candidate}'
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
const candidateDirectory = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
}

export default candidateDirectory