<?php

namespace App\Http\Controllers;

use App\Models\CandidateProfile;
use App\Models\CompanyProfile;
use App\Models\Payment;
use App\Models\Vacancy;
use App\Models\VacancyApplication;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RecruitmentDashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $activeCandidates = CandidateProfile::where('profile_visibility_status', 'active')->count();

        $activeCompanies = CompanyProfile::where('status', 'active')->count();

        $publishedVacancies = Vacancy::where('status', 'published')->count();

        $totalApplications = VacancyApplication::count();

        $recentPayments = Payment::query()
            ->where('payable_type', CandidateProfile::class)
            ->orderByDesc('created_at')
            ->limit(10)
            ->get()
            ->map(fn (Payment $payment) => [
                'id' => $payment->id,
                'amount' => $payment->amount,
                'currency' => $payment->currency,
                'status' => $payment->status,
                'provider' => $payment->provider,
                'paid_at' => optional($payment->paid_at)->toDateTimeString(),
                'created_at' => optional($payment->created_at)->toDateTimeString(),
            ])
            ->all();

        $listingsByStatus = CandidateProfile::query()
            ->selectRaw('profile_visibility_status, count(*) as count')
            ->groupBy('profile_visibility_status')
            ->pluck('count', 'profile_visibility_status')
            ->all();

        $applicationsByStatus = VacancyApplication::query()
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->all();

        return Inertia::render('Recruitment/Dashboard', [
            'metrics' => [
                'active_candidates' => $activeCandidates,
                'active_companies' => $activeCompanies,
                'published_vacancies' => $publishedVacancies,
                'total_applications' => $totalApplications,
            ],
            'recentPayments' => $recentPayments,
            'listingsByStatus' => $listingsByStatus,
            'applicationsByStatus' => $applicationsByStatus,
        ]);
    }
}
