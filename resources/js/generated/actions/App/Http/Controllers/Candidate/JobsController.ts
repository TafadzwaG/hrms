import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Candidate\JobsController::index
 * @see app/Http/Controllers/Candidate/JobsController.php:17
 * @route '/candidate/jobs'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/candidate/jobs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Candidate\JobsController::index
 * @see app/Http/Controllers/Candidate/JobsController.php:17
 * @route '/candidate/jobs'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\JobsController::index
 * @see app/Http/Controllers/Candidate/JobsController.php:17
 * @route '/candidate/jobs'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Candidate\JobsController::index
 * @see app/Http/Controllers/Candidate/JobsController.php:17
 * @route '/candidate/jobs'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Candidate\JobsController::index
 * @see app/Http/Controllers/Candidate/JobsController.php:17
 * @route '/candidate/jobs'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Candidate\JobsController::index
 * @see app/Http/Controllers/Candidate/JobsController.php:17
 * @route '/candidate/jobs'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Candidate\JobsController::index
 * @see app/Http/Controllers/Candidate/JobsController.php:17
 * @route '/candidate/jobs'
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
* @see \App\Http\Controllers\Candidate\JobsController::apply
 * @see app/Http/Controllers/Candidate/JobsController.php:80
 * @route '/candidate/jobs/{vacancy}/apply'
 */
export const apply = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: apply.url(args, options),
    method: 'post',
})

apply.definition = {
    methods: ["post"],
    url: '/candidate/jobs/{vacancy}/apply',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Candidate\JobsController::apply
 * @see app/Http/Controllers/Candidate/JobsController.php:80
 * @route '/candidate/jobs/{vacancy}/apply'
 */
apply.url = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vacancy: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    vacancy: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vacancy: args.vacancy,
                }

    return apply.definition.url
            .replace('{vacancy}', parsedArgs.vacancy.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\JobsController::apply
 * @see app/Http/Controllers/Candidate/JobsController.php:80
 * @route '/candidate/jobs/{vacancy}/apply'
 */
apply.post = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: apply.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Candidate\JobsController::apply
 * @see app/Http/Controllers/Candidate/JobsController.php:80
 * @route '/candidate/jobs/{vacancy}/apply'
 */
    const applyForm = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: apply.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Candidate\JobsController::apply
 * @see app/Http/Controllers/Candidate/JobsController.php:80
 * @route '/candidate/jobs/{vacancy}/apply'
 */
        applyForm.post = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: apply.url(args, options),
            method: 'post',
        })
    
    apply.form = applyForm
const JobsController = { index, apply }

export default JobsController