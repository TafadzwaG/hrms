<?php

use App\Models\CandidateProfile;
use App\Models\CompanyProfile;
use App\Models\Employee;
use App\Models\User;

function createPortalCandidate(User $user): CandidateProfile
{
    return CandidateProfile::query()->withoutGlobalScopes()->create([
        'user_id' => $user->id,
        'full_name' => $user->name,
        'email' => $user->email,
        'profile_visibility_status' => 'draft',
        'is_public' => false,
        'stage' => 'listed',
        'status' => 'available',
    ]);
}

function createPortalEmployer(User $user): CompanyProfile
{
    return CompanyProfile::query()->withoutGlobalScopes()->create([
        'owner_user_id' => $user->id,
        'company_name' => 'Acme Hiring',
        'industry' => 'information_technology',
        'email' => 'talent@acme.test',
        'phone' => '',
        'status' => 'pending_review',
        'created_by' => $user->id,
        'updated_by' => $user->id,
    ]);
}

test('candidate registration creates a candidate portal and redirects to candidate dashboard', function () {
    $response = $this->post(route('register.store'), [
        'portal' => 'candidate',
        'name' => 'Candidate User',
        'email' => 'candidate@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'headline' => 'Backend Engineer',
    ]);

    $user = User::query()->where('email', 'candidate@example.com')->firstOrFail();

    $this->assertAuthenticatedAs($user);
    $response->assertRedirect('/candidate/dashboard');
    expect($user->primary_portal)->toBe('candidate');
    expect($user->portalAccesses()->pluck('portal')->all())->toContain('candidate');
    expect(CandidateProfile::query()->withoutGlobalScopes()->where('user_id', $user->id)->exists())->toBeTrue();
});

test('employer registration creates an employer portal and redirects to employer dashboard', function () {
    $response = $this->post(route('register.store'), [
        'portal' => 'employer',
        'name' => 'Employer User',
        'email' => 'employer@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'company_name' => 'Meridian Labs',
        'industry' => 'information_technology',
    ]);

    $user = User::query()->where('email', 'employer@example.com')->firstOrFail();

    $this->assertAuthenticatedAs($user);
    $response->assertRedirect('/employer/dashboard');
    expect($user->primary_portal)->toBe('employer');
    expect($user->portalAccesses()->pluck('portal')->all())->toContain('employer');
    expect(CompanyProfile::query()->withoutGlobalScopes()->where('owner_user_id', $user->id)->exists())->toBeTrue();
});

test('authenticated users can add a missing portal without duplicating the user', function () {
    $user = User::factory()->create([
        'primary_portal' => 'candidate',
        'email' => 'multi@example.com',
    ]);

    createPortalCandidate($user);

    $this->actingAs($user);

    $response = $this->post(route('register.store'), [
        'portal' => 'employer',
        'name' => $user->name,
        'email' => $user->email,
        'company_name' => 'Northwave',
        'industry' => 'information_technology',
    ]);

    $response->assertRedirect('/employer/dashboard');
    expect(User::query()->where('email', 'multi@example.com')->count())->toBe(1);
    expect($user->fresh()->primary_portal)->toBe('candidate');
    expect($user->fresh()->portalAccesses()->pluck('portal')->all())->toEqualCanonicalizing(['candidate', 'employer']);
    expect(CompanyProfile::query()->withoutGlobalScopes()->where('owner_user_id', $user->id)->exists())->toBeTrue();
});

test('login redirects candidate and employer users to their primary portals', function () {
    $candidateUser = User::factory()->create([
        'primary_portal' => 'candidate',
        'email' => 'candidate-login@example.com',
    ]);
    createPortalCandidate($candidateUser);

    $employerUser = User::factory()->create([
        'primary_portal' => 'employer',
        'email' => 'employer-login@example.com',
    ]);
    createPortalEmployer($employerUser);

    $this->post(route('login.store'), [
        'email' => $candidateUser->email,
        'password' => 'password',
    ])->assertRedirect('/candidate/dashboard');

    auth()->logout();

    $this->post(route('login.store'), [
        'email' => $employerUser->email,
        'password' => 'password',
    ])->assertRedirect('/employer/dashboard');
});

test('legacy candidate and employer auth urls redirect to the unified pages', function () {
    $this->get(route('candidate.login'))->assertRedirect('/login?portal=candidate');
    $this->get(route('employer.login'))->assertRedirect('/login?portal=employer');
    $this->get(route('candidate.register'))->assertRedirect('/register?portal=candidate');
    $this->get(route('employer.register'))->assertRedirect('/register?portal=employer');
});

test('employee users are routed to the main dashboard by primary portal', function () {
    $user = User::factory()->create([
        'primary_portal' => 'employee',
        'email' => 'employee@example.com',
    ]);

    Employee::query()->withoutGlobalScopes()->create([
        'user_id' => $user->id,
        'staff_number' => 'EMP-TEST-0001',
        'first_name' => 'Employee',
        'surname' => 'User',
        'status' => 'ACTIVE',
    ]);

    $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ])->assertRedirect('/dashboard');
});
