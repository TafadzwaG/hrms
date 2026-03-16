import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\SystemSettingsController::update
 * @see app/Http/Controllers/SystemSettingsController.php:342
 * @route '/system-settings/preferences'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/system-settings/preferences',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\SystemSettingsController::update
 * @see app/Http/Controllers/SystemSettingsController.php:342
 * @route '/system-settings/preferences'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SystemSettingsController::update
 * @see app/Http/Controllers/SystemSettingsController.php:342
 * @route '/system-settings/preferences'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\SystemSettingsController::update
 * @see app/Http/Controllers/SystemSettingsController.php:342
 * @route '/system-settings/preferences'
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
* @see \App\Http\Controllers\SystemSettingsController::update
 * @see app/Http/Controllers/SystemSettingsController.php:342
 * @route '/system-settings/preferences'
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
const preferences = {
    update: Object.assign(update, update),
}

export default preferences