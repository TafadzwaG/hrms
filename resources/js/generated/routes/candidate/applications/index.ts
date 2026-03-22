import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Candidate\ApplicationsController::withdraw
 * @see app/Http/Controllers/Candidate/ApplicationsController.php:50
 * @route '/candidate/applications/{application}/withdraw'
 */
export const withdraw = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: withdraw.url(args, options),
    method: 'patch',
})

withdraw.definition = {
    methods: ["patch"],
    url: '/candidate/applications/{application}/withdraw',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Candidate\ApplicationsController::withdraw
 * @see app/Http/Controllers/Candidate/ApplicationsController.php:50
 * @route '/candidate/applications/{application}/withdraw'
 */
withdraw.url = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return withdraw.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\ApplicationsController::withdraw
 * @see app/Http/Controllers/Candidate/ApplicationsController.php:50
 * @route '/candidate/applications/{application}/withdraw'
 */
withdraw.patch = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: withdraw.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Candidate\ApplicationsController::withdraw
 * @see app/Http/Controllers/Candidate/ApplicationsController.php:50
 * @route '/candidate/applications/{application}/withdraw'
 */
    const withdrawForm = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: withdraw.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Candidate\ApplicationsController::withdraw
 * @see app/Http/Controllers/Candidate/ApplicationsController.php:50
 * @route '/candidate/applications/{application}/withdraw'
 */
        withdrawForm.patch = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: withdraw.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    withdraw.form = withdrawForm
const applications = {
    withdraw: Object.assign(withdraw, withdraw),
}

export default applications