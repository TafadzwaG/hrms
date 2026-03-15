<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\EmployeePayrollProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class EmployeePayrollProfileSeeder extends Seeder
{
    public function run(): void
    {
        if (! Schema::hasTable('employees') || ! Schema::hasTable('employee_payroll_profiles')) {
            return;
        }

        $defaultCurrency = strtoupper((string) env('PAYROLL_PROFILE_DEFAULT_CURRENCY', config('payroll.default_currency', 'USD')));
        $defaultSalary = (float) env('PAYROLL_PROFILE_DEFAULT_SALARY', 1000);
        $standardMonthlyHours = (float) config('payroll.standard_monthly_hours', 173.33);
        $effectiveFromFallback = now()->startOfMonth()->toDateString();

        $created = 0;
        $skipped = 0;

        Employee::query()
            ->with('orgUnit')
            ->orderBy('id')
            ->chunkById(100, function ($employees) use ($defaultCurrency, $defaultSalary, $standardMonthlyHours, $effectiveFromFallback, &$created, &$skipped): void {
                foreach ($employees as $employee) {
                    $exists = EmployeePayrollProfile::query()
                        ->where('organization_id', $employee->organization_id)
                        ->where('employee_id', $employee->id)
                        ->exists();

                    if ($exists) {
                        $skipped++;
                        continue;
                    }

                    $basicSalary = $this->resolveBasicSalary((string) $employee->pay_point, $defaultSalary);
                    $hourlyRate = $standardMonthlyHours > 0 ? round($basicSalary / $standardMonthlyHours, 2) : null;
                    $employmentStatus = $this->mapEmploymentStatus((string) $employee->status);
                    $isActive = $employmentStatus === 'ACTIVE';

                    DB::transaction(function () use ($employee, $defaultCurrency, $basicSalary, $hourlyRate, $employmentStatus, $isActive, $effectiveFromFallback): void {
                        EmployeePayrollProfile::query()->create([
                            'organization_id' => $employee->organization_id,
                            'employee_id' => $employee->id,
                            'pay_frequency' => 'MONTHLY',
                            'currency' => $defaultCurrency,
                            'basic_salary' => $basicSalary,
                            'hourly_rate' => $hourlyRate,
                            'overtime_multiplier' => 1.5,
                            'bank_account_name' => $employee->full_name,
                            'cost_centre' => $employee->orgUnit?->name,
                            'employment_status' => $employmentStatus,
                            'tax_enabled' => true,
                            'active' => $isActive,
                            'effective_from' => optional($employee->hire_date)->toDateString() ?: $effectiveFromFallback,
                            'notes' => 'Seeded default payroll profile.',
                        ]);
                    });

                    $created++;
                }
            });

        $this->command?->info("Employee payroll profiles seeded. Created: {$created}. Skipped existing: {$skipped}.");
    }

    private function resolveBasicSalary(string $payPoint, float $defaultSalary): float
    {
        return match (strtolower(trim($payPoint))) {
            'head office' => 1500.00,
            'staffing solutions' => 1200.00,
            'health' => 1100.00,
            'consultancy' => 1800.00,
            default => $defaultSalary,
        };
    }

    private function mapEmploymentStatus(string $status): string
    {
        return match (strtoupper(trim($status))) {
            'ACTIVE' => 'ACTIVE',
            'SUSPENDED' => 'SUSPENDED',
            'TERMINATED' => 'TERMINATED',
            default => 'INACTIVE',
        };
    }
}
