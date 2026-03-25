<?php

namespace App\Support\Auth;

use App\Models\CandidateProfile;
use App\Models\CompanyProfile;
use App\Models\Employee;
use App\Models\Organization;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PortalRegistrationService
{
    public function __construct(
        private readonly PortalAccessResolver $resolver,
    ) {
    }

    public function registerGuest(array $data): User
    {
        return DB::transaction(function () use ($data): User {
            $portal = $this->requiredPortal($data['portal'] ?? null);

            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make((string) $data['password']),
                'primary_portal' => $portal,
            ]);

            $this->resolver->grantPortalAccess($user, $portal, true);
            $this->upsertPortalProfile($user, $portal, $data, true);

            return $user->refresh();
        });
    }

    public function addPortal(User $user, array $data): void
    {
        DB::transaction(function () use ($user, $data): void {
            $portal = $this->requiredPortal($data['portal'] ?? null);

            $user->forceFill([
                'name' => $data['name'],
                'email' => $data['email'],
            ])->save();

            $this->resolver->grantPortalAccess($user, $portal);
            $this->upsertPortalProfile($user, $portal, $data, false);
        });
    }

    private function upsertPortalProfile(User $user, string $portal, array $data, bool $makePrimary): void
    {
        match ($portal) {
            PortalAccessResolver::PORTAL_CANDIDATE => $this->upsertCandidateProfile($user, $data),
            PortalAccessResolver::PORTAL_EMPLOYER => $this->upsertEmployerProfile($user, $data),
            default => $this->upsertEmployeeProfile($user, $data),
        };

        if ($makePrimary) {
            $user->forceFill([
                'primary_portal' => $portal,
            ])->saveQuietly();
        }
    }

    private function upsertEmployeeProfile(User $user, array $data): void
    {
        [$firstName, $middleName, $surname] = $this->splitName($data['name']);
        $organization = $this->resolveRegistrationOrganization();

        Employee::query()->withoutGlobalScopes()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'organization_id' => $organization?->id,
                'staff_number' => Employee::query()->withoutGlobalScopes()->where('user_id', $user->id)->value('staff_number') ?: $this->generateStaffNumber(),
                'first_name' => $firstName,
                'middle_name' => $middleName,
                'surname' => $surname,
                'email' => $data['email'],
                'contact_number' => $data['phone'] ?? null,
                'status' => 'ACTIVE',
                'hire_date' => now()->toDateString(),
            ],
        );

        if ($organization) {
            $user->attachToOrganization($organization);
            $user->forceFill([
                'current_organization_id' => $user->current_organization_id ?: $organization->id,
            ])->saveQuietly();
        }

        $employeeRoleId = Role::query()->where('code', 'EMPLOYEE')->value('id');

        if ($employeeRoleId) {
            $user->roles()->syncWithoutDetaching([$employeeRoleId]);
        }
    }

    private function upsertCandidateProfile(User $user, array $data): void
    {
        $candidate = CandidateProfile::query()->withoutGlobalScopes()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'organization_id' => $this->resolveRegistrationOrganization()?->id,
                'full_name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'location' => $data['location'] ?? null,
                'headline' => $data['headline'] ?? null,
                'years_experience' => $this->nullableInt($data['years_experience'] ?? null),
                'highest_education' => $data['highest_education'] ?? null,
                'profile_visibility_status' => 'draft',
                'is_public' => false,
                'stage' => 'listed',
                'status' => 'available',
            ],
        );

        if (($data['cv'] ?? null) instanceof UploadedFile) {
            $this->storeCandidateResume($candidate, $data['cv'], $user);
        }
    }

    private function upsertEmployerProfile(User $user, array $data): void
    {
        CompanyProfile::query()->withoutGlobalScopes()->updateOrCreate(
            ['owner_user_id' => $user->id],
            [
                'organization_id' => $this->resolveRegistrationOrganization()?->id,
                'company_name' => $data['company_name'],
                'industry' => $data['industry'],
                'registration_number' => $data['registration_number'] ?? null,
                'email' => $data['company_email'] ?? $data['email'],
                'phone' => $data['company_phone'] ?? '',
                'website' => $data['website'] ?? null,
                'status' => 'pending_review',
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ],
        );
    }

    private function storeCandidateResume(CandidateProfile $candidate, UploadedFile $file, User $user): void
    {
        $storedName = Str::uuid()->toString().'_'.$file->getClientOriginalName();
        $path = $file->storeAs('candidate-documents/'.$candidate->id, $storedName, 'public');

        $candidate->resumes()->update(['is_primary' => false]);

        $candidate->resumes()->create([
            'file_name' => $file->getClientOriginalName(),
            'document_type' => 'cv',
            'file_path' => $path,
            'description' => 'Uploaded during registration.',
            'mime_type' => $file->getClientMimeType() ?? $file->getMimeType() ?? 'application/octet-stream',
            'size' => $file->getSize(),
            'is_primary' => true,
            'uploaded_by' => $user->id,
            'uploaded_at' => now(),
        ]);
    }

    private function resolveRegistrationOrganization(): ?Organization
    {
        $request = app()->bound('request') ? app('request') : null;
        $selectedOrganizationId = $request?->session()->get('current_organization_id');

        if ($selectedOrganizationId) {
            return Organization::query()->find($selectedOrganizationId);
        }

        return Organization::query()->count() === 1
            ? Organization::query()->first()
            : null;
    }

    private function generateStaffNumber(): string
    {
        do {
            $staffNumber = 'EMP-'.now()->format('ymd').'-'.str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT);
        } while (Employee::query()->withoutGlobalScopes()->where('staff_number', $staffNumber)->exists());

        return $staffNumber;
    }

    private function splitName(string $name): array
    {
        $parts = preg_split('/\s+/', trim($name)) ?: [];
        $parts = array_values(array_filter($parts));

        if ($parts === []) {
            return ['User', null, 'Account'];
        }

        $firstName = array_shift($parts);
        $surname = count($parts) > 0 ? array_pop($parts) : $firstName;
        $middleName = $parts !== [] ? implode(' ', $parts) : null;

        return [$firstName, $middleName, $surname];
    }

    private function nullableInt(mixed $value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        return (int) $value;
    }

    private function requiredPortal(mixed $portal): string
    {
        return $this->resolver->normalizePortal($portal) ?? PortalAccessResolver::PORTAL_EMPLOYEE;
    }
}
