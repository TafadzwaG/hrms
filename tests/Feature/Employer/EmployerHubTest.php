<?php

use App\Models\CandidateProfile;
use App\Models\CandidateResume;
use App\Models\CompanyBillingProfile;
use App\Models\CompanyInvoice;
use App\Models\CompanyProfile;
use App\Models\CompanySubscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\Vacancy;
use App\Models\VacancyApplication;
use Inertia\Testing\AssertableInertia as Assert;

function employerHubCreateCompany(User $owner, array $overrides = []): CompanyProfile
{
    return CompanyProfile::query()->withoutGlobalScopes()->create([
        'owner_user_id' => $owner->id,
        'company_name' => 'Nimbus Hiring Co',
        'industry' => 'information_technology',
        'registration_number' => 'NIM-001',
        'email' => 'talent@nimbus.test',
        'phone' => '+263771000020',
        'website' => 'https://nimbus.test',
        'address' => '20 Hiring Avenue, Harare',
        'description' => 'Growing software business.',
        'status' => 'active',
        'approved_at' => now(),
        'created_by' => $owner->id,
        'updated_by' => $owner->id,
        ...$overrides,
    ]);
}

function employerHubCreateVacancy(CompanyProfile $company, array $overrides = []): Vacancy
{
    return Vacancy::query()->withoutGlobalScopes()->create([
        'company_profile_id' => $company->id,
        'title' => 'Senior Product Engineer',
        'department' => 'Engineering',
        'category' => 'information_technology',
        'employment_type' => 'full_time',
        'work_mode' => 'hybrid',
        'location' => 'Harare',
        'description' => 'Lead platform feature delivery.',
        'requirements' => 'React, Laravel, product thinking.',
        'responsibilities' => 'Own product delivery and mentor peers.',
        'salary_min' => 3000,
        'salary_max' => 5000,
        'currency' => 'USD',
        'application_deadline' => now()->addWeeks(3)->toDateString(),
        'status' => 'published',
        'published_at' => now(),
        'created_by' => $company->owner_user_id,
        'updated_by' => $company->owner_user_id,
        ...$overrides,
    ]);
}

function employerHubCreateCandidate(array $overrides = []): CandidateProfile
{
    $user = User::factory()->create();

    return CandidateProfile::query()->withoutGlobalScopes()->create([
        'user_id' => $user->id,
        'full_name' => 'Public Candidate',
        'email' => $user->email,
        'phone' => '+263771000030',
        'location' => 'Bulawayo',
        'headline' => 'React Laravel Engineer',
        'professional_summary' => 'Builds scalable React and Laravel products.',
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

function employerHubCreateResume(CandidateProfile $candidate, array $overrides = []): CandidateResume
{
    return $candidate->resumes()->create([
        'file_name' => 'candidate-resume.pdf',
        'document_type' => 'resume',
        'file_path' => 'candidate-documents/'.$candidate->id.'/candidate-resume.pdf',
        'description' => 'Primary resume',
        'mime_type' => 'application/pdf',
        'size' => 1024,
        'is_primary' => true,
        'uploaded_by' => $candidate->user_id,
        'uploaded_at' => now(),
        ...$overrides,
    ]);
}

function employerHubCreateApplication(CandidateProfile $candidate, Vacancy $vacancy, ?CandidateResume $resume = null, array $overrides = []): VacancyApplication
{
    return VacancyApplication::query()->create([
        'vacancy_id' => $vacancy->id,
        'candidate_profile_id' => $candidate->id,
        'resume_id' => $resume?->id,
        'cover_letter' => 'Interested in joining the company.',
        'status' => 'submitted',
        'applied_at' => now()->subHours(6),
        'metadata' => ['source' => 'feature_test'],
        ...$overrides,
    ]);
}

function employerHubCreatePlan(array $overrides = []): SubscriptionPlan
{
    return SubscriptionPlan::query()->create([
        'code' => 'growth',
        'name' => 'Growth',
        'description' => 'Growth hiring plan',
        'price' => 199,
        'currency' => 'USD',
        'billing_interval' => 'monthly',
        'seat_limit' => 10,
        'features' => ['10 seats', 'Reporting', 'Talent recommendations'],
        'is_active' => true,
        ...$overrides,
    ]);
}

function employerHubCreateActiveSubscription(CompanyProfile $company, SubscriptionPlan $plan, array $overrides = []): CompanySubscription
{
    return CompanySubscription::query()->create([
        'company_profile_id' => $company->id,
        'subscription_plan_id' => $plan->id,
        'status' => 'active',
        'seats' => 5,
        'amount' => $plan->price,
        'currency' => $plan->currency,
        'started_at' => now()->subMonth(),
        'renews_at' => now()->addMonth(),
        'metadata' => ['source' => 'feature_test'],
        ...$overrides,
    ]);
}

test('employer hub redirects authenticated users without a company profile to registration', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('employer.dashboard'))
        ->assertRedirect(route('employer.register'))
        ->assertSessionHas('error');
});

test('employer dashboard and reports render live metrics data', function () {
    $owner = User::factory()->create();
    $company = employerHubCreateCompany($owner);
    $plan = employerHubCreatePlan();
    $subscription = employerHubCreateActiveSubscription($company, $plan);

    CompanyBillingProfile::query()->create([
        'company_profile_id' => $company->id,
        'billing_name' => 'Nimbus Finance',
        'billing_email' => 'finance@nimbus.test',
        'billing_phone' => '+263771000021',
        'billing_address' => '20 Hiring Avenue, Harare',
        'tax_number' => 'VAT-001',
    ]);

    CompanyInvoice::query()->create([
        'company_profile_id' => $company->id,
        'company_subscription_id' => $subscription->id,
        'invoice_number' => 'INV-1001',
        'amount' => 199,
        'currency' => 'USD',
        'status' => 'paid',
        'description' => 'Growth plan renewal',
        'issued_at' => now()->subDays(14),
        'due_at' => now()->subDays(7),
        'paid_at' => now()->subDays(6),
    ]);

    $vacancy = employerHubCreateVacancy($company);

    $applicant = employerHubCreateCandidate([
        'full_name' => 'Applied Candidate',
        'headline' => 'Senior Product Engineer',
        'is_public' => false,
    ]);
    $resume = employerHubCreateResume($applicant);
    employerHubCreateApplication($applicant, $vacancy, $resume);

    employerHubCreateCandidate([
        'full_name' => 'Recommended Candidate',
    ]);

    $this->actingAs($owner)
        ->get(route('employer.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Employer/Dashboard')
            ->where('company.company_name', $company->company_name)
            ->where('metrics.total_vacancies', 1)
            ->has('recentApplications', 1)
            ->has('recommendedTalent', 1)
            ->where('billingSummary.subscription.plan.name', $plan->name)
        );

    $this->actingAs($owner)
        ->get(route('employer.reports'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Employer/Reports')
            ->where('summary.total_vacancies', 1)
            ->where('summary.total_applications', 1)
            ->has('monthlyTrend')
            ->has('vacancyPerformance', 1)
        );
});

test('employer can create update change status and delete vacancies', function () {
    $owner = User::factory()->create();
    $company = employerHubCreateCompany($owner);

    $this->actingAs($owner)
        ->get(route('employer.vacancies.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Employer/VacancyCreate')
            ->where('company.company_name', $company->company_name)
        );

    $this->actingAs($owner)
        ->from(route('employer.vacancies.create'))
        ->post(route('employer.vacancies.store'), [
            'title' => 'Lead UX Engineer',
            'department' => 'Product',
            'category' => 'information_technology',
            'employment_type' => 'full_time',
            'work_mode' => 'remote',
            'location' => 'Remote',
            'description' => 'Lead design systems delivery.',
            'requirements' => 'Design systems and React experience.',
            'responsibilities' => 'Own UX engineering standards.',
            'salary_min' => 2800,
            'salary_max' => 4200,
            'currency' => 'USD',
            'application_deadline' => now()->addWeeks(2)->toDateString(),
        ])
        ->assertRedirect();

    $vacancy = Vacancy::query()->withoutGlobalScopes()->latest('id')->firstOrFail();

    $this->actingAs($owner)
        ->get(route('employer.vacancies.show', $vacancy->id))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Employer/VacancyShow')
            ->where('vacancy.title', 'Lead UX Engineer')
        );

    $this->actingAs($owner)
        ->from(route('employer.vacancies.edit', $vacancy->id))
        ->put(route('employer.vacancies.update', $vacancy->id), [
            'title' => 'Lead Product Engineer',
            'department' => 'Engineering',
            'category' => 'information_technology',
            'employment_type' => 'contract',
            'work_mode' => 'hybrid',
            'location' => 'Harare',
            'description' => 'Lead platform delivery.',
            'requirements' => 'Laravel and React leadership.',
            'responsibilities' => 'Mentor engineers and ship product.',
            'salary_min' => 3200,
            'salary_max' => 5200,
            'currency' => 'USD',
            'application_deadline' => now()->addWeeks(4)->toDateString(),
        ])
        ->assertRedirect(route('employer.vacancies.show', $vacancy->id));

    $vacancy = Vacancy::query()->withoutGlobalScopes()->findOrFail($vacancy->id);
    expect($vacancy->title)->toBe('Lead Product Engineer')
        ->and($vacancy->employment_type)->toBe('contract');

    $this->actingAs($owner)
        ->from(route('employer.vacancies.show', $vacancy->id))
        ->patch(route('employer.vacancies.status.update', $vacancy->id), [
            'status' => 'published',
        ])
        ->assertRedirect(route('employer.vacancies.show', $vacancy->id));

    $vacancy = Vacancy::query()->withoutGlobalScopes()->findOrFail($vacancy->id);
    expect($vacancy->status)->toBe('published')
        ->and($vacancy->published_at)->not->toBeNull();

    $this->actingAs($owner)
        ->from(route('employer.vacancies.show', $vacancy->id))
        ->patch(route('employer.vacancies.status.update', $vacancy->id), [
            'status' => 'closed',
        ])
        ->assertRedirect(route('employer.vacancies.show', $vacancy->id));

    $vacancy = Vacancy::query()->withoutGlobalScopes()->findOrFail($vacancy->id);
    expect($vacancy->status)->toBe('closed')
        ->and($vacancy->closed_at)->not->toBeNull();

    $this->actingAs($owner)
        ->from(route('employer.vacancies.index'))
        ->delete(route('employer.vacancies.destroy', $vacancy->id))
        ->assertRedirect(route('employer.vacancies.index'));

    expect(
        Vacancy::query()
            ->withoutGlobalScopes()
            ->withTrashed()
            ->findOrFail($vacancy->id)
            ->trashed()
    )->toBeTrue();
});

test('employer candidates page is scoped to owned vacancies and statuses can be updated', function () {
    $owner = User::factory()->create();
    $company = employerHubCreateCompany($owner);
    $vacancy = employerHubCreateVacancy($company);

    $candidate = employerHubCreateCandidate([
        'full_name' => 'Shortlist Me',
        'headline' => 'Senior Product Engineer',
    ]);
    $resume = employerHubCreateResume($candidate);
    $application = employerHubCreateApplication($candidate, $vacancy, $resume);

    $foreignOwner = User::factory()->create();
    $foreignCompany = employerHubCreateCompany($foreignOwner, [
        'company_name' => 'Foreign Employer',
        'registration_number' => 'FOR-001',
        'email' => 'jobs@foreign.test',
    ]);
    $foreignVacancy = employerHubCreateVacancy($foreignCompany, [
        'title' => 'Foreign Role',
    ]);
    $foreignCandidate = employerHubCreateCandidate([
        'full_name' => 'Other Candidate',
    ]);
    $foreignResume = employerHubCreateResume($foreignCandidate);
    $foreignApplication = employerHubCreateApplication($foreignCandidate, $foreignVacancy, $foreignResume);

    $this->actingAs($owner)
        ->get(route('employer.candidates'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Employer/Candidates')
            ->has('applications.data', 1)
            ->where('applications.data.0.candidate_name', 'Shortlist Me')
            ->where('applications.data.0.vacancy_title', $vacancy->title)
        );

    $this->actingAs($owner)
        ->from(route('employer.candidates'))
        ->patch(route('employer.candidates.status.update', $application->id), [
            'status' => 'shortlisted',
            'notes' => 'Strong portfolio and relevant experience.',
        ])
        ->assertRedirect(route('employer.candidates'));

    $application->refresh();
    expect($application->status)->toBe('shortlisted')
        ->and($application->notes)->toBe('Strong portfolio and relevant experience.')
        ->and($application->shortlisted_at)->not->toBeNull();

    $this->actingAs($owner)
        ->patch(route('employer.candidates.status.update', $foreignApplication->id), [
            'status' => 'rejected',
        ])
        ->assertNotFound();
});

test('employer can update company profile and billing subscription data', function () {
    $owner = User::factory()->create();
    $company = employerHubCreateCompany($owner);
    $starterPlan = employerHubCreatePlan([
        'code' => 'starter',
        'name' => 'Starter',
        'price' => 99,
        'seat_limit' => 3,
    ]);
    $growthPlan = employerHubCreatePlan([
        'code' => 'scale',
        'name' => 'Scale',
        'price' => 249,
        'seat_limit' => 20,
    ]);

    $activeSubscription = employerHubCreateActiveSubscription($company, $starterPlan, [
        'seats' => 3,
    ]);

    CompanyBillingProfile::query()->create([
        'company_profile_id' => $company->id,
        'billing_name' => 'Nimbus Finance',
        'billing_email' => 'finance@nimbus.test',
        'billing_phone' => '+263771000022',
        'billing_address' => '20 Hiring Avenue, Harare',
        'tax_number' => 'VAT-STARTER',
    ]);

    CompanyInvoice::query()->create([
        'company_profile_id' => $company->id,
        'company_subscription_id' => $activeSubscription->id,
        'invoice_number' => 'INV-2001',
        'amount' => 99,
        'currency' => 'USD',
        'status' => 'paid',
        'description' => 'Starter plan invoice',
        'issued_at' => now()->subDays(10),
        'due_at' => now()->subDays(3),
        'paid_at' => now()->subDays(2),
    ]);

    $this->actingAs($owner)
        ->get(route('employer.company'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Employer/CompanyProfile')
            ->where('company.company_name', $company->company_name)
        );

    $this->actingAs($owner)
        ->from(route('employer.company'))
        ->put(route('employer.company.update'), [
            'company_name' => 'Nimbus Talent Group',
            'industry' => 'information_technology',
            'registration_number' => 'NIM-001',
            'email' => 'hello@nimbus.test',
            'phone' => '+263771000023',
            'website' => 'https://nimbus-group.test',
            'address' => '99 Talent Avenue, Harare',
            'description' => 'Updated company profile description.',
        ])
        ->assertRedirect(route('employer.company'));

    $company = CompanyProfile::query()->withoutGlobalScopes()->findOrFail($company->id);
    expect($company->company_name)->toBe('Nimbus Talent Group')
        ->and($company->email)->toBe('hello@nimbus.test');

    $this->actingAs($owner)
        ->get(route('employer.billing'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Employer/Billing')
            ->where('billingProfile.billing_email', 'finance@nimbus.test')
            ->has('plans', 2)
            ->has('invoices', 1)
        );

    $this->actingAs($owner)
        ->from(route('employer.billing'))
        ->put(route('employer.billing.profile.update'), [
            'billing_name' => 'Nimbus Billing',
            'billing_email' => 'billing@nimbus.test',
            'billing_phone' => '+263771000024',
            'billing_address' => '99 Talent Avenue, Harare',
            'tax_number' => 'VAT-SCALE',
        ])
        ->assertRedirect(route('employer.billing'));

    $billingProfile = CompanyBillingProfile::query()->where('company_profile_id', $company->id)->firstOrFail();
    expect($billingProfile->billing_email)->toBe('billing@nimbus.test')
        ->and($billingProfile->tax_number)->toBe('VAT-SCALE');

    $this->actingAs($owner)
        ->from(route('employer.billing'))
        ->put(route('employer.billing.subscription.update'), [
            'subscription_plan_id' => $growthPlan->id,
            'seats' => 12,
        ])
        ->assertRedirect(route('employer.billing'));

    $activeSubscription->refresh();
    expect($activeSubscription->status)->toBe('inactive')
        ->and($activeSubscription->cancelled_at)->not->toBeNull();

    $newSubscription = CompanySubscription::query()
        ->where('company_profile_id', $company->id)
        ->where('subscription_plan_id', $growthPlan->id)
        ->where('status', 'active')
        ->latest('id')
        ->first();

    expect($newSubscription)->not->toBeNull()
        ->and($newSubscription?->seats)->toBe(12)
        ->and((float) $newSubscription?->amount)->toBe(249.0);
});
