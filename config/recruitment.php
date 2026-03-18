<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Candidate Listing Fee
    |--------------------------------------------------------------------------
    |
    | The fee candidates must pay to activate their listing on the marketplace.
    |
    */

    'listing_fee_amount' => env('RECRUITMENT_LISTING_FEE', 1.00),

    'listing_fee_currency' => env('RECRUITMENT_LISTING_CURRENCY', 'USD'),

    /*
    |--------------------------------------------------------------------------
    | Listing Duration
    |--------------------------------------------------------------------------
    |
    | Number of days a listing remains active after payment.
    |
    */

    'listing_duration_days' => env('RECRUITMENT_LISTING_DURATION', 365),

    /*
    |--------------------------------------------------------------------------
    | Payment Providers
    |--------------------------------------------------------------------------
    |
    | Available and default payment providers for recruitment payments.
    |
    */

    'payment_providers' => ['paynow', 'manual'],

    'default_payment_provider' => env('RECRUITMENT_PAYMENT_PROVIDER', 'paynow'),

    /*
    |--------------------------------------------------------------------------
    | Paynow Configuration
    |--------------------------------------------------------------------------
    |
    | Credentials and endpoints for Paynow payment gateway (Zimbabwe).
    | Supports EcoCash, InnBucks, and other Paynow methods.
    |
    */

    'paynow' => [
        'integration_id' => env('PAYNOW_INTEGRATION_ID'),
        'integration_key' => env('PAYNOW_INTEGRATION_KEY'),
        'result_url' => env('PAYNOW_RESULT_URL'),
        'return_url' => env('PAYNOW_RETURN_URL'),
    ],

];
