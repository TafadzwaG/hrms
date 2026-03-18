<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentWebhookLog extends Model
{
    protected $table = 'payment_webhook_logs';

    protected $fillable = [
        'provider',
        'provider_reference',
        'event',
        'ip_address',
        'payload',
        'processed',
        'processed_at',
        'received_at',
    ];

    protected $casts = [
        'payload' => 'array',
        'processed' => 'boolean',
        'processed_at' => 'datetime',
        'received_at' => 'datetime',
    ];
}
