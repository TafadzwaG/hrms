import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Candidate\JobsController::apply
 * @see app/Http/Controllers/Candidate/JobsController.php:86
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
 * @see app/Http/Controllers/Candidate/JobsController.php:86
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
 * @see app/Http/Controllers/Candidate/JobsController.php:86
 * @route '/candidate/jobs/{vacancy}/apply'
 */
apply.post = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: apply.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Candidate\JobsController::apply
 * @see app/Http/Controllers/Candidate/JobsController.php:86
 * @route '/candidate/jobs/{vacancy}/apply'
 */
    const applyForm = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: apply.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Candidate\JobsController::apply
 * @see app/Http/Controllers/Candidate/JobsController.php:86
 * @route '/candidate/jobs/{vacancy}/apply'
 */
        applyForm.post = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: apply.url(args, options),
            method: 'post',
        })
    
    apply.form = applyForm
const jobs = {
    apply: Object.assign(apply, apply),
}

export default jobs