import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/skills'
 */
export const store = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/candidate-profiles/{candidate}/skills',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/skills'
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
 * @route '/candidate-profiles/{candidate}/skills'
 */
store.post = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/skills'
 */
    const storeForm = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/skills'
 */
        storeForm.post = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\CandidateProfileController::destroy
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/skills/{skill}'
 */
export const destroy = (args: { candidate: string | number, skill: string | number } | [candidate: string | number, skill: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/candidate-profiles/{candidate}/skills/{skill}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::destroy
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/skills/{skill}'
 */
destroy.url = (args: { candidate: string | number, skill: string | number } | [candidate: string | number, skill: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                    skill: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: args.candidate,
                                skill: args.skill,
                }

    return destroy.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace('{skill}', parsedArgs.skill.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::destroy
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/skills/{skill}'
 */
destroy.delete = (args: { candidate: string | number, skill: string | number } | [candidate: string | number, skill: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::destroy
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/candidate-profiles/{candidate}/skills/{skill}'
 */
    const destroyForm = (args: { candidate: string | number, skill: string | number } | [candidate: string | number, skill: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @route '/candidate-profiles/{candidate}/skills/{skill}'
 */
        destroyForm.delete = (args: { candidate: string | number, skill: string | number } | [candidate: string | number, skill: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const candidateSkills = {
    store: Object.assign(store, store),
destroy: Object.assign(destroy, destroy),
}

export default candidateSkills