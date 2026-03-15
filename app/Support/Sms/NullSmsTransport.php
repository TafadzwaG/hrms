<?php

namespace App\Support\Sms;

class NullSmsTransport implements SmsTransport
{
    public function send(string $recipient, string $message, array $context = []): array
    {
        return [
            'provider' => 'null',
            'recipient' => $recipient,
            'message' => $message,
            'context' => $context,
        ];
    }
}
