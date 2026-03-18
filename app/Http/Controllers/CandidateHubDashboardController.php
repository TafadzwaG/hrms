<?php

namespace App\Http\Controllers;

use App\Models\CandidateProfile;
use App\Models\Vacancy;
use App\Models\VacancyApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class CandidateHubDashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $candidate = CandidateProfile::withoutGlobalScope(\App\Models\Scopes\OrganizationScope::class)
            ->where('user_id', $user->id)
            ->withCount(['applications', 'resumes', 'educations', 'experiences', 'skills'])
            ->first();

        $metrics = [
            'total_applications' => $candidate?->applications_count ?? 0,
            'resumes_uploaded' => $candidate?->resumes_count ?? 0,
            'profile_views' => 0, // placeholder
            'listing_status' => $candidate?->profile_visibility_status ?? 'draft',
        ];

        // Application stats by status
        $applicationsByStatus = [];
        $recentApplications = [];

        if ($candidate) {
            $applicationsByStatus = VacancyApplication::where('candidate_profile_id', $candidate->id)
                ->selectRaw('status, count(*) as count')
                ->groupBy('status')
                ->pluck('count', 'status')
                ->all();

            $recentApplications = VacancyApplication::where('candidate_profile_id', $candidate->id)
                ->with(['vacancy:id,title,location,employment_type,company_profile_id', 'vacancy.company:id,company_name'])
                ->orderByDesc('created_at')
                ->limit(5)
                ->get()
                ->map(fn (VacancyApplication $app) => [
                    'id' => $app->id,
                    'vacancy_title' => $app->vacancy?->title ?? 'Unknown',
                    'company_name' => $app->vacancy?->company?->company_name ?? 'Unknown',
                    'location' => $app->vacancy?->location,
                    'employment_type' => $app->vacancy?->employment_type,
                    'status' => $app->status,
                    'applied_at' => $app->applied_at?->toDateString() ?? $app->created_at->toDateString(),
                ])
                ->all();
        }

        // Educations
        $educations = [];
        if ($candidate) {
            $educations = $candidate->educations()
                ->orderByDesc('end_date')
                ->get()
                ->map(fn ($edu) => [
                    'id' => $edu->id,
                    'institution' => $edu->institution,
                    'qualification' => $edu->qualification,
                    'field_of_study' => $edu->field_of_study,
                    'start_date' => $edu->start_date?->toDateString(),
                    'end_date' => $edu->end_date?->toDateString(),
                    'grade' => $edu->grade,
                ])
                ->all();
        }

        // Experiences
        $experiences = [];
        if ($candidate) {
            $experiences = $candidate->experiences()
                ->orderByDesc('start_date')
                ->get()
                ->map(fn ($exp) => [
                    'id' => $exp->id,
                    'employer_name' => $exp->employer_name,
                    'job_title' => $exp->job_title,
                    'start_date' => $exp->start_date?->toDateString(),
                    'end_date' => $exp->end_date?->toDateString(),
                    'currently_working' => $exp->currently_working,
                    'description' => $exp->description,
                ])
                ->all();
        }

        // Skills
        $skills = [];
        if ($candidate) {
            $skills = $candidate->skills()
                ->orderByDesc('years_experience')
                ->get()
                ->map(fn ($skill) => [
                    'id' => $skill->id,
                    'name' => $skill->name,
                    'level' => $skill->level,
                    'years_experience' => $skill->years_experience,
                ])
                ->all();
        }

        // Resumes
        $resumes = [];
        if ($candidate) {
            $resumes = $candidate->resumes()
                ->orderByDesc('created_at')
                ->get()
                ->map(fn ($resume) => [
                    'id' => $resume->id,
                    'file_name' => $resume->file_name,
                    'is_primary' => $resume->is_primary,
                    'uploaded_at' => $resume->uploaded_at?->toDateString() ?? $resume->created_at->toDateString(),
                ])
                ->all();
        }

        // Profile completeness
        $completeness = 0;
        if ($candidate) {
            $fields = ['full_name', 'email', 'phone', 'headline', 'professional_summary', 'location', 'years_experience', 'highest_education'];
            $filled = collect($fields)->filter(fn ($f) => !empty($candidate->$f))->count();
            $completeness = (int) round(($filled / count($fields)) * 60);
            if (($candidate->resumes_count ?? 0) > 0) $completeness += 15;
            if (($candidate->educations_count ?? 0) > 0) $completeness += 10;
            if (($candidate->experiences_count ?? 0) > 0) $completeness += 10;
            if (($candidate->skills_count ?? 0) > 0) $completeness += 5;
            $completeness = min($completeness, 100);
        }

        // Recommended vacancies
        $recommendedVacancies = Vacancy::where('status', 'published')
            ->with('company:id,company_name')
            ->orderByDesc('published_at')
            ->limit(6)
            ->get()
            ->map(fn (Vacancy $v) => [
                'id' => $v->id,
                'title' => $v->title,
                'company_name' => $v->company?->company_name ?? 'Unknown',
                'location' => $v->location,
                'employment_type' => $v->employment_type,
                'work_mode' => $v->work_mode,
                'category' => $v->category,
                'salary_min' => $v->salary_min,
                'salary_max' => $v->salary_max,
                'currency' => $v->currency,
                'application_deadline' => $v->application_deadline?->toDateString(),
            ])
            ->all();

        return Inertia::render('Candidate/Dashboard', [
            'candidate' => $candidate ? [
                'id' => $candidate->id,
                'full_name' => $candidate->full_name,
                'email' => $candidate->email,
                'phone' => $candidate->phone,
                'alt_phone' => $candidate->alt_phone,
                'national_id' => $candidate->national_id,
                'gender' => $candidate->gender,
                'date_of_birth' => $candidate->date_of_birth?->toDateString(),
                'location' => $candidate->location,
                'headline' => $candidate->headline,
                'professional_summary' => $candidate->professional_summary,
                'expected_salary' => $candidate->expected_salary,
                'salary_currency' => $candidate->salary_currency,
                'years_experience' => $candidate->years_experience,
                'highest_education' => $candidate->highest_education,
                'profile_visibility_status' => $candidate->profile_visibility_status,
                'is_public' => $candidate->is_public,
                'is_verified' => $candidate->is_verified,
                'listing_activated_at' => $candidate->listing_activated_at?->toDateString(),
                'listing_expires_at' => $candidate->listing_expires_at?->toDateString(),
                'stage' => $candidate->stage,
                'status' => $candidate->status,
                'created_at' => $candidate->created_at?->toDateString(),
            ] : null,
            'metrics' => $metrics,
            'completeness' => $completeness,
            'applicationsByStatus' => $applicationsByStatus,
            'recentApplications' => $recentApplications,
            'educations' => $educations,
            'experiences' => $experiences,
            'skills' => $skills,
            'resumes' => $resumes,
            'recommendedVacancies' => $recommendedVacancies,
        ]);
    }
}
