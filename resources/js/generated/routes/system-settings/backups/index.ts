import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\SystemSettingsController::update
 * @see app/Http/Controllers/SystemSettingsController.php:406
 * @route '/system-settings/backups'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/system-settings/backups',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\SystemSettingsController::update
 * @see app/Http/Controllers/SystemSettingsController.php:406
 * @route '/system-settings/backups'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SystemSettingsController::update
 * @see app/Http/Controllers/SystemSettingsController.php:406
 * @route '/system-settings/backups'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\SystemSettingsController::update
 * @see app/Http/Controllers/SystemSettingsController.php:406
 * @route '/system-settings/backups'
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
 * @see app/Http/Controllers/SystemSettingsController.php:406
 * @route '/system-settings/backups'
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
/**
* @see \App\Http\Controllers\SystemSettingsController::run
 * @see app/Http/Controllers/SystemSettingsController.php:501
 * @route '/system-settings/backups/run'
 */
export const run = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: run.url(options),
    method: 'post',
})

run.definition = {
    methods: ["post"],
    url: '/system-settings/backups/run',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SystemSettingsController::run
 * @see app/Http/Controllers/SystemSettingsController.php:501
 * @route '/system-settings/backups/run'
 */
run.url = (options?: RouteQueryOptions) => {
    return run.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SystemSettingsController::run
 * @see app/Http/Controllers/SystemSettingsController.php:501
 * @route '/system-settings/backups/run'
 */
run.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: run.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SystemSettingsController::run
 * @see app/Http/Controllers/SystemSettingsController.php:501
 * @route '/system-settings/backups/run'
 */
    const runForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: run.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SystemSettingsController::run
 * @see app/Http/Controllers/SystemSettingsController.php:501
 * @route '/system-settings/backups/run'
 */
        runForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: run.url(options),
            method: 'post',
        })
    
    run.form = runForm
/**
* @see \App\Http\Controllers\SystemSettingsController::download
 * @see app/Http/Controllers/SystemSettingsController.php:525
 * @route '/system-settings/backups/download/{file}'
 */
export const download = (args: { file: string | number } | [file: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/system-settings/backups/download/{file}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SystemSettingsController::download
 * @see app/Http/Controllers/SystemSettingsController.php:525
 * @route '/system-settings/backups/download/{file}'
 */
download.url = (args: { file: string | number } | [file: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { file: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    file: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        file: args.file,
                }

    return download.definition.url
            .replace('{file}', parsedArgs.file.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SystemSettingsController::download
 * @see app/Http/Controllers/SystemSettingsController.php:525
 * @route '/system-settings/backups/download/{file}'
 */
download.get = (args: { file: string | number } | [file: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SystemSettingsController::download
 * @see app/Http/Controllers/SystemSettingsController.php:525
 * @route '/system-settings/backups/download/{file}'
 */
download.head = (args: { file: string | number } | [file: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SystemSettingsController::download
 * @see app/Http/Controllers/SystemSettingsController.php:525
 * @route '/system-settings/backups/download/{file}'
 */
    const downloadForm = (args: { file: string | number } | [file: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SystemSettingsController::download
 * @see app/Http/Controllers/SystemSettingsController.php:525
 * @route '/system-settings/backups/download/{file}'
 */
        downloadForm.get = (args: { file: string | number } | [file: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SystemSettingsController::download
 * @see app/Http/Controllers/SystemSettingsController.php:525
 * @route '/system-settings/backups/download/{file}'
 */
        downloadForm.head = (args: { file: string | number } | [file: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    download.form = downloadForm
const backups = {
    update: Object.assign(update, update),
run: Object.assign(run, run),
download: Object.assign(download, download),
}

export default backups