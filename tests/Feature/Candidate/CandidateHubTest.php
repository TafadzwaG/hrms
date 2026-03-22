<?php

use App\Models\ApplicationInterview;
use App\Models\CandidateEducation;
use App\Models\CandidateExperience;
use App\Models\CandidateProfile;
use App\Models\CandidateResume;
use App\Models\CandidateSkill;
use App\Models\CompanyProfile;
use App\Models\User;
use App\Models\Vacancy;
use App\Models\VacancyApplication;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

function candidateHubCreateProfile(User $user, array $overrides = []): CandidateProfile
{
    return CandidateProfile::query()->withoutGlobalScopes()->create([
        'user_id' => $user->id,
        'full_name' => 'Candidate Demo',
        'email' => $user->email,
        'phone' => '+263771000001',
        'location' => 'Harare',
        'headline' => 'React TypeScript Developer',
        'professional_summary' => 'Full-stack engineer focused on React, Laravel, and product delivery.',
        'salary_currency' => 'USD',
        'years_experience' => 6,
        'highest_education' => 'bachelors',
        'profile_visibility_status' => 'active',
        'is_public' => true,
        'is_verified' => true,
        'stage' => 'listed',
        'status' => 'available',
        'metadata' => [
            'profile_views' => 42,
            'preferences' => [
                'job_alerts' => true,
                'newsletter' => false,
                'remote_only' => false,
                'preferred_work_modes' => ['remote'],
            ],
        ],
        ...$overrides,
    ]);
}

function candidateHubCreateCompany(array $overrides = []): CompanyProfile
{
    $owner = User::factory()->create();

    return CompanyProfile::query()->withoutGlobalScopes()->create([
        'owner_user_id' => $owner->id,
        'company_name' => 'Acme Talent Labs',
        'industry' => 'information_technology',
        'registration_number' => 'ACME-001',
        'email' => 'jobs@acme.test',
        'phone' => '+263771000010',
        'website' => 'https://acme.test',
        'address' => '1 Enterprise Way, Harare',
        'description' => 'Product engineering consultancy.',
        'status' => 'active',
        'approved_at' => now(),
        'created_by' => $owner->id,
        'updated_by' => $owner->id,
        ...$overrides,
    ]);
}

function candidateHubCreateVacancy(CompanyProfile $company, array $overrides = []): Vacancy
{
    return Vacancy::query()->withoutGlobalScopes()->create([
        'company_profile_id' => $company->id,
        'title' => 'Senior React Developer',
        'department' => 'Engineering',
        'category' => 'information_technology',
        'employment_type' => 'full_time',
        'work_mode' => 'remote',
        'location' => 'Harare',
        'description' => 'Build modern hiring workflows with React and Laravel.',
        'requirements' => 'React, TypeScript, Laravel, testing.',
        'responsibilities' => 'Ship frontend features and collaborate with product.',
        'salary_min' => 2500,
        'salary_max' => 4000,
        'currency' => 'USD',
        'application_deadline' => now()->addMonth()->toDateString(),
        'status' => 'published',
        'published_at' => now(),
        ...$overrides,
    ]);
}

function candidateHubCreateResume(CandidateProfile $candidate, array $overrides = []): CandidateResume
{
    return $candidate->resumes()->create([
        'file_name' => 'candidate-cv.pdf',
        'document_type' => 'resume',
        'file_path' => 'candidate-documents/'.$candidate->id.'/candidate-cv.pdf',
        'description' => 'Primary resume',
        'mime_type' => 'application/pdf',
        'size' => 1024,
        'is_primary' => true,
        'uploaded_by' => $candidate->user_id,
        'uploaded_at' => now(),
        ...$overrides,
    ]);
}

function candidateHubCreateApplication(CandidateProfile $candidate, Vacancy $vacancy, ?CandidateResume $resume = null, array $overrides = []): VacancyApplication
{
    return VacancyApplication::query()->create([
        'vacancy_id' => $vacancy->id,
        'candidate_profile_id' => $candidate->id,
        'resume_id' => $resume?->id,
        'cover_letter' => 'I would like to contribute to this role.',
        'status' => 'submitted',
        'applied_at' => now()->subDay(),
        'metadata' => ['source' => 'feature_test'],
        ...$overrides,
    ]);
}

function candidateHubCreateInterview(VacancyApplication $application, CompanyProfile $company, array $overrides = []): ApplicationInterview
{
    return ApplicationInterview::query()->create([
        'vacancy_application_id' => $application->id,
        'company_profile_id' => $company->id,
        'candidate_profile_id' => $application->candidate_profile_id,
        'vacancy_id' => $application->vacancy_id,
        'scheduled_at' => now()->addDays(2),
        'ends_at' => now()->addDays(2)->addHour(),
        'timezone' => 'Africa/Johannesburg',
        'meeting_type' => 'video',
        'location' => 'Google Meet',
        'instructions' => 'Join the interview five minutes early.',
        'status' => 'scheduled',
        ...$overrides,
    ]);
}

test('candidate hub redirects authenticated users without profiles to registration', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('candidate.dashboard'))
        ->assertRedirect(route('candidate.register'))
        ->assertSessionHas('error');
});

test('candidate dashboard and applications pages render database-backed data', function () {
    $user = User::factory()->create();
    $candidate = candidateHubCreateProfile($user);
    $resume = candidateHubCreateResume($candidate);

    $candidate->educations()->create([
        'institution' => 'University of Zimbabwe',
        'qualification' => 'BSc Computer Science',
        'field_of_study' => 'Software Engineering',
        'start_date' => '2016-01-01',
        'end_date' => '2019-12-01',
        'grade' => 'Upper Second',
    ]);

    $candidate->experiences()->create([
        'employer_name' => 'Pixel Works',
        'job_title' => 'Frontend Engineer',
        'start_date' => '2020-01-01',
        'end_date' => '2023-06-01',
        'currently_working' => false,
        'description' => 'Built enterprise dashboards.',
    ]);

    $candidate->skills()->create([
        'name' => 'React',
        'level' => 'expert',
        'years_experience' => 5,
    ]);

    $company = candidateHubCreateCompany();
    $appliedVacancy = candidateHubCreateVacancy($company);
    $recommendedVacancy = candidateHubCreateVacancy($company, [
        'title' => 'Laravel Platform Engineer',
    ]);

    candidateHubCreateApplication($candidate, $appliedVacancy, $resume);

    $this->actingAs($user)
        ->get(route('candidate.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Candidate/Dashboard')
            ->where('candidate.full_name', 'Candidate Demo')
            ->where('metrics.total_applications', 1)
            ->has('recentApplications', 1)
            ->has('resumes', 1)
            ->has('recommendedVacancies', 1)
            ->where('recommendedVacancies.0.title', $recommendedVacancy->title)
            ->has('recommendedVacancies.0.match.reasons.0')
        );

    $this->actingAs($user)
        ->get(route('candidate.applications'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Candidate/Applications')
            ->has('applications.data', 1)
            ->where('applications.data.0.vacancy_id', $appliedVacancy->id)
            ->where('applications.data.0.vacancy_title', $appliedVacancy->title)
            ->where('applications.data.0.company_name', $company->company_name)
        );
});

test('candidate applications search filters by role company and location', function () {
    $user = User::factory()->create();
    $candidate = candidateHubCreateProfile($user);
    $resume = candidateHubCreateResume($candidate);

    $remoteCompany = candidateHubCreateCompany([
        'company_name' => 'Atlas Remote Labs',
    ]);
    $onsiteCompany = candidateHubCreateCompany([
        'company_name' => 'Granite Systems',
    ]);

    $remoteVacancy = candidateHubCreateVacancy($remoteCompany, [
        'title' => 'React Platform Engineer',
        'location' => 'Remote',
    ]);
    $onsiteVacancy = candidateHubCreateVacancy($onsiteCompany, [
        'title' => 'Payroll Analyst',
        'location' => 'Bulawayo',
        'department' => 'Finance',
    ]);

    candidateHubCreateApplication($candidate, $remoteVacancy, $resume);
    candidateHubCreateApplication($candidate, $onsiteVacancy, $resume, [
        'applied_at' => now(),
    ]);

    $this->actingAs($user)
        ->get(route('candidate.applications', ['search' => 'React']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Candidate/Applications')
            ->where('filters.search', 'React')
            ->has('applications.data', 1)
            ->where('applications.data.0.vacancy_title', 'React Platform Engineer')
        );

    $this->actingAs($user)
        ->get(route('candidate.applications', ['search' => 'Atlas Remote Labs']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Candidate/Applications')
            ->where('filters.search', 'Atlas Remote Labs')
            ->has('applications.data', 1)
            ->where('applications.data.0.company_name', 'Atlas Remote Labs')
        );

    $this->actingAs($user)
        ->get(route('candidate.applications', ['search' => 'Bulawayo']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Candidate/Applications')
            ->where('filters.search', 'Bulawayo')
            ->has('applications.data', 1)
            ->where('applications.data.0.location', 'Bulawayo')
        );
});

test('candidate can update profile details summary and work experience records', function () {
    $user = User::factory()->create();
    $candidate = candidateHubCreateProfile($user);

    $this->actingAs($user)
        ->from(route('candidate.profile'))
        ->put(route('candidate.profile.update'), [
            'full_name' => 'Updated Candidate',
            'email' => 'updated-candidate@example.com',
            'phone' => '+263771111111',
            'alt_phone' => '+263771222222',
            'national_id' => 'ID-2026-0001',
            'gender' => 'female',
            'date_of_birth' => '1995-05-01',
            'location' => 'Bulawayo',
            'headline' => 'Senior Frontend Developer',
            'years_experience' => 8,
            'expected_salary' => 4200,
            'salary_currency' => 'USD',
            'highest_education' => 'masters',
            'profile_visibility_status' => 'active',
            'is_public' => true,
        ])
        ->assertRedirect(route('candidate.profile'));

    $candidate = CandidateProfile::query()->withoutGlobalScopes()->findOrFail($candidate->id);
    expect($candidate->full_name)->toBe('Updated Candidate')
        ->and($candidate->email)->toBe('updated-candidate@example.com')
        ->and($candidate->highest_education)->toBe('masters');

    $this->actingAs($user)
        ->from(route('candidate.profile'))
        ->put(route('candidate.profile.summary.update'), [
            'professional_summary' => 'Updated summary for platform engineering roles.',
            'headline' => 'Platform Engineer',
            'years_experience' => 9,
            'highest_education' => 'doctorate',
            'expected_salary' => 5000,
            'salary_currency' => 'USD',
        ])
        ->assertRedirect(route('candidate.profile'));

    $candidate = CandidateProfile::query()->withoutGlobalScopes()->findOrFail($candidate->id);
    expect($candidate->professional_summary)->toBe('Updated summary for platform engineering roles.')
        ->and($candidate->headline)->toBe('Platform Engineer')
        ->and($candidate->years_experience)->toBe(9);

    $this->actingAs($user)
        ->from(route('candidate.profile'))
        ->post(route('candidate.profile.experiences.store'), [
            'employer_name' => 'Launchpad Labs',
            'job_title' => 'Engineering Lead',
            'start_date' => '2021-01-01',
            'currently_working' => true,
            'description' => 'Leading platform delivery.',
        ])
        ->assertRedirect(route('candidate.profile'));

    $experience = CandidateExperience::query()->firstOrFail();

    $this->actingAs($user)
        ->from(route('candidate.profile'))
        ->put(route('candidate.profile.experiences.update', $experience->id), [
            'employer_name' => 'Launchpad Labs',
            'job_title' => 'Head of Engineering',
            'start_date' => '2021-01-01',
            'end_date' => '2024-02-01',
            'currently_working' => false,
            'description' => 'Leading engineering execution.',
        ])
        ->assertRedirect(route('candidate.profile'));

    $experience->refresh();
    expect($experience->job_title)->toBe('Head of Engineering')
        ->and($experience->currently_working)->toBeFalse();

    $this->actingAs($user)
        ->from(route('candidate.profile'))
        ->delete(route('candidate.profile.experiences.destroy', $experience->id))
        ->assertRedirect(route('candidate.profile'));

    expect(CandidateExperience::query()->find($experience->id))->toBeNull();
});

test('candidate can manage education skills and settings', function () {
    $user = User::factory()->create();
    $candidate = candidateHubCreateProfile($user);

    $this->actingAs($user)
        ->from(route('candidate.education'))
        ->post(route('candidate.education.store'), [
            'institution' => 'National University',
            'qualification' => 'MBA',
            'field_of_study' => 'Business Technology',
            'start_date' => '2022-01-01',
            'end_date' => '2024-01-01',
            'grade' => 'Distinction',
        ])
        ->assertRedirect(route('candidate.education'));

    $education = CandidateEducation::query()->firstOrFail();

    $this->actingAs($user)
        ->from(route('candidate.education'))
        ->put(route('candidate.education.update', $education->id), [
            'institution' => 'National University',
            'qualification' => 'Executive MBA',
            'field_of_study' => 'Digital Strategy',
            'start_date' => '2022-01-01',
            'end_date' => '2024-01-01',
            'grade' => 'Distinction',
        ])
        ->assertRedirect(route('candidate.education'));

    $education->refresh();
    expect($education->qualification)->toBe('Executive MBA');

    $this->actingAs($user)
        ->from(route('candidate.skills'))
        ->post(route('candidate.skills.store'), [
            'name' => 'Laravel',
            'level' => 'expert',
            'years_experience' => 6,
        ])
        ->assertRedirect(route('candidate.skills'));

    $skill = CandidateSkill::query()->firstOrFail();

    $this->actingAs($user)
        ->from(route('candidate.skills'))
        ->put(route('candidate.skills.update', $skill->id), [
            'name' => 'Laravel',
            'level' => 'advanced',
            'years_experience' => 7,
        ])
        ->assertRedirect(route('candidate.skills'));

    $skill->refresh();
    expect($skill->level)->toBe('advanced')
        ->and($skill->years_experience)->toBe(7);

    $this->actingAs($user)
        ->from(route('candidate.settings'))
        ->put(route('candidate.settings.update'), [
            'job_alerts' => false,
            'newsletter' => true,
            'remote_only' => true,
            'preferred_work_modes' => ['remote', 'hybrid'],
        ])
        ->assertRedirect(route('candidate.settings'));

    $candidate = CandidateProfile::query()->withoutGlobalScopes()->findOrFail($candidate->id);
    expect(data_get($candidate->metadata, 'preferences.job_alerts'))->toBeFalse()
        ->and(data_get($candidate->metadata, 'preferences.newsletter'))->toBeTrue()
        ->and(data_get($candidate->metadata, 'preferences.preferred_work_modes'))->toBe(['remote', 'hybrid']);

    $this->actingAs($user)
        ->from(route('candidate.skills'))
        ->delete(route('candidate.skills.destroy', $skill->id))
        ->assertRedirect(route('candidate.skills'));

    $this->actingAs($user)
        ->from(route('candidate.education'))
        ->delete(route('candidate.education.destroy', $education->id))
        ->assertRedirect(route('candidate.education'));

    expect(CandidateSkill::query()->find($skill->id))->toBeNull()
        ->and(CandidateEducation::query()->find($education->id))->toBeNull();
});

test('candidate can upload download reprioritize and delete documents', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $candidate = candidateHubCreateProfile($user);

    Storage::disk('public')->put(
        'candidate-documents/'.$candidate->id.'/legacy-resume.pdf',
        'legacy resume'
    );

    $legacyDocument = candidateHubCreateResume($candidate, [
        'file_name' => 'legacy-resume.pdf',
        'file_path' => 'candidate-documents/'.$candidate->id.'/legacy-resume.pdf',
    ]);

    $upload = UploadedFile::fake()->create('portfolio.pdf', 256, 'application/pdf');

    $this->actingAs($user)
        ->from(route('candidate.documents'))
        ->post(route('candidate.documents.store'), [
            'document' => $upload,
            'document_type' => 'portfolio',
            'description' => 'Updated portfolio',
            'is_primary' => false,
        ])
        ->assertRedirect(route('candidate.documents'));

    $document = CandidateResume::query()
        ->where('candidate_profile_id', $candidate->id)
        ->where('file_name', 'portfolio.pdf')
        ->firstOrFail();

    expect($document->is_primary)->toBeFalse()
        ->and($legacyDocument->fresh()->is_primary)->toBeTrue();

    $this->actingAs($user)
        ->get(route('candidate.documents'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Candidate/Documents')
            ->has('documents', 2)
            ->has('documents.0.preview_url')
            ->has('documents.1.preview_url')
        );

    $this->actingAs($user)
        ->get(route('candidate.documents.download', $document->id))
        ->assertOk()
        ->assertDownload('portfolio.pdf');

    $this->actingAs($user)
        ->get(route('candidate.documents.preview', $document->id))
        ->assertOk()
        ->assertHeader('Content-Disposition', 'inline; filename='.$document->file_name);

    $this->actingAs($user)
        ->from(route('candidate.documents'))
        ->put(route('candidate.documents.primary', $document->id))
        ->assertRedirect(route('candidate.documents'));

    expect($document->fresh()->is_primary)->toBeTrue()
        ->and($legacyDocument->fresh()->is_primary)->toBeFalse();

    $this->actingAs($user)
        ->from(route('candidate.documents'))
        ->delete(route('candidate.documents.destroy', $document->id))
        ->assertRedirect(route('candidate.documents'));

    expect(CandidateResume::query()->find($document->id))->toBeNull()
        ->and($legacyDocument->fresh()->is_primary)->toBeTrue();
});

test('candidate can browse jobs apply with a primary resume and cannot apply twice', function () {
    $user = User::factory()->create();
    $candidate = candidateHubCreateProfile($user);
    $resume = candidateHubCreateResume($candidate);
    $company = candidateHubCreateCompany();
    $vacancy = candidateHubCreateVacancy($company);

    candidateHubCreateVacancy($company, [
        'title' => 'Laravel Backend Engineer',
        'category' => 'engineering',
    ]);

    $this->actingAs($user)
        ->get(route('candidate.jobs', ['search' => 'Senior React']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Candidate/BrowseJobs')
            ->has('vacancies', 1)
            ->where('vacancies.0.title', $vacancy->title)
            ->where('vacancies.0.has_applied', false)
        );

    $this->actingAs($user)
        ->from(route('candidate.jobs'))
        ->post(route('candidate.jobs.apply', $vacancy->id), [
            'cover_letter' => 'I have shipped complex HR dashboards with this stack.',
        ])
        ->assertRedirect(route('candidate.jobs'));

    $application = VacancyApplication::query()
        ->where('vacancy_id', $vacancy->id)
        ->where('candidate_profile_id', $candidate->id)
        ->first();

    expect($application)->not->toBeNull()
        ->and($application?->resume_id)->toBe($resume->id)
        ->and($application?->status)->toBe('submitted');

    $this->actingAs($user)
        ->from(route('candidate.jobs'))
        ->post(route('candidate.jobs.apply', $vacancy->id), [
            'cover_letter' => 'Duplicate submission.',
        ])
        ->assertRedirect(route('candidate.jobs'))
        ->assertSessionHas('error', 'You have already applied for this vacancy.');

    expect(
        VacancyApplication::query()
            ->where('vacancy_id', $vacancy->id)
            ->where('candidate_profile_id', $candidate->id)
            ->count()
    )->toBe(1);
});

test('candidate browse jobs prioritizes personalized vacancy matches', function () {
    $user = User::factory()->create();
    $candidate = candidateHubCreateProfile($user, [
        'headline' => 'React TypeScript Engineer',
        'professional_summary' => 'Builds React platforms and frontend systems.',
        'metadata' => [
            'preferences' => [
                'job_alerts' => true,
                'newsletter' => false,
                'remote_only' => true,
                'preferred_work_modes' => ['remote'],
            ],
        ],
    ]);

    $candidate->skills()->create([
        'name' => 'React',
        'level' => 'expert',
        'years_experience' => 5,
    ]);

    $company = candidateHubCreateCompany();

    candidateHubCreateVacancy($company, [
        'title' => 'Finance Operations Manager',
        'department' => 'Finance',
        'category' => 'finance',
        'work_mode' => 'onsite',
        'location' => 'Bulawayo',
        'published_at' => now()->subMinute(),
        'description' => 'Lead finance operations and reporting.',
        'requirements' => 'Finance, accounting, compliance.',
    ]);

    $recommendedVacancy = candidateHubCreateVacancy($company, [
        'title' => 'Frontend Platform Engineer',
        'department' => 'Engineering',
        'category' => 'information_technology',
        'work_mode' => 'remote',
        'location' => 'Remote',
        'published_at' => now()->subDay(),
        'description' => 'Build React and TypeScript hiring workflows.',
        'requirements' => 'React, TypeScript, frontend systems.',
    ]);

    $this->actingAs($user)
        ->get(route('candidate.jobs'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Candidate/BrowseJobs')
            ->where('vacancies.0.title', $recommendedVacancy->title)
            ->where('vacancies.0.match.label', 'Strong Match')
            ->has('vacancies.0.match.reasons.0')
        );
});

test('candidate can view and respond to scheduled interviews from applications', function () {
    $user = User::factory()->create();
    $candidate = candidateHubCreateProfile($user);
    $resume = candidateHubCreateResume($candidate);
    $company = candidateHubCreateCompany();
    $vacancy = candidateHubCreateVacancy($company);
    $application = candidateHubCreateApplication($candidate, $vacancy, $resume, [
        'status' => 'interview',
    ]);

    $interview = candidateHubCreateInterview($application, $company);

    $this->actingAs($user)
        ->get(route('candidate.applications'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Candidate/Applications')
            ->has('applications.data.0.interviews', 1)
            ->where('applications.data.0.interviews.0.status', 'scheduled')
        );

    $this->actingAs($user)
        ->from(route('candidate.applications'))
        ->patch(route('candidate.interviews.respond', $interview->id), [
            'response' => 'accepted',
            'candidate_response_note' => 'Confirmed. I will be available.',
        ])
        ->assertRedirect(route('candidate.applications'));

    $interview->refresh();
    expect($interview->status)->toBe('accepted')
        ->and($interview->candidate_response_note)->toBe('Confirmed. I will be available.')
        ->and($interview->responded_at)->not->toBeNull();
});

test('candidate can withdraw an active application from my applications', function () {
    $user = User::factory()->create();
    $candidate = candidateHubCreateProfile($user);
    $resume = candidateHubCreateResume($candidate);
    $company = candidateHubCreateCompany();
    $vacancy = candidateHubCreateVacancy($company);
    $application = candidateHubCreateApplication($candidate, $vacancy, $resume, [
        'status' => 'interview',
    ]);

    $interview = candidateHubCreateInterview($application, $company, [
        'status' => 'scheduled',
    ]);

    $this->actingAs($user)
        ->from(route('candidate.applications'))
        ->patch(route('candidate.applications.withdraw', $application->id))
        ->assertRedirect(route('candidate.applications'))
        ->assertSessionHas('success', 'Application withdrawn successfully.');

    $application->refresh();
    $interview->refresh();

    expect($application->status)->toBe('withdrawn')
        ->and(data_get($application->metadata, 'withdrawn_from'))->toBe('candidate_hub')
        ->and($interview->status)->toBe('cancelled')
        ->and($interview->candidate_response_note)->toBe('Application withdrawn by candidate.');
});
