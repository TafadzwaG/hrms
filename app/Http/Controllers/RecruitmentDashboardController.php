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
        $activeCandidates = CandidateProfile::query()
            ->where('profile_visibility_status', 'active')
            ->count();

        $companies = CompanyProfile::query()->count();
        $publishedVacancies = Vacancy::query()->where('status', 'published')->count();
        $totalApplications = VacancyApplication::query()->count();
        $totalRevenue = (float) Payment::query()
            ->whereIn('payable_type', [CandidateProfile::class, CompanyProfile::class])
            ->where('status', 'paid')
            ->sum('amount');

        $recentCandidates = CandidateProfile::query()
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (CandidateProfile $candidate) => [
                'id' => $candidate->id,
                'title' => $candidate->full_name,
                'subtitle' => $candidate->headline ?: $candidate->email,
                'meta' => ucfirst(str_replace('_', ' ', $candidate->profile_visibility_status ?? 'draft')),
                'href' => route('candidate-profiles.show', $candidate),
            ])
            ->values()
            ->all();

        $recentEmployers = CompanyProfile::query()
            ->withCount('vacancies')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (CompanyProfile $company) => [
                'id' => $company->id,
                'title' => $company->company_name,
                'subtitle' => $company->industry ? ucfirst(str_replace('_', ' ', $company->industry)) : ($company->email ?: 'Company profile'),
                'meta' => number_format($company->vacancies_count).' vacancies',
                'href' => route('company-profiles.show', $company),
            ])
            ->values()
            ->all();

        $recentVacancies = Vacancy::query()
            ->with('company:id,company_name')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (Vacancy $vacancy) => [
                'id' => $vacancy->id,
                'title' => $vacancy->title,
                'subtitle' => $vacancy->company?->company_name ?: 'Employer not linked',
                'meta' => ucfirst(str_replace('_', ' ', $vacancy->status)),
                'href' => route('vacancies.show', $vacancy),
            ])
            ->values()
            ->all();

        $recentPayments = Payment::query()
            ->whereIn('payable_type', [CandidateProfile::class, CompanyProfile::class])
            ->with('payable')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function (Payment $payment) {
                $payableName = $payment->payable instanceof CandidateProfile
                    ? $payment->payable->full_name
                    : ($payment->payable instanceof CompanyProfile ? $payment->payable->company_name : 'Recruitment payment');

                return [
                    'id' => $payment->id,
                    'title' => $payableName,
                    'subtitle' => strtoupper($payment->currency).' '.number_format((float) $payment->amount, 2),
                    'meta' => ucfirst($payment->provider).' · '.ucfirst(str_replace('_', ' ', $payment->status)),
                    'href' => '/recruitment/admin/payments',
                ];
            })
            ->values()
            ->all();

        $recentActivities = $this->buildRecentActivities();

        return Inertia::render('Recruitment/Dashboard', [
            'stats' => [
                'active_candidates' => $activeCandidates,
                'companies' => $companies,
                'vacancies' => $publishedVacancies,
                'applications' => $totalApplications,
                'revenue' => $totalRevenue,
            ],
            'recent_activities' => $recentActivities,
            'recent_candidates' => $recentCandidates,
            'recent_employers' => $recentEmployers,
            'recent_vacancies' => $recentVacancies,
            'recent_payments' => $recentPayments,
        ]);
    }

    private function buildRecentActivities(): array
    {
        return collect()
            ->merge(
                CandidateProfile::query()->latest()->limit(4)->get()->map(fn (CandidateProfile $candidate) => [
                    'id' => 'candidate-'.$candidate->id,
                    'type' => 'candidate',
                    'description' => 'Candidate profile updated for '.$candidate->full_name,
                    'user' => $candidate->email ?: 'Candidate profile',
                    'created_at' => optional($candidate->updated_at)->toDateTimeString(),
                    'href' => route('candidate-profiles.show', $candidate),
                ])
            )
            ->merge(
                CompanyProfile::query()->latest()->limit(4)->get()->map(fn (CompanyProfile $company) => [
                    'id' => 'company-'.$company->id,
                    'type' => 'company',
                    'description' => 'Employer profile updated for '.$company->company_name,
                    'user' => $company->email ?: 'Employer profile',
                    'created_at' => optional($company->updated_at)->toDateTimeString(),
                    'href' => route('company-profiles.show', $company),
                ])
            )
            ->merge(
                Vacancy::query()->with('company:id,company_name')->latest()->limit(4)->get()->map(fn (Vacancy $vacancy) => [
                    'id' => 'vacancy-'.$vacancy->id,
                    'type' => 'vacancy',
                    'description' => 'Vacancy '.$vacancy->title.' posted for '.($vacancy->company?->company_name ?: 'Employer'),
                    'user' => $vacancy->company?->company_name ?: 'Employer',
                    'created_at' => optional($vacancy->created_at)->toDateTimeString(),
                    'href' => route('vacancies.show', $vacancy),
                ])
            )
            ->merge(
                VacancyApplication::query()
                    ->with(['candidate:id,full_name', 'vacancy:id,title'])
                    ->latest()
                    ->limit(4)
                    ->get()
                    ->map(fn (VacancyApplication $application) => [
                        'id' => 'application-'.$application->id,
                        'type' => 'application',
                        'description' => ($application->candidate?->full_name ?: 'Candidate').' applied for '.($application->vacancy?->title ?: 'a vacancy'),
                        'user' => $application->candidate?->full_name ?: 'Candidate application',
                        'created_at' => optional($application->created_at)->toDateTimeString(),
                        'href' => route('vacancy-applications.show', $application),
                    ])
            )
            ->merge(
                Payment::query()->with('payable')->latest()->limit(4)->get()->map(function (Payment $payment) {
                    if (! in_array($payment->payable_type, [CandidateProfile::class, CompanyProfile::class], true)) {
                        return null;
                    }

                    $payableName = $payment->payable instanceof CandidateProfile
                        ? $payment->payable->full_name
                        : ($payment->payable instanceof CompanyProfile ? $payment->payable->company_name : 'Recruitment payment');

                    return [
                        'id' => 'payment-'.$payment->id,
                        'type' => 'payment',
                        'description' => $payableName.' payment marked '.str_replace('_', ' ', $payment->status),
                        'user' => $payableName,
                        'created_at' => optional($payment->created_at)->toDateTimeString(),
                        'href' => '/recruitment/admin/payments',
                    ];
                })->filter()
            )
            ->sortByDesc('created_at')
            ->take(10)
            ->values()
            ->all();
    }
}
