<?php

namespace App\Support\Sms;

use Illuminate\Http\Client\Factory as HttpFactory;
use Illuminate\Http\Client\RequestException;

class WebhookSmsTransport implements SmsTransport
{
    public function __construct(
        private readonly HttpFactory $http,
    ) {
    }

    public function send(string $recipient, string $message, array $context = []): array
    {
        $url = (string) config('sms.drivers.webhook.url');

        if ($url === '') {
            throw new RequestException(
                $this->http->response(['message' => 'SMS webhook URL is not configured.'], 422)
            );
        }

        $request = $this->http
            ->timeout((int) config('sms.drivers.webhook.timeout', 15))
            ->acceptJson();

        $token = (string) config('sms.drivers.webhook.token');

        if ($token !== '') {
            $request = $request->withToken($token);
        }

        $response = $request->post($url, [
            'recipient' => $recipient,
            'message' => $message,
            'sender' => config('sms.sender'),
            'context' => $context,
        ])->throw();

        return [
            'provider' => 'webhook',
            'message_id' => $response->json('id') ?? $response->json('message_id'),
            'recipient' => $recipient,
            'response' => $response->json(),
        ];
    }
}
