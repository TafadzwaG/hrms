<?php

namespace App\Support\Hubs;

use App\Models\CandidateProfile;
use App\Models\CompanyBillingProfile;
use App\Models\CompanyInvoice;
use App\Models\CompanyProfile;
use App\Models\CompanySubscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\Vacancy;
use App\Models\VacancyApplication;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class EmployerHubPresenter
{
    public function company(CompanyProfile $company): array
    {
        return [
            'id' => $company->id,
            'company_name' => $company->company_name,
            'status' => $company->status,
            'industry' => $company->industry,
            'registration_number' => $company->registration_number,
            'email' => $company->email,
            'phone' => $company->phone,
            'website' => $company->website,
            'address' => $company->address,
            'description' => $company->description,
            'logo_path' => $company->logo_path,
            'approved_at' => $company->approved_at?->toDateString(),
            'metadata' => $company->metadata ?? [],
        ];
    }

    public function user(User $user): array
    {
        return [
            'name' => $user->name,
            'email' => $user->email,
        ];
    }

    public function metrics(CompanyProfile $company, Collection $vacancies, Collection $applications): array
    {
        return [
            'total_vacancies' => $vacancies->count(),
            'published_vacancies' => $vacancies->where('status', 'published')->count(),
            'total_applications' => $applications->count(),
            'company_status' => $company->status,
        ];
    }

    public function vacancy(Vacancy $vacancy): array
    {
        return [
            'id' => $vacancy->id,
            'title' => $vacancy->title,
            'status' => Str::headline($vacancy->status),
            'status_code' => $vacancy->status,
            'department' => $vacancy->department,
            'category' => $vacancy->category,
            'location' => $vacancy->location,
            'employment_type' => $vacancy->employment_type ? Str::headline(str_replace('_', ' ', $vacancy->employment_type)) : null,
            'work_mode' => $vacancy->work_mode ? Str::headline(str_replace('_', ' ', $vacancy->work_mode)) : null,
            'description' => $vacancy->description,
            'requirements' => $vacancy->requirements,
            'responsibilities' => $vacancy->responsibilities,
            'salary_min' => $this->decimal($vacancy->salary_min),
            'salary_max' => $this->decimal($vacancy->salary_max),
            'currency' => $vacancy->currency,
            'application_deadline' => $vacancy->application_deadline?->toDateString(),
            'published_at' => $vacancy->published_at?->toDateString(),
            'closed_at' => $vacancy->closed_at?->toDateString(),
            'applications_count' => (int) ($vacancy->applications_count ?? $vacancy->applications()->count()),
            'created_at' => $vacancy->created_at?->toDateString(),
            'updated_at' => $vacancy->updated_at?->toDateString(),
        ];
    }

    public function application(VacancyApplication $application, ?int $matchScore = null): array
    {
        $candidate = $application->candidate;

        return [
            'id' => $application->id,
            'candidate_id' => $candidate?->id,
            'candidate_name' => $candidate?->full_name,
            'candidate_headline' => $candidate?->headline,
            'candidate_location' => $candidate?->location,
            'candidate_email' => $candidate?->email,
            'candidate_phone' => $candidate?->phone,
            'candidate_years_experience' => $candidate?->years_experience,
            'vacancy_id' => $application->vacancy?->id,
            'vacancy_title' => $application->vacancy?->title,
            'status' => $application->status,
            'applied_at' => $application->applied_at?->diffForHumans() ?? $application->created_at?->diffForHumans(),
            'applied_at_date' => $application->applied_at?->toDateString() ?? $application->created_at?->toDateString(),
            'cover_letter' => $application->cover_letter,
            'notes' => $application->notes,
            'resume' => $application->resume ? [
                'id' => $application->resume->id,
                'file_name' => $application->resume->file_name,
            ] : null,
            'match_score' => $matchScore,
        ];
    }

    public function applicationsByStatus(Collection $applications): array
    {
        return $applications
            ->groupBy('status')
            ->map(fn (Collection $group) => $group->count())
            ->sortKeys()
            ->all();
    }

    public function recommendedTalent(CandidateProfile $candidate, int $score): array
    {
        return [
            'id' => $candidate->id,
            'name' => $candidate->full_name,
            'headline' => trim(($candidate->headline ?? 'Candidate').' '.($candidate->years_experience ? '• '.$candidate->years_experience.' yrs exp' : '')),
            'initials' => collect(explode(' ', $candidate->full_name))
                ->filter()
                ->map(fn (string $part) => strtoupper(substr($part, 0, 1)))
                ->take(2)
                ->implode(''),
            'match_score' => $score,
            'location' => $candidate->location,
        ];
    }

    public function billingProfile(?CompanyBillingProfile $profile): array
    {
        return [
            'billing_name' => $profile?->billing_name,
            'billing_email' => $profile?->billing_email,
            'billing_phone' => $profile?->billing_phone,
            'billing_address' => $profile?->billing_address,
            'tax_number' => $profile?->tax_number,
            'metadata' => $profile?->metadata ?? [],
        ];
    }

    public function subscriptionPlan(SubscriptionPlan $plan): array
    {
        return [
            'id' => $plan->id,
            'code' => $plan->code,
            'name' => $plan->name,
            'description' => $plan->description,
            'price' => $this->decimal($plan->price),
            'currency' => $plan->currency,
            'billing_interval' => $plan->billing_interval,
            'seat_limit' => $plan->seat_limit,
            'features' => $plan->features ?? [],
            'is_active' => (bool) $plan->is_active,
        ];
    }

    public function subscription(?CompanySubscription $subscription): ?array
    {
        if (! $subscription) {
            return null;
        }

        return [
            'id' => $subscription->id,
            'status' => $subscription->status,
            'seats' => $subscription->seats,
            'amount' => $this->decimal($subscription->amount),
            'currency' => $subscription->currency,
            'started_at' => $subscription->started_at?->toDateString(),
            'renews_at' => $subscription->renews_at?->toDateString(),
            'cancelled_at' => $subscription->cancelled_at?->toDateString(),
            'plan' => $subscription->plan ? $this->subscriptionPlan($subscription->plan) : null,
            'metadata' => $subscription->metadata ?? [],
        ];
    }

    public function invoice(CompanyInvoice $invoice): array
    {
        return [
            'id' => $invoice->id,
            'invoice_number' => $invoice->invoice_number,
            'amount' => $this->decimal($invoice->amount),
            'currency' => $invoice->currency,
            'status' => $invoice->status,
            'description' => $invoice->description,
            'issued_at' => $invoice->issued_at?->toDateString(),
            'due_at' => $invoice->due_at?->toDateString(),
            'paid_at' => $invoice->paid_at?->toDateString(),
        ];
    }

    private function decimal(mixed $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        return rtrim(rtrim(number_format((float) $value, 2, '.', ''), '0'), '.');
    }
}
