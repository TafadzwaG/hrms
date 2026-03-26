import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Employer\BillingController::edit
 * @see app/Http/Controllers/Employer/BillingController.php:17
 * @route '/employer/billing'
 */
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/employer/billing',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\BillingController::edit
 * @see app/Http/Controllers/Employer/BillingController.php:17
 * @route '/employer/billing'
 */
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\BillingController::edit
 * @see app/Http/Controllers/Employer/BillingController.php:17
 * @route '/employer/billing'
 */
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\BillingController::edit
 * @see app/Http/Controllers/Employer/BillingController.php:17
 * @route '/employer/billing'
 */
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employer\BillingController::edit
 * @see app/Http/Controllers/Employer/BillingController.php:17
 * @route '/employer/billing'
 */
    const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employer\BillingController::edit
 * @see app/Http/Controllers/Employer/BillingController.php:17
 * @route '/employer/billing'
 */
        editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employer\BillingController::edit
 * @see app/Http/Controllers/Employer/BillingController.php:17
 * @route '/employer/billing'
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
* @see \App\Http\Controllers\Employer\BillingController::updateProfile
 * @see app/Http/Controllers/Employer/BillingController.php:46
 * @route '/employer/billing/profile'
 */
export const updateProfile = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateProfile.url(options),
    method: 'put',
})

updateProfile.definition = {
    methods: ["put"],
    url: '/employer/billing/profile',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Employer\BillingController::updateProfile
 * @see app/Http/Controllers/Employer/BillingController.php:46
 * @route '/employer/billing/profile'
 */
updateProfile.url = (options?: RouteQueryOptions) => {
    return updateProfile.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\BillingController::updateProfile
 * @see app/Http/Controllers/Employer/BillingController.php:46
 * @route '/employer/billing/profile'
 */
updateProfile.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateProfile.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Employer\BillingController::updateProfile
 * @see app/Http/Controllers/Employer/BillingController.php:46
 * @route '/employer/billing/profile'
 */
    const updateProfileForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateProfile.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Employer\BillingController::updateProfile
 * @see app/Http/Controllers/Employer/BillingController.php:46
 * @route '/employer/billing/profile'
 */
        updateProfileForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateProfile.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateProfile.form = updateProfileForm
/**
* @see \App\Http\Controllers\Employer\BillingController::changeSubscription
 * @see app/Http/Controllers/Employer/BillingController.php:62
 * @route '/employer/billing/subscription'
 */
export const changeSubscription = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: changeSubscription.url(options),
    method: 'put',
})

changeSubscription.definition = {
    methods: ["put"],
    url: '/employer/billing/subscription',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Employer\BillingController::changeSubscription
 * @see app/Http/Controllers/Employer/BillingController.php:62
 * @route '/employer/billing/subscription'
 */
changeSubscription.url = (options?: RouteQueryOptions) => {
    return changeSubscription.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\BillingController::changeSubscription
 * @see app/Http/Controllers/Employer/BillingController.php:62
 * @route '/employer/billing/subscription'
 */
changeSubscription.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: changeSubscription.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Employer\BillingController::changeSubscription
 * @see app/Http/Controllers/Employer/BillingController.php:62
 * @route '/employer/billing/subscription'
 */
    const changeSubscriptionForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: changeSubscription.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Employer\BillingController::changeSubscription
 * @see app/Http/Controllers/Employer/BillingController.php:62
 * @route '/employer/billing/subscription'
 */
        changeSubscriptionForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: changeSubscription.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    changeSubscription.form = changeSubscriptionForm
const BillingController = { edit, updateProfile, changeSubscription }

export default BillingController