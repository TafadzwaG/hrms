import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Employer\CompanyProfileController::update
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:46
 * @route '/employer/company/logo'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/employer/company/logo',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Employer\CompanyProfileController::update
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:46
 * @route '/employer/company/logo'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\CompanyProfileController::update
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:46
 * @route '/employer/company/logo'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Employer\CompanyProfileController::update
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:46
 * @route '/employer/company/logo'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Employer\CompanyProfileController::update
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:46
 * @route '/employer/company/logo'
 */
        updateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(options),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Employer\CompanyProfileController::destroy
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:71
 * @route '/employer/company/logo'
 */
export const destroy = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/employer/company/logo',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Employer\CompanyProfileController::destroy
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:71
 * @route '/employer/company/logo'
 */
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\CompanyProfileController::destroy
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:71
 * @route '/employer/company/logo'
 */
destroy.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Employer\CompanyProfileController::destroy
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:71
 * @route '/employer/company/logo'
 */
    const destroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Employer\CompanyProfileController::destroy
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:71
 * @route '/employer/company/logo'
 */
        destroyForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const logo = {
    update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default logo