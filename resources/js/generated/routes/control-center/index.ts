import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ControlCenterController::index
 * @see app/Http/Controllers/ControlCenterController.php:14
 * @route '/control-center'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/control-center',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ControlCenterController::index
 * @see app/Http/Controllers/ControlCenterController.php:14
 * @route '/control-center'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ControlCenterController::index
 * @see app/Http/Controllers/ControlCenterController.php:14
 * @route '/control-center'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ControlCenterController::index
 * @see app/Http/Controllers/ControlCenterController.php:14
 * @route '/control-center'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ControlCenterController::index
 * @see app/Http/Controllers/ControlCenterController.php:14
 * @route '/control-center'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ControlCenterController::index
 * @see app/Http/Controllers/ControlCenterController.php:14
 * @route '/control-center'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ControlCenterController::index
 * @see app/Http/Controllers/ControlCenterController.php:14
 * @route '/control-center'
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
const controlCenter = {
    index: Object.assign(index, index),
}

export default controlCenter