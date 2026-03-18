<?php

namespace App\Support\Payments;

use App\Models\Payment;

class ManualGateway implements PaymentGatewayInterface
{
    public function getProviderName(): string
    {
        return 'manual';
    }

    public function initiatePayment(Payment $payment, array $options = []): array
    {
        $payment->update([
            'status' => 'initiated',
            'provider_reference' => 'MANUAL-' . $payment->id,
        ]);

        return [
            'success' => true,
            'redirect_url' => null,
            'poll_url' => null,
            'provider_reference' => 'MANUAL-' . $payment->id,
            'message' => 'Payment recorded. Awaiting manual confirmation by an administrator.',
        ];
    }

    public function verifyPayment(string $reference): array
    {
        $payment = Payment::where('provider_reference', $reference)->first();

        return [
            'status' => $payment?->status ?? 'unknown',
            'provider_reference' => $reference,
            'raw' => [
                'payment_id' => $payment?->id,
                'verified_at' => now()->toIso8601String(),
            ],
        ];
    }
}
