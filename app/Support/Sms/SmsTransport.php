<?php

namespace App\Support\Sms;

interface SmsTransport
{
    /**
     * @return array<string, mixed>
     */
    public function send(string $recipient, string $message, array $context = []): array;
}
