<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\PaymentWebhookLog;
use App\Support\Payments\CandidateListingActivationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentWebhookController extends Controller
{
    public function handlePaynow(Request $request): JsonResponse
    {
        $payload = $request->all();

        PaymentWebhookLog::create([
            'provider' => 'paynow',
            'event' => $payload['event'] ?? 'unknown',
            'payload' => $payload,
            'ip_address' => $request->ip(),
            'received_at' => now(),
        ]);

        $providerReference = $payload['reference'] ?? $payload['provider_reference'] ?? null;

        if (! $providerReference) {
            Log::warning('PaymentWebhook: Missing provider reference in payload.', $payload);

            return response()->json(['status' => 'error', 'message' => 'Missing reference.'], 400);
        }

        $payment = Payment::where('provider', 'paynow')
            ->where('provider_reference', $providerReference)
            ->first();

        if (! $payment) {
            Log::warning('PaymentWebhook: Payment not found for reference.', ['reference' => $providerReference]);

            return response()->json(['status' => 'error', 'message' => 'Payment not found.'], 404);
        }

        $webhookStatus = strtolower($payload['status'] ?? '');

        if (in_array($webhookStatus, ['paid', 'success', 'completed'])) {
            DB::transaction(function () use ($payment) {
                $payment->update([
                    'status' => 'paid',
                    'paid_at' => now(),
                ]);

                app(CandidateListingActivationService::class)->activate($payment);
            });

            return response()->json(['status' => 'ok', 'message' => 'Payment confirmed.']);
        }

        if (in_array($webhookStatus, ['failed', 'cancelled', 'error'])) {
            DB::transaction(function () use ($payment) {
                $payment->update([
                    'status' => 'failed',
                    'failed_at' => now(),
                ]);
            });

            return response()->json(['status' => 'ok', 'message' => 'Payment failure recorded.']);
        }

        Log::info('PaymentWebhook: Unhandled status received.', [
            'reference' => $providerReference,
            'status' => $webhookStatus,
        ]);

        return response()->json(['status' => 'ok', 'message' => 'Webhook received.']);
    }
}
