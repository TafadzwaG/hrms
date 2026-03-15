<?php

namespace App\Support\Sms;

use InvalidArgumentException;

class SmsManager implements SmsTransport
{
    public function __construct(
        private readonly LogSmsTransport $logTransport,
        private readonly WebhookSmsTransport $webhookTransport,
        private readonly NullSmsTransport $nullTransport,
    ) {
    }

    public function send(string $recipient, string $message, array $context = []): array
    {
        return $this->driver()->send($recipient, $message, $context);
    }

    private function driver(): SmsTransport
    {
        return match (config('sms.default', 'log')) {
            'log' => $this->logTransport,
            'webhook' => $this->webhookTransport,
            'null' => $this->nullTransport,
            default => throw new InvalidArgumentException('Unsupported SMS driver ['.config('sms.default').'].'),
        };
    }
}
