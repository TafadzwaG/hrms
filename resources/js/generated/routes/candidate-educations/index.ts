import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/educations'
 */
export const store = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/candidate-profiles/{candidate}/educations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/educations'
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
 * @route '/candidate-profiles/{candidate}/educations'
 */
store.post = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/educations'
 */
    const storeForm = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/educations'
 */
        storeForm.post = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/educations/{education}'
 */
export const update = (args: { candidate: string | number, education: string | number } | [candidate: string | number, education: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/candidate-profiles/{candidate}/educations/{education}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/educations/{education}'
 */
update.url = (args: { candidate: string | number, education: string | number } | [candidate: string | number, education: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                    education: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: args.candidate,
                                education: args.education,
                }

    return update.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace('{education}', parsedArgs.education.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/educations/{education}'
 */
update.put = (args: { candidate: string | number, education: string | number } | [candidate: string | number, education: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/educations/{education}'
 */
    const updateForm = (args: { candidate: string | number, education: string | number } | [candidate: string | number, education: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @route '/candidate-profiles/{candidate}/educations/{education}'
 */
        updateForm.put = (args: { candidate: string | number, education: string | number } | [candidate: string | number, education: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @route '/candidate-profiles/{candidate}/educations/{education}'
 */
export const destroy = (args: { candidate: string | number, education: string | number } | [candidate: string | number, education: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/candidate-profiles/{candidate}/educations/{education}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::destroy
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/educations/{education}'
 */
destroy.url = (args: { candidate: string | number, education: string | number } | [candidate: string | number, education: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                    education: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: args.candidate,
                                education: args.education,
                }

    return destroy.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace('{education}', parsedArgs.education.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::destroy
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/educations/{education}'
 */
destroy.delete = (args: { candidate: string | number, education: string | number } | [candidate: string | number, education: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::destroy
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/educations/{education}'
 */
    const destroyForm = (args: { candidate: string | number, education: string | number } | [candidate: string | number, education: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @route '/candidate-profiles/{candidate}/educations/{education}'
 */
        destroyForm.delete = (args: { candidate: string | number, education: string | number } | [candidate: string | number, education: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const candidateEducations = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default candidateEducations