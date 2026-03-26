import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Employer\CandidatesController::index
 * @see app/Http/Controllers/Employer/CandidatesController.php:17
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
 * @see app/Http/Controllers/Employer/CandidatesController.php:17
 * @route '/employer/candidates'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\CandidatesController::index
 * @see app/Http/Controllers/Employer/CandidatesController.php:17
 * @route '/employer/candidates'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\CandidatesController::index
 * @see app/Http/Controllers/Employer/CandidatesController.php:17
 * @route '/employer/candidates'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employer\CandidatesController::index
 * @see app/Http/Controllers/Employer/CandidatesController.php:17
 * @route '/employer/candidates'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employer\CandidatesController::index
 * @see app/Http/Controllers/Employer/CandidatesController.php:17
 * @route '/employer/candidates'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employer\CandidatesController::index
 * @see app/Http/Controllers/Employer/CandidatesController.php:17
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
* @see \App\Http\Controllers\Employer\CandidatesController::show
 * @see app/Http/Controllers/Employer/CandidatesController.php:83
 * @route '/employer/candidates/{application}'
 */
export const show = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/employer/candidates/{application}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\CandidatesController::show
 * @see app/Http/Controllers/Employer/CandidatesController.php:83
 * @route '/employer/candidates/{application}'
 */
show.url = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\CandidatesController::show
 * @see app/Http/Controllers/Employer/CandidatesController.php:83
 * @route '/employer/candidates/{application}'
 */
show.get = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\CandidatesController::show
 * @see app/Http/Controllers/Employer/CandidatesController.php:83
 * @route '/employer/candidates/{application}'
 */
show.head = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employer\CandidatesController::show
 * @see app/Http/Controllers/Employer/CandidatesController.php:83
 * @route '/employer/candidates/{application}'
 */
    const showForm = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employer\CandidatesController::show
 * @see app/Http/Controllers/Employer/CandidatesController.php:83
 * @route '/employer/candidates/{application}'
 */
        showForm.get = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employer\CandidatesController::show
 * @see app/Http/Controllers/Employer/CandidatesController.php:83
 * @route '/employer/candidates/{application}'
 */
        showForm.head = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Employer\CandidatesController::updateStatus
 * @see app/Http/Controllers/Employer/CandidatesController.php:146
 * @route '/employer/candidates/{application}/status'
 */
export const updateStatus = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateStatus.url(args, options),
    method: 'patch',
})

updateStatus.definition = {
    methods: ["patch"],
    url: '/employer/candidates/{application}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Employer\CandidatesController::updateStatus
 * @see app/Http/Controllers/Employer/CandidatesController.php:146
 * @route '/employer/candidates/{application}/status'
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
 * @see app/Http/Controllers/Employer/CandidatesController.php:146
 * @route '/employer/candidates/{application}/status'
 */
updateStatus.patch = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateStatus.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Employer\CandidatesController::updateStatus
 * @see app/Http/Controllers/Employer/CandidatesController.php:146
 * @route '/employer/candidates/{application}/status'
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
 * @see app/Http/Controllers/Employer/CandidatesController.php:146
 * @route '/employer/candidates/{application}/status'
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
/**
* @see \App\Http\Controllers\Employer\CandidatesController::downloadResume
 * @see app/Http/Controllers/Employer/CandidatesController.php:176
 * @route '/employer/candidates/{application}/resumes/{resume}/download'
 */
export const downloadResume = (args: { application: string | number, resume: string | number } | [application: string | number, resume: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadResume.url(args, options),
    method: 'get',
})

downloadResume.definition = {
    methods: ["get","head"],
    url: '/employer/candidates/{application}/resumes/{resume}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\CandidatesController::downloadResume
 * @see app/Http/Controllers/Employer/CandidatesController.php:176
 * @route '/employer/candidates/{application}/resumes/{resume}/download'
 */
downloadResume.url = (args: { application: string | number, resume: string | number } | [application: string | number, resume: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    application: args[0],
                    resume: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        application: args.application,
                                resume: args.resume,
                }

    return downloadResume.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace('{resume}', parsedArgs.resume.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\CandidatesController::downloadResume
 * @see app/Http/Controllers/Employer/CandidatesController.php:176
 * @route '/employer/candidates/{application}/resumes/{resume}/download'
 */
downloadResume.get = (args: { application: string | number, resume: string | number } | [application: string | number, resume: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadResume.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\CandidatesController::downloadResume
 * @see app/Http/Controllers/Employer/CandidatesController.php:176
 * @route '/employer/candidates/{application}/resumes/{resume}/download'
 */
downloadResume.head = (args: { application: string | number, resume: string | number } | [application: string | number, resume: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadResume.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employer\CandidatesController::downloadResume
 * @see app/Http/Controllers/Employer/CandidatesController.php:176
 * @route '/employer/candidates/{application}/resumes/{resume}/download'
 */
    const downloadResumeForm = (args: { application: string | number, resume: string | number } | [application: string | number, resume: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadResume.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employer\CandidatesController::downloadResume
 * @see app/Http/Controllers/Employer/CandidatesController.php:176
 * @route '/employer/candidates/{application}/resumes/{resume}/download'
 */
        downloadResumeForm.get = (args: { application: string | number, resume: string | number } | [application: string | number, resume: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadResume.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employer\CandidatesController::downloadResume
 * @see app/Http/Controllers/Employer/CandidatesController.php:176
 * @route '/employer/candidates/{application}/resumes/{resume}/download'
 */
        downloadResumeForm.head = (args: { application: string | number, resume: string | number } | [application: string | number, resume: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadResume.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadResume.form = downloadResumeForm
/**
* @see \App\Http\Controllers\Employer\CandidatesController::previewResume
 * @see app/Http/Controllers/Employer/CandidatesController.php:208
 * @route '/employer/candidates/{application}/resumes/{resume}/preview'
 */
export const previewResume = (args: { application: string | number, resume: string | number } | [application: string | number, resume: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: previewResume.url(args, options),
    method: 'get',
})

previewResume.definition = {
    methods: ["get","head"],
    url: '/employer/candidates/{application}/resumes/{resume}/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\CandidatesController::previewResume
 * @see app/Http/Controllers/Employer/CandidatesController.php:208
 * @route '/employer/candidates/{application}/resumes/{resume}/preview'
 */
previewResume.url = (args: { application: string | number, resume: string | number } | [application: string | number, resume: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    application: args[0],
                    resume: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        application: args.application,
                                resume: args.resume,
                }

    return previewResume.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace('{resume}', parsedArgs.resume.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\CandidatesController::previewResume
 * @see app/Http/Controllers/Employer/CandidatesController.php:208
 * @route '/employer/candidates/{application}/resumes/{resume}/preview'
 */
previewResume.get = (args: { application: string | number, resume: string | number } | [application: string | number, resume: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: previewResume.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\CandidatesController::previewResume
 * @see app/Http/Controllers/Employer/CandidatesController.php:208
 * @route '/employer/candidates/{application}/resumes/{resume}/preview'
 */
previewResume.head = (args: { application: string | number, resume: string | number } | [application: string | number, resume: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: previewResume.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employer\CandidatesController::previewResume
 * @see app/Http/Controllers/Employer/CandidatesController.php:208
 * @route '/employer/candidates/{application}/resumes/{resume}/preview'
 */
    const previewResumeForm = (args: { application: string | number, resume: string | number } | [application: string | number, resume: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: previewResume.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employer\CandidatesController::previewResume
 * @see app/Http/Controllers/Employer/CandidatesController.php:208
 * @route '/employer/candidates/{application}/resumes/{resume}/preview'
 */
        previewResumeForm.get = (args: { application: string | number, resume: string | number } | [application: string | number, resume: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: previewResume.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employer\CandidatesController::previewResume
 * @see app/Http/Controllers/Employer/CandidatesController.php:208
 * @route '/employer/candidates/{application}/resumes/{resume}/preview'
 */
        previewResumeForm.head = (args: { application: string | number, resume: string | number } | [application: string | number, resume: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: previewResume.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    previewResume.form = previewResumeForm
const CandidatesController = { index, show, updateStatus, downloadResume, previewResume }

export default CandidatesController