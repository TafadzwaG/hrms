import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Employer\CandidatesController::index
 * @see app/Http/Controllers/Employer/CandidatesController.php:15
 * @route '/employer/candidates'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/employer/candidates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\CandidatesController::index
 * @see app/Http/Controllers/Employer/CandidatesController.php:15
 * @route '/employer/candidates'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\CandidatesController::index
 * @see app/Http/Controllers/Employer/CandidatesController.php:15
 * @route '/employer/candidates'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\CandidatesController::index
 * @see app/Http/Controllers/Employer/CandidatesController.php:15
 * @route '/employer/candidates'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employer\CandidatesController::index
 * @see app/Http/Controllers/Employer/CandidatesController.php:15
 * @route '/employer/candidates'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employer\CandidatesController::index
 * @see app/Http/Controllers/Employer/CandidatesController.php:15
 * @route '/employer/candidates'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employer\CandidatesController::index
 * @see app/Http/Controllers/Employer/CandidatesController.php:15
 * @route '/employer/candidates'
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
* @see \App\Http\Controllers\Employer\CandidatesController::updateStatus
 * @see app/Http/Controllers/Employer/CandidatesController.php:74
 * @route '/employer/applications/{application}/status'
 */
export const updateStatus = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateStatus.url(args, options),
    method: 'patch',
})

updateStatus.definition = {
    methods: ["patch"],
    url: '/employer/applications/{application}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Employer\CandidatesController::updateStatus
 * @see app/Http/Controllers/Employer/CandidatesController.php:74
 * @route '/employer/applications/{application}/status'
 */
updateStatus.url = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    application: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        application: args.application,
                }

    return updateStatus.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\CandidatesController::updateStatus
 * @see app/Http/Controllers/Employer/CandidatesController.php:74
 * @route '/employer/applications/{application}/status'
 */
updateStatus.patch = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateStatus.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Employer\CandidatesController::updateStatus
 * @see app/Http/Controllers/Employer/CandidatesController.php:74
 * @route '/employer/applications/{application}/status'
 */
    const updateStatusForm = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateStatus.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Employer\CandidatesController::updateStatus
 * @see app/Http/Controllers/Employer/CandidatesController.php:74
 * @route '/employer/applications/{application}/status'
 */
        updateStatusForm.patch = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateStatus.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateStatus.form = updateStatusForm
const CandidatesController = { index, updateStatus }

export default CandidatesController