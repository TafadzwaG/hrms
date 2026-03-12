<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class OrgStructureSeeder extends Seeder
{
    public function run(): void
    {
        // Only seed these 3 tables
        if (!Schema::hasTable('org_units') || !Schema::hasTable('locations') || !Schema::hasTable('org_unit_locations')) {
            return;
        }

        $now = now();

        // ✅ 10 Zimbabwean companies + Providence Human Capital (11 total)
        // (Org structures below are example structures for seeding/dev data.)
        $companies = [
            [
                'name' => 'Providence Human Capital',
                'code' => 'PROV-HC',
                'sbus' => ['ProCanteen', 'Staffing Solutions', 'Providence Health'],
            ],
            ['name' => 'Delta Corporation Limited',        'code' => 'DELTA',    'sbus' => ['Corporate', 'Operations']],
            ['name' => 'Econet Wireless Zimbabwe Limited', 'code' => 'ECONET',   'sbus' => ['Corporate', 'Operations']],
            ['name' => 'Innscor Africa Limited',           'code' => 'INNSCOR',  'sbus' => ['Corporate', 'Operations']],
            ['name' => 'Meikles Limited',                  'code' => 'MEIKLES',  'sbus' => ['Corporate', 'Operations']],
            ['name' => 'National Foods Holdings Limited',  'code' => 'NATFOODS', 'sbus' => ['Corporate', 'Operations']],
            ['name' => 'OK Zimbabwe Limited',              'code' => 'OKZ',      'sbus' => ['Corporate', 'Retail Operations']],
            ['name' => 'Seed Co Limited',                  'code' => 'SEEDCO',   'sbus' => ['Corporate', 'Operations']],
            ['name' => 'Simbisa Brands Limited',           'code' => 'SIMBISA',  'sbus' => ['Corporate', 'Operations']],
            ['name' => 'CBZ Holdings Limited',             'code' => 'CBZ',      'sbus' => ['Corporate', 'Operations']],
            ['name' => 'FBC Holdings Limited',             'code' => 'FBC',      'sbus' => ['Corporate', 'Operations']],
        ];

        $standardDepartments = ['IT', 'Finance', 'HR', 'Operations', 'Procurement'];
        $staffingDepartments = ['IT', 'Finance', 'HR', 'Recruitment', 'Sales'];

        foreach ($companies as $company) {
            // --- Locations per company (HQ + Branch)
            $hqLocationId = $this->upsertLocation(
                name: $company['name'] . ' - Harare HQ',
                city: 'Harare',
                now: $now
            );

            $branchLocationId = $this->upsertLocation(
                name: $company['name'] . ' - Bulawayo Branch',
                city: 'Bulawayo',
                now: $now
            );

            // --- Company org unit (root)
            $companyOrgId = $this->upsertOrgUnit(
                name: $company['name'],
                type: 'COMPANY',
                parentId: null,
                code: $company['code'] ?? null,
                now: $now
            );

            // Link company to HQ (primary)
            $this->attachOrgUnitToLocation($companyOrgId, $hqLocationId, true, $now);

            // --- SBUs under the company
            foreach ($company['sbus'] as $sbuName) {
                $sbuOrgId = $this->upsertOrgUnit(
                    name: $sbuName,
                    type: 'SBU',
                    parentId: $companyOrgId,
                    code: null,
                    now: $now
                );

                // Link SBU to HQ + Branch
                $this->attachOrgUnitToLocation($sbuOrgId, $hqLocationId, true, $now);
                $this->attachOrgUnitToLocation($sbuOrgId, $branchLocationId, false, $now);

                // Departments under each SBU
                $departments = $standardDepartments;

                if ($company['name'] === 'Providence Human Capital' && $sbuName === 'Staffing Solutions') {
                    $departments = $staffingDepartments;
                }

                foreach ($departments as $deptName) {
                    $deptOrgId = $this->upsertOrgUnit(
                        name: $deptName,
                        type: 'DEPARTMENT',
                        parentId: $sbuOrgId,
                        code: null,
                        now: $now
                    );

                    // Attach department to HQ; attach some to branch too
                    $this->attachOrgUnitToLocation($deptOrgId, $hqLocationId, true, $now);

                    if (in_array($deptName, ['Operations', 'Sales', 'Recruitment'], true)) {
                        $this->attachOrgUnitToLocation($deptOrgId, $branchLocationId, false, $now);
                    }
                }
            }
        }
    }

    // ==========================================================
    // Upsert helpers
    // ==========================================================
    private function hasCol(string $table, string $col): bool
    {
        return Schema::hasColumn($table, $col);
    }

    private function upsertOrgUnit(string $name, string $type, ?int $parentId, ?string $code, $now): int
    {
        $data = [
            'name'       => $name,
            'created_at' => $now,
            'updated_at' => $now,
        ];

        if ($this->hasCol('org_units', 'type'))        $data['type'] = $type;
        if ($this->hasCol('org_units', 'parent_id'))   $data['parent_id'] = $parentId;
        if ($this->hasCol('org_units', 'code'))        $data['code'] = $code;
        if ($this->hasCol('org_units', 'cost_center')) $data['cost_center'] = null;

        // Unique match (depends on your schema)
        $unique = ['name' => $name];
        if ($this->hasCol('org_units', 'parent_id')) $unique['parent_id'] = $parentId;
        if ($this->hasCol('org_units', 'type'))      $unique['type'] = $type;

        DB::table('org_units')->updateOrInsert($unique, $data);

        return (int) DB::table('org_units')->where($unique)->value('id');
    }

    private function upsertLocation(string $name, string $city, $now): int
    {
        $data = [
            'name'       => $name,
            'created_at' => $now,
            'updated_at' => $now,
        ];

        if ($this->hasCol('locations', 'timezone')) $data['timezone'] = 'Africa/Harare';

        // Support either single "address" column OR structured address fields
        if ($this->hasCol('locations', 'address')) {
            $data['address'] = $city . ', Zimbabwe';
        }

        if ($this->hasCol('locations', 'address_line1')) $data['address_line1'] = $city . ' CBD';
        if ($this->hasCol('locations', 'address_line2')) $data['address_line2'] = null;
        if ($this->hasCol('locations', 'city'))          $data['city'] = $city;
        if ($this->hasCol('locations', 'state'))         $data['state'] = null;
        if ($this->hasCol('locations', 'country'))       $data['country'] = 'Zimbabwe';
        if ($this->hasCol('locations', 'postal_code'))   $data['postal_code'] = null;
        if ($this->hasCol('locations', 'latitude'))      $data['latitude'] = null;
        if ($this->hasCol('locations', 'longitude'))     $data['longitude'] = null;

        DB::table('locations')->updateOrInsert(['name' => $name], $data);

        return (int) DB::table('locations')->where('name', $name)->value('id');
    }

    private function attachOrgUnitToLocation(int $orgUnitId, int $locationId, bool $isPrimary, $now): void
    {
        // Works whether pivot has composite PK or id+unique
        $data = [
            'org_unit_id' => $orgUnitId,
            'location_id' => $locationId,
            'created_at'  => $now,
            'updated_at'  => $now,
        ];

        if ($this->hasCol('org_unit_locations', 'is_primary'))     $data['is_primary'] = (int) $isPrimary;
        if ($this->hasCol('org_unit_locations', 'effective_from')) $data['effective_from'] = null;
        if ($this->hasCol('org_unit_locations', 'effective_to'))   $data['effective_to'] = null;

        DB::table('org_unit_locations')->updateOrInsert(
            ['org_unit_id' => $orgUnitId, 'location_id' => $locationId],
            $data
        );
    }
}