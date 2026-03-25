<?php

namespace App\Http\Controllers;

use App\Models\CandidateProfile;
use App\Models\CompanyProfile;
use App\Models\Payment;
use App\Support\IndexTables\IndexTableSorter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RecruitmentAdminPaymentsController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->string('search')->toString();
        $status = $request->input('status');
        $provider = $request->input('provider');

        $sortMap = [
            'id' => 'id',
            'amount' => 'amount',
            'currency' => 'currency',
            'provider' => 'provider',
            'status' => 'status',
            'created_at' => 'created_at',
            'paid_at' => 'paid_at',
        ];
        $sorting = IndexTableSorter::resolve($request, $sortMap, 'created_at', 'desc');

        $baseQuery = Payment::query()
            ->with(['payable'])
            ->whereIn('payable_type', [CandidateProfile::class, CompanyProfile::class])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($nested) use ($search) {
                    $nested->where('id', $search)
                        ->orWhere('provider_reference', 'like', "%{$search}%")
                        ->orWhere('customer_email', 'like', "%{$search}%")
                        ->orWhereHasMorph(
                            'payable',
                            [CandidateProfile::class, CompanyProfile::class],
                            function ($morphQuery, string $type) use ($search) {
                                if ($type === CandidateProfile::class) {
                                    $morphQuery->where('full_name', 'like', "%{$search}%")
                                        ->orWhere('email', 'like', "%{$search}%");

                                    return;
                                }

                                $morphQuery->where('company_name', 'like', "%{$search}%")
                                    ->orWhere('email', 'like', "%{$search}%");
                            }
                        );
                });
            })
            ->when($status, fn ($query) => $query->where('status', $status))
            ->when($provider, fn ($query) => $query->where('provider', $provider));

        $payments = (clone $baseQuery)
            ->tap(fn ($query) => IndexTableSorter::apply($query, $sortMap, $sorting['sort'], $sorting['direction']))
            ->paginate(25)
            ->through(fn (Payment $payment) => [
                'id' => $payment->id,
                'payable_type' => class_basename((string) $payment->payable_type),
                'payable_id' => $payment->payable_id,
                'payable_name' => $payment->payable instanceof CandidateProfile
                    ? $payment->payable->full_name
                    : ($payment->payable instanceof CompanyProfile ? $payment->payable->company_name : 'Unknown'),
                'amount' => $payment->amount,
                'currency' => $payment->currency,
                'provider' => $payment->provider,
                'status' => $payment->status,
                'created_at' => optional($payment->created_at)->toDateTimeString(),
                'paid_at' => optional($payment->paid_at)->toDateTimeString(),
            ])
            ->withQueryString();

        return Inertia::render('Recruitment/Admin/Payments', [
            'payments' => $payments,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'provider' => $provider,
                'sort' => $sorting['sort'],
                'direction' => $sorting['direction'],
            ],
            'providers' => Payment::PROVIDERS,
            'statuses' => Payment::STATUSES,
        ]);
    }
}
