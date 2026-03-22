<?php

namespace App\Support\Hubs;

use App\Models\CandidateProfile;
use App\Models\CompanyProfile;
use App\Models\Scopes\OrganizationScope;
use App\Models\User;
use App\Models\Vacancy;
use Illuminate\Database\Eloquent\Builder;

class EmployerHubContext
{
    public function companyQuery(): Builder
    {
        return CompanyProfile::query()->withoutGlobalScope(OrganizationScope::class);
    }

    public function vacancyQuery(): Builder
    {
        return Vacancy::query()->withoutGlobalScope(OrganizationScope::class);
    }

    public function candidateQuery(): Builder
    {
        return CandidateProfile::query()->withoutGlobalScope(OrganizationScope::class);
    }

    public function findCompany(?User $user): ?CompanyProfile
    {
        if (! $user) {
            return null;
        }

        return $this->companyQuery()
            ->where('owner_user_id', $user->id)
            ->first();
    }

    public function findManagedVacancy(CompanyProfile $company, int $vacancyId): Vacancy
    {
        return $this->vacancyQuery()
            ->where('company_profile_id', $company->id)
            ->findOrFail($vacancyId);
    }
}
