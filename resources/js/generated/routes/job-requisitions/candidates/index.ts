import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/job-requisitions/{jobRequisition}/candidates/create'
 */
export const create = (args: { jobRequisition: string | number } | [jobRequisition: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/job-requisitions/{jobRequisition}/candidates/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/job-requisitions/{jobRequisition}/candidates/create'
 */
create.url = (args: { jobRequisition: string | number } | [jobRequisition: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { jobRequisition: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    jobRequisition: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        jobRequisition: args.jobRequisition,
                }

    return create.definition.url
            .replace('{jobRequisition}', parsedArgs.jobRequisition.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/job-requisitions/{jobRequisition}/candidates/create'
 */
create.get = (args: { jobRequisition: string | number } | [jobRequisition: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/job-requisitions/{jobRequisition}/candidates/create'
 */
create.head = (args: { jobRequisition: string | number } | [jobRequisition: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/job-requisitions/{jobRequisition}/candidates/create'
 */
    const createForm = (args: { jobRequisition: string | number } | [jobRequisition: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/job-requisitions/{jobRequisition}/candidates/create'
 */
        createForm.get = (args: { jobRequisition: string | number } | [jobRequisition: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/job-requisitions/{jobRequisition}/candidates/create'
 */
        createForm.head = (args: { jobRequisition: string | number } | [jobRequisition: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
const candidates = {
    create: Object.assign(create, create),
}

export default candidates