<?php

namespace App\Support\Hubs;

use App\Models\CandidateProfile;
use App\Models\CompanyProfile;
use App\Models\Scopes\OrganizationScope;
use App\Models\User;
use App\Models\Vacancy;
use Illuminate\Database\Eloquent\Builder;

class CandidateHubContext
{
    public function profileQuery(): Builder
    {
        return CandidateProfile::query()->withoutGlobalScope(OrganizationScope::class);
    }

    public function vacancyQuery(): Builder
    {
        return Vacancy::query()->withoutGlobalScope(OrganizationScope::class);
    }

    public function companyQuery(): Builder
    {
        return CompanyProfile::query()->withoutGlobalScope(OrganizationScope::class);
    }

    public function findProfile(?User $user): ?CandidateProfile
    {
        if (! $user) {
            return null;
        }

        return $this->profileQuery()
            ->where('user_id', $user->id)
            ->first();
    }

    public function findPublishedVacancy(int $vacancyId): Vacancy
    {
        return $this->vacancyQuery()
            ->where('status', 'published')
            ->findOrFail($vacancyId);
    }
}
