<?php

namespace App\Support\Payments;

use App\Models\Payment;

interface PaymentGatewayInterface
{
    /**
     * Initiate a payment through this gateway.
     *
     * @return array{success: bool, redirect_url: string|null, poll_url: string|null, provider_reference: string|null, message: string}
     */
    public function initiatePayment(Payment $payment, array $options = []): array;

    /**
     * Verify a payment status with the provider.
     *
     * @return array{status: string, provider_reference: string|null, raw: array}
     */
    public function verifyPayment(string $reference): array;

    public function getProviderName(): string;
}
