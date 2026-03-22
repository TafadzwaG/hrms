<?php

namespace App\Support\Hubs;

use App\Models\CandidateEducation;
use App\Models\CandidateExperience;
use App\Models\CandidateProfile;
use App\Models\CandidateResume;
use App\Models\CandidateSkill;
use App\Models\Vacancy;
use App\Models\VacancyApplication;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class CandidateHubPresenter
{
    public function profile(CandidateProfile $candidate): array
    {
        return [
            'id' => $candidate->id,
            'full_name' => $candidate->full_name,
            'email' => $candidate->email,
            'phone' => $candidate->phone,
            'location' => $candidate->location,
            'gender' => $candidate->gender ? Str::headline($candidate->gender) : null,
            'date_of_birth' => $candidate->date_of_birth?->toDateString(),
            'years_experience' => $candidate->years_experience,
            'expected_salary' => $this->decimal($candidate->expected_salary),
            'salary_currency' => $candidate->salary_currency,
            'highest_education' => $candidate->highest_education,
            'professional_summary' => $candidate->professional_summary,
            'profile_visibility_status' => $candidate->profile_visibility_status,
            'is_verified' => (bool) $candidate->is_verified,
            'stage' => $candidate->stage,
            'status' => $candidate->status,
            'listing_activated_at' => $candidate->listing_activated_at?->toDateString(),
            'listing_expires_at' => $candidate->listing_expires_at?->toDateString(),
            'headline' => $candidate->headline,
            'alt_phone' => $candidate->alt_phone,
            'national_id' => $candidate->national_id,
            'is_public' => (bool) $candidate->is_public,
        ];
    }

    public function metrics(CandidateProfile $candidate): array
    {
        return [
            'total_applications' => (int) ($candidate->applications_count ?? $candidate->applications()->count()),
            'resumes_uploaded' => (int) ($candidate->resumes_count ?? $candidate->resumes()->count()),
            'profile_views' => (int) data_get($candidate->metadata, 'profile_views', 0),
            'skills_count' => (int) ($candidate->skills_count ?? $candidate->skills()->count()),
        ];
    }

    public function completeness(CandidateProfile $candidate): int
    {
        $baseFields = [
            $candidate->full_name,
            $candidate->email,
            $candidate->phone,
            $candidate->location,
            $candidate->headline,
            $candidate->professional_summary,
            $candidate->years_experience,
            $candidate->highest_education,
        ];

        $baseScore = (int) round((collect($baseFields)->filter(fn ($value) => filled($value))->count() / count($baseFields)) * 60);
        $documents = ($candidate->resumes_count ?? $candidate->resumes()->count()) > 0 ? 15 : 0;
        $education = ($candidate->educations_count ?? $candidate->educations()->count()) > 0 ? 10 : 0;
        $experience = ($candidate->experiences_count ?? $candidate->experiences()->count()) > 0 ? 10 : 0;
        $skills = ($candidate->skills_count ?? $candidate->skills()->count()) > 0 ? 5 : 0;

        return min(100, $baseScore + $documents + $education + $experience + $skills);
    }

    public function applicationsByStatus(Collection $applications): array
    {
        return $applications
            ->groupBy('status')
            ->map(fn (Collection $group) => $group->count())
            ->sortKeys()
            ->all();
    }

    public function application(VacancyApplication $application): array
    {
        $vacancy = $application->vacancy;
        $company = $vacancy?->company;

        return [
            'id' => $application->id,
            'status' => $application->status,
            'applied_at' => $application->applied_at?->toDateString() ?? $application->created_at?->toDateString(),
            'cover_letter' => $application->cover_letter,
            'notes' => $application->notes,
            'vacancy_id' => $vacancy?->id,
            'vacancy_title' => $vacancy?->title,
            'company_name' => $company?->company_name,
            'location' => $vacancy?->location,
            'employment_type' => $vacancy?->employment_type ? Str::headline(str_replace('_', ' ', $vacancy->employment_type)) : null,
            'work_mode' => $vacancy?->work_mode ? Str::headline(str_replace('_', ' ', $vacancy->work_mode)) : null,
            'salary_min' => $this->decimal($vacancy?->salary_min),
            'salary_max' => $this->decimal($vacancy?->salary_max),
            'currency' => $vacancy?->currency,
            'resume' => $application->resume ? [
                'id' => $application->resume->id,
                'file_name' => $application->resume->file_name,
            ] : null,
        ];
    }

    public function education(CandidateEducation $education): array
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

    public function experience(CandidateExperience $experience): array
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

    public function skill(CandidateSkill $skill): array
    {
        return [
            'id' => $skill->id,
            'name' => $skill->name,
            'level' => $skill->level,
            'years_experience' => $skill->years_experience,
        ];
    }

    public function document(CandidateResume $resume): array
    {
        return [
            'id' => $resume->id,
            'file_name' => $resume->file_name,
            'document_type' => $resume->document_type,
            'description' => $resume->description,
            'mime_type' => $resume->mime_type,
            'size' => $resume->size,
            'is_primary' => (bool) $resume->is_primary,
            'uploaded_at' => $resume->uploaded_at?->toDateString() ?? $resume->created_at?->toDateString(),
            'download_url' => route('candidate.documents.download', $resume->id),
        ];
    }

    public function vacancy(Vacancy $vacancy, ?VacancyApplication $application = null): array
    {
        return [
            'id' => $vacancy->id,
            'title' => $vacancy->title,
            'company_name' => $vacancy->company?->company_name,
            'location' => $vacancy->location,
            'employment_type' => $vacancy->employment_type ? Str::headline(str_replace('_', ' ', $vacancy->employment_type)) : null,
            'work_mode' => $vacancy->work_mode ? Str::headline(str_replace('_', ' ', $vacancy->work_mode)) : null,
            'salary_min' => $this->decimal($vacancy->salary_min),
            'salary_max' => $this->decimal($vacancy->salary_max),
            'currency' => $vacancy->currency,
            'department' => $vacancy->department,
            'category' => $vacancy->category,
            'description' => $vacancy->description,
            'requirements' => $vacancy->requirements,
            'responsibilities' => $vacancy->responsibilities,
            'application_deadline' => $vacancy->application_deadline?->toDateString(),
            'status' => $vacancy->status,
            'published_at' => $vacancy->published_at?->toDateString(),
            'has_applied' => (bool) $application,
            'application_status' => $application?->status,
        ];
    }

    public function settings(CandidateProfile $candidate): array
    {
        return [
            'preferences' => [
                'job_alerts' => (bool) data_get($candidate->metadata, 'preferences.job_alerts', true),
                'newsletter' => (bool) data_get($candidate->metadata, 'preferences.newsletter', false),
                'remote_only' => (bool) data_get($candidate->metadata, 'preferences.remote_only', false),
                'preferred_work_modes' => data_get($candidate->metadata, 'preferences.preferred_work_modes', []),
            ],
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
