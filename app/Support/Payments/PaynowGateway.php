<?php

namespace App\Support\Payments;

use App\Models\Payment;
use App\Models\PaymentAttempt;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PaynowGateway implements PaymentGatewayInterface
{
    public function getProviderName(): string
    {
        return 'paynow';
    }

    public function initiatePayment(Payment $payment, array $options = []): array
    {
        $config = config('recruitment.paynow');

        $integrationId = $config['integration_id'] ?? '';
        $integrationKey = $config['integration_key'] ?? '';
        // TODO: Replace with actual Paynow API endpoint URL
        $initiateUrl = $config['initiate_url'] ?? 'https://www.paynow.co.zw/interface/initiatetransaction';
        $returnUrl = $config['return_url'] ?? url('/payments/return');
        $resultUrl = $config['result_url'] ?? url('/api/payments/callback/paynow');

        $reference = 'PAY-' . Str::upper(Str::random(10)) . '-' . $payment->id;

        $payload = [
            'id' => $integrationId,
            'reference' => $reference,
            'amount' => $payment->amount,
            'additionalinfo' => "Candidate listing fee - Payment #{$payment->id}",
            'returnurl' => $returnUrl,
            'resulturl' => $resultUrl,
            'authemail' => $payment->customer_email ?? '',
            'phone' => $payment->customer_phone ?? '',
            'method' => $options['method'] ?? 'ecocash', // ecocash, innbucks, etc.
            'status' => 'Message',
        ];

        // Generate hash for request integrity
        $hashString = implode('', array_values($payload)) . $integrationKey;
        $payload['hash'] = strtoupper(hash('sha512', $hashString));

        try {
            // TODO: Verify actual Paynow API request format and content type
            $response = Http::asForm()
                ->timeout(30)
                ->post($initiateUrl, $payload);

            $responseBody = $this->parsePaynowResponse($response->body());

            // Record the attempt
            PaymentAttempt::create([
                'payment_id' => $payment->id,
                'provider' => $this->getProviderName(),
                'request_payload' => $payload,
                'response_payload' => $responseBody,
                'http_status' => $response->status(),
                'attempted_at' => now(),
            ]);

            if (($responseBody['status'] ?? '') === 'Ok') {
                $payment->update([
                    'status' => 'initiated',
                    'provider_reference' => $responseBody['paynowreference'] ?? $reference,
                ]);

                return [
                    'success' => true,
                    'redirect_url' => $responseBody['browserurl'] ?? null,
                    'poll_url' => $responseBody['pollurl'] ?? null,
                    'provider_reference' => $responseBody['paynowreference'] ?? $reference,
                    'message' => 'Payment initiated successfully.',
                ];
            }

            Log::warning('Paynow payment initiation failed', [
                'payment_id' => $payment->id,
                'response' => $responseBody,
            ]);

            $payment->update(['status' => 'failed']);

            return [
                'success' => false,
                'redirect_url' => null,
                'poll_url' => null,
                'provider_reference' => null,
                'message' => $responseBody['error'] ?? 'Payment initiation failed.',
            ];
        } catch (\Throwable $e) {
            Log::error('Paynow payment initiation exception', [
                'payment_id' => $payment->id,
                'error' => $e->getMessage(),
            ]);

            PaymentAttempt::create([
                'payment_id' => $payment->id,
                'provider' => $this->getProviderName(),
                'request_payload' => $payload,
                'response_payload' => ['error' => $e->getMessage()],
                'http_status' => 0,
                'attempted_at' => now(),
            ]);

            $payment->update(['status' => 'failed']);

            return [
                'success' => false,
                'redirect_url' => null,
                'poll_url' => null,
                'provider_reference' => null,
                'message' => 'An error occurred while initiating payment.',
            ];
        }
    }

    public function verifyPayment(string $reference): array
    {
        $config = config('recruitment.paynow');
        // TODO: Replace with actual Paynow poll endpoint URL
        $pollUrl = $config['poll_base_url'] ?? 'https://www.paynow.co.zw/interface/remotetransaction';

        try {
            $response = Http::asForm()
                ->timeout(30)
                ->post($pollUrl, ['id' => $reference]);

            $responseBody = $this->parsePaynowResponse($response->body());

            $status = match (strtolower($responseBody['status'] ?? '')) {
                'paid' => 'paid',
                'awaiting delivery', 'delivered' => 'paid',
                'cancelled' => 'cancelled',
                'refunded' => 'refunded',
                'disputed' => 'disputed',
                default => 'pending',
            };

            return [
                'status' => $status,
                'provider_reference' => $responseBody['paynowreference'] ?? null,
                'raw' => $responseBody,
            ];
        } catch (\Throwable $e) {
            Log::error('Paynow payment verification exception', [
                'reference' => $reference,
                'error' => $e->getMessage(),
            ]);

            return [
                'status' => 'error',
                'provider_reference' => null,
                'raw' => ['error' => $e->getMessage()],
            ];
        }
    }

    /**
     * Parse Paynow's URL-encoded response body into an associative array.
     */
    private function parsePaynowResponse(string $body): array
    {
        $result = [];

        // Paynow returns responses as URL-encoded key=value pairs separated by &
        parse_str($body, $result);

        // Normalize keys to lowercase
        return array_change_key_case($result, CASE_LOWER);
    }
}
