<?php

namespace App\Http\Controllers;

use App\Models\CandidateProfile;
use App\Models\Payment;
use App\Support\Payments\PaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CandidateCheckoutController extends Controller
{
    public function show(CandidateProfile $candidate)
    {
        $candidate->load(['payments' => fn ($q) => $q->orderByDesc('created_at')->limit(5)]);

        $latestPayment = $candidate->payments->first();

        return Inertia::render('Recruitment/Candidates/Checkout', [
            'candidate' => [
                'id' => $candidate->id,
                'full_name' => $candidate->full_name,
                'email' => $candidate->email,
                'profile_visibility_status' => $candidate->profile_visibility_status,
                'is_public' => $candidate->is_public,
                'listing_activated_at' => optional($candidate->listing_activated_at)->toDateTimeString(),
                'listing_expires_at' => optional($candidate->listing_expires_at)->toDateTimeString(),
            ],
            'payment' => $latestPayment ? $this->mapPayment($latestPayment) : null,
            'listingFee' => [
                'amount' => config('recruitment.listing_fee_amount', 1.00),
                'currency' => config('recruitment.listing_fee_currency', 'USD'),
            ],
            'providers' => config('recruitment.payment_providers', ['paynow']),
        ]);
    }

    public function initiatePayment(Request $request, CandidateProfile $candidate): RedirectResponse
    {
        $request->validate([
            'provider' => ['nullable', 'string', 'in:' . implode(',', config('recruitment.payment_providers', ['paynow']))],
        ]);

        $paymentService = app(PaymentService::class);

        $result = $paymentService->initiate(
            $candidate,
            $request->user(),
            $request->input('provider'),
            $request->only(['customer_phone', 'customer_email']),
        );

        if ($result['redirect_url'] ?? null) {
            return redirect($result['redirect_url']);
        }

        return redirect("/candidate-profiles/{$candidate->id}/checkout")
            ->with('success', 'Payment initiated successfully. Please complete the payment.');
    }

    public function handleReturn(Request $request, CandidateProfile $candidate): RedirectResponse
    {
        $latestPayment = Payment::query()
            ->where('payable_type', CandidateProfile::class)
            ->where('payable_id', $candidate->id)
            ->orderByDesc('created_at')
            ->first();

        if ($latestPayment && $latestPayment->status === 'paid') {
            return redirect("/candidate-profiles/{$candidate->id}")
                ->with('success', 'Payment completed. Your listing is now active.');
        }

        return redirect("/candidate-profiles/{$candidate->id}/checkout")
            ->with('info', 'Payment is being processed. Please check back shortly.');
    }

    public function checkStatus(CandidateProfile $candidate)
    {
        $latestPayment = Payment::query()
            ->where('payable_type', CandidateProfile::class)
            ->where('payable_id', $candidate->id)
            ->orderByDesc('created_at')
            ->first();

        return Inertia::render('Recruitment/Candidates/ListingStatus', [
            'candidate' => [
                'id' => $candidate->id,
                'full_name' => $candidate->full_name,
                'profile_visibility_status' => $candidate->profile_visibility_status,
                'is_public' => $candidate->is_public,
                'listing_activated_at' => optional($candidate->listing_activated_at)->toDateTimeString(),
                'listing_expires_at' => optional($candidate->listing_expires_at)->toDateTimeString(),
            ],
            'payment' => $latestPayment ? $this->mapPayment($latestPayment) : null,
        ]);
    }

    public function listingStatus(CandidateProfile $candidate)
    {
        return $this->checkStatus($candidate);
    }

    private function mapPayment(Payment $payment): array
    {
        return [
            'id' => $payment->id,
            'amount' => $payment->amount,
            'currency' => $payment->currency,
            'status' => $payment->status,
            'provider' => $payment->provider,
            'provider_reference' => $payment->provider_reference,
            'paid_at' => optional($payment->paid_at)->toDateTimeString(),
            'created_at' => optional($payment->created_at)->toDateTimeString(),
        ];
    }
}
