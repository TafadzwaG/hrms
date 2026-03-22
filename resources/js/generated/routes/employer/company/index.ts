import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
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
const company = {
    update: Object.assign(update, update),
}

export default company