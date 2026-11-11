<?php

namespace App\Support\Payroll;

use App\Models\EmployeePayrollProfile;
use App\Models\PayrollPeriod;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

/**
 * Who is in a period's payroll: one payroll profile per employee.
 *
 * - Active employees with an active profile effective at the period end.
 * - Leavers whose termination date falls inside the period, so their final pay (notice
 *   pay, leave payout, retrenchment package) can be processed in their exit month. Their
 *   profile may already be marked terminated or end on the termination date.
 */
class PayrollRoster
{
    /**
     * @return Collection<int, EmployeePayrollProfile> keyed by employee id
     */
    public static function profiles(PayrollPeriod $period, ?int $employeeId = null): Collection
    {
        $start = Carbon::parse($period->period_start)->startOfDay();
        $end = Carbon::parse($period->period_end)->endOfDay();

        return EmployeePayrollProfile::query()
            ->forOrganization((int) $period->organization_id)
            ->with(['employee.orgUnit', 'employee.position', 'employee.location'])
            ->when($employeeId, fn ($query) => $query->where('employee_id', $employeeId))
            ->where('active', true)
            ->whereDate('effective_from', '<=', $end->toDateString())
            ->where(fn ($query) => $query->whereNull('effective_to')->orWhereDate('effective_to', '>=', $start->toDateString()))
            ->orderByDesc('effective_from')
            ->get()
            ->unique('employee_id')
            ->filter(function (EmployeePayrollProfile $profile) use ($start, $end) {
                $employee = $profile->employee;

                if (! $employee) {
                    return false;
                }

                $terminated = $employee->termination_date
                    ? Carbon::parse($employee->termination_date)
                    : null;

                // A leaver is paid in the period they leave, and not after.
                if ($terminated && $terminated->betweenIncluded($start, $end)) {
                    return true;
                }

                if ($terminated && $terminated->lt($start)) {
                    return false;
                }

                $endsInPeriod = $profile->effective_to && Carbon::parse($profile->effective_to)->lt($end->copy()->startOfDay());

                return $employee->status === 'ACTIVE'
                    && $profile->employment_status === 'ACTIVE'
                    && ! $endsInPeriod;
            })
            ->keyBy('employee_id');
    }
}
