<?php

namespace App\Support\Payroll\Inputs;

use App\Models\EmployeePayrollProfile;
use App\Models\PayCode;

/**
 * The rate a line of hours or units is paid at.
 *
 * - HOURS codes: the employee's hourly rate times the code's multiplier. The OT code uses
 *   the employee's own overtime multiplier, as timesheet overtime does.
 * - UNITS codes (such as mileage): the rate entered on the line, else the code's default rate.
 */
class HourlyRateResolver
{
    /**
     * @return array{rate: float|null, error: string|null}
     */
    public function resolve(EmployeePayrollProfile $profile, PayCode $payCode, ?float $enteredRate = null): array
    {
        if ($payCode->unit === 'UNITS') {
            $rate = $enteredRate ?? ($payCode->default_rate !== null ? (float) $payCode->default_rate : null);

            return $rate === null
                ? ['rate' => null, 'error' => "{$payCode->code} has no default rate, so enter a rate on the line."]
                : ['rate' => round($rate, 4), 'error' => null];
        }

        $hourly = (float) ($profile->hourly_rate ?: ((float) $profile->basic_salary / max(1, (float) config('payroll.standard_monthly_hours', 173.33))));

        if ($hourly <= 0) {
            return ['rate' => null, 'error' => 'The employee has no hourly rate on their payroll profile.'];
        }

        $multiplier = $payCode->code === 'OT'
            ? max(1, (float) ($profile->overtime_multiplier ?: 1.5))
            : (float) ($payCode->rate_multiplier ?? 1);

        return ['rate' => round($hourly * $multiplier, 4), 'error' => null];
    }
}
