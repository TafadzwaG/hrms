<?php

namespace Database\Seeders;

use App\Models\OrgUnit;
use App\Models\Position;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PositionsSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        // Try to link positions to existing DEPARTMENT org units by name (if present).
        // If not found, org_unit_id stays null (still valid).
        $deptMap = OrgUnit::query()
            ->select(['id', 'name', 'type'])
            ->where('type', 'DEPARTMENT')
            ->get()
            ->mapWithKeys(fn ($ou) => [Str::lower($ou->name) => $ou->id])
            ->all();

        $positions = [
            // IT
            ['name' => 'IT Manager', 'code' => 'IT-MGR', 'department' => 'it'],
            ['name' => 'Software Developer', 'code' => 'IT-DEV', 'department' => 'it'],
            ['name' => 'Systems Administrator', 'code' => 'IT-SYSADMIN', 'department' => 'it'],
            ['name' => 'Network Engineer', 'code' => 'IT-NET', 'department' => 'it'],
            ['name' => 'IT Support Technician', 'code' => 'IT-SUPPORT', 'department' => 'it'],

            // Finance
            ['name' => 'Finance Manager', 'code' => 'FIN-MGR', 'department' => 'finance'],
            ['name' => 'Accountant', 'code' => 'FIN-ACC', 'department' => 'finance'],
            ['name' => 'Accounts Clerk', 'code' => 'FIN-CLERK', 'department' => 'finance'],
            ['name' => 'Payroll Officer', 'code' => 'FIN-PAYROLL', 'department' => 'finance'],

            // HR
            ['name' => 'HR Manager', 'code' => 'HR-MGR', 'department' => 'hr'],
            ['name' => 'HR Officer', 'code' => 'HR-OFF', 'department' => 'hr'],
            ['name' => 'Recruitment Officer', 'code' => 'HR-REC', 'department' => 'hr'],

            // Operations
            ['name' => 'Operations Manager', 'code' => 'OPS-MGR', 'department' => 'operations'],
            ['name' => 'Operations Supervisor', 'code' => 'OPS-SUP', 'department' => 'operations'],
            ['name' => 'Administrator', 'code' => 'OPS-ADMIN', 'department' => 'operations'],

            // Procurement
            ['name' => 'Procurement Manager', 'code' => 'PROC-MGR', 'department' => 'procurement'],
            ['name' => 'Procurement Officer', 'code' => 'PROC-OFF', 'department' => 'procurement'],
            ['name' => 'Stores Controller', 'code' => 'PROC-STORE', 'department' => 'procurement'],

            // Sales / Business
            ['name' => 'Sales Manager', 'code' => 'SALES-MGR', 'department' => 'sales'],
            ['name' => 'Sales Representative', 'code' => 'SALES-REP', 'department' => 'sales'],
            ['name' => 'Business Development Officer', 'code' => 'BIZDEV-OFF', 'department' => 'sales'],

            // General / Executive
            ['name' => 'General Manager', 'code' => 'GM', 'department' => 'operations'],
            ['name' => 'Chief Executive Officer', 'code' => 'CEO', 'department' => null],
        ];

        DB::transaction(function () use ($positions, $deptMap, $now) {
            foreach ($positions as $p) {
                $deptKey = $p['department'] ? Str::lower($p['department']) : null;

                $orgUnitId = $deptKey && isset($deptMap[$deptKey])
                    ? (int) $deptMap[$deptKey]
                    : null;

                Position::updateOrCreate(
                    ['code' => $p['code']], // unique key
                    [
                        'name' => $p['name'],
                        'org_unit_id' => $orgUnitId,
                        'description' => null,
                        'is_active' => true,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]
                );
            }
        });
    }
}