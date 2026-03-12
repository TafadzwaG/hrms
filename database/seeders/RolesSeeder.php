<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        $roles = [
            [
                'code' => 'SYS_ADMIN',
                'name' => 'System Administrator',
                'description' => 'Full system access, configuration, and user administration.',
            ],
            [
                'code' => 'HR_ADMIN',
                'name' => 'HR Administrator',
                'description' => 'Manage employee records, org structure, onboarding, and HR operations.',
            ],
            [
                'code' => 'PAYROLL',
                'name' => 'Payroll Officer',
                'description' => 'Payroll processing, pay runs, deductions, and payroll reports.',
            ],
            [
                'code' => 'MANAGER',
                'name' => 'Manager',
                'description' => 'Approve leave, view team info, manage schedules and timesheets.',
            ],
            [
                'code' => 'AUTHORISER',
                'name' => 'Authoriser',
                'description' => 'Second-level approvals for leave, overtime, and HR requests.',
            ],
            [
                'code' => 'EMPLOYEE',
                'name' => 'Employee',
                'description' => 'Self-service access: profile, leave requests, attendance, payslips.',
            ],
            [
                'code' => 'AUDITOR',
                'name' => 'Auditor',
                'description' => 'Read-only access to compliance reports and audit logs.',
            ],
        ];

        DB::transaction(function () use ($roles, $now) {
            foreach ($roles as $r) {
                Role::updateOrCreate(
                    ['code' => $r['code']],
                    [
                        'name' => $r['name'],
                        'description' => $r['description'],
                        'updated_at' => $now,
                        'created_at' => $now,
                    ]
                );
            }
        });
    }
}