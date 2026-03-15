<?php

namespace App\Support\Payroll;

class PayrollTaxService
{
    public function calculatePaye(float $taxableIncome): float
    {
        $remaining = max(0, $taxableIncome);
        $lowerBound = 0.0;
        $tax = 0.0;

        foreach (config('payroll.tax.bands', []) as $band) {
            $upperBound = $band['up_to'];
            $rateValue = (float) ($band['rate'] ?? 0);
            $rate = $rateValue > 1 ? $rateValue / 100 : $rateValue;
            $base = (float) ($band['base'] ?? 0);

            if ($upperBound === null || $remaining <= $upperBound) {
                $bandTaxable = max(0, $remaining - $lowerBound);

                return round($base + ($bandTaxable * $rate), 2);
            }

            $lowerBound = (float) $upperBound;
            $tax += $base;
        }

        return round($tax, 2);
    }
}
