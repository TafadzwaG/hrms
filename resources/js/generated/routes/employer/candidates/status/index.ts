import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Employer\CandidatesController::update
 * @see app/Http/Controllers/Employer/CandidatesController.php:74
 * @route '/employer/applications/{application}/status'
 */
export const update = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/employer/applications/{application}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Employer\CandidatesController::update
 * @see app/Http/Controllers/Employer/CandidatesController.php:74
 * @route '/employer/applications/{application}/status'
 */
update.url = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\CandidatesController::update
 * @see app/Http/Controllers/Employer/CandidatesController.php:74
 * @route '/employer/applications/{application}/status'
 */
update.patch = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Employer\CandidatesController::update
 * @see app/Http/Controllers/Employer/CandidatesController.php:74
 * @route '/employer/applications/{application}/status'
 */
    const updateForm = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Employer\CandidatesController::update
 * @see app/Http/Controllers/Employer/CandidatesController.php:74
 * @route '/employer/applications/{application}/status'
 */
        updateForm.patch = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const status = {
    update: Object.assign(update, update),
}

export default status