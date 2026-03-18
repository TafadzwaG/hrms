import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\CandidateResumeController::store
 * @see app/Http/Controllers/CandidateResumeController.php:13
 * @route '/candidate-profiles/{candidate}/resumes'
 */
export const store = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/candidate-profiles/{candidate}/resumes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CandidateResumeController::store
 * @see app/Http/Controllers/CandidateResumeController.php:13
 * @route '/candidate-profiles/{candidate}/resumes'
 */
store.url = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateResumeController::store
 * @see app/Http/Controllers/CandidateResumeController.php:13
 * @route '/candidate-profiles/{candidate}/resumes'
 */
store.post = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CandidateResumeController::store
 * @see app/Http/Controllers/CandidateResumeController.php:13
 * @route '/candidate-profiles/{candidate}/resumes'
 */
    const storeForm = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CandidateResumeController::store
 * @see app/Http/Controllers/CandidateResumeController.php:13
 * @route '/candidate-profiles/{candidate}/resumes'
 */
        storeForm.post = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\CandidateResumeController::download
 * @see app/Http/Controllers/CandidateResumeController.php:36
 * @route '/candidate-profiles/{candidate}/resumes/{resume}/download'
 */
export const download = (args: { candidate: number | { id: number }, resume: string | number | { id: string | number } } | [candidate: number | { id: number }, resume: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/candidate-profiles/{candidate}/resumes/{resume}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateResumeController::download
 * @see app/Http/Controllers/CandidateResumeController.php:36
 * @route '/candidate-profiles/{candidate}/resumes/{resume}/download'
 */
download.url = (args: { candidate: number | { id: number }, resume: string | number | { id: string | number } } | [candidate: number | { id: number }, resume: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                    resume: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: typeof args.candidate === 'object'
                ? args.candidate.id
                : args.candidate,
                                resume: typeof args.resume === 'object'
                ? args.resume.id
                : args.resume,
                }

    return download.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace('{resume}', parsedArgs.resume.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateResumeController::download
 * @see app/Http/Controllers/CandidateResumeController.php:36
 * @route '/candidate-profiles/{candidate}/resumes/{resume}/download'
 */
download.get = (args: { candidate: number | { id: number }, resume: string | number | { id: string | number } } | [candidate: number | { id: number }, resume: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateResumeController::download
 * @see app/Http/Controllers/CandidateResumeController.php:36
 * @route '/candidate-profiles/{candidate}/resumes/{resume}/download'
 */
download.head = (args: { candidate: number | { id: number }, resume: string | number | { id: string | number } } | [candidate: number | { id: number }, resume: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateResumeController::download
 * @see app/Http/Controllers/CandidateResumeController.php:36
 * @route '/candidate-profiles/{candidate}/resumes/{resume}/download'
 */
    const downloadForm = (args: { candidate: number | { id: number }, resume: string | number | { id: string | number } } | [candidate: number | { id: number }, resume: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateResumeController::download
 * @see app/Http/Controllers/CandidateResumeController.php:36
 * @route '/candidate-profiles/{candidate}/resumes/{resume}/download'
 */
        downloadForm.get = (args: { candidate: number | { id: number }, resume: string | number | { id: string | number } } | [candidate: number | { id: number }, resume: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateResumeController::download
 * @see app/Http/Controllers/CandidateResumeController.php:36
 * @route '/candidate-profiles/{candidate}/resumes/{resume}/download'
 */
        downloadForm.head = (args: { candidate: number | { id: number }, resume: string | number | { id: string | number } } | [candidate: number | { id: number }, resume: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    download.form = downloadForm
/**
* @see \App\Http\Controllers\CandidateResumeController::destroy
 * @see app/Http/Controllers/CandidateResumeController.php:48
 * @route '/candidate-profiles/{candidate}/resumes/{resume}'
 */
export const destroy = (args: { candidate: number | { id: number }, resume: string | number | { id: string | number } } | [candidate: number | { id: number }, resume: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/candidate-profiles/{candidate}/resumes/{resume}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CandidateResumeController::destroy
 * @see app/Http/Controllers/CandidateResumeController.php:48
 * @route '/candidate-profiles/{candidate}/resumes/{resume}'
 */
destroy.url = (args: { candidate: number | { id: number }, resume: string | number | { id: string | number } } | [candidate: number | { id: number }, resume: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                    resume: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: typeof args.candidate === 'object'
                ? args.candidate.id
                : args.candidate,
                                resume: typeof args.resume === 'object'
                ? args.resume.id
                : args.resume,
                }

    return destroy.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace('{resume}', parsedArgs.resume.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateResumeController::destroy
 * @see app/Http/Controllers/CandidateResumeController.php:48
 * @route '/candidate-profiles/{candidate}/resumes/{resume}'
 */
destroy.delete = (args: { candidate: number | { id: number }, resume: string | number | { id: string | number } } | [candidate: number | { id: number }, resume: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\CandidateResumeController::destroy
 * @see app/Http/Controllers/CandidateResumeController.php:48
 * @route '/candidate-profiles/{candidate}/resumes/{resume}'
 */
    const destroyForm = (args: { candidate: number | { id: number }, resume: string | number | { id: string | number } } | [candidate: number | { id: number }, resume: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CandidateResumeController::destroy
 * @see app/Http/Controllers/CandidateResumeController.php:48
 * @route '/candidate-profiles/{candidate}/resumes/{resume}'
 */
        destroyForm.delete = (args: { candidate: number | { id: number }, resume: string | number | { id: string | number } } | [candidate: number | { id: number }, resume: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\CandidateResumeController::setPrimary
 * @see app/Http/Controllers/CandidateResumeController.php:58
 * @route '/candidate-profiles/{candidate}/resumes/{resume}/set-primary'
 */
export const setPrimary = (args: { candidate: number | { id: number }, resume: string | number | { id: string | number } } | [candidate: number | { id: number }, resume: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: setPrimary.url(args, options),
    method: 'put',
})

setPrimary.definition = {
    methods: ["put"],
    url: '/candidate-profiles/{candidate}/resumes/{resume}/set-primary',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CandidateResumeController::setPrimary
 * @see app/Http/Controllers/CandidateResumeController.php:58
 * @route '/candidate-profiles/{candidate}/resumes/{resume}/set-primary'
 */
setPrimary.url = (args: { candidate: number | { id: number }, resume: string | number | { id: string | number } } | [candidate: number | { id: number }, resume: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                    resume: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: typeof args.candidate === 'object'
                ? args.candidate.id
                : args.candidate,
                                resume: typeof args.resume === 'object'
                ? args.resume.id
                : args.resume,
                }

    return setPrimary.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace('{resume}', parsedArgs.resume.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateResumeController::setPrimary
 * @see app/Http/Controllers/CandidateResumeController.php:58
 * @route '/candidate-profiles/{candidate}/resumes/{resume}/set-primary'
 */
setPrimary.put = (args: { candidate: number | { id: number }, resume: string | number | { id: string | number } } | [candidate: number | { id: number }, resume: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: setPrimary.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\CandidateResumeController::setPrimary
 * @see app/Http/Controllers/CandidateResumeController.php:58
 * @route '/candidate-profiles/{candidate}/resumes/{resume}/set-primary'
 */
    const setPrimaryForm = (args: { candidate: number | { id: number }, resume: string | number | { id: string | number } } | [candidate: number | { id: number }, resume: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: setPrimary.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CandidateResumeController::setPrimary
 * @see app/Http/Controllers/CandidateResumeController.php:58
 * @route '/candidate-profiles/{candidate}/resumes/{resume}/set-primary'
 */
        setPrimaryForm.put = (args: { candidate: number | { id: number }, resume: string | number | { id: string | number } } | [candidate: number | { id: number }, resume: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: setPrimary.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    setPrimary.form = setPrimaryForm
const candidateResumes = {
    store: Object.assign(store, store),
download: Object.assign(download, download),
destroy: Object.assign(destroy, destroy),
setPrimary: Object.assign(setPrimary, setPrimary),
}

export default candidateResumes