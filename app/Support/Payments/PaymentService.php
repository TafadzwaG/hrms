<?php

namespace App\Support\Payments;

use App\Models\CandidateProfile;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    public function resolveGateway(string $provider): PaymentGatewayInterface
    {
        return match ($provider) {
            'paynow' => app(PaynowGateway::class),
            'manual' => app(ManualGateway::class),
            default => throw new \InvalidArgumentException("Unsupported payment provider: {$provider}"),
        };
    }

    public function initiate(CandidateProfile $candidate, ?User $user = null, ?string $provider = null, array $options = []): array
    {
        $provider = $provider ?? config('recruitment.default_payment_provider', 'paynow');
        $gateway = $this->resolveGateway($provider);

        return DB::transaction(function () use ($candidate, $user, $gateway, $options) {
            $payment = Payment::create([
                'payable_type' => CandidateProfile::class,
                'payable_id' => $candidate->id,
                'amount' => config('recruitment.listing_fee_amount', 1.00),
                'currency' => config('recruitment.listing_fee_currency', 'USD'),
                'provider' => $gateway->getProviderName(),
                'status' => 'pending',
                'user_id' => $user?->id,
                'customer_email' => $candidate->email,
                'customer_phone' => $candidate->phone,
                'initiated_at' => now(),
            ]);

            $candidate->update([
                'profile_visibility_status' => 'payment_pending',
            ]);

            $result = $gateway->initiatePayment($payment, $options);

            if ($result['provider_reference'] ?? null) {
                $payment->update(['provider_reference' => $result['provider_reference']]);
            }

            return array_merge($result, ['payment_id' => $payment->id]);
        });
    }
}
