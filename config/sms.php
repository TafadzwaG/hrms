<?php

return [
    'default' => env('SMS_DRIVER', 'log'),

    'sender' => env('SMS_SENDER', config('app.name')),

    'message_template' => env(
        'PAYSLIP_SMS_TEMPLATE',
        'Payslip for :period: Net Pay :net_pay. Gross :gross_pay. Contact HR for questions.'
    ),

    'drivers' => [
        'log' => [
            'channel' => env('SMS_LOG_CHANNEL'),
        ],
        'webhook' => [
            'url' => env('SMS_WEBHOOK_URL'),
            'token' => env('SMS_WEBHOOK_TOKEN'),
            'timeout' => (int) env('SMS_WEBHOOK_TIMEOUT', 15),
        ],
        'null' => [],
    ],
];
