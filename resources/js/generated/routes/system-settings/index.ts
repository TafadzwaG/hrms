import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import general from './general'
import branding from './branding'
import preferences from './preferences'
import backups from './backups'
/**
* @see \App\Http\Controllers\SystemSettingsController::index
 * @see app/Http/Controllers/SystemSettingsController.php:21
 * @route '/system-settings'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/system-settings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SystemSettingsController::index
 * @see app/Http/Controllers/SystemSettingsController.php:21
 * @route '/system-settings'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SystemSettingsController::index
 * @see app/Http/Controllers/SystemSettingsController.php:21
 * @route '/system-settings'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SystemSettingsController::index
 * @see app/Http/Controllers/SystemSettingsController.php:21
 * @route '/system-settings'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SystemSettingsController::index
 * @see app/Http/Controllers/SystemSettingsController.php:21
 * @route '/system-settings'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SystemSettingsController::index
 * @see app/Http/Controllers/SystemSettingsController.php:21
 * @route '/system-settings'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SystemSettingsController::index
 * @see app/Http/Controllers/SystemSettingsController.php:21
 * @route '/system-settings'
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
const systemSettings = {
    index: Object.assign(index, index),
general: Object.assign(general, general),
branding: Object.assign(branding, branding),
preferences: Object.assign(preferences, preferences),
backups: Object.assign(backups, backups),
}

export default systemSettings