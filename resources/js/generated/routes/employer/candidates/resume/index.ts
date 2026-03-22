import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Employer\CandidatesController::preview
 * @see app/Http/Controllers/Employer/CandidatesController.php:208
 * @route '/employer/candidates/{application}/resumes/{resume}/preview'
 */
export const preview = (args: { application: string | number, resume: string | number } | [application: string | number, resume: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

preview.definition = {
    methods: ["get","head"],
    url: '/employer/candidates/{application}/resumes/{resume}/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\CandidatesController::preview
 * @see app/Http/Controllers/Employer/CandidatesController.php:208
 * @route '/employer/candidates/{application}/resumes/{resume}/preview'
 */
preview.url = (args: { application: string | number, resume: string | number } | [application: string | number, resume: string | number ], options?: RouteQueryOptions) => {
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

    return preview.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace('{resume}', parsedArgs.resume.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\CandidatesController::preview
 * @see app/Http/Controllers/Employer/CandidatesController.php:208
 * @route '/employer/candidates/{application}/resumes/{resume}/preview'
 */
preview.get = (args: { application: string | number, resume: string | number } | [application: string | number, resume: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\CandidatesController::preview
 * @see app/Http/Controllers/Employer/CandidatesController.php:208
 * @route '/employer/candidates/{application}/resumes/{resume}/preview'
 */
preview.head = (args: { application: string | number, resume: string | number } | [application: string | number, resume: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employer\CandidatesController::preview
 * @see app/Http/Controllers/Employer/CandidatesController.php:208
 * @route '/employer/candidates/{application}/resumes/{resume}/preview'
 */
    const previewForm = (args: { application: string | number, resume: string | number } | [application: string | number, resume: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: preview.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employer\CandidatesController::preview
 * @see app/Http/Controllers/Employer/CandidatesController.php:208
 * @route '/employer/candidates/{application}/resumes/{resume}/preview'
 */
        previewForm.get = (args: { application: string | number, resume: string | number } | [application: string | number, resume: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employer\CandidatesController::preview
 * @see app/Http/Controllers/Employer/CandidatesController.php:208
 * @route '/employer/candidates/{application}/resumes/{resume}/preview'
 */
        previewForm.head = (args: { application: string | number, resume: string | number } | [application: string | number, resume: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    preview.form = previewForm
/**
* @see \App\Http\Controllers\Employer\CandidatesController::download
 * @see app/Http/Controllers/Employer/CandidatesController.php:176
 * @route '/employer/candidates/{application}/resumes/{resume}/download'
 */
export const download = (args: { application: string | number, resume: string | number } | [application: string | number, resume: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/employer/candidates/{application}/resumes/{resume}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\CandidatesController::download
 * @see app/Http/Controllers/Employer/CandidatesController.php:176
 * @route '/employer/candidates/{application}/resumes/{resume}/download'
 */
download.url = (args: { application: string | number, resume: string | number } | [application: string | number, resume: string | number ], options?: RouteQueryOptions) => {
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

    return download.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace('{resume}', parsedArgs.resume.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\CandidatesController::download
 * @see app/Http/Controllers/Employer/CandidatesController.php:176
 * @route '/employer/candidates/{application}/resumes/{resume}/download'
 */
download.get = (args: { application: string | number, resume: string | number } | [application: string | number, resume: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\CandidatesController::download
 * @see app/Http/Controllers/Employer/CandidatesController.php:176
 * @route '/employer/candidates/{application}/resumes/{resume}/download'
 */
download.head = (args: { application: string | number, resume: string | number } | [application: string | number, resume: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employer\CandidatesController::download
 * @see app/Http/Controllers/Employer/CandidatesController.php:176
 * @route '/employer/candidates/{application}/resumes/{resume}/download'
 */
    const downloadForm = (args: { application: string | number, resume: string | number } | [application: string | number, resume: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employer\CandidatesController::download
 * @see app/Http/Controllers/Employer/CandidatesController.php:176
 * @route '/employer/candidates/{application}/resumes/{resume}/download'
 */
        downloadForm.get = (args: { application: string | number, resume: string | number } | [application: string | number, resume: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employer\CandidatesController::download
 * @see app/Http/Controllers/Employer/CandidatesController.php:176
 * @route '/employer/candidates/{application}/resumes/{resume}/download'
 */
        downloadForm.head = (args: { application: string | number, resume: string | number } | [application: string | number, resume: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    download.form = downloadForm
const resume = {
    preview: Object.assign(preview, preview),
download: Object.assign(download, download),
}

export default resume