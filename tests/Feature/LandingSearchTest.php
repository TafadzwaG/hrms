<?php

use App\Models\CandidateProfile;
use App\Models\CandidateResume;
use App\Models\CompanyProfile;
use App\Models\User;
use App\Models\Vacancy;
use App\Models\VacancyApplication;
use Inertia\Testing\AssertableInertia as Assert;

function landingSearchCreateCompany(array $overrides = []): CompanyProfile
{
    $owner = User::factory()->create();

    return CompanyProfile::query()->withoutGlobalScopes()->create([
        'owner_user_id' => $owner->id,
        'organization_id' => null,
        'company_name' => 'Northwind Labs',
        'industry' => 'information_technology',
        'registration_number' => 'NWL-001',
        'email' => 'jobs@northwind.test',
        'phone' => '+263771999100',
        'website' => 'https://northwind.test',
        'address' => '11 Borrowdale Road, Harare',
        'description' => 'Product team building recruitment software.',
        'status' => 'active',
        'approved_at' => now(),
        'created_by' => $owner->id,
        'updated_by' => $owner->id,
        ...$overrides,
    ]);
}

function landingSearchCreateVacancy(CompanyProfile $company, array $overrides = []): Vacancy
{
    return Vacancy::query()->withoutGlobalScopes()->create([
        'company_profile_id' => $company->id,
        'title' => 'Senior React Engineer',
        'department' => 'Engineering',
        'category' => 'information_technology',
        'employment_type' => 'full_time',
        'work_mode' => 'remote',
        'location' => 'Remote',
        'description' => 'Build polished candidate search experiences with React and TypeScript.',
        'requirements' => 'React, TypeScript, product thinking.',
        'responsibilities' => 'Own frontend delivery and collaborate with design.',
        'salary_min' => 2400,
        'salary_max' => 3600,
        'currency' => 'USD',
        'application_deadline' => now()->addMonth()->toDateString(),
        'status' => 'published',
        'published_at' => now()->subDay(),
        ...$overrides,
    ]);
}

function landingSearchCreateCandidateProfile(User $user, array $overrides = []): CandidateProfile
{
    return CandidateProfile::query()->withoutGlobalScopes()->create([
        'user_id' => $user->id,
        'organization_id' => null,
        'full_name' => 'Landing Candidate',
        'email' => $user->email,
        'phone' => '+263771111000',
        'location' => 'Harare',
        'headline' => 'Frontend Engineer',
        'professional_summary' => 'Builds polished frontend workflows.',
        'salary_currency' => 'USD',
        'years_experience' => 5,
        'highest_education' => 'bachelors',
        'profile_visibility_status' => 'active',
        'is_public' => true,
        'is_verified' => true,
        'stage' => 'listed',
        'status' => 'available',
        ...$overrides,
    ]);
}

function landingSearchCreateResume(CandidateProfile $candidate, array $overrides = []): CandidateResume
{
    return CandidateResume::query()->create([
        'candidate_profile_id' => $candidate->id,
        'file_name' => 'landing-candidate-cv.pdf',
        'document_type' => 'resume',
        'file_path' => 'candidate-documents/'.$candidate->id.'/landing-candidate-cv.pdf',
        'description' => 'Primary resume',
        'mime_type' => 'application/pdf',
        'size' => 1024,
        'is_primary' => true,
        'uploaded_by' => $candidate->user_id,
        'uploaded_at' => now(),
        ...$overrides,
    ]);
}

test('public search page renders published vacancies with query filters', function () {
    $company = landingSearchCreateCompany();
    $matchingVacancy = landingSearchCreateVacancy($company);

    landingSearchCreateVacancy($company, [
        'title' => 'Finance Manager',
        'department' => 'Finance',
        'category' => 'finance',
        'work_mode' => 'onsite',
        'location' => 'Harare',
        'description' => 'Lead finance operations and reporting.',
        'requirements' => 'Finance, compliance, accounting.',
    ]);

    landingSearchCreateVacancy($company, [
        'title' => 'Hidden Draft Role',
        'status' => 'draft',
        'published_at' => null,
    ]);

    $this->get(route('marketplace.search', [
        'q' => 'React',
        'location' => 'remote',
        'work_mode' => 'remote',
    ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Public/SearchResults')
            ->where('filters.q', 'React')
            ->where('filters.location', 'remote')
            ->where('filters.work_mode', 'remote')
            ->has('jobs', 1)
            ->where('jobs.0.title', $matchingVacancy->title)
        );
});

test('public search page surfaces personalized match insights for candidate users', function () {
    $company = landingSearchCreateCompany();
    $matchingVacancy = landingSearchCreateVacancy($company);

    landingSearchCreateVacancy($company, [
        'title' => 'Finance Manager',
        'department' => 'Finance',
        'category' => 'finance',
        'work_mode' => 'onsite',
        'location' => 'Harare',
        'description' => 'Lead finance operations and reporting.',
        'requirements' => 'Finance, compliance, accounting.',
    ]);

    $user = User::factory()->create();
    $candidate = landingSearchCreateCandidateProfile($user, [
        'headline' => 'Senior React Engineer',
        'professional_summary' => 'Builds React and TypeScript hiring experiences.',
    ]);

    $candidate->skills()->create([
        'name' => 'React',
        'level' => 'expert',
        'years_experience' => 5,
    ]);

    $this->actingAs($user)
        ->get(route('marketplace.search', ['q' => 'React']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Public/SearchResults')
            ->where('jobs.0.title', $matchingVacancy->title)
            ->where('jobs.0.match.label', 'Strong Match')
            ->has('jobs.0.match.reasons.0')
        );
});

test('public vacancy detail orders related jobs by exchange relevance', function () {
    $company = landingSearchCreateCompany();
    $sourceVacancy = landingSearchCreateVacancy($company, [
        'title' => 'Senior React Engineer',
        'department' => 'Engineering',
        'category' => 'information_technology',
        'work_mode' => 'remote',
        'description' => 'Build React and TypeScript candidate experiences.',
        'requirements' => 'React, TypeScript, frontend systems.',
    ]);

    landingSearchCreateVacancy($company, [
        'title' => 'Frontend Platform Engineer',
        'department' => 'Engineering',
        'category' => 'information_technology',
        'work_mode' => 'remote',
        'description' => 'React, TypeScript, frontend platform work.',
        'requirements' => 'React, TypeScript, frontend architecture.',
    ]);

    landingSearchCreateVacancy($company, [
        'title' => 'Finance Manager',
        'department' => 'Finance',
        'category' => 'finance',
        'work_mode' => 'onsite',
        'location' => 'Harare',
        'description' => 'Lead finance operations and reporting.',
        'requirements' => 'Finance, compliance, accounting.',
    ]);

    $this->get(route('marketplace.jobs.show', $sourceVacancy->id))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Public/JobDetail')
            ->where('relatedJobs.0.title', 'Frontend Platform Engineer')
        );
});

test('public vacancy detail personalizes related jobs for logged-in candidates', function () {
    $company = landingSearchCreateCompany();
    $sourceVacancy = landingSearchCreateVacancy($company, [
        'title' => 'Engineering Delivery Manager',
        'department' => 'Engineering',
        'category' => 'information_technology',
        'work_mode' => 'remote',
        'description' => 'Lead engineering delivery across product teams.',
        'requirements' => 'Planning, stakeholder communication, and execution.',
        'responsibilities' => 'Coordinate delivery and remove execution blockers.',
    ]);

    landingSearchCreateVacancy($company, [
        'title' => 'Engineering Operations Manager',
        'department' => 'Engineering',
        'category' => 'information_technology',
        'work_mode' => 'remote',
        'published_at' => now()->subMinute(),
        'description' => 'Coordinate engineering operations, planning, and reporting.',
        'requirements' => 'Operations leadership and planning.',
    ]);

    $recommendedVacancy = landingSearchCreateVacancy($company, [
        'title' => 'Frontend Platform Engineer',
        'department' => 'Engineering',
        'category' => 'information_technology',
        'work_mode' => 'remote',
        'published_at' => now()->subDay(),
        'description' => 'Build React and TypeScript hiring experiences.',
        'requirements' => 'React, TypeScript, frontend architecture.',
        'responsibilities' => 'Own frontend delivery and collaborate with design.',
    ]);

    $user = User::factory()->create();
    $candidate = landingSearchCreateCandidateProfile($user, [
        'headline' => 'React TypeScript Engineer',
        'professional_summary' => 'Builds React platforms and frontend systems.',
    ]);

    $candidate->skills()->create([
        'name' => 'React',
        'level' => 'expert',
        'years_experience' => 5,
    ]);

    $this->actingAs($user)
        ->get(route('marketplace.jobs.show', $sourceVacancy->id))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Public/JobDetail')
            ->has('job.match.reasons.0')
            ->where('relatedJobs.0.title', $recommendedVacancy->title)
            ->where('relatedJobs.0.match.label', 'Strong Match')
        );
});

test('landing page renders for guests', function () {
    $company = landingSearchCreateCompany();
    landingSearchCreateVacancy($company);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Landing')
            ->has('stats')
            ->has('featuredVacancies', 1)
        );
});

test('public vacancy detail renders for published jobs and stays accessible for users without an organization', function () {
    $company = landingSearchCreateCompany();
    $vacancy = landingSearchCreateVacancy($company);
    landingSearchCreateVacancy($company, [
        'title' => 'UI Engineer',
        'work_mode' => 'hybrid',
        'location' => 'Harare',
    ]);

    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('marketplace.jobs.show', $vacancy->id))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Public/JobDetail')
            ->where('job.title', $vacancy->title)
            ->where('applyAction.type', 'link')
            ->has('relatedJobs', 1)
        );
});

test('public vacancy detail supports candidate apply flow and reflects the updated state', function () {
    $company = landingSearchCreateCompany();
    $vacancy = landingSearchCreateVacancy($company);

    $user = User::factory()->create();
    $candidate = landingSearchCreateCandidateProfile($user);
    $resume = landingSearchCreateResume($candidate);

    $this->actingAs($user)
        ->get(route('marketplace.jobs.show', $vacancy->id))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Public/JobDetail')
            ->where('applyAction.type', 'post')
            ->where('applyAction.label', 'Apply Now')
        );

    $this->actingAs($user)
        ->from(route('marketplace.jobs.show', $vacancy->id))
        ->post(route('candidate.jobs.apply', $vacancy->id), [])
        ->assertRedirect(route('marketplace.jobs.show', $vacancy->id))
        ->assertSessionHas('success', 'Application submitted successfully.');

    expect(
        VacancyApplication::query()
            ->where('vacancy_id', $vacancy->id)
            ->where('candidate_profile_id', $candidate->id)
            ->where('resume_id', $resume->id)
            ->exists()
    )->toBeTrue();

    $this->actingAs($user)
        ->get(route('marketplace.jobs.show', $vacancy->id))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Public/JobDetail')
            ->where('applyAction.type', 'disabled')
            ->where('applyAction.label', 'Already Applied')
        );
});

test('public vacancy detail returns not found component for unpublished jobs', function () {
    $company = landingSearchCreateCompany();
    $vacancy = landingSearchCreateVacancy($company, [
        'status' => 'draft',
        'published_at' => null,
    ]);

    $this->get(route('marketplace.jobs.show', $vacancy->id))
        ->assertNotFound()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Public/JobDetail')
            ->where('job', null)
            ->has('relatedJobs', 0)
        );
});
