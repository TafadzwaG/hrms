import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
/**
* @see \App\Http\Controllers\SystemSettingsController::updateGeneral
 * @see app/Http/Controllers/SystemSettingsController.php:109
 * @route '/system-settings/general'
 */
export const updateGeneral = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateGeneral.url(options),
    method: 'put',
})

updateGeneral.definition = {
    methods: ["put"],
    url: '/system-settings/general',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\SystemSettingsController::updateGeneral
 * @see app/Http/Controllers/SystemSettingsController.php:109
 * @route '/system-settings/general'
 */
updateGeneral.url = (options?: RouteQueryOptions) => {
    return updateGeneral.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SystemSettingsController::updateGeneral
 * @see app/Http/Controllers/SystemSettingsController.php:109
 * @route '/system-settings/general'
 */
updateGeneral.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateGeneral.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\SystemSettingsController::updateGeneral
 * @see app/Http/Controllers/SystemSettingsController.php:109
 * @route '/system-settings/general'
 */
    const updateGeneralForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateGeneral.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SystemSettingsController::updateGeneral
 * @see app/Http/Controllers/SystemSettingsController.php:109
 * @route '/system-settings/general'
 */
        updateGeneralForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateGeneral.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateGeneral.form = updateGeneralForm
/**
* @see \App\Http\Controllers\SystemSettingsController::uploadSystemLogo
 * @see app/Http/Controllers/SystemSettingsController.php:262
 * @route '/system-settings/branding/system-logo'
 */
export const uploadSystemLogo = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadSystemLogo.url(options),
    method: 'post',
})

uploadSystemLogo.definition = {
    methods: ["post"],
    url: '/system-settings/branding/system-logo',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SystemSettingsController::uploadSystemLogo
 * @see app/Http/Controllers/SystemSettingsController.php:262
 * @route '/system-settings/branding/system-logo'
 */
uploadSystemLogo.url = (options?: RouteQueryOptions) => {
    return uploadSystemLogo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SystemSettingsController::uploadSystemLogo
 * @see app/Http/Controllers/SystemSettingsController.php:262
 * @route '/system-settings/branding/system-logo'
 */
uploadSystemLogo.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadSystemLogo.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SystemSettingsController::uploadSystemLogo
 * @see app/Http/Controllers/SystemSettingsController.php:262
 * @route '/system-settings/branding/system-logo'
 */
    const uploadSystemLogoForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: uploadSystemLogo.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SystemSettingsController::uploadSystemLogo
 * @see app/Http/Controllers/SystemSettingsController.php:262
 * @route '/system-settings/branding/system-logo'
 */
        uploadSystemLogoForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: uploadSystemLogo.url(options),
            method: 'post',
        })
    
    uploadSystemLogo.form = uploadSystemLogoForm
/**
* @see \App\Http\Controllers\SystemSettingsController::uploadCompanyLogo
 * @see app/Http/Controllers/SystemSettingsController.php:299
 * @route '/system-settings/branding/company-logo'
 */
export const uploadCompanyLogo = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadCompanyLogo.url(options),
    method: 'post',
})

uploadCompanyLogo.definition = {
    methods: ["post"],
    url: '/system-settings/branding/company-logo',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SystemSettingsController::uploadCompanyLogo
 * @see app/Http/Controllers/SystemSettingsController.php:299
 * @route '/system-settings/branding/company-logo'
 */
uploadCompanyLogo.url = (options?: RouteQueryOptions) => {
    return uploadCompanyLogo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SystemSettingsController::uploadCompanyLogo
 * @see app/Http/Controllers/SystemSettingsController.php:299
 * @route '/system-settings/branding/company-logo'
 */
uploadCompanyLogo.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadCompanyLogo.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SystemSettingsController::uploadCompanyLogo
 * @see app/Http/Controllers/SystemSettingsController.php:299
 * @route '/system-settings/branding/company-logo'
 */
    const uploadCompanyLogoForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: uploadCompanyLogo.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SystemSettingsController::uploadCompanyLogo
 * @see app/Http/Controllers/SystemSettingsController.php:299
 * @route '/system-settings/branding/company-logo'
 */
        uploadCompanyLogoForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: uploadCompanyLogo.url(options),
            method: 'post',
        })
    
    uploadCompanyLogo.form = uploadCompanyLogoForm
/**
* @see \App\Http\Controllers\SystemSettingsController::updateTheme
 * @see app/Http/Controllers/SystemSettingsController.php:212
 * @route '/system-settings/branding/theme'
 */
export const updateTheme = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateTheme.url(options),
    method: 'put',
})

updateTheme.definition = {
    methods: ["put"],
    url: '/system-settings/branding/theme',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\SystemSettingsController::updateTheme
 * @see app/Http/Controllers/SystemSettingsController.php:212
 * @route '/system-settings/branding/theme'
 */
updateTheme.url = (options?: RouteQueryOptions) => {
    return updateTheme.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SystemSettingsController::updateTheme
 * @see app/Http/Controllers/SystemSettingsController.php:212
 * @route '/system-settings/branding/theme'
 */
updateTheme.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateTheme.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\SystemSettingsController::updateTheme
 * @see app/Http/Controllers/SystemSettingsController.php:212
 * @route '/system-settings/branding/theme'
 */
    const updateThemeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateTheme.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SystemSettingsController::updateTheme
 * @see app/Http/Controllers/SystemSettingsController.php:212
 * @route '/system-settings/branding/theme'
 */
        updateThemeForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateTheme.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateTheme.form = updateThemeForm
/**
* @see \App\Http\Controllers\SystemSettingsController::updatePreferences
 * @see app/Http/Controllers/SystemSettingsController.php:342
 * @route '/system-settings/preferences'
 */
export const updatePreferences = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatePreferences.url(options),
    method: 'put',
})

updatePreferences.definition = {
    methods: ["put"],
    url: '/system-settings/preferences',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\SystemSettingsController::updatePreferences
 * @see app/Http/Controllers/SystemSettingsController.php:342
 * @route '/system-settings/preferences'
 */
updatePreferences.url = (options?: RouteQueryOptions) => {
    return updatePreferences.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SystemSettingsController::updatePreferences
 * @see app/Http/Controllers/SystemSettingsController.php:342
 * @route '/system-settings/preferences'
 */
updatePreferences.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatePreferences.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\SystemSettingsController::updatePreferences
 * @see app/Http/Controllers/SystemSettingsController.php:342
 * @route '/system-settings/preferences'
 */
    const updatePreferencesForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updatePreferences.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SystemSettingsController::updatePreferences
 * @see app/Http/Controllers/SystemSettingsController.php:342
 * @route '/system-settings/preferences'
 */
        updatePreferencesForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updatePreferences.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updatePreferences.form = updatePreferencesForm
/**
* @see \App\Http\Controllers\SystemSettingsController::updateBackups
 * @see app/Http/Controllers/SystemSettingsController.php:404
 * @route '/system-settings/backups'
 */
export const updateBackups = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateBackups.url(options),
    method: 'put',
})

updateBackups.definition = {
    methods: ["put"],
    url: '/system-settings/backups',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\SystemSettingsController::updateBackups
 * @see app/Http/Controllers/SystemSettingsController.php:404
 * @route '/system-settings/backups'
 */
updateBackups.url = (options?: RouteQueryOptions) => {
    return updateBackups.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SystemSettingsController::updateBackups
 * @see app/Http/Controllers/SystemSettingsController.php:404
 * @route '/system-settings/backups'
 */
updateBackups.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateBackups.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\SystemSettingsController::updateBackups
 * @see app/Http/Controllers/SystemSettingsController.php:404
 * @route '/system-settings/backups'
 */
    const updateBackupsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateBackups.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SystemSettingsController::updateBackups
 * @see app/Http/Controllers/SystemSettingsController.php:404
 * @route '/system-settings/backups'
 */
        updateBackupsForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateBackups.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateBackups.form = updateBackupsForm
/**
* @see \App\Http\Controllers\SystemSettingsController::runBackup
 * @see app/Http/Controllers/SystemSettingsController.php:499
 * @route '/system-settings/backups/run'
 */
export const runBackup = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: runBackup.url(options),
    method: 'post',
})

runBackup.definition = {
    methods: ["post"],
    url: '/system-settings/backups/run',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SystemSettingsController::runBackup
 * @see app/Http/Controllers/SystemSettingsController.php:499
 * @route '/system-settings/backups/run'
 */
runBackup.url = (options?: RouteQueryOptions) => {
    return runBackup.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SystemSettingsController::runBackup
 * @see app/Http/Controllers/SystemSettingsController.php:499
 * @route '/system-settings/backups/run'
 */
runBackup.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: runBackup.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SystemSettingsController::runBackup
 * @see app/Http/Controllers/SystemSettingsController.php:499
 * @route '/system-settings/backups/run'
 */
    const runBackupForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: runBackup.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SystemSettingsController::runBackup
 * @see app/Http/Controllers/SystemSettingsController.php:499
 * @route '/system-settings/backups/run'
 */
        runBackupForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: runBackup.url(options),
            method: 'post',
        })
    
    runBackup.form = runBackupForm
/**
* @see \App\Http\Controllers\SystemSettingsController::downloadBackup
 * @see app/Http/Controllers/SystemSettingsController.php:523
 * @route '/system-settings/backups/download/{file}'
 */
export const downloadBackup = (args: { file: string | number } | [file: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadBackup.url(args, options),
    method: 'get',
})

downloadBackup.definition = {
    methods: ["get","head"],
    url: '/system-settings/backups/download/{file}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SystemSettingsController::downloadBackup
 * @see app/Http/Controllers/SystemSettingsController.php:523
 * @route '/system-settings/backups/download/{file}'
 */
downloadBackup.url = (args: { file: string | number } | [file: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return downloadBackup.definition.url
            .replace('{file}', parsedArgs.file.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SystemSettingsController::downloadBackup
 * @see app/Http/Controllers/SystemSettingsController.php:523
 * @route '/system-settings/backups/download/{file}'
 */
downloadBackup.get = (args: { file: string | number } | [file: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadBackup.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SystemSettingsController::downloadBackup
 * @see app/Http/Controllers/SystemSettingsController.php:523
 * @route '/system-settings/backups/download/{file}'
 */
downloadBackup.head = (args: { file: string | number } | [file: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadBackup.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SystemSettingsController::downloadBackup
 * @see app/Http/Controllers/SystemSettingsController.php:523
 * @route '/system-settings/backups/download/{file}'
 */
    const downloadBackupForm = (args: { file: string | number } | [file: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadBackup.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SystemSettingsController::downloadBackup
 * @see app/Http/Controllers/SystemSettingsController.php:523
 * @route '/system-settings/backups/download/{file}'
 */
        downloadBackupForm.get = (args: { file: string | number } | [file: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadBackup.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SystemSettingsController::downloadBackup
 * @see app/Http/Controllers/SystemSettingsController.php:523
 * @route '/system-settings/backups/download/{file}'
 */
        downloadBackupForm.head = (args: { file: string | number } | [file: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadBackup.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadBackup.form = downloadBackupForm
const SystemSettingsController = { index, updateGeneral, uploadSystemLogo, uploadCompanyLogo, updateTheme, updatePreferences, updateBackups, runBackup, downloadBackup }

export default SystemSettingsController