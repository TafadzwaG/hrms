import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Employer\CompanyProfileController::edit
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:13
 * @route '/employer/company-profile'
 */
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/employer/company-profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\CompanyProfileController::edit
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:13
 * @route '/employer/company-profile'
 */
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\CompanyProfileController::edit
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:13
 * @route '/employer/company-profile'
 */
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\CompanyProfileController::edit
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:13
 * @route '/employer/company-profile'
 */
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employer\CompanyProfileController::edit
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:13
 * @route '/employer/company-profile'
 */
    const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employer\CompanyProfileController::edit
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:13
 * @route '/employer/company-profile'
 */
        editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employer\CompanyProfileController::edit
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:13
 * @route '/employer/company-profile'
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
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:27
 * @route '/employer/company-profile'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/employer/company-profile',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Employer\CompanyProfileController::update
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:27
 * @route '/employer/company-profile'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\CompanyProfileController::update
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:27
 * @route '/employer/company-profile'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Employer\CompanyProfileController::update
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:27
 * @route '/employer/company-profile'
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
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:27
 * @route '/employer/company-profile'
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
const CompanyProfileController = { edit, update }

export default CompanyProfileController