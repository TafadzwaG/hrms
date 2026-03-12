<?php

namespace Database\Seeders;

use App\Models\Location;
use App\Models\OrgUnit;
use App\Models\Position;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CoreFunctionalitySeeder extends Seeder
{
    private const EMPLOYEES_PER_ORGANIZATION = 40;
    private const DEFAULT_PASSWORD = 'Password@123';

    public function run(): void
    {
        $now = now();

        DB::transaction(function () use ($now): void {
            $roleIds = $this->seedRoles($now);
            [$companies, $departments] = $this->seedOrganizations($now);
            $positionMap = $this->seedPositions($departments, $now);
            $context = $this->seedUsersAndEmployees($companies, $departments, $positionMap, $now);

            $this->assignRoles($context, $roleIds, $now);
            $this->seedWorkflowDefinitions($now);
            $this->seedLeaveRequests($context, $now);
            $this->seedAttendanceRecords($context, $now);
            $this->seedTimesheets($context, $now);
            $this->seedPayrollExports($now);

            $reqContext = $this->seedJobRequisitions($companies, $context, $now);
            $this->seedCandidateProfiles($reqContext, $now);

            $this->seedOnboardingTasks($context, $now);
            $this->seedOffboardingTasks($context, $now);
            $this->seedPerformanceReviews($context, $now);
            $documentTypeIds = $this->seedDocumentTypes($now);
            $this->seedLearningCourses($now);
            $this->seedDocuments($context, $documentTypeIds, $now);
        });

        $this->command?->info('CoreFunctionalitySeeder completed.');
        $this->command?->line('Organizations: 17');
        $this->command?->line('Employees: 680 (40 per organization)');
        $this->command?->line('Admin: admin@hrms.test');
        $this->command?->line('Default password: ' . self::DEFAULT_PASSWORD);
    }

    private function seedRoles($now): array
    {
        $roles = [
            ['code' => 'SYS_ADMIN', 'name' => 'System Administrator', 'description' => 'Full system access and administration.'],
            ['code' => 'HR_ADMIN', 'name' => 'HR Administrator', 'description' => 'Manage HR master data and operations.'],
            ['code' => 'PAYROLL', 'name' => 'Payroll Officer', 'description' => 'Payroll processing and reconciliation.'],
            ['code' => 'MANAGER', 'name' => 'Manager', 'description' => 'Approvals and team supervision.'],
            ['code' => 'AUTHORISER', 'name' => 'Authoriser', 'description' => 'Second-level approval authority.'],
            ['code' => 'EMPLOYEE', 'name' => 'Employee', 'description' => 'Self-service access.'],
            ['code' => 'AUDITOR', 'name' => 'Auditor', 'description' => 'Read-only compliance and audit access.'],
        ];

        foreach ($roles as $role) {
            Role::query()->updateOrCreate(
                ['code' => $role['code']],
                [
                    'name' => $role['name'],
                    'description' => $role['description'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }

        return Role::query()
            ->whereIn('code', array_column($roles, 'code'))
            ->pluck('id', 'code')
            ->map(fn ($id): int => (int) $id)
            ->all();
    }

    private function seedOrganizations($now): array
    {
        $companies = [];
        $departments = [];

        foreach ($this->organizations() as $org) {
            $hq = Location::query()->updateOrCreate(
                ['name' => $org['name'] . ' - Harare HQ'],
                [
                    'timezone' => 'Africa/Harare',
                    'address_line1' => 'Samora Machel Avenue',
                    'city' => 'Harare',
                    'country' => 'Zimbabwe',
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );

            $branch = Location::query()->updateOrCreate(
                ['name' => $org['name'] . ' - ' . $org['branch_city'] . ' Branch'],
                [
                    'timezone' => 'Africa/Harare',
                    'address_line1' => $org['branch_city'] . ' CBD',
                    'city' => $org['branch_city'],
                    'country' => 'Zimbabwe',
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );

            $company = OrgUnit::query()->updateOrCreate(
                ['name' => $org['name'], 'type' => 'COMPANY', 'parent_id' => null],
                [
                    'code' => $org['code'],
                    'cost_center' => $org['code'] . '-ROOT',
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );

            $this->upsertOrgLocation((int) $company->id, (int) $hq->id, true, $now);

            $companyData = [
                'id' => (int) $company->id,
                'name' => $org['name'],
                'code' => $org['code'],
                'domain' => strtolower($org['code']) . '.co.zw',
                'department_ids' => [],
                'pay_point_by_department_id' => [],
            ];

            $sbus = [
                [
                    'name' => 'Corporate Services',
                    'code_suffix' => 'CORP',
                    'departments' => ['HR', 'Finance', 'ICT', 'Legal'],
                    'primary_location_id' => (int) $hq->id,
                    'secondary_location_id' => (int) $branch->id,
                ],
                [
                    'name' => 'Operations',
                    'code_suffix' => 'OPS',
                    'departments' => ['Operations', 'Sales', 'Procurement', 'Customer Service'],
                    'primary_location_id' => (int) $branch->id,
                    'secondary_location_id' => (int) $hq->id,
                ],
            ];

            foreach ($sbus as $sbuSpec) {
                $sbu = OrgUnit::query()->updateOrCreate(
                    ['name' => $sbuSpec['name'], 'type' => 'SBU', 'parent_id' => $company->id],
                    [
                        'code' => $org['code'] . '-' . $sbuSpec['code_suffix'],
                        'cost_center' => $org['code'] . '-' . $sbuSpec['code_suffix'],
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]
                );

                $this->upsertOrgLocation((int) $sbu->id, $sbuSpec['primary_location_id'], true, $now);
                $this->upsertOrgLocation((int) $sbu->id, $sbuSpec['secondary_location_id'], false, $now);

                foreach ($sbuSpec['departments'] as $deptName) {
                    $dept = OrgUnit::query()->updateOrCreate(
                        ['name' => $deptName, 'type' => 'DEPARTMENT', 'parent_id' => $sbu->id],
                        [
                            'code' => $org['code'] . '-' . $this->departmentCode($deptName),
                            'cost_center' => $org['code'] . '-' . $this->departmentCode($deptName),
                            'created_at' => $now,
                            'updated_at' => $now,
                        ]
                    );

                    $this->upsertOrgLocation((int) $dept->id, $sbuSpec['primary_location_id'], true, $now);

                    if (in_array($deptName, ['Sales', 'Operations', 'Customer Service', 'Procurement'], true)) {
                        $this->upsertOrgLocation((int) $dept->id, $sbuSpec['secondary_location_id'], false, $now);
                    }

                    $deptId = (int) $dept->id;
                    $companyData['department_ids'][] = $deptId;
                    $companyData['pay_point_by_department_id'][$deptId] = $sbuSpec['name'];

                    $departments[$deptId] = [
                        'company_id' => (int) $company->id,
                        'company_code' => $org['code'],
                        'department_name' => $deptName,
                        'sbu_name' => $sbuSpec['name'],
                        'primary_location_id' => $sbuSpec['primary_location_id'],
                    ];
                }
            }

            $companies[(int) $company->id] = $companyData;
        }

        return [$companies, $departments];
    }

    private function seedPositions(array $departments, $now): array
    {
        $templatesByDepartment = $this->positionTemplates();
        $map = [];

        foreach ($departments as $deptId => $dept) {
            $templates = $templatesByDepartment[$dept['department_name']] ?? [
                ['name' => 'Officer'],
                ['name' => 'Specialist'],
                ['name' => 'Manager'],
            ];

            $map[$deptId] = [];

            foreach ($templates as $idx => $tpl) {
                $code = sprintf('%s-%s-%02d', $dept['company_code'], $this->departmentCode($dept['department_name']), $idx + 1);

                $position = Position::query()->updateOrCreate(
                    ['code' => $code],
                    [
                        'name' => $tpl['name'],
                        'org_unit_id' => $deptId,
                        'description' => $tpl['name'] . ' - ' . $dept['department_name'],
                        'is_active' => true,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]
                );

                $map[$deptId][] = (int) $position->id;
            }
        }

        return $map;
    }

    private function seedUsersAndEmployees(array $companies, array $departments, array $positionMap, $now): array
    {
        $users = [];
        $employeePlans = [];
        $staffByCompany = [];
        $companyList = array_values($companies);
        $passwordHash = Hash::make(self::DEFAULT_PASSWORD);

        foreach ($companyList as $companyIndex => $company) {
            $deptIds = $company['department_ids'];
            $deptCount = max(count($deptIds), 1);

            for ($n = 1; $n <= self::EMPLOYEES_PER_ORGANIZATION; $n++) {
                $deptId = $deptIds[($n - 1) % $deptCount];
                $dept = $departments[$deptId];
                $positions = $positionMap[$deptId] ?? [];
                $positionId = !empty($positions) ? $positions[($n - 1) % count($positions)] : null;

                $name = $this->zwName($companyIndex, $n);
                $staff = sprintf('%s-%03d', $company['code'], $n);
                $email = strtolower($staff) . '@' . $company['domain'];
                $status = $this->statusForEmployee($n);

                $hireDate = Carbon::now()
                    ->subYears(1 + (($companyIndex + $n) % 7))
                    ->subDays(($companyIndex * 19 + $n * 13) % 300);

                $terminationDate = null;
                if ($status === 'TERMINATED') {
                    $terminationDate = Carbon::now()->subDays(10 + (($companyIndex * 7 + $n * 17) % 240));
                    if ($terminationDate->lessThanOrEqualTo($hireDate)) {
                        $terminationDate = (clone $hireDate)->addMonths(8 + ($n % 12));
                    }
                }

                $users[] = [
                    'name' => trim($name['first'] . ' ' . $name['surname']),
                    'email' => $email,
                    'password' => $passwordHash,
                    'email_verified_at' => $now,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];

                $employeePlans[$staff] = [
                    'company_id' => $company['id'],
                    'email' => $email,
                    'first_name' => $name['first'],
                    'middle_name' => $name['middle'],
                    'surname' => $name['surname'],
                    'date_of_birth' => Carbon::now()
                        ->subYears(22 + (($companyIndex * 3 + $n * 5) % 29))
                        ->subDays(($n * 11) % 365)
                        ->toDateString(),
                    'pay_point' => $company['pay_point_by_department_id'][$deptId] ?? $dept['sbu_name'],
                    'contact_number' => $this->zwMobile($companyIndex, $n),
                    'address' => $this->zwAddress($companyIndex, $n),
                    'org_unit_id' => $deptId,
                    'location_id' => $dept['primary_location_id'],
                    'position_id' => $positionId,
                    'status' => $status,
                    'hire_date' => $hireDate->toDateString(),
                    'termination_date' => $terminationDate?->toDateString(),
                ];

                $staffByCompany[$company['id']][] = $staff;
            }
        }

        $users[] = [
            'name' => 'HRMS System Admin',
            'email' => 'admin@hrms.test',
            'password' => $passwordHash,
            'email_verified_at' => $now,
            'created_at' => $now,
            'updated_at' => $now,
        ];

        DB::table('users')->upsert($users, ['email'], ['name', 'password', 'email_verified_at', 'updated_at']);

        $userIdByEmail = DB::table('users')
            ->whereIn('email', array_column($users, 'email'))
            ->pluck('id', 'email')
            ->map(fn ($id): int => (int) $id)
            ->all();

        $employeeRows = [];
        foreach ($employeePlans as $staff => $plan) {
            $employeeRows[] = [
                'user_id' => $userIdByEmail[$plan['email']] ?? null,
                'staff_number' => $staff,
                'first_name' => $plan['first_name'],
                'middle_name' => $plan['middle_name'],
                'surname' => $plan['surname'],
                'date_of_birth' => $plan['date_of_birth'],
                'pay_point' => $plan['pay_point'],
                'contact_number' => $plan['contact_number'],
                'address' => $plan['address'],
                'org_unit_id' => $plan['org_unit_id'],
                'location_id' => $plan['location_id'],
                'position_id' => $plan['position_id'],
                'manager_id' => null,
                'status' => $plan['status'],
                'hire_date' => $plan['hire_date'],
                'termination_date' => $plan['termination_date'],
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('employees')->upsert(
            $employeeRows,
            ['staff_number'],
            [
                'user_id', 'first_name', 'middle_name', 'surname', 'date_of_birth', 'pay_point',
                'contact_number', 'address', 'org_unit_id', 'location_id', 'position_id', 'manager_id',
                'status', 'hire_date', 'termination_date', 'updated_at',
            ]
        );

        $employeeIdByStaff = DB::table('employees')
            ->whereIn('staff_number', array_keys($employeePlans))
            ->pluck('id', 'staff_number')
            ->map(fn ($id): int => (int) $id)
            ->all();

        $managerUpdates = [];
        foreach ($staffByCompany as $staffNumbers) {
            if (count($staffNumbers) < 3) {
                continue;
            }

            $primary = $employeeIdByStaff[$staffNumbers[0]] ?? null;
            $secondary = $employeeIdByStaff[$staffNumbers[1]] ?? null;
            if (!$primary || !$secondary) {
                continue;
            }

            foreach ($staffNumbers as $idx => $staff) {
                if ($idx < 2) {
                    continue;
                }
                $managerUpdates[] = [
                    'staff_number' => $staff,
                    'manager_id' => ($idx % 2 === 0) ? $primary : $secondary,
                    'updated_at' => $now,
                ];
            }
        }

        if (!empty($managerUpdates)) {
            foreach ($managerUpdates as $update) {
                DB::table('employees')
                    ->where('staff_number', $update['staff_number'])
                    ->update([
                        'manager_id' => $update['manager_id'],
                        'updated_at' => $update['updated_at'],
                    ]);
            }
        }

        $employees = DB::table('employees')
            ->select(['id', 'user_id', 'staff_number', 'first_name', 'middle_name', 'surname', 'manager_id', 'status', 'hire_date', 'termination_date'])
            ->whereIn('staff_number', array_keys($employeePlans))
            ->orderBy('staff_number')
            ->get();

        $staffToCompany = [];
        foreach ($employeePlans as $staff => $plan) {
            $staffToCompany[$staff] = (int) $plan['company_id'];
        }

        $rows = [];
        $byCompany = [];
        $nameById = [];

        foreach ($employees as $employee) {
            $companyId = $staffToCompany[$employee->staff_number] ?? 0;
            $fullName = trim($employee->first_name . ' ' . ($employee->middle_name ? $employee->middle_name . ' ' : '') . $employee->surname);

            $row = [
                'id' => (int) $employee->id,
                'user_id' => (int) $employee->user_id,
                'company_id' => $companyId,
                'staff_number' => $employee->staff_number,
                'full_name' => $fullName,
                'manager_id' => $employee->manager_id ? (int) $employee->manager_id : null,
                'status' => $employee->status,
                'hire_date' => $employee->hire_date,
                'termination_date' => $employee->termination_date,
            ];

            $rows[] = $row;
            $byCompany[$companyId][] = $row;
            $nameById[(int) $employee->id] = $fullName;
        }

        return [
            'employees' => $rows,
            'employees_by_company' => $byCompany,
            'employee_name_by_id' => $nameById,
            'admin_user_id' => $userIdByEmail['admin@hrms.test'] ?? null,
        ];
    }

    private function assignRoles(array $context, array $roleIds, $now): void
    {
        $pairs = [];
        $add = function (int $roleId, int $userId) use (&$pairs, $now): void {
            $key = $roleId . ':' . $userId;
            $pairs[$key] = ['role_id' => $roleId, 'user_id' => $userId, 'created_at' => $now, 'updated_at' => $now];
        };

        foreach ($context['employees'] as $employee) {
            if (isset($roleIds['EMPLOYEE'])) {
                $add($roleIds['EMPLOYEE'], $employee['user_id']);
            }

            $seq = $this->staffSeq($employee['staff_number']);

            if ($seq <= 2 && isset($roleIds['MANAGER'])) {
                $add($roleIds['MANAGER'], $employee['user_id']);
            }
            if ($seq === 1 && isset($roleIds['AUTHORISER'])) {
                $add($roleIds['AUTHORISER'], $employee['user_id']);
            }
            if ($seq === 6 && isset($roleIds['PAYROLL'])) {
                $add($roleIds['PAYROLL'], $employee['user_id']);
            }
            if ($seq === 3 && isset($roleIds['AUDITOR'])) {
                $add($roleIds['AUDITOR'], $employee['user_id']);
            }
        }

        if (!empty($context['admin_user_id'])) {
            if (isset($roleIds['SYS_ADMIN'])) {
                $add($roleIds['SYS_ADMIN'], (int) $context['admin_user_id']);
            }
            if (isset($roleIds['HR_ADMIN'])) {
                $add($roleIds['HR_ADMIN'], (int) $context['admin_user_id']);
            }
        }

        if (!empty($pairs)) {
            DB::table('role_users')->upsert(array_values($pairs), ['role_id', 'user_id'], ['updated_at']);
        }
    }

    private function seedWorkflowDefinitions($now): void
    {
        $rows = [
            ['name' => 'Leave Approval Workflow', 'request_type' => 'leave_request', 'steps' => [['step' => 1, 'role' => 'MANAGER'], ['step' => 2, 'role' => 'HR_ADMIN']], 'sla_hours' => 48, 'status' => 'ACTIVE'],
            ['name' => 'Overtime Regularisation', 'request_type' => 'time_adjustment', 'steps' => [['step' => 1, 'role' => 'MANAGER'], ['step' => 2, 'role' => 'PAYROLL']], 'sla_hours' => 24, 'status' => 'ACTIVE'],
            ['name' => 'Onboarding Checklist Approval', 'request_type' => 'onboarding', 'steps' => [['step' => 1, 'role' => 'HR_ADMIN'], ['step' => 2, 'role' => 'MANAGER']], 'sla_hours' => 72, 'status' => 'ACTIVE'],
            ['name' => 'Document Access Escalation', 'request_type' => 'document_access', 'steps' => [['step' => 1, 'role' => 'HR_ADMIN'], ['step' => 2, 'role' => 'AUTHORISER']], 'sla_hours' => 12, 'status' => 'ACTIVE'],
            ['name' => 'Offboarding Clearance Workflow', 'request_type' => 'offboarding', 'steps' => [['step' => 1, 'role' => 'MANAGER'], ['step' => 2, 'role' => 'HR_ADMIN'], ['step' => 3, 'role' => 'PAYROLL']], 'sla_hours' => 96, 'status' => 'ACTIVE'],
            ['name' => 'Legacy Position Change Workflow', 'request_type' => 'position_change', 'steps' => [['step' => 1, 'role' => 'MANAGER'], ['step' => 2, 'role' => 'AUTHORISER']], 'sla_hours' => 72, 'status' => 'INACTIVE'],
        ];

        foreach ($rows as $row) {
            DB::table('workflow_definitions')->updateOrInsert(
                ['name' => $row['name'], 'request_type' => $row['request_type']],
                [
                    'steps_json' => json_encode($row['steps'], JSON_THROW_ON_ERROR),
                    'sla_hours' => $row['sla_hours'],
                    'status' => $row['status'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }
    }

    private function seedLeaveRequests(array $context, $now): void
    {
        DB::table('leave_requests')->delete();

        $types = ['Annual Leave', 'Sick Leave', 'Maternity Leave', 'Paternity Leave', 'Compassionate Leave', 'Study Leave'];
        $statuses = ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];
        $rows = [];

        foreach ($context['employees'] as $employee) {
            $seq = $this->staffSeq($employee['staff_number']);
            $status = $statuses[($employee['id'] + $seq) % count($statuses)];
            $type = $types[($seq + $employee['company_id']) % count($types)];
            $days = 1 + (($employee['id'] + $seq) % 10);

            $start = $status === 'PENDING'
                ? Carbon::now()->addDays(2 + (($employee['id'] + $seq) % 45))
                : Carbon::now()->subDays(20 + (($employee['id'] + $seq * 3) % 280));

            $approver = null;
            if ($status !== 'PENDING' && $employee['manager_id']) {
                $approver = $context['employee_name_by_id'][$employee['manager_id']] ?? null;
            }

            $rows[] = [
                'employee_id' => $employee['id'],
                'leave_type' => $type,
                'start_date' => $start->toDateString(),
                'end_date' => (clone $start)->addDays($days - 1)->toDateString(),
                'days' => (float) $days,
                'status' => $status,
                'reason' => 'Seeded test leave request.',
                'approver_name' => $approver,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        $this->insertChunks('leave_requests', $rows);
    }

    private function seedAttendanceRecords(array $context, $now): void
    {
        DB::table('attendance_records')->delete();

        $rows = [];
        $dates = $this->recentWorkDates(7);

        foreach ($context['employees'] as $employee) {
            if ($employee['status'] !== 'ACTIVE') {
                continue;
            }

            foreach ($dates as $dayIdx => $workDate) {
                $clockIn = Carbon::parse($workDate)->setTime(8, 0)
                    ->addMinutes((($employee['id'] * 3 + $dayIdx * 11) % 55) - 15);

                $missing = (($employee['id'] + $dayIdx) % 37) === 0;
                $clockOut = null;
                $minutes = null;
                $exception = 'NORMAL';
                $notes = null;

                if ($missing) {
                    $exception = 'MISSING_PUNCH';
                    $notes = 'Missing clock out punch.';
                } else {
                    $clockOut = (clone $clockIn)->addHours(8)->addMinutes((($employee['id'] * 7 + $dayIdx * 13) % 121) - 30);
                    $minutes = max(0, $clockIn->diffInMinutes($clockOut));

                    if ($clockIn->greaterThan(Carbon::parse($workDate)->setTime(8, 15))) {
                        $exception = 'LATE';
                        $notes = 'Late arrival.';
                    }
                    if ($minutes > 570) {
                        $exception = 'ABNORMAL_OT';
                        $notes = 'Abnormal overtime.';
                    }
                }

                $rows[] = [
                    'employee_id' => $employee['id'],
                    'work_date' => $workDate,
                    'clock_in' => $clockIn->toDateTimeString(),
                    'clock_out' => $clockOut?->toDateTimeString(),
                    'minutes_worked' => $minutes,
                    'exception_status' => $exception,
                    'notes' => $notes,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        $this->insertChunks('attendance_records', $rows);
    }

    private function seedTimesheets(array $context, $now): void
    {
        DB::table('timesheets')->delete();

        $statuses = ['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'LOCKED'];
        $start = Carbon::now()->startOfMonth()->toDateString();
        $end = Carbon::now()->endOfMonth()->toDateString();
        $rows = [];

        foreach ($context['employees'] as $employee) {
            $seq = $this->staffSeq($employee['staff_number']);
            $status = $statuses[($employee['id'] + $seq) % count($statuses)];
            $days = 18 + (($employee['id'] + $seq) % 6);
            $total = $days * 8 * 60;
            $overtime = ($status === 'APPROVED' || $status === 'LOCKED')
                ? 40 + (($employee['id'] + $seq) % 180)
                : (($employee['id'] + $seq) % 45);

            $approvedBy = null;
            if (($status === 'APPROVED' || $status === 'LOCKED') && $employee['manager_id']) {
                $approvedBy = $context['employee_name_by_id'][$employee['manager_id']] ?? null;
            }

            $rows[] = [
                'employee_id' => $employee['id'],
                'period_start' => $start,
                'period_end' => $end,
                'total_minutes' => $total,
                'overtime_minutes' => $overtime,
                'status' => $status,
                'approved_by' => $approvedBy,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        $this->insertChunks('timesheets', $rows);
    }

    private function seedPayrollExports($now): void
    {
        DB::table('payroll_exports')->delete();

        $statuses = ['RECONCILED', 'EXPORTED', 'FAILED', 'PREPARED', 'EXPORTED', 'RECONCILED'];
        $rows = [];

        for ($i = 0; $i < 6; $i++) {
            $month = Carbon::now()->subMonths($i);
            $status = $statuses[$i] ?? 'PREPARED';

            $rows[] = [
                'period_start' => (clone $month)->startOfMonth()->toDateString(),
                'period_end' => (clone $month)->endOfMonth()->toDateString(),
                'export_version' => 'v' . $month->format('Y.m') . '.0',
                'status' => $status,
                'exported_at' => in_array($status, ['EXPORTED', 'RECONCILED', 'FAILED'], true)
                    ? (clone $month)->endOfMonth()->setTime(16, 30)->toDateTimeString()
                    : null,
                'file_reference' => 'payroll_exports/' . $month->format('Y-m') . '-batch.csv',
                'notes' => $status === 'FAILED' ? 'Seeded failure case.' : 'Seeded payroll export.',
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        $this->insertChunks('payroll_exports', $rows);
    }

    private function seedJobRequisitions(array $companies, array $context, $now): array
    {
        $departments = ['HR', 'Finance', 'ICT', 'Operations', 'Sales', 'Procurement', 'Customer Service'];
        $titles = ['Human Resources Officer', 'Accountant', 'Systems Administrator', 'Operations Supervisor', 'Sales Representative', 'Procurement Officer', 'Customer Support Agent'];
        $statuses = ['OPEN', 'ON_HOLD', 'CLOSED', 'FILLED'];

        $rows = [];
        $reqContext = [];
        $i = 0;

        foreach ($companies as $company) {
            $employees = $context['employees_by_company'][$company['id']] ?? [];
            $manager = $employees[0]['full_name'] ?? null;

            for ($r = 1; $r <= 2; $r++) {
                $status = $statuses[($i + $r) % count($statuses)];
                $code = sprintf('REQ-%s-%03d', $company['code'], $r);

                $rows[] = [
                    'requisition_code' => $code,
                    'title' => $titles[($i + $r) % count($titles)],
                    'department' => $departments[($i + $r) % count($departments)],
                    'hiring_manager' => $manager,
                    'openings' => 1 + (($i + $r) % 4),
                    'status' => $status,
                    'target_start_date' => in_array($status, ['OPEN', 'ON_HOLD'], true)
                        ? Carbon::now()->addDays(15 + (($i + $r) % 120))->toDateString()
                        : Carbon::now()->subDays(15 + (($i + $r) % 120))->toDateString(),
                    'created_at' => $now,
                    'updated_at' => $now,
                ];

                $reqContext[] = ['code' => $code, 'status' => $status];
            }

            $i++;
        }

        DB::table('job_requisitions')->upsert(
            $rows,
            ['requisition_code'],
            ['title', 'department', 'hiring_manager', 'openings', 'status', 'target_start_date', 'updated_at']
        );

        return $reqContext;
    }

    private function seedCandidateProfiles(array $reqContext, $now): void
    {
        DB::table('candidate_profiles')->delete();

        $firstNames = $this->firstNames();
        $surnames = $this->surnames();
        $stages = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'];
        $rows = [];

        foreach ($reqContext as $reqIdx => $req) {
            for ($i = 0; $i < 3; $i++) {
                $first = $firstNames[($reqIdx * 7 + $i * 11) % count($firstNames)];
                $surname = $surnames[($reqIdx * 13 + $i * 5) % count($surnames)];
                $stage = $stages[($reqIdx + $i) % count($stages)];
                $status = match ($stage) {
                    'HIRED' => 'HIRED',
                    'REJECTED' => 'REJECTED',
                    default => 'ACTIVE',
                };

                if ($req['status'] === 'FILLED' && $i === 0) {
                    $stage = 'HIRED';
                    $status = 'HIRED';
                }
                if ($req['status'] === 'CLOSED' && $i === 2) {
                    $stage = 'REJECTED';
                    $status = 'REJECTED';
                }

                $rows[] = [
                    'requisition_code' => $req['code'],
                    'full_name' => $first . ' ' . $surname,
                    'email' => Str::lower($first . '.' . $surname . '.' . ($reqIdx + 1) . ($i + 1) . '@candidate.co.zw'),
                    'phone' => '+2637' . str_pad((string) (10000000 + (($reqIdx + 1) * 431 + $i * 173) % 89999999), 8, '0', STR_PAD_LEFT),
                    'stage' => $stage,
                    'status' => $status,
                    'notes' => 'Seeded candidate profile.',
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        $this->insertChunks('candidate_profiles', $rows);
    }

    private function seedOnboardingTasks(array $context, $now): void
    {
        DB::table('onboarding_tasks')->delete();

        $tasks = [
            ['name' => 'Collect onboarding documentation', 'owner' => 'HR'],
            ['name' => 'Provision email and system access', 'owner' => 'IT'],
            ['name' => 'Issue access card and workstation', 'owner' => 'Facilities'],
            ['name' => 'Schedule induction and orientation', 'owner' => 'HR'],
        ];
        $statuses = ['OPEN', 'IN_PROGRESS', 'DONE', 'OVERDUE'];
        $rows = [];

        foreach ($context['employees_by_company'] as $employees) {
            usort($employees, fn (array $a, array $b): int => strcmp((string) $b['hire_date'], (string) $a['hire_date']));
            $selected = array_slice($employees, 0, 6);

            foreach ($selected as $employee) {
                $hireDate = $employee['hire_date'] ? Carbon::parse($employee['hire_date']) : Carbon::now();

                foreach ($tasks as $idx => $task) {
                    $rows[] = [
                        'employee_id' => $employee['id'],
                        'task_name' => $task['name'],
                        'owner_team' => $task['owner'],
                        'due_date' => (clone $hireDate)->addDays($idx + 1)->toDateString(),
                        'status' => $statuses[($employee['id'] + $idx) % count($statuses)],
                        'notes' => 'Seeded onboarding task.',
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
            }
        }

        $this->insertChunks('onboarding_tasks', $rows);
    }

    private function seedOffboardingTasks(array $context, $now): void
    {
        DB::table('offboarding_tasks')->delete();

        $tasks = [
            ['name' => 'Revoke system access', 'owner' => 'IT'],
            ['name' => 'Recover company assets', 'owner' => 'Facilities'],
            ['name' => 'Finalize payroll and benefits', 'owner' => 'Finance'],
        ];
        $statuses = ['OPEN', 'IN_PROGRESS', 'CLEARED', 'BLOCKED'];
        $rows = [];

        foreach ($context['employees'] as $employee) {
            if ($employee['status'] !== 'TERMINATED') {
                continue;
            }

            $terminationDate = $employee['termination_date']
                ? Carbon::parse($employee['termination_date'])
                : Carbon::now()->subDays(1);

            foreach ($tasks as $idx => $task) {
                $rows[] = [
                    'employee_id' => $employee['id'],
                    'task_name' => $task['name'],
                    'owner_team' => $task['owner'],
                    'due_date' => (clone $terminationDate)->addDays($idx + 1)->toDateString(),
                    'status' => $statuses[($employee['id'] + $idx) % count($statuses)],
                    'notes' => 'Seeded offboarding task.',
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        $this->insertChunks('offboarding_tasks', $rows);
    }

    private function seedPerformanceReviews(array $context, $now): void
    {
        DB::table('performance_reviews')->delete();

        $statuses = ['PLANNED', 'IN_REVIEW', 'COMPLETED'];
        $rows = [];

        foreach ($context['employees'] as $employee) {
            $status = $statuses[$employee['id'] % count($statuses)];

            $rows[] = [
                'employee_id' => $employee['id'],
                'cycle_name' => '2025 Annual Review',
                'reviewer_name' => $employee['manager_id']
                    ? ($context['employee_name_by_id'][$employee['manager_id']] ?? 'Manager')
                    : 'HR Business Partner',
                'rating' => $status === 'COMPLETED' ? round(2.4 + (($employee['id'] % 25) / 10), 2) : null,
                'status' => $status,
                'review_date' => Carbon::now()->subDays(($employee['id'] * 5) % 330)->toDateString(),
                'comments' => $status === 'COMPLETED' ? 'Seeded completed review.' : 'Seeded active review.',
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        $this->insertChunks('performance_reviews', $rows);
    }

    private function seedDocumentTypes($now): array
    {
        $types = [
            ['code' => 'CONTRACT', 'name' => 'Employment Contract', 'retention' => '7 years post-termination', 'sensitivity' => 'CONFIDENTIAL'],
            ['code' => 'NATIONAL_ID', 'name' => 'National ID Copy', 'retention' => 'Duration of employment', 'sensitivity' => 'CONFIDENTIAL'],
            ['code' => 'TAX_CLEARANCE', 'name' => 'Tax Clearance', 'retention' => '7 years', 'sensitivity' => 'NORMAL'],
            ['code' => 'NSSA', 'name' => 'NSSA Registration', 'retention' => '7 years', 'sensitivity' => 'NORMAL'],
            ['code' => 'MEDICAL_AID', 'name' => 'Medical Aid Enrollment', 'retention' => 'Duration of employment', 'sensitivity' => 'HIGHLY_CONFIDENTIAL'],
            ['code' => 'DISCIPLINARY', 'name' => 'Disciplinary Record', 'retention' => '5 years', 'sensitivity' => 'HIGHLY_CONFIDENTIAL'],
            ['code' => 'TRAINING_CERT', 'name' => 'Training Certificate', 'retention' => '5 years', 'sensitivity' => 'NORMAL'],
            ['code' => 'LEAVE_FORM', 'name' => 'Approved Leave Form', 'retention' => '3 years', 'sensitivity' => 'NORMAL'],
            ['code' => 'EXIT_CLEARANCE', 'name' => 'Exit Clearance Form', 'retention' => '7 years', 'sensitivity' => 'CONFIDENTIAL'],
        ];

        $rows = [];
        foreach ($types as $type) {
            $rows[] = [
                'code' => $type['code'],
                'name' => $type['name'],
                'retention_policy' => $type['retention'],
                'sensitivity_level' => $type['sensitivity'],
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('document_types')->upsert($rows, ['code'], ['name', 'retention_policy', 'sensitivity_level', 'updated_at']);

        return DB::table('document_types')
            ->whereIn('code', array_column($types, 'code'))
            ->pluck('id', 'code')
            ->map(fn ($id): int => (int) $id)
            ->all();
    }

    private function seedLearningCourses($now): void
    {
        $courses = [
            ['code' => 'LMS-001', 'title' => 'Workplace Safety Basics', 'category' => 'Compliance', 'hours' => 2.5, 'required' => true, 'expiry' => 365, 'status' => 'ACTIVE'],
            ['code' => 'LMS-002', 'title' => 'Data Protection Fundamentals', 'category' => 'Compliance', 'hours' => 1.5, 'required' => true, 'expiry' => 365, 'status' => 'ACTIVE'],
            ['code' => 'LMS-003', 'title' => 'Code of Conduct', 'category' => 'Compliance', 'hours' => 1.0, 'required' => true, 'expiry' => 730, 'status' => 'ACTIVE'],
            ['code' => 'LMS-004', 'title' => 'Manager Coaching Skills', 'category' => 'Leadership', 'hours' => 3.0, 'required' => false, 'expiry' => null, 'status' => 'ACTIVE'],
            ['code' => 'LMS-005', 'title' => 'Payroll Reconciliation', 'category' => 'Finance', 'hours' => 2.0, 'required' => false, 'expiry' => null, 'status' => 'ACTIVE'],
            ['code' => 'LMS-006', 'title' => 'Advanced Excel for HR', 'category' => 'HR Operations', 'hours' => 4.0, 'required' => false, 'expiry' => null, 'status' => 'ACTIVE'],
            ['code' => 'LMS-007', 'title' => 'Recruitment Interview Techniques', 'category' => 'Recruitment', 'hours' => 2.5, 'required' => false, 'expiry' => null, 'status' => 'ACTIVE'],
            ['code' => 'LMS-008', 'title' => 'Attendance and Timesheet Controls', 'category' => 'Operations', 'hours' => 2.0, 'required' => true, 'expiry' => 365, 'status' => 'ACTIVE'],
            ['code' => 'LMS-009', 'title' => 'Conflict Resolution', 'category' => 'Leadership', 'hours' => 2.0, 'required' => false, 'expiry' => null, 'status' => 'ACTIVE'],
            ['code' => 'LMS-010', 'title' => 'Internal Audit Essentials', 'category' => 'Risk', 'hours' => 3.0, 'required' => false, 'expiry' => null, 'status' => 'INACTIVE'],
            ['code' => 'LMS-011', 'title' => 'Employee Wellness Awareness', 'category' => 'Wellness', 'hours' => 1.0, 'required' => false, 'expiry' => null, 'status' => 'ACTIVE'],
            ['code' => 'LMS-012', 'title' => 'Cybersecurity Hygiene', 'category' => 'IT Security', 'hours' => 1.5, 'required' => true, 'expiry' => 365, 'status' => 'ACTIVE'],
            ['code' => 'LMS-013', 'title' => 'Procurement Ethics', 'category' => 'Procurement', 'hours' => 2.0, 'required' => true, 'expiry' => 730, 'status' => 'ACTIVE'],
            ['code' => 'LMS-014', 'title' => 'Customer Service Excellence', 'category' => 'Service', 'hours' => 2.5, 'required' => false, 'expiry' => null, 'status' => 'ACTIVE'],
            ['code' => 'LMS-015', 'title' => 'Legacy Payroll Migration', 'category' => 'Finance', 'hours' => 2.5, 'required' => false, 'expiry' => null, 'status' => 'ARCHIVED'],
        ];

        $rows = [];
        foreach ($courses as $course) {
            $rows[] = [
                'course_code' => $course['code'],
                'title' => $course['title'],
                'category' => $course['category'],
                'duration_hours' => $course['hours'],
                'compliance_required' => $course['required'],
                'expires_after_days' => $course['expiry'],
                'status' => $course['status'],
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('learning_courses')->upsert(
            $rows,
            ['course_code'],
            ['title', 'category', 'duration_hours', 'compliance_required', 'expires_after_days', 'status', 'updated_at']
        );
    }

    private function seedDocuments(array $context, array $documentTypeIds, $now): void
    {
        DB::table('documents')->delete();

        $rows = [];
        foreach ($context['employees'] as $employee) {
            $hireDate = $employee['hire_date'] ? Carbon::parse($employee['hire_date']) : Carbon::now()->subYears(1);
            $seq = $this->staffSeq($employee['staff_number']);

            if (isset($documentTypeIds['CONTRACT'])) {
                $rows[] = [
                    'owner_employee_id' => $employee['id'],
                    'document_type_id' => $documentTypeIds['CONTRACT'],
                    'title' => 'Employment Contract - ' . $employee['staff_number'],
                    'file_uri' => 'documents/contracts/' . strtolower($employee['staff_number']) . '.pdf',
                    'issue_date' => $hireDate->toDateString(),
                    'expiry_date' => null,
                    'metadata_json' => json_encode(['issuer' => 'HR', 'version' => 'v1'], JSON_THROW_ON_ERROR),
                    'access_policy' => 'OWNER_MANAGER_HR',
                    'created_at' => $now,
                    'updated_at' => $now,
                    'deleted_at' => null,
                ];
            }

            if ($seq % 2 === 0 && isset($documentTypeIds['NATIONAL_ID'])) {
                $rows[] = [
                    'owner_employee_id' => $employee['id'],
                    'document_type_id' => $documentTypeIds['NATIONAL_ID'],
                    'title' => 'National ID - ' . $employee['staff_number'],
                    'file_uri' => 'documents/ids/' . strtolower($employee['staff_number']) . '.pdf',
                    'issue_date' => (clone $hireDate)->subYears(4)->toDateString(),
                    'expiry_date' => null,
                    'metadata_json' => json_encode(['verified' => true], JSON_THROW_ON_ERROR),
                    'access_policy' => 'HR_ONLY',
                    'created_at' => $now,
                    'updated_at' => $now,
                    'deleted_at' => null,
                ];
            }

            if ($seq % 3 === 0 && isset($documentTypeIds['MEDICAL_AID'])) {
                $rows[] = [
                    'owner_employee_id' => $employee['id'],
                    'document_type_id' => $documentTypeIds['MEDICAL_AID'],
                    'title' => 'Medical Aid Enrollment - ' . $employee['staff_number'],
                    'file_uri' => 'documents/medical/' . strtolower($employee['staff_number']) . '.pdf',
                    'issue_date' => $hireDate->toDateString(),
                    'expiry_date' => Carbon::now()->addDays(365)->toDateString(),
                    'metadata_json' => json_encode(['plan' => 'Standard'], JSON_THROW_ON_ERROR),
                    'access_policy' => 'HR_ONLY',
                    'created_at' => $now,
                    'updated_at' => $now,
                    'deleted_at' => null,
                ];
            }

            if ($employee['status'] === 'TERMINATED' && isset($documentTypeIds['EXIT_CLEARANCE'])) {
                $rows[] = [
                    'owner_employee_id' => $employee['id'],
                    'document_type_id' => $documentTypeIds['EXIT_CLEARANCE'],
                    'title' => 'Exit Clearance - ' . $employee['staff_number'],
                    'file_uri' => 'documents/clearance/' . strtolower($employee['staff_number']) . '.pdf',
                    'issue_date' => $employee['termination_date'],
                    'expiry_date' => null,
                    'metadata_json' => json_encode(['status' => 'in_progress'], JSON_THROW_ON_ERROR),
                    'access_policy' => 'OWNER_AND_HR',
                    'created_at' => $now,
                    'updated_at' => $now,
                    'deleted_at' => null,
                ];
            }
        }

        $this->insertChunks('documents', $rows);
    }

    private function upsertOrgLocation(int $orgUnitId, int $locationId, bool $isPrimary, $now): void
    {
        DB::table('org_unit_locations')->updateOrInsert(
            ['org_unit_id' => $orgUnitId, 'location_id' => $locationId],
            [
                'is_primary' => $isPrimary,
                'effective_from' => null,
                'effective_to' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ]
        );
    }

    private function insertChunks(string $table, array $rows, int $chunkSize = 500): void
    {
        if (empty($rows)) {
            return;
        }

        foreach (array_chunk($rows, $chunkSize) as $chunk) {
            DB::table($table)->insert($chunk);
        }
    }

    private function recentWorkDates(int $count): array
    {
        $dates = [];
        $cursor = Carbon::now()->startOfDay();

        while (count($dates) < $count) {
            if (!$cursor->isWeekend()) {
                $dates[] = $cursor->toDateString();
            }
            $cursor->subDay();
        }

        return array_reverse($dates);
    }

    private function zwName(int $companyIndex, int $employeeNo): array
    {
        $firstNames = $this->firstNames();
        $middleNames = $this->middleNames();
        $surnames = $this->surnames();

        $first = $firstNames[($companyIndex * 17 + $employeeNo * 7) % count($firstNames)];
        $surname = $surnames[($companyIndex * 23 + $employeeNo * 11) % count($surnames)];
        $middle = (($companyIndex + $employeeNo) % 3 === 0)
            ? $middleNames[($companyIndex * 13 + $employeeNo * 5) % count($middleNames)]
            : null;

        return ['first' => $first, 'middle' => $middle, 'surname' => $surname];
    }

    private function zwMobile(int $companyIndex, int $employeeNo): string
    {
        $serial = 10000000 + (($companyIndex * 719 + $employeeNo * 97) % 89999999);
        return '+2637' . str_pad((string) $serial, 8, '0', STR_PAD_LEFT);
    }

    private function zwAddress(int $companyIndex, int $employeeNo): string
    {
        $suburbs = ['Borrowdale', 'Avondale', 'Marlborough', 'Msasa', 'Belvedere', 'Mabelreign', 'Eastlea', 'Highlands', 'Greendale', 'Southerton', 'Hillside', 'Bradfield', 'Famona', 'Senga', 'Mkoba', 'CBD'];
        $cities = ['Harare', 'Bulawayo', 'Mutare', 'Gweru', 'Masvingo', 'Kadoma', 'Kwekwe', 'Chinhoyi'];
        $roads = ['Samora Machel Ave', 'Jason Moyo Ave', 'Leopold Takawira St', 'Herbert Chitepo Ave', 'Josiah Tongogara Ave'];

        $suburb = $suburbs[($companyIndex * 5 + $employeeNo * 3) % count($suburbs)];
        $city = $cities[($companyIndex * 7 + $employeeNo * 2) % count($cities)];
        $road = $roads[($companyIndex * 11 + $employeeNo) % count($roads)];
        $number = 10 + (($companyIndex * 17 + $employeeNo * 13) % 490);

        return $number . ' ' . $road . ', ' . $suburb . ', ' . $city . ', Zimbabwe';
    }

    private function statusForEmployee(int $employeeNo): string
    {
        if ($employeeNo >= 38) {
            return 'TERMINATED';
        }
        if ($employeeNo >= 35) {
            return 'SUSPENDED';
        }
        return 'ACTIVE';
    }

    private function staffSeq(string $staffNumber): int
    {
        $parts = explode('-', $staffNumber);
        $last = end($parts);
        return is_numeric($last) ? (int) $last : 0;
    }

    private function departmentCode(string $department): string
    {
        return match ($department) {
            'HR' => 'HR',
            'Finance' => 'FIN',
            'ICT' => 'ICT',
            'Legal' => 'LEG',
            'Operations' => 'OPS',
            'Sales' => 'SAL',
            'Procurement' => 'PRC',
            'Customer Service' => 'CSV',
            default => strtoupper(substr(preg_replace('/[^A-Za-z]/', '', $department) ?: 'DPT', 0, 4)),
        };
    }

    private function organizations(): array
    {
        return [
            ['name' => 'Providence Human Capital', 'code' => 'PHC', 'branch_city' => 'Bulawayo'],
            ['name' => 'Delta Corporation Limited', 'code' => 'DELTA', 'branch_city' => 'Gweru'],
            ['name' => 'Econet Wireless Zimbabwe Limited', 'code' => 'ECONET', 'branch_city' => 'Mutare'],
            ['name' => 'Innscor Africa Limited', 'code' => 'INNSCOR', 'branch_city' => 'Bulawayo'],
            ['name' => 'Meikles Limited', 'code' => 'MEIKLES', 'branch_city' => 'Masvingo'],
            ['name' => 'National Foods Holdings Limited', 'code' => 'NATFOODS', 'branch_city' => 'Kadoma'],
            ['name' => 'OK Zimbabwe Limited', 'code' => 'OKZ', 'branch_city' => 'Chinhoyi'],
            ['name' => 'Seed Co International Limited', 'code' => 'SEEDCO', 'branch_city' => 'Kwekwe'],
            ['name' => 'Simbisa Brands Limited', 'code' => 'SIMBISA', 'branch_city' => 'Bulawayo'],
            ['name' => 'CBZ Holdings Limited', 'code' => 'CBZ', 'branch_city' => 'Mutare'],
            ['name' => 'FBC Holdings Limited', 'code' => 'FBC', 'branch_city' => 'Gweru'],
            ['name' => 'NMBZ Holdings Limited', 'code' => 'NMBZ', 'branch_city' => 'Masvingo'],
            ['name' => 'ZB Financial Holdings Limited', 'code' => 'ZBFH', 'branch_city' => 'Kadoma'],
            ['name' => 'Dairibord Holdings Limited', 'code' => 'DAIRI', 'branch_city' => 'Kwekwe'],
            ['name' => 'Zimplow Holdings Limited', 'code' => 'ZIMPLOW', 'branch_city' => 'Chinhoyi'],
            ['name' => 'First Mutual Holdings Limited', 'code' => 'FMHL', 'branch_city' => 'Mutare'],
            ['name' => 'CFI Holdings Limited', 'code' => 'CFI', 'branch_city' => 'Bulawayo'],
        ];
    }

    private function positionTemplates(): array
    {
        return [
            'HR' => [['name' => 'HR Manager'], ['name' => 'HR Officer'], ['name' => 'Recruitment Specialist']],
            'Finance' => [['name' => 'Finance Manager'], ['name' => 'Accountant'], ['name' => 'Payroll Officer']],
            'ICT' => [['name' => 'IT Manager'], ['name' => 'Systems Administrator'], ['name' => 'Software Developer']],
            'Legal' => [['name' => 'Legal Counsel'], ['name' => 'Compliance Officer'], ['name' => 'Records Officer']],
            'Operations' => [['name' => 'Operations Manager'], ['name' => 'Operations Supervisor'], ['name' => 'Shift Coordinator']],
            'Sales' => [['name' => 'Sales Manager'], ['name' => 'Sales Representative'], ['name' => 'Key Account Officer']],
            'Procurement' => [['name' => 'Procurement Manager'], ['name' => 'Procurement Officer'], ['name' => 'Stores Controller']],
            'Customer Service' => [['name' => 'Customer Service Lead'], ['name' => 'Call Centre Agent'], ['name' => 'Client Liaison Officer']],
        ];
    }

    private function firstNames(): array
    {
        return [
            'Tafadzwa', 'Tendai', 'Tatenda', 'Rutendo', 'Nyasha', 'Simbarashe', 'Kudzai', 'Rumbidzai',
            'Anesu', 'Panashe', 'Kundai', 'Farai', 'Tariro', 'Chipo', 'Rudo', 'Rumbie',
            'Munashe', 'Shamiso', 'Vimbai', 'Nomsa', 'Nokuthula', 'Sipho', 'Sibusiso', 'Nompilo',
            'Loveness', 'Tanaka', 'Tafara', 'Blessing', 'Prosper', 'Tinotenda', 'Tonderai', 'Tinashe',
            'Bridget', 'Sharon', 'Lindiwe', 'Lazarus', 'Tapiwa', 'Chenai', 'Nyaradzo', 'Ropafadzo',
            'Eunice', 'Fadzai', 'Memory', 'Petronella', 'Kudzaishe', 'Tinomuda', 'Mufaro', 'Takudzwa',
            'Chiedza', 'Kudakwashe', 'Prudence', 'Unesu', 'Amos', 'Brian', 'Shingirai', 'Neville',
            'Mthokozisi', 'Nqobile', 'Thandeka', 'Sithembiso', 'Mlondolozi',
        ];
    }

    private function middleNames(): array
    {
        return [
            'Tendekai', 'Munashe', 'Kudzanai', 'Ruvimbo', 'Shamiso', 'Tonderai', 'Tafadzwa',
            'Nomusa', 'Nokukhanya', 'Tatenda', 'Mufaro', 'Rangarirai', 'Lungile', 'Nyaradzo',
            'Tsitsi', 'Ropafadzo', 'Tariro', 'Runyararo', 'Khumbulani', 'Pride', 'Anotida', 'Rutendo',
        ];
    }

    private function surnames(): array
    {
        return [
            'Moyo', 'Ndlovu', 'Dube', 'Sibanda', 'Mhlanga', 'Mpofu', 'Ncube', 'Nyoni',
            'Mugabe', 'Chikore', 'Muchengeti', 'Mushonga', 'Mushore', 'Muringai', 'Mutasa', 'Mupfumi',
            'Chirisa', 'Chikowore', 'Gumbo', 'Matanhire', 'Mlambo', 'Mubaiwa', 'Chiwenga', 'Maregere',
            'Shava', 'Maphosa', 'Muzenda', 'Chitando', 'Munyati', 'Mawarire', 'Mhari', 'Mandaza',
            'Mabaso', 'Zhou', 'Mupfurutsa', 'Chirume', 'Mushayabasa', 'Munyonga', 'Kamwendo', 'Mavhunga',
            'Chigumira', 'Marufu', 'Mushambi', 'Jani', 'Mhlophe', 'Nkomo', 'Nhema', 'Masuku',
            'Mare', 'Hove', 'Nyamukapa', 'Mataranyika', 'Munyoro', 'Chuma', 'Muzvidziwa', 'Taruvinga',
            'Chibaya', 'Mhanda', 'Matongo', 'Makoni', 'Madziva', 'Munyadzwe', 'Musona', 'Marecha',
        ];
    }
}
