import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Employer\BillingController::update
 * @see app/Http/Controllers/Employer/BillingController.php:62
 * @route '/employer/billing/subscription'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/employer/billing/subscription',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Employer\BillingController::update
 * @see app/Http/Controllers/Employer/BillingController.php:62
 * @route '/employer/billing/subscription'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\BillingController::update
 * @see app/Http/Controllers/Employer/BillingController.php:62
 * @route '/employer/billing/subscription'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Employer\BillingController::update
 * @see app/Http/Controllers/Employer/BillingController.php:62
 * @route '/employer/billing/subscription'
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
 * @see app/Http/Controllers/Employer/BillingController.php:62
 * @route '/employer/billing/subscription'
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
const subscription = {
    update: Object.assign(update, update),
}

export default subscription