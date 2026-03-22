<?php

namespace App\Support\Hubs;

use App\Models\ApplicationInterview;
use App\Models\CandidateEducation;
use App\Models\CandidateExperience;
use App\Models\CandidateProfile;
use App\Models\CandidateResume;
use App\Models\CandidateSkill;
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

    public function application(VacancyApplication $application, ?array $match = null): array
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
                'download_url' => route('employer.candidates.resume.download', [
                    'application' => $application->id,
                    'resume' => $application->resume->id,
                ]),
            ] : null,
            'match_score' => $match['score'] ?? null,
            'match' => $this->matchPayload($match),
            'latest_interview' => $application->relationLoaded('latestInterview') && $application->latestInterview
                ? $this->interview($application->latestInterview)
                : null,
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

    public function recommendedTalent(CandidateProfile $candidate, ?array $match = null): array
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
            'match_score' => $match['score'] ?? null,
            'location' => $candidate->location,
            'match' => $this->matchPayload($match),
        ];
    }

    public function candidateProfile(CandidateProfile $candidate): array
    {
        return [
            'id' => $candidate->id,
            'full_name' => $candidate->full_name,
            'email' => $candidate->email,
            'phone' => $candidate->phone,
            'alt_phone' => $candidate->alt_phone,
            'national_id' => $candidate->national_id,
            'gender' => $candidate->gender ? Str::headline($candidate->gender) : null,
            'date_of_birth' => $candidate->date_of_birth?->toDateString(),
            'location' => $candidate->location,
            'headline' => $candidate->headline,
            'professional_summary' => $candidate->professional_summary,
            'expected_salary' => $this->decimal($candidate->expected_salary),
            'salary_currency' => $candidate->salary_currency,
            'years_experience' => $candidate->years_experience,
            'highest_education' => $candidate->highest_education ? Str::headline(str_replace('_', ' ', $candidate->highest_education)) : null,
            'profile_visibility_status' => $candidate->profile_visibility_status,
            'is_public' => (bool) $candidate->is_public,
            'is_verified' => (bool) $candidate->is_verified,
            'stage' => $candidate->stage,
            'status' => $candidate->status,
            'listing_activated_at' => $candidate->listing_activated_at?->toDateString(),
            'listing_expires_at' => $candidate->listing_expires_at?->toDateString(),
            'profile_views' => (int) data_get($candidate->metadata, 'profile_views', 0),
        ];
    }

    public function candidateEducation(CandidateEducation $education): array
    {
        return [
            'id' => $education->id,
            'institution' => $education->institution,
            'qualification' => $education->qualification,
            'field_of_study' => $education->field_of_study,
            'start_date' => $education->start_date?->toDateString(),
            'end_date' => $education->end_date?->toDateString(),
            'grade' => $education->grade,
        ];
    }

    public function candidateExperience(CandidateExperience $experience): array
    {
        return [
            'id' => $experience->id,
            'employer_name' => $experience->employer_name,
            'job_title' => $experience->job_title,
            'start_date' => $experience->start_date?->toDateString(),
            'end_date' => $experience->end_date?->toDateString(),
            'currently_working' => (bool) $experience->currently_working,
            'description' => $experience->description,
        ];
    }

    public function candidateSkill(CandidateSkill $skill): array
    {
        return [
            'id' => $skill->id,
            'name' => $skill->name,
            'level' => $skill->level ? Str::headline($skill->level) : null,
            'years_experience' => $skill->years_experience,
        ];
    }

    public function candidateDocument(CandidateResume $resume, int $applicationId): array
    {
        return [
            'id' => $resume->id,
            'file_name' => $resume->file_name,
            'document_type' => $resume->document_type ? Str::headline(str_replace('_', ' ', $resume->document_type)) : null,
            'description' => $resume->description,
            'mime_type' => $resume->mime_type,
            'size' => $resume->size,
            'is_primary' => (bool) $resume->is_primary,
            'uploaded_at' => $resume->uploaded_at?->toDateString() ?? $resume->created_at?->toDateString(),
            'preview_url' => route('employer.candidates.resume.preview', [
                'application' => $applicationId,
                'resume' => $resume->id,
            ]),
            'download_url' => route('employer.candidates.resume.download', [
                'application' => $applicationId,
                'resume' => $resume->id,
            ]),
        ];
    }

    public function interview(ApplicationInterview $interview): array
    {
        return [
            'id' => $interview->id,
            'application_id' => $interview->vacancy_application_id,
            'candidate_id' => $interview->candidate_profile_id,
            'vacancy_id' => $interview->vacancy_id,
            'candidate_name' => $interview->candidate?->full_name,
            'candidate_headline' => $interview->candidate?->headline,
            'vacancy_title' => $interview->vacancy?->title,
            'scheduled_at' => $interview->scheduled_at?->toDateTimeString(),
            'scheduled_at_label' => $interview->scheduled_at?->format('D, d M Y \\a\\t H:i'),
            'ends_at' => $interview->ends_at?->toDateTimeString(),
            'ends_at_label' => $interview->ends_at?->format('D, d M Y \\a\\t H:i'),
            'timezone' => $interview->timezone,
            'meeting_type' => Str::headline($interview->meeting_type),
            'location' => $interview->location,
            'instructions' => $interview->instructions,
            'status' => $interview->status,
            'status_label' => Str::headline($interview->status),
            'candidate_response_note' => $interview->candidate_response_note,
            'responded_at' => $interview->responded_at?->toDateTimeString(),
            'responded_at_label' => $interview->responded_at?->format('D, d M Y \\a\\t H:i'),
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

    private function matchPayload(?array $match): ?array
    {
        if (! $match) {
            return null;
        }

        return [
            'score' => $match['score'] ?? null,
            'label' => $match['label'] ?? null,
            'reasons' => array_values($match['reasons'] ?? []),
            'vacancy_id' => $match['vacancy_id'] ?? null,
            'vacancy_title' => $match['vacancy_title'] ?? null,
        ];
    }
}
