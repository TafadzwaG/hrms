<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ])->validate();

        return DB::transaction(function () use ($input): User {
            $user = User::create([
                'name' => $input['name'],
                'email' => $input['email'],
                'password' => $input['password'],
            ]);

            $organization = $this->resolveRegistrationOrganization();

            if ($organization) {
                $user->attachToOrganization($organization);
                $user->forceFill([
                    'current_organization_id' => $organization->id,
                ])->saveQuietly();
            }

            return $user;
        });
    }

    private function resolveRegistrationOrganization(): ?Organization
    {
        $request = app()->bound('request') ? app(Request::class) : null;
        $selectedOrganizationId = $request?->session()->get('current_organization_id');

        if ($selectedOrganizationId) {
            return Organization::query()->find($selectedOrganizationId);
        }

        return Organization::query()->count() === 1
            ? Organization::query()->first()
            : null;
    }
}
