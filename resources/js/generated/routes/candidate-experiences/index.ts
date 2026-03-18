import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/experiences'
 */
export const store = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/candidate-profiles/{candidate}/experiences',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/experiences'
 */
store.url = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { candidate: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: args.candidate,
                }

    return store.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/experiences'
 */
store.post = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/experiences'
 */
    const storeForm = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/experiences'
 */
        storeForm.post = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/experiences/{experience}'
 */
export const update = (args: { candidate: string | number, experience: string | number } | [candidate: string | number, experience: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/candidate-profiles/{candidate}/experiences/{experience}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/experiences/{experience}'
 */
update.url = (args: { candidate: string | number, experience: string | number } | [candidate: string | number, experience: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                    experience: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: args.candidate,
                                experience: args.experience,
                }

    return update.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace('{experience}', parsedArgs.experience.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/experiences/{experience}'
 */
update.put = (args: { candidate: string | number, experience: string | number } | [candidate: string | number, experience: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/experiences/{experience}'
 */
    const updateForm = (args: { candidate: string | number, experience: string | number } | [candidate: string | number, experience: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/experiences/{experience}'
 */
        updateForm.put = (args: { candidate: string | number, experience: string | number } | [candidate: string | number, experience: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\CandidateProfileController::destroy
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/experiences/{experience}'
 */
export const destroy = (args: { candidate: string | number, experience: string | number } | [candidate: string | number, experience: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/candidate-profiles/{candidate}/experiences/{experience}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::destroy
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/experiences/{experience}'
 */
destroy.url = (args: { candidate: string | number, experience: string | number } | [candidate: string | number, experience: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                    experience: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: args.candidate,
                                experience: args.experience,
                }

    return destroy.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace('{experience}', parsedArgs.experience.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::destroy
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/experiences/{experience}'
 */
destroy.delete = (args: { candidate: string | number, experience: string | number } | [candidate: string | number, experience: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::destroy
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/experiences/{experience}'
 */
    const destroyForm = (args: { candidate: string | number, experience: string | number } | [candidate: string | number, experience: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::destroy
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/experiences/{experience}'
 */
        destroyForm.delete = (args: { candidate: string | number, experience: string | number } | [candidate: string | number, experience: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const candidateExperiences = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default candidateExperiences