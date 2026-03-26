import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Candidate\SettingsController::edit
 * @see app/Http/Controllers/Candidate/SettingsController.php:13
 * @route '/candidate/settings'
 */
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/candidate/settings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Candidate\SettingsController::edit
 * @see app/Http/Controllers/Candidate/SettingsController.php:13
 * @route '/candidate/settings'
 */
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\SettingsController::edit
 * @see app/Http/Controllers/Candidate/SettingsController.php:13
 * @route '/candidate/settings'
 */
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Candidate\SettingsController::edit
 * @see app/Http/Controllers/Candidate/SettingsController.php:13
 * @route '/candidate/settings'
 */
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Candidate\SettingsController::edit
 * @see app/Http/Controllers/Candidate/SettingsController.php:13
 * @route '/candidate/settings'
 */
    const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Candidate\SettingsController::edit
 * @see app/Http/Controllers/Candidate/SettingsController.php:13
 * @route '/candidate/settings'
 */
        editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Candidate\SettingsController::edit
 * @see app/Http/Controllers/Candidate/SettingsController.php:13
 * @route '/candidate/settings'
 */
        editForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
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
const SettingsController = { edit, update }

export default SettingsController