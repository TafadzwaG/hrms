import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import theme from './theme'
/**
* @see \App\Http\Controllers\SystemSettingsController::systemLogo
 * @see app/Http/Controllers/SystemSettingsController.php:262
 * @route '/system-settings/branding/system-logo'
 */
export const systemLogo = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: systemLogo.url(options),
    method: 'post',
})

systemLogo.definition = {
    methods: ["post"],
    url: '/system-settings/branding/system-logo',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SystemSettingsController::systemLogo
 * @see app/Http/Controllers/SystemSettingsController.php:262
 * @route '/system-settings/branding/system-logo'
 */
systemLogo.url = (options?: RouteQueryOptions) => {
    return systemLogo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SystemSettingsController::systemLogo
 * @see app/Http/Controllers/SystemSettingsController.php:262
 * @route '/system-settings/branding/system-logo'
 */
systemLogo.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: systemLogo.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SystemSettingsController::systemLogo
 * @see app/Http/Controllers/SystemSettingsController.php:262
 * @route '/system-settings/branding/system-logo'
 */
    const systemLogoForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: systemLogo.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SystemSettingsController::systemLogo
 * @see app/Http/Controllers/SystemSettingsController.php:262
 * @route '/system-settings/branding/system-logo'
 */
        systemLogoForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: systemLogo.url(options),
            method: 'post',
        })
    
    systemLogo.form = systemLogoForm
/**
* @see \App\Http\Controllers\SystemSettingsController::companyLogo
 * @see app/Http/Controllers/SystemSettingsController.php:299
 * @route '/system-settings/branding/company-logo'
 */
export const companyLogo = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: companyLogo.url(options),
    method: 'post',
})

companyLogo.definition = {
    methods: ["post"],
    url: '/system-settings/branding/company-logo',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SystemSettingsController::companyLogo
 * @see app/Http/Controllers/SystemSettingsController.php:299
 * @route '/system-settings/branding/company-logo'
 */
companyLogo.url = (options?: RouteQueryOptions) => {
    return companyLogo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SystemSettingsController::companyLogo
 * @see app/Http/Controllers/SystemSettingsController.php:299
 * @route '/system-settings/branding/company-logo'
 */
companyLogo.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: companyLogo.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SystemSettingsController::companyLogo
 * @see app/Http/Controllers/SystemSettingsController.php:299
 * @route '/system-settings/branding/company-logo'
 */
    const companyLogoForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: companyLogo.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SystemSettingsController::companyLogo
 * @see app/Http/Controllers/SystemSettingsController.php:299
 * @route '/system-settings/branding/company-logo'
 */
        companyLogoForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: companyLogo.url(options),
            method: 'post',
        })
    
    companyLogo.form = companyLogoForm
const branding = {
    systemLogo: Object.assign(systemLogo, systemLogo),
companyLogo: Object.assign(companyLogo, companyLogo),
theme: Object.assign(theme, theme),
}

export default branding