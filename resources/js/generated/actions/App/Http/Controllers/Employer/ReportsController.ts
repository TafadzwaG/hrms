import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Employer\ReportsController::index
 * @see app/Http/Controllers/Employer/ReportsController.php:14
 * @route '/employer/reports'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/employer/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\ReportsController::index
 * @see app/Http/Controllers/Employer/ReportsController.php:14
 * @route '/employer/reports'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\ReportsController::index
 * @see app/Http/Controllers/Employer/ReportsController.php:14
 * @route '/employer/reports'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\ReportsController::index
 * @see app/Http/Controllers/Employer/ReportsController.php:14
 * @route '/employer/reports'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employer\ReportsController::index
 * @see app/Http/Controllers/Employer/ReportsController.php:14
 * @route '/employer/reports'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employer\ReportsController::index
 * @see app/Http/Controllers/Employer/ReportsController.php:14
 * @route '/employer/reports'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employer\ReportsController::index
 * @see app/Http/Controllers/Employer/ReportsController.php:14
 * @route '/employer/reports'
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
const ReportsController = { index }

export default ReportsController