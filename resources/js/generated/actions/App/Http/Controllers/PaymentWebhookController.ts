import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PaymentWebhookController::handlePaynow
 * @see app/Http/Controllers/PaymentWebhookController.php:15
 * @route '/webhooks/paynow'
 */
export const handlePaynow = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handlePaynow.url(options),
    method: 'post',
})

handlePaynow.definition = {
    methods: ["post"],
    url: '/webhooks/paynow',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PaymentWebhookController::handlePaynow
 * @see app/Http/Controllers/PaymentWebhookController.php:15
 * @route '/webhooks/paynow'
 */
handlePaynow.url = (options?: RouteQueryOptions) => {
    return handlePaynow.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentWebhookController::handlePaynow
 * @see app/Http/Controllers/PaymentWebhookController.php:15
 * @route '/webhooks/paynow'
 */
handlePaynow.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handlePaynow.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PaymentWebhookController::handlePaynow
 * @see app/Http/Controllers/PaymentWebhookController.php:15
 * @route '/webhooks/paynow'
 */
    const handlePaynowForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: handlePaynow.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PaymentWebhookController::handlePaynow
 * @see app/Http/Controllers/PaymentWebhookController.php:15
 * @route '/webhooks/paynow'
 */
        handlePaynowForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: handlePaynow.url(options),
            method: 'post',
        })
    
    handlePaynow.form = handlePaynowForm
const PaymentWebhookController = { handlePaynow }

export default PaymentWebhookController