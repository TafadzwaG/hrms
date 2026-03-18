<?php

namespace Database\Seeders;

use App\Models\Benefit;
use App\Models\BenefitChangeLog;
use App\Models\BenefitContributionRule;
use App\Models\BenefitPlan;
use App\Models\Employee;
use App\Models\EmployeeBenefitDependant;
use App\Models\EmployeeBenefitEnrollment;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class BenefitsManagementSeeder extends Seeder
{
    public function run(): void
    {
        $faker = fake();

        $defaultOrganizationId = Schema::hasTable('organizations')
            ? DB::table('organizations')->orderBy('id')->value('id')
            : null;

        if (! $defaultOrganizationId) {
            $this->command?->warn('No organization found. Seed organizations first.');
            return;
        }

        $employees = Employee::query()
            ->where('organization_id', $defaultOrganizationId)
            ->where('status', 'ACTIVE')
            ->pluck('id')
            ->all();

        if (empty($employees)) {
            $this->command?->warn('No active employees found. Seed employees first.');
            return;
        }

        $adminUser = User::query()
            ->where('current_organization_id', $defaultOrganizationId)
            ->first();

        $adminUserId = $adminUser?->id;

        DB::transaction(function () use ($faker, $defaultOrganizationId, $employees, $adminUserId) {
            $now = now();

            // -- Benefits ------------------------------------------------
            $benefits = $this->seedBenefits($defaultOrganizationId, $adminUserId, $now);
            $this->command?->info('Seeded ' . count($benefits) . ' benefits.');

            // -- Benefit Plans -------------------------------------------
            $plans = $this->seedPlans($defaultOrganizationId, $benefits, $now);
            $this->command?->info('Seeded ' . count($plans) . ' benefit plans.');

            // -- Contribution Rules --------------------------------------
            $rules = $this->seedContributionRules($defaultOrganizationId, $benefits, $now);
            $this->command?->info('Seeded ' . count($rules) . ' contribution rules.');

            // -- Employee Enrollments ------------------------------------
            $enrollmentCount = $this->seedEnrollments(
                $defaultOrganizationId,
                $benefits,
                $plans,
                $employees,
                $adminUserId,
                $faker,
                $now
            );
            $this->command?->info('Created ' . $enrollmentCount . ' employee benefit enrollments.');

            // -- Dependants ----------------------------------------------
            $dependantCount = $this->seedDependants(
                $defaultOrganizationId,
                $benefits,
                $employees,
                $faker,
                $now
            );
            $this->command?->info('Created ' . $dependantCount . ' benefit dependants.');
        });

        $this->command?->info('BenefitsManagementSeeder completed successfully.');
    }

    // -- Benefits --------------------------------------------------------

    private function seedBenefits(int $organizationId, ?int $adminUserId, $now): array
    {
        $benefitData = [
            [
                'code' => 'MED-AID',
                'name' => 'Medical Aid',
                'category' => 'health',
                'description' => 'Company medical aid scheme covering employees and dependants',
                'benefit_type' => 'shared',
                'taxable' => false,
                'cash_benefit' => false,
                'employer_funded' => true,
                'employee_funded' => true,
                'shared_contribution' => true,
                'requires_dependants' => true,
                'requires_plan_selection' => true,
                'payroll_deductible' => true,
            ],
            [
                'code' => 'PENSION',
                'name' => 'Pension Fund',
                'category' => 'retirement',
                'description' => 'Company pension fund for retirement savings',
                'benefit_type' => 'shared',
                'taxable' => false,
                'cash_benefit' => false,
                'employer_funded' => true,
                'employee_funded' => true,
                'shared_contribution' => true,
                'requires_dependants' => false,
                'requires_plan_selection' => false,
                'payroll_deductible' => true,
            ],
            [
                'code' => 'GLA',
                'name' => 'Group Life Assurance',
                'category' => 'insurance',
                'description' => 'Group life assurance cover for all employees',
                'benefit_type' => 'employer_paid',
                'taxable' => true,
                'cash_benefit' => false,
                'employer_funded' => true,
                'employee_funded' => false,
                'shared_contribution' => false,
                'requires_dependants' => false,
                'requires_plan_selection' => false,
                'payroll_deductible' => false,
            ],
            [
                'code' => 'FUN-CVR',
                'name' => 'Funeral Cover',
                'category' => 'insurance',
                'description' => 'Funeral cover for employees and dependants',
                'benefit_type' => 'shared',
                'taxable' => false,
                'cash_benefit' => false,
                'employer_funded' => true,
                'employee_funded' => true,
                'shared_contribution' => true,
                'requires_dependants' => true,
                'requires_plan_selection' => true,
                'payroll_deductible' => true,
            ],
            [
                'code' => 'HSG-ALW',
                'name' => 'Housing Allowance',
                'category' => 'allowance',
                'description' => 'Monthly housing allowance for eligible employees',
                'benefit_type' => 'employer_paid',
                'taxable' => true,
                'cash_benefit' => true,
                'employer_funded' => true,
                'employee_funded' => false,
                'shared_contribution' => false,
                'requires_dependants' => false,
                'requires_plan_selection' => false,
                'payroll_deductible' => false,
            ],
            [
                'code' => 'TRN-ALW',
                'name' => 'Transport Allowance',
                'category' => 'allowance',
                'description' => 'Monthly transport allowance for eligible employees',
                'benefit_type' => 'employer_paid',
                'taxable' => true,
                'cash_benefit' => true,
                'employer_funded' => true,
                'employee_funded' => false,
                'shared_contribution' => false,
                'requires_dependants' => false,
                'requires_plan_selection' => false,
                'payroll_deductible' => false,
            ],
            [
                'code' => 'EDU-AST',
                'name' => 'Education Assistance',
                'category' => 'education',
                'description' => 'Education assistance and tuition reimbursement programme',
                'benefit_type' => 'reimbursement',
                'taxable' => false,
                'cash_benefit' => true,
                'employer_funded' => true,
                'employee_funded' => false,
                'shared_contribution' => false,
                'requires_dependants' => false,
                'requires_plan_selection' => false,
                'payroll_deductible' => false,
            ],
            [
                'code' => 'WELL-PR',
                'name' => 'Wellness Programme',
                'category' => 'wellness',
                'description' => 'Employee wellness and health programme',
                'benefit_type' => 'non_cash',
                'taxable' => false,
                'cash_benefit' => false,
                'employer_funded' => true,
                'employee_funded' => false,
                'shared_contribution' => false,
                'requires_dependants' => false,
                'requires_plan_selection' => false,
                'payroll_deductible' => false,
            ],
            [
                'code' => 'STF-LN',
                'name' => 'Staff Loan Facility',
                'category' => 'loan',
                'description' => 'Staff loan facility with payroll deduction',
                'benefit_type' => 'employee_paid',
                'taxable' => false,
                'cash_benefit' => false,
                'employer_funded' => false,
                'employee_funded' => true,
                'shared_contribution' => false,
                'requires_dependants' => false,
                'requires_plan_selection' => true,
                'payroll_deductible' => true,
            ],
            [
                'code' => 'LNG-SVC',
                'name' => 'Long Service Award',
                'category' => 'other',
                'description' => 'Long service recognition awards for loyal employees',
                'benefit_type' => 'employer_paid',
                'taxable' => true,
                'cash_benefit' => true,
                'employer_funded' => true,
                'employee_funded' => false,
                'shared_contribution' => false,
                'requires_dependants' => false,
                'requires_plan_selection' => false,
                'payroll_deductible' => false,
            ],
        ];

        $benefitsByCode = [];

        foreach ($benefitData as $data) {
            $benefit = Benefit::withoutGlobalScopes()->updateOrCreate(
                ['organization_id' => $organizationId, 'code' => $data['code']],
                array_merge($data, [
                    'organization_id' => $organizationId,
                    'active' => true,
                    'effective_from' => '2025-01-01',
                    'effective_to' => null,
                    'metadata' => null,
                    'created_by' => $adminUserId,
                    'updated_by' => $adminUserId,
                ])
            );

            $benefitsByCode[$data['code']] = $benefit->id;
        }

        return $benefitsByCode;
    }

    // -- Benefit Plans ---------------------------------------------------

    private function seedPlans(int $organizationId, array $benefits, $now): array
    {
        $planData = [
            // Medical Aid plans
            [
                'benefit_code' => 'MED-AID',
                'name' => 'Executive Plan',
                'code' => 'MED-EXEC',
                'description' => 'Executive medical aid plan with comprehensive cover',
                'employer_contribution_type' => 'fixed',
                'employer_contribution_value' => 450.00,
                'employee_contribution_type' => 'fixed',
                'employee_contribution_value' => 150.00,
                'coverage_limit' => 50000.00,
            ],
            [
                'benefit_code' => 'MED-AID',
                'name' => 'Comprehensive Plan',
                'code' => 'MED-COMP',
                'description' => 'Comprehensive medical aid plan for middle management',
                'employer_contribution_type' => 'fixed',
                'employer_contribution_value' => 350.00,
                'employee_contribution_type' => 'fixed',
                'employee_contribution_value' => 120.00,
                'coverage_limit' => 30000.00,
            ],
            [
                'benefit_code' => 'MED-AID',
                'name' => 'Basic Plan',
                'code' => 'MED-BASIC',
                'description' => 'Basic medical aid plan for general staff',
                'employer_contribution_type' => 'fixed',
                'employer_contribution_value' => 200.00,
                'employee_contribution_type' => 'fixed',
                'employee_contribution_value' => 80.00,
                'coverage_limit' => 15000.00,
            ],
            // Funeral Cover plans
            [
                'benefit_code' => 'FUN-CVR',
                'name' => 'Family Cover',
                'code' => 'FUN-FAM',
                'description' => 'Funeral cover for employee and immediate family',
                'employer_contribution_type' => 'fixed',
                'employer_contribution_value' => 25.00,
                'employee_contribution_type' => 'fixed',
                'employee_contribution_value' => 15.00,
                'coverage_limit' => 5000.00,
            ],
            [
                'benefit_code' => 'FUN-CVR',
                'name' => 'Individual Cover',
                'code' => 'FUN-IND',
                'description' => 'Funeral cover for employee only',
                'employer_contribution_type' => 'fixed',
                'employer_contribution_value' => 15.00,
                'employee_contribution_type' => 'fixed',
                'employee_contribution_value' => 10.00,
                'coverage_limit' => 3000.00,
            ],
            // Staff Loan plans
            [
                'benefit_code' => 'STF-LN',
                'name' => '12-Month Loan',
                'code' => 'LN-12M',
                'description' => 'Staff loan repayable over 12 months',
                'employer_contribution_type' => null,
                'employer_contribution_value' => null,
                'employee_contribution_type' => null,
                'employee_contribution_value' => null,
                'coverage_limit' => 5000.00,
            ],
            [
                'benefit_code' => 'STF-LN',
                'name' => '24-Month Loan',
                'code' => 'LN-24M',
                'description' => 'Staff loan repayable over 24 months',
                'employer_contribution_type' => null,
                'employer_contribution_value' => null,
                'employee_contribution_type' => null,
                'employee_contribution_value' => null,
                'coverage_limit' => 10000.00,
            ],
        ];

        $plansByCode = [];

        foreach ($planData as $data) {
            $benefitCode = $data['benefit_code'];
            unset($data['benefit_code']);

            $benefitId = $benefits[$benefitCode] ?? null;
            if (! $benefitId) {
                continue;
            }

            $plan = BenefitPlan::withoutGlobalScopes()->updateOrCreate(
                ['organization_id' => $organizationId, 'code' => $data['code']],
                array_merge($data, [
                    'organization_id' => $organizationId,
                    'benefit_id' => $benefitId,
                    'active' => true,
                    'metadata' => null,
                ])
            );

            $plansByCode[$data['code']] = $plan->id;
        }

        return $plansByCode;
    }

    // -- Contribution Rules ----------------------------------------------

    private function seedContributionRules(int $organizationId, array $benefits, $now): array
    {
        $ruleData = [
            [
                'benefit_code' => 'PENSION',
                'rule_name' => 'Pension Fund Standard Rule',
                'contribution_basis' => 'salary',
                'employer_contribution_type' => 'percentage_of_basic',
                'employer_contribution_value' => 7.50,
                'employee_contribution_type' => 'percentage_of_basic',
                'employee_contribution_value' => 5.00,
            ],
            [
                'benefit_code' => 'GLA',
                'rule_name' => 'Group Life Assurance Rule',
                'contribution_basis' => 'salary',
                'employer_contribution_type' => 'percentage_of_basic',
                'employer_contribution_value' => 1.50,
                'employee_contribution_type' => 'fixed',
                'employee_contribution_value' => 0.00,
            ],
            [
                'benefit_code' => 'HSG-ALW',
                'rule_name' => 'Housing Allowance Fixed Rule',
                'contribution_basis' => 'fixed',
                'employer_contribution_type' => 'fixed',
                'employer_contribution_value' => 300.00,
                'employee_contribution_type' => 'fixed',
                'employee_contribution_value' => 0.00,
            ],
            [
                'benefit_code' => 'TRN-ALW',
                'rule_name' => 'Transport Allowance Fixed Rule',
                'contribution_basis' => 'fixed',
                'employer_contribution_type' => 'fixed',
                'employer_contribution_value' => 150.00,
                'employee_contribution_type' => 'fixed',
                'employee_contribution_value' => 0.00,
            ],
        ];

        $ruleIds = [];

        foreach ($ruleData as $data) {
            $benefitCode = $data['benefit_code'];
            unset($data['benefit_code']);

            $benefitId = $benefits[$benefitCode] ?? null;
            if (! $benefitId) {
                continue;
            }

            $rule = BenefitContributionRule::withoutGlobalScopes()->updateOrCreate(
                ['organization_id' => $organizationId, 'benefit_id' => $benefitId, 'rule_name' => $data['rule_name']],
                array_merge($data, [
                    'organization_id' => $organizationId,
                    'benefit_id' => $benefitId,
                    'benefit_plan_id' => null,
                    'min_value' => null,
                    'max_value' => null,
                    'effective_from' => '2025-01-01',
                    'effective_to' => null,
                    'active' => true,
                ])
            );

            $ruleIds[] = $rule->id;
        }

        return $ruleIds;
    }

    // -- Enrollments -----------------------------------------------------

    private function seedEnrollments(
        int   $organizationId,
        array $benefits,
        array $plans,
        array $employees,
        ?int  $adminUserId,
        $faker,
        $now
    ): int {
        $count = 0;
        $medPlanCodes = ['MED-EXEC', 'MED-COMP', 'MED-BASIC'];
        $funPlanCodes = ['FUN-FAM', 'FUN-IND'];

        foreach ($employees as $index => $employeeId) {
            $effectiveDate = $faker->dateTimeBetween('-2 years', '-1 month')->format('Y-m-d');

            // Medical Aid - distribute across plans
            $medPlanCode = $medPlanCodes[$index % count($medPlanCodes)];
            $medPlanId = $plans[$medPlanCode] ?? null;
            $medPlan = $medPlanId ? BenefitPlan::withoutGlobalScopes()->find($medPlanId) : null;

            $enrollment = EmployeeBenefitEnrollment::withoutGlobalScopes()->updateOrCreate(
                [
                    'organization_id' => $organizationId,
                    'employee_id' => $employeeId,
                    'benefit_id' => $benefits['MED-AID'],
                ],
                [
                    'organization_id' => $organizationId,
                    'employee_id' => $employeeId,
                    'benefit_id' => $benefits['MED-AID'],
                    'benefit_plan_id' => $medPlanId,
                    'status' => 'active',
                    'effective_date' => $effectiveDate,
                    'end_date' => null,
                    'employee_contribution' => $medPlan?->employee_contribution_value,
                    'employer_contribution' => $medPlan?->employer_contribution_value,
                    'payroll_deduction_code' => 'MED-AID',
                    'enrollment_reference' => 'MED-' . str_pad($index + 1, 4, '0', STR_PAD_LEFT),
                    'notes' => null,
                    'metadata' => null,
                    'created_by' => $adminUserId,
                    'updated_by' => $adminUserId,
                ]
            );

            BenefitChangeLog::query()->firstOrCreate(
                [
                    'employee_benefit_enrollment_id' => $enrollment->id,
                    'event' => 'enrolled',
                    'to_status' => 'active',
                ],
                [
                    'organization_id' => $organizationId,
                    'employee_benefit_enrollment_id' => $enrollment->id,
                    'event' => 'enrolled',
                    'from_status' => null,
                    'to_status' => 'active',
                    'from_values' => null,
                    'to_values' => null,
                    'reason' => 'Initial enrollment',
                    'changed_by' => $adminUserId,
                ]
            );
            $count++;

            // Pension Fund - all employees
            $pensionEnrollment = EmployeeBenefitEnrollment::withoutGlobalScopes()->updateOrCreate(
                [
                    'organization_id' => $organizationId,
                    'employee_id' => $employeeId,
                    'benefit_id' => $benefits['PENSION'],
                ],
                [
                    'organization_id' => $organizationId,
                    'employee_id' => $employeeId,
                    'benefit_id' => $benefits['PENSION'],
                    'benefit_plan_id' => null,
                    'status' => 'active',
                    'effective_date' => $effectiveDate,
                    'end_date' => null,
                    'employee_contribution' => 150.00,
                    'employer_contribution' => 225.00,
                    'payroll_deduction_code' => 'PENSION',
                    'enrollment_reference' => 'PEN-' . str_pad($index + 1, 4, '0', STR_PAD_LEFT),
                    'notes' => null,
                    'metadata' => null,
                    'created_by' => $adminUserId,
                    'updated_by' => $adminUserId,
                ]
            );

            BenefitChangeLog::query()->firstOrCreate(
                [
                    'employee_benefit_enrollment_id' => $pensionEnrollment->id,
                    'event' => 'enrolled',
                    'to_status' => 'active',
                ],
                [
                    'organization_id' => $organizationId,
                    'employee_benefit_enrollment_id' => $pensionEnrollment->id,
                    'event' => 'enrolled',
                    'from_status' => null,
                    'to_status' => 'active',
                    'from_values' => null,
                    'to_values' => null,
                    'reason' => 'Initial enrollment',
                    'changed_by' => $adminUserId,
                ]
            );
            $count++;

            // Transport Allowance - skip every 3rd employee
            if (($index + 1) % 3 !== 0) {
                $transportEnrollment = EmployeeBenefitEnrollment::withoutGlobalScopes()->updateOrCreate(
                    [
                        'organization_id' => $organizationId,
                        'employee_id' => $employeeId,
                        'benefit_id' => $benefits['TRN-ALW'],
                    ],
                    [
                        'organization_id' => $organizationId,
                        'employee_id' => $employeeId,
                        'benefit_id' => $benefits['TRN-ALW'],
                        'benefit_plan_id' => null,
                        'status' => 'active',
                        'effective_date' => $effectiveDate,
                        'end_date' => null,
                        'employee_contribution' => 0.00,
                        'employer_contribution' => 150.00,
                        'payroll_deduction_code' => null,
                        'enrollment_reference' => 'TRN-' . str_pad($index + 1, 4, '0', STR_PAD_LEFT),
                        'notes' => null,
                        'metadata' => null,
                        'created_by' => $adminUserId,
                        'updated_by' => $adminUserId,
                    ]
                );

                BenefitChangeLog::query()->firstOrCreate(
                    [
                        'employee_benefit_enrollment_id' => $transportEnrollment->id,
                        'event' => 'enrolled',
                        'to_status' => 'active',
                    ],
                    [
                        'organization_id' => $organizationId,
                        'employee_benefit_enrollment_id' => $transportEnrollment->id,
                        'event' => 'enrolled',
                        'from_status' => null,
                        'to_status' => 'active',
                        'from_values' => null,
                        'to_values' => null,
                        'reason' => 'Initial enrollment',
                        'changed_by' => $adminUserId,
                    ]
                );
                $count++;
            }

            // GLA - all employees
            $glaEnrollment = EmployeeBenefitEnrollment::withoutGlobalScopes()->updateOrCreate(
                [
                    'organization_id' => $organizationId,
                    'employee_id' => $employeeId,
                    'benefit_id' => $benefits['GLA'],
                ],
                [
                    'organization_id' => $organizationId,
                    'employee_id' => $employeeId,
                    'benefit_id' => $benefits['GLA'],
                    'benefit_plan_id' => null,
                    'status' => 'active',
                    'effective_date' => $effectiveDate,
                    'end_date' => null,
                    'employee_contribution' => 0.00,
                    'employer_contribution' => 45.00,
                    'payroll_deduction_code' => null,
                    'enrollment_reference' => 'GLA-' . str_pad($index + 1, 4, '0', STR_PAD_LEFT),
                    'notes' => null,
                    'metadata' => null,
                    'created_by' => $adminUserId,
                    'updated_by' => $adminUserId,
                ]
            );

            BenefitChangeLog::query()->firstOrCreate(
                [
                    'employee_benefit_enrollment_id' => $glaEnrollment->id,
                    'event' => 'enrolled',
                    'to_status' => 'active',
                ],
                [
                    'organization_id' => $organizationId,
                    'employee_benefit_enrollment_id' => $glaEnrollment->id,
                    'event' => 'enrolled',
                    'from_status' => null,
                    'to_status' => 'active',
                    'from_values' => null,
                    'to_values' => null,
                    'reason' => 'Initial enrollment',
                    'changed_by' => $adminUserId,
                ]
            );
            $count++;

            // Funeral Cover - first 8 employees, alternate family/individual
            if ($index < 8) {
                $funPlanCode = $funPlanCodes[$index % count($funPlanCodes)];
                $funPlanId = $plans[$funPlanCode] ?? null;
                $funPlan = $funPlanId ? BenefitPlan::withoutGlobalScopes()->find($funPlanId) : null;

                $funEnrollment = EmployeeBenefitEnrollment::withoutGlobalScopes()->updateOrCreate(
                    [
                        'organization_id' => $organizationId,
                        'employee_id' => $employeeId,
                        'benefit_id' => $benefits['FUN-CVR'],
                    ],
                    [
                        'organization_id' => $organizationId,
                        'employee_id' => $employeeId,
                        'benefit_id' => $benefits['FUN-CVR'],
                        'benefit_plan_id' => $funPlanId,
                        'status' => 'active',
                        'effective_date' => $effectiveDate,
                        'end_date' => null,
                        'employee_contribution' => $funPlan?->employee_contribution_value,
                        'employer_contribution' => $funPlan?->employer_contribution_value,
                        'payroll_deduction_code' => 'FUN-CVR',
                        'enrollment_reference' => 'FUN-' . str_pad($index + 1, 4, '0', STR_PAD_LEFT),
                        'notes' => null,
                        'metadata' => null,
                        'created_by' => $adminUserId,
                        'updated_by' => $adminUserId,
                    ]
                );

                BenefitChangeLog::query()->firstOrCreate(
                    [
                        'employee_benefit_enrollment_id' => $funEnrollment->id,
                        'event' => 'enrolled',
                        'to_status' => 'active',
                    ],
                    [
                        'organization_id' => $organizationId,
                        'employee_benefit_enrollment_id' => $funEnrollment->id,
                        'event' => 'enrolled',
                        'from_status' => null,
                        'to_status' => 'active',
                        'from_values' => null,
                        'to_values' => null,
                        'reason' => 'Initial enrollment',
                        'changed_by' => $adminUserId,
                    ]
                );
                $count++;
            }
        }

        // 1 suspended Wellness enrollment for history variety
        $wellnessEmployee = $employees[0];
        $wellnessEnrollment = EmployeeBenefitEnrollment::withoutGlobalScopes()->updateOrCreate(
            [
                'organization_id' => $organizationId,
                'employee_id' => $wellnessEmployee,
                'benefit_id' => $benefits['WELL-PR'],
            ],
            [
                'organization_id' => $organizationId,
                'employee_id' => $wellnessEmployee,
                'benefit_id' => $benefits['WELL-PR'],
                'benefit_plan_id' => null,
                'status' => 'suspended',
                'effective_date' => $faker->dateTimeBetween('-1 year', '-6 months')->format('Y-m-d'),
                'end_date' => null,
                'employee_contribution' => 0.00,
                'employer_contribution' => 0.00,
                'payroll_deduction_code' => null,
                'enrollment_reference' => 'WELL-0001',
                'notes' => 'Suspended pending programme review',
                'metadata' => null,
                'created_by' => $adminUserId,
                'updated_by' => $adminUserId,
            ]
        );

        BenefitChangeLog::query()->firstOrCreate(
            [
                'employee_benefit_enrollment_id' => $wellnessEnrollment->id,
                'event' => 'enrolled',
                'to_status' => 'active',
            ],
            [
                'organization_id' => $organizationId,
                'employee_benefit_enrollment_id' => $wellnessEnrollment->id,
                'event' => 'enrolled',
                'from_status' => null,
                'to_status' => 'active',
                'from_values' => null,
                'to_values' => null,
                'reason' => 'Initial enrollment',
                'changed_by' => $adminUserId,
            ]
        );

        BenefitChangeLog::query()->firstOrCreate(
            [
                'employee_benefit_enrollment_id' => $wellnessEnrollment->id,
                'event' => 'suspended',
                'to_status' => 'suspended',
            ],
            [
                'organization_id' => $organizationId,
                'employee_benefit_enrollment_id' => $wellnessEnrollment->id,
                'event' => 'suspended',
                'from_status' => 'active',
                'to_status' => 'suspended',
                'from_values' => null,
                'to_values' => null,
                'reason' => 'Programme under review',
                'changed_by' => $adminUserId,
            ]
        );
        $count++;

        return $count;
    }

    // -- Dependants ------------------------------------------------------

    private function seedDependants(
        int   $organizationId,
        array $benefits,
        array $employees,
        $faker,
        $now
    ): int {
        $count = 0;

        // Get Medical Aid enrollments
        $medEnrollments = EmployeeBenefitEnrollment::withoutGlobalScopes()
            ->where('organization_id', $organizationId)
            ->where('benefit_id', $benefits['MED-AID'])
            ->get();

        foreach ($medEnrollments as $index => $enrollment) {
            // Every other employee gets dependants
            if ($index % 2 !== 0) {
                continue;
            }

            $effectiveDate = $enrollment->effective_date->format('Y-m-d');

            // Spouse
            EmployeeBenefitDependant::withoutGlobalScopes()->updateOrCreate(
                [
                    'organization_id' => $organizationId,
                    'employee_benefit_enrollment_id' => $enrollment->id,
                    'relationship' => 'spouse',
                ],
                [
                    'organization_id' => $organizationId,
                    'employee_benefit_enrollment_id' => $enrollment->id,
                    'full_name' => $faker->name(),
                    'relationship' => 'spouse',
                    'date_of_birth' => $faker->dateTimeBetween('-50 years', '-25 years')->format('Y-m-d'),
                    'national_id' => strtoupper($faker->bothify('##-######-?-##')),
                    'contact_number' => $faker->phoneNumber(),
                    'effective_date' => $effectiveDate,
                    'end_date' => null,
                    'status' => 'active',
                    'notes' => null,
                ]
            );
            $count++;

            // 1 or 2 children
            $childCount = $faker->numberBetween(1, 2);
            for ($c = 0; $c < $childCount; $c++) {
                EmployeeBenefitDependant::withoutGlobalScopes()->updateOrCreate(
                    [
                        'organization_id' => $organizationId,
                        'employee_benefit_enrollment_id' => $enrollment->id,
                        'relationship' => 'child',
                        'full_name' => $childName = $faker->firstName() . ' ' . $faker->lastName(),
                    ],
                    [
                        'organization_id' => $organizationId,
                        'employee_benefit_enrollment_id' => $enrollment->id,
                        'full_name' => $childName,
                        'relationship' => 'child',
                        'date_of_birth' => $faker->dateTimeBetween('-18 years', '-1 year')->format('Y-m-d'),
                        'national_id' => null,
                        'contact_number' => null,
                        'effective_date' => $effectiveDate,
                        'end_date' => null,
                        'status' => 'active',
                        'notes' => null,
                    ]
                );
                $count++;
            }
        }

        return $count;
    }
}
