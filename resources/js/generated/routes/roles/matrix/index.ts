import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
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
const matrix = {
    update: Object.assign(update, update),
}

export default matrix