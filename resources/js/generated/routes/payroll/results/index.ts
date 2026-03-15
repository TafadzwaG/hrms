import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PayrollResultController::index
 * @see app/Http/Controllers/PayrollResultController.php:14
 * @route '/payroll/results'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/payroll/results',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollResultController::index
 * @see app/Http/Controllers/PayrollResultController.php:14
 * @route '/payroll/results'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollResultController::index
 * @see app/Http/Controllers/PayrollResultController.php:14
 * @route '/payroll/results'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollResultController::index
 * @see app/Http/Controllers/PayrollResultController.php:14
 * @route '/payroll/results'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollResultController::index
 * @see app/Http/Controllers/PayrollResultController.php:14
 * @route '/payroll/results'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollResultController::index
 * @see app/Http/Controllers/PayrollResultController.php:14
 * @route '/payroll/results'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollResultController::index
 * @see app/Http/Controllers/PayrollResultController.php:14
 * @route '/payroll/results'
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
const results = {
    index: Object.assign(index, index),
}

export default results