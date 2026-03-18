<?php

namespace App\Support\Payments;

use App\Models\CandidateProfile;
use App\Models\Payment;

class CandidateListingActivationService
{
    public function activate(Payment $payment): void
    {
        if ($payment->payable_type !== CandidateProfile::class) {
            return;
        }

        $candidate = CandidateProfile::find($payment->payable_id);

        if (! $candidate) {
            return;
        }

        $durationDays = config('recruitment.listing_duration_days', 365);

        $candidate->update([
            'profile_visibility_status' => 'active',
            'is_public' => true,
            'listing_activated_at' => now(),
            'listing_expires_at' => now()->addDays($durationDays),
        ]);
    }

    public function deactivate(CandidateProfile $candidate, string $reason = 'expired'): void
    {
        $candidate->update([
            'profile_visibility_status' => $reason,
            'is_public' => false,
        ]);
    }
}
