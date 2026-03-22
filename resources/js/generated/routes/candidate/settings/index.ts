import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Candidate\SettingsController::update
 * @see app/Http/Controllers/Candidate/SettingsController.php:28
 * @route '/candidate/settings'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/candidate/settings',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Candidate\SettingsController::update
 * @see app/Http/Controllers/Candidate/SettingsController.php:28
 * @route '/candidate/settings'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\SettingsController::update
 * @see app/Http/Controllers/Candidate/SettingsController.php:28
 * @route '/candidate/settings'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Candidate\SettingsController::update
 * @see app/Http/Controllers/Candidate/SettingsController.php:28
 * @route '/candidate/settings'
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
* @see \App\Http\Controllers\Candidate\SettingsController::update
 * @see app/Http/Controllers/Candidate/SettingsController.php:28
 * @route '/candidate/settings'
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
const settings = {
    update: Object.assign(update, update),
}

export default settings