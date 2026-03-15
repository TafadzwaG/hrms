<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\Organization;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EmployeeProfileFieldsSeeder extends Seeder
{
    public function run(): void
    {
        $updated = 0;
        $userEmailsSynced = 0;

        Employee::withoutGlobalScopes()
            ->with(['user:id,email', 'position:id,name', 'organization:id,slug,code'])
            ->orderBy('id')
            ->chunkById(100, function ($employees) use (&$updated, &$userEmailsSynced): void {
                foreach ($employees as $employee) {
                    $organization = $employee->organization;
                    $resolvedEmail = $this->resolveEmployeeEmail($employee, $organization);

                    $updates = [
                        'email' => $resolvedEmail,
                        'national_id' => $employee->national_id ?: $this->generateNationalId($employee),
                        'gender' => $employee->gender ?: $this->defaultGender($employee->id),
                        'occupation' => $employee->occupation ?: ($employee->position?->name ?: 'Employee'),
                        'alt_phone_number' => $employee->alt_phone_number ?: $this->defaultAltPhoneNumber($employee),
                        'marital_status' => $employee->marital_status ?: $this->defaultMaritalStatus($employee->id),
                        'nationality' => $employee->nationality ?: $this->defaultNationality(),
                        'educational_level' => $employee->educational_level ?: $this->defaultEducationalLevel(),
                    ];

                    $dirty = false;

                    foreach ($updates as $column => $value) {
                        if ($employee->getAttribute($column) !== $value) {
                            $employee->setAttribute($column, $value);
                            $dirty = true;
                        }
                    }

                    if ($dirty) {
                        $employee->saveQuietly();
                        $updated++;
                    }

                    if ($employee->user && $employee->user->email !== $resolvedEmail) {
                        $employee->user->forceFill([
                            'email' => $resolvedEmail,
                        ])->saveQuietly();

                        $userEmailsSynced++;
                    }
                }
            });

        $this->command?->info("EmployeeProfileFieldsSeeder completed: {$updated} employees updated, {$userEmailsSynced} linked user emails synchronized.");
    }

    private function resolveEmployeeEmail(Employee $employee, ?Organization $organization): string
    {
        $userEmail = trim((string) ($employee->user?->email ?? ''));
        if ($userEmail !== '') {
            return $userEmail;
        }

        $employeeEmail = trim((string) ($employee->email ?? ''));
        if ($employeeEmail !== '') {
            return $employeeEmail;
        }

        return $this->generateUniqueEmail($employee, $organization);
    }

    private function generateUniqueEmail(Employee $employee, ?Organization $organization): string
    {
        $domain = env('EMPLOYEE_PROFILE_EMAIL_DOMAIN', 'hrms.local');
        $base = Str::slug($employee->staff_number ?: $employee->full_name ?: "employee-{$employee->id}");
        $tenant = Str::slug($organization?->slug ?: $organization?->code ?: 'tenant');
        $localPart = trim($base !== '' ? "{$base}.{$tenant}" : "employee-{$employee->id}.{$tenant}", '.');
        $candidate = "{$localPart}@{$domain}";
        $suffix = 1;

        while ($this->emailExists($candidate, $employee)) {
            $suffix++;
            $candidate = "{$localPart}.{$suffix}@{$domain}";
        }

        return Str::lower($candidate);
    }

    private function generateNationalId(Employee $employee): string
    {
        $tenant = Str::upper(Str::limit(
            preg_replace('/[^A-Z0-9]/', '', (string) ($employee->organization?->code ?: $employee->organization_id ?: 'ORG')),
            5,
            ''
        ));

        $candidate = "{$tenant}-".str_pad((string) $employee->id, 6, '0', STR_PAD_LEFT);
        $suffix = 1;

        while ($this->nationalIdExists($candidate, $employee)) {
            $suffix++;
            $candidate = "{$tenant}-".str_pad((string) $employee->id, 6, '0', STR_PAD_LEFT)."-{$suffix}";
        }

        return $candidate;
    }

    private function emailExists(string $email, Employee $employee): bool
    {
        return Employee::withoutGlobalScopes()
            ->where('email', $email)
            ->whereKeyNot($employee->id)
            ->exists()
            || \App\Models\User::query()
                ->where('email', $email)
                ->when($employee->user_id, fn ($query) => $query->whereKeyNot($employee->user_id))
                ->exists();
    }

    private function nationalIdExists(string $nationalId, Employee $employee): bool
    {
        return Employee::withoutGlobalScopes()
            ->where('organization_id', $employee->organization_id)
            ->where('national_id', $nationalId)
            ->whereKeyNot($employee->id)
            ->exists();
    }

    private function defaultGender(int $employeeId): string
    {
        $options = ['Male', 'Female', 'Other'];

        return $options[$employeeId % count($options)];
    }

    private function defaultMaritalStatus(int $employeeId): string
    {
        $options = ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'];

        return $options[$employeeId % count($options)];
    }

    private function defaultAltPhoneNumber(Employee $employee): ?string
    {
        if (filled($employee->contact_number)) {
            return (string) $employee->contact_number;
        }

        return sprintf('+26377%06d', ($employee->id % 1000000));
    }

    private function defaultNationality(): string
    {
        return env('EMPLOYEE_PROFILE_DEFAULT_NATIONALITY', 'Zimbabwean');
    }

    private function defaultEducationalLevel(): string
    {
        return env('EMPLOYEE_PROFILE_DEFAULT_EDUCATIONAL_LEVEL', 'Diploma');
    }
}
