<?php

namespace App\Http\Controllers\Reports;

use App\Models\CandidateProfile;
use App\Models\CompanyProfile;
use App\Models\Payment;
use App\Models\Vacancy;
use App\Models\VacancyApplication;
use Illuminate\Http\Request;

class RecruitmentReportController extends BaseReportController
{
    public function candidateListings(Request $request)
    {
        $rows = CandidateProfile::query()
            ->where('profile_visibility_status', 'active')
            ->where('is_public', true)
            ->orderByDesc('listing_activated_at')
            ->get()
            ->map(function (CandidateProfile $c) {
                return [
                    'full_name' => $c->full_name,
                    'email' => $c->email,
                    'phone' => $c->phone,
                    'headline' => $c->headline,
                    'location' => $c->location,
                    'highest_education' => $c->highest_education,
                    'years_experience' => $c->years_experience,
                    'listing_activated_at' => optional($c->listing_activated_at)->toDateString(),
                    'listing_expires_at' => optional($c->listing_expires_at)->toDateString(),
                ];
            })->all();

        return $this->exportRows($request, 'candidate-listings', [
            'full_name', 'email', 'phone', 'headline', 'location',
            'highest_education', 'years_experience',
            'listing_activated_at', 'listing_expires_at',
        ], $rows);
    }

    public function vacanciesByCompany(Request $request)
    {
        $rows = Vacancy::query()
            ->with(['company:id,name,industry'])
            ->orderBy('company_profile_id')
            ->orderByDesc('created_at')
            ->get()
            ->map(function (Vacancy $v) {
                return [
                    'company_name' => $v->company?->name,
                    'industry' => $v->company?->industry,
                    'vacancy_title' => $v->title,
                    'category' => $v->category,
                    'employment_type' => $v->employment_type,
                    'work_mode' => $v->work_mode,
                    'status' => $v->status,
                    'published_at' => optional($v->published_at)->toDateString(),
                    'application_deadline' => optional($v->application_deadline)->toDateString(),
                ];
            })->all();

        return $this->exportRows($request, 'vacancies-by-company', [
            'company_name', 'industry', 'vacancy_title', 'category',
            'employment_type', 'work_mode', 'status',
            'published_at', 'application_deadline',
        ], $rows);
    }

    public function applicationsByVacancy(Request $request)
    {
        $rows = VacancyApplication::query()
            ->with([
                'vacancy:id,title',
                'vacancy.company:id,name',
                'candidate:id,full_name,email',
            ])
            ->orderByDesc('applied_at')
            ->get()
            ->map(function (VacancyApplication $a) {
                return [
                    'company_name' => $a->vacancy?->company?->name,
                    'vacancy_title' => $a->vacancy?->title,
                    'candidate_name' => $a->candidate?->full_name,
                    'candidate_email' => $a->candidate?->email,
                    'status' => $a->status,
                    'applied_at' => optional($a->applied_at)->toDateString(),
                    'shortlisted_at' => optional($a->shortlisted_at)->toDateString(),
                    'rejected_at' => optional($a->rejected_at)->toDateString(),
                ];
            })->all();

        return $this->exportRows($request, 'applications-by-vacancy', [
            'company_name', 'vacancy_title', 'candidate_name', 'candidate_email',
            'status', 'applied_at', 'shortlisted_at', 'rejected_at',
        ], $rows);
    }

    public function paymentSummary(Request $request)
    {
        $rows = Payment::query()
            ->where('payable_type', CandidateProfile::class)
            ->with(['user:id,name,email'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function (Payment $p) {
                return [
                    'payment_id' => $p->id,
                    'user_name' => $p->user?->name,
                    'user_email' => $p->user?->email,
                    'amount' => $p->amount,
                    'currency' => $p->currency,
                    'provider' => $p->provider,
                    'provider_reference' => $p->provider_reference,
                    'status' => $p->status,
                    'paid_at' => optional($p->paid_at)->toDateString(),
                    'created_at' => optional($p->created_at)->toDateString(),
                ];
            })->all();

        return $this->exportRows($request, 'payment-summary', [
            'payment_id', 'user_name', 'user_email', 'amount', 'currency',
            'provider', 'provider_reference', 'status', 'paid_at', 'created_at',
        ], $rows);
    }

    public function listingRevenue(Request $request)
    {
        $rows = Payment::query()
            ->where('payable_type', CandidateProfile::class)
            ->where('status', 'paid')
            ->selectRaw('currency, count(*) as total_payments, sum(amount) as total_revenue')
            ->groupBy('currency')
            ->orderByDesc('total_revenue')
            ->get()
            ->map(function ($row) {
                return [
                    'currency' => $row->currency,
                    'total_payments' => $row->total_payments,
                    'total_revenue' => round((float) $row->total_revenue, 2),
                ];
            })->all();

        return $this->exportRows($request, 'listing-revenue', [
            'currency', 'total_payments', 'total_revenue',
        ], $rows);
    }

    public function employerActivity(Request $request)
    {
        $rows = CompanyProfile::query()
            ->withCount(['vacancies'])
            ->where('status', 'active')
            ->orderByDesc('vacancies_count')
            ->get()
            ->map(function (CompanyProfile $c) {
                return [
                    'company_name' => $c->name,
                    'industry' => $c->industry,
                    'city' => $c->city,
                    'country' => $c->country,
                    'status' => $c->status,
                    'vacancies_count' => $c->vacancies_count,
                    'approved_at' => optional($c->approved_at)->toDateString(),
                    'created_at' => optional($c->created_at)->toDateString(),
                ];
            })->all();

        return $this->exportRows($request, 'employer-activity', [
            'company_name', 'industry', 'city', 'country',
            'status', 'vacancies_count', 'approved_at', 'created_at',
        ], $rows);
    }

    public function candidatesByProfession(Request $request)
    {
        $rows = CandidateProfile::query()
            ->whereNotNull('current_job_title')
            ->selectRaw('current_job_title, highest_education, count(*) as candidate_count, avg(years_experience) as avg_experience')
            ->groupBy('current_job_title', 'highest_education')
            ->orderByDesc('candidate_count')
            ->get()
            ->map(function ($row) {
                return [
                    'current_job_title' => $row->current_job_title,
                    'highest_education' => $row->highest_education,
                    'candidate_count' => $row->candidate_count,
                    'avg_experience' => round((float) $row->avg_experience, 1),
                ];
            })->all();

        return $this->exportRows($request, 'candidates-by-profession', [
            'current_job_title', 'highest_education', 'candidate_count', 'avg_experience',
        ], $rows);
    }

    public function pendingListings(Request $request)
    {
        $rows = CandidateProfile::query()
            ->whereIn('profile_visibility_status', ['payment_pending', 'draft', 'inactive'])
            ->orderByDesc('updated_at')
            ->get()
            ->map(function (CandidateProfile $c) {
                return [
                    'full_name' => $c->full_name,
                    'email' => $c->email,
                    'phone' => $c->phone,
                    'headline' => $c->headline,
                    'location' => $c->location,
                    'profile_visibility_status' => $c->profile_visibility_status,
                    'highest_education' => $c->highest_education,
                    'years_experience' => $c->years_experience,
                    'created_at' => optional($c->created_at)->toDateString(),
                    'updated_at' => optional($c->updated_at)->toDateString(),
                ];
            })->all();

        return $this->exportRows($request, 'pending-listings', [
            'full_name', 'email', 'phone', 'headline', 'location',
            'profile_visibility_status', 'highest_education', 'years_experience',
            'created_at', 'updated_at',
        ], $rows);
    }
}
