import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Candidate\ApplicationsController::index
 * @see app/Http/Controllers/Candidate/ApplicationsController.php:13
 * @route '/candidate/applications'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/candidate/applications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Candidate\ApplicationsController::index
 * @see app/Http/Controllers/Candidate/ApplicationsController.php:13
 * @route '/candidate/applications'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\ApplicationsController::index
 * @see app/Http/Controllers/Candidate/ApplicationsController.php:13
 * @route '/candidate/applications'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Candidate\ApplicationsController::index
 * @see app/Http/Controllers/Candidate/ApplicationsController.php:13
 * @route '/candidate/applications'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Candidate\ApplicationsController::index
 * @see app/Http/Controllers/Candidate/ApplicationsController.php:13
 * @route '/candidate/applications'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Candidate\ApplicationsController::index
 * @see app/Http/Controllers/Candidate/ApplicationsController.php:13
 * @route '/candidate/applications'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Candidate\ApplicationsController::index
 * @see app/Http/Controllers/Candidate/ApplicationsController.php:13
 * @route '/candidate/applications'
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
const ApplicationsController = { index }

export default ApplicationsController