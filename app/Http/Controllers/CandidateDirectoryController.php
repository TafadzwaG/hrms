<?php

namespace App\Http\Controllers;

use App\Models\CandidateProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CandidateDirectoryController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $highestEducation = $request->input('highest_education');
        $yearsExperience = $request->input('years_experience');
        $skills = $request->input('skills');

        $candidates = CandidateProfile::query()
            ->where('is_public', true)
            ->where('profile_visibility_status', 'active')
            ->when($search, fn ($q) => $q->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                    ->orWhere('headline', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            }))
            ->when($highestEducation, fn ($q) => $q->where('highest_education', $highestEducation))
            ->when($yearsExperience, fn ($q) => $q->where('years_experience', '>=', (int) $yearsExperience))
            ->when($skills, fn ($q) => $q->whereHas('skills', fn ($sq) => $sq->where('name', 'like', "%{$skills}%")))
            ->orderByDesc('listing_activated_at')
            ->paginate(25)
            ->through(fn (CandidateProfile $candidate) => [
                'id' => $candidate->id,
                'full_name' => $candidate->full_name,
                'headline' => $candidate->headline,
                'location' => $candidate->location,
                'city' => $candidate->city,
                'country' => $candidate->country,
                'highest_education' => $candidate->highest_education,
                'years_experience' => $candidate->years_experience,
                'current_job_title' => $candidate->current_job_title,
                'listing_activated_at' => optional($candidate->listing_activated_at)->toDateTimeString(),
                'links' => [
                    'show' => "/recruitment/directory/{$candidate->id}",
                ],
            ])
            ->withQueryString();

        return Inertia::render('Recruitment/Directory/Index', [
            'candidates' => $candidates,
            'filters' => [
                'search' => $search,
                'highest_education' => $highestEducation,
                'years_experience' => $yearsExperience,
                'skills' => $skills,
            ],
            'educationLevels' => CandidateProfile::EDUCATION_LEVELS,
        ]);
    }

    public function show(CandidateProfile $candidate)
    {
        abort_unless($candidate->is_public && $candidate->profile_visibility_status === 'active', 404);

        $candidate->load([
            'resumes' => fn ($q) => $q->where('is_primary', true),
            'educations',
            'experiences',
            'skills',
        ]);

        return Inertia::render('Recruitment/Directory/Show', [
            'candidate' => [
                'id' => $candidate->id,
                'full_name' => $candidate->full_name,
                'email' => $candidate->email,
                'phone' => $candidate->phone,
                'headline' => $candidate->headline,
                'summary' => $candidate->summary,
                'location' => $candidate->location,
                'city' => $candidate->city,
                'country' => $candidate->country,
                'highest_education' => $candidate->highest_education,
                'years_experience' => $candidate->years_experience,
                'current_employer' => $candidate->current_employer,
                'current_job_title' => $candidate->current_job_title,
                'linkedin_url' => $candidate->linkedin_url,
                'portfolio_url' => $candidate->portfolio_url,
                'listing_activated_at' => optional($candidate->listing_activated_at)->toDateTimeString(),
                'resumes' => $candidate->resumes->map(fn ($resume) => [
                    'id' => $resume->id,
                    'file_name' => $resume->file_name,
                    'is_primary' => $resume->is_primary,
                    'download_url' => "/recruitment/candidates/{$candidate->id}/resumes/{$resume->id}/download",
                ])->values()->all(),
                'educations' => $candidate->educations->map(fn ($edu) => [
                    'id' => $edu->id,
                    'institution' => $edu->institution,
                    'degree' => $edu->degree,
                    'field_of_study' => $edu->field_of_study,
                    'start_date' => optional($edu->start_date)->toDateString(),
                    'end_date' => optional($edu->end_date)->toDateString(),
                    'grade' => $edu->grade,
                ])->values()->all(),
                'experiences' => $candidate->experiences->map(fn ($exp) => [
                    'id' => $exp->id,
                    'company_name' => $exp->company_name,
                    'job_title' => $exp->job_title,
                    'start_date' => optional($exp->start_date)->toDateString(),
                    'end_date' => optional($exp->end_date)->toDateString(),
                    'is_current' => $exp->is_current,
                    'description' => $exp->description,
                ])->values()->all(),
                'skills' => $candidate->skills->map(fn ($skill) => [
                    'id' => $skill->id,
                    'name' => $skill->name,
                    'proficiency_level' => $skill->proficiency_level,
                    'years_experience' => $skill->years_experience,
                ])->values()->all(),
            ],
        ]);
    }
}
