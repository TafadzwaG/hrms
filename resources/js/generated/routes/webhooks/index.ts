import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PaymentWebhookController::paynow
 * @see app/Http/Controllers/PaymentWebhookController.php:15
 * @route '/webhooks/paynow'
 */
export const paynow = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: paynow.url(options),
    method: 'post',
})

paynow.definition = {
    methods: ["post"],
    url: '/webhooks/paynow',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PaymentWebhookController::paynow
 * @see app/Http/Controllers/PaymentWebhookController.php:15
 * @route '/webhooks/paynow'
 */
paynow.url = (options?: RouteQueryOptions) => {
    return paynow.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentWebhookController::paynow
 * @see app/Http/Controllers/PaymentWebhookController.php:15
 * @route '/webhooks/paynow'
 */
paynow.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: paynow.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PaymentWebhookController::paynow
 * @see app/Http/Controllers/PaymentWebhookController.php:15
 * @route '/webhooks/paynow'
 */
    const paynowForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: paynow.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PaymentWebhookController::paynow
 * @see app/Http/Controllers/PaymentWebhookController.php:15
 * @route '/webhooks/paynow'
 */
        paynowForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: paynow.url(options),
            method: 'post',
        })
    
    paynow.form = paynowForm
const webhooks = {
    paynow: Object.assign(paynow, paynow),
}

export default webhooks