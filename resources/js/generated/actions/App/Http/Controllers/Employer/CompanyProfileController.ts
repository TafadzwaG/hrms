import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Employer\CompanyProfileController::edit
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:16
 * @route '/employer/company'
 */
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/employer/company',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\CompanyProfileController::edit
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:16
 * @route '/employer/company'
 */
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\CompanyProfileController::edit
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:16
 * @route '/employer/company'
 */
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\CompanyProfileController::edit
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:16
 * @route '/employer/company'
 */
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employer\CompanyProfileController::edit
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:16
 * @route '/employer/company'
 */
    const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employer\CompanyProfileController::edit
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:16
 * @route '/employer/company'
 */
        editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employer\CompanyProfileController::edit
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:16
 * @route '/employer/company'
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
* @see \App\Http\Controllers\Employer\CompanyProfileController::update
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:30
 * @route '/employer/company'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/employer/company',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Employer\CompanyProfileController::update
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:30
 * @route '/employer/company'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\CompanyProfileController::update
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:30
 * @route '/employer/company'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Employer\CompanyProfileController::update
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:30
 * @route '/employer/company'
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
* @see \App\Http\Controllers\Employer\CompanyProfileController::update
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:30
 * @route '/employer/company'
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
* @see \App\Http\Controllers\Employer\CompanyProfileController::updateLogo
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:46
 * @route '/employer/company/logo'
 */
export const updateLogo = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateLogo.url(options),
    method: 'post',
})

updateLogo.definition = {
    methods: ["post"],
    url: '/employer/company/logo',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Employer\CompanyProfileController::updateLogo
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:46
 * @route '/employer/company/logo'
 */
updateLogo.url = (options?: RouteQueryOptions) => {
    return updateLogo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\CompanyProfileController::updateLogo
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:46
 * @route '/employer/company/logo'
 */
updateLogo.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateLogo.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Employer\CompanyProfileController::updateLogo
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:46
 * @route '/employer/company/logo'
 */
    const updateLogoForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateLogo.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Employer\CompanyProfileController::updateLogo
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:46
 * @route '/employer/company/logo'
 */
        updateLogoForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateLogo.url(options),
            method: 'post',
        })
    
    updateLogo.form = updateLogoForm
/**
* @see \App\Http\Controllers\Employer\CompanyProfileController::destroyLogo
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:71
 * @route '/employer/company/logo'
 */
export const destroyLogo = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyLogo.url(options),
    method: 'delete',
})

destroyLogo.definition = {
    methods: ["delete"],
    url: '/employer/company/logo',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Employer\CompanyProfileController::destroyLogo
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:71
 * @route '/employer/company/logo'
 */
destroyLogo.url = (options?: RouteQueryOptions) => {
    return destroyLogo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\CompanyProfileController::destroyLogo
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:71
 * @route '/employer/company/logo'
 */
destroyLogo.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyLogo.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Employer\CompanyProfileController::destroyLogo
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:71
 * @route '/employer/company/logo'
 */
    const destroyLogoForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyLogo.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Employer\CompanyProfileController::destroyLogo
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:71
 * @route '/employer/company/logo'
 */
        destroyLogoForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyLogo.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyLogo.form = destroyLogoForm
const CompanyProfileController = { edit, update, updateLogo, destroyLogo }

export default CompanyProfileController