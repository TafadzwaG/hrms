import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PermissionMatrixController::index
 * @see app/Http/Controllers/PermissionMatrixController.php:19
 * @route '/roles/matrix'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/roles/matrix',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PermissionMatrixController::index
 * @see app/Http/Controllers/PermissionMatrixController.php:19
 * @route '/roles/matrix'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionMatrixController::index
 * @see app/Http/Controllers/PermissionMatrixController.php:19
 * @route '/roles/matrix'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PermissionMatrixController::index
 * @see app/Http/Controllers/PermissionMatrixController.php:19
 * @route '/roles/matrix'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PermissionMatrixController::index
 * @see app/Http/Controllers/PermissionMatrixController.php:19
 * @route '/roles/matrix'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PermissionMatrixController::index
 * @see app/Http/Controllers/PermissionMatrixController.php:19
 * @route '/roles/matrix'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PermissionMatrixController::index
 * @see app/Http/Controllers/PermissionMatrixController.php:19
 * @route '/roles/matrix'
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
* @see \App\Http\Controllers\PermissionMatrixController::update
 * @see app/Http/Controllers/PermissionMatrixController.php:53
 * @route '/roles/matrix'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/roles/matrix',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PermissionMatrixController::update
 * @see app/Http/Controllers/PermissionMatrixController.php:53
 * @route '/roles/matrix'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionMatrixController::update
 * @see app/Http/Controllers/PermissionMatrixController.php:53
 * @route '/roles/matrix'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\PermissionMatrixController::update
 * @see app/Http/Controllers/PermissionMatrixController.php:53
 * @route '/roles/matrix'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PermissionMatrixController::update
 * @see app/Http/Controllers/PermissionMatrixController.php:53
 * @route '/roles/matrix'
 */
        updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const PermissionMatrixController = { index, update }

export default PermissionMatrixController