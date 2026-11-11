<?php

namespace App\Support\Payroll;

use App\Models\Benefit;
use App\Models\BenefitPlan;
use App\Models\EmployeeBenefitDependant;
use App\Models\EmployeeBenefitEnrollment;
use App\Models\PayrollPeriod;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

/**
 * Turns active benefit enrolments into payroll lines, so medical aid, funeral cover and
 * other schemes are set up once in Benefits and deducted automatically.
 *
 * Only benefits with a payroll type other than NONE reach payroll.
 *
 * Contributions come from the plan's rates per covered person when the plan has them
 * (member, spouse, child, other dependant), less the employer's share. Otherwise the
 * fixed employee and employer amounts on the enrolment are used.
 *
 * Medical aid is split between immediate family (member, spouse, children under 18,
 * student children), which earns the 50% medical credit, and other dependants, which
 * does not. The employer's share becomes an employer-cost line.
 */
class BenefitPayrollService
{
    /** Pay codes per payroll type: employee family share, employee other share, employer share. */
    public const CODES = [
        'MEDICAL' => ['family' => 'MED', 'other' => 'MEDD', 'employer' => 'MED_ER'],
        'FUNERAL' => ['family' => 'FUN', 'other' => 'FUN', 'employer' => 'FUN_ER'],
        'OTHER' => ['family' => 'BEN', 'other' => 'BEN', 'employer' => 'BEN_ER'],
    ];

    /** Children count as immediate family below this age, or while students below the student age. */
    private const CHILD_AGE = 18;

    private const STUDENT_AGE = 25;

    /**
     * @return array<int, array<int, array{code: string, amount: float, metadata: array<string, mixed>}>> lines per employee id
     */
    public function linesFor(PayrollPeriod $period, Collection $employeeIds): array
    {
        $start = Carbon::parse($period->period_start)->startOfDay();
        $end = Carbon::parse($period->period_end)->endOfDay();

        $enrollments = EmployeeBenefitEnrollment::query()
            ->withoutGlobalScopes()
            ->where('organization_id', $period->organization_id)
            ->whereIn('employee_id', $employeeIds)
            ->where('status', 'active')
            ->whereDate('effective_date', '<=', $end->toDateString())
            ->where(fn ($query) => $query->whereNull('end_date')->orWhereDate('end_date', '>=', $start->toDateString()))
            ->whereHas('benefit', fn ($query) => $query->withoutGlobalScopes()->where('payroll_type', '!=', 'NONE')->where('active', true))
            ->with([
                'benefit' => fn ($query) => $query->withoutGlobalScopes(),
                'benefitPlan' => fn ($query) => $query->withoutGlobalScopes(),
                'dependants' => fn ($query) => $query->withoutGlobalScopes(),
            ])
            ->get();

        $lines = [];

        foreach ($enrollments as $enrollment) {
            foreach ($this->linesForEnrollment($enrollment, $end) as $line) {
                $lines[(int) $enrollment->employee_id][] = $line;
            }
        }

        return $lines;
    }

    /**
     * @return array<int, array{code: string, amount: float, metadata: array<string, mixed>}>
     */
    public function linesForEnrollment(EmployeeBenefitEnrollment $enrollment, Carbon $asAt): array
    {
        /** @var Benefit $benefit */
        $benefit = $enrollment->benefit;
        $codes = self::CODES[$benefit->payroll_type] ?? null;

        if (! $codes) {
            return [];
        }

        $split = $this->contributions($enrollment, $asAt);
        $base = [
            'enrollment_id' => $enrollment->id,
            'benefit_id' => $benefit->id,
            'benefit' => $benefit->name,
            'plan' => $enrollment->benefitPlan?->name,
            'basis' => $split['basis'],
            'members' => $split['members'],
        ];

        // Payroll deduction code on the enrolment, if it names a real pay code, wins for OTHER benefits.
        if ($benefit->payroll_type === 'OTHER' && ! blank($enrollment->payroll_deduction_code)) {
            $codes['family'] = $codes['other'] = strtoupper((string) $enrollment->payroll_deduction_code);
        }

        $lines = [];

        if ($codes['family'] === $codes['other']) {
            $employee = round($split['employee_family'] + $split['employee_other'], 2);

            if ($employee > 0) {
                $lines[] = ['code' => $codes['family'], 'amount' => $employee, 'metadata' => $base];
            }
        } else {
            if ($split['employee_family'] > 0) {
                $lines[] = ['code' => $codes['family'], 'amount' => $split['employee_family'], 'metadata' => [...$base, 'portion' => 'family']];
            }

            if ($split['employee_other'] > 0) {
                $lines[] = ['code' => $codes['other'], 'amount' => $split['employee_other'], 'metadata' => [...$base, 'portion' => 'other_dependants']];
            }
        }

        if ($split['employer'] > 0) {
            $lines[] = ['code' => $codes['employer'], 'amount' => $split['employer'], 'metadata' => $base];
        }

        return $lines;
    }

    /**
     * @return array{basis: string, members: array<string, int>, employee_family: float, employee_other: float, employer: float}
     */
    public function contributions(EmployeeBenefitEnrollment $enrollment, Carbon $asAt): array
    {
        /** @var BenefitPlan|null $plan */
        $plan = $enrollment->benefitPlan;

        if (! $plan || $plan->rate_member === null) {
            // Fixed amounts on the enrolment, all treated as immediate family.
            return [
                'basis' => 'ENROLMENT_AMOUNTS',
                'members' => ['member' => 1],
                'employee_family' => round((float) $enrollment->employee_contribution, 2),
                'employee_other' => 0.0,
                'employer' => round((float) $enrollment->employer_contribution, 2),
            ];
        }

        $members = ['member' => 1, 'spouse' => 0, 'child' => 0, 'other_dependant' => 0];

        $enrollment->dependants
            ->filter(fn (EmployeeBenefitDependant $dependant) => $this->coveredOn($dependant, $asAt))
            ->each(function (EmployeeBenefitDependant $dependant) use (&$members, $asAt): void {
                $members[$this->memberType($dependant, $asAt)]++;
            });

        $family = (float) $plan->rate_member
            + $members['spouse'] * (float) ($plan->rate_spouse ?? $plan->rate_member)
            + $members['child'] * (float) ($plan->rate_child ?? 0);
        $other = $members['other_dependant'] * (float) ($plan->rate_other_dependant ?? 0);
        $premium = $family + $other;

        $employer = match ($plan->employer_contribution_type) {
            'percentage' => $premium * (float) $plan->employer_contribution_value / 100,
            'fixed' => (float) $plan->employer_contribution_value,
            default => 0.0,
        };
        $employer = round(min($premium, max(0, $employer)), 2);
        $employeeTotal = round($premium - $employer, 2);

        // The employee's share is split between family and other dependants in proportion
        // to the premium, so the medical credit only follows the family part.
        $employeeFamily = $premium > 0 ? round($employeeTotal * $family / $premium, 2) : 0.0;

        return [
            'basis' => 'PLAN_RATES',
            'members' => $members,
            'employee_family' => $employeeFamily,
            'employee_other' => round($employeeTotal - $employeeFamily, 2),
            'employer' => $employer,
        ];
    }

    /**
     * spouse, child (under 18, or a student under 25) or other_dependant.
     */
    public function memberType(EmployeeBenefitDependant $dependant, Carbon $asAt): string
    {
        $relationship = strtolower((string) $dependant->relationship);

        if ($relationship === 'spouse') {
            return 'spouse';
        }

        if ($relationship === 'child') {
            $age = $dependant->date_of_birth ? Carbon::parse($dependant->date_of_birth)->diffInYears($asAt) : 0;

            if ($age < self::CHILD_AGE || ($dependant->is_student && $age < self::STUDENT_AGE)) {
                return 'child';
            }
        }

        return 'other_dependant';
    }

    private function coveredOn(EmployeeBenefitDependant $dependant, Carbon $asAt): bool
    {
        if (! in_array(strtolower((string) ($dependant->status ?? 'active')), ['active', ''], true)) {
            return false;
        }

        if ($dependant->effective_date && Carbon::parse($dependant->effective_date)->gt($asAt)) {
            return false;
        }

        return ! ($dependant->end_date && Carbon::parse($dependant->end_date)->lt($asAt->copy()->startOfMonth()));
    }
}
