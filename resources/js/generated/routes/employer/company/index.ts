import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import logo from './logo'
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
const company = {
    update: Object.assign(update, update),
logo: Object.assign(logo, logo),
}

export default company