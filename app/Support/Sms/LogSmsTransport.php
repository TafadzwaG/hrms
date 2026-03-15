<?php

namespace App\Support\Sms;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class LogSmsTransport implements SmsTransport
{
    public function send(string $recipient, string $message, array $context = []): array
    {
        $messageId = (string) Str::uuid();

        Log::channel(config('sms.drivers.log.channel'))
            ->info('SMS dispatch simulated via log transport.', [
                'message_id' => $messageId,
                'recipient' => $recipient,
                'message' => $message,
                'context' => $context,
            ]);

        return [
            'provider' => 'log',
            'message_id' => $messageId,
            'recipient' => $recipient,
        ];
    }
}
