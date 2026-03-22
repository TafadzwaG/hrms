import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import resume from './resume'
import status from './status'
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
const candidates = {
    show: Object.assign(show, show),
resume: Object.assign(resume, resume),
status: Object.assign(status, status),
}

export default candidates