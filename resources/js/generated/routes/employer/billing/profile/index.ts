import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Employer\BillingController::update
 * @see app/Http/Controllers/Employer/BillingController.php:46
 * @route '/employer/billing/profile'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/employer/billing/profile',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Employer\BillingController::update
 * @see app/Http/Controllers/Employer/BillingController.php:46
 * @route '/employer/billing/profile'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\BillingController::update
 * @see app/Http/Controllers/Employer/BillingController.php:46
 * @route '/employer/billing/profile'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Employer\BillingController::update
 * @see app/Http/Controllers/Employer/BillingController.php:46
 * @route '/employer/billing/profile'
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
* @see \App\Http\Controllers\Employer\BillingController::update
 * @see app/Http/Controllers/Employer/BillingController.php:46
 * @route '/employer/billing/profile'
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
const profile = {
    update: Object.assign(update, update),
}

export default profile