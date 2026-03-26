import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Candidate\InterviewsController::respond
 * @see app/Http/Controllers/Candidate/InterviewsController.php:11
 * @route '/candidate/interviews/{interview}/respond'
 */
export const respond = (args: { interview: string | number } | [interview: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: respond.url(args, options),
    method: 'patch',
})

respond.definition = {
    methods: ["patch"],
    url: '/candidate/interviews/{interview}/respond',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Candidate\InterviewsController::respond
 * @see app/Http/Controllers/Candidate/InterviewsController.php:11
 * @route '/candidate/interviews/{interview}/respond'
 */
respond.url = (args: { interview: string | number } | [interview: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { interview: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    interview: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        interview: args.interview,
                }

    return respond.definition.url
            .replace('{interview}', parsedArgs.interview.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\InterviewsController::respond
 * @see app/Http/Controllers/Candidate/InterviewsController.php:11
 * @route '/candidate/interviews/{interview}/respond'
 */
respond.patch = (args: { interview: string | number } | [interview: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: respond.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Candidate\InterviewsController::respond
 * @see app/Http/Controllers/Candidate/InterviewsController.php:11
 * @route '/candidate/interviews/{interview}/respond'
 */
    const respondForm = (args: { interview: string | number } | [interview: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: respond.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Candidate\InterviewsController::respond
 * @see app/Http/Controllers/Candidate/InterviewsController.php:11
 * @route '/candidate/interviews/{interview}/respond'
 */
        respondForm.patch = (args: { interview: string | number } | [interview: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: respond.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    respond.form = respondForm
const interviews = {
    respond: Object.assign(respond, respond),
}

export default interviews