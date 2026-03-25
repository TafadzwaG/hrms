<?php

use App\Models\CandidateProfile;
use App\Models\CompanyProfile;
use App\Models\Organization;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

function recruitmentAdminOrganization(): Organization
{
    return Organization::query()->firstOrCreate(
        ['slug' => 'recruitment-admin-tenant'],
        [
            'name' => 'Recruitment Admin Tenant',
            'code' => 'RECRUITMENT',
            'status' => 'ACTIVE',
            'timezone' => 'Africa/Johannesburg',
        ],
    );
}

function grantRecruitmentPermissions(User $user, array $permissionNames): Organization
{
    $permissionIds = collect($permissionNames)
        ->map(function (string $name) {
            $module = str($name)->before('.')->toString();

            return Permission::query()->firstOrCreate(
                ['name' => $name],
                [
                    'module' => $module,
                    'label' => str($name)->replace(['.', '_'], ' ')->headline()->toString(),
                    'description' => 'Generated for recruitment admin feature coverage.',
                ],
            )->id;
        })
        ->all();

    $role = Role::query()->create([
        'code' => 'RECRUITMENT_TEST_'.str()->upper(str()->random(8)),
        'name' => 'Recruitment Test '.str()->upper(str()->random(4)),
        'description' => 'Temporary role for recruitment admin tests.',
    ]);
    $role->permissions()->sync($permissionIds);

    $organization = recruitmentAdminOrganization();

    $user->attachToOrganization($organization);
    $user->syncRoles([$role->id], $organization->id);
    $user->forceFill([
        'current_organization_id' => $organization->id,
    ])->saveQuietly();

    return $organization;
}

function makeCandidateProfile(Organization $organization, array $attributes = []): CandidateProfile
{
    return CandidateProfile::query()->create(array_merge([
        'organization_id' => $organization->id,
        'full_name' => 'Candidate Example',
        'email' => 'candidate@example.com',
        'headline' => 'Senior Software Engineer',
        'location' => 'Johannesburg',
        'highest_education' => 'bachelors',
        'profile_visibility_status' => 'active',
        'is_public' => true,
    ], $attributes));
}

function makeCompanyProfile(Organization $organization, array $attributes = []): CompanyProfile
{
    return CompanyProfile::query()->create(array_merge([
        'organization_id' => $organization->id,
        'company_name' => 'Example Employer',
        'industry' => 'information_technology',
        'email' => 'employer@example.com',
        'phone' => '+27110000000',
        'status' => 'active',
    ], $attributes));
}

test('recruitment dashboard shows recent candidates and employers', function () {
    $viewer = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $organization = grantRecruitmentPermissions($viewer, ['recruitment.view']);
    $this->actingAs($viewer);

    $candidate = makeCandidateProfile($organization, [
        'full_name' => 'Nandi Candidate',
        'email' => 'nandi@example.com',
    ]);
    $company = makeCompanyProfile($organization, [
        'company_name' => 'Acme Hiring',
        'email' => 'hiring@example.com',
    ]);

    $this->get(route('recruitment.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Recruitment/Dashboard')
            ->where('recent_candidates.0.title', $candidate->full_name)
            ->where('recent_candidates.0.href', route('candidate-profiles.show', $candidate))
            ->where('recent_employers.0.title', $company->company_name)
            ->where('recent_employers.0.href', route('company-profiles.show', $company))
        );
});

test('candidate profile resource routes resolve through recruitment admin pages', function () {
    $viewer = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $organization = grantRecruitmentPermissions($viewer, ['recruitment.candidates.manage']);
    $this->actingAs($viewer);

    $candidate = makeCandidateProfile($organization, [
        'full_name' => 'Lerato Profile',
        'email' => 'lerato@example.com',
    ]);

    $this->get(route('candidate-profiles.show', $candidate))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Recruitment/Candidates/Show')
            ->where('candidate.id', $candidate->id)
            ->where('candidate.full_name', $candidate->full_name)
        );
});

test('company profile resource routes resolve through recruitment admin pages', function () {
    $viewer = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $organization = grantRecruitmentPermissions($viewer, ['recruitment.companies.manage']);
    $this->actingAs($viewer);

    $company = makeCompanyProfile($organization, [
        'company_name' => 'Northwind Talent',
        'email' => 'northwind@example.com',
    ]);

    $this->get(route('company-profiles.show', $company))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Recruitment/Companies/Show')
            ->where('company.id', $company->id)
            ->where('company.company_name', $company->company_name)
        );
});

test('main dashboard talent section links to recruitment candidate and employer lists', function () {
    $viewer = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $organization = recruitmentAdminOrganization();
    $viewer->attachToOrganization($organization);
    $viewer->forceFill([
        'current_organization_id' => $organization->id,
    ])->saveQuietly();
    $this->actingAs($viewer);

    $candidate = makeCandidateProfile($organization, [
        'full_name' => 'Talent Watch Candidate',
        'email' => 'talentwatch@example.com',
    ]);
    $company = makeCompanyProfile($organization, [
        'company_name' => 'Talent Watch Employer',
        'email' => 'talent-employer@example.com',
    ]);

    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard')
            ->where('dashboard.modules.company_profiles.href', '/company-profiles')
            ->where('dashboard.sections.talent.lists.candidate_watch.items.0.title', $candidate->full_name)
            ->where('dashboard.sections.talent.lists.candidate_watch.items.0.href', '/candidate-profiles/'.$candidate->id)
            ->where('dashboard.sections.talent.lists.employer_watch.items.0.title', $company->company_name)
            ->where('dashboard.sections.talent.lists.employer_watch.items.0.href', '/company-profiles/'.$company->id)
        );
});
