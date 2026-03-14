<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\Location;
use App\Models\OrgUnit;
use App\Models\Position;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class EmployeesSeeder extends Seeder
{
    public function run(): void
    {
        $faker = fake();

        $companies = OrgUnit::query()
            ->select(['id', 'name', 'type', 'parent_id'])
            ->where('type', 'COMPANY')
            ->orderBy('name')
            ->get();

        if ($companies->isEmpty()) {
            $this->command?->warn('No COMPANY org_units found. Seed org_units first.');
            return;
        }

        $allOrgUnits = OrgUnit::query()
            ->select(['id', 'name', 'type', 'parent_id'])
            ->get();

        // Build children map for fast descendant lookup
        $childrenMap = [];
        foreach ($allOrgUnits as $ou) {
            $parent = $ou->parent_id ?? 0;
            $childrenMap[$parent][] = $ou;
        }

        $allLocationIds = Location::query()->pluck('id')->all();
        $allPositionIds = Position::query()->pluck('id')->all();

        DB::transaction(function () use (
            $faker,
            $companies,
            $childrenMap,
            $allLocationIds,
            $allPositionIds
        ) {
            foreach ($companies as $company) {
                // Find descendant departments/teams under this company
                $deptOrTeamIds = $this->descendantIdsOfTypes($company->id, $childrenMap, ['DEPARTMENT', 'TEAM']);
                if (empty($deptOrTeamIds)) {
                    $deptOrTeamIds = [$company->id];
                }

                // Find SBUs under company for pay_point
                $sbuIds = $this->descendantIdsOfTypes($company->id, $childrenMap, ['SBU']);
                $sbuNames = OrgUnit::query()
                    ->whereIn('id', $sbuIds)
                    ->pluck('name')
                    ->all();

                // Pick location ids linked to company (if pivot exists), else any location
                $locationPool = $this->getCompanyLocationPool($company->id, $allLocationIds);

                // Choose a stable prefix for staff numbers
                $prefix = $this->companyInitials($company->name); // e.g. "PHC"
                $domain = $this->domainFromCompanyName($company->name); // e.g. providence-human-capital.co.zw

                $companyEmployeeIds = [];

                // âœ… At least 5 employees per company
                for ($i = 1; $i <= 5; $i++) {
                    $orgUnitId = $deptOrTeamIds[array_rand($deptOrTeamIds)];
                    $locationId = !empty($locationPool) ? $locationPool[array_rand($locationPool)] : null;

                    // Position: try match by org_unit_id first, else random
                    $positionId = Position::query()
                        ->where('org_unit_id', $orgUnitId)
                        ->inRandomOrder()
                        ->value('id');

                    if (!$positionId && !empty($allPositionIds)) {
                        $positionId = $allPositionIds[array_rand($allPositionIds)];
                    }

                    // Pay point: prefer SBU name if exists, else "Head Office"
                    $payPoint = !empty($sbuNames)
                        ? $sbuNames[array_rand($sbuNames)]
                        : 'Head Office';

                    $staffNumber = sprintf('%s-%d-%03d', $prefix, $company->id, $i); // e.g. PHC-12-001
                    $email = Str::lower($staffNumber) . '@' . $domain;

                    $firstName = $faker->firstName();
                    $surname = $faker->lastName();
                    $middleName = $faker->boolean(30) ? $faker->firstName() : null;

                    // Create/Update user
                    $userData = [
                        'name' => trim($firstName . ' ' . $surname),
                        'email' => $email,
                        'password' => Hash::make('PHC@2025!'), // default
                    ];

                    // Handle optional custom columns safely
                    if (Schema::hasColumn('users', 'username')) {
                        $userData['username'] = Str::lower(Str::slug($firstName . '.' . $surname . '.' . $staffNumber, '.'));
                    }
                    if (Schema::hasColumn('users', 'role')) {
                        // If your users table has a role column (legacy), set something sane
                        $userData['role'] = 'employee';
                    }
                    if (Schema::hasColumn('users', 'email_verified_at')) {
                        $userData['email_verified_at'] = now();
                    }

                    /** @var User $user */
                    $user = User::query()->updateOrCreate(
                        ['email' => $email],
                        $userData
                    );

                    // Create/Update employee
                    $employee = Employee::query()->updateOrCreate(
                        ['staff_number' => $staffNumber],
                        [
                            'user_id' => $user->id,
                            'first_name' => $firstName,
                            'middle_name' => $middleName,
                            'surname' => $surname,
                            'date_of_birth' => $faker->dateTimeBetween('-50 years', '-20 years')->format('Y-m-d'),
                            'pay_point' => $payPoint,
                            'contact_number' => $faker->phoneNumber(),
                            'address' => $faker->address(),
                            'org_unit_id' => $orgUnitId,
                            'location_id' => $locationId,
                            'position_id' => $positionId,
                            'status' => 'ACTIVE',
                            'hire_date' => $faker->dateTimeBetween('-5 years', 'now')->format('Y-m-d'),
                            'termination_date' => null,
                            'manager_id' => null, // set after we insert the group
                        ]
                    );

                    $companyEmployeeIds[] = $employee->id;

                    // Attach EMPLOYEE role if RBAC tables exist
                    $this->attachEmployeeRoleIfAvailable($user);
                }

                // Make the first employee the manager for the rest
                if (count($companyEmployeeIds) >= 2) {
                    $managerId = $companyEmployeeIds[0];
                    $subordinates = array_slice($companyEmployeeIds, 1);

                    Employee::query()
                        ->whereIn('id', $subordinates)
                        ->update(['manager_id' => $managerId]);
                }
            }
        });

        $this->command?->info('EmployeesSeeder completed: 5 employees per company created/updated.');
    }

    private function descendantIdsOfTypes(int $rootId, array $childrenMap, array $types): array
    {
        $types = array_map('strtoupper', $types);

        $stack = [$rootId];
        $result = [];

        while (!empty($stack)) {
            $current = array_pop($stack);

            foreach (($childrenMap[$current] ?? []) as $child) {
                $stack[] = $child->id;
                if (in_array(strtoupper($child->type), $types, true)) {
                    $result[] = $child->id;
                }
            }
        }

        return array_values(array_unique($result));
    }

    private function companyInitials(string $name): string
    {
        $words = preg_split('/\s+/', trim($name));
        $letters = '';

        foreach ($words as $w) {
            if ($w === '') continue;
            $letters .= Str::upper(Str::substr($w, 0, 1));
            if (strlen($letters) >= 3) break;
        }

        return $letters !== '' ? $letters : 'CO';
    }

    private function domainFromCompanyName(string $name): string
    {
        $slug = Str::slug($name); // providence-human-capital
        if ($slug === '') $slug = 'company';
        return $slug . '.co.zw';
    }

    private function getCompanyLocationPool(int $companyOrgUnitId, array $allLocationIds): array
    {
        if (empty($allLocationIds)) return [];

        if (!Schema::hasTable('org_unit_locations')) {
            return $allLocationIds;
        }

        $linked = DB::table('org_unit_locations')
            ->where('org_unit_id', $companyOrgUnitId)
            ->pluck('location_id')
            ->map(fn ($id) => (int)$id)
            ->all();

        return !empty($linked) ? $linked : $allLocationIds;
    }

    private function attachEmployeeRoleIfAvailable(User $user): void
    {
        if (!Schema::hasTable('roles') || !Schema::hasTable('role_users')) {
            return;
        }

        $employeeRole = Role::query()->where('code', 'EMPLOYEE')->first();
        if (!$employeeRole) return;

        // attach without removing existing roles
        $user->roles()->syncWithoutDetaching([$employeeRole->id]);
    }
}
